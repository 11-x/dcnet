

DCNet Installation Guide
========================

Prerequisites
-------------

1. Python 2.7 with packages 'web.py' and 'pyOpenSSL'

Initial setup
-------------

1. Create config file

	cp config.json.example config.json

2. Set paths to node keys:

	- node private key
	- HTTPS certificate
	- HTTPS private key

Note: node private key can be generated as follows:

	openssl ecparam -name secp256k1 -out <node_id_file> -genkey -noout

Node: self-signed HTTPS certificates can be obtained as follows:
