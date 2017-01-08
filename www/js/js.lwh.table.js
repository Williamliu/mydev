var LWH = LWH || {};
LWH.TABLE = function(opts) {
	this.option = {};
	this.table = {
		buttons: {
			rights:	{ view: 1, add: 1, save: 1, cancel: 1, delete: 1},
			head: {
				icon: [
							{ key: "add", 		title: words["add"], 		desc: words["add"] 		},
							{ key: "save", 		title: words["save"], 		desc: words["save"] 	},
							{ key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	}
					  ]
			},
			row: {
				icon: [
							{ key: "save", 		title: words["save"], 		desc: words["save"] 	},
							{ key: "cancel", 	title: words["cancel"], 	desc: words["cancel"] 	},
							{ key: "delete", 	title: words["delete"], 	desc: words["delete"] 	}
					  ]
			}
		},
		head: {
			selfObj:	"",
			lang:  		DLang,	
			scope:		"",
			container:	"",
			trigger:	"",
			url:		"",
			
			mode:		"none",
			action: 	"init",
			loading: 	0,
			wait:		1,
			
			orderBY: 	"",
			orderSN: 	"ASC",
			paging:		0,
			pageNo: 	1,
			pageSize: 	20,
			pageTotal:	0,
			totalNo: 	0
		},
		schema: {
			table: {
				mode:		"all",   // "all" - left join table;  "match" - inner join table
				id:			"",
				view: 		"",
				base:   	"",
				reftable: 	"",
				refcols:	[],
				rid:		"",
				pid:		"",
				pval:		"",
				cols: []
			},
			checklist: []
		},
		html: {
			navi:	null,
			view:	null,
			rows:	null,
			imgClick: null
		},
		filter: {},
		option: {},
		data: []
	};
	$.extend(this.table.head, 		opts.head);
	$.extend(this.table.schema, 	opts.schema);
	$.extend(this.table.buttons, 	opts.buttons);

	$.extend(this.table.filter, 	opts.filter);
	$.extend(this.table.data, 		opts.data);
	$.extend(this.table.html, 		opts.html);
	$.extend(this.option, 			opts.option);
	
	var _self 	= this;

	// class constructor
	var _constructor = function() {
			var scope 		= _self.table.head.scope;
			var container 	= _self.table.head.container;
			/***  page navigator icons event ***/		
			$("a.lwhTable-navi-button-refresh", $("div.lwhTable-navi[scope='" + scope+ "']")).die("click").live("click", function(ev) {
				_self.view();
			});

			$("input[name='pageno']", $("div.lwhTable-navi[scope='" + scope+ "']")).die("keydown").live("keydown", function(ev) {
				if (ev.keyCode == 13) {
					_self.table.head.pageNo	= $(this).val();	
					_self.load();
				}
			});
			
			$("select[name='pagesize']", $("div.lwhTable-navi[scope='" + scope+ "']")).die("change").live("change", function(ev) {
				_self.table.head.pageNo	= 1;	
				_self.table.head.pageSize = $(this).val();	
				_self.load();
			});
			
			$("a.lwhTable-navi-button-first", $("div.lwhTable-navi[scope='" + scope+ "']")).die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhTable-navi-button-first-na") ) {
					_self.table.head.pageNo	= 1;	
					_self.load();
				}
			});

			$("a.lwhTable-navi-button-prev", $("div.lwhTable-navi[scope='" + scope+ "']")).die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhTable-navi-button-prev-na") ) {
					_self.table.head.pageNo--;	
					_self.load();
				}
			});

			$("a.lwhTable-navi-button-next", $("div.lwhTable-navi[scope='" + scope+ "']")).die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhTable-navi-button-next-na") ) {
					_self.table.head.pageNo++;	
					_self.load();
				}
			});
			
			$("a.lwhTable-navi-button-last", $("div.lwhTable-navi[scope='" + scope+ "']")).die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhTable-navi-button-last-na") ) {
					_self.table.head.pageNo	= _self.table.head.pageTotal;	
					_self.load();
				}
			});

			$("a.lwhTable-sort[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if( $(this).attr("col") != _self.table.head.orderBY ) {
					_self.table.head.orderBY = $(this).attr("col");
					var byCol 	= ArraySearch(_self.table.schema.table.cols, "col",  $(this).attr("col"))>=0?ArraySearch(_self.table.schema.table.cols, "col",  $(this).attr("col")):0;
					var byName 	= ArraySearch(_self.table.schema.table.cols, "name",  $(this).attr("col"))>=0?ArraySearch(_self.table.schema.table.cols, "name",  $(this).attr("col")):0;
					var colSN =  byCol || byName;
					_self.table.head.orderSN = _self.table.schema.table.cols[colSN].sort?_self.table.schema.table.cols[colSN].sort:"ASC";
					_self.table.head.pageNo	= 1;
					_self.load();
				} else {
					if(_self.table.head.orderSN.toUpperCase() == "ASC")
						_self.table.head.orderSN = "DESC";
					else 
						_self.table.head.orderSN = "ASC";

					_self.table.head.pageNo	= 1;
					_self.load();
				}
			});
			/**********************************************/
			
			
			/*** highlight selected checkbox and radio ***/
			$("input:checkbox[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if( $(this).is(":checked") ) {
					$(this).parent("label").addClass("lwhTable-input-selected");
				} else {
					$(this).parent("label").removeClass("lwhTable-input-selected");
				}
			});

			$("input:radio[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if( $(this).is(":checked") ) {
					$("label[col='" + $(this).attr("col") + "'][scope='" + $(this).attr("scope") + "'][sid='" + $(this).attr("sid") + "']").removeClass("lwhTable-input-selected");
					$(this).parent("label").addClass("lwhTable-input-selected");
				} else {
					$(this).parent("label").removeClass("lwhTable-input-selected");
				}
			});
			/*********************************************/
			
			/*** action method ***/
			$("a.lwhTable-head-button[scope='" + scope+ "'][act]").die("click").live("click", function(ev) {
				var act = $(this).attr("act");
				switch(act) {
					case "cancel":
						_self.resetAll();
						break;
					case "add":
						_self.addRow();
						break;
					case "save":
						_self.saveAll();
						break;
				}
			});

			$("a.lwhTable-row-button[scope='" + scope+ "'][sid][act]").die("click").live("click", function(ev) {
				var act = $(this).attr("act");
				var sid = $(this).attr("sid");
				switch(act) {
					case "cancel":
						_self.resetRow(sid);
						break;
					case "delete":
						_self.deleteRow(sid);
						break;
					case "save":
						_self.saveRow(sid);
						break;
				}
			});

			$("a.lwhTable-mode[scope='" + scope+ "']").die("click").live("click", function(ev) {
				if( $(this).hasClass("lwhTable-mode-list") ) {
					if(!$(this).hasClass("lwhTable-mode-list-selected")) {
						$("a.lwhTable-mode-view").removeClass("lwhTable-mode-view-selected");
						$("a.lwhTable-mode-list").addClass("lwhTable-mode-list-selected");
						$("div.lwhTable-mode-view[scope='" + scope+ "']").hide();
						$("div.lwhTable-mode-list[scope='" + scope+ "']").show();
						_self.table.head.mode = "list";
					}
				} else {
					if(!$(this).hasClass("lwhTable-mode-view-selected")) {
						$("a.lwhTable-mode-list[scope='" + scope+ "']").removeClass("lwhTable-mode-list-selected");
						$("a.lwhTable-mode-view[scope='" + scope+ "']").addClass("lwhTable-mode-view-selected");
						$("div.lwhTable-mode-list[scope='" + scope+ "']").hide();
						$("div.lwhTable-mode-view[scope='" + scope+ "']").show();
						_self.table.head.mode = "view";
					}
				}
			});

			$("a.lwhTable-image[scope='" + scope+ "'][col][sid]").die("click").live("click", function(ev) {
				var sid = $(this).attr("sid");
				if( _self.table.html.imgClick ) { 
					if( $.isFunction(_self.table.html.imgClick) ) {
						_self.table.html.imgClick(sid);
						return;
					}
				}
			});
			
			
			$("a.lwhTable-option[scope='" + scope+ "'][col][sid]").die("click").live("click", function(ev) {
				var sid = $(this).attr("sid");
				var col = $(this).attr("col");
				if( _self.option[col] ) {
					_self.option[col].setSync({
						valObj: 	$("input.lwhTable-option[scope='" + scope+ "'][col='" + col + "'][sid='" + sid+ "']")[0],
						textObj:	$("span.lwhTable-option[scope='" + scope+ "'][col='" + col + "'][sid='" + sid+ "']")[0]
					});
					_self.option[col].show();
				}
			});			

			$("a.lwhCommon-checkButton[scope='" + scope + "'][col][sid]").die("click").live("click", function(ev) {
				if( $(this).hasClass("lwhCommon-checkButton-checked") ) {
					$(this).removeClass("lwhCommon-checkButton-checked");
					$("input", this).val(0);
				} else {
					$(this).addClass("lwhCommon-checkButton-checked");
					$("input", this).val(1);
				}

				if( $(this).attr("col") == "rid" ) 
			    	_self.change( $(this).attr("sid"), $(this).attr("col"), "ridbutton");
				else 
			    	_self.change( $(this).attr("sid"), $(this).attr("col"), "checkbutton");
			});

			_self.initColInfo();
	}();
}


LWH.TABLE.prototype = {
	init:	function() {
		var ntable 		= {};
		ntable.schema 	= {};
		ntable.head 	= {};
		
		$.extend(ntable.schema , 	this.table.schema);
		$.extend(ntable.head,		this.table.head);

		ntable.filter   = {};
		if(this.table.filter) ntable.filter = this.table.filter.output();	

		ntable.head.action 	= "init";
		ntable.head.loading = 1;
		this.ajaxCall(ntable);
	},
	load:	function() {
		var ntable 		= {};
		ntable.schema 	= {};
		ntable.head 	= {};
		$.extend(ntable.schema , 	this.table.schema);
		$.extend(ntable.head,		this.table.head);

		ntable.filter   = {};
		if(this.table.filter) ntable.filter = this.table.filter.output();	

		ntable.head.action 	= "load";
		ntable.head.loading = 1;
		this.ajaxCall(ntable);
	},
	view:	function() {
		var ntable 		= {};
		ntable.schema 	= {};
		ntable.head 	= {};
		$.extend(ntable.schema , 	this.table.schema);
		$.extend(ntable.head,		this.table.head);

		ntable.filter   = {};
		if(this.table.filter) ntable.filter = this.table.filter.output();	
		
		ntable.head.action 	= "view";
		ntable.head.loading = 1;
		this.ajaxCall(ntable);
	},
	search: function() {
		this.table.schema.table.mode = "all";
		this.table.head.pageNo	= 1;
		this.view();
	},
	find: function() {
		this.table.schema.table.mode = "match";
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
	defval: function(colName, dval) {
		var colIdx 	= ArraySearch(this.table.schema.table.cols, "name", colName);
		if( colIdx >= 0 ) {
			if(dval) this.table.schema.table.cols[colIdx].defval = dval;
			return this.table.schema.table.cols[colIdx].defval?this.table.schema.table.cols[colIdx].defval:"";
		} else {
			return "";
		}
	},
	/*** Ajax *****************************************************************************************/
	ajaxCall: function(ntable) {
		var _self = this;
		if(ntable.head.wait) wait_show();
		$("a.lwhTable-navi-button-loading", $("div.lwhTable-navi[scope='" + ntable.head.scope + "']")).removeClass("lwhTable-navi-button-loading-na");
		$("a.lwhTable-navi-button-refresh", $("div.lwhTable-navi[scope='" + ntable.head.scope + "']")).hide();
		$.ajax({
			data: {
				table: ntable
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				if(ntable.head.wait) wait_hide();
			},
			success: function(req, tStatus) {
				if(ntable.head.wait) wait_hide();
				$("a.lwhTable-navi-button-loading", $("div.lwhTable-navi[scope='" + ntable.head.scope + "']")).addClass("lwhTable-navi-button-loading-na");
				$("a.lwhTable-navi-button-refresh", $("div.lwhTable-navi[scope='" + ntable.head.scope + "']")).show();
				
				errorHandler(req);
				
				if( req.errorCode == 0 ) {
					if(req.table.head) {
						$.extend(_self.table.head, 			req.table.head);
						_self.navipage(_self.table.head);
					}
					
					if( req.table.listTables ) {
						_self.table.listTables 				= _self.table.listTables || {};
						_self.table.listTables.checklist 	= _self.table.listTables.checklist || [];
						$.extend(_self.table.listTables.checklist, 	req.table.listTables.checklist);
					}
					
					switch(req.table.head.action) {
						case "init":
						case "load":
						case "view":
							if( req.table.data ) {
								// replace all rows
								_self.table.data = req.table.data;
								
								// refresh rows html
								_self.initData();
								_self.rows(_self.table.head, _self.table.schema, _self.table.data);
							}
							break;
						case "save":
							if( req.table.data ) {
								// update changed rows
								_self.updateRow(req.table.data);
								
								// refresh rows html
								_self.initData();
								_self.rows(_self.table.head, _self.table.schema, _self.table.data);
							}
							break;						
					}
				}
			},
			type: "post",
			url: (ntable.head.url?ntable.head.url:"ajax/lwhTable_ajax.php")
		});
	},
	
	/*** initial all rows  when load data ***/
	initData: function() {
		for(var i = 0; i < this.table.data.length; i++) {
			for(var colName in this.table.data[i]) {
				if( colName != "general" && colName != "sid" ) {
					if( this.table.data[i][colName].state <= 0 ) 
						if(this.table.data[i][colName])	this.table.data[i][colName].oldVal = this.table.data[i][colName].value;
						if(this.table.data[i][colName].valuetext) this.table.data[i][colName].oldValText = this.table.data[i][colName].valuetext;
				}
			}
		}
	},

	/*** initial column information once when construct ***/
	initColInfo: function() {
		for(var j=0 ; j < this.table.schema.table.cols.length; j++) {
			var theCol = this.table.schema.table.cols[j];
			theCol["coltype"] 	= theCol["coltype"]?theCol["coltype"]:"textbox";
			theCol["col"] 		= theCol["col"]?theCol["col"]:theCol["name"];
			theCol["colname"] 	= theCol["colname"]?theCol["colname"]:theCol["name"];
			theCol["coldesc"] 	= theCol["coldesc"]?theCol["coldesc"]:"";
			theCol["align"] 	= theCol["align"]?theCol["align"]:"left";
			theCol["valign"] 	= theCol["valign"]?theCol["valign"]:"middle";
			theCol["width"] 	= theCol["width"]?theCol["width"]:"auto";
			theCol["defval"] 	= theCol["defval"]?theCol["defval"]:"";
	
			theCol["style"] 	= theCol["style"]?theCol["style"]:"";
			theCol["css"] 		= theCol["css"]?theCol["css"]:"";
			theCol["nowrap"] 	= theCol["nowrap"]?" lwhTable-nowrap":"";
			theCol["nl2br"] 	= theCol["nl2br"]?theCol["nl2br"]:0;
			theCol["colsn"] 	= theCol["colsn"]?theCol["colsn"]:0;
			theCol["colnum"] 	= theCol["colnum"]?theCol["colnum"]:0;
			theCol["notnull"] 	= theCol["notnull"]?theCol["notnull"]:0;
			
			switch(theCol["coltype"]) {
				case "hidden":
				case "textbox":
				case "textarea":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"all";
					break;
					
				case "rid":
				case "ridbutton":
				case "select":
				case "radio":
				case "bool":
				case "checkbutton":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"number";
					break;

				case "date":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"date";
					break;
				case "time":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"time";
					break;
				case "datetime":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"datetime";
					break;
				case "ymd":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"date";
					break;
					
				case "checkbox":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"all";
					break;
				case "radiolist":
				case "checklist":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"all";
					break;
				case "radiotext":
				case "checktext":
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"all";
					break;

				default:
					theCol["datatype"] 	= theCol["datatype"]?theCol["datatype"]:"all";
					break;					
			}
		}
	},

	/*** update row when save change ***/
	updateRow: function( rdata ) {
		for(var i = 0; i < rdata.length; i++) {
			var sid = rdata[i].sid;
			var rowObj	= {};
			var rowSN 	= ArraySearch(this.table.data, "sid", sid);
			if( rowSN >= 0 ) {
				rowObj = this.table.data[rowSN];
			}
			
			switch(parseInt(rdata[i].general.state)) {
				case 0:
					break;
				case 1:
					if( rdata[i].general.error ) {
						rowObj.general.state 		= rdata[i].general.state; 
						rowObj.general.error 		= rdata[i].general.error; 
						rowObj.general.errorMessage = rdata[i].general.errorMessage; 
					} else {
						rowObj.general.state 		= 0;
						rowObj.general.error 		= 0;
						rowObj.general.errorMessage 	= "";

					}
		
					for( var colName in rdata[i] ) {
						if( colName != "general" && colName != "sid" ) {
							rowObj[colName].error 			= rdata[i][colName].error;		
							rowObj[colName].errorMessage 	= rdata[i][colName].errorMessage;		

							rowObj[colName].value			= rdata[i][colName].value;		
							if( rdata[i][colName].valuetext != undefined ) rowObj[colName].valuetext = rdata[i][colName].valuetext?rdata[i][colName].valuetext:"";		
		
							if( !rdata[i].general.error ) {
								rowObj[colName].state = 0;		
							}
						}
					}
					break;
				case 2:
					if( rdata[i].general.error ) {
						rowObj.general.state 		= rdata[i].general.state; 
						rowObj.general.error 		= rdata[i].general.error; 
						rowObj.general.errorMessage = rdata[i].general.errorMessage; 
					} else {
						rowObj.sid 					=  rdata[i].general.sid;
						rowObj.general.sid 			=  rdata[i].general.sid;
						rowObj.general.state 		= 0;
						rowObj.general.error 		= 0;
						rowObj.general.errorMessage 	= "";
					}
		
					for( var colName in rdata[i] ) {
						if( colName != "general" && colName != "sid" ) {
							rowObj[colName].error 			= rdata[i][colName].error;		
							rowObj[colName].errorMessage 	= rdata[i][colName].errorMessage;		
							rowObj[colName].value			= rdata[i][colName].value;		
							if( rdata[i][colName].valuetext != undefined ) rowObj[colName].valuetext = rdata[i][colName].valuetext?rdata[i][colName].valuetext:"";		
		
							if( !rdata[i].general.error ) {
								rowObj[colName].state = 0;		
							}
						}
					}
					break;
				case 3:
					if( rdata[i].general.error ) {
						rowObj.general.state 		= rdata[i].general.state; 
						rowObj.general.error 		= rdata[i].general.error; 
						rowObj.general.errorMessage = rdata[i].general.errorMessage; 
					} else {
						rowObj.general.state 		= 0;
						rowObj.general.error 		= 0;
						rowObj.general.errorMessage 	= "";
						this.table.data.splice(rowSN, 1);
					}
					break;
			}
		}
		
	},
	
	
	/*** data rows to html ***/
	navipage: function(oHead) {
		var scope 		= this.table.head.scope;
		var container 	= this.table.head.container;
		if( this.table.html.navi ) { 
			if( $.isFunction(this.table.html.navi) ) {
				this.table.html.navi(oHead);
				return;
			}
		}

		$("div.lwhTable-navi[scope='" + scope + "']").remove();
		var htmlHead = '';
		if( parseInt(oHead.paging) ) {
		//if(	oHead.totalNo > 0 ) {
			htmlHead += '<div class="lwhTable-navi" scope="' + scope + '">';
			htmlHead += '<span style="position:absolute; left:10px;">';
			htmlHead += '<span class="lwhTable-navi-label">' + gcommon.trans[this.table.head.lang].words["page"] + ':</span>';
			htmlHead += '<input name="pageno" type="textbox" class="lwhTable-navi-pageno" scope="' + scope + '" min="0" value="' + oHead.pageNo + '" />';
			htmlHead += '<span class="lwhTable-navi-pineline">/</span><span class="lwhTable-navi-value">' + oHead.pageTotal + '</span>';
			
			var first_status 	= oHead.pageNo<=1 || oHead.pageTotal <=1?' lwhTable-navi-button-first-na':'';
			var prev_status 	= oHead.pageNo<=1 || oHead.pageTotal <=1?' lwhTable-navi-button-prev-na':'';
			var next_status 	= oHead.pageNo>=oHead.pageTotal || oHead.pageTotal <=1?' lwhTable-navi-button-next-na':'';
			var last_status 	= oHead.pageNo>=oHead.pageTotal || oHead.pageTotal <=1?' lwhTable-navi-button-last-na':'';
		
			htmlHead += '<span class="lwhTable-navi-pineline">|</span>';
			htmlHead += '<a class="lwhTable-navi-button lwhTable-navi-button-first' + first_status + '" title="' + gcommon.trans[this.table.head.lang].words["navi.first"] + '" scope="' + scope + '"></a>';
			htmlHead += '<a class="lwhTable-navi-button lwhTable-navi-button-prev' + prev_status + '" title="' + gcommon.trans[this.table.head.lang].words["navi.prev"] + '" scope="' + scope + '"></a>';
			htmlHead += '<a class="lwhTable-navi-button lwhTable-navi-button-next' + next_status + '" title="' + gcommon.trans[this.table.head.lang].words["navi.next"] + '" scope="' + scope + '"></a>';
			htmlHead += '<a class="lwhTable-navi-button lwhTable-navi-button-last' + last_status + '" title="' + gcommon.trans[this.table.head.lang].words["navi.last"] + '" scope="' + scope + '"></a>';
			htmlHead += '<span class="lwhTable-navi-pineline">|</span>';
			htmlHead += '<a class="lwhTable-navi-button lwhTable-navi-button-loading lwhTable-navi-button-loading-na" title="' + gcommon.trans[this.table.head.lang].words["navi.loading"] + '" scope="' + scope + '"></a>';
			htmlHead += '<a class="lwhTable-navi-button lwhTable-navi-button-refresh" title="' + gcommon.trans[this.table.head.lang].words["navi.refresh"] + '" scope="' + scope + '"></a>';
			htmlHead += '<span class="lwhTable-navi-label">' + gcommon.trans[this.table.head.lang].words["total"] + ':</span><span class="lwhTable-navi-value">' + oHead.totalNo + '</span>';
			htmlHead += '</span>';
			
			htmlHead += '<span style="position:absolute;right:2px;">';
			htmlHead += '<select name="pagesize" style="font-size:14px; vertical-align:middle;" scope="' + scope + '">';
			htmlHead += '<option value="10"' + (oHead.pageSize==10?' selected':'') + '>10</option>';
			htmlHead += '<option value="20"' + (oHead.pageSize==20?' selected':'') + '>20</option>';
			htmlHead += '<option value="25"' + (oHead.pageSize==25?' selected':'') + '>25</option>';
			htmlHead += '<option value="40"' + (oHead.pageSize==40?' selected':'') + '>40</option>';
			htmlHead += '<option value="60"' + (oHead.pageSize==60?' selected':'') + '>60</option>';
			htmlHead += '</select>';
			htmlHead += '<span class="lwhTable-navi-pineline">/ ' + gcommon.trans[this.table.head.lang].words["navi.perpage"] + '</span>';
			htmlHead += '</span>';
			
			htmlHead += '<span style="position:absolute;right:130px;top:2px;">';
			var listCSS = oHead.mode?(oHead.mode=="none"?" lwhTable-mode-na":(oHead.mode=="list"?" lwhTable-mode-list-selected":"")):" lwhTable-mode-na";
			htmlHead += '<a class="lwhTable-mode lwhTable-mode-list' + listCSS + '" scope="' + scope + '"></a>';
			htmlHead += '</span>';
			htmlHead += '<span style="position:absolute;right:102px;top:2px;">';
			var viewCSS = oHead.mode?(oHead.mode=="none"?" lwhTable-mode-na":(oHead.mode=="view"?" lwhTable-mode-view-selected":"")):" lwhTable-mode-na";
			htmlHead += '<a class="lwhTable-mode lwhTable-mode-view'  + viewCSS +  '" scope="' + scope + '"></a>';
			htmlHead += '</span>';
			htmlHead += '</div>';
		} else {
			htmlHead += '<div class="lwhTable-navi" scope="' + scope + '">';
			htmlHead += '<a class="lwhTable-navi-button lwhTable-navi-button-loading lwhTable-navi-button-loading-na" title="' + gcommon.trans[this.table.head.lang].words["navi.loading"] + '" scope="' + scope + '" style="margin-left:10px;"></a>';
			htmlHead += '<a class="lwhTable-navi-button lwhTable-navi-button-refresh" title="' + gcommon.trans[this.table.head.lang].words["navi.refresh"] + '" scope="' + scope + '" style="margin-left:10px;"></a>';
			htmlHead += '<span class="lwhTable-navi-label" style="margin-left:10px;">' + gcommon.trans[this.table.head.lang].words["total"] + ':</span><span class="lwhTable-navi-value">' + oHead.totalNo + '</span>';
			htmlHead += '</div>';
		}
		$(container).prepend(htmlHead);
	},

	rows: function(oHead, oSchema, rows) {
		var scope 		= oHead.scope;
		var container 	= oHead.container;
		var htmlRows = '';
		
		
		$("div.lwhTable-mode[scope='" + scope + "']").remove();
		if( !oHead.mode || oHead.mode == "none" ) {
			htmlRows += '<div class="lwhTable-mode lwhTable-mode-none" scope="' + scope + '">';

			if( this.table.html.rows ) { 
				// rows html replacement
				if( $.isFunction(this.table.html.rows) ) htmlRows += this.table.html.rows(oHead, oSchema, rows);
				/************************/
		
			} else {

				/*** table ***/
				htmlRows += '<form name="' + scope + '">';
				htmlRows += '<table border="0" class="lwhTable" cellpadding="5">';
				htmlRows += this.createHeadHTML();
				var rowno = 0;
				for(var i=0 ; i < this.table.data.length; i++) {
					var rowObj 	= this.table.data[i];
					if(rowObj.general.state != 2) rowno++; 
					htmlRows 	+= this.createRowHTML(rowObj, rowno);
				}  // loop for rows
				htmlRows += '</table>';
				htmlRows += '</form>';
				/**************/

			}
			
			htmlRows += '</div>';
			
		} else {
			// gallery mode replacement
			htmlRows += '<div class="lwhTable-mode lwhTable-mode-list" scope="' + scope + '" style="display:' + (oHead.mode=="list"?"block":"none") + ';">';
			
			if( this.table.html.rows ) { 
				// rows html replacement
				if( $.isFunction(this.table.html.rows) ) htmlRows += this.table.html.rows(oHead, oSchema, rows);
				/************************/
		
			} else {
		
				/*** table ***/
				htmlRows += '<form name="' + scope + '">';
				htmlRows += '<table border="0" class="lwhTable" cellpadding="5">';
				htmlRows += this.createHeadHTML();
				var rowno = 0;
				for(var i=0 ; i < this.table.data.length; i++) {
					var rowObj 	= this.table.data[i];
					if(rowObj.general.state != 2) rowno++; 
					htmlRows 	+= this.createRowHTML(rowObj, rowno);
				}  // loop for rows
				htmlRows += '</table>';
				htmlRows += '</form>';
				/************/

			}
			htmlRows += '</div>';

		
			htmlRows += '<div class="lwhTable-mode lwhTable-mode-view" scope="' + scope + '" style="display:' + (oHead.mode=="view"?"block":"none") + ';">';
			if( this.table.html.view ) { 
				if( $.isFunction(this.table.html.view) ) htmlRows +=	this.table.html.view(oHead, oSchema, rows);
			}
			htmlRows += '</div>';
		}
		$(container).append(htmlRows);
		
		$("input.lwhTable-date[col][sid][scope]" ).datepicker({
			dateFormat: 'yy-mm-dd',
			showOn: "button",
			buttonImage: "theme/light/common/lwhCommon-calendar.png",
			buttonImageOnly: true
		});
		
	},
	
	createHeadHTML: function() {
		var scope 		= this.table.head.scope;
		var container 	= this.table.head.container;
		var htmlRows = '';
		htmlRows += '<tr class="lwhTable-tr-header" scope="' + scope + '">';
		for(var j=0 ; j < this.table.schema.table.cols.length; j++) {
			var colObj = this.table.schema.table.cols[j];

			switch(colObj["coltype"]) {
				case "hidden":
					break;
				case "rowno":
				case "text":
				case "textbox":
				case "textarea":

				case "rid":
				case "ridbutton":
				case "select":
				case "radio":
				case "bool":
				case "checkbutton":
				case "date":
				case "time":
				case "datetime":
				case "intdate":
				case "intdatetime":
				case "ymd":
				case "thumb":

				case "checkbox":
				case "radiolist":
				case "checklist":
				case "radiotext":
				case "checktext":
				
					htmlRows += '<th align="center" valign="middle" width="' + colObj["width"] + '" title="' + colObj["coldesc"] + '" col="' + colObj["col"] + '" scope="' + this.table.head.scope + '">';
					htmlRows += colObj["colname"];
					if( colObj["sort"] ) {
						this.table.head.orderSN = this.table.head.orderSN?this.table.head.orderSN:"ASC";
						var sortCSS = '';
						if( this.table.head.orderBY==colObj["col"] ) {
							sortCSS = ' lwhTable-sort-' + this.table.head.orderSN.toLowerCase(); 
						}
						htmlRows += ' <a class="lwhTable-sort' + sortCSS + '" col="' + colObj["col"] + '" scope="' + this.table.head.scope + '"></a>';
					}
					htmlRows += '</th>';
					break;
			
				case "icon":
					htmlRows += '<th align="left" valign="middle" width="' + colObj["width"] + '" title="' + colObj["coldesc"] + '" col="' + colObj["col"] + '" scope="' + scope + '">';
					for(var k = 0; k < this.table.buttons.head.icon.length; k++) {
						var btnObj = this.table.buttons.head.icon[k];
						var btnAct	= " lwhCommon-icon18-" + btnObj.key;
						var btnSta	= this.headBtnState(btnObj.key)?"": btnAct + "-na";
						htmlRows += '<a class="lwhTable-head-button lwhCommon-icon18' + btnAct + btnSta + '" title="'+ gcommon.trans[this.table.head.lang].words["button." + btnObj.key] + '" act="' + btnObj.key + '" scope="' + scope + '"></a>';
					}
					htmlRows += '</th>';
					break;
			}
		}
		htmlRows += '</tr>';
		return htmlRows;
	},
	createRowHTML: function(rowObj, rowno) {
		var scope 		= this.table.head.scope;
		var container 	= this.table.head.container;

		var htmlRows = '<tr class="lwhTable-tr" sid="' + rowObj.general.sid + '" scope="' + scope + '">';
		for(var j=0 ; j < this.table.schema.table.cols.length; j++) {
			var colObj = this.table.schema.table.cols[j];

			switch(colObj["coltype"]) {
				case "hidden":
					break;
				case "rowno":
					htmlRows += '<td class="lwhTable-td" title="" align="center" valign="middle" rowno="' + rowno + '" col="rowno" sid="' + rowObj.general.sid  + '" scope="' + scope + '" width="' + colObj["width"] + '">';

					var rowST = rowno;
					if(rowObj.general.error) 
						rowST = '<a class="lwhCommon-state18 lwhCommon-state18-4" title="' + rowObj.general.errorMessage.replaceAll("'","\'") + '"></a>';
					else if(rowObj.general.state) 
						rowST = '<a class="lwhCommon-state18 lwhCommon-state18-' + rowObj.general.state + '"></a>';

					htmlRows += rowST;
					htmlRows += '</td>';
					break;
				case "text":
					if(colObj["nl2br"]) {
						htmlRows += '<td class="lwhTable-td" title="' + (rowObj[colObj["col"]].value?rowObj[colObj["col"]].value:"") + '" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="' + colObj["width"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
						htmlRows += '<span class="' + colObj["css"] + colObj["nowrap"] + '" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colObj["style"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
						htmlRows += rowObj[colObj["col"]].value?rowObj[colObj["col"]].value.nl2br():"";
						htmlRows += '</span>';
						htmlRows += '</td>';
					} else {
						htmlRows += '<td class="lwhTable-td" title="' + (rowObj[colObj["col"]].value?rowObj[colObj["col"]].value:"") + '" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="' + colObj["width"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
						htmlRows += '<span class="' + colObj["css"] + colObj["nowrap"] + '" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colObj["style"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
						htmlRows += rowObj[colObj["col"]].value?rowObj[colObj["col"]].value:"";
						htmlRows += '</span>';
						htmlRows += '</td>';
					}
					break;

				case "rid":
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="rid" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<label class="lwhTable-input '+ colObj["css"] + ( parseInt(rowObj["general"]["refcheck"])?' lwhTable-input-selected':'') + '" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colObj["style"] + '" col="rid" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + inputTitle + '">';
					htmlRows += '<input type="checkbox" onclick="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\', \'rid\', \'rid\')" name="rid" col="rid" sid="' + rowObj.general.sid  + '" scope="' + scope + '" ' + ( parseInt(rowObj["general"]["refcheck"])?'checked="checked"':'') + ' value="1" /> ';
					htmlRows +=  parseInt(colObj["hide"])?'':colObj["colname"];
					htmlRows += '</label>';
					htmlRows += '</td>';
					break;

				case "ridbutton":
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<a class="lwhCommon-checkButton '+ (parseInt(rowObj["general"]["refcheck"])?' lwhCommon-checkButton-checked':'') + '" name="rid" col="rid" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + colObj["colname"] + '"></a>';
					htmlRows += '</td>';
					break;

				case "textbox":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<input type="textbox" onkeyup="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'textbox\')" title="' + inputTitle + '" class="lwhTable-input '+ colObj["css"] + inputError + '" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" value="' + rowObj[colObj["col"]].value + '" />';
					htmlRows += '</td>';
					break;
				case "textarea":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<textarea onkeyup="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'textarea\')" title="' + inputTitle + '" class="lwhTable-textarea '+ colObj["css"] + inputError + '" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows +=  rowObj[colObj["col"]].value;
					htmlRows += '</textarea>';
					htmlRows += '</td>';
					break;

				case "select":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					if( this.table.listTables.checklist[colObj["col"]] ) {
						htmlRows += '<select onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'select\')" title="' + inputTitle + '" class="lwhTable-input '+ colObj["css"] + inputError + '" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + colObj["coldesc"] + '">';
						htmlRows += '<option ' + (rowObj[colObj["col"]].value==""?'selected':'') + ' value=""></option>';
						for(var k = 0; k < this.table.listTables.checklist[colObj["col"]].length; k++) {
							var listObj = this.table.listTables.checklist[colObj["col"]][k];
							htmlRows += '<option ' + (rowObj[colObj["col"]].value==listObj.key?'selected':'') + ' value="' + listObj.key + '">';
							if(colObj["colsn"]) htmlRows += (k + 1) + ".";
							htmlRows +=  listObj.title;
							//htmlRows +=  '[' + rowObj[colName].value + ":" + listObj.key + ']';
							htmlRows += '</option> ';
						}
						htmlRows += '</select>';
					}	
					htmlRows += '</td>';
					break;
				case "radio":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];

					var colNum = colObj["colnum"];	
					var colStyle = colNum>0?"white-space:nowrap;":"";
					htmlRows += '<td class="lwhTable-td" style="' + colStyle + '" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<div class="' +inputError + '" title="' + inputTitle + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					if( this.table.listTables.checklist[colObj["col"]] ) {
						var colcnt = 0;
						for(var k = 0; k < this.table.listTables.checklist[colObj["col"]].length; k++) {
							var listObj = this.table.listTables.checklist[colObj["col"]][k];
							htmlRows += '<label class="lwhTable-input '+ colObj["css"] + (rowObj[colObj["col"]].value==listObj.key?' lwhTable-input-selected':'') + '" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colStyle + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + listObj.desc + '">';
							htmlRows += '<input type="radio" onclick="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'radio\')" name="' + colObj["name"] + '.' + rowObj.general.sid + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" ' + (rowObj[colObj["col"]].value==listObj.key?'checked':'') + ' value="' + listObj.key + '" />';
							if(colObj["colsn"]) htmlRows += (k + 1) + ".";
							htmlRows +=  listObj.title;
							//htmlRows +=  '[' + rowObj[colName].value + ":" + listObj.key + ']';
							htmlRows += '</label> ';
							colcnt++;
							if(colNum > 0 && colcnt % colNum == 0) htmlRows += '<br />';
						}
					}	
					htmlRows += '</div> ';
					htmlRows += '</td>';
					break;

				case "bool":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["coldesc"];
					
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<label class="lwhTable-input '+ colObj["css"] + (rowObj[colObj["col"]].value?' lwhTable-input-selected':'') + inputError +'" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colObj["style"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + inputTitle + '">';
					htmlRows += '<input type="checkbox" onclick="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'bool\')" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" ' + (rowObj[colObj["col"]].value?'checked="checked"':'') + ' value="1" /> ';
					htmlRows +=  parseInt(colObj["hide"])?'':colObj["colname"];
					htmlRows += '</label>';
					htmlRows += '</td>';
					break;

				case "checkbutton":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["coldesc"];
					
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<a class="lwhCommon-checkButton '+ (parseInt(rowObj[colObj["col"]].value)?' lwhCommon-checkButton-checked':'') + inputError +'" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + inputTitle + '"></a>';
					htmlRows += '</td>';
					break;
				
				case "checkbox":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];

					var colNum 		= colObj["colnum"]?colObj["colnum"]:0;	
					var colStyle 	= colNum>0?"white-space:nowrap;":"";
					var valArr 		= [];
					if(rowObj[colObj["col"]])	if(rowObj[colObj["col"]].value) valArr = rowObj[colObj["col"]].value.split(",");
					htmlRows += '<td class="lwhTable-td" style="' + colStyle + '" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<div class="' +inputError + '" title="' + inputTitle + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					if( this.table.listTables.checklist[colObj["col"]] ) {
						var colcnt = 0;
						for(var k = 0; k < this.table.listTables.checklist[colObj["col"]].length; k++) {
							var listObj = this.table.listTables.checklist[colObj["col"]][k];
							htmlRows += '<label class="lwhTable-input '+ colObj["css"] + (valArr.indexOf(listObj.key)>=0?' lwhTable-input-selected':'') + '" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colStyle + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + listObj.desc + '">';
							htmlRows += '<input type="checkbox" onclick="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'checkbox\')" name="' + colObj["name"] + '.' + rowObj.general.sid + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" ' + (valArr.indexOf(listObj.key)>=0?'checked':'') + ' value="' + listObj.key + '" />';
							if(colObj["colsn"]) htmlRows += (k + 1) + ".";
							htmlRows +=  listObj.title;
							//htmlRows +=  '[' + rowObj[colName].value + ":" + listObj.key + ']';
							htmlRows += '</label> ';
							colcnt++;
							if(colNum > 0 && colcnt % colNum == 0) htmlRows += '<br />';
						}
					}	
					htmlRows += '</div> ';
					htmlRows += '</td>';
					break;

				case "radiolist":
				case "checklist":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:"";
					
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<a class="lwhTable-button-search lwhTable-option" onclick="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'checklist\')" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '"></a>';
					htmlRows += '<span class="lwhTable-option-error" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows +=  inputTitle;
					htmlRows += '</span>';
					htmlRows += '<input class="lwhTable-option" type="hidden" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" value="' + rowObj[colObj["col"]]["value"] + '" /> ';
					htmlRows += '<span class="lwhTable-option" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows +=  rowObj[colObj["col"]]["valuetext"];
					htmlRows += '</span>';
					htmlRows += '</td>';
					break;
				case "radiotext":
				case "checktext":
					htmlRows += '<td class="lwhTable-td" title="' + (rowObj[colObj["col"]].valuetext?rowObj[colObj["col"]].valuetext:"") + '" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="' + colObj["width"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<span class="lwhTable-option-text" style="width:' + (colObj["width"]=="auto"?"auto":colObj["width"]+"px") + ';' + colObj["style"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += rowObj[colObj["col"]].valuetext?rowObj[colObj["col"]].valuetext:"";
					htmlRows += '</span>';
					htmlRows += '</td>';
					break;
				case "date":
					var inputError = rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle = rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += '<input type="textbox" ';
					htmlRows += 'onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'date\')" ';
					htmlRows += 'onkeyup="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'date\')" ';
					htmlRows += 'title="' + inputTitle + '" class="lwhTable-date '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" value="' + rowObj[colObj["col"]].value + '" />';
					htmlRows += '</td>';
					break;

				case "time":
				
					var colStyle 	= colObj["nowrap"]?"white-space:nowrap;":"";
					var inputError 	= rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle 	= rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];
					var timepart   	= ("" + rowObj[colObj["col"]].value).split(":");
					var timeHH 		= parseInt(timepart[0]);
					var timeMM 		= parseInt(timepart[1]);
					
					htmlRows += '<td class="lwhTable-td" style="' + colStyle + '" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';

					htmlRows += '<select onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'time\')" title="' + inputTitle + '" class="lwhTable-hour '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + colObj["coldesc"] + '">';
					htmlRows += '<option ' + (timeHH==""?'selected':'') + ' value=""></option>';
					for(var k = 0; k <= 23; k++) {
						htmlRows += '<option ' + (timeHH==k?'selected':'') + ' value="' + k + '">';
						htmlRows +=  k;
						htmlRows += '</option> ';
					}
					htmlRows += '</select>';
					htmlRows += ' <b>:</b> ';
					htmlRows += '<select onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'time\')" title="' + inputTitle + '" class="lwhTable-minute '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + colObj["coldesc"] + '">';
					htmlRows += '<option ' + (timeMM==""?'selected':'') + ' value=""></option>';
					for(var k = 0; k <= 59; k++) {
						if( k % 5 == 0 ) {
							htmlRows += '<option ' + (timeMM==k?'selected':'') + ' value="' + k + '">';
							htmlRows +=  ("0" + k).right(2);
							htmlRows += '</option> ';
						}
					}
					htmlRows += '</select>';

					htmlRows += '</td>';
					break;
				
				case "datetime":
					var inputError 	= rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle 	= rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];
					var dtpart 		= ("" + rowObj[colObj["col"]].value).split(" ");
					var datepart 	= dtpart[0]?dtpart[0]:"";
					var timepart   	= (""+dtpart[1]).split(":");
					var timeHH 		= parseInt(timepart[0]);
					var timeMM 		= parseInt(timepart[1]);

					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" style="white-space:nowrap;" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';

					htmlRows += '<input type="textbox" ';
					htmlRows += 'onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'datetime\')" ';
					htmlRows += 'onkeyup="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'datetime\')" ';
					htmlRows += 'title="' + inputTitle + '" class="lwhTable-date '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" value="' + datepart + '" />';

					htmlRows += '<br><span style="display:block; margin-top:5px"></span>';

					htmlRows += '<select onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'datetime\')" title="' + inputTitle + '" class="lwhTable-hour '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + colObj["coldesc"] + '">';
					htmlRows += '<option ' + (timeHH==""?'selected':'') + ' value=""></option>';
					for(var k = 0; k <= 23; k++) {
						htmlRows += '<option ' + (timeHH==k?'selected':'') + ' value="' + k + '">';
						htmlRows +=  k;
						htmlRows += '</option> ';
					}
					htmlRows += '</select>';
					htmlRows += ' <b>:</b> ';
					htmlRows += '<select onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'datetime\')" title="' + inputTitle + '" class="lwhTable-minute '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + colObj["coldesc"] + '">';
					htmlRows += '<option ' + (timeMM==""?'selected':'') + ' value=""></option>';
					for(var k = 0; k <= 59; k++) {
						if( k % 5 == 0 ) {
							htmlRows += '<option ' + (timeMM==k?'selected':'') + ' value="' + k + '">';
							htmlRows +=  ("0" + k).right(2);
							htmlRows += '</option> ';
						}
					}
					htmlRows += '</select>';
					htmlRows += '</td>';
					break;
				case "intdate":
					htmlRows += '<td class="lwhTable-td" title="' + colObj["colname"] + '" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="' + colObj["width"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += ("" + rowObj[colObj["col"]].value).toDate();
					htmlRows += '</td>';
					break;
				case "intdatetime":
					htmlRows += '<td class="lwhTable-td" title="' + colObj["colname"] + '" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="' + colObj["width"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					htmlRows += ("" + rowObj[colObj["col"]].value).toDateTime();
					htmlRows += '</td>';
					break;

				case "ymd":
					var inputError 	= rowObj[colObj["col"]].error?" lwhTable-input-error":"";
					var inputTitle 	= rowObj[colObj["col"]].error?rowObj[colObj["col"]].errorMessage:colObj["colname"];
					var yy 			= rowObj[colObj["col"]].value.yy?rowObj[colObj["col"]].value.yy:"";
					var mm 			= rowObj[colObj["col"]].value.mm?rowObj[colObj["col"]].value.mm:"";
					var dd 			= rowObj[colObj["col"]].value.dd?rowObj[colObj["col"]].value.dd:"";

					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" style="white-space:nowrap;" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';

					htmlRows += '<input type="textbox" onkeyup="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'ymd\')" title="' + inputTitle + '" class="lwhTable-year '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" value="' + yy + '" placeholder="yyyy" maxlength="4" />';

					if(colObj["nowrap"]) htmlRows += '<b>-</b>'; else htmlRows += '<br>'; 

					htmlRows += '<select onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'ymd\')" title="' + inputTitle + '" class="lwhTable-month '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + colObj["coldesc"] + '" placeholder="mm">';
					htmlRows += '<option ' + (mm==""?'selected':'') + ' value="">M</option>';
					for(var k = 1; k <= 12; k++) {
						htmlRows += '<option ' + (mm==k?'selected':'') + ' value="' + k + '">';
						htmlRows +=  k;
						htmlRows += '</option> ';
					}
					htmlRows += '</select>';

					if(colObj["nowrap"]) htmlRows += '<b>-</b>'; else htmlRows += '<br>'; 

					htmlRows += '<select onchange="' + this.table.head.selfObj + '.change(\'' + rowObj.general.sid + '\',\'' + colObj["col"] + '\', \'ymd\')" title="' + inputTitle + '" class="lwhTable-day '+ colObj["css"] + inputError + '" style="' + colObj["style"] + '" name="' + colObj["name"] + '" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + colObj["coldesc"] + '" placeholder="dd">';
					htmlRows += '<option ' + (dd==""?'selected':'') + ' value="">D</option>';
					for(var k = 1; k <= 31; k++) {
							htmlRows += '<option ' + (dd==k?'selected':'') + ' value="' + k + '">';
							htmlRows +=  k;
							htmlRows += '</option> ';
					}
					htmlRows += '</select>';
					htmlRows += '</td>';
					break;

				case "thumb":
					htmlRows += '<td class="lwhTable-td" align="' + colObj["align"] + '" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					if( rowObj[colObj["col"]].value )
						htmlRows += '<a class="lwhTable-image" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '" title="' + gcommon.trans[this.table.head.lang].words["view image"] + '"><img src="' + rowObj[colObj["col"]].value +  '" width="' + colObj["width"] + '" /></a>';
					htmlRows += '</td>';
					break;

				case "icon":
					htmlRows += '<td class="lwhTable-td" style="white-space:nowrap;" align="left" valign="' + colObj["valign"] + '" width="'+ colObj["width"] +'" col="' + colObj["col"] + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '">';
					for(var k = 0; k < this.table.buttons.row.icon.length; k++) {
						var btnObj 	= this.table.buttons.row.icon[k];
						var btnAct	= " lwhCommon-icon18-" + btnObj.key;
						var btnSta	= this.rowBtnState(btnObj.key, rowObj)?"": btnAct + "-na";
						htmlRows += '<a class="lwhTable-row-button lwhCommon-icon18' + btnAct + btnSta + '" title="'+ gcommon.trans[this.table.head.lang].words["button." + btnObj.key] + '" act="' + btnObj.key + '" sid="' + rowObj.general.sid  + '" scope="' + scope + '"></a>';
					}
					htmlRows += '</td>';
					break;
			}
		} // loop for cols			
		htmlRows += '</tr>';
		return htmlRows;
	},
	/*** end of data rows to html ***/


	/*** cancel all ****/	
	resetAll: function() {
		for(var i = this.table.data.length - 1; i >= 0; i--) {
			this.resetRow(this.table.data[i].sid); 
		}
	},

	/*** cancel on the row ***/
	resetRow: function(sid) {
		var scope 	= this.table.head.scope;
		var container 	= this.table.head.container;

		var rowObj	= {};
		var rowSN 	= ArraySearch(this.table.data, "sid", sid);
		if( rowSN >= 0 ) {
			rowObj = this.table.data[rowSN];

			switch( parseInt(rowObj.general.state) ) {
				case 0:
					break;
				case 1:
				case 3:
					// change and delete case:
					for(var j=0 ; j < this.table.schema.table.cols.length; j++) {
						var colObj = this.table.schema.table.cols[j];
						var colType = colObj["coltype"]?colObj["coltype"]:"textbox";
						var colName = colObj["col"]?colObj["col"]:colObj["name"];
						switch(colObj["coltype"]) {
								case "textbox":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:"";
									$("input[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(rowObj[colName].value).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									break;
								case "textarea":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:"";
									$("textarea[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(rowObj[colName].value).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									break;

								case "rid":
									$("input[scope='" + scope + "'][col='rid'][sid='" + sid + "']").attr("checked", parseInt(rowObj["general"]["oldrefcheck"])?true:false).attr("title", colObj["colname"]?colObj["colname"]:"");
									break;

								case "ridbutton":
									if(parseInt(rowObj["general"]["oldrefcheck"])) 
										$("a.lwhCommon-checkButton[scope='" + scope + "'][col='rid'][sid='" + sid + "']").addClass("lwhCommon-checkButton-checked");
									else 
										$("a.lwhCommon-checkButton[scope='" + scope + "'][col='rid'][sid='" + sid + "']").removeClass("lwhCommon-checkButton-checked");
									break;
		
								case "select":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:0;
									$("select[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(rowObj[colName].value).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									break;
								case "radio":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:0;
									$("div[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").removeClass("lwhTable-input-error").attr("title",colObj["colname"]?colObj["colname"]:"");
									$("input:radio[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").attr("checked", false);
									$("input:radio[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").parent().removeClass("lwhTable-input-selected");
									$("input:radio[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "'][value='" + rowObj[colName].value + "']").attr("checked", true);
									$("input:radio[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "'][value='" + rowObj[colName].value + "']").parent().addClass("lwhTable-input-selected");
									break;
								case "bool":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:0;

									$("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").parent().removeClass("lwhTable-input-error").attr("title", colObj["coldesc"]?colObj["coldesc"]:"");
									$("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").attr("checked", rowObj[colName].value?true:false);
		
									if(rowObj[colName].value) 
										$("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").parent().addClass("lwhTable-input-selected");
									else 
										$("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").parent().removeClass("lwhTable-input-selected");
									
									break;

								case "checkbutton":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:0;
									if(rowObj[colName].value) 
										$("a.lwhCommon-checkButton[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").addClass("lwhCommon-checkButton-checked");
									else 
										$("a.lwhCommon-checkButton[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").removeClass("lwhCommon-checkButton-checked");
									
									break;
								
								case "checkbox":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:"";
		
									$("div[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									$("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").attr("checked", false);
									$("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").parent().removeClass("lwhTable-input-selected");
		
									if (rowObj[colName].value && rowObj[colName].value != "") {
										$.map(rowObj[colName].value.split(","), function (n) {
											$("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "'][value='" + n + "']").attr("checked", true);
											$("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "'][value='" + n + "']").parent().addClass("lwhTable-input-selected");
										});
									}
									break;

								case "radiolist":
								case "checklist":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value 	  = rowObj[colName].oldVal?rowObj[colName].oldVal:"";
									rowObj[colName].valuetext = rowObj[colName].oldValText?rowObj[colName].oldValText:"";
									
									$("input.lwhTable-option[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(rowObj[colName].value);
									$("span.lwhTable-option[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").html(rowObj[colName].valuetext);
									break;

								case "radiotext":
								case "checktext":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value 	  = rowObj[colName].oldVal?rowObj[colName].oldVal:"";
									rowObj[colName].valuetext = rowObj[colName].oldValText?rowObj[colName].oldValText:"";
									$("span.lwhTable-option-text[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").html(rowObj[colName].valuetext);
									break;

								case "date":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:"";
									$("input.lwhTable-date[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(rowObj[colName].value).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									break;
								case "time":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:"";

									var timepart   	= rowObj[colObj["col"]].value.split(":");
									var timeHH 		= parseInt(timepart[0]);
									var timeMM 		= parseInt(timepart[1]);
									$("select.lwhTable-hour[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(timeHH).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									$("select.lwhTable-minute[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(timeMM).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									break;
								case "datetime":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:"";

									var dtpart 		= ("" + rowObj[colObj["col"]].value).split(" ");
									var datepart 	= dtpart[0]?dtpart[0]:"";
									var timepart   	= (""+dtpart[1]).split(":");
									var timeHH 		= parseInt(timepart[0]);
									var timeMM 		= parseInt(timepart[1]);

									$("input.lwhTable-date[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(datepart).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									$("select.lwhTable-hour[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(timeHH).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									$("select.lwhTable-minute[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(timeMM).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									break;
								case "ymd":
									rowObj[colName].state = 0;
									rowObj[colName].error = 0;
									rowObj[colName].errorMessage = "";
									rowObj[colName].value = rowObj[colName].oldVal?rowObj[colName].oldVal:{"yy":"", "mm":"", "dd":""};
				
									var yy 	= rowObj[colName].value.yy?rowObj[colName].value.yy:"";
									var mm 	= rowObj[colName].value.mm?rowObj[colName].value.mm:"";
									var dd 	= rowObj[colName].value.dd?rowObj[colName].value.dd:"";

									$("input.lwhTable-year[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(yy).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									$("select.lwhTable-month[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(mm).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									$("select.lwhTable-day[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val(dd).removeClass("lwhTable-input-error").attr("title", colObj["colname"]?colObj["colname"]:"");
									break;
						}
					} // for
					rowObj.general.state = 0;
					rowObj.general.error = 0;
					rowObj.general.errorMessage = "";
					
					this.rowState(rowObj, 0);
					// end of change and delete case
					break;
				case 2:
					rowObj.general.state = 3;
					rowObj.general.error = 0;
					rowObj.general.errorMessage = "";
					this.resetRow(rowObj.sid);
					$("table.lwhTable tr.lwhTable-tr[scope='" + scope + "'][sid='" + rowObj.general.sid + "']").remove();
					this.table.data.shift(rowObj);
					break;
			}
			
		} // end rowSN >=0 
	},
	
	// add new row 
	addRow: function() {
		var scope 	= this.table.head.scope;
		var container 	= this.table.head.container;

		var rowObj	= {};
		rowObj.general = {};
		rowObj.sid 	= -1;
		rowObj.general.state 	= 2;
		rowObj.general.sid 		= -1;
		if( this.table.schema.table.reftable != "" ) {
			rowObj.general.rid 			= -1;
			rowObj.general.refcheck 	= 0;
			rowObj.general.oldrefcheck 	= 0;
			if(this.table.schema.table.pid != "") {
				rowObj.general.pid 		= this.table.schema.table.pval;
			}
		}
		rowObj.general.error 	= 0;
		rowObj.general.errorMessage = "";

		for(var j=0 ; j < this.table.schema.table.cols.length; j++) {
			var colObj = this.table.schema.table.cols[j];

			var colType = colObj["coltype"]?colObj["coltype"]:"textbox";
			var colName = colObj["col"]?colObj["col"]:colObj["name"];
			switch(colObj["coltype"]) {
					case "hidden":
					case "text":
					case "textbox":
					case "textarea":
					case "checkbox":
					case "date":
					case "time":
					case "datetime":
					case "intdate":
					case "intdatetime":
					case "ymd":
					case "thumb":
						var defVal 	= colObj["defval"]?colObj["defval"]:"";
						rowObj[colName] = rowObj[colName] || {};
						rowObj[colName].state = 0;
						rowObj[colName].error = 0;
						rowObj[colName].errorMessage = "";
						rowObj[colName].value 	= defVal;
						rowObj[colName].oldVal 	= defVal;
						break;
					case "radiolist":
					case "checklist":
						var defVal 	= colObj["defval"]?colObj["defval"]:"";
						var defText = colObj["deftext"]?colObj["deftext"]:"";
						rowObj[colName] = rowObj[colName] || {};
						rowObj[colName].state = 0;
						rowObj[colName].error = 0;
						rowObj[colName].errorMessage = "";
						rowObj[colName].value 		= defVal;
						rowObj[colName].valuetext 	= defText;
						
						rowObj[colName].oldVal 		= defVal;
						rowObj[colName].oldValText 	= defText;
						break;
					case "radiotext":
					case "checktext":
						var defVal 	= colObj["defval"]?colObj["defval"]:"";
						var defText = colObj["deftext"]?colObj["deftext"]:"";
						rowObj[colName] = rowObj[colName] || {};
						rowObj[colName].state = 0;
						rowObj[colName].error = 0;
						rowObj[colName].errorMessage = "";
						rowObj[colName].value 		= defVal;
						rowObj[colName].valuetext 	= defText;
						
						rowObj[colName].oldVal 		= defVal;
						rowObj[colName].oldValText 	= defText;
						break;

					case "select":
					case "radio":
					case "bool":
					case "checkbutton":
						var defVal = colObj["defval"]?colObj["defval"]:0;
						rowObj[colName] = rowObj[colName] || {};
						rowObj[colName].state = 0;
						rowObj[colName].error = 0;
						rowObj[colName].errorMessage = "";
						rowObj[colName].value 	= defVal;
						rowObj[colName].oldVal 	= defVal;
						break;
			}
		} // for
		htmlRow = this.createRowHTML(rowObj, -1);
		$("table.lwhTable tr.lwhTable-tr-header").after(htmlRow);
		
		this.table.data.unshift(rowObj);
		this.rowState(rowObj, 2);

		$("input.lwhTable-date[col][sid='" + rowObj.sid + "'][scope='" + scope + "']" ).datepicker({
			dateFormat: 'yy-mm-dd',
			showOn: "button",
			buttonImage: "theme/light/common/lwhCommon-calendar.png",
			buttonImageOnly: true
		});
	},
	
	// delete row button
	deleteRow: function(sid) {
		var scope 	= this.table.head.scope;
		var container 	= this.table.head.container;

		var rowSN 	= ArraySearch(this.table.data, "sid", sid);
		if( rowSN >= 0 ) {
			var rowObj = this.table.data[rowSN];
			rowObj.general.state = 3;
			rowObj.general.error = 0;
			rowObj.general.errorMessage = "";
			this.rowState(rowObj, 3);
		} // end rowSN >=0 
	},

	// save all rows change
	saveAll: function() {
		var saveData = [];
		for(var i = 0; i < this.table.data.length; i++) {
			var upRow = this.getRow(this.table.data[i].sid);
			if(upRow) saveData.push(upRow);
		}

		var ntable 		= {};
		ntable.schema 	= {};
		ntable.head 	= {};
		$.extend(ntable.schema , 	this.table.schema);
		$.extend(ntable.head,		this.table.head);

		ntable.head.action 	= "save";
		ntable.head.loading = 1;

		ntable.data = saveData;

		this.ajaxCall(ntable);
	},

	// save the row change . one row
	saveRow: function(sid) {
		var saveData = [];
		var upRow = this.getRow(sid);
		if(upRow) saveData.push(upRow);


		var ntable 		= {};
		ntable.schema 	= {};
		ntable.head 	= {};
		$.extend(ntable.schema , 	this.table.schema);
		$.extend(ntable.head,		this.table.head);

		ntable.head.action 	= "save";
		ntable.head.loading = 1;

		ntable.data = saveData;

		this.ajaxCall(ntable);
	},
	
	// to get change row.   
	// case 1:  only get  changed column
	// case 2:  get all columns for add case
	// case 3:  only get general column include sid value to delete
	getRow: function(sid) {
		var scope 		= this.table.head.scope;
		var rowSN 	= ArraySearch(this.table.data, "sid", sid);
		var upRow 	= null;
		if( rowSN >= 0 ) {
			var rowObj = this.table.data[rowSN];
			switch( parseInt(rowObj.general.state) ) {
				case 0:
					break;
				case 1:
					upRow = {};
					upRow.general 	= rowObj.general;
					upRow.sid 		= rowObj.sid;
					
					for(var colName in rowObj) {
						if( colName != "general" && colName != "sid" ) {
							var colSN 	= ArraySearch(this.table.schema.table.cols, "name", colName);
							var colObj 	= this.table.schema.table.cols[colSN];
							if( (rowObj.general.state == 1 && (rowObj[colName].state >= 1 || parseInt(colObj["notnull"]))) || parseInt(colObj["need"]) ) {
									switch(colObj["coltype"]) {
										case "radiolist": 
										case "checklist": 
											upRow[colName]				= upRow[colName] || {};
											upRow[colName].state 		= rowObj[colName].state; 
											upRow[colName].error 		= rowObj[colName].error; 
											upRow[colName].errorMessage = rowObj[colName].errorMessage; 
											rowObj[colName].value	    = $("input.lwhTable-option[scope='" + scope+ "'][col='" + colName + "'][sid='" + rowObj.sid+ "']").val();
											rowObj[colName].valuetext	= $("span.lwhTable-option[scope='" + scope+ "'][col='" + colName + "'][sid='" + rowObj.sid+ "']").html();
											upRow[colName].value 		= rowObj[colName].value;
											break;
											
										default:
											upRow[colName]				= upRow[colName] || {};
											upRow[colName].state 		= rowObj[colName].state; 
											upRow[colName].error 		= rowObj[colName].error; 
											upRow[colName].errorMessage = rowObj[colName].errorMessage; 
											upRow[colName].value 		= rowObj[colName].value; 
											break;
									}
							}
						}
					}
					
					break;
				case 2:
					upRow = {};
					upRow.general 	= rowObj.general;
					upRow.sid 		= rowObj.sid;

					for(var j=0 ; j < this.table.schema.table.cols.length; j++) {
						var colObj = this.table.schema.table.cols[j];
						var colName = colObj["col"]?colObj["col"]:colObj["name"];
						switch(colObj["coltype"]) {
								case "hidden":
								case "textbox":
								case "textarea":
								case "select":
								case "radio":
								case "bool":
								case "checkbutton":
								case "checkbox":
								case "date":
								case "time":
								case "datetime":
								case "ymd":
								case "radiotext":
								case "checktext":
									upRow[colName]				= upRow[colName] || {};
									upRow[colName].state 		= rowObj[colName].state; 
									upRow[colName].error 		= rowObj[colName].error; 
									upRow[colName].errorMessage = rowObj[colName].errorMessage; 
									upRow[colName].value 		= rowObj[colName].value; 
									break;
								case "radiolist": 
								case "checklist": 
									upRow[colName]				= upRow[colName] || {};
									upRow[colName].state 		= rowObj[colName].state; 
									upRow[colName].error 		= rowObj[colName].error; 
									upRow[colName].errorMessage = rowObj[colName].errorMessage; 
									rowObj[colName].value	    = $("input.lwhTable-option[scope='" + scope+ "'][col='" + colName + "'][sid='" + rowObj.sid+ "']").val();
									rowObj[colName].valuetext	= $("span.lwhTable-option[scope='" + scope+ "'][col='" + colName + "'][sid='" + rowObj.sid+ "']").html();
									upRow[colName].value 		= rowObj[colName].value;
									break;
						}
					} // for
					break;
				case 3:
					upRow = {};
					upRow.general 	= rowObj.general;
					upRow.sid 		= rowObj.sid;
					break;
			}
		} // end rowSN >=0 
		return upRow;
	},

	// column change detect event			
	change: function(sid, colName, colType) {
		var scope 		= this.table.head.scope;
		var container 	= this.table.head.container;
		var rowObj	= {};
		var rowSN 	= ArraySearch(this.table.data, "sid", sid);
		if( rowSN >=0 ) {
			rowObj = this.table.data[rowSN];
			switch(colType) {
				case "textbox":
					if(rowObj[colName].oldVal==null) rowObj[colName].oldVal = rowObj[colName].value;
					rowObj[colName].value = $("input[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
				case "textarea":
					if(rowObj[colName].oldVal==null) rowObj[colName].oldVal = rowObj[colName].value;
					rowObj[colName].value = $("textarea[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
				
				case "rid":
					if( rowObj["general"].oldrefcheck == null ) rowObj["general"].oldrefcheck = rowObj["general"].refcheck;
					var refval = $("input[scope='" + scope + "'][col='rid'][sid='" + sid + "']").is(":checked")?parseInt($("input[scope='" + scope + "'][col='rid'][sid='" + sid + "']").val()):0;
					rowObj["general"].refcheck = refval;
					this.rowState(rowObj, 1);
					break;

				case "ridbutton":
					if( rowObj["general"].oldrefcheck == null ) rowObj["general"].oldrefcheck = rowObj["general"].refcheck;
					var refval = $("a.lwhCommon-checkButton[scope='" + scope + "'][col='rid'][sid='" + sid + "']").hasClass("lwhCommon-checkButton-checked")?1:0;
					rowObj["general"].refcheck = refval;
					this.rowState(rowObj, 1);
					break;

				case "select":
					if(rowObj[colName].oldVal==null) rowObj[colName].oldVal = rowObj[colName].value;
					rowObj[colName].value = $("select[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
				case "radio":
					if(rowObj[colName].oldVal==null) rowObj[colName].oldVal = rowObj[colName].value;
					rowObj[colName].value = $("input:radio[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']:checked").val();

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
				case "bool":
					if(rowObj[colName].oldVal==null) rowObj[colName].oldVal = rowObj[colName].value;
					rowObj[colName].value = $("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").is(":checked")?1:0;

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;

				case "checkbutton":
					if(rowObj[colName].oldVal==null) rowObj[colName].oldVal = rowObj[colName].value;
					rowObj[colName].value = $("a.lwhCommon-checkButton[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").hasClass("lwhCommon-checkButton-checked")?1:0;

					if( parseInt(rowObj[colName].value) != parseInt(rowObj[colName].oldVal) ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;


				case "checkbox":
					if(rowObj[colName].oldVal==null) rowObj[colName].oldVal = rowObj[colName].value;
					var ck_val = $("input:checkbox[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']:checked").map(function () { return $(this).val(); }).get().join(",");
					rowObj[colName].value = ck_val.sort();

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;

				case "radiolist":
				case "checklist":
					rowObj[colName].value 		= rowObj[colName].value?rowObj[colName].value:"";
					rowObj[colName].valuetext 	= rowObj[colName].value?rowObj[colName].valuetext:"";
					rowObj[colName].oldVal = rowObj[colName].oldVal?rowObj[colName].oldVal:"";
					rowObj[colName].oldValText = rowObj[colName].oldValText?rowObj[colName].oldValText:"";
					
					rowObj[colName].value = $("input.lwhTable-option[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					$("span.lwhTable-option-error[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").html("");
					
					if( true ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
				
				case "radiotext":
				case "checktext":
					rowObj[colName].state = 1;
					break;
				case "date":
					rowObj[colName].value = $("input.lwhTable-date[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
				case "time":
					var timeHH = $("select.lwhTable-hour[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					var timeMM = $("select.lwhTable-minute[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					rowObj[colName].value = ("0"+timeHH).right(2) + ":" + ("0" + timeMM).right(2);

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
				case "datetime":
					var datepart = $("input.lwhTable-date[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					var timeHH = $("select.lwhTable-hour[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					var timeMM = $("select.lwhTable-minute[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					rowObj[colName].value = datepart + " " + ("00"+timeHH).right(2) + ":" + ("00" + timeMM).right(2);

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
				case "ymd":
					var yy = $("input.lwhTable-year[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					var mm = $("select.lwhTable-month[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					var dd = $("select.lwhTable-day[scope='" + scope + "'][col='" + colName + "'][sid='" + sid + "']").val();
					rowObj[colName].value = { "yy": yy, "mm":mm, "dd":dd };
					rowObj[colName].state = 1;
					rowObj[colName].error 			= 0;
					rowObj[colName].errorMessage 	= "";

					if( rowObj[colName].value != rowObj[colName].oldVal ) {
						if(rowObj[colName].state<=0) {
							rowObj[colName].state = 1;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 1);
					} else {
						if(rowObj[colName].state<=1) {
							rowObj[colName].state = 0;
							rowObj[colName].error 			= 0;
							rowObj[colName].errorMessage 	= "";
						}
						this.rowState(rowObj, 0);
					}
					break;
			}
		}
	},
	
	/***  re-calculate row-state when  column field value change ***/
	rowState: function(rowObj, rst) {
		if(rst!=undefined) {
			var maxState 	= 0;
			var maxError	= 0;
			var maxMsg		= "";
			for(var colName in rowObj) {
				if( colName != "general" && colName != "sid" ) {
					maxState = Math.max(maxState, rowObj[colName].state);
					maxError = Math.max(maxError, rowObj[colName].error);
					maxMsg 	+= (maxMsg!="" && rowObj[colName].errorMessage!=""?"\n":"") + rowObj[colName].errorMessage;
				}	
			}
			rowObj.general.state = Math.max(rowObj.general.state, maxState, rst);
			rowObj.general.error = Math.max(rowObj.general.error, maxError);
			rowObj.general.errorMessage = maxMsg;
			this.rowIconState(rowObj);
			this.rowStatus(rowObj);
			this.headIconState();
		} 
		return rowObj.general.state;
	},
	
	
	/*** row-state,  row-icons,  row-head-icons ***/
	rowStatus: function(rowObj) {
		var scope 	= this.table.head.scope;
		var container 	= this.table.head.container;
		
		var rowST = $("td.lwhTable-td[scope='" + scope + "'][col='rowno'][sid='" + rowObj.sid + "']").attr("rowno");
		if(rowObj.general.error) 
			rowST = '<a class="lwhCommon-state18 lwhCommon-state18-4" title="' + rowObj.general.errorMessage + '"></a>';
		else if(rowObj.general.state) 
			rowST = '<a class="lwhCommon-state18 lwhCommon-state18-' + rowObj.general.state + '"></a>';

		$("td.lwhTable-td[scope='" + scope + "'][col='rowno'][sid='" + rowObj.sid + "']").html(rowST);
	},
	rowIconState: function(rowObj) {
		var scope 	= this.table.head.scope;
		var container 	= this.table.head.container;

		for(var k = 0; k < this.table.buttons.row.icon.length; k++) {
			var btnObj 	= this.table.buttons.row.icon[k];
			var btnAct	= "lwhCommon-icon18-" + btnObj.key;
			var btnSta	= btnAct + "-na";
			if( this.rowBtnState(btnObj.key, rowObj) ) 
				$("a.lwhTable-row-button[scope='" + scope + "'][act='" + btnObj.key + "'][sid='" + rowObj.sid + "']").removeClass(btnSta);
			else
				$("a.lwhTable-row-button[scope='" + scope + "'][act='" + btnObj.key + "'][sid='" + rowObj.sid + "']").addClass(btnSta);
		}
	},
	headIconState: function() {
		var scope 	= this.table.head.scope;
		var container 	= this.table.head.container;

		for(var k = 0; k < this.table.buttons.head.icon.length; k++) {
			var btnObj 	= this.table.buttons.head.icon[k];
			var btnAct	= "lwhCommon-icon18-" + btnObj.key;
			var btnSta	= btnAct + "-na";
			if( this.headBtnState(btnObj.key) ) 
				$("a.lwhTable-head-button[scope='" + scope + "'][act='" + btnObj.key + "']").removeClass(btnSta);
			else
				$("a.lwhTable-head-button[scope='" + scope + "'][act='" + btnObj.key + "']").addClass(btnSta);
		}
	},
	/********************************************/
	
	/*** determine  head and row icon  show | hide ***/
	rowBtnState: function(btnName, rowObj) {
		var bState 	= false;
		var bst 	= 0;
		if(rowObj.general) bst = rowObj.general.state?rowObj.general.state:0;
		bState 		= this.table.buttons.rights[btnName] && this.rowButton[bst][btnName];
		return bState;
	},
	headBtnState: function(btnName) {
		var bState 	= false;
		var bst 	= 0;
		for(var i=0 ; i < this.table.data.length; i++) {
			var rowObj = this.table.data[i];
			if(rowObj.general) if(rowObj.general.state > bst) bst = rowObj.general.state;
		}
		bState = this.table.buttons.rights[btnName] && this.rowButton[bst][btnName];
		return bState;
	},
	/************************************************/
	
	rowButton: {
        0: { "detail": 1, "save": 0, "add": 1, "delete": 1, "cancel": 0, "print": 1, "output": 1 },
        1: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 },
        2: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 },
        3: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 }
	},
	headButton: {
        0: { "detail": 1, "save": 0, "add": 1, "delete": 0, "cancel": 0, "print": 1, "output": 1 },
        1: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 },
        2: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 },
        3: { "detail": 0, "save": 1, "add": 0, "delete": 0, "cancel": 1, "print": 0, "output": 0 }
	}
	/**************************************************************************************************/
}