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

	function get_caption($dream)
	{
		$caption=_get($dream['date'], '');
		$caption.=' ' . _get($dream['title']);
		if ($caption==' ') {
			$caption="(dream)";
		}
		return $caption;
	}

	function cmp_captions($d1, $d2)
	{
		if (get_caption($d1) == get_caption($d2))
			return 0;
		elseif (get_caption($d1) < get_caption($d2))
			return -1;
		else 
			return 1;
	}

	$query=!empty($_GET['query'])? $_GET['query']: '';

	//uasort($dreams, "cmp_captions");
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
				if (dream_matches_query($dream, $query)) {
					echo "<dream>\n";
					echo "\t<id>$id</id>\n";
					echo "\t<title>" . get_caption($dream)
						. "</title>\n";
					echo "</dream>\n";
				}
			}
		?>
	</dreams>
	<query><?=$query?></query>
</dreams>
