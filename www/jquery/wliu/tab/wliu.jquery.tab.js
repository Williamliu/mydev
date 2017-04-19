$.fn.extend({
    wliuTab1: function() {
        return this.each(function(idx, el) { 
                var body_area = $("+div[wliu-tab1-body]", el).get(0);
                if( $(el).hasAttr("wliu-tab1-height") ) $(body_area).css("height", parseInt($(el).attr("wliu-tab1-height"))?parseInt($(el).attr("wliu-tab1-height")):"auto");
                

                var fluid = $(el).hasAttr("fluid");
                var tabWW = 100 / parseInt( $(">li", el).length );
                var ttww = 0;
                $(">li", el).each(function(idx1, el1) {
                    ttww += $(el1).outerWidth();
                    if(fluid) {
                        $(el1).css("width", tabWW + "%");
                    } 
                    $(el1).attr("tabsn", idx1);
                    $(el1).attr("title", $(el1).text());
                });
                
                
                if( ttww > $(el).outerWidth() && !fluid ) {
                    $(">li", el).each(function(idx1, el1) {
                        $(el1).css("width", tabWW + "%");
                    });
                }


                $(">div", $(body_area)).each(function(idx1, el1) {
                    $(el1).attr("tabsn", idx1);
                });


                var sn =  $(">li.selected", el).attr("tabsn")?parseInt($(">li.selected", el).attr("tabsn")):0;
                $(">li", el).removeClass("selected");
                $(">div", $(body_area)).removeClass("selected");
                $(">li[tabsn='" + sn + "']", el).addClass("selected");
                $(">div[tabsn='" + sn + "']", $(body_area)).addClass("selected");

                var trigger =  "click";
                switch( $(el).attr("tab1-toggle") ) {
                    case "click":
                        trigger = "click";
                        break;
                    case "hover":
                        trigger = "mouseover";
                        break;
                    default: 
                        trigger = "click";
                        break;
                }

                var ev_act = $(el).attr("active");
                var ev_deact = $(el).attr("deactive");

                $(">li", el).unbind(trigger).bind( trigger , function(ev){
                    var deact_sn = $(">li.selected", el).attr("tabsn")?parseInt($(">li.selected", el).attr("tabsn")):0;
                    if(ev_deact) eval( ev_deact + "(" + deact_sn + ")" );

                    $(">li", el).removeClass("selected");
                    $(">div",$(body_area)).removeClass("selected");
                    
                    $(this).addClass("selected");
                    $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(body_area)).addClass("selected");
                    var act_sn = $(">li.selected", el).attr("tabsn")?parseInt($(">li.selected", el).attr("tabsn")):0;
                    if(ev_act) eval( ev_act + "(" + act_sn + ")" );
                });
        });
    },

    wliuTab9: function() {
        return this.each(function(idx, el) { 
                var body_area = $("+div[wliu-tab9-body]", el).get(0);
                if( $(el).hasAttr("wliu-tab9-height") ) $(body_area).css("height", parseInt($(el).attr("wliu-tab9-height"))?parseInt($(el).attr("wliu-tab9-height")):"auto");
                

                var fluid = $(el).hasAttr("fluid");
                var tabWidth = $(el).width() - 24 - 24; // first margin-left:10px,    last <s> 24px;
                var tabWW = tabWidth / parseInt( $(">li", el).length );
                var ttww = 0;
                $(">li", el).each(function(idx1, el1) {
                    if( $(el1).has("span").length<=0 ) {
                       var el_text = $(el1).text();
                       $(el1).empty();
                       $(el1).append("<span>" + el_text + "</span><s></s>");
                    }

                    ttww += $(el1).outerWidth();
                    if(fluid) {
                        $(el1).css("width", tabWW + "px");
                    } 
                    $(el1).attr("tabsn", idx1);
                    $(el1).attr("title", $(el1).text());
                });
                
                //alert(ttww + " : " + $(el).outerWidth());
                if( ttww >= ( $(el).outerWidth() - 24 - 10 )  && !fluid ) {
                    $(">li", el).each(function(idx1, el1) {
                        $(el1).css("width", tabWW + "px");
                    });
                }


                $(">div", $(body_area)).each(function(idx1, el1) {
                    $(el1).attr("tabsn", idx1);
                });


                var sn =  $(">li.selected", el).attr("tabsn")?parseInt($(">li.selected", el).attr("tabsn")):0;
                $(">li", el).removeClass("selected");
                $(">div", $(body_area)).removeClass("selected");
                $(">li[tabsn='" + sn + "']", el).addClass("selected");
                $(">div[tabsn='" + sn + "']", $(body_area)).addClass("selected");

                var trigger =  "click";
                switch( $(el).attr("tab1-toggle") ) {
                    case "click":
                        trigger = "click";
                        break;
                    case "hover":
                        trigger = "mouseover";
                        break;
                    default: 
                        trigger = "click";
                        break;
                }

                var ev_act = $(el).attr("active");
                var ev_deact = $(el).attr("deactive");
                $(">li", el).unbind(trigger).bind( trigger , function(ev){
                    var deact_sn = $(">li.selected", el).attr("tabsn")?parseInt($(">li.selected", el).attr("tabsn")):0;
                    if(ev_deact) eval( ev_deact + "(" + deact_sn + ")" );

                    $(">li", el).removeClass("selected");
                    $(">div",$(body_area)).removeClass("selected");
                    
                    $(this).addClass("selected");
                    $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(body_area)).addClass("selected");
                    var act_sn = $(">li.selected", el).attr("tabsn")?parseInt($(">li.selected", el).attr("tabsn")):0;
                    if(ev_act) eval( ev_act + "(" + act_sn + ")" );
                });
        });
    }
    
});	
$(function(){
    $("ul[wliu-tab1]").wliuTab1();
    $("ul[wliu-tab9]").wliuTab9();


    $(document).off("click", "ul[wliu-tab1][tab1-toggle='click']>li").on("click", "ul[wliu-tab1][tab1-toggle='click']>li", function(evt){
        if( !$(this).hasClass("selected") ) {
            var body_area = $("+div[wliu-tab1-body]", $(this).parent()).get(0);
            $(">li", $(this).parent()).removeClass("selected");
            $(">div",$(body_area)).removeClass("selected");
            $(this).addClass("selected");
            $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(body_area)).addClass("selected");
        }
    });

    $(document).off("mouseover", "ul[wliu-tab1][tab1-toggle='hover']>li").on("mouseover", "ul[wliu-tab1][tab1-toggle='hover']>li", function(evt){
        if( !$(this).hasClass("selected") ) {
            var body_area = $("+div[wliu-tab1-body]", $(this).parent()).get(0);
            $(">li", $(this).parent()).removeClass("selected");
            $(">div",$(body_area)).removeClass("selected");
            $(this).addClass("selected");
            $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(body_area)).addClass("selected");
        }
    });


    $(document).off("click", "ul[wliu-tab9][tab9-toggle='click']>li").on("click", "ul[wliu-tab9][tab9-toggle='click']>li", function(evt){
        if( !$(this).hasClass("selected") ) {
            var body_area = $("+div[wliu-tab9-body]", $(this).parent()).get(0);
            $(">li", $(this).parent()).removeClass("selected");
            $(">div",$(body_area)).removeClass("selected");
            $(this).addClass("selected");
            $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(body_area)).addClass("selected");
        }
    });

    $(document).off("mouseover", "ul[wliu-tab9][tab9-toggle='hover']>li").on("mouseover", "ul[wliu-tab9][tab9-toggle='hover']>li", function(evt){
        if( !$(this).hasClass("selected") ) {
            var body_area = $("+div[wliu-tab9-body]", $(this).parent()).get(0);
            $(">li", $(this).parent()).removeClass("selected");
            $(">div",$(body_area)).removeClass("selected");
            $(this).addClass("selected");
            $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(body_area)).addClass("selected");
        }
    });



    $(window).unbind("resize.wliuTab").bind("resize.wliuTab", function () {
        $("ul[wliu-tab1]").each( function(idx, el) {
                var fluid = $(el).hasAttr("fluid");
                var tabWW = 100 / parseInt( $(">li", el).length );
                var ttww = 0;
                $(">li", el).each(function(idx1, el1) {
                    ttww += $(el1).outerWidth();
                });
                
                if( ttww > $(el).outerWidth() ) {
                    $(">li", el).each(function(idx1, el1) {
                        $(el1).css("width", tabWW + "%");
                    });
                } else if( fluid ) {
                    $(">li", el).each(function(idx1, el1) {
                        $(el1).css("width", tabWW + "%");
                    });
                }
        
        });

        $("ul[wliu-tab9]").each( function(idx, el) {
                var fluid = $(el).hasAttr("fluid");
                var tabWidth = $(el).width() - 24 - 24; // first margin-left:10px,    last <s> 24px;
                var tabWW = tabWidth / parseInt( $(">li", el).length );
                var ttww = 0;
                $(">li", el).each(function(idx1, el1) {
                    ttww += $(el1).outerWidth();
                });
                
                //alert(ttww + " : " + $(el).outerWidth());
                if( ttww >= ( $(el).outerWidth() - 24 - 10 )  ) {
                    $(">li", el).each(function(idx1, el1) {
                        $(el1).css("width", tabWW + "px");
                    });
                } else if ( fluid ) {
                    $(">li", el).each(function(idx1, el1) {
                        $(el1).css("width", tabWW + "px");
                    });
                }
        });

    });


});	
