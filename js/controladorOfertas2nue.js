'use strict';
var controladorOfertas=(function(){
	var Clink=ClsTabla.campo.Clink, Ctexto=ClsTabla.campo.Ctexto,Clista=ClsTabla.campo.Clista,Cboton=ClsTabla.campo.Cboton,Cnumero=ClsTabla.campo.Cnumero;
function eliminarplanPro(){
	plantillaOfer.divdetalle.removeChild(this);
	for (var d=0,lon=plantillaOfer.prodetalle.length;d<lon;d++)
		if (plantillaOfer.prodetalle[d].nele==this.nele){
			plantillaOfer.prodetalle.splice(d,1);
			break;
		}
}
function seldescus(dele){
	return function() {
		if ( this.selectedIndex==2)
			dele.style.visibility="visible";
		else
			dele.style.visibility="hidden";
	}
}
function customOfer(uobj,cus,nar,sim){
	var aux=document.createElement("div");
	aux.appendChild(hUtils.crearElemento({e:'div',c:{marginTop:"1em",paddingTop:"1em",borderTop:"4px dotted gray" },hijos:[
		 {e:"div",c:{textAlign:"right"},hijos:[{e:"button",inner:"Eliminar",a:{onclick:eliminarplanPro.bind(aux)}}]},
		 {e:"h3",inner:nar}] },null));
	aux.nele=plantillaOfer.inddet;
	var aux2=hUtils.crearElemento({e:"fieldset",hijos:[{e:"legend",inner:"Customizar oferta:"}]});
	uobj.custom=new ClabSelect({la:"Acción a tomar con este artículo",padre:aux2});
	uobj.custom.opciones([["Cobrar todo el importe","C"],["Regalar todo el importe","R"],["Descuendo de","D"]]);
	var aux3=document.createElement("div");
	aux3.className="secundario";
	uobj.descuento=new ClabInpflsw({lon:5,min:0,la:"Descuento en € ó %",va:["€","%"],padre:aux3});
	aux3.style.visibility="hidden";
	//uobj.descuenporcen=new ClabInput({la:"Si descuento en % ",lon:5,padre:aux3},hUtils.validarFloat);
	//uobj.descueneuros=new ClabInput({la:"o Si descuento en € ",lon:5,padre:aux3},hUtils.validarFloat);
	aux2.appendChild(aux3);
	uobj.custom.datos.ent.onchange=seldescus(aux3);
	if (sim)
		uobj.cantidad=new ClabInput({la:"Cantidad ",lon:2,padre:aux2},hUtils.validarInt);
	if (cus){
		uobj.custom.datos.ent.selectedIndex=cus.custom.acc;
		uobj.descuento.setsw(cus.custom.de,cus.custom.dp);
		if (cus.custom.acc==2) aux3.style.visibility="visible";
		//uobj.descuenporcen.set(cus.custom.dp);
		//uobj.descueneuros.set(cus.custom.de);
		if (sim)
			uobj.cantidad.set(cus.custom.cantidad);
		/*if (cus.ofer=="C")
			uobj.custom.datos.ent.selectedIndex=0;
		else if (cus.ofer=="R")
			uobj.custom.datos.ent.selectedIndex=1;
		else if (cus.ofer=="D"){
			if (cus.descueneuros>0)
				uobj.descueneuros.set(cus.descueneuros);
			else if (cus.descuenporcen>0)
				uobj.descuenporcen.set(cus.descuenporcen);
		}*/
	}else {
		uobj.descuento.setsw(0,0);
		//uobj.descuenporcen.set(0);
		//uobj.descueneuros.set(0);
	}
	
	aux.appendChild(aux2);
	return aux;
}
function returnCustom(ob){
	var desE={v:0,s:0};
	ob.custom.outerror();
	if (ob.custom.datos.ent.selectedIndex==2){
		desE=ob.descuento.comprobar(); //desP=nuconCero(ob.descuenporcen);
		//nuconCero(ob.descueneuros);
		if (! desE || desE.v==0 ) { //(! desE && ! desP )
			ob.descuento.seterror("Introduce Descuento en euros o en porcentaje.");
			return false;
		}
		ob.descuento.outerror();
		//ob.descueneuros.outerror();
		//ob.descuenporcen.outerror();
		//console.log("de=",desE," dp=",desP);
		/*if ( desE[1]==0 && desP[1]==0){
			ob.custom.seterror("Si la acción es Descuento debes indicar cantidad en euros o en porcentaje.");
			return false;
		} else if ( desE[1]>0 && desP[1]>0 ){
			ob.custom.seterror("Debes de poner descuento en euros o en porcentaje, los dos no.");
			return false;
		}
		desE=desE[1];desP=desP[1];*/

	}
	if (ob.tipopro==1){
		var ca;
		if ( ! (ca=ob.cantidad.comprobar()))
			return false
		else
			return {obj:{acc:ob.custom.datos.ent.selectedIndex,de:desE.v,dp:desE.s,cantidad:ca},nid:ob.nid};
	}

	return { obj:{acc:ob.custom.datos.ent.selectedIndex,de:desE.v,dp:desE.s}, nid:ob.nid };
}
function returnconIngres(ob){
	var nui=ob.numing.get(), co=ob.coning.get().value;
	ob.numing.outerror();
	if (co==="cu")
		nui=0;
	else if (! (nui=ob.numing.comprobar()))
		return false;
	return {condiing:co,numing:nui };
}
function busena(ab,ele){
	for (var j=0,jl=ab.length;j<jl;j++)
		if (ab[j][1]==ele)
			return j;
	return -1;
}
function detallePizza(cus){
	var datpiz=controladorMasasTamas.datosPiz();
	var uobj={tipopro:0};
	var aux=customOfer(uobj,cus,"Pizza");
	var aux2=hUtils.crearElemento({e:"fieldset",hijos:[{e:"legend",inner:"Pizza con ingredientes:"}]});
	uobj.coning=new ClabSelect({la:"Condición ingredientes",padre:aux2});
	uobj.numing=new ClabInput({la:"Número de ingredientes",lon:2,padre:aux2},hUtils.validarInt);
	uobj.coning.opciones([["Mayor","ma"],["Menor","me"],["Igual","ig"],["Cualquiera","cu"]]);
	aux.appendChild(aux2);
	var cma=0,cta=0,cpi=0;
	/*{s:0,d:"none"},
	{s:0,d:"none"},
	{s:0,d:"none"};*/
	if (cus){
		uobj.nid=cus.nid;
		uobj.numing.datos.ent.value=cus.ingres.numing;
		uobj.coning.datos.ent.selectedIndex=["ma","me","ig","cu"].indexOf(cus.ingres.condiing);
		cma=cus.masas.length>0; // if (cus.masas.length>0){ cma.s=1;cma.d="block"; }
		cta=cus.tamas.length>0; //if (cus.tamas.length>0){ cta.s=1;cta.d="block"; }
		cpi=cus.artis.length>0; //if (cus.artis.length>0){ cpi.s=1;cpi.d="block"; }
	}
	aux2=document.createElement("div");
	/*var auxse=new ClabCheck({la:"Masas:",padre:aux2});
	uobj.masas={  selma:auxse, todas:new CRadio({opciones:["Todas","Selección"],selec:cma.s,padre:auxse.conte,callback:cradiosel,dat:auxse}) };
	auxse.datos.ent.style.display=cma.d;*/
	uobj.masas=new Cradiocheck({selec:cma,padre:aux2,la:"Masas:"});
	var afal=[],y;
	for (var m=0;m<datpiz.masas.length;m++)
			afal.push(false);
	if (cma) 
		for (var m=0,lon=cus.masas.length;m<lon;m++)
			if ( (y=busena(datpiz.masas,cus.masas[m]))>-1 ) afal[y]=true;
			else {
				var auxer=document.createElement("div");
				auxer.className="com-error";
				auxer.innerHTML="Masa ("+cus.masas[m]+") no existe";
				aux2.appendChild(auxer);
			}

	//uobj.masas.selma.seteles(datpiz.masas,afal);
	uobj.masas.selche.seteles(datpiz.masas,afal);
	aux.appendChild(aux2);

	aux2=document.createElement("div");
	/*auxse=new ClabCheck({la:"Tamaños:",padre:aux2});
	uobj.tamas={ selta:auxse, todas:new CRadio({opciones:["Todos","Selección"],selec:cta.s,padre:auxse.conte,callback:cradiosel,dat:auxse}) };
	auxse.datos.ent.style.display=cta.d;*/
	uobj.tamas=new Cradiocheck({selec:cta,padre:aux2,la:"Tamaños:"});
	afal=[];
	for (var m=0;m<datpiz.tamas.length;m++){
		afal.push(false);
	}
	if (cta) 
		for (var m=0,lon=cus.tamas.length;m<lon;m++)
			if ( (y=busena(datpiz.tamas,cus.tamas[m]))>-1 ) afal[y]=true;
			else {
				var auxer=document.createElement("div");
				auxer.className="com-error";
				auxer.innerHTML="Tamaño ("+cus.tamas[m]+") no existe";
				aux2.appendChild(auxer);
			}
	//uobj.tamas.selta.seteles(datpiz.tamas,afal);
	uobj.tamas.selche.seteles(datpiz.tamas,afal);
	aux.appendChild(aux2);

	aux2=document.createElement("div");
	/*auxse=new ClabCheck({la:"Pizzas:",padre:aux2});
	uobj.pizzas={ selpi:auxse, todas:new CRadio({opciones:["Todas","Selección"],selec:cpi.s,padre:auxse.conte,callback:cradiosel,dat:auxse}) };
	auxse.datos.ent.style.display=cpi.d;*/
	uobj.pizzas=new Cradiocheck({selec:cpi,padre:aux2,la:"Pizzas:"});
	afal=[];
	for (var m=0;m<datpiz.piz.length;m++){
		afal.push(false);
	}
	if (cpi) 
		for (var m=0,lon=cus.artis.length;m<lon;m++)
			if ( (y=busena(datpiz.piz,cus.artis[m]))>-1 ) afal[y]=true;
			else {
				var auxer=document.createElement("div");
				auxer.className="com-error";
				auxer.innerHTML="Pizza ("+cus.artis[m]+") no existe";
				aux2.appendChild(auxer);
			}
	//uobj.pizzas.selpi.seteles(datpiz.piz,afal);
	uobj.pizzas.selche.seteles(datpiz.piz,afal);
	aux.appendChild(aux2);
	return {d:aux,ob:uobj};
	//if (cus) osea si customizar oferta
	//posibilidades en personalizar oferta:
	// 1.- se cobra=C
	// 2.- se regala=R
	// 3.- descuento en € o %=E impt ó P impt

	// elegir:masas T todas,tamaños T todos,numero de ingredientes = igual > mayor < menor ó T todos
	// elegir ids de pizza en su caso
}
function detalleProsimple(idp,nom,cus){
	var datart=controladorOtros.datosOtro(idp);
	var uobj={tipopro:1,idp:idp};
	var aux=customOfer(uobj,cus,nom,true);
	var aux2=document.createElement("div");
	var cart=0; //{s:0,d:"none"};
	if (cus){
		uobj.nid=cus.nid;
		cart=cus.artis.length>0; 
		/* if(cus.artis.length>0){
			cart.s=1;cart.d="block";
		}*/
	}
	/*var auxse=new ClabCheck({la:nom+":",padre:aux2});
	uobj.arti={ selart:auxse, todas:new CRadio({opciones:["Todos","Selección"],selec:cart.s,padre:auxse.conte,callback:cradiosel,dat:auxse}) };
	auxse.datos.ent.style.display=cart.d;*/
	uobj.arti=new Cradiocheck({selec:cart,padre:aux2,la:nom+":"});
	var afal=[];
	for (var m=0;m<datart.length;m++){
		afal.push(false);
	}
	if (cart)
		for (var m=0,y=0,lon=cus.artis.length;m<lon;m++)
			if ( (y=busena(datart,cus.artis[m]))>-1 ) afal[y]=true;
			else {
				var auxer=document.createElement("div");
				auxer.className="com-error";
				auxer.innerHTML=nom+" ("+cus.artis[m]+") no existe";
				aux2.appendChild(auxer);
			}
	//uobj.arti.selart.seteles(datart,afal);
	uobj.arti.selche.seteles(datart,afal);
	aux.appendChild(aux2);
	return {d:aux,ob:uobj};
	// elegir:cantidad y eligir ids de producto en su caso
}
function detalleProcomplex(idp,nom,cus){
	var datotx=controladorOtroscomplex.datosOtx(idp);
	var uobj={tipopro:2,idp:idp};
	var aux=customOfer(uobj,cus,nom);
	var aux2=hUtils.crearElemento({e:"fieldset",hijos:[{e:"legend",inner:nom+" con ingredientes:"}]});
	uobj.coning=new ClabSelect({la:"Condición ingredientes",padre:aux2});
	uobj.numing=new ClabInput({la:"Número de ingredientes",lon:2,padre:aux2},hUtils.validarInt);
	uobj.coning.opciones([["Mayor","ma"],["Menor","me"],["Igual","ig"],["Cualquiera","cu"]]);
	aux.appendChild(aux2);
	var cta=0,cart=0;
	//{s:0,d:"none"},cart={s:0,d:"none"};
	if (cus){
		uobj.nid=cus.nid;
		uobj.numing.datos.ent.value=cus.ingres.numing;
		uobj.coning.datos.ent.selectedIndex=["ma","me","ig","cu"].indexOf(cus.ingres.condiing);
		cta=cus.tamas.length>0;//if (cus.tamas.length>0) { cta.s=1; cta.d="block"}
		cart=cus.artis.length>0;//if (cus.artis.length>0) { cart.s=1; cart.d="block"}

	}
	var afal;
	if (datotx.tamas){
		aux2=document.createElement("div");
		/*auxse=new ClabCheck({la:"Tamaños:",padre:aux2});
		uobj.tamas={ selta:auxse, todas:new CRadio({opciones:["Todos","Selección"],selec:cta.s,padre:auxse.conte,callback:cradiosel,dat:auxse}) };
		auxse.datos.ent.style.display=cta.d;*/
		uobj.tamas=new Cradiocheck({selec:cta,padre:aux2,la:"Tamaños:"});
		afal=[];
		for (var m=0;m<datotx.tamas.length;m++){
			afal.push(false);
		}
		if (cta)
			for (var m=0,y=0,lon=cus.tamas.length;m<lon;m++)
				if ( (y=busena(datotx.tamas,cus.tamas[m]))>-1 ) afal[y]=true;
				else {
					var auxer=document.createElement("div");
					auxer.className="com-error";
					auxer.innerHTML="Tamaño ("+cus.tamas[m]+") no existe";
					aux2.appendChild(auxer);
				}
		//uobj.tamas.selta.seteles(datotx.tamas,afal);
		uobj.tamas.selche.seteles(datotx.tamas,afal);
		aux.appendChild(aux2);
	}

	aux2=document.createElement("div");
	/*auxse=new ClabCheck({la:nom+":",padre:aux2});
	uobj.arti={ selart:auxse, todas:new CRadio({opciones:["Todos","Selección"],selec:cart.s,padre:auxse.conte,callback:cradiosel,dat:auxse}) };
	auxse.datos.ent.style.display=cart.d;
	uobj.arti=new Cradiocheck({selec:cart,padre:aux2,la:nom+":"});*/
	uobj.arti=new Cradiocheck({selec:cart,padre:aux2,la:nom+":"});
	afal=[];
	for (var m=0;m<datotx.art.length;m++){
		afal.push(false);
	}
	if (cart)
		for (var m=0,y=0,lon=cus.artis.length;m<lon;m++)
			if ( (y=busena(datotx.art,cus.artis[m]))>-1 ) afal[y]=true;
			else {
				var auxer=document.createElement("div");
				auxer.className="com-error";
				auxer.innerHTML=nom+" ("+cus.masas[m]+") no existe";
				aux2.appendChild(auxer);
			}
	//uobj.arti.selart.seteles(datotx.art,afal);
	uobj.arti.selche.seteles(datotx.art,afal);
	aux.appendChild(aux2);
	return {d:aux,ob:uobj};
	// elegir: cantidad, tamaños T todos, numero de ingredientes = > < ó T todos
}
function seterrorpm(s){
	console.log("erororororpm="+s);
	plantillaOfer.geerror.innerHTML=s;
	plantillaOfer.geerror.style.display="block";
	window.scrollTo(0,0);
}
function compFecha(){
		var fe=plantillaOfer.plaMod.fecha;

		
		if ( !hUtils.validarFecha(fe.fecdes.value) || ! hUtils.validarFecha(fe.fechas.value)){
			seterrorpm("1 Fechas no válidas. Su formato debe ser: dia/mes/año->dd/mm/aaaa "+fe.fecdes.value+", "+fe.fechas.value);
			return false;
		}
		
		//new Date(year, month, day, hours, minutes, seconds, milliseconds);
		try {
			if ( fe.fecdes.value.indexOf("/")>-1) {
				var fed=fe.fecdes.value.split("/"),
					feh=fe.fechas.value.split("/");
			}else {
				var fed=fe.fecdes.value.split("-"),
					feh=fe.fechas.value.split("-");
			}
			//var aa=0,dd=2;
			if (fed[2].length>2){
				var aa=fed[0];
				fed[0]=fed[2];
				fed[2]=aa;
				aa=feh[0];
				feh[0]=feh[2];
				feh[2]=aa;
				//aa=2;
				//dd=0;
			}
			var da1=new Date(parseInt(fed[0]),parseInt(fed[1]-1),parseInt(fed[2])),
				da2=new Date(parseInt(feh[0]),parseInt(feh[1]-1),parseInt(feh[2])); //Date(parseInt(feh[aa]),parseInt(feh[1]-1),parseInt(feh[dd]));
		} catch(e){
				seterrorpm("2 Fechas no válidas. Su formato debe ser: dia/mes/año->dd/mm/aaaa "+fe.fecdes.value+", "+fe.fechas.value);
				return false;
		}
		if (da2.getTime()<=da1.getTime()){
			seterrorpm("La fecha hasta debe ser mayor a la fecha desde.d1="+da1.toLocaleString()+"\nd2="+da2.toLocaleString());
			return false;
		}

		var ho=plantillaOfer.plaMod.hora;
		if ( !hUtils.validarHora(ho.hde.value) || ! hUtils.validarHora(ho.ha.value)){
			seterrorpm("1 Horas no válidas. Su formato debe ser: Hora:Minutos->HH:MM");
			return false;
		}
		try {
			var hed=ho.hde.value.split(":"),
				heh=ho.ha.value.split(":");
			da1=new Date();
			da1.setHours(parseInt(hed[0]));
			da1.setMinutes(parseInt(hed[1]));
			da2=new Date();
			da2.setHours(parseInt(heh[0]));
			da2.setMinutes(parseInt(heh[1]));
		} catch(e){
				seterrorpm("2 Horas no válidas. Su formato debe ser: Hora:Minutos->HH:MM");
				return false;
		}
		if (da2.getTime()<=da1.getTime()){
			seterrorpm("La hora hasta debe ser mayor a la hora desde.d1="+da1.toLocaleString()+"\nd2="+da2.toLocaleString());
			return false;
		}
		return {feh:feh,fed:fed,hed:hed,heh:heh};
}
function errorProduc(s){
	var auxer=document.createElement("p");
	auxer.innerHTML=s;
	plantillaOfer.tipoproerror.appendChild(auxer);
	plantillaOfer.tipoproerror.style.display="block";
}
/*function cradiosel(nele,ele){
	if (nele==0){
		ele.dat.datos.ent.style.display="none";
		ele.dat.limpiar();
	}else
		ele.dat.datos.ent.style.display="block";

}*/
function cambiarImagen(tr,propalmacen,tit,nomima,nid){ //cambiarImagen(tr,tit,lim,nomima,cb){
	FileimgApi.imagen(null,propalmacen,"(Oferta) "+tit,100,nomima,function(acc,obj){
		if (acc=="nueva"){
			plantillaOfer.tabla.setModeloCelNom(tr,"IMAGEN",obj.nombre);
			plantillaOfer.tabla.setalmacen(tr,{ImgUrl:obj.url});
			FileimgApi.planImagenes.add_bloq_img("ofer",obj.nombre,obj.url,plantillaOfer.tabla.getModeloCelNom(tr,"NOMBRE"),null,nid);
			//td.parentNode.ImgUrl=obj.url;
		}else{
			plantillaOfer.tabla.setModeloCelNom(tr,"IMAGEN","Añadir");
			plantillaOfer.tabla.setalmacen(tr,{ImgUrl:null});
			FileimgApi.planImagenes.eliminar_bloq_img("ofer",nid);
			//td.parentNode.ImgUrl=null;
		}
	 });
	//FileimgApi.imagen(null,tr,tit,lim,nomima,cb); //,tr.ImgUrl);
}

function eliminarPlamods() {
	plantillaOfer.prodetalle=null;
	plantillaOfer.divdetalle.innerHTML="";
}
var adias=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
var plantillaOfer= {
	modelo:[[Clink,"NOMBRE", "Nombre",true],[Ctexto,"DESCRIP", "Descripción",true],[Clista,"FECVALID", "Fec.Válido",true],[Clista,"HORVALID", "Hora.Válido",true],[Clista,"DIASVALID", "Días.Valido",true],[Ctexto,"VALIDPARA", "Válida para",true],[Ctexto,"OFEREN", "Oferta en",true],[Cnumero,"NPRO", "Nº.Pro",true],[Ctexto,"GRUPO", "Grupo",true],[Cboton,"IMAGEN", "Imágen",true]],
	tit1:"Ofertas",
	tramod:null,
	url:"/admintienda/Ofertas/oferta",
	plaMod:null,
	modificar:false,
	divdetalle:null,
	prodetalle:null,
	inddet:0,
	listagrupo:["0"],
	corderIns:{"NOMBRE":1,"DESCRIP":2,"FECVALID":3,"HORVALID":4,"DIASVALID":5,"VALIDPARA":6,"OFEREN":7,"NPRO":8,"GRUPO":9,"IMAGEN":10},
	inicio:function(dpa,dat){
		var divofer=document.createElement("div");
		divofer.className="marco-hijo";
		dpa.appendChild(divofer);
		//var ventanaPadre=new ClsVentanasTipo.titaceptar({titulo:"Ofertas",padre:divofer });

		//var shm=this.showModificador;
		this.tabla=new ClsTabla.tabla(this,this.showModificador,true);
		//console.log("plaofer.modelo=",this.modelo," tabla ofer =",this.tabla);
		this.ventabla=new ClsVentanasTipo.titaceptar({
					titulo:"Ofertas",
					contenido:this.tabla.tabla,
					padre:divofer, //ventanaPadre.dentro,
					anchototal:true,
					aceptar:{tit:"Añadir Oferta",cb:this.showModificador }
				});
		this.ventabla.pie.appendChild(hUtils.crearElemento({e:"button", inner:"Actualizar",a:{className:"btn btn-left",title:"Recargar Ofertas",onclick:this.actualizar  }},null));
		//ventanaPadre.show();
		this.ventabla.show();
		this.renderizarTabla(dat);
		return divofer;
	},
	actualizar:function (){
		hUtils.xJson({url:"/admintienda/Ofertas",accion:"GET",formu:false}).then(function(dat){
			console.log("recibimos ok respuesta en actualizar ofertas dat=",dat);
			plantillaOfer.tabla.vaciartabla();
			plantillaOfer.renderizarTabla(dat);
		}).fail(function(dat){
			console.log("recibimos error en actualizar ofertas respuesta dat="+dat);
		});
	},
	renderizarTabla:function(dat){

		//console.log("recibimos ok respuesta dat=",dat);
		var lon=dat.ofer.length;
		for (var i=0;i<lon;i++){
			var diax=[];
			if (dat.ofer[i][7]=="T"){
				diax.push("Todos");
			}else{
				//var diasv=dat.ofer[i][7].split("");
				//console.log("dias graaa="+dat.ofer[i][7]);
				for (var z=0,lo=dat.ofer[i][7].length;z<lo;z++){
					//console.log("di "+i+"="+dat.ofer[i][7][i]);
					diax.push(adias[parseInt(dat.ofer[i][7][z])-1]);
				}
			}

			plantillaOfer.tabla.insOrden([dat.ofer[i][0],dat.ofer[i][1],dat.ofer[i][2],[dat.ofer[i][3],dat.ofer[i][4]],[dat.ofer[i][5],dat.ofer[i][6]],diax,dat.ofer[i][8] ? "Local" : "Local y Domicilio",dat.ofer[i][9] ? "Pedido" : "Productos",dat.ofer[i][15],dat.ofer[i][18],dat.ofer[i][17][0] || "Añadir"],plantillaOfer.corderIns , {
					keyControler:dat.ofer[i][16],
					ImgUrl:dat.ofer[i][17][1],
					oferta:{
						ofertaen:dat.ofer[i][10],
						prefijo:dat.ofer[i][11],
						descuento: dat.ofer[i][12],
						descueneuopor:dat.ofer[i][13] ? 0 :1,
						incremento:dat.ofer[i][14],
						productos:dat.ofer[i][19]
					}
				 });
			/*tr.keyControler=dat.ofer[i][16];
			tr.ImgUrl=dat.ofer[i][17][1];*/
			/*for (var p=0,lop=dat.ofer[i][19].length;p<lop;p++) {
				if (dat.ofer[i][19][p].custom.de){
					dat.ofer[i][19][p].custom.de=dat.ofer[i][19][p].custom.dp;
					dat.ofer[i][19][p].custom.dp=0;
				}else 
					dat.oferta[19][p].custom.de=0;
			}*/
			/*tr.oferta={
				ofertaen:dat.ofer[i][10],
				prefijo:dat.ofer[i][11],
				descuento: dat.ofer[i][12],
				descueneuopor:dat.ofer[i][13] ? 0 :1,
				incremento:dat.ofer[i][14],
				productos:dat.ofer[i][19]
			}*/
		}
	},
	clickCelda:function(td){
		if (td.nom == "IMAGEN") { //.cellIndex==10){
			var pltab=plantillaOfer.tabla;
			cambiarImagen(td.td.parentNode,pltab.getalmacen(td.td.parentNode),pltab.getModeloCelNom(td.td.parentNode,"NOMBRE"),pltab.getModeloCelNom(td.td.parentNode,"IMAGEN"),ClsTabla.did(td.td.parentNode));
			/*cambiarImagen(pltab.getalmacen(td.td.parentNode),pltab.getModeloCelNom(td.td.parentNode,"NOMBRE"),50,pltab.getModeloCelNom(td.td.parentNode,"IMAGEN"),function(acc,obj){ 
				if (acc=="nueva"){
					Cboton.set(td.td,obj.nombre);
					pltab.setalmacen(td.td.parentNode,{ImgUrl:obj.url});
					FileimgApi.planImagenes.add_bloq_img("ofer",obj.nombre,obj.url,pltab.getModeloCelNom(td.td.parentNode,"NOMBRE"),null,ClsTabla.did(td.td.parentNode));
					//td.parentNode.ImgUrl=obj.url;
				}else{
					Cboton.set(td.td,"Añadir");
					pltab.setalmacen(td.td.parentNode,{ImgUrl:null});
					FileimgApi.planImagenes.eliminar_bloq_img("ofer",ClsTabla.did(td.td.parentNode));
					//td.parentNode.ImgUrl=null;
				}
			 });*/
		}
	},
	showModificador:function(trs){ 
		
			if (plantillaOfer.plaMod==null) {
					var aux=hUtils.crearElemento({e:"div",a:{className:"conclase-modpiz"},hijos:[{e:"div",a:{className:"com-error"},did:"geerror"}]},plantillaOfer);
					plantillaOfer.divplamod=document.createElement("div");
					plantillaOfer.crear(plantillaOfer.divplamod);
					aux.appendChild(plantillaOfer.divplamod);
					plantillaOfer.venMod=new ClsVentanasTipo.popup({
						titulo:"Añadir Oferta",
						contenido:aux,
						aceptar:{tit:"Enviar", cb:plantillaOfer.cbcomprobar
						//plantillaOfer.cbcomprobar.bind(this)
						 } 
					});
			}
			if(trs){
				plantillaOfer.modificar=true;
				plantillaOfer.modificacion(trs);
				plantillaOfer.venMod.tit.innerHTML="Modificar Oferta";
			}else {
				plantillaOfer.modificar=false;
				plantillaOfer.limpiar();
				/*if (! plantillaOfer.plantilla.limpiar()){
					plantillaOfer.venMod.cerrar();
					return;
				}*/
				plantillaOfer.venMod.tit.innerHTML="Añadir Oferta";
			}
			/*var ix=0;
			for (var i in plantillaOfer.plaMod[0]){
				if (ix==0) ix=i;
				if (plantillaOfer.plaMod[0][i].outerror) plantillaOfer.plaMod[0][i].outerror();
			}*/
			plantillaOfer.venMod.show();
			//plantillaOfer.plaMod[0][ix].datos.ent.focus();
	},
	crear:function (aux) {
		this.plaMod={
			nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
			descrip:new ClabInput({la:"Descripción",lon:200,padre:aux,area:true}),
			fecha:{},
			hora:{}
		}
		aux.appendChild(hUtils.crearElemento({e:"fieldset",hijos:[
			{e:"legend",inner:"Fecha validez (dd/mm/aaaa):"},
			{e:"div",a:{className:"secundario"},hijos:[{e:"label",inner:"Desde:"},{e:"input",did:"fecdes",a:{type:"date",maxLength:10,placeholder:"dd/mm/aaaa"}}]},
			{e:"div",a:{className:"secundario"},hijos:[{e:"label",inner:"Hasta:"},{e:"input",did:"fechas",a:{type:"date",maxLength:10,placeholder:"dd/mm/aaaa"}}]}
		]},this.plaMod.fecha) );
		aux.appendChild(hUtils.crearElemento({e:"fieldset",hijos:[
			{e:"legend",inner:"Hora validez (HH:MM):"},
			{e:"div",a:{className:"secundario"},hijos:[{e:"label",inner:"Desde las:"},{e:"input",did:"hde",a:{type:"time",maxLength:5,placeholder:"HH:MM"}}]},
			{e:"div",a:{className:"secundario"},hijos:[{e:"label",inner:"Hasta las:"},{e:"input",did:"ha",a:{type:"time",maxLength:5,placeholder:"HH:MM"}}]}
		]},this.plaMod.hora));
		var aux2=document.createElement("div");
		aux2.className="secundario com-labinput";
		/*var auxselche=new ClabCheck({la:"Día de la semana",padre:aux2});
		this.plaMod.dias={ seldi:auxselche, todas:new CRadio({opciones:["Todos","Selección"],selec:0,padre:auxselche.conte,callback:cradiosel,dat:auxselche}) };

		auxselche.seteles([["Lunes",1],["Martes",2],["Miércoles",3],["Jueves",4],["Viernes",5],["Sábado",6],["Domingo",7]],[false,false,false,false,false,false,false]);
		auxselche.datos.ent.style.display="none";*/
		this.plaMod.dias=new Cradiocheck({selec:false,padre:aux2,la:"Día de la semana:"});
		this.plaMod.dias.selche.seteles([["Lunes",1],["Martes",2],["Miércoles",3],["Jueves",4],["Viernes",5],["Sábado",6],["Domingo",7]],[false,false,false,false,false,false,false]);
		aux.appendChild(aux2);
		//aux2=document.createElement("div");
		//aux2.className="secundario";
		var aux3 =document.createElement("div");
		aux3.className="secundario";
		this.plaMod.grupo=new ClabInpSel({la:"Grupo",lon:30,padre:aux3,planti:plantillaOfer}); //new ClabInput({la:"Grupo",lon:80,padre:aux3});
		this.plaMod.locodomi=new CRadio({opciones:["Local","Local y Domicilio"],selec:1,padre:aux3});
		
		
		this.plaMod.ped_pro=new CRadio({opciones:["En Pedido","En Productos"],selec:1,padre:aux3,callback:this.selpedpro,dat:this.plaMod});
		
		this.plaMod.enpedido=document.createElement("select");
		this.plaMod.enproduc=document.createElement("select");
		var opros=[["Cobrar producto más caro","cc"],["Regalar producto más barato","rb"],["Personalizar oferta productos","cu"],["Un Precio fijo para el conjunto de productos","pf"],["Descuento (€,%) producto más barato","db"]];
		var opeds=[["Regalo en pedido superior a","rs"],["Un Precio fijo para un producto","pp"],["Personalizar oferta productos","cu"]]
		for (var i=0;i<opros.length;i++){
			this.plaMod.enproduc.options[i]=new Option(opros[i][0],opros[i][1]);
		}
		for (var i=0;i<opeds.length;i++){
			this.plaMod.enpedido.options[i]=new Option(opeds[i][0],opeds[i][1]);
		}
		this.plaMod.enpedido.style.display="none";
		aux3.appendChild(this.plaMod.enpedido);
		aux3.appendChild(this.plaMod.enproduc);
		//aux.appendChild(aux2);
		aux.appendChild(aux3);
		aux2=document.createElement("fieldset");
		aux2.innerHTML="<legend>Introduce importe o descuento si corresponde:</legend>";
		this.plaMod.prefijo=new ClabInput({la:"Importe Precio fijo",lon:6,padre:aux2},hUtils.validarFloat);
		this.plaMod.incpreofer=new ClabInput({la:"Añadir euros a oferta",lon:6,padre:aux2},hUtils.validarFloat);
		this.plaMod.descueneuros=new ClabInpflsw({lon:5,min:0,la:"Descuento en € ó %",va:["€","%"],padre:aux2});
		//new ClabInput({la:"Descuento en Euros",lon:6,padre:aux2},hUtils.validarFloat);
		//this.plaMod.desporcen=new ClabInput({la:"Descuento en porcentaje",lon:6,padre:aux2},hUtils.validarFloat);
		
		aux.appendChild(aux2);
		this.divdetalle=document.createElement("div");
		aux.appendChild(this.divdetalle);
		aux2=document.createElement("div");
		aux2.style.margin="1em";
		this.plaMod.tipoProduc=document.createElement("select");

		
		aux2.appendChild(this.plaMod.tipoProduc);
		var butseltipo=document.createElement("button");
		butseltipo.innerHTML="Añadir";
		butseltipo.onclick=this.seltipopro.bind(this); //.plaMod.tipoProduc);
		this.tipoproerror=document.createElement("div");
		this.tipoproerror.className="com-error";
		this.tipoproerror.style.display="none";
		aux2.appendChild(butseltipo);
		aux.appendChild(aux2);
	},
	selpedpro:function(nele,ele){
			if (nele==1){
				ele.dat.enproduc.style.display="block";
				ele.dat.enpedido.style.display="none";

			}else{
				ele.dat.enpedido.style.display="block";
				ele.dat.enproduc.style.display="none";

			}
	},
	seltipopro:function(){
		var tipo=this.plaMod.tipoProduc.options[this.plaMod.tipoProduc.selectedIndex].value.split("-");
		var od;
		switch(parseInt(tipo[0])){
			case 0: //pizza sacar detalle de oferta de pizzas
					od=detallePizza(null);
					break;
			case 1:// categoría simple sacar detalle de oferta en tipo[1] tenemos el id de esa categoría para sacar el listado
					od=detalleProsimple(tipo[1],this.plaMod.tipoProduc.options[this.plaMod.tipoProduc.selectedIndex].text,null);
					break;
			case 2: // categorías con ingredientes
					od=detalleProcomplex(tipo[1],this.plaMod.tipoProduc.options[this.plaMod.tipoProduc.selectedIndex].text,null);
					break;
		}
		this.divdetalle.appendChild(od.d); 
		this.prodetalle.push({ob:od.ob,nele:this.inddet});
		this.inddet++;
	},
	rellenar:function() {
		//console.log("hijos otros=",controladorOtros.producHijos());
		//console.log("hijos otroscomplex=",controladorOtroscomplex.producHijos());
		this.inddet=0;
		this.tipoproerror.style.display="none";
		var tipos=[["Pizzas","0-0"]].concat(controladorOtros.producHijos(),controladorOtroscomplex.producHijos()); // ["bebidas","1-id"],helados,complementos,ensaladas,hamburguesas...
		this.plaMod.tipoProduc.options.length=0;
		for (var i=0;i<tipos.length;i++){
			this.plaMod.tipoProduc.options[i]=new Option(tipos[i][0],tipos[i][1]);
		}
	},
	modificacion:function(tr){
		tr=this.tramod=tr[0];
		this.prodetalle=[];
		this.divdetalle.innerHTML="";
		var corder=["NOMBRE","DESCRIP","FECVALID","HORVALID","DIASVALID","VALIDPARA","OFEREN","NPRO","GRUPO","IMAGEN"],tralm=plantillaOfer.tabla.getalmacen(tr);
		var dat=this.tabla.getLinea(tr,corder).li;
		//[[Clink,"Nombre"],[Ctexto,"Descripción"],[Clista,"Fec.Válido"],[Clista,"Hora.Válido"],[CLista,"Días.Valido"],[Ctexto, "Válida para"],[Ctexto,"Oferta en"],[Cboton,"Imágen"]],
		ClabInpSel.prototype.hacerlistagrupo(plantillaOfer.tabla.tbody.rows,plantillaOfer,plantillaOfer.tabla.nomcolum["GRUPO"]);
		this.plaMod.grupo.pintarlista();
		this.plaMod.nombre.set(dat[0]);
		this.plaMod.descrip.set(dat[1]);
		this.plaMod.grupo.set(dat[8]);
		this.plaMod.fecha.fecdes.value=dat[2][0];
		if (this.plaMod.fecha.fecdes.value=="") {
			var ye=dat[2][0].split("/"),ye2=dat[2][1].split("/");
			this.plaMod.fecha.fecdes.value=ye[2]+"-"+ye[1]+"-"+ye[0];
			this.plaMod.fecha.fechas.value=ye2[2]+"-"+ye2[1]+"-"+ye2[0];
		}else{
			this.plaMod.fecha.fechas.value=dat[2][1];
		}
		this.plaMod.hora.hde.value=dat[3][0];
		this.plaMod.hora.ha.value=dat[3][1];
		
		if ( dat[4][0]!="Todos"){
			//this.plaMod.dias.todas.seleccionar(1);
			//var sda=this.plaMod.dias.seldi.datos;
			this.plaMod.dias.seleccionar(1);
			var sda=this.plaMod.dias.selche.datos;
			
			for (var i=0,lo=dat[4].length;i<lo;i++){
				sda.che["ch"+adias.indexOf(dat[4][i])].checked=true;
			}
			//sda.ent.style.display="block";
		}else{
			//this.plaMod.dias.todas.seleccionar(0);
			//this.plaMod.dias.seldi.datos.ent.style.display="none";
			this.plaMod.dias.seleccionar(0);
		}
		if (dat[5]=="Local")
			this.plaMod.locodomi.seleccionar(0);
		else
			this.plaMod.locodomi.seleccionar(1);
		if (dat[6]=="Pedido"){
			this.plaMod.ped_pro.seleccionar(0);
			this.plaMod.enpedido.selectedIndex=tralm.oferta.ofertaen;
			this.plaMod.enproduc.style.display="none";
			this.plaMod.enpedido.style.display="block";
			/*lo=this.plaMod.enpedido.options.length;
			for (var i=0;i<lo;i++)
				if (tr.oferta.ofertaen==this.plaMod.enpedido.options[i].value){
					this.plaMod.enpedido.selectedIndex=i; break;
				}
			this.plaMod.enproduc.selectedIndex=0;*/
		}else{
			this.plaMod.ped_pro.seleccionar(1);
			this.plaMod.enproduc.selectedIndex=tralm.oferta.ofertaen;
			this.plaMod.enproduc.style.display="block";
			this.plaMod.enpedido.style.display="none";
			/*lo=this.plaMod.enproduc.options.length;
			for (var i=0;i<lo;i++)
				if (tr.oferta.ofertaen==this.plaMod.enproduc.options[i].value){
					this.plaMod.enproduc.selectedIndex=i; break;
				}
			this.plaMod.enpedido.selectedIndex=0;*/
		}
		this.plaMod.prefijo.set(tralm.oferta.prefijo);
		this.plaMod.descueneuros.setsw(tralm.oferta.descuento,tralm.oferta.descueneuopor);
		//this.plaMod.descueneuros.set(tr.oferta.descueneuros);
		//this.plaMod.desporcen.set(tr.oferta.descuenporcen);
		this.plaMod.incpreofer.set(tralm.oferta.incremento);
		this.rellenar();
		var od;
		//console.log("tr.oferta.productos=",tr.oferta.productos);
		for (var z in tralm.oferta.productos){
			this.inddet++;
			switch(tralm.oferta.productos[z].tp){
				case 0: od=detallePizza(tralm.oferta.productos[z]);
						
						//this.divdetalle.appendChild(detallePizza(tr.oferta.productos[i].detalle),i);
						break;
				case 1: var opx=this.plaMod.tipoProduc.options,nom=false;
						for (var i=1,lon=opx.length;i<lon;i++){
							if ( parseInt(opx[i].value.split("-")[1],10)==parseInt(tralm.oferta.productos[z].idp,10)){ nom=opx[i].text; break; }
						}
						if ( nom===false)
							errorProduc("Tipo producto simple ("+tralm.oferta.productos[z].idp+") no existe." );
						else od=detalleProsimple(tralm.oferta.productos[z].idp,nom,tralm.oferta.productos[z]);
						break;
				case 2:  var opx=this.plaMod.tipoProduc.options,nom=false;
						for (var i=1,lon=opx.length;i<lon;i++){
							if ( parseInt(opx[i].value.split("-")[1],10)==parseInt(tralm.oferta.productos[z].idp,10)){ nom=opx[i].text; break; }
						}
						if ( nom===false)
							errorProduc("Tipo producto complex ("+tralm.oferta.productos[z].idp+") no existe." );
						else
							od=detalleProcomplex(tralm.oferta.productos[z].idp,nom,tralm.oferta.productos[z]);
						break;
			}
			this.divdetalle.appendChild(od.d); 
			this.prodetalle.push({ob:od.ob,nele:this.inddet});
		}
		this.plaMod.nombre.datos.ent.focus();

	},
	limpiar:function(){
		this.prodetalle=[];
		this.tramod=null;
		this.inddet=0;
		this.divdetalle.innerHTML="";
		ClabInpSel.prototype.hacerlistagrupo(plantillaOfer.tabla.tbody.rows,plantillaOfer,plantillaOfer.tabla.nomcolum["GRUPO"]);
		this.plaMod.grupo.pintarlista();
		this.plaMod.nombre.set("");
		this.plaMod.descrip.set("");
		this.plaMod.grupo.set("0");
		var faux=new Date();
		var famo=faux.getMonth()+1;
		famo=(famo<10 ? 0+famo.toString() : famo );
		var fadi=(faux.getDate()<10 ? 0+faux.getDate().toString() : faux.getDate());

		//faux=faux.getFullYear()+"-"+( (faux.getMonth()+1)<10 ? 0+(faux.getMonth()+1).toString() : (faux.getMonth()+1) ) +"-"+ (faux.getDate()<10 ? 0+faux.getDate().toString() : faux.getDate());
		this.plaMod.fecha.fecdes.value=fadi+"/"+famo+"/"+faux.getFullYear();
		if (this.plaMod.fecha.fecdes.value=="") {
			this.plaMod.fecha.fecdes.value=faux.getFullYear()+"-"+famo+"-"+fadi;
			this.plaMod.fecha.fechas.value=faux.getFullYear()+"-12-31";
		}else{
			this.plaMod.fecha.fechas.value="31/12/"+faux.getFullYear();
		}
		this.plaMod.hora.hde.value="10:00";
		this.plaMod.hora.ha.value="23:59";
		//this.plaMod.dias.todas.seleccionar(0);
		this.plaMod.dias.seleccionar(0);
		//this.plaMod.dias.seldi.datos.ent.style.display="none";
		//this.plaMod.dias.seldi.limpiar();

		//for (var i in sda.che)
		//	sda.che[i].checked=false;
		//sda.ent.style.display="none";
		this.plaMod.locodomi.seleccionar(1);
		this.plaMod.ped_pro.seleccionar(1);
		this.plaMod.enproduc.style.display="block";
		this.plaMod.enpedido.style.display="none";

		this.plaMod.enpedido.selectedIndex=0;
		this.plaMod.enproduc.selectedIndex=0;
		this.plaMod.prefijo.set(0);
		this.plaMod.descueneuros.setsw(0,0);
		//this.plaMod.descueneuros.set(0);
		//this.plaMod.desporcen.set(0);
		this.plaMod.incpreofer.set(0);
		this.rellenar();
		this.plaMod.nombre.datos.ent.focus();
	},
	cbcomprobar:function() {
		var plm=plantillaOfer.plaMod;
		plantillaOfer.geerror.style.display="none";
		var nom,desc,gru,fe,pref=0,inc=0,desE={v:0,s:0};
		if (! (nom=plm.nombre.comprobar()) || ! (desc=plm.descrip.comprobar()) || ! (fe=compFecha()) || !(gru=plm.grupo.comprobar()))
			return;
		/*var diasv;
		if (plm.dias.todas.sel==1) 
			diasv=plm.dias.seldi.get();
		else
			diasv=0;*/
		var diasv=plm.dias.comprobar("día/s");
		if (diasv)
			diasv=diasv.v;
		else
			return;
		if (!(pref=nuconCero(plm.prefijo)) || ! (desE=plm.descueneuros.comprobar()) || ! (inc=nuconCero(plm.incpreofer))) 
					return;
		//plm.locodomi.sel;//0 local 1=domicilio
		//plm.ped_pro.sel;//0 producto 1=pedido

		if (plm.ped_pro.sel===0 )
			var numofe=plm.enpedido.selectedIndex;
		else
			var numofe=plm.enproduc.selectedIndex;
		if ( (plm.ped_pro.sel==0 && numofe<2) || (plm.ped_pro.sel==1 && numofe==3))  {
			console.log("prefijo="+pref[1]);
			if ( pref[1]==0){
				plm.prefijo.seterror("Debes de introducir un precio fijo en euros válido.");
				return;
			} 
				
		}else if (plm.ped_pro.sel==1 && numofe==4 && desE.v===0){
					plm.descueneuros.seterror("Debes de introducir un descuento, en Euros o en porcentaje.");
					return;
				}

		/*if (plm.ped_pro.sel==1 && numofe==4) 
			if ( desE[1]>0 ){
				if (desP[1]>0){
					seterrorpm("Introduce sólo un tipo de descuento, en Euros o en porcentaje.");
				}
			}else{
				if (desP[1]===0){
					seterrorpm("Debes de introducir un descuento, en Euros o en porcentaje.");
					return;
				}
			}*/
		var pjson=[],cus;
		if (plantillaOfer.prodetalle.length==0 && (plm.ped_pro.sel>0 || numofe>0)  ){
			seterrorpm("Debes dar de alta los productos/artículos que componen esta oferta.");
			return;
		}
		for (var i=0,lon=plantillaOfer.prodetalle.length;i<lon;i++){
			var ob=plantillaOfer.prodetalle[i].ob;
			if (! (cus=returnCustom(ob))) return;
			if (!cus.nid){
				cus.nid=i;
				cus.oper="ins";
			}else cus.oper="mod";
			switch(ob.tipopro){
				case 0:
						var ing,obma,obta,obart;
						if (! (ing=returnconIngres(ob)) || !(obma=ob.masas.comprobar("Masa/s")) || !(obta=ob.tamas.comprobar("Tamaño/s")) || !(obart=ob.pizzas.comprobar("Pizza/s")))
							return;
						/*var obma=0;
						var obta=0;
						var obart=0;
						ob.masas.selma.outerror();ob.pizzas.selpi.outerror();ob.tamas.selta.outerror();
						if (ob.masas.todas.sel==1 && (obma=ob.masas.selma.get()).length==0){
							ob.masas.selma.seterror("Debes de seleccionar alguna masa o todas.");
							return;
						}

						if (ob.pizzas.todas.sel==1 && (obart=ob.pizzas.selpi.get()).length==0){
							ob.pizzas.selpi.seterror("Debes de seleccionar alguna pizza o todas.");
							return;
						}
						if (ob.tamas.todas.sel==1 && (obta=ob.tamas.selta.get()).length==0){
							ob.tamas.selta.seterror("Debes de seleccionar algun tamaño o todos.");
							return;
						}*/
						pjson.push({
							nid:cus.nid,
							oper:cus.oper,
							tp:0,
							ingres:ing,
							custom:cus.obj,
							masas:obma.v,
							tamas:obta.v,
							artis:obart.v
						});


						break;
				case 1:
						var obart=ob.arti.comprobar("Producto/s");
						if (!obart) return; 
						/*ob.arti.selart.outerror();
						if (ob.arti.todas.sel==1 && (obart=ob.arti.selart.get()).length==0){
							ob.arti.selart.seterror("Debes de seleccionar algún producto o todos.");
							return;
						}*/
						pjson.push({
							nid:cus.nid,
							oper:cus.oper,
							tp:1,
							idp:ob.idp,
							custom:cus.obj,
							artis:obart.v
						});
						break;

				case 2:
						var ing,obart;
						if (! (ing=returnconIngres(ob)) || !(obart=ob.arti.comprobar("Producto/s")) )
							return;
						/*obart=0;
						ob.arti.selart.outerror();
						if (ob.arti.todas.sel==1 && (obart=ob.arti.selart.get()).length==0){
							ob.arti.selart.seterror("Debes de seleccionar algún producto o todos.");
							return;
						}*/
						pjson.push({
							nid:cus.nid,
							oper:cus.oper,
							tp:2,
							idp:ob.idp,
							ingres:ing,
							custom:cus.obj,
							artis:obart.v //(ob.arti.todas.sel==1 ? ob.arti.selart.get() : 0)
						});
						
						if (ob.tamas){
							var obta=ob.tamas.comprobar("Tamaño/s");
							if (obta) pjson[i].tamas=obta.v;
							else return;
							/*var obta=0;
							ob.tamas.selta.outerror();
							if (ob.tamas.todas.sel==1 && (obta=ob.tamas.selta.get()).length==0){
								ob.tamas.selta.seterror("Debes de seleccionar algun tamaño o todos.");
								return;
							}*/
							
						}

			}
		} 
		console.log("pjson=",pjson);
		if ( plantillaOfer.modificar){
			var pr=plantillaOfer.tramod.oferta.productos;
			var lon2=pjson.length,encon=false;
			for (var i=0,lon=pr.length;i<lon;i++){
				encon=false;
				for (var n=0;n<lon2;n++)
					if (pjson[n].nid==pr[i].nid) {
						encon=true;break;
					}
				if (!encon)
					pjson.push({ nid:pr[i].nid, oper:"del"});
			}
			var dajson={ope:"mod",datos:{nombre:nom,descrip:desc,feho:fe,dias:diasv,loodo:plm.locodomi.sel,ofen:plm.ped_pro.sel,numofe:numofe,prefijo:pref[1],dese:desE.v,desp:desE.s,ince:inc[1],grupo:gru,id:ClsTabla(plantillaOfer.tramod),produc:pjson }};
		}else {
			var dajson={ope:"ins",datos:{nombre:nom,descrip:desc,feho:fe,dias:diasv,loodo:plm.locodomi.sel,ofen:plm.ped_pro.sel,numofe:numofe,prefijo:pref[1],dese:desE.v,desp:desE.s,ince:inc[1],grupo:gru,produc:pjson }};
		}
		
		console.log("datos=",dajson);
		//return;
		plantillaOfer.venMod.aceptar.disabled=true;
		//console.log("datossssssss=",window.JSON.stringify(dajson));
		hUtils.xJson({url:plantillaOfer.url,datos:window.JSON.stringify(dajson),formu:true}).then(function(res){
			controladorPrincipal.haycambios++;
			console.log("recibo respuesta en comprobar ======",res);
			var diax=[];
			if (diasv===0)
				diax.push("Todos");
			else
				for (var i=0,lo=diasv.length;i<lo;i++)
					diax.push(adias[diasv[i]-1]);
			var ver=[];
			var pjsonver=[]
			for (var i=0,lon=res.key.length;i<lon;i++)
				for (var n=0;n<lon;n++ )
					if (!ver[n] && pjson[n].nid==res.key[i][1]){
						ver[n]=true;
						if (pjson[n].oper!="del"){
							pjson[n].nid=res.key[i][0];
							pjsonver.push(pjson[n])
						}
						break;
					}
			var alm={
				oferta:{
					ofertaen:numofe,
					prefijo:pref[1],
					descuento:desE.v,
					descueneuopor:desE.s,
					incremento:inc[1],
					productos:pjsonver
				}
			};
			if (plantillaOfer.modificar){
				var tr=plantillaOfer.tramod;
				var ada=[0,nom,desc,[fe.fed[2]+"/"+fe.fed[1]+"/"+fe.fed[0],fe.feh[2]+"/"+fe.feh[1]+"/"+fe.feh[0]],[fe.hed[0]+":"+fe.hed[1],fe.heh[0]+":"+fe.heh[1]],diax,plm.locodomi.sel===0 ? "Local" : "Local y Domicilio", plm.ped_pro.sel===0 ? "Pedido" : "Productos",plantillaOfer.prodetalle.length,gru,plantillaOfer.tabla.getModeloCelNom(tr,"IMAGEN")];
				var nomant= plantillaOfer.tabla.getModeloCelNom(tr,"NOMBRE"); // modelo[0].get(tr.cells[1]);
				if (nomant!=nom){
					plantillaOfer.tabla.modLineaOrden(tr,ada,plantillaOfer.corderIns,alm);
					FileimgApi.planImagenes.cambiar_bloq_img("ofer",ClsTabla.did(tr),null,nom);
				}else 
					plantillaOfer.tabla.modLinea(tr,ada,plantillaOfer.corderIns,alm);
				plantillaOfer.tramod=null;
				
			}else {
				//plantillaOfer.okinsertar(res);
				//modelo:[[Clink,"Nombre"],[Ctexto,"Descripción"],[Clista,"Fec.Válido"],[Clista,"Hora.Válido"],[Clista,"Días.Valido"],[Ctexto, "Válida para"],[Ctexto,"Oferta en"],[Cboton,"Imágen"]],feh:feh,fed:fed,hed:hed,heh:heh
				
				alm.keyControler=res.ok[1];
				plantillaOfer.tabla.insOrden([res.ok[0],nom,desc,[fe.fed[2]+"/"+fe.fed[1]+"/"+fe.fed[0],fe.feh[2]+"/"+fe.feh[1]+"/"+fe.feh[0]],[fe.hed[0]+":"+fe.hed[1],fe.heh[0]+":"+fe.heh[1]],diax,plm.locodomi.sel===0 ? "Local" : "Local y Domicilio", plm.ped_pro.sel===0 ? "Pedido" : "Productos",plantillaOfer.prodetalle.length,gru,"Añadir"],plantillaOfer.corderIns,alm);
				//tr.keyControler=res.ok[1]; //key;
				
				
			}
			
			//cbok(res,_thisyo2.plantilla);
			plantillaOfer.venMod.cerrar();
			plantillaOfer.venMod.aceptar.disabled=false;
			//_thisyo2.venMod.aceptar.disabled=false;
			//_thisyo2.plantilla.tmp=null;
			eliminarPlamods();
		}).fail(function(er){
			console.log("recibimos error respuesta dat="+er);
			plantillaOfer.venMod.aceptar.disabled=false;
			//_thisyo2.plantilla.tmp=null;
			//_thisyo2.eliminarPlamods();
		});
					


	},
	postelim:function(okel,lids){
		if (okel){
			for (var i=0;i<lids.length;i++)
				FileimgApi.planImagenes.eliminar_bloq_img("ofer",lids[i]);
		}
	},
	numRegistros:function(){
		return plantillaOfer.tabla.tbody.rows.length;
	},
	dameImagenes:function(){
		var trp=plantillaOfer.tabla.tbody.rows;
		var lo=trp.length;
		var hpi=[];
		for (var i=0;i<lo;i++){
			var alm=plantillaOfer.tabla.getalmacen(trp[i]);
			if (alm && alm.ImgUrl)
				hpi.push([plantillaOfer.tabla.getModeloCelNom(trp[i] ,"NOMBRE"),ClsTabla.did(trp[i]),alm.ImgUrl,plantillaOfer.tabla.getModeloCelNom(trp[i],"IMAGEN")]);
		}
		return hpi;
	},
	cambiar_Imagen:function(nid){
		var tr=plantillaOfer.tabla.getdidtr(nid);
		console.log("cambiar_Imagen en ofertas");
		if (FileimgApi.planImagenes.modo_sel){
			return {nomimaorigen:plantillaOfer.tabla.getModeloCelNom(tr.tr,"IMAGEN"),keyControler:tr.almacen.keyControler,nomarti:"(Oferta) "+plantillaOfer.tabla.getModeloCelNom(tr.tr,"NOMBRE")};
		}
		console.log("sigo en cambiar_Imagen en ofertas");
		cambiarImagen(tr.tr,tr.almacen,plantillaOfer.tabla.getModeloCelNom(tr.tr,"NOMBRE"),plantillaOfer.tabla.getModeloCelNom(tr.tr,"IMAGEN"),nid);
		/*cambiarImagen(tr.almacen,plantillaOfer.tabla.getModeloCelNom(tr.tr,"NOMBRE"),50,plantillaOfer.tabla.getModeloCelNom(tr.tr,"IMAGEN"),function(acc,obj){ 
					if (acc=="nueva"){
						plantillaOfer.tabla.setModeloCelNom(tr.tr,"IMAGEN",obj.nombre);
						plantillaOfer.tabla.setalmacen(tr.tr,{ImgUrl:obj.url});
						FileimgApi.planImagenes.add_bloq_img("ofer",obj.nombre,obj.url,plantillaOfer.tabla.getModeloCelNom(tr.tr,"NOMBRE"),null,nid);
						//td.parentNode.ImgUrl=obj.url;
					}else{
						plantillaOfer.tabla.setModeloCelNom(tr.tr,"IMAGEN","Añadir");
						plantillaOfer.tabla.setalmacen(tr.tr,{ImgUrl:null});
						FileimgApi.planImagenes.eliminar_bloq_img("ofer",nid);
						//td.parentNode.ImgUrl=null;
					}
				 });*/
	}
}

function nuconCero(ca,e){
	try {
		var v=ca.comprobar();
		if (! v )
			v= (e ? parseInt(v): parseFloat(v) );
		if (isNaN(v)) return false;
	} catch(e){
		return false;
	}
	return [true,(e ? parseInt(v): parseFloat(v))];
}
return plantillaOfer;

})();