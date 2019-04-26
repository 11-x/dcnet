function login_btn_clicked()
{
	var btn=document.getElementById("login_btn");
	var user=document.getElementById("user").value;
	var pass=document.getElementById("pass").value;

	btn.disabled=true;
	
	user_login(user, pass, function(res){
		if (res['code']==0) {
			window.location.href=res['redirect'];
		} else {
			alert('Login failed: ' + res['code'] 
				+ ': ' + res['error_message']);
		}
		
		btn.disabled=false;
	});
}

function body_onload()
{
	var user=document.getElementById("user");
	var pass=document.getElementById("pass");

	var stored_user=user_get_stored_username();
	var stored_pass=user_get_stored_pass();

	if (stored_user) {
		user.value=stored_user;
	}
	if (stored_pass) {
		pass.value=stored_pass;
	}
}
function forget()
{
	user_clear_storage();
	document.location.href=document.location.href;
}
