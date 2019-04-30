<?
	require_once('../inc/common.php');
	require_once('../inc/users.php');
	require_once('../inc/dreams.php');

	$form=json_decode(file_get_contents('php://input'));

	ob_start();
	var_dump($form);
	$dump=ob_get_clean();

	_log("dream_mod: " . file_get_contents('php://input') 
		. " // " . $dump);


	$dream_id=$form->id;
	$data=$form->data;

	if (!is_logged_in()) {
		respond(403, 'Not Logged In');
	}

	try {

		dream_update($dream_id, $data);
		respond(204, 'Dream Updated');
	
	} catch (Exception $x) {
		respond(500, $x->getMessage());
	}

?>
