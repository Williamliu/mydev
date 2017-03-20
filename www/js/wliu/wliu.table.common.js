/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};

WLIU.COM = function() {}
WLIU.COM.prototype = {
	/**********************************************************/
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
				var colValObj	= FCOLLECT.firstByKV(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value?colValObj.value:""):"";

				if (colPrefix != "" && colVal!="")
					ret_val = ret_val.replaceAll(colArr[cidx], colPrefix + colVal);
				else
					ret_val = ret_val.replaceAll(colArr[cidx], colVal);
			} else if( colNames_str.indexOf(".")>=0 ) {
				var colNames 	= colNames_str.split(".");
				var colName 	= colNames[0] ? colNames[0] : "";
				var colPrefix 	= colNames[1] ? colNames[1] : "";
				var colValObj	= FCOLLECT.firstByKV(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value[colPrefix]?colValObj.value[colPrefix]:""):"";
				ret_val = ret_val.replaceAll(colArr[cidx], colVal);

			} else {
				var colNames 	= colNames_str;
				var colName 	= colNames.trim();
				var colValObj	= FCOLLECT.firstByKV(rowCols, {name: colName});
				var colVal = colValObj?(colValObj.value?colValObj.value:""):"";
				ret_val = ret_val.replaceAll(colArr[cidx], colVal);
			}
		}
		return ret_val;
	},
	/**********************************************************/
}

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
				}
				return col			
			case 3:
				var col = arguments[0];
				var key = arguments[1];
				var val = arguments[2];
				col[key] = val; 
				return col;
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
		return ncollection?(ncollection.length>0?ncollection[0]:undefined):undefined;
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

// Table Objects
/******************************/
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
WLIU.COL = function(opts) {
	this.col = {
		key:		0, // 0, 1
		scope: 		"",
		name: 		"",
		col:		"", // default same as name, col is database colname
		colname:	"", // display name
		coldesc:    "", // display description
		table:		"", // P = primary; S=secondary, M=medium;  one: P;  one2one: P->S;  one2many: P->S;  many2many: P - M - S
		coltype:	"textbox",  //hidden, textbox, checkbox,checkbox1,checkbox2,checkbox3, radio, select, textarea, datetime, date, time, intdate, upload ....
		datatype:   "ALL",  // number, email, date, datetime, ....
		need:		0,     // required  must include this col even if value not change.  other is must change
		notnull:  	0,     // not null - not allowed null, different from need 
		unique:		0,
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
	this.col.table = this.col.table?this.col.table.toLowerCase():"p";
	return this.col;
}
WLIU.ROW = function( cols, nameValues, scope ) {
	if( scope == undefined ) scope = "";
	if( nameValues == undefined ) nameValues = {};

	this.guid			= nameValues.guid?nameValues.guid:guid();
	this.scope			= scope;
	this.rowstate 		= 2;  //default is new row;   0 - normal; 1 - changed;  2 - added;  3 - deleted
	this.error			= { errorCode: 0, errorMessage: "" };  
	this.cols			= [];
	

	// create cols:  []
	for(cidx = 0; cidx < cols.length; cidx++) {
		var colObj = {};
		colObj.scope 		= scope!=""?scope:cols[cidx].scope;
		colObj.name  		= cols[cidx].name;
		colObj.key  		= cols[cidx].key?cols[cidx].key:0;
		colObj.defval  		= cols[cidx].defval?cols[cidx].defval:"";

		colObj.colname  	= cols[cidx].colname?cols[cidx].colname:colObj.name.capital();
		colObj.coldesc  	= cols[cidx].coldesc?cols[cidx].coldesc:"";

		colObj.table		= cols[cidx].table?cols[cidx].table:"p";
		colObj.col			= cols[cidx].col?cols[cidx].col:cols[cidx].name;
		colObj.coltype  	= cols[cidx].coltype?cols[cidx].coltype.toLowerCase():"textbox";
		colObj.datatype  	= cols[cidx].datatype?cols[cidx].datatype.toUpperCase():"ALL";
		colObj.need  		= cols[cidx].need?cols[cidx].need:0;
		colObj.notnull  	= cols[cidx].notnull?cols[cidx].notnull:0;
		colObj.unique  		= cols[cidx].unique?cols[cidx].unique:0;
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
WLIU.FILE = function( opts ) {
	this.file 		= {
		sn:             0,  	// sn for image array index
		errorCode:		0, 
		errorMessage:	"",
		scope: 			"",
		key1:			0,
		key2:			0,
		key3:			0,

		
		title_en:   	"",
		title_cn:   	"",
		detail_en:  	"",
		detail_cn:  	"",
		
		full_name:  	"",
		short_name:	 	"",
		ext_name:   	"",
		mime_type:  	"",
		size:			0,

		access:     	0,
		main:       	0,
		orderno:    	0,
		status:     	0,
		url:			"",
		data:       	"",
		guid:	        "",  	// guid for position file in the list,  webpage layout
		token:			""
	};
	$.extend(this.file, opts);
	return this.file;
}
WLIU.IMAGE = function( opts ) {
	this.image 		= {
		sn:             0,  // sn for image array index
		errorCode:		0, 
		errorMessage:	"",
		scope: 			"",
		id:    			0,
		key1:			0,
		key2:			0,
		key3:			0,

		
		title_en:   	"",
		title_cn:   	"",
		detail_en:  	"",
		detail_cn:  	"",
		
		full_name:  	"",
		short_name: 	"",
		ext_name:   	"",
		mime_type:  	"",
		size:			0,

		access:     	0,
		main:       	0,
		orderno:    	0,
		status:     	0,
		url:			"",
		guid:	        "",  // guid for postion image in the list, for webpage layout
		token:			"",

		resize:     {
			 origin:	{ ww: 1000, 	hh:1000, 	width:0, height:0,  name:"", size: 0, data:"" },
			 thumb: 	{ ww: 100, 		hh:100, 	width:0, height:0,  name:"", size: 0, data:"" },
			 tiny: 		{ ww: 200, 		hh:200, 	width:0, height:0,  name:"", size: 0, data:"" },
			 small: 	{ ww: 400, 		hh:400, 	width:0, height:0,  name:"", size: 0, data:"" },
			 medium: 	{ ww: 600, 		hh:600, 	width:0, height:0,  name:"", size: 0, data:"" },
			 large:		{ ww: 800, 		hh:800, 	width:0, height:0,  name:"", size: 0, data:"" }
		}
	};
	$.extend(this.image, opts);
	return this.image;
}
/******************************/

WLIU.ROWACTION = function(){}
WLIU.ROWACTION.prototype = {
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
			var theCol = FCOLLECT.objectByKV(theRow.cols, {name:col_name});
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

	colUpdate: function(theRow, theCol, val){
		if( theRow!=undefined ) {
			if( theCol!=undefined ) {

				// set value; and change rowstate 
				if(val==null) val = "";
				if(val != undefined) {
					// write value
					theCol.value = val;
					
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
	colRestore: function(theRow, theCol) {
		if( theRow!=undefined ) {
			if( theCol!=undefined ) {
				var keyvalues = {};
				keyvalues[theCol.name] = angular.copy(theCol.current);
				this.update(theRow, keyvalues);
			}
		}
	},
	colChange: function(theRow, theCol) {
		if( theRow && theCol ) {
			var keyvalues = {};
			keyvalues[theCol.name] = theCol.value;
			return this.update(theRow, keyvalues);
		} else {
			return undefined;
		}
	},
	relationCol: function(theRow) {
		if( theRow ) {
			return FCOLLECT.firstByKV(theRow.cols,  {coltype: "relation"});
		} else {
			return undefined;
		}
	},
	relationHide: function(theRow, theCol) {
		if(theRow) {
			var relCol = FCOLLECT.objectByKV(theRow.cols, {coltype:"relation", table:theCol.table});
			if(relCol) {
				if( relCol.value )
					return false;
				else 
					return true;
			} else {
				return false;
			}
		}
	},
	relationChange: function(theRow) {
		if( theRow ) {
			var relCol = this.relationCol(theRow);
			if( relCol ) {
				if( relCol.value ) {
					// true = check 
					if( relCol.current ) {
						var rCols = FCOLLECT.collectionByKV(theRow.cols, {table: relCol.table});
						for(var cidx in rCols) {
							if(rCols[cidx].coltype!="relation")	this.colRestore(theRow, rCols[cidx]);
						}
					}
				} else {
					// false = uncheck 
					var rCols = FCOLLECT.collectionByKV(theRow.cols, {table: relCol.table});
					for(var cidx in rCols) {
						if(rCols[cidx].coltype!="relation") {
							var keyvalues = {};
							keyvalues[rCols[cidx].name] = this.toColVal(rCols[cidx].coltype, "");
							this.update(theRow, keyvalues);
						}
					}
					
				}
			} // end of if(relCol)
			return theRow;
		} else {
			return undefined;
		}// end of if(theRow) 
	},

	update: function(theRow, keyvalues) {
		if( theRow!=undefined ) {
			for(var key in keyvalues) {
				var theCol = FCOLLECT.objectByKV(theRow.cols, {name:key});
				if( theCol!=undefined ) {
					return this.colUpdate(theRow, theCol, keyvalues[key]);
				} 
			}
			return theRow;
		} else {
			return undefined;
		}
	},
	cancel: function(theRow) {
		var errorCode 				= 0;
		var errorMessage 			= "";
		theRow.error.errorCode 		= errorCode;
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
			case "upload":
			case "editor":
				ret_val = theCol.value?theCol.value:"";
				break;
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				ret_val = $.isPlainObject(theCol.value)?FCOM.check2Array(theCol.value):[];
				break;

			case "date":
			case "time":
				ret_val = theCol.value?theCol.value:"";
				break;
			case "datetime":
				//var tmp_dt = parseInt(theCol.value)>0?theCol.value:"";
				ret_val = $.isPlainObject(theCol.value)?FCOM.array2Datetime(theCol.value):"";
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
				ret_val.from = $.isPlainObject(theCol.value.from)?FCOM.array2Datetime(theCol.value.from):"";
				ret_val.to	 = $.isPlainObject(theCol.value.to)?FCOM.array2Datetime(theCol.value.to):"";
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
			case "upload":
			case "editor":

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
				for(var cidx in theRow.cols) {
					if(theRow.cols[cidx].key==1 || theRow.cols[cidx].coltype=="relation") {
						var ncol = this.getCol( theRow.cols[cidx] );
						if(ncol) ncols.push(ncol);
					} //if
				} // for	
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
			nrow.guid       = theRow.guid;
			nrow.error      = { errorCode:0, errorMessage:"" };
			nrow.cols		= this.getChangeCols(theRow);
			nrows.push(nrow);
		}
		return nrows;
	},
	// set row col value to empty or defval if it has default value
	resetRow: function(theRow) {
		if( theRow ) {
			for(var cIdx in theRow.cols) {
				if( theRow.cols[cIdx].key ) continue;
				var colName	= theRow.cols[cIdx].name;
				var colVal 	= theRow.cols[cIdx].defval?theRow.cols[cIdx].defval:"";
				var nameValues = {};
				nameValues[colName] = colVal;
				this.update( theRow, nameValues);
			}
			return theRow;
		} else {
			return undefined;
		}
	},
	setColVal: function(theCol, p_val) {
		if(theCol==undefined) return;
		var ret_val = "";
		switch( theCol.coltype ) {
			case "hidden":
			case "textbox":
			case "textarea":
			case "ckeditor":
			case "password":
			case "upload":
			case "editor":
				if( theCol.value	!= undefined ) theCol.value 	= p_val?p_val:"";
				if( theCol.current	!= undefined ) theCol.current 	= p_val?p_val:"";
				ret_val = p_val?p_val:"";
				break;
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				if( !$.isArray(p_val) ) p_val = []; 
				if( theCol.value	!= undefined ) theCol.value 	= FCOM.array2Check(p_val);
				if( theCol.current!= undefined ) theCol.current = FCOM.array2Check(p_val);
				ret_val = FCOM.array2Check(p_val);
				break;

			case "date":
			case "time":
				if( theCol.value	!= undefined ) theCol.value 	= p_val?p_val:"";
				if( theCol.current!= undefined ) theCol.current = p_val?p_val:"";
				ret_val = parseInt(p_val)?p_val:"";
				break;
			case "datetime":
				p_val = p_val?p_val:"";
				if( theCol.value	!= undefined ) theCol.value 	= FCOM.datetime2Array(p_val);
				if( theCol.current!= undefined ) theCol.current = FCOM.datetime2Array(p_val);
				ret_val = FCOM.datetime2Array(p_val);
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
				if( theCol.current!= undefined ) theCol.current 	= parseInt(p_val)?true:false;
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
	},

	toColVal: function(colType, p_val) {
		var ret_val = "";
		switch( colType ) {
			case "hidden":
			case "textbox":
			case "textarea":
			case "ckeditor":
			case "password":
			case "upload":
			case "editor":
				ret_val = p_val?p_val:"";
				break;
			case "checkbox":
			case "checkbox1":
			case "checkbox2":
			case "checkbox3":
				if( !$.isArray(p_val) ) p_val = []; 
				ret_val = FCOM.array2Check(p_val);
				break;

			case "date":
			case "time":
				ret_val = p_val?p_val:"";
				break;
			case "datetime":
				p_val = p_val?p_val:"";
				ret_val = FCOM.datetime2Array(p_val);
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
	}	

}

WLIU.TABLEACTION = function(){}
WLIU.TABLEACTION.prototype = {
	index: function(theTable, guid) {
		return FCOLLECT.indexByKV(theTable.rows, {guid: guid});
	},
	indexByRow: function(theTable, theRow) {
		return this.index(theTable, theRow.guid);
	},
	setColsDefault: function(theTable, IDKeyValues) {
		if( $.isPlainObject(IDKeyValues) ) {
			for(var key in IDKeyValues) {
				this.colDefault(theTable, key, IDKeyValues[key] );
			}
		}
	},
	tableError: function(theTable, p_error) {
		if(p_error!=undefined) {
			theTable.error = p_error;
		} 
		return theTable.error; 
	},
	colMeta: function(theTable, col_name) {
		return FCOLLECT.objectByKV(theTable.cols, {name: col_name});
	},
	colDefault: function(theTable, col_name, p_value) {
		var theCol = this.colMeta(theTable, col_name);
		if( theCol ) {
			FOBJECT.update(theCol, {defval: p_value});
			return theCol.defval;
		} else {
			return undefined;
		}
	},
	colRelation: function(theTable) {
		return FCOLLECT.objectByKV(theTable.cols, {coltype: "relation"});
	},
	colList: function(theTable, col_name) {
		var ret_list = {};
		var oCol = this.colMeta(theTable, col_name);
		if( oCol ) {
			var listName = oCol.list?oCol.list:"";
			if( listName ) {
				if( theTable.lists[listName] ) {
					ret_list = theTable.lists[listName];
				} 
			} 
		} 
		return ret_list;
	},
	relationHide: function(theTable, theRow, col_name) {
		var t_row = this.getRow(theTable, theRow);
		var theCol = this.getCol(theTable, t_row, col_name);
		return FROW.relationHide(t_row, theCol);
	},
	relationChange: function(theTable, theRow) {
		var t_row = this.getRow(theTable, theRow);
		return FROW.relationChange(t_row);
	},
	relationHideCurrent: function(theTable, col_name) {
		var theRow = this.getCurrent(theTable);
		var theCol = this.getCol(theTable, theRow, col_name);
		return FROW.relationHide(theRow, theCol);
	},
	relationChangeCurrent: function(theTable) {
		var theRow = this.getCurrent(theTable);
		return FROW.relationChange(theRow);
	},
	getList: function(theTable, list_name) {
		if( theTable.lists ) {
			if(theTable.lists[list_name]) 
				return theTable.lists[list_name];
			else 
				return undefined;
		} else {
			return undefined;
		}
	},
	getLists: function(theTable) {
		var nlists = {};
		for(var lname in theTable.lists) {
			if(theTable.lists[lname].loaded==0) {
				nlists[lname] = {};
				nlists[lname].loaded = 0;
				nlists[lname].list = [];
			}
		}
		return nlists;
	},
	setLists: function(theTable, nlists) {
		for(var listName in nlists) {
			var nlistObj = theTable.getList(listName);
			if(nlistObj) {
				nlistObj.loaded = nlists[listName].loaded;
				nlistObj.keys 	= nlists[listName].keys;
				nlistObj.list 	= nlists[listName].list;
			}
		}
		return theTable.lists;
	},
	
	filterMeta: function(theTable, col_name) {
		return FCOLLECT.firstByKV(theTable.filters,  {name: col_name});
	},
	filterClear: function(theTable) {
		for(var fidx in theTable.filters) {
			FROW.setColVal(theTable.filters[fidx], "");
		}
		return theTable.filters;
	},
	filterValue: function(theTable, name, val) {
		if(val!=undefined) {
			if( theTable.filterMeta(name) ) {
				return FROW.setColVal( this.filterMeta(name), val );
			} else {
				return undefined;
			}
		} else {
			if( theTable.filterMeta(name) ) {
				return FROW.getColVal( theTable.filterMeta(name) );
			} else {
				return undefined;
			}
		}
	},
	filterDefault: function(theTable, name, val) {
		if(val!=undefined) {
			if( theTable.filterMeta(name) ) {
				theTable.filterMeta(name).defval = val;
				theTable.filterMeta(name).value = val;
				return val;
			} else {
				return undefined;
			}
		} else {
			if( theTable.filterMeta(name) ) {
				return theTable.filterMeta(name).defval?theTable.filterMeta(name).defval:undefined;
			} else {
				return undefined;
			}
		}
	},
	getFilters: function(theTable) {
		var nfilters = [];
		for(var fidx in theTable.filters) {
			var nfilter = angular.copy(theTable.filters[fidx]);
			nfilter.value = FROW.getColVal(theTable.filters[fidx]);
			if(nfilter.need) nfilters.push(nfilter);
			if($.isArray(nfilter.value) && nfilter.value.length>0 && !nfilter.need ) nfilters.push(nfilter);
			if(!$.isArray(nfilter.value) && nfilter.value && !$.isPlainObject(nfilter.value) && !nfilter.need ) nfilters.push(nfilter);
			if($.isPlainObject(nfilter.value) && (nfilter.value.from!="" || nfilter.value.to!="") && !nfilter.need) nfilters.push(nfilter);
		}
		return nfilters;
	},
	
	getRow: function(theTable, theRow) {
		if(theRow) {
			return FCOLLECT.objectByKV(theTable.rows, {guid: theRow.guid});
		} 
	},
	getRowByGuid: function(theTable, guid) {
		return FCOLLECT.objectByKV(theTable.rows, {guid: guid});
	},
	getCurrent: function(theTable) {
		var rowidx = this.index(theTable, theTable.current);
		if(rowidx>=0 && rowidx<theTable.rows.length) {
			return theTable.rows[rowidx];
		} else {
			return undefined;
		}
	},
	getCol: function(theTable, theRow, col_name) {
		var t_row = this.getRow(theTable, theRow);
		if( t_row != undefined ) {
			return FCOLLECT.objectByKV(t_row.cols, {name:col_name});
		} else {
			return undefined;
		}
	},
	getColCurrent: function(theTable, col_name) {
		var t_row = this.getCurrent(theTable);
		if( t_row != undefined ) {
			return FCOLLECT.objectByKV(t_row.cols, {name:col_name});
		} else {
			return undefined;
		}
	},
	getColByGuid: function(theTable, guid, col_name) {
		var t_row = this.getRowByGuid(theTable, guid);
		if( t_row != undefined ) {
			return FCOLLECT.objectByKV(t_row.cols, {name:col_name});
		} else {
			return undefined;
		}
	},
	changeCol: function(theTable, theRow, col_name) {
		var t_row = this.getRow(theTable, theRow);
		var t_col = this.getCol(theTable, t_row, col_name);
		return FROW.colChange(t_row, t_col);
	},
	changeColCurrent: function(theTable, col_name) {
		var t_row = this.getCurrent(theTable);
		var t_col = this.getCol(theTable, t_row, col_name);
		return FROW.colChange(t_row, t_col);
	},
	changeColByGuid: function(theTable, guid, col_name) {
		var t_row = this.getRowByGuid(theTable, guid);
		var t_col = this.getColByGuid(theTable, guid, col_name);
		return FROW.colChange(t_row, t_col);
	},
	setImage: function(theTable, theRow, col_name, oImg) {
		var t_col = this.getCol(theTable, theRow, col_name);
		if( t_col ) {
			var view = "medium";
			if(this.colMeta(theTable, col_name) && this.colMeta(theTable,col_name).view ) view = this.colMeta(theTable,col_name).view; 
			t_col.value = oImg.resize[view].data;
		}
	},
	setImageCurrent: function(theTable, col_name, oImg) {
		var t_row = this.getCurrent(theTable);
		var t_col = this.getCol(theTable, t_row, col_name);
		if( t_col ) {
			var view = "medium";
			if(this.colMeta(theTable, col_name) && this.colMeta(theTable,col_name).view ) view = this.colMeta(theTable,col_name).view; 
			t_col.value = oImg.resize[view].data;
		}
	},
	newRow: function(theTable, keyvalues) {
		var t_row = new  WLIU.ROW(theTable.cols, keyvalues, theTable.scope);
		return t_row;
	},
	addRow: function(theTable, ridx, nrow) {
		if(ridx==undefined) ridx = 0;
		if(!nrow) {
			nrow = this.newRow(theTable);
		}
		FCOLLECT.insert(theTable.rows, ridx, nrow );
		theTable.current = nrow.guid;
		//theTable.sc.$apply();
		return nrow;
	},


	// for form use
	formInit: function(theTable, IDKeyValues, callback) {
		this.init(theTable, IDKeyValues, callback);
	},
	formNew: function(theTable, IDKeyValues, callback) {
		if( this.colRelation(theTable) ) this.colRelation(theTable).defval = true; 
		this.init(theTable, IDKeyValues, {
			ajaxSuccess: function(){
				theTable.addRow();
				if(!theTable.sc.$$phase) {
					theTable.sc.$apply();
				}
				if(callback) if($.isFunction(callback)) callback(theTable);
			}
		});
	},
	formGet: function(theTable, IDKeyValues, callback) {
		if( this.colRelation(theTable) ) this.colRelation(theTable).defval = true; 
		this.setColsDefault(theTable, IDKeyValues);
		this.getRows(theTable, callback);
	},
	// end of form use
    
	// for one2many & many2many
	getRecords: function(theTable, IDKeyValues, callback) {
		this.setColsDefault(theTable, IDKeyValues);
		this.getRows(theTable, callback);
	},
	getAllRecords: function(theTable, IDKeyValues, callback) {
		this.setColsDefault(theTable, IDKeyValues);
		this.allRows(theTable, callback);
	},
	getMatchRecords: function(theTable, IDKeyValues, callback) {
		this.setColsDefault(theTable, IDKeyValues);
		this.matchRows(theTable, callback);
	},
	// end of one2many & many2many


	// client side remove the record from array and table rows
	removeRow: function(theTable, theRow) {
		if( theTable && theRow ) {
			var ridx = this.index(theTable, theRow.guid);
			FCOLLECT.delete(theTable.rows, ridx);
		}
		return theRow;
	},
	// client side mark deleted, record still there
	detachRow: function(theTable, theRow) {
		return FROW.detach(theRow);
	},
	cancelRow: function(theTable, theRow) {
		if( theRow ) {
			switch( theRow.rowstate ) {
				case 0: 
					break;
				case 1:
					FROW.cancel(theRow);
				    break;
				case 2:
					this.removeRow(theTable, theRow);
					break;
				case 3:
					FROW.cancel(theRow);
					break;
			}
			return theRow;
		} else {
			return undefined;
		}
	},
	cancelRows: function(theTable) {
		for(var i = theTable.rows.length-1; i>=0; i--) {
			this.cancelRow(theTable, theTable.rows[i]);
		}
		theTable.error.errorCode 	= 0;
		theTable.error.errorMessage = "";
		return theTable.rows;
	},
	getChangeRows: function(theTable) {
		var nrows = [];
		for(var ridx in theTable.rows) {
			if( theTable.rows[ridx].rowstate > 0  ) {
				var theRow = theTable.rows[ridx];
				//if( theRow.error.errorCode <= 0 ) {
				if( true ) {
					var nrow = {};
					nrow.scope 		= theRow.scope;
					nrow.guid  		= theRow.guid;
					nrow.rowstate 	= theRow.rowstate;
					nrow.error      = { errorCode:0, errorMessage:"" };
					nrow.cols		= FROW.getChangeCols(theRow);
					nrows.push(nrow);
				} // errorCode > 0
			} // if rowstate > 0
		}
		return nrows;
	},

	/*** AJAX Method ****/
	// init rows and keys
	// Notes: colsDefault not required :  one, one2one,   colsDefault of primary table is required by one2many, many2many
	init: function(theTable, IDKeyValues, callback) {
		this.setColsDefault(theTable, IDKeyValues);
		theTable.rows = [];

		var ntable = {};
		ntable.scope = theTable.scope;
		ntable.lang  = theTable.lang;
		ntable.action = "init";
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = theTable.cols; // must provide cols meta to get data from database;
		ntable.navi = theTable.navi;
		ntable.lists = this.getLists(theTable);
		this.ajaxCall(theTable, ntable, callback);
	},
	getRows: function(theTable, callback) {
		var ntable = {};
		ntable.scope = theTable.scope;
		ntable.lang  = theTable.lang;
		ntable.action = "get";
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = theTable.cols; // must provide cols meta to get data from database;
		ntable.navi = theTable.navi;
		ntable.filters = this.getFilters(theTable);
		ntable.lists = this.getLists(theTable);
		ntable.rows = [];

		this.ajaxCall(theTable, ntable, callback);
	},
	allRows: function(theTable, callback) {
		theTable.navi.match = 0;
		this.getRows(theTable, callback);
	},
	matchRows: function(theTable, callback) {
		theTable.navi.match = 1;
		this.getRows(theTable, callback);
	},
	saveRow: function(theTable, theRow, callback) {
		var ntable = {};
		ntable.scope = theTable.scope;
		ntable.lang  = theTable.lang;
		ntable.action = "save";
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = theTable.cols;    
		ntable.navi = theTable.navi;
		//ntable.filters = this.getFilters();
		ntable.lists = this.getLists(theTable);
		ntable.rows = FROW.getChangeRow(theRow);

		this.ajaxCall(theTable, ntable, callback);
	},
	saveRows: function(theTable, callback) {
		var ntable = {};
		ntable.scope = theTable.scope;
		ntable.lang  = theTable.lang;
		ntable.action = "save";
		ntable.error  = {errorCode: 0, errorMessage:""};
		ntable.cols = theTable.cols;  
		ntable.navi = theTable.navi;
		//ntable.filters = this.getFilters();
		ntable.lists = this.getLists(theTable);
		ntable.rows = this.getChangeRows(theTable);

		this.ajaxCall(theTable, ntable, callback);
	},
	
	/*** AJAX CALL and Sync Rows */
	ajaxCall: function(theTable, ntable, callback) {
		var _self = theTable;
		if( _self.wait ) $(_self.wait).trigger("show");
		_self.navi.loading = 1;
		if(callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(ntable);
		
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

				if(callback && callback.ajaxAfter && $.isFunction(callback.ajaxAfter) ) callback.ajaxAfter(req.table);

				switch(req.table.action) {
					case "init":
					case "get": 
						//console.log(req.table);
						FTABLE.setLists(_self, req.table.lists);
						FTABLE.syncRows(_self, req.table);
						break;
					case "save":
						//console.log(req.table);
					    FTABLE.updateRows(_self, req.table);
						break;
				}

				if( parseInt(req.table.error.errorCode) == 0 ) {
					if( callback && callback.ajaxSuccess && $.isFunction(callback.ajaxSuccess) ) callback.ajaxSuccess(_self);
				} else {
					if( callback && callback.ajaxError && $.isFunction(callback.ajaxError) ) callback.ajaxError(_self);
				}
				$(_self.taberror).trigger("ishow");
				if( callback && callback.ajaxComplete && $.isFunction(callback.ajaxComplete) ) callback.ajaxComplete(_self);

				_self.navi.loading = 0;
				if(!_self.sc.$$phase) {
					_self.sc.$apply();
		 		}

			},
			type: "post",
			url: _self.url
		});
	},
	syncRows: function(theTable, ntable) {
		theTable.tableError(ntable.error);
		theTable.rows 		= [];
		theTable.current 	= "";
		theTable.navi = angular.copy(ntable.navi);

		// update primary table information: one2one, one2many, many2many 
		if( ntable.primary && $.isArray(ntable.primary) ) {
			if( ntable.primary.length>0 ) {
				for(var pidx in ntable.primary) {
					var colObj = ntable.primary[pidx];
					for(var colName in colObj) {
						theTable.colDefault(colName, colObj[colName]);
					}
				}
			}
		}
		// append row to table.rows
		for(var ridx in ntable.rows) {
			var theRow = ntable.rows[ridx];
			var nrow = theTable.newRow( theRow );
			nrow.rowstate = 0;

			for(var colName in theRow) {
				ncol = FCOLLECT.firstByKV(nrow.cols, {name: colName});
				FROW.setColVal(ncol, theRow[colName] );
			}
			FTABLE.addRow(theTable, -1, nrow);
		}

		// set first row as current row;
		if(theTable.rows.length>0) theTable.current = theTable.rows[0].guid;
	},
	updateRows: function(theTable, ntable) {
			//theTable.current = "";
			theTable.tableError(ntable.error);
			//if(ntable.success <= 0 || ntable.error.errorCode > 0) return;
			// update primary table information: one2one, one2many, many2many 
			if( ntable.primary && $.isArray(ntable.primary) ) {
				if( ntable.primary.length>0 ) {
					for(var pidx in ntable.primary) {
						var colObj = ntable.primary[pidx];
						for(var colName in colObj) {
							theTable.colDefault(colName, colObj[colName]);
						}
					}
				}
			}
			
			for(var ridx in ntable.rows) {
				var nRow 		= ntable.rows[ridx];
				var tableRow 	= theTable.getRowByGuid(nRow.guid); 
				if( tableRow ) {
					if( parseInt(nRow.error.errorCode) > 0 ) {
						switch(parseInt(nRow.rowstate)) {
							case 0:
								break;
							case 1:
								theTable.rowError(tableRow, nRow.error);
								for(var cidx in nRow.cols) {
									theTable.colError(tableRow, nRow.cols[cidx].name, {errorCode: nRow.cols[cidx].errorCode, errorMessage: nRow.cols[cidx].errorMessage});
								}
								break;
							case 2:
								theTable.rowError(tableRow, nRow.error);
								for(var cidx in nRow.cols) {
									theTable.colError(tableRow, nRow.cols[cidx].name, {errorCode: nRow.cols[cidx].errorCode, errorMessage: nRow.cols[cidx].errorMessage});
								}
								break;
							case 3:
								theTable.rowError(tableRow, nRow.error);
								break;
						} 
					} else {
						switch(parseInt(nRow.rowstate)) {
							case 0:
								break;
							case 1:
								theTable.rowError(tableRow, nRow.error);
								tableRow.rowstate = 0;
								for(var cidx in tableRow.cols) {
									tableRow.cols[cidx].colstate 	= 0;
									tableRow.cols[cidx].current 	= angular.copy(tableRow.cols[cidx].value);
									theTable.colError(tableRow, tableRow.cols[cidx].name, {errorCode:0, errorMessage:""} );
								}
								break;
							case 2:
								theTable.rowError(tableRow, nRow.error);
								tableRow.rowstate = 0;
								for(var cidx in tableRow.cols) {
									tableRow.cols[cidx].colstate 	= 0;
									tableRow.cols[cidx].current 	= angular.copy(tableRow.cols[cidx].value);
									theTable.colError(tableRow, tableRow.cols[cidx].name, {errorCode:0, errorMessage:""} );
	
									if(tableRow.cols[cidx].key) {
										var keyColObj = FCOLLECT.objectByKV( nRow.cols, { name: tableRow.cols[cidx].name } );
										if( keyColObj ) {
											FROW.setColVal(tableRow.cols[cidx], keyColObj.value);
										}
									}
								}
								theTable.navi.recordtotal++;
								break;
							case 3:
								theTable.rowError(tableRow, nRow.error);
								tableRow.rowstate = 0;
								if( parseInt(tableRow.error.errorCode)<=0 ) {
									theTable.removeRow(tableRow);
									theTable.navi.recordtotal--;
								}
								break;
						}
					}
				} // if(tableRow)
			}  // for

			if(parseInt(ntable.success)) {
				$(theTable.autotip).trigger("auto", ["Submitted Success.", "success"]);
			} 
	},

	// Navigation
	firstPage: function(theTable) {
		if(theTable.navi.pageno<=0){
			theTable.navi.pageno=1;
		}
		if(theTable.navi.pagetotal<=0) theTable.navi.pageno=0;
		if(theTable.navi.pageno>1 && theTable.navi.pagetotal>0) {
			theTable.navi.pageno=1;
			this.getRows(theTable);
		}
	},
	firstState: function(theTable) {
		return !theTable.navi.pageno || !theTable.navi.pagetotal || theTable.navi.pageno<=1 || theTable.navi.pagetotal<=0
	},
	previousPage: function(theTable) {
		if(theTable.navi.pageno<=0){
			theTable.navi.pageno=1;
		}
		if(theTable.navi.pagetotal<=0) theTable.navi.pageno=0;
		if(theTable.navi.pageno>1){
			theTable.navi.pageno--;
			this.getRows(theTable);
		}
	},
	previousState: function(theTable) {
		return !theTable.navi.pageno || !theTable.navi.pagetotal || theTable.navi.pageno<=1 || theTable.navi.pagetotal<=0
	},
	nextPage: function(theTable) {
		if(theTable.navi.pagetotal<=0) theTable.navi.pageno=0;
		if(theTable.navi.pageno>theTable.navi.pagetotal){
			theTable.navi.pageno = theTable.navi.pagetotal;
			this.getRows(theTable);
		}
		if(theTable.navi.pageno<theTable.navi.pagetotal){
			theTable.navi.pageno++;
			this.getRows(theTable);
		}
	},
	nextState: function(theTable) {
		return !theTable.navi.pageno || !theTable.navi.pagetotal || theTable.navi.pageno>=theTable.navi.pagetotal || theTable.navi.pagetotal<=0
	},
	lastPage: function(theTable) {
		if(theTable.navi.pagetotal<=0) theTable.navi.pageno=0;
		if(theTable.navi.pageno!=theTable.navi.pagetotal){
			theTable.navi.pageno = theTable.navi.pagetotal;
			this.getRows(theTable);
		}
	},	
	lastState: function(theTable) {
		return !theTable.navi.pageno || !theTable.navi.pagetotal || theTable.navi.pageno>=theTable.navi.pagetotal || theTable.navi.pagetotal<=0;
	},

	/*
	rowno: function(theTable, p_ridx) {
		if(p_ridx!=undefined) {
			if(p_ridx<0) theTable._rowno = -1;
			if(p_ridx >= theTable.rows.length) theTable._rowno = theTable.rows.length - 1;
			if(p_ridx>=0 && p_ridx < theTable.rows.length) theTable._rowno = p_ridx;
			return theTable._rowno;
		} else {
			return theTable._rowno;
		}
	},
	*/

	rowno: function(theTable, guid) {
		if(guid!=undefined) {
			return this.index(theTable, guid);
		} else {
			return this.index(theTable, theTable.current);
		}
	},
	navLeft: function(theTable) {
		var rowidx = this.rowno(theTable);
		if(rowidx < 0) rowidx = 0;
		if(rowidx > 0 && rowidx < theTable.rows.length) rowidx--;
		theTable.current = theTable.rows[rowidx]?theTable.rows[rowidx].guid:""; 
	},
	navLeftState: function(theTable) {
		var rowidx = this.rowno(theTable);
		if(rowidx > 0 && table.rows.length > 0) 
			return true;
		else 
			return false;
	},
	navRight: function(theTable) {
		var rowidx = this.rowno(theTable);
		if(rowidx < 0) rowidx = 0;
		if(rowidx >= theTable.rows.length - 1) rowidx = theTable.rows.length - 1;
		if(rowidx >= 0 && rowidx < theTable.rows.length - 1) rowidx++;
		theTable.current = theTable.rows[rowidx]?theTable.rows[rowidx].guid:""; 
	},
	navRightState: function(theTable) {
		var rowidx = this.rowno(theTable);
		if(rowidx >= 0 && rowidx < theTable.rows.length - 1 && table.rows.length > 0) 
			return true;
		else 
			return false;
	},
	orderState: function(theTable, name, sort) {
		var colMeta = this.colMeta(theTable, name);
		var colName = colMeta.table + "." + colMeta.col;
		if( theTable.navi.orderby== colName && ( theTable.navi.sortby.toUpperCase()==sort.toUpperCase() || ( theTable.navi.sortby=="" && colMeta.sort.toUpperCase()==sort.toUpperCase() ) ) ) 
			return true;
		else 
			return false;
	}
}

WLIU.FILEACTION = function(opts) {
	this.allowSize = GCONFIG.max_upload_size;	
	this.allowType = GCONFIG.file_allow_type;
	if(opts) {
		if(opts.allowSize) this.allowSize = opts.allowSize;
		if(opts.allowType) this.allowType = opts.allowType;
	}
}
WLIU.FILEACTION.prototype = {
	fromFile: function(theFile, file, callback) {
		theFile.full_name 	= file.name.fileName();
		theFile.short_name 	= file.name.shortName();
		theFile.ext_name 	= file.name.extName();
		theFile.mime_type	= file.type;
		theFile.size  		= file.size;
		theFile.errorCode		= 0;
		theFile.errorMessage 	= "";
		if( this.allowType.indexOf(theFile.ext_name.toUpperCase()) >= 0 || this.allowType.indexOf("*") >= 0 ) {
			if( theFile.size <= this.allowSize ) {
				this._fromBlob(theFile, file, callback);
			} else {
				theFile.errorCode 		= 1;
				theFile.errorMessage 	= "File size {" + theFile.size.toSize() + "} over maximum size {" + this.allowSize.toSize() + "}."; 
				if(callback) if( $.isFunction(callback) ) callback(theFile);
			}
		} else {
			theFile.errorCode 		= 1;
			theFile.errorMessage 	= "Only file type: [" + this.allowType.join(", ") + "] allow to upload."; 
			if(callback) if( $.isFunction(callback) ) callback(theFile);
		}
	},
    exportFile: function(theFile) {
		if(theFile.data) window.open(theFile.data);
	},
	exportBlob: function(blob) {
		this._readBlob(blob, function(dataURL){
			if(dataURL) window.open(dataURL);
		});
	},
	exportDataURL: function(dataURL) {
		if(dataURL) window.open(dataURL);
	},
	//data:MimeType;base64, + base64_str
	exportBase64: function( base64_str, mimeType) {
		if( mimeType )
			if(base64_str) window.open(this.toBase64(base64_str, mimeType));
		else 
			if(base64_str) window.open(base64_str);
	},
	exportHTML: function(html) {
		if(html) this.exportDataURL( this._string2DataURL(html, "text/html") );
	},

	/*** private methods ***/
	// file = blob
	// DataURL format: data:mimeType;base64,base64_string 
	_fromBlob: function(theFile, file, callback) {
		var fs = new FileReader();
		fs.onload = function(ev1) {
			theFile.data = ev1.target.result;
			if(callback) if( $.isFunction(callback) ) callback(theFile);
		}                
		fs.readAsDataURL(file);
	},
	_readBlob: function(file, callback) {
		var fs = new FileReader();
		fs.onload = function(ev1) {
			var data = ev1.target.result;
			if(callback) if( $.isFunction(callback) ) callback(data);
		}                
		fs.readAsDataURL(file);
	},
	// dataURL is base64 encode url:  data:mimeType;base64,base64_string
	_mimeType: function(dataURL) {
		try {
			var arr = dataURL.split(','); 
			var mime = arr[0].match(/:(.*?);/)[1];
			return mime;
		} catch(err) {
			return "";
		}
	},
	_dataURL2Blob : function( dataURL ) {
		try {
			var arr = dataURL.split(','); 
			var mime = arr[0].match(/:(.*?);/)[1];
			var bstr = atob(arr[1]);
			var n = bstr.length;
			var u8arr = new Uint8Array(n);
			
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {type:mime});
		}
		catch(err) {
		}
	},
	_string2DataURL: function(str, mimeType ) {
		// convert string to base64,  then plus mime type = DataURL
		var base64_str = btoa(str);
		return "data:" + mimeType + ";base64," + base64_str;
	},
	_base64DataURL: function(base64_str , mimeType) {
		return "data:" + mimeType + ";base64," + base64_str;
	}
}

WLIU.IMAGEACTION = function(opts) {
	this.allowSize 	= GCONFIG.max_upload_size,	
	this.allowType 	= GCONFIG.image_allow_type;
	this.view 		= "medium";
	this.execute    = [];
	if(opts) {
		if(opts.allowSize) this.allowSize = opts.allowSize;
		if(opts.allowType) this.allowType = opts.allowType;
	}
}
WLIU.IMAGEACTION.prototype = {
	setScope: function(theImage, p_scope, ngName) {
		if( ngName ) {
			p_scope[ngName] = theImage;
		} else {
			p_scope.imgobj 	= theImage;
		}
	},
	setView: function(view) {
		if(view) 
			this.view = view
		else 
			this.view = "medium"; 
	},
	doneReset: function() {
		this.execute = [];
	},
	fromFile: function(theImage, file, callback, donecall) {
		theImage.full_name 	= file.name.fileName();
		theImage.short_name = file.name.shortName();
		theImage.ext_name 	= file.name.extName();
		theImage.mime_type 	= file.type;
		theImage.size  		= file.size;
		theImage.errorCode		= 0;
		theImage.errorMessage 	= "";
		this.doneReset();
		if( this.allowType.indexOf(theImage.ext_name.toUpperCase()) >= 0 || this.allowType.indexOf("*") >= 0 ) {
			if( theImage.size <= this.allowSize ) {
				this._fromBlob(theImage, file, callback, donecall);
			} else {
				theImage.errorCode 		= 1;
				theImage.errorMessage 	= "File size " + theImage.size.toSize() + " over maximum size " + this.allowSize.toSize() + "."; 
				if(callback) if( $.isFunction(callback) ) callback(theImage);
				if(donecall) if( $.isFunction(donecall) ) donecall(theImage);
			}
		} else {
			theImage.errorCode 		= 1;
			theImage.errorMessage 	= "Only file type: [" + this.allowType.join(", ") + "] allow to upload."; 
			if(callback) if( $.isFunction(callback) ) callback(theImage);
			if(donecall) if( $.isFunction(donecall) ) donecall(theImage);
		}
	},
	exportImage: function(theImage, rsize) {
		var base64_data = this.imageData(theImage,rsize);
		FFILE.exportDataURL(base64_data);
	},
	clearImage: function(theImage) {
		theImage = new WLIU.IMAGE();
		return theImage;
	},
	imageData: function(theImage, view) {
		if( view ) {
			if( theImage.resize[view] ) 
				if(theImage.resize[view].data)
					return theImage.resize[view].data;
				else 
					return "";
			else 
				return "";
		} else {
			if( theImage.resize[this.view] ) 
				if( theImage.resize[this.view].data ) 
					return theImage.resize[this.view].data;
				else 
					return "";
			else 
				return "";
		}
	},
	image2Canvas: function( ctx, dataUrl, callback) {
		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img,0,0);
			if(callback) if( $.isFunction(callback) ) callback(ctx);
		}
		img.src = dataUrl;
	},
	resizeAll: function(theImage, callback, donecall) {
		this.doneReset();
		this._resizeAll(theImage, callback, donecall);
	},

	rotate: function(theImage, callback, donecall) {
		this.doneReset();
		this._rotateAll(theImage, callback, donecall);
	},

	crop: function(theImage, ww,hh,x,y,nw,nh, callback, donecall) {
		this.doneReset();
		this._cropLarge(theImage, ww,hh,x,y,nw,nh, callback, donecall);
	},
	cropDiv: function(theImage, frame_div, crop_div, callback, donecall ) {
        //console.log( frame_div.width() + " : " + frame_div.height());
        //console.log( crop_div.outerWidth() + " : " + crop_div.outerHeight());
        //console.log(crop_div.position() );
		this.doneReset();
		this._cropLarge(theImage, frame_div.width(), frame_div.height(), crop_div.position().left, crop_div.position().top, crop_div.outerWidth(), crop_div.outerHeight(), callback, donecall );
	},
	cropDivReset: function( crop_div ) {
		crop_div.css({left: "5%", top:"5%", width:"90%", height:"90%"});
	},
	cropReset: function(theImage, callback, donecall) {
		this.doneReset();
		this._cropReset(theImage, callback, donecall);
	},

	/*** private methods ***/
	// file = blob
	// DataURL format: data:mimeType;base64,base64_string 
	_fromBlob: function(theImage, file, callback, donecall) {
		var _self = this;
		var fs = new FileReader();
		fs.onload = function(ev1) {
			var data = ev1.target.result;
			_self._imageDataURL(theImage, data, callback, donecall);
		}                
		fs.readAsDataURL(file);
	},
	_readBlob: function(file, callback) {
		var fs = new FileReader();
		fs.onload = function(ev1) {
			var data = ev1.target.result;
			if(callback) if( $.isFunction(callback) ) callback(data);
		}                
		fs.readAsDataURL(file);
	},

	/*** private methods ***/
	_imageDataURL: function(theImage, dataURL, callback, donecall) {
		var _self = this;
		var t_img = new Image();
		t_img.onload = function() {
			_self._initImage(theImage, t_img, callback, donecall);
		}
		t_img.src = dataURL;
	},

	_initImage:  function(theImage, t_img, callback, donecall) {
		var _self = this;

		var originImg = theImage.resize.origin;
		var canvas 	= document.createElement("canvas");
		var ctx 	= canvas.getContext("2d");
		var ratio_ww = 1;
		var ratio_hh = 1;
		if( _self.scale ) {
			if(originImg.ww > 0 ) ratio_ww = originImg.ww / t_img.width;
			if(originImg.hh > 0 ) ratio_hh = originImg.hh / t_img.height;
		} else {
			if(originImg.ww > 0 && t_img.width > originImg.ww) ratio_ww = originImg.ww / t_img.width;
			if(originImg.hh > 0 && t_img.height > originImg.hh) ratio_hh = originImg.hh / t_img.height;
		}
		var ratio = Math.min(ratio_ww, ratio_hh);
		canvas.width 	= t_img.width * ratio;
		canvas.height 	= t_img.height * ratio;
		ctx.drawImage(t_img,0,0, t_img.width, t_img.height, 0, 0, canvas.width, canvas.height); 
		
		var imgDataURL = canvas.toDataURL( theImage.mime_type );
		
		originImg.width 	= canvas.width;
		originImg.height 	= canvas.height;
		originImg.data 		= imgDataURL;
		originImg.size 		= imgDataURL.length;
		originImg.name	    = "origin";
		canvas = null;
		_self._resizeAll(theImage, callback, donecall);
		if( callback && _self.view=="origin") if( $.isFunction(callback) ) callback(originImg);
	},
	// resize base on origin image which alreay resize to 1200 * 1200 from selected image 
	_resizeAll: function(theImage, callback, donecall) {
		var _self = this;
		_self.execute.push("origin");
		for(var rname in theImage.resize) {
			if(rname!="origin") {
				this._resizeImage(theImage, rname, callback, donecall);
			} 
		}
	},
	_resizeImage: function(theImage, rname, callback, donecall) {
		var _self = this;
		var originImg = theImage.resize.origin;
		var resizeImg = theImage.resize[rname];

		var t_img = new Image();
		t_img.onload = function() {
			var canvas 	= document.createElement("canvas");
			var ctx 	= canvas.getContext("2d");
			var ratio_ww = 1;
			var ratio_hh = 1;
			if( _self.scale ) {
				if(resizeImg.ww > 0 ) ratio_ww = resizeImg.ww / t_img.width;
				if(resizeImg.hh > 0 ) ratio_hh = resizeImg.hh / t_img.height;
			} else {
				if(resizeImg.ww > 0 && t_img.width > resizeImg.ww) ratio_ww = resizeImg.ww / t_img.width;
				if(resizeImg.hh > 0 && t_img.height > resizeImg.hh) ratio_hh = resizeImg.hh / t_img.height;
			}
			var ratio = Math.min(ratio_ww, ratio_hh);
			canvas.width 	= t_img.width * ratio;
			canvas.height 	= t_img.height * ratio;
			ctx.drawImage(t_img,0,0, t_img.width, t_img.height, 0, 0, canvas.width, canvas.height); 
			
			var imgDataURL = canvas.toDataURL( theImage.mime_type );
			
			resizeImg.width 	= canvas.width;
			resizeImg.height 	= canvas.height;
			resizeImg.data 		= imgDataURL;
			resizeImg.size 		= imgDataURL.length;
			resizeImg.name	    = rname;
			
			if( callback && _self.view==rname ) if( $.isFunction(callback) ) callback(resizeImg);
			
			_self.execute.push(rname);
			var flag_done = true;
			if(_self.execute.length<6) flag_done = false;
  	 		if( donecall && flag_done ) if( $.isFunction(donecall) ) donecall(theImage);
			
			canvas = null;
		}
		t_img.src = originImg.data;
	},

	_resizeImageFromLarge: function(theImage, rname, callback, donecall) {
		var _self = this;
		var largeImg = theImage.resize.large;
		var resizeImg = theImage.resize[rname];

		var t_img = new Image();
		t_img.onload = function() {
			var canvas 	= document.createElement("canvas");
			var ctx 	= canvas.getContext("2d");
			var ratio_ww = 1;
			var ratio_hh = 1;
			if( _self.scale ) {
				if(resizeImg.ww > 0 ) ratio_ww = resizeImg.ww / t_img.width;
				if(resizeImg.hh > 0 ) ratio_hh = resizeImg.hh / t_img.height;
			} else {
				if(resizeImg.ww > 0 && t_img.width > resizeImg.ww) ratio_ww = resizeImg.ww / t_img.width;
				if(resizeImg.hh > 0 && t_img.height > resizeImg.hh) ratio_hh = resizeImg.hh / t_img.height;
			}
			var ratio = Math.min(ratio_ww, ratio_hh);
			canvas.width 	= t_img.width * ratio;
			canvas.height 	= t_img.height * ratio;
			ctx.drawImage(t_img,0,0, t_img.width, t_img.height, 0, 0, canvas.width, canvas.height); 
			
			var imgDataURL = canvas.toDataURL( theImage.mime_type );
			
			resizeImg.width 	= canvas.width;
			resizeImg.height 	= canvas.height;
			resizeImg.data 		= imgDataURL;
			resizeImg.size 		= imgDataURL.length;
			resizeImg.name	    = rname;
			
			if( callback && _self.view==rname ) if( $.isFunction(callback) ) callback(resizeImg);

			_self.execute.push(rname);
			var flag_done = true;
			if(_self.execute.length<6) flag_done=false;
  	 		if( donecall && flag_done ) if( $.isFunction(donecall) ) donecall(theImage);
			 
 			canvas = null;
		}
		t_img.src = largeImg.data;
	},

	_rotateAll: function(theImage, callback, donecall) {
		this.execute.push("origin");
		for(var rname in theImage.resize) {
			if( rname !="origin" )	this._rotateImage(theImage, rname, callback, donecall );
		}
	},
	_rotateImage : function(theImage, rname, callback, donecall) {
		var _self 	= this;
		var degree 	= 90;
		var resizeImg = theImage.resize[rname];

		var t_img 	= new Image();
		t_img.onload = function() {
			var canvas 	= document.createElement("canvas");
			var ctx 	= canvas.getContext("2d");
			// important: different 180 and 90
			if( degree % 180 == 0 ) {
				canvas.width    = t_img.width;
				canvas.height   = t_img.height;
			} else {
				canvas.width    = t_img.height;
				canvas.height   = t_img.width;
			}
			ctx.translate( canvas.width/2, canvas.height/2 );
			ctx.rotate(degree*Math.PI/180);
			ctx.drawImage(t_img, - t_img.width/2, -t_img.height/2);
			var imgDataURL 		= canvas.toDataURL( theImage.mime_type );
			resizeImg.data 		= imgDataURL;
			resizeImg.width 	= canvas.width;
			resizeImg.height 	= canvas.height;
			resizeImg.size 		= imgDataURL.length;
			canvas = null;

			// important :  img is old img,  imgDataURL is transform image
			if( callback && $.isFunction(callback) && _self.view==rname ) callback(resizeImg);

			_self.execute.push(rname);
			var flag_done = true;
			if(_self.execute.length<6) flag_done=false;
  	 		if( donecall && flag_done ) if( $.isFunction(donecall) ) donecall(theImage);
			
		}
		t_img.src = resizeImg.data;
	},

	_cropLarge: function(theImage, ww, hh, x, y, nw, nh, callback, donecall) {
		var _self = this;
		var largeImg = theImage.resize.large;
		if( largeImg.data != "") {
			var t_img = new Image();
			t_img.onload = function() {
				var ratio_ww = 1;
				var ratio_hh = 1;
				ratio_ww = t_img.width / ww;
				ratio_hh = t_img.height / hh;

				x 	= x * ratio_ww;
				y 	= y * ratio_hh;
				nw 	= nw * ratio_ww;
				nh  = nh * ratio_hh;
				if(x<0) x = 0;
				if(y<0) y = 0;
				if(x+nw>t_img.width) nw = t_img.width - x;
				if(y+nh>t_img.height) nh = t_img.height - y;

				var canvas 	= document.createElement("canvas");
				var ctx 	= canvas.getContext("2d");
				canvas.width 	= nw;
				canvas.height	= nh;
				
				ctx.drawImage(t_img, x, y, nw, nh, 0, 0, canvas.width, canvas.height); 
				var imgDataURL = canvas.toDataURL( theImage.mime_type );

				largeImg.width 		= canvas.width;
				largeImg.height 	= canvas.height;
				largeImg.data 		= imgDataURL;
				largeImg.length 	= imgDataURL.length;
				largeImg.size	    = largeImg.length.toSize();
				largeImg.name	    = "large";


				if( callback && $.isFunction(callback) && _self.view=="large" ) callback(largeImg);
				_self._cropAll(theImage, callback, donecall);
			}
			t_img.src = largeImg.data;
		}

	},
	_cropAll: function(theImage, callback, donecall) {
		var _self = this;
		_self.execute.push("origin");
		_self.execute.push("large");
		var largeImg = theImage.resize.large;
		var resizeImgs = theImage.resize;
		for(var rname in resizeImgs) {
			if(rname!="origin" && rname!="large") {
				this._resizeImageFromLarge(theImage, rname, callback, donecall);
			} 
		}
	},
	_cropReset: function(theImage, callback, donecall) {
		this._resizeAll(theImage, callback, donecall);
	},

	
}

WLIU.CANVAS = function(opts) {
	this.flag 	= false;
	this.prevX 	= 0,
	this.currX 	= 0,
	this.prevY 	= 0,
	this.currY 	= 0,
	this.dot_flag = false;
	this.signed   = false;
	this.subject    = opts.subject?opts.subject:"";
	this.firstName 	= opts.firstName?opts.firstName:"";
	this.lastName  	= opts.lastName?opts.lastName:"";
	this.lineColor 	= "black";
	this.lineWidth 	= 6;
	this.font 		= "14px Arial";

	this.canvas = opts.canvas?opts.canvas:document.createElement("canvas");
	this.ctx 	= this.canvas.getContext("2d");
	return this;
}
WLIU.CANVAS.prototype = {
	init: function() {
		this.signed=false;
		this.addCanvasEvent();
	},
	addCanvasEvent: function() {
		var _self = this;
		this.canvas.addEventListener("mousemove", function (e) {
			_self.findxy('move', e);
		}, false);
		this.canvas.addEventListener("mousedown", function (e) {
			 document.onmousewheel=stop;
			_self.findxy('down', e);
		}, false);
		this.canvas.addEventListener("mouseup", function (e) {
			_self.findxy('up', e);
		}, false);
		this.canvas.addEventListener("mouseout", function (e) {
			_self.findxy('out', e);
		}, false);
	},
	drawText: function(text, x, y) {
		this.ctx.font = this.font;
		this.ctx.fillText(text, x, y);
	},
	drawLine: function() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.prevX, this.prevY);
		this.ctx.lineTo(this.currX, this.currY);
		//this.ctx.lineJoin 		= "round";
		this.ctx.strokeStyle 	= this.lineColor;
		this.ctx.lineWidth 		= this.lineWidth;
		this.ctx.stroke();
		this.ctx.closePath();
	},
	getDataUrl : function() {
		this.ctx.fillStyle = "white";
		this.ctx.fillRect(0, 0, this.canvas.width, 20);
		this.ctx.fillRect(0, this.canvas.height-20, this.canvas.width, 20);
		this.ctx.fillStyle = this.lineColor;
		this.drawText("Subject: " + this.subject, 2,16);
		this.drawText("Print Name: " + this.firstName + " " + this.lastName + " {Signed on: " + (new Date()).format("Y-m-d H:i:s") + " " + (new Date()).timezone() + "}", 2, this.canvas.height-4);
		return this.canvas.toDataURL();
	},
	clear:	function() {
		this.signed = false;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
    findxy: function(res, e) {
		switch(res) {
			case "down":
				this.prevX = this.currX;
				this.prevY = this.currY;
				this.currX = e.offsetX;
				this.currY = e.offsetY;
		
				this.signed = true;
				this.flag = true;
				this.dot_flag = true;
				if (this.dot_flag) {
					this.ctx.beginPath();
					this.ctx.fillStyle = this.lineColor;
					this.ctx.fillRect(this.currX, this.currY, 2, 2);
					this.ctx.closePath();
					dot_flag = false;
				}
				break;
			case "up":
			case "out":
				this.flag 	= false;
				break;
			case "move":
				if(this.flag) {
					this.prevX = this.currX;
					this.prevY = this.currY;
					this.currX = e.offsetX;
					this.currY = e.offsetY;
					this.drawLine();
				}
				break;
		}
	}     
}

var FCOLLECT = new WLIU.COLLECTION();
var FOBJECT  = new WLIU.OBJECT();
var	FROW     = new WLIU.ROWACTION();
var FCOM 	 = new WLIU.COM();
var FTABLE   = new WLIU.TABLEACTION();
var FFILE    = new WLIU.FILEACTION();
var FIMAGE   = new WLIU.IMAGEACTION();
