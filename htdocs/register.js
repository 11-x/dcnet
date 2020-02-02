function register_loaded()
{
	arrange('body_content', 200);

	document.getElementById("user").focus();
}


async function register_btn_clicked()
{
	var btn=document.getElementById("register_btn");
	var user=document.getElementById("user").value;
	var pass=document.getElementById("pass").value;
	var pass2=document.getElementById("pass2").value;

	if (!user) {
		alert('invalid username');
		document.getElementById("user").focus();
		return;
	}

	if (pass!=pass2) {
		alert('pass and confirmation missmatch');
		return;
	}

	btn.disabled=true;

	try {
		let uid=await node.register(user, pass);

		console.log('user registered:', uid);

		page.go('gate');
	} catch (err) {
		console.error('registration failed:', err);
	}
	btn.disabled=false;
}
