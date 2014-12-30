/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.vo;

import java.util.Date;

import com.mmj.app.biz.domain.DialogDO;
import com.mmj.app.biz.domain.LetterDO;
import com.mmj.app.common.util.DateViewTools;

/**
 * @author zxc Nov 30, 2014 2:50:48 AM
 */
public class LetterResposeVO {

    // {"result":{"code":"9999", "message":"发送成功",
    // "data":{"action":0,"actionTime":1417286874069000,"content":"我喜欢你","createDate":"小于1分钟前","createTime":1417286874069000,
    // "groupId":3888,"id":5701,"jid":"zxc337","otherJid":"neva8987","state":1}}}

    private Long    id;
    private Long    groupId;
    private Integer action;
    private Long    actionTime;
    private String  content;
    private String  createDate;
    private Long    createTime;
    private String  jid;
    private String  otherJid;
    private Integer state;

    public LetterResposeVO() {

    }

    public LetterResposeVO(LetterDO letter, DialogDO senderDialog, DialogDO recipientDialog) {
        if (letter == null || senderDialog == null || recipientDialog == null) {
            return;
        }
        setId(letter.getId());
        setGroupId(senderDialog.getId());

        if (senderDialog.getGmtCreate() == null && recipientDialog.getGmtCreate() == null) {
            setActionTime(System.currentTimeMillis());
        } else if (senderDialog.getGmtCreate() != null && recipientDialog.getGmtCreate() == null) {
            setActionTime(senderDialog.getGmtCreate().getTime());
        } else if (senderDialog.getGmtCreate() == null && recipientDialog.getGmtCreate() != null) {
            setActionTime(recipientDialog.getGmtCreate().getTime());
        }

        setContent(letter.getContent());
        setCreateDate(DateViewTools.getDifferDayHourMin(new Date()));
        setCreateTime(System.currentTimeMillis());

        setJid(senderDialog.getSenderName());
        setOtherJid(recipientDialog.getSenderName());
        setState(1);
        setAction(0);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public Integer getAction() {
        return action;
    }

    public void setAction(Integer action) {
        this.action = action;
    }

    public Long getActionTime() {
        return actionTime;
    }

    public void setActionTime(Long actionTime) {
        this.actionTime = actionTime;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreateDate() {
        return createDate;
    }

    public void setCreateDate(String createDate) {
        this.createDate = createDate;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public String getJid() {
        return jid;
    }

    public void setJid(String jid) {
        this.jid = jid;
    }

    public String getOtherJid() {
        return otherJid;
    }

    public void setOtherJid(String otherJid) {
        this.otherJid = otherJid;
    }

    public Integer getState() {
        return state;
    }

    public void setState(Integer state) {
        this.state = state;
    }
}
