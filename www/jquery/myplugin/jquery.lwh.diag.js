/************************************************************************************/
/*  JQuery Plugin Tab		 - 														*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-8-15      															*/
/*  Files: 	jquery.lwh.tab.js ;  jquery.lwh.tab.css									*/
/************************************************************************************/

$.fn.extend({
    lwhDiag: function (opts) {
        var def_settings = {
            title: "",
            tfColor: "#000000",
            titleAlign: "center",
            minWW: 0,
            minHH: 0,
            bgColor: "#ffffff",
            ttColor: "#cccccc",
            cnColor: "#ffffff",

            btnMax: false,
            resizable: false,
            movable: false,
            maskable: false,
            maskClick: false,
            pin: false,

            offsetTo: "",
            top: "middle", // "top", "middle", "bottom" or "10"
            left: "center", // "left", "center", "right" or "20"
            zIndex: 6000,

            //event:
            resize_start: null,
            resizing: null,
            resize_end: null,
            move_start: null,
            move_end: null,
            diag_init: null,
            diag_open: null,
            diag_close: null,
            diag_max: null,
            diag_min: null
        };
        $.extend(def_settings, opts);

        var mask_ifrm = "#lwhDiag_mask_ifrm";
        var mask_div = "#lwhDiag_mask_div";
        var midx = def_settings.zIndex + 100;
        if ($(mask_ifrm).length <= 0) {
            $(document.body).append('<iframe id="lwhDiag_mask_ifrm" class="lwhDiag-mask-ifrm" style="z-index:' + (midx - 1) + ';"></iframe>');
        }
        if ($(mask_div).length <= 0) {
            $(document.body).append('<div id="lwhDiag_mask_div" class="lwhDiag-mask-div" style="z-index:' + (midx - 2) + ';"></div>');
            $(mask_div).attr("midx", midx).unbind("click.lwhDiag").bind("click.lwhDiag", function () {
                var sidx = parseInt($(this).attr("midx")) + 2;
                var def_settings = $(".lwhDiag[sidx='" + sidx + "']").data("default_settings");
                if (def_settings.maskable && def_settings.maskClick) {
                    $(".lwhDiag[sidx='" + sidx + "']").attr("sidx", 0);
                    $.lwhDiag_window_resort();
                    $.lwhDiag_show();
                    if (def_settings.diag_close && $.isFunction(def_settings.diag_close)) def_settings.diag_close();
                }
            });
        }

        return this.each(function (idx, el) {
            if( !$(el).hasClass("wliu-diag") ) $(el).addClass("wliu-diag");

            $(el).data("default_settings", def_settings);

            if ($("div.lwhDiag-content", el).length <= 0) {
                var tmp_html = $(el).html();
                var tmp_cont = $(el).empty().append('<div class="lwhDiag-content"></div>')[0].lastChild;
                $(tmp_cont).html(tmp_html);
            }
            var ini_hh = Math.max($("div.lwhDiag-content", el).height(), def_settings.minHH);
            $("div.lwhDiag-content", el).css({ "backgroundColor": def_settings.cnColor, "height": ini_hh });

            var ini_ww = Math.max($(el).width(), def_settings.minWW);
            $(el).attr({
                "zidx": def_settings.zIndex + idx,
                "sidx": 0
            }).css({
                "zIndex": def_settings.zIndex + idx,
                "backgroundColor": def_settings.bgColor,
                "width": ini_ww
            });


            // move to when open dialog
            /*
            $(el).unbind("click.lwhDiag").bind("click.lwhDiag", function(ev) {
            $.lwhDiag_window_resort();
            $(this).attr("sidx",midx + 2).css("z-index", midx + 2);
            $.lwhDiag_show();
            });
            */

            // deal with head title 
            if ($(el).has("div.lwhDiag-head").length <= 0) {
                $(el).prepend('<div class="lwhDiag-head"></div>');
            }
            $("div.lwhDiag-head", el).css({ "textAlign": def_settings.titleAlign, "backgroundColor": def_settings.ttColor });

            // deal with title inside the header
            if ($("div.lwhDiag-head", el).has("div.lwhDiag-title").length <= 0) {
                $("div.lwhDiag-head", el).prepend('<div class="lwhDiag-title"></span>');
            }
            if (def_settings.title != "") $("div.lwhDiag-title", $("div.lwhDiag-head", el)).html(def_settings.title);

            $("div.lwhDiag-title", $("div.lwhDiag-head", el)).css("color", def_settings.tfColor);

            // deal with button
            if ($("div.lwhDiag-head", el).has("span.lwhDiag-button").length <= 0) {
                $("div.lwhDiag-head", el).prepend('<span class="lwhDiag-button"></span>');
            }
            if ($("span.lwhDiag-button", $("div.lwhDiag-head", el)).has("a.lwhDiag-button-close").length <= 0) {
                $("span.lwhDiag-button", $("div.lwhDiag-head", el)).prepend('<a class="lwhDiag-button lwhDiag-button-close"></a>');
            }


            $("a.lwhDiag-button-close", $("div.lwhDiag-head", el)).unbind("click.lwhDiag").bind("click.lwhDiag", function (ev) {
                $(el).diagHide();
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            });

           
            if (def_settings.btnMax) {
                if ($("span.lwhDiag-button", $("div.lwhDiag-head", el)).has("a.lwhDiag-button-max").length <= 0) {
                    $("span.lwhDiag-button", $("div.lwhDiag-head", el)).append('<a class="lwhDiag-button lwhDiag-button-mm lwhDiag-button-min"></a>');
                }
                $("a.lwhDiag-button-mm").live("click.lwhDiag", function (ev) {
                    if ($(this).hasClass("lwhDiag-button-min")) {
                        if (def_settings.resizable) $(el).resizable("destroy");
                        $("div.lwhDiag-content", el).hide();
                        $(el).stop(true, true).delay(200).animate({
                            width: 200,
                            height: $("div.lwhDiag-head", el).height()
                        }, 50, function () {
                            $("a.lwhDiag-button-mm", $("span.lwhDiag-button", $("div.lwhDiag-head", el))).removeClass("lwhDiag-button-min").addClass("lwhDiag-button-max");
                            if (def_settings.diag_min && $.isFunction(def_settings.diag_min)) def_settings.diag_min();
                        });
                    } else {
                        $(el).stop(true, true).delay(200).animate({
                            width: $(el).attr("curww"),
                            height: $(el).attr("curhh")
                        }, 50, function () {
                            $("div.lwhDiag-content", el).width("auto").height($(el).attr("conhh")).show();
                            $("a.lwhDiag-button-mm", $("span.lwhDiag-button", $("div.lwhDiag-head", el))).removeClass("lwhDiag-button-max").addClass("lwhDiag-button-min");

                            if (def_settings.resizable) {
                                $(el).resizable({
                                    alsoResize: $(".lwhDiag-content", el),   // only first one element can be resize inside the el. no matter how many you set
                                    minWidth: def_settings.minWW,
                                    minHeight: def_settings.minHH + 45,    // content height + head height 42px;
                                    start: function () {
                                        if (def_settings.resize_start && $.isFunction(def_settings.resize_start)) def_settings.resize_start();
                                    },
                                    resize: function () {
                                        if (def_settings.resizing && $.isFunction(def_settings.resizing)) def_settings.resizing();
                                    },
                                    stop: function () {
                                        $(el).attr({ "curww": $(el).width(), "curhh": $(el).height(), "conhh": $("div.lwhDiag-content", el).height() });
                                        if (def_settings.resize_end && $.isFunction(def_settings.resize_end)) def_settings.resize_end();
                                    }
                                });
                            }


                            if (def_settings.diag_max && $.isFunction(def_settings.diag_max)) def_settings.diag_max();
                        });
                    }
                    ev.stopPropagation();
                    return false;
                });
            }

            // deal with resizable 
            if (def_settings.resizable) {
                $(el).resizable({
                    alsoResize: $(".lwhDiag-content", el),   // only first one element can be resize inside the el. no matter how many you set
                    minWidth: def_settings.minWW,
                    minHeight: def_settings.minHH + 45,   // content height  +  head height 42px
                    start: function () {
                        if (def_settings.resize_start && $.isFunction(def_settings.resize_start)) def_settings.resize_start();
                    },
                    resize: function () {
                        if (def_settings.resizing && $.isFunction(def_settings.resizing)) def_settings.resizing();
                    },
                    stop: function () {
                        $(el).attr({ "curww": $(el).width(), "curhh": $(el).height(), "conhh": $("div.lwhDiag-content", el).height() });
                        if (def_settings.resize_end && $.isFunction(def_settings.resize_end)) def_settings.resize_end();
                    }
                });
            }

            // deal with movable
            if (def_settings.movable) {
                $("div.lwhDiag-title", el).css("cursor", "move");
                $(el).draggable({
                    handle: $("div.lwhDiag-title", el),
                    start: function () {
                        if (def_settings.move_start && $.isFunction(def_settings.move_start)) def_settings.move_start();
                    },
                    stop: function () {
                        if ($(el).offset().top <= 0) $(el).offset({ top: 5 });
                        if ($(el).offset().left <= 0) $(el).offset({ left: 5 });

                        if (def_settings.move_end && $.isFunction(def_settings.move_end)) def_settings.move_end();
                    }
                });
            }

            // dialog initialize
            $(el).attr({ "curww": $(el).width(), "curhh": $(el).height(), "conhh": $("div.lwhDiag-content", el).height() });
            if (def_settings.diag_init && $.isFunction(def_settings.diag_init)) def_settings.diag_init();

        });  // End of lwhDiag
    },

    diagShow: function (opts) {
        var mask_ifrm = "#lwhDiag_mask_ifrm";
        var mask_div = "#lwhDiag_mask_div";
        var midx = parseInt($(mask_div).attr("midx"));

        $(window).unbind("scroll.lwhDiag").bind("scroll.lwhDiag", function () {
            $.lwhDiag_window_event();
        }); // end of $(window).scroll

        $(window).unbind("resize.lwhDiag").bind("resize.lwhDiag", function () {
            $.lwhDiag_window_event();
        }); // end of window resize

        return this.each(function (idx, el) {
            $(el).unbind("click.lwhDiag").bind("click.lwhDiag", function (ev) {
                $.lwhDiag_window_resort();
                $(this).attr("sidx", midx + 2).css("z-index", midx + 2);
                $.lwhDiag_show();
            });


            var def_settings = $(el).data("default_settings");
            $.extend(def_settings, opts);
            $(el).data("default_settings", def_settings);
            //alert("id:" + $(el).attr("id") + " movable:" + def_settings.movable);
            if (opts && opts.title && opts.title != "") {
                $("div.lwhDiag-title", $("div.lwhDiag-head", el)).html(opts.title);
            }

            $.lwhDiag_window_resort();
            var el_pos = $.element_pos(el);

            if (def_settings.pin && $(el).attr("showed") == 1) {
                if (!def_settings.movable && def_settings.offsetTo == "") {
                    $(el).css({
                        left: el_pos.left,
                        top: el_pos.top
                    }).attr("sidx", midx + 2);
                } else {
                    $(el).attr("sidx", midx + 2);
                }
            } else {
                $(el).css({
                    left: el_pos.left,
                    top: el_pos.top
                }).attr("sidx", midx + 2);
            }

            $.lwhDiag_show();

            if ($("a.lwhDiag-button-mm", $("span.lwhDiag-button", $("div.lwhDiag-head", el))).hasClass("lwhDiag-button-max")) {
                $("a.lwhDiag-button-mm", $("span.lwhDiag-button", $("div.lwhDiag-head", el))).click();
            }

            if (def_settings.diag_open && $.isFunction(def_settings.diag_open)) def_settings.diag_open();
            $(el).attr({ "showed": 1 });
        });
    },

    diagHide: function (opts) {
        this.each(function (idx, el) {
            $(el).unbind("click.lwhDiag");
            var def_settings = $(el).data("default_settings");
            $.extend(def_settings, opts);
            $(el).data("default_settings", def_settings);
            $(el).attr("sidx", 0);
            $.lwhDiag_window_resort();
            $.lwhDiag_show();
            if (def_settings.diag_close && $.isFunction(def_settings.diag_close)) def_settings.diag_close();
        });
    }
});

$.extend({
	lwhDiag_window_event: function() {
				// movable or offsetTo element ,  position will not change.
				$(".lwhDiag[sidx!='0']").each(function(idx0, el0) {
						var def_settings = $(el0).data("default_settings");
						//alert("movable:" + def_settings.movable + " id:" + $(el0).attr("id"));
						if( !def_settings.movable && def_settings.offsetTo == "" ) {
								var el_pos 	= $.element_pos(el0);
								$(el0).stop(true, true).delay(500).animate({
															left: 	el_pos.left,
															top: 	el_pos.top
								},	50);	
						}
				});
	},
	
	lwhDiag_window_resort: function() {
		var mask_ifrm	= "#lwhDiag_mask_ifrm";
		var mask_div	= "#lwhDiag_mask_div";
		var midx = parseInt($(mask_div).attr("midx"));

		$(".lwhDiag[sidx='0']").css("z-index", function(idx0, val0) {
			return $(this).attr("zidx");
		});

		$(".lwhDiag[sidx!='0']").sort(function(a, b) { 
			  return  parseInt($(b).attr("sidx")) - parseInt($(a).attr("sidx"));
		}).each(function(idx0, el0) {
			  $(el0).attr("sidx", (midx-1)-idx0).css("zIndex", (midx-1)-idx0);  
		});
	},
	
	lwhDiag_show: function() {
		var mask_ifrm	= "#lwhDiag_mask_ifrm";
		var mask_div	= "#lwhDiag_mask_div";
		var midx = parseInt($(mask_div).attr("midx"));
		
		$(".lwhDiag[sidx='0']").hide();							
		
		$(".lwhDiag[sidx!='0']").show();

								// find out the top window. 	
		var max_sidx = 0;
		$(".lwhDiag[sidx!='0']").each(function(idx0, el0) {
				var t_sidx = parseInt($(el0).attr("sidx")); 
				if( t_sidx > max_sidx ) max_sidx = t_sidx; 
		});
		if( max_sidx > 0 ) {
			  var show_el = $(".lwhDiag[sidx='" + max_sidx + "']");
			  var def_settings = $(show_el).data("default_settings");
			  show_el.attr("sidx",midx+2).css("z-index",midx+2).stop(true, true).show();
			 //alert("id:" + show_el.attr("id") + "  msk:" + def_settings.maskable);
			  
			  var cont = $.element_pro();
			  if( def_settings.maskable ) {
				  if( $(mask_div).is(":hidden") ) {
					  $(mask_div).show();
					  $(mask_ifrm).show();
				  }
			  } else {
					  if( $(mask_div).is(":visible") ) {
						  $(mask_div).hide();
						  $(mask_ifrm).hide();
					  }
			  }
		} else {
			  // if no window show ,  mask should be close
			  $(window).unbind("scroll.lwhDiag");
			  $(window).unbind("resize.lwhDiag");
			  if( $(mask_div).is(":visible") ) {
					  $(mask_div).hide();
					  $(mask_ifrm).hide();
			  }
		}
	} // end of function
});