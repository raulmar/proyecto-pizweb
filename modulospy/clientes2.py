#!/usr/bin/python
# -*- coding: utf-8 -*-
import webapp2
from google.appengine.api import mail
import logging
import json
import cgi
from google.appengine.api import memcache
from modelos import todosmodelos
from modulospy import utils

class SignupHandler(utils.respuesta):
	def post(self, *args, **kwargs):
		objjson=json.loads(cgi.escape(self.request.body))
		if not objjson.has_key("em") or not objjson.has_key("c1") or not objjson.has_key("c2"):
			self.resjsonerror('Error:faltan campos')
			return
		email = objjson["em"]
		password = objjson['c1']
		pw2= objjson['c2']

		if not mail.is_email_valid(email):
			self.resjsonerror('Error:email no valido')
			return
		lon=len(password)
		if lon<6 or lon>30 or not password == pw2:
			self.resjsonerror(u"Error:Contraseñas no coinciden en valor, tienen que tener un tamaño entre 6 y 30 caracteres")
			return
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			self.resjsonerror('No hay tienda en url')
			return
		ti=memcache.get(nomtien.upper()+"key")
		if not ti:
			ti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtien.upper()).get()
			if not ti:
				self.resjsonerror('No existe tienda %s' % nomtien)
				return
			ti=ti.key

		
		existeusu=todosmodelos.Clientes.query(todosmodelos.Clientes.email==email,todosmodelos.Clientes.idsocial=="bd",ancestor=ti).get()
		if existeusu:
			#u'email %s ya existe, <a href="javascript:verolvi()">¿olvidó su contraseña?</a>' %
			self.resjsonok("_olvido_", email)
			return
		token=utils.nuevo_token()
		user=todosmodelos.Clientes(parent=ti,email=email,password=utils.nueva_contra(password),idsocial="bd",validada=False,token=token)
		k=user.put()
		if not k:
			self.resjsonerror('Error:no se a podido grabar, inténtelo más tarde')
			return
		verification_url = self.uri_for('verification', nom_tien=nomtien, type='v', user_id=k.id(),signup_token=token, _full=True)
		mensaje = mail.EmailMessage()
		mensaje.sender = "Tienda %s <tlloreda@hotmail.com>" % nomtien
		mensaje.to = "<%s>" % email
		msg = 'Mensaje enviado por tienda {tien} para confirmar sus credenciales, visite la web para confirmar:\
		 <a href="{url}">Confirmar credenciales</a>. Si usted no solicitó una cuenta en la tienda {tien} por favor ignore este mensaje'
		mensaje.html =msg.format(tien=nomtien, url=verification_url)
		mensaje.send()
		self.resjsonok("se ha enviado un mensaje a %s con un link ( %s ) de confirmación, por favor revise su correo." % (email,verification_url))

class LoginHandler(utils.BaseHandler):
	def post(self, *args, **kwargs):
		objjson=json.loads(cgi.escape(self.request.body))
		if not objjson.has_key("em") or not objjson.has_key("con"):
			self.resjsonerror('Error:faltan campos')
			return
		email = objjson["em"]
		password = objjson['con']
		if not mail.is_email_valid(email):
			self.resjsonerror('Error:email no valido')
			return
		lon=len(password)
		if lon<6 or lon>30:
			self.resjsonerror(u'Error:Contraseña tiene que tener un tamaño entre 6 y 30 caracteres')
			return
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			self.resjsonerror('No hay tienda en url')
			return
		ti = memcache.get(nomtien.upper()+"key")
		if not ti:
			ti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtien.upper()).get()
			if not ti:
				self.resjsonerror('No existe tienda %s' % nomtien)
				return
			ti=ti.key
		
		u = todosmodelos.Clientes.query(todosmodelos.Clientes.email==email,todosmodelos.Clientes.password==utils.nueva_contra(password),todosmodelos.Clientes.idsocial=="bd",ancestor=ti).get()
		if u:
			if u.token and not u.validada:
				self.resjsonerror(u'Este email todavía no está validado, por favor revise su correo.')
				return
			self.session['cliente']={'tipo':"bd","usu":u,"tienda":ti}
			self.resjsonok("Login as %s" % email)
		else:
			self.resjsonerror(u'Email o contraseña incorrecta.')

class ForgotPasswordHandler(utils.respuesta):
	def post(self, *args, **kwargs):
		objjson=json.loads(cgi.escape(self.request.body))
		if not objjson.has_key("email"):
			self.resjsonerror('Error: falta email')
			return
		email = objjson["email"]
		if not mail.is_email_valid(email):
			self.resjsonerror('Error:email no valido')
			return
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			self.resjsonerror('No hay tienda en url')
			return
		ti = memcache.get(nomtien.upper()+"key")
		if not ti:
			ti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtien.upper()).get()
			if not ti:
				self.resjsonerror('No existe tienda %s' % nomtien)
				return
			ti=ti.key

		u = todosmodelos.Clientes.query(todosmodelos.Clientes.email==email,ancestor=ti).get()
		if not u:
			self.resjsonerror('No existe ningún usuario con email %s en tienda ' % (email,nomtien))
			return

		user_id = u.key.id()
		if u.validada and u.token:
			token=u.token
		else:
			token=utils.nuevo_token()
			u.token=token
			u.put()

		verification_url = self.uri_for('verification', nom_tien=nomtien, type='p', user_id=user_id,
		  signup_token=token, _full=True)

		#msg = 'Send an email to user in order to reset their password. \
		#      They will be able to do so by visiting <a href="{url}">Cambiar contraseña</a>'
		msg = u'Mensaje de Pagina web tienda {tien} para cambiar su contraseña, pulse en el link para dirigirse a la página web y \
			  <a href="{url}">Cambiar contraseña</a>. Si usted no solicitó el cambio de contraseña por favor ignore este mensaje.'    
		mensaje = mail.EmailMessage()
		mensaje.sender = "Pizzaweb <tlloreda@hormail.com>"
		mensaje.to = "%s <%s>" % email
		mensaje.html=msg.format(tien=nomtien, url=verification_url)
		mensaje.send()
		self.resjsonok("se ha enviado un mensaje a %s con un link ( %s ) de confirmación, por favor revise su correo." % (email,verification_url))

class VerificationHandler(utils.BaseHandler):
	def get(self, *args, **kwargs):
		user = None
		user_id = kwargs['user_id']
		signup_token = kwargs['signup_token']
		verification_type = kwargs['type']
		if verification_type not in ['v','p']:
			logging.info('Tipo de verificación no existe')
			self.abort(404)
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			utils.handle_404(self.request, self.response, {"status_int":404,"status":"No hay tienda en url"})
			return
		ti = memcache.get(nomtien.upper()+"key")
		tienti=None
		if not ti:
			tienti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtien.upper()).get()
			if not ti:
				utils.handle_404(self.request, self.response, {"status_int":404,"status":"No existe tienda %s" % nomtien})
				return
			ti=tienti.key
		# it should be something more concise like
		# self.auth.get_user_by_token(user_id, signup_token)
		# unfortunately the auth interface does not (yet) allow to manipulate
		# signup tokens concisely
		u =todosmodelos.Clientes.get_by_id(int(user_id),parent=ti)
		if not u:
			logging.info('No puedo encontrar usuario con id %s ',user_id)
			utils.handle_404(self.request, self.response, {"status_int":404,"status":"No puedo encontrar usuario"})
			return

		if u.token == signup_token:
			self.session['cliente']={'tipo':"bd","usu":u,"tienda":ti}
			u.validada=True
			u.token=None
			u.put()
			self.enviarCliente({"id":u.key.id(),"tipo":"bd","usu":u},ti,tienti);
			self.redirect('/tienda/%s' % nomtien)
			#self.response.out.write("Tus datos han sido verificados")
		else:
			logging.info('No puedo encontrar con token signup %s y tienda %s',(signup_token,nomtien))
			utils.handle_404(self.request, self.response, {"status_int":404,"status":"no puedo encontrar token en url,tienda"})

class LogoutHandler(utils.BaseHandler):
	def get(self, *args, **kwargs):
		#nomtien = kwargs['nom_tien']
		#mires="no ha borrado"
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			utils.handle_404(self.request, self.response, {"status_int":404,"status":"No hay tienda en url"})
			return
		self.session.clear()
		if self.session.get('cliente'):
			#self.session['cliente']=None
			self.session.pop('cliente')
		if self.session.get("fb-usuario"):
			self.session.pop('fb-usuario')
		if self.session.get("tw-oauth_token_pru"):
			self.session.pop("tw-oauth_token_pru")
		if self.session.get("tw-usuario"):
			self.session.pop("tw-usuario")
		if self.session.get("pedido"):
			self.session.pop("pedido")
		if self.session.get("ec_token"):
			self.session.pop("ec_token")
		if self.session.get("tok_pag"):
			self.session.pop("tok_pag")
			self.session.pop("order_id")

			#del self.session['cliente']
			#mires="si ha borrado"
		#self.session_store.get_session(max_age=1)
		
		#self.session_store.save_sessions(self.response)
		self.redirect('/tienda/%s' % nomtien)
		#self.resjsonok("se ha realizado logout")

#logging.getLogger().setLevel(logging.DEBUG)