/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.vo;

import java.util.Date;

import org.apache.commons.lang.StringUtils;

import com.mmj.app.biz.domain.DialogDO;
import com.mmj.app.biz.domain.LetterDO;
import com.mmj.app.common.util.DateViewTools;
import com.mmj.app.common.util.NumberParser;

/**
 * @author zxc Dec 4, 2014 8:58:47 PM
 */
public class DialogLetterVO {

    private Long    letterId;    // 私信ID

    private Date    gmtCreate;   // letter创建时间
    private Long    userId;      // 私信发起人用户id
    private String  name;        // 私信发起人用户名
    private String  nick;        // 私信发起人昵称
    private String  nickImgUrl;  // 私信发起人用户图像

    private Long    dialogAction; // 会话发起的动作

    private Long    parentId;    // 父私信id
    private Integer unRead;      // 是否阅读: 0=已读,1=未读,2=屏蔽
    private String  content;     // 私信内容详情

    private Integer letterAction; // 私信发起的动作
    private Integer letterType;  // 私信类型

    public DialogLetterVO() {

    }

    public String getPublishTime() {
        return DateViewTools.getDifferDayHourMin(this.getGmtCreate());
    }

    public DialogLetterVO(DialogDO dialog, LetterDO letter) {
        setLetterId(letter.getId());

        Long diaglogSenderUserId = dialog.getSenderUserId();
        Long dialogRecipientUserId = dialog.getRecipientUserId();
        Long letterSenderUserId = letter.getUserId();
        if (NumberParser.isEqual(diaglogSenderUserId, letterSenderUserId)) {
            setUserId(letterSenderUserId);
            setName(dialog.getSenderName());
            setNick(dialog.getSenderNick());
            setNickImgUrl(dialog.getSenderNickImgUrl());
            if (StringUtils.isEmpty(dialog.getSenderNickImgUrl())) {
                setNickImgUrl("/images/image48.png");
            }
        }
        if (NumberParser.isEqual(dialogRecipientUserId, letterSenderUserId)) {
            setUserId(letterSenderUserId);
            setName(dialog.getRecipientName());
            setNick(dialog.getRecipientNick());
            setNickImgUrl(dialog.getRecipientNickImgUrl());
            if (StringUtils.isEmpty(dialog.getRecipientNickImgUrl())) {
                setNickImgUrl("/images/image48.png");
            }
        }
        setDialogAction(dialog.getDialogAction());
        setParentId(letter.getParentId());
        setUnRead(0);
        setContent(letter.getContent());
        setLetterAction(letter.getLetterAction());
        setLetterType(letter.getLetterType());
        setGmtCreate(letter.getGmtCreate());
    }

    public Long getUserId() {
        return userId;
    }

    public Date getGmtCreate() {
        return gmtCreate;
    }

    public Long getLetterId() {
        return letterId;
    }

    public void setLetterId(Long letterId) {
        this.letterId = letterId;
    }

    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
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

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getNickImgUrl() {
        return nickImgUrl;
    }

    public void setNickImgUrl(String nickImgUrl) {
        this.nickImgUrl = nickImgUrl;
    }

    public Long getDialogAction() {
        return dialogAction;
    }

    public void setDialogAction(Long dialogAction) {
        this.dialogAction = dialogAction;
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
}
