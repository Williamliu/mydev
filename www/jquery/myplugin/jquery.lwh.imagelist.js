var LWH = LWH || {};
LWH.ImageList = function(opts) {
	$.extend(this.settings , opts);
	this.imgList		= [];
	this.sn				= 0;
	this.imgFrame 		= null;
	this.imgView 		= null;
	var _self 			= this;


	this.ajaxCall = function() {
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
				  _self.initImage();
			  },
			  type: "post",
			  url: "ajax/wmliu_image_list.php"
		  });
	}


	// class constructor
	var _constructor = function() {
		var imgFrame_html = '';
		
		// horizontal:  h mode only set ww with nowrap.  hv mode only set ww with white-space: normal .  forget hh
		// in h or hv mode:  container width  ww = (imgww + 10) * N 

		// veritcal:    v mode only set height to hh.   forget width , auto fit width with imgww.   
		// in v mode :  container height  hh = what you want, because height of image autofit.
		switch( _self.settings.orient ) {
			case "h":
				imgFrame_html = [
					'<div id="lwhImageList-' + _self.settings.name + '" class="lwhImageList lwhImageList-h' + (_self.settings.border?' lwhImageList-border':'') + '">',
						'<div class="lwhImageList-content"></div>',
					'</div>'					
				].join("");
				_self.imgFrame = $(_self.settings.container).append(imgFrame_html)[0].lastChild;
				if(_self.settings.ww > 0) $(_self.imgFrame).width(_self.settings.ww);
				break;
			case "v":
				imgFrame_html = [
					'<div id="lwhImageList-' + _self.settings.name + '" class="lwhImageList lwhImageList-v' + (_self.settings.border?' lwhImageList-border':'') + '">',
						'<div class="lwhImageList-content"></div>',
					'</div>'					
				].join("");
				_self.imgFrame = $(_self.settings.container).append(imgFrame_html)[0].lastChild;
				if(_self.settings.hh > 0) $(_self.imgFrame).height(_self.settings.hh);
				break;
			case "hv":
				imgFrame_html = [
					'<div id="lwhImageList-' + _self.settings.name + '" class="lwhImageList lwhImageList-hv' + (_self.settings.border?' lwhImageList-border':'') + '">',
						'<div class="lwhImageList-content"></div>',
					'</div>'					
				].join("");
				_self.imgFrame = $(_self.settings.container).append(imgFrame_html)[0].lastChild;
				if(_self.settings.ww > 0) $(_self.imgFrame).width(_self.settings.ww);
				break;	
		}
		


        var imgView_html = [
			'<div id="lwhWrapBox-' + _self.settings.name + '" class="lwhWrapBox">',
				'<div class="lwhWrapBox-content">',
				'</div>',
			'</div>',
        ].join('');


		_self.imgView = $("body").append(imgView_html)[0].lastChild;
		$(_self.imgView).lwhWrapBox();

	}();

}

LWH.ImageList.prototype = {
	settings : {
		name:		"",
		lang:		"cn",
		mode:		"small",
		view:		"thumb",
		noimg:		1,
		filter:		"",
		ref_id:		"",
		
		tips:		true,

		container:	"",
		
		ww:			0,
		hh:			0,
		imgww:		100,
		imghh:		100,
		border:		0,
		orient:		"h",  // h = horizontal; v = vertical 
		
		click: 		null
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
		this.sn = 0;
		this.createImage();
	},
	
	clear: function() {
		var _self = this;
		_self.imgList = [];
		_self.sn 		 = 0;
		$(".lwhImageList-content", $(_self.imgFrame)).empty();
	},
	
	append: function(imgObj) {
		this.imgList.push(imgObj);
		this.sn = this.imgList.length-1;
		this.createImage();
	},
	
	view: function(imgid) {
			wait_show();
			var _self = this;
			//$(".lwhWrapBox-content", $(_self.imgView)).empty();
			var sn  = ArraySearch(_self.imgList, "id", imgid);
			var view_url 	= _self.imgList[sn].raw[_self.settings.mode]; //'ajax/wmliu_getimage.php?mode=' + _self.settings.mode + '&imgid=' +imgid;
			var viewImg 	= new Image();
			viewImg.src 	= view_url;
			viewImg.title 	= _self.imgList[sn].title;
			viewImg.detail	= _self.imgList[sn].detail;
			
			viewImg.onload = function() {
				var rate_ww = 1;
				var rate_hh = 1;
				var maxww = $(window).width() * 0.8;
				var maxhh = $(window).height() * 0.8;
				if(maxww>0 && this.width > maxww) rate_ww = maxww / this.width;
				if(maxhh>0 && this.height > maxhh) rate_hh = maxhh / this.height;
				var rate = Math.min(rate_ww, rate_hh);
				if(rate < 1) {
					if(rate_ww < rate_hh) 
						this.width = maxww;
					else 
						this.height = maxhh;
				}
				
				//$(".lwhWrapBox-thumb", $(_self.imgView)).width(this.width);
				
				$(".lwhWrapBox-content", $(_self.imgView)).empty();
				$(".lwhWrapBox-content", $(_self.imgView)).append(viewImg);
				if( viewImg.title 	!=""  && _self.settings.tips) $(".lwhWrapBox-content", $(_self.imgView)).append('<div class="lwhImageList-subject">' + viewImg.title + '</div>');
				if( viewImg.detail 	!=""  && _self.settings.tips) $(".lwhWrapBox-content", $(_self.imgView)).append('<div class="lwhImageList-detail">' + viewImg.detail + '</div>');
				
				wait_hide();				
				$(_self.imgView).wrapBoxShow();
			}
	},

	initImage: function() {
		var _self = this;
	  	_self.sn 		 	= 0;
		$(".lwhImageList-content", $(_self.imgFrame)).empty();
		for(var i = 0; i < _self.imgList.length; i++) {
			_self.sn = i;
			_self.createImage();	
		}
	},
	
	createImage: function() {
			var _self = this;
			if( _self.sn < 0 ) _self.sn = 0;
			if( _self.sn > _self.imgList.length - 1 ) _self.sn = _self.imgList.length - 1;
			var imgid = _self.imgList[_self.sn].id; 
			if( $("img[imgid='" + imgid + "']",$(_self.imgFrame)).length > 0 ) return; 
			
			 
			var img_url = _self.imgList[_self.sn].raw[_self.settings.mode];  //'ajax/wmliu_getimage.php?mode=' + mode + '&imgid=' + _self.idList[_self.sn];
			var img 	= new Image();
			img.src 	= img_url;
			img.sn		= _self.sn;
			img.imgid	= _self.imgList[_self.sn].id;
			
			img.onload = function() {

				var rate_ww = 1;
				var rate_hh = 1;

				if(_self.settings.imgww >0 && img.width > 	_self.settings.imgww ) rate_ww = _self.settings.imgww / img.width;
				if(_self.settings.imghh >0 && img.height > 	_self.settings.imghh ) rate_hh = _self.settings.imghh / img.height;

				var img_rate = img.height / img.width;

				var rate = Math.min(rate_ww, rate_hh);
				if(rate < 1) {
					if(rate_ww < rate_hh) {
						img.width 	= _self.settings.imgww;
						img.height 	= _self.settings.imgww  * img_rate;
					} else { 
						img.height 	= _self.settings.imghh;
						img.width	= _self.settings.imghh / img_rate;
					}
					
				}
				
				var imgCon = null;
				if( _self.settings.orient != "v" )
					imgCon = $("div.lwhImageList-content", $(_self.imgFrame)).append('<div class="lwhImageList-box" sn="' + img.sn + '" imgid="' + img.imgid + '"></div>')[0].lastChild;
				else 
					imgCon = $("div.lwhImageList-content", $(_self.imgFrame)).append('<div class="lwhImageList-box" sn="' + img.sn + '" imgid="' + img.imgid + '"></div>')[0].lastChild;
				
				
				var imgbox = $(imgCon).append('<div class="lwhImageList-image"></div>')[0].lastChild;
				if(_self.settings.orient!="v") $(imgbox).width(_self.settings.imgww).height(_self.settings.imghh);
				
				var imgel = $(imgbox).append(img)[0].lastChild;
				$(imgel).attr("sn", 	img.sn);
				$(imgel).attr("imgid", 	img.imgid);
			}




			// click on image to image viewer
			img.onclick = function() {
				_self.view(img.imgid);
				
				var sn = ArraySearch(_self.imgList, "id", img.imgid);
				if( _self.settings.click ) if($.isFunction(_self.settings.click)) _self.settings.click(_self.imgList[sn]);
			}
			// end of img viewer

	}
		
}
