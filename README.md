# DCNet
Dreams Cartography Network

todo:
- search
- dream -> dream_view + dream_edit
- profile -> view+edit
- view users list
- view other user's dreams
- news/activities tape (global + filtered user's)
- 


For compression: https://github.com/pieroxy/lz-string/blob/master/libs/lz-string.js


API

GET /dreams.php?[userid=...&][accept=...:...:...&][filter=...&]cmd=(fetch|fetch_ts|delete)
'filter' is json array: [
	{
		"type": "date_before",
		"date": ...
	},
	{
		"type": "text_contains",
		"text": ...
	},
	...
]
