/************************************************************************************/
/*  JQuery Plugin  Vertical Tabber		                                                   	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-7-11      															*/
/*  Files: 	jquery.lwh.tabber.js ;  jquery.lwh.tabber.css							*/
/************************************************************************************/
$.fn.extend({
	lwhVTabber: function( opts ){
		var def_settings = {
			tabIdx:			0,
			zIndex:			999,
			button:			true,
			closed:			false,
			
			// event:
			Activate:		function(el){},
			Deactive:		function(el){},
			open:			function(el, sn){},
			close:			function(el, sn){}
		};
		$.extend(def_settings, opts);

		return this.each( function(idx, el) { 
			var alen = $("li", $(".lwhVTabber-header", el)).length;
			if( def_settings.tabIdx > alen ) def_settings.tabIdx = 0;
			$(el).data("default_settings", def_settings);
			$(el).data("curIdx",def_settings.tabIdx);
			$(el).attr("curWW",$(el).width());
			
			if(def_settings.button) {
				if($("span.button", $(".lwhVTabber-header", el)).length <= 0 ) $(".lwhVTabber-header", el).append('<span class="button open"></span>');

				if( def_settings.closed ) {
					$("span.button", $(".lwhVTabber-header", el)).removeClass("open").addClass("close");	
					$(el).width(0);
					$(".lwhVTabber-content", el).width(0);
				}
			
				$("span.button", $(".lwhVTabber-header", el)).die("click.lwhVTabber").live("click.lwhVTabber", function(ev) {
					 if( $(this).hasClass("open") ) {
					 	$(el).width(0);
						$(".lwhVTabber-content",el).width(0); 
						
						$(this).removeClass("open").addClass("close");
						def_settings.close(el, $(el).data("curIdx"));					
					 } else if( $(this).hasClass("close") ) {
					 	$(el).width($(el).attr("curWW"));
						$(".lwhVTabber-content",el).width($(el).attr("curWW")); 
	
						$(this).removeClass("close").addClass("open");
						def_settings.open(el, $(el).data("curIdx"));					
					 }
				});
			 }
			 
			$("li", $(".lwhVTabber-header", el)).each(function(idx1, el1) {
				var content = $(el1).text();
				var content_arr = content.split("");
				content = content_arr.join("<br>") + '<s></s>';
				$(el1).html(content);
				
				if(def_settings.tabIdx == idx1) {
					$(el).data("curIdx", idx1);
					$(el1).addClass("selected").css("z-index", def_settings.zIndex+10).attr("sn", idx1);
				} else {
					$(el1).removeClass("selected").css("z-index", def_settings.zIndex-idx1).attr("sn", idx1);
				}
			});

			$("div", $(".lwhVTabber-content", el)).each(function(idx1, el1) {
				if(def_settings.tabIdx == idx1) {
					$(el1).addClass("selected").attr("sn", idx1).show();
				} else {
					$(el1).removeClass("selected").attr("sn", idx1).hide();
				}
			});

			$("li", $(".lwhVTabber-header", el)).die("click.lwhVTabber").live("click.lwhVTabber", function(ev) {
				if( !$(this).hasClass("selected") ) {
					var oldIdx = parseInt($(el).data("curIdx"));
					var old_el = $("div[sn='" + oldIdx + "']", $(".lwhVTabber-content", el));
					def_settings.Deactive(old_el);
					
					// reset all  header and content
					$("li", $(".lwhVTabber-header", el)).removeClass("selected").css("z-index",function(idx1, css1){ return def_settings.zIndex - parseInt($(this).attr("sn")); });
					$("div", $(".lwhVTabber-content", el)).removeClass("selected").hide();
					
					var curIdx = parseInt($(this).attr("sn"));
					var cur_el = $("div[sn='" + curIdx + "']", $(".lwhVTabber-content", el));
					$(this).addClass("selected").css("z-index", def_settings.zIndex+10);
					cur_el.addClass("selected").show();
					$(el).data("curIdx", curIdx);
					
					def_settings.Activate(cur_el);
				}
				
				if( $(el).width() <= 0  ) {
					$(el).width($(el).attr("curWW")); 
					$(".lwhVTabber-content",el).width($(el).attr("curWW")); 
					
					$("span.button", $(".lwhVTabber-header", el)).removeClass("close").addClass("open");
					def_settings.open(el, $(el).data("curIdx"));					
				}

			});
		});
	}
});