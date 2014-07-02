#!/usr/bin/python
# -*- coding: utf-8 -*-
import webapp2
import json
import os
from google.appengine.api import images,app_identity
from google.appengine.ext import ndb,blobstore
import cloudstorage as gcs
from modulospy import baserequest
from modelos import todosmodelos

BUCKET = app_identity.get_default_gcs_bucket_name()
FRAME_TEMPLATE=u"""<!DOCTYPE html> 
<html lang="es">
<head>
	<meta charset="UTF-8">
<style>
body {
	margin:0;
	padding:0;
	border:0;
}
</style>
<script>
var res=%s;
window.onload=function(){ 
var arc=document.getElementById("img");
arc.onchange=function() {
	parent.FileimgApi.c_extension(arc,document.getElementById("miform"));
}
if (res!=='no') { parent.FileimgApi.respuesta(res); }
}
</script>
</head>
<body>
<form id='miform' method="post" enctype="multipart/form-data">
<input type=file id="img" name="img">
</form></body></html>"""
FRAMEERROR_TEMPLATE=u"""<!DOCTYPE html> 
<html lang="es">
<head>
	<meta charset="UTF-8">
<style>
body {
	margin:0;
	padding:0;
	border:0;
}
</style>
</head>
<body>
<p>%s</p>
</body></html>"""
class FrameImagen(baserequest.BaseHandler):
	def get(self):
		mise = self.session.get('usuario')
		if not mise or not mise.valida:
			self.response.out.write(FRAMEERROR_TEMPLATE % u"No hay sesión")
			return
		if not mise.tienda:
			self.response.out.write(FRAMEERROR_TEMPLATE % "No hay tienda")
			return
		self.response.out.write(FRAME_TEMPLATE % "'no'")
def CreateFile(my_file,tienda):
	"""Create a GCS file with GCS client lib.

	Args:
	filename: GCS filename.

	Returns:
	The corresponding string blobkey for this GCS file.
	"""
	# Create a GCS file with GCS client.
	#with gcs.open(filename, 'w') as f:
	#		f.write(my_file.file.read())
	nombre = '/'+BUCKET +'/'+str(tienda)+"/"+my_file.filename
	#write_retry_params = gcs.RetryParams(backoff_factor=1.1)
	#with gcs.open(my_file.filename, 'w') as f:
	#	f.write(my_file.file.read())
	gcs_file = gcs.open(nombre,'w',content_type=my_file.type,options={'x-goog-acl': 'public-read'})
	#, retry_params=write_retry_paramsretry_params=write_retry_params

	gcs_file.write(my_file.file.read())
	gcs_file.close()

	# Blobstore API requires extra /gs to distinguish against blobstore files.
	blobstore_filename = '/gs' + nombre
	# This blob_key works with blobstore APIs that do not expect a
	# corresponding BlobInfo in datastore.
	return blobstore.create_gs_key(blobstore_filename)
	#return my_file.filename

class CargarUrlImagen(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if not "idti" in self.objjson or not "nombre" in self.objjson or not "url" in self.objjson or not "ti" in self.objjson:
			self.errornor(u" no están todos los datos")
			return
		rev_key =ndb.Key(urlsafe=self.objjson["idti"])
		tien=rev_key.get()
		if not tien:
			self.errornor("no se puede encontrar id tienda")
			return
		eslist=type(tien.keyimagen) == list
		if eslist:
			if len(tien.keyimagen) > 2:
				self.errornor("ya hay 3 imágenes")
				return
		elif tien.keyimagen != None:
			self.errornor("ya tiene una imágen")
			return
		imgmod= todosmodelos.ImagenCloud(parent=self.session.get('usuario').tienda,nombre=self.objjson["nombre"],puntero=1,url=self.objjson["url"], tipo=self.objjson["ti"])
		kim=imgmod.put()
		if kim:
			if not eslist:
				tien.keyimagen=kim
			else:
				tien.keyimagen.append(kim)
			tien.put()
			valores={
				'nombre':self.objjson["nombre"],
				'tipo':self.objjson["ti"],
				'tama':"Desconocido",
				'url':imgmod.url
			}
			self.ok(valores)
		else:
			self.errornor("no se grabó referencia")

class CargarImagen(baserequest.BaseHandler):
	def get_file_size(self,file):
	    file.seek(0, 2) # Seek to the end of the file
	    size = file.tell() # Get the position of EOF
	    file.seek(0) # Reset the file position to the beginning
	    return size
	def post(self):
		#blob.data = self.request.POST.get("img").file.read()
		
		#my_file = self.request.body_file

		if self.request.get('frame'):
			frame=True
		else:
			frame=False
			self.response.headers['Content-Type'] = 'application/json'
		mise = self.session.get('usuario')
		if not mise or not mise.valida:
			self.respuesta(frame,json.dumps({"error":u"No hay sesión"},ensure_ascii=False))
			return
		if not mise.tienda:
			self.respuesta(frame,json.dumps({"error":"No hay tienda"},ensure_ascii=False))
			return
		

		
		if not self.request.get('idti') or not self.request.get('tama'):
			self.respuesta(frame,json.dumps({"error":u" en parámetros tienda o tamaño"},ensure_ascii=False))
			return
		
		try:
			tama=int(self.request.get('tama'))*1000
		except:
			self.respuesta(frame,json.dumps({"error":u"tama no es un número"},ensure_ascii=False))
			return
		"""if frame:
			filename=self.request.POST['img']
			try:
				tiind=filename.rindex(".")
			except:
				self.respuesta(frame,json.dumps({"error":u"1 no file tipo = %s" % filename},ensure_ascii=False))
				return
			tiimg=filename[(tiind+1):].upper()
			if tiimg not in ["GIF","JPG","JPEG","PNG"]:
				self.respuesta(frame,json.dumps({"error":u"2 no file tipo = %s" % filename},ensure_ascii=False))
				return
			from collections import namedtuple
			fic=namedtuple("MiFile",['file','type','filename'])
			my_file = fic(self.request.body_file,'image/'+tiimg,filename)
			sizef = len(self.request.body_file._get_body())
		else:"""
		my_file = self.request.POST['img']
		if 'image' not in my_file.type:
			self.respuesta(frame,json.dumps({"error":u"archivo (%s) no es una imágen es %s "  % (my_file.filename,my_file.type)},ensure_ascii=False))
			return
		sizef = self.get_file_size(my_file.file)
		if sizef <= tama:
			idt=self.request.get('idti')
			rev_key =ndb.Key(urlsafe=idt)
			tien=rev_key.get()
			if not tien:
				self.respuesta(frame,"{\"error\":\"no se puede recuperar key %s \"}"  % idt)
				return
			eslist=type(tien.keyimagen) == list
			if eslist:
				if len(tien.keyimagen) > 2:
					self.respuesta(frame,json.dumps({"error":u"ya hay 3 imágenes"},ensure_ascii=False))
					return
			elif tien.keyimagen != None:
				self.respuesta(frame,json.dumps({"error":"ya tiene una imágen %s"  % tien.keyimagen.urlsafe()},ensure_ascii=False))
				return
			unaurl=CreateFile(my_file,mise.tienda.id())
			imgmod= todosmodelos.ImagenCloud(parent=mise.tienda,nombre=my_file.filename,puntero=1,url=images.get_serving_url(blob_key=unaurl),blobkeygs=unaurl, tipo=my_file.type,tama=sizef)
			kim=imgmod.put()
			if kim:
				if not eslist:
					tien.keyimagen=kim
				else:
					tien.keyimagen.append(kim)
				tien.put()
				valores={
					'ok':'ok',
					'nombre':my_file.filename,
					'tipo':my_file.type,
					'tama':sizef,
					'url':imgmod.url,
					'bucket':BUCKET
				}
			else:
				self.respuesta(frame,json.dumps({"error":u"Se almacenó la imagen pero no se grabó referencia","tiperr:":1},ensure_ascii=False))
		else:
			valores={'error':my_file.filename + "3 Demasiado grande :" + str(sizef) }
		self.respuesta(frame,json.dumps(valores,ensure_ascii=False))

	def respuesta(self,tipo,res):
		if tipo:
			self.response.out.write(FRAME_TEMPLATE % res)
			#self.response.out.write("""<html lang="es"><head><script>window.onload=function(){ parent.FileimgApi.respuesta(%s); }</script></head><body></body></html>""" % res)
		else:
			self.response.out.write(res)
def borrarImg_cloud(img):
	if img.blobkeygs:
		filenom='/'+BUCKET +'/'+str(img.key.parent().id())+"/"+img.nombre
		#try:
		gcs.delete(filenom)
		images.delete_serving_url(img.blobkeygs)
		#except:
		#	pass
	img.key.delete()
		#except gcs.NotFoundError:
		#	pass
class eliminarImagen(baserequest.BaseHandler):
	def post(self):
		self.response.headers['Content-Type'] = 'application/json'
		mise = self.session.get('usuario')
		if not mise or not mise.valida:
			self.response.out.write(json.dumps({"error":u"No hay sesión"},ensure_ascii=False))
			return
		if not mise.tienda:
			self.response.out.write(json.dumps({"error":"No hay tienda"},ensure_ascii=False))
			return
		if self.request.get('kfg') and self.request.get('nom'): #and self.request.get('thj')
			rev_key =ndb.Key(urlsafe=self.request.get('kfg'))
			#ti_key=modeloTienda.ndb.Key(urlsafe=self.request.get('thj'))
			tien=rev_key.get()
			#tien=ti_key.get()
			if tien: # and tien:
				if type(tien.keyimagen) == list:
					nom=self.request.get('nom') # os.path.join('imagenes', os.path.join(str(self.session['usuario'].tienda.id()),self.request.get('nom')))
					x=0
					for r in tien.keyimagen:
						img=r.get()
						if nom == img.nombre:
							del tien.keyimagen[x]
							x=1000
							break
						x+=1
					if not x==1000:
						self.response.out.write(json.dumps({"error":u"no se puedo recuperar kfg= %s" % ruta },ensure_ascii=False))
						return
				else:
					img=tien.keyimagen.get()
					tien.keyimagen=None
				tien.put()
				img.puntero-=1
				if img.puntero < 1:
					borrarImg_cloud(img)
				else:
					img.put()
				self.response.out.write(json.dumps({"ok":u"Imágen de %s eliminada" % tien.nombre},ensure_ascii=False))
			else:
				self.response.out.write(json.dumps({"error":u"no se puedo recuperar la imágen"},ensure_ascii=False))
		else:
			self.response.out.write("{\"error\":\"no hay identificadores \"}")

"""def list_bucket_directory_mode(bucket):
	lisfi=[]
    for stat in gcs.listbucket(bucket):
    	lisfi.append(stat.filename)
    return lisfi

def list_bucket(bucket):
    page_size = 1
    stats = gcs.listbucket(bucket, max_keys=page_size)
    lisfi=[]
    while True:
      count = 0
      for stat in stats:
        count += 1
        lisfi.append(stat.filename)
      if count != page_size or count == 0:
        return lisfi
      stats = gcs.listbucket(bucket, max_keys=page_size,
                             marker=stat.filename)"""

class listar_imagenes(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		"""prin=todosmodelos.Tienda.query(todosmodelos.Tienda.nombre=="Principal").get()
		if prin:
			lisfileprin=list_bucket_directory_mode(BUCKET +'/'+str(prin.key.id()))
		else:
			lisfileprin=[]
		lisfiletien=list_bucket_directory_mode(BUCKET +'/'+str(self.session['usuario'].tienda.id()))"""

		prin=todosmodelos.Tienda.query(todosmodelos.Tienda.nombre=="Principal").get()
		if prin:
			qryprin=todosmodelos.ImagenCloud.query(ancestor=prin.key).order(todosmodelos.ImagenCloud.nombre)
			lisfileprin=[(i.nombre,i.url,i.key.urlsafe()) for i in qryprin]
		else:
			lisfileprin=[]
		if not prin or not prin.key==self.session['usuario'].tienda:
			qrytien=todosmodelos.ImagenCloud.query(ancestor=self.session['usuario'].tienda).order(todosmodelos.ImagenCloud.nombre)
			lisfiletien=[(i.nombre,i.url,i.key.urlsafe()) for i in qrytien]
		else:
			lisfiletien=[]
		self.response.out.write(json.dumps({"ok":"ok","prin":lisfileprin,"tien":lisfiletien},ensure_ascii=False))

"""class imgSelLista(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if not self.objjson.has_key('idti') or not self.objjson.has_key('eimg'):
			self.errornor(u" error en parámetros tienda o imagen")
			return
		idt=self.objjson['idti']
		#try:
		#	idimg=int(self.objjson['eimg'])
		#except:
		#	self.errornor("error en la imágen")
		#	return
		rev_key =ndb.Key(urlsafe=idt)
		tien=rev_key.get()
		if not tien:
			self.errornor("no se puede recuperar key %s"  % idt)
			return
		eslist=type(tien.keyimagen) == list
		if eslist:
			if len(tien.keyimagen) > 2:
				self.errornor(u"ya hay 3 imágenes")
				return
		elif tien.keyimagen != None:
			self.errornor(u"ya tiene una imágen %s"  % tien.keyimagen.urlsafe())
			return
		kim=ndb.Key(urlsafe=self.objjson['eimg']).get()
		#kim=todosmodelos.ImagenCloud.get_by_id(idimg)
		if kim:
			if not eslist:
				tien.keyimagen=kim.key
			else:
				tien.keyimagen.append(kim.key)
			tien.put()
			kim.puntero+=1
			kim.put()
			valores={
				'ok':'ok',
				'nombre':kim.nombre,
				'tipo':kim.tipo,
				'tama':kim.tama,
				'url':kim.url
			}
			self.response.out.write(json.dumps(valores,ensure_ascii=False))
		else:
			self.errornor("No se pudo obtener imágen de referencia kim=%s" % self.objjson['eimg'])"""

class imgSelLista(baserequest.respuesta):
	@baserequest.user_required_json_tienda
	def post(self):
		if not self.objjson.has_key('idorigen') or not self.objjson.has_key('iddestino') or not self.objjson.has_key("nomimaorigen"):
			self.errornor(u" error en parámetros tienda o imagen")
			return
		nomimaorigen=self.objjson['nomimaorigen']
		#try:
		#	idimg=int(self.objjson['eimg'])
		#except:
		#	self.errornor("error en la imágen")
		#	return
		rev_key =ndb.Key(urlsafe=self.objjson['iddestino'])
		tien=rev_key.get()
		if not tien:
			self.errornor("no se puede recuperar key destino %s"  % self.objjson['iddestino'])
			return
		eslist=type(tien.keyimagen) == list
		if eslist:
			if len(tien.keyimagen) > 2:
				self.errornor(u"ya hay 3 imágenes")
				return
		elif tien.keyimagen != None:
			self.errornor(u"ya tiene una imágen %s"  % tien.keyimagen.urlsafe())
			return
		kim=ndb.Key(urlsafe=self.objjson['idorigen']).get()
		#kim=todosmodelos.ImagenCloud.get_by_id(idimg)
		if kim:
			if not kim.keyimagen:
				self.errornor(u"origen no tiene imágen %s"  % self.objjson['idorigen'])
				return
			
			if type(kim.keyimagen) ==list:
				kim3=None
				for k in kim.keyimagen:
					kim2=k.get()
					if kim2 and kim2.nombre == nomimaorigen:
						kim3=k
						break
				if kim3 == None:
					self.errornor("no se puede recuperar key imagen origen %s"  % self.objjson['idorigen'])
					return
			else:
				kim2=kim.keyimagen.get()
				key3=kim.keyimagen
			if not eslist:
				tien.keyimagen=key3
			else:
				tien.keyimagen.append(key3)
			tien.put()
			kim2.puntero+=1
			kim2.put()
			valores={
				'ok':'ok',
				'nombre':kim2.nombre,
				'tipo':kim2.tipo,
				'tama':kim2.tama,
				'url':kim2.url
			}
			self.response.out.write(json.dumps(valores,ensure_ascii=False))
		else:
			self.errornor("No se pudo obtener imágen de referencia kim=%s" % self.objjson['eimg'])