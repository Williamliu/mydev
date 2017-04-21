/************************************************************************************/
/*  JQuery Plugin  Custom Navi Bar Menu                                           	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2017-04-20      														*/
/*  Files: 	jquery.lwh.navi.js ;  jquery.lwh.navi.css								*/
/************************************************************************************/

// var url_name   come from include/wliu/language/language.php    
$(function(){
	$("li>*[href*='" + url_name + "']", "div[wliu-nav]>div[menu]").parents("li", "div[wliu-nav]>div[menu]").addAttr("active");

	$(document).off("click.wliu-dropdown", "div[wliu-dropdown]").on("click.wliu-dropdown", "div[wliu-dropdown]", function(evt){
		if( $(this).hasAttr("active") ) {
			$(this).removeAttr("active");
		} else {
			$("div[wliu-dropdown]").removeAttr("active");
			$(this).addAttr("active");
		}
	});

	$(document).off("click.wliu-nav", "div[wliu-nav] > div[head] > a[menu-button]").on("click.wliu-nav", "div[wliu-nav] > div[head] > a[menu-button]", function(evt){
		if( $("div[menu]", $(this).closest("div[wliu-nav")).hasAttr("active") ) {
			$("div[menu]", $(this).closest("div[wliu-nav")).removeAttr("active");
		} else {
			$("div[menu]", $(this).closest("div[wliu-nav")).addAttr("active");
		}
	});


	$("body").unbind("click.wliu-dropdown").bind("click.wliu-dropdown", function(evt){
		//console.log("body click: " + $(evt.target).hasAttr("wliu-dropdown") + " : " + $(evt.target).parents("[wliu-dropdown]").length);
		if( !$(evt.target).hasAttr("wliu-dropdown") && $(evt.target).parents("[wliu-dropdown]").length <= 0 ) {
			$("div[wliu-dropdown][active]").removeAttr("active");
		}
	});
});
