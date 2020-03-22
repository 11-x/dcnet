function escapeHTML(text) {
	let span=document.createElement('span');
	span.innerText=text;
	return span.innerHTML;
}

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

		let doc_body=document.getElementsByTagName("body")[0];

		this._head=document.createElement("div");
		doc_body.appendChild(this._head);

		this._body=document.createElement("div");
		doc_body.appendChild(this._body);
	}

	async close() {
		if (this._target) {
			let closing=window[this._target+'_closing'];

			if (typeof closing=="function")
				await closing();
		}

		this._body.innerHTML='';
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
			this._body.innerHTML='404 Not Found';
			return;
		} else if (resp.code!=200) {
			console.error(resp);
			return;
		}

		this._body.innerHTML=resp.data;

		if (set_new_state)
			window.history.pushState(target, target, target);

		if (typeof window[target+'_loaded']=="function")
			await window[target+'_loaded']();

		this._target=target;
	}

	error(msg) {
		page.go('error').then(() => {
			document.getElementById('err_div').innerText=msg;
		});
	}

	back() {
		history.back();
	}
}
