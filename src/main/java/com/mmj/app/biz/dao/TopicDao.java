/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.dao;

import org.springframework.stereotype.Repository;

import com.mmj.app.biz.base.BaseDao;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.mapper.TopicMapper;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.common.core.lang.Argument;

/**
 * @author zxc Nov 25, 2014 10:15:19 PM
 */
@Repository
public class TopicDao extends BaseDao<TopicDO, TopicMapper, TopicQuery> {

    public TopicDO getLastPublishTime(Long uId) {
        if (Argument.isNotPositive(uId)) {
            return null;
        }
        return m.getLastPublishTime(uId);
    }

    public Integer refreshcount(TopicQuery q) {
        if (q == null || q.getT() == null || Argument.isNotPositive(q.getT().getId())) {
            return 0;
        }
        return m.refreshcount(q);
    }

    public Integer getMaxId(TopicQuery q) {
        return m.getMaxId(q);
    }
}
