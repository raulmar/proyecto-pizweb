
if(typeof JSON!=='object'){JSON={};}
(function(){'use strict';function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
f(this.getUTCMonth()+1)+'-'+
f(this.getUTCDate())+'T'+
f(this.getUTCHours())+':'+
f(this.getUTCMinutes())+':'+
f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());

var base64={PADCHAR:"=",ALPHA:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",makeDOMException:function(){try{return new DOMException(DOMException.INVALID_CHARACTER_ERR)}catch(a){var b=Error("DOM Exception 5");b.code=b.number=5;b.name=b.description="INVALID_CHARACTER_ERR";b.toString=function(){return"Error: "+b.name+": "+b.message};return b}},getbyte64:function(a,b){var c=base64.ALPHA.indexOf(a.charAt(b));if(-1===c)throw base64.makeDOMException();return c},decode:function(a){a=
""+a;var b=base64.getbyte64,c,d,e,f=a.length;if(0===f)return a;if(0!==f%4)throw base64.makeDOMException();c=0;a.charAt(f-1)===base64.PADCHAR&&(c=1,a.charAt(f-2)===base64.PADCHAR&&(c=2),f-=4);var g=[];for(d=0;d<f;d+=4)e=b(a,d)<<18|b(a,d+1)<<12|b(a,d+2)<<6|b(a,d+3),g.push(String.fromCharCode(e>>16,e>>8&255,e&255));switch(c){case 1:e=b(a,d)<<18|b(a,d+1)<<12|b(a,d+2)<<6;g.push(String.fromCharCode(e>>16,e>>8&255));break;case 2:e=b(a,d)<<18|b(a,d+1)<<12,g.push(String.fromCharCode(e>>16))}return g.join("")},
getbyte:function(a,b){var c=a.charCodeAt(b);if(255<c)throw base64.makeDOMException();return c},encode:function(a){if(1!==arguments.length)throw new SyntaxError("Not enough arguments");var b=base64.PADCHAR,c=base64.ALPHA,d=base64.getbyte,e,f,g=[];a=""+a;var h=a.length-a.length%3;if(0===a.length)return a;for(e=0;e<h;e+=3)f=d(a,e)<<16|d(a,e+1)<<8|d(a,e+2),g.push(c.charAt(f>>18)),g.push(c.charAt(f>>12&63)),g.push(c.charAt(f>>6&63)),g.push(c.charAt(f&63));switch(a.length-h){case 1:f=d(a,e)<<16;g.push(c.charAt(f>>
18)+c.charAt(f>>12&63)+b+b);break;case 2:f=d(a,e)<<16|d(a,e+1)<<8,g.push(c.charAt(f>>18)+c.charAt(f>>12&63)+c.charAt(f>>6&63)+b)}return g.join("")}};window.btoa||(window.btoa=base64.encode);window.atob||(window.atob=base64.decode);