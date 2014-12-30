/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.lucene.search.cons;

import com.mmj.app.lucene.search.build.base.DataFetcher;
import com.mmj.app.lucene.search.build.base.Param;
import com.mmj.app.lucene.search.build.fetcher.TopicFetcher;
import com.mmj.app.lucene.search.build.fetcher.UserFetcher;
import com.mmj.app.lucene.search.service.TopicSearch;
import com.mmj.app.lucene.search.service.UserSearch;
import com.mmj.app.lucene.solr.exception.SolrUnSupportException;

/**
 * 对外服务的Search类型
 * 
 * @author zxc Sep 2, 2014 1:54:07 PM
 */
public enum SearchTypeEnum {

    USER("product", "用户信息库", VersionType.user.name(), UserSearch.class),

    TOPIC("product", "发布信息库", VersionType.topic.name(), TopicSearch.class);

    private String   value;
    private String   desc;
    private String   versionType;

    private Class<?> type;

    private SearchTypeEnum(String value, String desc, String versionType, Class<?> type) {
        this.value = value;
        this.desc = desc;
        this.versionType = versionType;
        this.type = type;
    }

    public String getDesc() {
        return desc;
    }

    public String getValue() {
        return value;
    }

    public static SearchTypeEnum getByValue(String value) {
        for (SearchTypeEnum searchType : values()) {
            if (searchType.getValue().equals(value)) {
                return searchType;
            }
        }
        return null;
    }

    public String getVersionType() {
        return versionType;
    }

    public void setVersionType(String versionType) {
        this.versionType = versionType;
    }

    public Class<?> getType() {
        return type;
    }

    public DataFetcher<?> getDateFetcher(Param param) {
        switch (this) {
            case USER:
                return UserFetcher.create(param);
            case TOPIC:
                return TopicFetcher.create(param);
            default:
                throw new SolrUnSupportException("不支持的类型,Unsupport type " + this);
        }
    }
}
