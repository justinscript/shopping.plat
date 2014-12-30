/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.UnReadEnum;
import com.mmj.app.biz.domain.NotificationDO;

/**
 * @author zxc Nov 25, 2014 10:19:58 PM
 */
public class NotificationQuery extends BaseQuery<NotificationDO> {

    public NotificationQuery() {
        this(new NotificationDO());
    }

    public NotificationQuery(NotificationDO t) {
        super(t);
    }

    public NotificationQuery(Long uId) {
        entity.setUserId(uId);
    }

    public NotificationQuery(Long uId, UnReadEnum unRead) {
        entity.setUserId(uId);
        entity.setUnRead(unRead.getValue());
    }
}
