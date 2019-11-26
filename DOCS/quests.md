Simple log quest
----------------

"<id>": {
	"type": "quest",
	"title": "ev_logger",
	"description": "This is a simple logging quest\nJust add logs",
	"actions": {
		"post_log": {
			"type": "construct_item",
			"item_class": "<&A>",
			"init": {
				"notes+=": "Record for quest {this}"
			}
		}
	}
}

"<a>": {
	"type": "data_item_spec",
	"title": "Log Record",
	"fields": {
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

