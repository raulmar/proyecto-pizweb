#!/usr/bin/python
# -*- coding: utf-8 -*-

from google.appengine.api import mail

import logging
import webapp2
import json
import cgi
import string
import random
import hashlib
from google.appengine.api import memcache
from webapp2_extras import sessions
from modelos import todosmodelos
#https://code.google.com/r/joernhees-webapp2/source/browse/webapp2_extras/sessions.py?spec=svn75e09133c0496132e98fe83441e0defd27364022&r=75e09133c0496132e98fe83441e0defd27364022
config = {
  'webapp2_extras.sessions': {
	'secret_key': 'YOUR_SECRET_KEY'
  }
}
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
  <link rel="shortcut icon" type="image/x-icon"  href="favicon.ico" />
  <link rel="stylesheet"  href="normalize.css"/>
  <link rel="stylesheet"  href="main2.css"/>
<script src="hUtils.js"></script>
</head>
<body>
<div class="cabecera">
    <div  class="logo"> <img src="logo2.png"/></div>
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
<script>window.onload=function() { inicio("%s"); }</script>
</body>
</html>"""
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
			if (self.session.get('usuario')):
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
		self.render_template()

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
			self.redirect('/admintienda')
		else:
			self.render_template(u"Email o contraseña incorrecta.")

	
class LogoutHandler(BaseHandler):
	def get(self):
		
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
		self.session_store.get_session(max_age=1)
		self.session.clear()
		#mimo=memcache.get(siid)
		#if mimo:
			#memcache.delete(siid)
			#logging.info('se ha borrado en memcache %s' % siid)
		##mimo=ndb.Key("Session", self.session_store.sessions["session"].sid).delete()
		
		#self.response.delete_cookie('session')
		self.render_template()
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
		email = objjson["email"]
		nombre = objjson['nombre']
		password = objjson['c1']
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

app = webapp2.WSGIApplication([
	webapp2.Route('/usuario', MainHandler, name='home'),
	webapp2.Route('/usuario/signup', SignupHandler),
	webapp2.Route('/usuario/<type:v|p>/<user_id:\d+>-<signup_token:.+>',
	  handler=VerificationHandler, name='verification'),
	webapp2.Route('/usuario/login', LoginHandler, name='login'),
	webapp2.Route('/usuario/logout', LogoutHandler, name='logout'),
	webapp2.Route('/usuario/forgot', ForgotPasswordHandler, name='forgot'),
	webapp2.Route('/usuario/authenticated', VerificadoHandler, name='verificado'),
	webapp2.Route('/usuario/olvpasswre',OlvidadaPasHandler, name='olvpaswcambiar')
], debug=True, config=config)
app.error_handlers[404] = handle_404
logging.getLogger().setLevel(logging.DEBUG)