/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};
// Table Object
WLIU.FORM = function( opts ) {
	this.selfName 	= opts.name?opts.name:"form"; // important for error redirect , errorCode=990
	this.scope 		= opts.scope?opts.scope:"";
	this.action 	= opts.action?opts.action:"save";   // "get"(rowstate=1) or "save"(rowstate=2;3)
	this.rowstate	= 2;   // 1 - update exist data;   2 - add new data;   3 - delete data
	this.lang       = opts.lang?opts.lang:"cn";
	this.url		= opts.url?opts.url:"";
	this.error		= {errorCode:0, errorMessage:"", errorField:""};  // table level error : action rights 
	this.rights 	= {view:1, save:0, cancel:1, clear:1, delete:0, add:1, detail:1, output:0, print:1};
	this.cols 		= [];
	this.data 		= [];
	$.extend(this.cols, opts.cols);
}

WLIU.FORM.prototype = {
	// set row col value to empty or defval if it has default value
	setScope: function(sc) {
		if(sc) {
			this.scope = sc;
			return this.scope;
		} else { 
			return this.scope;
		}
	},
	_resetError: function() {
		this.error.errorCode 	= 0;
		this.error.errorMessage = "";
		this.error.errorField 	= "";
		$("#wliu-form-message-body", "div[wliu-form-message]").html("");
		$("div[wliu-form-message]").removeAttr("active");
		$("#wliu-form-popup-body", "div[wliu-form-popup]").html("");

		if(this.cols.length>0) {
			for(var cidx=0; cidx<this.cols.length; cidx++) {
				var theCol 		= this.cols[cidx];
				$("a[wliu-form-col-error][scope='" + this.scope + "'][name='" + theCol.name + "']").attr("popup-body", "").removeAttr("active");
			}
		}
	},
	_setError: function(ntable) {
		var errMsg = ntable.error.errorMessage;		
		if(this.cols.length>0) {
			for(var cidx=0; cidx<this.cols.length; cidx++) {
				var theCol 		= this.cols[cidx];
				var nCol 		= FCOLLECT.objectByKV(ntable.data, {name:theCol.name});
				if(nCol.errorCode>0) {
					$("a[wliu-form-col-error][scope='" + this.scope + "'][name='" + theCol.name + "']").attr("popup-body", nCol.errorMessage).addAttr("active");
					errMsg += (errMsg?"\n":"") + nCol.errorMessage;
				} else {
					$("a[wliu-form-col-error][scope='" + this.scope + "'][name='" + theCol.name + "']").attr("popup-body", "").removeAttr("active");
				}
			}
		}
		this.error.errorCode 	= ntable.error.errorCode;
		this.error.errorField 	= ntable.error.errorField;
		this.error.errorMessage = errMsg;
		if(this.error.errorCode && this.error.errorMessage!="") {
			$("#wliu-form-message-body", "div[wliu-form-message]").html(this.error.errorMessage.nl2br1());
			$("div[wliu-form-message]").addAttr("active");

			$("#wliu-form-popup-body", "div[wliu-form-popup]").html(this.error.errorMessage.nl2br1());
			$("div[wliu-form-popup]").trigger("show");
		} else {
			$("#wliu-form-message-body", "div[wliu-form-message]").html("");
			$("div[wliu-form-message]").removeAttr("active");
			$("#[wliu-form-popup-body", "div[wliu-form-popup]").html("");
		}
	},
	_initData: function() {
		if(this.cols.length>0) {
			for(var cidx=0; cidx<this.cols.length; cidx++) {
				var theCol 		= this.cols[cidx];
				if(theCol.defval) {
					switch(theCol.coltype) {
						case "text":
							$("span[scope='" + this.scope + "'][name='" + theCol.name + "']").html(theCol.defval);
							break;
						case "hidden":
						case "textbox":
						case "password":
						case "date":
							$("input[scope='" + this.scope + "'][name='" + theCol.name + "']").val(theCol.defval);
							break;
						case "textarea":
							$("textarea[scope='" + this.scope + "'][name='" + theCol.name + "']").val(theCol.defval);
							break;
						case "select":
							$("select[scope='" + this.scope + "'][name='" + theCol.name + "']").val(theCol.defval);
							break;
						case "passpair":
							$("input[scope='" + this.scope + "'][name='" + theCol.name + "']").val(theCol.defval);
							$("input[scope='" + this.scope + "'][name='confirm_" + theCol.name + "']").val(theCol.defval);
							break;
						case "radio":
							$("input[scope='" + this.scope + "'][name='" + theCol.name + "']:checked").attr("checked", false);
							$("input[scope='" + this.scope + "'][name='" + theCol.name + "'][value='" + theCol.defval + "']").attr("checked", true);
							break;
						case "checkbox":
							$("input[scope='" + this.scope + "'][name='" + theCol.name + "']").attr("checked", false);
							$.map(theCol.defval.split(","), function (n) {
								$("input[scope='" + this.scope + "'][name='" + theCol.name + "'][value='" + n + "']").attr("checked", true);
							});
							break;
						case "bool":
							$("input[scope='" + this.scope + "'][name='" + theCol.name + "']").attr("checked", theCol.defval?true:false);
							break;
					}
				}
			}
		}
	},
	_getData: function() {
		var pdata = [];
		if(this.cols.length>0) {
			for(var cidx=0; cidx<this.cols.length; cidx++) {
				var theCol 		= this.cols[cidx];
				var colDataObj 	= {};
				colDataObj.name 		= theCol.name;
				colDataObj.errorCode 	= 0;
				colDataObj.errorMessage = ""; 
				switch(theCol.coltype) {
					case "text":
						colDataObj.value = $("span[scope='" + this.scope + "'][name='" + theCol.name + "']").html();
						break;
					case "hidden":
					case "textbox":
					case "password":
					case "date":
						colDataObj.value = $("input[scope='" + this.scope + "'][name='" + theCol.name + "']").val();
						break;
					case "textarea":
						colDataObj.value = $("textarea[scope='" + this.scope + "'][name='" + theCol.name + "']").val();
						break;
					case "select":
						colDataObj.value = $("select[scope='" + this.scope + "'][name='" + theCol.name + "']").val();
						break;
					case "passpair":
						colDataObj.value = {};
						colDataObj.value.password = $("input[scope='" + this.scope + "'][name='" + theCol.name + "']").val();
						colDataObj.value.confirm = $("input[scope='" + this.scope + "'][name='confirm_" + theCol.name + "']").val();
						break;
					case "radio":
						colDataObj.value = $("input[scope='" + this.scope + "'][name='" + theCol.name + "']:checked").val();
						break;
					case "checkbox":
						colDataObj.value = $("input[scope='" + this.scope + "'][name='" + theCol.name + "']:checked").map(function () { return $(this).val(); }).get().join(",");
						break;
					case "bool":
						colDataObj.value = $("input[scope='" + this.scope + "'][name='" + theCol.name + "']").is(":checked")?1:0;
						break;
				}
				pdata.push(colDataObj);
			}
		}
		return pdata;
	},
	_getDataID: function() {
		var pdata = [];
		if(this.cols.length>0) {
			for(var cidx=0; cidx<this.cols.length; cidx++) {
				var theCol 		= this.cols[cidx];
				var colDataObj 	= {};
				colDataObj.name 		= theCol.name;
				colDataObj.errorCode 	= 0;
				colDataObj.errorMessage = ""; 
				if(theCol.key) colDataObj.value = $("input[scope='" + this.scope + "'][name='" + theCol.name + "']").val();
				pdata.push(colDataObj);
			}
		}
		return pdata;
	},
	// for one2many & many2many 
	resetData: function(theRows, theRow) {
		this._resetError();
		this.action 	= "save";
		this.rowstate 	= 2;
		this._initData();
	},

	getData: function(callback) {
		this._resetError();
		this.action		= "get";
		this.rowstate 	= 1;
		var ntable = {};
		ntable.scope 	= this.scope;
		ntable.action 	= this.action;
		ntable.rowstate = this.rowstate;
		ntable.lang  	= this.lang;
		ntable.error    = {errorCode: 0, errorMessage:"", errorField:""};
		ntable.cols     = this.cols; // must provide cols meta to get data from database;
		this.ajaxCall(ntable, callback);
	},

	addData: function(callback) {
		this._resetError();
		this.action		= "save";
		this.rowstate 	= 2;
		var ntable = {};
		ntable.scope 	= this.scope;
		ntable.action 	= this.action;
		ntable.rowstate = this.rowstate;
		ntable.lang  	= this.lang;
		ntable.error    = {errorCode: 0, errorMessage:"", errorField:""};
		ntable.cols     = this.cols; // must provide cols meta to get data from database;
		ntable.data 	= this._getData();
		this.ajaxCall(ntable, callback);
	},

	deleteData: function(callback) {
		this._resetError();
		this.action		= "save";
		this.rowstate 	= 3;
		var ntable 		= {};
		ntable.scope 	= this.scope;
		ntable.action 	= this.action;
		ntable.rowstate = this.rowstate;
		ntable.lang  	= this.lang;
		ntable.error    = {errorCode: 0, errorMessage:"", errorField:""};
		ntable.cols     = this.cols; // must provide cols meta to get data from database;
		ntable.data 	= this._getDataID();
		this.ajaxCall(ntable, callback);
	},

	/********************************/
	ajaxCall: function(ntable, callback) {
		var _self = this;
		$("div#wliu-wait-id[wliu-wait]").trigger("show");
		if( callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(table);
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

				_self._setError(req.table);

				if( parseInt(req.table.error.errorCode) == 0 ) {
					if(callback && callback.ajaxSuccess && $.isFunction(callback.ajaxSuccess) ) callback.ajaxSuccess(req.table);
				} else {
					if(callback && callback.ajaxError && $.isFunction(callback.ajaxError) ) callback.ajaxError(req.table);
				}
				switch(req.table.action) {
					case "get":
						break;
					case "save":
						_self._updateRow(req.table);
						break;
					case "custom":
						break;
				}
				
				//Sesssion Expiry
				if(req.errorCode==990) {
					if($("div#wliu-autotip-id[wliu-autotip]").length>0) {
						$("div#wliu-autotip-id[wliu-autotip]").trigger("auto", [req.errorMessage, "warning", function(){ window.location.href = req.errorField; }]);
					} else {
						alert(req.errorMessage);
						window.location.href = req.errorField;
					}
				} 
			},
			type: "post",
			url: _self.url
		});
	},
	_updateRow: function(ntable) {
	},
	errorCall: function() {
		if(this.error.errorCode==990) {
			window.location.href = this.error.errorField;
		} 
	}
}
