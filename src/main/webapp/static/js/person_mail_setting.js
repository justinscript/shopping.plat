
(function( $, undefined ){

	var G = $.gozap,
			L = G.labi,
			i18n = L.i18n,
			i18nregister = i18n.register;
			var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
	//当文本框失去焦点时，出现错误提示
	
	function inputTextBlurTips() {
		
		//联系邮箱(判断邮箱是否存在)
		regCheckRule.secretmailBlurNotTips("exsit");
		//新密码
		regCheckRule.oldpasswordBlurTips();
		
		//得到焦点
		$("#old_password").keydown(function(event){
			
			if (event.keyCode == 13) {
				
				$(this).blur();
				
				if(userOldPassCorss) {
					
					$("#saveMailBtn").click();//提交表单
				}
			}
		})	
		
		$("#secret_mail").focus();
		
	}
	
	//提交修改邮箱表单
	function submitModifyMailForm() {
		
		$("#saveMailBtn").click(function(){										 
			
			userOldPassCorss=false;
			userMailCorss = false;
			
			regCheckRule.checkUSerSecretMailExist("exsit");
			
			regCheckRule.secretmailBlurTips("exsit");		//邮箱验证	
			//密码验证
			if(!regCheckRule.checkUSerOldPassRule()) {
				return;
			}	
			regCheckRule.checkUSerOldPassExsit();
			
			if(userOldPassCorss && userMailCorss) {
				allSubmit = true;
			}
			if(allSubmit) {//只有各个控件都正确合法时才可以提交
				
				userOldPassCorss = false;
				userMailCorss = false;
				allSubmit = false;
				
				var secret_mail = $("#secret_mail").val();
				var newPass = $("#old_password").val();
							
				var submitUrl = "/profile/email/update";
				
				$("#saveMailBtn").hide();//隐藏登录按钮
				$(".loading-ico").show();//显示loading
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({password: newPass, email: secret_mail}),
					success :  function(info){													
							
							$("#saveMailBtn").show();
							$(".loading-ico").hide();
							
							if(info.code == ResultCodeSuccess) {		//表示成功						
								
								L.showTopTips(L.TIPS_TYPE.success, info.data.extMst);//提示保存成功
								//window.location.reload();
								//清空输入框
								//alert($("#secret_mail").val());
								$("#userMail").html($("#secret_mail").val());
								$("#old_password").val("");
								$("#secret_mail").val("");
								$(".sucess-ico").hide();
								
								
							} else {
								L.showTopTips(L.TIPS_TYPE.error, info.data.extMst);//提示保存失败								
								//清空输入框
								$("#old_password").val("");
								$("#secret_mail").val("");
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
		
		submitModifyMailForm();	//提示修改邮箱
		
		inputTextBlurTips();//当文本框失去焦点时，出现错误提示框
		
		chouti.Init();
		chouti.hidPublishWindow();//隐藏“分享新发现”按钮
		
	}
	
	//对外接口,公共对象调用
	NS_person_mail_setting = {
		init: init
	}
})(jQuery);