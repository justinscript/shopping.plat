/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.lucene.search.service;

import java.util.List;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.response.QueryResponse;
import org.springframework.stereotype.Service;

import com.mmj.app.common.util.NumberParser;
import com.mmj.app.lucene.search.cons.SearchTypeEnum;
import com.mmj.app.lucene.search.pojo.TopicSearchField;
import com.mmj.app.lucene.search.query.TopicSearchQuery;
import com.mmj.app.lucene.solr.callback.SolrCallback;
import com.mmj.app.lucene.solr.query.SearchQuery;
import com.mmj.app.lucene.solr.service.BaseSearch;

/**
 * @author zxc Dec 8, 2014 11:49:29 PM
 */
@Service
public class TopicSearch<Q extends SearchQuery> extends BaseSearch<TopicSearchField, Q> {

    @Override
    public String getCoreName(Integer version) {
        return "mmjTopic";
    }

    public SearchTypeEnum getType() {
        return SearchTypeEnum.TOPIC;
    }

    @Override
    public SolrQuery convert(Q query) {
        return query.toSolrQuery();
    }

    @Override
    public List<TopicSearchField> search(Integer version, final Q query) {

        return super.search(version, query, new SolrCallback() {

            @Override
            public void handleSolrResult(QueryResponse result) {
                if (query instanceof TopicSearchQuery) {
                    Long numFound = result.getResults().getNumFound();
                    ((TopicSearchQuery) query).setAllRecordNum(NumberParser.convertToInt(numFound, 0));
                }
            }
        });
    }
}
