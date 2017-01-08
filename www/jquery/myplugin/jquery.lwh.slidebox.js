/************************************************************************************/
/*  JQuery Plugin  Custom Slidebox                                                 	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-4-2      															*/
/*  Files: 	jquery.lwh.slidebox.js ;  jquery.lwh.slidebox.css						*/
/************************************************************************************/
$.fn.extend({
    lwhSlidebox: function (opts) {
        var def_settings = {
            title: "",
            trigger: "",
            iconClose: true,
            inBound: true,
            movable: true,
            pin: false,

            offsetTo: "",
            top: "middle", // "top", "middle", "bottom" or "10" ,  top "10" relative to offsetTo element.
            left: "center", // "left", "center", "right" or "20"
            initWidth: 0,
            initHeight: 0,
            zIndex: 7000,

            //event:
            box_init: null,
            box_open: null,
            box_close: null
        };

        $.extend(def_settings, opts);
        var zidx = def_settings.zIndex;
        return this.each(function (idx, el) {
            /************************************/
            /* initialize						*/
            /************************************/
            $(el).data("default_settings", def_settings);
            $(el).attr({ "zidx": def_settings.zIndex, "bidx": zidx }).css("zIndex", def_settings.zIndex);

            if (parseInt(def_settings.initWidth) > 0) {
                el_ww = parseInt(def_settings.initWidth);
                $(el).width(el_ww);
            }
            if (parseInt(def_settings.initHeight) > 0) {
                el_hh = parseInt(def_settings.initHeight);
                $(el).height(el_hh);
            }

            $(el).bind("click.lwhWindow", function (ev) {
                $(".lwhSlidebox").css("zIndex", function (idx0, val0) {
                    return $(this).attr("zidx");
                });
                $(this).css("zIndex", def_settings.zIndex);
            });

            // header event:  close window
            if ($(".lwhSlidebox-header", el).length <= 0) {
                var head_html = '<div 	class="lwhSlidebox-header"><span 	class="lwhSlidebox-header-title">' + def_settings.title + '</span>';
                if (def_settings.iconClose) head_html += '<a	class="lwhSlidebox-header-close"></a></div>';
                var foot_html = '<div class="lwhSlidebox-footer"><a class="lwhSlidebox-footer-close"></a></div>';
                $(el).prepend(head_html).append(foot_html);
            }

            if (def_settings.trigger != "") {
                $(def_settings.trigger).live("click.lwhSlidebox", function (ev) {
                    var def_settings = $(el).data("default_settings");
                    if ($(el).is(":visible")) {
                        $(el).stop(true, true).slideUp(200, function () {
                            $(el).css({
                                "zIndex": $(el).attr("zidx"),
                                left: -2000,
                                top: -2000
                            });

                            if ($(".lwhSlidebox:visible").length <= 0) {
                                $(window).unbind("resize.lwhSlidebox");
                            }
                            if (def_settings.box_close) def_settings.box_close();
                        });
                    } else {
                        $(".lwhSlidebox").css("zIndex", function (idx0, val0) {
                            return $(this).attr("zidx");
                        });
                        $(el).css("zIndex", parseInt($(el).attr("bidx")) + $(".lwhSlidebox").length + 1);


                        if (def_settings.pin && $(el).attr("showed") == 1) {
                            $(el).stop(true, true).slideDown(200, function () {
                                if (def_settings.box_open) def_settings.box_open();
                            });
                        } else {
                            $(el).attr("showed", 1);
                            var el_pos = $.lwhSlidebox_getELPos(el);
                            $(el).stop(true, true).css({
                                left: el_pos.left,
                                top: el_pos.top
                            }).slideDown(200, function () {
                                if (def_settings.box_open) def_settings.box_open();
                            });
                        }
                        $(window).unbind("resize.lwhSlidebox").bind("resize.lwhSlidebox", function () {
                            $.lwhSlidebox_window_event();
                        });
                    }
                    // don't clog other event
                    //return false;
                });
            }


            if (def_settings.movable) {
                $("div.lwhSlidebox-header-title", el).css("cursor", "move");
                $(el).draggable({
                    handle: $("div.lwhSlidebox-header-title", el),
                    start: function () {
                    },
                    stop: function () {
                    }
                });
            }



            $(".lwhSlidebox-header-close, .lwhSlidebox-footer-close", el).bind("click.lwhSlidebox", function (ev) {
                $(el).stop(true, true).slideUp(200, function () {
                    $(el).css({
                        "zIndex": $(el).attr("zidx"),
                        left: -2000,
                        top: -2000
                    });

                    if ($(".lwhSlidebox:visible").length <= 0) {
                        $(window).unbind("resize.lwhSlidebox");
                    }

                    if (def_settings.box_close) def_settings.box_close();
                });
                // prevent trigger window div click event ,  not to make close window div to the top
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            });
            // end of close button  and close icon

            def_settings.zIndex++;
            if (def_settings.box_init) def_settings.box_init();

        }); // end of return this.each
    },


    boxShow: function (opts) {
        return this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");
            $.extend(def_settings, opts);

            if (opts && opts.title && opts.title != "") {
                $(".lwhSlidebox-header-title", el).html(opts.title);
            }

            $(".lwhSlidebox").css("zIndex", function (idx0, val0) {
                return $(this).attr("zidx");
            });
            $(el).css("zIndex", parseInt($(el).attr("bidx")) + $(".lwhSlidebox").length + 1);

            if (def_settings.pin) {
                $(el).stop(true, true).slideDown(200, function () {
                    if (def_settings.box_open) def_settings.box_open();
                });
            } else {
                var el_pos = $.lwhSlidebox_getELPos(el);
                $(el).stop(true, true).css({
                    left: el_pos.left,
                    top: el_pos.top
                }).slideDown(200, function () {
                    if (def_settings.box_open) def_settings.box_open();
                });
            }

            $(window).unbind("resize.lwhSlidebox").bind("resize.lwhSlidebox", function () {
                $.lwhSlidebox_window_event();
            });
        });
    },

    boxHide: function (opts) {
        return this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");
            $.extend(def_settings, opts);
            $(el).stop(true, true).slideUp(200, function () {
                $(el).css({
                    "zIndex": $(el).attr("zidx"),
                    left: -2000,
                    top: -2000
                });

                if ($(".lwhSlidebox:visible").length <= 0) {
                    $(window).unbind("resize.lwhSlidebox");
                }

                if (def_settings.box_close) def_settings.box_close();

            });
            return false;
        });
    },

    boxAutoShow: function (opts) {
        return this.each(function (idx, el) {
            if ($(el).is(":hidden")) {
                var def_settings = $(el).data("default_settings");
                $.extend(def_settings, opts);

                if (opts && opts.title && opts.title != "") {
                    $(".lwhSlidebox-header-title", el).html(opts.title);
                }

                $(".lwhSlidebox").css("zIndex", function (idx0, val0) {
                    return $(this).attr("zidx");
                });
                $(el).css("zIndex", parseInt($(el).attr("bidx")) + $(".lwhSlidebox").length + 1);

                $(window).unbind("resize.lwhSlidebox").bind("resize.lwhSlidebox", function () {
                    $.lwhSlidebox_window_event();
                });

                if (def_settings.pin) {
                    $(el).stop(true, true).slideDown(200, function () {
                        if (def_settings.box_open) def_settings.box_open();
                    }).delay(3000).slideUp(200, function () {
                        $(el).css({
                            "zIndex": $(el).attr("zidx"),
                            left: -2000,
                            top: -2000
                        });

                        if ($(".lwhSlidebox:visible").length <= 0) {
                            $(window).unbind("resize.lwhSlidebox");
                        }
                        if (def_settings.box_close) def_settings.box_close();
                    });
                } else {
                    var el_pos = $.lwhSlidebox_getELPos(el);
                    $(el).stop(true, true).css({
                        left: el_pos.left,
                        top: el_pos.top
                    }).slideDown(200, function () {
                        if (def_settings.box_open) def_settings.box_open();
                    }).delay(3000).slideUp(200, function () {
                        $(el).css({
                            "zIndex": $(el).attr("zidx"),
                            left: -2000,
                            top: -2000
                        });

                        if ($(".lwhSlidebox:visible").length <= 0) {
                            $(window).unbind("resize.lwhSlidebox");
                        }
                        if (def_settings.box_close) def_settings.box_close();
                    });
                }
            }
        });
    }
});

$.extend({
    lwhSlidebox_getLTWH: function (container) {
        var layout = {};
        if (container == "") {
            container = window;
            layout.left = $(container).scrollLeft();
            layout.top = $(container).scrollTop();
            layout.width = $(container).width();
            layout.height = $(container).height();
        } else {
            layout.left = $(container).offset().left;
            layout.top = $(container).offset().top;
            layout.width = $(container).outerWidth();
            layout.height = $(container).outerHeight();
        }
        return layout;
    },
    // get left, top, position for element
    lwhSlidebox_getELPos: function (el) {
        var def_settings = $(el).data("default_settings");
        var el_pos = {};
        el_pos.left = 0;
        el_pos.top = 0;

        var rel_pos = {};
        rel_pos.left = 0;
        rel_pos.top = 0;

        var cont = $.lwhSlidebox_getLTWH(def_settings.trigger);
        var el_width = $(el).outerWidth();
        var el_height = $(el).outerHeight();

        if (def_settings.offsetTo == "") {
            if (isNaN(def_settings.top)) {
                switch (def_settings.top) {
                    case "top":
                        el_pos.top = cont.top + 5;
                        break;
                    case "middle":
                        el_pos.top = cont.top + (cont.height - el_height) / 2;
                        break;
                    case "bottom":
                        el_pos.top = cont.top + cont.height - el_height - 5;
                        break;
                    default:
                        el_pos.top = cont.top;
                        break;
                }
            } else {
                el_pos.top = cont.top + parseInt(def_settings.top);
            }
        } else {
            el_pos.top = cont.top + cont.height + (isNaN(def_settings.top) ? 0 : parseInt(def_settings.top));
        }


        if (def_settings.offsetTo == "") {
            if (isNaN(def_settings.left)) {
                switch (def_settings.left) {
                    case "left":
                        el_pos.left = cont.left + 5;
                        break;
                    case "center":
                        el_pos.left = cont.left + (cont.width - el_width) / 2 + 5;
                        break;
                    case "right":
                        el_pos.left = cont.left + cont.width - el_width - 5;
                        break;
                    default:
                        el_pos.left = cont.left + 5;
                        break;
                }
            } else {
                el_pos.left = cont.left + parseInt(def_settings.left) + 5;
            }
        } else {
            if (isNaN(def_settings.left)) {
                switch (def_settings.left) {
                    case "left":
                        el_pos.left = cont.left + 5;
                        break;
                    case "center":
                        el_pos.left = cont.left + (cont.width - el_width) / 2 + 5;
                        break;
                    case "right":
                        el_pos.left = cont.left + cont.width - el_width + 5;
                        break;
                    default:
                        el_pos.left = cont.left + 5;
                        break;
                }
            } else {
                el_pos.left = cont.left + parseInt(def_settings.left) + 5;
            }

            if (def_settings.inBound) {
                if (el_pos.left + el_width >= $(window).width() - 40) {
                    el_pos.left = $(window).width() - el_width - 40;
                }
            }
        }

        // think about  out of boundary;
        if (el_pos.left <= 0) el_pos.left = 5;
        if (el_pos.top <= 0) el_pos.top = 5;
        return el_pos;
    },

    lwhSlidebox_window_event: function () {
        $(".lwhSlidebox:visible").each(function (idx0, el0) {
            var el_pos = $.lwhSlidebox_getELPos(el0);
            $(el0).stop(true, true).delay(200).animate({
                left: el_pos.left,
                top: el_pos.top
            }, 50);

        });
    }
});

