'use strict';
var ClsTabla=(function() {
	function ordenar(ta,col){
		try {
			var arr= Array.prototype.slice.call( ta.tbody.rows );
		} catch(e){
			var lo=ta.tbody.rows.length;
			var arr=[];
			for (var s=0;s<lo;s++)
				arr.push(ta.tbody.rows[s]);
		}
		arr.sort(function(a,b){
			a=ta.modelo[col-1].getbloq(a.cells[col]); // a.cells[col].innerHTML;
			b=ta.modelo[col-1].getbloq(b.cells[col]); //b.cells[col].innerHTML;
			//if (isNaN(a) || isNaN(b))
				//return (a == b) ? 0: ( a > b) ? 1 : -1;
				return ( a > b) ? 1 : ( a < b ) ? -1 : 0;
			//else
			//	return parseFloat(b) - parseFloat(a);
		});
		
		return arr;
	}
	function key_inp_buscar(evt){
		 var k = (evt) ? evt.which : event.keyCode;
		 if (k==13) this.mitabla.buscar();
	}
	var mixinAlmacen=function(clta,didtr,alm){
		var almta=clta.almacen[didtr];
		if (! almta || almta === undefined){
			almta={};
			clta.almacen[didtr]=almta;
		}
		for (var a in alm)
			almta[a]=alm[a];
	}
	function Ltabla(pla,cb,nomodi){
		this.plantilla=pla;
		this.tabla=document.createElement("table");
		this.tabla.className="tablaprin";
		//this.tcapti=document.createElement("caption");
		//this.numele=0;

		//this.tcap.innerHTML="Nº de registros:0";
		/*this.tcapti=hUtils.crearElemento({e:"caption", hijos:[{e:"div",a:{className:"line"},hijos:[{e:"button",a:{butborr:true},inner:"Borrar"},{e:"button",a:{butmodif:true},inner:"Modificar"}]},{e:"div",a:{className:"line right"},inner:"Nº de registros:0",did:"tcap"} ]},this);{e:"br",a:{className:"salto"}}, */
		if (! nomodi){
			this.tcapti=hUtils.crearElemento({e:"caption", hijos:[{e:"div",a:{className:"div-buscar"}, hijos:[{e:"input",did:"inpbuscar",a:{onkeypress:key_inp_buscar,mitabla:this}},{e:"button",inner:"Buscar",a:{className:"btn btn-oscuro btn-corto"},atr:{"data-butmetodo":"buscar"}},{e:"button",inner:"Eliminar búsqueda",did:"buttodos",a:{className:"btn btn-oscuro btn-corto"},atr:{"data-butmetodo":"mostrartodos"},c:{display:"none"}},{e:"div",did:"resbuscar",c:{visibility:"hidden"}} ] },{e:"div",a:{className:"left"},hijos:[{e:"button",a:{className:"btn btn-info btn-corto"},atr:{"data-butmetodo":"eliminar"},inner:"Borrar"},{e:"button",a:{className:"btn btn-info btn-corto"},atr:{"data-butmetodo":"modificar"},inner:"Modificar"}]}, {e:"div",a:{className:"right"},inner:"Nº de registros:0",did:"tcap"} ]},this);
		}else {
			this.tcapti=hUtils.crearElemento({e:"caption", hijos:[{e:"div",a:{className:"div-buscar"},hijos:[{e:"input",did:"inpbuscar",a:{onkeypress:key_inp_buscar,mitabla:this}},{e:"button",did:"butbuscar",inner:"Buscar",a:{className:"btn btn-oscuro btn-corto"},atr:{"data-butmetodo":"buscar"}},{e:"button",inner:"Eliminar búsqueda",did:"buttodos",a:{className:"btn btn-oscuro btn-corto"},atr:{"data-butmetodo":"mostrartodos"},c:{display:"none"}},{e:"div",did:"resbuscar",c:{visibility:"hidden"}}]},{e:"div",a:{className:"left"},hijos:[{e:"button",a:{className:"btn btn-info btn-corto"},atr:{"data-butmetodo":"eliminar"},inner:"Borrar"}]},{e:"div",a:{className:"right"},inner:"Nº de registros:0",did:"tcap"} ]},this);
		}
		this.tbody=document.createElement("tbody");
		var the=this.tabla.createTHead(); //document.createElement("thead");
		var row = the.insertRow(0);
	    var cell = row.insertCell(0);
		//var th=document.createElement("th");
		//var bb=document.createElement("button");
		//bb.butborr=true;
		//bb.innerHTML="Borrar";
		var bsel=document.createElement("button");
		bsel.className="btn btn-info btn-corto";
		bsel.setAttribute("data-butmetodo","seltodo"); //1 sin seleccionar 2 seleccionar todo
		bsel.setAttribute("data-seltodo",1); //seltodo=1;
		bsel.innerHTML="Sel";
		cell.appendChild(bsel);
		//cell.innerHTML="Sel"; // appendChild(bb);
		//th.appendChild(bb);
		//the.appendChild(th);

		this.modelo=[];
		this.nomcolum={};
		this.almacen={};
		//modelo:[[Clink,"nombre",Nombre",true],[Ctexto,"Descripción",true],[Ctexto,"Ing.Unico",true],[Clista,"Tamaños"],[Cboton,"Listar"]],
		for (var i=0,lon=pla.modelo.length;i<lon;i++){
			cell = row.insertCell(i+1);
			if (pla.modelo[i][3]){
				var buthea=document.createElement("button");
				buthea.className="btn btn-claro btn-corto";
				buthea.columna=i+1;
				buthea.setAttribute("data-butmetodo","ordenarporcab"); // butmetodo="ordenarporcab";
				buthea.innerHTML=pla.modelo[i][2];
				buthea.title="Ordenar por "+pla.modelo[i][2];
				cell.appendChild(buthea);
			}else
				cell.innerHTML=pla.modelo[i][2];
			/*th=document.createElement("th");
			th.innerHTML=pla.modelo[i][1];
			the.appendChild(th);*/
			this.nomcolum[pla.modelo[i][1].toUpperCase()]=i+1;
			this.modelo.push(pla.modelo[i][0]);
		}
		//this.tabla.appendChild(the);
		this.tabla.appendChild(this.tbody);
		this.tabla.appendChild(this.tcapti);
		this.tabla.onclick=clickta(this);
		this.cb=cb;
		this.ultimo_orden=1;
	}
	Ltabla.prototype.render=function(dats,corder){
		//var lc=this.modelo.length;
		var td;
		var lon=dats.length;
		for (var i=0;i<lon;i++){
			var tr=document.createElement("tr");
			tr.setAttribute("data-did",dats[i][0]);
			//tr.did=dats[i][0];
			td=document.createElement("td");
			td.innerHTML="<input type='checkbox' />";
			tr.appendChild(td);
			//for (var n=0;n<lc;n++)
			//	tr.appendChild(this.modelo[n].render(dats[i][n+1]));
			for (var n in this.nomcolum)
				tr.appendChild(this.modelo[this.nomcolum[n]-1].render(dats[i][corder[n]]));
			this.tbody.appendChild(tr);
		}
		this.tcap.innerHTML="Nº de registros:"+this.tbody.rows.length;
	}
	Ltabla.prototype.vaciartabla=function() {
		this.tabla.removeChild(this.tbody);
		this.tbody=document.createElement("tbody");
		this.tabla.appendChild(this.tbody);
		this.tcap.innerHTML="Nº de registros:0";
		this.ultimo_orden=1;
		this.almacen={};
	}

	Ltabla.prototype.nueLinea=function(dats,corder,alm){
		//var lc=this.modelo.length;
		var tr=document.createElement("tr");
		var td=document.createElement("td");
			td.innerHTML="<input type='checkbox' />";
			tr.appendChild(td);
			tr.setAttribute("data-did",dats[0]);
			if (alm)
				mixinAlmacen(this,dats[0],alm); 
			//tr.did=dats[0];
		//for (var n=0;n<lc;n++)
		//	tr.appendChild(this.modelo[n].render(dats[n+1]));
		for (var n in this.nomcolum)
			tr.appendChild(this.modelo[this.nomcolum[n]-1].render(dats[corder[n]]));
		this.tbody.appendChild(tr);
		//this.numele++;
		this.tcap.innerHTML="Nº de registros:"+this.tbody.rows.length;
		return tr;
	}
	Ltabla.prototype.insMulti=function(dats,corder,alms) {
		//var lc= this.modelo.length;
		var ltot=dats.length,tr,td,n,trs=[];
		for (var z=0;z<ltot;z++){
			tr=document.createElement("tr");
			td=document.createElement("td");
			td.innerHTML="<input type='checkbox' />";
			tr.appendChild(td);
			tr.setAttribute("data-did",dats[z][0]);
			if (alms && alms[z])
				mixinAlmacen(this,dats[z][0],alms[z]);
			//tr.did=dats[z][0];
			//for (n=0;n<lc;n++)
			//	tr.appendChild(this.modelo[n].render(dats[z][n+1]));
			for (var n in this.nomcolum){
				tr.appendChild(this.modelo[this.nomcolum[n]-1].render( dats[z][corder[n]]));
			}
			this.tbody.appendChild(tr);
			trs.push(tr);
		}
		this.tcap.innerHTML="Nº de registros:"+this.tbody.rows.length;
		return trs;
	}
	Ltabla.prototype.insOrden=function(dats,corder,alm) {
		//if (this.ultimo_orden!=1) this.ordenar(1);
		//var lc= this.modelo.length;
		var tr=document.createElement("tr");
		var td=document.createElement("td");
			td.innerHTML="<input type='checkbox' />";
			tr.appendChild(td);
			tr.setAttribute("data-did",dats[0]);
			if (alm)
				mixinAlmacen(this,dats[0],alm);
			//tr.did=dats[0];
		var trx,nr=this.tbody.rows.length;
		
		//for (var n=0;n<lc;n++)
			//tr.appendChild(this.modelo[n].render(dats[n+1]));
		for (var n in this.nomcolum){
			tr.appendChild(this.modelo[this.nomcolum[n]-1].render( dats[corder[n]]));
		}
		var lown=this.modelo[this.ultimo_orden-1].getbloq(tr.cells[this.ultimo_orden]); // dats[1].toUpperCase();
		for (var i=0;i<nr;i++){
			trx=this.tbody.rows[i];
			if (this.modelo[this.ultimo_orden-1].getbloq(trx.cells[this.ultimo_orden])>lown){
				this.tbody.insertBefore(tr,trx);
				this.tcap.innerHTML="Nº de registros:"+this.tbody.rows.length;
				return tr;
			}
		}
		//for (var n=0;n<lc;n++)
		//	tr.appendChild(this.modelo[n].render(dats[n+1]));
		this.tbody.appendChild(tr);
		this.tcap.innerHTML="Nº de registros:"+this.tbody.rows.length;
		return tr;
	}
	Ltabla.prototype.buscar=function(){
		if (this.inpbuscar.value.length<1) return;
		var nr=this.tbody.rows.length;
		var trx,b=0,val=this.inpbuscar.value.toUpperCase(),lc=this.modelo.length;
		for (var i=0;i<nr;i++){
			trx=this.tbody.rows[i];
			for (var o=0;o<lc;o++){
				var hay=false,mobu=this.modelo[o].getbloq(trx.cells[o+1]);
				if (mobu["indexOf"] && mobu.indexOf(val)>-1){
					trx.style.display=""; hay=true;b++;
					break;
				}
			}
			if (!hay){
				trx.style.display="none"; 
			}
		}
		this.resbuscar.innerHTML=b +" Elementos encontrados.";
		this.resbuscar.style.visibility="visible";
		this.buttodos.style.display="";
	}
	Ltabla.prototype.mostrartodos=function() {
		var nr=this.tbody.rows.length;
		for (var i=0;i<nr;i++)
			this.tbody.rows[i].style.display="";
		this.resbuscar.style.visibility="hidden";
		this.resbuscar.innerHTML="";
		this.inpbuscar.value="";
		this.buttodos.style.display="none";
	}
	Ltabla.prototype.ordenar=function(col){
		if (col) this.ultimo_orden=col;
		if (this.tbody.rows.length <= 1) return;
		var tbor=ordenar(this,this.ultimo_orden);
		var lon=tbor.length;
		this.tabla.removeChild(this.tbody);
		var tbo=document.createElement("tbody");
		for (var i=0;i<lon;i++)
			tbo.appendChild(tbor[i]);
		this.tabla.appendChild(tbo);
		this.tbody=tbo;
	}
	Ltabla.prototype.modLinea=function(tr,dats,corder,alm){
		//var lc=this.modelo.length;
		if (alm)
			mixinAlmacen(this,tr.getAttribute("data-did"),alm);
		//for (var n=0;n<lc;n++)
		//	this.modelo[n].set(tr.cells[n+1],dats[n+1]);
		for (var n in this.nomcolum){
			var nn=this.nomcolum[n];
			this.modelo[nn-1].set(tr.cells[nn],dats[corder[n]]);
		}
		return tr;
	}
	Ltabla.prototype.modLineaOrden=function(tr,dats,corder,alm){
		//if (this.ultimo_orden!=1) this.ordenar(1);
		//var lc=this.modelo.length;
		this.tbody.removeChild(tr);
		//for (var n=0;n<lc;n++)
		//	this.modelo[n].set(tr.cells[n+1],dats[n+1]);
		for (var n in this.nomcolum){
			var nn=this.nomcolum[n];
			this.modelo[nn-1].set(tr.cells[nn],dats[corder[n]]);
		}
		if (alm)
			mixinAlmacen(this,tr.getAttribute("data-did"),alm);
		var trx,nr=this.tbody.rows.length,lown=this.modelo[this.ultimo_orden-1].getbloq(tr.cells[this.ultimo_orden]);// dats[1].toUpperCase();
		for (var i=0;i<nr;i++){
			trx=this.tbody.rows[i];
			if (trx!=tr && this.modelo[this.ultimo_orden-1].getbloq(trx.cells[this.ultimo_orden])>lown){
				this.tbody.insertBefore(tr,trx);
				return tr;
			}
		}
		this.tbody.appendChild(tr);
		return tr;
	}
	Ltabla.prototype.existe=function(tr,val){
		var lc=this.modelo.length;
		var nr=this.tbody.rows.length;
		var trx;
		val=val.toUpperCase();
		for (var i=0;i<nr;i++){
			trx=this.tbody.rows[i];
			if ((tr==null || parseInt(trx.getAttribute("data-did"),10) != parseInt(tr.getAttribute("data-did"),10)) && this.modelo[0].get(trx.cells[1]).toUpperCase()==val)
					return true;
		}
		return false;
	}
	Ltabla.prototype.getLinea=function(tr,corden){
		//var lc=corden.length; // this.modelo.length;
		//console.log(tr);
		var li=[];
		var trs=tr.getElementsByTagName("td");
		for (var n in corden ){ //;n<lc;n++){
			var nn=this.nomcolum[corden[n]]-1;
			li.push(this.modelo[nn].get(trs[nn+1]));
			//li.push(this.modelo[n].get(trs[n+1]));
		}
		var alm=this.almacen[tr.getAttribute("data-did")];
		if (!alm || alm === undefined)
			alm=null;
		return { li:li,almacen:alm };
	}
	Ltabla.prototype.getdidtr=function(did){
		did=parseInt(did,10);
		var nr=this.tbody.rows.length;
		var tr;
		for (var i=0;i<nr;i++){
			tr=this.tbody.rows[i];
			var dtdid=tr.getAttribute("data-did");
			if (parseInt(dtdid,10)==did){
				var alm=this.almacen[dtdid];
				if (!alm || alm === undefined)
					alm=null;
				return {tr:tr,almacen:alm};	
			}
					
		}
		return false;
	}
	Ltabla.prototype.getmodelcell=function(tr,c){
		return this.modelo[c-1].get(tr.cells[c]);
	}
	Ltabla.prototype.getModeloCelNom=function(tr,nomcol) {
		nomcol=nomcol.toUpperCase();
		for (var i in this.nomcolum)
			if (i == nomcol){
				i=this.nomcolum[i];
				return this.modelo[i-1].get(tr.cells[i]);
			}
		return null;
	}
	Ltabla.prototype.setModeloCelNom=function(tr,nomcol,dat) { //this.control.tabla.modelo[3].set(ptbr[p].cells[4],arr);
		nomcol=nomcol.toUpperCase();
		for (var i in this.nomcolum)
			if (i == nomcol){
				i=this.nomcolum[i];
				this.modelo[i-1].set(tr.cells[i],dat);
				return;
			}
	}
	Ltabla.prototype.getalmacen=function(tr){
		var tal=this.almacen[tr.getAttribute("data-did")];
		if (!tal || tal=== undefined) return null;
		return tal;
	}
	Ltabla.prototype.setalmacen=function(tr,alm){
		mixinAlmacen(this,tr.getAttribute("data-did"),alm);
	}
	Ltabla.prototype.selchecks=function(){
		var nr=this.tbody.rows.length;
		var li=[];
		var trs=[];
		var tr;
		for (var i=0;i<nr;i++){
			tr=this.tbody.rows[i];
			if (tr.cells[0].getElementsByTagName("input")[0].checked){
					li.push(parseInt(tr.getAttribute("data-did"),10));
					trs.push(tr);
			}
		}
		return {li:li,trs:trs};

	}
	Ltabla.prototype.eliminar=function(){
		var slc=this.selchecks();
		if (slc.li.length>0){
			var eli=true;
			var objs={ope:"del",datos:slc.li};
			if (this.plantilla.preelim)
				eli=this.plantilla.preelim(objs,slc.trs);
			if (eli) {
				var tbo=this.tbody;
				var self=this;
				hUtils.xJson({url:this.plantilla.url,datos:window.JSON.stringify(objs),formu:true}).then(function(dat){
					for (var i=0,lon=slc.li.length;i<lon;i++){
						tbo.removeChild(slc.trs[i]);
						if (this.almacen)
							delete this.almacen[slc.trs[i].getAttribute("data-did")];
					}
					self.tcap.innerHTML="Nº de registros:"+tbo.rows.length;
					if (self.plantilla.postelim)
						self.plantilla.postelim(true,slc.li);
				}).fail(function(dat){
					console.log("error:"+dat);
					if (self.plantilla.postelim)
						self.plantilla.postelim(false,dat);
				});
			
			}
		}
			
	}
	Ltabla.prototype.modificar=function(){
		var slc=this.selchecks();
		if (slc.li.length>0){
			this.cb(slc.trs);
			for (var i=0,lon=slc.trs.length;i<lon;i++)
				slc.trs[i].cells[0].getElementsByTagName("input")[0].checked=false;	
		}
	}
	Ltabla.prototype.seltodo=function(s) {
		var sse=true;
		if ( parseInt(s.getAttribute("data-seltodo"),10)===1){
			s.setAttribute("data-seltodo",2);
		}else{
			s.setAttribute("data-seltodo",1);
			sse=false;
		}
		var nr=this.tbody.rows.length;
		var tr;
		for (var i=0;i<nr;i++){
			tr=this.tbody.rows[i];
			tr.cells[0].getElementsByTagName("input")[0].checked=sse;
		}
	}
	Ltabla.prototype.ordenarporcab=function(s) {
		this.ordenar(s.columna);
	}
	function clickta(tab){
		return function(ev){
			var e = ev || window.event;
			//console.log(e.target);
			if (e.target){
				e=e.target;
				var so=e.tagName.toUpperCase();

			}else {
				e=e.srcElement;
				var so=e.nodeName.toUpperCase();
			}
			if (so=="A")
				tab.cb([e.parentNode.parentNode]);
			else if (so=="BUTTON" ){
				if (e.getAttribute("data-butmetodo")) // butmetodo)
					tab[e.getAttribute("data-butmetodo")](e);
				else
					tab.plantilla.clickCelda(dameNomCelda(tab,e.parentNode)); // {td:e.parentNode,tr:e.parentNode.parentNode,nomcelda:);
				/*if ( e.butborr)
					tab.eliminar();
				else if (e.butbuscar)
					tab.buscar();
				else if (e.buttodos)
					tab.mostrartodos();
				else if (e.butmodif)
					tab.modificar();
				else if (e.seltodo)
					tab.seltodo(e);
				else
					tab.plantilla.clickCelda(e.parentNode);*/
			}
		}
	}
	var dameNomCelda=function(tab,td){
		for (var i in tab.nomcolum)
			if (tab.nomcolum[i] == td.cellIndex)
				return {td:td, nom:i };
		return null;
	}
	
	var ctdtabla={
		Ctexto:{
			render:function(dat){
				var td=document.createElement("td");
				td.innerHTML=dat;
				return td;
			},
			get:function(td){
				return td.innerHTML;
			},
			set:function(td,dat){
				td.innerHTML=dat;
			},
			getbloq:function(td){
				return td.innerHTML.toUpperCase();
			}
		}
	};
	ctdtabla.Cnumero={
			render:function(dat){
				var td=ctdtabla.Ctexto.render(dat);
				td.align="right";
				return td;
			},
			get:ctdtabla.Ctexto.get,
			set:ctdtabla.Ctexto.set,
			getbloq:function(td){
				return parseFloat(td.innerHTML);
			}
		};
	ctdtabla.Clink={
			render:function(dat){
				var td=document.createElement("td");
				var a=document.createElement("a");
				a.innerHTML=dat;
				a.href="javascript:void(0);";
				td.appendChild(a);
				return td; 
			},
			get:function(td){
				return td.getElementsByTagName("a")[0].innerHTML;
			},
			set:function(td,dat){
				td.getElementsByTagName("a")[0].innerHTML=dat;
			},
			getbloq:function(td){
				return td.getElementsByTagName("a")[0].innerHTML.toUpperCase();
			}
		};
	ctdtabla.Cselec={
			render:function(dat){
				var se=document.createElement("select");
				for (var i=0,lon=dat.length;i<lon;i++){
					se.options[i]=new Option(dat[i]);
				}
				var td=document.createElement("td");
				td.appendChild(se);
				return td;
			},
			get:function(td){
				var op=[];
				var se=td.getElementsByTagName("select")[0];
				for (var i=0,lon=se.options.length;i<lon;i++)
					op.push(se.options[i].text);
				return op;
			},
			set:function(td,op){
				var se=td.getElementsByTagName("select")[0];
				se.options=[];
				for (var i=0,lon=se.options.length;i<lon;i++)
					se.options[i]=new Option(op[i]);
			},
			getbloq:function(td){
				var op="";
				var se=td.getElementsByTagName("select")[0];
				for (var i=0,lon=se.options.length;i<lon;i++)
					op+=se.options[i].text.toUpperCase();
				return op;
			}
		};
	ctdtabla.Clista={
			render:function(dat,td){
				var sp;
				var td=td || document.createElement("td");
				for (var i=0,lon=dat.length;i<lon;i++){
					sp=document.createElement("span");
					sp.className="com-lista";
					sp.innerHTML=dat[i];
					td.appendChild(sp);
				}
				return td;
			},
			get:function(td){
				var op=[];
				var sp=td.getElementsByTagName("span");
				for (var i=0,lon=sp.length;i<lon;i++)
					op.push(sp[i].innerHTML);
				return op;
			},
			set:function(td,dat){
				td.innerHTML="";
				ctdtabla.Clista.render(dat,td);
			},
			getbloq:function(td){
				var op="";
				var sp=td.getElementsByTagName("span");
				for (var i=0,lon=sp.length;i<lon;i++)
					op+=sp[i].innerHTML.toUpperCase();
				return op;
			}
		};
	ctdtabla.Cbool={
			render:function(dat){
				var td=document.createElement("td");
				td.align="center";
				td.innerHTML=(dat ? "Si" : "No");
				return td;
			},
			get:function(td){
				return td.innerHTML==="Si";
			},
			set:function(td,dat){
				td.innerHTML=(dat ? "Si" : "No");
			},
			getbloq:function(td){
				return td.innerHTML.toUpperCase();
			}
		};
	ctdtabla.Cboton={
			render:function(dat){
				var td=document.createElement("td");
				td.align="center";
				td.innerHTML="<button>"+dat+"</button>";
				return td;
			},
			get:function(td){
				return td.getElementsByTagName("button")[0].innerHTML;
			},
			set:function(td,dat){
				td.innerHTML="<button>"+dat+"</button>";
			},
			getbloq:function(td){
				return td.getElementsByTagName("button")[0].innerHTML.toUpperCase();
			}
		}
	return {tabla:Ltabla, campo:ctdtabla, did:function(tr){ return parseInt(tr.getAttribute("data-did"),10); }};
})();
var ClsVentanasTipo=(function() {
	function ventanatitPrin(op){
		this.contenido=hUtils.crearElemento({e:"div",a:{className:"ventanatitprin-contenido"},hijos:[
				{e:"div",a:{className:"ventanatitprin-cabecera"},hijos:[
				{e:"span",did:"tit",inner:op.titulo},{e:"a",inner:"x",a:{className:"cerrar",onclick:this.cerrar.bind(this)}} ] },
				{e:"div",did:"dentro",a:{className:"ventanaprin-dentro tiprindentro"}  }]},this);
		this.padre=op.padre;
		//,hijos:[{e:op.contenido}]
	}
	ventanatitPrin.prototype.show=function() {
		//document.body.appendChild(this.contenido);
		if (this.padre.firstChild)
			this.padre.insertBefore(this.contenido,this.padre.firstChild);
		else
			this.padre.appendChild(this.contenido);

	}
	ventanatitPrin.prototype.cerrar=function() {
		this.contenido.parentNode.removeChild(this.contenido);
	}
	function ventanaSimple(op){
		this.contenido=document.createElement("div");
		this.contenido.className= op.anchototal ? "ventanaprin-contenido2" : "ventanaprin-contenido1";
		this.padre=op.padre;
	}
	ventanaSimple.prototype.show=function() {
		this.padre.appendChild(this.contenido);
	}
	ventanaSimple.prototype.cerrar=function() {
		this.contenido.parentNode.removeChild(this.contenido);
	}

	function ventanaTit(op){
		ventanaSimple.call(this,op);

		this.cabecera=hUtils.crearElemento( 
					{e:"div",a:{className:"ventanaprin-cabecera gracp"},hijos:[
						{e:"span",did:"tit",inner:op.titulo} ] },this);
		this.dentro=document.createElement("div");
		this.dentro.className="ventanaprin-dentro";
		this.dentro.appendChild(op.contenido);
		//this.dentro=hUtils.crearElementox({e:"div",a:{className:"ventanaprin-dentro"},hijos:[{e:op.contenido}]  },this);
		this.contenido.appendChild(this.cabecera);
		this.contenido.appendChild(this.dentro);
		
	}
	ventanaTit.prototype=ventanaSimple.prototype;

	
	function ventanaCe(op){ // con titulo y cerrar 
		ventanaTit.call(this,op);
		this.cabecera.appendChild(hUtils.crearElemento({e:"a",inner:"x",a:{className:"cerrar",onclick:this.cerrar.bind(this)}}));
	}
	ventanaCe.prototype=ventanaSimple.prototype;
	function aceptarCb(cb){ //function() { op.aceptar.cb(); }
		return function() { cb(); }
	}
	function ventanaAcep(op){ // con aceptar
		ventanaSimple.call(this,op);
		this.dentro=document.createElement("div");
		this.dentro.className="ventanaprin-dentro";
		this.dentro.appendChild(op.contenido);
		//this.dentro=hUtils.crearElementox({e:"div",a:{className:"ventanaprin-dentro"},hijos:[{e:op.contenido}]  },this);
		this.contenido.appendChild(this.dentro);
		this.init(op);
	}
	ventanaAcep.prototype=ventanaSimple.prototype;
	ventanaAcep.prototype.init=function(op){
		this.pie=hUtils.crearElemento({e:"div",a:{className:"ventanaprin-pie gracp"},hijos:[
					{e:"button", did:"aceptar",inner:op.aceptar.tit,a:{className:"btn btn-large btn-primary",onclick:aceptarCb(op.aceptar.cb)  }}] },this);
		this.contenido.appendChild(this.pie);
	}

	function ventanaTitAcep(op){
		ventanaTit.call(this,op);
		ventanaAcep.prototype.init.call(this,op);
	}
	ventanaTitAcep.prototype=ventanaSimple.prototype;

	function ventanaTodo(op){ //con titulo, cerrar y aceptar
		ventanaCe.call(this,op);
		ventanaAcep.prototype.init.call(this,op);
	}
	ventanaTodo.prototype=ventanaSimple.prototype;

	function sombra(c) {
		var som=document.createElement("div");
		som.className="sombra-oculta";
		som.appendChild(c);
		return som;
	}
	
	function abrircerrar(clv){
		return function(e){
			if (e)
				e.stopPropagation();
			else
				window.event.cancelBubble = true;
			if (!clv.pegado){
				clv.atop=clv.contenido.style.top;
				clv.aleft=clv.contenido.style.left;
				clv.contenido.style.left="0";
				clv.contenido.style.top="0";
				clv.cabecera.style.cursor="default";
				clv.cabecera.onmousedown=null;
				clv.contenido.className="ventana-contenido ventana-nomov";
				//clv.dentro.style.maxWidth="";
			}else {
				clv.contenido.style.top=clv.atop;
				clv.contenido.style.left=clv.aleft;
				clv.cabecera.style.cursor="move";
				clv.cabecera.onmousedown=empezarmov(clv);
				clv.contenido.className="ventana-contenido ventana-mov";
				//clv.dentro.style.maxWidth="700px";
			}
			clv.pegado = !clv.pegado;
		}
	}
	var ventActiva=null;
	function ventanapopup(op){
		var pie=hUtils.crearElemento({e:"div",a:{className:"ventana-pie"} });
		if (op.bindcerrar) this.cbcerrar=op.bindcerrar;
		if (op.cancelar) {
			pie.appendChild(hUtils.crearElemento({e:"button",inner:"Cancelar",a:{className:"btn btn-large btn-primary",onclick:this.cerrar.bind(this) }}));
		}
		if (op.aceptar){
			pie.appendChild(hUtils.crearElemento({e:"button",did:"aceptar",inner:op.aceptar.tit,a:{className:"btn btn-large btn-primary",onclick:aceptarCb(op.aceptar.cb) }},this));
		}
		this.bmov=this.pegado=false;
		ventActiva=this;
		this.contenido=hUtils.crearElemento({e:"div",a:{className:"ventana-contenido ventana-mov"},c:{zIndex:1000 }, hijos:[
			{e:"div",did:"cabecera",a:{className:"ventana-cabecera",onmousedown:empezarmov(this) },c:{cursor:"move"},hijos:[
				{e:"span",did:"tit",inner:op.titulo },{e:"a",inner:"<div></div>",a:{className:"ventana-abce",onclick:abrircerrar(this) } }, {e:"a",inner:"x",a:{className:"ventana-cerrar",onclick:this.cerrar.bind(this) }}] },
			{e:"div",did:"dentro",a:{className:"ventana-dentro"}  } ]},this);
		this.contenido.appendChild(pie);//,{e:pie}
		this.dentro.appendChild(op.contenido);//,hijos:[{e:op.contenido}]
		//this.dentro.style.maxWidth="700px";
		this.sombra=sombra(this.contenido);
		this.visible=true;
		document.body.appendChild(this.sombra);
		var Tam =[document.body.offsetWidth,document.body.offsetHeight];
		//var t=5; //(Tam[1]/2)-(this.contenido.offsetHeight/2);
		this.pos={
			top:5, //(t<0 ? 0 : t ),
			left:(Tam[0]/2)-(this.contenido.offsetWidth/2)
		};
		this.contenido.style.left=this.pos.left+"px";
		var thsom=this.sombra;
		hUtils.fx({e:this.contenido,edat:null,d:{top:-this.contenido.offsetHeight},a:{top:5},ms:700,fin:function() {
			thsom.style.overflowY="scroll";
		}});
	}
	ventanapopup.prototype.show=function() {
		if (this.visible) return;
		document.body.appendChild(this.sombra);
		var thsom=this.sombra;
		this.pos.top=5;
		this.contenido.style.top="5px";
		hUtils.fx({e:this.contenido,edat:null,d:{top:-this.contenido.offsetHeight},a:{top:5},ms:700,fin:function() {
			thsom.style.overflowY="scroll";
		}});
		this.visible=true;
	}
	ventanapopup.prototype.cerrar=function() {
		if (!this.visible) return
			this.visible=false;
		var thsom=this.sombra;
		hUtils.fx({e:this.contenido,edat:null,d:{top:this.pos.top},a:{top:-(this.contenido.offsetHeight+this.pos.top)},ms:700,fin:function() {
			thsom.style.overflowY="hidden";
			thsom.parentNode.removeChild(thsom);
		}});
		//this.sombra.parentNode.removeChild(this.sombra);
		if (this.cbcerrar) this.cbcerrar();
	}
	function empezarmov(v){
		return function(e){
			if (e){
				var xx= e.pageX;
				var yy= e.pageY;
				e.preventDefault();
			}else {
				var xx= event.clientX;
				var yy= event.clientY;
			}
			v.dtop=yy-v.pos.top;
			v.dleft=xx-v.pos.left;
			v.bmov=true;

			ventActiva.contenido.style.zIndex=500;
			ventActiva=v;
			v.contenido.style.zIndex=1000;
			
			document.body.onmousemove=mover(v);
			document.body.onmouseup=function(){ this.onmousemove=this.onmouseup=null; v.bmov=false; v.cabecera.onmousedown=empezarmov(v); document.body.onmousedown=null; }
			document.body.onmousedown=null;
		}
	}
	function mover(v){
		return function(e){
			if (e){
				var xx= e.pageX;
				var yy= e.pageY;
				e.preventDefault();
			}else {
				var xx= event.clientX;
				var yy= event.clientY;
			}
			v.pos.top=yy-v.dtop;
			v.pos.left=xx-v.dleft;
			v.contenido.style.top=v.pos.top+"px";
			v.contenido.style.left=v.pos.left+"px";
		}
	}
	return {
		simple:ventanaSimple,
		titulo:ventanaTit,
		titcerrar:ventanaCe,
		aceptar:ventanaAcep,
		titaceptar:ventanaTitAcep,
		principal:ventanatitPrin,
		entera:ventanaTodo,
		popup:ventanapopup
	};
})();

var CMenu=(function() {
	function menuselec(ele){
		return function(e){
			this.className="com-menu menu-selec";
			this.onclick=null;
			if (ele.sel!=null) {
				ele.ops[ele.sel].className="com-menu menu-noselec";
				ele.ops[ele.sel].onclick=menuselec(ele);
			}
			ele.sel=this.nele;
			if (ele.cb)
				ele.cb(this.nele);
		}
	}
	function CMenu(op){
		this.ops=[];
		this.cb=op.callback;
		this.sel=null;
		this.barra=document.createElement("div");
		this.barra.className="com-barra";
		var cl;
		for (var i=0,lon=op.opciones.length;i<lon;i++) {
			if ( op.selec==i){ cl="menu-selec"; this.sel=i; }
			else cl="menu-noselec";
			this.ops.push(hUtils.crearElemento({ e:"a",a:{className:"com-menu "+cl,nele:i},inner:op.opciones[i] }));
			if (i!=this.sel)
				this.ops[i].onclick=menuselec(this);
			this.barra.appendChild(this.ops[i]);
		}
		if (op.padre) op.padre.appendChild(this.barra);
	}
	CMenu.prototype.selec=function(opc){
		if (opc!==null){ //isNaN
			menuselec(this).call(this.ops[opc]);
		}else if (this.sel!=null){
			this.ops[this.sel].className="com-menu menu-noselec";
			this.ops[this.sel].onclick=menuselec(this);
			this.sel=null;
		}
	}
	return CMenu;
})();

/*var Cnumero=Ctexto;
Cnumero.render=function(dat){
	var td=document.createElement("td");
	td.align="right";
	td.innerHTML=dat;
	return td;
}*/
/*var Cnumero={
	render:function(dat){
		var td=document.createElement("td");
		td.align="right";
		td.innerHTML=dat;
		return td;
	},
	get:function(td){
		return td.innerHTML;
	},
	set:function(td,dat){
		td.innerHTML=dat;
	}
}*/




function Clab() {
	this.datos={};
}
Clab.prototype.seterror=function(s){
	this.datos.error=document.createElement("div");
	this.datos.error.className="com-error";
	this.datos.error.innerHTML=s;
	this.datos.ent.parentNode.appendChild(this.datos.error);
	this.datos.ent.focus();
	/*
	this.datos.error.innerHTML=s;
	this.datos.error.style.display="block";
	this.datos.ent.focus();*/
	//var self=this;
	//this.datos.ent.onchange=function() 	{ self.outerror();}
}
Clab.prototype.outerror=function() {
	//console.log("outerror de ", this, "=",this.datos.error);
	if (this.datos.error){
		this.datos.error.parentNode.removeChild(this.datos.error);
		this.datos.error=null;
	}
	//this.datos.error.style.display="none";
	//this.datos.ent.onchange=null;
}
function Clabnum(op){ 
	if (op) {
		Clab.call(this);
		this.maxlon=op.lon || 400;
		this.min=op.min != "undefined" ? op.min : 0;
		this.max=op.max || 100; 
		this.tint=op.tint;
		if (op.tint){
			var pres=hUtils.inputOnlyNumbers, st=1;
		}else{
			var pres=hUtils.inputOnlyFloats,st=0.1;
		}
		op.padre.appendChild((this.conte=hUtils.crearElemento({
			e:"div",a:{className:"com-labinput secundario"},hijos:[
				{e:"label",inner:op.la+":",did:"lano"},{e:"input",did:"ent",a:{type:"number",maxLength:this.maxlon,placeholder:op.la, min:this.min, max:this.max,step:st,size:4,onkeypress:pres},c:{textAlign:"right"}}]},this.datos)));
				//,{e:"div",a:{className:"com-error"},did:"error"}
	}
}
Clabnum.prototype=new Clab;
Clabnum.prototype.set=function(v){
	this.datos.ent.value=String(v).replace(/\,/,'.');
}
Clabnum.prototype.get=function(){
	var v=hUtils.stripHtml(this.datos.ent.value);
	this.datos.ent.value=v;
	return {v:v};
}
Clabnum.prototype.comprobar=function() {
	var va=this.get(),v=va.v;
	if (v.length==0){
		this.datos.ent.value=0;
		va.v=0;
		//this.seterror("Debes de introducir un valor.");
		//return false;
	}else {
		if ( v.length > this.maxlon){
			this.seterror("La longitud de este valor no puede superar los "+this.maxlon+" caracteres.");
			return false;
		}
		var a;
		if (this.tint) {
			if (!hUtils.validarInt(v) || (a=parseInt(v,10))>this.max || a<this.min) {
				this.seterror("Debes de introducir un número entre "+this.min+" y "+this.max);
				return false;
			}
		}else {
			v=String(v).replace(/\,/,'.');
			if (!hUtils.validarFloat(v) || (a=parseFloat(v))>this.max || a<this.min) {
				this.seterror("Debes de introducir un número entre "+this.min+" y "+this.max);
				return false;
			}
		}
		va.v=a;
	}
	this.outerror();
	return va;
}


function ClabInpflsw(op){ 
	Clabnum.call(this,op);
	this.valores=op.va;
	this.sel=0;
	
	this.datos.lano.style.display="block";
	this.datos.ent.style.float="left";
	this.datos.ent.style.cssFloat="left";
	this.conte.insertBefore(hUtils.crearElemento({e:"div", did:"val", a:{className:"divf"}, inner:op.va[0] } ,this.datos),this.datos.error );
	this.conte.insertBefore(hUtils.crearElemento({e:"button",did:"elbo",a:{ className:"val" , onclick:this.clickval.bind(this) },hijos:[{e:"div",did:"v0",a:{className:"divf spanval"},inner:op.va[0] },{e:"div",did:"v1",a:{className:"divf spansin"},inner:op.va[1] }] } ,this.datos),this.datos.error );
	
}
ClabInpflsw.prototype=Object.create ? Object.create(Clabnum.prototype) :  new Clabnum;
ClabInpflsw.prototype.clickval=function(e){
	if (this.sel==1){
		this.datos.v0.className="divf spanval";
		this.datos.v1.className="divf spansin";
		this.datos.elbo.className="val";
		this.sel=0;
	}else {
		this.datos.v1.className="divf spanval";
		this.datos.v0.className="divf spansin";
		this.datos.elbo.className="sinval";
		this.sel=1;
	}
	this.datos.val.innerHTML=this.valores[this.sel];
}
ClabInpflsw.prototype.setsw=function(v,s){
	this.datos.ent.value=v;
	this.sel=s;
	if (this.sel==1){
		this.datos.v1.className="divf spanval";
		this.datos.v0.className="divf spansin";
		this.datos.elbo.className="sinval";
	}else {
		this.datos.v0.className="divf spanval";
		this.datos.v1.className="divf spansin";
		this.datos.elbo.className="val";
	}
	this.datos.val.innerHTML=this.valores[this.sel];
}
ClabInpflsw.prototype.get=function(){
	var v=hUtils.stripHtml(this.datos.ent.value);
	this.datos.ent.value=v;
	return {v:v,s:this.sel,vs:this.valores[this.sel] };
}
function ClabSelect(op){
	Clab.call(this);
	op.padre.appendChild(hUtils.crearElemento({
			e:"div",a:{className:"com-labinput secundario"},did:"conte",hijos:[
				{e:"label",inner:op.la+":"},{e:"select",did:"ent"}]},this.datos));
	//,{e:"div",a:{className:"com-error"},did:"error"}
}
ClabSelect.prototype=new Clab;

ClabSelect.prototype.opciones=function(opt) {
	this.datos.ent.options.length=0; //[];
	for(var i=0,lon=opt.length;i<lon;i++){
		this.datos.ent.options[i]=new Option(opt[i][0],opt[i][1]);
	}
}
ClabSelect.prototype.get=function() {
	return this.datos.ent.options[this.datos.ent.selectedIndex];
}

function ClabLista(op){
	this.datos={};
	var aux=hUtils.crearElemento({
			e:"fieldset",a:{className:"com-clablista"}, hijos:[{e:"legend",inner:op.la},
				{e:"div",did:"ent"},{e:"br",a:{className:"salto"}},{e:"label",inner:op.la+" seleccionados:"},{e:"div",did:"contenedor",a:{className:"contenedor"}},{e:"br",a:{className:"salto"}}]},this.datos);
	/*aux.appendChild(hUtils.crearElemento({
			e:"div",a:{className:"com-labinput"},c:{border:"1px solid #333"},hijos:[
				{e:"label",inner:op.la,c:{display:"block"}},{e:"div",did:"ent"},{e:"div",did:"contenedor",c:{border:"1px solid gray"}}]},this.datos));*/
	op.padre.appendChild(aux);
}
ClabLista.prototype.seteles=function(eles){
	this.datos.ent.innerHTML="";
	var ele;
	for(var i=0,lon=eles.length;i<lon;i++){
		ele=document.createElement("a");
		ele.innerHTML=eles[i][0];
		ele.vadid=eles[i][1];
		ele.href="javascript:void(0);";
		ele.title="Añadir";
		this.datos.ent.appendChild(ele);
		ele.onclick=this.clickele(this);
	}
}
ClabLista.prototype.setconte=function(eles) {
	this.datos.contenedor.innerHTML="";
	var ele;
	for(var i=0,lon=eles.length;i<lon;i++){
		ele=document.createElement("a");
		ele.innerHTML=eles[i][0];
		ele.vadid=eles[i][1];
		ele.href="javascript:void(0);";
		ele.title="Borrar";
		this.datos.contenedor.appendChild(ele);
		ele.onclick=hUtils.removerelemento;
	}
}

ClabLista.prototype.clickele=function(clis) {
	return function(e){
		var ele;
		ele=document.createElement("a");
		ele.innerHTML=this.innerHTML;
		ele.vadid=parseInt(this.vadid,10);
		ele.href="javascript:void(0);";
		ele.title="Borrar";
		clis.datos.contenedor.appendChild(ele);
		ele.onclick=hUtils.removerelemento;
	}
}
ClabLista.prototype.get=function() {
	var eles=this.datos.contenedor.getElementsByTagName("a");
	var lis=[];
	for (var i=0,lon=eles.length;i<lon;i++)
		lis.push(eles[i].vadid);
	return lis;
}
ClabLista.prototype.getnoms=function() {
	var eles=this.datos.contenedor.getElementsByTagName("a");
	var lis=[];
	for (var i=0,lon=eles.length;i<lon;i++)
		lis.push(eles[i].innerHTML);
	return lis;
}
function ClabCheck(op){
	//this.conte=document.createElement("div");

	//this.datos={};
	Clab.call(this);
	this.conte=hUtils.crearElemento({
			e:"fieldset",hijos:[{e:"legend",inner:op.la},
				{e:"div",did:"ent"}]},this.datos);//,{e:"div",a:{className:"com-error"},did:"error"}

	/*this.conte.appendChild(hUtils.crearElemento({
			e:"div",a:{className:"com-labinput"},c:{border:"1px solid #333"},hijos:[
				{e:"label",inner:op.la,c:{display:"block"}},{e:"div",did:"ent"},{e:"div",did:"contenedor",c:{border:"1px solid gray"}}]},this.datos));*/
	op.padre.appendChild(this.conte);
}
function checkEtiqueta() {
	this.parentNode.getElementsByTagName("input")[0].click();
}
ClabCheck.prototype=new Clab;
ClabCheck.prototype.seteles=function(eles,sel){
	this.datos.ent.innerHTML="";
	this.datos.che={};
	var ele;
	for(var i=0,lon=eles.length;i<lon;i++){
		ele=hUtils.crearElemento({e:"div",a:{className:"com-clabcheck"},hijos:[{e:"input",did:"ch"+i,a:{type:"checkbox", checked:sel[i],vadid:eles[i][1]}}, {e:"label",inner:eles[i][0],a:{onclick:checkEtiqueta}}]},this.datos.che);
		this.datos.ent.appendChild(ele);

	}
}
ClabCheck.prototype.get=function() {
	var lis=[];
	for (var i in this.datos.che)
		if (this.datos.che[i].checked)
			lis.push(this.datos.che[i].vadid);
	return lis;
}
ClabCheck.prototype.limpiar=function() {
	for (var i in this.datos.che) this.datos.che[i].checked=false;
}
ClabCheck.prototype.getnoms=function() {
	var lis=[];
	for (var i in this.datos.che)
		if (this.datos.che[i].checked)
			lis.push(this.datos.che[i].parentNode.getElementsByTagName("label")[0].innerHTML);
	return lis;
}
function ClabInput(op,nu){
	//this.datos={};
	Clab.call(this);
	this.maxlon=op.lon || 400;
	if (op.area){
		op.padre.appendChild(hUtils.crearElemento({
			e:"div",a:{className:"com-labinput secundario"},hijos:[
				{e:"label",inner:op.la+ (op.masla || "") + ":",c:{display:"block"}},{e:"textarea",did:"ent",a:{maxLength:this.maxlon,placeholder:"introduce "+op.la,className:"bloque"}}]},this.datos));//,{e:"div",a:{className:"com-error"},did:"error"}
	}else {
		op.padre.appendChild(hUtils.crearElemento({
			e:"div",a:{className:"com-labinput secundario"},hijos:[
				{e:"label",inner:op.la+ (op.masla || "") +":",did:"lano"},{e:"input",did:"ent",a:{type:"text",maxLength:this.maxlon,placeholder:"introduce "+op.la}}]},this.datos));//,{e:"div",a:{className:"com-error"},did:"error"}
		if (nu){
			this.numero=nu;
			this.datos.ent.size=this.maxlon;
		}else {
			this.numero=false;
			this.datos.lano.style.display="block";
			this.datos.ent.className="bloque";
		}
	}
}
ClabInput.prototype=new Clab;
ClabInput.prototype.set=function(v){
	this.datos.ent.value=hUtils.unhtmlEntities(v);
}
ClabInput.prototype.get=function(){
	var v=hUtils.stripHtml(this.datos.ent.value);
	this.datos.ent.value=v;
	return v;
}
ClabInput.prototype.comprobar=function() {
	var v=this.get();
	if (v.length==0){
		this.seterror("Debes de introducir un valor.");
		return false;
	}
	if ( v.length > this.maxlon){
		this.seterror("La longitud de este valor no puede superar los "+this.maxlon+" caracteres.");
		return false;
	}
	if (this.numero){
		if (!this.numero(v)) {
			this.seterror("Debes de introducir un número.");
			return false;
		}
		if (this.numero==hUtils.validarFloat);
			v=String(v).replace(/\,/,'.');
	}
	this.outerror();
	return v;
}
function ClabInpSel(op){
	Clab.call(this);
	this.maxlon=op.lon || 100;
	op.padre.appendChild(hUtils.crearElemento({e:"fieldset",a:{className:"com-labinput secundario"},hijos:[{e:"legend",inner:op.la},{e:"input",did:"ent",a:{type:"text",maxLength:this.maxlon,placeholder:op.la}},{e:"select",did:"lista",c:{display:"block",width:"98%",fontSize:"0.9em"}}]},this.datos));
	//e:"div",a:{className:"com-labinput secundario"},hijos:[{e:"label",inner:op.la+":"}
	//this.datos.lista.options[0]=new Option("0");
	this.datos.planti=op.planti; 
	//this.datos.ent.onfocus=this.sacarlista(this,op.planti,op.control);
	this.datos.ent.onblur=this.mayus(this);
	if (op.control){
		this.datos.control=op.control
		this.datos.lista.onclick=this.sacarlista(this);
	}
	this.ult_valor="";
	this.pintarlista();
}
ClabInpSel.prototype=new Clab;
ClabInpSel.prototype.mayus=function(ele) {
	return function(){
		if (this.value!= ele.ult_valor){
			this.value=this.value.toUpperCase();
			if (ele.datos.planti.listagrupo.indexOf(this.value)<0){
				ele.datos.planti.listagrupo.push(this.value);
				ele.ult_valor=this.value;
				ele.pintarlista();
			}
		}
	}

}
ClabInpSel.prototype.set=function(v){
	this.datos.ent.value=hUtils.unhtmlEntities(v.toUpperCase());
	var ll=this.datos.lista;
	for (var i=0,lon=ll.options.length;i<lon;i++)
		if (ll.options[i].text==v) { ll.selectedIndex=i; break;}
}
ClabInpSel.prototype.get=function(){
	var v=hUtils.stripHtml(this.datos.ent.value);
	this.datos.ent.value=v;
	return v;
}
ClabInpSel.prototype.comprobar=function() {
	var v=this.get();
	if (v.length==0){
		this.seterror("Debes de introducir un valor.");
		return false;
	}
	if ( v.length > this.maxlon){
		this.seterror("La longitud de este valor no puede superar los "+this.maxlon+" caracteres.");
		return false;
	}
	this.outerror();
	return v;
}
ClabInpSel.prototype.pintarlista=function(){
	this.datos.lista.options.length=0;
	var ax=this.datos.planti.listagrupo; //[];
	for(var i=0,lon=ax.length;i<lon;i++){
		this.datos.lista.options[i]=new Option(ax[i]);
		//this.datos.lista.options[i].onclick=this.selelemento(this);
	}
	this.datos.lista.onchange=this.selelemento(this);
}
ClabInpSel.prototype.sacarlista=function(ele){
	return function(){
		if (ele.datos.planti.listagrupo.length==this.options.length) return;
		var val,lo=ele.datos.control.plaMod.length,ax=ele.datos.planti; //,lon=ax.listagrupo.length,hay
		for (var i=0;i<lo;i++){
			val=ele.datos.control.plaMod[i].grupo.get();
			if (val=="0" || val.length<1) continue;
			if (ax.listagrupo.indexOf(val)<0)
				ax.listagrupo.push(val);
			/*hay=false;
			for (var x=0;x<lon;x++)
				if (ax.listagrupo[x]==val) { hay=true;break;}
				if (!hay)
					ax.listagrupo.push(val);*/
		}
		ele.pintarlista();
	}
}

ClabInpSel.prototype.hacerlistagrupo=function(trp,planti,c){
	var lo=trp.length,listagrupo=["0"],val; //,hay
	for (var i=0;i<lo;i++){
		val=trp[i].cells[c].innerHTML;
		if (val=="0") continue;
		if (planti.listagrupo.indexOf(val)<0)
			planti.listagrupo.push(val);
		/*hay=false;
		for (var x=0;x<planti.listagrupo.length;x++)
			if (planti.listagrupo[x]==val) { hay=true;break;}
		if (!hay)
			planti.listagrupo.push(val);*/
	}
	/*var hay;
	lo=control.plaMod.length;
	//console.log("entraaaaaaaa hacerlistagrupo lo="+lo+", length de listagrupo="+planti.listagrupo.length);
	for (var i=0;i<lo;i++){
		val=control.plaMod[i].grupo.get();
		if (val=="0" || val.length<1) continue;
		hay=false;
		for (var x=0;x<planti.listagrupo.length;x++)
			if (planti.listagrupo[x]==val) { hay=true;break;}
			if (!hay)
				planti.listagrupo.push(val);
	}*/
}

ClabInpSel.prototype.selelemento=function(ele){
	return function(){
		//console.log("this=",this," y index ele=",ele.datos.selectedIndex," y ele=",ele.datos.lista.options[ele.datos.selectedIndex]);
		ele.datos.ent.value=ele.datos.lista.options[ele.datos.lista.selectedIndex].text;
	}
}
var CRadio=(function() {
	function radioselec(ele){
		return function(e){
			//console.log("seleccionado = "+this.nele);
			this.getElementsByTagName("div")[0].innerHTML="<div><div><span>&#10004;</span></div></div>";
			this.className=" com-componet com-radio-selec";
			this.onclick=null;
			//ele.opi["op"+this.nele].className="com-radio-selec";
			if (ele.sel!=null) {
				ele.ops[ele.sel].getElementsByTagName("div")[0].innerHTML="<div><div></div></div>";
				ele.ops[ele.sel].className=" com-componet com-radio-noselec";
				ele.ops[ele.sel].onclick=radioselec(ele);
			}
			ele.sel=this.nele;
			if (ele.cb)
				ele.cb(this.nele,ele);
			if (e){
				e.stopPropagation();
	        	e.preventDefault();
			}
		}
	}
	function CRadio(op){
		this.ops=[];
		if (op.callback)
			this.cb=op.callback;
		this.sel=null;
		if (op.dat)
			this.dat=op.dat;
		//var cl;
		for (var i=0,lon=op.opciones.length;i<lon;i++) {
			//if ( op.selec==i){ cl=" com-radio-selec"; this.sel=i; }
			//else cl=" com-radio-noselec";
			if ( op.selec==i){ 
				this.sel=i; 
				this.ops.push(hUtils.crearElemento({ e:"a",a:{className:"com-componet com-radio-selec",href:"javascript:void(0);",nele:i},inner:"<div class='com-radio-cir'><div><div><span>&#10004;</span></div></div></div><label>"+op.opciones[i]}));
			}else {
				this.ops.push(hUtils.crearElemento({ e:"a",a:{className:"com-componet com-radio-noselec",href:"javascript:void(0);",nele:i},inner:"<div class='com-radio-cir'><div><div></div></div></div><label>"+op.opciones[i]}));
				this.ops[i].ontouchstart=this.ops[i].onclick=radioselec(this);
			}

			//this.ops.push(hUtils.crearElemento({ e:"a",a:{className:"com-componet"+cl,href:"javascript:void(0);",nele:i},
			//						hijos:[{e:"div",a:{className:"com-radio-cir"}, 
			//								hijos:[{e:"div",hijos:[{e:"div"}]}]}, {e:"label",inner:op.opciones[i]} ] }));
			//if (i!=this.sel)
			//	this.ops[i].ontouchstart=this.ops[i].onclick=radioselec(this);
			op.padre.appendChild(this.ops[i]);
		}
		
	}
	CRadio.prototype.seleccionar=function(nele){
		if (this.sel==nele || nele>this.ops.length) return;
		if (this.sel!=null) {
				this.ops[this.sel].getElementsByTagName("div")[0].innerHTML="<div><div></div></div>";
				this.ops[this.sel].className=" com-componet com-radio-noselec";
				this.ops[this.sel].onclick=radioselec(this);
			}
		this.sel=nele;
		this.ops[nele].getElementsByTagName("div")[0].innerHTML="<div><div><span>&#10004;</span></div></div>";
		this.ops[nele].className=" com-componet com-radio-selec";
		this.ops[nele].onclick=null;
	}
return CRadio;
})();
var Cradiocheck=(function(){
	var cradiosel=function(nele,ele){
		if (nele==0){
			ele.dat.outerror();
			ele.dat.datos.ent.style.display="none";
			ele.dat.limpiar();
		}else
			ele.dat.datos.ent.style.display="block";
	}
	function Cradiocheck(op){
		this.selche=new ClabCheck({la:op.la,padre:op.padre});
		this.todas=new CRadio({opciones:["Todas","Selección"],selec:op.selec ? 1 : 0,padre:this.selche.conte,callback:cradiosel,dat:this.selche});
		this.selche.datos.ent.style.display=op.selec ? "block" : "none";
	}
	Cradiocheck.prototype.comprobar=function(ca) {
		this.selche.outerror();
		var obart=0;
		if (this.todas.sel==1 && (obart=this.selche.get()).length==0){
			this.selche.seterror("Debes de seleccionar algún "+ca+" o todos.");
			return false;
		}
		return {v:obart};
	}
	Cradiocheck.prototype.seleccionar=function(s){
		if (s===0){
			this.selche.datos.ent.style.display="none";
			this.selche.limpiar();
		}else
			this.selche.datos.ent.style.display="block";
		this.todas.seleccionar(s);
	}

return Cradiocheck;
})();

function Controlador(plan) { //modelo,showmodi,clearmodi,tit1,tit2,crpl,acep){
	this.plaMod=null;
	this.plantilla=plan;
	this.tabla=null;
	this.ventabla=null;
	this.venMod=null;
	this.modificar=false;
}
Controlador.prototype.init=function(ediv,ven,at){
	var shm=this.showModificador(this);
	this.tabla=new ClsTabla.tabla(this.plantilla,shm);
	this.ventabla=new ven({
				titulo:this.plantilla.tit1,
				contenido:this.tabla.tabla,
				padre:ediv,
				anchototal:at,
				aceptar:{tit:"Añadir "+this.plantilla.tit2,cb:shm }
			});
	/*this.ventabla=new ClsVentana({
				titulo:this.plantilla.tit1,
				contenido:this.tabla.tabla,
				sombra:false,
				movible:false,
				centrar:false,
				padre:ediv,
				inline:true,
				aceptar:{tit:"Añadir "+this.plantilla.tit2,cb:shm }
			});*/
	//this.ventabla.show();
}
/*Controlador.prototype.eliminarplamod=function (nele,divp,e){
	divp.parentNode.removeChild(divp);
	for (var z=0,lon=this.plaMod.length;z<lon;z++)
		if (this.plaMod[z].nele==nele) {
			this.plaMod.splice(z,1); break;
		}
}*/
Controlador.prototype.eliminarplamodMod=function (divp,e){
	if (this.plaMod.length==1){
		this.venMod.cerrar();
		divp.setAttribute("data-nele",0); // nele=0;
		this.plaMod[0].nele=0;
		return;
	}
	var nele=parseInt(divp.getAttribute("data-nele"),10);// nele;
	divp.parentNode.removeChild(divp);
	for (var z=0,lon=this.plaMod.length;z<lon;z++){
		if (this.plaMod[z].nele==nele) {
			this.plaMod.splice(z,1);
			if (this.modificar) 
				this.plantilla.tramod.splice(z,1);
			break;
		}
	}
}
Controlador.prototype.nuevaPlantMod=function() {
	var aux=document.createElement("div");
	aux.className="bloqs_ven_form";
	var npla=this.plaMod.length;
	//if (npla>0)
	//c:{textAlign:"right",marginTop:"1em",paddingTop:"1em",borderTop:"4px dotted gray" }
	aux.setAttribute("data-nele",npla); // nele=npla;
		aux.appendChild(hUtils.crearElemento({e:'div',a:{className:"elim_form"}, hijos:[{e:"button",inner:"Eliminar",a:{className:'btn btn-corto btn-info',onclick:this.eliminarplamodMod.bind(this,aux)}}] },null));//this.eliminarplamodMod.bind(this,npla,aux)
	var plnpm=this.plantilla.nuevoplamod(aux,npla);
	this.plaMod.push(plnpm[0]);
	if (this.plantilla.rellenar) //if (npla>0 && this.plantilla.rellenar)
		this.plantilla.rellenar(this.modificar ? this.plantilla.tramod[npla] : false,npla);
	this.divplamod.appendChild(aux);
	plnpm[1].focus();
}
Controlador.prototype.crearPlantillaMod=function() {
	
	//var aux=document.createElement("div");
	this.plaMod=[];
	
	var aux=hUtils.crearElemento({e:"div",hijos:[{e:"div",a:{className:"com-error"},did:"geerror"}]},this);
	this.divplamod=document.createElement("div");
	this.baddplamod=hUtils.crearElemento({e:"div",a:{className:"elim_form"},hijos:[{e:"button",inner:"Añadir",a:{className:'btn btn-corto btn-info',onclick:this.nuevaPlantMod.bind(this)} }]},null);
	aux.appendChild(this.divplamod);
	aux.appendChild(this.baddplamod);
	if (this.plantilla.conclase) aux.className=this.plantilla.conclase;
	var auxint=document.createElement("div");
	auxint.className="bloqs_ven_form";
	auxint.setAttribute("data-nele",0); // nele=0;
	//c{textAlign:"right",marginTop:"1em",paddingTop:"1em",borderTop:"4px dotted gray"}
	auxint.appendChild(hUtils.crearElemento({e:'div',a:{className:"elim_form"},hijos:[{e:"button",inner:"Eliminar",a:{className:'btn btn-corto btn-info',onclick:this.eliminarplamodMod.bind(this,auxint)}}] },null));

	this.plaMod.push(this.plantilla.nuevoplamod(auxint,0)[0]); // crear();
	this.divplamod.appendChild(auxint);
	this.venMod=new ClsVentanasTipo.popup({
			titulo:"Añadir "+this.plantilla.tit2,
			contenido:aux,
			aceptar:{tit:"Enviar", cb:this.cbcomprobar(this) }
		});
	/*this.venMod=new ClsVentana({
			titulo:"Añadir "+this.plantilla.tit2,
			contenido:aux,
			sombra:true,
			movible:true,
			centrar:true,
			padre:document.body,
			aceptar:{tit:"Enviar", cb:this.cbcomprobar(this) }
		});*/
	
}
Controlador.prototype.eliminar=function() {
	this.ventabla.cerrar();
	if (this.venMod)
		this.venMod.cerrar();
	this.tabla=this.plaMod=this.plantilla=this.ventabla=this.venMod=this.modificar=null;
}
Controlador.prototype.cbcomprobar=function(ele){
	return function(){
		ele.plantilla.comprobar();
	}
}
Controlador.prototype.showModificador=function(ele){ //,showmodi,clearmodi,tit,acep,crpl){
	return function(trs){
		if (ele.plaMod==null) 
				ele.crearPlantillaMod();
		ele.eliminarPlamods();
		if(trs){
			ele.modificar=true;
			ele.plantilla.modificar(trs);
			ele.venMod.tit.innerHTML="Modificar "+ele.plantilla.tit2;
			ele.baddplamod.style.display="none";	
		}else {
			ele.modificar=false;
			if (! ele.plantilla.limpiar()){
				ele.venMod.cerrar();
				return;
			}
			ele.baddplamod.style.display="block";
			ele.venMod.tit.innerHTML="Añadir "+ele.plantilla.tit2;
		}
		/*if (ele.plaMod.length>1){
			ele.plaMod.splice(1,ele.plaMod.length-1);
			while (ele.divplamod.childNodes.length>1) ele.divplamod.removeChild(ele.divplamod.childNodes[1]);
		}*/
		
		var ix=0;
		//if (hUtils.type(ele.plaMod)=="array") var epla=ele.plaMod[0];
		//else epla=ele.plaMod;
		/*for (var i in ele.plaMod){
			if (ix==0) ix=i;
			if (ele.plaMod[i].outerror) ele.plaMod[i].outerror();
		}
		ele.outerror();
		ele.venMod.show();
		ele.plaMod[ix].datos.ent.focus();*/
		for (var i in ele.plaMod[0]){
			if (ix==0) ix=i;
			if (ele.plaMod[0][i].outerror) ele.plaMod[0][i].outerror();
		}
		ele.outerror();
		ele.venMod.show();
		ele.plaMod[0][ix].datos.ent.focus();
	}
}
Controlador.prototype.seterror=function(s){
	this.geerror.innerHTML=s;
	this.geerror.style.display="block";
}
Controlador.prototype.outerror=function() {
	this.geerror.style.display="none";
}
Controlador.prototype.eliminarPlamods=function() {
	this.venMod.aceptar.disabled=false;
	this.plantilla.tramod=null;
	this.plantilla.tmp=null;
	if (this.plaMod.length>1){
		this.plaMod.splice(1,this.plaMod.length-1);
		while (this.divplamod.childNodes.length>1) this.divplamod.removeChild(this.divplamod.childNodes[1]);
	}
}
Controlador.prototype.enviar=function(dajson) {
	if (controladorTienda.haytienda()){
	var _thisyo2=this;
		this.venMod.aceptar.disabled=true;
		hUtils.xJson({url:this.plantilla.url,datos:window.JSON.stringify(dajson),formu:true}).then(function(res){
			controladorPrincipal.addcambio(1);
			if (_thisyo2.modificar)
				_thisyo2.plantilla.okmodificar(res);
			else
				_thisyo2.plantilla.okinsertar(res);
			//cbok(res,_thisyo2.plantilla);
			_thisyo2.venMod.cerrar();
			//_thisyo2.venMod.aceptar.disabled=false;
			//_thisyo2.plantilla.tmp=null;
			_thisyo2.eliminarPlamods();
		}).fail(function(er){
			console.log("recibimos error respuesta dat="+er);
			_thisyo2.venMod.aceptar.disabled=false;
			//_thisyo2.plantilla.tmp=null;
			//_thisyo2.eliminarPlamods();
		});
	}else {
		console.log("No se puede realizar peticiones pq no hay tienda creada.");
	}
}