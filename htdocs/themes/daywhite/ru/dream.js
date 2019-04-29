function dream_onload()
{
	document.getElementById("date").value=
		new Date().toJSON().slice(0, 10);
}
