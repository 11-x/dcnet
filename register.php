<?

	require_once('themes.php');
	require_once('users.php');
	
	if (is_logged_in()) {
		redirect('/exit.php');
	}

	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	echo '<?xml-stylesheet type="text/xsl" href="'
		. stylesheet_get('daywhite', 'ru', 'register') . '"?>'."\n";
	
	header('Content-Type: text/xml');
?>
<register>
	<scripts>
		<script>/common.js</script>
		<script>/user.js</script>
		<script>/cipher.js</script>
		<script>/sjcl.js</script>
	</scripts>
	<cancel>/</cancel>
</register>
