const EC=require('elliptic').ec;

const ec=new EC('secp256k1');


function verify(data_str, pubkey, signature) {
	return ecdsaVerify(data, signature, pubkey);
}

exports.verify=verify;
