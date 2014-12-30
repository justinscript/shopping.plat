/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.core.lang;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

/**
 * @author zxc Jun 16, 2014 12:16:40 AM
 */
@SuppressWarnings("unchecked")
public class Wrapper {

    /**
     * 对象数组变成HashSet,如果values是空的话，返回new HashSet<T>(0)
     */
    public static <T extends Object> java.util.HashSet<T> hashset(T... values) {
        if (Argument.isEmptyArray(values)) {
            return new HashSet<T>(0);
        }
        HashSet<T> result = new HashSet<T>(values.length);
        for (T value : values) {
            if (value != null) result.add(value);
        }
        return result;
    }

    /**
     * 对象数组变成List,如果values是空的话，返回new ArrayList<T>(0)
     */
    public static <T extends Object> java.util.List<T> collection(T... values) {
        if (Argument.isEmptyArray(values)) {
            return new ArrayList<T>(0);
        }
        List<T> result = new ArrayList<T>(values.length);
        for (T value : values) {
            if (value != null) result.add(value);
        }
        return result;
    }

    public static <T extends Object> T[] uniq(T[] values) {
        HashSet<T> hashset = hashset(values);
        return hashset.toArray(values);
    }

    public static <T extends Object> void uniq(Collection<T> values) {
        if (values == null) {
            return;
        }
        Set<T> datas = new HashSet<T>(values.size());
        datas.addAll(values);
        Iterator<T> it = values.iterator();
        while (it.hasNext()) {
            T next = it.next();
            if (datas.contains(next) == false) {
                it.remove();
            } else {
                datas.remove(next);
            }
        }
    }

    public static <T extends Object> T last(List<T> collection) {
        return collection != null && collection.size() > 0 ? collection.get(collection.size() - 1) : null;
    }
}
