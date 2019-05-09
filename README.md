# DCNet
Dreams Cartography Network

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

	POST /dreams.php { "cmd": "logoff" }

End user session

Returns:

	204 Successfully logged off
	401 Not logged in

### Get users

	GET /dreams.php?cmd=get_users

Get list of all users with some statistics.

Returns:

	200 <json object>

JSON object is the "user_id" => {info} object (see 'Get user info'
section for details) with some additional fields added to info:

	{
		...
		"total_dreams": <total dreams count>
		...
	}

Other fields may be added (or removed).


