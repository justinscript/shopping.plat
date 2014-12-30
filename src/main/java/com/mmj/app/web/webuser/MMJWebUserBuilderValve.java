/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.webuser;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.gson.Gson;
import com.mmj.app.biz.cons.BooleanEnum;
import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.cons.UserTypeEnum;
import com.mmj.app.biz.domain.MemberThinDO;
import com.mmj.app.biz.service.interfaces.UserService;
import com.mmj.app.common.cookie.CookieKeyEnum;
import com.mmj.app.common.cookie.manager.CookieManager;
import com.mmj.app.common.pipeline.PipelineResult;
import com.mmj.app.common.pipeline.value.BaseWebUserBuilderValve;
import com.mmj.app.common.result.JsonResultUtils;
import com.mmj.app.common.result.Result;
import com.mmj.app.common.util.NumberParser;
import com.mmj.app.web.tools.InvokeTypeTools;

/**
 * @author zxc Nov 27, 2014 11:51:36 AM
 */
public class MMJWebUserBuilderValve extends BaseWebUserBuilderValve<MMJWebUser> {

    @Autowired
    private UserService userService;

    @Override
    protected MMJWebUser createWebUser(HttpServletRequest request, CookieManager cookieManager) {
        MMJWebUser webUser = MMJWebUserBuilder.create(cookieManager);
        if (webUser != null && webUser.hasLogin() && webUser.getuId() != null
            && StringUtils.isNotEmpty(webUser.getName())) {
            MemberThinDO member = userService.fetchMemberById(webUser.getuId());
            if (member != null) {
                webUser.setImg(member.getPic());
                webUser.setIsBan(BooleanEnum.getByValue(member.getIsBan()));
                webUser.setMobile(member.getMobile());
                webUser.setState(StateEnum.getEnum(member.getUserState()));
                webUser.setPasswd(member.getPasswd());
            }
        }
        return webUser;
    }

    @Override
    protected PipelineResult getToLogin(HttpServletRequest request, HttpServletResponse response, String uri)
                                                                                                             throws UnsupportedEncodingException,
                                                                                                             IOException {
        String url = loginUrl;
        // {"result":{"code":"-1", "message":"您需要先登录才能继续刚才的操作", "data":""}}
        if (InvokeTypeTools.isAjax(request)) {
            String needLoginJson = "";
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("code", "-1");
            params.put("message", "您需要先登录才能继续刚才的操作");
            params.put("data", "");
            Map<String, Object> result = new HashMap<String, Object>();
            result.put("result", params);
            try {
                needLoginJson = new Gson().toJson(result);
            } catch (Exception e) {

            }
            response.getOutputStream().write(needLoginJson.getBytes("utf-8"));
            return PipelineResult.gotoAfterCompletion("gotoLogin", null);
        }
        if (this.pathMatcher.match("/manage/**", uri)) {
            url = homeUrl + "?returnurl=" + "/manage/login";
        }
        return PipelineResult.gotoAfterCompletion("gotoLogin", url);
    }

    @Override
    protected Result judgePermission(HttpServletRequest request, HttpServletResponse response, String uri,
                                     MMJWebUser webUser) throws Exception, IOException {
        // 是否管理员
        if (!UserTypeEnum.isAdmin(webUser.getType())) {
            if (this.pathMatcher.match("/manage/**", uri)) {
                if (InvokeTypeTools.isAjax(request)) {
                    String needLogin = JsonResultUtils.getNeedLoginJson();
                    response.getOutputStream().write(needLogin.getBytes("utf-8"));
                    return Result.failed(null);
                }
                return Result.failed(StringUtils.EMPTY, homeUrl + "?returnurl=/manage/login");
            } else {
                return Result.success();
            }
        } else {
            return Result.success();
        }
        // return Result.failed(StringUtils.EMPTY, "/index.htm");
    }

    @Override
    protected boolean judgeAccessTime(CookieManager cookieManager) {
        long maxLastAccessTime = MAX_LAST_ACCESS_TIME;
        long lastLoginTime = NumberParser.parseLong(cookieManager.get(CookieKeyEnum.last_login_time), 0);
        // 操作大于1小时就自动退出
        if (lastLoginTime <= 0 || System.currentTimeMillis() - lastLoginTime > maxLastAccessTime) {
            MMJWebUserBuilder.loginOut(cookieManager);
            return false;
        }
        // 更新用户的登录时间
        cookieManager.set(CookieKeyEnum.last_login_time, StringUtils.EMPTY + System.currentTimeMillis());
        return true;
    }
}
