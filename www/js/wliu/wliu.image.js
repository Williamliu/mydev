var WLIU = WLIU || {};
// Table Object
WLIU.IMAGELIST = function( opts ) {
	this.sc			= null;
	this.lang       = opts.lang?opts.lang:"cn";
	this.url		= opts.url?opts.url:"";
	this.errorShow 	= opts.errorShow?opts.errorShow:"";
	this.infoEditor = opts.infoEditor?opts.infoEditor:"";
	this.imgViewer  = opts.imgViewer?opts.imgViewer:"";
	this.imgEditor  = opts.imgEditor?opts.imgEditor:"";
	this.action		= "get";
	// keys required by server side database config file
	this.keys 		= {key1:"", key2:"", key3:""};
	this.config     = {
						mode: 		"",
						scope: 		"",
						thumb:  	opts.thumb?opts.thumb:"tiny",						
						view: 		opts.view?opts.view:"medium",
						max_length: 0,
						max_size: 	0
	};
	this.current 		= "";
	this.errorCode  	= 0;
	this.errorMessage 	= "";  // images level error 
	this.rows 			= [];
	
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
	getImage: function(guid) {
		var rowidx = this.index(guid);
		if(rowidx>=0 && rowidx < this.rows.length) {
			return this.rows[rowidx];
		} else {
			return undefined;
		}
	},
	getCurrent: function() {
		return this.getImage(this.current);
	},
	navLeft: function(callback) {
		var rowidx = this.currentIndex();
    	if(rowidx>0) rowidx--;
		if( this.rows[rowidx] ) {
			this.current = this.rows[rowidx].guid;
		} else {
			this.current = "";
		}
		if(callback) if($.isFunction(callback)) callback(this.rows[rowidx]);
	},
	navLeftState: function() {
		if(this.rows.length <= 1) return false; 
		if(this.currentIndex() <= 0) return false; 
		return true;
	},
	navRight: function(callback) {
		var rowidx = this.currentIndex();
    	if(rowidx<this.rows.length-1) rowidx++;
		if( this.rows[rowidx] ) {
			this.current = this.rows[rowidx].guid;
		} else {
			this.current = "";
		}
		if(callback) if($.isFunction(callback)) callback(this.rows[rowidx]);
	},
	navRightState: function() {
		if(this.rows.length <= 1) return false; 
		if(this.currentIndex() >= this.rows.length -1 ) return false; 
		return true;
	},
	thumbImageData: function(oImg) {
		if(oImg) return oImg.resize && oImg.resize[this.config.thumb]?oImg.resize[this.config.thumb].data:"";
	},
	currentThumbData: function() {
		return this.thumbImageData(this.getCurrent());
	},
	viewImageData: function(oImg) {
		if(oImg) return oImg.resize && oImg.resize[this.config.view]?oImg.resize[this.config.view].data:"";
	},
	currentViewData: function() {
		return this.viewImageData(this.getCurrent());
	},
	originImageData: function(oImg) {
		if(oImg) return oImg.resize && oImg.resize["origin"]?oImg.resize["origin"].data:"";
	},
	currentOriginData: function() {
		return this.originImageData(this.getCurrent());
	},
	saveText: function(oImg, callback) {
		if( oImg ) {
			this.errorCode 		= 0;
			this.errorMessage 	= "";
			var nimage = {};
			nimage.id 			= oImg.id;
			nimage.guid			= oImg.guid;
			nimage.scope 		= oImg.scope;
			nimage.title_en 	= oImg.title_en;
			nimage.title_cn 	= oImg.title_cn;
			nimage.detail_en 	= oImg.detail_en;
			nimage.detail_cn 	= oImg.detail_cn;
			nimage.orderno 		= oImg.orderno;
			nimage.status 		= oImg.status?1:0;
			nimage.action 		= "savetext";
			nimage.errorCode 	= this.errorCode;
			nimage.errorMessage = this.errorMessage;
			this.ajaxCall(nimage, callback);
		} else {
			return false;
		}
	},
	saveOrder: function(callback) {
		this.errorCode 		= 0;
		this.errorMessage 	= "";
		var nimages = {};
		nimages.action 			= "saveorder";
		nimages.errorCode   	= this.errorCode;
		nimages.errorMessage   	= this.errorMessage;
		nimages.rows = [];
		for(var idx in this.rows) {
			var imgobj = {};
			imgobj.id = this.rows[idx].id;
			imgobj.sn = this.rows[idx].sn;
			nimages.rows.push(imgobj);
		}
		this.ajaxCall(nimages, callback);
	},
	deleteImage: function( oImg ) {
		var _self = this;
		if( oImg ) {
			this.errorCode 		= 0;
			this.errorMessage 	= "";
			var nimages = {};
			nimages.action 		= "delete";
			nimages.id 			= oImg.id;
			nimages.guid		= oImg.guid;
			nimages.scope 		= oImg.scope;
			nimages.errorCode 	= this.errorCode;
			nimages.errorMessage = this.errorMessage;
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
	saveImage: function( oImg, callback ) {
		var _self = this;
		this.errorCode 		= 0;
		this.errorMessage 	= "";
		var nimages  		= angular.copy(oImg);
		oImg.errorCode 		= this.errorCode;
		oImg.errorMessage 	= this.errorMessage;
		
		nimages.action 		= "save";
		nimages.errorCode  	= oImg.errorCode;
		nimages.errorMessage= oImg.errorMessage;
		
		this.ajaxCall(nimages, {
			ajaxAfter: function() {
				if(callback) if($.isFunction(callback)) callback();
			},
			ajaxSuccess: function(oimages) {
				//console.log(oimages);
				_self.sc.$apply();
			}
		})
	},
	addImage: function( oImg ) {
		var _self = this;
		this.errorCode 		= 0;
		this.errorMessage 	= "";
		oImg.scope 			= this.config.scope;
		oImg.key1 			= this.keys.key1?this.keys.key1:0;
		oImg.key2 			= this.keys.key2?this.keys.key2:0;
		oImg.key3 			= this.keys.key3?this.keys.key3:0;
		oImg.status	    	= 1;
		oImg.orderno 		= parseInt(this.rows.length) + 1;
		
		var nimages = {};
		nimages.action 		= "add";
		nimages.id 			= 0;
		nimages.guid		= oImg.guid;
		nimages.scope 		= oImg.scope;
		nimages.key1 		= oImg.key1;
		nimages.key2 		= oImg.key2;
		nimages.key3 		= oImg.key3;
		nimages.full_name 	= oImg.full_name; 
		nimages.short_name 	= oImg.short_name; 
		nimages.ext_name 	= oImg.ext_name; 
		nimages.mime_type 	= oImg.mime_type; 
		nimages.status 		= oImg.status;
		nimages.orderno 	= oImg.orderno;
		nimages.guid 		= oImg.guid;
		nimages.token		= oImg.token;
		nimages.resize 		= angular.copy(oImg.resize);
		nimages.errorCode  	= this.errorCode;
		nimages.errorMessage = this.errorMessage;

		this.ajaxCall(nimages, {
			ajaxSuccess: function(oimages) {
				oImg.id 		= oimages.id;
				oImg.scope 		= oimages.scope;
				oImg.access 	= oimages.access;
				oImg.url 		= oimages.url;
				_self.rows.push(oImg);
				_self.sc.$apply();
			}
		})
	},
	getRecord: function(IDKeyValues, callback) {
		this.keys = IDKeyValues;
		this.getImages(callback);
	},
	getImages: function(callback) {
		this.errorCode 		= 0;
		this.errorMessage 	= "";
		var nimages = {};
		nimages.action 	= "get";
		nimages.keys  	= this.keys;
		nimages.config  = this.config;
		nimages.errorCode 		= this.errorCode;
		nimages.errorMessage 	= this.errorMessage;
		nimages.rows = [];
		this.ajaxCall(nimages, callback);
	},
	ajaxCall: function(nimages, callback) {
		var _self = this;
		$("div#wliu-wait-id[wliu-wait]").trigger("show");
		if( callback && callback.ajaxBefore && $.isFunction(callback.ajaxBefore) ) callback.ajaxBefore(nimages);
		//console.log(nimages);
		$.ajax({
			data: {
				images:	nimages
			},
			dataType: "json",  
			contentType:"application/x-www-form-urlencoded",
			error: function(xhr, tStatus, errorTh ) {
				$("div#wliu-wait-id[wliu-wait]").trigger("hide");
			},
			success: function(req, tStatus) {
				$("div#wliu-wait-id[wliu-wait]").trigger("hide");
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
	syncRows: function(nimages) {
		this.errorCode 		= nimages.errorCode;
		this.errorMessage 	= nimages.errorMessage;
		this.config = angular.copy(nimages.config);
		this.rows = [];
		for(var ridx in nimages.rows) {
			var theRow 		= nimages.rows[ridx];
			theRow.sn  		= parseInt(nimages.rows[ridx].orderno);
			this.rows.push( new WLIU.IMAGE(theRow) );	
		}
	},
	syncError: function(nimages) {
		this.errorCode 		= nimages.errorCode;
		this.errorMessage 	= nimages.errorMessage;
	}
}
