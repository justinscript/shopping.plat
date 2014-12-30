/**
 * @author chenboxiang
 */
(function($) {

	var TYPES = "broadcast,service".split(",");

	/**
	 * 默认配置
	 */
	var defaults = {
		logLevel : "warn"
	};

	/**
	 * gozap comet组件
	 * 
	 * @Constructor
	 * 
	 */
	function GozapComet(settings) {
		$.extend(this, defaults, settings);

		this._init();
	}

	GozapComet.prototype = {

		/**
		 * 初始化方法，创建隐藏的iframe，并从iframe中加载cometd对象.
		 */
		_init : function() {
			var self = this,
				i = 0,
				IFRAME_ID = "comet_proxy_iframe",
				iframe = document.getElementById(IFRAME_ID);
			
			if (null == iframe) {
				$("body").append(
						"<iframe style=\"display:none;\" id=\""+IFRAME_ID+"\" src=\""
								+ self.iframeUrl + "\"></iframe>");
				iframe = document.getElementById(IFRAME_ID);
			}
			this.iframe = iframe;
			if (window.attachEvent) {
				iframe.attachEvent('onload', function() {
					self.iframeOnload.call(self);
				});
			} else {
				iframe.addEventListener('load', function() {
					self.iframeOnload.call(self);
				}, false);
			}
		},

		broadcast : function(callback) {

			if (this._isReady) {
				if (this.cometd.isDisconnected()) {
					this.cometd.handshake();
				}
				this.cometd.subscribe(GozapComet.generateChannel("broadcast",
						this.appId), callback);
			} else {
				this.addReadyListener(function() {
					this.broadcast(callback);
				});
			}
		},

		deliver : function(callback) {

			if (this._isReady) {
				if (this.cometd.isDisconnected()) {
					this.cometd.handshake();
				}
				this.cometd.subscribe(GozapComet.generateChannel("service",
						this.appId), callback);
			} else {
				this.addReadyListener(function() {
					this.deliver(callback);
				});
			}
		},

		/**
		 * iframe 加载完成之后，对cometd对象进行初始化 上午11:37:44
		 */
		iframeOnload : function() {
			var self = this, iframe = self.iframe, cometd = iframe.contentWindow.cometd;

			self.cometd = cometd;

			cometd.configure({
				url : self.serviceUrl,
				logLevel : self.logLevel
			});

			if (!this._isReady) {
				this._isReady = true;

				if (this._onReadyArray) {
					for ( var i = 0; i < this._onReadyArray.length; i++) {
						this._onReadyArray[i].call(self);
					}
				}
			}
		},

		/**
		 * 添加一个iframe ready事件的监听 下午4:44:50
		 * 
		 * @param listener
		 */
		addReadyListener : function(listener) {

			if (!listener) {
				throw new Error("invalid param: listener[" + listener + "]");
			}

			if (!this._onReadyArray) {
				this._onReadyArray = new Array();
			}
			this._onReadyArray.push(listener);
		}
	};

	$.extend(GozapComet, {
		generateChannel : function(type, appId) {
			if ($.inArray(type, TYPES) < 0) {
				throw new Error("invalid param: type");
			}

			if (null == appId || appId.indexOf("/") > -1) {
				throw new Error("invalid param: appId");
			}

			return "/" + type + "/" + appId;
		}
	});

	window.GozapComet = GozapComet;

})(jQuery);