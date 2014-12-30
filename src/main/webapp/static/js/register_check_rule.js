var userNameCorss = false, userNickCorss = false, userPassCorss = false, userOldPassCorss = false, userPhoneCorss = false, userSamePassCorss = false,userMailCorss = false, userVertifyCorss = false, allSubmit = false;
(function($) {
	
	
	var G = $.gozap,
			L = G.labi,
			i18n = L.i18n,
			i18nregister = i18n.register;
			var warnInfo = i18nregister.warnInfo;//错误信息提示
			var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999	
			
	regCheckRule = {
		
		//判断验证码是否正确
		checkVerfifyCodeRule: function() {
			
			var verfifyCodeValue = $.trim($("#verify_code").val());
			if(gozapCommon.isEmpty(verfifyCodeValue)) {
					
					regCheckRule.inputTextChangeClass("add", "#verify_code", tipsObjs.verify_code.errorTip, tipsObjs.verify_code.successTip);
					$(".tips-info","#tips_verifyCodeError").html(warnInfo.verifycode.nullContent);//请输入验证码
					userVertifyCorss = false;
					return false;				
				}
			
			verfifyCodeValue = MD5(verfifyCodeValue);
			
			//alert(verfifyCodeValue);
			
			var submitUrl = "/passport/valAccessCode.do";
			
			L.ajax({
							url : submitUrl,
							type:"POST",
							data:G.param({code: verfifyCodeValue}),
							async: false,
							success :  function(info){											
							
							if(info.code != ResultCodeSuccess) {
									regCheckRule.inputTextChangeClass("add", "#verify_code", tipsObjs.verify_code.errorTip, tipsObjs.verify_code.successTip);
									tipsObjs.verify_code.errorTip.show();
									$(".tips-info","#tips_verifyCodeError").html(info.message);
									//$(this).focus();
										if(info.code == "24000") {//表示验证码超时
											$("#authImg").attr("src", "/gozapIdentifyCode?t="+Math.random());//获取新的验证码
											
										}
									//$("#verify_code").val("");
									userVertifyCorss = false;
									return false;
								} else {
									tipsObjs.verify_code.successTip.show();
									tipsObjs.verify_code.errorTip.hide();
									userVertifyCorss = true;
							
									return true;
								}
							}
				})
		},
		
		//检测确认密码是否一致
		checkUSerSamePassRule: function() {
			
			var passwordValue = $.trim($("#confirm_password").val());
			if(gozapCommon.isEmpty(passwordValue)) {
					
					regCheckRule.inputTextChangeClass("add", "#confirm_password", tipsObjs.confirm_password.errorTip, tipsObjs.confirm_password.successTip);
					$(".tips-info","#tips_userPassSameError").html(warnInfo.confirmPassword.nullContent);//"请输入确认密码"
					userSamePassCorss = false;
					return false;				
				}
			if(passwordValue != $.trim($("#new_password").val())) {
				regCheckRule.inputTextChangeClass("add", "#confirm_password", tipsObjs.confirm_password.errorTip, tipsObjs.confirm_password.successTip);
				$(".tips-info","#tips_userPassSameError").html(warnInfo.confirmPassword.errorStyle);//"两次密码不一致，请重新输入"
				
				userSamePassCorss = false;
				return false;
			} else {
				userSamePassCorss = true;
				return true;
			}
		},
		
		//检测保密邮箱是否合法
		checkUSerSecretMailRule: function() {
			
			var mailValue = $.trim($("#secret_mail").val());
			if(gozapCommon.isEmpty(mailValue)) {		
					regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
					$(".tips-info","#tips_userSecretMailError").html(warnInfo.mail.nullContent);//"请输入保密邮箱"
					userMailCorss = false;
					return false;				
				}
			
			if(!gozapCommon.isEmail(mailValue)) {
				regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
				$(".tips-info","#tips_userSecretMailError").html(warnInfo.mail.errorStyle); //"邮箱格式不合法，请重新输入"
				userMailCorss = false;
				return false;
			}
			userMailCorss = true;
			return true;
		},
		//查找用户名中检测保密邮箱是否存在
		checkUSerSecretMailExist: function(wh) {
			var mailValue = $.trim($("#secret_mail").val());
			if(gozapCommon.isEmpty(mailValue)) {		
				regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
				$(".tips-info","#tips_userSecretMailError").html(warnInfo.mail.nullContent);//"请输入保密邮箱"
				userMailCorss = false;
				return false;				
			}
		
			if(!gozapCommon.isEmail(mailValue)) {
				regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
				$(".tips-info","#tips_userSecretMailError").html(warnInfo.mail.errorStyle);//"邮箱格式不合法，请重新输入"
				userMailCorss = false;
				return false;
			}
		
		if(wh == "") {
		//检测邮箱是否为本买买君邮箱
			var submitUrl = "/profile/email/exist";
			
			L.ajax({
						url : submitUrl,
						type:"POST",
						data:G.param({email: mailValue}),
						async:false,
						success :  function(info){											
						
						if(info.code != ResultCodeSuccess) {
								regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
								$(".tips-info","#tips_userSecretMailError").html(info.message);//用户名已被注册，请换一个试试
								userMailCorss = false;
								return false;
							} else {
								tipsObjs.secret_mail.successTip.show();
								tipsObjs.secret_mail.errorTip.hide();
								userMailCorss = true;
								return true;
							}
						}
			})
		} else {//判断邮箱是否存在
			
			var submitUrl = "/profile/email/notexist";
			
			L.ajax({
				url : submitUrl,
				type:"POST",
				data:G.param({email: mailValue}),
				async:false,
				success :  function(info){											
				
				if(info.code == ResultCodeSuccess) {
					
						tipsObjs.secret_mail.successTip.show();
						tipsObjs.secret_mail.errorTip.hide();
						userMailCorss = true;
						return true;										
						
					} else {
						
						regCheckRule.inputTextChangeClass("add", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
						$(".tips-info","#tips_userSecretMailError").html(info.message);//邮箱已被注册，请换一个试试
						userMailCorss = false;
						return false;
						
					}
				}
			})
		}
	},
		
		//检测密码是否合法
		checkUSerPassRule: function() {
			
			var passwordValue = $.trim($("#new_password").val());
			if(gozapCommon.isEmpty(passwordValue)) {		
					regCheckRule.inputTextChangeClass("add", "#new_password", tipsObjs.password.errorTip, tipsObjs.password.successTip);
					$(".tips-info","#tips_userPassError").html(warnInfo.password.nullContent);//"请输入密码"
					userPassCorss = false;
					return false;				
				}
			
			if(!gozapCommon.isBetweenLength(passwordValue, 6, 16)) {
				regCheckRule.inputTextChangeClass("add", "#new_password", tipsObjs.password.errorTip, tipsObjs.password.successTip);
				$(".tips-info","#tips_userPassError").html(warnInfo.password.errorStyle);//"密码长度必须为6-16位字符，请重新输入
				$("#new_password").val("");
				userPassCorss = false;
				return false;
			}
			userPassCorss = true;
			return true;
		},
		//检测旧密码是否合法
		checkUSerOldPassRule: function() {
			
			var passwordValue = $.trim($("#old_password").val());
			if(gozapCommon.isEmpty(passwordValue)) {
				
					regCheckRule.inputTextChangeClass("add", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip);
					$(".tips-info","#tips_userOldPassError").html(warnInfo.oldpassword.nullContent);//"请输入密码"
					userOldPassCorss = false;
					return false;				
				}
			
			if(!gozapCommon.isBetweenLength(passwordValue, 6, 16)) {
			
				regCheckRule.inputTextChangeClass("add", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip);
				$(".tips-info","#tips_userOldPassError").html(warnInfo.oldpassword.errorStyle);//"密码长度必须为6-16位字符，请重新输入
				//$("#old_password").val("");
				userOldPassCorss = false;
				return false;
			}
			userOldPassCorss = true;
			return true;
		},
		
		//检测用户昵称是否合法
		checkUSerNickRule: function() {
			
			var nickValue = $.trim($("#nick").val());
			if(gozapCommon.isEmpty(nickValue)) {
				
					regCheckRule.inputTextChangeClass("add", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip);
					$(".tips-info","#tips_userNickError").html(warnInfo.usernick.nullContent);
					userNickCorss = false;
					return false;				
				}			 
			
			//首页判断支持中英文、数字、下划线
			 if (/^[\u4e00-\u9fa5\w]+$/.test(nickValue)) {
				 
				 	userNickCorss = true;
					
				} else {
					
					regCheckRule.inputTextChangeClass("add", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip);
					$(".tips-info","#tips_userNickError").html(warnInfo.usernick.errorStyle);	//支持中英文、数字、下划线
					userNickCorss = false;
					return false;
					
				}
			 /*
			 if(nickValue.length < 5) {
				 
				 regCheckRule.inputTextChangeClass("add", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip);
					$(".tips-info","#tips_userNickError").html("字符长度不能小于5");	//不能超过20个字符或10个汉字
					userNickCorss = false;
					return false;
				}
			 */
			 //再判断长度是否为20个字符或10个汉字
			 if(!regCheckRule.countNickLength(nickValue, 10)) {
				 
				 regCheckRule.inputTextChangeClass("add", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip);
					$(".tips-info","#tips_userNickError").html(warnInfo.usernick.errorLengthStyle);	//不能超过20个字符或10个汉字
					userNickCorss = false;
					return false;
					
			 } else {
				 	userNickCorss = true;
					return true;
			 }
			 
		},
		//计算用户昵称长度(10个汉字或20个字符)
		countNickLength: function(str, countsum) {
				
				//计算长度
				//如果长度小于5则为不合法
				
				var len = 0;
		        for ( var i = 0; i < str.length; i++) {
		                var c = str.charCodeAt(i);
		                //单字节加1   
		                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
		                        len++;
		                } else {
		                        len += 2;
		                }
		        }
		        var result = parseInt(len /2 );
		        var mod = len%2;
		        if (mod != 0) {
		                result+=1;
		        }
				var haveLength = countsum - result;
								
				if(haveLength < 0) {
					return false;
					
				} else {
					return true;
					
				}
												
			
		},
		//检测用户名格式正确是否
		checkUSerNameRule: function() {
			
			var userNameValue = $.trim($("#destJid").val());
			if(gozapCommon.isEmpty(userNameValue)) {			
					regCheckRule.inputTextChangeClass("add", "#destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip);
					$(".tips-info","#tips_userNameError").html(warnInfo.username.nullContent);//请输入用户名
					userNameCorss = false;
					return false;				
			}
			
			if(!gozapCommon.isUserName(userNameValue) || !gozapCommon.isBetweenLength(userNameValue, 5, 20)) {
				regCheckRule.inputTextChangeClass("add", "#destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip);
				$(".tips-info","#tips_userNameError").html(warnInfo.username.errorStyle);//用户名格式不正确，请重新输入
				userNameCorss = false;
				return false;
			}
			
	
			//如果格式合法，则调用ajax验证该用户名是否注册过
				L.ajax({
							url : "userReg!selUser.action",
							data : "profile.destJid="+userNameValue+"",
							success :  function(info){											
							
							if(info.code != ResultCodeSuccess) {
									regCheckRule.inputTextChangeClass("add", "#destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip);
									$(".tips-info","#tips_userNameError").html(info.ext.msg);//用户名已被注册，请换一个试试
									userNameCorss = false;
									return false;
								} else {
									tipsObjs.destJid.successTip.show();
									tipsObjs.destJid.errorTip.hide();
									userNameCorss = true;
									return true;
								}
							}
				})
		},
		//重置密码中检测用户名是否存在
		checkUSerNameExsit:function() {
			
			var userNameValue = $.trim($("#user_destJid").val());
			if(gozapCommon.isEmpty(userNameValue)) {			
				regCheckRule.inputTextChangeClass("add", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip);
				$(".tips-info","#tips_userNameError").html(warnInfo.username.nullContent);//请输入用户名
				userNameCorss = false;
				return false;				
			}
		
			if(!gozapCommon.isUserName(userNameValue) || !gozapCommon.isBetweenLength(userNameValue, 5, 20)) {
				regCheckRule.inputTextChangeClass("add", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip);
				$(".tips-info","#tips_userNameError").html(warnInfo.username.errorStyle);
				userNameCorss = false;
				return false;
			}
		

		//如果格式合法，则调用ajax验证该用户名是否存在
			var submitUrl = "/profile/user/exist";
			
			L.ajax({
						url : submitUrl,
			            type:"POST",
			            data:G.param({jid: userNameValue}),
						success :  function(info){											
						
						if(info.code == ResultCodeSuccess) {//该用户存在
								tipsObjs.destJid.successTip.show();
								tipsObjs.destJid.errorTip.hide();
								userNameCorss = true;
								return true;								
								
							} else {//该用户不存在
								regCheckRule.inputTextChangeClass("add", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip);
								$(".tips-info","#tips_userNameError").html(info.message);//此用户名未注册，请检查后再试
								//$(this).focus();
								userNameCorss = false;
								return false;
							}
						}
			})
		},

		//修改密码中检测旧密码是否正确
		checkUSerOldPassExsit:function() {
			
			var oldPassword = $.trim($("#old_password").val());
		
		//如果格式合法，则调用ajax验证该密码是否正确
			var submitUrl = "/profile/password/auth";
			
			L.ajax({
				
						url : submitUrl,
						type:"POST",
						data:G.param({password: oldPassword}),
						async:false,
						success :  function(info){											
						
						if(info.code == ResultCodeSuccess) {//该用户的密码正确
								tipsObjs.oldpassword.successTip.show();
								tipsObjs.oldpassword.errorTip.hide();
								userOldPassCorss = true;
								return true;								
								
							} else {//该用户的密码不正确
								regCheckRule.inputTextChangeClass("add", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip);
								$(".tips-info","#tips_userOldPassError").html(info.message);//密码不正确，请重新输入
								//$(this).focus();
								userOldPassCorss = false;
								return false;
							}
						}
			})
			
			
		},
		//检测手机号输入是否合法
		checkUSerPhoneRule:function() {
			
			var phoneValue = $.trim($("#phoneCode").val());
			
			if(gozapCommon.isEmpty(phoneValue)) {
				
					regCheckRule.inputTextChangeClass("add", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip);
					$(".tips-info","#tips_userPhoneError").html(warnInfo.bindphone.nullContent);//"请输入手机号"
					userPhoneCorss = false;
					return false;				
				}
			
			if(!G.regExp.isMobile(phoneValue)) {
			
				regCheckRule.inputTextChangeClass("add", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip);
				$(".tips-info","#tips_userPhoneError").html(warnInfo.bindphone.errorStyle);//"手机号不合法，请重新输入
				//$("#old_password").val("");
				userPhoneCorss = false;
				return false;
			}
			userPhoneCorss = true;
			return true;
			
		},
		//当文本框输入出错时错误样式
		/*
			参数含义
			sel，表示是显示错误样式，还是移除
			thisObj,表示当前文本输入框控件
			tipsError，当前的错误气泡提示控件
			tipsSuccess,表示验证通过显示正确图片提示
		*/
		inputTextChangeClass: function(sel, thisObj, tipsError, tipsSuccess) {
			if(sel == "add") {
				//$(thisObj).parent().addClass("text-box-error");
				$(thisObj).addClass("text-error");
				tipsError.show();
				tipsSuccess.hide();
			} else {
				//$(thisObj).parent().removeClass("text-box-error");
				$(thisObj).removeClass("text-error");
				tipsError.hide();
				tipsSuccess.show();
			}
		},
		
		//用户名输入框
		destJidBlurTips:function(re) {
			
				$("#user_destJid").focus(function(){
				
				regCheckRule.inputTextChangeClass("remove", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip);
				tipsObjs.destJid.normalTip.show();			
				tipsObjs.destJid.successTip.hide();
			}).blur(function(){//失去焦点
				
				$(this).removeClass("text-active");		   
				tipsObjs.destJid.normalTip.hide();
			
			//判断用户名输入格式是否合法及是否注册过
			
			if(re == "resetpassword") {//重置密码
				
				if(!regCheckRule.checkUSerNameExsit()) {
					return;
				}
				
			} else {//注册
				
				if(!regCheckRule.checkUSerNameRule()) {
					return;
				}
			}
			regCheckRule.inputTextChangeClass("remove", "#user_destJid", tipsObjs.destJid.errorTip, tipsObjs.destJid.successTip);
			
			})
		},
		//旧密码输入框
		oldpasswordBlurTips:function(re) {
			
			$("#old_password").focus(function(){
				regCheckRule.inputTextChangeClass("remove", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip);
				tipsObjs.oldpassword.normalTip.show();
				tipsObjs.oldpassword.successTip.hide();
			
			}).blur(function(){//失去焦点
				//alert(123);
				$(this).removeClass("text-active");		   
				tipsObjs.oldpassword.normalTip.hide();			
			
				//判断密码输入格式是否合法
				if(!regCheckRule.checkUSerOldPassRule()) {
					userOldPassCorss = false;
					return false;
				}
				//判断旧密码是否存在
				if(!regCheckRule.checkUSerOldPassExsit()) {
					return;
				}
				
			regCheckRule.inputTextChangeClass("remove", "#old_password", tipsObjs.oldpassword.errorTip, tipsObjs.oldpassword.successTip);
			})
			
		},
		//密码输入框
		passwordBlurTips:function(re) {
			
			$("#new_password").focus(function(){
				regCheckRule.inputTextChangeClass("remove", "#new_password", tipsObjs.password.errorTip, tipsObjs.password.successTip);
				tipsObjs.password.normalTip.show();
				tipsObjs.password.successTip.hide();
			
			}).blur(function(){//失去焦点
				
				$(this).removeClass("text-active");		   
				tipsObjs.password.normalTip.hide();			
			
				//判断密码输入格式是否合法
				if(!regCheckRule.checkUSerPassRule()) {
					return false;
				}
				
				
			regCheckRule.inputTextChangeClass("remove", "#new_password", tipsObjs.password.errorTip, tipsObjs.password.successTip);
			
			//再验证一次确认密码
			if($.trim($("#confirm_password").val()) != "")
				$("#confirm_password").blur();
			
			
			}).keyup(function(){
				var value = $.trim($(this).val());
				if(value == "") {
					return;
				}
				var points = passwordStrength.policy(value);//获取密码分值
				passwordStrength.changePS(points,"#password_strong_line");//根据分值改变密码强度样式
			})
		},
		//输入确认密码
		confirmpasswordBlurTips:function() {
				$("#confirm_password").focus(function(){
				regCheckRule.inputTextChangeClass("remove", "#confirm_password", tipsObjs.confirm_password.errorTip, tipsObjs.confirm_password.successTip);
				tipsObjs.confirm_password.normalTip.show();
				tipsObjs.confirm_password.successTip.hide();
			}).blur(function(){
									
				$(this).removeClass("text-active");		   
				tipsObjs.confirm_password.normalTip.hide();			
			
				//判断密码输入是否一至
				if(!regCheckRule.checkUSerSamePassRule()) {
					return;
				}
			
				regCheckRule.inputTextChangeClass("remove", "#confirm_password", tipsObjs.confirm_password.errorTip, tipsObjs.confirm_password.successTip);
			
				tipsObjs.confirm_password.successTip.show();
			})
		},
		//输入保密邮箱
		secretmailBlurNotTips:function(re) {
			$("#secret_mail").focus(function(){
				regCheckRule.inputTextChangeClass("remove", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
				tipsObjs.secret_mail.normalTip.show();
				tipsObjs.secret_mail.successTip.hide();
			}).blur(function(){
									
				$(this).removeClass("text-active");		   
				tipsObjs.secret_mail.normalTip.hide();

				if(!regCheckRule.checkUSerSecretMailExist("exsit")) {
					return;
				}					
			
				regCheckRule.inputTextChangeClass("remove", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
			
			})
		},
		
		//输入保密邮箱
		secretmailBlurTips:function(re) {
			$("#secret_mail").focus(function(){
				regCheckRule.inputTextChangeClass("remove", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
				tipsObjs.secret_mail.normalTip.show();
				tipsObjs.secret_mail.successTip.hide();
			}).blur(function(){
									
				$(this).removeClass("text-active");		   
				tipsObjs.secret_mail.normalTip.hide();
				
				//判断保密邮箱格式是否合法
				if(re == "finduser") {//用于找回用户名
					if(!regCheckRule.checkUSerSecretMailExist("")) {
						return;
					}
				} else {
					//判断邮箱是否存在
					
					if(re == "exsit") {
						if(!regCheckRule.checkUSerSecretMailExist(re)) {
							return;
						}
					}
					//用于注册那
					if(!regCheckRule.checkUSerSecretMailRule()) {
						return;
					}
				}
				regCheckRule.inputTextChangeClass("remove", "#secret_mail", tipsObjs.secret_mail.errorTip, tipsObjs.secret_mail.successTip);
			
			})
		},
		
		//输入验证码
		verifycodeBlurTips:function(btn) {
			
			$("#verify_code").focus(function(){
				regCheckRule.inputTextChangeClass("remove", "#verify_code", tipsObjs.verify_code.errorTip, tipsObjs.verify_code.successTip);
				tipsObjs.verify_code.normalTip.show();
				tipsObjs.verify_code.successTip.hide();
			}).blur(function(){
				
				$(this).removeClass("text-active");		   
				tipsObjs.verify_code.normalTip.hide();
			
				//判断验证码是否正确
				if(!regCheckRule.checkVerfifyCodeRule()) {
					return;
				}
			
				regCheckRule.inputTextChangeClass("remove", "#verify_code", tipsObjs.verify_code.errorTip, tipsObjs.verify_code.successTip);
			
			}).keydown(function(event){
			
				if (event.keyCode == 13) {
					$("#verify_code").blur()
					if(userVertifyCorss) {					
						$(btn).click();//提交表单
					}
				}
			})		
			
		},
		//手机号输入
		phoneBlurTips: function() {
			
			$("#phoneCode").focus(function(){
				regCheckRule.inputTextChangeClass("remove", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip);
				tipsObjs.bindphone.normalTip.show();
				tipsObjs.bindphone.successTip.hide();
			}).blur(function(){
									
				$(this).removeClass("text-active");		   
				tipsObjs.bindphone.normalTip.hide();			
			
				//判断手机号输入是否合法
				if(!regCheckRule.checkUSerPhoneRule()) {
					return;
				}
			
				regCheckRule.inputTextChangeClass("remove", "#phoneCode", tipsObjs.bindphone.errorTip, tipsObjs.bindphone.successTip);
			
				//tipsObjs.confirm_password.successTip.show();
			})		
			
		},
		//用户昵称输入框
		userNickBlurTips:function() {
			
			$("#nick").focus(function(){
				
				regCheckRule.inputTextChangeClass("remove", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip);
				tipsObjs.usernick.normalTip.show();
				tipsObjs.usernick.successTip.hide();
			
			}).blur(function(){//失去焦点
				
				$(this).removeClass("text-active");		   
				tipsObjs.usernick.normalTip.hide();			
			
				//判断昵称输入格式是否合法checkUSerOldPassRule
				if(!regCheckRule.checkUSerNickRule()) {
					userNickCorss = false;
					return false;
				}
								
			regCheckRule.inputTextChangeClass("remove", "#nick", tipsObjs.usernick.errorTip, tipsObjs.usernick.successTip);
			})
			
		},
		//用户名输入框
		loginTextFocusorBlur:function(re) {
			
				$(re).focus(function(){
				
					$(this).parent().addClass("text-box-active");
				
			}).blur(function(){//失去焦点
				
					$(this).parent().removeClass("text-box-active");
			
			})
		},
		//提示框对象初始化
		////文本输入框对应的正常和错误提示气泡信息
		initTipsBind: function() {
			
			tipsObjs = {
					destJid: {
						normalTip: $("#tips_userNameNormal"),
						errorTip: $("#tips_userNameError"),
						successTip: $("#username_sucess_ico")
					},
					oldpassword: {
						normalTip: $("#tips_userOldPassNormal"),
						errorTip: $("#tips_userOldPassError"),
						successTip: $("#userOldpass_sucess_ico")
					},
					password: {
						normalTip: $("#tips_userPassNormal"),
						errorTip: $("#tips_userPassError"),
						successTip: $("#userpass_sucess_ico")
					},
					confirm_password: {
						normalTip: $("#tips_userPassSameNormal"),
						errorTip: $("#tips_userPassSameError"),
						successTip: $("#userpasssame_sucess_ico")
					},	
					secret_mail: {
						normalTip: $("#tips_userSecretMailNormal"),
						errorTip: $("#tips_userSecretMailError"),
						successTip: $("#usersecretmail_sucess_ico")
					},
					bindphone: {
						normalTip: $("#tips_userPhoneNormal"),
						errorTip: $("#tips_userPhoneError"),
						successTip: $("#userphone_sucess_ico")
					},
					verify_code: {
						normalTip: $("#tips_verifyCodeNormal"),
						errorTip: $("#tips_verifyCodeError"),
						successTip: $("#verfycode_sucess_ico")
					},
					usernick: {
						normalTip: $("#tips_userNick"),
						errorTip: $("#tips_userNickError"),
						successTip: $("#usernick_sucess_ico")
					}
			}
		},
		
		/*文本框得到焦点样式变化*/
		inputTextFocusorBlur: function() {
			
			$(":text, :password").focus(function(){
				$(this).addClass("text-active");
			}).blur(function(){
				$(this).removeClass("text-active");
			})
		}
	
		/////////////////////////////
		
		
	}	  
		  
})(jQuery);