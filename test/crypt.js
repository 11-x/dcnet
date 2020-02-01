class _test_crypt
{
/**
	Generate keypair, sign test data and verify it
 */
	async crypt_sv_bb(test) {
		test.action='generate keypair';
		let keypair=await crypt.gen_keypair();
		let test_data='some data';
		test.action='sign';
		let signature=await crypt.sign(test_data, keypair.private_key);
		test.action='verify';
		test.report(await crypt.verify(test_data, keypair.public_key,
			signature));
	}

	async crypt_sv_bs(test) {
		test.action='generate keypair';
		let keypair=await crypt.gen_keypair();
		let test_data='some data';
		test.action='sign';
		let signature=await crypt.sign(test_data, keypair.private_key);
		test.action='verify on server';

		let res=await node.request('GET', '/test/verify?data='
			+ encodeURIComponent(test_data) + '&pubkey='
			+ encodeURIComponent(crypt.wrap_pubkey(keypair.public_key))
				+ '&signature='
			+ encodeURIComponent(crypt.ieee2der(signature)));

		test.report(res.code==200 && JSON.parse(res.data));
	}
}

async function test_crypt() {
	let t=new _test_crypt();
	await run_test(t.crypt_sv_bb);
	await run_test(t.crypt_sv_bs);
}
