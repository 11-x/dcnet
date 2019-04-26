<?

	require_once('themes.php');
	require_once('users.php');
	
	if (!is_logged_in()) {
		redirect('/');
	}

	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	echo '<?xml-stylesheet type="text/xsl" href="'
		. stylesheet_get('daywhite', 'ru', 'home') . '"?>'."\n";
	
	header('Content-Type: text/xml');

	$username=get_user_info(get_logged_user())['username'];
?>
<home>
	<scripts>
		<script>/common.js</script>
		<script>/user.js</script>
		<script>/cipher.js</script>
		<script>/sjcl.js</script>
	</scripts>
	<username><?=$username?></username>
	<logoff>/logoff.php</logoff>
	<profile>/profile.php</profile>
</home>
