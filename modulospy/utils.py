#!/usr/bin/python
# -*- coding: utf-8 -*-
import webapp2
import string
import random
import hashlib
import json
import datetime
from time import time
from webapp2_extras import sessions
from google.appengine.api import memcache
from google.appengine.api import urlfetch
from modelos import todosmodelos
import jinja2
import os
import re

def slug(ca):
	slu=re.sub(r'[\?\+_&\s=/%]',"-",ca)
	slu=re.sub(r'[ñÑ]','n',slu.lower())
	slu=re.sub(r'[çÇ]','c',slu)
	slu=re.sub(r'[áàÁÁ]','a',slu)
	slu=re.sub(r'[éèÉÈ]','e',slu)
	slu=re.sub(r'[íìÍÌ]','i',slu)
	slu=re.sub(r'[óòÓÒ]','o',slu)
	return re.sub(r'[úùÚÙ]','u',slu)

#en vez de __file__ utilizamos directamente C:\Users\Viri\Proyectos Gae\Proyectos GAE Python3\tienda_usuario
jinja_environment = jinja2.Environment(
    loader=jinja2.FileSystemLoader(os.path.normpath("C:\Users\Viri\Proyectos Gae\Proyectos GAE Python3\\proyecto-pizweb")),extensions=['jinja2.ext.loopcontrols'],trim_blocks=True)
"""jinja_environment.filters.update({
        'slug': slug
        })"""
#jinja_environment.filters['slug'] = slug

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
<img src="%s.png"/>
</div>
</body>
</html>"""
config = {
  'webapp2_extras.sessions': {
	'secret_key': 'YOUR_SECRET_KEY'
  }
}

def nuevo_token():
	chars=string.ascii_letters + string.digits
	tok= ''.join(random.choice(chars) for x in range(32))
	return tok

def nueva_contra(t):
	return hashlib.sha224(t).hexdigest()

def handle_404(request, response, exception):
	img="404"
	msg=u"LO QUE BUSCAS NO ESTA AQUÍ"
	if not "status" in exception:
		response.out.write(TEMPLATE_404 % (exception.status,"",exception.status,msg,img ))
		response.set_status(exception.status_int)
	else:
		if exception["status_int"] == 503:
			img="503"
			msg=u"LO SENTIMOS EN ESTOS MOMENTOS ESTAMOS EN MANTENIMIENTO"
		response.out.write(TEMPLATE_404 % (exception["status"],"",exception["status"],msg,img ))
		response.set_status(exception["status_int"])


class respuesta(webapp2.RequestHandler):
	def render_tpltsin(self,tplt,va):
		self.response.out.write(jinja_environment.get_template(tplt).render(va))

	def resjsonerror(self,s):
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps({"error":s},ensure_ascii=False))

	def resjsonok(self,s,resto = 0):
		self.response.headers['Content-Type'] = 'application/json'
		self.response.out.write(json.dumps({"ok":s,"resto":resto},ensure_ascii=False))

#from webapp2_extras import sessions_ndb
#http://webapp-improved.appspot.com/api/webapp2_extras/appengine/sessions_ndb.html
#https://code.google.com/p/webapp-improved/source/browse/webapp2_extras/sessions.py
#https://code.google.com/p/webapp-improved/source/browse/webapp2_extras/appengine/sessions_ndb.py
#https://code.google.com/p/webapp-improved/issues/detail?id=27
#https://plus.google.com/u/0/110207997506115788259/posts/EvTyDUqi85J
#https://github.com/dound/gae-sessions/blob/master/gaesessions/__init__.py
"""class BaseHandlerndbSesssion(respuesta):
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
		return self.session_store.get_session(
    name='db_session', factory=sessions_ndb.DatastoreSessionFactory)"""

class BaseHandler(respuesta):
	
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
		"""Shortcut to access the current session. datastore"""
		return self.session_store.get_session(backend="memcache")

	def render_tplt(self,tplt,va):
		haycli=False
		sescli=self.session.get('cliente')
		cliemail="<span class='icon-user'></span> anonimo"
		if sescli:
			if not sescli["tipo"]=="bd" and "nombre" in sescli:
				cliemail="<img src='%s' width='25' height='25'/> %s <a href='/tienda/%s/logout' > LOGOUT</a>" % (sescli.get("avatar"),sescli.get("nombre"),self.res["tienda"]["nombre"])
				self.response.cache_control = 'no-cache'
				self.response.headers['Cache-Control'] = 'no-cache'
				self.response.headers['Pragma']='no-cache'
				self.response.headers['expires']='-1'
				haycli=True
			elif sescli["tipo"]=="bd" and sescli["tienda"] == self.restikey:
				cliemail="<span class='icon-user'></span> %s <a href='/tienda/%s/logout' > LOGOUT</a>"  % (sescli["usu"].email, self.res["tienda"]["nombre"])
				self.response.cache_control = 'no-cache'
				self.response.headers['Cache-Control'] = 'no-cache'
				self.response.headers['Pragma']='no-cache'
				self.response.headers['expires']='-1'
				haycli=True
			else:
				self.session.clear()
			# " <a href='/tienda/"+nomtien+"/logout' >LOGOUT</a>"
			
			
		nomima="logo2.png"
		noms=self.res["tienda"]["tims"]
		n=0
		for i in noms:
			if i.find("logo") > -1:
				nomima=self.res["tienda"]["kims"][n]
				break
			else:
				n+=1
		va.update({
			'nomima':nomima,
            'cliemail':cliemail,
            'haycli':haycli,
            'nomtien':self.res["tienda"]["nombre"],
            'urltien':self.res["tienda"]["url_tien"],
            'res': self.res,
            'lugar': "%s %s (Spain)" % (self.res["tienda"]["loca"], self.res["tienda"]["pro"] ) 
            })
		self.response.out.write(jinja_environment.get_template(tplt).render(va))

	def helloTienda(self):
		url="http://"+self.res["tienda"]["url"]+":8080/hello"
		try:
			result = urlfetch.fetch(url=url,validate_certificate=False)
		except Exception as e:
			return (False,e.message)
		if result.status_code == 200 and result.content=="Hello World con express":
			return (True,True)
		else:
			return (False,u"no hay conexión con tienda, status code=%d" % result.status.code)

	def enviarCliente(self,clien,tikey,tiendat):
		if not tiendat:
			tiendat=tikey.get()
		if tiendat["url"]:
			url="http://"+tiendat["url"]+":8080/clienteadd"
			#clien={'id':u.key.id(),'usu':u.to_dict(),'tipo':tipo}
			#clien=u.to_dict()
			#clien["idcliente"]=u.key.id()
			rpc = urlfetch.create_rpc()
			urlfetch.make_fetch_call(rpc,url=url,
				    payload=json.dumps(clien),
				    method=urlfetch.POST,
				    headers={'Content-Type': 'application/json'},validate_certificate=False)

	@todosmodelos.ndb.toplevel
	def env_pago_grab_pedido(self,pago,tikey,regpago=None):
		if self.res["tienda"]["url"]:
			url="http://"+self.res["tienda"]["url"]+":8080/pedido"
			pedido=self.session.get("pedido")    #={"detallemio":detp,"datped":datped,"detalleapi":resul[2] }
			datped=pedido["datped"]
			if regpago:
				suple=regpago.suplemento
				datped["regpago"]={"idtrans":regpago.key.id(), "id_payment":regpago.id_payment, "suplemento":regpago.suplemento,"estado":regpago.estado,"response_executed":regpago.response_executed}
				regpago=regpago.key
			else:
				suple=0
				datped["regpago"]=None
			datped["pago"]=pago
			if datped["pedidoen"]>1:
				tincre=self.res["tienda"]["ti_domicilio"]*60*1000
			else:
				tincre=self.res["tienda"]["ti_recoger"]*60*1000
			ahora=int(time())*1000
			if datped["horaent"] < ( ahora+tincre ):	
				datped["horaent"]=datped["horaent"]+ahora-datped["horaped"]
			datped["horaped"]=ahora
			kcli=None
			clire=self.session.get('cliente')
			grabcli=False
			if clire:
				if not clire["tienda"] == tikey:
					#if clire["tipo"]=="bd":
						#user=todosmodelos.Clientes(parent=self.reslisjson[1],email=clire["usu"].email,password=clire.password,validada=True,numpedidos=1,ultimopedido=self.objjson["horaped"])
						#kcli=user.put()
					#else:
					if not clire["tipo"] == "bd":
						user = todosmodelos.Clientes.query(todosmodelos.Clientes.idsocial==clire["usu"].idsocial,ancestor=tikey).get()

						if not user:
							user=todosmodelos.Clientes(parent=tikey,email=clire['usu'].email,idsocial=clire["usu"].idsocial,validada=True,numpedidos=1,ultimopedido=datped["horaped"])
							kcli=user.put()
							usudic={"ultimopedido":datped["horaped"],"idsocial":clire["usu"].idsocial,"numpedidos":1,'email':clire['usu'].email}
							pedido["cliente"] ={'id':kcli.id(),'nuevo':True,'usu':usudic,'tipo':clire["tipo"],'avatar':clire["avatar"],'nombre':clire["nombre"]}
						else:
							grabcli=True
							kcli=user.key
							usudic={"ultimopedido":user.ultimopedido,"idsocial":user.idsocial,"numpedidos":user.numpedidos,'email':user.email }
							pedido["cliente"] ={'id':kcli.id(),'usu':usudic,'tipo':clire["tipo"],'avatar':clire["avatar"],'nombre':clire["nombre"]}
				else:
					grabcli=True
					user=clire["usu"]
					kcli=user.key
					usudic={"ultimopedido":user.ultimopedido,"idsocial":user.idsocial,"numpedidos":user.numpedidos,'email':user.email }
					if not clire["tipo"] == "bd":
						pedido["cliente"] ={'id':kcli.id(),'usu':usudic,'tipo':clire["tipo"],'avatar':clire["avatar"],'nombre':clire["nombre"]}
					else:
						pedido["cliente"] ={'id':kcli.id(),'usu':usudic,'tipo':"bd"}
			try:
				result = urlfetch.fetch(url=url,
				    payload=json.dumps(pedido),
				    method=urlfetch.POST,
				    headers={'Content-Type': 'application/json'},validate_certificate=False)
			except Exception as e:
				return (False,"error en servidor, exception %s " % e.message)
			if result.status_code == 200:

				resto=json.loads(result.content)
				numped=resto["numped"]
				#return (False,"fallo mio y numped=%d" % numped)
				detalle=json.loads(pedido["detallemio"])
				lisdet=[]
				if datped["pedidoen"]>1:
					canom=todosmodelos.CalleNom(nom=datped["callenom"]["nom"],via=datped["callenom"]["via"],num=datped["callenom"]["num"],bloq=datped["callenom"]["bloq"],piso=datped["callenom"]["piso"],esca=datped["callenom"]["esca"],letra=datped["callenom"]["letra"],muni=datped["callenom"]["muni"],codpos=datped["callenom"]["codpos"])
				else:
					canom=None
				ped=todosmodelos.Pedido(parent=tikey,pedidoen=datped["pedidoen"],cliente=kcli,numped=numped,telefono=datped["telefono"],callenom=canom,importe=datped["importe"],horapedido=datped["horaped"],horaent=datped["horaent"],comen=datped["comen"],suplemento=suple,pago=datped["pago"],regpago=regpago,detalleapi=self.session["pedido"]["detalleapi"])
				okped=ped.put()
				for d in detalle:
					tipoart=d["articulo"]
					aidp=aids=None
					canti=d["det"]["canti"]
					if tipoart < 1:
						mi=d["det"]["mitades"]
						aidp=mi[0]["espe"]
						if len(mi)>1:
							aids=mi[1]["espe"]
					elif tipoart < 2:
						aidp=d["det"]["idotr"]
						aids=d["det"]["unotr"]
					else:
						aidp=d["det"]["idotrx"]
						aids=d["det"]["unotrx"]

					if d["oferta"]:
						lisdet.append(todosmodelos.Detalle(parent=okped,tipoart=tipoart,articuloidprin=aidp,articuloidsec=aids,cantidad=canti, det=d["det"],ofertaid=d["oferta"]["idofer"],numofer=d["oferta"]["numofer"],ofertadet=d["oferta"],preart=d["oferta"]["precio"]))
					else:
						lisdet.append(todosmodelos.Detalle(parent=okped,tipoart=tipoart,articuloidprin=aidp,articuloidsec=aids,cantidad=canti, det=d["det"],preart=d["preart"]))
				todosmodelos.ndb.put_multi_async(lisdet)
				if kcli and grabcli:
					nped=user.numpedidos+1
					user.populate(ultimopedido=datped["horaped"],numpedidos=nped)
					user.put_async()
				return (True,okped)
			else:
				return (False,u"no hay conexión con tienda status code=%d" % result.status_code)
		else:
			return (False,u"no hay url para conexión con tienda")

def tienda_required(handler):
	"""
	Decorator that checks if there's a tienda associated with el parametro <mon_tien>.
	Will also fail if there's no session present.
	"""
	def check_tienda(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			handle_404(self.request, self.response, {"status_int":404,"status":"No hay tienda en url"})
			return
		ljson=list_json(nomtien)
		self.res=ljson[0]
		if not self.res:
			handle_404(self.request, self.response, {"status_int":404,"status":"No existe tienda %s" % nomtien})
			return
		if not self.res["tienda"]["act"]:
			handle_404(self.request, self.response, {"status_int":503,"status":u"En estos momentos la página está en mantenimiento. Prueba mas tarde. "})
			return
		self.restikey=ljson[1]
		return handler(self, *args, **kwargs)
	return check_tienda

class GMT(datetime.tzinfo):
	def dst(self, dt):
		# DST starts last Sunday in March
		d = datetime.datetime(dt.year, 4, 1)   # ends last Sunday in October
		self.dston = d - datetime.timedelta(days=d.weekday() + 1)
		d = datetime.datetime(dt.year, 11, 1)
		self.dstoff = d - datetime.timedelta(days=d.weekday() + 1)
		if self.dston <=  dt.replace(tzinfo=None) < self.dstoff:
			return datetime.timedelta(hours=1)
		else:
			return datetime.timedelta(0)

#hora en milisegundos utc
def TimestampMillisec64():
	return int((datetime.datetime.utcnow() - datetime.datetime(1970, 1, 1)).total_seconds() * 1000)

#Europe/Madrid
class GMT1(GMT):
	def utcoffset(self, dt):
		return datetime.timedelta(hours=1) + self.dst(dt)
	def tzname(self,dt):
		return "GMT +1"
#Atlantic/Canary
class GMT0(GMT):
	def utcoffset(self, dt):
		return datetime.timedelta(0) + self.dst(dt)
	def tzname(self,dt):
		return "GMT +0"

"""class GMT1(datetime.tzinfo):
	def utcoffset(self, dt):
		return datetime.timedelta(hours=1) + self.dst(dt)
	def dst(self, dt):
		# DST starts last Sunday in March
		d = datetime.datetime(dt.year, 4, 1)   # ends last Sunday in October
		self.dston = d - datetime.timedelta(days=d.weekday() + 1)
		d = datetime.datetime(dt.year, 11, 1)
		self.dstoff = d - datetime.timedelta(days=d.weekday() + 1)
		if self.dston <=  dt.replace(tzinfo=None) < self.dstoff:
			return datetime.timedelta(hours=1)
		else:
			return datetime.timedelta(0)
	def tzname(self,dt):
		return "GMT +1"""
USOHORARIO={
	"Europe/Madrid":GMT1,
	"Atlantic/Canary-Europe/London-Europe/Lisboa":GMT0
}
def txt_horario(h,esh=False):
	if h["tipo"]>1:
		return "Cerrado"
	elif h["tipo"]>0:
		if esh:
			return h["dmd"]+" - "+h["dmh"]+"<br/>"+h["dtd"]+" - "+h["dth"]
		else:
			return h["dmd"]+" - "+h["dmh"]+" "+h["dtd"]+" - "+h["dth"]
	else:
		return h["dmd"]+" - "+h["dmh"]
def fhorario(res):
	diasse=("LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO","FESTIVOS")
	diasseeng=( "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su","Holiday")
	mitz=USOHORARIO[res["tienda"]["usohorario"]]()
	ahora=datetime.datetime.fromtimestamp(time(),mitz) 
	#datetime.datetime.utcnow()
	#datetime.datetime.now()
	diahoy=str(ahora.day)+"/"+str(ahora.month)+"/"+str(ahora.year)
	
	if not res["tienda"]["hrs"].has_key(diahoy):
		diahoy=diasse[ahora.weekday()]
		if res["tienda"]["hrs"].has_key(diahoy):
			horhoy=txt_horario(res["tienda"]["hrs"][diahoy],True)
		else:
			horhoy=None
	else:
		horhoy=txt_horario(res["tienda"]["hrs"][diahoy],True)
		
	hdias=[]
	n=0
	for h in diasse: # res["tienda"]["hrs"].keys():
		hdias.append({"nom":h,"nomeng":diasseeng[n],"hor":txt_horario(res["tienda"]["hrs"][h])})
		n+=1
	hresto=[]
	for h in res["tienda"]["hrs"].keys():
		try:
			diasse.index(h)
		except Exception as e:
			dpar=h.split("/")
			hresto.append({"nom":h,"nomeng":dpar[2]+"/"+dpar[1]+"/"+dpar[0],"hor":txt_horario(res["tienda"]["hrs"][h])})
	return { "fechahoy":horhoy,
            "diahoy":diahoy,
            "hdias":hdias,
            "hresto":hresto}

def getSegundos():
	hoy=datetime.datetime.now()
	masuno=hoy + datetime.timedelta(days=1)
	return (datetime.datetime(masuno.year,masuno.month,masuno.day)-hoy).total_seconds()

def getTienda(ti,segundos=None,hurl=None):

		tims=[]
		kys=[]
		hrs={}
		for i in ti.keyimagen:
			kimg=i.get()
			tims.append(kimg.nombre) 
			kys.append(kimg.url)
		for i in ti.horario:
			if i.tipo==2:
				hrs[i.dia]={"tipo":2}
			elif i.tipo==1:
				hrs[i.dia]={"tipo":1,"dmd":i.diamad.strftime("%H:%M"),"dmh":i.diamah.strftime("%H:%M") ,"dtd":i.diatad.strftime("%H:%M") ,"dth":i.diatah.strftime("%H:%M")}
			else:
				hrs[i.dia]={"tipo":0,"dmd":i.diamad.strftime("%H:%M"),"dmh":i.diamah.strftime("%H:%M")}
		zrep=[]
		for i in ti.zona_reparto:
			zrep.append((i.lat,i.lon))
		try:
			paypal={
				"clientid":ti.paypal.clientid,
				"secret":ti.paypal.secret,
				"inc_des":ti.paypal.inc_des,
				"poroeur":ti.paypal.poroeur,
				"modo":ti.paypal.modo,
				"stringsuple":ti.paypal.stringsuple,
				"access_token":ti.paypal.access_token,
				"expires_in":ti.paypal.expires_in,
				"vino_token":ti.paypal.vino_token
			}
		except AttributeError:
			paypal=None
		try:
			pagantis={
				"clave_firma":ti.pagantis.clave_firma,
				"account_id":ti.pagantis.account_id,
				"api_key":ti.pagantis.api_key,
				"inc_des":ti.pagantis.inc_des,
				"poroeur":ti.pagantis.poroeur,
				"modo":ti.pagantis.modo,
				"stringsuple":ti.pagantis.stringsuple
			}
		except AttributeError:
			pagantis=None
		try:
			usohor=ti.usohorario
		except AttributeError:
			usohor="Europe/Madrid"
		if hurl and not ti.url == hurl:
			ti.url=hurl
			ti.put()
		memtienda={
			"id":ti.key.id(),
			"ult_mod":ti.ult_modi,
			"act":ti.webactiva,
			"url":ti.url,
			"url_tien":ti.nombreupper,
			"usohorario":usohor,
			"nombre":ti.nombre,
			"calle":ti.calle,
			"pro":ti.provincia,
			"loca":ti.localidad,
			"cdp":ti.cdp,
			"poblas":ti.poblaciones,
			"lat":ti.posmapa.lat,
			"lon":ti.posmapa.lon,
			"dmap":ti.dirmapa,
			"zrep":zrep,
			"codpos":ti.cod_postal,
			"ems":ti.email,
			"tel":ti.telefono,
			"pag":ti.forma_pago,
			"ti_recoger":ti.tiempo_recoger,
			"ti_domicilio":ti.tiempo_domicilio,
			"prepedmindom":ti.prepedmindom,
			"hrs":hrs,
			"tims":tims,
			"kims":kys,
			"paypal":paypal,
			"pagantis":pagantis
		}
		memcache.set(ti.nombre.upper()+"tienda",memtienda,time=segundos or getSegundos())
		return memtienda

def list_json(nomti):
	nomti=nomti.upper()
	memtienda=memcache.get(nomti+"tienda")
	memkeyti=memcache.get(nomti+"key")
	hoy=datetime.datetime.now()
	masuno=hoy + datetime.timedelta(days=1)
	
	ti=None
	if not memtienda:
		if memkeyti:
			ti=memkeyti.get()
		else:
			ti = todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomti).get()
		if not ti:
			return (None,None)
		if not ti.webactiva:
			return ({"tienda":{"act":False}},None)
		memkeyti=ti.key
		segundos=(datetime.datetime(masuno.year,masuno.month,masuno.day)-hoy).total_seconds()
		memcache.set(nomti+"key",memkeyti,time=segundos)
		memtienda=getTienda(ti,segundos)
	memnomti=memcache.get(nomti)
	if not memnomti:
		if not ti:
			if memkeyti:
				ti=memkeyti.get()
			else:
				ti = todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomti).get()
			if not ti:
				return (None,None)
			if not ti.webactiva:
				return ({"tienda":{"act":False}},None)
			memkeyti=ti.key	
		ancestor_key=todosmodelos.ndb.Key(ti.key.kind(),ti.key.id(),todosmodelos.Pizzaespe,"pizza")
		masasQryfu = todosmodelos.Masa.query(ancestor=ancestor_key).order(todosmodelos.Masa.nombre).fetch_async()
		tamasQryfu =  todosmodelos.Tamano.query(ancestor=ancestor_key).order(todosmodelos.Tamano.nombre).fetch_async()
		mataQryfu =  todosmodelos.MasaTama.query(ancestor=ancestor_key).fetch_async()
		ingQryfu = todosmodelos.Ingredientes.query(ancestor=ancestor_key).order(todosmodelos.Ingredientes.nombre).fetch_async()
		salQryfu =  todosmodelos.Salsas.query(ancestor=ancestor_key).order(todosmodelos.Salsas.nombre).fetch_async()
		pizQryfu=todosmodelos.Pizzaespe.query(ancestor=ancestor_key).order(todosmodelos.Pizzaespe.grupo).fetch_async()

		masasQry = masasQryfu.get_result()
		tamasQry =tamasQryfu.get_result()
		mataQry =mataQryfu.get_result()
		salQry = salQryfu.get_result()
		ingQry =ingQryfu.get_result()
		pizQry =pizQryfu.get_result()

		ancestor_key= ti.key
		hoy2=datetime.date(hoy.year,hoy.month,hoy.day)
		otrosQryfu = todosmodelos.Otros.query(ancestor=ancestor_key).order(todosmodelos.Otros.nombre).fetch_async()
		otrosQryxfu = todosmodelos.Otrosx.query(ancestor=ancestor_key).order(todosmodelos.Otrosx.nombre).fetch_async()

		oferQryfu = todosmodelos.Oferta.query(todosmodelos.Oferta.fechas >= hoy2,ancestor=ancestor_key).fetch_async()

		lisma=[[i.key.id(),i.nombre,i.descrip] for i in masasQry]
		listam=[[i.key.id(),i.nombre,i.num_personas] for i in tamasQry] #if i.key.parent() == ancestor_key
		lismatas=[[i.key.id(),i.masa,i.tama,i.preciobase,i.precioing] for i in mataQry]
		lising=[[i.key.id(),i.nombre,i.valor] for i in ingQry]
		lissal=[[i.key.id(),i.nombre,i.valor] for i in salQry]
		lispiz=[[i.key.id(),i.nombre,i.descrip,i.salsa,i.queso,i.ingres,i.masas,i.apartir_numing_cobrar,i.grupo,i.keyimagen.get().url if i.keyimagen else None ] for i in pizQry]
		
		

		lisotr=[]
		jsuotr={}
		otrosQry =otrosQryfu.get_result()
		for i in otrosQry:
			id=i.key.id()
			lisotr.append([id,i.nombre,i.descrip,i.url])
			uoQry=todosmodelos.UnOtros.query(ancestor=i.key).order(todosmodelos.UnOtros.grupo)
			jsuotr[str(id)]=[(u.key.id(),u.nombre,u.descrip,u.precio,u.grupo,u.keyimagen.get().url if u.keyimagen else None ) for u in uoQry]
			
		
		lisotrx=[]
		jssalx={}
		jsingx={}
		jstamx={}
		jsuotrx={}
		otrosQryx =otrosQryxfu.get_result()
		for i in otrosQryx:
			id=str(i.key.id())
			uingfu=todosmodelos.Ingredientes.query(ancestor=i.key).order(todosmodelos.Ingredientes.nombre).fetch_async()
			uoQryfu=todosmodelos.UnOtrosx.query(ancestor=i.key).order(todosmodelos.UnOtrosx.nombre).fetch_async()
			if len(i.nomsalsa)>0:
				haysal=i.nomsalsa
				usalfu=todosmodelos.Salsas.query(ancestor=i.key).order(todosmodelos.Salsas.nombre).fetch_async()
				usal=usalfu.get_result()
				jssalx[id]=[[u.key.id(),u.nombre,u.valor] for u in usal]
			else:
				haysal="No"
			lisotrx.append([int(id),i.nombre,i.descrip,haysal,[i.tama.nombre,i.tama.preba,i.tama.preing],i.url])
			uing=uingfu.get_result()
			jsingx[id]=[[u.key.id(),u.nombre,u.valor] for u in uing]
			uoQry=uoQryfu.get_result()
			jsuotrx[id]=[(u.key.id(),u.nombre,u.descrip,u.salsa,u.ingres,u.keyimagen.get().url if u.keyimagen else None) for u in uoQry]
			if i.tama.nombre=='Varios':
				utam=todosmodelos.Tamax.query(ancestor=i.key).order(todosmodelos.Tamax.nombre)
				jstamx[id]=[[u.key.id(),u.nombre,u.preba,u.preing] for u in utam]
			
			
		
		oferQry=oferQryfu.get_result()
		#.order(todosmodelos.Oferta.grupo)
		lisofr=[]
		for i in oferQry:
			if i.fecdes <= hoy2:
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
				#if i.keyimagen:
				#	kimg=i.keyimagen.get().url
				#else:
				#	kimg=None
				lisofr.append((i.key.id(),i.nombre,i.descrip,i.fecdes.strftime("%d/%m/%Y"),i.fechas.strftime("%d/%m/%Y"),i.horde.strftime("%H:%M"),i.horh.strftime("%H:%M"),i.dias,i.localodomi,i.ofertaenart,i.numofer,i.preciofijo,i.descuento,i.eurosoporcen,i.increm,i.numproduc,i.grupo,mispro,i.keyimagen.get().url if i.keyimagen else None))
		lisofr.sort(key=lambda kv: kv[16])
		#sorted(lisofr, key=lambda kv: kv[16])
		
		memnomti={"masas":lisma,"tamas":listam,"matas":lismatas,"ingres":lising,"sal":lissal,"piz":lispiz,"otros":lisotr,"unotros":jsuotr,"otrosx":lisotrx,"unotrosx":jsuotrx,"salsasx":jssalx,"ingresx":jsingx,"tamax":jstamx,"ofer":lisofr}
		memcache.set(nomti,memnomti)
	memnomti["tienda"]=memtienda
	return (memnomti,memkeyti)

