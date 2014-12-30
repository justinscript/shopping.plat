/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.lucene.search.cons;

import org.apache.commons.lang.StringUtils;

/**
 * sort: default相关性 time最新 score最热
 * 
 * @author zxc Dec 10, 2014 11:24:21 AM
 */
public enum SortSearchEnum {

    /**
     * 相关性
     */
    DEFAULT(0, "default", "相关性", ""),

    /**
     * 最新
     */
    TIME(1, "time", "最新", "topicGmtCreate"),

    /**
     * 最热
     */
    SCORE(2, "score", "最热", "recommend");

    private int    value;
    private String name;
    private String desc;

    private String sort;

    private SortSearchEnum(int value, String name, String desc, String sort) {
        this.value = value;
        this.name = name;
        this.desc = desc;
        this.sort = sort;
    }

    public String getDesc() {
        return desc;
    }

    public int getValue() {
        return value;
    }

    public String getName() {
        return name;
    }

    public String getSort() {
        return sort;
    }

    /**
     * 根据name获取类型
     */
    public static SortSearchEnum getEnum(String name) {
        if (StringUtils.isEmpty(name)) {
            return DEFAULT;
        }
        for (SortSearchEnum current : values()) {
            if (StringUtils.equalsIgnoreCase(current.getName(), name)) {
                return current;
            }
        }
        return DEFAULT;
    }

    /**
     * 根据value获取类型
     */
    public static SortSearchEnum getEnum(Integer value) {
        if (value == null) {
            return DEFAULT;
        }
        for (SortSearchEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return DEFAULT;
    }
}
