/*** FORM Object  ***/
/* 
name 	:   required
col 	:   default  name,  	mapping to table's column
table:	:   default: sstable  	pptable, mmtable: sstable
colname	:   default: col, name,  column's name  for display
coltype	:	textbox, checkbox , radio .....
datatype:	ALL, EMAIL, CHAR, DATE
maxlength: 
min:   	number
max: 	number
notnull: 0 / 1 

rtable	: for checkbox
rcol:	: for checkbox

coltype: readonly  for  html text
coltype: readcheck   for html text of checkbox ---  rtable, rcol, stable, scol, stitle
coltype: readselect  for select or radio  html text --- stable, scol, stitle 
*/
/********************/
var LWH = LWH || {};
LWH.FORM = function(opts) {
	this.iCol = null;
	
	this.filter = {
		id: ""
	};
	
	this.head = {
		scope: 	"",
		view:	"",
		base: 	"",
		url:	"",

		action:	"view",
		wait:	1,		
		lang:	DLang,

		state:	0,
		error:	0,
		errorMessage: ""
	};

	this.func = {
		before: null,
		after:	null,
		cancel: null
	};
	

	$.extend(this.filter, 	opts.filter);
	$.extend(this.head, 	opts.head);
	$.extend(this.func, 	opts.func);
	var _self 	= this;

	// class constructor
	var _constructor = function() {
		_self.iCol =new LWH.COL({
			head: {
					scope: 	_self.head.scope ,
					lang:	_self.head.lang
			},
			func: {
				save : function( nSchema ) {
					_self.save(nSchema)
				},
				add:  function( nSchema ) {
					_self.add( nSchema );
				},
				del: function( nSchema ) {
					_self.del( nSchema );
				},
				cancel : function( cols ) {
					if(_self.func.cancel) if( $.isFunction(_self.func.cancel) ) _self.func.cancel(cols); 					
				}
			}
		});
		_self.iCol.init();
	}();
	
}


LWH.FORM.prototype = {
	/*** Ajax *****************************************************************************************/
	setCallback : function( opts ) {
		$.extend(this.func, opts);
	},
	
	setFilter: function( ff ) {
		$.extend(this.filter, ff);
	},
	setID:  function( val ) {
		this.filter.id = val;
	},
	view: function() {
		nform = {};
		this.head.action		= "view";
		this.head.state 		= 0;
		this.head.error			= 0;
		this.head.errorMessage 	= "";
		nform.head 			= this.head;
		nform.filter 		= this.filter;
		this.iCol.cancel();
		nform.cols			= this.iCol.getAll();		
		this.ajaxCall( nform );
	},

	save: function(cols) {
		nform = {};
		this.head.action		= "save";
		this.head.state 		= 1;
		this.head.error			= 0;
		this.head.errorMessage 	= "";
		nform.head 			= this.head;
		nform.filter 		= this.filter;
		nform.cols			= cols;

		this.ajaxCall( nform );
	},

	formSave: function() {
		nform = {};
		this.head.action		= "save";
		this.head.state 		= 1;
		this.head.error			= 0;
		this.head.errorMessage 	= "";
		nform.head 			= this.head;
		nform.filter 		= this.filter;
		nform.cols			= this.iCol.getChange();

		this.ajaxCall( nform );
	},

	add: function(cols) {
		nform = {};
		this.head.action		= "add";
		this.head.state 		= 2;
		this.head.error			= 0;
		this.head.errorMessage 	= "";
		nform.head 			= this.head;
		nform.filter 		= this.filter;
		nform.cols			= cols;

		this.ajaxCall( nform );
	},

	formAdd: function() {
		nform = {};
		this.head.action		= "add";
		this.head.state 		= 2;
		this.head.error			= 0;
		this.head.errorMessage 	= "";
		nform.head 			= this.head;
		nform.filter 		= this.filter;
		nform.cols			= this.iCol.getAll();

		this.ajaxCall( nform );
	},
	
	del: function(nSchema) {
		var y = confirm(gcommon.trans[this.head.lang].words["are you sure"]);
		if(y) {
			nform = {};
			this.head.action		= "delete";
			this.head.state 		= 3;
			this.head.error			= 0;
			this.head.errorMessage 	= "";
			nform.head 				= this.head;
			nform.filter 			= this.filter;
	
			this.ajaxCall( nform );
		}
	},

	formDel: function() {
		var y = confirm(gcommon.trans[this.head.lang].words["are you sure"]);
		if(y) {
			nform = {};
			this.head.action		= "delete";
			this.head.state 		= 3;
			this.head.error			= 0;
			this.head.errorMessage 	= "";
			nform.head 				= this.head;
			nform.filter 			= this.filter;
	
			this.ajaxCall( nform );
		}
	},
	
	set: function( name, val ) {
		this.iCol.set( name, val );
	},
	
	get: function( name ) {
		return this.iCol.get(name);
	},
	
	update: function( nSchema ) {
		this.iCol.update( nSchema );
	},
	
	updateAjax: function( cols ) {
		if( cols && $.isArray(cols) ) {
			for(var i = 0; i < cols.length; i++) {
				this.update( cols[i] );
			}
		}
	},
	
	updateSchema: function( nform ) {
		if( nform.filter ) 	$.extend(this.filter,	nform.filter);
		if( nform.head )	$.extend(this.head, 	nform.head);
	},
	
	clear : function() {
		for( var key in this.filter ) {
			this.filter[key] = "";
		}
		this.clearCols();
	},
	
	clearCols : function() {
		this.head.state = 0;
		this.head.error = 0;
		this.head.errorMessage = "";
		this.iCol.clear();
	},
	
	ajaxCall: function( nform ) {
		var _self = this;
		if(_self.head.wait) wait_show();
		if(_self.func.before) if( $.isFunction(_self.func.before) ) _self.func.before(nform); 
		
		$.ajax({
			data: {
				form:	nform
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				if(_self.head.wait) wait_hide();
				//tool_tips("Error (" + (_self.formData.schema.url?_self.formData.schema.url:"ajax/lwh_lwhAjax_action.php") +  "): " + xhr.responseText + "\nStatus: " + tStatus);
			},
			success: function(req, tStatus) {
				if(_self.head.wait) wait_hide();
				errorHandler(req);
				
				_self.updateSchema(req.form);
				_self.updateAjax(req.form.cols);
				
				switch( req.form.head.action) {
					case "delete":
						if( parseInt(req.form.head.error) == 0 ) {
							_self.clear();
							tool_tips(gcommon.trans[_self.head.lang].words["delete success"]);
						}
						break;
					case "save": 
						if( parseInt(req.form.head.error) == 0 ) {
							tool_tips(gcommon.trans[_self.head.lang].words["save success"]);
						}
						break;
					case "add": 
						if( parseInt(req.form.head.error) == 0 ) {
							tool_tips(gcommon.trans[_self.head.lang].words["add success"]);
						}
						break;
				}
			
				if(_self.func.after) if( $.isFunction(_self.func.after) ) _self.func.after(req); 
			},
			type: "post",
			url: (_self.head.url?_self.head.url:"ajax/lwhForm_ajax.php")
		});
	},
	/**************************************************************************************************/
	
	createCheckbox: function( nSchema ) {
		this.iCol.checkbox( nSchema );
	},
	createRadio: function( nSchema ) {
		this.iCol.radio( nSchema );
	}
}