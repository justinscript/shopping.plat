/**
 * gozap平台对ajax的统一处理
 * 主要是在jQuery的基础上提供一些通用处理的支持
 * @author lanbo
 * requires: gozap.lang
 * */
(function($) {
	var G = $.gozap, encode = encodeURIComponent;
	
	$.extend(G, {
		/**
		 * gozap的ajax方法，在jQuery的基础上加上了业务自身的通用处理，主要是错误处理
		 * 
		 * @param options 同$.ajax的options
		 * 		增加一个属性 tipsHandler:提示处理函数
		 */
		ajax: function(options) {
			options = options || {};
			
			var fn = options.success,
			
				success;
			
			success = function(data) {
				if (!data || (!data.result && !data.code)) return;
				
				var result = data.result || data, code = result.code, type;
				
				// session过期处理,或者没有登录
				if (code == "1002") {
					//top.location.href = "/login";
					return;
					
				} else if (code == G.RESULT_CODE.success) {
					type = G.TIPS_TYPE.success;
					
				} else {
					type = G.TIPS_TYPE.error;
				}
				
				// 显示提示信息
				if (result.message && $.isFunction(options.tipsHandler)) {
					options.tipsHandler.apply(null, [type, result.message]);
				}
				
				// 将data中的item toArray
				if (result.data && result.data.query && result.data.query.item) {
					result.data.query.item = G.toArray(result.data.query.item);
				}
				
				if ($.isFunction(fn)) {
					fn(result);
				}
			}
			$.extend(options, {
				dataType: "json",
				success: success
			});
			options.success = success;
			$.ajax(options);
		},
		
		/**
		 * 序列化
		 * 
		 * @param container{jQuery} 要序列化元素的容器
		 * @param beanName{String}
		 * @return
		 */
		serialize: function(container, beanName) {
			if (!beanName) {
				return container.serialize();
			}
			
			return G.param(container.serializeArray(), beanName);
		},
		
		/**
		 * 将JSON对象序列化
		 * 
		 * @param o{JSON}
		 * @param beanName{String}
		 * @return
		 */
		param: function(o, beanName) {
			var target = {};
			
			if (beanName && !G.isArray(o)) {
				$.each(o, function(n, v){
					n = beanName + "." + n;
					target[n] = v;
				});
				
			} else {
				target = o;
			}
			
			return param(target, beanName);
		},
		
		unparam: function() {
			
		}
	});
	
	function param(obj, beanName) {
		var ret = [],
		
			add = function(key, value) {
				value = $.isFunction(value) ? value() : value;
				ret.push(encode(key) + "=" + encode(value));
			};
			
		// Serialize the form elements	
		if (G.isArray(obj)) {
			$.each(obj, function(i, v) {
				var name = beanName ? beanName + "." + v.name : v.name;
				add(name, v.value);
			});
			
		} else {
			for (var prefix in obj) {
				buildParams(prefix, obj[prefix], add);
			}
		}
		
		return ret.join("&");
	}
	
	function buildParams(prefix, obj, add) {
		if (G.isArray(obj)) {
			$.each(obj, function(i, v) {
				buildParams(prefix + "[" + i + "]", v, add);
			});

		} else if (obj != null && typeof obj === "object") {
			for (var name in obj) {
				buildParams(prefix + "." + name, obj[name], add);
			}

		} else {
			add(prefix, obj);
		}
	}
	
	// 修改ajax默认配置
	$.ajaxSetup({
		type: "POST",
		traditional: true,
		timeout: 30000
	});
})(jQuery);

