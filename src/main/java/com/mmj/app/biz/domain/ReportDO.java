/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.HandleStateEnum;
import com.mmj.app.biz.cons.ReportTypeEnum;
import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.common.core.CustomToStringStyle;

/**
 * <pre>
 *     `USER_ID`           int(11)         COMMENT '用户id',
 *     `TOPIC_ID`          int(11)         COMMENT '文章id',
 *     `COMMENTS_ID`       int(11)         COMMENT '评论id',
 *     `NAME`              varchar(128)    COMMENT '用户名 昵称',
 *     `REPORT_TYPE`       int(2)          COMMENT '举报原因类型:1=爆粗口 2=广告、垃圾信息 3=淫秽色情 4=政治敏感话题 0=其它',
 *     `CONTENT`           varchar(1024)   COMMENT '举报内容详情',
 *     `HANDLE_STATE`      int(2)          COMMENT '处理状态 0=未处理,1=已经处理,2=停止',
 * </pre>
 * 
 * @author zxc Dec 3, 2014 11:30:37 AM
 */
public class ReportDO extends BaseDO {

    private static final long serialVersionUID = 4859166264891600631L;

    private Long              userId;                                 // 用户id
    private Long              topicId;                                // 文章id
    private Long              commentsId;                             // 评论id
    private String            name;                                   // 用户名

    private String            nick;                                   // 用户昵称

    private Integer           reportType;                             // 举报原因类型:1=爆粗口 2=广告、垃圾信息 3=淫秽色情 4=政治敏感话题 0=其它
    private String            content;                                // 举报内容详情

    private Integer           handleState;                            // 处理状态 0=未处理,1=已经处理,2=停止

    public ReportDO() {

    }

    public ReportDO(Long id, StatusEnum status) {
        super(id, status);
    }

    public ReportDO(Long id, HandleStateEnum handleState) {
        setId(id);
        setHandleState(handleState.getValue());
    }

    public ReportDO(Long userId, Long topicId, Long commentsId, String name) {
        this(userId, topicId, commentsId, name, ReportTypeEnum.QITA.getValue(), ReportTypeEnum.QITA.getDesc());
    }

    public ReportDO(Long userId, Long topicId, Long commentsId, String name, Integer reportType, String content) {
        setUserId(userId);
        setTopicId(topicId);
        setCommentsId(commentsId);
        setName(name);
        setReportType(reportType);
        setContent(content);
        setHandleState(HandleStateEnum.UNHANDLE.getValue());
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTopicId() {
        return topicId;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public Long getCommentsId() {
        return commentsId;
    }

    public void setCommentsId(Long commentsId) {
        this.commentsId = commentsId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getReportTypeDesc() {
        return ReportTypeEnum.getEnum(reportType).getDesc();
    }

    public Integer getReportType() {
        return reportType;
    }

    public void setReportType(Integer reportType) {
        this.reportType = reportType;
    }

    public String getHandleStateDesc() {
        return HandleStateEnum.getEnum(handleState).getDesc();
    }

    public Integer getHandleState() {
        return handleState;
    }

    public void setHandleState(Integer handleState) {
        this.handleState = handleState;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
