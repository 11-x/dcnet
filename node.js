const CONFIG_PATH='config.json';

const VERSION='0.3.0.1';

const fs=require('fs');
const assert=require('assert');
const https=require('https');

const config=require('./config.js');

function serve(req, res)
{
	console.log(req);

	res.writeHead(501);
	res.end("DCNet: under construction");
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
