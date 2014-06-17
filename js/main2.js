var inicio=function(siem){
    var cH={},daterror=null,
        contenido=document.createElement("div"),enviando=false;
    contenido.className="contenido";
    function entsubm(fun){
        return function(evt) {
            var k = (evt) ? evt.which : event.keyCode;

            if (k==13)
                fun();
        }        
    }
    contenido.appendChild(hUtils.crearElemento({e:"ul",hijos:[{e:"li",did:"licrear",a:{className:"crearli"}, inner:"<a href='javascript:void(0);'>Crear Cuenta</a>"}, {e:"li",did:"lilog",a:{className:"loginli activo"},inner:"<a href='javascript:void(0);'>Login</a>"},{e:"br",a:{className:"salto"}}]},cH));
    
    contenido.appendChild(hUtils.crearElemento({e:"div",a:{className:"contepan"},hijos:[{e:"div",did:"paneles",a:{className:"paneles"}},{e:"span",did:"trian",a:{className:"trian"}}]},cH));
    var pancreate={};
    var divcrear=hUtils.crearElemento({e:"div",c:{top:"450px"},hijos:[
                {e:"h2",inner:"Crear cuenta"},{e:"label",inner:"Email:"},{e:"input",did:"email",a:{type:"email",maxLength:30,onkeyup:entsubm(crearValid)}},{e:"label",inner:"Nombre:"},{e:"input",did:"nombre",a:{type:"text",maxLength:30,onkeyup:entsubm(crearValid)}},{e:"label",inner:"Contraseña:"},{e:"input",did:"con",a:{type:"password",maxLength:30,onkeyup:entsubm(crearValid)}},{e:"label",inner:"Repite contraseña:"},{e:"input",did:"recon",a:{type:"password",maxLength:30,onkeyup:entsubm(crearValid)}},{e:"div",hijos:[{e:"button",did:"subm",a:{className:"boton"},inner:"Enviar"}]} ]},pancreate);
    cH.paneles.appendChild(divcrear);
    var pancontraolvi={};
    divolvi=hUtils.crearElemento({e:"div",c:{top:"450px"},hijos:[
                {e:"h2",inner:"¿Has olvidado tu contraseña?"},{e:"p",inner:"Introduce el email y te enviaremos un enlace para poder recuperar tu contraseña."},{e:"label",inner:"Email:"},{e:"input",did:"email",a:{type:"email",maxLength:30,onkeyup:entsubm(contraOlviValid)}},{e:"div",hijos:[{e:"button",did:"subm",a:{className:"boton"},inner:"Enviar"}]} ]},pancontraolvi);
    cH.paneles.appendChild(divolvi);
    var panlogin={};
    var divlog=hUtils.crearElemento({e:"div",c:{top:"0px"},hijos:[
                {e:"h2",inner:"Login"},{e:"form",did:"milogin",hijos:[
                {e:"label",inner:"Email:"},{e:"input",did:"email",a:{type:"email",id:"email",name:"email", required:true,maxLength:30,value:siem}},{e:"label",inner:"Contraseña:"},{e:"input",did:"con",a:{type:"password",id:"password", required:true,name:"password",maxLength:30}},{e:"div",a:{className:"izq"},hijos:[{e:"a",did:"olvi",a:{href:"javascript:void(0);"},inner:"¿Olvidó la contraseña?"}]},{e:"div",hijos:[{e:"button",did:"subm",a:{className:"boton"},inner:"Enviar"}]}]} ]},panlogin);
    cH.paneles.appendChild(divlog);
    var sel=2;
    cH.lilog.onclick=function() {
        if (sel>1) return;
        if (sel==0){
            divolvi.style.top="450px";
            divlog.style.top="0px";
        }else {
            this.className="loginli activo";
            cH.licrear.className="crearli";
            divcrear.style.top="450px";
            divlog.style.top="0px";
            cH.trian.style.left="85%";
        }
        sel=2;
    }
    cH.licrear.onclick=function() {
        if (sel==1) return;
        this.className="crearli activo";
        cH.lilog.className="loginli";
        divcrear.style.top="0px";
        if (sel==0)
            divolvi.style.top="450px";
        else
            divlog.style.top="450px";

        cH.trian.style.left="15%";
        sel=1;
    }
    panlogin.olvi.onclick=function() {
        sel=0;
        divolvi.style.top="0px";
        divlog.style.top="450px";
    }
    cH.fail=document.getElementById('fail');
    //document.body.appendChild(hUtils.crearElemento({e:"div",a:{className:"fail"},hijos:[{e:"strong",did:"fail"}]},cH));
    document.body.appendChild(contenido);
    function borrerror() {
        if (daterror) {
            daterror.parentNode.removeChild(daterror);
            daterror=null;
        }
        document.body.onkeypress=null;
    }
    function setError(cam,s){
        daterror=document.createElement("span");
        daterror.className="com-error";
        daterror.innerHTML=s;
        cam.parentNode.insertBefore(daterror,cam.nextSibling);
        cam.focus();
        document.body.onkeypress=borrerror;
    }
    function loginValidCampos() {
        /*var evt = e || window.event;
        if (typeof evt.stopPropagation != "undefined") {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true; 
        }
        formu.action="/login";
        formu.method="POST";
        return false;*/
        borrerror();
        if (enviando){
            document.getElementById("fail").innerHTML="Acabas de enviar datos, espera unos segundos para volver a enviar.";
            return false; 
        }
        if (!hUtils.validarEmail(panlogin.email.value)){
            setError(panlogin.email,"Email no valido");
            return false;
        }
        panlogin.con.value=hUtils.stripHtml(panlogin.con.value);
        if (panlogin.con.value.length>30 || panlogin.con.value.length<6){
            setError(panlogin.con,"Contraseña debe contener entre 6 y 30 caracteres");
            return false;
        }
        var to=document.getElementById("to").value;
        var ve=document.getElementById("ve").value;
        enviando=panlogin.subm.disabled=true;
        if (to.length>0 && ve=="v" && siem.length>0 && siem==panlogin.email.value){
            verificar(to,ve,panlogin.email.value, panlogin.con.value);
            return;
        }
        panlogin.milogin.action="/usuario/login";
        panlogin.milogin.method="POST";
        panlogin.milogin.submit();
    }
    function verificar(to,ve,ema,con) {
        hUtils.xJson({url:"/usuario/authenticated",datos:window.JSON.stringify({p:con,ve:ve,to:to,em:ema}),formu:true}).then(function(res){
            //console.log("respuesta ok=",res);
            window.location.href="/admintienda";
            /*enviando=panlogin.subm.disabled=false;
            document.getElementById("fail").innerHTML=res.ok;
            document.getElementById('logusu').innerHTML= "Logged in as <span >"+res.key[0] +"- "+res.key[1]+"</span> | <a href='/usuario/logout' class='logout' >Logout</a>";
            window.location.href="/admintienda";*/
        }).fail(function(er){
            enviando=panlogin.subm.disabled=false;
            document.getElementById("fail").innerHTML="<strong>"+er+"</strong>";
            
        });
       
    }
    function crearValid() {
        borrerror();
        if (enviando){
            document.getElementById("fail").innerHTML="Acabas de enviar datos, espera unos segundos para volver a enviar.";
            return false; 
        }
       
        if (!hUtils.validarEmail(pancreate.email.value)){
            setError(pancreate.email,"Email no valido");
            return false;
        }
        var campos=[];
         
        campos[0]=hUtils.stripHtml(pancreate.nombre.value);
        if (campos[0].length>30 || campos[0].length<3){
            setError(pancreate.nombre,"Por favor introduce un nombre válido");
            return false;
        }
       
        campos[1]=hUtils.stripHtml(pancreate.con.value);
        if (campos[1].length>30 || campos[1].length<6){
            setError(pancreate.con,"Contraseña debe contener entre 6 y 30 caracteres");
            return false;
        }
        campos[2]=hUtils.stripHtml(pancreate.recon.value);
        if (campos[2].toUpperCase() != campos[1].toUpperCase()){
            setError(pancreate.recon,"Las contraseñas no coinciden");
            return false;
        }
        var to=document.getElementById("to").value;
        var ve=document.getElementById("ve").value;
        enviando=pancreate.subm.disabled=true;
        if (to.length>0 && ve=="p" && siem.length>0 && siem==pancreate.email.value){
            verificar(to,ve,panlogin.email.value, panlogin.con.value,this);
            hUtils.xJson({url:"/usuario/olvpasswre",datos:window.JSON.stringify({ve:ve,nom:campos[0],to:to,em:siem,c1:campos[1],c2:campos[2]}),formu:true}).then(function(res){
                enviando=pancreate.subm.disabled=false;
                //console.log("respuesta ok=",res);
                document.getElementById("fail").innerHTML=res.ok;
                document.getElementById('logusu').innerHTML= "Logged in as <span >"+res.key[0] +"- "+res.key[1]+"</span> | <a href='/usuario/logout' class='logout' >Logout</a>";
                
            }).fail(function(er){
                enviando=pancreate.subm.disabled=false;
                document.getElementById("fail").innerHTML="<strong>"+er+"</strong>";
               
            });
        }else {
            var datjson={email:pancreate.email.value,nombre:campos[0],c1:campos[1],c2:campos[2]}
            hUtils.xJson({url:"/usuario/signup",datos:window.JSON.stringify(datjson),formu:true}).then(function(res){
                enviando=pancreate.subm.disabled=false;
                //console.log("respuesta ok=",res);
                document.getElementById("fail").innerHTML=res.ok;
                
            }).fail(function(er){
                enviando=pancreate.subm.disabled=false;
                document.getElementById("fail").innerHTML="<strong>"+er+"</strong>";
                
            }); 
        }
    }
    function contraOlviValid() {
        borrerror();
        if (enviando){
            document.getElementById("fail").innerHTML="Acabas de enviar datos, espera unos segundos para volver a enviar.";
            return false; 
        }
        if (!hUtils.validarEmail(pancontraolvi.email.value)){
            setError(pancontraolvi.email,"Email no valido");
            return false;
        }
        enviando=pancontraolvi.subm.disabled=true;
        hUtils.xJson({url:"/usuario/forgot",datos:window.JSON.stringify({email:pancontraolvi.email.value}),formu:true}).then(function(res){
            //console.log("respuesta ok=",res);
            enviando=pancontraolvi.subm.disabled=false;
            //setError(pancontraolvi.email,res.ok);
            document.getElementById("fail").innerHTML=res.ok;
        }).fail(function(er){
            enviando=pancontraolvi.subm.disabled=false;
            document.getElementById("fail").innerHTML="<strong>"+er+"</strong>";
            
        });
    }
   
    panlogin.subm.onclick=loginValidCampos;
    pancontraolvi.subm.onclick=contraOlviValid;
    pancreate.subm.onclick=crearValid;
    function init() {
        if (siem.length>0){
            var ve=document.getElementById("ve").value;
            if (ve == "p"){
                pancreate.email.value=siem;
                pancreate.email.readOnly=true;
                document.getElementById("fail").innerHTML+="<br>Cambio de contraseña:Introduce Nombre, y la nueva contraseña";
                cH.licrear.click();
                pancreate.nombre.focus();
            }else if (ve=="v"){
                panlogin.email.value=siem;
                panlogin.email.readOnly=true;
                panlogin.con.focus();
                document.getElementById("fail").innerHTML+="<br>Introduce tu contraseña para finalizar el proceso de verificación.";
            }
        }
    }
    /*if(typeof JSON!=='object'){
        console.log("cargamos json");
        hUtils.cargarScript("js/json2-min.js",init);
    }else*/
    init();
};
