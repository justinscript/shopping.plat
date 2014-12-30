/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.domain.BlacklistDO;

/**
 * @author zxc Nov 25, 2014 10:19:02 PM
 */
public class BlacklistQuery extends BaseQuery<BlacklistDO> {

    public BlacklistQuery() {
        this(new BlacklistDO());
    }

    public BlacklistQuery(BlacklistDO t) {
        super(t);
    }

    public BlacklistQuery(Long userId, Long blackUserId) {
        entity.setUserId(userId);
        entity.setBlackUserId(blackUserId);
    }
}
