/************************************************************************************/
/*  JQuery Plugin:  LOADING                                                       	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-3-30      															*/
/*  Files: 	jquery.lwh.loading.js ;  jquery.lwh.loading.css							*/
/************************************************************************************/
$.fn.extend({
    lwhDiagBox: function (opts) {
        var def_settings = {
            title: "",
            ww: "",
            hh: "",
            minww: "",
            minhh: "",
            actcss: "blue",

            button: 	false,
            maskable: 	true,
            movable: 	false,
            resizable: 	false,
            pin: 		false,


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
            diag_min: null,

            zIndex: 6000
        };
        $.extend(def_settings, opts);

        var base_zidx = def_settings.zIndex;
        var mask_ifrm = "#lwhDiagBox_mask_ifrm";
        var mask_div = "#lwhDiagBox_mask_div";
        if ($(mask_ifrm).length <= 0 && def_settings.maskable) {
            $(document.body).append('<iframe id="lwhDiagBox_mask_ifrm" class="lwhDiagBox-mask-ifrm" style="z-index:' + (base_zidx - 2) + ';"></iframe>');
        }

        if ($(mask_div).length <= 0 && def_settings.maskable) {
            $(document.body).append('<div id="lwhDiagBox_mask_div" class="lwhDiagBox-mask-div" wtotal="0" style="z-index:' + (base_zidx - 1) + ';"></div>');
        }

        return this.each(function (idx, el) {
            // dialog initialize
            if (def_settings.diag_init && $.isFunction(def_settings.diag_init)) def_settings.diag_init();

            def_settings.ww = $(el).attr("ww") ? $(el).attr("ww") : def_settings.ww;
            def_settings.hh = $(el).attr("hh") ? $(el).attr("hh") : def_settings.hh;
            def_settings.minww = $(el).attr("minww") ? $(el).attr("minww") : def_settings.minww;
            def_settings.minhh = $(el).attr("minhh") ? $(el).attr("minhh") : def_settings.minhh;

            /*** backup current width and height, minww, minhh  for min window, max window***/
            var curww = def_settings.ww ? def_settings.ww.toString().indexOf("%") > 0 ? def_settings.ww : $(el).width() : "75%";
            var curhh = def_settings.hh ? def_settings.hh.toString().indexOf("%") > 0 ? def_settings.hh : $(el).height() : "75%";
            /***  minsize, restrict to resizable ***/
            if (def_settings.minww) $(el).css("min-width", def_settings.minww);
            if (def_settings.minhh) $(el).css("min-height", def_settings.minhh);
            $(el).attr({ "curww": curww, "curhh": curhh, "wstate": 0, "minww": $(el).css("min-width"), "minhh": $(el).css("min-height") });

            $(el).data("default_settings", def_settings);
            var mask_no = isNaN( $(mask_div).attr("wtotal", parseInt($(mask_div).attr("wtotal"))) )? 1: $(mask_div).attr("wtotal", parseInt($(mask_div).attr("wtotal")));
            $(el).css("z-index", base_zidx + mask_no + 1).attr("wsn", mask_no);
            /*******************************************************************************/



            // Order Top Window
            $(el).bind("click", function (ev) {
                if ($(el).is(":visible")) {
                    var curIdx = parseInt($(el).css("zIndex"));
                    $(el).css("zIndex", base_zidx + parseInt($(mask_div).attr("wtotal"))).addClass("lwhDiagBox-" + def_settings.actcss);
                    $(".lwhDiagBox").not(el).each(function (idx1, el1) {
                        if (parseInt($(el1).css("zIndex")) > curIdx) {
                            $(el1).css("zIndex", parseInt($(el1).css("zIndex")) - 1).removeClass("lwhDiagBox-" + def_settings.actcss);
                        }
                    });
                }
            })



            /**** miss html ****/
            if ($(".lwhDiagBox-header", el).length <= 0) {
                $(el).prepend('<div class="lwhDiagBox-header"></div>');
            }
            if ($(".lwhDiagBox-title", el).length <= 0) {
                $(".lwhDiagBox-header", el).prepend('<span class="lwhDiagBox-title">' + (def_settings.title ? def_settings.title : "") + '</span>');
            }
            if (def_settings.title) {
                $(".lwhDiagBox-header > .lwhDiagBox-title", el).html(def_settings.title);
            }

            if ($(".lwhDiagBox-button-close", el).length <= 0) {
                $(".lwhDiagBox-header", el).prepend('<a class="lwhDiagBox-button lwhDiagBox-button-close" title="Close"></a>');
            }

            if (def_settings.button) {
                $(".lwhDiagBox-header", el).prepend('<a class="lwhDiagBox-button lwhDiagBox-button-min" title="Minimize"></a>');
                $(".lwhDiagBox-header", el).prepend('<a class="lwhDiagBox-button lwhDiagBox-button-max" title="Maximize"></a>');
            }
            /******************/


            /*** width , height  percentage case ***/
            if (def_settings.ww) {
                $(el).css("width", def_settings.ww);
                if (def_settings.ww.toString().indexOf("%") >= 0) {
                    var new_ll = (100 - parseInt(def_settings.ww)) / 2 - 5;
                    if (new_ll <= 0) new_ll = 20;
                    $(el).css("left", (new_ll + "%"));
                }
            }

            if (def_settings.hh) {
                $(el).css("height", def_settings.hh);
                if (def_settings.hh.toString().indexOf("%") >= 0) {
                    var new_tt = (100 - parseInt(def_settings.hh)) / 2 - 5;
                    if (new_tt <= 0) new_tt = 20;
                    $(el).css("top", (new_tt + "%"));
                }
            }
            /******************************************/



            /********** effect ************/
            // deal with resizable 
            if (def_settings.resizable && def_settings.ww && def_settings.ww.toString().indexOf("%") < 0 && def_settings.hh && def_settings.hh.toString().indexOf("%") < 0) {
                $(el).resizable({
                    start: function () {
                        if (def_settings.resize_start && $.isFunction(def_settings.resize_start)) def_settings.resize_start();
                    },
                    resize: function () {
                        if (def_settings.resizing && $.isFunction(def_settings.resizing)) def_settings.resizing();
                    },
                    stop: function () {
                        var curww = def_settings.ww ? def_settings.ww.toString().indexOf("%") > 0 ? def_settings.ww : $(el).width() : "75%";
                        var curhh = def_settings.hh ? def_settings.hh.toString().indexOf("%") > 0 ? def_settings.hh : $(el).height() : "75%";
                        $(el).attr({ "curww": curww, "curhh": curhh });
                        if (def_settings.resize_end && $.isFunction(def_settings.resize_end)) def_settings.resize_end();
                    }
                });
            }

            // deal with movable
            if (def_settings.movable) {
                $("div.lwhDiagBox-header", el).css("cursor", "move");
                $(el).draggable({
                    handle: $("div.lwhDiagBox-header", el),
                    start: function () {
                        if (def_settings.move_start && $.isFunction(def_settings.move_start)) def_settings.move_start();
                    },
                    stop: function () {
                        if ($(el).offset().top <= 0) $(el).offset({ top: 20 });
                        if ($(el).offset().left <= 0) $(el).offset({ left: 20 });

                        if (def_settings.move_end && $.isFunction(def_settings.move_end)) def_settings.move_end();
                    }
                });
            }

            if (def_settings.button) {
                $(".lwhDiagBox-header > .lwhDiagBox-button", el).bind("click.lwhDiagBox", function (ev) {
                    if ($(this).hasClass("lwhDiagBox-button-min")) {

                        if (def_settings.resizable) $(el).resizable("destroy");
                        $(el).css({ "min-width": "0px", "min-height": "0px" }).attr("wstate", 1);
                        $(el).stop(true, true).delay(200).animate({
                            width: 200,
                            height: 20
                        }, 300, function () {
                            $("div.lwhDiagBox-content", el).hide();
                            $(".lwhDiagBox-header > .lwhDiagBox-button-min", el).hide();
                            $(".lwhDiagBox-header > .lwhDiagBox-button-max", el).show();
                            if (def_settings.diag_min && $.isFunction(def_settings.diag_min)) def_settings.diag_min();
                        });

                    } else {
                        if ($(this).hasClass("lwhDiagBox-button-max")) {
                            $(el).stop(true, true).delay(200).animate({
                                width: $(el).attr("curww"),
                                height: $(el).attr("curhh")
                            }, 50, function () {
                                $("div.lwhDiagBox-content", el).show();
                                $(el).css({ "min-width": $(el).attr("minww"), "min-height": $(el).attr("minhh") }).attr("wstate", 2);
                                $(".lwhDiagBox-header > .lwhDiagBox-button-min", el).show();
                                $(".lwhDiagBox-header > .lwhDiagBox-button-max", el).hide();


                                if (def_settings.resizable && def_settings.ww && def_settings.ww.toString().indexOf("%") < 0 && def_settings.hh && def_settings.hh.toString().indexOf("%") < 0) {
                                    $(el).resizable({
                                        start: function () {
                                            if (def_settings.resize_start && $.isFunction(def_settings.resize_start)) def_settings.resize_start();
                                        },
                                        resize: function () {
                                            if (def_settings.resizing && $.isFunction(def_settings.resizing)) def_settings.resizing();
                                        },
                                        stop: function () {
                                            var curww = def_settings.ww ? def_settings.ww.toString().indexOf("%") > 0 ? def_settings.ww : $(el).width() : "75%";
                                            var curhh = def_settings.hh ? def_settings.hh.toString().indexOf("%") > 0 ? def_settings.hh : $(el).height() : "75%";
                                            $(el).attr({ "curww": curww, "curhh": curhh });
                                            if (def_settings.resize_end && $.isFunction(def_settings.resize_end)) def_settings.resize_end();
                                        }
                                    });
                                }

                                if (def_settings.diag_max && $.isFunction(def_settings.diag_max)) def_settings.diag_max();
                            }); // animate
                        }
                    }
                }); // bind click
            }
            /****************************/



            $("a.lwhDiagBox-button-close", el).bind("click.lwhDiagBox", function (ev) {
                $(el).attr("wstate", ($(el).attr("wstate") == "1" ? 5 : 4)).diagBoxHide();
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            });

            if (def_settings.maskable) {
                $(el).attr("maskable", 1);
                $(mask_div).bind("click.lwhDiagBox", function (ev) {
                    var maxZidx = 0;
                    var maxWsn = 0;
                    $(".lwhDiagBox:visible").each(function (idx1, el1) {
                        if (parseInt($(el1).css("zIndex")) > maxZidx) {
                            maxZidx = parseInt($(el1).css("zIndex"));
                            maxWsn = $(el1).attr("wsn");
                        }
                    });

                    if ($(".lwhDiagBox[wsn='" + maxWsn + "']:visible").attr("maskable") == "1") {
                        $(".lwhDiagBox[wsn='" + maxWsn + "']:visible").attr("wstate", ($(".lwhDiagBox[wsn='" + maxWsn + "']:visible").attr("wstate") == "1" ? 5 : 4)).diagBoxHide();
                        ev.preventDefault();
                        ev.stopPropagation();
                        return false;
                    }
                });
            }

        });
    },

    diagBoxShow: function (opts) {

        $(window).unbind("resize.lwhDiagBox").bind("resize.lwhDiagBox", function () {
            $.lwhDiagBox_resize_event();
            return false;
        }); // end of window resize

        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhDiagBox_mask_ifrm";
            var mask_div = "#lwhDiagBox_mask_div";
            var def_settings = $(el).data("default_settings");
            $.extend(def_settings, opts);

            //if ($(el).is(":visible")) return false;
            switch ($(el).attr("wstate")) {
                case "0":
                    if (opts) if (opts.title) $(".lwhDiagBox-header > .lwhDiagBox-title", el).html(def_settings.title);

                    if (def_settings.button) {
                        $(".lwhDiagBox-header > .lwhDiagBox-button-min", el).show();
                        $(".lwhDiagBox-header > .lwhDiagBox-button-max", el).hide();
                    }

                    /*** deal with width , height  px,  not for percentage which is auto,  ***/
                    if (def_settings.ww) {
                        if (def_settings.ww.toString().indexOf("%") < 0) {
                            var ww = parseInt(def_settings.ww);
                            var minww = parseInt($(el).css("min-width"));
                            if (ww < minww) ww = minww;
                            $(el).css("width", ww + "px");
                            var new_ll = ($(window).width() - $(el).width()) / 2 - 5;
                            if (new_ll <= 0) new_ll = 20;
                            $(el).css("left", new_ll);
                        }
                    }

                    if (def_settings.hh) {
                        if (def_settings.hh.toString().indexOf("%") < 0) {
                            var hh = parseInt(def_settings.hh);
                            var minhh = parseInt($(el).css("min-height"));
                            if (hh < minhh) hh = minhh;
                            $(el).css("height", hh + "px");

                            var new_tt = ($(window).height() - $(el).height()) / 2 - 5;
                            if (new_tt <= 0) new_tt = 20;
                            $(el).css("top", new_tt);
                        }
                    }

                    var curww = def_settings.ww ? def_settings.ww.toString().indexOf("%") > 0 ? def_settings.ww : $(el).width() : "75%";
                    var curhh = def_settings.hh ? def_settings.hh.toString().indexOf("%") > 0 ? def_settings.hh : $(el).height() : "75%";
                    $(el).attr({ "curww": curww, "curhh": curhh });

                    /************************************/


                    if (def_settings.maskable) {
                        $(mask_ifrm).show();
                    }

                    if (def_settings.maskable) {
                        $(mask_div).show();
                    }

                    $(el).attr("wstate", 9).show();
                    break;
                case "5":
                    if (def_settings.maskable) {
                        $(mask_ifrm).show();
                    }

                    if (def_settings.maskable) {
                        $(mask_div).show();
                    }

                    $(el).show().stop(true, true).delay(200).animate({
                        width: $(el).attr("curww"),
                        height: $(el).attr("curhh")
                    }, 50, function () {
                        $("div.lwhDiagBox-content", el).show();
                        $(el).css({ "min-width": $(el).attr("minww"), "min-height": $(el).attr("minhh") }).attr("wstate", 2);
                        $(".lwhDiagBox-header > .lwhDiagBox-button-min", el).show();
                        $(".lwhDiagBox-header > .lwhDiagBox-button-max", el).hide();


                        if (def_settings.resizable && def_settings.ww && def_settings.ww.toString().indexOf("%") < 0 && def_settings.hh && def_settings.hh.toString().indexOf("%") < 0) {
                            $(el).resizable({
                                start: function () {
                                    if (def_settings.resize_start && $.isFunction(def_settings.resize_start)) def_settings.resize_start();
                                },
                                resize: function () {
                                    if (def_settings.resizing && $.isFunction(def_settings.resizing)) def_settings.resizing();
                                },
                                stop: function () {
                                    var curww = def_settings.ww ? def_settings.ww.toString().indexOf("%") > 0 ? def_settings.ww : $(el).width() : "75%";
                                    var curhh = def_settings.hh ? def_settings.hh.toString().indexOf("%") > 0 ? def_settings.hh : $(el).height() : "75%";
                                    $(el).attr({ "curww": curww, "curhh": curhh });
                                    if (def_settings.resize_end && $.isFunction(def_settings.resize_end)) def_settings.resize_end();
                                }
                            });
                        }

                        if (def_settings.diag_max && $.isFunction(def_settings.diag_max)) def_settings.diag_max();
                    });
                    break;
                case "1":
                    if (def_settings.maskable) {
                        $(mask_ifrm).show();
                    }

                    if (def_settings.maskable) {
                        $(mask_div).show();
                    }

                    $(el).stop(true, true).delay(200).animate({
                        width: $(el).attr("curww"),
                        height: $(el).attr("curhh")
                    }, 50, function () {
                        $("div.lwhDiagBox-content", el).show();
                        $(el).css({ "min-width": $(el).attr("minww"), "min-height": $(el).attr("minhh") }).attr("wstate", 2);
                        $(".lwhDiagBox-header > .lwhDiagBox-button-min", el).show();
                        $(".lwhDiagBox-header > .lwhDiagBox-button-max", el).hide();


                        if (def_settings.resizable && def_settings.ww && def_settings.ww.toString().indexOf("%") < 0 && def_settings.hh && def_settings.hh.toString().indexOf("%") < 0) {
                            $(el).resizable({
                                start: function () {
                                    if (def_settings.resize_start && $.isFunction(def_settings.resize_start)) def_settings.resize_start();
                                },
                                resize: function () {
                                    if (def_settings.resizing && $.isFunction(def_settings.resizing)) def_settings.resizing();
                                },
                                stop: function () {
                                    var curww = def_settings.ww ? def_settings.ww.toString().indexOf("%") > 0 ? def_settings.ww : $(el).width() : "75%";
                                    var curhh = def_settings.hh ? def_settings.hh.toString().indexOf("%") > 0 ? def_settings.hh : $(el).height() : "75%";
                                    $(el).attr({ "curww": curww, "curhh": curhh });
                                    if (def_settings.resize_end && $.isFunction(def_settings.resize_end)) def_settings.resize_end();
                                }
                            });
                        }

                        if (def_settings.diag_max && $.isFunction(def_settings.diag_max)) def_settings.diag_max();
                    });

                    break;
                case "2":
                    break;
                case "4":
                    if (def_settings.maskable) {
                        $(mask_ifrm).show();
                    }

                    if (def_settings.maskable) {
                        $(mask_div).show();
                    }
                    $(el).attr("wstate", 9).show();
                    break;
                case "9":
                    // do nothing , already show
                    break;

            }

            // re-order 
            var base_zidx = def_settings.zIndex;
            var curIdx = parseInt($(el).css("zIndex"));
            $(el).css("zIndex", base_zidx + parseInt($(mask_div).attr("wtotal"))).addClass("lwhDiagBox-" + def_settings.actcss);
            $(".lwhDiagBox").not(el).removeClass("lwhDiagBox-" + def_settings.actcss).each(function (idx1, el1) {
                if (parseInt($(el1).css("zIndex")) > curIdx) {
                    $(el1).css("zIndex", parseInt($(el1).css("zIndex")) - 1);
                }
            });

        });
    },

    diagBoxHide: function () {
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhDiagBox_mask_ifrm";
            var mask_div = "#lwhDiagBox_mask_div";
            var def_settings = $(el).data("default_settings");

            $(el).hide();
            if ($(el).attr("maskable") == "1") {
                if ($(".lwhDiagBox[maskable='1']:visible").length <= 0) {
                    $(mask_ifrm).hide();
                    $(mask_div).hide();
                }
            }

            // find top one and highlight
            var maxZidx = 0;
            var maxWsn = 0;
            $(".lwhDiagBox:visible").each(function (idx1, el1) {
                if (parseInt($(el1).css("zIndex")) > maxZidx) {
                    maxZidx = parseInt($(el1).css("zIndex"));
                    maxWsn = $(el1).attr("wsn");
                }
            });
            $(".lwhDiagBox").removeClass("lwhDiagBox-" + def_settings.actcss);
            $(".lwhDiagBox[wsn='" + maxWsn + "']:visible").addClass("lwhDiagBox-" + def_settings.actcss);
        });
    }
});


$.extend({
    lwhDiagBox_resize_event: function () {
        // movable or offsetTo element ,  position will not change.
        $(".lwhDiagBox:visible").each(function (idx0, el0) {
            var def_settings = $(el0).data("default_settings");

            if (!def_settings.movable) {
                if (def_settings.ww) {
                    if (def_settings.ww.toString().indexOf("%") < 0) {
                        var new_ll = ($(window).width() - $(el0).width()) / 2 - 5;
                        if (new_ll <= 0) new_ll = 20;
                        $(el0).css("left", new_ll);
                    }
                }

                if (def_settings.hh) {
                    if (def_settings.hh.toString().indexOf("%") < 0) {
                        var new_tt = ($(window).height() - $(el0).height()) / 2 - 5;
                        if (new_tt <= 0) new_tt = 20;
                        $(el0).css("top", new_tt);
                    }
                }
            }
        });
    }
});