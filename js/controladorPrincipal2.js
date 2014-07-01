'use strict';
var controladorPrincipal=(function(){
var opcs=["Pizzas","Productos Simples","Productos con Ingredientes","Ofertas","Imágenes", "Tienda"];
function menuImagenes(actsel){
	var s=opcs.indexOf("Imágenes");
	if (s>-1){
		if (s != sel)
			menuprin.selec(s);
		FileimgApi.planImagenes.modo_seleccion(actsel);
	}
}
function menuchange(opc){
//	console.log("opcion="+opcs[opc]);
	if (opc>divs.length) return;
		divs[opc].style.display="block";
		//console.log("contenido="+contenido.offsetHeight+", subconte="+subconte.offsetHeight+", opc="+divs[opc].offsetHeight);
		//contenido.style.height=(divs[opc].offsetHeight+100)+"px";
		//contenido.style.overflow="hidden";
		//var clscss=divs[opc].className;
		hUtils.fx({e:divs[opc],edat:null,d:{left:divs[opc].offsetWidth},a:{left:0},ms:700,fin:function(ele) {
			//nada
		}}); 
		//hUtils.fx({e:divs[opc],edat:null,d:{left:-divs[opc].offsetWidth},a:{left:0},ms:500}); 
		hUtils.fx({e:divs[sel],edat:null,d:{left:0},a:{left:-divs[sel].offsetWidth},ms:700,fin:function(ele) {
				//console.log("saleeeee"); 
				ele.style.display="none";
				//contenido.style.height="auto";
				//contenido.style.overflow="visible";
			}});
		sel=opc;
	
		//hUtils.fx({e:divs[opc],edat:null,d:{left:0},a:{left:-divs[opc].offsetWidth},ms:500,fin:function() {
		//		console.log("saleeeee"); fuera=true;
		//	}});
}
//var divprin=document.createElement("div");
//divprin.className="principal"; // wrapper";
var divs=[],
	sel=5,contenido,subconte,menuprin,haycambios=0;
/*function enviar_cambios(obj,esok) {
	if (esok){
		controladorTienda.act_des_web(0,"salir");
	}
	salir();
	return;
	hUtils.xJson({url:"/admintienda/Tiendas/grabModi", datos:window.JSON.stringify({"ope":"mod","cambios":haycambios}),accion:"POST",formu:true}).then(function(dat){
		haycambios=0;
	}).fail(function(err){
		console.log("Se ha producido un error vuelve a intentarlo o recarga la página err=."+err);
	});
}*/
function salir() {
	
	//hUtils.xJson({url:"/usuario/logout",accion:"POST",formu:false}).then(function(dat){
		window.onbeforeunload=null;
		hUtils.cookies.clearAll();
		window.location.href="/usuario/login";
	/*}).fail(function(err){
		console.log("hay faallosososl = ",err);
	});*/
}
function comprobar_cambios(e){
	if (haycambios>0){
		controladorTienda.act_des_web(0,"salir");
		ClAlerta.marcar({tit:"Enviando cambios",inte:"Un momento estamos enviando las últimas modificaciones"});
		//enviar_cambios();
		//alert("Un momento. Estamos enviando las últimas modificaciones realizadas.");
	}else if (controladorTienda.webactiva()==1){
		ClAlerta.marcar({tit:"Activar Web",inte:"No hay cambios y la Web pública está DESACTIVADA.<br>¿Deseas ACTIVAR la Web ahora?",f:function (obj,esok) {
				if (esok)
					controladorTienda.act_des_web(0,"salir");
				else
					salir();
			} 
		});
	}else
		salir();
	/* if (document.getElementById("logusu").getElementsByTagName("span")[1].getElementsByTagName("button")[0].innerHTML=="Activar"){
		if (confirm("No hay cambios y la Web pública está DESACTIVADA. ¿Seguro que deseas salir?")){
			salir();
		}
		
	}else{
		salir();
		/*hUtils.cookies.clearAll();
		window.location.href="/usuario/logout";
	}*/
}
function inicio() {
	var conmenu=document.createElement("div");
	conmenu.className="divmenu";
	//document.body.appendChild(divprin);
	contenido=document.createElement("div");
	contenido.className="marco-principal";
	subconte=document.createElement("div");
	subconte.className="marco-subprin";
	contenido.appendChild(subconte);
	
	
	hUtils.xJson({url:"/admintienda/listado",accion:"GET",formu:false}).then(function(dat){
		console.log("recibimos ok respuesta dat=",dat);
		hUtils.csrf_token=dat.csrf;
		document.body.removeChild(document.getElementById("loader"));
		document.body.appendChild(conmenu);
		document.body.appendChild(contenido);
		menuprin=new CMenu({selec:sel,opciones:opcs,callback:menuchange,padre:conmenu});
		
		divs.push(controladorMasasTamas.inicio(subconte,dat));
		divs.push(controladorOtros.inicio(subconte,dat));
		divs.push(controladorOtroscomplex.inicio(subconte,dat));
		divs.push(controladorOfertas.inicio(subconte,dat));
		divs.push(FileimgApi.planImagenes.inicio(subconte));
		divs.push(controladorTienda.inicio(subconte,dat));
		dat=null;

		//divs[1].style.left=contenido.offsetWidth+"px";
		//console.log("divs[1]=",divs);
		//divs[1].style.top=-divs[0].offsetHeight+"px";




		hUtils.fx({e:divs[0],edat:null,d:{left:0},a:{left:divs[0].offsetWidth},ms:500,fin:function() {
			divs[0].style.display="none";
		}});
		hUtils.fx({e:divs[1],edat:null,d:{left:0},a:{left:divs[1].offsetWidth},ms:500,fin:function() {
			divs[1].style.display="none";
		}});
		hUtils.fx({e:divs[2],edat:null,d:{left:0},a:{left:divs[2].offsetWidth},ms:500,fin:function() {
			divs[2].style.display="none";
		}});
		hUtils.fx({e:divs[3],edat:null,d:{left:0},a:{left:divs[3].offsetWidth},ms:500,fin:function() {
			divs[3].style.display="none";
		}});

		hUtils.fx({e:divs[4],edat:null,d:{left:0},a:{left:divs[4].offsetWidth},ms:500,fin:function() {
			divs[4].style.display="none";
		}});


		/*hUtils.fx({e:divs[5],edat:null,d:{left:0},a:{left:divs[5].offsetWidth},ms:500,fin:function() {
			divs[5].style.display="none";
		}});*/

	}).fail(function(dat){
		console.log("recibimos error en controlador principal al llamar a listado respuesta dat="+dat);
		
	});
	document.getElementById("logusu").getElementsByTagName("button")[0].addEventListener("click", comprobar_cambios,false);
}
function addcambio(n){
	haycambios+=n;
}
function setcambio(n){
	haycambios=n;
}
function getcambio() {
	return haycambios;
}
/*window.onload=function() {
	if(typeof JSON!=='object'){
		console.log("cargamos json");
		hUtils.cargarScript("js/json2-min.js",inicio);
	}else
		inicio();
}*/
window.onbeforeunload=function() {
	if (haycambios>0){
		controladorTienda.act_des_web(0,null);
		return "Un momento. Estamos enviando las últimas modificaciones realizadas.Presiona el botón (Logout) para salir.";
	}else if (controladorTienda.webactiva()==1){
		return "No hay cambios y la Web pública está DESACTIVADA.";
	}
	//if (document.getElementById("logusu").getElementsByTagName("span")[1].getElementsByTagName("button")[0].innerHTML=="Activar"){
	//	return "No hay cambios y la Web pública está DESACTIVADA. ¿Estas seguro?";
	//}
}
return {objImagen:null,addcambio:addcambio,setcambio:setcambio,getcambio:getcambio,inicio:inicio,salir:salir,menuImagenes:menuImagenes};
})();
function hUtilsdomReady(){
	controladorPrincipal.inicio();
}