/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.dao;

import org.springframework.stereotype.Repository;

import com.mmj.app.biz.base.BaseDao;
import com.mmj.app.biz.domain.FeedbackDO;
import com.mmj.app.biz.mapper.FeedbackMapper;
import com.mmj.app.biz.query.FeedbackQuery;

/**
 * @author zxc Dec 3, 2014 12:09:55 PM
 */
@Repository
public class FeedbackDao extends BaseDao<FeedbackDO, FeedbackMapper, FeedbackQuery> {

}
