#!/usr/bin/python

import web, threading, json, datetime, time
from common import gen_id

class TimeoutError(Exception):
	def __init__(self, *args, **kwargs):
		Exception.__init__(self, *args, **kwargs)

class Tape:
	'''
	Storage file format:

	{
		"<timestamp>": [ <event object>, ... ]
	}

	Event id is a string of format: "<timestamp>.<index>" where index
	is the index of the event in the timestamp list.
	'''
	_cv=threading.Condition()

	def __init__(self, path):
		self._path=path
		self._load()

	def _load(self):
		try:
			events=json.loads(open(self._path).read())
		except IOError:
			events={}
			
		return events

	def submit_event(self, event, timestamp=None):
		'''
        Submit next event (must be the most recent)
		'''
		if timestamp is None:
			timestamp=int(time.mktime(datetime.datetime.now().timetuple()))
		with self._cv:
			events=self._load()

			if str(timestamp) not in events:
				events[str(timestamp)]=[event]
			else:
				events[str(timestamp)].append(event)

			dump=json.dumps(events, ensure_ascii=False, sort_keys=True,
				indent=2)
			open(self._path, 'w').write(dump.encode('utf-8'))
			
			self._cv.notifyAll()
	
	def recent(self, **kwargs):
		'''Get recent events

		Keyword parameters:

			since=<timestamp> - only include events since given
				timestamp (including the timestamp)

			after=<event_id> - only include events that occured after
				the event with given id (excluding the event)

			max_count=<count> - only include at most max_count of the
				most recent events
		
		Returns the JSON serialized chronologically sorted list of
		triplets:
			[<timestamp>, <idx>, <event_object>], ...
		'''
		res=[]

		since=float(kwargs['since']) if kwargs.get('since') else None
		after_ts, after_idx=map(int, kwargs['after'].split('.')) \
			if kwargs.get('after') else (None, None)
		max_count=kwargs.get('max_count')
		if max_count is not None:
			max_count=int(max_count)
		
		with self._cv:
			events=self._load()

			ts_keys=map(int, events.keys())


			for ts in reversed(sorted(ts_keys)):
				evs=events[str(ts)]
				
				if since is not None and ts<since:
					return res

				if after_ts is not None:
					if ts < after_ts:
						return res

					if ts==after_ts:
						for i in range(len(evs)):
							if i > after_idx:
								res.insert(0, [ts, i, evs[i]])
								if max_count and len(res)==max_count:
									return res
						return res

				for i in range(len(evs)):
					idx=len(evs)-i-1
					res.insert(0, [ts, idx, evs[idx]])
					if max_count and len(res)==max_count:
						return res

			return res



	def wait(self, ev_id, timeout=None):
		'''
		Wait until at least one event appears after event with ev_id.

		If timeout is not None then after timeout seconds are elapsed
		TimeoutError instance is raised.
		'''
		ts, idx=map(int, ev_id.split('.'))

		if timeout is not None:
			timeout=float(timeout)

		wait_start=datetime.datetime.now()

		with self._cv:
			while True:
				events=self._load()
				last_ts=max(map(int, events))
				print 'WAIT', [last_ts, len(events[str(last_ts)])],\
					[ts, idx]
				if last_ts>ts:
					return

				if last_ts==ts and len(events[str(last_ts)])>idx+1:
					return

				now=datetime.datetime.now()

				if timeout and (now-wait_start).total_seconds() >= timeout:
					print 'by timeout', timeout, (now-wait_start).total_seconds()
					raise TimeoutError()

				if timeout:
					time_spent=(datetime.datetime.now()-wait_start)\
						.total_seconds()
					print 'waiting for', timeout-time_spent
					self._cv.wait(timeout-time_spent)
				else:
					self._cv.wait()
			
			

class TapeHandler:
    DEFAULT_MAX_LENGTH=1000
    Tape=None
    def GET(self):
		'''
        Get some last events or wait for new event(s)

        Without arguments returns a (default) number of last events.

        Optional request parameters:

        wait_after=<event_id>
            Wait for a first event after given event and then
            return a list of events from the given event till the end.
			Event id is a string of the form:
				"<timestamp>.<index>"
            Note: This option cannot be used with 'since'.

        max_length=<max length>
            Truncate the list if necessary to obtain at most max_length
            most recent events

        since=<timestamp>
            Return events since given timestamp (including the timestamp).
            Return immediately with an empty response if no more recent
            events have occured yet.
            Note: This option cannot be used with 'wait_after'.

        timeout=<float seconds>
            If wait option is selected wait_after for at most timeout
			seconds. If no new events have occured during this time
			return empty response.
            Note: this option can only be used with 'wait_after'.

        The response is a JSON string with a list of events. Events
        are sorted chronologically (most recent last) in the following
		format:

		[
			[<timestamp>, <idx>, <event_object>], ...
		]

        Status codes:

            200 OK // [...] - On success
            204 Timeout - On timeout
            400 Bad Request // <error description> - On malformed request

        TODO:
            - Add filtering (by user, event type/significance, etc.)
        '''
		if TapeHandler.Tape is None:
			raise Exception('TapeHandler.Tape is not set')
		
		print web.input()
		if 'wait_after' in web.input():
			try:
				print 'waiting after'
				TapeHandler.Tape.wait(web.input()['wait_after'],
					web.input().get('timeout'))
				print 'returning after wait'
				return json.dumps(TapeHandler.Tape.recent(
						after=web.input().get('wait_after'),
						max_count=web.input().get('max_length')))
			except TimeoutError:
				print 'returning on timeout'
				web.ctx.status='204 Timeout'
				return
		else:
			print 'returning immediately'
			return json.dumps(TapeHandler.Tape.recent(
					since=web.input().get('since'),
					max_count=web.input().get('max_length')))



