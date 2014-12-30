/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.cons.UnReadEnum;
import com.mmj.app.common.core.CustomToStringStyle;

/**
 * <pre>
 * -- 私信
 * CREATE TABLE letter (
 *     `ID`            INT(11)     NOT NULL AUTO_INCREMENT,
 *     `GMT_CREATE`    DATETIME    NOT NULL,
 *     `GMT_MODIFIED`  DATETIME    NOT NULL,
 *     `STATUS`        INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',
 * 
 *     `USER_ID`                   int(11)         COMMENT '发起人用户id',
 *     `SENDER_DIALOG_ID`          int(11)         COMMENT '发起人会话id',
 *     `RECIPIENT_USER_ID`         int(11)         COMMENT '接收人用户id',
 *     `RECIPIENT_DIALOG_ID`       int(11)         COMMENT '接收人会话id',
 *     `PARENT_ID`                 int(11)         COMMENT '父私信id',
 *     `UN_READ`                   int(2)          COMMENT '是否阅读: 0=已读,1=未读',
 *     `CONTENT`                   varchar(1024)   COMMENT '私信内容详情',
 *     `LETTER_ACTION`             int(2)          COMMENT '发起的动作',
 *     `LETTER_TYPE`               int(2)          COMMENT '私信类型',
 * 
 *     PRIMARY KEY  (`ID`)
 * )ENGINE=InnoDB DEFAULT CHARSET=utf8;
 * </pre>
 * 
 * @author zxc Nov 25, 2014 9:21:51 PM
 */
public class LetterDO extends BaseDO {

    private static final long serialVersionUID = -3272168458488384987L;

    private Long              userId;                                  // 发起人用户id
    private Long              senderDialogId;                          // 发起人会话id
    private Long              recipientUserId;                         // 接收人用户id
    private Long              recipientDialogId;                       // 接收人会话id
    private Long              parentId;                                // 父私信id
    private Integer           unRead;                                  // 是否阅读: 0=已读,1=未读,2=屏蔽
    private String            content;                                 // 私信内容详情
    private Integer           letterAction;                            // 发起的动作
    private Integer           letterType;                              // 私信类型

    public LetterDO() {

    }

    public LetterDO(Long id, UnReadEnum unRead) {
        setId(id);
        setUnRead(unRead.getValue());
    }

    public LetterDO(Long userId, Long senderDialogId, String content, Integer letterType) {
        setUserId(userId);
        setSenderDialogId(senderDialogId);
        setContent(content);
        setLetterType(letterType);
        setUnRead(1);
    }

    public LetterDO(Long userId, Long senderDialogId, Long recipientUserId, Long recipientDialogId, String content) {
        setUserId(userId);
        setSenderDialogId(senderDialogId);
        setRecipientUserId(recipientUserId);
        setRecipientDialogId(recipientDialogId);
        setContent(content);
        setUnRead(UnReadEnum.UN_READ.getValue());
    }

    public LetterDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getUnRead() {
        return unRead;
    }

    public Long getRecipientUserId() {
        return recipientUserId;
    }

    public void setRecipientUserId(Long recipientUserId) {
        this.recipientUserId = recipientUserId;
    }

    public void setUnRead(Integer unRead) {
        this.unRead = unRead;
    }

    public Long getSenderDialogId() {
        return senderDialogId;
    }

    public void setSenderDialogId(Long senderDialogId) {
        this.senderDialogId = senderDialogId;
    }

    public Long getRecipientDialogId() {
        return recipientDialogId;
    }

    public void setRecipientDialogId(Long recipientDialogId) {
        this.recipientDialogId = recipientDialogId;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
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
