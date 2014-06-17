#!/usr/bin/python
# -*- coding: utf-8 -*-
from google.appengine.api import memcache
import datetime
import re
import unidecode
import json
from time import time
from modulospy import baserequest
from modelos import todosmodelos


def slugify(str):
    str = unidecode.unidecode(str).lower()
    return re.sub(r'\W+','-',str)

"""
from unicodedata import normalize
	def slugify(title):
	    name = normalize('NFKD', title).encode('ascii', 'ignore').replace(' ', '-')
	    #.lower()
	    #remove `other` characters
	    name = re.sub('[^a-zA-Z0-9_-]', '', name)
	    #nomalize dashes
	    name = re.sub('-+', '-', name)
	    return name"""
class clpagPaypal(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if  not self.objjson.has_key("datos"):
			self.errornor("error en datos")
			return
		datos=self.objjson["datos"]
		ope=self.objjson["ope"]
		ancestor_key= self.session['usuario'].key
		if not ope == "mod":
			self.errornor(u"error en operación")
			return
		if not self.session.get('usuario').tienda:
			self.errornor("No hay tienda")
			return
		
		#{ope:"mod",datos:{ci:clid,sec:sec,modo:planpo.eles.modo.sel,haysu:haysu,icdc:vasu.v,ep:vasu.s,id:controladorTienda.tienda.id }}
		if not self.existeen(["ci","sec","modo","haysu","icdc","ep","id","cade"],datos) or len(datos["ci"]) < 10 or len(datos["sec"]) < 10:
			self.errorcomp("error en campos")
			return
		try:
			lc=len(datos["cade"])
			if lc<5 or lc > 50:
				self.errorcomp("error Cadena suplemento debe ser una cadena entre 5 y 50 caracteres.")
				return
			id=int(datos["id"])
			haysu=int(datos["haysu"]) > 0
			modo=int(datos["modo"]) > 0
			if haysu:
				icdc=float(datos["icdc"])
				ep=int(datos["ep"]) > 0
			else:
				icdc=0
				ep=True
		except:
			self.errornor("id erróneo")
			return
		x= todosmodelos.Tienda.get_by_id(id,parent=ancestor_key)
		if not x:
			self.errornor("No se puede encontrar id")
			return
		pay=todosmodelos.apiPaypal(clientid=datos["ci"],secret=datos["sec"],inc_des=icdc,modo=modo,poroeur=ep,stringsuple=datos["cade"])
		x.populate(paypal=pay)
		ok=x.put()
		if ok:
			self.ok("ok",{"clid":datos["ci"],"sec":datos["sec"],"inc_des":icdc,"modo":modo,"ep":ep})
		else:
			self.errornor("error al hacer put en populate")

class clpagPagantis(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if  not self.objjson.has_key("datos"):
			self.errornor("error en datos")
			return
		datos=self.objjson["datos"]
		ope=self.objjson["ope"]
		ancestor_key= self.session['usuario'].key
		if not ope == "mod":
			self.errornor(u"error en operación")
			return
		if not self.session.get('usuario').tienda:
			self.errornor("No hay tienda")
			return
		
		#{ope:"mod",datos:{ci:clid,sec:sec,modo:planpo.eles.modo.sel,haysu:haysu,icdc:vasu.v,ep:vasu.s,id:controladorTienda.tienda.id }}
		if not self.existeen(["cocuid","clafir","ak","modo","haysu","icdc","ep","id","cade"],datos) or len(datos["cocuid"]) < 10 or len(datos["clafir"]) < 10 or len(datos["ak"]) < 10 :
			self.errorcomp("error en campos")
			return
		try:
			lc=len(datos["cade"])
			if lc<5 or lc > 50:
				self.errorcomp("error Cadena suplemento debe ser una cadena entre 5 y 50 caracteres.")
				return
			id=int(datos["id"])
			haysu=int(datos["haysu"]) > 0
			modo=int(datos["modo"]) > 0
			if haysu:
				icdc=float(datos["icdc"])
				ep=int(datos["ep"]) > 0
			else:
				icdc=0
				ep=True
		except:
			self.errornor("id erróneo")
			return
		x= todosmodelos.Tienda.get_by_id(id,parent=ancestor_key)
		if not x:
			self.errornor("No se puede encontrar id")
			return
		pagtis=todosmodelos.apiPagantis(account_id=datos["cocuid"],clave_firma=datos["clafir"],api_key=datos["ak"],inc_des=icdc,modo=modo,poroeur=ep,stringsuple=datos["cade"])
		x.populate(pagantis=pagtis)
		ok=x.put()
		if ok:
			self.ok("ok",{"cocuid":datos["cocuid"],"clafir":datos["clafir"],"apikey":datos["ak"], "inc_des":icdc,"modo":modo,"ep":ep})
		else:
			self.errornor("error al hacer put en populate")

class clTienda(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if  not self.objjson.has_key("datos"):
			self.errornor("error en datos")
			return
		datos=self.objjson["datos"]
		ope=self.objjson["ope"]
		ancestor_key= self.session['usuario'].key
		if ope=="ins":
			miu=todosmodelos.Usuarios.get_by_id(ancestor_key.id())
			if miu.tienda:
				self.errornor("Usuario %s ya tiene tienda" % miu.nombre)
				return
			self.comprobar(datos,ope)
		elif ope=="mod":
			if not self.session.get('usuario').tienda:
				self.errornor("No hay tienda")
				return
			try:
				id=int(datos["id"])
			except:
				self.errornor("id erróneo")
				return
			x= todosmodelos.Tienda.get_by_id(id,parent=ancestor_key)
			if not x:
				self.errornor("No se puede encontrar id")
				return
			self.comprobar(datos,ope,x)
		elif ope=="del":
			try:
				id=int(datos["id"])
			except:
				self.errornor("id erróneo")
				return
			x= todosmodelos.Tienda.get_by_id(id,parent=ancestor_key)
			if x:
				x.key.delete()
				mise.tienda=None
				mise.put()
				self.ok("ok eliminada tienda")
			else:
				self.errornor("no existe id %d" % id)
				return
	def comprobar(self,datos,ope,tikey=None):
		
		va=("nombre","provin","loca","calle","cdp","dirma","em1","em2","tele1","tele2","cp","poblas","longi","lati","pago","horarios","puntos","tireco","tidomi","prepd","usohorario")
		va2=("nombre","provin","loca","calle","dirma","em1","tele1","cdp")
		ta=(30,50,50,100,100,50,9,5)
		if not self.existeen(va,datos) or not self.loncadeen(va2,ta,datos) or not type(datos["cp"]) == list or not type(datos["poblas"]) == list or not type(datos["puntos"]) == list:
			self.errornor("1 faltan o error en campos")
			return False
		"""if not re.match("^[\w|-]{4,40}$",datos["nombre"]):
			self.errornor("1.2 Error en nombre de tienda %s" % datos["nombre"])
			return False"""
		#datos["nombre"]=slugify(datos["nombre"])
		slugurl=slugify(datos["nombre"])
		#nomtiup=datos["nombre"].upper()
		nomtiup=slugurl.upper()
		#hayti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtiup).get()
		#cant=hayti.count(limit=1)
		if ope=="ins":
			hayti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtiup).get()
			if hayti:
				self.errornor("1.3 Nombre de tienda ( %s ) no valido ya existe" % datos["nombre"])
				return False
		elif not tikey.nombreupper == nomtiup:
			hayti=todosmodelos.Tienda.query(todosmodelos.Tienda.nombreupper==nomtiup).get()
			if hayti and not hayti.key.id() == tikey.key.id(): #integer_id() == tikey.integer_id():
				self.errornor("1.5 en modificación Nombre de tienda ( %s ) no valido ya existe" % datos["nombre"])
				return False
			memcache.delete_multi((nomtiup,nomtiup+"tienda",nomtiup+"key"))

		if len(datos["em2"]) > 0:
			datos["em1"]=(datos["em1"],datos["em2"])
		else:
			datos["em1"]=(datos["em1"],)
		if len(datos["tele2"]) > 0 :
			datos["tele1"]=(int(datos["tele1"]),int(datos["tele2"]))
		else:
			datos["tele1"]=(int(datos["tele1"]),)
		for cp in datos["cp"]:
			lon=len(cp)
			if lon<5 or lon>5:
				self.errornor("2 error en código postal %s" % cp)
				return False
		for pbs in datos["poblas"]:
			lon=len(pbs)
			if lon<2 or lon>40:
				self.errornor("2p error en municipio %s" % pbs)
		try:
			tireco=int(datos["tireco"])
			tidomi=int(datos["tidomi"])
			premin=float(datos["prepd"])
			puntos=[]
			for pu in datos["puntos"]:
				lat=float(pu[0])
				longi=float(pu[1])
				puntos.append(todosmodelos.ndb.GeoPt(lat, longi))
			longi=float(datos["longi"])
			lat=float(datos["lati"])
			datos["pago"]=int(datos["pago"])
			if datos["pago"] <0 or datos["pago"] > 3:
				self.errornor("3 Error en pago")
				return False
			hors=[]
			for h in datos["horarios"]:
				lon=len(h["nombre"])
				if lon < 4 or lon >15:
					self.errornor("4 error en nombre de horario %s" % h["nombre"])
					return False
				if h["tipo"] == 2: 
					#"Cerrado"
					hors.append(todosmodelos.Horario(tipo=2,dia=h["nombre"]))
				elif h["tipo"] == 1:
					#u"Día Partido"
					dmd=h["dmd"].split(":")
					dmh=h["dmh"].split(":")
					dtd=h["dtd"].split(":")
					dth=h["dth"].split(":")
					hors.append(todosmodelos.Horario(tipo=1,dia=h["nombre"],diamad=datetime.time(int(dmd[0]),int(dmd[1])),diamah=datetime.time(int(dmh[0]),int(dmh[1])),diatad=datetime.time(int(dtd[0]),int(dtd[1])),diatah=datetime.time(int(dth[0]),int(dth[1]))))
				elif h["tipo"] == 0:
					#u"Todo el día"
					dmd=h["dmd"].split(":")
					dmh=h["dmh"].split(":")
					hors.append(todosmodelos.Horario(tipo=0,dia=h["nombre"],diamad=datetime.time(int(dmd[0]),int(dmd[1])),diamah=datetime.time(int(dmh[0]),int(dmh[1]))))
		except:
			self.errornor("5 Error en parseo de datos")
			return False
		miu=self.session.get('usuario')
		valmodi=int(time()*1000)
		if ope=="ins":
			ti=todosmodelos.Tienda(parent=miu.key,nombre=datos["nombre"],nombreupper=nomtiup,calle=datos["calle"],provincia=datos["provin"],localidad=datos["loca"],cdp=datos["cdp"],posmapa=todosmodelos.ndb.GeoPt(lat, longi),dirmapa=datos["dirma"],cod_postal=datos["cp"],poblaciones=datos["poblas"],ult_modi=valmodi,usohorario=datos["usohorario"], email=datos["em1"],telefono=datos["tele1"],forma_pago=datos["pago"],horario=hors,zona_reparto=puntos,tiempo_recoger=tireco,tiempo_domicilio=tidomi,prepedmindom=premin)
			ok=ti.put()
		else:
			#oldnom=tikey.nombreupper
			tikey.populate(nombre=datos["nombre"],nombreupper=nomtiup,calle=datos["calle"],provincia=datos["provin"],localidad=datos["loca"],cdp=datos["cdp"],posmapa=todosmodelos.ndb.GeoPt(lat, longi),dirmapa=datos["dirma"],cod_postal=datos["cp"],poblaciones=datos["poblas"],ult_modi=valmodi,usohorario=datos["usohorario"],email=datos["em1"],telefono=datos["tele1"],forma_pago=datos["pago"],horario=hors,zona_reparto=puntos,tiempo_recoger=tireco,tiempo_domicilio=tidomi,prepedmindom=premin)
			ok=tikey.put()
			#if not oldnom == nomtiup:
			#	memcache.delete_multi([oldnom,oldnom+"key",oldnom+"haymodi"])
				#memcache.delete(nomtiup)
				#memcache.delete(nomtiup+"key")
		#memcache.add(nomtiup+"haymodi",valmodi)
		if ok:
			if ope=="ins":
				miu.tienda=ok
				miu.put()
				self.session['usuario']=miu
			self.ok(ok.integer_id(),{"urlsafe":ok.urlsafe(),"urltien":nomtiup})
		else:
			self.errornor("Error al grabar")
		


class verTienda(baserequest.respuesta):
	def get(self):
		mise = self.session.get('usuario')
		if not mise or not mise.valida:
			self.errornor("Error en usuario")
			return
		ancestor_key= mise.key
		tien = todosmodelos.Tienda.query(ancestor=ancestor_key).get()
		if tien:
			#kys=[]
			hrs={}
			#for i in tien.keyimagen:
			#	kys.append(i.urlsafe())
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
			self.response.out.write(json.dumps({
				"ok":"ok",
				"tienda":{
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
					"lat":tien.posmapa.lat,
					"lon":tien.posmapa.lon,
					"dmap":tien.dirmapa,
					"zrep":zrep,
					"codpos":tien.cod_postal,
					"poblas":tien.poblaciones,
					"ems":tien.email,
					"tel":tien.telefono,
					"pag":tien.forma_pago,
					"ti_recoger":tien.tiempo_recoger,
					"ti_domicilio":tien.tiempo_domicilio,
					"prepedmindom":tien.prepedmindom,
					"hrs":hrs,
					"kc":tien.key.urlsafe(),
					"kims":tien.keyimagen,
					"paypal":paypal,
					"pagantis":pagantis
				}},ensure_ascii=False))
		else:
				self.response.out.write(json.dumps({
				"ok":"ok",
				"tienda":{} },ensure_ascii=False))