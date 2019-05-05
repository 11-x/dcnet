<?

/**
 *	Default theme
 */
const DEFAULT_THEME='default';

const USERS_DB_PATH='users.json';

const ID_ALPHABETH='0123456789ABCDEF';

const MAX_ID_GENERATION_ATTEMPTS=100;

const USER_ID_LENGTH=16;

const DREAMS_DIR='dreams/';

const LOG_PATH='common.log';

session_start();

function _log($what)
{
	file_put_contents(LOG_PATH, $what . "\n", FILE_APPEND);
}

/**
 * Common error hander, which just throws an Exception
 */
function _err_handler($errno, $errstr, $errfile, $errline, $errctx)
{
	throw new Exception("ERROR ($errno): $errstr "
		. "in $errfile at $errline");
}

/**
 *	Redirect and terminate
 *
 *	@param string $url target URL
 *	@param string $status (optional) response status, defaults
 *		to '303 See Other'
 */
function redirect($url, $status="303 See Other")
{
	header("HTTP/1.1 " . $status);
	header("Location: " . $url);
	exit();
}

/**
 *	Get with default if unset
 *
 *	@param mixed $var a variable to check
 *	@param mixed $default the default value
 *
 *	@return mixed $var if is set, else $default
 */
function _get(&$var, $default)
{
	return isset($var)? $var: $default;
}

function theme_exists($theme)
{
	return is_dir("themes/$theme");
}

function fatal_error($message)
{
	respond_text(500, "Fatal Error", $message);
}

function respond_text($code, $reason, $text)
{
	header("HTTP/1.1 $code $reason");
	header("Content-Type: text/plain");
	echo $text;
	exit();
}

function respond_json($code, $reason, $obj)
{
	header("HTTP/1.1 $code $reason");
	header("Content-Type: application/json");
	echo json_dumps($obj);
	exit();
}

function respond($code, $reason)
{
	header("HTTP/1.1 $code $reason");
	exit();
}

function json_loads($str)
{
	$obj=json_decode($str, TRUE);
	if (json_last_error()!=0) {
		throw new Exception(json_last_error_msg());
	}
	return $obj;
}

function json_dumps($obj)
{
	$str=json_encode($obj, JSON_PRETTY_PRINT);
	if (json_last_error()!=0) {
		throw new Exception(json_last_error_msg());
	}
	return $str;
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
