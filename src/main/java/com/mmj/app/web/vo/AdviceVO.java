/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.vo;

/**
 * "advice":{"reconnect":"retry","interval":0,"timeout":30000}
 * 
 * @author zxc Nov 28, 2014 3:02:34 PM
 */
public class AdviceVO {

    private String  reconnect;
    private Integer interval;
    private Integer timeout;

    public AdviceVO() {

    }

    public AdviceVO(String reconnect, Integer interval, Integer timeout) {
        setReconnect(reconnect);
        setInterval(interval);
        setTimeout(timeout);
    }

    public String getReconnect() {
        return reconnect;
    }

    public void setReconnect(String reconnect) {
        this.reconnect = reconnect;
    }

    public Integer getInterval() {
        return interval;
    }

    public void setInterval(Integer interval) {
        this.interval = interval;
    }

    public Integer getTimeout() {
        return timeout;
    }

    public void setTimeout(Integer timeout) {
        this.timeout = timeout;
    }
}
