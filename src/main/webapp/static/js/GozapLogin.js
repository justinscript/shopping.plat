function GozapLogin(resource,urlList){
	GozapLogin.prototype.PRESENCE = "presence";
	GozapLogin.prototype.MESSAGE = "message";

	var ANONYMOUSREGISTER = "anonymouseRegister";
	var ANONYMOUSLOGIN = "anonymousLogin";
	var LOGINING = "logining";
	var DEFIQTIMEOUT = 60000;
	var sendXMLCatch = [];
	var NONE = 0;
	var SENDED = 1;
	//var SENDED = 0;
	var jid;
	var ip;
	var connectListenerFun;
	var isConned;
	var un,pw,rk;
	
	if(null == resource){
		resource = "javascript" + (new Date()).valueOf();
	}
	GozapLogin.prototype.getResource = function(){
		return resource;
	}
	var zb = new ZHttpBinding(urlList);
	zb.setConnectListener(connectListener);
	var isAnonymous;
	GozapLogin.prototype.anonymousLogin = function(){
		isConned = false;
		zb.startConnect(true);
		reconnectTime = 0;
		isAnonymous = true;
	}
	GozapLogin.prototype.sLogin = function(u,p,r){
		isConned = false;
		un = u;
		pw = p;
		rk = r;
		if(0<un.indexOf("@")){
			un = u.substr(0,u.indexOf("@"));
			zb.setTo(u.substr(u.indexOf("@")+1));
		}
		reconnectTime = 0;
		zb.startConnect(false);
		isAnonymous = false;
	}
	GozapLogin.prototype.getJid = function(){
		return jid;
	}
	GozapLogin.prototype.getIP = function(){
		return ip;
	}
	var listenerFunArr = [];
	GozapLogin.prototype.addEventListener = function(type,fun){
		for(var i = listenerFunArr.length-1;i>=0;i--){
			if(listenerFunArr[i].type == type){
				listenerFunArr[i].fun = fun;
				return;
			}
		}
		listenerFunArr.push({type:type,fun:fun});
	}
	GozapLogin.prototype.setDebugFun = function(fun){
		zb.setDebugFun(fun);
	}
	GozapLogin.prototype.setConnectListener = function(fun){
		connectListenerFun = fun;
	}
	GozapLogin.prototype.sendXMLToServer = function(xml,retFun,timeout,cs,reSend,allowBeforeLoginSend){
		try{
			sendXMLToServer(xml,retFun,timeout,cs,reSend,allowBeforeLoginSend);
		}catch(err){
			//alert(err);
		}
	}
	global_thread_functionArr.push(thread);
	function thread(){

		if(0<reconnectTime){
			reconnectTime-=1000;
			if(0>=reconnectTime){
				debug("reconnTime:"+reconnectTime);
				reconnectTime = 0;
				zb.startConnect(isAnonymous);
			}
		}

		for(var i=sendXMLCatch.length-1;i>=0;i--){
			var tmpObj = sendXMLCatch[i];
			if(SENDED == tmpObj.state){
				sendXMLCatch.split(i,1);
			}else if(tmpObj.timeout<global_currTime - tmpObj.sendTime){
				if(null != tmpObj.fun){
					try{
						tmpObj.fun(zring_createXml('<iq type="error" msg="timeout"><error type="error" code="504">timeout</error></iq>'),tmpObj.xml,tmpObj.cs);
					}catch(err){
						debug(err);
					}
				}
				sendXMLCatch.split(i,1);
			}
		}
	}
	var reconnectTime = 0;
	function connectListener(status,xml){
		if(1 == status){
			isConned = true;
			if(isAnonymous){
				var sendXML1 = '<auth xmlns="urn:ietf:params:xml:ns:xmpp-sasl" mechanism="ANONYMOUS"/>';
				sendXMLToServer(sendXML1);
				

				var sendXML = '<iq type="set" id="_bind_auth_2" xmlns="jabber:client"><bind xmlns="urn:ietf:params:xml:ns:xmpp-bind"><resource>'+resource+'</resource></bind></iq>';
				sendXMLToServer(sendXML,iqResult,60000,ANONYMOUSREGISTER,false,true);
				
				//var sendXML2 = '<iq type="set" id="_session_auth_2" xmlns="jabber:client"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>';
				//sendXMLToServer(sendXML2,iqResult,0,ANONYMOUSREGISTER,false,true);
			}else{

				//<iq type='set' id='1a58416'><query xmlns='jabber:iq:auth'><username>mbed</username><password>mirror</password><resource>flash_as3</resource></query></iq>
				var sendXML = '<iq type="set" id="_bind_auth_2" xmlns="jabber:client"><query xmlns="jabber:iq:auth"><username>'+un+'</username><password>'+pw+'</password><resource>'+resource+'</resource></query></iq>'
				sendXMLToServer(sendXML,iqResult,0,LOGINING,false,true);
			}

		}else if(0 == status){
			isConned = false;
			isLogin = false;
			if(null != connectListenerFun){
				try{
					connectListenerFun(status,xml);
				}catch(err){}
			}
			reconnectTime = Math.floor(Math.random()*30000)+10000;
			for(var i=sendXMLCatch.length-1;i>=0;i--){
				var tmpObj = sendXMLCatch[i];
				if(SENDED != tmpObj.state){
					if(null != tmpObj.fun){
						try{
							tmpObj.fun(zring_createXml('<iq type="error" msg="connect close"><error type="error" code="444">connect close</error></iq>'),tmpObj.xml,tmpObj.cs);
						}catch(err){
							debug(err);
						}
					}
					tmpObj.state = SENDED;
				}
			}
		}else{
			var id = xml.getAttribute("id");
			if(null != id && "" != id){
				var tmpObj;
				for(var i=sendXMLCatch.length-1;i>=0;i--){
					tmpObj = sendXMLCatch[i];
					if(tmpObj.id == id && SENDED != tmpObj.state){
						if(null != tmpObj.fun){
							try{
								tmpObj.fun(xml,tmpObj.xml,tmpObj.cs);
							}catch(err){
								debug(err);
							}
						}
						tmpObj.state = SENDED;
						return;
					}
				}
			}

			var nodeName = xml.nodeName;
			for(var i = listenerFunArr.length-1;i>=0;i--){
				if(listenerFunArr[i].type == nodeName){
					try{
						listenerFunArr[i].fun(xml);
					}catch(err){}
					return;
				}
			}
		}
	}


	function sendXMLToServer(xml,retFun,timeout,cs,reSend,allowBeforeLoginSend){
		if(null == timeout || 0 >= timeout){
			timeout = DEFIQTIMEOUT;
		}
		if(typeof xml == "string"){
			xml = zring_createXml(xml);
		}
		var o = {xml:xml,fun:retFun,timeout:timeout,cs:cs,reSend:reSend,reSendNum:0,state:NONE};
		var id = xml.firstChild.getAttribute("id");
		o.id = id;
		o.sendTime = global_currTime;
		if(null != retFun){
			if(null == id || "" == id){
				id = zringhost_getJID();
				xml.firstChild.setAttribute("id",id);
			}
			o.id = id;
			sendXMLCatch.push(o);
		}else if(undefined != id && "" != id && reSend){
			sendXMLCatch.push(o);
		}else if(!isConned){
			sendXMLCatch.push(o);
		}
		zb.send(zring_getXMLString(xml));
	}

	var isLogin;
	function iqResult(res,send,cs){
		if(ANONYMOUSREGISTER == cs){
			try{
				jid = zring_getChildByName(zring_getChildByName(res,"bind"),"jid").firstChild.nodeValue;
				if(0<jid.indexOf("/")){
					jid = jid.substr(0,jid.indexOf("/"));
				}
			}catch(err){
				debug(err);
			}
			sendXMLToServer('<iq type="set"><session xmlns="urn:ietf:params:xml:ns:xmpp-session"/></iq>',iqResult,0,ANONYMOUSLOGIN,false,true);
		}else if(ANONYMOUSLOGIN == cs){
			try{
				ip = res.getAttribute("ip");
				if(null != connectListenerFun){
					connectListenerFun(1,res);
				}
			}catch(err){
				debug(err);
			}
		}else if(LOGINING == cs){
			if("result" == res.getAttribute("type")){
				isLogin = true;
				try{
					if(null != connectListenerFun){
						connectListenerFun(1,res);
					}
				}catch(err){
					debug(err);
				}
			}else{
				zb.close();
			}
		}
	}
}
function IQ(type, xmlns){

	//var div = document.createElement("div");

	/*var xml = document.createElement("iq");
	//div.appendChild(xml);

	
	xml.setAttribute("type",type);
	xml.setAttribute("id",id);
	var q = document.createElement('query');
	q.setAttribute("xmlns",xmlns);
	xml.appendChild(q);*/

	var id = zringhost_getJID();
	var qa = [];
	var to;
	var xml = '<iq type="'+type+'"><query xmlns="'+xmlns+'">';

	IQ.prototype.setQueryAttribute = function(type,value){
		//return xml.firstChild;
		for(var i = qa.length-1;i>=0;i--){
			if(qa[i].type == type){
				qa[i].value = value;
				return;
			}
		}
		qa.push({type:type,value:value});
	}
	IQ.prototype.setID = function(i){
		id = i;
		//xml.setAttribute("id",id);
	}
	IQ.prototype.setTo = function(t){
		to = t;
		//xml.setAttribute("to",to);
	}
	IQ.prototype.addItem = function(item){
		/*if("string" == typeof item){
			//item = zring_createXml(item);
			var tmp = document.createElement("div");
			tmp.innerHTML = item;
			item = tmp.firstChild;
		}
		xml.firstChild.appendChild(item);*/
		xml += item;
	}
	IQ.prototype.getXML = function(){
		var tmpXML = xml+"</query></iq>"
		var retXML = zring_createXml(tmpXML);
		retXML.firstChild.setAttribute("id",id);
		if(null != to){
			retXML.firstChild.setAttribute("to",to);
		}
		for(var i=qa.length-1;i>=0;i--){
			retXML.firstChild.firstChild.setAttribute(qa[i].type,qa[i].value);
		}
		return retXML;
	}
}
