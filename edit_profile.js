function send_button_clicked()
{
	var user_id=document.getElementById('user_id').value;
	var salt=document.getElementById('salt').value;
	var cur_pass=document.getElementById('pass').value;
	var new_pass=document.getElementById('new_pass').value;
	var new_pass2=document.getElementById('new_pass2').value;
	var email_el=document.getElementById('email');
	var username=document.getElementById('username').innerText;

	if (cur_pass.length<8) {
		alert('not a valid current password');
		return;
	}

	if (new_pass.length<8 && new_pass!='') {
		alert('not a valid new password');
		return;
	}

	if (new_pass!=new_pass2) {
		alert('paswords mismatch');
		return;
	}

	if (!email.checkValidity()) {
		email.reportValidity();
		return;
	}

	var btn=document.getElementById('send_button');
	btn.disabled=true;

	treq(PUT, '/usermod.php', JSON.stringify({
		user_id: user_id,
		salt: salt,
		pass_hash: hash(cur_pass, salt),
		new_pass_hash: new_pass? hash(new_pass, salt): null,
		email: email.value
	}), function(code, reason, text) {
		if (code==200) {
			if (new_pass) {
				store_user(username, new_pass);
			}
			document.location.href='/';
		} else {
			console.error(code, reason, text);
			alert('something went wrong: ' + code + ' ' + reason
				+ '\n' + text);
		}
		btn.disabled=false;
	});
}
