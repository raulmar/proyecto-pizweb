var FileimgApi=(function() {
	var URLNUEVA='/admintienda/Imgs/nueva',
		URLELIMINAR='/admintienda/Imgs/eliminarImagen',
		URLLISTAR='/admintienda/Imgs/listimagenes',
		URL_img_sel='/admintienda/Imgs/imglista',
		URLIMGURL='/admintienda/Imgs/urlimgurl',
		URLFRAME='/admintienda/Imgs/frameimg',
		datfile=null,
		ultImgKey=null;
	function comprueba_extension() {
		if (datfile.imgerr!=null){
				datfile.diverror.removeChild(datfile.imgerr);
				datfile.imgerr=null;
			}
		var archivo=this.value;
		if (!archivo){
			showImgerror("No has seleccionado ningún archivo");
			return;
		}
		var extensiones_permitidas = new Array(".gif", ".jpg", ".png", ".jpeg"); 
		var pp=archivo.lastIndexOf(".");
		var extension = (archivo.substring(pp)).toLowerCase();
		if (extensiones_permitidas.indexOf(extension)==-1){
			showImgerror("El archivo debe de ser una imagen con extensión: .jpg,.jpeg,.png,.gif");
			return;
		}
		if (datfile.haynombre()){
			showImgerror("Ya existe una imágen, para añadir una imágen nueva antes tienes que eliminar esta.");
			this.value="";
			return;
		}
		if (datfile.propietario!=null && datfile.propietario.keyControler != null) {
			datfile.avisoiframe=false;
			//datfile.idti.value=datfile.keyControler;
			datfile.miform.action=URLNUEVA+"?idti="+datfile.propietario.keyControler+"&tama="+datfile.limit+"&frame=true";
			datfile.iframeimg.onload=function(){
				console.log("iframe cargado");
				if (!datfile.avisoiframe)
					window.setTimeout(iframeerrorservidor,2000);
			}
			datfile.miform.submit();
		}else
			console.log("idtienda no hayyy es null");
	}
	function iframeerrorservidor() {
		showImgerror("Error al enviar la imágen.");
	}
	function enviar_img_sel(objimgsel,esok){
		if (esok) {
			if (datfile.haynombre()){
				showImgerror("Ya existe una imágen, para cambiar de imágen antes tienes que eliminar ésta.");
				return;
			}
			if (datfile.imglis.elesel ){
				hUtils.xJson({url:URL_img_sel,datos:window.JSON.stringify({ope:"ins",eimg:datfile.imglis.elesel.did,idti:datfile.propietario.keyControler}),formu:true}).then(function(dat){
					console.log("respuesta enviar_img_sel =",dat);
					imagenServidor(dat);
				}).fail(function(dat){
			  		console.log("recibo error en enviar_img_sel =",dat);
			  		showImgerror(dat);
			  	});
			}
		}
	}
	function seleccionar_imagen(){
		//datfile.imglis.botenvimglis.style.visibility="visible";// botenviar.style.visibility="visible";
		datfile.imglis.elesel=this;
		//datfile.imglis.res.getElementsByTagName("span")[0].innerHTML=this.innerHTML;// sel.getElementsByTagName("span")[0].innerHTML=this.innerHTML;
		//if (this.yaesta) return;
		//datfile.imglis.botenvimglis.onclick=enviar_img_sel;// botenviar.onclick=enviar_img_sel;
		var mino=this.innerHTML, extension = (mino.substring(mino.lastIndexOf("."))).toLowerCase();
		var thumb=new Image(); //,soy=this;
		thumb.onload=function() {
			var ddii=document.createElement("div");
			ddii.innerHTML="<p>Nombre:"+mino+", tipo:"+ extension + " , ancho:"+this.width+"px, alto:"+this.height+"px</p><h4> ¿Deseas seleccionar esta imágen?</h4>";
			ddii.appendChild(this);
			ClAlerta.marcar({tit:"Imágen "+mino ,inteobj:ddii,f:enviar_img_sel,ob:datfile.imglis.elesel });
			/*soy.yaesta=true;
	    	var nueimg=hUtils.crearElemento({e:"div",c:{position:"relative"},
	    		hijos:[{e:"h4",inner:mino+", tipo:"+ extension + " , ancho:"+this.width+"px, alto:"+this.height+"px"}]},null);	
	    	nueimg.appendChild(thumb);
	    	soy.nueimg=nueimg;
	   		if (soy.nextSibling) 
	    		soy.parentNode.insertBefore(nueimg,soy.nextSibling);
	    	else
	    		soy.parentNode.appendChild(nueimg);*/
		}
		thumb.onerror=function() {
			ClAlerta.marcar({tit:"Imágen "+mino ,inte:"<div>Error:No se pudo cagar la imágen</div>"});
		}
		thumb.src=this.imgurl;
	}
	function lista_imagenes() {
		if (datfile.haynombre()){
			showImgerror("Ya existe una imágen, para añadir una imágen nueva antes tienes que eliminar esta.");
			datfile.fileField.value="";
			return;
		}
		datfile.ventana.cerrar();
		controladorPrincipal.menuImagenes(true);
		return
		datfile.botonlistar.disabled=true;
		hUtils.xJson({url:URLLISTAR,datos:window.JSON.stringify({ope:"ins"}),formu:true}).then(function(dat){
				  		console.log("respuesta lista imagenes =",dat);
				  		datfile.botonlistar.disabled=false;//a:{id:"prin"} a:{id:"sec"}
				  		var ddd={},elimg=hUtils.crearElemento({e:"div", hijos:[{e:"h4",inner:"Imágenes Generales:"},{e:"div",did:"prin"},{e:"h4",inner:"Imágenes Tienda:"},{e:"div",did:"sec"}]},ddd);
				  		//,{e:"div",hijos:[{e:"label",did:"res",inner:"<span>Nínguna imágen seleccionada.</span>",hijos:[{e:"button",did:"botenvimglis",c:{visibility:"hidden"},a:{className:"btn btn-primary"},inner:"Enviar"}]}]}
				  		datfile.listaimg.innerHTML="";
				  		if (dat.prin.length==0)
				  			ddd.prin.innerHTML="<label>( Sin imágenes )</label>";
				  		else
				  			for (var i=0;i<dat.prin.length;i++){
					  			var aref=document.createElement("a");
					  			aref.innerHTML=dat.prin[i][0];
					  			aref.href="javascript:void(0);"
					  			aref.imgurl=dat.prin[i][1];
					  			aref.did=dat.prin[i][2];
					  			ddd.prin.appendChild(aref);
					  			aref.onclick=seleccionar_imagen;
					  		}
					  	if (dat.tien.length==0)
				  			ddd.sec.innerHTML="<label>( Sin imágenes )</label>";
				  		else
					  		for (var i=0;i<dat.tien.length;i++){
					  			var aref=document.createElement("a");
					  			aref.innerHTML=dat.tien[i][0];
					  			aref.href="javascript:void(0);"
					  			aref.imgurl=dat.tien[i][1];
					  			aref.did=dat.tien[i][2];
					  			ddd.sec.appendChild(aref);
					  			aref.onclick=seleccionar_imagen;
					  		}
				  		datfile.imglis=ddd; //{ botenviar:ddd.botenvimglis,sel:ddd.res };
				  		datfile.listaimg.appendChild(elimg);
				  }).fail(function(dat){
				  		datfile.botonlistar.disabled=false;
				  		console.log("recibo error en lista_imagenes =",dat);
				  });
	}
	function eliminarImagen() {
		if (confirm("¿Seguro que deseas eliminar esta imágen?")){
			hUtils.xJson({url:URLELIMINAR,datos:"&nom="+datfile.nombre+"&kfg="+datfile.propietario.keyControler,formu:true}).then(function(dat){
				  		console.log("Imágen eliminada");
				  		console.log(dat);
				  		datfile.fileimage.innerHTML="<p>"+dat.ok+"</p>";
				  		//datfile.propietario.keyImg=null;
				  		if (datfile.fileField)
				  			datfile.fileField.value="";
						datfile.divimagen=null;
				  		if (datfile.imgerr!=null){
							datfile.diverror.removeChild(datfile.imgerr);
							datfile.imgerr=null;
						}
						datfile.nombre="Añadir";//datfile.urlimg=null;
				  		if (datfile.imglis){
				  			var hay=false,xx=datfile.imglis.prin.getElementsByTagName("a");
				  			for (var i=0,lon=xx.length;i<lon;i++)
				  				if (xx[i].imgurl==datfile.propietario.ImgUrl){
				  					datfile.imglis.prin.removeChild(xx[i]);
				  					if (xx[i].yaesta) datfile.imglis.prin.removeChild(xx[i].nueimg);
				  					hay=true;break;
				  				}
				  			if (!hay){
				  				xx=datfile.imglis.sec.getElementsByTagName("a");
					  			for (var i=0,lon=xx.length;i<lon;i++)
					  				if (xx[i].imgurl==datfile.propietario.ImgUrl){
					  					datfile.imglis.sec.removeChild(xx[i]);
					  					if (xx[i].yaesta) datfile.imglis.sec.removeChild(xx[i].nueimg);
					  					break;
					  				}
				  			}
				  		}
				  		if (datfile.cb) datfile.cb("elim");
				  }).fail(function(dat){
				  		console.log("recibo error en on error =");
				  		console.log(dat);
				  });
			/* hUtils.xJson({url:URLELIMINAR,onok:function(dat){
				  		console.log("Imágen eliminada");
				  		console.log(dat);
				  		datfile.fileimage.innerHTML="<p>"+dat.ok+"</p>";
				  		datfile.propietario.keyImg=null;
				  		datfile.fileField.value="";
				  		if (datfile.cb) datfile.cb("elim");
				  },onerror:function(dat){
				  		console.log("recibo error en on error =");
				  		console.log(dat);
				  },datos:"&kfg="+datfile.propietario.keyImg,formu:true});*/

		}
	}
	function imagenVer(){
		//if (!controladorTienda.haytienda()) return;
		//var ruta=datfile.urlimg; // "imagenes/todasimagenes/"+datfile.nombre;//"imagenes/"+controladorTienda.haytienda()+"/"+datfile.nombre;
		//if (datfile.divimagen && ultImgKey==ruta) return;
		var extension = (datfile.nombre.substring(datfile.nombre.lastIndexOf("."))).toLowerCase();
		var thumb=new Image(),fh4={};
		datfile.fileimage.innerHTML="";
		datfile.fileimage.appendChild(datfile.divimagen=hUtils.crearElemento(
	    		{e:"div",c:{position:"relative"},
	    		hijos:[{e:"button",a:{className:"button3 rojo botabsce",title:"Eliminar imágen",onclick:eliminarImagen},inner:"Eliminar <span aria-hidden='true' class='icon-remove'></span>&nbsp;"},
	    		{e:"h4",did:"titimg",inner:datfile.nombre+", tipo:("+ extension + ") - " + (datfile.tama ? Math.round(parseInt(datfile.tama) / 1024) +"KB,": ",")}]},fh4));// +" ancho:"+this.width+"px, alto:"+this.height+"px"
		thumb.onload=function() {
			//datfile.fileimage.innerHTML="";
			ultImgKey=this.src; //datfile.urlimg;crearElementox
	    	//datfile.fileimage.appendChild(datfile.divimagen=hUtils.crearElemento(
	    	//	{e:"div",c:{position:"relative"},
	    	//	hijos:[{e:"button",a:{className:"button3 rojo botabsce",title:"Eliminar imágen",onclick:eliminarImagen},inner:"Eliminar <span aria-hidden='true' class='icon-remove'></span>&nbsp;"},
	    	//			{e:"h4",inner:datfile.nombre+", tipo:("+ extension + ") - " + (datfile.tama ? Math.round(parseInt(datfile.tama) / 1024) +"KB,": ",") +" ancho:"+this.width+"px, alto:"+this.height+"px"}]},null));	
	    	fh4.titimg.innerHTML=datfile.nombre+", tipo:("+ extension + ") - " + (datfile.tama ? Math.round(parseInt(datfile.tama) / 1024) +"KB,": ",") +" ancho:"+this.width+"px, alto:"+this.height+"px";
	    	datfile.divimagen.appendChild(thumb);
		}
		thumb.onerror=function() {
			fh4.titimg.innerHTML="<strong style='color:red'>ERROR: no se pudo cargar la imágen</strong>";
		}
		thumb.src=datfile.propietario.ImgUrl;// urlimg;
	}
	function imagenServidor(obj){
		var thumb=new Image(),fh4={};
		//var ruta="imagenes/todasimagenes/"+datfile.nombre;//"imagenes/"+controladorTienda.haytienda()+"/"+datfile.nombre;
		//datfile.urlimg=obj.url;
		datfile.tama=obj.tama;
		datfile.nombre=obj.nombre;
		datfile.fileimage.innerHTML="";
		datfile.fileimage.appendChild(datfile.divimagen=hUtils.crearElemento(
	    		{e:"div",c:{position:"relative"},
	    		hijos:[{e:"button",a:{className:"button3 rojo botabsce",title:"Eliminar imágen",onclick:eliminarImagen},inner:"Eliminar <span aria-hidden='true' class='icon-remove'></span>&nbsp;"},
	    				{e:"h4",did:"titimg",inner:obj.nombre+", tipo:("+ obj.tipo + ") - " + (obj.tama ? Math.round(parseInt(obj.tama) / 1024) +"KB,": ",")} ]},fh4));//+" ancho:"+this.width+"px, alto:"+this.height+"px"}
		thumb.onload=function() {
			
			ultImgKey=obj.url;
	    	/*datfile.fileimage.appendChild(datfile.divimagen=hUtils.crearElemento(
	    		{e:"div",c:{position:"relative"},
	    		hijos:[{e:"button",a:{className:"button3 rojo botabsce",title:"Eliminar imágen",onclick:eliminarImagen},inner:"Eliminar <span aria-hidden='true' class='icon-remove'></span>&nbsp;"},
	    				{e:"h4",inner:obj.nombre+", tipo:("+ obj.tipo + ") - " + (obj.tama ? Math.round(parseInt(obj.tama) / 1024) +"KB,": ",") +" ancho:"+this.width+"px, alto:"+this.height+"px"}]},null));*/
	    	fh4.titimg.innerHTML=obj.nombre+", tipo:("+ obj.tipo + ") - " + (obj.tama ? Math.round(parseInt(obj.tama) / 1024) +"KB,": ",") +" ancho:"+this.width+"px, alto:"+this.height+"px";
	    	datfile.divimagen.appendChild(thumb);
	    	if (datfile.cb) datfile.cb("nueva",obj);
			
		}
		thumb.onerror=function() {
			fh4.titimg.innerHTML="<strong style='color:red'>ERROR: no se pudo cargar la imágen</strong>";
		}
		thumb.src=obj.url; //ruta; //URLVERIMAGEN+"?kfg="+obj.key;
	}
	function comprobarFile(files){
		if (datfile.imgerr!=null){
				datfile.diverror.removeChild(datfile.imgerr);
				datfile.imgerr=null;
			}
		if (datfile.propietario==null){
			showImgerror("Antes de añadir una imágen tienes que dar de alta "+datfile.tipo);
			datfile.fileField.value="";
			return;
		}
		var file=files[0];


		if (file){
			if (file.type.search(/image\/.*/) != -1 && file.type.indexOf("svg") ==-1) {
				var tama=Math.round(file.size/1024);
				if (tama>datfile.limit) {
					showImgerror("Este archivo ("+file.name+") es demasiado grande:"+tama+"KB<br>el límite de subida es de "+datfile.limit+"KB.");
					datfile.fileField.value="";
					return;
				}
				if (datfile.haynombre()){
					showImgerror("Ya existe una imágen, para añadir una imágen nueva antes tienes que eliminar esta.");
					datfile.fileField.value="";
					return;
				}
	            if (datfile.propietario.keyControler != null) {
		          var formData = new FormData();
				  formData.append('img', file);
				   hUtils.xJson({url:URLNUEVA+"?idti="+datfile.propietario.keyControler+"&tama="+datfile.limit,datos:formData,formu:false}).then(function(dat){
				  		console.log("recibo ok en onok fileapinew comprobarfile=");
				  		console.log(dat);
				  		//console.log("url="+dat.url);
				  		//var fr = new FileReader();
			            //fr.file = file;
			            //fr.onloadend = function() {
			            	imagenServidor({nombre:file.name,tama:file.size,tipo:file.type,url:dat.url});
			           // }; 
			            //fr.readAsDataURL(file);

				  }).fail(function(er){
				  		console.log("recibo error en on error ="+er);
				  		console.log(er);
				  		datfile.fileField.value="";
				  });
				 /* hUtils.xJson({url:URLNUEVA+"?idti="+datfile.propietario.keyControler+"&tama="+datfile.limit,onok:function(dat){
				  		console.log("recibo ok en onok fileapinew comprobarfile=");
				  		console.log(dat);
				  		console.log("key="+dat.key);
				  		var fr = new FileReader();
			            //fr.file = file;
			            fr.onloadend = function() {
			            	imagenServidor({nombre:file.name,tama:file.size,tipo:file.type,key:dat.key});
			            }; 
			            fr.readAsDataURL(file);

				  },onerror:function(dat){
				  		console.log("recibo error en on error =");
				  		console.log(dat);
				  },datos:formData,formu:false});*/
				} else
					showImgerror("Antes de añadir una imágen tienes que dar de alta "+datfile.tipo);

			}else {
				showImgerror("Este archivo ("+file.name+") no es una imágen." );
			}
			datfile.dropZone.className="filezone fileDrop";
		}
		
	}
	
	function showImgerror(s){
		if (datfile.imgerr!=null)
			datfile.diverror.removeChild(datfile.imgerr);
		datfile.imgerr=document.createElement("div");
		datfile.imgerr.className="cuamensa";
		datfile.imgerr.innerHTML=s;
		//if (datfile.fileimage.firstChild)
		 //	datfile.fileimage.insertBefore(datfile.imgerr,datfile.fileimage.firstChild);
	 	//else
	 		datfile.diverror.appendChild(datfile.imgerr);
	 		datfile.ventana.sombra.scrollTop=0;
		/*if (!ad) {
			datfile.fileimage.innerHTML="";
		 	datfile.fileimage.appendChild(acm);
		} else {
		 	
		 }*/
	}
	var apiNew={ 
		init:function() {
			console.log("estroy en fileapinew :");
			console.log(datfile);
			datfile.fileField.onchange =this.inputFile;
		    datfile.dropZone.addEventListener("dragenter",  this.stopProp, false);
		    datfile.dropZone.addEventListener("dragleave",  this.dragExit, false);
		    datfile.dropZone.addEventListener("dragover",  this.dragOver, false);
		    datfile.dropZone.addEventListener("drop",  this.showDroppedFiles, false);
		},
	    inputFile:function(e){
	    	comprobarFile(this.files);
	    },
	    dragOver : function (ev) {
	        ev.stopPropagation();
	        ev.preventDefault();
	    },
	    dragExit : function (ev) {
	        ev.stopPropagation();
	        ev.preventDefault();
	    },
	    stopProp:function (ev) {
	        ev.stopPropagation();
	        ev.preventDefault();
	        this.className="filezone fileDrop fileDropOver";
	    },
	    showDroppedFiles:function (ev) {
	        ev.stopPropagation();
	        ev.preventDefault();
	        if (ev.dataTransfer.files.length>0 ) {
	        	datfile.nomima.innerHTML="<br> "+ev.dataTransfer.files[0].name;
	        	comprobarFile(ev.dataTransfer.files);
	    	}else 
	    		datfile.dropZone.className="filezone fileDrop";
	    }
	    
	} 
	function enviar_url(){
		if (datfile.haynombre()){
			showImgerror("Ya existe una imágen, para añadir una imágen nueva antes tienes que eliminar esta.");
			datfile.fileField.value="";
			return;
		}
		var nurl=datfile.objurl.comprobar();
		if (nurl){
			var thumb=new Image();
			thumb.onload=function() {
				if (this.width>300 || this.height>200){
					datfile.objurl.seterror("Las dimensiones de esta imágen son demasiado grandes. Debe de ser menor de 300px de ancho y 200px de alto (recomendamos 237px de ancho y 173px de alto)");
					datfile.botobjurl.disabled=false;
					return;
				}
				var tip=nurl.lastIndexOf(".");
				if ( tip>-1) tip=nurl.substring(tip+1);
				else tip="Desconocido";
				var obj={nombre:nurl.substring(nurl.lastIndexOf("/")+1),url:nurl};
				hUtils.xJson({url:URLIMGURL,datos:window.JSON.stringify({ope:"ins",idti:datfile.propietario.keyControler,ti:tip,nombre:obj.nombre,url:nurl}),formu:true}).then(function(dat){
					datfile.fileimage.innerHTML="";
					ultImgKey=nurl;
			    	datfile.fileimage.appendChild(datfile.divimagen=hUtils.crearElemento(
			    		{e:"div",c:{position:"relative"},
			    		hijos:[{e:"button",a:{className:"button3 rojo botabsce",title:"Eliminar imágen",onclick:eliminarImagen},inner:"Eliminar <span aria-hidden='true' class='icon-remove'></span>&nbsp;"},
			    				{e:"h4",inner:obj.nombre+", tipo:("+ tip + ") - ancho:"+thumb.width+"px, alto:"+thumb.height+"px"}]},null));
			    	datfile.divimagen.appendChild(thumb);
			    	if (datfile.cb) datfile.cb("nueva",obj);
			    }).fail(function(er){
					console.log("se recibio error al enviar url de imágen="+er);
			    });
			    datfile.botobjurl.disabled=false;
				
			}
			thumb.onerror=function() {
				datfile.objurl.seterror("Se ha producido un error al cargar esta url:"+nurl);
				datfile.botobjurl.disabled=false;
			}
			thumb.src=nurl;
			datfile.botobjurl.disabled=true;
			datfile.objurl.set("");
		}
	}
	var objapi={
		imagen:function(dat,pro,ti,li,nom,cb) { //,urlimg) {
			if (!datfile){
				datfile={
					propietario:null,
					imgerr:null,
					cb:null,
					nombre:null,
					limit:null,
					//urlimg:null,
					haynombre:function() {
						//console.log("nombre imagen="+this.nombre);
						return this.nombre.length > 0 && this.nombre.indexOf("Añadir") < 0;
					},
					datos:function(dat1,pro1,ti1,li1,nom1,cb1) { // ,urlimg1){
						if (dat1){
							this.propietario=dat1.propietario;
							this.tit=dat1.tipo;
							this.limit=dat1.limit || 100;
							this.nombre=dat1.nombre;
							this.cb=dat1.cb;
							//this.urlimg=dat1.urlimg;
						}else {
							this.propietario=pro1;
							this.tit=ti1;
							this.limit=li1 || 100;
							this.nombre=nom1;
							this.cb=cb1;
							//this.urlimg=urlimg1;
						}
						datfile.ventana.tit.innerHTML="Imágen "+this.tit;
					}
				}
				var aux2=document.createElement("div");
				aux2.className="conclase-modpiz";
				if (typeof FileReader == "undefined"){
					datfile.conte=hUtils.crearElemento({e:"div",a:{className:"com-labinput"}, 
						hijos:[{e:"div",did:"diverror"},{e:"div",did:"contenido",
							hijos:[{e:"div",did:"fileimage",a:{className:"filezone"} },{e:"h2",inner:"CAMBIAR IMAGEN"},{e:"h3",inner:"- Puedes introducir una url"},{e:"div",did:"divurl"},
							{e:"h3",inner:"- o puedes seleccionar un archivo:"},
				 			{e:"iframe",a:{name:"iframeimagen",id:"iframeimagen",src:URLFRAME,width:"300", height:"60", frameborder:"0",marginwidth:"0", marginheight:"0"},did:"iframeimg"},
				 			{e:"div",a:{className:"listaimg"},hijos:[{e:"h3",inner:"- o Seleccionar un imágen de la Base de Datos:"},{e:"button",did:"botonlistar",a:{className:"btn btn-primary",onclick:lista_imagenes},inner:"Listar Imágenes"}, {e:"div",did:"listaimg"}]}				 			
				 			]}]},datfile);
					/*datfile.conte=hUtils.crearElemento({e:"div",a:{className:"com-labinput"}, 
						hijos:[{e:"div",did:"diverror"},{e:"div",did:"contenido",
							hijos:[{e:"h2",inner:"CAMBIAR IMAGEN"},{e:"h3",inner:"- Puedes introducir una url"},{e:"div",did:"divurl"},
							{e:"h3",inner:"- o puedes seleccionar un archivo:"},
				 			{e:"form", did:"miform", a:{method:"post", enctype:"multipart/form-data", target:"iframeimagen"},
				 			hijos:[{e:"input",did:"img", a:{type:"file",id:"img",name:"img",onchange:comprueba_extension}}]},
				 			{e:"div",did:"fileimage",a:{className:"filezone"} },
				 			{e:"div",a:{className:"listaimg"},hijos:[{e:"h3",inner:"- o Seleccionar un imágen de la Base de Datos:"},{e:"button",did:"botonlistar",a:{className:"btn btn-primary",onclick:lista_imagenes},inner:"Listar Imágenes"}, {e:"div",did:"listaimg"}]},
				 			{e:"iframe",a:{name:"iframeimagen",id:"iframeimagen"},did:"iframeimg",c:{display:"none",width:"0px",height:"0px",border:"0"}}
				 			]}]},datfile);*/
					//,{e:"input",did:"idti",a:{type:"hidden",id:"idti",name:"idti"}},{e:"input",a:{type:"hidden",value:1,id:"frame",name:"frame"}},{e:"input",a:{type:"hidden",value:100,id:"tama",name:"tama"}}
							datfile.avisoiframe=false;
							
				}else {
				 		datfile.conte=hUtils.crearElemento({e:"div",a:{className:"com-labinput"},
				 			hijos:[{e:"div",did:"diverror"},{e:"div",did:"contenido",
				 			hijos:[{e:"div",did:"fileimage",a:{className:"filezone"}},{e:"h2",inner:"CAMBIAR IMAGEN"},{e:"h3",inner:"- Puedes introducir una url"},{e:"div",did:"divurl"},
				 			{e:"h3",inner:"- o puedes seleccionar un archivo:"},
				 			{e:"form", a:{method:"post", enctype:"multipart/form-data"},
				 			hijos:[{e:"input",did:"fileField", a:{type:"file"}}]},
				 			{e:"div",did:"dropZone",a:{className:"filezone fileDrop"},hijos:[{e:"p",inner:"(zona Drop) Arrastra una imágen aquí", hijos:[{e:"span",did:"nomima"}]}]},
				 			{e:"div",a:{className:"listaimg"},hijos:[{e:"h3",inner:"- o selecciona una imágen ",hijos:[{e:"button",did:"botonlistar",a:{className:"btn btn-primary",onclick:lista_imagenes},inner:"Listar Imágenes"}]}, {e:"div",did:"listaimg"}]}] }]},datfile );
				 			apiNew.init();
				 			//{e:"h3",inner:"- O arrastrar un archivo a la zona Drop:"},
				}
				datfile.objurl=new ClabInput({la:"URL ",masla:"<span class='letpeque'>( la imágen no se subirá a este servidor)</span>",lon:200,padre:datfile.divurl});
				datfile.botobjurl=document.createElement("button");
				datfile.botobjurl.className="btn btn-primary";
				datfile.botobjurl.innerHTML="Enviar url";
				datfile.botobjurl.onclick=enviar_url;
				datfile.divurl.appendChild(datfile.botobjurl);
				aux2.appendChild(datfile.conte);
				datfile.ventana=new ClsVentanasTipo.popup({
						titulo:"Imágen "+ (dat ? dat.tipo : ti),
						contenido:aux2,
						cancelar:true
					});
			}else {
				if (datfile.imgerr!=null){
					datfile.diverror.removeChild(datfile.imgerr);
					datfile.objurl.outerror();
					datfile.imgerr=null;
				}
				
			}
			datfile.datos(dat,pro,ti,li,nom,cb); //,urlimg);
			if (datfile.haynombre()) imagenVer();
			else if (datfile.fileimage) datfile.fileimage.innerHTML="";
			datfile.ventana.show();
		},
		planImagenes:{
			secciones:{},
			modo_sel:false,
			modo_seleccion:function(m){
				if (m){
					this.modo_sel=this.nueva_sec("Modo Selección de imágen para artículo: "+datfile.tit);
					this.modo_sel.className="sec_imagenes modo_seleccion";
					var ud=document.createElement("button");
					ud.className="btn btn-info";
					ud.innerHTML="Desactivar modo selección";
					ud.onclick=function() {
						objapi.planImagenes.secciones.pizzas.parentNode.removeChild(objapi.planImagenes.modo_sel);
						objapi.planImagenes.modo_sel=false;
					}
					this.modo_sel.appendChild(ud);
					this.secciones.pizzas.parentNode.insertBefore(this.modo_sel, this.secciones.pizzas);
				}else{
					this.secciones.pizzas.parentNode.removeChild(this.modo_sel);
					this.modo_sel=false;
				}
			},
			nueva_sec:function(tit){
				var bloq=document.createElement("div"), htit=document.createElement("h3"),bl;
				bloq.className="sec_imagenes";
				htit.innerHTML=tit;
				bloq.appendChild(htit);
				return bloq;
			},
			elim_secc:function(nsec,nid) {
				if (nsec=="otr" && this.secciones.otros[nid]){
					this.sec_otr.removeChild(this.secciones.otros[nid])
				}else if (nsec=="otrx"  && this.secciones.otrosx[ni])
					this.sec_otrx.removeChild(this.secciones.otrosx[nid]);
			},
			add_secc:function(nsec,nid,tit) {
				if (nsec=="otr"){
					if (!this.secciones.otros[nid]){
						this.sec_otr.appendChild(this.nueva_sec( tit || controladorOtros.nombreOtro(nid)));
					}
				}else if (nsec=="otrx"){
					if (!this.secciones.otrosx[nid]){
						this.sec_otrx.appendChild(this.nueva_sec( tit || controladorOtroscomplex.nombreOtrox(nid)));
					}
				}
			},
			cambiar_secc:function(nsec,nid,tit) {
				if (nsec=="otr"){
					if (this.secciones.otros[nid]){
						this.secciones.otros[nid].getElementsByTagName("h3")[0].innerHTML=tit;
					}
				}else if (nsec=="otrx"){
					if (this.secciones.otrosx[nid]){
						this.secciones.otrosx[nid].getElementsByTagName("h3")[0].innerHTML=tit;
					}
				}
			},
			cambiar_bloq_img:function(pro,niduo,nid,tit) {
				var pros={
					piz:this.secciones.pizzas,
					ofer:this.secciones.ofertas,
					otr:this.secciones.otros[nid],
					otrx:this.secciones.otrosx[nid]
				}
				var misec=pros[pro].getElementsByTagName("div");
				for (var i=0;i<misec.length;i++){
					if (misec[i].getAttribute("data-did")==niduo){
						misec[i].getElementsByTagName("label")[1].innerHTML="<small>Artículo:</small><br>"+tit;
						return;
					}
				}
			},
			add_bloq_img:function(pro,inom,isrc,iart,niduo,nid){
				var pros={
					piz:this.secciones.pizzas,
					ofer:this.secciones.ofertas,
					otr:function() {
						if (this.secciones.otros[nid])
							return this.secciones.otros[nid];
						var bloq=this.nueva_sec(controladorOtros.nombreOtro(nid));
						this.secciones.otros[nid]=bloq;
						this.sec_otr.appendChild(bloq);
						return bloq;
					},
					otrx:function() {
						if (this.secciones.otrosx[nid])
							return this.secciones.otrosx[nid];
						var bloq=this.nueva_sec(controladorOtroscomplex.nombreOtrox(nid));
						this.secciones.otrosx[nid]=bloq;
						this.sec_otrx.appendChild(bloq);
						return bloq;
					}
				}
				if (niduo !==null)
					niduo=pro+"-"+niduo;
				else
					niduo=pro;
				pros[pro].appendChild(hUtils.crearElemento({e:"div",atr:{"data-did":nid,"data-pro":pro}, a:{className:"bloq_imagen"},listener:{click:this.sel_bloq_img},hijos:[
							{e:"div",inner:"<img src='"+isrc+"'>"},{e:"div",a:{className:"dato_ima"},hijos:[
								{e:"label",inner:inom },{e:"label",inner:"<small>Artículo:</small><br>"+iart }]}]},null));
			},
			eliminar_bloq_img:function(pro,niduo,nid){
				var pros={
					piz:this.secciones.pizzas,
					ofer:this.secciones.ofertas,
					otr:this.secciones.otros[nid],
					otrx:this.secciones.otrosx[nid]
				}
				var misec=pros[pro].getElementsByTagName("div");
				for (var i=0;i<misec.length;i++){
					if (misec[i].getAttribute("data-did")==niduo){
						misec[i].parentNode.removeChild(misec[i]);
						return;
					}
				}
				
			},
			enviar_url:function(obj,esok){
				if (esok) {
					hUtils.xJson({url:URL_img_sel,datos:window.JSON.stringify({ope:"ins",idorigen:obj.keyControler,iddestino:datfile.propietario.keyControler,nomimaorigen:obj.nomimaorigen}),formu:true}).then(function(dat){
						console.log("respuesta enviar_img_sel =",dat);
						//imagenServidor(dat);
					}).fail(function(dat){
				  		console.log("recibo error en enviar_img_sel =",dat);
				  		//showImgerror(dat);
				  	});
				}
				objapi.planImagenes.modo_seleccion(false);
			},
			sel_bloq_img:function(ev){
				var atr=this.getAttribute("data-pro"),res;
				if (atr=="piz"){
					//objapi.planImagenes.eliminar_bloq_img("piz", this.getAttribute("data-did"));
					//objapi.planImagenes.add_bloq_img("piz","Pizza nueva",this.getElementsByTagName("img")[0].src,"Pizza nueva",null, this.getAttribute("data-did"));
					res=controladorMasasTamas.cambiar_Imagen( this.getAttribute("data-did"));
				}else if (atr=="ofe"){
					//objapi.planImagenes.eliminar_bloq_img("ofer", this.getAttribute("data-did"));
					//objapi.planImagenes.add_bloq_img("ofer","ofe nueva",this.getElementsByTagName("img")[0].src,"ofe nueva",null, this.getAttribute("data-did"));
					res=controladorOfertas.cambiar_Imagen(this.getAttribute("data-did"));
				}else {
					atr=atr.split("-");
					if (atr[0]=="otr"){
						//objapi.planImagenes.eliminar_bloq_img("otr", this.getAttribute("data-did"),atr[1]);
						//objapi.planImagenes.add_bloq_img("otr","OTR NUEVO",this.getElementsByTagName("img")[0].src,"otr nuevo",this.getAttribute("data-did"), atr[1]);
						res=controladorOtros.cambiar_Imagen(this.getAttribute("data-did"),atr[1]);
					}else if (atr[0]=="otrx"){
						//objapi.planImagenes.eliminar_bloq_img("otrx", this.getAttribute("data-did"),atr[1]);
						//objapi.planImagenes.add_bloq_img("otrx","OTRxxx NUEVO",this.getElementsByTagName("img")[0].src,"otrxxx nuevo",this.getAttribute("data-did"), atr[1]);
						res=controladorOtroscomplex.cambiar_Imagen(this.getAttribute("data-did"),atr[1]);
					}
				}
				console.log("modesel=",objapi.planImagenes.modo_sel);
				if (objapi.planImagenes.modo_sel){
					console.log("sisisisi mode sel res=",res);
					var ddii=document.createElement("div");
					ddii.innerHTML="<p>Imágen:"+res.nomimaorigen+", tipo:"+ (res.nomimaorigen.substring(res.nomimaorigen.lastIndexOf("."))).toLowerCase()+"</p><h4> ¿Deseas seleccionar esta imágen para artículo "+datfile.tit+" ?</h4>";
					ddii.appendChild(this.getElementsByTagName("img")[0].cloneNode());
					ClAlerta.marcar({tit:"Imágen de "+res.nomarti ,inteobj:ddii,f:objapi.planImagenes.enviar_url,ob:res });

				}
			},
			pintarImagenes:function(tit,alim,dpa,pro){
				if (alim.length< 1) return null;
				var bloq=this.nueva_sec(tit);
				for (var i=0;i<alim.length;i++){
					bloq.appendChild(hUtils.crearElemento({e:"div",atr:{"data-did":alim[i][1],"data-pro":pro}, a:{className:"bloq_imagen"},listener:{click:this.sel_bloq_img},hijos:[
							{e:"div",inner:"<img src='"+alim[i][2]+"'>"},{e:"div",a:{className:"dato_ima"},hijos:[
								{e:"label",inner:alim[i][3] },{e:"label",inner:"<small>Artículo:</small><br>"+alim[i][0] }]}]},null));
				}
				dpa.appendChild(bloq);
				return bloq;
			},
			crear:function(dpa) {
				this.secciones.pizzas=this.pintarImagenes("Pizzas",controladorMasasTamas.dameImagenes(),dpa,"piz");
				var otr=controladorOtros.dameImagenes();
				this.sec_otr=document.createElement("div");
				dpa.appendChild(this.sec_otr);
					this.secciones.otros={};
					for (var i=0;i<otr.length;i++){
						this.secciones.otros[otr[i].secc[1]]=this.pintarImagenes(otr[i].secc[0], otr[i].datsec,this.sec_otr,"otr-"+otr[i].secc[1]);
					}
				
				var otrx=controladorOtroscomplex.dameImagenes();
				this.sec_otrx=document.createElement("div");
				dpa.appendChild(this.sec_otrx);
					this.secciones.otrosx={};
					for (var i=0;i<otrx.length;i++){
						this.secciones.otrosx[otrx[i].secc[1]]=this.pintarImagenes(otrx[i].secc[0], otrx[i].datsec,this.sec_otrx,"otrx-"+otrx[i].secc[1]);
					}
				
				this.secciones.ofertas=this.pintarImagenes("Ofertas",controladorOfertas.dameImagenes(),dpa,"ofe");		
			},
			inicio:function(dpa){
				var d=document.createElement("div");
				d.className="marco-hijo";
				this.crear(d);
				dpa.appendChild(d);
				return d;
			}
		},
		verImagen:function(){
			console.log("vamos a ver imagen datfile=",datfile);
			var pp=datfile.nombre.lastIndexOf(".");
			var extension = (datfile.nombre.substring(pp)).toLowerCase();
			imagenServidor({nombre:datfile.nombre,tipo:extension});
		},
		eliminar:function() {
			datfile.conte.parentNode.removeChild(datfile.conte);
			//datfile.propietario.keyImg=null;
		},
		respuesta:function(obj){
			console.log("recibimos respuesta de iframe=");
			console.log(obj);
			datfile.avisoiframe=true;
			if (obj)
				if (obj.ok){
					console.log("nombre:"+obj.nombre+", url="+obj.url);
					imagenServidor(obj);
				}else if (obj.error)
					showImgerror("error="+obj.error);
			//datfile.iframeimg.parentNode.removeChild(datfile.iframeimg);
		},
		c_extension:function(thisar,dmiform) {
			if (datfile.imgerr!=null){
					datfile.diverror.removeChild(datfile.imgerr);
					datfile.imgerr=null;
				}
			var archivo=thisar.value;
			if (!archivo){
				showImgerror("No has seleccionado ningún archivo");
				return null;
			}
			var extensiones_permitidas = new Array(".gif", ".jpg", ".png", ".jpeg"); 
			var pp=archivo.lastIndexOf(".");
			var extension = (archivo.substring(pp)).toLowerCase();
			if (extensiones_permitidas.indexOf(extension)==-1){
				showImgerror("El archivo debe de ser una imagen con extensión: .jpg,.jpeg,.png,.gif");
				return null;
			}
			if (datfile.haynombre()){
				showImgerror("Ya existe una imágen, para añadir una imágen nueva antes tienes que eliminar esta.");
				thisar.value="";
				return null;
			}
			if (datfile.propietario!=null && datfile.propietario.keyControler != null) {
				datfile.avisoiframe=false;
				//datfile.idti.value=datfile.keyControler;
				dmiform.action=URLNUEVA+"?idti="+datfile.propietario.keyControler+"&tama="+datfile.limit+"&frame=true";
				datfile.iframeimg.onload=function(){
					console.log("iframe cargado");
					if (!datfile.avisoiframe)
						window.setTimeout(iframeerrorservidor,2000);
				}
				dmiform.submit();
			}else
				console.log("idtienda no hayyy es null");
		}
	}
	return objapi;
})();