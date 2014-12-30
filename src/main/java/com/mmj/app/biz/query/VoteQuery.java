/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.VoteEnum;
import com.mmj.app.biz.domain.VoteDO;

/**
 * @author zxc Dec 3, 2014 11:56:23 AM
 */
public class VoteQuery extends BaseQuery<VoteDO> {

    public VoteQuery() {
        this(new VoteDO());
    }

    public VoteQuery(VoteDO t) {
        super(t);
    }

    public VoteQuery(Long uId) {
        entity.setUserId(uId);
    }

    public VoteQuery(Long topicId, Long commentsId, VoteEnum voteEnum) {
        entity.setTopicId(topicId);
        entity.setCommentsId(commentsId);
        entity.setVote(voteEnum.getValue());
    }

    public VoteQuery(Long topicId, Long commentsId) {
        entity.setTopicId(topicId);
        entity.setCommentsId(commentsId);
    }

    public VoteQuery(Long userId, Long topicId, Long commentsId) {
        entity.setUserId(userId);
        entity.setTopicId(topicId);
        entity.setCommentsId(commentsId);
    }

    public VoteQuery(Long userId, Long topicId, Long commentsId, VoteEnum voteEnum) {
        entity.setUserId(userId);
        entity.setTopicId(topicId);
        entity.setCommentsId(commentsId);
        entity.setVote(voteEnum.getValue());
    }
}
