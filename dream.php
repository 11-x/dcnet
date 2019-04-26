<?
	require('themes.php');
	require('users.php');

	if (!is_logged_in()) {
		redirect("/");
	}

	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	echo '<?xml-stylesheet type="text/xsl" href="'
		. stylesheet_get('daywhite', 'ru', 'dream') . '"?>'."\n";
	
	header('Content-Type: text/xml');

	$username=get_user_info(get_logged_user())['username'];
?>
<dream>
	<scripts>
		<script>/common.js</script>
		<script>/user.js</script>
		<script>/cipher.js</script>
		<script>/sjcl.js</script>
	</scripts>
	<username><?=$username?></username>
	<back>/home.php</back>
</dream>
