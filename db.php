<?

$DB_PATH="users.dump";
$_db_file=NULL;

function _dblock()
{
	global $_db_file;

	if (empty($_db_file)) {
		$_db_file=fopen(".dblock", "w");
	}

	flock($_db_file, LOCK_EX, 1);
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

	$users=unserialize(file_get_contents($DB_PATH));

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

?>
