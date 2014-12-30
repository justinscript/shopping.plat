/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service.interfaces;

import java.util.List;

import com.mmj.app.biz.base.BaseService;
import com.mmj.app.biz.domain.BlacklistDO;
import com.mmj.app.biz.domain.CollectDO;
import com.mmj.app.biz.domain.CollectFullDO;
import com.mmj.app.biz.domain.FeedbackDO;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.MemberThinDO;
import com.mmj.app.biz.query.BlacklistQuery;
import com.mmj.app.biz.query.CollectQuery;
import com.mmj.app.biz.query.FeedbackQuery;
import com.mmj.app.biz.query.MemberQuery;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * 用户相关的服务层接口
 * 
 * @author zxc Nov 25, 2014 10:20:45 PM
 */
public interface UserService extends BaseService {

    public MemberThinDO checkMemberCode(Long uId, String smsCode);

    public MemberThinDO fetchMemberById(Long uId);

    public MemberThinDO fetchMemberByName(String name);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////用户表(MemberDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    Integer count(MemberQuery q);

    MemberDO find(MemberQuery q);

    List<MemberDO> list(MemberQuery q);

    PaginationList<MemberDO> listPagination(MemberQuery q, IPageUrl... i);

    MemberDO getMemberById(Long id);

    Long add(MemberDO... t);

    boolean update(MemberDO t);

    boolean deleteMember(Long id);

    boolean realDeleteMember(Long id);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////黑名单表(BlacklistDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    Integer count(BlacklistQuery q);

    BlacklistDO find(BlacklistQuery q);

    List<BlacklistDO> list(BlacklistQuery q);

    PaginationList<BlacklistDO> listPagination(BlacklistQuery q, IPageUrl... i);

    BlacklistDO getBlacklistById(Long id);

    Long add(BlacklistDO... t);

    boolean update(BlacklistDO t);

    boolean deleteBlacklist(Long id);

    boolean realDeleteBlacklist(Long id);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////收藏表(CollectDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    PaginationList<CollectFullDO> collectListPagination(CollectQuery q, IPageUrl... i);

    Integer count(CollectQuery q);

    CollectDO find(CollectQuery q);

    List<CollectDO> list(CollectQuery q);

    PaginationList<CollectDO> listPagination(CollectQuery q, IPageUrl... i);

    CollectDO getCollectById(Long id);

    Long add(CollectDO... t);

    boolean update(CollectDO t);

    boolean deleteCollect(Long id);

    boolean realDeleteCollect(Long id);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////反馈表(FeedbackDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    Integer count(FeedbackQuery q);

    FeedbackDO find(FeedbackQuery q);

    List<FeedbackDO> list(FeedbackQuery q);

    PaginationList<FeedbackDO> listPagination(FeedbackQuery q, IPageUrl... i);

    FeedbackDO getFeedbackById(Long id);

    Long add(FeedbackDO... t);

    boolean update(FeedbackDO t);

    boolean deleteFeedback(Long id);

    boolean realDeleteFeedback(Long id);
}
