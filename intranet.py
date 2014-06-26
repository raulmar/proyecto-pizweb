#!/usr/bin/python
# -*- coding: utf-8 -*-
import webapp2
import json
import cgi
import re
#import hashlib
import datetime
#from google.appengine.api import memcache
from modelos import todosmodelos
from modulospy import utils

"""def segundos():
	hoy=datetime.datetime.now()
	masuno=hoy + datetime.timedelta(days=1)
	return (datetime.datetime(masuno.year,masuno.month,masuno.day)-hoy).total_seconds()"""

def list_json(nomtikey,graurl,ulm):
	ti = nomtikey.get()
	if not ti: 
		return None
	tienda=utils.getTienda(ti,utils.getSegundos(),graurl)
	if ulm == tienda["ult_mod"]:
		return {"ok":"ok","tienda":tienda}
		
	ancestor_key=todosmodelos.ndb.Key(ti.key.kind(),ti.key.id(),todosmodelos.Pizzaespe,"pizza")
	masasQry = todosmodelos.Masa.query(ancestor=ancestor_key).order(todosmodelos.Masa.nombre)
	tamasQry =  todosmodelos.Tamano.query(ancestor=ancestor_key).order(todosmodelos.Tamano.nombre)
	mataQry =  todosmodelos.MasaTama.query(ancestor=ancestor_key)
	ingQry = todosmodelos.Ingredientes.query(ancestor=ancestor_key).order(todosmodelos.Ingredientes.nombre)
	salQry =  todosmodelos.Salsas.query(ancestor=ancestor_key).order(todosmodelos.Salsas.nombre)
	pizQry=todosmodelos.Pizzaespe.query(ancestor=ancestor_key).order(todosmodelos.Pizzaespe.grupo)
	lisma=[[i.key.id(),i.nombre,i.descrip] for i in masasQry]
	listam=[[i.key.id(),i.nombre,i.num_personas] for i in tamasQry] #if i.key.parent() == ancestor_key
	lismatas=[[i.key.id(),i.masa,i.tama,i.preciobase,i.precioing] for i in mataQry]
	lising=[[i.key.id(),i.nombre,i.valor] for i in ingQry]
	lissal=[[i.key.id(),i.nombre,i.valor] for i in salQry]
	lispiz=[[i.key.id(),i.nombre,i.descrip,i.salsa,i.queso,i.ingres,i.masas,i.apartir_numing_cobrar,i.grupo] for i in pizQry]
	ancestor_key= ti.key
	otrosQry = todosmodelos.Otros.query(ancestor=ancestor_key).order(todosmodelos.Otros.nombre)
	lisotr=[]
	jsuotr={}
	for i in otrosQry:
		id=i.key.id()
		lisotr.append([id,i.nombre,i.descrip])
		uoQry=todosmodelos.UnOtros.query(ancestor=i.key).order(todosmodelos.UnOtros.grupo)
		jsuotr[str(id)]=[(u.key.id(),u.nombre,u.descrip,u.precio,u.grupo) for u in uoQry]

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
		lisotrx.append([int(id),i.nombre,i.descrip,haysal,[i.tama.nombre,i.tama.preba,i.tama.preing]])
		uing=todosmodelos.Ingredientes.query(ancestor=i.key).order(todosmodelos.Ingredientes.nombre)
		jsingx[id]=[[u.key.id(),u.nombre,u.valor] for u in uing]
		if i.tama.nombre=='Varios':
			utam=todosmodelos.Tamax.query(ancestor=i.key).order(todosmodelos.Tamax.nombre)
			jstamx[id]=[[u.key.id(),u.nombre,u.preba,u.preing] for u in utam]
		uoQry=todosmodelos.UnOtrosx.query(ancestor=i.key).order(todosmodelos.UnOtrosx.nombre)
		jsuotrx[id]=[(u.key.id(),u.nombre,u.descrip,u.salsa,u.ingres) for u in uoQry]
	hoy=datetime.datetime.now()
	hoy2=datetime.date(hoy.year,hoy.month,hoy.day)
	oferQry = todosmodelos.Oferta.query(todosmodelos.Oferta.fechas >= hoy2,ancestor=ancestor_key)
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
			lisofr.append([i.key.id(),i.nombre,i.descrip,i.fecdes.strftime("%d/%m/%Y"),i.fechas.strftime("%d/%m/%Y"),i.horde.strftime("%H:%M"),i.horh.strftime("%H:%M"),i.dias,i.localodomi,i.ofertaenart,i.numofer,i.preciofijo,i.descuento,i.eurosoporcen,i.increm,i.numproduc,i.grupo,mispro])
	lisofr.sort(key=lambda kv: kv[16])
	#clake=nomti+"key"
	memnomti={"ok":"ok","masas":lisma,"tamas":listam,"matas":lismatas,"ingres":lising,"sal":lissal,"piz":lispiz,"otros":lisotr,"unotros":jsuotr,"otrosx":lisotrx,"unotrosx":jsuotrx,"salsasx":jssalx,"ingresx":jsingx,"tamax":jstamx,"ofer":lisofr,"tienda":tienda}
	#memcache.set_multi({clake:ti.key,nomti:memnomti},time=segundos())
	#memcache.delete(nomti+"haymodi")
	#memcache.set(nomti+"key",ti.key,time=segundos)
	#memcache.set(nomti,{"ok":"ok","masas":lisma,"tamas":listam,"matas":lismatas,"ingres":lising,"sal":lissal,"piz":lispiz,"otros":lisotr,"unotros":jsuotr,"otrosx":lisotrx,"unotrosx":jsuotrx,"salsasx":jssalx,"ingresx":jsingx,"tamax":jstamx,"ofer":lisofr,"tien":tien},time=segundos)
#elif not memnomti["tienda"]["act"]:
#	return None
#elif not memnomti["tienda"]["url"] == graurl:
#	memnomti["tienda"]["url"]=graurl
#	memcache.set(nomti,memnomti,time=segundos())
		
	return memnomti

class conectar(webapp2.RequestHandler):
	def post(self):
		self.objjson=json.loads(cgi.escape(self.request.body))
		if not self.objjson.has_key("em") or not self.objjson.has_key("con") or not self.objjson.has_key("um"):
			self.response.out.write(json.dumps({"error":u"No hay datos usuario"}))
			return
		email = self.objjson['em']
		password = self.objjson['con']
		um=int(self.objjson['um'])
		lon=len(password)
		if not re.match(r'\b[\w.-]+@[\w.-]+.\w{2,4}\b', email):
			self.response.out.write(json.dumps({"error":"Error en email"}))
		if lon<6 or lon>30:
			self.response.out.write(json.dumps({"error":u"Error:Contraseña tiene que tener un tamaño entre 6 y 30 caracteres"}))
			return
	   
		u = todosmodelos.Usuarios.query(todosmodelos.Usuarios.email==email,todosmodelos.Usuarios.password==utils.nueva_contra(password)).get()
		if u:
			if u.token and not u.valida:
				self.response.out.write(json.dumps({"error":u"Este email (%s)todavía no está validado, por favor revisa tu correo." % email}))
				return
			res=list_json(u.tienda,self.request.remote_addr,um)
			if not res:
				self.response.out.write(json.dumps({"error":u"Tienda no responde a get"}))
				return
			self.response.out.write(json.dumps(res,ensure_ascii=False))
			"""if res["tienda"]["ult_mod"] == um:
				self.response.out.write(json.dumps({"ok":"ok","tienda":{"ult_mod":um},"url":self.request.remote_addr},ensure_ascii=False))
			else:
				#res["url"]=self.request.remote_addr
				self.response.out.write(json.dumps(res,ensure_ascii=False))"""
		else:
			self.response.out.write(json.dumps({"error":u"No se ha encontrado email %s con esa contraseña" % email}))

class listar(webapp2.RequestHandler):
	def get(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			self.response.out.write(json.dumps({"error":"No hay tienda en url"}))
			return
		res=list_json(nomtien)
		if not res:
			self.response.out.write(json.dumps({"error":"No existe tienda %s" % nomtien}))
			return
		self.response.out.write(json.dumps(res,ensure_ascii=False))

app = webapp2.WSGIApplication([
	('/intranet/conectar', conectar),
  	('/intranet/articulos', listar),
],debug=True)