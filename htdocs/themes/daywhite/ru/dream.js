function dream_onload()
{
	document.getElementById("date").value=
		new Date().toJSON().slice(0, 10);
	var data=JSON.parse(document.getElementById("dreamdata").value);

	if ('.private' in data || '.shared' in data) {
		console.log(data);
		alert('.private data not implemented');
		// TODO: decode data
	}

	if ('date' in data) {
		document.getElementById('date').value=data['date'];
	}
	if ('title' in data) {
		document.getElementById('title').value=data['title'];
	}
	if ('description' in data) {
		document.getElementById('description').value=data['description'];
	}

	var tags_span=document.getElementById('tags');
	tags_span.innerText='';

	if ('ptags' in data) {
		data['ptags'].forEach(function(tag){
			add_tag('ptags', tag);
		});
	}
	if ('qtags' in data) {
		data['qtags'].forEach(function(tag){
			add_tag('qtags', tag);
		});
	}
	if ('ntags' in data) {
		data['ntags'].forEach(function(tag){
			add_tag('ntags', tag);
		});
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

function dream_send()
{
	var data={
		date: document.getElementById('date').value,
		title: document.getElementById('title').value,
		description: document.getElementById('description').value,
		ptags: [],
		qtags: [],
		ntags: []
	};

	var tags=document.getElementById('tags').children;

	for (var i=0; i<tags.length; i++) {
		var el=tags[i];
		data[{
			'+': 'ptags',
			'?': 'qtags',
			'−': 'ntags' // this is '&#x2212', not '-'
		}[el.innerText[0]]].push(el.innerText.slice(1));
	}

	console.log(data);

	var send_btn=document.getElementById('send_btn');
	send_btn.disabled=true;

	var dream_id=document.getElementById('dreamid').value;

	if (dream_id) {
		dream_update(dream_id, data, function(res){
			if (res['success']) {
				document.location.href=res['redirect'];
			} else {
				alert('add dream failed: ' + res['error_message']);
				console.error(res);
			}

			send_btn.disabled=false;
		});
	} else {
		dream_add(data, function(res){
			if (res['success']) {
				document.location.href=res['redirect'];
			} else {
				alert('add dream failed: ' + res['error_message']);
				console.error(res);
			}

			send_btn.disabled=false;
		});
	}
}
