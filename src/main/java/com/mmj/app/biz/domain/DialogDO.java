/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.common.core.CustomToStringStyle;

/**
 * <pre>
 *     `SENDER_USER_ID`        int(11)         COMMENT '发起人用户id',
 *     `SENDER_NAME`           varchar(128)    COMMENT '发起人用户名',
 *     `SENDER_NICK`           varchar(128)    COMMENT '发起人昵称',
 *     `SENDER_NICK_IMGURL`    varchar(512)    COMMENT '发起人用户图像',
 *     `RECIPIENT_USER_ID`     int(11)         COMMENT '接收人用户id',
 *     `RECIPIENT_NAME`        varchar(128)    COMMENT '接收人用户名',
 *     `RECIPIENT_NICK`        varchar(128)    COMMENT '接收人昵称',
 *     `RECIPIENT_NICK_IMGURL` varchar(512)    COMMENT '接收人用户图像',
 *     `DIALOG_ACTION`         int(2)          COMMENT '发起的动作',
 * </pre>
 * 
 * @author zxc Dec 4, 2014 3:25:04 PM
 */
public class DialogDO extends BaseDO {

    private static final long serialVersionUID = -1615143886297243266L;

    private Long              senderUserId;                            // 发起人用户id
    private String            senderName;                              // 发起人用户名
    private String            senderNick;                              // 发起人昵称
    private String            senderNickImgUrl;                        // 发起人用户图像

    private Long              recipientUserId;                         // 接收人用户id
    private String            recipientName;                           // 接收人用户名
    private String            recipientNick;                           // 接收人昵称
    private String            recipientNickImgUrl;                     // 接收人用户图像

    private Long              dialogAction;                            // 发起的动作

    public DialogDO() {

    }

    public DialogDO(Long senderUserId, String senderName, Long recipientUserId, String recipientName) {
        setSenderUserId(senderUserId);
        setSenderName(senderName);
        setRecipientUserId(recipientUserId);
        setRecipientName(recipientName);
    }

    public DialogDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public Long getSenderUserId() {
        return senderUserId;
    }

    public void setSenderUserId(Long senderUserId) {
        this.senderUserId = senderUserId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getSenderNick() {
        return senderNick;
    }

    public void setSenderNick(String senderNick) {
        this.senderNick = senderNick;
    }

    public String getSenderNickImgUrl() {
        return senderNickImgUrl;
    }

    public String getSenderNickImgUrlStr() {
        return StringUtils.isEmpty(senderNickImgUrl) ? "/images/image48.png" : senderNickImgUrl;
    }

    public void setSenderNickImgUrl(String senderNickImgUrl) {
        this.senderNickImgUrl = senderNickImgUrl;
    }

    public Long getRecipientUserId() {
        return recipientUserId;
    }

    public void setRecipientUserId(Long recipientUserId) {
        this.recipientUserId = recipientUserId;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientNick() {
        return recipientNick;
    }

    public void setRecipientNick(String recipientNick) {
        this.recipientNick = recipientNick;
    }

    public String getRecipientNickImgUrl() {
        return recipientNickImgUrl;
    }

    public void setRecipientNickImgUrl(String recipientNickImgUrl) {
        this.recipientNickImgUrl = recipientNickImgUrl;
    }

    public Long getDialogAction() {
        return dialogAction;
    }

    public void setDialogAction(Long dialogAction) {
        this.dialogAction = dialogAction;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
