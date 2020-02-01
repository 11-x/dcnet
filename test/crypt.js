class _test_crypt
{
	// browser both signs and verifies
	async crypt_sv_bb(test) {
		test.action='generate keypair';
		let keypair=await crypt.gen_keypair();
		let test_data='some data';
		test.action='sign';
		let signature=await crypt.sign(test_data, keypair.private_key);
		test.action='verify';
		test.report(await crypt.verify(test_data, keypair.public_key,
			signature), 'verification failed');
	}

	// browser signs, node verifies
	async crypt_sv_bs(test) {
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

		test.report(res.code==200 && JSON.parse(res.data),
			'server returned false');
	}

	// node signs, browser verifies
	async crypt_sv_sb(test) {
		test.action='obtain generated keypair from server';

		let res=await node.request('GET', '/test/sign');

		if (res.code!=200) {
			return test.report(false, 'fetch signature failed: '
				+ res.code + ' ' + res.reason + ' - ' + res.data);
		}
		let data=JSON.parse(res.data);

		let test_data=data.data;
		let signature=data.signature;
		let pubkey=data.pubkey;

		test.action='verify';
		test.report(await crypt.verify(test_data,
			crypt.unwrap_pubkey(pubkey),
			crypt.der2ieee(signature)), 'verification failed');
	}

}

async function test_crypt() {
	let t=new _test_crypt();
	await run_test(t.crypt_sv_bb);
	await run_test(t.crypt_sv_bs);
	await run_test(t.crypt_sv_sb);
}
