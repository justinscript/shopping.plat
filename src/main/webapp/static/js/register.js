/** 子页面必须实现的方法,对手机状态改变的监听函数 */

function onStatusChange(imei, state){
}
/*
	*用户注册模块
	*NS_register(Object)：外部接口，公共对象调用
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
		regCheckRule.destJidBlurTips();
		
		/*
			密码输入框
		*/
		//得到焦点
		regCheckRule.passwordBlurTips();
		
		/*
			输入确认密码
		*/
		//得到焦点
		regCheckRule.confirmpasswordBlurTips();
		
		/*
			输入保密邮箱
		*/
		//得到焦点
		regCheckRule.secretmailBlurTips();
		/*
			输入验证码
		*/
		//得到焦点
		regCheckRule.verifycodeBlurTips("#registerBtn");
		
		$("#destJid").focus();
	}
	
	
	
	//显示如何使密码更安全提示框
	function showTipsMoreSafe() {
		$("a.password-safe").hover(function(){
			$("#tips_passwordMoreSafe").show();
		},function(){
			$("#tips_passwordMoreSafe").hide();
		})
	}
	//提交表单
	function submitForm() {
		$("#registerBtn").click(function(){										 
			
			regCheckRule.checkUSerNameRule();		//用户名验证
			regCheckRule.checkUSerPassRule();		//密码验证
			regCheckRule.checkUSerSamePassRule();	//确认密码
			regCheckRule.checkUSerSecretMailRule();	//保密邮箱验证
			regCheckRule.checkVerfifyCodeRule();		//验证码验证
			
			$("#tips_termsOfserviceError").hide();						 
			if(!$(".terms-service :checkbox").attr("checked")) {
				$("#tips_termsOfserviceError").show();
				return;
			}
			if(userNameCorss && userPassCorss && userSamePassCorss && userMailCorss && userVertifyCorss) {
				userPliceCorss = true;//辟免重复提交
				allSubmit = true;
			}
			if(allSubmit) {//只有各个控件都正确合法时才可以提交
				userNameCorss = false;
				userPassCorss = false;
				userSamePassCorss = false;
				userMailCorss = false;
				userVertifyCorss = false;
				allSubmit = false;
				
				$(".register-btn").hide();//隐藏注册按钮
				$(".loading-ico").show();//显示loading
				window.setTimeout(function(){
						$(".register-btn").css("display","inline-block");
						$(".loading-ico").hide();
						$("#formRegister").submit();
						return false;
				},1000);
				
			}
		})
	}
	/**
		init初始化函数		
	*/
	function init(regState) {
		
		//当注册失败时，显示错误信息,及给用户名和邮箱赋值
		if(regState == '' || regState == undefined) {			
			
			} else {
				var resultInfo = regState.result.code;
				if(resultInfo != ResultCodeSuccess) {
					
					L.showTopTips(L.TIPS_TYPE.error, regState.result.ext.msg);
					$("#destJid").val(regState.result.ext.destJid);
					$("#secret_mail").val(regState.result.ext.regEmail);
					
				}
			}
		
		regCheckRule.initTipsBind();//提示框对象初始化
		regCheckRule.inputTextFocusorBlur();
		inputTextBlurTips();//当文本框失去焦点时，出现错误提示
		showTipsMoreSafe();//显示如何使密码更安全提示框
		submitForm();		
		
	}
	
	//对外接口,公共对象调用
	NS_register = {
		init: init
	}
})(jQuery);