validate_session();

function switch_to_edit()
{
	sessionStorage['dream_return']=location;
	location.replace('dream.html');
}

function go_back()
{
	if (typeof(sessionStorage['dream_return'])=="undefined")
		history.back();
	else
		location=sessionStorage['dream_return'];
}

function dream_view_onload()
{
	var toolbar=new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);
	dcn.get_user_info(sessionStorage['dreams_user_id'], function(info) {
		document.getElementById('author').innerText=info.username;
	});
	if (dcn.get_user_id()!=sessionStorage['dreams_user_id']
			&& typeof(sessionStorage['dreams_user_id'])!="undefined") {
		document.getElementById('edit_section').style.display="none";
	}
	if (dcn.get_dream_id()) {
		dcn.get_dream_by_id(sessionStorage['dreams_user_id'],
			dcn.get_dream_id(), function(dream)
		{
			console.log(dream);

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

			if ('.protected' in dream) {
				document.getElementById('access').innerHTML
					='<span class="private">private</span>';
			} else
				document.getElementById('access').innerHTML
					='<span class="public">public</span>';
		}, function(err_msg) {
			alert('Dream fetch failed: ' + err_msg);
		});
	} else {
		history.back();
	}
}
function dream_onload()
{
	var toolbar=new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);
	if (dcn.get_dream_id()) {
		if (sessionStorage['dreams_user_id']!=dcn.get_user_id()
				&& typeof(sessionStorage['dreams_user_id'])!="undefined") {
			window.location.replace('dream_view.html');
			return;
		}
		dcn.get_dream_by_id(sessionStorage['dreams_user_id'],
			dcn.get_dream_id(), function(dream)
		{
			console.log(dream);

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

	var dream_id=dcn.get_dream_id();

	if (dream_id) {
		dcn.dream_update(dream_id, data, function() {
			go_back();
		}, function(err_msg) {
			alert('Dream update failed: ' + err_msg);
			send_btn.disabled=false;
		});
	} else {
		dcn.dream_add(data, function(dream_id) {
			sessionStorage['dream_id']=dream_id;
			console.log('back', sessionStorage['dream_back']);
			go_back();
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

	dcn.dream_remove(dcn.get_dream_id(), function() {
		history.back();
	}, function(err_msg) {
		alert('Delete failed: ' + err_msg);
		btn.disabled=false;
	});
}
