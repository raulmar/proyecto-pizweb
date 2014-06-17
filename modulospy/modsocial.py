#!/usr/bin/python
# -*- coding: utf-8 -*-
import json
import urllib
import base64
from random import getrandbits
import time
import hashlib
import hmac
import binascii
from google.appengine.api import urlfetch
from google.appengine.api import memcache
from modulospy import utils, claves
from modelos import todosmodelos


def nuevo_nonce():
	"""chars=string.ascii_letters + string.digits
	tok= ''.join(random.choice(chars) for x in range(32))
	return tok"""
	return base64.b64encode("%0x" % getrandbits(256))[:32]

def dame_hora():
	return str(int(time.time()))


fatipores="code"
fapermisos="email"



def getcredentials():
	credentials = "%s:%s" % (urllib.quote(claves.consumer_key.encode('utf-8'),""), urllib.quote(consumer_secret.encode('utf-8'),""))
	return base64.b64encode(credentials)

def percent_encode(k,v):
	per="%s=%s" % (k,v)
	return urllib.quote(per.encode('utf-8'),"")

def sin_percent_encode(k,v):
	return "%s=%s" % (k,urllib.quote(v.encode('utf-8'),""))

def getFirma(u,h,nonce,tok,ov=None):
	#Creating a signature:
	if not ov == None:
		parametros_string="%s&%s&%s&%s&%s&%s&%s" % (sin_percent_encode("oauth_consumer_key",claves.consumer_key ),sin_percent_encode("oauth_nonce",nonce),sin_percent_encode("oauth_signature_method","HMAC-SHA1"),sin_percent_encode("oauth_timestamp",h),sin_percent_encode("oauth_token",tok),sin_percent_encode("oauth_verifier",ov),sin_percent_encode("oauth_version","1.0"))
		Signing_key="%s&%s" % ( urllib.quote(consumer_secret,""),urllib.quote(tok,""))
	else:
		parametros_string="%s&%s&%s&%s&%s&%s" % (sin_percent_encode("oauth_callback",tok ),sin_percent_encode("oauth_consumer_key",claves.consumer_key ),sin_percent_encode("oauth_nonce",nonce),sin_percent_encode("oauth_signature_method","HMAC-SHA1"),sin_percent_encode("oauth_timestamp",h),sin_percent_encode("oauth_version","1.0"))
		Signing_key="%s&" %  urllib.quote(consumer_secret.encode('utf-8'),"")
	Firma_string="POST&%s&%s" % (urllib.quote(u,""),urllib.quote(parametros_string,""))

	hash1 = hmac.new( Signing_key,Firma_string, hashlib.sha1).digest()
	#hash2 = hmac.new(Firma_string, , hashlib.sha1).digest()
	#return (Firma_string,Signing_key,base64.b64encode(hash1),base64.b64encode(hash2) )
	#return base64.b64encode(hash1)
	return binascii.b2a_base64(hash1)[:-1]


class loginfacebook(utils.BaseHandler):
	@utils.tienda_required
	def get(self, *args, **kwargs):
		self.redirect("https://www.facebook.com/dialog/oauth?client_id=%s&redirect_uri=%s&response-type=%s&scope=%s" % (claves.faapp_id,self.uri_for('returnurlface', nom_tien=self.res["tienda"]["nombre"], _full=True),fatipores,fapermisos ))

class returnurlHandlerface(utils.BaseHandler):
	@utils.tienda_required
	def get(self, *args, **kwargs):

		code_parameter=self.request.get('code')
		if not code_parameter:
			error=self.request.get('error')
			if error:
				template_values={ 'errorh':u'error_reason:%s, error_description:%s' % ( self.request.get('error_reason'),self.request.get('error_description')) }
				
				#self.reponse.write(u'error_reason:%s, error_description:%s' % ( self.request.get('error_reason'),self.request.get('error_description')))
			else:
				template_values={ 'errorh':"mmmmmmmmno recibo code_parameter"  }
				#self.response.out.write("mmmmmmmmno recibo code_parameter" )
			self.render_tplt('/templates/unatienindex7.html',template_values)
			return
		adto="%s|%s" % (claves.faapp_id,claves.faapp_secret)
		hayusu=self.session and self.session.get("fb-usuario")
		if hayusu:
			fbtok=hayusu.get("fb-token")
			ahora=int(time.time())
			if fbtok and (fbtok["expires"] + fbtok["vino"]) > ahora:
				self.getInforUsu(hayusu.get("usu-id"),adto)
				return

		req_uri="https://www.facebook.com/dialog/oauth?client_id=%s&redirect_uri=%s&response-type=%s&scope=%s" % (claves.faapp_id,self.uri_for('returnurlface', nom_tien=self.res["tienda"]["nombre"], _full=True),fatipores,fapermisos )
		u="https://graph.facebook.com/oauth/access_token?client_id=%s&redirect_uri=%s&client_secret=%s&code=%s" % (claves.faapp_id, req_uri,claves.faapp_secret,code_parameter)
   		try:
			result = urlfetch.fetch(url=u,
						    method=urlfetch.GET,
						    validate_certificate=False)
		except Exception as e:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':u" exception en pedir token en returnurlHandlerface : %s" % e.message})
			#self.response.out.write(u" exception en pedir token en returnurlHandlerface : %s" % e.message)
			return
		#access_token={access-token}&expires={seconds-til-expiration}
		if result.status_code == 200:
			#ok en obtener token en returnurlHandlerface content=access_token=CAAUMaExm21MBAFIc6eGw0QTn2yRgmvWFNxg12nOHpVZAN9rJPV3PpG2cC4ooqZC0YlyI73nqRhRdzV6JMZAahg2Bh3N3MCySNwS11XiiCRrvm528ossMhQZBhFbAg2E74Gghk77JrbILbL1I5NmthTIr8u7dGZCmJAnqT3Ryw5dtZCYi1pZC74Q&expires=5183644
			vari = result.content.split("&")
			mijson={}
			for i in vari:
				k,v=i.split("=")
				mijson[k]=v
			if ("access_token" in mijson) and ("expires" in mijson) :
				
				u2="https://graph.facebook.com/v2.0/debug_token?input_token=%s&access_token=%s" % (mijson["access_token"],adto)
				try:
					result = urlfetch.fetch(url=u2,
								    method=urlfetch.GET,
								    validate_certificate=False)
				except Exception as e:
					self.render_tplt('/templates/unatienindex7.html',{'errorh':u" exception en depurar token en returnurlHandlerface : %s" % e.message})
					#self.response.out.write(u" exception en depurar token en returnurlHandlerface : %s" % e.message)
					return
				if result.status_code == 200:
					mijson["vino"]=int(time.time())
					#{"data":{"app_id":"1421016981494611","is_valid":true,"application":"ejemplo login social","user_id":"10201992019705886","issued_at":1399146679,"expires_at":1404330679,"scopes":["public_profile","email"]}}
					resjson=json.loads(result.content)
					if ("data" in resjson) and ("user_id" in resjson["data"]):
						self.getInforUsu(resjson["data"]["user_id"],adto,mijson)
					else:
						self.render_tplt('/templates/unatienindex7.html',{'errorh':"ok en depurar token no hay data en  content=%s" % result.content})
						#self.response.out.write("ok en depurar token no hay data en  content=%s" % result.content)
				else:
					self.render_tplt('/templates/unatienindex7.html',{'errorh':"ok en obtener token en returnurlHandlerface, pero mal depurar token content=%s, token expira en=%d" % (result.content,mijson["expires"]) })
					#self.response.out.write("ok en obtener token en returnurlHandlerface, pero mal depurar token content=%s, token expira en=%d" % (result.content,mijson["expires"]) )
			else:
				self.render_tplt('/templates/unatienindex7.html',{'errorh':"mal al obtener token en returnurlHandlerface content=%s, no hay access_token o expires" % result.content})
				#self.response.out.write("mal al obtener token en returnurlHandlerface content=%s, token expira en=%d" % (result.content,mijson["expires"]) )
		else:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':"mal  en obtener token en returnurlHandlerface <p> status code=%d</p><p>content=%s</p>" % (result.status_code, result.content)})
			#self.response.out.write("mal  en obtener token en returnurlHandlerface no hay access_token o expires <p> status code=%d</p><p>content=%s</p>" % (result.status_code, result.content) )

	@todosmodelos.ndb.toplevel
	def getInforUsu(self,idusu,adto,mijson=False):
		u3="https://graph.facebook.com/v2.0/%s?fields=id,name,picture,email&method=GET&format=json&suppress_http_code=1&access_token=%s" % (idusu,adto )
		try:
			result = urlfetch.fetch(url=u3,
						    method=urlfetch.GET,
						    validate_certificate=False)
		except Exception as e:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':u" exception en obtener informacion de usuario %s: %s" % (idusu,e.message)})
			#self.response.out.write(u" exception en obtener informacion de usuario %s: %s" % (idusu,e.message))
			return
		if result.status_code == 200:
			usu=json.loads(result.content)
			if mijson:
				#men="voy directo a  obtener informacion de usuario"
				ex=int(mijson["expires"])-120
				self.session["fb-usuario"]={
					"fb-token":{
						"access_token":mijson["access_token"],
						"expires":ex,
						"vino":mijson["vino"]
					},
					"usu-id":usu["id"]
				}
			else:
				ex=self.session.get("fb-usuario")["fb-token"]["expires"]
				#men="ok en obtener informacion de usuario"
			#ok en obtener informacion de usuario 10201992019705886:
#content={"id":"10201992019705886","name":"Raul Martinez","picture":{"data":{"is_silhouette":true,"url":"https:\/\/fbcdn-profile-a.akamaihd.net\/hprofile-ak-frc1\/t1.0-1\/c25.0.81.81\/s50x50\/252231_1002029915278_1941483569_s.jpg"}},"email":"tlloreda\u0040hotmail.com"}
			idso="fa-%s" % usu["id"]
			u2=todosmodelos.socialRed.query(todosmodelos.socialRed.id_social==idso).get()
			if not u2:
				"""oauth_token = ndb.StringProperty()
	oauth_token_secret = ndb.StringProperty()
	expires =  ndb.IntegerProperty()
	id_social= ndb.StringProperty(indexed = True) # tw-  o fb- mas el id de twitter o facebook
	nombre= ndb.StructuredProperty()
	email= ndb.StringProperty()
	avatar= ndb.StringProperty()"""
				u2=todosmodelos.socialRed(id_social=idso,oauth_token=mijson["access_token"],expires=ex, nombre=usu["name"], email=usu["email"],avatar=usu["picture"]["data"]["url"]).put_async()
				clien=todosmodelos.Clientes(parent=self.restikey,idsocial=idso,email=usu["email"],validada=True)
				u=clien.put_async()
				u=u.get_result()
				rcli={'id':u.id(),'usu':clien,'tipo':"fa",'avatar':usu["picture"]["data"]["url"],'nombre':usu["name"]}
				self.enviarCliente(rcli,self.restikey,None)
			else:
				u2.populate(nombre=usu["name"],oauth_token=mijson["access_token"],expires=ex, email=usu["email"],avatar=usu["picture"]["data"]["url"])
				u2.put_async()
				clien = todosmodelos.Clientes.query(todosmodelos.Clientes.idsocial==idso,ancestor=self.restikey).get()
				if not clien:
					clien=todosmodelos.Clientes(parent=self.restikey,email=usu["email"],idsocial=idso,validada=True)
					u=clien.put()
					rcli={'id':u.id(),'usu':clien,'tipo':"fa",'avatar':usu["picture"]["data"]["url"],'nombre':usu["name"]}
					self.enviarCliente(rcli,self.restikey,None)
				else:
					if not clien.email == usu["email"]:
						clien.email=usu["email"]
						clien.put_async()
			self.session['cliente']= {'tipo':"fa","usu":clien,"avatar":usu["picture"]["data"]["url"],"nombre":"<a href='https://www.facebook.com/' target='_blank'>%s</a>" % usu["name"], "tienda":self.restikey}
			self.render_tplt('/templates/pedidoa.html',{
				'sel':-1,
	            'seli':-1,
	            'hora':int(time.time()*1000),
	            'hh':utils.fhorario(self.res)
	           })
			#self.response.out.write(u"%s %s:<p> <img src=\"%s\" /></p>" % (men,usu,usu["picture"]["data"]["url"]))
			#self.response.out.write("ok en obtener informacion de usuario %s:<p> content=%s</p>" % (resjson["data"]["user_id"],result.content))
		else:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':"mal en obtener informacion de usuario %s:<p> status_code=%d</p>" % (idusu,result.status_code)})
			#self.response.out.write("mal en obtener informacion de usuario %s:<p> status_code=%d</p>" % (idusu,result.status_code))

class baseTwitter(utils.BaseHandler):
	@todosmodelos.ndb.toplevel
	def getInforUsuTw(self,oat2,aot2sec,nose):
		nonce2=nuevo_nonce()
		h2=dame_hora()
		u2="https://api.twitter.com/1.1/account/verify_credentials.json"
		parametros_string="%s&%s&%s&%s&%s&%s" % (sin_percent_encode("oauth_consumer_key",claves.consumer_key ),sin_percent_encode("oauth_nonce",nonce2),sin_percent_encode("oauth_signature_method","HMAC-SHA1"),sin_percent_encode("oauth_timestamp",h2),sin_percent_encode("oauth_token",oat2),sin_percent_encode("oauth_version","1.0"))

		uno=urllib.quote(consumer_secret.encode('utf-8'),"")
		dos=urllib.quote(aot2sec.encode('utf-8'),"")
		Signing_key="%s&%s" % ( uno,dos)
		Firma_string="GET&%s&%s" % (urllib.quote(u2,""),urllib.quote(parametros_string,""))
		hash1 = hmac.new( Signing_key,Firma_string, hashlib.sha1).digest()
		fir=binascii.b2a_base64(hash1)[:-1]
		#base64.b64encode(hash1)
		cabecera_string="OAuth %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\"" % (urllib.quote("oauth_consumer_key"),urllib.quote(claves.consumer_key.encode('utf-8'),""), urllib.quote("oauth_nonce"),urllib.quote(nonce2.encode('utf-8'),""),urllib.quote("oauth_signature"),urllib.quote(fir), urllib.quote("oauth_signature_method"),urllib.quote("HMAC-SHA1"),urllib.quote("oauth_timestamp"),urllib.quote(h2.encode('utf-8')),urllib.quote("oauth_token"),urllib.quote(oat2.encode('utf-8'),""),urllib.quote("oauth_version"),urllib.quote("1.0"))
		try:
			result2 = urlfetch.fetch(url=u2,
				 			method=urlfetch.GET,
						    headers={
						    "X-HostCommonName":"api.twitter.com",
						    "Authorization": cabecera_string,
						    "X-Target-URI":"https://api.twitter.com",
						    "Connection":"Keep-Alive"
							},validate_certificate=False)
		except Exception as e:
			return (False, u"exception en returnurlHandler getInforUsuTw obtener credenciales: %s" % e.message)
		if result2.status_code == 200:
			usu=json.loads(result2.content)
			usu["email"]="sin_emailTwitter"
			idso="tw-%s" % str(usu["id"])
			u2=todosmodelos.socialRed.query(todosmodelos.socialRed.id_social==idso).get()
			if not u2:
				"""oauth_token = ndb.StringProperty()
	oauth_token_secret = ndb.StringProperty()
	expires =  ndb.IntegerProperty()
	id_social= ndb.StringProperty(indexed = True) # tw-  o fb- mas el id de twitter o facebook
	nombre= ndb.StructuredProperty()
	email= ndb.StringProperty()
	avatar= ndb.StringProperty()"""
				u2=todosmodelos.socialRed(id_social=idso,oauth_token=oat2,oauth_token_secret =aot2sec, nombre=usu["name"], email=usu["email"],avatar=usu["profile_image_url"]).put_async()
				clien=todosmodelos.Clientes(parent=self.restikey,idsocial=idso,email=usu["email"],validada=True)
				u=clien.put_async()
				u=u.get_result()
				rcli={'id':u.id(),'usu':clien,'tipo':"tw",'avatar':usu["profile_image_url"],'nombre':"%s (<a href='https://twitter.com/@%s' target='_blank'>@%s</a>)" %  (usu["name"],usu["screen_name"],usu["screen_name"])}
				self.enviarCliente(rcli,self.restikey,None)
			else:
				u2.populate(nombre=usu["name"],oauth_token=oat2,oauth_token_secret =aot2sec, email=usu["email"],avatar=usu["profile_image_url"])
				u2.put_async()
				clien = todosmodelos.Clientes.query(todosmodelos.Clientes.idsocial==idso,ancestor=self.restikey).get()
				if not clien:
					clien=todosmodelos.Clientes(parent=self.restikey,idsocial=idso,email=usu["email"],validada=True)
					u=clien.put()
					rcli={'id':u.id(),'usu':clien,'tipo':"tw",'avatar':usu["profile_image_url"],'nombre':"%s (<a href='https://twitter.com/@%s' target='_blank'>@%s</a>)" %  (usu["name"],usu["screen_name"],usu["screen_name"])}
					self.enviarCliente(rcli,self.restikey,None)
				else:
					if not clien.email == usu["email"]:
						clien.email=usu["email"]
						clien.put_async()
			self.session['cliente']= {'tipo':"tw","usu":clien,"avatar":usu["profile_image_url"],"nombre":"%s (<a href='https://twitter.com/@%s' target='_blank'>@%s</a>)" % (usu["name"],usu["screen_name"],usu["screen_name"]), "tienda":self.restikey}
			return (True,{
				'sel':-1,
	            'seli':-1,
	            'hora':int(time.time()*1000),
	            'hh':utils.fhorario(self.res)
	           })
			#return (True, u"ok en returnurlHandler obtener credenciales content=%s" % result2.content)
		else:
			return (False, u"malllll en returnurlHandler getInforUsuTw, status_code=%d ,<p> --------------content=%s</p><p> oat2=%s</p><p> cabecera=%s</p><p>firma=%s" % (result2.status_code,result2.content,oat2,cabecera_string,Firma_string))

class logintwitter(baseTwitter):
	@utils.tienda_required
	def get(self, *args, **kwargs):
		twt=self.session.get("tw-usuario")
		if twt:
			resinf=self.getInforUsuTw(twt["oauth"],twt["token_secret"],None)
			if resinf[0]==True:
				self.render_tplt('/templates/pedidoa.html',resinf[1])
			else:
				self.render_tplt('/templates/unatienindex7.html',{'errorh':resinf[1]})
			return
		fir="nana"
		if self.getAccesToken():
			u="https://api.twitter.com/oauth/request_token"
			h=dame_hora()
			nonce=nuevo_nonce()
			callback_url=self.uri_for('returnurltw', nom_tien=self.res["tienda"]["nombre"], _full=True)
			fir=getFirma(u,h,nonce,callback_url)
			cabecera_string="OAuth %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\"" % (
				urllib.quote("oauth_callback"),urllib.quote(callback_url.encode('utf-8'),""),
				urllib.quote("oauth_consumer_key"),urllib.quote(claves.consumer_key.encode('utf-8'),""), 
				urllib.quote("oauth_nonce"),urllib.quote(nonce.encode('utf-8'),""),
				urllib.quote("oauth_signature"),urllib.quote(fir.encode('utf-8'),""),
				urllib.quote("oauth_signature_method"),urllib.quote("HMAC-SHA1".encode('utf-8')),
				urllib.quote("oauth_timestamp"),urllib.quote(h.encode('utf-8')),
				#urllib.quote("oauth_token"),urllib.quote(self.access_token,""),
				urllib.quote("oauth_version"),urllib.quote("1.0".encode('utf-8')))
		else:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':self.error})
			#self.response.out.write(self.error)
			return
		#self.response.out.write(u"cabecera=%s<br> nonc=%s" % (cabecera_string,nonce))
		#return
		#"https://api.twitter.com/oauth2/token"
		try:
			result = urlfetch.fetch(url=u,
						    method=urlfetch.POST,
						    headers={
						    "User-Agent": "My Twitter App v1.0.1",
						    "Authorization": cabecera_string
							},validate_certificate=False)
		except Exception as e:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':u" exception en getAutorizar_cabecera : %s" % e.message})
			#self.response.out.write(u" exception en getAutorizar_cabecera : %s" % e.message)
			return
		if result.status_code == 200:
			#datagettok=json.loads(result.content)
			"""oauth_token=kegRSaNdMxqxCWlELgH6dnYNeZquMZw36giljy1DA&
			oauth_token_secret=n7Ya7LpvGeoj5lIv4Njd08pMRHoTukSAtWHwqg&
			oauth_callback_confirmed=true"""
			vari = result.content.split("&")
			mijson={}
			for i in vari:
				k,v=i.split("=")
				mijson[k]=v

			#self.response.out.write(u"ok request_token content =%s, <p> mijson=%s</p>" % (result.content,mijson))
			#return
			if ("oauth_token" in mijson) and ("oauth_token_secret" in mijson) and ("oauth_callback_confirmed" in mijson) and mijson["oauth_callback_confirmed"] == "true":
				twt=mijson["oauth_token"]
				self.session["tw-oauth_token_pru"]=twt
				#self.response.out.write(u"ok en oauth_token = %s" % datagettok["oauth_token"])
				self.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=%s" % twt)
			else:
				self.render_tplt('/templates/unatienindex7.html',{'errorh':u"no oauth_token o oauth_token_secret or ..., <p> content=%s" % result.content})
				#self.response.out.write(u"no oauth_token o oauth_token_secret or ..., <p> content=%s" % result.content)
		else:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':u"no status 200 en login twuitter oauth/request_token, <p> content=%s</p><p> firma=%s</p>" % (result.content,fir)})
			#self.response.out.write(u"no status 200 en login twuitter oauth2/token, <p> content=%s</p><p> firma=%s</p>" % (result.content,fir))
		

	def getAccesToken(self):
		#Obtaining access tokens:
		twt=memcache.get("tw-token")
		if twt:
			return twt

		try:
			result = urlfetch.fetch(url="https://api.twitter.com/oauth2/token",
						    payload="grant_type=client_credentials",
						    method=urlfetch.POST,
						    headers={
						    "User-Agent": "My Twitter App v1.0.1",
						    "Authorization": ("Basic %s" % getcredentials()),
		                	"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
		                	"Content-Length":"29"
							},validate_certificate=False)
		except Exception as e:
			self.error=u"exception en obtener token getAccesToken : %s" % e.message
			return False
		if result.status_code == 200:
			datagettok=json.loads(result.content)
			if "token_type" in datagettok and  datagettok["token_type"] =="bearer" and "access_token" in datagettok:
				memcache.set("tw-token",datagettok["access_token"])
				return True
			else:
				self.error="error en getAccesToken no hay bearer content=%s" % result.content
				return False
		else:
			self.error="error en getAccesToken no status 200 content=%s" % result.content
			return False

	

class returnurlHandlertw(baseTwitter):
	@utils.tienda_required
	def get(self, *args, **kwargs):
		#http://localhost:23081/sign-in-with-twitter?oauth_token=WvLHSPvzNmHoxO7pnZmI8WPHNCtw7NEwQdhcRNY06s&oauth_verifier=ntER4jN64fe5wImC5UQRDjUxK1MWHyF3lVBpcCkL4
		oat=self.request.get('oauth_token')
		oav=self.request.get('oauth_verifier')

		if not oat or not oav or not oat == self.session.get("tw-oauth_token_pru"):
			self.render_tplt('/templates/unatienindex7.html',{'errorh':"fallo en recibo oauth_token o oauth_verifier, en returnurlHandler oat=%s, oav=%s, sesi.tw.oau=%s" % (oat,oav,self.session.get("tw-oauth_token_pru"))})
			#self.response.out.write("fallo en recibo oauth_token o oauth_verifier, puede que memcache falle en returnurlHandler oat=%s, oav=%s" % (oat,oav) )
			return
		u="https://api.twitter.com/oauth/access_token"
		#u="https://api.twitter.com//oauth/access_token"
		nonce=nuevo_nonce()
		h=dame_hora()
		cabecera_string="OAuth %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\", %s=\"%s\"" % (urllib.quote("oauth_consumer_key"),urllib.quote(claves.consumer_key.encode('utf-8'),""), urllib.quote("oauth_nonce"),urllib.quote(nonce.encode('utf-8'),""),urllib.quote("oauth_signature"),urllib.quote(getFirma(u,h,oat,nonce,oav)), urllib.quote("oauth_signature_method"),urllib.quote("HMAC-SHA1"),urllib.quote("oauth_timestamp"),urllib.quote(h.encode('utf-8')),urllib.quote("oauth_token"),urllib.quote(oat,""),urllib.quote("oauth_version"),urllib.quote("1.0"))
		try:
			result = urlfetch.fetch(url=u,
						    payload="oauth_verifier=%s" % oav,
						    method=urlfetch.POST,
						    headers={
						    "User-Agent": "My Twitter App v1.0.1",
						    "Authorization": cabecera_string,
		                	"Content-Type": "application/x-www-form-urlencoded"
							},validate_certificate=False)
		except Exception as e:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':u"exception en returnurlHandlertw : %s" % e.message})
			#self.response.out.write(u"exception en returnurlHandler : %s" % e.message)
			return
		if result.status_code == 200:
			vari = result.content.split("&")
			mijson={}
			for i in vari:
				k,v=i.split("=")
				mijson[k]=v
			if "oauth_token" in mijson and "oauth_token_secret" in mijson:
				resinf=self.getInforUsuTw(mijson["oauth_token"],mijson["oauth_token_secret"],True)
				if (resinf[0]):
					self.session["tw-usuario"]={"oauth": mijson["oauth_token"], "token_secret":mijson["oauth_token_secret"] }
					self.render_tplt('/templates/pedidoa.html',resinf[1])
				else:
					self.render_tplt('/templates/unatienindex7.html',{'errorh':resinf[1]})
				#self.response.out.write(resinf[1])
			else:
				self.render_tplt('/templates/unatienindex7.html',{'errorh':u"no hay oauth_token,oauth_token_secret en mijson content = %s" % result.content})
				#self.response.out.write(u"no hay oauth_token en mijson content = %s" % result.content)
		else:
			self.render_tplt('/templates/unatienindex7.html',{'errorh':"no status 200  en returnurlHandlertw content=%s" % result.content})
			#self.response.out.write("no status 200  en returnurlHandler content=%s" % result.content)

	