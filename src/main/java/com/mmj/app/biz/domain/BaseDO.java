/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.domain;

import java.io.Serializable;
import java.util.Date;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.common.core.CustomToStringStyle;
import com.mmj.app.common.util.DateViewTools;

/**
 * @author zxc Nov 25, 2014 9:23:20 PM
 */
public class BaseDO implements Serializable {

    private static final long serialVersionUID = -1183441986978913634L;

    private Long              id;                                           // 主键
    private Date              gmtCreate;                                    // 创建时间
    private Date              gmtModified;                                  // 修改时间
    private Integer           status           = StatusEnum.UN_DELETE.value; // 记录状态: 0=正常,1=删除

    public BaseDO() {

    }

    public String getPublishTime() {
        return DateViewTools.getDifferDayHourMin(this.getGmtCreate());
    }

    public BaseDO(Long id) {
        setId(id);
    }

    public BaseDO(StatusEnum status) {
        setStatus(status.getValue());
    }

    public BaseDO(Long id, StatusEnum status) {
        setId(id);
        setStatus(status.getValue());
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getGmtCreate() {
        return gmtCreate;
    }

    public void setGmtCreate(Date gmtCreate) {
        this.gmtCreate = gmtCreate;
    }

    public Date getGmtModified() {
        return gmtModified;
    }

    public void setGmtModified(Date gmtModified) {
        this.gmtModified = gmtModified;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
