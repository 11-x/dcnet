function dreams_onload()
{
	var el=document.getElementById('query');
	el.focus();
	pos=el.value.length;
	el.setSelectionRange(pos, pos);
}
function search_btn_clicked()
{
	var query=document.getElementById('query').value;
	document.location.href='/dreams.php?query='
		+ encodeURIComponent(query);
}
function query_keypressed()
{
	if (event.key=="Enter") {
		search_btn_clicked();
	}
}
