#!/usr/bin/python
# -*- coding: utf-8 -*-
import datetime
import json
from modulospy import baserequest
from modelos import todosmodelos
import imgs3 as Img

class clOferta(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if  not self.objjson.has_key("datos"):
			self.errornor("error en datos")
			return
		ope=self.objjson["ope"]
		datos=self.objjson["datos"]
		self.ancestor_key= self.session['usuario'].tienda
		if ope=="ins":
			reco=self.comprobar(datos)
			if reco:
				try:
					okofe=self.grab_pro_trans(datos,reco[0],reco[1],reco[2],False)
					self.ok((okofe[0],okofe[1]),okofe[2])
				except Exception as e:
					self.errornor("Error al grabar oferta=%s" % e.message)
		elif ope=="mod":
			try:
				id=int(datos["id"])
			except:
				self.errornor("id erróneo")
				return
			x= todosmodelos.Oferta.get_by_id(id,parent=self.ancestor_key)
			if not x:
				self.errornor("No se puede encontrar id")
				return
			datos["pakey"]=x.key
			reco=self.comprobar(datos)
			if reco:
				try:
					okofe=self.grab_pro_trans(datos,reco[0],reco[1],reco[2],x)
					self.ok((okofe[0],okofe[1]),okofe[2])
				except Exception as e:
					self.errornor("Error al modificar oferta=%s" % e.message)
		elif ope=="del":
			lids=[]
			for i in datos:
				try:
					id=int(i)
				except:
					self.response.out.write(json.dumps({"error":"en id %d" % i,"ids":datos}))
					return
				x=False
				x=todosmodelos.Oferta.get_by_id(id,parent=self.ancestor_key)
				if x:
					if x.keyimagen:
						img=x.keyimagen.get()
						img.puntero-=1
						if img.puntero < 1:
							Img.borrarImg_cloud(img)
						else:
							img.put()
					lids.append(x.key)
					uoQry=todosmodelos.ofertadetalle.query(ancestor=x.key)
					lids.extend([d for d in uoQry.iter(keys_only=True)])
					#for d in uoQry.iter(keys_only=True):
					#	lids.append(d)
				else:
					self.response.out.write(json.dumps({"error":"al append id","ids":datos}))
					break
			if x:
				todosmodelos.ndb.delete_multi(lids)
				self.ok("ok eliminados")
	@todosmodelos.ndb.transactional
	def grab_pro_trans(self,datos,cdias,nuproduc,dess,ofe):
		inser=False
		if not ofe:
			inser=True
			ofe=todosmodelos.Oferta(parent=self.ancestor_key,nombre=datos["nombre"],descrip=datos["descrip"],fecdes=datos["fecdes"],fechas=datos["fechas"],horde=datos["hordes"],horh=datos["horhas"],dias=cdias,localodomi=datos["loodo"],ofertaenart=datos["ofen"],numofer=datos["numofe"],preciofijo=datos["prefijo"],descuento=datos["dese"],eurosoporcen=datos["desp"],increm=datos["ince"],numproduc=nuproduc,grupo=datos["grupo"])
		else:
			ofe.populate(nombre=datos["nombre"],descrip=datos["descrip"],fecdes=datos["fecdes"],fechas=datos["fechas"],horde=datos["hordes"],horh=datos["horhas"],dias=cdias,localodomi=datos["loodo"],ofertaenart=datos["ofen"],numofer=datos["numofe"],preciofijo=datos["prefijo"],descuento=datos["dese"],eurosoporcen=datos["desp"],increm=datos["ince"],numproduc=nuproduc,grupo=datos["grupo"])
		okofe=ofe.put()
		aid=[]
		if nuproduc > 0:
			i=0
			for art in datos["produc"]:
				if inser or art["oper"] == "ins":
					if art["tp"]==0:
						articu=todosmodelos.ofcondPizza(parent=okofe,tipoproducto=0,descuento=dess[i][0],eurosoporcen=dess[i][1],numofer=art["custom"]["acc"],tama=art["tamas"],masa=art["masas"],idtipo=art["artis"],condiing=art["ingres"]["condiing"],numing=art["ingres"]["numing"])
					elif art["tp"]==1:
						articu=todosmodelos.ofcondOtro(parent=okofe,tipoproducto=1,descuento=dess[i][0],eurosoporcen=dess[i][1],numofer=art["custom"]["acc"],idtipo=art["artis"],idp=art["idp"],cantidad=art["custom"]["cantidad"])
					elif art["tp"]==2:
						articu=todosmodelos.ofcondComplex(parent=okofe,tipoproducto=2,descuento=dess[i][0],eurosoporcen=dess[i][1],numofer=art["custom"]["acc"],tama=art["tamas"],idtipo=art["artis"],condiing=art["ingres"]["condiing"],numing=art["ingres"]["numing"],idp=art["idp"])
					k=articu.put()
					aid.append((k.integer_id(),art["nid"]))
				elif art["oper"] == "mod":
					if art["tp"]==0:
						art["keyrec"].populate(tipoproducto=0,descuento=dess[i][0],eurosoporcen=dess[i][1],numofer=art["custom"]["acc"],tama=art["tamas"],masa=art["masas"],idtipo=art["artis"],condiing=art["ingres"]["condiing"],numing=art["ingres"]["numing"])
					elif art["tp"]==1:
						art["keyrec"].populate(tipoproducto=1,descuento=dess[i][0],eurosoporcen=dess[i][1],numofer=art["custom"]["acc"],idtipo=art["artis"],idp=art["idp"],cantidad=art["custom"]["cantidad"])
					elif art["tp"]==2:
						art["keyrec"].populate(tipoproducto=2,descuento=dess[i][0],eurosoporcen=dess[i][1],numofer=art["custom"]["acc"],tama=art["tamas"],idtipo=art["artis"],condiing=art["ingres"]["condiing"],numing=art["ingres"]["numing"],idp=art["idp"])
					k=art["keyrec"].put()
					aid.append((k.integer_id(),art["nid"]))
				else:
					art["keyrec"].key.delete()
					aid.append(("del",art["nid"]))
				i+=1
		return (okofe.integer_id(),okofe.urlsafe(),aid)
	def comprobar(self,datos):
		va=["nombre","descrip","feho","dias","loodo","ofen","numofe","prefijo","dese","desp","ince","produc","grupo"]
		#feho:fe,dias:diasv,loodo:plm.locodomi.sel,ofen:plm.ped_pro.sel,numofe:numofe,prefijo:pref[1],dese:desE[1],desp:desP[1],ince:inc[1],produc:pjson
		if not self.existeen(va,datos) or len(datos["nombre"])<2 or len(datos["descrip"])<2 or not self.existeen(["feh","fed","hed","heh"],datos["feho"]) or not type(datos["produc"]) == list:
			self.errornor("1 faltan campos")
			return False
		try:
			datos["grupo"]=datos["grupo"][:80]
			datos["loodo"]=(int(datos["loodo"]) == 0)
			datos["ofen"]=(int(datos["ofen"]) == 0)
			datos["numofe"]=int(datos["numofe"])
			datos["prefijo"]=float(datos["prefijo"])
			datos["dese"]=float(datos["dese"])
			datos["desp"]=(int(datos["desp"])==0) # float(datos["desp"])
			datos["ince"]=int(datos["ince"])

			datos["fecdes"]=datetime.date(int(datos["feho"]["fed"][0]),int(datos["feho"]["fed"][1]),int(datos["feho"]["fed"][2]))
			datos["fechas"]=datetime.date(int(datos["feho"]["feh"][0]),int(datos["feho"]["feh"][1]),int(datos["feho"]["feh"][2]))
			datos["hordes"]=datetime.time(int(datos["feho"]["hed"][0]),int(datos["feho"]["hed"][1]))
			datos["horhas"]=datetime.time(int(datos["feho"]["heh"][0]),int(datos["feho"]["heh"][1]))
		except:
			self.errornor("Error en parseo de datos")
			return False
		if datos["fechas"] < datos["fecdes"]:
			self.errornor("Error en Fechas, fecha Hasta debe ser mayor que fecha Desde.")
			return False
		if datos["horhas"] <= datos["hordes"]:
			self.errornor("Error en Horas, hora Hasta debe ser mayor que hora Desde.")
			return False
		#cdesc=max(deseu,despor)
		if  (datos["ofen"] and datos["numofe"]<2) or ( not datos["ofen"] and datos["numofe"]==3):
			if datos["prefijo"]==0:
				self.errornor("Debes de introducir un precio fijo mayor de 0.")
				return False
		elif not datos["ofen"] and datos["numofe"]==4 and datos["dese"]==0:
				self.errornor("Debes de introducir un descuento, en Euros o en porcentaje.")
				return False
		if not type(datos["dias"]) == list:
			cdias="T"
		else:
			cdias=""
			for d in datos["dias"]:
				cdias = cdias + str(d)
		nuproduc=len(datos["produc"])
		dess=[]
		if nuproduc==0 and  datos["ofen"]  and datos["numofe"] > 0:
			self.errornor(u"Error en artículos.Esta oferta necesita artículos.")
			return False
		elif nuproduc > 0:
			i=0
			for art in datos["produc"]:
				if not self.existeen(["nid","oper"],art) or not art["oper"] in ["ins","del","mod"]:
					self.errornor("1111Faltan campos en producto %d" % i)
					return False
				try:
					art["nid"]=int(art["nid"])
				except:
					self.errornor("Error en parseo de nid,tp en producto %d" % i)
					return False
				if art["oper"] != "ins":
					art["keyrec"]= todosmodelos.ofertadetalle.get_by_id(art["nid"],parent=datos["pakey"])
					if not art["keyrec"]:
						self.errornor("No se puede encontrar id en producto %d" % i)
						return False
				if art["oper"] != "del":
					if not self.existeen(["custom","tp"],art):
						self.errornor("22222Faltan campos en producto %d" % i)
						return False
					try:
						art["tp"]=int(art["tp"])
						art["custom"]["acc"]=int(art["custom"]["acc"])
						art["custom"]["de"]=float(art["custom"]["de"])
						art["custom"]["dp"]=(int(art["custom"]["dp"])==0)
						if art["tp"]==1:
							art["custom"]["cantidad"]=int(art["custom"]["cantidad"])
					except:
						self.errornor("Error en parseo de datos en producto %d" % i)
						return False
					if art["custom"]["acc"]==2 and art["custom"]["de"] == 0:
						self.errornor("Producto %d tipo pizza tiene acción Descuento; debes indicar descuento en euros o en porcentaje.")
						return False
					dess.append([art["custom"]["de"],art["custom"]["dp"]])
					if art["tp"]==0:
						if not self.existeen(["ingres","masas","tamas","artis"],art):
							self.errornor("33333Faltan campos en producto pizza %d" % i)
							return False
						if not self.existeen(["condiing","numing"],art["ingres"]) or art["ingres"]["condiing"] not in ["ma","me","ig","cu"]:
							self.errornor("111 Producto %d tipo pizza no tiene condicion ingredientes %s." % (i, art["ingres"]["condiing"]))
							return False
						art["ingres"]["numing"]=int(art["ingres"]["numing"])

						art["masas"]=self.aconverint(art["masas"])
						art["tamas"]=self.aconverint(art["tamas"])
						art["artis"]=self.aconverint(art["artis"])
					elif art["tp"]==1:
						if not self.existeen(["idp"],art):
							self.errornor("44444 Faltan campos en producto pizza %d" % i)
							return False
						art["idp"]=int(art["idp"])
						art["artis"]=self.aconverint(art["artis"])
					elif art["tp"]==2:
						if not self.existeen(["ingres","artis","idp"],art):
							self.errornor("555555Faltan campos en producto complex %d" % i)
							return False
						if not self.existeen(["condiing","numing"],art["ingres"]) or not art["ingres"]["condiing"] in ["ma","me","ig","cu"]:
							self.errornor("Producto %d tipo complex no tiene condicion ingredientes." % i)
							return False
						art["idp"]=int(art["idp"])
						art["ingres"]["numing"]=int(art["ingres"]["numing"])
						art["artis"]=self.aconverint(art["artis"])
						if not "tamas" in art:
							art["tamas"]=[]
						else:
							art["tamas"]=self.aconverint(art["tamas"])
					else:
						self.errornor("Error en tipo de producto en producto %d" % i)
						return False
				else:
					dess.append(False)
				i+=1
		return (cdias,nuproduc,dess)


class verTodos(baserequest.BaseHandler):
	def get(self):
		mise = self.session.get('usuario')
		if not mise:
			self.response.out.write(json.dumps({"error":u"No hay sesión de usuario"},ensure_ascii=False))
			return
		ancestor_key= mise.tienda
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
		self.response.out.write(json.dumps({"ok":"ok","ofer":lisofr},ensure_ascii=False))