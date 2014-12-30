/*
 * 现在各个导航页的JS文件统一放到该JS文件下
 * 各个导航页的执行，进入资讯，段子，谣言，图片页时代码初始化
 * */
(function( $, undefined ){
	
	var G = $.gozap,
	L = G.labi,
	ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999

function init(obj) {
		
		searchSubmit(obj);	//搜索（搜索页面用到）
	
		chouti.lazyLoadImg("#content-list .news-pic img");	//图片延时加载
		
		chouti.Init();
		
		var zui = {"hot": "最热","new": "最新","digg": "推荐","publish": "发布","search": "搜索"};
		
		var anysub = {"all": "","news": "买买买","scoff": "海淘转让区","rumor": "谣言","pic": "发现","tec": "问答社","pub": "公众场合不宜","ask": "五元团","person": ""};
		
		var choutiTip = "买买君热榜";
					
		var kindname = anysub[obj.subject];
		
		chouti.top10name(kindname);	//top10标题名称
		
		chouti.showPublishWindow("#pubTabZixun");		//点击“分享新发现”按钮后，弹出发布框
		
		chouti.vote('');	//推荐操作
		chouti.cancelVote();	//取消推荐操作
		chouti.addCollect();	//收藏操作
		chouti.removeCollect();	//收藏操作
		
		chouti.shareweibo('');	//分享操作
		
		//发布时间每一分钟变化一次
		if(obj.sort != "default") {
			
			chouti.timeChange();
		}
				
		chouti.initImgClickEvent();
		
		//显示发私信弹出框		
		showSixinBox();
		
		
	}

//关闭发布框
function closeDialog() {
	
	$("#sixin-close").click(function(){
		
		//隐藏发布框
		$("#sixin-dialog").hide();
		
		$("#mask").hide()
				.remove();		
		
		//显示聊天室
		$("#chatIframe").css({"height": "475px","width":"300px"});
		
		$("#sixinContent").val("");
		
	})
}
	//显示发私信弹出框
	function showSixinBox() {
		
		$("#sendToPersonBtn").click(function(){
            
			
			 var submitUrl = "/link/share";
	            
	            L.ajax({
	                url: submitUrl,
	                success: function(info){
	                
	                    var code = info.code;
	                    
	                    if (code == "9999") {
	                    
	                    	showsixinBox();
	                        
	                    }
	                    else {
	                    	
	                    	if (code == "-1" || code == "20006") {
	                    		
	                    		chouti.showLoginBox();
	                    		return;
	                    	}
	                    	
	                    	L.showTopTips(L.TIPS_TYPE.error, info.message);
	                    	
	                    	return;
	                    		
	                        
	                    }
	                }
	            })
	            
            
		})
		
		
	}
	
	function showsixinBox() {
		
		chouti.showMask("#sixin-dialog", "top"); //显示meng板

        var offsetH = 120;
        
        $("#mask").show();
        $("#sixin-dialog").show()//显示对话框
        					.css("top", offsetH + "px");	
		
        $("#sixinContent").val("")
        				 .focus();
        
        sendSixinRequest();
		
		chouti.lahei();
		chouti.laHeiRemove();
		
        closeDialog();
        
      //添加文本框的回车事件
		$("#sixinContent").unbind().keydown(function(event){
			
			if(event.ctrlKey && event.keyCode == 13) {
					
					$("#person_mail_btn").click();
			}
		})
        
	}
	
	//发私信
	function sendSixinRequest() {
	
	$("#person_mail_btn").unbind().click(function(){
		
	var $this = $(this);
	
	var submitUrl = "/letter/add.do";
	var content = $.trim($("#sixinContent").val());
	var otherJid = $this.attr("otherJid");
	
	var $obj = $("#sixinContent");
	
	//首先判断是否为空，闪烁提示
	if(content == "") {
		
		chouti.shake($obj, "flash-sixin", 3);
		return;
	}
	
	$this.hide();
	
	$("#privateMailLoading").show();
	
	L.ajax({
		url : submitUrl,
		type:"POST",
		data:G.param({otherJid: otherJid, content:content}),
		success :  function(info){
			
			if(info.code == ResultCodeSuccess) {	//发送成功
				
				L.showTopTips(L.TIPS_TYPE.success,  "发送成功");
				
				$("#sixin-dialog").hide();
				
				$this.show();
				
				$("#privateMailLoading").hide();
				
				 $("#mask").hide();
				
			} else {
				
				L.showTopTips(L.TIPS_TYPE.error, info.message);
				$this.show();
				$("#privateMailLoading").hide();
				
				return;
			}
		}
	})
	
	})
}
	//搜索
	function searchSubmit(obj) {
		
		var sortStr = {"default":"相关性", "time":"最新", "score":"最热"};
		
		var timeStr = {"all":"全部", "1d":"24小时", "3d":"三天", "7d":"一周", "30d":"一月", "365d":"一年"};
		
		//记住搜索条件类别
		var sortType = obj.sort;
		
		var timeType = obj.timeType;
		
		$("#sort").val(sortType);
		$("#time").val(timeType);
		
		$("#orderBys").text(sortStr[sortType]);
		
		$("#timeBys").text(timeStr[timeType]);
		
		var shuxu = sortStr[sortType];
		
		$("#orderByBox a[lang='"+sortType+"']").hide()
											  .siblings().css("display","block");
		
		$("#timeByBox a[lang='"+timeType+"']").hide()
		  									 .siblings().css("display","block");
		
		//提交搜索
		$("#searchBtn").click(function(){
			
			var value = $("#txtSearch").val();    
			
			//判断是否含有特殊字符
			reg=/^[a-zA-Z0-9\u4e00-\u9fa5\s]+$/;
		
			if(!reg.test(value)) {
	
				$("#teshuZi").show();
				return;
				
			} else {
				$("#teshuZi").hide();
			}
				
			$("#txtSearch").val(value);			
			$("#searchFrm").submit();
			return false;
		})
		
		/*搜索页面事件操作*/
				
		//点击排序框
		$("#orderBy").click(function(){
			
			var $this = $(this);
			
			var $left = $this.offset().left;
			var $top = $this.offset().top;
			
			$top = $top + 28;
			
			$("#orderByBox").show()
							.css({"left":$left+"px", "top":$top+"px"});
						
			$("#timeByBox").hide();
			
			return false;
		})
		//排序选择其中的选项
		$("#orderByBox a").click(function(){
			
			var $this = $(this);
			
			var num = $this.index();
			
			var value = $this.attr("lang");
			
			var textVal = $this.text();
			
			
			
			$("#orderBys").text(textVal);
			
			$("#orderByBox").hide()
							.children(":eq("+num+")").hide()
			 										 .siblings().css("display","block");
			
			$("#sort").val(value);
			
			$("#orderBy").attr("num", num);
			
			//提交搜索
			$("#searchFrm").submit();
			
			return false;
			
		})
		//点击时间范围选择框
		$("#timeBy").click(function(){
			
			var $this = $(this);
			
			var $left = $this.offset().left;
			var $top = $this.offset().top;
			
			$top = $top + 28;
			
			$("#timeByBox").show()
							.css({"left":$left+"px", "top":$top+"px"});
			
			$("#orderByBox").hide();
			
			return false;
			
		})
		
		//时间范围其中的选项
		$("#timeByBox a").click(function(){
			
			var $this = $(this);
			
			var value = $this.attr("lang");
			
			var textVal = $this.text();
			
			var num = $this.index();
			
			$("#timeBys").text(textVal);
			
			$("#timeByBox").hide()
							.children(":eq("+num+")").hide()
			 					  					 .siblings().css("display","block");
			
			$("#time").val(value);
			
			$("#timeBy").attr("num", num);
			
			//提交搜索
			$("#searchFrm").submit();
			
			return false;
		})
		
		$(document).click(function(){
			
			$("#timeByBox").hide();
			$("#orderByBox").hide();
		})
	}

	function HTMLEnCode(str)
	{
	   var s = "";
	   if (str.length == 0) return "";
	   s = str.replace(/&/g, "&gt;");
	   s = s.replace(/</g,   "&lt;");
	   s = s.replace(/>/g,   "&gt;");
	   s = s.replace(/ /g,   "&nbsp;");
	   s = s.replace(/\'/g,  "&#39;");
	   s = s.replace(/\"/g,  "&quot;");
	   s = s.replace(/\n/g,  "<br>");
	   return s;
	}
	function HTMLDeCode(str)
	{
	   var s = "";
	   if (str.length == 0) return "";
	   s = str.replace(/&gt;/g, "&");
	   s = s.replace(/&lt;/g,   "<");
	   s = s.replace(/&gt;/g,   ">");
	   s = s.replace(/&nbsp;/g,   " ");
	   s = s.replace(/&#39;/g,  "\'");
	   s = s.replace(/&quot;/g,  "\"");
	   s = s.replace(/<br>/g,  "\n");
	   return s;
	}
	
    NS_links_nav = {
		init: init

	}
})(jQuery);