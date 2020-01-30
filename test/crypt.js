/**
	Generate keypair, sign test data and verify it
 */
async function test_crypt_sv_bb(test) {
	test.action='generate keypair';
	let keypair=await crypt.gen_keypair();
	let test_data='some data';
	test.action='sign';
	let signature=await crypt.sign(test_data, keypair.private_key);
	test.action='verify';
	test.report(await crypt.verify(test_data, keypair.public_key,
		signature))
}

async function test_crypt() {
	test_run(test_crypt_sv_bb);
}
