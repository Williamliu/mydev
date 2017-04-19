var WLIU = WLIU || {};
// Table Object
WLIU.FILELIST = function( opts ) {
	this.sc			= null;

	this.lang       = opts.lang?opts.lang:"cn";
	this.url		= opts.url?opts.url:"";
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
	this.current 		= "";
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
	index: function(guid) {
		return FCOLLECT.indexByKV(this.rows, {guid:guid});
	},
	currentIndex: function() {
		var curImg = this.getCurrent();
		if(curImg) 
			return this.index(curImg.guid);
		else 
			return -1;
	},
	getFile: function(guid) {
		var rowidx = this.index(guid);
		if(rowidx>=0 && rowidx < this.rows.length) {
			return this.rows[rowidx];
		} else {
			return undefined;
		}
	},
	getCurrent: function() {
		return this.getFile(this.current);
	},

	saveText: function(oFile, callback) {
		if( oFile ) {
			this.errorCode 		= 0;
			this.errorMessage 	= "";
			var nfile = {};
			nfile.id 			= oFile.id;
			nfile.guid 			= oFile.guid;
			nfile.scope 		= oFile.scope;
			nfile.title_en 		= oFile.title_en;
			nfile.title_cn 		= oFile.title_cn;
			nfile.detail_en 	= oFile.detail_en;
			nfile.detail_cn 	= oFile.detail_cn;
			nfile.orderno 		= oFile.orderno;
			nfile.status 		= oFile.status?1:0;
			nfile.action 		= "savetext";
			nfile.errorCode 	= this.errorCode;
			nfile.errorMessage = this.errorMessage;
			this.ajaxCall(nfile, callback);
		} else {
			return false;
		}
	},
	printFile: function( oFile, callback ) {
		var _self = this;
		if( oFile ) {
			if( oFile.data ) {
				callback(oFile);
			} else {
				this.errorCode 		= 0;
				this.errorMessage 	= "";
				var nfiles = {};
				nfiles.action 		= "print";
				nfiles.id 			= oFile.id;
				nfiles.guid			= oFile.guid;
				nfiles.scope 		= oFile.scope;
				nfiles.errorCode 	= this.errorCode;
				nfiles.errorMessage = this.errorMessage;
				this.ajaxCall(nfiles, {
					ajaxSuccess: function(rfile) {
						oFile.data = rfile.data;
						_self.sc.$apply();
						if(callback) if($.isFunction(callback)) callback(rfile);
					}
				})
			}
		}
	},
	deleteFile: function( oFile ) {
		var _self = this;
		if( oFile ) {
			this.errorCode 		= 0;
			this.errorMessage 	= "";
			var nfiles = {};
			nfiles.action 		= "delete";
			nfiles.id 			= oFile.id;
			nfiles.guid 		= oFile.guid;
			nfiles.scope 		= oFile.scope;
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
		nfiles.guid 		= fileObj.guid;
		nfiles.token 		= fileObj.token;
		nfiles.errorCode  	= this.errorCode;
		nfiles.errorMessage = this.errorMessage;

		this.ajaxCall(nfiles, {
			ajaxSuccess: function(ofiles) {
				fileObj.id 		= ofiles.id;
				fileObj.scope 	= ofiles.scope;
				fileObj.access 	= ofiles.access;
				fileObj.url 	= ofiles.url;
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
		$("div#wliu-wait-id[wliu-wait]").trigger("show");
		if( callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(nfiles);
		//console.log(nfiles);
		$.ajax({
			data: {
				files:	nfiles
			},
			dataType: "json",  
			contentType:"application/x-www-form-urlencoded",
			error: function(xhr, tStatus, errorTh ) {
				$("div#wliu-wait-id[wliu-wait]").trigger("hide");
			},
			success: function(req, tStatus) {
				$("div#wliu-wait-id[wliu-wait]").trigger("hide");
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

				//Error Handle include : session expiry
				GCONFIG.errorCall({errorCode: req.errorCode, errorMessage: req.errorMessage});
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
