/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.comments;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mmj.app.biz.cons.DBSortTypeEnum;
import com.mmj.app.biz.cons.VoteEnum;
import com.mmj.app.biz.domain.CommentsDO;
import com.mmj.app.biz.domain.CommentsFullDO;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.NotificationDO;
import com.mmj.app.biz.domain.ReportDO;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.domain.VoteDO;
import com.mmj.app.biz.query.CommentsQuery;
import com.mmj.app.biz.query.ReportQuery;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.biz.query.VoteQuery;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.core.lang.CollectionUtils;
import com.mmj.app.common.util.NumberParser;
import com.mmj.app.common.util.StringFormatter;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.tools.WebUserTools;
import com.mmj.app.web.vo.CommentsItemVO;
import com.mmj.app.web.vo.CommentsParentVO;
import com.mmj.app.web.vo.SuggestVO;

/**
 * @author zxc Nov 26, 2014 11:38:53 AM
 */
@Controller
public class CommentsController extends BaseController {

    // /link/6527077 主题详情页面,评论页面
    @RequestMapping(value = { "/link/{id}", "/link/{id}/comments" })
    public ModelAndView link(@PathVariable("id")
    Long id) {
        ModelAndView mav = new ModelAndView("topic/link");
        if (Argument.isNotPositive(id)) {
            return mav;
        }
        TopicDO topic = topicService.getTopicById(id);
        if (topic == null) {
            return mav;
        }
        initUserInfo4Base(topic);

        mav.addObject("topic", topic);
        mav.addObject("title", topic.getTitle());
        mav.addObject("subject", topic.getSubjectId());
        return mav;
    }

    // /link/6527077/comments/6876696 查看话题的评论并定位到评论的位置,进行回复
    @RequestMapping(value = "/link/{linkId}/comments/{commentsId}")
    public ModelAndView reply(@PathVariable("linkId")
    Long linkId, @PathVariable("commentsId")
    Long commentsId) {
        ModelAndView mav = new ModelAndView("topic/link");
        if (Argument.isNotPositive(linkId)) {
            return mav;
        }
        TopicDO topic = topicService.getTopicById(linkId);
        initUserInfo4Base(topic);

        mav.addObject("topic", topic);
        mav.addObject("title", topic.getTitle());
        if (!Argument.isNotPositive(commentsId)) {
            mav.addObject("commentsId", commentsId);
        } else {
            mav.addObject("commentsId", 0);
        }
        return mav;
    }

    // /comments/report 举报
    // {"result":{"code":"49996", "message":"您重复举报同一个评论信息", "data":""}}
    // {"result":{"code":"9999", "message":"用户举报评论信息操作成功", "data":""}}
    // {"result":{"code":"40001", "message":"该评论不存在", "data":""}}
    @RequestMapping(value = "/comments/report")
    public ModelAndView jubao(Long id) {
        if (Argument.isNotPositive(id)) {
            return createJsonMav("40001", "该评论不存在", "");
        }
        CommentsDO comments = commentsService.getCommentsById(id);
        if (comments == null) {
            return createJsonMav("40001", "该评论不存在", "");
        }
        ReportDO report = commentsService.find(new ReportQuery(WebUserTools.getUid(), id));
        if (report != null) {
            return createJsonMav("49996", "您重复举报同一个评论信息", "");
        }
        commentsService.add(new ReportDO(WebUserTools.getUid(), comments.getTopicId(), id, WebUserTools.getName()));
        return createJsonMav("9999", "用户举报评论信息操作成功", "");
    }

    // /comments/vote 评论投票 顶=1 踩=-1
    // linkId:6547023,id:6935293,jid:zxc337,vote:1
    // {"result":{"code":"9999", "message":"投票成功", "data":2}}
    // {"result":{"code":"40002", "message":"您已经投票过了", "data":""}}
    // {"result":{"code":"49997", "message":"投票失败，请稍候再试", "data":""}}
    // linkId:6547023,id:6934929,jid:zxc337,vote:-1
    @RequestMapping(value = "/comments/vote")
    public ModelAndView vote(Long linkId, String jid, Long id, Integer vote) {
        if (WebUserTools.getIsBan()) {
            return createJsonMav("-1", "您已经被管理员禁言", "");
        }
        if (Argument.isNotPositive(linkId) || Argument.isNotPositive(id)) {
            return createJsonMav("49997", "投票失败，请稍候再试", "");
        }
        VoteEnum voteEnum = VoteEnum.getAction(vote);
        if (voteEnum == null) {
            return createJsonMav("49997", "投票失败，请稍候再试", "");
        }
        CommentsDO comments = commentsService.getCommentsById(id);
        if (comments == null) {
            return createJsonMav("40001", "该评论不存在", "");
        }
        VoteDO voteDo = commentsService.find(new VoteQuery(WebUserTools.getUid(), linkId, id));
        if (voteDo != null) {
            return createJsonMav("40002", "您已经投票过了", "");
        }
        commentsService.add(new VoteDO(WebUserTools.getUid(), linkId, id, WebUserTools.getName(), voteEnum));
        CommentsDO commentsDO = new CommentsDO(id);
        if (VoteEnum.isUp(voteEnum)) {
            commentsDO.setUps(comments.getUps() + 1);
        } else if (VoteEnum.isDown(voteEnum)) {
            commentsDO.setDowns(comments.getDowns() + 1);
        }
        commentsService.update(commentsDO);
        return createJsonMav("9999", "投票成功", 0);
    }

    // /comments/create 创建评论
    // {"result":{"code":"21106", "message":"请绑定您的手机号", "data":""}}
    // jid:zxc337 linkId:6549004 isAssent: content:来自iPhone 6 sortType:score
    // jid:zxc337 linkId:6549004 content:i like iphone 6 plus! parentId:6939149

    // {"result":{"code":"9999", "message":"发表评论成功",
    // "data":{"items":1,"action":0,"assentText":"","closeIp":false,"commentTime":"小于1分钟前","content":"来自iPhone 6",
    // "createTime":1417586646347000,"depth":0,"downs":0,"id":6939149,"ip":"116.224.109.84","isBan":false,"isVote":1,
    // "jid":"zxc337","linkId":6549004,"linksTitle":"京城各衙门府院实施同城同带鱼是什么情况？知情的站出来","nick":"zxc338",
    // "nickImgUrl":"http://img1.chouti.com/group9/M00/19/22/wKgCNFR3P5Wc4AjcAAAbxP2MOAo147=37x37.jpg","phoneBan":false,
    // "phoneNum":"+8618912386146","score":0.3790176,"ups":1}}}
    // {"result":{"code":"10008", "message":"参数有误，请检查", "data":""}}
    // {"result":{"code":"49998", "message":"发表评论失败，请稍候再试", "data":""}}
    @RequestMapping(value = "/comments/create")
    public ModelAndView create(Long linkId, Long parentId, String jid, String isAssent, String content, String sortType) {
        if (WebUserTools.getIsBan()) {
            return createJsonMav("-1", "您已经被管理员禁言", "");
        }
        // if (StringUtils.isEmpty(WebUserTools.getPhone())) {
        // return createJsonMav("-1", "绑定手机号后再发表评论吧~", "");
        // }
        // 数据校验
        if (Argument.isNotPositive(linkId) || StringUtils.isEmpty(content)) {
            return createJsonMav("10008", "参数有误，请检查", "");
        }
        float titleSize = StringFormatter.getWordSize(content);
        if (titleSize > 150) {
            return createJsonMav("30003", "您发布的评论过长，请重新发布,超了" + (titleSize - 150) + "个字", "");
        }
        if (Argument.isNotPositive(parentId)) {
            parentId = 0l;
        }
        TopicDO topicDO = topicService.getTopicById(linkId);
        if (topicDO == null) {
            return createJsonMav("10008", "参数有误，请检查", "");
        }
        if (NumberParser.isEqual(topicDO.getIsBan(), 1)) {
            return createJsonMav("10008", "当前发布信息已经被管理员禁止评论", "");
        }
        CommentsDO parentComments = null;
        if (!Argument.isNotPositive(parentId)) {
            parentComments = commentsService.getCommentsById(parentId);
            if (parentComments == null) {
                return createJsonMav("49998", "发表评论失败，请稍候再试", "");
            }
            if (NumberParser.isEqual(parentComments.getIsBan(), 1)) {
                return createJsonMav("10008", "当前评论信息已经被管理员禁止回复", "");
            }
        }
        // 创建评论对象
        CommentsDO comments = new CommentsDO(WebUserTools.getUid(), parentId, linkId, content, WebUserTools.getName());
        if (parentComments != null) {
            comments.setDepth(parentComments.getDepth() + 1);
        }
        // 插入评论
        commentsService.add(comments);
        // 更新文章的评论数
        topicService.update(new TopicDO(linkId, topicDO.getComments() + 1));
        // 返回当前评论信息
        CommentsQuery commentsQuery = new CommentsQuery();
        commentsQuery.getT().setId(comments.getId());
        List<CommentsFullDO> fullList = commentsService.commentsListPagination(commentsQuery);
        if (Argument.isEmpty(fullList)) {
            return createJsonMav("10008", "参数有误，请检查", "");
        }
        initUserInfo4List(fullList);

        CommentsFullDO commentsFull = fullList.get(0);
        CommentsItemVO commentsItem = new CommentsItemVO(commentsFull, parentComments);
        commentsItem.setJid(WebUserTools.getName());
        commentsItem.setNick(WebUserTools.getNick());
        commentsItem.setNickImgUrl(WebUserTools.getImg());
        commentsItem.setPhoneBan(false);
        commentsItem.setPhoneNum("+86" + WebUserTools.getPhone());
        commentsItem.setIsVote(1);

        // 文章总评论数
        Integer count = commentsService.count(new CommentsQuery(null, linkId));
        commentsItem.setItems(count);

        // 增加积分
        MemberDO memberDO = userService.getMemberById(WebUserTools.getUid());
        userService.update(new MemberDO(memberDO.getId(), memberDO.getIntegral() + 1));

        // 发送通知
        // 回复评论的通知
        NotificationDO notification = new NotificationDO();
        notification.setActionUserId(WebUserTools.getUid());
        notification.setUnRead(1);
        notification.setNotificationAction(linkId.intValue());
        notification.setLinkId(topicDO.getId());
        notification.setCommentsId(comments.getId());
        if (parentComments != null) {
            Integer trunComment = memberDO.getTrunComment();
            if (NumberParser.isEqual(trunComment, 0)
                && !NumberParser.isEqual(WebUserTools.getUid(), parentComments.getUserId())) {
                notification.setUserId(parentComments.getUserId());
                notification.setContent(comments.getContent());
                notification.setNotificationType(3);
            }
        }
        // 评论发布的通知
        else {
            Integer trunReply = memberDO.getTrunReply();
            if (NumberParser.isEqual(trunReply, 0) && !NumberParser.isEqual(WebUserTools.getUid(), topicDO.getUserId())) {
                notification.setUserId(topicDO.getUserId());
                notification.setContent(topicDO.getTitle());
                notification.setNotificationType(2);
            }
        }
        letterService.add(notification);

        return createJsonMav("9999", "发表评论成功", commentsItem);
    }

    /**
     * 获取评论树状结构
     * 
     * <pre>
     * {
     *     "result": {
     *         "code": "9999", 
     *         "message": "", 
     *         "data": {
     *             "items": 8, 
     *             "remain": 0, 
     *             "noComments": false, 
     *             "dataList": [
     *                 {
     *                     "action": 0, 
     *                     "assentText": "", 
     *                     "childs": [
     *                         {
     *                             "action": 0, 
     *                             "assentText": "", 
     *                             "closeIp": false, 
     *                             "commentTime": "30分钟前", 
     *                             "content": "缸它！", 
     *                             "createTime": 1417148360869000, 
     *                             "depth": 1, 
     *                             "downs": 0, 
     *                             "id": 6898705, 
     *                             "ip": "36.45.244.49", 
     *                             "isBan": false, 
     *                             "isVote": 0, 
     *                             "jid": "13759995495", 
     *                             "linkId": 6536443, 
     *                             "linksTitle": "【视频：梅西内马尔对飙颠球】在巴萨全队获赠奥迪轿车的仪式上，梅西和内马尔对飙点球，看看谁在一分钟之内颠球次数最多。梅西小赢。", 
     *                             "nick": "洋葱", 
     *                             "nickImgUrl": "http://img1.chouti.com/group7/M03/B4/2B/wKgCFlPqDOzj9rkUAAAZaBO293Q629=37x37.jpg", 
     *                             "parent": {
     *                                 "assentText": "", 
     *                                 "id": 6898638, 
     *                                 "isVote": 0
     *                             }, 
     *                             "phoneBan": false, 
     *                             "score": 0.3790176, 
     *                             "source": "6ab02e01b94cf80c96d2bf9a70dd5bd7", 
     *                             "sourceAppUrl": "http://dig.chouti.com/download/model/andorid", 
     *                             "sourceType": 2, 
     *                             "ups": 1
     *                         }
     *                     ],
     *                     "closeIp": false, 
     *                     "commentTime": "小于1分钟前", 
     *                     "content": "图钉主义，完全是独裁！", 
     *                     "createTime": 1417148436111000, 
     *                     "depth": 0, 
     *                     "downs": 0, 
     *                     "id": 6898717, 
     *                     "ip": "223.9.124.131", 
     *                     "isBan": false, 
     *                     "isVote": 0, 
     *                     "jid": "udbojvnv", 
     *                     "linkId": 6536652, 
     *                     "linksTitle": "如果用一个主义来形容买买君，你选择什么？", 
     *                     "nick": "群众演员101号", 
     *                     "nickImgUrl": "http://img1.chouti.com/group7/M02/4F/EC/wKgCFlNFMsu-Xh1_AAAgp9hAr2I544=37x37.jpg", 
     *                     "phoneBan": false, 
     *                     "phoneNum": "+8613700523670", 
     *                     "score": 0.54969215, 
     *                     "source": "c40fe2f61bcfd611177be71ec305196b", 
     *                     "sourceAppUrl": "http://dig.chouti.com/download/model/iphone", 
     *                     "sourceType": 1, 
     *                     "ups": 2
     *                 }, 
     *                 {
     *                     "action": 0, 
     *                     "assentText": "", 
     *                     "deleteInfo": "2B用户隐私",
     *                     "closeIp": false, 
     *                     "commentTime": "小于1分钟前", 
     *                     "content": "拿来主义", 
     *                     "createTime": 1417148432121000, 
     *                     "depth": 0, 
     *                     "downs": 0, 
     *                     "id": 6898715, 
     *                     "ip": "59.46.191.2", 
     *                     "isBan": false, 
     *                     "isVote": 0, 
     *                     "jid": "lgylone18", 
     *                     "linkId": 6536652, 
     *                     "linksTitle": "如果用一个主义来形容买买君，你选择什么？", 
     *                     "nick": "lgylone18", 
     *                     "nickImgUrl": "http://img1.chouti.com/group9/M00/B1/15/wKgCMlRIrueZ53-QAAAg6v_Smyw283=37x37.gif", 
     *                     "phoneBan": false, 
     *                     "score": 0.3790176, 
     *                     "ups": 1
     *                 }
     *             ]
     *         }
     *     }
     * }
     * </pre>
     * 
     * @param linkId
     * @param sortType
     * @param id
     * @return
     */
    // {"result":{"code":"9999", "message":"发表评论成功", "data":{"items":0,"noComments":false,"dataList":[]}}}
    // 按最新排序 sortType:time 按最热排序 sortType:score
    // linkId:6549004 sortType:score id:0
    // 还要判断当前登录用户是否已经投票了
    @RequestMapping(value = "/comments")
    public ModelAndView comments(Long linkId, String sortType, Long id) {
        if (Argument.isNotPositive(linkId)) {
            return createJsonMav("0000", "参数错误", "");
        }
        if (Argument.isNotPositive(id)) {
            id = 0l;
        }
        CommentsQuery query = new CommentsQuery(null, linkId);
        if (!Argument.isNotPositive(id)) {
            query.setRelationId(id);
        }
        if (StringUtils.equals("score", sortType)) {
            query.setSortType(DBSortTypeEnum.UPS);
        } else if (StringUtils.equals("time", sortType)) {
            query.setSortType(DBSortTypeEnum.GMT_CREATE);
        }
        // 返回当前评论信息
        List<CommentsFullDO> fullList = commentsService.commentsListPagination(query);
        if (Argument.isEmpty(fullList)) {
            // {"result":{"code":"9999", "message":"发表评论成功", "data":{"items":0,"noComments":false,"dataList":[]}}}
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("items", fullList.size());
            result.put("noComments", false);
            result.put("dataList", fullList);
            return createJsonMav("9999", "发表评论成功", result);
        }
        initUserInfo4List(fullList);

        // List<CommentsFullDO> copyList = new LinkedList<CommentsFullDO>(fullList);
        // CollectionUtils.remove(copyList, new Grep<CommentsFullDO>() {
        //
        // @Override
        // public boolean grep(CommentsFullDO full) {
        // return NumberParser.isEqual(full.getParentId(), 0l);
        // }
        // });

        // 查出当前登录用户的投票
        List<VoteDO> voteList = commentsService.list(new VoteQuery(WebUserTools.getUid(), linkId, id));
        List<Long> voteLongs = CollectionUtils.getLongValues(voteList, "commentsId");

        Map<Long, CommentsFullDO> copyMap = CollectionUtils.toLongMap(fullList, "id");

        List<CommentsItemVO> commentsItemList = new LinkedList<CommentsItemVO>();
        for (CommentsFullDO commentsFull : fullList) {
            Long parentId = commentsFull.getParentId();
            commentsItemList.add(new CommentsItemVO(commentsFull,
                                                    NumberParser.isEqual(parentId, 0l) ? null : copyMap.get(parentId),
                                                    voteLongs));
        }

        List<CommentsItemVO> nodeList = new LinkedList<CommentsItemVO>();
        for (CommentsItemVO node1 : commentsItemList) {
            boolean mark = false;
            for (CommentsItemVO node2 : commentsItemList) {
                CommentsParentVO parent = node1.getParent();
                if (parent != null && node2 != null && parent.getId() != null && parent.getId().equals(node2.getId())) {
                    mark = true;
                    if (node2.getChilds() == null) {
                        node2.setChilds(new LinkedList<CommentsItemVO>());
                    }
                    node2.getChilds().add(node1);
                    break;
                }
            }
            if (!mark) {
                nodeList.add(node1);
            }
        }

        Map<String, Object> result = new LinkedHashMap<String, Object>();
        result.put("items", fullList.size());
        result.put("remain", 0);
        result.put("noComments", Argument.isEmpty(fullList));
        result.put("dataList", nodeList);
        return createJsonMav("9999", "", result);
    }

    // /suggestion.json
    /**
     * 您可能感兴趣的新闻
     * 
     * <pre>
     * {
     *     "result": {
     *         "code": "9999", 
     *         "message": "", 
     *         "data": {
     *             "items": 10, 
     *             "dataList": [
     *                 {
     *                     "id": 6536652, 
     *                     "imgUrl": "http://img1.chouti.com/group9/M02/1F/58/wKgCMlR39-OnwLdJAAActavA8xY043=C80x80.jpg", 
     *                     "title": "如果用一个主义来形容买买君，你选择什么？"
     *                 }, 
     *                 {
     *                     "id": 6536422, 
     *                     "imgUrl": "http://img1.chouti.com/group9/M01/1E/6D/wKgCNFR35P2QM2PfAABCqhcltxI017=C80x80.jpg", 
     *                     "title": "【安徽：男子追尾葬身火海 经鉴定其18年前杀人焚尸】今年5月份，安庆市大观区山口乡柏子大桥附近发生一起车辆事故，两辆重载大货车追尾。其中一货车起火，42岁的驾驶员戴红葬身火海。后民警提取其DNA进行鉴定对比，意外发现死者竟是1996年大连一起入室抢劫强奸杀人案的嫌犯。", 
     *                     "url": "http://news.ifeng.com/a/20141128/42595584_0.shtml"
     *                 }, 
     *                 {
     *                     "id": 6536311, 
     *                     "imgUrl": "http://img1.chouti.com/group9/M01/1E/19/wKgCMlR34MX1QFG-AAAw1yT3FIE222=C80x80.png", 
     *                     "title": "【卡扎菲倒台三年后，三分之一利比亚人民受精神疾病折磨】丹麦一家人权组织最新调查发现，自2011年卡扎菲政权倒台以来，有将近三分之一的利比亚人患有焦虑、抑郁等精神疾病。", 
     *                     "url": "http://www.thepaper.cn/newsDetail_forward_1281601"
     *                 }
     *             ]
     *         }
     *     }
     * }
     * </pre>
     * 
     * @param link_id
     * @return
     */
    @RequestMapping(value = "/suggestion.json")
    public ModelAndView suggestion(Long link_id) {
        TopicQuery query = new TopicQuery(new TopicDO());
        query.setPageSize(10);
        query.setSortType(DBSortTypeEnum.GMT_MODIFIED.name);
        List<SuggestVO> list = new LinkedList<SuggestVO>();
        List<TopicDO> topicList = topicService.listPagination(query);
        initUserInfo4List(topicList);

        for (TopicDO topic : topicList) {
            list.add(new SuggestVO(topic));
        }

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("items", list.size());
        map.put("dataList", list);
        return createJsonMav("9999", "", map);
    }
}
