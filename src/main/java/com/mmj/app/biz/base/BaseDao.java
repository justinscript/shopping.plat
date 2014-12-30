/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.base;

import java.io.Serializable;
import java.lang.reflect.Method;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.apache.ibatis.session.SqlSession;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.beans.factory.annotation.Autowired;

import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.core.lang.ArrayUtils;
import com.mmj.app.common.core.lang.Assert;
import com.mmj.app.common.exception.UnSupportBaseDaoException;
import com.mmj.app.common.pagination.Pagination;
import com.mmj.app.common.pagination.PaginationList;
import com.mmj.app.common.pagination.PaginationParser;
import com.mmj.app.common.pagination.PaginationParser.IPageUrl;

/**
 * 分页可以不注入SqlSessionTemplate对象,用Mapper方式实现,在BaseDao封装
 * 
 * @author zxc Jun 15, 2014 11:10:41 PM
 */
@SuppressWarnings({ "rawtypes", "unchecked" })
public abstract class BaseDao<T extends Serializable, M, Q> extends SqlSessionDaoSupport implements IBase {

    @Autowired
    protected M      m;

    private Class<T> entityClass;

    private Class<M> mapperClass;

    @Autowired
    public void setSqlSessionTemplate(SqlSessionTemplate sqlSessionTemplate) {
        super.setSqlSessionTemplate(sqlSessionTemplate);
    }

    /**
     * 创建默认构造方法，以取得真正的泛型类型
     */
    public BaseDao() {
        Class<?> c = getClass();
        Type type = c.getGenericSuperclass();
        if (type instanceof ParameterizedType) {
            Type[] parameterizedType = ((ParameterizedType) type).getActualTypeArguments();
            if (Argument.isEmptyArray(parameterizedType)) {
                throw new UnSupportBaseDaoException("init entityClass mapperClass failed!");
            }
            this.entityClass = (Class<T>) parameterizedType[0];
            this.mapperClass = (Class<M>) parameterizedType[1];
        } else {
            throw new UnSupportBaseDaoException(String.format("没有找到【%s】的动态参数T", getClass().getSimpleName()));
        }
    }

    @Override
    public Class<T> getEntityClass() {
        return entityClass;
    }

    /**
     * 命名空间
     * 
     * @return String
     */
    public String getNameSpace() {
        return mapperClass.getName();
    }

    /**
     * 根据ID查询对象
     */
    public <D extends Number> T getById(D id) {
        Assert.assertNotNull(id);
        if (id instanceof Integer) {
            return ((BaseMapper<T, Q>) m).getById((Integer) id);
        }
        if (id instanceof Long) {
            return ((BaseMapper<T, Q>) m).getById(((Long) id).intValue());
        }
        return null;
    }

    /**
     * List 查询所有或limit 的几条数据
     * 
     * @param map
     * @param limitSize == null 则查所有
     */
    public List<T> listAll(Integer limitSize) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("limitSize", limitSize);
        map.put("endRecordIndex", limitSize);
        map.put("startRecordIndex", 0);
        return ((BaseMapper<T, Q>) m).list(map);
    }

    /**
     * 查询所有数据
     */
    public List<T> list() {
        return this.listAll(null);
    }

    /**
     * Find 查询所有数据,mapper.xml中必须有find等SQL语句
     * 
     * @param q
     */
    public T find(Q q) {
        Assert.assertNotNull(q);
        return ((BaseMapper<T, Q>) m).find(q);
    }

    /**
     * Find 查询所有数据,mapper.xml中必须有自定义queryStatementName等SQL语句
     * 
     * @param queryStatementName 查询操作语句
     * @param q
     */
    public T find(Q q, String queryStatementName) {
        Assert.assertNotNull(q);
        return (T) this.getSqlSession().selectOne(_getNameSpace() + queryStatementName, (Pagination) q);
    }

    /**
     * ListQuery 查询数据,mapper.xml中必须有listQuery等SQL语句
     * 
     * @param q
     */
    public List<T> list(Q q) {
        Assert.assertNotNull(q);
        return ((BaseMapper<T, Q>) m).listQuery(q);
    }

    /**
     * ListQuery 查询数据,mapper.xml中必须有自定义queryStatementName等SQL语句
     * 
     * @param queryStatementName 查询操作语句
     * @param q
     */
    public List list(Q q, String queryStatementName) {
        Assert.assertNotNull(q);
        return this.getSqlSession().selectList(_getNameSpace() + queryStatementName, (Pagination) q);
    }

    /**
     * ListPagination 查询数据 已过时,请使用带有IPageUrl的同名方法
     * 
     * @param q
     * @return
     */
    @Deprecated
    public PaginationList paginationList(Q q) {
        Assert.assertNotNull(q);
        return this.queryForPagination(q);
    }

    /**
     * ListPagination 查询数据
     * 
     * <pre>
     *      1.默认COUNT查询语句为'count',
     *      2.默认PAGINATION查询语句为'listPagination',
     *      3.请实现getNameSpace()方法
     *      4.mapper.xml中必须有count，listPagination等SQL语句
     * </pre>
     * 
     * @param q
     */
    public PaginationList paginationList(Q q, IPageUrl... iPages) {
        Assert.assertNotNull(q);
        return parsePages(q, this.queryForPagination(q), iPages);
    }

    /**
     * 分页查询 默认COUNT查询语句为'count',请实现getNameSpace()方法
     * 
     * @param queryStatementName
     * @param query
     * @return
     */
    public PaginationList paginationList(Q q, String queryStatementName, IPageUrl... iPages) {
        if (StringUtils.isEmpty(queryStatementName)) {
            log.error("BaseDao paginationList: queryStatementName is null,please check!");
            return (PaginationList) Collections.<Object> emptyList();
        }
        Assert.assertNotNull(q);
        return parsePages(q, this.paginationList(q, "count", queryStatementName), iPages);
    }

    /**
     * PaginationList 查询数据
     * 
     * @param countStatementName count操作语句
     * @param queryStatementName 分页操作语句
     * @param q
     * @return
     */
    public PaginationList paginationList(Q q, String countStatementName, String queryStatementName, IPageUrl... iPages) {
        if (StringUtils.isEmpty(countStatementName) || StringUtils.isEmpty(queryStatementName)) {
            log.error("BaseDao paginationList:countStatementName or queryStatementName is null,please check!");
            return (PaginationList) Collections.<Object> emptyList();
        }
        Assert.assertNotNull(q);
        return parsePages(q, this.queryForPagination(_getNameSpace() + countStatementName, _getNameSpace()
                                                                                           + queryStatementName,
                                                     (Pagination) q), iPages);
    }

    /**
     * Count Query 数据:默认COUNT查询语句为'count',请实现getNameSpace()方法
     * 
     * @param q
     */
    public Integer count(Q q) {
        Assert.assertNotNull(q);
        return ((BaseMapper<T, Q>) m).count(q);
    }

    /**
     * Count Query 数据:COUNT查询语句自定义queryStatementName等SQL语句,请实现getNameSpace()方法
     * 
     * @param queryStatementName 分页操作语句
     * @param q
     */
    public Integer count(Q q, String queryStatementName) {
        Assert.assertNotNull(q);
        return (Integer) getSqlSession().selectOne(_getNameSpace() + queryStatementName, q);
    }

    /**
     * 根据主键ID删除
     */
    public <D extends Number> boolean deleteById(D id) {
        Assert.assertNotNull(id);
        Integer count = 0;
        if (id instanceof Integer) {
            count = ((BaseMapper<T, Q>) m).deleteById((Integer) id);
        }
        if (id instanceof Long) {
            count = ((BaseMapper<T, Q>) m).deleteById(((Long) id).intValue());
        }
        return count == 0 ? false : true;
    }

    /**
     * 插入 T
     */
    public Integer insert(T t) {
        Assert.assertNotNull(t);
        return ((BaseMapper<T, Q>) m).insert(t);
    }

    /**
     * 插入 Arrays
     */
    public Integer insert(T... t) {
        ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return 0;
        }
        Assert.assertNotNull(t);
        if (t.length == 1 && t[0] != null) {
            return ((BaseMapper<T, Q>) m).insert(t[0]);
        }
        return this.batchInsertByMapper(Arrays.asList(t));
    }

    /**
     * 插入 List
     */
    public Integer insert(List<T> list) {
        Assert.assertNotNull(list);
        Integer lastInsertId = new Integer(0);
        for (T t : list) {
            if (t != null) {
                lastInsertId = ((BaseMapper<T, Q>) m).insert(t);
            }
        }
        return lastInsertId;
    }

    /**
     * 根据主键ID更新
     */
    public boolean updateById(T... t) {
        Assert.assertNotNull(t);
        ArrayUtils.removeNullElement(t);
        if (Argument.isEmptyArray(t)) {
            return false;
        }
        Assert.assertNotNull(t);
        Integer count = 0;
        if (t.length == 1 && t[0] != null) {
            count = ((BaseMapper<T, Q>) m).updateById(t[0]);
        } else {
            count = this.batchUpdateByMapper(Arrays.asList(t));
        }
        return count == null ? false : count == 0 ? false : true;
    }

    /**
     * 批量插入
     * 
     * @param sqlSessionFactory
     * @param mapperClass 要使用的Mapper的Class
     * @param pojoClass 列表中POJO对象的Class
     * @param methodName 要执行的Mapper类中的方法名 默认insert
     * @param objList 要入库的数据列表
     */
    public Integer batchInsertByMapper(Collection<T> objList) {
        return batchOptByMapper(objList, "insert");
    }

    /**
     * 批量更新
     * 
     * @param sqlSessionFactory
     * @param mapperClass 要使用的Mapper的Class
     * @param pojoClass 列表中POJO对象的Class
     * @param methodName 要执行的Mapper类中的方法名 默认"updateById"
     * @param objList 要入库的数据列表
     */
    public Integer batchUpdateByMapper(Collection<T> objList) {
        return batchOptByMapper(objList, "updateById");
    }

    private PaginationList parsePages(Q q, PaginationList paginationList, IPageUrl... iPages) {
        ArrayUtils.removeNullElement(iPages);
        if (Argument.isEmptyArray(iPages)) {
            return paginationList;
        }
        if (q instanceof Pagination) {
            paginationList.setQuery(PaginationParser.getPaginationList(((Pagination) q).getNowPageIndex(),
                                                                       ((Pagination) q).getPageSize(),
                                                                       ((Pagination) q).getAllRecordNum(), iPages[0]));
        }
        return paginationList;
    }

    private Integer batchOptByMapper(Collection<T> objList, String methodName) {
        SqlSession session = getSqlSession();
        Class[] paramTypes = new Class[1];
        M mapper = (M) session.getMapper(mapperClass);

        try {
            paramTypes[0] = Class.forName(entityClass.getName());
            Method method = mapperClass.getMethod(methodName, Serializable.class);
            for (Object obj : objList) {
                method.invoke(mapper, obj);
            }
        } catch (Exception e) {
            log.error("BaseDao batchOptByMapper:error()");
        }
        session.flushStatements();
        return new Integer(1);
    }

    /**
     * 分页查询
     * 
     * @param countStatementName 如果countStatementName==null，表示不查询Count()语句
     * @param queryStatementName 查询记录的StatementName
     * @param query 查询条件（需要设置currentPage和PageSize值，或是startRow和endRow值）
     * @return
     */
    private PaginationList queryForPagination(String countStatementName, String queryStatementName, Pagination query) {
        PaginationList paginationList = new PaginationList(query);
        if (countStatementName != null) {
            Integer obj = (Integer) getSqlSession().selectOne(countStatementName, query);
            int totalCount = obj == null ? 0 : obj;
            query.init(totalCount);

            if (totalCount > 0) {
                List items = getSqlSession().selectList(queryStatementName, query);
                if (items != null) {
                    paginationList.addAll(items);
                }
            }
        } else {
            List items = getSqlSession().selectList(queryStatementName, query);
            if (items != null) {
                paginationList.addAll(items);
            }
        }
        return paginationList;
    }

    private PaginationList queryForPagination(Q q) {
        PaginationList paginationList = new PaginationList((Pagination) q);
        Integer obj = ((BaseMapper<T, Q>) m).count(q);
        int totalCount = obj == null ? 0 : obj;
        ((Pagination) q).init(totalCount);

        if (totalCount > 0) {
            List items = ((BaseMapper<T, Q>) m).listPagination(q);
            if (items != null) {
                paginationList.addAll(items);
            }
        }
        return paginationList;
    }

    private String _getNameSpace() {
        if (StringUtils.isEmpty(getNameSpace())) {
            log.error("BaseDao getNameSpace is null,please check!");
            return StringUtils.EMPTY;
        }
        return getNameSpace() + POINT;
    }
}
