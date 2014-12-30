(function($) {
	var G = $.gozap;
	
	G.namespace("gozap.swf");
	
	$.extend(G.swf, {
		/**
		 * 浏览器的flash插件版本
		 */
		version: (function () {
		    var n = navigator;
		    if (n.plugins && n.mimeTypes.length) {
		        var plugin = n.plugins["Shockwave Flash"];
		        if (plugin && plugin.description) {
		            return plugin.description
		                    .replace(/([a-zA-Z]|\s)+/, "")
		                    .replace(/(\s)+r/, ".") + ".0";
		        }
		    } else if (window.ActiveXObject && !window.opera) {
		        for (var i = 10; i >= 2; i--) {
		            try {
		                var c = new ActiveXObject('ShockwaveFlash.ShockwaveFlash.' + i);
		                if (c) {
		                    var version = c.GetVariable("$version");
		                    return version.replace(/WIN/g,'').replace(/,/g,'.');
		                }
		            } catch(e) {}
		        }
		    }
		})()
	});
})(jQuery);