/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.cookie;

import com.mmj.app.common.cookie.annotation.CookieKeyPolicy;

/**
 * @author zxc Jul 1, 2014 4:48:04 PM
 */
public enum CookieKeyEnum {

    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // 顶级域(.maimaijun.com)的Cookie
    //
    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * Cookie_id 只要用户访问过我们的站点就会有这样一个值
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    cookie_id("c_id"),
    /**
     * wap_profile记录浏览器的分辨率及操作系统等
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    wap_profile("wap_profile"),

    /************************* 需要登录以后重写后的cookie *************************/
    /**
     * 会员帐号的ID
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    member_id("mj_m_id"),
    /**
     * 会员的Email
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    email("mj_m_e"),
    /**
     * 会员的mobile
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    mobile("mj_m_mo"),
    /**
     * 会员的type
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    member_type("mj_m_ty"),
    /**
     * 会员的name
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    member_name("mj_m_na"),
    /**
     * 会员的nickname
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    member_nickname("mj_m_nn"),
    /**
     * 会员上一次访问时间
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_last_login)
    last_login_time("mj_l_l_t"),
    /**
     * 会员最近活动时间
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    last_active_time("mj_l_ac_t"),
    /**
     * 会员的权限角色
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    member_role("mj_m_r"),
    /**
     * 会员自动登录时间长
     */
    @CookieKeyPolicy(withinCookieName = CookieNameEnum.maimaijun_cookie_forever)
    auto_login_time("mj_a_l_t");

    private String key;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    private CookieKeyEnum(String cookieKey) {
        this.key = cookieKey;
    }

    public static CookieKeyEnum getEnum(String key) {
        for (CookieKeyEnum cookieKey : values()) {
            if (cookieKey.getKey().equals(key)) {
                return cookieKey;
            }
        }
        return null;
    }

    public String toString() {
        return name();
    }
}
