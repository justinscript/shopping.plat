/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.domain;

import java.io.Serializable;

import org.apache.commons.lang.StringUtils;

/**
 * 用户信息缓存
 * 
 * @author zxc Dec 9, 2014 11:01:50 PM
 */
public class MemberThinDO implements Serializable {

    private static final long serialVersionUID = -5243102945967228655L;

    private Long              id;                                      // 主键
    private String            name;                                    // 用户名
    private String            nick;                                    // 昵称
    private String            pic;                                     // 头像
    private String            mobile;                                  // 手机

    private String            passwd;

    private Integer           status;                                  // 记录状态: 0=正常,1=已删除
    private Integer           isBan;                                   // 是否禁言 0=正常 1=禁言
    private Integer           userState;                               // 状态: 0=未审核,1=正常,2=停止

    private String            smsCode;
    private Long              smsSendTime;

    public MemberThinDO() {

    }

    public MemberThinDO(MemberDO member) {
        setId(member.getId());
        setName(member.getName());
        setNick(member.getNick());
        setPic(StringUtils.isEmpty(member.getPic()) ? "/images/image30.png" : member.getPic());
        setMobile(member.getMobile());
        setStatus(member.getStatus());
        setIsBan(member.getIsBan());
        setUserState(member.getUserState());
        setPasswd(member.getPassword());
    }

    public Long getSmsSendTime() {
        return smsSendTime;
    }

    public void setSmsSendTime(Long smsSendTime) {
        this.smsSendTime = smsSendTime;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public String getSmsCode() {
        return smsCode;
    }

    public void setSmsCode(String smsCode) {
        this.smsCode = smsCode;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getIsBan() {
        return isBan;
    }

    public void setIsBan(Integer isBan) {
        this.isBan = isBan;
    }

    public Integer getUserState() {
        return userState;
    }

    public void setUserState(Integer userState) {
        this.userState = userState;
    }
}
