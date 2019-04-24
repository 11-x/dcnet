<?
	require_once('users.php');

	if (!is_logged_in()) {
		redirect('entry.php');
	}

	respond(501, 'Not Implemented');
?>