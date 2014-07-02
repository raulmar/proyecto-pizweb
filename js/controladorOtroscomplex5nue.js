'use strict';
var controladorOtroscomplex=(function(){
	var Clink=ClsTabla.campo.Clink, Ctexto=ClsTabla.campo.Ctexto,Clista=ClsTabla.campo.Clista,Cboton=ClsTabla.campo.Cboton,Cnumero=ClsTabla.campo.Cnumero;
var plantillaOtros= {
	modelo:[[Clink,"NOMBRE","Nombre",true],[Ctexto,"URL","Url",true], [Ctexto,"DESCRIP", "Descripción",true],[Ctexto,"INGU","Ing.Unico",true],[Clista,"TAMAS", "Tamaños"],[Cboton,"LISTAR", "Listar"]],
	//modelo:[[Clink,"Nombre",true],[Ctexto,"Descripción",true],[Ctexto,"Ing.Unico",true],[Clista,"Tamaños"],[Cboton,"Listar"]],
	tit1:"Categorías con Ingredientes",
	tit2:"Categoria",
	tramod:null,
	conclase:"conclase-modpiz",
	url:"/admintienda/Otrosx/otrox",
	controles:{},
	nuevoplamod:function (aux,npla) {
		var objpla={
			nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
			descrip:new ClabInput({la:"Descripción",lon:200,padre:aux,area:true}),
			nele:npla
		}
		var aux2=document.createElement("div");
		aux2.className="secundario";
		var aux3=document.createElement("div");
		objpla.tamapreba=new ClabInput({la:"Precio base",lon:5,padre:aux3},hUtils.validarFloat);
		objpla.tamapreing=new ClabInput({la:"Precio ingrediente",lon:5,padre:aux3},hUtils.validarFloat);
		objpla.tama=new CRadio({opciones:["Tamaño Unico","Varios Tamaños"],selec:0,padre:aux2,callback:this.seltamas,dat:aux3});
		aux.appendChild(aux2);
		aux2=document.createElement("div");
		aux2.className="secundario";

		objpla.salsa=new CRadio({opciones:["Con Ing.Unico","Sin Unico"],selec:0,padre:aux2,callback:this.selnomsalsa,dat:objpla});
		objpla.nomsalsa=new ClabInput({la:"Nombre de Unico",lon:80,padre:aux2});
		aux.appendChild(aux2);
		aux.appendChild(aux3);

		return [objpla,objpla.nombre.datos.ent];
	},
	selnomsalsa:function(nele,ele){
		if (nele==0)
			ele.dat.nomsalsa.datos.ent.parentNode.style.display="block";
		else
			ele.dat.nomsalsa.datos.ent.parentNode.style.display="none";
	},
	seltamas:function(nele,ele) {
		console.log("entra nele="+nele);
		if (nele==0)
				ele.dat.style.display="block";
			else
				ele.dat.style.display="none";
	},
	clickCelda:function(td){
		if (td.nom=="LISTAR" ){// (td.cellIndex==5){
			this.controles[ClsTabla.did(td.td.parentNode)].listar();
		}
	},
	okmodificar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
			var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido modificar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,this.tmp.tns.length);
			}
			for (var k=0;k<cda;k++){//corder:{"NOMBRE":1,"DESCRIP":2,"INGU":3,"TAMAS":4, "TAPREBA":5,"TAPREING":6}
				var nomant=miotro.tabla.getModeloCelNom(plantillaOtros.tramod[k],"NOMBRE");// modelo[0].get(plantillaOtros.tramod[k].cells[1]);
				if (this.tmp.tns[k][this.tmp.corder["INGU"]]=="000")
					this.tmp.tns[k][this.tmp.corder["INGU"]]="No";
				if(miotro.plaMod[k].tama.sel==0){
					this.tmp.tns[k][this.tmp.corder["TAMAS"]]=["Unico","precio base:",this.tmp.tns[k][this.tmp.corder["LISTAR"]],"precio ing:",this.tmp.tns[k][this.tmp.corder["URL"]]];
				}else{
					this.tmp.tns[k][this.tmp.corder["TAMAS"]]=["Varios"];
				}
				this.tmp.tns[k][this.tmp.corder["LISTAR"]]="Listar";
				this.tmp.tns[k][this.tmp.corder["URL"]]=dat.ok[k][1];
				
				if (nomant!=this.tmp.tns[k][this.tmp.corder["NOMBRE"]]){
					miotro.tabla.modLineaOrden(plantillaOtros.tramod[k],this.tmp.tns[k],this.tmp.corder);
					plantillaOtros.controles[ClsTabla.did(plantillaOtros.tramod[k])].cambiartit(this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
					//plantillaOtrosTama.corregirmata("m",plantillaOtros.tramod.did,n[1]);
				}else
					miotro.tabla.modLinea(plantillaOtros.tramod[k],this.tmp.tns[k],this.tmp.corder);
				plantillaOtros.controles[ClsTabla.did(plantillaOtros.tramod[k])].saltama(this.tmp.tns[k][this.tmp.corder["INGU"]]!="No",miotro.plaMod[k].tama.sel);
			}
			plantillaOtros.tramod=null;
	},
	okinsertar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
			var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,this.tmp.tns.length);
			}
			for (var k=0;k<cda;k++){//corder:{"NOMBRE":1,"DESCRIP":2,"INGU":3,"TAMAS":4, "TAPREBA":5,"TAPREING":6}
				this.tmp.tns[k][0]=dat.ok[k][0];
				if (this.tmp.tns[k][this.tmp.corder["INGU"]]=="000")
					this.tmp.tns[k][this.tmp.corder["INGU"]]="No";
				if(miotro.plaMod[k].tama.sel==0){
					this.tmp.tns[k][this.tmp.corder["TAMAS"]]=["Unico","precio base:",this.tmp.tns[k][this.tmp.corder["LISTAR"]],"precio ing:",this.tmp.tns[k][this.tmp.corder["URL"]]];
				}else{
					this.tmp.tns[k][this.tmp.corder["TAMAS"]]=["Varios"];
				}
				this.tmp.tns[k][this.tmp.corder["LISTAR"]]="Listar";
				//this.tmp.corder["LISTAR"]=this.tmp.corder["LISTAR"];
				this.tmp.tns[k][this.tmp.corder["URL"]]=dat.ok[k][1];
				//this.tmp.corder["URL"]=this.tmp.corder["TAPREING"];
				var con=new plantillaOtrosHijos({
					padre:dat.ok[k][0],
					tit:this.tmp.tns[k][this.tmp.corder["NOMBRE"]],
					sal:this.tmp.tns[k][this.tmp.corder["INGU"]]!="No",
					tama:miotro.plaMod[k].tama.sel
				});
				plantillaOtros.controles[dat.ok[k][0]]=con;
				FileimgApi.planImagenes.add_secc("otrx",dat.ok[k][0],this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
				con.listar();
			}

			if (cda==1)
				miotro.tabla.insOrden(this.tmp.tns[0],this.tmp.corder);
			else if (cda>1){
				var trs=miotro.tabla.insMulti(this.tmp.tns,this.tmp.corder);
				miotro.tabla.ordenar(1);
			}
	},
	comprobar:function (){
		var miobj=[],tns=[];
		for (var i=0;i<miotro.plaMod.length;i++){
			var n=[0,miotro.plaMod[i].nombre.comprobar()];
			if (!n[1] || !(n[2]=miotro.plaMod[i].descrip.comprobar()))
				return;
			if (miotro.tabla.existe(plantillaOtros.tramod ? plantillaOtros.tramod[i]: null,n[1])){
				miotro.seterror("Error:Categoría "+n[1]+" ya existe");
				//alert("Masa "+n[1]+", ya existe");
				return;
			}
			//n[3]=miotro.plaMod[i].salsa.sel;
			if (miotro.plaMod[i].salsa.sel==0 && !(n[3]=miotro.plaMod[i].nomsalsa.comprobar()))
				return;
			else if (miotro.plaMod[i].salsa.sel==1 )
				n[3]="000";
			if (miotro.plaMod[i].tama.sel==1)
				n.push('v',0,0);
			else{
				n.push('u',miotro.plaMod[i].tamapreba.comprobar());
				if (!n[5] || !(n[6]=miotro.plaMod[i].tamapreing.comprobar() ))
					return;
			}
			if (miotro.modificar)
				miobj.push({nombre:n[1],descrip:n[2],sal:n[3],tama:n[4],tapb:n[5],tapi:n[6],id:ClsTabla.did(this.tramod[i])});
			else
				miobj.push({nombre:n[1],descrip:n[2],sal:n[3],tama:n[4],tapb:n[5],tapi:n[6]});
			tns.push(n);
		}
		this.tmp={tns:tns,corder:{"NOMBRE":1,"DESCRIP":2,"INGU":3,"TAMAS":4,"LISTAR":5,"URL":6}};
		//miotro.enviar( miotro.modificar ? {ope:"mod",datos:miobj,id:plantillaOtros.tramod.did} : {ope:"ins",datos:miobj} );
		miotro.enviar( miotro.modificar ? {ope:"mod",datos:miobj} : {ope:"ins",datos:miobj} );
		
	},
	modificar:function(trs){
		var corder=["NOMBRE","DESCRIP","INGU","TAMAS"];
		for (var i=0,lon=trs.length;i<lon;i++){
			if (i>0){
				miotro.nuevaPlantMod();
				/*var aux=document.createElement("div");
				var npla=this.control.plaMod.length;
				aux.appendChild(hUtils.crearElemento({e:'div',c:{textAlign:"right",marginTop:"1em",paddingTop:"1em",borderTop:"4px dotted gray" },hijos:[{e:"button",inner:"Eliminar",a:{onclick:this.control.eliminarplamodMod.bind(this.control,npla,aux)}}] },null));
				this.plaMod.push(this.nuevoplamod(aux,npla));
				this.control.divplamod.appendChild(aux);*/
			}
			var dat=miotro.tabla.getLinea(trs[i],corder).li;
			miotro.plaMod[i].nombre.set(dat[0]);
			miotro.plaMod[i].descrip.set(dat[1]);
			miotro.plaMod[i].salsa.seleccionar(dat[2] ? 0 : 1);
			if (dat[2]=="No")
				miotro.plaMod[i].salsa.seleccionar(1);
			else{
				miotro.plaMod[i].salsa.seleccionar(0);
				miotro.plaMod[i].nomsalsa.set(dat[2]);
			}
			if (dat[3][0]=="Unico"){
				console.log("dat=",dat[3]);
				miotro.plaMod[i].tama.seleccionar(0);
				miotro.plaMod[i].tamapreba.set(dat[3][1]);
				miotro.plaMod[i].tamapreing.set(dat[3][2]);
				miotro.plaMod[i].tama.dat.style.display="block";
			}else{
				miotro.plaMod[i].tama.seleccionar(1);
				miotro.plaMod[i].tamapreba.set("");
				miotro.plaMod[i].tamapreing.set("");
				miotro.plaMod[i].tama.dat.style.display="none";
			}
			
		}
		plantillaOtros.tramod=trs;
		
	},
	limpiar:function() {
		miotro.plaMod[0].nombre.set("");
		miotro.plaMod[0].descrip.set("");
		miotro.plaMod[0].salsa.seleccionar(0);
		miotro.plaMod[0].tama.seleccionar(0);
		miotro.plaMod[0].tamapreba.set("");
		miotro.plaMod[0].tamapreing.set("");
		miotro.plaMod[0].nomsalsa.set("");
		miotro.plaMod[0].nomsalsa.datos.ent.parentNode.style.display="block";
		miotro.plaMod[0].tama.dat.style.display="block";
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
var urlHijos='/admintienda/Otrosx/unotrox';
//var objImagen=null;
function cambiarImagen(tr,propalmacen,tit,nomima,econtrol,niduo,nido){
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
	//FileimgApi.imagen(null,tr,tit,lim,nomima,cb); //,tr.ImgUrl);
}
/*function cambiarImagen(tr,tit,lim,nomima,cb){
	if (controladorPrincipal.objImagen==null){
			var aux2=document.createElement("div");
			aux2.className="conclase-modpiz";
			
			var fai=FileimgApi.nueva(tr,tit,lim,nomima,cb);
			aux2.appendChild(fai.conte);

			controladorPrincipal.objImagen={
				ventana:new ClsVentanasTipo.popup({
					titulo:"Imágen "+tit,
					contenido:aux2,
					cancelar:true
				}),
				
				linea:fai
			}
	}else {
		controladorPrincipal.objImagen.linea.propietario=tr;
		controladorPrincipal.objImagen.linea.nombre=nomima;
		controladorPrincipal.objImagen.linea.limit=lim;
		controladorPrincipal.objImagen.linea.cb=cb;
		controladorPrincipal.objImagen.linea.tipo=tit;
		controladorPrincipal.objImagen.ventana.tit.innerHTML="Imágen "+tit;
		FileimgApi.datos(controladorPrincipal.objImagen.linea);
	}
	controladorPrincipal.objImagen.ventana.show();
}*/
var modeloHijos=[[Clink,"NOMBRE","Nombre",true],[Ctexto,"DESCRIP","Descripción",true],[Ctexto,"INGU","Ing.Unico",true],[Clista,"INGREDIENTES","ingredientes",true],[Cboton,"IMAGEN","Imágen",true]];
function plantillaOtrosHijos(op){
	this.modelo=modeloHijos;
	this.url=urlHijos;
	this.tit1=op.tit;
	this.tit2=op.tit;
	this.tramod=null;
	this.conclase="conclase-modpiz";
	this.padre=op.padre;

	this.control=new Controlador(this);
	this.ventanaPadre=new ClsVentanasTipo.principal({titulo:op.tit,padre:divotroshijos });
	
	this.control.init(this.ventanaPadre.dentro,ClsVentanasTipo.aceptar,true);
	this.planing=new planIngSal(this.ventanaPadre.dentro,op.tit,false,this);
	if (op.sal){
		this.plansal=new planIngSal(this.ventanaPadre.dentro,op.tit,true,this);
	}else
		this.plansal=null;
	if (op.tama==1){
		this.plantama=new plantillaTama(this.ventanaPadre.dentro,op.tit,this);
	}else
		this.plantama=null;
	
}
plantillaOtrosHijos.prototype.listar=function() {
	this.ventanaPadre.show();
	this.control.ventabla.show();
	this.planing.control.ventabla.show();
	if (this.plansal!=null)
		this.plansal.control.ventabla.show();
	if (this.plantama!=null)
		this.plantama.control.ventabla.show();
}
plantillaOtrosHijos.prototype.cambiartit=function (tit){
	this.tit1=this.tit2=tit;
	this.ventanaPadre.tit.innerHTML=tit;

	//this.control.ventabla.tit.innerHTML=tit;
	this.control.ventabla.aceptar.innerHTML="Añadir "+tit;
	this.planing.tit1=this.planing.control.ventabla.tit.innerHTML="Ingredientes "+tit;
	if (this.plansal!=null)
		this.plansal.tit1=this.plansal.control.ventabla.tit.innerHTML="Ing.Unico "+tit;
	if (this.plantama!=null)
		this.plantama.tit1=this.plantama.control.ventabla.tit.innerHTML="Tamaños "+tit;
	FileimgApi.planImagenes.cambiar_secc("otrx",this.padre,tit);
} 
plantillaOtrosHijos.prototype.eliminar=function() {
	this.control.eliminar();
	this.planing.eliminar();
	if (this.plansal!=null){
		this.plansal.eliminar();
		this.plansal=null;
	}
	if (this.plantama!=null) {
		this.plantama.eliminar();
		this.plantama=null;
	}
	this.ventanaPadre.cerrar();
	FileimgApi.planImagenes.elim_secc("otrx",this.padre);
	this.ventanaPadre=this.planing=this.control=this.modelo=this.tit1=this.tit2=this.tramod=this.conclase=this.padre=null;
}
plantillaOtrosHijos.prototype.saltama=function(s,t){
	if (this.plansal==null){
		if (s){
			this.plansal=new planIngSal(this.ventanaPadre.dentro,this.tit1,true,this);
			//this.plansal=new planIngSal(this.divconte,this.tit1,true,this);

			if (this.control.plaMod)
				this.control.plaMod.salsa.conte.style.display="block";
			this.plansal.control.ventabla.show();
		}
	}else if (!s){
			this.plansal.eliminar();
			this.plansal=null;
			var rm=this.control.tabla.tbody.rows;
			var lm=rm.length;
			for (var i=0;i<lm;i++){
				this.plansal.control.tabla.setalmacen(rm[i],{idsal:"0"});
				//rm[i].idsal="0";
				this.plansal.control.tabla.setModeloCelNom(rm[i],"NOMBRE","No");
				//Clink.set( rm[i].cells[1],"No");
			}
	}
	if (this.plantama==null) {
		 if ( t===1){

			this.plantama=new plantillaTama(this.ventanaPadre.dentro,this.tit1,this);
			this.plantama.control.ventabla.show();
		}
	}else if (t===0){
		this.plantama.eliminar();
		this.plantama=null;
	}
}
plantillaOtrosHijos.prototype.nuevoplamod=function (aux,npla) {
	var objpla={
		nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
		descrip:new ClabInput({la:"Descripción",lon:200,padre:aux,area:true}),
		salsa:new ClabSelect({la:"Ing.Unico",padre:aux}),
		nele:npla,
		ingres:new ClabLista({la:"Ingredientes",padre:aux})
	}
	if (this.plansal==null)
		objpla.salsa.datos.conte.style.display="none";
	return [objpla,objpla.nombre.datos.ent];
}

plantillaOtrosHijos.prototype.rellenar=function(tr,pl){
	
	var rm=this.planing.control.tabla.tbody.rows,nm=rm.length;
	if (nm==0) return 1;
	
		var sele=[];
		for (var i=0;i<nm;i++){//getmodelcell(rm[i],1),
			sele.push([this.planing.control.tabla.getModeloCelNom(rm[i],"NOMBRE"),ClsTabla.did(rm[i])]);
		}
		this.control.plaMod[pl].ingres.seteles(sele);
	
	//console.log("tral=",tral);
	if (tr){
		sele=[];
		var tral=this.control.tabla.getalmacen(tr);
		//this.control.plaMod.numing.datos.ent.selectedIndex=parseInt(mipizza.tabla.getmodelcell(tr,7));
		
		if (tral.idings!=0){ // (tr.idings!="0"){
			var coning=tral.idings.split(",");
			for (var i=0,lon=coning.length;i<lon;i++){
				for (var ig=0;ig<nm;ig++){
					if (ClsTabla.did(rm[ig])==coning[i]){//getmodelcell(rm[ig],1),
						sele.push([this.planing.control.tabla.getModeloCelNom(rm[ig],"NOMBRE"), coning[i]]);
						break;
					}
				}
			}
			this.control.plaMod[pl].ingres.setconte(sele);
			
		}else
			this.control.plaMod[pl].ingres.datos.contenedor.innerHTML="";
	} else {
				this.control.plaMod[pl].ingres.datos.contenedor.innerHTML="";
				//this.control.plaMod.numing.datos.ent.selectedIndex=0; 
				
	}
	if (this.plansal!=null){
		rm=this.plansal.control.tabla.tbody.rows;
		nm=rm.length;
		if (nm==0) return 2;
			sele=this.control.plaMod[pl].salsa.datos.ent;
			sele.options=[];
			var ix=0;
			//console.log("tral.idsal="+tral.idsal);
			var s= (tr ? tral.idsal : false);
			for (var i=0;i<nm;i++){
				var edid=ClsTabla.did(rm[i]);//getmodelcell(rm[i],1),
				sele.options[i]=new Option(this.plansal.control.tabla.getModeloCelNom(rm[i],"NOMBRE"), edid);
				if (s && s===edid){
					ix=i; s=false;
				}
			}
			sele.selectedIndex=ix;
	}
	return 3;
}
plantillaOtrosHijos.prototype.modificar=function(trs){
	var ne=this.rellenar(trs[0],0);
	if (ne<3){
		ClAlerta.marcar({tit:"Error",inte:"<div>Para insertar una nueva "+this.tit1+" debe de existir "+(ne==1? "Ingredientes": "Ing.Unico")+"</div>"});
			//hUtils.alertMensaje("Error","Para insertar una nueva "+this.tit1+" debe de existir "+(ne==1? "Ingredientes": "Ing.Unico"));
			return false;
		}
	this.tramod=trs;
	for (var i=0,lon=trs.length;i<lon;i++){
		if (i>0){
			this.control.nuevaPlantMod();
		}

		this.control.plaMod[i].nombre.set(this.control.tabla.getModeloCelNom(trs[i],"NOMBRE")); //  getmodelcell(trs[i],1));
		this.control.plaMod[i].descrip.set(this.control.tabla.getModeloCelNom(trs[i],"DESCRIP")); // getmodelcell(trs[i],2));
	}
	
	
}
plantillaOtrosHijos.prototype.limpiar=function() {
	var ne=this.rellenar(false,0);
	if (ne<3){
		ClAlerta.marcar({tit:"Error",inte:"<div>Para insertar una nueva "+this.tit1+" debe de existir "+(ne==1? "Ingredientes": "Ing.Unico")+"</div>"});
			//hUtils.alertMensaje("Error","Para insertar una nueva "+this.tit1+" debe de existir "+(ne==1? "Ingredientes": "Ing.Unico"));
			return false;
		}
		
	this.control.plaMod[0].nombre.set("");
	this.control.plaMod[0].descrip.set("");
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
		var nomant= this.control.tabla.getModeloCelNom(this.tramod[k],"NOMBRE");//  this.control.tabla.modelo[0].get(this.tramod[k].cells[1]);
		this.tmp.tns[k][this.tmp.corder["IMAGEN"]]=this.control.tabla.getModeloCelNom(this.tramod[k],"IMAGEN"); //Cboton.get(this.tramod[k].cells[5]);
		var alm={disal:parseInt(this.tmp.missal[k].value),idings:(this.tmp.mising[k].length==0 ? "0" : this.tmp.mising[k].join(",")) };
		if (nomant!=this.tmp.tns[k][this.tmp.corder["NOMBRE"]]){
			this.control.tabla.modLineaOrden(this.tramod[k],this.tmp.tns[k],this.tmp.corder,alm);
			FileimgApi.planImagenes.cambiar_bloq_img("otrx",ClsTabla.did(this.tramod[k]),this.padre,this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
		}else
			this.control.tabla.modLinea(this.tramod[k],this.tmp.tns[k],this.tmp.corder,alm );
		//this.tramod[k].idsal=parseInt(this.tmp.missal[k].value);
		//this.tramod[k].idings=(this.tmp.mising[k].length==0 ? "0" : this.tmp.mising[k].join(","));
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
	var alm=[];
	for (var k=0;k<cda;k++){
		this.tmp.tns[k][0]=dat.ok[k][0];
		alm.push({keyControler:dat.ok[k][1], idsal:parseInt(this.tmp.missal[k].value),idings:(this.tmp.mising[k].length==0 ? "0" : this.tmp.mising[k].join(",")) });
	}
	var trs=this.control.tabla.insMulti(this.tmp.tns,this.tmp.corder,alm);
	
	/*for (var k=0;k<cda;k++){
		trs[k].keyControler=dat.ok[k][1];
		trs[k].idsal=parseInt(this.tmp.missal[k].value);
		trs[k].idings=(this.tmp.mising[k].length==0 ? "0" : this.tmp.mising[k].join(","));
	}*/
	this.control.tabla.ordenar(1);
}
plantillaOtrosHijos.prototype.comprobar=function (){
 // modeloHijos=[[Clink,"NOMBRE","Nombre",true],[Ctexto,"DESCRIP","Descripción",true],[Ctexto,"INGU","Ing.Unico",true],[Clista,"INGREDIENTES","ingredientes",true],[Cboton,"IMAGEN","Imágen",true]];
	var miobj=[],tns=[],missal=[],mising=[],idings;
	for (var i=0;i<this.control.plaMod.length;i++){
		if (this.plansal==null)
			var selesal={text:"No",value:0};
		else
			var selesal=this.control.plaMod[i].salsa.get();
		var n=[0,this.control.plaMod[i].nombre.comprobar(),null,selesal.text, this.control.plaMod[i].ingres.getnoms(),(this.control.modificar ? this.control.tabla.getModeloCelNom(this.tramod[i],"IMAGEN"): "Añadir")];
		if (!n[1] || !(n[2]=this.control.plaMod[i].descrip.comprobar()) )
			return;
		if (this.control.tabla.existe(this.tramod ? this.tramod[i] : null,n[1])){
			this.control.seterror("Error:"+ this.tit1+" "+n[1]+" ya existe");
			return;
		}
		idings=this.control.plaMod[i].ingres.get();
		if (this.control.modificar)
			miobj.push({nombre:n[1],descrip:n[2],idsal:parseInt(selesal.value),ingres:idings,id:ClsTabla.did(this.tramod[i]) } );
		else
			miobj.push({nombre:n[1],descrip:n[2],idsal:parseInt(selesal.value),ingres:idings } );
		tns.push(n);
		missal.push(selesal);
		mising.push(idings);
	}
	this.tmp={tns:tns,missal:missal,mising:mising,corder:{"NOMBRE":1,"DESCRIP":2,"INGU":3,"INGREDIENTES":4,"IMAGEN":5}};
	this.control.enviar(this.control.modificar ? {ope:"mod",datos:miobj,padre:this.padre} : {ope:"ins",datos:miobj,padre:this.padre});	
}
plantillaOtrosHijos.prototype.clickCelda=function(td){
	if (td.nom=="IMAGEN"){ //" td.cellIndex==5){ // getmodelcell(td.td.parentNode,1) //getmodelcell(td.td.parentNode,5),
		//var _thconta=this.control.tabla,_this=this;
		cambiarImagen(td.td.parentNode,this.control.tabla.getalmacen(td.td.parentNode),"("+this.tit1+") "+ this.control.tabla.getModeloCelNom(td.td.parentNode,"NOMBRE"),this.control.tabla.getModeloCelNom(td.td.parentNode,"IMAGEN"),this.control,ClsTabla.did(td.td.parentNode),this.padre);
		/*cambiarImagen(_thconta.getalmacen(td.td.parentNode),_thconta.getModeloCelNom(td.td.parentNode,"NOMBRE"),50,_thconta.getModeloCelNom(td.td.parentNode,"IMAGEN"), function(acc,obj){ 
				if (acc=="nueva"){
					Cboton.set(td.td,obj.nombre);
					_thconta.setalmacen(td.td.parentNode,{ImgUrl:obj.url});
					FileimgApi.planImagenes.add_bloq_img("otrx",obj.nombre,obj.url,_thconta.getModeloCelNom(td.td.parentNode,"NOMBRE"),ClsTabla.did(td.td.parentNode),_this.padre );
					//td.td.parentNode.ImgUrl=obj.url;
				}else{
					Cboton.set(td.td,"Añadir");
					_thconta.setalmacen(td.td.parentNode,{ImgUrl:null});
					FileimgApi.planImagenes.eliminar_bloq_img("otrx",ClsTabla.did(td.td.parentNode),_this.padre);
					//td.td.parentNode.ImgUrl=null;
				}
			 });*/
	}
}
plantillaOtrosHijos.prototype.buscar=function(tipo,lid){
	var ptbr=this.control.tabla.tbody.rows;
	var ntr=ptbr.length;
	var encon=[]
	var lon=lid.length;
	if (tipo=="ing"){
		var endid=[];
		for (var i=0;i<lon;i++)
			for (var p=0;p<ntr;p++){
				var alm=this.control.tabla.getalmacen(ptbr[p]);
				if (alm.idings.indexOf(lid[i])>-1  && endid.indexOf(ClsTabla.did(ptbr[p]))==-1 ){
					encon.push(this.control.tabla.getModeloCelNom(ptbr[p],"NOMBRE")); // getmodelcell(ptbr[p],1));
					endid.push(ClsTabla.did(ptbr[p]));
				}
			}
	}else if (tipo=="sal"){
		for (var i=0;i<lon;i++)
			for (var p=0;p<ntr;p++){
				var alm=this.control.tabla.getalmacen(ptbr[p]);
				if (alm.idsal==lid[i])
					encon.push(this.control.tabla.getModeloCelNom(ptbr[p],"NOMBRE")); // getmodelcell(ptbr[p],1));
			}
	}
	return encon;
}
plantillaOtrosHijos.prototype.corregirIngSal=function(tipo,lid,ant,nue){
	var ptbr=this.control.tabla.tbody.rows;
	var ntr=ptbr.length;
	
	if (tipo=="ing"){
		for (var p=0;p<ntr;p++)
			if (this.control.tabla.getalmacen(ptbr[p]).idings.indexOf(lid)>-1 ){
				var arr=this.control.tabla.getModeloCelNom(ptbr[p], "INGREDIENTES"); // getmodelcell(ptbr[p],4);
				for (var i=0,lon2=arr.length;i<lon2;i++)
					if (arr[i]==ant) arr[i]=nue;
				//arr[arr.indexOf(lid)]=nue;
				this.control.tabla.setModeloCelNom(ptbr[p],"INGREDIENTES",arr);
				//this.control.tabla.modelo[3].set(ptbr[p].cells[4],arr);
			}
	}else if (tipo=="sal"){
		for (var p=0;p<ntr;p++)
			if (this.control.tabla.getalmacen(ptbr[p]).idsal==lid){
				this.control.tabla.setModeloCelNom(ptbr[p],"INGU",nue);
				//this.control.tabla.modelo[2].set(ptbr[p].cells[3],nue);
			}
	}
}
plantillaOtrosHijos.prototype.postelim=function(okel,lids){
	if (okel){
		for (var i=0;i<lids.length;i++)
			FileimgApi.planImagenes.eliminar_bloq_img("otrx",this.padre,lids[i]);
	}
}
var divotros=document.createElement("div");
var divotroshijos=document.createElement("div");
divotros.className="wrapper"; divotroshijos.className="wrapper";
function inicio(dpa,dat) {
	
	//document.body.appendChild(divotros);
	//document.body.appendChild(divotroshijos);
	var divcomplex=document.createElement("div");
	divcomplex.className="marco-hijo";
	dpa.appendChild(divcomplex);
	divcomplex.appendChild(divotros);
	divcomplex.appendChild(divotroshijos);

	miotro.init(divotros,ClsVentanasTipo.titaceptar,true);
	miotro.ventabla.pie.appendChild(hUtils.crearElemento({e:"button", inner:"Actualizar",a:{className:"btn btn-left",title:"Recargar Productos con Ingredientes",onclick:actualizarTablas  }},null));
	miotro.ventabla.show();
	renderizarTablas(dat);				
	return divcomplex;
}
function actualizarTablas(){
	hUtils.xJson({url:"/admintienda/Otrosx/verTodas",accion:"GET",formu:false}).then(function(dat){
		console.log("recibimos ok respuesta en actualizar otrosxx dat=",dat);
		var notr=miotro.tabla.tbody.rows; 
		for (var i=0,lon=notr.length;i<lon;i++){
			plantillaOtros.controles[ClsTabla.did(notr[i])].eliminar();
		}
		plantillaOtros.controles={};
		miotro.tabla.vaciartabla();
		renderizarTablas(dat);
	}).fail(function(dat){
		console.log("recibimos error en actualizar otrosxx respuesta dat="+dat);
	});
}
function renderizarTablas(dat){
	//console.log("recibimos ok respuesta dat=",dat);
	var lotr=dat.otrosx.length;
	if (lotr>0){
		miotro.tabla.render(dat.otrosx,{"NOMBRE":1,"DESCRIP":2,"INGU":3,"TAMAS":4,"LISTAR":5,"URL":6});
		var tr,corderotrHi={"NOMBRE":1,"DESCRIP":2,"INGU":3,"INGREDIENTES":4,"IMAGEN":5},corderingsal={"NOMBRE":1,"VALOR":2},cordertamax={"NOMBRE":1,"PREBASE":2,"PREING":3};
		for(var i=0;i<lotr;i++){
			var oi=dat.otrosx[i][0];
			var con=new plantillaOtrosHijos({								
					sal:dat.otrosx[i][3].length>0,
					tama:(dat.otrosx[i][4][0]=='Varios' ? 1 : 0),
					padre:oi,
					tit:dat.otrosx[i][1]
				});
			plantillaOtros.controles[oi]=con;
			var duo=dat.unotrosx[oi];
			if (dat.ingresx[oi]){
				con.planing.control.tabla.render(dat.ingresx[oi],corderingsal);
				var mnui=dat.ingresx[oi];
				var nui=mnui.length;
			}else{
				console.log("No existen ingredientess de "+dat.otrosx[i][1]+", oi="+oi);
				return;
			}
			var haysal=false;
			if (dat.salsasx[oi]){
				con.plansal.control.tabla.render(dat.salsasx[oi],corderingsal);
				var mnus=dat.salsasx[oi];
				var nus=mnus.length;
				haysal=true;
			}else{
				console.log("No existen salsax de "+dat.otrosx[i][1]+", oi="+oi);
				
			}
			if (dat.tamax[oi]){
				con.plantama.control.tabla.render(dat.tamax[oi],cordertamax);
			}
			if (duo && duo.length>0){

				for (var n=0,lun=duo.length;n<lun;n++){
					var ei=duo[n][4];
					var lei=ei.length;
					var losing=[];
					for (var g=0;g<lei;g++)
						for (var j=0;j<nui;j++)
							if (mnui[j][0]==ei[g]){ losing.push(mnui[j][1]); break; }
					var lasal="No";
					if (haysal){
						for (var j=0;j<nus;j++)
							if (mnus[j][0]==duo[n][3]){ lasal=mnus[j][1]; break; }
					}
					var alm={idsal:duo[n][3], idings:duo[n][4].join(","), keyControler:duo[n][6], ImgUrl: duo[n][5][1]};
					con.control.tabla.nueLinea([duo[n][0],duo[n][1],duo[n][2],lasal,losing,duo[n][5][0] || "Añadir"],corderotrHi, alm);
					/*tr.idsal=duo[n][3];
					tr.idings=duo[n][4].join(",");
					tr.keyControler=duo[n][6];
					tr.ImgUrl=duo[n][5][1];*/
				}
			}
			con.listar();
		}
	}
	miotro.ventabla.show();
}
var urlIngSal="/admintienda/Otrosx/ingsal";
var modIngSal=[[Clink,"NOMBRE", "Nombre"],[Cnumero,"VALOR", "Valor"]];
function planIngSal(dc,tit,ssal,pad){
	this.modelo=modIngSal;
	this.url=urlIngSal;
	this.tit1=(ssal ? "Ing.Unico "+tit : "Ingredientes "+tit); this.tit2=(ssal ? "Ing.Unico" : "Ingrediente");
	this.soysal=ssal;
	this.conclase="conclase-modpiz";
	this.tramod=null;
	this.plapadre=pad;
	this.control=new Controlador(this);
	this.control.init(dc,ClsVentanasTipo.titaceptar,false);
}
planIngSal.prototype.eliminar=function() {
	this.control.eliminar();
	this.plapadre=this.control=this.soysal=this.modelo=this.tit1=this.tit2=this.tramod=this.conclase=null;
}
planIngSal.prototype.nuevoplamod=function (aux,npla) {
	var objpla={
		nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
		valor:new ClabInput({la:"Valor",lon:4,padre:aux},hUtils.validarFloat),
		nele:npla
	}
	objpla.valor.set(1);
	return [objpla,objpla.nombre.datos.ent];
}

planIngSal.prototype.modificar=function(trs){
	this.tramod=trs;
	var corder=["NOMBRE","VALOR"];
	for (var i=0,lon=trs.length;i<lon;i++){
		if (i>0){
			this.control.nuevaPlantMod();
		}
		var dat=this.control.tabla.getLinea(trs[i],corder).li;
		this.control.plaMod[i].nombre.set(dat[0]);
		this.control.plaMod[i].valor.set(dat[1]);
	}
	
}
planIngSal.prototype.limpiar=function() {
		this.control.plaMod[0].nombre.set("");
		this.control.plaMod[0].valor.set(1);
		return true;
}
planIngSal.prototype.preelim=function(objs) {
	console.log("errerrree");
	var lis=objs.datos;
	if (this.soysal){
		if (lid.length>1)
			var ca="Antes de eliminar estos <b>Ing.Unico</b> debes de eliminar o cambiar el Ing.Unico de estas ";
		else
			var ca="Antes de eliminar este <b>Ing.Unico</b> debes de eliminar o cambiar el Ing.Unico de estas ";
		objs.tipo="sal";
	}else{
		if (lid.length>1)
			var ca="Antes de eliminar estos <b>Ingredientes</b> debes de eliminar o cambiar estos ingredientes en estas ";
		else
			var ca="Antes de eliminar este <b>Ingrediente</b> debes de eliminar o cambiar estos ingredientes en estas ";
		objs.tipo="ing";
	}
	var pie=this.plapadre.buscar(objs.tipo,lid);
	if (pie.length>0){
		ClAlerta.marcar({tit:"Advertencia",inte:"<div style='text-align:left;padding:5px;'>"+ca+this.plapadre.tit1+":<br><b>- "+pie.join('<br>- ')+"</b></div>"});
		//hUtils.alertMensaje("Advertencia","<div style='text-align:left;padding:5px;'>"+ca+this.plapadre.tit1+":<br><b>- "+pie.join('<br>- ')+"</b></div>");
		//alert("Estas pizzas contienen alguno de los ingredientes que quieres borrar. Antes de eliminar estos ingredientes Debes de modificar los ingredientes de estas pizzas:\n"+pie.join(',')+"");
		return false;

	}
	objs.padre=this.plapadre.padre;
	//alert("preelim ingredientes");
	
	return true;
}
planIngSal.prototype.okmodificar=function(dat) {
	console.log("recibimos ok respuesta dat=",dat);
	var cda=dat.ok.length;
		if (dat.key==0){
			ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
			//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
			this.tmp.tns.splice(cda-1,tns.length);
		}	
	for (var k=0;k<cda;k++) {	
		var nomant=this.control.tabla.getModeloCelNom(this.tramod[k],"NOMBRE"); // getmodelcell(this.tramod[k],1);	
		if (this.tmp.tns[k][1]!=nomant){
			this.control.tabla.modLineaOrden(this.tramod[k],this.tmp.tns[k],this.tmp.corder); 
			this.plapadre.corregirIngSal(this.tmp.tip,ClsTabla.did(this.tramod[k]),nomant,this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
		}else
			this.control.tabla.modLinea(this.tramod[k],this.tmp.tns[k],this.tmp.corder);
	}
	this.tramod=null;

}
planIngSal.prototype.okinsertar=function(dat) {
	console.log("recibimos ok respuesta dat=",dat);

	var cda=dat.ok.length;
		if (dat.key==0){
			ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
			//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
			this.tmp.tns.splice(cda-1,tns.length);
		}				
		if (cda==1){
			this.tmp.tns[0][0]=dat.ok[0];
			this.control.tabla.insOrden(this.tmp.tns[0],this.tmp.corder);
		}else if (cda>1){
			for (var k=0;k<cda;k++)
				this.tmp.tns[k][0]=dat.ok[k];
			this.control.tabla.insMulti(this.tmp.tns,this.tmp.corder);
			this.control.tabla.ordenar(1);
		}
		
}
planIngSal.prototype.comprobar=function(){ //=[[Clink,"NOMBRE", "Nombre"],[Cnumero,"VALOR", "Valor"]];
	var miobj=[],tns=[];
	for (var i=0;i<this.control.plaMod.length;i++){
		var n=[0,this.control.plaMod[i].nombre.comprobar()];
		if (!n[1] || !(n[2]=this.control.plaMod[i].valor.comprobar()))
			return;
		if (this.control.tabla.existe(this.tramod ? this.tramod[i] : null,n[1])){
			this.control.seterror((this.soysal ? "Ing.Unico" : "Ingrediente")+" ya existe");
			return;
		}
		if (this.control.modificar)
			miobj.push({nombre:n[1],valor:n[2],id:ClsTabla.did(this.tramod[i])} );
		else
			miobj.push({nombre:n[1],valor:n[2]} );
		tns.push(n);
	}
	var tip=(this.soysal ? "sal" : "ing");	
	this.tmp={tns:tns,tip:tip,corder:{"NOMBRE":1,"VALOR":2}};
	this.control.enviar(this.control.modificar ? {ope:"mod",tipo:tip,datos:miobj,padre:this.plapadre.padre} : {ope:"ins",tipo:tip,datos:miobj,padre:this.plapadre.padre});
}


var modeloTama=[[Clink,"NOMBRE","Nombre",true],[Cnumero,"PREBASE","Pre.Base",true],[Cnumero,"PREING","Pre.Ing",true]];
var urlTama="/admintienda/Otrosx/tamas";
function plantillaTama(dc,tit,pa){
	this.modelo=modeloTama;
	this.tit1="TAMAÑOS "+tit;
	this.tit2="Tamaño";
	this.conclase="conclase-modpiz";
	this.url=urlTama;
	this.tramod=null;
	this.plapadre=pa;
	this.control=new Controlador(this);
	this.control.init(dc,ClsVentanasTipo.titaceptar,false);
}
plantillaTama.prototype.eliminar=function() {
	this.control.eliminar();
	this.url=this.plapadre=this.control=this.modelo=this.tit1=this.tit2=this.tramod=this.conclase=null;
}
plantillaTama.prototype.nuevoplamod=function (aux,npla) {
	var objpla={
		nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
		prebase:new ClabInput({la:"Precio Base",lon:5,padre:aux},hUtils.validarFloat),
		preing:new ClabInput({la:"Precio Ingrediente",lon:5,padre:aux},hUtils.validarFloat),
		nele:npla
	}
	return [objpla,objpla.nombre.datos.ent];
}

plantillaTama.prototype.modificar=function(trs){
	this.tramod=trs;
	var corder=["NOMBRE","PREBASE","PREING"];
	for (var i=0,lon=trs.length;i<lon;i++){
		if (i>0){
			this.control.nuevaPlantMod();
		}
		var dat=this.control.tabla.getLinea(trs[i],corder).li;
		this.control.plaMod[i].nombre.set(dat[0])
		this.control.plaMod[i].prebase.set(dat[1]);
		this.control.plaMod[i].preing.set(dat[2]);
	}
	
}
plantillaTama.prototype.limpiar=function() {
	this.control.plaMod[0].nombre.set("");
	this.control.plaMod[0].prebase.set("");
	this.control.plaMod[0].preing.set("");
	return true;
}
plantillaTama.prototype.okmodificar=function(dat) {
	console.log("recibimos ok respuesta dat=",dat);
	var cda=dat.ok.length;
		if (dat.key==0){
			ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
			//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
			this.tmp.tns.splice(cda-1,tns.length);
		}
	for (var k=0;k<cda;k++) {
		var nomant=this.control.tabla.getModeloCelNom(this.tramod[k] ,"NOMBRE"); // getmodelcell(this.tramod[k],1);
		if (this.tmp.tns[k][this.tmp.corder["NOMBRE"]]!=nomant)
			this.control.tabla.modLineaOrden(this.tramod[k],this.tmp.tns[k],this.tmp.corder);
		else
			this.control.tabla.modLinea(this.tramod[k],this.tmp.tns[k],this.tmp.corder);
	}
		this.tramod=null;
}
plantillaTama.prototype.okinsertar=function(dat) {
	console.log("recibimos ok respuesta dat=",dat);
		var cda=dat.ok.length;
		if (dat.key==0){
			ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
			//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
			this.tmp.tns.splice(cda-1,tns.length);
		}				
		if (cda==1){
			this.tmp.tns[0][0]=dat.ok[0];
			this.control.tabla.insOrden(this.tmp.tns[0],this.tmp.corder);
		}else if (cda>1){
			for (var k=0;k<cda;k++)
				this.tmp.tns[k][0]=dat.ok[k];
			this.control.tabla.insMulti(this.tmp.tns,this.tmp.corder);
			this.control.tabla.ordenar(1);
		}
}
plantillaTama.prototype.comprobar=function() {
//[[Clink,"NOMBRE","Nombre",true],[Cnumero,"PREBASE","Pre.Base",true],[Cnumero,"PREING","Pre.Ing",true]];
	var miobj=[],tns=[];
	for (var i=0;i<this.control.plaMod.length;i++){
		var n=[0,this.control.plaMod[i].nombre.comprobar()];
		if (!n[1] || !(n[2]=this.control.plaMod[i].prebase.comprobar()) || !(n[3]=this.control.plaMod[i].preing.comprobar()) )
			return;
		if (this.control.modificar)
			miobj.push({nombre:n[1],preba:n[2],preing:n[3],id:this.tramod[i]} );
		else
			miobj.push({nombre:n[1],preba:n[2],preing:n[3]} );
		tns.push(n);
	}
	this.tmp={tns:tns,corder:{"NOMBRE":1,"PREBASE":2,"PREING":3}};
	this.control.enviar(this.control.modificar ? {ope:"mod",datos:miobj,padre:this.plapadre.padre} : {ope:"ins",datos:miobj,padre:this.plapadre.padre} );
}
function producHijos() {
		var hi=[];
		var hr=miotro.tabla.tbody.rows;
		var lo=hr.length;
		for (var h=0;h<lo;h++)// Clink.get(hr[h].cells[1])
			hi.push([miotro.tabla.getModeloCelNom(hr[h],"NOMBRE"),"2-"+ClsTabla.did(hr[h])]);
		return hi;
}
function unproducHijo(nid) {
		var hi=[];
		var ehi=plantillaOtros.controles[nid];
		var hr=ehi.control.tabla.tbody.rows;
		var lo=hr.length;
		for (var h=0;h<lo;h++)//Clink.get(hr[h].cells[1])
			hi.push([ehi.control.tabla.getModeloCelNom(hr[h],"NOMBRE") ,ClsTabla.did(hr[h])]);
		var hta=false;
		if (ehi.plantama != null ){
			hta=[];
			hr=ehi.plantama.control.tabla.tbody.rows;
			lo=hr.length;
			for (var h=0;h<lo;h++)// Clink.get(hr[h].cells[1])
				hta.push([ehi.plantama.control.tabla.getModeloCelNom(hr[h],"NOMBRE"),ClsTabla.did(hr[h])]);
		}
		return {art:hi,tamas:hta};
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
			var nombreori=econtrol.getModeloCelNom(tr.tr,"IMAGEN");
			return {nomimaorigen:nombreori,keyControler:tr.almacen.keyControler,nomarti:"("+econtrol1.tit1+") "+ econtrol.getModeloCelNom(tr.tr,"NOMBRE"),nombre:nombreori,url:tr.almacen.ImgUrl};
		}
		cambiarImagen(tr.tr,tr.almacen,"("+econtrol1.tit1+") "+ econtrol.getModeloCelNom(tr.tr,"NOMBRE"),econtrol.getModeloCelNom(tr.tr,"IMAGEN"),econtrol,niduo,nido);
		/*cambiarImagen(tr.almacen,econtrol.getModeloCelNom(tr.tr,"NOMBRE"),50,econtrol.getModeloCelNom(tr.tr,"IMAGEN"),function(acc,obj){ 
					if (acc=="nueva"){
						econtrol.setModeloCelNom(tr.tr,"IMAGEN",obj.nombre);
						econtrol.setalmacen(tr.tr,{ImgUrl:obj.url});
						FileimgApi.planImagenes.add_bloq_img("otrx",obj.nombre,obj.url,econtrol.getModeloCelNom(tr.tr,"NOMBRE"),niduo,nido );
						//td.parentNode.ImgUrl=obj.url;
					}else{
						econtrol.setModeloCelNom(tr.tr,"IMAGEN","Añadir");
						econtrol.setalmacen(tr.tr,{ImgUrl:null});
						FileimgApi.planImagenes.eliminar_bloq_img("otrx",niduo,nido);
						//td.parentNode.ImgUrl=null;
					}
				 });*/
	}
}
function nombreOtrox(nid){
	var hr=miotro.tabla.tbody.rows,lo=hr.length;
	for (var h=0;h<lo;h++)// Clink.get(hr[h].cells[1])
		if (ClsTabla.did(hr[h])==nid) return miotro.tabla.getModeloCelNom(hr[h],"NOMBRE");
	return "Desconodido";
}
return {inicio:inicio,producHijos:producHijos,datosOtx:unproducHijo,numRegistros:numRegistros,actualizar:actualizarTablas,dameImagenes:dameImagenes,cambiar_Imagen:cambiar_Imagen,nombreOtrox:nombreOtrox};
})();