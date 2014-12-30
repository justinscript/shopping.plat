window.z$=function(obj){return typeof(obj)=="string"?document.getElementById(obj):obj};
String.prototype.trim=function(){return this.replace(/(^[\s]*)|([\s]*$)/g,"")};
var gozap_isIE = true;
var version = 7;
var gozap_isNetscape = false;
var gozap_isOpera = false;
if(0 <= navigator.appName.indexOf("Netscape")){
	gozap_isIE = false;
	gozap_isNetscape = true;
}else if(0<=navigator.appName.indexOf("Opera")){
	gozap_isIE = false;
	gozap_isOpera = true;
}
if(gozap_isIE)try{version=parseInt(navigator.appVersion.split("MSIE")[1]);}catch(err){}
else if(gozap_isNetscape){
	if(0<navigator.userAgent.indexOf("Firefox/2.0"))version = 2;
}


function ZHttpBinding(urlList){
	this.urlList = urlList;
	if(null == urlList){
		this.urlList = ["/JHB/"];
	}

	var to = "maimaijun.com";
	var sendCacheArr = [];
	var sid;
	var debugFunction;
	var xmlns = "http://jabber.org/protocol/httpbind";
	var hold = "1";
	var inactivity = 30000;
	var wait = 30000;
	var isAnonymous = false;
	var currURL;
	var requests = 1;
	var RID = 100;
	var isInit;
	var connectListenerFun;
	var errStartTime = 0;
	var errorReconnTime = 10000;//错误后的重练时间

	global_thread_functionArr.push(thread);
	function thread(){
		for(i = sendCacheArr.length-1;i>=0;i--){
			var o = sendCacheArr[i];
			if(null != o.errorTime && errorReconnTime<global_currTime-o.errorTime){
				o.errorTime = null;
				sendToServer(o,global_currTime);
			}
		}
		if(isCheckSend){
			checkSend();
		}

		if(0 != errStartTime && inactivity<global_currTime-errStartTime){
			closeFun();
		}

	}
	ZHttpBinding.prototype.setTo = function(t){
		to = t;
	}
	ZHttpBinding.prototype.close = function(){
		closeFun();
	}
	ZHttpBinding.prototype.startConnect = function(anonymous){
		closeFun();
		errStartTime = 0;
		isInit = true;
		isAnonymous = anonymous;
		currURL = this.urlList[Math.floor(Math.random()*this.urlList.length)];
		var rid = getRid();
		httpSend('<body xmlns="'+xmlns+'" content="text/xml; charset=utf-8" hold="'+hold+'" rid="'+rid+'" to="'+to+'" wait="'+wait+'"'+(isAnonymous?' anonymous="true"':"")+' xml:lang="en" ver="1.6" xmpp:version="1.0" xmlns:xmpp="urn:xmpp:xbosh" />',rid);
	}
	
	ZHttpBinding.prototype.send = function(str){
		httpSend(str);
	}
	ZHttpBinding.prototype.setConnectListener = function(fun){
		connectListenerFun = fun;
	}
	function closeFun(){
		errStartTime = 0;
		for(var i = sendCacheArr.length-1;i>=0;i--){
			closeObject(sendCacheArr[i]);
		}
		sendCacheArr.splice(0,sendCacheArr.length);
			
		if(null != sid){
			var rid = getRid();
			httpSend("<body xmlns=\""+xmlns+"\" sid=\""+sid+"\" rid=\""+rid+"\" type='terminate'></body>",rid);
		}
		sid = null;
		if(null != connectListenerFun){
			try{
				connectListenerFun(0);
			}catch(err){}
		}
		
	}

	function closeObject(o){
		try{
			if(null != o.loader){
				o.loader.onreadystatechange = null;
				o.loader = null;
			}
		}catch(err){}
	}
	
	var isCheckSend;
	function httpSend(str,rid){
		var o = null;
		if(0 != sendCacheArr.length && null == rid){
			o = sendCacheArr[0];
			if(-1 == o.rid){
				o.str += str;
			}else{
				o = null;
			}
		}
		if(null == o){
			o = {str:str,rid:rid,loader:null,rece:null,sendTime:0};
			sendCacheArr.unshift(o);
			isCheckSend = true;
			//checkSend();
		}
	}
	function checkSend(){
		isCheckSend = false;
		var now = global_currTime;
		for(var i = sendCacheArr.length-1,j=0;i>=0;i--,j++){
			if(j>=requests)break;
			var o = sendCacheArr[i];
			if(null == o.loader){
				if(null == o.rece && (0 == o.sendTime || wait<(now-o.sendTime))){
					sendToServer(o,now);
				}
			}
		}
	}
	function sendToServer(o,now){
		o.sendTime = now;
		if(-1 == o.rid || null == o.rid){
			o.rid = getRid();
			o.str = "<body xmlns=\""+xmlns+"\" sid=\""+sid+"\" rid=\""+o.rid+"\">"+o.str+"</body>";
		}
		var xmlhttp=httpBindingGetHTTPObject();
		xmlhttp.open('POST', currURL, true);
		o.loader = xmlhttp;
		//xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
 		//xmlhttp.send('&url='+encodeURIComponent(gozap_jhb_URL)+'&data='+encodeURIComponent('<body type="terminate" sid="'+chat_http_sid+'" rid="100000000" xmlns="http://jabber.org/protocol/httpbind"><presence type="unavailable"></presence></body>')+"&sid="+chat_http_sid); 
		debug("send:"+o.str);
		xmlhttp.send(o.str);
		xmlhttp.onreadystatechange = httpReadyStateChange;
	}
	function parse(xml){
		if("terminate" == xml.firstChild.getAttribute("type")){
			close();
			return;
		}
		var type = 2;

		if(isInit){
			wait = parseInt(xml.firstChild.getAttribute("wait"))*1000;
			inactivity = parseInt(xml.firstChild.getAttribute("inactivity"))*1000;
			sid = xml.firstChild.getAttribute("sid");
				
			requests = parseInt(xml.firstChild.getAttribute("requests"));
			isInit = false;
			if(null != connectListenerFun){
				try{
					connectListenerFun(1,xml.firstChild);
				}catch(err){}
			}
			//dispatchEvent(new ZConnEvent(ZConnEvent.CONNECT));
		}else{
			var len = xml.firstChild.childNodes.length;
			for(var i=0;i<len;i++){
				//dispatchEvent(new ZConnEvent(ZConnEvent.DATA,xml.children()[i]));
				if(null != connectListenerFun){
					try{
						connectListenerFun(2,xml.firstChild.childNodes[i]);
					}catch(err){}
				}
			}
		}
		
		
		if(0 == sendCacheArr.length){
			httpSend("");
		}else{
			checkSend();
		}


	}

	function httpReadyStateChange(e){
		debug("status:"+this.status);
		if (this.readyState == 4 && this.status == 200){
			try{
				debug("rece:"+this.responseText);
				errStartTime = 0;
				var xml = zring_createXml(this.responseText);

				var ack = xml.firstChild.getAttribute("ack");

				if(null == ack || "" == ack){
					ack = '102';
				}
				

				if(null != ack && "" != ack){
					var ack_num = parseInt(ack);
					var len = sendCacheArr.length-1;
					var parse_arr = [];
					var isFind = false;
					var i;
					for(i = len;i>=0;i--){
						var o = sendCacheArr[i];
						ack_num = o.rid;
						if(ack_num == o.rid){
							if(i == len){
								parse_arr.unshift(xml);
								sendCacheArr.splice(i,1);
								isFind = true;
							}else{
								o.rece = xml;
								break;
							}
						}else if(isFind){
							if(null != o.rece){
								parse_arr.unshift(o.rece);
								sendCacheArr.splice(i,1);
							}else{
								break;
							}
						}
					}
					for(i = parse_arr.length-1;i>=0;i--){
						parse(parse_arr[i]);
					}
				}
			}catch(err){
			}
		}else if(200 != this.status){
			this.onreadystatechange = null;
			if(0 == errStartTime){
				errStartTime = global_currTime;
			}
			for(i = sendCacheArr.length-1;i>=0;i--){
				var o = sendCacheArr[i];
				if(o.loader == this){
					if(errorReconnTime<global_currTime-o.sendTime){
						sendToServer(o,global_currTime);
					}else{
						o.errorTime = global_currTime;
					}
					break;
				}
			}
			
		}
	}


	function getRid(){
		RID++;
		return RID;
	}



	function debug(str,color){
		if(null != debugFunction){
			try{
				debugFunction(str,color);
				return;
			}catch(err){
				//alert(err);
			}
		}
		//alert(str);
	}
	ZHttpBinding.prototype.setDebugFun = function(fun){
		debugFunction = fun;
	}
}



function httpBindingGetHTTPObject(){
	  var xmlhttp = false;
	   if(window.XMLHttpRequest){
		xmlhttp = new XMLHttpRequest();
		if(xmlhttp.overrideMimeType){
		 xmlhttp.overrideMimeType('text/xml');
		}
	   }else{
		try{
		 xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
		}catch(e){
		 try{
		  xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		 }catch(E){
		  xmlhttp = false;
		 }
		}
	   }
	   return xmlhttp;
 }


  function zring_createXml(str){
	if(window.ActiveXObject){
		var xmlDom=new ActiveXObject("Microsoft.XMLDOM");
		//doc = new ActiveXObject("Msxml2.DOMDocument"); 
		xmlDom.loadXML(str);
		return xmlDom;
	}else return new DOMParser().parseFromString(str, "text/xml");
  }
function zring_getXMLString(xmlObj){
	if(gozap_isIE){
		return xmlObj.xml;
	}else{
		var oSerializer = new XMLSerializer();
		return oSerializer.serializeToString(xmlObj);
	}
}



var global_thread_functionArr = [];

var global_currTime = null;

var global_Time = setInterval("timeFunction()",50);
var global_funArr = [];
var global_moveFunArr = [];

var global_up_thread_time = 0;

function timeFunction(){
	var currTime = new Date().getTime();
	if(null == global_currTime){
		global_currTime = currTime;
	}else{
		global_currTime += 50;
	}

	if(1000<global_currTime-global_up_thread_time){
		global_up_thread_time = global_currTime;
		for(var i = global_thread_functionArr.length-1;i>=0;i--){
			try{
				global_thread_functionArr[i]();
			}catch(err){}
		}
	}

	for(var i=global_funArr.length-1;i>=0;i--){
		try{
			if(global_funArr[i].del){
				global_funArr.splice(i,1);
				continue;
			}
			if(global_funArr[i].time<=currTime-global_funArr[i].uTime){
				if("string" == typeof global_funArr[i].fStr){
					eval(global_funArr[i].fStr);
				}else{
					global_funArr[i].fStr();
				}
				if(0 == global_funArr[i].type){
					global_funArr.splice(i,1);
				}else{
					global_funArr[i].uTime = currTime;
				}
			}
		}catch(err){
			global_funArr.splice(i,1);
		}
	}
	for(var i=global_moveFunArr.length-1;i>=0;i--){
		try{
			var o =  global_moveFunArr[i];
			if("alpha" ==o.type){
				var al = o.obj.getAttribute("al");
				if(null == al)al = 0;
				else al = parseInt(al);
				if(1 >= Math.abs(o.to-al)){
					o.obj.setAttribute("al",o.to);
					al = o.to;
					if(null != o.fun){
						try{
							o.fun();
						}catch(err){}
					}
					global_moveFunArr.splice(i,1);
				}else{
					al += (o.to-al)*0.2;
				}
				o.obj.setAttribute("al",al);
				with(o.obj.style){
					filter = "alpha(opacity="+al+")";
					opacity = al/100;
					if(0 == al)display = "none";
					else display = "";
				}
			}else if("width" == o.type){
				zring_time_move_fun(o,i,o.obj.offsetWidth);
			}else if("height" == o.type){
				zring_time_move_fun(o,i,o.obj.offsetHeight);
			}else if("scrollTop" == o.type || "scrollLeft" == o.type){
				var num = o.obj[o.type];
				if(2 >= Math.abs(o.to-num)){
					o.obj[o.type] = o.to;
					if(null != o.fun){
						try{
							o.fun();
						}catch(err){}
					}
					global_moveFunArr.splice(i,1);
				}else{
					var src_num = o.obj[o.type];
					o.obj[o.type] = (num+(o.to-num)/2);
					if(o.obj[o.type] == src_num){
						if(null != o.fun){
							try{
								o.fun();
							}catch(err){}
						}
						global_moveFunArr.splice(i,1);
					}
				}
			}else{
				zring_time_move_fun(o,i,0);
			}/*else{
				global_moveFunArr.splice(i,1);
			}*/
		}catch(err){
			global_moveFunArr.splice(i,1);
		}
	}
		
	if("undefined" != typeof chat_isWinFocus && chat_isNewMsg){
			if(!chat_isWinFocus){
				if(null == chat_oldTitle){
					chat_oldTitle = document.title;
				}
				if(1000<=currTime-chat_upSetTitleTime){
					if("　" == document.title){
						document.title = chat_o.lan.titleAlert;
					}else{
						document.title = "　";
					}
					chat_upSetTitleTime = currTime;
				}
			}else{
				chat_isNewMsg = false;
				if(null != chat_oldTitle){
					document.title = chat_oldTitle;
					chat_oldTitle = null;
				}
			}
		}


}
function zring_time_move_fun(o,i,d_num){
	var num = o.obj.style[o.type];
	if("" == num || null == num){
		num = d_num;
	}else{
		var indexof = num.indexOf("px");
		if(0<=indexof){
			num = parseInt(num.substring(0,indexof));
		}
	}


	if(2 >= Math.abs(o.to-num)){
		o.obj.style[o.type] = o.to+"px";
		if(null != o.fun){
			try{
				o.fun();
			}catch(err){}
		}
		global_moveFunArr.splice(i,1);
	}else{
		o.obj.style[o.type] = (num+(o.to-num)/2)+"px";
	}
}
function z_setTimeout(funStr,time){
	var retO = {fStr:funStr,time:time,uTime:new Date().getTime(),type:0};
	global_funArr.push(retO);
	return retO;
}
function z_setInterval(funStr,time){
	var retO = {fStr:funStr,time:time,uTime:new Date().getTime(),type:1};
	global_funArr.push(retO);
	return retO;
}
function z_clearInterval(o){
	if(null != o){
		o.del = true;
	}
}

function debug_movieFun(obj,type,to,fun){
	for(var i=global_moveFunArr.length-1;i>=0;i--){
		if(global_moveFunArr[i].obj == obj && global_moveFunArr[i].type == type){
			global_moveFunArr[i].to = to;
			global_moveFunArr[i].fun = fun;
			return;
		}
	}
	global_moveFunArr.push({obj:obj,type:type,to:to,fun:fun});
}
timeFunction();


function zringhost_replaceAll(str,s,t){
	if(null == str)return str;
	if(0<=str.indexOf(s)){
		var arr = str.split(s);
		return arr.join(t);
	}else{
		return str;
	}
}
function zringhost_formatXML(xmlStr){
	if(null == xmlStr)return xmlStr;
	xmlStr = zringhost_replaceAll(xmlStr,"<","&lt;");
	xmlStr = zringhost_replaceAll(xmlStr,">","&gt;");
	xmlStr = zringhost_replaceAll(xmlStr,"\"","&quot;");
	xmlStr = zringhost_replaceAll(xmlStr,"\'","&apos;");
	return xmlStr;
}

var zringhost_Jid = 0;
function zringhost_getJID(){
	var ret = "";
	var r;
	for (var i = 0; i < 8;i++) {
		r = Math.floor(Math.random()*36);
		r = (r >= 0 && r <= 9) ? (r + 48) : (r + 87);
		ret+=String.fromCharCode(r);
    }
	return ret+"_"+(zringhost_Jid++);
}

function zring_getChildByName(node,name){
	var arr = node.childNodes;
	for(var i = arr.length-1;i>=0;i--){
		if(arr[i].nodeName == name){
			return arr[i];
		}
	}
	return null;
}
var zring_urlCheck = new RegExp("((?:http|https|ftp|mms|rtsp)://(&(?=amp;)|[A-Za-z0-9\./=\?%_~@&#:;\|\!\+\-])+)","ig");
function zring_checkURL(str){
	return str.replace(zring_urlCheck, "<a target=\'_blank\' href=\'$1\'>$1</a>");
}