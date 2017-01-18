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
	setScope: function(p_scope) {
		p_scope.table = this;
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
		return FCOLLECT.firstByKV(this.filters,  {name: col_name});
	},
	filterClear: function() {
		for(var fidx in this.filters) {
			FROW.setColVal( this.filters[fidx],"");
		}
	},
	filterValue: function( name, val) {
		if(val!=undefined) {
			if( this.filterMeta(name) ) {
				return FROW.setColVal( this.filterMeta(name), val );
			} else {
				return undefined;
			}
		} else {
			if( this.filterMeta(name) ) {
				return FROW.getColVal( this.filterMeta(name) );
			} else {
				return undefined;
			}
		}
	},
	filterDefault: function( name, val) {
		if(val!=undefined) {
			if( this.filterMeta(name) ) {
				this.filterMeta(name).defval = val;
				this.filterMeta(name).value = val;
				return val;
			} else {
				return undefined;
			}
		} else {
			if( this.filterMeta(name) ) {
				return this.filterMeta(name).defval?this.filterMeta(name).defval:undefined;
			} else {
				return undefined;
			}
		}
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

	getChangeRows: function() {
		var nrows = [];
		for(var ridx in this.rows) {
			if( this.rows[ridx].rowstate > 0  ) {
				var theRow = this.rows[ridx];
				//if( theRow.error.errorCode <= 0 ) {
				if( true ) {
					var nrow = {};
					nrow.scope 		= theRow.scope;
					nrow.rowstate 	= theRow.rowstate;
					nrow.keys 		= theRow.keys;
					nrow.error      = { errorCode:0, errorMessage:"" };
					nrow.cols		= FROW.getChangeCols(theRow);
					nrows.push(nrow);
				} // errorCode > 0
			} // if rowstate > 0
		}
		return nrows;
	},
	getFilters: function() {
		var nfilters = [];
		for(var fidx in this.filters) {
			var nfilter = angular.copy(this.filters[fidx]);
			nfilter.value = FROW.getColVal(this.filters[fidx]);
			if(nfilter.need) nfilters.push(nfilter);
			if($.isArray(nfilter.value) && nfilter.value.length>0 && !nfilter.need ) nfilters.push(nfilter);
			if(!$.isArray(nfilter.value) && nfilter.value && !$.isPlainObject(nfilter.value) && !nfilter.need ) nfilters.push(nfilter);
			if($.isPlainObject(nfilter.value) && (nfilter.value.from!="" || nfilter.value.to!="") && !nfilter.need) nfilters.push(nfilter);
		}
		return nfilters;
	},
	getLists: function() {
		return FTABLE.getLists(this);
	},

	// Navigation
	firstPage: function() {
		if(this.navi.pageno<=0){
			this.navi.pageno=1;
		}
		if(this.navi.pagetotal<=0) this.navi.pageno=0;
		if(this.navi.pageno>1 && this.navi.pagetotal>0) {
			this.navi.pageno=1;
			this.getRows();
		}
	},
	previousPage: function() {
		if(this.navi.pageno<=0){
			this.navi.pageno=1;
		}
		if(this.navi.pagetotal<=0) this.navi.pageno=0;
		if(this.navi.pageno>1){
			this.navi.pageno--;
			this.getRows();
		}
	},
	nextPage: function() {
		if(this.navi.pagetotal<=0) this.navi.pageno=0;
		if(this.navi.pageno>this.navi.pagetotal){
			this.navi.pageno = this.navi.pagetotal;
			this.getRows();
		}
		if(this.navi.pageno<this.navi.pagetotal){
			this.navi.pageno++;
			this.getRows();
		}
	},
	lastPage: function() {
		if(this.navi.pagetotal<=0) this.navi.pageno=0;
		if(this.navi.pageno!=this.navi.pagetotal){
			this.navi.pageno = this.navi.pagetotal;
			this.getRows();
		}
	},	
	nextRecord: function() {
		this.rowno( this.rowno() + 1 );
	},
	previousRecord: function() {
		this.rowno( this.rowno() - 1 );
	},

	/****** ajax call ********** */
	newRow: function(keyvalues) {
		return FTABLE.newRow(this, keyvalues);
	},

	// ; ridx;  nrow;  ridx nrow ;  default position=0  add to first
	addRow: function(ridx, t_row) {
		return FTABLE.addRow(this, ridx, t_row);
	},	
	cancelRow: function( theRow ) {
		return FTABLE.cancelRow(this, theRow);
	},
	removeRow: function(theRow) {
		return FTABLE.removeRow(this, theRow);
	},
	cancelRows: function() {
		return FTABLE.cancelRows(this);
	},
	deleteRow: function(theRow) {
		return FTABLE.detachRow(this, theRow);
	},
	deleteRows: function() {
		// none - to danger
	},
	saveRow: function(theRow, callback) {
		var ntable = {};
		ntable.scope = this.scope;
		ntable.lang  = this.lang;
		ntable.action = "save";
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = this.cols;    
		ntable.navi = this.navi;
		//ntable.filters = this.getFilters();
		ntable.lists = this.getLists();
		ntable.rows = FROW.getChangeRow(theRow);

		if(callback) {
			this.callback.before = callback.before && $.isFunction(callback.before)?callback.before:undefined;
			this.callback.after = callback.after && $.isFunction(callback.after)?callback.after:undefined;
		} 

		this.ajaxCall(ntable, this.sc);
	},
	saveRows: function(callback) {
		var ntable = {};
		ntable.scope = this.scope;
		ntable.lang  = this.lang;
		ntable.action = "save";
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = this.cols;  
		ntable.navi = this.navi;
		//ntable.filters = this.getFilters();
		ntable.lists = this.getLists();
		ntable.rows = this.getChangeRows();

		if(callback) {
			this.callback.before = callback.before && $.isFunction(callback.before)?callback.before:undefined;
			this.callback.after = callback.after && $.isFunction(callback.after)?callback.after:undefined;
		} 
		this.ajaxCall(ntable, this.sc);
	},
	getRows: function(callback) {
		var ntable = {};
		ntable.scope = this.scope;
		ntable.lang  = this.lang;
		ntable.action = "get";
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = this.cols; // must provide cols meta to get data from database;
		ntable.navi = this.navi;
		ntable.filters = this.getFilters();
		ntable.lists = this.getLists();
		ntable.rows = [];

		if(callback) {
			this.callback.before = callback.before && $.isFunction(callback.before)?callback.before:undefined;
			this.callback.after = callback.after && $.isFunction(callback.after)?callback.after:undefined;
		} 
		this.ajaxCall(ntable, this.sc);
	},
	allRows: function(callback) {
		this.navi.match = 0;
		this.getRows(callback);
	},
	matchRows: function(callback) {
		this.navi.match = 1;
		this.getRows(callback);
	},
	// set row col value to empty or defval if it has default value
	resetRow: function(theRow) {
		return FROW.resetRow(theRow);
	},
	ajaxCall: function(ntable, sc, cbk) {
		var _self = this;
		if( this.wait ) $(this.wait).trigger("show");
		this.navi.loading = 1;
		if( this.callback.ajaxBefore && $.isFunction(this.callback.ajaxBefore) ) this.callback.ajaxBefore(ntable);
		if( this.callback.before ) if( this.callback.before && $.isFunction(this.callback.before) ) this.callback.before(ntable);
		//console.log(ntable);
		$.ajax({
			data: {
				table:	ntable
			},
			dataType: "JSON",  
			error: function(xhr, tStatus, errorTh ) {
				if( _self.wait ) $(_self.wait).trigger("hide");
			},
			success: function(req, tStatus) {
				if( _self.wait ) $(_self.wait).trigger("hide");

				if( _self.callback.ajaxAfter && $.isFunction(_self.callback.ajaxAfter) ) _self.callback.ajaxAfter(req.table);
				_self.syncLists(req.table.lists);
				switch(req.table.action) {
					case "init": 
					case "get": 
						//console.log(req.table);
						_self.syncRows(req.table);
						break;
					case "save":
						//console.log(req.table);
					    _self.updateRows(req.table);
						break;
				}
				_self.navi.loading = 0;
				sc.$apply();
			},
			type: "post",
			url: _self.url
		});
	},
	syncRows: function(ntable) {
		this.tableError(ntable.error);
		this.rows = [];
		this.rowno(-1);
		this.navi = angular.copy(ntable.navi);
		if( ntable.primary && $.isArray(ntable.primary) ) {
			if( ntable.primary.length>0 ) {
				for(var pidx in ntable.primary) {
					var colObj = ntable.primary[pidx];
					for(var colName in colObj) {
						this.colDefault(colName, colObj[colName]);
					}
				}
			}
		}
		for(var ridx in ntable.rows) {
			var theRow = ntable.rows[ridx];
			var nrow = this.newRow( theRow );
			nrow.rowstate = 0;

			for(var colName in theRow) {
				ncol = FCOLLECT.firstByKV(nrow.cols, {name: colName});
				FROW.setColVal(ncol, theRow[colName] );
			}
			this.addRow(-1, nrow);
		}

		if(this.callback) if( this.callback.after && $.isFunction(this.callback.after) ) this.callback.after(this);
		if( parseInt(this.error.errorCode) == 0 ) {
			if( this.callback.ajaxSuccess && $.isFunction(this.callback.ajaxSuccess) ) this.callback.ajaxSuccess(this);
		} else {
			if( this.callback.ajaxError && $.isFunction(this.callback.ajaxError) ) this.callback.ajaxError(this);
		}
		$(this.taberror).trigger("errorshow");
		if( this.callback.ajaxComplete && $.isFunction(this.callback.ajaxComplete) ) this.callback.ajaxComplete(this);
	},
	updateRows: function(ntable) {
			this.rowno(-1);
			this.tableError(ntable.error);
			for(var ridx in ntable.rows) {
				var nRow 		= ntable.rows[ridx];
				var tableRow 	= this.getRowByKeys(nRow.keys); 
				if( tableRow ) {
					if( parseInt(nRow.error.errorCode) > 0 ) {
						switch(parseInt(nRow.rowstate)) {
							case 0:
								break;
							case 1:
								this.rowError(tableRow, nRow.error);
								for(var cidx in nRow.cols) {
									this.colError(tableRow, nRow.cols[cidx].name, {errorCode: nRow.cols[cidx].errorCode, errorMessage: nRow.cols[cidx].errorMessage});
								}
								break;
							case 2:
								this.rowError(tableRow, nRow.error);
								for(var cidx in nRow.cols) {
									this.colError(tableRow, nRow.cols[cidx].name, {errorCode: nRow.cols[cidx].errorCode, errorMessage: nRow.cols[cidx].errorMessage});
								}
								break;
							case 3:
								this.rowError(tableRow, nRow.error);
								break;
						} 
					} else {
						switch(parseInt(nRow.rowstate)) {
							case 0:
								break;
							case 1:
								this.rowError(tableRow, nRow.error);
								tableRow.rowstate = 0;
								for(var cidx in tableRow.cols) {
									tableRow.cols[cidx].colstate 	= 0;
									tableRow.cols[cidx].current 	= angular.copy(tableRow.cols[cidx].value);
									this.colError(tableRow, tableRow.cols[cidx].name, {errorCode:0, errorMessage:""} );
								}
								break;
							case 2:
								this.rowError(tableRow, nRow.error);
								tableRow.rowstate = 0;
								for(var cidx in tableRow.cols) {
									tableRow.cols[cidx].colstate 	= 0;
									tableRow.cols[cidx].current 	= angular.copy(tableRow.cols[cidx].value);
									this.colError(tableRow, tableRow.cols[cidx].name, {errorCode:0, errorMessage:""} );
									if(tableRow.cols[cidx].key) {
										var keyColObj = FCOLLECT.firstByKV( nRow.cols, { name: tableRow.cols[cidx].name } );
										if( keyColObj ) {
											tableRow.cols[cidx].value 	= keyColObj.value?keyColObj.value:"";
											tableRow.cols[cidx].current = tableRow.cols[cidx].value;  
											tableRow.keys[tableRow.cols[cidx].name] = tableRow.cols[cidx].value;
										}
									}
								}
								table.navi.recordtotal++;
								break;
							case 3:
								this.rowError(tableRow, nRow.error);
								tableRow.rowstate = 0;
								this.removeRow(tableRow);
								table.navi.recordtotal--;
								break;
						}
					}
				} // if(tableRow)
			}  // for
			if(parseInt(ntable.success)) {
				$(this.autotip).trigger("auto", ["Submitted Success.", "success"]);
				if( this.callback.ajaxSuccess && $.isFunction(this.callback.ajaxSuccess) ) this.callback.ajaxSuccess(this);
			} else {
				if( this.callback.ajaxError && $.isFunction(this.callback.ajaxError) ) this.callback.ajaxError(this);
			}
		
		if(this.callback) if( this.callback.after && $.isFunction(this.callback.after) ) this.callback.after(this);
		$(this.taberror).trigger("errorshow");
		if( this.callback.ajaxComplete && $.isFunction(this.callback.ajaxComplete) ) this.callback.ajaxComplete(this);
	},
	syncLists: function(nlists) {
		for(var listName in nlists) {
			var nlistObj = this.getList(listName);
			if(nlistObj) {
				nlistObj.loaded = nlists[listName].loaded;
				nlistObj.keys 	= nlists[listName].keys;
				nlistObj.list 	= nlists[listName].list;
			}
		}
	}
}
