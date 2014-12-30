/**
 * 正则
 * @author lanbo
 */
(function($){
	var G = $.gozap,
		
		// 正则的字符串
		PATTERN = {
			url: "((?:https|http)://)?" 
				+ "(?:[0-9a-z_!~*'()-]+\\.)*" // 域名- www. 
				+ "(?:[0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\\." // 二级域名 
				+ "[a-z]{2,6}" // .com
				+ "(?::[0-9]{1,4})?" // 端口 
				+ "(?:/[0-9A-Za-z_!~*'().;?:@&=+$,%#-]*)*", 
			
			email: "[_a-zA-Z0-9.]+@(?:[_a-z0-9]+\\.)+[a-z0-9]{2,4}",
			
			phone: "\\+?[0-9]+-?[0-9]{3,18}",
			
			cn: "[\u4e00-\u9fa5]+",
			
			mobile: "(12593|12520|10193|17900|17911|17951|125930|125200|101930|179000|179110|179510|(\\+?86))?" +
					"1" +
					"(3|4|5|7|8)" +
					"([0-9]{9})"
		};
	
	$.extend(G, {
		regExp: {}
	});
	
	$.each("Url Email Phone CN Mobile".split(" "),
		function(i, v){
			var k = v.toLowerCase(),
				p = PATTERN[k];
			
			G.regExp["is" + v] = function(s) {
				return new RegExp("^" + p + "$").test(s);
			}
		});
})(jQuery);