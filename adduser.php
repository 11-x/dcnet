<?
	require('common.php');
	require('db.php');

	if (is_logged_in()) {
		respond(403, 'Already Logged In');
	}

	$form=json_decode(file_get_contents('php://input'));

	$res=db_add_user($form->user, $form->pass_hash, $form->salt,
			$form->email);
	
	$respond($res[0], $res[1]);
?>
