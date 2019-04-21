function send_button_clicked(btn)
{
	var user=document.getElementById("user").value;
	var pass=document.getElementById("pass").value;
	var pass2=document.getElementById("pass2").value;
	var email_el=document.getElementById("email");

	var err_user=document.getElementById('err_user');
	err_user.innerText='';
	var err_pass=document.getElementById('err_pass'); 
	err_pass.innerText='';
	var err_pass2=document.getElementById('err_pass2');
	err_pass2.innerText='';
	var err_email=document.getElementById('err_email');
	err_email.innerText='';

	var fail=false;
	
	if (!is_valid_user(user)) {
		fail=true;
		alert('Not a valid user: ' + user);
	} else if (!is_valid_pass(pass)) {
		fail=true;
		alert('Not a valid pass');
	}

	if (pass2!=pass) {
		fail=true;
		alert('Pass confirmation missmatch');
	}

	if (!email_el.checkValidity()) {
		fail=true;
		err_email.innerText='not a e-mail';
		email_el.reportValidity();
	}

	if (fail) {
		return;
	}
	
	btn.disabled=true;

	console.log('okay');
	var xhr=new XMLHttpRequest();

	xhr.open("POST", "/adduser.php", true);

	xhr.onreadystatechange=function() {
		if (xhr.readyState==XMLHttpRequest.DONE) {
			btn.disabled=false;
			if (xhr.status==201) {
				store_user(user, pass);
				document.location.href='/';
			} else if (xhr.status==409) {
				err_user.innerText='user exists';	
			} else {
				alert('Something went wrong: ' + xhr.responseText);
				console.log(xhr);
			}
		}
	};

	salt=gen_salt(64);

	xhr.send(JSON.stringify({
		user: user,
		pass_hash: hash(pass, salt),
		salt: salt,
		email: email_el.value
	}));
}
