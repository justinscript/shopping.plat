/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.mapper;

import java.util.List;

import com.mmj.app.biz.base.BaseMapper;
import com.mmj.app.biz.domain.CommentsDO;
import com.mmj.app.biz.domain.CommentsFullDO;
import com.mmj.app.biz.query.CommentsQuery;

/**
 * @author zxc Nov 25, 2014 10:17:25 PM
 */
public interface CommentsMapper extends BaseMapper<CommentsDO, CommentsQuery> {

    public List<CommentsFullDO> commentsListPagination(CommentsQuery q);

    public Integer commentsCount(CommentsQuery q);
}
