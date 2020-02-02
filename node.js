// TODO replace most asserts with proper error handling
const CONFIG_PATH='config.json';

const VERSION='0.3.0.1';

const fs=require('fs');
const assert=require('assert');
const https=require('https');

const crypt=require('./crypt.js');
const config=require('./config.js');
var db=require('./db.js');

function respond(resp, code, reason, data, headers)
{
	if (typeof code!="undefined")
		resp.statusCode=code;
	
	if (typeof reason!="undefined")
		resp.statusMessage=reason;
	
	if (typeof headers!="undefined")
		for (let key in headers)
			resp.setHeader(key, headers[key]);

	if (typeof data!="undefined")
		resp.write(data);
	
	resp.end();

	let data_size=(typeof data=="undefined"? 0: data.length);

	console.log(" =>", resp.statusCode, resp.statusMessage, data_size);
}

function parse_url(url)
{
	let pathname=url, query={};
	if (url.indexOf('?')!=-1) {
		pathname=url.slice(0, url.indexOf('?'));
		url.slice(url.indexOf('?')+1).split('&').forEach(kv => {
			kv=kv.split('=');
			query[decodeURIComponent(kv[0])]=decodeURIComponent(kv[1]);
		});
	}
	return {
		tokens:
			pathname.split('/').slice(1).map(t => decodeURIComponent(t)),
		query: query
	}
}

async function get_data(req)
{
	return new Promise((resolve, reject) => {
		let data='';

		req.on('data', chunk => {
			data += chunk;
		});

		req.on('end', () => {
			resolve(data);
		});
	});
}

async function get_json(req)
{
	return JSON.parse(await get_data(req));
}

function can_create(cid, uid, perm)
{
	if (cid=='.users')
		return true;
	
	throw "not implemented; can_create " + cid + " " + uid + " "
		+ perm;
}

function check_user_descriptor(uid, udesc)
{
	for (let key in udesc)
		if (!['pub_key', 'priv_key', 'username', 'home'].includes(key))
			return false;
	
	if (!('pub_key' in udesc))
		return false;

	// ensure pubkey either matches current state, or is unique
	// among other users
	let users=db.query_vals('.users', val => val.pub_key==udesc.pub_key);

	if (typeof uid=="undefined") {
		if (Object.keys(users).length)
			return false; // user with such pubkey exists
	} else {
		if (!(Object.keys(users).length==1 && uid in users))
			return false;
	}

	// ensure username is unique among other users
	users=db.query_vals('.users', val => val.username==udesc.username);

	if (typeof uid=="undefined") {
		if (Object.keys(users).length)
			return false; // user with such username exists
	} else {
		if (!(Object.keys(users).length==1 && uid in users))
			return false;
	}

	return true;
}

function check_value(cid, uid, val)
{
	if (cid=='.users')
		return check_user_descriptor(uid, val);
	return true;
}

async function POST_chan(res, cid, ureq)
{
	// Algorithm:
	// Validate ureq structure
	// Verify signature
	// Check access rights
	// Perform chan-specific checks
	// Actually create

	try {
		for (let key in ureq)
			if (['jdata', 'usig', 'perm'].includes(key)==false)
				throw "Unexpected key: " + key;

		let data=JSON.parse(ureq.jdata);

		if (data.cid != cid)
			throw "Invalid cid";

		if (!crypt.verify(ureq.jdata, data.val.pub_key, ureq.usig))
			throw "Invalid signature";

		if (!('uid' in data) && !(cid=='.users'))
			throw "uid required";

		if (!can_create(cid, data.uid, ureq.perm))
			return respond(res, 403, 'Not Authorized');

		if (!check_value(cid, data.uid, data.val))
			throw "Invalid value";

		let iid=db.reserve(data.cid);

		let ndata={
			jdata: ureq.jdata,
			usig: ureq.usig,
			iid: iid
		};

		if ('perm' in ureq)
			ndata.perm=ureq.perm;

		let jndata=JSON.stringify(ndata);

		db.init(data.cid, iid, {
			jndata: jndata,
			nsig: crypt.sign(jndata, conf.private_key)
		});

		return respond(res, 201, 'Item Created', iid);
	} catch (err) {
		return respond(res, 400, 'Bad Request', String(err));
	}
}

async function serve_api(req, res, tokens, query)
{
	//console.log(tokens, query);

	if (req.method=="POST" && tokens.length==1) {
		return await POST_chan(res, tokens[0], await get_json(req));
	}

	respond(res, 501, 'Not Implemented');
}

function serve(req, res)
{
	console.log(" <=", req.method, req.url);

	let is_simple_target=(req.url.slice(1).indexOf('/')==-1);

	if (req.url=='/selftest') {
		return respond(res, 200, 'OK',
			fs.readFileSync('test/test.html'), {
			'Content-type': 'text/html; charset=utf-8'
		});
	} else if (req.url.startsWith("/test/") && req.url.endsWith(".js")) {
		assert(req.url.indexOf("..")==-1);
		// TODO check file existense
		return respond(res, 200, 'OK',
			fs.readFileSync(req.url.slice(1)), {
				'Content-type':
					'application/javascript; charset=utf-8'
		});
	} else if (req.url.startsWith("/test/verify")) {
		let url=parse_url(req.url);
		let result=false;

		try {
			result=crypt.verify(url.query.data,
				url.query.pubkey, url.query.signature);
		} catch (err) {
			result=false;
		}
		if (result) {
			return respond(res, 200, 'OK', 'true', {
				'Content-type': 'application/javascript; charset=utf-8'
			});
		} else {
			return respond(res, 200, 'OK', 'false', {
				'Content-type': 'application/javascript; charset=utf-8'
			});
		}
	} else if (req.url=="/test/sign") {
		let keypair=crypt.gen_keypair();
		let test_data='test data';
		let signature=crypt.sign(test_data, keypair.private_key);
		return respond(res, 200, 'OK', JSON.stringify({
			data: test_data,
			pubkey: keypair.public_key,
			signature: signature
		}), {
			'Content-type': 'application/javascript; charset=utf-8'
		});
		return respond(res, 501, 'Not Implemented');
	} else if (is_simple_target) {
		return respond(res, 200, 'OK',
			fs.readFileSync('htdocs/default.html'), {
			'Content-type': 'text/html; charset=utf-8'
		});
	} else if (req.url.startsWith("/htdocs/")) {
		assert(req.url.indexOf("..")==-1);
		try {
			if (req.url.endsWith(".js")) {
				return respond(res, 200, 'OK',
					fs.readFileSync(req.url.slice(1)), {
						'Content-type':
							'application/javascript; charset=utf-8'
				});
			} else if (req.url.endsWith(".html")) {
				return respond(res, 200, 'OK',
					fs.readFileSync(req.url.slice(1)), {
						'Content-type':
							'text/html; charset=utf-8'
				});
			} else {
				return respond(res, 400, 'Bad Request');
			}
		} catch (err) {
			return respond(res, 404);
		}
	} else if (req.url.startsWith('/j/')) {
		let url=parse_url(req.url);
		return serve_api(req, res, url.tokens.slice(1), url.query);
	} else {
		return respond(res, 404);
	}
}

function init_node()
{
	// validate or create node descriptor
	console.warn('WARNING: implement init_node');
}

function main()
{
	if (process.argv.length>2) {
		console.error('error: too many arguments');
		return 1;
	}

	conf=config.load(CONFIG_PATH);
	db=db.create(conf.db_dir);

	init_node();

	console.log('starting HTTPS server at port', conf.server_port);

	let server=https.createServer({
		key: fs.readFileSync(conf.https_privkey_path),
		cert: fs.readFileSync(conf.https_cert_path)
	}, serve);
	
	server.listen(conf.server_port);
}

main();
