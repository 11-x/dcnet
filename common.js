function request(method, url, data, cb) {
	var xhr=new XMLHttpRequest();
	xhr.open(method, url, true);
	xhr.onreadystatechange=function() {
		if (this.readyState!=4) return;

		if (typeof(cb)!="undefined") {
			cb(this.status_code, this.responseText);
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
}

function store_user(user, pass)
{
	localStorage.setItem('user', user);
	localStorage.setItem('pass', pass);
}
