/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

/**
 * 状态: 0=未审核,1=正常,2=停止,3=黑名单
 * 
 * @author zxc Nov 27, 2014 12:02:47 PM
 */
public enum StateEnum {

    /**
     * 未审核
     */
    UNAUDITED(0, "unaudited", "未审核"),

    /**
     * 正常
     */
    NORMAL(1, "normal", "正常"),

    /**
     * 停止
     */
    STOP(2, "stop", "停止"),

    /**
     * 黑名单
     */
    BLACK(3, "black", "黑名单");

    private int    value;
    private String name;
    private String desc;

    private StateEnum(int value, String name, String desc) {
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
    public static StateEnum getEnum(int value) {
        for (StateEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return null;
    }
}
