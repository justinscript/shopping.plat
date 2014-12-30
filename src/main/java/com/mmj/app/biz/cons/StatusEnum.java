/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.cons;

/**
 * @author zxc Nov 25, 2014 11:58:03 PM
 */
public enum StatusEnum {

    // 未删除,正常
    UN_DELETE(0, "unDelete", "正常"),
    // 已删除
    DELETE(1, "delete", "已删除");

    public int    value;

    public String name;

    public String desc;

    private StatusEnum(int value, String name, String desc) {
        this.value = value;
        this.name = name;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getName() {
        return name;
    }

    public String getDesc() {
        return desc;
    }

    public static StatusEnum getAction(int value) {
        for (StatusEnum state : values()) {
            if (value == state.getValue()) return state;
        }
        return null;
    }
}
