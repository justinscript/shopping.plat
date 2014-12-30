
$.fn.extend({
	cursorPosition:function( value ){
		var elem = this[0];
			if (elem&&(elem.tagName=="TEXTAREA"||elem.type.toLowerCase()=="text")) {
			   if($.browser.msie){
					   var rng;
					   if(elem.tagName == "TEXTAREA"){ 
						    rng = event.srcElement.createTextRange();
						    //rng.moveToPoint(event.x,event.y);
					   }else{
					    	rng = document.selection.createRange();
					   }
					   if( value === undefined ){
					   	 rng.moveStart("character",-event.srcElement.value.length);
					     return  rng.text.length;
					   }else if(typeof value === "number" ){
					   	 var index=this.position();
						 index>value?( rng.moveEnd("character",value-index)):(rng.moveStart("character",value-index))
						 rng.select();
					   }
				}else{
					if( value === undefined ){
					   	 return elem.selectionStart;
					   }else if(typeof value === "number" ){
					   	 elem.selectionEnd = value;
       			         elem.selectionStart = value;
					   }
				}
			}else{
				if( value === undefined )
				   return undefined;
			}
	}
})
