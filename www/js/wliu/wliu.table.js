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
		FROW.rowstate(theRow, p_rowstate);
	},

	indexByKeys:  function(p_keys) {
		return FCOLLECT.indexByKeys(this.rows, p_keys);
	},

	rowno: function(p_ridx) {
		if(p_ridx!=undefined) {
			if(p_ridx<0) this._rowno = -1;
			if(p_ridx >= this.rows.length) this._rowno = this.rows.length - 1;
			if(p_ridx>=0 && p_ridx < this.rows.length) this._rowno = p_ridx;
			return this._rowno;
		} else {
			return this._rowno;
		}
	},

	colMeta: function(col_name) {
		return FCOLLECT.objectByKV(this.cols, {name: col_name});
	},
	colDefault: function(col_name, p_value) {
		var t_col = this.colMeta(col_name);
		FOBJECT.update(t_col, {defval: p_value} );
	},

	listByName: function(listName) {
		if( this.lists ) {
			if(this.lists[listName]) 
				return this.lists[listName];
			else 
				return undefined;
		} else {
			return undefined;
		}
	},
	/*** relationship */
	relationCol: function(ridx, col_name) {
		var theRow = this.rowByIndex(ridx);
		if( theRow ) {
			if(col_name) 
				return FCOLLECT.firstByKV(theRow.cols,  {name: col_name});
			else 
				return FCOLLECT.firstByKV(theRow.cols,  {coltype: "relation"});
		} else {
			return undefined;
		}
	},
	relationHide: function(ridx, col_name) {
		var theRow = this.rowByIndex(ridx);
		if( theRow ) {
				var curCol = FCOLLECT.firstByKV(theRow.cols,  {name: col_name});
				if( curCol.relation ) {
					var relCol = this.relationCol(ridx, curCol.relation);
					if(relCol!=undefined) {
						if(relCol.value) 
							return false;
						else 
							return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
		} else {
			return false;
		}
	},
	relationChange: function(ridx) {
		var relationObj = undefined;
		relationObj = this.relationCol(ridx);
		if( relationObj ) {
			var theRow = this.rowByIndex(ridx);
			if( theRow ) {
				if( relationObj.value ) {
					// true - check
					if( relationObj.current ) {
						var rCols = FCOLLECT.collectionByKV(theRow.cols, {relation: relationObj.name});				
						for(var cidx in rCols) {
							FROW.colRestore(theRow, rCols[cidx]);
						}
					} 
				} else {
					// false - uncheck
					var rCols = FCOLLECT.collectionByKV(theRow.cols, {relation: relationObj.name});				
					for(var cidx in rCols) {
						var nameVal = {};
						nameVal[rCols[cidx].name] = FROW.toColVal(rCols[cidx].coltype, "");
						FROW.update(theRow, nameVal);
					}
				}
			} 
		}
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
	rowByIndex: function(ridx) {
		return FCOLLECT.objectByIndex(this.rows, ridx);
	},
	rowByKeys: function(p_keys) {
		return FCOLLECT.objectByKeys(this.rows, p_keys);
	},
	
	// return rows[ridx].cols[index of col_name]
	colByName: function(ridx, col_name) {
		var t_row = FCOLLECT.objectByIndex(this.rows, ridx);
		if( t_row != undefined ) {
			return FCOLLECT.objectByKV(t_row.cols, {name:col_name});
		} else {
			return undefined;
		}
	},
	/********************************************** */


    //  operate the row : table.rows[ridx]
	tableError: function(p_error) {
		if(p_error!=undefined) {
			this.error = p_error;
		} else {
			return this.error; 
		}
	},
	rowError: function(theRow, p_error) {
		return FROW.rowerror(theRow, p_error);
	},
	colError: function(theRow, col_name, p_error) {
		return FROW.colerror(theRow, col_name, p_error);
	},
	/************************************/

	/*** event for external call ***/
	changeByName: function(ridx, col_name) {
		var t_row = this.rowByIndex(ridx);
		if( t_row !=undefined ) {
			var t_col = this.colByName(ridx, col_name);
			if( t_col!=undefined ) {
				var keyvalues = {};
				keyvalues[t_col.name] = t_col.value;
				return FROW.update(t_row, keyvalues);
			}  else {
				return undefined;
			}
		} else {
			return undefined;
		}
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
		var nlists = {};
		for(var lname in this.lists) {
			if(this.lists[lname].loaded==0) {
				nlists[lname] = {};
				nlists[lname].loaded = 0;
				nlists[lname].list = [];
			}
		}
		return nlists;
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
	newRow: function(nameValues) {
		var t_row = new  WLIU.ROW(this.cols, nameValues, this.scope);
		return t_row;
	},

	// ; ridx;  nrow;  ridx nrow ;  default position=0  add to first
	addRow: function() {
		switch(arguments.length) {
			case 0:
			    // add empty row to first
				var ridx 	= 0;
				var t_row 	= this.newRow();
			 	break;
			case 1:
				if( arguments[0].rowstate!=undefined ) {
					// add rowObj to first
					var ridx 	= 0;
					var t_row 	= arguments[0];
				} else {
					// add new empty row to position ridx
					var ridx 	= arguments[0];
					var t_row 	= this.newRow();
				}
				break;
			case 2:
			    // add rowObj to position ridx
				var ridx 	= arguments[0];
				var t_row 	= arguments[1];
				break;
		}

		FCOLLECT.insert(this.rows, ridx, t_row );
		return t_row;
	},	
	cancelRow: function( theRow ) {
		if( theRow ) {
			switch( theRow.rowstate ) {
				case 0: 
					break;
				case 1:
					FROW.cancel(theRow);
				    break;
				case 2:
					this.removeRow(theRow);
					break;
				case 3:
					FROW.cancel(theRow);
					break;
			}
		}
	},
	removeRow: function(theRow) {
		var ridx = this.indexByKeys(theRow.keys);
		FCOLLECT.delete(this.rows, ridx);
	},
	cancelRows: function() {
		for(var i = this.rows.length-1; i>=0; i--) {
			this.cancelRow(this.rows[i]);
		}
	},
	deleteRow: function(theRow) {
		FROW.detach(theRow);
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
			this.callback.before = callback.before && $.isFunction(callback.before)?callback.after:undefined;
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
	clearRow: function(theRow) {
		FROW.clearRow(theRow);
	},
	ajaxCall: function(ntable, sc, cbk) {
		var _self = this;
		if( this.wait ) $(this.wait).trigger("show");
		this.navi.loading = 1;
		if( this.callback.ajaxBefore && $.isFunction(this.callback.ajaxBefore) ) this.callback.ajaxBefore(ntable);
		if(cbk) if( cbk.before && $.isFunction(cbk.before) ) cbk.before(ntable);
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
						_self.syncRows(req.table, cbk);
						break;
					case "save":
						//console.log(req.table);
					    _self.updateRows(req.table, cbk);
						break;
				}
				_self.navi.loading = 0;
				sc.$apply();
			},
			type: "post",
			url: _self.url
		});
	},
	syncRows: function(ntable, cbk) {
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

		if(cbk) if( cbk.after && $.isFunction(cbk.after) ) cbk.after(this);
		if( parseInt(this.error.errorCode) == 0 ) {
			if( this.callback.ajaxSuccess && $.isFunction(this.callback.ajaxSuccess) ) this.callback.ajaxSuccess(this);
		} else {
			if( this.callback.ajaxError && $.isFunction(this.callback.ajaxError) ) this.callback.ajaxError(this);
		}
		$(this.taberror).trigger("errorshow");
		if( this.callback.ajaxComplete && $.isFunction(this.callback.ajaxComplete) ) this.callback.ajaxComplete(this);
	},
	updateRows: function(ntable, cbk) {
			this.rowno(-1);
			this.tableError(ntable.error);
			for(var ridx in ntable.rows) {
				var nRow 		= ntable.rows[ridx];
				var tableRow 	= this.rowByKeys(nRow.keys); 
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
		
		if(cbk) if( cbk.after && $.isFunction(cbk.after) ) cbk.after(this);
		$(this.taberror).trigger("errorshow");
		if( this.callback.ajaxComplete && $.isFunction(this.callback.ajaxComplete) ) this.callback.ajaxComplete(this);
	},
	syncLists: function(nlists) {
		for(var listName in nlists) {
			var nlistObj = this.listByName(listName);
			if(nlistObj) {
				nlistObj.loaded = nlists[listName].loaded;
				nlistObj.keys 	= nlists[listName].keys;
				nlistObj.list 	= nlists[listName].list;
			}
		}
	}
}

// Table Filter Metadata Object
WLIU.FILTER = function(opts) {
	this.col = {
		scope: 		"",
		name: 		"",
		cols:		"", // default same as name, col is database colname
		colname:	"", // display name
		coldesc:    "", // display description
		coltype:	"textbox",  //hidden, textbox, checkbox,checkbox1,checkbox2,checkbox3, radio, select, textarea, datetime, date, time, intdate ....
		datatype:   "ALL",  // number, email, date, datetime, ....
		need:		0,     // required  must include this col even if value not change.  other is must change
		minlength:  0,    
		maxlength:  0,		 
		min:		0,    
		max:		0,
		list:       "",    // select , checkbox, radio base on list
		compare:	"",    // default defined in server side php 
		defval:     "",
		value:		""     // default value for add case
	};
	
	$.extend(this.col, opts);
	this.col.cols = this.col.cols?this.col.cols:this.col.name; // important for mapping js to database 
	this.col.value = this.col.defval?this.col.defval:""; // important for mapping js to database 
	
	return this.col;
}

// Table Col Metadata Object
WLIU.COL = function(opts) {
	this.col = {
		key:		0, // 0, 1
		scope: 		"",
		name: 		"",
		col:		"", // default same as name, col is database colname
		colname:	"", // display name
		coldesc:    "", // display description
		coltype:	"textbox",  //hidden, textbox, checkbox,checkbox1,checkbox2,checkbox3, radio, select, textarea, datetime, date, time, intdate ....
		datatype:   "ALL",  // number, email, date, datetime, ....
		need:		0,     // required  must include this col even if value not change.  other is must change
		notnull:  	0,     // not null - not allowed null, different from need 
		minlength:  0,    
		maxlength:  0,		 
		min:		0,    
		max:		0,
		sort:		"",
		relation:   "",
		list:       "",    // select , checkbox, radio base on list
		defval:		""     // default value for add case
	};
	
	$.extend(this.col, opts);
	this.col.col = this.col.col?this.col.col:this.col.name; // important for mapping js to database 
	return this.col;
}

// Table Row Metadata Object
WLIU.ROW = function( cols, nameValues, scope ) {
	if( scope == undefined ) scope = "";
	this.scope			= scope;
	this.keys 			= {};
	this.rowstate 		= 2;  //default is new row;   0 - normal; 1 - changed;  2 - added;  3 - deleted
	this.error			= { errorCode: 0, errorMessage: "" };  
	this.cols			= [];
	
	if( nameValues == undefined ) nameValues = {};
	// create keys : { id1 : "",  id2: "" }
	var key_cols =  $.grep(cols, function(n,i) { return  n.key == 1;});
	for(var kidx in key_cols) {
		this.keys[key_cols[kidx].name] = nameValues[key_cols[kidx].name]?nameValues[key_cols[kidx].name]:"";
	}
	
	// create cols:  []
	for(cidx = 0; cidx < cols.length; cidx++) {
		var colObj = {};
		colObj.scope 		= scope!=""?scope:cols[cidx].scope;
		colObj.name  		= cols[cidx].name;
		colObj.key  		= cols[cidx].key?cols[cidx].key:0;
		colObj.defval  		= cols[cidx].defval?cols[cidx].defval:"";

		if(colObj.key) {
			this.keys[colObj.name] = this.keys[colObj.name]?this.keys[colObj.name]:colObj.defval;
		}

		colObj.colname  	= cols[cidx].colname?cols[cidx].colname:colObj.name.capital();
		colObj.coldesc  	= cols[cidx].coldesc?cols[cidx].coldesc:"";

		colObj.col			= cols[cidx].col?cols[cidx].col:cols[cidx].name;
		colObj.coltype  	= cols[cidx].coltype?cols[cidx].coltype.toLowerCase():"textbox";
		colObj.datatype  	= cols[cidx].datatype?cols[cidx].datatype.toUpperCase():"ALL";
		colObj.need  		= cols[cidx].need?cols[cidx].need:0;
		colObj.notnull  	= cols[cidx].notnull?cols[cidx].notnull:0;
		colObj.minlength  	= cols[cidx].minlength?cols[cidx].minlength:0;
		colObj.maxlength  	= cols[cidx].maxlength?cols[cidx].maxlength:0;
		colObj.min  		= cols[cidx].min?cols[cidx].min:0;
		colObj.max  		= cols[cidx].max?cols[cidx].max:0;

		colObj.relation  	= cols[cidx].relation?cols[cidx].relation:"";
		colObj.sort  		= cols[cidx].sort?cols[cidx].sort:"";
		colObj.list  		= cols[cidx].list?cols[cidx].list:"";

		colObj.colstate		= 0;   // only  0 - nochange ;  1 - changed
		colObj.original 	= "";  // server side 
		colObj.current 		= "";  // client side
		switch( colObj.coltype ) {
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
			case "datetime":
			case "passpair":
				colObj.value = nameValues[colObj.name]?nameValues[colObj.name]:( $.isPlainObject(colObj.defval)?colObj.defval:{} );  // input updateds
				break;
			default:
				colObj.value = nameValues[colObj.name]?nameValues[colObj.name]:colObj.defval;  // input updateds
				break;
		}
		colObj.errorCode 	= 0;
		colObj.errorMessage	= "";
		this.cols.push(colObj);
	}
}

