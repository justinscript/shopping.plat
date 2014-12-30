/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.dao;

import org.springframework.stereotype.Repository;

import com.mmj.app.biz.base.BaseDao;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.mapper.MemberMapper;
import com.mmj.app.biz.query.MemberQuery;

/**
 * @author zxc Nov 25, 2014 10:13:25 PM
 */
@Repository
public class MemberDao extends BaseDao<MemberDO, MemberMapper, MemberQuery> {

}
