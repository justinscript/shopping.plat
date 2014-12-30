/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.task;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mmj.app.common.task.AbstractTask;

/**
 * 任务调度测试类
 * 
 * @author zxc Jul 1, 2014 11:32:45 AM
 */
@Component
public class TestTask extends AbstractTask {

    public TestTask() {
        super();
    }

    @Override
    public void initTask() throws Exception {
        logger.debug("********************************now start test task!*************************");
    }

    @Override
    public void doTask() throws Exception {
        logger.debug("***************************zxc test task,do something************************");
    }

    /**
     * 每隔一分钟执行一次
     */
    @Scheduled(cron = "0 0/5 * * * ?")
    public void test() {
        init();
    }
}
