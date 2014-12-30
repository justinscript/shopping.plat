/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.vo;

/**
 * <pre>
 * [
 *     {
 *         "id": "1", 
 *         "minimumVersion": "1.0", 
 *         "supportedConnectionTypes": [
 *             "callback-polling", 
 *             "long-polling"
 *         ], 
 *         "successful": true, 
 *         "channel": "/meta/handshake", 
 *         "clientId": "ukpp1rfmxc8az72gwx3skxu2ythnl", 
 *         "version": "1.0"
 *     }
 * ]
 * </pre>
 * 
 * @author zxc Nov 28, 2014 1:34:51 PM
 */
public class HandShakeVO {

    private String   id;
    private String   minimumVersion;
    private String[] supportedConnectionTypes;
    private boolean  successful;
    private String   channel;
    private String   clientId;
    private String   version;

    public HandShakeVO() {

    }

    public HandShakeVO(String id, String minimumVersion, boolean successful, String channel, String clientId,
                       String version, String... supportedConnectionTypes) {
        setId(id);
        setMinimumVersion(minimumVersion);
        setSuccessful(successful);
        setChannel(channel);
        setClientId(clientId);
        setVersion(version);
        setSupportedConnectionTypes(supportedConnectionTypes);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMinimumVersion() {
        return minimumVersion;
    }

    public void setMinimumVersion(String minimumVersion) {
        this.minimumVersion = minimumVersion;
    }

    public String[] getSupportedConnectionTypes() {
        return supportedConnectionTypes;
    }

    public void setSupportedConnectionTypes(String[] supportedConnectionTypes) {
        this.supportedConnectionTypes = supportedConnectionTypes;
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

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
