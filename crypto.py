#!/usr/bin/python

from Crypto.PublicKey import RSA
#from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
from base64 import b64encode, b64decode

import ecdsa, hashlib

def get_public_key(priv_key):
	sk=ecdsa.SigningKey.from_pem(priv_key)
	return sk.verifying_key.to_pem()

def sign(data, priv_key):
	'''
	Sign string using base64 encoded private key in PEM format
	'''
	assert type(data)==str
	sk=ecdsa.SigningKey.from_pem(priv_key)
	return b64encode(sk.sign(data, hashfunc=hashlib.sha256))

def verify(data, pub_key, sign):
	'''
	Verify string data signature using base64 encoded public key
	'''
	vk=ecdsa.VerifyingKey.from_pem(pub_key)
	return vk.verify(b64decode(sign), data, hashfunc=hashlib.sha256)

def hash8(data):
	'''
	Return SHA256-based 8-byte hash

	Hash is computed as a SHA256 digest, and then is xored
	as 8-bytes chunks into a 8 byte integer, which is then
	returned as a 16-digit hex string.

	The first digest's byte is considered the lowest byte.

	The hash string returned is the lowest byte first.
	'''
	if type(data) not in [str, unicode]:
		raise TypeError(type(data))

	digest=SHA256.new()
	digest.update(data)
	d=digest.digest()

	h=0
	while d:
		mul=1
		for i in range(8):
			if d:
				h ^= ord(d[0]) * mul
				mul *= 256
				d=d[1:]
	return '%016x' % h


"""
def _self_test():
	priv_key='''
MIICXAIBAAKBgQDgg8Fhku5qaCd3Yfs6jT3Azdt8GKeDJJ9Vvyhl8ZKQ9sUCVtYJ
oUESmd6HP8HDcs8SRmdE+skuJCtL0DWUNpiCPEFfhbgfqqTiO6EH05VusnTtrK4d
L17+PK4Rn7tu2TVQ9QQLFODt4GjGyi9XccNN71DA0N2zG1DyCYRsehrUFQIDAQAB
AoGBAIppT8fqwGcDLQmRc0OGncKGZsCbpnHYGw7O2YX3pwcNyykFBdFMA4UHLUQu
TzNCTVyT4MiK34o9rB+CDfYAroW8IXHOBGQFbD94ZXjZbzoRehoGtfpf0Tb9XJus
m/2zns5q8JqxoPlayNQRfYDI1biG8MDwtYucOAPkpZXReYDlAkEA885wzCRjDJ/B
V4S/Y4RGRMKMlmHQIydG85TYZMio/F9cF/BCt0wGOUspLqT6y7lVZM43uwhq6xTq
NfI3ixOeRwJBAOu+UHNye/70jcLiTjXpycSiW7V5oRxj37gi0PeikvkZIdu4oGoh
HjIuPiA8MOBQ1quJ3f/mjWZaoi8RkSmanMMCQEBiZSFT/qBH1Awjr1M9jDz+T5gr
DocqCS+sQBUldJLpL+3WchfryLz6n06FHQIN2II9fzQyPeIE7PEAHTDqJmMCQH+V
A902/DxDBeWOrF0pJXUxmQhhxvuiYZU54nXimkANhfFvvgEx4zGtLRos+RatKUC0
4Fx53dSjAFsQ2sr1ThkCQAgUhh50WUV+cRLW2Ll0dK1HBw0sAC5aaXCAWR/Eu4iq
0yBKS3ocvfxlAaysp99CFzipqdP8cawPPufbEQqfjOw=
	'''
	pub_key='''
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDgg8Fhku5qaCd3Yfs6jT3Azdt8
GKeDJJ9Vvyhl8ZKQ9sUCVtYJoUESmd6HP8HDcs8SRmdE+skuJCtL0DWUNpiCPEFf
hbgfqqTiO6EH05VusnTtrK4dL17+PK4Rn7tu2TVQ9QQLFODt4GjGyi9XccNN71DA
0N2zG1DyCYRsehrUFQIDAQAB
	'''
	#priv_key=''.join([ln.strip() for ln in priv_key.split('\n')])

	msg='Some messages'
	sig=sign(msg, priv_key)
	assert verify(msg, pub_key, sig)
	assert not verify(msg + '.', pub_key, sig)

if __name__=='__main__':
	_self_test()
"""
