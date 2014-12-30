/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service.impl;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.dao.CommentsDao;
import com.mmj.app.biz.dao.ReportDao;
import com.mmj.app.biz.dao.VoteDao;
import com.mmj.app.biz.domain.CommentsDO;
import com.mmj.app.biz.domain.CommentsFullDO;
import com.mmj.app.biz.domain.ReportDO;
import com.mmj.app.biz.domain.VoteDO;
import com.mmj.app.biz.query.CommentsQuery;
import com.mmj.app.biz.query.ReportQuery;
import com.mmj.app.biz.query.VoteQuery;
import com.mmj.app.biz.service.interfaces.CommentsService;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.core.lang.ArrayUtils;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * @author zxc Nov 25, 2014 10:23:56 PM
 */
@Service
public class CommentsServiceImpl implements CommentsService {

    @Autowired
    private CommentsDao commentsDao;
    @Autowired
    private ReportDao   reportDao;
    @Autowired
    private VoteDao     voteDao;

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<CommentsFullDO> commentsListPagination(CommentsQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<CommentsFullDO>) Collections.<CommentsFullDO> emptyList();
        }
        return (PaginationList<CommentsFullDO>) commentsDao.paginationList(q, "commentsCount",
                                                                           "commentsListPagination", i);

    }

    @Override
    public Integer count(CommentsQuery q) {
        if (q == null) {
            return 0;
        }
        return commentsDao.count(q);
    }

    @Override
    public CommentsDO find(CommentsQuery q) {
        if (q == null) {
            return null;
        }
        return commentsDao.find(q);
    }

    @Override
    public List<CommentsDO> list(CommentsQuery q) {
        if (q == null) {
            return Collections.<CommentsDO> emptyList();
        }
        return commentsDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<CommentsDO> listPagination(CommentsQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<CommentsDO>) Collections.<CommentsDO> emptyList();
        }
        return (PaginationList<CommentsDO>) commentsDao.paginationList(q, i);
    }

    @Override
    public CommentsDO getCommentsById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return commentsDao.getById(id);
    }

    @Override
    public Long add(CommentsDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = commentsDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(CommentsDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return commentsDao.updateById(t);
    }

    @Override
    public boolean deleteComments(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new CommentsDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteComments(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return commentsDao.deleteById(id);
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 评论投票表 (VoteDO)
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    @Override
    public Integer count(VoteQuery q) {
        if (q == null) {
            return 0;
        }
        return voteDao.count(q);
    }

    @Override
    public VoteDO find(VoteQuery q) {
        if (q == null) {
            return null;
        }
        return voteDao.find(q);
    }

    @Override
    public List<VoteDO> list(VoteQuery q) {
        if (q == null) {
            return Collections.<VoteDO> emptyList();
        }
        return voteDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<VoteDO> listPagination(VoteQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<VoteDO>) Collections.<VoteDO> emptyList();
        }
        return (PaginationList<VoteDO>) voteDao.paginationList(q, i);
    }

    @Override
    public VoteDO getVoteById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return voteDao.getById(id);
    }

    @Override
    public Long add(VoteDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = voteDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(VoteDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return voteDao.updateById(t);
    }

    @Override
    public boolean deleteVote(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new VoteDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteVote(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return voteDao.deleteById(id);
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 评论举报表 (ReportDO)
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    @Override
    public Integer count(ReportQuery q) {
        if (q == null) {
            return 0;
        }
        return reportDao.count(q);
    }

    @Override
    public ReportDO find(ReportQuery q) {
        if (q == null) {
            return null;
        }
        return reportDao.find(q);
    }

    @Override
    public List<ReportDO> list(ReportQuery q) {
        if (q == null) {
            return Collections.<ReportDO> emptyList();
        }
        return reportDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<ReportDO> listPagination(ReportQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<ReportDO>) Collections.<ReportDO> emptyList();
        }
        return (PaginationList<ReportDO>) reportDao.paginationList(q, i);
    }

    @Override
    public ReportDO getReportById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return reportDao.getById(id);
    }

    @Override
    public Long add(ReportDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = reportDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(ReportDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return reportDao.updateById(t);
    }

    @Override
    public boolean deleteReport(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new ReportDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteReport(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return reportDao.deleteById(id);
    }
}
