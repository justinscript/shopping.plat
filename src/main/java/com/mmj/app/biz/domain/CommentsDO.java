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
import com.mmj.app.common.util.NumberParser;

/**
 * <pre>
 * -- 评论
 * CREATE TABLE comments (
 *     `ID`            INT(11)      NOT NULL AUTO_INCREMENT,
 *     `GMT_CREATE`    DATETIME     NOT NULL,
 *     `GMT_MODIFIED`  DATETIME     NOT NULL,
 *     `STATUS`        INT(2)       NOT NULL  COMMENT '记录状态: 0=正常,1=删除',
 * 
 *     `USER_ID`           int(11)         COMMENT '用户id',
 *     `PARENT_ID`         int(11)         COMMENT '父id',
 *     `CONTENT`           varchar(1024)   COMMENT '内容',
 *     `TOPIC_ID`          int(11)         COMMENT '文章id',
 *     `DEPTH`             int(2)          COMMENT '嵌套深度',
 *     `IS_VOTE`           int(2)          COMMENT '是否投票',
 *     `IS_BAN`            int(2)          COMMENT '是否禁言',
 *     `SCORE`             int             COMMENT '得分',
 *     `UPS`               int(4)          COMMENT '顶:顶[24]踩[0]',
 *     `DOWNS`             int(4)          COMMENT '踩:顶[24]踩[0]',
 *     `COMMENT_TYPE`      int(2)          COMMENT '评论类型',
 *     `CLOSE_IP`          varchar(64)     COMMENT '封的ip',
 *     `ASSENT_TEXT`       varchar(128)    COMMENT '',
 *     `COMMENTS_ACTION`   int             COMMENT '动作',
 *     `ITEMS`             int             COMMENT '',
 * 
 *     `NAME`              varchar(128)    COMMENT '用户名jid',
 *     `NICK`              varchar(512)    COMMENT '昵称',
 *     `NICK_IMGURL`       varchar(512)    COMMENT '用户图像',
 *     PRIMARY KEY  (`ID`)
 * )ENGINE=InnoDB DEFAULT CHARSET=utf8;
 * </pre>
 * 
 * @author zxc Nov 25, 2014 9:18:27 PM
 */
public class CommentsDO extends BaseDO {

    private static final long serialVersionUID = 6109659877978649527L;

    private Long              userId;                                 // 用户id
    private Long              parentId;                               // 父id
    private Long              topicId;                                // 文章id
    private String            content;                                // 内容
    private Integer           depth;                                  // 嵌套深度
    private Integer           isVote;                                 // 是否可以投票 0=可以,1=不可以
    private Integer           isBan;                                  // 是否禁言
    private Long              score;                                  // 得分
    private Integer           ups;                                    // 顶:顶[24]踩[0]
    private Integer           downs;                                  // 踩:顶[24]踩[0]
    private Integer           commentType;                            // 评论类型
    private String            closeIp;                                // 封的ip
    private String            assentText;                             //
    private Integer           commentsAction;                         // 动作
    private Integer           items;                                  //

    private String            name;                                   // 用户名jid
    private String            nick;                                   // 昵称
    private String            nickImgurl;                             // 用户图像

    public String getCreateTime() {
        return DateViewTools.format(this.getGmtCreate(), "HH:mm");
    }

    public CommentsDO() {

    }

    public CommentsDO(Long id) {
        setId(id);
    }

    public CommentsDO(Long userId, Long parentId, Long topicId, String content, String name) {
        setUserId(userId);
        setParentId(parentId);
        setTopicId(topicId);
        setContent(content);
        setName(name);
        setUps(1);
        setDowns(0);
        setDepth(0);
        setIsBan(0);
    }

    public CommentsDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
    }

    // 是否可以投票 0=可以,1=不可以
    public String getIsVoteDesc() {
        return NumberParser.isEqual(isVote, 1) ? "不可以" : "正常";
    }

    public Integer getIsVote() {
        return isVote;
    }

    public void setIsVote(Integer isVote) {
        this.isVote = isVote;
    }

    // 是否禁言 0=正常 1=禁言
    public String getIsBanDesc() {
        return NumberParser.isEqual(isBan, 1) ? "禁言" : "正常";
    }

    public Integer getIsBan() {
        return isBan;
    }

    public void setIsBan(Integer isBan) {
        this.isBan = isBan;
    }

    public Long getScore() {
        return score;
    }

    public void setScore(Long score) {
        this.score = score;
    }

    public Integer getUps() {
        return ups;
    }

    public void setUps(Integer ups) {
        this.ups = ups;
    }

    public Integer getDowns() {
        return downs;
    }

    public void setDowns(Integer downs) {
        this.downs = downs;
    }

    public Integer getCommentType() {
        return commentType;
    }

    public void setCommentType(Integer commentType) {
        this.commentType = commentType;
    }

    public String getCloseIp() {
        return closeIp;
    }

    public void setCloseIp(String closeIp) {
        this.closeIp = closeIp;
    }

    public String getAssentText() {
        return assentText;
    }

    public void setAssentText(String assentText) {
        this.assentText = assentText;
    }

    public Integer getCommentsAction() {
        return commentsAction;
    }

    public void setCommentsAction(Integer commentsAction) {
        this.commentsAction = commentsAction;
    }

    public Integer getItems() {
        return items;
    }

    public void setItems(Integer items) {
        this.items = items;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getNickImgurl() {
        return nickImgurl;
    }

    public void setNickImgurl(String nickImgurl) {
        this.nickImgurl = nickImgurl;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
