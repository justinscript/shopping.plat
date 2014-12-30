/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service.interfaces;

import java.util.List;

import com.mmj.app.biz.base.BaseService;
import com.mmj.app.biz.domain.CommentsDO;
import com.mmj.app.biz.domain.CommentsFullDO;
import com.mmj.app.biz.domain.ReportDO;
import com.mmj.app.biz.domain.VoteDO;
import com.mmj.app.biz.query.CommentsQuery;
import com.mmj.app.biz.query.ReportQuery;
import com.mmj.app.biz.query.VoteQuery;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * 评论服务层接口
 * 
 * @author zxc Nov 25, 2014 10:22:13 PM
 */
public interface CommentsService extends BaseService {

    PaginationList<CommentsFullDO> commentsListPagination(CommentsQuery q, IPageUrl... i);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////评论表(CommentsDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    Integer count(CommentsQuery q);

    CommentsDO find(CommentsQuery q);

    List<CommentsDO> list(CommentsQuery q);

    /**
     * 基础分页查询(IPageUrl分页策略,支持按时间区间查询)
     * 
     * @param query
     * @param iPageUrl
     * @return
     */
    PaginationList<CommentsDO> listPagination(CommentsQuery q, IPageUrl... i);

    CommentsDO getCommentsById(Long id);

    /**
     * 返回主键
     * 
     * @param t
     * @return
     */
    Long add(CommentsDO... t);

    boolean update(CommentsDO t);

    /**
     * 逻辑删除
     * 
     * @param id
     * @return
     */
    boolean deleteComments(Long id);

    /**
     * 物理删除
     * 
     * @param id
     * @return
     */
    boolean realDeleteComments(Long id);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////评论投票表(VoteDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    Integer count(VoteQuery q);

    VoteDO find(VoteQuery q);

    List<VoteDO> list(VoteQuery q);

    PaginationList<VoteDO> listPagination(VoteQuery q, IPageUrl... i);

    VoteDO getVoteById(Long id);

    Long add(VoteDO... t);

    boolean update(VoteDO t);

    boolean deleteVote(Long id);

    boolean realDeleteVote(Long id);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////评论举报表(ReportDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    Integer count(ReportQuery q);

    ReportDO find(ReportQuery q);

    List<ReportDO> list(ReportQuery q);

    PaginationList<ReportDO> listPagination(ReportQuery q, IPageUrl... i);

    ReportDO getReportById(Long id);

    Long add(ReportDO... t);

    boolean update(ReportDO t);

    boolean deleteReport(Long id);

    boolean realDeleteReport(Long id);
}
