/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.mapper;

import com.mmj.app.biz.base.BaseMapper;
import com.mmj.app.biz.domain.TopicDO;
import com.mmj.app.biz.query.TopicQuery;

/**
 * @author zxc Nov 25, 2014 10:18:32 PM
 */
public interface TopicMapper extends BaseMapper<TopicDO, TopicQuery> {

    public TopicDO getLastPublishTime(Long uId);

    public Integer refreshcount(TopicQuery q);

    public Integer getMaxId(TopicQuery q);
}
