function body_onload()
{

	var dreams_el=document.getElementById('dreams');

	dcn.get_user_dreams(undefined, function(dreams) {
		var html='';

		for (var dream_id in dreams) {
			var dream=dreams[dream_id];
			html+='<p><a href="#" onclick="open_dream(\''
				+ dream_id + '\');">' + dcn.dream_get(dream, 'date') + ' ' 
				+ dcn.dream_get(dream, 'title') + '</a></p>\n';
		}

		dreams_el.innerHTML=html;
	}, function(err_msg) {
		alert('Dreams fetch failed: ' + err_msg);
	});

}

function open_dream(dream_id)
{
	localStorage['dream_id']=dream_id;
	location="dream.html";
}
