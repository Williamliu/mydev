var LWH = LWH || {};
LWH.ACCORD = function(opts) {
	this.htmlBox    = null;
	this.divBox 	= null;
	this.itemBox 	= null;
	this.nodeCookie = [];
	
	this.valObj		= {
		val: 		[],
		text: 		[]
	};
	
	this.syncObj    = {
		valObj: 	null,
		textObj: 	null
	};
	
	this.html		= {
		rows:		null
	};
	
	this.func		= {
		before:		null,
		after:		null,
		click:		null,
		clear:		null	
	};
	
	this.table = {
		head: {
			lang:  		DLang,	
			scope:		"",
			container:	"",
			trigger:	"",
			url:		"",

			match:		0,  // INNER JOIN
			header:		1,
			btnall: 	1,
			btnfind:	1,	
			multiple:	1,  // checkbox or radio
			single:		0,  // single open node  or multiple open node
			autohide:	0,
			
			ppshow:		0,
			mmshow:		0,
			cookie:		1,
			
			action: 	"view",
			loading: 	0,
			wait:		1,
			level:		0    // 1 - pptable;  2 - mmtable
		},
		schema: {
			table: {
				pptable: {
					/* 
					id:			"id",
					view: 		"product_category",
					cols:		[
						{name: "", 			colname:words["sn"], 		coltype:"rowno",		coldesc: 0 },
						{name: "title_en",  colname:words["title.en"], 	coltype:"text",			coldesc: 1, 	search:1, nl2br:1 },
						{name: "", 			colname:" - ", 				coltype:"seperator", 	on:"title_en" },
						{name: "title_cn", 	colname:words["title.cn"],	coltype:"text",			coldesc: 1,		search:1	},
						{name: "status", 	colname:words["status"],	coltype:"bool",			coldesc: 1,		search:1 },
						{name: "", 			colname:" {", 				coltype:"seperator" },
						{name: "", 			colname:words["length"],	coltype:"length",		coldesc: 1 },
						{name: "", 			colname:"人}", 				coltype:"seperator" },
						{name: "created_time", 	colname:words["created_time"],	coltype:"intdatetimehide",	coldesc: 1 }
					],
					orderBY: 	"product_category.title_en ASC",
					filter:	{
						status: 1
					}
					*/
				},
				mmtable: {
					/*
					id:			"id",
					view: 		"product_class",
					pref:		"ref_id",
					cols:		[
						{name: "", 			colname:words["sn"], 		coltype:"rowno",		coldesc: 0 },
						{name: "title_en",  colname:words["title.en"], 	coltype:"text",			coldesc: 1, 	search:1, nl2br:1 },
						{name: "", 			colname:" - ", 				coltype:"seperator", 	on:"title_en" },
						{name: "title_cn", 	colname:words["title.cn"],	coltype:"text",			coldesc: 1,		search:1	},
						{name: "status", 	colname:words["status"],	coltype:"bool",			coldesc: 1,		search:1 },
						{name: "", 			colname:" {", 				coltype:"seperator" },
						{name: "", 			colname:words["length"],	coltype:"length",		coldesc: 1 },
						{name: "", 			colname:"}", 				coltype:"seperator" },
						{name: "created_time", 	colname:words["created_time"],	coltype:"intdatetimehide",	coldesc: 1 }
					],
					orderBY: 	""
					*/
				},
				sstable: {
					/*
					id:			"id",
					view: 		"product_label",
					mref:		"ref_id",
					cols:		[
						{name: "", 			colname:words["sn"], 		coltype:"rowno",		coldesc: 0 },
						{name: "title_en",  colname:words["title.en"], 	coltype:"text",			coldesc: 1, 	search:1, nl2br:1 },
						{name: "", 			colname:" - ", 				coltype:"seperator", 	on:"title_en" },
						{name: "title_cn", 	colname:words["title.cn"],	coltype:"text",			coldesc: 1,		search:1	},
						{name: "status", 	colname:words["status"],	coltype:"bool",			coldesc: 1,		search:1 },
						{name: "created_time", 	colname:words["created_time"],	coltype:"intdatetimehide",	coldesc: 1 }
					],
					orderBY: 	"product_label.title_en ASC",
					*/
					fval: ""   // important : for search text value
				}
			}
		},
		data: []
	};
	$.extend(this.table.head, 		opts.head);
	$.extend(this.table.schema, 	opts.schema);
	$.extend(this.table.data, 		opts.data);
	$.extend(this.html, 			opts.html);
	$.extend(this.func, 			opts.func);
	
	var _self 	= this;

	// class constructor
	var _constructor = function() {
			var scope 		= _self.table.head.scope;
			var container 	= _self.table.head.container;
			_self.table.head.oldmatch = _self.table.head.match; 
			
			if( container ) {
				$(container).empty();
				var html_hh = [	'<div scope="' + _self.table.head.scope + '" class="lwhAccord">',
									parseInt(_self.table.head.header)?[
									'<div class="lwhAccord-headarea">',
										'<a scope="' + scope + '" class="lwhAccord-navi lwhAccord-navi-loading lwhAccord-navi-loading-na"  style="margin-top:3px; margin-left:2px; margin-right:2px;" title="LOADING..."></a>',
										'<a scope="' + scope + '" class="lwhAccord-button-refresh" style="margin-top:3px; margin-left:2px; margin-right:2px;" title="' + gcommon.trans[_self.table.head.lang].words["navi.refresh"] + '"></a>',
									
										'<a class="lwhAccord-button-selection" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
											'<div class="lwhAccord-selectionarea">',
											'<div scope="' + scope + '" class="lwhAccord-selectionarea-head">' + gcommon.trans[_self.table.head.lang].words["selected"] + '</div>',
											'<ul scope="' + scope + '" class="lwhAccord-selectionarea-content"></ul>',
											'</div>',
										'</a>',
										
										parseInt(_self.table.head.btnfind)?[
										'<a scope="' + scope + '" class="lwhAccord-button-search" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["search"] + '">',
											'<input scope="' + scope + '" class="lwhAccord-search-text" type="text" style="width:80px;" />',
											'<span scope="' + scope + '" class="lwhAccord-button-search-del" title="' + gcommon.trans[_self.table.head.lang].words["remove filter"] + '"></span>',
										'</a>'].join(''):'',
										parseInt(_self.table.head.btnall)?'<a scope="' + scope + '" class="lwhAccord-button-removeall" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["remove all"] + '"></a>':'',

									'</div>'].join(''):'',

									'<div scope="' + scope + '" class="lwhAccord-content"></div>',
								'</div>'
							  ].join('');
				_self.htmlBox = $(container).append(html_hh)[0].lastChild;
				_self.itemBox = $(".lwhAccord-content", container)[0];
			} else {
				var html_hh = [	
								'<div class="lwhWrapBox">',
									'<div class="lwhWrapBox-content">',
										/******************************************************************/
										'<div scope="' + scope + '" class="lwhAccord">',
												
												parseInt(_self.table.head.header)?[
												'<div class="lwhAccord-headarea">',
													'<a scope="' + scope + '" class="lwhAccord-navi lwhAccord-navi-loading lwhAccord-navi-loading-na"  style="margin-top:3px; margin-left:2px; margin-right:2px;" title="LOADING..."></a>',
													'<a scope="' + scope + '" class="lwhAccord-button-refresh" style="margin-top:3px; margin-left:2px; margin-right:2px;" title="' + gcommon.trans[_self.table.head.lang].words["navi.refresh"] + '"></a>',
												
													'<a class="lwhAccord-button-selection" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
														'<div class="lwhAccord-selectionarea">',
														'<div scope="' + scope + '" class="lwhAccord-selectionarea-head">' + gcommon.trans[_self.table.head.lang].words["selected"] + '</div>',
														'<ul scope="' + scope + '" class="lwhAccord-selectionarea-content"></ul>',
														'</div>',
													'</a>',
													
													parseInt(_self.table.head.btnfind)?[
													'<a scope="' + scope + '" class="lwhAccord-button-search" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["search"] + '">',
														'<input scope="' + scope + '" class="lwhAccord-search-text" type="text" style="width:80px;" />',
														'<span scope="' + scope + '" class="lwhAccord-button-search-del" title="' + gcommon.trans[_self.table.head.lang].words["remove filter"] + '"></span>',
													'</a>'].join(''):'',
													parseInt(_self.table.head.btnall)?'<a scope="' + scope + '" class="lwhAccord-button-removeall" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["remove all"] + '"></a>':'',
				
												'</div>'].join(''):'',
			
												'<div scope="' + scope + '" class="lwhAccord-content"></div>',


										'</div>',
										/******************************************************************/
										
									'</div>',
								'</div>'
							  ].join('');
				_self.htmlBox 	=  $("body").append(html_hh)[0].lastChild;
				_self.divBox 	=  _self.htmlBox; //$("body").append(html_hh)[0].lastChild;
				_self.itemBox 	=  $("div.lwhAccord-content", _self.divBox )[0];
				$(_self.divBox).lwhWrapBox({
					before: function(el) {
						if( _self.func.before) if($.isFunction(_self.func.before)) {
							_self.func.before(_self.valObj);
						}
					},
					after:  function(el) {
						if( _self.func.after) if($.isFunction(_self.func.after)) {
							_self.func.after(_self.valObj);
						}
					}
				});
			}
		
	
			/***  page navigator icons event ***/		
			$("a.lwhAccord-button-refresh[scope='" + scope+ "']").die("click").live("click", function(ev) {
				_self.view();
			});
			/**********************************************/

			if( _self.table.head.trigger ) {
				$(_self.table.head.trigger).unbind("click").bind("click", function(ev) {
					_self.show();
				});
			}


			/*** search text and button ***/
			$("input.lwhAccord-search-text[scope='" + scope+ "'], span.lwhAccord-button-search-del[scope='" + scope+ "']").die("click").live("click", function(ev) {
					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});
		
			$("input.lwhAccord-search-text[scope='" + scope+ "']").die("keydown").live("keydown", function(ev) {
				if (ev.keyCode == 13) {
					if( $(this).val() != _self.table.schema.table.sstable.fval ) {
						_self.table.schema.table.sstable.fval = $(this).val();
						if( _self.table.schema.table.sstable.fval != "" ) 
							_self.search();
						else 
							_self.view();
					}
				}
			});
		
			$("a.lwhAccord-button-search[scope='" + scope+ "']").die("click").live("click", function(ev) {
					if( _self.table.schema.table.sstable.fval != "" ) 
						_self.search();
					else 
						_self.view();

					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});
			
			$("span.lwhAccord-button-search-del[scope='" + scope+ "']").die("click").live("click", function(ev) {
					$("input.lwhAccord-search-text[scope='" + scope+ "']").val("");
					_self.table.schema.table.sstable.fval = _self.table.schema.table.sstable.fval?_self.table.schema.table.sstable.fval:"";
					if( $("input.lwhAccord-search-text[scope='" + scope+ "']").val() != _self.table.schema.table.sstable.fval ) {
						_self.table.schema.table.sstable.fval = $("input.lwhAccord-search-text[scope='" + scope+ "']").val();
						_self.view();
					}
					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});

			$("a.lwhAccord-button-removeall[scope='" + scope+ "']").unbind("click").bind("click", function(ev){
				_self.clear();
			});
			
			/******** item click *******************/
			$("li.node[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if(parseInt(_self.table.head.single)) {
					$("li.node", $(this).parents("ul.lwhAccord")).not(this).removeClass("node-open");
				}
				$(this).parents("li.node").addClass("node-open");

				if( $(this).hasClass("node-open") )  {
					$(this).removeClass("node-open");
				} else {
					$(this).addClass("node-open");
				}
				
				if(parseInt(_self.table.head.cookie)) {
					var cookieKey = "";
					if( $(this).attr("level") == "1" )
						cookieKey = scope + ".pid." + $(this).attr("pid");
					else 
						cookieKey = scope + ".mid." + $(this).attr("mid");
						
					$.cookie(cookieKey, $(this).hasClass("node-open")?1:0);	
				}

				ev.stopPropagation();
				ev.preventDefault();
				return false;
							
			});
			
			$("li.item[scope='" + scope+ "'][sid]").die("click").live("click", function(ev) {
				if(parseInt(_self.table.head.multiple)) {
					if( $(this).hasClass("item-selected") )  {
						$("li.item[scope='" + scope+ "'][sid='" + $(this).attr("sid") + "']").removeClass("item-selected");
							var vidx =  _self.valObj.val.indexOf( $(this).attr("sid") );
							_self.valObj.val.splice(vidx, 1);
							_self.valObj.text.splice(vidx, 1);
						
					} else {
						$("li.item[scope='" + scope+ "'][sid='" + $(this).attr("sid") + "']").addClass("item-selected");
							var vidx =  _self.valObj.val.indexOf( $(this).attr("sid") );
							if( vidx < 0 ) { 						
								_self.valObj.val.push($(this).attr("sid"));
								_self.valObj.text.push($(this).html());
							}
					}
				} else {
					$("li.item[scope='" + scope+ "'][sid]").removeClass("item-selected");
					$("li.item[scope='" + scope+ "'][sid='" + $(this).attr("sid") + "']").addClass("item-selected");
						_self.valObj.val	= [];
						_self.valObj.text 	= [];
						_self.valObj.val.push($(this).attr("sid"));
						_self.valObj.text.push($(this).html());
				}

				_self.syncSelectText();
				 
				if( _self.func.click) if($.isFunction(_self.func.click)) {
					_self.func.click(_self.valObj);
				}

				if( parseInt(_self.table.head.autohide) ) {
					if( !parseInt(_self.table.head.multiple) ) 
						if( _self.divBox ) $(_self.divBox).wrapBoxHide();
				}
				
				ev.stopPropagation();
				ev.preventDefault();
				return false;
			}); // end of click event
			

	}();
}


LWH.ACCORD.prototype = {
	view:	function() {
		this.table.head.match = this.table.head.oldmatch;		
		this.viewCall();
	},

	search: function() {
		this.table.head.match = 1;		
		this.viewCall();
	},

	viewCall: function() {
		var ntable 		= {};
		ntable.schema 	= {};
		ntable.head 	= {};
		$.extend(ntable.schema , 	this.table.schema);
		$.extend(ntable.head,		this.table.head);
		
		ntable.head.action 	= "view";
		ntable.head.loading = 1;
		this.ajaxCall(ntable);
	},
	
	filter: function(table, colName, colVal) {
		if(colVal) {
			this.table.schema.table[table][filter][colName] = colVal;
		} else {
			return this.table.schema.table[table][filter][colName];
		}
	},
	
	show: function() {
		$(this.divBox).wrapBoxShow();
	},
	hide: function() {
		$(this.divBox).wrapBoxHide();
	},
			
	set: function(vObj) 
	{
		this.table.head.action = "select";		
		this.valObj	= vObj;
		this.ajaxCall(this.table);		
	},
	
	clear:  function() {
		this.valObj.val 	= [];
		this.valObj.text 	= [];

		$("li.item[scope='" + this.table.head.scope + "'][sid]").removeClass("item-selected");
		$("ul.lwhAccord-selectionarea-content[scope='" + this.table.head.scope + "']").empty();	

		if( this.func.click) if($.isFunction(this.func.click)) {
			this.func.click(this.valObj);
		}

		if( this.func.clear) if($.isFunction(this.func.clear)) {
			this.func.clear(this.valObj);
		}
	},
	
	/*** Ajax *****************************************************************************************/
	ajaxCall: function(ntable) {
		var _self = this;
		if(ntable.head.wait) wait_show();
		$("a.lwhAccord-navi-loading[scope='" + ntable.head.scope + "']").removeClass("lwhAccord-navi-loading-na");
		$("a.lwhAccord-button-refresh[scope='" + ntable.head.scope + "']").hide();
		$.ajax({
			data: {
				table: ntable,
				valObj: _self.valObj
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				if(ntable.head.wait) wait_hide();
				$("a.lwhAccord-navi-loading[scope='" + ntable.head.scope + "']").addClass("lwhAccord-navi-loading-na");
				$("a.lwhAccord-button-refresh[scope='" + ntable.head.scope + "']").show();
			},
			success: function(req, tStatus) {
				if(ntable.head.wait) wait_hide();
				$("a.lwhAccord-navi-loading[scope='" + ntable.head.scope + "']").addClass("lwhAccord-navi-loading-na");
				$("a.lwhAccord-button-refresh[scope='" + ntable.head.scope + "']").show();
				errorHandler(req);
				
				if( req.errorCode == 0 ) {
					switch( req.table.head.action ) {
						case "view":
							_self.valObj 		= req.table.valObj;
							_self.syncSelect();
							
							_self.table.data 	= req.table.data;
							_self.table.head 	= req.table.head;
							_self.rows(_self.table.head, _self.table.schema, _self.table.data);
							break;
						case "select":
							_self.valObj 		= req.table.valObj;
							_self.syncSelect();
							break;
					}
				}
			},
			type: "post",
			url:  (ntable.head.url?ntable.head.url: "ajax/lwhAccord_ajax.php")
		});
	},
	
	
	/*** data rows to html ***/
	syncSelectText: function() {
		var _self = this;
        if ( $.isArray(this.valObj.val) ) {
            $.map(this.valObj.val, function (val, key) {
		        $("li.item[scope='" + _self.table.head.scope + "'][sid='" + val + "']").addClass("item-selected");
            });
        }
		
		var textlist = '';
        if ( $.isArray(this.valObj.text) ) {
            $.map(this.valObj.text, function (val, key) {
			   	textlist += '<li>' + val + '</li>';
            });
		}
		$("ul.lwhAccord-selectionarea-content[scope='" + this.table.head.scope + "']").empty().html(textlist);	
	},

	syncSelect: function() {
		var _self = this;
        $("li.item[scope='" + this.table.head.scope + "'][sid]").removeClass("item-selected");
		$("li.node[scope='" + this.table.head.scope + "']", "ul.lwhAccord[scope='" + this.table.head.scope + "']").removeClass("node-open");
		
        if ( $.isArray(this.valObj.val) ) {
            $.map(this.valObj.val, function (val, key) {
		        $("li.item[scope='" + _self.table.head.scope + "'][sid='" + val + "']").addClass("item-selected");
            });
        }
		
		var textlist = '';
        if ( $.isArray(this.valObj.text) ) {
            $.map(this.valObj.text, function (val, key) {
			   	textlist += '<li>' + val + '</li>';
            });
		}
		$("ul.lwhAccord-selectionarea-content[scope='" + this.table.head.scope + "']").empty().html(textlist);	

		$("li.item-selected[scope='" + this.table.head.scope + "'][sid]").parents("li.node").addClass("node-open");		
	},
	
	rows: function(oHead, oSchema, rows) {
		$(this.itemBox).empty();

		var htmlRows = '';
		if( this.html.rows ) { 
			// rows html replacement
			if( $.isFunction(this.html.rows) ) htmlRows += this.html.rows(oHead, oSchema, rows);
			/************************/
	
		} else {
			/*** List ***/
			htmlRows += '<ul class="lwhAccord" level="' + oHead.level + '"  scope="' + oHead.scope + '">';
			var rowno = 0;
			for(var i=0 ; i < this.table.data.length; i++) {
				rowno++; 
				var rowObj 	= this.table.data[i];
				htmlRows += this.createRowHTML(rowObj,  this.table.head.level , i);
			}  // loop for rows
			htmlRows += '</ul>';
			/**************/
		}
		
		htmlRows += '</div>';

		$(this.itemBox).append(htmlRows);
		if( oSchema.table.sstable.fval != "" ) 
			$("li.item[scope='" + this.table.head.scope + "'][sid]").parents("li.node").addClass("node-open");		
		else 
			$("li.item-selected[scope='" + this.table.head.scope + "'][sid]").parents("li.node").addClass("node-open");		
	},
	
	createRowHTML: function( rowObj , level, rowno ) {
		var html = '';
		var id = 0;
		switch(parseInt(level)) {
			case 1:
				id = rowObj.pid;
				var itemObj = this.createItemContent(rowObj, this.table.schema.table.pptable.cols, rowno);
			
				var openFlag    = false;
				if( parseInt(this.table.head.cookie) ) {				
					var cookieKey 	= this.table.head.scope + ".pid." + id;
					openFlag 		= parseInt($.cookie(cookieKey))?true:false;
				}
				openFlag 		= openFlag ||  (parseInt(this.table.head.ppshow)?true:false);  			

				if(openFlag) 
					html += '<li class="node node-open" scope="' + this.table.head.scope + '" pid="' + id + '" level="1" title="' + itemObj.desc + '">';				
				else 
					html += '<li class="node" scope="' + this.table.head.scope + '" pid="' + id + '" level="1" title="' + itemObj.desc + '">';				
				
				html += itemObj.title;
				html += '<ul class="lwhAccord" level="' + (level+1) +  '" scope="' + this.table.head.scope + '">';
				
				if( $.isArray(rowObj.data) ) {
					for(var i=0 ; i < rowObj.data.length; i++) {
						var rowObj1 = rowObj.data[i];
						html +=  this.createRowHTML(rowObj1,  level+1 , i);
					}  // loop for rows
				}
				html += '</ul>';				
				html += '</li>';				
				break;
			case 2:
				id = rowObj.mid;
				var itemObj = this.createItemContent(rowObj, this.table.schema.table.mmtable.cols, rowno);
				
				var openFlag	= false;
				if( parseInt(this.table.head.cookie) ) {				
					var cookieKey 	= this.table.head.scope + ".mid." + id;
					openFlag 		= parseInt($.cookie(cookieKey))?true:false;
				}
				openFlag 		= openFlag ||  (parseInt(this.table.head.mmshow)?true:false);  			
				
				if(openFlag) 
					html += '<li class="node node-open" scope="' + this.table.head.scope + '" mid="' + id + '" level="2" title="' + itemObj.desc + '">';				
				else 
					html += '<li class="node" scope="' + this.table.head.scope + '" mid="' + id + '" level="2" title="'  + itemObj.desc + '">';				
				
					
				html += itemObj.title;
				html += '<ul class="lwhAccord"  level="' + (level+1) +  '" scope="' + this.table.head.scope + '">';
				
				if( $.isArray(rowObj.data) ) {
					for(var i=0 ; i < rowObj.data.length; i++) {
						var rowObj1 = rowObj.data[i];
						html +=  this.createRowHTML(rowObj1, level+1 , i);
					}  // loop for rows
				}
				html += '</ul>';				
				html += '</li>';				

				break;
			case 3:
				id = rowObj.sid;
				var itemObj = this.createItemContent(rowObj, this.table.schema.table.sstable.cols, rowno);
				
				if( this.valObj.val.indexOf(id) >= 0 ) 			
					html += '<li class="item item-selected" scope="' + this.table.head.scope + '" sid="' + id + '" title="' + itemObj.desc + '">';				
				else	
					html += '<li class="item" scope="' + this.table.head.scope + '" sid="' + id + '" title="' + itemObj.desc + '">';				
				
				html += itemObj.title;
				html += '</li>';				
				break;
		}
		return html;
	},
	

	createItemContent: function( rowObj, cols, rowno ) {
		var itemObj = {
			title: "",
			desc: ""
		};
		var itemTitle = '';
		var itemDesc  = '';
		for(var j=0; j < cols.length; j++) {
					var colObj = cols[j];
					switch( colObj.coltype.toLowerCase() ) {
						case "rowno":
							itemTitle += (rowno+1) + '. '; 
							break;
						case "length":
							var rlen = 0;
							if( $.isArray(rowObj.data) ) rlen += rowObj.data.length;
							itemTitle += rlen;
							
							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + rlen;					
							}
							break;

						case "bool":
							if( parseInt(rowObj[colObj.name]) ) 
								itemTitle += '<a class="lwhAccord-imgvalue lwhAccord-imgvalue-status lwhAccord-imgvalue-status-1"></a>'; 
							else 
								itemTitle += '<a class="lwhAccord-imgvalue lwhAccord-imgvalue-status lwhAccord-imgvalue-status-0"></a>'; 
							
							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + parseInt(rowObj[colObj.name]);					
							}
							break;
						case "hidden":
							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + rowObj[colObj.name];					
							}
							break;
						case "text":
							if( parseInt(colObj.nl2br) ) 
								itemTitle += ("" + rowObj[colObj.name]).nl2br(); 
							else
								itemTitle += rowObj[colObj.name]; 
							
							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + rowObj[colObj.name];					
							}
							break;
						case "intdate":
							itemTitle += ("" + rowObj[colObj.name]).toDate(); 

							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + ("" + rowObj[colObj.name]).toDate();					
							}
							break;

						case "intdatehide":
							//itemTitle += ("" + rowObj[colObj.name]).toDate(); 
							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + ("" + rowObj[colObj.name]).toDate();					
							}
							break;

						case "intdatetime":
							itemTitle += ("" + rowObj[colObj.name]).toDateTime(); 
							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + ("" + rowObj[colObj.name]).toDateTime();					
							}
							break;

						case "intdatetimehide":
							//itemTitle += ("" + rowObj[colObj.name]).toDateTime(); 
							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + ("" + rowObj[colObj.name]).toDateTime();					
							}
							break;

						case "seperator":
							if( colObj.on ) {
								var colArr = colObj.on?(""+colObj.on).split("|"):[];
								var sp_flag = false;
								for(var key in colArr) {
									sp_flag = sp_flag || (rowObj[colArr[key]]?true:false);
								}
								if(sp_flag) itemTitle += colObj.colname; 
							} else {
								itemTitle += colObj.colname; 								
							}
							break;
					}
	
		}
		itemObj.title = itemTitle;
		itemObj.desc = itemDesc;
		return itemObj;

	}
	/*** end of data rows to html ***/
}