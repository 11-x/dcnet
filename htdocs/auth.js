class Auth {
	constructor() {
	}

	get is_purged() {
		return typeof this._uid=="undefined"
			&& typeof this._privkey=="undefined"
			&& typeof this._username=="undefined"
			&& typeof this._pass=="undefined";
	}

	get is_logged_in() {
		return typeof this._uid!="undefined"
			&& typeof this._privkey!="undefined";
	}

	get username() {
		return this._username;
	}

	get pass() {
		return this._pass;
	}

	async register(username, pass)
	{
		if (this.is_logged_in)
			throw "Cannot register while logged in";

		let keypair=await crypt.gen_keypair();
		
		let privkey_ppi=await crypt.encrypt(
			JSON.stringify(keypair.private_key), pass);

		console.log(privkey_ppi);

		let user_descr={
			pub_key: crypt.wrap_pubkey(keypair.public_key),
			priv_key: privkey_ppi,
			username: username
		};

		let jdata=JSON.stringify({
			cid: '.users',
			val: user_descr
		});

		let res=await node.request("POST", "/j/.users", JSON.stringify({
			jdata: jdata,
			usig: crypt.ieee2der(await crypt.sign(jdata,
				keypair.private_key))
		}));

		console.log('register response', res);

		if (res.code==201) {
			this._uid=res.data;
			this._keypair=keypair;
			this._pass=pass;
			this._username=username;

			return this._uid;
		} else {
			console.error('user registration failed', res);
			throw new Error('User registration failed');
		}
	}
}

var auth=new Auth();
