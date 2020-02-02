/* Items Database Module
 *
 * Items are stored in filesystem in a directory.
 * DB directory contains first level subdirectories, which, in turn,
 * contain files, one per item. File name is item id. Subdirectory
 * name is channel id.
 */
const fs=require('fs');

class DB
{
	constructor(dir) {
		this._path=dir;
		if (!fs.existsSync(this._path))
			throw "Directory does not exist: " + this._path;
	}

	reserve(cid) {
		// Algorithm:
		// If chan does not exist create it
		// Generate item id, which does not exist in chan
		// Create stub file at chan dir
		// Return iid
		throw "not implemented";
	}

	init(cid, iid, value) {
		// Algorithm:
		// Ensure chan dir exists
		// Ensure item file exists and is a stub
		// Owerwrite item file with json'd value
		throw "not implemented";
	}

};

exports.create=function(dir) {
	return new DB(dir);
}
