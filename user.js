function is_valid_username(username)
{
	return typeof(username)=="string" &&
		username.match(/^[_a-zA-Z][_a-zA-Z0-9]+$/)!==null;
}
function is_valid_pass(pass)
{
	return typeof(pass)=="string" && pass.length>=8 && pass.length<=32;
}
function user_login(username, pass, cb)
{
	if (!is_valid_username(username)) {
		cb({code: 1, error_message: "username invalid"});
	}

	if (!is_valid_pass(pass)) {
		cb({code: 2, error_message: "pass invalid"});
	}

	treq('GET', '/getsalt.php?username=' + encodeURIComponent(username),
			undefined, function(code, reason, text) {
		if (code!=200) {
			cb({
				code: 3,
				error_message: "salt fetch failed: " + code + " "
					+ reason + "\n" + text});
		} else {
			var salt=JSON.parse(text);
			var pass_hash=hash(pass, salt);

			return _user_login_hash(username, pass_hash, pass, cb);
		}
	});
}
function _user_login_hash(username, pass_hash, pass, cb)
{
	treq('POST', '/login.php', JSON.stringify({
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
