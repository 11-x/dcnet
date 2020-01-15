function register_loaded()
{
	arrange('body_content', 200);

	document.getElementById("user").focus();
}


async function register_btn_clicked()
{
	var btn=document.getElementById("register_btn");
	var user=document.getElementById("user").value;
	var pass=document.getElementById("pass").value;
	var pass2=document.getElementById("pass2").value;

	if (!user) {
		alert('invalid username');
		document.getElementById("user").focus();
		return;
	}

	if (pass!=pass2) {
		alert('pass and confirmation missmatch');
		return;
	}

	btn.disabled=true;

	let err=await node.register(user, pass);

	console.log(err);

	if (err) {
	} else {

	}

	throw "not implemented";
	
	dcn.register(user, pass, undefined, function()
	{
		dcn.login(user, pass, function() {
			window.location.href="/";
		}, function(err_msg) {
			alert('Registration OK, but login failed: ' + err_msg);
			btn.disabled=false;
		});
	}, function(err_msg) {
		alert('Registration failed: ' + err_msg);
		btn.disabled=false;
	});
}
