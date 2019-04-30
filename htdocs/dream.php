<?
	require('inc/themes.php');
	require('inc/users.php');
	require('inc/dreams.php');

	if (!is_logged_in()) {
		redirect("/");
	}

	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	echo '<?xml-stylesheet type="text/xsl" href="'
		. stylesheet_get('daywhite', 'ru', 'dream') . '"?>'."\n";
	
	header('Content-Type: text/xml');

	$user_id=get_logged_user();
	$username=get_user_info($user_id)['username'];

	if (!empty($_GET['id'])) {
		$dream_id=$_GET['id'];
		$author_id=!empty($_GET['author'])? $_GET['author']: $user_id;
		$dream_data=dream_get($author_id, $dream_id);
	} else {
		$dream_data=(object)array();
		$dream_id_xml="";
		$dream_id='';
	}

	$dream_data=htmlspecialchars(json_encode($dream_data));
?>
<dream>
	<scripts>
		<script>/js/common.js</script>
		<script>/js/dream.js</script>
	</scripts>
	<username><?=$username?></username>
	<back>/home.php</back>
	<dreamdata><?=$dream_data?></dreamdata>
	<dreamid><?=$dream_id?></dreamid>
</dream>
