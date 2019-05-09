# DCNet
Dreams Cartography Network

Documentation:

- Node API (HTTP)
- User/dream data JSON format (for transfer or storage)
- Point API (Javascript)
- SESSION variables conventions
- localStorage variables conventions

## Node API

"GET" requests must contain cmd=<command> field, which defines the
action. "POST" requests accept data as JSON object, which must contain
the "cmd": <string> field. Other fields in both "GET" and "POST"
requests may exist to further define command.

"DELETE" and "PUT" requests are not supported for compatibility (some
hostings do not allow other methods than "GET" and "POST"). Instead
"GET" and "POST" are used correspondently.

If a request is malformed, response code 400 is returned. In case of
an internal error any request may return response code 500. Other
responses are request-dependent and are described below.

### Get user info

	GET /dreams.php?cmd=get_user_info
	GET /dreams.php?cmd=get_user_info&user_id=<userid>

Get info on a user by user_id. If no user_id is specified info on logged
in user is returned.

Returns:

	200 (info as json)
	204 No user_id is specified and no user is logged in
	400 Invalid user_id
	404 No user with such user_id exists

Format of info object:

	{
		"username": "<user name>",
		"pass_hash": "<pass hash>",
		"salt": "<salt>",
		"email": "<email>" | "" | null,
		"creation_timestamp": <timestamp>
	}

Other fields may be added later, or some may dissappear.

### Logoff

	(DELETE) GET /dreams.php?cmd=logoff

End user session

Returns:

	204 Successfully logged off
	401 Not logged in

### Get users

	GET /dreams.php?cmd=get_users

Get list of all users with some statistics.

Returns:

	200 <users object as json>

JSON object is the "user_id" => {info} object (see 'Get user info'
section for details) with some additional fields added to info:

	{
		...
		"total_dreams": <total dreams count>
		...
	}

Other fields may be added (or removed).

### Register user

	POST /users.php {
		"cmd": "register",
		"username": "<user name>",
		"pass_hash": "<pass hash>",
		"salt": "<salt>",
		"email": "<email>", (optional, defaults to null)
	}

Register a new user.

Returns:

	201 <user_id as text> User registered
	400 Invalid username, pass_hash, salt or email
	403 Username or email is taken

### Get salt

	GET /users.php?cmd=get_salt&username=<user_id>

Get salt for user by username.

Returns:

	200 (salt as text)
	404 No user exists with such username

### Login

	POST /users.php {
		"cmd": "login",
		"username": "<user name>",
		"pass_hash": "<pass hash>",
	}

Start session with given credentials.

Returns:

	200 <info as json> Logged in
	403 Invalid credentials

### Update user profile

	(PUT) POST /users.php {
		"cmd": "update_profile",
		"pass_hash": "<hash>",
		"salt": "<salt>",
		"email": "<email>"
	}

All fields except "cmd" are optional. Fields "pass_hash" and "salt"
must be set together (if set at all).

Returns:

	200 <updated info as json> Modified
	400 Some fields are invalid

### Delete (unregister) user

	GET /users.php?cmd=delete

Delete currenty logged in user. Must be logged in. Does not delete user
data (dreams, etc.). Later username can be taken by other user.

Returns:

	204 User deleted
	403 Not logged in


### Fetch current timestamp

	GET /dreams.php?cmd=fetch_ts&user_id=<user_id>

Get timestamp of last modification of dreams database for current
user (to check if an update is needed).

Returns:

	200 <timestamp as text>
	400 User id not specified

### Fetch dream data

	GET /dreams.php?cmd=fetch&user_id=<user_id>
	GET /dreams.php?cmd=fetch&user_id=<user_id>&dream_id=<dream_id>

Get dream(s) data. If dream_id is specified, one dream is returnd.
It not, all dreams are returned.

Returns:

	200 <dreams data as json>
	404
