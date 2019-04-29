<?
	require_once('inc/themes.php');
	require_once('inc/users.php');
	
	if (is_logged_in()) {
		redirect('/exit.php');
	}

	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	echo '<?xml-stylesheet type="text/xsl" href="'
		. stylesheet_get('daywhite', 'ru', 'entry') . '"?>'."\n";
	
	header('Content-Type: text/xml');
?>
<entry>
	<scripts>
		<script>/js/sjcl.js</script>
		<script>/js/user.js</script>
		<script>/js/cipher.js</script>
		<script>/js/common.js</script>
	</scripts>
	<register>/register.php</register>
	<readme>/readme.php</readme>
</entry>
