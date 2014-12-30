/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.tools;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.mmj.app.biz.cons.RightMenuEnum;
import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.cons.SubjectEnum;

/**
 * @author zxc Aug 7, 2014 1:09:55 PM
 */
public class EnumViewTools {

    private static List<RightMenuEnum> rightMenuEnumList;
    private static List<SubjectEnum>   subjectEnumList;

    public static List<RightMenuEnum> getAllRightMenu() {
        if (rightMenuEnumList == null) {
            rightMenuEnumList = new ArrayList<RightMenuEnum>();
            for (RightMenuEnum _enum : RightMenuEnum.values()) {
                rightMenuEnumList.add(_enum);
            }
            rightMenuEnumList = Collections.unmodifiableList(rightMenuEnumList);
        }
        return rightMenuEnumList;
    }

    public static List<SubjectEnum> getAllSubjectMenu() {
        if (subjectEnumList == null) {
            subjectEnumList = new ArrayList<SubjectEnum>();
            for (SubjectEnum _enum : SubjectEnum.values()) {
                subjectEnumList.add(_enum);
            }
            subjectEnumList = Collections.unmodifiableList(subjectEnumList);
        }
        return subjectEnumList;
    }

    public static List<SubjectEnum> getSubjectMenu() {
        if (subjectEnumList == null) {
            subjectEnumList = new ArrayList<SubjectEnum>();
            for (SubjectEnum _enum : SubjectEnum.values()) {
                if (_enum == SubjectEnum.ALL) {
                    continue;
                }
                subjectEnumList.add(_enum);
            }
            subjectEnumList = Collections.unmodifiableList(subjectEnumList);
        }
        return subjectEnumList;
    }

    public static String rightMenuEnumName(Integer v) {
        if (v == null) {
            return StringUtils.EMPTY;
        }
        return RightMenuEnum.getAction(v).getName();
    }

    public static String subjectEnumName(Integer v) {
        if (v == null) {
            return StringUtils.EMPTY;
        }
        return SubjectEnum.getEnum(v).getName();
    }

    public static Integer subjectEnumValue(String v) {
        if (StringUtils.isEmpty(v)) {
            return 1;
        }
        return SubjectEnum.getEnum(v).getValue();
    }

    public static String subjectEnumDesc(Integer v) {
        if (v == null) {
            return StringUtils.EMPTY;
        }
        return SubjectEnum.getEnum(v).getDesc();
    }

    public static String statusEnumDesc(Integer v) {
        if (v == null) {
            return StringUtils.EMPTY;
        }
        return StatusEnum.getAction(v).getDesc();
    }
}
