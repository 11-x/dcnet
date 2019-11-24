#!/usr/bin/python
# -*- coding: utf-8 -*-

CERT_PATH='./cert/127.0.0.1.crt'
PRIVKEY_PATH='./cert/127.0.0.1.key'

import web, shelve, json, os
from crypto import *
from common import gen_id

urls=(
	'/', 'Boot',
	'/j', 'JIndex',
	'/j/', 'JIndex',
	'/j/([^/]+)', 'JChan',
	'/j/([^/]+)/([^/]+)', 'JItem',
	'/(htdocs/.+\.js)', 'Static',
	'/(htdocs/.+\.css)', 'Static',
	'/gate', 'Gate',
	'/register', 'Register',
	'/readme', 'Readme',
	'/home', 'Home',
	'/user/(.+)', 'User',
	'/chan/(.+)', 'Chan',
	'/item/(.+)', 'Item',
	'/selftest', 'SelfTest'
)

render=web.template.render('htdocs')

DEFAULT_REASON={
	200: 'OK',
	201: 'Created',
	204: 'No Content',
	400: 'Bad Request',
	404: 'Not Found',
	409: 'Conflict',
	501: 'Not Implemented'
}

def resp(code, **kwargs):
	'''
	Helper function, that constructs a HTTP response

	Content type is deduced from kwargs (see below).

	Parameter `code` - HTTP return code

	Optional kwarg:

		reason: HTTP reason. Will default to DEFAULT_REASON[code]

	Exactly one of the following kwargs must be defined (it defines
	the HTTP content-type header:

		text: text response (text/plain)

		json: an object to dump and return as JSON (application/javascript)
		NOTE: the object will be serialized with json.dumps.

		js: javascript (application/javascript)

		html: html response (text/html)

		data: binary data (application/octet-stream)
	
	Charset utf-8 is set for all content types except binary data and css.
	
	returns response data.
	'''
	assert 100<=code<=999
	if 'reason' in kwargs:
		reason=kwargs['reason']
		del kwargs['reason']
	else:
		reason=DEFAULT_REASON[code]

	web.ctx.status='%d %s' % (code, reason)

	if code==204:
		assert len(kwargs)==0
		return

	assert len(kwargs)==1

	if 'text' in kwargs:
		web.header('Content-Type', 'text/plain; charset=utf-8')
		return kwargs['text']
	elif 'js' in kwargs:
		web.header('Content-Type',
			'application/javascript; charset=utf-8')
		return kwargs['js']
	elif 'json' in kwargs:
		web.header('Content-Type',
			'application/javascript; charset=utf-8')
		return json.dumps(kwargs['json'])
#	elif 'html' in kwargs:
#		web.header('Content-Type',
#			'text/html; charset=utf-8')
#		return kwargs['html']
	elif 'css' in kwargs:
		web.header('Content-Type',
			'text/css')
		return kwargs['css']
	elif 'data' in kwargs:
		web.header('Content-Type',
			'application/octet-stream')
		return kwargs['data']
	else:
		raise NotImplementedError(kwargs.keys()[0])

class NotAuthorizedError(Exception):
	def __init__(self, *args, **kwargs):
		Exception.__init__(self, *args, **kwargs)

class BadRequest(Exception):
	def __init__(self, *args, **kwargs):
		Exception.__init__(self, *args, **kwargs)

class Conflict(Exception):
	def __init__(self, *args, **kwargs):
		Exception.__init__(self, *args, **kwargs)

class NotFound(Exception):
	def __init__(self, *args, **kwargs):
		Exception.__init__(self, *args, **kwargs)

def wrap_exceptions(handler):
	'''
	Request handlers decorator

	Wraps the following exceptions into valid HTTP responses:

	    NotImplementedError -> 501
		ValueError -> 400 (for invalid json)
		NotAuthorizedError -> 403
		BadRequest -> 400
	'''
	def safe_handler(*args, **kwargs):
		try:
			return handler(*args, **kwargs)
		except NotImplementedError as x:
			return resp(501, text='In %s: Not Implemented: %s' \
				% (repr(handler), x))
		except ValueError as x:
			return resp(400, text='Bad Request: %s' % x)
		except NotAuthorizedError as x:
			return resp(403, text='Not Authorized: %s' % x)
		except BadRequest as x:
			return resp(400, text='Bad Request: %s' % x)
		except Conflict as x:
			return resp(409, text='Conflict: %s' % x)
		except NotFound as x:
			return resp(404, text='Not Found: %s' % x)
	return safe_handler
			
def get_chans_ids():
	'''
	Get list of all channel ids
	'''
	return db.keys()

def get_items(cid):
	'''
	Get dict of all channel's items
	'''
	if cid not in db:
		if cid in ['.users', '.chans', '.nodes']:
			return {}
		if cid in db.get('.chans', {}):
			# chan has no content, but it is present in .chans
			# so we consider the channel existing and empty
			return {}
		raise NotFound('Channel not found: ' + cid);
	return db[cid]

class Static:
	@wrap_exceptions
	def GET(self, path):
		try:
			if not os.path.realpath(path).startswith(
					os.path.realpath(os.getcwd())):
				raise BadRequest('Bad path: %s' % path)

			if path.endswith('.js'):
				return resp(200, js=open(path).read())
#			elif path.endswith('.html'):
#				return resp(200, html=open(path).read())
			elif path.endswith('.css'):
				return resp(200, css=open(path).read())
			else:
				raise BadRequest()
		except IOError:
			raise web.notfound()

class Boot:
	@wrap_exceptions
	def GET(self):
		return render.boot()

class Gate:
	@wrap_exceptions
	def GET(self):
		return render.page(
			render.gate(render),
			width=200,
			title='Вход',
			scripts=['gate.js'], 
			onload='gate_onload();')

class Register:
	@wrap_exceptions
	def GET(self):
		return render.page(
			render.register(),
			width=200,
			title='Регистрация',
			scripts=['register.js'])

class Readme:
	@wrap_exceptions
	def GET(self):
		return render.page(
			render.readme(),
			width="80%")

def get_item_val(cid, iid):
	'''
	Get 'val' field of the item

	Raises NotFound if no cid or iid exist

	Raises KeyError if no 'val' field present (deleted item)
	'''
	if cid not in db:
		if cid not in ['.users', '.chans', '.nodes']:
			raise NotFound('Channel not found: ' + cid)
		else:
			raise NotFound('Item %s not found in channel %s' % (
				iid, cid))
	if iid not in db.get(cid, {}):
		raise NotFound('Item %s not found in channel %s' % (iid, cid))
	
	ndata=json.loads(db[cid][iid]['jndata'])
	data=json.loads(ndata['jdata'])
	return data['val'] # no 'val' field in deleted items causes KeyError

def get_items_val(cid):
	items=get_items(cid)
	res={}
	for iid in items:
		res[iid]=get_item_val(cid, iid)
	return res

def get_userinfo(uid):
	if uid is None:
		return None
	
	userinfo={'uid': uid}

	user_descriptor=get_item_val('.users', uid)

	if 'username' in user_descriptor:
		userinfo['username']=user_descriptor['username']

	return userinfo

def get_own_chans(uid):
	res={}
	for cid, desc in get_items_val('.chans').iteritems():
		if desc['owner']==uid:
			res[cid]=desc
	return res

class Home:
	@wrap_exceptions
	def GET(self):
		uid=web.input().get('self')
		own_chans_banners=[]
		self_suffix='?self=' + uid if uid else ''

		for cid, desc in get_own_chans(uid).iteritems():
			own_chans_banners.append(render.chan_banner(cid,
				desc['name'], desc['description'], self_suffix))
		return render.page(render.home(uid, own_chans_banners),
			width="80%",
			toolbar=render.toolbar(render, get_userinfo(uid)))

class JIndex:
	@wrap_exceptions
	def GET(self):
		return resp(200, json=get_chans_ids())

def validate_user_descriptor(val):
	if type(val)!=dict:
		raise BadRequest('Invalid user descriptor')
	for key in val:
		if key not in ['pub_key', 'priv_key', 'username', 'home']:
			raise BadRequest('Invalid key in descriptor: %s' % key)
	if 'pub_key' not in val:
		raise BadRequest('Public key missing in descriptor')
	
def validate_chan_descriptor(cd):
	if 'owner' not in cd:
		raise BadRequest('No owner specified')
	
	# Ensure user exists and is not deleted
	try:
		user_desc=get_item_val('.users', cd['owner'])
	except NotFound:
		raise BadRequest('Owner uid not found')
	except KeyError:
		raise BadRequest('User is deleted')
	
	# TODO: check if user is allowed to post

	for key in cd:
		if key not in ['owner', 'name', 'description']:
			raise BadRequest('Unexpected field: ' + key)

def verify_usig(data, uid, usig):
	'''
	Returns bool: true of signature is OK
	'''
	try:
		user_desc=get_item_val('.users', uid)
	except NotFound as x:
		return False

	return verify(data, user_desc['pub_key'], usig)

def post_chans(jdata, usig):
	'''
	An item is being posted to '.chans' channel
	'''
	data=json.loads(jdata)

	if data['cid']!='.chans':
		raise BadRequest('invalid cid')
	
	# Check user exists

	if 'val' not in data:
		raise BadRequest('no "val" in jdata')
	
	if 'owner' not in data['val']:
		raise BadRequest('no owner specified')
	
	owner=data['val']['owner']

	if owner not in db.get('.users', {}):
		raise BadRequest('Invalid owner uid')
	
	# Validate user signature

	if not verify_usig(jdata, owner, usig):
		raise BadRequest('Invalid signature')	

	# Verify channel descriptor

	validate_chan_descriptor(data.get('val'))

	# All seems ok, actually create

	# Generate cid
	cid=node_id + gen_id(lambda x: node_id+x not in db.get('.chans', {}))

	# Store descriptor

	ndata={
		'jdata': jdata,
		'usig': usig,
		'iid': cid
	}
	jndata=json.dumps(ndata)

	if '.chans' not in db:
		db['.chans']={}

	db['.chans'][cid]={
		'jndata': jndata,
		'nsig': sign(jndata, cfg['private_key'])
	}
	_flush_db()

	return resp(201, json=cid)

def put_users(uid, jdata, usig):
	'''
	An item is being modified in '.users' channel
	'''
	data=json.loads(jdata)

	if data['cid']!='.users':
		raise BadRequest('invalid cid')

	validate_user_descriptor(data.get('val'))
	
	pub_key=data['val']['pub_key']

	cur_desc=get_item_val('.users', uid)

	if cur_desc['pub_key'] != pub_key:
		raise BadRequest('public key cannot be changed')

	ndata={
		'jdata': jdata,
		'usig': usig
	}

	jndata=json.dumps(ndata)

	db['.users'][uid]={
		'jndata': jndata,
		'nsig': sign(jndata, cfg['private_key'])
	}
	_flush_db()

	return resp(204)

def post_users(jdata, usig):
	'''
	An item is being posted to '.users' channel
	'''
	data=json.loads(jdata)

	if data['cid']!='.users':
		raise BadRequest('invalid cid')

	validate_user_descriptor(data.get('val'))
	
	pub_key=data['val']['pub_key']
	username=data['val'].get('username')

	if not verify(jdata, pub_key, usig):
		raise BadRequest('Invalid signature')	

	# ensure there is no known user with private key or username

	for uid, uinfo in db.get('.users', {}).iteritems():
		ndata=json.loads(uinfo['jndata'])
		data=json.loads(ndata['jdata'])
		if data['val']['pub_key'] == pub_key:
			raise Conflict('Public key already taken')
		if username is None:
			continue
		if data['val'].get('username')==username:
			raise Conflict('Username already taken')

	user_id=get_user_id(pub_key)

	if user_id in db.get('.users', {}):
		raise Conflict('Public key hash collision')

	# all ok, create the user

	if '.users' not in db:
		db['.users']={}
	
	ndata={
		'jdata': jdata,
		'usig': usig,
		'iid': user_id
	}

	jndata=json.dumps(ndata)

	db['.users'][user_id]={
		'jndata': jndata,
		'nsig': sign(jndata, cfg['private_key'])
	}
	_flush_db()

	return resp(201, json=user_id)

class JChan:
	@wrap_exceptions
	def GET(self, cid):
		return resp(200, json=get_items(cid))
	
	@wrap_exceptions
	def POST(self, cid):
		try:
			req=json.loads(web.data())
		except ValueError:
			raise BadRequest('Not a JSON')

		if 'jdata' not in req:
			raise BadRequest("No 'jdata' field")
		try:
			json.loads(req['jdata'])
		except ValueError:
			raise BadRequest('Invalid jdata')
		if 'usig' not in req:
			raise BadRequest("No 'usig' field")

		if cid=='.users':
			return post_users(req['jdata'], req['usig'])
		elif cid=='.chans':
			return post_chans(req['jdata'], req['usig'])
		elif cid=='.nodes':
			return post_nodes()
		else:
			raise NotImplementedError('recheck the following')
			req=json.loads(web.data())

			jdata=req['jdata']
			usig=req['usig']

			data=json.loads(jdata)

			if not verify(jdata, get_user_pubkey(data['uid']), usig):
				raise BadRequest()

			print data
			# TODO: verify the request throughly
			_warn('need to verify request integrity and fitness')

			perm, allowed=check_permission(data['uid'], cid)
			if not allowed:
				raise NotAuthorizedError()

			# All OK, add the item

			if cid not in db:
				assert cid in ['.nodes', '.chans', '.users']

			db[cid]={}

			iid=gen_id(lambda x: x not in db[cid])

			jndata={
				'jdata': jdata,
				'usig': usig,
				'iid': iid
			}

			if perm is not None:
				jndata['perm']=perm

			jndata=json.dumps(jndata)

			db[cid][iid]={
				'jndata': jndata,
				'nsig': sign(jndata, cfg['private_key'])
			}

			_flush_db()

def get_user_pubkey(uid):
	'''
	Find user profile and get their pubkey

	Raises KeyError if no user with such uid exists
	'''
	if uid not in db.get('.users'):
		raise KeyError()
	
	desc=get_item_val('.users', uid)

	assert 'pub_key' in desc

	return desc['pub_key']
	

class JItem:
	@wrap_exceptions
	def GET(self, cid, iid):
		return resp(200, json=db[cid][iid])
		return resp(501,
			text='Not implemented: cid="%s", iid="%s"' \
			% (cid, iid))
	
	def PUT(self, cid, iid):
		try:
			req=json.loads(web.data())
		except ValueError:
			raise BadRequest('Not a JSON')

		if 'jdata' not in req:
			raise BadRequest("No 'jdata' field")
		try:
			json.loads(req['jdata'])
		except ValueError:
			raise BadRequest('Invalid jdata')
		if 'usig' not in req:
			raise BadRequest("No 'usig' field")

		jdata=req['jdata']
		data=json.loads(jdata)
		if 'uid' not in data:
			raise BadRequest('No uid field in jdata')

		uid=data['uid']

		try:
			pub_key=get_user_pubkey(uid)
		except KeyError:
			raise BadRequest('User id not found')

		print jdata, pub_key, 'usig', repr(req['usig'])
		if not verify(jdata, pub_key, req['usig']):
			raise BadRequest('Invalid user signature')

		if 'rev' not in data:
			raise BadRequest('No revision provided')

		if cid not in db:
			if cid not in ['.users', '.chans', '.nodes']:
				raise NotFound('channel not found: %s' % cid)
			else:
				raise NotFound('item %s not found in chan %s' \
					% (cid, iid))

		if iid not in db.get(cid, {}):
			raise NotFound('item %s not found in chan %s' \
				% (cid, iid))

		cur_rev=db[cid][iid]['nsig']

		if data['rev'] != cur_rev:
			raise BadRequest('Bad previous revision')

		if cid=='.users':
			return put_users(uid, jdata, req['usig'])
		elif cid=='.chans':
			return put_chans(req['jdata'], req['usig'])
		elif cid=='.nodes':
			return put_nodes()
		else:
			raise NotImplementedError('recheck the following')
		raise NotImplementedError()

		if False:
			req=json.loads(web.data())

			jdata=req['jdata']
			usig=req['usig']

			data=json.loads(jdata)

			if not verify(jdata, get_user_pubkey(data['uid']), usig):
				raise BadRequest()

			print data
			# TODO: verify the request throughly
			_warn('need to verify request integrity and fitness')

			perm, allowed=check_permission(data['uid'], cid)
			if not allowed:
				raise NotAuthorizedError()

			# All OK, add the item

			if cid not in db:
				assert cid in ['.nodes', '.chans', '.users']

			db[cid]={}

			iid=gen_id(lambda x: x not in db[cid])

			jndata={
				'jdata': jdata,
				'usig': usig,
				'iid': iid
			}

			if perm is not None:
				jndata['perm']=perm

			jndata=json.dumps(jndata)

			db[cid][iid]={
				'jndata': jndata,
				'nsig': sign(jndata, cfg['private_key'])
			}

			_flush_db()


class SelfTest:
	@wrap_exceptions
	def GET(self):
		return render.selftest()

def get_node_id(pubkey, name):
	return hash8(pubkey+name)

def get_user_id(pubkey):
	return hash8(pubkey)

def _flush_db():
	dump=json.dumps(db, indent=1, sort_keys=True, ensure_ascii=False)
	open('data.json', 'w').write(dump)

def init_node():
	global db, cfg, node_id

	if 'private_key' not in cfg:
		cfg['private_key']=open(cfg['node_privkey_path']).read()

	if 'public_key' not in cfg:
		cfg['public_key']=get_public_key(cfg['private_key'])
	
	node_id=get_node_id(cfg['public_key'], cfg['node_name'])
	if '.nodes' not in db:
		db['.nodes']={}

	if node_id in db['.nodes']:
		return
	
	node_descr={
		'pub_key': cfg['public_key'],
		'nodename': cfg['node_name']
	}

	jdata=json.dumps({
		'cid': '.nodes',
		'val': node_descr
	})
	usig=sign(jdata, cfg['private_key'])

	jndata=json.dumps({
		'jdata': jdata,
		'usig': usig,
		'iid': node_id
	})
	nsig=sign(jndata, cfg['private_key'])
	
	db['.nodes'][node_id]={
		'jndata': jndata,
		'nsig': nsig
	}
	_flush_db()


if __name__=='__main__':
	web.config.debug=False
	app=web.application(urls, globals())
	session=web.session.Session(app, web.session.ShelfStore(
		shelve.open('sessions.shelf')))

	try:
		db=json.loads(open('data.json').read())
	except IOError:
		db={}

	cfg=json.loads(open('config.json').read())

	init_node()

	try:
		from web.wsgiserver import CherryPyWSGIServer
		CherryPyWSGIServer.ssl_certificate=cfg['https_cert_path']
		CherryPyWSGIServer.ssl_private_key=cfg['https_privkey_path']
		app.run()
	finally:
		_flush_db()
