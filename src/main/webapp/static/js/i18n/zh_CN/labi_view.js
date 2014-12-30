/** 页面显示中的常量 */
var labi_view = {
	sms : {
		send : {
			title : "发短信",
			content: "内容",
			cont_tooLong_tips_a : "您的短信过长，将分成",
			cont_tooLong_tips_b : "条发送，是否继续发送？",
			loading : {
				cont_a : "短信正在发送：",
				cont_b : "条",
				complete_a : "短信发送完成，2秒后返回",
				complete_b : "短信发送完毕",
				to : "致",
				error : "短信发送失败！",
				success : "短信已送达"
			},
			faces: "表情",
			link: "网址",
			picture: "图片",
			contact: "联系人"
		},
		tips : {
			remove_success : "删除成功",
			addPnumToCnt : "添加到联系人",
			addPnum_title : "您可以将此号码添加到新联系人或现有联系人",
			addPnum_noChoice : "请选择要添加到的联系人",
			off : "您的手机蜡笔离线，请登录手机蜡笔后使用此功能",
			search : "搜索短信...",
			contentInput : "请输入短信内容...",
			pnumInput : "请点击左侧收件人，或直接输入姓名或号码（按Ctrl+Enter键发送）",
			sendMethod : "按Ctrl+Enter键发送",
			illegalOperation : {
				noSearchCondition : "请输入搜索条件",
				noRemoveOption : "请选择要删除的短信",
				noInputContent : "请输入短信内容",
				tooLongContent : "您所发的短信长度过长",
				noInputPnum : "请输入要发送的手机号码",
				unValidPnum : "请输入有效的手机号码",
				noReSendPnum : "请选择要重发的号码"
			},
			confirm : {
				removeOneSms : "您确定要将这条短信放到回收站吗?\n注意：这条短信将在手机上被删除！（黑莓手机除外）",
				removeSms : function(num){
					return "您确定要将这“"+num+"”条短信放到回收站吗?\n注意：这条短信将在手机上被删除！（黑莓手机除外）";
				}
			}
		},
		search : {
			tips : "搜索短信...",
			result_a : "符合“",
			result_b : "”的短信搜索结果",
			no_result: "<strong>没有符合您搜索条件的短信</strong><br />您可以通过姓名、电话号码、短信内容进行搜索"
		},
		remove : "删除",
		noData : "此分类下没有短信",
		recipient : "收件人",
		addresser : "发件人",
		op : {
			reply : {
				title : "回复"
			},
			forward : {
				title : "转发"
			},
			remove : {
				title : "删除"
			},
			dialog : {
				title : "查看对话"
			}
		},
		sendTo : "发送至",
		name : {
			"1" : "收件箱",
			"2" : "已发短信",
			"" : "全部短信"
		},
		sendError : {
			"404" : "手机蜡笔不在线，请登录手机蜡笔后重试！",
			"500" : "手机蜡笔短信发送失败，请稍后重试！",
			"100" : "手机蜡笔短信发送失败，请稍后重试！",
			"503" : "手机蜡笔短信发送失败，请稍后重试！",
			"101" : "手机蜡笔短信发送失败，请稍后重试！",
			"504" : "手机蜡笔短信发送超时，请稍后重试！"
		}
	},
	
	contact : {
		Address_Book : "蜡笔通讯录",
		info : "联系人信息",
		addTr : "添加",
		removeTr : "删除",
		group_add_title : "新建分组名称",
		group_add_opName : "新建分组",
		group_set_opName : "重命名组",
		group_remove_opName : "删除该组",
		ava_remove_opName : "删除头像",
		groupName : {
			"" : "全部联系人",
			"-10" : "未分类"
		},
		opName : {
			add : "新建联系人",
			set : "编辑联系人",
			imp : "导入",
			exp : "导出",
			print : "打印"
		},
		search_tips : "搜索联系人...",
		noData : {
			noGroup : "您没有未分组的联系人",
			inGroup : "此分组下没有联系人",
			addCnt : "添加成员",
			search : "<strong>没有符合您搜索条件的联系人</strong><br />您可以通过姓名、电话号码、公司名称、备注等信息进行搜索",
			print : "您没有联系人可供打印",
			favorite: {
				title: "常用联系人为空",
				tips: "常用联系人使用提示：",
				content: ["把您最常使用的联系人设为常用联系人，有助于更方便的使用联系人", "点击单个联系人右上角的星标记，把单个联系人设为常用联系人，再次点击取消设置"]
			}
		},
		groupInto : "分组",
		groupTo : "添加到...",
		remove : "删除",
		elemName : {
			name : "姓名",
			ln: "姓",
			fn: "名",
			nts : "备注",
			jt : "头衔",
			com : "公司",
			birth : "生日",
			ava : "头像",
			group : "分组"
		},
		attrName : {
			ph : {MP : "手机",HM : "手机(家庭)",WM : "手机(工作)",PH : "电话",HP : "电话(家庭)",WP : "电话(工作)",FX : "传真",HF : "传真(家庭)",WF : "传真(工作)",PP : "寻呼机","" : "其它电话"},
			im : {QQ : "QQ", MSN : "MSN", GTA : "Google Talk", SKY : "Skype", ICQ : "ICQ", AIM : "AIM", YAH : "YAH", JAB : "Jabber"},
			em : {HE : "邮箱(家庭)", WE : "邮箱(工作)", "" : "其它邮箱"},
			addr : {HA : "地址(家庭)", WA : "地址(工作)", OA : "其它地址"},
			wp : {"" : "网址", HW : "网址(家庭)", WW : "网址(工作)"},
			nts : {"" : "备注"}
		},
		set : "编辑",
		tips : {
			noName : "请输入姓名",
			noGroupName : "请输入分组名",
			groupIsExist : "该分组名已存在",
			addGrp_success : "成功创建新分组",
			setGrp_success : "修改成功",
			confirm : {
				removeOneCnt : "您确定要删除此联系人？\n注意：删除后，此联系人在手机上也将被删除！",
				removeCnts : function(num){
					return "您确定要删除这 "+num+" 个联系人？\n注意：删除后，这些联系人在手机上也将被删除！";
				},
				removeGrp : "您确定要删除这个联系人分组吗?\n(保留该分组中的联系人)"
			},
			noChoice_remove : "请选择要删除的联系人",
			noChoice_group : "请选择要分组的联系人",
			cnt_remove_success : "删除成功",
			addCntsToGrp_success : "已将所选联系人添加到",
			removeCntsFromGrp_success_a : "已从",
			removeCntsFromGrp_success_b : "删除所选联系人",
			search : "搜索联系人..."
		},
		addInto : "添加到...",
		removeFrom : "从以下组中删除...",
		history : {
			viewSMSSess: "查看短信记录",
			viewCRCSess: "查看通话记录",
			view : "查看修改历史",
			tips : {
				noData_1 : "此联系人没有历史修改记录",
				noData_2 : "后续您对此联系人的任何修改可在此查看"
			}
		},
		favorite: {
			"0": {title: "设置为常用联系人"},
			"1": {title: "从常用联系人中删除"}
		}
	},
		
	recipient : {
		tips : "点击选择收件人",
		title : "从联系人中添加",
		middle_left : "短信联系人",
		search : "搜索联系人...",
		middle_right_a : "收件人",
		middle_right_b : "（已添加0人）",
		noData : "您没有联系人",
		opName_remove : "移除"
	},
	
	status : {
		online : "手机蜡笔在线",
		off : "手机蜡笔离线",
		dnd : "数据读取中",
		off_tips : "本手机蜡笔不在线<br/>请启动您的手机蜡笔",
		model_set : "设置手机型号",
		status_set : "切换同步状态",
		sync_close : "手机蜡笔服务状态为”关闭同步”时将无法发送短信，是否需要开启手机蜡笔的同步服务？",
		sync_close_virtSms : "手机蜡笔服务状态为”关闭同步”时将无法创建虚拟短信，是否需要开启手机蜡笔的同步服务？",
		smsSync_manual : "手机蜡笔短信同步模式为”手动同步”时站点将无法立刻显示您已发送的短信，是否需要将其设置为“自动同步”",
		op : {
			success : "设置成功",
			remove_success : "删除成功",
			error : "操作失败,请稍后再试"
		},
		confirm_remove : "确定解除绑定？\n解除绑定后，此手机的相关信息及同步状态将被清理！",
		tips_client_remove : function(imei){
			return "注：如果已不再使用此手机，您可以“<span onclick=\"removeClient('"+imei+"');\">解除此手机和本帐号的绑定</span>”！";
		}
	},
	
	notice : {
		title : "公告",
		user : {
			win_close : "[知道了，关闭窗口吧]"
		}
	},
	
	recycle : {
		title : "联系人回收站",
		removeOn : "删除于：",
		opName : {
			remove : "彻底删除",
			removeOne : "彻底删除",
			restore : "还原",
			restoreCnts : "还原"
		},
		tips : {
			confirm : {
				removeOne : "您确定要永久删除此联系人吗?\n此操作不可撤销！",
				remove : function(num){
					return "您确定要永久删除这“"+num+"”个联系人吗?\n此操作不可撤销！";
				}
			},
			noChoice_remove : "请选择要永久删除的联系人",
			noChoice_restore : "请选择要还原的联系人",
			remove_success : "删除成功",
			restore_success : "还原成功"			
		},
		noData : {
			title : "联系人回收站为空",
			tips : "回收站使用提示：",
			content : ["联系人回收站会保存您在手机上或站点上删除的联系人数据","如果您误删了联系人数据，可在回收站内选择“还原”该联系人","如果您想彻底删除联系人数据，可在回收站内选择联系人后“清除”该数据即可"]
		}
	},
	
	clearDouble : {
		title : "联系人去重",
		tips : {
			noCondition : "请选择去重条件",
			noDouble : "没有找到您联系人中的重复项",
			noCntToMerge : "您没有选择要合并的联系人"
		},
		exact : "完全匹配",
		approximate : "近似匹配",
		similar_entries : "近似条目",
		condition : {
			name : "姓名",
			ph : "电话",
			em : "邮件"
		},
		init_a : "您联系人中找到",
		init_b : "个数据重复内容",
		init_c : "的重复内容",
		init_exact : "在此过程中，这些内容会经过您同意安全的删除。",
		init_approximate : "当点击下一步时，您将有机会合并这些重复内容，以便完全控制您想要保留的详细信息",
		process_a : "重复联系人合并处理中",
		process_ba : "将合并",
		process_bb : "个近似匹配数据",
		process_c : "建议合并的重复数据内容",
		process_d : "预览合并后的结果",
		rightInfo : "这是正确的联系人信息",
		last_aa : "将从您的联系人数据中合并以下",
		last_ab : "项重复内容，点击“完成”将更改应用于联系人。",
		last_b : "请查阅将要删除和合并的联系人",
		last_ca : "将从您的联系人数据中删除下列",
		last_cb : "个重复内容",
		last_da : "将合并下列",
		last_db : "个近似匹配内容",
		finish_a : "正在处理您的联系人数据，请稍后...",
		finish_b : "正在删除完全匹配项",
		finish_c : "正在合并近似匹配项：",
		finish_d : "当前处理进度：",
		finish_e : "您的联系人重复数据已成功去除！",
		finish_f : "3秒后页面将自动跳转到蜡笔主页面，您也可以手动",
		finish_g : "点击这里跳转"
	},
	
	cntSel : {
		title : "选择联系人到此分组",
		cnt : "联系人",
		top_a : "（已添加",
		top_b : "人）"
	},
	
	dialog : {
		tips : {
			noData : "您没有与此人的对话",
			hideDialog : "收起对话",
			remove_success : "删除成功",
			confirm_remove : "您确定要将与此人的对话放到回收站吗？\n注意：与此人的对话将在手机上被删除！（黑莓手机除外）"
		},
		opName : {
			ex : "导出对话",
			remove : "删除对话"
		},
		ex_a : "请输入验证码后再导出对话",
		code : "验证码",
		code_tips : "(请输入图片中的数字)",
		code_change : "看不清换一张",
		me : "我："
	},
	
	tools : {
		title : "工具",
		ex_help_title : "如何将导出文件导入到以下服务："
	},
	
	set : {
		title : "设置",
		card : {
			title : "我的名片",
			nts : "自我介绍",
			set : "名片设置"
		},
		phone : {
			title : "我的手机",
			tips : {
				noData : {
					a : "您的帐号还没有绑定手机！请下载安装手机蜡笔后使用",
					b : "手机蜡笔是一款安装并运行在手机上的软件。没有它，我们将无法为您提供服务",
					c : "立即下载手机蜡笔>>"
				},
				brand_sel : "请选择手机品牌",
				model_sel : "请选择手机型号",
				noModelSel : "请选择您要设置的手机型号"
			},
			opName_change : "更改",
			noModel : "未知型号",
			brand : "品牌",
			model : "手机型号",
			model_a : "型号",
			model_change : "更改手机型号",
			pnum : "手机号码",
			timezone : "手机时区",
			version : "软件版本",
			remind : "站点登录提醒",
			state : "同步服务",
			sync : "同步状态",
			sync_auto : "自动同步",
			sync_manual : "手动同步",
			sync_open : "开启同步",
			sync_close : "关闭同步",
			open : "开启",
			close : "关闭",
			sms : "短信",
			contact : "联系人",
			crc: "通话记录",
			labiSet : "手机蜡笔设置",
			blackBerry : "黑莓"
		},
		account : {
			title : "帐号密码",
			password_change : "修改密码",
			email_change : "修改保密邮箱",
			data_clear : "清除帐号数据",
			button_clear : "一键清除帐号数据",
			username : "用户名",
			password : "密码",
			a : "如果不是您的帐号请点击此处",
			tips : {
				noPasswordInput : "请输入密码",
				confirm_clear : "您确定要一键清除您在蜡笔站点的所有数据吗？\n此操作不可恢复！",
				finish_a : "您在蜡笔站点的所有数据已经全部清除。\n3秒钟后页面将自动跳转到蜡笔首页，您可以手动",
				finish_b : "点击此链接跳转"
			},
			check : {
				labi_logout : "请确保您手机上的手机蜡笔软件已退出",
				data_exist : "请确保您手机上的短信、联系人数据依然存在"
			}
		},
		
		no_active : "此手机蜡笔未激活！",
		no_active_tips : "请打开此手机上的手机蜡笔软件“激活”后进行相关设置。"
	},
	
	newUser : {
		sms : {
			title : "您的帐号没有短信记录",
			opTitle : "如果您想把手机短信同步到蜡笔页面请按以下步骤操作：",
			opStep1 : "1.绑定手机",
			opStep2 : "2.同步数据",
			opStep1_cont_a : "立即下载手机蜡笔",
			opStep1_cont_b : "安装后按提示绑定蜡笔帐号",
			opStep2_cont : "手机功能表里打开“安装”文件夹 > 点击蜡笔图标登录，登录后您可以按照个人需求将手机数据自动同步到蜡笔页面"
		}
	},
	
	button : {
		value : {
			send : "发送",
			confirm : "确定",
			cancel : "取消",
			reSend : "重发失败短信",
			save : "保存",
			next : "下一步",
			back : "返回",
			skip : "跳过",
			merge : "审批",
			skipAll : "全部跳过",
			mergeAll : "全部审批",
			finish : "完成",
			ex : "导出",
			newCnt : "新建",
			addToCnt : "添加到现有",
			save_and_continue : "保存并新建",
			insert: "插入"
		}
	},
	
	goTop : "回到顶部",
	
	selectAll : "全选",
	
	nextPage : "下页",
	
	smsTips : {
		title : "蜡笔提示您：",
		a : "您有",
		b : "条新短信，点击查看"
	},
	
	code : {
		timeout : "验证码已超时",
		error : "您输入的数字与图片数字不符"
	},
	
	noName : "未命名",
	
	pleaseSelect : "请选择",
	
	please_select_group : "分组到",
	
	avatar_upload : "头像上传",
	
	tips : {
		off : "您的手机蜡笔离线，请登录手机蜡笔后使用此功能",
		op_fail : "操作失败，请稍后再试"
	},
	
	search_result : "搜索结果",
	
	a : "个",
	
	back : "<< 返回",
	
	sort : "排序",
	
	eachPage : "/页",
	
	year : "年",
	
	month : "月",
	
	day : "日"
};

var labiTips = {
	removeSmsSuccess : "成功删除1条短信",
	removeSmsFailed : "短信删除失败，请稍后再试",
	sendSmsSuccess : "短信发送成功",
	issueSmsSuccess : "短信已下发到手机蜡笔",
	sendSmsFailed : "短信发送失败，请稍后再试",
	removeSmsDlgSuccess : "删除成功",
	removeSmsDlgFailed : "删除对话失败，请稍后再试",
	addCntSuccess : "联系人新建成功",
	addCntFailed : "保存信息时出错，操作失败，请稍后再试",
	setCntSuccess : "联系人信息修改成功",
	setCntFailed : "保存信息时出错，操作失败，请稍后再试",
	removeCntSuccess : "成功删除1个联系人",
	removeCntFailed : "联系人删除失败，请稍后再试",
	removeGrpSuccess : "成功删除该分组",
	operationFailed : "操作失败，请稍后再试",
	setCardSuccess : "您的名片修改成功",
	setCardFailed : "名片修改失败，请稍后再试",
	netError : "本地网络异常，请检查后重试",
	timeoutError : "网络超时，请检查本地网络后重试",
	loading : "数据加载中…",
	cntDataLoading : "联系人数据加载中…",
	emptyRecycleFailed : "操作失败，请稍后再试",
	restoreCntsFailed : "操作失败，请稍后再试",
	setPHModelSuccess : "手机型号修改成功",
	setPHModelFailed : "手机型号修改失败，请稍后再试",
	phNotValid : "手机号格式不合法",
	emNotValid : "邮件格式不合法",
	setAvaSuccess : "头像更新成功",
	setAvaFailed : "头像更新失败，请稍后再试",
	addVirtualSmsSuccess : "虚拟短信创建成功",
	addVirtualSmsFailed : "虚拟短信创建失败",
	noEnterName : "请输入姓名",
	noEnterPnum : "请输入号码",
	noEnterMsg : "请输入短信内容",
	noSelDt : "请选择时间"
};