/**
 * 蜡笔公用dialog组件
 * 
 * */
(function($) {	
	var G = $.gozap, L = G.labi, i18n = L.i18n, i18nCommon = i18n.common, i18nSMS = i18n.sms, i18nDialog = i18n.ui.dialog,
	
		commonDialogClasses = 'dialog ',
	
		dialog,
		
		MASK_ID = 'labi-mask',
		
		shim = null,
	
		// 默认值
	    defaults = {
			// dialog ID
			id: 'labi-dialog',
			
			// 标题文字
			title: "",
			
			// 标题图片样式
			titleImgClass: '',
			
			// 关闭按钮文字
			closeText: i18nCommon.close,
			
			// 内容区域
			content: '',
			
			height: 'auto',
			
			width: 300,
			
			maxHeight: false,
			
			maxWidth: false,
			
			minHeight: 150,
			
			minWidth: 150,
			
			position: 'center',
			
			zIndex: 100,
			
			// dialog样式 宽高在该class中设定
			dialogClass: '',
			
			// 是否可拖拽
			draggable: true,
			
			// 是否显示蒙板
			showMask: true,
			
			// 操作按钮
			// key为buttonValue value为fn
			buttons: {},
			
			// 其它button面板元素
			otherButtonPaneElem: false, 
			
			// 用来定位的目标对象
			target: null,
			
			// 是否需要点击dialog外部自动关闭
			autoClose: false,
			
			// 关闭按钮事件
			closeButtonHandler: null,
			
			// dialog的容器 默认为body
			container: false,
			
			// 关闭dialog时的回调
			closeDialogCallback: false,
			
			// 是否显示关闭按钮
			showCloseButton: true,
			
			contentClass: ""
		};
	
	var opts;
	
	$.dialog = function(options){
		opts = $.extend({}, defaults, options);
		return create(opts);
	}
	
	// 创建dialog
	var create = function(options){
		if ( $("#" + options.id).length > 0 ) $("#" + options.id).remove();
		
		var container = options.container || $(document.body);
		
		dialog = $('<div></div>')
				.appendTo(container)
				.css({
					zIndex: options.zIndex
				})
				.addClass(commonDialogClasses + options.dialogClass)
				.attr('id', options.id);
		
			// 标题栏
		var	dialogTitlebar = $('<div></div>')
				.addClass('dialog-titlebar')
				.prependTo(dialog),
			
			// 标题
			dialogTitle = $('<div></div>')
				.addClass('dialog-title ')
				.append($('<div></div>')
						.addClass(options.titleImgClass))
				.append($('<span></span>')
						.html(options.title))
				.appendTo(dialogTitlebar),
			
			// 对话框内容
			dialogContent = $('<div></div>')
				.html(options.content)
				.addClass('dialog-content ' + options.contentClass)
				.appendTo(dialog),
				
			id = options.id;
			
			// button pane
			createButtons(options.buttons, options.showMask, id);
			
		if ( options.showCloseButton ) {
			// 关闭按钮
			$('<div></div>')
				.addClass('dialog-titlebar-close')
				.click(function(){
					var fn = options.buttons[i18nCommon.buttonText.cancel], result;
					if ( !fn || false !== ( result = fn.apply(this, arguments) ) ){
						closeDialog(options.showMask, options.id);
					}
					
					if(result === MASK_HOLD){
						_showMask();
					}
				})
				.hover(
					function(){
						$(this).css("background-position", "-17px -32px");
					},
					function(){
						$(this).css("background-position", "0 -32px");
					})
				.appendTo(dialogTitlebar);
		}
			
		// 是否显示蒙板
		if(options.showMask){
			_showMask(options.zIndex - 1);
		}
		
		$.setPosition(dialog, {
			target: options.target,
			container: options.container
		});
			
		dialog.show();
		
		// 是否点击别处自动关闭
		if(options.autoClose){
			dialog.autoRemove();
		}
		
		// 是否可拖拽
		if(options.draggable){
			dialogTitle.drag();
		}
		
//		/** 如果是ie6加层iframe用来屏蔽select控件 */
//		if($.browser.msie && $.browser.version < 7){
//			shim = common.showShim(dialog, "H-dialog-shim");
//			dialog.data("shim", shim);
//		}
		
		return dialog;
	}
	
	// show mask
	var _showMask = function(zIndex) {
		L.showMask();
	}
	
	var _hideMask = function() {
		L.hideMask();
	}
	
//	// 创建mask
//	var createMask = function(zIndex){		
//		var height = $(document.body).height(),
//			
//			width = $(document.body).outerWidth(),
//			
//			mask = $('<div></div>');				
//		
//		mask
//			.attr({
//				id: MASK_ID
//			})
//			.addClass('op')
//			.css({
//				position: 'absolute',
//				zIndex: zIndex,
//				height: height,
//				width: width,
//				backgroundColor: '#000'
//			})
//			.show()
//			.appendTo(document.body);
//			
//	}
	
	var createButtons = function(buttons, showMask, id){
		var hasButtons = false;
		
		if(typeof buttons === 'object' && buttons !== null){
			$.each(buttons, function() {
				return !(hasButtons = true);
			});
		}
		
		if(hasButtons){
			var dialogButtonPane = $('<div></div>')
				.addClass('dialog-buttonpane');
				
			if ( opts.otherButtonPaneElem ) dialogButtonPane.append(opts.otherButtonPaneElem);
			
			var buttonContainer = $("<div></div>")
				.addClass("button-container")
				.appendTo(dialogButtonPane);
			
			if(id === 'H-sms-send-dialog'){
				// 费用提示
				var tips = $("<span></span>")
						.addClass("cost-tips")
						.text(i18nSMS.smsCostTips)
						.appendTo(dialogButtonPane);
				$.each(buttons, function(name, fn) {		
					var button;
					if(name == i18nCommon.buttonText.cancel){
						button = $('<a href="javascript:;" class="btn-cancel">'+name+'</a>')
							.click(function(){
								if($(this).attr('disabled') != 'disabled'){
									if ( fn ) fn.apply(this, arguments);
									
									closeDialog(showMask, id);									
								}
							})
							.appendTo(buttonContainer);
					}
					else{
						button = $(common.genButtonHtml(name, "3", "sms_sender_button_send"))
							.bind('click', function(){
								if($(this).attr('disabled') != 'disabled'){
									fn.apply(this, arguments);
								}
							})
							.appendTo(buttonContainer);
					}
				});
					
					// loading中显示的图片
				var	loadImage = $('<img src="'+parent.DEFAULT_SYSTEM_IMAGE_PATH+'loading_16_16.gif" />')
						.addClass('sms-send-load-img')
						.appendTo(buttonContainer);
			}
			else{			
				$.each(buttons, function(name, fn) {
					var button;
					if(name == i18nCommon.buttonText.cancel){
						button = $(common.genButtonHtml(name, BTN_TYPE_NON_LEAD))
							.click(function(){
								if($(this).attr('disabled') != 'disabled'){
									var result;
									if ( !fn || false !== ( result = fn.apply(this, arguments) ) ){
										closeDialog(showMask, id);
									}
									
									if(result === MASK_HOLD){
										_showMask();
									}
								}
							})
							.appendTo(buttonContainer);
					}
					else{
						button = $(common.genButtonHtml(name, BTN_TYPE_LEAD))
							.bind('click', function(){
								if($(this).attr('disabled') != 'disabled'){
									// 如果返回false则不自动close dialog
									var result;
									if(false !==(result = fn.apply(this, arguments))){
										closeDialog(showMask, id);
									}
									
									if(result === MASK_HOLD){
										_showMask();
									}
								}
							})
							.appendTo(buttonContainer);
					}
				});
			}
			
			dialogButtonPane.appendTo(dialog);
		}
	}
	
	// 关闭窗口
	var closeDialog = function(showMask, id){
		if(showMask){
			_hideMask();
		}
		$('#' + id).remove();
		
		if ( opts.closeDialogCallback ) {
			opts.closeDialogCallback();
		}
		
//		if(shim) shim.remove();		
	}
})(jQuery);
