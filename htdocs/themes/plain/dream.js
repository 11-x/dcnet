validate_session();

_schemes=[];

function get_dream_id()
{
	return getQueryParam('dream_id');
}

function get_user_id(default_value)
{
	return getQueryParam('user_id', default_value);
}

function post_comment()
{
	let ta=document.getElementById("comment");
	let text=ta.value;

	if (!text) {
		alert("Empty comment");
		ta.focus();	
		return;
	}

	dcn.comment_dream(get_user_id(), get_dream_id(), text, ()=>{
		location.reload();
	});
}

function add_scheme()
{
	var el=document.getElementById("schemes");
	var width=400, height=400;

	if (width>document.documentElement.clientWidth) {
		width=document.documentElement.clientWidth;
		height=width;
	}

	var ed=new Editor(el, width, height);

	_schemes.push(ed);

	var btn_remove=document.createElement('button');
	btn_remove.innerText='Удалить схему';
	ed.add_custom_button(btn_remove);

	var index=_schemes.length;

	btn_remove.onclick=function() {
		for (var i=0; i<_schemes.length; i++) {
			console.log(_schemes[i]===ed, i, _schemes);
			if (_schemes[i]===ed) {
				_schemes=_schemes.slice(0, i).concat(
					_schemes.slice(i+1));

				el.removeChild(el.children[2*i]);
				el.removeChild(el.children[2*i]);

				return;
			}
		}
	};
}

function switch_to_edit()
{
	location.replace('dream.html' + location.search);
}

function dream_view_onload()
{
	var toolbar=new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);
	//var user_id=query['user_id'];
	dcn.get_user_info(get_user_id(), function(info) {
		document.getElementById('author').innerText=info.username;
	});
	if (dcn.get_user_id()!=get_user_id()
			&& typeof(get_user_id())!="undefined") {
		document.getElementById('edit_section').style.display="none";
	}
	if (get_dream_id()) {
		dcn.get_dream_by_id(get_user_id(),
			get_dream_id(), function(dream)
		{
			var date=dcn.dream_get(dream, 'date');
			if (date)
				document.getElementById('date').innerText=date;

			var title=dcn.dream_get(dream, 'title');
			if (title)
				document.getElementById('title').innerText=title;

			var description=dcn.dream_get(dream, 'description');
			if (description)
				document.getElementById('description').innerText
					=description;

			var tags_el=document.getElementById('tags');
			var tags=dcn.dream_get(dream, 'tags');
			if (tags) for (var i=0; i<tags.length; i++) {
				var tag=tags[i];

				var el=document.createElement('span');
				el.classList=[{
					'+': 'ptag', '?': 'qtag', '-': 'ntag'
				}[tag[0]]];
				if (tag[0]!='-')
					el.innerText=tag[0]+tag.slice(1);
				else
					el.innerHTML='&#x2212;'+tag.slice(1);
				tags_el.appendChild(el);
				tags_el.appendChild(document.createTextNode(' '));
			}

			var schemes=dcn.dream_get(dream, 'schemes');

			if (schemes) {
				var el=document.getElementById("schemes");
				for (var i=0; i<schemes.length; i++) {
					add_scheme_canvas(el, schemes[i]);
				}
			}

			var comments=dcn.dream_get(dream, 'comments');

			if (comments)
				for (let i=0; i<comments.length; i++) {
					add_comment(comments[i]);
				}


			if ('.protected' in dream) {
				document.getElementById('access').innerHTML
					='<span class="private">private</span>';
				if (dcn.get_user_id()==get_user_id()
						&& typeof(get_user_id())!="undefined") {
					document.getElementById("comment_section").hidden=false;
				}
			} else {
				document.getElementById('access').innerHTML
					='<span class="public">public</span>';
				document.getElementById("comment_section").hidden=false;
			}
		}, function(err_msg) {
			alert('Dream fetch failed: ' + err_msg);
		});
	} else {
		history.back();
	}
}

function user_ref(username, user_id)
{
	return '<a href="/themes/plain/dreams.html?user_id='
		+ user_id + '">' + username + '</a>';
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


function add_comment(comment)
{
	let div=document.getElementById("comments");

	let el=document.createElement('p');
	el.innerText=comment.text;

	dcn.get_user_info(comment.commenter_id, (info)=>{
		let username=info.username;
		el.innerHTML+='<br/><i>by ' + user_ref(username,
			comment.commenter_id) + ' at '
			+ timeConverter(comment.timestamp) + '</i>';
	});

	div.appendChild(el);
}

function dream_onload()
{
	var toolbar=new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);
	if (get_dream_id()) {
		if (get_user_id()!=dcn.get_user_id()
				&& typeof(get_user_id())!="undefined") {
			window.location.replace('dream_view.html');
			return;
		}
		dcn.get_dream_by_id(get_user_id(),
			get_dream_id(), function(dream)
		{
		//	console.log(dream);

			var date=dcn.dream_get(dream, 'date');
			if (date)
				document.getElementById('date').value=date;

			var title=dcn.dream_get(dream, 'title');
			if (title)
				document.getElementById('title').value=title;

			var description=dcn.dream_get(dream, 'description');
			if (description)
				document.getElementById('description').value=description;

			var tags=dcn.dream_get(dream, 'tags');
			if (tags) for (var i=0; i<tags.length; i++) {
				var tag=tags[i];
				add_tag({'+': 'ptags', '-': 'ntags', '?': 'qtags'}[tag[0]],
					tag.slice(1));
			}

			var schemes=dcn.dream_get(dream, 'schemes');

			if (schemes)
				for (var i=0; i<schemes.length; i++) {
					add_scheme();
					_schemes[_schemes.length-1]._lines=schemes[i].lines;
					_schemes[_schemes.length-1]._repaint();
				}

			if ('.protected' in dream) {
				document.getElementById('private').selected=true;
			} else
				document.getElementById('public').selected=true;
		}, function(err_msg) {
			alert('Dream fetch failed: ' + err_msg);
		});
	} else {
		document.getElementById("date").value=
			new Date().toJSON().slice(0, 10);
		document.getElementById("delete_btn").disabled=true;
	}

	document.getElementById('date').focus();
}

function add_tag(type, tag)
{
	var tag_el=document.getElementById('tag');
	if (typeof(tag)=="undefined") {
		tag=tag_el.value;
	}

	if (type!='ptags' && type!='qtags' && type!='ntags') {
		console.error('invalid type', type, tag);
		return;
	}

	if (!tag) {
		tag_el.focus();
		return;
	}

	var tags_span=document.getElementById('tags');
	var base_el=document.createElement('span');
	var el=document.createElement('span');
	el.innerHTML={
		'ptags': '+',
		'qtags': '?',
		'ntags': '&#x2212;'
	}[type] + tag;
	el.classList=[{
		'ptags': 'ptag',
		'qtags': 'qtag',
		'ntags': 'ntag'
	}[type]];
	base_el.appendChild(el);

	var del=document.createElement('span');
	del.innerHTML='&#x2716';
	del.classList=[{
		'ptags': 'ptag',
		'qtags': 'qtag',
		'ntags': 'ntag'
	}[type]];
	del.style.cursor="pointer";
	del.onclick=function(){
		tags_span.removeChild(base_el);
	};
	base_el.appendChild(del);

	base_el.appendChild(document.createTextNode(' '));
	tags_span.appendChild(base_el);

	tag_el.value='';
	tag_el.focus();
}

function send_btn_clicked()
{
	var data={
		date: document.getElementById('date').value,
		title: document.getElementById('title').value,
		description: document.getElementById('description').value,
		tags: []
	};

	var tags=document.getElementById('tags').children;

	for (var i=0; i<tags.length; i++) {
		var tag=tags[i].children[0].innerText;
		if (tag[0]=='−') {
			tag='-'+tag.slice(1);
		}
		data.tags.push(tag);
	}

	if (_schemes) {
		data.schemes=[];
		for (var i=0; i<_schemes.length; i++) {
			data.schemes.push({
				lines: _schemes[i]._lines,
				height: _schemes[i]._el.height,
				width: _schemes[i]._el.width,
				border: _schemes[i].BORDER_SIZE
			});
		}
	}

	if (document.getElementById('private').selected) {
		var data2={
			'.protected': {}
		};
		data2['.protected'][dcn.get_user_id()]=data;
		data=data2;
	}

	console.log(data);

	var send_btn=document.getElementById('send_btn');
	send_btn.disabled=true;

	var dream_id=get_dream_id();

	if (dream_id) {
		dcn.dream_update(dream_id, data, function() {
			location.replace('dream_view.html?user_id='
				+ get_user_id(dcn.get_user_id())
				+ '&dream_id=' + dream_id);
		}, function(err_msg) {
			alert('Dream update failed: ' + err_msg);
			send_btn.disabled=false;
		});
	} else {
		console.log(dcn.get_user_id(),
			get_user_id(dcn.get_user_id()),
			dream_id);
		dcn.dream_add(data, function(dream_id) {
			console.log(dcn.get_user_id(),
				get_user_id(dcn.get_user_id()),
				dream_id);
			location.replace('dream_view.html?user_id='
				+ get_user_id(dcn.get_user_id())
				+ '&dream_id=' + dream_id);
		}, function(err_msg) {
			alert("Add dream failed: " + err_msg);
			send_btn.disabled=false;
		});
	}
}

function delete_btn_clicked()
{
	if (!confirm('Удалить безвозвратно?'))
		return;
	
	var btn=document.getElementById('delete_btn');

	btn.disabled=true;

	dcn.dream_remove(get_dream_id(), function() {
		//history.back();
		location='home.html';
	}, function(err_msg) {
		alert('Delete failed: ' + err_msg);
		btn.disabled=false;
	});
}
