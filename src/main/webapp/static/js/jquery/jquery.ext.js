/**
 * jQuery扩展方法
 */
(function($) {
	$.fn.extend({
		/**
		 * 获取元素位置
		 */
		getRegion: function() {
			var offset = this.offset();
			
			return {
				left: offset.left,
				top: offset.top,
				right: offset.left + this.outerWidth(),
				bottom: offset.top - this.outerHeight()
			}
		}
	});
	
	$.extend({
		/**
         * Determines whether or not the provided object is undefined.
         */
        isUndefined: function(o) {
            return o === undefined;
        },

        /**
         * Determines whether or not the provided object is a boolean.
         */
        isBoolean: function(o) {
            return typeof o === 'boolean';
        },

        /**
         * Determines whether or not the provided object is a string.
         */
        isString: function(o) {
            return typeof o === 'string';
        },

        /**
         * Determines whether or not the provided item is a legal number.
         * NOTICE: Infinity and NaN return false.
         */
        isNumber: function(o) {
            return typeof o === 'number' && isFinite(o);
        },
        
        /** 
         * 插入样式
    	 * @param
    	 * 		style{string} : 样式字符串
    	 * 		styleId{string} : id
    	 * @return void
    	 *  */
        addStyleSheet: function(style, styleId){
    		styleId = styleId || "labi-style";
    		if(!$.browser.msie){
    			$("<style type='text/css' id='"+styleId+"'></style>").html(style).appendTo('head');
    		}
    		else{			
    			var oStyle = document.createElement('style');
    			oStyle.type = "text/css";
    			oStyle.id = styleId;
    			var oHead = document.getElementsByTagName('head')[0];
    	       
//    	        oHead.appendChild(oStyle);
    			if(oHead.firstChild){
    		        oHead.insertBefore(oStyle, oHead.firstChild);
    		    }
    			else{
    		        oHead.appendChild(oStyle);
    		    }
//    	        oHead.insertBefore(oStyle, oHead.firstChild);
    	        
    	        oStyle.styleSheet.cssText = style;
    		}
    	},
    	
    	/** 
    	 * 限制textarea的字数
    	 * @param 
    	 * 		length{Number}: 限制值
    	 * 		o{JQuery}: textarea
    	 * @return void
    	 *  */
    	limitTextarea: function(o, length){
    		var fn = function(){
    			var $this = $(this);
    			if($this.val().length > length){
    				$this.val($this.val().substring(0, length));
    			}
    		};
    		o.bind("keydown", fn).bind("change", fn);
    	},
    	
    	/**
    	 * 对input和textarea的提示处理
    	 * @param o{JQuery}
    	 * @return {JQuery}
    	 */
    	bindTipsEvent: function(o){
    		return o.focus(function(){
				var $this = $(this);
    			var id = $this.attr("id"),
    			
    				label = $this.siblings("label[for='"+id+"']");
    			
    			label.hide();    			
    		}).blur(function(){
    			var $this = $(this);
    			var id = $this.attr("id"),
    			
					label = $this.siblings("label[for='"+id+"']");
    			
    			if ($.trim($this.val()) === "") {
    				label.show();
    			}
    		});
    	},
    	
    	/**
    	 * input输入框下方的提示信息
    	 * @param o{JQuery}
    	 * @param offset(Object) : {left: 0, top: 0}
    	 * @return void
    	 */
    	bindInputTipsEvent: function(o, offset){
    		return o.focus(function(){
    			var $this = $(this);
    			var value = $.trim($this.val());
    			if(value === ""){
    				var text = $this.attr("tips");
    				var tips_o = $("<span></span>").text(text).addClass("input_tips").appendTo(document.body);
    				$.setPosition(tips_o, {
    					target: $this,
    					offset: offset
    				});
    				$this.data("tips", tips_o);
    			}
    			
    		}).blur(function(){
    			var $this = $(this);
    			if($this.data("tips")){
    				$this.data("tips").remove();
    			}
    			
    		}).keyup(function(){
    			var $this = $(this);
    			if($.trim($this.val()) !== "" && $this.data("tips")){
    				$this.data("tips").remove();
    				$this.removeData("tips");
    			}
    		}).change(function(){
    			var $this = $(this);
    			if($.trim($this.val()) !== "" && $this.data("tips")){
    				$this.data("tips").remove();
    				$this.removeData("tips");
    			}
    		});
    	},
    	
    	/**
    	 * 定位在某个目标元素下方,没有目标元素则定位在屏幕中间
    	 * @param $elem{JQuery} 要定位的元素
    	 * @param options{JSON} 其中的属性：target{JQuery}: 相对定位的目标对象，offset{JSON}: 偏移值，container{JQuery}：要插入的容器
    	 * @return void
    	 */
    	setPosition: function($elem, options){
    		var defaults = {target: null, offset: {left: 0, top: 0}, container: $(document.body)};
    		var opts = $.extend({}, defaults, options);
    		
    		if(null !== opts.target){
    			var position = opts.target.offset(),
    			
    				left = position.left + opts.offset.left,
    				
    				top = position.top + opts.target.outerHeight() + (opts.container ? opts.container.scrollTop() : 0) + opts.offset.top;
    			
    			$elem.css({
    				position: 'absolute',
    				zIndex: '100',
    				left: left,
    				top: top
    			});
    		}
    		else{
    			var cwidth = document.documentElement.clientWidth,
    				
    				cheight = document.documentElement.clientHeight,
    				
    				width = $elem.width(),
    				
    				height = $elem.height(),
    				
    				left = Math.max(0, (cwidth - width)/2) + document.documentElement.scrollLeft,
    				
    				top = Math.max(0, (cheight - height)/2) + document.documentElement.scrollTop;
    			
    			$elem.css({
    				left: left,
    				top: top
    			});
    		}
    	},
    	
    	/**
    	 * 获取当前日期为该月第几周
    	 * @param date{Date}
    	 * @return {Number}
    	 */
    	getWeekOfMonth: function(date){
    		var d = date.getDate(),
    		
    			wd = date.getDay();
    		   		
    		if ( wd === 0 ) wd = 7;
    		
    		if ( d > wd ) {
    			return Math.ceil( (d - wd) / 7 ) + 1; 
    		}
    		else {
    			return 1;
    		}
    		
    		return Math.floor( (d - wd) / 7 ) + 1; 
    	},
    	
    	/**
    	 * 获取当前日期为该月第几周
    	 * @param date{Date}
    	 * @return {Number}
    	 */
    	getWeekDayOfMonth: function(date){
    		var wom = $.getWeekOfMonth(date),
    		
    			wd = date.getDay(),
    			
    			fwd = new Date(date.getFullYear(), date.getMonth(), 1).getDay(); // 当月1号为周几
    		if ( wd !== 0 && fwd > wd ) wom--;
    		return wom;
    	}
	});
	
	$.fn.extend({
		getData: function(key){
			return this.attr("data-" + key);
		},
		
		setData: function(key, value){
			return this.attr("data-"+key, value);
		},
		
		autoRemove: function(options){
			var defaults = {hideMask: false};
			var opts = $.extend({}, defaults, options );
			var $this = this;
			var removeObj = function(){
				$this.remove();
				if($this.data("shim")) $this.data("shim").remove();
				
				if( opts.hideMask ) L.hideMask();
				unbind();
			};
			
			var bind = function(){
				var w = window;
				while(w){
					$(w.document).unbind("click", removeObj).bind("click", removeObj);
					if(w === w.parent) break;
					w = w.parent;
				}
			};
			
			var unbind = function(){
				var w = window;
				while(w){
					$(w.document).unbind("click", removeObj);
					if(w === w.parent) break;
					w = w.parent;
				}
			};
			
			setTimeout(function(){
				bind();
				
				$this.hover(
					function(){
						unbind();
					},
					function(){
						bind();
					}
				);
			}, 1);
		},
		
		bindTipsEvent: function(){
			return $.bindTipsEvent(this);
		},
		
		bindInputTipsEvent: function(offset){
			return $.bindInputTipsEvent(this, offset);
		}
	});
	
	$.extend($.browser, {
		chrome: (function() {
			return /chrome\/(\d+\.\d)/i.test(navigator.userAgent);
		})()
	});
})(jQuery);