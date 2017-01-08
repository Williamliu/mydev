/************************************************************************************/
/*  JQuery Plugin Tab		 - 														*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-8-15      															*/
/*  Files: 	jquery.lwh.tab.js ;  jquery.lwh.tab.css									*/
/************************************************************************************/

$.fn.extend({
	lwhMenu: function(opts) {
		return this.each(function(idx, el) { 
				$(">li", el).each(function(idx1, el1) {
					$(el1).has("ul").append('<s class="down"></s>');
				});

				$(">li>ul li", el).each(function(idx1, el1) {
					$(el1).has("ul").append('<s class="left"></s>');
				});
		});
	}
});