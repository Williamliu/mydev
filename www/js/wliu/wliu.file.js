var WLIU = WLIU || {};
// Table Object
WLIU.FILELIST = function( opts ) {
	this.sc			= null;

	this.lang       = opts.lang?opts.lan:"cn";
	//this.scope  	= opts.scope?opts.scope:""; // for secure reason, scope provide by server side, client not allow to change
	this.url		= opts.url?opts.url:"";
	this.wait		= opts.wait?opts.wait:"";
	this.autotip 	= opts.autotip?opts.autotip:"";
	this.errorShow 	= opts.errorShow?opts.errorShow:"";
	this.infoEditor = opts.infoEditor?opts.infoEditor:"";
	this.action		= "get";
	this.keys 		= {key1: 1};
	this.config     = {
						mode: 		"",
						scope: 		"",
						max_length: 0,
						max_size: 	0
	};
	this.curidx 		= -1;
	this.errorCode  	= 0;
	this.errorMessage 	= "";  // images level error 
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
	addFile: function( imgObj ) {
		var _self = this;
		this.errorCode 		= 0;
		this.errorMessage 	= "";
		imgObj.scope 		= this.config.scope;
		imgObj.key1 		= this.keys.key1?this.keys.key1:0;
		imgObj.key2 		= this.keys.key2?this.keys.key2:0;
		imgObj.key3 		= this.keys.key3?this.keys.key3:0;
		imgObj.status	    = 1;
		imgObj.orderno 		= parseInt(this.rows.length) + 1;
		
		var nfiles = {};
		nfiles.action 		= "add";
		nfiles.rowsn 		= imgObj.rowsn;
		nfiles.id 			= 0;
		nfiles.scope 		= imgObj.scope;
		nfiles.key1 		= imgObj.key1;
		nfiles.key2 		= imgObj.key2;
		nfiles.key3 		= imgObj.key3;
		nfiles.full_name 	= imgObj.full_name; 
		nfiles.short_name 	= imgObj.short_name; 
		nfiles.ext_name 	= imgObj.ext_name; 
		nfiles.mime_type 	= imgObj.mime_type; 
		nfiles.status 		= imgObj.status;
		nfiles.orderno 	= imgObj.orderno;
		nfiles.resize 		= angular.copy(imgObj.resize);
		nfiles.errorCode  	= this.errorCode;
		nfiles.errorMessage = this.errorMessage;

		this.ajaxCall(nfiles, {
			ajaxSuccess: function(oimages) {
				imgObj.id 		= oimages.id;
				imgObj.scope 	= oimages.scope;
				imgObj.access 	= oimages.access;
				_self.rows.push(imgObj);
				_self.sc.$apply();
			}
		})
	},
	getFiles: function(callback) {
		this.errorCode 		= 0;
		this.errorMessage 	= "";
		var nfiles = {};
		nfiles.action 	= "get";
		nfiles.keys  	= this.keys;
		nfiles.config  = this.config;
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
				images:	nfiles
			},
			dataType: "json",  
			contentType:"application/x-www-form-urlencoded",
			error: function(xhr, tStatus, errorTh ) {
				if( _self.wait ) $(_self.wait).trigger("hide");
			},
			success: function(req, tStatus) {
				if( _self.wait ) $(_self.wait).trigger("hide");
				if( callback && callback.ajaxAfter && $.isFunction(callback.ajaxAfter) ) callback.ajaxAfter(req.images);

				switch( req.images.action ) {
					case "get":
						_self.syncRows(req.images);
						break;
					case "savetext":
						_self.syncError(req.images);
						break;
					case "saveorder":
						_self.syncError(req.images);
						break;
					case "delete":
						_self.syncError(req.images);
						break;
					case "add":
						_self.syncError(req.images);
						break;
					case "save":
						_self.syncError(req.images);
						break;
				}
				if(!_self.sc.$$phase) _self.sc.$apply();

				if( parseInt(req.images.errorCode) == 0 ) {
					if(callback && callback.ajaxSuccess && $.isFunction(callback.ajaxSuccess) ) callback.ajaxSuccess(req.images);
				} else {
					if(callback && callback.ajaxError && $.isFunction(callback.ajaxError) ) callback.ajaxError(req.images);
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
			theRow.rowsn 	= guid();
			this.rows.push( new WLIU.IMAGE(theRow) );	
		}
	},
	syncError: function(nfiles) {
		this.errorCode 		= nfiles.errorCode;
		this.errorMessage 	= nfiles.errorMessage;
	}
}
