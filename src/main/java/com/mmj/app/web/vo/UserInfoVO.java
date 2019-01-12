/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.vo;

import com.mmj.app.biz.cons.BooleanEnum;
import com.mmj.app.biz.cons.SexEnum;
import com.mmj.app.biz.domain.MemberDO;

/**
 * @author justinscript Dec 2, 2014 4:34:38 PM
 */
public class UserInfoVO {

    // "data":{"banStatus":1,"bindPhone":false,"canChat":false,"cityName":"北京",
    // "imgUrl":"http://img1.chouti.com/group9/M00/19/22/wKgCNFR3P5Wc4AjcAAAbxP2MOAo147=48x48.jpg","integration":0,"jid":"zxc337","nick":"zxc338","proveName":"北京","sex":true}}}
    private String  jid;
    private String  imgUrl;
    private String  nick;
    private boolean sex;
    private String  integration;
    private String  bindPhone;
    private boolean canChat;
    private String  proveName;
    private String  cityName;
    private Integer banStatus;

    public UserInfoVO() {

    }

    public UserInfoVO(MemberDO member) {
        setJid(member.getName());
        setNick(member.getNick());
        setImgUrl(member.getPic());
        setSex(SexEnum.getEnum(member.getSex()).isBool());
        setIntegration(member.getIntegral() + "");
        setBindPhone(member.getMobile());
        setCanChat(BooleanEnum.getByValue(member.getIsBan()).isTrue());
        setProveName(member.getProvince());
        setCityName(member.getCity());
        setBanStatus(member.getUserState());
    }

    public String getJid() {
        return jid;
    }

    public void setJid(String jid) {
        this.jid = jid;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public boolean isSex() {
        return sex;
    }

    public void setSex(boolean sex) {
        this.sex = sex;
    }

    public String getIntegration() {
        return integration;
    }

    public void setIntegration(String integration) {
        this.integration = integration;
    }

    public String getBindPhone() {
        return bindPhone;
    }

    public void setBindPhone(String bindPhone) {
        this.bindPhone = bindPhone;
    }

    public boolean isCanChat() {
        return canChat;
    }

    public void setCanChat(boolean canChat) {
        this.canChat = canChat;
    }

    public String getProveName() {
        return proveName;
    }

    public void setProveName(String proveName) {
        this.proveName = proveName;
    }

    public String getCityName() {
        return cityName;
    }

    public Integer getBanStatus() {
        return banStatus;
    }

    public void setBanStatus(Integer banStatus) {
        this.banStatus = banStatus;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }
}
