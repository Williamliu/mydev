/************************************************************************************/
/*  JQuery Plugin Text Disable Selection on Webpage            		                */
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-1-25      															*/
/*  Files: 	jquery.lwh.selection.js													*/
/************************************************************************************/
// only support  $(document).disableSelect;
$.fn.extend({
	disableSelect : function(opts) {
		var def_settings = {
						textSelect:		false,
						dragSelect:		false,
						ctrlA:			false,
						except:			""
				  };
		$.extend(def_settings, opts);
		
		if( !def_settings.textSelect ) {
				$(this).unbind("selectstart").bind("selectstart",function(ev){ 
						var tt = ev.target || ev.srcElement;
						if( $(tt).is(":input") || $(tt).not(def_settings.except).length <= 0 ) return true; else return false;
				});
		}
		
		if( !def_settings.dragSelect ) {
				$(this).unbind("mousedown").bind("mousedown",function( ev ){ 
					var tt = ev.target || ev.srcElement;
					if( $(tt).is(":input") || $(tt).not(def_settings.except).length <= 0) return true;  else return false;
				});
		}
		
		if( !def_settings.ctrlA ) {
				$(this).unbind("keydown").bind("keydown",function( ev ){ 
					var tt = ev.target || ev.srcElement;
					if( $(tt).is(":input") || $(tt).not(def_settings.except).length <= 0 ) return true;
					
					if( ev.ctrlKey && ( ev.keyCode == 65 || ev.keyCode == 97 ) ) 
						return false;
					else 
						return true;
				});
		}
	}
});
