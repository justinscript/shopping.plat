/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.common.core.CustomToStringStyle;

/**
 * 黑名单
 * 
 * @author zxc Nov 25, 2014 9:22:32 PM
 */
public class BlacklistDO extends BaseDO {

    private static final long serialVersionUID = -1049247103058340080L;

    private Long              userId;                                  // 用户id
    private Long              blackUserId;                             // 被黑用户id
    private Integer           blackAction;                             // 被黑用户动作
    private String            remark;                                  // 拉黑备注

    public BlacklistDO() {

    }

    public BlacklistDO(Long userId, Long blackUserId) {
        setUserId(userId);
        setBlackUserId(blackUserId);
    }

    public BlacklistDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getBlackUserId() {
        return blackUserId;
    }

    public void setBlackUserId(Long blackUserId) {
        this.blackUserId = blackUserId;
    }

    public Integer getBlackAction() {
        return blackAction;
    }

    public void setBlackAction(Integer blackAction) {
        this.blackAction = blackAction;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
