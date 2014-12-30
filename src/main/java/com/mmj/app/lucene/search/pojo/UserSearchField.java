/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.lucene.search.pojo;

import java.io.Serializable;
import java.util.Date;

import org.apache.solr.client.solrj.beans.Field;

import com.mmj.app.lucene.solr.pojo.SearchField;

/**
 * <pre>
 *     <div class="item">
 *         <div class="search-itme-a">
 *             <a href="/user/wwl526/submitted/1" target="_blank">
 *                 <img src="http://img1.chouti.com/group1/M00/03/C0/wKgCD0v5ITIAAAAAAACw5ztcbD8439=48x48.jpg" width="48" height="48" class="p-img">
 *             </a>
 *             <div class="p-box">
 *                 <div class="name"><a href="/user/wwl526/submitted/1" target="_blank"><em class="highlight">T</em></a></div>
 *                 <div class="events">发布：<span>5</span>推荐：<span>1</span>评论：<span>0</span></div>
 *             </div>
 *         </div>
 *     </div>
 * </pre>
 * 
 * @author zxc Dec 8, 2014 11:45:08 PM
 */
public class UserSearchField implements SearchField, Serializable {

    private static final long serialVersionUID = -3220041280585652523L;

    @Field("memberId")
    private Long              id;                                      // 主键
    @Field("memberGmtCreate")
    private Long              gmtCreateLong;                           // 创建时间
    @Field("memberGmtModified")
    private Long              gmtModifiedLong;                         // 修改时间
    @Field("memberStatus")
    private Integer           status;                                  // 记录状态: 0=正常,1=删除

    @Field
    private String            name;                                    // 用户名
    @Field
    private String            pic;                                     // 头像
    @Field
    private String            nick;                                    // 昵称

    @Field
    private Integer           publishCount;                            // 发布数量
    @Field
    private Integer           likedCount;                              // 推荐数量
    @Field
    private Integer           commentsCount;                           // 评论数量

    @Field
    private Integer           userState;                               // 状态: 0=未审核,1=正常,2=停止

    public Integer getUserState() {
        return userState;
    }

    public void setUserState(Integer userState) {
        this.userState = userState;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPic() {
        return pic;
    }

    public void setPic(String pic) {
        this.pic = pic;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public Integer getPublishCount() {
        return publishCount;
    }

    public void setPublishCount(Integer publishCount) {
        this.publishCount = publishCount;
    }

    public Integer getLikedCount() {
        return likedCount;
    }

    public void setLikedCount(Integer likedCount) {
        this.likedCount = likedCount;
    }

    public Integer getCommentsCount() {
        return commentsCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getGmtCreate() {
        return new Date(gmtCreateLong);
    }

    public Long getGmtCreateLong() {
        return gmtCreateLong;
    }

    public void setGmtCreateLong(Long gmtCreateLong) {
        this.gmtCreateLong = gmtCreateLong;
    }

    public Date getGmtModified() {
        return new Date(gmtModifiedLong);
    }

    public Long getGmtModifiedLong() {
        return gmtModifiedLong;
    }

    public void setGmtModifiedLong(Long gmtModifiedLong) {
        this.gmtModifiedLong = gmtModifiedLong;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public void setCommentsCount(Integer commentsCount) {
        this.commentsCount = commentsCount;
    }
}
