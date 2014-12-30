(function( $, undefined ){	  
		
		var G = $.gozap,
		L = G.labi,
		i18n = L.i18n;
		var ResultCodeSuccess = L.RESULT_CODE.success,
			pageIndex = 0,timePool = null, htimePool = null, HuaTiUrl = "";
		
		var page = 1, pageSize = 25, totalCount = 0, huatiId = 0, shareWValue = null, isStory = true;
		
		var $pare = $(".ds-R .share-site-to .share-icon");
		
	function init() {	
				
		chouti.Init();
		
		shareweibo();	//分享操作
		
		huatiId = $("#huatiId").val();
		
		isStory = $("#showStoryBtn").val();
		
		//点击最热tab
		$("#storyB").click(function(){
						
			$(this).addClass("active")
					.siblings(".tb").removeClass("active");
			page = 1;		
			getHTInfo(huatiId, "hot", page);
						
		})
		
		//当故事轴中有内容时，则先显示故事轴，如果没有内容，则显示最热
		if(isStory == "true") {
			
			getHTInfo(huatiId, "story");
			
		} else {
			
			$("#storyB").click();
		}
		
		
		attenHt();	//关注话题
		
		CancelAttenHt(); //取消关注话题
		
		publishHt();	//发布话题
		
		//点击故事轴tab
		$("#storyA").click(function(){
						
			$(this).addClass("active")
					.siblings(".tb").removeClass("active");
			page = 1;
			
			getHTInfo(huatiId, "story", page);
			
		})
				
		
		//点击最新tab
		$("#storyC").click(function(){
						
			$(this).addClass("active")
					.siblings(".tb").removeClass("active");
			page = 1;
			getHTInfo(huatiId, "news", page);
			
		})
		
	}
	
	//发布到话题
	//分二步，第1步是发布，第二步是添加到该话题中
	
	function publishHt() {
			
		$("#htPubBtn").click(function(){
					
			chouti.pubNews("huati");	//弹出发布框			
			
		})
		
	}
	
	
	//关注话题
	function attenHt() {
		
		$(".att").unbind().click(function(){
			
			var topicId = $(this).attr("lang");
			
			var $this = $(this);
			
			var submitUrl = "/topic/attention/add";
			
			L.ajax({
				url : submitUrl,
				data :{id:topicId},
				success :  function(info){
					
					var code = info.code;
					
					if(code == "9999") {
						
						$this.addClass("attend")
							 .removeClass("att");
						
						CancelAttenHt();	
						
					} else {
						
						if(code == "60001") {	//表示未登录
							
							chouti.showLoginBox();
						}
					}
				}
			})
			
			
		})
		
	}
	
	//取消关注话题
	function CancelAttenHt() {
		
		$(".attend").unbind().click(function(){
			
			var topicId = $(this).attr("lang");
			
			var $this = $(this);
			
			var submitUrl = "/topic/attention/del";
			
			L.ajax({
				url : submitUrl,
				data :{id:topicId},
				success :  function(info){
					
					if(info.code == "9999") {
						
						$this.addClass("att")
							 .removeClass("attend");				
						
						attenHt();
					}
				}
			})
			
			
		})
		
	}
	
	//返回微博分享的各参数值
	function getShareValue() {
		
// siteId 是按照分享的微博的顺序来的，从左到右依次为1，2，3，4，5
			
		var $parNode = $(".ds-R .share-site-to");
		
		var title = $parNode.attr("share-title");
		var linksId = $parNode.attr("share-linkid");				
		var url = window.location.href;		
		var pic = $parNode.attr("share-pic");
		var summary =  $parNode.attr("share-summary");
		var subject =  $parNode.attr("share-subject");
		
		title = "【话题："+title+"】" + summary + "（分享自 @买买君热榜）";
		
		shareWValue = {title:title, linksId:linksId, url:url, pic:pic, summary:summary ,subject:subject};
		
	}
	
	//话题分享到各微博
	function shareweibo(){
		
		
		$pare.find(".icon-sina").die().live("click",function(){
			
			getShareValue();
			
			chouti.shareToSina(shareWValue.title, shareWValue.url, shareWValue.pic);
						
			//计录分享次数			
			chouti.countNumShare(shareWValue.linksId, 1, 2);
			
		})
		
		//豆ban分享
		
		$pare.find(".icon-douban").die().live("click",function(){
			
			getShareValue();
			
			chouti.shareToDouban(shareWValue.title, shareWValue.url, shareWValue.pic);
			
			//计录分享次数			
			chouti.countNumShare(shareWValue.linksId, 2, 2);

		})
	
	//分享到QQ空间
		
			$pare.find(".icon-qqzone").die().live("click",function(){
				
				getShareValue();
				
				chouti.shareToqqzone(shareWValue.title, shareWValue.url, shareWValue.pic, shareWValue.summary);
				
				//计录分享次数			
				chouti.countNumShare(shareWValue.linksId, 3, 2);					
					
		})
				
				
	//分享到腾讯微博
		
	$pare.find(".icon-tenxun").die().live("click",function(){
		
		getShareValue();
		
		chouti.shareToTenxun(shareWValue.title, shareWValue.url, shareWValue.pic);
		
		//计录分享次数			
		chouti.countNumShare(shareWValue.linksId, 4, 2);
		
	})
						
		//分享到人人网
		
			$pare.find(".icon-renren").die().live("click",function(){
				
				getShareValue();
				
				chouti.shareToRenren(shareWValue.title, shareWValue.url, shareWValue.pic, shareWValue.summary);
				
				//计录分享次数			
				chouti.countNumShare(shareWValue.linksId, 5, 2);
					
		})
			
		//分享到邮件
		
			$pare.find(".icon-mail").die().live("click",function(){
				
				getShareValue();
				
				chouti.shareToMail(shareWValue.title, shareWValue.url, $(this));
				
				//计录分享次数			
				chouti.countNumShare(shareWValue.linksId, 6, 2);
					
		})
	}
	//加载故事轴等列表
	
	function getHTInfo(huatiId, lei, pages) {
		
		//$("#load_hotitems").css({"display": "inline"});
		
		var loadStr = "<div id='load_hotitems' style='margin-left: 220px; display: inline;' class='loading-ico'>加载中，请稍候...</div>";
		
		$("#content-list").html(loadStr);		
		
		$("#page-area").html("");	//清空翻页样式
		
		HuaTiUrl = "/topic/"+lei+"/show";
				
		L.ajax({
			url : HuaTiUrl,
			type:"POST",
			data:{id:huatiId,page:pages},
			success :  function(info){	
					
					var code = info.code;
					
					if(code == "9999") {
						
						var datas = info.data;
						
						//如果没有数据，则不显示
						if(datas.items <= 0 ) {
							
							//$("#storyA").hide();
							$("#load_hotitems").hide();
							return;
						}
						
						ajaxLoadItems(datas, lei, pages);
						
						//切换故事轴，最新，最热TAB标签时，其中的界面宽度发生变化
						switch(lei){
							case "story":
								$(".comment-box").css("width", "571px");
								$(".content-list .item").css("margin-left", "15px");
								$(".content-list").css("padding-top", "20px");
								$(".txt-huifu-top").css("width", "484px");
								break;
							default:
								$(".comment-box").css("width", "589px");
								$(".content-list .item").css({"margin-left": "9px","padding-top": "11px"});
								$(".content-list").css("padding-top", "9px");
								$(".txt-huifu-top").css("width", "510px");
						}
					}					
					else {
							
							L.showTopTips(L.TIPS_TYPE.error, "加载失败，请稍候再试!");//提示失败信息
							$("#load_hotitems").hide();
							return;
							
					}
					
				}
		})
		
		
	}
	//显示列表内容
	function ajaxLoadItems(infos, lei, page) {
			
		var listInfo = infos.list, htmlStr = "", htmlStr2 = "", k = 0, isTop = false;
		
		var	currentTime = infos.currentTime;
		
		//没有值时
		if(!listInfo) {
			
			$("#load_hotitems").hide();
			return;
		}
		
		//如果第1条置顶则置顶
		var firstInfo = listInfo[0];
		
		isTop = firstInfo.isTopicTopLinks;
		
		if(isTop) {
			
			k=1;
			htmlStr = appendHtList(listInfo, 0,currentTime, "new", isTop);
		}
		//------------------------------------------------
		//全部字符串
		
		htmlStr = htmlStr + appendHtList(listInfo, k, currentTime, lei, false);
		
		$("#content-list").html(htmlStr);
		
		//最新 最热 有翻页
		if(lei != "story") {
			
			totalCount = infos.items;
			
			//翻页按钮样式生成
			pageShow(page, pageSize, totalCount, "id="+huatiId+"&page=", HuaTiUrl, 10, "page-area");
			
			//翻页事件
			bindPage(lei);
		}
		//隐藏loading
		//$("#load_hotitems").hide();
		
		//chouti.lazyLoadImg("#content-list .news-pic img");	//图片延时加载
		
		chouti.vote('');	//最热推荐操作
		chouti.cancelVote();	//取消推荐
		chouti.addCollect();	//收藏操作
		chouti.removeCollect();	//收藏操作
		
		chouti.shareweibo('');	//分享操作
		
		chouti.playVido();	//展开视频
		chouti.initImgClickEvent();
		
		//显示title
		$("a.digg-a").hover(function(){
		
			$(this).attr("title", "推荐");
		
		},function(){
		
			$(this).attr("title", "");
		
		})
		
		//取消推荐按钮显示title
						$("a.isVoted").hover(function(){
						
							$(this).attr("title", "取消推荐");
						
						},function(){
						
							$(this).attr("title", "");
						
						})
		
		//显示title
		$("a.discus-a").hover(function(){
		
			$(this).attr("title", "评论");
		
		},function(){
		
			$(this).attr("title", "");
		
		})						
		
		//清空时间轮循
		chouti.clearTimeInterval();
		oldTime = "";
		
		//发布时间每一分钟变化一次
		//故事轴
		if(lei == "story") {
			chouti.HttimeChange();
		} else {
			chouti.timeChange();
		}
		//初始化评论页面
		NS_links_comment_top.init("huati");
	}
	
	//显示故事轴列表
	//参数1表示列表对象，参数2表示循环起始变量，参数3表示当前时间，参数4表示当前是故事轴还是最新最热，参数5表示是否置顶 
	
	function appendHtList(listInfo, k, currentTime, lei, isTop) {
		
		var htmlStr = "";
		
		if(isTop) {
			
			var Count = 1;
			
		} else {
			var Count = listInfo.length;
		}
		
		for(var i=k;i<Count;i++) {
			
			var info = listInfo[i];
			
			var	createtime = info.createtime,
				topicStoryEditTime = info.topicStoryEditTime,	//修改后的时间chuo
				lastEidtStoryTime = info.lastEidtStoryTime,
				url = info.url,
				id = info.id,
				nick = info.nick,
				imgUrl = info.imgUrl,
				subject = info.subject,
				subjectId = info.subjectId,
				domain = info.domain,
				subjectUrl = info.subjectUrl,
				sourceType = info.sourceType,
				sourceAppUrl = info.sourceAppUrl,
				content = info.content,
				originalImgUrl = info.originalImgUrl,
				title = info.title,
				likedStatus = info.likedStatus,
				ups = info.ups,
				jid = info.jid,
				selfStatus = info.selfStatus,
				nickImgUrl = info.nickImgUrl,
				commentsUrl = info.commentsUrl,
				isLocalSite = info.isLocalSite,
				destJid = $("#userJid").val(),
				lastOperateTime = info.lastOperateTime,
				lastOperate = info.lastOperate,
				createTime = info.createTime,
				hasFlash = info.hasFlash,
				flashUrl = info.flashUrl,
				commentsCount  = info.commentsCount;
							
			//只有故事轴前面需要显示时间轴，最新最热不显示
			
			if(lei == "story") {
				
				//如果该字段不为空，则该字段变为创建时间
				if(topicStoryEditTime != undefined) {
					
					createtime = topicStoryEditTime;				
				}
				
				//时间轴修改时间后，时间提示变化
				if(lastEidtStoryTime != undefined) {
					
					lastOperateTime = lastEidtStoryTime;				
				}
				
				//原始图片
				if(originalImgUrl == undefined) {
					
					originalImgUrl = "";				
				}
				
			htmlStr += "<div class='topic-c-box'>";
				htmlStr += "<div class='time-p'><span class='hati-ico clock'></span><span class='pb'><i>"+lastOperateTime+"</i><span class='hati-ico arrow'></span></span></div>";
				htmlStr += "<b class='hati-ico topic-yuan'></b>";
				htmlStr += "<div class='detail-c'>";
			}
					htmlStr += "<div class='item'>";
					
						htmlStr += "<div class='timeIntoPool'>"+createtime+","+currentTime+"</div>";
						
						if(imgUrl != undefined) {
												      						
							htmlStr += "<div class='news-pic'><img lang='"+id+"' original='"+imgUrl+"' src='"+imgUrl+"' alt='买买君热榜' /></div>";
						
						}
						htmlStr += "<div class='news-content' id='newsContent"+id+"'>";
							htmlStr += "<div class='part1'>";
								
								
								htmlStr += "<a href='"+url+"' class='show-content color-chag' target='_blank' onmousedown='linksClickStat("+id+");'>";
																	
								//如果是置顶前面加上该两字
								if(isTop) {
									
									htmlStr += "<span class='kind-name' style='color:#cc3300'>【置顶】</span>";
								}
								
											if (subjectId == 2 && subject == '段子' && !isTop){
												htmlStr += "<span class='kind-name'>【段子】</span>";
											}
											
											if (subjectId == 3 && subject == '谣言' && !isTop){
												htmlStr += "<span class='kind-name'>【谣言】</span>";
											}
											
											
											
											htmlStr += title;
																					
											htmlStr += "</a>";
										
										if(domain != undefined) {
											htmlStr += "<span class='content-source'>"+domain+"</span>";
										}
										
											if (subjectId != 3 && subjectId != 2){
												htmlStr += "<a href='"+subjectUrl+"' class='n2' target='_blank'><span class='content-kind'>"+subject+"</span></a>";
											}
										
										
										//来源手机客户端
										if (sourceType == '1'){
											
											htmlStr += "<span class='s-source'>来自<a href='/download/model/iphone' target='_blank' class='s-phone'>iPhone</a></span>";
										}
										if (sourceType == '2'){
											
											htmlStr += "<span class='s-source'>来自<a href='"+sourceAppUrl+"' target='_blank' class='s-phone'>Android</a></span>";
										}
										if (sourceType == '3'){
		
											htmlStr += "<span class='s-source'>来自<a href='/download/model/wphone' target='_blank' class='s-phone'>WPhone</a></span>";
										}
										if (sourceType == '5'){
											
											htmlStr += "<span class='s-source'>来自<a href='/download/model/iphone' target='_blank' class='s-phone'>iPad</a></span>";
										}
										
										htmlStr += "</div>";
									//显示摘要
									if(content != undefined) {
										htmlStr += "<div class='area-summary'>";																 
											htmlStr += "<span class='summary'>"+content+"</span>";									
										htmlStr += "</div>";
									}
									
									htmlStr += "<div class='part2' share-pic='"+originalImgUrl+"' share-title='"+title+"' share-summary='"+content+"' share-linkid='"+id+"'>";
										
										if(hasFlash) {
											
											htmlStr += "<a href='javascript:;' flashUrl='"+flashUrl+"' class='vidio-a' style='margin-right:10px;' title='展开视频' lang='"+id+"' id='vidio-a-"+id+"'><span class='vidio-icon icon-digg vidio-s'></span></a>";
										}
										if (likedStatus){
																		
											htmlStr += "<a href='javascript:;' class='isVoted'  title='取消推荐'><span class='hand-icon icon-digg vote-actived'></span><b class='green'>"+ups+"</b><i style='display:none'>"+id+"</i></a>";
										}
										if (!likedStatus){
											htmlStr += "<a href='javascript:;' class='digg-a' title='推荐'><span class='hand-icon icon-digg'></span><b class='bb'>"+ups+"</b><i style='display:none'>"+id+"</i></a>";
										}
										
										if (isLocalSite){
											htmlStr += "<a href='javascript:;' class='discus-a' id='discus-a-"+id+"' lang='"+id+"' onmousedown='linksClickStat("+id+");'><span class='hand-icon icon-discus'></span><b>"+commentsCount+"</b></a>";
										}
										if (!isLocalSite){
											htmlStr += "<a href='javascript:;' class='discus-a' id='discus-a-"+id+"' lang='"+id+"'><span class='hand-icon icon-discus'></span><b>"+commentsCount+"</b></a>";
										}
										
										if (selfStatus){
											htmlStr += "<a href='javascript:;' class='remove-col-a' id='collect-a-"+id+"' lang='"+id+"' title='移出私藏' destjid='"+destJid+"' jid='"+jid+"'><span class='hand-icon icon-collect collect-actived'></span><b>私藏</b></a>";
										}
										if (!selfStatus){
											htmlStr += "<a href='javascript:;' class='collect-a' id='collect-a-"+id+"' lang='"+id+"' title='加入私藏' destjid='"+destJid+"' jid='"+jid+"'><span class='hand-icon icon-collect'></span><b>私藏</b></a>";
										}
										
										if(destJid == jid){
										
											htmlStr += "<a href='/user/link/saved/1' class='user-a'><span><img src='"+nickImgUrl+"' /></span><b>"+nick+"</b></a>";
										}
										if(destJid != jid){
											
											htmlStr += "<a href='/user/"+jid+"/submitted/1' class='user-a'><span><img src='"+nickImgUrl+"' /></span><b>"+nick+"</b></a>";
										}
										//最新最热显示发布时间，故事轴不显示发布时间
										if(lei != "story") {						
											htmlStr += "<span class='left time-into'><a class='time-a' href='"+commentsUrl+"' target='_blank'><b>"+createTime+"</b></a><span class='operate'>发布</span></span>";								
										} else {
											htmlStr += "<span style='width:7px;'></span>";
										}
									htmlStr += "</div>";
									
									// 评论区域
									htmlStr += "<div class='comment-box-area' id='comment-box-area-"+id+"'>";
									htmlStr += "<div class='pinglun arrow' id='comt-arrow-"+id+"'></div>";
									htmlStr += "<a class='pinglun close-comt' title='关闭' href='javascript:;'  lang='"+id+"'></a>";
									htmlStr += "<div class='corner comment-box' id='comment-box-"+id+"'>";
										
									htmlStr += "<div class='loading-ico loading-ico-top' id='loading-comment-top-"+id+"' style='margin-left:200px;'>加载中，请稍候...</div>";
										htmlStr += "<div class='comment-box-top' id='comment-box-top-"+id+"'>";
											htmlStr += "<div class='tip-1'>最热评论(<span id='newestCount-"+id+"'>3</span>)</div>";
											htmlStr += "<div class='tip-2'><a href='"+commentsUrl+"' target='_blank'><em class='pinglun em1'></em><span>去评论页面</span></a></div>";													
										htmlStr += "</div>";
										
										//评论树形 
										htmlStr += "<ul class='filetree comment-list-top-2' id='comment-list-top-"+id+"'></ul>";
										
										
										
										//谣言类别显示相信还是置疑选项 
										if(subjectId == 3) {
										
											htmlStr += "<div class='yaoyan-sel-area yaoyan-sel-area-top' id='yaoyan-sel-area-"+id+"' style='display:block'>";
												htmlStr += "<input type='radio' name='isAssent-"+id+"' id='myBelive-"+id+"' lang='"+id+"' value='1' />";
												htmlStr += "<label for='myBelive-"+id+"' style='color:#339900'>相信</label>";		
												htmlStr += "<input type='radio' name='isAssent-"+id+"' id='myNoBelive-"+id+"' lang='"+id+"' value='0' />";
												htmlStr += "<label for='myNoBelive-"+id+"' style='color:#CC3300'>质疑</label>";
												htmlStr += "<em class='em-must-top'>对于谣言，要先表明立场，才能评论哦~~~</em>";
											htmlStr += "</div>";
										
										}
										//评论输入框和回复框
										htmlStr += "<div class='huifu-top-box' id='huifu-top-box-"+id+"'>";
											htmlStr += "<div class='box-l txt-input-area-div-top corner no-corner-bottom'>";						
												//针对谣言文本输入框无效

                                                htmlStr += "<div id='lab-comment-top-"+id+"' class='lab-comment-top'>回复  <span id='nick-"+id+"'></span>:</div>";
												
												if(subjectId == 3) {
													htmlStr += "<textarea lang='"+id+"' style='background-color:#ece9d8' maxlength='150' name='txt-huifu-top' id='txt-huifu-top-"+id+"' class='txt-huifu txt-huifu-top' disabled></textarea>";
												}
												if(subjectId != 3) {
													htmlStr += "<textarea lang='"+id+"' maxlength='150' name='txt-huifu-top' id='txt-huifu-top-"+id+"' class='txt-huifu txt-huifu-top'></textarea>";
												}
												
											htmlStr += "</div>";
											htmlStr += "<div class='box-r'>";
												htmlStr += "<a id='pub-btn-top-"+id+"' lang='"+id+"' href='javascript:;' class='pub-icons add-pub-btn add-pub-btn-unvalid'>评论</a>";
												htmlStr += "<a id='pub-loading-top-"+id+"' href='javascript:;' class='loading-ico loading-ico-top pub-loading-top'>发布中...</a>";
											htmlStr += "</div>";
										htmlStr += "</div>";
										htmlStr += "<div class='tip-3' id='hidden-comt-"+id+"'>";							
											htmlStr += "<a href='javascript:;' class='hiddenCom-Btn' lang='"+id+"'><em class='pinglun em2'></em><span>收起</span></a>";
										htmlStr += "</div>";
										htmlStr += "<div class='write-error-box-top'>";			
											htmlStr += "<div class='write-error-desc' id='write-error-desc-"+id+"'></div>";
										htmlStr += "</div>";
									htmlStr += "</div>";
									htmlStr += "<input type='hidden' id='hidsubjectid-"+id+"' value='"+subjectId+"' />";
									htmlStr += "</div>";
									
								htmlStr += "</div>";
								
							htmlStr += "</div>";
							
			if(lei == "story") {
				htmlStr += "</div>";
				htmlStr += "</div>";
			}
			
			}
		
		return htmlStr
	}
	
	/**
	 * 异步刷新，改版后的翻页功能
	 * 
	 * @param page 当前页
	 * @param pageSize 显示条数
	 * @param total 总条数
	 * @param param 参数,多个参数用&来间隔
	 * @param action 请求地址
	 * @param limitNum 页码显示限制
	 * @param divId 显示分页的div的id值
	 */
	function pageShow(page, pageSize, total, params, action, limitNum, divId) {
		
		if (action == "" || divId == "") {
			return;
		}
		var p = parseInt(page,10);
		var rows = parseInt(total,10);
		var pages = parseInt(pageSize,10);
		var limitPage = parseInt(limitNum, 10);
		if (limitPage == NaN) {
			limitPage = 10;
		}
		if (rows == NaN || rows <= pages) {
			return;
		}
		if (p == NaN) {
			p = 1;
		}
		if (pages == NaN) {
			pages = pageSize;
		}
		var htmlStr = "";
		htmlStr+=" <div id=\"dig_lcpage\">";
		
		var paramUrl = "";
		if (params != "") {
			paramUrl = "?" + params;
		}
		
		var loc = action;
		
		/*
		var loc = action.substr(0,action.lastIndexOf("/")+1);
		var lastSub = action.substr(action.lastIndexOf("/") + 1);
		var temp = parseInt(lastSub,10);
		if (temp == NaN) {
			loc = this.action + "/";
		}
		*/
		// 总页数 
		var tp = 1;
		
		//当前页
		var cp = p;
		
			tp = rows/pages;
			if (rows%pages != 0) {
				tp = tp + 1;
			}
			
			var elis = "<li><span class='ct_pageeli'>...</span></li>";
			if (tp < 1) {
				tp = 1;
			}
			
			if (cp >= tp) {
				cp = tp;
			}
			
			if (tp > 1) {
//			htmlStr+="<div id='ct_page'>");
			htmlStr+="<ul>";
			if (cp != 1) {
				htmlStr+="<li><a href='javascript:;' lang='"+(cp-1)+"' class='ct_page_edge'>上一页</a></li>";
			}
			if (tp<=limitPage) {
				for (var i=1;i<=tp;i++) {
					if (cp == i) {
						htmlStr+="<li><span class='ct_pagepw'>"+cp+"</span></li>";
					}
					else {
						htmlStr+="<li><a href='javascript:;' lang='"+i+"' class='ct_pagepa'>"+i+"</a></li>";
					}
				}
			}
			else if (tp > limitPage) {
				if (cp < 7) {
					for (var i = 1;i <= 10; i++) {
						if (cp == i) {
							htmlStr+="<li><span class='ct_pagepw'>"+cp+"</span></li>";
						}
						else {
							htmlStr+="<li><a href='javascript:;' lang='"+i+"' class='ct_pagepa'>"+i+"</a></li>";
						}
					}
				} else {
					htmlStr+="<li><a href='javascript:;' lang='1' class='ct_pagepa'>"+1+"</a></li>";
					htmlStr+=elis;
					
//					int edge = tp - cp;//想判断保证有limitPage个标签显示着
					var left = cp - 3;
					var right = cp + 4;
					if (right > tp) {
						right = tp;
					}
					
					for (var i = left; i < cp; i++) {
						htmlStr+="<li><a href='javascript:;' lang='"+i+"' class='ct_pagepa'>"+i+"</a></li>";
					}
					htmlStr+="<li><span class='ct_pagepw'>"+cp+"</span></li>";
					
					if (cp < tp) {
						var start = cp + 1;
	    				for (var i = start; i <= right; i++) {
	    					htmlStr+="<li><a href='javascript:;' lang='"+i+"' class='ct_pagepa'>"+i+"</a></li>";
	    				}
					}
				}
			}
			
			if (cp != tp && tp > limitPage) {
				htmlStr+="<li><a href='javascript:;' lang='"+(cp+1)+"' class='ct_page_edge'>下一页</a></li>";
			}
			//go to
			/*if (isGoto) {
				htmlStr+="<li><span class='ct_goto'>到 <input onkeydown ='validateInput(event)' class='ct_pagenumber' id='pagenumber' type='text'/> 页</span></li>";
				writeScrpt(out, loc, tp);
			}*/
			htmlStr+="</ul>";
//			htmlStr+="</div>");
			}
		   htmlStr+="</div>";
		   
		   var divObj = document.getElementById(divId);
		   divObj.innerHTML=htmlStr;
		  		   
	}
	
	
	//翻页按钮点击事件
	function bindPage(lei) {
		
		$("#page-area li a").click(function(){
			
			var cp = $(this).attr("lang");
			getHTInfo(huatiId, lei, cp);
		})
		
	}
	    		
	NS_HuaTi = {
		init: init
		
	};
})(jQuery);