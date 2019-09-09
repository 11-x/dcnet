function get_date(when)
{

	var month=when.getMonth()+1;
	if (month<10)
		month='0'+month;
	
	var day=when.getDate();
	if (day<10)
		day='0'+day;

	return when.getFullYear() + '-' + month + '-' + day;
}

function texel(tag, inner_text)
{
	var el=document.createElement(tag);

	if (typeof(inner_text)!="undefined")
		el.innerText=inner_text;

	return el;
}

function italize(el)
{
	var i=document.createElement('i');

	i.appendChild(el);

	return i;
}

function render_export_data(cb)
{
	var user_id=getQueryParam('user_id', dcn.get_user_id());

	//var body=document.getElementsByTagName('body')[0];
	dcn.get_user_info(user_id, function(info) {
		dcn.get_user_dreams(user_id, function(dreams) {
			var dates={};

			var body=document.createElement('div');

			var title=texel('p', 'Сны пользователя '
				+ info.username + ' на ' + get_date(new Date()) + ' ');
			var span=texel('span', '(user_id: ' + user_id + ')');
			span.style.color="gray";
			title.appendChild(italize(span));
			
			body.appendChild(title);

			for (var dream_id in dreams) {
				var dream=dreams[dream_id];
				var el=document.createElement('p');

				var date=dcn.dream_get(dream, 'date');

				if (date)
					el.appendChild(document.createTextNode(date))
				else
					el.appendChild(texel('i', '(без даты)'));

				el.appendChild(document.createTextNode(' '));

				var title=dcn.dream_get(dream, 'title');

				if (title)
					el.appendChild(texel('b', title));
				else
					el.appendChild(italize(texel('b', '(без названия)')));

				if (typeof(dream['.protected'])=="undefined")
					el.appendChild(texel('sup', 'public'));

				el.appendChild(document.createTextNode(' '));

				var id=texel('span', '(dream_id: ' + dream_id + ')');
				id.style.color="gray";
				el.appendChild(italize(id));
				

				var description=dcn.dream_get(dream, 'description');

				if (description)
					el.appendChild(texel('div', description));

				var tags=dcn.dream_get(dream, 'tags');

				if (tags) {
					var div=texel('div');

					for (var i=0; i<tags.length; i++) {
						var tag=texel('span', tags[i]);
						tag.classList=[{
							'+': 'ptag',
							'?': 'qtag',
							'-': 'ntag'
						}[tag[0]]];
						div.appendChild(tag);
						div.appendChild(document.createTextNode(' '));
					}

					el.appendChild(div);
				}

				var schemes=dcn.dream_get(dream, 'schemes');

				if (schemes) {
					for (var i=0; i<schemes.length; i++) {
						var div=texel('span');
						add_scheme_canvas(div, schemes[i]);
						var canvas=div.children[0];
						var data_url=canvas.toDataURL("image/png");
						var img=document.createElement("img");
						img.src=data_url;
						div.removeChild(div.children[0]);
						div.appendChild(img);
						el.appendChild(div);
					}
				}

				if (!(date in dates))
					dates[date]=[];
				
				dates[date].push(el);
			}

			var sorted_dates=Object.keys(dates).sort();

			for (var j in sorted_dates) {
				var date=sorted_dates[sorted_dates.length-j-1];

				for (var i=0; i<dates[date].length; i++)
					body.appendChild(dates[date][i]);
			}

			var div=document.createElement('div');
			div.style.display="none";
			div.innerText=JSON.stringify(dreams);
			body.appendChild(div);

			cb(body, info);

		});
	});


}

function export_body_onload()
{
	render_export_data(function(body, info) {
		var html=body.innerHTML;
		document.body.innerHTML='';
		document.body.appendChild(body);

		download_export_html(html,
			get_date(new Date()) + '_' + info.username+'.html');

	});
}

function download_export_html(html, filename) {
	var a=document.createElement("a");
	a.href=URL.createObjectURL(new Blob([html],
		{type: 'text/html'}));
	a.download=filename;
	a.hidden=true;
	document.body.appendChild(a);
	a.click();
	console.log(a);
}

// TODO: add error handlers
