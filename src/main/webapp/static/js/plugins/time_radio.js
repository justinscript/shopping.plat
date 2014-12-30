(function(){
	var z$=function(obj){return typeof(obj)=="string"?document.getElementById(obj):obj};
	var appStr=navigator.userAgent.toLowerCase();
	var browser={
		msie:/msie/.test(appStr)&&!/opera/.test(appStr),
		mozilla:/mozilla/.test(appStr)&&!/(compatible|webkit)/.test(appStr),
		safari:/webkit/.test(appStr),
		opera:/opera/.test(appStr),
		firefox:/firefox/.test(appStr)
	}
	var time_radio_url_path = "https://www.labi.com/image/";

	function time_radio_get_html(width,num,id){

		/*var col = "#C3C3C3";
		if(1 == num || 2 == num)col = "#6598CD";*/
		var col = "#6598CD";
		var div_str = '<div><div style="position:absolute;top:'+(num*25+8)+'px;font-size:9pt;font-family:tohuma,Arial;font-weight: bold;width:15px;color:'+col+';" align="right">'+(num*6)+'</div><div style="width:'+width+'px;left:20px;position:absolute;top:'+(num*25)+'px;"><table width="100%" height="22" border="0" cellspacing="0" cellpadding="0" id="list_'+id+'_'+num+'"><tr>';
		for(var i=0;i<=72;i++){
			var border_str = "border-bottom: 1px solid "+col+";font-size:1pt;";
			if(72 == i)border_str = "font-size:1pt;";
			var bgCol = " style='"+border_str+"'";
			if(!(i%2)){
				//if(1 == num || 2 == num){
					var img_name = "time_x3_1_5.jpg";
					if(i%12)img_name = "time_x4_1_2.jpg";
				/*}else{
					var img_name = "time_x1_1_5.jpg";
					if(i%12)img_name = "time_x2_1_3.jpg";
				}*/
				
				bgCol = " style='background-image: url("+time_radio_url_path+img_name+");background-repeat: no-repeat;background-position: left bottom;font-size:1pt;"+border_str+"'";
			}
			div_str += '<td'+bgCol+' type_i="'+i+'" num="'+num+'">'+(browser.msie?"&nbsp;":"")+'</td>';
		}
		div_str += '</tr></table></div><div style="position:absolute;top:'+(num*25+8)+'px;font-size:9pt;font-family:tohuma,Arial;font-weight: bold;width:15px;color:'+col+';left:'+(width+20)+'px;" align="left">'+((num*6)+6)+'</div></div>';
		return div_str;
	}


	function time_radio(id,w,ok_fun){
		if(null == w)w = 500;
		var o = z$(id);
		if(!o)alert("没有找到对象"+id);

		var key_num = 0;
		var key_time = 0;
		var key_find;

		time_radio_global_val[id] = new Object();
		time_radio_global_val[id].hour = 0;
		time_radio_global_val[id].o = o;
		time_radio_global_val[id].ok_fun = ok_fun;

		var div_str = '<div style="position:absolute;"><div style="position:absolute;left:10px;top:5px;">'+time_radio_get_html((w-60),0,id)+time_radio_get_html((w-60),1,id)+time_radio_get_html((w-60),2,id)+time_radio_get_html((w-60),3,id)+'</div><div style="position:absolute"><div style="position:absolute;left:10px;top:0px;z-index:1000;background-color:#ff0000;filter:alpha(opacity=0);opacity:0;width:'+(w-20)+'px;height:112px;" id="'+id+'_radio_listener"></div><input type="text" id="'+id+'_key_listener" style="width:1px;height:1px;filter:alpha(opacity=0);opacity:0;"/></div></div><div style="width:'+w+'px;height:112px;"></div>';
		o.innerHTML = div_str;
		z$(id+'_radio_listener').innerHTML = o.firstChild.firstChild.innerHTML;

		var div = document.createElement("div");

		div.style.cssText = "position:absolute;width:0px;height:20px;border-right:2px solid #FF6503;left:20px;top:10px;";
		div.innerHTML = '<div id="'+id+'_radio_hand"></div>';

		var div2 = document.createElement("div");
		div2.style.cssText = "left:-3px;top:25px;border:1px solid #FF6503;position:absolute;";
		div2.innerHTML = '<div id="'+id+'_radio_time" align="center" style="font-size:9pt;font-family:tohuma,Arial;line-height:26px;font-weight: bold;width:46px;height:26px;background-color:#FFFFCB;cursor: default;">0:00</div>';

		var div3 = document.createElement("div");
		div3.style.cssText = "position:absolute;";
		div3.innerHTML = '<div id="'+id+'_radio_ok_time" align="center" style="font-size:9pt;font-family:tohuma,Arial;background-color:#CC0000;width:38px;height:18px;color:#fff;line-height:18px;display:none;">0:00</div>';

		var div4 = document.createElement("div");
		div4.style.cssText = "position:absolute;border-right:2px solid #CC0000;width:0px;height:7px;display:none;";
		div4.innerHTML = '<div id="'+id+'_radio_ok_heand"></div>';
		
		

		//div.innerHTML = "<div style='position:absolute;left:36px;width:2px;height:22px;border-right:2px solid #ff6503;'></div><div style='width:1px;height:22px;'></div><div style='width:36px;height:22px;border:2px solid #FF6503;font-size:9pt;line-height:22px;font-weight: bold;' align='center' id='"+id+"_radio_hand'>8:20</div>";
		


		var child_nodes = o.firstChild.firstChild.childNodes;
		//var td_width = (w-60)/72;
		//var td_height = 30;
		for(var i=child_nodes.length-1;i>=0;i--){
			time_radio_init_tds(child_nodes[i].getElementsByTagName("td"),z$('list_'+id+"_"+i).parentNode,(i*6)+6,id,i);
		}

		child_nodes = z$(id+"_radio_listener").childNodes;

		for(var i=child_nodes.length-1;i>=0;i--){
			time_radio_init_td_listener(child_nodes[i].getElementsByTagName("td"),id);
		}


		o.firstChild.firstChild.appendChild(div);
		o.firstChild.firstChild.appendChild(div3);
		o.firstChild.firstChild.appendChild(div4);

		o.firstChild.firstChild.appendChild(div2);
		z$(id+"_key_listener").onkeyup = function(e){
			if(null == e)e = window.event;
			if(13 == e.keyCode){
				time_radio_ok_click(id);
				//time_radio_show_mask(id);
			}else if(!key_find){
				var c = this.value;
				this.value = "";

				if(!isNaN(c)){
					if(500>new Date().getTime()-key_time){
						if(24>=parseInt(key_num+""+c)){
							setTime(key_num+""+c+":00",true);
							return;
						}
					}
					key_num = c;
					key_time = new Date().getTime();
					setTime(c+":00",true);
				}

			}
		}
		z$(id+"_key_listener").onkeydown = function(e){
			key_find = false;
			if(null == e)e = window.event;
			//alert(String.fromCharCode(e.keyCode));

			if(39 != e.keyCode && 68 != e.keyCode && 37 != e.keyCode && 65 != e.keyCode && 38 != e.keyCode && 87 != e.keyCode && 40 != e.keyCode && 83 != e.keyCode){
				if(13 != e.keyCode){
					var c = String.fromCharCode(e.keyCode);
					if(!isNaN(c)){
						if(500>new Date().getTime()-key_time){
							if(24>=parseInt(key_num+""+c)){
								setTime(key_num+""+c+":00",true);
								key_find = true;
								return;
							}
						}
						key_num = c;
						key_time = new Date().getTime();
						setTime(c+":00",true);
						key_find = true;
					}
				}
				return;
			}
			time_radio_global_val[id].mousemove = false;
			try{
				if(null == time_radio_global_val[id].curr_o){
					time_radio_global_val[id].curr_o = child_nodes[0].getElementsByTagName("td")[0];
					time_radio_global_val[id].curr_i = 0;
					time_radio_global_val[id].curr_num = 0;
				}
				var arr = child_nodes[time_radio_global_val[id].curr_num].getElementsByTagName("td");
				for(var i=arr.length-1;i>=0;i--){
					if(arr[i] == time_radio_global_val[id].curr_o){
						var addNum = 0;
						if(39 == e.keyCode || 68 == e.keyCode){
							addNum = 1;
							if(time_radio_global_val[id].curr_i%2)addNum = 2;
						}else if(37 == e.keyCode || 65 == e.keyCode){
							addNum = -1;
							if(!(time_radio_global_val[id].curr_i%2))addNum = -2;
						}else if(38 == e.keyCode || 87 == e.keyCode){
							//上
							time_radio_global_val[id].curr_num--;
							if(0>time_radio_global_val[id].curr_num){
								time_radio_global_val[id].curr_num = 3;
							}
							arr = child_nodes[time_radio_global_val[id].curr_num].getElementsByTagName("td");
						}else if(40 == e.keyCode || 83 == e.keyCode){
							time_radio_global_val[id].curr_num++;
							if(3<time_radio_global_val[id].curr_num){
								time_radio_global_val[id].curr_num = 0;
							}
							arr = child_nodes[time_radio_global_val[id].curr_num].getElementsByTagName("td");
						}


						var to_num = i+addNum;

						if(to_num>=arr.length){
							to_num = 0;
							time_radio_global_val[id].curr_num++;
							if(3<time_radio_global_val[id].curr_num){
								time_radio_global_val[id].curr_num = 0;
							}
							arr = child_nodes[time_radio_global_val[id].curr_num].getElementsByTagName("td");
						}else if(to_num<0){
							time_radio_global_val[id].curr_num--;
							if(0>time_radio_global_val[id].curr_num){
								time_radio_global_val[id].curr_num = 3;
							}
							arr = child_nodes[time_radio_global_val[id].curr_num].getElementsByTagName("td");
							to_num = arr.length-1;
						}

						time_radio_move_to(id,arr[to_num].getAttribute("type_i"),arr[to_num],arr[to_num].getAttribute("num"));
						key_find = true;

						break;
					}
				}
			}catch(err){alert(err)}
		}
		/*o.firstChild.firstChild.style.backgroundColor = "#ff0000";
		o.firstChild.firstChild.style.width = "100px";
		o.firstChild.firstChild.style.height = "100px";*/
		var time_out;
		z$(id+'_radio_listener').onmouseout = function(a){
			time_out = setTimeout(outFunction,100);
		}
		z$(id+'_radio_listener').onmouseover = function(a){
			clearTimeout(time_out);
		}
		function outFunction(){
			if("" == z$(id+"_radio_ok_time").style.display){
				setTime(z$(id+"_radio_ok_time").innerHTML,true);
			}
		}
		z$(id+'_radio_listener').onmousemove = function(a){

			try{
				time_radio_global_val[id].mousemove = true;
				/*z$(id+"_key_listener").focus();
				if(!a)a=window.event;
				if(document.compatMode == "CSS1Compat"){
					if(!a.pageX)var tx=a.clientX;
					else var tx = a.pageX-zring_getBody().scrollLeft;
					if(!a.pageY)var ty=a.clientY;
					else var ty = a.pageY-zring_getBody().scrollTop;
				}else{
					if(!a.pageX)a.pageX=zring_getBody().scrollLeft + a.clientX;
					if(!a.pageY)a.pageY=zring_getBody().scrollTop + a.clientY;
					var tx=a.pageX,ty=a.pageY;
				}

				var xy = zring_get_obj_xy(this);

				//z$('debug').value = (tx-xy.x)+" "+(ty-xy.y);
				var to_x = tx-xy.x-20;

				var num = (to_x>0?(Math.floor(to_x/td_width)):0);



				var to_y = ty-xy.y;
				var num_i = (to_y>0?Math.floor(to_y/td_height):0);
				var arr = child_nodes[num_i].getElementsByTagName("td");


				if(num>=0 && num<arr.length){
					time_radio_move_to(id,arr[num].getAttribute('type_i'),arr[num],arr[num].getAttribute('num'));
				}
				//time_radio_move_to(id,this.getAttribute('type_i'),this,this.getAttribute('num'));*/

			}catch(err){}
		}
		z$(id+'_radio_listener').onmouseup = function(){
			//time_radio_show_mask(id);
			time_radio_ok_click(id);
		}



		/*z$(id+'_radio_time').onmouseover = function(){
			if(18 != time_radio_global_val[id].hour && time_radio_global_val[id].mousemove){
				this.style.display = "none";
			}
		}
		z$(id+'_radio_time').onmouseout = function(){
			this.style.display = "";
		}*/

		time_radio.prototype.focus = function(){
			z$(id+"_key_listener").focus();
		}


		time_radio.prototype.setTime = function(time,isMoveOnly){
			setTime(time,isMoveOnly);
		}

		function setTime(time,isMoveOnly){
			try{
				var time_arr = time.split(":");
				var num = Math.floor(time_arr[0]/6);
				var arr = child_nodes[num].getElementsByTagName("td");
				var to_num = ((time_arr[0]-(num*6))*12)+(Math.floor(time_arr[1]/10)*2);


				time_radio_move_to(id,arr[to_num].getAttribute("type_i"),arr[to_num],arr[to_num].getAttribute("num"));
				if(!isMoveOnly){
					time_radio_ok_click(id);
				}
			}catch(err){}
		}

		/*time_radio.prototype.focus(){
			z$(id+"_key_listener").focus();
		}*/
		
	}


	function zring_get_obj_xy(o){
		var x = y = 0;
		while("body" != o.nodeName.toLowerCase()){
			x += o.offsetLeft;
			y += o.offsetTop;
			o = o.parentNode;
		}
		//alert(x);

		return {x:x,y:y};
	}

	function zring_getBody(){
		if(document.compatMode == "CSS1Compat"){
			return document.documentElement;
		}else{
			return document.body;
		}
	}

	function getOffset(evt){
	  var target = evt.target;
	  if (target.offsetLeft == undefined){
	    target = target.parentNode;
	  }
	  var pageCoord = getPageCoord(target);
	  var eventCoord ={
	    x: window.pageXOffset + evt.clientX,
	    y: window.pageYOffset + evt.clientY
	  };
	  var offset ={
	    offsetX: eventCoord.x - pageCoord.x,
	    offsetY: eventCoord.y - pageCoord.y
	  };
	  return offset;
	}

	function getPageCoord(element){
	  var coord = {x: 0, y: 0};
	  while (element)
	  {
	    coord.x += element.offsetLeft;
	    coord.y += element.offsetTop;
	    element = element.offsetParent;
	  }
	  return coord;
	}

	function time_radio_hs_keyup(e,id){
		if(13 == e.keyCode){
			time_radio_ok_click(id);
		}else if(67 == e.keyCode){
			time_radio_hidden_mask(id);
		}
	}

	function time_radio_ok_click(id){
		//alert(z$(id+"_hour").value+":"+z$(id+"_second").value);

		z$(id+"_radio_ok_time").style.display = "";
		z$(id+"_radio_ok_time").innerHTML = z$(id+"_radio_time").innerHTML;
		z$(id+"_radio_ok_time").parentNode.style.left = (z$(id+"_radio_hand").parentNode.offsetLeft-z$(id+"_radio_ok_time").offsetWidth/2)+"px";
		z$(id+"_radio_ok_time").parentNode.style.top = (z$(id+"_radio_time").parentNode.offsetTop-33)+"px";

		z$(id+"_radio_ok_heand").parentNode.style.display = "";
		z$(id+"_radio_ok_heand").parentNode.style.left = z$(id+"_radio_hand").parentNode.offsetLeft+"px";
		z$(id+"_radio_ok_heand").parentNode.style.top = (z$(id+"_radio_ok_time").parentNode.offsetTop+z$(id+"_radio_ok_time").offsetHeight)+"px";

		if(null != time_radio_global_val[id].ok_fun){
			try{
				time_radio_global_val[id].ok_fun(z$(id+"_radio_time").innerHTML);
			}catch(err){}
		}
	}


	/*function time_radio_getSelectionText() {
		if(window.getSelection) {
			return window.getSelection().toString();
		} else if(document.selection && document.selection.createRange) {
			return document.selection.createRange().text;
		}
		return '';
	}*/



	function time_radio_key_down(e,type,o){
		if(9 == e.keyCode || 8 == e.keyCode || 46 == e.keyCode || 39 == e.keyCode || 37 == e.keyCode)return true;
		if(38 == e.keyCode || 87 == e.keyCode || 40 == e.keyCode || 83 == e.keyCode){
			if(0 == type){
				if(38 == e.keyCode|| 87 == e.keyCode){
					var val = parseInt(o.value)+1;
					if(val>24)val = 0;
					o.value = val;
				}else{
					var val = parseInt(o.value)-1;
					if(val<0)val = 24;
					o.value = val;
				}
			}else{
				if(38 == e.keyCode|| 87 == e.keyCode){
					var val = parseInt(o.value)+1;
					if(val>60)val = 0;
					o.value = val;
				}else{
					var val = parseInt(o.value)-1;
					if(val<0)val = 60;
					o.value = val;
				}
			}
		}

	}

	function time_radio_format_hour(o){
		if(isNaN(o.value) || "" == o.value){
			o.value = "0";
		}else{
			if(24<parseInt(o.value)){
				o.value = "0";
			}
		}
	}
	function time_radio_format_second(o){
		if(isNaN(o.value) || "" == o.value){
			o.value = "00";
		}else{
			var i = parseInt(o.value);
			if(60<i){
				o.value = "00";
			}else if(i<10){
				o.value = "0"+i;
			}else{
				o.value = i;
			}
		}
	}
	function time_radio_init_td_listener(tds,id){
		for(var i=tds.length-1;i>=0;i--){
		tds[i].onmouseover = function(){
				z$(id+"_key_listener").focus();
				if(time_radio_global_val[id].mousemove){
					time_radio_move_to(id,this.getAttribute('type_i'),this,this.getAttribute('num'));
				}
			}
		}
	}
	function time_radio_init_tds(tds,o,endNum,id,i){
		//var col_num = "#c3c3c3";
		//if(i == 1 || i == 2){
			var col_num = "#6598CD";
		//}
		endNum--;
		for(var i=tds.length-1;i>=0;i--){
			if(!(i%2) && !(i%12) && 0 != i && tds.length-1 != i){
				var div = document.createElement("div");
				div.innerHTML = (endNum--);
				with(div.style){
					position = "absolute";
					left = tds[i].offsetLeft + "px";
					top = "0px";
					fontSize = "9pt";
					color = col_num;
					cursor = "default";
				}
				o.appendChild(div);

			}
			/*tds[i].onmouseover = function(){

				z$(id+"_key_listener").focus();
				if(time_radio_global_val[id].mousemove){
					time_radio_move_to(id,this.getAttribute('type_i'),this,this.getAttribute('num'));
				}

				
			}*/

		}
	}

	function time_radio_move_to(id,type_i,o,num){
		var obj = z$(id+"_radio_hand").parentNode;
		var obj2 = z$(id+"_radio_time").parentNode;

		var l = !(type_i%2)?o.offsetLeft+20:o.offsetLeft+o.offsetWidth+19;

		obj.style.left = l+"px";
		obj2.style.left = (l-23)+"px";
		obj.style.top = (num*25)+10+"px";
		obj2.style.top = ((num*25)+30)+"px";

		/*chat_movieFun(obj,"left",l);
		chat_movieFun(obj2,"left",l);
		chat_movieFun(obj,"top",(num*25));
		chat_movieFun(obj2,"top",(num*25)+20);*/

		time_radio_global_val[id].hour = num*6;
		time_radio_global_val[id].curr_o = o;
		time_radio_global_val[id].curr_i = type_i;
		time_radio_global_val[id].curr_num = num;
		

		time_radio_get_time(id,type_i);
	}

	var time_radio_global_val = {};
	function time_radio_get_time(id,num){
		var g_h = time_radio_global_val[id].hour;
		minute = Math.ceil(num/2)*10;
		second = minute%60;
		second_str = second<10?"0"+second:second;
		var hour = Math.floor(g_h+minute/60);
		if(10>hour)hour = "0"+hour;
		z$(id+'_radio_time').innerHTML = hour+":"+second_str;
	}
	
	function init(id, width, fn) {
		var tr = new time_radio(id, width, fn);
		tr.focus();
		return tr;
	}

	NS_timeRadio = {
		init: init,
		setPath: function(url){
			time_radio_url_path = url;
		}
	}
})();