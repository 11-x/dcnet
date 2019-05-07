<?
	require_once('common.php');
	require_once('dreams_db.php');

	try {
		set_error_handler(_err_handler);

		if ($_SERVER['REQUEST_METHOD']=='GET') {
			if (empty($_GET['cmd'])) {
				respond_text(400, 'Bad Request', "Error: 'cmd' not set");
			}

			switch($_GET['cmd']) {
				case "fetch_ts":
					if (empty($_GET['user_id'])) {
						respond(400, 'fetch: user_id not specified');
					}
					$user_id=$_GET['user_id'];
					$dreams=_dreams_load($user_id);
					$timestamp=$_dreams_last_timestamp;
					_log("last ts: $timestamp for $user_id");
					respond_text(200, 'OK', $timestamp);
					break;
				case "fetch":
					if (empty($_GET['user_id'])) {
						respond(400, 'fetch: user_id not specified');
					}
					$user_id=$_GET['user_id'];
					$dreams=_dreams_load($user_id);
					$timestamp=$_dreams_last_timestamp;
					if (empty($_GET['dream_id'])) {
						respond_text(200, 'OK',
							json_dumps(array(
								"dreams" => $dreams,
								"timestamp" => $timestamp
							))
						);
					} else {
						$dream_id=$_GET['dream_id'];
						if (array_key_exists($dream_id, $dreams)) {
							respond_text(200, 'OK',
								json_dumps($dreams[$dream_id]));
						} else {
							respond_text(404, 'Dream Not Found');
						}
					}
					break;
				case "delete":
					if (empty($_GET['dream_id']))
						respond(400, "'dream_id' not set");
					$dream_id=$_GET['dream_id'];
					dream_delete($dream_id);
					respond(204, 'Deleted');
					break;
				default:
					throw new Exception("'cmd' not recognized: "
						. $_GET['cmd']);
			}
		} elseif ($_SERVER['REQUEST_METHOD']=='POST') {
			$cmd=json_loads(file_get_contents('php://input'));

			switch (_get($cmd['cmd'], NULL)) {
				case 'add':
					$dream_id=dream_add($cmd['data']);
					respond_text(201, 'Dream Created', $dream_id);
					break;
				case 'update':
					dream_update($cmd['dream_id'], $cmd['data']);
					respond(204, 'Dream Updated');
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
