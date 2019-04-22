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

function jrespond($code, $reason, $obj)
{
	header("HTTP/1.1 $code $reason");
	header("Content-Type: application/json");
	echo json_encode($obj);
}

function redirect($url, $status="303 See Other")
{
	header("HTTP/1.1 " . $status);
	header("Location: " . $url);
	exit();
}

?>
