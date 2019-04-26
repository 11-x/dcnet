<?

	require_once('themes.php');
	require_once('users.php');
	
	if (!is_logged_in()) {
		redirect('/');
	}

	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	echo '<?xml-stylesheet type="text/xsl" href="'
		. stylesheet_get('daywhite', 'ru', 'profile') . '"?>'."\n";
	
	header('Content-Type: text/xml');

	$user_id=get_logged_user();
	$info=get_user_info($user_id);
	$username=$info['username'];
	$email=empty($info['email'])? '': $info['email'];
	$salt=$info['salt'];
?>
<profile>
	<scripts>
		<script>/common.js</script>
		<script>/user.js</script>
		<script>/cipher.js</script>
		<script>/sjcl.js</script>
	</scripts>
	<userid><?=$user_ud?></userid>
	<salt><?=$salt?></salt>
	<username><?=$username?></username>
	<email><?=$email?></email>
	<exit>/home.php</exit>
</profile>
