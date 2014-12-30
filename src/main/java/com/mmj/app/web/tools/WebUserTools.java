/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.tools;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import com.mmj.app.biz.cons.StateEnum;
import com.mmj.app.biz.domain.MemberThinDO;
import com.mmj.app.biz.service.interfaces.UserService;
import com.mmj.app.common.util.DateViewTools;
import com.mmj.app.web.webuser.MMJWebUser;

/**
 * @author zxc Nov 27, 2014 12:41:04 PM
 */
public class WebUserTools {

    @Autowired
    private UserService userService;

    public static MMJWebUser current() {
        return MMJWebUser.getCurrentUser();
    }

    public static Long getUid() {
        return current() == null ? null : current().getuId();
    }

    public static String getName() {
        return current() == null ? null : current().getName();
    }

    public static String getPasswd() {
        return current() == null ? null : current().getPasswd();
    }

    public static String getNick() {
        return current() == null ? null : current().getNick();
    }

    public String getNick(Object obj) {
        if (obj == null) {
            return "";
        }
        MemberThinDO member = null;
        if (obj instanceof String) {
            member = userService.fetchMemberByName((String) obj);
        }
        if (obj instanceof Long) {
            member = userService.fetchMemberById((Long) obj);
        }
        return member == null ? null : member.getNick();
    }

    public static String getImg() {
        return current() == null ? null : StringUtils.isEmpty(current().getImg()) ? "/images/image30.png" : current().getImg();
    }

    public String getImg(Object obj) {
        if (obj == null) {
            return "";
        }
        MemberThinDO member = null;
        if (obj instanceof String) {
            member = userService.fetchMemberByName((String) obj);
        }
        if (obj instanceof Long) {
            member = userService.fetchMemberById((Long) obj);
        }
        return member == null ? null : StringUtils.isEmpty(member.getPic()) ? "/images/image30.png" : member.getPic();
    }

    public static String getPhone() {
        return current() == null ? null : StringUtils.isEmpty(current().getMobile()) ? "" : current().getMobile();
    }

    public static boolean getIsBan() {
        return current() == null ? false : !current().getIsBan().isTrue();
    }

    public static StateEnum getIsState() {
        return current() == null ? StateEnum.NORMAL : current().getState();
    }

    public static Integer getBanStatus() {
        return current() == null ? 1 : current().getIsBan().getValue();
    }

    public static String getLastLogin() {
        return current() == null ? null : DateViewTools.format(current().getLastLogin(), "yyyy-MM-dd HH:mm");
    }

    public static boolean hasLogin() {
        return current() == null ? false : current().hasLogin();
    }

    @Override
    public String toString() {
        return current() == null ? StringUtils.EMPTY : current().toString();
    }
}
