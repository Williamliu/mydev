/************************************************************************************/
/*  JQuery Plugin Tab		 - 														*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-8-15      															*/
/*  Files: 	jquery.lwh.tab.js ;  jquery.lwh.tab.css									*/
/************************************************************************************/

$.fn.extend({
	lwhCategory: function(opts) {
		var def_settings = {
			single:		true,
			highlight:	true,
			autohide:	false,
			init:		null,
			click:  	null,
			clear:		null
		};
		$.extend(def_settings, opts);
		return this.each(function(idx, el) { 
				var trigger = $(el).attr("trigger");
				var el_id	= $(el).attr("id");
				if(trigger) {
					$("#lwhWrapBox_" +  el_id).lwhWrapBox();
					$(trigger).unbind("click").bind("click", function(ev) {
						$("#lwhWrapBox_" + el_id).wrapBoxShow();
					});
				}
				
	            $(el).data("default_settings", def_settings);
				var highlight = def_settings.highlight?"highlight":"";
				$("li.item", el).unbind("click").bind("click", function(ev) {
					if(def_settings.single) {
						$("li.item", el).removeClass("selected").removeClass(highlight);
						$(this).addClass("selected").addClass(highlight);	
					} else {
						if( $(this).hasClass("selected") )  {
							$(this).removeClass("selected").removeClass(highlight);
						} else {
							$(this).addClass("selected").addClass(highlight);
						}
					}
					if(def_settings.click) if($.isFunction(def_settings.click)) {
						var obj = {};
						obj.val 	= "";
						obj.text 	= "";
						$("li.selected", el).each(function(idx1, el1) {
							obj.val += (obj.val==""?"":",") + $(this).attr("sid");
							obj.text += (obj.text==""?"":",") + $(this).text();
						});
						def_settings.click(obj);
						if(def_settings.autohide) {
							if(trigger) $("#lwhWrapBox_" + el_id ).wrapBoxHide();
						}
					}
				});

				/****** init *******/
				var obj = {};
				obj.val 	= "";
				obj.text 	= "";
				$("li.selected", el).each(function(idx1, el1) {
					obj.val += (obj.val==""?"":",") + $(this).attr("sid");
					obj.text += (obj.text==""?"":",") + $(this).text();
				});
				if(def_settings.init) if($.isFunction(def_settings.init)) def_settings.init(obj);

		});
	},

    lwhCategory_clear: function () {
        this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");
			var highlight = def_settings.highlight?"highlight":"";

			$("li.item", el).removeClass("selected").removeClass(highlight);
            
			if (def_settings.clear && $.isFunction(def_settings.clear)) {
				var obj = {};
				obj.val 	= "";
				obj.text 	= "";
				$("li.selected", el).each(function(idx1, el1) {
					obj.val += (obj.val==""?"":",") + $(this).attr("sid");
					obj.text += (obj.text==""?"":",") + $(this).text();
				});
				def_settings.clear(obj);
			}
        });
	},

    lwhCategory_set: function (sid) {
        this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");
			var highlight = def_settings.highlight?"highlight":"";

			var sidArr = sid.split(",");
			$("li.item", el).removeClass("selected").removeClass(highlight);
			$.each(sidArr, function(i, n) {
				$("li.item[sid='" + n + "']", el).addClass("selected").addClass(highlight);
			});
            
			if (def_settings.click && $.isFunction(def_settings.click)) {
				var obj = {};
				obj.val 	= "";
				obj.text 	= "";
				$("li.selected", el).each(function(idx1, el1) {
					obj.val += (obj.val==""?"":",") + $(this).attr("sid");
					obj.text += (obj.text==""?"":",") + $(this).text();
				});
				def_settings.click(obj);
			}
        });
    },
	
    lwhCategory_get: function () {
		var objArr = [];
		this.each(function (idx, el) {
			var obj = {};
			obj.val 	= "";
			obj.text 	= "";
			$("li.selected", el).each(function(idx1, el1) {
				obj.val += (obj.val==""?"":",") + $(this).attr("sid");
				obj.text += (obj.text==""?"":",") + $(this).text();
			});
			objArr[objArr.length] = obj;
        });
		return objArr;
    },
	
	
	lwhCategory3: function(opts) {
		var def_settings = {
			tabsn:		0,
			single:		true,
			highlight:	true,
			autohide:	false,
			init:		null,
			click:  	null,
			clear:		null
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
					$(">div>div.main",el).hide();
					$(">ul>li.item", el).removeClass("selected");
					$(">div>div.content",el).removeClass("selected");
					$(this).addClass("selected");
					$(">div>div.content[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
					
					$(">ul>li.header", el).html( $(this).text() );
				});

				$(">div>div.content", el).unbind("mouseover").bind("mouseover", function(ev){
					$(">div>div.main",el).hide();
					$(">ul>li.item", el).removeClass("selected");
					$(">div>div.content",el).removeClass("selected");
					$(this).addClass("selected");
					$(">ul>li.item[tabsn='" + $(this).attr("tabsn") + "']",el).addClass("selected");
					$(">ul>li.header", el).html( $(">ul>li.item[tabsn='" + $(this).attr("tabsn") + "']",el).text() );
				});
				
				$(">ul>li.item", el).unbind("mouseout").bind("mouseout", function(ev){
					$(this).removeClass("selected");
					$(">div>div.content[tabsn='" + $(this).attr("tabsn") + "']",el).removeClass("selected");
					$(">div>div.main",el).show();
					$(">ul>li.header", el).html( $(">ul>li.header", el).attr("content") );
				});

				$(">div>div.content", el).unbind("mouseout").bind("mouseout", function(ev){
					$(this).removeClass("selected");
					$(">ul>li.item[tabsn='" + $(this).attr("tabsn") + "']",el).removeClass("selected");
					$(">div>div.main",el).show();
					$(">ul>li.header", el).html( $(">ul>li.header", el).attr("content") );
				});
				
				
				// deal with second and third level
				var trigger = $(el).attr("trigger");
				var el_id	= $(el).attr("id");

				if(trigger) {
					$("#lwhWrapBox_" + el_id ).lwhWrapBox();
					$(trigger).unbind("click").bind("click", function(ev) {
						$("#lwhWrapBox_" + el_id ).wrapBoxShow();
					});
				}
				
	            $(el).data("default_settings", def_settings);
				var highlight = def_settings.highlight?"highlight":"";
				$("li.category", el).unbind("click").bind("click", function(ev) {
					if(def_settings.single) {
						$("li.category", el).removeClass("category-selected").removeClass(highlight);
						$("li.category[sid='" + $(this).attr("sid") + "']").addClass("category-selected").addClass(highlight);	
					} else {
						if( $(this).hasClass("category-selected") )  {
							$("li.category[sid='" + $(this).attr("sid") + "']").removeClass("category-selected").removeClass(highlight);
						} else {
							$("li.category[sid='" + $(this).attr("sid") + "']").addClass("category-selected").addClass(highlight);
						}
					}


					var obj = {};
					obj.val 	= "";
					obj.text 	= "";
					$("li.category-selected", $("div.content",el) ).each(function(idx1, el1) {
						obj.val += (obj.val==""?"":",") + $(this).attr("sid");
						obj.text += (obj.text==""?"":", ") + $(this).text();
					});
					
					$("div.header span.cate_choose_text", el).html( obj.text );
					
					if(def_settings.click) if($.isFunction(def_settings.click)) {
						def_settings.click(obj);
						if(def_settings.autohide) {
							if(trigger) $("#lwhWrapBox_" + el_id ).wrapBoxHide();
						}
					}
				});
				
				
				
				var obj = {};
				obj.val 	= "";
				obj.text 	= "";
				$("li.category-selected", $("div.content",el) ).each(function(idx1, el1) {
					obj.val += (obj.val==""?"":",") + $(this).attr("sid");
					obj.text += (obj.text==""?"":", ") + $(this).text();
				});
				
				$("div.header span.cate_choose_text", el).html( obj.text );
				
				if(def_settings.init) if($.isFunction(def_settings.init)) {
					def_settings.init(obj);
				}

				
		});
	},
	
    lwhCategory3_clear: function () {
        this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");
			var highlight = def_settings.highlight?"highlight":"";

			$("li.category", el).removeClass("category-selected").removeClass(highlight);
            
			if (def_settings.clear && $.isFunction(def_settings.clear)) {
				var obj = {};
				obj.val 	= "";
				obj.text 	= "";
				$("li.category-selected",$("div.content",el) ).each(function(idx1, el1) {
					obj.val += (obj.val==""?"":",") + $(this).attr("sid");
					obj.text += (obj.text==""?"":", ") + $(this).text();
				});
				def_settings.clear(obj);
			}
        });
	},

    lwhCategory3_set: function (sid) {
        this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");
			var highlight = def_settings.highlight?"highlight":"";

			var sidArr = sid.split(",");
			$("li.category", el).removeClass("category-selected").removeClass(highlight);
			$.each(sidArr, function(i, n) {
				$("li.category[sid='" + n + "']", el).addClass("category-selected").addClass(highlight);
			});
            
			if (def_settings.click && $.isFunction(def_settings.click)) {
				var obj = {};
				obj.val 	= "";
				obj.text 	= "";
				$("li.category-selected", $("div.content",el) ).each(function(idx1, el1) {
					obj.val += (obj.val==""?"":",") + $(this).attr("sid");
					obj.text += (obj.text==""?"":",") + $(this).text();
				});
				def_settings.click(obj);
			}
        });
    },
	
    lwhCategory3_get: function () {
		var objArr = [];
		this.each(function (idx, el) {
			var obj = {};
			obj.val 	= "";
			obj.text 	= "";
			$("li.category-selected", $("div.content",el) ).each(function(idx1, el1) {
				obj.val += (obj.val==""?"":",") + $(this).attr("sid");
				obj.text += (obj.text==""?"":",") + $(this).text();
			});
			objArr[objArr.length] = obj;
        });
		return objArr;
    }
	
		
		
});