function body_onload()
{
	arrange('body_content', 200);

	if (dcn.get_username())
		document.getElementById('username').innerText=dcn.get_username();
	
	if (dcn.get_email())
		document.getElementById('email').value=dcn.get_email();
	
	dcn.check_logged_in(function(flag) {
		if (!flag)
			location="/";
	});
}

function save_btn_clicked()
{
	var pass=document.getElementById('new_pass').value;
	var pass2=document.getElementById('new_pass2').value;
	var email_el=document.getElementById('email');

	var btn=document.getElementById('save_btn');

	if (pass!=pass2) {
		alert('Pass and confirmation missmatch');
		return;
	}

	var items={};

	if (pass)
		items.pass=pass;
	
	items.email=email_el.value;

	btn.disabled=true;

	dcn.update_profile(items, function() {
		location="/";
	}, function(err_msg) {
		btn.disabled=false;
		alert('Update profile failed: ' + err_msg);
	});
}
