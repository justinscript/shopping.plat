/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

import org.apache.commons.lang.StringUtils;

/**
 * subject Id(news买买买subjectId=1;scoff海淘转让区subjectId=2; pic发现subjectId=4; tec问答社subjectId=100; ask五元团subjectId=151)
 * 
 * @author zxc Dec 1, 2014 1:38:25 PM
 */
public enum SubjectEnum {

    /**
     * 全部
     */
    ALL(0, "all", "全部"),
    /**
     * 买买买
     */
    NEWS(1, "news", "国内买"),

    /**
     * 海淘转让区
     */
    SCOFF(2, "scoff", "海外买"),

    /**
     * 今日免单
     */
    PIC(4, "pic", "晒单区"),

    /**
     * 问答社
     */
    TEC(100, "tec", "问答社"),

    /**
     * 五元团
     */
    ASK(151, "ask", "淘宝精选");

    private int    value;
    private String name;
    private String desc;

    private SubjectEnum(int value, String name, String desc) {
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
    public static SubjectEnum getEnum(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        for (SubjectEnum current : values()) {
            if (StringUtils.equalsIgnoreCase(current.name, name)) {
                return current;
            }
        }
        return null;
    }

    /**
     * 根据value获取类型
     */
    public static SubjectEnum getEnum(Integer value) {
        if (value == null) {
            return null;
        }
        for (SubjectEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return null;
    }
}
