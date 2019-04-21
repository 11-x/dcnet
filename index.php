<?

require('common.php');

if (!is_logged_in()) {
	redirect("/entry.php");
}

$user=$_SESSION['user'];

require('header.php');
?>

<div class="title">Under construction</div>

<table><tr><td align="left">
Hello, <?=$user?>!<br/>
<a href="/logoff.php">logoff</a><br/>
<a href="/deluser.php">unregister</a>
</td></tr></table>