/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.domain;

import java.util.Date;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.BooleanEnum;
import com.mmj.app.biz.cons.SexEnum;
import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.cons.UserTypeEnum;
import com.mmj.app.common.core.CustomToStringStyle;
import com.mmj.app.common.util.NumberParser;

/**
 * <pre>
 * -- 用户
 * CREATE TABLE member (
 *     `ID`            INT(11)   NOT NULL AUTO_INCREMENT,
 *     `GMT_CREATE`    DATETIME  NOT NULL,
 *     `GMT_MODIFIED`  DATETIME  NOT NULL,
 *     `STATUS`        INT(2)    NOT NULL  COMMENT '记录状态: 0=正常,1=删除',
 * 
 *     `NAME`          varchar(128)    COMMENT '用户名',
 *     `PASSWORD`      varchar(64)     COMMENT '密码',
 *     `NICK`          varchar(128)    COMMENT '昵称',
 *     `PIC`           varchar(128)    COMMENT '头像',
 *     `SEX`           int(2)          COMMENT '性别: 0=男,1=女',
 *     `PROVINCE`      varchar(64)     COMMENT '省',
 *     `CITY`          varchar(64)     COMMENT '市/区',
 *     `COUNTY`        varchar(64)     COMMENT '区/县',
 *     `EMAIL`         varchar(64)     COMMENT '电子邮件',
 *     `MOBILE`        varchar(64)     COMMENT '手机',
 *     `TRUN_COMMENT`  int(2)          COMMENT '当您的评论被回复时: 0=是,1=否',
 *     `TRUN_NEWS`     int(2)          COMMENT '当您提供的新闻上榜时: 0=是,1=否',
 *     `TRUN_REPLY`    int(2)          COMMENT '当您的发布被回复时: 0=是,1=否',
 *     `USER_TYPE`     int(2)          COMMENT '类型',
 *     `ROLE`          varchar(64)     COMMENT '角色',
 *     `LAST_LOGIN`    DATETIME        COMMENT '上次登录时间,最后一次登录时间',
 *     `INTEGRAL`      int             COMMENT '积分',
 *     `IS_BAN`        int(2)          COMMENT '是否禁言',
 *     `LETTER_BAN`    int(2)          COMMENT '是否屏蔽私信,屏蔽所有人的私信  0=正常 1=屏蔽',
 *     `USER_STATE`    int(2)          COMMENT '状态: 0=未审核,1=正常,2=停止',
 *     PRIMARY KEY  (`ID`)
 * )ENGINE=InnoDB DEFAULT CHARSET=utf8;
 * </pre>
 * 
 * @author zxc Nov 25, 2014 9:13:08 PM
 */
public class MemberDO extends BaseDO {

    private static final long serialVersionUID = -4573429076375916353L;

    private String            name;                                    // 用户名
    private String            password;                                // 密码
    private String            nick;                                    // 昵称
    private String            pic;                                     // 头像
    private Integer           sex;                                     // 性别: 0=男,1=女
    private String            province;                                // 省
    private String            city;                                    // 市/区
    private String            county;                                  // 区/县
    private String            email;                                   // 电子邮件
    private String            mobile;                                  // 手机
    private Integer           trunComment;                             // 当您的评论被回复时: 0=是,1=否
    private Integer           trunNews;                                // 当您提供的新闻上榜时: 0=是,1=否
    private Integer           trunReply;                               // 当您的发布被回复时: 0=是,1=否
    private Integer           userType;                                // 类型
    private String            role;                                    // 角色
    private Date              lastLogin;                               // 上次登录时间,最后一次登录时间
    private Integer           integral;                                // 积分
    private Integer           isBan;                                   // 是否禁言 0=正常 1=禁言
    private Integer           letterBan;                               // 是否屏蔽私信,屏蔽所有人的私信 0=正常 1=屏蔽
    private Integer           userState;                               // 状态: 0=未审核,1=正常,2=停止

    public MemberDO() {

    }

    public MemberDO(Long id) {
        setId(id);
    }

    public MemberDO(Long id, Date lastLogin) {
        setId(id);
        setLastLogin(lastLogin);
    }

    public MemberDO(Long id, Integer integral) {
        setId(id);
        setIntegral(integral);
    }

    public MemberDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public MemberDO(String nick) {
        setNick(nick);
    }

    public MemberDO(Long uId, String phone) {
        setId(uId);
        setMobile(phone);
    }

    public MemberDO(String name, String password, String email, UserTypeEnum type) {
        setName(name);
        setNick(name);
        setPassword(password);
        setEmail(email);
        setUserType(type.getValue());
    }

    public MemberDO(String nick, String imgUrl, SexEnum sex, String provice, String city) {
        setNick(nick);
        setPic(imgUrl);
        setSex(sex.getValue());
        setProvince(provice);
        setCity(city);
    }

    public MemberDO(Long id, Boolean trunComment, Boolean trunNews, Boolean trunReply) {
        setId(id);
        setTrunComment(BooleanEnum.get(trunComment).getValue());
        setTrunNews(BooleanEnum.get(trunNews).getValue());
        setTrunReply(BooleanEnum.get(trunReply).getValue());
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public Integer getLetterBan() {
        return letterBan;
    }

    public void setLetterBan(Integer letterBan) {
        this.letterBan = letterBan;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public Integer getSex() {
        return sex;
    }

    public String getSexDesc() {
        return SexEnum.getEnum(sex).getDesc();
    }

    public void setSex(Integer sex) {
        this.sex = sex;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getCounty() {
        return county;
    }

    public void setCounty(String county) {
        this.county = county;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public Integer getTrunComment() {
        return trunComment;
    }

    public void setTrunComment(Integer trunComment) {
        this.trunComment = trunComment;
    }

    public Integer getTrunNews() {
        return trunNews;
    }

    public void setTrunNews(Integer trunNews) {
        this.trunNews = trunNews;
    }

    public Integer getTrunReply() {
        return trunReply;
    }

    public void setTrunReply(Integer trunReply) {
        this.trunReply = trunReply;
    }

    public Integer getUserType() {
        return userType;
    }

    public void setUserType(Integer userType) {
        this.userType = userType;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Date getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Date lastLogin) {
        this.lastLogin = lastLogin;
    }

    public Integer getIntegral() {
        return integral;
    }

    public void setIntegral(Integer integral) {
        this.integral = integral;
    }

    public Integer getIsBan() {
        return isBan;
    }

    // 是否禁言 0=正常 1=禁言
    public String getIsBanDesc() {
        return NumberParser.isEqual(isBan, 1) ? "禁言" : "正常";
    }

    public void setIsBan(Integer isBan) {
        this.isBan = isBan;
    }

    public Integer getUserState() {
        return userState;
    }

    // 状态: 0=未审核,1=正常,2=停止
    public String getUserStateDesc() {
        return StateEnum.getEnum(userState).getDesc();
    }

    public void setUserState(Integer userState) {
        this.userState = userState;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
