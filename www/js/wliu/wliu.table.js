/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};
// Table Object
WLIU.TABLE = function( opts ) {
	this.sc			= null;

	this.lang       = opts.lang?opts.lan:"cn";
	this.scope  	= opts.scope?opts.scope:"";
	this.url		= opts.url?opts.url:"";
	
	this.wait		= opts.wait?opts.wait:"";
	this.rowerror   = opts.rowerror?opts.rowerror:"";
	this.taberror 	= opts.taberror?opts.taberror:"";
	this.autotip 	= opts.autotip?opts.autotip:"";
	
	this._rowno 	= -1; // private for rowno
	this.action		= "get";
	this.error		= {errorCode:0, errorMessage:""};  // table level error : action rights 
	this.rights 	= {view:1, save:0, cancel:1, clear:1, delete:0, add:1, detail:1, output:0, print:1};
	this.cols 		= [];
	this.rows 		= [];
	this.navi		= { paging:1, pageno: 0, pagesize:20, pagetotal:0, recordtotal:0, match: 1, loading:0, orderby: "", sortby:"" };
	this.filters 	= [];
	this.lists		= {};  // { gender: { loaded: 1, keys: { rowsn: -1, name: "" }, list: [{key:1, value:"Male", desc:""}, {key:2, value:"Female", desc:""}] },  	xxx: {} }
	this.callback   = {ajaxBefore: null, ajaxAfter: null, ajaxComplete: null, ajaxError: null,  ajaxSuccess: null};
	
	$.extend(this.rights, opts.rights);
	$.extend(this.cols, opts.cols);
	$.extend(this.navi, opts.navi);
	$.extend(this.filters, opts.filters);
	$.extend(this.lists, opts.lists);
	$.extend(this.callback, opts.callback);
}

WLIU.TABLE.prototype = {
	setScope: function(p_scope, tableName) {
		if( tableName ) {
			p_scope[tableName] = this;
		} else {
			p_scope.table = this;
		}
		this.sc = p_scope;
	},

	rowstate: function(theRow, p_rowstate) {
		return FROW.rowstate(theRow, p_rowstate);
	},

	indexByKeys:  function(p_keys) {
		return FTABLE.indexByKeys(this, p_keys);
	},

	rowno: function(p_ridx) {
		return FTABLE.rowno(this, p_ridx);
	},

	colMeta: function(col_name) {
		return FTABLE.colMeta(this, col_name);
	},
	colDefault: function(col_name, p_value) {
		return FTABLE.colDefault(this, col_name, p_value);
	},

	getList: function(list_name) {
		return FTABLE.getList(this, list_name);
	},

	/*** relationship */
	relationHide: function(ridx, col_name) {
		return FTABLE.relationHide(this, ridx, col_name);
	},
	relationChange: function(ridx) {
		return FTABLE.relationChange(this, ridx); 
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
	getRow: function(ridx) {
		return FTABLE.getRow(this, ridx);
	},
	getRowByKeys: function(p_keys) {
		return FTABLE.getRowByKeys(this, p_keys);
	},
	
	// return rows[ridx].cols[index of col_name]
	getCol: function(col_name, ridx) {
		return FTABLE.getCol(this, col_name, ridx);
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
	changeCol: function(col_name, ridx) {
		return FTABLE.changeCol(this, col_name, ridx);
	},


	// ; ridx;  nrow;  ridx nrow ;  default position=0  add to first
	init: function() {
		FTABLE.init(this);
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
	getRows: function(callback) {
		FTABLE.getRows(this, callback);
	},

	// for one2many & many2many 
	allRows: function(callback) {
		FTABLE.allRows(this, callback);
	},
	matchRows: function(callback) {
		FTABLE.matchRows(this, callback);
	},
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


	// Navigation
	firstPage: function() {
		console.log(this.rows);
		FTABLE.firstPage(this);
	},
	previousPage: function() {
		FTABLE.previousPage(this);
	},
	nextPage: function() {
		FTABLE.nextPage(this);
	},
	lastPage: function() {
		FTABLE.lastPage(this);
	},	
	nextRecord: function() {
		FTABLE.nextRecord(this);
	},
	previousRecord: function() {
		FTABLE.previousRecord(this);
	},
	
}
