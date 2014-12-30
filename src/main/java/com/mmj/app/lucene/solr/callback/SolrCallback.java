/*
 * Copyright 2011-2016 ZuoBian.com All right reserved. This software is the confidential and proprietary information of
 * ZuoBian.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with ZuoBian.com.
 */
package com.mmj.app.lucene.solr.callback;

import org.apache.solr.client.solrj.response.QueryResponse;

/**
 * 处理sorlj查询的结果,回调接口
 * 
 * @author zxc Nov 13, 2014 3:53:30 PM
 */
public interface SolrCallback {

    void handleSolrResult(QueryResponse result);
}
