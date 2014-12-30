//链接点击数统计
function linksClickStat(id, source) {
	if (source == undefined) {
		source ='';
	}
	var G = $.gozap,L = G.labi;
	var submitUrl = "/link/clickcount/update?"+G.param({linksId: id,source:source});
	L.ajax({
		url : submitUrl,
		success :  function(info){	
			if (info.code=="9999") {
			} else {
			}
		}
	})
}

//版本切换统计
function versionStat() {
	var G = $.gozap,L = G.labi;
	var submitUrl = "/version/stat";
	L.ajax({
		url : submitUrl,
		type : "POST",
		data:G.param({version: "2.0"}),
		success :  function(info){	
			window.location.reload();
			if (info.code=="9999") {
			} else {
			}
		}
	})
}