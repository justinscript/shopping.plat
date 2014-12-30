/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.HandleStateEnum;
import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.common.core.CustomToStringStyle;

/**
 * <pre>
 *     `USER_ID`           int(11)         COMMENT '用户id',
 *     `NAME`              varchar(128)    COMMENT '用户名 昵称',
 *     `EMAIL`             varchar(512)    COMMENT '用户电子邮件',
 *     `CONTENT`           varchar(1024)   COMMENT '反馈内容详情',
 *     `HANDLE_STATE`      int(2)          COMMENT '处理状态 0=未处理,1=已经处理,2=停止',
 * </pre>
 * 
 * @author zxc Dec 3, 2014 11:30:51 AM
 */
public class FeedbackDO extends BaseDO {

    private static final long serialVersionUID = -3809443047778268930L;

    private Long              userId;                                  // 用户id
    private String            name;                                    // 用户名

    private String            email;                                   // 用户电子邮件
    private String            content;                                 // 反馈内容详情

    private Integer           handleState;                             // 处理状态 0=未处理,1=已经处理,2=停止

    public FeedbackDO() {

    }

    public FeedbackDO(Long id) {
        setId(id);
    }

    public FeedbackDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public FeedbackDO(Long id, HandleStateEnum handleState) {
        setId(id);
        setHandleState(handleState.getValue());
    }

    public FeedbackDO(MemberDO member, String content) {
        if (member != null) {
            setUserId(member.getId());
            setName(member.getName());
            setEmail(member.getEmail());
        }
        setContent(content);
        setHandleState(HandleStateEnum.UNHANDLE.getValue());
    }

    public FeedbackDO(Long userId, String name, String email, String content) {
        setUserId(userId);
        setName(name);
        setEmail(email);
        setContent(content);
        setHandleState(HandleStateEnum.UNHANDLE.getValue());
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public String getHandleStateDesc() {
        return HandleStateEnum.getEnum(handleState).getDesc();
    }

    public Integer getHandleState() {
        return handleState;
    }

    public void setHandleState(Integer handleState) {
        this.handleState = handleState;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
