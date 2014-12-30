
(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nNotice = i18n.notice;
		var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
		
		var f_mail = false, f_content = false, userVertifyCorss = false;
		
	function init(obj) {
		
		chouti.hidPublishWindow();//隐藏“分享新发现”按钮
		
		
		checkContent();
		checkEmail();
		checkVerfiCode();
		submitFeedback();
		changeCode();
		
		chouti.Init();
		chouti.clickClear();
		//回车事件
		$("#verify_code").keydown(function(event){
			
			if (event.keyCode == 13) {				
					
				$("#commit_btn").click();//提交
				
			}
		})	
	}
	//提示反馈
	function submitFeedback() {
		
		$("#commit_btn").click(function(){
					
			$("#feedback_content").blur();
			$("#mail").blur();
			$("#verify_code").blur();
		
			if(f_content && f_mail & userVertifyCorss) {
			
				var content = $.trim($("#feedback_content").val());
				var email = $.trim($("#mail").val());
				
				$(this).hide();
				$(".loading-ico").show();//显示loading
				
				var submitUrl = "/feedback/create?"+G.param({content: content, email: email});
						
				L.ajax({
					url : submitUrl,
					type: "POST",
					success :  function(info){											
						
						if(info.code == ResultCodeSuccess) {
							
							window.location.href = "/feedback/success";
								
						} else {
							
							L.showTopTips(L.TIPS_TYPE.error, info.message);
							$(".loading-ico").hide();
							$("#commit_btn").show();
							return false;
						}
						
					}
					
				})
				
				
			}
		})

	}
	//验证输入反馈内容
	function checkContent() {
		
		$("#feedback_content").blur(function(){
			
			var value = $.trim($(this).val());
			if(value == "") {
				
				$("#con_tip").show()
				  			 .html("请输入反馈内容");
				f_content = false;
				return;				
			} else {
				$("#con_tip").hide();
			}
			
			f_content = true;
		})
	}
	//验证邮箱格式
	function checkEmail() {
		
		$("#mail").blur(function(){
			
			var value = $.trim($(this).val());
			if(value != "") {
								
				if(!gozapCommon.isEmail(value)) {
					
					$("#mail_tip").show()
								  .html("邮箱格式不正确，请重新输入");
					f_mail = false;
					return;
				}
				
			} else {
				$("#mail_tip").show()
							  .html("请输入邮箱，方便我们及时与您沟通");
				f_mail = false;
				return;
			}
			$("#mail_tip").hide();
			f_mail = true;
		})
	}
	//切换验证码
	function changeCode() {
		
		$("#changeCode").click(function(){
			
			$("#authImg").attr("src", "/gozapIdentifyCode?t="+Math.floor(Math.random()*100));
		})
	}
	//判断验证码是否正确
	function checkVerfiCode() {
		
		$("#verify_code").blur(function() {
				
		var verfifyCodeValue = $.trim($("#verify_code").val());
		
		if(verfifyCodeValue == "") {
			
			$("#code_tip").show()
			  			  .html("请输入验证码");
			return;
		}
		
		verfifyCodeValue = MD5(verfifyCodeValue);
		
		var submitUrl = "/passport/valAccessCode.do?"+G.param({code: verfifyCodeValue});
		
		L.ajax({
			
						url : submitUrl,
						
						async: false,
						success :  function(info){											
						
						if(info.code != ResultCodeSuccess) {
								
								
									if(info.code == "24000") {//表示验证码超时
										$("#authImg").attr("src", "/gozapIdentifyCode?t="+Math.random());//获取新的验证码
										
									} 
									$("#code_tip").show()
												  .html(info.message);
								
								userVertifyCorss = false;
								return false;
							} else {
								
								$("#code_tip").hide();
								userVertifyCorss = true;
						
								return true;
							}
						}
			});
		})
	}
	
	//对外接口,公共对象调用
    NS_feedback = {
		init: init
		//getNotice:getNotice
	}
})(jQuery);