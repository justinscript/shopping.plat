/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.vo;

/**
 * <pre>
 *         "parent": {
 *             "assentText": "", 
 *             "id": 6898638, 
 *             "isVote": 0
 *         },
 * </pre>
 * 
 * @author zxc Nov 28, 2014 1:00:39 PM
 */
public class CommentsParentVO {

    private Long    id;
    private String  assentText;
    private Integer isVote;

    public CommentsParentVO() {

    }

    public CommentsParentVO(Long id, String assentText) {
        setId(id);
        setAssentText(assentText);
    }

    public CommentsParentVO(Long id, String assentText, Integer isVote) {
        setId(id);
        setAssentText(assentText);
        setIsVote(isVote);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssentText() {
        return assentText;
    }

    public void setAssentText(String assentText) {
        this.assentText = assentText;
    }

    public Integer getIsVote() {
        return isVote;
    }

    public void setIsVote(Integer isVote) {
        this.isVote = isVote;
    }
}
