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

