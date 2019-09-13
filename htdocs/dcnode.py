#!/usr/bin/python

import web, os, json, shelve, random, datetime, time
from common import gen_id
from tape import Tape, TapeHandler


tape=Tape('tape.json')
TapeHandler.Tape=tape

urls=(
	'/', 'Index',
    '/(.*\.html)', 'Static',
	'/(.*\.js)', 'Static',
	'/(.*\.css)', 'Static',
	'/users.php', 'Users',
	'/dreams.php', 'Dreams',
	'/tape.php', 'TapeHandler',
	'/point(.*)', 'Point',
	'/j/(.*)', 'JsApi'
)

def get_node_info():
	return {
		"0": {
			"type": "public_key",
			"data": json.loads(open("node_id.json").read())['public_key']
		},
		"1": {
			"type": "node_name",
			"node_name": "Anode"
		}
	}

def js(obj):
	web.header('Content-type',
		'application/javascript; charset=utf-8')
	return json.dumps(obj)

class JsApi:
	def GET(self, path):
		if path=='':
			return js(_node.read_chan(_node.get_root_cid()))

		return 'haha: ' + path

def _log(*args):
	msg=unicode(str(datetime.datetime.now()))
	try:
		msg += ' %s' % web.ctx['ip']
	except KeyError:
		pass
	try:
		msg+=' @%s' % udb.uname(session['logged_in_user_id'])
	except NameError:
		pass
	except KeyError:
		pass
	for arg in args:
		try:
			msg += u' %s' % json.dumps(arg, ensure_ascii=False)
		except ValueError:
			msg += u' <%s>' % repr(arg)
	msg+=u'\n'

	open('main.log', 'a').write(msg.encode('utf-8'))

_log('server start')

web.config.debug=False
app=web.application(urls, globals())
#session=web.session.Session(app, web.session.DiskStore('sessions'))
session=web.session.Session(app, web.session.ShelfStore(
	shelve.open('sessions.shelf')))

def utouch(location, uid=None):
	if uid is not None:
		tape.submit_event({
			'type': 'user_active',
			'user_id': uid,
			'username': udb.uname(uid),
			'location': location
		})
	else:
		tape.submit_event({
			'type': 'anonymous_active',
			'location': location
		})

class DreamsDB:
	def __init__(self, path):
		_log('DreamsDB.__init__', path)
		self._path=path

	def update(self, uid, did, data):
		dreams=self.get_dreams(uid)
		assert did in dreams
		dreams[did]=data
		dump=json.dumps(dreams, indent=4, ensure_ascii=False,
			sort_keys=True)
		open(self.get_dreams_path(uid), 'w').write(dump.encode('utf-8'))
		_log('DreamsDB.update', uid, did, data)
	
	def post_comment(self, auid, did, cuid, comment):
		dreams=self.get_dreams(auid)
		assert did in dreams

		if 'comments' not in dreams[did]:
			dreams[did]['comments']=[]
		dreams[did]['comments'].append({
			'timestamp': int(time.mktime(
				datetime.datetime.now().timetuple())),
			'commenter_id': cuid,
			'text': comment
		})

		dump=json.dumps(dreams, indent=4, ensure_ascii=False,
			sort_keys=True)
		open(self.get_dreams_path(auid), 'w').write(dump.encode('utf-8'))
		_log('DreamsDB.post_comment', auid, did, cuid, comment)
		

	def add(self, uid, data):
		udreams=self.get_dreams(uid)
		did=gen_id(lambda x: x not in udreams)
		udreams[did]=data
		dump=json.dumps(udreams, indent=4, ensure_ascii=False,
			sort_keys=True)
		open(self.get_dreams_path(uid), 'w').write(dump.encode('utf-8'))
		_log('DreamsDB.add', uid, data, did)
		return did
	
	def delete(self, uid, did):
		udreams=self.get_dreams(uid)
		data=udreams[did]
		del udreams[did]
		dump=json.dumps(udreams, indent=4, ensure_ascii=False,
			sort_keys=True)
		open(self.get_dreams_path(uid), 'w').write(dump.encode('utf-8'))
		open('dreams_trash', 'a').write(json.dumps(data) + '\n')
		_log('DreamsDB.delete', uid, did, data)
		
	
	def dream_exists(self, uid, did):
		return did in self.get_dreams(uid)
	
	def get_dreams_count(self, uid):
		udreams=self.get_dreams(uid)
		return len(udreams)
	
	def get_dreams_path(self, uid):
		return os.path.join(self._path, uid)

	def get_ts(self, uid):
		try:
			return str(os.path.getmtime(self.get_dreams_path(uid)))
		except OSError:
			return None
	
	def update_all(self, uid, dreams):
		dump=json.dumps(dreams, indent=4, ensure_ascii=False,
			sort_keys=True)
		old_dreams=self.get_dreams(uid)
		open(self.get_dreams_path(uid), 'w').write(dump.encode('utf-8'))
		_log('DreamsDB.update_all', uid, dreams, old_dreams)

	def get_tsdreams(self, uid):
		try:
			udreams=json.loads(open(self.get_dreams_path(uid)).read())
			return {
				'timestamp': self.get_ts(uid),
				'dreams': udreams
			}
		except IOError:
			return {}
	
	def get_dreams(self, uid):
		try:
			udreams=json.loads(open(self.get_dreams_path(uid)).read())
			return udreams
		except IOError:
			return {}
	
	def get_dream(self, uid, did):
		return self.get_dreams(uid)[did]
		
ddb=DreamsDB('dreams')

class UsersDB:
	def __init__(self, path):
		_log('UsersDB.__init__', path)
		self._path=path
		self._uname_cache={}
	
	def uname(self, uid):
		if uid not in self._uname_cache:
			self._uname_cache[uid]=self.by_id(uid)['username']
		return self._uname_cache[uid]
	

	def register(self, username, salt, pass_hash, email=None):
		users=json.loads(open('users.json').read())
		for uid, info in users.iteritems():
			if info['username']==username:
				_log('UsersDB.register', username, salt, pass_hash, email,
					'error username taken')
				raise KeyError('Username %s is taken' % username)
			if email and info.get('email')==email:
				_log('UsersDB.register', username, salt, pass_hash, email,
					'error email taken')
				raise KeyError('Email %s is taken' % email)
		uid=gen_id(lambda x: x not in users)
		users[uid]={
			'username': username,
			'salt': salt,
			'pass_hash': pass_hash,
			'creation_timestamp': int(time.mktime(
				datetime.datetime.now().timetuple()))
		}
		if email:
			users[uid]['email']=email
		dump=json.dumps(users, indent=4, ensure_ascii=False, sort_keys=True)
		open('users.json', 'w').write(dump.encode('utf-8'))
		web.ctx.status='201 User Registered'
		_log('UsersDB.register', username, salt, pass_hash, email,
			'success', uid)
		return uid
		
	def update(self, uid, items):
		for key in items:
			if key not in ['email', 'pass_hash', 'salt']:
				_log('UsersDB.update', uid, items, 'error: invalid item',
					key)
				raise KeyError('Invalid item key: %s' % key)
		users=json.loads(open('users.json').read())
		if items.get('email'):
			for id, info in users.iteritems():
				if id==uid:
					continue
				if info.get('email')==items['email']:
					_log('UsersDB.update', uid, items, 'error: email taken',
						items.get('email'))
					raise ValueError('Email already taken')
		users[uid].update(items)
		dump=json.dumps(users, indent=4, ensure_ascii=False, sort_keys=True)
		open('users.json', 'w').write(dump.encode('utf-8'))
		users[uid]['user_id']=uid
		_log('UsersDB.update', uid, items, 'success')
		return json.dumps(users[uid])
		
	def by_name(self, username):
		users=json.loads(open('users.json').read())
		
		for k, v in users.iteritems():
			if v['username']==username:
				assert 'user_id' not in v
				v['user_id']=k
				return v

		_log('UsersDB.by_name', username, 'error: not found')
		raise KeyError('Username not found', username)
	
	def by_id(self, uid):
		users=json.loads(open('users.json').read())
		users[uid]['user_id']=uid
		del users[uid]['pass_hash']
		del users[uid]['salt']
		return users[uid]
	
	def get_users(self, **kwargs):
		users=json.loads(open('users.json').read())
		for u in users:
			users[u]['user_id']=u
			del users[u]['pass_hash']
			del users[u]['salt']
		if kwargs.get('count_dreams'):
			for u in users:
				try:
					users[u]['total_dreams']=ddb.get_dreams_count(u)
					users[u]['user_id']=u
				except IOError:
					users[u]['total_dreams']=0
		return users
		
		

udb=UsersDB('users.json')

class Dreams:
	def GET(self):
		print "GET", web.input()
		if web.input().get('cmd')=='fetch':
			uid=web.input().get('user_id', session.get('logged_in_user_id'))
			did=web.input().get('dream_id')
			if did is not None:
				if not uid:
					web.ctx.status='400 Bad Request'
					_log('GET', 'dreams.php', web.input(),
						'error: user_id not set nor logged in')
					return 'user_id not set nor logged in'
				_log('GET', 'dreams.php', web.input(), '200 (dream)')
				try:
					return json.dumps(ddb.get_dream(uid, did))
				except KeyError:
					web.ctx.status='404 Dream Not Found'
			else:
				_log('GET', 'dreams.php', web.input(), '200 (dreams)')
				return json.dumps(ddb.get_tsdreams(uid))
		elif web.input().get('cmd')=='fetch_ts':
			uid=web.input().get('user_id')
			_log('GET', 'dreams.php', web.input(), '200 (fetched ts)')
			return ddb.get_ts(uid)
		elif web.input().get('cmd')=='delete':
			uid=session.get('logged_in_user_id')
			if not uid:
				web.ctx.status='403 Not Logged In'
				_log('GET', 'dreams.php', web.input(),
					'403 error: deleting while not logged in')
				return
			did=web.input().get('dream_id')
			if not did:
				web.ctx.status='400 Bad Request'
				_log('GET', 'dreams.php', web.input(),
					'400 error: dream id not specified')
				return
			if not ddb.dream_exists(uid, did):
				web.ctx.status='404 Dream Not Found'
				_log('GET', 'dreams.php', web.input(),
					'404 error: dream not found')
				return

			ddb.delete(uid, did)
			web.ctx.status='204 Dream Deleted'
			_log('GET', 'dreams.php', web.input(),
				'204 dream deleted')
			tape.submit_event({
				'type': 'dream_delete',
				'user_id': uid,
				'username': udb.uname(uid),
				'dream_id': did
			})
			return
		else:
			web.ctx.status='501 Not Implemented'
			_log('GET', 'dreams.php', web.input(),
				'501 error: NIMPL')
			return 'command not implemented: %s' % web.input().get('cmd')
	
	def POST(self):
		print web.data()
		req=json.loads(web.data())
		cmd=req['cmd']
		if cmd=='update':
			# ensure dream exists in current user
			if not session.get('logged_in_user_id'):
				web.ctx.status='403 Not Logged In'
				_log('POST', 'dreams.php', web.data(),
					'403 error: not logged in')
				return
			uid=session.get('logged_in_user_id')
			if not ddb.dream_exists(uid, req['dream_id']):
				web.ctx.status='404 Dream Not Found'
				_log('POST', 'dreams.php', web.data(),
					'404 error: dream not found')
				return '%s %s' % (uid, req['dream_id'])

			ddb.update(uid, req['dream_id'], req['data'])
			_log('POST', 'dreams.php', web.data(),
				'204 dream updated')
			web.ctx.status='204 Dream Updated'
			tape.submit_event({
				'type': 'dream_update',
				'user_id': uid,
				'username': udb.uname(uid),
				'dream_id': req['dream_id']
			})
			return
		elif cmd=='add':
			if not session.get('logged_in_user_id'):
				web.ctx.status='403 Not Logged In'
				_log('POST', 'dreams.php', web.data(),
					'403 error: not logged in')
				return
			uid=session.get('logged_in_user_id')
			did=ddb.add(uid, req['data'])
			web.ctx.status='201 Dream Added'
			_log('POST', 'dreams.php', web.data(),
				'201 dream added', did)
			tape.submit_event({
				'type': 'dream_add',
				'user_id': uid,
				'username': udb.uname(uid),
				'dream_id': did
			})
			return did
			
		elif cmd=='post_comment':
			if not session.get('logged_in_user_id'):
				web.ctx.status='403 Not Logged In'
				_log('POST', 'dreams.php', web.data(),
					'403 error: not logged in')
				return
			uid=session.get('logged_in_user_id')
			author_uid=req['dream_author_id']
			if not ddb.dream_exists(author_uid, req['dream_id']):
				web.ctx.status='404 Dream Not Found'
				_log('POST', 'dreams.php', web.data(),
					'404 error: dream not found')
				return '%s %s' % (uid, req['dream_id'])

			if req['comment_author_id']!=uid:
				web.ctx.status='403 Logged In As Different User'
				_log('POST', 'dreams.php', web.data(),
					'403 error: logged in as different user')
				return

			ddb.post_comment(author_uid, req['dream_id'], uid,
				req['comment']);
			tape.submit_event({
				'type': 'comment_dream',
				'dream_author_id': author_uid,
				'dream_author_username': udb.uname(author_uid),
				'comment_author_id': uid,
				'comment_author_username': udb.uname(uid),
				'dream_id': req['dream_id']
			})
			web.ctx.status='201 Commented'
			return
			
		else:
			web.ctx.status='501 Not Implemented'
			_log('POST', 'dreams.php', web.data(),
				'501 error: NIMPL')
			return 'Command: ' + cmd
		raise NotImplemented()

class Users:
	def GET(self):
		uid=session.get('logged_in_user_id')
		if web.input().get('cmd')=='logoff':
			if uid:
				tape.submit_event({
					'type': 'user_logoff',
					'user_id': uid,
					'username': udb.uname(uid)
				})
				del session['logged_in_user_id']
			web.ctx.status='204 Logged Off'
			_log('GET', 'users.php', web.input(),
				'204 logged off', uid)
			return
		elif web.input().get('cmd')=='get_user_info':
			if web.input().get('user_id'):
				info=udb.by_id(web.input().get('user_id'))
				info['user_id']=web.input().get('user_id')
				_log('GET', 'users.php', web.input(),
					'200 (user info by id)')
				return json.dumps(info)
			else:
				if not uid:
					web.ctx.status='204 No User'
					_log('GET', 'users.php', web.input(),
						'204 not logged in')
					return
				info=udb.by_id(uid)
				info['user_id']=uid
				_log('GET', 'users.php', web.input(),
					'200 (user info)')
				return json.dumps(info)
		elif web.input().get('cmd')=='get_users':
			_log('GET', 'users.php', web.input(),
				'200 (users)')
			return json.dumps(udb.get_users(count_dreams=True))
		else:
			_log('GET', 'users.php', web.input(),
				'501 error: NIMPL')
			web.ctx.status='501 Not Implemented'
			return
	
	def POST(self):
		req=json.loads(web.data())
		if req.get('cmd')=='get_salt':
			try:
				info=udb.by_name(req['username'])
			except KeyError:
				_log('POST', 'users.php', web.data(),
					'404 error: no user')
				web.ctx.status='404 User Not Found'
				return req['username']
			return json.dumps(info['salt'])
		elif req.get('cmd')=='login':
			info=udb.by_name(req['username'])
			if info['pass_hash']==req['pass_hash']:
				session['logged_in_user_id']=info['user_id']
				_log('POST', 'users.php', web.data(),
					'200 (user info)', info['username'])
				del info['pass_hash']
				del info['salt']
				tape.submit_event({
					'type': 'user_login',
					'user_id': info['user_id'],
					'username': info['username']
				})
				return json.dumps(info)
			else:
				_log('POST', 'users.php', web.data(),
					'403 error: invalid pass hash', info['username'])
				web.ctx.status='403 Invalid Credentials'
				return
		elif req.get('cmd')=='register':
			try:
				uid=udb.register(req['username'], req['salt'],
					req['pass_hash'], req.get('email'))
				_log('POST', 'users.php', web.data(),
					'200 error: invalid pass hash', req['username'])
				tape.submit_event({
					'type': 'user_add',
					'user_id': uid,
					'username': req['username']
				})
				return uid
			except KeyError as x:
				web.ctx.status='403 Username or email is taken'
				_log('POST', 'users.php', web.data(),
					'403 error: username or email taken', str(x))
				return str(x)
		elif req.get('cmd')=='update_profile':
			uid=session.get('logged_in_user_id')
			if not uid:
				web.ctx.status='403 Not Logged In'
				_log('POST', 'users.php', web.data(),
					'403 error: not logged in')
				return
			try:
				udb.update(uid, req['items'])
			except KeyError as x:
				web.ctx.status='400 Bad Request'
				_log('POST', 'users.php', web.data(),
					'400 error', str(x))
				return str(x)
			except ValueError as x:
				web.ctx.status='405 Conflict'
				_log('POST', 'users.php', web.data(),
					'405 error: conflict', str(x))
				return str(x)
			if req.get('dreams'):
				ddb.update_all(uid, req['dreams'])
				_log('POST', 'users.php', web.data(),
					'200 updated all dreams')
			tape.submit_event({
				'type': 'profile_update',
				'user_id': uid,
				'username': udb.uname(uid)
			})
			return
		else:
			web.ctx.status='400 Bad Command'
			_log('POST', 'users.php', web.data(),
				'405 error: bad command', req.get('cmd'))
			return json.dumps(req.get('cmd'))

class Point:
	def GET(self, path):
		_log('GET', 'Point', path, '200')
		if path=='':
			try:
				data=open('point/boot.html').read()
			except IOError:
				web.ctx.status='404 Point Not Found'
				return '404 Point Not Found'
			web.header('Content-Type', 'text/html; charset=utf-8')
			return data
		elif path=='/js':
			js_list=os.listdir('point')
			data=''
			for js in js_list:
				if not js.endswith('.js'):
					continue
				data+='// File: %s\n' % js + open('point/%s' % js).read()\
					+ '\n\n'
			web.header('Content-type',
				'application/javascript; charset=utf-8')
			return data
		else:
			web.ctx.status='400 Bad Request'
			return 'Invalid path: ' + path

class Static:
	def GET(self, path):
		try:
			print path
			if not os.path.realpath(path).startswith(
					os.path.realpath(os.getcwd())):
				web.ctx.status='400 Bad request'
				_log('GET', 'static', path,
					'400 error: path outside dir')
				return 'File %s is outside allowed directory'
			data=open(path).read()
			if path.endswith('.html'):
				web.header('Content-Type', 'text/html; charset=utf-8')
				_log('GET', 'static', path, '200 html')
				utouch(path, session.get('logged_in_user_id'))
				return data
			elif path.endswith('.js'):
				web.header('Content-Type', 
					'application/javascript; charset=utf-8')
				_log('GET', 'static', path, '200 javascript')
				return data
			elif path.endswith('.css'):
				web.header('Content-Type', 
					'text/css; charset=utf-8')
				_log('GET', 'static', path, '200 stylesheet')
				return data
			else:
				web.ctx.status='400 Bad Request'
				_log('GET', 'static', path, '400 error: invalid filetype',
					path)
				return 'Unexpected file type: ' + path
		except IOError as x:
			web.ctx.status='404 Not found'
			_log('GET', 'static', path, '404 error: path not found',
				str(x))
			return 'File (%s) read error: %s ' % (path, str(x))

class Index:
    def GET(self):
		_log('GET', '/', '303 see other', 'themes/plain/gate.html')
		raise web.seeother('themes/plain/gate.html')

if __name__=='__main__':
	try:
		app.run()
	finally:
		_log("server exit")
