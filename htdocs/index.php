<?
	require_once('common.php');

	$theme=_get($_GET['theme'], DEFAULT_THEME);

	if (!theme_exists($theme))
		$theme=DEFAULT_THEME;
	
	if (!theme_exists($theme))
		fatal_error("Failed to load theme: $theme");
	
	redirect("/themes/default/gate.html");
?>
