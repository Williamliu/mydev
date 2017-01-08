/************************************************************************************/
/*  JQuery Plugin  Custom Window                                                   	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-3-29      															*/
/*  Files: 	jquery.lwh.window.js ;  jquery.lwh.window.css							*/
/************************************************************************************/
$.fn.extend({
	lwhWindow:function( opts ){
		var def_settings = {
						 		container: 	"",
								btn_close:	"",
								title:		"",
								maskable: 	false,
								maskClick:	false,
								miniable:   false,
								movable:	false,
								resizable:	false,   //if you want to automatic resize the element inside the window, please add "lwhWindow-resize" class to the element. only first one will effective.
								parkable:	false,
								onlyOne:	false,
								
								offsetTo:	"",
								top:		"middle", // "top", "middle", "bottom" or "10"
								left:		"center", // "left", "center", "right" or "20"
								initWidth:	0,
								initHeight:	0,
								minWidth:  	0,
								minHeight:	0,
								zIndex:		9000,
								
								//event:
								win_init: 		null,
								win_open:		null,
								win_close:		null,
								win_min:		null,
								win_max: 		null,
								
								resize_start:	null,
								resize_end: 	null,
								move_start:		null,
								move_end:		null
							};
		
		$.extend(def_settings, opts);
		var mask_zidx = def_settings.zIndex;
		var mask_midx = def_settings.zIndex + 100;
		var mask_ifrm	= "#lwhWindow_mask_ifrm";
		var mask_div	= "#lwhWindow_mask_div";
		if($(mask_ifrm).length <= 0 )	{
			$(document.body).append('<iframe id="lwhWindow_mask_ifrm" class="lwhWindow-mask-ifrm" style="z-index:' + mask_midx  + ';"></iframe>');
		} 
		
		if($(mask_div).length <= 0 ) 	{
			$(document.body).append('<div id="lwhWindow_mask_div" class="lwhWindow-mask-div" style="z-index:' + (mask_midx + 1) + ';"></div>');
			$(mask_div).attr({"midx": mask_midx, "zidx": mask_zidx});
			
			// mask click to close
			$(mask_div).unbind("click.lwhWindow").bind("click.lwhWindow", function() {
					var sidx = 	parseInt($(this).attr("midx")) + 2;		
					var def_settings = $(".lwhWindow[sidx='" + sidx + "']").data("default_settings");
					if( def_settings.maskClick ) {
							$(".lwhWindow[sidx='" + sidx + "']").css("zIndex", $(".lwhWindow[sidx='" + sidx + "']").attr("zidx")).attr("sidx",0);
							$.lwhWindow_resort();
							$.lwhWindow_show(def_settings.maskable, def_settings.onlyOne);		
							if(def_settings.win_close) def_settings.win_close();
					}
			});
			// end of mask click to close
		} else {
			//if mask exist,  use  mask div attribute -  midx , zidx  
			mask_midx = parseInt($(mask_div).attr("midx"));
			mask_zidx = parseInt($(mask_div).attr("zidx"));
		}
		
		def_settings.zIndex = mask_zidx;

		return this.each( function(idx, el) { 
			/************************************/
			/* initialize						*/
			/************************************/
			$(el).data("default_settings", def_settings);
			// window id not exist ,  create id as "lwhWindow_" + zIndex
			var el_id = "";
			if($(el).attr("id")=="") {
				el_id = "lwhWindow_" + def_settings.zIndex;
			} else {
				el_id = $(el).attr("id");
			}
			$(el).attr({
					   	"id":			el_id, 
						"zidx":			def_settings.zIndex, 
						"sidx":			0, 
						"park":			0,
						"miniState": 	0
						});
			$(el).css("zIndex", def_settings.zIndex);
			var el_ww = parseInt($(el).width());
			var el_hh = parseInt($(el).height());
			
			if( parseInt(def_settings.initWidth) > 0 ) 		el_ww = parseInt(def_settings.initWidth);
			if( parseInt(def_settings.initHeight) > 0 ) 	el_hh = parseInt(def_settings.initHeight);
			
			var el_pos 		= $.lwhWindow_getELPos(el);
			if( el_pos.top + el_hh > $(window).height() - 5 ) {
						el_hh = $(window).height() - el_pos.top - ( $(el).outerHeight() - $(el).height() ) - 5;
			}
			if( el_pos.left + el_ww > $(window).width() -5 ) {
						el_ww = $(window).width() - el_pos.left - ( $(el).outerWidth() - $(el).width() ) - 5;
			}
			if( el_ww < def_settings.minWidth ) el_ww = def_settings.minWidth;
			if( el_hh < def_settings.minHeight ) el_hh = def_settings.minHeight;
			$(el).width(el_ww).height(el_hh).attr({"curWW": el_ww, "curHH": el_hh});
			
			// header event:  select window, move window, close window
			$(el).bind("click.lwhWindow", function(ev) {
					//var tt = ev.target || ev.srcElement;
					//if($(tt).hasClass("lwhWindow-header-close")) return false;
					$.lwhWindow_resort();
					$(this).attr("sidx", parseInt($(mask_div).attr("midx"))+2).css("zIndex", parseInt($(mask_div).attr("midx"))+2);
					$.lwhWindow_show(def_settings.maskable, def_settings.onlyOne);		
			});
			
			if( $(".lwhWindow-header", el).length <= 0 ) {
				var head_html 	= 	'<div 	class="lwhWindow-header"><span 	class="lwhWindow-header-title">' + def_settings.title + '</span>';
				if(def_settings.miniable) head_html += '<a class="lwhWindow-header-maxmin lwhWindow-header-minimum"></a>';					
				head_html +=	'<a	class="lwhWindow-header-close"></a></div>';
				$(el).prepend(head_html);
			}
			
			if(def_settings.movable) {
				$(el).draggable({
					cursor:	"crosshair",
					handle: ".lwhWindow-header",
					start: def_settings.move_start,
					stop: function() { 
							if( $(el).offset().top <= 0 ) $(el).offset({top: 5}); 
							if( $(el).offset().left <= 0 ) $(el).offset({left: 5}); 

							if(def_settings.parkable) $(el).attr("park", 1);
							if(def_settings.move_end) def_settings.move_end();
					}
				});
				$(".lwhWindow-header", el).css("cursor", "move");
			}

			if(def_settings.resizable) {
				$(el).resizable({
					alsoResize: $(".lwhWindow-resize",el),   // only first one element can be resize inside the el. no matter how many you set
					minWidth:	def_settings.minWidth,
					minHeight:	def_settings.minHeight,
					start:		def_settings.resize_start,
					stop:		function() {
									$(el).attr({"curWW": $(el).width(), "curHH": $(el).height()});
									if(def_settings.resize_end) def_settings.resize_end();
					}
				});
			}

			if(def_settings.miniable) {
				$(".lwhWindow-header-maxmin",el).bind("click.lwhWindow", function(ev){
					if( $(el).attr("miniState") == 0 ) {
						$(el).attr("miniState", 1);
						
						if(def_settings.resizable ) $(el).resizable("destroy");
						
						$(el).stop(true, true).delay(200).animate({
							width: 	150,
							height: 0
						},50 );
						$(this).removeClass("lwhWindow-header-minimum").addClass("lwhWindow-header-maxium");
						if(def_settings.win_min) def_settings.win_min();
					} else {
						$(el).attr("miniState", 0);
						$(el).stop(true, true).delay(200).animate({
							width: 	$(el).attr("curWW"),
							height: $(el).attr("curHH")
						},50 );
						
						if(def_settings.resizable ) {
								$(el).resizable({
									alsoResize: $(".lwhWindow-resize",el),   // only first one element can be resize inside the el. no matter how many you set
									minWidth:	def_settings.minWidth,
									minHeight:	def_settings.minHeight,
									start:		def_settings.resize_start,
									stop:		function() {
													$(el).attr({"curWW": $(el).width(), "curHH": $(el).height()});
													if(def_settings.resize_end) def_settings.resize_end();
									}
								});
						}
						$(this).removeClass("lwhWindow-header-maxium").addClass("lwhWindow-header-minimum");
						if(def_settings.win_max) def_settings.win_max();
					}
					// click on minimize or maximize button, trigger window div click event to make this window on the top.
					// so we don't need  prevent , stop
					//ev.preventDefault();
					//ev.stopPropagation();
					//return false;
				});
				// double click header
				$(".lwhWindow-header",el).bind("dblclick.lwhWindow", function(ev){
					if( $(el).attr("miniState") == 0 ) {
						$(el).attr("miniState", 1);
						
						if(def_settings.resizable ) $(el).resizable("destroy");
						
						$(el).stop(true, true).delay(200).animate({
							width: 	150,
							height: 0
						},50 );
						$(".lwhWindow-header-maxmin", this).removeClass("lwhWindow-header-minimum").addClass("lwhWindow-header-maxium");
						if(def_settings.win_min) def_settings.win_min();
					} else {
						$(el).attr("miniState", 0);
						$(el).stop(true, true).delay(200).animate({
							width: 	$(el).attr("curWW"),
							height: $(el).attr("curHH")
						},50 );
						if(def_settings.resizable ) {
								$(el).resizable({
									alsoResize: $(".lwhWindow-resize",el),   // only first one element can be resize inside the el. no matter how many you set
									minWidth:	def_settings.minWidth,
									minHeight:	def_settings.minHeight,
									start:		def_settings.resize_start,
									stop:		function() {
													$(el).attr({"curWW": $(el).width(), "curHH": $(el).height()});
													if(def_settings.resize_end) def_settings.resize_end();
									}
								});
						}
						$(".lwhWindow-header-maxmin", this).removeClass("lwhWindow-header-maxium").addClass("lwhWindow-header-minimum");
						if(def_settings.win_max) def_settings.win_max();
					}
					
					// trigger single click event first,  so it will trigger window div click first, make this window on the top.
					ev.preventDefault();
					ev.stopPropagation();
					return false;
				});
			}

			
			$( ".lwhWindow-header-close" + (def_settings.btn_close!=""?","+def_settings.btn_close:"") , el).bind("click.lwhWindow", function(ev) {
					$(el).css("zIndex",$(el).attr("zidx")).attr("sidx",0);
					$.lwhWindow_resort();
					$.lwhWindow_show(def_settings.maskable, def_settings.onlyOne);		
					if(def_settings.win_close) def_settings.win_close();
					
					if( $(".lwhWindow[sidx!='0']").length <= 0 ) {
						$(window).unbind("scroll.lwhWindow");
						$(window).unbind("resize.lwhWindow");
					}
					
					// prevent trigger window div click event ,  not to make close window div to the top
					ev.preventDefault();
					ev.stopPropagation();
					return false;
			});
			// end of close button  and close icon
	
			def_settings.zIndex++;
			$(mask_div).attr({"zidx": def_settings.zIndex});
			if(def_settings.win_init) def_settings.win_init();

		});// end of return this.each
	},
	
	
	WShow:function( opts ){
		// one time initialize
		// important remind:   
		//unbind("scroll") will destory all scroll event, includes scroll, scroll.xxxx
		//unbind("scroll.xxxx") will destory exactly name. 
		
		//window scroll
		$(window).unbind("scroll.lwhWindow").bind("scroll.lwhWindow", function(){ 
			$.lwhWindow_window_event();
		}); // end of $(window).scroll
		
		// window resize
		$(window).unbind("resize.lwhWindow").bind("resize.lwhWindow", function() {
			$.lwhWindow_window_event();
		}); // end of window resize

		return this.each( function(idx, el) {
				var mask_ifrm	= "#lwhWindow_mask_ifrm";
				var mask_div 	= "#lwhWindow_mask_div";
								   
				var def_settings = $(el).data("default_settings");
				$.extend(def_settings, opts);
				$(el).data("default_settings", def_settings);
				
				if(opts && opts.title && opts.title!="") {
					$(".lwhWindow-header-title", el).html(opts.title);
				} 
				
				$.lwhWindow_resort();
				
				if(def_settings.parkable && $(el).attr("park") == "1") {
							$(el).css({
									zIndex: parseInt($(mask_div).attr("midx"))+2
							}).attr("sidx",  parseInt($(mask_div).attr("midx"))+2);
				} else {
							var el_pos 		= $.lwhWindow_getELPos(el);
							$(el).css({
									left:el_pos.left,
									top: el_pos.top,
									zIndex: parseInt($(mask_div).attr("midx"))+2
							}).attr("sidx",  parseInt($(mask_div).attr("midx"))+2);
				
				}
				$.lwhWindow_show(def_settings.maskable, def_settings.onlyOne);		

				// if already show in minimize size:
				if( def_settings.miniable ) {
					if( $(el).attr("miniState") == 1) {
						$(el).attr("miniState", 0);
						$(el).stop(true, true).delay(200).animate({
							width: 	$(el).attr("curWW"),
							height: $(el).attr("curHH")
						},50 );
						
						if( def_settings.resizable ) {
								$(el).resizable({
									alsoResize: $(".lwhWindow-resize",el),   // only first one element can be resize inside the el. no matter how many you set
									minWidth:	def_settings.minWidth,
									minHeight:	def_settings.minHeight,
									start:		def_settings.resize_start,
									stop:		function() {
													$(el).attr({"curWW": $(el).width(), "curHH": $(el).height()});
													if(def_settings.resize_end) def_settings.resize_end();
									}
								});
						}
						$(".lwhWindow-header-maxmin", this).removeClass("lwhWindow-header-maxium").addClass("lwhWindow-header-minimum");
						if(def_settings.win_max) def_settings.win_max();
					}
				}
				if(def_settings.win_open) def_settings.win_open();
		});
	},
	
	WHide:function( opts ){
		return this.each( function(idx, el) {
				var def_settings = $(el).data("default_settings");
				$.extend(def_settings, opts);
				$(el).data("default_settings", def_settings);

				$(el).css("zIndex",$(el).attr("zidx")).attr("sidx",0);
				$.lwhWindow_resort();
				$.lwhWindow_show(def_settings.maskable, def_settings.onlyOne);		
				if(def_settings.win_close) def_settings.win_close();
				if( $(".lwhWindow[sidx!='0']").length <= 0 ) {
					$(window).unbind("scroll.lwhWindow");
					$(window).unbind("resize.lwhWindow");
				}
				return false;
		});
	}
});

$.extend({
	lwhWindow_resort: function() {
				$(".lwhWindow[sidx='0']").css("zIndex", function(idx0, val0) {
					return $(this).attr("zidx");
				});
				var t_midx = parseInt($("#lwhWindow_mask_div").attr("midx"));
				//all showing div sidx - 1, resort it , reset attr and css
				$(".lwhWindow[sidx!='0']").sort(function(a, b) { 
					return  parseInt($(b).attr("sidx")) - parseInt($(a).attr("sidx"));
				}).each(function(idx0, el0) {
					$(el0).attr("sidx", (t_midx - 1) - idx0).css("zIndex",(t_midx - 1) - idx0);  
				});
	},
	lwhWindow_show: function(maskable, onlyOne) {
							var mask_ifrm	= "#lwhWindow_mask_ifrm";
							var mask_div 	= "#lwhWindow_mask_div";
							
							if(onlyOne) { 
								$(".lwhWindow").hide();							
							} else { 
								$(".lwhWindow[sidx='0']").hide();							
								$(".lwhWindow[sidx!='0']").show();
							}
							// find out the top window. 	
							var max_sidx = 0;
							$(".lwhWindow[sidx!='0']").each(function(idx0, el0) {
									var t_sidx = parseInt($(el0).attr("sidx")); 
									if( t_sidx > max_sidx ) max_sidx = t_sidx; 
							});
							if( max_sidx > 0 ) {
									// if multiple window show,  we need find out the top one  and show it.
									var show_el = $(".lwhWindow[sidx='" + max_sidx + "']");
									show_el.attr("sidx", parseInt($("#lwhWindow_mask_div").attr("midx")) + 2).css("zIndex", parseInt($("#lwhWindow_mask_div").attr("midx")) + 2).show();
									
									//alert("show el:" + show_el.css("top") + ":" + show_el.css("left"));
									var cont	= $.lwhWindow_getLTWH( show_el.data("default_settings").container );
									if( show_el.data("default_settings").maskable ) {
											$(mask_div).stop(true, true).css({
												width: 	cont.width,
												height: cont.height,
												left: 	cont.left,
												top: 	cont.top
											}).show();
								
											$(mask_ifrm).stop(true, true).css({
												width: 	cont.width,
												height: cont.height,
												left: 	cont.left,
												top: 	cont.top
											}).show();
									} else {
											$(mask_div).stop(true, true).css({
												width: 0,
												height: 0,
												left: -2000,
												top: -2000
											}).hide();
								
											$(mask_ifrm).stop(true, true).css({
												width: 0,
												height: 0,
												left: -2000,
												top: -2000
											}).hide();
									}
							} else {
									// if no window show ,  mask should be close
									if( $(mask_div).is(":visible") ) {
											$(mask_div).stop(true, true).css({
												width: 0,
												height: 0,
												left: -2000,
												top: -2000
											}).hide();
								
											$(mask_ifrm).stop(true, true).css({
												width: 0,
												height: 0,
												left: -2000,
												top: -2000
											}).hide();
									}
							}
	},
	// get left, top, width , height for container
	lwhWindow_getLTWH: function( container ) {
				var layout	= {};
				if(container == "") {
						container				= window;
						layout.left				= $(container).scrollLeft();
						layout.top				= $(container).scrollTop();
						layout.width			= $(container).width()	- 4;
						layout.height			= $(container).height()	- 4;
			   } else {
						layout.left		= $(container).offset().left;
						layout.top		= $(container).offset().top;
						layout.width	= $(container).outerWidth();
						layout.height	= $(container).outerHeight();
				} 
				return layout;
	},
	// get left, top, position for element
	lwhWindow_getELPos: function( el ) {
				var def_settings = $(el).data("default_settings");
				var el_pos 		= {};
				el_pos.left 	= 0;
				el_pos.top 		= 0;
				
				var rel_pos		= {};
				rel_pos.left 	= 0;
				rel_pos.top		= 0;
				
				var cont	= $.lwhWindow_getLTWH(def_settings.container);
				var el_width 	= $(el).width();
				var el_height 	= $(el).height();
				if( isNaN(def_settings.top)  ) {
						switch(def_settings.top) {
							case "top":
								el_pos.top = cont.top + 5;
								break;
							case "middle":
								el_pos.top = cont.top + (cont.height - el_height) / 2;
								break;
							case "bottom":
								el_pos.top = cont.top + cont.height - el_height - 5;
								break;
							default:
								el_pos.top = cont.top;
								break;
						}
				} else {
						el_pos.top 	= cont.top + parseInt(def_settings.top);
				}

				if( isNaN(def_settings.left) ) {
						switch(def_settings.left) {
							case "left":
								el_pos.left =cont.left + 5;
								break;
							case "center":
								el_pos.left = cont.left + (cont.width - el_width) / 2;
								break;
							case "right":
								el_pos.left = cont.left + cont.width - el_width - 5;
								break;
							default:
								el_pos.left = cont.left;
								break;
						}
				} else {
						el_pos.left = cont.left + parseInt(def_settings.left);
				}

				if(def_settings.offsetTo != "") {
					rel_pos 	= $.lwhWindow_getLTWH(def_settings.offsetTo);	
					if(isNaN(def_settings.top)) el_pos.top 	= rel_pos.top; else el_pos.top = rel_pos.top + parseInt(def_settings.top);
					if(isNaN(def_settings.left)) el_pos.left = rel_pos.left; else el_pos.left = rel_pos.left + parseInt(def_settings.left);
				}
				
				// think about  out of boundary;
				if( el_pos.left	<= 0 ) 	el_pos.left = 5;
				if( el_pos.top	<= 0 ) 	el_pos.top	= 5;
				return el_pos;
	},
	
	lwhWindow_window_event: function() {
				var mask_ifrm	= "#lwhWindow_mask_ifrm";
				var mask_div 	= "#lwhWindow_mask_div";
				if( $(mask_div).is(":visible") ) {
						var cont = $.lwhWindow_getLTWH("");
						$(mask_ifrm).stop(true, true).delay(200).animate({
												left: 	cont.left,
												top: 	cont.top,
												width:	cont.width,
												height:	cont.height
											  }, 50 ) ;					
						$(mask_div).stop(true, true).delay(200).animate({
												left: 	cont.left,
												top: 	cont.top,
												width:	cont.width,
												height:	cont.height
											  }, 50 ) ;					
				}
				
				$(".lwhWindow[sidx!='0']").each(function(idx0, el0) {
						if( !$(el0).data("default_settings").parkable && $(el0).data("default_settings").offsetTo == "" ) {
							var el_pos 		= $.lwhWindow_getELPos(el0);
							$(el0).stop(true, true).delay(500).animate({
													left: 	el_pos.left,
													top: 	el_pos.top
												},	50);	
						}
				});
	}
});
