const CONFIG_PATH='config.json';

const VERSION='0.3.0.1';

const fs=require('fs');
const assert=require('assert');
const https=require('https');

const crypt=require('./crypt.js');
const config=require('./config.js');

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

async function POST_users(res, user_descr)
{
	console.log('create user:', user_descr);

	let data=JSON.parse(user_descr.jdata);
	let user_pubkey=data.val.pub_key;

	if (!crypt.verify(user_descr.jdata, user_pubkey, user_descr.usig)) {
		return respond(res, 403, 'Invalid Signature');
	}

	respond(res, 501);

	// verify user signature
	// verify user descriptor
	// reserve iid in .users
	// fill jndata
	// sign jndata
	// put item to '.users'
	// return iid
}

async function serve_api(req, res, tokens, query)
{
	console.log(tokens, query);

	if (req.method=="POST" && tokens[0]=='.users' && tokens.length==1) {
		return await POST_users(res, await get_json(req));
	}

	respond(res, 501, 'Not Implemented');
}

function serve(req, res)
{
	console.log(" <=", req.method, req.url);

	let is_simple_target=(req.url.slice(1).indexOf('/')==-1);

	if (req.url=='/test/cryptography') {
		return respond(res, 200, 'OK',
			fs.readFileSync('test/cryptography_browser.html'), {
			'Content-type': 'text/html; charset=utf-8'
		});
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
			return respond(404);
		}
	} else if (req.url.startsWith('/j/')) {
		let url=parse_url(req.url);
		return serve_api(req, res, url.tokens.slice(1), url.query);
	} else {
		return respond(404);
	}
}

function main()
{
	if (process.argv.length>2) {
		console.error('error: too many arguments');
		return 1;
	}

	let conf=config.load(CONFIG_PATH);

	console.log('starting HTTPS server at port', conf.server_port);

	let server=https.createServer({
		key: fs.readFileSync(conf.https_privkey_path),
		cert: fs.readFileSync(conf.https_cert_path)
	}, serve);
	
	server.listen(conf.server_port);
}

main();
