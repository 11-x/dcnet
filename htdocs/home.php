<?

	require_once('inc/themes.php');
	require_once('inc/users.php');
	
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
		<script>/js/common.js</script>
		<script>/js/user.js</script>
		<script>/js/cipher.js</script>
		<script>/js/sjcl.js</script>
	</scripts>
	<username><?=$username?></username>
	<logoff>/logoff.php</logoff>
	<profile>/profile.php</profile>
	<adddream>/dream.php</adddream>
	<querydreams>/dreams.php</querydreams>
</home>
