#!/usr/bin/python
# -*- coding: utf-8 -*-
import cgi
import webapp2
import json
from google.appengine.api import memcache
from webapp2_extras import sessions
config = {
  'webapp2_extras.sessions': {
	'secret_key': 'YOUR_SECRET_KEY'
  }
}
def user_required_json_tienda(handler):
	"""
	Decorator that checks if there's a user associated with the current session.
	Will also fail if there's no session present.
	"""
	def check_login(self, *args, **kwargs):
		mise = self.session.get('usuario')
		self.response.headers['Content-Type'] = 'application/json'
		if not mise or not mise.valida:
			self.response.out.write(json.dumps({"error":u"No hay sesión"}))
			return
		if not self.request.path=='/admintienda/Tiendas/tienda' and not mise.tienda:
			self.response.out.write(json.dumps({"error":u"No hay tienda %s" % mise.tienda}))
			return
		#"Csrf-Token"
		if not "X-CSRFToken" in self.request.headers:
			self.response.out.write(json.dumps({"error":u"No haaaayyy csrf "}))
			return
		#self.request.headers["Csrf-Token"]
		if not self.request.headers["X-CSRFToken"] == self.session.get('CSRFToken'):
			self.response.out.write(json.dumps({"error":u"No coincide csrf" }))
			return
		self.objjson=json.loads(cgi.escape(self.request.body))
		if not "ope" in self.objjson or not self.objjson["ope"] in ["ins","mod","del"]:
			self.response.out.write(json.dumps({"error":u"No hay operación"}))
			return
		return handler(self, *args, **kwargs)
	return check_login

class BaseHandler(webapp2.RequestHandler):
	
	# this is needed for webapp2 sessions to work
	def dispatch(self):
		
		# Get a session store for this request.
		self.session_store = sessions.get_store(request=self.request)

		try:
			# Dispatch the request.
			webapp2.RequestHandler.dispatch(self)
		finally:
			# Save all sessions.
			self.session_store.save_sessions(self.response)

	@webapp2.cached_property
	def session(self):
		"""Shortcut to access the current session."""
		return self.session_store.get_session(backend="memcache")

class respuesta(BaseHandler):
	"""def objeto_jsom(self):
		self.objjson=json.loads(cgi.escape(self.request.body))
		self.response.headers['Content-Type'] = 'application/json'
		if not "ope" in self.objjson:
			self.error("No hay operación")
			return False
		ope=self.objjson["ope"]
		tipo=["ins","mod","del"]
		if not ope in tipo:
			self.error("Operación errónea")
			return False
		return ope"""

	def errornor(self,s):
		self.response.out.write(json.dumps({"error":s}))
	def errorcomp(self,s):
		if self.numd==0:
			self.response.out.write(json.dumps({"error":s}))
		else:
			self.response.out.write(json.dumps({"ok":self.devol,"key":0,"menerr":s}))
	def ok(self,s,k = 0):
		self.response.out.write(json.dumps({"ok":s,"key":k}))
	def existe(self,va):
		for v in va:
			if not v in self.objjson:
				return False
		return True
	def existeen(self,va,dat):
		for v in va:
			if not v in dat:
				return False
		return True
	def loncade(self,va,ta):
		i=0
		for v in va:
			lo=len(self.objjson[v])
			if lo<2 or lo> ta[i]:
				return False
			i+=1
		return True
	def loncadeen(self,va,ta,dat):
		i=0
		for v in va:
			lo=len(dat[v])
			if lo<2 or lo> ta[i]:
				return False
			i+=1
		return True
	def aconverint(self,ar):
		nue=[]
		if type(ar) == list:
			for a in ar:
				nue.append(int(a))
		return nue
