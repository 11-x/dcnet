function body_onload()
{
	dcn.check_logged_in(function(status) {
		if (typeof(status)=="undefined") {
			alert('Failed to obtain logged in status');
		} else if (status) {
			document.location.href='home.html';
		} else {
			document.location.href='entry.html';
		}
	});
}
