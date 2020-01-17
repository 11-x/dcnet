class Node {
	constructor() {
		this._db={};
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

	async sync(chan, query)
	{
		let url="/j/" + chan;

		if (typeof query!="undefined") {
			url+='?query=' + encodeURIComponent(JSON.stringify(query));
		}

		let resp=await node.request("GET", url);

		if (resp.code != 200) {
			console.error(resp);
			throw "fetch failed";
		}

		for (let key in resp.data) {
			this._db[chan][key]=resp.data[key];
		}
	}

	async register(username, pass)
	{
		// Generate private key
		// Encrypt privkey=>ppi by pass
		// Create and post user descriptor into chans
		// Store into localstorage the info on success
		// Sugg suggest dreams import from dcnet_1
		// fwd to home
		console.log('here');
		let keypair=await crypt.gen_keypair();
		
		let privkey_ppi=await crypt.encrypt(
			JSON.stringify(keypair.private_key), pass);

		let user_descr={
			pub_key: keypair.public_key,
			priv_key: privkey_ppi,
			username: username
		};

		let jdata=JSON.stringify({
			cid: '.users',
			val: user_descr
		});

		let res=await this.request("POST", "/j/.users", JSON.stringify({
			jdata: jdata,
			usig: await crypt.sign(jdata, keypair.private_key)
		}));

		console.log(res);

		if (res.code==201) {
			return res.data; // user_id
		} else {
			console.error('user registration failed', res);
			throw new Error('User registration failed');
		}
	}
}

var node=new Node();
