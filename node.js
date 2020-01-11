const CONFIG_PATH='config.json';

const VERSION='0.3.0.1';

const fs=require('fs');
const assert=require('assert');
const https=require('https');

const config=require('./config.js');

function serve(req, res)
{
	console.log(req.method, req.url);

	try {
		if (req.url=='/') {
			res.writeHead(200, {
				'Content-type': 'text/html; charset=utf-8'
			});

			res.end(fs.readFileSync('htdocs/default.html'));
			return;
		} else if (req.url.startsWith("/htdocs/")
				&& (req.url.endsWith(".js")
					|| req.url.endsWith(".html"))) {
			assert(req.url.indexOf("..")==-1);
			try {
				let content=fs.readFileSync(req.url.slice(1));

				res.writeHead(200, {
					'Content-type': 'application/javascript; charset=utf-8'
				});

				res.end(content);
			} catch (err) {
				res.writeHead(404);
				res.end();
			}
			return;
		}

		res.writeHead(404);
		res.end();
	} finally {
		console.log(res.statusCode, res.statusMessage);
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
