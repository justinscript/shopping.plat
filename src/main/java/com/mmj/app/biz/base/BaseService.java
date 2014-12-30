/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.base;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author zxc Jun 26, 2014 1:56:25 PM
 */
public interface BaseService {

    final static int     max_size  = 2000;

    final static String  DELIMITER = ".";

    public static Logger logger    = LoggerFactory.getLogger(BaseService.class);
}
