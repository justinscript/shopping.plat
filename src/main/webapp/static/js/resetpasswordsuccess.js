
/*
	*设置密码成功模块
	*NS_resetpasswordsuccess(Object)：外部接口，公共对象调用
*/
(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nregister = i18n.register;
		var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
	
	//打开邮箱登录地址
	function openMailUrl(mailUrl) {
		$("#loginMailBtn").attr("href",mailUrl);										 
			
	}
	/**
		init初始化函数		
	*/
	function init(sendState) {
		
		chouti.Init();
		chouti.hidPublishWindow();//隐藏“分享新发现”按钮
		
		//显示保密邮件
						
		if(sendState == '' || sendState == undefined || sendState == null) {			
			
			} else {//取得邮箱名称
				
				var resultInfo = sendState.result.code;
				//alert(resultInfo);
				if(resultInfo == ResultCodeSuccess) {
					//alert(ResultCodeSuccess);
					var mailName = sendState.result.data.mail;
					
					//alert(sendState.result.data.mailPath);
					
					var pix1 = mailName.substring(0,mailName.indexOf("@"));
					var pix2 = mailName.substring(mailName.indexOf("@"));
					var simpleMail = "";
					if(pix1.length <= 5) {
						simpleMail = pix1.substr(0,1) + "***" + pix1.substr(pix1.length-1,1);
					} else {
						simpleMail = pix1.substr(0,2) + "***" + pix1.substr(pix1.length-1,1);
					}
					$("#mailName").html("<a href='"+sendState.result.data.mailPath+"' target='_blank' class='rega'>" + simpleMail + pix2 + "</a>");
					
					openMailUrl(sendState.result.data.mailPath);//打开邮箱登录地址
				}
				
			}
		
				
	}
	//对外接口,公共对象调用
	NS_resetpasswordsuccess = {
		init: init
	}
})(jQuery);