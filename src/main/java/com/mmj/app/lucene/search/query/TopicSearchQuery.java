/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.lucene.search.query;

import java.io.Serializable;
import java.util.List;

import org.apache.solr.client.solrj.SolrQuery;
import org.apache.solr.client.solrj.SolrQuery.ORDER;

import com.mmj.app.lucene.search.cons.SortSearchEnum;
import com.mmj.app.lucene.search.cons.TimeSearchEnum;
import com.mmj.app.lucene.search.utils.CustomSolrQueryConvert;
import com.mmj.app.lucene.solr.query.SearchQuery;

/**
 * @author zxc Dec 8, 2014 11:44:01 PM
 */
public class TopicSearchQuery implements SearchQuery, Serializable {

    private static final long serialVersionUID = 6884203091447206938L;

    private boolean           expectMatch      = false;               // 是否精确

    // private int nowPageIndex = 0; // 当前页面处于第几页，页面从0开始计数，在页面上显示则从1开始
    private int               allRecordNum;                           // 所有的记录数
    private int               rows             = 10;                  // 行数
    private int               start;                                  // 开始
    private String            sortFiled;

    private List<String>      wordList;                               // 分词后集合
    private SortSearchEnum    sort;                                   // default相关性 time最新 score最热
    private TimeSearchEnum    time;                                   // all全部 1d24小时 3d三天 7d一周 30d一月 365d一年

    public TopicSearchQuery() {

    }

    public TopicSearchQuery(List<String> wordList, SortSearchEnum sort, TimeSearchEnum time) {
        setWordList(wordList);
        setSort(sort);
        setTime(time);
        setExpectMatch(true);
    }

    public SortSearchEnum getSort() {
        return sort;
    }

    public void setSort(SortSearchEnum sort) {
        this.sort = sort;
    }

    public TimeSearchEnum getTime() {
        return time;
    }

    public void setTime(TimeSearchEnum time) {
        this.time = time;
    }

    public List<String> getWordList() {
        return wordList;
    }

    public void setWordList(List<String> wordList) {
        this.wordList = wordList;
    }

    // /////////////////////////////////////////////////////////////////////////////////////
    // ////
    // ////
    // ////
    // /////////////////////////////////////////////////////////////////////////////////////

    public boolean isExpectMatch() {
        return expectMatch;
    }

    public void setExpectMatch(boolean expectMatch) {
        this.expectMatch = expectMatch;
    }

    public int getAllRecordNum() {
        return allRecordNum;
    }

    public void setAllRecordNum(int allRecordNum) {
        this.allRecordNum = allRecordNum;
    }

    public void setRows(int rows) {
        this.rows = rows;
    }

    @Override
    public int getRows() {
        return rows;
    }

    public void setStart(int start) {
        this.start = start;
    }

    @Override
    public int getStart() {
        return start;
    }

    public void setSortFiled(String sortFiled) {
        this.sortFiled = sortFiled;
    }

    @Override
    public String getSortFiled() {
        return sortFiled;
    }

    @Override
    public ORDER getOrderBy() {
        return ORDER.desc;
    }

    @Override
    public SolrQuery toSolrQuery() {
        return CustomSolrQueryConvert.to(this);
    }
}
