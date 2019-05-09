function Toolbar(base_el)
{
	this._base_el=base_el;

	this._el=document.createElement('p');
	this._el.style.width="100%";
	this._el.style.padding="0 0 16 0";

	this._logo_el=document.createElement('a');
	this._logo_el.classList=['logo'];
	this._logo_el.innerText='DCNet';
	this._logo_el.style.float='left';
	this._logo_el.href='home.html';
	this._el.appendChild(this._logo_el);

	this._userspan=document.createElement('span');
	this._userspan.style.float='right';

	this._add_dream_btn=document.createElement('button');
	this._add_dream_btn.innerText='Добавить сон';
	this._add_dream_btn.onclick=function() {
		localStorage['dream_return']=window.location;
		dcn.set_dream_id(undefined);
		location='dream.html';
	};
	this._userspan.appendChild(this._add_dream_btn);

	this._userspan.appendChild(document.createTextNode(' '));

	this._user_el=document.createElement('a');
	this._user_el.href='profile.html';
	this._user_el.innerText=dcn.get_username();
	this._userspan.appendChild(this._user_el);

	this._userspan.appendChild(document.createTextNode(' '));

	this._logoff_el=document.createElement('a');
	this._logoff_el.innerText="logoff";
	this._logoff_el.onclick=function() {
		dcn.logoff(function() {
			location="/";
		}, function(err_msg) {
			alert('Logoff failed: ' + err_msg);
		});
	};
	this._logoff_el.style.cursor='pointer';
	this._userspan.appendChild(this._logoff_el);

	this._el.appendChild(this._userspan);

	this._base_el.innerHTML='';
	this._base_el.appendChild(this._el);
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

// Validate session
function validate_session(){
	dcn.check_logged_in(function(status) {
		if (!status) {
			alert('Время сессии истекло');
			location="/";
		}
	});
}
