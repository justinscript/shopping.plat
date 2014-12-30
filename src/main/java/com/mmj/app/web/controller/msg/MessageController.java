/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.msg;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mmj.app.biz.cons.BooleanEnum;
import com.mmj.app.biz.cons.UnReadEnum;
import com.mmj.app.biz.domain.BlacklistDO;
import com.mmj.app.biz.domain.DialogDO;
import com.mmj.app.biz.domain.DialogFullDO;
import com.mmj.app.biz.domain.LetterDO;
import com.mmj.app.biz.domain.MemberDO;
import com.mmj.app.biz.domain.NotificationDO;
import com.mmj.app.biz.query.BlacklistQuery;
import com.mmj.app.biz.query.DialogQuery;
import com.mmj.app.biz.query.LetterQuery;
import com.mmj.app.biz.query.MemberQuery;
import com.mmj.app.biz.query.NotificationQuery;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.core.lang.CollectionUtils;
import com.mmj.app.web.controller.BaseController;
import com.mmj.app.web.tools.WebUserTools;
import com.mmj.app.web.vo.DialogFullVO;
import com.mmj.app.web.vo.DialogLetterVO;
import com.mmj.app.web.vo.LetterResposeVO;
import com.mmj.app.web.vo.NotificationVO;

/**
 * 私信 通知
 * 
 * @author zxc Dec 4, 2014 12:28:11 AM
 */
@Controller
public class MessageController extends BaseController {

    // /message/topShow 显示通知摘要信息
    // {"result":{"code":"9999", "message":"", "data":{"items":0}}}
    /**
     * <pre>
     * {
     *     "result": {
     *         "code": "9999", 
     *         "message": "", 
     *         "data": {
     *             "items": 1, 
     *             "data": [
     *                 {
     *                     "action": 2, 
     *                     "actiontime": 1419391969333000, 
     *                     "content": "laolunshi评论了你发布的<a href=\"/link/6527455/comments/7089236\">\"徐神的诗 | Jeck_Zhang\"</a>", 
     *                     "createTime": "11:32", 
     *                     "createtime": 1419391969333000, 
     *                     "destjid": "zxc337", 
     *                     "fromjid": "laolunshi", 
     *                     "id": 3900450, 
     *                     "ids": "3900450", 
     *                     "isRead": false, 
     *                     "linksId": 6527455, 
     *                     "messageId": 2, 
     *                     "title": "<a href=\"/user/laolunshi\"  class=\"a-jid\" target=\"_blank\">laolunshi</a> 评论了<a href=\"/link/6527455/comments/7089236\" target=\"_blank\" class=\"f-href\">"徐神的诗 | Jeck_Zhang"</a><span class=\"f-time\" id=\"f-time-3900450\">11:32</span>"
     *                 }
     *             ]
     *         }
     *     }
     * }
     * </pre>
     * 
     * @return
     */
    @RequestMapping(value = "/message/topShow")
    public ModelAndView topShow() {
        List<NotificationDO> list = letterService.list(new NotificationQuery(WebUserTools.getUid()));
        Map<String, Object> map = new HashMap<String, Object>();
        if (list == null || list.size() == 0) {
            map.put("items", 0);
            return createJsonMav("9999", "", map);
        }
        initUserInfo4List(list);

        List<NotificationVO> result = new ArrayList<NotificationVO>();
        for (NotificationDO notification : list) {
            result.add(new NotificationVO(notification));
        }

        map.put("data", result);
        map.put("items", result.size());
        return createJsonMav("9999", "", map);
    }

    // /message/read?isAll=true 标记所有通知已读
    // {"result":{"code":"9999", "message":"已标记为已读", "data":0}}
    // /message/read?id=3900568
    @RequestMapping(value = "/message/read")
    public ModelAndView readNotice(String isAll, String id) {
        if (StringUtils.isEmpty(isAll) && StringUtils.isEmpty(id)) {
            return createJsonMav("9998", "标记失败,请稍候再试", 0);
        }
        if (StringUtils.equalsIgnoreCase("true", isAll)) {
            List<NotificationDO> list = letterService.list(new NotificationQuery(WebUserTools.getUid(),
                                                                                 UnReadEnum.UN_READ));
            for (NotificationDO notification : list) {
                letterService.update(new NotificationDO(notification.getId(), 0));
            }
            return createJsonMav("9999", "已标记为已读", 0);
        }

        try {
            if (id.contains(",")) {
                String[] ids = StringUtils.split(id, ",");
                for (String _id : ids) {
                    Long _id_ = new Long(_id);
                    if (!Argument.isNotPositive(_id_)) {
                        NotificationDO notificationById = letterService.getNotificationById(_id_);
                        if (notificationById == null) {
                            return createJsonMav("9998", "标记失败,请稍候再试", 0);
                        }
                        letterService.update(new NotificationDO(_id_, 0));
                    }
                }
            } else if (!Argument.isNotPositive(new Long(id))) {
                NotificationDO notificationById = letterService.getNotificationById(new Long(id));
                if (notificationById == null) {
                    return createJsonMav("9998", "标记失败,请稍候再试", 0);
                }
                letterService.update(new NotificationDO(new Long(id), 0));
            }
        } catch (Exception e) {
            return createJsonMav("9998", "标记失败,请稍候再试", 0);
        }

        return createJsonMav("9999", "已标记为已读", 0);
    }

    // /message/del?id=3900664,3900660 删除通知
    // {"result":{"code":"9999", "message":"已标记为已读", "data":0}}
    @RequestMapping(value = "/message/del")
    public ModelAndView delNotice(String id) {
        if (StringUtils.isEmpty(id)) {
            return createJsonMav("9998", "删除失败,请稍候再试", 0);
        }
        try {
            if (id.contains(",")) {
                String[] ids = StringUtils.split(id, ",");
                for (String _id : ids) {
                    if (!Argument.isNotPositive(new Long(_id))) {
                        letterService.deleteNotification(new Long(_id));
                    }
                }
            } else if (!Argument.isNotPositive(new Long(id))) {
                letterService.deleteNotification(new Long(id));
            }
        } catch (Exception e) {
            return createJsonMav("9998", "删除失败,请稍候再试", 0);
        }
        return createJsonMav("9999", "通知已经删除", 0);
    }

    // /letter/show/1/3928/1 查看会话,会话里面的所有私信
    @RequestMapping(value = { "/letter/show/1/{dialogId}", "/letter/show/1/{dialogId}/1" })
    public ModelAndView show(@PathVariable("dialogId")
    Long dialogId) {
        ModelAndView mav = new ModelAndView("/msg/show");
        DialogDO dialog = letterService.getDialogById(dialogId);
        if (dialog == null) {
            return mav;
        }
        initUserInfo4Base(dialog);

        LetterQuery query = new LetterQuery();
        query.setRelationDialogId(dialogId);
        List<DialogLetterVO> list = new LinkedList<DialogLetterVO>();
        List<LetterDO> letterList = letterService.list(query);
        for (LetterDO letter : letterList) {
            if (UnReadEnum.isUnRead(letter.getUnRead())) {
                letterService.update(new LetterDO(letter.getId(), UnReadEnum.READ));
            }
            list.add(new DialogLetterVO(dialog, letter));
        }
        mav.addObject("list", list);
        mav.addObject("dialog", dialog);
        return mav;
    }

    // /letter/add.do 向陌生人发私信,回复私信 otherJid:neva8987 content:我喜欢你
    // {"result":{"code":"9999", "message":"发送成功",
    // "data":{"action":0,"actionTime":1417286874069000,"content":"我喜欢你","createDate":"小于1分钟前","createTime":1417286874069000,
    // "groupId":3888,"id":5701,"jid":"zxc337","otherJid":"neva8987","state":1}}}
    // {"result":{"code":"10008", "message":"由于用户设置，暂时不能发送私信.", "data":""}}
    @RequestMapping(value = "/letter/add.do")
    public ModelAndView sendLetter(String otherJid, String content) {
        if (StringUtils.isEmpty(otherJid) || StringUtils.isEmpty(content)) {
            return createJsonMav("0000", "发送失败", "");
        }
        MemberDO member = userService.find(new MemberQuery(otherJid));
        if (member == null) {
            return createJsonMav("0000", "发送失败", "");
        }
        if (!BooleanEnum.getByValue(member.getLetterBan()).isTrue()) {
            return createJsonMav("10008", "由于用户设置，暂时不能发送私信.", "");
        }
        BlacklistDO blacklist = userService.find(new BlacklistQuery(member.getId(), WebUserTools.getUid()));
        if (blacklist != null) {
            return createJsonMav("10008", "由于用户设置(你被加入他的黑名单)，暂时不能发送私信.", "");
        }

        Long recipientUserId = member.getId();
        // 查找双方的会话,如果没有就创建
        DialogDO senderDialog = letterService.find(new DialogQuery(WebUserTools.getUid(), recipientUserId));
        if (senderDialog == null) {
            senderDialog = new DialogDO(WebUserTools.getUid(), WebUserTools.getName(), member.getId(), member.getName());
            letterService.add(senderDialog);
        }

        DialogDO recipientDialog = letterService.find(new DialogQuery(recipientUserId, WebUserTools.getUid()));
        if (recipientDialog == null) {
            recipientDialog = new DialogDO(member.getId(), member.getName(), WebUserTools.getUid(),
                                           WebUserTools.getName());
            letterService.add(recipientDialog);
        }

        LetterDO letter = new LetterDO(WebUserTools.getUid(), senderDialog.getId(), member.getId(),
                                       recipientDialog.getId(), content);
        letterService.add(letter);
        return createSuccJsonMav("发送成功", new LetterResposeVO(letter, senderDialog, recipientDialog));
    }

    // /letter/read.do?groupIds=3888 设置私信已读
    // {"result":{"code":"9999", "message":"标记成功", "data":""}}
    // {"result":{"code":"10008", "message":"参数有误", "data":""}}
    @RequestMapping(value = "/letter/read.do")
    public ModelAndView readLetter(Long... groupIds) {
        if (Argument.isEmptyArray(groupIds)) {
            return createJsonMav("10008", "参数有误", "");
        }
        for (Long groupId : groupIds) {
            DialogDO dialog = letterService.getDialogById(groupId);
            if (dialog == null) {
                return createJsonMav("10008", "参数有误", "");
            }
            LetterQuery query = new LetterQuery();
            query.setRelationDialogId(groupId);
            List<LetterDO> letterList = letterService.list(query);
            for (LetterDO letter : letterList) {
                if (UnReadEnum.isUnRead(letter.getUnRead())) {
                    letterService.update(new LetterDO(letter.getId(), UnReadEnum.READ));
                }
            }
        }
        return createJsonMav("9999", "标记成功", "");
    }

    // /letter/del/group.do 删除私信
    // {"result":{"code":"9999", "message":"删除成功", "data":""}}
    @RequestMapping(value = "/letter/del/group.do")
    public ModelAndView delLetter(Long... groupIds) {
        if (Argument.isEmptyArray(groupIds)) {
            return createJsonMav("10008", "参数有误", "");
        }
        for (Long groupId : groupIds) {
            DialogDO dialog = letterService.getDialogById(groupId);
            if (dialog == null) {
                return createJsonMav("10008", "参数有误", "");
            }
            letterService.deleteDialog(groupId);
        }
        return createJsonMav("9999", "删除成功", "");
    }

    // /letter 私信页面,我的私信
    @RequestMapping(value = "/letter")
    public ModelAndView letter() {
        ModelAndView mav = new ModelAndView("/msg/letter");

        List<DialogFullDO> dialogList = letterService.dialogList(new DialogQuery(WebUserTools.getUid()));
        initUserInfo4List(dialogList);

        List<DialogFullVO> list = new LinkedList<DialogFullVO>();
        Map<Long, List<DialogFullDO>> dialogListMap = CollectionUtils.toLongListMap(dialogList, "id");
        for (Entry<Long, List<DialogFullDO>> entry : dialogListMap.entrySet()) {
            List<DialogFullDO> fullList = entry.getValue();
            Collections.sort(fullList, new Comparator<DialogFullDO>() {

                @Override
                public int compare(DialogFullDO o1, DialogFullDO o2) {

                    if (o1.getGmtModified() == null) {
                        return -1;
                    }
                    if (o2.getGmtModified() == null) {
                        return 1;
                    }
                    return o2.getGmtModified().compareTo(o1.getGmtCreate());
                }
            });
            DialogFullDO fullDO = fullList.get(0);
            list.add(new DialogFullVO(WebUserTools.getUid(), fullDO, fullList.size()));
        }

        Integer count = letterService.count(new LetterQuery(UnReadEnum.UN_READ, WebUserTools.getUid()));
        mav.addObject("unReadCount", count == null ? "0" : count);
        mav.addObject("list", list);
        return mav;
    }

    // /message 通知页面,我的通知
    @RequestMapping(value = "/notice")
    public ModelAndView notice() {
        ModelAndView mav = new ModelAndView("/msg/notice");
        List<NotificationDO> list = letterService.list(new NotificationQuery(WebUserTools.getUid()));
        initUserInfo4List(list);

        Integer count = letterService.count(new NotificationQuery(WebUserTools.getUid(), UnReadEnum.UN_READ));
        mav.addObject("unReadCount", count == null ? "0" : count);
        mav.addObject("list", list);
        return mav;
    }

    // 未读私信数
    // {"result":{"code":"1120", "message":"用户未登录", "data":""}}
    @RequestMapping(value = "/letter/noread/count.do")
    public ModelAndView countDo() {
        if (!WebUserTools.hasLogin()) {
            return createJsonMav("1120", "用户未登录", "");
        }
        Integer count = letterService.count(new LetterQuery(UnReadEnum.UN_READ, WebUserTools.getUid()));
        return createSuccJsonMav("", count == null ? "0" : count);
    }

    // 未读通知数
    @RequestMapping(value = "/message/unread/count")
    public ModelAndView count() {
        if (!WebUserTools.hasLogin()) {
            return createJsonMav("1120", "用户未登录", "");
        }
        Integer count = letterService.count(new NotificationQuery(WebUserTools.getUid(), UnReadEnum.UN_READ));
        return createSuccJsonMav("", count == null ? "0" : count);
    }

    // /letter/shield.do 屏蔽发给我的私信
    // {"result":{"code":"9999", "message":"操作成功", "data":""}}
    // shield:false 取消屏蔽 shield:true 开启屏蔽
    @RequestMapping(value = "/letter/shield.do")
    public ModelAndView shield(boolean shield) {
        Integer isLetterBan = 0;
        if (shield) {
            isLetterBan = 1;
        }
        MemberDO member = new MemberDO(WebUserTools.getUid());
        member.setLetterBan(isLetterBan);
        userService.update(member);
        return createJsonMav("9999", "操作成功", "");
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///
    // ///
    // /// 黑名单 举报
    // ///
    // ///
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // /letter/add/blacklist.do 把好友拉近黑名单
    @RequestMapping(value = "/letter/add/blacklist.do")
    public ModelAndView addBlack(String jid) {
        MemberDO blackMember = userService.find(new MemberQuery(jid));
        if (blackMember == null) {
            return createJsonMav("0000", "参数有误", "");
        }
        BlacklistDO blacklist = userService.find(new BlacklistQuery(WebUserTools.getUid(), blackMember.getId()));
        if (blacklist != null) {
            return createJsonMav("0000", "该用户已经在黑名单中", "");
        }
        userService.add(new BlacklistDO(WebUserTools.getUid(), blackMember.getId()));
        return createSuccJsonMav("添加成功", "");
    }

    // /letter/del/blacklist.do
    @RequestMapping(value = "/letter/del/blacklist.do")
    public ModelAndView delBlack(String jid) {
        MemberDO blackMember = userService.find(new MemberQuery(jid));
        if (blackMember == null) {
            return createJsonMav("0000", "参数有误", "");
        }
        BlacklistDO blacklist = userService.find(new BlacklistQuery(WebUserTools.getUid(), blackMember.getId()));
        if (blacklist == null) {
            return createJsonMav("0000", "该用户不在你的黑名单中", "");
        }
        userService.deleteBlacklist(blacklist.getId());
        return createSuccJsonMav("添加黑名单成功", "");
    }
}
