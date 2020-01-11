async function page_loaded()
{
	console.log("GATE LOADED");
	console.log("GATE LOADED");
	await page.require('helping');
	help();
}
