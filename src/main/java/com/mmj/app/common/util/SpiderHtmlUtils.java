/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author zxc Nov 30, 2014 11:40:40 PM
 */
public class SpiderHtmlUtils {

    private static Logger logger = LoggerFactory.getLogger(SpiderHtmlUtils.class);

    /**
     * 根据URL获得所有的html信息
     * 
     * @param url
     * @return
     */
    public static String getHtmlByUrl(String url) {
        if (StringUtils.isEmpty(url)) {
            return null;
        }
        String html = null;
        HttpClient httpClient = new DefaultHttpClient();// 创建httpClient对象
        HttpUriRequest httpget = new HttpGet(url);// 以get方式请求该URL
        httpget.setHeader("Connection", "keep-alive");
        httpget.setHeader("Referer", "http://www.baidu.com");
        httpget.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
        httpget.setHeader("User-Agent",
                          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.122 Safari/537.36");
        try {
            HttpResponse responce = httpClient.execute(httpget);// 得到responce对象
            int responseCode = responce.getStatusLine().getStatusCode();// 返回码
            if (responseCode == HttpStatus.SC_OK || responseCode == HttpStatus.SC_MOVED_PERMANENTLY
                || responseCode == HttpStatus.SC_MOVED_TEMPORARILY) {// 200正常 其他就不对
                // 获得相应实体
                HttpEntity entity = responce.getEntity();
                if (entity != null) {
                    html = EntityUtils.toString((org.apache.http.HttpEntity) entity);// 获得html源代码
                }
            }
        } catch (Exception e) {
            logger.error("SpiderHtmlUtils:getHtmlByUrl sprider url={} error!!!", url);
        } finally {
            httpClient.getConnectionManager().shutdown();
        }
        return html;
    }

    public static String fetchTitleHtml(String html) {
        return parserHtml(html, "head>title");
    }

    public static String fetchDescriptionHtml(String html) {

        if (StringUtils.isNotEmpty(html)) {
            Document doc = Jsoup.parse(html);
            Elements linksElements = doc.select("head>meta[name=Description]");
            if (linksElements == null || linksElements.isEmpty()) {
                return null;
            }
            for (Element ele : linksElements) {
                String contextS = ele.attr("content");
                return contextS;
            }
        }
        return null;
    }

    public static String parserHtml(String html, String select) {
        if (StringUtils.isNotEmpty(html)) {
            Document doc = Jsoup.parse(html);
            Elements linksElements = doc.select(select);
            if (linksElements == null || linksElements.isEmpty()) {
                return null;
            }
            for (Element ele : linksElements) {
                return ele.text();
            }
        }
        return null;
    }

    public static void main(String[] args) {
        Pattern pattern = Pattern.compile("[http|https]+[://]+[0-9A-Za-z:/[-]_#[?][=][.][&]]*");
        Matcher matcher = pattern.matcher("http://haitao.smzdm.com/youhui/307563");
        System.out.println(matcher.matches());
        Matcher matcher1 = pattern.matcher("http://lawrence-zxc.github.io/2014/10/01/aboutMe/");
        System.out.println(matcher1.matches());
        Matcher matcher2 = pattern.matcher("http://lawrence-zxc_github_io/2014/10/01/aboutMe/?d");
        System.out.println(matcher2.matches());
        String html = SpiderHtmlUtils.getHtmlByUrl("http://lawrence-zxc.github.io/2014/10/01/aboutMe/");
        String description = SpiderHtmlUtils.fetchDescriptionHtml(html);
        System.out.println(description);
    }
}
