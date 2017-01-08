$.fn.extend({
    wliuPopup: function (opts) {
        var def_settings = {
            title:          "",
            placement:      ""  // left right up down, 
        };
        $.extend(def_settings, opts);

        /*** begin return ***/
        return this.each(function (idx, el) {
            if( !$(el).hasClass("wliu-popup") ) $(el).addClass("wliu-popup");
            $(el).data("default_settings", def_settings);
            if( $(el).has("s.arrow-left").length<=0 ) $(el).prepend('<s class="arrow arrow-left"></s>');
            if( $(el).has("s.arrow-right").length<=0 ) $(el).prepend('<s class="arrow arrow-right"></s>');
            if( $(el).has("s.arrow-up").length<=0 ) $(el).prepend('<s class="arrow arrow-up"></s>');
            if( $(el).has("s.arrow-head-up").length<=0 ) $(el).prepend('<s class="arrow arrow-head-up"></s>');
            if( $(el).has("s.arrow-down").length<=0 ) $(el).prepend('<s class="arrow arrow-down"></s>');
            
            if(def_settings.title!="") {
                if( $(el).has("div.wliu-popup-header").length<=0 ) $(el).prepend('<div class="wliu-popup-header">' + def_settings.title + '</div>');
            }
            if( $(el).has("div.wliu-popup-content").length<=0 ) $(el).append('<div class="wliu-popup-content"></div>');
        });
        /*** end return ***/
    }
});    


$(function(){
    $(document).off("click", "*[wliu-popup][popup-toggle='click']").on("click", "*[wliu-popup][popup-toggle='click']", function(evt){
        var target_el = $(this).attr("popup-target");
        var target_content  = $(this).attr("popup-content");

        if( $( target_el ).is(":hidden")  ) {
            /********************************************************************************** */
            if(target_content) {
                    var target_pl       = $(this).attr("popup-placement");
                    var target_tt       = $(this).attr("popup-title");

                    var def_settings = $( target_el ).data("default_settings");
                    target_pl = target_pl?target_pl:def_settings.placement;
                    target_tt = target_tt?target_tt:def_settings.title;
                    
                    if( target_tt ) {
                        if( $(target_el).has("div.wliu-popup-header").length<=0 )
                            $(target_el).prepend('<div class="wliu-popup-header">' + target_tt + '</div>');
                        else 
                            $( "div.wliu-popup-header", $(target_el) ).html(target_tt);
                    } else {
                        $( "div.wliu-popup-header", $(target_el) ).remove();
                    }

                    $( "div.wliu-popup-content", $(target_el) ).html(target_content);
                    $(target_el).addClass("wliu-popup-active");
                    var nleft   = -900;
                    var ntop    = -900;

                    switch( ("" + target_pl).toLowerCase() ) {
                        case "left":
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            $("s.arrow-left", $(target_el)).addClass("arrow-active");

                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            break;
                        case "right":
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            $("s.arrow-right", $(target_el)).addClass("arrow-active");
                            nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            break;
                        case "up":
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            if( $(target_el).has("div.wliu-popup-header").length<=0 )
                                $("s.arrow-up", $(target_el)).addClass("arrow-active");
                            else 
                                $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
        
                            nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                            ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                            break;
                        case "down":
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            $("s.arrow-down", $(target_el)).addClass("arrow-active");
                            nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                            ntop = $(this).offset().top - $(target_el).outerHeight() - 12;
                            break;
                        default:
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            var nplace = "left";
                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            var cleft = $(this).offset().left + $(this).outerWidth() + $(target_el).outerWidth() + 12;

                            if( ntop > 0 ) {
                                    // place to left first, then right
                                    if( cleft <= $(window).width() ) {
                                            nplace = "left";
                                            $("s.arrow-left", $(target_el)).addClass("arrow-active");
                                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                    } else {
                                            cleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                            if( cleft >= 0 ) {
                                                    nplace = "right";
                                                    $("s.arrow-right", $(target_el)).addClass("arrow-active");
                                                    nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                                    ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                            } else { 
                                                    nplace = "up";
                                                    if( $(target_el).has("div.wliu-popup-header").length<=0 )
                                                        $("s.arrow-up", $(target_el)).addClass("arrow-active");
                                                    else 
                                                        $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
                                
                                                    nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                                    ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                                            }
                                    }                      

                            } else {
                                    nplace = "up";
                                    if( $(target_el).has("div.wliu-popup-header").length<=0 )
                                        $("s.arrow-up", $(target_el)).addClass("arrow-active");
                                    else 
                                        $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
                
                                    nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                    ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                            }
                            break;
                    }

                    $(target_el).offset({left:nleft, top:ntop});
            } else {
                $( "div.wliu-popup-header", $(target_el) ).remove();
                $( "div.wliu-popup-content", $(target_el) ).empty();
            }
            /********************************************************************************** */
        } else {
            $(target_el).removeClass("wliu-popup-active");
            $( "div.wliu-popup-header", $(target_el) ).remove();
            $( "div.wliu-popup-content", $(target_el) ).empty();
        }
    });


    $(document).off("focus", "*[wliu-popup][popup-toggle='focus']").on("focus", "*[wliu-popup][popup-toggle='focus']", function(evt){
        var target_el = $(this).attr("popup-target");
        var target_content  = $(this).attr("popup-content");

        if( $( target_el ).is(":hidden")  ) {
            /********************************************************************************** */
            if(target_content) {
                    var target_pl       = $(this).attr("popup-placement");
                    var target_tt       = $(this).attr("popup-title");

                    var def_settings = $( target_el ).data("default_settings");
                    target_pl = target_pl?target_pl:(def_settings?def_settings.placement:"");
                    target_tt = target_tt?target_tt:(def_settings?def_settings.title:"");
                    
                    if( target_tt ) {
                        if( $(target_el).has("div.wliu-popup-header").length<=0 )
                            $(target_el).prepend('<div class="wliu-popup-header">' + target_tt + '</div>');
                        else 
                            $( "div.wliu-popup-header", $(target_el) ).html(target_tt);
                    } else {
                        $( "div.wliu-popup-header", $(target_el) ).remove();
                    }

                    $( "div.wliu-popup-content", $(target_el) ).html(target_content);
                    $(target_el).addClass("wliu-popup-active");
                    var nleft   = -900;
                    var ntop    = -900;

                    switch( ("" + target_pl).toLowerCase() ) {
                        case "left":
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            $("s.arrow-left", $(target_el)).addClass("arrow-active");

                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            break;
                        case "right":
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            $("s.arrow-right", $(target_el)).addClass("arrow-active");
                            nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            break;
                        case "up":
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            if( $(target_el).has("div.wliu-popup-header").length<=0 )
                                $("s.arrow-up", $(target_el)).addClass("arrow-active");
                            else 
                                $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
        
                            nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                            ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                            break;
                        case "down":
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            $("s.arrow-down", $(target_el)).addClass("arrow-active");
                            nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                            ntop = $(this).offset().top - $(target_el).outerHeight() - 12;
                            break;
                        default:
                            $("s.arrow", $(target_el)).removeClass("arrow-active");
                            var nplace = "left";
                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            var cleft = $(this).offset().left + $(this).outerWidth() + $(target_el).outerWidth() + 12;

                            if( ntop > 0 ) {
                                    // place to left first, then right
                                    if( cleft <= $(window).width() ) {
                                            nplace = "left";
                                            $("s.arrow-left", $(target_el)).addClass("arrow-active");
                                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                    } else {
                                            cleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                            if( cleft >= 0 ) {
                                                    nplace = "right";
                                                    $("s.arrow-right", $(target_el)).addClass("arrow-active");
                                                    nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                                    ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                            } else { 
                                                    nplace = "up";
                                                    if( $(target_el).has("div.wliu-popup-header").length<=0 )
                                                        $("s.arrow-up", $(target_el)).addClass("arrow-active");
                                                    else 
                                                        $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
                                
                                                    nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                                    ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                                            }
                                    }                      

                            } else {
                                    nplace = "up";
                                    if( $(target_el).has("div.wliu-popup-header").length<=0 )
                                        $("s.arrow-up", $(target_el)).addClass("arrow-active");
                                    else 
                                        $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
                
                                    nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                    ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                            }
                            break;
                    }

                    $(target_el).offset({left:nleft, top:ntop});
            } else {
                $( "div.wliu-popup-header", $(target_el) ).remove();
                $( "div.wliu-popup-content", $(target_el) ).empty();
            }
            /********************************************************************************** */
        } else {
            $(target_el).removeClass("wliu-popup-active");
            $( "div.wliu-popup-header", $(target_el) ).remove();
            $( "div.wliu-popup-content", $(target_el) ).empty();
        }
    });


    $(document).off("mouseover", "*[wliu-popup][popup-toggle='hover']").on("mouseover", "*[wliu-popup][popup-toggle='hover']", function(evt){
        var target_el       = $(this).attr("popup-target");
        var target_content  = $(this).attr("popup-content");

        /*** content not empty ***/
        if(target_content) {
                var target_pl       = $(this).attr("popup-placement");
                var target_tt       = $(this).attr("popup-title");

                var def_settings = $( target_el ).data("default_settings");
                target_pl = target_pl?target_pl:(def_settings?def_settings.placement:"");
                target_tt = target_tt?target_tt:(def_settings?def_settings.title:"");
                
                if( target_tt ) {
                    if( $(target_el).has("div.wliu-popup-header").length<=0 )
                        $(target_el).prepend('<div class="wliu-popup-header">' + target_tt + '</div>');
                    else 
                        $( "div.wliu-popup-header", $(target_el) ).html(target_tt);
                } else {
                    $( "div.wliu-popup-header", $(target_el) ).remove();
                }

                $( "div.wliu-popup-content", $(target_el) ).html(target_content);
                $(target_el).addClass("wliu-popup-active");
                var nleft   = -900;
                var ntop    = -900;

                switch( ("" + target_pl).toLowerCase() ) {
                    case "left":
                        $("s.arrow", $(target_el)).removeClass("arrow-active");
                        $("s.arrow-left", $(target_el)).addClass("arrow-active");

                        nleft = $(this).offset().left + $(this).outerWidth() + 12;
                        ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                        break;
                    case "right":
                        $("s.arrow", $(target_el)).removeClass("arrow-active");
                        $("s.arrow-right", $(target_el)).addClass("arrow-active");
                        nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                        ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                        break;
                    case "up":
                        $("s.arrow", $(target_el)).removeClass("arrow-active");
                        if( $(target_el).has("div.wliu-popup-header").length<=0 )
                            $("s.arrow-up", $(target_el)).addClass("arrow-active");
                        else 
                            $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
    
                        nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                        ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                        break;
                    case "down":
                        $("s.arrow", $(target_el)).removeClass("arrow-active");
                        $("s.arrow-down", $(target_el)).addClass("arrow-active");
                        nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                        ntop = $(this).offset().top - $(target_el).outerHeight() - 12;
                        break;
                    default:
                        $("s.arrow", $(target_el)).removeClass("arrow-active");
                        var nplace = "left";
                        nleft = $(this).offset().left + $(this).outerWidth() + 12;
                        ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                        var cleft = $(this).offset().left + $(this).outerWidth() + $(target_el).outerWidth() + 12;

                        if( ntop > 0 ) {
                                // place to left first, then right
                                if( cleft <= $(window).width() ) {
                                        nplace = "left";
                                        $("s.arrow-left", $(target_el)).addClass("arrow-active");
                                        nleft = $(this).offset().left + $(this).outerWidth() + 12;
                                        ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                } else {
                                        cleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                        if( cleft >= 0 ) {
                                                nplace = "right";
                                                $("s.arrow-right", $(target_el)).addClass("arrow-active");
                                                nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                                ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                        } else { 
                                                nplace = "up";
                                                if( $(target_el).has("div.wliu-popup-header").length<=0 )
                                                    $("s.arrow-up", $(target_el)).addClass("arrow-active");
                                                else 
                                                    $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
                            
                                                nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                                ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                                        }
                                }                      

                        } else {
                                nplace = "up";
                                if( $(target_el).has("div.wliu-popup-header").length<=0 )
                                    $("s.arrow-up", $(target_el)).addClass("arrow-active");
                                else 
                                    $("s.arrow-head-up", $(target_el)).addClass("arrow-active");
            
                                nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                        }
                        break;
                }

                $(target_el).offset({left:nleft, top:ntop});
        } else {
            $( "div.wliu-popup-header", $(target_el) ).remove();
            $( "div.wliu-popup-content", $(target_el) ).empty();
        }
        /*** --content not empty ***/
    });
    $(document).off("mouseout", "*[wliu-popup][popup-toggle='hover']").on("mouseout", "*[wliu-popup][popup-toggle='hover']", function(evt){
        var target_el  = $(this).attr("popup-target");
        $(target_el).removeClass("wliu-popup-active");
        $( "div.wliu-popup-header", $(target_el) ).remove();
        $( "div.wliu-popup-content", $(target_el) ).empty();
    });

});