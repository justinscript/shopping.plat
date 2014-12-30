/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.lucene.search.build.fetcher;

import org.springframework.stereotype.Service;

import com.mmj.app.biz.cons.CollectTypeEnum;
import com.mmj.app.biz.cons.UserTypeEnum;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.query.CollectQuery;
import com.mmj.app.biz.query.CommentsQuery;
import com.mmj.app.biz.query.MemberQuery;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.biz.service.interfaces.CommentsService;
import com.mmj.app.biz.service.interfaces.TopicService;
import com.mmj.app.biz.service.interfaces.UserService;
import com.mmj.app.common.core.SpringContextAware;
import com.mmj.app.common.core.lang.BeanUtils;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.lucene.search.build.base.BaseFetcher;
import com.mmj.app.lucene.search.build.base.DataFetcher;
import com.mmj.app.lucene.search.build.base.Param;
import com.mmj.app.lucene.search.pojo.UserSearchField;
import com.mmj.app.lucene.solr.pojo.SearchField;

/**
 * @author zxc Dec 8, 2014 11:45:56 PM
 */
@Service
public class UserFetcher extends BaseFetcher<MemberQuery> {

    private UserService              userService;
    private TopicService             topicService;
    private CommentsService          commentsService;

    private static final UserFetcher instance = new UserFetcher();

    public static DataFetcher<?> create(Param param) {
        return param == null ? instance : new UserFetcher().setParam(param);
    }

    @Override
    protected MemberQuery createQuery() {
        MemberQuery memberQuery = new MemberQuery(UserTypeEnum.GENERAL);
        memberQuery.setStatus(null);
        return memberQuery;
    }

    @Override
    protected PaginationList<? extends SearchField> doFetch(MemberQuery q) {
        userService = (UserService) SpringContextAware.getBean("userServiceImpl");
        topicService = (TopicService) SpringContextAware.getBean("topicServiceImpl");
        commentsService = (CommentsService) SpringContextAware.getBean("commentsServiceImpl");

        PaginationList<MemberDO> list = userService.listPagination(q);
        PaginationList<UserSearchField> result = new PaginationList<UserSearchField>(q);

        Integer publishCount = 0;
        Integer likedCount = 0;
        Integer commentsCount = 0;
        for (MemberDO member : list) {
            UserSearchField userSearchField = new UserSearchField();
            BeanUtils.copyProperties(userSearchField, member);
            userSearchField.setGmtCreateLong(member.getGmtCreate().getTime());
            userSearchField.setGmtModifiedLong(member.getGmtModified().getTime());

            Long userId = member.getId();

            publishCount = topicService.count(new TopicQuery(userId));
            commentsCount = commentsService.count(new CommentsQuery(userId));
            likedCount = userService.count(new CollectQuery(userId, CollectTypeEnum.LIKED));
            userSearchField.setPublishCount(publishCount == null ? 0 : publishCount);
            userSearchField.setCommentsCount(commentsCount == null ? 0 : commentsCount);
            userSearchField.setLikedCount(likedCount == null ? 0 : likedCount);

            result.add(userSearchField);
        }
        return result;
    }
}
