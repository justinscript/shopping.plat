/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.cons;

/**
 * @author zxc Nov 27, 2014 11:57:17 AM
 */
public enum UserTypeEnum {

    /**
     * 管理员
     */
    ADMIN(2, "admin", "管理员"),

    /**
     * 普通会员
     */
    GENERAL(1, "general", "会员");

    private int    value;
    private String name;
    private String desc;

    private UserTypeEnum(int value, String name, String desc) {
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

    public static boolean isAdmin(UserTypeEnum typeEnum) {
        return typeEnum == null ? false : typeEnum.value == ADMIN.value;
    }

    /**
     * 根据value获取类型
     */
    public static UserTypeEnum getEnum(Integer value) {
        if (value == null) {
            return GENERAL;
        }
        for (UserTypeEnum current : values()) {
            if (current.value == value) {
                return current;
            }
        }
        return GENERAL;
    }
}
