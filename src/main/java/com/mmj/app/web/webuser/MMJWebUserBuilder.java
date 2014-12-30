/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.webuser;

import java.util.Date;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;

import com.mmj.app.biz.cons.UserTypeEnum;
import com.mmj.app.common.cookie.CookieKeyEnum;
import com.mmj.app.common.cookie.manager.CookieManager;
import com.mmj.app.common.cookie.parser.CookieIdBuilder;

/**
 * @author zxc Nov 27, 2014 11:51:16 AM
 */
public class MMJWebUserBuilder {

    /**
     * 构建webUser对象
     * 
     * @param cookieManager
     * @return
     */
    public static MMJWebUser create(CookieManager cookieManager) {
        MMJWebUser webUser = new MMJWebUser();

        String name = cookieManager.get(CookieKeyEnum.member_name);
        String nick = cookieManager.get(CookieKeyEnum.member_nickname);
        Long uId = NumberUtils.toLong(cookieManager.get(CookieKeyEnum.member_id));
        Integer type = NumberUtils.toInt(cookieManager.get(CookieKeyEnum.member_type));
        Date lastLogin = new Date(NumberUtils.toLong(cookieManager.get(CookieKeyEnum.last_login_time)));

        webUser.setuId(uId);
        webUser.setType(UserTypeEnum.getEnum(type));
        webUser.setName(name);
        webUser.setNick(nick);
        webUser.setLastLogin(lastLogin);

        boolean hasLogin = (StringUtils.isNotBlank(nick) || StringUtils.isNotBlank(name)) && uId != null && uId != 0l
                           && type != null && type != 0;
        webUser.setHasLogin(hasLogin);

        String cookieId = CookieIdBuilder.getCookieId(cookieManager);
        if (cookieId == null) {
            webUser.setFirstAccess(true);
            cookieId = CookieIdBuilder.createCookieId(cookieManager);
        } else {
            webUser.setFirstAccess(false);
        }
        webUser.setCookieId(cookieId);

        MMJWebUser.setCurrentUser(webUser);
        return MMJWebUser.getCurrentUser();
    }

    /**
     * 登陆成功设置cookie.(会先登出，然后重新设置Cookie）
     * 
     * @param cookieManager
     * @param date
     * @param userName
     */
    public static void loginSuccess(CookieManager cookieManager, String name, String nick, Long mid, Integer type) {
        loginOut(cookieManager);
        cookieManager.set(CookieKeyEnum.member_name, name);
        cookieManager.set(CookieKeyEnum.member_nickname, nick);
        cookieManager.set(CookieKeyEnum.member_id, StringUtils.EMPTY + mid);
        cookieManager.set(CookieKeyEnum.member_type, StringUtils.EMPTY + type);
        cookieManager.set(CookieKeyEnum.last_login_time, StringUtils.EMPTY + System.currentTimeMillis());
    }

    /**
     * 登出
     */
    public static void loginOut(CookieManager cookieManager) {
        _loginOut(cookieManager, CookieKeyEnum.member_name, CookieKeyEnum.member_nickname, CookieKeyEnum.member_id,
                  CookieKeyEnum.member_type, CookieKeyEnum.last_login_time);
    }

    public static void _loginOut(CookieManager cookieManager, CookieKeyEnum... keys) {
        for (CookieKeyEnum key : keys) {
            cookieManager.set(key, StringUtils.EMPTY);
        }
    }
}
