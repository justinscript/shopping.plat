/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.exception;

/**
 * @author zxc Sep 4, 2014 12:16:25 AM
 */
public class UnSupportBaseDaoException extends RuntimeException {

    private static final long serialVersionUID = -246345309677115693L;

    public UnSupportBaseDaoException() {

    }

    public UnSupportBaseDaoException(String message) {
        super(message);
    }

    public UnSupportBaseDaoException(Throwable cause) {
        super(cause);
    }

    public UnSupportBaseDaoException(String message, Throwable cause) {
        super(message, cause);
    }
}
