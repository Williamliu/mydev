/************************************************************************************/
/*  JQuery Plugin Main Menu - 														*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-3-15      															*/
/*  Files: 	jquery.lwh.mmenu.js ;  jquery.lwh.mmenu.css								*/
/************************************************************************************/

$.fn.extend({
			lwhDrop: function(opts) {
				var def_settings = {
					init:  	function(me){},
					open:	function(me){},
					close:	function(me){}
				};
				$.extend(def_settings, opts);
				var off_left 	= $.browser.msie && $.browser.version<8 ? 12 : 12;
				var off_top 	= $.browser.msie && $.browser.version<8 ? 24 : 24;
				
				return this.each(function(idx, el) { 
						$(el).data("default_settings", def_settings);
						var dropsn = ($(el).attr("id")?$(el).attr("id"):$("s.lwhDrop").length) + ":" + idx;
						$(el).attr("dropsn", dropsn);
						if( $(el).children("s.lwhDrop-s").length <= 0 ) $(el).append('<s class="lwhDrop-s"></s>'); 
						$("div.lwhDrop-div", el).attr("dropsn", dropsn).appendTo( $("body") );
						
						$(el).live("mouseover", function(ev) {
							//var def_settings = $(el).data("default_settings");
							$("s.lwhDrop[dropsn] span.lwhDrop-span").removeClass("lwhDrop-span-hover");
							$("div.lwhDrop-div[dropsn]").stop(true,true).hide();

							var _self = this;
							var div_el = $("div.lwhDrop-div[dropsn='" + $(this).attr("dropsn") + "']");
							var div_pos = $(this).offset(); 
							
							var pos_left 	= div_pos.left + off_left;
							var pos_top 	= div_pos.top + off_top;
							div_el.stop(true, true).css({
									left: 	pos_left, 
									top: 	pos_top 
							}).show(0, function(){
									$("span.lwhDrop-span", _self).addClass("lwhDrop-span-hover");
									if( def_settings.open && $.isFunction(def_settings.open) ) def_settings.open(el);
							});
						});
						
						$(el).live("mouseout", function(ev) {
								var _self = $(this);
								if( $("div.lwhDrop-div[dropsn='" + $(this).attr("dropsn") + "']").length > 0 ) {
										$("div.lwhDrop-div[dropsn='" + $(this).attr("dropsn") + "']").stop(true,true).delay(500).hide(200, function(){
											$("span.lwhDrop-span", _self).removeClass("lwhDrop-span-hover");
											if( def_settings.close && $.isFunction(def_settings.close) ) def_settings.close(el);
										});
								} else {
										$("span.lwhDrop-span", _self).removeClass("lwhDrop-span-hover");
										if( def_settings.close && $.isFunction(def_settings.close) ) def_settings.close(el);
								}
						});
						
						$("div.lwhDrop-div[dropsn='" + dropsn + "']").live("mouseover", function(ev) {
								var btn_el 	= $("s.lwhDrop[dropsn='" + $(this).attr("dropsn") + "']"); 
								var btn_pos = btn_el.offset();
				
								var pos_left 	= btn_pos.left + off_left;
								var pos_top 	= btn_pos.top + off_top;
								$("span.lwhDrop-span", btn_el).addClass("lwhDrop-span-hover");
								$(this).stop(true,true).css({
										left: 	pos_left, 
										top: 	pos_top
								}).show(); 
						});

						$("div.lwhDrop-div[dropsn='" + dropsn + "']").live("mouseout", function(ev){
								var btn_el 	= $("s.lwhDrop[dropsn='" + $(this).attr("dropsn") + "']"); 
								var span_el = $("span.lwhDrop-span", btn_el); 
								$(this).stop(true, true).delay(500).hide(200, function(){
									span_el.removeClass("lwhDrop-span-hover");
								}); 
						});
	
						$("li.lwhDrop-item").die("mouseover").live("mouseover", function(ev) {
							$(this).addClass("lwhDrop-itemHover");
						});
						$("li.lwhDrop-item").die("mouseout").live("mouseout", function(ev) {
							$(this).removeClass("lwhDrop-itemHover");
						});


						if( def_settings.init && $.isFunction(def_settings.init) ) def_settings.init(el);
				});
			},
		
		lwhDrop_open: function() {
				var off_left 	= $.browser.msie && $.browser.version<8 ? 12 : 12;
				var off_top 	= $.browser.msie && $.browser.version<8 ? 24 : 24;
				return this.each(function(idx, el) { 
						var def_settings = $(el).data("default_settings");
						var div_el = $("div.lwhDrop-div[dropsn='" + $(el).attr("dropsn") + "']");
						var div_pos = $(el).offset(); 

						var pos_left 	= div_pos.left + off_left;
						var pos_top 	= div_pos.top + off_top;
						div_el.stop(true, true).css({
								left: 	pos_left, 
								top: 	pos_top
						}).show(0, function(){
								$("span.lwhDrop-span", el).addClass("lwhDrop-span-hover");
								if( def_settings.open && $.isFunction(def_settings.open) ) def_settings.open(el);
						});
				});
		},
		
		lwhDrop_close: function() {
				return this.each(function(idx, el) { 
						var def_settings = $(el).data("default_settings");
						if( $("div.lwhDrop-div[dropsn='" + $(el).attr("dropsn") + "']").length > 0 ) {
								$("div.lwhDrop-div[dropsn='" + $(el).attr("dropsn") + "']").stop(true,true).hide(0, function(){
									$("span.lwhDrop-span", el).removeClass("lwhDrop-span-hover");
									if( def_settings.close && $.isFunction(def_settings.close) ) def_settings.close(el);
								});
						} else {
								$("span.lwhDrop-span", el).removeClass("lwhDrop-span-hover");
								if( def_settings.close && $.isFunction(def_settings.close) ) def_settings.close(el);
						}
				});
		}
});