/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.base;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 *      可以在BaseMapper中加入Q查询对象 BaseMapper<T,Q>,分页可以用BaseMapper实现然后在BaseDao中封装掉
 * </pre>
 * 
 * @author zxc Jun 15, 2014 11:11:48 PM
 */
public interface BaseMapper<T extends Serializable, Q> {

    /**
     * 根据ID查找
     * 
     * @param id
     * @return
     */
    public T getById(Number id);

    /**
     * find 查询
     * 
     * @param q
     * @return
     */
    public T find(Q q);

    /**
     * listQuery 查询
     * 
     * @param q
     * @return
     */
    public List<T> listQuery(Q q);

    /**
     * listPagination 查询
     * 
     * @param q
     * @return
     */
    public List<T> listPagination(Q q);

    /**
     * count 操作
     * 
     * @param q
     * @return
     */
    public Integer count(Q q);

    /**
     * 查询所有或limit 的几条数据
     * 
     * @param map
     * @param limitSize == null 则查所有
     */
    public List<T> list(Map<String, Object> map);

    /**
     * 插入新数据
     */
    public Integer insert(T t);

    /**
     * 根据Id更新对象
     * 
     * @param t
     * @return
     */
    public Integer updateById(T t);

    /**
     * 根据T更新对象
     * 
     * @param t
     * @return
     */
    public Integer update(T t);

    /**
     * 删除
     * 
     * @param id
     * @return
     */
    public Integer deleteById(Number id);
}
