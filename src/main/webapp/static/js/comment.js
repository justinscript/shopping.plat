(function($){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nNotice = i18n.notice;
		var ResultCodeSuccess = L.RESULT_CODE.success,
			submitTxtContentHuifu = "",	//回复输入框最后提交给服务器的过滤过的输入内容
			pageIndex = 0,
			sumWriteLength = 150,	//评论输入输入字的总数
			sumHuifuWriteLength = 150,	//回复输入字的总数
			submitTxtContent = "",	//评论输入框最后提交给服务器的过滤过的输入内容
			chidStr = "",
			totalChildStr = "",
			digui = 1,
			sortType = "score",
			chgN = 1,
			avg = 6,	//一页显示6个感兴趣的新闻
			sourcePhone = {"1":"iPhone","2":"Android","3":"WPhone","5":"ipad"};
		
	function init(commonid) {

		chouti.showPublishWindow("#pubTabZixun");		//点击“分享新发现”按钮后，弹出发布框
		chouti.Init();
		chouti.vote('');	//推荐操作
		chouti.cancelVote();	//取消推荐操作
		chouti.addCollect();	//收藏操作
		chouti.removeCollect();	//收藏操作
		chouti.clickClear();	//发布框中，点击文本框后清空里面的默认内容	
		
		showYaoyanState();	//如果是谣言类型，显示出其状态	
		
		//主要针对IE下不能有效监听输入框的问题
		$("#txt-comment").focus()
						 .val(" ")
						 .val("")
						 .blur();
		
		//点击发布评论按钮
		$("#pub-btn4").click(function(){		
			publish();		
		})
		
		//表示某一条评论的ID,如果为空则值为0,该变量是为了显示黄色提示框，点击显示全部评论
		if(commonid == "") {
			commonid = 0;
		}
		
		showComments(sortType, commonid);	//显示出所有评论
		
		showInterestNews();	//显示该用户可能感兴趣的新闻
		
		//点击最热tab
		$("#comment-hot-tab").click(function(){
			
			//评论数为0则不触发请求
			if($("#commentSum").html() == 0) {
				return;
			}
			$(this).addClass("w-active")
					.siblings(".tb").removeClass("w-active");
			showComments("score", 0);
			sortType = "score";
		})
		//点击最新tab
		$("#comment-new-tab").click(function(){
			
			if($("#commentSum").html() == 0) {
				return;
			}
			$(this).addClass("w-active")
					.siblings(".tb").removeClass("w-active");
			showComments("time", 0);
			sortType = "time";
		})
		//监听评论输入框字数变化

		listenButton();
		
		//评论按钮变为无效
		setButtonDisabled(4);
		
		//评论输入框ctrl+回车事件
		$("#txt-comment").keydown(function(event){
			
			if(event.ctrlKey && event.keyCode==13) {
				publish();
			}
		})
		
		chouti.shareweibo('');	//分享操作
		
		//chouti.playVido(); //展开视频
		
	}
	//回复输入框ctrl+回车事件
	function bindHuiFuEnter() {
		
		$(".txt-huifu").keydown(function(event){
			
			if(event.ctrlKey && event.keyCode==13) {
				$("#pub-btn5").click();
			}
		})
	}
	
	//如果是谣言类型，显示出其状态
	function showYaoyanState() {
		
		var type = $("#hidsubjectid").val();
		
		if(type == "3") {
			
			$(".yaoyan-sel-area").show();
			
			//谣言输入框置灰
			$("#txt-comment").attr("disabled", true)
							 .css("background-color", "#ece9d8");
			oprateYaoyan();
		} else {
			
			$("#txt-comment").attr("disabled", false)
			 				 .css("background-color", "#fff");
			
			$("#lab-comment").html("发布新评论...");	
			setButtonAbled(4);	//按钮有效
		}
	}
	//谣言下操作
	function oprateYaoyan() {
		
		$(".yaoyan-sel-area :radio").click(function(){
			
			$("#txt-comment").val("");
			$("#txt-comment").attr("disabled", false)
							 .css("background-color", "#fff");
			
			setButtonDisabled(4);	//按钮无效
			
			if($(this).val() == 1) {
				$("#lab-comment").html("我相信...");
			} else {
				$("#lab-comment").html("我质疑...");
			}
		})
	}
	//监听评论输入框事件
	function listenButton() {
				
		$.input("txt-comment",inputState);
	}
	//只针对回复输入框
	function inputStateHuifu(){
		
		var duanzi = $.trim($(".txt-huifu").val());
		var obj = ".txt-huifu";

		if(duanzi == ""){					//内容为空按钮无效
			setButtonDisabled(5);
			$("#showLength5").html(sumHuifuWriteLength);
			return;
			
		}else{	//内容不为空按钮有效	
			setButtonAbled(5);
			duanzi = checkCharCodeAt(duanzi, obj);//把全角转换成半角，只对全角下的空格做限制	
			
			countHuifuLength(duanzi, 5);	//(下面回复输入框给出序号为5)	,计算输入字符的长度
					
		}
	}

	function inputState(){
		
		var duanzi = $.trim($("#txt-comment").val());
		var obj = "#txt-comment";
		//var obj = txtobj;
		if(duanzi == ""){					//内容为空按钮无效
			
			setButtonDisabled(4);
			$("#showLength4").html(sumWriteLength);
			return;
			
		}else{	//内容不为空按钮有效	
			
			setButtonAbled(4);
			
			duanzi = checkCharCodeAt(duanzi, obj);//把全角转换成半角		
			
			countDuanziLength(duanzi, 4);	//(上面发布评论输入框给出序号为4)	,计算输入字符的长度
					
		}
	}
	//把全角转换成半角,参数1表示内容，参数2表示文本输入框ID
	function  checkCharCodeAt(str, obj){
		
		str = str.split("");
		
		var TotalStr = "";

		for(var i=0;i <str.length;i++){
			
			if(str[i].charCodeAt(0) == 32){
				TotalStr += " ";
			} else {
				TotalStr += str[i];
			}
		}
		return TotalStr;
		
	}
	/*计算回复输入框输入字符的长度
	 * 参数1表示输入的内容，参数2表示所处类别号
	 * */
	function countHuifuLength(str, n) {
		
		var str = clearBeforeNull(str);	//清除头尾空格
		str = clearMidNull(str);		//字符中间有多个空格时为1个空格
		//ret = str.replace(/[^x00-xff]/g,"a").length;	//一个字符为一个字，暂时定，以后改动
		
		//计算长度
		var len = 0;
        for ( var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1   
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                        len++;
                } else {
                        len += 2;
                }
        }
        var result = parseInt(len /2 );
        var mod = len%2;
        if (mod != 0) {
                result+=1;
        }
        
        submitTxtContentHuifu = str;	//最后把滤过的输入内容赋值给全局变量,最好付给个文本控件
		
		var haveLength = sumHuifuWriteLength - result;
		
		$(".child-txt-area #showLength"+n).html(haveLength);
		
		//显示超出字数   错误提示
		if(haveLength < 0) {
			$(".child-txt-area #moreLength"+n).html(-haveLength);	//超出个数
			$(".child-txt-area #comment-buttonpane1 .write-error").show();
			
			$(".child-txt-area #showLength"+n).html(0);	//还可以输入显示为0个
			$(".child-txt-area #comment-buttonpane1 .write-length").hide();
			
		} else {
			$(".child-txt-area #comment-buttonpane1 .write-error").hide();
			$(".child-txt-area #comment-buttonpane1 .write-length").show();
			
		}
							
	}
	/*计算段子及所有输入框输入字符的长度
	 * 参数1表示输入的内容，参数2表示所处类别号
	 * */
	function countDuanziLength(str, n) {
		
		var str = clearBeforeNull(str);	//清除头尾空格
		str = clearMidNull(str);		//字符中间有多个空格时为1个空格
		//ret = str.replace(/[^x00-xff]/g,"a").length;	//一个字符为一个字，暂时定，以后改动
		
		//计算长度
		var len = 0;
        for ( var i = 0; i < str.length; i++) {
                var c = str.charCodeAt(i);
                //单字节加1   
                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                        len++;
                } else {
                        	len += 2;
                }
        }
        	var result = parseInt(len /2 );
        	var mod = len%2;
        	if (mod != 0) {
                result+=1;
        	}

		submitTxtContent = str;	//最后把滤过的输入内容赋值给全局变量,最好付给个文本控件
		
		var haveLength = sumWriteLength - result;
		
		$("#showLength"+n).html(haveLength);

		//显示超出字数   错误提示
		if(haveLength < 0) {
			$("#publish-content-comment #moreLength"+n).html(-haveLength);	//超出个数
			$("#publish-content-comment #comment-buttonpane1 .write-error").show();
			
			$("#publish-content-comment #showLength"+n).html(0);	//还可以输入显示为0个
			$("#publish-content-comment #comment-buttonpane1 .write-length").hide();
			
		} else {
			$("#publish-content-comment #comment-buttonpane1 .write-error").hide();
			$("#publish-content-comment #comment-buttonpane1 .write-length").show();
			
		}
							
	}
	
	//顶或踩
	function oprateDigg() {
		
		$("a.ding, a.cai").click(function(){
			
			var $this = $(this);
			
			$this.removeClass("hover");
			
			if($this.attr("class") == "ding") {
				var vote = 1;
			} else {
				var vote = -1;
			}
			
			var linkId = $(".part2 i").html();
			var jid = $("#hidjid").val();
			var id = $this.siblings("input:hidden").val();
			
			var submitUrl = "/comments/vote";			
			
			
			var options = {
					
					url : submitUrl,
					type:"POST",
					data:G.param({linkId: linkId, id:id, jid:jid, vote:vote}),
					success :  function(info){																		

								if(info.code == ResultCodeSuccess) {		
									
									//改变成已经点击过的样式且不能点击
									
									if(vote == 1) {	//顶
										
										$($this).siblings(".ding-num").html("["+info.data+"]");//显示投票数
										$($this).css({"cursor":"default", "color":"#989898"})
												.html("已顶")
												.unbind()
												.siblings(".cai").unbind();
										$($this).siblings(".cai").css({"cursor":"default", "color":"#989898"})
												
									} else {	//踩
										$($this).siblings(".cai-num").html("["+info.data+"]");//显示投票数
										$($this).css({"cursor":"default", "color":"#989898"})
												.html("已踩")
												.unbind()
												.siblings(".ding").unbind();
										$($this).siblings(".ding").css({"cursor":"default", "color":"#989898"})
									}		
									//执行登录前点击的的提交动作后的提示信息
									chouti.executeBeforOprate(true);
									
								} else {														
									
									//投票失败，请重试
										//没有登录
										if(!chouti.reponseNoLogin(info.code, info.message, "投票成功")) {
											return false;
										}
										
										//执行登录前的提交动作成功后,提示成功信息
										var aj = $("#isAjax").val();
										if(aj == 1) {
											
											var msg = $("#login_ajaxInfo").val();
											
											L.showTopTips(L.TIPS_TYPE.error, info.message);//提示失败信息
											
											$("#isAjax").val(0);
											$("#login_ajaxInfo").val("");//提示信息
											$("#isAjax").data("ajax",null);
											window.location.reload();
										} else {
											L.showTopTips(L.TIPS_TYPE.error, info.message);	
										}																											
										
										return false;
																
								}
								
						}
				};	
			
			//把要提交的动作保存下来
			$("#isAjax").data("ajax", options);
			
			L.ajax(options);
			
		})		
		
	}
	
	
	
	//显示所有评论
	function showComments(sort, commonid) {

		//加载评论时显示loading		
		$("#loading-msg-box-comment").css({"display": "inline"});	
		
		var linkId = $(".part2 i").html();
		var sortType= sort;//显示方试，最热或者最新
		var submitUrl = "/comments";
		var itemid = 0;
		
		L.ajax({
			url : submitUrl,
			type:"POST",
			data:G.param({linkId: linkId,sortType: sortType, id:itemid}),
			success :  function(info){																	

						if(info.code == ResultCodeSuccess) {
							
							var dataItems = parseInt(info.data.items);
							$("#commentSum").html(dataItems);//显示评论总数
							$(".discus-a b").html(dataItems);//显示评论总数（最上面推荐旁边的评论总数）
							
							//没有记录则显示评论为空的区域，有记录则隐藏该区域
							if(dataItems > 0) {
								$("#no-comment-area").hide();
							} else {
								$("#no-comment-area").show();
							}
							loadComments(info);	//加载评论json数据
							
							oprateDigg();	//顶或踩
							chouti.oprateJuBao();	//举报
							
							//点击回复按钮时显示回复输入框
							showHuifuBox();
							
							//从个人页面或者通知页面点击评论跳转到该页时，相应的回复的评论高亮显示
							
							if(commonid != 0) {
								showMsgPanel(commonid);	
							}
							
						} else {													
							
							//加载失败，请重试
							
								L.showTopTips(L.TIPS_TYPE.error, info.message);							
								$("#loading-msg-box-comment").hide();
								return false;														
						}
						
				}
		});			
		
	}
	//加载评论时显示loading
	function showCommentLoading() {		
		
		var info = "正在加载，请稍候...";
		
		var msg = $("<div class='feed_lding' id='loading-msg-box-comment'></div>").html("<span class='icon_lding'></span>"+info);
													
		$("#comment-list li:first").before(msg);
		
		$(msg).show();
	}
	//加载评论页面的json数据
	function loadComments(dataObj) {
			
		var str = "";
		
		var noComments = dataObj.data.noComments;
		
		var data = dataObj.data.dataList;
		var jid = $("#hidjid").val();
		
		for(var i=0;i<data.length;i++) {
			var act = data[i].action;	//该评论是否被删除标识(==2时)
//			if(act == 2) {
//				continue;
//			}
			totalChildStr = "", chidStr = "", digui = 1;
			
			str += "<li class='items'>";			
			
			var createT = data[i].commentTime;
			var content = data[i].content;
			var depth = data[i].depth;
			var downs = data[i].downs;
			var ups = data[i].ups;
			
			var nickImgUrl = data[i].nickImgUrl;
			var nick = data[i].nick;
			var isVote = data[i].isVote;
			var id = data[i].id;
			var jid = data[i].jid;//用户的jid
			var state = data[i].assentText;//相信或者置颖
			
			var deleteResult = data[i].deleteInfo;	//该评论删除原因
			var sourceType = data[i].sourceType;	//手机客户端来源
			var sourceAppUrl = data[i].sourceAppUrl;	//下载地址
			
			var destjid = $("#hidjid").val();
			
				str += "<span class='folder' id='folder-"+id+"'>";
			
				str += "<div class='comment-L'>";
					str += "<a href='#' class='icons zhan-ico'></a>";
					str += "<span class='comment-hen-point hen-line'><a href='/user/"+jid+"/submitted/1'><img src='"+nickImgUrl+"' /></a></span>";
				str += "</div>";
				str += "<div class='comment-R'>";
					str += "<div class='pp'>";
					str += "<a class='name' href='/user/"+jid+"/submitted/1'>"+nick+"</a>";
					
					/*楼主*/
					var author = $(".collect-a").attr("jid");
					
					if(author == jid) {
						str += "<span class='author'>(楼主)</span>";
					}
					
					str += "<span class='into-time'>"+createT+"发布</span>";
					
					if(state == "相信") {
						str += "<span class='yaoyan-state'>"+state+"</span>";
					} else if(state != ""){
						str += "<span class='yaoyan-state' style='color:#CC3300'>"+state+"</span>";
					}
					//手机客户端来源
					if(sourceType != undefined) {
						
						switch(sourceType) {
						
							case 1:
								sourceAppUrl = "/download/model/iphone";
								break;
							case 3:
								sourceAppUrl = "/download/model/wphone";
								break;
							case 5:
								sourceAppUrl = "/download/model/iphone";
								break;
					}
						str += "<span class='into-time s-phone'>来自<a class='name' href='"+sourceAppUrl+"' target='_blank'>"+sourcePhone[sourceType]+"</a></span>";
					}
					
					str += "</div>";
					str += "<div class='p2'>";
					//act==2表示该评论被删除
						if(act != 2) {
							str += content;
						} else {
							str += "<em style='font-style:oblique;color:#B4B4B4'>该评论因  ''"+deleteResult+"'' 被删除</em>";
						}
						
					str += "</div>";
					
					if(!noComments) {
										
					str += "<div class='comment-line'>";
						str += "<div class='comment-state'>";
						
					if(act != 2) {
						if(isVote == "0") {//如果没顶或没踩过
							str += "<a class='ding' href='javascript:;'>顶</a><span class='ding-num'>["+ups+"]</span><a class='cai' href='javascript:;'>踩</a><span class='cai-num'>["+downs+"]</span>";
						} else {
							if(isVote == 1){
								str += "<span class='ding' href='javascript:;'>已顶</span><span class='ding-num'>["+ups+"]</span><span class='cai' href='javascript:;'>踩</span><span class='cai-num'>["+downs+"]</span>";
							} else{
								str += "<span class='ding' href='javascript:;'>顶</span><span class='ding-num'>["+ups+"]</span><span class='cai' href='javascript:;'>已踩</span><span class='cai-num'>["+downs+"]</span>";
							}
						}				
					}
					
					if(destjid != jid) {
 						//添加举报
 							str += "<a class='see-a jubao' href='javascript:;' lang='"+id+"'>举报</a>";
 						}
					
					
	 							//第10层不出现回复按钮
		 						if(depth < 6) {
		 							if(act != 2) {	//==2时该评论被删除，则不显示回复
		 								str += "<a class='see-a huifu-a' href='javascript:;' id='huifuBtn"+id+"'>回复</a>";
		 							}
		 						}
		 					
		 						
		 						
							str += "<input type='hidden' id='hid"+id+"' value='"+id+"' />";
							
						str += "</div>";
					str += "</div>";    
					}
					str += "<div class='child-txt-area'></div>";
				str += "</div>";
				
			str += "</span>";			
			
			//如果存在子节点
			if(data[i].childs) {
				diguiComments(data[i].childs, noComments);
			}

			str += totalChildStr;
			
			str += "</li>";
		}		
		
		$("#comment-list").html(str)
						  .treeview();	//树形化数据
		
		$("#loading-msg-box-comment").hide();//隐藏loading
		
		//只有登录状态下回复才显示
		if(jid == "") {
			$(".huifu-a").hide();
		}		
		
		deleteline();	//清除多余背景树线
		
		commentListHover();	//当鼠标移动到评论内容列表上时，显示背景色	
		
	}
	
	//当鼠标移动到评论内容列表上时，显示背景色
	function commentListHover() {
		
		$("#comment-list span.folder").hover(function(){
			
			$(this).css({"background-color": "#fffeec"});
			
		},function(){
			
			$(this).css("background-color", "#fff");
		})
	}
	
	//清除多余背景树线
	function deleteline() {
		
		var itemobj = $("#comment-list li.items");		
		
		for(var i=0;i<itemobj.length;i++) {
			var sp = $(itemobj[i]).children();
			if(sp.length <= 1) {
				$(itemobj[i]).children("span.folder").css("background", "none");
			}
		}

		$("#comment-list li.items:last").children("div.lastCollapsable-hitarea").css("background-position", "-64px -45px");
		
		$("#comment-list li.last span.folder").css("background", "none");
		
		$("#comment-list li.last").parent("ul").css("background", "none");
		
		$("#comment-list li.items li.lastCollapsable").parent("ul").css("background", "none")
																	.prev("ul").css("background", "url('/images/treeview-default-line.gif') no-repeat scroll 0 -10px transparent");

		$("#comment-list li.items li.last").parent("ul").prev("ul").css("background", "url('/images/treeview-default-line.gif') no-repeat scroll 0 -10px transparent");
		 
		//让最后一个实现加号和减号样式变化
		$("#comment-list li.items:last").children("div.items-hitarea").click(function(){
			if($(this).hasClass("lastExpandable-hitarea")) {
				$(this).css("background-position", "-80px -13px");
			} else {
				$(this).css("background-position", "-64px -45px");
			}
		})
		//点击+-图标，展开下面的内容，滚动条向下滚动一下
		$("#comment-list li.items div.items-hitarea").click(function(){
			$(this).children("ul:first li:first b").focus();
			
		})
	}
	
	//递归显示评论
	function diguiComments(childData, noComments) {
		
		if(childData == null || childData.length <= 0) return;
		
		for(var i=0;i<childData.length;i++) {
						
			var createT = childData[i].commentTime;
			var content = childData[i].content;
			var depth = childData[i].depth;
			var downs = childData[i].downs;
			var ups = childData[i].ups;
			
			var nickImgUrl = childData[i].nickImgUrl;
			var nick = childData[i].nick;
			var isVote = childData[i].isVote;
			var id = childData[i].id;
			var jid = childData[i].jid;
			var act = childData[i].action;	//该评论是否被删除标识(==2时)
			var deleteResult = childData[i].deleteInfo;	//该评论删除原因
			var sourceType = childData[i].sourceType;	//手机客户端来源
			var sourceAppUrl = childData[i].sourceAppUrl;	//下载地址
			var destjid = $("#hidjid").val();
			
				chidStr += "<ul><li>";

				chidStr += "<span class='folder' id='folder-"+id+"'>";	
				chidStr += "<div class='comment-L'>";

					chidStr += "<a href='#' class='icons zhan-ico'></a>";					
					chidStr += "<span class='comment-hen-point hen-line'><a href='/user/"+jid+"/submitted/1'><img src='"+nickImgUrl+"' /></a></span>";
				chidStr += "</div>";
				chidStr += "<div class='comment-R'>";
					chidStr += "<div class='pp'>";
					chidStr += "<a class='name' href='/user/"+jid+"/submitted/1'>"+nick+"</a>";
					
					/*楼主*/
					var author = $(".collect-a").attr("jid");
					
					if(author == jid) {
						chidStr += "<span class='author'>(楼主)</span>";
					}
					
					chidStr += "<span class='into-time'>"+createT+"发布</span>";
					//手机客户端来源
					if(sourceType != undefined) {
							
							switch(sourceType) {
							
								case 1:
									sourceAppUrl = "/download/model/iphone";
									break;
								case 3:
									sourceAppUrl = "/download/model/wphone";
									break;
								case 5:
									sourceAppUrl = "/download/model/iphone";
									break;
						}
							
						chidStr += "<span class='into-time s-phone'>来自<a class='name' href='"+sourceAppUrl+"' target='_blank'>"+sourcePhone[sourceType]+"</a></span>";
					}
					chidStr += "</div>";
					chidStr += "<div class='p2'>";
						//act==2表示该评论被删除
						if(act != 2) {
							chidStr += content;
						} else {
							chidStr += "<em style='font-style:oblique;color:#B4B4B4'>该评论因  ''"+deleteResult+"'' 被删除</em>";
						}
						
						
					chidStr += "</div>";
					
					if(!noComments) {
						
					chidStr += "<div class='comment-line'>";
						chidStr += "<div class='comment-state'>";
					if(act != 2) {	
						if(isVote == "0") {//如果没顶或没踩过
							chidStr += "<a class='ding' href='javascript:;'>顶</a><span class='ding-num'>["+ups+"]</span><a class='cai' href='javascript:;'>踩</a><span class='cai-num'>["+downs+"]</span>";
						} else {
							if(isVote == 1){
								chidStr += "<span class='ding' href='javascript:;'>已顶</span><span class='ding-num'>["+ups+"]</span><span class='cai' href='javascript:;'>踩</span><span class='cai-num'>["+downs+"]</span>";
							} else{
								chidStr += "<span class='ding' href='javascript:;'>顶</span><span class='ding-num'>["+ups+"]</span><span class='cai' href='javascript:;'>已踩</span><span class='cai-num'>["+downs+"]</span>";
							}
						}						
					}	
					
					if(destjid != jid) {
 						//添加举报
							chidStr += "<a class='see-a jubao' href='javascript:;' lang='"+id+"'>举报</a>";
 					}
					
							//第10层不出现回复按钮
	 						if(depth < 6) {
	 							if(act != 2) {//==2时该评论被删除，则不显示回复
	 								chidStr += "<a class='see-a huifu-a' href='javascript:;' id='huifuBtn"+id+"'>回复</a>";
	 							}
							}
 						
	 						
	 						
							chidStr += "<input type='hidden' id='hid"+id+"' value='"+id+"' />";
	 						
						chidStr += "</div>";
					chidStr += "</div>";   
					
					}
		
					chidStr += "<div class='child-txt-area'></div>";
				chidStr += "</div>";
				chidStr += "<div style='clear:both'></div>";
				chidStr += "</span>";		
				//chidStr += "<div style='clear:both'></div>";
			//如果存在子节点,递归调用
			if(childData[i].childs) {
				digui++;
				diguiComments(childData[i].childs, noComments);
			}
			
			chidStr += "</li></ul>";
			totalChildStr += chidStr;
			chidStr = "";
			digui = 1;
		}
		
	}
	//绑定产生回复输入框的事件
	function createHuifuBox() {
		
			var txtarea = $(this).parent().parent().siblings(".child-txt-area"); 
			
			$(".child-txt-area:visible").not(txtarea[0]).slideUp("300").html("");														
			
			if(txtarea.css("display") == "block") {
				txtarea.slideUp("500",function(){
					$(this).html("");
				})//隐藏
						
				return;
			
			} else {
							
			var id = $(this).siblings(":hidden").val();
			
			var txtW = parseInt($(this).parent().parent().siblings(".p2").width());//回复框的宽度
			
			//----------------------------
			
			var str = "<div class='icons box-arrow'></div>";
			
			str += "<div id='publish-content-comment"+id+"' class='publish-content-duanzi huifu-box' style='width: " + txtW + "px'>";
			
			str += "<div class='txt-input-area-div corner no-corner-bottom'>";
			str += "<textarea class='txt-huifu' id='txt-huifu' name='txt-huifu' style='width:" + (txtW-18) + "px'></textarea>";
			str += "</div>";				
			
			str += "<div id='comment-buttonpane1' class='dialog-buttonpane corner-bottom noright'>";							
				str += "<div class='button-container'>";
					str += "<a id='pub-btn5' href='javascript:;' class='pub-icons add-pub-btn add-pub-btn-unvalid'>评论</a>";
					str += "<a id='pub-loading5' href='javascript:;' class='loading'>发布中...</a>";
				str += "</div>";
				str += "<div class='write-length'>还可以输入<span id='showLength5'>150</span>字</div>";				
				
				str += "<div class='write-error' style='display: none;'>标题已超出<span id='moreLength5'>10</span>个字</div>";			
			
				str += "<div class='dialog-nobind-img'><a href='hand.jsp'><img src='/images/picture_410_140.png'></a></div>";
			
				str += "<div class='write-error-box' id='write-error-box5'>";
			
				str += "<div class='write-error-desc'></div>";
				str += "</div>";
				
			str += "</div>";
			
			str += "</div>";
			
			txtarea.html(str)
					.slideDown("500");//显示
						
			//输入框获取焦点
			$(".txt-huifu").focus();
			
			//监听回复输入框
			$.input("txt-huifu",inputStateHuifu);
			
			submitHuiFu(id);//提交回复
			
			bindHuiFuEnter();//ctrl+回车事件
			
			}		
	
	}
	//点击回复按钮时生成回复输入框
	function showHuifuBox() {
		
		$(".huifu-a").bind("click", createHuifuBox);
		
	}
	//提交回复内容
	function submitHuiFu(parentId){
		
		$("#pub-btn5").click(function(){			
		
		//内容为空时，按钮无效
		var txtContent = $.trim($(".txt-huifu").val());
		
		if(txtContent == "") return;
		
		//首先判断是否超出字数，闪烁提示
		var thisobj = $(".child-txt-area #comment-buttonpane1 .write-error");
		if(!chouti.flashErrorTip(thisobj)) return;			
				
		//显示loading,发布按钮隐藏
		$("#pub-btn5").hide();
		$("#pub-loading5").css("display", "block");
		
		$(".txt-huifu").attr("disabled", true)
						.css("background-color", "#ece9d8");//文本输入框无效
		
		var linkId = $(".part2 i").html();
		var content = submitTxtContentHuifu;
		var jid = $("#hidjid").val();
		
		//在哪种状态下发布的，得加个参数sortType
		var submitUrl = "/comments/create";
		
		L.ajax({
			url : submitUrl,
			type:"POST",
			data:G.param({jid: jid, linkId: linkId, content: content,parentId: parentId}),
			success :  function(info){																		

						if(info.code == ResultCodeSuccess) {														
							
							//页面上方自动提示“发布成功”
							
							$(".txt-huifu").attr("disabled", false)
											.css("background-color", "#fff");//文本输入框有效
							
							$(".txt-huifu").val("");
							$("#showLength4").html(sumHuifuWriteLength);//还可以输入重新付值为150
							
							$("#pub-btn5").show();
							$("#pub-loading5").css("display", "none");//隐藏loading
							
							L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功
							
							//发布成功后，文本输入框区域隐藏及清空
							$(".txt-huifu").parent().parent().parent().hide()
																	  .html("");
							
							//新添加的回复在最新或者最热中显示出来，局部刷新
							if(sortType == "score") {
								$("#comment-hot-tab").click();
							} else {
								$("#comment-new-tab").click();
							}
							
							
						}else if(info.code == '21106') {


                            //一些验证方法
                            var isMobile = function(data) {
                                var flag = 1;
                                for(var i in data) {
                                    var exp = /^1[3458]\d{9}$/;
                                    if(!exp.exec(data[i])) {
                                        flag = 0;
                                        break;
                                    }
                                }

                                return flag?true:false;
                            };

                            var showError = function(height, text) {
                                removeError();
                                var html = '<div class="error" style="position:absolute;top:' + height + 'px;left:350px;font-size:12px;border:1px #ff8996 solid;padding:8px;border-radius:5px;width:164px;">' +
                                    '<div style="position:absolute;background:url(/images/bb-arrow.png) left center;top:5px;left:-12px;width:20px;height:20px;"></div>' +
                                    '<div class="error-info">' + text + '</div>' +
                                    '</div>';
                                mb.find('.bind-box').append(html);
                            };

                            var removeError = function() {
                                mb.find('.error').remove();
                            };

                            var showOK = function() {
                                removeError();
                                var html = '<div class="ok" style="position:absolute;top:85px;left:350px;font-size:12px;padding:8px;width:164px;">' +
                                    '<div style="position:absolute;background:url(/images/common_total_92_552.png) -33px -290px no-repeat;top:0px;left:0;width:20px;height:17px;"></div>' +
                                    '</div>';
                                mb.find('.bind-box').append(html);
                            };

                            var removeOK = function() {
                                mb.find('.ok').remove();
                            };

                            var counter = function() {
                                var $this = mb.find('input[name="msgcode"]');
                                var $b = mb.find('.btn-getMsgcode');

                                $b.addClass('unable illegal');
                                var c = 60000;
                                var i = setInterval(function() {
                                    if(c > 0) {
                                        $b.html(c / 1000 + '秒后重新发送');
                                        c -= 1000;
                                    }else {
                                        $b.html('获取短信验证码').removeClass('unable illegal');
                                        clearInterval(i);
                                    }
                                }, 1000);
                            };


                            //生成浮动层
                            var html =  '<style>.illegal{background-color:#dfdfdf !important;} .bind-box input{padding:0 5px;height:30px;width:186px;line-height:30px;font-size:12px;} .input-error{border:1px solid #ff8996;}</style>' +
                                '<div class="mb" style="background:url(/images/op.png);position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;z-index:2;">' +
                                '<div class="bind-box" style="padding:30px 230px 70px 30px;margin-top:100px;background-color:white;text-align:left;display:inline-block;position:relative;width:300px;">' +
                                '<div class="btn-close" style="cursor:pointer;position:absolute;right:10px;top:10px;width:20px;height:20px;background: url(/images/close.png)"></div>' +
                                '<div style="color:#4d4b47;font-size:14px;">评论/回复前，需要先绑定手机号</div>' +
                                '<div style="margin-top:32px;font-size:12px;"><span style="display:inline-block;width:100px;">手机号</span><span style="display:inline-block;width:200px;"><input name="phone" type="text" style="" /></span></div>' +
                                '<div style="margin-top:3px;font-size:12px;"><span style="display:inline-block;width:100px;position:relative;top:8px;"><img src="/gozapIdentifyCode" /><div class="changeCode" style="position:absolute;left:0px;bottom:-15px;font-size:12px;color:#99c;cursor:pointer;">换一张</div></span><span style="display:inline-block;width:200px;"><input name="code" type="text" /></span></div>' +
                                '<div style="margin-top:10px;"><div class="btn-getMsgcode illegal" style="cursor:pointer;display:inline-block;padding:10px 0;background-color:#5991d7;color:white;font-size:14px;margin-left:100px;width:200px;text-align:center;">获取短信验证码</div></div>' +
                                '<div style="margin-top:10px;font-size:12px;"><span style="display:inline-block;width:100px;">验证码</span><span style="display:inline-block;width:200px;"><input name="msgcode" type="text" /></span></div>' +
                                '<div style="margin-top:32px;"><div class="btn-bind illegal" style="cursor:pointer;display:inline-block;padding:10px 0px;background-color:#5991d7;color:white;font-size:14px;margin-left:100px;width:200px;text-align:center;">绑定手机</div></div>' +
                                '</div>' +
                                '</div>';

                            $('body').append(html);

                            var mb = $('.mb');
                            mb.find('.btn-close').click(function() {
                                mb.remove();
                                $(".txt-huifu").attr("disabled", false)
                                    .css("background-color", "#fff");//文本输入框有效
                                $("#pub-btn5").show();
                                $("#pub-loading5").css("display", "none");//隐藏loading
                            });

                            mb.find('.changeCode').click(function() {
                                $(this).prev().attr('src', '/gozapIdentifyCode?' + Math.random());
                            });

                            mb.find('input[name="phone"]').blur(function() {
                                var $this = $(this);
                                var v = $this.val();

                                if(v) {
                                    $.ajax({
                                        url : '/passport/checkPhoneAbled',
                                        data : {
                                            phone : v
                                        },
                                        dataType: "json",
                                        success :  function(info) {
                                            if(info.result.code != '9999') {
                                                removeOK();
                                                showError(80, info.result.message);
                                                mb.find('.btn-getMsgcode').addClass('illegal');
                                            }else {
                                                if(!mb.find('.btn-getMsgcode').hasClass('unable')) {
                                                    mb.find('.btn-getMsgcode').removeClass('illegal');
                                                    removeError();
                                                }
                                                showOK();
                                            }
                                        }
                                    });
                                }else {
                                    showError(80, '请输入手机号');
                                }
                            });

                            mb.find('input[name="msgcode"]').keydown(function(e) {
                                if(e.which == '13') {
                                    mb.find('.btn-bind').trigger('click');
                                }else {
                                    var $this = $(this);
                                    var v = $this.val();

                                    if(v) {
                                        mb.find('.btn-bind').removeClass('illegal');
                                    }else {
                                        mb.find('.btn-bind').addClass('illegal');
                                    }
                                }
                            });

                            mb.find('input[name="code"]').keydown(function(e) {
                                if(e.which == '13') {
                                    mb.find('.btn-getMsgcode').trigger('click');
                                }
                            });

                            mb.find('.btn-getMsgcode').click(function() {
                                if(!mb.find('input[name="phone"]').val()) {
                                    showError(80, '请输入手机号');
                                }
                                if(!$(this).hasClass('illegal')) {
                                    $.ajax({
                                        url : '/profile/sendcode',
                                        data : {
                                            phone : mb.find('input[name="phone"]').val(),
                                            code : MD5(mb.find('input[name="code"]').val())
                                        },
                                        dataType: "json",
                                        success :  function(info) {
                                            if(info.result.code != '9999') {
                                                showError(125, info.result.message);
                                            }else {
                                                counter();
                                                showError(125, '发送成功，请稍等');
                                            }
                                        }
                                    });
                                }
                            });

                            mb.find('.btn-bind').click(function() {
                                if(!$(this).hasClass('illegal')) {
                                    $.ajax({
                                        url : '/profile/bind',
                                        data : {
                                            phone : mb.find('input[name="phone"]').val(),
                                            code : mb.find('input[name="msgcode"]').val()
                                        },
                                        dataType: "json",
                                        success :  function(info) {
                                            if(info.result.code != '9999') {
                                                showError(215, info.result.message);
                                            }else {
                                                mb.remove();

                                                L.ajax({
                                                    url : submitUrl,
                                                    type:"POST",
                                                    data:G.param({jid: jid, linkId: linkId, content: content,parentId: parentId}),
                                                    success :  function(info){

                                                        if(info.code == ResultCodeSuccess) {

                                                            //页面上方自动提示“发布成功”

                                                            $(".txt-huifu").attr("disabled", false)
                                                                .css("background-color", "#fff");//文本输入框有效

                                                            $(".txt-huifu").val("");
                                                            $("#showLength4").html(sumHuifuWriteLength);//还可以输入重新付值为150

                                                            $("#pub-btn5").show();
                                                            $("#pub-loading5").css("display", "none");//隐藏loading

                                                            L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功

                                                            //发布成功后，文本输入框区域隐藏及清空
                                                            $(".txt-huifu").parent().parent().parent().hide()
                                                                .html("");

                                                            //新添加的回复在最新或者最热中显示出来，局部刷新
                                                            if(sortType == "score") {
                                                                $("#comment-hot-tab").click();
                                                            } else {
                                                                $("#comment-new-tab").click();
                                                            }


                                                        }
                                                    }});
                                            }
                                        }
                                    });
                                }
                            });
                        } else {
													
							//如果在3分钟内再次发布，则不可发布，则提示错误信息------您发布过于频繁，请2分钟后重新发布。
							//发布失败，请重试
							
								//L.showTopTips(L.TIPS_TYPE.error, info.message);
							
								$("#write-error-box5 .write-error-desc").html(info.message)
	  																	.show();
							
								$(".txt-huifu").attr("disabled", false)
												.css("background-color", "#fff");//文本输入框有效							
								$("#pub-btn5").show();
								$("#pub-loading5").css("display", "none");//隐藏loading
								return false;
														
						}
						
				}
		})
		})
	}
	
	//发布评论内容
	function publish() {
		
		//内容为空时，按钮无效
		var txtContent = $.trim($("#txt-comment").val());
		
		if(txtContent == "") return;
		
		//首先判断是否超出字数，闪烁提示
		var thisobj = $("#publish-content-comment #comment-buttonpane1 .write-error");
		if(!chouti.flashErrorTip(thisobj)) return;			
				
		//显示loading,发布按钮隐藏
		$("#pub-btn4").hide();
		$("#pub-loading4").css("display", "inline-block");
		$("#txt-comment").attr("disabled", true)
						 .css("background-color", "#ece9d8");//文本输入框无效
		
		$("#write-error-box4 .write-error-desc").hide();
		
		var linkId = $(".part2 i").html();
		var content = submitTxtContent;
		var subjectId = $("#hidsubjectid").val();
		var jid = $("#hidjid").val();
		var isAssent = $(".yaoyan-sel-area :radio:checked").val();//相信还是置颖标识
		
		if (subjectId != "3") {
			isAssent = "";
		}
		
		//在哪种状态下发布的，得加个参数sortType
		var submitUrl = "/comments/create";
		
		var options = {
				url : submitUrl,
				type:"POST",
				data:G.param({jid: jid, linkId: linkId, isAssent: isAssent, content: content,sortType:sortType}),
				success :  function(info){																		

							if(info.code == ResultCodeSuccess) {														
								
								//页面上方自动提示“发布成功”
								
								$("#txt-comment").attr("disabled", false)
												 .css("background-color", "#fff");//文本输入框有效
								
								$("#txt-comment").focus()
								 				 .val(" ")
								 				 .val("")
								 				 .blur();
								
								
								$("#showLength4").html(sumWriteLength);//还可以输入重新付值为150
								
								$("#pub-btn4").show();
								$("#pub-loading4").css("display", "none");//隐藏loading
								
								$("#newCommentId").html(info.data);//新的评论Id
								
								//$(".yaoyan-sel-area :radio").attr("checked", false);
								
								L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功
								
								//评论按钮变为无效
								setButtonDisabled(4);
								
								//评论为空的区域隐藏
								$("#no-comment-area").hide();
								
								//新添加的评论追加到最新或者最热中,显示出来
															
								if(sortType == "score") {
									
									appendNewComment("last", info);	//追加条新的评论
									
								} else {
									appendNewComment("first", info);	//追加条新的评论
									
								}
								
								
							}else if(info.code == '21106') {


                                //一些验证方法
                                var isMobile = function(data) {
                                    var flag = 1;
                                    for(var i in data) {
                                        var exp = /^1[3458]\d{9}$/;
                                        if(!exp.exec(data[i])) {
                                            flag = 0;
                                            break;
                                        }
                                    }

                                    return flag?true:false;
                                };

                                var showError = function(height, text) {
                                    removeError();
                                    var html = '<div class="error" style="position:absolute;top:' + height + 'px;left:350px;font-size:12px;border:1px #ff8996 solid;padding:8px;border-radius:5px;width:164px;">' +
                                        '<div style="position:absolute;background:url(/images/bb-arrow.png) left center;top:5px;left:-12px;width:20px;height:20px;"></div>' +
                                        '<div class="error-info">' + text + '</div>' +
                                        '</div>';
                                    mb.find('.bind-box').append(html);
                                };

                                var removeError = function() {
                                    mb.find('.error').remove();
                                };

                                var showOK = function() {
                                    removeError();
                                    var html = '<div class="ok" style="position:absolute;top:85px;left:350px;font-size:12px;padding:8px;width:164px;">' +
                                        '<div style="position:absolute;background:url(/images/common_total_92_552.png) -33px -290px no-repeat;top:0px;left:0;width:20px;height:17px;"></div>' +
                                        '</div>';
                                    mb.find('.bind-box').append(html);
                                };

                                var removeOK = function() {
                                    mb.find('.ok').remove();
                                };

                                var counter = function() {
                                    var $this = mb.find('input[name="msgcode"]');
                                    var $b = mb.find('.btn-getMsgcode');

                                    $b.addClass('unable illegal');
                                    var c = 60000;
                                    var i = setInterval(function() {
                                        if(c > 0) {
                                            $b.html(c / 1000 + '秒后重新发送');
                                            c -= 1000;
                                        }else {
                                            $b.html('获取短信验证码').removeClass('unable illegal');
                                            clearInterval(i);
                                        }
                                    }, 1000);
                                };


                                //生成浮动层
                                var html =  '<style>.illegal{background-color:#dfdfdf !important;} .bind-box input{padding:0 5px;height:30px;width:186px;line-height:30px;font-size:12px;} .input-error{border:1px solid #ff8996;}</style>' +
                                    '<div class="mb" style="background:url(/images/op.png);position:fixed;top:0;left:0;width:100%;height:100%;text-align:center;z-index:2;">' +
                                    '<div class="bind-box" style="padding:30px 230px 70px 30px;margin-top:100px;background-color:white;text-align:left;display:inline-block;position:relative;width:300px;">' +
                                    '<div class="btn-close" style="cursor:pointer;position:absolute;right:10px;top:10px;width:20px;height:20px;background: url(/images/close.png)"></div>' +
                                    '<div style="color:#4d4b47;font-size:14px;">评论/回复前，需要先绑定手机号</div>' +
                                    '<div style="margin-top:32px;font-size:12px;"><span style="display:inline-block;width:100px;">手机号</span><span style="display:inline-block;width:200px;"><input name="phone" type="text" style="" /></span></div>' +
                                    '<div style="margin-top:3px;font-size:12px;"><span style="display:inline-block;width:100px;position:relative;top:8px;"><img src="/gozapIdentifyCode" /><div class="changeCode" style="position:absolute;left:0px;bottom:-15px;font-size:12px;color:#99c;cursor:pointer;">换一张</div></span><span style="display:inline-block;width:200px;"><input name="code" type="text" /></span></div>' +
                                    '<div style="margin-top:10px;"><div class="btn-getMsgcode illegal" style="cursor:pointer;display:inline-block;padding:10px 0;background-color:#5991d7;color:white;font-size:14px;margin-left:100px;width:200px;text-align:center;">获取短信验证码</div></div>' +
                                    '<div style="margin-top:10px;font-size:12px;"><span style="display:inline-block;width:100px;">验证码</span><span style="display:inline-block;width:200px;"><input name="msgcode" type="text" /></span></div>' +
                                    '<div style="margin-top:32px;"><div class="btn-bind illegal" style="cursor:pointer;display:inline-block;padding:10px 0px;background-color:#5991d7;color:white;font-size:14px;margin-left:100px;width:200px;text-align:center;">绑定手机</div></div>' +
                                    '</div>' +
                                    '</div>';

                                $('body').append(html);

                                var mb = $('.mb');
                                mb.find('.btn-close').click(function() {
                                    mb.remove();


                                    $("#txt-comment").attr("disabled", false)
                                        .css("background-color", "#fff");//文本输入框有效
                                    $("#pub-btn4").show();
                                    $("#pub-loading4").css("display", "none");//隐藏loading
                                });

                                mb.find('.changeCode').click(function() {
                                    $(this).prev().attr('src', '/gozapIdentifyCode?' + Math.random());
                                });

                                mb.find('input[name="phone"]').blur(function() {
                                    var $this = $(this);
                                    var v = $this.val();

                                    if(v) {
                                        $.ajax({
                                            url : '/passport/checkPhoneAbled',
                                            data : {
                                                phone : v
                                            },
                                            dataType: "json",
                                            success :  function(info) {
                                                if(info.result.code != '9999') {
                                                    removeOK();
                                                    showError(80, info.result.message);
                                                    mb.find('.btn-getMsgcode').addClass('illegal');
                                                }else {
                                                    if(!mb.find('.btn-getMsgcode').hasClass('unable')) {
                                                        mb.find('.btn-getMsgcode').removeClass('illegal');
                                                        removeError();
                                                        showOK();
                                                    }
                                                }
                                            }
                                        });
                                    }else {
                                        showError(80, '请输入手机号');
                                    }
                                });

                                mb.find('input[name="msgcode"]').keydown(function(e) {
                                        if(e.which == '13') {
                                            mb.find('.btn-bind').trigger('click');
                                        }else {
                                            var $this = $(this);
                                            var v = $this.val();

                                            if(v) {
                                                mb.find('.btn-bind').removeClass('illegal');
                                            }else {
                                                mb.find('.btn-bind').addClass('illegal');
                                            }
                                        }
                                    });

                                mb.find('input[name="code"]').keydown(function(e) {
                                    if(e.which == '13') {
                                        mb.find('.btn-getMsgcode').trigger('click');
                                    }
                                });

                                mb.find('.btn-getMsgcode').click(function() {
                                    if(!mb.find('input[name="phone"]').val()) {
                                        showError(80, '请输入手机号');
                                    }
                                    if(!$(this).hasClass('illegal')) {
                                        $.ajax({
                                            url : '/profile/sendcode',
                                            data : {
                                                phone : mb.find('input[name="phone"]').val(),
                                                code : MD5(mb.find('input[name="code"]').val())
                                            },
                                            dataType: "json",
                                            success :  function(info) {
                                                if(info.result.code != '9999') {
                                                    showError(125, info.result.message);
                                                }else {
                                                    counter();
                                                    showError(125, '发送成功，请稍等');
                                                }
                                            }
                                        });
                                    }
                                });

                                mb.find('.btn-bind').click(function() {
                                    if(!$(this).hasClass('illegal')) {
                                        $.ajax({
                                            url : '/profile/bind',
                                            data : {
                                                phone : mb.find('input[name="phone"]').val(),
                                                code : mb.find('input[name="msgcode"]').val()
                                            },
                                            dataType: "json",
                                            success :  function(info) {
                                                if(info.result.code != '9999') {
                                                    showError(215, info.result.message);
                                                }else {
                                                    mb.remove();

                                                    L.ajax({
                                                        url : submitUrl,
                                                        type:"POST",
                                                        data:G.param({jid: jid, linkId: linkId, isAssent: isAssent, content: content,sortType:sortType}),
                                                        success :  function(info){

                                                            if(info.code == ResultCodeSuccess) {

                                                                //页面上方自动提示“发布成功”

                                                                $("#txt-comment").attr("disabled", false)
                                                                    .css("background-color", "#fff");//文本输入框有效

                                                                $("#txt-comment").focus()
                                                                    .val(" ")
                                                                    .val("")
                                                                    .blur();


                                                                $("#showLength4").html(sumWriteLength);//还可以输入重新付值为150

                                                                $("#pub-btn4").show();
                                                                $("#pub-loading4").css("display", "none");//隐藏loading

                                                                $("#newCommentId").html(info.data);//新的评论Id

                                                                //$(".yaoyan-sel-area :radio").attr("checked", false);

                                                                L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功

                                                                //评论按钮变为无效
                                                                setButtonDisabled(4);

                                                                //评论为空的区域隐藏
                                                                $("#no-comment-area").hide();

                                                                //新添加的评论追加到最新或者最热中,显示出来

                                                                if(sortType == "score") {

                                                                    appendNewComment("last", info);	//追加条新的评论

                                                                } else {
                                                                    appendNewComment("first", info);	//追加条新的评论

                                                                }


                                                            }
                                                        }});
                                                }
                                            }
                                        });
                                    }
                                });
                            }  else {
														
								//如果在3分钟内再次发布，则不可发布，则提示错误信息------您发布过于频繁，请2分钟后重新发布。
								//发布失败，请重试
								
									//L.showTopTips(L.TIPS_TYPE.error, info.message);
								
									$("#write-error-box4 .write-error-desc").html(info.message)
		  																	.show();
								
									$("#txt-comment").attr("disabled", false)
													 .css("background-color", "#fff");//文本输入框有效							
									$("#pub-btn4").show();
									$("#pub-loading4").css("display", "none");//隐藏loading
									return false;
															
							}
							
					}
			};
		
		L.ajax(options);	
		
	}
	//追加条新的评论,参数posit,表示是在最新还是最热状态下

	function appendNewComment(posit, info) {
		
		var str = ""
		var datas = info.data;
		
		var createT = datas.commentTime;
		var content = datas.content;
		var depth = datas.depth;
		var downs = datas.downs;
		var ups = datas.ups;
		
		var nickImgUrl = datas.nickImgUrl;
		var nick = datas.nick;
		var isVote = datas.isVote;
		var id = datas.id;
		var assentText = datas.assentText;
		var items = datas.items;		
		var jid = datas.jid;
		var sourceType = datas.sourceType;	//手机客户端来源
		var sourceAppUrl = datas.sourceAppUrl;	//下载地址
		
		str += "<li class='items last'>";
			str += "<span class='folder' style='background: none' id='folder-"+id+"'>";
				str += "<div class='comment-L'>"
						str += "<a class='icons zhan-ico' href='#'></a>";
						str += "<span class='comment-hen-point hen-line'><a href='/user/"+jid+"/submitted/1'><img src='"+nickImgUrl+"'></a></span>";
				str += "</div>";
				
				str += "<div class='comment-R'><div class='pp'><a href='/user/"+jid+"/submitted/1'><b class='name'>"+nick+"</b></a>";
				
				/*楼主*/
				var author = $(".collect-a").attr("jid");
				
				if(author == jid) {
					str += "<span class='author'>(楼主)</span>";
				}
				
				str += "<span class='into-time'>"+createT+"发布</span>";
				
				if(assentText == "相信") {
					str += "<span class='yaoyan-state'>"+assentText+"</span>";
				} else  if(assentText != ""){
					str += "<span class='yaoyan-state' style='color:#CC3300'>"+assentText+"</span>";
				}
				//手机客户端来源
				if(sourceType != undefined) {
						
						switch(sourceType) {
						
							case 1:
								sourceAppUrl = "/download/model/iphone";
								break;
							case 3:
								sourceAppUrl = "/download/model/wphone";
								break;
							case 5:
								sourceAppUrl = "/download/model/iphone";
								break;
					}
					str += "<span class='into-time s-phone'>来自<a class='name' href='"+sourceAppUrl+"' target='_blank'>"+sourcePhone[sourceType]+"</a></span>";
				}
				str += "</div>";
				str += "<div class='p2'>"+content+"</div>";
				str += "<div class='comment-line'>";
					str += "<div class='comment-state'>";
						str += "<span href='javascript:;' class='ding'>已顶</span>";
						str += "<span class='ding-num'>[1]</span>";
						str += "<span href='javascript:;' class='cai'>踩</span>";
						str += "<span class='cai-num'>[0]</span>"
						str += "<a id='huifuBtn"+id+"' href='javascript:;' class='see-a huifu-a'>回复</a>";
						str += "<input type='hidden' value='"+id+"' id='hid"+id+"'>";
					str += "</div>";
				str += "</div>";
				str += "<div class='child-txt-area'></div>";
				str += "</div>";
			str += "</span>";
	  str += "</li>";
	  
	  //追加到第一条还是最后一条
	  if(posit == "last") {
		 
		$("#comment-list > li.last").removeClass("last");	//把原来的最后一条class(last)移除
	  	$("#comment-list").append(str).hide().slideDown("1000");
	  } else {
		  
		  $("#comment-list li:first").before(str).hide().slideDown("1000");
	  }
	  $("#commentSum").html(items);//显示评论总数
	  $(".discus-a b").html(items);//显示评论总数（最上面推荐旁边的评论总数）
	  
	  //绑定产生回复输入框的事件
	  $("#huifuBtn"+id).bind("click", createHuifuBox);
	  
	  commentListHover();	//当鼠标移动到评论内容列表上时，显示背景色
	}
	
	//高亮显示相应的回复
	
	function showMsgPanel(id) {
		
		$("#huifuBtn"+id).click();
		
		var folderTemp = $("#comment-list #folder-"+id);
		
		folderTemp.css("background-color", "#fffeec");
		
		//1秒后高亮消失
		
		setTimeout(function(){
			folderTemp.css("background-color", "#fff");
		},2000)
				
	}
	
	//感兴趣的新闻
	function showInterestNews() {
		
		var submitUrl = "/suggestion.json";
		var linkId = $("#news-lists").attr("action-type");
		
		L.ajax({
			url : submitUrl,
			data:G.param({link_id: linkId}),
			success :  function(info){																	

						if(info.code == ResultCodeSuccess) {
							
							var sumitems = parseInt(info.data.items);	//总条数
														
							if(sumitems > 0) {
								
								$("#interest-news-area").show();
								var inf = info.data.dataList;
								//如果新闻个数小于6
								if(sumitems > avg) {
									appendInterestNews(inf,0,avg-1);	//追加显示新闻
								} else {
									appendInterestNews(inf,0,sumitems-1);	//追加显示新闻
								}
								
								chgInterestNews(sumitems, inf);	//切换新闻
								
							} else {
								$("#interest-news-area").hide();
							}
							
						} else {
							$("#interest-news-area").hide();
						}
			}
		})
	}
	
	//追加显示新闻
	function appendInterestNews(dataObj, s1, s2) {
		
		var data = dataObj;
		var str = "", ci = 0, httpurl = '',self = '';
		
		//如果个数大于3，则分行显示，如果小于3则只显示一行
		if((s2-s1) > 2) {
			
		
		for(var i=s1;i<=s1+2;i++) {
			
			var imgUrl = data[i].imgUrl;	//配图图片url
			var title = data[i].title;	//评论的标题
			var url = data[i].url;
			
			if(title.length > 45) {
				title = title.substring(0,45) + "..."
			}
			
			var linkId = data[i].id;	//评论的linkid
			
			//如果url不为空，一般是链接类型的，则转向第三方页面，如果如空，则转向评论页面
			if(url) {
				httpurl = url;
				self = "_blank";
			} else {
				httpurl = "/link/"+linkId;
				self = "_self";
			}
			str += "<a href='"+httpurl+"' class='news-block' target='"+self+"' onMouseDown='linksClickStat("+linkId+",\"fcdcd15372db42fca1f284b32b4cf0e8\")'>";
			str += "<img src='"+imgUrl+"' />";
			str += "<span class='desc'>"+title+"</span>";
			str += "</a>";
		}
		
		str = "<div class='inter-box no-t-box'>" + str +"</div><div class='inter-box'>";

		for(var i=s1+3;i<=s2;i++) {
			
			var imgUrl = data[i].imgUrl;	//配图图片url
			var title = data[i].title;	//评论的标题
			var url = data[i].url;
			
			if(title.length > 45) {
				title = title.substring(0,45) + "..."
			}
			
			var linkId = data[i].id;	//评论的linkid
			
			if(url) {
				httpurl = url;
				self = "_blank";
			} else {
				httpurl = "/link/"+linkId;
				self = "_self";
			}
			str += "<a href='"+httpurl+"' class='news-block' target='"+self+"' onMouseDown='linksClickStat("+linkId+",\"fcdcd15372db42fca1f284b32b4cf0e8\")'>";
			str += "<img src='"+imgUrl+"' />";
			str += "<span class='desc'>"+title+"</span>";
			str += "</a>";
		}
		
		str += "</div>";
		
		} else {
			
			for(var i=s1;i<=s2;i++) {
				
				var imgUrl = data[i].imgUrl;	//配图图片url
				var title = data[i].title;	//评论的标题
				var url = data[i].url;
				
				if(title.length > 45) {
					title = title.substring(0,45) + "..."
				}
				
				var linkId = data[i].id;	//评论的linkid
				
				if(url) {
					httpurl = url;
					self = "_blank";
				} else {
					httpurl = "/link/"+linkId;
					self = "_self";
				}
				str += "<a href='"+httpurl+"' class='news-block' target='"+self+"' onMouseDown='linksClickStat("+linkId+",\"fcdcd15372db42fca1f284b32b4cf0e8\")'>";
				str += "<img src='"+imgUrl+"' />";
				str += "<span class='desc'>"+title+"</span>";
				str += "</a>";
			}
			str = "<div class='inter-box no-t-box'>" + str +"</div>";
			
		}
		//显示出新闻(实现渐变效果)
		$("#news-lists").html(str);
		//				.animate({"opacity": "0.4"}, 10)
		//				.animate({"opacity": "1"}, 500);
		
	}
	//切换新闻

	function chgInterestNews(counts, inf) {
		
		var bigB = 0;	//切换总的次数(即总的页数)
		
		if((counts % avg) > 0) {
			bigB = parseInt(counts / avg + 1);
		} else {
			bigB = parseInt(counts / avg);
		}
		
		//切换按钮事件
		$("#chgNewsBtn").click(function(){
			
			//如果小于7个则不能点击该按钮
			if(counts <= 6) {return}
			
			chgN = chgN + 1;
			
			if(chgN > bigB) {	//到最后一页时，从头开始显示
				
				chgN = 1;
				appendInterestNews(inf, 0, avg - 1);
				
			} else {
				
				var endIndex = chgN * avg - 1;	//最后的索引值
				var strIndex = chgN * avg - avg; //开始的索引值
				
				if(counts < endIndex) {
					endIndex = counts - 1
				}
				
				appendInterestNews(inf, strIndex, endIndex);
			}
		
		})
		
	}
	//去除首尾的所有字格及换行及回车
	function clearBeforeNull(value) {		
		var tt1 = /^(\s+)|(\s+)$/;
		var str = value;
		//var str2 = tt.exec(str);
		str = str.replace(tt1,"");
		str = str.replace(tt1,"");
		return str;
		
	}
	//字符中间有多个空格时为1个空格
	function clearMidNull(value) {		
		var tt2 = /\s+/g;
		var str = value.replace(tt2," ");
		return str;
	}
	
//监听输入框内容变化情况，以便做出响应
	$.extend({
		input:function(objs, fun){	//参数obj,表示输入框的ID，参数fun 为函数名称
		var element = document.getElementById(objs);
		if(element) {
		//alert(element);
		if("\v"=="v") {	//IE
			element.onpropertychange = fun;
		}else{	//除去IE外其它的浏览器
			element.addEventListener("input",fun,false);
		}
		}
	 }
	})
	
		//内容为空评论和回复按钮无效
		function setButtonDisabled(n) {
			
			//回复按钮无效
			if(n == 5) {
				$("#pub-btn"+n).addClass("add-pub-btn-unvalid")
	 			   				.removeClass("add-pub-btn-valid");
			} else {//评论按钮无效
				$("#pub-btn"+n).addClass("pub-btn-unvalid")
			 			   		.removeClass("pub-btn-valid");
			}
			
			
		}
	//内容不为空按钮有效
			function setButtonAbled(n) {
				
				//回复按钮有效
				if(n == 5) {
					$("#pub-btn"+n).addClass("add-pub-btn-valid")
		 			   				.removeClass("add-pub-btn-unvalid");
				} else {//评论按钮有效
					$("#pub-btn"+n).addClass("pub-btn-valid")
				 			   		.removeClass("pub-btn-unvalid");
				}
				
				
				
			}
    NS_links_comment = {
		init: init

	};
})(jQuery);