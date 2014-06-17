var Mapag=(function(){
  var geocoder=null,
  infowindow=null,
  mapesp=null,
  divcanvas=null,
  map=null,
  div=null,drawingManager=null,poligono=null,clickmapa=null,clickpoligono=null,drawinevent=null,menumap;
  var placeMarker=function(e) {
		var location=e.latLng;
		var marker = new google.maps.Marker({
			position: location, 
			map: map
		});
		codeLlatilongi(location);
  };
  var codeLlatilongi=function(latlng) {
  	
		geocoder.geocode({'latLng': latlng}, function(results, status) {
		  if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]) {
			  map.setZoom(16);
			  var marker = new google.maps.Marker({
				  position: latlng,
				  map: map
			  });
			  var txbot="<div><button style='font-size:0.9em;' onclick=\"controladorTienda.selec_dir_mapa({dir:'"+results[0].formatted_address+"',lat:"+results[0].geometry.location.lat()+",lon:"+results[0].geometry.location.lng()+"})\">Seleccionar</button> | <button style='font-size:0.9em;'  onclick=\"controladorTienda.cerrarInfo()\">Cerrar</button></div><div>";
			  var text=results[0].formatted_address+".<br> Latitud= "+results[0].geometry.location.lat()+",<br> Longitud= "+results[0].geometry.location.lng()+"<br></div><br>";
			  //infowindow.setContent(text+"<button class='botnor gris' style='position:absolute;font-size:0.9em;top:27px;right:0px;' onclick=\"controladorTienda.selec_dir_mapa({dir:'"+results[0].formatted_address+"',lat:"+results[0].geometry.location.lat()+",lon:"+results[0].geometry.location.lng()+"})\">Seleccionar</button>");
			  infowindow.setContent(txbot+text);
			  infowindow.open(map, marker);
			  
			  google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent("<div><button class='botnor gris' style='font-size:0.9em;' onclick=\"controladorTienda.selec_dir_mapa({dir:'"+results[0].formatted_address+"',lat:"+results[0].geometry.location.lat()+",lon:"+results[0].geometry.location.lng()+"})\">Seleccionar</button> | <button style='font-size:0.9em;'  onclick=\"controladorTienda.cerrarInfo()\">Cerrar</button></div><div>"+text);
			   // infowindow.setContent(text+"<button class='botnor gris' style='position:absolute;font-size:0.9em;top:27px;right:0px;' onclick=\"controladorTienda.selec_dir_mapa({dir:'"+results[0].formatted_address+"',lat:"+results[0].geometry.location.lat()+",lon:"+results[0].geometry.location.lng()+"})\">Seleccionar</button>");
				infowindow.open(map, marker);
			  });
			} else {
			  alert('No se ha encontrado ningún resultado.');
			}
		  } else {
			alert('Fallo en la busqueda: ' + status);
		  }
		});
  };
  var poligonoesta=function(event){
		//this.puntos=event.getPath();
		google.maps.event.removeListener(drawinevent);
		drawingManager.setOptions({	drawingMode:null});
		drawingManager.setMap(null);
		poligono=event;
		//optionsPoligon.paths=event.getPath();
			//optionsPoligon.editable=true;
			//optionsPoligon.clickable=true;
			//optionsPoligon.visible=true;
			//poligono.setOptions(optionsPoligon);
			//console.log("hola222 ");
			//poligono.setMap(map);
		//console.log("hola 3333");
		//google.maps.event.removeListener(drawinevent);
		//drawingManager.setOptions({	drawingMode:null});
		//drawingManager.setMap(null);
		
			
			menumap.ops[1].innerHTML="Borrar Zona";
			menumap.selec(0);// ops[0].click();
		
		//menumap.ops[2].style.visibility="visible";
	};
 /* var fun=null;
  var selec_dir_mapa=function(obj) {
	fun(obj);
  };*/
  var Mapag= {
	hay:false,
	//div:null,
	init:function(dm) { //,dm){
	  //this.div=
	  divcanvas=dm;
	},
	inicializar:function(dire,zrep) {
	  geocoder = new google.maps.Geocoder();
	  mapesp=new google.maps.LatLng(40.46366700000001,-3.7492200000000366);
	  var mapOptions = {
			zoom: 6,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		  };
	  map = new google.maps.Map(divcanvas, mapOptions);
		clickmapa=google.maps.event.addListener(map, 'click', placeMarker); 
	   // Try HTML5 geolocation
	   infowindow = new google.maps.InfoWindow();
	  if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		  var pos = new google.maps.LatLng(position.coords.latitude,
										   position.coords.longitude);
		   map.setCenter(pos);
		   console.log("pos=",pos);
		  codeLlatilongi(pos);
		 /* infowindow = new google.maps.InfoWindow({
			map: map,
			position: pos,
			content: 'Location found using HTML5.'
		  });*/

		 
		}, function() {
		  map.setCenter(mapesp);
		  console.log("Fallo en geolocalizació.");
		 if (dire.length>2)
			this.codeAddress(dire);
		});
	  } else {
		  map.setCenter(mapesp);
		// Browser doesn't support Geolocation
		console.log("Tu Navegador no soporta geolocalización.");
		if (dire.length>2)
			this.codeAddress(dire);
	  }
	  this.hay=true;
	  var divmenumap=document.createElement("div");
	  divmenumap.style.position="absolute";divmenumap.style.top="10px";divmenumap.style.left=((divcanvas.offsetWidth/2)-200)+"px";divmenumap.style.zIndex="8000";
	  optionsManager={
				    drawingMode: null,
				    drawingControl: false,
				    polygonOptions: {
				      fillColor: '#ffff00',
				      fillOpacity: 0.2,
				      strokeWeight: 1,
				      clickable: true,
				      editable: true,
				      zIndex: 1
				    }};
	  drawingManager = new google.maps.drawing.DrawingManager(optionsManager);
	 
		
	  if (zrep.length>0){
	  	var puntos=[];
	  	for (var p=0;p<zrep.length;p++)
	  		puntos.push(new google.maps.LatLng(zrep[p][0],zrep[p][1]));
	  	console.log("puntos=",puntos);
	  	optionsPoligon={
	  		paths:puntos,
		    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
			editable:true,
			clickable: true
		  };
	  	var opcs=["Marcar Tienda","Borrar Zona","Cerrar"];
	  	poligono = new google.maps.Polygon(optionsPoligon);
	  	poligono.setMap(map);
	  	clickpoligono=google.maps.event.addListener(poligono, 'click', placeMarker);
	  } else {
	  	optionsPoligon={
		    fillColor: '#ffff00',
			fillOpacity: 0.2,
			strokeWeight: 1,
			editable:true,
			clickable: true
		  };
		  poligono = new google.maps.Polygon(optionsPoligon);
	  		var opcs=["Marcar Tienda","Crear Zona","Cerrar"];
		 }
	  menumap=new CMenu({selec:0,opciones:opcs,callback:this.menuchange,padre:divmenumap});
	  divcanvas.appendChild(divmenumap);
	  console.log("menuchange hola poligono=",poligono.getPath());
	  /*var bot=document.createElement("button");bot.className="btn btn-oscuro";
	  bot.style.position="absolute";bot.style.top="10px";bot.style.left=((divcanvas.offsetWidth/2)-30)+"px";bot.style.zIndex="8000";
	  bot.innerHTML="Cerrar"; bot.onclick=controladorTienda.cerrar;
	  divcanvas.appendChild(bot);*/
	},
	damepuntos:function(){
		var puntos=[];
		if (poligono.getMap()){
			var vertices = poligono.getPath();
			for (var i =0; i < vertices.getLength(); i++) {
			    var xy = vertices.getAt(i);
			    puntos.push([xy.lat(),xy.lng()]);
			  }
		}
		return puntos;
	},
	cerrarinfo:function() {
		infowindow.close();
	},
	menuchange:function(opc){
		infowindow.close();
	  if (opc<1){
		//poligono.setOptions({editable: false,clickable:true});
		 clickmapa=google.maps.event.addListener(map, 'click', placeMarker);
		 if (poligono.getMap()){
		 	console.log("menuchange hola poligono=",poligono);
		 	clickpoligono=google.maps.event.addListener(poligono, 'click', placeMarker);
		 }
		 if (drawingManager.getMap()) {
		 	console.log("menuchange hola drawingManager=");
			 google.maps.event.removeListener(drawinevent);
			drawingManager.setOptions({	drawingMode:null});
			drawingManager.setMap(null);
		}
	  }else if (opc==1){
	  	if (poligono.getMap() ){
	  		google.maps.event.removeListener(clickpoligono);
	  		poligono.setMap(null);
	  		menumap.ops[1].innerHTML="Crear Zona";
	  		
	  	}
	  	drawingManager.setOptions({
			drawingMode:google.maps.drawing.OverlayType.POLYGON
			 });
	  	drawingManager.setMap(map);
		drawinevent=google.maps.event.addListener(drawingManager, 'polygoncomplete', poligonoesta);
		google.maps.event.removeListener(clickmapa);
	  	//menumap.ops[2].style.visibility="hidden";
	  }else if (opc==2){
	  	controladorTienda.cerrar();
	  	menumap.selec(null);
	  }
	},
	codeAddress:function(address) {
		
		  geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
			   map.setZoom(16);
			  map.setCenter(results[0].geometry.location);
			  var marker = new google.maps.Marker({
				  map: map,
				  position: results[0].geometry.location
			  });
			   var txbot="<div><button style='font-size:0.9em;' onclick=\"controladorTienda.selec_dir_mapa({dir:'"+results[0].formatted_address+"',lat:"+results[0].geometry.location.lat()+",lon:"+results[0].geometry.location.lng()+"})\">Seleccionar</button> | <button style='font-size:0.9em;'  onclick=\"controladorTienda.cerrarInfo()\">Cerrar</button></div><div>";
			  var text=results[0].formatted_address+".<br> Latitud= "+results[0].geometry.location.lat()+",<br> Longitud= "+results[0].geometry.location.lng()+"<br></div><br>";
			 // var text=results[0].formatted_address+".Latitud="+results[0].geometry.location.lat()+", Longitud="+results[0].geometry.location.lng();
				//infowindow.setContent(text+"<button class='botnor gris' style='position:absolute;font-size:0.9em;top:27px;right:0px;' onclick=\"controladorTienda.selec_dir_mapa({dir:'"+results[0].formatted_address+"',lat:"+results[0].geometry.location.lat()+",lon:"+results[0].geometry.location.lng()+"})\">Seleccionar</button>");
				 infowindow.setContent(txbot+text);
				infowindow.open(map, marker);
			  google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent("<div><button class='botnor gris' style='font-size:0.9em;' onclick=\"controladorTienda.selec_dir_mapa({dir:'"+results[0].formatted_address+"',lat:"+results[0].geometry.location.lat()+",lon:"+results[0].geometry.location.lng()+"})\">Seleccionar</button> | <button style='font-size:0.9em;'  onclick=\"controladorTienda.cerrarInfo()\">Cerrar</button></div><div><br>"+text);
				  //infowindow.setContent(text+"<button class='botnor gris' style='position:absolute;font-size:0.9em;top:27px;right:0px;' onclick=\"controladorTienda.selec_dir_mapa({dir:'"+results[0].formatted_address+"',lat:"+results[0].geometry.location.lat()+",lon:"+results[0].geometry.location.lng()+"})\">Seleccionar</button>");
				  infowindow.open(map, marker);
				});
			//infowindow.setContent(results[0].formatted_address+", latitud="+results[0].geometry.location.lat()+"\nLongitud="+results[0].geometry.location.lng());
			  //  infowindow.open(map, marker);
			} else {
			  alert('Error: ' + status);
			}
		  });
	},
	
	cargar:function(fun) {
		  var script = document.createElement('script');
		  script.type = 'text/javascript';
		  script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp&sensor=true&libraries=drawing&' +
			  'callback='+fun;
		  document.body.appendChild(script);
		  console.log("cargando script");
	}
  };
  return Mapag;
})();
