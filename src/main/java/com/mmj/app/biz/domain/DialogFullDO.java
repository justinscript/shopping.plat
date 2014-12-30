/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.domain;

import java.util.Date;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.common.core.CustomToStringStyle;

/**
 * @author zxc Dec 4, 2014 4:36:33 PM
 */
public class DialogFullDO extends DialogDO {

    private static final long serialVersionUID = 2496297730370147394L;

    private Date              letterGmtCreate;                        // letter创建时间
    private Long              parentId;                               // 父私信id
    private Integer           unRead;                                 // 是否阅读: 0=已读,1=未读,2=屏蔽
    private String            content;                                // 私信内容详情
    private Integer           letterAction;                           // 发起的动作
    private Integer           letterType;                             // 私信类型

    public DialogFullDO() {

    }

    public Date getLetterGmtCreate() {
        return letterGmtCreate;
    }

    public void setLetterGmtCreate(Date letterGmtCreate) {
        this.letterGmtCreate = letterGmtCreate;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Integer getUnRead() {
        return unRead;
    }

    public void setUnRead(Integer unRead) {
        this.unRead = unRead;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getLetterAction() {
        return letterAction;
    }

    public void setLetterAction(Integer letterAction) {
        this.letterAction = letterAction;
    }

    public Integer getLetterType() {
        return letterType;
    }

    public void setLetterType(Integer letterType) {
        this.letterType = letterType;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
