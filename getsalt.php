<?php

	require_once('common.php');
	require_once('users.php');

	if (!array_key_exists('user', $_GET)) {
		respond(400, 'Bad Request');
	}

	$username =$_GET['user'];

	$user_id=get_user_by_username($username);

	if (empty($user_id)) {
		respond(404, 'No Such User');
	}

	$info=get_user_info($user_id);

	jrespond(200, 'OK', $info['salt']);
?>
