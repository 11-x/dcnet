<?

	require_once('themes.php');
	require_once('users.php');
	
	echo '<?xml version="1.0" encoding="UTF-8"?>'."\n";
	echo '<?xml-stylesheet type="text/xsl" href="'
		. stylesheet_get('daywhite', 'ru', 'readme') . '"?>'."\n";
	
	header('Content-Type: text/xml');

	$user_id=get_logged_user();

	if (!empty($user_id)) {
		$info=get_user_info($user_id);
		$username=$info['username'];
		$email=empty($info['email'])? '': $info['email'];
		$salt=$info['salt'];
		$user_block="<username>$username</username>";
	} else {
		$user_block='';
	}
?>
<readme>
	<?=$user_block?>
	<text>
		<p>
		DCNet &#8212; это социальная сеть практиков картографии снов
		&#8212; метода контроля сновидений, созданного группой "Хакеры
		Сновидений".
		</p>
		<p>
		Команду разработчиков DCNet можно найти тут: <a href="http://dreamhackers.eu">dreamhackers.eu</a>
		</p>
	</text>
	<back>/</back>
</readme>
