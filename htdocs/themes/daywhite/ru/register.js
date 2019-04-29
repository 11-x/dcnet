function register_btn_clicked()
{
	var btn=document.getElementById("register_btn");
	var user=document.getElementById("user").value;
	var pass=document.getElementById("pass").value;
	var pass2=document.getElementById("pass2").value;
	var email_el=document.getElementById("email");

	btn.disabled=true;
	
	user_register(user, pass, pass2, email.value, function(res){
		if (res['code']==0) {
			window.location.href=res['redirect'];
		} else {
			alert('Register failed: ' + res['code'] 
				+ ': ' + res['error_message']);
		}
		
		btn.disabled=false;
	});
}

