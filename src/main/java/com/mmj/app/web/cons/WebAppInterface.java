/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.cons;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mmj.app.web.controller.BaseController;

/**
 * @author zxc Jul 3, 2014 2:23:59 PM
 */
public interface WebAppInterface {

    public static final String TOKEN       = "token";

    public static Logger       logger      = LoggerFactory.getLogger(BaseController.class);

    public static final String EMAIL_REG   = "^([a-zA-Z0-9_\\-\\.]+)@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.)|(([a-zA-Z0-9\\-]+\\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\\]?)$";

    public static final String IMG_URL_REG = "^(http|www|ftp|)?(://)?(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*((:\\d+)?)(/(\\w+(-\\w+)*))*(\\.?(\\w)*)(\\?)?(((\\w*%)*(\\w*\\?)*(\\w*:)*(\\w*\\+)*(\\w*\\.)*(\\w*&)*(\\w*-)*(\\w*=)*(\\w*%)*(\\w*\\?)*(\\w*:)*(\\w*\\+)*(\\w*\\.)*(\\w*&)*(\\w*-)*(\\w*=)*)*(\\w*)*)$";

    public static final String PHONE_REG   = "^((13[0-9])|(15[^4,\\D])|(18[0,5-9]))\\d{8}$";

    public static final String URL_REG     = "[http|https]+[://]+[0-9A-Za-z:/[-]_#[?][=][.][&]]*";

}
