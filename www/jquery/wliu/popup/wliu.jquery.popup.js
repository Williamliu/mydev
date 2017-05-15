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
    },

    wliuColError: function(opts) {
        var def_settings = {
        };
        $.extend(def_settings, opts);

        if( $("#wliu_form_tooltip").length <= 0 ) {
            $("body").append('<div id="wliu_form_tooltip" wliu-popup></div>');
        }

        /*** begin return ***/
        return this.each(function (idx, el) {
            if( !$(el).hasClass("wliu-btn16") ) $(el).addClass("wliu-btn16");
            if( !$(el).hasClass("wliu-btn16-error-help") ) $(el).addClass("wliu-btn16-error-help");
            if( !$(el).hasAttr("popup-target") ) $(el).attr("popup-target","#wliu_form_tooltip");
            if( !$(el).hasAttr("popup-toggle") ) $(el).attr("popup-toggle","hover");
            if( !$(el).hasAttr("popup-placement") ) $(el).attr("popup-placement","down");
            if( !$(el).hasAttr("popup-body") ) $(el).attr("popup-body","");
        });
        /*** end return ***/
    },

    wliuFormMessage: function(opts) {
        var def_settings = {
        };
        $.extend(def_settings, opts);
        /*** begin return ***/
        return this.each(function (idx, el) {
            $(el).attr("id", "wliu-form-message-id");
            $(el).addClass("card card-danger text-center z-depth-2 mb-1 white-text").css("padding", "10px");
            var htmlContent = [
                '<div style="font-size:16px;text-align:left;">',
                '<i class="fa fa-exclamation-triangle fa-md" aria-hidden="true" style="color:white;"></i> <span style="font-size:16px;">',
                gwords("We cant process submitted data:"),
                '</span>',
                '<div id="wliu-form-message-body" style="margin-top:5px;padding-left:20px;" class="white-text"></div>',
                '</div>'
            ].join("");
            $(el).append(htmlContent);
        });
        /*** end return ***/
    },
    
    wliuFormPopup: function(opts) {
        var def_settings = {
        };
        $.extend(def_settings, opts);

        /*** begin return ***/
        return this.each(function (idx, el) {
            $(el).attr("id", "wliu-form-popup-id");
            $(el).attr("wliu-diag","").attr("movable", "").attr("maskable","");
            var htmlContent = [
                '<div wliu-diag-head>',
                    gwords("Message"),
                '</div>',
                    '<div wliu-diag-body style="font-size:16px;">',
                    '<i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true" style="color:red;"></i> <span style="font-size:16px;">',
                    gwords("We cant process submitted data:"),
                    '</span>',
                    '<div id="wliu-form-popup-body" style="margin-top:5px;"></div>',
                '</div>',    
            ].join("");
            $(el).append(htmlContent);
        });
        /*** end return ***/
    },
    wliuAutoTip: function(opts) {
        var def_settings = {
        };
        $.extend(def_settings, opts);
        /*** begin return ***/
        return this.each(function (idx, el) {
            $(el).attr("id", "wliu-autotip-id");
        });
        /*** end return ***/
    },
    wliuWait: function(opts) {
        var def_settings = {
        };
        $.extend(def_settings, opts);
        /*** begin return ***/
        return this.each(function (idx, el) {
            $(el).attr("id", "wliu-wait-id");
        });
        /*** end return ***/
    }
});    


$(function(){
    /*** Form Use ***/
    $("a[wliu-form-col-error]").wliuColError({});
    $("div[wliu-form-message]").wliuFormMessage({});

	$("div[wliu-form-popup]").wliuFormPopup({});
    $("div[wliu-form-popup]").wliuDiag({});
    /****************/

    /*** FOR ALL USE ***/
    $("div[wliu-autotip]").wliuAutoTip({});
    $("div[wliu-autotip]").wliuTips({});

    $("div[wliu-wait]").wliuWait({});
    $("div[wliu-wait]").wliuLoad({});
    /*******************/



    /*** popup ***/
    $("div[wliu-popup]").wliuPopup({});

    $(document).off("click", "*[popup-toggle='click']").on("click", "*[popup-toggle='click']", function(evt){
        var target_el = $(this).attr("popup-target");
        var target_content  = $(this).attr("popup-body");

        if( $( target_el ).is(":hidden")  ) {
            /********************************************************************************** */
            if(target_content) {
                    var target_pl       = $(this).attr("popup-placement");
                    var target_tt       = $(this).attr("popup-head");

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
                                    if( cleft <= $(window).scrollLeft() + window.innerWidth ) {
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


    $(document).off("focus", "*[popup-toggle='focus']").on("focus", "*[popup-toggle='focus']", function(evt){
        var target_el = $(this).attr("popup-target");
        var target_content  = $(this).attr("popup-body");

        if( $( target_el ).is(":hidden")  ) {
            /********************************************************************************** */
            if(target_content) {
                    var target_pl       = $(this).attr("popup-placement");
                    var target_tt       = $(this).attr("popup-head");

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
                                    if( cleft <= $(window).scrollLeft() + window.innerWidth ) {
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


    $(document).off("mouseover", "*[popup-toggle='hover']").on("mouseover", "*[popup-toggle='hover']", function(evt){
        var target_el       = $(this).attr("popup-target");
        var target_content  = $(this).attr("popup-body");

        /*** content not empty ***/
        if(target_content) {
                var target_pl       = $(this).attr("popup-placement");
                var target_tt       = $(this).attr("popup-head");
                
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
                                if( cleft <=  $(window).scrollLeft() + window.innerWidth ) {
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
    $(document).off("mouseout", "*[popup-toggle='hover']").on("mouseout", "*[popup-toggle='hover']", function(evt){
        var target_el  = $(this).attr("popup-target");
        $(target_el).removeAttr("active");
        $( "div[wliu-popup-head]", $(target_el) ).remove();
        $( "div[wliu-popup-body]", $(target_el) ).empty();
    });
    $(document).off("mouseleft", "*[popup-toggle='hover']").on("mouseleft", "*[popup-toggle='hover']", function(evt){
        var target_el  = $(this).attr("popup-target");
        $(target_el).removeAttr("active");
        $( "div[wliu-popup-head]", $(target_el) ).remove();
        $( "div[wliu-popup-body]", $(target_el) ).empty();
    });
    
});