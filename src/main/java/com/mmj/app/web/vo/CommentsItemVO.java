/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.web.vo;

import java.util.List;

import org.apache.commons.lang.StringUtils;

import com.mmj.app.biz.domain.CommentsDO;
import com.mmj.app.biz.domain.CommentsFullDO;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.util.DateViewTools;
import com.mmj.app.common.util.NumberParser;
import com.mmj.app.web.tools.PicTools;
import com.mmj.app.web.tools.WebUserTools;

/**
 * <pre>
 *                {
 *                     "action": 0, 
 *                     "assentText": "", 
 *                     "childs": [
 *                         {
 *                             "action": 0, 
 *                             "assentText": "", 
 *                             "closeIp": false, 
 *                             "commentTime": "30分钟前", 
 *                             "content": "缸它！", 
 *                             "createTime": 1417148360869000, 
 *                             "depth": 1, 
 *                             "downs": 0, 
 *                             "id": 6898705, 
 *                             "ip": "36.45.244.49", 
 *                             "isBan": false, 
 *                             "isVote": 0, 
 *                             "jid": "13759995495", 
 *                             "linkId": 6536443, 
 *                             "linksTitle": "【视频：梅西内马尔对飙颠球】在巴萨全队获赠奥迪轿车的仪式上，梅西和内马尔对飙点球，看看谁在一分钟之内颠球次数最多。梅西小赢。", 
 *                             "nick": "洋葱", 
 *                             "nickImgUrl": "http://img1.chouti.com/group7/M03/B4/2B/wKgCFlPqDOzj9rkUAAAZaBO293Q629=37x37.jpg", 
 *                             "parent": {
 *                                 "assentText": "", 
 *                                 "id": 6898638, 
 *                                 "isVote": 0
 *                             }, 
 *                             "phoneBan": false, 
 *                             "score": 0.3790176, 
 *                             "source": "6ab02e01b94cf80c96d2bf9a70dd5bd7", 
 *                             "sourceAppUrl": "http://dig.chouti.com/download/model/andorid", 
 *                             "sourceType": 2, 
 *                             "ups": 1
 *                         }
 *                     ],
 *                     "closeIp": false, 
 *                     "commentTime": "小于1分钟前", 
 *                     "content": "图钉主义，完全是独裁！", 
 *                     "createTime": 1417148436111000, 
 *                     "deleteInfo": "2B用户隐私",
 *                     "depth": 0, 
 *                     "downs": 0, 
 *                     "id": 6898717, 
 *                     "ip": "223.9.124.131", 
 *                     "isBan": false, 
 *                     "isVote": 0, 
 *                     "jid": "udbojvnv", 
 *                     "linkId": 6536652, 
 *                     "linksTitle": "如果用一个主义来形容买买君，你选择什么？", 
 *                     "nick": "群众演员101号", 
 *                     "nickImgUrl": "http://img1.chouti.com/group7/M02/4F/EC/wKgCFlNFMsu-Xh1_AAAgp9hAr2I544=37x37.jpg", 
 *                     "phoneBan": false, 
 *                     "phoneNum": "+8613700523670", 
 *                     "score": 0.54969215, 
 *                     "source": "c40fe2f61bcfd611177be71ec305196b", 
 *                     "sourceAppUrl": "http://dig.chouti.com/download/model/iphone", 
 *                     "sourceType": 1, 
 *                     "ups": 2
 *                 }
 * </pre>
 * 
 * @author zxc Nov 28, 2014 12:45:11 PM
 */
public class CommentsItemVO {

    private String               jid;
    private String               nick;
    private String               nickImgUrl;
    private boolean              phoneBan;
    private String               phoneNum;

    private Integer              isVote;      // 当前用户是否能投票(是否可以投票 0=可以,1=不可以)

    private Integer              items;

    private Long                 id;
    private Integer              action;
    private String               assentText;
    private boolean              closeIp;
    private String               commentTime;
    private String               content;
    private Long                 createTime;
    private Integer              depth;
    private Integer              downs;
    private Integer              ups;
    private String               ip;
    private boolean              isBan;
    private String               score;
    private String               source;
    private String               sourceAppUrl;
    private String               sourceType;
    private String               deleteInfo;

    private Long                 linkId;
    private String               linksTitle;

    private List<CommentsItemVO> childs;
    private CommentsParentVO     parent;

    public CommentsItemVO() {

    }

    public CommentsItemVO(CommentsFullDO full, CommentsDO parentComments) {
        this(full, parentComments, null);
    }

    // http://img1.chouti.com/group10/M03/C4/3D/wKgCNlSKyDKZPPhZAAAmivdKdOo698=37x37.jpg
    public CommentsItemVO(CommentsFullDO full, CommentsDO parentComments, List<Long> voteList) {
        setJid(full.getName());
        setNick(full.getNick());
        setNickImgUrl(StringUtils.isEmpty(full.getNickImgurl()) ? "/images/image30.png" : PicTools.processURL(full.getNickImgurl(),
                                                                                                              "=37x37"));
        setPhoneBan(false);
        setPhoneNum("");

        setId(full.getId());
        setAction(0);
        setAssentText("");
        setCloseIp(false);
        setCommentTime(DateViewTools.getDifferDayHourMin(full.getGmtCreate()));
        setContent(full.getContent());
        setCreateTime(full.getGmtCreate().getTime());
        setDowns(full.getDowns());
        setUps(full.getUps());
        setIp("");
        setBan(false);
        setLinkId(full.getTopicId());
        setLinksTitle(full.getTitle());
        setIsVote(0);

        if (parentComments != null) {
            CommentsParentVO parentVO = new CommentsParentVO(parentComments.getId(), "", 0);
            if (NumberParser.isEqual(WebUserTools.getUid(), parentComments.getUserId())) {
                setIsVote(1);
            } else {
                if (!Argument.isEmpty(voteList) && voteList.contains(parentComments.getId())) {
                    setIsVote(1);
                }
            }
            setParent(parentVO);
            setDepth(1 + parentComments.getDepth());
        } else {
            setDepth(0);
        }
        if (NumberParser.isEqual(WebUserTools.getUid(), full.getUserId())) {
            setIsVote(1);
        } else {
            if (!Argument.isEmpty(voteList) && voteList.contains(full.getId())) {
                setIsVote(1);
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getAction() {
        return action;
    }

    public void setAction(Integer action) {
        this.action = action;
    }

    public String getAssentText() {
        return assentText;
    }

    public void setAssentText(String assentText) {
        this.assentText = assentText;
    }

    public boolean isCloseIp() {
        return closeIp;
    }

    public void setCloseIp(boolean closeIp) {
        this.closeIp = closeIp;
    }

    public String getCommentTime() {
        return commentTime;
    }

    public void setCommentTime(String commentTime) {
        this.commentTime = commentTime;
    }

    public String getContent() {
        return content;
    }

    public Integer getItems() {
        return items;
    }

    public void setItems(Integer items) {
        this.items = items;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }

    public Integer getDepth() {
        return depth;
    }

    public void setDepth(Integer depth) {
        this.depth = depth;
    }

    public Integer getDowns() {
        return downs;
    }

    public void setDowns(Integer downs) {
        this.downs = downs;
    }

    public Integer getUps() {
        return ups;
    }

    public void setUps(Integer ups) {
        this.ups = ups;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public Integer getIsVote() {
        return isVote;
    }

    public boolean isBan() {
        return isBan;
    }

    public void setBan(boolean isBan) {
        this.isBan = isBan;
    }

    public void setIsVote(Integer isVote) {
        this.isVote = isVote;
    }

    public String getJid() {
        return jid;
    }

    public void setJid(String jid) {
        this.jid = jid;
    }

    public Long getLinkId() {
        return linkId;
    }

    public void setLinkId(Long linkId) {
        this.linkId = linkId;
    }

    public String getLinksTitle() {
        return linksTitle;
    }

    public void setLinksTitle(String linksTitle) {
        this.linksTitle = linksTitle;
    }

    public String getNick() {
        return nick;
    }

    public void setNick(String nick) {
        this.nick = nick;
    }

    public String getNickImgUrl() {
        return nickImgUrl;
    }

    public void setNickImgUrl(String nickImgUrl) {
        this.nickImgUrl = nickImgUrl;
    }

    public boolean isPhoneBan() {
        return phoneBan;
    }

    public void setPhoneBan(boolean phoneBan) {
        this.phoneBan = phoneBan;
    }

    public String getPhoneNum() {
        return phoneNum;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public String getScore() {
        return score;
    }

    public void setScore(String score) {
        this.score = score;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getSourceAppUrl() {
        return sourceAppUrl;
    }

    public void setSourceAppUrl(String sourceAppUrl) {
        this.sourceAppUrl = sourceAppUrl;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public String getDeleteInfo() {
        return deleteInfo;
    }

    public void setDeleteInfo(String deleteInfo) {
        this.deleteInfo = deleteInfo;
    }

    public List<CommentsItemVO> getChilds() {
        return childs;
    }

    public void setChilds(List<CommentsItemVO> childs) {
        this.childs = childs;
    }

    public CommentsParentVO getParent() {
        return parent;
    }

    public void setParent(CommentsParentVO parent) {
        this.parent = parent;
    }
}
