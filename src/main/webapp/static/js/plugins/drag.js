/**
 * 蜡笔公用拖拽组件
 * 
 */
(function($){	
	var defaults = {
			// 是否可拖拽默认为true
			enable : true,
			
			// 要拖动的对象，默认为handle的父级的父级元素
			target : null,
			
			// 回调
			callback : {
				// move时的回调
				onMove : function(e){
					
				},
				
				// drop时的回调
				onDrop : function(e){
					
				} 
			}
		};
	
	$.fn.drag = function(options){
		var opts = $.extend({}, defaults, options);
				
		return this.each(function(){
			if(opts.enable){
				var $this = $(this);
				
				$this.bind('mousedown', function(e){	
					
					var target = opts.target || $this.parent().parent(), // 要拖拽的目标对象
					
						height = target.outerHeight(),
						
						width = target.outerWidth(),
					
						offset = target.offset(),
						
						left = offset.left,
					
						top = offset.top,
						
						lastElemLeft = left,
						
						lastElemTop = top,
					
						// 拖动开始时记录下鼠标的位置以及要拖动对象的位置 
						data = {
							left : left,
							top : top,
							pageX : e.pageX,
							pageY : e.pageY
						},
						
						// 辅助对象
						help = $("<div></div>")
							.appendTo(document.body),
							
						$d = $(document),
						
						body = document.documentElement || document.body,
						
						cw = Math.max(body.scrollWidth, body.clientWidth),
						
						ch = Math.max(body.scrollHeight, body.clientHeight),
						
						// 拖动事件处理函数
						handler = {
							move : function(e){
								window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
								
								left = lastElemLeft + e.pageX - e.data.pageX;
								top = lastElemTop + e.pageY - e.data.pageY;
								// 防止拖出
								if(parseInt(left) < 0) left = 0;
								if(parseInt(top) < 0) top = 0;
								if(top > ch - height) top = ch - height;
								if(left > cw - width) left = cw - width;
								
								help.css({
									left: left,
									top: top
									
								});
								
								opts.callback.onMove(e);								
							},
							
							drop : function(e){
								// 删除辅助对象
								help.remove();
								
								// 对目标对象进行定位
								target.css({
									left: left,
									top: top
								});
								
								var shim = target.data("shim");
								
								if(shim){
									shim.css({
										left: left,
										top: top
									});
								}
								
								$d.unbind("mousemove", handler.move).css("cursor", "");
								
								opts.callback.onDrop(e);
							}
						};
					
					$d.css("cursor", "move");
					
					/** 设置辅助div的样式 */
					help.css({
						height : target.outerHeight(),
						width : target.outerWidth(),
						border : "1px dotted #333",
						cursor : "move",
						position : "absolute",
						zIndex : parseInt(target.css("z-index")) + 1,
						left : left,
						top : top
					})
					
					/** 监听document的mousemove和mouseup */
					$d.bind('mousemove', data, handler.move).bind('mouseup', data, handler.drop);	
					
				});
			}
		});
	}
})(jQuery);