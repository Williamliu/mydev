/************************************************************************************/
/*  JQuery Plugin Resize Table                     		                        	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-2-15      															*/
/*  Files: 	jquery.lwh.table.js ;  jquery.lwh.table.css								*/
/************************************************************************************/

/***************************************************************************************************
    Resizable Table: works perfectly in all browsers,  table can be dragged to extend  with scrollbar perfectly.
	Author:	William Liu  
	Date: 	2012-Jan  
	
	Header column class:   automaticly select  the first row as header.  whatever th or td 
						"nowrap" 					- header text nowrap;  
						attr: width / css: width 	- init width for header;
						"fixed"						- column width is fixed , not allow to resize; will apply to whole cols.
	
	Content column class:
						"nowrap" 					- content text nowrap;

	
Sample:
<table style="margin:10px;">
    	<tr>
        	<th width="80" class="nowrap">Column One</span></th>
        	<th>Column Two</th>
        	<th class="nowrap fixed" width="30">Column Three</th>
        	<th>Column Four</th>
    	</tr>
    	<tr>
        	<td class="nowrap">
            	content one onle with nowrap
            </td>
        	<td>
            	content two two, content text can be wrap automaticly.
            </td>
        	<td class="nowrap">693</td>
        	<td class="nowrap">
    			        Description Of Jobs
            </td>
        </tr>
</table>
$("table").lwhTable();
*****************************************************************************************************/

var lwhTable_GripDragObj = null;
var lwhTable_tables 	 = [];
$.fn.extend({ 
	lwhTable:function(opts) {
				var def_settings = {
						marginLeft: 	null,	
						marginRight: 	null, 
						liveDrag:    	false,
						resizeSafe:		true,
						initWidth:		[],
						borderColor:	"#555555",
						dragStart: 		null,
						dragEnd:		null
					};
				$.extend(def_settings, opts);
				
				var IE = $.browser.msie;
				var INT = parseInt;
				if($("#lwhTable_Container").length <= 0) $("body").append('<div id="lwhTable_Container" style="postion:absolute; top:-2000px; left:-2000px; padding:0px; margin:0px; display:block"></div>');
				
				this.each( function(idx0, el0) {	
					// move table to a visible div ,  prevent all width = 0  if invisible. 				
					var theParent = $(el0).parent();
					$("#lwhTable_Container").append( el0 );
					
					var theTable = $(el0);
					theTable.addClass("lwhTable").css("table-layout", "fixed");
					
					var tid = theTable.attr("id") || ("lwhTable-ID" + idx0);
					var gid = "lwhTable-Grips-" + tid;
					var cs = 0; //INT(theTable.attr("cellspacing"))	|| 0;
					var cp = 0; //INT(theTable.attr("cellpadding"))	|| 0;
					var br = 0; //INT(theTable.attr("border")) 		|| 0;
					
					theTable.data("tid", "#" + tid);
					theTable.data("gid", "#" + gid);
					theTable.data("cs", cs); 
					theTable.data("cp", cp);
					theTable.data("br", br);		
					theTable.data("liveDrag", 	def_settings.liveDrag);		
					theTable.data("resizeSafe", def_settings.resizeSafe);	
					theTable.data("default_settings",  def_settings);
					//alert(theTable.cs + ":" + theTable.cp + ":" + theTable.br);
					
					// remove margin-left, margin-right  from table,  then add them to wrap container 
					var ml 	= INT(theTable.css("margin-left")) 	 	|| 0;
					var mr 	= INT(theTable.css("margin-right")) 	|| 0;
					var mt 	= INT(theTable.css("margin-top")) 		|| 0;
					var mb 	= INT(theTable.css("margin-bottom")) 	|| 0;
					
					// reset table  margin=0px,  cellspacing=0px;  border=0px;
					theTable.css("margin", 0).css("border-padding",0).attr("cellpadding",0).css("border-spacing",0).attr("cellspacing",0).attr("border",0);
					theTable.attr("id", tid);
					
					//Add grips container outside of table, wrap up table
					theTable.wrap('<div id="' + gid + '" class="lwhTable-Grips"></div>');
					$( theTable.data("gid") ).css({
							"margin-left": 	ml,
							"margin-right": mr,
							"margin-bottom":mb,
							"margin-top": 	mt
					});
					// end of wrap container
					
					
					//initize table header width  if  initWidth provided , or  postback safe remember width of header
					var initWidth = [];
					if(def_settings.initWidth.length > 0) { 
						initWidth = def_settings.initWidth;
						lwhTable_tables[theTable.data("tid")] = def_settings.initWidth;
					} else {
						if( def_settings.resizeSafe ) {
							initWidth = lwhTable_tables[theTable.data("tid")];
						}
					}
					// end of header width  initilize.
					
					
					// create grips 
					var tHeader = theTable.find(">thead>tr>th,>thead>tr>td");	//if table headers are specified in its semantically correct tag, are obtained
					if( !tHeader.length ) tHeader = theTable.find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td");	 //but headers can also be included in different ways
					
					var header_widths 	= [];
					var table_ww		= 0;
					tHeader.each(function(idx0, el0){	//iterate through the table column headers	
						//create a grip for a header column for resizer
						var el_ww = 0;
						if(initWidth && initWidth[idx0]) {
							el_ww = initWidth[idx0];
						} else {
							el_ww = $(el0).width()?$(el0).width():parseInt($(el0).attr("width"));
						}
						$(el0).attr("sn", idx0).width( el_ww ).attr("width", el_ww);
						
						var col_sp = parseInt($(el0).css("border-left-width")) + parseInt($(el0).css("border-right-width")) + parseInt($(el0).css("padding-left")) + parseInt($(el0).css("padding-right"));
						table_ww += el_ww + col_sp;
						//alert("el ww:" + el_ww + " elwidth:" + $(el0).width());
						header_widths[idx0] = el_ww;
						
						// important: if resizable column, set grip  mousedown event.
						if( !$(el0).hasClass("fixed") ) {
								var tGrip = $( $(theTable.data("gid") ).append('<div class="lwhTable-Grips-Grip" sn="' + idx0 + '"><div class="lwhTable-Grips-Grip-Resizer" sn="' + idx0 + '"></div></div>')[0].lastChild );
								tGrip.data("tid" , theTable.data("tid") );
								tGrip.data("gid" , theTable.data("gid") );
								tGrip.data("sn" , idx0);
								tGrip.data("default_settings", 	theTable.data("default_settings") );
								tGrip.mousedown( $.lwhTable_GripMousedown );
						}
					});
					theTable.width(table_ww).attr("width", table_ww);
					
					// iterate  non header cols.
					theTable.find("td,th").not(tHeader).each(function(idx0, el0){  
						// remove all width in the style, or attribute width
						$(el0).removeAttr('width').css("width",null);	//the width attribute is removed from all table cells which are not nested in other tables and dont belong to the header
					});		
					
					// handle nowrap cols include headers
					$("tr", theTable).each( function(idx0, el0) {
							$("th, td", el0).each( function(idx1, el1) {
								$(el1).attr("colsn", idx1);
								//var col_width = $(el1).width() || parseInt($(el1).attr("width"));
								var col_width = header_widths[idx1]; 
								if( $(el1).hasClass("nowrap") ) {
									$(el1).html('<div class="nowrap" style="width:' + col_width + 'px;">' + $(el1).html() + '</div>');									
								}
							});
					});
					// reset grid container width , height same as table.
					$.lwhTable_syncGrips( theTable.data("tid") );
					theParent.append($(theTable.data("gid")));
		});
		$("#lwhTable_Container").remove();
	},

	lwhTable_colsWidth: function() {
        var lwhTable_tt = [];
		this.each( function(idx0, el0) {			
			var theTable = $(el0);
			var tid = "#" + theTable.attr("id") || ("lwhTable-ID" + idx0);
			lwhTable_tt = lwhTable_tables[tid];
		});
		return lwhTable_tt;
	},
	lwhTable_Destory: function() {
        return this.each( function(idx0, el0) {				
			$("div.lwhTable-Grips-Grip", $(el0).parent()).remove();
			$(el0).unwrap();
		});
	}
});

$.extend({
	lwhTable_syncGrips: function( tid ) {
		var tGrips 	= $( $(tid).data("gid") );
		tGrips.css({
			width:  $(tid).width(),
			height:	$(tid).height()
		});
		
		var tHeader = $(tid).find(">thead>tr>th,>thead>tr>td");	//if table headers are specified in its semantically correct tag, are obtained
		if( !tHeader.length ) tHeader = $(tid).find(">tbody>tr:first>th,>tr:first>th,>tbody>tr:first>td, >tr:first>td");	 //but headers can also be included in different ways
		var cols = [];
		tHeader.each(function(idx0, el0){	
			cols[idx0] = $(el0).width() || parseInt( $(el0).attr("width") );

			var col_sp = parseInt($(el0).css("border-left-width")) + parseInt($(el0).css("border-right-width")) + parseInt($(el0).css("padding-left")) + parseInt($(el0).css("padding-right"));
			col_outWW = parseInt($(el0).attr("width")) + col_sp;
			//alert("w1:" + col_outWW + "  out:" + $(el0).outerWidth() + " left:" + $(el0).position().left); 
			var out_ww = $(el0).outerWidth()?$(el0).outerWidth():col_outWW;
			var gLeft 	= $(el0).position().left + out_ww;
			var tGrip 	= $(".lwhTable-Grips-Grip[sn='" + idx0 + "']", tGrips);
			tGrip.css("left", gLeft);
			//alert("idx:" + idx0 + " left:" + $(el0).position().left + "  out_ww:" + out_ww + "  gridLeft:" + gLeft);
		});
		lwhTable_tables[tid] = cols;
		//$.showArr(lwhTable_tables[tid]);
	},

	lwhTable_syncCols: function(dragOver) {
		var theTable 	= $(lwhTable_GripDragObj.tid);
		var theHead		= $("th[sn='" + lwhTable_GripDragObj.sn + "'], td[sn='" + lwhTable_GripDragObj.sn + "']", theTable);
		var theCols		= $("th[colsn='" + lwhTable_GripDragObj.sn + "'], td[colsn='" + lwhTable_GripDragObj.sn + "']", theTable); 
		var told_ww		= theTable.width();
		var cold_ww 	= theHead.width();
		var cnew_ww 	= cold_ww + lwhTable_GripDragObj.inc;
		var maxWW 		= 2000;
		var minWW		= 5;
		cnew_ww 	= Math.max(minWW, Math.min(maxWW, cnew_ww));
		tnew_inc 	= cnew_ww - cold_ww;
		theTable.width( told_ww + tnew_inc);
		
		theCols.each( function(idx0, el0) {
			if( $(el0).hasClass("nowrap") ) {
				$("div.nowrap", el0).width(cnew_ww);
			}
		});
		
		theHead.width(cnew_ww);
	},
	
	// theGrip
	lwhTable_GripMousedown: function(ev) {
		var def_settings = $(this).data("default_settings");
		if(def_settings.dragStart) def_settings.dragStart();
		
		$("head").append('<style type="text/css">*{cursor:e-resize;!important}</style>'); 
		$(".lwhTable-Grips-Grip-Resizer" , this).addClass("lwhTable-Grips-Grip-Dragging");
		$(document).bind('mousemove.lwhTable', $.lwhTable_onDrag).bind('mouseup.lwhTable',$.lwhTable_onDragOver);
		var tGrip 	= {};
		tGrip.tid 	= $(this).data("tid");
		tGrip.gid 	= $(this).data("gid");
		tGrip.sn	= $(this).data("sn");	
		tGrip.ox	= ev.pageX;
		tGrip.lf 	= $(this).position().left;
		tGrip.default_settings = def_settings;
		//alert( $(this).position().left);
		lwhTable_GripDragObj = tGrip;
		ev.stopPropagation();
		return false;
	},
	
	lwhTable_onDrag: function(ev) {
		if(!lwhTable_GripDragObj)  return;
		var theTable 	= $(lwhTable_GripDragObj.tid);
		var inc 		= ev.pageX - lwhTable_GripDragObj.ox;
		var nw_lf		= inc + lwhTable_GripDragObj.lf;
		lwhTable_GripDragObj.inc 	= inc;
		
		var tGrip = $(".lwhTable-Grips-Grip[sn='" + lwhTable_GripDragObj.sn  + "']", $(lwhTable_GripDragObj.gid));
		tGrip.css("left", nw_lf);
		return false;
	},
	
	lwhTable_onDragOver: function(ev) {
		$(document).unbind('mousemove.lwhTable').unbind('mouseup.lwhTable');
		$("head :last-child").remove(); 				//remove the dragging cursor style	
		if(!lwhTable_GripDragObj) return;
		
		var tGrip = $(".lwhTable-Grips-Grip[sn='" + lwhTable_GripDragObj.sn  + "']", $(lwhTable_GripDragObj.gid), $(lwhTable_GripDragObj.tid) );
		$(".lwhTable-Grips-Grip-Resizer" , tGrip).removeClass("lwhTable-Grips-Grip-Dragging");
		
		if(lwhTable_GripDragObj.inc) {
			$.lwhTable_syncCols(true);
		} 
		$.lwhTable_syncGrips(lwhTable_GripDragObj.tid);
		
		var def_settings = lwhTable_GripDragObj.default_settings;
		if(def_settings.dragEnd) def_settings.dragEnd();
		
		lwhTable_GripDragObj = null;
		return false;	
	}
});