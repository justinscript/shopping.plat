/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.web.controller.search;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.pagination.PagesPagination;
import com.mmj.app.common.pagination.PaginationParser;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;
import com.mmj.app.lucene.analyzer.JcsegWordAnalyzer;
import com.mmj.app.lucene.search.cons.SortSearchEnum;
import com.mmj.app.lucene.search.cons.TimeSearchEnum;
import com.mmj.app.lucene.search.cons.VersionType;
import com.mmj.app.lucene.search.pojo.TopicSearchField;
import com.mmj.app.lucene.search.pojo.UserSearchField;
import com.mmj.app.lucene.search.query.TopicSearchQuery;
import com.mmj.app.lucene.search.query.UserSearchQuery;
import com.mmj.app.lucene.search.service.TopicSearch;
import com.mmj.app.lucene.search.service.UserSearch;
import com.mmj.app.web.controller.BaseController;

/**
 * @author zxc Nov 28, 2014 12:35:29 AM
 */
@Controller
public class SearchController extends BaseController {

    @Autowired
    private JcsegWordAnalyzer             analyzer;

    @Autowired
    private UserSearch<UserSearchQuery>   userSearch;
    @Autowired
    private TopicSearch<TopicSearchQuery> topicSearch;

    // 查询用户
    // /search/user/show/2?words=z
    @RequestMapping(value = "/search/user/show")
    public ModelAndView user(final String words, String sort, String time, Integer page) {
        ModelAndView mav = new ModelAndView("search/user");
        if (StringUtils.isEmpty(words)) {
            return mav;
        }
        if (StringUtils.isEmpty(sort)) {
            sort = "time";
        }

        // 版本设置
        Integer version = getVersion(VersionType.user);
        // 分词
        List<String> segWords = segWords(words);
        UserSearchQuery query = new UserSearchQuery(segWords, SortSearchEnum.getEnum(sort),
                                                    TimeSearchEnum.getEnum(time));
        // 分页
        page = Argument.isNotPositive(page) ? 0 : page - 1;
        query.setStart(page * query.getRows());
        // 查询到的集合
        List<UserSearchField> list = userSearch.search(version, query);
        
        PagesPagination pagination = PaginationParser.getPaginationList(page, query.getRows(), query.getAllRecordNum(),
                                                                        new IPageUrl() {

                                                                            @Override
                                                                            public String parsePageUrl(Object... objs) {
                                                                                return "/search/user/show/"
                                                                                       + (Integer) objs[1] + "?words="
                                                                                       + words;
                                                                            }
                                                                        });
        initUserInfo4List(list);
        for (UserSearchField userSearchField : list) {
            for (String regex : segWords) {
                userSearchField.setNick(highLight(userSearchField.getNick(), regex));
            }
        }

        mav.addObject("list", list);
        mav.addObject("searchcount", query.getAllRecordNum());
        mav.addObject("pagination", pagination);

        mav.addObject("words", words);
        mav.addObject("sort", sort);
        mav.addObject("time", time);
        mav.addObject("page", page);
        return mav;
    }

    // 查询topic
    // /search/show/5?time=all&sort=default&words=z
    // words:company page:1 sort:default time:all
    // sort: default相关性 time最新 score最热
    // time: all全部 1d24小时 3d三天 7d一周 30d一月 365d一年
    @RequestMapping(value = "/search/show")
    public ModelAndView content(final String words, String sort, String time, Integer page) {
        ModelAndView mav = new ModelAndView("search/show");
        if (StringUtils.isEmpty(words)) {
            return mav;
        }
        if (StringUtils.isEmpty(sort)) {
            sort = "default";
        }
        if (StringUtils.isEmpty(time)) {
            sort = "all";
        }
        final String url = "?time=" + time + "&sort=" + sort + "&words=" + words;

        // 版本设置
        Integer version = getVersion(VersionType.user);
        // 分词
        List<String> segWords = segWords(words);
        TopicSearchQuery query = new TopicSearchQuery(segWords, SortSearchEnum.getEnum(sort),
                                                      TimeSearchEnum.getEnum(time));
        // 分页
        page = Argument.isNotPositive(page) ? 0 : page - 1;
        query.setStart(page * query.getRows());
        // 查询到的集合
        List<TopicSearchField> list = topicSearch.search(version, query);
        for (TopicSearchField topicSearchField : list) {
            for (String regex : segWords) {
                topicSearchField.setTitle(highLight(topicSearchField.getTitle(), regex));
                topicSearchField.setContent(highLight(topicSearchField.getContent(), regex));
                topicSearchField.setSummary(highLight(topicSearchField.getSummary(), regex));
            }
        }
        PagesPagination pagination = PaginationParser.getPaginationList(page, query.getRows(), query.getAllRecordNum(),
                                                                        new IPageUrl() {

                                                                            @Override
                                                                            public String parsePageUrl(Object... objs) {
                                                                                return "/search/show/"
                                                                                       + (Integer) objs[1] + url;
                                                                            }
                                                                        });
        initUserInfo4List(list);

        mav.addObject("list", list);
        mav.addObject("searchcount", query.getAllRecordNum());
        mav.addObject("pagination", pagination);

        mav.addObject("words", words);
        mav.addObject("sort", sort);
        mav.addObject("time", time);
        mav.addObject("page", page);

        getMyLikedAndSaved(mav);
        return mav;
    }

    private List<String> segWords(final String words) {
        return StringUtils.isEmpty(words) ? Collections.<String> emptyList() : words.length() == 1 ? Arrays.asList(words) : analyzer.segWords(words);
    }

    private static String highLight(String text, String search) {
        if (StringUtils.isEmpty(text)) {
            return StringUtils.EMPTY;
        }
        // <em class="highlight">Z</em>
        // String replacement = "<em class='highlight'>" + search + "</em>";
        return ignoreCaseReplace(text, search);
    }

    public static String ignoreCaseReplace(String source, String pattern) {
        Pattern p = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE);
        Matcher mc = p.matcher(source);
        StringBuffer sb = new StringBuffer();
        while (mc.find()) {
            mc.appendReplacement(sb, "<em class='highlight'>" + mc.group() + "</em>");
        }
        mc.appendTail(sb);
        return sb.toString();
    }

    private Integer getVersion(VersionType versionType) {
        return 1;
    }
}
