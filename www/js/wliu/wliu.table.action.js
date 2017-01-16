/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};

WLIU.OBJECT = function() {}
WLIU.OBJECT.prototype = {
	update: function( col, p_value1, p_value2) {
		switch(arguments.length) {
			case 0:
				return undefined;
			case 1:
				var col = arguments[0];
				return col;
			case 2:
				var col = arguments[0];
				var keyvalues = arguments[1];
				if( $.isPlainObject (keyvalues) ) {
					for(var key in keyvalues) {
						col[key] = keyvalues[key];
					}
				} else {
					return col;
				}			
			case 3:
				var col = arguments[0];
				var key = arguments[1];
				var val = arguments[2];
				col[key] = val; 
				break;
		}
	}
}

WLIU.COLLECTION = function(){}
WLIU.COLLECTION.prototype = {
	// return collection index:  0 ~ collection.length -1 
	indexByKV: function(collection, keyvalues) {
		var cidx = -1;
		$.each(collection, function(i, n) {
			var not_found = false;
			for(var key in keyvalues) {
				if( n[key] != keyvalues[key] ) not_found = true; 
			}
			if(!not_found) cidx = i;
			return not_found;
		});
		return cidx;
	},
	// special for rows collection:  each row has row.keys={ id1: xxx, id2: xxx }
	indexByKeys: function(collection, keys) {
		var cidx = -1;
		$.each(collection, function(i, n) {
			var found = 0;
			var cnt = 0;
			for(var key in keys) {
				cnt++;
				if( n.keys ) {
					if( n.keys[key] == keys[key] ) {
						found++;
					} else {
						found--;
					}
				} else {
					found--;
				}
			}
			if( cnt > 0 && found == cnt ) cidx = i;
			return cidx;
		});
		return cidx;
	},

	// return object : {xxx: xxx, ...}
	objectByIndex: function(collection, cidx) {
		if(cidx >= 0 && cidx < collection.length) {
			return collection[cidx];
		}  else {
			return undefined;
		}
	},
	objectByKV: function(collection, keyvalues) {
		var cidx = this.indexByKV(collection, keyvalues);
		if(cidx >=0) {
			return collection[cidx];
		} else {
			return undefined;
		}
	},
	objectByKeys: function( collection, keys) {
		var cidx = this.indexByKeys(collection, keys);
		if(cidx >=0) {
			return collection[cidx];
		} else {
			return undefined;
		}
	},
      
	// return array of object: [{}, {}]  or  [] if not found
	collectionByKV: function(collection, keyvalues) {
	   return $.grep(collection, function(n,i) {
			var not_found = false;
			for(var key in keyvalues) {
				if( n[key] != keyvalues[key] ) not_found = true; 
			}
			return !not_found;
		});
	},
	firstByKV: function( collection, keyvalues) {
		var ncollection = this.collectionByKV(collection, keyvalues);
		return ncollection?(ncollection.length>0?ncollection[0]:[]):[];
	},

	// CRUD collection object
	insert: function( collection, cidx, nobject) {
		if( cidx >= 0 ) {
			if( cidx < collection.length ) {
				collection.splice(cidx, 0, nobject);				
			} else {
				collection.push(nobject);
			}
		} else if(cidx < 0) {
			collection.push(nobject);
		}
		return collection;
	},
	update: function( collection, cidx, nobject) {
		if( cidx >= 0  && cidx < collection.length) {
			collection[cidx] = nobject;
		}
		return collection;
	},
	delete: function( collection, cidx ) {
		if( cidx >= 0 && cidx < collection.length ) {
			collection.splice(cidx, 1);
			return collection;
		} else {
			return collection;
		}
	}
}

WLIU.ROWACTION = function(){}
WLIU.ROWACTION.prototype = {
	objectByKV: function(collection, keyvalues) {
		var cidx = this.indexByKV(collection, keyvalues);
		if(cidx >=0) {
			return collection[cidx];
		} else {
			return undefined;
		}
	},

	rowstate: function(theRow, p_rowstate) {
		if( theRow!=undefined ) {
			if(p_rowstate!=undefined) theRow.rowstate = p_rowstate;
			return theRow.rowstate;
		} else {
			return undefined;
		}
	},
	error: function(theRow, p_error) {
		if( theRow!=undefined) {
			if(p_error!=undefined) theRow.error = p_error;
			return theRow.error;
		} else {
			return undefined;
		}
	},
	colError: function(theRow, col_name, p_error) {
		if( theRow != undefined ) {
			var theCol = this.objectByKV(theRow.cols, {name:col_name});
			if(theCol!=undefined) {
				if(p_error!=undefined) {
					theCol.errorCode 		= p_error.errorCode;
					theCol.errorMessage  	= p_error.errorMessage;
					this.validate(theRow);
				} 
				return {errorCode: t_col.errorCode, errorMessage: t_col.errorMessage}; 
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	},

	validate: function(theRow) {
		// handle row level:  error and rowstate 
		// add, delete case :  don't change rowstate , keep it 
		// normal , changed :  it will verify all col  colstate , nochanged set 0,  changed set 1;
		var changed = false;
		var errorCode 		= 0;
		var errorMessage 	= "";
		for(var colName in theRow.cols) {
			var t_col = theRow.cols[colName];
			
			if( t_col.errorCode > 0 ) {
				errorCode 		= Math.max(errorCode, t_col.errorCode);
				errorMessage 	+= (errorMessage!="" && t_col.errorMessage!=""?"\n":"") + t_col.errorMessage;
			}
			
			if(t_col.colstate==1) changed = true;
		}
		
		theRow.error.errorCode 		= theRow.error.errorCode<=1?errorCode	:theRow.error.errorCode;
		theRow.error.errorMessage 	= theRow.error.errorCode<=1?errorMessage:theRow.error.errorMessage.join("\n",errorMessage);
		if( theRow.rowstate <= 1) {
			if(changed) 
				theRow.rowstate = 1;
			else 
				theRow.rowstate = 0;
		}
	},

	cancel: function(theRow) {
		var errorCode 		= 0;
		var errorMessage 	= "";
		theRow.error.errorCode 	= errorCode;
		theRow.error.errorMessage 	= errorMessage;
		theRow.rowstate = 0;
		for(var colName in theRow.cols) {
			theRow.cols[colName].colstate = 0;
			theRow.cols[colName].errorCode = 0;
			theRow.cols[colName].errorMessage = "";
			theRow.cols[colName].value = angular.copy(theRow.cols[colName].current);
		}
		return theRow;
	},
	detach: function(theRow) {
		if(theRow.rowstate<=1) theRow.rowstate = 3;
		return theRow;
	},

	colChange: function(theRow, theCol){
		if( theRow!=undefined ) {
			if( theCol!=undefined ) {

				return theCol.value;
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	},
	change: function(theRow, col_name) {
		if( theRow!=undefined ) {
			var t_col = this.objectByKV(theRow.cols, {name:col_name});
			if( t_col!=undefined ) {
				return this.colChange(theRow, theCol);
			} else {
				return undefined;
			}
		} else {
			return undefined;
		}
	}
}