const crypto=require('crypto');
const assert=require('assert');

function sign(data, privkey_b64)
{
	assert(typeof data=='string');
	assert(typeof privkey_b64=='string');

	const sign=crypto.createSign('SHA256');
	sign.write(data);
	sign.end();

	const privkey=crypto.createPrivateKey(privkey_b64);

	return sign.sign(privkey, 'base64');
}

function verify(data, pubkey_b64, signature_b64)
{
	assert(typeof data=='string');
	assert(typeof pubkey_b64=='string');
	assert(typeof signature_b64=='string');

	const verify=crypto.createVerify('SHA256');
	verify.write(data);
	verify.end();

	const pubkey=crypto.createPublicKey(pubkey_b64);

	return verify.verify(pubkey, signature_b64, 'base64');
}

function gen_keypair()
{
	let keypair=crypto.generateKeyPairSync('ec', {
		namedCurve: 'P-256',
		publicKeyEncoding: {
			type: 'spki',
			format: 'pem'
		},
		privateKeyEncoding: {
			type: 'pkcs8',
			format: 'pem'
		}
	});

	assert(typeof keypair.publicKey=="string");
	assert(typeof keypair.privateKey=="string");

	return {
		public_key: keypair.publicKey,
		private_key: keypair.privateKey
	};
}

exports.verify=verify;
exports.sign=sign;
exports.gen_keypair=gen_keypair;
