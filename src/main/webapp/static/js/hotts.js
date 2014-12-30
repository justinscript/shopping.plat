(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n;
		var ResultCodeSuccess = L.RESULT_CODE.success,
			pageIndex = 0,timePool = null;
		
	function init(obj) {
		
		pageIndex = obj.pageIndex;	
		
		chouti.lazyLoadImg("#content-list .news-pic img");	//图片延时加载
			
		chouti.Init();
		chouti.showPublishWindow("#pubTabZixun");		//点击“分享新发现”按钮后，弹出发布框
		chouti.vote('');	//推荐操作
		chouti.cancelVote();	//取消推荐
		chouti.addCollect();	//收藏操作
		chouti.removeCollect();	//收藏操作
		chouti.shareweibo('');	//分享操作
		
		//发布时间每一分钟变化一次
		chouti.timeChange();
		
		//新榜入热榜黄色提示框事件
		yellowIntohotBoxHover();
		
		//页面滚动时，新榜入热榜黄色提示框处于最顶端
				
		$(window).scroll(function(){
			
			//133  表示该黄色提示框距页面最顶端的高度
			
			var manConWidth = yellowMsgOffset();
			 			 
			if($(this).scrollTop() > 133) {
				
				$("#yellow-msg-box-intohot").css({"position": "fixed","top": "0px", "left": manConWidth+"px", "z-index": "1"});
				
			} else {
				
				$("#yellow-msg-box-intohot").css({"position": "relative","left": "0px"});
			}
			
		})	
		
		$(window).resize(function() {
			
			var manConWidth = yellowMsgOffset();
			 
			 if($(this).scrollTop() > 133) {
				 
				 $("#yellow-msg-box-intohot").css("left", (manConWidth)+"px");
			 }
			
		});
		
	}
	
	//固定黄色提示框的位置
	function yellowMsgOffset() {
		
		//alert($("#yellow-msg-box-intohot").offset().left);
		 var manConWidth = $(".main-content").offset().left + 28 - document.body.scrollLeft;
		 		 
		 var userAgentInfo = navigator.userAgent.toLowerCase();
		 
		 if(userAgentInfo.indexOf("firefox") > 0) {
			 
			 var manConWidth = $(".main-content").offset().left + 28 - document.documentElement.scrollLeft;
		 }
		 
		 if("\v"=="v") {	//IE
			
			 var manConWidth = $(".main-content").offset().left + 28 - document.documentElement.scrollLeft;
		 }
		 
		 return manConWidth;
		 
	}
	//新榜入热榜黄色提示框事件
	function yellowIntohotBoxHover() {
		
		
		//点击查看新榜入热榜，显示列表内容
		$("#yellow-msg-box-intohot").click(function(){

			//对新榜入热榜数据清0处理
			$("#newIntoHotCount").val(0);
			
			//如果是第1页，则局部刷新，如果是在其它页点击后则跳转到第1页
			if(pageIndex > 1) {
				
				window.location.href = "/all/hot/recent/1";
				
			} else {
							
				//$(window).scrollTop(0);	
				/*
				$("body,html").animate({scrollTop:0},200,'',function(){
					$(this).hide();	//隐藏黄色提示
					
				});	//滚动到顶部
				*/
				$(this).hide();	//隐藏黄色提示
				
				$("body,html").animate({scrollTop:0},200);	//滚动到顶部
				
				ajaxLoadItems();	//异步显示列表内容
			}			
			
		}).hover(function(){//鼠标放上去样式变化
			
			$(this).addClass("yellow-comment-msg-box-hover");			
			
		},function(){
			
			$(this).removeClass("yellow-comment-msg-box-hover");
		})
	}
	
	//点击查看新榜入热榜，显示列表内容
	function ajaxLoadItems() {
		
		$("#load_hotitems").css({"display": "inline"});		
		
		var submitUrl = "/hot/json";
		var str = "";
		
		L.ajax({
			
					url : submitUrl,
					type:"GET",
					success :  function(info){											
					
				if(info.code == ResultCodeSuccess) {						
							
					var datas = info.data;
					
					if(datas.items >= 1) {
												
						$('#maxid').val(datas.maxid);
						var dataList = datas.dataList;
						
						//显示加载的html数据
						$("#content-list").html(dataList);
						//隐藏loading
						$("#load_hotitems").hide();
						
						//突发新闻下部border-bottom变成直线
						var $tufa = $("#content-list .item:first");
						
						if($tufa.find("i.tufa").length > 0) {
							$tufa.css({"border-bottom": "1px solid #ccc", "background": "none"});
						}						
						
						chouti.vote('');	//最热推荐操作
						chouti.cancelVote();	//取消推荐
						chouti.addCollect();	//收藏操作
						chouti.removeCollect();	//收藏操作
						
						chouti.shareweibo('');	//分享操作
						
						chouti.playVido();	//展开视频
						chouti.initImgClickEvent();
						//推荐按钮显示title
						$("a.digg-a").hover(function(){
						
							$(this).attr("title", "推荐");
						
						},function(){
						
							$(this).attr("title", "");
						
						})
						//取消推荐按钮显示title
						$("a.isVoted").hover(function(){
						
							$(this).attr("title", "取消推荐");
						
						},function(){
						
							$(this).attr("title", "");
						
						})
						//显示title
						$("a.discus-a").hover(function(){
						
							$(this).attr("title", "评论");
						
						},function(){
						
							$(this).attr("title", "");
						
						})						
						
						//清空时间轮循
						chouti.clearTimeInterval();
						oldTime = "";
						
						//发布时间每一分钟变化一次
						chouti.timeChange();
						
						//初始化评论页面
						NS_links_comment_top.init();
						
						
					}
				} else {
						
						L.showTopTips(L.TIPS_TYPE.error, "加载失败，请稍候再试!");//提示失败信息
						$("#load_hotitems").hide();
						return;
						
					}
				}
		})
		
	}
	
	
	
	
	
    NS_links_hotts = {
		init: init,
		yellowIntohotBoxHover: yellowIntohotBoxHover
	};
})(jQuery);