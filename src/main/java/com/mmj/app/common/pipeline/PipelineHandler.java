/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.pipeline;

import java.lang.reflect.Method;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.mmj.app.common.component.ComponentController;

/**
 * @author zxc Jul 17, 2014 2:14:03 PM
 */
@Component
public class PipelineHandler {

    public static Logger logger = LoggerFactory.getLogger(PipelineHandler.class);

    public PipelineResult doPreHandlePipelineValues(HttpServletRequest request, HttpServletResponse response,
                                                    PipelineMap map,
                                                    List<PipelineValvesMapper> preHandlePipelineValves, Object handler)
                                                                                                                       throws Exception {
        if (preHandlePipelineValves.size() == 0) {
            return null;
        }
        // 防止死循环,执行某个pipeline后跳转到此pipeline前面的pipeline，再次执行此pipeline，如此死循环
        int count = 0;
        int maxcount = preHandlePipelineValves.size() * 3;
        PipelineResult result = null;
        PipelineValvesMapper pvm = getNextPipelineValves(preHandlePipelineValves, null,
                                                         PipelineType.PIPELINE_PREHANDLE, null);
        while (pvm != null && count < maxcount) {
            // if (handler instanceof HandlerMethod) {
            // Object objectHandler = ((HandlerMethod) handler).getBean();
            // ComponentController controller = (ComponentController) objectHandler;
            // injectServletObject(controller, request, response);
            // }
            result = pvm.getPipeline().invoke(request, response, map);
            if (result != null && result.getType() != PipelineType.PIPELINE_PREHANDLE) {
                break;
            }
            count++;
            pvm = getNextPipelineValves(preHandlePipelineValves, pvm, PipelineType.PIPELINE_PREHANDLE, result);
        }
        // try执行完，检查下下一个目标是不是去finally，不是直接定位到finally
        if (result != null && result.getType() != PipelineType.PIPELINE_AFTERCOMPLETION) {
            return PipelineResult.gotoFinally(null);
        }
        return result;
    }

    @SuppressWarnings("unused")
    private void injectServletObject(ComponentController controller, HttpServletRequest request,
                                     HttpServletResponse response) {
        Class<? extends ComponentController> clazz = controller.getClass();
        try {
            // 注入HttpServletRequest
            Method method = clazz.getMethod("setRequest", HttpServletRequest.class);
            if (method != null) {
                method.invoke(controller, request);
            }
        } catch (Exception e) {
        }

        try {
            // 注入HttpServletResponse
            Method method = clazz.getMethod("setResponse", HttpServletResponse.class);
            if (method != null) {
                method.invoke(controller, response);
            }
        } catch (Exception e) {
        }

        try {
            // 注入HttpServletResponse
            Method method = clazz.getMethod("setCookieManager", HttpServletRequest.class, HttpServletResponse.class);
            if (method != null) {
                method.invoke(controller, request, response);
            }
        } catch (Exception e) {
        }
    }

    public PipelineResult doAfterCompletionPipelineValues(HttpServletRequest request, HttpServletResponse response,
                                                          PipelineMap map, PipelineResult result,
                                                          List<PipelineValvesMapper> afterCompletionPipelineValves)
                                                                                                                   throws Exception {
        if (afterCompletionPipelineValves.size() == 0) {
            return null;
        }
        int count = 0;
        int maxcount = afterCompletionPipelineValves.size() * 3;
        PipelineValvesMapper pvm = getNextPipelineValves(afterCompletionPipelineValves, null,
                                                         PipelineType.PIPELINE_AFTERCOMPLETION, result);
        while (pvm != null && count < maxcount) {
            result = pvm.getPipeline().invoke(request, response, map);
            if (result != null && result.getType() != PipelineType.PIPELINE_AFTERCOMPLETION) {
                break;
            }
            count++;
            pvm = getNextPipelineValves(afterCompletionPipelineValves, pvm, PipelineType.PIPELINE_AFTERCOMPLETION,
                                        result);
        }
        return result;
    }

    private PipelineValvesMapper getNextPipelineValves(List<PipelineValvesMapper> pvList, PipelineValvesMapper current,
                                                       PipelineType currentType, PipelineResult result) {
        if (pvList.size() == 0) {
            return null;
        }
        // 第一次时
        if (current == null) {
            // final时，有可能直接定位到某一个pipeline
            if (currentType == PipelineType.PIPELINE_AFTERCOMPLETION) {
                if (result != null && result.getName() != null && result.getName().length() != 0) {
                    for (int i = 0; i < pvList.size(); i++) {
                        if (pvList.get(i).getPipelineName().equals(result.getName())) {
                            return pvList.get(i);
                        }
                    }
                    return null;
                } else {
                    return pvList.get(0);
                }
            } else {
                return pvList.get(0);
            }
        }
        // 取下一个,如果goto的下一个pipeline名字为空，也认为去取下一个
        if (result == null || result.getName() == null || result.getName().length() == 0) {
            for (int i = 0; i < pvList.size(); i++) {
                if (current == pvList.get(i)) {
                    if (i < pvList.size() - 1) {
                        return pvList.get(i + 1);
                    } else {
                        return null;
                    }
                }
            }
        } else// 根据名字来取
        {
            for (int i = 0; i < pvList.size(); i++) {
                if (pvList.get(i).getPipelineName().equals(result.getName())) {
                    return pvList.get(i);
                }
            }
            logger.debug("Can't find {} pipelineValves", result.getName());
        }
        return null;
    }
}
