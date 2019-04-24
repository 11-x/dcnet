<?

	function stylesheet_get($theme, $lang, $page)
	{
		return "/themes/$theme/$lang/$page.xsl";
	}
	require_once('users.php');
	
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
		<script>/sjcl.js</script>
		<script>/user.js</script>
		<script>/cipher.js</script>
		<script>/common.js</script>
	</scripts>
	<readme>/readme.php</readme>
</entry>
