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
	/**********************************************************/
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
	objectByKV: function(collection, keyvalues) {
		var cidx = this.indexByKV(collection, keyvalues);
		if(cidx >=0) {
			return collection[cidx];
		} else {
			return undefined;
		}
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
				var colValObj	= this.FCOLLECT.firstByKV(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value?colValObj.value:""):"";

				if (colPrefix != "" && colVal!="")
					ret_val = ret_val.replaceAll(colArr[cidx], colPrefix + colVal);
				else
					ret_val = ret_val.replaceAll(colArr[cidx], colVal);
			} else if( colNames_str.indexOf(".")>=0 ) {
				var colNames 	= colNames_str.split(".");
				var colName 	= colNames[0] ? colNames[0] : "";
				var colPrefix 	= colNames[1] ? colNames[1] : "";
				var colValObj	= this.FCOLLECT.firstByKV(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value[colPrefix]?colValObj.value[colPrefix]:""):"";
				ret_val = ret_val.replaceAll(colArr[cidx], colVal);

			} else {
				var colNames 	= colNames_str;
				var colName 	= colNames.trim();
				var colValObj	= this.FCOLLECT.firstByKV(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value?colValObj.value:""):"";
				ret_val = ret_val.replaceAll(colArr[cidx], colVal);
			}
		}
		return ret_val;
	},
	/**********************************************************/

	rowstate: function(theRow, p_rowstate) {
		if( theRow!=undefined ) {
			if(p_rowstate!=undefined) theRow.rowstate = p_rowstate;
			return theRow.rowstate;
		} else {
			return undefined;
		}
	},
	rowerror: function(theRow, p_error) {
		if( theRow!=undefined) {
			if(p_error!=undefined) theRow.error = p_error;
			return theRow.error;
		} else {
			return undefined;
		}
	},
	colerror: function(theRow, col_name, p_error) {
		if( theRow != undefined ) {
			var theCol = this.objectByKV(theRow.cols, {name:col_name});
			if(theCol!=undefined) {
				if(p_error!=undefined) {
					theCol.errorCode 		= p_error.errorCode;
					theCol.errorMessage  	= p_error.errorMessage;
					this.validate(theRow);
				} 
				return {errorCode: theCol.errorCode, errorMessage: theCol.errorMessage}; 
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
			var theCol = theRow.cols[colName];
			
			if( theCol.errorCode > 0 ) {
				errorCode 		= Math.max(errorCode, theCol.errorCode);
				errorMessage 	+= (errorMessage!="" && theCol.errorMessage!=""?"\n":"") + theCol.errorMessage;
			}
			
			if(theCol.colstate==1) changed = true;
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

	update: function(theRow, keyvalues) {
		if( theRow!=undefined ) {
			for(var key in keyvalues) {
				var theCol = this.objectByKV(theRow.cols, {name:key});
				if( theCol!=undefined ) {
					return this.colUpdate(theRow, theCol, keyvalues[key]);
				} 
			}
			return theRow;
		} else {
			return undefined;
		}
	},
	colUpdate: function(theRow, theCol, val){
		if( theRow!=undefined ) {
			if( theCol!=undefined ) {

				// set value; and change rowstate 
				if(val==null) val = "";
				if(val != undefined) {
					// write value
					theCol.value = val;
					
					// if it is key col,  need to update row key value
					var t_keys = theRow.keys;
					for(var colName in t_keys) {
						if(colName == theCol.name) theRow.keys[colName] = theCol.value; 	
					}
					
					if( $.isPlainObject(theCol.value) ) {
						// compare object {1:true, 2:true}
						var objectSame = true;
						for(var vkey in theCol.value) {
							var curVal = theCol.value[vkey]?theCol.value[vkey]:"";
							var curCur = theCol.current[vkey]?theCol.current[vkey]:"";
							if(curVal!=curCur) objectSame = false;
						} 
						for(var vkey in theCol.current) {
							var curVal = theCol.value[vkey]?theCol.value[vkey]:"";
							var curCur = theCol.current[vkey]?theCol.current[vkey]:"";
							if(curVal!=curCur) objectSame = false;
						} 
						if(objectSame) 
							theCol.colstate = 0; 
						else  
							theCol.colstate = 1; 

					} else {
						if( theCol.value==theCol.current )  // safe or not ?? null, 0, undefined
							theCol.colstate 	= 0; 
						else	
							theCol.colstate 	= 1; 
					}

					theCol.errorCode 	= 0;
					theCol.errorMessage 	= "";	
					this.validate(theRow);
					return theCol.value;
				} else {
					// read value
					return theCol.value;
				}
				// end of set value

			} else {
				return undefined;
			}
		} else {
			return undefined;
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

	getColVal: function(theCol) {
		var ret_val = "";
		switch( theCol.coltype ) {
			case "hidden":
			case "textbox":
			case "textarea":
			case "ckeditor":
			case "password":
				ret_val = theCol.value?theCol.value:"";
				break;
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				ret_val = $.isPlainObject(theCol.value)?this.check2Array(theCol.value):[];
				break;

			case "date":
			case "time":
				ret_val = theCol.value?theCol.value:"";
				break;
			case "datetime":
				//var tmp_dt = parseInt(theCol.value)>0?theCol.value:"";
				ret_val = $.isPlainObject(theCol.value)?this.array2Datetime(theCol.value):"";
				break;

			case "select":
				ret_val = theCol.value?theCol.value:"";
				break;
			case "radio":
			case "radio1":
			case "radio2":
			case "radio3":
				ret_val = theCol.value?theCol.value:0;
				break;
			case "relation":
			case "bool":
				ret_val = theCol.value?1:0;
				break;
			case "passpair":
				ret_val = {}
				ret_val.password = theCol.value.password?theCol.value.password:"";
				ret_val.confirm  = theCol.value.confirm?theCol.value.confirm:"";
				break;
			case "text":
				ret_val = "";

			/*** below coltype only for filter ***/
			case "daterange":
			case "timerange":
			case "range":
				ret_val = {}
				ret_val.from = theCol.value.from?theCol.value.from:"";
				ret_val.to	 = theCol.value.to?theCol.value.to:"";
				break;
			case "datetimerange":
				ret_val = {}
				ret_val.from = $.isPlainObject(theCol.value.from)?this.array2Datetime(theCol.value.from):"";
				ret_val.to	 = $.isPlainObject(theCol.value.to)?this.array2Datetime(theCol.value.to):"";
				break;

			default:
				ret_val = "";
				break;
		} 
		return ret_val;
	},
	getCol: function(theCol) {
		var nCol = undefined;
		switch(theCol.coltype) {
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
				var nCol 		= angular.copy(theCol);
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
	getChangeCols: function(theRow) {
		var ncols = [];
		switch(theRow.rowstate) {
			case 0:
				break;
			case 1:
				for(var cidx in theRow.cols) {
					if( theRow.cols[cidx].key==1 || theRow.cols[cidx].need==1 || theRow.cols[cidx].coltype=="relation" || theRow.cols[cidx].colstate==1 ) {
						var ncol = this.getCol( theRow.cols[cidx] );
						if(ncol) ncols.push(ncol);
					} //if
				} // for	
				break;
			case 2:
				for(var cidx in theRow.cols) {
					var ncol = this.getCol(theRow.cols[cidx] );
					if(ncol) ncols.push(ncol);
				} // for	
				break;
			case 3:
				break;
		}
		return ncols;
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
	

	setColVal: function(theCol, p_val) {
		var ret_val = "";
		switch( theCol.coltype ) {
			case "hidden":
			case "textbox":
			case "textarea":
			case "ckeditor":
			case "password":
				if( theCol.value	!= undefined ) theCol.value 	= p_val?p_val:"";
				if( theCol.current!= undefined ) theCol.current = p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				if( !$.isArray(p_val) ) p_val = []; 
				if( theCol.value	!= undefined ) theCol.value 	= this.array2Check(p_val);
				if( theCol.current!= undefined ) theCol.current = this.array2Check(p_val);
				ret_val = this.array2Check(p_val);
				break;

			case "date":
			case "time":
				if( theCol.value	!= undefined ) theCol.value 	= p_val?p_val:"";
				if( theCol.current!= undefined ) theCol.current = p_val?p_val:"";
				ret_val = parseInt(p_val)?p_val:"";
				break;
			case "datetime":
				p_val = p_val?p_val:"";
				if( theCol.value	!= undefined ) theCol.value 	= this.datetime2Array(p_val);
				if( theCol.current!= undefined ) theCol.current = this.datetime2Array(p_val);
				ret_val = this.datetime2Array(p_val);
				break;
			case "select":
				if( theCol.value	!= undefined ) theCol.value 	= p_val?p_val:"";
				if( theCol.current!= undefined ) theCol.current = p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
			case "radio":
			case "radio1":
			case "radio2":
			case "radio3":
				if( theCol.value	!= undefined ) theCol.value 	= parseInt(p_val)?parseInt(p_val):0;
				if( theCol.current!= undefined ) theCol.current = parseInt(p_val)?parseInt(p_val):0;
				ret_val = parseInt(p_val)?parseInt(p_val):0;
				break;
			case "relation":
			case "bool":
				if( theCol.value	!= undefined ) theCol.value 	= parseInt(p_val)?true:false;
				if( theCol.current!= undefined ) theCol.current = parseInt(p_val)?true:false;
				ret_val = p_val=="1"?true:false;
				break;
			case "passpair":
				if( theCol.value	!= undefined ) {
					theCol.value  = {};
					theCol.value.password = p_val?p_val:"";
					theCol.value.confirm 	= p_val?p_val:"";
				}
				if( theCol.current != undefined ) {
					theCol.current  = {};
					theCol.current.password 	= p_val?p_val:"";
					theCol.current.confirm 	= p_val?p_val:"";
				}
				ret_val = angular.copy(theCol.value);
				break;

			case "text":
				if( theCol.value	!= undefined ) theCol.value 	= p_val?p_val:"";
				if( theCol.current!= undefined ) theCol.current = p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
			default:
				if( theCol.value	!= undefined ) theCol.value 	= p_val?p_val:"";
				if( theCol.current!= undefined ) theCol.current = p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
		}	 
		return ret_val;
	}

}

WLIU.FUNC = function() {}
WLIU.FUNC.prototype = {
}