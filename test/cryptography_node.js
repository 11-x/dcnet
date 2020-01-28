const crypt=require('../crypt.js');
const fs=require('fs');

function get_cmd()
{
	return process.argv[0].split('/').pop() + " "
		+ process.argv[1].split('/').pop();
}
const HELP_MSG=
"Nodejs ECDSA SHA-256 signer/verifier\n" +
"Usages:\n" +
get_cmd() + " --help\n" +
"\tShow this help and exit\n" +
get_cmd() + " sign file.data privkey.pem\n" +
"\tSign file and output signature to stdout\n" +
get_cmd() + " verify file.data pubkey.pem signature_b64\n" +
"\tVerify signature. On success 'OK' is displayed, 'FAIL' otherwise.\n" +
"\tThe return code is 0 on success.";

function show_help()
{
	console.log(HELP_MSG);
}

if (process.argv.includes('--help')) {
	show_help();
	process.exit(0);
} else if (process.argv.length<=2) {
	show_help();
	process.exit(1);
} else if (process.argv[2]=='sign'
		&& process.argv.length==5) {
	let data_path=process.argv[3];
	let privkey_path=process.argv[4];

	console.log(crypt.sign(
		fs.readFileSync(data_path).toString(),
		fs.readFileSync(privkey_path).toString()));
} else if (process.argv[2]=='verify'
		&& process.argv.length==6) {
	let data_path=process.argv[3];
	let pubkey_path=process.argv[4];
	let sign_path=process.argv[5];

	if (crypt.verify(
			fs.readFileSync(data_path).toString(),
			fs.readFileSync(pubkey_path).toString(),
			fs.readFileSync(sign_path).toString())) {
		console.log('OK');
	} else {
		console.log('FAIL');
		process.exit(2);
	}

} else {
	console.error('error: bad arguments');
	process.exit(1);
}
