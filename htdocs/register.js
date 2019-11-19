function is_weak(pass)
{
	if (pass.length<8)
		return true;
	
	let has_alpha=0;
	let has_Alpha=0;
	let has_digit=0;
	let has_other=0;

	for (let i in pass) {
		if (pass.charAt(i).match(/[a-z]/))
			has_alpha=1;
		else if (pass.charAt(i).match(/[A-Z]/))
			has_Alpha=1;
		else if (pass.charAt(i).match(/[0-9]/))
			has_digit=1;
		else
			has_other=1;
	}

	return (has_alpha+has_Alpha+has_digit+has_other) < 3;
}

async function register_btn_clicked()
{
	var btn=document.getElementById("register_btn");
	var username=document.getElementById("user").value;
	var pass=document.getElementById("pass").value;
	var pass2=document.getElementById("pass2").value;

	if (!username) {
		alert('username required');
		document.getElementById("user").focus();
		return;
	}

	if (!pass) {
		alert('pass required');
		document.getElementById("pass").focus();
		return;
	}

	if (pass!=pass2) {
		alert('pass and confirmation missmatch');
		document.getElementById("pass2").focus();
		return;
	}

	if (is_weak(pass)) {
		if (!confirm("Warning: Weak password. Proceed anyway?")) {
			document.getElementById("pass").focus();
			return;
		}
	}

	btn.disabled=true;
	
	// Do registration:
	// 1. Create user descriptor
	// 2. POST it to .users/

	let keypair=await dcn.crypt.gen_keypair();

	let user_descriptor={
		pub_key: keypair.public_key,
		priv_key: await dcn.crypt.encrypt(keypair.private_key, pass),
		username: username
	};

	let jdata=JSON.stringify({
		cid: '.users',
		val: user_descriptor
	});

	let usig=await dcn.crypt.sign(jdata, keypair.private_key);

	let resp=await dcn.request("POST", "/j/.users", JSON.stringify({
		jdata: jdata,
		usig: usig
	}));

	if (resp.code==201) {
		dcn.set_credentials(username, pass);
		let uid=JSON.parse(resp.data);
		location="/home?self=" + uid;
	} else {
		alert('Registration failed: ' + resp.code + ' ' + resp.reason
			+ '\n' + resp.data);
		btn.disabled=false;
	}
}

