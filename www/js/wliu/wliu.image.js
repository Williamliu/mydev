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
						thumb:  	opts.thumb?opts.thumb:"thumb",						
						view: 		opts.view?opts.view:"medium",
						max_length: 0,
						max_size: 	0
	};
	this.error		= {errorCode:0, errorMessage:""};  // images level error 
	this.images 	= [];
}

WLIU.IMAGELIST.prototype = {
	setScope: function(p_scope, imgList) {
		if( imgList ) {
			p_scope[imgList] = this;
		} else {
			p_scope.images = this;
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
			nimage.status 		= this.rows[rowidx].status?1:0;
			nimage.action 		= "savetext";
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

			this.ajaxCall(nimages, {
				ajaxAfter: function(nimages) {
					var ridx = FCOLLECT.indexByKV( _self.rows, {id: nimages.id});
					if( ridx >= 0 && ridx < _self.rows.length ) {
						_self.rows.splice(ridx, 1);
						_self.sc.$apply();
					}	
				}
			})
		
		
		}
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
				}
				if(!_self.sc.$$phase) _self.sc.$apply();
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
