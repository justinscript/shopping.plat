var zring_online_user_num_id = 0;

var isBan;

function banChat(){
	isBan = true;
}

function JsMucChat(divId,vJid,vNickName,imgPath,urlList,facePath){

	var isLogin = null != vJid && "" != vJid && 0>vJid.indexOf("@");
//	alert(vJid + '-' + vNickName);
	if(null != vJid && "" != vJid && 0>vJid.indexOf("@")){
		vJid+= "@maimaijun.com";
	}
	if(null == imgPath){
		imgPath = "images/";
	}
	var nickName = isLogin ? vNickName : "匿名用户";
	var isOnline = true;

	if(null == facePath){
		facePath = "http://www.maimaijun.com/images/chat/";
	}

	zring_online_user_num_id++;
	var user_num_id = zring_online_user_num_id;
	var componet = z$(divId);
	componet.innerHTML = "<div style='width:100%;height:100%;background-color:#DFE7F3;'><div style='position:absolute;'></div></div>";
	componet = componet.firstChild;
	thread();

	var connectListenerFun;
	
	var faceArr = [];
	faceArr.push(":)");
	faceArr.push(":D");
	faceArr.push(";)");
	faceArr.push(":-o");
	faceArr.push(":P");
	faceArr.push("(H)");
	faceArr.push(":@");
	faceArr.push(":S");
	faceArr.push(":$");
	faceArr.push(":(");
	faceArr.push(":'(");
	faceArr.push(":|");
	faceArr.push("(A)");
	faceArr.push("8o|");
	faceArr.push("8-|");
	faceArr.push("+o(");
	//faceArr.push("&amp;lt;:o)");
	faceArr.push("&lt;:o)");
	faceArr.push("|-)");
	faceArr.push("*-)");
	faceArr.push(":-#");
	faceArr.push(":-*");
	faceArr.push("^o)");
	faceArr.push("8-)");
	faceArr.push("(L)");
	faceArr.push("(U)");
	
	

	var gl = new GozapLogin(null,urlList);
	gl.setConnectListener(connStatus);
	if(isLogin){
		gl.sLogin(vJid,$('#myPasswd').val(),null);
	}else{
		gl.anonymousLogin();
	}
	
	gl.addEventListener(gl.PRESENCE,presenceListener);
	gl.addEventListener(gl.MESSAGE,messageListener);

	var customerIndex = 0;
	//var mucName = "muc";
	var mucName = "conference";
	var GET_ROOMINDEX = "getRoomIndex";
	var GET_ONLINEUSERS = "getOnlineusers"
	var loginTime;
	var confIndex;
	var confName;
	

	var memberId;
	var messages;
	var userImagePath;
	
	global_thread_functionArr.push(thread);

	var width,height;
	var upGetOnlineUsers=0;

	function thread(){
		if(width != componet.offsetWidth || height != componet.offsetHeight){
			width = componet.offsetWidth;
			height = componet.offsetHeight;
			resize();
		}
		//debug("checkTime:"+(global_currTime-upGetOnlineUsers));
		if(30000<=global_currTime-upGetOnlineUsers && isOnline){
			upGetOnlineUsers = global_currTime;
			getOnlineUsers();
		}
	}
	var msgDiv;
	var msgsDiv;
	var titleDiv;
	var onlineUserSpan;
	var inputDiv;
	var msgDivHeight;
	var sendDiv;
	var toolbarDiv;
	var nickNameInput;
	var faceSelectDiv;

	function resize(){
		if(null == msgDiv){
			msgDiv = document.createElement("div");
			msgDiv.style.backgroundColor = "#F3F6FB";
			msgDiv.style.position = "absolute";
			msgDiv.style.top = "23px";
			msgDiv.style.left = "5px";
			msgDiv.style.overflow = "auto";
			componet.firstChild.appendChild(msgDiv);
			msgsDiv = document.createElement("div");
			msgDiv.appendChild(msgsDiv);
		}
		msgDivHeight = height-128;
		msgDiv.style.width = (width-10)+"px";
		msgDiv.style.height = msgDivHeight+"px";
		if(null == titleDiv){
			titleDiv = document.createElement("div");
			componet.firstChild.appendChild(titleDiv);
			titleDiv.innerHTML = "<table width='100%' height='1' border=0 cellpadding=0 cellspacing=0><tr><td>&nbsp;</td><td><img src='"+imgPath+"chat-new.gif' style='vertical-align:middle;'/></td><td width='100%'><span style='color:#336699;font-size:12px;'><b>&nbsp;七嘴八舌版 1.0.2</b></span></td><td align='right' nowrap><span id='"+user_num_id+"_zring_online_user_id' style='color:#787878;font-size:12px;'> </span></td><td>&nbsp;</td></tr></table>";
		}
		titleDiv.style.width = width+"px";
		if(null == onlineUserSpan){
			onlineUserSpan = z$(user_num_id+"_zring_online_user_id");
		}
		if(null == inputDiv){
			inputDiv = document.createElement("div");
			componet.firstChild.appendChild(inputDiv);
			inputDiv.style.position = "absolute";
			inputDiv.style.left = "5px";
			inputDiv.style.backgroundColor = "#ffffff";
			inputDiv.innerHTML = "<textarea style='border:0;resize:none;font-size:12px;outline:none;'></textarea>";
		}
		inputDiv.style.top = (msgDiv.offsetTop+msgDiv.offsetHeight+30)+"px";
		inputDiv.style.width = (width-10)+"px";
		inputDiv.style.height = (height-inputDiv.offsetTop-5)+"px";
		inputDiv.firstChild.style.width = (inputDiv.offsetWidth-75)+"px";
		inputDiv.firstChild.style.height = (inputDiv.offsetHeight-5)+"px";
		inputDiv.firstChild.onkeydown = inputKeyListener;

		if(null == sendDiv){
			sendDiv = document.createElement("div");
			sendDiv.innerHTML = "<table border=0 cellpadding=0 cellspacing=0 width=62 height=42><tr><td align='center' style='font-size:12px;color:#336699;' bgColor='#F3F6FB'>发送</td></tr></table>";
			sendDiv.style.border = "2px solid #DFE7F2";
			sendDiv.style.cursor = "pointer";
			sendDiv.style.cursor = "hand";
			sendDiv.style.position = "absolute";
			sendDiv.onclick = sendClick;
			componet.firstChild.appendChild(sendDiv);
		}
		sendDiv.style.top = (height-20-sendDiv.offsetHeight)+"px";
		sendDiv.style.left = (width-10-sendDiv.offsetWidth)+"px";

		if(null == toolbarDiv){
			toolbarDiv = document.createElement("div");
			toolbarDiv.style.position = "absolute";
			toolbarDiv.style.left = "5px";
			componet.firstChild.appendChild(toolbarDiv);
			toolbarDiv.innerHTML = "<table width='100%' border=0 height='1' cellpadding=0 cellspacing=0><tr><td><input style='width:100px;border:0;color:#999;height:20px;line-height:20px;background-color:#fff' id='"+user_num_id+"_mucchat_name_input'></input></td>"+((null == vJid)?"":"<td style='padding-left:10px;'><input type='checkbox' id='"+user_num_id+"_muc_checkbox' style='display:none;'/></td><td style='color:#336699;font-size:12px;' nowrap valign='middle'><label for='"+user_num_id+"_muc_checkbox' style='display:none;'>匿名</label></td>")+"<td width='100%' align='right' valign='middle' style='padding-right:15px;'><img id='"+user_num_id+"_imgselect' src='"+imgPath+"1.png' style='vertical-align:middle;cursor:pointer;cursor:hand;'/></td></tr></table>";
		}
		if(null == nickNameInput){
			nickNameInput = z$(user_num_id+"_mucchat_name_input");
			if(null == vJid){

			}else{
				nickNameInput.disabled="disabled";
				z$(user_num_id+"_muc_checkbox").onchange = nickNameSelect;
			}
			z$(user_num_id+"_imgselect").onclick = imgSelectClick;
			showNickname();
		}
		toolbarDiv.style.width = msgDiv.offsetWidth+"px";
		toolbarDiv.style.top = (msgDiv.offsetTop+msgDiv.offsetHeight+5)+"px";

		if(null == faceSelectDiv){
			faceSelectDiv = document.createElement("div");
			faceSelectDiv.style.display = "none";
			faceSelectDiv.style.cssText = "position:absolute;left:5px;background-color:#F5F5F5;border:1px solid #6699CC;";
			var faceHtml = "<table width='100%' height='1' border=0 cellpadding=0 cellspacing=2><tr>";
			for(var i=1;i<=25;i++){
				faceHtml+="<td style='cursor:pointer;cursor:hand;'><img src='"+facePath+i+".png' width='26' height='26' faceI='"+(i-1)+"' style='border:1px solid #F5F5F5;'/></td>";
				if(0 == i%9){
					faceHtml += "</tr><tr>";
				}
			}
			faceHtml += "</tr></table>";
			componet.firstChild.appendChild(faceSelectDiv);
			faceSelectDiv.innerHTML = faceHtml;

			var nodeArr = faceSelectDiv.firstChild.firstChild.childNodes;
			for(var i = nodeArr.length-1;i>=0;i--){
				var tmpArr = nodeArr[i].childNodes;
				for(var j = tmpArr.length-1;j>=0;j--){
					tmpArr[j].onclick = selectFace;
					tmpArr[j].onmouseover = selectFaceOver;
				}
			}
			debug_movieFun(faceSelectDiv,"alpha",0);

		}

		faceSelectDiv.style.width = msgDiv.offsetWidth+"px";
		faceSelectDiv.style.top = (toolbarDiv.offsetTop-faceSelectDiv.offsetHeight)+"px";



	}
	function selectFace(e){
		var faceI = e.target.getAttribute("faceI");
		hiddenFaceSelect();
		inputDiv.firstChild.value += faceArr[faceI];
		inputDiv.firstChild.focus();
		//alert(e.target.firstChild.getAttribute("faceI"));
	}
	var upSelectFaceOver;
	function selectFaceOver(e){
		/*if(null != upSelectFaceOver){
			upSelectFaceOver.style.border = "1px solid #F5F5F5";
		}
		upSelectFaceOver = e.target.firstChild;
		upSelectFaceOver.style.border = "1px solid #336699";*/
	}
	function hiddenFaceSelect(){
		debug_movieFun(faceSelectDiv,"alpha",0);
	}
	function showFaceSelect(){
		faceSelectDiv.style.display = "";
		debug_movieFun(faceSelectDiv,"alpha",100);
	}
	function showNickname(){
		if(null == memberId){
			memberId = "";
		}
		if(null == vJid || "" == vJid){
			nickNameInput.value = nickName+memberId;
		}else{
			if(z$(user_num_id+"_muc_checkbox").checked){
				nickNameInput.value = nickName+memberId;
			}else{
				nickNameInput.value = vNickName;
			}
		}
	}
	function imgSelectClick(e){
		if("" == faceSelectDiv.style.display){
			hiddenFaceSelect();
		}else{
			showFaceSelect();
		}
	}

	function nickNameSelect(e){
		
		if(e.target.checked){
			
			nickNameInput.disabled="";
			
		}else{
			
			nickNameInput.disabled="disabled";
		}
		
		showNickname();
	}

	function sendClick(){
		sendMessage();
	}


	function getIsEnd(){
		if(getConsoleHeight()<msgDivHeight){
			return true;
		}
		return (msgDiv.scrollTop == (getConsoleHeight()-msgDivHeight));
	}
	function getConsoleHeight(){
		return msgsDiv.offsetHeight;
	}

	function inputKeyListener(event){
		if(event.keyCode == 13){
			event.preventDefault();
			sendMessage();
		}
	}
	function sendMessage(){
		isOnline = true;
		if(!isOnline){
			alert("当前未连接到服务器，无法发送消息:(");
			return;
		}
		if(null == vJid){
			alert("未登录不可以发送消息:(");
			return;
		}
		if(isBan){
			alert("你已经被封禁了，不可以发言咯~不好意思啦:P");
			return;
		}

		var sendStr = inputDiv.firstChild.value.trim();
		inputDiv.firstChild.value = "";
		if("" == sendStr){
			return;
		}
		if(255<sendStr.length){
			sendStr = sendStr.substr(0,255);
		}
		if(null == vJid){
			vJid = "";
		}
		var sendVJid = vJid;
		if("" != sendVJid && z$(user_num_id+"_muc_checkbox").checked){
			sendVJid = "";
		}
		if(null == userImagePath){
			userImagePath = "";
		}
		var sendNickName = nickNameInput.value;
		if(10<sendNickName.length){
			sendNickName = sendNickName.substr(0,10);
		}
		
		var j ;
		if ( null == gl.getJid() || undefined == gl.getJid()) {
			var j = vJid.split('@')[0];
		}else{
			var j = gl.getJid().split('@')[0];
		}
		
		var msg='<message xmlns="jabber:client" from="'+j+'@maimaijun.com/'+j+'" to="muc@conference.maimaijun.com" type="groupchat" id="1419836297403"><body xmlns="jabber:client">'+zringhost_formatXML(sendStr)+'</body><x xmlns="jabber:x:event"><composing/></x></message>';

		gl.sendXMLToServer(msg);
		if(null == memberId){
			memberId = "";
		}
		//addMessage(gl.getJid(),sendVJid,userImagePath,sendStr,sendNickName,gl.getIP(),(new Date().getTime()));
		toEnd();
		inputDiv.firstChild.focus();
	}
	function addMessage(jid,vJid,imgPath,content,name,ip,createTime){
		var isEnd = getIsEnd();
		var inMsgDiv = document.createElement("div");
		inMsgDiv.style.cssText = "opacity:0;";
		var nameHtml;
		
		content = zring_checkURL(content);
		for(var i=faceArr.length-1;i>=0;i--){
			content = zringhost_replaceAll(content,faceArr[i],"<img src='"+facePath+(i+1)+".png' width='26' height='26'/>");
			if('&lt;:o)' == faceArr[i]){
				content = zringhost_replaceAll(content,'&amp;lt;:o)',"<img src='"+facePath+(i+1)+".png' width='26' height='26'/>");
				content = zringhost_replaceAll(content,'<:o)',"<img src='"+facePath+(i+1)+".png' width='26' height='26'/>");
			}
		}
		

		var d = new Date(createTime);
		var h = d.getHours();
		var m = d.getMinutes();
		if(10>h){
			h = "0"+h;
		}
		if(10>m){
			m = "0"+m;
		}
		var timeStr = h+":"+m;

		if(null != vJid && "" != vJid){
			var tmpVJid = vJid;
			if(0<tmpVJid.indexOf("@")){
				tmpVJid = tmpVJid.substr(0,tmpVJid.indexOf("@"));
			}
			nameHtml = "<div style='padding-left:10px;font-size:12px;'><a href='http://www.maimaijun.com/user/"+tmpVJid+"' style='color:#336699;text-decoration:none;' target='_blank'>"+name+"</a>&nbsp;<span style='color:#979B9E'>"+timeStr+"</span></div>";
		}else{
			if(null != ip && "" != ip){
				ipArr = ip.split(".");
				ipArr[ipArr.length-1] = "*";
				ip = ipArr.join(".");
				timeStr += "&nbsp;"+ip;
			}
			nameHtml = "<div style='font-size:12px;'><span style='color:#979B9E;padding-left:5px;'>"+name+"</span>&nbsp;<span style='color:#979B9E'>"+timeStr+"</span></div>";
		}

		var contHtml = "<div style='font-size:12px;padding-left:20px;padding-top:10px;padding-bottom:10px;word-wrap: break-word; break-word: break-all;'>"+content+"</div>";

		inMsgDiv.innerHTML = nameHtml+contHtml;
		msgsDiv.appendChild(inMsgDiv);
		var childArr = msgsDiv.childNodes;
		var childLen = childArr.length;
		if(300<childLen){
			for(var i = 100;i>=0;i--){
				msgsDiv.removeChild(childArr[0]);
			}
		}
		inMsgDiv.style.width = (msgsDiv.offsetWidth-20)+"px";
		debug_movieFun(inMsgDiv,"alpha",100);

		if(isEnd){
			toEnd();
		}

	}
	function toEnd(){
		msgDiv.scrollTop = getConsoleHeight()-msgDivHeight;
	}


	function presenceListener(xml){
		var mbId = zring_getChildByName(zring_getChildByName(xml,"x"),"memberId").firstChild.nodeValue;
		if(null != mbId && "" != mbId){
			if(null == memberId || "" == memberId){
				setNickname();
			}
			memberId = mbId;
			showNickname();
		}
	}
	function getNodeValue(node,nodeName){
		try{
			return zring_getChildByName(node,nodeName).firstChild.nodeValue;
		}catch(err){}
		return "";
	}
	function messageListener(xml){
		if(0 == messages){
			msgsDiv.innerHTML = "";
		}
		messages++;
		try{
			var x = zring_getChildByName(xml,"x");
			var from,jid,_from;
			try{
				var s=x.getAttribute('from').split('/');
				from =s[0];
				_from=s[1];
				jid = from.split('@')[0];
			}catch(err){
				var s=xml.getAttribute('from').split('/');
				from =s[0];
				_from=s[1];
				jid = from.split('@')[0];
			}

			var stamp =$(xml).find('delay').attr('stamp');
			var timestamp;
			
			var mr = /^(\d{4})-(\d{1,2})-(\d{1,2})T(\d{1,2}):(\d{1,2}):(\d{1,2}).(\d{3})Z$/.exec(stamp);
			if (mr) {
			    var d = new Date(parseInt(mr[1], 10),
			        parseInt(mr[2], 10)-1,
			        parseInt(mr[3], 10),
			        parseInt(mr[4], 10),
			        parseInt(mr[5], 10),
			        parseInt(mr[6], 10));
			        timestamp = d.getTime()+8*3600*1000;
			} else {
			   timestamp = new Date().getTime();
			}
			var vName = jid;
			if (jid == 'muc') {
				jid=vNickName;
				vName=_from;
			}

			addMessage(jid,vName,getNodeValue(x,"imgPath"),getNodeValue(xml,"body"),vName,getNodeValue(x,"ip"),timestamp);
		}catch(err){
			//alert(err);
		}
	}

	function connStatus(status,xml){
		if(1 == status){
			messages = 0;
			gl.sendXMLToServer('<presence><status>Available</status><priority>1</priority></presence>');
			try{
			//<iq from='b0851f1f@maimaijun.com/b0851f1f' to='conference.maimaijun.com' type='get' xmlns='jabber:client' id='5:sendIQ'>
			//<query xmlns='http://jabber.org/protocol/disco#info'/></iq>
			//<presence xmlns='jabber:client'/>

			//iq = new IQ("get","jabber:iq:mucAnonyRoom");
			//iq.setTo("muc@" + mucName+".maimaijun.com");
			//iq.setQueryAttribute("actionType","getRoomIndex");
			//iq.addItem('<item><customerIndex>'+customerIndex+'</customerIndex></item>');
			//gl.sendXMLToServer(iq.getXML(),iqResult,0,GET_ROOMINDEX);
			
			//<body xmlns="http://jabber.org/protocol/httpbind" sid="59e3c267" rid="106">
			//<iq type="get" id="q6bn8kz2_2" to="conference.maimaijun.com"><query xmlns="jabber:iq:mucAnonyRoom" actionType="getRoomIndex">
			//<item><customerIndex>0</customerIndex></item></query></iq></body>

			iq = new IQ("get","http://jabber.org/protocol/disco#info");
			iq.setTo(mucName+".maimaijun.com");
			iq.addItem('<presence xmlns="jabber:client" />');
			gl.sendXMLToServer(iq.getXML());

			//<body rid='1576529361' xmlns='http://jabber.org/protocol/httpbind' sid='b0851f1f'>
			//<presence from='b0851f1f@maimaijun.com/b0851f1f' to='muc@conference.maimaijun.com/b0851f1f' xmlns='jabber:client'>
			//<x xmlns='http://jabber.org/protocol/muc'/></presence></body>

			var from = xml.getAttribute("to");
			
			var from_id;
			if(isLogin){
				from_id=vJid.split('@')[0];
			}else{
				from_id = xml.getAttribute("to").split('/')[1];
			}
			
			var myxml = '<presence from="'+from+'" to="muc@conference.maimaijun.com/'+from_id+'" xmlns="jabber:client"><x xmlns="http://jabber.org/protocol/muc"/></presence>';

			gl.sendXMLToServer(myxml);

			}catch(err){
				//alert(err);
			}
		}else if(0 == status){
			messages = 0;
			isOnline = false;
		}
	}
	function iqResult(res,send,cs){
		if(cs == GET_ROOMINDEX){
			try{
				loginTime = new Date().getTime();
					
				var tmpItem = zring_getChildByName(zring_getChildByName(res,"query"),"item");
				confIndex = zring_getChildByName(tmpItem,"confIndex").firstChild.nodeValue;
				confName = zring_getChildByName(tmpItem,"confName").firstChild.nodeValue;

				getOnlineUsers();
					
				setNickname();
				
				isOnline = true;
			}catch(err){
				//alert(err);
			}
		}else if(cs == GET_ONLINEUSERS){
			try{
				users = zring_getChildByName(zring_getChildByName(zring_getChildByName(res,"query"),"item"),"onlineUsers").firstChild.nodeValue;
				//onlineUserSpan.innerHTML = users+"人在线";
			}catch(err){
				//alert(err);
			}
		}
	}
	function getOnlineUsers(){
		var iq = new IQ("get","jabber:iq:mucAnonyRoom");
		iq.setTo(mucName+".maimaijun.com");
		iq.setQueryAttribute("actionType","getOnlineusers");
		iq.addItem('<item><roomIndex>'+confIndex+'</roomIndex></item>');
		gl.sendXMLToServer(iq.getXML(),iqResult,0,GET_ONLINEUSERS);
	}
	function setNickname(){
		var sendNickName = nickName;
		if(null != memberId && "" != memberId){
			sendNickName += memberId
		}
		var pres = "<presence xmlns='jabber:client' type='available' to='"+mucName+".maimaijun.com"+"'><priority>1</priority><x xmlns='jabber:x:mucUser' type='available'><confType>anonymous</confType><confIndex>"+confIndex+"</confIndex><mainNick>"+sendNickName+"</mainNick>"+((0 != messages)?"<reconnect>1</reconnect>":"")+"</x></presence>";
		gl.sendXMLToServer(pres);
	}

	JsMucChat.prototype.setDebugFun = function(fun){
		gl.setDebugFun(fun);
	}
	JsMucChat.prototype.setConnectListener = function(fun){
		connectListenerFun = fun;
	}
}
