/*
 * Copyright 2014-2017 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.util;

import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.ArrayUtils;
import org.apache.commons.lang.StringUtils;

import com.mmj.app.common.core.lang.Assert;
// import org.joda.time.Duration;
// import org.joda.time.format.PeriodFormatter;
// import org.joda.time.format.PeriodFormatterBuilder;

/**
 * 字符串处理工具类
 * 
 * <pre>
 *  参考“http://blog.csdn.net/yohop/article/details/2534907”
 *  格式化表达式：%[零个或多个标志][最小字段宽度][精度][修改符]格式码
 *  标志:
 *      标志 - 含义 值在字段中做对齐，缺省情况下是右对齐。
 *  最小字段宽度:
 *      字段宽度是一个十进制整数，用于指定将出现在结果中的最小字符数。如果值的字符数少于字段宽度，就对它进行填充以增加长度。
 *  精度:
 *       以一个句点开头，后面跟一个可选的十进制数。
 *       对于e,E和f类型的转换，精度决定将出现在小数点之后的数字位数。例如.2小数点后精度为2
 *       当使用s类型的转换时，精度指定将被转换的最多的字符数。
 *       
 *  格式码:
 *       s,f,%(转义符号，类似字符串的"\")
 * 
 * </pre>
 * 
 * @author zxc Jun 16, 2014 12:41:07 AM
 */
public class StringFormatter {

    private static final char[] array  = new char[] { ',', ' ', '(', ')' };

    public static final String  ENCODE = "utf-8";

    // static PeriodFormatter formatter = new
    // PeriodFormatterBuilder().appendDays().appendSuffix("天").appendHours().appendSuffix("小时").appendMinutes().appendSuffix("分").appendSeconds().appendSuffix("秒").appendMillis3Digit().appendSuffix("毫秒").toFormatter();

    /***
     * 格式化Float（去除无用0）
     * 
     * @param f
     * @return
     */
    public static String floatFormat(Float f) {
        if (f == null) {
            return 0 + "";
        }
        String s = f.toString();
        if (s.indexOf(".") > 0) {
            s = s.replaceAll("0+?$", "");// 去掉多余的0
            s = s.replaceAll("[.]$", "");// 如最后一位是.则去掉
        }
        return s;
    }

    public static String decode(String s) {
        try {
            return URLDecoder.decode(s, ENCODE);
        } catch (Exception e) {
            return s;
        }
    }

    public static String encode(String s) {
        try {
            return URLEncoder.encode(s, ENCODE);
        } catch (Exception e) {
            return s;
        }
    }

    // public static String formatDuration(long durationMs) {
    // return formatDuration(durationMs, null);
    // }

    // public static String formatDuration(long durationMs, String prefix) {
    // Duration duration = new Duration(durationMs);
    // String print = formatter.print(duration.toPeriod());
    // return (prefix == null ? "" : prefix) + print + " (" + durationMs + ")ms";
    // }

    public static String formatFloat(Float value, int delimiter, String suffix) {
        float _value = value == null ? 0f : value;
        suffix = suffix == null ? "" : suffix;
        return String.format("%." + delimiter + "f" + suffix, _value);
    }

    public static String formatFloat(Number denominator, Number molecule) {
        if (denominator == null || molecule == null) {
            return null;
        }
        return formatFloat(denominator.floatValue() / molecule.floatValue(), 2, null);
    }

    public static String formatFloat(Float value) {
        return formatFloat(value, 2, null);
    }

    /**
     * 处理百分比
     */
    public static String formatPercent(Float value) {
        return formatFloat(value, 2, "%%");
    }

    public static String formatString(String value, boolean alignLeft, int minLength, int maxLength) {
        return String.format("%" + (alignLeft ? "-" : "") + minLength + "." + maxLength + "s", value);
    }

    public static String matcherRegex(String str, String regex) {
        return matcherRegex(str, regex, true);
    }

    public static String matcherRegex(String s, String regex, boolean needTrim) {
        if (StringUtils.isBlank(s)) {
            return StringUtils.EMPTY;
        }
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(s);
        return needTrim ? m.replaceAll(StringUtils.EMPTY).trim() : m.replaceAll(StringUtils.EMPTY);
    }

    public static boolean matchsRegex(String str, String regex) {
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(str);
        return m.matches();
    }

    public static boolean containsRegex(String str, String regex) {
        Pattern p = Pattern.compile(regex);
        Matcher m = p.matcher(str);
        return m.find();
    }

    /**
     * 将数组中被source包含的返回出去。
     */
    public static Set<String> containsAny(String source, String[] testArray) {
        Assert.assertNotNull(source);
        Assert.assertNotNull(testArray);
        Set<String> result = new HashSet<String>(testArray.length);
        for (String testWord : testArray) {
            if (source.contains(testWord)) {
                result.add(testWord);
            }
        }
        return result;
    }

    /**
     * 将字符串中的字母和数字连词取出来，单独处理。
     */
    public static Set<String> matchLetterAndDigit(String source) {
        Set<String> result = new HashSet<String>();
        char[] charByte = new char[source.length()];
        int offset = 0;
        for (int i = 0, j = source.length(); i < j; i++) {
            char charAt = source.charAt(i);
            if (isMatch(charAt)) {// 单字节
                charByte[offset] = charAt;
                offset++;
            } else {
                if (offset > 0) {
                    char[] copyOfRange = Arrays.copyOfRange(charByte, 0, offset);
                    if (copyOfRange.length > 1) {
                        result.add(new String(copyOfRange));
                    }
                    offset = 0;
                }
            }
            if (i == (j - 1) && offset > 0) {
                char[] copyOfRange = Arrays.copyOfRange(charByte, 0, offset);
                if (copyOfRange.length > 1) {
                    result.add(new String(copyOfRange));
                }
            }
        }
        return result;
    }

    private static boolean isMatch(char charAt) {
        String binaryString = Integer.toBinaryString(charAt);
        if (binaryString.length() > 8) {
            return false;
        } else {
            return !ArrayUtils.contains(array, charAt);
        }
    }

    public static boolean isContainsRegex(String str, String regex) {
        if (StringUtils.isBlank(str) || StringUtils.isBlank(regex)) {
            return false;
        }
        return Pattern.compile(regex).matcher(str).find();
    }

    // 返回字符串的字数，精确到double
    public static float getWordSize(String o) {
        int l = o.length();
        o = StringFormatter.matcherRegex(o, "[^\\x00-\\xff]", false);// 除去所有的双字节字符
        return (float) (o.length() * 0.5) + l - o.length();
    }

    // 英文算一个字符长度，其它所有2个字符长度
    public static int getEnWordSize(String o) {
        int l = o.length();
        o = StringFormatter.matcherRegex(o, "[^\\x00-\\xff]", false);// 除去所有的双字节字符
        return 2 * l - o.length();
    }

    public static void main(String[] args) {
        // String word = "!@#3232";
        // if (Pattern.compile("(?i)[a-z]").matcher(word).find()) {
        // System.out.println("有字母");
        // } else if (Pattern.compile("(?i)[0-9]").matcher(word).find()) {
        // System.out.println("有数字");
        // }
        // System.out.println(matchLetterAndDigit("60D- 55Z中 "));
        // System.out.println(matchLetterAndDigit("60D-55Z中 "));
        // System.out.println(matchLetterAndDigit("60D,55Z中 "));
        // System.out.println(matchLetterAndDigit("60D#55Z中 "));
        // System.out.println(matchLetterAndDigit("棉T恤"));

        System.out.println(getEnWordSize("60D中甜美^一^夏季吊带雪纺抹胸裙沙滩裙连衣"));
        System.out.println(getWordSize("2XU Compression Top 无袖压缩衣"));
    }
}
