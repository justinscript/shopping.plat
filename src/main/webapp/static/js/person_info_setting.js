
(function( $, undefined ){
	
	var G = $.gozap,
			L = G.labi,
			i18n = L.i18n,
			i18nregister = i18n.register;
			var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
				
	
	//提交表单
	function submitForm() {
		
		$("#person_info_save_btn").click(function(){				
				
			/*
				$("#person_info_save_btn").hide();//隐藏注册按钮
				$("#info_loading_ico").show();//显示loading
				window.setTimeout(function(){
						$("#person_info_save_btn").css("display","inline-block");
						$("#info_loading_ico").hide();
						$("#formModyInfo").submit();
						//return false;
				},500);
				
			*/	
			if(!regCheckRule.checkUSerNickRule()) {
				return;
			}
			
				//if(!userNickCorss) return;
				
				var jid = $("#hidJid").val();
				var nick = $("#nick").val();
				//var imgurl = $("#personImgUrl").attr("src");
				var sex = $(":radio:checked").val();
				var imgurl= $("#hidImgUrl").val();
				
				var proveName = $("#proveName option:selected").text();
				var cityName = $("#cityName option:selected").val();
				
				if(proveName == "-请选择-") {
					
					proveName = '';
					cityName = '';
				}
				var submitUrl = "/profile/update";
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({jid:jid, nick:nick, imgUrl:imgurl, sex:sex, proveName:proveName, cityName:cityName}),
					success :  function(info){
								if(info.code == ResultCodeSuccess) {
									L.showTopTips(L.TIPS_TYPE.success, info.message);
								} else {
									L.showTopTips(L.TIPS_TYPE.error, info.message);
									return;
								}
					}
				});				
				
		});
	}
	//关闭上传头像框
	function closeDialog() {
		
		$("#upload-dialog-btn-close").click(function(){

			chouti.Head_Pic_Cancel_info();
			
		})
	}
	

	/**
		init初始化函数		
	*/
	function init(regState) {
		
		regCheckRule.initTipsBind();//提示框对象初始化
		regCheckRule.userNickBlurTips();	//焦点到用户昵称输入框时
		
		regCheckRule.inputTextFocusorBlur();
		chouti.showUploadImgDialog();//上传头像
		closeDialog();//关闭上传头像框
		
		chouti.Init();
		submitForm();	
		
		//得到焦点
		$("#nick").keydown(function(event){
			
			if (event.keyCode == 13) {
				
				$("#person_info_save_btn").click();//提交表单
			}
		})	
		
		
	}
	
	//对外接口,公共对象调用
	NS_person_info_setting = {
		init: init
	}
})(jQuery);