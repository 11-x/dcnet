function input_keypressed()
{
	if (event.key=="Enter") {
		login_btn_clicked();
	}
}
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

	if (user_filled)
		document.getElementById('pass').focus();
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

		treq('GET', '/getsalt.php?user=' + encodeURIComponent(user),
				undefined, function(code, reason, text) {
			if (code!=200) {
				alert('Failed to fetch salt: ' + code + ' ' + reason
					+ '\n' + text);
				btn.disabled=false;
			} else {
				var salt=JSON.parse(text);
				var h=hash(pass, salt);
				console.log('got salt:', salt);

				treq('POST', '/login.php', JSON.stringify({
					user: user,
					hash: hash(pass, salt),
					salt: salt
				}), function(code, reason, text) {
					console.log('login result:', code, reason, text);
					if (code!=200) {
						alert('login failed: ' + code + ' ' + reason
							+ '\n' + text);
						btn.disabled=false;
					} else {
						// success
						store_user(user, pass);
						window.location.href='/';
					}
				});
			}
		});
	}
}

function send_email(addr)
{
	document.location.href=('/send.php?addr=' + encodeURIComponent(addr));
}
