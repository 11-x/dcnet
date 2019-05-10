function register_btn_clicked()
{
	var btn=document.getElementById("register_btn");
	var user=document.getElementById("user").value;
	var pass=document.getElementById("pass").value;
	var pass2=document.getElementById("pass2").value;

	if (pass!=pass2) {
		alert('pass and confirmation missmatch');
		return;
	}

	btn.disabled=true;
	
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