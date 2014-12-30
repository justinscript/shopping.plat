/**
 * 蜡笔core
 * @author lanbo
 * requires: gozap.lang, labi.i18n
 */
(function($) {
	
	var G = $.gozap, L = G.labi, i18n = L.i18n,
		
		// 顶部提示的延迟时间
		TOP_TIPS_DELAY = 3000,
		
		// 顶部提示的timeout
		tipsTimeout,
		
		mainContext = window.top.document;
	
	currentPage = {};
	
	$.extend(L, {
		TIPS_TYPE: G.TIPS_TYPE,
		
		// 返回结果操作码
		RESULT_CODE: G.RESULT_CODE,
		
		buttonType: {
			BTN_TYPE_LEAD: "1",
			BTN_TYPE_NON_LEAD: "2",
			BIN_TYPE_NORMAL: "3",
			BTN_TYPE_TOOL: "4",	
			BTN_TYPE_PNUM: "5"
		},
		
		/**
		 * 蜡笔本身的显示元素方法
		 * @param o{jQuery}
		 * @return {jQuery}
		 */
		show: function(o) {
			return o.show();
		},
		
		/**
		 * 蜡笔本身的隐藏元素方法
		 * @param o {jQuery}
		 * @return {jQuery}
		 */
		hide: function(o) {
			return o.hide();
		},
		
		/**
		 * 格式化时间方法
		 * @param s {Number} 毫秒数
		 * @return {String} 字符串型日期时间
		 */
		formatDate: function(s){
			var t = new Date(parseInt(s)/1000);
			var h = t.getHours()<10?"0"+t.getHours():t.getHours();
			var m = t.getMinutes()<10?"0"+t.getMinutes():t.getMinutes();
			return t.getFullYear()+"-"+(t.getMonth()+1)+"-"+t.getDate()+"  "+h+":"+m;
		},
		
		/**
		 * 显示顶部提示信息
		 * @param type{String} 类型
		 * @param text{String} 提示文字
		 * @param delay{Number} 提示显示时间(s)
		 */
		showTopTips: function(type, text, delay) {
			var t = L.TIPS_TYPE,
			
				container = $("#tips_top_container"),
				
				o = container.children(),
				
				closeBtn = o.find("a"),
				
				span = o.find("span"),
				
				type = type || t.loading;
			
			delay = delay || TOP_TIPS_DELAY;
			
			if (type === t.loading) {
				span.css("margin", "0 20px");
				closeBtn.hide();
				text = text || i18n.common.topTips.loading;
				o.css({
					borderColor: "#99ccff",
					backgroundColor: "#cae1fe"
				});
				
			} else {
				span.css("margin", "0 30px 0 10px");
				closeBtn.show().removeClass().addClass("icon-common");
				if (type === t.success) {
					o.css({
						borderColor: "#34cb00",
						backgroundColor: "#ccffcc"
					});
					closeBtn.addClass("icon-close-success");
					
				} else if (type === t.error) {
					o.css({
						borderColor: "#ff9999",
						backgroundColor: "#ffcccc"
					});
					closeBtn.addClass("icon-close-fail");
					
				} else if (type === t.warning) {
					o.css({
						borderColor: "#f3c302",
						backgroundColor: "#ffffd5"
					});
					closeBtn.addClass("icon-close-warning");
				}
				
				if (tipsTimeout) {
					tipsTimeout = clearTimeout(tipsTimeout);
				}
				
				tipsTimeout = setTimeout(function() {
					container.hide();
					tipsTimeout = null;
				}, delay);
			}
			o.find("span").html(text);
			container.show();
		},
		
		/**
		 * 隐藏顶部提示
		 */
		hideTopTips: function() {
			if (tipsTimeout) {
				tipsTimeout = clearTimeout(tipsTimeout);
			}
			$("#tips_top_container").hide();
		},
		
		isAvailable: function(s) {
			return s && !(s instanceof Object) && s != "[object Object]";
		},
		
		toArray: G.toArray,
		
		/**
		 * 对当页数据进行删除后返回的页码
		 * 
		 * @param lastPage{Number} 原始页码
		 * @param pages{Number} 每页条数
		 * @param totalItems{Number} 总条数
		 * @param items{Number} 删除的条目数
		 * @return {Number}
		 */
		getReturnPage: function(lastPage, pages, totalItems, items) {
			lastPage = parseInt(lastPage);
			pages = parseInt(pages);
			totalItems = parseInt(totalItems);
			items = parseInt(items);
			
			// 总页数
			var tp = Math.ceil(totalItems / pages);
			if (lastPage == tp &&
					lastPage > 1 &&
						(items == pages ||
						items == (totalItems % pages))) {
				return lastPage - 1;
			}
			return lastPage;
		},
		
		/**
		 * 重新设置iframe的高度
		 */
		resizeLabiFrame: function() {
			$("#main_frame, #main_content").height($("#main_frame").contents().find("#content").height());
		},
		
		/**
		 * 回到顶部
		 */
		goTop: function() {
			$(window).scrollTop(0);
		},
		
		/** 
		 * 改变主导航样式
		 * @param module{String} 模块名
		 */
		changeMainNavStyle: function(module){
			var currentModule = currentPage.module;
			
			if (currentModule === "crc") {
				currentModule = "sms";
			}
			
			if (module === "crc") {
				module = "sms";
			}
			
			// 当前模块与要跳转到的模块一致 不作处理
			if (module == currentModule) {
				return;
			}
			
			var $nav_last = $("#nav_" + currentModule);
			if ($nav_last.length > 0) {
				$nav_last.removeClass("nav-" + currentModule + "-active").removeClass("nav-" + currentModule + "-mouseover");
			}
			
			var $nav_now = $("#nav_" + module);
			if ($nav_now.length > 0) {
				$nav_now.addClass("nav-" + module + "-active");
			}
		},
		
		/**
		 * 模块初始化
		 * 将模块名和模块信息存储到currentPage中{module: info:}
		 * @param module{String} 模块名
		 * @param info{Json} 其他信息
		 */
		initModule: function(module, info) {
			L.changeMainNavStyle(module);
			currentPage.module = module;
			if (info) {
				currentPage.info = info;
				
			} else {
				delete currentPage.info;
			}
		},
		
		/**
		 * 显示蒙板
		 */
		showMask: function() {
			$("#mask").css({
				width: Math.max(document.documentElement.scrollWidth, document.documentElement.clientWidth),
				height: Math.max(document.documentElement.scrollHeight, document.documentElement.clientHeight)
			}).show();
		},
		
		/**
		 * 隐藏蒙板
		 */
		hideMask: function() {
			$("#mask").hide();
		},
		
		/**
		 * 版本比较
		 * 
		 * @param version 自己的版本
		 * @param target 目标版本
		 * @return {Number}
		 */
		compareVersion: function(version, target) {
			var vs = version.split("."), ts = target.split("."),
			
				len = Math.min(vs.length, ts.length),
				
				v, t;
			
			for (var i = 0; i < len; i++) {
				v = parseInt(vs[i]);
				t = parseInt(ts[i]);

				if (v !== t) {
					return v - t;
				}
			}
			
			return vs.length - ts.length;
		},
		
		/**
		 * 对String进行高亮(主要用于搜索)
		 * 
		 * @param s{String} 要高亮的字符串
		 * @param q{String} 待匹配的字符串
		 * @return {String} 高亮后的字符串
		 */
		highlight: function(s, q) {
			if (!q) {
				return s;
			}
			
			return s.replace(new RegExp(q, "g"), function(w) {
				return "<b>" + w + "</b>";
			});
		},
		
		/**
		 * 对String进行截断处理
		 * 
		 * @param s{String} 要处理的string
		 * @param n{Number} 留下的位数
		 * @return {String} 处理后的String
		 */
		cutOff: function(s, n) {
			if (s.length > n) {
				return s.substring(0, n) + "...";
			}
			return s;
		},
		
		/**
		 * 对手机的显示进行处理
		 * 
		 * @param imei
		 * @param flag
		 * @return {String} 
		 */
		viewPhone: function(imei, flag) {
			var info = parent.statusInfo[imei],
			
				pnum = info.pnum;
			
			if (!pnum) {
				if (!flag && info.brand) {
					return info.brand + " " + info.model;
					
				} else {
					return i18nCommon.inactive;
				}
			}
			
			return pnum;
		},
		
		/**
		 * 获取图片路径
		 */
		getImgPath: function(src) {
			if (src) {
				var url = "http://img.labi.com",
				
					// 相对路径
					relative,
					
					// 绝对路径
					absolute,
					
					defaultPath = DEFAULT_USER_IMAGE_PATH;
				
				if (src.indexOf(defaultPath) == 0) {
					absolute = src;
					relative = src.replace(defaultPath, "");
					
				} else if(src.indexOf(url) == 0){
					relative = src.replace(url, "");
					absolute = defaultPath + relative;
					
				} else {
					if(src.substring(0, 1) != "/"){
						src = "/" + src;
					}
					relative = src;
					absolute = defaultPath + relative;
				}
				return {absolute:absolute,relative:relative};
				
			} else {
				return {absolute:"",relative:""};
			}
		},
		
		/**
		 * 获取图片绝对路径
		 * 
		 * @param 图片相对路径
		 */
		getImageAbsolutePath: function(relativeUrl) {
			return L.getImgPath(relativeUrl).absolute;
		},
		
		/**
		 * 按钮的状态
		 * @param obj
		 * @param type
		 */
		setButtonDisabled: function(obj, buttonType) {
			var type = buttonType;
			if ( parseInt(type) ) {
				obj.removeAttr("abled-status");
				obj.addClass("button-disabled-"+type).css({
					cursor: "default",
					outline: "none"
				}).find("span").css("cursor", "default");
			} else {
				return;
			}
		},
		setButtonAbled: function(obj, buttonType) {
			var type = buttonType;
			if ( parseInt(type) ) {
				obj.attr("abled-status", true);
				obj.removeClass("button-disabled-"+type).css("cursor", "pointer").find("span").css("cursor", "pointer");
			} else {
				return;
			}
			
		},
		
		/**
		 * 判断按钮的状态， true为可用
		 * @param ele
		 * @return {boolean}
		 */
		buttonCanAbled: function( obj ) {
			if ( obj.attr("abled-status") ) {
				return true;
				
			} else {
				return false;
				
			}
		}
	});
})(jQuery);