/** 瀛愰〉闈㈠繀椤诲疄鐜扮殑鏂规硶,瀵规墜鏈虹姸鎬佹敼鍙樼殑鐩戝惉鍑芥暟 */

function onStatusChange(imei, state){
}
/*
	*鍏憡妯″潡
	*NS_feedback(Object)锛氬閮ㄦ帴鍙ｏ紝鍏叡瀵硅薄璋冪敤
*/
(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n,
		i18nNotice = i18n.notice;
		var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999
				
		var pageIndex = 0;
		
	
	/**
		init鍒濆鍖栧嚱鏁�
		*鍙傛暟涓�ageIndex锛岃〃绀哄綋鍓嶉〉鐮�
		*sumCount锛岃〃绀烘�鐨勬潯鏁�
		*curtPageSize锛岃〃绀哄綋鍓嶉〉鏄剧ず鐨勬潯鏁�
	*/
	function init(obj) {

		//L.initModule("links_hotts");//娉ㄥ唽璇ュ叕鍛婃ā鍧�
		
		//pageIndex = obj.pageIndex;
		//var nextPage = obj.nextPage;	
		
		
		chouti.hidPublishWindow();	//隐藏“分享新发现”按钮
		chouti.Init();
		changeSetting();
	}
	
	//修改个人通知设置
	function changeSetting(){
		
		$(":radio").click(function(){
			
			var linksMsg = $(":radio[name='linksMsg']:checked").val();
			var commentsMsg = $(":radio[name='commentsMsg']:checked").val();
			var linksIntoHotMsg = $(":radio[name='linksIntoHotMsg']:checked").val();
			
			var destJid = $("#destJid").val();
			
			//alert(linksMsg+":"+commentsMsg+":"+linksIntoHotMsg+":"+destJid);
			var submitUrl = "/message/update";
			
			L.ajax({
				url : submitUrl,
				type:"POST",
				data:G.param({linksMsg:linksMsg, commentsMsg:commentsMsg, linksIntoHotMsg:linksIntoHotMsg, jid:destJid}),
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
		
	
	//瀵瑰鎺ュ彛,鍏叡瀵硅薄璋冪敤
	NS_person_notice_setting = {
		init: init
		//getNotice:getNotice
	}
})(jQuery);