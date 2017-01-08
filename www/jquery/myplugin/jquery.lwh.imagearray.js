var LWH = LWH || {};
LWH.ImageArray = function(opts) {
	$.extend(this.settings , opts);
	this.imgList		= [];
	var _self 			= this;


	this.ajaxCall = function() {

		  if( _self.settings.before ) if( $.isFunction(_self.settings.before) ) _self.settings.before(_self.settings);

		  var schema = {};
		  schema.lang 	= _self.settings.lang;
		  schema.filter = _self.settings.filter;
		  schema.ref_id = _self.settings.ref_id;
		  schema.mode	= _self.settings.mode;
		  schema.view 	= _self.settings.view;
		  schema.noimg	= _self.settings.noimg;
		   
		  $.ajax({
			  data: {
					schema: schema
			  },
			  dataType: "json",  
			  error: function(xhr, tStatus, errorTh ) {
				  //alert("Error (wmliu_image_list.php): " + xhr.responseText + "\nStatus: " + tStatus);
			  },
			  success: function(req, tStatus) {
				  _self.imgList = req.data.imgList;
				  if( _self.settings.after ) if( $.isFunction(_self.settings.after) ) _self.settings.after(_self.settings, _self.imgList);
			  },
			  type: "post",
			  url: "ajax/wmliu_image_list.php"
		  });
	}


	// class constructor
	var _constructor = function() {
	}();

}

LWH.ImageArray.prototype = {
	settings : {
		name:		"",
		lang:		"cn",
		mode:		"medium",
		view:		"tiny",
		filter:		"",
		ref_id:		"",
		noimg:		1,
		
		before:		null,
		after:		null,
		append:		null,
		setlist:	null,
		clear:		null,
		fresh:		null
	},
	
	filter : function(v) {
		if(v) {
			this.settings.filter = v;
			this.ajaxCall();
		}
		return this.settings.filter;
	},
	
	refid:	function(v) {
		if(v) { 
			this.settings.ref_id = v;
			this.ajaxCall();
		}
		return this.settings.ref_id;
	},
	
	set: function(vo) {
		var ff = false;
		if(vo.filter) {
			this.settings.filter = vo.filter;
			ff = true;
		}
		if(vo.ref_id) { 
			this.settings.ref_id = vo.ref_id;
			ff = true;
		}
		
		if(ff) this.ajaxCall();
	},
	
	setList: function(oList) {
		this.imgList = oList;
		if( this.settings.setlist ) if( $.isFunction(this.settings.setlist) ) this.settings.setlist(this.settings, this.imgList);		
	},
	
	clear: function() {
		this.imgList = [];
		if( this.settings.clear ) if( $.isFunction(this.settings.clear) ) this.settings.clear(this.settings, this.imgList);		
	},
	
	fresh: function() {
		this.imgList = [];
		if( this.settings.fresh ) if( $.isFunction(this.settings.fresh) ) this.settings.fresh(this.settings, this.imgList);		
		this.ajaxCall();
	},
	
	append: function(imgObj) {
		this.imgList.push(imgObj);
		if( this.settings.append ) if( $.isFunction(this.settings.append) ) this.settings.append(this.settings, this.imgList, imgObj);		
	}
}
