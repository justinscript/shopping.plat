/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.vo;

import com.mmj.app.biz.domain.NotificationDO;
import com.mmj.app.common.util.DateViewTools;
import com.mmj.app.common.util.NumberParser;

/**
 * 通知对象VO
 * 
 * <pre>
 *    {
 *         "action": 3, 
 *         "actiontime": 1419392441567000, 
 *         "content": "laolunshi回复了您的评论<a href=\"/link/6415846/comments/7089330\">\"sdfa\"</a>", 
 *         "createTime": "11:40", 
 *         "createtime": 1419392441567000, 
 *         "destjid": "zxc337", 
 *         "fromjid": "laolunshi", 
 *         "id": 3900536, 
 *         "ids": "3900536", 
 *         "isRead": false, 
 *         "linksId": 6415846, 
 *         "messageId": 3, 
 *         "title": "<a href=\"/user/laolunshi\"  class=\"a-jid\" target=\"_blank\">laolunshi</a> 回复了<a href=\"/link/6415846/comments/7089330\" target=\"_blank\" class=\"f-href\">"sdfa"</a><span class=\"f-time\" id=\"f-time-3900536\">11:40</span>"
 *     }, 
 *     {
 *         "action": 2, 
 *         "actiontime": 1419391969333000, 
 *         "content": "laolunshi评论了你发布的<a href=\"/link/6527455/comments/7089236\">\"徐神的诗 | Jeck_Zhang\"</a>", 
 *         "createTime": "11:32", 
 *         "createtime": 1419391969333000, 
 *         "destjid": "zxc337", 
 *         "fromjid": "laolunshi", 
 *         "id": 3900450, 
 *         "ids": "3900450", 
 *         "isRead": false, 
 *         "linksId": 6527455, 
 *         "messageId": 2, 
 *         "title": "<a href=\"/user/laolunshi\"  class=\"a-jid\" target=\"_blank\">laolunshi</a> 评论了<a href=\"/link/6527455/comments/7089236\" target=\"_blank\" class=\"f-href\">"徐神的诗 | Jeck_Zhang"</a><span class=\"f-time\" id=\"f-time-3900450\">11:32</span>"
 *     }
 * </pre>
 * 
 * @author zxc Dec 4, 2014 12:28:11 AM
 */
public class NotificationVO {

    private String action;
    private String actiontime;
    private String content;
    private String createTime;
    private String createtime;
    private String destjid;
    private String fromjid;
    private String id;
    private String ids;
    private String isRead;
    private String linksId;
    private String messageId;
    private String title;

    public NotificationVO() {

    }

    public NotificationVO(NotificationDO notification) {
        setAction(notification.getNotificationType() + "");
        setActiontime(notification.getGmtCreate().getTime() + "");
        setCreateTime(DateViewTools.format(notification.getGmtCreate(), "HH:mm"));
        setCreatetime(notification.getGmtCreate().getTime() + "");
        setDestjid(notification.getName());
        setFromjid(notification.getActionName());
        setId(notification.getId() + "");
        setIds(notification.getId() + "");
        setIsRead(NumberParser.isEqual(1, notification.getUnRead()) ? "false" : "true");
        setLinksId(notification.getLinkId() + "");
        setMessageId(notification.getNotificationType() + "");

        String _content = notification.getContent();
        Long commentsId = notification.getCommentsId();
        Long linkId = notification.getLinkId();
        // 私信类型 :回复评论的通知3;评论发布的通知2
        String desc = "";
        String _desc = "";
        if (NumberParser.isEqual(2, notification.getNotificationType())) {
            desc = "回复了";
            _desc = "回复了您的评论";
        }
        if (NumberParser.isEqual(3, notification.getNotificationType())) {
            desc = "评论了";
            _desc = "评论了你发布的";
        }

        String _title = "<a href=\"/user/" + notification.getActionName() + "\"  class=\"a-jid\" target=\"_blank\">"
                        + notification.getActionNick() + "</a> " + desc + "" + "<a href=\"/link/" + linkId
                        + "/comments/" + commentsId + "\" target=\"_blank\" class=\"f-href\">\"" + _content + "\"</a>"
                        + "<span class=\"f-time\" id=\"f-time-" + notification.getId() + "\">" + getCreateTime()
                        + "</span>";

        String _content_ = notification.getActionNick() + _desc + "<a href=\"/link/" + linkId + "/comments/"
                           + commentsId + "\">\"" + _content + "\"</a>";

        setContent(_content_);
        setTitle(_title);
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getActiontime() {
        return actiontime;
    }

    public void setActiontime(String actiontime) {
        this.actiontime = actiontime;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCreateTime() {
        return createTime;
    }

    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    public String getCreatetime() {
        return createtime;
    }

    public void setCreatetime(String createtime) {
        this.createtime = createtime;
    }

    public String getDestjid() {
        return destjid;
    }

    public void setDestjid(String destjid) {
        this.destjid = destjid;
    }

    public String getFromjid() {
        return fromjid;
    }

    public void setFromjid(String fromjid) {
        this.fromjid = fromjid;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getIds() {
        return ids;
    }

    public void setIds(String ids) {
        this.ids = ids;
    }

    public String getIsRead() {
        return isRead;
    }

    public void setIsRead(String isRead) {
        this.isRead = isRead;
    }

    public String getLinksId() {
        return linksId;
    }

    public void setLinksId(String linksId) {
        this.linksId = linksId;
    }

    public String getMessageId() {
        return messageId;
    }

    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
