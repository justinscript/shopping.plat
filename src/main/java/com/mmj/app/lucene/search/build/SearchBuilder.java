/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.lucene.search.build;

import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.stereotype.Component;

import com.mmj.app.common.core.SpringContextAware;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.result.Result;
import com.mmj.app.lucene.search.build.base.DataFetcher;
import com.mmj.app.lucene.search.cons.SearchTypeEnum;
import com.mmj.app.lucene.solr.exception.SolrUnSupportException;
import com.mmj.app.lucene.solr.service.SearchServiceConfig;
import com.mmj.app.lucene.solr.service.VersionableSearch;

/**
 * @author zxc Sep 2, 2014 1:56:39 PM
 */
@Component
public class SearchBuilder implements SearchServiceConfig {

    private static final Integer DEFAULT_VERSION = 1;

    @PostConstruct
    public void cronCache() {
        ScheduledExecutorService newScheduledThreadPool = Executors.newScheduledThreadPool(1);
        newScheduledThreadPool.scheduleAtFixedRate(new Runnable() {

            @Override
            public void run() {
                try {
                    build(SearchTypeEnum.USER, DEFAULT_VERSION, SearchTypeEnum.USER.getDateFetcher(null));
                    build(SearchTypeEnum.TOPIC, DEFAULT_VERSION, SearchTypeEnum.TOPIC.getDateFetcher(null));
                } catch (Throwable e) {
                    logger.error("start searchBuilder error,build search index error!", e);
                }
            }

        }, 1, 24 * 60, TimeUnit.MINUTES);
    }

    /**
     * @param searchType 索引类型
     * @param version 索引版本
     * @param fetcher 数据获取接口
     * @return
     */
    @SuppressWarnings({ "rawtypes", "unchecked" })
    public Result build(SearchTypeEnum searchType, Integer version, DataFetcher fetcher) {
        VersionableSearch<?, ?> search = getSearch(searchType);
        if (search == null) {
            return Result.failed("search is null");
        }
        try {
            PaginationList data = fetcher.fetch(null);
            search.delAll(version);
            while (data != null && data.size() > 0) {
                search.indexWithOutDel(version, data);
                data = fetcher.fetch(data.getQuery());
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return Result.failed(ExceptionUtils.getFullStackTrace(e));
        } finally {

        }
        return Result.success();
    }

    public static VersionableSearch<?, ?> getSearch(SearchTypeEnum searchType) {
        try {
            @SuppressWarnings("rawtypes")
            Map beansOfType = SpringContextAware.getBeansOfType(searchType.getType());
            for (Object object : beansOfType.values()) {
                return (VersionableSearch<?, ?>) object;
            }
        } catch (Exception e) {
            throw new SolrUnSupportException(String.format("Not Support SearchType 【%s】", searchType.getDesc()));
        }
        return null;
    }
}
