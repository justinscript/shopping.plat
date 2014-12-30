/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

/**
 * 处理状态 0=未处理,1=已经处理,2=停止
 * 
 * @author zxc Dec 3, 2014 11:43:02 AM
 */
public enum HandleStateEnum {

    /**
     * 未处理
     */
    UNHANDLE(0, "unaudited", "未处理"),

    /**
     * 已处理
     */
    NORMAL(1, "normal", "已处理"),

    /**
     * 停止
     */
    STOP(2, "stop", "停止");

    private int    value;
    private String name;
    private String desc;

    private HandleStateEnum(int value, String name, String desc) {
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
     * 根据value获取类型
     */
    public static HandleStateEnum getEnum(int value) {
        for (HandleStateEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return UNHANDLE;
    }
}
