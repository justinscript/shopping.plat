/**
 * 合法性检测
 * 
 */
var gozapCommon = {
	
	/** 判断是否为空 */
	isEmpty : function(obj){
		if (null == obj || "" == $.trim(obj) || "undefined" == obj) {
			return true;
		}
		return false;
	},
	
	/** 判断是否在一个长度范围之内(包含起始和结束) */
	isBetweenLength : function(obj, start, end){
		if (obj.length >= start && obj.length <= end) {
			return true;
		}
		return false;
	},

	/** 判断是否是gozap允许的用户名 */
	isUserName : function(s){
		// 只允许数字、字母、下划线或组合
		if (/^[0-9A-Za-z_]*$/.test(s)) {
			return true;
		}
		return false;
	},
	
	/** 判断email格式是否正确 */
	isEmail : function(s){
		if (/^[_a-zA-Z0-9.]+@([_a-z0-9]+\.)+[a-z0-9]{2,3}$/.test(s)) {
			return true;
		}
		return false;
	},
	/** 判断手机号格式是否正确 */
	isPhone : function(s){
		var myreg = /^1[3|4|5|8][0-9]\d{4,8}$/;
		if(myreg.test(s)) {
			return true;
		}
		return false;
	},
	
	/** 判断是否打开大小写转换键 */
	isOpenCapsLock : function(event){
		// 兼容浏览器的event事件 
		var e = event || window.event;
		// 兼容获取浏览器的事件目标对象
		var o = e.target || e.srcElement;
		// 对象的下一个对象
		var oTip = o.nextSibling;
		// 获取事件keyCode
		var keyCode = e.keyCode || e.which;
		// 判断是都按住shift建
		var isShift = e.shifKey || (keyCode == 16) || false;
		
		// 判断是否开启大小写转换键，和是否按住shift键
		if (((keyCode >= 65 && keyCode <= 90) && !isShift) || ((keyCode >= 97 && keyCode <= 122) && isShift)) {
			return true;
		}
		else {
			return false;
		}
	},
	
	/** 判断浏览器是否支持cookie */
	isCookieEnabled : function(){
		return navigator.cookieEnabled ? true : false
	},
	
	/** 返回页面顶部 */
	goTop : function(){
		window.scrollTo(0,0);
	},
	
	/** 滚动条居下 */
	goBottom : function(){
		window.scrollTo(0,document.body.scrollHeight);
	}
}

/**
 * 密码强度
 * 
 */
var passwordStrength = {
	/** 创建密码强度样式 */
	/*
	createPSStyle : function(id){
		var html = "";
		html += "<a href=\"javascript:void(0);\" class=\"reg_mmqd\">密码强度</a>";
        html += "<span id=\"reg_mmk1\" class=\"reg_mmk\"></span><span id=\"reg_mmk2\" class=\"reg_mmk\"></span><span id=\"reg_mmk2\" class=\"reg_mmk\"></span><span id=\"reg_mmk2\" class=\"reg_mmk\"></span>";
		$("#"+id+"").html(html);
	},
	*/
	/** 修改密码强度样式 */
	changePS : function(p, thisObj){
		if (p == 0) {
			$(thisObj).css({"width":"88px", "background-color":"#fff"});
		}
		else if (p <= 25 && p > 0) {
			$(thisObj).css({"width":"22px", "background-color":"#ff0000"});			
		}
		else if (p > 25 && p <= 50) {
			$(thisObj).css({"width":"44px", "background-color":"#ff9900"});
		}
		else if (p > 50 && p <= 75) {
			$(thisObj).css({"width":"66px", "background-color":"#0099ff"});
		}
		else if (p > 75 && p <= 100) {
			$(thisObj).css({"width":"88px", "background-color":"#009933"});
		}
	},
	/*
	/** 显示 
	show : function(id){
		if ($.trim($("#"+id+"").html()) == "") {
			passwordStrength.createPSStyle(id);
		}
		else {
			$("#"+id+"").css("display", "block");
		}
	},
	
	/** 隐
	hide : function(id){
		$("#"+id+"").css("display", "none");
	},
	*/
	/** 密码强度策略 */
	/*
	 * 
		// 根据密码的强弱划分为4个等级，分别为：安全、强、中等、弱
		// 采用评分的机制对4个等级做划分，分别为：安全（>=75）、强（75< && >=50）、中等（50< && >=25）、弱（25<）
		// 每个等级在样式的显示上为一格，当密码达到某个等级时，修改每个格 的样式
		
		// 评分机制如下
		// ------------------------------------------
		// 长度（根据需求定义，密码长度在6-16位之间）
		// 5分/6-8位
		// 10分/9-12位
		// 25分/13-16位
		// ------------------------------------------
		
		// ------------------------------------------
		// 字母
		// 0分/不含字母
		// 10分/全部是小写字母
		// 20分/大小写字母混合
		// ------------------------------------------
		
		// ------------------------------------------
		// 数字
		// 0分/不含数字
		// 10分/含1个数字
		// 15分/含有大于一个数字
		// ------------------------------------------
		
		// ------------------------------------------
		// 特殊字符
		// 0分/不含特殊字符
		// 10分/含1个特殊字符
		// 25分/含有大于一个特殊字符
		// ------------------------------------------
		
		// ------------------------------------------
		// 附加分数
		// 2分/如果有字母和数字混合
		// 3分/同时含有字母、数字、特殊字符
		// 5分/同时含有大小写字母、数字、特殊字符
		// ------------------------------------------
	 * 
	 */
	policy : function(s){
		// 分数
		var points = 0;
		
		if (s.length >= 6) {
			// 处理长度
			if (s.length >= 6 && s.length <= 8) {
				points += 5;
			}
			else if (s.length >= 9 && s.length <= 12) {
				points += 10;
			}
			else if (s.length >= 13 && s.length <= 16) {
				points += 25;
			}
			
			// 处理字母
			// 判断全部是否是小写字母
			if (/^[a-z]+$/.test(s)) {
				points += 10;
			}
			
			// 判断大小写混合
			if (/[a-z]+/.test(s) && /[A-Z]+/.test(s)) {
				points += 20;
			}
			
			// 处理数字
			// 含有两个数字以上的
			if (/\d{2,}|(\d(\w+)\d)+/.test(s)) {
				points += 20;
			}
			// 含有一个数字
			else if (/\d{1}/.test(s)) {
				points += 10;
			}
			
			// 处理特殊字符
			// 含有两个特殊字符以上的
			if (/\W{2,}|\W(\w+)\W/.test(s)) {
				points += 25;
			}
			// 含有一个特殊字符的
			else if (/\W{1}/.test(s)) {
				points += 10;
			}
			
			// 附加分
			if (/[a-z]/.test(s) && /[A-Z]/.test(s) && /\d/.test(s) && /\W/.test(s)) {
				points += 5;
			}
			else if (/[a-z|A-Z]/.test(s) && /\d/.test(s) && /\W/.test(s)) {
				points += 3;
			}
			else if (/[a-z|A-Z]/.test(s) && /\d/.test(s)) {
				points += 2;
			}

		} else if(s.length > 0 && s.length < 6) {
			points += 1;
		}
		return points;
	}
	
}
