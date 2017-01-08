/*********************** diag ************************/
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

        var mask_ifrm   = "#wliuDiag_mask_ifrm";
        var mask_div    = "#wliuDiag_mask_div";
        var midx = parseInt(def_settings.zIndex);

        if( $(mask_ifrm).length <= 0 ) {
           $("body").append('<iframe id="wliuDiag_mask_ifrm" class="wliuDiag-mask-ifrm" style="z-index:' + (midx + 1000 - 2) + ';"></iframe>');
        }
        if( $(mask_div).length <= 0 ) {
           $("body").append('<div id="wliuDiag_mask_div" class="wliuDiag-mask-div" style="z-index:' + (midx + 1000 - 1) + ';"></div>');
           $(mask_div).unbind("click").bind("click", function(evt){
           
                    if( $(".wliu-diag:visible").length <=0 ) {
                        $(mask_ifrm).hide();
                        $(mask_div).hide();
                    } else {
                        var max = 0;
                        var maxObj = null;
                        $(".wliu-diag:visible").filter( function(idx){
                            if( parseInt( $(this).css("z-index") ) >= max )  {
                                max = parseInt( $(this).css("z-index") );
                                maxObj = $(this)[0];
                            } 
                        });
                        $(maxObj).trigger("myClose");
                    }
           });
        }

        /*** begin return ***/
        return this.each(function (idx, el) {
            $(el).data("default_settings", def_settings);
            $(el).data("order", midx + $("div.wliu-diag[order]").length );
            $(el).data("order", $(el).data("order"));
            $(el).data("maskable", def_settings.maskable?1:0);
            $(el).data("movable", def_settings.movable?1:0);
            $(el).data("park", 0);
            $(el).data("parkTop", 0);
            $(el).data("parkLeft", 0);
            
            // css style title, content border ,close icon
            if(def_settings.border) $("div.wliu-diag-content", el).css("border-width", "1px");
            if(def_settings.width > 0) $("div.wliu-diag-content", el).css("width", def_settings.width);
            if(def_settings.height > 0) $("div.wliu-diag-content", el).css("height", def_settings.height);
            if(def_settings.top > 0) $(el).css("top", def_settings.top);
            if(def_settings.left > 0) $(el).css("left", def_settings.left);

            if( $(el).has("a.wliu-btn16-close").length<=0 ) $(el).prepend('<a class="wliu-btn16 wliu-btn16-close"></a>');
            
            if(def_settings.title!="") {
                if( $(el).has("div.wliu-diag-title").length<=0 ) $(el).prepend('<div class="wliu-diag-title"></title>');
                $("div.wliu-diag-title", el).html(def_settings.title);
                $(el).attr("title", "");
            }
            if($("div.wliu-diag-title", el).length > 0) {
                if(def_settings.titleAlign!="") $("div.wliu-diag-title", el).css("text-align", def_settings.titleAlign);
                if(def_settings.titleColor!="") $("div.wliu-diag-title", el).css("background-color", def_settings.titleColor);
                if(def_settings.width > 0) $("div.wliu-diag-title", el).css("width", def_settings.width);
                $("a.wliu-btn16-close", el).addClass("wliu-diag-title-close");
            }

            
            $("a.wliu-btn16-close, input.wliu-diag-close, button.wliu-diag-close", el).unbind("click").bind("click", function(evt){
                $(el).trigger("myClose");
                evt.preventDefault();
                evt.stopPropagation();
                return false;
            });
            // end of css style


            // deal with movable
            if (def_settings.movable) {
                if( $(el).has("div.wliu-diag-title").length<=0 ) {
                    $(el).prepend('<div class="wliu-diag-title"></title>');
                    $("a.wliu-btn16-close", el).addClass("wliu-diag-title-close");
                }
                $("div.wliu-diag-title", el).css("cursor", "move");
                
                $(el).draggable({
                    handle: $("div.wliu-diag-title", el),
                    start: function () {
                    },
                    stop: function () {
                        $(this).data("park", 1);  
                        //$(this).data("parkTop", $(el).offset().top);
                        //$(this).data("parkLeft", $(el).offset().left);
                        
                        if ($(el).offset().top <= 0) $(el).offset({ top: 5 });
                        if ($(el).offset().left <= 0) $(el).offset({ left: 5 });

                        //if out of range ,  still need to relocation
                        if( 
                            $(el).offset().top + $(this).outerHeight() >= $(window).height() || 
                            $(el).offset().left + $(this).outerWidth() >= $(window).width()
                        ) {
                            var el_top = ( $(window).height() - 20 - $(this).outerHeight() ) / 2;  // 20 = scollbar
                            var el_left = ( $(window).width() - 20 - $(this).outerWidth() ) / 2;

                            if( el_top < 0 ) el_top = 5;
                            if( el_left < 0 ) el_left = 5;

                            if(def_settings.top > 0) el_top = def_settings.top;
                            if(def_settings.left > 0) el_left = def_settings.left;

                            $(this).css({
                                left:   el_left,
                                top:    el_top
                            });
                            $(this).data("parkTop", $(el).offset().top);
                            $(this).data("parkLeft", $(el).offset().left);
                        } 
                        // end of out of range


                    }
                });
            }


            /*** bind event to dom ***/
            $(el).unbind("click").bind("click", function (evt) {
                if( parseInt($(el).css("z-index")) < midx + 1000 ) $(el).trigger("myOpen");
            });

            $(el).unbind("myClose").bind("myClose", function (evt) {
                var def_settings = $(el).data("default_settings");

                $(this).css("z-index", $(this).data("order")).fadeOut( (def_settings.fade?"slow":0), function(){
                    if( $(".wliu-diag:visible[maskable='1']").length<=0 ) {
                        $(mask_ifrm).hide();
                        $(mask_div).hide();
                    }

                    // move secondary to top
                    var max = 0;
                    var maxObj = null;
                    $(".wliu-diag:visible").filter( function(idx){
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

            $(el).unbind("myOpen").bind("myOpen", function (evt) {
                var def_settings = $(el).data("default_settings");
    			if( def_settings.before ) if( $.isFunction(def_settings.before) ) def_settings.before(el);
                
                // layout order, push other layout under mask div
                $(".wliu-diag:visible").not(el).filter( function(idx){
                    if( parseInt( $(this).css("z-index") ) >= (midx + 1000) )  {
                        $(this).css("z-index", (midx + 1000) - 3 ); // -1 = mask div, -2 = mask iframe
                    } else {
                        $(this).css("z-index", parseInt($(this).css("z-index")) -1);
                    }
                });
                
                $(this).css("z-index", midx + 1000);
                
                // offset().top available for visible element , otherwise 0 
                // re-position the dialog
                if( $(this).data("park")== 1 ) {
                    //if out of range ,  still need to relocation
                    if( 
                        $(this).data("parkTop") + $(this).outerHeight() >= $(window).height() || 
                        $(this).data("parkLeft") + $(this).outerWidth() >= $(window).width()
                    ) {
                        var el_top = ( $(window).height() - 20 - $(this).outerHeight() ) / 2;  // 20 = scollbar
                        var el_left = ( $(window).width() - 20 - $(this).outerWidth() ) / 2;

                        if( el_top < 0 ) el_top = 5;
                        if( el_left < 0 ) el_left = 5;

                        if(def_settings.top > 0) el_top = def_settings.top;
                        if(def_settings.left > 0) el_left = def_settings.left;

                        $(this).css({
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
                        
                        $(this).css({
                            left:   el_left,
                            top:    el_top
                        });
                    } else {
                        var el_top = ( $(window).height() - 20 - $(this).outerHeight() ) / 2;  // 20 = scollbar
                        var el_left = ( $(window).width() - 20 - $(this).outerWidth() ) / 2;
                        
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

            $(el).unbind("myTitle").bind("myTitle", function (evt, title) {
                 $(".wliu-diag-title", el).html(title);
            });
           /*** end of bind event to dom ***/

        });
        /*** end return ***/
    }
});    


$(function(){
    $(document).off("click", "*[wliu-role='diag'][wliu-toggle='click']").on("click", "*[wliu-role='diag'][wliu-toggle='click']", function(evt){
        //if( $( $(this).attr("wliu-target") ).is(":hidden")  ) {
            $( $(this).attr("wliu-target") ).trigger("myOpen");
        //} else {
        //    $( $(this).attr("wliu-target") ).trigger("myClose");
        //}
    });
    $(document).off("mouseover", "*[wliu-role='diag'][wliu-toggle='hover']").on("mouseover", "*[wliu-role='diag'][wliu-toggle='hover']", function(evt){
        $( $(this).attr("wliu-target") ).trigger("myOpen");
    });

    $(window).unbind("resize.wliuDiag").bind("resize.wliuDiag", function () {
        $(".wliu-diag:visible").each( function(idx, el) {
                var def_settings = $(this).data("default_settings");
                if($(this).data("park")=="1") {
                    //if out of range ,  still need to relocation
                    if( 
                        $(this).data("parkTop") + $(this).outerHeight() >= $(window).height() || 
                        $(this).data("parkLeft") + $(this).outerWidth() >= $(window).width()
                    ) {
                        var el_top = ( $(window).height() - 20 - $(this).outerHeight() ) / 2;  // 20 = scollbar
                        var el_left = ( $(window).width() - 20 - $(this).outerWidth() ) / 2;

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
                        var el_top = ( $(window).height() - 20 - $(this).outerHeight() ) / 2;  // 20 = scollbar
                        var el_left = ( $(window).width() - 20 - $(this).outerWidth() ) / 2;
                        
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
/*********************end of diag ************************/
