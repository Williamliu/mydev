/************************************************************************************/
/*  JQuery Plugin:  LOADING                                                       	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-3-30      															*/
/*  Files: 	jquery.lwh.loading.js ;  jquery.lwh.loading.css							*/
/************************************************************************************/
$.fn.extend({
	wliuLoad:function( opts ){
		var def_settings = {
								title:		"Loading...",
								maskable:   1
						   };
		$.extend(def_settings, opts);
		
		var mask_ifrm	= ".wliu-loading-mask-ifrm";
		var mask_div	= ".wliu-loading-mask-div";

		if($(mask_ifrm).length <= 0 )	{
			$(document.body).append('<iframe class="wliu-loading-mask-ifrm"></iframe>');
		} 
		if($(mask_div).length <= 0 ) 	{
			$(document.body).append('<div class="wliu-loading-mask-div"></div>');
		}

		return this.each( function(idx, el) { 
			$(el).data("defSet", def_settings);
			if( !$(el).hasClass("wliu-loading") ) $(el).addClass("wliu-loading");
			if( $(el).has("i.fa").length<=0 ) $(el).prepend('<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>');
			if( $(el).has("div.wliu-loading-text").length<=0 ) $(el).append('<div class="wliu-loading-text">' + def_settings.title + '</div>');

			 $(el).unbind("show").bind("show", function (evt, msg) {
				 if( $(el).data("defSet").maskable ) {
				 	$(mask_ifrm).show();
				 	$(mask_div).show();
			 	 }

				 $(el).show();
			});
			 $(el).unbind("hide").bind("hide", function (evt, msg) {
				 $(el).hide();
				 if( $(el).data("defSet").maskable ) {
					 $(mask_div).hide();
					 $(mask_ifrm).hide();
				 }
			});
		});
	},


	wliuTips:function( opts ){
		var def_settings = {
								hAlign:		"center",   //"left", "center", "right"
								vAlign:		"middle",  //"top", 	"middle", "bottom"
								offsetww:	20,
								offsethh:	20,
								type:       ""	
						   };
		$.extend(def_settings, opts);

		return this.each( function(idx, el) { 
			$(el).data("defSet", def_settings);
			if( !$(el).hasClass("wliu-tips") ) $(el).addClass("wliu-tips");

			$(el).unbind("show").bind("show", function (evt, msg, type) {
				var defSettings = $(el).data("defSet");
				defSettings.type = type?type:defSettings.type;
				$(el).data("defSet", defSettings);
				//console.log($(el).data("defSet"));
				switch(defSettings.hAlign) {
					 case "center":
					 	$(el).css({"left":"50%", "margin-left":"-100px"});
					 	break;
					 case "left":
					 	$(el).css({"left":"0px", "margin-left": parseInt(defSettings.offsetww) + "px"});
					 	break;
					 case "right":
					 	$(el).css({"right":"0px", "margin-right": parseInt(defSettings.offsetww) + "px"});
					 	break;
				}

				switch(defSettings.vAlign) {
					 case "middle":
					 	$(el).css({"top":"50%", "margin-top":"-36px"});
					 	break;
					 case "top":
					 	$(el).css({"top":"0px", "margin-top": parseInt(defSettings.offsethh) + "px"});
					 	break;
					 case "bottom":
					 	$(el).css({"bottom":"0px", "margin-bottom": parseInt(defSettings.offsethh) + "px"});
					 	break;
				}

				switch(defSettings.type) {
					 case "info":
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger");
					 	break;
					 case "success":
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger").addClass("wliu-tips-success");
					 	break;
					 case "warning":
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger").addClass("wliu-tips-warning");
					 	break;
					 case "danger":
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger").addClass("wliu-tips-danger");
					 	break;
					 default: 
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger");
					    break;
				}
				$(el).html(msg).show();
			});

			$(el).unbind("hide").bind("hide", function (evt) {
				$(el).hide();
			});

			$(el).unbind("auto").bind("auto", function (evt, msg, type) {
				var defSettings = $(el).data("defSet");
				defSettings.type = type?type:defSettings.type;
				$(el).data("defSet", defSettings);

				switch(defSettings.hAlign) {
					 case "center":
					 	$(el).css({"left":"50%", "margin-left":"-100px"});
					 	break;
					 case "left":
					 	$(el).css({"left":"0px", "margin-left": parseInt(defSettings.offsetww) + "px"});
					 	break;
					 case "right":
					 	$(el).css({"right":"0px", "margin-right": parseInt(defSettings.offsetww) + "px"});
					 	break;
				}

				switch(defSettings.vAlign) {
					 case "middle":
					 	$(el).css({"top":"50%", "margin-top":"-32px"});
					 	break;
					 case "top":
					 	$(el).css({"top":"0px", "margin-top": parseInt(defSettings.offsethh) + "px"});
					 	break;
					 case "bottom":
					 	$(el).css({"bottom":"0px", "margin-bottom": parseInt(defSettings.offsethh) + "px"});
					 	break;
				}

				switch(defSettings.type) {
					 case "info":
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger");
					 	break;
					 case "success":
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger").addClass("wliu-tips-success");
					 	break;
					 case "warning":
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger").addClass("wliu-tips-warning");
					 	break;
					 case "danger":
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger").addClass("wliu-tips-danger");
					 	break;
					 default: 
					 	$(el).removeClass("wliu-tips-success wliu-tips-warning wliu-tips-danger");
					    break;
				}

				$(el).stop(true, true).html(msg).fadeIn(10).delay(2000).fadeOut(1000);
			});

		});
	}
});

