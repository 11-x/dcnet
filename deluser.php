<?php
	require('common.php');
	require('users.php');

	$user_id=get_logged_user();

	if (!empty($user_id)) {
		logoff_user();
		remove_user($user_id);
	}

	redirect('/');
?>
