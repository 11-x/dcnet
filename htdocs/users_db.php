<?php

require_once('common.php');

/**
 *	Get id of user currently logged in
 *
 *	@return string|null id of user (string) or NULL if no user is logged
 */
function get_logged_user()
{
	_validate_session();

	if (empty($_SESSION['logged_in_user_id'])) {
		return NULL;
	} else {
		return $_SESSION['logged_in_user_id'];
	}
}

function is_logged_in()
{
	return !empty(get_logged_user());
}

/**
 *	Ensure current session is valid
 *
 *	Purges reserved $_SESSION varables if session is invalid
 *	(e.g. expired or user is deleted).
 *
 *	@return void
 */
function _validate_session()
{
	if (empty($_SESSION['logged_in_user_id'])) {
		return;
	}

	if (!user_exists($_SESSION['logged_in_user_id'])) {
		unset($_SESSION['logged_in_user_id']);
	}
}

/**
 *	Check if user exists
 *
 *	@param string $user_id user id to check
 *
 *	@return bool True if user exists, False otherwise
 */
function user_exists($user_id)
{
	$users=_users_load();

	return array_key_exists($user_id, $users);
}

/**
 *	Load users database
 *
 *	Database path is specified in USERS_DB_PATH constant.
 *
 *	@return array db JSON-deserialized object
 */
function _users_load()
{
	if (!file_exists(USERS_DB_PATH)) {
		return array();
	} else {
		return json_loads(file_get_contents(USERS_DB_PATH));
	}
}

function _users_save($users)
{
	file_put_contents(USERS_DB_PATH, json_encode($users,
		JSON_PRETTY_PRINT));
}

/**
 *	Checks if a string is a valid username
 *
 *	Valid username matches regex: [_a-zA-Z][_a-zA-Z0-9]+
 *
 *	@param string $str A string to check
 *
 *	@return bool
 */
function is_valid_username($s)
{
	return preg_match('/^[_a-zA-Z][_a-zA-Z0-9]+$/', $s);
}

/**
 *	Add new user with given fields
 *
 *	@throws Exception On invalid or taken username or email
 *
 *	@param string $username Desired username
 *	@param string $pass_hash Serialized password hash
 *	@param string $salt	Serialized salt
 *	@param string|null (optional) Recovery e-mail, defaults to NULL
 *
 *	@return string|null Id of created user or NULL if user with
 *		given username exists.
 */
function add_user($username, $pass_hash, $salt, $email = NULL)
{
	if (!is_valid_username($username)) {
		throw new Exception('Invalid username: ' . $username);
	}

	_users_lock();
	try {
		$users=_users_load();

		$user_id = get_user_by_username($username);

		if (!empty($user_id)) {
			throw new Exception('Username exists: ' . $username);
		}

		$user_id=_gen_id($users);

		$users[$user_id]=array(
			'username' => $username,
			'pass_hash' => $pass_hash,
			'salt' => $salt,
			'email' => $email,
			'creation_timestamp' => time()
		);

		_users_save($users);

		return $user_id;
	} finally {
		_users_unlock();
	}
}

function update_user_info($user_id, $info)
{
	_users_lock();
	try {
		$users=_users_load();

		if (!array_key_exists($user_id, $users)) {
			throw new Exception('Invalid user id');
		}

		foreach ($info as $key => $val) {
			$users[$user_id][$key]=$val;
		}

		_users_save($users);

		return $user_id;
	} finally {
		_users_unlock();
	}
}

function login_user($user_id)
{
	$logged_user_id=get_logged_user();

	if (!empty($logged_user_id) && $logged_user_id!=$user_id) {
		throw new Exception('Already logged in as different user');
	}

	if (!user_exists($user_id)) {
		throw new Exception('Invalid user id');
	}

	$_SESSION['logged_in_user_id']=$user_id;
}

function logoff_user()
{
	if (!empty($_SESSION['logged_in_user_id'])) {
		unset($_SESSION['logged_in_user_id']);
	}
}

function _users_lock()
{
	global $_users_lock_file;
	if (empty($_users_lock_file)) {
		$_users_lock_file=fopen(".dblock", "w");
	}
	flock($_users_lock_file, LOCK_EX);
}
function _users_unlock()
{
	global $_users_lock_file;
	flock($_users_lock_file, LOCK_UN);
}
function get_user_by_username($username)
{
	$users=_users_load();

	foreach ($users as $user_id => $info) {
		if ($info['username']==$username) {
			return $user_id;
		}
	}

	return NULL;
}
function get_user_info($user_id)
{
	if (user_exists($user_id)) {
		return _users_load()[$user_id];
	}

	return NULL;
}
function remove_user($user_id)
{
	_users_lock();
	try {
		$users=_users_load();

		if (array_key_exists($user_id, $users)) {
			unset($users[$user_id]);
		}

		_users_save($users);
	} finally {
		_users_unlock();
	}
}
?>
