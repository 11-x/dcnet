function dream_add(data, cb)
{
	treq('POST', '/api/dream_add.php', JSON.stringify(data),
			function(code, reason, text){
		if (code==201) {
			console.log(code, reason, text);
			if (cb) {
				cb({
					success: true,
					redirect: '/dream.php?id=' + encodeURIComponent(text)
				});
			}
		} else {
			if (cb) {
				cb({
					success: false,
					error_message: code + ' ' + reason + '\n' + text
				});
			}
		}
	});
}

function dream_update(id, data, cb)
{
	treq(PUT, '/api/dream_mod.php', JSON.stringify({
		id: id,
		data: data
	}), function(code, reason, text){
		if (code==204) {
			if (cb) {
				cb({
					success: true,
					redirect: '/dream.php?id=' + encodeURIComponent(id)
				});
			}
		} else {
			if (cb) {
				cb({
					success: false,
					error_message: code + ' ' + reason + '\n' + text
				});
			}
		}
	});
}
function dream_delete(id, cb)
{
	treq(DELETE, '/api/dream_mod.php', JSON.stringify({
		id: id, data: null
	}), function(code, reason, text){
		if (code==204) {
			if (cb) {
				cb({
					success: true,
					redirect: '/home.php'
				});
			}
		} else {
			if (cb) {
				cb({
					success: false,
					error_message: code + ' ' + reason + '\n' + text
				});
			}
		}
	});
}
