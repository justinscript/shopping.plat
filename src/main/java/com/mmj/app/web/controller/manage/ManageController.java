/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.controller.manage;

import java.net.URL;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mmj.app.biz.cons.CollectTypeEnum;
import com.mmj.app.biz.cons.DBSortTypeEnum;
import com.mmj.app.biz.cons.HandleStateEnum;
import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.cons.SubjectEnum;
import com.mmj.app.biz.cons.TabTypeEnum;
import com.mmj.app.biz.cons.UserTypeEnum;
import com.mmj.app.biz.domain.CollectDO;
import com.mmj.app.biz.domain.CollectFullDO;
import com.mmj.app.biz.domain.CommentsDO;
import com.mmj.app.biz.domain.FeedbackDO;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.MemberThinDO;
import com.mmj.app.biz.domain.NotificationDO;
import com.mmj.app.biz.domain.ReportDO;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.CollectQuery;
import com.mmj.app.biz.query.CommentsQuery;
import com.mmj.app.biz.query.FeedbackQuery;
import com.mmj.app.biz.query.MemberQuery;
import com.mmj.app.biz.query.ReportQuery;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.common.cons.ResultCode;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;
import com.mmj.app.common.util.DateViewTools;
import com.mmj.app.common.util.StringFormatter;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.tools.WebUserTools;

/**
 * 管理员后台
 * 
 * @author zxc Nov 27, 2014 11:49:07 AM
 */
@Controller
public class ManageController extends BaseController {

    // 管理后台登录页面
    @RequestMapping(value = "/manage/login")
    public ModelAndView login() {
        return new ModelAndView("manage/login");
    }

    // 后台登录
    @RequestMapping(value = "/manage/doLogin")
    public ModelAndView doLogin(String name, String passwd) {
        ModelAndView mav = new ModelAndView();
        mav.setViewName("manage/login");
        List<String> menuList = getShowMenuBar(request);

        if (StringUtils.isEmpty(name) || StringUtils.isEmpty(passwd)) {
            mav.addObject("error", "登录出错!用户名或密码不可为空!");
            return mav;
        }
        MemberDO member = userService.find(new MemberQuery(name));
        if (member == null) {
            mav.addObject("error", "登录出错!用户名不存在或用户名错误!");
            return mav;
        }
        if (!StringUtils.equals(passwd, member.getPassword())) {
            mav.addObject("error", "登录出错!密码错误!");
            return mav;
        }
        doLoginSuccess(member);
        WebUserTools.current().setNick(member.getNick());
        mav.setViewName("manage/home");
        mav.addObject("menuList", menuList);
        return mav;
    }

    @RequestMapping(value = "/manage/home")
    public ModelAndView home() {
        ModelAndView mav = new ModelAndView("manage/home");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        return mav;
    }

    // 后台退出
    @RequestMapping(value = "/manage/logout")
    public ModelAndView logout() {
        doLoginOut();
        return new ModelAndView("manage/login");
    }

    @RequestMapping(value = "/manage/{type}_count")
    public ModelAndView count(@PathVariable("type")
    String type) {
        ModelAndView mav = new ModelAndView("manage/count");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        if (StringUtils.isEmpty(type)) {
            return mav;
        }
        Integer allCount = 0;
        Integer delCount = 0;
        Integer unDelCount = 0;
        Integer yesterdayCount = 0;
        Integer weekCount = 0;

        if (StringUtils.equals(type, "user")) {
            MemberQuery query = new MemberQuery();
            query.setStatus(null);
            query.getT().setStatus(null);
            allCount = userService.count(query);

            query.setStatus(1);
            delCount = userService.count(query);

            query.setStatus(0);
            unDelCount = userService.count(query);

            query.setStatus(null);
            query.setStartGmtCreate(DateViewTools.yesterdayFull());
            yesterdayCount = userService.count(query);

            query.setStartGmtCreate(DateViewTools.getDayBefore(7));
            weekCount = userService.count(query);

            mav.addObject("desc", "用户");
        }
        if (StringUtils.equals(type, "publish")) {
            TopicQuery query = new TopicQuery();
            query.setStatus(null);
            query.getT().setStatus(null);
            allCount = topicService.count(query);

            query.setStatus(1);
            delCount = topicService.count(query);

            query.setStatus(0);
            unDelCount = topicService.count(query);

            query.setStatus(null);
            query.setStartGmtCreate(DateViewTools.yesterdayFull());
            yesterdayCount = topicService.count(query);

            query.setStartGmtCreate(DateViewTools.getDayBefore(7));
            weekCount = topicService.count(query);

            mav.addObject("desc", "发布");
        }
        if (StringUtils.equals(type, "comments")) {
            CommentsQuery query = new CommentsQuery();
            query.setStatus(null);
            query.getT().setStatus(null);
            allCount = commentsService.count(query);

            query.setStatus(1);
            delCount = commentsService.count(query);

            query.setStatus(0);
            unDelCount = commentsService.count(query);

            query.setStatus(null);
            query.setStartGmtCreate(DateViewTools.yesterdayFull());
            yesterdayCount = commentsService.count(query);

            query.setStartGmtCreate(DateViewTools.getDayBefore(7));
            weekCount = commentsService.count(query);

            mav.addObject("desc", "评论");
        }

        mav.addObject("allCount", allCount);
        mav.addObject("delCount", delCount);
        mav.addObject("unDelCount", unDelCount);
        mav.addObject("yesterdayCount", yesterdayCount);
        mav.addObject("weekCount", weekCount);
        return mav;
    }

    @RequestMapping(value = "/manage/update")
    public ModelAndView update(Long id, String handle, String source) {
        if (StringUtils.isEmpty(source) || Argument.isNotPositive(id) || StringUtils.isEmpty(handle)) {
            return createJsonMav("操作失败,参数不正确!", ResultCode.ERROR, "");
        }
        switch (source) {
            case "user":
                MemberThinDO memberThin = userService.fetchMemberById(id);
                if (memberThin == null) {
                    return createJsonMav("操作失败,id参数为空,参数不正确!", ResultCode.ERROR, "");
                }
                MemberDO member = new MemberDO(id);
                if (StringUtils.equals(handle, "ban")) {
                    member.setIsBan(1);
                } else if (StringUtils.equals(handle, "noban")) {
                    member.setIsBan(0);
                } else if (StringUtils.equals(handle, "state")) {
                    member.setUserState(1);
                } else if (StringUtils.equals(handle, "nostate")) {
                    member.setUserState(0);
                } else if (StringUtils.equals(handle, "delete")) {
                    member.setStatus(1);
                } else if (StringUtils.equals(handle, "nodelete")) {
                    member.setStatus(0);
                }
                userService.update(member);
                break;

            case "publish":
                TopicDO topicDO = topicService.getTopicById(id);
                if (topicDO == null) {
                    return createJsonMav("操作失败,id参数为空,参数不正确!", ResultCode.ERROR, "");
                }
                if (StringUtils.equals(handle, "recommend")) {
                    userService.add(new CollectDO(WebUserTools.getUid(), id, CollectTypeEnum.SAVED));
                } else if (StringUtils.equals(handle, "norecommend")) {
                    CollectDO collect = userService.find(new CollectQuery(WebUserTools.getUid(), id,
                                                                          CollectTypeEnum.SAVED));
                    if (collect == null) {
                        return createJsonMav("操作成功", ResultCode.SUCCESS, "");
                    }
                    userService.realDeleteCollect(collect.getId());
                }

                TopicDO topic = new TopicDO();
                topic.setStatus(null);
                topic.setId(id);
                if (StringUtils.equals(handle, "ban")) {
                    topic.setIsBan(1);
                } else if (StringUtils.equals(handle, "noban")) {
                    topic.setIsBan(0);
                } else if (StringUtils.equals(handle, "state")) {
                    topic.setTopicState(1);
                } else if (StringUtils.equals(handle, "nostate")) {
                    topic.setTopicState(0);
                } else if (StringUtils.equals(handle, "delete")) {
                    topic.setStatus(1);
                } else if (StringUtils.equals(handle, "nodelete")) {
                    topic.setStatus(0);
                }
                topicService.update(topic);
                break;

            case "comments":
                CommentsDO commentsDO = commentsService.getCommentsById(id);
                if (commentsDO == null) {
                    return createJsonMav("操作失败,id参数为空,参数不正确!", ResultCode.ERROR, "");
                }
                CommentsDO comments = new CommentsDO(id);
                if (StringUtils.equals(handle, "ban")) {
                    comments.setIsBan(1);
                } else if (StringUtils.equals(handle, "noban")) {
                    comments.setIsBan(0);
                } else if (StringUtils.equals(handle, "delete")) {
                    comments.setStatus(1);
                } else if (StringUtils.equals(handle, "nodelete")) {
                    comments.setStatus(0);
                }
                commentsService.update(comments);
                break;

            case "feedback":
                FeedbackDO feedbackDO = userService.getFeedbackById(id);
                if (feedbackDO == null) {
                    return createJsonMav("操作失败,id参数为空,参数不正确!", ResultCode.ERROR, "");
                }
                FeedbackDO feedback = new FeedbackDO(id);
                if (StringUtils.equals(handle, "delete")) {
                    feedback.setStatus(1);
                } else if (StringUtils.equals(handle, "nodelete")) {
                    feedback.setStatus(0);
                }
                userService.update(feedback);
                break;

            case "recommend":
                if (StringUtils.equals(handle, "recommend")) {
                    userService.add(new CollectDO(WebUserTools.getUid(), id, CollectTypeEnum.SAVED));
                } else if (StringUtils.equals(handle, "norecommend")) {
                    CollectDO collect = userService.find(new CollectQuery(WebUserTools.getUid(), id,
                                                                          CollectTypeEnum.SAVED));
                    if (collect == null) {
                        return createJsonMav("操作成功", ResultCode.SUCCESS, "");
                    }
                    userService.realDeleteCollect(collect.getId());
                }

                break;

            default:
                return createJsonMav("操作失败,参数不正确!", ResultCode.ERROR, "");
        }
        return createJsonMav("操作成功", ResultCode.SUCCESS, "");
    }

    @RequestMapping(value = "/manage/updateSubject")
    public ModelAndView updateSubject(Long id, Integer subjectId) {
        if (Argument.isNotPositive(id) || subjectId == null) {
            return createJsonMav("操作失败,参数不正确!", ResultCode.ERROR, "");
        }
        TopicDO topicDO = topicService.getTopicById(id);
        if (topicDO == null) {
            return createJsonMav("操作失败,参数不正确!", ResultCode.ERROR, "");
        }
        TopicDO topic = new TopicDO();
        topic.setStatus(null);
        topic.setId(id);
        topic.setSubjectId(subjectId);
        topicService.update(topic);
        return createJsonMav("操作成功", ResultCode.SUCCESS, SubjectEnum.getEnum(subjectId).getDesc());
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 用户管理
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    @RequestMapping(value = "/manage/user")
    public ModelAndView user(Integer page, String name, Integer sex, Integer state, String start, String end) {
        ModelAndView mav = new ModelAndView("manage/user");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        MemberQuery query = new MemberQuery(UserTypeEnum.GENERAL);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        String _url = "?name=" + (name == null ? "" : name) + "&start=" + (start == null ? "" : start) + "&end="
                      + (end == null ? "" : end);
        if (StringUtils.isNotEmpty(name)) {
            query.setNameLike(name);
            mav.addObject("name", name);
        }
        if (sex != null) {
            query.getT().setSex(sex);
            mav.addObject("sex", sex);
            _url = _url + "&sex=" + sex;
        }
        if (state != null) {
            query.getT().setUserState(state);
            mav.addObject("state", state);
            _url = _url + "&state=" + state;
        }
        if (StringUtils.isNotEmpty(start)) {
            query.setStartGmtCreate(start);
            mav.addObject("start", start);
        }
        if (StringUtils.isNotEmpty(end)) {
            query.setEndGmtCreate(end);
            mav.addObject("end", end);
        }

        final String url = _url;

        PaginationList<MemberDO> list = userService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/user/" + (Integer) objs[1] + url;
            }
        });
        mav.addObject("list", list);
        mav.addObject("source", "user");
        return mav;
    }

    @RequestMapping(value = "/manage/jifeng")
    public ModelAndView jifeng(Integer page) {
        ModelAndView mav = new ModelAndView("manage/jifeng");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        MemberQuery query = new MemberQuery(UserTypeEnum.GENERAL);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        PaginationList<MemberDO> list = userService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/jifeng/" + (Integer) objs[1];
            }
        });
        mav.addObject("list", list);
        mav.addObject("source", "jifeng");
        return mav;
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 发布管理
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    @RequestMapping(value = "/manage/publish")
    public ModelAndView publish(Integer page, String title, Integer subject, Integer state, String start, String end) {
        ModelAndView mav = new ModelAndView("manage/publish");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        TopicQuery query = new TopicQuery();
        query.getT().setTopicState(null);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        String _url = "?title=" + (title == null ? "" : title) + "&start=" + (start == null ? "" : start) + "&end="
                      + (end == null ? "" : end);
        if (StringUtils.isNotEmpty(title)) {
            query.getT().setTitle(title);
            mav.addObject("title", title);
        }
        if (subject != null) {
            query.getT().setSubjectId(subject);
            mav.addObject("subject", subject);
            _url = _url + "&subject=" + subject;
        }
        if (state != null) {
            query.getT().setTopicState(state);
            mav.addObject("state", state);
            _url = _url + "&state=" + state;
        }
        if (StringUtils.isNotEmpty(start)) {
            query.setStartGmtCreate(start);
            mav.addObject("start", start);
        }
        if (StringUtils.isNotEmpty(end)) {
            query.setEndGmtCreate(end);
            mav.addObject("end", end);
        }

        final String url = _url;

        PaginationList<TopicDO> list = topicService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/publish/" + (Integer) objs[1] + url;
            }
        });
        initUserInfo4List(list);

        getMyLikedAndSaved(mav);

        mav.addObject("list", list);
        mav.addObject("source", "publish");
        return mav;
    }

    @RequestMapping(value = "/manage/delPublish")
    public ModelAndView publish(Integer page) {
        ModelAndView mav = new ModelAndView("manage/delPublish");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        TopicQuery query = new TopicQuery();
        query.setStatus(StatusEnum.DELETE.getValue());
        query.getT().setTopicState(null);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        PaginationList<TopicDO> list = topicService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/delPublish/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        getMyLikedAndSaved(mav);

        mav.addObject("list", list);
        mav.addObject("source", "publish");
        return mav;
    }

    // 提交彻底删除发布记录
    @RequestMapping(value = "/manage/realDelPublish")
    public ModelAndView realDelPublish(Long id) {
        if (Argument.isNotPositive(id)) {
            return createJsonMav("操作失败,参数不正确!", ResultCode.ERROR, "");
        }
        TopicDO topicDO = topicService.getTopicById(id);
        if (topicDO == null) {
            return createJsonMav("操作失败,参数不正确!", ResultCode.ERROR, "");
        }
        topicService.realDeleteTopic(id);
        return createJsonMav("操作成功", ResultCode.SUCCESS, "");
    }

    // 具体用户的发布管理
    @RequestMapping(value = "/manage/publish/{uId}")
    public ModelAndView publishUser(@PathVariable("uId")
    final Long uId, Integer page) {
        ModelAndView mav = new ModelAndView("manage/publish");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);
        MemberThinDO memberThin = userService.fetchMemberById(uId);
        if (memberThin == null) {
            return mav;
        }

        TopicQuery query = new TopicQuery(uId);
        query.getT().setTopicState(null);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        PaginationList<TopicDO> list = topicService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/publish/" + uId + "/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        getMyLikedAndSaved(mav);

        mav.addObject("list", list);
        mav.addObject("publish", "【" + memberThin.getNick() + "】" + "的发布");
        mav.addObject("source", "publish");
        return mav;
    }

    // 新增发布
    @RequestMapping(value = "/manage/addPublish")
    public ModelAndView addPublish() {
        ModelAndView mav = new ModelAndView("manage/publishEdit");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);
        mav.addObject("source", "publish");
        mav.addObject("show", "新增发布");
        return mav;
    }

    // 新增发布
    @RequestMapping(value = "/manage/doPublish")
    public ModelAndView doPublish(Integer subjectId, String title, String url, String content, String imgUrl, Long id) {
        ModelAndView mav = new ModelAndView("manage/publishEdit");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);
        mav.addObject("source", "publish");

        TopicDO topic = new TopicDO(WebUserTools.getUid(), WebUserTools.getName());
        topic.setTopicState(StateEnum.NORMAL.getValue());
        topic.setTabType(TabTypeEnum.ZIXUN.getValue());
        topic.setSubjectId(subjectId);
        topic.setTitle(title);
        topic.setLinkUrl(url);
        topic.setOriginalUrl(url);
        topic.setContent(content);
        topic.setImgUrl(imgUrl);
        topic.setYellow(0);
        mav.addObject("topic", topic);
        if (StringUtils.isEmpty(title)) {
            mav.addObject("errorMsg", "标题不可以为空");
            return mav;
        }
        float titleSize = StringFormatter.getWordSize(title);
        if (titleSize > 1500) {
            mav.addObject("errorMsg", "您发布的标题过长，请重新发布,超了" + (titleSize - 150) + "个字");
            return mav;
        }
        if (SubjectEnum.getEnum(subjectId) == null) {
            mav.addObject("errorMsg", "发布类别为空");
            return mav;
        }

        // 创建发布
        try {
            URL lUrl = new URL(url);
            topic.setContentSource(lUrl.getHost());
        } catch (Exception e) {
            logger.error("parser url error!url={}", url);
            mav.addObject("errorMsg", "链接不正确");
            return mav;
        }
        if (Argument.isNotPositive(id)) {
            topicService.add(topic);
            mav.addObject("successMsg", "新增发布成功");
        } else {
            topic.setId(id);
            TopicDO topicDO = topicService.getTopicById(id);
            if (topicDO == null) {
                mav.addObject("errorMsg", "参数不正确");
                return mav;
            }
            topic.setUserId(topicDO.getUserId());
            topic.setName(topicDO.getName());
            topicService.update(topic);
            mav.addObject("successMsg", "更新发布成功");
        }
        mav.addObject("show", "编辑发布");
        return mav;
    }

    // 编辑发布
    @RequestMapping(value = "/manage/publishEdit/{id}")
    public ModelAndView publishEdit(@PathVariable("id")
    final Long id) {
        ModelAndView mav = new ModelAndView("manage/publishEdit");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);
        mav.addObject("source", "publish");

        if (Argument.isNotPositive(id)) {
            return mav;
        }
        TopicDO topic = topicService.getTopicById(id);
        if (topic == null) {
            return mav;
        }
        initUserInfo4Base(topic);
        mav.addObject("topic", topic);
        mav.addObject("show", "编辑发布");
        return mav;
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 评论管理
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    @RequestMapping(value = "/manage/comments")
    public ModelAndView comments(Integer page, String keyword, Integer ban, Integer status, String start, String end) {
        ModelAndView mav = new ModelAndView("manage/comments");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        CommentsQuery query = new CommentsQuery();
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        String _url = "?keyword=" + (keyword == null ? "" : keyword) + "&start=" + (start == null ? "" : start)
                      + "&end=" + (end == null ? "" : end);
        if (StringUtils.isNotEmpty(keyword)) {
            query.getT().setContent(keyword);
            mav.addObject("keyword", keyword);
        }
        if (ban != null) {
            query.getT().setIsBan(ban);
            mav.addObject("ban", ban);
            _url = _url + "&ban=" + ban;
        }
        if (status != null) {
            query.getT().setStatus(status);
            mav.addObject("status", status);
        }
        if (StringUtils.isNotEmpty(start)) {
            query.setStartGmtCreate(start);
            mav.addObject("start", start);
        }
        if (StringUtils.isNotEmpty(end)) {
            query.setEndGmtCreate(end);
            mav.addObject("end", end);
        }

        final String url = _url;

        PaginationList<CommentsDO> list = commentsService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/comments/" + (Integer) objs[1] + url;
            }
        });
        initUserInfo4List(list);

        mav.addObject("list", list);
        mav.addObject("source", "comments");
        return mav;
    }

    // 具体用户的评论管理
    @RequestMapping(value = "/manage/comments/{uId}")
    public ModelAndView commentsUser(@PathVariable("uId")
    final Long uId, Integer page) {
        ModelAndView mav = new ModelAndView("manage/comments");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);
        MemberThinDO memberThin = userService.fetchMemberById(uId);
        if (memberThin == null) {
            return mav;
        }

        CommentsQuery query = new CommentsQuery(uId);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        PaginationList<CommentsDO> list = commentsService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/comments/" + uId + "/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        mav.addObject("list", list);
        mav.addObject("publish", "【" + memberThin.getNick() + "】" + "的评论");
        mav.addObject("source", "comments");
        return mav;
    }

    // 具体发布的评论管理
    @RequestMapping(value = "/manage/comments/publish/{topicId}")
    public ModelAndView commentsPublish(@PathVariable("topicId")
    final Long topicId, Integer page) {
        ModelAndView mav = new ModelAndView("manage/comments");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        TopicDO topic = topicService.getTopicById(topicId);
        if (topic == null) {
            return mav;
        }

        CommentsQuery query = new CommentsQuery(null, topicId);
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        PaginationList<CommentsDO> list = commentsService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/comments/publish/" + topicId + "/" + (Integer) objs[1];
            }
        });
        initUserInfo4List(list);

        String title = topic.getTitle();
        title = StringUtils.substring(title, 0, 10);

        mav.addObject("list", list);
        mav.addObject("publish", "【" + title + "...】" + "的评论");
        mav.addObject("source", "comments");
        return mav;
    }

    // 意见反馈
    @RequestMapping(value = "/manage/feedback")
    public ModelAndView feedback(Integer page, String name, Integer handle, Integer status, String start, String end) {
        ModelAndView mav = new ModelAndView("manage/feedback");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        FeedbackQuery query = new FeedbackQuery();
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        String _url = "?name=" + (name == null ? "" : name) + "&start=" + (start == null ? "" : start) + "&end="
                      + (end == null ? "" : end);
        if (StringUtils.isNotEmpty(name)) {
            query.setNameLike(name);
            mav.addObject("name", name);
        }
        if (handle != null) {
            query.getT().setHandleState(handle);
            mav.addObject("ban", handle);
            _url = _url + "&handle=" + handle;
        }
        if (status != null) {
            query.getT().setStatus(status);
            mav.addObject("status", status);
            _url = _url + "&status=" + status;
        }
        if (StringUtils.isNotEmpty(start)) {
            query.setStartGmtCreate(start);
            mav.addObject("start", start);
        }
        if (StringUtils.isNotEmpty(end)) {
            query.setEndGmtCreate(end);
            mav.addObject("end", end);
        }

        final String url = _url;

        PaginationList<FeedbackDO> list = userService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/feedback/" + (Integer) objs[1] + url;
            }
        });
        mav.addObject("list", list);
        mav.addObject("source", "feedback");
        return mav;
    }

    // 爬虫数据库
    @RequestMapping(value = "/manage/sprider")
    public ModelAndView sprider() {
        ModelAndView mav = new ModelAndView("manage/sprider");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        return mav;
    }

    // 推荐列表
    @RequestMapping(value = "/manage/recommend")
    public ModelAndView recommend() {
        ModelAndView mav = new ModelAndView("manage/recommend");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        CollectQuery query = new CollectQuery(WebUserTools.getUid(), CollectTypeEnum.SAVED);
        query.setPageSize(100);
        List<CollectFullDO> list = userService.collectListPagination(query);
        initUserInfo4List(list);

        mav.addObject("mySavedList", list);
        mav.addObject("source", "recommend");
        return mav;
    }

    /**
     * 发通知页面
     * 
     * @param uId
     * @return
     */
    @RequestMapping(value = "/manage/notice")
    public ModelAndView notice(Long uId) {
        ModelAndView mav = new ModelAndView("manage/notice");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);
        if (Argument.isNotPositive(uId)) {
            return mav;
        }
        MemberDO member = userService.getMemberById(uId);
        mav.addObject("member", member);
        mav.addObject("source", "notice");
        return mav;
    }

    /**
     * 向用户发送通知
     * 
     * @param uId
     * @param content
     * @return
     */
    @RequestMapping(value = "/manage/sendNotice")
    public ModelAndView sendNotice(Long uId, String content) {
        if (Argument.isNotPositive(uId) || StringUtils.isEmpty(content)) {
            return createJsonMav("发送失败,参数不正确!", ResultCode.ERROR, "");
        }
        letterService.add(new NotificationDO(WebUserTools.getUid(), uId, content));
        return createJsonMav("发送成功", ResultCode.ERROR, "");
    }

    @RequestMapping(value = "/manage/report")
    public ModelAndView report(final Integer page) {
        ModelAndView mav = new ModelAndView("manage/report");
        List<String> menuList = getShowMenuBar(request);
        mav.addObject("menuList", menuList);

        ReportQuery query = new ReportQuery();
        query.setNowPageIndex(Argument.isNotPositive(page) ? 0 : page - 1);
        query.setSortType(DBSortTypeEnum.GMT_CREATE);

        PaginationList<ReportDO> list = commentsService.listPagination(query, new IPageUrl() {

            @Override
            public String parsePageUrl(Object... objs) {
                return "/manage/feedback/" + (Integer) objs[1];
            }
        });
        mav.addObject("list", list);
        mav.addObject("source", "report");
        return mav;
    }

    @RequestMapping(value = "/manage/updateHandle")
    public ModelAndView updateHandle(Long id, Integer handleId, String source) {
        if (Argument.isNotPositive(id) || handleId == null || StringUtils.isEmpty(source)) {
            return createJsonMav("操作失败,参数不正确!", ResultCode.ERROR, "");
        }
        if (StringUtils.equals("report", source)) {
            ReportDO report = commentsService.getReportById(id);
            if (report == null) {
                return createJsonMav("操作失败,id参数为空,参数不正确!", ResultCode.ERROR, "");
            }
            commentsService.update(new ReportDO(id, HandleStateEnum.getEnum(handleId)));
        } else if (StringUtils.equals("feedback", source)) {
            FeedbackDO feedback = userService.getFeedbackById(id);
            if (feedback == null) {
                return createJsonMav("操作失败,id参数为空,参数不正确!", ResultCode.ERROR, "");
            }
            userService.update(new FeedbackDO(id, HandleStateEnum.getEnum(handleId)));
        }
        return createJsonMav("操作成功", ResultCode.SUCCESS, HandleStateEnum.getEnum(handleId).getDesc());
    }

    /**
     * 从Cookie中取出需要显示的菜单条
     * 
     * @param request
     * @return
     */
    private List<String> getShowMenuBar(HttpServletRequest request) {
        Cookie cookies[] = request.getCookies();
        Cookie sCookie = null;
        String svalue = null;
        String sname = null;
        for (int i = 0; i < cookies.length; i++) {
            sCookie = cookies[i];
            sname = sCookie.getName();
            if ("menuConfig".equals(sname)) {
                svalue = sCookie.getValue();
                if (svalue != null) {
                    return Arrays.asList(svalue.split("-_-"));
                }
                return Collections.<String> emptyList();
            }
        }
        return Collections.<String> emptyList();
    }
}
