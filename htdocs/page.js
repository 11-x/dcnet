class Page
{
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

	async go(target) {
		if (typeof page_closing=="function")
			await page_closing();

		this.head.innerHTML='';
		this.body.innerHTML='';

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

		if (typeof page_loaded=="function")
			await page_loaded();
	}

	async require(target) {
		let resp=await node.request("GET", "htdocs/" + target + ".js");

		if (resp.code!=200) {
			console.warn(resp);
			return;
		}

		let script=document.createElement("script");
		script.innerHTML=resp.data;
		page.head.appendChild(script);
	}
}

var page=new Page();
