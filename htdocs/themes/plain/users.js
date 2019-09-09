validate_session();

function sort_users_by_creation_timestamp(unsorted)
{
	return unsorted.sort(function(a, b) {
		return a.creation_timestamp-b.creation_timestamp;
	});
}

function body_onload()
{
	new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);
	// get list of users

	dcn.get_users(function(users){
		html='';

		var unsorted_users=[];

		for (var user_id in users) {
			unsorted_users.push(users[user_id]);
		}

		var sorted_users=sort_users_by_creation_timestamp(unsorted_users);

		for (var i in sorted_users) {
			var user=sorted_users[i];
			var user_id=user.user_id;
			html+='<p><a href="#" onclick="see_user(\''
				+ user_id + '\');">'
				+ user.username + '</a> <span style="color:'
				+ ' #888;"><i>(снов: '
					+ user.total_dreams + ')</i></span></p>\n';
		}

		document.getElementById('users_list').innerHTML=html;
	}, function(err_msg) {
		alert('Users fetch failed: ' + err_msg);
	});

}

function see_user(user_id)
{
	location='dreams.html?user_id=' + encodeURIComponent(user_id);
}
