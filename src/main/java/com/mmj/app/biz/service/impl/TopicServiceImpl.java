/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service.impl;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.dao.TopicDao;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.biz.service.interfaces.TopicService;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.core.lang.ArrayUtils;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * @author zxc Nov 25, 2014 10:25:19 PM
 */
@Service
public class TopicServiceImpl implements TopicService {

    @Autowired
    private TopicDao topicDao;

    @Override
    public Integer refreshcount(Long id) {
        if (id == null) {
            return 0;
        }
        TopicDO topic = new TopicDO();
        topic.setId(id);
        return topicDao.refreshcount(new TopicQuery(topic));
    }

    @Override
    public Integer getMaxId(TopicQuery q) {
        return topicDao.getMaxId(q);
    }

    @Override
    public Date getLastPublishTime(Long uId) {
        if (Argument.isNotPositive(uId)) {
            return null;
        }
        TopicDO topicDO = topicDao.getLastPublishTime(uId);
        return topicDO == null ? null : topicDO.getGmtCreate();
    }

    @Override
    public Integer count(TopicQuery q) {
        if (q == null) {
            return 0;
        }
        return topicDao.count(q);
    }

    @Override
    public TopicDO find(TopicQuery q) {
        if (q == null) {
            return null;
        }
        return topicDao.find(q);
    }

    @Override
    public List<TopicDO> list(TopicQuery q) {
        if (q == null) {
            return Collections.<TopicDO> emptyList();
        }
        return topicDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<TopicDO> listPagination(TopicQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<TopicDO>) Collections.<TopicDO> emptyList();
        }
        return (PaginationList<TopicDO>) topicDao.paginationList(q, i);
    }

    @Override
    public TopicDO getTopicById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return topicDao.getById(id);
    }

    @Override
    public Long add(TopicDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = topicDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(TopicDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return topicDao.updateById(t);
    }

    @Override
    public boolean deleteTopic(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new TopicDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteTopic(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return topicDao.deleteById(id);
    }
}
