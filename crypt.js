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
/*
function length(hex) {
	return ('00' + (hex.length / 2).toString(16)).slice(-2).toString();
}


function signature_to_der(signature_b64)
{
	signature = new Buffer(signature_b64, 'base64');
	signature = new Uint8Array(signature);

	// Extract r & s and format it in ASN1 format.
	var signHex = Array.prototype.map.call(signature, function(x) { return ('00' + x.toString(16)).slice(-2); }).join(''),
		r = signHex.substring(0, 96),
		s = signHex.substring(96),
		rPre = true,
		sPre = true;

	while(r.indexOf('00') === 0) {
	  r = r.substring(2);
	  rPre = false;
	}

	if (rPre && parseInt(r.substring(0, 2), 16) > 127) {
	  r = '00' + r;
	}

	while(s.indexOf('00') === 0) {
	  s = s.substring(2);
	  sPre = false;
	}

	if(sPre && parseInt(s.substring(0, 2), 16) > 127) {
	  s = '00' + s;
	}

	var payload = '02' + length(r) + r +
				  '02' + length(s) + s,
		der = '30' + length(payload) + payload;
	return Buffer.from(der, 'hex').toString('base64');
}

function verify(data_str, pubkey, signature) {
	console.log('VERIFY: data_str');
	console.log(data_str);
	console.log('VERIFY: pub_key');
	console.log(pubkey);
	console.log('VERIFY: signature');
	console.log(signature);
	//signature=signature_to_der(signature);
	console.log('VERIFY: signature (der)');
	console.log(signature);
	let verifier=crypto.createVerify('sha256');
	verifier.update(data_str);
	verifier.end();
	pubkey='-----BEGIN PUBLIC KEY-----\n'
		+ pubkey + '\n-----END PUBLIC KEY-----';
	return verifier.verify(pubkey, signature, 'base64');
}
*/
exports.verify=verify;
exports.sign=sign;

let data_str='test';
let pubkey='MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAENTy26kW1jjySuhPPjY1y7CHuMuP8ulCK4L4oudZ1C5fV8viiwmJGVqc8QpgCvXL00rPMA2LUqqZBLogjRSCs9Gv8yUcMA+ciiOERojmvC5mhINjIKe0JGyuC5C73C9q3';
let signature=Buffer.from('306502306eb12019c4990817af4b87b4d14179fbba89c6f07ea6f3fd11277d5233e2b0f44c7b07e15d06e06c9d29b1ee9fac13d1023100f0583cc038c367903cf0eb1f39907ae8aa3f90bb92e1f39f7a0b5bfe7fc794486c25952d4b98d65bdeca202fd290ef4a', 'hex').toString('base64');

//console.log('verify-test:', verify(data_str, pubkey, signature));
