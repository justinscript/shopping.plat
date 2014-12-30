/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.lucene.search.build.fetcher;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.biz.service.interfaces.TopicService;
import com.mmj.app.common.core.SpringContextAware;
import com.mmj.app.common.core.lang.BeanUtils;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.lucene.search.build.base.BaseFetcher;
import com.mmj.app.lucene.search.build.base.DataFetcher;
import com.mmj.app.lucene.search.build.base.Param;
import com.mmj.app.lucene.search.pojo.TopicSearchField;
import com.mmj.app.lucene.solr.pojo.SearchField;

/**
 * @author zxc Dec 8, 2014 11:45:36 PM
 */
@Service
public class TopicFetcher extends BaseFetcher<TopicQuery> {

    private TopicService              topicService;

    private static final TopicFetcher instance = new TopicFetcher();

    public static DataFetcher<?> create(Param param) {
        return param == null ? instance : new TopicFetcher().setParam(param);
    }

    @Override
    protected TopicQuery createQuery() {
        TopicQuery query = new TopicQuery();
        return query;
    }

    @Override
    protected PaginationList<? extends SearchField> doFetch(TopicQuery q) {
        topicService = (TopicService) SpringContextAware.getBean("topicServiceImpl");
        PaginationList<TopicDO> list = topicService.listPagination(q);
        PaginationList<TopicSearchField> result = new PaginationList<TopicSearchField>(q);

        for (TopicDO topic : list) {
            TopicSearchField topicSearchField = new TopicSearchField();
            BeanUtils.copyProperties(topicSearchField, topic);

            if (StringUtils.isEmpty(topic.getSummary())) {
                topicSearchField.setSummary("");
            }
            topicSearchField.setGmtCreateLong(topic.getGmtCreate().getTime());
            topicSearchField.setGmtModifiedLong(topic.getGmtModified().getTime());
            result.add(topicSearchField);
        }
        return result;
    }
}
