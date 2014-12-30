/**
 * 蜡笔对ajax的统一处理
 * 主要是在jQuery的基础上提供一些通用处理的支持
 * requires: gozap.lang, labi.core, labi.i18n.common
 * @author lanbo
 */
(function($){
	var G = $.gozap, L = G.labi, i18n = L.i18n;
		
//		code2Type = {};
//	
//	$.each("2001 2002 2003 3000".split(" "), function(i, code) {
//		code2Type[code] = L.TIPS_TYPE.error;
//	});
//	
//	$.each("9999".split(" "), function(i, code) {
//		code2Type[code] = L.TIPS_TYPE.success;
//	});
	
	$.extend(L, {
		/**
		 * gozap的ajax方法，在jQuery的基础上加上了业务自身的通用处理，主要是错误处理
		 * @param options 同$.ajax的options
		 */
		ajax: function(options) {
			options = options || {};
			//options.tipsHandler = L.showTopTips;//暂时先去掉提示
			G.ajax(options);
		}
	});
	
	// 修改ajax默认配置
	$.ajaxSetup({
		error: function(xmlHttp, textStatus) {
			textStatus = textStatus.toLowerCase();
			
			if (textStatus === "error") {
				var status = xmlHttp.status.toString().substring(0, 1);
				if (status === "5") {
					L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[status]);
				}
				
			} else if (textStatus === "timeout") {
					//L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[5]);
					//return;
				
			}
		}
		
	});
})(jQuery);