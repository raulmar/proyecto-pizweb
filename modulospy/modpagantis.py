#!/usr/bin/python
# -*- coding: utf-8 -*-
import webapp2
import json
import cgi
import hashlib
from time import time
import datetime
from google.appengine.api import urlfetch
from webapp2_extras import sessions
from google.appengine.api import memcache
from modelos import todosmodelos
from modulospy import datosTienda,utils

"""def segundos():
	hoy=datetime.datetime.now()
	masuno=hoy + datetime.timedelta(days=1)
	return (datetime.datetime(masuno.year,masuno.month,masuno.day)-hoy).total_seconds()"""

"""class BaseHandler(webapp2.RequestHandler):
	
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
		#Shortcut to access the current session.
		return self.session_store.get_session(backend="memcache")"""

class formuPagantis(object):
	_action="https://psp.pagantis.com/2/sale"
	def __init__(self,tienda,tikey,pedido,returl,canurl,tokpag):
		self.tienda=tienda
		self.tikey=tikey
		self.pedido=pedido
		self._return_url=returl
		self._cancel_url=canurl
		self.tokpag=tokpag
	def getFormulario(self):
		pago=self.pedido["datped"]["importe"]
		suple=self.tienda["pagantis"]["inc_des"]
		if suple !=0:
			if self.tienda["pagantis"]["poroeur"]:
				suple=pago*(suple/100)
				pago=pago + suple
				#suple=int(suple*100) / 100.0
			else:
				pago+=suple
		pago=int(pago*100)
		
		regtra=todosmodelos.Transferencia(tienda=self.tikey,token_ec=self.tokpag,estado="created",modo=self.tienda["pagantis"]["modo"],redirect=self._action,suplemento=suple)
		ok=regtra.put()
		if ok:
			sh1="%s%s%d%dEURSHA1%s%s" % (self.tienda["pagantis"]["clave_firma"],self.tienda["pagantis"]["account_id"],ok.integer_id(),pago,self._return_url,self._cancel_url)
			return {
				"action": self._action,
				"inputs":[
					{"name": "order_id","value":ok.integer_id() },
					{"name":"auth_method" ,"value":"SHA1"},
					{"name":"amount" ,"value":pago}, 
					{"name":"currency","value":"EUR"},
					{"name":"description","value":"Pedido de tienda PiWeb"},
				  	{"name":"ok_url","value":self._return_url },
				  	{"name":"nok_url","value":self._cancel_url}, 
				  	{"name":"account_id","value":self.tienda["pagantis"]["account_id"]},
				  	{"name":"signature","value":hashlib.sha1(sh1).hexdigest()},
				]
			}
			"""formu="<form action="%s" method="post">
			  <!-- hidden params -->
			  <input name="order_id" type="hidden" value="%d" /> 
			  <input name="auth_method" type="hidden" value="SHA1" />
			  <input name="amount" type="hidden" value="%d" /> 
			  <input name="currency" type="hidden" value="EUR" />
			  <input name="description" type="hidden" value="Pedido de tienda PiWeb" />
			  <input name="ok_url" type="hidden" value="%s" /> 
			  <input name="nok_url" type="hidden" value="%s" /> 
			  <input name="account_id" type="hidden" value="%s" />
			  <input name="signature" type="hidden" value="%s" />
			  
			  <!-- submit-->
			  <input type="submit" value="Realizar pago"/>
			</form>" % ( self._action,ok.integer_id(),pago,self._return_url,self._cancel_url,self.tienda["pagantis"]["account_id"],hashlib.sha1(sh1).hexdigest() )
			return formu"""
		else:
			self.error=u"No se pudo crear registro de Transacciones"
			return False

class returnurlHandler(utils.BaseHandler):
	def get(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		token=self.request.get('token') 
		if not self.session or not self.session.has_key("tok_pag") or not self.session.get("tok_pag") == token or not self.session.get("order_id"):
			self.response.out.write(u"mal en returnurlHandler pagantis url no hay session, o order_id, token=%s" % token)
			return
		"""try:
			respujson=json.loads(cgi.escape(self.request.body))
		except Exception as e:
			self.response.out.write(u"exception en retunrurlHandler al hacer respujson Pagantis: %s" % e.message)
			return
		if "event" in respujson and respujson["event"]=="charge.created" and "data" in respujson:"""
		regtra=todosmodelos.Transferencia.get_by_id(int(self.session.get("order_id")))
		#regtra=todosmodelos.Transferencia.query(todosmodelos.Transferencia.token_ec==token).get()
		if not regtra:
			self.response.out.write(u"mal en returnurlHandler pagantis no hay registro transferencia , token=%s" % token) 
			return
		if regtra.token_ec==token and regtra.estado=="completed":
			nomtien=nomtien.upper()
			tienda=memcache.get(nomtien+"tienda")
			tikey=memcache.get(nomtien+"key")
			if not tienda:
				tien=regtra.tienda.get()
				if tien:
					tienda=utils.getTienda(tien,utils.segundos())
					tikey=tien.key
				else:
					tien=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtien).get()
					if tien:
						tienda=utils.getTienda(tien,utils.segundos())
						tikey=tien.key
					else:
						self.response.out.write(u"no puedo llamar a tienda , token=%s" % token)
						return
			resp=self.env_pago_grab_pedido(3,tikey,regtra)
			if resp[0]:
				regtra.reg_pedido=resp[1]
				regtra.put()
				self.session["tok_pag"]=None
				self.session["pedido"]=None
				self.session["tok_pag"]=None
				self.session.pop('pedido')
				self.session.pop("tok_pag")
				self.session.pop("order_id")
				self.response.out.write("ok se ha enviado y grabado  status 200  <br> y, <p> token=%s </p>" % token)
			else:
				self.response.out.write("error al enviar y grabar pedido= %s, <br> ok en consulta charge status 200  <br> y, <p> token=%s </p>" % (resp[1],token))
			return
			"""try:cha_6801d60bd2977711010261eaabc6af0d
				result = urlfetch.fetch(url="https://psp.pagantis.com/api/1/charges/" + respujson["data"]["id"],
						    method=urlfetch.GET,
						    headers={
						    "Authorization": ("Bearer %s" % self.tienda["pagantis"]["apikey"])
							},validate_certificate=False)
			except Exception as e:
				self.response.out.write(u"exception en returnurlHandler pagantis consulta charge: %s,<p> respujson=%s</p>" % (e.message,respujson))
				return
			respujson2=json.loads(result.content)
			if result.status_code == 200:
				
				self.response.out.write("ok en consulta charge status 200 content respujson2 = %s <br> y, <p> token=%s </p>" % (respujson2,token))
			else:
				self.response.out.write(u"mal en consulta charge status status_code %d ,<p> content = %s</p>, token=%s,respujson2=%s" % (result.status_code,result.content,token,respujson2))"""
			#regtra.status="completed"
			#regtra.put()
			self.response.out.write("ok en consulta charge status 200  <br> y, <p> token=%s </p>" % token)
		else:
			self.response.out.write(u"mal en returnurlHandler pagantis token no coincide con regtra.token_ec o regtra.estado no ==completed, regtra.estado=%s ,<p>token=%s</p><regtra.token_ec=%s</p><p>token %s</p>" % (regtra.estado,token,regtra.token_ec,token))
		#else:
		#	self.response.out.write(u"mal en returnurlHandler pagantis even or charge.created or data <p>token=%s</p><p>respujson %s</p>" % (token,respujson))

class cancelurlHandler(utils.BaseHandler):
	def get(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		token=self.request.get('token') 
		if not self.session or not self.session.has_key("tok_pag") or not self.session.get("tok_pag") == token or not self.session.get("order_id"):
			self.response.out.write(u"mal en cancelurlHandler pagantis url no hay session, token=%s, o order_id" % token)
			return
		regtra=todosmodelos.Transferencia.get_by_id(int(self.session.get("order_id")))
		#regtra=todosmodelos.Transferencia.query(todosmodelos.Transferencia.token_ec==token).get()
		if not regtra:
			self.response.out.write(u"mal en cancelurlHandler pagantis no hay registro transferencia , token=%s" % token )
			return
		if regtra.token_ec==token:
			#respujson2=json.loads(result.content)
			regtra.estado="canceled"
			regtra.put()
			self.response.out.write("ok en cancelurlHandler cancelurlHandler cancelado<br> y <p>order_id=%s </p>, <p> token=%s </p>" % (self.session.ge("order_id"),token))
		else:
			self.response.out.write(u"mal en cancelurlHandler pagantis token no coincide con restra.token_ec ,<p>token=%s</p><regtra.token=%s</p>" % (token,regtra.token_ec))

class notification_pagantis_urlHandler(webapp2.RequestHandler):
	def post(self):
		try:
			respujson=json.loads(cgi.escape(self.request.body))
		except Exception as e:
			return 
		if "event" in respujson and respujson["event"]=="charge.created" and "data" in respujson and respujson["data"]["paid"]==True and respujson["data"]["captured"]==True:
			regtra=todosmodelos.Transferencia.get_by_id(int(respujson["data"]["order_id"]))
			if regtra:
				#nomtien = kwargs['nom_tien'].upper()
				#tien=memcache.get(nomtien+"tienda")
				tien=regtra.tienda.get()
				if tien and tien.pagantis and tiend.pagantis.account_id==respujson["account_id"]:
					#["data"]["id"] es igual a algo parecido a esto "cha_7edc89511073d397fc6666e24967107d "cha_1234567890"
					regtra.id_payment=respujson["data"]["id"]
					regtra.estado="completed"
					regtra.response_executed=respujson
					regtra.put()

