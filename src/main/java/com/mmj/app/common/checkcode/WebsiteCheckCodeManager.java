/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.checkcode;

import javax.servlet.http.HttpServletResponse;

import com.mmj.app.common.cookie.CookieNameEnum;
import com.mmj.app.common.cookie.manager.CookieManager;

/**
 * @author zxc Nov 30, 2014 5:18:15 PM
 */
public class WebsiteCheckCodeManager {

    public static final WebsiteCheckCodeManager INSTANCE = new WebsiteCheckCodeManager();

    private WebsiteCheckCodeManager() {

    }

    /**
     * 校验CheckCode
     * 
     * <pre>
     * 1.判断当前环境是否需要验证Chekcode
     * 2.比较Cookie中取得的Checkcode和客户传入的值
     * </pre>
     * 
     * @param cookieManager
     * @param checkcode
     * @return
     */
    public boolean check(CookieManager cookieManager, String checkcode) {
        return CheckCodeManager.INSTANCE.check(cookieManager, checkcode, CookieNameEnum.maimaijun_checkcode);
    }

    public boolean checkByMD5(CookieManager cookieManager, String checkcode) {
        return CheckCodeManager.INSTANCE.checkByMD5(cookieManager, checkcode, CookieNameEnum.maimaijun_checkcode);
    }

    /**
     * 创建一个验证图片
     * 
     * <pre>
     * 1.cookie中加密写入当前验证码的值
     * 2.取得/生成验证码图片流返回出来
     * </pre>
     * 
     * @return 图片验证的绝对地址
     */
    public byte[] create(CookieManager cookieManager) {
        return CheckCodeManager.INSTANCE.create(cookieManager, CookieNameEnum.maimaijun_checkcode);
    }

    public byte[] create(CookieManager cookieManager, HttpServletResponse response) {
        return CheckCodeManager.INSTANCE.create(cookieManager, CookieNameEnum.maimaijun_checkcode, response);
    }
}
