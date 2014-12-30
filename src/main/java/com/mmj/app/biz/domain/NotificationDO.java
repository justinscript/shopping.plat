/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.common.core.CustomToStringStyle;
import com.mmj.app.common.util.DateViewTools;

/**
 * <pre>
 * -- 通知
 * CREATE TABLE notification (
 *     `ID`            INT(11)     NOT NULL AUTO_INCREMENT,
 *     `GMT_CREATE`    DATETIME    NOT NULL,
 *     `GMT_MODIFIED`  DATETIME    NOT NULL,
 *     `STATUS`        INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',
 * 
 *     `USER_ID`               int(11)         COMMENT '用户id',
 *     `UN_READ`               int(2)          COMMENT '是否阅读: 0=已读,1=未读',
 *     `CONTENT`               varchar(1024)   COMMENT '通知内容详情',
 *     `ACTION_USER_ID`        int(11)         COMMENT '发起人id',
 *     `NOTIFICATION_ACTION`   int(2)          COMMENT '发起的动作',
 *     `NOTIFICATION_TYPE`     int(2)          COMMENT '通知类型',
 * 
 *     PRIMARY KEY  (`ID`)
 * )ENGINE=InnoDB DEFAULT CHARSET=utf8;
 * </pre>
 * 
 * @author zxc Nov 25, 2014 9:21:09 PM
 */
public class NotificationDO extends BaseDO {

    private static final long serialVersionUID = -7561459319897763504L;

    private Long              userId;                                  // 用户id
    private Integer           unRead;                                  // 是否阅读: 0=已读,1=未读,2=屏蔽
    private Long              actionUserId;                            // 发起人id
    private String            content;                                 // 通知内容详情
    private Integer           notificationAction;                      // 发起的动作
    private Integer           notificationType;                        // 私信类型 :回复评论的通知3;评论发布的通知2

    private Long              commentsId;                              // 评论Id
    private Long              linkId;                                  // 发布Id

    private String            name;
    private String            nick;
    private String            pic;

    private String            actionName;
    private String            actionNick;
    private String            actionPic;

    public String getCreateTime() {
        return DateViewTools.format(getGmtCreate(), "yyyy-MM-dd HH:mm");
    }

    public NotificationDO() {

    }

    public NotificationDO(Long userId, Long actionUserId, String content) {
        this(userId, actionUserId, content, null);
    }

    public NotificationDO(Long userId, Long actionUserId, String content, Integer notificationType) {
        setUserId(userId);
        setActionUserId(actionUserId);
        setContent(content);
        setNotificationType(notificationType);
        setUnRead(1);
    }

    public NotificationDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public Long getCommentsId() {
        return commentsId;
    }

    public void setCommentsId(Long commentsId) {
        this.commentsId = commentsId;
    }

    public Long getLinkId() {
        return linkId;
    }

    public void setLinkId(Long linkId) {
        this.linkId = linkId;
    }

    public String getActionName() {
        return actionName;
    }

    public void setActionName(String actionName) {
        this.actionName = actionName;
    }

    public String getActionNick() {
        return actionNick;
    }

    public void setActionNick(String actionNick) {
        this.actionNick = actionNick;
    }

    public String getActionPic() {
        return actionPic;
    }

    public void setActionPic(String actionPic) {
        this.actionPic = actionPic;
    }

    public NotificationDO(Long id, Integer unRead) {
        setId(id);
        setUnRead(unRead);
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

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
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

    public void setUnRead(Integer unRead) {
        this.unRead = unRead;
    }

    public Long getActionUserId() {
        return actionUserId;
    }

    public void setActionUserId(Long actionUserId) {
        this.actionUserId = actionUserId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getNotificationAction() {
        return notificationAction;
    }

    public void setNotificationAction(Integer notificationAction) {
        this.notificationAction = notificationAction;
    }

    public Integer getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(Integer notificationType) {
        this.notificationType = notificationType;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
