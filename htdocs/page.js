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

		this.require(target);
		this.body.innerHTML=(await node.request("GET", "htdocs/" + target 
			+ ".html")).data;

		if (typeof page_loaded=="function")
			await page_loaded();
	}

	async require(target) {
		let script=document.createElement("script");
		script.innerHTML=(await node.request("GET", "htdocs/" + target
			+ ".js")).data;
		page.head.appendChild(script);
	}
}

var page=new Page();
