/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.topic;

import java.net.URL;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.servlet.ModelAndView;

import com.mmj.app.biz.cons.CollectTypeEnum;
import com.mmj.app.biz.cons.DBSortTypeEnum;
import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.cons.SubjectEnum;
import com.mmj.app.biz.cons.TabTypeEnum;
import com.mmj.app.biz.cons.TopicOrderEnum;
import com.mmj.app.biz.cons.TopicOrderTimeEnum;
import com.mmj.app.biz.domain.CollectDO;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.CollectQuery;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;
import com.mmj.app.common.util.DateViewTools;
import com.mmj.app.common.util.NumberParser;
import com.mmj.app.common.util.SpiderHtmlUtils;
import com.mmj.app.common.util.StringFormatter;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.tools.WebUserTools;
import com.mmj.app.web.vo.CatchVO;
import com.mmj.app.web.vo.VoteVO;

/**
 * @author zxc Nov 26, 2014 11:38:09 AM
 */
@Controller
public class TopicController extends BaseController {

    // /hot/json
    // {"result":{"code":"9999", "message":"", "data":{"page":1,"items":25,"dataList":
    @RequestMapping(value = "/hot/json")
    public ModelAndView hotJson() {
        TopicQuery query = new TopicQuery(new TopicDO());
        query.setNowPageIndex(0);

        query.setSortType(DBSortTypeEnum.GMT_MODIFIED.name);
        PaginationList<TopicDO> list = topicService.listPagination(query);
        initUserInfo4List(list);

        StringBuffer sf = new StringBuffer();
        for (TopicDO topic : list) {
            Long id = topic.getId();
            String img = topic.getImgUrl();
            if (StringUtils.isEmpty(img)) {
                img = "/images/meiyoupeitu.png";
            }
            String url = topic.getOriginalUrl();
            String _content = topic.getContent();
            if (StringUtils.isEmpty(_content)) {
                _content = "";
            }
            String content = "<div class=\"item\"><div class=\"timeIntoPool\">"
                             + topic.getGmtCreate().getTime()
                             + "000,"
                             + topic.getGmtModified().getTime()
                             + "000</div>"
                             + "<div class=\"news-pic\"><img lang=\""
                             + id
                             + "\" original=\"http://www.maimaijun.com"
                             + img
                             + "\" "
                             + "src=\"http://www.maimaijun.com"
                             + img
                             + "\" alt=\"买买君热榜\" /></div>"
                             + "<div class=\"null-item\"></div><div class=\"news-content\"><div class=\"part1\"><a href=\"/link/"
                             + id
                             + "\" class=\"a-hidden\">comment detail page</a>"
                             + "<a href=\""
                             + url
                             + "\" class=\"show-content\" target=\"_blank\" onmousedown=\"linksClickStat("
                             + id
                             + ");\">"
                             + topic.getTitle()
                             + "</a><span class=\"content-source\">-"
                             + topic.getContentSource()
                             + "</span><a href=\"/r/news/hot/1\" class=\"n2\"><span class=\"content-kind\">"
                             + topic.getSubjectDesc()
                             + "</span></a></div><div class=\"area-summary\"><span class=\"summary\">"
                             + _content
                             + "</span></div>"
                             + "<div class=\"part2\" share-pic=\"http://www.maimaijun.com"
                             + img
                             + "\" share-title=\""
                             + topic.getTitle()
                             + "\" "
                             + "share-summary=\"\" share-linkid=\""
                             + id
                             + "\"><a href=\"javascript:;\" class=\"digg-a\" title=\"推荐\">"
                             + "<span class=\"hand-icon icon-digg\"></span><b>"
                             + topic.getRecommend()
                             + "</b><i style=\"display:none\">"
                             + id
                             + "</i></a>"
                             + "<a href=\"javascript:;\" class=\"discus-a\" id=\"discus-a-"
                             + id
                             + "\" lang=\""
                             + id
                             + "\">"
                             + "<span class=\"hand-icon icon-discus\"></span><b>0</b></a><a href=\"javascript:;\" class=\"collect-a\" id=\"collect-a-"
                             + id
                             + "\" lang=\""
                             + id
                             + "\" "
                             + "title=\"加入私藏\" destjid=\"null\" jid=\""
                             + topic.getName()
                             + "\"><span class=\"hand-icon icon-collect\"></span><b>私藏</b></a>"
                             + "<a href=\"/user/"
                             + topic.getName()
                             + "/publish/1\" class=\"user-a\"><span>"
                             + "<img src=\"http://www.maimaijun.com"
                             + topic.getNickImgurl()
                             + "\" /></span><b>"
                             + topic.getNick()
                             + "</b></a>"
                             + "<span class=\"left time-into\"><a class=\"time-a\" href=\"/link/"
                             + id
                             + "\" target=\"_blank\"><b>"
                             + topic.getPublishTime()
                             + "</b></a><i>入热榜</i></span></div>"
                             + "<div class=\"comment-box-area\" id=\"comment-box-area-"
                             + id
                             + "\"><div class=\"pinglun arrow\" id=\"comt-arrow-"
                             + id
                             + "\"></div>"
                             + "<a class=\"pinglun close-comt\" title=\"关闭\" href=\"javascript:;\"  lang=\""
                             + id
                             + "\"></a>"
                             + "<div class=\"corner comment-box\" id=\"comment-box-"
                             + id
                             + "\"><div class=\"loading-ico loading-ico-top\" id='loading-comment-top-"
                             + id
                             + "' "
                             + "style=\"margin-left:200px;\">加载中，请稍候...</div><div class=\"comment-box-top\" id=\"comment-box-top-"
                             + id
                             + "\">"
                             + "<div class=\"tip-1\">最热评论(<span id=\"newestCount-"
                             + id
                             + "\">3</span>)</div><div class=\"tip-2\">"
                             + "<a href=\"/link/6590136\" target=\"_blank\"><em class=\"pinglun em1\"></em><span>去评论页面</span></a></div></div>"
                             + "<ul class=\"filetree comment-list-top-2\" id=\"comment-list-top-"
                             + id
                             + "\"></ul>"
                             + "<!-- <div id=\"more-comt-"
                             + id
                             + "\" class=\"more-comt-btn\"><a href=\"/link/"
                             + id
                             + "\" target=\"_blank\" lang=\""
                             + id
                             + "\">查看其余 <span class=\"m-comt\">1</span> 条评论<span class=\"CH\">>></span></a></div> -->"
                             + "<div class=\"huifu-top-box\" id=\"huifu-top-box-"
                             + id
                             + "\">"
                             + "<div class=\"box-l txt-input-area-div-top corner no-corner-bottom\">"
                             + "<div id=\"lab-comment-top-"
                             + id
                             + "\" class=\"lab-comment-top\">回复  <span id=\"nick--"
                             + id
                             + "\"></span>:</div><textarea lang=\""
                             + id
                             + "\" maxlength=\"150\" "
                             + "name=\"txt-huifu-top\" id=\"txt-huifu-top-"
                             + id
                             + "\" class=\"txt-huifu txt-huifu-top\"></textarea></div><div class=\"box-r\">"
                             + "<a id='pub-btn-top-"
                             + id
                             + "' lang=\""
                             + id
                             + "\" href='javascript:;' class='pub-icons add-pub-btn add-pub-btn-unvalid'>评论</a>"
                             + "<a id='pub-loading-top-"
                             + id
                             + "' href='javascript:;' class='loading-ico loading-ico-top pub-loading-top'>发布中...</a>"
                             + "</div></div><div class=\"tip-3\" id='hidden-comt-"
                             + id
                             + "'><a href=\"javascript:;\" class=\"hiddenCom-Btn\" lang=\""
                             + id
                             + "\">"
                             + "<em class=\"pinglun em2\"></em><span>收起</span></a></div><div class=\"write-error-box-top\">"
                             + "<div class=\"write-error-desc\" id=\"write-error-desc-" + id + "\">"
                             + "</div></div></div><input type=\"hidden\" id=\"hidsubjectid-" + id + "\" value=\""
                             + topic.getSubjectId() + "\" /></div></div></div>";
            sf.append(content);
        }

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("page", 1);
        map.put("items", 25);
        map.put("dataList", sf.toString());
        map.put("maxid", topicService.getMaxId(new TopicQuery()));
        return createJsonMav("9999", "", map);
    }

    // /checknewfeed?maxId=
    @RequestMapping(value = "/checknewfeed", headers = "accept=*/*", produces = "application/json", method = RequestMethod.POST)
    @ResponseBody
    public DeferredResult<String> checknewfeed(Long maxId) {
        DeferredResult<String> deferredResult = new DeferredResult<String>();
        if (maxId == null) {
            deferredResult.setResult("0");
            return deferredResult;
        }
        Integer count = topicService.refreshcount(maxId);
        deferredResult.setResult(count + "");
        return deferredResult;
    }

    // /all/hot/recent/1 全部 最热 即时排序
    // /all/hot/72hr/1 全部 最热 3天
    // /all/hot/24hr/1 全部 最热 24小时
    @RequestMapping(value = "/all/hot/{orderTime}")
    public ModelAndView allHotItem(@PathVariable("orderTime")
    final String orderTime, Integer page) {
        ModelAndView mav = new ModelAndView("topic/item");
        TopicOrderTimeEnum orderTimeEnum = TopicOrderTimeEnum.getEnum(orderTime);
        if (orderTime == null) {
            return mav;
        }

        TopicQuery query = new TopicQuery(new TopicDO());
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);

        if (orderTimeEnum == TopicOrderTimeEnum.HR24) {
            query.setStartGmtModified(DateViewTools.getDayBefore(1));
        } else if (orderTimeEnum == TopicOrderTimeEnum.HR72) {
            query.setStartGmtModified(DateViewTools.getDayBefore(3));
        }
        query.setSortType(DBSortTypeEnum.GMT_MODIFIED.name);
        PaginationList<TopicDO> list = topicService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/all/hot/" + orderTime + "/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);
        getMyLikedAndSaved(mav);

        mav.addObject("list", list);
        mav.addObject("order", "hot");
        mav.addObject("orderTime", orderTime);
        mav.addObject("all", "all");

        mav.addObject("maxid", topicService.getMaxId(new TopicQuery()));
        mav.addObject("page", Argument.isNotPositive(page) ? 1 : page);
        return mav;
    }

    // /all/new/1 全部 最新
    // /all/man/1 全部 人类发布
    @RequestMapping(value = "/all/{order}")
    public ModelAndView allItem(@PathVariable("order")
    final String order, Integer page) {
        ModelAndView mav = new ModelAndView("topic/item");
        TopicOrderEnum orderEnum = TopicOrderEnum.getEnum(order);
        if (orderEnum == null) {
            return mav;
        }

        TopicQuery query = new TopicQuery(new TopicDO());
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);

        query.setSortType(DBSortTypeEnum.GMT_CREATE.name);
        PaginationList<TopicDO> list = topicService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/all/" + order + "/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);
        getMyLikedAndSaved(mav);

        mav.addObject("list", list);
        mav.addObject("order", order);
        mav.addObject("all", "all");
        mav.addObject("maxid", topicService.getMaxId(new TopicQuery()));
        mav.addObject("page", Argument.isNotPositive(page) ? 1 : page);
        return mav;
    }

    // /r/news/hot/1
    // /r/news/new/1
    // /r/scoff/hot/1"
    // /r/pic/hot/1
    // /r/tec/hot/1
    // /r/ask/hot/1
    @RequestMapping(value = "/r/{subject}/{order}")
    public ModelAndView item(@PathVariable("subject")
    final String subject, @PathVariable("order")
    final String order, Integer page) {
        ModelAndView mav = new ModelAndView("topic/item");
        TopicOrderEnum orderEnum = TopicOrderEnum.getEnum(order);
        SubjectEnum subjectEnum = SubjectEnum.getEnum(subject);
        if (orderEnum == null || subjectEnum == null) {
            return mav;
        }

        TopicQuery query = new TopicQuery(new TopicDO(subjectEnum));
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);

        if (orderEnum == TopicOrderEnum.HOT) {
            query.setSortType(DBSortTypeEnum.GMT_MODIFIED.name);
        } else if (orderEnum == TopicOrderEnum.NEW) {
            query.setSortType(DBSortTypeEnum.GMT_CREATE.name);
        }
        PaginationList<TopicDO> list = topicService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/r/" + subject + "/" + order + "/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);
        getMyLikedAndSaved(mav);

        mav.addObject("list", list);
        mav.addObject("subject", subject);
        mav.addObject("subjectId", subjectEnum.getValue());
        mav.addObject("order", order);
        mav.addObject("maxid", topicService.getMaxId(new TopicQuery()));
        mav.addObject("page", Argument.isNotPositive(page) ? 1 : page);
        return mav;
    }

    // /link/catch/title 发布链接时,服务器根据链接爬取数据
    // {"result":{"code":"9999", "message":"发布成功", "data":
    // {"summary":"分享发现 - conge - 首先，我不是要做广告。但是Shop Small Saturday 确实是一家信用卡公司为了marketing而做的一个活动。所以这里声明一下。Shop Small Saturday是鼓励人们在",
    // "title":"黑色星期五之后周六，是 Shop Small Saturday - V2EX"}}}
    // {"result":{"code":"30008", "message":"您已经发布该链接", "data":""}}
    // {"result":{"code":"30014", "message":"本网站链接不能被发布", "data":""}}
    // {"result":{"code":"39998", "message":"添加链接失败，请重试", "data":""}}
    // 抓取规则 title取网页的head中title,summary取网页head中description
    @RequestMapping(value = "/link/catch/title", method = RequestMethod.POST)
    public ModelAndView catchTitle(String url) {
        if (StringUtils.isEmpty(url)) {
            return createExtJsonMav("20002", "添加链接失败,请重试,链接为空", "");
        }
        Pattern pattern = Pattern.compile(URL_REG);
        Matcher matcher = pattern.matcher(url);
        if (!matcher.matches()) {
            return createExtJsonMav("20002", "添加链接失败,请重试,无效的链接", "");
        }
        String html = SpiderHtmlUtils.getHtmlByUrl(url);
        if (StringUtils.isEmpty(html)) {
            return createExtJsonMav("20002", "添加链接失败,请重试,无效的链接", "");
        }
        String title = SpiderHtmlUtils.fetchTitleHtml(html);
        if (StringUtils.isEmpty(title)) {
            return createExtJsonMav("20002", "添加链接失败,请重试,无效的链接", "");
        }
        String description = SpiderHtmlUtils.fetchDescriptionHtml(html);
        return createJsonMav("9999", "发布成功", new CatchVO(title, description));
    }

    // 发布时调的验证请求
    @RequestMapping(value = "/link/share")
    public ModelAndView share() {
        if (!WebUserTools.hasLogin()) {
            return createJsonMav("-1", "您需要先登录才能继续刚才的操作", "");
        }
        if (WebUserTools.getIsBan()) {
            return createJsonMav("-1", "您已经被管理员禁言", "");
        }
        return createSuccJsonMav("发布成功", "");
    }

    // /link/create
    // {"result":{"code":"30005", "message":"您发布过于频繁，请2分钟后重新发布", "data":""}}
    // {"result":{"code":"9999", "message":"发布成功", "data":{"linkId":6539871}}}
    // {"result":{"code":"39997", "message":"发布失败，请重试", "data":""}}
    // {"result":{"code":"30019", "message":"链接标题为空", "data":""}}
    // {"result":{"code":"30020", "message":"链接类别为空", "data":""}}
    // {"result":{"code":"30003", "message":"您发布的标题过长，请重新发布", "data":""}}

    // 创建链接主题subjectId:100,tabType:0
    // title:【限量】粉红大布娃娃新白色银丝深V毛领名媛气质毛呢连衣裙 Q &mdash; 悦己爱逛，淘宝天猫优质女性商品导购平台
    // url:http://www.yueji.com/baobei/95889.htm
    // content:悦己爱逛 www.yueji.com 【限量】粉红大布娃娃新白色银丝深V毛领名媛气质毛呢连衣裙 Q

    // 创建文字主题 subjectId:151,tabType:1 你问我答
    // title:深夜还没睡觉,在上海待着真累

    // 创建图片主题 subjectId:4,tabType:2
    // title:liuyifei
    // yellow:0
    // imgUrl:http://img1.chouti.com/group10/M03/18/15/wKgCNVR8AszXefLSAAA4IEFwQKA855=420x185.jpg

    // 买买买subjectId=1; 海淘转让区subjectId=2; 发现subjectId=4; 问答社subjectId=100;
    // 五元团subjectId=151;
    // topicId 话题Id
    // 链接TAB点击tabType=0;文字TAB点击tabType=1;图片TAB点击tabType=2;
    @RequestMapping(value = "/link/create")
    public ModelAndView create(Integer subjectId, Integer tabType, String title, String url, String content,
                               Integer yellow, String imgUrl, Integer topicId) {
        if (!WebUserTools.hasLogin()) {
            return createJsonMav("-1", "您需要先登录才能继续刚才的操作", "");
        }
        // 验证用户是否通过审核
        StateEnum stateEnum = WebUserTools.getIsState();
        if (stateEnum != null && stateEnum != StateEnum.NORMAL) {
            return createJsonMav("-1", "您已经被管理员" + stateEnum.getDesc() + ",如有需要请向管理员反馈", "");
        }
        // 验证用户是否被禁言
        if (WebUserTools.getIsBan()) {
            return createJsonMav("-1", "您已经被管理员禁言,如有需要请向管理员反馈", "");
        }

        Date lastPublishDate = topicService.getLastPublishTime(WebUserTools.getUid());
        int diff = DateViewTools.getDifferMin(new Date(), lastPublishDate);
        if (diff < 3) {
            return createJsonMav("30005", "您发布过于频繁，请3分钟后重新发布", "");
        }
        if (StringUtils.isEmpty(title)) {
            return createJsonMav("30019", "链接标题为空", "");
        }
        float titleSize = StringFormatter.getWordSize(title);
        if (titleSize > 150) {
            return createJsonMav("30003", "您发布的标题过长，请重新发布,超了" + (titleSize - 150) + "个字", "");
        }
        if (SubjectEnum.getEnum(subjectId) == null) {
            return createJsonMav("30020", "链接类别为空", "");
        }
        TabTypeEnum type = TabTypeEnum.getEnum(tabType);
        if (type == null) {
            return createJsonMav("30020", "主题类型为空", "");
        }
        TopicDO topic = new TopicDO(WebUserTools.getUid(), WebUserTools.getName());
        topic.setTopicState(StateEnum.NORMAL.getValue());
        topic.setTabType(tabType);
        topic.setSubjectId(subjectId);
        switch (type) {
        // 创建链接主题
            case ZIXUN:
                topic.setTitle(title);
                topic.setLinkUrl(url);
                topic.setOriginalUrl(url);
                topic.setContent(content);
                topic.setYellow(0);
                try {
                    URL lUrl = new URL(url);
                    topic.setContentSource(lUrl.getHost());
                } catch (Exception e) {
                    logger.error("parser url error!url={}", url);
                    return createJsonMav("39997", "发布失败，请重试!url无效的链接", "");
                }
                break;
            // 创建文字主题
            case DUANZI:
                topic.setTitle(title);
                topic.setYellow(0);
                break;
            // 创建图片主题
            case PIC:
                topic.setTitle(title);
                topic.setYellow(yellow);
                topic.setImgUrl(imgUrl);
                break;

            default:
                break;
        }
        topicService.add(topic);
        if (Argument.isNotPositive(topic.getId())) {
            return createJsonMav("39997", "发布失败，请重试!", "");
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("linkId", topic.getId());

        // 增加积分
        MemberDO memberDO = userService.getMemberById(WebUserTools.getUid());
        userService.update(new MemberDO(memberDO.getId(), memberDO.getIntegral() + 10));
        return createJsonMav("9999", "发布成功", map);
    }

    // /link/clickcount/update?linksId=6536652&source= 点击统计
    // {"result":{"code":"9999", "message":"点击统计成功", "data":""}}
    @RequestMapping(value = "/link/clickcount/update")
    public ModelAndView clickcount(Long linksId, String source) {
        if (Argument.isNotPositive(linksId)) {
            return createJsonMav("0000", "点击统计失败，请重试!", "");
        }
        TopicDO topic = topicService.getTopicById(linksId);
        if (topic == null) {
            return createJsonMav("0000", "点击统计失败，请重试!", "");
        }
        topicService.update(new TopicDO(topic.getId(), topic.getHit() + 1, null));
        return createExtSuccJsonMav("推荐链接点击统计成功", "");
    }

    // /link/vote?linksId=6542746 加入推荐
    // {"result":{"code":"9999", "message":"推荐成功",
    // {"result":{"code":"30010", "message":"您已经推荐过了", "data":""}}
    // "data":{"jid":"zxc337","likedTime":"1417416515577000","lvCount":"53","nick":"zxc338","uvCount":"2","voteTime":"小于1分钟前"}}}
    @RequestMapping(value = "/link/vote")
    public ModelAndView addVote(Long linksId) {
        if (!WebUserTools.hasLogin()) {
            return createJsonMav("-1", "您需要先登录才能继续刚才的操作", "");
        }
        if (WebUserTools.getIsBan()) {
            return createJsonMav("-1", "您已经被管理员禁言", "");
        }
        // if (StringUtils.isEmpty(WebUserTools.getPhone())) {
        // return createJsonMav("-1", "绑定手机号后再加入推荐吧~", "");
        // }
        if (Argument.isNotPositive(linksId)) {
            return createJsonMav("0000", "推荐失败，请重试!", "");
        }
        CollectDO collect = userService.find(new CollectQuery(WebUserTools.getUid(), linksId, CollectTypeEnum.LIKED));
        if (collect != null) {
            return createJsonMav("30010", "您已经推荐过了", "");
        }
        TopicDO topic = topicService.getTopicById(linksId);
        if (topic == null) {
            return createJsonMav("0000", "推荐失败，请重试!", "");
        }
        if (NumberParser.isEqual(topic.getUserId(), WebUserTools.getUid())) {
            return createJsonMav("30010", "您已经推荐过了", "");
        }
        userService.add(new CollectDO(WebUserTools.getUid(), linksId, CollectTypeEnum.LIKED));
        topic.setRecommend(topic.getRecommend() + 1);
        topicService.update(new TopicDO(linksId, null, topic.getRecommend()));

        Integer uvCount = userService.count(new CollectQuery(WebUserTools.getUid(), CollectTypeEnum.LIKED));
        return createJsonMav("9999", "推荐成功", new VoteVO(true, WebUserTools.getName(), WebUserTools.getNick(), topic,
                                                        uvCount));
    }

    // /vote/cancel/vote.do 取消推荐
    // {"result":{"code":"9999", "message":"取消推荐成功",
    // {"result":{"code":"30028", "message":"您没有推荐过该链接", "data":""}}
    // {"result":{"code":"30029", "message":"您发布的默认推荐不可取消", "data":""}}
    // "data":{"jid":"zxc337","lvCount":"160","nick":"zxc338","unlikedTime":"1417416763883000","uvCount":"0","voteTime":"小于1分钟前"}}}
    @RequestMapping(value = "/vote/cancel/vote.do")
    public ModelAndView cancelVote(Long linksId) {
        if (Argument.isNotPositive(linksId)) {
            return createJsonMav("0000", "取消推荐失败，请重试!", "");
        }
        if (WebUserTools.getIsBan()) {
            return createJsonMav("-1", "您已经被管理员禁言", "");
        }
        CollectDO collect = userService.find(new CollectQuery(WebUserTools.getUid(), linksId, CollectTypeEnum.LIKED));
        if (collect == null) {
            return createJsonMav("30028", "您没有推荐过该链接", "");
        }
        TopicDO topic = topicService.getTopicById(linksId);
        if (topic == null) {
            return createJsonMav("0000", "取消推荐失败，请重试!", "");
        }
        if (NumberParser.isEqual(topic.getUserId(), WebUserTools.getUid())) {
            return createJsonMav("30029", "您发布的默认推荐不可取消", "");
        }
        userService.realDeleteCollect(collect.getId());
        topic.setRecommend(topic.getRecommend() - 1);
        topicService.update(new TopicDO(linksId, null, topic.getRecommend()));

        Integer uvCount = userService.count(new CollectQuery(WebUserTools.getUid(), CollectTypeEnum.LIKED));
        return createJsonMav("9999", "取消推荐成功", new VoteVO(false, WebUserTools.getName(), WebUserTools.getNick(), topic,
                                                          uvCount));
    }

    // /link/self/add?linksId=6542856 加入私藏
    // {"result":{"code":"9999", "message":"", "data":6}}
    // {"result":{"code":"30024", "message":"您已经加入私藏", "data":""}}
    @RequestMapping(value = "/link/self/add")
    public ModelAndView addSaved(Long linksId) {
        if (Argument.isNotPositive(linksId)) {
            return createJsonMav("0000", "私藏失败，请重试!", "");
        }
        if (WebUserTools.getIsBan()) {
            return createJsonMav("-1", "您已经被管理员禁言", "");
        }
        CollectDO collect = userService.find(new CollectQuery(WebUserTools.getUid(), linksId, CollectTypeEnum.SAVED));
        if (collect != null) {
            return createJsonMav("30024", "您已经加入私藏", "");
        }
        userService.add(new CollectDO(WebUserTools.getUid(), linksId, CollectTypeEnum.SAVED));

        Integer scount = userService.count(new CollectQuery(WebUserTools.getUid(), CollectTypeEnum.SAVED));
        return createJsonMav("9999", "私藏成功", scount);
    }

    // /link/self/del?linksId=6542971
    // {"result":{"code":"9999", "message":"", "data":5}}
    // {"result":{"code":"30025", "message":"您已经取消私藏", "data":""}}
    @RequestMapping(value = "/link/self/del")
    public ModelAndView cancelSaved(Long linksId) {
        if (Argument.isNotPositive(linksId)) {
            return createJsonMav("0000", "取消私藏失败，请重试!", "");
        }
        if (WebUserTools.getIsBan()) {
            return createJsonMav("-1", "您已经被管理员禁言", "");
        }
        CollectDO collect = userService.find(new CollectQuery(WebUserTools.getUid(), linksId, CollectTypeEnum.SAVED));
        if (collect == null) {
            return createJsonMav("30025", "您已经取消私藏", "");
        }
        userService.realDeleteCollect(collect.getId());

        Integer scount = userService.count(new CollectQuery(WebUserTools.getUid(), CollectTypeEnum.SAVED));
        return createJsonMav("9999", "取消私藏成功", scount);
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///
    // ///
    // /// 话题
    // ///
    // ///
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // /topic/31
    @RequestMapping(value = "/topic/{id}")
    public ModelAndView download(@PathVariable("id")
    Long id) {
        ModelAndView mav = new ModelAndView("topic/topic");
        return mav;
    }

    // /topic/hot/show
    // {"result":{"code":"9999", "message":"",
    // "data":{"currentTime":1418022029223000,"items":2,"list":[
    // {"action":1,"actiontime":1355368510759000,"actiontimeStr":"2012-12-13","clicksCount":1358,"closeIp":false,"commentsCount":8,"commentsUrl":"/link/4448302","content":"","createTime":"2012-12-11","createtime":1355220220111000,"domain":"-politics.caijing.com.cn","expireTime":"0","expireTopicTime":"0","hasFlash":false,"id":4448302,"imgUrl":"http://img1.chouti.com/group3/M03/10/0F/wKgCCFDHEKqo0By1AAASNe2kHTc689=C60x60.jpg","inTopicStory":false,"isBanUser":false,"isLocalSite":false,"isTopLinks":false,"isTopicTopLinks":false,"isYellow":false,"jid":"kumokumaaa","lastOperate":"入热榜","lastOperateTime":"2012-12-11","likedStatus":false,"nick":"Cog","nickImgUrl":"http://img1.chouti.com/group8/M02/CC/C9/wKgCHFP9iiyMUgZ9AAAihP7IpIE262=15x15.jpg","noComments":false,"operateTime":1355223600684000,"operator":"plan","originalImgUrl":"http://img1.chouti.com/group3/M03/10/0F/wKgCCFDHEKrKdhxQAAAURYomKm8658.jpg","page":0,"pages":0,"pool":1,"score":4920.386562693948,"selfStatus":false,"shareCount":0,"subject":"42区","subjectId":1,"subjectUrl":"/r/news/hot/1","tabType":0,"timeIntoPool":1355223600684000,"timeToPool":"2012-12-11","title":"【人民日报也开始鉴表啦！】人民日报：达赖曾戴2.4万欧元名表 脚穿奢华皮鞋","topicId":31,"topicName":"表叔","ups":19,"upsWithWeight":424,"url":"http://politics.caijing.com.cn/2012-12-11/112349803.html"},
    // {"action":1,"actiontime":1355375178290000,"actiontimeStr":"2012-12-13","clicksCount":2,"closeIp":false,"commentsCount":0,"commentsUrl":"/link/4454333","content":"作者：祝振强 | 评论(0) | 标签:时事观点不久前，甘肃有关部门就网传“兰州市长袁占亭疑戴名表”事件作出回应称，袁占亭所戴3块表中，价格最高的只有25100元。就在民众对此深表遗憾、认为反腐败情形依旧、不会有新的突破之际，又一个超...","createTime":"2012-12-13","createtime":1355375178060000,"domain":"-www.my1510.cn","expireTime":"0","expireTopicTime":"0","hasFlash":false,"id":4454333,"inTopicStory":false,"isBanUser":false,"isLocalSite":false,"isTopLinks":false,"isTopicTopLinks":false,"isYellow":false,"jid":"chouti0296","lastOperate":"入热榜","lastOperateTime":"2012-12-13","likedStatus":false,"nick":"一五一十推荐文章","nickImgUrl":"http://img1.chouti.com/group1/M01/60/18/wKgCK07MonC9Mq51AAAeJuxWqMQ033=15x15.gif","noComments":false,"page":0,"pages":0,"pool":0,"score":4919.466112444445,"selfStatus":false,"shareCount":0,"source":"d41d8cd98f00b204e9800998ecf8427e","subject":"42区","subjectId":1,"subjectUrl":"/r/news/hot/1","timeIntoPool":1355375178060000,"timeToPool":"2012-12-13","title":"调查“表哥”不应戛然止步于高级别领导","topicId":31,"topicName":"表叔","ups":1,"upsWithWeight":1,"url":"http://www.my1510.cn/article.php?id=89607"},
    // ]}}}
    // {"result":{"code":"9999", "message":"",
    // "data":{"currentTime":1418022237775000,"items":0}}}
    @RequestMapping(value = "/topic/hot/show")
    public ModelAndView topicShow(Long id, Integer page) {
        if (Argument.isNotPositive(id)) {
            Map<String, Object> map = new HashMap<String, Object>();
            map.put("currentTime", System.currentTimeMillis());
            map.put("items", 0);
            return createJsonMav("9999", "", map);
        }
        return createJsonMav("9999", "关注话题成功", "");
    }

    // /topic/attention/add 关注话题
    // {"result":{"code":"9999", "message":"关注话题成功", "data":""}}
    // {"result":{"code":"60006", "message":"添加私藏话题失败", "data":""}}
    @RequestMapping(value = "/topic/attention/add")
    public ModelAndView addAttention(Long id) {
        if (Argument.isNotPositive(id)) {
            return createJsonMav("60006", "添加私藏话题失败", "");
        }
        return createJsonMav("9999", "关注话题成功", "");
    }

    // /topic/attention/del 取消关注话题
    // {"result":{"code":"60006", "message":"添加私藏话题失败", "data":""}}
    // {"result":{"code":"9999", "message":"取消关注话题成功", "data":""}}
    @RequestMapping(value = "/topic/attention/del")
    public ModelAndView delAttention(Long id) {
        if (Argument.isNotPositive(id)) {
            return createJsonMav("60006", "取消私藏话题失败", "");
        }
        return createJsonMav("9999", "取消关注话题成功", "");
    }
}
