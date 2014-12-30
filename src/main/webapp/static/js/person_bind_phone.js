
(function( $, undefined ){

	var G = $.gozap,
			L = G.labi,
			i18n = L.i18n,
			i18nregister = i18n.register;
			var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
			
			var sendT = true, bindT = true;	//发送按钮可点击(true)及不可点击(false)
	//当文本框失去焦点时，出现错误提示
	
	function inputTextBlurTips(bind) {
		
		//手机号
		regCheckRule.phoneBlurTips();
		//验证码
		//regCheckRule.verifycodeBlurTips("#sendCodeBtn");
		$("#verify_code").keydown(function(event){
			
			if (event.keyCode == 13) {
				
				//if(userPhoneCorss) {
					
					$("#sendCodeBtn").click();//提交发送
				//}
			}
		})		
		$("#sms_code").keydown(function(event){
			
			if (event.keyCode == 13) {				
					
					$("#bindPhoneBtn").click();//提交发送
				
			}
		})		
		//短信验证码
				
		$("#phoneCode").focus();
		
		//绑定按钮置灰
		bindBtnUnvalid(false);
		
		//解除绑定
		unBind();
		//重新绑定
		repeatBind();
		
	}
	//解除手机绑定事件
	function oprateUnBind() {
		
		var submitUrl = "/profile/unbind";				
		
		L.ajax({
			url : submitUrl,
			type:"POST",
			success :  function(info){														
					
					if(info.code == ResultCodeSuccess) {																						
						
						window.location.reload();
													
					} else {
						
						L.showTopTips(L.TIPS_TYPE.error, info.message);//提示解除绑定失败
						
						return false;
					}
			}
		})	
	}
	//解除绑定
	function unBind() {
		
		$("#unbindBtn").click(function(){
			
			unbindDialogActon("unbind");
			
		})
	}
	//重新绑定
	function repeatBind() {
		
		$("#repeatbindBtn").click(function(){
						
			unbindDialogActon("repeat");
		})
	}
	
	function unbindDialogActon(st) {
		
		if(st == "repeat") {
			
			$("#unbind-msg-title").html("重新绑定");
			$("#unbind-msg-tip").html("您确定要重新绑定吗？");
		} else {
			
			$("#unbind-msg-title").html("解除绑定");
			$("#unbind-msg-tip").html("您确定要解除绑定吗？");
		}		
		
		//--显示框	---------------------------------------
		chouti.showMask("#unbind-phone-dialog","");	//显示meng板
		//$("#mask").fadeIn("1",function(){
			$("#mask").show();
			$("#unbind-phone-dialog").show();	
			
		//});		
		//------------------------------------------------
		
		$("#unbindBtnOk").click(function(){
			oprateUnBind();	//解除手机绑定
		})
		
		//--隐藏框	---------------------------------------
		$("#cancelbindBtn, #unbind-btn-close").click(function(){

			//隐藏框
			$("#unbind-phone-dialog").hide();
			
			//$("#mask").fadeOut("1",function(){
			//移除meng板
				$("#mask").hide();
				$("#mask").remove();
			//});
			
		})
		
	}
	//绑定按钮置灰及有效
	function bindBtnUnvalid(valid) {
		
		if(valid) {//绑定按钮有效
			
			$("#bindPhoneBtn").css({"background-position": "0 -310px", "cursor": "pointer"});
			$("#bindPhoneBtn .btn-2").css({"background-position": "right -310px"});
			
			//短信验证输入框有效
			$("#sms_code").attr("disabled", false)
						  .css("background-color", "#fff");
			bindT = true;
			
		} else {//绑定按钮置灰
		
			$("#bindPhoneBtn").css({"background-position": "0 -376px", "cursor": "default"});
			$("#bindPhoneBtn .btn-2").css({"background-position": "right -376px"});
			
			$("#sms_code").val("");
			
		//短信验证输入框置灰
			$("#sms_code").attr("disabled", true)
					  		.css("background-color", "#ccc");
			bindT = false;
		}
	}
	//发送按钮置灰及有效
	function sendBtnUnvalid(valid) {
		
		if(valid) {//有效
			
			$("#sendCodeBtn").css({"background-position": "0 -310px", "cursor": "pointer"});
			$("#sendCodeBtn .btn-2").css({"background-position": "right -310px"});
			sendT = true;
			
		} else {//置灰
			
			$("#sendCodeBtn").css({"background-position": "0 -376px", "cursor": "default"});
			$("#sendCodeBtn .btn-2").css({"background-position": "right -376px"});
			
			sendT = false;
		}		
		
	}
	//提交绑定手机
	function submitBindForm() {
		
		$("#bindPhoneBtn").click(function(){
			
			if(!bindT) return;
			var phoneCode = $("#phoneCode").val();							
			var code = $.trim($("#sms_code").val());
			
			var submitUrl = "/profile/bind";
						
			$("#bind_sucess_info").hide();
			$("#bind_info_loading_ico").show();//显示loading
			
			L.ajax({
				url : submitUrl,
				type:"POST",
				data:G.param({phone: phoneCode, code: code}),
				success :  function(info){
						
						//绑定中隐藏
						$("#bind_info_loading_ico").hide();
						
						if(info.code == ResultCodeSuccess) {							
														
							$("#bind_sucess_info").html("绑定成功！")
												  .show();
							bindBtnUnvalid(false);
							
							window.location.href= "/";
							
							//L.showTopTips(L.TIPS_TYPE.success, "手机绑定成功！您获得了一枚公民勋章");//提示绑定成功
						} else {
							
							$("#bindPhoneBtn").show();
							$("#bind_sucess_info").html(info.message)
												  .show();
							
							return false;
						}
				}
			})		
		})
	}
	//提交发送验证码到手机
	function submitSendForm() {
		
		$("#sendCodeBtn").click(function(){										 
			
			if(!sendT) return;
			
			regCheckRule.checkUSerPhoneRule();	//手机号验证
		
			//regCheckRule.checkVerfifyCodeRule();		//验证码验证	
			// && userVertifyCorss
			if(userPhoneCorss) {
				allSubmit = true;
			}
			if(allSubmit) {//只有各个控件都正确合法时才可以提交
				
				userPhoneCorss = false;
				userVertifyCorss = false;
				allSubmit = false;
				
				var phoneCode = $.trim($("#phoneCode").val());				
				var code = $.trim($("#verify_code").val());
				
				code = MD5(code.toLowerCase());
				
				var submitUrl = "/profile/sendcode";
				
				$("#send_info_loading_ico").show();//显示loading
				$("#tips_verifyCodeTimeError").hide();
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({phone: phoneCode, code: code}),
					success :  function(info){
						
							//发送中隐藏
							$("#send_info_loading_ico").hide();							
							
							if(info.code == ResultCodeSuccess) {								
								
								//开始计时，2分钟输入短信验证码有效
								timeOutSend();								
								
							} else {
								
								//提示发送失败
								$("#tips_verifyCodeTimeError .tips-info").html(info.message);
								$("#tips_verifyCodeTimeError").show();
								//$("#verify_code").val("");
								sendBtnUnvalid(true);
								//$("#secret_mail").val("");
								
								return false;
							}
					}
				})		
				
				
			}
		})
	}
	//开始倒计时，2分钟内及2分钟后执行的操作
	function timeOutSend() {
		
		/**
		 * 2分钟内执行的操作
		 * 绑定按钮有效
		 * 短信验证码输入框有效
		 * 时间计数器变化
		 * 发送按钮置灰
		 **/
		
		//绑定按钮有效
		bindBtnUnvalid(true);
				
		//发送按钮置灰
		sendBtnUnvalid(false);
		
		$("#time_out").show();

		var timeF = 59;
		
		timeID = window.setInterval(function(){
            if(timeF > 0) {

                $("#time_out #time_inter").html(timeF+"秒");
                timeF--;

            } else {

                /**
                 * 2分钟后执行的操作
                 * 发送按钮有效
                 * 绑定按钮置灰
                 * 短信验证输入框置灰
                 * 换新的验证码
                 * */
                $("#time_out").hide();
                $("#time_out #time_inter").html("60秒");
                $("#bind_sucess_info").hide();

                sendBtnUnvalid(true);
                bindBtnUnvalid(false);
                $("#sms_code").attr("disabled", false)
                    .css("background-color", "#fff");
                bindT = true;

                $("#changeCode").click();	//换张新的验证码

                window.clearInterval(timeID);
                vtimeSecond = 59;
                timeF = 59;

            }
		},1000);
				
	}
	//切换验证码
	function changeCode() {
		
		$("#changeCode").click(function(){
			
			$("#authPhoneImg").attr("src", "/gozapIdentifyCode?t="+Math.floor(Math.random()*100));
		})
	}
	/**
		init初始化函数		
	*/
	function init(bind) {
		
		regCheckRule.initTipsBind();//提示框对象初始化
		regCheckRule.inputTextFocusorBlur();				
		
		inputTextBlurTips(bind);
		
		submitSendForm();
		submitBindForm();
		
		changeCode();	//切换验证码
		chouti.Init();
		chouti.clickClear();
		chouti.hidPublishWindow();//隐藏“分享新发现”按钮
		
	}
	
	//对外接口,公共对象调用
	NS_person_bind_phone = {
		init: init
	}
})(jQuery);