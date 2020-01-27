Dreams Cartography Network Node
===============================

Quick start guide
-----------------

* Generate node identity key and obtain https key/certificate (see 
Keys and certificates generation section for info)
* Rename config.json-example into config.json and set up its contents
(see Configuration file section for help)
* Run `nodejs node.js`
* Connect to https://localhost:1443 (or whatever port is specified in
`config.json`) in browser


Configuration file
------------------

File: config.json

`node_name` (string) - Human-readable node name. Node name cannot be changed (node id depends on it)

`log_path` (string) - Path to file to throw logs to

`node_privkey_path` - Node identity file (ECDSA private key)

`https_cert_path` and `https_privkey_path` - HTTPS server certificate and
	key paths. 


Keys and certificates generation
--------------------------------

To generate node identity file type:

	openssl ecparam -name prime256v1 -genkey > path/to/file

To generate HTTPS self-signed certificate type:

	openssl genrsa -out key.pem
	openssl req -new -key key.pem -out csr.pem
	openssl x509 -req -days 9999 -in csr.pem -signkey key.pem -out cert.pem
	rm csr.pem
