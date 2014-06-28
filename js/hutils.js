var hUtils=(function(ut) {
	 "use strict";
	if (!Event.prototype.preventDefault) {
	    Event.prototype.preventDefault=function() {
	      this.returnValue=false;
	    };
	}
  	if (!Event.prototype.stopPropagation) {
	    Event.prototype.stopPropagation=function() {
	      this.cancelBubble=true;
	    };
  	}
  	if (!Element.prototype.addEventListener) {
    	var eventListeners=[];
    	/*, useCapture (will be ignored) */
    	var addEventListener=function(type,listener ) {
			var self=this;
			var wrapper=function(e) {
				e.target=e.srcElement;
				e.currentTarget=self;
				if (listener.handleEvent) {
				  listener.handleEvent(e);
				} else {
				  listener.call(self,e);
				}
			};
	      	if (type=="DOMContentLoaded") {
		        var wrapper2=function(e) {
					if (document.readyState=="complete") {
						wrapper(e);
					}
		        };
	        	document.attachEvent("onreadystatechange",wrapper2);
	        	eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});
	        
	        	if (document.readyState=="complete") {
	          		var e=new Event();
	         		e.srcElement=window;
	          		wrapper2(e);
	        	}
	      	} else {
	        	this.attachEvent("on"+type,wrapper);
	        	eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
	      	}
    	};/*, useCapture (will be ignored) */
	    var removeEventListener=function(type,listener ) {
	      	var counter=0;
			while (counter<eventListeners.length) {
				var eventListener=eventListeners[counter];
				if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
					if (type=="DOMContentLoaded") {
						this.detachEvent("onreadystatechange",eventListener.wrapper);
					} else {
						this.detachEvent("on"+type,eventListener.wrapper);
					}
					break;
				}
				++counter;
			}
	    };
    	Element.prototype.addEventListener=addEventListener;
    	Element.prototype.removeEventListener=removeEventListener;
    	if (HTMLDocument) {
      		HTMLDocument.prototype.addEventListener=addEventListener;
      		HTMLDocument.prototype.removeEventListener=removeEventListener;
    	}
    	if (Window) {
     		Window.prototype.addEventListener=addEventListener;
      		Window.prototype.removeEventListener=removeEventListener;
    	}
  	}
	function Promesa(){}
	Promesa.prototype.setError=function(er){
		if (this.callbackerr) //if (this.padrepro) this.padre.setError(this.callbackerr(er));
			this.callbackerr(er);
		else
			this.error=er;
	}
	Promesa.prototype.setResult=function(re){
		/*if (this.callback)
			if (this.padrepro) this.padrepro.setResult(this.callback(re));
			else this.callback(re)
		else
			this.result=re;*/
		if (this.callback)
			this.callback(re);
		else
			this.result=re;
	}
	Promesa.prototype.then=function(cb){
		if (this.result) //if (this.padrepro) this.padrepro.setResult(cb(this.result)); else
			cb(this.result);
		else
			this.callback=cb;
		return this;
	}
	Promesa.prototype.fail=function(cb){
		if (this.error)//if (this.padrepro) this.padre.setError(cb(this.error)); else
			cb(this.error);
		else
			this.callbackerr=cb;
		return this;
	}
	if (!Function.prototype.bind) {
		Function.prototype.bind = function (oThis) {
			/*if (typeof this !== "function") {
			  // closest thing possible to the ECMAScript 5 internal IsCallable function
			  throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
			}*/

			var aArgs = Array.prototype.slice.call(arguments, 1), 
			    fToBind = this, 
			    fNOP = function () {},
			    fBound = function () {
			      return fToBind.apply(this instanceof fNOP && oThis
			                             ? this
			                             : oThis,
			                           aArgs.concat(Array.prototype.slice.call(arguments)));
			    };

			fNOP.prototype = this.prototype;
			fBound.prototype = new fNOP();

			return fBound;
		};
	}
	if (!Array.prototype.indexOf) {
	  Array.prototype.indexOf = function (searchElement) {
		  	if (this == null) {
		      throw new TypeError("Array nulo");
		    }
		    var lon=this.length;
		    for (var k=0;k<lon;k++)
		    	if (this[k]==searchElement)
		    		return k;
		    return -1;
		 }
	}
	function isIE() {
		if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) 
	 		return new Number(RegExp.$1) 
		return 10;
	}
	var animacion=isIE()>=10;
	function fxdire(ini,fin,pro,ele,p){
		if (fin<ini){
			var delta=ini-fin; 
			ele.style[pro]=(ini-(p*delta))+"px";
		}else {
			var delta=fin-ini;
			ele.style[pro]=(ini+(p*delta))+"px";
		}
	}
	function whichTransitionEvent(){
	    var t;
	    var el = document.createElement('fakeelement');
	    var transitions = {
	      'transition':'transitionend',
	      'OTransition':'oTransitionEnd',
	      'MozTransition':'transitionend',
	      'WebkitTransition':'webkitTransitionEnd'
	    }

	    for(t in transitions){
	        if( el.style[t] !== undefined ){
	            return transitions[t];
	        }
	    }
	}
	var transitionEvent = whichTransitionEvent();
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
			return senoidal((dif+.001)/this.ms); 
		} 	
	function linear(p){ 
	    var maxValue=1, minValue=.001, totalP=1, k=1; 
	    var delta = maxValue - minValue;  
	    var stepp = minValue+(Math.pow(((1 / totalP) * p), k) * delta);  
	    return stepp;  
	} 
	function senoidal(p){ return (1 - Math.cos(p * Math.PI)) / 2;}
	function  crearXMLHttpRequest() {
	    var req = null;
	     if (window.XMLHttpRequest) 
				req = new XMLHttpRequest();
		else { 
		    try {
		        req = new ActiveXObject("Msxml2.XMLHTTP");
		    } catch (e) {
		        try {
			    	req = new ActiveXObject("Microsoft.XMLHTTP");
		        } catch (E) {
			    	req = null;
		        }
		    }
		}
	    return req;
	}
	/*function alert_empezarmov(v){

		return function(e){
			if (e){
				var xx= e.pageX;
				var yy= e.pageY;
				e.preventDefault();
			}else {
				var xx= event.clientX;
				var yy= event.clientY;
				e=window.event;
			}

			if (e.target)
				e=e.target;
			else 
				e=e.srcElement;
			
			if (e.escerrar)  return; 
			v.dtop=yy-v.pos.top;
			v.dleft=xx-v.pos.left;
			
			
			v.style.transform="translate3d(0px,0px,0px)";
				v.style.webkitTransform="translate3d(0px,0px,0px)";
				v.style.MozTransform="translate3d(0px,0px,0px)";
				v.style.OTransform="translate3d(0px,0px,0px)";
				v.style.msTransform="translate3d(0px,0px,0px)";
			v.style.top=v.pos.top+"px";
			v.style.left=v.pos.left+"px";	
			v.move=true;
			document.body.onclick=null;
			document.body.onmousemove=mover(v);
			document.body.onmouseup=function(e){ this.onmousedown=this.onmousemove=this.onmouseup=null; document.body.onclick=clickbody(v); }
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
			v.style.top=v.pos.top+"px";
			v.style.left=v.pos.left+"px";
		}
	}
	function prevenir(e){
		if(!e) var e = window.event;
				//e.cancelBubble is supported by IE -
			        // this will kill the bubbling process.
				e.cancelBubble = true;
				e.returnValue = false;
			 
				//e.stopPropagation works only in Firefox.
				if ( e.stopPropagation ) e.stopPropagation();
				if ( e.preventDefault ) e.preventDefault();		
			 
			    return false;

	}
	function clickbody(ele){
		return function(e){
			if (! ele.move)
			{	document.body.removeChild(ele); document.body.onclick=null;  }
			else ele.move=false;
			prevenir(e);
		}
	}*/
	function finA(prop,clcss) { 
		return function(ev){
			prop.e.className=clcss;
			prop.fin(prop.e,prop.edat); 
			prop.e.removeEventListener(transitionEvent,finA(prop,clcss));
		}
	}
		ut.cookies={
			setItem:function(name,value,days) {
				var cookieString = name + "=" + escape(value);
				if (days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					cookieString +="; expires="+date.toGMTString();
				}
	            if (cookieString.length > 4096) {
	                    throw new Error("Cookie size exceeds 4096 byte limit");
	            }
	            document.cookie = cookieString;
			},
			getItem:function(name) {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameEQ) === 0) return unescape(c.substring(nameEQ.length,c.length));
				}
				return null;
			},
			removeItem:function(name){
				document.cookie = name + '=;expires=' + new Date(0).toUTCString();
			},
			clearAll:function() {
			    var cookies = document.cookie.split(";");
			    for (var i = 0; i < cookies.length; i++) {
			    	var cookie = cookies[i];
			    	var eqPos = cookie.indexOf("=");
			    	var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			    	this.removeItem(name);
			    }
			}
		};
		ut.his={};
			/*ponerOrigen:function(pat) {
				this.origen=pat;
			}*/
		if (window.history.state !== undefined){
			ut.his.pushState=function(st,nst,hst){
					window.history.pushState(st,nst,hst);
					document.title = nst;
					
				};
			ut.his.replaceState=function(st,nst,hst){
					window.history.replaceState(st,nst,hst);
					document.title = nst;
				};
		}else {
			ut.his.ar_state=[];
			ut.his.state=null;
			ut.his.atras=true;
			ut.his.pushState=function(st,nst,hst){
					if (this.state) this.ar_state.push(this.state);
					this.state=st;
					if (window.history.pushState) {
						window.history.pushState(st,nst,hst);
						document.title = nst;
					}
				};
			ut.his.replaceState=function(st,nst,hst){
					this.state=st;
					if (window.history.replaceState) {
						window.history.replaceState(st,nst,hst);
						document.title = nst;
					}
				};
			ut.his.back=function(){
					if (this.ar_state.length > 0)
						this.state=this.ar_state.pop();
					else
						this.state=null;
					this.atras=false;
					window.history.back();
				};
			ut.his.restar=function() {
					if (this.ar_state.length > 0 && this.atras)
						this.state=this.ar_state.pop();
					this.atras=true;
				}
		}
		
		ut.hayajax=false;
		/*ut.setLoad=function(cb){
			this.jsoncargado ? cb() : this.onload=cb;
		}*/
		ut.Fpromesa=function(fun){
			var res=fun(),pro=new Promesa();
			if (res instanceof Promesa){
				res.padrepro=pro;
			}else {
				pro.result=res;
			}
			return pro;
		};
		ut.crearElemento=function(ele,datv){
			var oe=document.createElement(ele.e);
				for (var i in ele.a)
					try { oe[i]=ele.a[i]; } catch(e) { }
				for (var i in ele.c)
					oe.style[i]=ele.c[i];
				for (var i in ele.atr)
					oe.setAttribute(i,ele.atr[i]);
				for (var i in ele.listener)
					oe.addEventListener(i,ele.listener[i],false);
			if (ele.did) datv[ele.did]=oe;
			if (ele.inner)
				oe.innerHTML=ele.inner;
			for (var i in ele.hijos)
				oe.appendChild(hUtils.crearElemento(ele.hijos[i],datv));
			return oe;
		};
		ut.mapear=function(a,f){
			var map=[];
			for (var i=0,lon=a.length;i<lon;i++)
				map.push(f(i,a[i]));
			return map;
		};
		ut.removerelemento=function(){
			this.parentNode.removeChild(this);
		};
		ut.validarHora=function( campo )  {  
			var v= /^(0[0-9]|1\d|2[0-3]):([0-5]\d)$/.test(campo);
			//console.log(campo+":");
			//console.log(v);
			return v;
		};
		ut.validarFecha=function(campo) {
			//return   /^\d{1,2}(-|\/)\d{1,2}(-|\/)\d{2,4}$/.test(campo);///^d{1,2}(-|/|.)d{1,2}1d{4}$/.test(campo);// ^\d{1,2}\/\d{1,2}\/\d{2,4}$
			if (! /^\d{1,2}(-|\/)\d{1,2}(-|\/)\d{2,4}$/.test(campo))
				return /^\d{2,4}(-|\/)\d{1,2}(-|\/)\d{1,2}$/.test(campo)
			return true;
		};
		ut.validarTel=function(campo) {
			//^\+[0-9]{1,3}\.[0-9]{4,14}(?:x.+)?$
			///^\+(?:[0-9] ?){6,14}[0-9]$/;
			return /^[0-9]{2,3}-? ?[0-9]{6,7}$/.test(campo);
		};
		ut.validarEmail=function(campo) {
			var v= /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/.test(campo);
			//console.log(campo+":");
			//console.log(v);
			return v;
			//return /[\w-\.]{3,}@([\w-]{2,}\.)*([\w-]{2,}\.)[\w-]{2,4}/.test(campo);
		};
		ut.stripHtml=function(cadena){
		    return cadena.replace(/<[^>]+>/g,'');//replace(/<([^>]+)>/g,'');
		};
		ut.htmlEntities=function(str) {
			return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
		};
		ut.unhtmlEntities=function(str){
			return String(str).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
		};
		ut.validarFloat=function(numero){
			return /^[-+]?\d+([\.\,]\d+)?$/.test(numero);
		};
		ut.validarInt=function(numero) {
		     return /^(-)?[0-9]*$/.test(numero);
		};
		ut.validarIntpos=function(numero) {
		     return /^[0-9]*$/.test(numero);
		};
		ut.trim=function(c) {
			return c.replace(/^\s+|\s+$/g,"");
		};
		ut.inputOnlyNumbers=function(evt) {
	        var k = (evt) ? evt.which : event.keyCode;
			//return (k <= 13 || (k >= 48 && k <= 57));
	        return !(k > 31 && (k < 48 || k > 57));
			//onkeypress="return onlyNumbersDano(event)" 
		};
		ut.inputOnlyFloats=function(evt) {
	        var k = (evt) ? evt.which : event.keyCode;
			var v=(k <= 13 || (k >= 48 && k <= 57));
			return v || String.fromCharCode(k)=='.' || String.fromCharCode(k)==',' || String.fromCharCode(k)=='-';
			//onkeypress="return onlyNumbersDano(event)" 
		};
		ut.type=function(obj){
			return this.trim(Object.prototype.toString.call(obj).match(/\s\w+/)[0]).toLowerCase();
		};
		ut.noltgt=function(evt) {
			var k = (evt) ? evt.which : event.keyCode;
			if (evt.shiftKey) return true; 
			if (k<=13) return true;
			var t=String.fromCharCode(k);
			if (t=='>' || t=='<') return false;
			return true;
		};
		ut.isNumber=function (n) {
		 	return !isNaN(parseFloat(n)) && isFinite(n);
		};
		ut.inputHora=function(evt) {
	        var k = (evt) ? evt.which : event.keyCode;
			if (evt.shiftKey) return true; 
	        var v=  (k <= 13 || (k >= 48 && k <= 57));
			var res= v || String.fromCharCode(k)==':';
			//console.log(res);
			return res;
			
		};
		ut.getPosicion=function(obj) { 
			var y = 0; var x = 0; var element=obj; 
			 while (element.offsetParent) {
			 	x += element.offsetLeft;
				y += element.offsetTop; element = element.offsetParent; 
			}
			return {top:y,left:x};
		};
		ut.cargarScript=function(nom,callback){
			var cabecera = document.getElementsByTagName("head")[0];
			var dscript = document.createElement('script');
			dscript.type = 'text/javascript';
			if (dscript.readyState) { //IE
		        dscript.onreadystatechange = function () {
		            if (dscript.readyState == "loaded" || dscript.readyState == "complete") {
		                dscript.onreadystatechange = null;
		                callback && callback();
		            }
		        };
		    } else { //Others
		        dscript.onload = function () {
		            callback && callback();
		        };
		    }
			dscript.src = nom;
			cabecera.appendChild(dscript);
		};
		ut.resAjax=function(ajax) {
			if(ajax.readyState==1){
						hUtils.hayajax=true;
			}else if(ajax.readyState==4){
					if(ajax.status==200){
						//console.log("recibimos respuesta en xJson="+ajax.responseText);
						try {
							var objjson=JSON.parse(ajax.responseText);
						} catch(e){
							this.setError("no se puede parsear json= "+e.message);
							return;
						}
						if (!objjson){
							this.setError(ajax.responseText);
						}else if (objjson.ok){
								this.setResult(objjson);
							}else if(objjson.error){
									this.setError(objjson.error);
								}else{
									this.setError(ajax.responseText);
								}
						
					}else if(ajax.status==404){
						this.setError("La página no existe.");
					}else{
						this.setError("Error:"+ajax.status+" "+ajax.statusText); 
					}
					hUtils.hayajax=false;
					ajax=null;
			}
		};
		ut.xJson=function(obj){
			var promesa=new Promesa();
			if (!obj.url){
				promesa.setError("No has indicado una url.");
				return promesa;
			} 
			/*if (this.hayajax){
				//ox.funerr("Ajax activo.");
				promesa.setError("Ajax todavía está siendo utilizado.");
				return promesa;
			}*/
			var ox={
				//url:obj.url,
				//funok:obj.onok || console.log,
				//funerr:obj.onerror || console.log,
				accion:obj.accion || "POST",
				body:obj.datos ? obj.datos : null
			}
			var ajax=crearXMLHttpRequest();
			if (ajax==null){
				promesa.setError("No se puede crear objeto ajax.");
				return promesa;
			}
			ajax.open(ox.accion,obj.url,true);
			if (obj.formu)
				ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			if (this.csrf_token) ajax.setRequestHeader("X-CSRFToken",this.csrf_token);
			//else
			//	ajax.setRequestHeader("Content-type", "multipart/form-data");
	  		//ajax.setRequestHeader("Content-length", body.length);
	  		//ajax.setRequestHeader("Connection", "close");
	  		ajax.onreadystatechange=hUtils.resAjax.bind(promesa,ajax);
			ajax.send(ox.body);
			return promesa;
		};
		ut.fx=function(prop) {
			if (!animacion){
				var t=new transicion(prop.ms,function(p){
						for (var pr in prop.d)
							fxdire(prop.d[pr],prop.a[pr],pr,prop.e,p);
						if (p===1 && prop.fin )
							prop.fin(prop.e,prop.edat);
					});
				t.init(); 
				t=null;
			}else {
				var x1="0",y1="0",x="0",y="0";
				//var tra="translate3d(";
				for (var pr in prop.d){

					if (pr=="top"){
						y=prop.a[pr]+"px";
						y1=prop.d[pr]+"px";
					}else  if (pr=="left"){
						x=prop.a[pr]+"px";
						x1=prop.d[pr]+"px";
					}
				}
				
				var clcss=prop.e.className;
				var tra="translate3d("+x1+","+y1+",0)";
						prop.e.style.transform=tra;
						prop.e.style.webkitTransform=tra;
						prop.e.style.MozTransform=tra;
						prop.e.style.OTransform=tra;
						prop.e.style.msTransform=tra;

				window.setTimeout(function() { 
				 tra="translate3d("+x+","+y+",0)";
					//console.log("tra="+tra);
					prop.e.className+=" transicion";
					prop.e.style.transform=tra;
					prop.e.style.webkitTransform=tra;
					prop.e.style.MozTransform=tra;
					prop.e.style.OTransform=tra;
					prop.e.style.msTransform=tra;
				},25);
				

				//for (var pr in prop.d)
				//	prop.e.style[pr]=prop.a[pr]+"px";
				
				if (prop.fin){
					//if (transitionEvent)
					//  prop.e.addEventListener(transitionEvent,finA(prop,clcss));	
					//else
						window.setTimeout(function() { prop.e.className=clcss;
						//console.log(" className="+prop.e.className);
						
						prop.fin(prop.e,prop.edat); },prop.ms); //prop.ms
				}
			}
		};
		/*ut.removerAlertMen=function(cb) {
			return function() {
			 this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);  
			 document.body.onclick=null;  
			 if (cb) cb();
			}
		};*/
		/*ut.alertMensaje=function(tit,inte,cb){
			var datos={};
			var conte=hUtils.crearElemento({e:"div",a:{className:"alert-men"}, hijos:[ 
				{e:"div",did:"cabecera",a:{className:"cabecera"},inner:tit,hijos:[{e:"a",a:{className:"cerrar"},did:"cerrar",inner:"x"}]},{e:"div",did:"contenido",inner:inte}]},datos);
			datos.cerrar.escerrar=true;
			datos.cerrar.onclick=hUtils.removerAlertMen(cb);
				//function(e) {  this.parentNode.parentNode.parentNode.removeChild(this.parentNode.parentNode);  document.body.onclick=null;  if (cb) cb(); }
			document.body.appendChild(conte);
			var izq=((document.body.offsetWidth-conte.offsetWidth)/2);
			conte.style.left=izq+"px";
			conte.style.top=-conte.offsetHeight+"px";
			var has=0;
			if (conte.offsetHeight<document.body.offsetHeight)
				has=(document.body.offsetHeight-conte.offsetHeight)/2;
			conte.cabecera=datos.cabecera;
			datos.cabecera.onmousedown=alert_empezarmov(conte);
			conte.pos={
						top:has,
						left:izq
					};
			hUtils.fx({e:conte,edat:null,d:{top:-conte.offsetHeight},a:{top:has},ms:500,fin:function() {
				document.body.onclick=clickbody(conte);
			}});
			
		}*/
		/*ut.removerMensaje=function() {
			document.body.removeChild(this.parentNode);
		};
		ut.mensaje=function(obj,tex){
			var pos=this.getPosicion(obj);
			if ((document.body.offsetWidth-pos.left)<300)
				pos.left=(document.body.offsetWidth-300)+"px";
			var d=this.crearElemento({e:"div",a:{className:"mensaje"},c:{top:pos.top+"px",left:pos.left+"px"},inner:tex,
				hijos:[{e:"a",a:{className:"cerrar",onclick:hUtils.removerMensaje}}]},null);
			document.body.appendChild(d);
			d.style.top=(pos.top-d.offsetHeight)+"px";
			d.style.visibility="visible";
			if (window.pageYOffset>pos.top){
				var t=pos.top-30;
				if(t<0)
					t=0;
				window.scrollTo(0,t);
			}
			obj.focus();
			
			if (! obj.onchange){
				console.log("pongo onchange en ",obj);
				obj.onchange=this.eliminarmensajes;
				obj.error=d;
			}
				
		};
		ut.eliminarmensajes=function() {
			document.body.removeChild(this.error);
			this.error=null;
			this.onchange=null;
		};*/
		if (window.sessionStorage) 
			ut.storage=window.sessionStorage;
		else {
			ut.storage=ut.cookies;
		}
		
		
	/*if(typeof window.JSON!=='object'){
		ut.cargarScript("js/json2-min.js",function() {  ut.onload ? ut.onload() : ut.jsoncargado=true; });
	}else{  ut.onload ? ut.onload() : ut.jsoncargado=true; }*/
	if(typeof window.JSON!=='object' || !window.atob || !window.btoa) {
		ut.cargarScript("js/json2-min.js",function() {  if (ut.jsoncargado) hUtilsdomReady(); else ut.jsoncargado=true;});
	}else{  ut.jsoncargado=true; }
	document.addEventListener("DOMContentLoaded",function(){
		if (ut.jsoncargado)
			hUtilsdomReady();
		else
			ut.jsoncargado=true;
	});
	return ut;
})(hUtils || {});
var ClTaste=(function() {
	var sombra=document.createElement("div"),dinte=document.createElement("div");
	sombra.className="sombra";
	dinte.className="taste";
	sombra.appendChild(dinte);
	function mTaste(men){
		dinte.innerHTML=men;
		document.body.appendChild(sombra);
		window.setTimeout(function() { dinte.className="taste taste-hidden"; },50);
		window.setTimeout(function() { document.body.removeChild(sombra); dinte.className="taste";},1500);
	}
	return mTaste;
})();
var ClAlerta=(function() {
	var sombra=document.createElement("div");
	sombra.className="sombra";
	var marco={},divmensaje;
	function subirmensa() {
		var hed=-(divmensaje.offsetHeight+78);
		//console.log("hed=",hed);
		hUtils.fx({e:divmensaje,edat:null,d:{top:58},a:{top:hed},ms:800,fin:function() {
			sombra.style.overflowY="hidden";
			document.body.removeChild(sombra);
		}});
	}
	function cancelar() {
		if (listenconfir.fun!=null)
			listenconfir.fun(listenconfir.obj,false);
		subirmensa();
	}
	function confirmar() {
		if (listenconfir.fun!=null)
			listenconfir.fun(listenconfir.obj,true);
		subirmensa();
		//document.body.removeChild(sombra);
	}
	function escucharevento(f,ob){
		listenconfir.fun=f;listenconfir.obj=ob;
	}
	function mAlert(dat){
		
		if (dat.inteobj){
			marco.conte.innerHTML="";
			marco.titulo.innerHTML=dat.tit;
			marco.conte.appendChild(dat.inteobj);
		}else{
			marco.titulo.innerHTML="<span class='icon-shocked'></span>"+dat.tit;
			marco.conte.innerHTML=dat.inte;
		}
		if (dat.f){
			listenconfir.fun=dat.f;listenconfir.obj=dat.ob;
		}else {
			listenconfir={
				fun:null,
				obj:null
			}
		}
		if (dat.osc) sombra.className="sombra som-oscura";
		else sombra.className="sombra";

		document.body.appendChild(sombra);
		var hed=-(divmensaje.offsetHeight+78);
		//console.log("hed="+hed+", divmensaje.offsetHeight="+divmensaje.offsetHeight+", divmensaje=",divmensaje);
		hUtils.fx({e:divmensaje,edat:null,d:{top:hed},a:{top:58},ms:800,fin:function() {
			if (divmensaje.offsetHeight>document.body.offsetHeight)
				sombra.style.overflowY="scroll";
		}});
		
		
	}
	var listenconfir={
		fun:null,
		obj:null
	}
	
	sombra.appendChild(divmensaje=hUtils.crearElemento({e:"div",a:{className:"alert-men"}, hijos:[ 
			{e:"div",a:{className:"cabecera-alert"},hijos:[{e:"label",did:"titulo"},{e:"a",a:{className:"cerrar"},listener:{click:cancelar},inner:"<span class='icon-cancel'></span>"}]},{e:"div",a:{className:'conte-alert'},did:"conte"},{e:"div",a:{className:"pie-alert"},hijos:[{e:"button",a:{className:"btn btn-info"},listener:{click:cancelar}, inner:"<span class='icon-cancel'></span> Cancelar"} , {e:"button",a:{className:"btn btn-info"},listener:{click:confirmar}, inner:"<span class='icon-checkmark-2'></span> Confirmar"}]}]},marco));
	return {
		marcar:mAlert,
		addevento:escucharevento,
		cerrar:cancelar
	}

})();