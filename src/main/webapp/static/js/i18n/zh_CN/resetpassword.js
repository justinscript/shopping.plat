/**
 * 蜡笔语言包
 * 重置密码，用于找回密码
 */
(function($) {
	var G = $.gozap,
	
		L = G.labi,
		
		i18n = L.i18n;
	
	var resetpassword = {
		//信息提示
		StateMessage : {
			loading: "注册中，请稍候...",
			success: "注册成功",
			fail: "注册失败"
		},
		
		//提示标题
		showTipTitle : {
				title : "内容：",
				date : "时间：",
				location : "地点：",
				notes : "说明：",
				priority : "优先级：",
				fb : "状态：",
				clock : "闹钟："
		}
		
	};
	
	if (!i18n.resetpassword) {
		i18n.resetpassword = {};
	}
	
	$.extend(i18n.resetpassword, resetpassword);
})(jQuery);