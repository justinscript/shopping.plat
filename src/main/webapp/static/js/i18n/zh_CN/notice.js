/**
 * 蜡笔语言包
 * 公告
 */
(function($) {
	var G = $.gozap,
	
		L = G.labi,
		
		i18n = L.i18n;
	
	var notice = {
		confirmTips : function(num) {
			if(num > 0) {
				return "您确定要删除这" + num + "条通知吗？";
			} else {
				return "您确定要删除这条通知吗？";
			}
			
		},
		topTips: "请选择要删除的通知",
		readTips: "请选择要标记为已读的通知",
		allReadSuccessTips: "已标记为已读",
		allReadFailTips: "标记失败，请稍候再试！",
		allDelFailTips: "删除失败，请稍候再试！"
	};
	
	if (!i18n.notice) {
		i18n.notice = {};
	}
	
	$.extend(i18n.notice, notice);
})(jQuery);