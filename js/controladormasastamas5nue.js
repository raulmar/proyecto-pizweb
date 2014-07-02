'use strict';
var controladorMasasTamas=(function(){
var Clink=ClsTabla.campo.Clink, Ctexto=ClsTabla.campo.Ctexto,Clista=ClsTabla.campo.Clista,Cboton=ClsTabla.campo.Cboton,Cnumero=ClsTabla.campo.Cnumero,Cbool=ClsTabla.campo.Cbool;
	

var plantillaMasa= {
	modelo:[[Clink,"NOMBRE", "Nombre"],[Ctexto,"DESCRIP", "Descripción"]],
	tit1:"MASAS",
	tit2:"Masa",
	tramod:null,
	conclase:"conclase-modpiz",
	url:"/admintienda/Pizzas/Masas",
	nuevoplamod:function (aux,npla) {
		var objpla={
			nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
			descrip:new ClabInput({la:"Descripción",lon:200,padre:aux,area:true}),
			nele:npla
		}
		return [objpla,objpla.nombre.datos.ent];
	},
	okmodificar:function(dat){
		console.log("recibimos ok respuesta dat=",dat);
		var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,tns.length);
			}
		for (var k=0;k<cda;k++) {
			var nomant=mimasa.tabla.getModeloCelNom(plantillaMasa.tramod[k],"NOMBRE");// mimasa.tabla.modelo[0].get(plantillaMasa.tramod[k].cells[1]);
			if (nomant!=this.tmp.tns[k][this.tmp.corder["NOMBRE"]]){
				mimasa.tabla.modLineaOrden(plantillaMasa.tramod[k],this.tmp.tns[k],this.tmp.corder);
				plantillaMasaTama.corregirmata("m",ClsTabla.did(plantillaMasa.tramod[k]),this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
			}else
				mimasa.tabla.modLinea(plantillaMasa.tramod[k],this.tmp.tns[k],this.tmp.corder);
		}
		plantillaMasa.tramod=null;
	},
	okinsertar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
			var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,this.tmp.tns.length);
			}
			if (cda==1){
				this.tmp.tns[0][0]=dat.ok[0];
				mimasa.tabla.insOrden(this.tmp.tns[0],this.tmp.corder);
			}else if (cda>1){
				for (var k=0;k<cda;k++)
					this.tmp.tns[k][0]=dat.ok[k];
				mimasa.tabla.insMulti(this.tmp.tns,this.tmp.corder);
				mimasa.tabla.ordenar(1);
			}

	},
	comprobar:function (){
		var miobj=[],tns=[];
		for (var i=0;i<mimasa.plaMod.length;i++){
			mimasa.plaMod[i].nombre.outerror();
			var n=[0,mimasa.plaMod[i].nombre.comprobar()];
			if (!n[1] || !(n[2]=mimasa.plaMod[i].descrip.comprobar()))
				return;
			if (mimasa.tabla.existe(plantillaMasa.tramod ? plantillaMasa.tramod[i] : null,n[1])){
				mimasa.plaMod[i].nombre.seterror("Error:Masa "+n[1]+" ya existe");
				//alert("Masa "+n[1]+", ya existe");
				return;
			}
			if (mimasa.modificar)
				miobj.push({nombre:n[1],descrip:n[2],id:this.tramod[i].did});
			else
				miobj.push({nombre:n[1],descrip:n[2]});
			tns.push(n);
		}
		this.tmp={tns:tns,corder:{"NOMBRE":1,"DESCRIP":2}};
		mimasa.enviar( mimasa.modificar ? {ope:"mod",datos:miobj} : {ope:"ins",datos:miobj} );
	},
	modificar:function(trs){
		plantillaMasa.tramod=trs;
		var corder=["NOMBRE","DESCRIP"];
		for (var i=0,lon=trs.length;i<lon;i++){
			if (i>0){
				mimasa.nuevaPlantMod();
			}
			var dat=mimasa.tabla.getLinea(trs[i]).li;
			mimasa.plaMod[i].nombre.set(dat[0]);
			mimasa.plaMod[i].descrip.set(dat[1]);
		}
		
	},
	limpiar:function() {
		mimasa.plaMod[0].nombre.set("");
		mimasa.plaMod[0].descrip.set("");
		return true;
	},
	preelim:function(objs) {
		var mte=plantillaMasaTama.buscar("m",objs.datos);
		if (mte.length>0){
			var pie=plantillaPizzas("mat",mte);
			if (pie.length>0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Estas pizzas contienen masas que quieres borrar. Antes de eliminar estas masas Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join('<br>')+"</div>"});
				//hUtils.alertMensaje("Error","Estas pizzas contienen masas que quieres borrar. Antes de eliminar estas masas Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join('<br>'));
				//alert("Estas pizzas contienen masas que quieres borrar. Antes de eliminar estas masas Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join(',')+"");
				return false;
			}
		}
		return true;
	},
	postelim:function(ok,lid){
		if (ok){
			var tbo=mimasatama.tabla.tbody;
			var nm=tbo.rows.length;
			var li=[],lon=lid.length;
			for (var i=0;i<nm;i++){
				for (var n=0;n<lon;n++){
					if (tbo.rows[i].idma==lid[n])
						li.push(tbo.rows[i]);
						
				}
			}
			for (var i=0,lon=li.length;i<lon;i++){
				tbo.removeChild(li[i]);
			}
		}else {
			alert("error:"+lid);
			console.log("error:"+lid);
		}
	}
}
var mimasa=new Controlador(plantillaMasa);



var plantillaTama={
	modelo:[[Clink,"NOMBRE","Nombre"],[Cnumero,"NUMPERSO","Nº personas"]],
	tit1:"TAMAÑOS",
	tit2:"Tamaño",
	conclase:"conclase-modpiz",
	url:"/admintienda/Pizzas/Tamas",
	tramod:null,
	nuevoplamod:function (aux,npla) {
		var objpla={
			nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
			personas:new ClabInput({la:"Nº de personas",lon:2,padre:aux},hUtils.validarInt),
			nele:npla
		}
		return [objpla,objpla.nombre.datos.ent];
	},
	modificar:function(trs){
		plantillaTama.tramod=trs;
		var corder=["NOMBRE","NUMPERSO"];
		for (var i=0,lon=trs.length;i<lon;i++){
			if (i>0){
				mitama.nuevaPlantMod();
			}
			var dat=mitama.tabla.getLinea(trs[i],corder).li;
			mitama.plaMod[i].nombre.set(dat[0]);
			mitama.plaMod[i].personas.set(dat[1]);
		}
		
	},
	limpiar:function() {
		mitama.plaMod[0].nombre.set("");
		mitama.plaMod[0].personas.set("");
		return true;
	},
	okmodificar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
		var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,tns.length);
			}
		for (var k=0;k<cda;k++) {
			var nomant=mitama.tabla.getModeloCelNom(plantillaTama.tramod[k],"NOMBRE"); // mitama.tabla.modelo[0].get(plantillaTama.tramod[k].cells[1]);
			if (nomant!=this.tmp.tns[k][this.tmp.corder["NOMBRE"]]){
				mitama.tabla.modLineaOrden(plantillaTama.tramod[k],this.tmp.tns[k],this.tmp.corder);
				plantillaMasaTama.corregirmata("t",plantillaTama.tramod[k].did,this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
			} else
				mitama.tabla.modLinea(plantillaTama.tramod[k],this.tmp.tns[k],this.tmp.corder);
		}
		plantillaTama.tramod=null;
	},
	okinsertar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
			var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,this.tmp.tns.length);
			}
			if (cda==1){
				this.tmp.tns[0][0]=dat.ok[0];
				mitama.tabla.insOrden(this.tmp.tns[0],this.tmp.corder);
			}else if (cda>1){
				for (var k=0;k<cda;k++)
					this.tmp.tns[k][0]=dat.ok[k];
				mitama.tabla.insMulti(this.tmp.tns,this.tmp.corder);
				mitama.tabla.ordenar(1);
			}
	},
	comprobar:function(){
		var miobj=[],tns=[];
		for (var i=0;i<mitama.plaMod.length;i++){
			mitama.plaMod[i].nombre.outerror();
			var n=[0,mitama.plaMod[i].nombre.comprobar()];
			if (!n[1] || !(n[2]=mitama.plaMod[i].personas.comprobar()))
				return;
			if (mitama.tabla.existe(plantillaTama.tramod ? plantillaTama.tramod[i] :null,n[1])){
				mitama.plaMod[i].nombre.seterror("Error:Tamaño "+n[1]+", ya existe");
				//alert("Tamaño "+n[1]+", ya existe");
				return;
			}
			if (mitama.modificar)
				miobj.push({nombre:n[1],perso:n[2],id:plantillaTama.tramod[i].did});
			else
				miobj.push({nombre:n[1],perso:n[2]});
			tns.push(n);
		}
		this.tmp={tns:tns,corder:{"NOMBRE":1,"NUMPERSO":2}};
		mitama.enviar( mitama.modificar ? {ope:"mod",datos:miobj} : {ope:"ins",datos:miobj} );
	},
	preelim:function(objs) {
		var mte=plantillaMasaTama.buscar("t",objs.datos);
		if (mte.length>0){
			var pie=plantillaPizzas("mat",mte);
			if (pie.length>0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Estas pizzas contienen tamaños que quieres borrar. Antes de eliminar estos tamaños Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join('<br>')+"</div>"});
				//hUtils.alertMensaje("Error","Estas pizzas contienen tamaños que quieres borrar. Antes de eliminar estos tamaños Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join('<br>'));
				//alert("Estas pizzas contienen tamaños que quieres borrar. Antes de eliminar estos tamaños Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join(',')+"");
				return false;
			}
		}
		return true;
	},
	postelim:function(ok,lid){
		if (ok){
			var tbo=mimasatama.tabla.tbody;
			var nm=tbo.rows.length;
			var li=[],lon=lid.length;
			for (var i=0;i<nm;i++){
				for (var n=0;n<lon;n++){
					if (mimasatama.tabla.getalmacen(tbo.rows[i]).idta==lid[n])
						li.push(tbo.rows[i]);
						
				}
			}
			for (var i=0,lon=li.length;i<lon;i++){
				tbo.removeChild(li[i]);
			}
		}else {
			alert("error:"+lid);
			console.log("error:"+lid);
		}
	}
}

var mitama=new Controlador(plantillaTama);	
var plantillaMasaTama={
	modelo:[[Clink,"NOMBRE", "Masa-Tamaño",true],[Cnumero,"PREBASE", "Pre.Base",true],[Cnumero,"PREING", "Pre.Ing",true]],
	tit1:"MASAS - TAMAÑOS",
	tit2:"Masa_Tamaño",
	conclase:"conclase-modpiz",
	url:"/admintienda/Pizzas/Matas",
	tramod:null,
	nuevoplamod:function (aux,npla) {
		var objpla={
			masa:new ClabSelect({la:"Masa",padre:aux}),
			tama:new ClabSelect({la:"Tamaño",padre:aux}),
			prebase:new ClabInput({la:"Precio Base",lon:5,padre:aux},hUtils.validarFloat),
			preing:new ClabInput({la:"Precio Ingrediente",lon:5,padre:aux},hUtils.validarFloat),
			nele:npla
		}
		if (!mimasatama.modificar)
			this.rellenarmt(false,false,objpla);
		return [objpla,objpla.masa.datos.ent];
	},
	corregirmata:function(mot,did,nue){
		var rm=mimasatama.tabla.tbody.rows;
		var nm=rm.length;
		var nuemata=[];
		if (mot=="m"){
			for (var i=0;i<nm;i++){
				var alm=mimasatama.tabla.getalmacen(rm[i]);
				if (alm.idma==did) {
					//var noa=mimasatama.tabla.modelo[0].get(rm[i].cells[1]);
					var noa=nue+"-"+mitama.tabla.getModeloCelNom(mitama.tabla.getdidtr(ClsTabla.did(alm.idta)),"NOMBRE" ); //  mitama.tabla.modelo[0].get(mitama.tabla.getdidtr(rm[i].idta).cells[1]);
					nuemata.push([ClsTabla.did(rm[i]),mimasatama.tabla.getModeloCelNom(rm[i],"NOMBRE"),noa]); //  mimasatama.tabla.getmodelcell(rm[i],1), noa]);
					mimasatama.tabla.setModeloCelNom(rm[i],"NOMBRE",noa);
					//mimasatama.tabla.modelo[0].set(rm[i].cells[1] ,noa); 
						//noa.substr(noa.indexOf('-')));
				}
			}
		}else if (mot=="t"){
			for (var i=0;i<nm;i++){
				var alm=mimasatama.tabla.getalmacen(rm[i]);
				if (alm.idta==did) {
					//var noa=mimasatama.tabla.modelo[0].get(rm[i].cells[1]);
					var noa=mimasa.tabla.getModeloCelNom(mimasa.tabla.getdidtr(ClsTabla.did(alm.idma)),"NOMBRE" )+"-"+nue;//    mimasa.tabla.modelo[0].get(mimasa.tabla.getdidtr(rm[i].idma).cells[1])+"-"+nue;
					nuemata.push([ClsTabla.did(rm[i]), mimasatama.tabla.getModeloCelNom(rm[i],"NOMBRE"),noa]);
					//nuemata.push([rm[i].did,mimasatama.tabla.getmodelcell(rm[i],1),noa]);
					mimasatama.tabla.setModeloCelNom(rm[i],"NOMBRE",noa);
					//mimasatama.tabla.modelo[0].set(rm[i].cells[1],noa );//noa.substr(0,noa.indexOf('-'))
				}
			}
		}
		if (nuemata.length>0)
			plantillaPizzas.corregirmata(nuemata);

	},
	buscar:function(tipo,lid){
		var rm=mimasatama.tabla.tbody.rows;
		var nm=rm.length;
		var lon=lid.length;
		var encon=[];
		if (tipo=="m"){
			for (var i=0;i<lon;i++)
				for (var m=0;m<nm;n++)
					if (mimasatama.tabla.getalmacen(rm[m]).idma==lid[i]) encon.push(ClsTabla.did(rm[m]));//   (rm[m].idma==lid[i]) encon.push(rm[m].did);
		} else if (tipo=="t"){
			for (var i=0;i<lon;i++)
				for (var m=0;m<nm;n++)
					if (mimasatama.tabla.getalmacen(rm[m]).idta==lid[i]) encon.push(ClsTabla.did(rm[m]));//(rm[m].idta==lid[i] ) encon.push(rm[m].did);
		}
		return encon;
	},
	revisarmata:function() {
		var rm=mimasatama.tabla.tbody.rows;
		var nm=rm.length;
		var rma=mimasa.tabla.tbody.rows;
		var nma=rma.length;
		var rmt=mitama.tabla.tbody.rows;
		var nmt=rmt.length;
		var idma=-1,idta=-1,nomma,nomta;
		for (var i=0;i<nm;i++){
			var alm=mimasatama.tabla.getalmacen(rm[i]);
			if (idma!= alm.idma){
				idma=alm.idma; 
				nomma=false;
				for (var m=0;m<nma;m++)
					if (ClsTabla.did(rma[m])==idma){ nomma=mimasa.tabla.getModeloCelNom(rma[m],"NOMBRE"); break; }
			}
			if (idta!=alm.idta){
				idta=alm.idta;
				nomta=false;
				for (var t=0;t<nmt;t++)
					if (ClsTabla.did(rmt[t])==idta){ nomta=mitama.tabla.getModeloCelNom(rmt[t],"NOMBRE"); break; }
			}
			if (nomma || nomta){
				mimasatama.tabla.setModeloCelNom(rm[i],"NOMBRE",nomma+"-"+nomta );
			}

		}
	},
	rellenarmt:function(m,t,obp){
		var rm=mimasa.tabla.tbody.rows;
		var nm=rm.length;
		if (nm==0) return false;
		var sele=obp.masa.datos.ent;
		sele.options.length=0; //[];
		var ix=0;
		for (var i=0;i<nm;i++){
			var rdid=ClsTabla.did(rm[i]);
			sele.options[i]=new Option(mimasa.tabla.getModeloCelNom(rm[i],"NOMBRE"),rdid);
			if (m && m===rdid){
				ix=i; m=false;
			}
		}
		sele.selectedIndex=ix;
		rm=mitama.tabla.tbody.rows;
		nm=rm.length;
		if (nm==0) return false;
		var sele=obp.tama.datos.ent;
		sele.options.length=0;//[];
		ix=0;
		for (var i=0;i<nm;i++){
			var rdid=ClsTabla.did(rm[i]);
			sele.options[i]=new Option(mitama.tabla.getModeloCelNom(rm[i],"NOMBRE"),rdid);
			if (t && t===rdid){
				ix=i; t=false;
			}
		}
		sele.selectedIndex=ix;
		return true;
	},
	modificar:function(trs){
		plantillaMasaTama.tramod=trs;
		var corder=["NOMBRE","PREBASE","PREING"];
		for (var i=0,lon=trs.length;i<lon;i++){
			if (i>0){
				mimasatama.nuevaPlantMod();
			}
			this.rellenarmt(trs[i].idma,trs[i].idta,mimasatama.plaMod[i]);
			var dat=mimasatama.tabla.getLinea(trs[i],corder).li;
			mimasatama.plaMod[i].prebase.set(dat[1]);
			mimasatama.plaMod[i].preing.set(dat[2]);
		}
		
	},
	limpiar:function() {
		if (!this.rellenarmt(false,false,mimasatama.plaMod[0])){
			ClAlerta.marcar({tit:"Error",inte:"<div>Para insertar un nuevo masa-tamaño deben de existir masas y tamaños.</div>"});
			//hUtils.alertMensaje("Error","Para insertar un nuevo masa-tamaño deben de existir masas y tamaños.");
			//alert("Para insertar un nuevo masa-tamaño deben de existir masas y tamaños.");
			return false;
		}
		mimasatama.plaMod[0].prebase.set("");
		mimasatama.plaMod[0].preing.set("");
		return true;
	},
	okmodificar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
		var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,tns.length);
			}
		for (var k=0;k<cda;k++) {
			var nomant=mimasatama.tabla.getModeloCelNom(plantillaMasaTama.tramod[k] ,"NOMBRE"); //   mimasatama.tabla.getmodelcell(plantillaMasaTama.tramod[k],1);
			if (this.tmp.tns[k][this.tmp.corder["NOMBRE"]]!=nomant){
				mimasatama.tabla.modLineaOrden(plantillaMasaTama.tramod[k],this.tmp.tns[k],this.tmp.corder,{idma:parseInt(this.tmp.selema[k].value),idat:parseInt(this.tmp.seleta[k].value)}); 
				plantillaPizzas.corregirmata([plantillaMasaTama.tramod[k].did,nomant,this.tmp.tns[k][this.tmp.corder["NOMBRE"]]]);
			}else
				mimasatama.tabla.modLinea(plantillaMasaTama.tramod[k],this.tmp.tns[k],this.tmp.corder, {idma:parseInt(this.tmp.selema[k].value),idat:parseInt(this.tmp.seleta[k].value)});
			//tr.idma=parseInt(this.tmp.selema[k].value); tr.idta=parseInt(this.tmp.seleta[k].value);
		}
		plantillaMasaTama.tramod=null;
	},
	okinsertar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
			var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,tns.length);
			}	
			for (var k=0;k<cda;k++){
				this.tmp.tns[k][0]=dat.ok[k];
				mimasatama.tabla.insOrden(this.tmp.tns[k],this.tmp.corder,{idma:parseInt(this.tmp.selema[k].value),idta:parseInt(this.tmp.seleta[k].value) });
				//tr.idma=parseInt(this.tmp.selema[k].value); tr.idta=parseInt(this.tmp.seleta[k].value);	
			}
	},
	comprobar:function() {
		var miobj=[],tns=[],lselemas=[],lseletas=[];
		for (var i=0;i<mimasatama.plaMod.length;i++){
			mimasatama.plaMod[i].masa.outerror();
			var selema=mimasatama.plaMod[i].masa.get();// mimasatama.plaMod.masa.datos.ent;
			//var idma=selema.options[selema.selectedIndex].value;
			var seleta=mimasatama.plaMod[i].tama.get(); // mimasatama.plaMod.tama.datos.ent;
			//var idta=seleta.options[sele.selectedIndex].value;
			var rm=mimasatama.tabla.tbody.rows;
			var nm=rm.length;
			for (var ii=0;ii<nm;ii++){
				var alm=mimasatama.tabla.getalmacen(rm[ii]);
				if (alm.idma==parseInt(selema.value) && alm.idta==parseInt(seleta.value))
					if (!mimasatama.modificar || !ClsTabla.did(plantillaMasaTama.tramod[i])!=ClsTabla.did(rm[ii].did)){
						mimasatama.plaMod[i].masa.seterror("Esta masa con este tamaño ya existe.");
						return;
					}
				}

			var n=[0,selema.text+"-"+seleta.text,mimasatama.plaMod[i].prebase.comprobar()];
			if (!n[2] || !(n[3]=mimasatama.plaMod[i].preing.comprobar())){
				return;
			 }
			if (mimasatama.modificar)
				miobj.push({idma:parseInt(selema.value),idta:parseInt(seleta.value),preba:n[2],preing:n[3],id:ClsTabla.did( plantillaMasaTama.tramod[i])});
			else
				miobj.push({idma:parseInt(selema.value),idta:parseInt(seleta.value),preba:n[2],preing:n[3]});
			tns.push(n);
			lselemas.push(selema);
			lseletas.push(seleta);

		}
		for (var i=0,lon=tns.length;i<lon-1;i++){
			for (var ii=i+1;ii<lon;ii++)
				if (tns[i][1]==tns[ii][1]){
					mimasatama.plaMod[i].masa.seterror("Esta masa con este tamaño está repetida.");
					return;
				}
		}
		this.tmp={tns:tns,selema:lselemas,seleta:lseletas,corder:{"NOMBRE":1,"PREBASE":2,"PREING":3}};
		mimasatama.enviar( mimasatama.modificar ? {ope:"mod",datos:miobj} : {ope:"ins",datos:miobj} );
	},
	preelim:function(objs) {
		
		var pie=plantillaPizzas.buscar("mat",objs.datos);
		if (pie.length>0){
			ClAlerta.marcar({tit:"Error",inte:"<div>Estas pizzas contienen masas-tamaños que quieres borrar. Antes de eliminar estas masas-tamaños Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join('<br>')+"</div>"});
			//hUtils.alertMensaje("Error","Estas pizzas contienen masas-tamaños que quieres borrar. Antes de eliminar estas masas-tamaños Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join('<br>'));
			//alert("Estas pizzas contienen masas-tamaños que quieres borrar. Antes de eliminar estas masas-tamaños Debes de modificar las masas-tamaños que admiten estas pizzas:\n"+pie.join(',')+"");
			return false;
		}
		
		return true;
	}
}
var mimasatama=new Controlador(plantillaMasaTama);
//var ventanaPadre;
function menuchange(){
	//console.log("opcion="+opc);
	var controles=[mipizza,mimasa,mitama,mimasatama,misal,miing];
	for (var i in controles)
		if (controles[i].ventabla.contenido.parentNode)
			controles[i].ventabla.cerrar();
	if(this.nele<1){
		mipizza.ventabla.show();
	}else if (this.nele==1){
		mimasa.ventabla.show();
		mitama.ventabla.show();
		mimasatama.ventabla.show();
	}else if (this.nele==2){
		misal.ventabla.show();
	}else if (this.nele==3){
		miing.ventabla.show();
	}else if (this.nele==4){
		actualizarTablas();
	}
}
function inicio(dpa,dat) {
	var divpizz=document.createElement("div");
	divpizz.className="marco-hijo"; //wrapper";
	
	//document.body.appendChild(divpizz);
	dpa.appendChild(divpizz);
	//ventanaPadre=new ClsVentanasTipo.principal({titulo:"Pizzas",padre:divpizz });
	divpizz.appendChild(hUtils.crearElemento({e:"div",a:{className:"color-claro"}, hijos:[
		{e:"button",a:{className:"btn btn-claro",onclick:menuchange,nele:0},inner:"Pizzas"},{e:"button",a:{className:"btn btn-claro",onclick:menuchange,nele:1},inner:"Masas-Tamaños"},{e:"button",a:{className:"btn btn-claro",onclick:menuchange,nele:2},inner:"Salsas"},{e:"button",a:{className:"btn btn-claro",onclick:menuchange,nele:3},inner:"Ingredientes"},{e:"button",a:{className:"btn btn-info",onclick:menuchange,title:"Recargar Pizzas,masas,salsas e ingredientes",nele:4},inner:"Actualizar"} ]}));
	//var menutablas=new CMenu({selec:0,opciones:["Pizzas","Masas-Tamaños","Salsas","Ingredientes"],callback:menuchange,padre:divpizz});
	mipizza.init(divpizz,ClsVentanasTipo.entera,true); //(ventanaPadre.dentro,ClsVentanasTipo.aceptar
	mimasa.init(divpizz,ClsVentanasTipo.entera,false);//(ventanaPadre.dentro,ClsVentanasTipo.titaceptar
	mitama.init(divpizz,ClsVentanasTipo.entera,false);//(ventanaPadre.dentro,ClsVentanasTipo.titaceptar
	mimasatama.init(divpizz,ClsVentanasTipo.entera,false);//(ventanaPadre.dentro,ClsVentanasTipo.titaceptar
	
	misal.init(divpizz,ClsVentanasTipo.entera,false);//(ventanaPadre.dentro,ClsVentanasTipo.titaceptar
	miing.init(divpizz,ClsVentanasTipo.entera,false);//(ventanaPadre.dentro,ClsVentanasTipo.titaceptar
	//ventanaPadre.show();
	renderizarTablas(dat);
	return divpizz;
}
function actualizarTablas(){
	hUtils.xJson({url:"/admintienda/Pizzas/verTodas",accion:"GET",formu:false}).then(function(dat){
		console.log("recibimos ok respuesta en actualizar pizzas dat=",dat);
		mipizza.tabla.vaciartabla();
		mimasa.tabla.vaciartabla();
		mitama.tabla.vaciartabla();
		mimasatama.tabla.vaciartabla();
		misal.tabla.vaciartabla();
		miing.tabla.vaciartabla();
		renderizarTablas(dat);
	}).fail(function(dat){
		console.log("recibimos error en actualizar pizzas respuesta dat="+dat);
	});
}
function renderizarTablas(dat){
				//console.log("recibimos ok respuesta dat=",dat);
				var lma=dat.masas.length,corderma={"NOMBRE":1,"DESCRIP":2},corderta={"NOMBRE":1,"NUMPERSO":2},cordermata={"NOMBRE":1,"PREBASE":2,"PREING":3},corderingsal={"NOMBRE":1,"VALOR":2},corderpiz={"NOMBRE":1,"DESCRIP":2,"SALSA":3,"QUESO":4,"INGREDIENTES":5,"MASAS":6,"NINGCO":7,"GRUPO":8,"IMAGEN":9};
				if (lma>0)
					mimasa.tabla.render(dat.masas,corderma);
				var lta=dat.tamas.length
				if (lta>0)
					mitama.tabla.render(dat.tamas,corderta)
				var lon=dat.matas.length;
				if (lma>0 && lta>0 && lon>0){
					var nomma,nomta,tr,rm;
					for (var i=0;i<lon;i++){
						for (var m=0;m<lma;m++){
							if (dat.masas[m][0]==dat.matas[i][1]){ nomma=dat.masas[m][1];break; }
						}
						for (var t=0;t<lta;t++){
							if (dat.tamas[t][0]==dat.matas[i][2]){ nomta=dat.tamas[t][1];break; }
						}
						mimasatama.tabla.nueLinea([dat.matas[i][0],nomma+"-"+nomta,dat.matas[i][3],dat.matas[i][4]],cordermata,{idma:dat.matas[i][1],idta:dat.matas[i][2] });
						//rm.idma=dat.matas[i][1];
						//rm.idta=dat.matas[i][2];
					}
					mimasatama.tabla.ordenar(1);
				}
				if (dat.ingres.length>0)
					miing.tabla.render(dat.ingres,corderingsal);
				if (dat.sal.length>0)
					misal.tabla.render(dat.sal,corderingsal);
				var lonp=dat.piz.length;
				if (lonp>0){
					var nomsal,ig,trp;
					var lons=dat.sal.length,loni=dat.ingres.length,mmtt=mimasatama.tabla;
					for (var i=0;i<lonp;i++){
						for (var s=0;s<lons;s++)
							if (dat.sal[s][0]==dat.piz[i][3]){ nomsal=dat.sal[s][1];break;}
						var dli=dat.piz[i][5],lni=dli.length,losing=[];
						for (var ni=0;ni<lni;ni++){
							ig=dli[ni];
							for (var ix=0;ix<loni;ix++)
								if (dat.ingres[ix][0]==ig){ losing.push(dat.ingres[ix][1]); break;}
						}
						dli=dat.piz[i][6];
						var lmi=dli.length,lasma=[];
						if (lmi==0) lasma.push("Todas");
						else
							for (var ni=0;ni<lmi;ni++){
								ig=dli[ni];
								for (var ix=0;ix<lon;ix++)
									if (ClsTabla.did(mmtt.tbody.rows[ix])==ig) { 
									 	lasma.push(mmtt.getModeloCelNom(mmtt.tbody.rows[ix],"NOMBRE" )); 
										break;
									}
							}
							//console.log( dat.piz[i][0],dat.piz[i][1],dat.piz[i][2],nomsal,que,losing,lasma,dat.piz[i][7],"none");
						mipizza.tabla.nueLinea([dat.piz[i][0],dat.piz[i][1],dat.piz[i][2],nomsal,dat.piz[i][4],losing,lasma,dat.piz[i][7],dat.piz[i][8],dat.piz[i][9][0] || "Añadir"],corderpiz,{idsal:dat.piz[i][3],idings:(lni==0 ? "0": dat.piz[i][5].join(",")),idmasas:(lmi==0 ? "0": dat.piz[i][6].join(",")),keyControler:dat.piz[i][10],ImgUrl:dat.piz[i][9][1] });
						/*trp.idsal=dat.piz[i][3];trp.idings=(lni==0 ? "0": dat.piz[i][5].join(","));trp.idmasas=(lmi==0 ? "0": dat.piz[i][6].join(","));
						trp.keyControler=dat.piz[i][10];
						trp.ImgUrl=dat.piz[i][9][1];*/

					}
				}
				mipizza.ventabla.show();mimasa.ventabla.show();mitama.ventabla.show();mimasatama.ventabla.show();misal.ventabla.show();miing.ventabla.show();
}


function planIngSal(op){
	this.modelo=[[Clink,"NOMBRE", "Nombre",true],[Cnumero,"VALOR", "Valor",true]];
	this.tit1=op.tit1;
	this.tit2=op.tit2;
	this.url=op.url;
	this.conclase="conclase-modpiz";
	this.tramod=null;
	this.control=op.control;
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
planIngSal.prototype.okmodificar=function(dat) {
	console.log("recibimos ok respuesta dat=",dat);
	var cda=dat.ok.length;
		if (dat.key==0){
			ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
			//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
			this.tmp.tns.splice(cda-1,tns.length);
		}	
	for (var k=0;k<cda;k++) {	
		var nomant=this.control.tabla.getModeloCelNom(this.tramod[k] ,"NOMBRE");  //this.control.tabla.getmodelcell(this.tramod[k],1);	
		if (this.tmp.tns[k][this.tmp.corder["NOMBRE"]]!=nomant){
			this.control.tabla.modLineaOrden(this.tramod[k],this.tmp.tns[k],this.tmp.corder);
			plantillaPizzas.corregirIngSal(this.tmp.tip,ClsTabla.did(this.tramod[k]),nomant,this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
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
planIngSal.prototype.comprobar=function(){
	var miobj=[],tns=[];
	for (var i=0;i<this.control.plaMod.length;i++){
		var n=[0,this.control.plaMod[i].nombre.comprobar()];
		if (!n[1] || !(n[2]=this.control.plaMod[i].valor.comprobar()))
			return;
		if (this.control.tabla.existe(this.tramod ? this.tramod[i] : null,n[1])){
			this.control.seterror((this.control==miing ? "Ingrediente" : "Salsa")+" ya existe");
			return;
		}
		if (this.control.modificar)
			miobj.push({nombre:n[1],valor:n[2],id:ClsTabla.did(this.tramod[i])} );
		else
			miobj.push({nombre:n[1],valor:n[2]} );
		tns.push(n);
	}
	var tip=(this.control==miing ? "ing" : "sal");	
	this.tmp={tns:tns,tip:tip,corder:{"NOMBRE":1,"VALOR":2}};
	this.control.enviar(this.control.modificar ? {ope:"mod",tipo:tip,datos:miobj} : {ope:"ins",tipo:tip,datos:miobj});
}
var plantillaIng=new planIngSal( {
	tit1:"INGREDIENTES",
	tit2:"Ingrediente",
	url:"/admintienda/Pizzas/Ingres",
	control:null
});
var miing=new Controlador(plantillaIng);
plantillaIng.control=miing;
plantillaIng.preelim=function(objs) {
	var pie=plantillaPizzas.buscar("ing",objs.datos);
	if (pie.length>0){
		ClAlerta.marcar({tit:"Advertencia",inte:"<div>Estas pizzas contienen alguno de los ingredientes que quieres borrar. Antes de eliminar estos ingredientes Debes de modificar los ingredientes de estas pizzas:\n"+pie.join('<br>')+"</div>"});
		//hUtils.alertMensaje("Advertencia","Estas pizzas contienen alguno de los ingredientes que quieres borrar. Antes de eliminar estos ingredientes Debes de modificar los ingredientes de estas pizzas:\n"+pie.join('<br>'));
		//alert("Estas pizzas contienen alguno de los ingredientes que quieres borrar. Antes de eliminar estos ingredientes Debes de modificar los ingredientes de estas pizzas:\n"+pie.join(',')+"");
		return false;

	}
	//alert("preelim ingredientes");
	objs.tipo="ing";
	return true;
}
var plantillaSal=new planIngSal( {
	tit1:"SALSAS",
	tit2:"Salsa",
	url:"/admintienda/Pizzas/Salsas",
	control:null
});
var misal=new Controlador(plantillaSal);
plantillaSal.control=misal;
plantillaSal.preelim=function(objs) {
	var pie=plantillaPizzas.buscar("sal",objs.datos);
	if (pie.length>0){
		ClAlerta.marcar({tit:"Advertencia",inte:"<div>Estas pizzas contienen alguna de las salsas que quieres borrar. Antes de eliminar estas salsas debes de modificar la salsa de estas pizzas:<br>"+pie.join('<br>')+"</div>"});
		//hUtils.alertMensaje("Advertencia","Estas pizzas contienen alguna de las salsas que quieres borrar. Antes de eliminar estas salsas debes de modificar la salsa de estas pizzas:<br>"+pie.join('<br>'));
		//alert("Estas pizzas contienen alguna de las salsas que quieres borrar. Antes de eliminar estas salsas Debes de modificar la salsa de estas pizzas:\n"+pie.join(',')+"");
		return false;
	}
	//alert("preelim salsas");
	objs.tipo="sal";
	return true;
}

//var objImagen=null;
function cambiarImagen(tr,propalmacen,tit,nomima,nid){ //cambiarImagen(tr,tit,lim,nomima,cb){
	FileimgApi.imagen(null,propalmacen,"(Pizza) "+tit,100,nomima,function(acc,obj){ 
		if (acc=="nueva"){
			mipizza.tabla.setModeloCelNom(tr,"IMAGEN",obj.nombre);
			mipizza.tabla.setalmacen(tr,{ImgUrl:obj.url});
			FileimgApi.planImagenes.add_bloq_img("piz",obj.nombre,obj.url,mipizza.tabla.getModeloCelNom(tr,"NOMBRE"),null,nid);
			//td.parentNode.ImgUrl=obj.url;
		}else{
			mipizza.tabla.setModeloCelNom(tr,"IMAGEN","Añadir");
			mipizza.tabla.setalmacen(tr,{ImgUrl:null});
			FileimgApi.planImagenes.eliminar_bloq_img("piz",nid);
			//td.parentNode.ImgUrl=null;
		}
	 });
	//FileimgApi.imagen(null,tr,tit,lim,nomima,cb); //,tr.ImgUrl);
}
var plantillaPizzas={
	modelo:[[Clink,"NOMBRE", "Pizza",true],[Ctexto,"DESCRIP", "Descripción",true],[Ctexto,"SALSA", "Salsa",true],[Cbool,"QUESO", "Queso",true],[Clista,"INGREDIENTES", "Ingredientes",true],[Clista,"MASAS", "Masas",true],[Cnumero, "NINGCO", "nº Ing. a Cob."],[Ctexto,"GRUPO", "Grupo",true],[Cboton,"IMAGEN", "Imágen",true]],
	tit1:"PIZZAS",
	tit2:"Pizza",
	conclase:"conclase-modpiz",
	url:"/admintienda/Pizzas/espe",
	tramod:null,
	listagrupo:["0"],
	nuevoplamod:function (aux,npla) {
		var objpla={
			nombre:new ClabInput({la:"Nombre",lon:80,padre:aux}),
			descrip:new ClabInput({la:"Descripción",lon:200,padre:aux,area:true}),
			salsa:new ClabSelect({la:"Salsa",padre:aux}),
			grupo:new ClabInpSel({la:"Grupo",lon:30,padre:aux,control:mipizza,planti:plantillaPizzas}),// ClabInput({la:"Grupo",lon:80,padre:aux}),
			nele:npla
		}
		//objpla.grupo.pintarlista(plantillaPizzas);
		var aux2=document.createElement("div");
		aux2.className="secundario";
		objpla.queso=new CRadio({opciones:["Con queso","Sin queso"],selec:0,padre:aux2});
		aux.appendChild(aux2);

		objpla.ingres=new ClabLista({la:"Ingredientes",padre:aux});
		objpla.numing=new ClabSelect({la:"Cobrar ingredientes a partir de nº",padre:aux});
		objpla.numing.opciones([[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[7,7],[8,8],[9,9]]);
		aux2=document.createElement("div");
		var auxselche=new ClabCheck({la:"Masas",padre:aux2});
		objpla.masas={ selche:auxselche, todas:new CRadio({opciones:["Todas","Selección"],selec:0,padre:auxselche.conte,callback:this.selmasas,dat:auxselche.datos}) };
		objpla.masas.selche.datos.ent.style.display="none"; //conte.style.display="none";
		objpla.grupo.set("0");
		aux.appendChild(aux2);
		return [objpla,objpla.nombre.datos.ent];
	},
	clickCelda:function(td){
		if (td.nom=="IMAGEN") { // cellIndex==9){
			cambiarImagen(td.td.parentNode,mipizza.tabla.getalmacen(td.td.parentNode),mipizza.tabla.getModeloCelNom(td.td.parentNode,"NOMBRE"),mipizza.tabla.getModeloCelNom(td.td.parentNode,"IMAGEN"),ClsTabla.did(td.td.parentNode));

			/*cambiarImagen(mipizza.tabla.getalmacen(td.td.parentNode),mipizza.tabla.getModeloCelNom(td.td.parentNode,"NOMBRE"),100,mipizza.tabla.getModeloCelNom(td.td.parentNode,"IMAGEN"),function(acc,obj){ 
				if (acc=="nueva"){
					Cboton.set(td.td,obj.nombre);
					mipizza.tabla.setalmacen(td.td.parentNode,{ImgUrl:obj.url});
					FileimgApi.planImagenes.add_bloq_img("piz",obj.nombre,obj.url,mipizza.tabla.getModeloCelNom(td.td.parentNode,"NOMBRE"),null,ClsTabla.did(td.td.parentNode));
					//td.parentNode.ImgUrl=obj.url;
				}else{
					Cboton.set(td.td,"Añadir");
					mipizza.tabla.setalmacen(td.td.parentNode,{ImgUrl:null});
					FileimgApi.planImagenes.eliminar_bloq_img("piz",ClsTabla.did(td.td.parentNode));
					//td.parentNode.ImgUrl=null;
				}
			 });*/
		}
	},
	selmasas:function(nele,ele){
			if (nele==1)
				ele.dat.ent.style.display="block";//ele.dat.masas.selche.conte.style.display="block";
			else
				ele.dat.ent.style.display="none";//ele.dat.masas.selche.conte.style.display="none";
	},
	corregirIngSal:function(tipo,lid,ant,nue){
		var ptbr=mipizza.tabla.tbody.rows;
		var ntr=ptbr.length;
		if (tipo=="ing"){
			for (var p=0;p<ntr;p++){
				var alm=mipizza.tabla.getalmacen(ptbr[p]);
				if (alm.idings.indexOf(lid)>-1 ){
					var arr=mipizza.tabla.getModeloCelNom(ptbr[p],"INGREDIENTES"); //  mipizza.tabla.getmodelcell(ptbr[p],5);
					for (var i=0,lon2=arr.length;i<lon2;i++)
						if (arr[i]==ant) arr[i]=nue;
					//arr[arr.indexOf(lid)]=nue;
					mipizza.tabla.setModeloCelNom(ptbr[p],"INGREDIENTES",arr);
					//mipizza.tabla.modelo[4].set(ptbr[p].cells[5],arr);
				}
			}
		}else if (tipo=="sal"){
			for (var p=0;p<ntr;p++)
				if (mipizza.tabla.getalmacen(ptbr[p]).idsal==lid){
					mipizza.tabla.setModeloCelNom(ptbr[p],"SALSA",nue);
					//mipizza.tabla.modelo[2].set(ptbr[p].cells[3],nue);
				}
		}
	},
	corregirmata:function(lid){
		var ptbr=mipizza.tabla.tbody.rows;
		var ntr=ptbr.length;
		var lon=lid.length;
		for (var p=0;p<ntr;p++) {
			var arr=false,alm=mipizza.tabla.getalmacen(ptbr[p]);
			for (var i=0;i<lon;i++)
				if (alm.idmasas.indexOf(lid[i][0])>-1){
					if (!arr){
					 	arr= mipizza.tabla.getModeloCelNom(ptbr[p],"MASAS"); // mipizza.tabla.getmodelcell(ptbr[p],6);
					 	var pun=[];
					 }
					 pun.push([arr.indexOf(lid[i][1]),i]);
				}
			if (arr){
				for (var i=0,lon2=pun.length;i<lon2;i++)
					arr[pun[i][0]]=lid[pun[i][2]];
				mipizza.tabla.setModeloCelNom(ptbr[p], "MASAS",arr);
				//mipizza.tabla.modelo[6].set(ptbr[p].cells[6],arr);
			}
		}

	},
	buscar:function(tipo,lid){
		var ptbr=mipizza.tabla.tbody.rows;
		var ntr=ptbr.length;
		var encon=[]
		var lon=lid.length;
		if (tipo=="ing"){
			var endid=[];
			for (var i=0;i<lon;i++)
				for (var p=0;p<ntr;p++){
					var cdid=ClsTabla.did(ptbr[p]);
					if (mipizza.tabla.getalmacen(ptbr[p]).idings.indexOf(lid[i])>-1  && endid.indexOf(cdid)==-1 ){
						encon.push(mipizza.tabla.getModeloCelNom(ptbr[p],"NOMBRE"));// getmodelcell(ptbr[p],1));
						endid.push(cdid);
					}
				}
		}else if (tipo=="sal"){
			for (var i=0;i<lon;i++)
				for (var p=0;p<ntr;p++)
					if (mipizza.tabla.getalmacen(ptbr[p]).idsal==lid[i])
						encon.push(mipizza.tabla.getModeloCelNom(ptbr[p],"NOMBRE"));// getmodelcell(ptbr[p],1));
		}else if (tipo=="mat"){
			var endid=[];
			for (var i=0;i<lon;i++)
				for (var p=0;p<ntr;p++){
					var cdid=ClsTabla.did(ptbr[p]);
					if (mipizza.tabla.getalmacen(ptbr[p]).idmasas.indexOf(lid[i])>-1 && endid.indexOf(cdid)==-1){
						encon.push(mipizza.tabla.getModeloCelNom(ptbr[p],"NOMBRE"));// getmodelcell(ptbr[p],1));
						endid.push(cdid);
					}
				}
		}
		return encon;
	},
	rellenar:function(tr,k){
		var rm=misal.tabla.tbody.rows;
		var nm=rm.length;
		if (nm==0) return 1;
		var sele=mipizza.plaMod[k].salsa.datos.ent;
		sele.options.length=0; //option=[];
		var ix=0, tralm= (tr ? mipizza.tabla.getalmacen(tr): null);
		var s= (tr ? tralm.idsal : false);
		for (var i=0;i<nm;i++){
			var cdid=ClsTabla.did(rm[i]);
			sele.options[i]=new Option(misal.tabla.getModeloCelNom(rm[i],"NOMBRE"), cdid);//  getmodelcell(rm[i],1),rm[i].did);
			if (s && s===cdid){
				ix=i; s=false;
			}
		}
		sele.selectedIndex=ix;
		rm=miing.tabla.tbody.rows;
		nm=rm.length;
		if (nm==0) return 2;
		sele=[];
		for (var i=0;i<nm;i++){
			sele.push([miing.tabla.getModeloCelNom(rm[i],"NOMBRE"),ClsTabla.did(rm[i])]);// getmodelcell(rm[i],1),rm[i].did]);
		}
		mipizza.plaMod[k].ingres.seteles(sele);
		if (tr){
			sele=[];
			mipizza.plaMod[k].queso.seleccionar((mipizza.tabla.getModeloCelNom(tr,"QUESO") ? 0 : 1));
			mipizza.plaMod[k].numing.datos.ent.selectedIndex=parseInt(mipizza.tabla.getModeloCelNom(tr,"NINGCO"),10);// getmodelcell(tr,7));
			if (tralm.idings!="0"){
				var coning=tralm.idings.split(",");
				for (var i=0,lon=coning.length;i<lon;i++)
					for (var ig=0;ig<nm;ig++){
						if (ClsTabla.did(rm[ig])==coning[i]){
							sele.push([miing.tabla.getModeloCelNom(rm[ig],"NOMBRE"),coning[i]]);
							break;
						}
					}
				}
				mipizza.plaMod[k].ingres.setconte(sele);
				if (tralm.idmasas!="0"){
					mipizza.plaMod[k].masas.todas.seleccionar(1);
					mipizza.plaMod[k].masas.selche.datos.ent.style.display="block";//this.masas.selche.conte.style.display="block";
				}else{
					mipizza.plaMod[k].masas.todas.seleccionar(0);
					mipizza.plaMod[k].masas.selche.datos.ent.style.display="none";
				}
			
		} else {
					mipizza.plaMod[k].ingres.datos.contenedor.innerHTML="";
					mipizza.plaMod[k].queso.seleccionar(0); 
					mipizza.plaMod[k].numing.datos.ent.selectedIndex=0; 
					mipizza.plaMod[k].masas.todas.seleccionar(0);
					mipizza.plaMod[k].masas.selche.datos.ent.style.display="none";//this.masas.selche.conte.style.display="none";
		}
		rm=mimasatama.tabla.tbody.rows;
		console.log("rm="+rm+", lon="+rm.length);
		nm=rm.length;
		if (nm==0) return 3;
		sele=[];
		var se=[];

		for (var i=0;i<nm;i++){
			sele.push([mimasatama.tabla.getModeloCelNom(rm[i],"NOMBRE"),ClsTabla.did(rm[i])]);
			if (tr && tralm.idmasas.indexOf(ClsTabla.did(rm[i]))>-1 )
				se.push(true);
			else
				se.push(false);
		}
		mipizza.plaMod[k].masas.selche.seteles(sele,se);
		return 4;
	},
	modificar:function(trs){
		this.tramod=trs;
		ClabInpSel.prototype.hacerlistagrupo(mipizza.tabla.tbody.rows,plantillaPizzas,mipizza.tabla.nomcolum["GRUPO"]);
		for (var i=0,lon=trs.length;i<lon;i++){
			if (i>0){
				mipizza.nuevaPlantMod();
			}else
				mipizza.plaMod[0].grupo.pintarlista();
			this.rellenar(trs[i],i);
			console.log("nombre pizza="+mipizza.tabla.getModeloCelNom(trs[i],"NOMBRE")); // getmodelcell(trs[i],1));
			mipizza.plaMod[i].nombre.set(mipizza.tabla.getModeloCelNom(trs[i],"NOMBRE"));
			mipizza.plaMod[i].descrip.set(mipizza.tabla.getModeloCelNom(trs[i],"DESCRIP")); // getmodelcell(trs[i],2));
			mipizza.plaMod[i].grupo.set(mipizza.tabla.getModeloCelNom(trs[i],"GRUPO")); //getmodelcell(trs[i],8));
		}
		
		
	},
	limpiar:function() {
		var va=this.rellenar(false,0);
		if (va<4){
			console.log("va="+va);
			ClAlerta.marcar({tit:"Error",inte:"<div>Para insertar una nueva pizza debe de existir ingredientes,salsas,masas y tamaños.</div>"});
			//hUtils.alertMensaje("Error","Para insertar una nueva pizza debe de existir ingredientes,salsas,masas y tamaños.");
			//alert("Para insertar una nueva pizza debe de existir ingredientes,salsas,masas y tamaños.");
			return false;
		}
		ClabInpSel.prototype.hacerlistagrupo(mipizza.tabla.tbody.rows,plantillaPizzas,mipizza.tabla.nomcolum["GRUPO"]);
		mipizza.plaMod[0].nombre.set("");
		mipizza.plaMod[0].descrip.set("");
		mipizza.plaMod[0].grupo.set("0");
		mipizza.plaMod[0].grupo.pintarlista();
		
		return true;
	},
	okmodificar:function(dat){
		console.log("recibimos ok respuesta dat=",dat);
		var cda=dat.ok.length;
		if (dat.key==0){
			ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
			//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
			this.tmp.tns.splice(cda-1,this.tmp.tns.length);
		}
		for (var k=0;k<cda;k++) {
			var alm={idsal:parseInt(this.tmp.selesal[k].value,10),idings:(this.tmp.idings[k].length==0 ? "0": this.tmp.idings[k].join(",")),idmasas:(this.tmp.idsma[k].length==0 ? "0": this.tmp.idsma[k].join(",")) };
			if ( mipizza.tabla.getModeloCelNom(this.tramod[k] ,"NOMBRE")!=this.tmp.tns[k][this.tmp.corder["NOMBRE"]]){
				mipizza.tabla.modLineaOrden(this.tramod[k],this.tmp.tns[k],this.tmp.corder,alm);
				FileimgApi.planImagenes.cambiar_bloq_img("piz",ClsTabla.did(this.tramod[k]),null,this.tmp.tns[k][this.tmp.corder["NOMBRE"]]);
			}else
				mipizza.tabla.modLinea(this.tramod[k],this.tmp.tns[k],this.tmp.corder,alm);
			//tr.idsal=parseInt(this.tmp.selesal[k].value);
			//tr.idings=(this.tmp.idings[k].length==0 ? "0": this.tmp.idings[k].join(","));
			//tr.idmasas=(this.tmp.idsma[k].length==0 ? "0": this.tmp.idsma[k].join(","));
		}
		this.tramod=null;
	},
	okinsertar:function(dat) {
		console.log("recibimos ok respuesta dat=",dat);
			var cda=dat.ok.length;
			if (dat.key==0){
				ClAlerta.marcar({tit:"Error",inte:"<div>Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.</div>"});
				//hUtils.alertMensaje("Error", "Se ha producido un error ("+dat.menerr+") y sólo se ha podido insertar los "+cda+" primeros.");
				this.tmp.tns.splice(cda-1,this.tmp.tns.length);
			}
			for (var k=0;k<cda;k++){
				this.tmp.tns[k][0]=dat.ok[k][0];
				mipizza.tabla.insOrden(this.tmp.tns[k],this.tmp.corder,{idsal:parseInt(this.tmp.selesal[k].value,10),idings:(this.tmp.idings[k].length==0 ? "0" : this.tmp.idings[k].join(",")),idmasas:(this.tmp.idsma[k].length==0 ? "0": this.tmp.idsma[k].join(",")),keyControler:dat.ok[k][1] }); //nueLinea(n);
				/*tr.idsal=parseInt(this.tmp.selesal[k].value);
				tr.idings=(this.tmp.idings[k].length==0 ? "0" : this.tmp.idings[k].join(","));
				tr.idmasas=(this.tmp.idsma[k].length==0 ? "0": this.tmp.idsma[k].join(","));
				tr.keyControler=dat.ok[k][1]; //key[k][1];*/
			}

	},
	comprobar:function() {
		var miobj=[],tns=[],lselesals=[],lidsma=[],lidings=[];
		for (var i=0;i<mipizza.plaMod.length;i++){
			var selesal=mipizza.plaMod[i].salsa.get();
			if (mipizza.plaMod[i].masas.todas.sel==0){
				var ma=["Todas"];
				var idsma=[];
			}else{
				var ma=mipizza.plaMod[i].masas.selche.getnoms();
				var idsma=mipizza.plaMod[i].masas.selche.get();
			}
			//console.log("mipizza.plaMod "+i+"=",mipizza.plaMod[i]);
			//console.log("tramo=",this.tramod);
			var n=[0,mipizza.plaMod[i].nombre.comprobar(),null,selesal.text, mipizza.plaMod[i].queso.sel==0, mipizza.plaMod[i].ingres.getnoms(),ma,parseInt(mipizza.plaMod[i].numing.get().value,10),null,mipizza.modificar ? Cboton.get(this.tramod[i].cells[9]) : "Añadir"];
			//(this.tramod[i] && this.tramod[i].keyImg==null ? "Añadir" : mipizza.tabla.getmodelcell(this.tramod[i],8))
			if (!n[1] || !(n[2]=mipizza.plaMod[i].descrip.comprobar()) || !(n[8]=mipizza.plaMod[i].grupo.comprobar()))
				return
			if (mipizza.tabla.existe(this.tramod ? this.tramod[i] : null,n[1])){
				mipizza.seterror("Error:Pizza "+n[1]+" ya existe");
				//alert("Pizza "+n[1]+" ya existe");
				return;
			}
			var idings=mipizza.plaMod[i].ingres.get();
			if (mipizza.modificar)
				miobj.push({idsal:parseInt(selesal.value),nuing:n[7],nombre:n[1],descrip:n[2], queso:n[4] ? 1: 0,ingres:idings,masas:idsma,grupo:n[8],id:this.tramod[i].did});
			else
				miobj.push({idsal:parseInt(selesal.value),nuing:n[7],nombre:n[1],descrip:n[2], queso:n[4] ? 1: 0,ingres:idings,masas:idsma,grupo:n[8]});
			tns.push(n);
			lselesals.push(selesal);
			lidsma.push(idsma);
			lidings.push(idings);
		}
		this.tmp={tns:tns,idings:lidings,selesal:lselesals,idsma:lidsma,corder:{"NOMBRE":1,"DESCRIP":2,"SALSA":3,"QUESO":4,"INGREDIENTES":5,"MASAS":6,"NINGCO":7,"GRUPO":8,"IMAGEN":9}};
		mipizza.enviar( mipizza.modificar ? {ope:"mod",datos:miobj} : {ope:"ins",datos:miobj} );
	},
	postelim:function(okel,lids){
		if (okel){
			for (var i=0;i<lids.length;i++)
				FileimgApi.planImagenes.eliminar_bloq_img("piz",lids[i]);
		}
	}
}
var mipizza=new Controlador(plantillaPizzas);
function datosPizzas() {
	var trp=mipizza.tabla.tbody.rows;
	var lo=trp.length;
	var hpi=[];
	for (var i=0;i<lo;i++)
		hpi.push([mipizza.tabla.getModeloCelNom(trp[i] ,"NOMBRE"),ClsTabla.did(trp[i])]);
	trp=mitama.tabla.tbody.rows;
	lo=trp.length;
	var hta=[];
	for (var i=0;i<lo;i++)
		hta.push([mitama.tabla.getModeloCelNom(trp[i],"NOMBRE"),ClsTabla.did(trp[i])]);
	trp=mimasa.tabla.tbody.rows;
	lo=trp.length;
	var hma=[];
	for (var i=0;i<lo;i++)
		hma.push([mimasa.tabla.getModeloCelNom(trp[i],"NOMBRE"),ClsTabla.did(trp[i])]);
	return {piz:hpi,masas:hma,tamas:hta};
}
function dameImagenes(){
	var trp=mipizza.tabla.tbody.rows;
	var lo=trp.length;
	var hpi=[];
	for (var i=0;i<lo;i++){
		var alm=mipizza.tabla.getalmacen(trp[i]);
		if (alm && alm.ImgUrl)
			hpi.push([mipizza.tabla.getModeloCelNom(trp[i] ,"NOMBRE"),ClsTabla.did(trp[i]),alm.ImgUrl,mipizza.tabla.getModeloCelNom(trp[i],"IMAGEN")]);
	}
	return hpi;
}
function cambiar_Imagen(nid){
	var tr=mipizza.tabla.getdidtr(nid);
	if (FileimgApi.planImagenes.modo_sel){
			var nombreori=mipizza.tabla.getModeloCelNom(tr.tr,"IMAGEN");
			return {nomimaorigen:nombreori,keyControler:tr.almacen.keyControler,nomarti:"(Pizza) "+mipizza.tabla.getModeloCelNom(tr.tr,"NOMBRE"),nombre:nombreori,url:tr.almacen.ImgUrl};
		}
	cambiarImagen(tr.tr,tr.almacen,mipizza.tabla.getModeloCelNom(tr.tr,"NOMBRE"),mipizza.tabla.getModeloCelNom(tr.tr,"IMAGEN"),nid);
	/*cambiarImagen(tr.almacen,mipizza.tabla.getModeloCelNom(tr.tr,"NOMBRE"),100,mipizza.tabla.getModeloCelNom(tr.tr,"IMAGEN"),function(acc,obj){ 
				if (acc=="nueva"){
					mipizza.tabla.setModeloCelNom(tr.tr,"IMAGEN",obj.nombre);
					mipizza.tabla.setalmacen(tr.tr,{ImgUrl:obj.url});
					FileimgApi.planImagenes.add_bloq_img("piz",obj.nombre,obj.url,mipizza.tabla.getModeloCelNom(tr.tr,"NOMBRE"),null,nid);
					//td.parentNode.ImgUrl=obj.url;
				}else{
					mipizza.tabla.setModeloCelNom(tr.tr,"IMAGEN","Añadir");
					mipizza.tabla.setalmacen(tr.tr,{ImgUrl:null});
					FileimgApi.planImagenes.eliminar_bloq_img("piz",nid);
					//td.parentNode.ImgUrl=null;
				}
			 });*/
}
function numRegistros() {
	return mipizza.tabla.tbody.rows.length +  mimasa.tabla.tbody.rows.length + mitama.tabla.tbody.rows.length + miing.tabla.tbody.rows.length + misal.tabla.tbody.rows.length;

}
return {inicio:inicio,datosPiz:datosPizzas,numRegistros:numRegistros,actualizar:actualizarTablas,dameImagenes:dameImagenes,cambiar_Imagen:cambiar_Imagen}; //{masa:mimasa,tama:mitama,masatama:mimasatama};

})();