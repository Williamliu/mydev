var WLIU = WLIU || {};
// Table Object
WLIU.FILELIST = function( opts ) {
	this.sc			= null;

	this.lang       = opts.lang?opts.lan:"cn";
	this.url		= opts.url?opts.url:"";
	this.wait		= opts.wait?opts.wait:"";
	this.autotip 	= opts.autotip?opts.autotip:"";
	this.errorShow 	= opts.errorShow?opts.errorShow:"";
	this.infoEditor = opts.infoEditor?opts.infoEditor:"";
	this.action		= "get";
	this.keys 		= {key1:"", key2:"", key3:""};
	this.config     = {
						mode: 		"",
						scope: 		"",
						max_length: 0,
						max_size: 	0
	};
	this.curidx 		= -1;
	this.errorCode  	= 0;
	this.errorMessage 	= "";  // files level error 
	this.rows 			= [];
	
}

WLIU.FILELIST.prototype = {
	setScope: function(p_scope, fileList) {
		if( fileList ) {
			p_scope[fileList] = this;
		} else {
			p_scope.fileList = this;
		}
		this.sc = p_scope;
	},
	saveText: function(rowidx, callback) {
		if( this.rows[rowidx] ) {
			this.errorCode 		= 0;
			this.errorMessage 	= "";
			var nfile = {};
			nfile.id 			= this.rows[rowidx].id;
			nfile.scope 		= this.rows[rowidx].scope;
			nfile.title_en 	= this.rows[rowidx].title_en;
			nfile.title_cn 	= this.rows[rowidx].title_cn;
			nfile.detail_en 	= this.rows[rowidx].detail_en;
			nfile.detail_cn 	= this.rows[rowidx].detail_cn;
			nfile.orderno 		= this.rows[rowidx].orderno;
			nfile.status 		= this.rows[rowidx].status?1:0;
			nfile.action 		= "savetext";
			nfile.errorCode 	= this.errorCode;
			nfile.errorMessage = this.errorMessage;
			this.ajaxCall(nfile, callback);
		} else {
			return false;
		}
	},
	printFile: function( rowidx, callback ) {
		var _self = this;
		if( this.rows[rowidx] ) {
			if( this.rows[rowidx].data ) {
				callback(this.rows[rowidx]);
			} else {
				this.errorCode 		= 0;
				this.errorMessage 	= "";
				var nfiles = {};
				nfiles.action 		= "print";
				nfiles.id 			= this.rows[rowidx].id;
				nfiles.scope 		= this.rows[rowidx].scope;
				nfiles.errorCode 	= this.errorCode;
				nfiles.errorMessage = this.errorMessage;
				this.ajaxCall(nfiles, {
					ajaxSuccess: function(ofiles) {
						_self.rows[rowidx].data = ofiles.data;
						_self.sc.$apply();
						if(callback) if($.isFunction(callback)) callback(ofiles);
					}
				})
			}
		}
	},
	deleteFile: function( rowidx ) {
		var _self = this;
		if( this.rows[rowidx] ) {
			this.errorCode 		= 0;
			this.errorMessage 	= "";
			var nfiles = {};
			nfiles.action 		= "delete";
			nfiles.id 			= this.rows[rowidx].id;
			nfiles.scope 		= this.rows[rowidx].scope;
			nfiles.errorCode 	= this.errorCode;
			nfiles.errorMessage = this.errorMessage;
			this.ajaxCall(nfiles, {
				ajaxSuccess: function(nfiles) {
					var ridx = FCOLLECT.indexByKV( _self.rows, {id: nfiles.id});
					if( ridx >= 0 && ridx < _self.rows.length ) {
						_self.rows.splice(ridx, 1);
						_self.sc.$apply();
					}	
				}
			})
		
		
		}
	},
	addFile: function( fileObj ) {
		var _self = this;
		this.errorCode 		= 0;
		this.errorMessage 	= "";
		fileObj.scope 		= this.config.scope;
		fileObj.key1 		= this.keys.key1?this.keys.key1:0;
		fileObj.key2 		= this.keys.key2?this.keys.key2:0;
		fileObj.key3 		= this.keys.key3?this.keys.key3:0;
		fileObj.status	    = 1;
		fileObj.orderno 	= parseInt(this.rows.length) + 1;
		
		var nfiles = {};
		nfiles.action 		= "add";
		nfiles.id 			= 0;
		nfiles.scope 		= fileObj.scope;
		nfiles.key1 		= fileObj.key1;
		nfiles.key2 		= fileObj.key2;
		nfiles.key3 		= fileObj.key3;
		nfiles.full_name 	= fileObj.full_name; 
		nfiles.short_name 	= fileObj.short_name; 
		nfiles.ext_name 	= fileObj.ext_name; 
		nfiles.mime_type 	= fileObj.mime_type; 
		nfiles.status 		= fileObj.status;
		nfiles.orderno 		= fileObj.orderno;
		nfiles.data 		= fileObj.data;
		nfiles.rowsn 		= fileObj.rowsn;
		nfiles.token 		= fileObj.token;
		nfiles.errorCode  	= this.errorCode;
		nfiles.errorMessage = this.errorMessage;

		this.ajaxCall(nfiles, {
			ajaxSuccess: function(ofiles) {
				fileObj.id 		= ofiles.id;
				fileObj.scope 	= ofiles.scope;
				fileObj.access 	= ofiles.access;
				_self.rows.push(fileObj);
				_self.sc.$apply();
			}
		})
	},
	getRecord: function(IDKeyValues, callback) {
		this.keys = IDKeyValues;
		this.getFiles(callback);
	},
	getFiles: function(callback) {
		this.errorCode 		= 0;
		this.errorMessage 	= "";
		var nfiles = {};
		nfiles.action 	= "get";
		nfiles.keys  			= this.keys;
		nfiles.config  			= this.config;
		nfiles.errorCode 		= this.errorCode;
		nfiles.errorMessage 	= this.errorMessage;
		nfiles.rows = [];
		this.ajaxCall(nfiles, callback);
	},
	ajaxCall: function(nfiles, callback) {
		var _self = this;
		if( _self.wait ) $(_self.wait).trigger("show");
		if( callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(nfiles);
		//console.log(nfiles);
		$.ajax({
			data: {
				files:	nfiles
			},
			dataType: "json",  
			contentType:"application/x-www-form-urlencoded",
			error: function(xhr, tStatus, errorTh ) {
				if( _self.wait ) $(_self.wait).trigger("hide");
			},
			success: function(req, tStatus) {
				if( _self.wait ) $(_self.wait).trigger("hide");
				if( callback && callback.ajaxAfter && $.isFunction(callback.ajaxAfter) ) callback.ajaxAfter(req.files);

				switch( req.files.action ) {
					case "get":
						_self.syncRows(req.files);
						break;
					case "savetext":
						_self.syncError(req.files);
						break;
					case "saveorder":
						_self.syncError(req.files);
						break;
					case "delete":
						_self.syncError(req.files);
						break;
					case "add":
						_self.syncError(req.files);
						break;
					case "save":
						_self.syncError(req.files);
						break;
				}
				if(!_self.sc.$$phase) _self.sc.$apply();

				if( parseInt(req.files.errorCode) == 0 ) {
					if(callback && callback.ajaxSuccess && $.isFunction(callback.ajaxSuccess) ) callback.ajaxSuccess(req.files);
				} else {
					if(callback && callback.ajaxError && $.isFunction(callback.ajaxError) ) callback.ajaxError(req.files);
				}
				
				$(_self.errorShow).trigger("errorshow");
			},
			type: "post",
			url: _self.url
		});
	},
	syncRows: function(nfiles) {
		this.errorCode 		= nfiles.errorCode;
		this.errorMessage 	= nfiles.errorMessage;
		this.config = angular.copy(nfiles.config);
		this.rows = [];
		for(var ridx in nfiles.rows) {
			var theRow 		= nfiles.rows[ridx];
			theRow.sn  		= parseInt(nfiles.rows[ridx].orderno);
			this.rows.push( new WLIU.FILE(theRow) );	
		}
	},
	syncError: function(nfiles) {
		this.errorCode 		= nfiles.errorCode;
		this.errorMessage 	= nfiles.errorMessage;
	}
}
