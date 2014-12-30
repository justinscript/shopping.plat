/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.tools;

import org.apache.commons.lang.StringUtils;

import com.mmj.app.biz.cons.PicSizeEnum;

/**
 * 图片尺寸大小工具类
 * 
 * @author zxc Dec 3, 2014 12:40:07 AM
 */
public class PicTools {

    private static final String UNDERLINE = "_";

    private static final String DOT       = ".";

    private static final String X         = "x";

    /**
     * 处理缩放后的图的路径
     * 
     * @param url
     * @param picSize
     * @return
     */
    public static String processURL(String url, String suffix) {
        if (StringUtils.isEmpty(url)) {
            return StringUtils.EMPTY;
        }
        if (StringUtils.isEmpty(suffix)) {
            return url;
        }
        String pefix = url;
        if (StringUtils.contains(url, "=")) {
            pefix = StringUtils.substringBeforeLast(url, "=");
        } else if (StringUtils.contains(url, "=C")) {
            pefix = StringUtils.substringBeforeLast(url, "=C");
        } else {
            pefix = StringUtils.substringBeforeLast(url, DOT);
        }
        String dotStr = StringUtils.substringAfterLast(url, DOT);
        return pefix + suffix + DOT + dotStr;
    }

    public static void main(String[] args) {
        String url = " http://img1.chouti.com/group10/M03/C4/3D/wKgCNlSKyDKZPPhZAAAmivdKdOo698=37x37.jpg";
        System.out.println(url);
        url = processURL(url, "=48x48");
        System.out.println(url);
    }

    /**
     * 得到主图的超大图url
     * 
     * @param mainPics
     * @return
     */
    public static String get400PicUrl(String mainPics) {
        return processURL(mainPics, PicSizeEnum.SIZE_M);
    }

    /**
     * 得到主图的大图url
     * 
     * @param mainPics
     * @return
     */
    public static String get200PicUrl(String mainPics) {
        return processURL(mainPics, PicSizeEnum.SIZE_M);
    }

    /**
     * 得到主图的中图url
     * 
     * @param mainPics
     * @return
     */
    public static String get100PicUrl(String mainPics) {
        return processURL(mainPics, PicSizeEnum.SIZE_S);
    }

    /**
     * 得到主图的小图url
     * 
     * @param mainPics
     * @return
     */
    public static String get48PicUrl(String mainPics) {
        return processURL(mainPics, PicSizeEnum.SIZE_C);
    }

    /**
     * 处理缩放后的图的路径
     * 
     * @param url
     * @param picSize
     * @return
     */
    protected static String processURL(String url, PicSizeEnum picSize) {
        if (url == null || url.length() < 0) {
            return null;
        }
        if (!url.endsWith(".jpg")) {
            return url + UNDERLINE + picSize.getWidth() + X + picSize.getHeight() + ".jpg";
        }
        int index = url.lastIndexOf(DOT);
        return url + UNDERLINE + picSize.getWidth() + X + picSize.getHeight() + url.substring(index);
    }
}
