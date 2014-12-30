/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.dao;

import org.springframework.stereotype.Repository;

import com.mmj.app.biz.base.BaseDao;
import com.mmj.app.biz.domain.NotificationDO;
import com.mmj.app.biz.mapper.NotificationMapper;
import com.mmj.app.biz.query.NotificationQuery;

/**
 * @author zxc Nov 25, 2014 10:14:52 PM
 */
@Repository
public class NotificationDao extends BaseDao<NotificationDO, NotificationMapper, NotificationQuery> {

}
