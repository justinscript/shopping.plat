/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service.interfaces;

import java.util.Date;
import java.util.List;

import com.mmj.app.biz.base.BaseService;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.TopicQuery;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * 文章,图片,链接的发布,服务层接口
 * 
 * @author zxc Nov 25, 2014 10:21:09 PM
 */
public interface TopicService extends BaseService {

    Date getLastPublishTime(Long uId);

    Integer refreshcount(Long id);

    Integer getMaxId(TopicQuery q);

    // ////////////////////////////////////////////////////////////////////////////////////////////
    Integer count(TopicQuery q);

    TopicDO find(TopicQuery q);

    List<TopicDO> list(TopicQuery q);

    PaginationList<TopicDO> listPagination(TopicQuery q, IPageUrl... i);

    TopicDO getTopicById(Long id);

    Long add(TopicDO... t);

    boolean update(TopicDO t);

    boolean deleteTopic(Long id);

    boolean realDeleteTopic(Long id);
}
