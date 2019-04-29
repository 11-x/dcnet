<?
	require('inc/themes.php');
	require('inc/users.php');

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
		<script>/js/common.js</script>
		<script>/js/user.js</script>
		<script>/js/cipher.js</script>
		<script>/js/sjcl.js</script>
	</scripts>
	<username><?=$username?></username>
	<back>/home.php</back>
</dream>
