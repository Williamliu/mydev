$.fn.extend({
    wliuPopup: function (opts) {
        //placement: left right up down;
        var def_settings = {
            //placement:      ""  // left right up down, 
        };
        $.extend(def_settings, opts);

        /*** begin return ***/
        return this.each(function (idx, el) {
            if( !$(el).hasAttr("wliu-popup") ) $(el).addAttr("wliu-popup");
            if( $(el).has("s[arrow][left]").length<=0 ) $(el).prepend('<s arrow left></s>');
            if( $(el).has("s[arrow][right]").length<=0 ) $(el).prepend('<s arrow right></s>');
            if( $(el).has("s[arrow][up]").length<=0 ) $(el).prepend('<s arrow up></s>');
            if( $(el).has("s[arrow][head-up]").length<=0 ) $(el).prepend('<s arrow head-up></s>');
            if( $(el).has("s[arrow][down]").length<=0 ) $(el).prepend('<s arrow down></s>');
            
            if( $(el).has("div[wliu-popup-body]").length<=0 ) $(el).append('<div wliu-popup-body></div>');
        });
        /*** end return ***/
    }
});    


$(function(){
    $("div[wliu-popup]").wliuPopup({});

    $(document).off("click", "*[wliu-role='wliu-popup'][wliu-toggle='click']").on("click", "*[wliu-role='wliu-popup'][wliu-toggle='click']", function(evt){
        var target_el = $(this).attr("wliu-target");
        var target_content  = $(this).attr("wliu-body");

        if( $( target_el ).is(":hidden")  ) {
            /********************************************************************************** */
            if(target_content) {
                    var target_pl       = $(this).attr("placement");
                    var target_tt       = $(this).attr("wliu-head");

                    if( target_tt ) {
                        if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                            $(target_el).prepend('<div wliu-popup-head>' + target_tt + '</div>');
                        else 
                            $( "div[wliu-popup-head]", $(target_el) ).html(target_tt);
                    } else {
                        $( "div[wliu-popup-head]", $(target_el) ).remove();
                    }

                    $( "div[wliu-popup-body]", $(target_el) ).html(target_content);
                    $(target_el).addAttr("active");
                    var nleft   = -900;
                    var ntop    = -900;

                    switch( ("" + target_pl).toLowerCase() ) {
                        case "left":
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            $("s[arrow][left]", $(target_el)).addAttr("active");

                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            break;
                        case "right":
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            $("s[arrow][right]", $(target_el)).addAttr("active");
                            nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            break;
                        case "up":
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                                $("s[arrow][up]", $(target_el)).addAttr("active");
                            else 
                                $("s[arrow][head-up]", $(target_el)).addAttr("active");
        
                            nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                            ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                            break;
                        case "down":
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            $("s[arrow][down]", $(target_el)).addAttr("active");
                            nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                            ntop = $(this).offset().top - $(target_el).outerHeight() - 12;
                            break;
                        default:
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            var nplace = "left";
                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            var cleft = $(this).offset().left + $(this).outerWidth() + $(target_el).outerWidth() + 12;

                            if( ntop > 0 ) {
                                    // place to left first, then right
                                    if( cleft <= $(window).width() ) {
                                            nplace = "left";
                                            $("s[arrow][left]", $(target_el)).addAttr("active");
                                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                    } else {
                                            cleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                            if( cleft >= 0 ) {
                                                    nplace = "right";
                                                    $("s[arrow][right]", $(target_el)).addAttr("active");
                                                    nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                                    ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                            } else { 
                                                    nplace = "up";
                                                    if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                                                        $("s[arrow][up]", $(target_el)).addAttr("active");
                                                    else 
                                                        $("s[arrow][head-up]", $(target_el)).addAttr("active");
                                
                                                    nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                                    ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                                            }
                                    }                      

                            } else {
                                    nplace = "up";
                                    if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                                        $("s[arrow][up]", $(target_el)).addAttr("active");
                                    else 
                                        $("s[arrow][head-up]", $(target_el)).addAttr("active");
                
                                    nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                    ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                            }
                            break;
                    }

                    $(target_el).offset({left:nleft, top:ntop});
            } else {
                $( "div[wliu-popup-head]", $(target_el) ).remove();
                $( "div[wliu-popup-body]", $(target_el) ).empty();
            }
            /********************************************************************************** */
        } else {
            $(target_el).removeAttr("active");
            $( "div[wliu-popup-head]", $(target_el) ).remove();
            $( "div[wliu-popup-body]", $(target_el) ).empty();
        }
    });


    $(document).off("focus", "*[wliu-role='wliu-popup'][wliu-toggle='focus']").on("focus", "*[wliu-role='wliu-popup'][wliu-toggle='focus']", function(evt){
        var target_el = $(this).attr("wliu-target");
        var target_content  = $(this).attr("wliu-body");

        if( $( target_el ).is(":hidden")  ) {
            /********************************************************************************** */
            if(target_content) {
                    var target_pl       = $(this).attr("placement");
                    var target_tt       = $(this).attr("wliu-head");

                    if( target_tt ) {
                        if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                            $(target_el).prepend('<div wliu-popup-head>' + target_tt + '</div>');
                        else 
                            $( "div[wliu-popup-head]", $(target_el) ).html(target_tt);
                    } else {
                        $( "div[wliu-popup-head]", $(target_el) ).remove();
                    }

                    $( "div[wliu-popup-body]", $(target_el) ).html(target_content);
                    $(target_el).addAttr("active");
                    var nleft   = -900;
                    var ntop    = -900;

                    switch( ("" + target_pl).toLowerCase() ) {
                        case "left":
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            $("s[arrow][left]", $(target_el)).addAttr("active");

                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            break;
                        case "right":
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            $("s[arrow][right]", $(target_el)).addAttr("active");
                            nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            break;
                        case "up":
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                                $("s[arrow][up]", $(target_el)).addAttr("active");
                            else 
                                $("s[arrow][head-up]", $(target_el)).addAttr("active");
        
                            nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                            ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                            break;
                        case "down":
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            $("s[arrow][down]", $(target_el)).addAttr("active");
                            nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                            ntop = $(this).offset().top - $(target_el).outerHeight() - 12;
                            break;
                        default:
                            $("s[arrow]", $(target_el)).removeAttr("active");
                            var nplace = "left";
                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                            var cleft = $(this).offset().left + $(this).outerWidth() + $(target_el).outerWidth() + 12;

                            if( ntop > 0 ) {
                                    // place to left first, then right
                                    if( cleft <= $(window).width() ) {
                                            nplace = "left";
                                            $("s[arrow][left]", $(target_el)).addAttr("active");
                                            nleft = $(this).offset().left + $(this).outerWidth() + 12;
                                            ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                    } else {
                                            cleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                            if( cleft >= 0 ) {
                                                    nplace = "right";
                                                    $("s[arrow][right]", $(target_el)).addAttr("active");
                                                    nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                                    ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                            } else { 
                                                    nplace = "up";
                                                    if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                                                        $("s[arrow][up]", $(target_el)).addAttr("active");
                                                    else 
                                                        $("s[arrow][head-up]", $(target_el)).addAttr("active");
                                
                                                    nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                                    ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                                            }
                                    }                      

                            } else {
                                    nplace = "up";
                                    if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                                        $("s[arrow][up]", $(target_el)).addAttr("active");
                                    else 
                                        $("s[arrow][head-up]", $(target_el)).addAttr("active");
                
                                    nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                    ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                            }
                            break;
                    }

                    $(target_el).offset({left:nleft, top:ntop});
            } else {
                $( "div[wliu-popup-head]", $(target_el) ).remove();
                $( "div[wliu-popup-body]", $(target_el) ).empty();
            }
            /********************************************************************************** */
        } else {
            $(target_el).removeAttr("active");
            $( "div[wliu-popup-head]", $(target_el) ).remove();
            $( "div[wliu-popup-body]", $(target_el) ).empty();
        }
    });


    $(document).off("mouseover", "*[wliu-role='wliu-popup'][wliu-toggle='hover']").on("mouseover", "*[wliu-role='wliu-popup'][wliu-toggle='hover']", function(evt){
        var target_el       = $(this).attr("wliu-target");
        var target_content  = $(this).attr("wliu-body");

        /*** content not empty ***/
        if(target_content) {
                var target_pl       = $(this).attr("placement");
                var target_tt       = $(this).attr("wliu-head");
                
                if( target_tt ) {
                    if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                        $(target_el).prepend('<div wliu-popup-head>' + target_tt + '</div>');
                    else 
                        $( "div[wliu-popup-head]", $(target_el) ).html(target_tt);
                } else {
                    $( "div[wliu-popup-head]", $(target_el) ).remove();
                }
              
                $( "div[wliu-popup-body]", $(target_el) ).html(target_content);
                $(target_el).addAttr("active");
                var nleft   = -900;
                var ntop    = -900;

                switch( ("" + target_pl).toLowerCase() ) {
                    case "left":
                        $("s[arrow]", $(target_el)).removeAttr("active");
                        $("s[arrow][left]", $(target_el)).addAttr("active");

                        nleft = $(this).offset().left + $(this).outerWidth() + 12;
                        ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                        break;
                    case "right":
                        $("s[arrow]", $(target_el)).removeAttr("active");
                        $("s[arrow][right]", $(target_el)).addAttr("active");
                        nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                        ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                        break;
                    case "up":
                        $("s[arrow]", $(target_el)).removeAttr("active");
                        if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                            $("s[arrow][up]", $(target_el)).addAttr("active");
                        else 
                            $("s[arrow][head-up]", $(target_el)).addAttr("active");
    
                        nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                        ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                        break;
                    case "down":
                        $("s[arrow]", $(target_el)).removeAttr("active");
                        $("s[arrow][down]", $(target_el)).addAttr("active");
                        nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                        ntop = $(this).offset().top - $(target_el).outerHeight() - 12;
                        break;
                    default:
                        $("s[arrow]", $(target_el)).removeAttr("active");
                        var nplace = "left";
                        nleft = $(this).offset().left + $(this).outerWidth() + 12;
                        ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                        var cleft = $(this).offset().left + $(this).outerWidth() + $(target_el).outerWidth() + 12;

                        if( ntop > 0 ) {
                                // place to left first, then right
                                if( cleft <= $(window).width() ) {
                                        nplace = "left";
                                        $("s[arrow][left]", $(target_el)).addAttr("active");
                                        nleft = $(this).offset().left + $(this).outerWidth() + 12;
                                        ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                } else {
                                        cleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                        if( cleft >= 0 ) {
                                                nplace = "right";
                                                $("s[arrow][right]", $(target_el)).addAttr("active");
                                                nleft = $(this).offset().left - $(target_el).outerWidth() - 12;
                                                ntop = $(this).offset().top + $(this).outerHeight()/2 - $(target_el).outerHeight()/2;
                                        } else { 
                                                nplace = "up";
                                                if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                                                    $("s[arrow][up]", $(target_el)).addAttr("active");
                                                else 
                                                    $("s[arrow][head-up]", $(target_el)).addAttr("active");
                            
                                                nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                                ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                                        }
                                }                      

                        } else {
                                nplace = "up";
                                if( $(target_el).has("div[wliu-popup-head]").length<=0 )
                                    $("s[arrow][up]", $(target_el)).addAttr("active");
                                else 
                                    $("s[arrow][head-up]", $(target_el)).addAttr("active");
            
                                nleft = $(this).offset().left + ( $(this).outerWidth() - $(target_el).outerWidth() ) / 2;
                                ntop = $(this).offset().top + $(this).outerHeight()  + 12;
                        }
                        break;
                }

                $(target_el).offset({left:nleft, top:ntop});
        } else {
            $( "div[wliu-popup-head]", $(target_el) ).remove();
            $( "div[wliu-popup-body]", $(target_el) ).empty();
        }
        /*** --content not empty ***/
    });
    $(document).off("mouseout", "*[wliu-role='wliu-popup'][wliu-toggle='hover']").on("mouseout", "*[wliu-role='wliu-popup'][wliu-toggle='hover']", function(evt){
        var target_el  = $(this).attr("wliu-target");
        $(target_el).removeAttr("active");
        $( "div[wliu-popup-head]", $(target_el) ).remove();
        $( "div[wliu-popup-body]", $(target_el) ).empty();
    });

});