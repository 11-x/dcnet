function dream_onload()
{
	arrange('body_content', 600);
	if ('dream_id' in localStorage) {
		dcn.get_dream_by_id(localStorage['dream_id'], function(dream) {

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
			}
		});
	} else {
		document.getElementById("date").value=
			new Date().toJSON().slice(0, 10);
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
	var el=document.createElement('span');
	el.innerHTML={
		'ptags': '+',
		'qtags': '?',
		'ntags': '&#x2212;'
	}[type] + tag;
	tags_span.appendChild(el);
	tags_span.appendChild(document.createTextNode(' '));

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
		var tag=tags[i].innerText;
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

	var dream_id=localStorage['dream_id'];

	if (dream_id) {
		dcn.dream_update(dream_id, data, function() {
			location="home.html";
		}, function(err_msg) {
			alert('Dream update failed: ' + err_msg);
			send_btn.disabled=false;
		});
	} else {
		dcn.dream_add(data, function() {
			location="home.html";
		}, function(err_msg) {
			alert("Add dream failed: " + err_msg);
			send_btn.disabled=false;
		});
	}
}

function dream_delete_clicked()
{
	if (confirm('Удалить безвозвратно?')) {
		var del_btn=document.getElementById('delete_btn');
		del_btn.disabled=true;
		var dream_id=document.getElementById('dreamid').value;
		dream_delete(dream_id, function(res) {
			if (res['success']) {
				document.location.href=res['redirect'];
			} else {
				alert('Delete failed: ' + res['error_message']);
				del_btn.disabled=false;
			}
		});
	}
}
