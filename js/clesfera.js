var ClEsfera=(function() {
	var pedido_act,socket,chatPedido={},chatok=false;
	
	function show_chatPedido(e){
		if (chatPedido.prin.className.indexOf("show") > -1){
			chatPedido.prin.className="chat_Pedido chat_Pedido_normal";
		}else {
			chatPedido.prin.className="chat_Pedido chat_Pedido_show";
		}
	}
	function enviar_Msg_Clisel(e){
		var msg=window.hUtils.stripHtml(chatPedido.textMsgClisel.value);
		if (msg.length>5){
			socket.emit('msgclient', msg);
			pintar_msg(msg,"mensaje_mio");
			chatPedido.textMsgClisel.value="";
		}
	}
	function pintar_msg(msg,cls){
		var dmen=document.createElement("div");
		dmen.className="chat_mensaje "+cls;
		dmen.innerHTML=msg;
		chatPedido.dentro.appendChild(dmen);
		chatPedido.dentro.scrollTop=chatPedido.dentro.scrollHeight;
	}
	function pintarChat() {
		document.body.appendChild(window.hUtils.crearElemento({e:"div",did:"prin",a:{className:"chat_Pedido chat_Pedido_normal"},hijos:[{e:"div",a:{className:"chat_cabecera"},listener:{click:show_chatPedido},inner:"¿ Te puedo ayudar en algo ?"},{e:"div",did:"dentro",a:{className:"dentro_chatPedido"}},{e:"div",a:{className:"pie_chatPedido"},hijos:[{e:"textarea",did:"textMsgClisel",atr:{placeholder:"Escribe aquí tu mensaje"}},{e:"button",did:"butMsgClisel",a:{className:"btn-primary"}, inner:"<span class='icon-forward'></span>",listener:{click:enviar_Msg_Clisel} }  ]}]},chatPedido));
	}
	function addEventos(){
		socket.on("connect",function(data){
			console.log("data connect=",data);
			if (!chatok){
				pintarChat();
				chatok=true;
			}
		});
		socket.on('msgtienda', function (data) {
			pintar_msg(data,"mensaje_otro");
		});
		socket.on('pedido', function (data) {
			pedido_act.pintar_pedido_storage(data);
		});
		socket.on('damepedido', function (data) {
			var ped=pedido_act.damepedido();
			if (ped){
				socket.emit('pedido', ped);
			}else {
				socket.emit('pedido', null);
			}
		});
	}
	function inicio(pedact,datosart) {
		pedido_act=pedact;
		if (window.io && datosart.tienda.url){
			socket=window.io.connect("http://"+datosart.tienda.url+":8080/");
			addEventos();
		}else {
			console.log("no se puede conectar porque no hay io o no hay url tienda, io=",window.io,", datosart=",datosart);
		}
	}
	return inicio;
})();