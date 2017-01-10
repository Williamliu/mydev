/******* FORM & ArraySearch  *******/
var WLIU = WLIU || {};
// Table Object
WLIU.FORM = function( opts ) {
	this.sc			= null;

	this.lang       = opts.lang?opts.lan:"cn";
	this.scope  	= opts.scope?opts.scope:"";
	this.url		= opts.url?opts.url:"";
	
	this.wait		= opts.wait?opts.wait:"";
	this.rowerror   = opts.rowerror?opts.rowerror:"";
	this.taberror 	= opts.taberror?opts.taberror:"";
	this.tooltip 	= opts.tooltip?opts.tooltip:"";
	this.tips 		= opts.tips?opts.tips:"";
	
	this.action		= "get";
	this.error		= {errorCode:0, errorMessage:""};  // table level error : action rights 
	this.rights 	= {view:1, save:0, cancel:1, clear:1, delete:0, add:1, detail:1, output:0, print:1};
	this.cols 		= [];
	this.row 		= {};
	this.lists		= {};  // { gender: { loaded: 1, keys: { rowsn: -1, name: "" }, list: [{key:1, value:"Male", desc:""}, {key:2, value:"Female", desc:""}] },  	xxx: {} }
	this.callback   = {ajaxBefore: null, ajaxAfter: null, ajaxComplete: null, ajaxError: null,  ajaxSuccess: null};
	
	$.extend(this.rights, opts.rights);
	$.extend(this.cols, opts.cols);
	$.extend(this.lists, opts.lists);
	$.extend(this.callback, opts.callback);
}

WLIU.FORM.prototype = {
	setScope: function(p_scope) {
		p_scope.table = this;
		this.sc = p_scope;
	},

	colMeta: function(col_name) {
		return FUNC.COLS.col(this.cols, {name: col_name});
	},
	colDefault: function(col_name, p_value) {
		var t_col = this.colMeta(col_name);
		if(t_col!=undefined) {
			if( p_value != undefined ) {
				t_col.defval = p_value;
				return t_col.defval;
			} else {
				return t_col.defval;
			}
		} else {
			return undefined;
		}
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
	
	// return rows[ridx].cols[index of col_name]
	colByIndex: function(ridx, col_name) {
		return FUNC.ROWS.colByIndex(this.rows, ridx, col_name);
	},
	colByKeys: function(p_keys, col_name) {
		return FUNC.ROWS.colByKeys(this.rows, p_keys, col_name);
	},
	colByRow: function(p_row, col_name) {
		return FUNC.ROWS.colByRow(p_row, col_name);
	},
	/********************************************** */


	// insert a row to table.rows
	addByRow: function(ridx, p_row) {
		if( p_row != undefined ) {
			p_row.scope = this.scope;
			return FUNC.ROWS.insert(this.rows, ridx, p_row);
		} else {
			return FUNC.ROWS.create(this.rows, this.cols, ridx, null, this.scope);
		}
	},
	/****************************/


	// update  rows[ridx].cols[index of colname].value 
	restoreByIndex: function(ridx, nameValues) {
		return FUNC.ROWS.updateByIndex(this.rows, ridx, nameValues);
	},

	updateByIndex: function(ridx, nameValues) {
		return FUNC.ROWS.updateByIndex(this.rows, ridx, nameValues);
	},
	updateByKeys: function(p_keys, nameValues) {
		return FUNC.ROWS.updateByKeys(this.rows, p_keys, nameValues);
	},
	updateByRow: function(p_row, nameValues) {
		return FUNC.ROWS.updateByRow(p_row, nameValues);
	},


	editByIndex: function(ridx, nameValues) {
		for(var colName in nameValues) {
			var vCol = this.colByIndex(ridx, colName);
			if( vCol ) {
				nameValues[colName] = this.updateColVal(vCol, nameValues[colName]);
			}
		}
		return this.updateByIndex(ridx, nameValues);
	},
	
	updateColVal: function(vCol, p_val) {
		var ret_val = "";
		switch( vCol.coltype ) {
			case "hidden":
			case "textbox":
			case "textarea":
			case "ckeditor":
			case "password":
				ret_val = p_val?p_val:"";
				break;
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				if( !$.isArray(p_val) ) p_val = []; 
				ret_val = FUNC.ARRAY.array2Check(p_val);
				break;

			case "date":
			case "time":
				ret_val = p_val?p_val:"";
				break;
			case "datetime":
				p_val = p_val?p_val:"";
				ret_val = FUNC.ARRAY.datetime2Array(p_val);
				break;
			case "select":
				ret_val = p_val?p_val:"";
				break;
			case "radio":
			case "radio1":
			case "radio2":
			case "radio3":
				ret_val = p_val?p_val:0;
				break;
			case "relation":
			case "bool":
				ret_val = p_val=="1"?true:false;
				break;
			case "passpair":
				ret_val = {};
				ret_val.password 	= p_val?p_val:"";
				ret_val.confirm 	= p_val?p_val:"";
				break;
			case "text":
				ret_val = p_val?p_val:"";
				break;
			default:
				ret_val = p_val?p_val:"";
				break;
		}	 
		return ret_val;
	},	
	/*********************************************/

    //  operate the row : table.rows[ridx]
	cancelByRow: function(p_row) {
		return  FUNC.ROWS.cancelByRow(p_row);
	},

	deleteByIndex: function(ridx) {
		return FUNC.ROWS.deleteByIndex(this.rows, ridx);
	},
	deleteByKeys: function(p_keys) {
		return FUNC.ROWS.deleteByKeys(this.rows, p_keys);
	},
	deleteByRow: function(p_row) {
		return FUNC.ROWS.deleteByRow(this.rows, p_row);
	},

	detachByIndex: function(ridx) {
		return FUNC.ROWS.detachByIndex(this.rows, ridx);
	},
	detachByKeys: function(p_keys) {
		return FUNC.ROWS.detachByKeys(this.rows, p_keys);
	},
	detachByRow: function(p_row) {
		return FUNC.ROWS.detachByRow(this.rows, p_row);
	},

	tableError: function(p_error) {
		if(p_error!=undefined) {
			this.error = p_error;
		} else {
			return this.error; 
		}
	},
	rowErrorByIndex: function(ridx, p_error) {
		return FUNC.ROWS.rowErrorByIndex(this.rows, ridx, p_error);
	},
	rowErrorByKeys: function(p_keys, p_error) {
		return FUNC.ROWS.rowErrorByKeys(this.rows, p_keys, p_error);
	},
	rowErrorByRow: function(p_row, p_error) {
		return FUNC.ROWS.rowErrorByRow(p_row, p_error);
	},
	/************************************/

	// set row's col's  error 
	colErrorByIndex: function(ridx, col_name, p_error) {
		return FUNC.ROWS.colErrorByIndex(this.rows, ridx, col_name, p_error);
	},
	colErrorByKeys: function(p_keys, col_name, p_error) {
		return FUNC.ROWS.colErrorByKeys(this.rows, p_keys, col_name, p_error);
	},
	colErrorByRow: function(p_row, col_name, p_error) {
		return FUNC.ROWS.colErrorByRow(p_row, col_name, p_error);
	},
	colErrorByCol: function(p_row, col, p_error) {
		return FUNC.ROWS.colErrorByCol(p_row, col, p_error);
	},
	/***********************/


	/*** event for external call ***/
	changeByKeys: function(p_keys, p_col) {
		var nameValues = {};
		nameValues[p_col.name] = p_col.value;
		return this.updateByKeys(p_keys, nameValues);
	},
	changeByIndex: function(ridx, p_col) {
		var nameValues = {};
		nameValues[p_col.name] = p_col.value;
		return this.updateByIndex(ridx, nameValues);
	},
	changeByRow: function(p_row, p_col) {
		var nameValues = {};
		nameValues[p_col.name] = p_col.value;
		return this.updateByRow(p_row, nameValues);
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
					nrow.cols		= this.getChangeCols(theRow);
					nrows.push(nrow);
				} // errorCode > 0
			} // if rowstate > 0
		}
		return nrows;
	},
	getChangeRow: function( theRow ) {
		var nrows = [];
		//if( theRow.error.errorCode <= 0 ) { 
		if( true ) { 
			var nrow = {};
			nrow.scope 		= theRow.scope;
			nrow.rowstate 	= theRow.rowstate;
			nrow.keys 		= theRow.keys;
			nrow.error      = { errorCode:0, errorMessage:"" };
			nrow.cols		= this.getChangeCols(theRow);
			nrows.push(nrow);
		}
		return nrows;
	},
	getChangeCols: function(theRow) {
		var ncols = [];
		switch(theRow.rowstate) {
			case 0:
				break;
			case 1:
				for(var cidx in theRow.cols) {
					if( theRow.cols[cidx].key==1 || theRow.cols[cidx].need==1 || theRow.cols[cidx].coltype=="relation" || theRow.cols[cidx].colstate==1 ) {
						var ncol = this.getChangeCol( theRow.cols[cidx] );
						if(ncol) ncols.push(ncol);
					} //if
				} // for	
				break;
			case 2:
				for(var cidx in theRow.cols) {
					var ncol = this.getChangeCol(theRow.cols[cidx] );
					if(ncol) ncols.push(ncol);
				} // for	
				break;
			case 3:
				break;
		}
		return ncols;
	},
	getChangeCol: function(vCol) {
		var nCol = undefined;
		switch(vCol.coltype) {
			case "hidden":
			case "textbox":
			case "textarea":
			case "ckeditor":
			case "password":

			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":

			case "date":
			case "time":
			case "datetime":

			case "select":
			case "radio":
			case "radio1":
			case "radio2":
			case "radio3":

			case "relation":
			case "bool":

			case "passpair":
				var nCol 		= angular.copy(vCol);
				nCol.current 	= "";
				nCol.value 		= this.getColVal(nCol);
				break;
			case "text":
				break;
			default:
				break;
		}
		return nCol;
	},

	getColVal: function(vCol) {
		var ret_val = "";
		switch( vCol.coltype ) {
			case "hidden":
			case "textbox":
			case "textarea":
			case "ckeditor":
			case "password":
				ret_val = vCol.value?vCol.value:"";
				break;
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				ret_val = $.isPlainObject(vCol.value)?FUNC.ARRAY.check2Array(vCol.value):[];
				break;

			case "date":
			case "time":
				ret_val = vCol.value?vCol.value:"";
				break;
			case "datetime":
				//var tmp_dt = parseInt(vCol.value)>0?vCol.value:"";
				ret_val = $.isPlainObject(vCol.value)?FUNC.ARRAY.array2Datetime(vCol.value):"";
				break;

			case "select":
				ret_val = vCol.value?vCol.value:"";
				break;
			case "radio":
			case "radio1":
			case "radio2":
			case "radio3":
				ret_val = vCol.value?vCol.value:0;
				break;
			case "relation":
			case "bool":
				ret_val = vCol.value?1:0;
				break;
			case "passpair":
				ret_val = {}
				ret_val.password = vCol.value.password?vCol.value.password:"";
				ret_val.confirm  = vCol.value.confirm?vCol.value.confirm:"";
				break;
			case "text":
				ret_val = "";

			/*** below coltype only for filter ***/
			case "daterange":
			case "timerange":
			case "range":
				ret_val = {}
				ret_val.from = vCol.value.from?vCol.value.from:"";
				ret_val.to	 = vCol.value.to?vCol.value.to:"";
				break;
			case "datetimerange":
				ret_val = {}
				ret_val.from = $.isPlainObject(vCol.value.from)?FUNC.ARRAY.array2Datetime(vCol.value.from):"";
				ret_val.to	 = $.isPlainObject(vCol.value.to)?FUNC.ARRAY.array2Datetime(vCol.value.to):"";
				break;

			default:
				ret_val = "";
				break;
		} 
		return ret_val;
	},
	
	setColVal: function(vCol, p_val) {
		var ret_val = "";
		switch( vCol.coltype ) {
			case "hidden":
			case "textbox":
			case "textarea":
			case "ckeditor":
			case "password":
				if( vCol.value	!= undefined ) vCol.value 	= p_val?p_val:"";
				if( vCol.current!= undefined ) vCol.current = p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				if( !$.isArray(p_val) ) p_val = []; 
				if( vCol.value	!= undefined ) vCol.value 	= FUNC.ARRAY.array2Check(p_val);
				if( vCol.current!= undefined ) vCol.current = FUNC.ARRAY.array2Check(p_val);
				ret_val = FUNC.ARRAY.array2Check(p_val);
				break;

			case "date":
			case "time":
				if( vCol.value	!= undefined ) vCol.value 	= p_val?p_val:"";
				if( vCol.current!= undefined ) vCol.current = p_val?p_val:"";
				ret_val = parseInt(p_val)?p_val:"";
				break;
			case "datetime":
				p_val = p_val?p_val:"";
				if( vCol.value	!= undefined ) vCol.value 	= FUNC.ARRAY.datetime2Array(p_val);
				if( vCol.current!= undefined ) vCol.current = FUNC.ARRAY.datetime2Array(p_val);
				ret_val = FUNC.ARRAY.datetime2Array(p_val);
				break;
			case "select":
				if( vCol.value	!= undefined ) vCol.value 	= p_val?p_val:"";
				if( vCol.current!= undefined ) vCol.current = p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
			case "radio":
			case "radio1":
			case "radio2":
			case "radio3":
				if( vCol.value	!= undefined ) vCol.value 	= parseInt(p_val)?parseInt(p_val):0;
				if( vCol.current!= undefined ) vCol.current = parseInt(p_val)?parseInt(p_val):0;
				ret_val = parseInt(p_val)?parseInt(p_val):0;
				break;
			case "relation":
			case "bool":
				if( vCol.value	!= undefined ) vCol.value 	= parseInt(p_val)?true:false;
				if( vCol.current!= undefined ) vCol.current = parseInt(p_val)?true:false;
				ret_val = p_val=="1"?true:false;
				break;
			case "passpair":
				if( vCol.value	!= undefined ) {
					vCol.value  = {};
					vCol.value.password = p_val?p_val:"";
					vCol.value.confirm 	= p_val?p_val:"";
				}
				if( vCol.current != undefined ) {
					vCol.current  = {};
					vCol.current.password 	= p_val?p_val:"";
					vCol.current.confirm 	= p_val?p_val:"";
				}
				ret_val = angular.copy(vCol.value);
				break;

			case "text":
				if( vCol.value	!= undefined ) vCol.value 	= p_val?p_val:"";
				if( vCol.current!= undefined ) vCol.current = p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
			default:
				if( vCol.value	!= undefined ) vCol.value 	= p_val?p_val:"";
				if( vCol.current!= undefined ) vCol.current = p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
		}	 
		return ret_val;
	},

	getFilters: function() {
		var nfilters = [];
		for(var fidx in this.filters) {
			var nfilter = angular.copy(this.filters[fidx]);
			nfilter.value = this.getColVal(this.filters[fidx]);
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
		this.addByRow(ridx, t_row);
		return t_row;
	},	
	cancelRow: function( theRow ) {
		if( theRow ) {
			switch( theRow.rowstate ) {
				case 0: 
					break;
				case 1:

					this.cancelByRow(theRow);
				    break;
				case 2:
					this.deleteByRow(theRow);
					break;
				case 3:
					this.cancelByRow(theRow);
					break;
			}
		}
	},
	cancelRows: function() {
		for(var i = this.rows.length-1; i>=0; i--) {
			this.cancelRow(this.rows[i]);
		}
	},
	deleteRow: function(theRow) {
		this.detachByRow(theRow);
	},
	deleteRows: function() {
		// none - to danger
	},
	saveRow: function(theRow, callback) {
		var ntable = {};
		ntable.scope = this.scope;
		ntable.lang  = this.lang;
		ntable.action = "save";
		ntable.single = this.single;
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = this.cols;    
		ntable.navi = this.navi;
		//ntable.filters = this.getFilters();
		ntable.lists = this.getLists();
		ntable.rows = this.getChangeRow(theRow);

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
		ntable.single = this.single;
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
		this.single = 0;  //important
		var ntable = {};
		ntable.scope = this.scope;
		ntable.lang  = this.lang;
		ntable.action = "get";
		ntable.single = this.single;
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
	editRow: function( pkeys ) {
		if( pkeys ) {
			for(var colName in pkeys) {
				this.colDefault(colName, pkeys[colName]);
			}
			this.singleKeys = pkeys;
		}
		this.single = 1;  // important
		var ntable = {};
		ntable.scope = this.scope;
		ntable.lang  = this.lang;
		ntable.single = this.single;
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = this.cols; // must provide cols meta to get data from database;
		ntable.navi = this.navi;
		ntable.filters = this.getFilters();
		ntable.lists = this.getLists();
		ntable.rows = [];

		if( this.singleKeys ) 
			ntable.action = "get";
		else 
			ntable.action = "init";

		var cbk = {
			after: function(rtable) {
				if(rtable.singleKeys) {
					if(rtable.rows) {
						if( $.isArray(rtable.rows) )
							if( rtable.rows.length > 0) {
								rtable.rowno(0);
							} 
					}
					if( rtable.rowno() < 0 ) {
						rtable.error.errorCode 		= 1;
						rtable.error.errorMessage 	= "The record not found";
						$(rtable.taberror).trigger("errorshow");
					}

				} else {
					if(rtable.rows) {
						if( $.isArray(rtable.rows) )
							if( rtable.rows.length <= 0) {
								rtable.addRow(0, rtable.newRow());
							}
					}
					rtable.rowno(0);
				}
			}
		}

		this.ajaxCall(ntable, this.sc, cbk);
	},
	// set row col value to empty or defval if it has default value
	clearRow: function(theRow) {
		if( theRow ) {
			for(var cIdx in theRow.cols) {
				if( theRow.cols[cIdx].key ) continue;
				var colName	= theRow.cols[cIdx].name;
				var colVal 	= theRow.cols[cIdx].defval?theRow.cols[cIdx].defval:"";
				var nameValues = {};
				nameValues[colName] = colVal;
				this.updateByRow( theRow, nameValues);
			}
		}
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
				ncol = FUNC.ARRAY.Single(nrow.cols, {name: colName});
				this.setColVal(ncol, theRow[colName] );
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
		if( parseInt(ntable.single) )  {
			if( ntable.rows && ntable.rows.length > 0 ) {
				var nRow 		= ntable.rows[0];
				var tableRow 	= this.rowByKeys(nRow.keys); 
				if( tableRow ) {
					if( parseInt(nRow.error.errorCode) > 0 ) {
						switch(parseInt(nRow.rowstate)) {
							case 0:
								break;
							case 1:
								this.rowErrorByRow(tableRow, nRow.error);
								for(var cidx in nRow.cols) {
									this.colErrorByRow(tableRow, nRow.cols[cidx].name, {errorCode: nRow.cols[cidx].errorCode, errorMessage: nRow.cols[cidx].errorMessage});
								}
								break;
							case 2:
								this.rowErrorByRow(tableRow, nRow.error);
								for(var cidx in nRow.cols) {
									this.colErrorByRow(tableRow, nRow.cols[cidx].name, {errorCode: nRow.cols[cidx].errorCode, errorMessage: nRow.cols[cidx].errorMessage});
								}
								break;
							case 3:
								this.rowErrorByRow(tableRow, nRow.error);
								break;
						} 

						$(this.rowerror).trigger("errorshow");
						if( this.callback.ajaxError && $.isFunction(this.callback.ajaxError) ) this.callback.ajaxError(this);
						if( this.callback.ajaxComplete && $.isFunction(this.callback.ajaxComplete) ) this.callback.ajaxComplete(this);
					} else {
						// create new row,  clear ckeditor before new row
						if(!this.singleKeys) {
							for(var cidx in this.cols) {
								if( this.cols[cidx].coltype.toLowerCase() == "ckeditor" )
									if(CKEDITOR.instances[this.scope + "_" + this.cols[cidx].name]) {
										CKEDITOR.instances[this.scope + "_" + this.cols[cidx].name].setData("");
									}
							}
						}
						$(this.tips).trigger("auto", ["Submitted Success.", "success"]);
						this.editRow(this.singleKeys);
						if( this.callback.ajaxSuccess && $.isFunction(this.callback.ajaxSuccess) ) this.callback.ajaxSuccess(this);
						if( this.callback.ajaxComplete && $.isFunction(this.callback.ajaxComplete) ) this.callback.ajaxComplete(this);
						/*
						if( this.rows.length > 0 ) {
							this.rows = [];
							this.addRow(0, this.newRow());
						} else {
							this.addRow(0, this.newRow());
						}
						*/
					} // if no error 
				} // if(tableRow)			
			} else { // if( ntable.rows && ntable.rows.length > 0 )
				// it will not happen ?
				if( this.rows.length <= 0 ) {
					for(var cidx in this.cols) {
						if( this.cols[cidx].coltype.toLowerCase() == "ckeditor" )
							if(CKEDITOR.instances[this.scope + "_" + this.cols[cidx].name]) {
								CKEDITOR.instances[this.scope + "_" + this.cols[cidx].name].setData("");
							}
					}
					this.editRow(this.singleKeys);
					if( this.callback.ajaxComplete && $.isFunction(this.callback.ajaxComplete) ) this.callback.ajaxComplete(this);
				} 
			}
			this.rowno(0);
		
	} else {
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
								this.rowErrorByRow(tableRow, nRow.error);
								for(var cidx in nRow.cols) {
									this.colErrorByRow(tableRow, nRow.cols[cidx].name, {errorCode: nRow.cols[cidx].errorCode, errorMessage: nRow.cols[cidx].errorMessage});
								}
								break;
							case 2:
								this.rowErrorByRow(tableRow, nRow.error);
								for(var cidx in nRow.cols) {
									this.colErrorByRow(tableRow, nRow.cols[cidx].name, {errorCode: nRow.cols[cidx].errorCode, errorMessage: nRow.cols[cidx].errorMessage});
								}
								break;
							case 3:
								this.rowErrorByRow(tableRow, nRow.error);
								break;
						} 
					} else {
						switch(parseInt(nRow.rowstate)) {
							case 0:
								break;
							case 1:
								this.rowErrorByRow(tableRow, nRow.error);
								tableRow.rowstate = 0;
								for(var cidx in tableRow.cols) {
									tableRow.cols[cidx].colstate 	= 0;
									tableRow.cols[cidx].current 	= angular.copy(tableRow.cols[cidx].value);
									this.colErrorByCol(tableRow, tableRow.cols[cidx], {errorCode:0, errorMessage:""} );
								}
								break;
							case 2:
								this.rowErrorByRow(tableRow, nRow.error);
								tableRow.rowstate = 0;
								for(var cidx in tableRow.cols) {
									tableRow.cols[cidx].colstate 	= 0;
									tableRow.cols[cidx].current 	= angular.copy(tableRow.cols[cidx].value);
									this.colErrorByCol(tableRow, tableRow.cols[cidx], {errorCode:0, errorMessage:""} );
									if(tableRow.cols[cidx].key) {
										var keyColObj = FUNC.ARRAY.Single( nRow.cols, { name: tableRow.cols[cidx].name } );
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
								this.rowErrorByRow(tableRow, nRow.error);
								tableRow.rowstate = 0;
								this.deleteByRow(tableRow);
								table.navi.recordtotal--;
								break;
						}
					}
				} // if(tableRow)
			}  // for
			if(parseInt(ntable.success)) {
				$(this.tips).trigger("auto", ["Submitted Success.", "success"]);
				if( this.callback.ajaxSuccess && $.isFunction(this.callback.ajaxSuccess) ) this.callback.ajaxSuccess(this);
			} else {
				if( this.callback.ajaxError && $.isFunction(this.callback.ajaxError) ) this.callback.ajaxError(this);
			}
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
	var key_cols = FUNC.ARRAY.Search(cols, {key:1});
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



/*******************************************************************************/
// COL Function - change col metadata
var WLIUCOL = function() {};
WLIUCOL.prototype = {
	defval: function(col, p_defval) {
		if( p_defval!=undefined ) {
			col.defval = p_defval;
			return col.defval;
		} else {
			return col.defval;
		}
	},
	
	value: function(col, col_name, p_value) {
		if( p_value!=undefined ) {
			col[col_name] = p_value;
			return col[col_name];
		} else {
			return col[col_name];
		}
	},
	
	update: function(col, nameValues) {
		for(var colName in nameValues) {
			this.value(col, colName, nameValues[colName]);
		}
		return col;
	}
	
}
/*******************************************************************************/

/*******************************************************************************/
// COLS Function - change col metadata
var WLIUCOLS = function() {};
WLIUCOLS.prototype = {
	index: function(cols, nameValues) {
		return FUNC.ARRAY.index(cols, nameValues);
	},
	col: function(cols, nameValues) {
		var cidx = this.index(cols, nameValues);
		if(cidx >=0) {
			return cols[cidx];
		} else {
			return undefined;
		}
	},
	value: function(cols, keyValues, nameValues) {
		var t_col = this.col(cols, keyValues);
		if( t_col!=undefined ) {
			FUNC.COL.update(t_col, nameValues);
			return t_col;
		} else {
			return undefined;
		}
	}	
}
/*******************************************************************************/

/*******************************************************************************/
// ROW Function
var WLIUROW = function() {};
WLIUROW.prototype = {
	rowstate: function(row, p_rowstate) {
		if(p_rowstate!=undefined) {
			row.rowstate = p_rowstate;
			return p_rowstate;
		} else {
			return row.rowstate;
		}
	},
	
	rowError: function(row, p_error) {
		if(p_error!=undefined) {
			row.error = p_error;
		} else {
			return row.error; 
		}
	},

	colError: function(row, col_name, p_error) {
		var t_col =	this.col(row, col_name);
		if(t_col!=null) {
			if(p_error!=undefined) {
				t_col.errorCode 	= p_error.errorCode;
				t_col.errorMessage  = p_error.errorMessage;
				this.validate(row);
				return {errorCode: t_col.errorCode, errorMessage: t_col.errorMessage}; 
			} else {
				return {errorCode: t_col.errorCode, errorMessage: t_col.errorMessage}; 
			}
		} else {
			return undefined;
		}
	},

	colError1: function(row, col, p_error) {
		var t_col =	col; 
		if(t_col!=null) {
			if(p_error!=undefined) {
				t_col.errorCode 	= p_error.errorCode;
				t_col.errorMessage  = p_error.errorMessage;
				this.validate(row);
				return {errorCode: t_col.errorCode, errorMessage: t_col.errorMessage}; 
			} else {
				return {errorCode: t_col.errorCode, errorMessage: t_col.errorMessage}; 
			}
		} else {
			return undefined;
		}
	},
	
	keys: function(row, p_keys) {
		if(p_keys!=undefined) {
			row.keys = p_keys;
			// update key col value
			for(var colName in row.keys) {
				this.value(row, colName, row.keys[colName]);
			}
			return row.keys;
		} else {
			return row.keys;
		}
	},
	
	col: function(row, col_name) {
		return FUNC.ARRAY.Single(row.cols, {name:col_name});
	},

	validate: function(row) {
		// handle row level:  error and rowstate 
		// add, delete case :  don't change rowstate , keep it 
		// normal , changed :  it will verify all col  colstate , nochanged set 0,  changed set 1;
		var changed = false;
		var errorCode 		= 0;
		var errorMessage 	= "";
		for(var colName in row.cols) {
			var t_col = row.cols[colName];
			
			if( t_col.errorCode > 0 ) {
				errorCode 		= Math.max(errorCode, t_col.errorCode);
				errorMessage 	+= (errorMessage!="" && t_col.errorMessage!=""?"\n":"") + t_col.errorMessage;
			}
			
			if(t_col.colstate==1) changed = true;
		}
		
		row.error.errorCode 	= row.error.errorCode<=1?errorCode:row.error.errorCode;
		row.error.errorMessage 	= row.error.errorCode<=1?errorMessage:row.error.errorMessage.join("\n",errorMessage);
		if( row.rowstate <= 1) {
			if(changed) 
				row.rowstate = 1;
			else 
				row.rowstate = 0;
		}
	},
	
	value: function(row, col_name, val) {
		var t_col =	this.col(row, col_name);
		if(t_col!=null) {
			if(val==null) val = "";
			if(val != undefined) {
				// write value
				t_col.value = val;
				
				// if it is key col,  need to update row key value
				var t_keys = this.keys(row);
				for(var colName in t_keys) {
					if(colName == t_col.name) row.keys[colName] = t_col.value; 	
				}
				
				if( $.isPlainObject(t_col.value) ) {
					// compare object {1:true, 2:true}
					var objectSame = true;
					for(var vkey in t_col.value) {
						var curVal = t_col.value[vkey]?t_col.value[vkey]:"";
						var curCur = t_col.current[vkey]?t_col.current[vkey]:"";
						if(curVal!=curCur) objectSame = false;
					} 
					for(var vkey in t_col.current) {
						var curVal = t_col.value[vkey]?t_col.value[vkey]:"";
						var curCur = t_col.current[vkey]?t_col.current[vkey]:"";
						if(curVal!=curCur) objectSame = false;
					} 
					if(objectSame) 
						t_col.colstate = 0; 
					else  
						t_col.colstate = 1; 

				} else {
					if( t_col.value==t_col.current )  // safe or not ?? null, 0, undefined
						t_col.colstate 	= 0; 
					else	
						t_col.colstate 	= 1; 
				}

				t_col.errorCode 	= 0;
				t_col.errorMessage 	= "";	
				this.validate(row);
				return t_col.value;
			} else {
				// read value
				return t_col.value;
			}
		} else {
			return undefined;
		}
	},
	
	update: function(row, nameValues) {
		for(var colName in nameValues) {
			this.value(row, colName, nameValues[colName]);
		}
		return row;
	},

	cancel: function(row) {
		var errorCode 		= 0;
		var errorMessage 	= "";
		row.error.errorCode 	= errorCode;
		row.error.errorMessage 	= errorMessage;
		row.rowstate = 0;
		for(var colName in row.cols) {
			row.cols[colName].colstate = 0;
			row.cols[colName].errorCode = 0;
			row.cols[colName].errorMessage = "";
			row.cols[colName].value = angular.copy(row.cols[colName].current);
		}
		return row;
	},
	
	detach : function(row) {
		if(row.rowstate<=1) row.rowstate = 3;
		return row;
	}
}
/********************************************************************************************************/


/********************************************************************************************************/
// ROWS Function
var WLIUROWS = function() {};
WLIUROWS.prototype = {
	index: function(rows, p_keys) {
		return FUNC.ARRAY.indexByKeys(rows, p_keys);
	},
	
	rowstate: function(rows, p_keys, p_rowstate) {
		var t_row = this.rowByKeys(rows, p_keys);
		if(t_row!=undefined) {
			if(p_rowstate!=undefined) {
				t_row.rowstate = p_rowstate;
				if(p_rowstate=="0") {
					for(var cidx in t_row.cols) {
						t_row.cols[cidx].errorCode 		= 0;
						t_row.cols[cidx].errorMessage 	= "";
					}
					t_row.error.errorCode 			= 0;
					t_row.cols[cidx].errorMessage 	= "";
				}
				return t_row.rowstate;
			}  else {
				return t_row.rowstate;
			}
		} else {
			return undefined;
		}
	},

	rowErrorByIndex: function(rows, ridx, p_error) {
		var t_row = this.rowByIndex(rows, ridx);
		if(t_row!=undefined) {
			return FUNC.ROW.rowError(t_row, p_error);
		} else {
			return undefined;
		}
	},

	rowErrorByKeys: function(rows, p_keys, p_error) {
		var t_row = this.rowByKeys(rows, p_keys);
		if(t_row!=undefined) {
			return FUNC.ROW.rowError(t_row, p_error);
		} else {
			return undefined;
		}
	},

	rowErrorByRow: function(p_row, p_error) {
		if(p_row!=undefined) {
			return FUNC.ROW.rowError(p_row, p_error);
		} else {
			return undefined;
		}
	},

	colErrorByIndex: function(rows, ridx, col_name, p_error) {
		var t_row = this.rowByIndex(rows, ridx);
		if(t_row!=undefined) {
			return FUNC.ROW.colError(t_row, col_name, p_error);
		} else {
			return undefined;
		}
	},

	colErrorByKeys: function(rows, p_keys, col_name, p_error) {
		var t_row = this.rowByKeys(rows, p_keys);
		if(t_row!=undefined) {
			return FUNC.ROW.colError(t_row, col_name, p_error);
		} else {
			return undefined;
		}
	},

	colErrorByRow: function(p_row, col_name, p_error) {
		if(p_row!=undefined) {
			return FUNC.ROW.colError(p_row, col_name, p_error);
		} else {
			return undefined;
		}
	},

	colErrorByCol: function(p_row, col, p_error) {
		if(p_row!=undefined) {
			return FUNC.ROW.colError1(p_row, col, p_error);
		} else {
			return undefined;
		}
	},

	rowByIndex: function(rows, ridx, p_row) {
		if(ridx >= 0 && ridx < rows.length) {
			if(p_row!=undefined) {
				rows[ridx] = p_row;
				return rows[ridx];
			}  else {
				return rows[ridx];
			}
		} else {
			return undefined;
		}
	},

	rowByKeys: function(rows, p_keys, p_row) {
		var ridx = this.index(rows, p_keys);
		return this.rowByIndex(rows, ridx, p_row);
	},
	
	colByIndex: function(rows, ridx, col_name) {
		var t_row = this.rowByIndex(rows, ridx);
		if( t_row != undefined ) {
			return FUNC.ROW.col(t_row, col_name);
		} else {
			return undefined;
		}
	},

	colByKeys: function(rows, p_keys, col_name) {
		var t_row = this.rowByKeys(rows, p_keys);
		if( t_row != undefined ) {
			return FUNC.ROW.col(t_row, col_name);
		} else {
			return undefined;
		}
	},

	colByRow: function(p_row, col_name) {
		if( p_row != undefined ) {
			return FUNC.ROW.col(p_row, col_name);
		} else {
			return undefined;
		}
	},

	updateByKeys: function(rows, p_keys, nameValues) {
		var t_row = this.rowByKeys(rows, p_keys);
		if( t_row != undefined ) {
			return FUNC.ROW.update(t_row, nameValues);
		} else {
			return undefined;
		}
	},

	updateByIndex: function(rows, ridx, nameValues) {
		if(ridx >= 0 && ridx < rows.length) {
			if(rows[ridx]!=undefined) {
				return FUNC.ROW.update(rows[ridx], nameValues);
			}  else {
				return undefined;
			}
		} else {
			return undefined;
		}
	},

	updateByRow: function(p_row, nameValues) {
		if( p_row != undefined ) {
			return FUNC.ROW.update(p_row, nameValues);
		} else {
			return undefined;
		}
	},
	cancelByRow: function(p_row) {
		if( p_row != undefined ) {
			return FUNC.ROW.cancel(p_row);
		} else {
			return undefined;
		}
	},
	create: function(rows, cols, ridx, nameValues, scope) {
		var t_row = new  WLIU.ROW(cols, nameValues, scope);
		if( ridx >= 0 ) {
			if( ridx <= rows.length ) {
				rows.splice(ridx, 0, t_row);				
			} else {
				rows.push(t_row);
			}
		} else if(ridx < 0) {
			rows.push(t_row);
		}
		return t_row;
	},
	
	insert: function(rows, ridx, p_row) {
		if( ridx >= 0 ) {
			if( ridx <= rows.length ) {
				rows.splice(ridx, 0, p_row);				
			} else {
				rows.push(p_row);
			}
		} else if(ridx < 0) {
			rows.push(p_row);
		}
		return p_row;
	},
	
	deleteByKeys: function(rows, p_keys) {
		var ridx = this.index(rows, p_keys);
		if( ridx >= 0 ) {
			return rows.splice(ridx, 1);
		} else {
			return undefined;
		}
	},

	deleteByIndex: function(rows, ridx) {
		if( ridx >= 0 ) {
			return rows.splice(ridx, 1);
		} else {
			return undefined;
		}
	},
	
	deleteByRow: function(rows, p_row) {
		var ridx = this.index(rows, p_row.keys);
		if( ridx >= 0 ) {
			return rows.splice(ridx, 1);
		} else {
			return undefined;
		}
	},

	detachByKeys: function(rows, p_keys) {
		var ridx = this.index(rows, p_keys);
		if( ridx >= 0  ) {
		    FUNC.ROW.detach(rows[ridx]);
			return rows[ridx];
		} else {
			return undefined;
		}
	},

	detachByIndex: function(rows, ridx) {
		if( ridx >= 0 && ridx < rows.length ) {
		    FUNC.ROW.detach(rows[ridx]);
			return rows[ridx];
		} else {
			return undefined;
		}
	},

	detachByRow: function(rows, p_row) {
		var ridx = this.index(rows, p_row.keys);
		if( ridx >= 0  ) {
		    FUNC.ROW.detach(rows[ridx]);
			return rows[ridx];
		} else {
			return undefined;
		}
	}
	
}
/********************************************************************************************************/


// Array Function
var WLIUARRAY = function() {};
WLIUARRAY.prototype = {
	//arr = [{name: xxx, age: xxx}, {name: xxx, age: xxx}] ,  sobj = {name:xxx, age:xxx}  return array [{name:xxx, age: xxx}]
	Search: function(arr, sobj) {
	   return $.grep(arr, function(n,i) {
			var not_found = false;
			for(var key in sobj) {
				if( n[key] != sobj[key] ) not_found = true; 
			}
			return !not_found;
		});
	},
	
	//arr = [{name: xxx, age: xxx}, {name: xxx, age: xxx}] ,  sobj = {name:xxx, age:xxx}  return first {name:xxx, age: xxx}
	Single: function(arr, sobj) {
		var cols = $.grep(arr, function(n,i) {
			var not_found = false;
			for(var key in sobj) {
				if( n[key] != sobj[key] ) not_found = true; 
			}
			return !not_found;
		});
		return cols?(cols.length>0?cols[0]:undefined):undefined;
	},
	index: function(arr, sobj) {
		var aidx = -1;
		$.each(arr, function(i, n) {
			var not_found = false;
			for(var key in sobj) {
				if( n[key] != sobj[key] ) not_found = true; 
			}
			if(!not_found) aidx = i;
			return not_found;
		});
		return aidx;
	},
	singleByKeys: function(arr, keys) {
		var cols = $.grep(arr, function(n,i) {
			var not_found = false;
			for(var key in keys) {
				if( n.keys[key] != keys[key] ) not_found = true; 
			}
			return !not_found;
		});
		return cols.length>0?cols[0]:null;
	},
	indexByKeys: function(arr, keys) {
		var aidx = -1;
		$.each(arr, function(i, n) {
			var found = 0;
			var cnt = 0;
			for(var key in keys) {
				cnt++;
				if( n.keys[key] == keys[key] ) {
					found++;
				} else {
					found--;
				}
			}
			if( cnt > 0 && found == cnt ) aidx = i;
			return aidx;
		});
		return aidx;
	},
	check2Array: function(jObj) {
		var nval = [];
		if( $.isPlainObject(jObj) ) {
			for(var ckval in jObj) {
				if( jObj[ckval] == true || jObj[ckval] == "true" ) {
					nval.push(ckval);
				}
			}
		} 
		return nval;
	},
	array2Check: function(arr) {
		var nval = {};
		if( $.isArray(arr) ) {
			$.each( arr, function(i, n){
				nval[n] = true;
			})
		}
		return nval;
	},
	array2Datetime: function(datetimeObj) {
		var nval = "";
		if( datetimeObj && datetimeObj.date ) {
			nval = (datetimeObj.date?datetimeObj.date:"") + (datetimeObj.date && datetimeObj.time?" ":"") + (datetimeObj.time?datetimeObj.time:"");
		} else {
			if(datetimeObj && datetimeObj.time) {
				nval = datetimeObj.time?datetimeObj.time:"";
			} 
		}
		return nval;
	},
	datetime2Array: function( datetimeString ) {
		var nval = {};
		nval.date = "";
		nval.time = "";

		if( datetimeString != "" ) {
			var dt_part = datetimeString.split(" ");
			var date_part = (""+dt_part[0]).trim();
			if( date_part.indexOf("-")>=0 || date_part.indexOf("/")>=0 ) {
				if(date_part!="0000-00-00" && date_part!="0000/00/00" && date_part!="00/00/0000" )
					nval.date = date_part;
				else 
					nval.date = "";
			} else if(date_part.indexOf(":")>=0) {
				if( date_part!="00:00" && date_part!="00:00:00" )
					nval.time = date_part;
				else 
					nval.time = "";
			}

			var time_part = (""+dt_part[1]).trim();
			if( time_part.indexOf(":")>=0 ) {
				if( time_part!="00:00" && time_part!="00:00:00" ) {
					var tt_tmp = time_part.split(":");
					nval.time = tt_tmp[0] + ":" + tt_tmp[1];
				} else {
					nval.time = "";
				}
			}
		}
		return nval;
	},
	colreplace: function(expression_str, rowCols) {
		var ret_val = expression_str;
		var patern  = /{(\w+)(:|.)?(\w+)}/ig;
		var colArr  = ret_val.match(patern);
		for(var cidx in colArr) {
			var colNames_str = colArr[cidx].replaceAll("{", "").replaceAll("}", "");
			if( colNames_str.indexOf(":")>=0 ) {
				var colNames 	= colNames_str.split(":");
				var colName 	= colNames[0] ? colNames[0] : "";
				var colPrefix 	= colNames[1] ? colNames[1] : "";
				var colValObj	= FUNC.ARRAY.Single(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value?colValObj.value:""):"";

				if (colPrefix != "" && colVal!="")
					ret_val = ret_val.replaceAll(colArr[cidx], colPrefix + colVal);
				else
					ret_val = ret_val.replaceAll(colArr[cidx], colVal);
			} else if( colNames_str.indexOf(".")>=0 ) {
				var colNames 	= colNames_str.split(".");
				var colName 	= colNames[0] ? colNames[0] : "";
				var colPrefix 	= colNames[1] ? colNames[1] : "";
				var colValObj	= FUNC.ARRAY.Single(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value[colPrefix]?colValObj.value[colPrefix]:""):"";
				ret_val = ret_val.replaceAll(colArr[cidx], colVal);

			} else {
				var colNames 	= colNames_str;
				var colName 	= colNames.trim();
				var colValObj	= FUNC.ARRAY.Single(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value?colValObj.value:""):"";
				ret_val = ret_val.replaceAll(colArr[cidx], colVal);
			}
		}
		return ret_val;
	}
}

// Create Global Function
var FUNC = FUNC || {};

FUNC.COLS	= new WLIUCOLS();
FUNC.COL	= new WLIUCOL();
FUNC.ROWS	= new WLIUROWS();
FUNC.ROW	= new WLIUROW();
FUNC.ARRAY 	= new WLIUARRAY();


