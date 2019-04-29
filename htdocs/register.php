<?

	require_once('inc/themes.php');
	require_once('inc/users.php');
	
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
		<script>/js/common.js</script>
		<script>/js/user.js</script>
		<script>/js/cipher.js</script>
		<script>/js/sjcl.js</script>
	</scripts>
	<cancel>/</cancel>
</register>
