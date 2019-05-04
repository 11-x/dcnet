function logoff_btn_clicked(btn)
{
	btn.disabled=true;
	dcn.logoff(function() {
		window.location.href='/';
	}, function(msg) {
		alert('Logoff failed: ' + msg);
		btn.disabled=false;
	});
}
