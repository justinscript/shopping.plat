
/*
	*重置密码模块
	*NS_resetpassword(Object)：外部接口，公共对象调用
*/
(function( $, undefined ){

	var G = $.gozap,
			L = G.labi,
			i18n = L.i18n,
			i18nregister = i18n.register;
			var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
	//当文本框失去焦点时，出现错误提示
	
	function inputTextBlurTips() {
		
		/*
			用户名输入框
		*/
		//得到焦点
		regCheckRule.destJidBlurTips("resetpassword");
				
		/*
			输入验证码
		*/
		//得到焦点
		regCheckRule.verifycodeBlurTips("#sendMailBtn");
		
		$("#user_destJid").focus();
		
	}
	
	
	//提交表单
	function submitForm() {
		
		$("#sendMailBtn").click(function(){										 
			
			//用户名验证
			regCheckRule.checkUSerNameExsit()
					
			//验证码验证
			regCheckRule.checkVerfifyCodeRule()
						
			if(userNameCorss && userVertifyCorss) {
				allSubmit = true;
			}
			if(allSubmit) {//只有各个控件都正确合法时才可以提交
				userNameCorss = false;
				userVertifyCorss = false;
				allSubmit = false;			
				
				var jid = $.trim($("#user_destJid").val());
				var code = $("#verify_code").val();
				code = MD5(code);
				var submitUrl = "/passport/lostPwdSendEmail.do";
				
				//alert(code);
				
				$(".sendMail-btn").hide();//隐藏发送按钮
				$(".loading-ico").show();//显示loading
				
				L.ajax({
						url : submitUrl,
						type:"POST",
						data:G.param({jid: jid,code: code}),
						success :  function(info){											
								
							if(info.code == ResultCodeSuccess) {
								
								var cachekey = info.data.cachekey;
								var cacheValue = info.data.cacheValue;
								window.location.href = "/passport/lostPwdEmail.do?cachekey="+cachekey+"&cacheValue="+cacheValue;
							
							} else {
								
								$(".sendMail-btn").show();
								$(".loading-ico").hide();
								
								var extMst = info.data.extMst;
								if(extMst != "") {
									L.showTopTips(L.TIPS_TYPE.error, extMst);
									return false;
								}
								if(info.code == 21120) {
									$("#noMail").html(info.message)	//该用户没有邮箱提示
											.show();
								}  else {
									L.showTopTips(L.TIPS_TYPE.error, info.message);
								}
								
								return false;
							}
						}
				})			
				
			}
			
			
			
			
		})
	}
	/**
		init初始化函数		
	*/
	function init() {
		
		regCheckRule.initTipsBind();//提示框对象初始化
		regCheckRule.inputTextFocusorBlur();
		inputTextBlurTips();//当文本框失去焦点时，出现错误提示框
		submitForm();	
		chouti.Init();
		chouti.hidPublishWindow();//隐藏“分享新发现”按钮
		
	}
	
	//对外接口,公共对象调用
	NS_resetpassword = {
		init: init
	}
})(jQuery);