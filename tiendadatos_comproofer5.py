#!/usr/bin/python
# -*- coding: utf-8 -*-
import webapp2
import json
import cgi
import datetime
from time import time
#from google.appengine.api import memcache
#from google.appengine.api import urlfetch
from modelos import todosmodelos
from modulospy import clientes2 as Clien
from modulospy import modpaypal, modpagantis,utils,modsocial
import os


#self.response.headers.add_header("Access-Control-Allow-Origin", "*")
"""country = self.request.headers.get('X-AppEngine-Country')
        if not country == "US" and not country == "" and not country == None: # The last two handle local development
            self.redirect('international_holding_page')
            logging.info(country)
            https://developers.google.com/appengine/docs/python/"""

class MainReal(utils.BaseHandler):
	@utils.tienda_required
	def get(self, *args, **kwargs):
		#self.response.out.write("file=%s, normpathn=%s, dirname=%s" % (__file__,os.path.normpath("C:\Users\Viri\Proyectos Gae\Proyectos GAE Python3\\tienda_usuario"),os.path.dirname(__file__)))
		#return
		hh=utils.fhorario(self.res)
		mpros="Pizzas"
		for i in self.res["otros"]:
			mpros+=", %s" % i[1]
		for i in self.res["otrosx"]:
			mpros+=", %s" % i[1]
		template_values = {"fechahoy":hh["fechahoy"],"diahoy":hh["diahoy"],"hdias":hh["hdias"],"hresto":hh["hresto"],'titulo':"Pide %s a Domicilio y para Recoger por Internet. Ofertas exclusivas - de %s" % (mpros,self.res["tienda"]["nombre"]) }
		self.render_tplt('/templates/unatienindex7.html',template_values)

class ComprobarOferta(utils.BaseHandler):
	def post(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			self.resjsonerror("No hay tienda en url")
			return
		self.reslisjson=utils.list_json(nomtien)
		self.res=self.reslisjson[0]
		if not self.res:
			self.resjsonerror("No existe tienda %s" % nomtien)
			return
		if not self.res["tienda"]["act"]:
			self.resjsonerror("En estos momentos la página está en mantenimiento. Prueba mas tarde. ")
			return
		try:
			self.objjson=json.loads(cgi.escape(self.request.body))
		except Exception as e:
			self.resjsonerror("no hay objeto json")
			return
		pago=self.objjson.get("pago")
		if pago:
			self.modoPago(pago)
		else:
			self.comprobar_direc_pedido()

	def modoPago(self,pago):
		try:
			pedido=self.session.get("pedido")
			detalle=pedido["detalleapi"]
			importe=pedido["datped"]["importe"]
			hp=int(time())*1000
			dt=int(pedido["datped"]["horaped"] + (5*60*1000))
			if dt < hp:
				self.resjsonerror("tiempoexcedido")
				return
		except Exception as e:
			self.resjsonerror(u"no se puede obtener pedido en sesión de usuario = %s" % e.message)
			return
		resp=self.helloTienda()
		if resp[0]==True:
			if pago == "paypal":
				self.pagar_con_paypal()
			elif pago == "pagantis":
				self.pagar_con_pagantis()
			elif pago== "tienda":
				self.pagar_en_tienda()
		else:
			self.resjsonerror(resp[1])

	def pagar_en_tienda(self):
		resp=self.env_pago_grab_pedido(1,self.reslisjson[1])
		if not resp[0] or resp[0]==False:
			self.resjsonerror(resp[1])
		else:
			self.resjsonok("tiendaok")

	def pagar_con_paypal(self):
		paypal=modpaypal.clapi(pedido,self.res["tienda"],self.reslisjson[1],self.uri_for('returnurl', nom_tien=self.res["tienda"]["url_tien"], _full=True),self.uri_for('cancelurl', nom_tien=self.res["tienda"]["url_tien"], _full=True) )
		rp=paypal.hacerPayment()
		if rp:
			self.session["ec_token"]=rp["ec_token"]
			self.resjsonok("redirect",resto=rp["redirect"])
		else:
			self.resjsonerror(rp.error)

	def pagar_con_pagantis(self):
		tokpag="pagantis-%d" % int(time()*1000)
		paypal=modpagantis.formuPagantis(self.res["tienda"],self.reslisjson[1],pedido,self.uri_for('returnurlpag', nom_tien=self.res["tienda"]["url_tien"], _full=True,token=tokpag),self.uri_for('cancelurlpag',nom_tien=self.res["tienda"]["url_tien"], _full=True,token=tokpag),tokpag )
		rp=paypal.getFormulario()
		if rp:
			self.session["tok_pag"]=tokpag
			self.session["order_id"]=rp["inputs"][0]["value"]
			self.resjsonok("formu",resto=rp)
		else:
			self.resjsonerror(rp.error)

	def comprobar_direc_pedido(self):
		#if not "detalle" in self.objjson:
		#	self.resjsonerror(u"No hay detalle")
		#	return
		datped=self.objjson.get("datped")
		if not datped or not self.objjson.get("detalle") or not self.existeen(("pedidoen","telefono","horaped","horaent","dif_hped_hent","comen","importe"),datped) or ( datped["pedidoen"]==2 and not "callenom" in datped and not self.existeen(("nom","muni","via","num","codpos","bloq","piso","esca","letra"),datped["callenom"])):
			self.resjsonerror(u"Faltan campos")
			return
		try:
			pedidoen=int(datped["pedidoen"])
			tele=int(datped["telefono"])
			#horaped=int(datped["horaped"])
			#horaent2=int(datped["horaent"])
			dif_hped_hent=int(datped["dif_hped_hent"])
			impor=float(datped["importe"])
		except Exception as e:
			self.resjsonerror(u"Error en campos numéricos %s" % e.message)
			return
		datped["horaped"]=int(time())*1000
		horaent2=datped["horaent"]= datped["horaped"]+dif_hped_hent
		#self.mitz=utils.GMT1()
		self.mitz=utils.USOHORARIO[self.res["tienda"]["usohorario"]]()
		self.ahora=datetime.datetime.now(self.mitz)
		if pedidoen>1:
			tincre=self.res["tienda"]["ti_domicilio"]*60*1000
		else:
			tincre=self.res["tienda"]["ti_recoger"]*60*1000
		if horaent2 < ( datped["horaped"]+tincre ):
			self.resjsonerror(u"Error en la hora de entrega horaent2=%d, dif_hped_hent=%d, tincre=%d" % (horaent2,dif_hped_hent,tincre ))
			return
		diasse=("LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO","FESTIVOS")
		
		fechahoy=str(self.ahora.day)+"/"+str(self.ahora.month)+"/"+str(self.ahora.year)
		if not self.res["tienda"]["hrs"].has_key(fechahoy):
			fechahoy=diasse[self.ahora.weekday()]
			if not self.res["tienda"]["hrs"].has_key(fechahoy):
				self.resjsonerror(u"no hay horhoy fechahoy="+fechahoy)
				return
		horhoy=self.res["tienda"]["hrs"][fechahoy]
		
		if horhoy["tipo"]==2:
			self.resjsonerror(u"Hoy "+fechahoy+" estamos Cerrado")
			return
		
		self.horaent=datetime.datetime.fromtimestamp(horaent2/1000,self.mitz)
		horaentaux=self.horaent.strftime("%H:%M")
		#tzinfo=GMT1()
		#ahorason=datetime.datetime.now(self.mitz).strftime("%H:%M, %z")
		ahorason=self.ahora.strftime("%H:%M, %z")
		ddd=horhoy["dmd"].split(":")
		
		horhoymd=datetime.datetime(self.ahora.year,self.ahora.month,self.ahora.day,int(ddd[0]),int(ddd[1]),tzinfo=self.mitz)
		if self.horaent<horhoymd:
			self.resjsonerror(u"00000La tienda está cerrada para esta hora de entrega: "+horaentaux+" , ahora="+ahorason)
			return
		#ahoraincre=self.ahora + datetime.timedelta(minutes=tincre/1000/60)
		ddd=horhoy["dmh"].split(":")
		horhoymh=datetime.datetime(self.ahora.year,self.ahora.month,self.ahora.day,int(ddd[0]),int(ddd[1]),tzinfo=self.mitz)+datetime.timedelta(minutes=tincre/1000/60)
		if horhoy["tipo"]==1:
			ddd=horhoy["dtd"].split(":")
			horhoytd=datetime.datetime(self.ahora.year,self.ahora.month,self.ahora.day,int(ddd[0]),int(ddd[1]),tzinfo=self.mitz)
			ddd=horhoy["dth"].split(":")
			horhoyth=datetime.datetime(self.ahora.year,self.ahora.month,self.ahora.day,int(ddd[0]),int(ddd[1]),tzinfo=self.mitz)+datetime.timedelta(minutes=tincre/1000/60)
			if self.horaent>horhoyth or (self.horaent>horhoymh and self.horaent<horhoytd ):
				self.resjsonerror(u"La tienda está 11<strong>cerrada</strong> para esta hora de entrega: "+horaentaux+" ahora son="+ahorason)
				return
		elif horhoy["tipo"]<1 and self.horaent>horhoymh:
			self.resjsonerror(u,"La tienda está 22<strong>cerrada</strong> para esta hora de entrega: "+horaentaux+" ahora son="+ahorason)
			return
		
		okpay=False
		okpagan=False
		if self.res["tienda"]["paypal"]:
			#self.session["pedido"]={"detalle":resul[2],"predefi":resul[1]}
			#self.resjsonok("paypal",resto={"detalle":resul[2],"predefi":resul[1],"paypal":self.res["tienda"]["paypal"]})
			okpay={
					"inc_des":self.res["tienda"]["paypal"]["inc_des"],
					"poroeur":self.res["tienda"]["paypal"]["poroeur"],
					"stringsuple":self.res["tienda"]["paypal"]["stringsuple"]
				}
		if self.res["tienda"]["pagantis"]:
			okpagan={
				"inc_des":self.res["tienda"]["pagantis"]["inc_des"],
				"poroeur":self.res["tienda"]["pagantis"]["poroeur"],
				"stringsuple":self.res["tienda"]["pagantis"]["stringsuple"]
			}
		sesped=self.session.get("pedido")
		detp=json.dumps(self.objjson["detalle"],ensure_ascii=False)
		if sesped and sesped.get("detallemio") == detp:
			#self.session["pedido"]["datped"]=datped
			#self.session["pedido"]["nohe"]="ho he entrado"
			self.session["pedido"]={"detallemio":detp,"datped":datped,"detalleapi":sesped.get("detalleapi")}
			self.resjsonok("ok",resto={"detalle":sesped.get("detalleapi"),"predefi":impor,"paypal":okpay,"pagantis":okpagan})
			return
		self.artsdet=[]
		for d in self.objjson["detalle"]:
			self.artsdet.append(dict(d))
		#self.artsdet=dict(self.objjson["detalle"])
		resul=self.comprobar_pedido(pedidoen)
		if not resul[0]:
			self.resjsonerror("algo mal resul0=%s" % resul[1])
		else:
			auxpre1= "%.2f" % resul[1]
			auxpre2= "%.2f" % impor
			if not auxpre1==auxpre2:
				self.resjsonerror("importes no coinciden impor=%s, resul1=%s" % (auxpre2,auxpre1))
			return
		#resul[2]["predefi"]=resul[1]
		#self.session["pedido"]=resul[2]
		#if okpay or okpagan:
		"""sesped=self.session.get("pedido")
		if sesped and sesped.get("detallemio") == detp and self.session.get("ec_token"):
			regtra=todosmodelos.Transferencia.query(todosmodelos.Transferencia.token_ec==self.session.get("ec_token")).get()
			if regtra:
				if regtra.estado=="created" or regtra.estado=="canceled":
					self.session["pedido"]["datped"]=datped
					self.resjsonok("redirect",resto=regtra.redirect) 
					#self.session.get("redirect"))
					return
				elif regtra.estado=="approved":
					self.resjsonerror("Este pedido ya ha sido completado con Paypal.")
					return"""
		self.session["pedido"]={"detallemio":detp,"datped":datped,"detalleapi":resul[2] }
		self.resjsonok("ok",resto={"detalle":resul[2],"predefi":resul[1],"paypal":okpay,"pagantis":okpagan})
		#else:
		#	self.resjsonok("ok",resto={"resul":resul[1],"enviado":"pedido enviado no hay pago paypal"})
		return

	def existeen(self,va,dat):
		for v in va:
			if not v in dat:
				return False
		return True
	def com_precio_piz(self,ar):
		amata=None
		matax=ar["mata"]
		for i in self.res["matas"]:
			if i[0]==matax:
				amata=i
				amasa=i[1]
				atama=i[2]
				nommasa=""
				nomtama=""
				for m in self.res["masas"]:
					if m[0]==amasa:
						nommasa=m[1]
						break
				for m in self.res["tamas"]:
					if m[0]==atama:
						nomtama=m[1]
						break
				break
		if amata == None:
			return {"ok":False,"error":u"Error al buscar masa tamaño" }
		preing=amata[4]
		preba=amata[3]
		mitades=ar["mitades"]
		sm=mitades[0]["salsa"]
		queso="con queso" if mitades[0]["queso"] else 'sin queso'
		numing2=numing=0
		nomsal="Sin salsa"
		if sm:
			numing=-1
			for i in self.res["sal"]:
				if i[0]==sm:
					numing=i[2]
					nomsal="salsa %s" % i[1]
					break
			if numing<0:
				return {"ok":False,"error":u"Error al salsa mitad 1"}

	
		nommitad="Al Gusto %s, %s" % (queso,nomsal)
		
		if mitades[0]["espe"]:
			esp=mitades[0]["espe"]
			mitad=False
			for i in self.res["piz"]:
				if i[0]==esp:
					mitad=True
					nommitad="%s %s, %s" % (i[1],queso,nomsal)
					break
			if not mitad:
				return {"ok":False,"error":u"Error al buscar especialidad mitad 1"}
		#numing=self.res["sal"][int(mitades[0]["salsa"])][2]
		if len(mitades)>1 and mitades[1]["salsa"]:
			sm=mitades[1]["salsa"]
			numing2=-1
			nomsal="Sin salsa"
			for i in self.res["sal"]:
				if i[0]==sm:
					numing2=i[2]
					nomsal="salsa %s" % i[1]
					break
			if numing2<0:
				return {"ok":False,"error":u"Error al salsa mitad 2"}
		numing+=numing2
		nomingres=""
		for ing in mitades[0]["ings"]:
			for i in self.res["ingres"]:
				if i[0]==ing:
					numing+=i[2]
					nomingres+=", %s" % i[1]
					break
		nommitad = "%s%s" % (nommitad,nomingres)
		if len(mitades)>1:
			queso="con queso" if mitades[1]["queso"] else 'sin queso'
			nommita="Mitad1 "+nommitad
			nomingres=""
			for ing in mitades[1]["ings"]:
				for i in self.res["ingres"]:
					if i[0]==ing:
						numing+=i[2]
						nomingres+=", %s" % i[1]
						break
			if mitades[1]["espe"]:
				mitad=False
				esp=mitades[1]["espe"]
				for i in self.res["piz"]:
					if i[0]==esp:
						mitad=True
						nommita+=". Mitad2 %s %s, %s%s" % (i[1],queso,nomsal,nomingres)
						break
				if not mitad:
					return {"ok":False,"error":u"Error al buscar especialidad mitad 2"}
			else:
				nommita+=". Mitad2 Al Gusto %s, %s%s" % (queso,nomsal,nomingres)
			
			numing=numing/2
		else:
			nommita=nommitad
		return {
			"ok":True,
			"precio":(numing*preing)+preba,
			"numing":numing,
			"amata":amata,
			"amasa":amasa,
			"atama":atama,
			"nombre":"Pizza %s %s %s" % (nomtama,nommasa,nommita)
		}


	def com_precio_otro(self,ar):
		#ax=self.res["otros"][ar["indotr"]][0]
		#losunotr=self.res["unotros"][str(ax)]
		losunotr=self.res["unotros"][str(ar["idotr"])]
		xx=ar["unotr"]
		for i in losunotr:
			if xx==i[0]:
				return {"ok":True,"precio":i[3],"nombre":i[1]}
		return {"ok":False,"error":u"No se encuentra artículo"}
	def com_precio_otrxx(self,ar):
		#pro=self.res["otrosx"][int(ar["indotrx"])]
		#pro[0]=str(pro[0])
		pro=None
		xx=ar["idotrx"]
		for i in self.res["otrosx"]:
			if i[0]==xx:
				pro=i
				nombre=i[1]
				if ar["unotrx"]:
					losunotrx=self.res["unotrosx"][str(xx)]
					xx=ar["unotrx"]
					for i in losunotrx:
						if xx==i[0]:
							nombre+=" "+i[1]
							break
				else:
					nombre+= " Al Gusto"
				break
		if pro == None:
			return {"ok":False,"error":"no encuentro otrox"}
		keypro=str(pro[0])
		if pro[4][0]=="Unico":
			preba=pro[4][1]
			preing=pro[4][2]
		else:
			eta=None
			if self.res["tamax"].has_key(keypro):
				xx=ar["tamax"]
				for i in self.res["tamax"][keypro]:
					if i[0]==xx:
						eta=i
						break
			if eta == None:
				return {"ok":False,"error":"No encuentro tamax"}
			preba=eta[2]
			preing=eta[3]
			nombre+=" %s, " % eta[1]
		numing=0
		if ar.has_key("salsa"):
			numing=None
			if self.res["salsasx"].has_key(keypro):
				xx=ar["salsa"]
				for i in self.res["salsasx"][keypro]:
					if i[0]==xx:
						numing=i[2]
						nomsalsax=i[1]
						break
			if numing == None:
				return {"ok":False,"error":"No encuentro salsax %s keypro=%s" % (str(xx),str(keypro))}
			nombre+=" %s %s" % (pro[3], nomsalsax)
		if self.res["ingresx"].has_key(keypro):
			axing=self.res["ingresx"][keypro]
			nomingres=""
			for ing in ar["ings"]:
				for i in axing:
					if i[0]==ing:
						numing+=i[2]
						nomingres+=", %s" % i[1]
						break
			nombre+=nomingres
		else:
			return {"ok":False,"error":"No encuentro ingrex"}
		preba+=numing*preing
		return {"ok":True,"precio":preba,"numing":numing,"preing":preing,"nombre":nombre,"pro":pro}

	def artpizza(self,ar,mio):
		cpr=self.com_precio_piz(ar)
		if not cpr["ok"]:
			return (False,cpr["error"])
		if len(mio["masas"]) > 0:
			try:
				mio["masas"].index(cpr["amasa"])
			except Exception as e:
				return (False,"Error al buscar masa=%s" % e.message)
		if len(mio["tamas"]) > 0:
			try:
				mio["tamas"].index(cpr["atama"])
			except Exception as e:
				return (False,u"Error al buscar tamaño=%s" % e.message)
		mitades=ar["mitades"]
		if len(mio["artis"]) > 0:
			if mitades[0]["espe"]:
				try:
					mio["artis"].index(mitades[0]["espe"])
				except Exception as e:
					return (False,"Error al buscar especialidad pizza mitad 1=%s" % e.message)
			if mitades[1]["espe"]:
				try:
					mio["artis"].index(mitades[1]["espe"])
				except Exception as e:
					return (False,"Error al buscar pizza mitad 2=%s" % e.message)
		
		precio=cpr["precio"]
		numing=cpr["numing"]
		co=mio["ingres"]["condiing"]
		numi=mio["ingres"]["numing"]
		if co=="ma":
			if numing<=numi:
				return (False,"ingredientes de pizza tiene %f y debe tener mas de %f" % (numing,numi))
		elif co=="me":
			if numing>=numi: 
				return (True,precio,(numing-numi+1)*amata[4],cpr["nombre"])
		elif co=="ig" and numing!=numi: 
			return (False)
		return (True,precio,0,cpr["nombre"])
	
	def artotro(self,ar,mio):
		#pro=self.res["otros"][ar["indotr"]]
		prox=ar["idotr"]
		pro=None
		nombre=None
		for i in self.res["otros"]:
			if i[0]==prox:
				pro=i
				losunotr=self.res["unotros"][str(prox)]
				xx=ar["unotr"]
				for i in losunotr:
					if xx==i[0]:
						precio=i[3]
						nombre=i[1]
						break
				break
		if pro == None or nombre == None:
			return (False,"error al buscar otros ")
		if not mio["idp"]==pro[0]:
			return (False,"No coincide la categoría del producto se necesita %s " % pro[1])
		if len(mio["artis"]) > 0:
			try:
				mio["artis"].index(ar["unotr"])
			except Exception as e:
				return (False,"Error al buscar id de %s = %s" % (pro[1],e.message))
		if ar["canti"] > mio["custom"]["cantidad"]:
			return (False,"la cantidad  de %s es de %d y deberia de ser %d " % (pro[1],ar["canti"],mio["custom"]["cantidad"] ))
		return (True,precio,0,nombre)

	def artotrxx(self,ar,mio):
		#pro=self.res["otrosx"][int(ar["indotrx"])]
		cpr=self.com_precio_otrxx(ar)
		if not cpr["ok"]:
			return (False,cpr["error"])
		pro=cpr["pro"]
		precio=cpr["precio"]
		numing=cpr["numing"]
		preing=cpr["preing"]

		if not mio["idp"]==pro[0]:
			return (False,"No coincide la categoría del producto se necesita %s " % cpr["nombre"])
		if ar["unotrx"] and len(mio["artis"]) > 0:
			try:
				mio["artis"].index(ar["unotrx"])
			except Exception as e:
				return (False,"Error al buscar id de %s = %s" % (cpr["nombre"],e.message))
		if len(mio["tamas"]) > 0:
			try:
				mio["tamas"].index(ar["tamax"]) 
				# self.res["tamax"][str(pro[0])][int(ar["tamax"])][0])
			except Exception as e:
				return (False,u"Error al buscar tamaño de %s = %s" % (cpr["nombre"],e.message))
		if self.tamax.has_key(str(pro[0])):
			atx=ar["tamas"]
			for i in self.tamax[str(pro[0])]:
				if i[0]==atx:
					nombre+= i[1]
					break
		co=mio["ingres"]["condiing"]
		numi=mio["ingres"]["numing"]
		if co=="ma":
			if numing<=numi:
				return (False,"ingredientes de %s tiene %f y debe tener mas de %f" % (cpr["nombre"],numing,numi))
		elif co=="me":
			if numing>=numi: 
				return (True,precio,(numing-numi+1)*preing,cpr["nombre"])
		elif co=="ig" and numing!=numi: 
			return (False ,"el numero de indregientes de %s es de %f y debe tener %f" % (cpr["nombre"],numing,numi))
		return (True,precio,0,cpr["nombre"])

	def comprobar_pedido(self,pedidoen):
		#mires=""
		if not type(self.artsdet) == list:
			return (False,u"error en detalle no es una lista de artículos")
		diase=str(datetime.date.today().weekday()+1)
		predef=0
		comprobar_oferta_articulo=[self.artpizza,self.artotro,self.artotrxx]
		com_precio_articulo=[self.com_precio_piz,self.com_precio_otro,self.com_precio_otrxx]
		detlis=[]
		pruca=""
		while len(self.artsdet)>0:
			if not self.existeen(("articulo","det","oferta"),self.artsdet[0]):
				return (False,u"error en producto faltan campos")
			if self.artsdet[0]["oferta"]:
				numofer=self.artsdet[0]["oferta"]["numofer"]
				idofer=self.artsdet[0]["oferta"]["idofer"]
				arof=[self.artsdet.pop(0)]
				i=0
				canart=1
				while i < len(self.artsdet):
					if not self.existeen(("articulo","det","oferta"),self.artsdet[i]):
						return (False,u"error en producto faltan campos")
					if self.artsdet[i]["oferta"] and self.artsdet[i]["oferta"]["numofer"] == numofer:
						canart+=self.artsdet[i]["det"]["canti"]
						arof.append(self.artsdet.pop(i))
					else:
						i+=1
				mio=None
				
				for o in self.res["ofer"]:
					if o[0]==idofer:
						mio=o
						nombreoferta=o[1]
						if not mio[9]:
							canartof=0
							for c in mio[17]:
								if c["custom"].has_key("cantidad"):
									canartof+=c["custom"]["cantidad"]
								else:
									canartof+=1
							if canart != canartof:
								return (False,u"Se necesitan %d artículos para oferta %s y hay %d" % (canartof,mio[1],canart))
						break
				if mio == None:
					return (False,"No se encuentra id de oferta")
				if mio[8] and pedidoen>1:
					return (False,u"Oferta %s es para Recoger y el pedido es para Domicilio" % mio[1])
				if not mio[7]=="T" and mio[7].find(diase)<0:
					return (False,"Esta oferta (%s)no se puede hacer hoy" % mio[1])
				ofhd=mio[5].split(":")
				ofhh=mio[6].split(":")
				#ofhd=datetime.datetime(self.ahora.year,self.ahora.month,self.ahora.day,int(ofhd[0]),int(ofhd[1]))
				#ofhh=datetime.datetime(self.ahora.year,self.ahora.month,self.ahora.day,int(ofhh[0]),int(ofhh[1]))
				#if self.ahora<ofhd or self.ahora>ofhh:
				#	return (False,u"Hora no válida para hacer oferta %s" % mio[1])
				ofhd=datetime.datetime(self.horaent.year,self.horaent.month,self.horaent.day,int(ofhd[0]),int(ofhd[1]),tzinfo=self.mitz)
				ofhh=datetime.datetime(self.horaent.year,self.horaent.month,self.horaent.day,int(ofhh[0]),int(ofhh[1]),tzinfo=self.mitz)
				if self.horaent<ofhd or self.horaent>ofhh:
					return (False,u"Hora no válida para hacer oferta %s, es valida desde %sh. hasta %sh." % (mio[1],mio[5],mio[6]))
				impt=0
				preof=0
				prefi=0
				esprefi= (not mio[9] and mio[10]==3) or ( mio[9] and mio[10]==1)
				#lmipre=""
				maxprepro=0
				minprepro=0
				prereal=0
				if not esprefi:
					esprefi=0
				else:
					esprefi=mio[11]
				for ar in arof:
					mioo=mio[17][ar["oferta"]["indpro"]]
					comp=comprobar_oferta_articulo[int(ar["articulo"])](ar["det"],mioo)
					if not comp[0]:
						comp[1]+=" en oferta (%s)" % mio[1]
						return comp
					else:
						#mires+=str(ar["oferta"]["precio"])+","
						prereal+=comp[1]*ar["det"]["canti"]
						preof=ar["oferta"]["precio"]
						#esprefi= (not mio[9] and mio[10]==3) or ( mio[9] and mio[10]==1)
						if esprefi==0:
							
							copre=(comp[1]+comp[2])
							#*mioo["det"]["canti"]
							acc= mioo["custom"]["acc"]
							if acc==1:
								mipre=0
							else:
								mipre=copre
								if acc==2:
									if mioo["custom"]["dp"]==1:
										mipre=copre-(copre * mioo["custom"]["de"]/100)
									else:
										mipre=copre-mioo["custom"]["de"]
								if not mio[9]:
									if mio[10]==0:
										if mipre>maxprepro:
											maxprepro=mipre
										mipre=0
									elif mio[10]==1:
										if mipre<minprepro:
											minprepro=mipre
							#lmipre+=str(mipre)+" s-ac="+str(acc)+" "
						else:
							#mipre=mio[11]+comp[2]
							mipre=comp[2]
							#lmipre+=str(mipre)+" n- "
						
							#*mioo["det"]["canti"]

						#if mipre != preof and (mipre+mio[14]) != preof and (mipre+mio[14]+esprefi) != preof:
						#	return (False,"oferta ( %s ) no coincide precio en %s tiene %f y debe tener %f" % (mio[1],comp[3],preof,mipre))
						#del ar["oferta"]["idofer"]
						detlis.append({"articulo":int(ar["articulo"]),"det":ar["det"],"ofertaid":int(idofer),"ofertadet":ar["oferta"], "preart":float(ar["preart"]),"nombre":comp[3],"cant":ar["det"]["canti"],"preu":comp[1]} )
						#detlis.append(todosmodelos.Detalle(articulo=int(ar["articulo"]),det=ar["det"],ofertaid=int(idofer),ofertadet=ar["oferta"], preart=float(ar["preart"])) )
						prefi+=preof
						impt+=mipre
				impt+=esprefi-minprepro+maxprepro	
				auxpre1= "%.2f" % (impt+mio[14])
				auxpre2= "%.2f" % prefi
				if not auxpre1 == auxpre2:
					return (False,"oferta ( %s ) no coinciden precios tiene %f y debe tener %f, %s" % (mio[1],auxpre2,auxpre1,lmipre))
				detlis.append({"articulo":1000,"ofertaid":int(idofer),"nomofer":nombreoferta,"prereal":prereal,"descuento":prereal-prefi,"totofer":prefi} )
				predef+=prefi
			else:
				ar=self.artsdet.pop(0)
				#mires+=str(ar["preart"])+", "
				comp=com_precio_articulo[int(ar["articulo"])](ar["det"])
				if not comp["ok"]:
					return (False,comp["error"])
				pre=comp["precio"]*ar["det"]["canti"]
				auxpre1= "%.2f" % ar["preart"]
				auxpre2= "%.2f" % pre
				if not auxpre1 == auxpre2:
					return (False,u"No coinciden precios en bbb2222 producto %s tiene %s y debe tener %s" % (comp["nombre"],auxpre1,auxpre2))
				predef+=pre
				detlis.append({"articulo":int(ar["articulo"]),"det":ar["det"],"preart":float(ar["preart"]),"nombre":comp["nombre"],"cant":ar["det"]["canti"],"preu":comp["precio"]} )
				#detlis.append(todosmodelos.Detalle(articulo=int(ar["articulo"]),det=ar["det"],preart=float(ar["preart"])) )
		return (True,predef,detlis)
		#,mires]

class mapa(utils.respuesta):
	def get(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			utils.handle_404(self.request, self.response, {"status_int":404,"status":"No hay tienda en url"})
			return
		if not self.request.get('dir') or not self.request.get("lat") or not self.request.get('lon'):
			utils.handle_404(self.request, self.response, {"status_int":404,"status":u"Error en dirección"})
			return
		direc=self.request.get('dir')
		lat=self.request.get("lat")
		lon=self.request.get('lon')
		if len(direc)<10:
			utils.handle_404(self.request, self.response, {"status_int":404,"status":u"Error en dirección"})
			return
		try:
			lat=float(lat)
			lon=float(lon)
		except Exception as e:
			utils.handle_404(self.request, self.response, {"status_int":404,"status":u"Error en dirección"})
			return
		va={
			"nombre":nomtien,
			"direc":direc,
			"lat":lat,
			"lon":lon
		}
		self.render_tpltsin('/templates/mapa.html',va)
		#self.response.out.write(jinja_environment.get_template('/templates/mapa.html').render(res))

TEMPLATE_DATJSON="""window.server=window.server || {};window.server.datosart=%s;"""
#window.server={  sel:{{ sel }}, seli:{{ seli }}, hora:{{ hora }}, datosart:{{ resjsondu }} };
class scriptDatos(webapp2.RequestHandler):
	def get(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			self.response.set_status(404)
			return
		res=utils.list_json(nomtien)[0]
		if not res:
			self.response.set_status(404)
			return
		if not res["tienda"]["act"]:
			self.response.set_status(404)
			return
		self.response.headers['Content-Type'] = 'application/x-javascript'
		self.response.headers['Cache-control'] = 'public'
		self.response.headers['ETag'] = str(res["tienda"]["ult_mod"])
		modca=None
		#if "Cache-control" in self.request.headers:
		#	modca=self.request.headers['Cache-control']
		if "If-None-Match" in self.request.headers:
			modca=self.request.headers['If-None-Match']
		#modca=self.request.headers['Cache-control'] or self.request.headers['If-None-Match']
		del res["tienda"]["url"]
		del res["tienda"]["paypal"]
		del res["tienda"]["pagantis"]
		if not modca:
			self.response.out.write(TEMPLATE_DATJSON % json.dumps(res,ensure_ascii=False))
		elif res["tienda"]["ult_mod"] <= int(modca):
			self.response.set_status(304)
		else:
			self.response.out.write(TEMPLATE_DATJSON % json.dumps(res,ensure_ascii=False))
		#if not "Cache-control" in self.request.headers: 
		#	self.request.headers['If-Modified-Since']
		
TEMPLATE_SOCKET="""
<!DOCTYPE html>
<html>
<head>
	<style >
	body{
		margin:0;
		padding: 0;
		border:none;
		width: 0px;
		height: 0px;
	}
	</style>
	<script src='ferscroll.js'></script>
	<script>
		window.hacesfera=(function() {
			var socket;
			function inicio(fsoll){
				socket = io.connect("http://"+fsoll+":8080/");
				socket.on('news', function (data) {
					window.parent.ClPrin.esfera.mensaje(data);
					//socket.emit('my other event', { my: 'data' });
				});
			} 
			function onenviar(data) {
				socket.emit('my other event', data);
			}
			return {init:inicio,enviar:onenviar};
		})();
		window.onload=function() {
			var fsoll="%s",cargerror=%s;
			if (cargerror){
				window.parent.ClPrin.esfera.error(cargerror);
			}else {
				window.hacesfera.init(fsoll);
			}
		}
	</script>
</head>
<body>
</body>
</html>
"""

class frameSocket(webapp2.RequestHandler):
	def get(self, *args, **kwargs):
		nomtien = kwargs['nom_tien']
		if len(nomtien)<2:
			self.response.out.write(TEMPLATE_SOCKET % ("","'No hay tienda'"))
			return
		res=utils.list_json(nomtien)[0]
		if not res:
			self.response.out.write(TEMPLATE_SOCKET % ("","'No hay tienda'"))
			return
		if not res["tienda"]["act"] or not res["tienda"]["url"]:
			self.response.out.write(TEMPLATE_SOCKET % ("","'11 Tienda en mantenimiento o no hay url'"))
			return
		self.response.out.write(TEMPLATE_SOCKET % (res["tienda"]["url"],"null"))

class UntipoPro(utils.BaseHandler):
	@utils.tienda_required
	def get(self, *args, **kwargs):
		produc=kwargs['produc']
		if len(produc)<2:
			utils.handle_404(self.request, self.response, {"status_int":404,"status":"No hay tipo de producto en url"})
			return
		elotr=None
		elotrx=None
		unotro=None
		produc=produc.lower()
		seli=-1
		hh=None
		if produc=="pedido":
			hh=utils.fhorario(self.res)
			template = '/templates/pedidoa.html'
			titulo="Pedido online"
			sel=-1
		elif produc=="pizzas":
			template = '/templates/productospiz.html'
			titulo="Pizzas"
			sel=0
		elif produc=="ofertas":
			template = '/templates/ofertas2.html'
			titulo="Ofertas"
			sel=1
		else:
			for i in self.res["otros"]:
				if i[3]==produc:
					template = '/templates/producot2.html'
					elotr=i
					unotro=self.res["unotros"][str(i[0])]
					sel=2
					seli=i[0]
					titulo=i[1]
					break
			if elotr == None:
				for i in self.res["otrosx"]:
					if i[5]==produc:
						template = '/templates/producotrx2.html'
						elotrx=i
						sel=3
						seli=i[0]
						titulo=i[1]
						#self.res["unotrosx"][str(i[0])][0]
						break
				if elotrx == None:
					utils.handle_404(self.request, self.response, {"status_int":404,"status":"No hay tipo de producto en url"})
					return
		nomima="logo2.png"
		#del self.res["tienda"]["url"]
		#del self.res["tienda"]["paypal"]
		#mitz=utils.GMT1()
		mitz=utils.USOHORARIO[self.res["tienda"]["usohorario"]]()
		template_values = {'elotr': elotr,'unotro':unotro,'elotrx': elotrx,'sel':sel,'seli':seli,'hora':int(time()*1000),'hh':hh,'hhmm':datetime.datetime.now(mitz).strftime("%Y:%m:%d:%H:%M"),"singmt":datetime.datetime.now().strftime("%Y:%m:%d:%H:%M"),'titulo':"%s a Domicilio y para Recoger de %s" % (titulo, self.res["tienda"]["nombre"]) }
		self.render_tplt(template,template_values)
        #'resjsondu':json.dumps(self.res,ensure_ascii=False),
       

app = webapp2.WSGIApplication([
	webapp2.Route('/tienda/notification_pagantis', modpagantis.notification_pagantis_urlHandler),
	webapp2.Route('/tienda/<nom_tien:[^/]+>', MainReal),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/', MainReal),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/comprobarpedido', ComprobarOferta),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/mapa', mapa),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/datjson', scriptDatos),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/ferchscroll', frameSocket),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/signup', Clien.SignupHandler),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/login', Clien.LoginHandler),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/forgot', Clien.ForgotPasswordHandler),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/logout', Clien.LogoutHandler),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/<type:v|p>/<user_id:\d+>-<signup_token:.+>',Clien.VerificationHandler, name='verification'),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/returnpaypal',modpaypal.returnurlHandler, name='returnurl'),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/calcelpaypal', modpaypal.cancelurlHandler, name='cancelurl'),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/returnpagantis',modpagantis.returnurlHandler, name='returnurlpag'),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/calcelpagantis', modpagantis.cancelurlHandler, name='cancelurlpag'),
	#webapp2.Route('/tienda/<nom_tien:[^/]+>/<produc:.+>/<carac:[\/\w]*>',UntipoPro),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/logintwitter',modsocial.logintwitter),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/loginfacebook',modsocial.loginfacebook),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/sign-in-with-twitter',modsocial.returnurlHandlertw, name='returnurltw'),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/sign-in-with-facebook',modsocial.returnurlHandlerface, name='returnurlface'),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/<produc:Pizzas>/editar/ingredientes',UntipoPro),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/<produc:.+>/editar',UntipoPro),
	webapp2.Route('/tienda/<nom_tien:[^/]+>/<produc:.+>',UntipoPro)
],debug=True,config=utils.config)
app.error_handlers[404] = utils.handle_404
app.error_handlers[503] = utils.handle_404