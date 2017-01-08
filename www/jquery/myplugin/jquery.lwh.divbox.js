/************************************************************************************/
/*  JQuery Plugin:  LOADING                                                       	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-3-30      															*/
/*  Files: 	jquery.lwh.loading.js ;  jquery.lwh.loading.css							*/
/************************************************************************************/
$.fn.extend({
    lwhDivBox: function (opts) {
        var def_settings = {
            container: 	"",
			offsetto:  	"",
			offsetww:	0,
			offsethh:	0,
            maskable: 	true,
			content:  	"",
            zIndex: 	8000,
			before:		null,
			after:		null
        };
        $.extend(def_settings, opts);

        var mask_zidx = def_settings.zIndex;
        var mask_ifrm = "#lwhDivBox_mask_ifrm";
        var mask_div = "#lwhDivBox_mask_div";
        if ($(mask_ifrm).length <= 0 && def_settings.maskable) {
            $(document.body).append('<iframe id="lwhDivBox_mask_ifrm" class="lwhDivBox-mask-ifrm" style="z-index:' + (mask_zidx - 2 ) + ';"></iframe>');
        }

        if ($(mask_div).length <= 0 && def_settings.maskable) {
            $(document.body).append('<div id="lwhDivBox_mask_div" class="lwhDivBox-mask-div" style="z-index:' + (mask_zidx - 1) + ';"></div>');
        }
        def_settings.zIndex = mask_zidx + 2;

        return this.each(function (idx, el) {
            def_settings.ww  = $(el).attr("ww")?$(el).attr("ww"):def_settings.ww;
            def_settings.hh = $(el).attr("hh")?$(el).attr("hh"):def_settings.hh;
            def_settings.minww  = $(el).attr("minww")?$(el).attr("minww"):def_settings.minww;
            def_settings.minhh  = $(el).attr("minhh")?$(el).attr("minhh"):def_settings.minhh;

            $(el).data("default_settings", def_settings);
            $(el).css("zIndex", def_settings.zIndex);

            if (def_settings.ww) {
                $(el).css("width", def_settings.ww);
                if (def_settings.ww.indexOf("%") >= 0) {
                    var new_ll = (100 - parseInt(def_settings.ww)) / 2 - 5;
                    if (new_ll <= 0) new_ll = 5;
 
                     if(def_settings.offsetto !="") {
						new_ll = $(def_settings.offsetto).offset().left + $(def_settings.offsetto).width() + def_settings.offsetww;
						$(el).css("left", (new_ll + "px"));
					} else               
						$(el).css("left", (new_ll + "%"));
                }
            }

            if (def_settings.hh) {
                $(el).css("height", def_settings.hh);
                if (def_settings.hh.indexOf("%") >= 0) {
                    var new_tt = (100 - parseInt(def_settings.hh)) / 2 - 5;
                    if (new_tt <= 0) new_tt = 5;

                    if(def_settings.offsetto !="") {
						new_tt = $(def_settings.offsetto).offset().top + $(def_settings.offsetto).height() + def_settings.offsethh;
					    $(el).css("top", (new_tt + "px"));
					} else 
					    $(el).css("top", (new_tt + "%"));
                }
            }

            if (def_settings.minww) $(el).css("min-width", def_settings.minww);
            if (def_settings.minhh) $(el).css("min-height", def_settings.minhh);

            def_settings.zIndex++;

			if( $(el).has("a.lwhDivBox-button-close").length<=0 ) $(el).prepend('<a class="lwhDivBox-button-close"></a>');
			if( $(el).has("div.lwhDivBox-content").length<=0 ) 	$(el).append('<div class="lwhDivBox-content"></div>');
            if( def_settings.content ) $("div.lwhDivBox-content",el).html(def_settings.content);
			
		    $("a.lwhDivBox-button-close", el).bind("click.lwhDivBox", function (ev) {
                $(el).divBoxHide();
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            });

            if (def_settings.maskable) {
                $(mask_div).bind("click.lwhDivBox", function (ev) {
					$(el).divBoxHide();
                    ev.preventDefault();
                    ev.stopPropagation();
                    return false;
                });
            }


        });
    },

    divBoxShow: function (opts) {

        $(window).unbind("resize.lwhDivBox").bind("resize.lwhDivBox", function () {
            $.lwhDivBox_window_event();
        }); // end of window resize
		
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhDivBox_mask_ifrm";
            var mask_div = "#lwhDivBox_mask_div";

            var def_settings = $(el).data("default_settings");
		    $.extend(def_settings, opts);
            $(el).data("default_settings", def_settings);
			
			if( def_settings.before ) if( $.isFunction(def_settings.before) ) def_settings.before(el);

            if( def_settings.content ) $("div.lwhDivBox-content",el).html(def_settings.content);

            if (def_settings.ww) {
                if (def_settings.ww.indexOf("%") < 0) {
                    var ww = parseInt(def_settings.ww);
                    var minww = parseInt($(el).css("min-width"));
                    if (ww < minww) ww = minww;
                    $(el).css("width", ww + "px");
                    var new_ll = ($(window).width() - $(el).width()) / 2 - 5;
                    if (new_ll <= 0) new_ll = 5;
                    if(def_settings.offsetto !="") {
						new_ll = $(def_settings.offsetto).offset().left + $(def_settings.offsetto).width() + def_settings.offsetww;
					}
					$(el).css("left", new_ll);
                } else {
                    var new_ll = (100 - parseInt(def_settings.ww)) / 2 - 5;
                    if (new_ll <= 0) new_ll = 5;
 
                     if(def_settings.offsetto !="") {
						new_ll = $(def_settings.offsetto).offset().left + $(def_settings.offsetto).width() + def_settings.offsetww;
						$(el).css("left", (new_ll + "px"));
					} else               
						$(el).css("left", (new_ll + "%"));
				}
            }

            if (def_settings.hh) {
                if (def_settings.hh.indexOf("%") < 0) {
                    var hh = parseInt(def_settings.hh);
                    var minhh = parseInt($(el).css("min-height"));
                    if (hh < minhh) hh = minhh;
                    $(el).css("height", hh + "px");

                    var new_tt = ($(window).height() - $(el).height()) / 2 - 5;
                    if (new_tt <= 0) new_tt = 5;

                    if(def_settings.offsetto !="") {
						new_tt = $(def_settings.offsetto).offset().top + $(def_settings.offsetto).height() + def_settings.offsethh;
					}

                    $(el).css("top", new_tt);
                } else {
                    var new_tt = (100 - parseInt(def_settings.hh)) / 2 - 5;
                    if (new_tt <= 0) new_tt = 5;

                    if(def_settings.offsetto !="") {
						new_tt = $(def_settings.offsetto).offset().top + $(def_settings.offsetto).height() + def_settings.offsethh;
					    $(el).css("top", (new_tt + "px"));
					} else 
					    $(el).css("top", (new_tt + "%"));
				
				}
            }


            if (def_settings.maskable) {
                $(mask_ifrm).show();
            }

            if (def_settings.maskable) {
                $(mask_div).show();
				/*
				// press enter to close it 
				$(document).one("keydown",function(ev) {
					if(ev.keyCode == 13) { 
						$(el).divBoxHide();
						ev.preventDefault();
						ev.stopPropagation();
						return false;
					}
				});
				*/
            }

            $(el).show();

        });
    },

    divBoxHide: function (opts) {
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhDivBox_mask_ifrm";
            var mask_div = "#lwhDivBox_mask_div";
            var def_settings = $(el).data("default_settings");
		    $.extend(def_settings, opts);
            $(el).data("default_settings", def_settings);

            $(el).hide();

            if ($(".lwhDivBox:visible").length <= 0) {
                $(mask_ifrm).hide();
                $(mask_div).hide();
            }
			
            if( def_settings.after ) if( $.isFunction(def_settings.after) ) def_settings.after(el);
			
        });
    }
});


$.extend({
    lwhDivBox_window_event: function () {
        // movable or offsetTo element ,  position will not change.
        $(".lwhDivBox:visible").each(function (idx0, el0) {
            var def_settings = $(el0).data("default_settings");
            //console.log(def_settings.ww);

            if (def_settings.ww) {
                if (def_settings.ww.indexOf("%") < 0) {
                    var new_ll = ($(window).width() - $(el0).width()) / 2 - 5;
                    if (new_ll <= 0) new_ll = 5;
                    $(el0).css("left", new_ll);
                }
            }

            if (def_settings.hh) {
                if (def_settings.hh.indexOf("%") < 0) {
                    var new_tt = ($(window).height() - $(el0).height()) / 2 - 5;
                    if (new_tt <= 0) new_tt = 5;
                    $(el0).css("top", new_tt);
                }
            }

        });
    }
});



/************************************************************************************/
/*  JQuery Plugin:  LOADING                                                       	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-3-30      															*/
/*  Files: 	jquery.lwh.loading.js ;  jquery.lwh.loading.css							*/
/************************************************************************************/
$.fn.extend({
    lwhWrapBox: function (opts) {
        var def_settings = {
            container: 	"",
			offsetto:  	"",
            maskable: 	true,
			content:  	"",
            zIndex: 	7000,
			before:		null,
			after:		null
        };
        $.extend(def_settings, opts);

        var mask_zidx = def_settings.zIndex;
        var mask_ifrm = "#lwhWrapBox_mask_ifrm";
        var mask_div = "#lwhWrapBox_mask_div";
        if ($(mask_ifrm).length <= 0 && def_settings.maskable) {
            $(document.body).append('<iframe id="lwhWrapBox_mask_ifrm" class="lwhWrapBox-mask-ifrm" style="z-index:' + (mask_zidx - 2 ) + ';"></iframe>');
        }

        if ($(mask_div).length <= 0 && def_settings.maskable) {
            $(document.body).append('<div id="lwhWrapBox_mask_div" class="lwhWrapBox-mask-div" style="z-index:' + (mask_zidx - 1) + ';"></div>');
        }
        def_settings.zIndex = mask_zidx + 2;

        return this.each(function (idx, el) {

            $(el).data("default_settings", def_settings);
            $(el).css("zIndex", def_settings.zIndex);

            def_settings.zIndex++;

			if( $(el).has("a.lwhWrapBox-button-close").length<=0 ) $(el).prepend('<a class="lwhWrapBox-button-close"></a>');
			//if( $(el).has("div.lwhWrapBox-content").length<=0 ) 	$(el).append('<div class="lwhWrapBox-content"></div>');
			
		    $("a.lwhWrapBox-button-close", el).bind("click.lwhWrapBox", function (ev) {
                $(el).wrapBoxHide();
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            });

            if (def_settings.maskable) {
                $(mask_div).bind("click.lwhWrapBox", function (ev) {
				    $(el).wrapBoxHide();
                    ev.preventDefault();
                    ev.stopPropagation();
                    return false;
                });
            }


        });
    },

    wrapBoxShow: function (opts) {
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhWrapBox_mask_ifrm";
            var mask_div = "#lwhWrapBox_mask_div";

            var def_settings = $(el).data("default_settings");
            $.extend(def_settings, opts);

			if( def_settings.before ) if( $.isFunction(def_settings.before) ) def_settings.before(el);

            if (def_settings.maskable) {
                $(mask_ifrm).show();
            }

            if (def_settings.maskable) {
                $(mask_div).show();
            }

	        $(el).show();
  
			var ww = $(el).width();
			var hh = $(el).height();

			//console.log(ww + ":" + hh + " : " + $(el).attr("id"));

			$(el).css("margin-left", -1 * ww/2 - 20);
			$(el).css("margin-top", -1 * hh/2 - 20);
        });
    },

    wrapBoxHide: function () {
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhWrapBox_mask_ifrm";
            var mask_div = "#lwhWrapBox_mask_div";
            var def_settings = $(el).data("default_settings");

            $(el).hide();

            if ($(".lwhWrapBox:visible").length <= 0) {
                $(mask_ifrm).hide();
                $(mask_div).hide();
            }

            if( def_settings.after ) if( $.isFunction(def_settings.after) ) def_settings.after(el);
        });
		
    }
});

