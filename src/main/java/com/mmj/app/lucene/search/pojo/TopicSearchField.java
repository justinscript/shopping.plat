/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.lucene.search.pojo;

import java.io.Serializable;
import java.util.Date;

import org.apache.solr.client.solrj.beans.Field;

import com.mmj.app.lucene.solr.pojo.SearchField;

/**
 * @author zxc Dec 8, 2014 11:44:46 PM
 */
public class TopicSearchField implements SearchField, Serializable {

    private static final long serialVersionUID = 6344666476685208889L;

    @Field("topicId")
    private Long              id;                                     // 主键
    @Field("topicGmtCreate")
    private Long              gmtCreateLong;                          // 创建时间
    @Field("topicGmtModified")
    private Long              gmtModifiedLong;                        // 修改时间
    @Field("topicStatus")
    private Integer           status;                                 // 记录状态: 0=正常,1=删除

    @Field
    private String            title;                                  // 标题
    @Field
    private String            content;                                // 内容
    @Field
    private String            linkUrl;                                // 链接url
    @Field
    private String            originalUrl;                            // 原始链接url
    @Field
    private String            contentSource;                          // 内容来源
    @Field
    private Integer           contentKind;                            // 文章类型种类
    @Field
    private String            publishSource;                          // 发布来源
    @Field
    private String            imgUrl;                                 // 图片url
    @Field
    private String            summary;                                // 摘要
    @Field
    private Integer           recommend;                              // 推荐数量
    @Field
    private Integer           comments;                               // 评论数量
    @Field
    private Integer           yellow;                                 // yellow 0=正常 1=黄图
    @Field
    private Integer           tabType;                                // 标签类型(链接TAB点击tabType=0;文字TAB点击tabType=1;图片TAB点击tabType=2)
    @Field
    private Integer           subjectId;                              // subject Id(买买买subjectId=1;
    @Field
    private Integer           topicState;                             // 状态: 0=未审核,1=正常,2=停止
    @Field
    private Integer           hit;                                    // 点击量

    private Integer           isVote;                                 // 是否投票 0=正常 1=停止

    private Integer           isBan;                                  // 是否禁言 0=正常 1=禁言

    @Field
    private Long              userId;                                 // 用户id
    @Field("userName")
    private String            name;                                   // name
    @Field("userNick")
    private String            nick;                                   // 昵称
    @Field
    private String            nickImgurl;                             // 用户图像

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

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
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

    public Integer getIsBan() {
        return isBan;
    }

    public void setIsBan(Integer isBan) {
        this.isBan = isBan;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGmtCreateLong() {
        return gmtCreateLong;
    }

    public Date getGmtCreate() {
        return new Date(gmtCreateLong);
    }

    public void setGmtCreateLong(Long gmtCreateLong) {
        this.gmtCreateLong = gmtCreateLong;
    }

    public Long getGmtModifiedLong() {
        return gmtModifiedLong;
    }

    public Date getGmtModified() {
        return new Date(gmtModifiedLong);
    }

    public void setGmtModifiedLong(Long gmtModifiedLong) {
        this.gmtModifiedLong = gmtModifiedLong;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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

    public String getNickImgurl() {
        return nickImgurl;
    }

    public void setNickImgurl(String nickImgurl) {
        this.nickImgurl = nickImgurl;
    }
}
