#!/usr/bin/python
# -*- coding: utf-8 -*-
import json
from modulospy import baserequest
from modelos import todosmodelos
import imgs3 as Img


class clMasas(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if self.objjson.has_key("datos") and type(self.objjson["datos"]) == list:
			datos=self.objjson["datos"]
		else:
			self.errornor("datos erróneo")
			return
		ope=self.objjson["ope"]
		ancestor_key= todosmodelos.ndb.Key(self.session['usuario'].tienda.kind(),self.session['usuario'].tienda.id(),todosmodelos.Pizzaespe,"pizza")
		if ope=="ins":
			va=["nombre","descrip"]
			ta=[80,200]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(va,cam) or not self.loncadeen(va,ta,cam):
					self.errorcomp("error en campos")
					return
				ma= todosmodelos.Masa(parent=ancestor_key,nombre=cam["nombre"],descrip=cam["descrip"])
				k=ma.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar.")
			self.ok(self.devol,1)
		elif ope=="mod":
			va=["nombre","descrip"]
			ta=[80,200]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["id","nombre","descrip"],cam) or not self.loncadeen(va,ta,cam):
					self.errornor("Faltan campos")
					return
				try:
					id=int(cam["id"])
				except:
					self.errorcomp("id erróneo")
					return
				x=todosmodelos.Masa.get_by_id(id,parent=ancestor_key)
				if not x:
					self.errorcomp("No se puede encontrar id")
					return
				x.populate(nombre=cam["nombre"],descrip=cam["descrip"])
				k=x.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar")
			self.ok(self.devol,1)
		elif ope=="del":
			lids=[]
			for i in datos:
				try:
					id=int(i)
				except:
					self.response.out.write(json.dumps({"error":"i=%d" % i,"ids":datos}))
					return
				x=False
				x=todosmodelos.Masa.get_by_id(id,parent=ancestor_key)
				if x:
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					break
				mtq=todosmodelos.MasaTama.query(todosmodelos.MasaTama.masa==id)
				for mt in mtq.iter(keys_only=True):
					lids.append(mt)
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")

class clTamas(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if self.objjson.has_key("datos") and type(self.objjson["datos"]) == list:
			datos=self.objjson["datos"]
		else:
			self.errornor("datos erróneo")
			return
		ope=self.objjson["ope"]
		ancestor_key= todosmodelos.ndb.Key(self.session['usuario'].tienda.kind(),self.session['usuario'].tienda.id(),todosmodelos.Pizzaespe,"pizza")
		if ope=="ins":
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["nombre","perso"],cam) or not self.loncadeen(["nombre"],[80],cam):
					self.errornor("error en campos")
					return
				try:
					pe=int(cam["perso"])
				except:
					self.errorcomp("número de personas erróneo")
					return
				ma= todosmodelos.Tamano(parent=ancestor_key,nombre=cam["nombre"],num_personas=pe)
				k=ma.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar.")
			self.ok(self.devol,1)
		elif ope=="mod":
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["id","nombre","perso"],cam) or not self.loncadeen(["nombre"],[80],cam):
					self.errorcomp("error en campos")
					return
				try:
					id=int(cam["id"])
					pe=int(cam["perso"])
				except:
					self.errorcomp("id o número de personas erróneo")
					return
				x=todosmodelos.Tamano.get_by_id(id,parent=ancestor_key)
				if not x:
					self.errorcomp("No se puede encontrar id")
				x.populate(nombre=cam["nombre"],num_personas=pe)
				k=x.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar")
			self.ok(self.devol,1)
		elif ope=="del":
			lids=[]
			for i in datos:
				try:
					id=int(i)
				except:
					self.response.out.write(json.dumps({"error":"en id %d" % i,"ids":datos}))
					return
				x=False
				x=todosmodelos.Tamano.get_by_id(id,parent=ancestor_key)
				if x:
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					break
				mtq=todosmodelos.MasaTama.query(todosmodelos.MasaTama.tama==id)
				for mt in mtq.iter(keys_only=True):
					lids.append(mt)
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")	
	
class clMatas(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if self.objjson.has_key("datos") and type(self.objjson["datos"]) == list:
			datos=self.objjson["datos"]
		else:
			self.errornor("datos erróneo")
			return
		ope=self.objjson["ope"]
		ancestor_key= todosmodelos.ndb.Key(self.session['usuario'].tienda.kind(),self.session['usuario'].tienda.id(),todosmodelos.Pizzaespe,"pizza")
		if ope=="ins":
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["idma","idta","preba","preing"],cam):
					self.errorcomp("error en campos")
					return
				try:
					pb=float(cam["preba"])
					pi=float(cam["preing"])
					ima=int(cam["idma"])
					ita=int(cam["idta"])
				except: # ValueError as e:
					self.errorcomp("precios, ids") # %s" % e)
					return
				ma= todosmodelos.MasaTama(parent=ancestor_key,masa=ima,tama=ita,preciobase=pb,precioing=pi)
				k=ma.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar.")
			self.ok(self.devol,1)
		elif ope=="mod":
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["id","idma","idta","preba","preing"],cam):
					self.errorcomp("error en campos")
					return
				try:
					id=int(cam["id"])
					pb=float(cam["preba"])
					pi=float(cam["preing"])
					ima=int(cam["idma"])
					ita=int(cam["idta"])
				except:
					self.errorcomp("ids,precio")
					return
				x=todosmodelos.MasaTama.get_by_id(id,parent=ancestor_key)
				if not x:
					self.errorcomp("No se puede encontrar id")
				x.populate(masa=ima,tama=ita,preciobase=pb,precioing=pi)
				k=x.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar")
			self.ok(self.devol,1)
		elif ope=="del":
			lids=[]
			for i in datos:
				try:
					id=int(i)
				except:
					self.response.out.write(json.dumps({"error":"en id","idgrab":datos}))
					return
				x=False
				x=todosmodelos.MasaTama.get_by_id(id,parent=ancestor_key)
				if x:
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","idgrab":datos}))
					break
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")

class clIngSal(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if self.objjson.has_key("datos") and type(self.objjson["datos"]) == list and self.objjson.has_key("tipo") and self.objjson["tipo"] in ["ing","sal"]:
			datos=self.objjson["datos"]
			tipo=self.objjson["tipo"]
		else:
			self.errornor("datos erróneo o tipo")
			return
		ope=self.objjson["ope"]
		ancestor_key= todosmodelos.ndb.Key(self.session['usuario'].tienda.kind(),self.session['usuario'].tienda.id(),todosmodelos.Pizzaespe,"pizza")
		if ope=="ins":

			va=["nombre","valor"]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(va,cam) or not self.loncadeen(["nombre"],[80],cam):
					self.errorcomp("error en campos")
					return
				try:
					valo=float(cam["valor"])
				except:
					self.errorcomp("valor erróneo")
					return
				if tipo=="ing":
					ma= todosmodelos.Ingredientes(parent=ancestor_key,nombre=cam["nombre"],valor=valo)
				elif tipo=="sal":
					ma= todosmodelos.Salsas(parent=ancestor_key,nombre=cam["nombre"],valor=valo)
				else:
					self.errorcomp("error en tipo")
					return
				k=ma.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar.")
			self.ok(self.devol,1)
		elif ope=="mod":
			va=["nombre","valor","id"]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(va,cam) or not self.loncadeen(["nombre"],[80],cam):
					self.errorcomp("Faltan campos")
					return
				try:
					id=int(cam["id"])
					valo=float(cam["valor"])
				except:
					self.errorcomp("id,valor erróneo")
					return
				if tipo=="ing":
					x=todosmodelos.Ingredientes.get_by_id(id,parent=ancestor_key)
				elif tipo=="sal":
					x=todosmodelos.Salsas.get_by_id(id,parent=ancestor_key)
				else:
					self.errorcomp("error en tipo")
					return
				if not x:
					self.errorcomp("No se puede encontrar id")
					return
				x.nombre=cam["nombre"]
				x.valor=valo
				k=x.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errornor("no se pudo grabar")
			self.ok(self.devol,1)
		elif ope=="del":
			if tipo=="ing":
				tipo=True
			elif tipo=="sal":
				tipo=False
			lids=[]
			otrlid=[]
			for i in datos:
				try:
					id=int(i)
				except:
					self.response.out.write(json.dumps({"error":"i=%d" % i,"ids":datos}))
					return
				x=False
				if tipo:
					x=todosmodelos.Ingredientes.get_by_id(id,parent=ancestor_key)
				else:
					x=todosmodelos.Salsas.get_by_id(id,parent=ancestor_key)
				if x:
					lids.append(x.key)
					otrlid.append(id)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":otrlid,"tipo":tipo}))
					break
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")
class clPizzes(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if self.objjson.has_key("datos") and type(self.objjson["datos"]) == list:
			datos=self.objjson["datos"]
		else:
			self.errornor(u"datos erróneo")
			return
		ope=self.objjson["ope"]
		ancestor_key= todosmodelos.ndb.Key(self.session['usuario'].tienda.kind(),self.session['usuario'].tienda.id(),todosmodelos.Pizzaespe,"pizza")
		if ope=="ins":
			va=["idsal","nuing","nombre","descrip","queso","ingres","masas","grupo"]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(va,cam) or not self.loncadeen(["nombre","descrip"],[80,200],cam):
					self.errorcomp("error en campos")
					return
				try:
					gru=cam["grupo"][:80]
					nui=int(cam["nuing"])
					idsal=int(cam["idsal"])
					maaux=cam["masas"]
					idsma=[int(i) for i in maaux]
					ingaux=cam["ingres"]
					idsing=[int(i) for i in ingaux]
					que=cam["queso"]==1
				except:
					self.errorcomp("valor erróneo")
					return
				
				piz= todosmodelos.Pizzaespe(parent=ancestor_key,nombre=cam["nombre"],descrip=cam["descrip"],salsa=idsal,queso=que,ingres=idsing,masas=idsma,apartir_numing_cobrar=nui,grupo=gru)
				k=piz.put()
				if k:
					self.devol.append([k.integer_id(), k.urlsafe()])
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar.")
			self.ok(self.devol,1)
		elif ope=="mod":
			va=["idsal","nuing","nombre","descrip","queso","ingres","masas","id","grupo"]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(va,cam) or not self.loncadeen(["nombre","descrip"],[80,200],cam):
					self.errorcomp("Faltan campos")
					return
				try:
					gru=cam["grupo"][:80]
					nui=int(cam["nuing"])
					idsal=int(cam["idsal"])
					maaux=cam["masas"]
					if len(maaux)==0:
						idsma=[]
					else:
						idsma=[int(i) for i in maaux]
					ingaux=cam["ingres"]
					if len(ingaux)==0:
						idsing=[]
					else:
						idsing=[int(i) for i in ingaux]
					que=cam["queso"]==1
					id=int(cam["id"])
				except:
					self.errorcomp("valor erróneo")
					return
				x=todosmodelos.Pizzaespe.get_by_id(id,parent=ancestor_key)
				if not x:
					self.errorcomp("No se puede encontrar id")
					return
				x.nombre=cam["nombre"]
				x.descrip=cam["descrip"]
				x.salsa=idsal
				x.queso=que
				x.ingres=idsing
				x.masas=idsma
				x.apartir_numing_cobrar=nui
				x.grupo=gru
				k=x.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar")
			self.ok(self.devol,1)
		elif ope=="del":
			lids=[]
			for i in datos:
				try:
					id=int(i)
				except:
					self.response.out.write(json.dumps({"error":"i=%d" % i,"ids":datos}))
					return
				x=False
				x=todosmodelos.Pizzaespe.get_by_id(id,parent=ancestor_key)
				if x:
					if x.keyimagen:
						img=x.keyimagen.get()
						img.puntero-=1
						if img.puntero < 1:
							Img.borrarImg_cloud(img)
						else:
							img.put()
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					break
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")
class verTodas(baserequest.BaseHandler):
	def get(self):
		mise = self.session.get('usuario')
		if not mise:
			self.response.out.write(json.dumps({"error":u"No hay sesión de usuario"},ensure_ascii=False))
			return
		ancestor_key= todosmodelos.ndb.Key(mise.tienda.kind(),mise.tienda.id(),todosmodelos.Pizzaespe,"pizza")
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
		#lispiz=[[i.key.id(),i.nombre,i.descrip,i.salsa,i.queso,i.ingres,i.masas,i.apartir_numing_cobrar,i.key.urlsafe(),( i.keyimagen and i.keyimagen.urlsafe() ),i.grupo,i.titimagen] for i in pizQry]
		self.response.out.write(json.dumps({"ok":"ok","masas":lisma,"tamas":listam,"matas":lismatas,"ingres":lising,"sal":lissal,"piz":lispiz},ensure_ascii=False))