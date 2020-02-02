function gate_loaded()
{
	arrange('body_content', 200);

	let el_username=document.getElementById('username');
	let el_pass=document.getElementById('pass');
	let el_login_btn=document.getElementById('login_btn');

	el_username.focus();

	if (auth.username) {
		el_username.value=auth.username;
		el_pass.focus();
	}

	if (auth.pass) {
		el_pass.value=auth.pass;
		if (auth.username)
			el_login_btn.focus();
	}
}

function login_btn_clicked()
{
	// ensure .chans is synced and seek for username
	throw "not implemented";

	var btn=document.getElementById('login_btn');
	btn.disabled=true;
	dcn.login(
		document.getElementById('username').value,
		document.getElementById('pass').value,
		function(user_id) {
			window.location.href="home.html?user_id=" 
				+ encodeURIComponent(user_id);
		},
		function(err_msg) {
			alert('login failed: ' + err_msg);
			btn.disabled=false;
		}
	);
}
		
function forget()
{
	throw "not implemented";

	dcn.purge();
	location="/";
}

function input_keypressed()
{
	if (event.key=="Enter") {
		login_btn_clicked();
	}
}

function center_table(width, el)
{
	var table=document.createElement('table');
	table.style.width="100%";

	var tr=document.createElement('tr');

	var tdl=document.createElement('td');
	tdl.width="*";
	tr.appendChild(tdl);

	var tdm=document.createElement('td');
	tdm.width=width;
	tdm.appendChild(el);
	el.style.width=width;
	tr.appendChild(tdm);

	var tdr=document.createElement('td');
	tdr.width="*";
	tr.appendChild(tdr);

	table.appendChild(tr);

	return table;
}

function arrange(el, width)
{
	if (typeof(el)=='string') {
		el=document.getElementById(el);
	}

	if (typeof(width)=="undefined")
		width=600;
	
	var max_width=document.documentElement.clientWidth-32;

	if (width > max_width)
		width=max_width;

	var parent_el=el.parentElement;

	parent_el.removeChild(el);
	parent_el.appendChild(center_table(width, el));
}

