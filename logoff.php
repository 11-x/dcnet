<?
	require('common.php');
	if (is_logged_in()) {
		unset($_SESSION['user']);
		redirect('/');
	}
?>