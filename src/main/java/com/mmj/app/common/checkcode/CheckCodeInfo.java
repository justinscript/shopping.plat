/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.checkcode;

import java.io.Serializable;

/**
 * @author zxc Nov 30, 2014 5:10:02 PM
 */
public class CheckCodeInfo implements Serializable {

    private static final long serialVersionUID = 957713199413526469L;

    private String            code;                                  // 验证码
    private byte[]            bytes;                                 // 图片的字节码

    public CheckCodeInfo(String code, byte[] bytes) {
        super();
        this.code = code;
        this.bytes = bytes;
    }

    public String getCode() {
        return code;
    }

    public byte[] getBytes() {
        return bytes;
    }
}
