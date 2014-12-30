/** 子页面必须实现的方法,对手机状态改变的监听函数 */

function onStatusChange(imei, state){
}
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
			输入保密邮箱
		*/
		//得到焦点
		
		regCheckRule.secretmailBlurTips("finduser");		
		
		$("#secret_mail").keydown(function(event){
			
			if (event.keyCode == 13) {
				$(this).blur()
				if(userMailCorss) {
					
					$("#sendMailBtn").click();//提交表单
				}
			}
		})		
		
		$("#secret_mail").focus();
	}
	
	//提交表单
	function submitForm() {
		
		//根据复选框值，1表示即发送用户名邮件，也发送重置密码邮件
		//2表示只发送用户名邮件
		$("#chkRsetPassword").click(function(){
			if($(this).attr("checked")) {
				$(this).val(1);
				
			} else {
				$(this).val(0);
			}
			
		})
		$("#sendMailBtn").click(function(){										 
			
			//邮箱验证
			regCheckRule.checkUSerSecretMailExist("");		
			
			if(userMailCorss) {//只有各个控件都正确合法时才可以提交
				
				userMailCorss = false;			
				
				var email = $("#secret_mail").val();
				
				var lw_ck = $("#chkRsetPassword");
				var isReset = 0;
				
				if (lw_ck.attr("checked")) {
					
					lw_ck.val("1");
					isReset = 1;
					
				}	else {
					isReset = 0;
				}
				
				var submitUrl = "/profile/user/password/lost";
				
				$("#sendMailBtn").hide();//隐藏登录按钮
				$(".loading-ico").show();//显示loading
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({email: email, isReset: isReset}),
					success :  function(info){
							
							$("#sendMailBtn").show();
							$(".loading-ico").hide();
							//清空输入框
							$("#secret_mail").val("");
													
							var extMst = info.data.extMst;
							if(info.code == ResultCodeSuccess) {
																
								var cachekey = info.data.cachekey;
								var cacheValue = info.data.cacheValue;
								window.location.href = "/profile/user/password/back?cachekey="+cachekey+"&cacheValue="+cacheValue;
								
							} else {
								
								
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
	NS_searchusername = {
		init: init
	}
})(jQuery);