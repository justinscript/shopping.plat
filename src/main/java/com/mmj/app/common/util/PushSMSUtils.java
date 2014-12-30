/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.common.util;

import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.stereotype.Component;

import com.mmj.app.common.core.SpringContextAware;
import com.mmj.app.common.core.lang.Argument;

/**
 * @author zxc Dec 12, 2014 12:05:28 PM
 */
@Component
public class PushSMSUtils {

    private static Logger          logger          = LoggerFactory.getLogger(PushSMSUtils.class);
    private static String          PUSH_SERVER_URL = "http://yunpian.com/v1/sms/send.json";
    private static String          API_KEY         = "bba9551f91fa4e2758d2237ba8827b48";

    @Autowired
    private ThreadPoolTaskExecutor executor;

    public static PushSMSUtils getInstance() {
        return (PushSMSUtils) SpringContextAware.getBean("pushSMSUtils");
    }

    /**
     * 发送短信验证码
     * 
     * @param mobile 接收短信的人手机号
     * @param code 验证码
     */
    public void sendCodeSMS(final String code, final String... mobile) {
        executor.submit(new Runnable() {

            @Override
            public void run() {
                String msg = String.format("您的验证码是%s【买买君】", code);
                sendPushMsg(msg, mobile);
            }
        });
    }

    private void sendPushMsg(String msg, String... mobile) {
        if (Argument.isEmptyArray(mobile)) {
            return;
        }
        sendPushMsg(msg, StringUtils.join(mobile, ","));
    }

    private void sendPushMsg(String msg, String mobiles) {
        DefaultHttpClient client = new DefaultHttpClient();
        HttpPost httpPost = new HttpPost(PUSH_SERVER_URL);
        List<BasicNameValuePair> params = new ArrayList<BasicNameValuePair>();
        params.add(new BasicNameValuePair("apikey", API_KEY));
        params.add(new BasicNameValuePair("text", msg));
        params.add(new BasicNameValuePair("mobile", mobiles));

        try {
            httpPost.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
            HttpResponse response = client.execute(httpPost);

            int statusCode = response.getStatusLine().getStatusCode();
            if (statusCode == 200) {
                logger.debug("手机号{}，消息{}，推送成功！", mobiles, msg);
            } else {
                logger.debug("手机号{}，消息{}，推送失败！", mobiles, msg);
            }
        } catch (Exception e) {
            logger.debug("http post error!{}", e.getMessage());
        } finally {
            httpPost.releaseConnection();
        }
    }

    public static void main(String[] args) {
        for (int i = 1; i < 2; i++) {
            PushSMSUtils pushUtils = new PushSMSUtils();
            System.out.println("买买君,短信测试!!!收到请不要回复,谢谢! 第" + i + "次测试,Test Start!");

            pushUtils.sendPushMsg("您的验证码是3478【买买君】", "18912386146");

            System.out.println("买买君,短信测试!!!收到请不要回复,谢谢! 第" + i + "次测试,Test End!");

            System.out.println("Now,start sleep!");
            try {
                Thread.sleep(1000 * 180);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Now,sleep end!");
        }
    }
}
