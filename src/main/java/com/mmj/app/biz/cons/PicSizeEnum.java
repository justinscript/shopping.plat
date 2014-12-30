/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.cons;

/**
 * 图片尺寸大小枚举
 * 
 * @author zxc Dec 3, 2014 12:41:13 AM
 */
public enum PicSizeEnum {

    SIZE_L(400, 400), SIZE_M(200, 200), SIZE_S(100, 100), SIZE_C(48, 48);

    int width, height;

    PicSizeEnum(int w, int h) {
        width = w;
        height = h;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public boolean isSizeL() {
        return this == PicSizeEnum.SIZE_L;
    }

    public boolean isSizeM() {
        return this == PicSizeEnum.SIZE_M;
    }

    public boolean isSizeS() {
        return this == PicSizeEnum.SIZE_S;
    }

    public boolean isSizeC() {
        return this == PicSizeEnum.SIZE_C;
    }
}
