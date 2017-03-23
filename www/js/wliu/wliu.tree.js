/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};
// Table Object
WLIU.TREE = function( opts ) {
	this.sc			= null;

	this.lang       = opts.lang?opts.lan:"cn";
	this.scope  	= opts.scope?opts.scope:"";
	this.url		= opts.url?opts.url:"";
	
	this.wait		= opts.wait?opts.wait:"";
	this.rowerror   = opts.rowerror?opts.rowerror:"";
	this.taberror 	= opts.taberror?opts.taberror:"";
	this.autotip 	= opts.autotip?opts.autotip:"";
	
	this.current    = ""; // row guid
	this.action		= "get";
	this.error		= {errorCode:0, errorMessage:""};  // table level error : action rights 
	this.rights 	= {view:1, save:0, cancel:1, clear:1, delete:0, add:1, detail:1, output:0, print:1};
	this.cols 		= {};
	this.rows 		= [];
	this.navi		= { paging:1, pageno: 0, pagesize:20, pagetotal:0, recordtotal:0, match: 1, loading:0, orderby: "", sortby:"" };
	this.filters 	= [];
	this.lists		= {};  // { gender: { loaded: 1, keys: { rowsn: -1, name: "" }, list: [{key:1, value:"Male", desc:""}, {key:2, value:"Female", desc:""}] },  	xxx: {} }
	
	$.extend(this.rights, opts.rights);
	$.extend(this.cols, opts.cols);
	$.extend(this.filters, opts.filters);
	$.extend(this.lists, opts.lists);

    console.log(this.cols);
}

WLIU.TREE.prototype = {
	setScope: function(p_scope, treeName) {
		if( treeName ) {
			p_scope[treeName] = this;
		} else {
			p_scope.tree = this;
		}
		this.sc = p_scope;
	},
	index:  function(guid) {
		return FTABLE.index(this, guid);
	},
	indexByRow: function(theRow) {
		return FTABLE.indexByRow(this, theRow);
	},
	rowstate: function(theRow, p_rowstate) {
		return FROW.rowstate(theRow, p_rowstate);
	},
	keyValue: function(theRow) {
		var keyCol = FCOLLECT.objectByKV(theRow.cols, {key:1});
		return keyCol.value;
	},
	colMeta: function(theRow, col_name) {
		var theCol = this.getCol(theRow, col_name);
		if(theCol) {
			return FCOLLECT.objectByKV(this.cols[theCol.table], {name: col_name});
		} else {
			return undefined;
		}
	},
	colDefault: function(col_name, p_value) {
		return FTABLE.colDefault(this, col_name, p_value);
	},
	colList: function(theRow, col_name) {
		var theCol = this.colMeta(theRow, col_name);
		if( theCol ) {
			return this.lists[theCol.list];
		} else {
			return undefined;
		}
	},
	getList: function(list_name) {
		return FTABLE.getList(this, list_name);
	},

	filterMeta: function(col_name) {
		return FTABLE.filterMeta(this, col_name);
	},
	filterClear: function() {
		return FTABLE.filterClear(this);
	},
	filterValue: function( name, val) {
		return FTABLE.filterValue(this, name, val);
	},
	filterDefault: function( name, val) {
		return FTABLE.filterDefault(this, name, val);
	},
    

	// get row object
	getRow: function(theRow) {
		return theRow;
	},
	// return rows[ridx].cols[index of col_name]
	getCol: function(theRow, col_name) {
		return FCOLLECT.objectByKV(theRow.cols, {name:col_name});
	},
	/********************************************** */


    //  operate the row : table.rows[ridx]
	tableError: function(p_error) {
		return FTABLE.tableError(this, p_error);
	},
	rowError: function(theRow, p_error) {
		return FROW.rowerror(theRow, p_error);
	},
	colError: function(theRow, col_name, p_error) {
		return FROW.colerror(theRow, col_name, p_error);
	},
	/************************************/

	/*** event for external call ***/
	changeCol: function(theRow, col_name) {
		return FTABLE.changeCol(this, theRow, col_name);
	},
	changeColCurrent: function(col_name) {
		return FTABLE.changeColCurrent(this, col_name);
	},
	changeColByGuid: function(guid, col_name) {
		return FTABLE.changeColByGuid(this, guid, col_name);
	},
		
	// ; ridx;  nrow;  ridx nrow ;  default position=0  add to first
	init: function(IDKeyValues, callback) {
		FTABLE.init(this, callback);
	},
	newRow: function(keyvalues) {
		return FTABLE.newRow(this, keyvalues);
	},
	addRow: function(ridx, t_row) {
		return FTABLE.addRow(this, ridx, t_row);
	},
	addChild: function(theRow) {
		var tableLevel = theRow.cols[0].table;
		switch(tableLevel) {
			case "p":
				var newRow = new WLIU.ROW(this.cols.s);
				var keyVal = this.keyValue(theRow);
				newRow.rowstate     = 2;
				newRow.parent    = keyVal;

				theRow.rows = theRow.rows?theRow.rows:[]; 
				theRow.rows.unshift(newRow);
				break;
			case "s":
				var newRow = new WLIU.ROW(this.cols.m);
				var keyVal = this.keyValue(theRow);
				newRow.rowstate     = 2;
				newRow.parent    = keyVal;

				theRow.rows = theRow.rows?theRow.rows:[]; 
				theRow.rows.unshift(newRow);
				break;
			case "m":
				break;
		}
	}, 
	cancelRow: function( theRow ) {
		return FTABLE.cancelRow(this, theRow);
	},
	cancelRows: function() {
		return FTABLE.cancelRows(this);
	},

	// set row col value to empty or defval if it has default value
	resetRow: function(theRow) {
		return FROW.resetRow(theRow);
	},
	removeRow: function(theRow) {
		return FTABLE.removeRow(this, theRow);
	},
	deleteRow: function(theRow) {
		return FTABLE.detachRow(this, theRow);
	},
	deleteRows: function() {
		// none - to danger
	},
	
	/*** ajax method ***/
	saveRow: function(theRow, callback) {
		FTABLE.saveRow(this, theRow, callback);
	},
	saveRows: function(callback) {
		FTABLE.saveRows(this, callback);
	},
	
	// for one2many & many2many 
	getRows: function(callback) {
		var ntable = {};
		ntable.scope = this.scope;
		ntable.lang  = this.lang;
		ntable.action = "get";
		ntable.error    = {errorCode: 0, errorMessage:""};
		ntable.cols     = this.cols; // must provide cols meta to get data from database;
		ntable.filters  = FTABLE.getFilters(this);
		ntable.lists    = FTABLE.getLists(this);
		ntable.rows = [];
		this.ajaxCall(ntable, callback);
	},
	allRows: function(callback) {
		FTABLE.allRows(this, callback);
	},
	matchRows: function(callback) {
		FTABLE.matchRows(this, callback);
	},
	/********************************/

	/*** for form use ***/
	formInit: function(IDKeyValues, callback) {
		FTABLE.init(this, IDKeyValues, callback);
	},
	formNew: function(IDKeyValues, callback) {
		FTABLE.formNew(this, IDKeyValues, callback);
	},
	formGet: function(IDKeyValues, callback) {
		FTABLE.formGet(this, IDKeyValues, callback);
	}, 
	/********************/
	
	/*******************************/
	getRecords: function(IDKeyValues, callback) {
		FTABLE.getRecords(this, IDKeyValues, callback);
	},
	getAgetAllRecords: function(IDKeyValues, callback) {
		FTABLE.getAllRecords(this, IDKeyValues, callback);
	},
	getMatchRecords: function(IDKeyValues, callback) {
		FTABLE.getMatchRecords(this, IDKeyValues, callback);
	},
	// end of one2many & many2many

	ajaxCall: function(ntable, callback) {
		var _self = this;
		if( _self.wait ) $(_self.wait).trigger("show");
		if( callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(table);
		//console.log(table);
		$.ajax({
			data: {
				table:	ntable
			},
			dataType: "json",  
			contentType:"application/x-www-form-urlencoded",
			error: function(xhr, tStatus, errorTh ) {
				if( _self.wait ) $(_self.wait).trigger("hide");
			},
			success: function(req, tStatus) {
				if( _self.wait ) $(_self.wait).trigger("hide");
				if( callback && callback.ajaxAfter && $.isFunction(callback.ajaxAfter) ) callback.ajaxAfter(req.table);

				switch( req.table.action ) {
					case "get":
						FTABLE.setLists(_self, req.table.lists);
						_self.syncRows(req.table);
						break;
					case "add":
						_self.syncError(req.table);
						break;
					case "save":
						_self.syncError(req.table);
						break;
				}
				if(!_self.sc.$$phase) _self.sc.$apply();

				if( parseInt(req.table.error.errorCode) == 0 ) {
					if(callback && callback.ajaxSuccess && $.isFunction(callback.ajaxSuccess) ) callback.ajaxSuccess(req.table);
				} else {
					if(callback && callback.ajaxError && $.isFunction(callback.ajaxError) ) callback.ajaxError(req.table);
				}
				
				$(_self.errorShow).trigger("errorshow");
			},
			type: "post",
			url: _self.url
		});
	},
	syncRows: function(table) {
		this.tableError(table.error);
		this.rows = [];
		
		if(this.cols.p && this.cols.p.length>0) {
			for(var pidx in table.rows) {
				var _p_row 		= table.rows[pidx];
				var prow 		= new WLIU.ROW(this.cols.p, _p_row, this.scope);
				var p_keyvalue  = this.keyValue(prow);
				prow.rowstate 	= 0;
				if(this.cols.s && this.cols.s.length>0) {
					prow.rows 	= [];
					for(var sidx in _p_row.rows) {
						var _s_row 		= _p_row.rows[sidx];
						var srow 		= new WLIU.ROW(this.cols.s, _s_row, this.scope);
						var s_keyvalue 	= this.keyValue(srow);
						srow.rowstate 	= 0;
						srow.parent 	= p_keyvalue;
						if(this.cols.m && this.cols.m.length >0) {
							srow.rows 	= [];
							for(var midx in _s_row.rows) {
								var _m_row 		= _s_row.rows[midx];
								var mrow   		= new WLIU.ROW(this.cols.m, _m_row, this.scope);
								mrow.rowstate 	= 0;
								mrow.parent 	= s_keyvalue;
								srow.rows.push(mrow);
							}
						}
						prow.rows.push(srow);
					}
				}
				this.rows.push(prow);	
			}
		}

		console.log(this);
	}
}
