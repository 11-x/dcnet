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

		this._target=null;
		this._targets_cache={};
	}

	async close() {
		if (this._target) {
			let closing=window[this._target+'_closing'];

			if (typeof closing=="function")
				await closing();
		}

		this.body.innerHTML='';
	}

	get body() {
		if (typeof this._body=="undefined") {
			this._body=document.createElement("div");
			document.getElementsByTagName("body")[0].appendChild(
				this._body);
		}
		return this._body;
	}

	async fetch(target) {
		if (!(target in this._targets_cache))
			this._targets_cache[target]=await node.request("GET",
				"htdocs/" + target + ".html");

		return this._targets_cache[target];
	}

	async go(target, set_new_state) {
		if (typeof set_new_state=="undefined")
			set_new_state=true;

		let resp=await this.fetch(target);

		await this.close();

		if (resp.code==404) {
			console.error(resp);
			this.body.innerHTML='404 Not Found';
			return;
		} else if (resp.code!=200) {
			console.error(resp);
			return;
		}

		this.body.innerHTML=resp.data;

		if (set_new_state)
			window.history.pushState(target, target, target);

		if (typeof window[target+'_loaded']=="function")
			await window[target+'_loaded']();

		this._target=target;
	}
}

var page=new Page();
