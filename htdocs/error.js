function error_loaded()
{
		arrange('body_content', "800");
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

