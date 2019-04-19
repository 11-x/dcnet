function hash(data, salt)
{
	var hasher=new sjcl.hash.sha256();
	hasher.update(data+salt);

	var arr_hash=hasher.finalize();

	var result='';

	for (var i=0; i<arr_hash.length; i++) {
		// >>> to make positive
		var hex='00000000' + (arr_hash[i] >>> 0).toString(16);
		result+=hex.slice(-8);
	}

	return result;
}

function gen_salt(length)
{
	var text = "";
	var alphabeth = "abcdef0123456789";
		
	for (var i = 0; i < length; i++) {
		text += alphabeth.charAt(Math.floor(Math.random()
			* alphabeth.length));
	}
	
	return text;
}
