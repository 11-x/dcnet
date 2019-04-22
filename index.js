function logoff()
{
	localStorage.removeItem('pass');
	document.location.href='/logoff.php';
}
function unregister()
{
	if (confirm('This will permanently delete your access. Sure?')) {
		store_user();
		document.location.href='/deluser.php';
	}
}
