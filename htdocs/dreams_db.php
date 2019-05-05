<?php

require_once('users_db.php');

function dream_add($data)
{
	if (!is_logged_in()) {
		throw new Exception('not logged in');
	}

	// TODO: Check data validity

	$user_id=get_logged_user();

	$dreams=_dreams_load($user_id);

	$id=_gen_id($dreams);

	$dreams[$id]=$data;

	_dreams_save($user_id, $dreams);

	return $id;
}

function dream_update($dream_id, $data)
{
	if (!is_logged_in()) {
		throw new Exception('not logged in');
	}

	// TODO: Check data validity

	$user_id=get_logged_user();

	$dreams=_dreams_load($user_id);

	if (!array_key_exists($dream_id, $dreams)) {
		throw new Exception("dream does not exist: $dream_id");
	}

	if (!empty($data)) {
		$dreams[$dream_id]=$data;
	} else {
		unset($dreams[$dream_id]);
	}

	_dreams_save($user_id, $dreams);
}

function _dreams_load($user_id)
{
	$path=DREAMS_DIR . $user_id;

	if (!file_exists($path)) {
		return array();
	} else {
		return json_decode(file_get_contents($path), TRUE);
	}
}

function _dreams_save($user_id, $dreams)
{
	file_put_contents(DREAMS_DIR . $user_id, json_encode($dreams,
		JSON_PRETTY_PRINT));
}

function dream_get($author, $id)
{
	if (!is_logged_in()) {
		throw new Exception('not logged in');
	}

	if ($author!=get_logged_user()) {
		throw new Exception('not implemented');
	}

	$dreams=_dreams_load($author);
	return $dreams[$id];
}

function dream_matches_query($dream, $query)
{
	if (empty($query))
		return TRUE;

	foreach (explode(" ", $query) as $token) {
		if (empty($token))
			continue;

		if ($token[0]=='+') {
			if (!in_array(substr($token, 1), $dream['ptags'])
					|| in_array(substr($token, 1), $dream['ntags'])) {
				return FALSE;
			}
		} elseif ($token[0]=='-') {
			if (!in_array(substr($token, 1), $dream['ntags'])
					|| in_array(substr($token, 1), $dream['ptags'])) {
				return FALSE;
			}
		} else {
			$text=_get($dream['title'], '')
				. _get($dream['description'], '');
			if (strpos($text, $token)===FALSE) {
				_log("TEXT NF: " . json_encode($text) . " in "
					. json_encode($text));
				return FALSE;
			}
		}
	}

	return TRUE;
}
?>
