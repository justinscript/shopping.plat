/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.user;

import java.io.IOException;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import com.mmj.app.biz.cons.SexEnum;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.MemberThinDO;
import com.mmj.app.biz.query.MemberQuery;
import com.mmj.app.common.checkcode.WebsiteCheckCodeManager;
import com.mmj.app.common.cookie.manager.CookieManagerLocator;
import com.mmj.app.common.util.PushSMSUtils;
import com.mmj.app.common.util.SerialNumGenerator;
import com.mmj.app.common.util.StringFormatter;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.tools.WebUserTools;
import com.mmj.app.web.vo.UserInfoVO;

/**
 * @author zxc Nov 26, 2014 11:37:12 AM
 */
@Controller
public class UserController extends BaseController {

    // /link/user.do
    // {"result":{"code":"9998", "message":"从request中获取jid为空", "data":""}}
    // {"result":{"code":"9999", "message":"",
    // "data":{"banStatus":1,"bindPhone":false,"canChat":false,"cityName":"北京",
    // "imgUrl":"http://img1.chouti.com/group9/M00/19/22/wKgCNFR3P5Wc4AjcAAAbxP2MOAo147=48x48.jpg","integration":0,"jid":"zxc337","nick":"zxc338","proveName":"北京","sex":true}}}
    @RequestMapping(value = "/link/user.do")
    public ModelAndView userInfo() {
        if (!WebUserTools.hasLogin()) {
            return createJsonMav("9998", "从request中获取jid为空", "");
        }
        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        return createJsonMav("9999", "", new UserInfoVO(member));
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///
    // ///
    // /// 图片验证码
    // ///
    // ///
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // {"result":{"code":"24001", "message":"验证码不正确，请重新输入", "data":{"extMst":""}}}
    // {"result":{"code":"9999", "message":"", "data":{"extMst":""}}}
    // /passport/valAccessCode.do?code=d3ad0d361be6b51e8f1513b2e75d7120
    @RequestMapping(value = "/passport/valAccessCode.do")
    public ModelAndView valAccessCode(String code) {
        if (StringUtils.isEmpty(code)) {
            return createExtJsonMav("24001", "验证码不正确，请重新输入", "");
        }
        boolean check = WebsiteCheckCodeManager.INSTANCE.checkByMD5(cookieManager, code);
        if (!check) {
            return createExtJsonMav("24001", "验证码不正确，请重新输入", "");
        }
        return createExtJsonMav("9999", "", "");
    }

    // /gozapIdentifyCode?t=0.583490149956273 生成图片验证码(反馈页面,密码重置,手机绑定)
    @RequestMapping(value = "/gozapIdentifyCode")
    public ModelAndView gozapIdentifyCode(String t, HttpServletRequest request, HttpServletResponse response) {

        response.setContentType("image/png; charset=utf-8");
        response.setHeader("Pragma", "no-cache");
        response.setHeader("Cache-Control",
                           "private, must-revalidate,no-store, no-cache, must-revalidate,post-check=0, pre-check=0");
        response.addHeader("Content-Disposition", "attachment; filename=\"" + "gozapIdentifyCode" + "\"");
        response.setCharacterEncoding("UTF-8");

        final byte[] bytes = WebsiteCheckCodeManager.INSTANCE.create(CookieManagerLocator.get(request, response),
                                                                     response);

        OutputStream os;
        try {
            os = response.getOutputStream();
            IOUtils.write(bytes, os);
            response.flushBuffer();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///
    // ///
    // /// 找回 用户名 密码
    // ///
    // ///
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // /profile/user/find 找回用户名
    @RequestMapping(value = "/profile/user/find")
    public ModelAndView userFind() {
        ModelAndView mav = new ModelAndView("/user/userFind");
        return mav;
    }

    // /profile/user/password/lost 找回用户名发送邮件
    // {"result":{"code":"9999", "message":"",
    // "data":{"cacheValue":"42037B86BC52054FED3FA6BCA038D54B","cachekey":"403323f988ee49e18fe57a85a6dcc633","mail":"zhangxiongcai@163.com",
    // "mailPath":"http://mail.163.com"}}}
    // email=zhangxiongcai%40163.com&isReset=1
    // {"result":{"code":"20002", "message":"邮箱格式不正确，请重新输入", "data":{"extMst":""}}}
    @RequestMapping(value = "/profile/user/password/lost")
    public ModelAndView lostUserSendEmail(String email, Integer isReset) {
        if (StringUtils.isEmpty(email)) {
            return createExtJsonMav("20002", "邮箱格式不正确，请重新输入", "");
        }
        Pattern pattern = Pattern.compile(EMAIL_REG);
        Matcher matcher = pattern.matcher(email);
        if (!matcher.matches()) {
            return createExtJsonMav("20002", "邮箱格式不正确，请重新输入", "");
        }
        Map<String, String> map = new HashMap<String, String>();
        map.put("cacheValue", "42037B86BC52054FED3FA6BCA038D54B");
        map.put("cachekey", "403323f988ee49e18fe57a85a6dcc633");
        map.put("mail", "zhangxiongcai@163.com");
        map.put("mailPath", "http://mail.163.com");
        return createJsonMav("9999", "", map);
    }

    // /profile/user/password/back
    // cachekey=22e2e42f4d2f4d3692bf2321261616a1&cacheValue=A710681E6D8FD4E6A888A2BA8E3DD4DC
    @RequestMapping(value = "/profile/user/password/back")
    public ModelAndView lostUserBack(String cachekey, String cacheValue) {
        ModelAndView mav = new ModelAndView("/user/lostUserBack");
        return mav;
    }

    // /profile/password/reset 找回登录密码
    @RequestMapping(value = "/profile/password/reset")
    public ModelAndView passwdRest() {
        ModelAndView mav = new ModelAndView("/user/passwdReset");
        return mav;
    }

    // /passport/lostPwdSendEmail.do 发送邮件找回登录密码
    // jid=zxc337&code=7f6557037207a84bdace3a3949e575f3
    // {"result":{"code":"9999", "message":"",
    // "data":{"cacheValue":"D8C09A3F6CE473951C57E39347F684D1","cachekey":"d681a04dbd3443aea69915da947985a9","mail":"****@11.com","mailPath":"http://mail.11.com"}}}
    @RequestMapping(value = "/passport/lostPwdSendEmail.do")
    public ModelAndView lostPwdSendEmail(String jid, String code) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("cacheValue", "D8C09A3F6CE473951C57E39347F684D1");
        map.put("cachekey", "d681a04dbd3443aea69915da947985a9");
        map.put("mail", "****@11.com");
        map.put("mailPath", "http://mail.11.com");
        return createJsonMav("9999", "", "");
    }

    // /passport/lostPwdEmail.do
    // cachekey=9c1106ab678842da90629a9ac6dffa90&cacheValue=E2BA502ADEA562F6AD5407D68A2E7023
    @RequestMapping(value = "/passport/lostPwdEmail.do")
    public ModelAndView lostPwdEmail(String cachekey, String cacheValue) {
        ModelAndView mav = new ModelAndView("/user/lostPwdEmail");
        return mav;
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///
    // ///
    // /// 个人信息设置
    // ///
    // ///
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // /message/edit 个人消息通知设置编辑页面
    @RequestMapping(value = "/message/edit")
    public ModelAndView msgEdit() {
        ModelAndView mav = new ModelAndView("/user/msgEdit");
        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        mav.addObject("member", member);
        return mav;
    }

    // /message/update 个人消息通知更新提交
    // linksMsg:true commentsMsg:false linksIntoHotMsg:true jid:zxc337
    // {"result":{"code":"9999", "message":"通知设置修改成功", "data":""}}
    @RequestMapping(value = "/message/update")
    public ModelAndView msgUpdate(String jid, Boolean commentsMsg, Boolean linksIntoHotMsg, Boolean linksMsg) {
        if (linksMsg == null || commentsMsg == null || linksIntoHotMsg == null) {
            return createJsonMav("0000", "提交的参数错误", "");
        }
        userService.update(new MemberDO(WebUserTools.getUid(), commentsMsg, linksIntoHotMsg, linksMsg));
        return createJsonMav("9999", "通知设置修改成功", "");
    }

    // 个人基本信息设置页面
    @RequestMapping(value = "/profile")
    public ModelAndView profile() {
        ModelAndView mav = new ModelAndView("/user/setting");
        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        mav.addObject("member", member);
        return mav;
    }

    // /profile/update 个人信息更新提交
    // {"result":{"code":"9999", "message":"个人设置保存成功", "data":""}}
    // {"result":{"code":"0000", "message":"保存失败,昵称已经存在", "data":""}}
    @RequestMapping(value = "/profile/update")
    public ModelAndView profileUpdate(String jid, String nick, String imgUrl, String sex, String proveName,
                                      String cityName) {
        if (StringUtils.isEmpty(jid)) {
            return createJsonMav("0000", "保存失败,用户名错误", "");
        }
        if (StringUtils.isEmpty(nick)) {
            return createJsonMav("0000", "保存失败,昵称错误", "");
        }
        MemberDO member = new MemberDO(nick);
        if (StringUtils.isNotEmpty(imgUrl)) {
            Pattern p = Pattern.compile(IMG_URL_REG, Pattern.CASE_INSENSITIVE);
            Matcher m = p.matcher(WEB_APP_HOST + imgUrl);
            logger.error("imgUrl: " + WEB_APP_HOST + imgUrl);
            logger.error("imgUrl matches: " + m.matches());
            if (!m.matches()) {
                return createJsonMav("0000", "保存失败,图片地址错误", "");
            }
            member.setPic(imgUrl);
        }
        if (StringUtils.isNotEmpty(sex)) {
            SexEnum sexEnum = SexEnum.getEnum(sex);
            if (sexEnum == null) {
                return createJsonMav("0000", "保存失败,性别错误", "");
            }
            member.setSex(sexEnum.getValue());
        }
        MemberDO memberDO = userService.find(new MemberQuery("", nick, ""));
        if (memberDO != null) {
            if (!StringUtils.equals(jid, memberDO.getName())) {
                return createJsonMav("0000", "保存失败,昵称已经存在", "");
            }
        }
        if (StringUtils.isNotEmpty(proveName)) {
            member.setProvince(proveName);
        }
        if (StringUtils.isNotEmpty(cityName)) {
            member.setCity(cityName);
        }
        member.setId(WebUserTools.getUid());
        userService.update(member);
        return createJsonMav("9999", "个人设置保存成功", "");
    }

    // /profile/password/edit 返回更改密码页面
    @RequestMapping(value = "/profile/password/edit")
    public ModelAndView passwordEdit() {
        ModelAndView mav = new ModelAndView("/user/passwdEdit");
        return mav;
    }

    // /profile/password/auth 验证密码提交
    // {"result":{"code":"21101", "message":"密码不正确，请重新输入", "data":{"extMst":""}}}
    @RequestMapping(value = "/profile/password/auth")
    public ModelAndView auth(String password) {
        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        if (!StringUtils.equals(password, member.getPassword())) {
            return createExtJsonMav("21101", "密码不正确，请重新输入", "");
        }
        return createExtJsonMav("9999", "", "");
    }

    // /profile/password/update 提交更新密码
    // {"result":{"code":"9999", "message":"", "data":{"extMst":"密码修改成功"}}}
    // {"result":{"code":"20015", "message":"请输入您的当前密码", "data":{"extMst":""}}}
    // {"result":{"code":"20013", "message":"旧密码需为6-16位字符，请重新输入", "data":{"extMst":""}}}
    // {"result":{"code":"20005", "message":"请输入您的密码", "data":{"extMst":""}}}
    // {"result":{"code":"20003", "message":"密码应为6-16位字符，请重新输入", "data":{"extMst":""}}}
    @RequestMapping(value = "/profile/password/update")
    public ModelAndView passwdUpdate(String oldPwd, String pwd) {
        if (StringUtils.isEmpty(oldPwd)) {
            return createExtJsonMav("20015", "请输入您的当前密码", "");
        }
        int oldSize = StringFormatter.getEnWordSize(oldPwd);
        if (oldSize < 6 || oldSize > 16) {
            return createExtJsonMav("20013", "旧密码需为6-16位字符，请重新输入", "");
        }
        if (StringUtils.isEmpty(pwd)) {
            return createExtJsonMav("20015", "请输入您的密码", "");
        }
        int pwdSize = StringFormatter.getEnWordSize(oldPwd);
        if (pwdSize < 6 || pwdSize > 16) {
            return createExtJsonMav("20003", "密码应为6-16位字符，请重新输入", "");
        }
        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        if (!StringUtils.equals(oldPwd, member.getPassword())) {
            return createExtJsonMav("21101", "密码不正确，请重新输入", "");
        }
        member.setPassword(pwd);
        userService.update(member);
        return createExtJsonMav("9999", "", "密码修改成功");
    }

    // /profile/email/edit 返回修改邮箱页面
    @RequestMapping(value = "/profile/email/edit")
    public ModelAndView emailEdit() {
        ModelAndView mav = new ModelAndView("/user/emailEdit");
        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        mav.addObject("member", member);
        return mav;
    }

    // /profile/email/update 提交邮箱更新
    // {"result":{"code":"9999", "message":"", "data":{"extMst":"联系邮箱修改成功"}}}
    // {"result":{"code":"20007", "message":"请输入联系邮箱", "data":{"extMst":""}}}
    // {"result":{"code":"20005", "message":"请输入新热榜的用户密码进行确认", "data":{"extMst":""}}}
    @RequestMapping(value = "/profile/email/update")
    public ModelAndView emailUpdate(String password, String email) {
        if (StringUtils.isEmpty(password)) {
            return createExtJsonMav("20005", "请输入买买君的用户密码进行确认", "");
        }
        if (StringUtils.isEmpty(email)) {
            return createExtJsonMav("20007", "请输入联系邮箱", "");
        }
        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        if (!StringUtils.equals(password, member.getPassword())) {
            return createExtJsonMav("21101", "密码不正确，请重新输入", "");
        }
        MemberDO md = userService.find(new MemberQuery(null, email));
        if (md != null) {
            return createExtJsonMav("21122", "该邮箱已注册", "");
        }
        member.setEmail(email);
        userService.update(member);
        return createExtJsonMav("9999", "", "联系邮箱修改成功");
    }

    // /profile/bind 手机绑定修改页面
    @RequestMapping(value = "/profile/bind", method = RequestMethod.GET)
    public ModelAndView bind() {
        ModelAndView mav = new ModelAndView("/user/phoneBind");
        MemberDO member = userService.getMemberById(WebUserTools.getUid());
        mav.addObject("member", member);
        return mav;
    }

    // /passport/checkPhoneAbled phone
    // {"result":{"code":"9999", "message":"你的手机号可以进行绑定操作", "data":""}}
    // {"result":{"code":"8887", "message":"手机号不合法，请重新输入", "data":""}}
    // {"result":{"code":"8888", "message":"你的手机号已被绑定", "data":""}}
    @RequestMapping(value = "/passport/checkPhoneAbled")
    public ModelAndView checkPhoneAbled(String phone) {
        if (StringUtils.isEmpty(phone)) {
            return createExtJsonMav("8887", "手机号不合法，请重新输入", "");
        }
        Pattern p = Pattern.compile(PHONE_REG);
        Matcher m = p.matcher(phone);
        if (!m.matches()) {
            return createJsonMav("8887", "手机号不合法，请重新输入", "");
        }
        MemberDO member = userService.find(new MemberQuery(null, null, null, phone));
        if (member != null) {
            return createExtJsonMav("8888", "你的手机号已被绑定", "");
        }
        return createJsonMav("9999", "你的手机号可以进行绑定操作", "");
    }

    // /profile/sendcode 验证验证码,验证成功发手机验证码
    // {"result":{"code":"24001", "message":"输入不正确，请重新输入", "data":""}}
    // {"result":{"code":"8887", "message":"号码格式不对，请重新输入", "data":""}}
    // {"result":{"code":"9999", "message":"验证码发送成功", "data":""}}
    @RequestMapping(value = "/profile/sendcode")
    public ModelAndView sendcode(String phone, String code) {
        if (StringUtils.isEmpty(phone) || StringUtils.isEmpty(code)) {
            return createJsonMav("24001", "输入不正确，请重新输入", "");
        }
        Pattern p = Pattern.compile(PHONE_REG);
        Matcher m = p.matcher(phone);
        if (!m.matches()) {
            return createJsonMav("8887", "号码格式不对，请重新输入", "");
        }
        boolean check = WebsiteCheckCodeManager.INSTANCE.checkByMD5(cookieManager, code);
        if (!check) {
            return createJsonMav("24001", "输入不正确，请重新输入图片验证码", "");
        }

        code = SerialNumGenerator.RandomNum(4);
        PushSMSUtils.getInstance().sendCodeSMS(code, phone);
        userService.checkMemberCode(WebUserTools.getUid(), code);
        return createJsonMav("9999", "验证码发送成功", "");
    }

    // /profile/bind 绑定手机号提交验证
    // {"result":{"code":"8888", "message":"该手机号已经被绑定，换个手机号试试？", "data":""}}
    // {"result":{"code":"8888", "message":"验证码错误，请输入正确的验证码", "data":""}}
    // {"result":{"code":"8887", "message":"号码格式不对，请重新输入", "data":""}}
    // {"result":{"code":"9999", "message":"绑定手机成功", "data":""}}
    @RequestMapping(value = "/profile/bind", method = RequestMethod.POST)
    public ModelAndView phoneBind(String phone, String code) {
        if (StringUtils.isEmpty(phone)) {
            return createJsonMav("8887", "号码格式不对，请重新输入", "");
        }
        Pattern p = Pattern.compile(PHONE_REG);
        Matcher m = p.matcher(phone);
        if (!m.matches()) {
            return createJsonMav("8887", "号码格式不对，请重新输入", "");
        }
        if (StringUtils.isEmpty(code)) {
            return createJsonMav("8888", "验证码错误，请输入正确的短信验证码", "");
        }
        MemberDO member = userService.find(new MemberQuery(null, null, null, phone));
        if (member != null) {
            return createJsonMav("8888", "该手机号已经被绑定，换个手机号试试？", "");
        }
        MemberThinDO memberThin = userService.fetchMemberById(WebUserTools.getUid());
        if (memberThin == null || !StringUtils.equalsIgnoreCase(code, memberThin.getSmsCode())) {
            return createJsonMav("8888", "验证码错误，请输入正确的短信验证码", "");
        }
        if (System.currentTimeMillis() - memberThin.getSmsSendTime() > 10 * 60 * 1000) {
            return createJsonMav("8888", "验证码超时,请在10分钟内验证", "");
        }
        userService.update(new MemberDO(WebUserTools.getUid(), phone));
        return createJsonMav("9999", "绑定手机成功", "");
    }

    // /profile/unbind 解除手机绑定
    // {"result":{"code":"9999", "message":"解除绑定手机成功", "data":""}}
    @RequestMapping(value = "/profile/unbind")
    public ModelAndView phoneUnBind() {
        MemberDO member = new MemberDO(WebUserTools.getUid());
        member.setMobile(StringUtils.EMPTY);
        userService.update(member);
        return createJsonMav("9999", "绑定手机成功", "");
    }
}
