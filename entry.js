function entry_onload()
{
	var user_filled=false, pass_filled=false;
	if ('user' in localStorage) {
		document.getElementById('user').value=localStorage['user'];
		user_filled=true;
	}	
	if ('pass' in localStorage) {
		document.getElementById('pass').value=localStorage['pass'];
		pass_filled=true;
	}

	if (user_filled && pass_filled)
		document.getElementById('enter_btn').focus();
}

function purge()
{
	localStorage.clear();
	document.location.href='/';
}                             

function login_btn_clicked()
{
	var btn=document.getElementById("enter_btn");

	var user=document.getElementById('user').value;
	var pass=document.getElementById('pass').value;

	if (!is_valid_user(user)) {
		alert('not a valid username: ' + user);
	} else if (!is_valid_pass(pass)) {
		alert('not a valid pass');
	} else {
		btn.disabled=true;

		jget('/getsalt.php?user=' + encodeURIComponent(user),
				function(salt) {
			var h=hash(pass, salt);
			jpost('/login.php', JSON.stringify({
				user: user,
				hash: hash(pass, salt),
				salt: salt
			}), function(res) {
				// success
				store_user(user, pass);
				window.location.href='/';
			}, function(code, reason) {
				alert('login failed: ' + code + ' ' + reason);
				btn.disabled=false;
			});
		});
	}	
}