
(function( $, undefined ){
	
	var G = $.gozap,
			L = G.labi,
			i18n = L.i18n,
			i18nregister = i18n.register;
			var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999

	
	//提交登录表单
	function submitLoginForm() {
		$("#login_btn").click(function(){				
				
			loginWin.login_submit();
				
		})
	}
	//提交注册表单
	function submitRegForm() {
		
		$("#reg_btn").click(function(){		
			
			regWin.reg_submit();
				
		})
	}
	/**
		init初始化函数		
	*/
	//关闭登录框
	function closeDialog() {
		
		$("#login-dialog-btn-close").click(function(){
			
			/*清空所有输入框*/
			
			//登录输入框
			$("#login-wrong-info").html("");
			$("#destJid").val("");
			$("#password").val("");
			
			//注册输入框
			$("#reg-wrong-info").html("");
			$("#reg_destJid").val("");
			$("#reg_password").val("");
			$("#reg_confirm_password").val("");
			$("#reg_secret_mail").val("");
			$(".reg-lab").show();
			
			//对错icon隐藏
			$("#regFrm .sucess-ico").hide();
			//变量还原
			reguserNameCorss = false;
			passCorss = false;
			conpassCorss = false;
			mailCorss = false;
			
			//隐藏发布框
			$("#digg-dialog-login").hide();
			$("#mask").hide()
						.remove();
			
			//显示聊天室
			$("#chatIframe").css({"height": "475px","width":"300px"});
			
		})
	}
	//登录事件
	loginWin = {
			
			 /** js监听回车事件*/
			 enterIn : function(evt){
				var evt=evt?evt:(window.event?window.event:null);//兼容IE和FF
				if (evt.keyCode == 13){
					loginWin.login_submit();
					//return false;
				}
					
			 },
			 
			 /** 登录提交 */
			 login_submit : function(){
				// 消息错误提示对象
				var msg = $("#login-wrong-info");
				//var erIcon = $(".login-er-icon");
				// 用户名对象
			 	var un = $("#destJid");
				// 密码对象
				var pwd = $("#password");
				
				if ($.trim(un.val()) == "") {
					msg.html("请输入您的用户名");
//					erIcon.css("display", "inline-block");
					un.focus();
					return false;
				}
				/*
				if (!/^([0-9A-Za-z_]*|[0-9A-Za-z_]*@gozap.com)$/.test(un.val())) {
					msg.html("用户名不合法");
					un.focus();
					return false;
				}
				*/
				if (pwd.val() == "") {
					msg.html("请输入您的密码");
//					erIcon.css("display", "inline-block");
					pwd.focus();
					return false;
				}
				/*
				if (pwd.val().length < 6 || pwd.val().length > 16) {
					msg.html("密码必须在6-16之间");
					pwd.focus();
					return false;
				}
				*/
				// 判断是否勾选记住密码
				var lw_ck = $("#autologin");
				
				if (lw_ck.attr("checked")) {
					lw_ck.val("1");
					
				}
				else {
					lw_ck.val("0");
					
				}
				
				var submitUrl = "/passport/login.do";
				
				$("#login_btn").hide();//隐藏登录按钮
				$("#info_loading_ico").show();//显示loading
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({jid: $.trim(un.val()),password: pwd.val(),oneMonth:lw_ck.val()}),
					success :  function(info){
						
							if(info.code == ResultCodeSuccess) {
								
								$("#login-dialog-btn-close").click();	//关闭弹出框
								
								//保存下登录后返回的sid
								$.cookie("puid",info.data.puid);
								
								//执行未登录前提交的动作	
								if($("#isAjax").val() == 1) {
									
									var comit = $("#isAjax").data("ajax");
									
									var diggComit = $("#isAjax").data("ajax");
									
									var jid = info.data.destJid;
									
									//重新改写一下data数据									
									
									comitUrl = comit.data + "&"+G.param({jid:jid});
									comitUrl = comitUrl.replace("jid=&", "");
									comitUrl = comitUrl.replace("jid=undefined&", "");
									comit.data = comitUrl;
									
									//alert(comit);
									
									//顶踩时用到destJid，改写一下提交的url
									if($("#login_ajaxInfo").val() == "投票成功") {
																				
										L.ajax(comit);	//执行提交动作
										return;
									}
									
									//推荐时改写一下提交的url
									if($("#login_ajaxInfo").val() == "推荐已成功") {
																				
										L.ajax(diggComit);	//执行提交动作
										return;
									}
									
									
									
									//点击发布按钮时
									if($("#login_ajaxInfo").val() == "publish") {
																				
										window.location.reload();
										return;
									}
									
									//榜单页面提交评论时, 如果先输入内容再登录则执行提交动作
									var templinkId = $("#isComment").data("isComment");

									if(templinkId != "" && templinkId != null) {
										
										L.showTopTips(L.TIPS_TYPE.success, "发表评论成功");
										
										window.location.reload();
										
										L.ajax(comit);	//执行提交动作,针对评论及回复
										
										$("discus-a-"+templinkId).click();										
										
									}
									
								} else {									
									
									$("#login-dialog-btn-close").click();	//关闭弹出框
									window.location.reload();
									
									//评论页面，如果先输入内容再登录则执行提交动作
									
									if($.trim($("#txt-comment").val()) != "") {
										
										$("#hidjid").val(info.data.destJid);
										
										$("#pub-btn4").click();
										
									}
									
									
									
								}								
								
							//登录失败
							} else {
								
								var extMst = info.data.extMst;
								
								if(extMst == "") {
									
									$("#login-wrong-info").html(info.message);	//显示错误信息
									//$(".login-er-icon").css("display","inline-block");	//显示错误icon
								} else {
									
									L.showTopTips(L.TIPS_TYPE.error, extMst);
									
								}
								$("#login_btn").css("display","inline-block");
								$("#info_loading_ico").hide();
								return false;
							}
					}
				})
				
			 }
		}
	
		
	var RegtipsObjs = {
				destJid: {
					normalTip: $("#tips_userNameNormal"),
					errorTip: function(){$("#reg_username_sucess_ico").css("background-position", "0px -630px")},
					successTip: function(){$("#reg_username_sucess_ico").css("background-position", "0px -615px")}
				},
				password: {
					normalTip: $("#tips_userPassNormal"),
					errorTip: function(){$("#reg_userpassword_sucess_ico").css("background-position", "0px -630px")},
					successTip: function(){$("#reg_userpassword_sucess_ico").css("background-position", "0px -615px")}
				},
				confirm_password: {
					normalTip: $("#tips_userPassSameNormal"),
					errorTip: function(){$("#reg_userpasswordconfir_sucess_ico").css("background-position", "0px -630px")},
					successTip: function(){$("#reg_userpasswordconfir_sucess_ico").css("background-position", "0px -615px")}
				},	
				secret_mail: {
					normalTip: $("#tips_userSecretMailNormal"),
					errorTip: function(){$("#reg_usermail_sucess_ico").css("background-position", "0px -630px")},
					successTip: function(){$("#reg_usermail_sucess_ico").css("background-position", "0px -615px")}
				},
				verify_code: {
					normalTip: $("#tips_verifyCodeNormal"),
					errorTip: $("#tips_verifyCodeError"),
					successTip: $("#verfycode_sucess_ico")
				}
		}
	
	//注册事件
	regWin = {
			
			 /** js监听回车事件*/
			 enterIn : function(evt){
				var evt=evt?evt:(window.event?window.event:null);//兼容IE和FF
				if (evt.keyCode == 13){

					regWin.reg_submit();

					//$("#reg_secret_mail").blur();
				}
					
			 },
			 //显示相应的信息提示及错误信息
			 tipshowInfo:function(msg){
				 
				 $("#reg-wrong-info").html(msg);
			 },
			 //检测联系邮箱
			 checkUSerSecretMailRule:function() {
					
					var mailValue = $.trim($("#reg_secret_mail").val());
					if(gozapCommon.isEmpty(mailValue)) {			
						
						mailCorss = false;
						return false;				
					}
				
					if(!gozapCommon.isEmail(mailValue)) {
						
						regWin.tipshowInfo("邮箱格式不合法，请重新输入");
						
						RegtipsObjs.secret_mail.errorTip();
						$("#reg_usermail_sucess_ico").show();
						mailCorss = false;
						return false;
						
					}
					//如果格式合法，则调用ajax验证该邮箱是否存在
					
					var submitUrl = "/profile/email/notexist";
					L.ajax({
								url : submitUrl,
								type:"POST",
								data:G.param({email: mailValue}),
								success :  function(info){											
								
								if(info.code == ResultCodeSuccess) {//该邮箱不存在
									
									$("#reg_usermail_sucess_ico").show();
									RegtipsObjs.secret_mail.successTip();
									
										mailCorss = true;
										return true;								
										
									} else {

										regWin.tipshowInfo(info.message);
										$("#reg_usermail_sucess_ico").show();
										RegtipsObjs.secret_mail.errorTip();
										
										mailCorss = false;
										return false;
									}
								}
					})
					
			 },
			 //检测确认密码
			 checkUSerSamePassRule:function() {
					
					var conpasswordValue = $.trim($("#reg_confirm_password").val());
					if(gozapCommon.isEmpty(conpasswordValue)) {		
												
						conpassCorss = false;
						return false;				
					}
					//if($.trim($("#reg_password").val()) != "") {}
						if(conpasswordValue != $.trim($("#reg_password").val())) {
						
							regWin.tipshowInfo("两次密码不一致，请重新输入");
							
							RegtipsObjs.confirm_password.errorTip();
							$("#reg_userpasswordconfir_sucess_ico").show();
							conpassCorss = false;
							return false;
						}
			 		//}
					return true;
			 },
			 //检测密码
			 checkUSerPassRule:function() {
					
					var passwordValue = $.trim($("#reg_password").val());
					if(gozapCommon.isEmpty(passwordValue)) {			
						
						passCorss = false;
						return false;				
					}
				
					if(!gozapCommon.isBetweenLength(passwordValue, 6, 16)) {
						
						regWin.tipshowInfo("密码长度必须为6-16位字符，请重新输入");
						
						RegtipsObjs.password.errorTip();
						$("#reg_userpassword_sucess_ico").show();
						passCorss = false;
						return false;
					}
					if($.trim($("#reg_confirm_password").val()) != "") {
						if(!regWin.checkUSerSamePassRule()) {
							
							return false;
						}
					}
					return true;
			 },
			//检测用户名是否存在
				checkUSerNameExsit:function() {
					
					var userNameValue = $.trim($("#reg_destJid").val());
					if(gozapCommon.isEmpty(userNameValue)) {			
												
						reguserNameCorss = false;
						return false;				
					}
				
					if(!gozapCommon.isUserName(userNameValue) || !gozapCommon.isBetweenLength(userNameValue, 5, 20)) {
						
						regWin.tipshowInfo("用户名格式不正确，请重新输入");
						
						RegtipsObjs.destJid.errorTip();
						$("#reg_username_sucess_ico").show();
						reguserNameCorss = false;
						return false;
					}
				
					
				//如果格式合法，则调用ajax验证该用户名是否存在
					
					var submitUrl = "/profile/user/notexist";
					L.ajax({
								url : submitUrl,
								type:"POST",
								data:G.param({jid: userNameValue}),
								success :  function(info){											
								
								if(info.code == ResultCodeSuccess) {//该用户存在
									
									$("#reg_username_sucess_ico").show();
									RegtipsObjs.destJid.successTip();
									
									//RegtipsObjs.destJid.errorTip.hide();
									
										reguserNameCorss = true;
										return true;								
										
									} else {

										regWin.tipshowInfo(info.message);
										$("#reg_username_sucess_ico").show();
										RegtipsObjs.destJid.errorTip();
										
										reguserNameCorss = false;
										return false;
									}
								}
					})
					
					
				},
			//用户名输入框
				destJidBlurTips:function(re) {
					
					$("#reg_destJid").focus(function(){
							
						$(this).parent().addClass("text-box-active");
						
					}).blur(function(){//失去焦点
						
						$(this).parent().removeClass("text-box-active");
						
						regWin.tipshowInfo("");						
						
						if(!regWin.checkUSerNameExsit()) {
							return false;
						}
						reguserNameCorss = true;
						RegtipsObjs.destJid.successTip();
						$("#reg_username_sucess_ico").show();
					
					})
				},
				//密码输入框
				passwordBlurTips:function(re) {
					
						$("#reg_password").focus(function(){
						
						$(this).parent().addClass("text-box-active");
							
					}).blur(function(){//失去焦点
						
						$(this).parent().removeClass("text-box-active");
						
						regWin.tipshowInfo("");						
						
						if(!regWin.checkUSerPassRule()) {
							return false;
						}
						passCorss = true;
						RegtipsObjs.password.successTip();
						$("#reg_userpassword_sucess_ico").show();
					
					})
				},
				//确认密码
				confirmpasswordBlurTips:function(re) {
					
					$("#reg_confirm_password").focus(function(){
					
					$(this).parent().addClass("text-box-active");
						
				}).blur(function(){//失去焦点
					
					$(this).parent().removeClass("text-box-active");
					
					regWin.tipshowInfo("");						
					
					if(!regWin.checkUSerSamePassRule()) {
						conpassCorss = false;
						return false;
					}
					conpassCorss = true;
					RegtipsObjs.confirm_password.successTip();
					$("#reg_userpasswordconfir_sucess_ico").show();
				
				})
			},
			//联系邮箱
			secretmailBlurTips:function() {
				
				$("#reg_secret_mail").focus(function(){
					
				$(this).parent().addClass("text-box-active");
					
			}).blur(function(){//失去焦点
				
				$(this).parent().removeClass("text-box-active");
				
				regWin.tipshowInfo("");						
				
				if(!regWin.checkUSerSecretMailRule()) {
					
					return false;
					
				}
				mailCorss = true;
				RegtipsObjs.secret_mail.successTip();
				$("#reg_usermail_sucess_ico").show();
			
			})
		},
		 /** 注册提交 */
		 reg_submit : function(){
			 
			// 消息错误提示对象
			var msg = $("#reg-wrong-info");
			// 用户名对象
		 	var un = $("#reg_destJid");
			// 密码对象
			var pwd = $("#reg_password");
			// 确认密码对象
			var confirmPwd = $("#reg_confirm_password");
			// 联系邮箱对象
			var mail = $("#reg_secret_mail");
			
			if ($.trim(un.val()) == "") {
				
				msg.html("请输入用户名");
				RegtipsObjs.destJid.errorTip();
				$("#reg_username_sucess_ico").show();
				return false;
			}
			//alert(regWin.checkUSerNameExsit());
			
			regWin.checkUSerNameExsit()
							
			if (pwd.val() == "") {
				msg.html("请输入密码");
				RegtipsObjs.password.errorTip();
				$("#reg_userpassword_sucess_ico").show();
				return false;
			}
			
			regWin.checkUSerPassRule();
			
			if (confirmPwd.val() == "") {
				msg.html("请输入确认密码");
				RegtipsObjs.confirm_password.errorTip();
				$("#reg_userpasswordconfir_sucess_ico").show();
				return false;
			}
			
			regWin.checkUSerSamePassRule()
						
			
			if ($.trim(mail.val()) == "") {
				msg.html("请输入联系邮箱");
				RegtipsObjs.secret_mail.errorTip();
				$("#reg_usermail_sucess_ico").show();
				mail.focus();
				return false;
			}
			
			regWin.checkUSerSecretMailRule()
				
			
			if(reguserNameCorss && passCorss && conpassCorss && mailCorss) {
								
				if(!$("#readPl").attr("checked")) {
					
					regWin.tipshowInfo("请阅读并接受服务条款和隐私政策");
					return;
				}
				
				$("#reg_btn").hide();//隐藏登录按钮
				$("#reg_info_loading_ico").show();//显示loading
				
				var regName = $.trim(un.val());
				var regPassword = pwd.val();
				var regConPassword = confirmPwd.val();
				var regMail = $.trim(mail.val());
				
				var submitUrl = "/passport/register.do";
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({jid: regName, password: regPassword, email: regMail}),
					success :  function(info){
							if(info.code == ResultCodeSuccess) {
								
								$("#reg_btn").css("display","inline-block");
								$("#reg_info_loading_ico").hide();
								
								//	window.location.reload();
								
								
								L.showTopTips(L.TIPS_TYPE.success, info.data.extMst);//提示注册成功							
								window.location.reload();
								
							} else {
								$("#reg_btn").css("display","inline-block");
								$("#reg_info_loading_ico").hide();
								L.showTopTips(L.TIPS_TYPE.error, info.data.extMst);//提示注册失败
								return false;
							}
					}
				})
				
			
			}	
		 }
	}
	
	function init(regState) {	
		
		//登录文档框输入获得焦点
		regCheckRule.loginTextFocusorBlur("#destJid");	//登录用户名
		regCheckRule.loginTextFocusorBlur("#password");	//登录密码
		
		submitLoginForm();	//提交登录表单
		
		chouti.clickClear();
		
		reguserNameCorss = false;
		passCorss = false;
		conpassCorss = false;
		mailCorss = false;
		
		//注册校验
		regWin.destJidBlurTips();
		regWin.passwordBlurTips();
		regWin.confirmpasswordBlurTips();
		regWin.secretmailBlurTips();	
		
		submitRegForm();	//提交注册表单
		closeDialog();	//关闭登录框
	}
	
	//对外接口,公共对象调用
	NS_login = {
		init: init
	}
})(jQuery);