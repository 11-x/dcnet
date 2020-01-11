class Node {
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
}

var node=new Node();
