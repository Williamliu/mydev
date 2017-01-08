/************************************************************************************/
/*  JQuery Plugin Resize Advanced Table                     		                */
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-4-12      															*/
/*  Files: 	jquery.lwh.advtable.js ;  jquery.lwh.advtable.css						*/
/************************************************************************************/

/***************************************************************************************************
    Resizable Table: works perfectly in all browsers,  table can be dragged to extend  with scrollbar perfectly.
	Author:	William Liu  
	Date: 	2012-Jan  
	Table class must be set to "lwhTable"
	Header column class: automaticly select  the first row as header.  whatever th or td 
							"show-hide		- Allow to show / hide for the column;
							"hidden" 		- if allow show/hide,  this value will set column hidden. 
							"nowrap" 		- the header always nowrap, "nowrap" will set content white-space nowrap. 
							"resizable"			- column width is resizable , allow to resize; will apply to whole cols.
	content class:  "fullsize" -  element will full width and height with the cell width and height when initialize and resize.
	for example:     <textarea class="fullsize"></textarea>  <div class="fullsize"></div>
	
Sample:
*****************************************************************************************************/
// table attribute:			sort="fieldname" sq="asc|desc"  - current sort value
// header column class:  	"nowrap", "hidden", "show-hide", "resizable" 
// header column attribute: "sort="fieldname"  defsq="asc|desc"

var lwhTable_tables 	 = [];
$.fn.extend({ 
	lwhTable:function(opts) {
				var def_settings = {
						memWidth:				true,
						memSNH:					true,
						memHide:				true,
						memWrap:				true,
						memFix:					true,
						memHeight:				true,
						rowResize:				false,
						headMenu:				true,
						
						widthCols:				[], 
						snhCols:				[],	 // which cols allow to show/hide,  this is high priority than hideCols
						hideCols:				[], // initialize which col set to hide
						wrapCols:				[], // initialize which col set to hide
						resizeCols:				[],
						
						rowMax:					800,
						rowMin:					5,
						colMax:					800,
						colMin:					5,
						zIndex:					900,
						
						init: 					null,  // param: theTable
						col_start: 				null,  // param: theTable, theCols(vertical cols), sn (col sn) 
						col_end:				null,  
						row_start:				null,  // param: theTable, theCols(horizon cols), sn  (tr sn)
						row_end:				null,
						col_show:				null,  // param: theTable, theCols(vertical cols), sn (col sn) 
						col_hide:				null,
						
						menu_open:				null,  // param: theTable. theCol, sn
						sortBY:					"",
						sortSQ:					"",
						col_sort:				null	// param: sort, sq 
					};
				$.extend(def_settings, opts);
				//if table is invisible,  table, th, td width will return 0;  initialization will be a big problem;
				if($("#lwhTable_pool").length <= 0) $("body").append('<div id="lwhTable_pool" style="position:absolute; top:-2000px; left:-2000px; padding:0px; margin:0px; display:block"></div>');

				this.each( function(idx0, el0) {	
					// move table to a visible div ,  prevent all width = 0  if invisible. 	
					var theTable 	= $(el0);
					theTable.data("default_settings", def_settings);
					var theParent 	= theTable.parent();
					$("#lwhTable_pool").append(theTable);
					
					//Wrap table with the container, move table margin to container,  padding set to 0,  make div tightly wrap up the table.
					var theCon	= theTable.wrap('<div class="lwhTable-container"></div>').parent();
					theCon.css({
						"marginLeft": 	theTable.css("marginLeft"),
						"marginRight": 	theTable.css("marginRight"),
						"marginTop": 	theTable.css("marginTop"),
						"marginBottom": theTable.css("marginBottom"),
						"padding":		0,
						"zIndex":		def_settings.zIndex + 1
					});
					theTable.css({
						"margin": 	0,
						"padding": 	0,
						"zIndex":	def_settings.zIndex
					});
					
					var theTable_cellspacing = parseInt(theTable.attr("cellspacing")) || 0;
					
					if( theTable.attr("id") == "" ) {
						theTable.attr("id", "lwhTable_" + $(".lwhTable").length);
					}
					
					// deal with sort
					var sortBY = def_settings.sortBY || theTable.attr("sort");
					var sortSQ = def_settings.sortSQ || theTable.attr("sq").toLowerCase();
					theTable.attr("sort",sortBY).attr("sq",sortSQ);
					
					
					// initialize
					var widthCols 	= [];
					var snhCols		= [];
					var hideCols 	= [];
					var wrapCols	= [];
					var resizeCols		= [];
					var heightRows	= [];
					
					// initialize table array
					if(!$.isArray(lwhTable_tables[theTable.attr("id")])) lwhTable_tables[theTable.attr("id")] = [];
				
					// initialize widthCols
					if(def_settings.widthCols.length > 0) { 
						widthCols = def_settings.widthCols;
						lwhTable_tables[theTable.attr("id")]["widthCols"] = def_settings.widthCols;
					} else {
						if( def_settings.memWidth ) {
							widthCols = lwhTable_tables[theTable.attr("id")]["widthCols"] || [];
						}
					}
					
					// initialize snhCols
					if(def_settings.snhCols.length > 0) { 
						snhCols = def_settings.snhCols;
						lwhTable_tables[theTable.attr("id")]["snhCols"] = def_settings.snhCols;
					} else {
						if( def_settings.memSNH ) {
							snhCols = lwhTable_tables[theTable.attr("id")]["snhCols"] || [];
						}
					}

					// initialize hideCols
					if(def_settings.hideCols.length > 0) { 
						hideCols = def_settings.hideCols;
						lwhTable_tables[theTable.attr("id")]["hideCols"] = def_settings.hideCols;
					} else {
						if( def_settings.memHide ) {
							hideCols = lwhTable_tables[theTable.attr("id")]["hideCols"] || [];
						}
					}

					// initialize wrapCols
					if(def_settings.wrapCols.length > 0) { 
						wrapCols = def_settings.wrapCols;
						lwhTable_tables[theTable.attr("id")]["wrapCols"] = def_settings.wrapCols;
					} else {
						if( def_settings.memWrap ) {
							wrapCols = lwhTable_tables[theTable.attr("id")]["wrapCols"] || [];
						}
					}

					// initialize resizeCols
					if(def_settings.resizeCols.length > 0) { 
						resizeCols = def_settings.resizeCols;
						lwhTable_tables[theTable.attr("id")]["resizeCols"] = def_settings.resizeCols;
					} else {
						if( def_settings.memFix ) {
							resizeCols = lwhTable_tables[theTable.attr("id")]["resizeCols"] || [];
						}
					}

					if( def_settings.memHeight ) {
						heightRows = lwhTable_tables[theTable.attr("id")]["heightRows"] || [];
					}
					
					// initialize table header 
					var header_widths 	= [];
					var tHeader = theTable.find(">thead>tr>th,>thead>tr>td");	//if table headers are specified in its semantically correct tag, are obtained
					if( !tHeader.length ) tHeader = theTable.find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td");	 //but headers can also be included in different ways
					tHeader.each( function(idx1, el1){	  //iterate through the table column headers	
						//create a resizer for a header column 
						var el_ww = 0;
						if(widthCols && widthCols[idx1]) {
							el_ww = widthCols[idx1];
						} else {
							el_ww = $(el1).width()?$(el1).width():parseInt($(el1).attr("width"));
						}
						header_widths[idx1] = el_ww;
						$(el1).width(el_ww).attr("width",el_ww).addClass("header").attr("align","center").attr("sn", idx1).attr("colsn", idx1).attr("curww", el_ww);
						// after set width, save outerWidth to attr outww for resize  remember
						$(el1).attr("outww", $(el1).outerWidth());
						
						// sortable column add icon
						if( $(el1).attr("sort") ) {
							if( theTable.attr("sort") == $(el1).attr("sort") ) {
								$(el1).append('<a sn="' + idx1 + '" sort="' + $(el1).attr("sort") + '" defsq="' + $(el1).attr("defsq").toLowerCase() + '" class="lwhTable-sortable lwhTable-sortable-' + theTable.attr("sq").toLowerCase() + '"></a>');
							} else {
								$(el1).append('<a sn="' + idx1 + '" sort="' + $(el1).attr("sort") + '" defsq="' + $(el1).attr("defsq").toLowerCase() + '" class="lwhTable-sortable"></a>');
							}
						}
						
						// all header should be nowrap for white space
						$(el1).html('<div class="nowrap" style="width:' + el_ww + 'px;">' + $(el1).html() + '</div>');									
					
						//create border - resizer
						var theBorder = $( theCon.append('<div class="lwhTable-border" sn="' + idx1 + '"><div class="lwhTable-border-resizer"></div></div>')[0].lastChild);
						theBorder.width( theBorder.width() + theTable_cellspacing ); //.css("zIndex", def_settings.zIndex + 2);
						
						//col hide/show
						if( (snhCols && snhCols[idx1] == 1) || $(el1).hasClass("show-hide") ) {
							snhCols[idx1] = 1;
							$(el1).addClass("show-hide");
							if( (hideCols && hideCols[idx1] == 1) || $(el1).hasClass("hidden") ) {
									hideCols[idx1] = 1;
									$(el1).addClass("hidden").wrap('<div class="col-hidden" colsn="' + idx1 + '"></div>');
									theBorder.addClass("lwhTable-border-hidden");
							} else {
									$(el1).removeClass("hidden");
							}
						} else {
							$(el1).removeClass("show-hide hidden");
						}
						
						// wrap col
						if( (wrapCols && wrapCols[idx1] == 1) || $(el1).hasClass("nowrap") ) {
							wrapCols[idx1] = 1;
							$(el1).addClass("nowrap");
						}
						
						// resizable width col
						if( (resizeCols && resizeCols[idx1] == 1) || $(el1).hasClass("resizable") ) {
							resizeCols[idx1] = 1;
							$(el1).addClass("resizable");
							theBorder.addClass("lwhTable-border-resizable");
						}

						// mousedown on border - resizer
						if( resizeCols && resizeCols[idx1]==1 ) {
							theBorder.bind("mousedown.lwhTable", {"theTable": theTable, "theBorder": theBorder}, $.lwhTable_border_mousedown);
						}
						
						// synchorize fullsize element width and height
						$(".fullsize", el1).width( $(el1).width() - 2).height( $(el1).height() - 2);
					});
					
					// handle nowrap, show-hide, hidden, resizable cols   not include headers
					$("tr", theTable).not(":first").each( function(idx1, el1) {
							// deal with  Row Resizer
							$(el1).attr("sn", idx1);
							var tr_height = $(el1).height();
							if( def_settings.rowResize ) {
								$(el1).addClass("rowResize");
								if(heightRows && heightRows[idx1]) {
									$(el1).height(heightRows[idx1]).attr("height", heightRows[idx1]);
								} 
								var theHorizon = $( theCon.append('<div class="lwhTable-horizon" sn="' + idx1 + '"><div class="lwhTable-horizon-resizer"></div></div>')[0].lastChild);
								theHorizon.height( theHorizon.height() + theTable_cellspacing ); //.css("zIndex", def_settings.zIndex + 2);
								theHorizon.bind("mousedown.lwhTable", {"theTable": theTable, "theHorizon": theHorizon}, $.lwhTable_horizon_mousedown);
							}
							// end of row resizer
							
							// scan the td  under the tr
							$("th, td", el1).each( function(idx2, el2) {
									$(el2).removeAttr('width').css("width",null).attr("colsn", idx2);
									var col_width = header_widths[idx2]; 
									
									//content td hide
									if( snhCols && snhCols[idx2] == 1 && hideCols && hideCols[idx2] == 1) {
										$(el2).addClass("hidden").wrap('<div class="col-hidden" colsn="' + idx2 + '"></div>');
									} else {
										$(el2).removeClass("hidden");
									}
									
									//content td wrap
									if(wrapCols && wrapCols[idx2] == 1) {
										if( $(el1).attr("height") ) {
											$(el2).html('<div class="nowrap" style="width:' + col_width + 'px; height:' + $(el1).attr("height") + 'px;">' + $(el2).html() + '</div>');									
										} else {
											$(el2).html('<div class="nowrap" style="width:' + col_width + 'px;">' + $(el2).html() + '</div>');									
										}
									}
									
									if( resizeCols && resizeCols[idx2]==1 ) {
											$(el2).addClass("resizable");
									}
									
									// synchorize fullsize element width and height
									$(".fullwidth", el2).not(":input").width( $(el2).width() -2);
									$(".fullheight", el2).not(":input").height( tr_height -2);
									
									$(":input.fullwidth", el2).width( $(el2).width() - 2 );
									$(":input.fullheight", el2).height( tr_height - 8 );
									$(".fullsize", el2).not(":input").width( $(el2).width() ).height( tr_height );
									$(":input.fullsize", el2).width( $(el2).width() - 2).height( tr_height - 8);
							});
							tr_height = $(el1).height();
							$("th, td", el1).each( function(idx2, el2) {
									$(".fullsize", el2).not(":input").width( $(el2).width() ).height( tr_height );
									$(":input.fullsize", el2).width( $(el2).width() - 2).height( tr_height - 8);
							});	
					});
					// end of  handle content cols

					$("tr[sn]:even", theTable).addClass("lwhTable-even");
					$("tr[sn]:odd", theTable).addClass("lwhTable-odd");

					//Header Menu Event;
					if( def_settings.headMenu ) {
							//right click to show menu
							$(document).unbind("contextmenu.lwhTable").bind("contextmenu.lwhTable",function(){ 
								return false; 
							});

							tHeader.unbind("mousedown.lwhTable").bind("mousedown.lwhTable", function(ev){
								$.lwhTable_headmenu_hide();
								//$(".lwhTable-headmenu:visible").lwhTable_headmenu_hide();
								switch(ev.button) {
									case 2: //right click in fireforx, chrome, opera, safari       right click IE:
											$.lwhTable_headmenu_show(theTable.attr("id"), tHeader, $(this), $(this).attr("sn"), ev);
											break;
								}
							}); // end of mousedown
					}
					
					//Add listener to  Sortable Icon  on  header cols.
					$("a.lwhTable-sortable",$("tr:first",theTable)).unbind("click.lwhTable").bind("click.lwhTable", function(ev) {
							var menu_sn 	= $(this).attr("sn");
							var menu_sort	= $(this).attr("sort");
							var menu_defsq	= $(this).attr("defsq").toLowerCase();
							var tab_sort	= theTable.attr("sort");
							var tab_sq		= theTable.attr("sq").toLowerCase();
							if( menu_sort == tab_sort ) {
								if( tab_sq == "asc" ) 
									theTable.attr("sq", "desc");
								else 
									theTable.attr("sq", "asc");
							} else {
								theTable.attr("sort", menu_sort).attr("sq", menu_defsq);
							}
							
							if(def_settings.col_sort && $.isFunction(def_settings.col_sort) ) def_settings.col_sort(theTable.attr("sort"),theTable.attr("sq").toLowerCase());
							
							$("a.lwhTable-sortable", tHeader).removeClass("lwhTable-sortable-asc lwhTable-sortable-desc");
							$(this).addClass("lwhTable-sortable-" + theTable.attr("sq").toLowerCase());
					});
					
					
					//border resizer problem on Chrome
					theTable.css("width", null).removeAttr("width");
					theParent.append(theCon);
					$.lwhTable_syncBorders(theTable);
					//$.lwhTable_syncBorders(theTable);
					if( def_settings.init && $.isFunction(def_settings.init) ) def_settings.init(theTable);
				});
				$("#lwhTable_pool").remove();
	},

	lwhTable_hide: function(sn) {
		this.each( function(idx0, el0) {
				var tHeader = $("th[sn='" + sn + "'], td[sn='" + sn + "']", el0);
				if( tHeader.hasClass("show-hide") == true ) {
						if( tHeader.hasClass("hidden") == false ) {
							var def_settings 	= $(el0).data("default_settings");
							var theCols			= $("th[colsn='" + sn + "'], td[colsn='" + sn + "']", el0);
							if( def_settings.col_hide && $.isFunction(def_settings.col_hide) ) def_settings.col_hide(el0, theCols, sn);
							
							var theCon = $(el0).parent();
							theCols.addClass("hidden").wrap('<div class="col-hidden" colsn="' + sn + '"></div>');
							$(".lwhTable-border[sn='" + sn + "']",  theCon).addClass("lwhTable-border-hidden");
							
							$.lwhTable_syncBorders($(el0));
						}
				}
		});
	},
	
	lwhTable_show: function(sn) {
		this.each( function(idx0, el0) {
				var tHeader = $("th[sn='" + sn + "'], td[sn='" + sn + "']", el0);
				if( tHeader.hasClass("show-hide") == true ) {
						if( tHeader.hasClass("hidden") == true ) {
								var def_settings 	= $(el0).data("default_settings");
								var theCols			= $("th[colsn='" + sn + "'], td[colsn='" + sn + "']", el0);
								if( def_settings.col_show && $.isFunction(def_settings.col_show) ) def_settings.col_show(el0, theCols, sn);
								
								var theCon = $(el0).parent();
								theCon.width(theCon.width() + parseInt(tHeader.attr("outww")));
								
								theCols.removeClass("hidden").unwrap();
								$(".lwhTable-border[sn='" + sn + "']",  theCon).removeClass("lwhTable-border-hidden");
								
								$.lwhTable_syncBorders($(el0));
						}
				}
		});
	},
	
	lwhTable_getWidths: function() {
		var widthCols 	= [];
		this.each( function(idx0, el0) {
				$("th[sn], td[sn]", el0).each( function(idx1, el1) {
						if( $(el1).hasClass("show-hide") == true ) {
								if( $(el1).hasClass("hidden") == true ) {
									widthCols[idx1]	= $(el1).attr("curww");
								} else {
									widthCols[idx1]	= $(el1).width();
								}
						} else {
							widthCols[idx1]	= $(el1).width();
						}
				});
		});
		return widthCols;
	},
	
	lwhTable_destory: function() {
        return this.each( function(idx0, el0) {				
			var theCon = $(el0).parent();
			$(el0).css({
				"marginLeft": 	theCon.css("marginLeft"),
				"marginRight": 	theCon.css("marginRight"),
				"marginTop": 	theCon.css("marginTop"),
				"marginBottom": theCon.css("marginBottom")
			});
			$("tr", el0).removeAttr("height").css("height",null).removeClass("rowResize lwhTable-even lwhTable-odd");
			$("td, th", el0).each(function(idx1, el1){
				if( $(el1).has("div.nowrap").length > 0 ) $(el1).html( $("div.nowrap", el1).html() );
				$(el1).removeAttr("sn").removeAttr("colsn").removeAttr("curww").removeAttr("outww").removeClass("show-hide hidden nowrap resizable");
				$(".lwhTable-sortable", el1).remove();
				if( $(el1).parent(".col-hidden").length > 0 ) $(el1).unwrap();
			});
			$(".lwhTable-border", theCon).remove();
			$(".lwhTable-horizon", theCon).remove();
			
			$(el0).unwrap();
		});
	}
});

$.extend({
	lwhTable_headmenu_show: function(theTable_id, tHeader, theCol, sn, ev) {
		 		var theTable = $("#" + theTable_id);

				var def_settings = $(theTable).data("default_settings");
				//Dynamic to create menu 
				var sort_menu 	= '';
				var snh_menu 	= '';
				tHeader.each( function(idx1, el1){	 
						var header_name = $.trim($(el1).text());
						// create Sort By
						if( $(el1).attr("sort") ) {
							if( theTable.attr("sort") == $(el1).attr("sort") ) {
								sort_menu += '<li class="lwhTable-sort lwhTable-sort-selected" sn="' + idx1 + '" sort="' + $(el1).attr("sort") + '" defsq="' + $(el1).attr("defsq").toLowerCase() + '">' + header_name + '<s class="lwhTable-middle"></s><a class="lwhTable-sort-icon lwhTable-sort-' + theTable.attr("sq").toLowerCase() + '"></a></li>';
							} else {
								sort_menu += '<li class="lwhTable-sort" sn="' + idx1 + '" sort="' + $(el1).attr("sort") + '" defsq="' + $(el1).attr("defsq").toLowerCase() + '">' + header_name + '<s class="lwhTable-middle"></s><a class="lwhTable-sort-icon"></a></li>';
							}
						}
						// create Show|Hide
						if( $(el1).hasClass("show-hide") ) {
							if( $(el1).hasClass("hidden") ) {
									snh_menu += '<li class="lwhTable-snh lwhTable-colhidden" sn="' + idx1 + '">' + header_name + '</li>';
							} else {
									snh_menu += '<li class="lwhTable-snh" sn="' + idx1 + '">' + header_name + '</li>';
							}
						}
				});
				// combine menu of "Sort By" and "Show|Hide"
				if(sort_menu != '') sort_menu = '<li class="title">Sort By:</li>' + sort_menu;
				if(snh_menu != '') {
					if(sort_menu != '') 
						snh_menu = '<li class="title separator">Show|Hide:</li>' + snh_menu;
					else 
						snh_menu = '<li class="title">Show|Hide:</li>' + snh_menu;
				} 
				var header_menu = sort_menu + snh_menu;

				if(header_menu != '') {
							var menu_id = 'lwhTable-headmenu-' + theTable.attr("id");
							header_menu = '<ul class="lwhTable-headmenu" id="' + menu_id + '" style="z-index:' + (def_settings.zIndex + 1) + ';">' + header_menu + '</ul>';
							$("body").append(header_menu);
							var menuObj = $("#" + menu_id);
			
							
							$(".lwhTable-sort", menuObj).die("click.lwhTable_sort").live("click.lwhTable_sort", function() {
									var menu_sn 	= $(this).attr("sn");
									var menu_sort	= $(this).attr("sort");
									var menu_defsq	= $(this).attr("defsq").toLowerCase();
									var tab_sort	= theTable.attr("sort");
									var tab_sq		= theTable.attr("sq").toLowerCase();
									if( menu_sort == tab_sort ) {
										if( tab_sq == "asc" ) 
											theTable.attr("sq", "desc");
										else 
											theTable.attr("sq", "asc");
									} else {
										theTable.attr("sort", menu_sort).attr("sq", menu_defsq);
									}
									
									$(".lwhTable-sort", menuObj).removeClass("lwhTable-sort-selected");
									$(".lwhTable-sort-icon",menuObj).removeClass("lwhTable-sort-asc lwhTable-sort-desc");
									$(this).addClass("lwhTable-sort-selected");
									$(".lwhTable-sort-icon",this).addClass("lwhTable-sort-" + theTable.attr("sq").toLowerCase());
									
									if(def_settings.col_sort && $.isFunction(def_settings.col_sort) ) def_settings.col_sort(theTable.attr("sort"),theTable.attr("sq").toLowerCase());
									
									$("a.lwhTable-sortable", tHeader).removeClass("lwhTable-sortable-asc lwhTable-sortable-desc");
									$("a.lwhTable-sortable[sn='" + menu_sn + "']", tHeader).addClass("lwhTable-sortable-" + theTable.attr("sq").toLowerCase());
							});
			
				
							$(".lwhTable-snh", menuObj).die("click.lwhTable_snh").live("click.lwhTable_snh", function() {
									var menu_sn = $(this).attr("sn");
									//alert("menu_sn:" + menu_sn);
									if( $(this).hasClass("lwhTable-colhidden") ) {
										$("#" + theTable_id).lwhTable_show(menu_sn);
										$(this).removeClass("lwhTable-colhidden");
									} else {
										$("#" + theTable_id).lwhTable_hide(menu_sn);
										$(this).addClass("lwhTable-colhidden");
									}
							});

				}

				
				var el_pos = $.lwhTable_getELpos(menuObj, ev);
				$(menuObj).css({
					left: 	el_pos.left,
					top:	el_pos.top
				});
				
				
				$(menuObj).show();
				var menu_open 	= def_settings.menu_open;
				if( menu_open && $.isFunction(menu_open) ) menu_open(theTable, theCol, sn);
				$(document).unbind("click.lwhTable").bind("click.lwhTable", function(ev) {
	 				var tt = ev.target || ev.srcElement;
					if( $(tt).parent(".lwhTable-headmenu").length <= 0 ) {
						$.lwhTable_headmenu_hide();
					}
				});
	},

	lwhTable_headmenu_hide: function() {
				$(".lwhTable-headmenu").remove();	
				$(document).unbind("click.lwhTable");
	},

	lwhTable_syncBorders: function( theTable ) {
		var def_settings = theTable.data("default_settings");
		var theCon 	= theTable.parent();
		var tid = theTable.attr("id");
		
		var widthCols 	= [];
		var snhCols		= [];
		var hideCols 	= [];
		var wrapCols	= [];
		var resizeCols		= [];
		var heightRows	= [];
		
		theCon.width(theTable.outerWidth()).height(theTable.outerHeight());
		
		$("th[sn], td[sn]", theTable).each( function(idx1, el1) {
			if( $(el1).hasClass("show-hide") == true ) {
				snhCols[idx1] 	= 1;
			}
			
			if( $(el1).hasClass("hidden") == true ) {
				hideCols[idx1] 	= 1;
				widthCols[idx1]	= $(el1).attr("curww");
			} else {
				hideCols[idx1] = 0;
				widthCols[idx1]	= $(el1).width();
				var theBorder_left 		= $(el1).position().left + $(el1).outerWidth();
				$(".lwhTable-border[sn='" + $(el1).attr("sn") + "']", theCon).css("left", theBorder_left);
			}
			
			if( $(el1).hasClass("nowrap") ) {
				wrapCols[idx1] 	= 1;
			}

			if( $(el1).hasClass("resizable") ) {
				resizeCols[idx1] 	= 1;
			}
			
		});
		

		if( def_settings.rowResize ) {
			$("tr", theTable).not(":first").each(function(idx1, el1) {
				var theHorizon_top = $(el1).position().top + $(el1).outerHeight();
				$(".lwhTable-horizon[sn='" +  $(el1).attr("sn") + "']", theCon).css("top", theHorizon_top);
				heightRows[$(el1).attr("sn")] = $(el1).attr("height"); 
			});
		}
		
		if( !$.isArray(lwhTable_tables[tid]) ) {
			lwhTable_tables[tid] = [];
		}
		lwhTable_tables[tid]["widthCols"] 	= widthCols;
		lwhTable_tables[tid]["snhCols"] 	= snhCols;
		lwhTable_tables[tid]["hideCols"] 	= hideCols;
		lwhTable_tables[tid]["wrapCols"] 	= wrapCols;
		lwhTable_tables[tid]["resizeCols"] 	= resizeCols;
		lwhTable_tables[tid]["heightRows"] 	= heightRows;
	},

	lwhTable_syncCols: function(theTable, theBorder, drag_length) {
		var def_settings = theTable.data("default_settings");
		var theTable_cellpadding = parseInt(theTable.attr("cellpadding")) || 0;
		
		var theHead 	= $("th[sn='" + theBorder.attr("sn") + "'], td[sn='" + theBorder.attr("sn") + "']", theTable);		
		var head_newWW	= theHead.width() + drag_length;
		var maxWW 		= parseInt(def_settings.colMax);
		var minWW		= parseInt(def_settings.colMin);
		
		head_newWW = Math.max(minWW, Math.min(maxWW, head_newWW));
		
		theTable.parent().width( theTable.outerWidth()  + drag_length );
		
		
		$("div.nowrap", theHead).width(head_newWW);
		$("th[colsn='" + theBorder.attr("sn") + "'], td[colsn='" + theBorder.attr("sn") + "']", theTable).not(theHead).each( function(idx1, el1) {
				$("div.nowrap", el1).width(head_newWW);
		});
		
		theHead.width(head_newWW).attr("width",head_newWW).attr("curww", head_newWW);
		
		// reset to actual width
		$("div.nowrap", theHead).width(theHead.width());
		theHead.width(theHead.width()).attr("width",theHead.width()).attr("curww", theHead.width()).attr("outww", theHead.outerWidth());
		
		$.lwhTable_syncBorders(theTable);
	},

	lwhTable_syncRows: function(theTable, theHorizon, move_length) {
		var def_settings = theTable.data("default_settings");
		var theTable_cellpadding = parseInt(theTable.attr("cellpadding")) || 0;
		
		var theRow 		= $("tr[sn='" + theHorizon.attr("sn") + "']", theTable);		
		var row_newHH	= theRow.height() + move_length;
		var maxHH 		= parseInt(def_settings.rowMax);
		var minHH		= parseInt(def_settings.rowMin);
		
		row_newHH = Math.max(minHH, Math.min(maxHH, row_newHH));
		
		theTable.parent().height( theTable.outerHeight()  + move_length );
		
		
		$("th,td", theRow).each( function(idx1, el1) {
				$("div.nowrap", el1).height(row_newHH);
		});
		
		
		theRow.height(row_newHH).attr("height", row_newHH);
		
		// reset to actual width
		theRow.height(theRow.height()).attr("height",theRow.height());
		var row_newHH = theRow.height();
		$("th,td", theRow).each( function(idx1, el1) {
				$("div.nowrap", el1).height(row_newHH);
		});
		
		$.lwhTable_syncBorders(theTable);
	},

	// the column border mousedown
	lwhTable_border_mousedown: function(ev) {
		var def_settings 	= ev.data.theTable.data("default_settings");
		var theCols			= $("th[colsn='" + ev.data.theBorder.attr("sn") + "'], td[colsn='" + ev.data.theBorder.attr("sn") + "']", ev.data.theTable);
		if( def_settings.col_start && $.isFunction(def_settings.col_start) ) def_settings.col_start(ev.data.theTable, theCols, ev.data.theBorder.attr("sn"));
		
		// start to drag,  change cursor to resize on all element;
		$("head").append('<style type="text/css">*{cursor:e-resize;!important}</style>'); 
		$(".lwhTable-border-resizer",ev.data.theBorder).addClass("lwhTable-border-resizer-show");
		var start_obj = {};
		start_obj.mouseX = ev.pageX;
		start_obj.bdLeft = ev.data.theBorder.position().left;
		
		$(document).unbind("mousemove.lwhTable").bind("mousemove.lwhTable",{"theTable": ev.data.theTable, "theBorder": ev.data.theBorder, "sObj": start_obj}, $.lwhTable_onDragging).unbind("mouseup.lwhTable").bind("mouseup.lwhTable",{"theTable": ev.data.theTable, "theBorder": ev.data.theBorder, "sObj": start_obj},$.lwhTable_onDragOver);
		
		ev.stopPropagation();
		return false;
	},

	// the row border mousedown
	lwhTable_horizon_mousedown: function(ev) {
		var def_settings = ev.data.theTable.data("default_settings");
		var theCols			= $("th,td",$("tr[sn='" + ev.data.theHorizon.attr("sn") + "']", ev.data.theTable));
		if( def_settings.row_start && $.isFunction(def_settings.row_start) ) def_settings.row_start(ev.data.theTable, theCols, ev.data.theHorizon.attr("sn"));
		
		// start to drag,  change cursor to resize on all element;
		$("head").append('<style type="text/css">*{cursor:s-resize;!important}</style>'); 
		$(".lwhTable-horizon-resizer", ev.data.theHorizon).addClass("lwhTable-horizon-resizer-show");
		var start_obj = {};
		start_obj.mouseY = ev.pageY;
		start_obj.bdTop = ev.data.theHorizon.position().top;
		
		$(document).unbind("mousemove.lwhTable").bind("mousemove.lwhTable",{"theTable": ev.data.theTable, "theHorizon": ev.data.theHorizon, "sObj": start_obj}, $.lwhTable_onMoving).unbind("mouseup.lwhTable").bind("mouseup.lwhTable",{"theTable": ev.data.theTable, "theHorizon": ev.data.theHorizon, "sObj": start_obj},$.lwhTable_onMoveOver);
		
		ev.stopPropagation();
		return false;
	},

	lwhTable_onDragging: function(ev) {
		var theTable 	= ev.data.theTable;
		var drag_length	= ev.pageX - ev.data.sObj.mouseX;
		var new_left	= ev.data.sObj.bdLeft + drag_length;
		var start_obj 			= ev.data.sObj;
		start_obj.dragLength 	= drag_length;
		ev.data.theBorder.css("left", new_left);
		
		ev.stopPropagation();
		return false;
	},
	
	lwhTable_onDragOver: function(ev) {
		$(document).unbind('mousemove.lwhTable').unbind('mouseup.lwhTable');
		$("head :last-child").remove(); 				//remove the dragging cursor style	
		$(".lwhTable-border-resizer", ev.data.theBorder).removeClass("lwhTable-border-resizer-show");
		if(ev.data.sObj.dragLength) {
			$.lwhTable_syncCols(ev.data.theTable, ev.data.theBorder, parseInt(ev.data.sObj.dragLength));
		}
		
		var def_settings = ev.data.theTable.data("default_settings");
		var theCols			= $("th[colsn='" + ev.data.theBorder.attr("sn") + "'], td[colsn='" + ev.data.theBorder.attr("sn") + "']", ev.data.theTable);
		// deal with  ".fullsize" and "resize"
		
		theCols.each(function(idx1,el1) {
				$(".fullwidth", el1).not(":input").width( $(el1).width() -2);
				$(".fullheight", el1).not(":input").height( $(el1).height() -2);
				
				$(":input.fullwidth", el1).width( $(el1).width() - 2 );
				$(":input.fullheight", el1).height( $(el1).height() - 2 );
				
				$(".fullsize", el1).not(":input").width( $(el1).width() ).height( $(el1).height() );
				$(":input.fullsize", el1).width( $(el1).width() - 2).height( $(el1).height() - 2);
		});

		if(def_settings.col_end && $.isFunction(def_settings.col_end)) def_settings.col_end(ev.data.theTable, theCols, ev.data.theBorder.attr("sn"));
		ev.stopPropagation();
		return false
	},


	lwhTable_onMoving: function(ev) {
		var theTable 	= ev.data.theTable;
		var move_length	= ev.pageY - ev.data.sObj.mouseY;
		var new_top		= ev.data.sObj.bdTop + move_length;
		var start_obj 			= ev.data.sObj;
		start_obj.moveLength 	= move_length;
		ev.data.theHorizon.css("top", new_top);
		
		ev.stopPropagation();
		return false;
	},
	
	lwhTable_onMoveOver: function(ev) {
		$(document).unbind('mousemove.lwhTable').unbind('mouseup.lwhTable');
		$("head :last-child").remove(); 				//remove the dragging cursor style	
		$(".lwhTable-horizon-resizer",ev.data.theHorizon).removeClass("lwhTable-horizon-resizer-show");
		if(ev.data.sObj.moveLength) {
			$.lwhTable_syncRows(ev.data.theTable, ev.data.theHorizon, parseInt(ev.data.sObj.moveLength));
		}
		
		var def_settings	= ev.data.theTable.data("default_settings");
		var theCols			= $("th,td",$("tr[sn='" + ev.data.theHorizon.attr("sn") + "']", ev.data.theTable));
		
		theCols.each(function(idx1,el1) {
				$(".fullwidth", el1).not(":input").width( $(el1).width() -2);
				$(".fullheight", el1).not(":input").height( $(el1).height() -2);
				
				$(":input.fullwidth", el1).width( $(el1).width() - 2 );
				$(":input.fullheight", el1).height( $(el1).height() - 2);
				
				$(".fullsize", el1).not(":input").width( $(el1).width() ).height( $(el1).height() );
				$(":input.fullsize", el1).width( $(el1).width() - 2).height( $(el1).height() - 2);
		});
		
		if(def_settings.row_end && $.isFunction(def_settings.row_end)) def_settings.row_end(ev.data.theTable, theCols, ev.data.theHorizon.attr("sn"));
		
		ev.stopPropagation();
		return false
	},

	lwhTable_getELpos: function(el, ev) {
				var el_pos 		= {};
				el_pos.left 	= 0;
				el_pos.top 		= 0;
				var el_width 	= $(el).outerWidth();
				var el_height 	= $(el).outerHeight();
				el_pos.left =  ev.pageX - 1;
				el_pos.top 	=  ev.pageY - 1;
				if( el_width + el_pos.left > $(window).scrollLeft() + $(window).width() ) {
					el_pos.left = $(window).scrollLeft() + $(window).width() - el_width - 20;
				}
				if( el_height + el_pos.top > $(window).scrollTop() + $(window).height() ) {
					el_pos.top = $(window).scrollTop() + $(window).height() - el_height - 20;
				}
				return el_pos;
	}
});

