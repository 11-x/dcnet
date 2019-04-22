<?
$DB_PATH="users.dump";
$_db_file=NULL;
function _dblock()
{
	global $_db_file;
	if (empty($_db_file)) {
		$_db_file=fopen(".dblock", "w");
	}
	flock($_db_file, LOCK_EX);
}
function _dbunlock()
{
	global $_db_file;
	flock($_db_file, LOCK_UN);
}
function db_add_user($user, $pass_hash, $salt, $email="")
{
	global $DB_PATH;
	_dblock();

	if (file_exists($DB_PATH)) {
		$users=unserialize(file_get_contents($DB_PATH));
	} else {
		$users=array();
	}	
	_log("key $user exists in " . var_dump($users) . " "
		. array_key_exists($user, $users));
	if (array_key_exists($user, $users)) {
		_dbunlock();
		return array(409, "User Exists");
	}
	$users[$user]=array('pass_hash' => $pass_hash,
		'salt' => $salt, 'email' => $email);
	
	file_put_contents($DB_PATH, serialize($users));
	_dbunlock();
	return array(201, "User Created");
}

function db_get_user_info($user)
{
	global $DB_PATH;
	_dblock();

	if (file_exists($DB_PATH)) {
		$users=unserialize(file_get_contents($DB_PATH));
		_dbunlock();
	} else {
		_dbunlock();
		return;
	}	

	if (!array_key_exists($user, $users)) {
		return;
	} else {
		return $users[$user];
	}
}

function db_del_user($user)
{
	global $DB_PATH;
	_dblock();

	if (file_exists($DB_PATH)) {
		$users=unserialize(file_get_contents($DB_PATH));
	} else {
		$users=array();
	}	
	if (!array_key_exists($user, $users)) {
		_dbunlock();
		return array(404, "No Such User");
	}
	unset($users[$user]);
	
	file_put_contents($DB_PATH, serialize($users));
	_dbunlock();
	return array(204, "User Deleted");
}
?>
