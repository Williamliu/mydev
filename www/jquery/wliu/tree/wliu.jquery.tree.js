/************************************************************************************/
/*  JQuery Plugin  Custom Treeview                                                 	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-6-29      															*/
/*  Files: 	jquery.lwh.tree.js ;  jquery.lwh.tree.css								*/
/************************************************************************************/
$.fn.extend({
    wliuTree: function(opts) {
        var def_settings = {
            remember: true,
            nodes:  "auto",
			tooltip: ""
        };
        $.extend(def_settings, opts);
		def_settings.remember = true;

        return this.each(function(idx, el) { 
				var treeid = 0;
				if( !$(el).attr("id") ) $(el).attr("id", "wliuTree." + treeid++);
				var remember_prex = $(el).attr("id");

				var eidx = 0;
				$(">li", $(el)).each(function(idx, el1){
					if( $(el1).has("s").length<=0 ) $(el1).prepend("<s folder></s>") 
					$(el1).attr("eidx", eidx);
					
					var remember_name = remember_prex + "_" + eidx;
					if( def_settings.remember && ( localStorage.getItem(remember_name)=="open" || localStorage.getItem(remember_name)=="close" ) ) {
						$(el1).removeAttr("open").removeAttr("close").addAttr(localStorage.getItem(remember_name));
					} else if(def_settings.nodes=="open" || def_settings.nodes=="close") {
						$(el1).removeAttr("open").removeAttr("close").addAttr(def_settings.nodes);
					}
					eidx++;
				});
				$("ul[wliu-tree]>li", $(el)).each(function(idx, el1){
					if( $(el1).has("s").length<=0 ) $(el1).prepend("<s folder></s>") 
					$(el1).attr("eidx", eidx); // important for remember;

					var remember_name = remember_prex + "_" + eidx;
					if(  def_settings.remember && ( localStorage.getItem(remember_name)=="open" || localStorage.getItem(remember_name)=="close" ) ) {
						$(el1).removeAttr("open").removeAttr("close").addAttr(localStorage.getItem(remember_name));
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
					if( $(this).prop("tagName").toUpperCase() == "LI" ) {
						if( $(this).hasAttr("nodes open") ) {
							$(this).removeAttr("open").addAttr("close");
							
							if(def_settings.remember) {
								var remember_name = remember_prex + "_" + $(this).attr("eidx");
								localStorage.setItem(remember_name, "close"); 
								//console.log(remember_name + ":" + localStorage.getItem(remember_name) );
							}
					
						} else if( $(this).hasAttr("nodes close") ) {
							$(this).removeAttr("close").addAttr("open");
					
							if(def_settings.remember) {
								var remember_name = remember_prex + "_" + $(this).attr("eidx");
								localStorage.setItem(remember_name, "open"); 
								//console.log(remember_name + ":" + localStorage.getItem(remember_name) );
							}
						}						
					} 
					if( $(this).prop("tagName").toUpperCase() == "S" ) {
						if( $(this).parent("li").hasAttr("nodes open") ) {
							$(this).parent("li").removeAttr("open").addAttr("close");

							if(def_settings.remember) {
								var remember_name = remember_prex + "_" + $(this).parent("li").attr("eidx");
								localStorage.setItem(remember_name, "close"); 
								//console.log(remember_name + ":" + localStorage.getItem(remember_name) );
							}

						} else if( $(this).parent("li").hasAttr("nodes close") ) {
							$(this).parent("li").removeAttr("close").addAttr("open");
							
							if(def_settings.remember) {
								var remember_name = remember_prex + "_" + $(this).parent("li").attr("eidx");
								localStorage.setItem(remember_name, "open"); 
								//console.log(remember_name + ":" + localStorage.getItem(remember_name) );
							}
						}						
					}
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
