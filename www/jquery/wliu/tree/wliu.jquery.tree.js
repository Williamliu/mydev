/************************************************************************************/
/*  JQuery Plugin  Custom Treeview                                                 	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-6-29      															*/
/*  Files: 	jquery.lwh.tree.js ;  jquery.lwh.tree.css								*/
/************************************************************************************/
$.fn.extend({
	lwhTree: function( opts ){
		var def_settings = {};
		$.extend(def_settings, opts);

		return this.each( function(idx, el) { 
			// scan children li
			$(el).data("single", def_settings.single);
			$(">li:last" , $(el)).each( function(idx1, el1) {
				// default as node 
				if($(el1).hasClass("node")) $(el1).removeClass("node").addClass("node-last");
				if($(el1).hasClass("nodes")) $(el1).removeClass("nodes").addClass("nodes-last");
				if($(el1).hasClass("nodes-open")) 	$(el1).removeClass("nodes-open").addClass("nodes-last-open");
				if($(el1).hasClass("nodes-close")) 	$(el1).removeClass("nodes-close").addClass("nodes-last-close");
			});
			
			// scan decendant li
			$(">li:last" , $("ul.lwhTree",$(el))).each( function(idx1, el1) {
				// default as node 
				if($(el1).hasClass("node")) $(el1).removeClass("node").addClass("node-last");
				if($(el1).hasClass("nodes")) $(el1).removeClass("nodes").addClass("nodes-last");
				if($(el1).hasClass("nodes-open")) 	$(el1).removeClass("nodes-open").addClass("nodes-last-open");
				if($(el1).hasClass("nodes-close")) 	$(el1).removeClass("nodes-close").addClass("nodes-last-close");
			});
			
			// event for click nodes 
			$(	
				"li.nodes > s.node-line," +
				"li.nodes > s.node-img," +
				"li.nodes > span.click," +

				"li.nodes-open > s.node-line," +
				"li.nodes-open > s.node-img," +
				"li.nodes-open > span.click," +
				"li.nodes-close > s.node-line," +
				"li.nodes-close	> s.node-img," +
				"li.nodes-close	> span.click," +

				"li.nodes-last > s.node-line," +
				"li.nodes-last > s.node-img," +
				"li.nodes-last > span.click," +

				"li.nodes-last-open > s.node-line," +
				"li.nodes-last-open > s.node-img," +
				"li.nodes-last-open > span.click," +
				"li.nodes-last-close > s.node-line," +
				"li.nodes-last-close > s.node-img" +
				"li.nodes-last-close > span.click"
				, $(el)
			).die("click.lwhTree").live("click.lwhTree", function(ev) {
				var pel = $(this).parent("li");

				if(def_settings.single) {
					  pel.siblings(".nodes, .nodes-last").each(function(idx, el){
							if($(this).hasClass("nodes-open")) 
								$(this).removeClass("nodes-open").addClass("nodes-close");
							else if($(this).hasClass("nodes-last-open")) 
								$(this).removeClass("nodes-last-open").addClass("nodes-last-close");
					  });
				}

				if(pel.hasClass("nodes-open")) 
					pel.removeClass("nodes-open").addClass("nodes-close");
				else if(pel.hasClass("nodes-close"))
					pel.removeClass("nodes-close").addClass("nodes-open");
				else if(pel.hasClass("nodes-last-open")) 
					pel.removeClass("nodes-last-open").addClass("nodes-last-close");
				else if(pel.hasClass("nodes-last-close")) 
					pel.removeClass("nodes-last-close").addClass("nodes-last-open");
				return false;
			});
			// end of event 
			
		});
	},
	
	lwhTree_refresh: function( opts ) {
		var def_settings = {};
		$.extend(def_settings, opts);
		return this.each( function(idx, el) { 
			// scan children li
			$("li" , $(el)).each( function(idx1, el1) { 
				if($(el1).hasClass("nodes-last-open")) 	$(el1).removeClass("nodes-last-open").addClass("nodes-open");
				if($(el1).hasClass("nodes-last-close")) $(el1).removeClass("nodes-last-close").addClass("nodes-close");
				if($(el1).hasClass("node-last")) $(el1).removeClass("node-last").addClass("node");
				if($(el1).hasClass("nodes-last")) $(el1).removeClass("nodes-last").addClass("nodes");
			});
			
			$(">li:last" , $(el)).each( function(idx1, el1) {
				// default as node 
				if($(el1).hasClass("node")) $(el1).removeClass("node").addClass("node-last");
				if($(el1).hasClass("nodes")) $(el1).removeClass("nodes").addClass("nodes-last");
				if($(el1).hasClass("nodes-open")) 	$(el1).removeClass("nodes-open").addClass("nodes-last-open");
				if($(el1).hasClass("nodes-close")) 	$(el1).removeClass("nodes-close").addClass("nodes-last-close");
			});
			
			// scan decendant li
			$(">li:last" , $("ul.lwhTree",$(el))).each( function(idx1, el1) {
				// default as node 
				if($(el1).hasClass("node")) $(el1).removeClass("node").addClass("node-last");
				if($(el1).hasClass("nodes")) $(el1).removeClass("nodes").addClass("nodes-last");
				if($(el1).hasClass("nodes-open")) 	$(el1).removeClass("nodes-open").addClass("nodes-last-open");
				if($(el1).hasClass("nodes-close")) 	$(el1).removeClass("nodes-close").addClass("nodes-last-close");
			});
		});
	}
});