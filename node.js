const CONFIG_PATH='config.json';

const VERSION='0.3.0.1';

const fs=require('fs');
const assert=require('assert');
const config=require('./config.js');

function main()
{
	if (process.argv.length>2) {
		console.error('error: too many arguments');
		return 1;
	}

	let conf=config.load(CONFIG_PATH);

	console.log('starting HTTPS server at port', conf.server_port);
	throw new Error("not implemented");
}

let retcode=main();
process.exit(retcode);
