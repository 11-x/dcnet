<?
	require_once('common.php');
	require_once('users_db.php');

	function _err_handler($errno, $errstr, $errfile, $errline, $errctx)
	{
		throw new Exception("ERROR ($errno): $errstr "
			. "in $errfile at $errline");
	}

	function get_salt($username)
	{
		$user_id=get_user_by_username($username);

		if (empty($user_id)) {
			// TODO respond with quasi-salt instead
			respond(404, 'No Such User');
		}

		$info=get_user_info($user_id);

		respond_json(200, 'OK', $info['salt']);
	}

	function do_login($username, $pass_hash)
	{
		$user_id=get_user_by_username($username);

		if ($user_id===NULL) {
			respond(403, 'Invalid Credentials');
		}

		$info=get_user_info($user_id);

		if ($pass_hash!=$info['pass_hash']) {
			respond(403, 'Invalid Credentials');
		}

		$_SESSION['logged_in_user_id']=$user_id;

		respond_json(200, 'Logged In', $info);
	}

	function update_profile($items)
	{
		$user_id=get_logged_user();

		if (array_key_exists('pass_hash', $items)) {
			if (!array_key_exists('salt', $items))
				respond_text(400, 'Bad Request', "Error: no 'salt', but "
					. "'pass_hash' present");
		}

		foreach ($items as $key => $value) {
			if ($key!='pass_hash' &&
				$key!='salt' &&
				$key!='email')
			{
				respond_text(400, 'Bad Request', "Error: invalid item: "
					. $key);
			}
		}

		update_user_info($user_id, $items);
		respond_json(200, "Modified", get_user_info($user_id));
	}

	try {
		set_error_handler(_err_handler);

		if ($_SERVER['REQUEST_METHOD']=='GET') {
			if (empty($_GET['cmd'])) {
				respond_text(400, 'Bad Request', "Error: 'cmd' not set");
			}

			switch($_GET['cmd']) {
				case "get_user_info":
					$user_id=get_logged_user();
					if (!empty($user_id)) {
						respond_json(200, 'Logged In',
							get_user_info($user_id));
					} else {
						respond(204, 'Not Logged In');
					}
					break;
				case "logoff":
					unset($_SESSION['logged_in_user_id']);
					respond(204, 'Logged Off');
					break;
				default:
					throw new Exception("'cmd' not recognized: "
						. $_GET['cmd']);
			}
		} elseif ($_SERVER['REQUEST_METHOD']=='POST') {
			$cmd=json_loads(file_get_contents('php://input'));

			switch (_get($cmd['cmd'], NULL)) {
				case 'register':
					add_user($cmd['username'], $cmd['pass_hash'],
						$cmd['salt'], _get($cmd['email'], NULL));
					respond(201, 'User Registered');
					break;
				case 'get_salt':
					get_salt($cmd['username']);
					break;
				case 'login':
					do_login($cmd['username'], $cmd['pass_hash']);
					break;
				case 'update_profile':
					update_profile($cmd['items']);
					break;
				default:
					throw new Exception("'cmd' not recognized: "
						. json_encode($cmd));
			}
		} else {
			throw Exception('Method not supported: '
				. $_SERVER['REQUEST_METHOD']);
		}
	} catch (Exception $x) {
		respond_text(500, 'Exception', $x->getMessage());
	} finally {
		set_error_handler(NULL);
	}
?>
