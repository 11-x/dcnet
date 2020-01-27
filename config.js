const fs=require('fs');
const assert=require('assert');

function load_config(path)
{
	if (!fs.existsSync(path)) {
		throw('no config file (' + path 
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

	assert('config_version' in conf);
	assert(typeof conf.config_version=="string");

	assert('server_port' in conf);
	assert(typeof conf.server_port=="number");

	for (let key in conf) {
		assert(['node_name', 'log_path', 'node_privkey_path',
		'https_cert_path', 'https_privkey_path', 'config_version',
		'server_port'].includes(key),
			'unknown config key: ' + key);
	}
}

exports.load=load_config;
