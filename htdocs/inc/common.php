<?

require_once('config.php');

session_start();

function _log($what)
{
	file_put_contents(LOG_PATH, $what . "\n", FILE_APPEND);
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
	exit();
}

function trespond($code, $reason, $text)
{
	header("HTTP/1.1 $code $reason");
	header("Content-Type: text/plain");
	echo $text;
	_log("trespond: $code $reason $text");
	exit();
}

function redirect($url, $status="303 See Other")
{
	header("HTTP/1.1 " . $status);
	header("Location: " . $url);
	exit();
}

function _gen_id($except)
{
	$len=strlen(ID_ALPHABETH);

	for ($i=0; $i<MAX_ID_GENERATION_ATTEMPTS; $i++) {
		$id='';
		for ($j=0; $j<USER_ID_LENGTH; $j++) {
			$id .= ID_ALPHABETH[rand(0, $len-1)];
		}
		if (!array_key_exists($id, $except)) {
			return $id;
		}
	}

	throw new Exception('Failed to generate user id');
}
?>
