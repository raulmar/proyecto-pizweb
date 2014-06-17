'use strict';
var controladorOtros=(function(){
var Clink=ClsTabla.campo.Clink, Ctexto=ClsTabla.campo.Ctexto,Clista=ClsTabla.campo.Clista,Cboton=ClsTabla.campo.Cboton,Cnumero=ClsTabla.campo.Cnumero;
	

var plantillaOtros= {
	modelo:[[Clink,"NOMBRE", "Nombre",true],[Ctexto,"URL", "Url",true], [Ctexto,"DESCRIP", "Descripción",true],[Cboton,"LISTAR", "Listar"]],
	tit1:"Categorías Simples",
	tit2:"Categoria",
	tramod:null,
	conclase:"conclase-modpiz",
	url:"/admintienda/Otros/otro",
	controles:{},
	nuevoplamod:function (aux,npla){
		var objpla={
			nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
			descrip:new ClabInput({la:"Descripción",lon:200,padre:aux,area:true}),
			nele:npla
		}
		return [objpla,objpla.nombre.datos.ent];
	},
	clickCelda:function(td){
		if (td.nom=="LISTAR"){ // cellIndex==3){
			this.controles[ClsTabla.did(td.td.parentNode)].control.ventabla.show();
		}
	},
	okmodificar:function(dat){
		console.log("recibimos ok respuesta dat=",dat);
		var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido modificar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,this.tmp.tns.length);
			}
			this.tmp.corder["LISTAR"]=miotro.tabla.nomcolum["LISTAR"];
			for (var k=0;k<cda;k++){
				var nomant= miotro.tabla.getModeloCelNom(plantillaOtros.tramod[k] ,"NOMBRE");//  modelo[0].get(plantillaOtros.tramod[k].cells[1]);
				
				this.tmp.tns[k][miotro.tabla.nomcolum["LISTAR"]]="Listar";
				this.tmp.tns[k][this.tmp.corder["URL"]]=dat.ok[k][1];
				if (nomant!=this.tmp.tns[k][this.tmp.corder["NOMBRE"]]){
					miotro.tabla.modLineaOrden(plantillaOtros.tramod[k],this.tmp.tns[k],this.tmp.corder);
					plantillaOtros.controles[ClsTabla.did(plantillaOtros.tramod[k])].cambiartit(this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
					//plantillaOtrosTama.corregirmata("m",plantillaOtros.tramod.did,n[1]);
				}else
					miotro.tabla.modLinea(plantillaOtros.tramod[k],this.tmp.tns[k],this.tmp.corder);
			}
			plantillaOtros.tramod=null;
	},
	okinsertar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
		var cda=dat.ok.length;
		if (dat.key==0){
			ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
			//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
			this.tmp.tns.splice(cda-1,tns.length);
		}				
		this.tmp.corder["LISTAR"]=miotro.tabla.nomcolum["LISTAR"];
		for (var k=0;k<cda;k++){
			this.tmp.tns[k][0]=dat.ok[k][0];
			this.tmp.tns[k][miotro.tabla.nomcolum["LISTAR"]]="Listar";
			this.tmp.tns[k][miotro.tabla.nomcolum["URL"]]=dat.ok[k][1];
			var con=new plantillaOtrosHijos({
				padre:dat.ok[k][0],
				tit:this.tmp.tns[k][this.tmp.corder["NOMBRE"]]
			});
			plantillaOtros.controles[dat.ok[k][0]]=con;
			FileimgApi.planImagenes.add_secc("otr",dat.ok[k][0],this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
			con.control.ventabla.show();
		}
		if (cda==1)
			miotro.tabla.insOrden(this.tmp.tns[0],this.tmp.corder);
		else if (cda>1){
			var trs=miotro.tabla.insMulti(this.tmp.tns,this.tmp.corder);
			miotro.tabla.ordenar();
		}
	},
	comprobar:function (){
		var miobj=[],tns=[];
		for (var i=0;i<miotro.plaMod.length;i++){
			var n=[0,miotro.plaMod[i].nombre.comprobar()];
			if (!n[1] || !(n[2]=miotro.plaMod[i].descrip.comprobar()))
				return;
			if (miotro.tabla.existe(plantillaOtros.tramod ? plantillaOtros.tramod[i]: null,n[1])){
				miotro.seterror("Error:Categoría"+n[1]+" ya existe");
				//alert("Masa "+n[1]+", ya existe");
				return;
			}
			if (miotro.modificar)
				miobj.push({nombre:n[1],descrip:n[2],id:ClsTabla.did(this.tramod[i])});
			else
				miobj.push({nombre:n[1],descrip:n[2]});
			tns.push(n);
		}
		this.tmp={tns:tns,corder:{"NOMBRE":1,"DESCRIP":2,"URL":3}};
		miotro.enviar( miotro.modificar ? {ope:"mod",datos:miobj} : {ope:"ins",datos:miobj} );
	},
	modificar:function(trs){
		plantillaOtros.tramod=trs;
		for (var i=0,lon=trs.length;i<lon;i++){
			if (i>0){
				miotro.nuevaPlantMod();
			}
			var dat=miotro.tabla.getLinea(trs[i],["NOMBRE","DESCRIP"]).li;
			miotro.plaMod[i].nombre.set(dat[0]);
			miotro.plaMod[i].descrip.set(dat[1]);
		}
	},
	limpiar:function() {
		miotro.plaMod[0].nombre.set("");
		miotro.plaMod[0].descrip.set("");
		return true;
	},
	preelim:function(objs) {
		var noms=[],hay=false,con,lid=objs.datos;
		for (var i=0,lon=lid.length;i<lon;i++){
			con=this.controles[lid[i]];
			if (con.control.tabla.tbody.rows.length>0){
				hay=true;
			}
			noms.push(con.tit1);

		}
		if (hay)
			return confirm("Se eliminaran también los elementos de: "+noms.join(",")+"\n¿Seguro que deseas eliminar?");
		return true;
	},
	postelim:function(ok,lid){
		if (ok)
			for (var i=0,lon=lid.length;i<lon;i++){
				this.controles[lid[i]].eliminar();
				delete this.controles[lid[i]];
			}
	}
}
var miotro=new Controlador(plantillaOtros);

var urlHijos='/admintienda/Otros/unotro';
//var objImagen=null;
function cambiarImagen(tr,propalmacen,tit,nomima,econtrol,niduo,nido){ 
//cambiarImagen(tr,tit,lim,nomima,cb){//(td.parentNode,this.tit1,50,this.control.tabla.getmodelcell(td.parentNode,5)
	FileimgApi.imagen(null,propalmacen,tit,50,nomima,function(acc,obj){ 
					if (acc=="nueva"){
						econtrol.setModeloCelNom(tr,"IMAGEN",obj.nombre);
						econtrol.setalmacen(tr,{ImgUrl:obj.url});
						FileimgApi.planImagenes.add_bloq_img("otr",obj.nombre,obj.url,econtrol.getModeloCelNom(tr,"NOMBRE"),niduo,nido );
						//td.parentNode.ImgUrl=obj.url;
					}else{
						econtrol.setModeloCelNom(tr,"IMAGEN","Añadir");
						econtrol.setalmacen(tr,{ImgUrl:null});
						FileimgApi.planImagenes.eliminar_bloq_img("otr",niduo,nido);
						//td.parentNode.ImgUrl=null;
					}
				 });
}

var modeloHijos=[[Clink,"NOMBRE", "Nombre",true],[Ctexto,"DESCRIP", "Descripción",true],[Cnumero,"PRECIO", "Precio",true],[Ctexto,"GRUPO", "Grupo",true],[Cboton,"IMAGEN", "Imágen",true]];
function plantillaOtrosHijos(op){
	this.modelo=modeloHijos;
	this.url=urlHijos;
	this.tit1=op.tit;
	this.tit2=op.tit;
	this.tramod=null;
	this.conclase="conclase-modpiz";
	this.padre=op.padre;
	this.control=new Controlador(this);
	this.listagrupo=["0"];
	this.control.init(divotroshijos,ClsVentanasTipo.entera,true);
	
	//this.control.init(divotroshijos);//(this.ventanaPadre.dentro,ClsVentanasTipo.aceptar,true);
}
plantillaOtrosHijos.prototype.cambiartit=function (tit){
	this.tit1=this.tit2=tit;
	this.control.ventabla.tit.innerHTML=tit;
	this.control.ventabla.aceptar.innerHTML="Añadir "+tit;
	FileimgApi.planImagenes.cambiar_secc("otr",this.padre,tit);
} 
plantillaOtrosHijos.prototype.eliminar=function() {
	this.control.eliminar();
	FileimgApi.planImagenes.elim_secc("otr",this.padre);
	this.control=this.modelo=this.tit1=this.tit2=this.tramod=this.conclase=this.padre=null;
}
plantillaOtrosHijos.prototype.nuevoplamod=function (aux,npla) {
	var objpla={
		nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
		descrip:new ClabInput({la:"Descripción",lon:200,padre:aux,area:true}),
		precio:new ClabInput({la:"Precio",lon:5,padre:aux},hUtils.validarFloat),
		nele:npla,
		grupo:new ClabInpSel({la:"Grupo",lon:30,padre:aux,control:this.control,planti:this}) //new ClabInput({la:"Grupo",lon:80,padre:aux})
	}
	objpla.grupo.set("0");
	//objpla.grupo.pintarlista(this);
	return [objpla,objpla.nombre.datos.ent];
}
plantillaOtrosHijos.prototype.modificar=function(trs){
	this.tramod=trs;
	var corder=["NOMBRE","DESCRIP","PRECIO","GRUPO"];
	ClabInpSel.prototype.hacerlistagrupo(this.control.tabla.tbody.rows,this,this.control.tabla.nomcolum["GRUPO"]);
	for (var i=0,lon=trs.length;i<lon;i++){
			if (i>0){
				this.control.nuevaPlantMod();
			}else
				this.control.plaMod[0].grupo.pintarlista();
		var dat=this.control.tabla.getLinea(trs[i],corder).li;
		this.control.plaMod[i].nombre.set(dat[0]);
		this.control.plaMod[i].descrip.set(dat[1]);
		this.control.plaMod[i].precio.set(dat[2]);
		this.control.plaMod[i].grupo.set(dat[3]);
		
	}
}
plantillaOtrosHijos.prototype.limpiar=function() {
	this.control.plaMod[0].nombre.set("");
	this.control.plaMod[0].descrip.set("");
	this.control.plaMod[0].precio.set("");
	this.control.plaMod[0].grupo.set("0");
	ClabInpSel.prototype.hacerlistagrupo(this.control.tabla.tbody.rows,this,this.control.tabla.nomcolum["GRUPO"]);
	this.control.plaMod[0].grupo.pintarlista();
	return true;
}
plantillaOtrosHijos.prototype.preelim=function(objs) {
	objs.padre=this.padre;
	return true;
}
plantillaOtrosHijos.prototype.okmodificar=function(dat){
	console.log("recibimos ok respuesta dat=",dat);
	var cda=dat.ok.length;
	if (dat.key==0){
		ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
		//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
		this.tmp.tns.splice(cda-1,this.tmp.tns.length);
	}
	for (var k=0;k<cda;k++) {
		var nomant=this.control.tabla.getModeloCelNom(this.tramod[k] ,"NOMBRE"); // modelo[0].get(this.tramod[k].cells[1]);
		this.tmp.tns[k][this.tmp.corder["IMAGEN"]]=this.control.tabla.getModeloCelNom(this.tramod[k] ,"IMAGEN");// Cboton.get(this.tramod[k].cells[5]);
		
		if (nomant!=this.tmp.tns[k][this.tmp.corder["NOMBRE"]]){
			this.control.tabla.modLineaOrden(this.tramod[k],this.tmp.tns[k],this.tmp.corder);
			FileimgApi.planImagenes.cambiar_bloq_img("otr",ClsTabla.did(this.tramod[k]),this.padre,this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
		}else
			this.control.tabla.modLinea(this.tramod[k],this.tmp.tns[k],this.tmp.corder);
	}
	this.tramod=null;
}
plantillaOtrosHijos.prototype.okinsertar=function(dat){
	console.log("recibimos ok respuesta dat=",dat);
			
	var cda=dat.ok.length;
	if (dat.key==0){
		ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
		//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
		this.tmp.tns.splice(cda-1,this.tmp.tns.length);
	}
	if (cda==0) return;
	for (var k=0;k<cda;k++)
		this.tmp.tns[k][0]=dat.ok[k][0];
	this.control.tabla.insMulti(this.tmp.tns,this.tmp.corder,{keyControler:dat.ok[k][1] });
	
	/*for (var k=0;k<cda;k++){
		trs[k].keyControler=dat.ok[k][1];
	}*/
	this.control.tabla.ordenar();
}
plantillaOtrosHijos.prototype.comprobar=function (){
	var miobj=[],tns=[],missal=[],mising=[],idings;

	for (var i=0;i<this.control.plaMod.length;i++){
		var n=[0,this.control.plaMod[i].nombre.comprobar()];
		if (!n[1] || !(n[2]=this.control.plaMod[i].descrip.comprobar()) || !(n[3]=this.control.plaMod[i].precio.comprobar()) || !(n[4]=this.control.plaMod[i].grupo.comprobar()))
			return;
		if (this.control.tabla.existe(this.tramod ? this.tramod[i] :  null,n[1])){
			this.control.seterror("Error:"+ this.tit1+" "+n[1]+" ya existe");
			//alert("Masa "+n[1]+", ya existe");
			return;
		}
		n[5]=(this.control.modificar ? Cboton.get(this.tramod[i].cells[5]) : "Añadir");
		if (this.control.modificar)
			miobj.push({nombre:n[1],descrip:n[2],precio:n[3],grupo:n[4],id:this.tramod[i].did } );
		else
			miobj.push({nombre:n[1],descrip:n[2],precio:n[3],grupo:n[4] } );
		tns.push(n);

	}
	console.log("miobj=",miobj);
	//return;
	this.tmp={tns:tns,corder:{"NOMBRE":1,"DESCRIP":2,"PRECIO":3,"GRUPO":4,"IMAGEN":5 }};
	this.control.enviar(this.control.modificar ? {ope:"mod",datos:miobj,padre:this.padre} : {ope:"ins",datos:miobj,padre:this.padre});
}
plantillaOtrosHijos.prototype.clickCelda=function(td){
	if (td.nom=="IMAGEN") { // cellIndex==5){
		//var tcta=this.control.tabla;
		cambiarImagen(td.td.parentNode,this.control.tabla.getalmacen(td.td.parentNode),"("+this.tit1+") "+ this.control.tabla.getModeloCelNom(td.td.parentNode,"NOMBRE"),this.control.tabla.getModeloCelNom(td.td.parentNode,"IMAGEN"),this.control,ClsTabla.did(td.td.parentNode),this.padre);

		/*cambiarImagen(tcta.getalmacen(td.td.parentNode),tcta.getModeloCelNom(td.td.parentNode,"NOMBRE"),50,tcta.getModeloCelNom(td.td.parentNode,"IMAGEN"),function(acc,obj){ 
				if (acc=="nueva"){
					Cboton.set(td.td,obj.nombre);
					tcta.setalmacen(td.td.parentNode,{ImgUrl:obj.url});
					FileimgApi.planImagenes.add_bloq_img("otr",obj.nombre,obj.url,tcta.getModeloCelNom(td.td.parentNode,"NOMBRE"),ClsTabla.did(td.td.parentNode),_this.padre );
					//td.parentNode.ImgUrl=obj.url;
				}else{
					Cboton.set(td.td,"Añadir");
					tcta.setalmacen(td.td.parentNode,{ImgUrl:null});
					FileimgApi.planImagenes.eliminar_bloq_img("otr",ClsTabla.did(td.td.parentNode),_this.padre);
					//td.parentNode.ImgUrl=null;
				}
			 });*/
	}

}
plantillaOtrosHijos.prototype.postelim=function(okel,lids){
	if (okel){
		for (var i=0;i<lids.length;i++)
			FileimgApi.planImagenes.eliminar_bloq_img("otr",this.padre,lids[i]);
	}
}
var divotros=document.createElement("div");
var divotroshijos=document.createElement("div");
divotros.className="wrapper"; divotroshijos.className="wrapper";
function inicio(dpa,dat) {
	
	//document.body.appendChild(divotros);
	//document.body.appendChild(divotroshijos);
	var divsimples=document.createElement("div");
	divsimples.className="marco-hijo";
	dpa.appendChild(divsimples);
	divsimples.appendChild(divotros);
	divsimples.appendChild(divotroshijos);
	miotro.init(divotros,ClsVentanasTipo.titaceptar,true);
	miotro.ventabla.pie.appendChild(hUtils.crearElemento({e:"button", inner:"Actualizar",a:{className:"btn btn-left",title:"Recargar Productos Simples",onclick:actualizarTablas  }},null));
	renderizarTablas(dat);
	return divsimples;
}
function actualizarTablas(){
	hUtils.xJson({url:"/admintienda/Otros/verTodas",accion:"GET",formu:false}).then(function(dat){
		console.log("recibimos ok respuesta en actualizar otros dat=",dat);
		var notr=miotro.tabla.tbody.rows; 
		for (var i=0,lon=notr.length;i<lon;i++){
			plantillaOtros.controles[notr[i].did].eliminar();
		}
		plantillaOtros.controles={};
		miotro.tabla.vaciartabla();
		renderizarTablas(dat);
	}).fail(function(dat){
		console.log("recibimos error en actualizar otros respuesta dat="+dat);
	});
}
function renderizarTablas(dat){
	//console.log("recibimos ok respuesta dat=",dat);
	var lotr=dat.otros.length;
	if (lotr>0){
		miotro.tabla.render(dat.otros,{"NOMBRE":1,"DESCRIP":2,"LISTAR":3,"URL":4});
		
		var tr;
		for(var i=0;i<lotr;i++){
			var oi=dat.otros[i][0];
			var con=new plantillaOtrosHijos({
					padre:oi,
					tit:dat.otros[i][1]
				});
			plantillaOtros.controles[oi]=con;
			var duo=dat.unotros[oi];
			if (duo && duo.length>0)
				for (var n=0,lun=duo.length;n<lun;n++){
					con.control.tabla.nueLinea([duo[n][0],duo[n][1],duo[n][2],duo[n][3],duo[n][4],duo[n][5][0] || "Añadir"],{"NOMBRE":1,"DESCRIP":2,"PRECIO":3,"GRUPO":4,"IMAGEN":5},{keyControler:duo[n][6],ImgUrl:duo[n][5][1] });
					//tr.keyControler=duo[n][6];
					//tr.ImgUrl=duo[n][5][1];
				}
			con.control.ventabla.show();
		}
		
	}
	miotro.ventabla.show();
}
function producHijos() {
		var hi=[];
		var hr=miotro.tabla.tbody.rows;
		var lo=hr.length;
		for (var h=0;h<lo;h++)
			hi.push([miotro.tabla.getModeloCelNom(hr[h] ,"NOMBRE"),"1-"+ClsTabla.did(hr[h])]);
		return hi;
}
function unproducHijo(nid) {
		var hi=[];
		var ehi=plantillaOtros.controles[nid];
		var hr=ehi.control.tabla.tbody.rows;
		var lo=hr.length;
		for (var h=0;h<lo;h++)
			hi.push([ehi.control.tabla.getModeloCelNom(hr[h] ,"NOMBRE"),ClsTabla.did(hr[h])]);
		return hi;
}
function numRegistros() {
	return miotro.tabla.tbody.rows.length;
}
function dameImagenes(){
	var hi=[],uhi,ehi,ulo,uhr,nid;
	var hr=miotro.tabla.tbody.rows;
	var lo=hr.length;
	for (var h=0;h<lo;h++){
		nid=ClsTabla.did(hr[h]);
		
		uhi=[];
		ehi=plantillaOtros.controles[nid];
		uhr=ehi.control.tabla.tbody.rows;
		ulo=hr.length;
		for (var uh=0;uh<ulo;uh++){
			var alm=ehi.control.tabla.getalmacen(uhr[uh]);
			if (alm && alm.ImgUrl)
				uhi.push([ehi.control.tabla.getModeloCelNom(uhr[uh],"NOMBRE") ,ClsTabla.did(uhr[uh]),alm.ImgUrl,ehi.control.tabla.getModeloCelNom(uhr[uh],"IMAGEN")]);
		}
		hi.push({ secc: [miotro.tabla.getModeloCelNom(hr[h],"NOMBRE"),nid], datsec:uhi });
		
	}
	return hi;
}
function cambiar_Imagen(niduo,nido){
	var econtrol1=plantillaOtros.controles[nido];
	if (econtrol1){
		var econtrol=econtrol1.control.tabla;
		var tr=econtrol.getdidtr(niduo);
		if (FileimgApi.planImagenes.modo_sel){
			return {nomimaorigen:econtrol.getModeloCelNom(tr.tr,"IMAGEN"),keyControler:tr.almacen.keyControler,nomarti:"("+econtrol1.tit1+") "+econtrol.getModeloCelNom(tr.tr,"NOMBRE")};
		}
		cambiarImagen(tr.tr,tr.almacen,"("+econtrol1.tit1+") "+econtrol.getModeloCelNom(tr.tr,"NOMBRE"),econtrol.getModeloCelNom(tr.tr,"IMAGEN"),econtrol,niduo,nido);

		/*cambiarImagen(tr.almacen,econtrol.getModeloCelNom(tr.tr,"NOMBRE"),50,econtrol.getModeloCelNom(tr.tr,"IMAGEN"),function(acc,obj){ 
					if (acc=="nueva"){
						econtrol.setModeloCelNom(tr.tr,"IMAGEN",obj.nombre);
						econtrol.setalmacen(tr.tr,{ImgUrl:obj.url});
						FileimgApi.planImagenes.add_bloq_img("otr",obj.nombre,obj.url,econtrol.getModeloCelNom(tr.tr,"NOMBRE"),niduo,nido );
						//td.parentNode.ImgUrl=obj.url;
					}else{
						econtrol.setModeloCelNom(tr.tr,"IMAGEN","Añadir");
						econtrol.setalmacen(tr.tr,{ImgUrl:null});
						FileimgApi.planImagenes.eliminar_bloq_img("otr",niduo,nido);
						//td.parentNode.ImgUrl=null;
					}
				 });*/
	}
}
function nombreOtro(nid){
	var hr=miotro.tabla.tbody.rows,lo=hr.length;
	for (var h=0;h<lo;h++)// Clink.get(hr[h].cells[1])
		if (ClsTabla.did(hr[h])==nid) return miotro.tabla.getModeloCelNom(hr[h],"NOMBRE");
	return "Desconodido";
}
return {inicio:inicio,producHijos:producHijos,datosOtro:unproducHijo,numRegistros:numRegistros,actualizar:actualizarTablas,dameImagenes:dameImagenes,cambiar_Imagen:cambiar_Imagen, nombreOtro:nombreOtro};
})();