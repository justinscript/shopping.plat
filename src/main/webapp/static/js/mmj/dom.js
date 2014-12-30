/**
 * dom
 * requires: gozap.lang
 */
(function($){
	var G = $.gozap;
	
	G.DOM = {};
	
	$.extend(G.DOM, {
		/**
		 * 添加样式表
		 * @param style{String} 要添加到样式表中的样式
		 * @param id{String} 新添加样式表的id
		 */
		addStyleSheet: function(style, id) {
			id = id || "style-" + G.now();
			if (!$.browser.msie) {
				$("<style type='text/css' id='"+id+"'></style>").html(style).appendTo('head');
				
			} else {			
				var oStyle = document.createElement('style');
				oStyle.type = "text/css";
				oStyle.id = id;
				var oHead = document.getElementsByTagName('head')[0];
		       
	//	        oHead.appendChild(oStyle);
				if (oHead.firstChild) {
			        oHead.insertBefore(oStyle, oHead.firstChild);
			        
			    } else {
			        oHead.appendChild(oStyle);
			    }
	//	        oHead.insertBefore(oStyle, oHead.firstChild);
		        
		        oStyle.styleSheet.cssText = style;
			}
		},
		
		/**
    	 * 定位在某个目标元素下方,没有目标元素则定位在屏幕中间
    	 * @param elem{jQuery} 要定位的元素
    	 * @param options{Map} 其中的属性：target{JQuery}: 相对定位的目标对象，offset{JSON}: 偏移值，$container{JQuery}：要插入的容器, position: 显示的位置
    	 * @return void
    	 */
		setPosition: function(elem, options) {
			var defaults = {target: null, offset: {left: 0, top: 0}, container: $(document.body), position: "bottom"},
			
    			opts = $.extend({}, defaults, options),
    			
    			left, top;
    		
    		if (null !== opts.target) {
    			var offset = opts.target.offset(),
    			
    				position = opts.position;
    			
    			if (position === "left") {
    				left = offset.left - elem.width();
    				top = offset.top;
    				
    			} else if (position === "right") {
    				left = offset.left + opts.target.outerWidth();
    				top = offset.top;
    				
    			} else if (position === "top") {
    				left = offset.left;
    				top = offset.top - elem.height();
    				
    			} else {
    				left = offset.left;
        			top = offset.top + opts.target.outerHeight() + (opts.container ? opts.container.scrollTop() : 0);
    			}
    			
    			left += opts.offset.left;
    			top += opts.offset.top;
    			
    		} else {
    			var cwidth = document.documentElement.clientWidth,
				
					cheight = document.documentElement.clientHeight,
    				
    				width = elem.width(),
    				
    				height = elem.height();
    				
    			left = Math.max(0, (cwidth - width)/2) + document.documentElement.scrollLeft + document.body.scrollLeft;    				
    			top = Math.max(0, (cheight - height)/2) + document.documentElement.scrollTop + document.body.scrollTop;  			
    		}
    		
    		elem.css({
				position: 'absolute',
				zIndex: '100',
				left: left,
				top: top
			});
		}
	});
})(jQuery);