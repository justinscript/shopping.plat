/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service.impl;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mmj.app.biz.cons.StatusEnum;
import com.mmj.app.biz.dao.DialogDao;
import com.mmj.app.biz.dao.LetterDao;
import com.mmj.app.biz.dao.NotificationDao;
import com.mmj.app.biz.domain.DialogDO;
import com.mmj.app.biz.domain.DialogFullDO;
import com.mmj.app.biz.domain.LetterDO;
import com.mmj.app.biz.domain.NotificationDO;
import com.mmj.app.biz.query.DialogQuery;
import com.mmj.app.biz.query.LetterQuery;
import com.mmj.app.biz.query.NotificationQuery;
import com.mmj.app.biz.service.interfaces.LetterService;
import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.core.lang.ArrayUtils;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * @author zxc Nov 25, 2014 11:30:22 PM
 */
@Service
public class LetterServiceImpl implements LetterService {

    @Autowired
    private LetterDao       letterDao;
    @Autowired
    private NotificationDao notificationDao;
    @Autowired
    private DialogDao       dialogDao;

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 私信表 DialogDO
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    @SuppressWarnings("unchecked")
    public List<DialogFullDO> dialogList(DialogQuery q) {
        if (q == null) {
            return Collections.<DialogFullDO> emptyList();
        }
        return dialogDao.list(q, "dialogListQuery");
    }

    public DialogDO getLastDialog(Long uId) {
        if (Argument.isNotPositive(uId)) {
            return null;
        }
        return null;
    }

    @Override
    public Integer count(DialogQuery q) {
        if (q == null) {
            return 0;
        }
        return dialogDao.count(q);
    }

    @Override
    public DialogDO find(DialogQuery q) {
        if (q == null) {
            return null;
        }
        return dialogDao.find(q);
    }

    @Override
    public List<DialogDO> list(DialogQuery q) {
        if (q == null) {
            return Collections.<DialogDO> emptyList();
        }
        return dialogDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<DialogDO> listPagination(DialogQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<DialogDO>) Collections.<DialogDO> emptyList();
        }
        return (PaginationList<DialogDO>) dialogDao.paginationList(q, i);
    }

    @Override
    public DialogDO getDialogById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return dialogDao.getById(id);
    }

    @Override
    public Long add(DialogDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = dialogDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(DialogDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return dialogDao.updateById(t);
    }

    @Override
    public boolean deleteDialog(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new DialogDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteDialog(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return dialogDao.deleteById(id);
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 私信表 LetterDO
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////
    @Override
    public Integer count(LetterQuery q) {
        if (q == null) {
            return 0;
        }
        return letterDao.count(q);
    }

    @Override
    public LetterDO find(LetterQuery q) {
        if (q == null) {
            return null;
        }
        return letterDao.find(q);
    }

    @Override
    public List<LetterDO> list(LetterQuery q) {
        if (q == null) {
            return Collections.<LetterDO> emptyList();
        }
        return letterDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<LetterDO> listPagination(LetterQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<LetterDO>) Collections.<LetterDO> emptyList();
        }
        return (PaginationList<LetterDO>) letterDao.paginationList(q, i);
    }

    @Override
    public LetterDO getLetterById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return letterDao.getById(id);
    }

    @Override
    public Long add(LetterDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = letterDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(LetterDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return letterDao.updateById(t);
    }

    @Override
    public boolean deleteLetter(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new LetterDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteLetter(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return letterDao.deleteById(id);
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // //// 通知表 NotificationDO
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////
    @Override
    public Integer count(NotificationQuery q) {
        if (q == null) {
            return 0;
        }
        return notificationDao.count(q);
    }

    @Override
    public NotificationDO find(NotificationQuery q) {
        if (q == null) {
            return null;
        }
        return notificationDao.find(q);
    }

    @Override
    public List<NotificationDO> list(NotificationQuery q) {
        if (q == null) {
            return Collections.<NotificationDO> emptyList();
        }
        return notificationDao.list(q);
    }

    @SuppressWarnings("unchecked")
    @Override
    public PaginationList<NotificationDO> listPagination(NotificationQuery q, IPageUrl... i) {
        if (q == null) {
            return (PaginationList<NotificationDO>) Collections.<NotificationDO> emptyList();
        }
        return (PaginationList<NotificationDO>) notificationDao.paginationList(q, i);
    }

    @Override
    public NotificationDO getNotificationById(Long id) {
        if (Argument.isNotPositive(id)) {
            return null;
        }
        return notificationDao.getById(id);
    }

    @Override
    public Long add(NotificationDO... t) {
        t = ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0l;
        }
        Integer count = notificationDao.insert(t);
        if (t.length == 1) {
            return count.longValue();
        }
        return count == 0 ? 0l : 1l;
    }

    @Override
    public boolean update(NotificationDO t) {
        if (t == null) {
            return false;
        }
        if (Argument.isNotPositive(t.getId())) {
            return false;
        }
        return notificationDao.updateById(t);
    }

    @Override
    public boolean deleteNotification(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return update(new NotificationDO(id, StatusEnum.DELETE));
    }

    @Override
    public boolean realDeleteNotification(Long id) {
        if (Argument.isNotPositive(id)) {
            return false;
        }
        return notificationDao.deleteById(id);
    }
}
