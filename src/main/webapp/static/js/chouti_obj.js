(function($){

    var G = $.gozap, L = G.labi, i18n = L.i18n, i18nfeedback = i18n.feedback;
    var ResultCodeSuccess = L.RESULT_CODE.success;//成功代码9999	
    var timePool = null, oldTime = "", htimePool = null, qita = 1, jubaoTime1 = null;
    
    chouti = {
    
        Init: function(){
        
            NS_publish_dialog.init(); //初始化发布弹出框									
            chouti.showLoginDialog(); //弹出登录框
            chouti.showQuanZhang(); //显示勋章的大图
            chouti.addTopTips(); //生成顶部toast  tip提示框
            chouti.showSearchBox(); //搜索框触发事件
            chouti.playVido(); //展开视频
            chouti.initTopNews(); //最热榜
            chouti.initImgClickEvent();
            
            //页面中列表项中各链接加下划线(主要用于ie6)
            
            if ($.browser.msie && $.browser.version == '6.0') {
            
                $("a.discus-a b, a.user-a b, span.time-into a, a.collect-a b").hover(function(){
                
                    $(this).css({
                        "text-decoration": "underline",
                        "color": "#336699"
                    });
                    
                }, function(){
                
                    $(this).css({
                        "text-decoration": "none",
                        "color": "#99AECB"
                    });
                    
                })
                
                
                
                $("a.discus-a, a.user-a, a.collect-a").hover(function(){
                
                    $(this).children("b").css({
                        "text-decoration": "underline",
                        "color": "#336699"
                    });
                    
                }, function(){
                
                    $(this).children("b").css({
                        "text-decoration": "none",
                        "color": "#99AECB"
                    });
                    
                })
                /*
                 $("a.remove-col-a b").hover(function(){
                 $(this).css({"text-decoration": "underline", "color": "#336699"});
                 },function(){
                 $(this).css({"text-decoration": "none", "color": "#336699"});
                 })
                 $("a.remove-col-a").hover(function(){
                 $(this).children("b").css({"text-decoration": "underline", "color": "#336699"});
                 },function(){
                 $(this).children("b").css({"text-decoration": "none", "color": "#336699"});
                 })
                 */
            }
            //显示title
            $("a.digg-a").hover(function(){
            
                $(this).attr("title", "推荐");
                
            }, function(){
            
                $(this).attr("title", "");
                
            })
            
            //显示title
            $("a.discus-a").hover(function(){
            
                $(this).attr("title", "评论");
                
            }, function(){
            
                $(this).attr("title", "");
                
            })
            
            //取消推荐显示title
            $("a.isVoted").hover(function(){
            
                $(this).attr("title", "取消推荐");
                
            }, function(){
            
                $(this).attr("title", "");
                
            })
            
            //当窗口内容大小发生变化时，“回到顶部”按钮位置要保持不变
            
            $(window).resize(function(){
            
                var mainContent = $(".main-content");
                
                if(mainContent.length <= 0) return;
                              
                var left = parseInt(mainContent.outerWidth() + mainContent.offset().left + 20);
                
                var left2 = $("html").width();
                
                if (left2 < 1024) {
                
                    left = left2 - 300;
                }
                
                $("#gotop").css("left", left + "px");
                
                
            });
                       
            
        },
        
        initTopNews: function(){
            var $titleNews = $("#top-title-news");
            var $titleComments = $("#top-title-comments");
            var $contentNews = $("#top-content-news");
            var $contentCommnets = $("#top-content-comments");
            $contentCommnets.hide();
            var $topArrow = $("#top-bandArrow");
            $("#top-title-news").hover(function(){
                $titleNews.removeClass("top-band-title-default").addClass("top-band-title-select");
                $titleComments.removeClass("top-band-title-select").addClass("top-band-title-default");
                $contentNews.show();
                $contentCommnets.hide();
                $topArrow.css("left", "70px");
                
                chouti.fixedAdvert();
            });
            
            $titleComments.hover(function(){
                $titleComments.removeClass("top-band-title-default").addClass("top-band-title-select");
                $titleNews.removeClass("top-band-title-select").addClass("top-band-title-default");
                $contentCommnets.show();
                $contentNews.hide();
                $topArrow.css("left", "220px");
                
                chouti.fixedAdvert();
            });
            
            chouti.oprateDigg();
        },
        
        
        oprateDigg: function(){
        
            $("a.hot-comment-ding, a.hot-comment-cai").click(function(){
            
                var $this = $(this);
                
                if ($this.attr("class").indexOf("ding") >= 0) {
                    var vote = 1;
                }
                else {
                    var vote = -1;
                }
                
                var linkId = $this.attr("linkid");
                var jid = $this.attr("jid"); //投票人的destJid
                var id = $this.attr("lang");
                
                var submitUrl = "/comments/vote";
                
                var options = {
                
                    url: submitUrl,
                    type: "POST",
                    data: G.param({
                        linkId: linkId,
                        id: id,
                        jid: jid,
                        vote: vote
                    }),
                    success: function(info){
                    
                        if (info.code == ResultCodeSuccess) {
                        
                            //改变成已经点击过的样式且不能点击
                            if (vote == 1) { //顶
                                $($this).html("已顶[" + info.data + "]");
                                $($this).removeClass("top-comm-operate-pre").addClass("top-comm-operate-after");
                                $($this).siblings(".hot-comment-cai").removeClass("top-comm-operate-pre").addClass("top-comm-operate-after");
                                $($this).unbind("click");
                                $($this).siblings(".hot-comment-cai").unbind("click");
                            }
                            else { //踩
                                $($this).html("已踩[" + info.data + "]");
                                $($this).removeClass("top-comm-operate-pre").addClass("top-comm-operate-after");
                                $($this).siblings(".hot-comment-ding").removeClass("top-comm-operate-pre").addClass("top-comm-operate-after");
                           		$($this).unbind("click");
                                $($this).siblings(".hot-comment-ding").unbind("click");
						    }
                            //执行登录前点击的的提交动作后的提示信息
                            chouti.executeBeforOprate(true);
                            
                        }
                        else {
                        
                            //投票失败，请重试
                            //没有登录
                            if (!chouti.reponseNoLogin(info.code, info.message, "投票成功")) {
                                return false;
                            }
                            /*
                             //执行登录前的提交动作成功后,提示成功信息
                             var aj = $("#isAjax").val();
                             if(aj == 1) {
                             
                             var msg = $("#login_ajaxInfo").val();
                             
                             L.showTopTips(L.TIPS_TYPE.error, info.message);//提示失败信息
                             
                             $("#isAjax").val(0);
                             $("#login_ajaxInfo").val("");//提示信息
                             $("#isAjax").data("ajax",null);
                             window.location.reload();
                             } else {
                             L.showTopTips(L.TIPS_TYPE.error, info.message);
                             }
                             */
                            L.showTopTips(L.TIPS_TYPE.error, info.message);
                            
                            return;
                            
                        }
                        
                    }
                };
                
                //把要提交的动作保存下来
                $("#isAjax").data("ajax", options);
                
                L.ajax(options);
                
            });
            
        },
        
        //显示首页的通知
        showHomePageNotice: function(){
        
            $("#btnNotShw").click(function(){
            
                var $noticeBox = $("#user_notice_page");
                
                if ($noticeBox.css("display") == "block") {
                    //alert(123);
                    $noticeBox.hide();
                    //chouti.chatMskIframe("hide", "#user_notice_page");
                    return;
                }
                //如果没有未读通知时，点击后转向到通知页面
                if ($(this).find("em").html() == "") {
                
                    location.href = "/notice";
                    //return false;
                }
                //显示通知框(计算出通知框显示位置)
                var left = $("#btnNotShw").offset().left - 195;
                $noticeBox.css("left", left + "px").show();
                
                //alert(888);
                $("#userOprBox").hide(); //同时隐藏掉个人弹出框
                var submitUrl = "/message/topShow";
                
                L.ajax({
                    url: submitUrl,
                    type: "GET",
                    dataType: "json",
                    success: function(info){
                    
                        if (info.code == ResultCodeSuccess) {
                        
                            if (info.data.items <= 0) {
                                location.href = "/notice";
                                return;
                            }
                            
                            //编译模板
                            var source = $("#homeNotice-template").html();
                            var template = Handlebars.compile(source);
                            var html = template(info.data);
                            
                            $("#notice_box").html(html);
                            
                            //计算显示内容的高度,来改变iframe的高度，为了掩盖住下面的flash聊天窗口
                            //var nrH = $("#notice_b_box").height();							
                            //$("#noticeIframe").css("height", (nrH)+"px");
                            
                            //$("#profile-area").css("position", "static");
                            
                            chouti.chgNoticeTag(); //遍历每条通知前面的标识
                            /*设置未读通知为已读*/
                            
                            //点击设置为已读安钮
                            $(".f-close").click(function(e){
                            
                                var ids = $(this).attr("lang");
                                chouti.setNoticeRead(ids, "", left);
                                //window.event.stopPropagation();
                                //e.cancelBubble = true;
                            });
                            
                            //点击标题中的评论链接后也设置为已读
                            $(".f-list .f-t .f-href").click(function(){
                            
                                var ids = $(this).parent().attr("lang");
                                chouti.setNoticeRead(ids, "", left);
                                
                            });
                            
                            //点击全部已读按钮,只传个参数isAll为true
                            $("#btnReadAll").click(function(){
                            
                                chouti.setNoticeRead("", "all", left);
                                
                            });
                            
                            //点击名称及评论链接后，通知框隐藏
                            $(".f-list .f-t .f-href, .f-list .f-t .a-jid").click(function(){
                            
                                $noticeBox.hide();
                                
                            });
                            
                            //chouti.chatMskIframe("show", "#user_notice_page", left);
                            
                            chouti.homePageNotice(); //首页通知框中，鼠标移动效果													
                            //点击页面其它地方则隐藏通知框
                            chouti.listerDocu("#user_notice_page", "btnNotShw", "notice-num-title");
                            
                            
                        }
                        
                    }
                })
                
                
            })
            
        },
        
        //隐藏和显示iframe(挡住聊天室的层)
        //参数1表示是否隐藏，参数二表示显示的对象框，参数三表示显示的位置left
        chatMskIframe: function($isow, wih, left){
        
            if ($isow == "hide") {
            
                $(wih).hide();
                
                $("#maskIframe").hide();
                
                
            }
            else {
            
                //如果弹出的是通知框,则iframe改成和通知框宽度高度大小一样，fu gai住聊天窗口
                
                $(wih).show();
                
                chouti.changeMskIframeHe(wih, left);
                
            }
            
        },
        //改变挡住聊天室的iframe高度
        changeMskIframeHe: function(wih, left){
        
            var h = $(wih).height();
            var w = $(wih).width();
            
            if (wih == "#userOprBox") {
                h = h + 2;
                w = w + 2;
            }
            
            //var tops = 55;	//聊天室到页面顶部的高度
            
            //if(h > tops) {
            
            //	h = h - tops;
            
            $("#maskIframe").css({
                "display": "block",
                "width": w + "px",
                "height": h + "px",
                "left": left + "px"
            });
            //}
        
        },
        listerDocu: function(bigBox, clickObj, clickObj2, left){
        
            $(document).unbind().click(function(event){
            
                var $noticeBox = $(bigBox);
                var e = event || window.event;
                var elem = e.srcElement || e.target;
                
                if (elem && elem.id && elem.id != clickObj) {
                    if ($noticeBox.find("#" + elem.id).length > 0) {
                        $noticeBox.show();
                        return;
                    }
                    
                }
                
                //alert(elem.id);
                
                if (elem.id != clickObj && elem.id != "notice-em") {
                
                    $noticeBox.hide();
                }
                //$("#maskIframe").hide();
            
            
            })
            
            
        },
        //遍历每条通知前面的标识
        chgNoticeTag: function(){
        
            $("#user_notice_page .f-list").each(function(){
            
                var $this = $(this);
                var tag = $this.attr("messageid"); //标识
                var id = $this.attr("id"); //id
                if (tag == 2 || tag == 3) {
                
                    switch (tag) {
                        //被评论
                        case '2':
                            $this.find("#bs_" + id).removeClass("f-bs-s").addClass("f-bs-p");
                            break;
                        //被回复
                        case '3':
                            $this.find("#bs_" + id).removeClass("f-bs-s").addClass("f-bs-h");
                            break;
                            
                    }
                }
            })
        },
        
        //设置未读通知为已读
        setNoticeRead: function(ids, bs, left){
        
            if (bs == "") { //单个设置为已读
                var submitUrl = "/message/read?" +
                G.param({
                    id: ids
                });
                
            }
            else { //全部设置为已读
                var submitUrl = "/message/read?" +
                G.param({
                    isAll: true
                });
            }
            
            L.ajax({
                url: submitUrl,
                type: "POST",
                success: function(info){
                
                    if (info.code == ResultCodeSuccess) {//设置已读成功
                        var num = info.data; //获取未读通知数
                        chouti.chgNoticeNum(num); //改变未读通知数
                        if (bs == "") { //单个设置为已读
                            $("#" + ids).remove();
                            
                            //chouti.chatMskIframe("show", "#user_notice_page", left);
                        
                        }
                        else { //全部设置为已读
                            $("#user_notice_page").hide();
                            
                            //chouti.chatMskIframe("hide", "#user_notice_page");
                            //$("#maskIframe").hide();
                        }
                        
                    }
                    else {
                    
                        L.showTopTips(L.TIPS_TYPE.error, info.message);
                        return;
                    }
                }
            })
            
            
        },
        
        //首页通知框中，鼠标移动效果
        homePageNotice: function(){
        
            $("#user_notice_page .f-list").hover(function(){
            
                $(this).find(".f-close").show();
            }, function(){
                $(this).find(".f-close").hide();
            })
        },
        
        //改变未读通知数
        chgNoticeNum: function(newsCount){
        	
        	//if(newsCount == 'NaN') {
        	//alert(newsCount);
        	//}
        	//通知
            var $notice = $("#notice-num-title");
            
            if (newsCount < 0) {
                return;
            }
            if (newsCount == 0) {
                $notice.hide().children("em").text("");
                return;
            }
            
            if (newsCount > 99) {
            
                $notice.css("display", "inline-block").children("em").text("99");
                $notice.children("i").css("display", "inline-block");
                return;
            }
            
            $notice.css("display", "inline-block").children("em").text(newsCount);
            $notice.children("i").hide();
            
           
        },
        
        //改变未读私信数
        chgMailNum: function(chgNoticeNums){
             
            //私信
            var $notice = $("#mail-num-title");
            
            if (chgNoticeNums < 0) {
                return;
            }
            if (chgNoticeNums == 0) {
                $notice.hide().children("em").text("");
                return;
            }
            
            if (chgNoticeNums > 99) {
            
                $notice.css("display", "inline-block").children("em").text("99");
                $notice.children("i").css("display", "inline-block");
                return;
            }
            
            $notice.css("display", "inline-block").children("em").text(chgNoticeNums);
            $notice.children("i").hide();
        },
        
        /*
         * 计录分享次数
         * linksId 表示该新闻事件的id
         * siteId  表示每个微博的编号
         * state 表示如果是链接分享 state = 1  如果是话题分享，state =2）
         * */
        countNumShare: function(linksId, siteId, state){
        
            var submitUrl = "/share/site/stat?" +
            G.param({
                linksId: linksId,
                siteId: siteId,
                state: state
            });
            
            L.ajax({
                url: submitUrl,
                type: "POST",
                success: function(info){
                
                    if (info.code == ResultCodeSuccess) {
                    
                    }
                }
            })
            
        },
        
        //关注微博按钮,参数ifshow==true显示
        attention: function(ifshow){
        
            //关注按钮位置在内容最左侧
            if (ifshow) {
            
                var mainContent = $(".main-content");
                
                if(mainContent.length <= 0) return;
                
                var left = parseInt(mainContent.outerWidth() + mainContent.offset().left);
                
                $("#attention-area").css("left", (left + 1) + "px").show();
                
            }
            else {
            
                //alert(ifshow);
                $("#attention-area").css("z-index", "-1");
            }
            
        },
        //分享到微博的各个字段值
        returnShareVal: function($shaIco){
        
            var $parNode = $shaIco.parent().parent().parent(".part2");
            
            var title = $parNode.attr("share-title");
            
            //把内容中的双引号替换成转义字符
            /*
             title = title.replace(/"/g, "&quot;");
             */
            var linksId = $parNode.attr("share-linkid");
            
            var url = "http://" + window.location.host + "/link/" + linksId;
            
            var pic = $parNode.attr("share-pic");
            var summary = $parNode.attr("share-summary");
            var subject = $parNode.attr("share-subject");
            
            if (pic == "" || pic == undefined) {
                pic = ""
            }
            
            var tempArr = [];
            tempArr[0] = title;
            tempArr[1] = url;
            tempArr[2] = pic;
            tempArr[3] = summary;
            tempArr[4] = linksId;
            tempArr[5] = subject;
            
            return tempArr;
            
        },
        
        shareToSina: function(title, url, pic){
        
            var param = {
            
                url: url,
                // type:'3',
                // count:'', /**是否显示分享数，1显示(可选)*/
                appkey: '2198055500', /**您申请的应用appkey,显示分享来源(可选)*/
                title: title, /**分享的文字内容(可选，默认为所在页面的title)*/
                pic: pic.replace("=C60x60", ""), /**分享图片的路径(可选)*/
                ralateUid: '3991524012', /**关联用户的UID，分享微博会@该用户(可选)*/
                searchPic: 'false' //关闭自动搜索图片功能
                //language:'zh_cn', /**设置语言，zh_cn|zh_tw(可选)*/
                //   rnd:new Date().valueOf()
            }
            var temp = [];
            for (var p in param) {
                temp.push(p + '=' + encodeURIComponent(param[p] || ''))
            }
            
            //document.write('<iframe allowTransparency="true" frameborder="0" scrolling="no" src="http://hits.sinajs.cn/A1/weiboshare.html?' + temp.join('&') + '" width="'+ _w+'" height="'+_h+'"></iframe>')
            //wndow.open(window.location.href = "http://service.weibo.com/share/share.php?"+temp.join('&');
            var _u = "http://service.weibo.com/share/share.php?" + temp.join('&');
            window.open(_u, '', 'width=700, height=480, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
            
        },
        
        shareToDouban: function(title, url, pic, text){
              
        	/*
        	 var d = document, e = encodeURIComponent, s1 = window.getSelection, s2 = d.getSelection, s3 = d.selection, s = s1 ? s1() : s2 ? s2() : s3 ? s3.createRange().text : '', r = 'http://www.douban.com/share/recommend/?href=' + e(url) + '&name=' + e(title) + '&image=' + e(pic.replace("=C60x60", "")) + '&text=' + e(text), x = function(){
                 if (!window.open(r, 'douban', 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330')) 
                     location.href = r
             };
             if (/Firefox/.test(navigator.userAgent)) {
                 setTimeout(x, 0)
             }
             else {
                 x()
             }
             */
        	
            var d = document, e = encodeURIComponent, s1 = window.getSelection, s2 = d.getSelection, s3 = d.selection, s = s1 ? s1() : s2 ? s2() : s3 ? s3.createRange().text : '', r = 'http://www.douban.com/recommend/?url=' + e(url) + '&title=' + e(title) + '&image=' + e(pic.replace("=C60x60", "")) + '&text=' + e(text) + '&sel=' + e(s) + '&v=1', x = function(){
                if (!window.open(r, 'douban', 'toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330')) 
                    location.href = r + '&r=1'
            };
            if (/Firefox/.test(navigator.userAgent)) {
                setTimeout(x, 0)
            }
            else {
                x()
            }
        	
        	
            
        },
        
        shareToqqzone: function(title, url, pic, summary){
        
            var p = {
                url: url,
                //showcount:'0',/*是否显示分享总数,显示：'1'，不显示：'0' */
                desc: '',/*默认分享理由(可选)*/
                summary: summary,/*分享摘要(可选)*/
                title: title,/*分享标题(可选)*/
                site: '买买君热榜',/*分享来源 如：腾讯网(可选)*/
                pics: pic.replace("=C60x60", "") /*分享图片的路径(可选)*/
                //style:'203',
                //width:22,
                //height:22
            };
            var s = [];
            for (var i in p) {
                s.push(i + '=' + encodeURIComponent(p[i] || ''));
            }
            var _u = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + s.join('&');
            window.open(_u, '', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
            
        },
        
        shareToTenxun: function(title, url, pic){
        
            var _url = encodeURIComponent(url) + " (分享自@choutixinrebang)";
            var _pic = encodeURI(pic.replace("=C60x60", ""));//原图（例如：var _pic='图片url1|图片url2|图片url3....）
            var _t = title;//标题和描述信息
            var metainfo = document.getElementsByTagName("meta");
            
            //_t =  document.title+_t;//请在这里添加你自定义的分享内容
            if (_t.length > 120) {
                _t = _t.substr(0, 117) + '...';
            }
            _t = encodeURI(_t);
            var _u = 'http://share.v.t.qq.com/index.php?c=share&a=index&url=' + _url + '&appkey=801059706&pic=' + _pic + '&assname=买买君热榜&title=' + _t;
            window.open(_u, '', 'width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no');
            
        },
        
        shareToRenren: function(title, url, pic, summary){
        
            var rrShareParam = {
                resourceUrl: url, //分享的资源Url
                pic: pic.replace("=C60x60", ""), //分享的主题图片Url
                title: title, //分享的标题
                description: summary //分享的详细描述
            };
            rrShareOnclick(rrShareParam);
            
        },
        
        shareToMail: function(content, url, $this){
        
            //如果发送邮件对话框已经存在则弹出，如果不存在则生成
            if ($("#MailShare-dialog").length <= 0) {
            
                $("#footer-band").append($("#sendMail-model").html());
                
                //$("#mailShareTitle").drag();	//弹出框添加拖动事件	
            }
            
            chouti.showMask("#MailShare-dialog", "top"); //显示meng板
            var offsetH = $this.offset().top - $("#MailShare-dialog").height() / 2 + 30;
            
            if (offsetH <= 0) {
                offsetH = 30;
            }
            
            $("#mask").show();
            $("#MailShare-dialog").show()//显示对话框
            .css("top", offsetH + "px");
            
            $("#chatIframe").css({
                "height": "0px",
                "width": "0px"
            });
            
            //初始化			
            chouti.initMailDialog(content, url);
            
            //邮件发送事件
            chouti.sendMail(content, url);
            
        },
        bindShareWeibo: function(w){
        
            // siteId 是按照分享的微博的顺序来的，从左到右依次为1，2，3，4，5
            
            //新浪分享
            var $sharePra = $(".part2 .share-site-to .share-icon");
            
            $sharePra.find(".icon-sina").die().live("click", function(){
            
                var returnValue = chouti.returnShareVal($(this), w);
                
                var title = returnValue[0];
                var url = returnValue[1];
                var pic = returnValue[2];
                var summary = returnValue[3];
                var linksId = returnValue[4];
                
                chouti.shareToSina(title, url, pic, summary);
                
                chouti.countNumShare(linksId, 1, 1);
            })
            
            //豆ban分享
            
            $sharePra.find(".icon-douban").die().live("click", function(){
            
                var returnValue = chouti.returnShareVal($(this));
                
                var title = returnValue[0];
                var url = returnValue[1];
                var pic = returnValue[2];
                var summary = returnValue[3];
                var linksId = returnValue[4];
                
                chouti.shareToDouban(title, url, pic, summary);
                
                chouti.countNumShare(linksId, 2, 1);
            })
            
            //分享到QQ空间
            
            $sharePra.find(".icon-qqzone").die().live("click", function(){
            
                var returnValue = chouti.returnShareVal($(this));
                
                var title = returnValue[0];
                var url = returnValue[1];
                var pic = returnValue[2];
                var summary = returnValue[3];
                var linksId = returnValue[4];
                
                chouti.shareToqqzone(title, url, pic, summary);
                
                chouti.countNumShare(linksId, 3, 1);
                
            })
            
            
            //分享到腾讯微博
            
            $sharePra.find(".icon-tenxun").die().live("click", function(){
            
                var returnValue = chouti.returnShareVal($(this));
                
                var title = returnValue[0];
                var url = returnValue[1];
                var pic = returnValue[2];
                var summary = returnValue[3];
                var linksId = returnValue[4];
                
                chouti.shareToTenxun(title, url, pic, summary);
                
                chouti.countNumShare(linksId, 4, 1);
                
            })
            
            
            //分享到人人网
            
            $sharePra.find(".icon-renren").die().live("click", function(){
            
                var returnValue = chouti.returnShareVal($(this));
                
                var title = returnValue[0];
                var url = returnValue[1];
                var pic = returnValue[2];
                var summary = returnValue[3];
                var linksId = returnValue[4];
                
                chouti.shareToRenren(title, url, pic, summary);
                
                chouti.countNumShare(linksId, 5, 1);
                
            })
            
            //分享到邮件
            
            $sharePra.find(".icon-mail").die().live("click", function(){
            
                var returnValue = chouti.returnShareVal($(this));
                
                var content = returnValue[0] + " （分享自 @买买君热榜）";
                var url = returnValue[1];
                //var pic = returnValue[2];
                //var summary = returnValue[3];
                var linksId = returnValue[4];
                var subject = returnValue[5];
                
                if (subject == "段子") {
                
                    content = "【段子】" + content;
                }
                
                chouti.shareToMail(content, url, $(this));
                //计录分享次数
                chouti.countNumShare(linksId, 6, 1);
                
            })
        },
        
        //初始化邮件发送框
        initMailDialog: function(content, url){
        
            //清空文本框
            $("#receiveName").val("");
            $("#mailTitle").val("");
            $("#MailErrDesc").html("");
            $("#mailContent").val(content + "\n" + url);
            
            $("#sendMailBtn").addClass("new-pub-btn-unvalid").removeClass("new-pub-btn-valid");
            
            //方本框获得焦点时边框变色
            $("#MailShare-dialog :text, #MailShare-dialog textarea").focus(function(){
            
                $(this).css("border", "1px solid #88afd5");
                
            }).blur(function(){
            
                $(this).css("border", "1px solid #bdc9d2");
            })
            
            $("#receiveName").focus();
            
            //监听输入框内容变化情况，以便做出响应
            
            $.extend({
            
                inputMail: function(objs, fun){ //参数obj,表示输入框的ID，参数fun 为函数名称
                    var element = document.getElementById(objs);
                    if (element != null) {
                        if ("\v" == "v") { //IE
                            element.attachEvent("onpropertychange", fun);
                            
                        }
                        else { //除去IE外其它的浏览器
                            element.addEventListener("input", fun, false);
                        }
                    }
                }
            })
            
            
            //监听发件人输入框
            
            $.inputMail("receiveName", function(){
                chouti.listenMailTxt("receiveName", "mailTitle")
            });
            
            //监听主题输入框
            
            $.inputMail("mailTitle", function(){
                chouti.listenMailTxt("mailTitle", "receiveName")
            });
            
            //关闭对话框
            $("#dialog-mail-close, #clear-btn-mail").click(function(){
            
                //隐藏发布框
                $("#MailShare-dialog").hide();
                
                $("#mask").hide().remove();
                
                $("#chatIframe").css({
                    "height": "475px",
                    "width": "300px"
                });
            })
            
            //获取验证码，防止发垃圾邮件
            //$("#authImg").attr("src", "/gozapIdentifyCode?t="+Math.floor(Math.random()*100));
        },
        
        //监听邮件文本框
        listenMailTxt: function(bj1, bj2){
        
            var duanzi = $("#" + bj1).val();
            
            var duanzi2 = $.trim($("#" + bj2).val());
            
            if ($.trim(duanzi) == "") { //内容为空按钮无效
                $("#sendMailBtn").addClass("new-pub-btn-unvalid").removeClass("new-pub-btn-valid");
                return;
                
            }
            else { //内容不为空按钮有效	
                if (duanzi2 != "") {
                    $("#sendMailBtn").addClass("new-pub-btn-valid").removeClass("new-pub-btn-unvalid");
                }
            }
        },
        
        //邮件分享，发送邮件事件
        sendMail: function(nr, url){
        
            $("#sendMailBtn").unbind().click(function(){
            
                //当内容为空时，按钮不可点击
                var txtRecer = $.trim($("#receiveName").val()); //收件人
                var txtTitle = $.trim($("#mailTitle").val()); //主题
                if ((txtRecer == "" || txtTitle == "") && $("#sendMailBtn").hasClass("new-pub-btn-unvalid")) 
                    return;
                
                //判断邮箱格式正确
                if (!gozapCommon.isEmail(txtRecer)) {
                
                    $("#MailErrDesc").html("邮箱格式不合法，请重新输入").show();
                    return;
                }
                
                //显示loading,发布按钮隐藏
                $("#sendMailBtn").hide();
                $("#mailSend-loading").css("display", "inline-block");
                
                var content = $("#mailContent").val(); //内容
                var submitUrl = "/share/mail";
                
                L.ajax({
                    url: submitUrl,
                    type: "POST",
                    data: {
                        receiver: txtRecer,
                        subject: txtTitle,
                        content: nr,
                        url: url
                    },
                    success: function(info){
                    
                        if (info.code == ResultCodeSuccess) {
                        
                            L.showTopTips(L.TIPS_TYPE.success, info.message); //提示发送成功
                            $("#sendMailBtn").show().addClass("new-pub-btn-unvalid").removeClass("new-pub-btn-valid");
                            
                            $("#mailSend-loading").css("display", "none"); //隐藏loading
                            $("#dialog-mail-close").click(); //关闭							
                            return;
                        }
                        else {
                        
                            var errMsg = info.message;
                            
                            $("#MailErrDesc").html(errMsg).show();
                            
                            $("#sendMailBtn").show();
                            $("#mailSend-loading").css("display", "none"); //隐藏loading
                            ispublishing = false;
                            return;
                            
                        }
                        
                    }
                })
                
                
            })
            
        },
        
        //分享到各微博
        shareweibo: function(w){
        
            chouti.bindShareWeibo(w); //绑定微博分享事件
            //鼠标移动到列表项上时显示分享，鼠标离开隐藏分享
            //在移动设备上如果用hover事件，在点击链接时需要点击两次才能触发，为避免这样情况，在移动设备中让分享按钮一直显示
            
            //分享到微博变量字符串
            //var shareInfo = "<span class='share-site-to' style='visibility:visible'><i>分享到</i><span class='share-icon'><a class='icon-sina' id='icon-sina' title='分享到新浪微博' href='javascript:;' hidefocus='true'></a><a class='icon-douban' id='icon-douban' title='分享到豆瓣' href='javascript:;' hidefocus='true'></a><a class='icon-qqzone' id='icon-qqzone' title='分享到QQ空间' href='javascript:;' hidefocus='true'></a><a class='icon-tenxun' id='icon-tenxun' title='分享到腾讯微博' href='javascript:;' hidefocus='true'></a><a class='icon-renren' id='icon-renren' title='分享到人人网' href='javascript:;' hidefocus='true'></a><a class='icon-mail' id='icon-mail' title='分享到邮件' href='javascript:;' hidefocus='true'></a><a class='share-none'> </a></span></span>";
            var shareInfo = "<span class='share-site-to' style='visibility:visible'><i>分享到</i><span class='share-icon'><a class='icon-sina' id='icon-sina' title='分享到新浪微博' href='javascript:;' hidefocus='true'></a><a class='icon-douban' id='icon-douban' title='分享到豆瓣' href='javascript:;' hidefocus='true'></a><a class='icon-qqzone' id='icon-qqzone' title='分享到QQ空间' href='javascript:;' hidefocus='true'></a><a class='icon-tenxun' id='icon-tenxun' title='分享到腾讯微博' href='javascript:;' hidefocus='true'></a><a class='icon-renren' id='icon-renren' title='分享到人人网' href='javascript:;' hidefocus='true'></a><a class='share-none'> </a></span></span>";
            
            if (!chouti.checkserAgent()) { //如果是在PC上
                $("#content-list .item").hover(function(e){
                
                    //当有标题显示时才能出现分享
                    if ($(this).find(".show-content-grey, .show-content").length > 0) {
                    
                        var $part2 = $(this).find(".part2");
                        
                        var $share = $part2.find(".share-site-to");
                        
                        if ($share.length <= 0) {
                        
                            $part2.append(shareInfo); //追加到part2中
                        }
                        
                        $share.css({
                            "visibility": "visible"
                        });
                        
                    }
                }, function(){
                
                    $(this).find(".share-site-to").css("visibility", "hidden");
                    
                })
                
            }
            else { //如果是在移动设备上,让分享按钮一直显示
                $("#content-list .item").each(function(){
                
                    $(this).find(".part2").append(shareInfo); //追加到part2中
                })
                
            }
        },
        
        
        //鼠标移动到该条新闻上时显示域名
        showItemDomain: function(){
        
            $("#content-list .item").hover(function(){
            
                $(this).find("span.content-source").show();
            }, function(){
                $(this).find("span.content-source").hide();
            })
        },
        //生成顶部toast  tip提示框,顶部提示
        addTopTips: function(){
        
            var toast = "<div id='tips_top_container' style='display: none;'>";
            
            toast += "<div class='inline-block tips-top'>";
            
            toast += "<span class='tips-top-text' style='margin: 0pt 30px 0pt 10px;'></span>";
            
            toast += "<a class='icon-common icon-close-success' href='javascript:;' style='display: block;'></a>";
            
            toast += "</div></div>";
            
            $("body").append(toast);
            
            //点击tip关闭按钮
            $(".icon-close-success").click(function(){
                $("#tips_top_container").hide();
            })
            
        },
        //显示通知数
        showStreamNotice: function(){
        
            var submitUrl = "/message/unread/count";
            
            L.ajax({
                url: submitUrl,
                type: "GET",
                cache: false,
                success: function(info){
                
                    if (info.code == ResultCodeSuccess) {
                        //alert(info.data);
                        chouti.showNoticeCount(parseInt(info.data), $("#notice-num-title")); //显示通知数
                    }
                }
            })
            
        },
        
        //显示私信数
        showStreamMail: function(){
        
            var submitUrl = "/letter/noread/count.do";
            
            L.ajax({
                url: submitUrl,
                type: "GET",
                cache: false,
                success: function(info){
                
                    if (info.code == ResultCodeSuccess) {
                       
                        chouti.showNoticeCount(parseInt(info.data), $("#mail-num-title"));
                    }
                }
            })
            
        },
        /*发送ajax请求，付给iframe的src属性，以便触发通知
         *参数re=broadcast 表示订阅新入热榜链接数的通知
         *参数re=private  表示订阅用户未读通知数的通知
         *参数thg表示iframe的ID
         */
        getNewIntoHot: function(re, thg){
        
            var submitUrl = "/comet/channel/" + re;
            
            L.ajax({
                url: submitUrl,
                type: "GET",
                success: function(info){
                
                    if (info.code == ResultCodeSuccess) {
                    
                        $(thg).attr("src", info.data);
                        
                    }
                    else {
                    
                        return;
                    }
                }
            })
            
        },
        //打开页面时首先显示的通知数
        showNoticeCount: function(str, $numTitle){
        
            if (typeof(str) == "number") {//必须是数值型
                var num = str;
                var numStr = num
                
                if (num < 1) {
                    numStr = "";
                    $numTitle.hide();
                    return;
                }
                else {
                
                	$numTitle.css("display", "inline-block");
                }
                if (num > 99) {
                    var numStr = "99";
                    $numTitle.children("i").css("display", "inline-block");
                }
                
                $numTitle.children("em").text(numStr)
                               
            }
        },
        //显示勋章的大图
        showQuanZhang: function(){
        
            $("#quan_li").hover(function(){
            
                if ($(this).children("span.quan-noli").length <= 0) {
                    $("#quan_li_big").show();
                }
                
            }, function(){
            
                $("#quan_li_big").hide();
                
            })
        },
        //用户退出
        logout: function(){
        
            $(".logout").click(function(){
                var submitUrl = "/logout";
                
                L.ajax({
                    url: submitUrl,
                    //					type:"POST",
                    //					data:G.param({url: window.location.href}),
                    success: function(info){
                    
                        if (info.code == ResultCodeSuccess) {
                        
                            var her = window.location.href;
                            
                            //在个人私藏页面点击退出跳转到发布页面
                            
                            if (her.indexOf("user/link/saved") > 0) {
                            
                                var name = $("#i_jid").text();
                                
                                window.location.href = "/user/" + name + "/submitted/1";
                                
                            }
                            //私信页面退出时
                            if (her.indexOf("/letter") > 0) {
                            	
                            	window.location.href = "/";
                            }
                            
                            else {
                            
                                window.location.reload();
                                
                            }
                            
                        }
                    }
                })
                
            })
            
        },
        
        //点击首页TAB标签转向相应类别页面
        tabsNavPage: function(){
            $("#tabs-nav .tb").click(function(){
                window.location.href = $(this).children("a").attr("href");
                
            })
            
            //个人页面tab转向
            $("#person-tabs-nav .tb").click(function(){
                window.location.href = $(this).children("a").attr("href");
            })
        },
        //显示蒙板,参数为弹出框id
        showMask: function(dialogObj, ju){
        
            //获取屏幕的宽度及高度
            //var bodyHeight = $("screen").height();
            var bodyHeight = $("body").height();
            var bodyWidth = $("body").width();
            //window.screen.width - $("body").scrollWidth;
            
            //弹出框居中显示在屏幕上
            var left = parseInt(bodyWidth / 2) - parseInt($(dialogObj).width() / 2); //左边距
            var clientH = document.documentElement.clientHeight || document.body.clientHeight;
            
            var top = parseInt(clientH / 2) - parseInt($(dialogObj).height() / 2) + parseInt($(window).scrollTop()); //top值
            if (ju == "") {
                $(dialogObj).css({
                    "left": left,
                    "top": top
                });
            }
            else {
                $(dialogObj).css({
                    "left": left
                });
            }
            
            
            //取最大高度
            bodyHeight = parseInt($("body").height());
            clientH = parseInt(clientH);
            bodyHeight = bodyHeight > clientH ? bodyHeight : clientH;
            //----------------------------------------------------------
            
            mask = "<div class='op mask' id='mask' style='width: " + bodyWidth + "px; height: " + bodyHeight + "px;filter: alpha(opacity=50)'></div>";
            $("body").append(mask);
            
        },
        //显示上传个人头像框
        showUploadImgDialog: function(){
            $("#modifyPersonPhoto").click(function(){
            
                chouti.showMask("#H-avaupload-dialog", ""); //显示meng板
                $("#mask").show();
                $("#H-avaupload-dialog").show(); //显示登录框	
                /*
                 $("#mask").fadeIn("500",function(){
                 //$(this).css("filter", "alpha(opacity=50)");
                 $("#H-avaupload-dialog").show();	//显示登录框
                 
                 });
                 */
            })
        },
        hidPublishWindow: function(){
            $("#publishBtn").hide();
        },
        
        clearTimeInterval: function(){
            window.clearInterval(timePool);
            
            window.clearInterval(htimePool);
        },
        
        timeChange: function(){
        
            timePool = window.setInterval(function(){
            
                //当前时间戳
                
                $("#content-list .item").each(function(){
                
                    var actionTime = $(this).find(".timeIntoPool").html();
                    
                    //当前时间
                    var datas = $(this).data("nowTotalTime");
                    
                    if (datas == undefined || datas == null) {
                    
                        var nowTotalTime = actionTime.substring(actionTime.indexOf(",") + 1);
                        nowTotalTime = parseFloat(nowTotalTime / 1000) + 60 * 1000 + 60 * 1000;
                        $(this).data("nowTotalTime", nowTotalTime + 60 * 1000);
                        
                    }
                    else {
                    
                        var nowTotalTime = parseFloat($(this).data("nowTotalTime"));
                        $(this).data("nowTotalTime", nowTotalTime + 60 * 1000);
                        
                    }
                    
                    
                    //以前时间
                    oldTime = actionTime.substring(0, actionTime.indexOf(","));
                    
                    oldTime = parseFloat(oldTime / 1000) + 60 * 1000;
                    
                    //返回时间字符串
                    var timePoolStr = chouti.getDifferTime(nowTotalTime, oldTime);
                    
                    $(this).children(".news-content").children(".part2").children(".time-into").children(".time-a").children("b").html(timePoolStr);
                    
                })
                
                
            }, 60000)
        },
        
        //话题时间刷新
        HttimeChange: function(){
        
            htimePool = window.setInterval(function(){
            
                //当前时间戳
                
                $(".topic-c-box").each(function(){
                
                    var $item = $(this).find(".detail-c").find(".item");
                    
                    var actionTime = $item.find(".timeIntoPool").html();
                    
                    //当前时间
                    var datas = $(this).data("nowTotalTime");
                    
                    if (datas == undefined || datas == null) {
                    
                        var nowTotalTime = actionTime.substring(actionTime.indexOf(",") + 1);
                        nowTotalTime = parseFloat(nowTotalTime / 1000) + 60 * 1000 + 60 * 1000;
                        $(this).data("nowTotalTime", nowTotalTime + 60 * 1000);
                        
                    }
                    else {
                    
                        var nowTotalTime = parseFloat($(this).data("nowTotalTime"));
                        $(this).data("nowTotalTime", nowTotalTime + 60 * 1000);
                        
                    }
                    
                    
                    //以前时间
                    oldTime = actionTime.substring(0, actionTime.indexOf(","));
                    
                    oldTime = parseFloat(oldTime / 1000) + 60 * 1000;
                    
                    //返回时间字符串
                    var timePoolStr = chouti.getDifferTime(nowTotalTime, oldTime);
                    
                    $(this).children(".time-p").children(".pb").children("i").html(timePoolStr);
                    
                })
                
                
            }, 60000)
        },
        /** 时间比对的方法 */
        getDifferTime: function(nowTotalTime, actionTime){
        
            if (actionTime == "") {
                return;
            }
            var rate = 1000;
            var oldTotalTime = actionTime;
            
            if (nowTotalTime - oldTotalTime <= 60 * rate) {
            
                return "小于1分钟前";
                
            }
            else 
                if (nowTotalTime > oldTotalTime && nowTotalTime - oldTotalTime < 60 * 60 * rate) {
                
                    return (parseInt((nowTotalTime - oldTotalTime) / (60 * rate))) + "分钟前";
                    
                }
                else 
                    if (nowTotalTime > oldTotalTime && (nowTotalTime - oldTotalTime) < 60 * 60 * 24 * rate) {
                    
                        var h = parseInt((nowTotalTime - oldTotalTime) / (60 * 60 * rate));
                        var min = parseInt((nowTotalTime - oldTotalTime - h * 60 * 60 * rate) / (60 * rate));
                        if (min < 59) {
                            min = min + 1;
                        }
                        return h + "小时" + min + "分钟前";
                        
                    }
                    else 
                        if (nowTotalTime > oldTotalTime && nowTotalTime - oldTotalTime < 60 * 60 * 24 * 30 * rate) {
                        
                            var d = parseInt((nowTotalTime - oldTotalTime) / (60 * 60 * 24 * rate));
                            
                            var h = parseInt((nowTotalTime - oldTotalTime - d * 60 * 60 * 24 * rate) / (60 * 60 * rate));
                            
                            if (h < 23) {
                                h = h + 1;
                            }
                            
                            return d + "天" + h + "小时前";
                            
                        }
                        else {
                        //alert(888);
                        /*
                 Date dt = new Date(parseFloat(actionTime.substring(0, 13)));
                 DateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm");
                 int nowYear = Calendar.getInstance().get(Calendar.YEAR);
                 int oldYear = Integer.parseInt(df.format(dt).substring(0,
                 df.format(dt).indexOf("-")));
                 if (nowYear != oldYear && nowYear > oldYear) {
                 df = new SimpleDateFormat("yyyy-MM-dd");
                 }
                 return df.format(dt);
                 */
                        }
        },
        
        //点击发布按钮弹出发布框
        //tbid,表示选中tab的id
        showPublishWindow: function(tbid){
        
            $("#publishBtn").click(chouti.pubNews)
            
        },
        
        //发布分享新发现
        pubNews: function(isHt){
        
            var submitUrl = "/link/share";
            
            var options = {
                url: submitUrl,
                type: "POST",
                success: function(info){
                
                    var code = info.code;
                    
                    if (code == ResultCodeSuccess) {
                    
                        if ($("#login_ajaxInfo").val() != "publish") {
                        
                            //隐藏聊天室
                            $("#chatIframe").css({
                                "height": "0px",
                                "width": "0px"
                            });
                            
                            //如果发布对话框已经存在则弹出，如果不存在则生成
                            if ($("#digg-dialog-publish").length <= 0) {
                            
                                $("#footer-band").append($("#publish-dialog-code").html());
                                NS_publish_dialog.init();
                                
                                if (isHt == "huati") {
                                
                                    chouti.initHtInfo(); //初始化发布话题
                                }
                                
                                $(".dialog-title").drag(); //弹出框添加拖动事件
                            }
                            NS_publish_dialog.clearAllTextInput();//初始化发布对话框									
                            chouti.showMask("#digg-dialog-publish", "top"); //显示meng板
                            $("#mask").show();
                            $("#digg-dialog-publish").show()//显示对话框
                            						.css("top", "130px");
                            //选中哪个标签tab									
                            //NS_links_hotts.selectTabs();
                            $("#pubTabZixun").click();//选中哪个标签tab
                            
                            //根据当前类别隐藏发布框中的发布到
                            
                            var leiStyle = $("#publishBtn").attr("lang");
                            
                            chouti.showOrHidePubtoBox(leiStyle);
                            
                        }
                        //执行登录前点击的的提交动作后的提示信息
                        chouti.executeBeforOprate(false);
                        
                    }
                    else {
                    
                    
                        //用户没有登录
                        if (!chouti.reponseNoLogin(code, info.message, 'publish')) {
                            return false;
                        }
                        //表示用户被封禁
                        //if(code == 2002) {
                        L.showTopTips(L.TIPS_TYPE.error, info.message);
                        return;
                        //}
                    }
                }
            };
            
            //把要提交的动作保存下来
            $("#isAjax").data("ajax", options);
            
            L.ajax(options);
            
            
        },
        
        showOrHidePubtoBox: function(lei) {
        	
        	switch(lei) {
        		
        		case "news":
        			
        			//tab隐藏
        			$("#pubTabDuanzi").hide();
        			$("#pubTabPic").hide();
        			
        			//发布到按钮隐藏
        			$("#to-btn-zixun").show()      							
        							  .siblings("a").hide();
        			
        			break;
        			
        		case "scoff":
        			
        			$("#pubTabPic").hide();
        			
        			//发布到按钮隐藏
        			$("#to-btn-duanzi").show()
        							   .click()
        							   .siblings("a").hide();
        			
        			$("#to-btn-duanzi2").show()
					   					//.click()
					   					.siblings("a").hide();
        			
        			break;
        			
        		case "pic":
        			
        			$("#pubTabDuanzi").hide();
        			
        			//发布到按钮隐藏
        			$("#to-btn-pic").show()
        							.click()
        							.siblings("a").hide();
        			
        			$("#to-btn-pic2").show()
									.siblings("a").hide();
        			
        			break;
        			
        		case "tec":
        			
        			$("#pubTabDuanzi").hide();
        			$("#pubTabPic").hide();
        			
        			//发布到按钮隐藏
        			$("#to-btn-tec").show()
        							.click()
        							.siblings("a").hide();        			
        			break;       			
        			
        		case "pub":
	
        			$("#pubTabDuanzi").hide();
        			
        			//发布到按钮隐藏
        			$("#to-btn-unfavor").show()
        								.click()
        								.siblings("a").hide();
        			
        			$("#to-btn-unfavor2").show()
        								.click()
										.siblings("a").hide();
        			
        			break;
        			
        		case "ask":
        			
        			$("#pubTabZixun").show();
        			$("#pubTabDuanzi").show();
        			$("#pubTabPic").show();
        			
        			//发布到按钮隐藏
        			$("#to-btn-ask").show()
        							.click()
        							.siblings("a").hide();
        			
        			$("#to-btn-ask2, #to-btn-ask3").show()
        											.click()
													.siblings("a").hide();
        			
        			break;
        			
        		default:
        				
        			$("#pubTabZixun").show();
        			$("#pubTabDuanzi").show();
        			$("#pubTabPic").show();
        			
        			
        	}
        	
        },
        //初始化发布话题
        initHtInfo: function(){
        
            var $ht = $("#htPubBtn");
            
            var topicId = $ht.attr("lang");
            
            var htTag = $ht.attr("htTag");
            
            var htTitle = $ht.attr("title");
            
            $("#shareTitle").html(htTitle); //显示发布框标题为话题发布
            $("#hidHtTag").val("huati") //给话题标识赋值
.attr("topicId", topicId); //给话题标识赋值ID
        },
        
        //弹出登录框
        showLoginBox: function(re){
        
            //隐藏聊天室
            $("#chatIframe").css({
                "height": "0px",
                "width": "0px"
            });
            
            //如果登录对话框已经存在则弹出，如果不存在则生成
            if ($("#digg-dialog-login").length <= 0) {
            
                $("#footer-band").append($("#login-dialog-code").html());
                
                NS_login.init(); //登录框初始化
                $(".dialog-title").drag(); //弹出框添加拖动事件
            }
            
            chouti.showMask("#digg-dialog-login", ""); //显示meng板
            $("#mask").show();
            $("#digg-dialog-login").show(); //显示登录框	
            if (re == "reg") { //注册用户名输入框获得焦点
                $("#reg_destJid").focus();
                
            }
            else { //登录用户名输入框获得焦点
                $("#destJid").focus();
                
            }
            //alert(123);
        
        
        },
        //点击登录注册链接 弹出登录框
        showLoginDialog: function(){
        
            //点击注册链接时
            $("#reg-link-a, #reg-link-a-a").click(function(){
                //alert(122);
                chouti.showLoginBox("reg");
                
            })
            //点击登录链接时
            $("#login-link-a, #login-link-a-a").click(function(){
            
                chouti.showLoginBox();
                
            })
            
        },
        
        isVideoUrl: function(url){
            var videoSiteRegex = "^(http://)(\\S){0,}(" +
            // 优酷
            "(v.youku.com)|(player.youku.com)|(static.youku.com)" +
            // 土豆
            "|(tudou.com)|(js.tudouui.com)" +
            // 爱奇艺
            "|(iqiyi.com)|(video.qiyi.com)" +
            // 17173游戏视频
            "|(17173.tv.sohu.com)" +
            // 搜狐
            "|(tv.sohu.com)|(vrs.sohu.com)" +
            // 腾讯视频
            "|(v.qq.com)|(video.qq.com)|(imgcache.qq.com)" +
            // 酷6
            "|(v.ku6.com)|(player.ku6.com)|(player.ku6cdn.com)" +
            // pptv
            "|(v.pptv.com)|(player.pptv.com)|(player.pplive.cn)" +
            // 新浪视频
            "|(video.sina.com.cn)" +
            // 56网
            "|(56.com)" +
            // 网易视频
            "|(v.163.com)|(swf.ws.126.net)|(v.ent.163.com)" +
            // 激动网
            "|(joy.cn)" +
            // 乐视网
            "|(letv.com)" +
            // 音悦台
            "|(yinyuetai.com)" +
            // 迅雷看看
            "|(vod.kankan.com)|(video.kankan.com)|(kankan.com/vod)" +
            // 百度视频
            "|(mv.baidu.com)|(tieba.baidu.com/shipin/bw/video)" +
            // PPS
            "|(v.pps.tv)|(player.pps.tv)" +
            // 凤凰视频
            "|(v.ifeng.com)|(img.ifeng.com/swf)" +
            // cntv
            "|(player.cntv.cn)" +
            // 爱西柚
            "|(xiyou.cntv.cn)" +
            // 电影网
            "|(m1905.com/vod/play)|(m1905.com/video/play)" +
            // 江苏网络电视台
            "|(jstv.com)" +
            // 北京电视台
            "|(btv.com.cn/video/VID)" +
            // 齐鲁网
            "|(v.iqilu.com)" +
            // 新华网
            "|(xinhuanet.com[\\S]{0,}video)" +
            // 时光网
            "|(movie.mtime.com)" +
            // 第一视频
            "|(v1.cn)" +
            // 中关村在线
            "|(v.zol.com)" +
            // Tom宽频
            "|(tv.tom.com[\\S]{1,}video_id=[\\d]{1,})|(tv.tom.com[\\S]{1,}\\.swf[\\S]{1,}video=)" +
            // 播视网
            "|(boosj.com\\/[\\d]{4,})|(static.boosj.com)" +
            // 爆米花
            "|(video.baomihua.com)" +
            // acfun
            "|(acfun.tv/v/ac[\\d]{4,})" +
            // 哔哩哔哩
            "|(bilibili.smgbb.cn/video/av[\\d]{4,})" +
            // 哔哩哔哩
            "|(video6.smgbb.cn)" +
            // 酷狗MV
            "|(kugou.com[\\S]{1,}mv_[\\d]{3,})" +
            // 酷狗MV
            "|(weiphone.com[\\S]{1,}weplayer.swf)" +
            // 艺术中国
            "|(art.china)" +
            ")(\\S){0,}";
            var reg = new RegExp(videoSiteRegex, "g");
            if (url.match(reg) != null) {
                return true;
            }
            return false;
        },
        
        //播放视频
        playVido: function(){
        
            $("a.vidio-a").unbind().bind("click", function(){
            
                var $spaniCon = $(this).find("span");
                
                var id = $(this).attr("lang");
                
                var flashUrl = $(this).attr("flashUrl");
                
                $("#comment-box-area-" + id).hide(); //评论区域隐藏
                var $parent = $(this).parent().parent(); //父节点
                var $videoBox = $("#videoBox" + id); //视频容器
                if ($videoBox.css("display") == "block") {
                
                    chouti.hidePlayVido(id);
                    return;
                }
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/iphone/) || ua.match(/ipad/)) {
                    if (($("#videoBox" + id).length > 0)) {
                        return;
                    }
                    try {
                        var loading = "<a class='loading-ico flash-loading' href='javascript:;' id='loadingF" + id + "'></a>";
                        $parent.append(loading);
                        var xmlhttp = new XMLHttpRequest();
                        var url = $parent.find("div").first().find("a").first().attr("href");
                        if (!chouti.isVideoUrl(url)) {
                            url = flashUrl;
                        }
                        url = "http://" + window.location.host + "/link/videoinfo.do?url=" + encodeURIComponent(url) + "&t=" + Math.random();
                        xmlhttp.onreadystatechange = function(){
                            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                $("#loadingF" + id).remove();
                                var json = "";
                                var img = "";
                                var video = "";
                                try {
                                    json = eval("(" + xmlhttp.responseText + ")");
                                    video = json.data.videoUrlArray[0];
                                    img = json.data.imgUrl;
                                } 
                                catch (e) {
                                    $("#loadingF" + id).remove();
                                }
                                if (video.length > 0) {
                                    //添加视频
                                    if (!($("#videoBox" + id).length > 0)) {
                                        var str = "<div class='video-box' id='videoBox" + id + "'>";
                                        str += "<video controls='controls' width='450' height='366' >";
                                        str += "<source src='" + video + "'/>";
                                        str += "</video>";
                                        str += "</div>";
                                        
                                        $parent.append(str);
                                        
                                        $("#videoBox" + id).show();
                                        
                                        $spaniCon.removeClass("vidio-s").addClass("vidio-e");
                                        
                                        $("#vidio-a-" + id).attr("title", "收起视频");
                                    }
                                }
                                else {
                                    alert("此站点不支持ios设备");
                                }
                            }
                            else 
                                if (xmlhttp.status >= 400) {
                                    $("#loadingF" + id).remove();
                                    alert("此站点不支持ios设备");
                                }
                        }
                        xmlhttp.open("GET", url, true);
                        xmlhttp.send();
                        return;
                    } 
                    catch (e) {
                        $("#loadingF" + id).remove();
                        alert("此站点不支持ios设备");
                    }
                }
                else {
                    chouti.requestFlashUrl(id, $parent, $spaniCon, flashUrl);
                }
            })
            
        },
        
        //隐藏视频
        hidePlayVido: function(id){
        
            var $vidioA = $("#vidio-a-" + id);
            
            var $spaniCon = $vidioA.find("span");
            
            $spaniCon.removeClass("vidio-e").addClass("vidio-s");
            
            $("#videoBox" + id).remove();
            //$("#loadingF"+id).remove();
            
            $vidioA.attr("title", "展开视频");
            
        },
        //请求flash视频地址
        
        requestFlashUrl: function(id, $parent, $spaniCon, flashUrl){
        
            //添加视频
            var str = "<div class='video-box' id='videoBox" + id + "'>";
            
            str += "<object width='450' height='366' codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,29,0' classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' name='FlashObj" + id + "' id='FlashObj" + id + "'>";
            str += "<param value='" + flashUrl + "' name='movie'>";
            str += "<param value='high' name='quality'>";
            str += "<param value='always' name='allowscriptaccess'>";
            str += "<param value='Opaque' name='wmode'>";
            str += "<param value='true' name='allowfullscreen'>";
            str += "<embed width='450' height='366' src='" + flashUrl + "' quality='high' pluginspage='http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash' type='application/x-shockwave-flash' wmode='Opaque' allowscriptaccess='always' allowfullscreen='true' name='FlashObj" + id + "'>";
            str += "</object>";
            
            str += "</div>";
            
            $parent.append(str);
            
            $("#videoBox" + id).show();
            
            $spaniCon.removeClass("vidio-s") //变换图标
.addClass("vidio-e");
            
            $("#vidio-a-" + id).attr("title", "收起视频");
            
            //$("#loadingF"+id).remove();
        
        
        },
        //添加私藏
        addCollect: function(){
        
            $("a.collect-a").unbind().bind("click", function(e){
            
                var $obj = $(this);
                
                var id = $obj.attr("lang");
                
                var submitUrl = "/link/self/add?" +
                G.param({
                    linksId: id
                });
                
                var $pare = $obj.parent().parent().parent();
                
                var options = {
                    url: submitUrl,
                    type: "GET",
                    //当服务器出现错误时处理方法
                    error: function(xmlHttp, textStatus){
                    
                        textStatus = textStatus.toLowerCase();
                        
                        if (textStatus === "error") {
                        
                            var status = xmlHttp.status.toString().substring(0, 1);
                            if (status === "5") {
                                L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[status]);
                            }
                            
                            return;
                        }
                        
                    },
                    success: function(info){
                    
                        if (info.code == ResultCodeSuccess) {
                        
                            //part2的padding-top的距离
                            var ju = parseInt($($obj).parent().css("padding-top").replace("px", ""));
                            
                            /*显示添加私藏成功的动画*/
                            var $span = $("<img>", {
                            
                                "src": "/images/add-save.gif?v=2.13" //加上随机码，是因为在有的浏览器下gif动画图片直接从缓存中加的，总是显示最后一张图片。
                            }).css({
                                "top": parseInt($($obj).parent().position().top + ju - 25) + "px",
                                "left": parseInt($($obj).position().left - 9) + "px"
                            }).addClass("add-coll-img").appendTo($pare);
                            
                            //向上移动动画									 
                            $span.animate({
                                "top": "-=" + 10
                            }, 400, function(){
                            
                            });
                            //停留一会自动消失
                            window.setTimeout(function(){
                                $span.remove()
                            }, 800);
                            
                            //-------------------------------------
                            
                            var destjid = $obj.attr("destjid");
                            var jid = $obj.attr("jid");
                            
                            //添加私藏按钮变成移出私藏按钮
                            var siBtn = "<a href='javascript:;' class='remove-col-a' id='collect-a-" + id + "' lang='" + id + "' title='移出私藏' destjid='" + destjid + "' jid='" + jid + "'><span class='hand-icon icon-collect collect-actived'></span><b>私藏</b></a>";
                            $obj.before(siBtn);
                            $obj.remove();
                            
                            $("#shu_collect").html(info.data)//用户总的私藏数	
                            chouti.removeCollect(); //赋与移出事件
                            //执行登录前点击的的提交动作后的提示信息
                            chouti.executeBeforOprate(true);
                            
                        }
                        else {
                        
                            //没有登录
                            if (!chouti.reponseNoLogin(info.code, info.message, "添加收藏已成功")) {
                                return false;
                            }
                            
                            L.showTopTips(L.TIPS_TYPE.error, info.message);
                            
                            return;
                        }
                    }
                };
                
                //把要提交的动作保存下来
                $("#isAjax").data("ajax", options);
                
                L.ajax(options);
                
                return false;
            })
        },
        
        //移出私藏, a.remove-col-a 表示操作按钮中的移出，a.del-coll-btn 个人私藏页面如果新闻被删除，右上角的删除
        removeCollect: function(){
        
            $("a.remove-col-a, a.del-coll-btn").unbind().bind("click", function(e){
            
                var $obj = $(this);
                
                var id = $obj.attr("lang");
                
                var submitUrl = "/link/self/del?" +
                G.param({
                    linksId: id
                });
                
                var $pare = $obj.parent().parent().parent();
                
                var options = {
                    url: submitUrl,
                    type: "GET",
                    //当服务器出现错误时处理方法
                    error: function(xmlHttp, textStatus){
                    
                        textStatus = textStatus.toLowerCase();
                        
                        if (textStatus === "error") {
                        
                            var status = xmlHttp.status.toString().substring(0, 1);
                            if (status === "5") {
                                L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[status]);
                            }
                            
                            return;
                        }
                        
                    },
                    success: function(info){
                    
                        if (info.code == ResultCodeSuccess) {
                        
                            var destjid = $obj.attr("destjid");
                            var jid = $obj.attr("jid");
                            
                            var ju = parseInt($($obj).parent().css("padding-top").replace("px", ""));
                            
                            if ($obj.hasClass("remove-col-a")) {
                            
                                /*显示移除私藏成功的动画*/
                                var $span = $("<img>", {
                                
                                    "src": "/images/del-save.gif?v=2.13"
                                }).css({
                                    "top": parseInt($($obj).parent().position().top + ju - 25) + "px",
                                    "left": parseInt($($obj).position().left - 9) + "px"
                                }).addClass("mov-coll-img").appendTo($pare);
                                
                                //向上移动动画
                                $span.animate({
                                    "top": "-=" + 10
                                }, 400, function(){
                                
                                });
                                
                                //停留一会自动消失
                                window.setTimeout(function(){
                                    $span.remove()
                                }, 900);
                                
                                //---------------------------------
                                
                                //移出私藏按钮变成添加私藏按钮
                                
                                var siBtn = "<a href='javascript:;' class='collect-a' id='collect-a-" + id + "' lang='" + id + "' title='加入私藏' destjid='" + destjid + "' jid='" + jid + "'><span class='hand-icon icon-collect'></span><b>私藏</b></a>";
                                $obj.before(siBtn);
                                $obj.remove();
                            }
                            //在个人私藏页面，如果某条新闻已经删除，则该条私藏可以移出
                            if ($obj.hasClass("del-coll-btn")) {
                            
                                $obj.parent().slideUp("400").remove();
                            }
                            
                            $("#shu_collect").html(info.data)//用户总的私藏数	
                            $(".show-items #person_collect_count").html(info.data);
                            
                            chouti.addCollect(); //赋与添加事件
                            //执行登录前点击的的提交动作后的提示信息
                            chouti.executeBeforOprate(true);
                            
                        }
                        else {
                        
                            //没有登录
                            if (!chouti.reponseNoLogin(info.code, info.message, "移出收藏已成功")) {
                                return false;
                            }
                            
                            //$obj.children("span").removeClass("collect-actived");
                            
                            L.showTopTips(L.TIPS_TYPE.error, info.message);
                            
                            
                            
                            return;
                        }
                    }
                };
                
                //把要提交的动作保存下来
                $("#isAjax").data("ajax", options);
                
                L.ajax(options);
                
                return false;
            })
        },
        //点击推荐按钮时
        
        vote: function(ch){
        
            $("a.digg-a").unbind().bind("click", function(e){
            
                var $obj = $(this);
                
                //当点击后锁定该按钮，只有当返回结果时才解锁
                $obj.hide();
                
                var $part = $obj.parent();
                
                var tempid = $obj.children("b").html();
                
                var temp_digg_a = "<span class='digg-a' href='javascript:;' id='temp-a'><span class='hand-icon icon-digg'></span><b class='green'>" + tempid + "</b><i style='display:none'></i></span>";
                
                $obj.before(temp_digg_a);
                //--------------------------------------
                
                var $pare = $obj.parent().parent().parent();
                
                var id = $obj.children("i").html();
                
                var submitUrl = "/link/vote?" +
                G.param({
                    linksId: id
                });
                
                var options = {
                    url: submitUrl,
                    type: "POST",
                    //当服务器出现错误时处理方法
                    error: function(xmlHttp, textStatus){
                    
                        textStatus = textStatus.toLowerCase();
                        
                        if (textStatus === "error") {
                        
                            var status = xmlHttp.status.toString().substring(0, 1);
                            if (status === "5") {
                                L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[status]);
                            }
                            
                            //解锁
                            $obj.css("display", "inline-block");
                            $("#temp-a").remove();
                            
                            return;
                        }
                        
                    },
                    success: function(info){
                        //alert(textStatus);
                        //解锁
                        $obj.css("display", "inline-block");
                        $("#temp-a").remove();
                        
                        if (info.code == ResultCodeSuccess) {
                        
                            //显示动画+1
                            chouti.showDiggMove($pare, e, $obj);
                            
                            //图标颜色充绿，且不能点击
                            $obj.children("span").addClass("vote-actived");
                            
                            $obj.children("b").html(info.data.lvCount)//链接的推荐数
.css("color", "#9add7f").unbind();
                            
                            var destjid = $("#i_destjid").html();
                            var jid = $("#i_jid").html();
                            
                            //只有自己的页面推荐总数才会发生变化，在别人的个人页面，destJid和jid是不一样的
                            //jid为别人的用户名
                            //援藏ovt
                            if (destjid == jid) {
                            
                                $("#shu_digg").html(info.data.uvCount)//用户总的推荐数										
                            }
                            //在自己的页面中destJid为当前登录用户名，jid=""，也让推荐数变化
                            if (jid == "") {
                            
                                $("#shu_digg").html(info.data.uvCount)//用户总的推荐数	
                            }
                            
                            //$obj.css("cursor", "default")
                            //	.unbind()
                            $obj.hover(function(){
                            
                                $obj.children("span").css("background-position", "0 -20px");
                                $obj.attr("title", "推荐");
                                
                            }, function(){
                            
                                $obj.children("span").css("background-position", "0 -20px");
                                $obj.attr("title", "推荐");
                                
                            }).addClass("isVoted").removeClass("digg-a").attr("title", "取消推荐").unbind();
                            
                            chouti.cancelVote();
                            
                            //执行登录前点击的的提交动作后的提示信息
                            chouti.executeBeforOprate(true);
                            
                        }
                        else {
                        
                            //没有登录
                            if (!chouti.reponseNoLogin(info.code, info.message, "推荐已成功")) {
                                return false;
                            }
                            
                            $obj.children("span").removeClass("vote-actived");
                            
                            //提示推荐失败
                            //chouti.showMsgPanel(info.message, $pare);
                            
                            L.showTopTips(L.TIPS_TYPE.error, info.message);
                            
                            //表示已经推荐过了
                            if (info.code == "30010" && $("#isAjax").val() == 1) {
                                window.location.reload();
                                $("#isAjax").val(0);
                            }
                            
                            return;
                        }
                    }
                };
                
                //把要提交的动作保存下来
                $("#isAjax").data("ajax", options);
                
                L.ajax(options);
                
                return false;
            })
            
        },
        
        //取消推荐
        cancelVote: function(ch){
        
            $("a.isVoted").unbind().bind("click", function(e){
            
                var $obj = $(this);
                
                //当点击后锁定该按钮，只有当返回结果时才解锁
                $obj.hide();
                
                var $part = $obj.parent();
                
                var tempid = $obj.children("b").html();
                
                var temp_digg_a = "<span class='digg-a' href='javascript:;' id='temp-a'><span class='hand-icon icon-digg'></span><b class='green'>" + tempid + "</b><i style='display:none'></i></span>";
                
                $obj.before(temp_digg_a);
                //--------------------------------------
                
                var $pare = $obj.parent().parent().parent();
                
                var id = $obj.children("i").html();
                
                var submitUrl = "/vote/cancel/vote.do";
                
                var options = {
                    url: submitUrl,
                    type: "POST",
                    data: G.param({
                        linksId: id
                    }),
                    //当服务器出现错误时处理方法
                    error: function(xmlHttp, textStatus){
                    
                        textStatus = textStatus.toLowerCase();
                        
                        if (textStatus === "error") {
                        
                            var status = xmlHttp.status.toString().substring(0, 1);
                            if (status === "5") {
                                L.showTopTips(L.TIPS_TYPE.error, i18n.common.httpError[status]);
                            }
                            
                            //解锁
                            $obj.css("display", "inline-block");
                            $("#temp-a").remove();
                            //
                            return;
                        }
                        
                    },
                    success: function(info){
                        //alert(textStatus);
                        //解锁
                        $obj.css("display", "inline-block");
                        $("#temp-a").remove();
                        
                        if (info.code == ResultCodeSuccess) {
                        
                            //显示动画-1
                            chouti.showLessMove($pare, e, $obj);
                            
                            //图标颜色充绿，且不能点击
                            $obj.children("span").removeClass("vote-actived");
                            
                            $obj.children("b").html(info.data.lvCount)//链接的推荐数
.css("color", "#99AECB");
                            
                            
                            var destjid = $("#i_destjid").html();
                            var jid = $("#i_jid").html();
                            
                            //只有自己的页面推荐总数才会发生变化，在别人的个人页面，destJid和jid是不一样的
                            //jid为别人的用户名
                            //援藏ovt
                            if (destjid == jid) {
                            
                                $("#shu_digg").html(info.data.uvCount)//用户总的推荐数										
                            }
                            //在自己的页面中destJid为当前登录用户名，jid=""，也让推荐数变化
                            if (jid == "") {
                            
                                $("#shu_digg").html(info.data.uvCount)//用户总的推荐数	
                            }
                            
                            //$obj.css("cursor", "default")
                            //	.unbind()
                            $obj.hover(function(){
                                //-93px
                                $obj.children("span").css("background-position", "0 0");
                                $obj.attr("title", "推荐");
                                
                            }, function(){
                                $obj.children("span").css("background-position", "0 -40px");
                                $obj.attr("title", "");
                                
                            }).removeClass("isVoted").addClass("digg-a").attr("title", "推荐").unbind();
                            
                            chouti.vote('');
                            
                            //执行登录前点击的的提交动作后的提示信息
                            chouti.executeBeforOprate(true);
                            
                        }
                        else {
                        
                            //没有登录
                            if (!chouti.reponseNoLogin(info.code, info.message, "取消推荐已成功")) {
                                return false;
                            }
                            
                            //$obj.children("span").removeClass("vote-actived");
                            
                            //提示推荐失败
                            //chouti.showMsgPanel(info.message, $pare);
                            
                            L.showTopTips(L.TIPS_TYPE.error, info.message);
                            
                            //表示已经推荐过了
                            if (info.code == "30010" && $("#isAjax").val() == 1) {
                                window.location.reload();
                                $("#isAjax").val(0);
                            }
                            
                            return;
                        }
                    }
                };
                
                //把要提交的动作保存下来
                $("#isAjax").data("ajax", options);
                
                L.ajax(options);
                
                return false;
            })
        },
        //e.stopPropagation();
        //执行登录前点击的的提交动作后的提示信息
        executeBeforOprate: function(ti){
        
            //执行登录前的提交动作成功后,提示成功信息
            var aj = $("#isAjax").val();
            if (aj == 1) {
            
                var msg = $("#login_ajaxInfo").val();
                if (ti && msg != 'share') {
                    L.showTopTips(L.TIPS_TYPE.success, msg);//提示成功信息
                }
                $("#isAjax").val(0);
                $("#login_ajaxInfo").val("");//提示信息
                $("#isAjax").data("ajax", null);
                window.location.reload();
            }
            //清空保存的option项（清空提交动作）
            $("#isAjax").data("ajax", null);
        },
        //当code == -1时，跳转到登录页面
        reponseNoLogin: function(code, msg, tipinfo){
        
            if (code == "-1" || code == "20006") { //统一为用户没有登录
                //显示登录框
                chouti.showLoginBox();
                
                //提示您需要先登录才能继续刚才的操作
                if (code == "20006") {
                    msg = "您需要先登录才能继续刚才的操作";
                }
                $("#login-wrong-info").html(msg); //在登录框中显示的错误信息
                $(".login-er-icon").css("display", "inline-block");
                
                //登录成功后执行先前的提交动作,标识为1表示要提交未交完成的动作
                $("#isAjax").val(1);
                //保存提示信息
                $("#login_ajaxInfo").val(tipinfo);
                
                return false;
            }
            return true;
        },
        //显示动画+1
        showDiggMove: function(objParent, e, $this){
        
            var $span = $("<span></span>", {
                "css": {
                    "font-weight": "bold",
                    "color": "#4fc416",
                    "font-size": "20px",
                    "position": "absolute",
                    "z-index": "6",
                    "left": "25px",
                    // "left": "88px",
                    "top": $($this).parent().position().top + "px"
                
                }
            }).text("+1").appendTo(objParent);
            
            //展示动画
            $span.animate({
                "top": "-=" + 70,
                "left": "+=" + 3,
                "font-size": 60,
                opacity: 0
            }, 600, function(){
                $span.remove();
            });
            
        },
        
        //显示动画-1
        showLessMove: function(objParent, e, $this){
        
            var $span = $("<span></span>", {
                "css": {
                    "font-weight": "bold",
                    "color": "#99AECB",
                    "font-size": "20px",
                    "position": "absolute",
                    "z-index": "6",
                    "left": "25px",
                    // "left": "88px",
                    "top": $($this).parent().position().top + "px"
                
                }
            }).text("-1").appendTo(objParent);
            
            //展示动画
            $span.animate({
                "top": "-=" + 70,
                "left": "+=" + 18,
                "font-size": 60,
                opacity: 0
            }, 600, function(){
                $span.remove();
            });
            
        },
        //点击推荐后显示错误消息黄色框
        showMsgPanel: function(info, objParent){
        
            //执行登录前的提交动作成功后,提示成功信息
            var aj = $("#isAjax").val();
            if (aj == 1) {
            
                var msg = $("#login_ajaxInfo").val();
                
                $("#isAjax").val(0);
                $("#login_ajaxInfo").val("");//提示信息
                $("#isAjax").data("ajax", null);
                window.location.reload();
                
                L.showTopTips(L.TIPS_TYPE.error, info);//提示失败信息
                return;
            }
            //-------------------------------------------
            
            var msg = $("<div class='yellow-msg-box corner' id='yellow-msg-box'></div>").html("<span>" + info + "</span>").css({
                "top": $(objParent).position().top + $(objParent).height() + 12
            }).appendTo("#content-list");
            
            /*
             .hover(function(){
             $(this).addClass("yellow-msg-box-hover");
             },function(){
             $(this).removeClass("yellow-msg-box-hover");
             });
             */
            //当在最后一条显示提示框时,显示在上面，如果显示在下面就会挡住(32为黄色框的高度)
            if ($(msg).position().top + 32 > $("#content-list").height()) {
                $(msg).css("top", $("#content-list").height() - 32)
            }
            
            //点击页面其它位置  和  点击关闭按钮时，黄色提示框自动消失(页面中推荐错误提示)
            $(".msg-close-a, body").click(function(){
                $(msg).hide().remove();
            })
            
            
            window.setTimeout(function(){
                $(msg).hide().remove();
            }, 3000)
            
        },
        //显示搜索框
        showSearchBox: function(){
        
            var str = "搜索关键字";
            
            
            $("#txtSearch2").focus(function(){
            
                //$(".nav-search-a").css("background-position", "0px -94px");
                $("#txtSearch2").css({
                    "background-color": "#fff"
                });
                //$("#searchBtn_3").css("background-position", "0px -152px");
                //$("#geSpan").css("color", "#ccc");
            
                //if($(this).val() == str) {
            
                //	$(this).val("");
            
                //}
            
            
            }).blur(function(){
            
                //$(".nav-search-a").css("background-position", "0px -64px");
                $("#txtSearch2").css({
                    "background-color": "#f4f4f4"
                });
                //$("#searchBtn_3").css("background-position", "0px -124px");
                //$("#geSpan").css("color", "#97a8bc");
            
                //if($(this).val() == "") {
            
                //	$(this).val(str);
            
                //}
            
            })
            
            /*
             .keydown(function(e){
             
             if (e.keyCode == 13){
             
             if($.trim($(this).val()) == "") {
             $(this).focus();
             return false;
             }
             
             }
             })
             */
            //触发点击事件
            $("#searchBtn_3").click(function(){
            
                var value = $.trim($("#txtSearch2").val());
                
                if (value == str || value == "") {
                
                    return;
                    
                }
                $("#searchFrm2").submit();
                return false;
            })
        },
        //清空编辑器
        //isEmpty
        clearEditorContent: function(){
        
            $("#clearFeedback").click(function(){
                ze.clear();
            })
            
        },
        //发布框中，点击文本框后清空里面的默认内容
        clickClear: function(){
        
            //段子输入框
            $("#txt-duanzi").bindTipsEvent();
            //谣言输入框
            $("#txt-yaoyan").bindTipsEvent();
            //资讯输入框
            $("#txt-zixun").bindTipsEvent();
            //图片输入框
            $("#txt-img").bindTipsEvent();
            //评论输入框
            $("#txt-comment").bindTipsEvent();
            
            
            //用户名输入框
            $("#reg_destJid").bindTipsEvent();
            //密码输入框
            $("#reg_password").bindTipsEvent();
            //确认密码输入框
            $("#reg_confirm_password").bindTipsEvent();
            //邮箱输入框
            $("#reg_secret_mail").bindTipsEvent();
            
            //手机号输入框
            $("#phoneCode").bindTipsEvent();
            //验证码输入框
            $("#verify_code").bindTipsEvent();
            //短信验证码输入框
            $("#sms_code").bindTipsEvent();
            //反馈输入框			
            $("#feedback_content").bindTipsEvent();
            //搜索输入框
            $("#txtSearch2").bindTipsEvent();
            
        },
        top10name: function(typename){
            $(".top-band-type em").html(typename);
        },
        //超出字数，闪烁提示
        shake: function(ele, cls, times){
        
            var i = 0, t = false, o = ele.attr("class") + " ", c = "", times = times || 2;
            if (t) 
                return;
            
            t = setInterval(function(){
                i++;
                c = i % 2 ? o + cls : o;
                ele.attr("class", c);
                if (i == 2 * times) {
                    clearInterval(t);
                    ele.removeClass(cls);
                }
            }, 200);
        },
        //首先判断是否超出字数，闪烁提示
        flashErrorTip: function(thisobj){
        
            var $moreNumeError = thisobj;
            
            if ($moreNumeError.css("display") == "block") {
            
                chouti.shake($moreNumeError, "flash", 3);
                
                return false;
            }
            
            return true;
        },
        //回到页面顶部事件
        showGoTop: function(){
        
            var mainContent = $(".main-content");
            
            if(mainContent.length <= 0) return;
            
            var left = parseInt(mainContent.outerWidth() + mainContent.offset().left + 20);
            
            var left2 = $("html").width();
            
            if (left2 < 1024) {
            
                left = left2 - 300;
            }
            var topBtn = "<a href='javascript:;' title='回到顶部' class='icon-main' id='gotop' style='left:" + left + "px'></a>";
            
            $("body").append(topBtn);
            
            //点击回到顶部
            $("#gotop").click(function(){
            
                //$(window).scrollTop(0);
                
                $("body,html").animate({
                    scrollTop: 0
                }, 200);
                
                
            })
            
            //监听回到顶部按钮，如果滚动条偏移位置大于0时，则出现该按钮，==0时隐藏
            $(window).scroll(function(){
            
                var $scrollTop = $(window).scrollTop();
                
                if ($(window).scrollTop() > 0) {
                
                    $("#gotop").css("display", "block");
                    
                }
                else 
                    if ($(window).scrollTop() <= 0) {
                    
                        $("#gotop").hide()
                    }
                
                
            })
            
            
        },
        
        isEmail: function(s){
            if (/^[_a-zA-Z0-9.]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/.test(s)) {
                return true;
            }
            return false;
        },
        //个人头像上传成功及失败
        Head_Pic_Rece_URL_info: function(str, swfId){
        
            if (str == "IOError") {
                L.showTopTips(L.TIPS_TYPE.error, "图片上传失败，请稍候再试"); //提示推荐成功
                return;
            }
            else {
            
                var p1 = str.lastIndexOf(".");
                str = str.substring(0, p1) + "=48x48." + str.substring(p1 + 1);
                
                $(".my-photo #personImgUrl").attr("src", str); //把图片的url地址付给图片src
                $("#hidImgUrl").val(str);
                //L.showTopTips(L.TIPS_TYPE.success, "图像上传成功");	//提示推荐成功
                Head_Pic_Cancel();
            }
        },
        //关闭上传头像框
        Head_Pic_Cancel_info: function(){
        
            //隐藏发布框
            $("#H-avaupload-dialog").hide();
            $("#mask").hide().remove();
            /*
             $("#mask").fadeOut("500",function(){
             //移除meng板
             $("#mask").remove();
             });
             */
        },
        
        
        //鼠标移动到上面时显示背景色蓝色
        hoverItems: function(){
            $(".list-item").hover(function(){
            
                $(this).data("backColor", $(this).css("background-color"));
                $(this).css({
                    "backgroundColor": "#e9f0f8"
                });
                
            }, function(){
                var bkColor = $(this).data("backColor");
                $(this).css("background-color", bkColor);
            })
        },
        
        /*后台管理*/
        //显示删除弹出框
        showDelDialog: function(){
        
            $("#del_a").click(function(){
            
                chouti.showMask("#del-dialog", ""); //显示meng板
                $("#mask").fadeIn("500", function(){
                    $("#del-dialog").show(); //显示登录框									
                });
                
                
            })
        },
        
        //根据 Agent 判断是否是手机操作
        checkserAgent: function(){
        
            var userAgentInfo = navigator.userAgent;
            
            var userAgentKeywords = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod", "MQQBrowser");
            
            var flag = false;
            
            //排除windows系统   苹果系统     Linux系统  Macintosh
            
            if (userAgentInfo.indexOf("Windows NT") < 0 || userAgentInfo.indexOf("Macintosh") < 0 || userAgentInfo.indexOf("Mac OS") < 0 || ((userAgentInfo.indexOf("Linux") < 0) && (userAgentInfo.indexOf("Android") < 0))) {
            
                for (var i = 0; i < userAgentKeywords.length; i++) {
                
                    if (userAgentInfo.indexOf(userAgentKeywords[i]) >= 0) {
                        flag = true;
                    }
                }
                
                
            }
            
            return flag;
        },
        
        //首先判断是否是移动设备（函数checkserAgent），如果是则用这个函数  用JS实现聊天窗口
        showChatSwf: function(parentdiv, loginid, loginuser, imgurl){
        
            var zhb = new JsMucChat(parentdiv, loginid, loginuser, imgurl);
            if($('.isBan').val() == '0') {
               banChat();
            }
        },
        
        //实现图片的实时加载（只加载在可视区哉内的图片）
        lazyLoadImg: function($this){
        
            $($this).lazyload({
                placeholder: "/images/bai.png",
                effect: "show"
            })
        },
        
        initImgClickEvent: function(){
            try {
                $("img.big-img-load").remove();
                $("img.big-img").remove();
                $(window).unbind("click");
            } 
            catch (err) {
            
            }
            var $img = $("#content-list .item .news-pic img");
            $img.click(function(){
                chouti.showBigImg($(this));
                return false;
            });
            $img.hover(function(){
                var prefix = chouti.prefix();
                if (prefix != null) {
                    var cursor = "-" + prefix + "-zoom-in";
                    $(this).css("cursor", cursor);
                }
                else {
                    $(this).css("cursor", "url(/images/cursor/zoom_in.cur),auto");
                }
            });
        },
        prefix: function(){
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf("webkit") >= 0) {
                return "webkit";
            }
            else 
                if (ua.indexOf("firefox") >= 0) {
                    return "moz";
                }
                else 
                    if (ua.indexOf("opera") >= 0) {
                        return "o";
                    }
        },
        showBigImg: function($img){
            var id = $img.attr("lang") + "";
            try {
                $("img.big-img[id!=bigImg" + id + "]").animate({
                    "width": "60px",
                    "height": "60px"
                }, function(){
                    $(this).remove();
                });
                $("img.big-img-load[id!=bigImgLoading" + id + "]").remove();
            } 
            catch (err) {
            
            }
            if ($("#bigImg" + id).length > 0) {
                return;
            }
            var imgUrl = $img.attr("original") + "";
            bigImgUrl = imgUrl.substring(0, imgUrl.lastIndexOf("=")) + "=C200x200" + imgUrl.substring(imgUrl.lastIndexOf("."), imgUrl.length);
            var str = "<img class='big-img' id='bigImg" + id + "' width='200px' height='200px' src='" + imgUrl + "' alt='买买君热榜' />"
            $(document.body).append(str);
            var $bigImg = $("#bigImg" + id);
            docWidth = document.documentElement.clientWidth ||
            document.body.clientWidth ||
            window.innerWidth;
            $bigImg.hover(function(){
                var prefix = chouti.prefix();
                if (prefix != null) {
                    var cursor = "-" + prefix + "-zoom-out";
                    $(this).css("cursor", cursor);
                }
                else {
                    $(this).css("cursor", "url(/images/cursor/zoom_out.cur),auto");
                }
            });
            $bigImg.css({
                "position": "absolute",
                "top": ($img.offset().top) + "px",
                "right": (docWidth - $img.offset().left - 64) + "px",
                "z-index": 2,
                "background-color": "#fff",
                "border": "1px solid #ccc",
                "padding": "1px",
                "vertical-align": "top"
            });
            $bigImg.css({
                "width": "60px",
                "height": "60px"
            });
            var bigImgOb = new Image();
            bigImgOb.src = bigImgUrl;
            if (bigImgOb.width > 0) {
                $bigImg.attr("src", bigImgUrl);
            }
            $bigImg.animate({
                "width": "200px",
                "height": "200px"
            }, function(){
                if (bigImgOb.width > 0) {
                    $bigImg.attr("src", bigImgUrl);
                }
                else {
                    var str = "<img class='big-img-load' id='bigImgLoading" + id + "' width='16px' height='16px' src='/images/loading.gif'/>";
                    $(document.body).append(str);
                    $("#bigImgLoading" + id).css({
                        "position": "absolute",
                        "top": ($img.offset().top + 92) + "px",
                        "right": (docWidth - $img.offset().left - 64 + 92) + "px",
                        "z-index": 3
                    });
                    bigImgOb.onload = function(){
                        $("#bigImgLoading" + id).remove();
                        $bigImg.attr("src", bigImgUrl);
                    };
                }
            });
            $(document).click(function(id){
                $bigImg.animate({
                    "width": "60px",
                    "height": "60px"
                }, function(){
                    $("#bigImgLoading" + id).remove();
                    $bigImg.remove();
                    var $img = $("#content-list .item .news-pic img");
                    var prefix = chouti.prefix();
                    if (prefix != null) {
                        var cursor = "-" + prefix + "-zoom-out";
                        $img.css("cursor", cursor);
                    }
                    else {
                        $img.css("cursor", "url(/images/cursor/zoom_out.cur),pointer");
                    }
                    
                });
            });
        },
        
        ////////////////////////////////////////////////
        //举报
        oprateJuBao: function(){
        
            $("a.jubao").unbind().click(function(){
                       
                var $this = $(this);
                
                //判断用户是否登录
                
                var id = $this.attr("lang");
                
                var goJubao = chouti.checkLogin($this, id);
                
                if (!goJubao) {
                    return;
                }
                
                //显示举报原因弹出框
                chouti.showJubaoDialog($this, id);
                               
            })
            
        },
        
        checkLogin: function($this, id){
        
            var submitUrl = "/link/share";
            
            L.ajax({
                url: submitUrl,
                success: function(info){
                
                    var code = info.code;
                    
                    if (code == "9999") {
                    
                        chouti.showJubaoDialog($this, id);
                        
                    }
                    else {
                    
                        var msg = info.message;
                        
                        //用户没有登录，则弹出登录框
                        
                        if (code == "-1" || code == "20006") {
                        
                            chouti.showLoginBox();
                            return;
                            
                        }
                        else {
                        
                            L.showTopTips(L.TIPS_TYPE.error, msg);//提示失败信息
                            return false;
                        }
                        
                    }
                }
            })
            
        },
        
        /*控制用户频繁举报，10秒以后才能再次举报*/
        //保存第一次点击的时间
        repeatJubao: function(){
        
            var jubaoTimeStr = $("#hidJubaoTime").val();
            
            jubaoTime1 = new Date().getTime();
            
            if (jubaoTimeStr == "") {
            
                $("#hidJubaoTime").val(jubaoTime1);
                return true;
                
            }
            else {
            
                var timeOff = parseInt((jubaoTime1 - jubaoTimeStr) / 1000);
                
                if (timeOff <= 10) {
                
                    L.showTopTips(L.TIPS_TYPE.error, "您举报过于频繁，请稍候重新举报");
                    return false;
                    
                }
                else {
                
                    $("#hidJubaoTime").val(jubaoTime1);
                    return true;
                }
                
            }
            
        },
        //关闭对话框
        closeJubaoBox: function(){
        
            $("#Jubao-dialog").hide();
            $("#mask").hide().remove();
            $("#chatIframe").css({
                "height": "475px",
                "width": "300px"
            });
            
        },
        
        //显示出评论原因弹出框
        showJubaoDialog: function($this, id){
        
            if ($("#Jubao-dialog").length <= 0) {
            
                $("#footer-band").append($("#jubao-dialog-code").html());
                
            }
            
            chouti.showMask("#Jubao-dialog", "top"); //显示meng板
            var offsetH = $this.offset().top - $("#Jubao-dialog").height() / 2;
            
            if (offsetH <= 0) {
                offsetH = 30;
            }
            
            $("#mask").show();
            $("#Jubao-dialog").show()//显示对话框
.css("top", offsetH + "px");
            
            $("#chatIframe").css({
                "height": "0px",
                "width": "0px"
            });
            
            //关闭对话框
            $("#dialog-jubao-close, #clear-btn-jubao").click(function(){
            
                chouti.closeJubaoBox();
                
            })
            
            //还原原始值
            $(":radio:first[name=radio_bad]").attr("checked", "checked");
            $("#trJubao").hide();
            qita = 1;
            $("#otherReson").val("");
            
            
            //点击其它单选框，显出出文本输入框
            $(":radio[name=radio_bad]").click(function(){
            
                if ($(this).attr("id") == "qita") {
                
                    $("#trJubao").show();
                    $("#otherReson").focus();
                    qita = 0;
                    
                }
                else {
                
                    $("#trJubao").hide();
                    qita = 1;
                }
            })
            
            //关闭举报原因弹出框
            chouti.clsJubaoResBox($this, id);
            
        },
        
        //提交举报
        submitJubaoInfo: function(id, $this){
        
            var submitUrl = "/comments/report";
            
            L.ajax({
                url: submitUrl,
                type: "POST",
                data: G.param({
                    id: id
                }),
                success: function(info){
                
                    var code = info.code;
                    
                    if (code == "9999") {
                    
                        //关闭举报原因弹出框
                        chouti.closeJubaoBox();
                        
                        L.showTopTips(L.TIPS_TYPE.success, "举报成功");
                        
                        
                        //改变成已经点击过的样式且不能点击
                        
                        $($this).css({
                            "cursor": "default",
                            "color": "#B4B4B4",
                            "text-decoration": "none"
                        }).unbind();
                        
                        $($this).hover(function(){
                            $(this).css("text-decoration", "none");
                        })
                        
                        
                    }
                    else {
                        var msg = info.message;
                        L.showTopTips(L.TIPS_TYPE.error, msg);//提示失败信息
                        return false;
                        
                        
                        
                    }
                }
            })
        },
        
        //举报原因不作记录，所以只是关闭举报原因弹出框
        clsJubaoResBox: function($this, id){
        
            $("#sendJubaoBtn").unbind().click(function(){
            
                //如果文本输入框为空，则不能提交
                
                var otherReson = $.trim($("#otherReson").val()); //取得其它输入框输入内容
                if (qita == 0 && otherReson == "") {
                
                    $("#otherReson").focus();
                    return;
                }
                
                //10秒以后才能再次举报
                /*
                 if(!chouti.repeatJubao()) {
                 return;
                 }
                 */
                chouti.submitJubaoInfo(id, $this);
                
                
            })
            
        },
        //点击页面顶部的用户昵称打开操作框
        showUserOprBox: function(){
        
            $("#loginUserNc").hover(function(){
            
                var $userBox = $("#userOprBox");
                
                var left = $(".key-sera").offset().left;
                //104
                left = left - 118;
                //var mainContent = $(".main-content");			
                //var left = parseInt(mainContent.outerWidth() + mainContent.offset().left);
                
                //left = left - $userBox.width();				
                
                //var left = $(this).offset().left;
                $userBox.css("left", left + "px").show();
                
                //chouti.chatMskIframe("show", "#userOprBox", left);				
                
                $("#user_notice_page").hide(); //同时隐藏掉通知弹出框
                //点击页面其它地方则隐藏操作框
                //chouti.listerDocu("#userOprBox", "loginUserNc", left);
            }, function(){
            
                $userBox.hide();
                
            })
            
            var $userBox = $("#userOprBox");
            
            
            $userBox.hover(function(){
            
                $userBox.show();
                
            }, function(){
            
                $userBox.hide();
                
                //chouti.chatMskIframe("hide", "#userOprBox");
            })
        },
        //悬浮广告位置
        changeAdPositon: function(ua, $ad, $adTop){
        
            var $windTop = $(window).scrollTop();
            
            if ($windTop > $adTop) {
            
                $ad.addClass("advertIframe");
                
                var manConWidth = $(".content-R").offset().left - document.body.scrollLeft;
                
                var userAgentInfo = navigator.userAgent.toLowerCase();
                
                if (userAgentInfo.indexOf("firefox") > 0) {
                
                    var manConWidth = $(".content-R").offset().left - document.documentElement.scrollLeft;
                }
                
                if ("\v" == "v") { //IE
                    //alert(888);
                    var manConWidth = $(".content-R").offset().left - document.documentElement.scrollLeft;
                }
                
                /*
                 if($.browser.msie && $.browser.version == '6.0'){
                 
                 var manConWidth = $(".content-R").offset().left;
                 
                 }
                 */
                $ad.css("left", manConWidth + "px");
                
                
                
            }
            else {
            
                $ad.removeClass("advertIframe");
                
            }
        },
        
      //计算用户昵称长度(5个汉字或10个字符)
		subNickLength: function(str, countsum) {
			
				var len = 0, subtr = "", result = 0, strs = str;
				
				str = str.split("");
				
		        for ( var i = 0; i < str.length; i++) {
		        	
		        		if(result <= 4) {
		        			
		        			subtr += str[i];
		        			
		        		} else {
		        			subtr += "...";
		        			break;
		        		}
		        			        	
		                var c = strs.charCodeAt(i);
		                		                
		                //单字节加1   
		                if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
		                        len++;
		                } else {
		                        len += 2;
		                }
		                		               
		                result = parseInt(len /2 );
				        var mod = len%2;
				        
				        if (mod != 0) {
				                result += 1;
				        }		
				       	       		                
		        }
		        
		     return subtr;												
			
		},
		
		//拉黑
		lahei:function () {
			
			$("#laHeiBtn").unbind().click(function(){
				
				var otherNick = $(this).attr("otherNick");
				
				if(!confirm("确定把"+otherNick+"拉入黑名单吗？")){
					return;
				}
				
				var submitUrl = "/letter/add/blacklist.do";
				
				var otherJid = $(this).attr("otherJid");
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({jid: otherJid}),
					success :  function(info){
						
						if(info.code == ResultCodeSuccess) {
							
							L.showTopTips(L.TIPS_TYPE.success,  "拉黑成功");
							
							var str1 = "<span class='removeLahe'><span class='heimdan'></span>已加入黑名单</span><a href='javascript:;' id='laHeiRemoveBtn' otherJid='"+otherJid+"' otherNick='"+otherNick+"'>解除</a>";
							
							$("#laheiBox").html(str1);
							
							chouti.laHeiRemove();
							
						} else {
							
							L.showTopTips(L.TIPS_TYPE.error, info.message);
							
							return;
						}
					}
				})
				
				})
				
		},
		
		//解除拉黑
		laHeiRemove:function () {
			
			$("#laHeiRemoveBtn").unbind().click(function(){
							
				var submitUrl = "/letter/del/blacklist.do";
				
				var otherJid = $(this).attr("otherJid");
				var otherNick = $(this).attr("otherNick");
				
				L.ajax({
					url : submitUrl,
					type:"POST",
					data:G.param({jid: otherJid}),
					success :  function(info){
						
						if(info.code == ResultCodeSuccess) {
							
							L.showTopTips(L.TIPS_TYPE.success,  "解除成功");
							
							var str1 = "<a href='javascript:;' id='laHeiBtn' otherJid='"+otherJid+"' otherNick='"+otherNick+"'><span class='heimdan'></span>拉入黑名单</a>";
							
							$("#laheiBox").html(str1);
							
							chouti.lahei();
							
						} else {
							
							L.showTopTips(L.TIPS_TYPE.error, info.message);
							
							return;
						}
					}
				})
				
				})
				
		},
		
        //当滚 动到广告所在位置时，滚动窗口固定广告位置
        fixedAdvert: function(){
        
            var ua = navigator.userAgent.toLowerCase();
            var $ad = $("#advertIframe");
            
            //有的页面没有广告
            if ($ad.length <= 0) {
                return;
            }
            var $adTop = $ad.offset().top; //广告距页面顶部的偏移值	
            $(window).scroll(function(){
            
                chouti.changeAdPositon(ua, $ad, $adTop);
                
            })
            
            
            $(window).resize(function(){
            
                chouti.changeAdPositon(ua, $ad, $adTop);
                
            })
            
        }
    }
    
})(jQuery);
