/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.pipeline.value;

import java.io.Serializable;

/**
 * @author zxc Jul 1, 2014 4:26:21 PM
 */
public class BaseWebUser implements Serializable {

    private static final long serialVersionUID = 4551609333764931368L;

    private boolean           hasLogin;

    private String            cookieId;

    public String getCookieId() {
        return cookieId;
    }

    public void setCookieId(String cookieId) {
        this.cookieId = cookieId;
    }

    public boolean hasLogin() {
        return hasLogin;
    }

    public void setHasLogin(boolean hasLogin) {
        this.hasLogin = hasLogin;
    }

    public boolean isHasLogin() {
        return hasLogin;
    }
}
