/*
function bytesToHexString(bytes) {
        if (!bytes)
            return null;

        bytes = new Uint8Array(bytes);
        var hexBytes = [];

        for (var i = 0; i < bytes.length; ++i) {
            var byteString = bytes[i].toString(16);
            if (byteString.length < 2)
                byteString = "0" + byteString;
            hexBytes.push(byteString);
        }

        return hexBytes.join("");
    }
*/

class DCN
{
	constructor()
	{
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
				let exported_key=await crypto.subtle.exportKey(
					"spki", keypair.publicKey);
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
		this.crypt=new Crypt();
	}

	logoff() {
		this.purge();
		location="/";
	}

	get uid() {
		return localStorage.uid;
	}

	set uid(uid) {
		if (uid)
			return localStorage.uid=uid;
		else
			delete localStorate.uid;
	}

	get username() {
		return localStorage.username;
	}

	set username(username) {
		if (username)
			return localStorage.username=username;
		else
			delete localStorage.username;
	}

	get pass() {
		return localStorage.pass;
	}

	set pass(pass) {
		if (pass)
			return localStorage.pass=pass;
		else
			delete localStorage.pass;
	}

	/**
	 Clen up browser state to forget the user
	 */
	purge() {
		localStorage.clear();
	}

	/**
	 Verify current user credentials on server

	 Returns uid on success or undefined on failure
	 */
	async verify_credentials()
	{
		let username=localStorage.username;
		let pass=localStorage.pass;

		if (typeof username=="undefined"
				|| typeof pass=="undefined") {
			return;
		}

		// Actually verify
		// Algorithm:
		// send request to fetch /users?username=<username>
		// await user descriptor
		// decipher protected storage with the password
		// check public key and private key match

		let resp=await this.request("GET", "/j/.users");

		if (resp.code != 200) {
			return;
		}

		let users=JSON.parse(resp.data);

		for (let uid in users) {
			let ndata=JSON.parse(users[uid].jndata);
			let data=JSON.parse(ndata.jdata);

			let userinfo=data.val;

			if (typeof userinfo=="undefined")
				continue; // deleted user

			if (typeof userinfo.username=="undefined")
				continue; // user without username

			if (userinfo.username != username)
				continue; // username mismatch

			// At this point we have a username match; now
			// we gotta now exctract the private key

			let encrypted_privkey=userinfo.priv_key;

			let privkey_b64=await this.crypt.decrypt(
				encrypted_privkey, pass);

			if (typeof privkey_b64=="undefined")
				return; // key mismatch

			if (await this.crypt.keys_match(privkey_b64, userinfo.pub_key))
				return uid;
			// TODO: ensure that code operates correctly when password
			// is wrong and no/invalid privkey is decoded

			// TODO: embed error checking code for server malfunctions
		}
		return; // no match
	}

	// callback-based request
	_request_cb(method, url, data, cb, cb_err)
	{
		//console.log("REQUEST " + method + " " + url + " " + data);
		if (typeof(localStorage['.node'])!="undefined"
				&& !new RegExp('^(?:[a-z]+:)?//', 'i').test(url)
				&& url.indexOf('/')===0)
			url=localStorage['.node'] + url; // rebase

		var xhr=new XMLHttpRequest();
		xhr.open(method, url, true);
		xhr.onreadystatechange=function() {
			if (this.readyState!=4) return;

			if (this.status==0) {
				if (typeof cb_err!="undefined")
					cb_err(this);
				else
					console.error(this);
				return;
			}
			if (typeof(cb)!="undefined") {
				//console.log("response: " + this.status + " "
				//	+ this.statusText + " " + this.responseText);
				cb(this.status, this.statusText, this.responseText);
			}
		}
		xhr.send(data);
	};

	/**
	 Perform an asynchronous request

	 Response is given as an object: {
	 	code: <HTTP status code>,
		reason: "<HTTP status text>",
		data: "<response data>"
	 }
	 */
	async request(method, url, data)
	{
		return new Promise((resolve, reject)=>{
			this._request_cb(method, url, data, (code, reason, data)=>{
				resolve({
					code: code,
					reason: reason,
					data: data
				});
			}, xhr=>{
				reject(xhr);
			});
		});
	}

	/**
	 Create a new channel
	 Returns cid of the newly created channel
	 */
	async create_channel(name, description, writers, moderators)
	{
		if (typeof this.uid=="undefined")
			throw "not authorized";

		let chan_spec={
			owner: this.uid
		};
		if (typeof name!="undefined")
			chan_spec.name=name;
		if (typeof description!="undefined")
			chan_spec.description=description;
		if (typeof writers!="undefined")
			chan_spec.writers=writers;
		if (typeof moderators!="undefined")
			chan_spec.moderators=moderators;
		
		let data={
			uid: this.uid,
			cid: ".chans",
			val: chan_spec
		};
		let jdata=JSON.stringify(data);

		let resp=await this.request("POST", "/j/.chans",
			JSON.stringify({
				jdata: jdata,
				usig: await(this.sign(jdata))
			}));

		if (resp.code!=201) {
			throw "Channel creation failed: " + resp.code + " "
				+ resp.reason + " " + resp.data;
		}

		return resp.data;
	}
};

dcn=new DCN();
