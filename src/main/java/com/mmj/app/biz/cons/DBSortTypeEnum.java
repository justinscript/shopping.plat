/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

/**
 * @author zxc Dec 2, 2014 12:54:19 PM
 */
public enum DBSortTypeEnum {

    // gmt_create
    GMT_MODIFIED(0, "GMT_MODIFIED"),
    // gmt_create
    GMT_CREATE(1, "GMT_CREATE"),
    // recommend
    RECOMMEND(2, "RECOMMEND"),
    // up
    UPS(3, "UPS");

    public int    value;

    public String name;

    private DBSortTypeEnum(int value, String name) {
        this.value = value;
        this.name = name;
    }

    public int getValue() {
        return value;
    }

    public String getName() {
        return name;
    }

    public static DBSortTypeEnum getAction(int value) {
        for (DBSortTypeEnum state : values()) {
            if (value == state.getValue()) return state;
        }
        return null;
    }
}
