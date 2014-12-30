/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.pipeline;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.context.ApplicationContext;

/**
 * @author zxc Jul 15, 2014 3:54:03 PM
 */
public interface Pipeline {

    void init(ApplicationContext context);

    PipelineResult invoke(HttpServletRequest request, HttpServletResponse response, PipelineMap map) throws Exception;
}
