/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.checkcode;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mmj.app.common.cookie.CookieNameEnum;
import com.mmj.app.common.cookie.cons.CookieDomain;
import com.mmj.app.common.cookie.cons.CookieMaxAge;
import com.mmj.app.common.cookie.manager.CookieManager;
import com.mmj.app.common.security.EncryptBuilder;
import com.mmj.app.common.security.Md5Encrypt;

/**
 * @author zxc Nov 30, 2014 5:06:08 PM
 */
public class CheckCodeManager implements CheckCodeConstants {

    private static final Logger          logger    = LoggerFactory.getLogger(CheckCodeManager.class);

    private Exception                    initException;
    private boolean                      needCheck = true;

    public static final CheckCodeManager INSTANCE  = new CheckCodeManager();

    private CheckCodeManager() {
        setup();
    }

    /**
     * 初始化
     */
    public void setup() {
        try {
            CheckCodeTools.init();
            String checkCodeSwitch = "on";
            if (StringUtils.equals(checkCodeSwitch, "off")) {
                this.needCheck = false;
            } else {
                this.needCheck = true;
            }
            initException = null;
        } catch (Exception e) {
            initException = e;
            logger.error("CheckCodeManager Set Failed!", e);
        }
    }

    /**
     * 当前系统是否需要检查Checkcode
     */
    public boolean isNeedCheckCode() {
        return this.needCheck;
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
    public boolean check(CookieManager cookieManager, String checkcode, CookieNameEnum cookieNameEnum) {
        if (!needCheck) {
            return true;
        }
        if (initException != null) {// 之前出错了，重新加载
            setup();
        }
        boolean stillInitFailed = initException != null;
        if (stillInitFailed) {
            return true;// 默认让他通过
        }

        // 用户根本就没有输入验证码(防止用户恶意将Cookie中的值清除掉)
        if (StringUtils.isBlank(checkcode)) {
            return false;
        }
        String checkCodeInCookie = cookieManager.get(cookieNameEnum);
        boolean isValid = StringUtils.equalsIgnoreCase(checkCodeInCookie, checkcode);
        if (!isValid) {// 如果验证不过，将当前Cookie的值清理掉
            cookieManager.set(cookieNameEnum, null);
        }
        return isValid;
    }

    public boolean checkByMD5(CookieManager cookieManager, String checkcode, CookieNameEnum cookieNameEnum) {
        if (!needCheck) {
            return true;
        }
        if (initException != null) {// 之前出错了，重新加载
            setup();
        }
        boolean stillInitFailed = initException != null;
        if (stillInitFailed) {
            return true;// 默认让他通过
        }

        // 用户根本就没有输入验证码(防止用户恶意将Cookie中的值清除掉)
        if (StringUtils.isBlank(checkcode)) {
            return false;
        }
        String checkCodeInCookie = cookieManager.get(cookieNameEnum);
        if (StringUtils.isEmpty(checkCodeInCookie)) {
            return false;
        }
        checkCodeInCookie = Md5Encrypt.md5(StringUtils.lowerCase(checkCodeInCookie));
        boolean isValid = StringUtils.equalsIgnoreCase(checkCodeInCookie, checkcode);
        if (!isValid) {// 如果验证不过，将当前Cookie的值清理掉
            cookieManager.set(cookieNameEnum, null);
        }
        return isValid;
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
    public byte[] create(CookieManager cookieManager, CookieNameEnum cookieNameEnum) {
        if (initException != null) {// 之前出错了，重新加载
            setup();
        }
        CheckCodeInfo createCheckCodeInfo = CheckCodeTools.createCheckCodeInfo();
        if (createCheckCodeInfo != null) {
            cookieManager.set(cookieNameEnum, createCheckCodeInfo.getCode());
            return createCheckCodeInfo.getBytes();
        }
        return null;
    }

    public void updateConfig() {
        setup();
    }

    public String getName() {
        return "CheckCodeServer needCheckcode:[" + this.needCheck + "]";
    }

    public byte[] create(CookieManager cookieManager, CookieNameEnum maimaijunCheckcode, HttpServletResponse response) {
        if (initException != null) {// 之前出错了，重新加载
            setup();
        }
        CheckCodeInfo createCheckCodeInfo = CheckCodeTools.createCheckCodeInfo();
        if (createCheckCodeInfo != null) {
            Cookie cookie = new Cookie("_cc_", EncryptBuilder.getInstance().encrypt(createCheckCodeInfo.getCode()));
            cookie.setMaxAge(CookieMaxAge.FOREVER);
            cookie.setDomain(CookieDomain.DOT_MAIMAIJUN_COM.getDomain());
            cookie.setPath("/");
            response.addCookie(cookie);
            return createCheckCodeInfo.getBytes();
        }
        return null;
    }
}
