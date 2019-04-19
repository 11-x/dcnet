<html>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<head>
		<link rel="stylesheet" type="text/css" href="style.css" />
		<script language="javascript" src="script.js"></script>
		<script language="javascript" src="sjcl.js"></script>
		<script language="javascript" src="cipher.js"></script>
<?
	if (!empty($scripts)) {
		foreach ($scripts as $script) {
			echo "\t\t<script language=\"javascript\" src=\"$script\">";
			echo "</script>\n";
		}
	}
?>
	</head>
	<body onload="body_onload();">
		<table height="100%" width="100%">
			<tr valign="center">
				<td align="center">
