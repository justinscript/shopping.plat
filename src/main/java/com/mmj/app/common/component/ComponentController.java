/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.component;

import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import com.mmj.app.common.cons.ResultCode;
import com.mmj.app.common.cookie.manager.CookieManager;
import com.mmj.app.common.cookie.manager.CookieManagerLocator;
import com.mmj.app.common.velocity.CustomVelocityLayoutView;
import com.mmj.app.web.tools.InvokeTypeTools;

/**
 * @author zxc Jul 14, 2014 4:22:06 PM
 */
public abstract class ComponentController {

    // request,response 不可随意使用
    protected HttpServletRequest  request;
    protected HttpServletResponse response;
    protected HttpSession         session;

    protected CookieManager       cookieManager;

    @ExceptionHandler(Throwable.class)
    public ModelAndView handleIOException(Throwable e) throws Throwable {

        if (AnnotationUtils.findAnnotation(e.getClass(), ResponseStatus.class) != null) {
            throw e;
        }

        if (request == null && response == null) {
            throw e;
        }

        if (request == null && response != null) {
            response.setCharacterEncoding("utf-8");
            response.setContentType("text/html;charset=UTF-8");
            OutputStream out = response.getOutputStream();
            PrintWriter pw = new PrintWriter(new OutputStreamWriter(out, "utf-8"));
            pw.println("{\"code\":-1,\"message\":\"访问异常,服务器出现错误!\",\"data\":\"\"}");
            pw.flush();
            pw.close();
        }

        ModelAndView mav = new ModelAndView();
        if (InvokeTypeTools.isAjax(request)) {
            return createJsonMav("访问异常,服务器出现错误!", ResultCode.ERROR, e.getMessage());
        }

        mav.addObject("exception", e.getCause() == null ? StringUtils.EMPTY : e.getCause().toString());
        mav.addObject("msg", e.getMessage());
        mav.addObject("stackTrace", e.getStackTrace().toString());
        if (request.getRequestURI() != null) {
            mav.addObject("url", request.getRequestURI().toString());
        }
        mav.getModel().put(CustomVelocityLayoutView.USE_LAYOUT, "false");
        mav.setViewName("error");
        return mav;
    }

    @ModelAttribute
    public void setReqAndResp(HttpServletRequest request, HttpServletResponse response) {
        this.request = request;
        this.response = response;
        this.session = request.getSession();
        this.cookieManager = CookieManagerLocator.get(request, response);
    }

    public CookieManager getCookieManager() {
        return cookieManager;
    }

    public void setCookieManager(CookieManager cookieManager) {
        this.cookieManager = cookieManager;
    }

    public void setCookieManager(HttpServletRequest request, HttpServletResponse response) {
        this.cookieManager = CookieManagerLocator.get(request, response);
    }

    public HttpServletRequest getRequest() {
        return request;
    }

    public void setRequest(HttpServletRequest request) {
        this.request = request;
    }

    public HttpServletResponse getResponse() {
        return response;
    }

    public void setResponse(HttpServletResponse response) {
        this.response = response;
    }

    protected ModelAndView createJsonMav(String msg) {
        return createJsonMav(msg, ResultCode.ERROR, null);
    }

    protected ModelAndView createJsonMav(String msg, ResultCode code) {
        return createJsonMav(msg, code, null);
    }

    protected ModelAndView createJsonMav(ResultCode code, Object object) {
        return createJsonMav(StringUtils.EMPTY, code, object);
    }

    protected ModelAndView createFileJsonMav(ResultCode code, String msg, String object) {
        ModelAndView mav = new ModelAndView();
        mav.setView(new MappingJackson2JsonView());
        mav.addObject("error", code.value);
        mav.addObject("message", msg);
        mav.addObject("url", object == null ? StringUtils.EMPTY : object);
        return mav;
    }

    protected ModelAndView createJsonMav(String msg, ResultCode code, Object object) {
        ModelAndView mav = new ModelAndView();
        mav.setView(new MappingJackson2JsonView());
        mav.addObject("code", Integer.toString(code.value));
        mav.addObject("message", msg);
        mav.addObject("data", object == null ? StringUtils.EMPTY : object);
        return mav;
    }
}
