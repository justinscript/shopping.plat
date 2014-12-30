/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service.interfaces;

import java.util.List;

import com.mmj.app.biz.base.BaseService;
import com.mmj.app.biz.domain.DialogDO;
import com.mmj.app.biz.domain.DialogFullDO;
import com.mmj.app.biz.domain.LetterDO;
import com.mmj.app.biz.domain.NotificationDO;
import com.mmj.app.biz.query.DialogQuery;
import com.mmj.app.biz.query.LetterQuery;
import com.mmj.app.biz.query.NotificationQuery;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * 私信,通知相关的服务接口
 * 
 * @author zxc Nov 25, 2014 11:28:07 PM
 */
public interface LetterService extends BaseService {

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////会话表(DialogDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    List<DialogFullDO> dialogList(DialogQuery q);

    DialogDO getLastDialog(Long uId);

    Integer count(DialogQuery q);

    DialogDO find(DialogQuery q);

    List<DialogDO> list(DialogQuery q);

    PaginationList<DialogDO> listPagination(DialogQuery q, IPageUrl... i);

    DialogDO getDialogById(Long id);

    Long add(DialogDO... t);

    boolean update(DialogDO t);

    boolean deleteDialog(Long id);

    boolean realDeleteDialog(Long id);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////私信表(LetterDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    Integer count(LetterQuery q);

    LetterDO find(LetterQuery q);

    List<LetterDO> list(LetterQuery q);

    PaginationList<LetterDO> listPagination(LetterQuery q, IPageUrl... i);

    LetterDO getLetterById(Long id);

    Long add(LetterDO... t);

    boolean update(LetterDO t);

    boolean deleteLetter(Long id);

    boolean realDeleteLetter(Long id);

    // ////////////////////////////////////////////////////////////////////////////////////////
    // //////////通知表(NotificationDO)
    // ////////////////////////////////////////////////////////////////////////////////////////
    Integer count(NotificationQuery q);

    NotificationDO find(NotificationQuery q);

    List<NotificationDO> list(NotificationQuery q);

    PaginationList<NotificationDO> listPagination(NotificationQuery q, IPageUrl... i);

    NotificationDO getNotificationById(Long id);

    Long add(NotificationDO... t);

    boolean update(NotificationDO t);

    boolean deleteNotification(Long id);

    boolean realDeleteNotification(Long id);
}
