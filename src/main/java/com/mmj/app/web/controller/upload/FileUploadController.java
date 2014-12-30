/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.upload;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.async.DeferredResult;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import com.google.gson.Gson;
import com.mmj.app.common.cons.ResultCode;
import com.mmj.app.common.result.JsonResultUtils.DefaultJsonResult;
import com.mmj.app.common.result.Result;
import com.mmj.app.common.velocity.CustomVelocityLayoutView;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.vo.ImgVO;

/**
 * file upload
 * 
 * @author zxc Jun 30, 2014 3:09:36 PM
 */
@Controller
public class FileUploadController extends BaseController {

    // /link/pic/upload 发布主题,上传图片
    // "imgUrl":"http://img1.chouti.com/group10/M03/01/7F/wKgCNlR5-yfAnjjwAAHMGsSZkHk908=420x185.jpg",
    // "identifie":"1417280287366"
    // <html><head><script
    // type='text/javascript'>document.domain='chouti.com'</script></head><body>{"result":{"code":"9999",
    // "message":"图片上传成功",
    // "data":{"imgUrl":"http://img1.chouti.com/group10/M01/C7/B1/wKgCNlSLCA2SPFfIAAHMGsSZkHk134=420x185.jpg","identifie":"1418397705196"}}}
    // </body></html>
    @RequestMapping(value = "/link/pic/upload")
    public ModelAndView picUpload(String identifie, @RequestParam("imgUrl")
    MultipartFile... files) {
        ModelAndView mav = new ModelAndView("return");
        mav.getModel().put(CustomVelocityLayoutView.USE_LAYOUT, "false");

        if (files == null || files.length <= 0) {
            return returnErrorJson(mav);
        }
        List<String> urlList = new ArrayList<String>();
        for (int i = 0; i < files.length; i++) {
            Result result = fileService.createFilePath(files[i]);
            if (result == null || result.getData() == null) {
                return returnErrorJson(mav);
            }
            urlList.add((String) result.getData());
        }
        String imgUrl = urlList.get(0);
        String[] urlArray = StringUtils.split(imgUrl, ".");
        imgUrl = urlArray[0] + "=420x185" + "." + urlArray[1];
        logger.error("FileUploadController : picUpload url:" + imgUrl);
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", new DefaultJsonResult(9999, "图片上传成功", new ImgVO(imgUrl, identifie)));
        mav.addObject("json", new Gson().toJson(map));
        return mav;
    }

    private ModelAndView returnErrorJson(ModelAndView mav) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("result", new DefaultJsonResult(0000, "上传失败", ""));
        mav.addObject("json", new Gson().toJson(map));
        return mav;
    }

    @RequestMapping(value = "/ajaxUpload.htm", headers = "accept=*/*", produces = "application/json", method = RequestMethod.POST)
    @ResponseBody
    public DeferredResult<String> ajaxUpload(String a, @RequestParam("upload")
    MultipartFile... files) {
        DeferredResult<String> deferredResult = new DeferredResult<String>();
        if (files == null || files.length <= 0) {
            deferredResult.setResult("-1");
            return deferredResult;
        }
        List<String> urlList = new ArrayList<String>();
        for (int i = 0; i < files.length; i++) {
            Result result = fileService.createFilePath(files[i]);
            if (result == null || result.getData() == null) {
                deferredResult.setResult("IOError");
                return deferredResult;
            }
            urlList.add((String) result.getData());
        }
        deferredResult.setResult(urlList.get(0));
        return deferredResult;
    }

    private String returnFileResult(String code, String msg, String url) {
        Map<String, String> map = new HashMap<String, String>();
        map.put("error", code);
        map.put("message", msg);
        map.put("url", url);
        return new Gson().toJson(map);
    }

    @RequestMapping(value = "/uploadPublish.htm", headers = "accept=*/*", produces = "application/json", method = RequestMethod.POST)
    @ResponseBody
    public DeferredResult<String> uploadPublish(String a, @RequestParam("files")
    MultipartFile... files) {
        DeferredResult<String> deferredResult = new DeferredResult<String>();
        if (files == null || files.length <= 0) {
            deferredResult.setResult(returnFileResult("1", "上传失败", ""));
            return deferredResult;
        }
        List<String> urlList = new ArrayList<String>();
        for (int i = 0; i < files.length; i++) {
            Result result = fileService.createFilePath(files[i]);
            if (result == null || result.getData() == null) {
                deferredResult.setResult(returnFileResult("1", "上传失败", ""));
                return deferredResult;
            }
            urlList.add((String) result.getData());
        }
        String imgUrl = urlList.get(0);
        String[] urlArray = StringUtils.split(imgUrl, ".");
        imgUrl = urlArray[0] + "=420x185" + "." + urlArray[1];
        deferredResult.setResult(returnFileResult("0", "上传成功", imgUrl));
        return deferredResult;
    }

    @RequestMapping(value = "/uploadFile.htm")
    public ModelAndView uploadFile(@RequestParam("files")
    MultipartFile... files) {
        if (files == null || files.length <= 0) {
            return createFileJsonMav(ResultCode.ERROR, "上传失败", null);
        }
        List<String> urlList = new ArrayList<String>();
        for (int i = 0; i < files.length; i++) {
            Result result = fileService.createFilePath(files[i]);
            if (result == null || result.getData() == null) {
                return createFileJsonMav(ResultCode.ERROR, "上传失败", null);
            }
            urlList.add((String) result.getData());
        }
        return createFileJsonMav(ResultCode.SUCCESS, "上传成功", urlList.get(0));
    }

    @RequestMapping("/doUploads.htm")
    public ModelAndView filesUpload(@RequestParam("files")
    MultipartFile... files) {
        Result result = null;
        if (files != null && files.length > 0) {
            for (int i = 0; i < files.length; i++) {
                MultipartFile file = files[i];
                result = fileService.createFilePath(file, file.getOriginalFilename());
            }
        }
        if (result == null || result.getData() == null) {
            return createFileJsonMav(ResultCode.ERROR, "上传失败", null);
        }
        return createFileJsonMav(ResultCode.SUCCESS, "上传成功", result.getData().toString());
    }

    @RequestMapping("/doUpload.htm")
    public ModelAndView fileUpload(@RequestParam("file")
    MultipartFile file) {
        Result result = null;
        if (!file.isEmpty()) {
            result = fileService.createFilePath(file, file.getOriginalFilename());
        }
        if (result == null || result.getData() == null) {
            return createFileJsonMav(ResultCode.ERROR, "上传失败", null);
        }
        return createFileJsonMav(ResultCode.SUCCESS, "上传成功", result.getData().toString());
    }

    @RequestMapping(value = "/fileUpload.htm")
    public String index() {
        return "upload";
    }
}
