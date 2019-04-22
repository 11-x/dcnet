<?

require('common.php');
require('users.php');

$user_id=get_logged_user();
if ($user_id===NULL) {
	redirect("/entry.php");
}

$scripts=['index.js'];
require('header.php');

$info = get_user_info($user_id);
$username=$info['username'];
$email=!empty($info['email'])? $info['email']: '(no email)';
?>

<div class="title">Under construction</div>

<table><tr><td align="left">

<table><tr><td>
Hello, <?=$username?>!
</td></tr><tr><td>
Recovery e-mail: <?=$email?>
</td></tr><tr><td class="banner">
<a href="/edit_profile.php">edit profile</a>
</td></tr><tr><td class="banner">
<a href="#" onclick="logoff();">logoff</a>
</td></tr><tr><td class="banner">
<a href="#" onclick="unregister();">unregister</a>
</td></tr><tr><td>
<hr/>
</td></tr><tr><td>
<a href="/">home</a>
</td></tr></table>
</td></tr></table>
<? require('footer.php'); ?>
