"use strict";
var Clpedart=(function() {
	//var principal={};
	var datosart,pedido_act,almacen_act={},numdid_act=0;
	function articulo(tp,ofe,can){
		this.tipoart=tp;
		this.oferta=ofe;
		this.cantidad=can;
		this.elprenocalc=0;
		this.tdpre=null;
	}
	articulo.prototype.poneroferta=function(nofe,iof,iofdet,indp,pre){
		this.oferta={
			numofer:nofe,
			idofer:iof,
			idoferdet:iofdet,
			indpro:indp,
			precio:parseFloat(Number(pre).toFixed(2)) 
		}
	}
	articulo.prototype.nombre_oferta=function(){
		if (this.oferta==null) //"null")
			return "Sin oferta!!";

		var lon=datosart.ofer.length;
		for (var i=0;i<lon;i++)
			if (datosart.ofer[i][0]==this.oferta.idofer) return datosart.ofer[i][1];
		return "Oferta desconocida!!";
	}
	articulo.prototype.copiaroferta=function(art){
		if (art.oferta!=null){
			this.oferta={
				numofer:art.oferta.numofer,
				idofer:art.oferta.idofer,
				idoferdet:art.oferta.idoferdet,
				indpro:art.oferta.indpro,
				precio:art.oferta.precio
			}
			return true;
		}
		return false;
	}
	articulo.prototype.quitaroferta=function(trli) {
		this.oferta=null;
		this.precio();
		this.tdpre.innerHTML=Number(this.elprenocalc).toFixed(2);
		trli.className="";
		/*if (this.trofer){

			this.trofer.parentNode.removeChild(this.trofer);
			this.trofer.className=null;
			this.trofer=null;
		}*/
		 
		
	}
	articulo.prototype.preciounitario=function() {
		return this.elprenocalc/this.cantidad;
	}
	function trModart(tr){
		return function(ev){
			ClPrin.modificar(pedido_act.articulo(tr),tr);
		}
	}
	function trElimArt(tr){
		return function(ev){
			ClPrin.eliminarart(pedido_act.articulo(tr),tr);
		}
	}
	function lalineatr(art,c,nom,pre,cltr) {
		var eles={};
		var tr=hUtils.crearElemento({e:"tr",a:{className:cltr},hijos:[{e:"td",a:{width:"70%"},hijos:[{e:"a",did:"a1",a:{title:"Modificar artículo"},inner:c+" "+nom}]},{e:"td",did:"tdpre",a:{width:"10%"},c:{textAlign:"right"},inner:fontPrecio(Number(pre).toFixed(2))},{e:"td",a:{width:"20%"},c:{textAlign:"center"},hijos:[{e:"button",did:"a2",a:{title:"Eliminar artículo"},inner:"<span  class='icon-remove'></span>"}]}]},eles);
		eles.a1.addEventListener("click",trModart(tr),false);
		eles.a2.addEventListener("click",trElimArt(tr),false);
		//eles.a1.linea=eles.a2.linea=tr;
		return [tr,eles.tdpre];
	}
	function ClaseMitad(espe,sal,ings,q){
		this.padre=null;
		this.queso=q;
		this.indespe=espe;
		this.indsal=sal;
		this.espe=espe!==null ? datosart.piz[espe] :  null;
		this.salsa=sal!==null ? datosart.sal[sal] : null;
		this.ings=ings;
	}
	ClaseMitad.prototype.clonar=function() {
		return new ClaseMitad(this.indespe,this.indsal,this.ings,this.queso);
	}
	ClaseMitad.prototype.nombre=function(){
		var tex=(this.espe !==null ? this.espe[1] : "Al Gusto")+( this.salsa!==null ? " Salsa "+this.salsa[1] : " Sin Salsa")+", "+(this.queso ? " queso mozarella" : "sin queso");
		var lon=this.ings.length;
		for (var i=0;i<lon;i++)
			tex+=", "+this.ings[i][1];
		return tex;
	}
	ClaseMitad.prototype.precio=function() {
		var preing=this.padre.mata[4];
		var pre=this.salsa ? this.salsa[2]*preing : 0;
		var lon=lon=this.ings.length;
		for (var i=0;i<lon;i++)
			pre+=this.ings[i][2]*preing;
		return pre;
	}
	ClaseMitad.prototype.numingres=function() {
		var lon=this.ings.length;
		var ni=this.salsa ? this.salsa[2] : 0; //0;
		for (var i=0;i<lon;i++)
			ni+=this.ings[i][2];
		return ni;
	}
	function ClasePizza(m1,m2,indmata,can){
		if (arguments.length<2){
			articulo.call(this,0,m1.oferta,m1.det.canti);
			var ling=[];
			for (var i=0,lon=m1.det.mitades[0].ings.length;i<lon;i++)
				ling.push(datosart.ingres[dameart(datosart.ingres,m1.det.mitades[0].ings[i] )]);
			var mm1=new ClaseMitad(m1.det.mitades[0].espe ? dameart(datosart.piz,m1.det.mitades[0].espe) : null,
				m1.det.mitades[0].salsa ? dameart(datosart.sal,m1.det.mitades[0].salsa) : null ,ling,m1.det.mitades[0].queso);
			if (m1.det.mitades[1]){
				ling=[];
				for (var i=0,lon=m1.det.mitades[1].ings.length;i<lon;i++)
					ling.push(datosart.ingres[dameart(datosart.ingres,m1.det.mitades[1].ings[i] )]);
				this.mitades=[mm1,new ClaseMitad(m1.det.mitades[1].espe ? dameart(datosart.piz,m1.det.mitades[1].espe) : null,m1.det.mitades[1].salsa ? dameart(datosart.sal,m1.det.mitades[1].salsa) : null ,ling,m1.det.mitades[1].queso)];
				this.mitades[1].padre=this;
			}else
				this.mitades=[mm1,null];
			mm1.padre=this;
			this.indmata=dameart(datosart.matas,m1.det.mata);
		}else {
			articulo.call(this,0,null,can);
			this.mitades=[m1,m2];
			this.indmata=indmata;
			m1.padre=this;
			if (m2!=null) m2.padre=this;
		}
		
		//this.tipoart=0;
		//this.cantidad=1;
		
		this.mata=datosart.matas[this.indmata];
		for (var i=0,lon=datosart.masas.length;i<lon;i++)
			if (datosart.masas[i][0]==this.mata[1]){
				this.masa=datosart.masas[i];
				break;
			}
		for (var i=0,lon=datosart.tamas.length;i<lon;i++)
			if (datosart.tamas[i][0]==this.mata[2]){
				this.tama=datosart.tamas[i];
				break;
		}
		
		this.precio();
	}
	/*function ClasePizza2(m1,m2,indmata,can){
		if (arguments.length<2){
			articulo.call(this,0,m1.oferta,m1.det.canti);
			var ling=[];
			for (var i=0,lon=m1.det.mitades[0].ings.length;i<lon;i++)
				ling.push(datosart.ingres[m1.det.mitades[0].ings[i]]);
			var mm1=new ClaseMitad(m1.det.mitades[0].espe,m1.det.mitades[0].salsa,ling,m1.det.mitades[0].queso);
			if (m1.det.mitades[1]){
				ling=[];
				for (var i=0,lon=m1.det.mitades[1].ings.length;i<lon;i++)
					ling.push(datosart.ingres[m1.det.mitades[1].ings[i]]);
				this.mitades=[mm1,new ClaseMitad(m1.det.mitades[1].espe,m1.det.mitades[1].salsa,ling,m1.det.mitades[1].queso)];
				this.mitades[1].padre=this;
			}else
				this.mitades=[mm1,null];
			mm1.padre=this;
			this.indmata=m1.det.indmata;


		}else {
			articulo.call(this,0,null,can);
			this.mitades=[m1,m2];
			this.indmata=indmata;
			m1.padre=this;
			if (m2!=null) m2.padre=this;
		}
		
		//this.tipoart=0;
		//this.cantidad=1;
		
		this.mata=datosart.matas[this.indmata];
		for (var i=0,lon=datosart.masas.length;i<lon;i++)
			if (datosart.masas[i][0]==this.mata[1]){
				this.masa=datosart.masas[i];
				break;
			}
		for (var i=0,lon=datosart.tamas.length;i<lon;i++)
			if (datosart.tamas[i][0]==this.mata[2]){
				this.tama=datosart.tamas[i];
				break;
		}
		
		this.precio();
	}*/
	ClasePizza.prototype=Object.create ? Object.create(articulo.prototype) : new articulo;
	ClasePizza.prototype.clonar=function(can){
		if (this.mitades[1]!=null)
			var m2=this.mitades[1].clonar();
		else
			var m2=null;
		return new ClasePizza(this.mitades[0].clonar(),m2,this.indmata,can);
	}
	ClasePizza.prototype.nomtama=function() {
		return "Pizza "+this.tama[1]+" "+this.masa[1];
	}
	ClasePizza.prototype.nommitades=function() {
		var tex="";
		if (this.mitades[0]!=null && this.mitades[1]){
			tex+="1ª Mitad: "+this.mitades[0].nombre();
			tex+="<br>2ª Mitad: "+this.mitades[1].nombre();
		}else{
			tex+=this.mitades[0].nombre();
		}
		return tex;
	}
	ClasePizza.prototype.nombre=function() {
		var tex="Pizza "+this.tama[1]+" "+this.masa[1]+" "; 
		if (this.mitades[0]!=null && this.mitades[1]){
			tex+="1ª Mitad: "+(this.mitades[0].espe !==null ? this.mitades[0].espe[1] : "Al Gusto");
			tex+="<br>2ª Mitad: "+(this.mitades[1].espe !==null ? this.mitades[1].espe[1] : "Al Gusto");
		}else{
			tex+=(this.mitades[0].espe !==null ? this.mitades[0].espe[1] : "Al Gusto");
		}
		return tex;
	}
	ClasePizza.prototype.numingres=function(){
		if (this.mitades[1]!=null){
			return (this.mitades[0].numingres()+this.mitades[1].numingres())/2;
		}else
			return this.mitades[0].numingres();
	}
	ClasePizza.prototype.precioSinOferta=function() {
		var preba=this.mata[3];
		if (this.mitades[0]!=null && this.mitades[1]){
			var preis=(this.mitades[0].precio()/2)+(this.mitades[1].precio()/2);
			return preis+preba;
		}else
			return this.mitades[0].precio()+preba;
	}
	ClasePizza.prototype.precio=function() {
		if (this.oferta!=null) return this.elprenocalc=this.oferta.precio;
		return this.elprenocalc=this.precioSinOferta();
		/*var preba=this.mata[3];
		if (this.mitades[0]!=null && this.mitades[1]){
			var preis=(this.mitades[0].precio()/2)+(this.mitades[1].precio()/2);
			return this.elprenocalc=preis+preba;
		}else
			return this.elprenocalc=this.mitades[0].precio()+preba;*/
	}
	ClasePizza.prototype.compproofer=function(proof,cant){
		if (this.oferta != null) return [false];
		if (this.tipoart!=proof.tp) return [false];
		var lon=proof.masas.length;
		
		if (lon>0){
			var hay=false;
			for (var i=0;i<lon;i++){
				if (proof.masas[i]==this.masa[0]){
					hay=true;break;
				}
			}
			if (!hay) return [false];
		}
		lon=proof.tamas.length;
		
		if (lon>0){
			var hay=false;
			for (var i=0;i<lon;i++){
				if (proof.tamas[i]==this.tama[0]){
					hay=true;break;
				}
			}
			if (!hay) return [false];
		}
		lon=proof.artis.length;
		
		if (lon>0){
			var hay=false;
			if (this.mitades[0].espe) {
				for (var i=0;i<lon;i++){
					if (proof.artis[i]==this.mitades[0].espe[0]){
						hay=true;break;
					}
				}
				if (!hay) return [false];
			}
			if (this.mitades[1]!=null && this.mitades[1].espe){
				hay=false;
				for (var i=0;i<lon;i++){
					if (proof.artis[i]==this.mitades[1].espe[0]){
						hay=true;break;
					}
				}
				if (!hay) return [false];
			}
		}
		cant-=this.cantidad;
		var ni=this.numingres(),co=proof.ingres.condiing,numi=proof.ingres.numing;
		if (co=="ma") {
			if (ni<=numi)
				return [false];
		}else if (co=="me" ) {
			if (ni>=numi) return [true,cant,((ni-numi+1)*this.cantidad)*this.mata[4]];
		}else if (co=="ig" && ni!=numi ) return [false];
		return [true,cant,0];
	}
	
	ClasePizza.prototype.lineatr=function(cltr) {
		var eles={};
		var tr1=hUtils.crearElemento({e:"tr",a:{className:cltr},
			hijos:[{e:"td",a:{colSpan:2},hijos:[{e:"table",hijos:[{e:"tr",hijos:[{e:"td",a:{width:"10%"},hijos:[{e:"a",did:"a1",a:{title:"Modificar Pizza"},inner:this.cantidad+" "+this.nomtama()}]},{e:"td",did:"tdpre",a:{width:"10%"},c:{textAlign:"right"},inner:fontPrecio(Number(this.elprenocalc).toFixed(2))}]},{e:"tr", hijos:[{e:"td",a:{colSpan:2,className:"pequeg"},inner:this.nommitades()}]}]}] },{e:"td",a:{width:"20%"},c:{textAlign:"center"},hijos:[{e:"button",did:"a2",a:{title:"Eliminar Pizza"},inner:"<span  class='icon-remove'></span>"}]}]},eles);
		this.tdpre=eles.tdpre;
		eles.a1.addEventListener("click",trModart(tr1),false);
		eles.a2.addEventListener("click",trElimArt(tr1),false);
		//eles.a1.linea=eles.a2.linea=tr1;
		return tr1;
	}
	/*ClasePizza.prototype.detalleStorage=function() {
		var m=0,mit=[];
		while(m<2 && this.mitades[m]!=null){
			var lon=this.mitades[m].ings.length,ming=[];
			for (var i=0;i<lon;i++)
				ming.push(dameart(datosart.ingres,this.mitades[m].ings[i][0]));
			mit[m]={
				espe:this.mitades[m].indespe,
				salsa:this.mitades[m].indsal,
				queso:this.mitades[m].queso,
				ings:ming
			}
			m++;
		}
		return {
			indmata:this.indmata,
			mitades:mit,
			canti:this.cantidad
		};
	}*/
	ClasePizza.prototype.detalleregistro=function() {
		var m=0,mit=[];
		while(m<2 && this.mitades[m]!=null){
			var lon=this.mitades[m].ings.length,ming=[];
			for (var i=0;i<lon;i++)
				ming.push(this.mitades[m].ings[i][0]);
			mit[m]={
				espe:this.mitades[m].espe ? this.mitades[m].espe[0] : null,
				salsa:this.mitades[m].salsa ? this.mitades[m].salsa[0] : null,
				queso:this.mitades[m].queso,
				ings:ming
			}
			m++;
		}
		var rdet={
			mata:this.mata[0],
			//tama:this.tama[0],
			//masa:this.masa[0],
			canti:this.cantidad,
			mitades:mit
		}
		return rdet;
	}
	function ClaseOtronormal(indotr,unotr,c){
		if (arguments.length<2){
			articulo.call(this,1,indotr.oferta,indotr.det.canti);
			this.indotr= dameart(datosart.otros,indotr.det.idotr);// indotr.det.indotr;
			var ax=datosart.unotros[indotr.det.idotr]; //datosart.otros[this.indotr][0].toString()];
			this.unotr=ax[dameart(ax,indotr.det.unotr )];
			/*for (var i=0,lon=ax.length;i<lon;i++ )
				if (indotr.det.unotr==ax[i][0]){
					this.unotr=ax[i];break;
				}*/
			//this.unotr=datosart.unotros[dameart(datosart.unotros[datosart.otros[this.indotr][0].toString()],indotr.det.unotr)];
		}else {
			articulo.call(this,1,null,c);
			this.indotr=indotr;
			this.unotr=unotr;
		}
		this.tipoart=1;
		this.otr=datosart.otros[this.indotr]; 
		this.precio();
		//this.cantidad=c;
	}
	ClaseOtronormal.prototype=Object.create ? Object.create(articulo.prototype) : new articulo;
	ClaseOtronormal.prototype.clonar=function(can) {
		return new ClaseOtronormal(this.indotr,this.unotr,can);
	}
	ClaseOtronormal.prototype.nombre=function() {
		//this.otr[1]+"<br>"+this.unotr[1];
		return this.unotr[1]; 
	}
	ClaseOtronormal.prototype.precioSinOferta=function() {
		return this.unotr[3]*this.cantidad;
	}
	ClaseOtronormal.prototype.precio=function() {
		if (this.oferta!=null) return this.elprenocalc=this.oferta.precio;
		return this.elprenocalc=this.precioSinOferta();
		//return this.elprenocalc=this.unotr[3]*this.cantidad;
	}
	ClaseOtronormal.prototype.lineatr=function(cltr) {
		var trp=lalineatr(this,this.cantidad,this.nombre(),this.elprenocalc,cltr);
		this.tdpre=trp[1];
		return trp[0];
	}
	ClaseOtronormal.prototype.compproofer=function(proof,cant){
		if (this.oferta != null) return [false];
		if (this.tipoart!=proof.tp) return [false];
		if ( proof.idp!=this.otr[0]) return [false];
		var lon=proof.artis.length;
		if (lon>0){
			var hay=false;
			for (var i=0;i<lon;i++){
				if (proof.artis[i]==this.unotr[0]){
					hay=true;break;
				}
			}
			if (!hay) return [false];
		}
		cant-=this.cantidad;
		return [true,cant,0];
	}
	/*ClaseOtronormal.prototype.detalleStorage=function() {
		return {
			idotr:this.otr[0], //datosart.otros[this.indotr][0],
			//indotr:this.indotr,
			unotr:this.unotr[0],
			canti:this.cantidad
		}
	}*/
	ClaseOtronormal.prototype.detalleregistro=function() {
		return {
			idotr:this.otr[0],
			unotr:this.unotr[0],
			canti:this.cantidad
		}
	}
	/*function ClaseOtrx2(indotrx,idespe,ta,sal,ings,can){
		if (arguments.length<2){
			articulo.call(this,2,indotrx.oferta,indotrx.det.canti);
			this.indotrx=dameart(datosart.otrosx,indotrx.det.idotrx); // indotrx.det.indotrx;
			this.idespe=indotrx.det.idespe ? dameart(datosart.unotrosx[indotrx.det.idotrx],indotrx.det.idespe ) : null;
			// indotrx.det.idespe;
			this.sal=indotrx.det.sal;
			this.ings=[];
			var ling=datosart.ingresx[indotrx.det.idotrx],li2=indotrx.det.ings;
			// datosart.otrosx[this.indotrx][0]],
			
			for (var i=0,lon=li2.length;i<lon;i++)
				this.ings.push(ling[li2[i]]);
			//this.ings=indotrx.det.ings;
			this.tama=indotrx.det.tama;
		}else {
			articulo.call(this,2,null,can);
			this.indotrx=indotrx;this.idespe=idespe;this.sal=sal;
			this.ings=ings;
			this.tama= ta;
		}
		this.tipoart=2;
		this.otrx=datosart.otrosx[this.indotrx]; 
		this.unotrx=this.idespe ? datosart.unotrosx[this.otrx[0]][this.idespe] : null;
		if (this.otrx[3]!="No"){
			this.nomsal=this.otrx[3];
			this.salsa=datosart.salsasx[this.otrx[0]][this.sal];
		}
		this.precio();
		//this.cantidad=can;
	}*/

	function ClaseOtrx(indotrx,idespe,ta,sal,ings,can){
		if (arguments.length<2){
			articulo.call(this,2,indotrx.oferta,indotrx.det.canti);
			this.indotrx=dameart(datosart.otrosx,indotrx.det.idotrx); 
			this.idespe=indotrx.det.unotrx ? dameart(datosart.unotrosx[indotrx.det.idotrx],indotrx.det.unotrx ) : null; 
			this.sal=dameart(datosart.salsasx[indotrx.det.idotrx],indotrx.det.salsa);
			this.ings=[];
			var ling=datosart.ingresx[indotrx.det.idotrx],li2=indotrx.det.ings;
			for (var i=0,lon=li2.length;i<lon;i++)
				this.ings.push(ling[dameart(ling, li2[i])]);
			if (indotrx.det.tamax)
				this.tama=dameart(datosart.tamax[indotrx.det.idotrx],indotrx.det.tamax);
		}else {
			articulo.call(this,2,null,can);
			this.indotrx=indotrx;this.idespe=idespe;this.sal=sal;
			this.ings=ings;
			this.tama=ta;
		}
		this.tipoart=2;
		this.otrx=datosart.otrosx[this.indotrx]; 
		this.unotrx=this.idespe!==null ? datosart.unotrosx[this.otrx[0]][this.idespe] : null;
		if (this.otrx[3]!="No"){
			this.nomsal=this.otrx[3];
			this.salsa=datosart.salsasx[this.otrx[0]][this.sal];
		}
		this.precio();
		//this.cantidad=can;
	}
	ClaseOtrx.prototype=Object.create ? Object.create(articulo.prototype) : new articulo;
	ClaseOtrx.prototype.clonar=function(can) {
		return new ClaseOtrx(this.indotrx,this.idespe,this.tama,this.sal,this.ings,can);
	}
	ClaseOtrx.prototype.nombre=function() {
		var tex=this.otrx[1]+" "+ (this.unotrx ? this.unotrx[1] : "Al Gusto");
		if (this.otrx[4][0]=="Varios")
			tex+=" "+datosart.tamax[this.otrx[0]][this.tama][1];
		tex+="<div class='pequeg' >  ";
		if (this.nomsal){
			tex+=this.nomsal+" "+this.salsa[1]+",";
		}
		var lon=this.ings.length;
		if (lon>0){
			tex+=" "+this.ings[0][1];
			for (var i=1;i<lon;i++)
				tex+=", "+this.ings[i][1];	
		}
		tex+="</div>";
		return tex;
	}
	ClaseOtrx.prototype.preciobaing=function() {
		if (this.otrx[4][0]=="Unico"){
			var preba=this.otrx[4][1];
			var preing=this.otrx[4][2];
		}else {
			var preba=datosart.tamax[this.otrx[0]][this.tama][2];
			var preing=datosart.tamax[this.otrx[0]][this.tama][3];
		}
		return {preba:preba,preing:preing};
	}
	ClaseOtrx.prototype.precioSinOferta=function(){
		var ppp=this.preciobaing();
		if (this.nomsal)
			ppp.preba+=ppp.preing*this.salsa[2];
		for (var i=0,lon=this.ings.length;i<lon;i++)
			ppp.preba+=ppp.preing*this.ings[i][2];
		return ppp.preba*this.cantidad;
	}
	ClaseOtrx.prototype.numingres=function() {
		var lon=this.ings.length;
		var ni=this.nomsal ? this.salsa[2] : 0; //0;
		for (var i=0;i<lon;i++)
			ni+=this.ings[i][2];
		return ni;
	}
	ClaseOtrx.prototype.precio=function() {
		if (this.oferta!=null) return this.elprenocalc=this.oferta.precio;
		return this.elprenocalc=this.precioSinOferta();
		/*var ppp=this.preciobaing();
		
		if (this.nomsal)
			ppp.preba+=ppp.preing*this.salsa[2];
		for (var i=0,lon=this.ings.length;i<lon;i++)
			ppp.preba+=ppp.preing*this.ings[i][2];
		return this.elprenocalc=ppp.preba*this.cantidad;*/
	}
	ClaseOtrx.prototype.lineatr=function(cltr) {
		var trp=lalineatr(this,this.cantidad,this.nombre(),this.elprenocalc,cltr);
		this.tdpre=trp[1];
		return trp[0];
	}
	ClaseOtrx.prototype.compproofer=function(proof,cant){
		if (this.oferta != null) return [false];
		if (this.tipoart!=proof.tp) return [false];
		if ( proof.idp!=this.otrx[0]) return [false];

		var lon=proof.tamas.length;
		if (lon>0 && this.otrx[4][0]=="Unico") return [false];
		if (lon>0){
			var hay=false;
			for (var i=0;i<lon;i++){
				if (proof.tamas[i]==datosart.tamax[this.otrx[0]][this.tama][0]){
					hay=true;break;
				}
			}
			if (!hay) return [false];
		}
		lon=proof.artis.length;
		
		if (lon>0 && this.unotrx) {
			var hay=false;
			for (var i=0;i<lon;i++){
				if (proof.artis[i]==this.unotrx[0]){
					hay=true;break;
				}
			}
			if (!hay) return [false];
		}
		cant-=this.cantidad;
		//if (proof.custom.cantidad > this.cantidad)
		//else if (proof.custom.cantidad < this.cantidad) cant =proof.custom.cantidad-this.cantidad;
		var ni=this.numingres(),co=proof.ingres.condiing,numi=proof.ingres.numing;
		if (co=="ma") {
			if (ni<=numi)
				return [false];
		}else if (co=="me" ) {
			if (ni>=numi) return [true,cant,((ni-numi+1)*this.cantidad)*this.preciobaing().preing];
		}else if (co=="ig" && ni!=numi ) return [false];
		return [true,cant,0];
	}
	/*ClaseOtrx.prototype.detalleStorage=function() {
		var lon=this.ings.length,mings=[],ling=datosart.ingresx[datosart.otrosx[this.indotrx][0]];
		for (var i=0;i<lon;i++)
			for (var n=0,lon2=ling.length;n<lon2;n++)
				if ( this.ings[i][0]==ling[n][0]){
					mings.push(n);break;
				}
		var rdet={ 
			idotrx:this.otrx[0], 
			//indotrx:this.indotrx,
			idespe:this.unotrx ? this.unotrx[0] : null,
			sal:this.sal,
			ings:mings,
			canti:this.cantidad
		};
		if (this.nomsal){
			rdet.salsa=this.sal;
		}
		if (this.otrx[4][0]=="Varios")
			rdet.tamax=this.tama;
		return rdet;
	}*/
	ClaseOtrx.prototype.detalleregistro=function() {
		var lon=this.ings.length,mings=[];
		for (var i=0;i<lon;i++)
			mings.push(this.ings[i][0]);
		var rdet= {
			idotrx:this.otrx[0],
			unotrx:this.unotrx ? this.unotrx[0] : null,
			ings:mings,
			canti:this.cantidad
		}
		if (this.nomsal){
			rdet.salsa=this.salsa[0];
		}
		if (this.otrx[4][0]=="Varios")
			rdet.tamax=datosart.tamax[this.otrx[0]][this.tama][0];
		return rdet;
	}
	function ClasePedido(art){
		this.numoferta=0;
		this.tabla=document.createElement("table");
		this.tbody=document.createElement("tbody");
		this.nartis=this.precio=0;
		//var col=["C.","Artículo","€.","<span  class='icon-remove'></span>"];
		var col=["Artículo","€.","<span  class='icon-deleteshop'></span>"];
		var the=this.tabla.createTHead();
		var row = the.insertRow (0),cell;
		for (var i=0;i<3;i++){
			cell = row.insertCell (i);
			if (i==0)
				cell.width="70%";
			else if(i==1)
				cell.width="10%";
			else cell.width="20%";
			cell.innerHTML=col[i];
		}
		this.tabla.appendChild(this.tbody);
		this.tabla.appendChild(hUtils.crearElemento({e:"tfoot", hijos:[{e:"tr",hijos:[{e:"td",did:"numpretx",a:{colSpan:3},inner:"<div>Nº Artículos:00</div><div>Total: 00.00€</div>"}]},{e:"tr",hijos:[{e:"td",a:{colSpan:3,textAlign:"right"},hijos:[{e:"button",a:{className:"btn btn-large btn-primary"},listener:{click:this.registro(this)}, inner:"<span class='icon-sendshop' style='font-size:1.5em;color:#333;'></span> Confirmar"} ]}]}]},this));

	}
	ClasePedido.prototype.articulo=function(tr){
		return almacen_act[tr.getAttribute("data-did")];
	}
	ClasePedido.prototype.dataDid=function(tr){
		return tr.getAttribute("data-did");
	}
	ClasePedido.prototype.poner_articulo=function(tr,art){
		numdid_act++;
		tr.setAttribute("data-did",numdid_act);
		if (!art)
			throw Error("no hay artículo en poner_articulo");
		almacen_act[numdid_act]=art;
		return art;
	}
	ClasePedido.prototype.borrar_articulo=function(tr){
		delete almacen_act[tr.getAttribute("data-did")];
	}
	ClasePedido.prototype.dameNumOferNueva=function() {
		return this.numoferta++;
	}
	ClasePedido.prototype.nuevoarti=function(art,e){
		var tr=art.lineatr();
		this.poner_articulo(tr,art);
		//tr.articulo=art;
		this.tbody.appendChild(tr);
		 //tr.addEventListener ('DOMNodeRemoved', trarticuloRemoved, false);
		this.nartis+=art.cantidad;
		this.precio+=art.elprenocalc;
		this.numpretx.innerHTML="<div>Nº Artículos:"+this.nartis+"</div><div> Total: "+Number(this.precio).toFixed(2)+"€</div>";
		if (!e)
			ClTaste("Se a añadido a tu pedido:<br>"+art.cantidad+" <span>"+art.nombre()+"<span>");
	}
	ClasePedido.prototype.modificar=function(art,trmod){
		var tr=art.lineatr();
		this.poner_articulo(tr,art);
		//tr.articulo=art;
		this.tbody.insertBefore(tr,trmod);
		//tr.addEventListener ('DOMNodeRemoved', trarticuloRemoved, false);
		this.tbody.removeChild(trmod);
		var trmodarticulo=this.articulo(trmod);
		this.nartis-=trmodarticulo.cantidad;
		this.precio-=trmodarticulo.precio();
		this.precio+=art.elprenocalc;
		this.nartis+=art.cantidad;
		this.borrar_articulo(trmod);
		this.numpretx.innerHTML="<div>Nº Artículos:"+this.nartis+"</div><div> Total: "+Number(this.precio).toFixed(2)+"€</div>";
		return tr;
	}
	ClasePedido.prototype.eliminar_unaoferta=function(nof){
		var lon=this.tbody.rows.length,borrar=null;
		for (var i=0;i<lon;i++){
			var art= this.articulo(this.tbody.rows[i]);
			if (art && art.oferta!=null && art.oferta.numofer==nof) {
				this.precio-=art.oferta.precio;
				art.quitaroferta(this.tbody.rows[i]);
				if (art.trofer) borrar=art;
				this.precio+=art.elprenocalc;
			}
		}
		if (borrar) {
			this.tbody.removeChild(borrar.trofer);
			borrar.trofer=null;
		}

	}
	ClasePedido.prototype.eliminar=function(trmod){
		var trmodarticulo=this.articulo(trmod);
		if (trmodarticulo.oferta!=null){
			if (confirm("Este artículo forma parte de una oferta\n¿Deseas eliminar la oferta ?")){
				this.eliminar_unaoferta(trmodarticulo.oferta.numofer);
				/*var lon=this.tbody.rows.length;
				var nof=trmod.articulo.oferta.numofer,borrar=null;
				for (var i=0;i<lon;i++){
					var art=this.tbody.rows[i].articulo;
					if (art && art.oferta!=null && art.oferta.numofer==nof) {
						this.precio-=art.oferta.precio;
						art.quitaroferta(this.tbody.rows[i]);
						if (art.trofer) borrar=art;
						this.precio+=art.elprenocalc;
					}
				}
				if (borrar) {
					this.tbody.removeChild(borrar.trofer);
					borrar.trofer=null;
				}*/
				this.numpretx.innerHTML="<div>Nº Artículos:"+this.nartis+"</div><div> Total: "+Number(this.precio).toFixed(2)+"€</div>";
			}
			return false;
		}
		if (confirm("¿Seguro que deseas eliminar este artículo?")){
			this.tbody.removeChild(trmod);
			this.nartis-=trmodarticulo.cantidad;
			this.precio-=trmodarticulo.precio();
			this.numpretx.innerHTML="<div>Nº Artículos:"+this.nartis+"</div><div> Total: "+Number(this.precio).toFixed(2)+"€</div>";
			ClTaste("Se a eliminado de tu pedido:<br>"+trmodarticulo.cantidad+" <span>"+trmodarticulo.nombre()+"<span>");
			this.borrar_articulo(trmod);
			return true;
		}
		return false;
	}
	ClasePedido.prototype.dametrsartis=function() {
		var lon=this.tbody.rows.length,trs=[],art;
		for (var i=0;i<lon;i++){
			art=this.articulo(this.tbody.rows[i]);
			if (art){
				trs.push([art]);
				art.finalizado=true;
			}
		}
		for (var i in almacen_act){
			art=almacen_act[i];
			if (! art.finalizado){
				ClAlerta.marcar({tit:"Error en pedido",inte:"<div>Error desconocido, faltan artículos. Recarga la página.</div>",f:this.reiniciarPedido.bind(this),obj:true});
				window.removeEventListener("beforeunload", this.detalleStorage.bind(this));
				return null;
			}
			delete art.finalizado;
		}
		return trs;
	}
	ClasePedido.prototype.reiniciarPedido=function(obj,hacer) {
		if (!hacer) return;
		this.tabla.removeChild(this.tbody);
		almacen_act={};
		this.nartis=this.precio=0;
		var nuebody=document.createElement("tbody");
		this.tabla.appendChild(nuebody);
		this.tbody=nuebody;
		this.numpretx.innerHTML="<div>Nº Artículos:0</div><div> Total: 0€</div>";
		window.addEventListener("beforeunload", this.detalleStorage.bind(this));
	}
	ClasePedido.prototype.pintarafterofer=function(arts){
		var lon=arts.length;
		this.tabla.removeChild(this.tbody);
		almacen_act={};
		var nuebody=document.createElement("tbody");
		this.nartis=this.precio=0;
		var cini=0,pf=-1;
		for (var i=0;i<lon;i++){
			if (arts[i][1]) {

				arts[i][0].precio();
				if (pf!=arts[i][0].oferta.numofer) {
					var tr=document.createElement("tr");
					tr.className="lineaped-tdpri";
					var td=document.createElement("td");
					td.colSpan=3;
					td.innerHTML="<div >"+arts[i][0].nombre_oferta()+"</div>";
					arts[i][0].trofer=tr;
					tr.appendChild(td);
					nuebody.appendChild(tr);
					pf=arts[i][0].oferta.numofer;
				}
				var tr=arts[i][0].lineatr("lineaofer");
				/*if (pf!=arts[i][0].oferta.numofer) {
					var tr=arts[i][0].lineatr("lineaped-ofpri");
					pf=arts[i][0].oferta.numofer;
				}else 
					var tr=arts[i][0].lineatr("lineaofer"); //var tr=arts[i][0].lineatr("lineaped-ofsec");*/
				this.poner_articulo(tr,arts[i][0] );
				//tr.articulo=arts[i][0];
				this.nartis+=arts[i][0].cantidad;
				this.precio+=arts[i][0].elprenocalc;
				nuebody.appendChild(tr);
				cini++;
			}
		}
		if (cini<lon){
			pf=-1;
			for (var i=0;i<lon;i++){
				if (!arts[i][1]) {
					arts[i][0].precio();
					/*if (arts[i][0].oferta!=null){
						if (pf==arts[i][0].oferta.numofer){
							var ii=i+1;
							if (ii==lon || !arts[ii][1] || pf!=arts[ii][0].oferta.numofer)
								var tr=arts[i][0].lineatr("lineaped-ofult");
							else
								var tr=arts[i][0].lineatr("lineaped-ofsec");
						}else {
							var tr=arts[i][0].lineatr("lineaped-ofpri");
							pf=arts[i][0].oferta.numofer;
						}
					}else*/
						var tr=arts[i][0].lineatr();
					this.poner_articulo(tr,arts[i][0]);
					//tr.articulo=arts[i][0];
					this.nartis+=arts[i][0].cantidad;
					this.precio+=arts[i][0].elprenocalc;
					nuebody.appendChild(tr);
				}
			}
		}
		this.tabla.appendChild(nuebody);
		this.tbody=nuebody;
		this.numpretx.innerHTML="<div>Nº Artículos:"+this.nartis+"</div><div> Total: "+Number(this.precio).toFixed(2)+"€</div>";
	}
	ClasePedido.prototype.registro=function(ele){
		return function() {
			//ele.detalleStorage();
			//return;
			var lon=ele.tbody.rows.length;
			if (lon<1) {
				ClAlerta.marcar({tit:"Error en pedido",inte:"<div>No hay artículos !!!!</div>"});
				return;
			}
			var coped=CldatDom.comfirmarpedido(ele.precio);
			if (!coped[0]){
				ClPrin.sacardatosdom();
				ClAlerta.marcar({tit:"Error en pedido",inte:"<div>"+coped[1]+"</div>"});
				return;
			}
			//if (coped[1].pedidoen<1)
				//ClPrin.sacarmarcocalcu(ele.precio,coped[1]);
			//else 
				ele.finalizar2(coped[1]);
		}
	}
	ClasePedido.prototype.pintar_pedido=function(miped){
		var tiart=[ClasePizza,ClaseOtronormal,ClaseOtrx],pf=-1,maxnumof=-1;
		this.nartis=this.precio=0;
		//miped=window.JSON.parse(miped);
		this.tabla.removeChild(this.tbody);
		var nuebody=document.createElement("tbody");
		almacen_act={};
		for (var i=0,lon=miped.detalle.length;i<lon;i++){
			var art=new tiart[miped.detalle[i].articulo](miped.detalle[i]);
			if (art.oferta){
				if (pf!=art.oferta.numofer) {
					var tr=document.createElement("tr");
					tr.className="lineaped-tdpri";
					var td=document.createElement("td");
					td.colSpan=3;
					td.innerHTML="<div >"+art.nombre_oferta()+"</div>";
					art.trofer=tr;
					tr.appendChild(td);
					nuebody.appendChild(tr);
					pf=art.oferta.numofer;
					if (pf>maxnumof) maxnumof=pf;
				}
				var tr=art.lineatr("lineaofer");
			}else {
				var tr=art.lineatr();
			}
			this.poner_articulo(tr,art);
			//tr.articulo=art;
			this.nartis+=art.cantidad;
			this.precio+=art.elprenocalc;
			nuebody.appendChild(tr);
		}
		this.numoferta=maxnumof+1;
		this.tabla.appendChild(nuebody);
		this.tbody=nuebody;
		this.numpretx.innerHTML="<div>Nº Artículos:"+this.nartis+"</div><div> Total: "+Number(this.precio).toFixed(2)+"€</div>";
	}
	ClasePedido.prototype.pintar_pedido_storage=function(){
		var cok_utspo=hUtils.storage.getItem("_utspo");
		if (cok_utspo !== null){
			var miped=window.JSON.parse(window.atob(cok_utspo));
		//if (miped){
			if (miped.tiendanom!=datosart.tienda.nombre || miped.horapedido<datosart.tienda.ult_mod){
				console.log(" no coincide en pedido cookies el nombre de la tienda o la hora de pedido con ult_mod de tienda.");
				return;
			}
			//console.log("miped = ",window.JSON.stringify(miped)," objeto=", miped);
			if ( miped.detalle){
				this.pintar_pedido(miped);
			}
			hUtils.storage.removeItem("_utspo");
		}
	}
	
	ClasePedido.prototype.comprobar_ofertas=function(){
		var lon=this.tbody.rows.length,lof=[],esdom=CldatDom.donde==2;
		for (var i=0;i<lon;i++){
			var art=this.articulo(this.tbody.rows[i]); //.articulo;
			if (art && art.oferta){
				var laof=datosart.ofer[dameart(datosart.ofer,art.oferta.idofer)];
				if (laof && laof[8] && esdom){
					lof.push(art.oferta.numofer);
					var nof=laof[0];
					if (this.tbody.rows[i].className.indexOf("resaltar")<0) this.tbody.rows[i].className+=" resaltar";
					while ( ++i< lon && (art=this.articulo(this.tbody.rows[i])) && art.oferta && art.oferta.idofer==nof )
						if (this.tbody.rows[i].className.indexOf("resaltar")<0) this.tbody.rows[i].className+=" resaltar";
				}
			}
			if (i<lon){
				var trc=this.tbody.rows[i],cla=trc.className,p=cla.indexOf("resaltar");
				if (p>-1)
					trc.className=cla.substring(0,p); //+" "+cla.substring(p+8,cla.length);
			} 
		}
		if (lof.length>0){
			ClAlerta.marcar({tit:"Error en pedido",inte:"<div>Estos <span class='resaltar' style='padding:0.3em 0.5em;'>artículos</span> tienen ofertas que son sólo para Recoger y tu pedido es a Domicilio.<br/>Cambia la oferta o cambia tu pedido para Recoger. ¿Quieres eliminar estas ofertas ahora?</div>",f:this.eliminar_ofer_mal.bind(this),ob:lof });
			return true;
		}else
			return false;
	}
	ClasePedido.prototype.eliminar_ofer_mal=function(lobj,hacer){
		if (!hacer) return;
		//var lon=this.tbody.rows.length;
		for (var o=0;o<lobj.length;o++){
			this.eliminar_unaoferta(lobj[o]);
			/*var nof=lobj[i],borrar=null;
			for (var i=0;i<lon;i++){
				var art=this.tbody.rows[i].articulo;
				if (art && art.oferta!=null && art.oferta.numofer==nof) {
					this.precio-=art.oferta.precio;
					art.quitaroferta(this.tbody.rows[i]);
					if (art.trofer) borrar=art;
					this.precio+=art.elprenocalc;
				}
			}
			if (borrar) {
				this.tbody.removeChild(borrar.trofer);
				borrar.trofer=null;
			}*/
		}
		this.numpretx.innerHTML="<div>Nº Artículos:"+this.nartis+"</div><div> Total: "+Number(this.precio).toFixed(2)+"€</div>";
	}
	ClasePedido.prototype.finalizar2=function(coped){
		if (this.comprobar_ofertas()) return;
		var losart=[],lon=this.tbody.rows.length;
		var predef=0;
		for (var i=0;i<lon;i++){
			var art=this.articulo(this.tbody.rows[i]); //.articulo;
			if (art){
				if (art.finalizado){
					ClAlerta.marcar({tit:"Error en pedido",inte:"<div>Error desconocido, sobran artículos. Recarga la página.</div>"});
					window.removeEventListener("beforeunload", this.detalleStorage.bind(this));
					return null;
				}
				var auxpre=parseFloat(Number(art.precio()).toFixed(2));
				predef+=auxpre;
				//if (linerr.length<1) {
					losart.push({
						articulo:art.tipoart,
						det:art.detalleregistro(), //art.detalleStorage()
						oferta:art.oferta,
						preart:auxpre
					});
				//}
				art.finalizado=true;
			}
		}
		if (parseFloat(Number(this.precio).toFixed(2)) != predef){
			ClAlerta.marcar({tit:"Error en pedido",inte:"<div>El precio total no coincide con la suma de los precios de los artículos.</div>",f:this.reiniciarPedido.bind(this),obj:true});
			return;
		}
		for (var i in almacen_act){
			if (! almacen_act[i].finalizado){
				ClAlerta.marcar({tit:"Error en pedido",inte:"<div>Error desconocido, faltan artículos. Recarga la página.</div>"});
				window.removeEventListener("beforeunload", this.detalleStorage.bind(this));
				return null;
			}
			delete almacen_act[i].finalizado
		}
		coped.tiendanom=datosart.tienda.nombre;
		var datped={"datped":coped,"detalle":losart};
		//coped.detalle=losart;
		console.log("pedido=", datped);
		//console.log("string pedido=",window.JSON.stringify(datped));
		var soy_ped=this,datpedstring=window.JSON.stringify(datped);
		hUtils.storage.setItem("_utspo",window.btoa(datpedstring));
		//hUtils.storage.setItem("pedido",datpedstring);
		hUtils.xJson({url:"/tienda/"+datosart.tienda.url_tien+"/comprobarpedido",datos:datpedstring,formu:false}).then(function(res){
					console.log("recibo respuesta de server en comprobarpedido======",res);
					if (res.ok=="ok"){
						//console.log("paypal="+window.JSON.stringify(res));
						var aux=document.createElement("div");
						var tex="<table ><thead><tr ><td width='80%' class='pequeg' align='center'>Pedido</td><td></td></tr></thead>";
						for (var d=0;d<res.resto.detalle.length; d++){
							var e=res.resto.detalle[d];
							if (e.articulo < 1000){
								if (e.ofertaid)
									var p=0;
								else
									var p=e.preu*e.cant;
								tex+="<tr><td class='pequeg'>"+e.cant+" "+e.nombre+"</td><td align='right'>"+fontPrecio(Number(p).toFixed(2))+"</td></tr>";
							}else {
								tex+="<tr><td class='pequeg' align='center'>Oferta "+e.nomofer+"</td><td align='right'>"+fontPrecio(Number(e.totofer).toFixed(2))+"</td></tr>";
							}
							
						}
						tex+="<tr><td align='right'>Total:</td><td align='right'>"+fontPrecio(Number(res.resto.predefi).toFixed(2))+"</td></tr></table>";
						aux.innerHTML=tex;
						if (CldatDom.donde > 1)
							var paa="Repartidor";
						else
							var paa="Tienda";
						var bot_pagos={"aux":aux},
						conte_pagos=hUtils.crearElemento({e:"div",a:{className:"conte-pago"}, hijos:[{e:"button",did:"bot_pag_ti",a:{className:"btn btn-large btn-important"}, listener:{click:pedPagar("pagar en tienda",bot_pagos,"Tienda",soy_ped.pagarenTienda)},inner:paa}]},bot_pagos);
						//{click:function(){ console.log("pagar en tienda"); soy_ped.pagarenTienda(bot_pagos);}
						aux.appendChild(conte_pagos);
						if (res.resto.paypal){
							var tsuple=hacer_suple(res.resto["paypal"],res.resto["predefi"],"Paypal ");
							conte_pagos.appendChild(hUtils.crearElemento({e:"button",did:"bot_pag_paypal",a:{className:"btn btn-large btn-important"},listener:{click:pedPagar("pagar paypal",bot_pagos,"Paypal",soy_ped.pagarPaypal)},inner:tsuple },bot_pagos));
							//{click:function(){ console.log("pagar paypal"); soy_ped.pagarPaypal(bot_pagos);}}
						}
						if (res.resto.pagantis){
							var tsuple=hacer_suple(res.resto["pagantis"],res.resto["predefi"],"Pagantis ");
							conte_pagos.appendChild(hUtils.crearElemento({e:"button",did:"bot_pag_pagantis",a:{className:"btn btn-large btn-important"},listener:{click:pedPagar("pagar pagantis",bot_pagos,"Pagantis",soy_ped.pagarPagantis)},inner:tsuple },bot_pagos));
							//{click:function(){ console.log("pagar pagantis"); soy_ped.pagarPagantis(bot_pagos);}}
						}
						
					}
					/*else if ( res.ok=="redirect"){
						window.removeEventListener("beforeunload", soy_ped.detalleStorage.bind(soy_ped));
						window.location.href=res.resto;
						return;
					}*/
					ventanaPago.salir({tit:"Forma de pago",inteobj:aux,osc:true});
				}).fail(function(er){
					console.log("recibimos error respuesta en comprobar pedido er="+er);
				});
	}
	function errorTiempoexcedido(bot_pagos){
		var pro=hUtils.crearElemento({e:"div",a:{className:"pie-alert"},inner:"Ha pasado mas de cinco minutos desde la comprobación del pedido, cierra esta ventana y vuelve a confirmar el pedido."});
		if (bot_pagos["pro"])
			bot_pagos.aux.removeChild(bot_pagos["pro"]);
		bot_pagos.aux.appendChild(pro);
		bot_pagos["pro"]=pro;
		console.log("Ha pasado mas de cinco minutos desde la comprobación del pedido");
	}
	function errorVentanapago(bot_pagos,strer){
		var pro=hUtils.crearElemento({e:"div",a:{className:"pie-alert"},inner:strer});
		if (bot_pagos["pro"])
			bot_pagos.aux.removeChild(bot_pagos["pro"]);
		bot_pagos.aux.appendChild(pro);
		bot_pagos["pro"]=pro;
		console.log(strer);
	}
	function pedPagar(cade,botpa,pagoen,fun){
		return function(){
			console.log(cade);
			if ( ((ventanaPago.tiempo()/1000)/60) > 5 ){
				//console.log("error: han pasado mas de cinco minutos. ");
				errorTiempoexcedido(botpa);
			}else {
				deshabilitar_pagos(botpa,true,pagoen);
				//ClPrin.mipedido()[fun](botpa);
				fun(botpa);
			}
		}
	}
	function hacer_suple(qp,pago,tsuple){
		var suple=qp.inc_des;
		if (suple != 0){
			tsuple+="(<span class='pequeg'> suplemento </span>";
			if (qp["poroeur"]){
				suple=pago*(suple/100);
				pago=pago + suple;
				suple=fontPrecio(Number(suple).toFixed(2));// int(suple*100) / 100.0;
			}else
				pago+=suple;
			pago=fontPrecio(Number(pago).toFixed(2));
			tsuple+=suple+" ) = "+pago;
		}
		return tsuple;
	}
	function deshabilitar_pagos(bot,d,pp){
		if (d){
			bot.bot_pag_ti.disabled=true;
			bot.bot_pag_paypal.disabled=true;
			bot.bot_pag_pagantis.disabled=true;
			var pro=hUtils.crearElemento({e:"div",a:{className:"pie-alert"},inner:"Procesando pago "+pp+"..."});
			bot.aux.appendChild(pro)
			bot["pro"]=pro;
		}else {
			bot.bot_pag_ti.disabled=false;
			bot.bot_pag_paypal.disabled=false;
			bot.bot_pag_pagantis.disabled=false;
			bot["pro"].parentNode.removeChild(bot["pro"]);
			delete bot["pro"]
		}
	}
	ClasePedido.prototype.pagarenTienda=function(bot) {
		//deshabilitar_pagos(bot,true,"Tienda");
		hUtils.xJson({url:"/tienda/"+datosart.tienda.url_tien+"/comprobarpedido",datos:window.JSON.stringify({pago:"tienda"}),formu:false}).then(function(res){
			console.log("res en pagar tne tienda=",res);
			if (res.ok=="tiendaok"){
				var datca="";
				if (CldatDom.donde==1){
					datca="<br>Dirección de la tienda: "+datosart.tienda.calle+", "+datosart.tienda.cdp+" "+datosart.tienda.loca+" ( "+datosart.tienda.pro+" ).";
				}
				ClAlerta.marcar({tit:"Pedido enviado",inte:"<div>Tu pedido ha sido enviado a la tienda."+datca+"</div>"});
			}else {
				console.log("res=",res);
			}
				

		}).fail(function(er){
			if (er=="tiempoexcedido"){
				errorTiempoexcedido(bot);
			}else{
				deshabilitar_pagos(bot,false);
				errorVentanapago(bot,"recibimos error respuesta en pagarenTienda er="+er);
			}});
	}
	ClasePedido.prototype.pagarPaypal=function(bot) {
		//deshabilitar_pagos(bot,true,"Paypal");
		var _this=this;
		hUtils.xJson({url:"/tienda/"+datosart.tienda.url_tien+"/comprobarpedido",datos:window.JSON.stringify({pago:"paypal"}),formu:false}).then(function(res){
			if (res.ok=="redirect"){
				window.removeEventListener("beforeunload", _this.detalleStorage.bind(_this));
				window.location.href=res.resto;
			}
			//self.resjsonok("redirect",resto=rp.redirect)

		}).fail(function(er){
					if (er=="tiempoexcedido"){
						errorTiempoexcedido(bot);
					}else{
						deshabilitar_pagos(bot,false);
						console.log("recibimos error respuesta en pagarPaypal er="+er);
					}
				});
	}
	ClasePedido.prototype.pagarPagantis=function(bot) {
		//deshabilitar_pagos(bot,true,"Pagantis");
		var _this=this;
		hUtils.xJson({url:"/tienda/"+datosart.tienda.url_tien+"/comprobarpedido",datos:window.JSON.stringify({pago:"pagantis"}),formu:false}).then(function(res){
			console.log("recibo respuesta en pagarPagantis=",res);
			if (res.ok=="formu"){

				var formu=document.createElement("form");
				formu.action=res.resto.action;
				formu.method="post";
				var rr=res.resto.inputs;
				for (var i=0;i<rr.length;i++){
					var inp=document.createElement("input");
					inp.name=rr[i].name;
					inp.value=rr[i].value;
					formu.appendChild(inp);
				}
				//bot.aux.appendChild(formu);
				window.removeEventListener("beforeunload", _this.detalleStorage.bind(_this));
				formu.submit();
			}
			//self.resjsonok("redirect",resto=rp.redirect)

		}).fail(function(er){
					if (er=="tiempoexcedido"){
						errorTiempoexcedido(bot);
					}else{
						deshabilitar_pagos(bot,false);
						console.log("recibimos error respuesta en pagarPagantis er="+er);
					}
				});
	}
	ClasePedido.prototype.damePedido=function(){
		var coped=CldatDom.datosdom();
		if (this.nartis>0 ){
			var losart=[],lon=this.tbody.rows.length;
			coped=coped || {};
			var predef=0;
			for (var i=0;i<lon;i++){
				var art=this.articulo(this.tbody.rows[i]); //.articulo;
				if (art) {
					if (art.finalizado){
						return null;
					}	
					var auxpre=parseFloat(Number(art.precio()).toFixed(2));
					predef+=auxpre;
					losart.push({
						articulo:art.tipoart,
						det:art.detalleregistro(), //art.detalleStorage(),
						oferta:art.oferta,
						preart:auxpre
					});
					art.finalizado=true;
				}
			}
			coped.detalle=losart;
		}
		if (parseFloat(Number(this.precio).toFixed(2)) != predef){
			return null;
		}
		for (var i in almacen_act){
			if (! almacen_act[i].finalizado)
				return null;
			delete almacen_act[i].finalizado;
		}
		return coped;
	}
	ClasePedido.prototype.detalleStorage=function(ev) {

		var coped=this.damePedido();
		if (coped && coped.detalle){
			coped.tiendanom=datosart.tienda.nombre;
			hUtils.storage.setItem("_utspo",window.btoa(window.JSON.stringify(coped)));
			console.log(" guardando session de peddo pedido=",window.JSON.stringify(coped),coped);
			/*if (!ev)
				hUtils.xJson({url:"/tienda/"+datosart.tienda.nombre+"/comprobarpedido",datos:window.JSON.stringify(coped),formu:false}).then(function(res){
					console.log("recibo respuesta de server en comprobarpedido======",res);
					
				}).fail(function(er){
					console.log("recibimos error respuesta en comprobar pedido er="+er);
				});*/
		}else if (hUtils.storage.getItem("_utspo"))
			hUtils.storage.removeItem("_utspo");
	}
	ClasePedido.prototype.finalizar=function(coped) { //,reo){
		//coped.repaoreco=reo;
		
		var lon=this.tbody.rows.length;
		var losart=[];
		for (var i=0;i<lon;i++){
			var art=this.articulo(this.tbody.rows[i]); //.articulo;
			if (art) {
				var of=null;
				if (art.oferta!=null){
					of={
						numofer:art.oferta.numofer,
						idofer:art.oferta.idofer,
						idoferdet:art.oferta.idoferdet,
						precio:art.oferta.precio
					}
				}
				losart.push({
					articulo:art.tipoart,
					det:art.detalleregistro(),
					oferta:of,
					preart:parseFloat(Number(art.precio()).toFixed(2))  //art.precioSinOferta()
				});
			}
		}
		/*var dia=new Date();
		if (dia.getHours()<8)
			dia.setDate(dia.getDate()-1);
		coped.dia=dia;*/
		coped.detalle=losart;
		console.log("pedido=", { datped:coped});
		//console.log("pedido=", { datped:coped,losart:losart });//"&datped="+window.JSON.stringify(coped)+"&losart="+window.JSON.stringify(losart)
		//window.localStorage.setItem("Pedido", JSON.stringify({ datped:coped,losart:losart }));
		hUtils.xJson({url:"/pedido",datos:window.JSON.stringify(coped),formu:false}).then(function(res){
			console.log("recibo respuesta de server ======",res); //window.JSON.parse(res.ok));
		console.log("diatrabajo=",new Date(parseInt(res.ok.diatrabajo,10))," hora de entrega=",new Date(parseInt(res.ok.horaent,10)),", hora de pedido=",new Date(parseInt(res.ok.horapedido,10)));
		}).fail(function(er){
			console.log("recibimos error respuesta dat="+er);
		});
		/*hUtils.xJson({url:"/pedido",datos:"&datos="+window.JSON.stringify({ datped:coped }),formu:true}).then(function(res){
			console.log("recibo respuesta de server ======",res); //window.JSON.parse(res.ok));
		}).fail(function(er){
			console.log("recibimos error respuesta dat="+er);
		});*/
		//return { pedido:coped[1],losart:losart };
	}
	/*function ModEliArt_clprin_cldatdom(mo,eli,sdd,cldd){
		principal.modificar=mo;
		principal.eliminarart=eli;
		principal.sacardatosdom=sdd;
		principal.cldatdom=cldd;
	}*/
	return {
		inicio:function(p){ pedido_act=p; datosart=window.server.datosart; },
		ClasePedido:ClasePedido,
		ClasePizza:ClasePizza,
		ClaseMitad:ClaseMitad,
		ClaseOtrx:ClaseOtrx,
		ClaseOtronormal:ClaseOtronormal
		//init:ModEliArt_clprin_cldatdom
	}
})();
var ClOfertas=(function() {
	var datosart,pedido_act;
	function clonarartis(art){
		if (art === null ) return;
		var nue=[];
		for (var i=0,lon=art.length;i<lon;i++){
			var en=art[i][0].clonar(art[i][0].cantidad);
			nue.push([en,en.copiaroferta(art[i][0]),0]);
		}
		return nue;
	}
	function ordenarmenormayor(art){
		var ord=[art[0]];
		for (var i=1,lon=art.length;i<lon;i++){
			var ins=false;
			var pu=art[i][0].preciounitario();
			for (var n=0,lon2=ord.length;n<lon2;n++)
				if (pu<ord[n][0].preciounitario()){
					ord.splice(n,0,art[i]);
					break;
				}
			if (!ins) ord.push(art[i]);
		}
		return ord;
	}
	function ordenarmayormenor(art){
		var ord=[art[0]];
		for (var i=1,lon=art.length;i<lon;i++){
			var ins=false;
			var pu=art[i][0].preciounitario();
			for (var n=0,lon2=ord.length;n<lon2;n++)
				if (pu>ord[n][0].preciounitario()){
					ord.splice(n,0,art[i]);
					break;
				}
			if (!ins) ord.push(art[i]);
		}
		return ord;
	}
	function regaloseguro(ofer,artis){
		var lon2=artis.length,imp=0;
		var nueofe=pedido_act.dameNumOferNueva();
		var ord=[];
		for (var i=0;i<lon && imp<ofer[11];i++){
			imp+=artis[n][0].elprenocalc;
			artis[n][1]=true;
			artis[n][0].poneroferta(nueofe,ofer[0],ofer[0],i,artis[n][0].elprenocalc);
		}
		if (imp<ofer[11]) {
			console.log("no se llega al importe ="+ofer[11]);
			return false;
		}
		return artis;
	}
	function personalizartodo(ofer,artis,ppp){
		var pros=ofer[17];
		var lon=pros.length,ultpro=null;
		var nueofe=pedido_act.dameNumOferNueva(),cantqueda;
		for (var i=0;i<lon;i++){
			//var cantini=cantqueda=pros[i].cantidad || 1;
			var lon2=artis.length;
			var ord=[];
			for (var n=0;n<lon2;n++){
				preu=artis[n][0].preciounitario();
				var compo=artis[n][0].compproofer(pros[i],1);
				if (!artis[n][1] && compo[0]  ) {
					artis[n][2]=compo[2];
					ord.push(artis[n]);
					cantqueda=compo[1];
				}
			}
			for (var k=0,lon3=ord.length;k<lon3;k++){
				ultpro=ord[k][0];
				
				if (ppp) var imp=ppp+ord[k][2];
				else{
					var imp=ultpro.elprenocalc;
					if (pros[i].custom.acc===1)
						imp=ord[k][2]; //0+ord[k][2];
					else if (pros[i].custom.acc===2 )
							if (pros[i].custom.dp===1)
								imp=ultpro.elprenocalc-(ultpro.elprenocalc*pros[i].custom.de/100)+ord[k][2];
							else
								imp=ultpro.elprenocalc-pros[i].custom.de+ord[k][2];
				}
				ultpro.poneroferta(nueofe,ofer[0],pros[i].nid,i,imp);
				ord[k][1]=true;
			}
		}
		if (ultpro===null) return false;
		ultpro.oferta.precio+=ppp ? 0 : ofer[14];
		return artis;
	}
	function personalizar(ofer,artis){
		
		var pros=ofer[17];
		var lon=pros.length,ultpro=null;
		var nueofe=pedido_act.dameNumOferNueva();
		for (var i=0;i<lon;i++){
			var cantini=pros[i].custom.cantidad || 1;
			var cantqueda=cantini;
			var lon2=artis.length;
			var validtem=[];
			for (var n=0;n<lon2;n++){
				var preu=artis[n][0].preciounitario();
				var compo=artis[n][0].compproofer(pros[i],cantqueda);
				if (!artis[n][1] && compo[0]  ) {
					artis[n][2]=compo[2];
					validtem.push(artis[n]);
					cantqueda=compo[1];
				}
			}
			if (cantqueda>0){
				console.log("No se cumple condiciones de producto "+i+"=",pros[i]);
				return false;
			}
			var ord=ordenarmenormayor(validtem),cantfi=0;
			for (var k=0,lon3=ord.length;k<lon3;k++){
				ultpro=ord[k][0];
				var imp=ultpro.elprenocalc;
				if (pros[i].custom.acc===1)
					imp=ord[k][2];//	imp=0+ord[k][2];
				else if (pros[i].custom.acc===2 )
						if (pros[i].custom.dp===1)
							imp=ultpro.elprenocalc-(ultpro.elprenocalc*pros[i].custom.de/100)+ord[k][2];
						else
							imp=ultpro.elprenocalc-pros[i].custom.de+ord[k][2];
				ultpro.poneroferta(nueofe,ofer[0],pros[i].nid,i,imp);
				ord[k][1]=true;
				cantfi+=ultpro.cantidad;
				if (cantfi==cantini) break;
				else if (cantfi>cantini){
					var rc=cantfi-cantini;
					var ar=ultpro.clonar(rc);
					ultpro.cantidad-=rc;
					artis.push([ar,false]);
					break;
				}	
			}
		}
		ultpro.oferta.precio+=ofer[14];
		return artis;
	}
	function preciofijo(ofer,artis){
		//var artis=clonarartis(pedido_act.dametrsartis());
		//console.log("sisisis  es precio fijo");
		var pros=ofer[17];
		var lon=pros.length,sumfi=0,ultpro=null;
		var nueofe=pedido_act.dameNumOferNueva();
		for (var i=0;i<lon;i++){
			var cantini=pros[i].custom.cantidad || 1;
			var cantqueda=cantini;
			var lon2=artis.length;
			var validtem=[];
			for (var n=0;n<lon2;n++){
				var preu=artis[n][0].preciounitario();
				var compo=artis[n][0].compproofer(pros[i],cantqueda);
				if (!artis[n][1] && compo[0]  ) {
					artis[n][2]=compo[2];
					validtem.push(artis[n]);
					cantqueda=compo[1];
				}
			}
			if (cantqueda>0){
				console.log("No se cumple condiciones de producto "+i+"=",pros[i]);
				return false;
			}
			var ord=ordenarmenormayor(validtem),cantfi=0;
			for (var k=0,lon3=ord.length;k<lon3;k++){
				ultpro=ord[k][0];
				ultpro.poneroferta(nueofe,ofer[0],pros[i].nid,i,0);
				sumfi+=ord[k][2];
				ord[k][1]=true;
				cantfi+=ultpro.cantidad;
				if (cantfi==cantini) break;
				else if (cantfi>cantini){
					var rc=cantfi-cantini;
					var ar=ultpro.clonar(rc);
					ultpro.cantidad-=rc;
					artis.push([ar,false]);
					break;
				}	
			}
		}
		ultpro.oferta.precio=ofer[11]+sumfi;
		return artis;
	}
	function regalarmasbarato(ofer,artis){
		var indproareg=-1;
		var pros=ofer[17];
		var lon=pros.length;

		for (var i=0;i<lon;i++){
			if (pros[i].custom.acc===1) {
				var elproareg=pros[i];
				indproareg=i;
				break;
			}
		}
		if (indproareg<0){
			console.log("Error no hay ningún producto a regalar.");
			return false;
		}
		//var artis=clonarartis(pedido_act.dametrsartis());
		var proaregvalid=-1, lon2=artis.length, minpre=100000;
		
		for (var i=0;i<lon2;i++){
			if (artis[i][0].compproofer(elproareg,1)[0]) {
				var preu=artis[i][0].preciounitario();
				if (preu<minpre){ 
					proaregvalid=i; minpre=preu; 
				}
			}
		}
		if (proaregvalid<0){
			console.log("No hay producto a regalar válido.");
			return false;
		}
		var nueofe=pedido_act.dameNumOferNueva();
		if (artis[proaregvalid][0].cantidad>1) {
			var ar=artis[proaregvalid][0].clonar(artis[proaregvalid][0].cantidad-1);
			artis[proaregvalid][0].cantidad=1;
			
			artis.push([ar,false]);
		}  
		artis[proaregvalid][0].poneroferta(nueofe,ofer[0],elproareg.nid,indproareg,0 );
		artis[proaregvalid][1]=true;
		for (var i=0;i<lon;i++){
			if (i!=indproareg){
				var cantini=pros[i].custom.cantidad || 1;
				var cantqueda=cantini;
				lon2=artis.length;
				var validtem=[];
				for (var n=0;n<lon2;n++){
					var preu=artis[n][0].preciounitario();
					var compo=artis[n][0].compproofer(pros[i],cantqueda);
					if (!artis[n][1] && compo[0] ) {
						validtem.push(artis[n]);
						cantqueda=compo[1];
					}
				}
				if (cantqueda>0){
					console.log("No se cumple condiciones de producto "+i+"=",pros[i]);
					return false;
				}
				var ord=ordenarmayormenor(validtem),cantfi=0;
				for (var k=0,lon3=ord.length;k<lon3;k++){
					var imp=ord[k][0].elprenocalc;
					if (pros[i].custom.acc===2 )
						if (pros[i].custom.dp===1)
							imp=ord[k][0].elprenocalc-(ord[k][0].elprenocalc*pros[i].custom.de/100);
						else
							imp=ord[k][0].elprenocalc-pros[i].custom.de;
					ord[k][0].poneroferta(nueofe,ofer[0],pros[i].nid,i,imp);
					ord[k][1]=true;
					cantfi+=ord[k][0].cantidad;
					if (cantfi==cantini) break;
					else if (cantfi>cantini){
						var rc=cantfi-cantini;
						var ar=ord[k][0].clonar(rc);
						ord[k][0].cantidad-=rc;
						artis.push([ar,false]);
						break;
					}	
				}
			}
		}
		return artis;
	}
	function cobrarmascaro(ofer,artis){
		var indproacob=-1,pros=ofer[17],lon=pros.length;

		for (var i=0;i<lon;i++){
			if (pros[i].custom.acc===0) {
				var elproacob=pros[i];
				indproacob=i;
				break;
			}
		}
		if (indproacob<0){
			console.log("Error no hay ningún producto a cobrar.");
			return false;
		}
		//var artis=clonarartis(pedido_act.dametrsartis());
		var proacobvalid=-1, lon2=artis.length, maxpre=0;
		
		for (var i=0;i<lon2;i++){
			if (artis[i][0].compproofer(elproacob,1)[0]) {
				var preu=artis[i][0].preciounitario();
				if (preu>maxpre){ 
					proacobvalid=i; maxpre=preu; 
				}
			}
		}
		if (proacobvalid<0){
			console.log("No hay producto a cobrar válido.");
			return false;
		}
		var nueofe=pedido_act.dameNumOferNueva();
		if (artis[proacobvalid][0].cantidad>1) {
			var ar=artis[proacobvalid][0].clonar(artis[proacobvalid][0].cantidad-1);
			artis[proacobvalid][0].cantidad=1;
			
			artis.push([ar,false]);
		}  
		artis[proacobvalid][0].poneroferta(nueofe,ofer[0],elproacob.nid,indproacob,artis[proacobvalid][0].elprenocalc+ofer[14] );
		artis[proacobvalid][1]=true;
		for (var i=0;i<lon;i++){
			if (i!=indproacob){
				var cantini=pros[i].custom.cantidad || 1;
				var cantqueda=cantini;
				lon2=artis.length;
				var validtem=[];
				for (var n=0;n<lon2;n++){
					var preu=artis[n][0].preciounitario();
					var compo=artis[n][0].compproofer(pros[i],cantqueda);
					if (!artis[n][1] && compo[0] && preu<= maxpre ) {
						validtem.push(artis[n]);
						cantqueda=compo[1];
					}
				}
				if (cantqueda>0){
					console.log("No se cumple condiciones de producto "+i+"=",pros[i]);
					return false;
				}
				var ord=ordenarmenormayor(validtem),cantfi=0;
				for (var k=0,lon3=ord.length;k<lon3;k++){
					var imp=0;
					if (pros[i].custom.acc===2 )
						if (pros[i].custom.dp===1)
							imp=ord[k][0].elprenocalc-(ord[k][0].elprenocalc*pros[i].custom.de/100);
						else
							imp=ord[k][0].elprenocalc-pros[i].custom.de;
					ord[k][0].poneroferta(nueofe,ofer[0],pros[i].nid,i,imp);
					ord[k][1]=true;
					cantfi+=ord[k][0].cantidad;
					//console.log("cantidad ini="+cantini+", cantfi="+cantfi);
					if (cantfi==cantini) break;
					else if (cantfi>cantini){
						var rc=cantfi-cantini;
						var ar=ord[k][0].clonar(rc);
						ord[k][0].cantidad-=rc;
						artis.push([ar,false]);
						break;
					}	
				}
			}
		}
		return artis;
		//pedido_act.pintarafterofer(artis);

	}
	function dias_of(of){
		if (of[7]=="T"){
			return dias="Toda la semana";
		}else{
			var dias="", diasse=["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"],aux=of[7],lon=of[7].length;
			for (var i=0;i<lon;i++)
				dias+=diasse[aux[i]-1]+", "
			return dias.substring(0,dias.length-2);
		}
	}
	function info_ofer(of){
		var pros=of[17],aux;
		var lon=pros.length,tx="<h3>"+of[1]+"</h3><div>Oferta para "+(of[8] ? "Recoger en Tienda": "Domicilio y Recoger") +"<br> y para "+dias_of(of)+" de "+of[5]+"h. a "+of[6]+"h.<br> Productos para esta oferta:";
		for (var i=0;i<lon;i++){
			tx+="<br>- "; //+(i+1)+". ";
			if (pros[i].tp<1){
				tx+="Una Pizza ";
				var lon2=pros[i].tamas.length;
				if (lon2>0){
					aux="";
					for (var ii=0;ii<lon2;ii++){
						aux+=datosart.tamas[dameart(datosart.tamas,pros[i].tamas[ii])][1]+", "
					}
					tx+="de tamaños ("+aux.substring(0,aux.length-2)+")";
				}else tx+="de cualquier Tamaño";
				lon2=pros[i].masas.length;
		
				if (lon2>0){
					aux="";
					for (var ii=0;ii<lon2;ii++){
						aux+=datosart.masas[dameart(datosart.masas,pros[i].masas[ii])][1]+", "
					}
					tx+=" y masas ("+aux.substring(0,aux.length-2)+")<br>";
				}else tx+=" y de cualquier Masa<br>";
				
				lon2=pros[i].artis.length;
				if (lon2>0){
					aux="";
					for (var ii=0;ii<lon2;ii++){
						aux+=datosart.piz[dameart(datosart.piz,pros[i].artis[ii])][1]+", "
					}
					tx+=" de estas especialidades ("+aux.substring(0,aux.length-2)+")";
				}
				if ( pros[i].ingres.condiing=="cu")
					tx+=" Con cualquier número de Ingredientes.";
				else if (pros[i].ingres.condiing=="ma" )
					tx+=" con mas de "+pros[i].ingres.numing+" ingredientes.";
				else if (pros[i].ingres.condiing=="me" )
					tx+=" con menos de "+pros[i].ingres.numing+" ingredientes.";
			}else if (pros[i].tp<2 ){
				var pro=datosart.otros[dameart(datosart.otros,pros[i].idp)][1];
				tx+= (of[9] ? pro : pros[i].custom.cantidad+" "+pro)+"/s";
				var lon2=pros[i].artis.length;
				if (lon2>0){
					aux="";
					var uno=datosart.unotros[pros[i].idp];
					for (var ii=0;ii<lon2;ii++){
						aux+=uno[dameart(uno,pros[i].artis[ii])][1]+", "
					}
					tx+=" ("+aux.substring(0,aux.length-2)+")";
				}else tx+=" de cualquier tipo.";
			}else if (pros[i].tp<3 ){
				var pro=datosart.otrosx[dameart(datosart.otrosx,pros[i].idp)][1];
				tx+= (of[9] ? pro+"/s" : pros[i].custom.cantidad+" "+pro);
				var lon2=pros[i].artis.length;
				if (lon2>0){
					aux="";
					var unox=datosart.unotrosx[pros[i].idp];
					for (var ii=0;ii<lon2;ii++){
						aux+=unox[dameart(unox,pros[i].artis[ii])][1]+", "
					}
					tx+=" ("+aux.substring(0,aux.length-2)+")";
				}else tx+=" de cualquier tipo.";
				var lon2=pros[i].tamas.length;
				if (lon2>0){
					aux="";
					var tx=datosart.tamax[pros[i].idp];
					for (var ii=0;ii<lon2;ii++){
						aux+=tx[dameart(tx,pros[i].tamas[ii])][1]+", "
					}
					tx+=" de tamaños ("+aux.substring(0,aux.length-2)+")";
				}
				if ( pros[i].ingres.condiing=="cu")
					tx+=" Con cualquier número de Ingredientes.";
				else if (pros[i].ingres.condiing=="ma" )
					tx+=" Con mas de "+pros[i].ingres.numing+" ingredientes.";
				else if (pros[i].ingres.condiing=="me" )
					tx+=" Con menos de "+pros[i].ingres.numing+" ingredientes.";
			}
		}
		return tx;
	}
	function clickofer(e) {
		//console.log("oferta="+art.idofer);

		var art=datosart.ofer[parseInt(this.getAttribute("data-idofer"),10)]; // datosart.ofer[this.idofer];
		if (art[8] && CldatDom.donde>1){
			ClPrin.sacardatosdom();
			ClAlerta.marcar({tit:"No se puede realizar oferta",inte:"<div>Esta oferta es sólo para Recoger y tu pedido es para Domicilio.<br/>Cambia la oferta o cambia el pedido para Recoger.</div>"});
			return;
		}
		if (art[7]!="T"){
			var hoy=new Date().getDay();
			hoy = hoy<1 ? 7: hoy;
			if (art[7].indexOf(hoy)<0){
				ClAlerta.marcar({tit:"No se puede realizar oferta",inte:"<div>Esta oferta es para "+dias_of(art)+".</div>"});
				return;
			}
		}
		//var hora=new Date(),
		var hoofd=art[5].split(":"),hoofh=art[6].split(":"),hoof1=new Date(),hoof2=new Date();
		hoof1.setHours(hoofd[0]),hoof1.setMinutes(hoofd[1]); 
		hoof2.setHours(hoofh[0]),hoof2.setMinutes(hoofh[1]);
		var milis=CldatDom.dameHoraentrega(); //hora.getTime();
		if (milis<hoof1.getTime() || milis>hoof2.getTime() ){
			ClAlerta.marcar({tit:"No se puede realizar oferta",inte:"<div>Esta oferta es de "+art[5]+"h a "+art[6]+"h.</div>"});
			return;
		}
		var okofer=false;
		if (!art[9]){
			var pros=art[17], lon=pros.length,can=0;
			for (var i=0;i<lon;i++)
				can+=pros[i].custom.cantidad || 1;
			if (pedido_act.nartis<can){
					//console.log("debe haber="+can+", y hay="+pedido_act.nartis);
					ClAlerta.marcar({tit:"No se puede realizar oferta",inte:"<div>No hay suficientes productos para esta oferta.\ndebe haber="+can+", y hay="+pedido_act.nartis+"<div>"+info_ofer(art)});
					return;
				}
			okofer=[cobrarmascaro,regalarmasbarato,personalizar,preciofijo][art[10]](art,clonarartis(pedido_act.dametrsartis()));
		}else if (pedido_act.nartis<1){
				ClAlerta.marcar({tit:"No se puede realizar oferta",inte:"<div>No hay suficientes productos para esta oferta.<div>"+info_ofer(art)});
				return;
			}else if (art[10]===0) okofer=regaloseguro(art,clonarartis(pedido_act.dametrsartis()));
				else if (art[10]===1) okofer=personalizartodo(art,clonarartis(pedido_act.dametrsartis()),art[11]);
					else {
							okofer=personalizartodo(art,clonarartis(pedido_act.dametrsartis()));
					}
		
		/*if (!art[9] ){
			
			okofer=[cobrarmascaro,regalarmasbarato,personalizar,preciofijo][art[10]](art,clonarartis(ClPrin.mipedido().dametrsartis()));
			/*if (art[10]===0) okofer=cobrarmascaro(art,clonarartis(ClPrin.mipedido().dametrsartis()));
			else if (art[10===1) okofer=regalarmasbarato(art,clonarartis(ClPrin.mipedido().dametrsartis()));
			else if (art[10]===2) okofer=personalizar(art,clonarartis(ClPrin.mipedido().dametrsartis()));
			else if(art[10]===3]) okofer=preciofijo(art,clonarartis(ClPrin.mipedido().dametrsartis()));*/
		/*}else if (art[10]===0) okofer=regaloseguro(art,clonarartis(ClPrin.mipedido().dametrsartis()));
			else if (art[10]===1) okofer=personalizartodo(art,clonarartis(ClPrin.mipedido().dametrsartis()),art[11]);
				else {
						okofer=personalizartodo(art,clonarartis(ClPrin.mipedido().dametrsartis()));
				}*/

		if (okofer){
			pedido_act.pintarafterofer(okofer);
			//console.log("okofer=",okofer);
		}else {
			ClAlerta.marcar({tit:"No se puede realizar la oferta",inte:"<div>"+info_ofer(art)+"</div>"});
		}
	}

	return {
		inicio:function(p){ pedido_act=p; datosart=window.server.datosart; },
		clickeven:clickofer
	}
})();