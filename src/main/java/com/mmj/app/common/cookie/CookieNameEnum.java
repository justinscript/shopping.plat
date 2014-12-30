/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.cookie;

import org.apache.commons.lang.StringUtils;

import com.mmj.app.common.cookie.annotation.CookieNamePolicy;
import com.mmj.app.common.cookie.cons.CookieDomain;
import com.mmj.app.common.cookie.cons.CookieMaxAge;

/**
 * @author zxc Jul 3, 2014 12:08:24 AM
 */
public enum CookieNameEnum {

    // ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // 顶级域(.maimaijun.com)的Cookie
    //
    // /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 永久Cookie
     */
    @CookieNamePolicy(domain = CookieDomain.DOT_MAIMAIJUN_COM)
    maimaijun_cookie_forever("_mjer_"),
    /**
     * last_login_time的Cookie name ，因为last_login_time时一个频繁变化的值。需要希望将他单独提出来
     */
    @CookieNamePolicy(domain = CookieDomain.DOT_MAIMAIJUN_COM)
    maimaijun_last_login("_mjll_"),
    /**
     * 临时Cookie
     */
    @CookieNamePolicy(domain = CookieDomain.DOT_MAIMAIJUN_COM, maxAge = CookieMaxAge.TEMP)
    maimaijun_cookie_temp("_mjct_"),
    /**
     * 明文的全局数据，可以供前端读写
     */
    @CookieNamePolicy(domain = CookieDomain.DOT_MAIMAIJUN_COM, isEncrypt = false, isSimpleValue = true, maxAge = CookieMaxAge.FOREVER)
    maimaijun_cookie_gdata("_gdt_"),
    /**
     * 用户记录用户签名的cookie
     */
    @CookieNamePolicy(domain = CookieDomain.DOT_MAIMAIJUN_COM, isEncrypt = false, isSimpleValue = true)
    maimaijun_signature("mjsig"),
    /**
     * 用于跟踪来源
     */
    @CookieNamePolicy(domain = CookieDomain.DOT_MAIMAIJUN_COM)
    maimaijun_source("_mjso_"),
    /**
     * token的cookie (表单token)
     */
    @CookieNamePolicy(domain = CookieDomain.WWW_MAIMAIJUN_COM, isEncrypt = true, isSimpleValue = true, maxAge = CookieMaxAge.TEMP)
    maimaijun_cookie_tooken("_utk_"),
    /**
     * 未读消息个数
     */
    @CookieNamePolicy(domain = CookieDomain.DOT_MAIMAIJUN_COM, isEncrypt = false, isSimpleValue = true, maxAge = CookieMaxAge.FOREVER)
    maimaijun_msg_count("msg_count"),
    /**
     * check code的存储值
     */
    @CookieNamePolicy(domain = CookieDomain.DOT_MAIMAIJUN_COM, isEncrypt = true, isSimpleValue = true, maxAge = CookieMaxAge.FOREVER)
    maimaijun_checkcode("_cc_");

    private String cookieName;

    public String getCookieName() {
        return cookieName;
    }

    public void setCookieName(String cookieName) {
        this.cookieName = cookieName;
    }

    private CookieNameEnum(String cookieName) {
        this.setCookieName(cookieName);
    }

    public String toString() {
        return name();
    }

    public static CookieNameEnum getEnum(String name) {
        for (CookieNameEnum cookieNameEnum : values()) {
            if (StringUtils.equals(name, cookieNameEnum.getCookieName())) return cookieNameEnum;
        }
        return null;
    }
}
