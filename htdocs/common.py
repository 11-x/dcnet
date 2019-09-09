#!/usr/bin/python

import random

def gen_id(ff=lambda x: True, **kwargs):
	alphabeth=kwargs.get('alphabeth', '0123456789ABCDEF')
	length=kwargs.get('length', 16)
	max_attempts=kwargs.get('max_attempts', 1000)

	for _ in range(max_attempts):
		id=''.join([random.choice(alphabeth) for _ in range(length)])
		if ff(id):
			return id
	
	raise Exception('Failed to generate suitable id')

