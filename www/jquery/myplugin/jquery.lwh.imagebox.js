var LWH = LWH || {};
LWH.ImageBox = function(opts) {
	$.extend(this.settings , opts);
	this.imgList		= {};
	this.sn				= 0;
	this.imgFrame 		= null;
	this.imgView 		= null;
	this.imgEdit		= null;
	this.imgCropHtml 	= '';
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
				  _self.sn 		 = 0;
				  _self.initImage();
			  },
			  type: "post",
			  url: "ajax/wmliu_image_list.php"
		  });
	}


	// class constructor
	var _constructor = function() {
		var wh_css = 'width:' + (_self.settings.ww>0?_self.settings.ww+'px;':'auto;') + 'height:' + (_self.settings.hh>0?_self.settings.hh+'px;':'auto;');
		var imgFrame_html = [
			'<div id="lwhImageBox-' + _self.settings.name + '" class="lwhImageBox">',
				'<div style="display:inline-block;position:relative;">',
					'<div class="lwhImageBox-image"></div>',
					'<a class="lwhImageBox-navi lwhImageBox-navi-hide lwhImageBox-navi-left" title="' + gcommon.trans[_self.settings.lang].words["previous"] + '"></a>',
					'<a class="lwhImageBox-navi lwhImageBox-navi-hide lwhImageBox-navi-right" title="' + gcommon.trans[_self.settings.lang].words["next"] + '"></a>',
					'<a class="lwhImageBox-loadingImage"></a>',
				'</div>',
			'</div>'					
		].join("");
		_self.imgFrame = $(_self.settings.container).append(imgFrame_html)[0].lastChild;
		$(_self.imgFrame).disableSelection();

		$(".lwhImageBox-navi-left", $(_self.imgFrame)).live("click", function(ev) {
			_self.prev();
		});

		$(".lwhImageBox-navi-right", $(_self.imgFrame)).live("click", function(ev) {
			_self.next();
		});

		_self.imgCropHtml = [
			'<div class="imageCrop">',
				'<div class="imageCrop-grid imageCrop-grid-h">',
				'</div>',
				'<div class="pixel"></div>',
				'<div class="imageCrop-grid imageCrop-grid-v">',
				'</div>',
			'</div>'
		].join("");
		
		var imgView_html = '';
		switch(_self.settings.orient) {
			case "v":
					imgView_html = [
						'<div id="lwhImageViewer-' + _self.settings.name + '" class="lwhImageViewer">',
							'<table border="0" cellspacing="0" cellpadding="0">',
							'<tr>',
							'<td valign="top">',
								'<div class="lwhImageViewer-list lwhImageViewer-list-v">',
								'</div>',
							'</td>',
							'<td valign="top">',
								'<div class="lwhImageViewer-content lwhImageViewer-content-v">',
									'<div class="lwhImageViewer-content-window">',
										'<div class="lwhImageViewer-content-view"></div>',
										(_self.settings.crop?_self.imgCropHtml:''),
									'</div>',
								'</div>',
							'</td>',
							'</tr>', 
							'</table>',
						'</div>',
					].join('');
					_self.imgView = $("body").append(imgView_html)[0].lastChild;
					$(_self.imgView).lwhImageViewer();
					$(_self.imgView).disableSelection();
			
					$("div.lwhImageViewer-content", $(_self.imgView)).width(_self.settings.imgww).height(_self.settings.imghh);
					$("div.lwhImageViewer-list", $(_self.imgView)).height(_self.settings.imghh);
				break;
			case "h":
					imgView_html = [
						'<div id="lwhImageViewer-' + _self.settings.name + '" class="lwhImageViewer">',
							'<table border="0" cellspacing="0" cellpadding="0">',
							'<tr>',
								'<td valign="top">',
									'<div class="lwhImageViewer-content lwhImageViewer-content-h">',
										'<div class="lwhImageViewer-content-window">',
											'<div class="lwhImageViewer-content-view"></div>',
											(_self.settings.crop?_self.imgCropHtml:''),
										'</div>',
									'</div>',
								'</td>',
							'</tr>', 
							'<tr>',
								'<td valign="top">',
									'<div class="lwhImageViewer-list lwhImageViewer-list-h">',
									'</div>',
								'</td>',
							'</tr>', 
							'</table>',
						'</div>',
					].join('');
					_self.imgView = $("body").append(imgView_html)[0].lastChild;
					$(_self.imgView).lwhImageViewer();
					$(_self.imgView).disableSelection();
			
					$("div.lwhImageViewer-content", $(_self.imgView)).width(_self.settings.imgww).height(_self.settings.imghh);
					$("div.lwhImageViewer-list", $(_self.imgView)).width(_self.settings.imgww);
				break;
			case "hv":
					imgView_html = [
						'<div id="lwhImageViewer-' + _self.settings.name + '" class="lwhImageViewer">',
							'<table border="0" cellspacing="0" cellpadding="0">',
							'<tr>',
								'<td valign="top">',
									'<div class="lwhImageViewer-content lwhImageViewer-content-hv">',
										'<div class="lwhImageViewer-content-window">',
											'<div class="lwhImageViewer-content-view"></div>',
											(_self.settings.crop?_self.imgCropHtml:''),
										'</div>',
									'</div>',
								'</td>',
							'</tr>', 
							'<tr>',
								'<td valign="top">',
									'<div class="lwhImageViewer-list lwhImageViewer-list-hv">',
									'</div>',
								'</td>',
							'</tr>', 
							'</table>',
						'</div>',
					].join('');
					_self.imgView = $("body").append(imgView_html)[0].lastChild;
					$(_self.imgView).lwhImageViewer();
					$(_self.imgView).disableSelection();
			
					$("div.lwhImageViewer-content", $(_self.imgView)).width(_self.settings.imgww).height(_self.settings.imghh);
					$("div.lwhImageViewer-list", $(_self.imgView)).width(_self.settings.imgww);
				break;
		}
		
		$("div.lwhImageViewer-list div.lwhImageViewer-box", $(_self.imgView)).die("click").live("click", function(ev) {
			var imgid = $(this).attr("imgid");
			_self.view(imgid);
		});

		
        var imgEdit_html = [
			'<div id="lwhImageViewer-edit' + _self.settings.name + '" class="lwhImageViewer" style="border:1px solid #666666;">',
				'<div class="lwhImageViewer-content" style="padding:10px;">',
					'<input type="hidden" 	id="lwhImageViewer_img_id" 		name="lwhImageViewer_img_id" 	value="" />',
					'<table>',
						'<tr>',
							'<td align="left">' + gcommon.trans[_self.settings.lang].words["subject en"] + '</td>',
							'<td align="left">' + gcommon.trans[_self.settings.lang].words["subject cn"] + '</td>',
						'</tr>',
						'<tr>',
							'<td align="center">',
							'<input type="text" 	id="lwhImageViewer_img_title_en" 	name="lwhImageViewer_img_title_en" style="width:200px;" value="" />',
							'</td>',
							'<td align="center">',
							'<input type="text" 	id="lwhImageViewer_img_title_cn" 	name="lwhImageViewer_img_title_cn" style="width:200px;" value="" />',
							 '</td>',
						'</tr>',
						'<tr>',
							'<td align="left">' + gcommon.trans[_self.settings.lang].words["desc en"] + '</td>',
							'<td align="left">' + gcommon.trans[_self.settings.lang].words["desc cn"] + '</td>',
						'</tr>',
						'<tr>',
							'<td align="center">',
							'<textarea id="lwhImageViewer_img_desc_en" name="lwhImageViewer_img_desc_en" style="width:200px; height:60px;"></textarea>',
							'</td>',
							'<td align="center">',
							'<textarea id="lwhImageViewer_img_desc_cn" name="lwhImageViewer_img_desc_cn" style="width:200px; height:60px;"></textarea>',
							 '</td>',
						'</tr>',
						'<tr>',
							'<td colspan="2" align="left">' + gcommon.trans[_self.settings.lang].words["image url"] + '</td>',
						'</tr>',
						'<tr>',
							'<td colspan="2" align="center">',
							'<input type="text" id="lwhImageViewer_img_url" name="lwhImageViewer_img_url" style="width:420px;" />',
							 '</td>',
						'</tr>',
					'</table>',
					'<div style="padding-top:10px; text-align:center;">',
						'<input type="button" id="lwhImageViewer_img_save" name="lwhImageViewer_img_save" value="' + gcommon.trans[_self.settings.lang].words["save"] + '" />',
					'</div>',
				'</div>',
			'</div>',
        ].join('');

		_self.imgEdit = $("body").append(imgEdit_html)[0].lastChild;
		$(_self.imgEdit).lwhImageViewer();


		$("a.lwhImageViewer-btn-delete", $(_self.imgView)).die("click").live("click", function(ev) {
			wait_show();
			var mid 	= $(this).attr("imgid");
			var sn 		= ArraySearch(_self.imgList, "id", mid);

			$.ajax({
				  data: {
					  imgid: mid
				  },
				  dataType: "json",  
				  error: function(xhr, tStatus, errorTh ) {
					  wait_hide();
					  alert("Error (wmliu_image_delete.php): " + xhr.responseText + "\nStatus: " + tStatus);
				  },
				  success: function(req, tStatus) {
						wait_hide();
						_self.imgList.splice(sn, 1);
						$(".lwhImageViewer-box[imgid='" + mid + "']", $(_self.imgView)).remove();
						_self.initImage();
						if(_self.imgList.length>0) {
							_self.view(_self.imgList[0].id);
						} else {
							_self.view(-1);
						}
				  },
				  type: "post",
				  url: "ajax/wmliu_image_delete.php"
			});

		});


		$("a.lwhImageViewer-btn-crop", $(_self.imgView)).die("click").live("click", function(ev) {
			var mid 	= $(this).attr("imgid");
			var sn 		= ArraySearch(_self.imgList, "id", mid);

			if( $(this).hasClass("lwhImageViewer-btn-crop-cut") )  {
				wait_show();
				var schema		={};
				schema.lang 	= _self.settings.lang;
				schema.filter 	= _self.settings.filter;
				schema.ref_id 	= _self.settings.ref_id;
				schema.mode		= _self.settings.mode;
				schema.view 	= _self.settings.view;
				schema.noimg	= _self.settings.noimg;
				
				var cropObj 		= {};
				cropObj.imgid		= mid;
				cropObj.position 	= {};
				cropObj.position.x  = $("div.imageCrop", $(_self.imgView)).position().left;
				cropObj.position.y  = $("div.imageCrop", $(_self.imgView)).position().top;
				cropObj.size	 	= {};
				cropObj.size.w	 	= $("div.imageCrop", $(_self.imgView)).width();
				cropObj.size.h	 	= $("div.imageCrop", $(_self.imgView)).height();
				cropObj.imgsize		= {};
				cropObj.imgsize.w   = $(".lwhImageViewer-content-view img",$(_self.imgView)).width();
				cropObj.imgsize.h   = $(".lwhImageViewer-content-view img",$(_self.imgView)).height();
				
				$.ajax({
					  data: {
						  	schema:		schema,
							crop_obj: 	cropObj
					  },
					  dataType: "json",  
					  error: function(xhr, tStatus, errorTh ) {
						  wait_hide();
						  alert("Error (wmliu_image_crop.php): " + xhr.responseText + "\nStatus: " + tStatus);
					  },
					  success: function(req, tStatus) {
							wait_hide();
							if(req.errorCode > 0) {
								alert(req.errorMessage);
							} else {
								_self.replace(req.data.imgObj);
								$("div.imageCrop", $(_self.imgView)).hide();
								$("a.lwhImageViewer-btn-crop", $(_self.imgView)).removeClass("lwhImageVShow-btn-crop-cut");
							
								if( _self.settings.callBack ) if( $.isFunction(_self.settings.callBack) ) _self.settings.callBack(req.data.imgObj);		
							}
					  },
					  type: "post",
					  url: "ajax/wmliu_image_crop.php"
				});

			} else {
				$("div.imageCrop", $(_self.imgView)).show();
				$("div.imageCrop div.pixel", $(_self.imgView)).html("Width: " + $("div.imageCrop", $(_self.imgView)).width() + " Height:" + $("div.imageCrop", $(_self.imgView)).height());
				$(this).addClass("lwhImageViewer-btn-crop-cut");
			}
		});

		$("a.lwhImageViewer-btn-reset", $(_self.imgView)).die("click").live("click", function(ev) {
			wait_show();
			var mid 	= $(this).attr("imgid");
			var sn 		= ArraySearch(_self.imgView, "id", mid);
			
			var schema		={};
			schema.lang 	= _self.settings.lang;
			schema.filter 	= _self.settings.filter;
			schema.ref_id 	= _self.settings.ref_id;
			schema.mode		= _self.settings.mode;
			schema.view 	= _self.settings.view;
			schema.noimg	= _self.settings.noimg;
			
			var cropObj 		= {};
			cropObj.imgid		= mid;
			
			$.ajax({
				  data: {
						schema:		schema,
						crop_obj: 	cropObj
				  },
				  dataType: "json",  
				  error: function(xhr, tStatus, errorTh ) {
					  wait_hide();
					  alert("Error (wmliu_image_reset.php): " + xhr.responseText + "\nStatus: " + tStatus);
				  },
				  success: function(req, tStatus) {
						wait_hide();
						if(req.errorCode > 0) {
							alert(req.errorMessage);
						} else {
							_self.replace(req.data.imgObj);
							$("div.imageCrop", $(_self.imgView)).hide();
							$("a.lwhImageViewer-btn-crop", $(_self.imgView)).removeClass("lwhImageViewer-btn-crop-cut");
							if( _self.settings.callBack ) if( $.isFunction(_self.settings.callBack) ) _self.settings.callBack(req.data.imgObj);		
						}
				  },
				  type: "post",
				  url: "ajax/wmliu_image_reset.php"
			});
		});


		$("a.lwhImageViewer-btn-edit", $(_self.imgView)).die("click").live("click", function(ev) {
			var mid 	= $(this).attr("imgid");
			var sn 		= ArraySearch(_self.imgList, "id", mid);

			$("#lwhImageViewer_img_id").val("");
			$("#lwhImageViewer_img_title_en").val("");
			$("#lwhImageViewer_img_desc_en").val("");
			$("#lwhImageViewer_img_title_cn").val("");
			$("#lwhImageViewer_img_desc_cn").val("");
			$("#lwhImageViewer_img_url").val("");
			
			if( sn >= 0 ) {
				$("#lwhImageViewer_img_id").val(_self.imgList[sn].id);
				$("#lwhImageViewer_img_title_en").val(_self.imgList[sn].title_en);
				$("#lwhImageViewer_img_desc_en").val(_self.imgList[sn].detail_en);
				$("#lwhImageViewer_img_title_cn").val(_self.imgList[sn].title_cn);
				$("#lwhImageViewer_img_desc_cn").val(_self.imgList[sn].detail_cn);
				$("#lwhImageViewer_img_url").val(_self.imgList[sn].url);
				$(_self.imgEdit).imageViewerShow();
			}

		});

		$("#lwhImageViewer_img_save", $(_self.imgEdit)).die("click").live("click", function(ev) {
			var mid 	= $("#lwhImageViewer_img_id").val();
			var sn 		= ArraySearch(_self.imgList, "id", mid);
			if( sn >= 0 ) {
				wait_show();
				$.ajax({
					  data: {
						  imgid: 		$.trim( $("#lwhImageViewer_img_id").val() ),
						  title_en:		$.trim( $("#lwhImageViewer_img_title_en").val() ),
						  detail_en:	$.trim( $("#lwhImageViewer_img_desc_en").val() ),
						  title_cn:		$.trim( $("#lwhImageViewer_img_title_cn").val() ),
						  detail_cn:	$.trim( $("#lwhImageViewer_img_desc_cn").val() ),
						  url:			$.trim( $("#lwhImageViewer_img_url").val() )
					  },
					  dataType: "json",  
					  error: function(xhr, tStatus, errorTh ) {
						  wait_hide();
						  alert("Error (wmliu_image_title_save.php): " + xhr.responseText + "\nStatus: " + tStatus);
					  },
					  success: function(req, tStatus) {
							wait_hide();
							if(req.errorCode > 0) {
								alert(req.errorMessage);
							} else {
								_self.imgList[sn].title 	= _self.settings.lang=="en"?$.trim( $("#lwhImageViewer_img_title_en").val() ):$.trim( $("#lwhImageViewer_img_title_cn").val() );
								_self.imgList[sn].detail 	= _self.settings.lang=="en"?$.trim( $("#lwhImageViewer_img_desc_en").val() ):$.trim( $("#lwhImageViewer_img_desc_cn").val() );

								_self.imgList[sn].title_en 	= $.trim( $("#lwhImageViewer_img_title_en").val() );
								_self.imgList[sn].detail_en = $.trim( $("#lwhImageViewer_img_desc_en").val() );

								_self.imgList[sn].title_cn 	= $.trim( $("#lwhImageViewer_img_title_cn").val() );
								_self.imgList[sn].detail_cn	= $.trim( $("#lwhImageViewer_img_desc_cn").val() );
								_self.imgList[sn].url		= $.trim( $("#lwhImageViewer_img_url").val() );
								
								if( _self.imgList[sn].title !=""  && _self.settings.tips) {
									if($("div.lwhImageViewer-content-view div.lwhImageViewer-subject", $(_self.imgView)).length<=0) 
										$("div.lwhImageViewer-content-view", $(_self.imgView)).append('<div class="lwhImageViewer-subject">' + _self.imgList[sn].title + '</div>');
									else 
										$("div.lwhImageViewer-content-view div.lwhImageViewer-subject", $(_self.imgView)).html(_self.imgList[sn].title);
								} else {
									$("div.lwhImageViewer-content-view div.lwhImageViewer-subject", $(_self.imgView)).remove();
								}
								
								if( _self.imgList[sn].detail !=""  && _self.settings.tips) {
									if( $("div.lwhImageViewer-content-view div.lwhImageViewer-detail", $(_self.imgView)).length<=0) 
										$("div.lwhImageViewer-content-view", $(_self.imgView)).append('<div class="lwhImageViewer-detail">' + _self.imgList[sn].detail + '</div>');
									else 
										$("div.lwhImageViewer-content-view div.lwhImageViewer-detail", $(_self.imgView)).html(_self.imgList[sn].detail);
								} else {
									$("div.lwhImageViewer-content-view div.lwhImageViewer-detail", $(_self.imgView)).remove();
								}
								
								$(_self.imgEdit).imageViewerHide();
							}
					  },
					  type: "post",
					  url: "ajax/wmliu_image_title_save.php"
				});
			}

		});
	
	// constructor end
	}();

}

LWH.ImageBox.prototype = {
	settings : {
		name:		"",
		lang:		"en",
		mode:		"small",
		view:		"thumb",
		noimg:		1,
		filter:		"",
		ref_id:		"",

		edit:		false,
		tips:		true,

		container:	"",
		
		crop:		true,
		cropww:		100,
		crophh:		100,
		
		ww:			120,
		hh:			120,
		imgww:		200,
		imghh:		160,
		orient:		"hv",
		
		callBack: 	null
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
	
	setList: function(iList) {
		this.imgList = iList;
		this.sn = 0;
		this.initImage();
	},
	
	clear: function() {
		var _self = this;
		_self.imgList = [];
		_self.sn 		 = 0;
		$("div.lwhImageBox-image", $(_self.imgFrame)).empty();
	},
	
	replace: function( imgObj ) {
		var _self = this;
		var sn = ArraySearch(this.imgList, "id", imgObj.id);
		this.imgList[sn] = imgObj;
		this.view(imgObj.id);
		$("div.lwhImageViewer-list  div.lwhImageViewer-box img[imgid='" + imgObj.id + "']",$(this.imgView)).remove();
		var view_img_html = '<img src="' + imgObj.raw[this.settings.view] + '" sn="' + sn + '" imgid="' + imgObj.id + '" />';
		$("div.lwhImageViewer-list  div.lwhImageViewer-box[imgid='" + imgObj.id + "']", $(this.imgView)).append(view_img_html);
		
		$("div.lwhImageBox-image-box img[imgid='" + imgObj.id + "']", $(this.imgFrame)).remove();
		
		var img_url  = this.imgList[sn].raw[this.settings.mode];  //'ajax/wmliu_getimage.php?mode=' + mode + '&imgid=' + _self.idList[cursn];
		var img 	= new Image();
		img.src 	= img_url;
		img.sn		= sn;
		img.imgid	= this.imgList[sn].id;
		
		var mode_img_html = '<img src="' + imgObj.raw[this.settings.mode] + '" sn="' + sn + '" imgid="' + imgObj.id + '" />';
		
		img.onload = function() {
				var rate_ww = 1;
				var rate_hh = 1;
				if(_self.settings.ww>0 && img.width > _self.settings.ww) rate_ww = _self.settings.ww / img.width;
				if(_self.settings.hh>0 && img.height > _self.settings.hh) rate_hh = _self.settings.hh / img.height;
				var img_rate = img.height / img.width;
				var rate = Math.min(rate_ww, rate_hh);
				if(rate < 1) {
					if(rate_ww < rate_hh) {
						img.width 	= _self.settings.ww;
						img.height 	= _self.settings.ww  * img_rate;
						//$(imgel).attr("width", _self.settings.ww);
					} else { 
						img.height 	= _self.settings.hh;
						img.width	= _self.settings.hh / img_rate;
						//$(imgel).attr("height", _self.settings.hh);
					}
					
				}
		
				var imgel = $("div.lwhImageBox-image-box[imgid='" + img.imgid + "']", $(_self.imgFrame)).append(img)[0].lastChild;
				$(imgel).attr("sn", 	img.sn);
				$(imgel).attr("imgid", 	img.imgid);
				$(imgel).hide();
				if(img.sn == _self.sn ) _self.naviImage();
		}

		// click on image to image viewer
		img.onclick = function() {
			_self.view(img.imgid);
		}
		// end of img viewer
		
		
	},


	append: function(imgObj) {
		this.imgList.push(imgObj);
		this.sn = this.imgList.length-1;
		this.createImage(this.sn);
	},
	
	prev: function() {
		this.sn--;
		this.naviImage();
	},
	
	next: function() {
		this.sn++;
		this.naviImage();
	},
	
	view: function(imgid) {
		var _self 	= this;
		var sn 		= ArraySearch(_self.imgList, "id", imgid);
		if( sn < 0 ) {
			$("div.lwhImageViewer-content div.lwhImageViewer-content-view", $(_self.imgView)).empty();

			if(_self.settings.edit) {
				$("div.lwhImageViewer-content a.lwhImageViewer-btn-delete", $(_self.imgView)).remove();
				$("div.lwhImageViewer-content a.lwhImageViewer-btn-edit", $(_self.imgView)).remove();
				
				if(_self.settings.crop) {
					$("div.lwhImageViewer-content a.lwhImageViewer-btn-crop", $(_self.imgView)).remove();
					$("div.lwhImageViewer-content a.lwhImageViewer-btn-reset", $(_self.imgView)).remove();
				}
			}

			$("div.lwhImageViewer-list div.lwhImageViewer-box", $(_self.imgView)).removeClass("lwhImageViewer-box-selected");
			return;
		}
		
		var view_url = _self.imgList[sn].raw[_self.settings.mode];
		if( view_url=="") {
			$("div.lwhImageViewer-content div.lwhImageViewer-content-view", $(_self.imgView)).empty();

			if(_self.settings.edit) {
				$("div.lwhImageViewer-content a.lwhImageViewer-btn-delete", $(_self.imgView)).remove();
				$("div.lwhImageViewer-content a.lwhImageViewer-btn-edit", $(_self.imgView)).remove();
				if(_self.settings.crop) {
					$("div.lwhImageViewer-content a.lwhImageViewer-btn-crop", $(_self.imgView)).remove();
					$("div.lwhImageViewer-content a.lwhImageViewer-btn-reset", $(_self.imgView)).remove();
				}
			}

			$("div.lwhImageViewer-list div.lwhImageViewer-box", $(_self.imgView)).removeClass("lwhImageViewer-box-selected");
			return;
		}
		
		var viewImg 	= new Image();
		viewImg.src 	= view_url;
		viewImg.title 	= $.trim(_self.imgList[sn].detail);
		viewImg.subject = $.trim(_self.imgList[sn].title);
		viewImg.onload = function() {
			$("div.lwhImageViewer-content div.lwhImageViewer-content-view", $(_self.imgView)).empty();
			if(_self.settings.edit) {
				$("div.lwhImageViewer-content a.lwhImageViewer-btn-delete", $(_self.imgView)).remove();
				$("div.lwhImageViewer-content a.lwhImageViewer-btn-edit", $(_self.imgView)).remove();
				if(_self.settings.crop) {
					$("div.lwhImageViewer-content a.lwhImageViewer-btn-crop", $(_self.imgView)).remove();
					$("div.lwhImageViewer-content a.lwhImageViewer-btn-reset", $(_self.imgView)).remove();
				}
			}

			var rate_ww = 1;
			var rate_hh = 1;
			var maxww = _self.settings.imgww;
			var maxhh = _self.settings.imghh;
			if(maxww>0 && this.width > maxww) rate_ww = maxww / this.width;
			if(maxhh>0 && this.height > maxhh) rate_hh = maxhh / this.height;
			var rate = Math.min(rate_ww, rate_hh);

			var img_rate = viewImg.height / viewImg.width;
			var rate = Math.min(rate_ww, rate_hh);
			if(rate < 1) {
				if(rate_ww < rate_hh) {
					viewImg.width 	= maxww;
					viewImg.height 	= maxww  * img_rate;
					//$(imgel).attr("width", maxww);
				} else { 
					viewImg.height 	= maxhh;
					viewImg.width	= maxhh / img_rate;
					//$(imgel).attr("height", maxhh);
				}
				
			}
			
			$("div.lwhImageViewer-content div.lwhImageViewer-content-view", $(_self.imgView)).append(viewImg);
			if(viewImg.subject!="" && _self.settings.tips) 	$("div.lwhImageViewer-content div.lwhImageViewer-content-view", $(_self.imgView)).append('<div class="lwhImageViewer-subject">' + viewImg.subject + '</div>');
			if(viewImg.title!="" && _self.settings.tips) 	$("div.lwhImageViewer-content div.lwhImageViewer-content-view", $(_self.imgView)).append('<div class="lwhImageViewer-detail">' + viewImg.title + '</div>');
			
			
			$("div.lwhImageViewer-list div.lwhImageViewer-box", $(_self.imgView)).removeClass("lwhImageViewer-box-selected");
			$("div.lwhImageViewer-list div.lwhImageViewer-box[imgid='" + imgid + "']", $(_self.imgView)).addClass("lwhImageViewer-box-selected");

			
			if(_self.settings.edit) {
				$("div.lwhImageViewer-content", $(_self.imgView)).append('<a class="lwhImageViewer-btn-delete" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["delete"] + '"></a>');
				$("div.lwhImageViewer-content", $(_self.imgView)).append('<a class="lwhImageViewer-btn-edit" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["edit"] + '"></a>');
				if(_self.settings.crop) {				
					$("div.lwhImageViewer-content", $(_self.imgView)).append('<a class="lwhImageViewer-btn-crop" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["crop image"] + '"></a>');
					$("div.lwhImageViewer-content", $(_self.imgView)).append('<a class="lwhImageViewer-btn-reset" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["reset image"] + '"></a>');
				}
			}
			


			// after image loaded ,   el width and height will be ok. otherwise  asynchronize
			_self.sn = sn;	
			$(_self.imgView).imageViewerShow();
			_self.naviImage();	
			// before crop,  must show window  to  have width & height  > 0 			
				
			
			// crop
			if(_self.settings.crop) {
				var org_ww0 	= _self.settings.cropww;
				var org_hh0 	= _self.settings.crophh;
				
				var win_ww0 	= $(".lwhImageViewer-content-window",$(_self.imgView)).width() 	* 0.8;
				var win_hh0 	= $(".lwhImageViewer-content-window",$(_self.imgView)).height() * 0.8;
				var win_rate = win_hh0 / win_ww0;

				//console.log("win: " + win_ww0 + " : " + win_hh0);
	
				var crop_ww 	= win_ww0;
				var crop_hh 	= win_hh0;

				if( org_ww0 > 0 && org_hh0 <= 0 ) {
					 org_hh0 = org_ww0 * win_rate;
				} 
				if( org_hh0 > 0 && org_ww0 <= 0 ) {
					 org_ww0 = org_hh0 / win_rate;
				}
				var crop_rate = org_hh0 / org_ww0;

				var rate_ww = 1;
				var rate_hh = 1;
				if(org_ww0 > win_ww0)	rate_ww = win_ww0 / org_ww0;
				if(org_hh0 > win_hh0)	rate_hh = win_hh0 / org_hh0;
				
				//console.log("ww rate: " + rate_ww);
				//console.log("hh rate: " + rate_hh);
				//console.log("crop rate: " + crop_rate );
				
				var rate = Math.min(rate_ww, rate_hh);
				if( rate < 1 ) {
					if( rate_ww < rate_hh ) {
						crop_ww = win_ww0;
						crop_hh =org_hh0 * rate; 
					} else {
						crop_hh = win_hh0;
						crop_ww = org_ww0 * rate;
					}
				} else {
					if(crop_rate < 1) {
						crop_hh = crop_ww * crop_rate;
					} else {
						crop_ww = crop_hh / crop_rate;
					}
				}

				
			
				rate_ww = 1;
				rate_hh = 1;
				if(crop_ww > win_ww0)	rate_ww = win_ww0 / crop_ww;
				if(crop_hh > win_hh0)	rate_hh = win_hh0 / crop_hh;
				var rate = Math.min(rate_ww, rate_hh);
				crop_ww = crop_ww * rate;
				crop_hh = crop_hh * rate; 

				//console.log(crop_ww + " : " + crop_hh);

				var crop_left = ($(".lwhImageViewer-content-window",$(_self.imgView)).width() - crop_ww) / 2;
				var crop_top = ($(".lwhImageViewer-content-window",$(_self.imgView)).height() - crop_hh) / 2;
				$("div.imageCrop", $(_self.imgView)).css({"top":crop_top, "left":crop_left}).width(crop_ww).height(crop_hh);
		
				$("div.imageCrop", $(_self.imgView)).draggable( "destroy" ).draggable({
										containment: $(".lwhImageViewer-content-window", _self.imgView),
										drag: function( event, ui ) {
										},
										stop: function( event, ui ) {
										}
									});

				$("div.imageCrop", $(_self.imgView)).resizable( "destroy" ).resizable({ 
									containment: $(".lwhImageViewer-content-window", _self.imgView),
									minWidth:	 org_ww0?org_ww0:0,
									minHeight:	 org_hh0?org_hh0:0,
									aspectRatio: (_self.settings.cropww>0 && _self.settings.crophh>0?crop_ww/crop_hh:0),
				                    resize: function (event, ui) {
										$(".pixel", $(ui.element)).html("Width: " + $(ui.element).width() + "  Height: " + $(ui.element).height());
				                    }
								 });
								 
				$("div.imageCrop", $(_self.imgView)).hide();
			}
			// end of crop

			
		} // end of image onload function 

	},

	initImage: function() {
		var _self 	= this;
	  	_self.sn 	= 0;
		$("div.lwhImageBox-image", $(_self.imgFrame)).empty();
		 $("div.lwhImageViewer-list  div.lwhImageViewer-box", $(_self.imgView)).remove();
		 $("div.imageCrop", $(_self.imgView)).hide();
		 
		if( _self.imgList.length > 0 ) {
			for(var i = 0; i < _self.imgList.length; i++) {
				_self.createImage(i);	
			}

		} else {
			$("a.lwhImageBox-navi", $(_self.imgFrame)).addClass("lwhImageBox-navi-hide");
		}
	},

	naviImage: function() {
		var _self = this;
		$("div.lwhImageBox-image img", $(this.imgFrame)).hide();
		$("a.lwhImageBox-navi", $(_self.imgFrame)).addClass("lwhImageBox-navi-hide");
		if( this.imgList.length <=0 ) return;
		
		// navi button
		$("a.lwhImageBox-navi", $(_self.imgFrame)).removeClass("lwhImageBox-navi-hide");
		if(this.imgList.length==1) 
			$("a.lwhImageBox-navi", $(_self.imgFrame)).addClass("lwhImageBox-navi-hide");
		
		if(this.sn <= 0) {
			this.sn = 0;
			$("a.lwhImageBox-navi-left", $(this.imgFrame)).addClass("lwhImageBox-navi-hide");
		}
		
		if(this.sn >= this.imgList.length -1 ) {
			this.sn = this.imgList.length -1;
			$("a.lwhImageBox-navi-right", $(this.imgFrame)).addClass("lwhImageBox-navi-hide");
		}
		
		$("div.lwhImageBox-image img[sn='" + this.sn + "']", $(this.imgFrame)).show();
	
	},
		
	createImage: function(cursn) {
		var _self = this;
		if( _self.imgList[cursn] ) 
		if( _self.imgList[cursn].raw[_self.settings.mode] ) {
				$("a.lwhImageBox-loadingImage",  $(_self.imgFrame)).show();
				
				var img_url  = _self.imgList[cursn].raw[_self.settings.mode];  //'ajax/wmliu_getimage.php?mode=' + mode + '&imgid=' + _self.idList[cursn];
				var img 	= new Image();
				img.src 	= img_url;
				img.sn		= cursn;
				img.imgid	= _self.imgList[cursn].id;
				
				if( $("div.lwhImageViewer-list  div.lwhImageViewer-box[imgid='" + img.imgid + "']", $(_self.imgView)).length <= 0 ) { 
						var thumb_html = '';
						switch( _self.settings.orient ) {
							case "v":
								thumb_html = [
									'<div class="lwhImageViewer-box lwhImageViewer-box-v" sn="' + img.sn + '" imgid="' + img.imgid + '">',
										'<img src="' + _self.imgList[img.sn].raw[_self.settings.view] + '" sn="' + img.sn + '" imgid="' +  img.imgid + '" />',
									'</div>'
								].join('');
								break;
							case "h":
								thumb_html = [
									'<div class="lwhImageViewer-box lwhImageViewer-box-h" sn="' + img.sn + '" imgid="' + img.imgid + '">',
										'<img src="' + _self.imgList[img.sn].raw[_self.settings.view] + '" sn="' + img.sn + '" imgid="' +  img.imgid + '" />',
									'</div>'
								].join('');
								break;
							case "hv":
								thumb_html = [
									'<div class="lwhImageViewer-box lwhImageViewer-box-hv" sn="' + img.sn + '" imgid="' + img.imgid + '">',
										'<img src="' + _self.imgList[img.sn].raw[_self.settings.view] + '" sn="' + img.sn + '" imgid="' +  img.imgid + '" />',
									'</div>'
								].join('');
								break;
						}
						var thumbBox = $("div.lwhImageViewer-list", $(_self.imgView)).append(thumb_html)[0].lastChild;
		
						if(_self.settings.edit) {
							$("div.lwhImageViewer-list", $(_self.imgView)).sortable("destroy").sortable({
										start: function(ev,ui) {
										},
										stop: function(ev, ui) {
												_self.view($(ui.item).attr("imgid"));
	
												var schema		={};
												schema.lang 	= _self.settings.lang;
												schema.filter 	= _self.settings.filter;
												schema.ref_id 	= _self.settings.ref_id;
												schema.mode		= _self.settings.mode;
												schema.view 	= _self.settings.view;
												schema.noimg	= _self.settings.noimg;

												var sortArr = [];
												$("div.lwhImageViewer-box", $(_self.imgView)).each(function(idx,el){
													var sortObj = {};
													sortObj.imgid 	= $(el).attr("imgid");
													sortObj.sn 		= idx + 1;
													sortArr.push(sortObj);
												});
												

												$.ajax({
													  data: {
															schema: schema,
														  	list: 	sortArr
													  },
													  dataType: "json",  
													  error: function(xhr, tStatus, errorTh ) {
														  alert("Error (wmliu_image_resort.php): " + xhr.responseText + "\nStatus: " + tStatus);
													  },
													  success: function(req, tStatus) {
															_self.imgList = req.data.imgList;
															$("div.lwhImageBox-image", $(_self.imgFrame)).empty();
															_self.sn = ArraySearch(_self.imgList, "id", $(ui.item).attr("imgid"));
															
															if( _self.imgList.length > 0 ) {
																for(var i = 0; i < _self.imgList.length; i++) {
																	_self.createImage(i);	
																}
															} 
															_self.view($(ui.item).attr("imgid"));
															
															if( _self.settings.callBack ) if( $.isFunction(_self.settings.callBack) ) _self.settings.callBack(_self.imgList[_self.sn]);		
													  },
													  type: "post",
													  url: "ajax/wmliu_image_resort.php"
												});
										}
							});
						}
			
						$("div.lwhImageVShow-list", $(_self.imgView)).disableSelection();

				}
				
				
				//img.width 	= _self.settings.ww;
				img.onload = function() {
					var rate_ww = 1;
					var rate_hh = 1;
					if(_self.settings.ww>0 && img.width > _self.settings.ww) rate_ww = _self.settings.ww / img.width;
					if(_self.settings.hh>0 && img.height > _self.settings.hh) rate_hh = _self.settings.hh / img.height;
					var img_rate = img.height / img.width;
					var rate = Math.min(rate_ww, rate_hh);
					if(rate < 1) {
						if(rate_ww < rate_hh) {
							img.width 	= _self.settings.ww;
							img.height 	= _self.settings.ww  * img_rate;
							//$(imgel).attr("width", _self.settings.ww);
						} else { 
							img.height 	= _self.settings.hh;
							img.width	= _self.settings.hh / img_rate;
							//$(imgel).attr("height", _self.settings.hh);
						}
						
					}
					
					var imgbbb 	= $("div.lwhImageBox-image", $(_self.imgFrame)).append('<div class="lwhImageBox-image-box" sn="' + img.sn + '" imgid="' + img.imgid + '"></div>')[0].lastChild;
					
					var imgel 	= $(imgbbb).append(img)[0].lastChild;
					$(imgel).attr("sn", 	img.sn);
					$(imgel).attr("imgid", 	img.imgid);
					$(imgel).hide();

					if(img.sn == _self.sn ) _self.naviImage();
										
					$("div.lwhImageBox-image", $(_self.imgFrame)).disableSelection();					
					$("a.lwhImageBox-loadingImage",  $(_self.imgFrame)).hide();
				}
		
		
				// click on image to image viewer
				img.onclick = function() {
					_self.view(img.imgid);
					if( _self.settings.click ) if($.isFunction(_self.settings.click)) _self.settings.click(img);				
				}
				// end of img viewer
		}
	}
	
}




/***********Image Viewer *****************************************************************/
$.fn.extend({
    lwhImageViewer: function (opts) {
        var def_settings = {
            container: "",
			offsetto:  "",
            maskable: true,
			content:  "",
            zIndex: 7000
        };
        $.extend(def_settings, opts);

        var mask_zidx = def_settings.zIndex;
        var mask_ifrm 	= "#lwhImageViewer_mask_ifrm";
        var mask_div 	= "#lwhImageViewer_mask_div";
        if ($(mask_ifrm).length <= 0 && def_settings.maskable) {
            $(document.body).append('<iframe id="lwhImageViewer_mask_ifrm" class="lwhImageViewer-mask-ifrm" style="z-index:' + (mask_zidx - 5001 ) + ';"></iframe>');
        }

        if ($(mask_div).length <= 0 && def_settings.maskable) {
            $(document.body).append('<div id="lwhImageViewer_mask_div" class="lwhImageViewer-mask-div" style="z-index:' + (mask_zidx - 5000) + ';"></div>');
        }
        def_settings.zIndex = mask_zidx + 2;

        return this.each(function (idx, el) {

            $(el).data("default_settings", def_settings);
            $(el).css("zIndex", def_settings.zIndex);

            def_settings.zIndex++;

			if( $(el).has("a.lwhImageViewer-button-close").length<=0 ) $(el).prepend('<a class="lwhImageViewer-button-close"></a>');
			//if( $(el).has("div.lwhImageViewer-content").length<=0 ) 	$(el).append('<div class="lwhImageViewer-content"></div>');
			
		    $("a.lwhImageViewer-button-close", el).bind("click.lwhImageViewer", function (ev) {
                $(el).imageViewerHide();
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            });

            if (def_settings.maskable) {
                $(mask_div).bind("click.lwhImageViewer", function (ev) {
                    $(el).imageViewerHide();
                    ev.preventDefault();
                    ev.stopPropagation();
                    return false;
                });
            }


        });
    },

    imageViewerShow: function (opts) {
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhImageViewer_mask_ifrm";
            var mask_div = "#lwhImageViewer_mask_div";

            var def_settings = $(el).data("default_settings");
            $.extend(def_settings, opts);


            if (def_settings.maskable) {
                $(mask_ifrm).show();
            }

            if (def_settings.maskable) {
                $(mask_div).show();
            }

            $(el).show();
			
			var ww = $(el).width();
			var hh = $(el).height();
			$(el).css("margin-left", -1 * ww/2 - 20);
			$(el).css("margin-top", -1 * hh/2 - 20);
        });
    },

    imageViewerHide: function () {
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhImageViewer_mask_ifrm";
            var mask_div = "#lwhImageViewer_mask_div";
            var def_settings = $(el).data("default_settings");

            $(el).hide();

            if ($(".lwhImageViewer:visible").length <= 0) {
                $(mask_ifrm).hide();
                $(mask_div).hide();
            }
        });
    }
});

