<?
	require_once('users.php');

	if (!is_logged_in()) {
		redirect('entry.php');
	} else {
		redirect('home.php');
	}
?>
