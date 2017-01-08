/************************************************************************************/
/*  JQuery Plugin  Custom Treeview without line                                    	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-6-29      															*/
/*  Files: 	jquery.lwh.tree.js ;  jquery.lwh.tree.css								*/
/************************************************************************************/
$.fn.extend({
	lwhTree1: function( opts ){
		var def_settings = {};
		$.extend(def_settings, opts);

		return this.each( function(idx, el) { 
			// event 
			$(	"li.nodes-open > s.node-line," +
				"li.nodes-open > s.node-img," +
				"li.nodes-close > s.node-line," +
				"li.nodes-close	> s.node-img"
				, $(el)
			).die("click.lwhTree1").live("click.lwhTree1", function(ev) {
				var pel = $(this).parent("li");
				
				if(pel.hasClass("nodes-open")) 
					pel.removeClass("nodes-open").addClass("nodes-close");
				else if(pel.hasClass("nodes-close"))
					pel.removeClass("nodes-close").addClass("nodes-open");
				return false;
			});
			// end of event 
			
		});
	}
});