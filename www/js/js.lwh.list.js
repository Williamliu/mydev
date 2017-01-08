var LWH = LWH || {};
LWH.LIST = function(opts) {
	this.htmlBox    = null;
	this.divBox 	= null;
	this.itemBox 	= null;

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
		head: 	{
			lang:  		DLang,	
			scope:		"",
			container:	"",
			trigger:	"",
			url:		"",
			
			header:		1,
			btnall: 	1,
			btnfind:	1,	
			multiple:	0,
			autohide:	0,
			
			action: 	"view",
			loading: 	0,
			wait:		1,
			orderBY: 	"",
			orderSN: 	"ASC",
			
			paging:		1,
			pageNo: 	1,
			pageSize: 	20,
			pageTotal:	0,
			totalNo: 	0
		},
		
		schema: {
			table: {
				view: 		"",  // table name  or view name
				id:			"",
				pid:		"",
				pval:		"",
				fval:		"",
				filter:		{},
				cols: 		[]
			},
			/*** cols format as below:
			{name: "", 			colname:words["sn"], 		coltype:"rowno",		coldesc: 0 },
			{name: "status", 	colname:words["status"],	coltype:"bool",			coldesc: 1,				sort:1, search:1 },
			{name: "user_name", colname:words["user_name"], coltype:"text",			coldesc: 1, 	sort:1, search:1, nl2br:1 },
			{name: "email", 	colname:words["email"],		coltype:"hidden",		coldesc: 1,		sort:1, search:1	},
			{name: "", 			colname:" - ", 				coltype:"seperator", 	on:"user_name" },
			{name: "", 			colname:"{", 				coltype:"seperator", 	on:"user_name|email" },
			{name: "created_time", 	colname:words["email"],	coltype:"intdate",			coldesc: 1,	sort:1	},
			{name: "", 			colname:"}", 				coltype:"seperator", 	on:"user_name" }
			***/	
		},
		data: []
	};
	$.extend(this.table.head, 		opts.head);
	$.extend(this.table.schema, 	opts.schema);
	$.extend(this.table.data, 		opts.data);
	$.extend(this.valObj, 			opts.valObj);
	$.extend(this.html, 			opts.html);
	$.extend(this.func, 			opts.func);
	
	var _self 	= this;

	// class constructor
	var _constructor = function() {
			var scope 		= _self.table.head.scope;
			var container 	= _self.table.head.container;
	
	
			if( container ) {
				$(container).empty();
				var html_hh = [	'<div scope="' + _self.table.head.scope + '" class="lwhList">',
									parseInt(_self.table.head.header)?[
									'<div class="lwhList-headarea">',
										'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-loading lwhList-navi-loading-na"  style="margin-top:3px; margin-left:2px; margin-right:2px;" title="LOADING..."></a>',
										'<a scope="' + scope + '" class="lwhList-button-refresh" style="margin-top:3px; margin-left:2px; margin-right:2px;" title="' + gcommon.trans[_self.table.head.lang].words["navi.refresh"] + '"></a>',
									
										'<a class="lwhList-button-selection" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
											'<div class="lwhList-selectionarea">',
											'<div scope="' + scope + '" class="lwhList-selectionarea-head">' + gcommon.trans[_self.table.head.lang].words["selected"] + '</div>',
											'<ul scope="' + scope + '" class="lwhList-selectionarea-content"></ul>',
											'</div>',
										'</a>',
										
										parseInt(_self.table.head.btnfind)?[
										'<a scope="' + scope + '" class="lwhList-button-search" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["search"] + '">',
											'<input scope="' + scope + '" class="lwhList-search-text" type="text" style="width:80px;" />',
											'<span scope="' + scope + '" class="lwhList-button-search-del" title="' + gcommon.trans[_self.table.head.lang].words["remove filter"] + '"></span>',
										'</a>'].join(''):'',
										parseInt(_self.table.head.btnall)?'<a scope="' + scope + '" class="lwhList-button-removeall" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["remove all"] + '"></a>':'',
	
	
										'<a class="lwhList-button-sort" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
											'<div class="lwhList-sortarea">',
											'<div scope="' + scope + '" class="lwhList-sortarea-head">' + gcommon.trans[_self.table.head.lang].words["sort.list"] + '</div>',
											'<ul scope="' + scope + '" class="lwhList-sortarea-content"></ul>',
											'</div>',
										'</a>',
									'</div>'].join(''):'',

									parseInt(_self.table.head.paging)?[
									'<div class="lwhList-headarea1">',
										'<span>',
										'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-first lwhList-navi-first-na" title="' + gcommon.trans[_self.table.head.lang].words["navi.first"] + '"></a>',
										'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-prev lwhList-navi-prev-na"  title="' + gcommon.trans[_self.table.head.lang].words["navi.prev"] + '"></a>',
										'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-next lwhList-navi-next-na"  title="' + gcommon.trans[_self.table.head.lang].words["navi.next"] + '"></a>',
										'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-last lwhList-navi-last-na"  title="' + gcommon.trans[_self.table.head.lang].words["navi.last"] + '"></a>',
										'</span>',
										'<span class="lwhList-navi-pineline">|</span>',
					
										'<span class="lwhList-navi-label" style="margin-top:3px; margin-left:2px; vertical-align:middle;">',
										gcommon.trans[_self.table.head.lang].words["page"],
										'<input scope="' + scope + '" name="pageno" type="text" class="lwhList-navi-pageSize" style="border:0px; border-bottom:1px solid #cccccc;" min="0" max="" value="0" />',
										'<span class="lwhList-navi-pineline">/</span>',
										'<span scope="' + scope + '" name="pagetotal" class="lwhList-navi-pageTotal">0</span>',
										'<input scope="' + scope + '" name="pagesize" type="text" class="lwhList-navi-pageSize" style="margin-top:5px; margin-right:3px; float:right; border:0px; border-bottom:1px solid #cccccc;" min="10" max="200" maxlength="3" value="20"  />',
										'</span>',
									'</div>'].join(''):'',
	
									'<div scope="' + scope + '" class="lwhList-content"></div>',
								'</div>'
							  ].join('');
				_self.htmlBox = $(container).append(html_hh)[0].lastChild;
				_self.itemBox = $(".lwhList-content", container)[0];
			} else {
				var html_hh = [	
								'<div class="lwhWrapBox">',
									'<div class="lwhWrapBox-content">',
										/******************************************************************/
										'<div scope="' + scope + '" class="lwhList">',
												
												parseInt(_self.table.head.header)?[
												'<div class="lwhList-headarea">',
													'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-loading lwhList-navi-loading-na"  style="margin-top:3px; margin-left:2px; margin-right:2px;" title="LOADING..."></a>',
													'<a scope="' + scope + '" class="lwhList-button-refresh" style="margin-top:3px; margin-left:2px; margin-right:2px;" title="' + gcommon.trans[_self.table.head.lang].words["navi.refresh"] + '"></a>',
												
													'<a class="lwhList-button-selection" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
														'<div class="lwhList-selectionarea">',
														'<div scope="' + scope + '" class="lwhList-selectionarea-head">' + gcommon.trans[_self.table.head.lang].words["selected"] + '</div>',
														'<ul scope="' + scope + '" class="lwhList-selectionarea-content"></ul>',
														'</div>',
													'</a>',
													
													parseInt(_self.table.head.btnfind)?[
													'<a scope="' + scope + '" class="lwhList-button-search" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["search"] + '">',
														'<input scope="' + scope + '" class="lwhList-search-text" type="text" style="width:80px;" />',
														'<span scope="' + scope + '" class="lwhList-button-search-del" title="' + gcommon.trans[_self.table.head.lang].words["remove filter"] + '"></span>',
													'</a>'].join(''):'',
													parseInt(_self.table.head.btnall)?'<a scope="' + scope + '" class="lwhList-button-removeall" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["remove all"] + '"></a>':'',
				
				
													'<a class="lwhList-button-sort" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
														'<div class="lwhList-sortarea">',
														'<div scope="' + scope + '" class="lwhList-sortarea-head">' + gcommon.trans[_self.table.head.lang].words["sort.list"] + '</div>',
														'<ul scope="' + scope + '" class="lwhList-sortarea-content"></ul>',
														'</div>',
													'</a>',
												'</div>'].join(''):'',
			
												parseInt(_self.table.head.paging)?[
												'<div class="lwhList-headarea1">',
													'<span>',
													'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-first lwhList-navi-first-na" title="' + gcommon.trans[_self.table.head.lang].words["navi.first"] + '"></a>',
													'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-prev lwhList-navi-prev-na"  title="' + gcommon.trans[_self.table.head.lang].words["navi.prev"] + '"></a>',
													'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-next lwhList-navi-next-na"  title="' + gcommon.trans[_self.table.head.lang].words["navi.next"] + '"></a>',
													'<a scope="' + scope + '" class="lwhList-navi lwhList-navi-last lwhList-navi-last-na"  title="' + gcommon.trans[_self.table.head.lang].words["navi.last"] + '"></a>',
													'</span>',
													'<span class="lwhList-navi-pineline">|</span>',
								
													'<span class="lwhList-navi-label" style="margin-top:3px; margin-left:2px; vertical-align:middle;">',
													gcommon.trans[_self.table.head.lang].words["page"],
													'<input scope="' + scope + '" name="pageno" type="text" class="lwhList-navi-pageSize" style="border:0px; border-bottom:1px solid #cccccc;" min="0" max="" value="0" />',
													'<span class="lwhList-navi-pineline">/</span>',
													'<span scope="' + scope + '" name="pagetotal" class="lwhList-navi-pageTotal">0</span>',
													'<input scope="' + scope + '" name="pagesize" type="text" class="lwhList-navi-pageSize" style="margin-top:5px; margin-right:3px; float:right; border:0px; border-bottom:1px solid #cccccc;" min="10" max="200" maxlength="3" value="20"  />',
													'</span>',
												'</div>'].join(''):'',
				
												'<div scope="' + scope + '" class="lwhList-content"></div>',


										'</div>',
										/******************************************************************/
										
									'</div>',
								'</div>'
							  ].join('');
				_self.htmlBox 	=  $("body").append(html_hh)[0].lastChild;
				_self.divBox 	=  _self.htmlBox; //$("body").append(html_hh)[0].lastChild;
				_self.itemBox 	=  $("div.lwhList-content", _self.divBox )[0];
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
		
			for(var i=0; i < _self.table.schema.table.cols.length; i++) {
				var colObj = _self.table.schema.table.cols[i];
				if( parseInt(colObj.sort) ) {
					var colName = colObj.colname?colObj.colname:colObj.name;
					
					var sortFlag = false;
					if( colObj.name.toUpperCase() == _self.table.head.orderBY.toUpperCase() ) 
						sortFlag = true;
					else
						sortFlag = false;
					 
					if( sortFlag && _self.table.head.orderSN.toUpperCase() == "ASC" )
						$("ul.lwhList-sortarea-content[scope='" + scope+ "']").append("<li scope='" + scope+ "' class='lwhList-sort selected' scope='" + scope+ "' name='" + colObj.name + "' sort='ASC'>" + colName + " ▲</li>"); 
					else 
						$("ul.lwhList-sortarea-content[scope='" + scope+ "']").append("<li scope='" + scope+ "' class='lwhList-sort' scope='" + scope+ "' name='" + colObj.name + "' sort='ASC'>" + colName + " ▲</li>"); 


					if( sortFlag && _self.table.head.orderSN.toUpperCase() == "DESC" )
						$("ul.lwhList-sortarea-content[scope='" + scope+ "']").append("<li scope='" + scope+ "' class='lwhList-sort selected' scope='" + scope+ "' name='" + colObj.name + "' sort='DESC'>" + colName + " ▼</li>"); 
					else 
						$("ul.lwhList-sortarea-content[scope='" + scope+ "']").append("<li scope='" + scope+ "' class='lwhList-sort' scope='" + scope+ "' name='" + colObj.name + "' sort='DESC'>" + colName + " ▼</li>"); 
				}
			}
	
	
			/***  page navigator icons event ***/		
			$("a.lwhList-button-refresh[scope='" + scope+ "']").die("click").live("click", function(ev) {
				_self.view();
			});

			$("input[scope='" + scope+ "'][name='pageno']").die("keydown").live("keydown", function(ev) {
				if (ev.keyCode == 13) {
					_self.table.head.pageNo	= $(this).val();	
					_self.view();
				}
			});

			$("input[scope='" + scope+ "'][name='pagesize']").die("keydown").live("keydown", function(ev) {
				if (ev.keyCode == 13) {
					if( parseInt( $(this).val() ) <= 0 ) 	$(this).val(20);
					if( parseInt( $(this).val() ) > 200 ) 	$(this).val(200);
					_self.table.head.pageSize = $(this).val();	
					_self.view();
				}
			});
			
			$("a.lwhList-navi-first[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhList-navi-first-na") ) {
					_self.table.head.pageNo	= 1;	
					_self.view();
				}
			});

			$("a.lwhList-navi-prev[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhList-navi-prev-na") ) {
					_self.table.head.pageNo--;	
					_self.view();
				}
			});

			$("a.lwhList-navi-next[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhList-navi-next-na") ) {
					_self.table.head.pageNo++;	
					_self.view();
				}
			});
			
			$("a.lwhList-navi-last[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhList-navi-last-na") ) {
					_self.table.head.pageNo	= _self.table.head.pageTotal;	
					_self.view();
				}
			});

			$("li.lwhList-sort[scope='" + scope+ "']").die("click").live("click", function(ev) {
				var colName = $(this).attr("name");
				var colSort = $(this).attr("sort");
				
				if( colName.toUpperCase() != _self.table.head.orderBY.toUpperCase() || colSort.toUpperCase() != _self.table.head.orderSN.toUpperCase()  ) {
					$("li.lwhList-sort[scope='" + scope+ "']").removeClass("selected");
					$(this).addClass("selected");

					_self.table.head.orderBY = colName;
					_self.table.head.orderSN = colSort;
					_self.view();
				}
		

			});
			/**********************************************/

			if( _self.table.head.trigger ) {
				$(_self.table.head.trigger).unbind("click").bind("click", function(ev) {
					_self.show();
				});
			}


			/*** search text and button ***/
			$("input.lwhList-search-text[scope='" + scope+ "'], span.lwhList-button-search-del[scope='" + scope+ "']").die("click").live("click", function(ev) {
					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});
		
			$("input.lwhList-search-text[scope='" + scope+ "']").die("keydown").live("keydown", function(ev) {
				if (ev.keyCode == 13) {
					if( $(this).val() != _self.table.schema.table.fval ) {
						_self.table.schema.table.fval = $(this).val();
						_self.view();
					}
				}
			});
		
			$("a.lwhList-button-search[scope='" + scope+ "']").die("click").live("click", function(ev) {
					_self.view();
					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});
			
			$("span.lwhList-button-search-del[scope='" + scope+ "']").die("click").live("click", function(ev) {
					$("input.lwhList-search-text[scope='" + scope+ "']").val("");
					_self.table.schema.table.fval = _self.table.schema.table.fval?_self.table.schema.table.fval:"";
					if( $("input.lwhList-search-text[scope='" + scope+ "']").val() != _self.table.schema.table.fval ) {
						_self.table.schema.table.fval = $("input.lwhList-search-text[scope='" + scope+ "']").val();
						_self.view();
					}
					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});

			$("a.lwhList-button-removeall[scope='" + scope+ "']").unbind("click").bind("click", function(ev){
				_self.clear();
			});
			
			/******** item click *******************/
			$("li.lwhList-item[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if(parseInt(_self.table.head.multiple)) {
					if( $(this).hasClass("lwhList-item-selected") )  {
						$("li.lwhList-item[scope='" + scope+ "'][sid='" + $(this).attr("sid") + "']").removeClass("lwhList-item-selected");
						//if( _self.table.schema.table.fval != "" ) {
							var vidx =  _self.valObj.val.indexOf( $(this).attr("sid") );
							_self.valObj.val.splice(vidx, 1);
							_self.valObj.text.splice(vidx, 1);
						//}
						
					} else {
						$("li.lwhList-item[scope='" + scope+ "'][sid='" + $(this).attr("sid") + "']").addClass("lwhList-item-selected");
						//if( _self.table.schema.table.fval != "" ) {
							_self.valObj.val.push($(this).attr("sid"));
							_self.valObj.text.push($(this).html());
						//}
					}
				} else {
					$("li.lwhList-item[scope='" + scope+ "']").removeClass("lwhList-item-selected");
					$("li.lwhList-item[scope='" + scope+ "'][sid='" + $(this).attr("sid") + "']").addClass("lwhList-item-selected");
					//if( _self.table.schema.table.fval != "" ) {
						_self.valObj.val	= [];
						_self.valObj.text 	= [];
						_self.valObj.val.push($(this).attr("sid"));
						_self.valObj.text.push($(this).html());
					//}

				}

				_self.syncSelect();
				 
				if( _self.func.click) if($.isFunction(_self.func.click)) {
					_self.func.click(_self.valObj);
				}

				if( parseInt(_self.table.head.autohide) ) {
					if( !parseInt(_self.table.head.multiple) ) 
						if( _self.divBox ) $(_self.divBox).wrapBoxHide();
				}
				
			}); // end of click event
			

	}();
}


LWH.LIST.prototype = {
	view:	function() {
		var ntable 		= {};
		ntable.schema 	= {};
		ntable.head 	= {};
		ntable.filter 	= {};
		$.extend(ntable.schema , 	this.table.schema);
		$.extend(ntable.head,		this.table.head);
		$.extend(ntable.filter,		this.table.filter);
		
		ntable.head.action 	= "view";
		ntable.head.loading = 1;
		this.ajaxCall(ntable);
	},

	search: function() {
		this.table.head.pageNo	= 1;
		this.view();
	},

	pval: function(val) {
		if(val) {
			this.table.schema.table.pval = val;
		} else {
			return this.table.schema.table.pval;
		}
	},
	
	show: function() {
		$(this.divBox).wrapBoxShow();
	},
	hide: function() {
		$(this.divBox).wrapBoxHide();
	},
			
	set: function(vObj) {
		this.table.head.action = "select";
		this.valObj	= vObj;
		this.ajaxCall(this.table);		
	},
	
	clear:  function() {
		this.valObj.val 	= [];
		this.valObj.text 	= [];

		$("li.lwhList-item[scope='" + this.table.head.scope + "']").removeClass("lwhList-item-selected");
		$("ul.lwhList-selectionarea-content[scope='" + this.table.head.scope + "']").empty();	

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
		$("a.lwhList-navi-loading[scope='" + ntable.head.scope + "']").removeClass("lwhList-navi-loading-na");
		$("a.lwhList-button-refresh[scope='" + ntable.head.scope + "']").hide();
		$.ajax({
			data: {
				table: ntable,
				valObj: _self.valObj
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				if(ntable.head.wait) wait_hide();
				$("a.lwhList-navi-loading[scope='" + ntable.head.scope + "']").addClass("lwhList-navi-loading-na");
				$("a.lwhList-button-refresh[scope='" + ntable.head.scope + "']").show();
			},
			success: function(req, tStatus) {
				if(ntable.head.wait) wait_hide();
				$("a.lwhList-navi-loading[scope='" + ntable.head.scope + "']").addClass("lwhList-navi-loading-na");
				$("a.lwhList-button-refresh[scope='" + ntable.head.scope + "']").show();
				errorHandler(req);
				
				if( req.errorCode == 0 ) {
					switch( req.table.head.action ) {
						case "view":
							$.extend(_self.table.head, 	req.table.head);
							_self.navipage(_self.table.head);
							_self.valObj 		= req.table.valObj;
							_self.syncSelect();
							_self.table.data 	= req.table.data;
							_self.rows(_self.table.schema, _self.table.data);
							break;
						case "select":
							$.extend(_self.table.head, 	req.table.head);
							_self.navipage(_self.table.head);
							_self.valObj 		= req.table.valObj;
							_self.syncSelect();
							break;
					}
				}
			},
			type: "post",
			url: (ntable.head.url?ntable.head.url:"ajax/lwhList_ajax.php")
		});
	},
	

	/*** data rows to html ***/
	navipage: function(oHead) {
		var scope 		= this.table.head.scope;
		$("input[scope='" + scope + "'][name='pageno']").val( oHead.pageNo);
		$("span[scope='" + scope + "'][name='pagetotal']").html(oHead.pageTotal);
		$("input[scope='" + scope + "'][name='pagesize']").val( oHead.pageSize);

		var first_status 	= oHead.pageNo<=1 || oHead.pageTotal <=1?' lwhList-navi-first-na':'';
		var prev_status 	= oHead.pageNo<=1 || oHead.pageTotal <=1?' lwhList-navi-prev-na':'';
		var next_status 	= oHead.pageNo>=oHead.pageTotal || oHead.pageTotal <=1?' lwhList-navi-next-na':'';
		var last_status 	= oHead.pageNo>=oHead.pageTotal || oHead.pageTotal <=1?' lwhList-navi-last-na':'';
		
		$("a.lwhList-navi-first[scope='" + scope + "']").removeClass("lwhList-navi-first-na").addClass(first_status);
		$("a.lwhList-navi-prev[scope='" + scope + "']").removeClass("lwhList-navi-prev-na").addClass(prev_status);
		$("a.lwhList-navi-next[scope='" + scope + "']").removeClass("lwhList-navi-next-na").addClass(next_status);
		$("a.lwhList-navi-last[scope='" + scope + "']").removeClass("lwhList-navi-last-na").addClass(last_status);
	},
	
	syncSelect: function() {
		var _self = this;

        $("li.lwhList-item[scope='" + this.table.head.scope + "'][sid]").removeClass("lwhList-item-selected");
        if ( $.isArray(this.valObj.val) ) {
            $.map(this.valObj.val, function (val, key) {
		        $("li.lwhList-item[scope='" + _self.table.head.scope + "'][sid='" + val + "']").addClass("lwhList-item-selected");
            });
        }
		
		var textlist = '';
        if ( $.isArray(this.valObj.text) ) {
            $.map(this.valObj.text, function (val, key) {
			   	textlist += '<li>' + val + '</li>';
            });
		}
		$("ul.lwhList-selectionarea-content[scope='" + this.table.head.scope + "']").empty().html(textlist);	
	},
	
	rows: function(oSchema, rows) {
		var scope 		= this.table.head.scope;
		
		$(this.itemBox).empty();
		var htmlRows = '';

		if( this.html.rows ) { 
			// rows html replacement
			if( $.isFunction(this.html.rows) ) htmlRows += this.html.rows(oSchema, rows);
			/************************/
	
		} else {
			/*** List ***/
			htmlRows += '<ul class="lwhList-ul" scope="' + scope + '">';
			var rowno = 0;
			for(var i=0 ; i < this.table.data.length; i++) {
				rowno++; 
				var rowObj 	= this.table.data[i];
				var sid 	= rowObj.sid;
				var itemTitle = '';
				var itemDesc  = '';
				for( var j=0; j < this.table.schema.table.cols.length; j++ ) {
					var colObj = this.table.schema.table.cols[j];
					switch( colObj.coltype.toLowerCase() ) {
						case "rowno":
							itemTitle += rowno + '. '; 
							break;
						case "bool":
							if( parseInt(rowObj[colObj.name]) ) 
								itemTitle += '<a class="lwhList-imgvalue lwhList-imgvalue-status lwhList-imgvalue-status-1"></a>'; 
							else 
								itemTitle += '<a class="lwhList-imgvalue lwhList-imgvalue-status lwhList-imgvalue-status-0"></a>'; 
							
							if( parseInt(colObj.coldesc) ) {
								itemDesc += (itemDesc?"\n":"") + (colObj.colname?colObj.colname:colObj.name) + ": " + parseInt(rowObj[colObj.name]);					
							}
							break;
						case "checkbutton":
							if( parseInt(rowObj[colObj.name]) ) 
								itemTitle += '<a class="lwhList-checkButton lwhList-checkButton-checked"></a>'; 
							else 
								itemTitle += '<a class="lwhList-checkButton"></a>'; 
							
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
				
				if( this.valObj.val.indexOf(sid) >= 0 ) 
					htmlRows += '<li class="lwhList-item lwhList-item-selected" scope="' + scope + '" sid="' + sid + '" title="' + itemDesc + '">' + itemTitle + '</li>';
				else 
					htmlRows += '<li class="lwhList-item" scope="' + scope + '" sid="' + sid + '" title="' + itemDesc + '">' + itemTitle + '</li>';
				
			}  // loop for rows
			htmlRows += '</ul>';
			/**************/
		}
		
		htmlRows += '</div>';

		$(this.itemBox).append(htmlRows);
	}
	/*** end of data rows to html ***/
}