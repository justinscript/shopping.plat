/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.HandleStateEnum;
import com.mmj.app.biz.cons.ReportTypeEnum;
import com.mmj.app.biz.domain.ReportDO;

/**
 * @author zxc Dec 3, 2014 11:56:34 AM
 */
public class ReportQuery extends BaseQuery<ReportDO> {

    public ReportQuery() {
        this(new ReportDO());
    }

    public ReportQuery(ReportDO t) {
        super(t);
    }

    public ReportQuery(Long uId) {
        entity.setUserId(uId);
    }

    public ReportQuery(Long userId, Long commentsId) {
        entity.setUserId(userId);
        entity.setCommentsId(commentsId);
    }

    public ReportQuery(Long userId, HandleStateEnum handleStateEnum) {
        entity.setUserId(userId);
        entity.setHandleState(handleStateEnum.getValue());
    }

    public ReportQuery(Long userId, Long topicId, Long commentsId) {
        entity.setUserId(userId);
        entity.setTopicId(topicId);
        entity.setCommentsId(commentsId);
    }

    public ReportQuery(Long userId, Long topicId, Long commentsId, Integer reportType) {
        entity.setUserId(userId);
        entity.setTopicId(topicId);
        entity.setCommentsId(commentsId);
        entity.setReportType(reportType);
        entity.setHandleState(HandleStateEnum.UNHANDLE.getValue());
    }

    public ReportQuery(Long userId, Long topicId, Long commentsId, ReportTypeEnum reportType) {
        entity.setUserId(userId);
        entity.setTopicId(topicId);
        entity.setCommentsId(commentsId);
        entity.setReportType(reportType.getValue());
        entity.setHandleState(HandleStateEnum.UNHANDLE.getValue());
    }
}
