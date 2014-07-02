
var controladorTienda=(function(){
	var tienda={},datjson={},
	ventana,
	venMod=null,
	URLFRAME_JSON="/admintienda/Tiendas/framejson",
	URLSUBIR_JSON="/admintienda/Tiendas/subirjson",
	cammod, urltienda="/admintienda/Tiendas/tienda",
	_fpago=[["En Efectivo",0],["Con Tarjeta",1],["En Efectivo y Tarjeta",2]],
	USO_HORARIO=[["Europe/Madrid",0],["Atlantic/Canary-Europe/London-Europe/Lisboa",1]],
	_dias=["LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO","FESTIVOS"],crono=null;
	var planpo={
		urlpagos:"/admintienda/Tiendas/pagpaypal",
		urlpagPagantis:"/admintienda/Tiendas/pagpagantis",
		pventana:null,
		eles:{},
		actual:0,
		ponersuple:function(ev){
			var e = ev || window.event;
			if (e.target){
				e=e.target;
				var so=e.tagName.toUpperCase();
			}else {
				e=e.srcElement;
				var so=e.nodeName.toUpperCase();
			}
			var ch=planpo.eles.haysuple;
			if (so=="H3")
				ch.checked=!ch.checked;
			if (ch.checked){
				planpo.eles.divsuple.style.display="block";
			}else
				planpo.eles.divsuple.style.display="none";
		},
		seterror:function(ele,s){
			var aux=this.eles[ele+"error"]=document.createElement("div");
			aux.className="com-error";
			aux.innerHTML=s;
			this.eles[ele].parentNode.appendChild(aux);
			this.eles[ele].focus();
		},
		outerror:function(ele){
			var aux=this.eles[ele+"error"];
			if (aux){
				aux.parentNode.removeChild(aux);
				this.eles[ele+"error"]=null;
			}
		},
		_valores_inc_des:function(tipa) {
			if (tipa.inc_des != 0){
				this.eles.haysuple.checked=true;
				this.eles.valsuple.setsw(tipa.inc_des,tipa.poroeur ? 1 : 0)
				this.eles.divsuple.style.display="block";
				this.eles.cadesuple.value=tipa.stringsuple;
			}else{
				this.eles.haysuple.checked=false;
				this.eles.divsuple.style.display="none";
				this.eles.cadesuple.value="Suplemento Paypal";
			}
			this.eles.modo.seleccionar(tipa.modo ? 1 : 0);
		},
		_init_:function(tit,nd){
			this.div_pay_o_pag=[hUtils.crearElemento({e:"div",hijos:[{e:"div",hijos:[{e:"label",inner:"Código de la cuenta:",a:{className:"bloque"}},{e:"input",did:"co_cu_id",a:{type:"text",placeholder:"cuenta id", className:"bloque"}}]},
				{e:"div",hijos:[{e:"label",inner:"Clave de firma:",a:{className:"bloque"}},{e:"input",did:"cla_fir",a:{type:"text",placeholder:"clave firma", className:"bloque"}}]},
				{e:"div",hijos:[{e:"label",inner:"API key:",a:{className:"bloque"}},{e:"input",did:"api_key",a:{type:"text",placeholder:"api key", className:"bloque"}}]}]},this.eles),
			hUtils.crearElemento({e:"div",hijos:[{e:"div",hijos:[{e:"label",inner:"Client ID:",a:{className:"bloque"}},{e:"input",did:"cliid",a:{type:"text",placeholder:"Client ID", className:"bloque"}}]},
					{e:"div",hijos:[{e:"label",inner:"Secret:",a:{className:"bloque"}},{e:"input",did:"secret",a:{type:"text",placeholder:"Secret", className:"bloque"}}]}]},this.eles)];

			var eled=hUtils.crearElemento({e:"div",a:{className:"conclase-modpiz com-labinput"},hijos:[{e:"h3",inner:"Aplicación"},{e:"div",did:"pay_o_pag"}]},this.eles);
			eled.appendChild(hUtils.crearElemento({e:"div",did:"ult",hijos:[{e:"h3",inner:"Suplemento ",listener:{click:this.ponersuple},hijos:[{e:"input",did:"haysuple",a:{type:"checkbox"} }]},{e:"div",did:"divsuple",hijos:[{e:"label",inner:"Cadena suplemento:",a:{className:"bloque"} },{e:"input",did:"cadesuple",a:{type:"text",className:"bloque"}}]}]},this.eles ));
			var h3=document.createElement("h3"); h3.innerHTML="Modo";
			eled.appendChild(h3);
			this.eles.pay_o_pag.appendChild(this.div_pay_o_pag[nd]);
			var radio=document.createElement("div");
			eled.appendChild(radio);
			this.eles.valsuple=new ClabInpflsw({lon:5,min:-90,la:"Importe de suplemento en € ó %",va:["€","%"],padre:this.eles.divsuple});
			this.eles.modo=new CRadio({opciones:["Pruebas","Real"],selec:0,padre:radio});
			this.pventana=new ClsVentanasTipo.popup({
							titulo:"Pago con "+tit,
							contenido:eled,
							aceptar:{tit:"Enviar", cb:this.cbcomprobar} 
						});
		},
		crear:function(p) {
			
			if (p=="pagantis"){
				var tit="Pagantis",ep=0,tipa=tienda.pagantis;
			}else {
				var tit="Paypal",ep=1,tipa=tienda.paypal;
			}
			if (this.pventana===null) {
				
				this._init_(tit,ep);
				/*var eled=hUtils.crearElemento({e:"div",a:{className:"conclase-modpiz com-labinput"},hijos:[{e:"h3",inner:"Aplicación"},
					{e:"div",hijos:[{e:"label",inner:"Client ID:",a:{className:"bloque"}},{e:"input",did:"cliid",a:{type:"text",placeholder:"Client ID", className:"bloque"}}]},
					{e:"div",hijos:[{e:"label",inner:"Secret:",a:{className:"bloque"}},{e:"input",did:"secret",a:{type:"text",placeholder:"Secret", className:"bloque"}}]},
					{e:"div",did:"ult",hijos:[{e:"h3",inner:"Suplemento ",listener:{click:this.ponersuple},hijos:[
														{e:"input",did:"haysuple",a:{type:"checkbox"} }]},{e:"div",did:"divsuple",hijos:[{e:"label",inner:"Cadena suplemento:",a:{className:"bloque"} },{e:"input",did:"cadesuple",a:{type:"text",className:"bloque"}}]}]},{e:"h3",inner:"Modo:"},{e:"div",did:"radio"}]},this.eles);*/
				
			}else if (this.actual != ep) {
					this.pventana.tit.innerHTML="Pago con "+tit;
					this.eles.pay_o_pag.innerHTML="";
					this.eles.pay_o_pag.appendChild(this.div_pay_o_pag[ep]);
			}
			this.actual=ep;
			if (tipa){
				//console.log("tipa=",tipa);
				if (ep>0){
					this.eles.cliid.value=tipa.clientid;
					this.eles.secret.value=tipa.secret;
					this._valores_inc_des(tipa);
				}else {
					this.eles.co_cu_id.value=tipa.account_id;
					this.eles.cla_fir.value=tipa.clave_firma;
					this.eles.api_key.value=tipa.api_key;
					this._valores_inc_des(tipa);
				}
			}else {
				this.eles.haysuple.checked=false;
				this.eles.divsuple.style.display="none";
				this.eles.cadesuple.value="Suplemento "+tit;
				this.eles.valsuple.datos.ent.value="0";
			}
			this.pventana.show();
		},
		cbcomprobar:function(e){
			if (!tienda.id || tienda.id===null) {
				ClAlerta.marcar({tit:"Error",inte:"Debes de dar de alta la tienda para poder introducir pagos online"});
				return;
			}
			planpo.outerror("cadesuple");
			if (planpo.actual > 0 ){
				planpo.outerror("cliid");
				planpo.outerror("secret");
				var clid=hUtils.stripHtml(planpo.eles.cliid.value);
				if (clid.length<10){
					planpo.seterror("cliid","Client ID no valido. Introduce un código válido.");
					return;
				}
				var sec=hUtils.stripHtml(planpo.eles.secret.value);
				if (clid.length<10){
					planpo.seterror("secret","Secret no valido. Introduce un código válido.");
					return;
				}
			}else {
				planpo.outerror("co_cu_id");
				planpo.outerror("clave_firma");
				planpo.outerror("api_key");
				var cocuid=hUtils.stripHtml(planpo.eles.co_cu_id.value);
				if (cocuid.length<10){
					planpo.seterror("co_cu_id","Código cuenta cliente no valido. Introduce un código válido.");
					return;
				}
				var clafir=hUtils.stripHtml(planpo.eles.cla_fir.value);
				if (clafir.length<10){
					planpo.seterror("cla_fir","Clave de firma errónea. Introduce una clave válida");
					return;
				}
				var ak=hUtils.stripHtml(planpo.eles.api_key.value);
				if (ak.length<10){
					planpo.seterror("api_key","API key errónea. Introduce un identificador de API válido.");
					return;
				}
			}
			var haysu=planpo.eles.haysuple.checked;
			if (haysu){
				var vasu=planpo.eles.valsuple.comprobar();
				if (vasu===false)
					return;
				if (vasu.v<1){
					vasu.seterror("Introduce un número entero o decimal válido.");
					return;
				}
				var cadesu=hUtils.stripHtml(planpo.eles.cadesuple.value);
				if (cadesu.length<5 || cadesu.length>50){
					planpo.seterror("cadesuple","Cadena suplemento tiene que ser una cadena entre 5 y 50 caracteres.");
					return;
				}
				haysu=1;
			}else{
				vasu={v:-1,s:1};
				haysu=-1;
			}

			if (planpo.actual > 0 ){
				var dajson=window.JSON.stringify({ope:"mod",datos:{ci:clid,sec:sec,modo:planpo.eles.modo.sel,haysu:haysu,icdc:vasu.v,ep:vasu.s,cade:cadesu, id:tienda.id }}),lurl=planpo.urlpagPaypal;
			}else {
				var dajson=window.JSON.stringify({ope:"mod",datos:{cocuid:cocuid,clafir:clafir,ak:ak,modo:planpo.eles.modo.sel,haysu:haysu,icdc:vasu.v,ep:vasu.s,cade:cadesu, id:tienda.id }}),lurl=planpo.urlpagPagantis;
			}
			planpo.pventana.aceptar.disabled=true;
			hUtils.xJson({url:lurl,datos:dajson,formu:true}).then(function(res){
				console.log("res=",res);
				if (planpo.actual > 0 )
					tienda.paypal={
						clienitd:clid,
						secret:sec,
						inc_des:vasu.s<=0 ? 0 : vasu.s,
						modo:planpo.eles.modo.sel > 0,
						poroeur:vasu.s > 0,
						stringsuple:cadesu
					}
				else 
					tienda.pagantis={
						account_id:cocuid,
						clave_firma:clafir,
						api_key:ak,
						inc_des:vasu.s<=0 ? 0 : vasu.s,
						modo:planpo.eles.modo.sel > 0,
						poroeur:vasu.s > 0,
						stringsuple:cadesu
					}
				planpo.pventana.cerrar();
				planpo.pventana.aceptar.disabled=false;
			}).fail(function(dat){
				ClAlerta.marcar({tit:"Error",inte:dat});
				planpo.pventana.aceptar.disabled=false;
			});
		}
	}
	//var botact_des=null;
	
	var lis_horarios=null;
	function planPagonline(p) {
		if (p=="paypal")
			return function () { planpo.crear("paypal"); }
		return function () { planpo.crear("pagantis"); }
	}
	function act_des_pagina(nele,elera){
		if ( tienda.id){
			var cambios=controladorPrincipal.getcambio();
			hUtils.xJson({url:"/admintienda/Tiendas/Web", datos:window.JSON.stringify({"ope": nele<1 ? "ins":"del","cambios_art":cambios.cambios_art,"cambios_ima":cambios.cambios_ima}),accion:"POST",formu:true}).then(function(dat){
				console.log("ok en web act des="+dat.ok);
				tienda.web_act_des.seleccionar(nele<1 ? 0 : 1);
				controladorPrincipal.setcambio(0);
				if (elera==="salir"){
					controladorPrincipal.salir();
				}
			}).fail(function(err){
				ClAlerta.marcar({tit:"Error",inte:"Error en servidor al "+(nele<1 ? "Activar" : "Desactivar") +" web:"+err});
			});
		}else {
			tienda.web_act_des.seleccionar(1);
		}
	}
	function respuestajson(obj){
		console.log("recibimos respuesta de iframe=");
		console.log(obj);
		datjson.avisoiframe=true;
		if (obj)
			if (obj.ok){
				console.log("nombre:"+obj.nombre+", url="+obj.url);
			}else if (obj.error)
				datjson.diverrorjson.innerHTML("<p>error="+obj.error+"</p>");
	}
	function json_extension(thisar,dmiform) {
		if (tienda.id ) {
				var err="",numr=controladorOfertas.numRegistros();
				if (numr>0)
					err+="Ofertas tiene "+numr+" registros.\n";
				numr=controladorOtroscomplex.numRegistros();
				if (numr>0)
					err+="Otroscomplex tiene "+numr+" registros.\n";
				numr=controladorOtros.numRegistros();
				if (numr>0)
					err+="Otros productos tiene "+numr+" registros.\n";
				numr=controladorMasasTamas.numRegistros();
				if (numr>0)
					err+="Pizzas tiene "+numr+" registros.\n";
				if (err.length>0){
					alert("Hay registros en:\n"+err+" Antes de copiar debes de eliminar todos los artículos.");
					return;
				}
		}else{
			console.log("idtienda no hayyy es null"); 
			return;
		}
		if (dmiform !== null) {
			var archivo=thisar.value;
			if (!archivo || archivo.length<5){
				datjson.diverrorjson.innerHTML("<p>error=No has seleccionado ningún archivo</p>");
				return null;
			}
			var extensiones_permitidas = new Array(".gif", ".jpg", ".png", ".jpeg"); 
			var pp=archivo.lastIndexOf(".");
			var extension = (archivo.substring(pp)).toLowerCase();
			if (extension !=".json"){
				datjson.diverrorjson.innerHTML("<p>error=El archivo debe extensión .json</p>");
				return null;
			}
			datjson.avisoiframe=false;
			dmiform.action=URLSUBIR_JSON+"?frame=true";
			dmiform.submit();
		}else {
			var file=thisar[0];
			if (file){
				if (file.type.search(/json\/.*/) != -1 ){
					var formData = new FormData();
					formData.append('fjson', file);
					hUtils.xJson({url:URLSUBIR_JSON,datos:formData,formu:false}).then(function(dat){
							console.log("recibo ok en onok json extension comprobarfile=");
							console.log(dat);
					}).fail(function(er){
							console.log("recibo error en json error ="+er);
							console.log(er);
							datjson.fileField.value="";
					});
				}else {
					datjson.diverrorjson.innerHTML("<p>Este archivo ("+file.name+") no es archivo json.</p>" );
				}
			}
		}
			
	}
	/*function grabarModificaciones() {
		var sp=document.getElementById("logusu").getElementsByTagName("span");
		botact_des.disabled=true;
		var cam=controladorPrincipal.getcambio();
		console.log("hay cambios="+cam);

		if (botact_des.innerHTML=="Activar"){
			hUtils.xJson({url:"/admintienda/Tiendas/grabModi", datos:window.JSON.stringify({"ope":"ins","cambios":cam}),accion:"POST",formu:true}).then(function(dat){
				controladorPrincipal.setcambio(0);
				botact_des.innerHTML="Desactivar";
				sp[0].innerHTML="La página esta <strong>ACTIVA</strong>.";
				sp[2].innerHTML="Antes de hacer modificaciones desactiva la página.";
				botact_des.disabled=false;
			}).fail(function(err){
				sp[0].innerHTML=="Se ha producido un error vuelve a intentarlo o recarga la página.";
				botact_des.disabled=false;
			});
			

		}else {
			hUtils.xJson({url:"/admintienda/Tiendas/grabModi", datos:window.JSON.stringify({"ope":"del","cambios":cam}),accion:"POST",formu:true}).then(function(dat){
				botact_des.innerHTML="Activar";
				sp[0].innerHTML="La página esta <strong>DESACTIVADA</strong>.";
				sp[2].innerHTML="<strong>Cuando termines de realizar las modificaciones vuelve a activar.</strong>";
				botact_des.disabled=false;
			}).fail(function(err){
				sp[0].innerHTML=="Se ha producido un error vuelve a intentarlo o recarga la página.";
				botact_des.disabled=false;
			});

		}
	}*/
	//var objImagen=null;
	function vengoCamImg(acc,obj){ 
				if (acc=="nueva"){
					this.innerHTML=obj.nombre;
					tienda.kims[this.nele]=obj.url;
				}else{
					this.innerHTML="Añadir";
					tienda.kims[this.nele]=null;
				}
			 }
	function cambiarImagen(){
		if (tienda.keyControler){
			var propietario={ImgUrl:tienda.kims[this.nele],keyControler:tienda.keyControler};
			FileimgApi.imagen(null,propietario,"Tienda",500,this.innerHTML,vengoCamImg.bind(this));
		}else {
			tienda.imgerr=document.createElement("div");
			tienda.imgerr.className="cuamensa";
			tienda.imgerr.innerHTML="Tienes que dar de alta la tienda antes de insertar imágenes.";
			tienda.imagenes.appendChild(tienda.imgerr);
		}
		//console.log("kims "+this.nele+"=",tienda.kims[this.nele]);
		/*if (controladorPrincipal.objImagen==null){
				var aux2=document.createElement("div");
				aux2.className="conclase-modpiz";
				var fai=FileimgApi.nueva(tienda.kims[this.nele],"Tienda",500,this.innerHTML,vengoCamImg.bind(this));
				aux2.appendChild(fai.conte);
				controladorPrincipal.objImagen={
					ventana:new ClsVentanasTipo.popup({
						titulo:"Imágen Tienda",
						contenido:aux2,
						cancelar:true
					}),
					linea:fai
				}
		}else {
			controladorPrincipal.objImagen.linea.propietario=tienda.kims[this.nele];
			controladorPrincipal.objImagen.linea.nombre=this.innerHTML;
			controladorPrincipal.objImagen.linea.limit=500;
			controladorPrincipal.objImagen.linea.cb=vengoCamImg.bind(this);
			controladorPrincipal.objImagen.linea.tipo="Tienda";
			controladorPrincipal.objImagen.ventana.tit.innerHTML="Imágen Tienda";
			FileimgApi.datos(controladorPrincipal.objImagen.linea);
		}
		controladorPrincipal.objImagen.ventana.show();*/
	}
	function remover(){
		this.parentNode.parentNode.removeChild(this.parentNode);
	}
	function inCodPos(pa,po){
		Clab.call(this);
		if (po) this.pobla=true;
		/*pa.appendChild(hUtils.crearElemento({e:"div",a:{className:"cajita"},
			hijos:[{e:"label",inner:"Código/s Postal/es:",hijos:[{e:"button",inner:"Añadir",a:{onclick:this.add.bind(this)}}]},
			{e:"div",did:"ent",hijos:[{e:"br",did:"salto",a:{className:"salto"}}]}] },this.datos));*/
		pa.appendChild(hUtils.crearElemento({e:"div",did:"ent",hijos:[{e:"br",did:"salto",a:{className:"salto"}}]},this.datos));
	}
	inCodPos.prototype=new Clab;
	inCodPos.prototype.nuevo=function(cn) {
		return this.datos.ent.insertBefore(hUtils.crearElemento({e:"div",a:{className:this.pobla ? "poblaciones" : "codpos"},
			hijos:[{e:"input",a:{type:"text",maxLength: this.pobla ? 40 : 5,placeholder:this.pobla ? "municipio" : "codpos",value:cn || ""}},{e:"button",inner:"x",a:{onclick:remover}}]},null),this.datos.salto);
	}
	inCodPos.prototype.add=function(ele){
		return function() { ele.nuevo().getElementsByTagName("input")[0].focus(); }
	}
	inCodPos.prototype.limpiar=function(){
		while(this.datos.ent.firstChild.className!="salto") this.datos.ent.removeChild(this.datos.ent.firstChild);
	}
	inCodPos.prototype.get=function(){
		var dat=this.datos.ent.getElementsByTagName("div");
		var lon=dat.length;
		this.outerror();
		if (lon >0 ){
			var dc,lis=[];
			for (var i=0;i<lon;i++){
				dc=dat[i].getElementsByTagName("input")[0];
				if (this.pobla){
					var val=hUtils.stripHtml(dc.value);
					if (val.length<2 || val.length>40 ){
						this.seterror("El "+(i+1)+" municipio que has introducido, no es válido");
						dc.focus();
						return false;
					}
					lis.push(val);
				} else {
					if (dc.value.length<5 || dc.value.length>5 || ! hUtils.validarIntpos(dc.value)){
						this.seterror("El "+(i+1)+" código postal que has introducido, no es válido");
						dc.focus();
						return false;
					}
					lis.push(dc.value);
				}
			}
			return lis;
		}
		this.seterror("Tienes que introducir al menos un "+(this.pobla ? "municipio.": "código postal."));
		this.nuevo().getElementsByTagName("input")[0].focus();
		return false;
	}
	
	function inshor(ndia,nuedi) {

		var mdat={};
		var fi=hUtils.crearElemento( {e:"fieldset",did:'fihor',
			a:{className:"cajafi"},c:{position:"relative"},
			hijos:[{
				e:"legend",
				inner:ndia
			},{
				e:"div",did:'conrahor',
				a:{className:"cajafi2"}
			},{
				e:"div",
				hijos:[{
					e:"fieldset",
					did:"f1",
					a:{className:"fiint"},
					hijos:[{
							e:"legend",
							inner:"mañana"
						},					{
							e:"label",
							inner:"de:"
						},{
							e:"input",
							a:{type:"time",maxLength:"5",placeholder:"00:00",title:"00:00",value:"13:00"}
						},{
							e:"label",
							inner:"a:"
						},{
							e:"input",
							a:{type:"time",maxLength:"5",placeholder:"00:00",title:"00:00",value:"16:00"}
					}]},{
					e:"fieldset",
					did:"f2",
					a:{className:"fiint"},
					hijos:[{
							e:"legend",
							inner:"tarde"
						},					{
							e:"label",
							inner:"de:"
						},{
							e:"input",
							a:{type:"time",placeholder:"00:00",title:"00:00",value:"19:00"}
						},{
							e:"label",
							inner:"a:"
						},{
							e:"input",
							a:{type:"time",placeholder:"00:00",title:"00:00",value:"23:59"}
						}]		
					}
				]}
			]},mdat);
		var cxra=new CRadio({opciones:["Todo el día","Día partido","Cerrado"],selec:1,padre:mdat.conrahor,dat:mdat,callback:clickHor});
		if (nuedi)
			fi.appendChild(hUtils.crearElemento({e:"button",c:{position:"absolute",right:"0px",top:"5px"},
					a:{onclick:eliminarHor,title:"Eliminar"},inner:"x"}));
		return cxra;
	}
	function eliminarHor() {
		var aux=this.parentNode.getElementsByTagName("legend")[0].innerHTML;
		this.parentNode.parentNode.removeChild(this.parentNode);
		if (cammod.horarios.lista.length>8){
			var aux2=cammod.horarios.lista;
			for (var i=8;i<aux2.length;i++){
				if (aux==aux2[i].dat.fihor.getElementsByTagName("legend")[0].innerHTML){
					cammod.horarios.lista.splice(i,1);
					return;
				}
			}
		}
	}
	function clickHor(nele,elera) {
		if (nele==0){
				elera.dat.f1.style.display="none";
				elera.dat.f2.style.display="inline-block";
				elera.dat.f2.getElementsByTagName("legend")[0].style.visibility="hidden"; //innerHTML="";
		}else if (nele==1){
			elera.dat.f1.style.display=elera.dat.f2.style.display="inline-block";
			elera.dat.f2.getElementsByTagName("legend")[0].style.visibility="visible"; //innerHTML="tarde:";
		}else if (nele==2){
			elera.dat.f1.style.display=elera.dat.f2.style.display="none";
		}
	}
	function introError(pa,s){
		var err=document.createElement("div");
		err.className="com-error";
		err.innerHTML=s;
		pa.appendChild(err);
	}
	function removeError(pa){
		var derr=pa.getElementsByTagName("div");
		if (derr.length>0) pa.removeChild(derr[0]);
	}
	function addhorario() {
		var aux=cammod.horarios.enttxthor;
		var pa=cammod.horarios.enttxthor.parentNode;
		removeError(pa);
		if ( !hUtils.validarFecha(aux.value) ){
			introError(pa,"Fecha no válida. Su formato debe ser: dia/mes/año->dd/mm/aaaa");
			cammod.horarios.enttxthor.focus();
			return;
		}else if (cammod.horarios.lista.length>8){
			for (var i=8;i<cammod.horarios.lista.length;i++){
				
				if (cammod.horarios.lista[i].dat.fihor.getElementsByTagName("legend")[0].innerHTML==aux.value){
					introError(pa,"Día "+aux.value+" ya existe");
					aux.focus();
					return;
				}
			}
		}
		var ho=inshor(cammod.horarios.enttxthor.value,true);
		cammod.horarios.divnuehor.appendChild(ho.dat.fihor);
		cammod.horarios.lista.push(ho);
	}
	function crearVentMod() {
		//var aux=document.createElement("div");
		//aux.className="wrapper";
		var seccaj={};
		var conte=hUtils.crearElemento({e:"div",a:{className:"wrapper"},c:{padding:"1em",textAlign:"left"},
			hijos:[{e:"div",did:"uno",a:{className:"secundario2"}},
					{e:"div",did:"dos",a:{className:"secundario2"}},
					{e:"div",did:"tres",a:{className:"secundario2"},
					hijos:[{e:"label",c:{display:"block"},inner:"Código/s Postal/es:",hijos:[{e:"button",did:"botcp",inner:"Añadir"}] } ]},
					{e:"div",did:"seis",a:{className:"secundario2"},
					hijos:[{e:"label",c:{display:"block"},inner:"Municipios:",hijos:[{e:"button",did:"botpobla",inner:"Añadir"}] } ]},
					{e:"div",did:"cuatro",a:{className:"secundario2"}},
					{e:"div",did:"cinco",
					hijos:[{e:"h3",inner:"Mapa <button onclick='controladorTienda.vermapa();'>Ver Mapa</button> | <button onclick='controladorTienda.recargar();'>Recargar mapa</button>" }]},
					{e:"div",did:"horarios",hijos:[{e:"h3",inner:"Horarios" }]},
					{e:"div",did:"addhor"},
					{e:"div",c:{marginTop:"1em"},hijos:[{e:"input",did:"nuehor",a:{type:"date",maxLength:10,placeholder:"dd/mm/aaaa"}}, {e:"button",inner:"Añadir Día",a:{title:"Añadir horario",onclick:addhorario} }]}]}, seccaj );
		cammod={
			nombre:new ClabInput({la:"Nombre de Tienda",masla:" <span class='letpeque'>(letras,números,subrayado y guión de 4 a 30 caracteres)</span>",lon:30,padre:seccaj.uno,clase:"cajita"}),
			calle:new ClabInput({la:"Dirección",lon:100,padre:seccaj.uno}),
			provin:new ClabInput({la:"Provincia",lon:50,padre:seccaj.uno}),
			loca:new ClabInput({la:"Localidad",lon:50,padre:seccaj.uno}),
			cdp:new ClabInput({la:"Código Postal",lon:5,padre:seccaj.uno},hUtils.validarIntpos),
			usohorario:new ClabSelect({la:"Uso Horario",padre:seccaj.uno}),
			email1:new ClabInput({la:"Email 1",lon:50,padre:seccaj.dos}),
			email2:new ClabInput({la:"Email 2",lon:50,padre:seccaj.dos}),
			tel1:new ClabInput({la:"Teléfono 1",lon:9,padre:seccaj.dos},hUtils.validarIntpos),
			tel2:new ClabInput({la:"Teléfono 2",lon:9,padre:seccaj.dos},hUtils.validarIntpos),
			cod_pos:new inCodPos(seccaj.tres),
			poblaciones:new inCodPos(seccaj.seis,true),
			tiem_recoger:new ClabInput({la:"Tiempo Recoger",lon:3,padre:seccaj.cuatro},hUtils.validarIntpos),
			tiem_domicilio:new ClabInput({la:"Tiempo Domicilio",lon:3,padre:seccaj.cuatro},hUtils.validarIntpos),
			prepedmindom:new ClabInput({la:"Precio mínimo a Domicilio",lon:4,padre:seccaj.cuatro},hUtils.validarFloat),
			pago:new ClabSelect({la:"Forma de pago",padre:seccaj.cuatro}),
			longi:new ClabInput({la:"Longitud",lon:25,padre:seccaj.cinco},hUtils.validarFloat),
			lati:new ClabInput({la:"Latitud",lon:25,padre:seccaj.cinco},hUtils.validarFloat),
			dirmapa:new ClabInput({la:"Dirección",lon:100,padre:seccaj.cinco}),
			botmapbus:document.createElement("button"),
			horarios:{
				lista:[],
				divnuehor:seccaj.addhor,
				enttxthor:seccaj.nuehor
			},
			zrep:document.createElement("div")
		}
		
		seccaj.cinco.appendChild(cammod.zrep);
		//cammod.nombre.datos.ent.parentNode.getElementsByTagName("label")[]
		cammod.botmapbus.innerHTML="Buscar Dirección";
		
		cammod.pago.opciones(_fpago);
		cammod.usohorario.opciones(USO_HORARIO);
		seccaj.botcp.onclick=cammod.cod_pos.add(cammod.cod_pos);
		seccaj.botpobla.onclick=cammod.poblaciones.add(cammod.poblaciones);
		var ho;
		for (var i=0;i<8;i++){
			ho=inshor(_dias[i]);
			seccaj.horarios.appendChild(ho.dat.fihor);
			cammod.horarios.lista.push(ho);
		}
		venMod=new ClsVentanasTipo.popup({
			titulo:"Modificar Tienda",
			contenido:conte,
			aceptar:{tit:"Enviar", cb:cbcomprobar}
		});
	}
	function dameUsoHorario(str){
		for (var i=0;i<USO_HORARIO.length;i++)
			if (USO_HORARIO[i][0]==str)
				return USO_HORARIO[i][1];
	}
	function Modificar() {
		if (venMod==null)
			crearVentMod();
		cammod.nombre.set(tienda.nom_tien.innerHTML);
		cammod.calle.set(tienda.calle_tien.innerHTML);
		cammod.provin.set(tienda.prov_tien.innerHTML);
		cammod.loca.set(tienda.loca_tien.innerHTML);
		cammod.cdp.set(tienda.cdp_tien.innerHTML);
		cammod.usohorario.datos.ent.selectedIndex=dameUsoHorario(tienda.usohor_tien.innerHTML);
		cammod.email1.set(tienda.email_1.innerHTML);
		cammod.email2.set(tienda.email_2.innerHTML);
		cammod.tel1.set(tienda.tele_1.innerHTML);
		cammod.tel2.set(tienda.tele_2.innerHTML);
		cammod.longi.set(tienda.longitud.innerHTML);
		cammod.lati.set(tienda.latitud.innerHTML);
		cammod.dirmapa.set(tienda.dire_mapa.innerHTML);
		cammod.pago.datos.ent.selectedIndex=tienda.for_pago.nele;
		cammod.tiem_recoger.set(tienda.tiempo_recoger.innerHTML);
		cammod.tiem_domicilio.set(tienda.tiempo_domicilio.innerHTML);
		cammod.prepedmindom.set(tienda.prepedmindom.innerHTML);
		cammod.cod_pos.limpiar();
		cammod.poblaciones.limpiar();
		var ccc=tienda.codpos_tien.getElementsByTagName("span");
		var lon=ccc.length;
		for (var i=0;i<lon;i++){
			cammod.cod_pos.nuevo(ccc[i].innerHTML);
		}
		ccc=tienda.poblaciones_tien.getElementsByTagName("span");
		lon=ccc.length;
		for (var i=0;i<lon;i++){
			cammod.poblaciones.nuevo(ccc[i].innerHTML);
		}
		if (tienda.zona_reparto.length==0) {
			cammod.zrep.innerHTML="<label>Sin zona de reparto</label>";
			cammod.zrep.className="secundario com-error";
		}else{
			cammod.zrep.className="secundario";
			cammod.zrep.innerHTML="<label>Con zona de reparto</label>";
		}
		if (lis_horarios){
			var loncl=cammod.horarios.lista.length;
			var chl;
			for (var i=0;i<lis_horarios.length;i++){

				if (i<loncl){
					chl=cammod.horarios.lista[i];
				}else{
					chl=inshor(lis_horarios[i].nombre);
					cammod.horarios.divnuehor.appendChild(chl.dat.fihor);
					cammod.horarios.lista.push(chl);
				}
				/*if (i>7){
					chl.dat.fihor.getElementsByTagName("legend")[0].innerHTML=lis_horarios[i].nombre;
				}*/
				if (chl.sel!=lis_horarios[i].tipo ) {
					chl.seleccionar(lis_horarios[i].tipo);
					clickHor(lis_horarios[i].tipo,chl);
				}
				if (lis_horarios[i].tipo===0){
					var inp=chl.dat.f2.getElementsByTagName("input");
					inp[0].value=lis_horarios[i].dmd;
					inp[1].value=lis_horarios[i].dmh;
				}else if (lis_horarios[i].tipo==1){
					var inp=chl.dat.f1.getElementsByTagName("input");
					inp[0].value=lis_horarios[i].dmd;
					inp[1].value=lis_horarios[i].dmh;
					inp=chl.dat.f2.getElementsByTagName("input");
					inp[0].value=lis_horarios[i].dtd;
					inp[1].value=lis_horarios[i].dth;
				}else {
					var inp=cammod.horarios.lista[i].dat.f1.getElementsByTagName("input");
					inp[0].value="13:00";
					inp[1].value="16:00";
					inp=cammod.horarios.lista[i].dat.f2.getElementsByTagName("input");
					inp[0].value="19:00";
					inp[1].value="23:59";
				}
			}
			/*if (cammod.horarios.lista.length>lis_horarios.length){
				for (var i=lis_horarios.length-1;i<cammod.horarios.lista.length;i++)
					cammod.horarios.divnuehor.removeChild(cammod.horarios.lista[i].dat.fihor)
			}*/
		}
		
		venMod.show();
	}
	function cbcomprobar() {
		for (var c in cammod){
			//console.log("cammod ",cammod[c]);
			if (cammod[c].outerror) cammod[c].outerror();

		}
		
		/*if (! /^[\w|-]{4,40}$/.test(cammod.nombre.get())){
			cammod.nombre.seterror("Nombre no váido, sólo admite letras (sin ñ),números y guión de 4 a 30 caracteres.");
			cammod.nombre.datos.ent.focus();
			return;
		}*/
		var em1;
		if (! hUtils.validarEmail(em1=cammod.email1.get())) {
			cammod.email1.seterror("Email_1 no válido");
			cammod.email1.datos.ent.focus(); return;
		}
		var em2;
		if ((em2=cammod.email2.get()).length>0 && ! hUtils.validarEmail(em2)){
			cammod.email2.seterror("Email_2 no válido");
			cammod.email2.datos.ent.focus(); return;
		}
		var t1;
		if (! hUtils.validarTel(t1=cammod.tel1.get())){
			cammod.tel1.seterror("Teléfono_1 no válido");
			cammod.tel1.datos.ent.focus(); return;
		}
		var t2=cammod.tel2.get();
		if (t2.length> 0 && ! hUtils.validarTel(cammod.tel2.get())) {
			cammod.tel2.seterror("Teléfono_2 no válido");
			cammod.tel2.datos.ent.focus(); return;
		}
		var tireco,tidomi,prepd;
		if ( ! (tireco=cammod.tiem_recoger.comprobar()) || ! (tidomi=cammod.tiem_domicilio.comprobar()) || ! (prepd=cammod.prepedmindom.comprobar())) {
			return;
		}
		var misdat={
			nombre:cammod.nombre.comprobar(), // get().toLowerCase(),
			calle:cammod.calle.comprobar(),
			provin:cammod.provin.comprobar(),
			loca:cammod.loca.comprobar(),
			cdp:cammod.cdp.comprobar(),
			tele1:t1,
			tele2:t2,
			cp:cammod.cod_pos.get(),
			poblas:cammod.poblaciones.get(),
			longi:cammod.longi.comprobar(),
			lati:cammod.lati.comprobar(),
			dirma:cammod.dirmapa.comprobar(),
			pago:cammod.pago.get().value,
			usohorario:cammod.usohorario.get().text,
			em1:em1,
			em2:em2,
			tireco:tireco,
			tidomi:tidomi,
			prepd:prepd,
			puntos:Mapag && Mapag.hay ? Mapag.damepuntos() : tienda.zona_reparto
		}
		if (misdat.puntos.length<1){
			cammod.zrep.innerHTML+=" <label>Debes de pintar la zona de Reparto en el Mapa.</label>";
			cammod.zrep.className="secundario com-error";
			venMod.sombra.scrollTop=0;
			return;
		}
		if (misdat.longi === false || misdat.lati === false)
			return;
		else if (misdat.longi<-180 || misdat.longi>180){
				cammod.longi.seterror("Número erróneo. Tiene que ser decimal entre -180 y 180");
				cammod.longi.datos.ent.focus(); return;
			}else if ( misdat.lati<-180 || misdat.lati>180){
				cammod.lati.seterror("Número erróneo. Tiene que ser decimal entre -180 y 180");
				cammod.lati.datos.ent.focus(); return;
			}
		if (!misdat.nombre || ! misdat.calle || ! misdat.provin || ! misdat.loca || ! misdat.cp || ! misdat.dirma  || ! misdat.poblas || ! misdat.cdp ) return;
		//console.log("sigo");
		var s1=false,s2=false,jsdias=[],da,js,lon=cammod.horarios.lista.length;
		for (var i=0;i<lon;i++){
			da=cammod.horarios.lista[i];
			js={};
			s1=false;s2=false;
			js.nombre=da.dat.fihor.getElementsByTagName("legend")[0].innerHTML;
			if (da.sel==1){
				s1=compararHoras(da.dat.f1,true);
				if (!s1)  return; 
				s2=compararHoras(da.dat.f2,false);
				if (!s2)  return; 
				js.tipo=1; //"Día partido"
				js.dmd=s1[0].value;//+"-"+s1[1].value;
				js.dmh=s1[1].value;
				js.dtd=s2[0].value;//+"-"+s2[1].value;
				js.dth=s2[1].value;
			}else if (da.sel==0){
				s2=compararHoras(da.dat.f2,false);
				if (!s2) return; 
				js.tipo=0; //"Todo el día"
				js.dmd=s2[0].value;//+"-"+s2[1].value;
				js.dmh=s2[1].value;
			}else {
				js.tipo=2;//"Cerrado"
			}
			jsdias.push(js);
		}
		misdat.horarios=jsdias;
		if (tienda.id){
			misdat.id=tienda.id;
			var ope="mod";
		}else var ope="ins";
		//console.log("misdat=",misdat);
		var djsstr=window.JSON.stringify({"ope":ope, "datos":misdat});
		console.log("objeto que enviamos="+djsstr);
		
		venMod.aceptar.disabled=true;
		hUtils.xJson({url:urltienda,datos:djsstr,formu:true}).then(function(res){
			//controladorPrincipal.addcambio(1);
			console.log("recibo respuesta en comprobar ======",res);
			tienda.keyControler=res.key.urlsafe;
			if (ope=="ins"){
				if (tienda.imgerr){
					tienda.imagenes.removeChild(tienda.imgerr);
					tienda.imgerr=null;
				}
				for (var i=0;i<3;i++){
						bi=tienda["img"+i];
						bi.nele=i;
						tienda.kims[i]=null;
						/*tienda.kims.push({
							//keyImg:null,
							keyControler:res.key
						});*/
						bi.onclick=cambiarImagen;
					}
				tienda.divcopiar.style.display="block";
				tienda.copiarti.onclick=envCopiarTodo;
				tienda.borrarti.onclick=envBorrarTodo;
			}
			//tienda.keyControler=res.key;
			tienda.id=res.ok;
			tienda.nom_tien.innerHTML=misdat.nombre; //res.key.nomti; // misdat.nombre;
			tienda.url_tien.innerHTML=res.key.urltien;
			tienda.calle_tien.innerHTML=misdat.calle;
			tienda.prov_tien.innerHTML=misdat.provin;
			tienda.loca_tien.innerHTML=misdat.loca;
			tienda.cdp_tien.innerHTML=misdat.cdp;
			tienda.email_1.innerHTML=misdat.em1;
			tienda.email_2.innerHTML=misdat.em2;
			tienda.tele_1.innerHTML=misdat.tele1;
			tienda.tele_2.innerHTML=misdat.tele2;
			var ccc="";
			var lon=misdat.cp.length;
			for (var i=0;i<lon;i++){
				ccc+="<span>"+misdat.cp[i]+"</span>";
			}
			tienda.codpos_tien.innerHTML=ccc;
			ccc="";
			lon=misdat.poblas.length;
			for (var i=0;i<lon;i++){
				ccc+="<span>"+misdat.poblas[i]+"</span>";
			}
			tienda.poblaciones_tien.innerHTML=ccc;
			tienda.for_pago.innerHTML=_fpago[parseInt(misdat.pago)][0];
			tienda.usohor_tien.innerHTML=misdat.usohorario;
			tienda.tiempo_recoger.innerHTML=misdat.tireco;
			tienda.tiempo_domicilio.innerHTML=misdat.tidomi;
			tienda.prepedmindom.innerHTML=misdat.prepd;
			tienda.latitud.innerHTML=misdat.lati;
			tienda.longitud.innerHTML=misdat.longi;
			tienda.dire_mapa.innerHTML=misdat.dirma;
			//lis_horarios=[];
			tienda.horarios.innerHTML="";
			lis_horarios=[];
			console.log("jsdias.",jsdias);
			for (var i=0;i<jsdias.length;i++){
				horariodia(jsdias[i]);
				/*var tex;
				var di=jsdias[i];
				if (di.tipo===0){
					tex="Todo el día:"+di.diama;
				}else if (di.tipo==1){
					tex="<div class='cajita'><label>Mañana:</label>"+di.diama+"</div><div class='cajita'><label>Tarde:</label>"+di.diata+"</div>";
				}else {
					tex="Cerrado";
				}*/
				/*lis_horarios.push(hUtils.crearElemento({e:"fieldset",
					hijos:[{e:"legend",inner:nom},{e:"div",inner:tex}]},null))
				tienda.horarios.appendChild(lis_horarios[i]);*/
				/*tienda.horarios.appendChild(hUtils.crearElemento({e:"fieldset",
					hijos:[{e:"legend",inner:di.nombre},{e:"div",inner:tex}]},null));*/
			}
			venMod.aceptar.disabled=false;
			venMod.cerrar();
		}).fail(function(er){
			console.log("recibimos error respuesta dat="+er);
			venMod.aceptar.disabled=false;
		});
	}
	function compararHoras(of,comp){
		var ih=of.getElementsByTagName("input");
		removeError(of);
		if (!hUtils.validarHora(ih[0].value)){
			introError(of,"Horario no válido.");
			return false;
		}
		if (!hUtils.validarHora(ih[1].value)){
			introError(of,"Horario no válido.");
			return false;
		}
		if (comp) {
			var hm1=ih[0].value.split(":");
			var hm2=ih[1].value.split(":");
			var da1=new Date();
			da1.setHours(parseInt(hm1[0]));
			da1.setMinutes(parseInt(hm1[1]));
			var da2=new Date();
			da2.setHours(parseInt(hm2[0]));
			da2.setMinutes(parseInt(hm2[1]));
			if (da2.getTime()<=da1.getTime()){
				introError(of,"La hora hasta debe ser mayor a la hora desde.d1="+da1.toLocaleString()+"\nd2="+da2.toLocaleString());
				return false;
			}
		}
		return ih;
		//return {ih,da1,da2];
	}
	function copiarPlantilla(){
		var err="",numr=controladorOfertas.numRegistros();
		if (numr>0)
			err+="Ofertas tiene "+numr+" registros.\n";
		numr=controladorOtroscomplex.numRegistros();
		if (numr>0)
			err+="Otroscomplex tiene "+numr+" registros.\n";
		numr=controladorOtros.numRegistros();
		if (numr>0)
			err+="Otros productos tiene "+numr+" registros.\n";
		numr=controladorMasasTamas.numRegistros();
		if (numr>0)
			err+="Pizzas tiene "+numr+" registros.\n";
		if (err.length>0){
			alert("Hay registros en:\n"+err+" Antes de copiar debes de eliminar todos los artículos.");
			return;
		}
		var djsstr=window.JSON.stringify({"ope":"ins","tienda_a_copiar":tienda.seltiacopiar.options[tienda.seltiacopiar.selectedIndex].value});
		hUtils.xJson({url:"/admintienda/CopiarTienda",datos:djsstr,formu:true}).then(function(res){
			console.log("recibimos en copiarPlantilla res=",res);
			controladorMasasTamas.actualizar();
			controladorOtros.actualizar();
			controladorOtroscomplex.actualizar();
			controladorOfertas.actualizar();
		}).fail(function(er){
			alert("recibimos error de servidor al copiar Plantilla, respuesta="+er);
		});
		window.clearTimeout(crono);
		limpiarCopiar();
	}
	function limpiarCopiar() {
		tienda.copiarti.innerHTML="Ver plantillas";
		tienda.copiarti.onclick=envCopiarTodo;
		tienda.seltiacopiar.options.length=0;
	}
	function envCopiarTodo() {
		if (tienda.id){
			var _this=this;
			hUtils.xJson({url:"/admintienda/tiendasAcopiar",datos:window.JSON.stringify({"ope":"mod"}),formu:true}).then(function(res){
				console.log("recibimos en copiar todo res=",res);
				tienda.seltiacopiar.options.length=0;
				if (res.ok.length>0){
					for (var i=0;i<res.ok.length;i++){
						tienda.seltiacopiar.options[i]=new Option(res.ok[i][0],res.ok[i][1]);
					}
					tienda.copiarti.innerHTML="Copiar plantilla";
					tienda.copiarti.onclick=copiarPlantilla;
					crono=window.setTimeout(limpiarCopiar,60000);
				}else{
					tienda.seltiacopiar.options[0]=new Option("No hay plantillas a copiar");
				}				
			}).fail(function(er){
				alert("recibimos error del servidor al Ver plantillas a copiar, respuesta="+er);
			});
		}else {
			alert("No hay tienda creada, antes de copiar debes de crear la tienda.");
		}
	}
	function envBorrarTodo() {
		if (tienda.id){
			var numr=controladorOfertas.numRegistros()+controladorOtroscomplex.numRegistros()+controladorOtros.numRegistros()+controladorMasasTamas.numRegistros();
			if (numr<1){
				alert("No hay artículos ni ofertas que borrar.");
				return;
			}
			if (confirm("¿Estás seguro que deseas borrar todos los artículos y ofertas")){
				hUtils.xJson({url:"/admintienda/CopiarTienda",datos:window.JSON.stringify({"ope":"del"}),formu:true}).then(function(res){
					console.log("recibimos en borrar todo res=",res);
					controladorMasasTamas.actualizar();
					controladorOtros.actualizar();
					controladorOtroscomplex.actualizar();
					controladorOfertas.actualizar();
				}).fail(function(er){
					alert("recibimos error del servidor al borrar todo, respuesta dat="+er);
				});
			}
		}else {
			alert("No hay tienda creada");
		}
	}
	var mapaDiv;
	function inicio(dpa,dat){
		var divtienda=document.createElement("div");
		divtienda.className="wrapper";
		var conte=hUtils.crearElemento({e:"div",c:{padding:"1em",textAlign:"left"},
			hijos:[{e:"div",a:{className:"cuamensa"},c:{maxWidth:"98%"},inner:"<b>Es Importante</b>: Que para salir de la página utilices el botón de <b>LOGOUT</b>.<br> Si vas a realizar altas, bajas o modificaciones en artículos u ofertas debes de <b>desactivar la web pública</b>, así si alguien quiere acceder se mostrará una página de mantenimiento, una vez que termines debes de <b>volver a activar la web pública y hacer una carga de datos en la aplicación de la tienda.</b><br>", hijos:[{e:"div",did:"div_act_des"},{e:"br",a:{className:"salto"}}]},
			{e:"hr"},{e:"div",a:{className:"cajita"},
				hijos:[{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Nombre de Tienda:"},{e:"div",did:"nom_tien",a:{className:"conte-input"},inner:""}]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Url:"},{e:"div",did:"url_tien",a:{className:"conte-input"},inner:""}]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Dirección:"},{e:"div",did:"calle_tien",a:{className:"conte-input"},inner:""}]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Provincia:"},{e:"div",did:"prov_tien",a:{className:"conte-input"},inner:""}]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Localidad:"},{e:"div",did:"loca_tien",a:{className:"conte-input"}}]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Cód.Postal:"},{e:"div",did:"cdp_tien",a:{className:"conte-input"}}]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Uso Horario:"},{e:"div",did:"usohor_tien",a:{className:"conte-input"}}]},
						]},
					{e:"div",a:{className:"cajita"},
					hijos:[{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Email 1:"},{e:"div",did:"email_1",a:{className:"conte-input"},inner:""},
						{e:"label",inner:"Email 2:"},{e:"div",did:"email_2",a:{className:"conte-input"},inner:""} ]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Teléfono 1:"},{e:"div",did:"tele_1",a:{className:"conte-input"},inner:""},
						{e:"label",inner:"Teléfono 2:"},{e:"div",did:"tele_2",a:{className:"conte-input"},inner:""} ]} ]},
					{e:"div",a:{className:"cajita"},
					hijos:[{e:"label",c:{display:"block"},inner:"Reparto Código/s Postal/es:"},{e:"div",did:"codpos_tien",a:{className:"conte-input"}} ]},
					{e:"div",a:{className:"cajita"},
					hijos:[{e:"label",c:{display:"block"},inner:"Reparto Municipio/s:"},{e:"div",did:"poblaciones_tien",a:{className:"conte-input"}} ]},
					{e:"div",a:{className:"cajita"},
					hijos:[{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Tiempo Recoger:"},{e:"div",did:"tiempo_recoger",a:{className:"conte-input"},inner:"15"},{e:"label",inner:"Tiempo Domicilio:"},{e:"div",did:"tiempo_domicilio",a:{className:"conte-input"},inner:"35"},{e:"label",inner:"Pedido mínimo a Domicilio:"},{e:"div",did:"prepedmindom",a:{className:"conte-input"},inner:"6"} ]},{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Forma de pago en tienda:"},{e:"div",did:"for_pago",a:{className:"conte-input"},inner:""},{e:"label",inner:"Forma de pago Online:"},{e:"div",a:{className:"conte-input"},hijos:[{e:"button",inner:"Paypal",listener:{click:planPagonline("paypal")}},{e:"span",inner:" -"},{e:"button",inner:"Pagantis",listener:{click:planPagonline("pagantis")}}]}]}]},
					{e:"div",
					hijos:[{e:"h3",inner:"Mapa" }, {e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Longitud:"},{e:"div",did:"longitud",a:{className:"conte-input"},inner:""}]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Latitud:"},{e:"div",did:"latitud",a:{className:"conte-input"},inner:""}]},
						{e:"div",a:{className:"cajita"},
						hijos:[{e:"label",inner:"Dirección en mapa:"},{e:"div",did:"dire_mapa",a:{className:"conte-input"},inner:""}]}]},
					{e:"div",hijos:[{e:"h3",inner:"Imágenes <span class='letpeque'> *Puedes añadir hasta 3 imágenes. Para identificar la imágen del logotipo de la tienda, la imágen debe de llamarse \"logo\".<i>extensión (png,jpg o gif)</i></span>:" },{e:"div",did:"imagenes",hijos:[{e:"button",did:"img0",inner:"Añadir"},{e:"button",did:"img1",inner:"Añadir"},{e:"button",did:"img2",inner:"Añadir"}] } ]},
					{e:"div",hijos:[{e:"h3",inner:"Horarios" },{e:"div",did:"horarios",a:{className:"dhorarios"}}]},
					{e:"div",hijos:[{e:"h4",inner:"<a href='/admintienda/Tiendas/bajarjson.json'>Bajar Json</a> <span class='letpeque'> (Descargar tus artículos en archivo json).</span>"}]},
					{e:"div",did:"divcopiar",c:{display:"none"}, hijos:[{e:"h3",inner:"Copiar Artículos" },{e:"p",inner:"<span class='letpeque'>Copia artículos desde una de nuestras plantillas o si has descargado anteriormente un archivo json puedes subir ese archivo.<br>Sólo se copiarán los artículos y ofertas, las imágenes no.<br> No debes de tener nínguna oferta ni ningún artículo para poder copiar otra plantilla.<br> Pulsa en 'Ver plantillas' para comprobar las plantillas disponibles.</span>"}, {e:"h4",inner:"- Copiar plantilla" },{e:"button",did:"copiarti",inner:"Ver plantillas"},{e:"select",did:"seltiacopiar"},{e:"h4",inner:"- Copiar Json"},{e:"div",did:"divjson"},{e:"h3",inner:"Borrar Artículos"},{e:"p",inner:" <span class='letpeque'>(se borrarán todos los datos de artículos y ofertas, los datos de la tienda no): </span> " ,hijos:[{e:"button",did:"borrarti",inner:"Borrar"}]}] }]},tienda );
		
		tienda.web_act_des=new CRadio({opciones:["Web Activada","Web Desactivada"],selec:dat.tienda.act ? 0 : 1,padre:tienda.div_act_des,callback:act_des_pagina});
		if (typeof FileReader == "undefined"){
			tienda.divjson.appendChild(hUtils.crearElemento({e:"div",
				hijos:[{e:"div",did:"diverrorjson"},{e:"p",hijos:[
		 			{e:"iframe",a:{name:"iframejson",id:"iframejson",src:URLFRAME_JSON,width:"300", height:"60", frameborder:"0",marginwidth:"0", marginheight:"0"},did:"iframejson"}]}			 			
		 			]},datjson));
		}else {
			tienda.divjson.appendChild(hUtils.crearElemento({e:"div",
				hijos:[{e:"div",did:"diverrorjson"},{e:"p",hijos:[
					{e:"form", a:{method:"post", enctype:"multipart/form-data"},
					hijos:[{e:"input",did:"fileField", a:{type:"file"}}]}]}	 			
		 			]},datjson));
			datjson.fileField.onchange=function() {
				json_extension(this,null);
			};
		}
		ventana=new ClsVentanasTipo.titaceptar({
					titulo:"Tienda",
					contenido:conte,
					padre:divtienda,
					anchototal:true,
					aceptar:{tit:"Modificar",cb:Modificar}
				});
		ventana.show();
		dpa.appendChild(divtienda);
		hUtils.cargarScript("js/mapa2.js",function() {
			mapaDiv=document.createElement("div");
			mapaDiv.className="mapa";
			document.body.appendChild(mapaDiv);
			var dmap2=document.createElement("div");
			dmap2.position="relative";
			dmap2.style.width="100%"; //mapaDiv.offsetWidth+"px";// "100%";
			dmap2.style.height="100%"; //mapaDiv.offsetHeight+"px";//100%";
			mapaDiv.appendChild(dmap2);
			Mapag.init(dmap2); 
			mapaDiv.style.display="none";
		});
		
		 
		 	//console.log("recibimos ok respuesta en tienda xhr dat=",dat);
		 	tienda.kims=[];
		 	if (dat.tienda){
			 	/*var sp=document.getElementById("logusu").getElementsByTagName("span");
		 		botact_des=document.createElement("button");
		 		botact_des.className="btn btn-primary";
		 		botact_des.addEventListener("click",act_des_pagina,false);
		 		if (!dat.tienda.act){
		 			sp[0].innerHTML="La página web esta <strong>DESACTIVADA</strong>.";
		 			sp[2].innerHTML="<strong>Cuando termines de realizar las modificaciones vuelve a activar.</strong>";
		 			botact_des.innerHTML="Activar";
		 		}else {
		 			botact_des.innerHTML="Desactivar";
		 		}
		 		sp[1].appendChild(botact_des);*/
			 	if (dat.tienda.id){
			 		
					tienda.id=dat.tienda.id;
					tienda.nom_tien.innerHTML=dat.tienda.nombre;
					tienda.url_tien.innerHTML=dat.tienda.url_tien;
					tienda.calle_tien.innerHTML=dat.tienda.calle;
					tienda.prov_tien.innerHTML=dat.tienda.pro;
					tienda.loca_tien.innerHTML=dat.tienda.loca;
					tienda.cdp_tien.innerHTML=dat.tienda.cdp || "";
					tienda.usohor_tien.innerHTML=dat.tienda.usohorario;
					tienda.email_1.innerHTML=dat.tienda.ems[0];
					tienda.email_2.innerHTML=dat.tienda.ems[1] || "";
					tienda.tele_1.innerHTML=dat.tienda.tel[0];
					tienda.tele_2.innerHTML=dat.tienda.tel[1] || "";
					var ccc="";
					var lon=dat.tienda.codpos.length;
					for (var i=0;i<lon;i++){
						ccc+="<span>"+dat.tienda.codpos[i]+"</span>";
					}
					tienda.codpos_tien.innerHTML=ccc;
					ccc="";
					lon=dat.tienda.poblas.length;
					for (var i=0;i<lon;i++){
						ccc+="<span>"+dat.tienda.poblas[i]+"</span>";
					}
					tienda.poblaciones_tien.innerHTML=ccc;
					tienda.for_pago.innerHTML=_fpago[parseInt(dat.tienda.pag)][0];
					tienda.for_pago.nele=parseInt(dat.tienda.pag);
					tienda.tiempo_recoger.innerHTML=dat.tienda.ti_recoger || "15";
					tienda.tiempo_domicilio.innerHTML=dat.tienda.ti_domicilio || "35";
					tienda.prepedmindom.innerHTML=dat.tienda.prepedmindom || "6"; 
					tienda.latitud.innerHTML=dat.tienda.lat;
					tienda.longitud.innerHTML=dat.tienda.lon;
					tienda.dire_mapa.innerHTML=dat.tienda.dmap;
					tienda.zona_reparto=dat.tienda.zrep;
					tienda.paypal=dat.tienda.paypal;
					tienda.pagantis=dat.tienda.pagantis;
				/*	if (dat.tienda.paypal){
						tienda.paypal={
							clienitd:dat.tienda.paypal.clientid,
							secret:dat.tienda.paypal.secret,
							inc_des:dat.tienda.paypal.inc_des,
							modo:dat.tienda.paypal.modo,
							poroeur:dat.tienda.paypal.poroeur,
							stringsuple:dat.tienda.paypal.stringsuple
						};
					}else
						tienda.paypal=null;
					if (dat.tienda.pagantis){
						tienda.pagantis={
							account_id:dat.tienda.paypal.clientid,
							clave_firma:dat.tienda.paypal.secret,
							api_key:ak,
							inc_des:dat.tienda.paypal.inc_des,
							modo:dat.tienda.paypal.modo,
							poroeur:dat.tienda.paypal.poroeur,
							stringsuple:dat.tienda.paypal.stringsuple
						};
					}else
						tienda.pagantis=null;*/
					lis_horarios=[];
					for (var i=0;i<_dias.length;i++){
						dat.tienda.hrs[_dias[i]].nombre=_dias[i];
						horariodia(dat.tienda.hrs[_dias[i]]);
					}
					for (var i in dat.tienda.hrs){
						if (_dias.indexOf(i)==-1){
							dat.tienda.hrs[i].nombre=i;
							horariodia(dat.tienda.hrs[i]);
						}
					}
					tienda.keyControler=dat.tienda.kc;
					
					/*var lon=dat.tienda.kims.length;
					if (lon>0) {
						for (var i=0;i<lon;i++){
							tienda["img"+].innerHTML=dat.tienda.tims[i];
							tienda.kims.push({
								keyImg:dat.tienda.kims[i],
								keyControler:dat.tienda.kc
							});
						}
					}*/
					var url,bi;
					for (var i=0;i<3;i++){
							bi=tienda["img"+i];
							if (dat.tienda.tims[i]){
								bi.innerHTML=dat.tienda.tims[i];
								url=dat.tienda.kims[i];
							}else url=null;
							bi.nele=i;
							tienda.kims.push(url);
							bi.onclick=cambiarImagen;
						}
					tienda.divcopiar.style.display="block";
					tienda.copiarti.onclick=envCopiarTodo;
					tienda.borrarti.onclick=envBorrarTodo;
				}else {
					tienda.keyControler=null;
					tienda.zona_reparto=[];
				}
			}
			
			/*else {
				var ndias=[1,2,1,1,1,1,0,0];
				var tex;
				for (var i=0;i<ndias.length;i++){
					if (ndias[i]===0){
						tex="Todo el día: 13:00 - 00:00";
					}else if (ndias[i]==1){
						tex="<div class='cajita'><label>Mañana:</label>13:00 - 16:00</div><div class='cajita'><label>Tarde:</label>19:00 - 00:00</div>";
					}else {
						tex="Cerrado";
					}
					lis_horarios.push(hUtils.crearElemento({e:"fieldset",
						hijos:[{e:"legend",inner:_dias[i]},{e:"div",inner:tex}]},null))
					tienda.horarios.appendChild(lis_horarios[i]);
				}
			}*/
		 
		return divtienda;
	}
	function horariodia(di){
			var tex;
			if (di.tipo===0){
				tex="Todo el día:"+di.dmd+" - "+di.dmh;
			}else if (di.tipo==1){
				tex="<div class='cajita'><label>Mañana:</label>"+di.dmd+" - "+di.dmh+"</div><div class='cajita'><label>Tarde:</label>"+di.dtd+" - "+di.dth+"</div>";
			}else {
				tex="Cerrado";
			}
			/*lis_horarios.push(hUtils.crearElemento({e:"fieldset",
				hijos:[{e:"legend",inner:nom},{e:"div",inner:tex}]},null))
			tienda.horarios.appendChild(lis_horarios[i]);*/
			lis_horarios.push(di);
			tienda.horarios.appendChild(hUtils.crearElemento({e:"fieldset",
					hijos:[{e:"legend",inner:di.nombre},{e:"div",inner:tex}]},null));
		
	}
	function verMapa() {
		mapaDiv.style.display="block";
		if (!Mapag.hay){
			cammod.dirmapa.datos.lano.innerHTML+=" <span class='letpeque'> cargando mapa...</span>";
			Mapag.cargar("controladorTienda.mapacar");
		}
	}
	function recargar_mapa() {
		mapaDiv.style.display="block";
		if (!Mapag.hay){
			cammod.dirmapa.datos.lano.innerHTML+=" <span class='letpeque'> cargando mapa...</span>";
			Mapag.cargar("controladorTienda.mapacar");
		}else
			Mapag.inicializar(cammod.dirmapa.get(),tienda.zona_reparto);
	}
	function bus_dir_mapa(){
		cammod.dirmapa.outerror();
		var dir=cammod.dirmapa.get();
		if (dir.length>2){ 
			if (!Mapag.hay){
				cammod.botmapbus.parentNode.innerHTML+="<span class='letpeque'> cargando mapa...</span>";
				Mapag.cargar("controladorTienda.mapacar");
				return;
			}
			mapaDiv.style.display="block";
			Mapag.codeAddress(dir);
		} else{
			cammod.dirmapa.seterror("Debes introducir una dirección:ejem(Gran via,56,Madrid,España)");
		}
	}
	function mapaCargado() {
		console.log("inicializar mapa");
		cammod.dirmapa.datos.lano.removeChild(cammod.dirmapa.datos.lano.getElementsByTagName("span")[0]);
		cammod.dirmapa.datos.lano.appendChild(cammod.botmapbus);
		cammod.botmapbus.onclick=bus_dir_mapa;
		Mapag.inicializar(cammod.dirmapa.get(),tienda.zona_reparto);
	}
	function mapa_direc_sel(objd) {
		cammod.dirmapa.set(objd.dir);
		cammod.lati.set(objd.lat);
		cammod.longi.set(objd.lon);
		mapaDiv.style.display="none";
	}
	function cerrar_mapa() {
		if (Mapag.damepuntos().length>0) {
			if ( cammod.zrep.className.indexOf("com-error")>-1){
				cammod.zrep.className="secundario";
				cammod.zrep.innerHTML="<label>Con zona de reparto</label>";
			}
		}else if ( cammod.zrep.className.indexOf("com-error")<0){
			cammod.zrep.innerHTML="<label>Sin zona de reparto</label>";
			cammod.zrep.className="secundario com-error";
		}
		mapaDiv.style.display="none";
	}
	function cerrar_info() {
		Mapag.cerrarinfo();
	}
	function existetienda() {
		return tienda.id;
	}
	function comprobarWeb() {
		return tienda.web_act_des.sel;
	}
	return {inicio:inicio,haytienda:existetienda,vermapa:verMapa,mapacar:mapaCargado,selec_dir_mapa:mapa_direc_sel,cerrar:cerrar_mapa,cerrarInfo:cerrar_info,recargar:recargar_mapa,webactiva:comprobarWeb,act_des_web:act_des_pagina,json_extension:json_extension,respuestajson:respuestajson }; // grabModi:act_des_pagina};
})();