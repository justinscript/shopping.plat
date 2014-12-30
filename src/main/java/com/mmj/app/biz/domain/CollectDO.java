/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.domain;

import org.apache.commons.lang.builder.ToStringBuilder;

import com.mmj.app.biz.cons.CollectTypeEnum;
import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.common.core.CustomToStringStyle;

/**
 * <pre>
 * -- 收藏
 * CREATE TABLE collect (
 *     `ID`            INT(11)     NOT NULL AUTO_INCREMENT,
 *     `GMT_CREATE`    DATETIME    NOT NULL,
 *     `GMT_MODIFIED`  DATETIME    NOT NULL,
 *     `STATUS`        INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',
 * 
 *     `TOPIC_ID`      int(11)         COMMENT '文章id',
 *     `USER_ID`       int(11)         COMMENT '用户id',
 *     `COLLECT_TYPE`  int(2)          COMMENT '收藏类型:1=私藏,2=推荐',
 *     PRIMARY KEY  (`ID`)
 * )ENGINE=InnoDB DEFAULT CHARSET=utf8;
 * </pre>
 * 
 * @author zxc Nov 25, 2014 9:19:55 PM
 */
public class CollectDO extends BaseDO {

    private static final long serialVersionUID = 4659309209814001386L;

    private Long              userId;                                 // 用户id
    private Long              topicId;                                // 文章id
    private Integer           collectType;                            // 收藏类型:1=私藏,2=推荐

    private String            name;                                   // 昵称

    public CollectDO() {

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public CollectDO(Long userId) {
        setUserId(userId);
    }

    public CollectDO(Long userId, Integer collectType) {
        setUserId(userId);
        setCollectType(collectType);
    }

    public CollectDO(Long userId, Long topicId) {
        setUserId(userId);
        setTopicId(topicId);
    }

    public CollectDO(Long userId, Long topicId, CollectTypeEnum collectType) {
        setUserId(userId);
        setTopicId(topicId);
        if (collectType != null) {
            setCollectType(collectType.getValue());
        }
    }

    public CollectDO(Long id, StatusEnum status) {
        super(id, status);
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

    public Integer getCollectType() {
        return collectType;
    }

    public void setCollectType(Integer collectType) {
        this.collectType = collectType;
    }

    @Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, new CustomToStringStyle());
    }
}
