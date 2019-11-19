#!/usr/bin/python

import random

def gen_id(ff=lambda x: True, **kwargs):
	'''
	Generate random id, which satisfies the condition

	Arguments:

	ff - lambda function, which checks the condition. Defaults to True

	Keyword Arguments:

	alphabeth - the alphabeth to use. Defaults to upper-case hex digits

	length - length of the id, defaults to 16

	max_attempts - maximum number of unsuccessful attempts before Exception
	is thrown. Defaults to 1000

	Returns the id generated
	'''
	alphabeth=kwargs.get('alphabeth', '0123456789ABCDEF')
	length=kwargs.get('length', 16)
	max_attempts=kwargs.get('max_attempts', 1000)

	for _ in range(max_attempts):
		id=''.join([random.choice(alphabeth) for _ in range(length)])
		if ff(id):
			return id
	
	raise Exception('Failed to generate suitable id')

