/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.webuser;

import java.util.Date;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.BooleanEnum;
import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.cons.UserTypeEnum;
import com.mmj.app.common.core.CustomToStringStyle;
import com.mmj.app.common.pipeline.value.BaseWebUser;

/**
 * @author zxc Nov 27, 2014 11:50:55 AM
 */
public class MMJWebUser extends BaseWebUser {

    private static final long              serialVersionUID = -1386506270980794759L;

    private Long                           uId;
    private String                         name;
    private String                         nick;
    private String                         img;
    private String                         mobile;

    private String                         passwd;

    private UserTypeEnum                   type;                                            // 类型
    private StateEnum                      state;                                           // 状态: 0=未审核,1=正常,2=停止

    private String                         role;

    private BooleanEnum                    isBan;                                           // 是否禁言

    private boolean                        isFirstAccess;
    private Date                           lastLogin;                                       // 上次登录时间,最后一次登录时间

    private static ThreadLocal<MMJWebUser> userHolder       = new ThreadLocal<MMJWebUser>();

    public MMJWebUser() {

    }

    public static void setCurrentUser(MMJWebUser webUser) {
        userHolder.set(webUser);
    }

    public static MMJWebUser getCurrentUser() {
        return userHolder.get();
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public String getPasswd() {
        return passwd;
    }

    public void setPasswd(String passwd) {
        this.passwd = passwd;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getRole() {
        return role;
    }

    public String getImg() {
        return img;
    }

    public void setImg(String img) {
        this.img = img;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public boolean isFirstAccess() {
        return isFirstAccess;
    }

    public void setFirstAccess(boolean isFirstAccess) {
        this.isFirstAccess = isFirstAccess;
    }

    public static ThreadLocal<MMJWebUser> getUserHolder() {
        return userHolder;
    }

    public static void setUserHolder(ThreadLocal<MMJWebUser> userHolder) {
        MMJWebUser.userHolder = userHolder;
    }

    public Long getuId() {
        return uId;
    }

    public void setuId(Long uId) {
        this.uId = uId;
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

    public UserTypeEnum getType() {
        return type;
    }

    public void setType(UserTypeEnum type) {
        this.type = type;
    }

    public BooleanEnum getIsBan() {
        return isBan;
    }

    public void setIsBan(BooleanEnum isBan) {
        this.isBan = isBan;
    }

    public StateEnum getState() {
        return state;
    }

    public void setState(StateEnum state) {
        this.state = state;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
