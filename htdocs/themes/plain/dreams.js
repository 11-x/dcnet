validate_session();

function body_onload()
{
	var toolbar=new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);

	if (typeof(getQueryParam("user_id"))=="undefined")
		location.replace("dreams.html?user_id="
			+ encodeURIComponent(dcn.get_user_id()));

	var user_id=getQueryParam('user_id');
	refresh_dreams(user_id, '');

	dcn.get_user_info(user_id,
		function(info)
	{
		document.getElementById('author').innerText=info.username;
	}, function(err_msg)
	{
		alert('Author fetch failed: ' + err_msg);
	});
}

function toggle_help()
{
	var el=document.getElementById('help');
	if (el.style.display=="none")
		el.style.display="inherit";
	else
		el.style.display="none";
}

function new_dream()
{
	location="dream.html";
}

function dream_matches_query(dream, query)
{
	if (!query)
		return true;
	
	var tokens=query.split(' ');

	var text=dcn.dream_get(dream, 'title') + ' '
		+ dcn.dream_get(dream, 'description');
	text=text.replace(',', ' ');
	text=text.replace('.', ' ');
	text=text.replace(';', ' ');
	text=text.replace('?', ' ');
	text=text.replace('!', ' ');
	text=text.replace('-', ' ');
	text=text.replace('*', ' ');
	text=text.replace('/', ' ');
	text=text.replace('\\', ' ');
	text=text.toUpperCase().split(' ').filter(function(value, index, self) {
		return self.indexOf(value)===index; // only unique words
	});

	for (var i=0; i<tokens.length; i++) {
		var token=tokens[i];

		if (!token)
			continue;

		if ('+?-'.indexOf(token[0])!=-1) {
			// it's a tag filter
			if (dcn.dream_get_tags(dream).indexOf(token)==-1) {
				return false;
			}
		} else if (token[0]=='<') {
			var date=dcn.dream_get(dream, 'date');
			if (!date || date>=token.slice(1))
				return false;
		} else if (token[0]=='=') {
			var date=dcn.dream_get(dream, 'date');
			if (!date || date!=token.slice(1))
				return false;
		} else if (token[0]=='>') {
			var date=dcn.dream_get(dream, 'date');
			if (!date || date<=token.slice(1))
				return false;
		} else {
			// it's a text filter
			if (text.indexOf(token.toUpperCase())==-1)
				return false;
		}
	}

	return true;
}

function refresh_dreams(user_id, query)
{
	var dreams_el=document.getElementById('dreams');

	dcn.get_user_dreams(user_id, function(dreams) {
		var html='';
		var html2={
		};

		for (var dream_id in dreams) {
			var dream=dreams[dream_id];

			if (!dream_matches_query(dream, query))
				continue;

			if (!dcn.dream_is_accessible(dream))
				continue;

			var date=dcn.dream_get(dream, 'date', '(no date)');
			if (!(date in html2))
				html2[date]=[];

			var html_item='<p><a href="#" onclick="open_dream(\''
				+ dream_id + '\');">'
				+ dcn.dream_get(dream, 'date', '<i>(no date)</i>') + ' ' 
				+ dcn.dream_get(dream, 'title', '<i>(no title)</i>')
				+ '</a> <i class="'
				+ ('.protected' in dream?
					'private">private':
					'public">public')
				+ '</i>';

			var tags=dcn.dream_get_tags(dream);

			if (tags)
				html_item+='<br/>';
			for (var i=0; i<tags.length; i++) {
				var tag=tags[i];

				html_item+='<span class="' + {
					'+': 'ptag',
					'?': 'qtag',
					'-': 'ntag'
				}[tag[0]] + '">' + tag + '</span> ';
			}

			html_item+='</p>\n';

			html+=html_item;
			html2[date].push(html_item);
		}

		html='';

		var dates=Object.keys(html2).sort();


		for (var j=0; j<dates.length; j++) {
			var date=dates[j];
			for (var i=0; i<html2[date].length; i++) {
				html=html2[date][i]+html;
			}
		}

		dreams_el.innerHTML=html;
	}, function(err_msg) {
		alert('Dreams fetch failed: ' + err_msg);
	});

}

function open_dream(dream_id)
{
	var user_id=getQueryParam('user_id', dcn.get_user_id());
	var url="dream_view.html?user_id="
		+ encodeURIComponent(user_id)
		+ "&dream_id=" + encodeURIComponent(dream_id);

	location=url;
}

function search_key_pressed()
{
	if (event.key=="Enter") {
		search_btn_clicked();
	}
}

function search_btn_clicked()
{
	refresh_dreams(getQueryParam('user_id'),
		document.getElementById('search').value);
}
