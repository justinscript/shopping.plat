/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.tools;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.mmj.app.biz.cons.DBSortTypeEnum;
import com.mmj.app.biz.cons.SubjectEnum;
import com.mmj.app.biz.domain.CommentsFullDO;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.CommentsQuery;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.biz.service.interfaces.CommentsService;
import com.mmj.app.biz.service.interfaces.TopicService;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.pagination.PaginationList;

/**
 * 右侧 最热榜 最热评论 TOP 10
 * 
 * @author zxc Dec 3, 2014 12:33:48 AM
 */
public class TopBandViewTools {

    @Autowired
    protected TopicService    topicService;
    @Autowired
    protected CommentsService commentsService;

    private static int        TOP_N = 10;

    // 最热榜,最热条目
    public List<TopicDO> getTopTopic(Object subject) {
        TopicQuery topicQuery = null;
        SubjectEnum subjectEnum = null;

        if (subject instanceof String) {
            subjectEnum = SubjectEnum.getEnum((String) subject);
        }
        if (subject instanceof Integer) {
            subjectEnum = SubjectEnum.getEnum((Integer) subject);
        }

        if (subjectEnum == null) {
            topicQuery = new TopicQuery(TOP_N);
        } else {
            topicQuery = new TopicQuery(subjectEnum, TOP_N);
        }
        List<TopicDO> list = topicService.listPagination(topicQuery);
        return Argument.isEmpty(list) ? Collections.<TopicDO> emptyList() : list;
    }

    // 最热评论
    public List<CommentsFullDO> getTopComments(Object subject) {
        CommentsQuery commentsQuery = new CommentsQuery();
        SubjectEnum subjectEnum = null;
        if (subject instanceof String) {
            subjectEnum = SubjectEnum.getEnum((String) subject);
        }
        if (subject instanceof Integer) {
            subjectEnum = SubjectEnum.getEnum((Integer) subject);
        }

        if (subjectEnum != null) {
            commentsQuery.setSubjectId(subjectEnum);
        }
        commentsQuery.setPageSize(TOP_N);
        commentsQuery.setSortType(DBSortTypeEnum.UPS);

        PaginationList<CommentsFullDO> list = commentsService.commentsListPagination(commentsQuery);
        return Argument.isEmpty(list) ? Collections.<CommentsFullDO> emptyList() : list;
    }
}
