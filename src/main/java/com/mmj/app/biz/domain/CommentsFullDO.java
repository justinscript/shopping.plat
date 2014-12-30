/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.SubjectEnum;
import com.mmj.app.common.core.CustomToStringStyle;

/**
 * @author zxc Dec 3, 2014 2:31:49 PM
 */
public class CommentsFullDO extends CommentsDO {

    private static final long serialVersionUID = 4897428848606550741L;

    private Integer           topicStatus;                            // 记录状态: 0=正常,1=删除
    private String            title;                                  // 标题
    private String            contentSource;                          // 内容来源
    private Integer           contentKind;                            // 文章类型种类
    private String            publishSource;                          // 发布来源
    private Integer           subjectId;                              // subject Id(买买买subjectId=1;
                                                                       // 海淘转让区subjectId=2; 发现subjectId=4;
                                                                       // 问答社subjectId=100; 五元团subjectId=151)

    public Integer getTopicStatus() {
        return topicStatus;
    }

    public void setTopicStatus(Integer topicStatus) {
        this.topicStatus = topicStatus;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContentSource() {
        return contentSource;
    }

    public void setContentSource(String contentSource) {
        this.contentSource = contentSource;
    }

    public Integer getContentKind() {
        return contentKind;
    }

    public void setContentKind(Integer contentKind) {
        this.contentKind = contentKind;
    }

    public String getPublishSource() {
        return publishSource;
    }

    public void setPublishSource(String publishSource) {
        this.publishSource = publishSource;
    }

    public Integer getSubjectId() {
        return subjectId;
    }

    public String getSubjectStr() {
        return SubjectEnum.getEnum(subjectId).getDesc();
    }

    public void setSubjectId(Integer subjectId) {
        this.subjectId = subjectId;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
