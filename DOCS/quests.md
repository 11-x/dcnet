Simple log quest
----------------
"<id>": {
	"type": "form",
	"caption": "Log Entry",
	"description": "A simple log form\nGo ahead and fill it",
	"form": {
		"caption": {
			"type": "string",
			"mandatory": true,
			"min_length": 2
		},
		"body": {
			"type": "htext",
			"mandatory": false
		},
		"date": {
			"type": "datetime",
			"mandatory": false,
			"default_value": {
				"type": "cur_datetime"
			}
		},
		"tags": {
			"type": "set",
			"element_type": "instance",
			"class": "<ref_tag>"
		},
		"notes": {
			"type": "list",
			"element_type": "htext",
			"mandatory": false,
			"default_value": {
				"type": "list",
				"values": []
			}
		}
	}
}

Example of a filled form
"<id>": {
	"type": "filled_form",
	"form": "<form_id>",
	"fields": {
		"caption": "Поход за тортом",
		"body": "Был тёплый летний день. Я увидел в магазине торт.\nНедолго думая я зашёл в магазин и купил его.",
		"date": "2019-06-07",
		"tags": ["<tag_food>", "<tag_summer>"]
	}
}


Dream Log Entry Form Specification Item
=======================================

	"<id>": {
		"type": "form",
		"name": "Dream Log Entry",
		"final": true
		"encrypt": "prompt",
		"fields": [
			{
				"name": "dream_title",
				"caption": "title",
				"type": "string",
				"min_length": 2,
				"max_length": 1000,
				"multiline": false,
				"mandatory": false
			},
			{
				"caption": "description",
				"type": "htext",
				"mandatory": false
			},
			{
				"caption": "schemas",
				"type": "array",
				"mandatory": false,
				"element": {
					"type": "reference",
					"conformance": ["drawing"]
				}
			},
			{
				"caption": "tags",
				"type": "array",
				"element": {
					"type": "reference",
					"conformance": ["<dream/tag+?-/ref>"]
				}
			}
		]
	}
