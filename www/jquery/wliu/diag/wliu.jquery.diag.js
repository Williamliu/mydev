$.fn.extend({
    wliuDiag: function (opts) {
        var def_settings = {
			offsetto:  	"",
			offsetww:	0,
			offsethh:	0,
            top:        0,
            left:       0,
            height:     0,
            width:      0,
            border:     false,
            title:      "",
            titleAlign: "center",
            titleColor: "#33b5e5",

            maskable: 	true,
            movable:    false,
            fade:       true,
            
            zIndex: 	8000,
			before:		null,
			after:		null,
            close:      null
        };
        $.extend(def_settings, opts);

        var mask_ifrm   = "iframe[wliu-diag-mask]";
        var mask_div    = "div[wliu-diag-mask]";
        var midx = parseInt(def_settings.zIndex);

        if( $(mask_ifrm).length <= 0 ) {
           $("body").append('<iframe wliu-diag-mask style="z-index:' + (midx + 1000 - 2) + ';"></iframe>');
        }
        if( $(mask_div).length <= 0 ) {
           $("body").append('<div wliu-diag-mask style="z-index:' + (midx + 1000 - 1) + ';"></div>');
           $(mask_div).unbind("click").bind("click", function(evt){
           
                    if( $("*[wliu-diag]:visible").length <=0 ) {
                        $(mask_ifrm).hide();
                        $(mask_div).hide();
                    } else {
                        var max = 0;
                        var maxObj = null;
                        $("*[wliu-diag]:visible").filter( function(idx){
                            if( parseInt( $(this).css("z-index") ) >= max )  {
                                max = parseInt( $(this).css("z-index") );
                                maxObj = $(this)[0];
                            } 
                        });
                        $(maxObj).trigger("hide");
                    }
           });
        }

        /*** begin return ***/
        return this.each(function (idx, el) {
            if( !$(el).hasAttr("wliu-diag") ) $(el).addAttr("wliu-diag");
            $(el).data("default_settings", def_settings);
            $(el).data("order", midx);
            $(el).data("maskable", def_settings.maskable?1:0);
            $(el).data("movable", def_settings.movable?1:0);
            $(el).data("park", 0);
            $(el).data("parkTop", 0);
            $(el).data("parkLeft", 0);
            
            // css style title, content border ,close icon
            if(def_settings.border) $("div[wliu-diag-body]", el).css("border-width", "1px");
            if(def_settings.width > 0) $("div[wliu-diag-body]", el).css("width", def_settings.width);
            if(def_settings.height > 0) $("div[wliu-diag-body]", el).css("height", def_settings.height);
            if(def_settings.top > 0) $(el).css("top", def_settings.top);
            if(def_settings.left > 0) $(el).css("left", def_settings.left);

            if( $(el).has("a.wliu-btn16-close").length<=0 ) $(el).prepend('<a class="wliu-btn16 wliu-btn16-close"></a>');
            
            if(def_settings.title!="") {
                if( $(el).has("div[wliu-diag-head]").length<=0 ) $(el).prepend('<div wliu-diag-head"></div>');
                $("div[wliu-diag-head]", el).html(def_settings.title);
                $(el).attr("title", "");
            }
            if($("div[wliu-diag-head]", el).length > 0) {
                if(def_settings.titleAlign!="") $("div[wliu-diag-head]", el).css("text-align", def_settings.titleAlign);
                if(def_settings.titleColor!="") $("div[wliu-diag-head]", el).css("background-color", def_settings.titleColor);
                if(def_settings.width > 0) $("div[wliu-diag-head]", el).css("width", def_settings.width);
                $("a.wliu-btn16-close", el).addClass("wliu-diag-title-close");
            }

            
            $("a.wliu-btn16-close, input.wliu-diag-close, button.wliu-diag-close", el).unbind("click").bind("click", function(evt){
                $(el).trigger("hide");
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            });
            // end of css style


            // deal with movable
            if (def_settings.movable) {
                if( $(el).has("div[wliu-diag-head]").length<=0 ) {
                    $(el).prepend('<div wliu-diag-head"></div>');
                    $("a.wliu-btn16-close", el).addClass("wliu-diag-title-close");
                }
                $("div[wliu-diag-head]", el).css("cursor", "move");
                
                $(el).draggable({
                    handle: $("div[wliu-diag-head]", el),
                    start: function () {
                    },
                    stop: function () {
                        $(el).data("park", 1);  

                        // update first, then recaculate 
                        $(el).data("parkTop", $(el).offset().top);
                        $(el).data("parkLeft", $(el).offset().left);
                        
                        if ($(el).offset().top <= 0) $(el).offset({ top: 5 });
                        if ($(el).offset().left <= 0) $(el).offset({ left: 5 });

                        //if out of range ,  still need to relocation
                        if( 
                            $(el).offset().top + $(el).outerHeight() >= $(window).scrollTop() + $(window).height() || 
                            $(el).offset().left + $(el).outerWidth() >= $(window).scrollLeft() + $(window).width() || 
                            $(el).data("parkTop") < $(window).scrollTop() ||
                            $(el).data("parkLeft") < $(window).scrollLeft()
                        ) {
                            var el_top  = $(window).scrollTop() + ($(window).height() - 20 - $(el).outerHeight()) / 2;  // 20 = scollbar
                            var el_left = $(window).scrollLeft() + ($(window).width() - 20 - $(el).outerWidth()) / 2;

                            if( el_top < 0 ) el_top = 5;
                            if( el_left < 0 ) el_left = 5;

                            if(def_settings.top > 0) el_top = def_settings.top;
                            if(def_settings.left > 0) el_left = def_settings.left;

                            $(el).css({
                                left:   el_left,
                                top:    el_top
                            });
                            $(el).data("parkTop", $(el).offset().top);
                            $(el).data("parkLeft", $(el).offset().left);
                        } 
                        // end of out of range
                    }
                });
            }


            /*** bind event to dom ***/
            
            $(el).unbind("click").bind("click", function (evt) {
                if( parseInt($(el).css("z-index")) < midx + 1000 ) 
                    if($(el).is(":visible")) $(el).trigger("show");
            });
            
            $(el).unbind("hide").bind("hide", function (evt) {
                var def_settings = $(el).data("default_settings");
                $(this).css("z-index", $(this).data("order")).fadeOut(0, function() {  // don't fade out,  hide immediately to prevent show again

                    if( $("*[wliu-diag][maskable=1]:visible").length<=0 ) {
                        $(mask_ifrm).hide();
                        $(mask_div).hide();
                    }

                    // move secondary to top
                    var max = 0;
                    var maxObj = null;
                    $("*[wliu-diag]:visible").filter( function(idx){
                        $(this).css("z-index", parseInt($(this).css("z-index")) + 1);
                        if( parseInt( $(this).css("z-index") ) >= max )  {
                            max = parseInt( $(this).css("z-index") );
                            maxObj = $(this)[0];
                        } 
                    });
                   
                    $(maxObj).css("z-index", midx + 1000);
                    
                    $(maxObj).fadeIn((def_settings.fade?"slow":0), function(){
                        if( $(maxObj).data("maskable") == "1" ) {
                            $(mask_ifrm).show();
                            $(mask_div).show();
                        } else {
                            $(mask_ifrm).hide();
                            $(mask_div).hide();
                        }
                    });
                    
                    if( def_settings.close ) if( $.isFunction(def_settings.close) ) def_settings.close(el);
                });
            });

            $(el).unbind("show").bind("show", function (evt) {
                var def_settings = $(el).data("default_settings");
    			if( def_settings.before ) if( $.isFunction(def_settings.before) ) def_settings.before(el);
                
                // layout order, push other layout under mask div
                $("*[wliu-diag]:visible").not(el).each( function(idx1, el1){
                    if( parseInt( $(el1).css("z-index") ) >= (midx + 1000) )  {
                        $(el1).css("z-index", (midx + 1000) - 3 ); // -1 = mask div, -2 = mask iframe
                    } else {
                        $(el1).css("z-index", parseInt($(el1).css("z-index")) -1);
                    }
                });
                
                $(el).css("z-index", midx + 1000);
                // offset().top available for visible element , otherwise 0 
                // re-position the dialog
                if( $(el).data("park")==1 ) {
                    
                    //if out of range ,  still need to relocation
                    if( 
                        $(el).data("parkTop") + $(el).outerHeight() >= $(window).scrollTop() + $(window).height() || 
                        $(el).data("parkLeft") + $(el).outerWidth() >= $(window).scrollLeft() + $(window).width() ||
                        $(el).data("parkTop") < $(window).scrollTop() ||
                        $(el).data("parkLeft") < $(window).scrollLeft()
                    ) {
                        var el_top  = $(window).scrollTop() + ($(window).height() - 20 - $(el).outerHeight()) / 2;  // 20 = scollbar
                        var el_left = $(window).scrollLeft() + ($(window).width() - 20 - $(el).outerWidth() ) / 2;

                        if( el_top < 0 ) el_top = 5;
                        if( el_left < 0 ) el_left = 5;

                        if(def_settings.top > 0) el_top = def_settings.top;
                        if(def_settings.left > 0) el_left = def_settings.left;

                        $(el).css({
                            left:   el_left,
                            top:    el_top
                        });
                    } 
                    // end of out of range
                } else {
                    // position 
                    if( def_settings.offsetto!="" &&  $(def_settings.offsetto).length > 0) {
                        var el_top = $(def_settings.offsetto).offset().top + def_settings.offsethh;
                        var el_left = $(def_settings.offsetto).offset().left + def_settings.offsetww;
                        
                        $(el).css({
                            left:   el_left,
                            top:    el_top
                        });
                    } else {
                        var el_top  = $(window).scrollTop() + ($(window).height() - 20 - $(el).outerHeight()) / 2;  // 20 = scollbar
                        var el_left = $(window).scrollLeft() + ($(window).width() - 20 - $(el).outerWidth()) / 2;
                        
                        if( el_top < 0 ) el_top = 5;
                        if( el_left < 0 ) el_left = 5;

                        if(def_settings.top > 0) el_top = def_settings.top;
                        if(def_settings.left > 0) el_left = def_settings.left;

                        $(this).css({
                            left:   el_left,
                            top:    el_top
                        });
                    }
                    // end of position
                }
               // end of re-position

                $(this).fadeIn((def_settings.fade?"slow":0), function(){
                   if( $(this).data("maskable") == 1 ) {
                        $(mask_ifrm).show();
                        $(mask_div).show();
            			if( def_settings.after ) if( $.isFunction(def_settings.after) ) def_settings.after(el);
                   }
                });
            });

            $(el).unbind("title").bind("title", function (evt, title) {
                 $("*[wliu-diag-head]", el).html(title);
            });
           /*** end of bind event to dom ***/

        });
        /*** end return ***/
    }
});    


$(function(){
    $(document).off("click", "*[wliu-role='wliu-diag'][wliu-toggle='click']").on("click", "*[wliu-role='wliu-diag'][wliu-toggle='click']", function(evt){
        //if( $( $(this).attr("wliu-target") ).is(":hidden")  ) {
            $( $(this).attr("wliu-target") ).trigger("show");
        //} else {
        //    $( $(this).attr("wliu-target") ).trigger("hide");
        //}
    });
    $(document).off("mouseover", "*[wliu-role='wliu-diag'][wliu-toggle='hover']").on("mouseover", "*[wliu-role='wliu-diag'][wliu-toggle='hover']", function(evt){
        $( $(this).attr("wliu-target") ).trigger("show");
    });

    $(window).unbind("resize.wliuDiag").bind("resize.wliuDiag", function () {
        $(".wliu-diag:visible").each( function(idx, el) {
                var def_settings = $(this).data("default_settings");
                if($(this).data("park")=="1") {
                    //if out of range ,  still need to relocation
                    if( 
                        $(this).data("parkTop") + $(this).outerHeight() >= $(window).scrollTop() + $(window).height() || 
                        $(this).data("parkLeft") + $(this).outerWidth() >= $(window).scrollLeft() + $(window).width() ||
                        $(el).data("parkTop") < $(window).scrollTop() ||
                        $(el).data("parkLeft") < $(window).scrollLeft()
                    ) {
                        var el_top  = $(window).scrollTop() + ( $(window).height() - 20 - $(this).outerHeight() ) / 2;  // 20 = scollbar
                        var el_left = $(window).scrollLeft() + ( $(window).width() - 20 - $(this).outerWidth() ) / 2;

                        if( el_top < 0 ) el_top = 5;
                        if( el_left < 0 ) el_left = 5;
                       
                        if(def_settings.top > 0) el_top = def_settings.top;
                        if(def_settings.left > 0) el_left = def_settings.left;

                        $(this).css({
                            left:   el_left,
                            top:    el_top
                        });
                    } 
                    // 
                } else {
                    // position 
                    if( def_settings.offsetto!="" &&  $(def_settings.offsetto).length > 0) {
                        var el_top = $(def_settings.offsetto).offset().top + def_settings.offsethh;
                        var el_left = $(def_settings.offsetto).offset().left + def_settings.offsetww;
                        
                        $(this).css({
                            left:   el_left,
                            top:    el_top
                        });
                    } else {
                        var el_top  = $(window).scrollTop() + ($(window).height() - 20 - $(this).outerHeight()) / 2;  // 20 = scollbar
                        var el_left = $(window).scrollLeft() + ($(window).width() - 20 - $(this).outerWidth()) / 2;
                        
                        if( el_top < 0 ) el_top = 5;
                        if( el_left < 0 ) el_left = 5;
                        
                        if(def_settings.top > 0) el_top = def_settings.top;
                        if(def_settings.left > 0) el_left = def_settings.left;

                        $(this).css({
                            left:   el_left,
                            top:    el_top
                        });
                    }
                    // end of position
                }
            
        });
    }); 
});