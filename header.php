<?
	require_once('users.php');

	if (empty($onload)) {
		$onload='';
	}

	$user_id=get_logged_user();
	if (!empty($user_id)) {
		$username=get_user_info($user_id)['username'];
		$user_panel='<a href="/edit_profile.php">' . $username
			. '</a> <a href="/logoff.php">&#x2348;</a>';
	} else {
		$user_panel='&nbsp;';
	}
?>	
<html>
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<head>
		<link rel="stylesheet" type="text/css" href="style.css" />
		<script language="javascript" src="common.js"></script>
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
	<body
		onload="body_onload(); <?=$onload?>"
		onresize="body_resize();"
	>
		<table height="100%" width="100%">
			<tr valign="top">
				<td align="center">
					<table width="100%" id="bodytable"><tr><td align="center">
		<table width="100%"><tr><td align="left">
		<a href="/">home</a>
		</td>
		<td align="right">
			<?=$user_panel?>
		</td>
		</tr></table>
		<hr/>
