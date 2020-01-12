class Page
{
	constructor() {
		window.onpopstate=e=>{
			if (e.state) {
				this.go(e.state, false);
			} else {
				console.error("why no e.state?", e);
			}
		};
	}

	async close() {
		if (typeof page_closing=="function")
			await page_closing();

		this.head.innerHTML='';
		this.body.innerHTML='';

		for (let i in this.imported) {
			window[this.imported[i]]=undefined;
		}
	}

	get body() {
		if (typeof this._body=="undefined") {
			this._body=document.createElement("div");
			document.getElementsByTagName("body")[0].appendChild(
				this._body);
		}
		return this._body;
	}

	get head() {
		if (typeof this._head=="undefined") {
			this._head=document.createElement("div");
			document.getElementsByTagName("head")[0].appendChild(
				this._head);
		}
		return this._head;
	}

	async go(target, set_new_state) {
		if (typeof set_new_state=="undefined")
			set_new_state=true;

		await this.close();

		let resp=await node.request("GET", "htdocs/" + target 
			+ ".html");

		if (resp.code==404) {
			console.error(resp);
			this.body.innerHTML='404 Not Found';
			return;
		} else if (resp.code!=200) {
			console.error(resp);
			return;
		}

		this.body.innerHTML=resp.data;

		await this.require(target);

		if (set_new_state)
			window.history.pushState(target, target, target);

		if (typeof page_loaded=="function")
			await page_loaded();
	}

	async require(target) {
		let resp=await node.request("GET", "htdocs/" + target + ".js");

		if (resp.code!=200) {
			console.warn(resp);
			return;
		}

		let known_globals={};

		for (let key in window) {
			if (typeof key!="undefined")
				known_globals[key]=window[key];
		}

		let script=document.createElement("script");
		script.innerHTML=resp.data;
		page.head.appendChild(script);

		this.imported=[];

		for (let key in window) {
			if (!(key in known_globals)) {
				this.imported.push(key);
			} else if (known_globals[key]!=window[key]) {
				throw "global key redefined: " + key;
			}
		}
	}
}

var page=new Page();
