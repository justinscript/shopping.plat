/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

/**
 * 收藏类型:1=私藏,2=推荐
 * 
 * @author zxc Dec 1, 2014 3:07:15 PM
 */
public enum CollectTypeEnum {

    /**
     * 未审核
     */
    SAVED(1, "saved", "私藏"),

    /**
     * 正常
     */
    LIKED(2, "liked", "推荐");

    private int    value;
    private String name;
    private String desc;

    private CollectTypeEnum(int value, String name, String desc) {
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
    public static CollectTypeEnum getEnum(Integer value) {
        if (value == null) {
            return null;
        }
        for (CollectTypeEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return null;
    }
}
