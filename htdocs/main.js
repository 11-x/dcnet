function main()
{
	if (location.pathname=='/') {
		if (!auth.is_logged_in()) {
			page.go('gate');
		}
	} else {
		page.go(location.pathname.slice(1));
	}
}
