/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.common.checkcode;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.imageio.ImageIO;
import javax.swing.AbstractAction;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JFrame;
import javax.swing.JPanel;

/**
 * @author zxc Nov 30, 2014 5:12:52 PM
 */
public class PicCodeGUI extends JFrame {

    private static final long serialVersionUID = 3035326840358856027L;

    private BarCodePanel      barCodePanel;
    private JCheckBox         checkBox;

    public PicCodeGUI() {
        setTitle("验证码生成器");
        JPanel toolbarPanel = new JPanel();

        checkBox = new JCheckBox(new PaintLineAction());
        checkBox.setText("绘制模糊点");
        toolbarPanel.add(checkBox);

        JButton b1 = new JButton(new CreateAction());
        b1.setText("生成验证码");
        toolbarPanel.add(b1);

        JButton b2 = new JButton(new CreateImgAction(false));
        b2.setText("生成图片");
        toolbarPanel.add(b2);

        JButton b4 = new JButton(new CreateImgAction(true));
        b4.setText("生成小图片");
        toolbarPanel.add(b4);

        JButton b3 = new JButton(new QuitAction());
        b3.setText("关闭对话盒");
        toolbarPanel.add(b3);

        barCodePanel = new BarCodePanel();
        barCodePanel.setPreferredSize(new Dimension(500, 500));

        getContentPane().add(toolbarPanel, BorderLayout.NORTH);
        getContentPane().add(barCodePanel);

        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setSize(500, 500);
        pack();
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        setLocation((screenSize.width - getWidth()) / 2, (screenSize.height - getHeight()) / 2);
        setVisible(true);

    }

    public class CreateAction extends AbstractAction {

        private static final long serialVersionUID = 2593702803600621522L;

        public void actionPerformed(ActionEvent e) {
            barCodePanel.createText();
            barCodePanel.repaint();
        }
    }

    public class CreateImgAction extends AbstractAction {

        private static final long serialVersionUID = -4388300447600351743L;

        boolean                   isSmall;

        public CreateImgAction(boolean isSmall) {
            this.isSmall = isSmall;
        }

        public void actionPerformed(ActionEvent e) {
            if (!isSmall) {
                barCodePanel.createImg();
            } else {
                List<String> textList = PicCode.getPicCheckCodeList(100);
                long t1 = System.currentTimeMillis();
                for (String s : textList) {
                    try {

                        String filepath = "/Users/zxc/workspace/biz.comset/src/main/java/com/mmj/app/web/commons/checkcode/pic/";
                        File file = new File(filepath + s + ".png");

                        BufferedImage bi = PicCode.createEachBarCodeImg(s, 100, 30, 20, 35, false);
                        ImageIO.write(bi, "png", file);

                        // byte[] data = getBytes(bi);
                        // System.out.println(data.length);
                        // imgList.add(data);

                    } catch (Exception e1) {
                        e1.printStackTrace();
                    }
                }
                long t2 = System.currentTimeMillis();
                System.out.println("TIME=" + (t2 - t1));
                System.gc();
                System.gc();
                System.gc();

            }
        }
    }

    public static byte[] getBytes(BufferedImage img) throws IOException {
        ByteArrayOutputStream byar = new ByteArrayOutputStream();
        try {
            ImageIO.write(img, "png", byar);
        } finally {
            byar.close();
        }
        return byar.toByteArray();
    }

    // List<Object> imgList = new ArrayList<Object>();

    public class PaintLineAction extends AbstractAction {

        private static final long serialVersionUID = 2903874312092961411L;

        public void actionPerformed(ActionEvent e) {
            barCodePanel.setLineFlag(checkBox.isSelected());
            barCodePanel.repaint();
        }
    }

    private class QuitAction extends AbstractAction {

        private static final long serialVersionUID = -6389802816912005370L;

        public void actionPerformed(ActionEvent e) {
            System.exit(0);
        }
    }

    public static void main(String[] args) {
        new PicCodeGUI();
    }
}

class BarCodePanel extends JPanel {

    private static final long serialVersionUID = -763223494836645144L;

    int                       EACH_W           = 100;
    int                       EACH_H           = 30;
    int                       GAP              = 5;
    int                       OFF_X            = 20;
    int                       OFF_Y            = 24;

    private List<String>      textList         = new ArrayList<String>();
    private boolean           lineFlag;

    public BarCodePanel() {
        createText();
    }

    public void setLineFlag(boolean lineFlag) {
        this.lineFlag = lineFlag;
    }

    public void createText() {
        textList = PicCode.getPicCheckCodeList(200);
    }

    public void createImg() {
        try {

            String filepath = "/Users/zxc/workspace/biz.comset/src/main/java/com/mmj/app/web/commons/checkcode/pic/test.png";
            File file = new File(filepath);

            BufferedImage bi = new BufferedImage(getWidth(), getHeight(), BufferedImage.TYPE_INT_RGB);
            Graphics g = bi.getGraphics();
            paint(g);
            g.dispose();
            ImageIO.write(bi, "png", file);
            // byte[] data = ((DataBufferByte) srcImage.getData().getDataBuffer()).getData();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void paint(Graphics g) {
        Color oldC = g.getColor();
        Font oldF = g.getFont();
        Graphics2D g2d = (Graphics2D) g;
        g2d.setColor(Color.WHITE);
        int width = getWidth();
        int height = getHeight();
        g2d.fillRect(0, 0, width, height);

        int column = width / (EACH_W + GAP);
        int row = height / (EACH_H + GAP);
        g2d.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);
        int index = -1;
        for (int n = 0; n < row; n++) {
            for (int i = 0; i < column; i++) {
                index++;
                if (index >= textList.size()) {
                    break;
                }
                String tmpText = textList.get(index);
                int tmpX = i * (EACH_W + GAP) + GAP;
                int tmpY = n * (EACH_H + GAP) + GAP;
                g2d.translate(tmpX, tmpY);
                PicCode.paintEachBarCode(g2d, tmpText, EACH_W, EACH_H, OFF_X, OFF_Y, lineFlag);
                g2d.translate(-tmpX, -tmpY);
            }
        }
        g.setColor(oldC);
        g.setFont(oldF);
    }
}
