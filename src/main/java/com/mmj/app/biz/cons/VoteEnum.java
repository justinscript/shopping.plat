/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

import com.mmj.app.common.util.NumberParser;

/**
 * 投票 顶=1 踩=-1
 * 
 * @author zxc Dec 3, 2014 11:59:37 AM
 */
public enum VoteEnum {

    // 顶
    UP(1, "up", "顶"),
    // 踩
    DOWN(-1, "down", "踩");

    public int    value;

    public String name;

    public String desc;

    private VoteEnum(int value, String name, String desc) {
        this.value = value;
        this.name = name;
        this.desc = desc;
    }

    public static boolean isUp(Integer value) {
        return value == 1 ? true : false;
    }

    public static boolean isDown(Integer value) {
        return value == -1 ? true : false;
    }

    public static boolean isUp(VoteEnum value) {
        return value == UP ? true : false;
    }

    public static boolean isDown(VoteEnum value) {
        return value == DOWN ? true : false;
    }

    public int getValue() {
        return value;
    }

    public String getName() {
        return name;
    }

    public static VoteEnum getAction(Integer value) {
        for (VoteEnum state : values()) {
            if (NumberParser.isEqual(value, state.getValue())) return state;
        }
        return null;
    }
}
