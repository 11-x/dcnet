const CONFIG_PATH='config.json';

const https=require('https');
const fs=require('fs');

function https_handler(req, res)
{
	res.writeHead(200, {
		'Content-Type': 'text/html; charset=utf-8'
	});
	res.end(fs.readFileSync('htdocs/index.html'));
}

const conf=JSON.parse(fs.readFileSync(CONFIG_PATH));

const https_options={
	key: fs.readFileSync(conf.https_privkey_path),
	cert: fs.readFileSync(conf.https_cert_path)
};

var server=https.createServer(https_options, https_handler);

server.listen(8124);
