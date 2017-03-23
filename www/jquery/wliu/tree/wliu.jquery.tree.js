/************************************************************************************/
/*  JQuery Plugin  Custom Treeview                                                 	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-6-29      															*/
/*  Files: 	jquery.lwh.tree.js ;  jquery.lwh.tree.css								*/
/************************************************************************************/
$.fn.extend({
    wliuTree: function(opts) {
        var def_settings = {
            cookie: true,
            nodes:  "auto",
			tooltip: ""
        };
        $.extend(def_settings, opts);

        return this.each(function(idx, el) { 
				var treeid = 0;
				if( !$(el).attr("id") ) $(el).attr("id", "wliuTree." + treeid++);
				var cookie_prex = $(el).attr("id");

				var eidx = 0;
				$(">li", $(el)).each(function(idx, el1){
					if( $(el1).has("s").length<=0 ) $(el1).prepend("<s folder></s>") 
					//$(el1).attr("eidx", eidx).attr("title", $(el1).text());
					
					var cookie_name = cookie_prex + "." + eidx;
					if( def_settings.cookie && ( localStorage.getItem(cookie_name)=="open" || localStorage.getItem(cookie_name)=="close" ) ) {
						$(el1).removeAttr("open").removeAttr("close").addAttr(localStorage.getItem(cookie_name));
					} else if(def_settings.nodes=="open" || def_settings.nodes=="close") {
						$(el1).removeAttr("open").removeAttr("close").addAttr(def_settings.nodes);
					}
					eidx++;
				});
				$("ul[wliu-tree]>li", $(el)).each(function(idx, el1){
					if( $(el1).has("s").length<=0 ) $(el1).prepend("<s folder></s>") 
					//$(el1).attr("eidx", eidx).attr("title", $(el1).text());

					var cookie_name = cookie_prex + "." + eidx;
					if(  def_settings.cookie && ( localStorage.getItem(cookie_name)=="open" || localStorage.getItem(cookie_name)=="close" ) ) {
						$(el1).removeAttr("open").removeAttr("close").addAttr(localStorage.getItem(cookie_name));
					} else if(def_settings.nodes=="open" || def_settings.nodes=="close") {
						$(el1).removeAttr("open").removeAttr("close").addAttr(def_settings.nodes);
					}
					eidx++;
				});


				$(document).off("click.wliuTree", "ul[wliu-tree]>li *").on("click.wliuTree", "ul[wliu-tree]>li *", function(evt){
				    evt.preventDefault();
	                evt.stopPropagation();
    	            return false;
				});

				$(document).off("click.wliuTree", "ul[wliu-tree]>li, ul[wliu-tree]>li>s").on("click.wliuTree", "ul[wliu-tree]>li, ul[wliu-tree]>li>s", function(evt){
				//$(document).off("click.wliuTree", "ul[wliu-tree]>li>s").on("click.wliuTree", "ul[wliu-tree]>li>s", function(evt){
					if( $(this).prop("tagName").toUpperCase() == "LI" ) {
						if( $(this).hasAttr("nodes open") ) {
							$(this).removeAttr("open").addAttr("close");
							
							if(def_settings.cookie) {
								var cookie_name = cookie_prex + "." + $(this).attr("eidx");
								localStorage.setItem(cookie_name, "close"); 
							}
					
						} else if( $(this).hasAttr("nodes close") ) {
							$(this).removeAttr("close").addAttr("open");
					
							if(def_settings.cookie) {
								var cookie_name = cookie_prex + "." + $(this).attr("eidx");
								localStorage.setItem(cookie_name, "open"); 
							}
						}						
					} 
					if( $(this).prop("tagName").toUpperCase() == "S" ) {
						if( $(this).parent("li").hasAttr("nodes open") ) {
							$(this).parent("li").removeAttr("open").addAttr("close");

							if(def_settings.cookie) {
								var cookie_name = cookie_prex + "." + $(this).parent("li").attr("eidx");
								localStorage.setItem(cookie_name, "close"); 
							}

						} else if( $(this).parent("li").hasAttr("nodes close") ) {
							$(this).parent("li").removeAttr("close").addAttr("open");
							
							if(def_settings.cookie) {
								var cookie_name = cookie_prex + "." + $(this).parent("li").attr("eidx");
								localStorage.setItem(cookie_name, "open"); 
							}
						}						
					}
	                console.log("click me");
					evt.preventDefault();
	               	evt.stopPropagation();
    	        	return false;
				});
			
        });
    }
});

$(function(){
    $("ul[wliu-tree][root]").wliuTree();
});
