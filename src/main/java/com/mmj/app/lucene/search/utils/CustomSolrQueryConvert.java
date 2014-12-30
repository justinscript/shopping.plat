/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.lucene.search.utils;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.solr.client.solrj.SolrQuery;

import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.util.StringFormatter;
import com.mmj.app.lucene.search.cons.SortSearchEnum;
import com.mmj.app.lucene.search.cons.TimeSearchEnum;
import com.mmj.app.lucene.search.query.TopicSearchQuery;
import com.mmj.app.lucene.search.query.UserSearchQuery;
import com.mmj.app.lucene.solr.utils.BaseSolrQueryConvert;

/**
 * 自定义查询
 * 
 * @author zxc Sep 2, 2014 1:57:47 PM
 */
public class CustomSolrQueryConvert extends BaseSolrQueryConvert {

    public static SolrQuery to(UserSearchQuery query) {
        // 查询参数
        List<String> params = new ArrayList<String>();
        // 参数设置
        if (Argument.isNotEmpty(query.getWordList())) {
            String q = StringUtils.join(query.getWordList().toArray(new String[0]), " ");
            if (StringUtils.isNotBlank(q)) {
                if (q.length() == 1 || StringFormatter.matchsRegex(q, "^[a-zA-Z]+$")
                    || StringFormatter.matchsRegex(q, "^\\d+$")) {
                    params.add("nick:*" + q + "*");
                } else {
                    params.add(filterQuery(q));
                }
            }
        }
        // 过滤查询
        List<String> fiter = new ArrayList<String>();

        return createSearchQuery(params, fiter, query);
    }

    public static SolrQuery to(TopicSearchQuery query) {
        // 查询参数
        List<String> params = new ArrayList<String>();
        // 参数设置
        if (Argument.isNotEmpty(query.getWordList())) {
            String q = StringUtils.join(query.getWordList().toArray(new String[0]), " ");
            if (StringUtils.isNotBlank(q)) {
                if (q.length() == 1 || StringFormatter.matchsRegex(q, "^[a-zA-Z]+$")
                    || StringFormatter.matchsRegex(q, "^\\d+$")) {
                    params.add("topicSearch:*" + q + "*");
                } else {
                    params.add(filterQuery(q));
                }
            }
        }
        // 过滤查询
        List<String> fiter = new ArrayList<String>();
        TimeSearchEnum timeSearch = query.getTime();
        if (timeSearch != null && timeSearch.getStartTimeLong() != null) {
            fiter.add(String.format("topicGmtCreate:[%s TO *]", timeSearch.getStartTimeLong()));
        }
        // 排序设置
        SortSearchEnum sortSearch = query.getSort();
        if (sortSearch != null && StringUtils.isNotEmpty(sortSearch.getSort())) {
            query.setSortFiled(sortSearch.getSort());
        }
        return createSearchQuery(params, fiter, query, "/browse");
    }
}
