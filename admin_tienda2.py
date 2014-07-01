#!/usr/bin/python
# -*- coding: utf-8 -*-
import webapp2
import json
import cgi
import uuid
import datetime
import logging
import string
import random
import hashlib
from google.appengine.api import mail
from webapp2_extras import sessions
from time import time
from google.appengine.api import memcache
from modulospy import baserequest
from modelos import todosmodelos
import pizzas2 as Piz
import otros2 as Otr
import otrosx3 as OtrX
import ofertas3 as Ofer
import tienda2 as Tie
import imgs3 as Img
import copiartodo as Copiar

#tabvenme3.js
"""
<script src="controladormasastamas4.js"></script>
<script src="controladorOtros2.js"></script>
<script src="controladorOtroscomplex4.js"></script>
<script src="controladorOfertas.js"></script>
<script src="controladorTiendaprin3.js"></script>
<script src="controladorPrincipal2.js"></script>
"""
"""<span class='aviso'>Mientras realices cambios desactiva la página Web.</span> <span></span> <span class='aviso'>Cuando termines de realizar las modificaciones vuelve a activar. | </span> """
TEMPLATE_PRICIPAL = u"""<!DOCTYPE html> 
<html lang="es">
<head>
	<meta charset="UTF-8">
	<title>Pizza Web</title>
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1">
	<link rel="shortcut icon" type="image/x-icon"  href="imagenes/favicon.ico" />
	<link rel="stylesheet"  href="normalize.css"/>
	<link rel="stylesheet"  href="tablaventanamenu2.css"/>
	<link rel="stylesheet"  href="ventanas.css"/>
<script src="hutils.js"></script>
<script src="tabvenme4nue.js"></script>
<script src="FileImgApi3.js"></script>

</head>
<body>
<div class="header">
    <div  class="logo"> <img src="logopiweb.png"/></div>
    <div class='cabeuser' id='logusu'>
          <span >Logged in as %s</span> <button class='btn btn-oscuro' >Logout</button>
    </div>   
</div>
<div id="loader" class="loader"></div>
<script src="controladorOtroscomplex5nue.js"></script>
<script src="controladormasastamas5nue.js"></script>
<script src="controladorOtros3nue.js"></script>
<script src="controladorOfertas2nue.js"></script>
<script src="controladorTiendaprin3.js"></script>
<script src="controladorPrincipal2.js"></script>
</body>
</html>"""


TEMPLATE_404=u"""<!DOCTYPE html> 
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pizza Web / %s</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <link rel="shortcut icon" type="image/x-icon"  href="favicon.ico" />
  <link rel="stylesheet"  href="normalize.css"/>
  <link rel="stylesheet"  href="main2.css"/>
 </head>
<body>
<div class="cabecera">
    <div  class="logo"><a href="/usuario" title='Home'><img src="logo2.png"/></a></div>
    <div class='cabeuser' id='logusu'>
          Logged in as <span >%s</span> | <a href="/usuario" class='logout' >Home</a>
    </div>  
</div>
<div class='error404'>
<h1>ERROR (%s)</h1>
<h2>%s</h2>
<img src="404.png"/>
</div>
</body>
</html>"""
HOME_TEMPLATE="""<!DOCTYPE html> 
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Pizza Web</title>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge;chrome=1">
  <link rel="shortcut icon" type="image/x-icon"  href="favicon.ico" />
  <link rel="stylesheet"  href="normalize.css"/>
  <link rel="stylesheet"  href="main2.css"/>
<script src="hUtils.js"></script>
</head>
<body>
<div class="cabecera">
    <div  class="logo"> <img src="logopiweb.png"/></div>
    <div class='cabeuser' id='logusu'>
          Logged in as <span >%s</span> | <a href="/usuario/logout" class='logout' >Logout</a>
    </div>  
</div>
<div id='fail'>
      <strong>%s</strong>
</div>
<input type="hidden" id='ve' value="%s"/>
<input type="hidden" id='to' value="%s"/>
<script src="main2.js"></script>
<script>function hUtilsdomReady(){  inicio("%s"); }</script>
</body>
</html>"""
#<script>window.onload=function() { inicio("%s"); }</script>
def nuevo_token():
	chars=string.ascii_letters + string.digits
	tok= ''.join(random.choice(chars) for x in range(32))
	return tok

def tok_md5(t):
	return hashlib.md5(t),hexdigest()

def tok_sha224(t):
	return hashlib.sha224(t).hexdigest()

def nueva_contra(p):
	return tok_sha224(p)

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

	def render_template(self, failed="",vt="",to="",ema=""):
		if self.session.get('usuario'):
			user=self.session.get('usuario').nombre
			ema=self.session.get('usuario').email
		else:
			user=""
		self.response.out.write(HOME_TEMPLATE % (user, failed,vt,to,ema))
	def resjsonerror(self,s):
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps({"error":s},ensure_ascii=False))

	def resjsonok(self,s,k = 0):
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps({"ok":s,"key":k},ensure_ascii=False))

class MainHandler(BaseHandler):
	def get(self):
		self.render_template()
class VerificadoHandler(BaseHandler):
	def post(self):
		objjson=json.loads(cgi.escape(self.request.body))
		if not objjson.has_key("p") or not objjson.has_key("ve") or not objjson.has_key("to") or not objjson.has_key("em"):
			self.resjsonerror('Error:faltan campos')
			return
		password =  objjson['p']
		email =objjson['em']
		verification_type= objjson['ve']
		token= objjson['to']
		lon=len(password)
		if lon<6 or lon>30:
			self.resjsonerror(u"Error:Contraseña tiene que tener un tamaño entre 6 y 30 caracteres")
			return
		if not verification_type =='v':
			self.resjsonerror("Error en tipo verificación")
			return  
		#u=todosmodelos.Usuarios.query(email=email,limit=1).get()
		#if not u:
		#   self.resjsonerror("Error:no existe usuario con email %s" % email)
		#   return
		u=todosmodelos.Usuarios.query(todosmodelos.Usuarios.email==email,todosmodelos.Usuarios.password==nueva_contra(password)).get()
		
		#u=self.session.get('usuario')
		if not u or not u.token==token:
			self.resjsonerror("Error:Datos no válidos")
			return
		u.valida=True
		u.token=None
		u.put()
		self.session['usuario']=u
		self.resjsonok('Usuario %s ha sido verificado.' % u.email,(u.nombre,u.tienda))  

class VerificationHandler(BaseHandler):
	def get(self, *args, **kwargs):
		user = None
		user_id = kwargs['user_id']
		signup_token = kwargs['signup_token']
		verification_type = kwargs['type']
		if verification_type not in ['v','p']:
			logging.info('Tipo de verificación no existe')
			self.abort(404)
			return
		# it should be something more concise like
		# self.auth.get_user_by_token(user_id, signup_token)
		# unfortunately the auth interface does not (yet) allow to manipulate
		# signup tokens concisely
		u =todosmodelos.Usuarios.get_by_id(int(user_id))
		if not u:
			logging.info('No puedo encontrar usuario con id %s ',user_id)
			self.abort(404)
			return

		if u.token == signup_token: 
			#self.session['usuario']=u
			if verification_type == 'v':
				self.render_template("Tu cuenta ha sido verificada",verification_type,signup_token,u.email)
			elif verification_type == 'p':
				self.render_template("Tus datos han sido verificados",verification_type,signup_token,u.email)
		else:
			logging.info('No puedo encontrar con token signup %s', signup_token)
			self.abort(404)

class ForgotPasswordHandler(BaseHandler):
	def get(self):
		self.render_template()

	def post(self):
		objjson=json.loads(cgi.escape(self.request.body))
		if not objjson.has_key("email"):
			self.resjsonerror('Error: falta email')
			return
		email = objjson["email"]
		if not mail.is_email_valid(email):
			self.resjsonerror('Error:email no valido')
			return
		u = todosmodelos.Usuarios.query(todosmodelos.Usuarios.email==email).get()
		if not u:
			self.resjsonerror('No existe ningún usuario con email %s' % email)
			return

		user_id = u.key.id()
		if u.valida and u.token:
			token=u.token
		else:
			token=nuevo_token()
			u.token=token
			u.put()

		verification_url = self.uri_for('verification', type='p', user_id=user_id,
		  signup_token=token, _full=True)

		#msg = 'Send an email to user in order to reset their password. \
		#      They will be able to do so by visiting <a href="{url}">Cambiar contraseña</a>'
		msg = u'Mensaje de Pagina web Pizza para cambiar su contraseña, pulse en el link para dirigirse a la página web y \
			  <a href="{url}">Cambiar contraseña</a>. Si usted no solicitó el cambio de contraseña por favor ignore este mensaje.'    
		mensaje = mail.EmailMessage()
		mensaje.sender = "Pizzaweb <tlloreda@hormail.com>"
		mensaje.to = "%s <%s>" % (u.nombre,email)
		mensaje.html=msg.format(url=verification_url)
		mensaje.send()
		self.resjsonok("se ha enviado un mensaje a %s con un link ( %s ) de confirmación, por favor revise su correo." % (email,verification_url))

class OlvidadaPasHandler(BaseHandler):
	def post(self):
		objjson=json.loads(cgi.escape(self.request.body))
		if not objjson.has_key("em") or not objjson.has_key("ve") or not objjson.has_key("to") or not objjson.has_key("c1") or not objjson.has_key("c2") or not objjson.has_key("nom"):
			self.resjsonerror('Error:faltan campos')
			return
		email =  objjson['em']
		nombre= objjson['nom']
		verification_type= objjson['ve']
		token= objjson['to']
		c1= objjson['c1']
		c2= objjson['c2']
		lon=len(c1)
		if lon<6 or lon>30 or not c1 == c2:
			self.resjsonerror(u"Error:Contraseñas nuevas no coinciden, tienen que tener un tamaño entre 6 y 30 caracteres")
			return
		if not verification_type =='p':
			self.resjsonerror("Error en verifiación")
			return
		u=todosmodelos.Usuarios.query(todosmodelos.Usuarios.email==email,todosmodelos.Usuarios.token==token).get()
		#u=self.session.get('usuario')
		if not u:
			self.resjsonerror("Error:Datos no válidos")
			return
		u.valida=True
		u.token=None
		u.password=nueva_contra(c1)
		u.nombre=nombre
		u.put()
		self.resjsonok(u'Contraseña actualizada.',(u.nombre,u.tienda.id()))

class LoginHandler(BaseHandler):
	def get(self):
		if self.session.get('usuario'):
			self.session.pop('usuario')
			self.session.clear()
		self.redirect("/admintienda")
		#self.render_template()

	def post(self):
		if not self.request.get('email') or not self.request.get('password'):
			self.render_template("Error faltan campos")
			return
		email = self.request.get('email')
		password = self.request.get('password')
		if not mail.is_email_valid(email):
			self.render_template('Error:email no valido')
			return
		lon=len(password)
		if lon<6 or lon>30:
			self.render_template(u"Error:Contraseña tiene que tener un tamaño entre 6 y 30 caracteres")
			return
	   
		u = todosmodelos.Usuarios.query(todosmodelos.Usuarios.email==email,todosmodelos.Usuarios.password==nueva_contra(password)).get()
		if u:
			if u.token and not u.valida:
				self.render_template(u"Este email todavía no está validado, por favor revisa tu correo.")
				return
			self.session['usuario']=u
			self.response.out.write(TEMPLATE_PRICIPAL % u.nombre)
			#self.redirect('/admintienda')
		else:
			self.render_template(u"Email o contraseña incorrecta.")

	
class LogoutHandler(BaseHandler):
	def post(self):
		
		#mimo=ndb.Key("Session", self.session_store.sessions["session"].sid).get()
		#user = self.session.get('usuario')
		#siid=self.session_store.sessions["session"].sid
		#mimo=ndb.Key("Session", siid).get()
		#if mimo:
		#	mimo.key.delete()
		#	logging.info('se ha borrado')

		#self.session['usuario']=None
		if self.session.get('usuario'):
			self.session.pop('usuario')
		#self.session_store.get_session(max_age=1)
		self.session.clear()
		#mimo=memcache.get(siid)
		#if mimo:
			#memcache.delete(siid)
			#logging.info('se ha borrado en memcache %s' % siid)
		##mimo=ndb.Key("Session", self.session_store.sessions["session"].sid).delete()
		
		#self.response.delete_cookie('session')
		#self.render_template()
		self.resjsonok("ok")
		#template = jinja_environment.get_template('home.html')
		#self.response.out.write(template.render())
		#self.redirect(self.uri_for('home'))

class SignupHandler(BaseHandler):
	def get(self):
		self.render_template()

	def post(self):
		objjson=json.loads(cgi.escape(self.request.body))
		if not objjson.has_key("email") or not objjson.has_key("nombre") or not objjson.has_key("c1") or not objjson.has_key("c2"):
			self.resjsonerror('Error:faltan campos')
			return
		email = objjson["email"].lower()
		nombre = objjson['nombre']
		password = objjson['c1'].lower()
		pw2= objjson['c2']

		if not mail.is_email_valid(email):
			self.resjsonerror('Error:email no valido')
			return
		lon=len(password)
		if lon<6 or lon>30 or not password == pw2:
			self.resjsonerror(u"Error:Contraseñas no coinciden en valor, tienen que tener un tamaño entre 6 y 30 caracteres")
			return
		lon=len(nombre)
		if lon<3 or lon>30:
			self.resjsonerror("Error:el nombre debe ser una cadena entre 3 y 30 caracteres")
			return
		existeusu=todosmodelos.Usuarios.query(todosmodelos.Usuarios.email==email).get()
		if existeusu:
			self.resjsonerror(u'email %s ya existe, <a href="javascript:recuperar()">¿olvidó su contraseña?</a>' % email)
			return
		token=nuevo_token()
		user=todosmodelos.Usuarios(email=email,password=nueva_contra(password),nombre=nombre,valida=False,token=token)
		k=user.put()
		if not k:
			self.resjsonerror('Error:no se a podido grabar, inténtelo más tarde')
			return
		verification_url = self.uri_for('verification', type='v', user_id=k.id(),signup_token=token, _full=True)
		mensaje = mail.EmailMessage()
		mensaje.sender = "Pizzaweb <tlloreda@hotmail.com>"
		mensaje.to = "%s <%s>" % (nombre,email)
		msg = 'Mensaje enviado por PizzaWeb para confirmar sus credenciales, visite la web para confirmar:\
		 <a href="{url}">Confirmar credenciales</a>. Si usted no solicitó una cuenta en PizzaWeb por favor ignore este mensaje'
		mensaje.html =msg.format(url=verification_url)
		mensaje.send()
		self.resjsonok("se ha enviado un mensaje a %s con un link ( %s ) de confirmación, por favor revise su correo." % (email,verification_url))
def handle_404(request, response, exception):
	ses_store= sessions.get_store(request=request)
	mise=ses_store.get_session(backend="memcache")
	if mise and mise.get('usuario'):
		user=mise.get('usuario').nombre
	else:
		user=""
	response.out.write(TEMPLATE_404 % (exception.status,user,exception.status,u"LO QUE BUSCAS NO ESTA AQUÍ" ))
	response.set_status(exception.status_int)
class MainReal(BaseHandler):
	def get(self):
		mise = self.session.get('usuario')
		if not mise or not mise.valida:
			self.response.out.write(HOME_TEMPLATE % ("", "","","",""))
			#self.redirect('/usuario')
		else:
			self.response.out.write(TEMPLATE_PRICIPAL % mise.nombre)
def segundos():
	hoy=datetime.datetime.now()
	masuno=hoy + datetime.timedelta(days=1)
	return (datetime.datetime(masuno.year,masuno.month,masuno.day)-hoy).total_seconds()
def list_json(ti,csrf,grabar=None,oper=None):
	
	if ti:
		tien = ti.get()
		if csrf:
			tims=[]
			kys=[]
			hrs={}
			for i in tien.keyimagen:
				kimg=i.get()
				tims.append(kimg.nombre) 
				kys.append(kimg.url)
			for i in tien.horario:
				if i.tipo==2:
					hrs[i.dia]={"tipo":2}
				elif i.tipo==1:
					hrs[i.dia]={"tipo":1,"dmd":i.diamad.strftime("%H:%M"),"dmh":i.diamah.strftime("%H:%M") ,"dtd":i.diatad.strftime("%H:%M") ,"dth":i.diatah.strftime("%H:%M")}
				else:
					hrs[i.dia]={"tipo":0,"dmd":i.diamad.strftime("%H:%M"),"dmh":i.diamah.strftime("%H:%M")}
			zrep=[]
			for i in tien.zona_reparto:
				zrep.append((i.lat,i.lon))
			try:
				paypal={
					"clientid":tien.paypal.clientid,
					"secret":tien.paypal.secret,
					"inc_des":tien.paypal.inc_des,
					"poroeur":tien.paypal.poroeur,
					"modo":tien.paypal.modo,
					"stringsuple":tien.paypal.stringsuple
				}
			except AttributeError:
				paypal=None
			try:
				pagantis={
					"clave_firma":tien.pagantis.clave_firma,
					"account_id":tien.pagantis.account_id,
					"api_key":tien.pagantis.api_key,
					"inc_des":tien.pagantis.inc_des,
					"poroeur":tien.pagantis.poroeur,
					"modo":tien.pagantis.modo,
					"stringsuple":tien.pagantis.stringsuple
				}
			except AttributeError:
				pagantis=None
			try:
				usohor=tien.usohorario
			except AttributeError:
				usohor="Europe/Madrid"
			tienj={
				"id":tien.key.id(),
				"ult_mod":tien.ult_modi,
				"act":tien.webactiva,
				"url":tien.url,
				"url_tien":tien.nombreupper,
				"usohorario":usohor,
				"nombre":tien.nombre,
				"calle":tien.calle,
				"pro":tien.provincia,
				"loca":tien.localidad,
				"cdp":tien.cdp,
				"poblas":tien.poblaciones,
				"lat":tien.posmapa.lat,
				"lon":tien.posmapa.lon,
				"dmap":tien.dirmapa,
				"zrep":zrep,
				"codpos":tien.cod_postal,
				"ems":tien.email,
				"tel":tien.telefono,
				"pag":tien.forma_pago,
				"ti_recoger":tien.tiempo_recoger,
				"ti_domicilio":tien.tiempo_domicilio,
				"prepedmindom:":tien.prepedmindom,
				"hrs":hrs,
				"kc":tien.key.urlsafe(),
				"tims":tims,
				"kims":kys,
				"paypal":paypal,
				"pagantis":pagantis
			}
	else:
		return json.dumps({"ok":"ok","tienda":False,"masas":[],"tamas":[],"matas":[],"ingres":[],"sal":[],"piz":[],"otros":[],"unotros":[],"otrosx":[],"unotrosx":[],"salsasx":[],"ingresx":[],"tamax":[],"ofer":[] },ensure_ascii=False)

	ancestor_key=todosmodelos.ndb.Key(ti.kind(),ti.id(),todosmodelos.Pizzaespe,"pizza")
	masasQry = todosmodelos.Masa.query(ancestor=ancestor_key).order(todosmodelos.Masa.nombre)
	tamasQry =  todosmodelos.Tamano.query(ancestor=ancestor_key).order(todosmodelos.Tamano.nombre)
	mataQry =  todosmodelos.MasaTama.query(ancestor=ancestor_key)
	ingQry = todosmodelos.Ingredientes.query(ancestor=ancestor_key).order(todosmodelos.Ingredientes.nombre)
	salQry =  todosmodelos.Salsas.query(ancestor=ancestor_key).order(todosmodelos.Salsas.nombre)
	pizQry=todosmodelos.Pizzaespe.query(ancestor=ancestor_key).order(todosmodelos.Pizzaespe.nombre)
	lisma=[[i.key.id(),i.nombre,i.descrip] for i in masasQry]
	listam=[[i.key.id(),i.nombre,i.num_personas] for i in tamasQry] #if i.key.parent() == ancestor_key
	lismatas=[[i.key.id(),i.masa,i.tama,i.preciobase,i.precioing] for i in mataQry]
	lising=[[i.key.id(),i.nombre,i.valor] for i in ingQry]
	lissal=[[i.key.id(),i.nombre,i.valor] for i in salQry]
	lispiz=[]
	for i in pizQry:
		if i.keyimagen:
			kimg=i.keyimagen.get()
			kys=(kimg.nombre,kimg.url)
		else:
			kys=(None,None)
		lispiz.append([i.key.id(),i.nombre,i.descrip,i.salsa,i.queso,i.ingres,i.masas,i.apartir_numing_cobrar,i.grupo,kys,i.key.urlsafe()])
	#lispiz=[[i.key.id(),i.nombre,i.descrip,i.salsa,i.queso,i.ingres,i.masas,i.apartir_numing_cobrar,i.grupo,kys,i.key.urlsafe()] for i in pizQry]

	ancestor_key= ti
	otrosQry = todosmodelos.Otros.query(ancestor=ancestor_key).order(todosmodelos.Otros.nombre)
	lisotr=[]
	jsuotr={}
	for i in otrosQry:
		id=i.key.id()
		try:
			slugurl=i.url
		except AttributeError:
			slugurl=i.nombre

		lisotr.append([id,i.nombre,i.descrip,"Listar",slugurl])
		uoQry=todosmodelos.UnOtros.query(ancestor=i.key).order(todosmodelos.UnOtros.grupo)
		auxlu=[]
		for u in uoQry:
			if u.keyimagen:
				kimg=u.keyimagen.get()
				kys=(kimg.nombre,kimg.url)
			else:
				kys=(None,None)
			auxlu.append((u.key.id(),u.nombre,u.descrip,u.precio,u.grupo,kys,u.key.urlsafe() ))
		jsuotr[str(id)]=auxlu

	otrosQryx = todosmodelos.Otrosx.query(ancestor=ancestor_key).order(todosmodelos.Otrosx.nombre)
	lisotrx=[]
	jssalx={}
	jsingx={}
	jstamx={}
	jsuotrx={}
	for i in otrosQryx:
		id=str(i.key.id())
		if len(i.nomsalsa)>0:
			haysal=i.nomsalsa
			usal=todosmodelos.Salsas.query(ancestor=i.key).order(todosmodelos.Salsas.nombre)
			jssalx[id]=[[u.key.id(),u.nombre,u.valor] for u in usal]
		else:
			haysal="No"
		#lisotrx.append([int(id),i.nombre,i.descrip,haysal,[i.tama.nombre,"precio base:",i.tama.preba,"precio ing:",i.tama.preing]])
		try:
			slugurl=i.url
		except AttributeError:
			slugurl=i.nombre
		lisotrx.append([int(id),i.nombre,i.descrip,haysal,[i.tama.nombre,i.tama.preba,i.tama.preing],"Listar",slugurl])
		uing=todosmodelos.Ingredientes.query(ancestor=i.key).order(todosmodelos.Ingredientes.nombre)
		jsingx[id]=[[u.key.id(),u.nombre,u.valor] for u in uing]
		if i.tama.nombre=='Varios':
			utam=todosmodelos.Tamax.query(ancestor=i.key).order(todosmodelos.Tamax.nombre)
			jstamx[id]=[[u.key.id(),u.nombre,u.preba,u.preing] for u in utam]
		uoQry=todosmodelos.UnOtrosx.query(ancestor=i.key).order(todosmodelos.UnOtrosx.nombre)
		auxlu=[]
		for u in uoQry:
			if u.keyimagen:
				kimg=u.keyimagen.get()
				kys=(kimg.nombre,kimg.url)
			else:
				kys=(None,None)
			auxlu.append((u.key.id(),u.nombre,u.descrip,u.salsa,u.ingres,kys,u.key.urlsafe()))
		jsuotrx[id]=auxlu

	oferQry = todosmodelos.Oferta.query(ancestor=ancestor_key).order(todosmodelos.Oferta.grupo)
	lisofr=[]
	for i in oferQry:
		uoQry=todosmodelos.ofertadetalle.query(ancestor=i.key)
		mispro=[]
		for p in uoQry:
			if p.eurosoporcen:
				eupo=0
			else:
				eupo=1
			if p.tipoproducto==0:
				pro={
					"custom": { "acc":p.numofer, "dp":eupo, "de":p.descuento},
					"artis":p.idtipo,
					"tp":0,
					"tamas":p.tama,
					"masas":p.masa,
					"ingres":{ "condiing":p.condiing,"numing":p.numing }
				}
			elif p.tipoproducto==1:
				pro={
					"custom": { "acc":p.numofer, "cantidad":p.cantidad,"dp":eupo, "de":p.descuento},
					"artis":p.idtipo,
					"tp":1,
					"idp":p.idp
				}
			else:
				pro={
					"custom": { "acc":p.numofer, "dp":eupo, "de":p.descuento},
					"artis":p.idtipo,
					"tp":2,
					"idp":p.idp,
					"ingres":{ "condiing":p.condiing,"numing":p.numing },
					"tamas":p.tama
				}
			pro["nid"]=p.key.id()
			mispro.append(pro)
		if i.keyimagen:
			kimg=i.keyimagen.get()
			kys=(kimg.nombre,kimg.url)
		else:
			kys=(None,None)
		lisofr.append([i.key.id(),i.nombre,i.descrip,i.fecdes.strftime("%d/%m/%Y"),i.fechas.strftime("%d/%m/%Y"),i.horde.strftime("%H:%M"),i.horh.strftime("%H:%M"),i.dias,i.localodomi,i.ofertaenart,i.numofer,i.preciofijo,i.descuento,i.eurosoporcen,i.increm,i.numproduc,i.key.urlsafe(),kys,i.grupo,mispro])
		if csrf:
			memnomti={"ok":"ok","csrf":csrf,"tienda":tienj,"masas":lisma,"tamas":listam,"matas":lismatas,"ingres":lising,"sal":lissal,"piz":lispiz,"otros":lisotr,"unotros":jsuotr,"otrosx":lisotrx,"unotrosx":jsuotrx,"salsasx":jssalx,"ingresx":jsingx,"tamax":jstamx,"ofer":lisofr}
		else:
			memnomti={"masas":lisma,"tamas":listam,"matas":lismatas,"ingres":lising,"sal":lissal,"piz":lispiz,"otros":lisotr,"unotros":jsuotr,"otrosx":lisotrx,"unotrosx":jsuotrx,"salsasx":jssalx,"ingresx":jsingx,"tamax":jstamx,"ofer":lisofr}
	if grabar:
		tien.ult_modi=int(time()*1000)
		if oper=="ins":
			tien.webactiva=True
		elif oper=="del":
			tien.webactiva=False
		memnomti["tienda"]["act"]= tien.webactiva
		memnomti["tienda"]["ult_mod"]=tien.ult_modi
		#nomti=tien.nombreupper
		#clake=nomti+"key"
		#memcache.set_multi({clake:ti,nomti:memnomti},time=segundos())
		dum=json.dumps(memnomti,ensure_ascii=False)
		tien.put()
		return dum
	else:
		return json.dumps(memnomti,ensure_ascii=False)
class listar(baserequest.BaseHandler):
	def get(self):
		mise = self.session.get('usuario')
		if not mise:
			self.response.out.write(HOME_TEMPLATE % ("", "","","",""))
			#self.redirect('/usuario')
		else:
			self.session['CSRFToken']=str(uuid.uuid4())
			self.response.out.write(list_json(mise.tienda,self.session['CSRFToken']))

class act_des_Web(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if  not self.objjson.has_key("cambios"):
			self.errornor("error en cambios")
			return
		try:
			cam=int(self.objjson["cambios"])
		except Exception as e:
			self.errornor("error en cambios")
			return
		ope=self.objjson["ope"]
		mise = self.session.get('usuario')
		mw="nada"
		hcam=False
		if ope=="del":
			ti=mise.tienda.get()
			if ti and ti.webactiva:
				ti.webactiva=False
				hcam=True
				#ti.put()
			mw="web desactivada "+ str(cam)
		elif ope=="ins":
			ti=mise.tienda.get()
			if ti and not ti.webactiva:
				ti.webactiva=True
				hcam=True
				#ti.put()
			mw="web Activada "+ str(cam)
		else:
			self.errornor(u"error en operación")
		if cam > 0 and ti:
			ti.ult_modi=int(time()*1000)
			hcam=True
		if hcam:
			ti.put()
			idtien=ti.key.id()
			"""lista_tiendas=memcache.get("listadetiendas")
			if lista_tiendas and lista_tiendas.has_key(ti.nombreupper):
				del lista_tiendas[ti.nombreupper]
				hoy=datetime.datetime.now()
				masuno=hoy + datetime.timedelta(days=1)
				memcache.set("listadetiendas",lista_tiendas,time=(datetime.datetime(masuno.year,masuno.month,masuno.day)-hoy).total_seconds())"""
			#"%dkey" % ti.idtien,
			memcache.delete_multi((str(idtien),"%dtienda" % idtien))
		logging.info(mw)
		self.ok(mw)

"""('/admintienda/Tiendas/grabModi', grabarModi),
class grabarModi(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if  not self.objjson.has_key("cambios"):
			self.errornor("error en datos")
			return
		cambios=self.objjson["cambios"]
		ope=self.objjson["ope"]
		resto=0
		ok="se han realizado los cambios"
		mise = self.session.get('usuario')
		if int(cambios) > 0:
			res=list_json(mise.tienda,0,grabar=True,oper=ope)
			if ope=="ins":
				from google.appengine.api import urlfetch
				url="http://127.0.0.1:8080/url?tienda=tienda"
				try:
					result = urlfetch.fetch(url=url,
					    payload=cgi.escape("empiezapor="+res),
					    method=urlfetch.POST,
					    headers={'Content-Type': 'application/json'},validate_certificate=False)
					if result.status_code == 200:
						ok="si hay respuesta"
						resto=result.content
					else:
						ok="no hay respuestaaaa"
						resto=str(result.status_code)+"="+result.content
				except Exception as e:
						ok="no hay respuesta hay error"
						resto=e.message
		elif ope=="ins":
			ti=mise.tienda.get()
			if ti and not ti.webactiva:
				ti.webactiva=True
				ti.put()
			timem=memcache.get(ti.nombreupper)
			if timem and not timem["tienda"]["act"]:
				timem["tienda"]["act"]=True
				memcache.set(ti.nombreupper,timem,time=segundos())
		elif ope=="del":
			ti=mise.tienda.get()
			if ti and ti.webactiva:
				ti.webactiva=False
				ti.put()
			timem=memcache.get(ti.nombreupper)
			if timem and timem["tienda"]["act"]:
				timem["tienda"]["act"]=False
				memcache.set(ti.nombreupper,timem,time=segundos())
		self.ok(ok,k=resto)"""

FRAMEERROR_TEMPLATE=u"""<!DOCTYPE html> 
<html lang="es">
<head>
	<meta charset="UTF-8">
<style>
body {
	margin:0;
	padding:0;
	border:0;
}
</style>
</head>
<body>
<p>%s</p>
</body></html>"""
FRAME_TEMPLATE=u"""<!DOCTYPE html> 
<html lang="es">
<head>
	<meta charset="UTF-8">
<style>
body {
	margin:0;
	padding:0;
	border:0;
}
</style>
<script>
var res=%s;
window.onload=function(){ 
var arc=document.getElementById("fjson");
arc.onchange=function() {
	parent.controladorTienda.json_extension(arc,document.getElementById("miform"));
}
if (res!=='no') { parent.controladorTienda.respuestajson(res); }
}
</script>
</head>
<body>
<form id='miform' method="post" enctype="multipart/form-data">
<input type=file id="fjson" name="fjson">
</form></body></html>"""
class FrameJson(baserequest.BaseHandler):
	def get(self):
		mise = self.session.get('usuario')
		if not mise or not mise.valida:
			self.response.out.write(FRAMEERROR_TEMPLATE % u"No hay sesión")
			return
		if not mise.tienda:
			self.response.out.write(FRAMEERROR_TEMPLATE % "No hay tienda")
			return
		self.response.out.write(FRAME_TEMPLATE % "'no'")
class bajarJson(baserequest.BaseHandler):
	def get(self):
		mise = self.session.get('usuario')
		if not mise or not mise.valida:
			return
		mijson=list_json(mise.tienda,False)
		self.response.headers['Content-Type'] = 'text/json'
   		self.response.headers['Content-Disposition'] = 'attachment; filename=report.json'
   		self.response.out.write(mijson)

app = webapp2.WSGIApplication([
	webapp2.Route('/usuario', MainHandler, name='home'),
	webapp2.Route('/usuario/signup', SignupHandler),
	webapp2.Route('/usuario/<type:v|p>/<user_id:\d+>-<signup_token:.+>',
	  handler=VerificationHandler, name='verification'),
	webapp2.Route('/usuario/login', LoginHandler, name='login'),
	webapp2.Route('/usuario/logout', LogoutHandler, name='logout'),
	webapp2.Route('/usuario/forgot', ForgotPasswordHandler, name='forgot'),
	webapp2.Route('/usuario/authenticated', VerificadoHandler, name='verificado'),
	webapp2.Route('/usuario/olvpasswre',OlvidadaPasHandler, name='olvpaswcambiar'),
	('/admintienda', MainReal),
	('/admintienda/listado', listar),
	('/admintienda/Pizzas/verTodas', Piz.verTodas),
	('/admintienda/Pizzas/Masas', Piz.clMasas),
	('/admintienda/Pizzas/Tamas', Piz.clTamas),
	('/admintienda/Pizzas/Matas', Piz.clMatas),
	('/admintienda/Pizzas/Ingres', Piz.clIngSal),
	('/admintienda/Pizzas/Salsas', Piz.clIngSal),
	('/admintienda/Pizzas/espe', Piz.clPizzes),
	('/admintienda/Otros/otro', Otr.clOtros),
	('/admintienda/Otros/verTodas', Otr.verTodos),
	('/admintienda/Otros/unotro', Otr.clunotro),
	('/admintienda/Otrosx/otrox', OtrX.clOtros),
	('/admintienda/Otrosx/verTodas', OtrX.verTodos),
	('/admintienda/Otrosx/unotrox', OtrX.clunotro),
	('/admintienda/Otrosx/ingsal',OtrX.clIngSal),
	('/admintienda/Otrosx/tamas',OtrX.clTamas),
	('/admintienda/Ofertas', Ofer.verTodos),
	('/admintienda/Ofertas/oferta', Ofer.clOferta),
	('/admintienda/Tiendas', Tie.verTienda),
	('/admintienda/Tiendas/tienda', Tie.clTienda),
	('/admintienda/Tiendas/Web',act_des_Web),
	('/admintienda/Tiendas/pagpaypal', Tie.clpagPaypal),
	('/admintienda/Tiendas/pagpagantis', Tie.clpagPagantis),
	('/admintienda/Tiendas/framejson',FrameJson),
	('/admintienda/Tiendas/bajarjson.json',bajarJson),
	('/admintienda/Imgs/nueva', Img.CargarImagen),
	('/admintienda/Imgs/eliminarImagen', Img.eliminarImagen),
	('/admintienda/Imgs/listimagenes', Img.listar_imagenes),
	('/admintienda/Imgs/imglista', Img.imgSelLista),
	('/admintienda/Imgs/frameimg',Img.FrameImagen),
	('/admintienda/Imgs/urlimgurl', Img.CargarUrlImagen),
	('/admintienda/tiendasAcopiar',Copiar.tiendasAcopiar),
	('/admintienda/CopiarTienda',Copiar.copiarTodo)
],debug=True, config=baserequest.config)
app.error_handlers[404] = handle_404
logging.getLogger().setLevel(logging.DEBUG)