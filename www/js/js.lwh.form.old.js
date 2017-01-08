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
	this.htmlObj = [];
	this.formData = {
		schema : {
			url:		"",
			name:		"",
			pptable: 	"",
			mmtable: 	"",
			mmpcol:		"",
			mmscol:		"",
			sstable: 	"",
			sspcol:		"",
			pid:		"",
			sid:		"",
			
			container: 	"",
			lang: 		"cn",
			action: 	"save",
			wait:		1,
			sync:		0,		
			
			error:		0,
			errorMessage: ""
		},
		data: {}
	};

	this.callback = {
		before: null,
		after:	null
	};
	

	$.extend(this.formData.schema, opts);
	var _self 	= this;

	// class constructor
	var _constructor = function() {
		_self.formData.schema.container = _self.formData.schema.container?_self.formData.schema.container:"body";

		$("textarea[coltype='html']", _self.formData.schema.container).each( function(idx1, el1) {
			var el_name = $(this).attr("name");
			var el_id 	= $(this).attr("id");
		 	if(!el_id) {
				$(this).attr("id", el_name);
				el_id = el_name;
			}
			_self.htmlObj[el_id] = CKEDITOR.replace(el_id,{});


			_self.htmlObj[el_id].on('change', function (evt) {
					_self.colObj( el_name );
			});

        });

		_self.allData();


		$("input:text, input:password, input:radio, input:hidden, textarea", _self.formData.schema.container).bind("keyup", function(ev) {
            if( $(this).attr("name") ) {
				_self.colObj( $(this).attr("name") );
			}
        });

		$("input:checkbox,  input:radio, select", _self.formData.schema.container).bind("change", function(ev) {
            if( $(this).attr("name") ) {
				_self.colObj( $(this).attr("name") );
			}
        });

		$("input:checkbox,  input:radio", _self.formData.schema.container).bind("click", function(ev) {
			$("*[name='" + $(this).attr("name") + "']", _self.formData.schema.container).parent("label").removeClass("data-checked");
			$("*[name='" + $(this).attr("name") + "']:checked", _self.formData.schema.container).parent("label").addClass("data-checked");
        });
		
	}();
	
}


LWH.FORM.prototype = {
	set: function(opts) {
		if(opts) {
			if(opts.action) 	this.formData.schema.action = opts.action;
			if(opts.pid) 		this.formData.schema.pid = opts.pid;
			if(opts.sid) 		this.formData.schema.sid = opts.sid;
		}
	},
	
	action: function(opts) {
		if(opts) {
			if(opts.action) 	this.formData.schema.action = opts.action;
			if(opts.pid) 		this.formData.schema.pid = opts.pid;
			if(opts.sid) 		this.formData.schema.sid = opts.sid;
			this.ajaxCall();
		}
	},
	
	setCallback: function(opts) {
		$.extend(this.callback, opts);
	},
	
	change: function(name, value) {
		value = $.trim(value);
		var cObj = this.colObj(name);
		if( cObj.value != value ) {
			cObj.value = value;
			cObj.state = 1;
			cObj.error = 0;
			cObj.errorMessage = "";
		} else {
			cObj.state = 0;
		}
		this.validate(cObj);
		this.colObj(name, cObj);
	},
	
	colObj: function(name, nobj) {
		var el_input = $("*[name='" + name + "']", this.formData.schema.container).get(0);
		if(nobj) {
			nobj.value 			= $.trim(nobj.value);
			switch( ("" + nobj.coltype).toLowerCase() ) {
				case "checkbox":
					this.checkbox(name, nobj.value);
					break;
				case "bool":
					this.bool(name, nobj.value);
					break;
				case "radio":
					this.radio(name, nobj.value);
					break;
				case "readonly":
					switch(nobj.format) {
						case "datetime":
							nobj.value = ("" + (nobj.value * 1000)).toDate();
							break;
					}
					this.readonly(name, nobj.value);
					break;
				case "readcheck":
				case "readselect":
					this.readonly(name, nobj.value);
					break;
				case "html":
					var el_name = name;
					var el_id 	= $(el_input).attr("id");
					if(!el_id) {
						el_id = el_name;
					}
					CKEDITOR.instances[el_id].setData(nobj.value);
					break;
				default:
					this.textbox(name, nobj.value);
					break;
			}

			if( this.formData.data[nobj.col] ) {
				if( this.formData.data[nobj.col].value != nobj.value ) 
					nobj.state = 1;
				else 			 
					nobj.state = 0;
			} else {
				nobj.state = 1;
			}

			this.formData.data[nobj.col] 	= nobj;
			this.validate(this.formData.data[nobj.col]);
			return this.formData.data[nobj.col];
			
		} else {
			var cObj 			= {};
			cObj.name 			= name;
			cObj.table 			= $(el_input).attr("table")?$(el_input).attr("table"):"sstable";
			cObj.col	 		= $(el_input).attr("col")?$(el_input).attr("col"):name;
			cObj.colname		= $(el_input).attr("colname")?$(el_input).attr("colname"):$(el_input).attr("col")?$(el_input).attr("col"):name;
			cObj.coltype  		= ($(el_input).attr("coltype")?$(el_input).attr("coltype"):$(el_input).attr("type")?$(el_input).attr("type"):"textbox").toLowerCase();
			cObj.datatype 		= ($(el_input).attr("datatype")?$(el_input).attr("datatype"):"ALL").toUpperCase();
			cObj.notnull 		= $(el_input).attr("notnull");
			cObj.state			= 0;
			cObj.error			= 0;
			cObj.errorMessage 	= "";
			cObj.desc	 		= $(el_input).attr("title");
			
			switch( cObj.coltype.toLowerCase() ) {
				case "readonly":
					cObj.format		= $(el_input).attr("format")?$(el_input).attr("format"):"";
					cObj.value 		= "";
					break;

				case "readcheck":
					cObj.rtable		= $(el_input).attr("rtable");
					cObj.rcol 		= $(el_input).attr("rcol");
					cObj.stable		= $(el_input).attr("stable");
					cObj.scol 		= $(el_input).attr("scol");
					cObj.stitle		= $(el_input).attr("stitle");
					cObj.colnum		= $(el_input).attr("colnum")?$(el_input).attr("colnum"):0;
					cObj.value 		= "";
					break;

				case "readselect":
					cObj.stable		= $(el_input).attr("stable");
					cObj.scol 		= $(el_input).attr("scol");
					cObj.stitle		= $(el_input).attr("stitle");
					cObj.value 		= "";
					break;

				case "checkbox":
					cObj.rtable		= $(el_input).attr("rtable");
					cObj.rcol 		= $(el_input).attr("rcol");
					cObj.value 		= this.checkbox(name);
					break;
				case "bool":
					cObj.value 		= this.bool(name);
					break;
				case "radio":
					cObj.value 		= this.radio(name);
					break;
				case "html":
					var el_name = name;
					var el_id 	= $(el_input).attr("id");
					if(!el_id) {
						el_id = el_name;
					}
					cObj.value 		= CKEDITOR.instances[el_id].getData();
					cObj.nosync 	= $(el_input).attr("nosync");
					break;
				default:
					cObj.maxlength 	= $(el_input).attr("maxlength")?$(el_input).attr("maxlength"):0;
					cObj.minlength 	= $(el_input).attr("minlength")?$(el_input).attr("minlength"):0;
					cObj.min 		= $(el_input).attr("min")?$(el_input).attr("min"):"";
					cObj.max 		= $(el_input).attr("max")?$(el_input).attr("max"):"";
					cObj.value 		= this.textbox(name);
					break;
					
			}
	
			this.formData.data[cObj.col] = cObj;
			this.validate(cObj);
			return this.formData.data[cObj.col];
		}
	},
	
	clearData: function(name) {
		var col = ArrayKey(this.formData.data, "name", name);
		this.formData.data[col].value 		= "";
		this.formData.data[col].state 		= 0;
		this.formData.data[col].error 		= 0;
		this.formData.data[col].errorMessage = "";
		
		this.colObj(name, this.formData.data[col]);
	},
	
	clearAll: function() {
		this.formData.schema.error = 0;
		this.formData.schema.errorMessage = "";
		this.formData.schema.pid = "";
		this.formData.schema.sid = "";
		
		for(var key in this.formData.data) {
			this.clearData( this.formData.data[key].name );
		}
	},
	
	allData: function(aObj) {
		var _self = this;
		if( aObj ) {
			this.formData = aObj;
			this.freshHTML();			
		} else {
			this.formData.data = {};
			this.formData.schema.container = this.formData.schema.container?this.formData.schema.container:"body";
			$("[name][coltype], input:text, input:password, input:checkbox,  input:radio, input:hidden, select, textarea", this.formData.schema.container).each(function(idx, el) {
				if( $(el).attr("name") ) {
					_self.colObj( $(el).attr("name") );
				}
			});
		}
	},
	
	freshData: function() {
		this.formData.schema.error 			= 0;
		this.formData.schema.errorMessage 	= "";
		for(var key in this.formData.data) {
			this.colObj( this.formData.data[key].name );
		}
	},

	freshHTML: function() {
		for(var key in this.formData.data) {
			if(this.formData.data[key]) { 
				if( this.formData.data[key].nosync != "1")  // important for html editor   nosync = 1 
					this.colObj( this.formData.data[key].name, this.formData.data[key]);
			}
		}
	},
	
	error: function(name, error, errorMessage) {
		var col 			= ArrayKey(this.formData.data, "name", name);
		var colObj 			= this.formData.data[col]; 
		colObj.error 		= error;
		colObj.errorMessage = errorMessage;	
		this.validate(colObj);
	},
	
	validate: function(colObj) {
		var el_input	= $("*[name='" + colObj.name + "']", this.formData.schema.container);
		if(colObj.error > 0 ) {
			$(el_input).attr("title", colObj.errorMessage).addClass("data-invalid");	
			$(el_input).parent("label").addClass("data-error").attr("title", colObj.errorMessage);	
		} else {
			colObj.error 		= 0;
			colObj.errorMessage = "";
			$(el_input).attr("title", colObj.desc).removeClass("data-invalid");	
			$(el_input).parent("label").removeClass("data-error").attr("title", colObj.desc);	
		}
	},
	
	validateAll: function() {
		for(var key in this.formData.data) {
			this.validate( this.formData.data[key] );
		}
	},
	
	/*** Ajax *****************************************************************************************/
	ajaxCall: function() {
		if(this.formData.schema.wait) wait_show();
		var _self = this;	
		this.freshData();	
		if(this.callback.before) if( $.isFunction(this.callback.before) ) this.callback.before(this.formData); 
		$.ajax({
			data: {
				secc:		GSecc,
				lang:		GLang,
				sess:		GSess,
				temp:		GTemp,
				
				formData: 	this.formData
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				if(_self.formData.schema.wait) wait_hide();
				//tool_tips("Error (" + (_self.formData.schema.url?_self.formData.schema.url:"ajax/lwh_lwhAjax_action.php") +  "): " + xhr.responseText + "\nStatus: " + tStatus);
			},
			success: function(req, tStatus) {
				if(_self.formData.schema.wait) wait_hide();
				errorHandler(req);
				var req_copy = angular.copy(req);
				
				_self.allData(req.formData);
				_self.validateAll();

				if(_self.callback.after) if( $.isFunction(_self.callback.after) ) _self.callback.after(req_copy); 
			},
			type: "post",
			url: (_self.formData.schema.url?_self.formData.schema.url:"ajax/lwhForm_ajax.php")
		});
	},
	/**************************************************************************************************/
	
	
	/*** dom operation ********************************************************************************/
	bool: function(name, val) {
		if( val!=undefined ) {
			$("input:checkbox[name='" + name + "']", this.formData.schema.container).attr("checked", val?true:false);
			$("input:checkbox[name='" + name + "']", this.formData.schema.container).parent("label").removeClass("data-checked");
			if( $("input:checkbox[name='" + name + "']", this.formData.schema.container).is(":checked") ) 
				$("input:checkbox[name='" + name + "']", this.formData.schema.container).parent("label").addClass("data-checked");
		} 
		return $("input:checkbox[name='" + name + "']", this.formData.schema.container).is(":checked")?1:0;
	},

	readonly: function(name, val) {
		if( val!=undefined ) {
			
			$("*[name='" + name + "']", this.formData.schema.container).html(val);
		} else {
			var ret_val = "";
			ret_val = $.trim($("*[name='" + name + "']", this.formData.schema.container).html());
			return ret_val;
		}
	},

	textbox: function(name, val) {
		if( val!=undefined ) {
			$("*[name='" + name + "']", this.formData.schema.container).val(val);
		} else {
			var ret_val = "";
			ret_val = $.trim($("*[name='" + name + "']", this.formData.schema.container).val());
			return ret_val;
		}
	},
	
	checkbox: function(name, vals) {
		var _self = this;
		if( vals!=undefined ) {
			$("input:checkbox[name='" + name + "']", _self.formData.schema.container).attr("checked", false);
			$("input:checkbox[name='" + name + "']", _self.formData.schema.container).parent("label").removeClass("data-checked");
			if (vals && vals != "") {
				$.map(vals.split(","), function (n) {
					$("input:checkbox[name='" + name + "'][value='" + n + "']", _self.formData.schema.container).attr("checked", true);
					$("input:checkbox[name='" + name + "'][value='" + n + "']", _self.formData.schema.container).parent("label").addClass("data-checked");
				});
			}
		} else {
			var ret_val = '';
			ret_val = $("input:checkbox[name='" + name + "']:checked", _self.formData.schema.container).map(function () { return $(this).val(); }).get().join(",");
			return ret_val;
		}
	},
	
	checkbox1: function(name, attr_name, vals) {
		var _self = this;
		if( vals!=undefined ) {
			$("input:checkbox[name='" + name + "']", _self.formData.schema.container).attr("checked", false);
			$("input:checkbox[name='" + name + "']", _self.formData.schema.container).parent("label").removeClass("data-checked");
			if (vals && vals != "") {
				$.map(vals.split(","), function (n) {
					$("input:checkbox[name='" + name + "'][" + attr_name + "='" + n + "']", _self.formData.schema.container).attr("checked", true);
					$("input:checkbox[name='" + name + "'][" + attr_name + "='" + n + "']", _self.formData.schema.container).parent("label").addClass("data-checked");
				});
			}
		} else {
			var ret_val = '';
			ret_val = $("input:checkbox[name='" + name + "']:checked", this.formData.schema.container).map(function () { return $(this).attr(attr_name); }).get().join(",");
			return ret_val;
		}
	},
	
    checkbox_clear: function (name) {
        $("input:checkbox[name='" + name + "']", this.formData.schema.container).attr("checked", false);
    },
    checkbox_all: function (name) {
        $("input:checkbox[name='" + name + "']", this.formData.schema.container).attr("checked", true);
    },
	
	radio: function(name, val) {
		if( val!=undefined ) {
			$("input:radio[name='" + name + "']", this.formData.schema.container).attr("checked", false);
			$("input:radio[name='" + name + "']", this.formData.schema.container).parent("label").removeClass("data-checked");
			$("input:radio[name='" + name + "'][value='" + val + "']", this.formData.schema.container).attr("checked", true);
			$("input:radio[name='" + name + "'][value='" + val + "']", this.formData.schema.container).parent("label").addClass("data-checked");
		} else {
			var ret_val = '0';
			ret_val = $("input:radio[name='" + name + "']:checked", this.formData.schema.container).val();
			return ret_val;
		}
	},

    radio_clear: function (name) {
        $("input:radio[name='" + name + "']", this.formData.schema.container).attr("checked", false);
    }
	/****************************************************************************************************************/
}