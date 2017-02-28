var WLIU = WLIU || {};
// Table Object
WLIU.IMAGELIST = function( opts ) {
	this.sc			= null;

	this.lang       = opts.lang?opts.lan:"cn";
	//this.scope  	= opts.scope?opts.scope:""; // for secure reason, scope provide by server side, client not allow to change
	this.url		= opts.url?opts.url:"";
	this.wait		= opts.wait?opts.wait:"";
	this.autotip 	= opts.autotip?opts.autotip:"";

	this.action		= "get";
	this.keys 		= {};
	this.config     = {
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
	getImages: function(callback) {
		this.error.errorCode 	= 0;
		this.error.errorMessage = "";
		var nimages = {};
		nimages.action 	= "get";
		nimages.keys  	= this.keys;
		nimages.config  = this.config;
		nimages.error 	= this.error;
		nimages.images = [];
		this.ajaxCall(nimages, callback);
	},
	ajaxCall: function(nimages, callback) {
		var _self = this;
		if( _self.wait ) $(_self.wait).trigger("show");
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
				console.log(req);
			},
			type: "post",
			url: _self.url
		});
	}

}
