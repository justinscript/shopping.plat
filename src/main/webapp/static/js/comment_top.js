(function($){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nNotice = i18n.notice;
		var ResultCodeSuccess = L.RESULT_CODE.success;//鎴愬姛浠ｇ爜9999
		var submitTxtContentHuifu = "";	//回复输入框最后提交给服务器的过滤过的输入内容
		var pageIndex = 0,
			sumWriteLength = 150,	//评论输入输入字的总数
			sumHuifuWriteLength = 150,	//回复输入字的总数
			submitTxtContent = "",	//评论输入框最后提交给服务器的过滤过的输入内容
			chidStr = "",
			totalChildStr = "",
			digui = 1,
			sortType = "score",
			isHuifu = false,
			tempLabel = "发布新评论"
			sourcePhone = {"1":"iPhone","2":"Android","3":"WPhone","5":"ipad"};
		var userAgentInfo=navigator.userAgent;

		var cc;
		
		
	function init(lei) {
		
		//当标题的高度加上推荐按钮那一行的高度小于图片的高度时，则把两者之间的距离拉大。(为了显示评论树)
		changeHeight();

        $('body').click(function(event) {
            if($(event.target).parents('.main-content').length == 0 && !$(event.target).hasClass('main-content') && !$(event.target).hasClass('big-img') && $(event.target).attr('id') != 'gotop') {
                $('.comment-box-area').hide();
				/*if(cc) {
					$(window).scrollTop(cc.offset().top);
				}*/
            }
        });

		$(".discus-a").click(function(){
            cc = $(this);
			var linkId = $(this).attr("lang");
			
			chouti.hidePlayVido(linkId);	//隐藏视频
			
			//评论区域
			var $box = $("#comment-box-area-"+linkId);
			
			if($box.is(":hidden")) {
				$box.show()
					.find("#loading-comment-top-"+linkId).css({"display": "inline"});	//加载评论时显示loading 去掉.siblings()
				$("#comment-box-top-"+linkId).hide();	//其它都先隐藏
				$("#yaoyan-sel-area-"+linkId).hide();	//其它都先隐藏
				$("#huifu-top-box-"+linkId).hide();				
				$("#comment-list-top-"+linkId).html("");	
				$("#write-error-desc-"+linkId).hide();				
				$("#hidden-comt-"+linkId).hide();				
				//$("#more-comt-"+linkId).hide();
				
				//$box.find("#loading-comment-top-"+linkId).siblings().hide();
				//根据评论按钮的位置来定位箭头的位置（因为当推荐按钮个数大于1时，定位就不准确，所以用代码来解决）
				/*
				if("\v"=="v") {
					if(lei == "huati") {
						var Larrow = $(this).position().left + 6;
					} else {
						var Larrow = $(this).position().left + 6;
					}
					
				} else {
					var Larrow = $(this).position().left + 5;
				}
				*/
				var Larrow = $(this).position().left + 5;
				
				//alert($(this).position().left);
				$("#comt-arrow-"+linkId).css("left", Larrow+"px");
				
			} else {
				
				$box.hide();
				return;
			}
			
			//显示所有评论
			showCommentsTop(linkId, "");
		
		})
		
		$(".txt-huifu-top").focus(function(){	//获得焦点时边框颜色变化
						
			$(this).css({"border": "1px solid #ffc875","height": "40px", "resize": "vertical"});
			
			//主要针对IE下不能有效监听输入框的问题
			if("\v"=="v") {
				if($(this).val() == "" && !isHuifu) {
					$(this).val(" ")
							.val("");
				}
			}
			
			//当输入框内容为空时或者回复div隐藏时，让文本框的text-indent为0
			var linkId = $(this).attr("lang");
			
			var $templab = $("#lab-comment-top-"+linkId);
			
			if($templab.is(":hidden")) {
				
				$(this).css("text-indent", "0px");
			}
						
		}).blur(function(){
			
			$(this).css({"border": "1px solid #CCDCEF"});
			
		}).keydown(function(events){
			
			//ctrl+回车   触发评论提交事件
			var linkId = $(this).attr("lang");
			
			var parentid = $(this).data("parentid");	//回复相应的节点id
			
			var $templab = $("#lab-comment-top-"+linkId);
			
			if(events.ctrlKey && events.keyCode==13) {
								
				if(parentid == "") {
					
					publish(linkId, "comment", "")
					
				} else {
					
					publish(linkId, "huifu", parentid)
				}
					
			}
			
			//如果光标处于最前面且有“回复给谁谁”时，按了删除键，要一键删除“回复给谁谁”
			var cursorP = $(this).cursorPosition();

			if(events.keyCode == 8 && $templab.is(":visible")) {																
				
				//判断光标的当前位置
				
				if(cursorP < 1) {
									
					isHuifu = false;
					//$(this).cursorPosition(0);
					$templab.hide();
					
					$(this).css("text-indent", "0px");
					
					//针对IE8不能回到text-indent:0的问题
						  
					if(userAgentInfo.indexOf("MSIE") > 0) {
							  $(this).blur();
							  $(this).focus();
					}
					
					$(this).data("parentid", "");
					
					 $("#pub-btn-top-"+linkId).unbind()
				   									.bind("click", function(){
				   										publish(linkId, "comment", "")
				   									});					
				   									
				}															  
				  
			}
			
		});
		
		//收起评论及关闭评论
		$(".hiddenCom-Btn, .close-comt").click(function(){
			
			var linkid = $(this).attr("lang");
			
			$("#comment-box-area-"+linkid).hide();
		})

		
		//回复谁谁时鼠标放上去背景颜色变化
		/*$(".lab-comment-top").hover(function(){
			
			$(this).css("background-color", "#ffffcc");
			
		},function(){
			$(this).css("background-color", "#fff");
		})*/
		
		//针对谣言的选择
		$(".yaoyan-sel-area :radio").click(function(){
			
			var linkid = $(this).attr("lang");
			
			$("#txt-huifu-top-"+linkid).attr("disabled", false)
										.css("background-color", "#fff")
										.focus();
			
			
		})
	}
	//当标题的高度加上推荐按钮那一行的高度小于图片的高度时，则把两者之间的距离拉大。(为了显示评论树)
	function changeHeight() {
		
		var items = $("#content-list .item");
		
		for(var i=0;i<items.length;i++) {
						
			if($(items[i]).find(".news-pic").length >0) {
				
				var h1 = $(items[i]).find(".part1").outerHeight();	//标题的高度
				var h2 = $(items[i]).find(".part2").outerHeight();		//推荐按钮区哉的高度		
				var h3 = $(items[i]).find(".area-summary").outerHeight();	//摘要的高度

				var hs = h1 + h2 + h3;
				if(hs < 64) {	//64为配图总的高度
					$(items[i]).find(".part2").css({"padding-top": (64-hs)+"px"});
				}
			}
		}
	}
	
	function inputState(objs, linkId){
		
		var duanzi = $.trim($("#"+objs).val());
		
		if(duanzi == ""){					//内容为空按钮无效			
			
			setButtonDisabled(linkId);
			//$("#showLength4").html(sumWriteLength);
			return;
			
		}else{	//内容不为空按钮有效
			
			setButtonAbled(linkId);
			
			
			//duanzi = checkCharCodeAt(duanzi, obj);//把全角转换成半角		
			
			//countDuanziLength(duanzi, 4);	//(上面发布评论输入框给出序号为4)	,计算输入字符的长度
					
		}
	}
		
	//把全角转换成半角,参数1表示内容，参数2表示文本输入框ID
	function  checkCharCodeAt(str){
		
		//alert(str.charCodeAt(1));
		str = str.split("");
		
		var TotalStr = "";
		
		for(var i=0;i <str.length;i++){
			
			if(str[i].charCodeAt(0) == 32){
				TotalStr += " ";
			} else {
				TotalStr += str[i];
			}
			
			/*
			if(str[i].charCodeAt(0) > 0xff00) {//表示该字符为全角
			//if(str[i].charCodeAt(0) == 32) {
				
				//alert(str[i].charCodeAt(0));
				
				
				var chara = String.fromCharCode(str[i].charCodeAt(0) - 65248);//转化成半角
				TotalStr += chara;
			} else {
				alert(str[i].charCodeAt(0));
				TotalStr += str[i];
			}
			*/
			
		}
		//$(objs).val(TotalStr);
		return TotalStr;
		
		
		
	}
	
	//在榜单页面显示的评论
	//显示所有评论
	
	function showCommentsTop(linkId,hui) {
		
		var sortType= "score";	//显示方试--最热
		//var limit = 20;	//显示20条记录
		var submitUrl = "/comments";

		L.ajax({
			url : submitUrl,
			type:"POST",
			data:G.param({linkId:linkId, sortType:sortType, id:0}),
			success :  function(info){																	

						if(info.code == ResultCodeSuccess) {
							
							var dataItems = parseInt(info.data.items);	//总条数
							var moreItems = parseInt(info.data.remain);	//还剩下几条
							var noComments = info.data.noComments;
							
							$("#discus-a-"+linkId).find("b").html(dataItems);	//显示评论按钮上的评论总数
							
							$("#newestCount-"+linkId).html(dataItems);	//显示最热评论旁边的评论总数	
							
							//加载评论json数据
							if(dataItems >= 1) {
								loadCommentsTop(info, linkId);	
							}							
														
							//回复的div隐藏
							var $templab = $("#lab-comment-top-"+linkId);
							$templab.hide();
 								 
 								 
							//单选框处于未选中状态
							//$("#yaoyan-sel-area-"+linkId+" :radio:checked").attr("checked", false);												
							
							$("#loading-comment-top-"+linkId).hide()	//隐藏loading
															.siblings().show();
							
							//如果还有剩下的条数则显示出来
							/*
							if(moreItems > 0) {
								
								$("#more-comt-"+linkId).show()
														.find("span.m-comt").html(moreItems);								
							} else {
								
								$("#more-comt-"+linkId).hide();
							}
							*/
							//绑定评论按钮点击事件
							$("#pub-btn-top-"+linkId).unbind()
													 .bind("click", function(){
														 publish(linkId, "comment", "")
													});
							//评论按钮无郊
							setButtonDisabled(linkId);
							
							//隐藏错误提示框
							$("#write-error-desc-"+linkId).hide();
							
							
							$("#txt-huifu-top-"+linkId).data("parentid", "")
														.css({"text-indent": "0px","height": "20px","resize": "none"});
							//如果是回复提交且是在IE浏览器下
							if(hui == "huifu" && userAgentInfo.indexOf("AppleWebKit") < 0) {
								$("#txt-huifu-top-"+linkId).focus();
							}
							
							$("#txt-huifu-top-"+linkId).val(" ")
														.val("");
							
							//如果是回复提交且是在非IE浏览器下
							if(hui == "huifu" && userAgentInfo.indexOf("AppleWebKit") >= 0) {
								$("#txt-huifu-top-"+linkId).focus();
							}
							  
							  //区分chrome,safari浏览器和别的浏览器触发光标位置
							  //if(userAgentInfo.indexOf("AppleWebKit") > 0) {
														
							//显示收起评论按钮
							$("#hidden-comt-"+linkId).show();
							
							//参数1为文本输入框ID，参数二为ID号，参数三为处理函数
							$.inputComment("txt-huifu-top-"+linkId, linkId, inputState);	
														
							oprateDigg();	//顶或踩
							
							chouti.oprateJuBao();	//举报
							
							//判断新闻评论是否关闭
							var $coloseComment = $("#coloseComment"+linkId);
							
							if(noComments){
								
								var colComStr = "<div class='coloseComment' id='coloseComment"+linkId+"'>此评论已关闭</div>";								
								//如果该提示已经存在时则显示，如果不存在则生成
								if($coloseComment.length > 0) {
									
									$coloseComment.show();
									
								} else {
									
									$("#huifu-top-box-"+linkId).after(colComStr);
								}								
								
								$("#huifu-top-box-"+linkId).hide();	//隐藏输入回复框
								
							} else {
								
								$("#huifu-top-box-"+linkId).show();
								
								$coloseComment.hide();
							}
							
						} else {													
							
							//加载失败，请重试
							
								L.showTopTips(L.TIPS_TYPE.error, info.message);							
								$("#loading-comment-top-"+linkId).hide();
								return false;														
						}
						
				}
			})		
		
	}
	//加载榜单评论json数据
	function loadCommentsTop(dataObj, linkId) {
			
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
			
			var destjid = $("#hidjid").val();	//当前登录用户的destjid
			
				str += "<span class='folder' >";
			
				str += "<div class='comment-L comment-L-top'>";
					str += "<a href='#' class='icons zhan-ico'></a>";
					str += "<a href='/user/"+jid+"/submitted/1'><img src='"+nickImgUrl+"' /></a>";										
					
				str += "</div>";
				str += "<div class='comment-R comment-R-top'>";
					str += "<div class='pp'>";
					str += "<a class='name' href='/user/"+jid+"/submitted/1'>"+nick+"</a>";
					
					/*楼主*/
					var author = $("#collect-a-"+linkId).attr("jid");
					
					if(author == jid) {
						str += "<span class='author'>(楼主)</span>";
					}
					
					str += "<span class='p3'>";
					//act==2表示该评论被删除
					if(act != 2) {
						str += content;
					} else {
						str += "<em style='font-style:oblique;color:#B4B4B4'>该评论因  ''"+deleteResult+"'' 被删除</em>";
					}
					
					str += "</span>";
					
					str += "<span class='into-time into-time-top'>"+createT+"发布</span>";
					
					if(state == "相信") {
						str += "<span class='yaoyan-state-top'>"+state+"</span>";
					} else if(state != ""){
						str += "<span class='yaoyan-state-top' style='color:#CC3300'>"+state+"</span>";
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
						str += "<span class='into-time s-phone'>来自<a class='phone-name' href='"+sourceAppUrl+"' target='_blank'>"+sourcePhone[sourceType]+"</a></span>";
					}
					str += "</div>";
					
					
					if(act != 2 && !noComments) {
						
					str += "<div class='comment-line-top'>";
						str += "<div class='comment-state'>";
						
					
						if(isVote == "0") {//如果没顶或没踩过
							str += "<a class='ding' lang='"+linkId+"' href='javascript:;'><b>顶</b><span class='ding-num'>["+ups+"]</span></a><a class='cai' lang='"+linkId+"' href='javascript:;'><b>踩</b><span class='cai-num'>["+downs+"]</span></a>";
						} else {
							if(isVote == 1){
								str += "<span class='ding' href='javascript:;'><b>已顶</b><span class='ding-num'>["+ups+"]</span></span><span class='cai' lang='"+linkId+"' href='javascript:;'><b>踩</b><span class='cai-num'>["+downs+"]</span></span>";
							} else{
								str += "<span class='ding' lang='"+linkId+"' href='javascript:;'><b>顶</b><span class='ding-num'>["+ups+"]</span></span><span class='cai' href='javascript:;'><b>已踩</b><span class='cai-num'>["+downs+"]</span></span>";
							}
						}				
						
						//添加举报
	 					
	 					if(destjid != jid) {
	 						
	 						str += "<span class='line-huifu'>|</span>";
	 						str += "<a class='see-a jubao' href='javascript:;' lang='"+id+"'  linkid='"+linkId+"'>举报</a>";
	 					} else {
	 						
	 					}
	 					
	 					
	 							//第10层不出现回复按钮
		 						if(depth < 6) {
		 							if(act != 2) {	//==2时该评论被删除，则不显示回复
		 								str += "<span class='line-huifu'>|</span>";
		 								str += "<a class='see-a huifu-a' href='javascript:;' id='huifuBtn"+id+"' lang='"+id+"' usernick='"+nick+"'  linkid='"+linkId+"'>回复</a>";
		 							}
		 						}
		 					
		 						
		 					
 							
							str += "<input type='hidden' id='hid"+id+"' value='"+id+"' />";
							
						str += "</div>";
					str += "</div>";
					
					}
				str += "</div>";
				
			str += "</span>";			
			
			//如果存在子节点
			if(data[i].childs) {
				diguiComments(data[i].childs, linkId, noComments);
			}

			str += totalChildStr;
			
			str += "</li>";
		}
		
		$("#comment-list-top-"+linkId).html(str)	//显示结果
									 .treeview();	//树形化数据
						
		deleteline(linkId);		//清除多余背景树线		
		
		bindHuifuBtn();	//绑定回复按钮事件
		
		commentListHover();		//当鼠标移动到评论内容列表上时，显示背景色	
		
	}
	//绑定回复按钮事件
	function bindHuifuBtn() {
		
		 //点击回复按钮后显示回复人
		
		$(".huifu-a").unbind()
					 .bind("click",function(){
						 
			isHuifu = true;
			  var id = $(this).attr("lang");	//parentId(也就是当前节点的id号)
			  
			  var nick = $(this).attr("usernick");
			  
			  var linkId = $(this).attr("linkid");
			  
			  var $lab = $("#lab-comment-top-"+linkId);
			  
			  $lab.show()
			  	  .find("span").html(nick);
			  
			  //回复div的宽度
			  var labW = $lab.width();
			  
			  //定位光标在文本框中的最前面位置显示(使用其css,text-indent)
			  var crusorP = (labW+4);
			  
			  //区分chrome,safari浏览器和别的浏览器触发光标位置
			  if(userAgentInfo.indexOf("AppleWebKit") > 0) {
				  
				  $("#txt-huifu-top-"+linkId).data("parentid", id)
					 .css({/*"text-indent": crusorP+"px",*/"background-color": "#fff"})
					 .attr("disabled", false)
					 .val(" ")					 
					 .focus();
			  } else {
				  
				  $("#txt-huifu-top-"+linkId).data("parentid", id)
					 
					 .css({/*"text-indent": crusorP+"px",*/"background-color": "#fff"})
					 .attr("disabled", false)
					 .focus()
					 .val(" ")
					 .val("");
					 
			  }
			  		  						
			  //评论按钮无效
			  setButtonDisabled(linkId);
			
			//给评论按钮绑定   回复   提交事件
			  $("#pub-btn-top-"+linkId).unbind()
			  				   			.bind("click", function(){
											 publish(linkId, "huifu", id)
			  				   			});
			  
		})
		  
	}
	
	//追加条新的评论,参数posit,表示是在最新还是最热状态下

	function appendNewComment(posit, info, linkId) {
		
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
			str += "<span class='folder' style='background: none'>";
				str += "<div class='comment-L comment-L-top'>"
						str += "<a class='icons zhan-ico' href='#'></a>";
						str += "<a href='/user/"+jid+"/submitted/1'><img src='"+nickImgUrl+"'></a>";
				str += "</div>";
				
				str += "<div class='comment-R comment-R-top'>";
					str += "<div class='pp'>";
					str += "<a href='/user/"+jid+"/submitted/1' class='name' target='_blank'>"+nick+"</a>";
					
					/*楼主*/
					var author = $("#collect-a-"+linkId).attr("jid");
					
					if(author == jid) {
						str += "<span class='author'>(楼主)</span>";
					}
										
					str += "<span class='p3'>"+content+"</span>";
					str += "<span class='into-time  into-time-top'>"+createT+"发布</span>";
				
				if(assentText == "相信") {
					str += "<span class='yaoyan-state-top'>"+assentText+"</span>";
				} else if(assentText != ""){
					str += "<span class='yaoyan-state-top' style='color:#CC3300'>"+assentText+"</span>";
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
					str += "<span class='into-time s-phone'>来自<a class='phone-name' href='"+sourceAppUrl+"' target='_blank'>"+sourcePhone[sourceType]+"</a></span>";
				}
				
					str += "</div>";

				str += "<div class='comment-line-top'>";
					str += "<div class='comment-state'>";
						str += "<span href='javascript:;' class='ding'><b>已顶</b><span class='ding-num'>[1]</span></span>";
						
						str += "<span href='javascript:;' lang='"+linkId+"' class='cai'><b>踩</b><span class='cai-num'>[0]</span></span>";
						str += "<span class='line-huifu'>|</span>";
						str += "<a id='huifuBtn"+id+"' href='javascript:;' class='see-a huifu-a' lang='"+id+"' usernick='"+nick+"' linkid='"+linkId+"'>回复</a>";
						str += "<input type='hidden' value='"+id+"' id='hid"+id+"' />";
					str += "</div>";
				str += "</div>";
				
				str += "</div>";
			str += "</span>";
	  str += "</li>";
	  
	  //追加到第一条还是最后一条
	  if(posit == "last") {
		 
		$("#comment-list-top-"+linkId+" > li.last").removeClass("last");	//把原来的最后一条class(last)移除
		$("#comment-list-top-"+linkId).append(str).show();
		
	  } else {
		  
		  $("#comment-list-top-"+linkId+" li:first").before(str).show();
	  }
	  
	  $("#newestCount-"+linkId).html(items);	//最热评论显示评论总数
	  $("#discus-a-"+linkId).find("b").html(items);		//评论按钮旁边显示评论总数
	  
	  $("#txt-huifu-top-"+linkId).focus();
	  
	  bindHuifuBtn();
	  
	  commentListHover();	//当鼠标移动到评论内容列表上时，显示背景色
	  
	}
	//当鼠标移动到评论内容列表上时，显示背景色
	function commentListHover() {
		
		$(".comment-list-top-2 .comment-R-top").hover(function(){
			
			$(this).css({"background-color": "#f6ecdc"})				
					.find(".comment-line-top").show();
			
		},function(){
			
			$(this).css("background-color", "#F6F6F6")
					.find(".comment-line-top").hide();
		})
	}
	
	//清除多余背景树线
	function deleteline(linkId) {
		
		var $list = "#comment-list-top-"+linkId;	
		
		var itemobj = $("#comment-list-top-"+linkId+" li.items");		
		
		for(var i=0;i<itemobj.length;i++) {
			var sp = $(itemobj[i]).children();
			if(sp.length <= 1) {
				$(itemobj[i]).children("span.folder").css("background", "none");
			}
		}

		$($list+" li.items:last").children("div.lastCollapsable-hitarea").css("background-position", "-64px -45px");
		
		$($list+" li.last span.folder").css("background", "none");
		
		$($list+" li.last").parent("ul").css("background", "none");
		
		$($list+" li.items li.lastCollapsable").parent("ul").css("background", "none")
																	.prev("ul").css("background", "url('/images/pinglun_line.gif') no-repeat scroll 0 -10px transparent");
		
		
		$($list+" li.items li.last").parent("ul").prev("ul").css("background", "url('/images/pinglun_line.gif') no-repeat scroll 0 -10px transparent");
		
		$($list+" li.collapsable:first ul:last").css("background","none");
		
		
		//针对chrome浏览器IE浏览器
		
		/*
		if(userAgentInfo.indexOf("AppleWebKit") > 0 || userAgentInfo.indexOf("MSIE") > 0){
			
			$(".treeview li.last").css("background-position", "0px -1767px");
			
			$(".treeview li.lastCollapsable").css("background-position", "0px -162px");
		}
			*/
		//让最后一个实现加号和减号样式变化
		$($list+" li.items:last").children("div.items-hitarea").click(function(){
			if($(this).hasClass("lastExpandable-hitarea")) {
				$(this).css("background-position", "-80px -13px");
			} else {
				$(this).css("background-position", "-64px -45px");
			}
		})
		//点击+-图标，展开下面的内容，滚动条向下滚动一下
		$($list+" li.items div.items-hitarea").click(function(){
			$(this).children("ul:first li:first b").focus();
			
		})
	}
	
	//递归显示评论
	function diguiComments(childData, linkId, noComments) {
		
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

				chidStr += "<span class='folder'>";	
				chidStr += "<div class='comment-L comment-L-top'>";

					chidStr += "<a href='#' class='icons zhan-ico'></a>";					
					chidStr += "<a href='/user/"+jid+"/submitted/1'><img src='"+nickImgUrl+"' /></a>";
				chidStr += "</div>";
				chidStr += "<div class='comment-R comment-R-top'>";
					chidStr += "<div class='pp'>";
					chidStr += "<a class='name' href='/user/"+jid+"/submitted/1'>"+nick+"</a>";
					
					/*楼主*/
					var author = $("#collect-a-"+linkId).attr("jid");
					
					if(author == jid) {
						chidStr += "<span class='author'>(楼主)</span>";
					}
					
					chidStr += "<span class='p3'>";
					//act==2表示该评论被删除
					if(act != 2) {
						chidStr += content;
					} else {
						chidStr += "<em style='font-style:oblique;color:#B4B4B4'>该评论因  ''"+deleteResult+"'' 被删除</em>";
					}
					
					chidStr += "</span>";
					
					chidStr += "<span class='into-time into-time-top'>"+createT+"发布</span>";
					
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
						chidStr += "<span class='into-time s-phone'>来自<a class='phone-name' href='"+sourceAppUrl+"' target='_blank'>"+sourcePhone[sourceType]+"</a></span>";
					}
					
					chidStr += "</div>";
					
					if(act != 2 && !noComments) {
						
					chidStr += "<div class='comment-line-top'>";
						chidStr += "<div class='comment-state'>";
						
						if(isVote == "0") {//如果没顶或没踩过
							chidStr += "<a class='ding' lang='"+linkId+"' href='javascript:;'><b>顶</b><span class='ding-num'>["+ups+"]</span></a><a class='cai' lang='"+linkId+"'  href='javascript:;'><b>踩</b><span class='cai-num'>["+downs+"]</span></a>";
						} else {
							if(isVote == 1){
								chidStr += "<span class='ding' href='javascript:;'><b>已顶</b><span class='ding-num'>["+ups+"]</span></span><span class='cai' lang='"+linkId+"' href='javascript:;'><b>踩</b><span class='cai-num'>["+downs+"]</span></span>";
							} else{
								chidStr += "<span class='ding' lang='"+linkId+"' href='javascript:;'><b>顶</b><span class='ding-num'>["+ups+"]</span></span><span class='cai' href='javascript:;'><b>已踩</b><span class='cai-num'>["+downs+"]</span></span>";
							}
						}						
						
						//添加举报
 						if(destjid != jid) {
	 						
 							chidStr += "<span class='line-huifu'>|</span>";
 							chidStr += "<a class='see-a jubao' href='javascript:;' lang='"+id+"'  linkid='"+linkId+"'>举报</a>";
	 					} 
 						
 						
							//第10层不出现回复按钮
	 						if(depth < 6) {
	 							if(act != 2) {//==2时该评论被删除，则不显示回复
	 								chidStr += "<span class='line-huifu'>|</span>";
	 								chidStr += "<a class='see-a huifu-a' href='javascript:;' id='huifuBtn"+id+"'  lang='"+id+"' usernick='"+nick+"' linkid='"+linkId+"'>回复</a>";
	 							}
							}
	 						
	 						

		 						
							chidStr += "<input type='hidden' id='hid"+id+"' value='"+id+"' />";
	 						
						chidStr += "</div>";
					chidStr += "</div>";
					
					}
					
				chidStr += "</div>";
				//chidStr += "<div style='clear:both'></div>";
				chidStr += "</span>";		
				//chidStr += "<div style='clear:both'></div>";
			//如果存在子节点,递归调用
			if(childData[i].childs) {
				digui++;
				diguiComments(childData[i].childs, linkId, noComments);
			}
			
			chidStr += "</li></ul>";
			totalChildStr += chidStr;
			chidStr = "";
			digui = 1;
		}
		
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
	
	//发布评论内容
	//参数1表示该新闻事件ID，参数二表示该新闻事件类别，参数三表示回复的父节点ID号
	
	function publish(linkId, kind, parentId) {
		
		//发布内容为空时，评论按钮无效
		var $temptxt = $("#txt-huifu-top-"+linkId);
		var txtContent = $.trim($temptxt.val());
		
		if(txtContent == "") return;
		
		txtContent = clearBeforeNull(txtContent);	//清除头尾空格
		txtContent = clearMidNull(txtContent);		//字符中间有多个空格时为1个空格
		
		txtContent = checkCharCodeAt(txtContent); //全角转换成半角，只对全角下的空格做限制
		/*
		//首先判断是否超出字数，闪烁提示
		var thisobj = $("#publish-content-comment #comment-buttonpane1 .write-error");
		if(!chouti.flashErrorTip(thisobj)) return;			
		*/		
		//发布按钮隐藏
		var $temppub_btn = $("#pub-btn-top-"+linkId);
		$temppub_btn.hide();
		
		//显示loading
		var $temploading_btn = $("#pub-loading-top-"+linkId);
		$temploading_btn.css("display", "inline-block");
		
		/*
		//文本输入框无效
		$temptxt.attr("disabled", true)
				.css("background-color", "#ece9d8");
		*/
		
		//错误提示先隐藏
		var $temp_error_box = $("#write-error-desc-"+linkId);
		$temp_error_box.hide();
		
		//var linkId = id;	//该事件ID
		var content = txtContent;	//评论内容
		var subjectId = $("#hidsubjectid-"+linkId).val();	//类别号
		var jid = $("#hidjid").val();	//登录用户ID
		var sortType = "score";
		//var isAssent = "";
		
		//如果是谣言类别时，获取相信还是置疑标识
		if($("#yaoyan-sel-area-"+linkId+" :radio").length >= 1) {
			
			var isAssent = $("#yaoyan-sel-area-"+linkId+" :radio:checked").val();	//相信还是置颖标识
		}
		//
		if (subjectId != "3") {
			var isAssent = "";
		}
		//alert(isAssent);
		
		//在哪种状态下发布的，得加个参数sortType
		var submitUrl = "/comments/create";
		
		//判断是"提交评论"  还是 "提交回复"
		if(kind == "huifu") {
			var para = G.param({jid: jid, linkId: linkId, content: content,parentId: parentId});
		} else {
			
			if(isAssent == undefined && subjectId == 3) {
				//显示错误信息
				$temp_error_box.html("对于谣言，要先表明立场，才能评论哦")
									.show();
				$temppub_btn.show();
				$temploading_btn.css("display", "none");//隐藏loading
				
				//评论按钮变为有效
				setButtonAbled(linkId);
				return;
			}
			var para = G.param({jid: jid, linkId: linkId, isAssent: isAssent, content: content,sortType:sortType});
		}
		
		var options = {
				url : submitUrl,
				type: "POST",
				data: para,
				success :  function(info){																		

							if(info.code == ResultCodeSuccess) {														
								
								//页面上方自动提示“发布成功”
															
								 $temptxt.val("");
								
								$temppub_btn.show();
								$temploading_btn.css("display", "none");//隐藏loading
								
								//$(".yaoyan-sel-area :radio").attr("checked", false);
								
								L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功								
								
								
								if(kind == "huifu") {	//新添加的回复需要得新加载才能显示出来
																		
									showCommentsTop(linkId, "huifu");
									
									
								} else {	//新添加的评论追加到最热中,显示出来
									
									appendNewComment("last", info, linkId);	//追加条新的热评论
								}
								
								//评论按钮变为无效
								setButtonDisabled(linkId);
								
								//回复给谁谁的div隐藏
								$("#lab-comment-top-"+linkId).hide()
																	
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

                                    $temppub_btn.show();
                                    $temploading_btn.css("display", "none");//隐藏loading

                                    setButtonAbled(linkId);
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
                                                    showError(80, info.result.message);
                                                    removeOK();
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
                                                    showError(125, '发送成功！');
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
                                                        type: "POST",
                                                        data: para,
                                                        success :  function(info){

                                                            if(info.code == ResultCodeSuccess) {

                                                                //页面上方自动提示“发布成功”

                                                                $temptxt.val("");

                                                                $temppub_btn.show();
                                                                $temploading_btn.css("display", "none");//隐藏loading

                                                                //$(".yaoyan-sel-area :radio").attr("checked", false);

                                                                L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功


                                                                if(kind == "huifu") {	//新添加的回复需要得新加载才能显示出来

                                                                    showCommentsTop(linkId, "huifu");


                                                                } else {	//新添加的评论追加到最热中,显示出来

                                                                    appendNewComment("last", info, linkId);	//追加条新的热评论
                                                                }

                                                                //评论按钮变为无效
                                                                setButtonDisabled(linkId);

                                                                //回复给谁谁的div隐藏
                                                                $("#lab-comment-top-"+linkId).hide()

                                                            }}});
                                                }
                                            }
                                        });
                                    }
                                });
                            }else {
														
								//如果在3分钟内再次发布，则不可发布，则提示错误信息------您发布过于频繁，请2分钟后重新发布。
								//发布失败，请重试
								
									//L.showTopTips(L.TIPS_TYPE.error, info.message);
								
									//没有登录
									if(!chouti.reponseNoLogin(info.code, info.message, "发表评论成功")) {
										
										$temppub_btn.show();
										$temploading_btn.css("display", "none");//隐藏loading
										
										return false;
									}
																		
									//显示错误信息
									$temp_error_box.html(info.message)
		  											.show();
																							
									$temppub_btn.show();
									$temploading_btn.css("display", "none");//隐藏loading
									
									//评论按钮变为有效
									setButtonAbled(linkId);
																		
									return false;															
							}
							
					}
			}
		
		//把要提交的动作保存下来
		$("#isAjax").data("ajax", options);
		
		//保存下当前评论按钮的linkId,方便登录完后再次触发点击

		$("#isComment").data("isComment", linkId);
		
		L.ajax(options);	
		
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
			
			var linkId = $this.attr("lang");
			var jid = $("#hidjid").val();	//投票人的destJid
			
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
										
										$($this).find(".ding-num").html("["+info.data+"]");//显示投票数
										$($this).css({"cursor":"default", "color":"#B4B4B4","text-decoration":"none"})												
												.unbind()
												.siblings(".cai").unbind();
										
										$($this).find("b").html("已顶");
										
										$($this).hover(function(){
											$(this).css("text-decoration","none");
										})
										
										$($this).siblings(".cai").css({"cursor":"default", "color":"#B4B4B4"})
																 .hover(function(){
																		$(this).css("text-decoration","none");
																	})																
												
									} else {	//踩
										$($this).find(".cai-num").html("["+info.data+"]");//显示投票数
										$($this).css({"cursor":"default", "color":"#B4B4B4","text-decoration":"none"})
												.unbind()
												.siblings(".ding").unbind();
										$($this).find("b").html("已踩");
										$($this).hover(function(){
											$(this).css("text-decoration","none");
										})
										
										$($this).siblings(".ding").css({"cursor":"default", "color":"#B4B4B4"})
																.hover(function(){
																	$(this).css("text-decoration","none");
																})	
									}		
									//执行登录前点击的的提交动作后的提示信息
									chouti.executeBeforOprate(true);
									
								} else {														
									
									//投票失败，请重试
										//没有登录
										if(!chouti.reponseNoLogin(info.code, info.message, "投票成功")) {
											return false;
										}
										/*
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
										*/
										L.showTopTips(L.TIPS_TYPE.error, info.message);
										
										return;
																
								}
								
						}
				};	
			
			//把要提交的动作保存下来
			$("#isAjax").data("ajax", options);
			
			L.ajax(options);
			
		})		
		
	}
	
	
	
//监听输入框内容变化情况，以便做出响应
	$.extend({
		inputComment:function(objs, linkId, fun){	//参数obj,表示输入框的ID，参数fun 为函数名称
		var element = document.getElementById(objs);
		if(element) {
			if("\v"=="v") {	//IE
				element.onpropertychange = function() {inputState(objs, linkId)};
			}else{	//除去IE外其它的浏览器
				element.addEventListener("input",function() {inputState(objs, linkId)},false);
			}
		}
	 }
	})
	
		//内容为空评论和回复按钮无效
		function setButtonDisabled(n) {
			
			//回复按钮无效
				
				$("#pub-btn-top-"+n).addClass("add-pub-btn-unvalid")
	 			   					.removeClass("add-pub-btn-valid");			
			
		}
	//内容不为空按钮有效
			function setButtonAbled(n) {
				//alert(n);
				//回复按钮有效
					$("#pub-btn-top-"+n).addClass("add-pub-btn-valid")
		 			   					.removeClass("add-pub-btn-unvalid");				
				
			}
			
    NS_links_comment_top = {
		init: init

	};
    
})(jQuery);