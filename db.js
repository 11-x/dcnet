/* Items Database Module
 *
 * Items are stored in filesystem in a directory.
 * DB directory contains first level subdirectories, which, in turn,
 * contain files, one per item. File name is item id. Subdirectory
 * name is channel id.
 */
const DEFAULT_ID_LENGTH=16;
const DEFAULT_ID_ALPHABETH=
	'abcdefghijklmnopqrstuvwxyz' +
	'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
	'0123456789';
const GEN_ID_MAX_ATTEMPTS=10;

const assert=require('assert');
const fs=require('fs');
const path=require('path');

function gen_id(filter, length, alphabeth, max_attempts) {
	if (typeof filter=="undefined")
		filter=id => true;
	
	if (typeof length=="undefined")
		length=DEFAULT_ID_LENGTH;
	
	if (typeof alphabeth=="undefined")
		alphabeth=DEFAULT_ID_ALPHABETH;
	
	for (let i=0; i<GEN_ID_MAX_ATTEMPTS; i++) {
		let id='';

		while (id.length<length)
			id+=alphabeth[Math.floor(Math.random()*alphabeth.length)];
		
		console.log(id, filter(id));
		if (filter(id))
			return id;
	}

	throw "Failed to generate id";
}

class DB
{
	constructor(dir) {
		this._path=dir;
		if (!fs.existsSync(this._path))
			throw "Directory does not exist: " + this._path;
	}

	_get_iids(chan_id) {
		let chan_dir=path.join(this._path, chan_id)
		if (!fs.existsSync(chan_dir))
			return [];

		return fs.readdirSync(chan_dir);
	}

	_get_val(chan_id, item_id) {
		let jcontent=fs.readFileSync(path.join(this._path, chan_id,
			item_id));

		let content=JSON.parse(jcontent);

		let ndata=JSON.parse(content.jndata);
		let data=JSON.parse(ndata.jdata);
		return data.val;
	}

	reserve(cid) {
		// Algorithm:
		// If chan does not exist create it
		// Generate item id, which does not exist in chan
		// Create stub file at chan dir
		// Return iid

		assert(cid.includes('.')==false
			|| ['.users', '.chans', '.nodes'].includes(cid));

		let chan_path=path.join(this._path, cid);

		if (!fs.existsSync(chan_path))
			fs.mkdirSync(chan_path);

		let id=gen_id(iid => (!fs.existsSync(path.join(chan_path, iid))));

		fs.writeFileSync(path.join(chan_path, id), '(reserved) '
			+ Date.now());

		return id;
	}

	init(cid, iid, value) {
		// Algorithm:
		// Ensure chan dir exists
		// Ensure item file exists and is a stub
		// Owerwrite item file with json'd value
		assert(typeof value=="object");

		let chan_path=path.join(this._path, cid);

		assert(fs.existsSync(chan_path));

		let item_path=path.join(chan_path, iid);

		assert(fs.existsSync(item_path));

		let data=fs.readFileSync(item_path).toString();

		assert(data.startsWith('(reserved) '));

		fs.writeFileSync(item_path, JSON.stringify(value));
	}

	/**
	 * Returns a dict of items, which match filter(val)
	 */
	query_vals(chan_id, filter) {
		let res={};

		let iids=this._get_iids(chan_id);

		for (let i in iids) {
			let iid=iids[i];

			let val=this._get_val(chan_id, iid);
			if (filter(val))
				res[iid]=val;
		}

		return res;
	}
};

exports.create=function(dir) {
	return new DB(dir);
}
