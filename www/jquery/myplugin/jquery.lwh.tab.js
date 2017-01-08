/************************************************************************************/
/*  JQuery Plugin Tab		 - 														*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-8-15      															*/
/*  Files: 	jquery.lwh.tab.js ;  jquery.lwh.tab.css									*/
/************************************************************************************/

$.fn.extend({
	lwhTab1: function(opts) {
		var def_settings = {
			trigger:	"click",
			tabsn:		0,
			height:		0
		};
		$.extend(def_settings, opts);
		return this.each(function(idx, el) { 
				if(def_settings.height) $(">div", el).height(def_settings.height);
				if(!def_settings.tabsn) def_settings.tabsn = 0;

				$(">ul>li", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
				});

				$(">ul>li:first-child", el).prepend('<s class="arrow"></s>');

				$(">div", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
				});
				
				$(">ul>li[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
				$(">div[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");

				$(">ul>li", el).unbind(def_settings.trigger).bind(def_settings.trigger, function(ev){
					$(">ul>li", el).removeClass("selected");
					$(">div",el).removeClass("selected");
					$(this).addClass("selected");
					$(">div[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
					
				});
		});
	},

	lwhTab2: function(opts) {
		var def_settings = {
			trigger:	"click",
			tabsn:		0,
			height:		0
		};
		$.extend(def_settings, opts);
		return this.each(function(idx, el) { 
				if(def_settings.height) $(">div", el).height(def_settings.height);
				if(!def_settings.tabsn) def_settings.tabsn = 0;

				$(">ul>li", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
					if( $("s", el1).length > 0 ) {
						$("s", el1).addClass("dot");
					} else {
						$(el1).prepend('<s class="dot"></s>');
					}
				});

				$(">ul>li:first-child>s", el).addClass('arrow');

				$(">div", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
				});
				
				$(">ul>li[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
				$(">div[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");

				$(">ul>li", el).unbind(def_settings.trigger).bind(def_settings.trigger, function(ev){
					$(">ul>li", el).removeClass("selected");
					$(">div",el).removeClass("selected");
					$(this).addClass("selected");
					$(">div[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
					
				});
		});
	},
	
	lwhTab3: function(opts) {
		var def_settings = {
			trigger:	"click",
			tabsn:		0,
			height:		0
		};
		$.extend(def_settings, opts);
		return this.each(function(idx, el) { 
				if(def_settings.height) $(">div", el).height(def_settings.height);
				if(!def_settings.tabsn) def_settings.tabsn = 0;

				$(">ul>li", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
				});


				$(">div", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
				});
				
				$(">ul>li[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
				$(">div[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");

				$(">ul>li", el).unbind(def_settings.trigger).bind(def_settings.trigger, function(ev){
					$(">ul>li", el).removeClass("selected");
					$(">div",el).removeClass("selected");
					$(this).addClass("selected");
					$(">div[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
					
				});
		});
	},
	
	lwhTab4: function(opts) {
		var def_settings = {
			tabsn:		0,
			height:		0
		};
		$.extend(def_settings, opts);
		return this.each(function(idx, el) { 
				if(def_settings.height) $(el).height(def_settings.height);
				if(!def_settings.tabsn) def_settings.tabsn = 0;

				$(">ul>li.item", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1+1);
				});


				$(">div>div.content", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1+1);
				});
				
				if( def_settings.tabsn > 0) {
					$(">ul>li.item[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
					$(">div>div.content[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
					$(">div>div.header-content",el).hide();				
				}
				
				$(">ul>li.item", el).unbind("mouseover").bind("mouseover", function(ev){
					$(">div>div.header-content",el).hide();
					$(">ul>li.item", el).removeClass("selected");
					$(">div>div.content",el).removeClass("selected");
					$(this).addClass("selected");
					$(">div>div.content[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
				});

				$(">div>div.content", el).unbind("mouseover").bind("mouseover", function(ev){
					$(">div>div.header-content",el).hide();
					$(">ul>li.item", el).removeClass("selected");
					$(">div>div.content",el).removeClass("selected");
					$(this).addClass("selected");
					$(">ul>li.item[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
				});
				
				$(">ul>li.item", el).unbind("mouseout").bind("mouseout", function(ev){
					$(this).removeClass("selected");
					$(">div>div.content[tabsn='" + $(this).attr("tabsn") + "']",el).removeClass("selected");
					$(">div>div.header-content",el).show();
				});

				$(">div>div.content", el).unbind("mouseout").bind("mouseout", function(ev){
					$(this).removeClass("selected");
					$(">ul>li.item[tabsn='" + $(this).attr("tabsn") + "']",el).removeClass("selected");
					$(">div>div.header-content",el).show();
				});
		});
	},
	

	lwhTab5: function(opts) {
		var def_settings = {
			trigger:	"click",
			tabsn:		0,
			height:		0
		};
		$.extend(def_settings, opts);
		return this.each(function(idx, el) { 
				if(def_settings.height) $(">div", el).height(def_settings.height);
				if(!def_settings.tabsn) def_settings.tabsn = 0;

				$(">ul>li", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
				});

				$(">ul>li:first-child", el).prepend('<s class="arrow"></s>');

				$(">div", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
				});
				
				$(">ul>li[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
				$(">div[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");

				$(">ul>li", el).unbind(def_settings.trigger).bind(def_settings.trigger, function(ev){
					$(">ul>li", el).removeClass("selected");
					$(">div",el).removeClass("selected");
					$(this).addClass("selected");
					$(">div[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
					
				});
		});
	},
	
	lwhTab6: function(opts) {
		var def_settings = {
			tabsn:		0,
			height:		0
		};
		$.extend(def_settings, opts);
		return this.each(function(idx, el) { 
				if(def_settings.height) $(el).height(def_settings.height);
				if(!def_settings.tabsn) def_settings.tabsn = 0;

				$(">ul>li.item", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1+1);
				});


				$(">div>div.content", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1+1);
				});
				
				if( def_settings.tabsn > 0) {
					$(">ul>li.item[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
					$(">div>div.content[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
					$(">div>div.header-content",el).hide();				
				}
				

				$(">ul>li.header", el).unbind("click").bind("click", function(ev){
					$(">div>div.header>ul",el).hide();
					$(">ul>li.item", el).removeClass("selected");
					$(">div>div.content",el).removeClass("selected");
					
					$(">div>div.header>ul.header",el).show();
					$(">div>div.header-content",el).show();
				});

				$(">ul>li.item", el).unbind("click").bind("click", function(ev){
					$(">div>div.header>ul",el).hide();
					$(">div>div.header>ul[pid='" + $(this).attr("pid") + "']",el).show();

					$(">div>div.header-content",el).hide();
					$(">ul>li.item", el).removeClass("selected");
					$(">div>div.content",el).removeClass("selected");
					$(this).addClass("selected");
					$(">div>div.content[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
				});

		});
	},
	
	
	lwhTab9: function(opts) {
		var def_settings = {
			trigger:	"click",
			expand:		false,
			border:		false,
			tabsn:		0,
			height:		0
		};
		$.extend(def_settings, opts);
		return this.each(function(idx, el) { 

				if(def_settings.height) $(">div", el).height(def_settings.height);
				if(!def_settings.tabsn) def_settings.tabsn = 0;

				$(">ul>li", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
					if( $(">s", el1).length<=0 )	$(el1).append('<s></s>');
				});


				$(">div", el).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1);
					if(def_settings.border) $(el1).addClass("lwhTab9-border");
				});
				
				// add expand / collapse
				if( $(">ul>li[tabsn]", el).length > 0 && def_settings.expand ) {
					$(el).append('<a class="button button-down"></a>');
					$("a.button", el).unbind("click").bind("click", function(ev) {
						if( $(this).hasClass("button-down") ) {
							def_settings.tabsn = $(">ul>li[tabsn].selected", el).attr("tabsn")?$(">ul>li[tabsn].selected", el).attr("tabsn"):0;
							$(">ul>li[tabsn]", el).removeClass("selected");
							$(">div[tabsn]", el).removeClass("selected");
							$(this).removeClass("button-down").addClass("button-up");
						} else { 
							$(">ul>li", el).removeClass("selected");
							$(">div",el).removeClass("selected");
							$(">ul>li[tabsn='" + def_settings.tabsn  + "']", el).addClass("selected");
							$(">div[tabsn='" + def_settings.tabsn  + "']",el).addClass("selected");
							$(this).removeClass("button-up").addClass("button-down");
						}
					});
				}
						
				
				if( $(">ul>li[tabsn].selected", el).length > 0  ) {
					def_settings.tabsn = $(">ul>li[tabsn].selected", el).attr("tabsn");
				}

				if( $(">ul>li[tabsn]", el).length > 1 ) {
					$(">ul>li[tabsn]", el).removeClass("selected");
					$(">div[tabsn]", el).removeClass("selected");
					
					$(">ul>li[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
					$(">div[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
					$("a.button", el).removeClass("button-up").addClass("button-down");
					
					$(">ul>li", el).unbind(def_settings.trigger).bind(def_settings.trigger, function(ev){
						$(">ul>li", el).removeClass("selected");
						$(">div",el).removeClass("selected");
						$(this).addClass("selected");
						$(">div[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
						$("a.button", el).removeClass("button-up").addClass("button-down");
					});
				} else {
					$(">ul>li[tabsn]", el).removeClass("selected");
					$(">div[tabsn]", el).removeClass("selected");
					
					// make solid tab
					
					//if( def_settings.expand ) 
						$(">ul>li[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
					
					$(">div[tabsn='" + def_settings.tabsn + "']", el).addClass("selected");
	
					$(">ul>li", el).unbind(def_settings.trigger).bind(def_settings.trigger, function(ev){
						$(">ul>li", el).removeClass("selected");
						$(">div",el).removeClass("selected");
					
						//if( def_settings.expand ) 
							$(this).addClass("selected");
					
						$(">div[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
						$("a.button", el).removeClass("button-up").addClass("button-down");
					});
				}
		});
	},
	
});