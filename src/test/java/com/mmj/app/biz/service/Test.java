/*
 * Copyright 2011-2016 MSUN.com All right reserved. This software is the confidential and proprietary information of
 * MSUN.com ("Confidential Information"). You shall not disclose such Confidential Information and shall use it only in
 * accordance with the terms of the license agreement you entered into with MSUN.com.
 */
package com.mmj.app.biz.service;

import java.util.ArrayList;
import java.util.List;

import com.google.gson.Gson;

/**
 * @author zxc Dec 5, 2014 12:01:52 AM
 */
public class Test {

    public static class TreeNode {

        private Integer        id;
        private String         name;
        private Integer        parentId;
        private List<TreeNode> children;

        public TreeNode() {

        }

        public TreeNode(Integer id, String name, Integer parentId) {
            setId(id);
            setName(name);
            setParentId(parentId);
        }

        public Integer getId() {
            return id;
        }

        public void setId(Integer id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getParentId() {
            return parentId;
        }

        public void setParentId(Integer parentId) {
            this.parentId = parentId;
        }

        public List<TreeNode> getChildren() {
            return children;
        }

        public void setChildren(List<TreeNode> children) {
            this.children = children;
        }
    }

    public static void main(String[] args) {

        TreeNode treeNode1 = new TreeNode(7, "张兄才", 2);
        TreeNode treeNode2 = new TreeNode(8, "徐杰", 6);
        TreeNode treeNode3 = new TreeNode(9, "陆秀俊", 5);
        TreeNode treeNode4 = new TreeNode(1, "潘国均", 0);
        TreeNode treeNode5 = new TreeNode(5, "王海", 1);
        TreeNode treeNode6 = new TreeNode(2, "王天良", 0);
        TreeNode treeNode7 = new TreeNode(6, "吴云州", 1);
        TreeNode treeNode8 = new TreeNode(10, "吴宇", 4);
        TreeNode treeNode9 = new TreeNode(4, "mk", 0);
        TreeNode treeNode10 = new TreeNode(3, "何佳", 0);
        TreeNode treeNode11 = new TreeNode(11, "xxx", 6);

        List<TreeNode> menuList = new ArrayList<Test.TreeNode>();
        menuList.add(treeNode1);
        menuList.add(treeNode2);
        menuList.add(treeNode3);
        menuList.add(treeNode4);
        menuList.add(treeNode5);
        menuList.add(treeNode6);
        menuList.add(treeNode7);
        menuList.add(treeNode8);
        menuList.add(treeNode9);
        menuList.add(treeNode10);
        menuList.add(treeNode11);

        List<TreeNode> nodeList = new ArrayList<Test.TreeNode>();

        for (TreeNode node1 : menuList) {
            boolean mark = false;
            for (TreeNode node2 : menuList) {
                if (node1.getParentId() != null && node1.getParentId().equals(node2.getId())) {
                    mark = true;
                    if (node2.getChildren() == null) {
                        node2.setChildren(new ArrayList<TreeNode>());
                    }
                    node2.getChildren().add(node1);
                    break;
                }
            }
            if (!mark) {
                nodeList.add(node1);
            }
        }
        // 转为json格式
        String json = new Gson().toJson(nodeList);
        System.out.println("json:" + json);
    }
}
