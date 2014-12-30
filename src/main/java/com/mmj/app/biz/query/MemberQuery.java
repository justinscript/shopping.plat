/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.query;

import com.mmj.app.biz.base.BaseQuery;
import com.mmj.app.biz.cons.UserTypeEnum;
import com.mmj.app.biz.domain.MemberDO;

/**
 * @author zxc Nov 25, 2014 10:19:46 PM
 */
public class MemberQuery extends BaseQuery<MemberDO> {

    private String nameLike;

    public MemberQuery() {
        this(new MemberDO());
    }

    public MemberQuery(MemberDO t) {
        super(t);
    }

    public MemberQuery(String name) {
        entity.setName(name);
    }

    public MemberQuery(UserTypeEnum typeEnum) {
        entity.setUserType(typeEnum.getValue());
    }

    public MemberQuery(String name, String email) {
        entity.setName(name);
        entity.setEmail(email);
    }

    public MemberQuery(String name, String nick, String email) {
        entity.setName(name);
        entity.setNick(nick);
        entity.setEmail(email);
    }

    public MemberQuery(String name, String nick, String email, String phone) {
        entity.setName(name);
        entity.setNick(nick);
        entity.setEmail(email);
        entity.setMobile(phone);
    }

    public MemberQuery(String name, String passwd, UserTypeEnum type) {
        entity.setName(name);
        entity.setPassword(passwd);
        entity.setUserType(type.getValue());
    }

    public String getNameLike() {
        return nameLike;
    }

    public void setNameLike(String nameLike) {
        this.nameLike = nameLike;
    }
}
