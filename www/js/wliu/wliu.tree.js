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

	colMeta: function(col_name) {
		return FTABLE.colMeta(this, col_name);
	},
	colDefault: function(col_name, p_value) {
		return FTABLE.colDefault(this, col_name, p_value);
	},
	colList: function(col_name) {
		return FTABLE.colList(this, col_name);
	},
	getList: function(list_name) {
		return FTABLE.getList(this, list_name);
	},

	/*** relationship */
	relationHide: function(theRow, col_name) {
		return FTABLE.relationHide(this, theRow, col_name);
	},
	relationChange: function(theRow) {
		return FTABLE.relationChange(this, theRow); 
	},
	relationHideCurrent: function(col_name) {
		return FTABLE.relationHideCurrent(this, col_name);
	},
	relationChangeCurrent: function() {
		return FTABLE.relationChangeCurrent(this); 
	},
	/******************/

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
		return FTABLE.getRow(this, theRow);
	},
	getRowByGuid: function(guid) {
		return FTABLE.getRowByGuid(this, guid);
	},
	getCurrent: function() {
		return FTABLE.getCurrent(this);
	},
	// return rows[ridx].cols[index of col_name]
	getCol: function(theRow, col_name) {
		return FTABLE.getCol(this, theRow, col_name);
	},
	getColCurrent: function(col_name) {
		return FTABLE.getColCurrent(this, col_name);
	},
	getColByGuid: function(guid, col_name) {
		return FTABLE.getColByGuid(this, guid, col_name);
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
		
	setImage: function(theRow, col_name, oImg) {
		return FTABLE.setImage(this, theRow, col_name, oImg);
	},
	setImageCurrent: function(col_name, oImg) {
		return FTABLE.setImageCurrent(this, col_name, oImg);
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

				if( parseInt(req.table.errorCode) == 0 ) {
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
        /*
		this.errorCode 		= nimages.errorCode;
		this.errorMessage 	= nimages.errorMessage;
		this.config = angular.copy(nimages.config);
		this.rows = [];
		for(var ridx in nimages.rows) {
			var theRow 		= nimages.rows[ridx];
			theRow.sn  		= parseInt(nimages.rows[ridx].orderno);
			this.rows.push( new WLIU.IMAGE(theRow) );	
		}
        */
	}
    
	
}
