<?

require('common.php');

if (is_logged_in()) {
	redirect("/"); // already logged in, redirect to dashboard
} else {
	respond(501, "Not Implemented");
}

?>
