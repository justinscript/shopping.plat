
(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nNotice = i18n.notice;
		var ResultCodeSuccess = L.RESULT_CODE.success;
			
		var pageIndex = 0;
		var jid = "";
	
	function init(obj) {
		
		pageIndex = obj.pageIndex;
		var nextPage = obj.nextPage;
		
		jid = obj.jid;//用户id
		
		chouti.showPublishWindow("#pubTabZixun");
		chouti.Init();
		oprateDigg();	//顶或踩
	}
	//顶或踩
	function oprateDigg() {
		
		$("a.ding, a.cai").click(function(){
			
			var $this = $(this);
			
			if($this.attr("class") == "ding") {
				var vote = 1;
			} else {
				var vote = -1;
			}
			
			var linkId = $this.siblings("em").html();
			var jid = $("#hidjid").val();
			var id = $this.siblings("i").html();
			
			var submitUrl = "/comments/vote";			
			
			var options = {
					url : submitUrl,
					type:"POST",
					data:G.param({linkId: linkId, id:id, jid:jid, vote:vote}),
					success :  function(info){																		

								if(info.code == ResultCodeSuccess) {		
									
									if(vote == 1) {
										
										$($this).siblings(".ding-num").html("["+info.data+"]");//显示投票数
										$($this).css({"cursor":"default", "color":"#989898"})
												.html("已顶")
												.parent().children("a").unbind();
										$($this).siblings(".cai").css({"cursor":"default", "color":"#989898"})
												
									} else {
										$($this).siblings(".cai-num").html("["+info.data+"]");//显示投票数
										$($this).css({"cursor":"default", "color":"#989898"})
												.html("已踩")
												.parent().children("a").unbind();
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
		
	
    NS_person_comment = {
		init: init
		//getNotice:getNotice
	}
})(jQuery);