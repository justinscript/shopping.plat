/**
 * 头像上传
 * 
 * */
(function($){
	/** 默认大头像地址 */
	var G = $.gozap, L = G.labi, LC = L.contact, i18n = L.i18n, i18nCommon = i18n.common, i18nAvaUpload = i18n.avaUpload,
		
		DEFAULT_BIG_AVATAR_SRC = "",
	
		IMAGE_ORIGINAL_ID = "image-original",
		
		IMAGE_PREVIEW_ID = "image-preview",
		
		IMAGE_MAX_WIDTH = 300,
		
		IMAGE_MAX_HEIGHT = 300,
		
		ias,
		
		RESOURCEPATH = "/images/",
		
		FILE_TYPE_ERROR = 'fileTypeError',
		
		FILE_SIZE_ERROR = 'fileSizeError',
		
		MASK_ID = 'labi-mask',
		
		imgw = null,
		
		imgh = null,
		
		ie6 = $.browser.msie && $.browser.version < 7,
		
		iframeSrc = ie6 ? "blank.html" : "about:blank",
				
		contactGuid;
	
	/** 初始化图片上传界面 */
	var init = function(guid, src){
		if (G.swf.version && 
				parseInt(G.swf.version.substring(0, G.swf.version.indexOf("."))) > 9 &&
				!$.browser.chrome) {
			contactGuid = guid;
			showFlashDialog();
			return;
		}
		
		var content = $('<div></div>')
				.addClass('avaupload-dialog-content'),
			
			iframe = $('<iframe name="uploadIframe"></iframe>')
				.css('display', 'none')
				.attr({
					src: iframeSrc
				})
				.appendTo(content),
				
			form = $('<form enctype="multipart/form-data" method="post"></form>')
				.attr({
					target: "uploadIframe",
					action: "imageUpload!insertImageNotConfirm.action?t=1"
				})
				.html('<input type="hidden" name="x1" value="0" /><input type="hidden" name="y1" value="0" /><input type="hidden" name="width" value="0" /><input type="hidden" name="height" value="0" /><input type="hidden" name="guid" value="'+guid+'" /><input type="hidden" name="fileName" value="" />')
				.appendTo(content),
				
			
			inputFile = $('<input type="file" name="upload" />')
				.addClass("file")
				.attr({
					size: "37"
				})
				.bind('change', function(){
					$('#H-avaupload-dialog a.btn' + BTN_TYPE_LEAD).attr('disabled', 'disabled');
					imageDefault.hide();
					imageLoading.show();
					form.attr("action", "imageUpload!insertImageNotConfirm.action?t=1").submit();
				})
				.appendTo(form),
				
			table = $('<table></table>')
				.attr({
					cellspacing: '0',
					cellpadding: '0',
					width: '100%'
				})
				.appendTo(content),
				
			tr = $('<tr></tr>')
				.appendTo(table),
				
			td1 = $('<td width="330" valign="top"></td>')
				.appendTo(tr),
				
			td2 = $('<td valign="top"></td>')
				.appendTo(tr),
				
			tips1 = $('<div></div>')
				.addClass('picture-dialog-content-uploadtips')
				.text(i18nAvaUpload.imageUploadTips)
				.appendTo(td1),
				
			imageContainer = $('<div></div>')
				.addClass('picture-dialog-content-imagecontainer')
				.appendTo(td1),
				
			image = $('<img src="" />')
				.attr({
					id: 'H-ava-upload'
				})
				.css('display', 'none')
				.appendTo(imageContainer),
				
			imageDefault = $('<img src="image/upload-default.png" />')
				.addClass('upload-image-default')
				.attr({
					id: 'H-upload-image-default'
				})
				.appendTo(imageContainer),
				
			imageLoading = $('<img src="image/upload-loading.gif" />')
				.addClass('upload-image-loading')
				.attr({
					id: 'H-upload-ava-loading'
				})
				.appendTo(imageContainer),
				
			tips2 = $('<div></div>')
				.addClass('picture-dialog-content-uploadtips')
				.text(i18nAvaUpload.tips)
				.appendTo(td2),
				
			preview1 = $('<div><img src="" style="position:relative;display:none;" /></div>')
				.addClass('ava-preview-140')
				.attr({
					id: "H-image-preview-140"
				})
				.appendTo(td2),
				
			preview1Size = $('<div></div>')
				.addClass('ava-preview-size')
				.text('140x140')
				.appendTo(td2),
				
			preview2 = $('<div><img src="" style="position:relative;display:none;" /></div>')
				.addClass('ava-preview-48')
				.attr({
					id: "H-image-preview-48"
				})
				.appendTo(td2),
				
			preview2Size = $('<div></div>')
				.addClass('ava-preview-size')
				.text('48x48')
				.appendTo(td2),
							
			options = {
				id: 'H-avaupload-dialog',
				dialogClass: 'avaupload-dialog',
				title: i18nAvaUpload.title,
				titleImgClass: 'avaupload-dialog-icon',
				content: content,
				container: $(document.body),
				buttons: {}
			};
			options.buttons[i18nAvaUpload.upload] = function() {
				if ( $("#H-avaupload-dialog input[name='fileName']").val() == "" ) {
					L.showTopTips(L.TIPS_TYPE.error, i18nAvaUpload.select);
					return false;
				}
				form.attr('action', 'imageUpload!uploadAvatar.action').submit();
				return false;
			}
			options.buttons[i18nCommon.buttonText.cancel] = "";
		
		$.dialog(options);		
		
	}
	
	function showFlashDialog() {
		var content = "<object id=\"swf_ava_upload\" classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" width=\"541\" height=\"451\">" +
						"<param name=\"movie\" value=\""+RESOURCEPATH+"GozapToolComponentTest.swf\" /><param name=\"quality\" value=\"high\" />" +
						"<param name=\"allowScriptAccess\" value=\"always\" />" +
						"<param name=\"FlashVars\" value=\"swfId=swf_ava_upload&showStyle=0&uploadDataFieldName=upload&uploadSvrURL=imageUpload!flashUpload.action\">" +
						"<embed src=\""+RESOURCEPATH+"GozapToolComponentTest.swf\" id=\"GozapToolComponentTest\" allowscriptaccess=\"always\" swliveconnect=\"true\" quality=\"high\" type=\"application/x-shockwave-flash\" " +
							"flashvars=\"swfId=swf_ava_upload&showStyle=0&uploadDataFieldName=upload&uploadSvrURL=imageUpload!flashUpload.action\" width=\"541\" height=\"451\"></embed>" +
						"</object>";
		
		var options = {
			id: 'H-avaupload-dialog',
			dialogClass: 'avaupload-dialog',
			title: i18nAvaUpload.title,
			titleImgClass: 'avaupload-dialog-icon',
			content: content,
			contentClass: 'flash-dialog-content',
			container: $(document.body),
			buttons: {}
		};
		
		$.dialog(options);
	}
	
	/** 图片预览 */
	var preview = function(img, selection) {
	 	var scaleX = 48 / (selection.width || 1), 
	 		scaleY = 48 / (selection.height || 1),
	 		$img = $(img);
	 		if(imgw === null){
	 			imgw = $img.width();
	 		}
	 		if(imgh === null){
	 			imgh = $img.height();
	 		}
	 	
	 	$("#H-image-preview-48>img").css({ 
	 		width: Math.round(scaleX * imgw) + 'px',
	 		height: Math.round(scaleY * imgh) + 'px', 
			marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px', marginTop: '-' + Math.round(scaleY * selection.y1) + 'px' 
		});
	 	
	 	scaleX = 140 / (selection.width || 1);
	 	scaleY = 140 / (selection.height || 1);
	 	$("#H-image-preview-140>img").css({ 
	 		width: Math.round(scaleX * imgw) + 'px',
	 		height: Math.round(scaleY * imgh) + 'px', 
			marginLeft: '-' + Math.round(scaleX * selection.x1) + 'px', marginTop: '-' + Math.round(scaleY * selection.y1) + 'px' 
		});
	}
	
	/** 头像上传以后的回调 */
	var avaUploadCallback = function(src, fileName, width, height){
		$('#H-avaupload-dialog a.btn' + BTN_TYPE_LEAD).removeAttr('disabled');
		$('#H-upload-ava-loading').hide();
		$('#H-ava-upload').show();
		if(src == 'error'){
			L.showTopTips(L.TIPS_TYPE.error, i18nAvaUpload.failed);
		}
		else if(src == FILE_TYPE_ERROR){
			L.showTopTips(L.TIPS_TYPE.error, i18nAvaUpload.fileTypeError);
		}
		else if(src == FILE_SIZE_ERROR){
			L.showTopTips(L.TIPS_TYPE.error, i18nAvaUpload.fileSizeError);
		}
		else{
			imgw = null;
			imgh = null;
			width = parseInt(width);
			height = parseInt(height);
			var x1, y1, x2, y2;
			if(width < height){
				x1 = 0;
				x2 = width - 1;
				y1 = parseInt((height - width) / 2);
				y2 = y1 + width - 1;
			}
			else{
				x1 = parseInt((width - height) / 2);
				x2 = x1 + height - 1;
				y1 = 0;
				y2 = height - 1;
			}
				
			$('#H-ava-upload')
				.attr('src', src)
				.css({
					position: "absolute",
					left: (IMAGE_MAX_WIDTH - width) / 2,
					top: (IMAGE_MAX_HEIGHT - height) / 2
				})
				.show()
				.imgAreaSelect({ 
					handles: true,
	//				instance: true,
					parent: $('#H-avaupload-dialog'),
					aspectRatio: "1:1",
					x1: x1,
					y1: y1,
					x2: x2,
					y2: y2,
//					minHeight: 48,
//					minWidth: 48,
					onInit: preview,
					onSelectEnd: function (img, selection) { 
						$('#H-avaupload-dialog input[name=x1]').val(selection.x1); 
						$('#H-avaupload-dialog input[name=y1]').val(selection.y1); 
						$('#H-avaupload-dialog input[name=width]').val(selection.width); 
						$('#H-avaupload-dialog input[name=height]').val(selection.height); 
					},
					onSelectChange: preview
				});
			$("#H-image-preview-48>img, #H-image-preview-140>img").attr('src', src).show();
			$('#H-avaupload-dialog input:file').val('');
			$('#H-avaupload-dialog input[name=fileName]').val(fileName);
			$('#H-avaupload-dialog input[name=width]').val(Math.min(width, height));
			$('#H-avaupload-dialog input[name=height]').val(Math.min(width, height));
			$('#H-avaupload-dialog input[name=x1]').val(x1);
			$('#H-avaupload-dialog input[name=y1]').val(y1);
		}
	}
	
	/** 头像上传完毕的回调 */
	var avaUploadFinish = function(src_url, small_url, middle_url, guid, code){
		var ava = L.getImgPath(small_url);
		var iframe = $("#main_frame").contents();
		
		if(guid == ""){
			if(code == common.RESULT){
				if (getContentWindow().cardItem) {
					getContentWindow().cardItem.ava = ava.relative;
				}
				
				// 修改右侧头像
				$("#head_ava").attr("src", ava.absolute);
				
				if(currentPage.module == "setting"){
					iframe.find("#contact-ava").attr("src", ava.absolute);
				}
				
				$('#H-avaupload-dialog').remove();
				L.hideMask();
				
				L.showTopTips(L.TIPS_TYPE.success, labiTips.setAvaSuccess);
			}
			else{
//				$('#H-upload-ava-loading').hide();
//				$('#H-ava-upload').show();
				L.showTopTips(L.TIPS_TYPE.error, i18nCommon.basicErrorTips[code]);
			}
		}
		else if(guid == "add"){
			if(code == common.RESULT){
				iframe.find("#contact-ava")
					.attr("src", ava.absolute);
				$('#H-avaupload-dialog').remove();
				L.hideMask();
				
				getContentWindow().contact.setAvaForAdd(small_url);
			}
			else{
				L.showTopTips(L.TIPS_TYPE.error, i18nCommon.basicErrorTips[code]);
			}
		}
		else{
			if(code == common.RESULT){
				iframe.find("#contact-ava").attr("src", ava.absolute);
				
				var allData = LC.getAllData(), cntItems = allData.cnt;
				
				for(var i = 0; i < cntItems.length; i++){
					if(cntItems[i].guid == guid){
						cntItems[i].ava = ava.relative;
						break;
					}
				}
				
				$('#H-avaupload-dialog').remove();
				L.hideMask();
				
				L.showTopTips(L.TIPS_TYPE.success, labiTips.setAvaSuccess);
			}
			else{
//				$('#H-upload-ava-loading').hide();
//				$('#H-ava-upload').show();
				L.showTopTips(L.TIPS_TYPE.error, i18nCommon.basicErrorTips[code]);
			}
		}
	}
	
	function getGuid() {
		return contactGuid;
	}
	
	function flashUploadCallback(url) {
		if (url == "-1") {
			L.showTopTips(L.TIPS_TYPE.error, i18nAvaUpload.failed);
			
		} else if (url == "IOError") {
			L.showTopTips(L.TIPS_TYPE.error, i18nAvaUpload.failed);
			
		} else {
			$('#H-avaupload-dialog').remove();
			L.hideMask();
			
			var ava = L.getImgPath(url);
			var iframe = $("#main_frame").contents();
			
			if (contactGuid == "") {
				$.ajax({
					type : "POST",
					url : "labiCard!setCardAttr.action",
					data : "ava=" + ava.relative,
			//		timeout : timeout,
					error : function(xmlHttp, textStatus){
						treatError(xmlHttp, textStatus);
					},
					success : function(data){
						if(data == SESSION_TIMEOUT){
							treatSessionTimeout();
							return;
						}
							
						if (data == common.RESULT) {					
							if (getContentWindow().cardItem) {
								getContentWindow().cardItem.ava = ava.relative;
							}
							// 修改右侧头像
							$("#head_ava").attr("src", ava.absolute);
							
							if(currentPage.module == "setting"){
								iframe.find("#contact-ava").attr("src", ava.absolute);
							}
							
							L.showTopTips(L.TIPS_TYPE.success, labiTips.setAvaSuccess);					
						}
						else{
							L.showTopTips(L.TIPS_TYPE.error, i18nAvaUpload.failed);
						}
					}
				});
			}
			else if(contactGuid == "add"){				
				iframe.find("#contact-ava")
					.attr("src", ava.absolute);
				
				getContentWindow().contact.setAvaForAdd(url);
			}
			else{
				$.ajax({
					type : "POST",
					url : "labiContacts!setContactAttr.action",
					data : "guid="+contactGuid+"&ava=" + ava.relative,
			//		timeout : timeout,
					error : function(xmlHttp, textStatus){
						treatError(xmlHttp, textStatus);
					},
					success : function(data){
						if(data == SESSION_TIMEOUT){
							treatSessionTimeout();
							return;
						}
							
						if (data == common.RESULT) {					
							iframe.find("#contact-ava").attr("src", ava.absolute);
							
							var allData = LC.getAllData(), cntItems = allData.cnt;
							
							for(var i = 0; i < cntItems.length; i++){
								if(cntItems[i].guid == contactGuid){
									cntItems[i].ava = ava.relative;
									break;
								}
							}
							
							L.showTopTips(L.TIPS_TYPE.success, labiTips.setAvaSuccess);			
						}
						else{
							L.showTopTips(L.TIPS_TYPE.error, i18nAvaUpload.failed);
						}
					}
				});
			}
		}
	}
	
	/** 对外部开放的接口 */
	NS_avaUpload = {
		init : init,
		avaUploadCallback: avaUploadCallback,
		avaUploadFinish: avaUploadFinish,
		flashUploadCallback: flashUploadCallback,
		getGuid: getGuid
	}
})(jQuery);