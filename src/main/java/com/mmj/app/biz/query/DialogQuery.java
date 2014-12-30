/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.domain.DialogDO;

/**
 * @author zxc Dec 4, 2014 3:25:46 PM
 */
public class DialogQuery extends BaseQuery<DialogDO> {

    public DialogQuery() {
        this(new DialogDO());
    }

    public DialogQuery(DialogDO t) {
        super(t);
    }

    public DialogQuery(Long uId) {
        entity.setSenderUserId(uId);
    }

    public DialogQuery(Long senderId, Long recipientId) {
        entity.setSenderUserId(senderId);
        entity.setRecipientUserId(recipientId);
    }
}
