from google.appengine.ext import ndb
from google.appengine.ext.ndb import polymodel
#from modelos import modeloImagen

class ImagenCloud(ndb.Model):
	puntero = ndb.IntegerProperty()
	url = ndb.StringProperty()
	nombre = ndb.StringProperty()
	tipo=ndb.StringProperty()
	tama=ndb.IntegerProperty()
	blobkeygs=ndb.StringProperty()

class Horario(ndb.Model):
	tipo=ndb.IntegerProperty()
 	dia= ndb.StringProperty()
  	diamad =ndb.TimeProperty()
  	diamah=ndb.TimeProperty()
	diatad=ndb.TimeProperty()
	diatah=ndb.TimeProperty()

class apiPaypal(ndb.Model):
	clientid=ndb.StringProperty()
	secret=ndb.StringProperty()
	inc_des=ndb.FloatProperty(default=0)
	stringsuple=ndb.StringProperty(default="Suplemento Paypal")
	poroeur=ndb.BooleanProperty() #True=porcentaje , False=Euros
	modo=ndb.BooleanProperty(default=False) # True=Live m False=pruebas sandbox
	access_token=ndb.StringProperty()
	expires_in=ndb.IntegerProperty()
	vino_token=ndb.IntegerProperty()

class apiPagantis(ndb.Model):
	account_id=ndb.StringProperty()
	clave_firma= ndb.StringProperty()
	api_key=ndb.StringProperty()
	inc_des=ndb.FloatProperty(default=0)
	stringsuple=ndb.StringProperty(default="Suplemento Paypal")
	poroeur=ndb.BooleanProperty() #True=porcentaje , False=Euros
	modo=ndb.BooleanProperty(default=False) # True=Live m False=pruebas sandbox

class Tienda(ndb.Model):
	esmodelo=ndb.BooleanProperty(default=False)
	nombre= ndb.StringProperty()
	nombreupper=ndb.StringProperty(indexed = True)
	calle= ndb.StringProperty()
	provincia =ndb.StringProperty()
	localidad=ndb.StringProperty()
	cdp=ndb.StringProperty()
	posmapa=ndb.GeoPtProperty() #The object has attributes lat and lon, both floats. ndb.GeoPt(52.37, 4.88) or with a string ndb.GeoPt("52.37, 4.88")
	zona_reparto=ndb.GeoPtProperty(repeated=True)
	dirmapa=ndb.StringProperty()
	horario=ndb.StructuredProperty(Horario, repeated=True)
	cod_postal=ndb.StringProperty(repeated=True)
	poblaciones=ndb.StringProperty(repeated=True)
	ult_modi=ndb.IntegerProperty()
	url=ndb.StringProperty()
	webactiva=ndb.BooleanProperty(default=False)
	email=ndb.StringProperty(repeated=True)
	telefono=ndb.IntegerProperty(repeated=True)
	forma_pago=ndb.IntegerProperty()
	tiempo_recoger=ndb.IntegerProperty()
	tiempo_domicilio=ndb.IntegerProperty()
	prepedmindom=ndb.FloatProperty(default=6)
	fechacre=ndb.DateTimeProperty(auto_now_add=True)
	keyimagen=ndb.KeyProperty(kind=ImagenCloud,repeated=True)
	paypal=ndb.StructuredProperty(apiPaypal)
	pagantis=ndb.StructuredProperty(apiPagantis)
	usohorario=ndb.StringProperty(choices=["Europe/Madrid","Atlantic/Canary-Europe/London-Europe/Lisboa"])



class Usuarios(ndb.Model):
	email=ndb.StringProperty()
	password=ndb.StringProperty()
	nombre=ndb.StringProperty()
	esadmin=ndb.BooleanProperty(default=False)
	tienda=ndb.KeyProperty(kind=Tienda)
	valida=ndb.BooleanProperty()
	token=ndb.StringProperty()
	fechacre=ndb.DateTimeProperty(auto_now_add=True)
	updated = ndb.DateTimeProperty(auto_now=True)

class Masa(ndb.Model):
	nombre = ndb.StringProperty()
	descrip=ndb.StringProperty()

class Tamano(ndb.Model):
	nombre = ndb.StringProperty()
	num_personas = ndb.IntegerProperty()

class MasaTama(ndb.Model):
	masa = ndb.IntegerProperty()
	tama = ndb.IntegerProperty()
	preciobase = ndb.FloatProperty()
	precioing =ndb.FloatProperty()

class Ingredientes(ndb.Model):
	nombre = ndb.StringProperty()
	valor = ndb.FloatProperty()

class Salsas(ndb.Model):
	nombre = ndb.StringProperty()
	valor = ndb.FloatProperty()

class Pizzaespe(ndb.Model):
	nombre = ndb.StringProperty()
	descrip=ndb.StringProperty()
	salsa=ndb.IntegerProperty()
	queso=ndb.BooleanProperty()
	ingres=ndb.IntegerProperty(repeated=True)
	masas=ndb.IntegerProperty(repeated=True)
	apartir_numing_cobrar =  ndb.IntegerProperty()
	grupo=ndb.StringProperty()
	keyimagen=ndb.KeyProperty(kind=ImagenCloud)

class Otros(ndb.Model):
	nombre = ndb.StringProperty()
	descrip=ndb.StringProperty()
	url=ndb.StringProperty()

class UnOtros(ndb.Model):
	nombre = ndb.StringProperty()
	descrip=ndb.StringProperty()
	grupo=ndb.StringProperty()
	precio = ndb.FloatProperty()
	keyimagen=ndb.KeyProperty(kind=ImagenCloud)

class Tamax(ndb.Model):
	nombre=ndb.StringProperty()
	preba=ndb.FloatProperty()
	preing=ndb.FloatProperty()

class Otrosx(ndb.Model):
	nombre = ndb.StringProperty()
	descrip=ndb.StringProperty()
	nomsalsa=ndb.StringProperty()
	tama=ndb.StructuredProperty(Tamax)
	url=ndb.StringProperty()

class UnOtrosx(ndb.Model):
	nombre = ndb.StringProperty()
	descrip=ndb.StringProperty()
	salsa=ndb.IntegerProperty()
	ingres = ndb.IntegerProperty(repeated=True)
	#titimagen=ndb.StringProperty()
	keyimagen=ndb.KeyProperty(kind=ImagenCloud)

class Oferta(ndb.Model):
	nombre = ndb.StringProperty()
	descrip=ndb.StringProperty()
	fecdes=ndb.DateProperty()
	fechas=ndb.DateProperty()
	horde=ndb.TimeProperty()
	horh=ndb.TimeProperty()
	dias=ndb.StringProperty() # T = todos los dias
	localodomi=ndb.BooleanProperty() #True = local
	ofertaenart = ndb.BooleanProperty(default=True) #True = pedido False productos 
	numofer=ndb.IntegerProperty()
	preciofijo=ndb.FloatProperty()
	descuento=ndb.FloatProperty()
	eurosoporcen=ndb.BooleanProperty() # True = euros , False=porcentaje
	increm=ndb.IntegerProperty()
	numproduc=ndb.IntegerProperty()
	grupo=ndb.StringProperty()
	#titimagen=ndb.StringProperty()
	keyimagen=ndb.KeyProperty(kind=ImagenCloud)

class ofertadetalle(polymodel.PolyModel):
	tipoproducto=ndb.IntegerProperty() # 0=pizza, 1=simple, 2 = complex
	descuento=ndb.FloatProperty()
	eurosoporcen=ndb.BooleanProperty()
	numofer=ndb.IntegerProperty() #0=["Cobrar todo el importe","C"],1=["Regalar todo el importe","R"],2=["Descuendo de","D"]

class ofcondPizza(ofertadetalle):
	tama=ndb.IntegerProperty(repeated=True)
	masa=ndb.IntegerProperty(repeated=True)
	idtipo=ndb.IntegerProperty(repeated=True)
	condiing=ndb.StringProperty() # 0=["Mayor",">"],1=["Menor","<"],2=["Igual","="],3=["Cualquiera","-"]
	numing=ndb.IntegerProperty()

class ofcondComplex(ofertadetalle):
	cantidad=ndb.IntegerProperty()
	idp=ndb.IntegerProperty()
	idtipo=ndb.IntegerProperty(repeated=True)
	condiing=ndb.StringProperty()
	numing=ndb.IntegerProperty()
	tama=ndb.IntegerProperty(repeated=True)

class ofcondOtro(ofertadetalle):
	cantidad=ndb.IntegerProperty()
	idp=ndb.IntegerProperty()
	idtipo=ndb.IntegerProperty(repeated=True)

class Clientes(ndb.Model):
	email=ndb.StringProperty()
	password=ndb.StringProperty()
	validada=ndb.BooleanProperty()
	token=ndb.StringProperty()
	fechacre=ndb.DateTimeProperty(auto_now_add=True)
	numpedidos=ndb.IntegerProperty(default=0)
	ultimopedido = ndb.IntegerProperty()
	idsocial=ndb.StringProperty(indexed = True)
	comen=ndb.StringProperty()

class socialRed(ndb.Model):
	oauth_token = ndb.StringProperty()
	oauth_token_secret = ndb.StringProperty()
	expires =  ndb.IntegerProperty()
	id_social= ndb.StringProperty(indexed = True) # tw-  o fb- mas el id de twitter o facebook
	nombre= ndb.StringProperty()
	email= ndb.StringProperty()
	avatar= ndb.StringProperty()

class CalleNom(ndb.Model):
	nom = ndb.StringProperty()
	muni =ndb.StringProperty()
	codpos=ndb.StringProperty()
	piso = ndb.StringProperty()
	via = ndb.StringProperty()
	num = ndb.StringProperty()
	bloq = ndb.StringProperty()
	esca = ndb.StringProperty()
	letra = ndb.StringProperty()

class Detalle(ndb.Model):
	tipoart=ndb.IntegerProperty(indexed = True)
	articuloidprin = ndb.IntegerProperty(indexed = True)
	articuloidsec =ndb.IntegerProperty(indexed = True)
	cantidad=ndb.IntegerProperty()
	det = ndb.JsonProperty()
	ofertaid=ndb.IntegerProperty(indexed = True)
	numofer=ndb.IntegerProperty()
	ofertadet = ndb.JsonProperty()
	preart = ndb.FloatProperty()

class Transferencia(ndb.Model):
	token_ec=ndb.StringProperty(indexed = True)
	id_payment=ndb.StringProperty()
	tienda=ndb.KeyProperty(kind=Tienda)
	#pedido=ndb.JsonProperty()
	estado=ndb.StringProperty(choices=["created","approved","completed","failed","canceled","expired"])
	fechacre=ndb.DateTimeProperty(auto_now_add=True)
	updated = ndb.DateTimeProperty(auto_now=True)
	redirect=ndb.StringProperty()
	response_executed=ndb.JsonProperty()
	response_lookup=ndb.JsonProperty()
	modo=ndb.BooleanProperty()
	reg_pedido=ndb.KeyProperty() #kind=Pedido
	suplemento=ndb.FloatProperty()

class Pedido(ndb.Model):
	pedidoen = ndb.IntegerProperty()
	cliente = ndb.KeyProperty(kind=Clientes)
	numped = ndb.IntegerProperty()
	telefono = ndb.IntegerProperty()
	callenom = ndb.StructuredProperty(CalleNom)

	importe = ndb.FloatProperty()
	suplemento=ndb.FloatProperty(default = 0)
	horapedido = ndb.IntegerProperty(indexed = True)
	horaent = ndb.IntegerProperty()

	multa = ndb.FloatProperty(default=0)
	anulado = ndb.BooleanProperty(default=False)
	comen = ndb.StringProperty()
	pago=ndb.IntegerProperty(choices=[1,2,3]) # 1=pago en tienda, 2=paypal, 3=pagantis
	regpago=ndb.KeyProperty(kind=Transferencia)
	#detalle = ndb.StructuredProperty(Detalle, repeated=True)
	detalleapi=ndb.JsonProperty()

