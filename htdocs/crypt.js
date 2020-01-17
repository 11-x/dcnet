class Crypt
{
	/**
	 Sign a string string
	 */
	async sign(str, priv64)
	{
		let privkey=await crypto.subtle.importKey('pkcs8',
			this.b642ab(priv64),
			{
				name: "ECDSA",
				namedCurve: "P-256"
			},
			true, ["sign"]);
		
		let signature=await crypto.subtle.sign({
			name: "ECDSA",
			hash: "SHA-256"
		}, privkey, this.str2ab(str));

		return this.ab2b64(signature);
	}

	/**
	 Encode ArrayBuffer into base64 string
	 */
	ab2b64(array_buf)
	{
		let ui=new Uint8Array(array_buf);
		let bin_str='';
		for (let i=0; i<ui.length; i++) {
			bin_str += String.fromCharCode(ui[i]);
		}
		return btoa(bin_str);
	}

	/**
	 Convert ArrayBuffer to string
	 */
	ab2str(array_buf)
	{
		let ui=new Uint8Array(array_buf);
		let str='';
		for (let i=0; i<ui.length; i++) {
			str += String.fromCharCode(ui[i]);
		}
		return str;
	}

	/**
	 Convert string to ArrayBuffer
	 */
	str2ab(str)
	{
		let ui=new Uint8Array(str.length);
		for (let i=0; i<str.length; i++) {
			ui[i]=str.charCodeAt(i);
		}
		return ui.buffer;
	}

	/**
	 Decode base64 string into ArrayBuffer
	 */
	b642ab(str)
	{
		if (typeof str!="string") {
			throw "not a string: " + typeof str;
		}
		let bin_str=atob(str);
		let ui=new Uint8Array(bin_str.length);
		for (let i=0; i<bin_str.length; i++) {
			ui[i]=bin_str.charCodeAt(i);
		}
		return ui.buffer;
	}

	/**
	 Generate keypair
	 */
	async gen_keypair()
	{
		let keypair=await window.crypto.subtle.generateKey({
				name: "ECDSA",
				namedCurve: "P-256"
			},
			true,
			["sign", "verify"]
		);
		let res = {
			public_key: this.ab2b64(await crypto.subtle.exportKey(
				"spki", keypair.publicKey)),
			private_key: this.ab2b64(await crypto.subtle.exportKey(
				"pkcs8", keypair.privateKey))
		};
		return res;
	}

	/**
	 Generate symmetric key from password (AES-GCM)
	 */
	async gen_aes_gcm_key_from_pass(pass, salt)
	{
		let key1=await crypto.subtle.importKey(
			"raw",
			this.str2ab(pass),
			{name: "PBKDF2"},
			false,
			["deriveKey"]);

		let key2=await crypto.subtle.deriveKey(
			{
				name: "PBKDF2",
				salt: salt,
				iterations: 10000,
				hash: "SHA-256"
			},
			key1,
			{
				name: "AES-GCM",
				length: 256
			},
			true,
			["encrypt", "decrypt"]
		);

		return key2;
	}

	/**
	 Generate symmetric key from password (AES-GCM)
	 */
	async gen_aes_cbc_key_from_pass(pass)
	{
		let hash=await crypto.subtle.digest(
			{name: "SHA-256"},
			new TextEncoder("utf-8").encode(pass)
		);
		
		let key=await crypto.subtle.importKey(
			"raw", 
			hash, 
			{name: "AES-GCM", length: 256},
			true,
			["encrypt", "decrypt"]
		); 

		return key;
	}

	/**
	 Decrypt password-protected item (PPI) into string
	 */
	async decrypt(ppi, pass)
	{
		if (typeof ppi!="object" || ppi.type!="ppi")
			throw "not a PPI";

		if (ppi.algo!="AES-GCM")
			throw "algorithm not implemented: " + ppi.algorithm;

		let key=await this.gen_aes_gcm_key_from_pass(pass,
			this.b642ab(ppi.salt));

		let encrypted=this.b642ab(ppi.encrypted);

		let decrypted=null;
		try {
			decrypted=await crypto.subtle.decrypt({
				name: "AES-GCM",
				iv: new Uint8Array(this.b642ab(ppi.iv))
			}, key, encrypted);
		} catch (x) {
			return;
		}

		return this.ab2str(decrypted);
	}

	/**
	 encrypt string into password-protected item (PPI)
	 Supported algorithms:
		AES-GCM (default)
	 */
	async encrypt(str, pass, algorithm)
	{
		if (typeof str!="string")
			throw "data must be a string";

		if (typeof algorithm=="undefined")
			algorithm="AES-GCM";

		if (algorithm != "AES-GCM")
			throw "not implemented: " + algorithm;

		let salt=crypto.getRandomValues(new Uint8Array(8));

		let key=await this.gen_aes_gcm_key_from_pass(pass, salt);

		let iv=crypto.getRandomValues(new Uint8Array(16));

		let encrypted=await crypto.subtle.encrypt({
			name: "AES-GCM",
			iv: iv
		}, key, this.str2ab(str));

		let res = {
			"type": "ppi",
			"algo": "AES-GCM",
			"encrypted": this.ab2b64(encrypted),
			"iv": this.ab2b64(iv),
			"salt": this.ab2b64(salt)
		};

		// validate decryption

		let dc=await this.decrypt(res, pass);

		if (typeof dc=="undefined")
			return;

		return res;
	}

	/**
	 Check if two keys match each other
	 */
	async keys_match(priv_key, pub_key)
	{
		let rnd=crypto.getRandomValues(new Uint8Array(16));
		let rnd_string=this.ab2b64(rnd.buffer);
		let signature=await this.sign(rnd_string, priv_key);
		return await this.verify_sign(rnd_string, pub_key,
			signature);
			
	}

	/**
	 Verify signature
	 */
	async verify_sign(data_str, pubkey_b64, signature_b64)
	{
		let signature=this.b642ab(signature_b64);
		let pubkey=await crypto.subtle.importKey('spki',
			this.b642ab(pubkey_b64),
			{
				name: "ECDSA",
				namedCurve: "P-256"
			},
			true, ["verify"]);

		let is_valid=await crypto.subtle.verify({
			name: "ECDSA",
			hash: "SHA-256"
		}, pubkey, signature, this.str2ab(data_str));

		return is_valid;
	}
};

var crypt=new Crypt();
