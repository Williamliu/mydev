/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};
// Table Object
WLIU.FORM = function( opts ) {
	this.selfName 	= opts.name?opts.name:"form"; // important for error redirect , errorCode=990
	this.scope 		= opts.scope?opts.scope:"";
	this.lang       = opts.lang?opts.lang:"cn";
	this.url		= opts.url?opts.url:"";
	this.wait		= opts.wait?opts.wait:"";
	this.autotip	= opts.autotip?opts.autotip:"";
	this.taberror 	= opts.taberror?opts.taberror:"";
	this.error		= {errorCode:0, errorMessage:"", errorField:""};  // table level error : action rights 
	this.rights 	= {view:1, save:0, cancel:1, clear:1, delete:0, add:1, detail:1, output:0, print:1};
	this.cols 		= [];
	this.data 		= [];
	$.extend(this.cols, opts.cols);

	this.taberror  = this.scope + "_wliu_form";
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
	resetRow: function(theRows, theRow) {
		return FROW.detach(theRow);
	},
	initData: function() {
		if(this.cols.length>0) {
			for(var cidx=0; cidx<this.cols.length; cidx++) {
				var theCol 		= this.cols[cidx];
				if(theCol.defval) {
					switch(theCol.coltype) {
						case "text":
							$("*[scope='" + this.scope + "'][name='" + theCol.name + "']").html(theCol.defval);
							break;
						case "hidden":
						case "textbox":
						case "textarea":
						case "password":
						case "select":
						case "date":
							$("*[scope='" + this.scope + "'][name='" + theCol.name + "']").val(theCol.defval);
							break;
						case "passpair":
							$("*[scope='" + this.scope + "'][name='" + theCol.name + "']").val(theCol.defval);
							$("*[scope='" + this.scope + "'][name='confirm_" + theCol.name + "']").val(theCol.defval);
							break;
						case "radio":
							$("*[scope='" + this.scope + "'][name='" + theCol.name + "']:checked").attr("checked", false);
							$("*[scope='" + this.scope + "'][name='" + theCol.name + "'][value='" + theCol.defval + "']").attr("checked", true);
							break;
						case "checkbox":
							$("*[scope='" + this.scope + "'][name='" + theCol.name + "']").attr("checked", false);
							$.map(theCol.defval.split(","), function (n) {
								$("*[scope='" + this.scope + "'][name='" + theCol.name + "'][value='" + n + "']").attr("checked", true);
							});
							break;
						case "bool":
							$("*[scope='" + this.scope + "'][name='" + theCol.name + "']").attr("checked", theCol.defval?true:false);
							break;
					}
				}
			}
		}
	},
	setError: function(ntable) {
		var errMsg = ntable.error.errorMessage;		
		if(this.cols.length>0) {
			for(var cidx=0; cidx<this.cols.length; cidx++) {
				var theCol 		= this.cols[cidx];
				var nCol 		= FCOLLECT.objectByKV(ntable.data, {name:theCol.name});
				if(nCol.errorCode>0) {
					$("*[scope='" + this.scope + "'][name='" + theCol.name + "']").addClass("wliuCommon-input-invalid").attr("title", nCol.errorMessage);
					errMsg += (errMsg?"<br>\n":"") + nCol.errorMessage;
				} else {
					$("*[scope='" + this.scope + "'][name='" + theCol.name + "']").removeClass("wliuCommon-input-invalid").attr("title", "");
				}
			}
		}
		this.error.errorCode 	= ntable.error.errorCode;
		this.error.errorField 	= ntable.error.errorField;
		this.error.errorMessage = errMsg;
	},
	getData: function() {
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
						colDataObj.value = $("*[scope='" + this.scope + "'][name='" + theCol.name + "']").html();
						break;
					case "hidden":
					case "textbox":
					case "textarea":
					case "password":
					case "select":
					case "date":
						colDataObj.value = $("*[scope='" + this.scope + "'][name='" + theCol.name + "']").val();
						break;
					case "passpair":
						colDataObj.value = {};
						colDataObj.value.password = $("*[scope='" + this.scope + "'][name='" + theCol.name + "']").val();
						colDataObj.value.confirm = $("*[scope='" + this.scope + "'][name='confirm_" + theCol.name + "']").val();
						break;
					case "radio":
						colDataObj.value = $("*[scope='" + this.scope + "'][name='" + theCol.name + "']:checked").val();
						break;
					case "checkbox":
						colDataObj.value = $("*[scope='" + this.scope + "'][name='" + theCol.name + "']:checked").map(function () { return $(this).val(); }).get().join(",");
						break;
					case "bool":
						colDataObj.value = $("*[scope='" + this.scope + "'][name='" + theCol.name + "']").is(":checked")?1:0;
						break;
				}
				pdata.push(colDataObj);
			}
		}
		return pdata;
	},
	// for one2many & many2many 
	postData: function(callback) {
		var ntable = {};
		ntable.scope 	= this.scope;
		ntable.lang  	= this.lang;
		ntable.error    = {errorCode: 0, errorMessage:"", errorField:""};
		ntable.cols     = this.cols; // must provide cols meta to get data from database;
		ntable.data 	= this.getData();
		this.ajaxCall(ntable, callback);
	},

	/********************************/
	ajaxCall: function(ntable, callback) {
		var _self = this;
		if(_self.wait ) $("#" + _self.wait).trigger("show");
		if( callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(table);
		console.log(ntable);
		$.ajax({
			data: {
				table:	ntable
			},
			dataType: "json",  
			contentType:"application/x-www-form-urlencoded",
			error: function(xhr, tStatus, errorTh ) {
				if(_self.wait ) $("#" + _self.wait).trigger("hide");
			},
			success: function(req, tStatus) {
				if(_self.wait ) $("#" + _self.wait).trigger("hide");
				if( callback && callback.ajaxAfter && $.isFunction(callback.ajaxAfter) ) callback.ajaxAfter(req.table);

				if( parseInt(req.table.error.errorCode) == 0 ) {
					if(callback && callback.ajaxSuccess && $.isFunction(callback.ajaxSuccess) ) callback.ajaxSuccess(req.table);
				} else {
					if(callback && callback.ajaxError && $.isFunction(callback.ajaxError) ) callback.ajaxError(req.table);
				}
				_self.updateRow(req.table);

				console.log("ajax done");
				console.log(req.table);
			
				//Sesssion Expiry
				/*
				if(req.errorCode==990) {
					if($("#" + _self.autotip).length>0) {
						$("#" + _self.autotip).trigger("auto", [req.errorMessage, "warning", function(){ window.location.href = req.errorField; }]);
					} else {
						alert(req.errorMessage);
						window.location.href = req.errorField;
					}
				} 
				*/
			},
			type: "post",
			url: _self.url
		});
	},
	updateRow: function(ntable) {
		if(ntable.error.errorCode>0) {
			this.setError(ntable);

			// add dom 
			if( $("#" + this.taberror).length<=0 ) {
				var errorHTML =  [
					'<div id="' + this.taberror + '" wliu-diag movable maskable after="' + this.selfName + '.errorCall()">',
						'<div wliu-diag-head>Message</div>',
							'<div wliu-diag-body style="font-size:16px;">',
							'<i class="fa fa-exclamation-triangle fa-lg" aria-hidden="true" style="color:red;"></i> <span style="font-size:16px;">We can\'t process submitted data:</span>',
							'<div id="form_error_message" style="margin-top:12px;"></div>',
						'</div>',    
					'</div>'
				].join('');
				$("body").append(errorHTML);
				$("#" + this.taberror).wliuDiag();
			}

			$("#form_error_message", $("#" + this.taberror)).html(this.error.errorMessage);
			$("#" + this.taberror).trigger("show");
		} else {

		}
	},
	errorCall: function() {
		if(this.error.errorCode==990) {
				window.location.href = this.error.errorField;
		} 
	}
}
