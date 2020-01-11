function main()
{
	if (!auth.is_logged_in()) {
		page.go('gate');
	}
	// Algorithm:
	// 0. Asynchronously
	// 2. If the user is not logged in, load and pass to login screen
	// 3. Else pass to home screen.
//	console.log("main loaded");
}
