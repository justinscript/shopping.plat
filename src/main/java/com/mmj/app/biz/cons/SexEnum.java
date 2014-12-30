/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.cons;

import org.apache.commons.lang.StringUtils;

/**
 * @author zxc Nov 26, 2014 12:21:02 AM
 */
public enum SexEnum {

    /**
     * 男
     */
    MAN(0, "man", "男", true),
    /**
     * 女
     */
    WOMAN(1, "woman", "女", false);

    private int     value;
    private String  name;
    private String  desc;
    private boolean bool;

    private SexEnum(int value, String name, String desc, boolean bool) {
        this.value = value;
        this.name = name;
        this.desc = desc;
        this.bool = bool;
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

    public boolean isBool() {
        return bool;
    }

    /**
     * 根据value获取类型
     */
    public static SexEnum getEnum(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        if (StringUtils.equalsIgnoreCase("true", name) || StringUtils.equalsIgnoreCase("man", name)
            || StringUtils.equalsIgnoreCase("male", name)) {
            return MAN;
        }
        if (StringUtils.equalsIgnoreCase("false", name) || StringUtils.equalsIgnoreCase("man", name)
            || StringUtils.equalsIgnoreCase("female", name)) {
            return WOMAN;
        }
        return null;
    }

    /**
     * 根据value获取类型
     */
    public static SexEnum getEnum(int value) {
        for (SexEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return MAN;
    }
}
