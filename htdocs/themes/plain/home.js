validate_session();

function export_html()
{
	render_export_data(function(body, info) {
		var html=body.innerHTML;

		download_export_html(html,
			get_date(new Date()) + '_' + info.username+'.html');
	});
}

function body_onload()
{
	var toolbar=new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);

	if (typeof(getQueryParam('user_id'))=="undefined")
		location.replace("home.html?user_id="
			+ encodeURIComponent(dcn.get_user_id()));
	
	load_tape();
}

function new_dream()
{
	location="dream.html?user_id=" 
		+ encodeURIComponent(getQueryParam('user_id'));
}

function search_dreams()
{
	location="dreams.html?user_id=" 
		+ encodeURIComponent(getQueryParam('user_id'));;
}


function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = ('0' + a.getHours()).slice(-2);
  var min = ('0' + a.getMinutes()).slice(-2);
  var sec = ('0' + a.getSeconds()).slice(-2);
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}

function user_ref(username, user_id)
{
	return '<a href="/themes/plain/dreams.html?user_id='
		+ user_id + '">' + username + '</a>';
}

function dream_ref(caption, user_id, dream_id)
{
	return '<a href="/themes/plain/dream_view.html?user_id=' + user_id + '&dream_id=' + dream_id + '">' + caption + '</a>';
}

function render_event(timestamp, idx, ev)
{

	if (ev.type=='user_login') {
		return '';
		return '<div class="activity">' + timeConverter(timestamp)
			+ ' ' + user_ref(ev['username'], ev['user_id'])
			+ ' logged in</div>';
	} else if (ev.type=='user_logoff') {
		return '';
		return '<div class="activity">' + timeConverter(timestamp)
			+ ' ' + user_ref(ev['username'], ev['user_id'])
			+ ' logged out</div>';
	} else if (ev.type=='user_add') {
		return '<div class="activity">' + timeConverter(timestamp)
			+ ' ' + user_ref(ev['username'], ev['user_id'])
			+ ' registered</div>';
	} else if (ev.type=='dream_update') {
		return '<div class="activity">' + timeConverter(timestamp)
			+ ' ' + user_ref(ev['username'], ev['user_id']) + ' updated ' 
				+ dream_ref('dream', ev['user_id'], ev['dream_id'])
				+ '</div>';
	} else if (ev.type=='dream_add') {
		return '<div class="activity">' + timeConverter(timestamp)
			+ ' ' + user_ref(ev['username'], ev['user_id']) + ' added ' 
				+ dream_ref('dream', ev['user_id'], ev['dream_id'])
				+ '</div>';
	} else if (ev.type=='dream_delete') {
		return '<div class="activity">' + timeConverter(timestamp)
			+ ' ' + user_ref(ev['username'], ev['user_id'])
			+ ' deleted a dream</div>';
	} else if (ev.type=='profile_update') {
		return '';
	} else if (ev.type=='user_active') {
		return '';
	} else if (ev.type=='anonymous_active') {
		return '';
	} else if (ev.type=='comment_dream') {
		console.log(ev);
		return '<div class="activity">' + timeConverter(timestamp)
			+ ' ' + user_ref(ev['comment_author_username'],
				ev['comment_author_id']) + ' commented on ' 
				+ user_ref(ev['dream_author_username'],
				ev['dream_author_id']) + "'s "
				+ dream_ref('dream', ev['dream_author_id'], ev['dream_id'])
				+ '</div>';
		
	} else {
		console.error('unexpected event type', ev);
	}

	return '';
}

function load_tape()
{
	var el=document.getElementById("tape");

	dcn._get('/tape.php', function(code, reason, data) {
		if (code==204) {
			return;
		} else if (code!=200) {
			console.log('tape load error', code, reason, data);
		} else {
			var tape=JSON.parse(data);
			var html='';
			for (var i in tape) {
				html=render_event(tape[i][0],
					tape[i][1], tape[i][2])
					+ html;
			}
			el.innerHTML=html;
		}
	});
}
