/**
 * @author lanbo
 */
(function($) {	
	if ( !$.gozap ) {
		$.gozap = {};
	}
	G = $.gozap;
	
	var toString = Object.prototype.toString,
		class2type = {};
	
	$.extend(G, {
		TIPS_TYPE: {
			"success": "0",
			"error": "1",
			"loading": "2",
			"warning": "3"
		},
		
		// 返回结果操作码
		RESULT_CODE: {
			"success": "9999"
		},
		
		/**
		 * 获取对象的类型
		 * @return {String}
		 */
		type: function(o) {
	        return o == null ?
	            String(o) :
	            class2type[toString.call(o)] || "object";
	    },
	    
		/**
		 * 深度克隆方法
		 * 只处理plainObject和Array 其他忽略直接返回
		 * 
		 * @param o{plainObject or Array}
		 * @return 克隆出的对象
		 */
		clone: function(o) {
			var ret = o, b, k;
	
	        if (o && ((b = $.isArray(o)) || $.isPlainObject(o))) {
	            ret = b ? [] : {};
	            for (k in o) {
	                if (o.hasOwnProperty(k)) {
	                    ret[k] = G.clone(o[k]);
	                }
	            }
	        }
	
	        return ret;
		},
		
		/**
		 * 创建一个命名空间并返回
		 * 如果主命名不空间存在则放入gozap下
		 * host默认为jQuery
		 * @param ns {String}
		 * @param host {Object}
		 * @param value {Object}
		 * @return 返回创建好的ns
		 */
		namespace: function(ns, host, value) {
			var ds = ns.split("."), d, cd = host || $,
				i, l = ds.length;
			
			for (i = 0; i < l; i++) {
				d = ds[i];
				if (!cd[d]) {
					if (value && i === l - 1) {
						cd[d] == value;
						
					} else {
						cd[d] = {};
					}
				}
				cd = cd[d];
			}
			return cd;
		},
		
		/**
		 * 获得当前时间对象
		 * 
		 * @return {Date}
		 */
		now: function() {
			return new Date().getTime();
		},
		
		/**
		 * 获取随机ID
		 * 
		 * @param n{Number} 要生成id的位数
		 * @return {String} 生成的id
		 */
		getRandomId: function(n) {
			var chars = ['0','1','2','3','4','5','6','7','8','9','0','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
			var id = "", index;
			for (var i = 0; i < n; i++) {
		        index = Math.floor(Math.random()*35);
		        id += chars[index];
		    }
		    return id;
		},
		
		/**
    	 * 判断array1 是否包含array2的所有元素
    	 * @param array1{Array}
    	 * @param array2{Array}
    	 * @return {Boolean}
    	 */
    	containsAll: function(array1, array2){
    		if ( array2.length > array1.length ) return false;
    		
    		var elem;
    		for ( var i = 0, len = array2.length; i < len; i++ ) {
    			elem = array2[i];
    			if ($.inArray(elem, array1) < 0) {
    				return false;
    			}
    		}
    		
    		return true;
    	},
    	
    	/**
    	 * 判断2个数组中的元素是否全部一样
    	 * @param array1{Array}
    	 * @param array2{Array}
    	 * @return {Boolean}
    	 */
    	isEqualArray: function(array1, array2) {
    		if (array1.length !== array2.length) {
    			return false;
    		}
    		
    		array1 = array1.concat();
    		array2 = array2.concat();
    		var i, elem1, j, len2 = array2.length;
    		
    		for (i = array1.length - 1; i >= 0; i--) {
    			elem1 = array1[i];
    			if ((j=$.inArray(elem1, array2)) > -1) {
    				array1.splice(i, 1);
    				array2.splice(j, 1);
    				
    			} else {
    				return false;
    			}
    		}
    		return true;
    	},
    	
    	/**
    	 * 去除数组中重复的元素
    	 * 
    	 * @param array{Array}
    	 * @param fn{Function} (可选) 比较2个元素是否相等的函数 (return true为相等)
    	 */
    	unique: function(array, fn) {
    		fn = fn || function(a, b) {
    			return a === b;
    		}
    		
    		var i, j, len = array.length;
    		
    		for (i = len - 1; i > 0; i--) {
    			for (j = i - 1; j >= 0; j--) {
    				if (fn(array[i], array[j])) {
    					array.splice(i, 1);
    					break;
    				}
    			}
    		}   		
    	},
    	
    	/**
    	 * 删除对象中的属性
    	 * 
    	 * @param o{Object} 对象
    	 * @param k{String} 属性key
    	 */
    	deleteAttribute: function(o, k) {
    		if (o[k] !== undefined) {
    			o[k] = null;
    			delete o[k];
    		}
    	},
    	
    	/**
		 * 将单个元素转换为数组，已是数组的忽略
		 */
		toArray: function(elem) {
			if (!elem && elem !== "" && elem !== 0) {
				return [];
			}
			return G.isArray(elem) ? elem : [elem];
		}
	});
	
	// 类型判断
	$.each("Boolean Number String Function Array Date RegExp Object".split(" "),
		function(i, v) {
			var t = v.toLowerCase();
			class2type["[object " + v + "]"] = t;
			G["is" + v] = function(o) {
				return G.type(o) == t;
			}
		});
	
	G.namespace("gozap.labi");
	G.namespace("gozap.datoutie");
	G.namespace("gozap.digg");
})(jQuery);