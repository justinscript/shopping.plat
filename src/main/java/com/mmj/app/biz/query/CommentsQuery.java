/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.SubjectEnum;
import com.mmj.app.biz.domain.CommentsDO;

/**
 * @author zxc Nov 25, 2014 10:19:24 PM
 */
public class CommentsQuery extends BaseQuery<CommentsDO> {

    private Integer subjectId;

    private Long    relationId; // 查询包含该评论id的记录或者包含它父评论id的记录

    public CommentsQuery() {
        this(new CommentsDO());
    }

    public CommentsQuery(CommentsDO t) {
        super(t);
    }

    public CommentsQuery(Long uId) {
        entity.setUserId(uId);
    }

    public CommentsQuery(Long uId, Long topicId) {
        entity.setUserId(uId);
        entity.setTopicId(topicId);
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    public void setSubjectId(SubjectEnum subjectId) {
        this.subjectId = subjectId.getValue();
    }

    public Long getRelationId() {
        return relationId;
    }

    public void setRelationId(Long relationId) {
        this.relationId = relationId;
    }
}
