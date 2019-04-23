<?

require_once('common.php');
require_once('users.php');

$user_id=get_logged_user();
if ($user_id===NULL) {
	redirect("/entry.php");
}

require('header.php');

$info = get_user_info($user_id);
$username=$info['username'];
$email=!empty($info['email'])? $info['email']: '(no email)';
?>

<div class="title">Under construction</div>

<? require('footer.php'); ?>
