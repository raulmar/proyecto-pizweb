"use strict";
var CldatDom=(function(){
	var botdonde=null,ped_min_dom=6,diftime=0,ahoraempi=0,haycambios=false,horhoy,datosart,windowserverhora,serverdate,pedido_act;
	function cambiarhoraentrega() {
		if ( misdat.divhoracam.className=="oculta"){
			misdat.spanent.className="oculta";
			misdat.divhoracam.className="visible";
		}else {
			misdat.divhoracam.className="oculta";
			misdat.spanent.className="visible";
		}
	}
	function cambiosendatos(e){
		haycambios=true;
	}
	function verHorarios(e){
		/*if ( misdat.horario.style.display=="block")
			misdat.horario.style.display="none";
		else
			misdat.horario.style.display="block";*/
		if ( misdat.horario.className.indexOf("dtien-min")>-1){
			misdat.horario.style.height="auto";
			misdat.horario.className="animacion dtien-max";

		}else{
			misdat.horario.style.height=misdat.horario.offsetHeight+"px";
			window.setTimeout( function() {misdat.horario.style.height="0px";misdat.horario.className="animacion dtien-min"; },100);
		}

	}
	function hora_min_full(hm){
		if (hm<10)
			return "0"+hm;
		return hm;
	}
	function verDatostien(e){
		if ( misdat.divtien.className.indexOf("dtien-min")>-1){
			misdat.divtien.style.height="auto";
			misdat.divtien.className="datostien animacion dtien-max";
		}else{
			misdat.divtien.style.height=misdat.divtien.offsetHeight+"px";
			//misdat.divtien.className="datostien animacion dtien-min";
			window.setTimeout( function() {misdat.divtien.style.height="0px"; misdat.divtien.className="datostien animacion dtien-min"; },100);
		}
	}
	var misdat= {
		inicio:function(miped) {
			pedido_act=miped;
			datosart=window.server.datosart;
			//windowserverhora=window.server.hora;
			var s=window.server.hhmm.split(":");
			serverdate={"a":parseInt(s[0],10),"m":parseInt(s[1],10)-1,"d":parseInt(s[2],10),"h":parseInt(s[3],10),"mi":parseInt(s[4],10)};
			windowserverhora= new Date(serverdate.a,serverdate.m,serverdate.d,serverdate.h,serverdate.mi).getTime();
			var marcodom=hUtils.crearElemento({e:"div",a:{className:"marcodom"},
				hijos:[{e:"h1",did:"tit_datos",inner:"Pedido a Domicilio"},
						{e:"div",a:{className:"dompeddon"},hijos:[{e:"div",hijos:[{e:"button",did:"idxpedrec",a:{className:"noselectdom",iddon:1},listener:{click:clickdonde},inner:"<span class='icon-tien'></span><br/><span class='icon-cancel'></span> Recoger"}]},{e:"div",hijos:[{e:"button",did:"idxpeddom",a:{className:"selectdom",iddon:2},inner:"<span class='icon-repartidor'></span><br/><span class='icon-checkmark'></span> Domicilio"}]}]},
						{e:"h4", a:{className:"vlargo"},hijos:[{e:"button", a:{className:"btn btn-info"}, inner:"<span class='icon-tien'></span> Tienda <span class='icon-info'></span>",listener:{"click":verDatostien} }]},
						{e:"div",did:"divtien", a:{className:"datostien animacion dtien-min vlargo"},hijos:[{e:"div",inner:"<p><label>Estamos en:</label><span>"+datosart.tienda.calle+", "+datosart.tienda.cdp+" "+datosart.tienda.loca+" ("+datosart.tienda.pro+")</span> <a href='javascript:void(0);'><span class='icon-mapa'></span> mapa</a></p><p><label><span class='icon-tel'></span> Teléfono:</label> <a href='tel:"+datosart.tienda.tel[0]+"'>"+datosart.tienda.tel[0]+ "</a></p>"},{e:"p",did:"hor_hoy"},{e:"div",a:{className:"animacion dtien-min"}, did:"horario"}, {e:"p",did:"lacod_pos"}] },
						{e:"h4",inner:"<span class='icon-address-book'></span> Tus Datos <span class='peque'>* Datos obligatorios</span>"},
						{e:"div",a:{className:"caja"},hijos:[{e:"div",hijos:[{e:"label",inner:"<span class='icon-tel'></span> Teléfono *:"},{e:"input",did:"idtel",a:{className:"corto",type:"tel",size:"8",maxLength:"10",pattern:"[0-9]{9,10}",placeholder:"Teléfono"},listener:{change:cambiosendatos}},{e:"div",did:"paidtel",a:{className:"oculta"},hijos:[{e:"label",inner:"Último pedido:",hijos:[{e:"span",did:"spanultped",inner:"00/00/0000"}]},{e:"select",did:"selidtel"}]}]}]},
						{e:"div", hijos:[{e:"label",inner:"Hora de Entrega (aproximada):"},
							{e:"div",c:{display:"inline-block"},hijos:[ {e:"label",did:"spanent",a:{className:"visible"},inner:datosart.tienda.ti_domicilio+" minutos"},
							{e:"div",did:"divhoracam",a:{className:"oculta"},hijos:[{e:"select",did:"idhorent"},{e:"span",inner:" :"},{e:"select",did:"idminent"} ]},{e:"button",a:{className:"btn btn-oscuro"},c:{marginLeft:"1em"},listener:{click:cambiarhoraentrega},inner:"<span class='icon-alarm'></span> Cambiar"}]}]},
						{e:"div",did:"divsolodomi",a:{className:"animacion dtien-max"} ,hijos:[
						{e:"div",a:{className:"caja"},hijos:[
						{e:"div",hijos:[{e:"label",inner:"Tipo de vía:"},{e:"select",did:"idtipovia",a:{className:"largo"},inner:"<option selected='selected' value='-1'>Seleccione un tipo de vía"}]},{e:"div",hijos:[{e:"label",inner:"Nombre de vía *:"},{e:"input",did:"idnomvia",a:{className:"largo",type:"text",maxLength:"50",placeholder:"Calle"},listener:{change:cambiosendatos}}]} ]},
						{e:"div",a:{className:"cajita"},hijos:[
							{e:"div",hijos:[{e:"label",inner:"Municipio *:"},{e:"select",did:"idmuni"}]},
							{e:"div",hijos:[{e:"label",inner:"Codígo Postal *:"},{e:"select",did:"idcodpos"}]}]},
						{e:"div",a:{className:"cajita"},hijos:[
												{e:"div",hijos:[{e:"label",inner:"Número *:"},{e:"input",did:"idnum",a:{type:"text",maxLength:"12",patter:"[0-9A-Za-zñÑ]"},listener:{change:cambiosendatos}}]},{e:"div",hijos:[{e:"label",inner:"Bloque:"},{e:"input",did:"idbloque",a:{type:"text",maxLength:"20"},listener:{change:cambiosendatos}}]}]},
						{e:"div",a:{className:"cajita"},hijos:[{e:"div",hijos:[{e:"label",inner:"Escalera:"},{e:"input",did:"idesca",a:{type:"text",maxLength:"15"},listener:{change:cambiosendatos}}]},
															{e:"div",hijos:[{e:"label",inner:"Piso *:"},{e:"input",did:"idpiso",a:{type:"text",maxLength:"3",pattern:"[0-9]{1,3}"},listener:{change:cambiosendatos}}]},{e:"br",a:{className:"clear"}}]},
						{e:"div",a:{className:"cajita"},hijos:[{e:"div",hijos:[{e:"label",inner:"Puerta:"},{e:"input",did:"idpuerta",a:{type:"text",maxLength:"3"},listener:{change:cambiosendatos}}]},{e:"br",a:{className:"clear"}}]}]},
						{e:"div",a:{className:"cajita"},hijos:[{e:"label",inner:"Comentarios:"}, {e:"textarea",did:"idcomen"}]}]},this);

			botdonde=[null,this.idxpedrec,this.idxpeddom];
			this.donde=2;
			var tiposdevia=[["AC","ACCESO"],["AG","AGREGADO"],["AL","ALDEA, ALAMEDA"],["AN","ANDADOR"],["AR","AREA, ARRABAL"],["AU","AUTOPISTA"],["AV","AVENIDA"],["AY","ARROYO"],["BJ","BAJADA"],["BL","BLOQUE"],["BO","BARRIO"],["BQ","BARRANQUIL"],["BR","BARRANCO"],["CA","CAÑADA"],["CG","COLEGIO, CIGARRAL"],["CH","CHALET"],["CI","CINTURON"],["CJ","CALLEJA, CALLEJON"],["CL","CALLE"],["CM","CAMINO, CARMEN"],["CN","COLONIA"],["CO","CONCEJO, COLEGIO"],["CP","CAMPA, CAMPO"],["CR","CARRETERA, CARRERA"],["CS","CASERIO"],["CT","CUESTA, COSTANILLA"],["CU","CONJUNTO"],["CY","CALEYA"],["CZ","CALLIZO"],["DE","DETRÁS"],["DP","DIPUTACION"],["DS","DISEMINADOS"],["ED","EDIFICIOS"],["EM","EXTRAMUROS"],["EN","ENTRADA, ENSANCHE"],["EP","ESPALDA"],["ER","EXTRARRADIO"],["ES","ESCALINATA"],["EX","EXPLANADA"],["FC","FERROCARRIL"],["FN","FINCA"],["GL","GLORIETA"],["GR","GRUPO"],["GV","GRAN VIA"],["HT","HUERTA, HUERTO"],["JR","JARDIN"],["LA","LAGO"],["LD","LADO, LADERA"],["LG","LUGAR"],["MA","MALECON"],["MC","MERCADO"],["ML","MUELLE"],["MN","MUNICIPIO"],["MS","MASIAS"],["MT","MONTE"],["MZ","MANZANA"],["PB","POBLADO"],["PC","PLACETA"],["PD","PARTIDA"],["PI","PARTICULAR"],["PJ","PASAJE, PASADIZO"],["PL","POLIGONO"],["PM","PARAMO"],["PQ","PARROQUIA, PARQUE"],["PR","PROLONGACION, CONTINUAC."],["PS","PASEO"],["PT","PUENTE"],["PU","PASADIZO"],["PZ","PLAZA"],["QT","QUINTA"],["RA","RACONADA"],["RB","RAMBLA"],["RC","RINCON, RINCONA"],["RD","RONDA"],["RM","RAMAL"],["RP","RAMPA"],["RR","RIERA"],["RU","RUA"],["SA","SALIDA"],["SC","SECTOR"],["SD","SENDA"],["SL","SOLAR"],["SN","SALON"],["SU","SUBIDA"],["TN","TERRENOS"],["TO","TORRENTE"],["TR","TRAVESIA"],["UR","URBANIZACION"],["VA","VALLE"],["VD","VIADUCTO"],["VI","VIA"],["VL","VIAL"],["VR","VERED"]];
			var lon=tiposdevia.length;
			for (var i=0;i<lon;i++){
				this.idtipovia.options[i+1]=new Option(tiposdevia[i][1]);
				//tipca[tiposdevia[i][0]]=i;
			}
			this.idtipovia.addEventListener("change",cambiosendatos);
			this.idmuni.options[0]=new Option("Población...");
			for (var i=0;i<datosart.tienda.poblas.length;i++)
				this.idmuni.options[i+1]=new Option(datosart.tienda.poblas[i]);
			this.idmuni.addEventListener("change",cambiosendatos);

			var atx="<label>Servicio a Domicilio:</label><span>",lcp=datosart.tienda.codpos.length;
			this.idcodpos.options[0]=new Option("Código postal...");
			for (var i=0;i<lcp;i++)
				this.idcodpos.options[i+1]=new Option(datosart.tienda.codpos[i]);
			
			if (lcp>1){
				atx+="Nuestra zona de reparto cubre estos códigos postales ";
				for (var i=0;i<lcp;i++)
					atx+=datosart.tienda.codpos[i]+", ";
				atx=atx.substring(0,atx.length-2);
			} else if (lcp > 0)
				atx+="Nuestra zona de reparto cubre el código postal "+datosart.tienda.codpos[0];
			lcp=datosart.tienda.poblas.length;
			if (lcp>1){
				atx+=" en los municipios de ";
				for (var i=0;i<lcp;i++)
					atx+=datosart.tienda.poblas[i]+", ";
				atx=atx.substring(0,atx.length-2);
			} else if (lcp > 0)
				atx+=" en el municipio de "+datosart.tienda.poblas[0];
			this.lacod_pos.innerHTML=atx+"</span>";

			console.log("server.hora="+windowserverhora+", serverdate=",serverdate);
			console.log(", server sin gmt="+window.server.singmt+" ahora Date=",new Date(windowserverhora));
			ahoraempi=new Date();
			diftime=ahoraempi.getTime()-windowserverhora;
			console.log("la diferencia es="+diftime);
			var hoy=new Date(), hora=new Date(windowserverhora+ (datosart.tienda.ti_domicilio >datosart.tienda.ti_recoger ? datosart.tienda.ti_domicilio*60*1000: datosart.tienda.ti_recoger*60*1000)),ho=hora.getHours(),
				diasse=["DOMINGO","LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","FESTIVOS"],fechahoy=hoy.getDate()+"/"+(hoy.getMonth()+1)+"/"+hoy.getFullYear();
			horhoy=datosart.tienda.hrs[fechahoy];
			if (!horhoy){
				fechahoy=diasse[hoy.getDay()];
				horhoy=datosart.tienda.hrs[fechahoy];
			}
			atx="";
			if (horhoy){
				if (horhoy.tipo==2){
					atx+="<label>Hoy "+fechahoy+"</label><span> estamos Cerrado</span>";
				}else if (horhoy.tipo==1){
					atx+="<label>Hoy "+fechahoy+":</label><span> de "+horhoy.dmd+" a "+horhoy.dmh+" y de "+horhoy.dtd+" a "+horhoy.dth+"</span>";
					var ddd=horhoy.dmd.split(":");
					horhoy.dmd=[parseInt(ddd[0],10),parseInt(ddd[1],10)];
					ddd=horhoy.dmh.split(":"); horhoy.dmh= [parseInt(ddd[0],10),parseInt(ddd[1],10)];
					ddd=horhoy.dtd.split(":"); horhoy.dtd= [parseInt(ddd[0],10),parseInt(ddd[1],10)];
					ddd=horhoy.dth.split(":"); horhoy.dth= [parseInt(ddd[0],10),parseInt(ddd[1],10)];
				}else if (horhoy.tipo==0){
					atx+="<label>Hoy "+fechahoy+"</label><span> de "+horhoy.dmd+" a "+horhoy.dmh+"</span>";
					var ddd=horhoy.dmd.split(":");
					horhoy.dmd=[parseInt(ddd[0],10),parseInt(ddd[1],10)];
					ddd=horhoy.dmh.split(":"); horhoy.dmh= [parseInt(ddd[0],10),parseInt(ddd[1],10)];
				}

			}else {
				horhoy={tipo:2};
				console.log("no hay horhoy fechahoy="+fechahoy);
			}

			this.hor_hoy.innerHTML=atx+" ";
			atx=hUtils.crearElemento({e:"a",a:{href:"javascript:void(0);"},listener:{click:verHorarios},inner:" horarios &raquo;"});
			this.hor_hoy.appendChild(atx);
			atx=[];
			var ii,nn=8,atx2="";
			for (var i in datosart.tienda.hrs){
				
				if (i != fechahoy){
				 	ii=diasse.indexOf(i);
					if (ii>0)
						ii--;
					else
						ii=nn++;
					var hor2=datosart.tienda.hrs[i];
					if (hor2.tipo==2)
						atx[ii]="<p><label>"+i+":</label><span> Cerrado</span></p>";
					else if (hor2.tipo==1){
						atx[ii]="<p><label>"+i+":</label><span> de "+hor2.dmd+" a "+hor2.dmh+" y de "+hor2.dtd+" a "+hor2.dth+"</span></p>";
					}else if (hor2.tipo==0){
						atx[ii]="<p><label>"+i+":</label><span> de "+hor2.dmd+" a "+hor2.dmh+"</span></p>";
					}
				}
			}
			for (var i=0;i<atx.length;i++)
				if (atx[i])
					atx2+=atx[i];
			this.horario.innerHTML=atx2;
			//this.horario.style.display="none";
			if (horhoy.tipo<2){
				var ponerhoras=function() {
					for (var i=ho,n=0;i<24;i++){
						var ok=false;
						if (horhoy.tipo<1){
							ok= (i<horhoy.dmh[0] && i>=horhoy.dmd[0]);
						}else if (horhoy.tipo<2){
							ok= ((i<horhoy.dmh[0] && i>=horhoy.dmd[0]) || (i<=horhoy.dth[0] && i>=horhoy.dtd[0]) );
						}
						if (ok) misdat.idhorent.options[n++]=new Option((i<10 ? "0"+i : i));
					}
					for (var i=0,n=0;i<60;i+=5,n++){
						misdat.idminent.options[n]=new Option((i<10 ? "0"+i : i));
					}
				}
				if (ho<horhoy.dmd[0]){
					var hhh=new Date(hoy.getFullYear(),hoy.getMonth(),hoy.getDate(),horhoy.dmd[0],horhoy.dmd[1]);
					hhh=new Date(hhh.getTime()+datosart.tienda.ti_domicilio*60*1000);
					misdat.spanent.innerHTML=hhh.getHours()+":"+hhh.getMinutes();
					console.log("Es muy pronto para servir pedidos.");
					ho=horhoy.dmd[0];
					ponerhoras();
				}else if (horhoy.tipo==1){
					if (ho>horhoy.dth[0] || ( ho==horhoy.dth[0] && hora.getMinutes() >horhoy.dth[1] )){
						console.log("Ya es tarde para servir a domicilio:",ahoraempi);
					}else
						ponerhoras();
				}else if (ho>horhoy.dmh[0] || ( ho==horhoy.dmh[0] && hora.getMinutes() >horhoy.dmh[1] )){
					console.log("Ya es tarde para servir a domicilio:",ahoraempi);
				}else
					ponerhoras();
				
			}
			return marcodom;
		},
		focusel:function() {
			botdonde[this.donde].focus();
		},
		datosdom:function(){
			//if (!haycambios) return null;
			var he=new Date();
			if (haycambios)
				var datos={
					telefono:hUtils.stripHtml(this.idtel.value),
					callenom:{
						nom:hUtils.stripHtml(this.idnomvia.value),
						muni:this.idmuni.options[this.idmuni.selectedIndex].value,
						via:this.idtipovia.options[this.idtipovia.selectedIndex].text,
						num:hUtils.stripHtml(this.idnum.value),
						bloq:hUtils.stripHtml(this.idbloque.value),
						esca:hUtils.stripHtml(this.idesca.value),
						piso:hUtils.stripHtml(this.idpiso.value),
						letra:hUtils.stripHtml(this.idpuerta.value)
					},
					pedidoen:this.donde,
					tiendanom:datosart.tienda.nombre,
					horaped:windowserverhora+ (he.getTime()-ahoraempi.getTime())
				}
			else
				var datos={
					pedidoen:this.donde,
					tiendanom:datosart.tienda.nombre,
					horaped:windowserverhora+ (he.getTime()-ahoraempi.getTime())
				}
			if (this.idcomen.value.length>4)
				datos.comen=hUtils.stripHtml(this.idcomen.value);
			datos.horaent=this.dameHoraentrega(datos.horaped);
			/*if ( misdat.divhoracam.className=="visible"){
				var he=new Date();
				var haux=new Date(windowserverhora+ (he.getTime()-ahoraempi.getTime()));
				he.setHours(parseInt(this.idhorent.options[this.idhorent.selectedIndex].text));
				he.setMinutes(parseInt(this.idminent.options[this.idminent.selectedIndex].text));
				datos.horaent=he.getTime()-haux.getTime();
			}*/
			return datos;
		},
		dameHoraentrega:function(horaped) {
			var he=new Date(), //horaped=windowserverhora+ (he.getTime()-ahoraempi.getTime()),
				incre=(this.donde > 1 ? datosart.tienda.ti_domicilio*60*1000 : datosart.tienda.ti_recoger*60*1000)+5000,
				haux=new Date(horaped+incre);
			if ( misdat.divhoracam.className=="visible"){
				he=new Date(horaped);
				he.setHours(parseInt(this.idhorent.options[this.idhorent.selectedIndex].text,10));
				he.setMinutes(parseInt(this.idminent.options[this.idminent.selectedIndex].text,10));
				return he.getTime();
			}else
				return haux.getTime();

		},
		comfirmarpedido:function(pre) {
			if (horhoy.tipo==2)
				return [false,"<strong>Hoy no Abrimos</strong>"];
			if (this.donde===2 && pre<datosart.tienda.prepedmindom)
				return [false,"El <strong>importe mínimo</srong> a Domicilio es de "+fontPrecio(datosart.tienda.prepedmindom)];
			this.idtel.value=hUtils.stripHtml(this.idtel.value);
			this.idnomvia.value=hUtils.stripHtml(this.idnomvia.value);
			this.idnum.value=hUtils.stripHtml(this.idnum.value);
			this.idbloque.value=hUtils.stripHtml(this.idbloque.value);
			this.idesca.value=hUtils.stripHtml(this.idesca.value);
			this.idpiso.value=hUtils.stripHtml(this.idpiso.value);
			this.idpuerta.value=hUtils.stripHtml(this.idpuerta.value);
			this.idcomen.value=hUtils.stripHtml(this.idcomen.value);
			var he=new Date();
			var datos={
				pedidoen:this.donde,
				horaped:windowserverhora+he.getTime()-ahoraempi.getTime(),
				//horaped:windowserverhora+ (he.getTime()-ahoraempi.getTime()),
				comen: this.idcomen.value.length>4 ? this.idcomen.value : ""
			}
			//var hpho=datos.horaped.getHours(),hpmi=datos.horaped.getMinutes();
			
			var incre=(this.donde > 1 ? datosart.tienda.ti_domicilio*60*1000 : datosart.tienda.ti_recoger*60*1000)+5000;
			var haux=new Date(datos.horaped+incre);
			//var haux=new Date(serverdate.a,serverdate.m,serverdate.d,serverdate.h,serverdate.mi);
			//haux=new Date(haux.getTime()+he.getTime()-ahoraempi.getTime()+incre);
			if ( misdat.divhoracam.className=="visible"){
				he=new Date(datos.horaped);
				he.setHours(parseInt(this.idhorent.options[this.idhorent.selectedIndex].text,10));
				he.setMinutes(parseInt(this.idminent.options[this.idminent.selectedIndex].text,10));
				console.log("horas he=",he," haux=",haux);
				if (he.getTime()<=haux.getTime()){
					var gmi=hora_min_full(haux.getMinutes()),gho=hora_min_full(haux.getHours()),gse=hora_min_full(haux.getSeconds());
					/*if (gho<10) gho="0"+gho;
					if (gmi<10) gmi="0"+gmi;
					if (gse<10) gse="0"+gse;*/
					return [false,"La hora de entrega debe ser superior a <strong>"+gho+":"+gmi+":"+gse+"</strong>"];
				}
				datos.horaent=he.getTime();
			}else
				datos.horaent=haux.getTime();
			datos.dif_hped_hent=haux.getTime() - datos.horaped;// datos.horaent-haux.getTime();

			var horaentaux=new Date(datos.horaent), hopaux=new Date(datos.horaped);
			horaentaux=hora_min_full(horaentaux.getHours())+":"+hora_min_full(horaentaux.getMinutes());
			var haux2=new Date(hopaux.getFullYear(),hopaux.getMonth(),hopaux.getDate()).getTime(),masd=horhoy.dmd[0]*60*60*1000+horhoy.dmd[1]*60*1000,mash=horhoy.dmh[0]*60*60*1000+horhoy.dmh[1]*60*1000, horhoym={d:new Date(haux2+masd+incre).getTime(),h:new Date(haux2+mash+incre).getTime()};
			if (datos.horaent<horhoym.d )
				return [false,"La tienda está cerrada para esta hora de entrega: "+horaentaux];
			if (horhoy.tipo==1){
				masd=horhoy.dtd[0]*60*60*1000+horhoy.dtd[1]*60*1000;
				mash=horhoy.dth[0]*60*60*1000+horhoy.dth[1]*60*1000;
				var horhoyt={d:new Date(haux2+masd+incre).getTime(),h:new Date(haux2+mash+incre).getTime()}
				if (datos.horaent>horhoyt.h || (datos.horaent>horhoym.h && datos.horaent<horhoyt.d )){
					return [false,"La tienda está <strong>cerrada</strong> para esta hora de entrega: "+horaentaux];
				}
			}else if (datos.horaent>horhoym.h)
					return [false,"La tienda está <strong>cerrada</strong> para esta hora de entrega: "+horaentaux];

			var val=this.idtel.value.length>8 && this.idtel.value.length<11 && hUtils.validarIntpos(this.idtel.value),err="";
			if (!val){
				err+="<strong>Nº de teléfono</strong>: "+this.idtel.value+" erróneo. Por favor introduce un teléfono válido.<br>";
			}
			
			if (this.donde>1){
				if (this.idtipovia.selectedIndex<1){
					err+="Debes seleccionar un <strong>tipo de vía</strong>.<br>";
				}
				if (this.idnomvia.value.length<3){
					err+="<strong>Nombre de vía</strong>: "+this.idnomvia.value+" errónea.Por favor introduce un nombre de vía valido.<br>";
				}
				if (this.idnum.value.length<1 || this.idnum.value.length>10 ){
					err+="Debes de introducir un <strong>número de vía</strong>.<br>";
				}
				if (this.idpiso.value.length<1 || this.idpiso.value.length>20){
					err+="<strong>Piso</strong> "+this.idpiso.value+" no válido.<br>";
				}
				if (this.idmuni.selectedIndex <1 ){
					err+="<strong>Municipio</strong>. Selecciona la población.<br>";
				}
				if (this.idcodpos.selectedIndex <1 ){
					err+="<strong>Código postal</strong>. Selecciona el código postal.<br>";
				}
			}
			if (err.length>0){
				return [false,err];
			}
			datos.telefono=parseInt(this.idtel.value,10);
			if (this.donde>1)
				datos.callenom={
						nom:this.idnomvia.value,
						muni:this.idmuni.options[this.idmuni.selectedIndex].text,
						codpos:this.idcodpos.options[this.idcodpos.selectedIndex].text,
						via:this.idtipovia.options[this.idtipovia.selectedIndex].text,
						num:this.idnum.value,
						bloq:this.idbloque.value,
						piso:this.idpiso.value,
						esca:this.idesca.value,
						letra:this.idpuerta.value
					};
			datos.importe=pre;
			return [true,datos];
		}
	}
	function clickdonde(evt){
		if (this.iddon==misdat.donde) return;
		this.removeEventListener("click",clickdonde);
		//this.onclick=null;
		botdonde[misdat.donde].className="noselectdom";
		botdonde[misdat.donde].addEventListener("click",clickdonde,false); // onclick=clickdonde;
		this.className="selectdom";
		var ho=new Date();
		if (this.iddon==1){
			this.innerHTML="<span class='icon-tien'></span><br/><span class='icon-checkmark'></span> Recoger";
			botdonde[misdat.donde].innerHTML="<span class='icon-repartidor'></span><br/><span class='icon-cancel'></span> Domicilio";
			
			if (horhoy.dmd && ho.getHours()<horhoy.dmd[0]){
				var hhh=new Date(ho.getFullYear(),ho.getMonth(),ho.getDate(),horhoy.dmd[0],horhoy.dmd[1]);
				hhh=new Date(hhh.getTime()+datosart.tienda.ti_recoger*60*1000);
				misdat.spanent.innerHTML=hhh.getHours()+":"+hhh.getMinutes();
				console.log("Es muy pronto para servir pedidos.");
			}else
				misdat.spanent.innerHTML=datosart.tienda.ti_recoger+" minutos";
			

			misdat.divsolodomi.style.height=misdat.divsolodomi.offsetHeight+"px";
			window.setTimeout( function() {misdat.divsolodomi.style.height="0px"; misdat.divsolodomi.className="animacion dtien-min"; },100);

			//misdat.divsolodomi.style.display="none";
			misdat.tit_datos.innerHTML="Pedido a Recoger";
			misdat.botdatosdom.innerHTML="<span class='icon-tien'></span> Recoger";
		}else if (this.iddon==2){
			this.innerHTML="<span class='icon-repartidor'></span><br/><span class='icon-checkmark'></span> Domicilio";
			botdonde[misdat.donde].innerHTML="<span class='icon-tien'></span><br/><span class='icon-cancel'></span> Recoger";
			if (horhoy.dmd && ho.getHours()<horhoy.dmd[0]){
				var hhh=new Date(ho.getFullYear(),ho.getMonth(),ho.getDate(),horhoy.dmd[0],horhoy.dmd[1]);
				hhh=new Date(hhh.getTime()+datosart.tienda.ti_domicilio*60*1000);
				misdat.spanent.innerHTML=hhh.getHours()+":"+hhh.getMinutes();
				console.log("Es muy pronto para servir pedidos.");
			}else
				misdat.spanent.innerHTML=datosart.tienda.ti_domicilio+" minutos";
			misdat.divsolodomi.style.height="auto";
			misdat.divsolodomi.className="animacion dtien-max";
			//misdat.divsolodomi.style.display="block";
			misdat.tit_datos.innerHTML="Pedido a Domicilio";
			misdat.botdatosdom.innerHTML="<span class='icon-repartidor'></span> Domicilio";
		}
		misdat.donde=this.iddon;
		pedido_act.comprobar_ofertas();
	}
		
	return misdat;
})();

var ClPrin=(function(){
	var divartis=[],menusartis=[{divarticulo:[]}],datosart,pizalgus; //,flesub,es_inicio=true;
	var opcsel=null,marmodsel=null,ultimo=null,mipedido=null,mardom=null; //,nvenpiz=0;
	var rutas=[],ultruta=null;
	function sacardatosdom(){
		if (opcsel==mardom) return;
		if (document.body.offsetWidth<866)
			sacarpedido();
		clickmenu2.call(rutas[0].amenu);
		//clickmenu.call(getid("menuprin").getElementsByTagName("ul")[0].getElementsByTagName("li")[0].getElementsByTagName("a")[0],"si");
		//desopcsel(mardom);
		//window.history.pushState && window.history.pushState({page:0}, "Pedido", window.location.protocol+"//"+window.location.host+"/tienda/"+datosart.tienda.nombre+"/Pedido");
		//CldatDom.focusel();
	}
	
	function modificar(articulo,tr){
		//var articulo=mipedido.articulo(this.linea);
		/*if (this.linea.articulo.oferta!=null){
			alert("Este artículo forma parte de una oferta y no se puede modificar.\nPara modificar debes de eliminar la oferta.");
			return;
		}
		var dde=[ClPizzas.modificar,ClOtr.modificar,ClOtrosx.modificar];
		dde[this.linea.articulo.tipoart](this);*/
		if (articulo.oferta!=null){
			alert("Este artículo forma parte de una oferta y no se puede modificar.\nPara modificar debes de eliminar la oferta.");
			return;
		}
		var dde=[ClPizzas.modificar,ClOtr.modificar,ClOtrosx.modificar];
		dde[articulo.tipoart](articulo,tr);
	}
	function eliminarart(articulo,tr){
		var dde=[ClPizzas.estaenmodi,null,ClOtrosx.estaenmodi]; //,articulo=mipedido.articulo(this.linea);
		/*if (opcsel==null && this.linea.articulo.tipoart!=1 && dde[this.linea.articulo.tipoart](this,marmodsel)){
			if (mipedido.eliminar(this.linea))
				ultimomar();
		}else
			mipedido.eliminar(this.linea);*/
		if (opcsel==null && articulo.tipoart!=1 && dde[articulo.tipoart](tr,marmodsel)){
			if (mipedido.eliminar(tr))
				ultimomar();
		}else
			mipedido.eliminar(tr);
		
	}
	//var cooo=0;
	function clickmenu2(e,rpl){
		if(!e) var e = window.event;
		e.cancelBubble = true;
		//e.returnValue = false;
		if ( e.stopPropagation ) e.stopPropagation();
		if ( e.preventDefault ) e.preventDefault();		
			 
		var atr=this.getAttribute("data-menu");
		if (opcsel !== null && opcsel.getAttribute("data-menu") == atr){
			return;
		}
		var hti=this.href.substring(this.href.lastIndexOf("/")+1,this.href.length);
		if (rpl || (ultruta && ultruta.indexOf("editar") > -1 )){
			console.log("hago replacestate");
			hUtils.his.replaceState({page:atr,nompage:hti},hti, this.href );
		}else{
			console.log("hago pushstate");
			hUtils.his.pushState({page:atr,nompage:hti},hti, this.href);
		}
		cambiarPagina(atr,this,this.href);
		opcsel=this;
		return false;
	}
	function cambiarPagina(atr,amenu,ru){
		if (opcsel!=null) {
			var atrsel=opcsel.getAttribute("data-menu");
			if (atrsel==atr) return;
			opcsel.parentNode.className='com-menu-noselec';
			divartis[parseInt(atrsel,10)].style.display="none";
		}
		if (marmodsel) {
			marmodsel.style.display="none";
			marmodsel=null;
		}
		amenu.parentNode.className='com-menu-selec';
		divartis[parseInt(atr,10)].style.display="block";
		getid("conarticulos").scrollTop=0;
		ultruta=ru;

	}
	function ir_a_pagina(e){
		var tra=window.location.href;
		console.log("entra en ir a pagina");
		//tra=tra.substr(tra.lastIndexOf("/")+1).toUpperCase();
		for (var i=0;i<rutas.length;i++){
			if (rutas[i].href==tra){
				var am=rutas[i].amenu;
				if (am){
					/*if (ultruta && ultruta.indexOf("editar")){
						if (i==1){
							ClPizzas.cerrareditar();
						}else{
							ClOtrosx.cerrareditar();
						}
					}*/
					cambiarPagina(am.getAttribute("data-menu"),am,tra);
					console.log("y en ir a pagina ruta=",rutas[i]);
					document.title = rutas[i].nom;
					opcsel=am;
				}else if (rutas[i].obj){
					if (rutas[i].obj=="pizzas"){
						if (ultruta && ultruta.indexOf("ingredientes") > -1){
							ClPizzas.cerraringredientes();
							console.log("y en ir a pagina cerraringredientes ruta=",rutas[i]);
							document.title = "Editar Pizzas";
						}else {
							console.log("y en ir a pagina abrir editar pizza, hago back, ruta=",rutas[i]);
							window.history.back();
							//ClPizzas.abrireditar();
							
							//document.title = rutas[i].nom;
						}

					}else {
						console.log("y en ir a pagina abrir editar otrox, hago back, ruta=",rutas[i]);
							window.history.back();
						//ClOtrosx.abrireditar(null,rutas[i].nobj);
						//document.title=rutas[i].nom;
					}
					ultruta=tra;
				}
				break;
			}
		}
	}
	function opcselec(op){
		opcsel=op;
	}
	function desopcsel(m,obj){
		if (opcsel==null) {
			opcsel=ultimo;
			marmodsel.style.display="none";
		}
		var atrsel=opcsel.getAttribute("data-menu");
		opcsel.parentNode.className='com-menu-noselec';
		divartis[parseInt(atrsel,10)].style.display="none";
		//opcsel.addEventListener("click",clickmenu,false);
		ultimo=opcsel;
		opcsel=null;
		m.style.display="block";
		marmodsel=m;
		console.log("entra en desopcsel obj=",obj);
		if (obj){
			if (obj.obj=="pizzas"){
				hUtils.his.pushState({nompage:"Pizzas"},"Editar Pizza", "Pizzas/editar");
				ultruta="/Pizzas/editar";
			}else {
				for (var i=2;i<rutas.length;i++){
					if (rutas[i].obj && rutas[i].nobj==obj.nobj){
						hUtils.his.pushState({nompage:obj.nom},"Editar "+obj.nom, rutas[i].href);
						ultruta=rutas[i].href;
						break;
					}
				}
			}
		}
		
		//console.log("entra en opcsel");
		//whPush();
	}
	function ponerultruta(ru){
		ultruta=ru;
	}
	function ultimomar(){
		console.log("entra en ultimomar ");
		if (window.history.pushState){
			ultimo=null;
			console.log("y en ultimo mar hago back ");
			window.history.back();
			return;
		}
		if (ultimo!=null)
			clickmenu2.call(ultimo,true);
		ultimo=null;
	}
	function pintaringsaltam(pa) {

		var tabla=document.createElement("table");
		tabla.className="tablapiz vlargo";
		tabla.cellPadding="5px";
		var tbody=document.createElement("tbody");
		var the=tabla.createTHead ();
		var row = the.insertRow (0);
	    var cell = row.insertCell (0);
	    cell.align="left";
	    cell.innerHTML="<sub>Masas</sub>/<sup>Tamaños</sup>";
	    var lon=datosart.tamas.length;
	    for (var i=0;i<lon;i++){
			cell = row.insertCell(i+1);
			cell.innerHTML=datosart.tamas[i][1];
		}
		var lmt=datosart.matas.length,hay=false;
		var tr,td,ma,ta;
		for (var i=0,lon2=datosart.masas.length;i<lon2;i++){
			tr=document.createElement("tr");
			td=document.createElement("td");
			td.innerHTML="<div>"+datosart.masas[i][1]+"</div><div><sup>Base</sup><br><sub>Ing.</sub></div>";
			tr.appendChild(td);
			ma=datosart.masas[i][0];
			for (var n=0;n<lon;n++){
				ta=datosart.tamas[n][0];
				hay=false;
				td=document.createElement("td");
				for (var t=0;t<lmt;t++){
					if (datosart.matas[t][1]==ma && datosart.matas[t][2]==ta){
						hay=true; 
						
						td.innerHTML=fontPrecio(datosart.matas[t][3])+"<br>"+fontPrecio(datosart.matas[t][4]);
						break;
					}
				}
				if (!hay)
					td.innerHTML="-";
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		tabla.appendChild(tbody);
		pa.appendChild(tabla);
		var h=document.createElement("h4");
		h.className="vlargo";
		h.innerHTML="Salsas";
		pa.appendChild(h);
		lon=datosart.sal.length;
		var sp;
		var tx=datosart.sal[0][1];
		for (var i=1;i<lon;i++){
			tx+=", "+datosart.sal[i][1];
		}
		sp=document.createElement("label");
		sp.className="vlargo";
		sp.innerHTML=tx+".";
		pa.appendChild(sp);
		h=document.createElement("h4");
		h.className="vlargo";
		h.innerHTML="Ingredientes";
		pa.appendChild(h);
		lon=datosart.ingres.length;
		tx=datosart.ingres[0][1];
		for (var i=1;i<lon;i++){
			tx+=", "+datosart.ingres[i][1];
		}
		sp=document.createElement("label");
		sp.className="vlargo";
		sp.innerHTML=tx+".";
		pa.appendChild(sp);
	}
	/*function fin_animar(e){
		this.className="btn-articulo";
		this.removeEventListener("animationend",fin_animar);
	}*/
	function transicion(ms,b,pa,obj){ 
		var _this=this; this.start=new Date().getTime(),this.ms=ms; 
		//console.log("empieza scroll bini="+b.ini+", bfin="+b.fin);	
		this.init=function(){ 
			window.setTimeout(function(){
				var p=_this.next();
				if(p===false){ 
					//console.log("termina scroll ="+pa.scrollTop+", offsetTop="+obj.offsetTop);
					if (obj){
						//obj.addEventListener("animationend", fin_animar, false);
						obj.className+=" animar_first";
						window.setTimeout(function() { obj.className="btn-articulo"; },400);
					}
					return;	
				} 
				if (b.fin<b.ini){
					var delta=b.ini-b.fin;
					pa.scrollTop=(b.ini-(p*delta));
				}else {
					var delta=b.fin-b.ini;
					pa.scrollTop=(b.ini+(p*delta));
				} 
				_this.init(); },13); 
		} 	
	}
	transicion.prototype.next=function(){ 	
		var now=new Date().getTime(); 
		var dif=now-this.start;
		if(dif>this.ms) return false; 
		return senoidal((dif+.001)/this.ms); 
	}
	function senoidal(p){ return (1 - Math.cos(p * Math.PI)) / 2;}
	function sacarmenu_articulo(ev){
		var ma=menusartis[parseInt(this.getAttribute("data-men"),10)];
		if (parseInt(ma.menuarticulo.style.left,10)<-1){
			this.className="icon-indent-decrease";
			ma.menuarticulo.style.left="-1%"; ;
		}else{
			this.className="icon-indent-increase";
			ma.menuarticulo.style.left="-120%";
		}
	}
	function ir_articulo(ev){
		if (document.body.offsetWidth>1199)
			var pa=getid("conarticulos");
		else
			var pa=document.body;
		var ma=this.getAttribute("data-pos").split("-"),me=menusartis[parseInt(ma[1],10)];
		if (this.className=="tit"){
			var t=new transicion(500,{ini:pa.scrollTop,fin:hUtils.getPosicion(me.grupos[parseInt(ma[0],10)]).top-80},pa,null);
			t.init();
		}else{
			var t=new transicion(500,{ini:pa.scrollTop,fin:hUtils.getPosicion(me.divarticulo[parseInt(ma[0],10)]).top-80},pa,me.divarticulo[parseInt(ma[0],10)]);
			t.init();
			//var end=hUtils.getPosicion(me.divarticulo[parseInt(ma[0],10)]).top-80;
		}
		//var t=new transicion(500,{ini:pa.scrollTop,fin:end},pa);
		//t.init();
		me.menuarticulo.style.left="-120%";
	}

	
	function dame_menu_articulo(inner,d,p,h) {
		var unaa=document.createElement("a");
		unaa.innerHTML=inner;
		if (h){
			unaa.className="tit";
		}
		unaa.setAttribute("data-pos",d+"-"+p);
		menusartis[p].menuarticulo.appendChild(unaa);
		unaa.addEventListener("click",ir_articulo,false);
	}
	function sacar_descrip_articulo() {
		console.log("sacamos descripcion articulo");
		var sp=this.parentNode.parentNode.getElementsByTagName("span")[0];
		if (this.innerHTML=="mas"){
			sp.className="sp-abso-articulo spanver";// style.display="block";
			this.innerHTML="menos";
		}else {
			sp.className="sp-abso-articulo spannover";//.style.display="none";
			this.innerHTML="mas";
		}
	}
	function inicio() {
		
		datosart=window.server.datosart;
		var conarticulos=getid("conarticulos"),
			 lili=getid("menuprin").getElementsByTagName("ul")[0].getElementsByTagName("li"),
			 diventsel=getid("dsel001HT");
			 //menuprin=getid("menuprin"), limp=menuprin.getElementsByTagName("ul")[0],
		mipedido=new Clpedart.ClasePedido();
		mardom=CldatDom.inicio(mipedido);
		ClOtr.inicio(mipedido);
		ClOfertas.inicio(mipedido);
		Clpedart.inicio(mipedido);
		ClOtrosx.inicio(mipedido);
		ClPizzas.inicio(mipedido);
		if (window.server.sel<0){
			diventsel.parentNode.removeChild(diventsel);
			mardom.style.display="block";
		}
		conarticulos.appendChild(mardom);
		divartis.push(mardom);
		for ( var i=0;i<lili.length;i++){
			var aa= lili[i].getElementsByTagName("a")[0];
			aa.setAttribute("data-menu",i);
			var hti= aa.href.substring(aa.href.lastIndexOf("/")+1,aa.href.length);
			if (lili[i].className=="com-menu-selec"){
				opcselec(aa);
				//if (window.history.state) window.history.state={page:i};
				
				hUtils.his.replaceState && hUtils.his.replaceState({page:i,nompage:hti},hti, aa.href);
			}
			rutas.push({href:aa.href,amenu:aa,nom:hti});
			aa.addEventListener("click",clickmenu2,false);
		}
		
		
		var  im=0,mia=datosart.piz,lon=mia.length,gru="0",diaux,objaux,h,h1=hUtils.crearElemento({e:"h1",inner:"<span class='icon-pizza4'></span> Pizzas",hijos:[{e:"a",a:{className:"icon-indent-increase"},listener:{click:sacarmenu_articulo},atr:{"data-men":0}},{e:"div",did:"menuarticulo",a:{className:"menu-articulo"},c:{left:"-120%"}, hijos:[{e:"span"}]}]},menusartis[0]),diart,mgru=0,li;
		rutas.push({href:rutas[1].href+"/editar",obj:"pizzas",nom:"Editar Pizzas"});
		//rutas.push({href:rutas[1].href+"/editar/ingredientes"});
		menusartis[0].grupos=[];
		if (window.server.sel==0){
			diart=diventsel;
			var h1x=diventsel.getElementsByTagName("h1")[0];
			diventsel.insertBefore(h1,h1x);
			diventsel.removeChild(h1x);
			var ddvs=[],np=0;
			for (var y=0,yl=diventsel.childNodes.length;y<yl;y++)
				if (diventsel.childNodes[y].tagName=="DIV")
					ddvs.push(diventsel.childNodes[y]);
			
			var udb=ddvs[0].getElementsByTagName("div")[0].getElementsByTagName("button")[0];
				udb.addEventListener("click",ClPizzas.clickeven,false);
				pizalgus=udb;
			for (var i=1,lox=ddvs.length;i<lox;i++){

				var h3=ddvs[i].getElementsByTagName("h3");
				if (h3[0] && h3[0].innerHTML!=gru){
					dame_menu_articulo(h3[0].innerHTML,mgru,im,true);
					menusartis[im].grupos.push(ddvs[i]);
					mgru++;
					gru=h3[0].innerHTML;
				}
				var inddvs=ddvs[i].getElementsByTagName("div");
				for (var d=0,lon3=inddvs.length;d<lon3;d++){
					if (inddvs[d].className=="btn-articulo" ){
						var inte_arti=inddvs[d].getElementsByTagName("div");
						console.log("inte_arti=",inte_arti);
						for (var te=0,lon4=inte_arti.length;te<lon4;te++) {
							if( inte_arti[te].className=="inte-btn-articulo"){
								udb=inte_arti[te].getElementsByTagName("div");
								if (udb.length>0){
									udb[0].getElementsByTagName("button")[0].addEventListener("click",sacar_descrip_articulo,false);
								}
							}else if ( inte_arti[te].className=="btn-add-articulo") {
								li=inte_arti[te];
								udb=li.getElementsByTagName("button");
								udb[0].setAttribute("data-idpiz",np);
								udb[1].setAttribute("data-idpiz",np);
								udb[0].addEventListener("click",ClPizzas.clickadd,false);
								udb[1].addEventListener("click",ClPizzas.clickeven,false);
								dame_menu_articulo(inddvs[d].getElementsByTagName("h2")[0].innerHTML,np,im,false);
								menusartis[0].divarticulo.push(inddvs[d]);
								np++;
								
							}
						}
						
					}
				}
			}
			/*if (window.server.sel<0){
				diventsel.style.display="none";
				mardom.style.display="block";
			}*/
		}else {
			diart=document.createElement("div");
			diart.className="prearti";
			diart.appendChild(h1);
			pintaringsaltam(diart);
			diaux=document.createElement("div");
			h=document.createElement("h3");
			h.innerHTML="Haz la pizza a tu gusto";
			diaux.appendChild(h);
			objaux={};
			diaux.appendChild(hUtils.crearElemento({e:"div",a:{className:"btn-articulo"},hijos:[
						{e:"h2",inner:"AL GUSTO"},{e:"span",inner:"Elige la Masa y el tamaño y añade la Salsa y los Ingredientes que más te gusten.<br>Puedes hacerla entera o por mitades."}, 
						{e:"div",a:{className:"btn-add-articulo"},hijos:[{e:"button",did:"pialg",inner:"<span class='icon-addshop'></span> Añadir",listener:{click:ClPizzas.clickeven},atr:{"data-idpiz":"x"}}]}]},objaux));
			diart.appendChild(diaux);
			pizalgus=objaux.pialg;
			for (var i=0;i<lon;i++){
				if (mia[i][8].toUpperCase()!=gru){
						gru=mia[i][8].toUpperCase();
						diaux=document.createElement("div");
						h=document.createElement("h3");
						h.innerHTML=gru;
						diaux.appendChild(h);
						diart.appendChild(diaux);
						dame_menu_articulo(h.innerHTML,mgru,im,true);
						menusartis[im].grupos.push(diaux);
						mgru++;
				}
				objaux={};
				diaux.appendChild(li=hUtils.crearElemento({e:"div",a:{className:"btn-articulo"},hijos:[{e:"div",did:"hili",a:{className:"inte-btn-articulo"}, hijos:[ 
						{e:"h2",inner:mia[i][1]},{e:"span",did:"spcla",a:{className:"spanver"}, inner:ClPizzas.dametodo(mia[i])}]}, 
						{e:"div",a:{className:"btn-add-articulo"},hijos:[{e:"select",did:"btnsel"},{e:"button",inner:"<span class='icon-addshop'></span> Añadir",listener:{click:ClPizzas.clickadd},atr:{"data-idpiz":i}},{e:"button",inner:"<span class='icon-edit'></span> Modificar",listener:{click:ClPizzas.clickeven},atr:{"data-idpiz":i}}]}]},objaux));
				if (mia[i][9]){
					objaux.spcla.className="sp-abso-articulo spannover";
					objaux.hili.insertBefore(hUtils.crearElemento({e:"div",a:{className:"img-articulo"},hijos:[{e:"img",a:{src:mia[i][9]}},{e:"button",inner:"mas",a:{className:"mas-articulo"}, listener:{click:sacar_descrip_articulo}}]},null),objaux.spcla);
					/*var imgd=document.createElement("div");
					imgd.className="img-articulo";

					var img=new Image()
					img.src=mia[i][9];
					imgd.appendChild(img);
					var imgb=document.createElement("button");
					imgb.addEventListener("click",sacar_descrip_articulo,false);
					imgd.appendChild(imgb);
					li.insertBefore(img,objaux.spcla);*/

				}
				for (var x=0;x<5;x++)
					objaux.btnsel.options[x]=new Option(x+1);
				dame_menu_articulo(mia[i][1],i,im,false);
				menusartis[0].divarticulo.push(li);
			}
			conarticulos.appendChild(diart);
			diart.style.display="none";
		}
		divartis.push(diart);
		lon=datosart.otros.length
		for (var i=0;i<lon;i++){
			menusartis.push({divarticulo:[]});
			im++;
			var uno=datosart.unotros[datosart.otros[i][0]],lon2=uno.length;
				menusartis[im].grupos=[];
				mgru=0;
				gru="";
			h1=hUtils.crearElemento({e:"h1",inner:datosart.otros[i][1],hijos:[{e:"a",a:{className:"icon-indent-increase"},listener:{click:sacarmenu_articulo},atr:{"data-men":im}},{e:"div",did:"menuarticulo",a:{className:"menu-articulo"},c:{left:"-120%"}, hijos:[{e:"span"}]}]},menusartis[im]);
			if (window.server.sel==2 && window.server.seli==datosart.otros[i][0] ){
				diart=diventsel;
				var h1x=diventsel.getElementsByTagName("h1")[0];
				diventsel.insertBefore(h1,h1x);
				diventsel.removeChild(h1x);
				var ddvs=[],np=0;
				for (var y=0,yl=diventsel.childNodes.length;y<yl;y++)
					if (diventsel.childNodes[y].tagName=="DIV")
						ddvs.push(diventsel.childNodes[y]);
				for (var n=0,lox=ddvs.length;n<lox;n++){
					var h3=ddvs[n].getElementsByTagName("h3");
					if (h3[0] && h3[0].innerHTML!=gru){
						dame_menu_articulo(h3[0].innerHTML,mgru,im,true);
						menusartis[im].grupos.push(ddvs[n]);
						mgru++;
						gru=h3[0].innerHTML;
					}
					var inddvs=ddvs[n].getElementsByTagName("div");
					for (var d=0,lon3=inddvs.length;d<lon3;d++)
						if (inddvs[d].className=="btn-articulo" ){
							var inte_arti=inddvs[d].getElementsByTagName("div");
							//console.log("inte_arti=",inte_arti);
							for (var te=0,lon4=inte_arti.length;te<lon4;te++) {
								if( inte_arti[te].className=="inte-btn-articulo"){
									udb=inte_arti[te].getElementsByTagName("div");
									if (udb.length>0){
										udb[0].getElementsByTagName("button")[0].addEventListener("click",sacar_descrip_articulo,false);
									}
								}else if ( inte_arti[te].className=="btn-add-articulo") {
									li=inte_arti[te];
									udb=li.getElementsByTagName("button");
									udb[0].setAttribute("data-idotr",i+"-"+np);
									udb[0].addEventListener("click",ClOtr.clickeven,false);
									dame_menu_articulo(inddvs[d].getElementsByTagName("h2")[0].innerHTML,np,im,false);
									menusartis[im].divarticulo.push(inddvs[d]);
									np++;									
								}
							}
						}
				}


			}else {
				diart=document.createElement("div");
				diart.className="prearti";
				diart.appendChild(h1);
				
				for (var n=0;n<lon2;n++){
					if (uno[n][4].toUpperCase()!=gru ){
						gru=uno[n][4].toUpperCase();
						diaux=document.createElement("div");
						if (gru!="0"){
							h=document.createElement("h3");
							h.innerHTML=gru;
							diaux.appendChild(h);
						}
						diart.appendChild(diaux);
						dame_menu_articulo(gru,mgru,im,true);
						menusartis[im].grupos.push(diaux);
						mgru++;
					}
					objaux={};
					diaux.appendChild(li=hUtils.crearElemento({e:"div",a:{className:"btn-articulo"},hijos:[{e:"div",did:"hili",a:{className:"inte-btn-articulo"},hijos:[
						{e:"h2",inner:uno[n][1]},{e:"span",did:"spcla",a:{className:"spanver"},inner:uno[n][2]+"<br>"}]},
						{e:"span",inner:fontPrecio(uno[n][3])}, 
						{e:"div",a:{className:"btn-add-articulo"},hijos:[{e:"select",did:"btnsel"},{e:"button",inner:"<span class='icon-addshop'></span> Añadir",listener:{click:ClOtr.clickeven},atr:{"data-idotr":i+"-"+n} }]}]},objaux));
					if (uno[n][5]){
						objaux.spcla.className="sp-abso-articulo spannover";
						objaux.hili.insertBefore(hUtils.crearElemento({e:"div",a:{className:"img-articulo"},hijos:[{e:"img",a:{src:uno[n][5]}},{e:"button",inner:"mas",a:{className:"mas-articulo"}, listener:{click:sacar_descrip_articulo}}]},null),objaux.spcla);

						/*var img=new Image()
						img.src=uno[n][5];
						li.insertBefore(img,li.getElementsByTagName("span")[0]);*/
					}
					for (var x=0;x<5;x++)
						objaux.btnsel.options[x]=new Option(x+1);
					dame_menu_articulo(uno[n][1],n,im,false);
					menusartis[im].divarticulo.push(li);
				}
				conarticulos.appendChild(diart);
				diart.style.display="none";
			}
			divartis.push(diart);
		}

		// otroxxxxxxxxxxxxxxxxxxxx

		lon=datosart.otrosx.length
		for (var i =0;i<lon;i++){
			menusartis.push({divarticulo:[]});
			im++;
			rutas.push({href:rutas[im+1].href+"/editar",obj:"otrx",nobj:i,nom:"Editar "+datosart.otrosx[i][1]});
			h1=hUtils.crearElemento({e:"h1",inner:datosart.otrosx[i][1],hijos:[{e:"a",a:{className:"icon-indent-increase"},listener:{click:sacarmenu_articulo},atr:{"data-men":im}},{e:"div",did:"menuarticulo",a:{className:"menu-articulo"},c:{left:"-120%"}, hijos:[{e:"span"}]}]},menusartis[im]);
			if (window.server.sel==3 && window.server.seli==datosart.otrosx[i][0] ){
				diart=diventsel;
				var h1x=diventsel.getElementsByTagName("h1")[0];
				diventsel.insertBefore(h1,h1x);
				diventsel.removeChild(h1x);
				var ddvs=[],np=0;
				for (var y=0,yl=diventsel.childNodes.length;y<yl;y++)
					if (diventsel.childNodes[y].tagName=="DIV")
						ddvs.push(diventsel.childNodes[y]);
				
				var udb=ddvs[0].getElementsByTagName("div")[0].getElementsByTagName("button")[0];
				udb.setAttribute("data-idotrx",i+"-x");
				udb.addEventListener("click",ClOtrosx.clickeven,false);
				//for (var n=1,lox=ddvs.length;n<lox;n++){
					//var inddvs=ddvs[n].getElementsByTagName("div");
					for (var d=1,lon3=ddvs.length;d<lon3;d++)
						if (ddvs[d].className=="btn-articulo" ){
							var inte_arti=ddvs[d].getElementsByTagName("div");
							//console.log("inte_arti=",inte_arti);
							for (var te=0,lon4=inte_arti.length;te<lon4;te++) {
								if( inte_arti[te].className=="inte-btn-articulo"){
									udb=inte_arti[te].getElementsByTagName("div");
									if (udb.length>0){
										udb[0].getElementsByTagName("button")[0].addEventListener("click",sacar_descrip_articulo,false);
									}
								}else if ( inte_arti[te].className=="btn-add-articulo") {
									li=inte_arti[te];
									udb=li.getElementsByTagName("button");
									udb[0].setAttribute("data-idotrx",i+"-"+np);
									udb[0].addEventListener("click",ClOtrosx.clickadd,false);
									udb[1].setAttribute("data-idotrx",i+"-"+np);
									udb[1].addEventListener("click",ClOtrosx.clickeven,false);
									dame_menu_articulo(ddvs[d].getElementsByTagName("h2")[0].innerHTML,np,im,false);
									menusartis[im].divarticulo.push(ddvs[d]);
									np++;
								}
							}
						}
				//}
			}else {
				diart=document.createElement("div");
				diart.className="prearti";
				diart.appendChild(h1);
				ClOtrosx.pintar(diart,datosart.otrosx[i]);

				var uno=datosart.unotrosx[datosart.otrosx[i][0]],lon2=uno.length;
				diart.appendChild(hUtils.crearElemento({e:"div",a:{className:"btn-articulo"},hijos:[
						{e:"h2",inner:"AL GUSTO"},{e:"span",inner:ClOtrosx.algusto(datosart.otrosx[i])},
						{e:"div",a:{className:"btn-add-articulo"},hijos:[{e:"button",inner:"<span class='icon-addshop'></span> Añadir",listener:{click:ClOtrosx.clickeven},atr:{"data-idotrx":i+"-x"}}]}]},null));
				diart.appendChild(document.createElement("br"));
				for (var n=0;n<lon2;n++){
					objaux={};
					diart.appendChild(li=hUtils.crearElemento({e:"div",a:{className:"btn-articulo"},hijos:[{e:"div",did:"hili",a:{className:"inte-btn-articulo"},hijos:[
						{e:"h2",inner:uno[n][1]},{e:"span",did:"spcla",a:{className:"spanver"},inner:ClOtrosx.dametodo(datosart.otrosx[i],uno[n])+"<br>"+uno[n][2]}]},
						{e:"div",a:{className:"btn-add-articulo"},hijos:[{e:"select",did:"btnsel"},{e:"button",inner:"<span class='icon-addshop'></span> Añadir",listener:{click:ClOtrosx.clickadd},atr:{"data-idotrx":i+"-"+n}},{e:"button",inner:"<span class='icon-edit'></span> Modificar",listener:{click:ClOtrosx.clickeven},atr:{"data-idotrx":i+"-"+n}}]}]},objaux));
					if (uno[n][5]){
						objaux.spcla.className="sp-abso-articulo spannover";
						objaux.hili.insertBefore(hUtils.crearElemento({e:"div",a:{className:"img-articulo"},hijos:[{e:"img",a:{src:uno[n][5]}},{e:"button",inner:"mas",a:{className:"mas-articulo"}, listener:{click:sacar_descrip_articulo}}]},null),objaux.spcla);

						/*var img=new Image()
						img.src=uno[n][5];
						li.insertBefore(img,li.getElementsByTagName("span")[0]);*/
					}
					for (var x=0;x<5;x++)
						objaux.btnsel.options[x]=new Option(x+1);
					dame_menu_articulo(uno[n][1],n,im,false);
					menusartis[im].divarticulo.push(li);
				}
				conarticulos.appendChild(diart);
				diart.style.display="none";
			}
			divartis.push(diart);
		}
		lon=datosart.ofer.length;
		
		if (lon>0){
			menusartis.push({divarticulo:[]});
			im++;
			gru="";
			menusartis[im].grupos=[];
			mgru=0;
			h1=hUtils.crearElemento({e:"h1",inner:"<span class='icon-gift'></span> Ofertas",hijos:[{e:"a",a:{className:"icon-indent-increase"},listener:{click:sacarmenu_articulo},atr:{"data-men":im}},{e:"div",did:"menuarticulo",a:{className:"menu-articulo"},c:{left:"-120%"}, hijos:[{e:"span"}]}]},menusartis[im]);
			if (window.server.sel==1) {
				diart=diventsel;
				var h1x=diventsel.getElementsByTagName("h1")[0];
				diventsel.insertBefore(h1,h1x);
				diventsel.removeChild(h1x);
				var ddvs=[],np=0,udb;
				for (var y=0,yl=diventsel.childNodes.length;y<yl;y++)
					if (diventsel.childNodes[y].tagName=="DIV")
						ddvs.push(diventsel.childNodes[y]);
				for (var n=0,lox=ddvs.length;n<lox;n++){
					var h3=ddvs[n].getElementsByTagName("h3");
					if (h3[0] && h3[0].innerHTML!=gru){
						dame_menu_articulo(h3[0].innerHTML,mgru,im,true);
						menusartis[im].grupos.push(ddvs[n]);
						mgru++;
						gru=h3[0].innerHTML;
					}
					var inddvs=ddvs[n].getElementsByTagName("div");
					for (var d=0,lon3=inddvs.length;d<lon3;d++)
						if (inddvs[d].className=="btn-articulo" ){
							var inte_arti=inddvs[d].getElementsByTagName("div");
							//console.log("inte_arti=",inte_arti);
							for (var te=0,lon4=inte_arti.length;te<lon4;te++) {
								if( inte_arti[te].className=="inte-btn-articulo"){
									udb=inte_arti[te].getElementsByTagName("div");
									if (udb.length>0){
										udb[0].getElementsByTagName("button")[0].addEventListener("click",sacar_descrip_articulo,false);
									}
								}else if ( inte_arti[te].className=="btn-add-articulo") {
									li=inte_arti[te];
									udb=li.getElementsByTagName("button");
									udb[0].setAttribute("data-idofer",np);
									udb[0].addEventListener("click",ClOfertas.clickeven,false);
									dame_menu_articulo(inddvs[d].getElementsByTagName("h2")[0].innerHTML,np,im,false);
									menusartis[im].divarticulo.push(inddvs[d]);
									np++;
								}
							}
							
						}
				}
			}else {
				diart=document.createElement("div");
				diart.className="prearti";
				diart.appendChild(h1);
				
				for (var i=0;i<lon;i++){
					if (datosart.ofer[i][16].toUpperCase()!=gru){
						gru=datosart.ofer[i][16].toUpperCase();
						diaux=document.createElement("div");
						if (gru!="0") {
							h=document.createElement("h3");
							h.innerHTML=gru;
							diaux.appendChild(h);
						}
						diart.appendChild(diaux);
						dame_menu_articulo(gru,mgru,im,true);
						menusartis[im].grupos.push(diaux);
						mgru++;
					}
					objaux={};
					diaux.appendChild(li=hUtils.crearElemento({e:"div",a:{className:"btn-articulo"},hijos:[{e:"div",did:"hili",a:{className:"inte-btn-articulo"},hijos:[
						{e:"h2",inner:datosart.ofer[i][1]},{e:"span",did:"spcla",a:{className:"spanver"},inner:datosart.ofer[i][2]}]}, 
						{e:"div",a:{className:"btn-add-articulo"},hijos:[{e:"button",inner:"<span class='icon-addshop'></span> Añadir",listener:{click:ClOfertas.clickeven},atr:{"data-idofer":i}}]}]},objaux));
					if (datosart.ofer[i][18]){
						objaux.spcla.className="sp-abso-articulo spannover";
						objaux.hili.insertBefore(hUtils.crearElemento({e:"div",a:{className:"img-articulo"},hijos:[{e:"img",a:{src:datosart.ofer[i][18]}},{e:"button",inner:"mas",a:{className:"mas-articulo"}, listener:{click:sacar_descrip_articulo}}]},null),objaux.spcla);
						
						/*var img=new Image()
						img.src=datosart.ofer[i][18];
						li.insertBefore(img,li.getElementsByTagName("span")[0]);*/
					}
					dame_menu_articulo(datosart.ofer[i][1],i,im,false);
					menusartis[im].divarticulo.push(li);
					
				}
				conarticulos.appendChild(diart);
				diart.style.display="none";
			}
			divartis.push(diart);
		}
		conarticulos.appendChild(ClPizzas.domarcopiz());
		conarticulos.appendChild(ClOtrosx.domarcootx());

		//Clpedart.init(modificar,eliminarart,sacardatosdom,CldatDom);
		
		/*mipedido=new Clpedart.ClasePedido();
		ClOtr.inicio(mipedido);
		ClOfertas.inicio(mipedido);
		Clpedart.inicio(mipedido);
		ClOtrosx.inicio(mipedido);
		ClPizzas.inicio(mipedido);*/
		//console.log("mipedio=",mipedido);
		var aux=hUtils.crearElemento({e:"h1",inner:"<span class='icon-cart'></span> Pedido ",hijos:[{e:"button", a:{className:'btn btn-corto btn-oscuro'},listener:{click:sacardatosdom},did:"botdatosdom",inner:" Domicilio <span class='icon-repartidor'></span>"}]},CldatDom),conpedido=getid("conpedido");
		conpedido.appendChild(aux);
		conpedido.appendChild(mipedido.tabla);
		/*mardom=CldatDom.inicio();
		conarticulos.appendChild(mardom);*/
		aux=document.createElement("a");
		aux.className="subir";
		aux.innerHTML="&#9650;";
		conarticulos.appendChild(aux);
		
		var lo=getid("nomtienda").getElementsByTagName("div")[0].getElementsByTagName("button")[0];
		lo.addEventListener("click",sacarpedido,false);

		window.server.datosart=null;
		//console.log("sel="+window.server.sel+", diventsel=",diventsel);
		//if (lo.length>0)
		//	lo[0].addEventListener("click",clogout,false);
		//lo=getid("bot-menu").addEventListener("click",sacarmenu,false);
		aux.addEventListener("click",subir,false );
		//flesub=aux;
		window.addEventListener("beforeunload", mipedido.detalleStorage.bind(mipedido));
		
		mipedido.pintar_pedido_storage();
		
		//window.onbeforeunload=mipedido.detalleStorage.bind(mipedido);
		//window.onscroll=ScrollBody;
		//scr=getid("back-top");
	}
	function sacarpedido() {
		var conp=getid("conpedido");
		if (conp.className!="nooculto"){
			conp.className="nooculto"; //visible";
			getid("btnsacped").getElementsByTagName("span")[0].className="icon-indent-decrease";
		}else{
			conp.className="oculto"; //nooculto";
			getid("btnsacped").getElementsByTagName("span")[0].className="icon-indent-increase";
		}
	}
	/*function sacarmenu() {
		return;
		var conp=getid("menuprin");
		if (conp.className!="nooculto"){ //visible")
			conp.className="nooculto"; //visible";
		}else{
			conp.className="oculto"; //nooculto";
		}
	}*/
	function clogout(e){
		console.log("hay que implementar");
		hUtils.xJson({accion:"GET",url:"/tienda/"+datosart.tienda.nombre+"/logout",formu:false}).then(function(dat){
			var lo=document.getElementById("nomtienda");
			lo.innerHTML="<span class='icon-user'></span> anonimo";
			hUtils.cookies.clearAll(); // removeItem("session");
			console.log("reespuesta en logout=",dat);
		}).fail(function(er){
			console.log("se recibio error al hacer logout =",er);
		});
	}
	function iraprin() {
		if (document.body.offsetWidth>500)
			getid("conarticulos").scrollTop=0;
		else
			window.scrollTo(0,getid("menuprin").offsetHeight);
	}
	function subir(ev) {
		if (document.body.offsetWidth>1199)
			var pa=getid("conarticulos");
		else
			var pa=document.body;
		if (pa.scrollTop>200){
			var t=new transicion(500,{ini:pa.scrollTop,fin:0},pa);
			t.init(null);
		}
	}
	function bajar(){
		if (document.body.offsetWidth>500)
			getid("conarticulos").scrollTop=5000;
		else
			window.scrollTo(0,5000);
	}
	//mipedido:elpedido, function elpedido(){ return mipedido; }
	
	return {inicio:inicio,opcselec:opcselec,desopcsel:desopcsel,ultimomar:ultimomar,modificar:modificar,eliminarart:eliminarart,iraprin:iraprin,sacardatosdom:sacardatosdom,bajar:bajar,ir_a_pagina:ir_a_pagina,ponerultruta:ponerultruta}; 
})();
function getid(str){
	return document.getElementById(str);
}
function fontPrecio(da){
	var pre=parseFloat(da).toString();
	var pun=pre.indexOf(".");
	if (pun>-1){
		var dec=pre.substr(pun+1,pre.length);
		if (dec.length<2)
			dec+="0";
		var tex="<strong >"+pre.substr(0,pun)+",<span class='peque'>"+dec+"€</span></strong>";
	}else{
		var tex="<strong >"+pre+",<span class='peque'>00€</span></strong>";
	}
	return tex;
}

function dameart(arr,id){
	var lon=arr.length;
	for (var i=0;i<lon;i++)
		if (id==arr[i][0]) return i;
	return -1;
}

function hUtilsdomReady() {
	hUtils.his.ponerOrigen("tienda/"+window.server.datosart.tienda.nombre);
	console.log("hutils origen="+hUtils.his.origen);
	//var up=window.location.pathname.indexOf(window.server.datosart.tienda.nombre+"/"); // "online/");
	ClPrin.inicio();
	window.onpopstate = ClPrin.ir_a_pagina;
	/*var tro=window.location.pathname.substring(up).split("/");
	//console.log("tro=",tro);
	if (up>-1 && tro.length==3){ // window.location.pathname.length>(up+7)) {
		//console.log("sisisi");
		//return;
		//var tro=window.location.pathname.substring(up+7).split("/");
		//if (tro.length>0 && hUtils.isNumber(tro[0]) && hUtils.isNumber(tro[1]))
		//	ClPrin.ir_a_hash(parseInt(tro[0]),parseInt(tro[1]));
		ClPrin.ir_a_hash(tro[1],tro[2]);
	}*/
};
//window.onpopstate = ClPrin.ir_a_pagina;
var ventanaPago=(function() {
	var sombra=document.createElement("div"),miliseg;
	sombra.className="sombra";
	var marco={},divmensaje;
	function subirmensa() {
		var hed=-(divmensaje.offsetHeight+150);
		//console.log("hed=",hed);
		hUtils.fx({e:divmensaje,edat:null,d:{top:58},a:{top:hed},ms:650,fin:function() {
			sombra.style.overflowY="hidden";
			document.body.removeChild(sombra);
		}});
	}
	function cancelar() {
		if (listenconfir.fun!=null)
			listenconfir.fun(listenconfir.obj,false);
		subirmensa();
	}
	function mAlert(dat){
		marco.titulo.innerHTML="<span class='icon-sendshop'></span>"+dat.tit;
		if (dat.inteobj){
			marco.conte.innerHTML="";
			marco.conte.appendChild(dat.inteobj);
		}else{
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
		var hed=-(divmensaje.offsetHeight+150);
		document.body.appendChild(sombra);
		hUtils.fx({e:divmensaje,edat:null,d:{top:hed},a:{top:58},ms:650,fin:function() {
			if (divmensaje.offsetHeight>document.body.offsetHeight)
				sombra.style.overflowY="scroll";
		}});
		miliseg=new Date().getTime();
		
	}
	var listenconfir={
		fun:null,
		obj:null
	}
	
	sombra.appendChild(divmensaje=hUtils.crearElemento({e:"div",a:{className:"alert-men"}, hijos:[ 
			{e:"div",a:{className:"cabecera-alert"},hijos:[{e:"label",did:"titulo"},{e:"a",a:{className:"cerrar"},listener:{click:cancelar},inner:"<span class='icon-cancel'></span>"}]},{e:"div",a:{className:'conte-alert'},did:"conte"},{e:"div",a:{className:"pie-alert"},hijos:[{e:"button",a:{className:"btn btn-info"},listener:{click:cancelar}, inner:"<span class='icon-cancel'></span> Cancelar"}]}]},marco));
	return {
		salir:mAlert,
		cerrar:cancelar,
		tiempo:function() {
			return new Date().getTime()-miliseg;
		}
	}
})();