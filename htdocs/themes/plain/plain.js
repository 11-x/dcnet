function add_scheme_canvas(base_el, scheme)
{
	var canvas=document.createElement('canvas');
	canvas.width=scheme.width-scheme.border*2;
	canvas.height=scheme.height-scheme.border*2;
	base_el.appendChild(canvas);

	var ctx=canvas.getContext('2d');

	ctx.beginPath();
	for (var i=0; i<scheme.lines.length; i++) {
		var ln=scheme.lines[i];
		ctx.moveTo(ln[0]-scheme.border, ln[1]-scheme.border);
		ctx.lineTo(ln[2]-scheme.border, ln[3]-scheme.border);
	}
	ctx.rect(0, 0, canvas.width, canvas.height);
	ctx.stroke();

}

function decodeQuery(search)
{
	if (typeof(search)=="undefined")
		search=location.search;
	
	search=search.slice(1);

	var res={};

	var vars = search.split('&');
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		res[pair[0]]=decodeURIComponent(pair[1]);
	}

	return res;
}

function getQueryParam(key, default_value, search)
{
	var val=decodeQuery(search)[key];

	if (typeof(val)=="undefined")
		return default_value;
	else
		return val;
}

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
			location="gate.html";
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
			// attempt to re-login
			console.log("Relogin");
			//alert('Время сессии истекло');
			//location="/";
			dcn.login(dcn.get_username(), dcn.get_pass(),
				function()
			{
				console.log('Relogin successful');
			}, function(err_msg)
			{
				alert('Session timed out. Automatic relogin failed: '
					+ err_msg);
				location='/';
			});
		}
	});
}

function Editor(base_el, width, height)
{
	this.BORDER_SIZE=30;

	if (typeof(base_el)=="string")
		base_el=document.getElementById(base_el);
	
	if (typeof(width)=="undefined")
		width=document.documentElement.clientWidth;
	if (typeof(height)=="undefined")
		height=document.documentElement.clientWidth;

	var self=this;
	this._el=document.createElement('canvas');
	this._el.style.cursor="default";
	this._el.width=width;
	this._el.height=height;
	base_el.appendChild(this._el);

	this._buttons=document.createElement('p');

	this._btn_undo=document.createElement('button');
	this._btn_undo.innerText='Undo';
	this._btn_undo.onclick=function(){
		if (self._lines)
			self._lines.pop();
		self._repaint();
	}

	this._buttons.appendChild(this._btn_undo);

	base_el.appendChild(this._buttons);

	this.add_custom_button=function(btn) {
		this._buttons.appendChild(
			document.createTextNode(' '));
		this._buttons.appendChild(btn);
	}

	this._ctx=this._el.getContext('2d');
	this._lines=[];
	this.paint=false;


	this._start=function(x, y) {
		this._startx=x;
		this._starty=y;
	};

	this._continue=function(x, y) {
		this._repaint(this._startx, this._starty, x, y);
		this._lastx=x;
		this._lasty=y;
	};

	this._end=function() {
		this._lines.push([this._startx, this._starty, this._lastx,
			this._lasty]);
		this._repaint();
	};

	this._repaint=function(sx, sy, ex, ey) {
		this._ctx.clearRect(0, 0, this._el.width, this._el.height);
		this._ctx.beginPath();
		for (var i=0; i<this._lines.length; i++) {
			var ln=this._lines[i];
			this._ctx.moveTo(ln[0], ln[1]);
			this._ctx.lineTo(ln[2], ln[3]);
		}
		if (typeof(sx)!="undefined") {
			this._ctx.moveTo(sx, sy);
			this._ctx.lineTo(ex, ey);
		}

		this._ctx.rect(
			this.BORDER_SIZE, this.BORDER_SIZE,
			this._el.width-2*this.BORDER_SIZE,
			this._el.height-2*this.BORDER_SIZE);

		this._ctx.stroke();
	}

	this._el.onmousemove=function(e){
		if (!self.paint)
			return;
		var mx=e.pageX-self._get_offset_left(this);
		var my=e.pageY-self._get_offset_top(this);
		self._continue(mx, my);
	};

	this._get_offset_left=function(el) {
		if (!el)
			return 0;
		
		return el.offsetLeft + self._get_offset_left(el.offsetParent);
	};

	this._get_offset_top=function(el) {
		if (!el)
			return 0;
		
		return el.offsetTop + self._get_offset_top(el.offsetParent);
	};

	this._el.ontouchmove=function(e){
		var mx=e.touches[0].pageX-self._get_offset_left(this);
		var my=e.touches[0].pageY-self._get_offset_top(this);;
		self._continue(mx, my);
	};

	this._el.ontouchend=function(e){
		self._end();
	}
	
	this._el.onmouseup=function(e){
		self._end();
		self.paint=false;;
	}

	this._el.ontouchstart=function(e){
		var mx=e.touches[0].pageX-self._get_offset_left(this);
		var my=e.touches[0].pageY-self._get_offset_top(this);

		self._start(mx, my);
		e.preventDefault();
	};

	this._el.onmousedown=function(e){
		var mx=e.pageX-self._get_offset_left(this);
		var my=e.pageY-self._get_offset_top(this);

		self._start(mx, my);
		self.paint=true;
	};

	this._repaint();
}

