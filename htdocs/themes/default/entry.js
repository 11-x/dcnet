function body_onload()
{
	var el_username=document.getElementById('username');
	var el_pass=document.getElementById('pass');

	el_username.focus();

	if (dcn.get_username()) {
		el_username.value=dcn.get_username();
		el_pass.focus();
	}
	
	if (dcn.get_pass()) {
		el_pass.value=dcn.get_pass();
		if (el_username.value)
			document.getElementById('login_btn').focus();
	}
}

function login_btn_clicked()
{
	dcn.login(
		document.getElementById('username').value,
		document.getElementById('pass').value,
		function() {
			window.location.href="home.html";
		},
		function(err_msg) {
			alert('login failed: ' + err_msg);
		}
	);
}
		
function forget()
{
	dcn.purge();
	location="/";
}

function input_keypressed()
{
	if (event.key=="Enter") {
		login_btn_clicked();
	}
}
