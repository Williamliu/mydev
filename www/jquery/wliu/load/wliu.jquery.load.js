/************************************************************************************/
/*  JQuery Plugin:  load                                                       	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-3-30      															*/
/*  Files: 	jquery.lwh.load.js ;  jquery.lwh.load.css							*/
/************************************************************************************/
$.fn.extend({
	wliuLoad:function( opts ){
		var def_settings = {
								title:		"Loading...",
								maskable:   0
						   };
		$.extend(def_settings, opts);
		
		var mask_ifrm	= "iframe[wliu-load-mask]";
		var mask_div	= "div[wliu-load-mask]";

		if($(mask_ifrm).length <= 0 )	{
			$(document.body).append('<iframe wliu-load-mask></iframe>');
		} 
		if($(mask_div).length <= 0 ) 	{
			$(document.body).append('<div wliu-load-mask></div>');
		}

		return this.each( function(idx, el) { 
			if( !$(el).hasAttr("wliu-load") ) $(el).addAttr("wliu-load");
			if( $(el).has("i.fa").length<=0 ) $(el).prepend('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>');
			if( $(el).has("div[wliu-load-text]").length<=0 ) $(el).append('<div wliu-load-text>' + def_settings.title + '</div>');
			if( def_settings.maskable || $(el).hasAttr("maskable") ) $(el).addAttr("maskable");
			 $(el).unbind("show").bind("show", function (evt, msg) {
				 if( $(el).hasAttr("maskable") ) {
				 	$(mask_ifrm).show();
				 	$(mask_div).show();
			 	 }

				 $(el).show();
			});
			 $(el).unbind("hide").bind("hide", function (evt, msg) {
				 $(el).hide();
				 if( $(el).hasAttr("maskable") ) {
					 $(mask_div).hide();
					 $(mask_ifrm).hide();
				 }
			});
		});
	},


	wliuTips:function( opts ){
		var def_settings = {
								offsetww:	20,
								offsethh:	20,
								type:       ""	
						   };
		$.extend(def_settings, opts);

		return this.each( function(idx, el) { 
			if( !$(el).hasAttr("wliu-tips") ) $(el).addAttr("wliu-tips");

			$(el).unbind("show").bind("show", function (evt, msg, type) {
				$(el).css({"left":"50%", "margin-left":"-100px"});
				if( $(el).hasAttr("center") ) 	$(el).css({"left":"50%", "margin-left":"-100px"});
				if( $(el).hasAttr("left") ) 	$(el).css({"left":"0px", "margin-left": parseInt(def_settings.offsetww) + "px"});
				if( $(el).hasAttr("right") ) 	$(el).css({"right":"0px", "margin-right": parseInt(def_settings.offsetww) + "px"});
				
				$(el).css({"top":"50%", "margin-top":"-36px"});
				if( $(el).hasAttr("middle") ) 	$(el).css({"top":"50%", "margin-top":"-36px"});
				if( $(el).hasAttr("top") ) 		$(el).css({"top":"0px", "margin-top": parseInt(def_settings.offsethh) + "px"});
				if( $(el).hasAttr("bottom") ) 	$(el).css({"bottom":"0px", "margin-bottom": parseInt(def_settings.offsethh) + "px"});
				
				if(type) {
					$(el).removeAttr("success warning danger");
					$(el).addAttr(type);
				} 
				if( $(el).hasAttr("success") ) 	$(el).removeAttr("success warning danger").addAttr("success");			
				if( $(el).hasAttr("warning") ) 	$(el).removeAttr("success warning danger").addAttr("warning");			
				if( $(el).hasAttr("danger") ) 	$(el).removeAttr("success warning danger").addAttr("danger");	
				if(msg!=undefined)		
					$(el).html(msg).show();
				else 
					$(el).show();
			});

			$(el).unbind("hide").bind("hide", function (evt) {
				$(el).hide();
			});

			$(el).unbind("auto").bind("auto", function (evt, msg, type) {
				$(el).css({"left":"50%", "margin-left":"-100px"});
				if( $(el).hasAttr("center") ) 	$(el).css({"left":"50%", "margin-left":"-100px"});
				if( $(el).hasAttr("left") ) 	$(el).css({"left":"0px", "margin-left": parseInt(def_settings.offsetww) + "px"});
				if( $(el).hasAttr("right") ) 	$(el).css({"left":"auto", "right":"0px", "margin-right": parseInt(def_settings.offsetww) + "px"});
				
				$(el).css({"top":"50%", "margin-top":"-36px"});
				if( $(el).hasAttr("middle") ) 	$(el).css({"top":"50%", "margin-top":"-36px"});
				if( $(el).hasAttr("top") ) 		$(el).css({"top":"0px", "margin-top": parseInt(def_settings.offsethh) + "px"});
				if( $(el).hasAttr("bottom") ) 	$(el).css({"top":"auto", "bottom":"0px", "margin-bottom": parseInt(def_settings.offsethh) + "px"});
				
				if(type) {
					$(el).removeAttr("success warning danger");
					$(el).addAttr(type);
				} 
				if( $(el).hasAttr("success") ) 	$(el).removeAttr("success warning danger").addAttr("success");			
				if( $(el).hasAttr("warning") ) 	$(el).removeAttr("success warning danger").addAttr("warning");			
				if( $(el).hasAttr("danger") ) 	$(el).removeAttr("success warning danger").addAttr("danger");			
				if(msg!=undefined)		
					$(el).stop(true, true).html(msg).fadeIn(10).delay(2000).fadeOut(1000);
				else 
					$(el).stop(true, true).fadeIn(10).delay(2000).fadeOut(1000);
			});

		});
	}
});

$(function(){
    $("div[wliu-load]").wliuLoad({});
    $("div[wliu-tips]").wliuTips({});
});