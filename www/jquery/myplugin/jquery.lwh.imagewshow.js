/******************************************************************/
/*  Condition: jquery.bxslider.js  jquery.bxslider.csss           */
/******************************************************************/

var LWH = LWH || {};
LWH.ImageWShow = function(opts) {
	$.extend(this.settings , opts);
	this.imgList		= [];
	this.imgFrame		= null;
	this.thumbFrame 	= null;
	this.slider			= null;
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
				  _self._init();
				  
				  if( _self.settings.after ) if( $.isFunction(_self.settings.after) ) _self.settings.after(_self.settings, _self.imgList);
			  },
			  type: "post",
			  url: "ajax/wmliu_image_list.php"
		  });
	}


	// class constructor
	var _constructor = function() {

		var slider_html = [
			'<ul id="lwhWrapBox-' + _self.settings.name + '" class="bxslider">',
			'</ul>'
		].join("");
	
		_self.imgFrame = $(_self.settings.container).append(slider_html)[0].lastChild;
		$(_self.imgFrame).disableSelection();

		_self.slider = $(_self.imgFrame).bxSlider({
			  mode: 	_self.settings.fly,
			  auto:		true,
			  pause:	_self.settings.speed,
			  speed:	_self.settings.delay,
			  controls: false,
			  adaptiveHeight: true,
			  captions: true,
			  onSlideAfter: function() {
			  },
			  onSliderLoad: function(){
				  $(_self.settings.container).css("visibility", "hidden");
			  },
			  
			  imgList: [],
			  view:	   _self.settings.view
		});

		if(!_self.settings.border) $(".bx-viewport", $(_self.settings.container)).css({"border":"0px", "left":"0px"});
			
	}();

}

LWH.ImageWShow.prototype = {
	settings : {
		name:		"",
		lang:		"cn",
		mode:		"medium",
		view:		"tiny",
		filter:		"",
		ref_id:		"",

		tips:		true,
		noimg:		1,
		
		container:	"",

		fly:		"horizontal", // fade ;  horizontal ; vertical
		speed:		4000,
		controls: 	false,
		border:		false,
		delay:		800,

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
		this._init();
		if( this.settings.setlist ) if( $.isFunction(this.settings.setlist) ) this.settings.setlist(this.settings, this.imgList);		
	},
	
	clear: function() {
		this.imgList = [];
		this._init();
		if( this.settings.clear ) if( $.isFunction(this.settings.clear) ) this.settings.clear(this.settings, this.imgList);		
	},
	
	fresh: function() {
		this.imgList = [];
		if( this.settings.fresh ) if( $.isFunction(this.settings.fresh) ) this.settings.fresh(this.settings, this.imgList);		
		this.ajaxCall();
	},
	
	append: function(imgObj) {
		this.imgList.push(imgObj);
		this._addTo(imgObj);
		
		if( this.settings.append ) if( $.isFunction(this.settings.append) ) this.settings.append(this.settings, this.imgList, imgObj);		
	},
	
	_init:  function() {
		var _self = this;
		$(this.imgFrame).empty();
		if(this.imgList.length > 0) {
			for(var i = 0; i < this.imgList.length-1; i++) {
				var item_img = '';
				if(_self.settings.tips) 
					item_img = '<li><img src="' + this.imgList[i].raw[this.settings.mode] + '" subject="' + this.imgList[i].title + '" title="' + this.imgList[i].detail + '" /></li>';
				else 
					item_img = '<li><img src="' + this.imgList[i].raw[this.settings.mode] + '" subject="" title="" /></li>';

				$(this.imgFrame).append(item_img);
			}
			
			this.slider.reloadSlider({
				  mode: 	_self.settings.fly,
				  auto:		true,
				  pause:	_self.settings.speed,
				  speed:	_self.settings.delay,
				  controls: _self.settings.controls,
				  adaptiveHeight: true,
				  captions: true,
				  onSlideAfter: function() {
					  _self.slider.startAuto();
				  },
				  onSliderLoad: function(){
					  $(_self.settings.container).css("visibility", "visible");
					  _self.slider.startAuto();
				  },
				  imgList: _self.imgList,
				  view:	   _self.settings.view
				  
			});
			if(!_self.settings.border) $(".bx-viewport", $(_self.settings.container)).css({"border":"0px", "left":"0px"});

			
		} else {
			this.slider.reloadSlider({
				controls:		false,					
				onSliderLoad: 	function(){
					_self.slider.stopAuto();
					$(_self.settings.container).css("visibility", "hidden");
				},
				imgList: [],
				view:	 _self.settings.view
			});
		}
	
	},
	
	_addTo: function(imgObj) {
		var _self = this;

		var item_image = '<li><img src="' + imgObj.raw[this.settings.mode] + '" subject="' + imgObj.title + '" title="' + imgObj.detail + '" /></li>';
		$(this.imgFrame).append(item_image);

		this.slider.reloadSlider({
			  mode: 	_self.settings.fly,
			  auto:		true,
			  pause:	_self.settings.speed,
			  speed:	_self.settings.delay,
			  controls: _self.settings.controls,
			  adaptiveHeight: true,
			  captions: true,
			  onSlideAfter: function() {
				  _self.slider.startAuto();
			  },
			  onSliderLoad: function(){
				  $(_self.settings.container).css("visibility", "visible");
				  _self.slider.startAuto();
			  },
			  imgList: _self.imgList,
			  view:	   _self.settings.view
		});
		if(!_self.settings.border) $(".bx-viewport", $(_self.settings.container)).css({"border":"0px", "left":"0px"});
	}
}
