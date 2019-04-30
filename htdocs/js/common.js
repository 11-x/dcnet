var GET='GET';
var PUT='POST'; // Use POST instead of PUT to increase compatibility
var DELETE='POST'; // Use POST instead of DELETE to increase compatibility
var POST='POST';

function treq(method, url, data, cb) {
	var xhr=new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.onreadystatechange=function() {
		if (this.readyState!=4) return;

		if (this.responseText.indexOf('<b>Parse error</b>')!=-1) {
			console.error(this.status, this.statusText, this.responseText);
		} else {
			console.log(this.status, this.statusText, this.responseText);
		}
		if (typeof(cb)!="undefined") {
			cb(this.status, this.statusText, this.responseText);
		}
	}
	xhr.send(data);
}

function is_valid_user(user)
{
	return user.length>=2 && user.length<=32;
}

function is_valid_pass(pass)
{
	return pass.length>=8;
}

function body_onload()
{
	var foc=document.getElementsByClassName('start_focus');
	if (foc.length>0) {
		foc[0].focus();
	}

	document.getElementById("bottom_spacer").style.height=0.33*
		document.body.clientHeight;
	body_resize();

	var bt=document.getElementById('bodytable');
	if (bt.clientWidth>600)
		bt.style.width=600;
}

function store_user(user, pass)
{
	if (typeof(user)!="undefined") {
		localStorage.setItem('user', user);
	} else {
		localStorage.removeItem('user');
	}
	if (typeof(pass)!="undefined") {
		localStorage.setItem('pass', pass);
	} else {
		localStorage.removeItem('pass');
	}
	console.log(localStorage);
}

function body_resize()
{
	console.log(window.innerWidth, window.innerHeight);
}
