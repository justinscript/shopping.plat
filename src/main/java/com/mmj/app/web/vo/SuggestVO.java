/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.vo;

import org.apache.commons.lang.StringUtils;

import com.mmj.app.biz.domain.TopicDO;

/**
 * <pre>
 *          "id": 6536311, 
 *          "imgUrl": "http://img1.chouti.com/group9/M01/1E/19/wKgCMlR34MX1QFG-AAAw1yT3FIE222=C80x80.png", 
 *          "title": "【卡扎菲倒台三年后，三分之一利比亚人民受精神疾病折磨】丹麦一家人权组织最新调查发现，自2011年卡扎菲政权倒台以来，有将近三分之一的利比亚人患有焦虑、抑郁等精神疾病。", 
 *          "url": "http://www.thepaper.cn/newsDetail_forward_1281601"
 * </pre>
 * 
 * @author zxc Dec 4, 2014 11:33:37 PM
 */
public class SuggestVO {

    private Long   id;
    private String imgUrl;
    private String title;
    private String url;

    public SuggestVO() {

    }

    public SuggestVO(TopicDO topic) {
        setId(topic.getId());
        setImgUrl(StringUtils.isEmpty(topic.getImgUrl()) ? "/images/image30.png" : topic.getImgUrl());
        setTitle(topic.getTitle());
        setUrl(topic.getOriginalUrl());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }
}
