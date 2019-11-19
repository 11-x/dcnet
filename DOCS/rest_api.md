RESTful Server API
==================

API URLs may have additional prefix.

All API calls return JSON string on success.

Valid URLs:
	/j/[<cid>[/<uid>][&mode=deep]]

Channel id
----------
cid is a upper-case hex string of length 32, which consists of two subids:
node_id + chan_short_id, each of length 16. 'node_id' is the id of a
node, which created the channel.

NOTE: later the cid convention may be extended, but the convention must
somehow ensure that no cid collision appears. For now it is ensured by
the node_id prefix.

Node id
-------
Node id is a known 8-byte hash function, applied to node public key +
node name, and represented as a 16 hex digit string.

User id
-------
User id is a known 8-byte hash function, applied to user public key,
represented as a 16 hex digit string.

Special channels (start with '.'):
/j/.nodes { "<nid>": <node_info>, ... }
/j/.users { "<uid>": <user_info>, ... }
/j/.chans { "<cid>": <chan_info>, ... }
/j/<cid>/<iid>

/j
   GET -> 200 ["<cid>", ...]

/j/<cid>
   GET -> 200 {
		"<iid>": {
			"jndata": J{
				"jdata": J{
					"uid": "<uid>", // except items, posted by node or
						// guests (user registration, etc.)
					"cid": "<cid>",
					"iid": "<iid>", // except initial revision
					"val": <val>, // except deleted
					"rev": "<rev>", // except initial revision
				},
				"usig": "<user signature>"
				"iid": "<iid>", // for the initial revision only
				"perm": "<hash>" // current channel descriptor hash
					// except pre-defined channels
			},
			"nsig": "<node signature>"
		}...
	}
  POST {
  		"jdata": J{
			"uid": "<uid>", // except user creation
			"cid": "<cid>",
			"val": <val>
		},
		"usig": "<user signature>",
		"perm": "<hash>" // optional, hash of current active channel
			// descriptor, which provide the permission
	   } -> (201) "<iid>"

/j/<cid>/<iid>
   GET -> <value>
   PUT {
   		"jdata": J{
			"uid": "<uid>",
			"cid": "<cid>",
			"iid": "<iid>",
			"val": <value>,
			"rev": "<hash>"
		},
		"usig": "<sig>"
       } -> (none)
DELETE {
		"jdata": J{
			"uid": "<uid>",
			"cid": "<cid>",
			"iid": "<iid>",
			"rev": "<item_hash>"
		},
		"usig": "<sig>"
	   } -> (none)

Channel creation
----------------

To create a channel POST an item into /.chans channel. Value must be a
valid channel descriptor

channel descriptor: {
	"owner": "<uid>", // owner can change the descriptor
	"moderators": ["<uid>",...] | "*", // users, allowed to delete
		// and rollback
		// others' items, .. em.. ?
	"writers": ["<uid>",...] | "*", // users, allowed to post
		// to channel and
		// modify/delete their own items
	"name": "<Channel name>", // optional
	"description": "<chan description>" // optional
}

Special value "*" for moderators and writers means that everyone has such
a permission

User creation
-------------

Anonymous can post item to the .users channel. Value must be a valid user
descriptor. The user can later modify the record.

User descriptor : {
	"pub_key": "<pub_key>",
	"priv_key": "<priv_key>", // password protected, optional
	"username": "<username>", // optional
	"home": "<cid>" // optional
}

Node descriptor : {
	"pub_key": "<pub_key>",
	"nodename": "<nodename>" // optional
}

Streaming API: TODO
-------------------
	Main idea: create streaming request and then GET updates

Static HTML API
---------------

NOTE: no /j/ prefix
NOTE: optional ?self=<uid> argument forces to transmit private user storage
	(with private keys to decode encrypted data)

/?self=<uid> - main page

/chan/<cid>?self=<uid>

/item/<cid>/<iid>?self=<uid>

Node implementation recommendations
-----------------------------------

Node stores items, created by it, as well as by other nodes
Daemon polls updates from subscribed nodes and stores them into local
database
Node can discard items, created by other nodes or users (blacklist) by
stopping fetching and ignoring (archieving/deleting) those items

