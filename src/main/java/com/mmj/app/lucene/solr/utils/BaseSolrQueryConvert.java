/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.lucene.solr.utils;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.solr.client.solrj.SolrQuery;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.util.StringFormatter;
import com.mmj.app.lucene.solr.query.SearchQuery;
import com.mmj.app.lucene.solr.query.SuggestQuery;

/**
 * @author zxc Sep 2, 2014 1:48:42 PM
 */
public class BaseSolrQueryConvert {

    public static Logger       logger            = LoggerFactory.getLogger(BaseSolrQueryConvert.class);

    public static Character[]  invalid_chars     = new Character[] { '~', '^', '*', '"', '&', '[', ']', '(', ')', '{',
            '}', ':', '?'                       };
    public static String       invalid_chars_reg = StringUtils.join(invalid_chars, "|\\");

    public static final String REGEX             = "[^0-9a-zA-Z\u4e00-\u9fa5]*";

    public static final char   SPACE             = ' ';

    public static List<String> toStrList(List<Integer> intList) {
        if (intList == null) {
            return null;
        }
        List<String> strList = new ArrayList<String>();
        for (Integer id : intList) {
            if (id == null) {
                continue;
            }
            strList.add(String.valueOf(id));
        }
        return strList;
    }

    public static SolrQuery toAll() {
        SolrQuery solrQuery = new SolrQuery();
        solrQuery.setQuery("*:*");
        return solrQuery;
    }

    protected static String filterQuery(String value) {
        value = value == null ? value : value.replaceAll(invalid_chars_reg, "");
        return StringFormatter.matcherRegex(value, REGEX);
    }

    public static SolrQuery createSuggestQuery(SuggestQuery query) {
        SolrQuery solrQuery = new SolrQuery();
        StringBuilder sb = new StringBuilder();
        sb.append("suggest:").append(query.getPrefix()).append("*");
        solrQuery.setQuery(sb.toString());
        solrQuery.addField(query.getField());
        if (StringUtils.isNotEmpty(query.getSortFiled())) {
            solrQuery.addSort(query.getSortFiled(), SolrQuery.ORDER.desc);
        }
        solrQuery.setStart(0);
        solrQuery.setRows(100);
        return solrQuery;
    }

    protected static SolrQuery createSearchQuery(List<String> params, List<String> fiters, SearchQuery searchQuery,
                                                 String... searchHandler) {
        SolrQuery solrQuery = new SolrQuery();
        String query = null;
        if (Argument.isEmpty(params)) {
            query = ("*:*");
        } else {
            query = StringUtils.join(params, " AND ");
            if (!StringUtils.join(params.toArray()).contains("*")) {
                if (Argument.isNotEmptyArray(searchHandler)) {
                    solrQuery.setRequestHandler(StringUtils.isEmpty(searchHandler[0]) ? "/select" : searchHandler[0]);
                }

            }
        }
        if (Argument.isNotEmpty(fiters)) {
            solrQuery.setFilterQueries(StringUtils.join(fiters, " AND "));
        }
        solrQuery.setQuery(query);
        solrQuery.setStart(searchQuery.getStart());
        solrQuery.setRows(searchQuery.getRows());
        if (StringUtils.isNotBlank(searchQuery.getSortFiled())) {
            solrQuery.addSort(searchQuery.getSortFiled(), searchQuery.getOrderBy());
        }
        return solrQuery;
    }
}
