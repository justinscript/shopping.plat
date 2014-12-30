/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.UnReadEnum;
import com.mmj.app.biz.domain.LetterDO;

/**
 * @author zxc Nov 25, 2014 10:19:36 PM
 */
public class LetterQuery extends BaseQuery<LetterDO> {

    private Long relationDialogId; // 私信关联的会话ID,是发送人用户ID或者接收人用户ID

    public LetterQuery() {
        this(new LetterDO());
    }

    public LetterQuery(LetterDO t) {
        super(t);
    }

    public LetterQuery(Long uId) {
        entity.setUserId(uId);
    }

    public LetterQuery(Long uId, UnReadEnum unRead) {
        entity.setUserId(uId);
        entity.setUnRead(unRead.getValue());
    }

    public LetterQuery(UnReadEnum unRead, Long recipientUserId) {
        entity.setRecipientUserId(recipientUserId);
        entity.setUnRead(unRead.getValue());
    }

    public Long getRelationDialogId() {
        return relationDialogId;
    }

    public void setRelationDialogId(Long relationDialogId) {
        this.relationDialogId = relationDialogId;
    }
}
