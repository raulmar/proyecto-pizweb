#!/usr/bin/python
# -*- coding: utf-8 -*-
import json
import re
from modulospy import baserequest
from modelos import todosmodelos
import imgs3 as Img
import unidecode

def slugify(str):
    str = unidecode.unidecode(str).lower()
    return re.sub(r'\W+','-',str)

class clunotro(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if self.objjson.has_key("padre") and self.objjson.has_key("datos") and type(self.objjson["datos"]) == list:
			try:
				idpadre=int(self.objjson["padre"])
			except:
				self.errornor("idpadre erróneo %s" % self.objjson["padre"])
				return
			datos=self.objjson["datos"]
			ancestor_key= self.session['usuario'].tienda
			padre=todosmodelos.Otrosx.get_by_id(idpadre,parent=ancestor_key)
			if not padre:
				self.errornor("idpadre no existe")
				return
			kpadre=padre.key
		else:
			self.errornor("key padre erróneo")
			return
		ope=self.objjson["ope"]
		if ope=="ins":
			
			va=["nombre","descrip"]
			ta=[80,200]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["nombre","descrip","idsal","ingres"],cam) or not self.loncadeen(va,ta,cam):
					self.errorcomp("error en campos")
					return
				try:
					idsal=int(cam["idsal"])
					if idsal==0:
						idsal=None
					ingaux=cam["ingres"]
					idsing=[int(i) for i in ingaux]
				except:
					self.errorcomp("valor erróneo")
					return
				
				uot= todosmodelos.UnOtrosx(parent=kpadre,nombre=cam["nombre"],descrip=cam["descrip"],salsa=idsal,ingres=idsing)
				k=uot.put()
				if k:
					self.devol.append([k.integer_id(), k.urlsafe()])
					self.numd+=1
					#self.ok(k.integer_id(), k.urlsafe())
				else:
					self.errorcomp("no se pudo grabar.")
					return
			self.ok(self.devol,1)
		elif ope=="mod":
			va=["nombre","descrip"]
			ta=[80,200]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["id","nombre","descrip","idsal","ingres"],cam) or not self.loncadeen(va,ta,cam):
					self.errorcomp("error en campos")
					return
				try:
					idsal=int(cam["idsal"])
					if idsal==0:
						idsal=None
					ingaux=cam["ingres"]
					idsing=[int(i) for i in ingaux]
					id=int(cam["id"])
				except: # ValueError as e:
					self.errorcomp("precio,idsal,idings, id") # %s" % e)
					return
				x= todosmodelos.UnOtrosx.get_by_id(id,parent=kpadre)
				if not x:
					self.errorcomp("No se puede encontrar id %d" % id)
					return
				x.populate(nombre=cam["nombre"],descrip=cam["descrip"],salsa=idsal,ingres=idsing)
				k=x.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar")
					return
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
				x= todosmodelos.UnOtrosx.get_by_id(id,parent=kpadre)
				if x:
					if x.keyimagen:
						img=x.keyimagen.get()
						img.puntero-=1
						if img.puntero < 1:
							Img.borrarImg_cloud(img)
						else:
							img.put()
						#lids.append(x.keyimagen)
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					return
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")

class clIngSal(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if self.objjson.has_key("padre") and self.objjson.has_key("datos") and type(self.objjson["datos"]) == list and self.objjson.has_key("tipo") and self.objjson["tipo"] in ["ing","sal"]:
			try:
				idpadre=int(self.objjson["padre"])
			except:
				self.errornor("idpadre erróneo %s" % self.objjson["padre"])
				return
			ancestor_key= self.session['usuario'].tienda
			padre=todosmodelos.Otrosx.get_by_id(idpadre,parent=ancestor_key)
			if not padre:
				self.errornor("idpadre no existe")
				return
			tipo=self.objjson["tipo"]
			datos=self.objjson["datos"]
			kpadre=padre.key
		else:
			self.errornor("padre,datos o tipo erróneo")
			return
		ope=self.objjson["ope"]
		if ope=="ins":
			self.devol=[]
			self.numd=0
			va=["nombre","valor"]
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
					ma= todosmodelos.Ingredientes(parent=kpadre,nombre=cam["nombre"],valor=valo)
				else:
					ma= todosmodelos.Salsas(parent=kpadre,nombre=cam["nombre"],valor=valo)
				k=ma.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar.")
					return
			self.ok(self.devol,1)

		elif ope=="mod":
			va=["id","nombre","valor"]
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
					x=todosmodelos.Ingredientes.get_by_id(id,parent=kpadre)
				elif tipo=="sal":
					x=todosmodelos.Salsas.get_by_id(id,parent=kpadre)
				else:
					self.errorcomp("error en tipo")
					return
				if not x:
					self.errorcomp("No se puede encontrar id %d" % id)
					return
				x.nombre=cam["nombre"]
				x.valor=valo
				k=x.put()
				if k:
					self.devol.append(k.integer_id())
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar")
					return
			self.ok(self.devol,1)
		elif ope=="del":
			if tipo=="ing":
				tipo=True
			else:
				tipo=False
			lids=[]
			for i in datos:
				try:
					id=int(i)
				except:
					self.response.out.write(json.dumps({"error":"i=%d" % i,"ids":datos}))
					return
				x=False
				if tipo:
					x=todosmodelos.Ingredientes.get_by_id(id,parent=kpadre)
				else:
					x=todosmodelos.Salsas.get_by_id(id,parent=kpadre)
				if x:
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					break
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")

class clTamas(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if self.objjson.has_key("padre") and self.objjson.has_key("datos") and type(self.objjson["datos"]) == list:
			try:
				idpadre=int(self.objjson["padre"])
			except:
				self.errornor("idpadre erróneo %s" % self.objjson["padre"])
				return
			ancestor_key= self.session['usuario'].tienda
			padre=todosmodelos.Otrosx.get_by_id(idpadre,parent=ancestor_key)
			if not padre:
				self.errornor("idpadre no existe")
				return
			kpadre=padre.key
			datos=self.objjson["datos"]
		else:
			self.errornor("padre o datos erróneo")
			return
		ope=self.objjson["ope"]
		if ope=="ins":
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["nombre","preba","preing"],cam) or not self.loncadeen(["nombre"],[80],cam):
					self.errorcomp("error en campos")
					return
				try:
					pb=float(cam["preba"])
					pig=float(cam["preing"])
				except:
					self.errorcomp("número de personas erróneo")
					return
				ma= todosmodelos.Tamax(parent=kpadre,nombre=cam["nombre"],preba=pb,preing=pig)
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
				if self.existeen(["id","nombre","preba","preing"],cam) or not self.loncadeen(["nombre"],[80],cam):
					self.errorcomp("error en campos")
					return
				try:
					id=int(cam["id"])
					pb=float(cam["preba"])
					pig=float(cam["preing"])
				except:
					self.errorcomp("id o número de personas erróneo %d" % id)
					return
				x=todosmodelos.Tamax.get_by_id(id,parent=kpadre)
				if not x:
					self.errorcomp("No se puede encontrar id %d" % id)
				x.populate(nombre=cam["nombre"],preba=pb,preing=pig)
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
				x=todosmodelos.Tamax.get_by_id(id,parent=kpadre)
				if x:
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					break
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")

class clOtros(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if  not self.objjson.has_key("datos") and not type(self.objjson["datos"]) == list:
			self.errornor("error en datos")
			return
		datos=self.objjson["datos"]
		ancestor_key= self.session['usuario'].tienda
		ope=self.objjson["ope"]
		if ope=="ins":
			self.devol=[]
			self.numd=0
			va=["nombre","descrip","sal"]
			tamm=[80,200,80]
			for cam in datos:
				if not self.existeen(["nombre","descrip","sal","tama","tapb","tapi"],cam) or not self.loncadeen(va,tamm,cam):
					self.errorcomp("error en campos")
					return
				if not cam["sal"]=="000":
					nsalsa=cam["sal"]
				else:
					nsalsa=""
				if cam["tama"]=='v':
					ta=todosmodelos.Tamax(nombre='Varios',preba=0,preing=0)
				else:
					try:
						pb=float(cam["tapb"])
						pri=float(cam["tapi"])
						ta=todosmodelos.Tamax(nombre='Unico',preba=pb,preing=pri)
					except:
						self.errorcomp("precios tama o salsa erróneo")
						return
				slugurl=slugify(cam["nombre"])
				hayotr=todosmodelos.Otrosx.query(todosmodelos.Otrosx.url==slugurl,ancestor=ancestor_key).get()
				if hayotr:
					self.errorcomp("1.3 Nombre de otrox ( %s ) no valido ya existe" % cam["nombre"])
					return
				ma= todosmodelos.Otrosx(parent=ancestor_key,nombre=cam["nombre"],descrip=cam["descrip"],nomsalsa=nsalsa,tama=ta,url=slugurl)
				k=ma.put()
				if k:
					self.devol.append((k.integer_id(),slugurl))
					self.numd+=1
				else:
					self.errorcomp("no se pudo grabar.")
			self.ok(self.devol,1)
		elif ope=="mod":
			self.devol=[]
			self.numd=0
			va=["nombre","descrip","sal"]
			tamm=[80,200,80]
			for cam in datos:
				if not self.existeen(["id","nombre","descrip","sal","tama","tapb","tapi"],cam) or not self.loncadeen(va,tamm,cam):
					self.errorcomp("Faltan campos")
					return
				try:
					id=int(cam["id"])
					pb=float(cam["tapb"])
					pri=float(cam["tapi"])
				except:
					self.errorcomp("id,salsa o precios erróneo")
					return
				x= todosmodelos.Otrosx.get_by_id(id,parent=ancestor_key)
				if not x:
					self.errorcomp("No se puede encontrar id")
					return
				bosal=False
				if cam["sal"]=="000":
					cam["sal"]=""
					if len(x.nomsalsa)>0:
					# and cam["sal"]=="000":
						bosal=True
					#cam["sal"]=""
				botama=False
				if cam["tama"]=='v':
					ta=todosmodelos.Tamax(nombre='Varios',preba=0,preing=0)
				else:
					ta=todosmodelos.Tamax(nombre='Unico',preba=pb,preing=pri)
					if x.tama.nombre=='Varios':
						botama=True
				slugurl=cam["nombre"]
				if x.nombre == cam["nombre"] and x.descrip==cam["descrip"] and x.nomsalsa ==  cam["sal"] and ta.nombre == x.tama.nombre and ta.preba == x.tama.preba and ta.preing == x.tama.preing:
					k=x.key
				else:
					if not x.nombre == cam["nombre"]:
						slugurl=slugify(cam["nombre"])
						hayotr=todosmodelos.Otrosx.query(todosmodelos.Otrosx.url==slugurl,ancestor=ancestor_key).get()
						if hayotr:
							self.errorcomp("1.3 Nombre de otrox ( %s ) no valido ya existe" % cam["nombre"])
							return
						x.url=slugurl
						x.nombre=cam["nombre"]
					
					#x.populate(nombre=cam["nombre"],descrip=cam["descrip"],nomsalsa=cam["sal"],tama=ta)

					x.descrip=cam["descrip"]
					x.nomsalsa=cam["sal"]
					x.tama=ta
					k=x.put()
				if k:
					self.devol.append((k.integer_id(),slugurl))
					self.numd+=1
					if bosal or botama:
						lids=[]
						if bosal:					
							sals=todosmodelos.Salsas.query(ancestor=x.key)
							for us in sals.iter(keys_only=True):
								lids.append(us)
						if botama:
							tms=todosmodelos.Tamax.query(ancestor=x.key)
							for us in tms.iter(keys_only=True):
								lids.append(us)
						todosmodelos.ndb.delete_multi(lids)
				else:
					self.errorcomp("no se pudo grabar")
					return
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
				x= todosmodelos.Otrosx.get_by_id(id,parent=ancestor_key)
				if x:
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					return
				igs=todosmodelos.Ingredientes.query(ancestor=x.key)
				for us in igs.iter(keys_only=True):
					lids.append(us)
				if len(x.nomsalsa)>0:
					sals=todosmodelos.Salsas.query(ancestor=x.key)
					for us in sals.iter(keys_only=True):
						lids.append(us)
				if x.tama.nombre=='Varios':
					tms=todosmodelos.Tamax.query(ancestor=x.key)
					for us in tms.iter(keys_only=True):
						lids.append(us)
				uo=todosmodelos.UnOtrosx.query(ancestor=x.key)
				for iuo in uo: #.iter(keys_only=True):
					if iuo.keyimagen:
						lids.append(iuo.keyimagen)
					lids.append(iuo.key)
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")

class verTodos(baserequest.BaseHandler):
	def get(self):
		mise = self.session.get('usuario')
		if not mise:
			self.response.out.write(json.dumps({"error":u"No hay sesión de usuario"},ensure_ascii=False))
			return
		ancestor_key= mise.tienda
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
			lisotrx.append([int(id),i.nombre,i.descrip,haysal,[i.tama.nombre,i.tama.preba,i.tama.preing],"Listar",i.url])
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
		self.response.out.write(json.dumps({"ok":"ok","otrosx":lisotrx,"unotrosx":jsuotrx,"salsasx":jssalx,"ingresx":jsingx,"tamax":jstamx},ensure_ascii=False))