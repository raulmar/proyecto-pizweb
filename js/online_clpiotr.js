"use strict";
var ClOtr=(function(){
	var marcootr={},haymodificacion=null,datosart,pedido_act;
	function clickotr(e){
		//var art1=this;
		//console.log("art=",art);
		var art=this; //art1.parentNode.parentNode;
		haymodificacion=null;
		var ids=art.getAttribute("data-idotr").split("-");
		var idr=parseInt(ids[0],10);
		var unid=datosart.otros[idr][0].toString();
		var unotr=datosart.unotros[unid][parseInt(ids[1],10)];
		/*if (marcootr.idr!=undefined){
			if (marcootr.idr==idr && unotr[0]==marcootr.unotr[0]){
				console.log("es el mismo return");
				return;
			}
			marcootr.mimarco.parentNode.removeChild(marcootr.mimarco);
		}	*/
		if (haymodificacion==null){
				var can=art.parentNode.getElementsByTagName("select")[0];
				pedido_act.nuevoarti(new Clpedart.ClaseOtronormal(idr,unotr,can.selectedIndex+1));

		}
		//pintaotr(idr,unotr,art);
		//console.log("es un otros "+datosart.otros[idr][1]+" normal y su id ="+unotr[0]+", nombre="+unotr[1]); //art.getAttribute("data-otr"));
	}
	/*function cerrarotr() {
		marcootr.mimarco.parentNode.removeChild(marcootr.mimarco);
		//this.parentNode.parentNode.removeChild(this.parentNode);
		marcootr={};
	}*/
	function confirmar(ob,res) {
		if (res) {
			if (haymodificacion==null)
				pedido_act.nuevoarti(new Clpedart.ClaseOtronormal(marcootr.idr,marcootr.unotr, marcootr.cantidad.selectedIndex+1));
			else
				pedido_act.modificar(new Clpedart.ClaseOtronormal(marcootr.idr,marcootr.unotr, marcootr.cantidad.selectedIndex+1),haymodificacion);
		}
		//cerrarotr();
	}
	function pintaotr(idr,unotr,art){
		
		/*var d=hUtils.crearElemento({e:"div",a:{className:"divotrabs"},hijos:[{e:"h4",inner:unotr[1]},
			{e:"div",a:{className:"right"}, hijos:[{e:"label",inner:"Cantidad:"},{e:"select",did:"cantidad"},{e:"button",a:{className:"btn btn-large btn-primary",onclick:confirmar}, inner:"<span class='icon-thumbs-up'></span> Confirmar"}]},
			{e:"button",did:"cerrar",a:{className:"cerrar",onclick:cerrarotr},hijos:[{e:"span",a:{className:"icon-cancel"}}] }]} ,marcootr);*/
		
		var d=hUtils.crearElemento({e:"div", hijos:[{e:"label",inner:"Cantidad:"},{e:"select",did:"cantidad"}]},marcootr);

		marcootr.idr=idr;
		marcootr.unotr=unotr;
		//marcootr.mimarco=d;
		for (var i=1;i<11;i++)
			marcootr.cantidad.options[i-1]=new Option(i);
		Alerta.marcar({tit:unotr[1],inteobj:d,f:confirmar});
		/*
		art.appendChild(d);
		window.setTimeout(function() {
			d.style.top="0%";
		},25);*/
		

	}
	function modificar(art,tr){
		haymodificacion=tr; //art.linea;
		//var art=pedido_act.articulo(trart.linea); //.articulo;
		/*var d=hUtils.crearElemento({e:"div",a:{className:"divotrabs"},hijos:[{e:"h4",inner:"Modificar <br>"+art.unotr[1],c:{padding:"1em"}},
			{e:"div",a:{className:"right"}, hijos:[{e:"label",inner:"Cantidad:"},{e:"select",did:"cantidad"},{e:"button",a:{className:"btn btn-large btn-primary",onclick:confirmar}, inner:"<span class='icon-thumbs-up'></span> Confirmar"}]},
			{e:"a",did:"cerrar",a:{className:"cerrar",onclick:cerrarotr},hijos:[{e:"span",a:{className:"icon-cancel"}}] }]} ,marcootr);*/
		var d=hUtils.crearElemento({e:"div", hijos:[{e:"label",inner:"Cantidad:"},{e:"select",did:"cantidad"}]},marcootr);
		marcootr.idr=dameart(datosart.otros,art.otr[0]);
		marcootr.unotr=art.unotr;
		//marcootr.mimarco=d;
		for (var i=1;i<11;i++)
			marcootr.cantidad.options[i-1]=new Option(i);
		ClAlerta.marcar({tit:"Modificar: "+art.unotr[1],inteobj:d,f:confirmar});
		/*document.getElementById("conpedido").appendChild(d);
		window.setTimeout(function() {
			d.style.top="0%";
		},25);*/
		marcootr.cantidad.selectedIndex=art.cantidad-1;
	}
	
	return {
		clickeven:clickotr,
		modificar:modificar,
		inicio:function(p) {
			pedido_act=p; datosart=window.server.datosart;
		}
	}
})();
var ClOtrosx=(function() {
	var marcootx={},idxsel,hayerror=null,haymodificacion=null,datosart,hay_div_mata=null,pedido_act;
	function estaenmodi(tr,mar){
		if (pedido_act.dataDid(haymodificacion)==pedido_act.dataDid(tr) && mar==marcootx.mimarco)
			return true;
		return false;
	}
	function modificar(art,tr){
		haymodificacion=tr;//art.linea;
		//var art=pedido_act.articulo(trart.linea); //.articulo;
		idxsel=dameart(datosart.otrosx,art.otrx[0]);
		marcootx.titulomarotx.innerHTML=art.otrx[1]+" Modificación";
		marcootx.precio.innerHTML="Precio:0.00€";
		marcootx.selsalsa.options.length=0;
		if (art.otrx[3]!="No"){
			marcootx.divsalsax.style.display="block";
			marcootx.divsalsax.getElementsByTagName("label")[0].innerHTML=art.otrx[3]+":";
			var sx=datosart.salsasx[art.otrx[0]];
			var lon=sx.length;
			var ssx=0;
			for (var i=0;i<lon;i++){
				marcootx.selsalsa.options[i]=new Option(sx[i][1]);
				if (sx[i][0]==art.salsa[0]) ssx=i;
			}
			marcootx.selsalsa.selectedIndex=ssx;
		}else {
			marcootx.divsalsax.style.display="none";
		}
		marcootx.seltamas.options.length=0;
		if (art.otrx[4][0]=="Varios"){
			marcootx.divtamasx.style.display="block";
			var tx=datosart.tamax[art.otrx[0]];
			var lon=tx.length;
			for (var i=0;i<lon;i++){
				marcootx.seltamas.options[i]=new Option(tx[i][1]);
			}
		}else{
			marcootx.divtamasx.style.display="none";
		}
		marcootx.selespe.options.length=0;
		var lutx=datosart.unotrosx[art.otrx[0]],sex=0;
		var lon=lutx.length;
		marcootx.selespe.options[0]=new Option("Al Gusto"); //new Option("Selecciona...");
		for (var i=0;i<lon;i++){
			marcootx.selespe.options[i+1]=new Option(lutx[i][1]);
			if (art.unotrx && lutx[i][0]==art.unotrx[0]) sex=i+1;
		}
		if (art.unotrx ){
			marcootx.nomespe.id= dameart(datosart.unotrosx[art.otrx[0]],art.unotrx[0]);
			marcootx.nomespe.innerHTML="Especialidad: <b><small>"+art.unotrx[1]+"</small></b>";

		}else {
			marcootx.nomespe.id= null;
			marcootx.nomespe.innerHTML="Especialidad: <b><small>Al Gusto</small></b>";
			
		}
		marcootx.selespe.selectedIndex=sex;
		marcootx.selingres.options.length=0;
		var igx=datosart.ingresx[art.otrx[0]];
		lon=igx.length;
		marcootx.selingres.options[0]=new Option("Selecciona...");
		for (var i=0;i<lon;i++){
			marcootx.selingres.options[i+1]=new Option(igx[i][1]);
		}
		lon=art.ings.length
		marcootx.losingres.innerHTML="";
		for (var i=0;i<lon;i++){
			var ig=dameart(igx, art.ings[i][0]);
			var tx=igx[ig][1];
			var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:ig,title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}}, {e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
			/*var li=document.createElement("li");
			li.innerHTML="<a id="+ig+" title='Eliminar "+igx[ig][1]+"'>"+igx[ig][1]+"<span  class='icon-remove'></span></a>";
			li.onclick=eliminaringre;*/
			marcootx.losingres.appendChild(li);
		}
		marcootx.cantidad.selectedIndex=art.cantidad-1;
		ClPrin.desopcsel(marcootx.mimarco,{obj:"otrx",nobj:idxsel,nom:art.otrx[1]});
	}
	function pintartsi(ds,otx) {

		//var ds=document.createElement("div");
		var h=document.createElement("h5");
		h.className="vlargo";
		if (otx[4][0]=="Varios"){
			h.innerHTML="Tamaños";
			ds.appendChild(h);
			var tx=datosart.tamax[otx[0]];
			var lon=tx.length;
			for (var i=0;i<lon;i++){
				var la=document.createElement("p");
				la.className="vlargo";
				la.innerHTML="<label>"+tx[i][1]+"</label><br>Precio Base:"+fontPrecio(tx[i][2])+" | Precio Ing.:"+fontPrecio(tx[i][3]);
				ds.appendChild(la);
			}
		}else {
			h.innerHTML="Tamaño Unico:";
			ds.appendChild(h);
			var la=document.createElement("label");
			la.className="vlargo";
			la.innerHTML="Precio Base:"+fontPrecio(otx[4][1])+" | Precio Ing.:"+fontPrecio(otx[4][2]);
			ds.appendChild(la);
		}
		if (otx[3]!="No"){
			h=document.createElement("h5");
			h.className="vlargo";
			h.innerHTML=otx[3]+"s:";
			ds.appendChild(h);
			var sx=datosart.salsasx[otx[0]];
			var lon=sx.length;
			var te=sx[0][1];
			for (var i=1;i<lon;i++){
				te+=", "+sx[i][1];
			}
			var la=document.createElement("label");
			la.className="vlargo";
			la.innerHTML=te;
			ds.appendChild(la);
		}
		h=document.createElement("h5");
		h.className="vlargo";
		h.innerHTML="Ingredientes:";
		ds.appendChild(h);
		var ix=datosart.ingresx[otx[0]];
		var lon=ix.length;
		var te=ix[0][1];
		for (var i=1;i<lon;i++){
			te+=", "+ix[i][1];
		}
		var la=document.createElement("label");
		la.className="vlargo";
		la.innerHTML=te+"<hr>";
		ds.appendChild(la);
		return ds;
	}
	function selotrxadd(e){
		var ids=this.parentNode.getAttribute("data-idotrx").split("-");
		var tasal=this.getAttribute("data-tasal").split(","),xxidxsel=parseInt(ids[0],10),xxespe=parseInt(ids[1],10),ta=parseInt(tasal[0],10),haysal=parseInt(tasal[1],10),otx=datosart.otrosx[xxidxsel],can=this.parentNode.parentNode.getElementsByTagName("select")[0].selectedIndex+1;
		var unid=datosart.otrosx[xxidxsel][0].toString();
		var unotrx=datosart.unotrosx[unid][xxespe];
		var lon=unotrx[4].length,lings=[];
		var lxigx=datosart.ingresx[otx[0]];
		for (var i=0;i<lon;i++){
			lings.push(lxigx[dameart(lxigx, unotrx[4][i])] );
		}
		pedido_act.nuevoarti(new Clpedart.ClaseOtrx(xxidxsel,xxespe,ta,haysal,lings,can));
		//ClTaste("Se a añadido a tu pedido:<br>"+(can+1)+" <span>"+arti.nombre()+"<span>");
		this.parentNode.parentNode.removeChild(this.parentNode);
		hay_div_mata=null;
	}
	function borrdivtamaotrx(e,ti){
		//this.parentNode.parentNode.removeChild(this.parentNode);
		hay_div_mata.className="div-matas div-matas-hidden";
		var ti2=ti || 500;
		window.setTimeout(function() {hay_div_mata.parentNode.removeChild(hay_div_mata); hay_div_mata=null; },ti2);
	}
	function clickadd(e){
		var ti=50,art=this;
		var ids=art.getAttribute("data-idotrx");
			
		if (hay_div_mata){
			borrdivtamaotrx(null,50);
			var atrpi=hay_div_mata.getAttribute("data-idotrx");
			//hay_div_mata.parentNode.removeChild(hay_div_mata);
			//hay_div_mata=null;
			if ( atrpi==ids )
				return;
			ti=100;
		}
		var divmt=hUtils.crearElemento({e:"div",a:{className:"div-matas div-matas-hidden"},atr:{"data-idotrx":ids}, hijos:[{e:"div",inner:"&nbsp;&nbsp;Selecciona Tamaño:"},{e:"a",a:{className:"cerrar",onclick:borrdivtamaotrx},hijos:[{e:"span",a:{className:"icon-cancel"}}]},{e:"span"}]});
		ids=ids.split("-");
		var xxidxsel=parseInt(ids[0],10),xxespe=parseInt(ids[1],10),otx=datosart.otrosx[xxidxsel],haysal=(otx[3]!="No"),lings=[];
		var unid=datosart.otrosx[xxidxsel][0].toString();
		var unotrx=datosart.unotrosx[unid][xxespe];
		var lon=unotrx[4].length;
		var lxigx=datosart.ingresx[otx[0]];
		for (var i=0;i<lon;i++){
			lings.push(lxigx[dameart(lxigx, unotrx[4][i])] );
		}
		if (haysal){
			var arrsal=datosart.salsasx[otx[0]];
			haysal=dameart(arrsal,unotrx[3]);
		} else haysal=-1;
		if (otx[4][0]=="Varios"){
			var tx=datosart.tamax[otx[0]];
			var lon=tx.length;
			for (var i=0;i<lon;i++){
				var arti=new Clpedart.ClaseOtrx(xxidxsel,xxespe,i,haysal,lings,1);
				var aa=document.createElement("a");
				aa.className="sel-div-mata";
				aa.setAttribute("data-tasal",i+","+haysal);
				aa.innerHTML=tx[i][1]+" : "+fontPrecio(Number(arti.precio()).toFixed(2));
				aa.onclick=selotrxadd;
				divmt.appendChild(aa);
			}
		}else{
			var arti=new Clpedart.ClaseOtrx(xxidxsel,xxespe,-1, haysal  ,lings,1);
			var aa=document.createElement("a");
			aa.className="sel-div-mata";
			aa.setAttribute("data-tasal","-1,"+haysal);
			aa.innerHTML="Unico : "+fontPrecio(Number(arti.precio()).toFixed(2));
			aa.onclick=selotrxadd;
			divmt.appendChild(aa);
		}
		this.parentNode.appendChild(divmt);
		window.setTimeout(function() {hay_div_mata=divmt; hay_div_mata.className="div-matas div-matas-vis";},ti);
	}
	function clickotx(e,numidsel){
		if (numidsel) {
			idxsel=numidsel;
			var ids=0;
		}else {
			var art=this;
			var ids=art.getAttribute("data-idotrx").split("-");
			idxsel=parseInt(ids[0],10);
		}
		if (ids[1]!="x"){
			var unid=datosart.otrosx[idxsel][0].toString();

			var unotrx=datosart.unotrosx[unid][parseInt(ids[1],10)];
			//console.log("es un otrosx "+datosart.otrosx[idxsel][1]+" xxxx y su id ="+unotrx[0]+", nombre="+unotrx[1]);
			pintaotx(unotrx, ids[1]);
		}else
			pintaotx(null, null);

		marcootx.titulomarotx.innerHTML=datosart.otrosx[idxsel][1]+" Nueva";
		//marcootx.precio.innerHTML="Precio:0.00€";
		marcootx.cantidad.selectedIndex=0;
			/*if (hayerror){
				marcopizza.mimarco.removeChild(hayerror);
				hayerror=null;
			}*/
		/*haymodificacion=null;
		if (hayerror){
			marcootx.mimarco.removeChild(hayerror);
			hayerror=null;
		}*/
		calcularprecio(null,true);

		ClPrin.desopcsel(marcootx.mimarco,{obj:"otrx",nom:datosart.otrosx[idxsel][1], nobj:idxsel});
		ClPrin.iraprin();
		//console.log("es un otrosx y su id ="+datosart.otrosx[art.idotrx][0]+", nombre="+datosart.otrosx[art.idotrx][1]); // art.getAttribute("data-otr"));
	}
	function errorotx(s){
		hayerror=document.createElement("div");
		hayerror.className="error";
		hayerror.innerHTML="<span class='icon-sad' ></span>"+s;
		marcootx.precio.innerHTML="Precio:?.??";
		marcootx.mimarco.insertBefore(hayerror,marcootx.precio);
	}
	function eliminaringre() {
		this.parentNode.parentNode.removeChild(this.parentNode);
		calcularprecio(null,true);
	}
	function pintaotx(unx,iunx){
		var otx=datosart.otrosx[idxsel];
		marcootx.selsalsa.options.length=0;
		if (otx[3]!="No"){
			marcootx.divsalsax.style.display="block";
			//marcootx.selsalsa.onchange=clicksalsa;
			marcootx.divsalsax.getElementsByTagName("label")[0].innerHTML=otx[3]+":";
			var sx=datosart.salsasx[otx[0]];
			var lon=sx.length;
			var ssx=0;
			for (var i=0;i<lon;i++){
				marcootx.selsalsa.options[i]=new Option(sx[i][1]);
				if (unx!=null && sx[i][0]==unx[3]) ssx=i;
			}
			marcootx.selsalsa.selectedIndex=ssx;
		}else {
			marcootx.divsalsax.style.display="none";
			//marcootx.selsalsa.onchange=null;
		}
		marcootx.seltamas.options.length=0;
		if (otx[4][0]=="Varios"){
			marcootx.divtamasx.style.display="block";
			var tx=datosart.tamax[otx[0]];
			var lon=tx.length;
			for (var i=0;i<lon;i++){
				marcootx.seltamas.options[i]=new Option(tx[i][1]);
			}
		}else{
			marcootx.divtamasx.style.display="none";
		}
		marcootx.selespe.options.length=0;
		/*if (unx) {
			marcootx.nomespe.id=iunx;
			marcootx.nomespe.innerHTML="Especialidad: <b><small>"+unx[1]+"</small></b>";
		}else
			marcootx.nomespe.innerHTML="Especialidad:";*/
		var lutx=datosart.unotrosx[otx[0]];
		var lon=lutx.length;
		marcootx.selespe.options[0]=new Option("Al Gusto");
		for (var i=0;i<lon;i++){
			marcootx.selespe.options[i+1]=new Option(lutx[i][1]);
		}
		marcootx.selingres.options.length=0;
		var igx=datosart.ingresx[otx[0]];
		lon=igx.length;
		marcootx.selingres.options[0]=new Option("Selecciona...");
		for (var i=0;i<lon;i++){
			marcootx.selingres.options[i+1]=new Option(igx[i][1]);
		}
		marcootx.losingres.innerHTML="";
		if (unx!=null) {
			marcootx.nomespe.id=parseInt(iunx,10);
			marcootx.nomespe.innerHTML="Especialidad: <b><small>"+unx[1]+"</small></b>";
			marcootx.selespe.selectedIndex=parseInt(iunx,10)+1;
			lon=unx[4].length
			
			var lxigx=datosart.ingresx[otx[0]];
			for (var i=0;i<lon;i++){
				var ig=dameart(lxigx, unx[4][i]);
				var tx=lxigx[ig][1];
				var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:ig,title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}},{e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
				/*var li=document.createElement("li");
				li.innerHTML="<a id="+ig+" title='Eliminar "+lxigx[ig][1]+"'>"+lxigx[ig][1]+"<span  class='icon-remove'></span></a>";
				li.onclick=eliminaringre;*/
				marcootx.losingres.appendChild(li);
			}
		}else {
			marcootx.nomespe.innerHTML="Especialidad:Al Gusto";
			marcootx.nomespe.id=null;
			marcootx.selespe.selectedIndex=0;
		}
	}
	function pintaespe(iunx){
		marcootx.losingres.innerHTML="";
		//if (iunx>-1){
			var otx=datosart.otrosx[idxsel];
			var unx=datosart.unotrosx[otx[0]][iunx];
			marcootx.nomespe.id=iunx;
			marcootx.nomespe.innerHTML="Especialidad: <b><small>"+unx[1]+"</small></b>";
			var lon=unx[4].length;
			
			var lxigx=datosart.ingresx[otx[0]];
			for (var i=0;i<lon;i++){
				var ig=dameart(lxigx, unx[4][i]);
				var tx=lxigx[ig][1];
				var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:ig,title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}},{e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
				/*var li=document.createElement("li");
				li.innerHTML="<a id="+ig+" title='Eliminar "+lxigx[ig][1]+"'>"+lxigx[ig][1]+"<span  class='icon-remove'></span></a>";
				li.onclick=eliminaringre;*/
				marcootx.losingres.appendChild(li);
			}
			if (otx[3]!="No"){
				var sx=datosart.salsasx[otx[0]];
				lon=sx.length;
				for (var i=0;i<lon;i++){
					if (sx[i][0]==unx[3]){
						marcootx.selsalsa.selectedIndex=i;
						break;
					}
				}
			}
		
	}
	function clickespe(ev){
		//if (this.selectedIndex==0) return;
		if (hayerror){
			marcootx.mimarco.removeChild(hayerror);
			hayerror=null;
		}
		if (this.selectedIndex > 0)
			pintaespe(this.selectedIndex-1);
		else{
			marcootx.nomespe.id=null;
			marcootx.nomespe.innerHTML="Especialidad: <b><small>Al Gusto</small></b>";
		}
		calcularprecio(null,true);
		//this.selectedIndex=0;
	}
	//function clicksalsa(ev){
	//	if (this.selectedIndex==0) return;
		/*var otx=datosart.otrosx[idxsel];
		var sx=datosart.salsasx[otx[0]];
		var valorsx=sx[this.selectedIndex-1][2];*/

	//}
	function anadiringre(){
		var o=datosart.otrosx[idxsel][0];
		var tx=datosart.ingresx[o][parseInt(this.id,10)][1];
		var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:this.id,title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}},{e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
		marcootx.losingres.insertBefore(li,this.parentNode); // appendChild(li);
		calcularprecio(null,true);
	}
	function clickingres(ev){
		if (this.selectedIndex==0) return;
		//var li=document.createElement("li");
		var tx=this.options[this.selectedIndex].text;
		var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:(this.selectedIndex-1),title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}},{e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
		/*li.innerHTML="<a id="+(this.selectedIndex-1)+" title='Eliminar "+tx+"'>"+tx+"<span  class='icon-remove'></span></a>";
		li.onclick=eliminaringre;*/
		marcootx.losingres.appendChild(li);
		this.selectedIndex=0;
		calcularprecio(null,true);
	}
	function dameingres(o){
		var gs=marcootx.losingres.getElementsByTagName("li");
		var lgs=[];
		for (var i=0,lon=gs.length;i<lon;i++){
			lgs.push(datosart.ingresx[o][parseInt(gs[i].getElementsByTagName("a")[0].id,10)]);
		}
		return lgs;

	}
	function calcularprecio(e,ehr) {
		if (hayerror){
			marcootx.mimarco.removeChild(hayerror);
			hayerror=null;
		}
		var err="";
		var hayta=marcootx.divtamasx.style.display=="block";
		if ( hayta && marcootx.seltamas.selectedIndex==0)
			err+="Debes de seleccionar un Tamaño<br>";
		//if (! marcootx.nomespe.id )
		//	err+="Debes de seleccionar una Especialidad aunque luego cambies los ingredientes<br>";
		var haysal=marcootx.divsalsax.style.display=="block";
		var otx=datosart.otrosx[idxsel];
		//if (haysal && marcootx.selsalsa.selectedIndex==0)
		//	err+="Debes de seleccionar una "+otx[3]+"<br>";
		if (err.length>0){
			if (!ehr)
				errorotx(err);
			return;
		}
		if (hayta){
			var preba=datosart.tamax[otx[0]][marcootx.seltamas.selectedIndex][2];
			var preing=datosart.tamax[otx[0]][marcootx.seltamas.selectedIndex][3];
		}else {
			var preba=otx[4][1];
			var preing=otx[4][2];
		}
			
		var preis=haysal ? datosart.salsasx[otx[0]][marcootx.selsalsa.selectedIndex][2]*preing : 0;
		var lings=dameingres(otx[0]);
		for (var i=0,lon=lings.length;i<lon;i++){
			preis+=lings[i][2]*preing;
		}
		//console.log("marcootx.selespe.selectedIndex="+(marcootx.selespe.selectedIndex-1));
		var can=marcootx.cantidad.selectedIndex, arti=new Clpedart.ClaseOtrx(idxsel,marcootx.selespe.selectedIndex > 0 ? marcootx.selespe.selectedIndex-1 : null,(hayta ? marcootx.seltamas.selectedIndex : -1),( haysal ? marcootx.selsalsa.selectedIndex : -1) ,lings,can+1);
		var prea=arti.precio();
		marcootx.precio.innerHTML="Precio:"+fontPrecio(Number(prea-(prea*can)).toFixed(2));
		if (!ehr){
			if (haymodificacion==null)
				pedido_act.nuevoarti(arti);
			else
				haymodificacion=pedido_act.modificar(arti,haymodificacion);
			//marcootx.precio.innerHTML="Precio:"+fontPrecio(Number(preis+preba).toFixed(2));
			ClPrin.ultimomar();
		}
	}
	function vistaOtrx(){
		var mimarco=hUtils.crearElemento({e:"div", a:{className:"marcopizza"},
				hijos:[{e:"h1",did:"titulomarotx",inner:"Nuevo"},
						{e:"div",did:"divtamasx",a:{className:"marmata"},hijos:[
						{e:"label", a:{htmlFor:"seltamasx"},inner:"Tamaños:"},
						{e:"select",did:"seltamas",a:{id:"seltamasx"}}]},
						{e:"div",did:"divsalsax",a:{className:"marmata"},hijos:[
						{e:"label",a:{htmlFor:"selsalsax"},inner:"Salsa:"},
						{e:"select",did:"selsalsa",a:{id:"selsalsax"}}]},
						{e:"div",a:{className:"mitades"},hijos:[{e:"div",hijos:[{e:"h5",inner:"Especialidad e Ingredientes"},
							{e:"label",did:"nomespe",a:{htmlFor:"selespex"},inner:"Especialidad:"},
							{e:"select",did:"selespe",a:{id:"selespex",onchange:clickespe}},
							{e:"label",a:{htmlFor:"selingresx"},inner:"Ingredientes:"},
							{e:"select",did:"selingres",a:{id:"selingresx",onchange:clickingres}},
							{e:"div",hijos:[{e:"ul",did:"losingres"},{e:"br",a:{className:"clear"}}]}]}]},
						{e:"div",did:"precio",a:{className:'right'},inner:"Precio:0.00€"},
						{e:"div",a:{className:"right"}, hijos:[{e:"label",inner:"Cantidad:"},{e:"select",did:"cantidad"},{e:"button",did:"confirmar",a:{className:"btn btn-large btn-primary",onclick:calcularprecio}, inner:"<span class='icon-addshop'></span> Confirmar"}]},
						{e:"a",a:{className:"cerrar",onclick:ClPrin.ultimomar},hijos:[{e:"span",a:{className:"icon-cancel"}}]}] },marcootx );
		for (var i=1;i<11;i++)
			marcootx.cantidad.options[i-1]=new Option(i);
		mimarco.style.display="none";
		marcootx.mimarco=mimarco;
		return mimarco;
	}
	function algusto(eotx) {
		var tx="";
		if (eotx[4][0]=="Varios")
			tx+="Elige el Tamaño.<br>";
		if (eotx[3]!="No")
			tx+="Elige la "+eotx[3]+".<br>";
		tx+="Añade los Ingredientes que más te gusten.";
		return tx;
	}
	function dametodo(eotx,eunox){
		var eee=eunox[4],te="";
		if (eee.length>0){
			var ix=datosart.ingresx[eotx[0]],lon=ix.length;
			for (var n=0;n<eee.length;n++)
				for (var i=0;i<lon;i++){
					if (eee[n]==ix[i][0])
						te+=ix[i][1]+", ";
				}
			te=te.substring(0,te.length-2);
		}
		if (eotx[3]!="No"){
			var dsx=datosart.salsasx[eotx[0]],sx="";
			for (var i=0;i<dsx.length;i++)
				if (dsx[i][0]==eunox[3] ){
					sx=dsx[i][1];
					break;
				}
			return eotx[3]+" "+sx+", "+te;
		}
		return te;
	}

	return {
		inicio:function(p) { pedido_act=p; datosart=window.server.datosart; },
		pintar:pintartsi,
		dametodo:dametodo,
		algusto:algusto,
		domarcootx:vistaOtrx,
		clickeven:clickotx,
		clickadd:clickadd,
		modificar:modificar,
		estaenmodi:estaenmodi,
		abrireditar:clickotx
	}
})();
var ClPizzas=(function(){
	var marcopizza={},hayerror=null,haymodificacion=null,hay_div_mata=null,datosart,startx,pedido_act;
	var marcoingredientes=null;//new lineasmarIng(datosart.ingres);
	function pintarmodimitad(m,nm,art){
		
		if (art.mitades[nm].espe){
			m.nomespe.id=dameart(datosart.piz,art.mitades[nm].espe[0]);
			m.nomespe.innerHTML="Especialidad: <b><small>"+art.mitades[nm].espe[1]+"</small></b>";
			m.selespe.selectedIndex=parseInt(m.nomespe.id,10)+1;
		} else {
			m.nomespe.id=null;
			m.nomespe.innerHTML="Especialidad: <b><small>Al Gusto</small></b>";
			m.selespe.selectedIndex=0;
		}
		if (art.mitades[nm].salsa ){
			m.nomsalsa.innerHTML= "Salsa: <b>"+art.mitades[nm].salsa[1]+"</b>";
			m.nomsalsa.id=dameart(datosart.sal,art.mitades[nm].salsa[0]);
			m.selsalsa.selectedIndex=parseInt(m.nomsalsa.id,10)+1;
		}else {
			m.nomsalsa.innerHTML= "Sin Salsa</b>";
			m.nomsalsa.id=null;
			m.selsalsa.selectedIndex=0;
		}
		selqueso(m,art.mitades[nm].queso);
		var lon=art.mitades[nm].ings.length;
		m.losingres.innerHTML="";
		
		for (var i=0;i<lon;i++){
			var ig=dameart(datosart.ingres,art.mitades[nm].ings[i][0]);
			var tx=art.mitades[nm].ings[i][1];
			var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:ig,title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}}, {e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}] },null);
			/*var li=document.createElement("li");
			var ali=document.createElement("a");
			ali.id=ig;
			ali.title="Añadir más "+art.mitades[nm].ings[i][1];
			ali.innerHTML=art.mitades[nm].ings[i][1];
			var sli=document.createElement("span");
			sli.className="icon-remove";
			sli.onclick=eliminaringre;
			sli.onclick=anadiringre;
			ali.appendChild(sli);

			li.innerHTML="<a id="+ig+" title='Eliminar "+art.mitades[nm].ings[i][1]+"'>"+art.mitades[nm].ings[i][1]+"<span  class='icon-remove'></span></a>";
			li.onclick=eliminaringre;*/
			m.losingres.appendChild(li);
		}
	}
	function estaenmodi(tr,mar){
		if (pedido_act.dataDid(haymodificacion)==pedido_act.dataDid(tr) && mar==marcopizza.mimarco)
			return true;
		return false;
	}
	function modificar(art,tr){
		haymodificacion=tr; //art.linea;
		//var art=pedido_act.articulo(trart.linea); //.articulo;
		marcopizza.titulomarpi.innerHTML="Modificar Pizza";


		if (art.mitades[1]==null){
			clickpizentmit.call(marcopizza.pizentera);
			pintarmodimitad(marcopizza.mitad1.mitad,0,art);
		}else{
			clickpizentmit.call(marcopizza.pizmitades);
			pintarmodimitad(marcopizza.mitad1.mitad,0,art);
			pintarmodimitad(marcopizza.mitad2.mitad,1,art);
		}
		marcopizza.selmasas.selectedIndex=dameart(datosart.masas,art.masa[0])+1;
		marcopizza.seltamas.selectedIndex=dameart(datosart.tamas,art.tama[0])+1;
		marcopizza.precio.innerHTML="Precio:"+fontPrecio(art.precio().toFixed(2)); // 0.00€";
		marcopizza.cantidad.selectedIndex=0;
		if (hayerror){
			marcopizza.conrealpizza.removeChild(hayerror);
			//marcopizza.mimarco.removeChild(hayerror);
			hayerror=null;
		}
		cerrarmaring(false)();
		ClPrin.desopcsel(marcopizza.mimarco,{obj:"pizzas"});
	}
	function masmenos(){
		this.valor=0;
		this.bot={};
		this.conte=hUtils.crearElemento({e:"div",a:{className:"masmenos"},hijos:[
			{e:"button", did:"menos",inner:"<span class='icon-minus'></span>",a:{onclick:this.clickmenos(this)}},
			{e:"span",did:"valortx",inner:"0"},
			{e:"button",did:"mas",inner:"<span class='icon-plus'></span>",a:{onclick:this.clickmas(this)}}]},this.bot);
		this.bot.menos.disabled=true;
	}
	masmenos.prototype.clickmenos=function(ele) {
		return function(ev){
			if (ele.valor>0){
				ele.valor--;
				ele.bot.valortx.innerHTML=ele.valor;
				if (ele.valor==0) {ele.bot.menos.disabled=true;ele.bot.valortx.className=""; }
				ele.bot.mas.disabled=false;
			}
		}
	}
	masmenos.prototype.clickmas=function(ele) {
		return function(ev){
			if (ele.valor<9){
				ele.valor++;
				 ele.bot.menos.disabled=false;
				 ele.bot.valortx.className="btn-info";
				ele.bot.valortx.innerHTML=ele.valor;
				if (ele.valor==9) {ele.bot.mas.disabled=true;  }
			}
		}
	}
	function lineasmarIng(arr){
		this.ings=[];
		this.activo=null;
		//this.conte=document.createElement("div");
		//this.conte.className="marcoing";
		for (var i=0,lon=arr.length;i<lon;i++){
			var dl=document.createElement("div");
			dl.className="lineaing";
			var ding=document.createElement("a");
			ding.className="datoing";
			ding.innerHTML=arr[i][1];
			dl.appendChild(ding)
			var mm=new masmenos();
			dl.dat_art={id:i,obj:mm};
			dl.appendChild(mm.conte);
			marcopizza.marcoing.appendChild(dl);
			//this.conte.appendChild(dl);
			this.ings.push(dl);
		}
		var dr=document.createElement("br");
		dr.className="clear";
		marcopizza.marcoing.appendChild(dr);
		//this.conte.appendChild(dr);
	}
	lineasmarIng.prototype.limpiar=function() {
		for (var i=0,lon=this.ings.length;i<lon;i++){
			var elobj=this.ings[i].dat_art.obj;
			elobj.valor=0;
			elobj.bot.valortx.className="";
			elobj.bot.valortx.innerHTML="0";
			elobj.bot.menos.disabled=true;
			elobj.bot.mas.disabled=false;
		}

	}
	function cerrarmaring(re,iratras) {
		return function(ev){
			if (iratras && window.history.pushState){
				window.history.back();
				return;
			}
			marcopizza.conmaring.style.left="-"+marcopizza.conmaring.offsetWidth+"px"; //+  "-100%";
			window.setTimeout( function(){ marcopizza.conmaring.style.display="none";
				 },400);
			marcopizza.conrealpizza.style.display="block";
			if (re){
				//var ling=dameingres(marcoingredientes.activo);
				var mli=marcoingredientes.ings,lon=mli.length,mi=marcopizza["mitad"+marcoingredientes.activo].mitad.losingres;
				mi.innerHTML="";
				for (var i=0;i<lon;i++){
					for (var n=0;n<mli[i].dat_art.obj.valor;n++){
						//var li=document.createElement("li");
						var tx=datosart.ingres[mli[i].dat_art.id][1];
						var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:i,title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}}, {e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
						/*li.innerHTML="<a id="+i+" title='Eliminar "+tx+"'>"+tx+"<span  class='icon-remove'></span></a>";
						li.onclick=eliminaringre;	*/
						mi.appendChild(li);
					}
				}
			}
			marcoingredientes.activo=null;
			calcularprecio(null,true);
			
			//ClPrin.salirmaring();
			/*if (re!=="iratras" && hUtils.his.state && hUtils.his.state.nve && hUtils.his.state.nve > 1){
				//console.log("voy atras en marcoingredientresssss");
				hUtils.his.back();
			}*/
		}
	}
	function sacarmarcoing(mi){
		return function(ev){
			if (marcoingredientes.activo==null){
				
				var mm2=haymitades();
				marcopizza.titmaring.innerHTML="Ingredientes "+(mm2[0] ? mi+"ª Mitad" : "Pizza");
				marcoingredientes.limpiar();
				var gs=marcopizza["mitad"+mi].mitad.losingres.getElementsByTagName("li");
				for (var i=0,lon=gs.length;i<lon;i++){
					var eid=parseInt(gs[i].getElementsByTagName("a")[0].id,10);
					var elobj=marcoingredientes.ings[eid].dat_art.obj;
					elobj.clickmas(elobj)();
				}
				marcopizza.conmaring.style.display="block";
				marcopizza.conmaring.style.left="-"+marcopizza.conmaring.offsetWidth+"px";
				window.setTimeout( function(){marcopizza.conmaring.style.left="0px"; marcopizza.conrealpizza.style.display="none";},40);
				marcoingredientes.activo=mi;
				hUtils.his.pushState({page:null,nompage:"/Pizzas/editar/ingredientes"},"Ingredientes Pizza", "editar/ingredientes");
				ClPrin.ponerultruta("Pizzas/editar/ingredientes");
				/*console.log("abro marco ingredientes state=",window.history.state);
				if (hUtils.his.state && hUtils.his.state.nve && hUtils.his.state.nve < 2){
					console.log("hago push en marcoingredientes");
					var wlpn=window.location.pathname;
					hUtils.his.replaceState({page:hUtils.his.state.page,nve: 2,nompage:hUtils.his.state.nompage},hUtils.his.state.nompage,wlpn.substring(0,wlpn.lastIndexOf("/")+1)+hUtils.his.state.nompage);
						//,wlpn.substring(wlpn.lastIndexOf("/")+1,wlpn.length),wlpn);
					ClPrin.whPush(3);
				}*/
				//ClPrin.ir_a_Pizzas();
				ClPrin.iraprin();
			}
		}
	}
	function damesalsa(epi){
		for (var s in datosart.sal){
			if (epi[3]==datosart.sal[s][0]) return datosart.sal[s][1];
		}
		return "Desconocida";
	}
	function dameingres(epi){
		var lon=epi[5].length;
		if (lon==0) return "";
		var tex="";
		for (var e=0;e<lon;e++)
			for (var g in datosart.ingres){
				if (epi[5][e]==datosart.ingres[g][0]){
					tex+=", "+datosart.ingres[g][1];break;
				}
			}
		if (tex.length==0)
			return "Desconocida";
		else 
			return tex;
		
	}
	function damequeso(epi){
		if (epi[4]) return "queso mozarella";
		else return "sin queso";
	}
	
	function dameingresmitad(m){
		var gs=m.getElementsByTagName("li");
		var lgs=[];
		for (var i=0,lon=gs.length;i<lon;i++){
			//var igs=dameart(datosart.ingres,parseInt(gs[i].getElementsByTagName("a")[0].id));
			lgs.push(datosart.ingres[parseInt(gs[i].getElementsByTagName("a")[0].id,10)]);
		}
		return lgs;

	}
	function damematas(epi){
		if (epi[6].length<1)
			return "Todas";
		var lon2=datosart.matas.length,tex="",lonma=datosart.masas.length,lonta=datosart.tamas.length;
		for (var i=0,lon=epi[6].length;i<lon;i++)
			for (var n=0;n<lon2;n++)
				if (datosart.matas[n][0]==epi[6][i]){
					var mb=datosart.matas[n][1],tb=datosart.matas[n][2];
					for (var m=0;m<lonma;m++)
						if (datosart.masas[m][0]==mb){
							mb=datosart.masas[m][1];break;
						}
					for (var m=0;m<lonta;m++)
						if (datosart.tamas[m][0]==tb){
							tb=datosart.tamas[m][1];break;
						}
					tex+=mb+" "+tb+", ";break;
				}
			
		return tex.substring(0,tex.length-2);
	}
	function dametodo(epi){
		return "Salsa "+damesalsa(epi)+", "+damequeso(epi)+dameingres(epi)+"<br><b>Masas:</b> <span>"+damematas(epi)+"</span>";
	}
	function anadiringre(){
		var tx=datosart.ingres[parseInt(this.id,10)][1];
		var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:this.id,title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}}, {e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
		this.parentNode.parentNode.insertBefore(li,this.parentNode); //appendChild(li);
		calcularprecio(null,true);
	}
	function eliminaringre() {
		this.parentNode.parentNode.removeChild(this.parentNode);
		calcularprecio(null,true);
	}
	function selqueso(mi,hq){
		var qs=mi.sinqueso,nqs=mi.conqueso;
		if (hq){
			qs=mi.conqueso,nqs=mi.sinqueso;
		}
		qs.className="select";
		qs.getElementsByTagName("span")[0].className="icon-checkmark";
		qs.onclick=null;
		nqs.className="noselect";
		nqs.getElementsByTagName("span")[0].className="";
		nqs.onclick=clickqueso(mi==marcopizza.mitad1.mitad ? 1 : 2,!hq);
	}
	function limpiarmitad(mi){
		mi.losingres.innerHTML="";
		mi.nomespe.innerHTML="Especialidad:Al Gusto";
		mi.nomespe.id=null;
		mi.selespe.selectedIndex=0;
		mi.nomsalsa.id=null;
		mi.selsalsa.selectedIndex=0;
		mi.nomsalsa.innerHTML="Salsa:Sin Salsa";
		//marcopizza.seltamas.selectedIndex=0;
		//marcopizza.selmasas.selectedIndex=0;
		selqueso(mi,true);
	}
	function calpreXX(datapiz,datamata){
		var nepi=parseInt(datapiz,10), epi=datosart.piz[nepi],ss=dameart(datosart.sal,epi[3]),idmt=parseInt(datamata,10),lings=[];
		for (var i=0,lon=epi[5].length;i<lon;i++){
			lings.push(datosart.ingres[dameart(datosart.ingres,epi[5][i])]);
		}
		var arti=new Clpedart.ClasePizza(new Clpedart.ClaseMitad(nepi,ss,lings,epi[4]),null,idmt,1);
		return fontPrecio(Number(arti.precio()).toFixed(2));
	}
	function selpizadd(e){
		var nepi=parseInt(this.parentNode.getAttribute("data-piz"),10), epi=datosart.piz[nepi],ss=dameart(datosart.sal,epi[3]),idmt=parseInt(this.getAttribute("data-mata"),10),lings=[];
		for (var i=0,lon=epi[5].length;i<lon;i++){
			lings.push(datosart.ingres[dameart(datosart.ingres,epi[5][i])]);
		}
		var m1=new Clpedart.ClaseMitad(nepi,ss,lings,epi[4]);
		var arti=new Clpedart.ClasePizza(m1,null,idmt,1),can=this.parentNode.parentNode.getElementsByTagName("select")[0].selectedIndex;
		if (can>0 )
			for (var i=0;i<can;i++){
				pedido_act.nuevoarti(new Clpedart.ClasePizza(m1,null,idmt,1),true);
			}
		pedido_act.nuevoarti(arti,true);
		ClTaste("Se a añadido a tu pedido:<br>"+(can+1)+" <span>"+arti.nombre()+"<span>");
		this.parentNode.parentNode.removeChild(this.parentNode);
		hay_div_mata=null;
	}
	function borrdivmatas(e,ti){
		//this.parentNode.parentNode.removeChild(this.parentNode);
		hay_div_mata.className="div-matas div-matas-hidden";
		var ti2=ti || 500;
		window.setTimeout(function() {hay_div_mata.parentNode.removeChild(hay_div_mata); hay_div_mata=null; },ti2);
	}
	function clickadd(e){
		var ti=50;
		if (hay_div_mata){
			borrdivmatas(null,50);
			var atrpi=hay_div_mata.getAttribute("data-piz");
			//hay_div_mata.parentNode.removeChild(hay_div_mata);
			//hay_div_mata=null;
			if ( atrpi==this.getAttribute("data-idpiz") )
				return;
			ti=100;
		}
		var epi=datosart.piz[parseInt(this.getAttribute("data-idpiz"),10)],datapiz=this.getAttribute("data-idpiz");
		var divmt=hUtils.crearElemento({e:"div",a:{className:"div-matas div-matas-hidden"},atr:{"data-piz":datapiz}, hijos:[{e:"div",inner:"&nbsp;&nbsp;Selecciona Masa - Tamaño:"},{e:"a",a:{className:"cerrar",onclick:borrdivmatas},hijos:[{e:"span",a:{className:"icon-cancel"}}]},{e:"span"}]});
		if (epi[6].length<1)
			var lon=datosart.matas.length,todas=true;
		else 
			var lon=epi[6].length,todas=false;
		for (var mt=0;mt<lon;mt++){
			if (todas)
				var imt=mt;
			else
				var imt=dameart(datosart.matas,epi[6][mt]);
			var ima=dameart(datosart.masas,datosart.matas[imt][1]);
			var ita=dameart(datosart.tamas,datosart.matas[imt][2]);
			var aa=document.createElement("a");
			aa.className="sel-div-mata";
			aa.setAttribute("data-mata",imt);
			aa.innerHTML=datosart.masas[ima][1]+"-"+datosart.tamas[ita][1]+" : "+calpreXX(datapiz,imt);
			aa.onclick=selpizadd;
			divmt.appendChild(aa);
		}
		
		this.parentNode.appendChild(divmt);
		window.setTimeout(function() {hay_div_mata=divmt; hay_div_mata.className="div-matas div-matas-vis";},ti);
	}
	function clickpizza(e){
			var art=this;
			//console.log("es una pizza y su id ="+art.getAttribute("data-piz"));
			cambiarbotentmit(marcopizza.pizentera,marcopizza.pizmitades);
			var lami=marcopizza.mitad1.mitad;
			lami.elimit.style.display="none";
			marcopizza.mitad2.mitad.elimit.style.display="none";
			marcopizza.mitad2.ele.className="mitad oculta lasdos";
			//marcopizza.mitad2.ele.style.display="none";
			marcopizza.mitad2.mitad.titmitad.innerHTML="Entera";
			lami.titmitad.innerHTML="Entera";
			marcopizza.mitad1.ele.className="mitad visible sola";
			//marcopizza.mitad1.ele.style.display="inline-block";
			limpiarmitad(marcopizza.mitad2.mitad);
			marcopizza.seltamas.selectedIndex=0;
			marcopizza.selmasas.selectedIndex=0;
			//console.log("art=",art);
			//console.log("art.idpiz="+art.getAttribute("data-idpiz"));
			if (art.getAttribute("data-idpiz")=="x" )
				limpiarmitad(lami);
			else
				pintapizza(parseInt(art.getAttribute("data-idpiz"),10),lami);// getAttribute("data-piz")),lami);
			//lami.nomespe.id=p[0];
			//lami.nomespe.innerHTML="Especialidad: <b><small>"+p[1]+"</small></b>";
			marcopizza.titulomarpi.innerHTML="Pizza Nueva";
			//marcopizza.precio.innerHTML="Precio:0.00€";
			marcopizza.cantidad.selectedIndex=0;
			if (hayerror){
				marcopizza.conrealpizza.removeChild(hayerror);
				//marcopizza.mimarco.removeChild(hayerror);
				hayerror=null;
			}
			cerrarmaring(false)();
			haymodificacion=null;
			calcularprecio(null,true);
			ClPrin.desopcsel(marcopizza.mimarco,{obj:"pizzas"});
			ClPrin.iraprin();
	}
	function clickingres(ev){
		if (this.selectedIndex==0) return;
		//var li=document.createElement("li");
		var tx=this.options[this.selectedIndex].text;
		var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:(this.selectedIndex-1),title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}}, {e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
		/*li.innerHTML="<a id="+(this.selectedIndex-1)+" title='Eliminar "+tx+"'>"+tx+"<span  class='icon-remove'></span></a>";
		li.onclick=eliminaringre;	*/
		if (this.id=="selingres1")
			marcopizza.mitad1.mitad.losingres.appendChild(li);
		else
			marcopizza.mitad2.mitad.losingres.appendChild(li);
		this.selectedIndex=0;
		calcularprecio(null,true);

	}
	function errorpizza(s){
		hayerror=document.createElement("div");
		hayerror.className="error";
		hayerror.innerHTML="<span class='icon-sad' ></span>"+s;
		marcopizza.precio.innerHTML="Precio:?.??";
		marcopizza.conrealpizza.appendChild(hayerror); // insertBefore(hayerror,marcopizza.precio);
		ClPrin.bajar();
		//marcopizza.mimarco.insertBefore(hayerror,marcopizza.precio);
	}
	/*function comprobarmitad(m,nm,mit) {
		var err="";
			if (! m.nomespe.id || m.nomespe.id=="null"){
				if (mit) err="Debes de seleccionar una especialidad en "+nm+"ª Mitad";
				else err="Debes de seleccionar una especialidad";
				err+=" aunque luego cambies los ingredientes.<br/>";
			}
			if (! m.nomsalsa.id || m.nomsalsa.id=="null")
				if (mit) err+="Debes de seleccionar una Salsa en "+nm+"ª Mitad.<br>";
				else err+="Debes de seleccionar una Salsa.<br>";
			return err;
	}*/
	function haymitades() {
		var mit=false,mitsel=marcopizza.mitad2.mitad,nm=2;
		if (marcopizza.mitad1.ele.className.indexOf("visible")>-1) // style.display!="none")
			if ( marcopizza.mitad2.ele.className.indexOf("visible")>-1) //style.display!="none")
				mit=true;
			else{
				mitsel=marcopizza.mitad1.mitad;
				nm=1;
			}
		return [mit,mitsel,nm];
	}
	function calcularprecio(e,ehr) {
		if (hayerror){
			marcopizza.conrealpizza.removeChild(hayerror);
			//marcopizza.mimarco.removeChild(hayerror);
			hayerror=null;
		}
		var err="";
		if (marcopizza.selmasas.selectedIndex==0)
			err+="Debes de seleccionar una Masa<br>";
		if (marcopizza.seltamas.selectedIndex==0)
			err+="Debes de seleccionar un Tamaño<br>";
		var hm=haymitades();
		/*if (hm[0]){
			err+=comprobarmitad(marcopizza.mitad1.mitad,1,true);
			err+=comprobarmitad(marcopizza.mitad2.mitad,2,true);
		}else
			err+=comprobarmitad(hm[1],hm[2]);*/
		if (err.length>0){
			if (!ehr)
				errorpizza(err);
			else
				marcopizza.precio.innerHTML="Precio:?.??";
			return;
		}
		var idma=datosart.masas[marcopizza.selmasas.selectedIndex-1][0];// parseInt(marcopizza.selmasas.options[marcopizza.selmasas.selectedIndex].value);
		var idta=datosart.tamas[marcopizza.seltamas.selectedIndex-1][0];//parseInt(marcopizza.seltamas.options[marcopizza.seltamas.selectedIndex].value);
		//console.log(" idma="+idma+", idta="+idta);
		//var lama=dameart(datosart.masas,idma);
		//var elta=dameart(datosart.tamas,idta);
		var lon=datosart.matas.length;
		for (var i=0;i<lon;i++){
			if (datosart.matas[i][1]==idma && datosart.matas[i][2]==idta){
				var preba=datosart.matas[i][3];
				var preing=datosart.matas[i][4];
				var indmata=i;
				break;
			}
		}
		if (!preba){
			err+="No existe masa "+marcopizza.selmasas.options[marcopizza.selmasas.selectedIndex].text+" con tamaño "+marcopizza.seltamas.options[marcopizza.seltamas.selectedIndex].text+"<br>";
		}
		if (err.length>0){
			errorpizza(err);
			return;
		}
		if (hm[0]){
			/*var sm1=marcopizza.mitad1.mitad.selsa.id;
			if (sm1 && sm1 !=="null" ){
				var preis= datosart.sal[parseInt(marcopizza.mitad1.mitad.nomsalsa.id)][2]*preing;
			}else {
				var preis=0;
				sm1=null;
			}*/
			var sm1=marcopizza.mitad1.mitad.selsalsa.selectedIndex;
			if (sm1 > 0){
				var preis= datosart.sal[parseInt(marcopizza.mitad1.mitad.nomsalsa.id,10)][2]*preing;
				sm1--;
			}else {
				var preis=0;
				sm1=null;
			}
			
			var lings=dameingresmitad(marcopizza.mitad1.mitad.losingres);
			for (var i=0,lon=lings.length;i<lon;i++){
				preis+=lings[i][2]*preing;
			}
			//marcopizza.mitad1.mitad.nomespe.id 
			var m1=new Clpedart.ClaseMitad(marcopizza.mitad1.mitad.selespe.selectedIndex > 0 ? marcopizza.mitad1.mitad.selespe.selectedIndex-1 : null,sm1,lings,marcopizza.mitad1.mitad.conqueso.className=="select");
			var sm2=marcopizza.mitad2.mitad.selsalsa.selectedIndex;
			if (sm2 > 0){
				preis= datosart.sal[parseInt(marcopizza.mitad2.mitad.nomsalsa.id,10)][2]*preing;
				sm2--;
			}else {
				preis=0;
				sm2=null;
			}
			//preis+=datosart.sal[parseInt(marcopizza.mitad2.mitad.nomsalsa.id)][2]*preing;
			lings=dameingresmitad(marcopizza.mitad2.mitad.losingres);
			for (var i=0,lon=lings.length;i<lon;i++){
				preis+=lings[i][2]*preing;
			}
			// marcopizza.mitad2.mitad.nomespe.id
			var m2=new Clpedart.ClaseMitad(marcopizza.mitad2.mitad.selespe.selectedIndex > 0 ? marcopizza.mitad2.mitad.selespe.selectedIndex-1 : null,sm2,lings,marcopizza.mitad2.mitad.conqueso.className=="select");
			var arti=new Clpedart.ClasePizza(m1,m2,indmata,1);
			if (!ehr && marcopizza.cantidad.selectedIndex>0 )
				for (var i=0;i<marcopizza.cantidad.selectedIndex;i++){
					pedido_act.nuevoarti(new Clpedart.ClasePizza(m1,m2,indmata,1),true);
				}
			marcopizza.precio.innerHTML="Precio:"+fontPrecio(Number(arti.precio()).toFixed(2));
		}else {
			var sm=hm[1].selsalsa.selectedIndex;
			if (sm > 0 ){
				var preis= datosart.sal[parseInt(hm[1].nomsalsa.id,10)][2]*preing;
				sm--;
			}else {
				var preis=0;
				sm=null;
			}
			//var preis=datosart.sal[parseInt(hm[1].nomsalsa.id)][2]*preing;
			var lings=dameingresmitad(hm[1].losingres);
			for (var i=0,lon=lings.length;i<lon;i++){
				preis+=lings[i][2]*preing;
			}
			var m1=new Clpedart.ClaseMitad(hm[1].selespe.selectedIndex>0 ? hm[1].selespe.selectedIndex-1 : null ,sm,lings,hm[1].conqueso.className=="select");//ClaseMitad(hm[1].nomespe.id,sm,lings,hm[1].conqueso.className=="select");
			//console.log("clprin mipediudo=",ClPrin.mipedido);
			var arti=new Clpedart.ClasePizza(m1,null,indmata,1);
			if (!ehr && marcopizza.cantidad.selectedIndex>0 )
				for (var i=0;i<marcopizza.cantidad.selectedIndex;i++){
					pedido_act.nuevoarti(new Clpedart.ClasePizza(m1,null,indmata,1),true);
				}
			marcopizza.precio.innerHTML="Precio:"+fontPrecio(Number(arti.precio()).toFixed(2));
		}
		if (!ehr) {
			if (haymodificacion==null){
					pedido_act.nuevoarti(arti,true);
					ClTaste("Se a añadido a tu pedido:<br>"+(marcopizza.cantidad.selectedIndex+1)+" <span>"+arti.nombre()+"<span>");
			}else{
				//console.log("arti=",arti);
				haymodificacion=pedido_act.modificar(arti,haymodificacion);
				ClTaste("Se a modificado:<br><span>"+arti.nombre()+"<span>");
			}
			//marcopizza.precio.innerHTML="Precio:"+fontPrecio(arti.precio().toFixed(2));
			ClPrin.ultimomar();
		}

	}
	function pintapizza(p,lami){
		//console.log("vamos a dameart idp="+p+", pizza="+datosart.piz[p][1]);
		//var p=dameart(datosart.piz,idp);
		
		
			var pi=datosart.piz[p];
			var ss=dameart(datosart.sal,pi[3]);
			lami.nomespe.id=p;
			lami.nomespe.innerHTML="Especialidad: <b><small>"+datosart.piz[p][1]+"</small></b>";
			lami.nomsalsa.innerHTML="Salsa: <b>"+datosart.sal[ss][1]+"</b>";
			lami.nomsalsa.id=ss; //pi[3];
			lami.selsalsa.selectedIndex=ss+1;
			lami.selespe.selectedIndex=p+1;
			selqueso(lami,pi[4]);
			var lon=pi[5].length;
			lami.losingres.innerHTML="";
			for (var i=0;i<lon;i++){
				var ig=dameart(datosart.ingres,pi[5][i]);
				var tx=datosart.ingres[ig][1];
				var li=hUtils.crearElemento({e:"li",hijos:[{e:"a",a:{id:ig,title:"Añadir más "+tx},inner:tx,listener:{click:anadiringre}},{e:"span",listener:{click:eliminaringre},a:{className:"icon-remove",title:"Eliminar "+tx}}]},null);
				/*var li=document.createElement("li");
				li.innerHTML="<a id="+ig+" title='Eliminar "+datosart.ingres[ig][1]+"'>"+datosart.ingres[ig][1]+"<span  class='icon-remove'></span></a>";
				li.onclick=eliminaringre;*/
				lami.losingres.appendChild(li);
			}
		
		//return pi;
	}
	function clickespe(ev){
		//console.log("entra ="+nent); nent++;
		//console.log("this.selectedIndex="+this.selectedIndex);
		
		
		var lami=marcopizza.mitad2.mitad
		if (this.id=="selespe1"){
			lami=marcopizza.mitad1.mitad
		}
		/*if (this.selectedIndex>0) {
			lami.nomespe.id=this.selectedIndex-1; //this.options[this.selectedIndex].value;
			lami.nomespe.innerHTML="Especialidad: <b><small>"+this.options[this.selectedIndex].text+"</small></b>";
			
		}*/
		if ( this.selectedIndex > 0)
			pintapizza(this.selectedIndex-1,lami);
		else {
			lami.nomespe.id=null;
			lami.losingres.innerHTML="";
		}
		calcularprecio(null,true);
		//this.selectedIndex=0;
	}
	function clicksalsa(ev){
		//if (this.selectedIndex==0) return;
		var sx=this.selectedIndex;
		if (sx < 1 ) sx=null;
		else sx--;
		if (this.id=="selsalsa1"){
			marcopizza.mitad1.mitad.nomsalsa.innerHTML="Salsa: <b>"+this.options[this.selectedIndex].text+"</b>";
			marcopizza.mitad1.mitad.nomsalsa.id=sx; //this.options[this.selectedIndex].value;
		}else{
			marcopizza.mitad2.mitad.nomsalsa.innerHTML="Salsa: <b>"+this.options[this.selectedIndex].text+"</b>";
			marcopizza.mitad2.mitad.nomsalsa.id=sx; //this.options[this.selectedIndex].value;
		}
		calcularprecio(null,true);
		//this.selectedIndex=0;
	}
	function clickqueso(mi,escq){
		return function(ev){
			var lami=marcopizza.mitad1.mitad;
			if (mi==2)
				lami=marcopizza.mitad2.mitad;
			selqueso(lami,escq);
		}
	}
	function clickpizentmit(ev){
		var nps=marcopizza.pizmitades;
		if (this==marcopizza.pizmitades){
			nps=marcopizza.pizentera;
			//console.log("sisis");
			
			
			if (marcopizza.mitad1.ele.className.indexOf("oculta")>-1){ 
				limpiarmitad(marcopizza.mitad1.mitad);
			}else{
				limpiarmitad(marcopizza.mitad2.mitad);	
			}
			marcopizza.mitad1.ele.className="mitad visible lasdos";
			marcopizza.mitad2.ele.className="mitad visible lasdos";
			marcopizza.mitad1.mitad.titmitad.innerHTML="1ª Mitad";
			marcopizza.mitad2.mitad.titmitad.innerHTML="2ª Mitad";
			marcopizza.mitad1.mitad.elimit.style.display="block";
			marcopizza.mitad2.mitad.elimit.style.display="block";
			cambiarbotentmit(this,nps);
		}else {			
				eliminarmitad(2)();			
		}		
		calcularprecio(null,true);
	}
	function cambiarbotentmit(ele,nps){
		ele.className="select";
		ele.getElementsByTagName("span")[0].className="icon-checkmark";
		ele.onclick=null;
		nps.className="noselect";
		nps.getElementsByTagName("span")[0].className="";
		nps.onclick=clickpizentmit;
	}
	function eliminarmitad(nmi){
		return function(ev){
			if (nmi==1){
				limpiarmitad(marcopizza.mitad1.mitad);
				marcopizza.mitad1.ele.className="mitad oculta lasdos";
				marcopizza.mitad2.ele.className="mitad visible sola";
				//marcopizza.mitad1.ele.style.display="none";
			}else {
				limpiarmitad(marcopizza.mitad2.mitad);
				marcopizza.mitad2.ele.className="mitad oculta lasdos";
				marcopizza.mitad1.ele.className="mitad visible sola";
				//marcopizza.mitad2.ele.style.display="none";	
			}
			marcopizza.mitad2.mitad.titmitad.innerHTML="Entera";
			marcopizza.mitad1.mitad.titmitad.innerHTML="Entera";
			marcopizza.mitad1.mitad.elimit.style.display="none";
			marcopizza.mitad2.mitad.elimit.style.display="none";
			cambiarbotentmit(marcopizza.pizentera,marcopizza.pizmitades);
			//console.log("sisi elimino="+nmi);
		}
		
		
	}
	function optionsTex(arr,opcopt,p){
		var lon=arr.length;
		opcopt[0]=p ?  new Option(p): new Option("Selecciona...");
		for (var i=0;i<lon;i++){
			opcopt[i+1]=new Option(arr[i][1]);
		}
	}
	function clickmasatama() {
		calcularprecio(null,true);
	}
	function vistaPizzas(){
		var mimarco=hUtils.crearElemento({e:"div", a:{className:"marcopizza"},hijos:[{e:"div",did:"conmaring", a:{className:"contemarcoing tranmaring"}, hijos:[{e:"h1",did:"titmaring",inner:"Ingredientes"},
									{e:"div",did:"marcoing",a:{className:"marcoing"}},{e:"a",a:{className:"cerrar",onclick:cerrarmaring(true,true)},hijos:[{e:"span",a:{className:"icon-left"}}]},{e:"div",c:{textAlign:"right"},hijos:[{e:"button",inner:"<span class='icon-left'></span> Confirmar",a:{className:"btn btn-primary"},listener:{click:cerrarmaring(true,true)}}]}]},
				{e:"div",did:"conrealpizza",c:{position:"relative"},
				hijos:[{e:"h1",did:"titulomarpi",inner:"Pizza nueva"},
						{e:"div", a:{className:"marmata"},
						hijos:[{e:"div", hijos:[{e:"label", a:{htmlFor:"selmasas"},inner:"Masas:"},{e:"select",did:"selmasas",listener:{change:clickmasatama},a:{id:"selmasas"}}]},
								{e:"div", hijos:[{e:"label", a:{htmlFor:"seltamas"},inner:"Tamaños:"},{e:"select",did:"seltamas",listener:{change:clickmasatama},a:{id:"seltamas"}}]}] },
								{e:"div",a:{className:"marentmit"},
									hijos:[{e:"button",did:"pizentera",a:{className:"select"},inner:"<span class='icon-checkmark'></span> Entera" },{e:"button",did:"pizmitades",a:{className:"noselect",onclick:clickpizentmit},inner:"<span></span> Por Mitades" }  ]},
									{e:"div",did:"mitades",a:{className:"mitades"}},
									{e:"div",did:"precio",a:{className:'right'},inner:"Precio:0.00€"},
									{e:"div",a:{className:"right"}, hijos:[{e:"label",inner:"Cantidad:"},{e:"select",did:"cantidad"},{e:"button",did:"confirmar",a:{className:"btn btn-large btn-primary",onclick:calcularprecio}, inner:"<span class='icon-addshop'></span> Confirmar"}]},
									{e:"a",a:{className:"cerrar",onclick:ClPrin.ultimomar},hijos:[{e:"span",a:{className:"icon-cancel"}}]}
									]}] },marcopizza );
		marcopizza.mitad1=vistaMitad(1);
		marcopizza.mitad2=vistaMitad(2);
		marcopizza.mimarco=mimarco;
		optionsTex(datosart.masas,marcopizza.selmasas.options,null);
		optionsTex(datosart.tamas,marcopizza.seltamas.options,null);
		//marcopizza.mitad1.mitad.selespe.options[1]=new Option("Al Gusto");
		optionsTex(datosart.piz,marcopizza.mitad1.mitad.selespe.options,"Al Gusto");
		//marcopizza.mitad2.mitad.selespe.options=new Option("Al Gusto");
		optionsTex(datosart.piz,marcopizza.mitad2.mitad.selespe.options,"Al Gusto");
		optionsTex(datosart.ingres,marcopizza.mitad1.mitad.selingres.options,null); 
		optionsTex(datosart.ingres,marcopizza.mitad2.mitad.selingres.options,null); 
		//marcopizza.mitad1.mitad.selsalsa.options[1]=new Option("Sin Salsa");
		optionsTex(datosart.sal,marcopizza.mitad1.mitad.selsalsa.options,"Sin Salsa"); 
		//marcopizza.mitad2.mitad.selsalsa.options[1]=new Option("Sin Salsa");
		optionsTex(datosart.sal,marcopizza.mitad2.mitad.selsalsa.options,"Sin Salsa");
		eliminarmitad(2)();
		for (var i=1;i<11;i++)
			marcopizza.cantidad.options[i-1]=new Option(i);
			
		marcopizza.mitades.appendChild(marcopizza.mitad1.ele);
		marcopizza.mitades.appendChild(marcopizza.mitad2.ele);
		
		marcoingredientes=new lineasmarIng(datosart.ingres);
		mimarco.style.display="none";
		marcopizza.conmaring.addEventListener('touchstart', function(e){
			var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger)
			startx = parseInt(touchobj.clientX,10); // get x position of touch point relative to left edge of browser

			//console.log('Status: touchstart<br /> ClientX: ' + startx );
		}, false);
		marcopizza.conmaring.addEventListener('touchmove', function(e){
			var touchobj = e.changedTouches[0],// reference first touch point for this event
			dist =  parseInt(touchobj.clientX,10) - startx;
			if (dist<0){
				//console.log("sisisi dist="+dist);
				marcopizza.conmaring.className="contemarcoing";
				marcopizza.conmaring.style.left=dist+"px";
			}
			//console.log('Status: touchmove<br /> Horizontal distance traveled: ' + dist );
		}, false);
		marcopizza.conmaring.addEventListener('touchend', function(e){
			var touchobj = e.changedTouches[0];// reference first touch point for this event
			var izq=parseInt(marcopizza.conmaring.style.left,10);
			if (izq<-60){ //((-marcopizza.conmaring.offsetWidth)/3) ) {
				marcopizza.conmaring.className="contemarcoing tranmaring";
				cerrarmaring(true,true)();
			}else if ( izq<0){
				marcopizza.conmaring.className="contemarcoing tranmaring";
				marcopizza.conmaring.style.left="0px";
			}
			//console.log('Status: touchend<br /> Resting x coordinate: ' + touchobj.clientX );
		}, false)


		return mimarco;
	}
	
	function vistaMitad(nm) {
		var mitadaux={};//onclick:clickespe,
		var ele=hUtils.crearElemento({e:"div",a:{className:"mitad visible sola"}, hijos:[
						{e:"h5",did:"titmitad",inner:"Mitad "+nm},{e:"label",did:"nomespe",a:{htmlFor:"selespe"+nm},inner:"Especialidad:"},{e:"select",did:"selespe",a:{id:"selespe"+nm,onchange:clickespe}},{e:"div",hijos:[
									{e:"button",did:"conqueso",a:{className:"noselect",onclick:clickqueso(nm,true)},inner:"<span></span> Con queso"},
									{e:"button",did:"sinqueso",a:{className:"select"},inner:"<span class='icon-checkmark'></span> Sin queso"}] },
									{e:"label",did:"nomsalsa",a:{htmlFor:"selsalsa"+nm},inner:"Salsa:"},
									{e:"select",did:"selsalsa",a:{id:"selsalsa"+nm,onchange:clicksalsa}},
									{e:"label",inner:"Ingredientes: ",hijos:[{e:"button",a:{onclick:sacarmarcoing(nm)},inner:" <span class='icon-menu'></span> "}]},
									{e:"select",did:"selingres",a:{id:"selingres"+nm,onchange:clickingres}},
									{e:"div",hijos:[{e:"ul",did:"losingres"},{e:"br",a:{className:"clear"}}]},
									{e:"a",did:"elimit",a:{className:"cerrar",title:"Eliminar esta mitad",onclick:eliminarmitad(nm)},hijos:[{e:"span",a:{className:"icon-remove"}}]} ]},mitadaux);
		return {ele:ele,mitad:mitadaux};
	}
	return {
		inicio:function(p) { pedido_act=p; datosart=window.server.datosart; },
		dametodo:dametodo,
		domarcopiz:vistaPizzas,
		clickeven:clickpizza,
		clickadd:clickadd,
		modificar:modificar,
		estaenmodi:estaenmodi,
		cerraringredientes:function() {
			cerrarmaring(true)();
		},
		abrireditar:function() {
			cerrarmaring(false)();
			haymodificacion=null;
			ClPrin.desopcsel(marcopizza.mimarco,{obj:"pizzas"});
			ClPrin.iraprin();
		}
		/*cerrarmi:function() { 
			if (marcoingredientes.activo!==null){
				//console.log("si cierro marco ingredientes");
				cerrarmaring("iratras")();
				return true;
			}
			//console.log("nooo cierro marco ingredientes");
			return false;
		}*/
	}
})();