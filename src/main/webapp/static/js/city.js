//显示省
function initProvice(proveName, cityName) {
	
	var url = "/link/cityCode.do?parentId=0";
	
	var names = "", ids = "", selectId = '', nameStr = '';
	
	$.ajax({
		url : url,
		dataType : "json",
		success : function(infos){
			
			$("#proveName").html("");
			
			var $data2 = infos.data;
			
			for(var i=0;i<$data2.length;i++) {
				
				names = $data2[i].name;
				ids = $data2[i].id;
				
				nameStr += "<option value='"+ids+"'>"+names+"</option>";
								
				if(names == proveName) {
					
					selectId = ids;
				}
			}
			
			//当没有选择时
			if("-请选择-" == proveName) {
				
				nameStr = "<option value=''>-请选择-</option>" + nameStr + "<option value='00000'>国外</option>";
				
				$("#proveName").append(nameStr);
				
				$("#cityName").html("<option value=''>-请选择-</option>");
				
				return;
			}
			
			if("国外" == proveName) {
				
				nameStr = nameStr + "<option value='00000'>国外</option>";
				
				$("#proveName").append(nameStr);
				
				$("#proveName option[value='00000']").attr("selected", "selected");
				
				$("#cityName").html("<option value='国外'>国外</option>");
				
				return;
			}
			
			nameStr += "<option value='00000'>国外</option>";
			
			$("#proveName").append(nameStr);
			
			//选中省份
			$("#proveName option[value='"+selectId+"']").attr("selected", "selected");
			
			//显示相应的省份下的市
			setcity(selectId, cityName);
			
		}		
		
	})
	
}

//显示相应的城市
function setcity(proveId, cityName) {
		
	var url = "/link/cityCode.do?parentId="+proveId;
	
	var names = "", ids = "", selectId = '', cityStr = '';
	
	$("#cityName").html("");
	
	//如果省份没有选择，则市显示请选择
	if(proveId == '') {
		
		$("#cityName").html("<option value=''>-请选择-</option>");
		
		return;
		
	} else {
		
		//增加国外
		if(proveId == '00000') {
			
			$("#cityName").html("<option value='国外'>国外</option>");
			
			return;
			
		}
	}
	
	$.ajax({
		url : url,
		dataType : "json",
		success : function(infos){
			
			var $data2 = infos.data;
			
			for(var i=0;i<$data2.length;i++) {
				
				names = $data2[i].name;
				ids = $data2[i].id;
				
				cityStr += "<option value='"+names+"'>"+names+"</option>";				
			}
			
			$("#cityName").append(cityStr);
			
			//选中市
			if(cityName != ''){
			
				$("#cityName option[value='"+cityName+"']").attr("selected", "selected");
				
			} else {
				
			}
						
		}		
		
	})
}