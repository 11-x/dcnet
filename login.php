<?

require('common.php');

if (is_logged_in()) {
	redirect("/"); // already logged in, redirect to dashboard
}

$form=json_decode(file_get_contents('php://input'));

_log(var_dump($_POST));

respond(501, 'Not Implemented');

?>
