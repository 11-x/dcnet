validate_session();

function body_onload()
{
	var toolbar=new Toolbar(document.getElementById('toolbar'));
	arrange('body_content', 600);
}

function new_dream()
{
	delete localStorage['dream_id'];
	location="dream.html";
}

function search_dreams()
{
	delete localStorage['dreams_user_id'];
	location="dreams.html";
}
