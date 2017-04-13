/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};
// Table Object
WLIU.TREE = function( opts ) {
	this.sc			= null;
	this.lang       = opts.lang?opts.lang:"cn";
	this.title  	= opts.title?opts.title:"";
	this.treeid		= opts.treeid?opts.treeid:0;  // tree root id
	this.rootid		= opts.rootid?opts.rootid:0;  // tree root id
	this.refid		= opts.refid?opts.refid:0;    // refid = refer to other table for checkbox1, multiple select

	this.scope  	= opts.scope?opts.scope:"";
	this.url		= opts.url?opts.url:"";

	this.rootadd 	= opts.rootadd?opts.rootadd:0;
	this.pbutton 	= opts.pbutton?opts.pbutton:["add", "save", "cancel", "delete"],
	this.sbutton	= opts.sbutton?opts.sbutton:["add", "save", "cancel", "delete"],
	this.mbutton	= opts.mbutton?opts.mbutton:["save", "cancel", "delete"],
	
	this.current    = ""; // row guid
	this.action		= "get";
	this.error		= {errorCode:0, errorMessage:""};  // table level error : action rights 
	this.rights 	= {view:1, save:0, cancel:1, clear:1, delete:0, add:1, detail:1, output:0, print:1};
	this.cols 		= {};
	this.rows 		= [];
	this.filters 	= [];
	this.lists		= {};  // { gender: { loaded: 1, keys: { rowsn: -1, name: "" }, list: [{key:1, value:"Male", desc:""}, {key:2, value:"Female", desc:""}] },  	xxx: {} }
	this.xhr 		= null;
	$.extend(this.rights, opts.rights);
	$.extend(this.cols, opts.cols);
	$.extend(this.filters, opts.filters);
	$.extend(this.lists, opts.lists);

	this._treeName = "tree";
}

WLIU.TREE.prototype = {
	setScope: function(p_scope, treeName) {
		if( treeName ) {
			this._treeName = treeName;
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

	// ; ridx;  nrow;  ridx nrow ;  default position=0  add to first
	newRow: function(keyvalues) {
		return FTABLE.newRow(this, keyvalues);
	},
	addRow: function(ridx, t_row) {
		return FTABLE.addRow(this, ridx, t_row);
	},
	addChild: function(theRows, theRow) {
		if( theRow == "root" ) {
			var newRow = new WLIU.ROW(this.cols.p);
			var keyVal = this.rootid;
			newRow.rowstate = 2;
			newRow.parent   = keyVal;
			newRow.type		= "p";
			this.rows = this.rows?this.rows:[]; 
			this.rows.unshift(newRow);
		} else {
			var tableLevel = theRow.type;
			switch(tableLevel) {
				case "p":
					var newRow = new WLIU.ROW(this.cols.s);
					var keyVal = this.keyValue(theRow);
					newRow.rowstate = 2;
					newRow.parent   = keyVal;
					newRow.type		= "s";
					theRow.rows = theRow.rows?theRow.rows:[]; 
					theRow.rows.unshift(newRow);
					break;
				case "s":
					var newRow = new WLIU.ROW(this.cols.m);
					var keyVal = this.keyValue(theRow);
					newRow.rowstate	= 2;
					newRow.parent   = keyVal;
					newRow.type   	= "m";

					theRow.rows = theRow.rows?theRow.rows:[]; 
					theRow.rows.unshift(newRow);
					break;
				case "m":
					break;
			}
		}
	}, 
	cancelRow: function(theRows, theRow ) {
		if( theRow ) {
			switch( theRow.rowstate ) {
				case 0: 
					break;
				case 1:
					FROW.cancel(theRow);
				    break;
				case 2:
					this.removeRow(theRows, theRow);
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

	// set row col value to empty or defval if it has default value
	removeRow: function(theRows, theRow) {
		var ridx = FCOLLECT.indexByKV(theRows, {guid: theRow.guid});
		FCOLLECT.delete(theRows, ridx);
	},
	deleteRow: function(theRows, theRow) {
		return FROW.detach(theRow);
	},
	
	/*** ajax method ***/
	saveRow: function(theRows, theRow, callback) {
		var ntable = {};
		ntable.scope 	= this.scope;
		ntable.lang  	= this.lang;
		ntable.rootid  	= this.rootid;
		ntable.refid  	= this.refid;
		ntable.action	= "save";
		ntable.error  	= {errorCode: 0, errorMessage:""};
		ntable.cols 	= this.cols;    
		ntable.rows 	= FROW.getChangeRow(theRow);
		this.ajaxCall(ntable, callback, theRow, theRows);
	},
	
	// for one2many & many2many 
	getRows: function(callback) {
		var ntable = {};
		ntable.scope 	= this.scope;
		ntable.lang  	= this.lang;
		ntable.rootid  	= this.rootid;
		ntable.refid  	= this.refid;
		ntable.action	= "get";
		ntable.error    = {errorCode: 0, errorMessage:""};
		ntable.cols     = this.cols; // must provide cols meta to get data from database;
		ntable.filters  = FTABLE.getFilters(this);
		ntable.lists    = FTABLE.getLists(this);
		ntable.rows 	= [];
		this.ajaxCall(ntable, callback);
	},

	getRecords: function(IDKeyValues, callback) {
		if(IDKeyValues) {
			if(IDKeyValues.rootid!=undefined) 	this.rootid = IDKeyValues.rootid;
			this.refid 	= IDKeyValues.refid?IDKeyValues.refid:"";	
		}
		this.getRows(callback);
	},
	/********************************/

	ajaxCall: function(ntable, callback, theRow, theRows) {
		var _self = this;
		$("div#wliu-wait-id[wliu-wait]").trigger("show");
		if( callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(table);
		//console.log(table);
		//if(_self.xhr && _self.xhr.readyState != 4 ) _self.xhr.abort();
		$.ajax({
			data: {
				table:	ntable
			},
			dataType: "json",  
			contentType:"application/x-www-form-urlencoded",
			error: function(xhr, tStatus, errorTh ) {
				$("div#wliu-wait-id[wliu-wait]").trigger("hide");
			},
			success: function(req, tStatus) {
				$("div#wliu-wait-id[wliu-wait]").trigger("hide");
				if( callback && callback.ajaxAfter && $.isFunction(callback.ajaxAfter) ) callback.ajaxAfter(req.table);

				_self.tableError(req.table.error);

				switch( req.table.action ) {
					case "get":
						FTABLE.setLists(_self, req.table.lists);
						_self.syncRows(req.table);
						break;
					case "add":
						_self.updateRow(req.table, theRow, theRows);
						break;
					case "save":
						_self.updateRow(req.table, theRow, theRows);
						break;
				}
				if(!_self.sc.$$phase) _self.sc.$apply();

				// important to remember open|close from localStorage
				if(req.table.action=="get") $("ul[wliu-tree][root]").wliuTree();

				if( parseInt(req.table.error.errorCode) == 0 ) {
					if(callback && callback.ajaxSuccess && $.isFunction(callback.ajaxSuccess) ) callback.ajaxSuccess(req.table);
				} else {
					if(callback && callback.ajaxError && $.isFunction(callback.ajaxError) ) callback.ajaxError(req.table);
				}

				//Error Handle include : session expiry
				GCONFIG.errorCall(req.table.error);
			},
			type: "post",
			url: _self.url
		});
	},
	syncRows: function(table) {
		this.rights = angular.copy(table.rights);
		this.rows = [];
		
		if(this.cols.p && this.cols.p.length>0) {
			for(var pidx in table.rows) {
				var _p_row 		= table.rows[pidx];
				var prow 		= new WLIU.ROW(this.cols.p, _p_row, this.scope);
				var p_keyvalue  = this.keyValue(prow);
				prow.rowstate 	= 0;
				prow.parent 	= this.rootid;
				prow.type 		= "p";

				if(this.cols.s && this.cols.s.length>0) {
					prow.rows 	= [];
					for(var sidx in _p_row.rows) {
						var _s_row 		= _p_row.rows[sidx];
						var srow 		= new WLIU.ROW(this.cols.s, _s_row, this.scope);
						var s_keyvalue 	= this.keyValue(srow);
						srow.rowstate 	= 0;
						srow.parent 	= p_keyvalue;
						srow.type		= "s";
						if(this.cols.m && this.cols.m.length >0) {
							srow.rows 	= [];
							for(var midx in _s_row.rows) {
								var _m_row 		= _s_row.rows[midx];
								var mrow   		= new WLIU.ROW(this.cols.m, _m_row, this.scope);
								mrow.rowstate 	= 0;
								mrow.parent 	= s_keyvalue;
								mrow.type		= "m";
								srow.rows.push(mrow);
							}
						}
						prow.rows.push(srow);
					}
				}
				this.rows.push(prow);	
			}
		}
	},

	updateRow: function(table, theRow, theRows) {
		this.rights = angular.copy(table.rights);
		if( table.rows && table.rows.length > 0) {
			var nrow = table.rows[0];
			if( nrow.error.errorCode > 0 ) {
				theRow.error.errorCode = nrow.error.errorCode;
				theRow.error.errorMessage = nrow.error.errorMessage;
				
				/***************************************/
				for(var cidx in nrow.cols) {
					var ncol = nrow.cols[cidx];
					var theCol = FCOLLECT.objectByKV( theRow.cols, { name: ncol.name } );
					if( theCol ) {
						this.colError(theRow, ncol.name, {errorCode: ncol.errorCode, errorMessage: ncol.errorMessage});
					}
				}
				/***************************************/
			
			} else {
					switch(parseInt(theRow.rowstate)) {
						case 0:
							break;
						case 1:
							theRow.error.errorCode = nrow.error.errorCode;
							theRow.error.errorMessage = nrow.error.errorMessage;
							theRow.rowstate = 0;
							/***************************************/
							for(var cidx in nrow.cols) {
								var ncol = nrow.cols[cidx];
								var theCol = FCOLLECT.objectByKV( theRow.cols, { name: ncol.name } );
								if( theCol ) {
									theCol.colstate 	= 0;
									theCol.current 		= angular.copy(theCol.value);
									this.colError(theRow, ncol.name, {errorCode:0, errorMessage:""});
								}
							}
							/***************************************/

							break;
						case 2:
							theRow.error.errorCode = nrow.error.errorCode;
							theRow.error.errorMessage = nrow.error.errorMessage;
							theRow.rowstate = 0;
							for(var cidx in nrow.cols) {
								var ncol = nrow.cols[cidx];
								var theCol = FCOLLECT.objectByKV( theRow.cols, { name: ncol.name } );
								if( theCol ) {
									if(theCol.key) {
										FROW.setColVal(theCol, ncol.value);
									}
									theCol.colstate 	= 0;
									theCol.current 		= angular.copy(theCol.value);
								
									this.colError(theRow, ncol.name, {errorCode:0, errorMessage:""});
								}
							}
							break;
						case 3:
							theRow.error.errorCode = nrow.error.errorCode;
							theRow.error.errorMessage = nrow.error.errorMessage;
							theRow.rowstate = 0;
							if( parseInt(theRow.error.errorCode)<=0 ) {
								this.removeRow(theRows, theRow);
							}
							break;
					}
			}
		}

		// save success handle
		GCONFIG.saveSuccess(table.error);
	}
}
