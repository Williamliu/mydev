var WLIU = WLIU || {};
WLIU.COL = function(opts) {
	this.col = {
		key:		0, // 0, 1
		scope: 		"",
		name: 		"",
		col:		"", // default same as name, col is database colname
		colname:	"", // display name
		coldesc:    "", // display description
		coltype:	"textbox",  // textbox, checkbox, radio, select, textarea, ....
		datatype:   "number",  // number, email, date, datetime, ....
		need:		0,     // required  must include this col even if value not change.  other is must change
		notnull:  	0,     // not null - not allowed null, different from need 
		minlength:  0,    
		maxlength:  0,		 
		min:		0,    
		max:		0,
		sort:		"",
		defval:		""     // default value for add case
	};
	
	$.extend(this.col, opts);
	
	return this.col;
}


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
		colObj.col			= cols[cidx].col?cols[cidx].col:cols[cidx].name;
		colObj.colstate		= 0;   // only  0 - nochange ;  1 - changed
		colObj.original 	= "";  // server side 
		colObj.current 		= "";  // client side
		colObj.value 		= nameValues[cols[cidx].name]?nameValues[cols[cidx].name]:cols[cidx].defval;  // input updateds
		colObj.errorCode 	= 0;
		colObj.errorMessage	= "";
		this.cols.push(colObj);
	}
}


WLIU.TABLE = function( opts ) {
	this.scope  	= opts.scope?opts.scope:"";
	this.cols 		= [];
	this.rows 		= [];
	this.lists		= {};
	this.rindex 	= -1;
	$.extend(this.cols, opts.cols);
}

WLIU.TABLE.prototype = {
	index:  function(p_keys) {
		return FUNC.ROWS.index(this.rows, p_keys);
	},
	rowno: function(p_ridx) {
		if(p_ridx!=undefined) {
			if(p_ridx<0) this.rindex = -1;
			if(p_ridx >= this.rows.length) this.rindex = this.rows.length - 1;
			if(p_ridx>=0 && p_ridx < this.rows.length) this.rindex = p_ridx;
			return this.rindex;
		} else {
			return this.rindex;
		}
	},
	rownoByKeys : function(p_keys) {
		if( p_keys!=undefined) {
			var ridx = this.index(p_keys);
			return this.rowno(ridx);
		} else {
			return this.rindex;
		}
	},
	rowstate: function(p_keys, p_rowstate) {
		return FUNC.ROWS.rowstate(this.rows, p_keys, p_rowstate);
	},

	rowByIndex: function(ridx) {
		return FUNC.ROWS.rowByIndex(this.rows, ridx);
	},
	rowByKeys: function(p_keys) {
		return FUNC.ROWS.rowByKeys(this.rows, p_keys);
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

	colByIndex: function(ridx, col_name) {
		return FUNC.ROWS.colByIndex(this.rows, ridx, col_name);
	},
	colByKeys: function(p_keys, col_name) {
		return FUNC.ROWS.colByKeys(this.rows, p_keys, col_name);
	},
	colByRow: function(p_row, col_name) {
		return FUNC.ROWS.colByRow(p_row, col_name);
	},

	newRow: function(nameValues) {
		var t_row = new  WLIU.ROW(this.cols, nameValues, this.scope);
		return t_row;
	},
	addRow: function(ridx, p_row) {
		if( p_row != undefined ) {
			p_row.scope = this.scope;
			return FUNC.ROWS.insert(this.rows, ridx, p_row);
		} else {
			return FUNC.ROWS.create(this.rows, this.cols, ridx, null, this.scope);
		}
	},
	createRow: function(ridx, nameValues) {
		var t_row = this.newRow(nameValues);
		return this.addRow(ridx, t_row);
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

	rowErrorByIndex: function(ridx, p_error) {
		return FUNC.ROWS.rowErrorByIndex(this.rows, ridx, p_error);
	},
	rowErrorByKeys: function(p_keys, p_error) {
		return FUNC.ROWS.rowErrorByKeys(this.rows, p_keys, p_error);
	},
	rowErrorByRow: function(p_row, p_error) {
		return FUNC.ROWS.rowErrorByRow(p_row, p_error);
	},

	colErrorByIndex: function(ridx, col_name, p_error) {
		return FUNC.ROWS.colErrorByIndex(this.rows, ridx, col_name, p_error);
	},
	colErrorByKeys: function(p_keys, col_name, p_error) {
		return FUNC.ROWS.colErrorByKeys(this.rows, p_keys, col_name, p_error);
	},
	colErrorByRow: function(p_row, col_name, p_error) {
		return FUNC.ROWS.colErrorByRow(p_row, col_name, p_error);
	},
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
		
		row.error.errorCode 	= errorCode;
		row.error.errorMessage 	= errorMessage;
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
			if(val != undefined) {
				// write value
				t_col.value = val;
				
				// if it is key col,  need to update row key value
				var t_keys = this.keys(row);
				for(var colName in t_keys) {
					if(colName == t_col.name) row.keys[colName] = t_col.value; 	
				}
				
				if( t_col.value==t_col.current )  // safe or not ?? null, 0, undefined
					t_col.colstate 	= 0; 
				else	
					t_col.colstate 	= 1; 
					
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


// Global FUNC 
var FUNC = FUNC || {};
FUNC.COLS	= new WLIUCOLS();
FUNC.COL	= new WLIUCOL();
FUNC.ROWS	= new WLIUROWS();
FUNC.ROW	= new WLIUROW();

