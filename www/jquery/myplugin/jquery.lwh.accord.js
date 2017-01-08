/************************************************************************************/
/*  JQuery Plugin:  LOADING                                                       	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-3-30      															*/
/*  Files: 	jquery.lwh.loading.js ;  jquery.lwh.loading.css							*/
/************************************************************************************/
$.fn.extend({
    lwhAccord: function (opts) {
        var def_settings = {
            zIndex: 60,
            single: true,
            match: false,
            selectvals: { pid: "", sid: "" },
            click: null
        };
        $.extend(def_settings, opts);

        return this.each(function (idx, el) {
            $(el).data("default_settings", def_settings);
            $(el).css("zIndex", def_settings.zIndex);
            $("> li", el).bind("click", function (ev) {
                if ($(this).hasClass("open")) {
                    if (def_settings.single)
                        $("> li", el).removeClass("open").addClass("close");
                    else
                        $(this).removeClass("open").addClass("close");

                } else {
                    if (def_settings.single) {
                        $("> li", el).removeClass("open");
                        $(this).removeClass("close").addClass("open");
                    } else {
                        $(this).removeClass("close").addClass("open");
                    }
                }
                return false;
            });


            $("> li > ul > li", el).bind("click", function (ev) {
                if (!$(this).hasClass("selected")) {
                    $("> li > ul > li", el).removeClass("selected");
                    $(this).addClass("selected");
                    if (def_settings.click) if ($.isFunction(def_settings.click)) def_settings.click($(this).attr("pid"), $(this).attr("sid"));
                }
                return false;
            });


            $("> li", el).each(function (idx1, el1) {
                if (def_settings.match) {
                    if ($(el1).has("ul").length <= 0) $(el1).hide();
                }
                if (def_settings.selectvals.pid) {
                    if ($(el1).attr("pid") == def_settings.selectvals.pid) {

                        if (def_settings.single) {
                            $("> li", el).removeClass("open");
                            $(this).removeClass("close").addClass("open");
                        } else {
                            $(this).removeClass("close").addClass("open");
                        }

                        $("> ul > li", el1).each(function (idx2, el2) { 
                            if($(el2).attr("pid") == def_settings.selectvals.pid && $(el2).attr("sid") == def_settings.selectvals.sid ) {
                                $("> li > ul > li", el).removeClass("selected");
                                $(el2).addClass("selected");                
                                if (def_settings.click) if ($.isFunction(def_settings.click)) def_settings.click(def_settings.selectvals.pid, def_settings.selectvals.sid);
                            }
                        });
                    }
                }
            });

        });
    },

    lwhAccord_select: function (opts) {
        return this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");
            def_settings.selectvals = opts;
            $(el).data("default_settings", def_settings);

            $("> li", el).each(function (idx1, el1) {
                if (def_settings.selectvals.pid) {
                    if ($(el1).attr("pid") == def_settings.selectvals.pid) {

                        if (def_settings.single) {
                            $("> li", el).removeClass("open");
                            $(this).removeClass("close").addClass("open");
                        } else {
                            $(this).removeClass("close").addClass("open");
                        }

                        $("> ul > li", el1).each(function (idx2, el2) { 
                            if($(el2).attr("pid") == def_settings.selectvals.pid && $(el2).attr("sid") == def_settings.selectvals.sid ) {
                                $("> li > ul > li", el).removeClass("selected");
                                $(el2).addClass("selected");                
                                if (def_settings.click) if ($.isFunction(def_settings.click)) def_settings.click(def_settings.selectvals.pid, def_settings.selectvals.sid);
                            }
                        });
                    }
                }
            });

        });
    },
	
	

    lwhAccd: function (opts) {
        var def_settings = {
            zIndex: 	60,
            single: 	false,
            selectvals: { pid: "", sid: "" },
			showall: 	true
        };
        $.extend(def_settings, opts);

        return this.each(function (idx, el) {
            $(el).data("default_settings", def_settings);
            $(el).css("zIndex", def_settings.zIndex);
            if( def_settings.showall ) $("> li", el).addClass("selected");
			
			$("> li > ul", el).bind("click", function (ev) {
				ev.stopPropagation();
			});
			
			$("> li", el).bind("click", function (ev) {
                if ($(this).hasClass("selected")) {
                    if (def_settings.single)
                        $("> li", el).removeClass("selected");
                    else
                        $(this).removeClass("selected");

                } else {
                    if (def_settings.single) {
                        $("> li", el).removeClass("selected");
                        $(this).addClass("selected");
                    } else {
                        $(this).addClass("selected");
                    }
                }
                return false;
            });
        });
    }
	

});
