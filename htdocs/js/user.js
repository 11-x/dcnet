function is_valid_username(username)
{
	return typeof(username)=="string" &&
		username.match(/^[_a-zA-Z][_a-zA-Z0-9]+$/)!==null;
}
function is_valid_pass(pass)
{
	return typeof(pass)=="string" && pass.length>=8 && pass.length<=32;
}
function is_valid_email(email)
{
	var el=document.createElement('input');
	el.type="email";
	el.value=email;
	return el.checkValidity();
}

function user_login(username, pass, cb)
{
	if (!is_valid_username(username)) {
		cb({code: 1, error_message: "username invalid"});
		return;
	}

	if (!is_valid_pass(pass)) {
		cb({code: 2, error_message: "pass invalid"});
		return;
	}

	treq('GET', '/api/getsalt.php?username='
			+ encodeURIComponent(username),
			undefined, function(code, reason, text) {
		if (code!=200) {
			cb({
				code: 3,
				error_message: "salt fetch failed: " + code + " "
					+ reason + "\n" + text});
		} else {
			var salt=JSON.parse(text);
			var pass_hash=hash(pass, salt);

			cb(_user_login_hash(username, pass_hash, pass, cb));
		}
	});
}
function _user_login_hash(username, pass_hash, pass, cb)
{
	treq('POST', '/api/login.php', JSON.stringify({
		username: username,
		pass_hash: pass_hash
	}), function(code, reason, text) {
		if (code!=200) {
			cb({
				code: 4,
				error_message: "login failed: " + code + " "
					+ reason + "\n" + text
			});
		} else {
			localStorage['username']=username;
			localStorage['pass']=pass;
			cb({
				code: 0,
				redirect: "/"
			});
		}
	});
}
function user_register(username, pass, pass2, email, cb)
{
	if (!is_valid_username(username)) {
		cb({code: 1, error_message: "username invalid"});
		return;
	}

	if (!is_valid_pass(pass)) {
		cb({code:2, error_message: "pass invalid"});
		return;
	}

	if (pass!=pass2) {
		cb({code:3, error_message: "passwords missmatch"});
		return;
	}

	if (!is_valid_email(email)) {
		cb({code: 4, error_message: "email invalid"});
		return;
	}

	var salt=gen_salt(64);

	treq('POST', '/api/adduser.php', JSON.stringify({
		username: username,
		salt: salt,
		pass_hash: hash(pass, salt),
		email: email
	}), function(code, reason, text) {
		if (code==201) {
			localStorage['username']=username;
			localStorage['pass']=pass;
			cb({code: 0, redirect: "/"});
		} else if (code==409) {
			cb({code: 5, error_message: "username exists"});
		} else {
			cb({code: 6, error_message: "register failed: " + code
				+ " " + reason + "\n" + text});
		}
	});
}
function user_get_stored_username()
{
	return localStorage['username'];
}

function user_get_stored_pass()
{
	return localStorage['pass'];
}
function user_clear_storage()
{
	localStorage.clear();
}
function user_update(user_id, username, pass, salt, new_pass, new_pass2,
	email, cb)
{
	if (!is_valid_username(username)) {
		cb({code: 1, error_message: "username invalid"});
		return;
	}

	if (!is_valid_pass(pass)) {
		cb({code: 2, error_message: "pass invalid"});
		return;
	}

	if (new_pass || new_pass2) {
		if (!is_valid_pass(new_pass)) {
			cb({code: 3, error_message: "new pass invalid"});
			return;
		}
		if (new_pass != new_pass2) {
			cb({code: 4, error_message: "passwords missmatch"});
			return;
		}
	}

	if (!is_valid_email(email)) {
		cb({code: 5, error_message: "email invalid"});
		return;
	}

	treq(PUT, '/api/usermod.php', JSON.stringify({
		user_id: user_id,
		salt: salt,
		pass_hash: hash(pass, salt),
		new_pass_hash: new_pass? hash(new_pass, salt): null,
		email: email
	}), function(code, reason, text) {
		if (code==200) {
			if (new_pass) {
				localStorage['username']=username;
				localStorage['pass']=new_pass;
			}
			cb({code: 0, redirect: "/profile.php"});
			return;
		} else {
			cb({code: 6, error_message: "profile update failed: "
				+ code + " " + reason + "\n" + text});
			return;
		}
	});
}
