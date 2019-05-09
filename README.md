# DCNet
Dreams Cartography Network

## Node API

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

### Logoff


