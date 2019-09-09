function body_onload()
{
	arrange('body_content', 200);

	var el_username=document.getElementById('username');
	var el_pass=document.getElementById('pass');

	el_username.focus();

	if (dcn.get_username()) {
		el_username.value=dcn.get_username();
		el_pass.focus();
	}
	
	if (dcn.get_pass()) {
		el_pass.value=dcn.get_pass();
		if (el_username.value)
			document.getElementById('login_btn').focus();
	}

	dcn.fetch_current_userid(function(user_id) {
		if (typeof(user_id)!="undefined")
			location="home.html?user_id=" + encodeURIComponent(user_id);
	});
}

function login_btn_clicked()
{
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
	dcn.purge();
	location="/";
}

function input_keypressed()
{
	if (event.key=="Enter") {
		login_btn_clicked();
	}
}
