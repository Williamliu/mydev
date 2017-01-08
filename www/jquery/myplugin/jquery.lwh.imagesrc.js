var LWH = LWH || {};
LWH.ImageSRC = function(opts) {
	$.extend(this.settings , opts);
	this.imgList		= [];
	this.imgObj			= {};
	var _self 			= this;

	// class constructor
	var _constructor = function() {
	}();

}

LWH.ImageSRC.prototype = {
	settings : {
		name:		"",
		lang:		"cn",
		mode:		"small",
		filter:		"",
		ref_id:		"",
		imgid:		"",
		noimg:		1,
		
		tips:		true,
		ajax:		true, 
		cache:		true,
		
		imgel:		"",
		
		imgww:		0,
		imghh:		0,
		
		before:		null,
		after:		null,
		append:		null,
		setlist:	null,
		clear:		null,
		click:		null
	},
	
	filter : function(v) {
		if(v) {
			this.settings.filter = v;
			this.getMain();
		}
		return this.settings.filter;
	},

	refid:	function(v) {
		if(v) { 
			this.settings.ref_id = v;
			this.getMain();
		}
		return this.settings.ref_id;
	},
	
	imgid:	function(v) {
		if(v) { 
			this.settings.imgid = v;
			this.getImage();
		}
		return this.settings.imgid;
	},
	
	imgobj: function(v) {
		if(v) {
			this.imgObj = v;
			this.settings.imgid = v.id;
			if( this.settings.ajax && this.settings.cache ) this.imgList.push(v); 
		} 
		this.initImage();
		return this.imgObj;
	},
	
	set: function(vo) {
		var ff = false;
		if(vo.imgid) { 
			this.settings.imgid = vo.imgid;
			ff = true;
		}
		
		if(ff) this.getImage();
	},

	setMain: function(vo) {
		var ff = false;
		if(vo.filter) {
			this.settings.filter = vo.filter;
			ff = true;
		}

		if(vo.ref_id) { 
			this.settings.ref_id = vo.ref_id;
			ff = true;
		}
		
		if(ff) this.getMain();
	},
	
	setList: function(oList) {
		this.imgList = oList;
		if( this.settings.setlist ) if( $.isFunction(this.settings.setlist) ) this.settings.setlist(this.settings, this.imgList);		
	},
	
	clear: function() {
		this.imgList = [];
		this.imgObj  = {};
		$(this.settings.imgel).attr("src", "");
		if( this.settings.clear ) if( $.isFunction(this.settings.clear) ) this.settings.clear(this.settings, this.imgList);		
	},
	
	initImage: function() {
		var _self = this;
		var imgEL 	= $(this.settings.imgel)[0];
		if( imgEL ) {
			$(this.settings.imgel).removeAttr("width").removeAttr("height");
			imgEL.name 	= this.settings.name;
			if(this.settings.ajax) {
				if(this.imgObj.raw) {
					if( this.imgObj.raw[this.settings.mode] ) {
						imgEL.src = this.imgObj.raw[this.settings.mode];
						if(this.settings.tips) imgEL.title = this.imgObj.title;
					} else {
						if(this.imgObj.id>0) 
							imgEL.src = 'ajax/wmliu_getimage.php?mode='+ this.settings.mode +'&imgid=' + this.settings.imgid;
						else 
							imgEL.src = '';
					}
				} else {
					if(this.imgObj.id>0) 
						imgEL.src = 'ajax/wmliu_getimage.php?mode='+ this.settings.mode +'&imgid=' + this.settings.imgid;
					else 
						imgEL.src = '';
				}
			} else {
				if(this.settings.imgid>0) 
					imgEL.src = 'ajax/wmliu_getimage.php?mode='+ this.settings.mode +'&imgid=' + this.settings.imgid;
				else 
					imgEL.src = '';
			}
			
			imgEL.onload = function() {
				var rate_ww = 1;
				var rate_hh = 1;
				var maxww = _self.settings.imgww;
				var maxhh = _self.settings.imghh;
				if(maxww>0 && this.width > maxww) rate_ww = maxww / this.width;
				if(maxhh>0 && this.height > maxhh) rate_hh = maxhh / this.height;
				var rate = Math.min(rate_ww, rate_hh);
				if(rate < 1) {
					if(rate_ww < rate_hh) 
						this.width = maxww;
					else 
						this.height = maxhh;
				}
			}
			
			if(_self.settings.click) if( $.isFunction(_self.settings.click) ) {
				imgEL.onclick = function() {
					_self.settings.click(_self.settings.imgid);
				}
			}
			 
			// important:  css     img[src=''] { display:none; }   to hide broken image
			imgEL.onerror = function() {
				imgEL.src = "";
			}
		}
	},
	
	getImage: function() {
		$(this.settings.imgel).attr("src", "");
		
		if( this.settings.ajax ) {
			var _self = this;
			if( this.settings.cache ) {
				var sn = ArraySearch(this.imgList, "id", this.settings.imgid);
				if( sn >= 0) {
					this.imgObj = this.imgList[sn];
					this.initImage();
					return;
				}
			} 
			
						
			if( _self.settings.before ) if( $.isFunction(_self.settings.before) ) _self.settings.before(_self.settings);
			var schema = {};
			schema.lang 	= _self.settings.lang;
			schema.filter 	= _self.settings.filter;
			schema.ref_id 	= _self.settings.ref_id;
			schema.imgid 	= _self.settings.imgid;
			schema.mode		= _self.settings.mode;
			schema.view 	= _self.settings.view;
			schema.noimg	= _self.settings.noimg;
			
			$.ajax({
				data: {
					schema: schema
				},
				dataType: "json",  
				error: function(xhr, tStatus, errorTh ) {
					//alert("Error (wmliu_image_source.php): " + xhr.responseText + "\nStatus: " + tStatus);
				},
				success: function(req, tStatus) {
					_self.imgObj = req.data.imgObject;
					_self.initImage();				
					if(_self.settings.ajax && _self.settings.cache) _self.imgList.push(_self.imgObj);
					if( _self.settings.after ) if( $.isFunction(_self.settings.after) ) _self.settings.after(_self.settings, _self.imgList);
				},
				type: "post",
				url: "ajax/wmliu_image_source.php"
			});
			
		} else {
			this.initImage();				
		}
	},


	getMain: function() {
		var _self = this;
		if( _self.settings.before ) if( $.isFunction(_self.settings.before) ) _self.settings.before(_self.settings);

		var schema = {};
		schema.filter 	= _self.settings.filter;
		schema.ref_id 	= _self.settings.ref_id;
		
		$.ajax({
			data: {
				schema: schema
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				alert("Error (wmliu_image_mainid.php): " + xhr.responseText + "\nStatus: " + tStatus);
			},
			success: function(req, tStatus) {
				_self.settings.imgid = req.data.mainid;
				_self.getImage();

				if( _self.settings.after ) if( $.isFunction(_self.settings.after) ) _self.settings.after(_self.settings, _self.imgList);
			},
			type: "post",
			url: "ajax/wmliu_image_mainid.php"
		});
	}

}
