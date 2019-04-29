<?
	require_once('common.php');
	require_once('users.php');

	$user_id=get_logged_user();
	
	if ($user_id===NULL) {
		respond(403, 'Not Logged In');
	}

	$form=json_decode(file_get_contents('php://input'));

	if (!isset($form->user_id) || !isset($form->pass_hash)
			|| !isset($form->salt)) {
		respond(404, 'Bad Request');
	}

	$info=get_user_info($user_id);

	if ($form->salt != $info['salt']
			|| $form->pass_hash != $info['pass_hash']) {
		respond(403, 'Invalid Credentials');
	}

	if (isset($form->new_pass_hash)) {
		$info['pass_hash']=$form->new_pass_hash;
	}

	if (isset($form->email)) {
		$info['email']=$form->email;
	}

	try {
		update_user_info($user_id, $info);
	} catch (Exception $x) {
		respond(500, $x->getMessage());
	}

	echo var_dump($info) . "\n";
	respond(200, "Modified");
?>
