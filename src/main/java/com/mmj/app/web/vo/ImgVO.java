/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.vo;

/**
 * <pre>
 *      "imgUrl":"http://img1.chouti.com/group10/M03/01/7F/wKgCNlR5-yfAnjjwAAHMGsSZkHk908=420x185.jpg", 
 *      "identifie":"1417280287366"
 * </pre>
 * 
 * @author zxc Nov 30, 2014 1:14:53 AM
 */
public class ImgVO {

    private String imgUrl;

    private String identifie;

    public ImgVO() {

    }

    public ImgVO(String imgUrl, String identifie) {
        setImgUrl(imgUrl);
        setIdentifie(identifie);
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getIdentifie() {
        return identifie;
    }

    public void setIdentifie(String identifie) {
        this.identifie = identifie;
    }
}
