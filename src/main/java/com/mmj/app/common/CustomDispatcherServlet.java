/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import javax.servlet.ReadListener;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.springframework.web.servlet.DispatcherServlet;

/**
 * @author zxc Jun 17, 2014 11:01:54 AM
 */
public class CustomDispatcherServlet extends DispatcherServlet {

    private static final long serialVersionUID = -1838835292361204923L;

    @Override
    protected void doService(HttpServletRequest request, HttpServletResponse response) throws Exception {

        String contentType = request.getHeader("Content-Type");

        if (!StringUtils.isBlank(contentType) && contentType.toLowerCase().startsWith("application/json")) {
            request = new FilterRequestWrapper(request);
        }
        super.doService(request, response);
    }

    public class FilterRequestWrapper extends HttpServletRequestWrapper {

        private final String payload;
        private String       encoding = null;

        public FilterRequestWrapper(HttpServletRequest request) {

            super(request);
            StringBuilder stringBuilder = new StringBuilder();
            BufferedReader bufferedReader = null;
            String encoding = request.getCharacterEncoding();
            try {
                // read the payload into the StringBuilder

                // 按照正确的encoding，将inputStream中的内容写入到String中
                InputStream inputStream = request.getInputStream();
                if (inputStream != null) {
                    if (StringUtils.isEmpty(encoding)) {
                        bufferedReader = new BufferedReader(new InputStreamReader(inputStream));
                    } else {
                        this.encoding = encoding;
                        bufferedReader = new BufferedReader(new InputStreamReader(inputStream, encoding));
                    }
                    char[] charBuffer = new char[128];
                    int bytesRead = -1;
                    while ((bytesRead = bufferedReader.read(charBuffer)) > 0) {
                        stringBuilder.append(charBuffer, 0, bytesRead);
                    }
                } else {
                    // make an empty string since there is no payload
                    stringBuilder.append("");
                }
            } catch (IOException ex) {
                throw new RuntimeException("Error reading the request payload", ex);
            } finally {
                if (bufferedReader != null) {
                    try {
                        bufferedReader.close();
                    } catch (IOException iox) {
                        // ignore
                    }
                }
            }
            payload = stringBuilder.toString();
        }

        public String getPayload() {
            return this.payload;
        }

        // 重载getInputStream方法，获取ServletInputStream流
        @Override
        public ServletInputStream getInputStream() throws IOException {

            final ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(
                                                                                       StringUtils.isEmpty(encoding) ? payload.getBytes() : payload.getBytes(encoding));

            // DelegatingServletInputStream inputStream = new DelegatingServletInputStream(byteArrayInputStream);

            ServletInputStream inputStream = new ServletInputStream() {

                public int read() throws IOException {
                    return byteArrayInputStream.read();
                }

                @Override
                public boolean isFinished() {
                    return false;
                }

                @Override
                public boolean isReady() {
                    return false;
                }

                @Override
                public void setReadListener(ReadListener readListener) {

                }
            };
            return inputStream;
        }
    }
}
