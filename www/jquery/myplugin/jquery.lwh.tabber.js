/************************************************************************************/
/*  JQuery Plugin  Tabber		                                                   	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-7-11      															*/
/*  Files: 	jquery.lwh.tabber.js ;  jquery.lwh.tabber.css							*/
/************************************************************************************/
$.fn.extend({
	lwhTabber: function( opts ){
		var def_settings = {
			tabIdx:			0,
			zIndex:			900,
			button:			false,
			closed:			false,
			linkTo:			"",
			
			// event:
			Activate:		function(el){},
			Deactive:		function(el){},
			open:			function(el, sn){},
			close:			function(el, sn){}
		};
		$.extend(def_settings, opts);

		return this.each( function(idx, el) { 
			var alen = $(".lwhTabber-header > a", el).length;
			if( def_settings.tabIdx > alen ) def_settings.tabIdx = 0;
			$(el).data("default_settings", def_settings);
			$(el).data("curIdx",def_settings.tabIdx);
			 
			 if(def_settings.button) {
				if($(".lwhTabber-header > span.button", el).length <= 0 ) $(".lwhTabber-header", el).append('<span class="button open"></span>');
				
				if( def_settings.closed ) {
					$(".lwhTabber-header > span.button", el).removeClass("open").addClass("close");	
					$(".lwhTabber-content", el).hide();
				}
				
				$(".lwhTabber-header > span.button", el).die("click.lwhTabber").live("click.lwhTabber", function(ev) {
					 if( $(this).hasClass("open") ) {
					 	$(".lwhTabber-content", el).slideUp(500);
						$(this).removeClass("open").addClass("close");
						def_settings.close(el, $(el).data("curIdx"));					
					 } else if( $(this).hasClass("close") ) {
					 	$(".lwhTabber-content", el).slideDown(500);
						$(this).removeClass("close").addClass("open");
						def_settings.open(el, $(el).data("curIdx"));
						
						if(def_settings.linkTo != "") $(def_settings.linkTo).not(el).lwhTabber_close();					
					 }
				});
			 }
			 
			$(".lwhTabber-header > a", el).each(function(idx1, el1) {
				if(def_settings.tabIdx == idx1) {
					$(el).data("curIdx", idx1);
					$(el1).addClass("selected").css("z-index", def_settings.zIndex+10).attr("sn", idx1);
				} else {
					$(el1).removeClass("selected").css("z-index", def_settings.zIndex-idx1).attr("sn", idx1);
				}
			});

			$(".lwhTabber-content > div", el).each(function(idx1, el1) {
				if(def_settings.tabIdx == idx1) {
					$(el1).addClass("selected").attr("sn", idx1).show();
				} else {
					$(el1).removeClass("selected").attr("sn", idx1).hide();
				}
			});

			$(".lwhTabber-header > a", el).die("click.lwhTabber").live("click.lwhTabber", function(ev) {
				if( !$(this).hasClass("selected") ) {
					var oldIdx = parseInt($(el).data("curIdx"));
					var old_el = $("div[sn='" + oldIdx + "']", $(".lwhTabber-content", el));
					def_settings.Deactive(old_el);
					
					// reset all  header and content
					$(".lwhTabber-header > a", el).removeClass("selected").css("z-index",function(idx1, css1){ return def_settings.zIndex - parseInt($(this).attr("sn")); });
					$(".lwhTabber-content > div", el).removeClass("selected").hide();
					
					var curIdx = parseInt($(this).attr("sn"));
					var cur_el = $("div[sn='" + curIdx + "']", $(".lwhTabber-content", el));
					$(this).addClass("selected").css("z-index", def_settings.zIndex+10);
					cur_el.addClass("selected").show();
					$(el).data("curIdx", curIdx);
					
					def_settings.Activate(cur_el);
				}

				if( $(".lwhTabber-content", el).is(":hidden") ) {
					$(".lwhTabber-content", el).slideDown(500); 
					$("span.button", $(".lwhTabber-header", el)).removeClass("close").addClass("open");
					def_settings.open(el, $(el).data("curIdx"));					

					if(def_settings.linkTo != "") $(def_settings.linkTo).not(el).lwhTabber_close();					
				}
			});
		});
	},
	
	lwhTabber_close: function() {
		return this.each( function(idx, el) { 
				if( $(".lwhTabber-content", el).is(":visible") ) {
					$(".lwhTabber-content", el).slideUp(500); 
					$("span.button", $(".lwhTabber-header", el)).removeClass("open").addClass("close");
					
					var def_settings = $(el).data("default_settings");
					def_settings.close(el, $(el).data("curIdx"));					
				}
		});
	},

	lwhTabber_open: function() {
		return this.each( function(idx, el) { 
				if( $(".lwhTabber-content", el).is(":hidden") ) {
					$(".lwhTabber-content", el).slideDown(500); 
					$("span.button", $(".lwhTabber-header", el)).removeClass("close").addClass("open");
					
					var def_settings = $(el).data("default_settings");
					def_settings.open(el, $(el).data("curIdx"));					
				}
		});
	}
});