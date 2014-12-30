/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.vo;

/**
 * [{"id":"4","successful":true,"advice":{"reconnect":"retry","interval":0,"timeout":30000},"channel":"/meta/connect"}]
 * 
 * @author zxc Nov 28, 2014 3:01:39 PM
 */
public class ConnectVO {

    private String   id;
    private boolean  successful;
    private String   channel;

    private AdviceVO advice;

    public ConnectVO() {

    }

    public ConnectVO(String id, boolean successful, String channel) {
        setId(id);
        setSuccessful(successful);
        setChannel(channel);
    }

    public ConnectVO(String id, boolean successful, String channel, AdviceVO advice) {
        setId(id);
        setSuccessful(successful);
        setChannel(channel);
        setAdvice(advice);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public boolean isSuccessful() {
        return successful;
    }

    public void setSuccessful(boolean successful) {
        this.successful = successful;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public AdviceVO getAdvice() {
        return advice;
    }

    public void setAdvice(AdviceVO advice) {
        this.advice = advice;
    }
}
