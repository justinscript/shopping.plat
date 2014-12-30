/**
 * gozap
 * requires: gozap.lang
 */
(function($){
	var G = $.gozap;
	
	$.extend(G, {
		imageZoomMethods: {
			DEFAULT: 0,
			// 锁定比例,取小值缩放
			LOCKED_RATIO_SMALL: 1,
			
			// 锁定比例,取大值缩放
			LOCKED_RATIO_BIG: 2,
			
			// 不锁定比例,按尺寸缩放
			UNLOCKED_RATIO: 3,
			
			// 锁定比例，按固定尺寸取小值缩小（只允许缩小）
			LOCKED_RATIO_SMALL_NARROW: 4,
			
			// 锁定比例，按固定尺寸取小值放大（只允许放大）
			LOCKED_RATIO_SMALL_ENLARGE: 5,
			
			// 锁定比例，按固定尺寸取大值缩小（只允许缩小）
			LOCKED_RATIO_BIG_NARROW: 6,
			
			// 锁定比例，按固定尺寸取大值放大（只允许放大）
			LOCKED_RATIO_BIG_ENLARGE: 7,
			
			// 不锁定比例，按固定尺寸缩小（只允许缩小）
			UNLOCKED_RATIO_NARROW: 8,
			
			// 不锁定比例，按固定尺寸放大（只允许放大）
			UNLOCKED_RATIO_ENLARGE: 9
		},
		
		/**
		 * 获取缩放后的图片url
		 * @param url 图片原始url
		 * @param width 图片宽度
		 * @param height 图片高度
		 * @param method 方式
		 * @return 
		 */
		getImageZoomUrl: function(url, width, height, method) {
			var targetUrl = "", pos = url.lastIndexOf(".");
			
			method = method || G.imageZoomMethods.DEFAULT;
			
			targetUrl += url.substring(0, pos);
			targetUrl += "=" + width + "x" + height;
			
			if (G.imageZoomMethods.LOCKED_RATIO_SMALL_NARROW === method) {
				targetUrl += ")";
			}
			targetUrl += url.substring(pos);
									
			return targetUrl;
		}		
	});
	
	
})(jQuery);