<?

require_once('common.php');
require_once('users.php');

if (!empty(get_logged_user())) {
	redirect("/"); // already logged in, redirect to dashboard
}

$form=json_decode(file_get_contents('php://input'));

if (empty($form->user) || empty($form->salt) || empty($form->hash))
{
	respond(400, 'Bad Request');
}

$user_id=get_user_by_username($form->user);

if ($user_id===NULL) {
	respond(404, 'No Such User');
}

$info=get_user_info($user_id);

if ($form->salt!=$info['salt']) {
	respond(400, 'Salt Missmatch');
}

if ($form->hash!=$info['pass_hash']) {
	respond(403, 'Invalid Credentials');
}

login_user($user_id);

?>
