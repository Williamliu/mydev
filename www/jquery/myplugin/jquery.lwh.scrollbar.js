/************************************************************************************/
/*  JQuery Plugin customize Scrollbar - Horizontal , vertical scroll bar            */
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-4-16      															*/
/*  Files: 	jquery.lwh.scrollbar.js ;  jquery.lwh.scrollbar.css						*/
/************************************************************************************/
// scrollbar Div - style display do not support  "table" , "line-table" 

var lwhScrollbar_timer = null;
$.fn.extend({
	lwhScrollbar_Remove: function() {
			return this.each( function(idx, el0) { 
				var me_id = $(el0).attr("id");
				var el_me = "#" + me_id;
				var jSframe = "#lwh-sframe-" + me_id;
				var jScontent = "#lwh-scontent-" + me_id;
				
				if( $(jSframe).length > 0 ) {
					$(jSframe).parent().append( $(el0) );
					if($("#lwh-plugin-hscroll", jSframe).length>0) $("#lwh-plugin-hscroll", jSframe).remove();
					if($("#lwh-plugin-vscroll", jSframe).length>0) $("#lwh-plugin-vscroll", jSframe).remove();
					if($(jScontent).length>0) $(jScontent).remove();
					$(jSframe).remove();
				}
			});
	},

	lwhScrollbar_scrollReset: function() {
			return this.each( function(idx, el0) { 
				var me_id = $(el0).attr("id");
				var el_me = "#" + me_id;
				var jSframe = "#lwh-sframe-" + me_id;
				var jScontent = "#lwh-scontent-" + me_id;
				if( $(jSframe).length > 0 ) {
					if( $(".lwh-plugin-hscroll", jSframe).is(":visible") ) {
						$(jScontent).scrollLeft(0);
						$.scroll_hgoing(jSframe, el_me);
					}
					if( $(".lwh-plugin-vscroll", jSframe).is(":visible") ) {
						$(jScontent).scrollTop(0);
						$.scroll_vgoing(jSframe, el_me);
					}
				}
			});
	},

	lwhScrollbar : function( opts ) {
			var def_settings = {
							resizable:		false,
							hscroll:		true,
							vscroll:		true,
							htop: 			0,
							hbottom:		0,
							wleft:			0,
							wright:			0
					  };
			$.extend(def_settings, opts);
			
			return this.each( function(idx, el0) { 
				var me_id = $(el0).attr("id");
				var el_me = "#" + me_id;
				$(el0).wrap('<div class="lwh-plugin-scrollbar-frame" id="lwh-sframe-'+ me_id +'"></div>');
				var jSframe = "#lwh-sframe-" + me_id;
				
				$(jSframe).data("default_settings", def_settings);
				$(jSframe).attr("style", $(el_me).attr("style"));
				$(jSframe).css({
							display:	($(jSframe).css("display").indexOf("table")<0?$(jSframe).css("display"):"block"),
							position:	"relative",
							overflow:	"hidden",
							padding:	"0px",
							margin:		"0px"
				});
				
				$(el0).wrap('<div id="lwh-scontent-' + me_id + '" class="lwh-plugin-scrollbar-content">');				
				var jScontent = "#lwh-scontent-" + me_id;
				
				var el_display = "table";
				if( $.browser.msie ) {
					if( parseInt($.browser.version) < 8 )  el_display = "block";
				}
				if(!def_settings.hscroll) el_display = "block"; 
				
				$(el0).css({
					position: 	"relative",
					width:		"auto",
					height:		"auto",
					padding:	"0px",
					margin:		"0px",
					border:		"0px",
					overflow:	"",
					display:	el_display //def_settings.hscroll?"table":"block" //($.browser.msie?"block":"table"):"block"
				})			

				var hscroll_html = '<div class="lwh-plugin-hscroll">' +
									'<table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">' + 
									'<tr><td class="hs-left"></td>' + 
									'<td class="hs-center" align="left" valign="middle"><div class="hs-center-bar"></div></td>' +
									'<td class="hs-right"></td>' +
									'<td class="hs-corner"></td></tr>' + 
									'</table></div>';

				var vscroll_html = '<div class="lwh-plugin-vscroll">' +
									'<div class="vs-top"></div>' +
									'<div class="vs-middle"><div class="vs-middle-bar"></div></div>' +
									'<div class="vs-bottom"></div>' + 
									'<div class="vs-corner"></div>' +
									'</div>';
									
				$(jSframe).append(hscroll_html);
				$(jSframe).append(vscroll_html);
				
				// resizable 
				if(def_settings.resizable) $(jSframe).resizable();
				
				//$(jSframe).queue("ddd", "callResize()");
				
				/*
				$(jSframe).bind("RESIZEDETCT", function(){
					//alert("jsframe resize");
					$.scroll_visible(jSframe, el_me);
				});
				
				$(el_me).bind("resize", function(){
					//alert("el_me");
					$.scroll_visible(jSframe, el_me);
				});
				*/
				
				// mousewheel event
				$(jSframe).mouseover( function() {
					// IE  and Windows WPF  don't need focus. input element doesn't work
					if( !$.browser.msie ) {
						$(this).focus();
					}
				});
				
				$(jSframe).mousewheel( function(ev, pos) {
					if( !$(el_me).is(":hidden") ) {
						if(pos > 0 ) {
							var new_top = $(jScontent).scrollTop() - 40;
							$(jScontent).scrollTop(new_top);
						} else {
							var new_top = $(jScontent).scrollTop() + 40;
							$(jScontent).scrollTop(new_top);
						}
						$.scroll_vgoing(jSframe, el_me);
						//$.scroll_visible(jSframe, el_me);
					}
					ev.stopPropagation();
					return false;
				});

				// horizontal and vertical bar drag 
				$(".vs-middle-bar", jSframe).draggable({
					axis: "y",
					scroll: false,
					containment:"parent",
					drag: function(ev, ui) {
						if( !$(el_me).is(":hidden") ) $.drag_vgoing(jSframe, el_me, ui.position.top);
					}
				});
				$(".hs-center-bar", jSframe).draggable({
					axis: "x",
					containment:"parent",
					drag: function(ev, ui) {
						if( !$(el_me).is(":hidden") ) $.drag_hgoing(jSframe, el_me, ui.position.left);
					} 
				});
			
				
				// click event
				$(".vs-top", jSframe).live("click", function() {
					if( !$(el_me).is(":hidden") ) {
						var new_top = $(jScontent).scrollTop()-40;
						$(jScontent).scrollTop(new_top);
						$.scroll_vgoing(jSframe, el_me);
					}
				});
				
				$(".vs-middle", jSframe).live("click", function(ev) {
					if( !$(el_me).is(":hidden") ) {
							var hit_top = ev.pageY - $(this).offset().top;
							var new_top;
							if( hit_top > 	parseInt( $(".vs-middle-bar", this).css("top") ) ) {
								new_top = 	parseInt( $(".vs-middle-bar", this).css("top") ) + 40;
							} else {
								new_top = 	parseInt( $(".vs-middle-bar", this).css("top") ) - 40;
							}
							if( new_top < 0 ) new_top = 0;
							var vs_length 	= $(this).height() - $(".vs-middle-bar",this).outerHeight();
							if( new_top > vs_length ) new_top = vs_length; 
							$(".vs-middle-bar", this).css("top", new_top );
							$.drag_vgoing(jSframe, el_me, new_top);
					}
					return false;
				});

				$(".vs-bottom", jSframe).live("click", function() {
					if( !$(el_me).is(":hidden") ) {
							var new_top = $(jScontent).scrollTop()+40;
							$(jScontent).scrollTop(new_top);
							$.scroll_vgoing(jSframe, el_me);
					}
				});


				$(".hs-left", jSframe).live("click", function() {
					if( !$(el_me).is(":hidden") ) {
							var new_left = $(jScontent).scrollLeft()-40;
							$(jScontent).scrollLeft(new_left);
							$.scroll_hgoing(jSframe, el_me);
					}
				});

				$(".hs-center", jSframe).live("click", function(ev) {
					if( !$(el_me).is(":hidden") ) {					
							var hit_left = ev.pageX - $(this).offset().left;
							var new_left;
							if( hit_left > 	parseInt( $(".hs-center-bar", 	this).css("left") ) ) {
								new_left = 	parseInt( $(".hs-center-bar",	this).css("left") ) + 40;
							} else {
								new_left = 	parseInt( $(".hs-center-bar", 	this).css("left") ) - 40;
							}
							if( new_left < 0 ) new_left = 0;
							var hs_length 	= $(this).width() - $(".hs-center-bar",this).outerWidth();
							if( new_left > hs_length ) new_left = hs_length; 
							$(".hs-center-bar", this).css("left", new_left );
							$.drag_hgoing(jSframe, el_me, new_left);
					}
					return false;
				});

				$(".hs-right", jSframe).live("click", function() {
					if( !$(el_me).is(":hidden") ) {
							var new_left = $(jScontent).scrollLeft()+40;
							$(jScontent).scrollLeft(new_left);
							$.scroll_hgoing(jSframe, el_me);
					}
				});

				// initalize the status bar
				$.scroll_visible(jSframe , el_me);
			});
	}
});


$.extend({
		scroll_visible: function( el0, el1) {
			var def_settings = $(el0).data("default_settings");
			
			var vv 		= {
					frame_w : $(el0).width(),
					frame_h	: $(el0).height(),
					me_w	: $(el1).outerWidth(),
					me_h	: $(el1).outerHeight(),
					hlength	: $(el1).outerWidth() - $(el0).width(),
					vlength : $(el1).outerHeight() - $(el0).height(),
					bar_w	: 20,
					bar_h	: 20,
					bar_wlength : 0,
					bar_vlength : 0
			};
			
			$(".vs-corner", el0).height(0);
			if( vv.frame_w 	< vv.me_w &&  def_settings.hscroll) 	$(".vs-corner", el0).height(18);
			if( def_settings.htop > 0 ) 	$(".vs-top", el0).height(def_settings.htop);
			if( def_settings.hbottom > 0 ) 	$(".vs-bottom", el0).height(def_settings.hbottom);
			if( def_settings.resizable ) 	$(".vs-corner", el0).height(18);
			
			$(".hs-corner", el0).width(0);
			if( vv.frame_h 	< vv.me_h && def_settings.vscroll ) 	$(".hs-corner", el0).width(17); 
			if( def_settings.wleft > 0 ) 	$(".hs-left", el0).width(def_settings.wleft);
			if( def_settings.wright > 0 ) 	$(".hs-right", el0).width(def_settings.wright);
			if( def_settings.resizable ) 	$(".hs-corner", el0).width(17);
			
			//alert("width:" + vv.frame_w + ":" + el1_width);
			if( def_settings.hscroll ) {
					if( vv.frame_w 	< vv.me_w ) {
						$(el1).css("padding-bottom", 16);
						$(".lwh-plugin-hscroll", el0).show();
						
						vv.bar_w = vv.frame_w / vv.me_w * $(".hs-center", el0).width();
						vv.bar_w = vv.bar_w<16?16:vv.bar_w;
						vv.bar_w = $(".hs-center", el0).width()<=16?$(".hs-center", el0).width()-5:vv.bar_w;
						
						if( vv.bar_w > 5 ) {
							$(".hs-center-bar", el0).show();
						} else {
							
							$(".hs-center-bar", el0).hide();
						}

						$(".hs-center-bar", el0).width( vv.bar_w );
						vv.bar_wlength = $(".hs-center", el0).width() - $(".hs-center-bar", el0).outerWidth();
						$.scroll_hgoing(el0, el1);
					
					} else {
						$(".lwh-plugin-hscroll", el0).hide();
						$(el1).css("padding-bottom", 0);
					}
			} else {
					$(".lwh-plugin-hscroll", el0).hide();
					$(el1).css("padding-bottom", 0);
			}
			
			//alert("height:" + vv.frame_h + ":" + vv.me_h);
			if( def_settings.vscroll ) {
					if( vv.frame_h 	< vv.me_h ) {
						$(el1).css("padding-right", 16);
						$(".lwh-plugin-vscroll", el0).show();
						
						$(".vs-middle", el0).height( $(".lwh-plugin-vscroll", el0).height() - $(".vs-top", el0).outerHeight() - $(".vs-bottom", el0).outerHeight() - $(".vs-corner", el0).outerHeight());
						
						vv.bar_h = vv.frame_h / vv.me_h * $(".vs-middle", el0).height();
						vv.bar_h = vv.bar_h < 16 ? 16: vv.bar_h;
						vv.bar_h = $(".vs-middle",el0).height()<=16?$(".vs-middle", el0).height()-5:vv.bar_h; 
						
						if( vv.bar_h > 5 ) {
							$(".vs-middle-bar", el0).show();
						} else {
							$(".vs-middle-bar", el0).hide();
						}
						$(".vs-middle-bar", el0).height( vv.bar_h );
						vv.bar_vlength = $(".vs-middle", el0).height() - $(".vs-middle-bar", el0).outerHeight();
						$.scroll_vgoing(el0, el1);
						
					} else {
						$(".lwh-plugin-vscroll", el0).hide();
						$(el1).css("padding-right", 0);
					}
			} else {
					$(".lwh-plugin-vscroll", el0).hide();
					$(el1).css("padding-right", 0);
			}
			
		
		},
		
		scroll_vgoing: function( el0, el1 ) {
			var vs_length 	= $(el1).outerHeight() - $(el0).height();
			var bar_length 	= $(".vs-middle-bar", el0).parent().height() - $(".vs-middle-bar", el0).outerHeight();
			var bar_top = Math.ceil( bar_length *  $(".lwh-plugin-scrollbar-content", el0).scrollTop() / vs_length );
			$(".vs-middle-bar", el0).css("top", bar_top);
			$.lwhScroll_fresh(el1);
			return false;
		},

		scroll_hgoing: function( el0, el1 ) {
			var hs_length 	= $(el1).outerWidth() - $(el0).width();
			var bar_length 	= $(".hs-center-bar", el0).parent().width() - $(".hs-center-bar", el0).outerWidth();
			var bar_left =  Math.ceil( bar_length *  $(".lwh-plugin-scrollbar-content", el0).scrollLeft() / hs_length );
			$(".hs-center-bar", el0).css("left", bar_left);
			$.lwhScroll_fresh(el1);
			return false;
		},
		
		drag_vgoing: function( el0, el1, ytop ) {
			var vs_length 	= $(el1).outerHeight() - $(el0).height();
			var bar_length 	= $(".vs-middle-bar", el0).parent().height() - $(".vs-middle-bar", el0).outerHeight();
			var scroll_top =  Math.ceil( ytop  * vs_length / bar_length );
			$(".lwh-plugin-scrollbar-content", el0).scrollTop(scroll_top);
			$.lwhScroll_fresh(el1);
		},

		drag_hgoing: function( el0, el1, xleft ) {
			var hs_length 	= $(el1).outerWidth() - $(el0).width();
			var bar_length 	= $(".hs-center-bar", el0).parent().width() - $(".hs-center-bar", el0).outerWidth();
			var scroll_left =  Math.ceil( xleft  * hs_length / bar_length );
			$(".lwh-plugin-scrollbar-content", el0).scrollLeft(scroll_left);
			$.lwhScroll_fresh(el1);
		},
		
		lwhScroll_fresh: function( el1 ) {
			// windows WPF  must  hide().show();
			if( $.browser.msie ) {
				$(el1).hide().show();
			}
		},
		
		scrollbarResize: function() {
				$(".lwh-plugin-scrollbar-frame:visible").each(function(idx1, el1) {
								var frame			= $(el1);
								var contain			= $(".lwh-plugin-scrollbar-content", el1);
								var content			= $(".lwh-plugin-scrollbar-content > div", el1);
								var frame_old_ww 	= frame.data("old_ww")?frame.data("old_ww"):0;
								var frame_old_hh 	= frame.data("old_hh")?frame.data("old_hh"):0;
								var content_old_ww 	= content.data("old_ww")?content.data("old_ww"):0;
								var content_old_hh 	= content.data("old_hh")?content.data("old_hh"):0;
					
								var frame_cur_ww 	= frame.width();
								var frame_cur_hh 	= frame.height();
								var content_cur_ww 	= content.width();
								var content_cur_hh 	= content.height();
								
								if( frame_old_ww != frame_cur_ww || frame_old_hh != frame_cur_hh || content_old_ww != content_cur_ww || content_old_hh != content_cur_hh ) {
									frame.data("old_ww", frame_cur_ww);
									frame.data("old_hh", frame_cur_hh);
									content.data("old_ww", content_cur_ww);
									content.data("old_hh", content_cur_hh);
									$.scroll_visible(frame, content);
									content.hide().show();
								}
				});
		}
});

// after  initialize the scrollbar,  you need to call this function to auto detect DIV size change.
function detectResize() {
		var debug = 0;
		if(debug) var str = '';
		$(".lwh-plugin-scrollbar-frame:visible").each(function(idx1, el1) {
			//alert( $(el1).attr("id") + ":" +  $(el1).data("detect_flag") );
					var frame			= $(el1);
					var contain			= $(".lwh-plugin-scrollbar-content", el1);
					var content			= $(".lwh-plugin-scrollbar-content > div", el1);
	
					var frame_old_ww 	= frame.data("old_ww")?frame.data("old_ww"):0;
					var frame_old_hh 	= frame.data("old_hh")?frame.data("old_hh"):0;
					var content_old_ww 	= content.data("old_ww")?content.data("old_ww"):0;
					var content_old_hh 	= content.data("old_hh")?content.data("old_hh"):0;
		
					var frame_cur_ww 	= frame.width();
					var frame_cur_hh 	= frame.height();
					var content_cur_ww 	= content.width();
					var content_cur_hh 	= content.height();
					
					if( debug ) {
						str += "id:--" + frame.attr("id") + "\n";
						str += "old w:" + frame_old_ww + " cur w:" + frame_cur_ww + "\n";
						str += "old h:" + frame_old_hh + " cur h:" + frame_cur_hh + "\n";
						str += "id:------" + content.attr("id") + "\n";
						str += "old w:" + content_old_ww + " cur w:" + content_cur_ww + "\n";
						str += "old h:" + content_old_hh + " cur h:" + content_cur_hh + "\n";
					}
					
					if( frame_old_ww != frame_cur_ww || frame_old_hh != frame_cur_hh || content_old_ww != content_cur_ww || content_old_hh != content_cur_hh ) {
						frame.data("old_ww", frame_cur_ww);
						frame.data("old_hh", frame_cur_hh);
						content.data("old_ww", content_cur_ww);
						content.data("old_hh", content_cur_hh);
						$.scroll_visible(frame, content);
					}
					//alert("i am true");
		});
		if( debug ) alert(str);
		lwhScrollbar_timer = setTimeout('detectResize()', 1000);
	
}
