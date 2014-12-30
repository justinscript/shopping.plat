/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.cons.VoteEnum;
import com.mmj.app.common.core.CustomToStringStyle;

/**
 * <pre>
 *     `USER_ID`           int(11)         COMMENT '用户id',
 *     `TOPIC_ID`          int(11)         COMMENT '文章id',
 *     `COMMENTS_ID`       int(11)         COMMENT '评论id',
 *     `NICK`              varchar(128)    COMMENT '用户名name',
 *     `VOTE`              int(2)          COMMENT '投票 顶=1 踩=-1',
 * </pre>
 * 
 * @author zxc Dec 3, 2014 11:30:24 AM
 */
public class VoteDO extends BaseDO {

    private static final long serialVersionUID = 2222071528060659874L;

    private Long              userId;                                 // 用户id
    private Long              topicId;                                // 文章id
    private Long              commentsId;                             // 评论id
    private String            name;                                   // 用户名

    private Integer           vote;                                   // 投票 顶=1 踩=-1

    public VoteDO() {

    }

    public VoteDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public VoteDO(Long userId, Long topicId, Long commentsId, String name, VoteEnum voteEnum) {
        setUserId(userId);
        setTopicId(topicId);
        setCommentsId(commentsId);
        setName(name);
        setVote(voteEnum.value);
    }

    public VoteDO(Long userId, Long topicId, Long commentsId, String name, Integer vote) {
        setUserId(userId);
        setTopicId(topicId);
        setCommentsId(commentsId);
        setName(name);
        setVote(vote);
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Long getCommentsId() {
        return commentsId;
    }

    public void setCommentsId(Long commentsId) {
        this.commentsId = commentsId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getVote() {
        return vote;
    }

    public void setVote(Integer vote) {
        this.vote = vote;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
