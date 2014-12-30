/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only
 * in accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.file;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.beanutils.PropertyUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFCell;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mmj.app.common.core.lang.Argument;
import com.mmj.app.common.util.DateViewTools;

/**
 * Excel 处理工具类
 * 
 * @author zxc Jun 16, 2014 12:07:23 AM
 */
public class ExcelUtils {

    final static Logger log = LoggerFactory.getLogger(ExcelUtils.class);

    public interface IExcel<T> {

        public void initHSSRow(List<T> list, HSSFSheet sheet);
    }

    /**
     * 默认实现新建excel，row生成规则，以T的属性字段顺序爲正確順序，title的顺序必须与T的属性字段一致
     * 
     * @param response
     * @param list
     * @param xlsName
     * @param headTitle
     * @return
     */
    public static <T> HSSFWorkbook defBuildExcel(List<T> list, String xlsName, String... headTitle) {

        return buildExcel(list, xlsName, new IExcel<T>() {

            @Override
            public void initHSSRow(List<T> list, HSSFSheet sheet) {
                HSSFCell cell;
                for (int j = 0; j < list.size(); j++) {
                    T row = list.get(j);
                    if (row == null) {
                        continue;
                    }
                    HSSFRow hssrow = sheet.createRow(j + 1);
                    Map<String, String> fieldValMap = getFieldValueMap(row);

                    int i = 0;
                    for (Entry<String, String> entry : fieldValMap.entrySet()) {
                        Object value = entry.getValue();
                        cell = hssrow.createCell(i++);
                        cell.setCellType(HSSFCell.CELL_TYPE_STRING);
                        cell.setCellValue(value == null ? StringUtils.EMPTY : value + StringUtils.EMPTY);
                    }
                }
            }
        }, headTitle);
    }

    /**
     * 新建excel，row生成规则，请实现IExcel.initHSSRow方法
     * 
     * @param response
     * @param list
     * @param name
     * @param iExcel
     * @param headTitle
     * @return
     */
    public static <T> HSSFWorkbook buildExcel(List<T> list, String name, IExcel<T> iExcel, String... headTitle) {
        if (list == null || list.size() == 0) {
            log.error("ExcelUtils buildExcel List<T>:list is null,name={}", name);
            return null;
        }
        if (iExcel == null || Argument.isEmptyArray(headTitle)) {
            return new HSSFWorkbook();
        }
        String xlsName = name + "_" + DateViewTools.format(new Date(), "yyyy_MM_dd_HH_mm");
        // 产生工作簿对象
        HSSFWorkbook workbook = new HSSFWorkbook();
        // 产生工作表对象
        HSSFSheet sheet = workbook.createSheet();
        workbook.setSheetName(0, xlsName);

        for (int i = 0; i < headTitle.length; i++) {
            // 设置 表格中 每一列的宽度
            sheet.setColumnWidth(i, 17 * 256);
        }
        HSSFRow rowTitle = sheet.createRow(0);
        HSSFCell cell = null;
        for (int i = 0; i < headTitle.length; i++) {
            // 产生第一个单元格
            cell = rowTitle.createCell(i);
            cell.setCellType(HSSFCell.CELL_TYPE_STRING);
            cell.setCellValue(headTitle[i]);
        }
        // 写row
        iExcel.initHSSRow(list, sheet);
        return workbook;
    }

    /**
     * 取Bean的属性和值对应关系的MAP
     */
    public static Map<String, String> getFieldValueMap(Object bean) {
        Class<?> cls = bean.getClass();
        Map<String, String> valueMap = new LinkedHashMap<String, String>();
        Field[] fields = getAllFields(new ArrayList<Field>(), cls);

        for (Field field : fields) {
            try {
                if (field == null || field.getName() == null) {
                    continue;
                }
                if (StringUtils.equals("serialVersionUID", field.getName())) {
                    continue;
                }

                Object fieldVal = PropertyUtils.getProperty(bean, field.getName());

                String result = null;
                if (null != fieldVal) {
                    if (StringUtils.equals("Date", field.getType().getSimpleName())) {
                        result = DateViewTools.format((Date) fieldVal, "yyyy-MM-dd HH:mm:ss");
                    } else {
                        result = String.valueOf(fieldVal);
                    }
                }
                valueMap.put(field.getName(), result == null ? StringUtils.EMPTY : result);
            } catch (Exception e) {
                log.error(e.getMessage(), e);
                continue;
            }
        }
        return valueMap;
    }

    public static Field[] getAllFields(List<Field> fields, Class<?> type) {
        for (Field field : type.getDeclaredFields()) {
            fields.add(field);
        }
        if (type.getSuperclass() != null) {
            fields.addAll(Arrays.asList(getAllFields(fields, type.getSuperclass())));
        }
        return fields.toArray(new Field[fields.size()]);
    }
}
