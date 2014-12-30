/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.core.lang;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author zxc Jun 16, 2014 12:22:07 AM
 */
public class BeanUtils {

    private static Logger logger = LoggerFactory.getLogger(BeanUtils.class);

    public static Map<String, Object> beanToMap(Object entity) {
        Map<String, Object> parameter = new HashMap<String, Object>();
        Field[] fields = entity.getClass().getDeclaredFields();
        for (int i = 0; i < fields.length; i++) {
            String fieldName = fields[i].getName();
            if (StringUtils.equals("serialVersionUID", fieldName)) {
                continue;
            }
            Object o = null;
            String firstLetter = fieldName.substring(0, 1).toUpperCase();
            String getMethodName = "get" + firstLetter + fieldName.substring(1);
            Method getMethod;
            try {
                getMethod = entity.getClass().getMethod(getMethodName, new Class[] {});
                o = getMethod.invoke(entity, new Object[] {});
            } catch (Exception e) {
                e.printStackTrace();
            }
            if (o != null) {
                parameter.put(fieldName, o);
            }
        }
        return parameter;
    }

    /**
     * 转换时 加入init方法会执行，请注意
     * 
     * @param clazz
     * @param raw
     * @param specialConverts
     * @return
     */
    public static <T extends Object> List<T> convert(Class<T> clazz, Collection<?> raw,
                                                     ValueEditable... specialConverts) {
        if (Argument.isEmpty(raw)) {
            return Collections.emptyList();
        }
        List<T> data = new ArrayList<T>(raw.size());
        for (Object obj : raw) {
            T vo;
            try {
                vo = clazz.newInstance();
                copyProperties(vo, obj, specialConverts);
                data.add(vo);

                // 特殊处理
                optInitMethod(vo);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return data;
    }

    public static <T extends Object> void copyProperties(T target, Object raw,
                                                         Collection<? extends ValueEditable> convert) {
        copyProperties(target, raw, convert.toArray(new ValueEditable[0]));
    }

    /**
     * copy时 加入init方法会执行，请注意
     * 
     * @param target
     * @param raw
     * @param defaultValues
     */
    @SuppressWarnings({ "rawtypes" })
    public static <T extends Object> void copyProperties(T target, Object raw, ValueEditable... defaultValues) {

        try {
            Map values = raw == null ? new HashMap() : PropertyUtils.describe(raw);
            if (Argument.isNotEmptyArray(defaultValues)) {
                for (ValueEditable edit : defaultValues) {
                    edit.edit(raw, values);
                }
            }

            PropertyUtils.copyProperties(target, values);
            // 特殊处理
            optInitMethod(target);
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }

    @SuppressWarnings("rawtypes")
    public static <T extends Object> void copyProperties(Collection<T> target, Collection beans, String key,
                                                         Collection<? extends ValueEditable> defaultValues) {
        Map<String, List<T>> result = CollectionUtils.toListMap(target, key);
        for (Object bean : beans) {
            try {
                Object keyProperty = PropertyUtils.getProperty(bean, key);
                List<T> keywords = result.get(keyProperty);
                if (keywords == null) {
                    continue;
                }
                for (T keyword : keywords) {
                    copyProperties(keyword, bean, defaultValues);
                }
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }
    }

    private static <T extends Object> void optInitMethod(T vo) throws IllegalAccessException, InvocationTargetException {
        Method[] methods = vo.getClass().getDeclaredMethods();
        for (Method method : methods) {
            if (StringUtils.equals("init", method.getName())) {
                method.invoke(vo);
            }
        }
    }
}
