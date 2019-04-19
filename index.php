<?

require('common.php');

if (!is_logged_in()) {
	redirect("/entry.php");
} else {
	respond(501, "Not implemented");
}

?>
