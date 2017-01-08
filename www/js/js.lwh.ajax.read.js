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
LWH.READ = function(opts) {
	this.schema = {
			pptable: {
				name:  		"website_group",
				col:		"id",
				val:		"",
				cols:		
				[
					{col: 	"id", 		type: "text" },
					{col:	"imageme", 	type: "image", 	filter:"admin photo", mode:"small" },
					{col: 	langCol("title", opts.lang?opts.lang:"cn"), type:"text" },
					{col:	"desc_cn", type: "text" }
				],
				criteria:	"",
				orderby: 	"orderno DESC",
				pageNo: 	1,
				pageSize: 	2
			},
			mmtable: {
				name: 	"website_admin_group",
				pref:	"group_id",
				sref:	"admin_id"
			},
			sstable: {
				name: 	"website_admin",
				col:	"id",
				val:	"",
				pref:	"ref_id",
				cols:		
				[
					{col: 	"id", 			type: "text" },
					{col:	"image", 		type: "image", 	filter:"admin photo", mode:"small" },
					{col: 	"full_name", 	type: "text" },
					{col:	"user_name", 	type: "text" }
				],
				criteria:	"",
				orderby: 	"",
				pageNo: 	1,
				pageSize: 	3
			},
			
			checklist: {
				level: { stable: "website_weight_unit", scol:"id", stitle: langCol("title", opts.lang?opts.lang:"cn"), sdesc: langCol("desc",  opts.lang?opts.lang:"cn") }
			},

 			listTables: {
            },
									
			lang: 			"cn",
			action: 		"load",
			wait:			1,
			error:			0,
			errorMessage: 	"",
			
			before: null,
			after:	null,
			ppCall: null,
			ssCall:	null
	};
	this.data = [];

	$.extend(this.schema, opts);
	var _self 	= this;

	// class constructor
	var _constructor = function() {
	}();
	
}


LWH.READ.prototype = {
	set: function(opts) {
		if(opts) {
			if(opts.action) 	this.formData.schema.action = opts.action;
			if(opts.pid) 		this.formData.schema.pid = opts.pid;
			if(opts.sid) 		this.formData.schema.sid = opts.sid;
		}
	},
	
	read: function() {
		this.ajaxCall();
	},
	
	freshData: function() {
		this.schema.error 			= 0;
		this.schema.errorMessage 	= "";
		this.data					= [];
	},
	
	/*** Ajax *****************************************************************************************/
	ajaxCall: function() {
		if(this.schema.wait) wait_show();
		var _self = this;	
		this.freshData();	
		
		var schema = {};
		schema.pptable 		= this.schema.pptable;
		schema.mmtable 		= this.schema.mmtable;
		schema.sstable 		= this.schema.sstable;
		schema.checklist 	= this.schema.checklist;
		schema.lang 		= this.schema.lang;
		schema.action 		= this.schema.action;
		schema.error 		= 0;
		schema.errorMessage	= "";
		
		
		if(this.schema.before) if( $.isFunction(this.schema.before) ) this.schema.before(this.formData); 
		
		$.ajax({
			data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
				schema: 	schema
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				if(_self.schema.wait) wait_hide();
			 	//tool_tips("Error: ajax/lwh_lwhAjax_read.php : " + xhr.responseText + "\nStatus: " + tStatus);
			},
			success: function(req, tStatus) {
				if(_self.schema.wait) wait_hide();
				errorHandler(req);
				$.extend(_self.schema, req.data.schema);
				this.data = req.data;
				if(_self.schema.ppCall) if( $.isFunction(_self.schema.ppCall) ) _self.schema.ppCall(req.data); 
				if(_self.schema.ssCall) if( $.isFunction(_self.schema.ssCall) ) _self.schema.ssCall(req.data); 
				if(_self.schema.after) if( $.isFunction(_self.schema.after) ) _self.schema.after(req); 
			},
			type: "post",
			url:  "ajax/lwh_lwhAjax_read.php"
		});
	}
	/**************************************************************************************************/
}