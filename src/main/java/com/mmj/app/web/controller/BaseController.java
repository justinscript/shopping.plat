/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller;

import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.mmj.app.biz.cons.CollectTypeEnum;
import com.mmj.app.biz.domain.BaseDO;
import com.mmj.app.biz.domain.CollectDO;
import com.mmj.app.biz.domain.CollectFullDO;
import com.mmj.app.biz.domain.CommentsDO;
import com.mmj.app.biz.domain.CommentsFullDO;
import com.mmj.app.biz.domain.DialogDO;
import com.mmj.app.biz.domain.DialogFullDO;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.MemberThinDO;
import com.mmj.app.biz.domain.NotificationDO;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.CollectQuery;
import com.mmj.app.biz.service.interfaces.CommentsService;
import com.mmj.app.biz.service.interfaces.FileService;
import com.mmj.app.biz.service.interfaces.LetterService;
import com.mmj.app.biz.service.interfaces.TopicService;
import com.mmj.app.biz.service.interfaces.UserService;
import com.mmj.app.common.component.ComponentController;
import com.mmj.app.common.cons.ResultCode;
import com.mmj.app.common.core.lang.CollectionUtils;
import com.mmj.app.common.notify.NotifyService;
import com.mmj.app.common.result.Result;
import com.mmj.app.lucene.search.pojo.TopicSearchField;
import com.mmj.app.lucene.search.pojo.UserSearchField;
import com.mmj.app.web.cons.WebAppInterface;
import com.mmj.app.web.tools.WebUserTools;
import com.mmj.app.web.webuser.MMJWebUserBuilder;

/**
 * @author zxc Jun 15, 2014 11:15:54 PM
 */
@Validated
@ControllerAdvice
public class BaseController extends ComponentController implements WebAppInterface {

    // @Value("${web.app.host}")
    protected String          WEB_APP_HOST = "http://121.40.160.6";

    // 业务层服务对象注入
    @Autowired
    protected FileService     fileService;

    @Autowired
    private NotifyService     notifyService;

    @Autowired
    protected UserService     userService;
    @Autowired
    protected TopicService    topicService;
    @Autowired
    protected CommentsService commentsService;
    @Autowired
    protected LetterService   letterService;

    protected <T extends BaseDO> void initUserInfo4Base(T object) {
        if (object == null) {
            return;
        }

        if (object instanceof TopicDO) {
            MemberThinDO member = userService.fetchMemberById(((TopicDO) object).getUserId());
            if (member != null) {
                ((TopicDO) object).setNick(member.getNick());
                ((TopicDO) object).setNickImgurl(member.getPic());
            }
        }
        if (object instanceof DialogDO || object instanceof DialogFullDO) {
            MemberThinDO senderMember = userService.fetchMemberById(((DialogDO) object).getSenderUserId());
            ((DialogDO) object).setSenderNick(senderMember.getNick());
            ((DialogDO) object).setSenderNickImgUrl(senderMember.getPic());

            MemberThinDO recipientMember = userService.fetchMemberById(((DialogDO) object).getRecipientUserId());
            ((DialogDO) object).setRecipientNick(recipientMember.getNick());
            ((DialogDO) object).setRecipientNickImgUrl(recipientMember.getPic());
        }
        if (object instanceof CommentsDO || object instanceof CommentsFullDO) {
            MemberThinDO member = userService.fetchMemberById(((CommentsDO) object).getUserId());
            if (member != null) {
                ((CommentsDO) object).setNick(member.getNick());
                ((CommentsDO) object).setNickImgurl(member.getPic());
            }
        }
        if (object instanceof CollectFullDO) {
            MemberThinDO member = userService.fetchMemberById(((CollectFullDO) object).getUserId());
            if (member != null) {
                ((CollectFullDO) object).setNick(member.getNick());
                ((CollectFullDO) object).setNickImgurl(member.getPic());
                ((CollectFullDO) object).setName(member.getName());
            }
        }
    }

    protected void initUserInfo4List(List<?> list) {
        for (Object object : list) {
            if (object == null) {
                continue;
            }

            if (object instanceof TopicSearchField) {
                MemberThinDO member = userService.fetchMemberById(((TopicSearchField) object).getUserId());
                if (member != null) {
                    ((TopicSearchField) object).setNick(member.getNick());
                    ((TopicSearchField) object).setNickImgurl(member.getPic());
                }
            }
            if (object instanceof UserSearchField) {
                MemberThinDO member = userService.fetchMemberById(((UserSearchField) object).getId());
                if (member != null) {
                    ((UserSearchField) object).setNick(member.getNick());
                    ((UserSearchField) object).setPic(member.getPic());
                }
            }

            if (object instanceof TopicDO) {
                MemberThinDO member = userService.fetchMemberById(((TopicDO) object).getUserId());
                if (member != null) {
                    ((TopicDO) object).setNick(member.getNick());
                    ((TopicDO) object).setNickImgurl(member.getPic());
                }
            }
            if (object instanceof DialogDO || object instanceof DialogFullDO) {
                MemberThinDO senderMember = userService.fetchMemberById(((DialogDO) object).getSenderUserId());
                if (senderMember != null) {
                    ((DialogDO) object).setSenderNick(senderMember.getNick());
                    ((DialogDO) object).setSenderNickImgUrl(senderMember.getPic());
                }

                MemberThinDO recipientMember = userService.fetchMemberById(((DialogDO) object).getRecipientUserId());
                if (senderMember != null) {
                    ((DialogDO) object).setRecipientNick(recipientMember.getNick());
                    ((DialogDO) object).setRecipientNickImgUrl(recipientMember.getPic());
                }
            }
            if (object instanceof CommentsDO || object instanceof CommentsFullDO) {
                MemberThinDO member = userService.fetchMemberById(((CommentsDO) object).getUserId());
                if (member != null) {
                    ((CommentsDO) object).setNick(member.getNick());
                    ((CommentsDO) object).setNickImgurl(member.getPic());
                }
            }
            if (object instanceof CollectFullDO) {
                MemberThinDO member = userService.fetchMemberById(((CollectFullDO) object).getUserId());
                if (member != null) {
                    ((CollectFullDO) object).setNick(member.getNick());
                    ((CollectFullDO) object).setNickImgurl(member.getPic());
                    ((CollectFullDO) object).setName(member.getName());
                }
            }
            if (object instanceof NotificationDO) {
                MemberThinDO destMember = userService.fetchMemberById(((NotificationDO) object).getUserId());
                MemberThinDO fromMember = userService.fetchMemberById(((NotificationDO) object).getActionUserId());
                if (destMember != null) {
                    ((NotificationDO) object).setName(destMember.getName());
                    ((NotificationDO) object).setNick(destMember.getNick());
                    ((NotificationDO) object).setPic(destMember.getPic());
                }
                if (fromMember != null) {
                    ((NotificationDO) object).setActionName(fromMember.getName());
                    ((NotificationDO) object).setActionNick(fromMember.getNick());
                    ((NotificationDO) object).setActionPic(fromMember.getPic());
                }
            }
        }
    }

    protected void getMyLikedAndSaved(ModelAndView mav) {
        // 我所有的收藏,喜欢
        if (WebUserTools.hasLogin()) {
            List<CollectDO> myLikedList = userService.list(new CollectQuery(WebUserTools.getUid(),
                                                                            CollectTypeEnum.LIKED));
            List<CollectDO> mySavedList = userService.list(new CollectQuery(WebUserTools.getUid(),
                                                                            CollectTypeEnum.SAVED));
            mav.addObject("myLikedList", CollectionUtils.getLongValues(myLikedList, "topicId"));
            mav.addObject("mySavedList", CollectionUtils.getLongValues(mySavedList, "topicId"));
        } else {
            mav.addObject("myLikedList", Collections.<Long> emptyList());
            mav.addObject("mySavedList", Collections.<Long> emptyList());
        }
    }

    /**
     * 返回未通过验证信息
     * 
     * @param result
     * @return
     */
    public Result showErrors(BindingResult result) {
        StringBuffer errorsb = new StringBuffer();
        if (result.hasErrors()) {
            for (FieldError error : result.getFieldErrors()) {
                errorsb.append(error.getField());
                errorsb.append(error.getDefaultMessage());
                errorsb.append("|");
            }
            String errorsr = errorsb.toString().substring(0, errorsb.toString().length() - 1);
            Result.failed(errorsr.replaceAll("null", StringUtils.EMPTY));
        }
        return Result.success();
    }

    /**
     * 写入登录cookie信息到当前线程response中
     * 
     * @param TravelMemberDO
     */
    public void doLoginSuccess(MemberDO m) {
        MMJWebUserBuilder.loginSuccess(cookieManager, m.getName(), m.getNick(), m.getId(), m.getUserType());
        userService.update(new MemberDO(m.getId(), new Date()));
    }

    /**
     * 更新退出cookie信息到当前线程response中
     */
    public void doLoginOut() {
        MMJWebUserBuilder.loginOut(cookieManager);
    }

    protected ModelAndView createErrorJsonMav(String msg) {
        return createJsonMav(msg, ResultCode.ERROR, null);
    }

    protected ModelAndView createSuccJsonMav(String msg) {
        return createJsonMav(msg, ResultCode.SUCCESS, null);
    }

    protected ModelAndView createErrorJsonMav(String msg, Object object) {
        return createJsonMav(msg, ResultCode.ERROR, object);
    }

    protected ModelAndView createExtSuccJsonMav(String msg, String extMst) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("extMst", "");
        return createJsonMav(msg, ResultCode.SUCCESS, map);
    }

    protected ModelAndView createExtJsonMav(String code, String msg, String extMst) {
        Map<String, String> ext = new HashMap<String, String>();
        ext.put("extMst", "");
        return createJsonMav(code, msg, ext);
    }

    protected ModelAndView createJsonMav(String code, String msg, Object object) {
        ModelAndView mav = new ModelAndView();
        MappingJackson2JsonView mappingJackson2JsonView = new MappingJackson2JsonView();
        mappingJackson2JsonView.getObjectMapper().setSerializationInclusion(Include.NON_NULL);
        mav.setView(mappingJackson2JsonView);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("code", code);
        map.put("message", msg);
        map.put("data", object);
        mav.addObject("result", map);
        return mav;
    }

    protected ModelAndView createSuccJsonMav(String msg, Object object) {
        return createJsonMav(msg, ResultCode.SUCCESS, object);
    }

    @Override
    protected ModelAndView createJsonMav(String msg, ResultCode code) {
        return createJsonMav(msg, code, null);
    }

    @Override
    protected ModelAndView createJsonMav(ResultCode code, Object object) {
        return createJsonMav(StringUtils.EMPTY, code, object);
    }

    @Override
    protected ModelAndView createJsonMav(String msg, ResultCode code, Object object) {
        ModelAndView mav = new ModelAndView();
        mav.setView(new MappingJackson2JsonView());
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("code", Integer.toString(code.value));
        map.put("message", msg);
        map.put("data", object == null ? StringUtils.EMPTY : object);
        mav.addObject("result", map);
        return mav;
    }
}
