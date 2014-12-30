/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.vo;

import java.util.Date;

import com.mmj.app.biz.cons.UnReadEnum;
import com.mmj.app.biz.domain.DialogFullDO;
import com.mmj.app.common.util.DateViewTools;
import com.mmj.app.common.util.NumberParser;

/**
 * @author zxc Dec 4, 2014 10:19:41 PM
 */
public class DialogFullVO {

    private Long    dialogId;

    private Long    recipientUserId;    // 接收人用户id
    private String  recipientName;      // 接收人用户名
    private String  recipientNick;      // 接收人昵称
    private String  recipientNickImgUrl; // 接收人用户图像

    private Long    dialogAction;       // 发起的动作

    private Date    letterGmtCreate;    // letter创建时间
    private Integer unRead;             // 是否阅读: 0=已读,1=未读,2=屏蔽
    private String  content;            // 私信内容详情
    private Integer letterAction;       // 发起的动作
    private Integer letterType;         // 私信类型

    private Integer count;              // 当前会话中私信的条数

    public DialogFullVO() {

    }

    public DialogFullVO(Long senderUserId, DialogFullDO dialogFull, Integer count) {
        setRecipientUserId(dialogFull.getRecipientUserId());
        setRecipientName(dialogFull.getRecipientName());
        setRecipientNick(dialogFull.getRecipientNick());
        setRecipientNickImgUrl(dialogFull.getRecipientNickImgUrl());

        setDialogId(dialogFull.getId());

        setCount(count);
        setDialogAction(dialogFull.getDialogAction());

        setLetterGmtCreate(dialogFull.getLetterGmtCreate());

        if (NumberParser.isEqual(senderUserId, dialogFull.getRecipientUserId())
            && UnReadEnum.isUnRead(dialogFull.getUnRead())) {
            setUnRead(UnReadEnum.UN_READ.getValue());
        } else {
            setUnRead(UnReadEnum.READ.getValue());
        }

        setContent(dialogFull.getContent());
        setLetterAction(dialogFull.getLetterAction());
        setLetterType(dialogFull.getLetterType());
    }

    public String getPublishTime() {
        return DateViewTools.getDifferDayHourMin(this.getLetterGmtCreate());
    }

    public Date getLetterGmtCreate() {
        return letterGmtCreate;
    }

    public void setLetterGmtCreate(Date letterGmtCreate) {
        this.letterGmtCreate = letterGmtCreate;
    }

    public Long getDialogId() {
        return dialogId;
    }

    public void setDialogId(Long dialogId) {
        this.dialogId = dialogId;
    }

    public Integer getUnRead() {
        return unRead;
    }

    public void setUnRead(Integer unRead) {
        this.unRead = unRead;
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

    public Integer getCount() {
        return count;
    }

    public void setCount(Integer count) {
        this.count = count;
    }
}
