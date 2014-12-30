/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.cookie.cons;

/**
 * @author zxc Jul 3, 2014 4:43:08 PM
 */
public enum CookieDomain {

    DOT_MAIMAIJUN_COM(".maimaijun.com"), WWW_MAIMAIJUN_COM("www.maimaijun.com");

    private String domain;

    private CookieDomain(String cookieDomain) {
        this.domain = cookieDomain;
    }

    public String getDomain() {
        return domain;
    }

    public static CookieDomain getEnum(String domain) {
        for (CookieDomain cookieDomain : values()) {
            if (cookieDomain.getDomain().equals(domain)) {
                return cookieDomain;
            }
        }
        return null;
    }
}
