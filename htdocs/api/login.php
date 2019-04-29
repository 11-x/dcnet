<?

require_once('../inc/common.php');
require_once('../inc/users.php');

if (!empty(get_logged_user())) {
	redirect("/"); // already logged in, redirect to dashboard
}

$form=json_decode(file_get_contents('php://input'));

if (empty($form->username) || empty($form->pass_hash))
{
	respond(400, 'Bad Request');
}

$user_id=get_user_by_username($form->username);

if ($user_id===NULL) {
	respond(403, 'Invalid Credentials');
}

$info=get_user_info($user_id);

if ($form->pass_hash!=$info['pass_hash']) {
	respond(403, 'Invalid Credentials');
}

login_user($user_id);

?>
