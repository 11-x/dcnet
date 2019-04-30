<?
	require_once('../inc/common.php');
	require_once('../inc/users.php');
	require_once('../inc/dreams.php');

	$data=json_decode(file_get_contents('php://input'));

	if (!is_logged_in()) {
		respond(403, 'Not Logged In');
	}

	try {

		$id=dream_add($data);
		trespond(201, 'Dream Created', $id);
	
	} catch (Exception $x) {
		respond(500, $x->getMessage());
	}

?>
