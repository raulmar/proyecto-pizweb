window.appIni=(function(){
	var menu,logh2,url="",errorformu=null,btn_soc_google;
	function getid(str){
		return document.getElementById(str);
	}
	
	function cerrarerror() {
		if (errorformu){
			errorformu.parentNode.removeChild(errorformu);
			errorformu=null;
		}
	}
	function seterr(ele,str){
		cerrarerror();
		errorformu=hUtils.crearElemento({e:"div",a:{className:"errorlog"},hijos:[{e:"a",a:{className:"cerrar",onclick:cerrarerror},hijos:[{e:"span",a:{className:"icon-cancel"}}]},{e:"span",inner:str}]});
		ele.parentNode.insertBefore(errorformu,ele);
		//de.innerHTML=str;
		//de.style.display="block";
	}
	function prev(e){
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		e.stopPropagation();
		//var err=this.parentNode.getElementsByTagName("div")[0];
		//err.style.display="none";
		return {ca:hUtils.mapear(this.getElementsByTagName("input"),function(i,v){ v.value=hUtils.stripHtml(v.value); return v; }),bot:this.parentNode.getElementsByTagName("button")[0]}; //.getElementsByTagName("button")[0] };
	}
	/*function clogout(e){
		console.log("hay que implementar");
		hUtils.xJson({accion:"GET",url:url+"logout",formu:false}).then(function(dat){
			var lo=document.getElementById("nomtienda");
			lo.innerHTML=""; //<span class='icon-user'></span> anonimo";
			hUtils.cookies.clearAll(); //removeItem("session");
			//window.location.href=url
		}).fail(function(er){
			console.log("se recibio error al hacer logout =",er);
		});
	}*/
	function clogin(e){
		var inps=prev.call(this,e);
		console.log("inputs=",inps);
		if (!hUtils.validarEmail(inps.ca[0].value)) {
			seterr(this, "Debes de introducir un email válido!");
			return;
		}
		if (inps.ca[1].value.length<6 ){
			seterr(this, "La contraseña debe de tener de 6 a 15 caracteres!");
			return;
		}
		inps.bot.disabled=true;
		var _this=this;
		hUtils.xJson({url:url+"login",datos:window.JSON.stringify({em:inps.ca[0].value,con:inps.ca[1].value}),formu:true}).then(function(dat){
			window.location.href=url+"pedido";
			//var lo=document.getElementById("nomtienda");
			//lo.innerHTML="<span class='icon-user'></span> %s <a href='"+url+"logout' > LOGOUT</a>"
			//lo.innerHTML="<span class='icon-user'></span> "+inps.ca[0].value;
			//lo.appendChild(hUtils.crearElemento({e:"a",listener:{click:clogout}, inner:" LOGOUT <span class='icon-exit'></span>"}));
			//inps.ca[1]=inps.ca[0].value="";
			//inps.bot.disabled=false;
		}).fail(function(er){
			console.log("se recibio error al hacer login =",er);
			seterr(_this,er);
			inps.bot.disabled=false;
		});
		console.log("comprobamos login");
	}
	function colvi(e){
		var inps=prev.call(this,e);
		console.log("comprobamos olvidado");
		if (!hUtils.validarEmail(inps.ca[0].value)) {
			seterr(this,"Debes de introducir un email válido!");
			return;
		}
		inps.bot.disabled=true;
		var _this=this;
		hUtils.xJson({url:url+"forgot",datos:window.JSON.stringify({em:inps.ca[0].value}),formu:true}).then(function(dat){
			seterr(_this,dat.ok );
			inps.bot.disabled=false;
		}).fail(function(er){
			console.log("recibimos error al hacer colvi="+er);
			seterr(_this,er);
			inps.bot.disabled=false;
		});
		console.log("comprobamos colvi");
	}
	function ccrear(e){
		var inps=prev.call(this,e);
		console.log("inputs=",inps);
		if (!hUtils.validarEmail(inps.ca[0].value)) {
			seterr(this, "Debes de introducir un email válido!");
			return;
		}
		if (inps.ca[1].value.length<6 || inps.ca[1].value!=inps.ca[2].value){
			seterr(this, "La contraseña debe de tener de 6 a 15 caracteres y deben de coincidir la contraseña y la repetición.!");
			return;
		}
		inps.bot.disabled=true;
		var _this=this;
		hUtils.xJson({url:url+"signup",datos:window.JSON.stringify({em:inps.ca[0].value,c1:inps.ca[1].value,c2:inps.ca[2].value}),formu:true}).then(function(dat){
			if (dat.ok=="_olvido_"){
				if (errorformu)
					errorformu.parentNode.removeChild(errorformu);
				errorformu=hUtils.crearElemento({e:"div",a:{className:"errorlog"},hijos:[{e:"a",a:{className:"cerrar",onclick:cerrarerror},hijos:[{e:"span",a:{className:"icon-cancel"}}]},{e:"span",inner:"email "+dat.resto+" ya existe",hijos:[{e:"a",a:{className:"butlog"},inner:"¿olvidó su contraseña?",listener:{click:verolvi}}] }]},null);
				_this.parentNode.insertBefore(errorformu,_this);

			}else {
				//document.getElementById("nomtienda").innerHTML="Log in as "+inps.ca[0];
				seterr(_this,dat.ok );
			}
			inps.bot.disabled=false;
		}).fail(function(er){
			console.log("se recibio error al crear cuenda =",er);
			seterr(_this,er);
			inps.bot.disabled=false;
		});
		
	}
	function inicio() {
		if (window.server.tienda.length<2){
			console.log("principio tienda no hay="+window.server.tienda);
			return;
		}

		url= "/tienda/"+window.server.tienda+"/";
		//var lo=getid("nomtienda").getElementsByTagName("a");
		//if (lo.length>0)
		//	lo[0].addEventListener("click",clogout,false);
		menu=document.getElementById("menuprin");
		if (document.body.offsetWidth<=500){
			menu.className="menu-prin menupeq";
		}
		getid("bot-menu").addEventListener("click",sacarmenu,false);
		if (window.server.hhccl!=="True") {
			getid("flogin").addEventListener("submit",clogin,false);
			getid("folvi").addEventListener("submit",colvi,false);
			getid("fcrear").addEventListener("submit",ccrear,false);
			
			var reg=getid("regis");
			logh2=reg.parentNode.getElementsByTagName("h2")[0];
			//svgm.className="svgmenu";
			//svgm.
			reg.getElementsByTagName("p")[0].getElementsByTagName("a")[0].addEventListener("click",verlogin,false);
			var bl=getid("login").getElementsByTagName("p")[0].getElementsByTagName("a");
			bl[0].addEventListener("click",verolvi,false);
			bl[1].addEventListener("click",verregis,false);
			bl=getid("olvi").getElementsByTagName("p")[1].getElementsByTagName("a");
			bl[0].addEventListener("click",verlogin,false);
			bl[1].addEventListener("click",verregis,false);
		}
		if (window.server.errorh){
			errorformu=getid("errorlog101");
			errorformu.appendChild(hUtils.crearElemento({e:"div",a:{className:"errorlog"},hijos:[{e:"a",a:{className:"cerrar",onclick:cerrarerror},hijos:[{e:"span",a:{className:"icon-cancel"}}]},{e:"span",inner:window.server.errorh }]},null));
		}
		var sdpas=document.getElementById("zona-rep").getElementsByTagName("p"),tx=document.getElementById("txciu");
		for (var i=0;i<sdpas.length;i++) {
			var xsp=document.createElement("span");
			xsp.innerHTML=sdpas[i].innerHTML+". ";
			tx.appendChild(xsp);
		}
		tx.style.marginTop="0px";
		window.onscroll=verscroll;
		animIma.init();
		btn_soc_google=getid("customBtn");
	}
	function verscroll(e){
		var top = window.pageYOffset || document.documentElement.scrollTop;
		var p=menu.className.indexOf("menufijo");
		if (top>=100){
			if (p<0)
				menu.className+=" menufijo";
		}else if (p>-1) {
				menu.className=menu.className.substr(0,p-1);
		}
		
	}
	function sacarmenu() {
		var p=menu.className.indexOf("menufijo");
		if (menu.className.indexOf("menupeq")>-1) {
			menu.className="menu-prin menular";
		}else {
			menu.className="menu-prin menupeq";
		}
		if (p>-1)
			menu.className+=" menufijo";
	}

	function verolvi() {
			//logh2.innerHTML="Recuperar contraseña";
			document.getElementById("olvi").className="login show";
			/*document.getElementById("olvi").style.display="block";
		
			document.getElementById("regis").style.display="none";
			document.getElementById("login").style.display="none";*/
			document.getElementById("regis").className="login hidden";
			document.getElementById("login").className="login hidden";
		
	}
	function verlogin() {
			logh2.innerHTML="Login";
			document.getElementById("login").className="login show";
			document.getElementById("regis").className="login hidden";
			document.getElementById("olvi").className="login hidden";
			/*document.getElementById("login").style.display="block";
		
			document.getElementById("regis").style.display="none";
			document.getElementById("olvi").style.display="none";*/
		
	}
	function verregis() {
			logh2.innerHTML="Regístrate";
			document.getElementById("regis").className="login show";
			document.getElementById("login").className="login hidden";
			document.getElementById("olvi").className="login hidden";
			/*document.getElementById("regis").style.display="block";
		
			document.getElementById("login").style.display="none";
			document.getElementById("olvi").style.display="none";*/
		
	}


	function render() {
		console.log("si entra en render");
	    gapi.signin.render("customBtn", {
	      'callback': 'signinCallback',
	      'clientid': '759649876357-qev3is789t7f4jnc242s58l9gqa29bdu.apps.googleusercontent.com',
	      'cookiepolicy': 'single_host_origin',
	      'scope':"https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email"
	    });
	}
	 function signinCallback(authResult) {
	 	console.log("si entra signin");
		if (authResult['access_token']) {
			// Autorizado correctamente
			// Oculta el botón de inicio de sesión ahora que el usuario está autorizado, por ejemplo:
			console.log("ok authResult=",authResult);
			gapi.auth.setToken(authResult); // Almacena el token recuperado.

			btn_soc_google.setAttribute('style', 'display: none');// Oculta el inicio de sesión si se ha accedido correctamente.
			getEmail();
			// document.getElementById('signinButton').setAttribute('style', 'display: none');
		} else if (authResult['error']) {
			// Se ha producido un error.
			// Posibles códigos de error:
			//   "access_denied": el usuario ha denegado el acceso a la aplicación.
			//   "immediate_failed": no se ha podido dar acceso al usuario de forma automática.
			console.log('There was an error: ' + authResult['error']); //+", "+authResult[error_description]);
		}
	}
	function getEmail(){
	    // Carga las bibliotecas oauth2 para habilitar los métodos userinfo.
	    gapi.client.load('oauth2', 'v2', function() {
	          var request = gapi.client.oauth2.userinfo.get();
	          request.execute(getEmailCallback);
	        });
	}

	function getEmailCallback(obj){
		var el = document.getElementById('email');
		console.log("usuario=", obj);
		if (obj['email']) {
			getid("nomtienda").innerHTML="<a href='"+ obj["link"]+"' target='blank'><img src='" +obj["picture"]+"' width='40' height='40' style='vertical-align:middle;border-radius:25px;'> " + obj["name"];
			//+ "-"+ obj['email']+" </a>";
		}
		   // Sin comentario para inspeccionar el objeto completo.
	}
	/*(function() {
	    var po = document.createElement('script');
	    po.type = 'text/javascript'; po.async = true;
	    po.src = 'https://apis.google.com/js/client:plusone.js?onload=render';
	    var s = document.getElementsByTagName('script')[0];
	    s.parentNode.insertBefore(po, s);
	 })();*/
	return { init:inicio,signinCallback:signinCallback,render:render };
	//return {inicio:inicio};
})();
function hUtilsdomReady() {
	window.appIni.init();
}
function signinCallback(authResult) {
	appIni.signinCallback(authResult);
}
function render() {
	appIni.render();
}
var animIma=(function() {
	var getTransformProperty = function(node) {
	    var properties = [
	        'transform',
	        'webkitTransform',
	        'msTransform',
	        'MozTransform',
	        'OTransform'
	    ];
	    var prop2=[
	    	'transition',
	        'webkitTransition',
	        'msTransition',
	        'MozTransition',
	        'OTransition'
	    ];
	    var p1=false,p2=false;
	    for  (i=0;i<5;i++) {
	        if (typeof node.style[properties[i]] != 'undefined') {
	            p1=properties[i];
	            break;
	        }
	    }
	    for  (i=0;i<5;i++) {
	        if (typeof node.style[prop2[i]] != 'undefined') {
	            p2=prop2[i];
	            break;
	        }
	    }
	    if (p1 && p2) return [p1,p2]
	    return null;
	};
	var trastyle;
	function fxdire(ini,fin,pro,ele,p,uni){
		if (fin<ini){
			var delta=ini-fin; 
			ele.style[pro]=(ini-(p*delta))+uni;
		}else {
			var delta=fin-ini;
			ele.style[pro]=(ini+(p*delta))+uni;
		}
	}
	function transicion(ms,callback){ 
		var _this=this;
		this.ms=ms;
		this.start=new Date().getTime(); 	
		this.init=function(){ 
			window.setTimeout(function(){
				var nx=_this.next();
				if(nx===false){ 
					callback(1); return;	
				} 
				callback(nx); 
				_this.init(); },13); 
		} 	
	}
	transicion.prototype.next=function(){
			var now=new Date().getTime(); 
			var dif=now-this.start;
			if(dif>this.ms) return false; 
			return linear((dif+.001)/this.ms); //senoidal
		} 	
	function linear(p){ 
	    var maxValue=1, minValue=.001, totalP=1, k=1; 
	    var delta = maxValue - minValue;  
	    var stepp = minValue+(Math.pow(((1 / totalP) * p), k) * delta);  
	    return stepp;  
	} 
	function senoidal(p){ return (1 - Math.cos(p * Math.PI)) / 2;}
	
	function desplazar(prop) {
		var t=new transicion(prop.ms,function(p){
				for (var pr in prop.d)
					fxdire(prop.d[pr],prop.a[pr],pr,prop.e,p,prop.uni);
				if (p===1 && prop.fin )
					prop.fin(prop.e);
			});
		t.init(); 
		t=null;
	};
	function desplazar2(prop) {
		var t=new transicion(prop.ms,function(p){
			for (var ele in prop.e){
				for (var pr in prop.e[ele].d)
					fxdire(prop.e[ele].d[pr],prop.e[ele].a[pr],pr,prop.e[ele].e,p,"px");
			}
			if (p===1 && prop.fin )
				prop.fin(prop.e);
		});
		t.init(); 
		t=null;
	};
	function inicializar() {
		this.botplay=[];
		this.imarega.style.marginTop=((this.imarega.parentNode.offsetHeight-this.imarega.offsetHeight)/2)+"px";
		this.marco=this.front;
		this.contes=[this.imarega.parentNode];
		this.siguiente=0;
		var pla=document.createElement("div");
		pla.className="playgale";
		this.front.parentNode.parentNode.appendChild(pla);
		if (_imagenes.length>0) {
			var bot=document.createElement("button");
			bot.className="selec";
			bot.nid=0;
			pla.appendChild(bot);
			this.botplay.push(bot);
			bot.onclick=this.clickselbot;
			for (var i=0;i<_imagenes.length;i++){
				var ud=document.createElement("div");
				var ima=new Image();
				var bot=document.createElement("button");
				bot.nid=i+1;
				ud.className="restoimas";
				ima.src=_imagenes[i];
				ud.appendChild(ima);
				pla.appendChild(bot);
				bot.onclick=this.clickselbot;
				this.botplay.push(bot);
				this.contes.push(ud);
			}
		}
	}
	function borrarCall(){
		var dima=this.imarega.parentNode;
		while(dima.childNodes.length>2){
			var imghi=dima.childNodes[dima.childNodes.length-1];
			dima.removeChild(imghi);
			imghi.className="";
		}
	}
var _numregas=0,
	_anyal=60,
	_imagenes=["combo.png","hamburguesa.png","pizzades.jpg"],
	_intersig=null;
var fxold={
	
	init:function() {
		this.front=document.getElementById("back");
		this.segundo=document.getElementById("front");
		this.imarega=this.segundo.getElementsByTagName("img")[0];
		this.imarega.className="";
		this.corredera=this.front.parentNode;
		this.corredera.className="flipsin";
		this.front.className="primero";
		this.segundo.className="segundo";
		this.front.appendChild(this.imarega.parentNode);
		inicializar.call(this);
		//this.front.removeChild(this.contes[0]);
		this.segundo.appendChild(this.contes[0]);
		this.corredera.style.left="-50%";
		//this.marco=false;
		this.animar();
	},
	lanzarimas:function(animarega) {
		var dima=this.imarega.parentNode,
			losaltos=[]; 
		var reho=parseInt((dima.offsetWidth/_anyal),10)+1,rever=parseInt((dima.offsetHeight/_anyal),10),mitad=(_anyal/2);
		_numregas=rever*reho;
		for (var i=0;i<rever;i++){
			var tt=(i+1)*_anyal;
			for(var n=0;n<reho;n++){
				var ll=(n+1)*_anyal;
				losaltos.push({t:tt-mitad,l:ll-mitad});
			}
		}
		var loseles=[];
		for(var i=0;i<_numregas;i++){
			var mig=this.imarega.cloneNode(true);// new Image();
			//mig.src=this.imarega.src;
			mig.style.marginTop="";
			var nuea=Math.floor(Math.random() * animarega-(animarega/4));
			if (nuea<mitad+15) nuea=Math.floor(Math.random() * _anyal )+_anyal
			mig.style.position="absolute"; 
			mig.style.height=mig.style.width="0px";
			mig.style.top=losaltos[i].t+"px";
			mig.style.left=losaltos[i].l+"px";
			dima.appendChild(mig);
			var dif=(nuea/2);
			loseles.push({e:mig, a:{width:nuea,height:nuea,left:losaltos[i].l-dif,top:losaltos[i].t-dif},d:{width:0,height:0,left:losaltos[i].l,top:losaltos[i].t}});
		}
		desplazar2({e:loseles,ms:1100,fin:function() {
			fxold.avanzar();
			window.setTimeout(function() {
				fxold.imarega.style.marginTop=((fxold.imarega.parentNode.offsetHeight-fxold.imarega.offsetHeight)/2)+"px";
				fxold.imarega.style.width="auto";
				fxold.imarega.style.height="auto";
				borrarCall.call(fxold);
			},500);
		}});
	},
	animar:function() {
		var animarega=this.imarega.offsetWidth,mt=parseInt(this.imarega.style.marginTop,10);
		desplazar({e:this.imarega,d:{width:this.imarega.offsetWidth,height:this.imarega.offsetHeight,marginTop:mt},a:{width:0,height:0,marginTop:mt+this.imarega.offsetHeight/2},ms:1000,uni:"px",fin:function(){
				fxold.lanzarimas(animarega);
		}});
	},
	clickselbot:function(e){
		if (fxold.siguiente == this.nid ) return;
		if (_intersig != null) {
			window.clearTimeout(_intersig);
			_intersig=null;
			var v=this.nid < 1 ? fxold.contes.length-1 : this.nid-1;
			fxold.avanzar(v);
		}
	},
	avanzar:function(v) {
		_intersig=null;
		//if (this.marco){
			this.front.appendChild(this.contes[this.siguiente].cloneNode(true));
			this.corredera.style.left="0";
		//}
		//this.marco=true;
		this.segundo.innerHTML="";
		this.botplay[this.siguiente].className="";
		if (v!= undefined)
			this.siguiente=v;
		this.siguiente++;
		if (this.siguiente>=this.contes.length) this.siguiente=0;
		var lim=this.contes[this.siguiente].getElementsByTagName("img")[0];
		if (lim.height < this.front.offsetHeight)
				lim.style.marginTop=((this.front.offsetHeight-lim.height)/2)+"px";
			else if (lim.width> this.front.offsetWidth){
				var alt=(this.front.offsetWidth/lim.width)*lim.height;
				if (alt <  this.front.offsetHeight)
					lim.style.marginTop=((this.front.offsetHeight-alt)/2)+"px";
			}
		this.segundo.appendChild(this.contes[this.siguiente]);//-this.corredera.offsetWidth/2
		desplazar({e:this.corredera,d:{left:0},a:{left:-50},ms:500,uni:"%",
			fin:function() { 
				fxold.front.innerHTML="";
				if (fxold.siguiente<1){
					fxold.animar();
				}else
					_intersig=window.setTimeout(function() {
						fxold.avanzar();
					},5000);
		 }});
		this.botplay[this.siguiente].className="selec";
	}
}
function getBase64FromImageUrl(URL,cb) {
    var img = new Image();
    img.src = URL;
    img.onload = function () {
	    var canvas = document.createElement("canvas");
	    canvas.width =this.width;
	    canvas.height =this.height;
	    var ctx = canvas.getContext("2d");
	    ctx.drawImage(this, 0, 0);
	    var dataURL = canvas.toDataURL("image/png");
	    cb(dataURL); // dataURL.replace(/^data:image\/(png|jpg);base64,/, ""));
    }
}
var fxnew= {
	imaregaUrl:null,
	ultimaregaalto:0,
	ultimaregaancho:0,
	init:function() {
		this.front=document.getElementById("front");
		this.back=document.getElementById("back");
		this.imarega=this.front.getElementsByTagName("img")[0];
		inicializar.call(this);
		getBase64FromImageUrl(this.imarega.src,function(u){
			fxnew.imaregaUrl=u;
			fxnew.animar();
		});
		this.back.appendChild(this.contes[1]);
		//this.animar();
		
	},
	clickselbot:function(e){
		if (fxnew.siguiente == this.nid ) return;
		if (_intersig != null) {
			window.clearTimeout(_intersig);
			_intersig=null;
			fxnew.botplay[fxnew.siguiente].className="";
			this.className="selec";
			fxnew.siguiente=this.nid < 1 ? fxnew.contes.length-1 : this.nid-1;
			fxnew.avanzar();
		}else if (this.siguiente<1)
			fxnew.siguiente=this.nid-1;
	},
	animar:function() {
		var animarega=this.imarega.offsetWidth,
			dima=this.imarega.parentNode,
			timas=[],mitad=(_anyal/2)-15;
		this.imarega.className+=" imaregacero";
		if (dima.offsetHeight != this.ultimaregaalto || dima.offsetWidth != this.ultimaregaancho){
			this.losaltos=[];
			this.ultimaregaancho=dima.offsetWidth;
			this.ultimaregaalto=dima.offsetHeight;
			var reho=parseInt((dima.offsetWidth/_anyal),10)+1,rever=parseInt((dima.offsetHeight/_anyal),10);
		
			_numregas=rever*reho;
			for (var i=0;i<rever;i++){
				var tt=i*_anyal;
				for(var n=0;n<reho;n++){
					var ll=n*_anyal;
					this.losaltos.push({t:tt-mitad,l:ll-mitad});
				}	
			}
			this.mig=[];
			for(var i=0;i<_numregas;i++){
				var n=i;
				while (n==i)
					n=Math.floor(Math.random() * _numregas);
				var aux=this.losaltos[i];
				this.losaltos[i]=this.losaltos[n];
				this.losaltos[n]=aux;
				var mig=new Image();
				mig.src=this.imaregaUrl;
				this.mig.push(mig);
			}
		}
		for(var i=0;i<_numregas;i++){
			var mig=this.mig[i];
			mig.className="imaregaresto";
			//var mig=new Image();//this.imarega.cloneNode(true);
			//mig.src=this.imaregaUrl; // this.imarega.src;
			//mig.style.marginTop="";
			var nuea=Math.floor(Math.random() * animarega-(animarega/4));
			if (nuea<mitad+15) nuea=Math.floor(Math.random() * _anyal )+_anyal; ;
			//mig.className="imaregaresto";
			mig.style.height=mig.style.width=nuea+"px";
			mig.style.top=this.losaltos[i].t+"px";
			mig.style.left=this.losaltos[i].l+"px";
			dima.appendChild(mig);
			timas.push(mig);
		}
		window.setTimeout(this.lanzarimas(this,timas),1000);
	},
	lanzarimas:function(_this,timas){
		return function() {
			var i=0,dima=_this.imarega.parentNode;
			_this.inter=window.setInterval(function() {
				timas[i].className+=" imaregauno";
				i++;
				if (i==_numregas){
					window.clearInterval(_this.inter);
					_this.inter=null;
					_this.imarega.className="transicion";
					window.setTimeout(function() {
						_this.avanzar();
						window.setTimeout(function() {
							borrarCall.call(fxnew);							
						},500);
					},2000);
					
				}
			},40);
		}
	},
	rotar:function() {
		var pa=this.front.parentNode;
		if (pa.className.indexOf("flip3Dvuelta")>-1){
			//this.marco=this.front;
			this.front.innerHTML="";
			this.front.appendChild(this.contes[this.siguiente]);
			pa.className="flip3D";
		}else{
			//this.marco=this.back;
			this.back.innerHTML="";
			this.back.appendChild(this.contes[this.siguiente]);
			pa.className+=" flip3Dvuelta";
		}
	},
	avanzar:function() {
		this.botplay[this.siguiente].className="";
		this.siguiente++;
		if (this.siguiente>=this.contes.length){
			this.siguiente=0;
			_intersig=null;
			window.setTimeout(function(){ fxnew.animar(); },500);
		}else {
			var lim=this.contes[this.siguiente].getElementsByTagName("img")[0];
			if (lim.height < this.back.offsetHeight)
					lim.style.marginTop=((this.back.offsetHeight-lim.height)/2)+"px";
				else if (lim.width> this.back.offsetWidth){
					var alt=(this.back.offsetWidth/lim.width)*lim.height;
					if (alt <  this.back.offsetHeight)
						lim.style.marginTop=((this.back.offsetHeight-alt)/2)+"px";
				}
			_intersig=window.setTimeout(function(){ fxnew.avanzar();},8000);
		}
		this.botplay[this.siguiente].className="selec";
		this.rotar();
	}	
}
var ciudadrepar={
	amos:[],
	anmo:150,
	tiempo:6000,
	increti:2000,
	inter:null,
	init:function(am,ti,ict) {
		//trastyle=getTransformProperty(document.body);
		this.carre=document.getElementById("carretera");
		this.ciudad=document.getElementById("ciudad-anima");
		if (this.inter!=null)
			window.clearInterval(this.inter);
		this.tiempo=ti || this.tiempo;
		this.anmo=am || this.anmo;
		this.increti=ict || this.increti;
	},
	fx:function(prop) {
		if (trastyle === null){
			var t=new transicion(prop.ms,function(p){
					for (var i=0;i<prop.e.length;i++)
						fxdire(prop.e[i].d,prop.e[i].a,prop.pr,prop.e[i].e,p,"px");
					if (p===1 && prop.fin )
						prop.fin(prop,prop.edat);
				});
			t.init();
			t=null;
		}else {
			var x1="0",y1="0",x=[],y=[];
			for (var i=0;i<prop.e.length;i++){
				x.push("0");
				y.push("0");
				x1="0",y1="0";
				if (prop.pr=="top"){
					y[i]=prop.e[i].a+"px";
					y1=prop.e[i].d+"px";
				}else  if (prop.pr=="left"){
					x[i]=prop.e[i].a+"px";
					x1=prop.e[i].d+"px";
				}
				var tra="translate3d("+x1+","+y1+",0)";
				prop.e[i].e.style[trastyle[0]]=tra;
				prop.e[i].e.style[trastyle[1]]=(prop.ms/1000)+"s linear";
			}
			window.setTimeout(function() { 
				for (var i=0;i<prop.e.length;i++){
				 	tra="translate3d("+x[i]+","+y[i]+",0)";
					prop.e[i].e.style[trastyle[0]]=tra;
				}
			},25);
			if (prop.fin)
				window.setTimeout(function() { 
					for (var i=0;i<prop.e.length;i++){
						prop.e[i].e.style[trastyle[1]]=null;
						prop.e[i].e.style[trastyle[0]]=null;
					}
					prop.fin(prop,prop.edat); },prop.ms+200);
		}
	},
	moto:function(tipre,ne){
		for (var i=0;i<ne;i++) {
			var ele=document.createElement("div");
			ele.className="repar "+tipre;
			var obj={
					e:ele,
					suman:true
				};
			if (tipre=="re1"){
				ele.style.left=(this.carre.offsetWidth+this.anmo)+"px";
			}else {
				obj.suman=false;
				ele.style.left="-"+(this.anmo)+"px";
			}
			this.amos.push(obj);
			this.ciudad.appendChild(ele);
		}
	},
	animar:function() {
		var _this=this;
		this.inter=window.setInterval(function() {
			var numele=_this.amos.length;
			var an=_this.carre.offsetWidth,loseles=[];
			for (var i=0;i<numele;i++){
				var mie=_this.amos[i];
				mie.dis=Math.floor((Math.random() * an-(an/5)) + (an/6));
				if (mie.suman){
					var ax=an+_this.anmo+mie.dis;
					mie.e.style.left=ax+"px";
					if (trastyle != null){
						var em=0,ter=-(ax+_this.anmo);
					}else{
						var em=ax,ter=-_this.anmo;
					}
				}else {
					var ax=_this.anmo+mie.dis;
					mie.e.style.left="-"+ax+"px";
					if (trastyle != null){
						var em=0,ter=ax+an;
					}else{
						var em=-ax,ter=an+_this.anmo;
					}
				}
				mie.d=em;mie.a=ter;
				var hh=(Math.random() * numele-1) +1;
				if (  hh>(numele/2) )
					loseles.push(mie);
			}
			//console.log("hay="+loseles.length);
			if (loseles.length<1)
				loseles.push(mie)
			_this.fx({e:loseles,edat:null,pr:"left",ms:_this.tiempo,fin:function() {
							//console.log("he terminado la animación 22.");
						}});				
		},_this.tiempo+_this.increti);
	}
}
var animsel=fxnew;
return {
	init:function() {
		trastyle=getTransformProperty(document.body);
		if (_imagenes.length > 0){
			if (trastyle === null)
				animsel=fxold;
			else
				animsel=fxnew;
			animsel.init();
		}
		ciudadrepar.init();
		ciudadrepar.moto("re1",4);
		ciudadrepar.moto("re2",4);
		ciudadrepar.animar();
	},
	parar:function() {
		if (_intersig != null) {
			window.clearTimeout(_intersig);
			_intersig=null;
		}
	}
};
})();

