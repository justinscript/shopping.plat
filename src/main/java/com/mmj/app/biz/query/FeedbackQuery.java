/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.HandleStateEnum;
import com.mmj.app.biz.domain.FeedbackDO;

/**
 * @author zxc Dec 3, 2014 11:56:47 AM
 */
public class FeedbackQuery extends BaseQuery<FeedbackDO> {

    private String nameLike;

    public FeedbackQuery() {
        this(new FeedbackDO());
    }

    public FeedbackQuery(FeedbackDO t) {
        super(t);
    }

    public FeedbackQuery(Long uId) {
        entity.setUserId(uId);
    }

    public FeedbackQuery(Long userId, HandleStateEnum handleStateEnum) {
        entity.setUserId(userId);
        entity.setHandleState(handleStateEnum.getValue());
    }

    public String getNameLike() {
        return nameLike;
    }

    public void setNameLike(String nameLike) {
        this.nameLike = nameLike;
    }
}
