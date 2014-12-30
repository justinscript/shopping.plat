------------------------------------------------------------------------------
--
--	买买君数据库创建脚本
--	
--  1)创建表(Table)
--  2)创建主键约束(PK)
-- 	3)创建唯一性约束(Unique)
--	4)创建序列(Sequence)
--  5)创建索引(Index)
--
------------------------------------------------------------------------------
------------------------------------------------------------------------------
--
--命名规范：
--表名          	表名
--主键名        	pk_表名
--外键名        	fk_当前表名_参照表名_列名
--非唯一索引名  	idx_表名_列名
--唯一索引名    	unique_表名_列名
--
------------------------------------------------------------------------------
-- 
--create database mj;
--grant all on mmj.* to dev@'%' identified by 'dev1234' with grant option;

------------------------------------------------------------------创建表--BEGIN-----------------------------------------------------------------
-- 用户
CREATE TABLE member (
	`ID` 			INT(11)   NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  NOT NULL,
	`GMT_MODIFIED` 	DATETIME  NOT NULL,
	`STATUS`		INT(2)    NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`NAME` 			varchar(128) 	COMMENT '用户名',
	`PASSWORD`		varchar(64) 	COMMENT '密码',
	`NICK` 			varchar(512) 	COMMENT '昵称',
	`PIC` 			varchar(512) 	COMMENT '头像',
	`SEX`       	int(2) 			COMMENT '性别: 0=男,1=女',
	`PROVINCE` 		varchar(64) 	COMMENT '省',
	`CITY` 			varchar(64) 	COMMENT '市/区',
	`COUNTY` 		varchar(64) 	COMMENT '区/县',
	`EMAIL` 		varchar(128) 	COMMENT '电子邮件',
	`MOBILE` 		varchar(64) 	COMMENT '手机',
	`TRUN_COMMENT` 	int(2) 			COMMENT '当您的评论被回复时: 0=是,1=否',
	`TRUN_NEWS` 	int(2) 			COMMENT '当您提供的新闻上榜时: 0=是,1=否',
	`TRUN_REPLY` 	int(2) 			COMMENT '当您的发布被回复时: 0=是,1=否',
	`USER_TYPE` 	int(2) 			COMMENT '类型',
	`ROLE`			varchar(64) 	COMMENT '角色',
	`LAST_LOGIN` 	DATETIME 		COMMENT '上次登录时间,最后一次登录时间',
	`INTEGRAL`		int 			COMMENT '积分',
	`IS_BAN`		int(2) 			COMMENT '是否禁言  0=正常 1=禁言',
	`LETTER_BAN`	int(2) 			COMMENT '是否屏蔽私信,屏蔽所有人的私信  0=正常 1=屏蔽',
	`USER_STATE` 	int(2) 			COMMENT '状态: 0=未审核,1=正常,2=停止',
	
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
INSERT INTO `member` (`ID`, `GMT_CREATE`, `GMT_MODIFIED`, `STATUS`, `NAME`, `PASSWORD`, `NICK`, `PIC`, `SEX`, `PROVINCE`, `CITY`, `COUNTY`, `EMAIL`, `MOBILE`, `TRUN_COMMENT`, `TRUN_NEWS`, `TRUN_REPLY`, `USER_TYPE`, `ROLE`, `LAST_LOGIN`, `INTEGRAL`, `IS_BAN`, `USER_STATE`, `LETTER_BAN`)
VALUES (4, '2014-12-07 17:15:09', '2014-12-07 17:15:09', 0, 'admin', '123456', '管理员', NULL, 0, '上海', '宝山', NULL, 'admin@qq.com', NULL, 0, 0, 0, 0, NULL, NULL, 0, 0, 1, 0);

-- 评论
CREATE TABLE comments (
	`ID` 			INT(11)      NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	 NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	 NOT NULL,
	`STATUS`		INT(2)       NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`USER_ID`			int(11) 		COMMENT '用户id',
	`NAME`				varchar(128) 	COMMENT '用户名name,jid',
	
	`PARENT_ID`     	int(11)			COMMENT '父id',
	`CONTENT`			varchar(4096)  	COMMENT '内容',
	`TOPIC_ID`			int(11)			COMMENT '文章id',
	`DEPTH`				int(2) 			COMMENT '嵌套深度',
	`IS_VOTE`			int(2) 			COMMENT '是否可以投票 0=可以,1=不可以',
	`IS_BAN`			int(2) 			COMMENT '是否禁言',
	`SCORE`				int 			COMMENT '得分',
	`UPS` 				int(4) 			COMMENT '顶:顶[24]踩[0]',
	`DOWNS` 			int(4) 			COMMENT '踩:顶[24]踩[0]',
	`COMMENT_TYPE`		int(2) 			COMMENT '评论类型',
	`CLOSE_IP`			varchar(64)		COMMENT '封的ip',
	`ASSENT_TEXT`		varchar(128) 	COMMENT '',
	`COMMENTS_ACTION`	int 			COMMENT '动作',
	`ITEMS`				int 			COMMENT '',
	
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 文章
CREATE TABLE topic (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`USER_ID`			int(11) 		COMMENT '用户id',
	`NAME`				varchar(128) 	COMMENT '用户名name,jid',
	
	`TITLE`				varchar(1024)  	COMMENT '标题',
	`CONTENT`			varchar(4096)  	COMMENT '内容',
	`LINK_URL`			varchar(512)  	COMMENT '链接url',
	`ORIGINAL_URL`		varchar(512)  	COMMENT '原始链接url',
	`CONTENT_SOURCE`	varchar(512)  	COMMENT '内容来源',
	`CONTENT_KIND`		int(2)  		COMMENT '文章类型种类',
	`PUBLISH_SOURCE`	varchar(128)  	COMMENT '发布来源',
	`IMG_URL`			varchar(512)  	COMMENT '图片url',
	`SUMMARY`			varchar(4096)  	COMMENT '摘要',
	`RECOMMEND`			int(4) 			COMMENT '推荐数量',
	`COMMENTS`			int(4) 			COMMENT '评论数量',
	`YELLOW`			int(2) 			COMMENT 'yellow黄色暴力图片',
	`TAB_TYPE`			int(2)  		COMMENT '标签类型(链接TAB点击tabType=0;文字TAB点击tabType=1;图片TAB点击tabType=2)',
	`SUBJECT_ID`		int(2) 		    COMMENT '买买买subjectId=1; 海淘转让区subjectId=2; 发现subjectId=4; 问答社subjectId=100; 五元团subjectId=151',
	`TOPIC_STATE` 		int(2) 			COMMENT '状态: 0=未审核,1=正常,2=停止',
	`HIT`				int(4) 			COMMENT '点击量',
	`IS_VOTE`			int(2) 			COMMENT '是否投票  0=正常 1=停止',
	`IS_BAN`			int(2) 			COMMENT '是否禁言  0=正常 1=禁言',
	
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 收藏
CREATE TABLE collect (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`TOPIC_ID`		int(11)			COMMENT '文章id',
	`USER_ID`		int(11)			COMMENT '用户id',
	`COLLECT_TYPE`	int(2) 			COMMENT '收藏类型:1=私藏,2=推荐',
	
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 通知
CREATE TABLE notification (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`USER_ID`				int(11)			COMMENT '用户id,接收人用户id',
	`UN_READ`				int(2) 			COMMENT '是否阅读: 0=已读,1=未读',
	`CONTENT`				varchar(1024)	COMMENT '通知内容详情',
	`ACTION_USER_ID`		int(11) 		COMMENT '发起人用户id',
	`NOTIFICATION_ACTION`	int(2) 			COMMENT '发起的动作',
	`NOTIFICATION_TYPE`		int(2) 			COMMENT '通知类型',
	
	`COMMENTS_ID`			int(11)			COMMENT '评论id',
	`LINK_ID`				int(11)			COMMENT '发布id',
	
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 会话
CREATE TABLE dialog (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`SENDER_USER_ID`		int(11) 		COMMENT '发起人用户id',
	`SENDER_NAME`			varchar(128) 	COMMENT '发起人用户名name',
	
	`RECIPIENT_USER_ID`		int(11) 		COMMENT '接收人用户id',
	`RECIPIENT_NAME`		varchar(128) 	COMMENT '接收人用户名name',
	
	`DIALOG_ACTION`			int(2) 			COMMENT '发起的动作',
	
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 私信
CREATE TABLE letter (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`USER_ID`					int(11) 		COMMENT '发起人用户id',
	`SENDER_DIALOG_ID`			int(11) 		COMMENT '发起人会话id',
	
	`RECIPIENT_USER_ID`			int(11) 		COMMENT '接收人用户id',
	`RECIPIENT_DIALOG_ID`		int(11) 		COMMENT '接收人会话id',
	
	`PARENT_ID`					int(11) 		COMMENT '父私信id',
	
	`UN_READ`					int(2) 			COMMENT '是否阅读: 0=已读,1=未读',
	`CONTENT`					varchar(1024) 	COMMENT '私信内容详情',
	`LETTER_ACTION`				int(2) 			COMMENT '发起的动作',
	`LETTER_TYPE`				int(2) 			COMMENT '私信类型',
	
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 黑名单表
CREATE TABLE blacklist (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`USER_ID`			int(11) 		COMMENT '用户id',
	`BLACK_USER_ID`		int(11)			COMMENT '被黑用户id',
	`BLACK_ACTION`		int(2) 			COMMENT '被黑用户动作',
	`REMARK`			varchar(128) 	COMMENT '拉黑备注',
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 评论投票
CREATE TABLE vote (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`USER_ID`			int(11)			COMMENT '用户id',
	`NAME`				varchar(128) 	COMMENT '用户名name',
	
	`TOPIC_ID`			int(11)			COMMENT '文章id',
	`COMMENTS_ID`		int(11)			COMMENT '评论id',
	`VOTE`				int(2) 			COMMENT '投票 顶=1 踩=-1',
	
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 评论举报
CREATE TABLE report (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`USER_ID`			int(11)			COMMENT '用户id',
	`NAME`				varchar(128) 	COMMENT '用户名name',
	`TOPIC_ID`			int(11)			COMMENT '文章id',
	`COMMENTS_ID`		int(11)			COMMENT '评论id',
	
	`REPORT_TYPE`		int(2) 			COMMENT '举报原因类型:1=爆粗口 2=广告、垃圾信息 3=淫秽色情 4=政治敏感话题 0=其它',
	`CONTENT`			varchar(1024) 	COMMENT '举报内容详情',
	`HANDLE_STATE`		int(2) 			COMMENT '处理状态 0=未处理,1=已经处理,2=停止',
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

--意见与反馈
CREATE TABLE feedback (
	`ID` 			INT(11) 	NOT NULL AUTO_INCREMENT,
	`GMT_CREATE` 	DATETIME  	NOT NULL,
	`GMT_MODIFIED` 	DATETIME  	NOT NULL,
	`STATUS`		INT(2)      NOT NULL  COMMENT '记录状态: 0=正常,1=删除',

	`USER_ID`			int(11)			COMMENT '用户id',
	`NAME`				varchar(128) 	COMMENT '用户名name',
	
	`EMAIL`				varchar(512) 	COMMENT '用户电子邮件',
	`CONTENT`			varchar(1024) 	COMMENT '反馈内容详情',
	`HANDLE_STATE`		int(2) 			COMMENT '处理状态 0=未处理,1=已经处理,2=停止',
	PRIMARY KEY  (`ID`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

------------------------------------------------------------------创建表---END------------------------------------------------------------------