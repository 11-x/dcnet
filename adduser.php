<?
	require('common.php');
	require('users.php');

	if (get_logged_user()!==NULL) {
		respond(403, 'Already Logged In');
	}
	$form=json_decode(file_get_contents('php://input'));

	if (!isset($form->user) || !isset($form->pass_hash)
			|| !isset($form->salt)) {
		respond(404, 'Bad Request');
	}

	$email=isset($form->email)? $form->email: NULL;

	try {
		$user_id=add_user($form->user, $form->pass_hash, $form->salt,
			$email);

		login_user($user_id);
	} catch (Exception $e) {
		respond(500, $e->getMessage());
	}

	respond(201, 'User Created');
?>
