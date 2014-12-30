/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.cms;

import java.util.Collections;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.mmj.app.biz.domain.FeedbackDO;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.common.util.CityUtils;
import com.mmj.app.common.velocity.CustomVelocityLayoutView;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.tools.WebUserTools;

/**
 * @author zxc Nov 26, 2014 5:51:26 PM
 */
@Controller
public class CMSController extends BaseController {

    // news
    @RequestMapping(value = "/help/news")
    public ModelAndView news() {
        ModelAndView mav = new ModelAndView("/cms/news");
        return mav;
    }

    // /download/model/andorid
    @RequestMapping(value = "/download/model/{phone}")
    public ModelAndView download(@PathVariable("phone")
    String phone) {
        ModelAndView mav = new ModelAndView("/cms/about");
        return mav;
    }

    // /crossdomain.xml
    @RequestMapping(value = "/crossdomain.xml")
    public ModelAndView crossdomain() {
        ModelAndView mav = new ModelAndView("crossdomain");
        mav.getModel().put(CustomVelocityLayoutView.USE_LAYOUT, "false");
        return mav;
    }

    // /feedback/create?content=test!&email=12341324%4011.com
    // content:请输入您想要告诉我们的*请输入反馈内容 email:12341324@11.com
    // {"result":{"code":"9999", "message":"反馈成功", "data":""}}
    // {"result":{"code":"9998", "message":"反馈失败", "data":""}}
    @RequestMapping(value = "/feedback/create")
    public ModelAndView createFeedback(String email, String content) {
        if (StringUtils.isEmpty(content) || StringUtils.isEmpty(email)) {
            return createJsonMav("9998", "反馈失败", "");
        }
        userService.add(new FeedbackDO(WebUserTools.getUid(), WebUserTools.getName(), email, content));
        return createJsonMav("9999", "反馈成功", "");
    }

    // /share/site/stat?linksId=6547239&siteId=1&state=1
    // {"result":{"code":"9999", "message":"站点统计成功", "data":""}}
    // state 1=微博 2=豆瓣 3=腾讯空间 4=腾讯微博 5=人人
    @RequestMapping(value = "/share/site/stat")
    public ModelAndView share(Long linksId, Integer siteId, Integer state) {
        return createJsonMav("9999", "站点统计成功", "");
    }

    // /blank.html 返回默认的空白页面
    @RequestMapping(value = "/blank.html")
    public ModelAndView blank() {
        ModelAndView mav = new ModelAndView("blank");
        mav.getModel().put(CustomVelocityLayoutView.USE_LAYOUT, "false");
        return mav;
    }

    // /update.jsp 返回update更新页面
    @RequestMapping(value = "/update.jsp")
    public ModelAndView updateJsp() {
        ModelAndView mav = new ModelAndView("updateJsp");
        mav.getModel().put(CustomVelocityLayoutView.USE_LAYOUT, "false");
        return mav;
    }

    // /link/cityCode.do?parentId=0 返回省份,城市JSON串
    @RequestMapping(value = "/link/cityCode.do")
    public ModelAndView cityCode(Integer parentId) {
        ModelAndView mav = new ModelAndView();
        mav.setView(new MappingJackson2JsonView());
        if (parentId == null || parentId < 0) {
            mav.addObject("code", 0000);
            mav.addObject("data", Collections.emptyList());
            return mav;
        }
        mav.addObject("code", 9999);
        mav.addObject("data", CityUtils.getCityById(parentId));
        return mav;
    }

    // 用户反馈
    @RequestMapping(value = "/feedback")
    public ModelAndView feedback() {
        ModelAndView mav = new ModelAndView("/cms/feedback");
        if (WebUserTools.hasLogin()) {
            MemberDO member = userService.getMemberById(WebUserTools.getUid());
            mav.addObject("email", member.getEmail());
        }
        return mav;
    }

    //
    @RequestMapping(value = "/help/feedback")
    public ModelAndView help() {
        ModelAndView mav = new ModelAndView("/cms/feedback");
        return mav;
    }

    // /feedback/success
    @RequestMapping(value = "/feedback/success")
    public ModelAndView feedbackSucc() {
        ModelAndView mav = new ModelAndView("/cms/feedbackSucc");
        return mav;
    }

    // 声明与注意事项(聊天与评论规则)
    @RequestMapping(value = "/help/notice")
    public ModelAndView notice() {
        ModelAndView mav = new ModelAndView("/cms/notice");
        return mav;
    }

    // 积分说明
    @RequestMapping(value = "/help/integral")
    public ModelAndView integral() {
        ModelAndView mav = new ModelAndView("/cms/integral");
        return mav;
    }

    // 关于我们
    @RequestMapping(value = "/help/about")
    public ModelAndView about() {
        ModelAndView mav = new ModelAndView("/cms/about");
        return mav;
    }

    // 联系我们
    @RequestMapping(value = "/help/contact")
    public ModelAndView contact() {
        ModelAndView mav = new ModelAndView("/cms/contact");
        return mav;
    }

    // 网站服务条款
    @RequestMapping(value = "/help/service")
    public ModelAndView service() {
        ModelAndView mav = new ModelAndView("/cms/service");
        return mav;
    }

    // 网站隐私政策
    @RequestMapping(value = "/help/privacy")
    public ModelAndView privacy() {
        ModelAndView mav = new ModelAndView("/cms/privacy");
        return mav;
    }

    // 友情链接
    @RequestMapping(value = "/help/goodlink")
    public ModelAndView goodlink() {
        ModelAndView mav = new ModelAndView("/cms/goodlink");
        return mav;
    }
}
