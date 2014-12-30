/**
 * 蜡笔语言包
 * 日历去重
 */
(function($) {
	var G = $.gozap,
	
		L = G.labi,
		
		i18n = L.i18n;
	
	var register = {
		//信息提示
			
			StateMessage : {
				loading: "注册中，请稍候...",
				success: "注册成功",
				fail: "注册失败"
			},
			warnInfo: {
				username: {
					nullContent: "请输入用户名",
					errorStyle: "用户名格式不正确，请重新输入"
				},
				oldpassword: {
					nullContent: "请输入密码",
					errorStyle: "密码长度必须为6-16位字符，请重新输入"
				},
				password: {
					nullContent: "请输入密码",
					errorStyle: "密码长度必须为6-16位字符，请重新输入"
				},
				confirmPassword: {
					nullContent: "请输入确认密码",
					errorStyle: "两次密码不一致，请重新输入"
				},
				mail: {
					nullContent: "请输入联系邮箱",
					errorStyle: "邮箱格式不合法，请重新输入"
				},
				bindphone: {
					nullContent: "请输入手机号",
					errorStyle: "手机号不合法，请重新输入"
				},
				verifycode: {
					nullContent: "请输入验证码",
					errorStyle: ""
				},				
				usernick: {
					nullContent: "请输入用户昵称",
					errorStyle: "支持中英文、数字、下划线",
					errorLengthStyle: "不能超过20个字符或10个汉字"
				}
				
			}	
		
	};
	
	if (!i18n.register) {
		i18n.register = {};
	}
	
	$.extend(i18n.register, register);
})(jQuery);