/**
 * 蜡笔公共语言包
 */
(function($) {
	var G = $.gozap,
	
		L = G.labi;
	
	var i18n = {
		// 公共信息
		common: {
			httpError: {
				//"5" : "服务器异常，请稍候再试",
				"5" : "本地网络异常，请稍候再试",
				"6" : "请求超时，请稍候再试",
				"0" : "本地网络异常，请稍候再试"
			},
			
			topTips: {
				loading: "数据加载中..."
			},
			
			inputTips: {
				searchContacts: "搜索联系人..."
			},
			
			buttonText: {
				confirm: "确定",
				cancel: "取消"
			},
			
			close: "关闭",
			year: "年",
			month: "月",
			date: "日",
			add: "添加",
			remove: "删除",
			set: "修改",
			create: "创建",
			restore: "恢复",
			mobile: "手机",
			website: "站点",
			contact: "联系人",
			
			"new": "新",
			old: "旧",
			sendMail: "发邮件",
		
			
			operateTips: {
				setSuccess: "设置成功",
				failed: "操作失败"
			},
			
			basicErrorTips: {
				"400" : "操作请求出错，请联系客服！",
				"403" : "您没有权限执行此操作！",
				"404" : "目前服务不可用，请稍后再试！",
				"500" : "内部服务器出错，请稍后再试！",
				"502" : "服务器处理超时，请稍后再试！",
				"503" : "目前服务不可用，请稍后再试！",
				"noPacketBack" : "服务器处理超时，请稍后再试！"
			},
			
			inactive: "未激活",
			
			allPnum: "所有号码"
		},
		
		ui: {}
	};
	
	if (!L.i18n) {
		L.i18n = {};
	}
	
	$.extend(L.i18n, i18n);
})(jQuery);  