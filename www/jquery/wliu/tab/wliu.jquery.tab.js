$.fn.extend({
    ixTab: function() {
        return this.each(function(idx, el) { 
                var sn = parseInt($(el).attr("tabsn"))?parseInt($(el).attr("tabsn")):0;
                var content_area = $("+div[wliu-tab-content]", el).get(0);

                $(">li", el).each(function(idx1, el1) {
                    $(el1).attr("tabsn", idx1);
                    $(el1).attr("title", $(el1).text());
                });


                $(">div", $(content_area)).each(function(idx1, el1) {
                    $(el1).attr("tabsn", idx1);
                });

                $(">li", el).removeClass("selected");
                $(">div", $(content_area)).removeClass("selected");
                $(">li[tabsn='" + sn + "']", el).addClass("selected");
                $(">div[tabsn='" + sn + "']", $(content_area)).addClass("selected");

                var trigger =  "click";
                switch( $(el).attr("tab-toggle") ) {
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
                $(">li", el).unbind(trigger).bind( trigger , function(ev){
                    $(">li", el).removeClass("selected");
                    $(">div",$(content_area)).removeClass("selected");
                    $(this).addClass("selected");
                    $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(content_area)).addClass("selected");
                    
                });
        });
    }
});	
$(function(){
    $(document).off("click", "ul[wliu-tab][tab-toggle='click']>li").on("click", "ul[wliu-tab][tab-toggle='click']>li", function(evt){
        if( !$(this).hasClass("selected") ) {
            var content_area = $("+div[wliu-tab-content]", $(this).parent()).get(0);
            $(">li", $(this).parent()).removeClass("selected");
            $(">div",$(content_area)).removeClass("selected");
            $(this).addClass("selected");
            $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(content_area)).addClass("selected");
        }
    });

    $(document).off("mouseover", "ul[wliu-tab][tab-toggle='hover']>li").on("mouseover", "ul[wliu-tab][tab-toggle='hover']>li", function(evt){
        if( !$(this).hasClass("selected") ) {
            var content_area = $("+div[wliu-tab-content]", $(this).parent()).get(0);
            $(">li", $(this).parent()).removeClass("selected");
            $(">div",$(content_area)).removeClass("selected");
            $(this).addClass("selected");
            $(">div[tabsn='" + $(this).attr("tabsn") + "']", $(content_area)).addClass("selected");
        }
    });
});	
