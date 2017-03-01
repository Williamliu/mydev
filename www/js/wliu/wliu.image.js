var WLIU = WLIU || {};
// Table Object
WLIU.IMAGELIST = function( opts ) {
	this.sc			= null;

	this.lang       = opts.lang?opts.lan:"cn";
	//this.scope  	= opts.scope?opts.scope:""; // for secure reason, scope provide by server side, client not allow to change
	this.url		= opts.url?opts.url:"";
	this.wait		= opts.wait?opts.wait:"";
	this.autotip 	= opts.autotip?opts.autotip:"";
	this.showError 	= opts.showError?opts.showError:"";

	this.action		= "get";
	this.keys 		= {key1: 1};
	this.config     = {
						mode: 		"",
						scope: 		"",
						thumb:  	opts.thumb?opts.thumb:"tiny",						
						view: 		opts.view?opts.view:"medium",
						max_length: 0,
						max_size: 	0
	};
	this.error		= {errorCode:0, errorMessage:""};  // images level error 
	this.rows 		= [];
	
}

WLIU.IMAGELIST.prototype = {
	setScope: function(p_scope, imgList) {
		if( imgList ) {
			p_scope[imgList] = this;
		} else {
			p_scope.imgList = this;
		}
		this.sc = p_scope;
	},
	imageError: function(p_error) {
		if(p_error!=undefined) {
			this.error = p_error;
		} 
		return this.error; 
	},
	thumb: function(rowidx) {
		if( this.rows[rowidx] ) {
			return this.rows[rowidx].resize&&this.rows[rowidx].resize[this.config.thumb]?this.rows[rowidx].resize[this.config.thumb].data:"";
		} else {
			return "";
		}
	},
	view: function(rowidx) {
		if( this.rows[rowidx] ) {
			return this.rows[rowidx].resize&&this.rows[rowidx].resize[this.config.view]?this.rows[rowidx].resize[this.config.view].data:"";
		} else {
			return "";
		}
	},
	origin: function(rowidx) {
		if( this.rows[rowidx] ) {
			return this.rows[rowidx].resize&&this.rows[rowidx].resize["origin"]?this.rows[rowidx].resize["origin"].data:"";
		} else {
			return "";
		}
	},
	saveText: function(rowidx, callback) {
		if( this.rows[rowidx] ) {
			this.error.errorCode 	= 0;
			this.error.errorMessage = "";
			var nimage = {};
			nimage.id 			= this.rows[rowidx].id;
			nimage.scope 		= this.rows[rowidx].scope;
			nimage.title_en 	= this.rows[rowidx].title_en;
			nimage.title_cn 	= this.rows[rowidx].title_cn;
			nimage.detail_en 	= this.rows[rowidx].detail_en;
			nimage.detail_cn 	= this.rows[rowidx].detail_cn;
			nimage.orderno 		= this.rows[rowidx].orderno;
			nimage.status 		= this.rows[rowidx].status?1:0;
			nimage.action 		= "savetext";
			nimage.error 		= this.error;
			this.ajaxCall(nimage, callback);
		} else {
			return false;
		}
	},
	saveOrder: function(callback) {
		this.error.errorCode 	= 0;
		this.error.errorMessage = "";
		var nimages = {};
		nimages.action 	= "saveorder";
		nimages.error   = this.error;
		nimages.rows = [];
		for(var idx in this.rows) {
			var imgobj = {};
			imgobj.id = this.rows[idx].id;
			imgobj.sn = this.rows[idx].sn;
			nimages.rows.push(imgobj);
		}
		this.ajaxCall(nimages, callback);
	},
	deleteImage: function( rowidx ) {
		var _self = this;
		if( this.rows[rowidx] ) {
			this.error.errorCode 	= 0;
			this.error.errorMessage = "";
			var nimages = {};
			nimages.action 		= "delete";
			nimages.id 			= this.rows[rowidx].id;
			nimages.scope 		= this.rows[rowidx].scope;
			nimages.error 		= this.error;
			this.ajaxCall(nimages, {
				ajaxSuccess: function(nimages) {
					var ridx = FCOLLECT.indexByKV( _self.rows, {id: nimages.id});
					if( ridx >= 0 && ridx < _self.rows.length ) {
						_self.rows.splice(ridx, 1);
						_self.sc.$apply();
					}	
				}
			})
		
		
		}
	},
	addImage: function( imgObj ) {
		var _self = this;
		this.error.errorCode 	= 0;
		this.error.errorMessage = "";
		imgObj.scope 		= this.config.scope;
		imgObj.key1 		= this.keys.key1?this.keys.key1:0;
		imgObj.key2 		= this.keys.key2?this.keys.key2:0;
		imgObj.key3 		= this.keys.key3?this.keys.key3:0;
		imgObj.status	    = 1;
		imgObj.orderno 		= parseInt(this.rows.length) + 1;
		
		var nimages = {};
		nimages.action 		= "add";
		nimages.rowsn 		= imgObj.rowsn;
		nimages.id 			= 0;
		nimages.scope 		= imgObj.scope;
		nimages.key1 		= imgObj.key1;
		nimages.key2 		= imgObj.key2;
		nimages.key3 		= imgObj.key3;
		nimages.full_name 	= imgObj.full_name; 
		nimages.short_name 	= imgObj.short_name; 
		nimages.ext_name 	= imgObj.ext_name; 
		nimages.mime_type 	= imgObj.mime_type; 
		nimages.status 		= imgObj.status;
		nimages.orderno 	= imgObj.orderno;
		nimages.resize 		= imgObj.resize;
		nimages.error  		= this.error;

		this.ajaxCall(nimages, {
			ajaxSuccess: function(oimages) {
				imgObj.id 		= oimages.id;
				imgObj.scope 	= oimages.scope;
				imgObj.access 	= oimages.access;
				console.log(imgObj);				
				_self.rows.push(imgObj);
				_self.sc.$apply();
			}
		})
	},
	getImages: function(callback) {
		this.error.errorCode 	= 0;
		this.error.errorMessage = "";
		var nimages = {};
		nimages.action 	= "get";
		nimages.keys  	= this.keys;
		nimages.config  = this.config;
		nimages.error 	= this.error;
		nimages.rows = [];
		this.ajaxCall(nimages, callback);
	},
	ajaxCall: function(nimages, callback) {
		var _self = this;
		if( _self.wait ) $(_self.wait).trigger("show");
		if( callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(nimages);
		console.log("ajaxCall");
		console.log(nimages);
		$.ajax({
			data: {
				images:	nimages
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
						_self.syncText(req.images);
						break;
					case "saveorder":
						_self.syncText(req.images);
						break;
					case "delete":
						_self.syncText(req.images);
						break;
					case "add":
						break;
				}
				if(!_self.sc.$$phase) _self.sc.$apply();

				if( parseInt(req.images.error.errorCode) == 0 ) {
					if(callback && callback.ajaxSuccess && $.isFunction(callback.ajaxSuccess) ) callback.ajaxSuccess(req.images);
				} else {
					if(callback && callback.ajaxError && $.isFunction(callback.ajaxError) ) callback.ajaxError(req.images);
				}
				
				$(_self.showError).trigger("errorshow");
			},
			type: "post",
			url: _self.url
		});
	},
	syncRows: function(nimages) {
		this.imageError(nimages.error);
		this.config = angular.copy(nimages.config);
		this.rows = [];
		for(var ridx in nimages.rows) {
			var theRow 		= nimages.rows[ridx];
			theRow.sn  		= parseInt(nimages.rows[ridx].orderno);
			theRow.rowsn 	= guid();
			this.rows.push( new WLIU.IMAGE(theRow) );	
		}
		

		console.log(this.error);
		console.log(this.config);
		console.log(this.rows);
	},
	syncText: function(nimages) {
		this.imageError(nimages.error);
	}
}
