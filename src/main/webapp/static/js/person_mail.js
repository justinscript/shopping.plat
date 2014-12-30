
(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nNotice = i18n.notice;
				
		var guid = "";
		var pageIndex = 1;
		var curtPageIndex = 1;
		var curtPageSizes = 0;
		var sumPages = 0;
		var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
    
	//复选框全部选中
	function selectAllNotice() {
			
		$("#mail-page .l_ljm :checkbox, .head .l_ljm :checkbox").click(function(){
			
			//当私信列表为空时,不触发事件
			if($("#mailBox :checkbox").length <= 0) {
				$(this).attr("checked",false);
				return;
			}
			
				if($(this).attr("checked"))	{										  
					$(".item :checkbox").attr("checked",true);
					
					$("#mail-page .l_ljm :checkbox").attr("checked", true);
					$(".head .l_ljm :checkbox").attr("checked", true);

				} else {
					$(".item :checkbox").attr("checked",false);
					
					$("#mail-page .l_ljm :checkbox").attr("checked", false);
					$(".head .l_ljm :checkbox").attr("checked", false);
				}

		})
		
	}
	
	//删除选中的所有私信
	function deleteMailGroup() {
		
		//删除多组
		$("#mail-page #delBtn2, .head #delBtn").click(function(){
			
			var strGuid = "",
				sum = 0;
			
			$("#mailBox :checkbox:checked").each(function(){
				var guid = $(this).val();
				strGuid += guid + ",";
				sum++;
			})
			//提示请先选择要删除私信
			if (sum == 0) {
				L.showTopTips(L.TIPS_TYPE.error, "请选择要删除的私信");
				return;
			}
			if(!confirm("您确定要删除这"+sum+"组私信吗？")) {
				return;
			}
			
			strGuid = strGuid.substring(0, strGuid.length-1);
						
			requestDel(strGuid);
			
		})
		
		//删除单组
		$(".delMail").click(function(){
			
			if(!confirm("您确定要删除该组私信吗？")) {
				return;
			}

			var groupId = $(this).attr("lang");
			requestDel(groupId);
		})
		
		//删除单条
		$(".delMailolny").click(function(){
			
			if(!confirm("您确定要删除该条私信吗？")) {
				return;
			}

			var id = $(this).attr("lang");
			
			var groupId = $("#groupId").val();
			
			requestDelOnly(id, groupId);
			
		})
		
	}
	
	//删除单条私信的请求
	function requestDelOnly(id, groupId){
		
		var submitUrl = "/letter/del.do";
		
		L.ajax({
			url : submitUrl,
			type:"POST",
			data:G.param({groupId: groupId,id:id}),
			success :  function(info){
				
				if(info.code == ResultCodeSuccess) {	//删除成功
					
					L.showTopTips(L.TIPS_TYPE.success,  info.message);
					
					$("#item"+id).remove();
					
				} else {
					L.showTopTips(L.TIPS_TYPE.error, info.message);
					return;
				}
			}
		})
	}
	
	//删除私信组的请求
	function requestDel(strGuid){
		
		var submitUrl = "/letter/del/group.do";
		
		L.ajax({
			url : submitUrl,
			type:"POST",
			data:G.param({groupIds: strGuid}),
			success :  function(info){
				
				if(info.code == ResultCodeSuccess) {	//删除成功
					
					L.showTopTips(L.TIPS_TYPE.success,  info.message);
					
					window.location.reload();
					
				} else {
					L.showTopTips(L.TIPS_TYPE.error, info.message);
					return;
				}
			}
		})
	}
	
	//设置私信为已读
	function setAllNoticeIsRead() {
		$(".head #readedBtn, #mail-page #readedBtn2").click(function(){
			
			var strGuid = "",
				sum = 0;
			$("#mailBox :checkbox:checked").each(function(){
				var guid = $(this).val();
				strGuid += guid + ",";
				sum++;
			})
			//提示请先选择私信
			if (sum == 0) {
				L.showTopTips(L.TIPS_TYPE.error,"请选择要标记为已读的私信");
				return;
			}
			strGuid = strGuid.substring(0, strGuid.length-1);
			
			var submitUrl = "/letter/read.do?"+G.param({groupIds: strGuid});
			
					L.ajax({
						url : submitUrl,
						type:"POST",
						success :  function(info){
							if(info.code == ResultCodeSuccess) {	//设置已读成功
								
								L.showTopTips(L.TIPS_TYPE.success,  info.message);
								
								$(":checkbox").attr("checked", false);
								
								window.location.reload();
								
							} else {
								L.showTopTips(L.TIPS_TYPE.error,  info.message);
								return;
							}
						}
			   })			 
		})
		
	}
	
	//进入私信详细页面后自动设置为已读
	function setReaded(groupId) {
		
		var submitUrl = "/letter/read.do";
		
		L.ajax({
			url : submitUrl,
			type:"POST",
			data:G.param({groupIds: groupId}),
			success :  function(info){
				if(info.code == ResultCodeSuccess) {	//设置已读成功
					
					
				} else {
					//L.showTopTips(L.TIPS_TYPE.error,  info.message);
					return;
				}
			}
		})			
	}

	//发送私信
	function sendMailContent(){
		
		$("#person_mail_btn").click(function(){
		
		var $this = $(this);
		
		var submitUrl = "/letter/add.do";
		var content = $.trim($("#mailContent").val());
		var otherJid = $this.attr("otherJid");
		
		var $obj = $("#mailContent");
		
		//首先判断是否为空，闪烁提示
		if(content == "") {
			
			chouti.shake($obj, "flash-sixin", 3);
			return;
		}
		
		$this.hide();
		$("#privateMailLoading").show();
		
		L.ajax({
			url : submitUrl,
			type:"POST",
			data:G.param({otherJid: otherJid, content:content}),
			success :  function(info){
				
				if(info.code == ResultCodeSuccess) {	//发送成功
					
					L.showTopTips(L.TIPS_TYPE.success,  "发送成功");
					
					$this.show();
					$("#privateMailLoading").hide();
					
					$("#mailContent").val("")
									.focus();
					
					appendMailInfo(info.data);
					
				} else {
					
					L.showTopTips(L.TIPS_TYPE.error, info.message);
					$this.show();
					$("#privateMailLoading").hide();
					
					return;
				}
			}
		})
		
		})
	}
	
	//发送成功后追加单条私信
	function appendMailInfo(datas) {
		
		var content = datas.content,
			id = datas.id,
			createDate = datas.createDate;
		
		var $sendBtn = $("#person_mail_btn");
		
		var destUserImgUrl = $sendBtn.attr("destUserImgUrl");
		var destUserJid = $sendBtn.attr("destUserJid");
		
		var str = "<div class='item'>" + 
			"<div style='margin-left:0' class='nr-r'>" + 		
			"<a target='_blank' href='/user/link/saved/1'><img width='48' height='48' class='imgs' src='"+destUserImgUrl+"'></a>" + 
			"<div class='nr-r-r'>" + 
				"<div class='r1'>" + 
					"<a target='_blank' class='nick' href='/user/link/saved/1'>我:</a>" + 
					"<span class='nr'>"+content+"</span>" + 
				"</div>" + 
				"<div class='r2'>" + 
					"<div class='sj'>"+createDate+"</div>" + 
					"<div class='caozuo'>" + 
						"<a lang='"+id+"' class='delMailolny' href='javascript:;'>删除</a>" + 
					"</div>" + 
				"</div>" + 
			"</div>"
			
			
			
		$("#mailBox .item:first").before(str);
	}
	
	function pingbi() {
		
		$("#pingbiBtn").unbind().click(function(){
			
			pingbiSelf(true);
		})
		
		$("#pingbiRemoveBtn").unbind().click(function(){
			
			pingbiSelf(false);
		})
		
	}
	//屏蔽或者取消请求
	function pingbiSelf(shield){
		
		var submitUrl = "/letter/shield.do";
		
		L.ajax({
			url : submitUrl,
			type:"POST",
			data:G.param({shield: shield}),
			success :  function(info){
				if(info.code == ResultCodeSuccess) {
					
					L.showTopTips(L.TIPS_TYPE.success,  info.message);
					
					//alert(pingbi);
					if(shield) {
						
						var str = "<a id='pingbiRemoveBtn' href='javascript:;'><span class='heimdan pingbie'></span>取消屏蔽</a>";
						
					} else {
						
						var str = "<a id='pingbiBtn' href='javascript:;'><span class='heimdan pingbie'></span>屏蔽发给我的私信</a>";
					}
					
					$("#pingbiBox").html(str);
					
					pingbi();
					
				} else {
					L.showTopTips(L.TIPS_TYPE.error,  info.message);
					return;
				}
			}
		})
		
	}
	function init(obj) {
		
		selectAllNotice(); //复选框全部选中私信
		deleteMailGroup(); //删除选中的组私信
		setAllNoticeIsRead();//设置私信全部为已读
		
		sendMailContent();
		
		//添加文本框的回车事件
		$("#mailContent").keydown(function(event){
			
			if(event.ctrlKey && event.keyCode == 13) {
					
				$("#person_mail_btn").click();
			}
		})
		
		chouti.lahei();	//拉黑
		
		chouti.laHeiRemove();	//解除拉黑
			
		pingbi();	//屏蔽功能
				
		$(".backSendTo").click(function(){
			
			$("#mailContent").focus()
							 .val("");
		})
		
		chouti.Init();	
														
		//阻止复选框冒泡事件	
		/*
		$(".message :checkbox, .message-readed :checkbox").click(function(event){
			event.stopPropagation();
			$("#mail-page .l_ljm :checkbox, .head .l_ljm :checkbox").attr("checked", false);//当单个复选框取消选中   全选复选框取消全选状态
			
			//当单个复选框全选中时，全选复选框也自动选中
			if($("#mailBox :checkbox:checked").length == $("#mailBox :checkbox").length)
				$("#mail-page .l_ljm :checkbox, .head .l_ljm :checkbox").attr("checked", true);
		})
		*/
		
	}
	
	//对外接口,公共对象调用
    NS_person_mail = {
    	
		init: init,
		
		setReaded:setReaded

	}
})(jQuery);