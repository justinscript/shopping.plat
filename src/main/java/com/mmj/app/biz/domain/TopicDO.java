/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.cons.SubjectEnum;
import com.mmj.app.common.core.CustomToStringStyle;
import com.mmj.app.common.util.NumberParser;

/**
 * <pre>
 *     `ID`             INT(11)     NOT NULL AUTO_INCREMENT,
 *     `GMT_CREATE`    DATETIME    NOT NULL,
 *     `GMT_MODIFIED`  DATETIME    NOT NULL,
 *     `STATUS`        INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',
 * 
 *     `USER_ID`           int(11)         COMMENT '用户id',
 *     `TITLE`             varchar(1024)   COMMENT '标题',
 *     `CONTENT`           varchar(4096)   COMMENT '内容',
 *     `LINK_URL`          varchar(512)    COMMENT '链接url',
 *     `ORIGINAL_URL`      varchar(512)    COMMENT '原始链接url',
 *     `CONTENT_SOURCE`    varchar(512)    COMMENT '内容来源',
 *     `CONTENT_KIND`      int(2)          COMMENT '文章类型种类',
 *     `PUBLISH_SOURCE`    varchar(128)    COMMENT '发布来源',
 *     `IMG_URL`           varchar(512)    COMMENT '图片url',
 *     `SUMMARY`           varchar(4096)   COMMENT '摘要',
 *     `RECOMMEND`         int(4)          COMMENT '推荐数量',
 *     `COMMENTS`          int(4)          COMMENT '评论数量',
 *     `YELLOW`            int(2)          COMMENT 'yellow黄色暴力图片',
 *     `TAB_TYPE`          int(2)          COMMENT '标签类型(链接TAB点击tabType=0;文字TAB点击tabType=1;图片TAB点击tabType=2)',
 *     `SUBJECT_ID`        int(2)          COMMENT '买买买subjectId=1; 海淘转让区subjectId=2; 发现subjectId=4; 问答社subjectId=100; 五元团subjectId=151',
 *     `TOPIC_STATE`       int(2)          COMMENT '状态: 0=未审核,1=正常,2=停止',
 *     `HIT`               int(4)          COMMENT '点击量',
 *     `IS_VOTE`           int(2)          COMMENT '是否投票  0=正常 1=停止',
 *     `IS_BAN`            int(2)          COMMENT '是否禁言  0=正常 1=禁言',
 * 
 *     `NAME`              varchar(128)    COMMENT '用户名jid',
 *     `NICK`              varchar(512)    COMMENT '昵称',
 *     `NICK_IMGURL`       varchar(512)    COMMENT '用户图像',
 * </pre>
 * 
 * 文章
 * 
 * @author zxc Nov 25, 2014 9:19:11 PM
 */
public class TopicDO extends BaseDO {

    private static final long serialVersionUID = -1277623729978195537L;

    private Long              userId;                                  // 用户id

    private String            title;                                   // 标题
    private String            content;                                 // 内容
    private String            linkUrl;                                 // 链接url
    private String            originalUrl;                             // 原始链接url
    private String            contentSource;                           // 内容来源
    private Integer           contentKind;                             // 文章类型种类
    private String            publishSource;                           // 发布来源
    private String            imgUrl;                                  // 图片url
    private String            summary;                                 // 摘要
    private Integer           recommend;                               // 推荐数量
    private Integer           comments;                                // 评论数量
    private Integer           yellow;                                  // yellow 0=正常 1=黄图

    private Integer           tabType;                                 // 标签类型(链接TAB点击tabType=0;文字TAB点击tabType=1;图片TAB点击tabType=2)
    private Integer           subjectId;                               // subject Id(买买买subjectId=1;
                                                                        // 海淘转让区subjectId=2; 发现subjectId=4;
                                                                        // 问答社subjectId=100; 五元团subjectId=151)

    private Integer           topicState;                              // 状态: 0=未审核,1=正常,2=停止
    private Integer           hit;                                     // 点击量
    private Integer           isVote;                                  // 是否投票 0=正常 1=停止
    private Integer           isBan;                                   // 是否禁言 0=正常 1=禁言

    private String            name;                                    // 用户名jid
    private String            nick;                                    // 昵称
    private String            nickImgurl;                              // 用户图像

    public TopicDO() {

    }

    public TopicDO(Long userId) {
        setUserId(userId);
    }

    public TopicDO(Long id, Integer comments) {
        setId(id);
        setComments(comments);
    }

    public TopicDO(SubjectEnum subject) {
        if (subject != null) {
            setSubjectId(subject.getValue());
        }
    }

    public TopicDO(Long userId, String name) {
        setUserId(userId);
        setName(name);
    }

    public TopicDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public TopicDO(Long id, Integer hit, Integer recommend) {
        setId(id);
        setHit(hit);
        setRecommend(recommend);
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public String getSubjectDesc() {
        return SubjectEnum.getEnum(subjectId).getDesc();
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getLinkUrl() {
        return linkUrl;
    }

    public void setLinkUrl(String linkUrl) {
        this.linkUrl = linkUrl;
    }

    public String getOriginalUrl() {
        return originalUrl;
    }

    public void setOriginalUrl(String originalUrl) {
        this.originalUrl = originalUrl;
    }

    public String getContentSource() {
        return contentSource;
    }

    public void setContentSource(String contentSource) {
        this.contentSource = contentSource;
    }

    public Integer getContentKind() {
        return contentKind;
    }

    public void setContentKind(Integer contentKind) {
        this.contentKind = contentKind;
    }

    public String getPublishSource() {
        return publishSource;
    }

    public void setPublishSource(String publishSource) {
        this.publishSource = publishSource;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Integer getRecommend() {
        return recommend;
    }

    public void setRecommend(Integer recommend) {
        this.recommend = recommend;
    }

    public Integer getComments() {
        return comments;
    }

    public void setComments(Integer comments) {
        this.comments = comments;
    }

    public Integer getYellow() {
        return yellow;
    }

    public void setYellow(Integer yellow) {
        this.yellow = yellow;
    }

    public Integer getTabType() {
        return tabType;
    }

    public void setTabType(Integer tabType) {
        this.tabType = tabType;
    }

    // 状态: 0=未审核,1=正常,2=停止
    public String getTopicStateDesc() {
    	 return StateEnum.getEnum(topicState).getDesc();
    }

    public Integer getTopicState() {
        return topicState;
    }

    public void setTopicState(Integer topicState) {
        this.topicState = topicState;
    }

    public Integer getHit() {
        return hit;
    }

    public void setHit(Integer hit) {
        this.hit = hit;
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
