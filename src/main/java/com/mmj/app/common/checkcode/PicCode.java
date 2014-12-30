/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.checkcode;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.font.FontRenderContext;
import java.awt.geom.Rectangle2D;
import java.awt.image.BufferedImage;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.WindowConstants;

/**
 * @author zxc Nov 30, 2014 5:11:16 PM
 */
public class PicCode {

    /**
     * 生成验证码的数字
     */
    private static char        sourceChar[]   = { 'a', 'A', 'b', 'B', 'c', 'C', 'd', 'D', 'e', 'E', 'f', 'F', 'g', 'G',
            'h', 'H', 'j', 'J', 'k', 'K', 'L', 'm', 'M', 'n', 'N', 'p', 'P', 'q', 'Q', 'r', 'R', 's', 'S', 't', 'T',
            'u', 'U', 'V', 'w', 'W', 'x', 'X', 'y', 'Y', 'z', 'Z' };
    /**
     * 以下字符是不能组合出现的
     */
    private static String[]    exceptionArray = { "Jl", "jl", "ka", "TQ", "vT", "MT", "FZ", "TL", "TV", "Tv", "Wl",
            "Kv", "VX", "vX", "AD", "Yv", "Ya", };

    /**
     * 随机数
     */
    private static Random      random         = new Random(System.currentTimeMillis());
    private static Font        fontArray[];
    private static List<Color> colorList;

    /**
     * 返回一定数量的随机字符。
     * 
     * @param len 大于1万个就取1万个。
     * @return
     */
    public static List<String> getPicCheckCodeList(int len) {
        List<String> textList = new ArrayList<String>();
        len = len > 10000 ? 10000 : len;
        while (textList.size() < len) {
            String s = get4Text();
            if (!textList.contains(s)) {
                textList.add(s);
            }
        }
        return textList;
    }

    /**
     * 随机生存4个字符（去除一些特定不能出现的字符）
     * 
     * @return
     */
    private static String get4Text() {
        String tmp = getSingleText();
        while (true) {
            String c = getSingleText();
            if (tmp.indexOf(c) == -1) {
                String t = tmp + c;
                boolean flag = false;
                for (String e : exceptionArray) // 查看是否存在是不能出现的字母组合
                {
                    if (t.indexOf(e) != -1) {
                        flag = true; // 表示存在不能出现的字母组合
                        break;
                    }
                }
                if (!flag) {
                    tmp = t;
                }
            }
            if (tmp.length() >= 4) {
                return tmp;
            }
        }
    }

    /**
     * 随机收取一个字符
     * 
     * @return
     */
    private static String getSingleText() {
        int index = random.nextInt();
        index = Math.abs(index);
        int len = sourceChar.length;
        index = index % len;
        return String.valueOf(sourceChar[index]);
    }

    /**
     * 绘制具体的验证码
     * 
     * @param g2
     * @param text 绘制的文本
     * @param w 验证码宽度
     * @param h 验证码高度
     * @param offx 绘制第一个字母的x坐标
     * @param offy 绘制第一个字母的y坐标
     * @param drawPoint 是否绘制干扰点
     */
    public static BufferedImage createEachBarCodeImg(String text, int w, int h, int offx, int offy, boolean drawPoint) {
        BufferedImage bi = new BufferedImage(w, h, BufferedImage.TYPE_INT_RGB);
        Graphics g = bi.getGraphics();
        paintEachBarCode((Graphics2D) g, text, w, h, offx, offy, drawPoint);
        g.dispose();
        return bi;
    }

    /**
     * 绘制具体的验证码
     * 
     * @param g2
     * @param text 绘制的文本
     * @param w 验证码宽度
     * @param h 验证码高度
     * @param offx 绘制第一个字母的x坐标
     * @param offy 绘制第一个字母的y坐标
     * @param drawPoint 是否绘制干扰点
     */
    public static void paintEachBarCode(Graphics2D g2, String text, int w, int h, int offx, int offy, boolean drawPoint) {
        Color oldC = g2.getColor();
        Font oldF = g2.getFont();
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        // g2.setColor(Color.WHITE);
        g2.setColor(Color.GRAY);// 灰色背景
        g2.fillRect(0, 0, w, h);

        // g2.setColor(Color.BLACK);
        // g2.drawRect(1,1,w-1,h-1);

        char[] chs = text.toCharArray();
        int x1 = offx;
        int y1 = offy;
        int piyi[] = new int[2];
        piyi[0] = 0;
        piyi[1] = 0;
        for (int i = 0; i < chs.length; i++) {
            x1 += piyi[0];
            int tmpY = y1 + piyi[1];
            g2.translate(x1, tmpY);
            paintOneChar(g2, String.valueOf(chs[i]), i % 2 == 1, piyi, drawPoint);
            g2.translate(-x1, -tmpY);
        }
        g2.setColor(oldC);
        g2.setFont(oldF);
    }

    /**
     * 绘制干扰点
     * 
     * @param g2
     * @param x
     * @param y
     * @param w
     * @param h
     */
    private static void paintPoint(Graphics2D g2, int x, int y, int w, int h) {
        g2.setColor(Color.black);
        g2.translate(x, y);
        for (int i = 0; i < 50; i++) {
            int tmpx = Math.abs(random.nextInt());
            tmpx = tmpx % w;
            int tmpy = Math.abs(random.nextInt());
            tmpy = tmpy % h;
            g2.drawLine(tmpx, tmpy, tmpx, tmpy);
        }
        g2.translate(-x, -y);
    }

    /**
     * 绘制一个自负
     * 
     * @param g2
     * @param c 绘制的字符
     * @param right 字符倾斜标记。ture表示向右倾斜，false表示向左倾斜
     * @param piyi 上一个字符的偏移位置
     * @param drawPoint
     */
    private static void paintOneChar(Graphics2D g2, String c, boolean right, int[] piyi, boolean drawPoint) {
        Font font = getFontByPicCode();
        g2.setFont(font);
        FontRenderContext context = g2.getFontRenderContext();
        Rectangle2D bounds = font.getStringBounds(c, context);
        if (drawPoint) {
            paintPoint(g2, (int) bounds.getX(), (int) bounds.getY(), (int) bounds.getWidth(), (int) bounds.getHeight());
        }
        double angle = 20 * Math.PI / 180;
        angle = right ? angle : -angle;
        piyi[0] = (int) (bounds.getWidth() + bounds.getHeight() * Math.sin(angle) / 2);
        piyi[1] = (int) (bounds.getWidth() * Math.sin(angle));
        // 神医:改变间距
        piyi[0] -= (int) (bounds.getWidth() / 3.5f);
        piyi[1] -= right ? (int) (bounds.getWidth() / 3f) : ((int) (bounds.getWidth() / 3f));

        g2.rotate(angle);
        // g2.setColor(Color.green);
        // g2.drawRect((int)bounds.getX(),(int)bounds.getY(), (int)bounds.getWidth(),(int)bounds.getHeight());
        g2.setColor(getColorByPicCode());
        g2.drawString(c, 0, 0);
        g2.rotate(-angle);

    }

    /**
     * 随机返回绘制的字体
     * 
     * @return
     */
    private static Font getFontByPicCode() {
        if (fontArray == null) {
            int fontSize = 24;
            fontArray = new Font[6];
            fontArray[0] = new Font("黑体", Font.BOLD, fontSize);
            fontArray[1] = new Font("Apple Casual", Font.BOLD, fontSize);
            fontArray[2] = new Font("Brush Script MT Italic", Font.BOLD, fontSize);
            fontArray[3] = new Font("Cambria Math", Font.BOLD, fontSize);
            fontArray[4] = new Font("华文中宋", Font.BOLD, fontSize);
            fontArray[5] = new Font("华文新魏", Font.BOLD, fontSize);
        }
        int index = random.nextInt();
        index = Math.abs(index);
        int len = fontArray.length;
        index = index % len;
        return fontArray[index];
    }

    /**
     * 随机返回绘制的颜色
     * 
     * @return
     */
    private static Color getColorByPicCode() {
        if (colorList == null) {
            colorList = new ArrayList<Color>();
            for (int r = 0; r < 200; r = r + 30) {
                for (int g = 0; g < 200; g = g + 30) {
                    for (int b = 0; b < 200; b = b + 30) {
                        colorList.add(new Color(r, g, b).darker());
                    }
                }
            }
        }
        int index = random.nextInt();
        index = Math.abs(index);
        int len = colorList.size();
        index = index % len;
        return colorList.get(index);
    }

    public static void main(String[] args) {
        // Encode bitmap as file
        OutputStream out = null;
        try {
            BufferedImage bi = PicCode.createEachBarCodeImg("fkewdafd", 100, 30, 20, 24, true);
            displayImage(bi);
            // displayImage(image);
            // generateBarcode(out, "V013330216");
            // BufferedImage image = generateBarcodeImage("0123456789_abc_ABC");
            // final BitmapEncoder encoder = BitmapEncoderRegistry.getInstance(mime);
            // encoder.encode(image, out, mime, dpi);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (out != null) {
                try {
                    out.close();
                } catch (Exception e2) {
                }
            }
        }

    }

    /**
     * 调试代码
     * 
     * @param image
     */
    public static void displayImage(BufferedImage image) {
        JFrame frame = new JFrame();
        frame.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
        class ImagePanel extends JPanel {

            private static final long serialVersionUID = 1L;
            private BufferedImage     image;

            ImagePanel(BufferedImage image) {
                this.image = image;
            }

            public void paintComponent(Graphics g) {
                super.paintComponent(g);
                if (image == null) {
                    g.drawString("No Image!", 5, 5);
                } else {
                    g.drawImage(image, 5, 5, this);
                }
            }
        }
        ;

        frame.getContentPane().add(new ImagePanel(image));
        frame.setSize(500, 300);
        frame.setVisible(true);
    }
}
