/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

import org.apache.commons.lang.StringUtils;

/**
 * 举报原因类型:1=爆粗口 2=广告、垃圾信息 3=淫秽色情 4=政治敏感话题 0=其它
 * 
 * @author zxc Dec 3, 2014 11:51:04 AM
 */
public enum ReportTypeEnum {

    /**
     * 爆粗口
     */
    CUKAO(1, "cukao", "爆粗口"),

    /**
     * 广告,垃圾信息
     */
    LAJI(2, "laji", "广告"),

    /**
     * 淫秽色情
     */
    SEQING(3, "seqing", "淫秽色情"),

    /**
     * 政治敏感话题
     */
    MINGAN(4, "mingan", "政治敏感话题"),

    /**
     * 其它
     */
    QITA(0, "qita", "其它");

    private int    value;
    private String name;
    private String desc;

    private ReportTypeEnum(int value, String name, String desc) {
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
    public static ReportTypeEnum getEnum(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        for (ReportTypeEnum current : values()) {
            if (StringUtils.equalsIgnoreCase(current.name, name)) {
                return current;
            }
        }
        return null;
    }

    /**
     * 根据value获取类型
     */
    public static ReportTypeEnum getEnum(Integer value) {
        if (value == null) {
            return null;
        }
        for (ReportTypeEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return null;
    }
}
