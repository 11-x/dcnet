function save_btn_clicked()
{
	var btn=document.getElementById("save_btn");
	var user=document.getElementById("user").value;
	var user_id=document.getElementById("user_id").value;
	var salt=document.getElementById("salt").value;
	var pass=document.getElementById("pass").value;
	var new_pass=document.getElementById("new_pass").value;
	var new_pass2=document.getElementById("new_pass2").value;
	var email_el=document.getElementById("email");

	btn.disabled=true;
	
	user_update(user_id, user, pass, salt, new_pass, new_pass2, email.value,
			function(res){
		if (res['code']==0) {
			window.location.href=res['redirect'];
		} else {
			alert('Profile update failed: ' + res['code'] 
				+ ': ' + res['error_message']);
		}
		
		btn.disabled=false;
	});
}

