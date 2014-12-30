/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.lucene.search.cons;

import java.util.Date;

import org.apache.commons.lang.StringUtils;

import com.mmj.app.common.util.DateViewTools;

/**
 * time: all全部 1d24小时 3d三天 7d一周 30d一月 365d一年
 * 
 * @author zxc Dec 10, 2014 11:25:22 AM
 */
public enum TimeSearchEnum {

    /**
     * 全部
     */
    ALL(0, "all", "全部", null),

    /**
     * 24小时
     */
    D1(1, "1d", "最新", DateViewTools.yesterDate()),

    /**
     * 三天
     */
    D3(2, "3d", "三天", DateViewTools.getDateBefore(3)),

    /**
     * 一周
     */
    D7(2, "7d", "一周", DateViewTools.getDateBefore(7)),
    /**
     * 一月
     */
    D30(2, "30d", "一月", DateViewTools.getDateBefore(30)),
    /**
     * 一年
     */
    D365(2, "365d", "一年", DateViewTools.getDateBefore(365));

    private int    value;
    private String name;
    private String desc;

    private Date   startTime;

    private TimeSearchEnum(int value, String name, String desc, Date startTime) {
        this.value = value;
        this.name = name;
        this.desc = desc;
        this.startTime = startTime;
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

    public Date getStartTime() {
        return startTime;
    }

    public Long getStartTimeLong() {
        return startTime == null ? null : startTime.getTime();
    }

    /**
     * 根据name获取类型
     */
    public static TimeSearchEnum getEnum(String name) {
        if (StringUtils.isEmpty(name)) {
            return ALL;
        }
        for (TimeSearchEnum current : values()) {
            if (StringUtils.equalsIgnoreCase(current.getName(), name)) {
                return current;
            }
        }
        return ALL;
    }

    /**
     * 根据value获取类型
     */
    public static TimeSearchEnum getEnum(Integer value) {
        if (value == null) {
            return ALL;
        }
        for (TimeSearchEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return ALL;
    }
}
