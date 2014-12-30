/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.comet;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;

import com.google.gson.Gson;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.vo.ConnectVO;
import com.mmj.app.web.vo.HandShakeVO;

/**
 * @author zxc Nov 30, 2014 2:23:47 AM
 */
@Controller
public class CometController extends BaseController {

    // /comet/connect
    // [{"id":"4","successful":true,"advice":{"reconnect":"retry","interval":0,"timeout":30000},"channel":"/meta/connect"}]
    // [{"id":"62","successful":true,"channel":"/meta/connect"}]
    @RequestMapping(value = "/comet/connect", headers = "accept=*/*", produces = "application/json", method = RequestMethod.POST)
    @ResponseBody
    public DeferredResult<String> connect() {
        DeferredResult<String> deferredResult = new DeferredResult<String>();
        ConnectVO connectVO = new ConnectVO("62", true, "/meta/connect");
        deferredResult.setResult(new Gson().toJson(Arrays.asList(connectVO)));
        try {
            Thread.sleep(30000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return deferredResult;
    }

    // /comet/
    // [{"id":"2","data":"{"freshNewsCount":"1","notifyCount":"0"}","channel":"/broadcast/chouti-new"},
    // {"id":"17","successful":true,"channel":"/meta/connect"}]
    // [{"id":"2","subscription":"/service/chouti-new","successful":true,"channel":"/meta/subscribe"}]
    @RequestMapping(value = "/comet/", headers = "accept=*/*", produces = "application/json", method = RequestMethod.POST)
    @ResponseBody
    public DeferredResult<String> comet() {
        DeferredResult<String> deferredResult = new DeferredResult<String>();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("id", "2");
        map.put("subscription", "/service/chouti-new");
        map.put("successful", true);
        map.put("channel", "/meta/subscribe");
        deferredResult.setResult(new Gson().toJson(Arrays.asList(map)));
        return deferredResult;
    }

    // /comet/handshake
    /**
     * <pre>
     * [
     *     {
     *         "id": "1", 
     *         "minimumVersion": "1.0", 
     *         "supportedConnectionTypes": [
     *             "callback-polling", 
     *             "long-polling"
     *         ], 
     *         "successful": true, 
     *         "channel": "/meta/handshake", 
     *         "clientId": "ukpp1rfmxc8az72gwx3skxu2ythnl", 
     *         "version": "1.0"
     *     }
     * ]
     * </pre>
     * 
     * @return
     */
    @RequestMapping(value = "/comet/handshake", headers = "accept=*/*", produces = "application/json", method = RequestMethod.POST)
    @ResponseBody
    public DeferredResult<String> handshake() {
        DeferredResult<String> deferredResult = new DeferredResult<String>();
        HandShakeVO handShake = new HandShakeVO("1", "1.0", true, "/meta/handshake", "ukpp1rfmxc8az72gwx3skxu2ythnl",
                                                "1.0", "callback-polling", "long-polling");
        deferredResult.setResult(new Gson().toJson(Arrays.asList(handShake)));
        return deferredResult;
    }
}
