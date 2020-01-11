class Auth {
	get username() {
		return localStorage.username;
	}

	is_logged_in() {
		return 'privkey' in localStorage;
	}
}

var auth=new Auth();
