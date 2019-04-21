<?

session_start();

function _log($what)
{
	file_put_contents("common.log", $what . "\n", FILE_APPEND);
}
function respond($code, $reason)
{
	header("HTTP/1.1 $code $reason");
	header("Content-Type: text/plain");
	echo "$code $reason";
	exit();
}

function redirect($url, $status="303 See Other")
{
	header("HTTP/1.1 " . $status);
	header("Location: " . $url);
	exit();
}

function is_logged_in()
{
	return array_key_exists('user', $_SESSION);
}

?>
