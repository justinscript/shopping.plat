/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.CollectTypeEnum;
import com.mmj.app.biz.domain.CollectDO;

/**
 * @author zxc Nov 25, 2014 10:19:14 PM
 */
public class CollectQuery extends BaseQuery<CollectDO> {

    public CollectQuery() {
        this(new CollectDO());
    }

    public CollectQuery(CollectDO t) {
        super(t);
    }

    public CollectQuery(Long userId) {
        entity.setUserId(userId);
    }

    public CollectQuery(Long userId, CollectTypeEnum collectType) {
        entity.setUserId(userId);
        if (collectType != null) {
            entity.setCollectType(collectType.getValue());
        }
    }

    public CollectQuery(Long userId, Long topicId) {
        entity.setUserId(userId);
        entity.setTopicId(topicId);
    }

    public CollectQuery(Long userId, Long topicId, CollectTypeEnum collectType) {
        entity.setUserId(userId);
        entity.setTopicId(topicId);
        if (collectType != null) {
            entity.setCollectType(collectType.getValue());
        }
    }
}
