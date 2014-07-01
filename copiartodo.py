#!/usr/bin/python
# -*- coding: utf-8 -*-
import json
from modulospy import baserequest
from modelos import todosmodelos
#from google.appengine.api import files,app_identity
import cloudstorage as gcs

BUCKET = '/prueba-imagenes'
#BUCKET = app_identity.get_default_gcs_bucket_name()

def pizzas(tiacop,mitikeypiz):
	#ancestor_keypiz= modeloPizzas.ndb.Key("Productos", "principal","pro","pizza")
	#ancestor_nuevo=ndb.Key(k_ancestor_nuevo,"pro","pizza")
	#key_piz=todosmodelos.ndb.Key(key_ti.kind(),key_ti.id(),todosmodelos.Pizzaespe,"pizza")
	keytiacop=todosmodelos.ndb.Key(tiacop.kind(),tiacop.id(),todosmodelos.Pizzaespe,"pizza")
	masasQry = todosmodelos.Masa.query(ancestor=keytiacop)
	tamasQry =  todosmodelos.Tamano.query(ancestor=keytiacop)
	mataQry =  todosmodelos.MasaTama.query(ancestor=keytiacop)
	ingQry = todosmodelos.Ingredientes.query(ancestor=keytiacop)
	salQry =  todosmodelos.Salsas.query(ancestor=keytiacop)
	pizQry=todosmodelos.Pizzaespe.query(ancestor=keytiacop)
	lisma={}
	for i in masasQry:
		k=todosmodelos.Masa(parent=mitikeypiz,nombre=i.nombre,descrip=i.descrip).put()
		lisma[str(i.key.id())]=k.integer_id()
		#lisma.append(i.key.id(),k.integer_id())
	listam={}
	for i in tamasQry:
		k=todosmodelos.Tamano(parent=mitikeypiz,nombre=i.nombre,num_personas=i.num_personas).put()
		listam[str(i.key.id())]=k.integer_id()
		 #listam.append(i.key.id(),k.integer_id())
	lismatas={}
	for i in mataQry:
		k=todosmodelos.MasaTama(parent=mitikeypiz,masa=lisma[str(i.masa)],tama=listam[str(i.tama)],preciobase=i.preciobase,precioing=i.precioing).put()
		lismatas[str(i.key.id())]=k.integer_id()
	lising={}
	for i in ingQry:
		k=todosmodelos.Ingredientes(parent=mitikeypiz,nombre=i.nombre,valor=i.valor).put()
		lising[str(i.key.id())]=k.integer_id()
	lissal={}
	for i in salQry:
		k=todosmodelos.Salsas(parent=mitikeypiz,nombre=i.nombre,valor=i.valor).put()
		lissal[str(i.key.id())]=k.integer_id()
	listipiz={}
	for i in pizQry:
		ling=[lising[str(g)] for g in i.ingres ]
		lmata=[lismatas[str(g)] for g in i.masas ]
		k=todosmodelos.Pizzaespe(parent=mitikeypiz,nombre=i.nombre,descrip=i.descrip,salsa=lissal[str(i.salsa)],queso=i.queso,ingres=ling,masas=lmata,apartir_numing_cobrar=i.apartir_numing_cobrar,grupo=i.grupo).put()
		listipiz[str(i.key.id())]=k.integer_id()
	return (listam,lisma,listipiz)


def otros(tiacop,mikeyti):
	otrosQry = todosmodelos.Otros.query(ancestor=tiacop)
	listipotro={}
	listipunotro={}
	for i in otrosQry:
		k=todosmodelos.Otros(parent=mikeyti,nombre=i.nombre,descrip=i.descrip).put()
		listipotro[str(i.key.id())]=k.integer_id()
		uoQry=todosmodelos.UnOtros.query(ancestor=i.key)
		for u in uoQry:
			uk=todosmodelos.UnOtros(parent=k,nombre=u.nombre,descrip=u.descrip,grupo=u.grupo,precio=u.precio).put()
			listipunotro[str(u.key.id())]=uk.integer_id()
	return (listipunotro,listipotro)

def otroscomplex(tiacop,mikeyti):
	otrosQry = todosmodelos.Otrosx.query(ancestor=tiacop)
	listipcomplex={}
	listipuncomplex={}
	listamax={}
	for i in otrosQry:
		k=todosmodelos.Otrosx(parent=mikeyti,nombre=i.nombre,descrip=i.descrip,nomsalsa=i.nomsalsa,tama=i.tama).put()
		listipcomplex[str(i.key.id())]=k.integer_id()
		uing=todosmodelos.Ingredientes.query(ancestor=i.key)
		lsing={}
		for u in uing:
			kg=todosmodelos.Ingredientes(parent=k,nombre=u.nombre,valor=u.valor).put()
			lsing[str(u.key.id())]=kg.integer_id()
		if len(i.nomsalsa)>0 and i.nomsalsa!="000":
			lssal={}
			usal=todosmodelos.Salsas.query(ancestor=i.key)
			for u in usal:
				ks=todosmodelos.Salsas(parent=k,nombre=u.nombre,valor=u.valor).put()
				lssal[str(u.key.id())]=ks.integer_id()
		if i.tama.nombre=="Varios":
			lstam={}
			utam=todosmodelos.Tamax.query(ancestor=i.key)
			for u in utam:
				kt=todosmodelos.Tamax(parent=k,nombre=u.nombre,preba=u.preba,preing=u.preing).put()
				listamax[str(u.key.id())]=kt.integer_id()
		uoQry=todosmodelos.UnOtrosx.query(ancestor=i.key)
		for u in uoQry:
			idsing=[lsing[str(g)] for g in u.ingres]
			idsal=None
			if u.salsa and u.salsa>0:
				idsal=lssal[str(u.salsa)]
			uot= todosmodelos.UnOtrosx(parent=k,nombre=u.nombre,descrip=u.descrip,salsa= idsal,ingres=idsing).put()
			listipuncomplex[str(u.key.id())]=uot.integer_id()

	return (listipuncomplex,listipcomplex,listamax)

	
def ofertas(tiacop,mikeyti,listam,lisma,listipiz,listipunotro,listipotro,listipuncomplex,listipcomplex,listamax):
	oferQry = todosmodelos.Oferta.query(ancestor=tiacop)
	#.order(todosmodelos.Oferta.nombre)
	lisofr=[]
	for i in oferQry:
		ofe=todosmodelos.Oferta(parent=mikeyti,nombre=i.nombre,descrip=i.descrip,fecdes=i.fecdes,fechas=i.fechas,horde=i.horde,horh=i.horh,dias=i.dias,localodomi=i.localodomi,ofertaenart=i.ofertaenart,numofer=i.numofer,preciofijo=i.preciofijo,descuento=i.descuento,eurosoporcen=i.eurosoporcen,increm=i.increm,numproduc=i.numproduc,grupo=i.grupo).put()
		uoQry=todosmodelos.ofertadetalle.query(ancestor=i.key)
		for u in uoQry:
			if u.tipoproducto==0:
				if u.tama:
					idsta=[listam[str(t)] for t in u.tama]
				else:
					idsta=[]
				if u.masa:
					idsma=[lisma[str(t)] for t in u.masa]
				else:
					idsma=[]
				if u.idtipo:
					idstipo=[listipiz[str(t)] for t in u.idtipo]
				else:
					idstipo=[]
				articu=todosmodelos.ofcondPizza(parent=ofe,tipoproducto=0,descuento=u.descuento,eurosoporcen=u.eurosoporcen,numofer=u.numofer,tama=idsta,masa=idsma,idtipo=idstipo,condiing=u.condiing,numing=u.numing).put()
			elif u.tipoproducto==1:
				if u.idtipo:
					idstipo=[listipunotro[str(t)] for t in u.idtipo]
				else:
					idstipo=[]
				articu=todosmodelos.ofcondOtro(parent=ofe,tipoproducto=1,descuento=u.descuento,eurosoporcen=u.eurosoporcen,numofer=u.numofer,idtipo=idstipo,idp=listipotro[str(u.idp)],cantidad=u.cantidad).put()
			elif u.tipoproducto==2:
				if u.idtipo:
					idstipo=[listipuncomplex[str(t)] for t in u.idtipo]
				else:
					idstipo=[]
				if u.tama:
					idstamax=[listamax[str(t)] for t in u.tama]
				else:
					idstamax=[]
				articu=todosmodelos.ofcondComplex(parent=ofe,tipoproducto=2,descuento=u.descuento,eurosoporcen=u.eurosoporcen,numofer=u.numofer,tama=idstamax,idtipo=idstipo,condiing=u.condiing,numing=u.numing,idp=listipcomplex[str(u.idp)],cantidad=u.cantidad).put()

def borrarImg_cloud(imge):
	img=imge.get()
	if img:
		if img.puntero < 2:
			if img.blobkeygs:
				filenom=BUCKET +'/'+str(img.key.parent().id())+"/"+img.nombre
				try:
					gcs.delete(filenom)
					images.delete_serving_url(img.blobkeygs)
				except:
					pass
			img.key.delete()
		else:
			img.puntero-=1
			img.put()
def eliminarOfertas(ancestor_key):
	oferQry = todosmodelos.Oferta.query(ancestor=ancestor_key)
	lisofr=[]
	for i in oferQry:
		lisofr.append(i.key)
		uoQry=todosmodelos.ofertadetalle.query(ancestor=i.key)
		todosmodelos.ndb.delete_multi([u for u in uoQry.iter(keys_only=True)])
		if i.keyimagen:
			borrarImg_cloud(i.keyimagen)
	if len(lisofr) > 0:
		todosmodelos.ndb.delete_multi(lisofr)

def eliminarPizzas(ancestor_keypiz):
	masasQry = todosmodelos.Masa.query(ancestor=ancestor_keypiz)
	tamasQry =  todosmodelos.Tamano.query(ancestor=ancestor_keypiz)
	mataQry =  todosmodelos.MasaTama.query(ancestor=ancestor_keypiz)
	ingQry = todosmodelos.Ingredientes.query(ancestor=ancestor_keypiz)
	salQry =  todosmodelos.Salsas.query(ancestor=ancestor_keypiz)
	pizQry=todosmodelos.Pizzaespe.query(ancestor=ancestor_keypiz)

	todosmodelos.ndb.delete_multi([u for u in masasQry.iter(keys_only=True)])
	todosmodelos.ndb.delete_multi([u for u in tamasQry.iter(keys_only=True)])
	todosmodelos.ndb.delete_multi([u for u in mataQry.iter(keys_only=True)])
	todosmodelos.ndb.delete_multi([u for u in ingQry.iter(keys_only=True)])
	todosmodelos.ndb.delete_multi([u for u in salQry.iter(keys_only=True)])

	listipiz=[]
	for i in pizQry:
		listipiz.append(i.key)
		if i.keyimagen:
			borrarImg_cloud(i.keyimagen)
	if len(listipiz) > 0:
		todosmodelos.ndb.delete_multi(listipiz)

def eliminarOtros(ancestor_key):
	otrosQry = todosmodelos.Otros.query(ancestor=ancestor_key)
	listipotro=[]
	for i in otrosQry:
		listipotro.append(i.key)
		uoQry=todosmodelos.UnOtros.query(ancestor=i.key)
		lisunotr=[]
		for u in uoQry:
			lisunotr.append(u.key)
			if u.keyimagen:
				borrarImg_cloud(u.keyimagen)
		if len(lisunotr)> 0:
			todosmodelos.ndb.delete_multi(lisunotr)
	if len(listipotro) > 0:
		todosmodelos.ndb.delete_multi(listipotro)

def eliminarOtrosxx(ancestor_key):
	otrosQry = todosmodelos.Otrosx.query(ancestor=ancestor_key)
	listipcomplex=[]
	for i in otrosQry:
		listipcomplex.append(i.key)
		uing=todosmodelos.Ingredientes.query(ancestor=i.key)
		todosmodelos.ndb.delete_multi([u for u in uing.iter(keys_only=True)])
		if len(i.nomsalsa)>0 and i.nomsalsa!="000":
			usal=todosmodelos.Salsas.query(ancestor=i.key)
			todosmodelos.ndb.delete_multi([u for u in usal.iter(keys_only=True)])
		if i.tama.nombre=="Varios":
			utam=todosmodelos.Tamax.query(ancestor=i.key)
			todosmodelos.ndb.delete_multi([u for u in utam.iter(keys_only=True)])
		uoQry=todosmodelos.UnOtrosx.query(ancestor=i.key)
		lisunotr=[]
		for u in uoQry:
			lisunotr.append(u.key)
			if u.keyimagen:
				borrarImg_cloud(u.keyimagen)
		if len(lisunotr) > 0:
			todosmodelos.ndb.delete_multi(lisunotr)
	if len(listipcomplex) > 0:
		todosmodelos.ndb.delete_multi(listipcomplex)

#def principal():
#	ancestor_nuevo=ndb.Key(urlsafe=self.request.get('tienda'))
#	listam,lisma,listipiz=pizza(ancestor_nuevo)
#	listipunotro,listipotro=otros(ancestor_nuevo)
#	listipuncomplex,listipcomplex,listamax=otroscomplex(ancestor_nuevo)
#	ofertas(ancestor_nuevo,listam,lisma,listipiz,listipunotro,listipotro,listipuncomplex,listipcomplex,listamax)

class copiarTodo(baserequest.BaseHandler):
	@baserequest.user_required_json_tienda
	def post(self):
		key_ti=self.session.get('usuario').tienda
		key_piz=todosmodelos.ndb.Key(key_ti.kind(),key_ti.id(),todosmodelos.Pizzaespe,"pizza")
		ope=self.objjson["ope"]
		if ope=="ins": # copiar todo
			if self.objjson["tienda_a_copiar"]:
				tiacop=todosmodelos.ndb.Key(urlsafe=self.objjson["tienda_a_copiar"])
				if tiacop:
					listam,lisma,listipiz=pizzas(tiacop,key_piz)
					listipunotro,listipotro=otros(tiacop,key_ti)
					listipuncomplex,listipcomplex,listamax=otroscomplex(tiacop,key_ti)
					ofertas(tiacop,key_ti,listam,lisma,listipiz,listipunotro,listipotro,listipuncomplex,listipcomplex,listamax)
					self.response.out.write(json.dumps({"ok":"Se han copiado todos los productos de %s " % self.objjson["tienda_a_copiar"]}))
				else:
					self.response.out.write(json.dumps({"error":"No se pudo recuperar plantilla a copiar"}))
					return
			else:
				self.response.out.write(json.dumps({"error":"No hay datos de plantilla a copiar"}))
				return
		elif ope=="del":
			eliminarOfertas(key_ti)
			eliminarPizzas(key_piz)
			eliminarOtros(key_ti)
			eliminarOtrosxx(key_ti)
			self.response.out.write(json.dumps({"ok":"Se han eliminado todos los productos"}))
		else:
			self.response.out.write(json.dumps({"error":u"No hay operación"}))
			return
		

class tiendasAcopiar(baserequest.BaseHandler):
	@baserequest.user_required_json_tienda
	def post(self):
		qrytienda=todosmodelos.Tienda.query()
		#projection=('esmodelo', 'nombre'))
		listi=[]
		for i in qrytienda:
			if i.esmodelo:
				listi.append((i.nombre,i.key.urlsafe()))
		self.response.out.write(json.dumps({"ok":listi}))
