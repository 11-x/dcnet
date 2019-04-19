function body_onload()
{
	var foc=document.getElementsByClassName('start_focus');
	if (foc.length>0) {
		foc[0].focus();
	}
	console.log(foc);	

	document.getElementById("bottom_spacer").style.height=0.33*
		document.body.clientHeight;
}

function store(user, pass)
{
	localStorage.setItem('user', user);
	localStorage.setItem('pass', pass);
}
