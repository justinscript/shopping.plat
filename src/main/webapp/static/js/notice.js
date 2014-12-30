
/*
	*通知模块
	*NS_notice(Object)：外部接口，公共对象调用
*/
(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nNotice = i18n.notice;
				
		var guid = "";
		var pageIndex = 1;
		var curtPageIndex = 1;
		var curtPageSizes = 0;
		var sumPages = 0;
		var openState = false;//公告是否打开标识
		var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
		
		//鼠标经过公告的效果
		function noticeHover() {
			
			$(".message-readed").hover(function(){
				if(openState) return;//当公告内容打开时，不执行该hover操作									 
				$(this).css({"backgroundColor":"#e9f0f8"})
				
				
			},
			function() {
				if(openState) return;
				//if($(this).next(".notice-content").is(":hidden"))
				$(this).css({"backgroundColor":"#ffffff"});
				
			}
			)
			
			$(".message").hover(function(){
				if(openState) return;//当公告内容打开时，不执行该hover操作									 
				$(this).css({"backgroundColor":"#ffffdd"})
				
				
			},
			function() {
				if(openState) return;
				//if($(this).next(".notice-content").is(":hidden"))
				$(this).css({"backgroundColor":"#ffffdd"});
				
			}
			)
			
		}
		//其它的项保持原来的样式(/*其它的下拉显示隐藏*/)
		function otherChangeStyle($obj) {
			
			var siblings2 = $obj.parent().siblings(".li-selected");				
			
			siblings2.children(".notice-content").hide();
			
			siblings2.children().css({"backgroundColor":"#fff","padding":"9px 0 8px 5px"});
			
			siblings2.removeClass("li-selected");
			
			siblings2.addClass("line");		
			
		}
		//方法：打开或关闭公告内容
		function openContent() {
					
			$(".message-readed").click(function(){					
				
				var $obj = $(this);
				openState= true;

				if ($obj.next(".notice-content").is(":hidden")) {
				/*
				打开，获取公告详细内容
				*/
					
				guid = $("input:hidden",this).val();//该公告的ID(guid)
																								
					$obj.next(".notice-content").show();
					
					/*其它的下拉显示隐藏*/
					
					otherChangeStyle($obj);
									
					//--------------------
					
					$obj.parent().removeClass("line")
								.addClass("li-selected");
					$obj.css({"backgroundColor":"#e9f0f8","font-weight":"normal","padding":"7px 0 8px 3px","cursor":"pointer"});
		
					L.resizeLabiFrame();//自动适应高度	
																	
				
				} else {//关闭公告详细内容
					
					openState = false;
					$obj.parent().removeClass("li-selected")
									.addClass("line");
					$obj.css({"backgroundColor":"#fff","padding":"9px 0 8px 5px"})
							.next(".notice-content").hide()
							
					L.resizeLabiFrame();//自动适应高度
				}
				
										
			})		
			
					$(".message").click(function(){					
						
						var $obj = $(this);
						openState= true;
						//var siblings2;
						if ($obj.next(".notice-content").is(":hidden")) {
						/*
						打开，获取公告详细内容
						*/
							
						guid = $("input:hidden",this).val();//该公告的ID(guid)																						
							
							L.ajax({
								url : "/message/read?"+G.param({id: guid}),
								type:"POST",
								//data : "un[0].isRead=1&un[0].guid="+guid+"",
								success :  function(information){
											/**/											
											var info = information;
											$obj.next(".notice-content").show();
											
											$(".sum-count em").html(info.data);//未读数
											//页面右上角的通知数
											var dataitem = parseInt(info.data);
											var $notice = $("#notice-num-title");																						
											
											if(dataitem > 99){
												//$(".notice-num-title em").text("9");
												$notice.css("display", "inline-block")
																	  .children("em").text("99");
												$notice.children("i").css("display", "inline-block");
												
											} else {
											
												if(dataitem <= 0) {
													
													$notice.hide();
												} else {
													
												
													$notice.css("display", "inline-block")
											 						.children("em").text(dataitem);
													$notice.children("i").hide();
												}
										    }
																														
											
											otherChangeStyle($obj);
											//--------------------
											
											$obj.parent().removeClass("line")
														 .addClass("li-selected");
											
											$obj.css({"backgroundColor":"#e9f0f8","font-weight":"normal","padding":"7px 0 8px 3px","cursor":"pointer"})
												.removeClass("message")
												.addClass("message-readed");
											
											openState = true;
											noticeHover();
											L.resizeLabiFrame();//自动适应高度
											
									}
							})						
																	
						
						} else {//关闭公告详细内容
							
							openState = false;
							$obj.parent().removeClass("li-selected")
											.addClass("line");
							$obj.css({"backgroundColor":"#fff","padding":"9px 0 8px 5px"})
									.next(".notice-content").hide()
							noticeHover();		
							L.resizeLabiFrame();//自动适应高度
						}
						
												
					})
	}
	//只针对关闭按钮，关闭公告详细内容
	function closeNotice() {
		$(".closeNotice").click(function(){
			$(this).parent().parent().prev().click();
		})
	}
	//删除单条公告
	function deleteSingleNotice() {
				
		$(".deleteNotice").click(function(){
			//if(!confirm(i18nNotice.confirmTips(0))) {
			//	return;
			//}

			var submitUrl = "/message/del?"+G.param({id: guid});
			
			L.ajax({
				url : submitUrl,
				type:"POST",
				//data : "id"+,
				success :  function(info){
					if(info.code == ResultCodeSuccess) {//删除成功
						
						window.location.href = "/notice/1";
					} else {
						L.showTopTips(L.TIPS_TYPE.error, i18nNotice.allDelFailTips);
						return;
					}
				}
	   })	
	   
			
			//return false;
		})
	}
    
	//复选框全部选中
	function selectAllNotice() {
			
		$("#notice-page .l_ljm :checkbox, .head .l_ljm :checkbox").click(function(){
			
			//当通知列表为空时,不触发事件
			if($("#contanier_body :checkbox").length <= 0) {
				$(this).attr("checked",false);
				return;
			}
			
				if($(this).attr("checked"))	{										  
					$(".line :checkbox, .li-selected :checkbox").attr("checked",true);
					
					$("#notice-page .l_ljm :checkbox").attr("checked", true);
					$(".head .l_ljm :checkbox").attr("checked", true);

				} else {
					$(".line :checkbox, .li-selected :checkbox").attr("checked",false);
					
					$("#notice-page .l_ljm :checkbox").attr("checked", false);
					$(".head .l_ljm :checkbox").attr("checked", false);
				}

		})
		
	}
	
	//删除选中的所有通知
	function deleteSelectAllNotice() {
		
		$("#notice-page #delBtn2, .head #delBtn").click(function(){
			
			var strGuid = "",
				sum = 0;
			
			$("#contanier_body :checkbox:checked").each(function(){
				var guid = $(this).val();
				strGuid += guid + ",";
				sum++;
			})
			//提示请先选择要删除通知
			if (sum == 0) {
				L.showTopTips(L.TIPS_TYPE.error,i18nNotice.topTips);
				return;
			}
			if(!confirm(i18nNotice.confirmTips(sum))) {
				return;
			}
			
			strGuid = strGuid.substring(0, strGuid.length-1);
						
			var submitUrl = "/message/del?"+G.param({id: strGuid});
			
					L.ajax({
						url : submitUrl,
						type:"POST",
						//data : "id"+,
						success :  function(info){
							
							if(info.code == ResultCodeSuccess) {//删除成功
								
								window.location.href = "/notice/1";
								
							} else {
								L.showTopTips(L.TIPS_TYPE.error, i18nNotice.allDelFailTips);
								return;
							}
						}
			   })
			
		})
	}
	//设置通知为已读
	function setAllNoticeIsRead() {
		$(".head #readedBtn, #notice-page #readedBtn2").click(function(){
			
			var strGuid = "",
				sum = 0;
			$("#contanier_body :checkbox:checked").each(function(){
				var guid = $(this).val();
				strGuid += guid + ",";
				sum++;
			})
			//提示请先选择通知
			if (sum == 0) {
				L.showTopTips(L.TIPS_TYPE.error,i18nNotice.readTips);
				return;
			}
			strGuid = strGuid.substring(0, strGuid.length-1);
			
			var submitUrl = "/message/read?"+G.param({id: strGuid});
			
					L.ajax({
						url : submitUrl,
						type:"POST",
						success :  function(info){
							if(info.code == ResultCodeSuccess) {//设置已读成功
								L.showTopTips(L.TIPS_TYPE.success, i18nNotice.allReadSuccessTips);
								
								window.location.href = "/notice/"+pageIndex;
							} else {
								L.showTopTips(L.TIPS_TYPE.error, i18nNotice.allReadFailTips);
								return;
							}
						}
			   })			 
		})
		
	}
function showNoticePages(page, nextPage){
	
		if(page <= 1){
			$("#pre-btn").addClass("pre-a-valid")
						 .unbind();
		} else {
			$("#pre-btn").addClass("pre-a")
						 .removeClass("pre-a-valid")
						 .bind("click",function(){
							--pageIndex;
							location.href = "/notice/"+pageIndex;
							return false;
						})
						.hover(function(){
							$(this).addClass("pre-a-hover");
						},function(){
							$(this).removeClass("pre-a-hover")
							
						});
		}
		

		if(nextPage == "true"){
			$("#next-btn").addClass("next-a")
						  .removeClass("next-a-valid")
						  .bind("click",function(){
								++pageIndex;
								location.href = "/notice/"+pageIndex;
								return false;
							})
							.hover(function(){
								$(this).addClass("next-a-hover");
							},function(){
								$(this).removeClass("next-a-hover")
								
							});
		} else {

			$("#next-btn").addClass("next-a-valid")
						  .unbind();
		}
			
				
	}
	/**
		init初始化函数
		*参数一PageIndex，表示当前页码
		*sumCount，表示总的条数
		*curtPageSize，表示当前页显示的条数
	*/
	function init(obj) {
		
		$("#notice-page").css("border-top","0px solid #fff");
		noticeHover(); //鼠标经过公告的效果
		openContent(); //打开或关闭公告详细内容
		closeNotice(); //只针对关闭按钮，关闭公告详细内容
		deleteSingleNotice(); //删除单条公告	
		
		selectAllNotice(); //复选框全部选中公告
		deleteSelectAllNotice(); //删除选中的公告
		setAllNoticeIsRead();//设置公告全部为已读
		
		chouti.Init();
		
		pageIndex = obj.pageIndex;
		var nextPage = obj.nextPage;	
		
		//showNoticePages(pageIndex, nextPage);	//翻页
																	
		//阻止复选框冒泡事件				
		$(".message :checkbox, .message-readed :checkbox").click(function(event){
			event.stopPropagation();
			$("#notice-page .l_ljm :checkbox, .head .l_ljm :checkbox").attr("checked", false);//当单个复选框取消选中   全选复选框取消全选状态
			
			//当单个复选框全选中时，全选复选框也自动选中
			if($("#contanier_body :checkbox:checked").length == $("#contanier_body :checkbox").length)
				$("#notice-page .l_ljm :checkbox, .head .l_ljm :checkbox").attr("checked", true);
		})
		
	}
	
	//对外接口,公共对象调用
    NS_person_notice = {
		init: init

	}
})(jQuery);