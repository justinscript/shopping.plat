
(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nNotice = i18n.notice;
				
		var ResultCodeSuccess = L.RESULT_CODE.success,//成功代码9999
		sumWriteLength = 150,	//段子和yan yan字总数
		sumZixunLength = 512,	//资讯中的字总数限制
		kind = 0,				//TAB顺序号变量
		classType = 1,			//类别变量
		is_pic_clean = false,		//图片清空操作变量全局
		is_link_clean = false,		//链接清空操作变量全局
		submitTxtContent = "",	//最后提交给服务器的过滤过的输入内容
		obj="",				//当前文本框的ID
		ispublishing = false,	//是否正在发布
		imgurlSelect = "",		//选中的图片的url
		identifie = "",
		uploadImgSucess = false,//上传图片成功与否
		isHtPub = false,	//是否是话题发布
		topicId = 0;
		
		//输入文档框对应的编号
		var txtInputNum = {"0": "#txt-zixun", "1": "#txt-duanzi", "2": "#txt-img"};
		
	function init() {
		
		clearAllTextInput();	//清空发布框里的内容
		closeDialog();			//关闭发布框
		chouti.clickClear();	//发布框中，点击文本框后清空里面的label默认内容		
		changeTab();			//切换标签
		
		//点击文字tab发布按钮
		$("#pub-btn1").click(function(){
						
			checkIsHuaTi();		//检测是否是话题发布
			
			publish();
		})
		
		//链接按钮发布
		$("#pub-btn0").click(function(){
			
			checkIsHuaTi();		//检测是否是话题发布
			
			zixunPublish();
		})
		
		//图片按钮发布
		$("#pub-btn2").click(function(){
			
			checkIsHuaTi();	//检测是否是话题发布
			
			if(uploadImgSucess){//判断图片是否上传成功以及是否上传
				imgPublish();
				return true;
			} else {
				//内容为空时，按钮无效
				var txtContent = $.trim($(txtInputNum[kind]).val());
				if(txtContent == "") return;
				
				$("#write-error-box"+kind+" .write-error-desc").html("请先添加图片，再点击发布")
																.show();
				return false;
			}
		})
		
		//zhua 取资讯中的链接
		$("#add-pub-btn0").click(function(){
			
			is_link_clean = false;
			addLink();
		})
		
		//zhua取资讯时的url输入框回车事件
		
		$("#txt-zixun").keydown(function(event){
			
			if (event.keyCode == 13) {
					
					$("#add-pub-btn0").click();
			}
		})
		
		listenZixunPblicButton();//监听发布资讯中title输入框
		
		//点击发布到哪个类别下按钮,选中
		
				
		$("#to-btn-zixun, #to-btn-duanzi, #to-btn-duanzi2, #to-btn-yaoyan, #to-btn-pic, #to-btn-pic2, #to-btn-ask, #to-btn-ask2, #to-btn-ask3").click(function(){
			
			$(this).addClass("toclass-btn-valid")
					.removeClass("toclass-btn-unvalid");
			
			$(this).siblings(":not(.un1024,.unfavor)").addClass("toclass-btn-unvalid");
			$(this).siblings(":not(.un1024,.unfavor)").removeClass("toclass-btn-valid");
			
														
			$(".unfavor, .un1024").removeClass("toclass-btn-unfavor-valid")
						 .addClass("toclass-btn-unfavor-unvalid");
			
			//获取选中的当前类别顺序号
			var num = parseInt($(this).attr("lang"));
			classType = num;
			
		})
		//只是针对公从场合不宜按钮
		$(".unfavor").click(function(){
			
			$(this).addClass("toclass-btn-unfavor-valid")
					.removeClass("toclass-btn-unfavor-unvalid");
			
			$(this).siblings(":not(.un1024,.unfavor)").addClass("toclass-btn-unvalid");
			$(this).siblings(":not(.un1024,.unfavor)").removeClass("toclass-btn-valid");
											
			$(".un1024").removeClass("toclass-btn-unfavor-valid")
			 			.addClass("toclass-btn-unfavor-unvalid");
			
			//获取选中的当前类别顺序号
			var num = parseInt($(this).attr("lang"));
			classType = num;
			
		})
		
		//只是针对1024按钮
		$(".un1024").click(function(){
			
			$(this).addClass("toclass-btn-unfavor-valid")
					.removeClass("toclass-btn-unfavor-unvalid");
			
			$(this).siblings().not(".unfavor,.un1024").addClass("toclass-btn-unvalid");
			$(this).siblings().not(".unfavor,.un1024").removeClass("toclass-btn-valid");
			
			$(".unfavor").removeClass("toclass-btn-unfavor-valid")
 						.addClass("toclass-btn-unfavor-unvalid");
			
			//获取选中的当前类别顺序号
			var num = parseInt($(this).attr("lang"));
			classType = num;
			
		})
		
		
		//焦点在文本框，失去焦点后，边框变颜色
		var $txtboxs = $("#txt-zixun, #txt-zixun-content, #txt-zhaiyao, #txt-duanzi, #txt-img, #link-zixun-content");
		
		$txtboxs.focus(function(){
			$(this).css("border", "1px solid #99ccff");
		})
		
		$txtboxs.blur(function(){
			$(this).css("border", "1px solid #CCDCEF");
		})
		
		//链接清空按钮操作
		$("#clear-btn-link").bind("click", aclearLink);
		
		//文字清空按钮操作
		$("#clear-btn-wanzi").bind("click", aclearWenzi)
		
		//图片清空按钮操作
		$("#clear-btn-pic").bind("click", aclearPic);
		
	}
	
	//检测是否是话题发布
	function checkIsHuaTi(){
		
		var ht = $("#hidHtTag").val();
		
		if(ht == "huati") {
			
			isHtPub = true;
			
			topicId = $("#hidHtTag").attr("topicId");
			
		} else {
			
			isHtPub = false;
		}
		
	}
	//文字清空按钮操作
	
	function aclearWenzi() {
		
		//如果正在发布中点击清空无效
		if(ispublishing) return;
		
		$("#pubTabDuanzi").click();	//触发文字tab点击事件
		
		$("#write-error-box1 .write-error-desc").html("");
	}
	//链接清空按钮操作
	
	function aclearLink() {
		
		//如果正在发布中点击清空无效
		if(ispublishing) return;
		
		$("#pubTabZixun").click();	//触发链接tab点击事件
		
		$("#txt-zixun").focus()
						.val("");
		
		is_link_clean = true;
	}
	//图片清空按钮操作
	function aclearPic() {
		
		//如果正在发布中点击清空无效
		if(ispublishing) return;
		
		$("#pubTabPic").click();	//触发图片tab点击事件
		$("#repeat-upload-btn").click();	//触发重新上传点击事件
		is_pic_clean = true;
	}
	//切换标签
	function changeTab() {

			//链接TAB点击后
			$("#pubTabZixun").click(function(){
				
				clearAllTextInput();	//清空
				
				//TAB处于选中状态
				$(this).addClass("w-active color")
						.siblings().removeClass("w-active color");
				
				//显示相应的类的发布内容			
				var index = $("#tabs a").index(this);
				$("#dialog-main-content").children().eq(index).show()
													.siblings().hide();
				kind = 0;
				classType = 1;	//墨认选中资讯类别
				is_link_clean = true;
				ispublishing = false;
				
				$("#txt-zixun").focus()
								.val(" ")
								.val("");
				
				listenButton(kind);	
				
				//选中发布到的第一个按钮
				
				//选中发布到的第一个按钮
				
				var subjectName = $("#publishBtn").attr("lang");
				
				chouti.showOrHidePubtoBox(subjectName);
				
				
				//$("#zixun-big-area .toclass-btn-area a:visible:first").click();
				
				//$("#to-btn-zixun").click();
				$("#to-btn-duanzi2").addClass("toclass-btn-valid").removeClass("toclass-btn-unvalid");
				
			})
			//文字TAB点击后			
			$("#pubTabDuanzi").click(function(){
				
				//TAB处于选中状态
				$(this).addClass("w-active color")
						.siblings().removeClass("w-active color");
				
				//显示相应的类的发布内容	
				var index = $("#tabs a").index(this);
				$("#dialog-main-content").children().eq(index).show()
													.siblings().hide();

				kind = 1;
				classType = 100;//墨认选中段子类别
				ispublishing = false;
				
				$("#txt-duanzi").focus()
								.val(" ")
								.val("");
				
				listenButton(kind);
				
				//选中发布到的第一个按钮
				
				var subjectName = $("#publishBtn").attr("lang");
				
				chouti.showOrHidePubtoBox(subjectName);
				
				//$("#publish-content-duanzi .toclass-btn-area a:visible").click();
				
				//$("#to-btn-duanzi2").click();
				$("#to-btn-duanzi2").addClass("toclass-btn-valid").removeClass("toclass-btn-unvalid");
			})
			
			//图片 TAB点击后			
			$("#pubTabPic").click(function(){
				
				clearAllTextInput();	//清空
				
				//TAB处于选中状态
				$(this).addClass("w-active color")
						.siblings().removeClass("w-active color");
				
				//显示相应的类的发布内容	
				var index = $("#tabs a").index(this);
				$("#dialog-main-content").children().eq(index).show()
													.siblings().hide();
				
				kind = 2;
				classType = 4;//墨认选中图片类别
				is_pic_clean = true;
				ispublishing = false;
				
				$("#txt-img").focus()
							 .val(" ")
							 .val("");
				
				//选中发布到的第一个按钮
				
//选中发布到的第一个按钮
				
				var subjectName = $("#publishBtn").attr("lang");
				
				chouti.showOrHidePubtoBox(subjectName);
				
				
				//$("#publish-content-pic .toclass-btn-area a:visible").click();
				
				//$("#to-btn-pic2").click();
				
				uploadImg();			//上传图片
				listenButton(kind);							
				repeatUploadImg();		//重新上传图片
				$("#to-btn-pic2").addClass("toclass-btn-valid").removeClass("toclass-btn-unvalid");
			})
			
			
		}
		//上传图片
		function uploadImg() {
			
			$("#add-pub-btn2").click(function(){
				
				is_pic_clean = false;
				
				identifie = new Date().getTime();
				
				$("#timeHidden").val(identifie);
				
				$("#upload-img").attr("src","");	//清空原图片
				$("#imgUrl").val("");
				
				//alert($("#imgUrl").val());
				/*
				if($.browser.msie){
					alert($.browser.msie);
				}
				*/
				$("#imgUrl").unbind()
							.change(function(){
										
					//判断图片的扩展名
					var fileName = $(this).val();
					
					var fileSuff = fileName.substring(fileName.lastIndexOf(".")+1);	
					fileSuff = fileSuff.toLowerCase();
					var errbox = "#write-error-box"+kind+" .write-error-desc";
					if(fileSuff != "jpg" && fileSuff != "jpeg" && fileSuff != "gif" && fileSuff != "png")
		            {				
						$(errbox).html("您上传的图片格式不合法，请重新上传")
								  .show();
						return;
		            } else {
		            	$(errbox).hide();
		            }
					
					
					//显示loading,发布按钮隐藏
					$("#add-pub-btn"+kind).hide();
					$("#add-pub-loading"+kind).css("display", "block");
					
					$(".imgRule").hide();//支持格式文字提示隐藏					
					
					//提交表单进行导入
					
			           window.setTimeout(function(){
			        	  
			        	   IframeEvent();
			        	   
			        	   $('#uploadPicFrm').submit();	        		  
			        	   
			        	   	//监听iframe事件	        	   
			           },1)
			         
			        //$(this).remove();
			        
			       // $("#add-pub-btn2").append("<input type='file' name='imgUrl' id='imgUrl' size='1' hidefocus='true' value='' />");
			        //replaceWith();    
			        $("#txt-img").focus();
				})
				
			}) 			
			
		}
		//监听iframe事件
		function IframeEvent() {			
		
			if (window.attachEvent) {
				
                document.getElementById("uploadIframe").attachEvent('onload', uploadCallback);
            }
            else{
            	
                document.getElementById("uploadIframe").addEventListener('load', uploadCallback, false);
            }
			
		}
		
		//从iframe中获取内容（图片，错误信息）
		function uploadCallback() {
			
            var io = document.getElementById("uploadIframe");
            
            if (io.contentWindow) {
            	
                    responseData = io.contentWindow.document.body ? io.contentWindow.document.body.innerHTML : null;
                    
            } else if (io.contentDocument) {
            	
                    responseData = io.contentDocument.document.body ? io.contentDocument.document.body.innerHTML : null;
            }

            	
            DataProssesing(responseData);             	
           
		}
		
		//显示从iframe读出来的值
		function DataProssesing(responseData) {
			
			//里面会多出pre标签，去掉
			
			var d1 = responseData.indexOf("{");
			var d2 = responseData.lastIndexOf("}");
			
			var values = responseData.substring(d1, d2+1)
			
			//alert(values);
			//var values = $.parseJSON(values);

			values = eval("(" + values + ")");		
			var code = values.result.code;
			if(code == ResultCodeSuccess) {
				//alert(values.result.data.identifie);
				//alert(identifie + "," + values.result.data.identifie);
				if(values.result.data.identifie == identifie && !is_pic_clean) {


					//提示文字变为预览图片
					$("#img-alt-title").html("预览图片");
				
					$("#upload-img-area").hide();//隐藏上传区域
					//显示图片区域
					$("#show-img-area").show();	
					
					$("#upload-img").attr({"src": values.result.data.imgUrl});
					
					/*
					//创建一个Image对象，实现图片的预下载
					var img = new Image();
					img.src = values.result.data.imgUrl;
					
					// 如果图片已经存在于浏览器缓存，直接显示
					 if(img.complete) {
						 
						 $("#upload-img").attr({"src": img.src});						 
						 $("#add-pub-btn"+kind).show();
						 $("#add-pub-loading"+kind).css("display", "none");//隐藏loading
							
						 return;
					 }
					 
					//图片下载完毕时直接显示
					 img.onload = function() {
						 
						 $("#upload-img").attr({"src": img.src});
						 $("#add-pub-btn"+kind).show();
						 $("#add-pub-loading"+kind).css("display", "none");//隐藏loading
						 img.onload = null;
					 }
					*/
					uploadImgSucess = true;
					
				}
			} else {
				
				//提示文字重新变为添加图片
				$("#img-alt-title").html("添加图片");
				
				$(".imgRule").show();//支持格式文字提示显示
				
				$("#upload-img-area").show();//显示上传区域
				//隐藏显示图片区域
				$("#show-img-area").hide();
				uploadImgSucess = false;
				
				//若图片超过5M，停留在添加图片窗口，并提示文字：“您选择的图片太大啦，请重新上传。						
				//显示文字“上传失败，请重新上传。
				
				var tempError = values.result.message;
				
				var errbox = "#write-error-box"+kind+" .write-error-desc";
				
				$(errbox).html(tempError)
						  .show();
				
				$("#add-pub-btn"+kind).show();
				$("#add-pub-loading"+kind).css("display", "none");//隐藏loading
			}
			
			$("#add-pub-btn"+kind).show();
			 $("#add-pub-loading"+kind).css("display", "none");//隐藏loading	
			 
			return false;
			
		}
		//图片重新上传
		function repeatUploadImg() {
			
			$("#repeat-upload-btn").click(function(){
				
				$("#upload-img-area").show();//显示上传区域
				//隐藏显示图片区域
				$("#show-img-area").hide();
				//提示文字重新变为添加图片
				$("#img-alt-title").html("添加图片");
				$(".imgRule").show();//支持格式文字提示显示
				
				$("#upload-img").attr("src","");	//清空原图片
				
				$("#add-pub-btn2").addClass("add-pub-btn-valid")
								  .css("display", "inline-block")//按钮恢复原状
								
				$("#add-pub-loading2").hide();	//隐藏loading
				
				uploadImgSucess = false;
				is_pic_clean = false;
				$("#write-error-box"+kind+" .write-error-desc").html("")
																.hide();
			})
		}
		//发布图片
		function imgPublish() {
			
			ispublishing = true;
			
			//内容为空时，按钮无效
			var txtContent = $.trim($(txtInputNum[kind]).val());
			if(txtContent == "") return;
			
			//首先判断是否超出字数，闪烁提示
			var thisobj = $("#dialog-buttonpane"+kind+" .write-error");
			if(!chouti.flashErrorTip(thisobj)) return;	
			
			//显示loading,发布按钮隐藏
			$("#pub-btn"+kind).hide();
			$("#pub-loading"+kind).css("display", "inline-block");
			
			$(txtInputNum[kind]).attr("disabled", true)
								.css("background-color", "#ece9d8");//文本输入框无效
			
			var bad = 0;	//默认为不是黄色暴力图片
			
			var imgurl = $("#upload-img").attr("src");//图片url
			
			var submitUrl = "/link/create";
			
			if(isHtPub) {
				
				var dataStr = G.param({subjectId: classType, title: submitTxtContent, yellow : bad,imgUrl : imgurl, tabType: kind,topicId: topicId});
			} else {
				
				var dataStr = G.param({subjectId: classType, title: submitTxtContent, yellow : bad,imgUrl : imgurl, tabType: kind});
			}
			
			
			L.ajax({
				url : submitUrl,
				type:"POST",
				data:dataStr,
				success :  function(info){																		

							if(info.code == ResultCodeSuccess) {														
																
								//跳转至评论页面
								if(!isHtPub) {
									
									//页面上方自动提示“发布成功”
									$(".dialog").hide();
									$(txtInputNum[kind]).attr("disabled", false)
														.css("background-color", "#fff");//文本输入框有效
									$(txtInputNum[kind]).val("");
									
									$("#pub-btn"+kind).show();
									$("#pub-loading"+kind).css("display", "none");//隐藏loading
									
									L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功
									
									redirectCommentPage(info.data.linkId);	//发布成功后转向评论页面
									
									L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功
									
								} else {	//把该链接添加到话题中
									
									goHtPage();
								}
								
								
								
								
							} else {
																
									var errMsg = info.message;
									$("#write-error-box"+kind+" .write-error-desc").html(errMsg)
	  																				.show();
									$(txtInputNum[kind]).attr("disabled", false)
														.css("background-color", "#fff");//文本输入框有效							
									$("#pub-btn"+kind).show();
									$("#pub-loading"+kind).css("display", "none");//隐藏loading
									ispublishing = false;
									return false;
															
							}
							
					}
			});		
		}
		//资讯发布内容
		function zixunPublish() {
			
			ispublishing = true;
			
			//当内容为空时，按钮不可点击
			var txtContent = $.trim($("#txt-zixun-content").val());
			if(txtContent == "" && $("#pub-btn0").hasClass("new-pub-btn-unvalid")) return;
			
			//首先判断是否超出字数，闪烁提示
			var thisobj = $("#dialog-buttonpane"+kind+" .write-error");
			if(!chouti.flashErrorTip(thisobj)) return;	
			
			
			//显示loading,发布按钮隐藏
			$("#pub-btn"+kind).hide();
			$("#pub-loading"+kind).css("display", "inline-block");
			
			$(txtInputNum[kind]).attr("disabled", true)
								.css("background-color", "#ece9d8");//文本输入框无效
			
			var httpurl = $("#txt-zixun").val(); //http地址
			var title = $("#txt-zixun-content").val();//标题	
			var content = $("#txt-zhaiyao").val();	//摘要
			
			var submitUrl = "/link/create";
			
			//如果是话题发布
			if(isHtPub) {
				
				var dataStr = G.param({subjectId: classType, title: title, url: httpurl, content: content, tabType: kind,topicId: topicId});
				
			} else {
				
				var dataStr = G.param({subjectId: classType, title: title, url: httpurl, content: content, tabType: kind});
			}
			
			
			L.ajax({
				url : submitUrl,
				type:"POST",
				data:dataStr,
				
				success :  function(info){																		

							if(info.code == ResultCodeSuccess) {														
																
								if(!isHtPub) {
									//页面上方自动提示“发布成功”
									$(".dialog").hide();
									
									L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功
									
									//跳转至评论页面
									redirectCommentPage(info.data.linkId);	//发布成功后转向评论页面
									
								} else {	//把该链接添加到话题中
									
									goHtPage();
								}
								
								
								
							} else {
																
									var errMsg = info.message;
									$("#write-error-box"+kind+" .write-error-desc").html(errMsg)
	  																				.show();
									$(txtInputNum[kind]).attr("disabled", false)
														.css("background-color", "#fff");//文本输入框有效
									
									$("#pub-btn"+kind).show();
									$("#pub-loading"+kind).css("display", "none");//隐藏loading
									ispublishing = false;
									return;
															
							}
							
					}
			});		
		}
	
	//资讯中，点击添加按钮，zhua 取资讯中的标题
	function addLink(){
			
			//当内容为空时，按钮不可点击
			var txtContent = $.trim($(txtInputNum[kind]).val());
			if(txtContent == "") return;
			
			//显示loading,发布按钮隐藏,错误信息隐藏,文本输入框无效
			
			$("#add-pub-loading"+kind).css("display", "block");
			
			$("#add-pub-btn0").css("display", "none");
			
			$(txtInputNum[kind]).attr("disabled", "disabled")
								.css({"background-color": "#ece9d8", "border": "1px solid #CCDCEF"});//文本输入框无效
			
			$("#url").val($("#txt-zixun").val());	//隐藏url值
			
			//清空按钮点击无效
			//$("#clear-btn-link").unbind();
					
			
			var submitUrl = "/link/catch/title";
			
			L.ajax({
				url : submitUrl,
				type:"POST",
				data:G.param({url: submitTxtContent}),
				
				//超时处理方式
				error:function(xmlHttp, textStatus){
					
					textStatus = textStatus.toLowerCase();
					
					if (textStatus === "timeout" && !is_link_clean) {
						
						//文本输入框有效
						
						$(txtInputNum[kind]).attr("disabled",false).css({"background-color": "#fff","color": "#333"});
						
						$("#add-pub-btn0").css("display", "block");	//添加按钮区域显示
					
						$("#add-pub-loading"+kind).css("display", "none");	//隐藏loading
						
						L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[6]);	//请求超时,请稍候再试
						
						xmlHttp.abort();
						
						return;
					}
					
					return;
				},
				
				success :  function(info){																		

							if(info.code == ResultCodeSuccess && !is_link_clean) {
								
								$("#add-pub-loading"+kind).css("display", "none");//隐藏loading
								
								var titleobj = info.data.title;
								
								if(titleobj) {
									var titleContent = titleobj;	//标题内容
								} else {
									var titleContent = "";
								}
								
								var summaryobj = info.data.summary;
								
								if(summaryobj) {
									var summary = summaryobj;	//标题内容
								} else {
									var summary = "";
								}
								
								//var summary = info.data.summary;	//摘要
								
								$(txtInputNum[kind]).attr("disabled", true)//http文本输入框无效
													.css({"background-color": "#ece9d8","color": "#ccc", "border": "1px solid #CCDCEF"});
																
								$("#zixun-button-container").hide();//添加按钮区域隐藏
								
								$("#txt-zixun").css("width", "523px");	//http链接输入框宽度变长
								$("#txt-zixun-area").css("width", "530px");
								
								$("#zixun-big-area").show()			//显示出下半部分
								
								listenZixunPblicButton();//监听发布资讯中title输入框
								
								//if(titleContent)
								$("#txt-zixun-content").val(titleContent)	//标题内容
														.attr("disabled",false)
														.css({"background-color": "#fff"});							
								
								$("#txt-zhaiyao").val(summary)	//摘要内容
												.attr("disabled",false)
												.css({"background-color": "#fff"});
								//发布按钮有效
								$("#pub-btn0").addClass("new-pub-btn-valid")
		 			   			  				.removeClass("new-pub-btn-unvalid");
								
								//zhua 取资讯中的图片
								//requestZixunImg(submitTxtContent, info);															
								
							} else {
								
								//错误信息
								var errMsg = info.message;								
								
	  							//如果链接已经存在则跳转到其评论页面
								//自己发的链接已经存在，则提示错误不跳转(code=30008)，如果别人发的(code=30009)，则跳转到评论页面
								
								if(info.code == "30009") {
									
									L.showTopTips(L.TIPS_TYPE.success, info.message);//提示该链接已经存在
									
									window.setTimeout(function(){
										
										redirectCommentPage(info.data.linkId);	//发布成功后转向评论页面
										
									},800)
									
									//return false;
								}
								//文本输入框有效
								
								$(txtInputNum[kind]).attr("disabled",false).css({"background-color": "#fff","color": "#333"});
								
								$("#add-pub-btn0").css("display", "block");	//添加按钮区域显示
							
								$("#add-pub-loading"+kind).css("display", "none");	//隐藏loading
								
								$("#write-error-box0 .write-error-desc").show().html(errMsg);
								
								//清空按钮恢复点击有效
								//$("#clear-btn-link").bind("click", clearbtnLink);
								
								return;
															
							}
							
					}
			});		
						
	}
	//所有发布成功后转向评论页面
	function redirectCommentPage(linkId) {

		var https = window.location.host;
		
		https = "http://" + https + "/link/"+linkId;
		
		//firefox 3.6浏览器不支持A标签的click事件，所以做如下处理
		
		var userAgentInfo = navigator.userAgent;
		
		//如果是firefox浏览器则直接跳转，其它的浏览器通过A标签点击来跳转
		if(userAgentInfo.indexOf("IE") >= 0) {
			
			var gotoLink = document.createElement('a');  
		    gotoLink.href = https;
		    document.body.appendChild(gotoLink);
		    gotoLink.click();		
			
		} else {
			window.location.href = https;
			
		}		
		
	}
	//选中资讯zhua 取出来的配图
	function selectZixunImg(defaultimg, imgCount) {
		
		$("#zixun-sel-img .inline-img").click(function(){
			imgurlSelect = "";
			//在当前图上出现选中图标
			var $selImg = $(this).children(".sel-icon");
			$selImg.show()
					.parent().siblings().children(".sel-icon").hide();
			
			//获取选中的图片的url
			imgurlSelect = $(this).find("img").attr("src");
			
		})
		if(imgCount > 1) {
			$("#zixun-sel-img .inline-img").eq(1).children(".sel-icon").show();
		} else {
			$("#zixun-sel-img .inline-img").eq(0).children(".sel-icon").show();
		}
		
		imgurlSelect = defaultimg;

	}
	
	//发布段子 yao yan内容
	function publish() {
		
		ispublishing = true;
		
		//内容为空时，按钮无效
		var txtContent = $.trim($(txtInputNum[kind]).val());
		
		if(txtContent == "") return;
		
		//首先判断是否超出字数，闪烁提示
		var thisobj = $("#dialog-buttonpane"+kind+" .write-error");
		if(!chouti.flashErrorTip(thisobj)) return;	
					
				
		//显示loading,发布按钮隐藏
		$("#pub-btn"+kind).hide();
		$("#pub-loading"+kind).css("display", "inline-block");
		
		$(txtInputNum[kind]).attr("disabled", true)
							.css("background-color", "#ece9d8");//文本输入框无效

		var submitUrl = "/link/create";
		
		if(isHtPub) {
			
			var dataStr = G.param({subjectId: classType, title: submitTxtContent,tabType: kind,topicId: topicId});
			
		} else {
			
			var dataStr = G.param({subjectId: classType, title: submitTxtContent,tabType: kind});
		}
		
		
		L.ajax({
			url : submitUrl,
			type: "POST",
			data: dataStr,
			success :  function(info){																		

						if(info.code == ResultCodeSuccess) {														
														
							if(!isHtPub) {
								
								//页面上方自动提示“发布成功”
								$(".dialog").hide();
								
								L.showTopTips(L.TIPS_TYPE.success, info.message);//提示发布成功
								
								//跳转至评论页面(待续)，如果是话题发布则不需要跳转,把该链接添加到话题中
								redirectCommentPage(info.data.linkId);	//发布成功后转向评论页面
								
							} else {	//把该链接添加到话题中
								
								goHtPage();
							}
							
							
							
						} else {
													
							//如果在3分钟内再次发布，则不可发布，则提示错误信息------您发布过于频繁，请2分钟后重新发布。
							//发布失败，请重试
								$("#write-error-box"+kind+" .write-error-desc").html(info.message)
	  																			.show();							
															
								$("#pub-btn"+kind).show();
								$("#pub-loading"+kind).css("display", "none");//隐藏loading
								
								$(txtInputNum[kind]).attr("disabled", false)
													.css("background-color", "#fff");//文本输入框有效
								ispublishing = false;
								return false;
														
						}
						
				}
		});		
	}
	//去除首尾的所有字格及换行及回车
	function clearBeforeNull(value) {		
		var tt1 = /^(\s+)|(\s+)$/;
		var str = value;
		//var str2 = tt.exec(str);
		str = str.replace(tt1,"");
		str = str.replace(tt1,"");
		return str;
		
	}
	//字符中间有多个空格时为1个空格
	function clearMidNull(value) {		
		var tt2 = /\s+/g;
		var str = value.replace(tt2," ");
		return str;
	}	
	
	//监听发布资讯中title输入框
	function listenZixunPblicButton(){
		
		$.input("txt-zixun-content", inputStateZixunContent);
		
	}
//监听输入框内容变化情况，以便做出响应
	
	$.extend({
		
		input:function(objs, fun){	//参数obj,表示输入框的ID，参数fun 为函数名称
			
		var element = document.getElementById(objs);
		if(element != null) {
		if("\v"=="v") {	//IE
			
			element.attachEvent("onpropertychange",fun);
			
		}else{	//除去IE外其它的浏览器
			
			element.addEventListener("input",fun,false);
		}
		}
	 }
	})
	
	//监听输入框内容变化情况，以便做出响应
	//var valid = false;
	function listenButton(num){
		
			/*
			 * 根据选中的类别来初始化输入框事件
			 * 参数num含义，0,代表资讯，1,段子，2,谣言，3，图片，
			 * keyup事件，当用户输入内容时触发
			 * $.input当用户从别处复制，然后粘贴到输入框时触发事件,参数1表示输入框ID，参数2表示所处于类别号
			 * */	
		
		//非IE浏览器先设置按钮无效
		//if("\v"!="v") {
			
			setButtonDisabled(num);
			$("#showLength"+num).html(sumWriteLength);
	//	}
			switch(num) {
				case 0:
					
					obj = "#txt-zixun";
					$.input("txt-zixun",inputState);
					
					break;
					
				case 1:
					
					obj = "#txt-duanzi";				
					$.input("txt-duanzi",inputState);					
					break;
					
				case 2:
			
					obj = "#txt-img";
					$.input("txt-img",inputState);
					break;
					
			}
			
		}
	//-----------
	//资讯title当输入框输入内容时，导出按钮由无效变成有效
	function inputStateZixunContent(){
		
		var num = kind;
		var duanzi = $("#txt-zixun-content").val();
		//alert(duanzi);
		if($.trim(duanzi) == ""){					//内容为空按钮无效
			setButtonDisabled(num);
			//alert(888);
			$("#showLength"+num).html(sumWriteLength);
			return;
		}else{	//内容不为空按钮有效	
			
			setButtonAbled(num);
			//alert(123);
			//duanzi = checkCharCodeAt(duanzi, "#txt-zixun-content");//把全角转换成半角						
					
			countDuanziLength(duanzi, num);		//计算title框输入字符的长度
				
			
			
		}
	}
	
	
	//---------
		//当输入框输入内容时，导出按钮由无效变成有效
		function inputState(){
			
			var num = kind;
			
			var duanzi = $(obj).val();
						
			if($.trim(duanzi) == ""){					//内容为空按钮无效
				
				setButtonDisabled(num);
				$("#showLength"+num).html(sumWriteLength);
				return;
				
			}else{	//内容不为空按钮有效	
				//alert(num);
				setButtonAbled(num);
				//输入完url后发布按钮还是无效的
				/*
				if(obj == "#txt-zixun" && $.trim($("#txt-zixun-content").val()) == "") {
					
					$("#pub-btn0").addClass("new-pub-btn-unvalid")
	   								.removeClass("new-pub-btn-valid");
				}
				*/
				//duanzi = checkCharCodeAt(duanzi, obj);//把全角转换成半角
				//$(txtInputNum[num]).val(duanzi);
				switch(num) {
					case 0:
						countZixunLength(duanzi, num);		//计算url文本框输入字符的长度
						break;
					case 1:
						countDuanziLength(duanzi, num);		//计算输入字符的长度
						break;
					case 2:
						countDuanziLength(duanzi, num);		//计算输入字符的长度
						break;
					case 3:
						countDuanziLength(duanzi, num);		//计算输入字符的长度
						break;
				}
				
			}
		}
		//把全角转换成半角,参数1表示内容，参数2表示文本输入框ID
		function  checkCharCodeAt(str, objs){
			
			str = str.split("");
			
			var TotalStr = "";

			for(var i=0;i <str.length;i++){
				
				if(str[i].charCodeAt(0) > 0xff00) {//表示该字符为全角
					var chara = String.fromCharCode(str[i].charCodeAt(0) - 65248);//转化成半角
					TotalStr += chara;
				} else {
					TotalStr += str[i];
				}
				
			}
			//$(objs).val(TotalStr);
			return TotalStr;
			
			
			
		}
		/*计算资讯url输入字符的长度
		 * 参数1表示输入的内容，参数2表示所处类别号
		 * */
		function countZixunLength(str, n) {			
			
			var str = clearBeforeNull(str);	//清除头尾空格
			
			str = clearMidNull(str);		//字符中间有多个空格时为1个空格
			//计算长度
			var len = 0;
	        for ( var i = 0; i < str.length; i++) {
	                var c = str.charCodeAt(i);
	                //单字节加1   
	                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
	                        len++;
	                } else {
	                        len += 2;
	                }
	        }
	        var result = parseInt(len /2 );
	        var mod = len%2;
	        if (mod != 0) {
	                result+=1;
	        }
			
			submitTxtContent = str;	//最后把滤过的输入内容赋值给全局变量,最好付给个文本控件
			//alert(submitTxtContent);
			var haveLength = sumZixunLength - result;
			//$("#showLength"+n).html(haveLength);
			
			//显示超出字数   错误提示
			if(haveLength < 0) {
				$("#write-error-box0 .write-error-desc").html("您输入的链接过长，请重新输入")
				  					  					.show();
				//alert(123);
				
			} else {
				$("#write-error-box0 .write-error-desc").hide();
			}
								
		}
		/*计算段子输入字符的长度
		 * 参数1表示输入的内容，参数2表示所处类别号
		 * */
		function countDuanziLength(str, n) {
			
			var str = clearBeforeNull(str);	//清除头尾空格
			str = clearMidNull(str);		//字符中间有多个空格时为1个空格
			//ret = str.replace(/[^x00-xff]/g,"a").length;	//一个字符为一个字，暂时定，以后改动
			
			//计算长度
			var len = 0;
	        for ( var i = 0; i < str.length; i++) {
	                var c = str.charCodeAt(i);
	                //单字节加1   
	                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
	                        len++;
	                } else {
	                        len += 2;
	                }
	        }
	        var result = parseInt(len /2 );
	        var mod = len%2;
	        if (mod != 0) {
	                result+=1;
	        }
	        
			submitTxtContent = str;	//最后把滤过的输入内容赋值给全局变量,最好付给个文本控件
			
			var haveLength = sumWriteLength - result;
			//alert(haveLength);
			$("#showLength"+n).html(haveLength);
			
			//显示超出字数   错误提示
			if(haveLength < 0) {
				
				$("#moreLength"+n).html(-haveLength);	//超出个数
				$("#dialog-buttonpane"+kind+" .write-error").show();
				
				$("#showLength"+n).html(0);	//还可以输入显示为0个
				$("#dialog-buttonpane"+kind+" .write-length").hide();
				
			} else {
				
				$("#dialog-buttonpane"+kind+" .write-error").hide();
				$("#dialog-buttonpane"+kind+" .write-length").show();
				
			}
								
		}
		//内容不为空按钮有效
		function setButtonAbled(n) {
			
			//发布按钮
			//alert(n);
			$("#pub-btn"+n).addClass("new-pub-btn-valid")
             			   .removeClass("new-pub-btn-unvalid");
			
			if($.trim($("#txt-zixun-content").val()) == "") {
				
				$("#pub-btn0").addClass("new-pub-btn-unvalid")
	 			   			  .removeClass("new-pub-btn-valid");
			}
			
			//资讯中的添加按钮
			if(kind == 0) {
				$("#add-pub-btn"+n).addClass("pub-btn-valid")
			   				   		.removeClass("pub-btn-unvalid");
			}
			
		}
		//内容为空按钮无效
		function setButtonDisabled(n) {
			
			//发布按钮
			
			$("#pub-btn"+n).addClass("new-pub-btn-unvalid")
			 			   .removeClass("new-pub-btn-valid");
			
			if($.trim($("#txt-zixun-content").val()) != "") {
				
				$("#pub-btn0").addClass("new-pub-btn-valid")
	 			   			  .removeClass("new-pub-btn-unvalid");
			}
			
			//资讯中的添加按钮
			if(kind == 0) {
				$("#add-pub-btn"+n).addClass("pub-btn-unvalid")
			   						.removeClass("pub-btn-valid");
			}
		}
		
		//关闭发布框
		function closeDialog() {
			
			$("#dialog-btn-close").click(function(){
				
				//隐藏发布框
				$("#digg-dialog-publish").hide();
				
				$("#mask").hide()
						.remove();
				
				
				//显示聊天室
				$("#chatIframe").css({"height": "475px","width":"300px"});
				
				is_pic_clean = true;
				is_link_clean = true;
				ispublishing = false;
				
				/*
				$("#mask").fadeOut("500",function(){
					//移除meng板
					$("#mask").remove();
				});
				
				*/
				
			})
		}
		//点击弹出框关闭按钮后，所有输入框清空及初始化
		function clearAllTextInput() {
			
			//段子
			$("#txt-duanzi").val("")
							.attr("disabled",false)
							.css("background-color", "#fff");
			
			$("#lab-duanzi").show();
			
			//资讯区域清空及初始化
			$("#txt-zixun").val("")
							.attr("disabled",false)
							.css({"background-color": "#fff", "color": "#333"});
			
			$("#txt-zixun-content").val("")
									.attr("disabled",true)
									.css("background-color", "#ece9d8");
						
			$("#txt-zhaiyao").val("")
							 .attr("disabled",true)
							.css("background-color", "#ece9d8");
			
			$("#zixun-button-container").show();//添加按钮区域隐藏
			
			
			$("#add-pub-btn0").show()
							.removeClass("pub-btn-valid")
							.addClass("pub-btn-unvalid");
			
			$("#pub-btn0, #pub-btn1, #pub-btn2, #pub-btn3").show()
															.removeClass("new-pub-btn-valid")
															.addClass("new-pub-btn-unvalid");
			
			$("#add-pub-loading0").hide();
			
			$("#txt-zixun").css("width", "420px");	//链接输入框宽度变长
			
			$("#txt-zixun-area").css("width", "426px");	//链接输入框宽度变长
			
			$("#lab-zixun").show();
			
			
			//图片
			$("#txt-img").val("")
						 .attr("disabled",false)
						 .css("background-color", "#fff");
			
			$("#lab-img").show();
			
			$("#upload-img-area").show();
			$("#upload-img-area .imgRule").show();
			
			
			$("#show-img-area").hide();
			
			$("#show-img-area #upload-img").attr("src", "");
			
			$("#repeat-upload-btn").click();	//触发重新上传点击事件
			$("#add-pub-loading2").hide();
			
			//清空所有错误提示
			for(var i=0;i<4;i++) {
				
				$("#write-error-box"+i+" .write-error-desc").html("");
				$(".write-length #showLength"+i).html(sumWriteLength);
				
			}
			//$("#write-error-box01 .write-error-desc").html("");
			$(".write-error").hide();
			$(".write-length").show();
			//变量
			sumWriteLength = 150;	//段子和yan yan字总数
			sumZixunLength = 512;	//资讯中的字总数限制
			kind = 0;				//全局类别变量
			submitTxtContent = "";	//最后提交给服务器的过滤过的输入内容
			obj="";					//当前文本框的ID
			imgurlSelect = "";		//选中的图片的url
			uploadImgSucess = false;//上传图片成功与否
			is_pic_clean = true;
			is_link_clean = true;
			ispublishing = false;
			
		}
		
		
		//回到话题当前页中
		function goHtPage(id, links) {
			
			L.showTopTips(L.TIPS_TYPE.success, "发布成功");	//提示话题发布成功	
			
			$(".dialog").hide();
			$(txtInputNum[kind]).attr("disabled", false)
								.css("background-color", "#fff");//文本输入框有效
			$(txtInputNum[kind]).val("");
			
			$("#pub-btn"+kind).show();
			$("#pub-loading"+kind).css("display", "none");//隐藏loading
			
			$("#mask").hide()
					  .remove();
			
		}
		
	
	//对外接口,公共对象调用
    NS_publish_dialog = {
		init: init,
		clearAllTextInput: clearAllTextInput
		
	};
})(jQuery);