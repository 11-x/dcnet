<?
	require('inc/themes.php');
	require('inc/users.php');
	require('inc/dreams.php');

	if (!is_logged_in()) {
		redirect("/");
	}

	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	echo '<?xml-stylesheet type="text/xsl" href="'
		. stylesheet_get('daywhite', 'ru', 'dreams') . '"?>'."\n";
	
	header('Content-Type: text/xml');

	$user_id=get_logged_user();
	$username=get_user_info($user_id)['username'];

	$dreams=_dreams_load($user_id);

	function get_caption($id, $dream)
	{
		if (!empty($dream['title'])) {
			return $dream['title'];
		} else {
			return $id;
		}
	}
?>
<dreams>
	<scripts>
		<script>/js/common.js</script>
		<script>/js/dream.js</script>
	</scripts>
	<username><?=$username?></username>
	<back>/home.php</back>
	<dreams>
		<?
			foreach ($dreams as $id => $dream) {
				echo "<dream>\n";
				echo "\t<id>$id</id>\n";
				echo "\t<title>" . get_caption($id, $dream)
					. "</title>\n";
				echo "</dream>\n";
			}
		?>
	</dreams>
</dreams>
