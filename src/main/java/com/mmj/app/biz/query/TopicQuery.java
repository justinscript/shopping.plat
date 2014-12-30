/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.DBSortTypeEnum;
import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.cons.SubjectEnum;
import com.mmj.app.biz.domain.TopicDO;

/**
 * @author zxc Nov 25, 2014 10:20:17 PM
 */
public class TopicQuery extends BaseQuery<TopicDO> {

    public TopicQuery() {
        this(new TopicDO());
        setPageSize(DEFAULT_PAGESIZE);
    }

    public TopicQuery(TopicDO t) {
        super(t);
        setStatus(null);
        setPageSize(DEFAULT_PAGESIZE);
        setPageLength(10);
        t.setTopicState(StateEnum.NORMAL.getValue());
        t.setStatus(null);
    }

    public TopicQuery(Integer pageSize) {
        setPageSize(pageSize);
        setSortType(DBSortTypeEnum.RECOMMEND);
    }

    public TopicQuery(SubjectEnum subjectEnum, Integer pageSize) {
        entity.setSubjectId(subjectEnum.getValue());
        setPageSize(pageSize);
        setSortType(DBSortTypeEnum.RECOMMEND);
    }

    public TopicQuery(Long userId) {
        entity.setUserId(userId);
        entity.setTopicState(StateEnum.NORMAL.getValue());
    }
}
