/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.base;

import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;

import com.mmj.app.biz.cons.DBSortTypeEnum;
import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.common.pagination.Pagination;

/**
 * @author zxc Aug 20, 2014 10:23:59 PM
 */
@SuppressWarnings("unchecked")
public abstract class BaseQuery<T extends Serializable> extends Pagination {

    public final static int DEFAULT_PAGESIZE = 20;

    protected T             entity;

    private Class<T>        entityClass;

    // 按时间查询,创建时间的起始查询时间,截止查询时间
    private String          startGmtCreate;
    private String          endGmtCreate;

    // 按时间查询,更新时间的起始查询时间,截止查询时间
    private String          startGmtModified;
    private String          endGmtModified;

    private String          sortType         = DBSortTypeEnum.GMT_CREATE.getName();

    private Integer         status           = StatusEnum.UN_DELETE.getValue();

    public BaseQuery() {
        Class<?> c = getClass();
        Type type = c.getGenericSuperclass();
        if (type instanceof ParameterizedType) {
            Type[] parameterizedType = ((ParameterizedType) type).getActualTypeArguments();
            this.entityClass = (Class<T>) parameterizedType[0];
        }

        if (entity == null && entityClass != null) {
            try {
                entity = entityClass.newInstance();
            } catch (InstantiationException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
    }

    public BaseQuery(T t) {
        this();
        setT(t);
    }

    public T getT() {
        return entity;
    }

    public void setT(T t) {
        this.entity = t;
    }

    public String getStartGmtCreate() {
        return startGmtCreate;
    }

    public void setStartGmtCreate(String startGmtCreate) {
        this.startGmtCreate = startGmtCreate;
    }

    public String getSortType() {
        return sortType;
    }

    public void setSortType(String sortType) {
        this.sortType = sortType;
    }

    public void setSortType(DBSortTypeEnum sortType) {
        this.sortType = sortType.getName();
    }

    public String getEndGmtCreate() {
        return endGmtCreate;
    }

    public void setEndGmtCreate(String endGmtCreate) {
        this.endGmtCreate = endGmtCreate;
    }

    public String getStartGmtModified() {
        return startGmtModified;
    }

    public void setStartGmtModified(String startGmtModified) {
        this.startGmtModified = startGmtModified;
    }

    public String getEndGmtModified() {
        return endGmtModified;
    }

    public void setEndGmtModified(String endGmtModified) {
        this.endGmtModified = endGmtModified;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }
}
