const CONFIG_PATH='config.json';
const DEFAULT_HTTPS_PORT=443;

const VERSION='0.3.0.1';

const fs=require('fs');
const assert=require('assert');

function main()
{
	if (process.argv[2]=='--help') {
		return help();
	}

	if (process.argv.length>3) {
		console.error('error: too many arguments');
		return 1;
	}

	let port=process.argv[2];

	if (typeof port=="undefined")
		port=DEFAULT_HTTPS_PORT;
	else
		port=parseInt(port);

	let conf=load_config(CONFIG_PATH);

	console.log('starting HTTPS server at port', port);
}


function load_config(path)
{
	if (!fs.existsSync(path)) {
		abort('no config file (' + path 
			+ '); see the README for setup notes');
	}

	let conf=JSON.parse(fs.readFileSync(path));

	verify_conf(conf, path);

	return conf;
}

function verify_conf(conf, path)
{
	assert(typeof conf=="object");
	assert(conf!=null);

	assert('node_name' in conf);
	assert(typeof conf.node_name=="string");

	assert('node_privkey_path' in conf);
	assert(typeof conf.node_privkey_path=="string");
	assert(fs.existsSync(conf.node_privkey_path),
		'no node private key found at: ' + conf.node_privkey_path)

	assert('https_cert_path' in conf);
	assert(typeof conf.https_cert_path=="string");
	assert(fs.existsSync(conf.https_cert_path),
		'no HTTPS certificate found at: ' + conf.https_cert_path)

	assert('https_privkey_path' in conf);
	assert(typeof conf.https_privkey_path=="string");
	assert(fs.existsSync(conf.https_privkey_path),
		'no HTTPS key found at: ' + conf.https_privkey_path)

	for (let key in conf) {
		assert(['node_name', 'log_path', 'node_privkey_path',
		'https_cert_path', 'https_privkey_path'].includes(key),
			'unknown config key: ' + key);
	}
}

function help()
{
	console.log('Usage:');
	console.log('\tnodejs node --help - show this help');
	console.log('\tnodejs node [port] - run HTTPS server. default port',
		'number is 443');
}

function abort(err_msg)
{
	console.error('error:', err_msg);
	process.exit(-1);
	throw new Error(err_msg);
}

try {
	process.exit(main())
} catch (err) {
	console.error(err.stack);
}
