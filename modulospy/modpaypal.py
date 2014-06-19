#!/usr/bin/python
# -*- coding: utf-8 -*-
import webapp2
import json
import logging
import uuid
from time import time
import datetime
from google.appengine.api import urlfetch
import base64
from webapp2_extras import sessions
from google.appengine.api import memcache
from modelos import todosmodelos
from modulospy import utils

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

class tokenPay(object):
	_urlpru_gettoken="https://api.sandbox.paypal.com/v1/oauth2/token"
	_urlpru_payment="https://api.sandbox.paypal.com/v1/payments/payment"
	_urlreal_gettoken="https://api.paypal.com/v1/oauth2/token"
	_urlreal_payment="https://api.paypal.com/v1/payments/payment"

	_urlpru_execute ="https://api.sandbox.paypal.com/v1/payments/payment/"
	_urlreal_execute="https://api.paypal.com/v1/payments/payment/"

	#_return_url="http://localhost:22081/returnurl"
	#_cancel_url="http://localhost:22081/cancelurl"
	_user_agent = "PayPalSDK/rest-sdk-python"
	_payload = "grant_type=client_credentials"
	def __init__(self,tienda,tikey=None):
		self.tienda=tienda
		self.tikey=tikey
		if tienda["paypal"]["modo"]:
			self.urlgettoken=self._urlreal_gettoken
			self.urlpayment=self._urlreal_payment
			self.url_execute=self._urlreal_execute
		else:
			self.urlgettoken=self._urlpru_gettoken
			self.urlpayment=self._urlpru_payment
			self.url_execute=self._urlpru_execute
	def getPaypalToken(self):
		
		if self.tienda["paypal"].get("vino_token"):
			dif=int(time())-self.tienda["paypal"]["vino_token"]
			if dif < self.tienda["paypal"]["expires_in"]:
				return True
		try:
			result = urlfetch.fetch(url=self.urlgettoken,
				    payload=self._payload,
				    method=urlfetch.POST,
				    headers={
				    "Authorization": ("Basic %s" % self.getcredentials()),
                	"Content-Type": "application/x-www-form-urlencoded",
                	"Accept": "application/json", "User-Agent": self._user_agent,
					"Accept-Language": "en_US"
					},validate_certificate=False)
		except Exception as e:
			self.error=u"exception en obtener token : %s" % e.message
			return False
		if result.status_code == 200:
			#self.response.out.write(u"ok en get token status 200 content = %s" % result.content)
			datagettok=json.loads(result.content)
			expi=int(datagettok["expires_in"])-300
			tiem=int(time())
			self.tienda["paypal"]["expires_in"]=expi
			self.tienda["paypal"]["access_token"]=datagettok["access_token"]
			self.tienda["paypal"]["vino_token"]=tiem
			nomti=self.tienda["url_tien"] #.upper()
			idtien=self.tienda["id"]
			memcache.set(idtien+"tienda",self.tienda,utils.getSegundos())
			if not self.tikey:
				self.tikey=memcache.get(idtien+"key")
			if self.tikey:
				ti=self.tikey.get()
			else:
				ti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomti).get()
			if ti:
				self.tikey=ti.key
				ti.paypal.access_token=datagettok["access_token"]
				ti.paypal.expires_in=expi
				ti.paypal.vino_token=tiem
				ti.put()
			return True
		else:
			self.error=u"mal status_code %d , content = %s" % (result.status_code,result.content)
			return False

	def getcredentials(self):
   		credentials = "%s:%s" % (self.tienda["paypal"]["clientid"], self.tienda["paypal"]["secret"])
   		return base64.b64encode(credentials.encode('utf-8')).decode('utf-8').replace("\n", "")

	def error_status_code(self,response):
		if 500 <= response.status_code <= 599:
			return "- PayPal server error"
		rescod={
	    	"200":"- Request OK",
			"201":"- Resource created",
			"401":"- Unauthorized request",
			"402":"- Failed request",
			"403":"- Forbidden",
			"404":"- Resource was not found"
		}
		status=str(response.status_code)
		if rescod.has_key(status):
			return rescod[status]
		return "- Error desconocido"

class clapi(tokenPay):
	
	def __init__(self,pedido,tienda,tikey,returl,canurl):
		super(clapi, self).__init__(tienda,tikey)
		#self.tikey=tikey
		self.pedido=pedido
		self._return_url=returl
		self._cancel_url=canurl

	def hacerPayment(self):
		if not self.getPaypalToken():
			return False
		
		det=[]
		for d in self.pedido["detalleapi"]:
			if d["articulo"] < 1000:
				if d.has_key("ofertaid"):
					p="0"
				else:
					p="%.2f" % d["preu"]
				det.append({
					"quantity":d["cant"],
		  			"name":d["nombre"],
		  			"price":p,
		  			"currency":"EUR"
					})
			else:
				det.append({
					"quantity":"1",
		  			"name":"Oferta %s " % d["nomofer"],
		  			"price":"%.2f" % d["totofer"],
		  			"currency":"EUR"
					})
		pago=self.pedido["datped"]["importe"]
		suple=self.tienda["paypal"]["inc_des"]
		if suple > 0:
			if self.tienda["paypal"]["poroeur"]:
				suple=pago*(suple/100)
				pago=pago + suple
				#suple=int(suple*100) / 100.0
			else:
				pago+=suple
			det.append({
					"quantity":"1",
		  			"name":self.tienda["paypal"]["stringsuple"],
		  			"price":"%.2f" % suple,
		  			"currency":"EUR"
					})
		elif suple < 0:
			if self.tienda["paypal"]["poroeur"]:
				suple=pago*(suple/100)
				pago=pago - suple
				#suple=int(suple*100) / 100.0
			else:
				pago-=suple
		pago=int(pago*100) / 100.0
		self.pedido["suppaypal"]=suple
		self.pedido["totalcargado"]=pago
		values= {
			"intent":"sale",
			"redirect_urls":{
				"return_url":self._return_url,
				"cancel_url":self._cancel_url
			},
			"payer":{
				"payment_method":"paypal"
			},
			"transactions":[
			{
			  "amount":{
			    "total":"%.2f" % pago,
			    "currency":"EUR"
			  },
			  "description": "Pizza Web pago de su pedido de pizzas.",
			  "item_list":{
			  	"items":det
			  }
			}
			]
		}
		valudu=json.dumps(values)
		try:
			#Create a payment by constructing a payment object using access token.
			result = urlfetch.fetch(url=self.urlpayment,
					    payload=valudu,
					    method=urlfetch.POST,
					    headers={
					    "Authorization": ("Bearer %s" % self.tienda["paypal"]["access_token"]),
	                	"Content-Type": "application/json"
						},validate_certificate=False)
		except Exception as e:
			self.error=u"exception en hacerPayment: %s" % e.message
			return False
		if result.status_code == 201 or result.status_code == 200:
			#self.response.out.write(u"ok en hacer payment status 200 content = %s" % result.content)
			self.datadopay=json.loads(result.content)
			if self.datadopay.has_key("id") and self.datadopay.has_key("state") and self.datadopay["state"] == "created":
				if self.datadopay.has_key("links"):
					for t in self.datadopay["links"]:
						if t.has_key("rel") and t["rel"]=="approval_url":
							fto=t["href"].find("token");
							if fto > 0:
								return self.crearRegitroTrans(t["href"],t["href"][fto+6:],suple)
								#memcache.set('id-pay',self.datadopay["id"])
								#memcache.set("ec_token",t["href"][fto+6:])
								#self.redirect(t["href"])
								#return
					self.error=u"mal no hay 'approval_url o token ' en hacer paymen status_code %d , content = %s" % (result.status_code,result.content)
				else:
					self.error=u"mal no hay 'links' en hacer paymen status_code %d , content = %s" % (result.status_code,result.content)
			else:
				self.error=u"mal en 'state' or en 'id' en hacer paymen status_code %d , content = %s" % (result.status_code,result.content)
		else:
			self.error=u"mal en hacer paymen status_code %d , content = %s, values=%s" % (result.status_code,result.content,valudu)
		return False

	def crearRegitroTrans(self,redirect,ec_token,suple):
		regtra=todosmodelos.Transferencia(tienda=self.tikey,token_ec=ec_token,id_payment=self.datadopay["id"],estado="created",modo=self.tienda["paypal"]["modo"],redirect=redirect,suplemento=suple)
		ok=regtra.put()
		if ok:
			#self.session["ec_token"]=ec_token
			#self.session["redirect"]=
			#self.session["paypal"]=self.tienda["paypal"]
			return {"ec_token":ec_token,"redirect":redirect }
		else:
			self.error= "Error al grabar registro de transferencia paypal"
			return False


class returnurlHandler(utils.BaseHandler):
	def get(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		token=self.request.get('token') 
		PayerID=self.request.get('PayerID')
		if not self.session or not self.session.has_key("ec_token") or not self.session.get("ec_token") == token:
			self.response.out.write(u"mal en returnpayapl url no hay session, token=%s,payerid=%s" % (token,PayerID))
			return
		regtra=todosmodelos.Transferencia.query(todosmodelos.Transferencia.token_ec==token).get()
		if not regtra:
			self.response.out.write(u"mal en returnpayapl url no hay registro transferencia , token=%s,payerid=%s" % (token,PayerID))
			return
		tienda,tikey=utils.getMemTiendaMulti(nomtien)
		"""nomtien=nomtien.upper()
		tienda=memcache.get(nomtien+"tienda")
		tikey=memcache.get(nomtien+"key")"""
		if not tienda:
			tien=regtra.tienda.get()
			if tien:
				tienda=utils.getTienda(tien,utils.getSegundos())
				tikey=tien.key
			else:
				tien=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtien).get()
				if tien:
					tienda=utils.getTienda(tien,utils.getSegundos())
					tikey=tien.key
				else:
					self.response.out.write(u"no puedo llamar a tienda , token=%s,payerid=%s" % (token,PayerID))
					return

		tienda["paypal"]["modo"]= regtra.modo
		pay=tokenPay(tienda,tikey)
		if not pay.getPaypalToken():
			self.response.out.write(u"%s, token=%s,payerid=%s" % (pay.error,token,PayerID))
			return
		vaex={
			"payer_id":PayerID
		}
		try:
			#Create a payment by constructing a payment object using access token.
			result = urlfetch.fetch(url=pay.url_execute + regtra.id_payment+"/execute/",
					    payload=json.dumps(vaex),
					    method=urlfetch.POST,
					    headers={
					    "Authorization": ("Bearer %s" % pay.tienda["paypal"]["access_token"]),
	                	"Content-Type": "application/json"
						},validate_certificate=False)
		except Exception as e:
			self.response.out.write(u"exception en hacerPayment: %s" % e.message)
			return
		if result.status_code == 200:
			respujson=json.loads(result.content)
			if respujson.has_key("state") and respujson["state"] == "approved":
				regtra.response_executed=respujson
				regtra.estado="approved"
				resp=self.env_pago_grab_pedido(2,tikey,regtra)
				if resp[0]:
					regtra.reg_pedido=resp[1]
					self.session["ec_token"]=None
					self.session["pedido"]=None
					self.session.pop('pedido')
					self.session.pop('ec_token')
					self.response.out.write("ok seha enviado y grabado el pedido, en execute status 200 content = %s <br> y <p>regtra._id_pay=%s </p>, <p> PayerID=%s </p>,<p> <br> pay.tienda.acces_token=%s </p>, <p> token=%s </p>" % (respujson,regtra.id_payment, PayerID,pay.tienda["paypal"]["access_token"],token))
				else:
					self.response.out.write("error respuesta al enviar y grabar=%s, ok en execute status 200 content = %s <br> y <p>regtra._id_pay=%s </p>, <p> PayerID=%s </p>,<p> <br> pay.tienda.acces_token=%s </p>, <p> token=%s </p>" % (resp[1],respujson,regtra.id_payment, PayerID,pay.tienda["paypal"]["access_token"],token))
				regtra.put()
				return
				#hay que hacer llamada a tienda pasando los datos y que nos de el numero de pedido int(resto["numped"])
				#ahora lo hacemos asi 
				numped=1
				#grabar pedido
				pedido=regtra.pedido
				datped=pedido["datped"]
				detalle=json.loads(pedido["detallemio"])
				
				lisdet=[]
				for d in detalle:
					try:
						if d["oferta"]:
							lisdet.append(todosmodelos.Detalle(articulo=d["articulo"],det=d["det"],ofertaid=d["oferta"]["idofer"],ofertadet=d["oferta"],preart=d["oferta"]["precio"]))
						else:
							lisdet.append(todosmodelos.Detalle(articulo=d["articulo"],det=d["det"],preart=d["preart"]))
					except Exception as e:
						self.response.out.write("Exception en for detalle status 200 content = %s <br> y <p>regtra._id_pay=%s </p>, <p> PayerID=%s </p>,<p> <br> pay.tienda.acces_token=%s </p>, <p> token=%s </p><p> detalle pedido=%s</p> mensage exception=%s" % (respujson,regtra.id_payment, PayerID,pay.tienda["paypal"]["access_token"],token,json.dumps(detalle),e.message))
						return
				if datped["pedidoen"]>1:
					canom=todosmodelos.CalleNom(nom=datped["callenom"]["nom"],via=datped["callenom"]["via"],num=datped["callenom"]["num"],bloq=datped["callenom"]["bloq"],piso=datped["callenom"]["piso"],esca=datped["callenom"]["esca"],letra=datped["callenom"]["letra"],muni=datped["callenom"]["muni"])
				else:
					canom=None
				kcli=None
				if self.session.get('cliente'):
					kcli=self.session.get('cliente')

				ped=todosmodelos.Pedido(parent=tikey,pedidoen=datped["pedidoen"],cliente=kcli,numped=numped,telefono=datped["telefono"],callenom=canom,importe=datped["importe"],horapedido=datped["horaped"],horaent=datped["horaent"],comen=datped["comen"],detalle=lisdet,suplemento=regtra.suplemento,pago=2,regpago=regtra.key)
				okped=ped.put()
				regtra.response_executed=respujson
				regtra.estado="approved"
				txtped="No se ha grabado pedido"
				if okped:
					txtped="se ha grabado pedido"
					regtra.reg_pedido=okped
					if kcli:
						kcli.get()
						nped=kcli.numpedidos+1
						kcli.populate(ultimopedido=datped["horaped"],numpedidos=nped)
						kcli.put()
						txtped="se ha grabado pedido y se ha grabado cliente"
				regtra.put()
				self.response.out.write("ok en execute status 200 content = %s <br> y <p>regtra._id_pay=%s </p>, <p> PayerID=%s </p>,<p> <br> pay.tienda.acces_token=%s </p>, <p> token=%s </p><p> grabado=%s" % (respujson,regtra.id_payment, PayerID,pay.tienda["paypal"]["access_token"],token,txtped))
			else:
				self.response.out.write("no state aprobado en return url %s <br> y <p>egtra._id_pay=%s </p>, <p> PayerID=%s </p>,<p> <br> pay.tienda.acces_token=%s </p>, <p> token=%s </p>" % (respujson,regtra.id_payment, PayerID,pay.tienda["paypal"]["access_token"],token))
			#self.datadopay=json.loads(result.content)
		else:
			self.response.out.write(u"mal en execute paymen status_code %d = %s, content = %s, token=%s, memtoken=%s,payerid=%s" % (result.status_code,pay.error_status_code(result),result.content,token, memcache.get("access_token"),PayerID))

class cancelurlHandler(utils.BaseHandler):
	def get(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		token=self.request.get('token') # EC-60U79048BN7719609&
		if not self.session or not self.session.has_key("ec_token") or not self.session.get("ec_token") == token:
			self.response.out.write(u"mal en cancelurlHandler url no hay session, token=%s,payerid=%s" % token)
			return
		regtra=todosmodelos.Transferencia.query(todosmodelos.Transferencia.token_ec==token).get()
		if not regtra:
			self.response.out.write(u"mal en cancelurlhandler url no hay registro transferencia , token=%s" % token)
			return
		tienda,tikey=utils.getMemTiendaMulti(nomtien)
		"""nomtien=nomtien.upper()
		tienda=memcache.get(nomtien+"tienda")
		tikey=memcache.get(nomtien+"key")"""
		if not tienda:
			tien=regtra.tienda.get()
			if tien:
				tienda=utils.getTienda(tien,utils.getSegundos())
				tikey=tien.key
			else:
				tien=ti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtien).get()
				if tien:
					tienda=utils.getTienda(tien,utils.getSegundos())
					tikey=tien.key
				else:
					self.response.out.write(u"no puedo llamar a tienda cancelurlhandler, token=%s" % token)
					return
		tienda["paypal"]["modo"]= regtra.modo
		pay=tokenPay(tienda,tikey)
		if not pay.getPaypalToken():
			self.response.out.write(u"%s, token=%s" % (pay.error,token))
			return
		
		#GET /v1/payments/payment/{paymentId}
		try:
			result = urlfetch.fetch(url=pay.url_execute + regtra.id_payment,
					    method=urlfetch.GET,
					    headers={
					    "Authorization": ("Bearer %s" % pay.tienda["paypal"]["access_token"]),
	                	"Content-Type": "application/json"
						},validate_certificate=False)
		except Exception as e:
			self.response.out.write(u"exception en hacerPayment: %s" % e.message)
			return
		if result.status_code == 200:
			respujson=json.loads(result.content)
			if respujson.has_key("state") and respujson["state"] == "canceled":
				regtra.response_lookup=respujson
				regtra.estado="canceled"
				regtra.put()
				self.response.out.write("ok en cancelurlhandler lookup status 200 content = %s <br> y <p>regtra._id_pay=%s </p>,<p> <br> pay.tienda.acces_token=%s </p>, <p> token=%s </p>" % (respujson,regtra.id_payment, pay.tienda["paypal"]["access_token"],token))
			else:
				self.response.out.write("no state aprobado en return url %s <br> y <p>regtra._id_pay=%s </p>, <p> <br> pay.tienda.acces_token=%s </p>, <p> token=%s </p>" % (respujson,regtra.id_payment,pay.tienda["paypal"]["access_token"],token))
		else:
			self.response.out.write(u"mal en cancelurlhandler lookup paymen status_code %d = %s ,<p> content = %s</p>, token=%s, access_token=%s" % (result.status_code,pay.error_status_code(result),result.content,token,pay.tienda["paypal"]["access_token"]))