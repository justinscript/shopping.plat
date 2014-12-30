/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

import org.apache.commons.lang.StringUtils;

/**
 * 0=是,1=否
 * 
 * @author zxc Nov 27, 2014 12:06:56 PM
 */
public enum BooleanEnum {

    TRUE(0, true, "true", "是"),

    FALSE(1, false, "false", "否");

    private int     value;
    private boolean isTrue;
    private String  name;
    private String  desc;

    private BooleanEnum(int value, boolean isTrue, String name, String desc) {
        this.value = value;
        this.isTrue = isTrue;
        this.name = name;
        this.desc = desc;
    }

    public static BooleanEnum getByValue(int value) {
        return value == 0 ? TRUE : FALSE;
    }

    public static BooleanEnum getByName(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        for (BooleanEnum state : values()) {
            if (StringUtils.equals(state.getName(), name)) {
                return state;
            }
        }
        return null;
    }

    public static BooleanEnum getDefault() {
        return FALSE;
    }

    public static BooleanEnum get(boolean isTrue) {
        return isTrue ? TRUE : FALSE;
    }

    public static boolean isTrue(String actived) {
        return TRUE.getName().equals(actived);
    }

    public static boolean isFalse(String actived) {
        return FALSE.getName().equals(actived);
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isTrue() {
        return isTrue;
    }

    public void setTrue(boolean isTrue) {
        this.isTrue = isTrue;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
