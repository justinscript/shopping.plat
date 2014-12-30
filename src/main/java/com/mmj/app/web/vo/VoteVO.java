/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.vo;

import com.mmj.app.biz.domain.TopicDO;

/**
 * 推荐VO
 * 
 * <pre>
 *      "data":{"jid":"zxc337","likedTime":"1417416515577000","lvCount":"53","nick":"zxc338","uvCount":"2","voteTime":"小于1分钟前"}
 *      "data":{"jid":"zxc337","unlikedTime":"1417416763883000","lvCount":"160","nick":"zxc338","uvCount":"0","voteTime":"小于1分钟前"}
 * </pre>
 * 
 * @author zxc Dec 1, 2014 3:11:52 PM
 */
public class VoteVO {

    private String jid;
    private String likedTime;
    private String unlikedTime;
    private String lvCount;    // 文章推荐数量
    private String uvCount;    // 我的推荐数量
    private String voteTime;
    private String nick;

    public VoteVO(boolean isLike, String jid, String nick, TopicDO topic, Integer uvCount) {
        setJid(jid);
        setNick(nick);
        if (isLike) {
            setLikedTime(System.currentTimeMillis() + "");
        } else {
            setUnlikedTime(System.currentTimeMillis() + "");
        }
        setVoteTime("小于1分钟前");
        setLvCount(topic.getRecommend());
        setUvCount(uvCount);
    }

    public String getJid() {
        return jid;
    }

    public void setJid(String jid) {
        this.jid = jid;
    }

    public String getLikedTime() {
        return likedTime;
    }

    public void setLikedTime(String likedTime) {
        this.likedTime = likedTime;
    }

    public String getUnlikedTime() {
        return unlikedTime;
    }

    public void setUnlikedTime(String unlikedTime) {
        this.unlikedTime = unlikedTime;
    }

    public String getLvCount() {
        return lvCount;
    }

    public void setLvCount(String lvCount) {
        this.lvCount = lvCount;
    }

    public void setLvCount(Integer lvCount) {
        this.lvCount = (lvCount == null ? 0 : lvCount) + "";
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getUvCount() {
        return uvCount;
    }

    public void setUvCount(String uvCount) {
        this.uvCount = uvCount;
    }

    public void setUvCount(Integer uvCount) {
        this.uvCount = (uvCount == null ? 0 : uvCount) + "";
    }

    public String getVoteTime() {
        return voteTime;
    }

    public void setVoteTime(String voteTime) {
        this.voteTime = voteTime;
    }
}
