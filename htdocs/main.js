function main()
{
	if (location.pathname=='/') {
		if (!auth.is_logged_in) {
			page.go('gate');
		}
	} else {
		// This page is normally invoked as /page_name
		page.go(location.pathname.slice(1));
	}
}
