function gate_onload()
{
	var el_username=document.getElementById('username');
	var el_pass=document.getElementById('pass');

	el_username.focus();

	if (typeof dcn.username != "undefined") {
		el_username.value=dcn.username;
		el_pass.focus();
	}
	
	if (typeof dcn.pass != "undefined") {
		el_pass.value=dcn.pass;
		if (el_username.value)
			document.getElementById('login_btn').focus();
	}
}

function login_btn_clicked()
{
	var btn=document.getElementById('login_btn');
	btn.disabled=true;
	let username=document.getElementById('username').value;
	let pass=document.getElementById('pass').value;

	dcn.set_credentials(username, pass).then(()=>{
		location="/home?self=" + dcn.uid;
	}).catch((err)=>{
		alert('Login failed: ' + err);
		btn.disabled=false;
	});
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
