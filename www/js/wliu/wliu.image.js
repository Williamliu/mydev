/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};
WLIU.FILE = function( opts ) {
	this.file = {
		state: 0,
		error:      {errorCode:0, errorMessage:0},

		key:		0,
		fkey:		0,
		fkey1:		0,
		filter:     "",

		public:		0,
		main:		0,
		status:	 	1,
		title_en:   "",
		title_cn:   "",
		detail_en:  "",
		detail_cn:  "",

		name:		"",
		full:		"",
		short:		"",
		ext:    	"",
		type:		"",
		mime:		"",
		data: 		"",		
	}
	$.extend(this.file, opts);
	return this.file;
}

WLIU.FILEACTION = function( opts ) {
	this.allowType 	= ["PDF", "XLS", "XLSX", "DOC", "DOCX", "TXT"];
	this.file       = new WLIU.FILE({
		key: opts.key,
		fkey: opts.fkey,
		fkey1: opts.fkey1,
		filter: opts.filter		
	});
    if(opts.allowType) this.allowType = opts.allowType;
	var _self 	= this;
	// class constructor
	var _constructor = function() {

	}();
}

WLIU.FILEACTION.prototype = {
	getImage: function() {
		return this.file;
	},
	setImage: function(fileObj) {
		this.file = fileObj;
	},
	fileMime: function() {
		return this.file.mime;
	},
	mimeType: function(dataURL) {
		return this._mimeType(dataURL);
	},

	fromFile: function( file, callback ) {
		this.file.name = file.name.fileName();
		this.file.ext = file.name.extName();
		this.file.short = file.name.fullName();
		this.file.full = file.name;
		this.file.mime = file.type;
		this.file.type = file.name.extName();
		if( this.allowType.indexOf( this.file.type.toUpperCase()) >= 0  ) {
			this._fromBlob(file, callback);
		} else {
			this.file.error.errorCode 		= 1;
			this.file.error.errorMessage 	= "Only image type: [" + this.allowType.join(", ") + "] allow to upload."; 
			if( callback && $.isFunction(callback) ) callback(this.file, this.file.error);
		}
	},
	exportFile: function() {
		window.open(this.file.data);
	},
	exportBlob: function(blob) {
		this._fromBlob(blob, function(dataURL){
			window.open(dataURL);
		});
	},
	exportDataURL: function(dataURL) {
		window.open(dataURL);
	},
	//data:MimeType;base64, + base64_str
	exportBase64: function( base64_str, mimeType) {
		if( mimeType )
			window.open(this.toBase64(base64_str, mimeType));
		else 
			window.open(base64_str);
	},
	exportHTML: function(html) {
		this.exportDataURL( this._string2DataURL(html, "text/html") );
	},
	fromBlob: function(blob, callback) {
		this._fromBlob(file, callback);
	},
	toBlob: function( dataURL ) {
	 	return this._dataURL2Blob(dataURL);
	},
	toDataURL: function( str, mimeType ) {
		return this._string2DataURL(str, mimeType);
	},
	toBase64: function( bstr, mimeType ) {
		return this._base64DataURL(bstr, mimeType);
	},
	/*** private methods ***/
	// file = blob
	// DataURL format: data:mimeType;base64,base64_string 
	_fromBlob: function(file, callback) {
		var _self = this;
		var fs = new FileReader();
		fs.onload = function(ev1) {
			_self.file.data = ev1.target.result;
			if( callback && $.isFunction(callback) ) callback(ev1.target.result);
		}                
		fs.readAsDataURL(file);
	},
	_mimeType: function(dataURL) {
		try {
			var arr = dataURL.split(','); 
			var mime = arr[0].match(/:(.*?);/)[1];
			return mime;
		} catch(err) {
			return "";
		}
	},
	_dataURL2Blob : function( dataURL ) {
		try {
			var arr = dataURL.split(','); 
			var mime = arr[0].match(/:(.*?);/)[1];
			var bstr = atob(arr[1]);
			var n = bstr.length;
			var u8arr = new Uint8Array(n);
			
			while(n--){
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new Blob([u8arr], {type:mime});
		}
		catch(err) {
		}
	},
	_string2DataURL: function(str, mimeType ) {
		// convert string to base64,  then plus mime type = DataURL
		var base64_str = btoa(str);
		return "data:" + mimeType + ";base64," + base64_str;
	},
	_base64DataURL: function(base64_str , mimeType) {
		return "data:" + mimeType + ";base64," + base64_str;
	}
}


WLIU.IMAGE = function( opts ) {
	this.image 		= {
		state: 		0,
		scale:		0,
		error:      {errorCode:0, errorMessage:0},

		key:		0,
		fkey:		0,
		fkey1:		0,
		filter:     "",

		public:		0,
		main:		0,
		status:	 	1,
		title_en:   "",
		title_cn:   "",
		detail_en:  "",
		detail_cn:  "",

		name:		"",
		full:		"",
		short:		"",
		ext:    	"",
		type:		"",
		mime:		"",
		resize:     {
			 origin:	{ ww: 1200, 	hh:1200, 	width:0, height:0, length:0, name:"", size: "", data:"" },
			 thumb: 	{ ww: 60, 		hh:60, 		width:0, height:0, length:0, name:"", size: "", data:"" },
			 tiny: 		{ ww: 120, 		hh:120, 	width:0, height:0, length:0, name:"", size: "", data:"" },
			 small: 	{ ww: 200, 		hh:200, 	width:0, height:0, length:0, name:"", size: "", data:"" },
			 medium: 	{ ww: 400, 		hh:400, 	width:0, height:0, length:0, name:"", size: "", data:"" },
			 large:		{ ww: 800, 		hh:800, 	width:0, height:0, length:0, name:"", size: "", data:"" }
		}
	};
	$.extend(this.image, opts);
	return this.image;
}

WLIU.IMAGELIST = function( opts ) {
	this.sc			= null;

	this.fkey 		= 0;
	this.fkey1 		= 0;
	this.filter		= "";

	this.lang       = opts.lang?opts.lan:"cn";
	this.scope  	= opts.scope?opts.scope:"";
	this.url		= opts.url?opts.url:"";
	
	this.wait		= opts.wait?opts.wait:"";
	this.rowerror   = opts.rowerror?opts.rowerror:"";
	this.taberror 	= opts.taberror?opts.taberror:"";
	this.tooltip 	= opts.tooltip?opts.tooltip:"";
	this.tips 		= opts.tips?opts.tips:"";
	
	this._rindex 	= -1; // private for rowno
	this.action		= "get";
	this.error		= {errorCode:0, errorMessage:""};  // table level error : action rights 
	this.rights 	= {view:1, save:0, cancel:1, clear:1, delete:0, add:1, detail:1, output:0, print:1};
	this.navi		= { paging:1, pageno: 0, pagesize:20, pagetotal:0, recordtotal:0, loading:0, orderby: "", sortby:"" };
	this.filters 	= [];
	this.rows		= [];  
	this.callback   = {ajaxBefore: null, ajaxAfter: null, ajaxComplete: null, ajaxError: null,  ajaxSuccess: null};
	
	$.extend(this.rights, opts.rights);
	$.extend(this.cols, opts.cols);
	$.extend(this.navi, opts.navi);
	$.extend(this.filters, opts.filters);
	$.extend(this.rows, opts.rows);
	$.extend(this.callback, opts.callback);
}

WLIU.IMAGELIST.prototype = {
	setScope: function(p_scope) {
		p_scope.table = this;
		this.sc = p_scope;
	},
	rowno: function(p_ridx) {
		if(p_ridx!=undefined) {
			if(p_ridx<0) this._rindex = -1;
			if(p_ridx >= this.rows.length) this._rindex = this.rows.length - 1;
			if(p_ridx>=0 && p_ridx < this.rows.length) this._rindex = p_ridx;
			return this._rindex;
		} else {
			return this._rindex;
		}
	},
	
}


// Table Object
WLIU.IMAGEACTION = function( opts ) {
	this.allowType 	= ["BMP", "JPG", "JPEG", "PNG", "ICO", "GIF"];
	this.scale 		= opts.scale?opts.scale:0;
	this.view  		= opts.view?opts.view:"medium";  

	this.image          = new WLIU.IMAGE({
		key: opts.key,
		fkey: opts.fkey,
		fkey1: opts.fkey1,
		filter: opts.filter		
	});
	if( opts.resize ) 		this.image.resize = opts.resize;
	if( opts.allowType ) 	this.allowType = opts.allowType;
	

	var _self 	= this;
	// class constructor
	this._fromImage = null;
	opts.allowType = this.allowType;
	var _constructor = function() {
		_self.FILEACT = new WLIU.FILEACTION(opts);
	}();
}

WLIU.IMAGEACTION.prototype = {
	getImage: function() {
		return this.image;
	},
	setImage: function(imgObj) {
		this.image = imgObj;
	},
	fromFile: function(file, callback) {
		var _self = this;
		_self.FILEACT.fromFile(file, function(dataURL, error){
			if( error && error.errorCode == 1) {
				_self.image.error.errorCode 	= _self.FILEACT.file.error.errorCode;
				_self.image.error.errorMessage 	= _self.FILEACT.file.error.errorMessage;
				if( callback && $.isFunction(callback) ) callback(_self.image, _self.image.error);
			} else {
				_self.image.name = _self.FILEACT.file.name;
				_self.image.ext = _self.FILEACT.file.ext;
				_self.image.full = _self.FILEACT.file.full;
				_self.image.short = _self.FILEACT.file.short;
				_self.image.mime = _self.FILEACT.file.mime;
				_self.image.type = _self.FILEACT.file.type;

				_self._imageDataURL(dataURL, callback);
			}
		});
	},
	fromImage: function(img, callback) {
		this.image.full 	= this.image.full?this.image.full:img.name.fullName(32);
		this.image.name 	= this.image.name?this.image.name:img.name.fileName();
		this.image.ext  	= this.image.ext?this.image.ext:this.image.full.extName();
		this.image.short 	= this.image.short?this.image.short:this.image.full.fullName();
		this.image.type 	= this.image.type?this.image.type:this.image.ext.toUpperCase();
		this._imageDataURL(img.src, callback);
	},
	rotate: function(callback) {
		this._rotateAll(callback);
	},
	draw: function(canvas, rname, callback) {
		if(!rname) rname = this.view;
		var _self = this;
		var ctx = canvas.getContext("2d");
		this._clearCanvas(canvas);

		var t_img = new Image();
		t_img.onload = function() {
			canvas.width 	= t_img.width;
			canvas.height 	= t_img.height;
			ctx.drawImage(t_img,0,0, t_img.width, t_img.height, 0, 0, canvas.width, canvas.height); 
			if( callback && $.isFunction(callback) && _self.view==rname ) callback(this.image.resize[rname]);
		}
		t_img.src = this.image.resize[rname].data;		
	},
	crop: function(ww,hh,x,y,nw,nh, callback) {
		this._cropLarge(ww,hh,x,y,nw,nh, callback);
	},
	cropDiv: function( frame_div, crop_div, callback ) {
        console.log( frame_div.width() + " : " + frame_div.height());
        console.log( crop_div.outerWidth() + " : " + crop_div.outerHeight());
        console.log(crop_div.position() );

		this._cropLarge(frame_div.width(), frame_div.height(), crop_div.position().left, crop_div.position().top, crop_div.outerWidth(), crop_div.outerHeight(), callback );
	},
	cropDivReset: function( crop_div ) {
		crop_div.css({left: "5%", top:"5%", width:"90%", height:"90%"});
	},
	cropReset: function(callback) {
		this._cropReset(callback);
	},
	export: function(rname) {
		if(!rname) rname = this.view;
		if( this.image.resize[rname].data !="" )
			window.open( this.image.resize[rname].data );
	},
	exportBlob: function(blob) {
		this.FILEACT.exportBlob(blob);
	},
	exportBase64: function( bstr, mimeType ) {
		this.FILEACT.exportBase64(bstr, mimeType);
	},
	exportHTML: function(html) {
		this.FILEACT.exportHTML(html);
	},
	imageDataURL: function(rname) {
		if(!rname) rname = this.view;
		return  this.image.resize[rname].data;
	},
	imageBlob: function(rname) {
		return this.FILEACT.toBlob(this.imageDataURL(rname));
	},

	/*** private methods ***/
	_imageDataURL: function(dataURL, callback) {
		var _self = this;
		var t_img = new Image();
		t_img.onload = function() {
			_self._initImage(t_img, callback);
		}
		t_img.src = dataURL;
	},

	_initImage:  function(t_img, callback) {
		var _self = this;

		var originImg = this.image.resize.origin;
		var canvas 	= document.createElement("canvas");
		var ctx 	= canvas.getContext("2d");
		var ratio_ww = 1;
		var ratio_hh = 1;
		if( _self.scale ) {
			if(originImg.ww > 0 ) ratio_ww = originImg.ww / t_img.width;
			if(originImg.hh > 0 ) ratio_hh = originImg.hh / t_img.height;
		} else {
			if(originImg.ww > 0 && t_img.width > originImg.ww) ratio_ww = originImg.ww / t_img.width;
			if(originImg.hh > 0 && t_img.height > originImg.hh) ratio_hh = originImg.hh / t_img.height;
		}
		var ratio = Math.min(ratio_ww, ratio_hh);
		canvas.width 	= t_img.width * ratio;
		canvas.height 	= t_img.height * ratio;
		ctx.drawImage(t_img,0,0, t_img.width, t_img.height, 0, 0, canvas.width, canvas.height); 
		
		var imgType = _self.FILEACT.mimeType(t_img.src)?_self.FILEACT.mimeType(t_img.src):("image/"+_self.image.ext.toLowerCase());
		var imgDataURL = canvas.toDataURL( imgType );
		
		originImg.width 	= canvas.width;
		originImg.height 	= canvas.height;
		originImg.data 		= imgDataURL;
		originImg.length 	= imgDataURL.length;
		originImg.size	    = originImg.length.toSize();
		originImg.name	    = _self.image.key + "_origin." + _self.image.ext;
		
		_self.image.mime 	= imgType;
		canvas = null;
		_self._resizeAll(callback);
		if( callback && $.isFunction(callback) && _self.view=="origin" ) callback(originImg);
	},
	_cropLarge: function(ww, hh, x, y, nw, nh, callback) {
		console.log("crop Large:[" + ww + ":" + hh + "][" + x + ":" + y +"][" + nw + ":" + nh + "]" );
		var _self = this;
		var largeImg = this.image.resize.large;
		if( largeImg.data != "") {
			console.log("crop here");
			var t_img = new Image();
			t_img.onload = function() {
				var ratio_ww = 1;
				var ratio_hh = 1;
				ratio_ww = t_img.width / ww;
				ratio_hh = t_img.height / hh;

				x 	= x * ratio_ww;
				y 	= y * ratio_hh;
				nw 	= nw * ratio_ww;
				nh  = nh * ratio_hh;
				if(x<0) x = 0;
				if(y<0) y = 0;
				if(x+nw>t_img.width) nw = t_img.width - x;
				if(y+nh>t_img.height) nh = t_img.height - y;

				var canvas 	= document.createElement("canvas");
				var ctx 	= canvas.getContext("2d");
				canvas.width 	= nw;
				canvas.height	= nh;
				
				ctx.drawImage(t_img, x, y, nw, nh, 0, 0, canvas.width, canvas.height); 

				var imgType = _self.FILEACT.mimeType(t_img.src)?_self.FILEACT.mimeType(t_img.src):("image/"+_self.image.ext.toLowerCase());
				var imgDataURL = canvas.toDataURL( imgType );

				largeImg.width 		= canvas.width;
				largeImg.height 	= canvas.height;
				largeImg.data 		= imgDataURL;
				largeImg.length 	= imgDataURL.length;
				largeImg.size	    = largeImg.length.toSize();
				largeImg.name	    = _self.image.key + "_origin." + _self.image.ext;


				if( callback && $.isFunction(callback) && _self.view=="large" ) callback(largeImg);
				
				_self._cropAll(callback);
			}
			t_img.src = largeImg.data;
		}

	},
	_cropAll: function(callback) {
		var _self = this;
		var largeImg = this.image.resize.large;

		var resizeImgs = this.image.resize;
		for(var rname in resizeImgs) {
			if(rname!="origin" && rname!="large") this._resizeImage(largeImg, resizeImgs[rname], rname, callback);
		}
	},
	_cropReset: function(callback) {
		this._resizeAll(callback);
	},
	_rotateAll: function(callback) {
		for(var rname in this.image.resize) {
			if( rname !="origin" )	this._rotateImage( this.image.resize[rname], rname, callback );
		}
	},
	_rotateImage : function(resizeImg, rname, callback) {
		var _self 	= this;
		var degree 	= 90;
		var t_img 	= new Image();
		t_img.onload = function() {
			var canvas 	= document.createElement("canvas");
			var ctx 	= canvas.getContext("2d");
			// important: different 180 and 90
			if( degree % 180 == 0 ) {
				canvas.width    = t_img.width;
				canvas.height   = t_img.height;
			} else {
				canvas.width    = t_img.height;
				canvas.height   = t_img.width;
			}
			ctx.translate( canvas.width/2, canvas.height/2 );
			ctx.rotate(degree*Math.PI/180);
			ctx.drawImage(t_img, - t_img.width/2, -t_img.height/2);
			var imgType  		= _self.FILEACT.mimeType(t_img.src);
			var imgDataURL 		= canvas.toDataURL( imgType );
			resizeImg.data 		= imgDataURL;
			resizeImg.width 	= canvas.width;
			resizeImg.height 	= canvas.height;
			resizeImg.length 	= imgDataURL.length;
			resizeImg.size 		= resizeImg.length.toSize();
			
			canvas = null;

			// important :  img is old img,  imgDataURL is transform image
			if( callback && $.isFunction(callback) && _self.view==rname ) callback(resizeImg);
		}
		t_img.src = resizeImg.data;
	},

	// resize base on origin image which alreay resize to 1200 * 1200 from selected image 
	_resizeAll: function(callback) {
		var _self = this;
		var originImg = this.image.resize.origin;

		var resizeImgs = this.image.resize;
		for(var rname in resizeImgs) {
			if(rname!="origin") {
				this._resizeImage(originImg, resizeImgs[rname], rname, callback);
			} 
		}
	},
	_resizeImage: function(originImg, resizeImg, rname, callback) {
		var _self = this;
		var t_img = new Image();
		t_img.onload = function() {
			var canvas 	= document.createElement("canvas");
			var ctx 	= canvas.getContext("2d");
			var ratio_ww = 1;
			var ratio_hh = 1;
			if( _self.scale ) {
				if(resizeImg.ww > 0 ) ratio_ww = resizeImg.ww / t_img.width;
				if(resizeImg.hh > 0 ) ratio_hh = resizeImg.hh / t_img.height;
			} else {
				if(resizeImg.ww > 0 && t_img.width > resizeImg.ww) ratio_ww = resizeImg.ww / t_img.width;
				if(resizeImg.hh > 0 && t_img.height > resizeImg.hh) ratio_hh = resizeImg.hh / t_img.height;
			}
			var ratio = Math.min(ratio_ww, ratio_hh);
			canvas.width 	= t_img.width * ratio;
			canvas.height 	= t_img.height * ratio;
			ctx.drawImage(t_img,0,0, t_img.width, t_img.height, 0, 0, canvas.width, canvas.height); 
			
			var imgType = _self.FILEACT.mimeType(t_img.src);
			var imgDataURL = canvas.toDataURL( imgType );
			
			resizeImg.width 	= canvas.width;
			resizeImg.height 	= canvas.height;
			resizeImg.data 		= imgDataURL;
			resizeImg.length 	= imgDataURL.length;
			resizeImg.size	    = resizeImg.length.toSize();
			resizeImg.name	    = _self.image.key + "_" + rname + "." + _self.image.ext;
			
 			if( callback && $.isFunction(callback) && _self.view==rname ) callback(resizeImg);
 			canvas = null;
		}
		t_img.src = originImg.data;
	},
	_clearCanvas: function(canvas) {
		var ctx     = canvas.getContext("2d");
		//important: clear canvas code,  must reset transform to clear entire canvas. perfect solution 
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
}