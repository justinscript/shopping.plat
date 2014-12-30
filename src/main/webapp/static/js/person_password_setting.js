
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
			密码输入框
		*/
		//旧密码
		regCheckRule.oldpasswordBlurTips();
		
		//新密码
		regCheckRule.passwordBlurTips();
		//确认新密码
		regCheckRule.confirmpasswordBlurTips();
		
		//得到焦点
		$("#confirm_password").keydown(function(event){
			
			if (event.keyCode == 13) {
				
				$(this).blur();
				
				if(userSamePassCorss) {
					
					$("#savePasswordBtn").click();//提交表单
				}
			}
		})	
		
		$("#old_password").focus();
		
	}
	
	
	//提交修改密码表单
	function submitModifyPasswordForm() {
		
		$("#savePasswordBtn").click(function(){										 
			
			regCheckRule.oldpasswordBlurTips();		//旧密码验证
			
			regCheckRule.checkUSerPassRule()	//新密码验证						
				
			//判断密码输入是否一至
			regCheckRule.checkUSerSamePassRule()
			
			if(userPassCorss && userSamePassCorss && userOldPassCorss) {
				allSubmit = true;
			}
			if(allSubmit) {//只有各个控件都正确合法时才可以提交
				
				userPassCorss = false;
				userSamePassCorss = false;
				userOldPassCorss = false;
				allSubmit = false;
				
				var oldPass = $("#old_password").val();
				var newPass = $("#new_password").val();
				var confirmPass = $("#confirm_password").val();
				
				var submitUrl = "/profile/password/update";
				
				$("#savePasswordBtn").hide();//隐藏登录按钮
				$(".loading-ico").show();//显示loading
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({oldPwd: oldPass, pwd: newPass}),
					success :  function(info){
							
							$("#savePasswordBtn").show();
							$(".loading-ico").hide();
							
							var extMst = info.data.extMst;
							if(info.code == ResultCodeSuccess) {	//表示成功
																
								//window.location.reload();
								L.showTopTips(L.TIPS_TYPE.success, extMst);//提示保存成功
								//清空输入框
								$("#old_password").val("");
								$("#new_password").val("");
								$("#confirm_password").val("");
								$(".sucess-ico").hide();
								
							} else {
								
								L.showTopTips(L.TIPS_TYPE.error, extMst);//提示保存失败
								//清空输入框
								$("#old_password").val("");
								$("#new_password").val("");
								$("#confirm_password").val("");
								
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
	function init(sendState) {
		
		regCheckRule.initTipsBind();//提示框对象初始化
		regCheckRule.inputTextFocusorBlur();
		
		submitModifyPasswordForm();	//提示修改密码
		inputTextBlurTips();//当文本框失去焦点时，出现错误提示框
		
		chouti.Init();
		chouti.hidPublishWindow();//隐藏“分享新发现”按钮
		
	}
	
	//对外接口,公共对象调用
	NS_person_password_setting = {
		init: init
	}
})(jQuery);