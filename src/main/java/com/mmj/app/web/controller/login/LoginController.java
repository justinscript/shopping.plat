/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.login;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mmj.app.biz.cons.DBSortTypeEnum;
import com.mmj.app.biz.cons.TopicOrderTimeEnum;
import com.mmj.app.biz.cons.UserTypeEnum;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.MemberQuery;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;
import com.mmj.app.common.result.JsonResultUtils;
import com.mmj.app.common.result.JsonResultUtils.JsonResult;
import com.mmj.app.common.util.DateViewTools;
import com.mmj.app.common.util.StringFormatter;
import com.mmj.app.web.controller.BaseController;

/**
 * 登录,注册,授权,权限 控制器
 * 
 * @author zxc Jun 16, 2014 2:33:47 PM
 */
@Controller
public class LoginController extends BaseController {

    @RequestMapping(value = "/chat")
    public ModelAndView chat(Integer page) {
        final String orderTime = "recent";
        ModelAndView mav = new ModelAndView("chat");
        TopicOrderTimeEnum orderTimeEnum = TopicOrderTimeEnum.getEnum(orderTime);

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

    @RequestMapping(value = "/")
    public String home() {
        // ModelAndView mav = new ModelAndView("index");
        // return mav;
        return "forward:/all/hot/recent?page=1";
    }

    @RequestMapping(value = "/404.html")
    public ModelAndView notFound() {
        ModelAndView mav = new ModelAndView("404");
        return mav;
    }

    /**
     * 首页
     * 
     * @return
     */
    @RequestMapping(value = "/index.htm")
    public String index() {
        // ModelAndView mav = new ModelAndView("index");
        return "forward:/all/hot/recent?page=1";
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///
    // ///
    // ///
    // ///
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 用户注册时用户名验证
    // {"result":{"code":"9999", "message":"", "data":{"extMst":""}}}
    // {"result":{"code":"21103", "message":"用户名已被注册，请换一个试试", "data":{"extMst":""}}}
    @RequestMapping(value = "/profile/user/notexist")
    public ModelAndView userNotexist(String jid) {
        if (StringUtils.isEmpty(jid)) {
            return createExtJsonMav("29997", "该帐号不允许注册", "用户名字数个数少了");
        }
        MemberDO memberDO = userService.find(new MemberQuery(jid));
        if (memberDO != null) {
            return createExtJsonMav("21103", "用户名已被注册，请换一个试试", "");
        }
        return createExtSuccJsonMav("", "");
    }

    // /profile/email/notexist 用户注册时邮箱验证
    // {"result":{"code":"9999", "message":"", "data":{"extMst":""}}}
    // {"result":{"code":"21122", "message":"该邮箱已注册", "data":{"extMst":""}}}
    @RequestMapping(value = "/profile/email/notexist")
    public ModelAndView emailNotexist(String email) {
        if (StringUtils.isEmpty(email)) {
            return createExtJsonMav("20007", "请输入联系邮箱", "");
        }
        Pattern pattern = Pattern.compile(EMAIL_REG);
        Matcher matcher = pattern.matcher(email);
        if (!matcher.matches()) {
            return createExtJsonMav("20002", "邮箱格式不正确，请重新输入", "");
        }
        MemberDO member = userService.find(new MemberQuery(null, email));
        if (member != null) {
            return createExtJsonMav("21122", "该邮箱已注册", "");
        }
        return createExtSuccJsonMav("", "");
    }

    // /profile/email/exist 找回用户名邮箱验证
    // {"result":{"code":"21120", "message":"此邮箱未设置为联系邮箱，请检查后再试", "data":{"extMst":""}}}
    @RequestMapping(value = "/profile/email/exist")
    public ModelAndView emailExist(String email) {
        if (StringUtils.isEmpty(email)) {
            return createExtJsonMav("20007", "请输入联系邮箱", "");
        }
        Pattern pattern = Pattern.compile(EMAIL_REG);
        Matcher matcher = pattern.matcher(email);
        if (!matcher.matches()) {
            return createExtJsonMav("20002", "邮箱格式不正确，请重新输入", "");
        }
        MemberDO member = userService.find(new MemberQuery(null, email));
        if (member == null) {
            return createExtJsonMav("21120", "此邮箱未设置为联系邮箱，请检查后再试", "");
        }
        return createExtSuccJsonMav("", "");
    }

    // 用户注册
    // /passport/register.do
    // {"result":{"code":"29997", "message":"", "data":{"extMst":"该帐号不允许注册"}}} 用户名字数少了
    // {"result":{"code":"21103", "message":"用户名已被注册，请换一个试试", "data":{"extMst":""}}}
    // {"result":{"code":"20005", "message":"请创建您的密码", "data":{"extMst":""}}}
    // {"result":{"code":"20007", "message":"请输入联系邮箱", "data":{"extMst":""}}}
    // {"result":{"code":"20002", "message":"邮箱格式不正确，请重新输入", "data":{"extMst":""}}}
    // {"result":{"code":"20003", "message":"密码应为6-16位字符，请重新输入", "data":{"extMst":""}}}
    // {"result":{"code":"21122", "message":"该邮箱已注册", "data":{"extMst":""}}}
    // {"result":{"code":"9999", "message":"", "data":{"extMst":"注册成功"}}}
    @RequestMapping(value = "/passport/register.do")
    public ModelAndView register(String jid, String password, String email) {
        if (StringUtils.isEmpty(jid)) {
            return createExtJsonMav("29997", "该帐号不允许注册", "用户名字数个数少了");
        }
        int nameSize = StringFormatter.getEnWordSize(password);
        if (nameSize < 6 || nameSize > 20) {
            return createExtJsonMav("29997", "昵称应为6-20位字符，请重新输入", "");
        }
        MemberDO memberDO = userService.find(new MemberQuery(jid));
        if (memberDO != null) {
            return createExtJsonMav("21103", "用户名已被注册，请换一个试试", "");
        }
        if (StringUtils.isEmpty(password)) {
            return createExtJsonMav("20005", "请创建您的密码", "");
        }
        int passwdSize = StringFormatter.getEnWordSize(password);
        if (passwdSize < 6 || passwdSize > 16) {
            return createExtJsonMav("20003", "密码应为6-16位字符，请重新输入", "");
        }
        if (StringUtils.isEmpty(email)) {
            return createExtJsonMav("20007", "请输入联系邮箱", "");
        }
        Pattern pattern = Pattern.compile(EMAIL_REG);
        Matcher matcher = pattern.matcher(email);
        if (!matcher.matches()) {
            return createExtJsonMav("20002", "邮箱格式不正确，请重新输入", "");
        }
        MemberDO member = userService.find(new MemberQuery(null, email));
        if (member != null) {
            return createExtJsonMav("21122", "该邮箱已注册", "");
        }
        MemberDO user = new MemberDO(jid, password, email, UserTypeEnum.GENERAL);
        userService.add(user);

        doLoginSuccess(user);
        return createExtJsonMav("9999", "", "注册成功");
    }

    // 用户登录
    // /passport/login.do
    // {"result":{"code":"21101", "message":"用户名或密码错误", "data":{"extMst":""}}}
    // {"result":{"code":"9999", "message":"", "data":{"destJid":"zxc337","extMst":""}}}
    @RequestMapping(value = "/passport/login.do")
    public ModelAndView dologin(String jid, String password, Integer oneMonth) {
        if (StringUtils.isEmpty(jid)) {
            return createExtJsonMav("21101", "用户名或密码错误", "");
        }
        int nameSize = StringFormatter.getEnWordSize(password);
        if (nameSize < 6 || nameSize > 20) {
            return createExtJsonMav("21101", "用户名或密码错误", "");
        }
        if (StringUtils.isEmpty(password)) {
            return createExtJsonMav("21101", "用户名或密码错误", "");
        }
        int passwdSize = StringFormatter.getEnWordSize(password);
        if (passwdSize < 6 || passwdSize > 16) {
            return createExtJsonMav("21101", "用户名或密码错误", "");
        }
        MemberDO member = userService.find(new MemberQuery(jid, password, UserTypeEnum.GENERAL));
        if (member == null) {
            return createExtJsonMav("21101", "用户名或密码错误", "");
        }
        if (!StringUtils.equals(password, member.getPassword())) {
            return createExtJsonMav("21101", "用户名或密码错误", "");
        }

        doLoginSuccess(member);

        Map<String, String> map = new HashMap<String, String>();
        map.put("extMst", "");
        map.put("destJid", jid);
        return createJsonMav("9999", "登陆成功", map);
    }

    // 退出登录
    // {"result":{"code":"9999", "message":"", "data":""}}%
    @RequestMapping(value = "/logout")
    public ModelAndView logout() {
        doLoginOut();
        return createJsonMav("9999", "退出成功", "");
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///
    // ///
    // ///
    // ///
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 没有权限时默认返回页面
    @RequestMapping(value = "/nopermission.htm")
    public String nopermission() {
        return "nopermission";
    }

    /**
     * ajax未登录提示
     * 
     * @param model
     * @return
     */
    @RequestMapping(value = "/nopermissionAjax.htm")
    public JsonResult nopermissionAjax(Map<String, Object> model) {
        return JsonResultUtils.needLogin(null, "您尚未登录,请重新登录!");
    }

    /**
     * home跳转页面
     * 
     * @return
     */
    @RequestMapping(value = "/home.htm")
    public ModelAndView home(String returnurl) {
        ModelAndView mav = new ModelAndView("home");
        if (StringUtils.isNotEmpty(returnurl)) {
            mav.addObject("returnurl", returnurl);
        }
        return mav;
    }
}
