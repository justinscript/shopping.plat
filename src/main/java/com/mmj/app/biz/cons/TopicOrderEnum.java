/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

import org.apache.commons.lang.StringUtils;

/**
 * 最热hot 最新new 人类发布man
 * 
 * @author zxc Dec 1, 2014 4:13:40 PM
 */
public enum TopicOrderEnum {

    /**
     * 最热
     */
    HOT(0, "hot", "最热"),

    /**
     * 最新
     */
    NEW(1, "new", "最新"),

    /**
     * 人类发布
     */
    MAN(2, "man", "人类发布");

    private int    value;
    private String name;
    private String desc;

    private TopicOrderEnum(int value, String name, String desc) {
        this.value = value;
        this.name = name;
        this.desc = desc;
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

    /**
     * 根据name获取类型
     */
    public static TopicOrderEnum getEnum(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        for (TopicOrderEnum current : values()) {
            if (StringUtils.equalsIgnoreCase(current.name, name)) {
                return current;
            }
        }
        return null;
    }

    /**
     * 根据value获取类型
     */
    public static TopicOrderEnum getEnum(Integer value) {
        if (value == null) {
            return null;
        }
        for (TopicOrderEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return null;
    }
}
