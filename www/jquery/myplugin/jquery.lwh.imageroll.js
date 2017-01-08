var LWH = LWH || {};
LWH.ImageRoll = function(opts) {
	this.settings = {
		name:		"",
		lang:		"cn",
		mode:		"medium",
		view:		"small",
		filter:		"",
		ref_id:		"",
		noimg:		0,


		container:	"",
		space:		100,
		speed:		30,
		orient:		"h",
		imgww:		0,
		imghh:		0,
		tips:		false,
		
		before:		null,
		after:		null,
		append:		null,
		setlist:	null,
		clear:		null,
		fresh:		null,
		click:		null
	};

	$.extend(this.settings , opts);
	this.imgList		= [];
	this.imgArr			= null;
	this.imgTab			= null;
	this.imgMov			= null;
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
				  _self.initImage();
				  if( _self.settings.after ) if( $.isFunction(_self.settings.after) ) _self.settings.after(_self.settings, _self.imgList);
			  },
			  type: "post",
			  url: "ajax/wmliu_image_list.php"
		  });
	}


	// class constructor
	var _constructor = function() {
		if(!_self.settings.container) {
			_self.settings.container = "body";
		} 
		switch(_self.settings.orient.toLowerCase() ) {
			case "h":
				$(_self.settings.container).addClass("lwhImageRoll-wrap");
				$(_self.settings.container).append('<div class="lwhImageRoll"></div>');
				break;
			case "v":
				$(_self.settings.container).addClass("lwhImageRoll-wrap lwhImageRoll-wrap-v");
				$(_self.settings.container).append('<div class="lwhImageRoll lwhImageRoll-v"></div>');
				break;
		}
		
		var	imgTable_html = [	
								'<table class="lwhImageRoll-content" border="0" cellpadding="0" cellspacing="0" style="width:auto;border-collapse:separate;">',
									'<tr class="lwhImageRoll-content-row">',
										'<td class="lwhImageRoll-content-col">',
											'<table class="lwhImageRoll-image-table" border="0" cellpadding="0" cellspacing="5" style="width:auto;border-collapse:separate;">',
											'</table>',
										'</td>',
									'</tr>',
								'</table>'
							].join("");

		$("div.lwhImageRoll",$(_self.settings.container) ).append(imgTable_html);
		switch(_self.settings.orient.toLowerCase() ) {
			case "h":
				$(_self.settings.container).append('<a class="lwhImageRoll-navi lwhImageRoll-navi-hide lwhImageRoll-navi-left" title="' + gcommon.trans[_self.settings.lang].words["previous"] + '"></a>');
				$(_self.settings.container).append('<a class="lwhImageRoll-navi lwhImageRoll-navi-hide lwhImageRoll-navi-right" title="' + gcommon.trans[_self.settings.lang].words["next"] + '"></a>');
				break;
			case "v":
				$(_self.settings.container).append('<a class="lwhImageRoll-navi lwhImageRoll-navi-hide lwhImageRoll-navi-top" title="' + gcommon.trans[_self.settings.lang].words["previous"] + '"></a>');
				$(_self.settings.container).append('<a class="lwhImageRoll-navi lwhImageRoll-navi-hide lwhImageRoll-navi-bottom" title="' + gcommon.trans[_self.settings.lang].words["next"] + '"></a>');
				break;
		}
		_self.imgArr = $(".lwhImageRoll-content-col", $(_self.settings.container) )[0];
		_self.imgTab = $(".lwhImageRoll-image-table", $(_self.settings.container) )[0];
	
		$("img[imgid]", $(_self.settings.container) ).die("click").live("click", function(ev) {
			var sn = ArraySearch( _self.imgList, "id", $(this).attr("imgid") );
			if( _self.settings.click ) if( $.isFunction(_self.settings.click) ) _self.settings.click(_self.imgList[sn]);
		})

		$("a.lwhImageRoll-navi-left", $(_self.settings.container)).unbind("click").bind("click", function(ev) {
				var dist = $("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft() - _self.settings.imgww;
				if( dist <= 0 ) {
					$("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft( $(_self.imgArr).outerWidth() + _self.settings.space + $("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft() );
				} 
				$("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft( $("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft() - _self.settings.imgww);
		});

		$("a.lwhImageRoll-navi-right", $(_self.settings.container)).unbind("click").bind("click", function(ev) {
				var dist = ( $("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft() + _self.settings.imgww ) - ( $(_self.imgArr).outerWidth() + + _self.settings.space  );
				if( dist >= 0 ) {
					$("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft(dist);
				} else {
					$("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft( $("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft() + _self.settings.imgww);
				}
		});


		$("a.lwhImageRoll-navi-top", $(_self.settings.container)).unbind("click").bind("click", function(ev) {
				var dist = $("div.lwhImageRoll",$(_self.settings.container) ).scrollTop() - _self.settings.imghh;
				if( dist <= 0 ) {
					$("div.lwhImageRoll",$(_self.settings.container) ).scrollTop( $(_self.imgArr).outerHeight() + _self.settings.space + $("div.lwhImageRoll",$(_self.settings.container) ).scrollTop() );
				} 
				$("div.lwhImageRoll",$(_self.settings.container) ).scrollTop( $("div.lwhImageRoll",$(_self.settings.container) ).scrollTop() - _self.settings.imghh);
		});

		$("a.lwhImageRoll-navi-bottom", $(_self.settings.container)).unbind("click").bind("click", function(ev) {
				var dist = ( $("div.lwhImageRoll",$(_self.settings.container) ).scrollTop() + _self.settings.imghh ) - ( $(_self.imgArr).outerHeight() + + _self.settings.space  );
				if( dist >= 0 ) {
					$("div.lwhImageRoll",$(_self.settings.container) ).scrollTop(dist);
				} else {
					$("div.lwhImageRoll",$(_self.settings.container) ).scrollTop( $("div.lwhImageRoll",$(_self.settings.container) ).scrollTop() + _self.settings.imghh);
				}
		});

	
	}();

}

LWH.ImageRoll.prototype = {
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
	},
	

	initImage: function() {
		var _self = this;
	  	_self.sn 		 	= 0;
		$(_self.imgTab).empty();

		switch(_self.settings.orient) {
			case "h":
				// <tr><td></td><td></td><td></td>...</tr>
				$(_self.imgTab).append('<tr class="lwhImageRoll-image-row"></tr>')[0].lastChild;
				break;
			case "v":
				// <tr><td></td></tr> .. <tr><td></td></tr>
				break;
		}

		for(var i = 0; i < _self.imgList.length; i++) {
			_self.sn = i;
			_self.createImage();	
		}
		
		_self.imgMov = setInterval(_self.imgmove, _self.settings.speed, _self);
		$(_self.settings.container).unbind("mouseover").bind("mouseover", function() {clearInterval(_self.imgMov);});
		$(_self.settings.container).unbind("mouseout").bind("mouseout", function() {_self.imgMov = setInterval(_self.imgmove,  _self.settings.speed, _self);});
		
		$("div.lwhImageRoll",$(_self.settings.container) ).scrollTop(0).scrollLeft(0);
	},

	
	createImage: function(cursn) {
		var _self = this;
		if( _self.sn < 0 ) _self.sn = 0;
		if( _self.sn > _self.imgList.length - 1 ) _self.sn = _self.imgList.length - 1;
		var imgid = _self.imgList[_self.sn].id; 
		if( $("img[imgid='" + imgid + "']",$(_self.imgFrame)).length > 0 ) return; 

		var img_url = _self.imgList[_self.sn].raw[_self.settings.view];  //'ajax/wmliu_getimage.php?mode=' + mode + '&imgid=' + _self.idList[_self.sn];
		var img 	= new Image();
		img.src 	= img_url;
		img.sn		= _self.sn;
		img.imgid	= _self.imgList[_self.sn].id;
		img.title	= _self.imgList[_self.sn].title + "\n" + _self.imgList[_self.sn].detail;
	
		var img_link = _self.imgList[_self.sn].url;
		
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

			var imgTR = null;
			switch( _self.settings.orient.toLowerCase() ) {
				case "h":
						imgTR = $(".lwhImageRoll-image-row", $(_self.imgTab))[0];
					break;
				case "v":
						imgTR = $(_self.imgTab).append('<tr class="lwhImageRoll-image-row" imgid="' + img.imgid + '"></tr>')[0].lastChild;
					break;
			}
			imgTR = $(".lwhImageRoll-image-row:last", $(_self.imgTab))[0];

			var img_html = '<td class="lwhImageRoll-image-col' + (_self.settings.tips?' lwhImageRoll-image-col-tips':'') + '" align="center" valign="middle" imgid="' + img.imgid + '"></td>';	
			var imgbox = $(imgTR).append(img_html)[0].lastChild;
			if( img_link ) {
				var imglink = $(imgbox).append('<a href="' + img_link + '" target="_blank"></a>')[0].lastChild;
				var imgel 	= $(imglink).append(img)[0].lastChild;
			} else {
				//console.log( $(imgTR).html() );			
				var imgel = $(imgbox).append(img)[0].lastChild;
			}
			$(imgel).attr("sn", 	img.sn);
			$(imgel).attr("imgid", 	img.imgid);
			$(imgel).css("cursor", 	"pointer");
			$(imgel).disableSelection();
			

			if(_self.settings.tips) $(imgbox).append('<div class="lwhImageRoll-image-title" title="' + img.title + '">' + _self.imgList[img.sn].title + '</div>');
			if( $("div.lwhImageRoll-border",$(_self.settings.container)).length <= 0 ) $("div.lwhImageRoll", $(_self.settings.container)).addClass("lwhImageRoll-border");
		}
	},
	
	imgmove: function(a) {
		var _self = a;
		
		switch(_self.settings.orient) {
			case "h":
					if( $(_self.imgArr).outerWidth() > $(_self.settings.container).width() ) {
						var imgRow = $(".lwhImageRoll-content-row", $(_self.settings.container))[0];
						if( imgRow.cells.length == 1) {
							var new_cell = imgRow.insertCell(1);
							new_cell.style.paddingLeft = _self.settings.space + "px";
							new_cell.innerHTML = imgRow.cells[0].innerHTML;
							//el("btn_left").style.display = "block";
							//el("btn_right").style.display = "block";
						}
				
						if( $("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft() < $(_self.imgArr).outerWidth() + _self.settings.space ) {
							$("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft( $("div.lwhImageRoll",$(_self.settings.container)).scrollLeft()+1);
						} else {
							$("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft( $("div.lwhImageRoll",$(_self.settings.container) ).scrollLeft() - $(_self.imgArr).outerWidth() - _self.settings.space);
						} 
						
						$(".lwhImageRoll-navi-hide",$(_self.settings.container)).removeClass("lwhImageRoll-navi-hide"); 
					}

				break;
			case "v":
					var imgRow = $(".lwhImageRoll-content-row", $(_self.settings.container))[0];
					if(  $(imgRow).outerHeight() > $(_self.settings.container).height() ) {
						if( $(".lwhImageRoll-content-row", $(_self.settings.container)).length <= 1 ) {
							$(".lwhImageRoll-content", $(_self.settings.container) ).append('<tr class="lwhImageRoll-content-row"></tr>')[0].lastChild;
							var lastRow = $(".lwhImageRoll-content-row:last", $(_self.settings.container) )[0];
							$(lastRow).html( $(imgRow).html() );
							$(".lwhImageRoll-image-table", $(lastRow)).css("padding-top", _self.settings.space + "px");
						} 
				
						if( $("div.lwhImageRoll",$(_self.settings.container) ).scrollTop() < $(imgRow).outerHeight() + _self.settings.space ) {
							$("div.lwhImageRoll",$(_self.settings.container) ).scrollTop( $("div.lwhImageRoll",$(_self.settings.container) ).scrollTop()+1);
						} else {
							$("div.lwhImageRoll",$(_self.settings.container) ).scrollTop( $("div.lwhImageRoll",$(_self.settings.container) ).scrollTop() - $(imgRow).outerHeight() - _self.settings.space);
						} 

						$(".lwhImageRoll-navi-hide",$(_self.settings.container)).removeClass("lwhImageRoll-navi-hide"); 
					}

				break;
		}
		
		
		
	}
}
