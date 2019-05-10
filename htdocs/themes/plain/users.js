validate_session();

function body_onload()
{
	new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);
	// get list of users

	dcn.get_users(function(users){
		html='';

		for (var user_id in users) {
			html+='<p><a href="#" onclick="see_user(\''
				+ user_id + '\');">'
				+ users[user_id].username + '</a> <span style="color:'
				+ ' #888;"><i>(снов: '
					+ users[user_id].total_dreams + ')</i></span></p>\n';
		}

		document.getElementById('users_list').innerHTML=html;
	}, function(err_msg) {
		alert('Users fetch failed: ' + err_msg);
	});

}

function see_user(user_id)
{
	sessionStorage['dreams_user_id']=user_id;
	location='dreams.html';
}
