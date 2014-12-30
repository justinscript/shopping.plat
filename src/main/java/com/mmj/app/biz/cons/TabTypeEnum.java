/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

import org.apache.commons.lang.StringUtils;

/**
 * 标签类型(链接TAB点击tabType=0;链接TAB点击tabType=1;图片TAB点击tabType=2)
 * 
 * @author zxc Dec 1, 2014 1:38:43 PM
 */
public enum TabTypeEnum {

    /**
     * 链接TAB点击
     */
    ZIXUN(0, "zixun", "链接TAB点击"),

    /**
     * 链接TAB点击
     */
    DUANZI(1, "duanzi", "链接TAB点击"),

    /**
     * 图片TAB点击
     */
    PIC(2, "pic", "图片TAB点击");

    private int    value;
    private String name;
    private String desc;

    private TabTypeEnum(int value, String name, String desc) {
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
    public static TabTypeEnum getEnum(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        for (TabTypeEnum current : values()) {
            if (StringUtils.equalsIgnoreCase(current.name, name)) {
                return current;
            }
        }
        return null;
    }

    /**
     * 根据value获取类型
     */
    public static TabTypeEnum getEnum(Integer value) {
        if (value == null) {
            return null;
        }
        for (TabTypeEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return null;
    }
}
