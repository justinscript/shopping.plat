/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.controller.item;

import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mmj.app.biz.cons.CollectTypeEnum;
import com.mmj.app.biz.domain.CollectDO;
import com.mmj.app.biz.domain.CollectFullDO;
import com.mmj.app.biz.domain.CommentsFullDO;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.domain.VoteDO;
import com.mmj.app.biz.query.CollectQuery;
import com.mmj.app.biz.query.CommentsQuery;
import com.mmj.app.biz.query.MemberQuery;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.biz.query.VoteQuery;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.core.lang.CollectionUtils;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;
import com.mmj.app.common.util.NumberParser;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.tools.WebUserTools;

/**
 * 收藏 发布 推荐 评论
 * 
 * @author zxc Dec 8, 2014 2:39:35 PM
 */
@Controller
public class ItemController extends BaseController {

    // /user/zxc337/submitted 我的发布 别人的发布
    @RequestMapping(value = { "/user/{name}/publish", "/user/{name}" })
    public ModelAndView publish(@PathVariable("name")
    final String name, Integer page) {
        ModelAndView mav = new ModelAndView("item/publish");
        Long userId = 0l;
        MemberDO member = userService.find(new MemberQuery(name));
        if (member == null) {
            return mav;
        }
        if (WebUserTools.hasLogin() && StringUtils.equals(WebUserTools.getName(), member.getName())) {
            userId = WebUserTools.getUid();
        } else {
            userId = member.getId();
        }
        mav.addObject("member", member);

        TopicQuery query = new TopicQuery(new TopicDO(userId));
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        PaginationList<TopicDO> list = topicService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/user/" + name + "/publish/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        mav.addObject("list", list);

        int publishCount = 0;
        int likedCount = 0;
        int commentsCount = 0;

        if (Argument.isNotEmpty(list) && list.getQuery() != null) {
            publishCount = list.getQuery().getAllRecordNum();
        }
        mav.addObject("publishCount", publishCount);

        likedCount = userService.count(new CollectQuery(userId, CollectTypeEnum.LIKED));
        mav.addObject("likedCount", likedCount);
        commentsCount = commentsService.count(new CommentsQuery(userId));
        mav.addObject("commentsCount", commentsCount);
        if (WebUserTools.hasLogin()) {
            List<CollectDO> mySavedList = userService.list(new CollectQuery(WebUserTools.getUid(),
                                                                            CollectTypeEnum.SAVED));
            mav.addObject("mySavedList", CollectionUtils.getLongValues(mySavedList, "topicId"));
            if (StringUtils.equals(WebUserTools.getName(), name)) {
                mav.addObject("savedCount", mySavedList.size());
            }
        } else {
            mav.addObject("mySavedList", Collections.<Long> emptyList());
        }
        return mav;
    }

    // /user/zxc337/liked/1 我的推荐 别人的推荐
    @RequestMapping(value = "/user/{name}/liked")
    public ModelAndView liked(@PathVariable("name")
    final String name, Integer page) {
        ModelAndView mav = new ModelAndView("item/liked");
        Long userId = 0l;
        MemberDO member = userService.find(new MemberQuery(name));
        if (member == null) {
            return mav;
        }
        if (WebUserTools.hasLogin() && StringUtils.equals(WebUserTools.getName(), member.getName())) {
            userId = WebUserTools.getUid();
        } else {
            userId = member.getId();
        }
        mav.addObject("member", member);

        CollectQuery query = new CollectQuery(userId, CollectTypeEnum.LIKED);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        PaginationList<CollectFullDO> list = userService.collectListPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/user/" + name + "/liked/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        mav.addObject("list", list);

        int publishCount = 0;
        int likedCount = 0;
        int commentsCount = 0;

        publishCount = topicService.count(new TopicQuery(userId));
        mav.addObject("publishCount", publishCount);
        likedCount = list.getQuery().getAllRecordNum();
        mav.addObject("likedCount", likedCount);
        commentsCount = commentsService.count(new CommentsQuery(userId));
        mav.addObject("commentsCount", commentsCount);

        if (WebUserTools.hasLogin()) {
            List<CollectDO> mySavedList = userService.list(new CollectQuery(WebUserTools.getUid(),
                                                                            CollectTypeEnum.SAVED));
            mav.addObject("mySavedList", CollectionUtils.getLongValues(mySavedList, "topicId"));
            if (StringUtils.equals(WebUserTools.getName(), name)) {
                mav.addObject("savedCount", mySavedList.size());
            }
        } else {
            mav.addObject("mySavedList", Collections.<Long> emptyList());
        }
        return mav;
    }

    // /user/zxc337/comments/1 我的评论 别人的评论
    @RequestMapping(value = "/user/{name}/comments")
    public ModelAndView comments(@PathVariable("name")
    final String name, Integer page) {
        ModelAndView mav = new ModelAndView("item/comments");
        Long userId = 0l;
        MemberDO member = userService.find(new MemberQuery(name));
        if (member == null) {
            return mav;
        }
        if (WebUserTools.hasLogin() && StringUtils.equals(WebUserTools.getName(), member.getName())) {
            userId = WebUserTools.getUid();
        } else {
            userId = member.getId();
        }
        mav.addObject("member", member);

        CommentsQuery query = new CommentsQuery(userId);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        PaginationList<CommentsFullDO> list = commentsService.commentsListPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/user/" + name + "/comments/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        // 查出当前登录用户的投票
        List<VoteDO> voteList = commentsService.list(new VoteQuery(WebUserTools.getUid()));
        List<Long> voteLongs = CollectionUtils.getLongValues(voteList, "commentsId");

        for (CommentsFullDO full : list) {
            full.setIsVote(0);
            if (NumberParser.isEqual(WebUserTools.getUid(), full.getUserId())) {
                full.setIsVote(1);
            } else {
                if (!Argument.isEmpty(voteLongs) && voteLongs.contains(full.getId())) {
                    full.setIsVote(1);
                }
            }
        }

        mav.addObject("list", list);
        mav.addObject("commentsCount", list.getQuery().getAllRecordNum());

        int publishCount = 0;
        int likedCount = 0;

        publishCount = topicService.count(new TopicQuery(userId));
        mav.addObject("publishCount", publishCount);
        likedCount = userService.count(new CollectQuery(userId, CollectTypeEnum.LIKED));
        mav.addObject("likedCount", likedCount);

        if (WebUserTools.hasLogin()) {
            List<CollectDO> mySavedList = userService.list(new CollectQuery(WebUserTools.getUid(),
                                                                            CollectTypeEnum.SAVED));
            mav.addObject("mySavedList", CollectionUtils.getLongValues(mySavedList, "topicId"));
            if (StringUtils.equals(WebUserTools.getName(), name)) {
                mav.addObject("savedCount", mySavedList.size());
            }
        } else {
            mav.addObject("mySavedList", Collections.<Long> emptyList());
        }
        return mav;
    }

    // /user/link/saved 我的收藏
    @RequestMapping(value = "/user/link/saved")
    public ModelAndView saved(Integer page) {
        ModelAndView mav = new ModelAndView("item/saved");
        if (!WebUserTools.hasLogin()) {
            return mav;
        }

        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        if (member == null) {
            return mav;
        }
        mav.addObject("member", member);

        CollectQuery query = new CollectQuery(WebUserTools.getUid(), CollectTypeEnum.SAVED);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        PaginationList<CollectFullDO> list = userService.collectListPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/user/link/saved/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        mav.addObject("list", list);

        mav.addObject("mySavedList", CollectionUtils.getLongValues(list, "topicId"));
        mav.addObject("savedCount", list.getQuery().getAllRecordNum());

        int publishCount = 0;
        int likedCount = 0;
        int commentsCount = 0;

        publishCount = topicService.count(new TopicQuery(WebUserTools.getUid()));
        mav.addObject("publishCount", publishCount);
        likedCount = userService.count(new CollectQuery(WebUserTools.getUid(), CollectTypeEnum.LIKED));
        mav.addObject("likedCount", likedCount);
        commentsCount = commentsService.count(new CommentsQuery(WebUserTools.getUid()));
        mav.addObject("commentsCount", commentsCount);
        return mav;
    }

    // /user/chouti0004/submitted/1 网易头条的发布
    @RequestMapping(value = "/user/{name}/submitted")
    public ModelAndView userPublish(@PathVariable("name")
    final String name, Integer page) {
        ModelAndView mav = new ModelAndView("item/publish");
        if (StringUtils.isEmpty(name)) {
            return mav;
        }
        MemberDO member = userService.find(new MemberQuery(name));

        TopicQuery query = new TopicQuery(new TopicDO());
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);

        PaginationList<TopicDO> list = topicService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/user/" + name + "/submitted/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        mav.addObject("list", list);
        mav.addObject("member", member);
        return mav;
    }

    // /user/neva8987 个人首页
    // @RequestMapping(value = "/user/{name}/")
    // public ModelAndView user(@PathVariable("name")
    // String name) {
    // ModelAndView mav = new ModelAndView("item/publish");
    // if (StringUtils.isEmpty(name)) {
    // return mav;
    // }
    // MemberDO member = userService.find(new MemberQuery(name));
    // mav.addObject("member", member);
    // return mav;
    // }
}
