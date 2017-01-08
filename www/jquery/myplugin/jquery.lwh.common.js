/*** JQuery Common Function ***/
function tool_tips(ss) {
   if( $("#tooltips").length>0 ) $("#tooltips").autoTShow(ss);
}

function wait_show() {
    if ( $("#wait").length>0 ) $("#wait").loadShow();
}

function wait_hide() {
    if ( $("#wait").length>0 ) $("#wait").loadHide();
}

$.extend({
	element_pro: function(el) {
				var pro	= {};
				if($(el).length <= 0) {
						el					= window;
						pro.left			= $(el).scrollLeft();
						pro.top				= $(el).scrollTop();
						pro.width			= $(el).width()	 - 4;
						pro.height			= $(el).height() - 4;
			   } else {
						pro.left			= $(el).offset().left;
						pro.top				= $(el).offset().top;
						pro.width			= $(el).outerWidth();
						pro.height			= $(el).outerHeight();
				} 
				return pro;
	},
	
	element_pos: function(el) {
				var def_settings = $(el).data("default_settings");
				var el_pos 		= {};
				el_pos.left 	= 0;
				el_pos.top 		= 0;
				
				var cont		= $.element_pro(def_settings.container);
				var el_width 	= $(el).outerWidth();
				var el_height 	= $(el).outerHeight();
				
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

				if( $(def_settings.offsetTo).length > 0) {
					var rel_pos		= {};
					rel_pos.left 	= 0;
					rel_pos.top		= 0;

					rel_pos 	= $.element_pro(def_settings.offsetTo);	
					if(isNaN(def_settings.top)) el_pos.top 	= rel_pos.top; else el_pos.top = rel_pos.top + parseInt(def_settings.top);
					if(isNaN(def_settings.left)) el_pos.left = rel_pos.left; else el_pos.left = rel_pos.left + parseInt(def_settings.left);
				}
				
				// think about  out of boundary;
				if( el_pos.left	<= 0 ) 	el_pos.left = 5;
				if( el_pos.top	<= 0 ) 	el_pos.top	= 5;
				return el_pos;
	}
});
/*** End of JQuery Common Funcion ***/