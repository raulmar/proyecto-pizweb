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
			padre=todosmodelos.Otros.get_by_id(idpadre,parent=ancestor_key)
			if not padre:
				self.errornor("idpadre no existe")
				return
			kpadre=padre.key
		else:
			self.errornor("padre erróneo")
			return
		ope=self.objjson["ope"]
		if ope=="ins":
			va=["nombre","descrip"]
			ta=[80,200]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["nombre","descrip","precio","grupo"],cam) or not self.loncadeen(va,ta,cam):
					self.errorcomp("error en campos")
					return
				try:
					pre=float(cam["precio"])
					gr=cam["grupo"][:80]
				except: # ValueError as e:
					self.errorcomp("precio, id") # %s" % e)
					return
				uot= todosmodelos.UnOtros(parent=kpadre,nombre=cam["nombre"],descrip=cam["descrip"],grupo=gr,precio=pre)
				k=uot.put()
				if k:
					self.devol.append([k.integer_id(), k.urlsafe()])
					self.numd+=1
					#self.ok(k.integer_id(), k.urlsafe())
				else:
					self.errorcomp("no se pudo grabar.")
			self.ok(self.devol,1)
		elif ope=="mod":
			va=["nombre","descrip"]
			ta=[80,200]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(["id","nombre","descrip","precio","grupo"],cam) or not self.loncadeen(va,ta,cam):
					self.errorcomp("error en campos")
					return
				try:
					pre=float(cam["precio"])
					gr=cam["grupo"][:80]
					id=int(cam["id"])
				except: # ValueError as e:
					self.errorcomp("precio, id") # %s" % e)
					return
				x= todosmodelos.UnOtros.get_by_id(id,parent=kpadre)
				if not x:
					self.errorcomp("No se puede encontrar id")
					return
				x.populate(nombre=cam["nombre"],descrip=cam["descrip"],grupo=gr,precio=pre)
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
					self.response.out.write(json.dumps({"error":"i=%d" % i,"ids":ids}))
					return
				x=False
				x= todosmodelos.UnOtros.get_by_id(id,parent=kpadre)
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
					self.response.out.write(json.dumps({"error":"al append id","ids":ids}))
					return
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
			va=["nombre","descrip"]
			ta=[80,200]
			self.devol=[]
			self.numd=0
			for cam in datos:
				if not self.existeen(va,cam) or not self.loncadeen(va,ta,cam):
					self.errorcomp("error en campos")
					return
				slugurl=slugify(cam["nombre"])
				hayotr=todosmodelos.Otros.query(todosmodelos.Otros.url==slugurl,ancestor=ancestor_key).get()
				if hayotr:
					self.errorcomp("1.3 Nombre de otro ( %s ) no valido ya existe" % cam["nombre"])
					return
				ma= todosmodelos.Otros(parent=ancestor_key,nombre=cam["nombre"],descrip=cam["descrip"],url=slugurl)
				k=ma.put()
				if k:
					self.devol.append((k.integer_id(),slugurl))
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
					self.errorcomp("Faltan campos")
					return
				try:
					id=int(cam["id"])
				except:
					self.errorcomp("id erróneo")
					return
				x= todosmodelos.Otros.get_by_id(id,parent=ancestor_key)
				if not x:
					self.errorcomp("No se puede encontrar id")
					return
				if not x.nombre == cam["nombre"]:
					slugurl=slugify(cam["nombre"])
					hayotr=todosmodelos.Otros.query(todosmodelos.Otros.url==slugurl,ancestor=ancestor_key).get()
					if hayotr:
						self.errorcomp("1.3 Nombre de otro ( %s ) no valido ya existe" % cam["nombre"])
						return
					x.url=slugurl
					x.nombre=cam["nombre"]
				else:
					slugurl=cam["nombre"]
				x.descrip=cam["descrip"]
				k=x.put()
				if k:
					self.devol.append((k.integer_id(),slugurl))
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
				x= todosmodelos.Otros.get_by_id(id,parent=ancestor_key)
				if x:
					lids.append(x.key)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					return
				uo=todosmodelos.UnOtros.query(ancestor=x.key)
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
		otrosQry = todosmodelos.Otros.query(ancestor=ancestor_key).order(todosmodelos.Otros.nombre)
		lisotr=[]
		jsuotr={}
		for i in otrosQry:
			id=i.key.id()
			lisotr.append([id,i.nombre,i.descrip,"Listar",i.url])
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
		self.response.out.write(json.dumps({"ok":"ok","otros":lisotr,"unotros":jsuotr},ensure_ascii=False))