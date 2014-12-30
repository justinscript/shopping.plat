/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

import org.apache.commons.lang.StringUtils;

/**
 * 即时排序=recent 3天=72hr 24小时=24hr
 * 
 * @author zxc Dec 1, 2014 4:14:50 PM
 */
public enum TopicOrderTimeEnum {

    /**
     * 即时排序
     */
    RECENT(0, "recent", "即时排序"),

    /**
     * 3天
     */
    HR72(1, "72hr", "3天"),

    /**
     * 24小时
     */
    HR24(2, "24hr", "24小时");

    private int    value;
    private String name;
    private String desc;

    private TopicOrderTimeEnum(int value, String name, String desc) {
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
    public static TopicOrderTimeEnum getEnum(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        for (TopicOrderTimeEnum current : values()) {
            if (StringUtils.equalsIgnoreCase(current.name, name)) {
                return current;
            }
        }
        return null;
    }

    /**
     * 根据value获取类型
     */
    public static TopicOrderTimeEnum getEnum(Integer value) {
        if (value == null) {
            return null;
        }
        for (TopicOrderTimeEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return null;
    }
}
