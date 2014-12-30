/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.domain;

import java.util.Date;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.cons.SubjectEnum;
import com.mmj.app.common.core.CustomToStringStyle;
import com.mmj.app.common.util.NumberParser;

/**
 * @author zxc Dec 3, 2014 1:39:04 PM
 */
public class CollectFullDO extends CollectDO {

    private static final long serialVersionUID = 3359712615149228456L;

    private Date              topicGmtCreate;                         // 创建时间
    private Date              topicGmtModified;                       // 修改时间
    private Integer           topicStatus;                            // 记录状态: 0=正常,1=删除
    private Long              topicUserId;                            // 用户id
    private String            title;                                  // 标题
    private String            content;                                // 内容
    private String            linkUrl;                                // 链接url
    private String            originalUrl;                            // 原始链接url
    private String            contentSource;                          // 内容来源
    private Integer           contentKind;                            // 文章类型种类
    private String            publishSource;                          // 发布来源
    private String            imgUrl;                                 // 图片url
    private String            summary;                                // 摘要
    private Integer           recommend;                              // 推荐数量
    private Integer           comments;                               // 评论数量
    private Integer           yellow;                                 // yellow 0=正常 1=黄图
    private Integer           tabType;                                // 标签类型(链接TAB点击tabType=0;文字TAB点击tabType=1;图片TAB点击tabType=2)
    private Integer           subjectId;                              // subject Id(买买买subjectId=1;
                                                                       // 海淘转让区subjectId=2; 发现subjectId=4;
                                                                       // 问答社subjectId=100; 五元团subjectId=151)
    private Integer           topicState;                             // 状态: 0=未审核,1=正常,2=停止
    private Integer           hit;                                    // 点击量
    private Integer           isVote;                                 // 是否投票 0=正常 1=停止
    private Integer           isBan;                                  // 是否禁言 0=正常 1=禁言

    private String            nick;                                   // 昵称
    private String            nickImgurl;                             // 用户图像

    public Date getTopicGmtCreate() {
        return topicGmtCreate;
    }

    public void setTopicGmtCreate(Date topicGmtCreate) {
        this.topicGmtCreate = topicGmtCreate;
    }

    public Date getTopicGmtModified() {
        return topicGmtModified;
    }

    public void setTopicGmtModified(Date topicGmtModified) {
        this.topicGmtModified = topicGmtModified;
    }

    public Integer getTopicStatus() {
        return topicStatus;
    }

    public void setTopicStatus(Integer topicStatus) {
        this.topicStatus = topicStatus;
    }

    public Long getTopicUserId() {
        return topicUserId;
    }

    public void setTopicUserId(Long topicUserId) {
        this.topicUserId = topicUserId;
    }

    public String getTitle() {
        return title;
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

    public String getSubjectDesc() {
        return SubjectEnum.getEnum(subjectId).getDesc();
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
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
