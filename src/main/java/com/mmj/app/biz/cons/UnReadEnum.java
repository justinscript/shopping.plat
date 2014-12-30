/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.cons;

/**
 * 是否阅读: 0=已读,1=未读,2=屏蔽
 * 
 * @author zxc Dec 4, 2014 12:36:06 AM
 */
public enum UnReadEnum {

    /**
     * 已读
     */
    READ(0, "read", "已读"),

    /**
     * 未读
     */
    UN_READ(1, "unRead", "未读"),

    /**
     * 屏蔽
     */
    SHIELD(2, "shield", "屏蔽")

    ;

    private int    value;
    private String name;
    private String desc;

    private UnReadEnum(int value, String name, String desc) {
        this.value = value;
        this.name = name;
        this.desc = desc;
    }

    public static boolean isUnRead(Integer value) {
        if (value == null) {
            return false;
        }
        UnReadEnum readEnum = getEnum(value);
        return readEnum == UN_READ;
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
     * 根据value获取类型
     */
    public static UnReadEnum getEnum(int value) {
        for (UnReadEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return null;
    }
}
