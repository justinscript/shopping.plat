/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.checkcode;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.imageio.ImageIO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author zxc Nov 30, 2014 5:09:16 PM
 */
public class CheckCodeTools {

    private static final Logger        logger   = LoggerFactory.getLogger(CheckCodeTools.class);

    private static Random              random   = null;
    private static int                 useCount = 0;
    private static List<CheckCodeInfo> cacheList;

    static {
        random = new Random(Math.abs(System.currentTimeMillis()));

        // 初始时，生存100个验证码。多了之后内存占用比较多
        cacheList = createCheckcode(100);
        final Runnable updateThread = new Runnable() {

            public void run() {
                check();
            }
        };
        final ScheduledExecutorService updateScheduler = Executors.newScheduledThreadPool(1);
        int period = 120;
        updateScheduler.scheduleAtFixedRate(updateThread, period, period, TimeUnit.SECONDS);
    }

    public static void init() {
        // 不要删除这个方法。外界调用此方法会先调用static静态块
    }

    private static void check() {
        if (useCount < 1000) // 如果2分钟之内验证码使用次数少于一定次数，那么不更新缓存中的验证码
        {
            return;
        }
        List<CheckCodeInfo> tmpList = createCheckcode(100);
        useCount = 0;
        cacheList = tmpList;
    }

    /**
     * 外界取得一个验证码
     * 
     * @return
     */
    public static CheckCodeInfo createCheckCodeInfo() {
        useCount++;
        int index = Math.abs(random.nextInt());
        int size = cacheList.size();
        index = index % size;
        try {
            return cacheList.get(index);
        } catch (Exception e) {
            // 如果线程问题导致出现异常，那么直接生成一个验证码返回
            List<CheckCodeInfo> tmpList = createCheckcode(1);
            return tmpList.get(0);
        }
    }

    /**
     * 生成一定数量的验证码
     * 
     * @param len
     * @return
     */
    private static List<CheckCodeInfo> createCheckcode(int len) {
        List<CheckCodeInfo> list = new ArrayList<CheckCodeInfo>();
        List<String> textList = PicCode.getPicCheckCodeList(len);
        for (String s : textList) {
            try {
                BufferedImage bi = PicCode.createEachBarCodeImg(s, 67, 30, 10, 24, false);
                // BufferedImage bi = PicCode.createEachBarCodeImg(s, 100, 30, 20, 24, false);
                byte[] data = getBytes(bi);
                list.add(new CheckCodeInfo(s, data));
            } catch (Exception e1) {
                logger.error(e1.getMessage(), e1);
            }
        }
        return list;
    }

    /**
     * BufferedImage转化为byte[]
     * 
     * @param img
     * @return
     * @throws IOException
     */
    public static byte[] getBytes(BufferedImage img) throws IOException {
        ByteArrayOutputStream byar = new ByteArrayOutputStream();
        try {
            ImageIO.write(img, "png", byar);
        } finally {
            byar.close();
        }
        return byar.toByteArray();
    }
}
