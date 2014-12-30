/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service.impl;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.dao.BlacklistDao;
import com.mmj.app.biz.dao.CollectDao;
import com.mmj.app.biz.dao.FeedbackDao;
import com.mmj.app.biz.dao.MemberDao;
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
import com.mmj.app.biz.service.interfaces.UserService;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.core.lang.ArrayUtils;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * @author zxc Nov 25, 2014 10:24:53 PM
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private MemberDao                      memberDao;
    @Autowired
    private BlacklistDao                   blacklistDao;
    @Autowired
    private CollectDao                     collectDao;
    @Autowired
    private FeedbackDao                    feedbackDao;

    private static Map<Long, MemberThinDO> memberCacheMap = new ConcurrentHashMap<Long, MemberThinDO>();

    @PostConstruct
    public void cronCache() {
        ScheduledExecutorService newScheduledThreadPool = Executors.newScheduledThreadPool(1);
        newScheduledThreadPool.scheduleAtFixedRate(new Runnable() {

            @Override
            public void run() {
                try {
                    init();
                } catch (Throwable e) {
                    logger.error("init memberCacheMap error", e);
                }
            }

        }, 50, 12 * 60 * 60, TimeUnit.SECONDS);
    }

    @Override
    public MemberThinDO checkMemberCode(Long uId, String smsCode) {
        if (Argument.isNotPositive(uId)) {
            return null;
        }
        MemberThinDO member = null;
        if (!memberCacheMap.isEmpty()) {
            member = memberCacheMap.get(uId);
            if (member != null) {
                member.setSmsCode(smsCode);
                member.setSmsSendTime(System.currentTimeMillis());
                return member;
            }
        }
        MemberDO memberDO = getMemberById(uId);
        if (memberDO != null) {
            memberCacheMap.put(uId, new MemberThinDO(memberDO));
            member = new MemberThinDO(memberDO);
            member.setSmsCode(smsCode);
            member.setSmsSendTime(System.currentTimeMillis());
        }
        return member;
    }

    @Override
    public MemberThinDO fetchMemberById(Long uId) {
        if (Argument.isNotPositive(uId)) {
            return null;
        }
        MemberThinDO member = null;
        if (!memberCacheMap.isEmpty()) {
            member = memberCacheMap.get(uId);
            if (member != null) {
                return member;
            }
        }
        MemberDO memberDO = getMemberById(uId);
        if (memberDO != null) {
            memberCacheMap.put(uId, new MemberThinDO(memberDO));
            member = new MemberThinDO(memberDO);
        }
        return member;
    }

    @Override
    public MemberThinDO fetchMemberByName(String name) {
        if (StringUtils.isEmpty(name)) {
            return null;
        }
        MemberThinDO member = null;
        if (!memberCacheMap.isEmpty()) {
            Collection<MemberThinDO> memberList = memberCacheMap.values();
            for (MemberThinDO memberThin : memberList) {
                if (StringUtils.equals(name, memberThin.getName())) {
                    return memberThin;
                }
            }
        }
        MemberDO memberDO = find(new MemberQuery(name));
        if (memberDO != null) {
            memberCacheMap.put(memberDO.getId(), new MemberThinDO(memberDO));
        }
        return member;
    }

    private void init() {
        logger.error("start init memberDO CacheMap!");
        memberCacheMap.clear();
        MemberQuery query = new MemberQuery();
        query.setPageSize(2000);
        query.setStatus(null);
        do {
            PaginationList<MemberDO> result = listPagination(query);
            if (result == null || result.isEmpty()) {
                break;
            }
            for (MemberDO member : result) {
                if (member != null && StringUtils.isNotBlank(member.getName())) {
                    Long uId = member.getId();
                    if (Argument.isNotPositive(uId)) {
                        continue;
                    }
                    if (!memberCacheMap.containsKey(uId)) {
                        memberCacheMap.put(uId, new MemberThinDO(member));
                    }
                }
            }
        } while (query.toNextPage());
        logger.error("init memberDO CacheMap finish!");
    }

    private void removeCache(Long uId) {
        if (Argument.isNotPositive(uId)) {
            return;
        }
        if (memberCacheMap.containsKey(uId)) {
            memberCacheMap.remove(uId);
        }
    }

    private void switchCache(Long uId) {
        if (Argument.isNotPositive(uId)) {
            return;
        }
        if (memberCacheMap.containsKey(uId)) {
            memberCacheMap.remove(uId);
            fetchMemberById(uId);
        }
    }

    private void joinCache(Long uId) {
        if (Argument.isNotPositive(uId)) {
            return;
        }
        if (!memberCacheMap.containsKey(uId)) {
            fetchMemberById(uId);
        }
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 用户表 MemberDO
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////
    @Override
    public Integer count(MemberQuery q) {
        if (q == null) {
            return 0;
        }
        return memberDao.count(q);
    }

    @Override
    public MemberDO find(MemberQuery q) {
        if (q == null) {
            return null;
        }
        return memberDao.find(q);
    }

    @Override
    public List<MemberDO> list(MemberQuery q) {
        if (q == null) {
            return Collections.<MemberDO> emptyList();
        }
        return memberDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<MemberDO> listPagination(MemberQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<MemberDO>) Collections.<MemberDO> emptyList();
        }
        return (PaginationList<MemberDO>) memberDao.paginationList(q, i);
    }

    @Override
    public MemberDO getMemberById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return memberDao.getById(id);
    }

    @Override
    public Long add(MemberDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = memberDao.insert(t);
        if (t.length == 1) {
            joinCache(t[0].getId());
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(MemberDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        boolean isSuccess = memberDao.updateById(t);
        if (isSuccess) {
            switchCache(t.getId());
        }
        return isSuccess;
    }

    @Override
    public boolean deleteMember(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        boolean isSuccess = update(new MemberDO(id, StatusEnum.DELETE));
        if (isSuccess) {
            switchCache(id);
        }
        return isSuccess;
    }

    @Override
    public boolean realDeleteMember(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        boolean isSuccess = memberDao.deleteById(id);
        if (isSuccess) {
            removeCache(id);
        }
        return isSuccess;
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 黑名单表 BlacklistDO
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////
    @Override
    public Integer count(BlacklistQuery q) {
        if (q == null) {
            return 0;
        }
        return blacklistDao.count(q);
    }

    @Override
    public BlacklistDO find(BlacklistQuery q) {
        if (q == null) {
            return null;
        }
        return blacklistDao.find(q);
    }

    @Override
    public List<BlacklistDO> list(BlacklistQuery q) {
        if (q == null) {
            return Collections.<BlacklistDO> emptyList();
        }
        return blacklistDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<BlacklistDO> listPagination(BlacklistQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<BlacklistDO>) Collections.<BlacklistDO> emptyList();
        }
        return (PaginationList<BlacklistDO>) blacklistDao.paginationList(q, i);
    }

    @Override
    public BlacklistDO getBlacklistById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return blacklistDao.getById(id);
    }

    @Override
    public Long add(BlacklistDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = blacklistDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(BlacklistDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return blacklistDao.updateById(t);
    }

    @Override
    public boolean deleteBlacklist(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new BlacklistDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteBlacklist(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return blacklistDao.deleteById(id);
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 收藏表 CollectDO
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<CollectFullDO> collectListPagination(CollectQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<CollectFullDO>) Collections.<CollectFullDO> emptyList();
        }
        return (PaginationList<CollectFullDO>) collectDao.paginationList(q, "collectCount", "collectListPagination", i);

    }

    @Override
    public Integer count(CollectQuery q) {
        if (q == null) {
            return 0;
        }
        return collectDao.count(q);
    }

    @Override
    public CollectDO find(CollectQuery q) {
        if (q == null) {
            return null;
        }
        return collectDao.find(q);
    }

    @Override
    public List<CollectDO> list(CollectQuery q) {
        if (q == null) {
            return Collections.<CollectDO> emptyList();
        }
        return collectDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<CollectDO> listPagination(CollectQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<CollectDO>) Collections.<CollectDO> emptyList();
        }
        return (PaginationList<CollectDO>) collectDao.paginationList(q, i);
    }

    @Override
    public CollectDO getCollectById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return collectDao.getById(id);
    }

    @Override
    public Long add(CollectDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = collectDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(CollectDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return collectDao.updateById(t);
    }

    @Override
    public boolean deleteCollect(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new CollectDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteCollect(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return collectDao.deleteById(id);
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 反馈表 (FeedbackDO)
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    @Override
    public Integer count(FeedbackQuery q) {
        if (q == null) {
            return 0;
        }
        return feedbackDao.count(q);
    }

    @Override
    public FeedbackDO find(FeedbackQuery q) {
        if (q == null) {
            return null;
        }
        return feedbackDao.find(q);
    }

    @Override
    public List<FeedbackDO> list(FeedbackQuery q) {
        if (q == null) {
            return Collections.<FeedbackDO> emptyList();
        }
        return feedbackDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<FeedbackDO> listPagination(FeedbackQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<FeedbackDO>) Collections.<FeedbackDO> emptyList();
        }
        return (PaginationList<FeedbackDO>) feedbackDao.paginationList(q, i);
    }

    @Override
    public FeedbackDO getFeedbackById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return feedbackDao.getById(id);
    }

    @Override
    public Long add(FeedbackDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = feedbackDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(FeedbackDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return feedbackDao.updateById(t);
    }

    @Override
    public boolean deleteFeedback(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new FeedbackDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteFeedback(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return feedbackDao.deleteById(id);
    }
}
