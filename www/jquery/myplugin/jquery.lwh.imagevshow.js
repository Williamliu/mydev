var LWH = LWH || {};
LWH.ImageVShow = function(opts) {
	$.extend(this.settings , opts);
	this.imgList		= [];
	this.sn				= 0;
	this.imgFrame 		= null;
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
				  _self.initImage();
			  },
			  type: "post",
			  url: "ajax/wmliu_image_list.php"
		  });
	}


	// class constructor
	var _constructor = function() {
		_self.imgCropHtml = [
			'<div class="imageCrop">',
				'<div class="imageCrop-grid imageCrop-grid-h">',
				'</div>',
				'<div class="pixel"></div>',
				'<div class="imageCrop-grid imageCrop-grid-v">',
				'</div>',
			'</div>'
		].join("");

	
		var imgFrame_html = '';
		switch(_self.settings.orient) {
			case "h":
					imgFrame_html = [
						'<div id="lwhImageVShow-' + _self.settings.name + '" class="lwhImageVShow' + (_self.settings.border?' lwhImageVShow-border':'') +  '">',
							'<table border="0" cellspacing="0" cellpadding="0">',
							'<tr>',
								'<td valign="middle">',
									'<div class="lwhImageVShow-content lwhImageVShow-content-h">',
										'<div class="lwhImageVShow-content-window">',
											'<div class="lwhImageVShow-content-view"></div>',
											(_self.settings.crop?_self.imgCropHtml:''),
										'</div>',
									'</div>',
								'</td>',
							'</tr>', 
							'<tr>',
								'<td valign="top">',
									'<div class="lwhImageVShow-list lwhImageVShow-list-h">',
									'</div>',
								'</td>',
							'</tr>',
							'</table>',
						'</div>'
					].join("");

					_self.imgFrame = $(_self.settings.container).append(imgFrame_html)[0].lastChild;
					$(_self.imgFrame).disableSelection();
					$("div.lwhImageVShow-content", $(_self.imgFrame)).width(_self.settings.ww).height(_self.settings.hh);
					$("div.lwhImageVShow-list", $(_self.imgFrame)).width(_self.settings.ww);
				
				break;
			case "v":
					imgFrame_html = [
						'<div id="lwhImageVShow-' + _self.settings.name + '" class="lwhImageVShow' + (_self.settings.border?' lwhImageVShow-border':'') +  '">',
							'<table border="0" cellspacing="0" cellpadding="0">',
							'<tr>',
							'<td valign="top">',
								'<div class="lwhImageVShow-list lwhImageVShow-list-v">',
								'</div>',
							'</td>',
							'<td valign="middle">',
								'<div class="lwhImageVShow-content lwhImageVShow-content-v">',
										'<div class="lwhImageVShow-content-window">',
											'<div class="lwhImageVShow-content-view"></div>',
											(_self.settings.crop?_self.imgCropHtml:''),
										'</div>',
								'</div>',
							'</td>',
							'</tr>', 
							'</table>',
						'</div>'
					].join("");			

					_self.imgFrame = $(_self.settings.container).append(imgFrame_html)[0].lastChild;
					$(_self.imgFrame).disableSelection();
					$("div.lwhImageVShow-content", $(_self.imgFrame)).width(_self.settings.ww).height(_self.settings.hh);
					$("div.lwhImageVShow-list", $(_self.imgFrame)).height(_self.settings.hh);

				break;
			case "hv":
					imgFrame_html = [
						'<div id="lwhImageVShow-' + _self.settings.name + '" class="lwhImageVShow' + (_self.settings.border?' lwhImageVShow-border':'') +  '">',
							'<table border="0" cellspacing="0" cellpadding="0">',
							'<tr>',
								'<td valign="middle">',
									'<div class="lwhImageVShow-content lwhImageVShow-content-hv">',
										'<div class="lwhImageVShow-content-window">',
											'<div class="lwhImageVShow-content-view"></div>',
											(_self.settings.crop?_self.imgCropHtml:''),
										'</div>',
									'</div>',
								'</td>',
							'</tr>', 
							'<tr>',
								'<td valign="top">',
									'<div class="lwhImageVShow-list lwhImageVShow-list-hv">',
									'</div>',
								'</td>',
							'</tr>',
							'</table>',
						'</div>'
					].join("");

					_self.imgFrame = $(_self.settings.container).append(imgFrame_html)[0].lastChild;
					$(_self.imgFrame).disableSelection();
					$("div.lwhImageVShow-content", $(_self.imgFrame)).width(_self.settings.ww).height(_self.settings.hh);
					$("div.lwhImageVShow-list", $(_self.imgFrame)).width(_self.settings.ww);
				break;
		}

		
		
        var imgEdit_html = [
			'<div id="lwhImageVShow-edit' + _self.settings.name + '" class="lwhWrapBox" style="border:1px solid #666666;">',
				'<div class="lwhImageVShow-content" style="padding:10px;">',
					'<input type="hidden" 	id="lwhImageVShow_img_id" 		name="lwhImageVShow_img_id" 	value="" />',
					'<table>',
						'<tr>',
							'<td align="left">' + gcommon.trans[_self.settings.lang].words["subject en"] + '</td>',
							'<td align="left">' + gcommon.trans[_self.settings.lang].words["subject cn"] + '</td>',
						'</tr>',
						'<tr>',
							'<td align="center">',
							'<input type="text" 	id="lwhImageVShow_img_title_en" 	name="lwhImageVShow_img_title_en" style="width:200px;" value="" />',
							'</td>',
							'<td align="center">',
							'<input type="text" 	id="lwhImageVShow_img_title_cn" 	name="lwhImageVShow_img_title_cn" style="width:200px;" value="" />',
							 '</td>',
						'</tr>',
						'<tr>',
							'<td align="left">' + gcommon.trans[_self.settings.lang].words["desc en"] + '</td>',
							'<td align="left">' + gcommon.trans[_self.settings.lang].words["desc cn"] + '</td>',
						'</tr>',
						'<tr>',
							'<td align="center">',
							'<textarea id="lwhImageVShow_img_desc_en" name="lwhImageVShow_img_desc_en" style="width:200px; height:60px;"></textarea>',
							'</td>',
							'<td align="center">',
							'<textarea id="lwhImageVShow_img_desc_cn" name="lwhImageVShow_img_desc_cn" style="width:200px; height:60px;"></textarea>',
							 '</td>',
						'</tr>',
						'<tr>',
							'<td colspan="2" align="left">' + gcommon.trans[_self.settings.lang].words["image url"] + '</td>',
						'</tr>',
						'<tr>',
							'<td colspan="2" align="center">',
							'<input type="text" id="lwhImageVShow_img_url" name="lwhImageVShow_img_url" style="width:420px;" />',
							 '</td>',
						'</tr>',
					'</table>',
					'<div style="padding-top:10px; text-align:center;">',
						'<input type="button" id="lwhImageVShow_img_save" name="lwhImageVShow_img_save" value="' + gcommon.trans[_self.settings.lang].words["save"] + '" />',
					'</div>',
				'</div>',
			'</div>',
        ].join('');

		_self.imgEdit = $("body").append(imgEdit_html)[0].lastChild;
		$(_self.imgEdit).lwhWrapBox();


		$("a.lwhImageVShow-btn-delete", $(_self.imgFrame)).die("click").live("click", function(ev) {
			wait_show();
			var mid 	= $(this).attr("imgid");
			var sn 		= ArraySearch(_self.imgList, "id", mid);
			_self.sn 	= sn;

			$.ajax({
				  data: {
					  imgid: mid
				  },
				  dataType: "json",  
				  error: function(xhr, tStatus, errorTh ) {
					  wait_hide();
					  //alert("Error (wmliu_image_delete.php): " + xhr.responseText + "\nStatus: " + tStatus);
				  },
				  success: function(req, tStatus) {
						wait_hide();
						_self.imgList.splice(_self.sn, 1);
						$(".lwhImageVShow-box[imgid='" + mid + "']", $(_self.imgFrame)).remove();
						_self.initImage();
				  },
				  type: "post",
				  url: "ajax/wmliu_image_delete.php"
			});

		});

		$("a.lwhImageVShow-btn-crop", $(_self.imgFrame)).die("click").live("click", function(ev) {
			var mid 	= $(this).attr("imgid");
			var sn 		= ArraySearch(_self.imgList, "id", mid);

			if( $(this).hasClass("lwhImageVShow-btn-crop-cut") )  {
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
				cropObj.position.x  = $("div.imageCrop", $(_self.imgFrame)).position().left;
				cropObj.position.y  = $("div.imageCrop", $(_self.imgFrame)).position().top;
				cropObj.size	 	= {};
				cropObj.size.w	 	= $("div.imageCrop", $(_self.imgFrame)).width();
				cropObj.size.h	 	= $("div.imageCrop", $(_self.imgFrame)).height();
				cropObj.imgsize		= {};
				cropObj.imgsize.w   = $(".lwhImageVShow-content-view img",$(_self.imgFrame)).width();
				cropObj.imgsize.h   = $(".lwhImageVShow-content-view img",$(_self.imgFrame)).height();
				
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
								$("div.imageCrop", $(_self.imgFrame)).hide();
								$("a.lwhImageVShow-btn-crop", $(_self.imgFrame)).removeClass("lwhImageVShow-btn-crop-cut");
							}
					  },
					  type: "post",
					  url: "ajax/wmliu_image_crop.php"
				});

			} else {
				$("div.imageCrop", $(_self.imgFrame)).show();
				$("div.imageCrop div.pixel", $(_self.imgFrame)).html("Width: " + $("div.imageCrop", $(_self.imgFrame)).width() + " Height:" + $("div.imageCrop", $(_self.imgFrame)).height());
				
				$(this).addClass("lwhImageVShow-btn-crop-cut");
			}
		});

		$("a.lwhImageVShow-btn-reset", $(_self.imgFrame)).die("click").live("click", function(ev) {
			wait_show();
			var mid 	= $(this).attr("imgid");
			var sn 		= ArraySearch(_self.imgList, "id", mid);

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
							$("div.imageCrop", $(_self.imgFrame)).hide();
							$("a.lwhImageVShow-btn-crop", $(_self.imgFrame)).removeClass("lwhImageVShow-btn-crop-cut");
						}
				  },
				  type: "post",
				  url: "ajax/wmliu_image_reset.php"
			});
		});


		$("a.lwhImageVShow-btn-edit", $(_self.imgFrame)).die("click").live("click", function(ev) {
			var mid 	= $(this).attr("imgid");
			var sn 		= ArraySearch(_self.imgList, "id", mid);

			$("#lwhImageVShow_img_id").val("");
			$("#lwhImageVShow_img_title_en").val("");
			$("#lwhImageVShow_img_desc_en").val("");
			$("#lwhImageVShow_img_title_cn").val("");
			$("#lwhImageVShow_img_desc_cn").val("");
			$("#lwhImageVShow_img_url").val("");
			
			if( sn >= 0 ) {
				$("#lwhImageVShow_img_id").val(_self.imgList[sn].id);
				$("#lwhImageVShow_img_title_en").val(_self.imgList[sn].title_en);
				$("#lwhImageVShow_img_desc_en").val(_self.imgList[sn].detail_en);
				$("#lwhImageVShow_img_title_cn").val(_self.imgList[sn].title_cn);
				$("#lwhImageVShow_img_desc_cn").val(_self.imgList[sn].detail_cn);
				$("#lwhImageVShow_img_url").val(_self.imgList[sn].url);
				$(_self.imgEdit).wrapBoxShow();
			}

		});

		$("#lwhImageVShow_img_save", $(_self.imgEdit)).die("click").live("click", function(ev) {
			var mid 	= $("#lwhImageVShow_img_id").val();
			var sn 		= ArraySearch(_self.imgList, "id", mid);
			if( sn >= 0 ) {
				wait_show();
				$.ajax({
					  data: {
						  imgid: 		$.trim( $("#lwhImageVShow_img_id").val() ),
						  title_en:		$.trim( $("#lwhImageVShow_img_title_en").val() ),
						  detail_en:	$.trim( $("#lwhImageVShow_img_desc_en").val() ),
						  title_cn:		$.trim( $("#lwhImageVShow_img_title_cn").val() ),
						  detail_cn:	$.trim( $("#lwhImageVShow_img_desc_cn").val() ),
						  url:			$.trim( $("#lwhImageVShow_img_url").val() )
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
								_self.imgList[sn].title 	= _self.settings.lang=="en"?$.trim( $("#lwhImageVShow_img_title_en").val() ):$.trim( $("#lwhImageVShow_img_title_cn").val() );
								_self.imgList[sn].detail 	= _self.settings.lang=="en"?$.trim( $("#lwhImageVShow_img_desc_en").val() ):$.trim( $("#lwhImageVShow_img_desc_cn").val() );

								_self.imgList[sn].title_en 	= $.trim( $("#lwhImageVShow_img_title_en").val() );
								_self.imgList[sn].detail_en = $.trim( $("#lwhImageVShow_img_desc_en").val() );

								_self.imgList[sn].title_cn 	= $.trim( $("#lwhImageVShow_img_title_cn").val() );
								_self.imgList[sn].detail_cn	= $.trim( $("#lwhImageVShow_img_desc_cn").val() );
								_self.imgList[sn].url		= $.trim( $("#lwhImageVShow_img_url").val() );
								
								if( _self.imgList[sn].title !=""  && _self.settings.tips) {
									if($("div.lwhImageVShow-content-view div.lwhImageVShow-subject", $(_self.imgFrame)).length<=0) 
										$("div.lwhImageVShow-content-view", $(_self.imgFrame)).append('<div class="lwhImageVShow-subject">' + _self.imgList[sn].title + '</div>');
									else 
										$("div.lwhImageVShow-content-view div.lwhImageVShow-subject", $(_self.imgFrame)).html(_self.imgList[sn].title);
								} else {
									$("div.lwhImageVShow-content-view div.lwhImageVShow-subject", $(_self.imgFrame)).remove();
								}
								
								if( _self.imgList[sn].detail !=""  && _self.settings.tips) {
									if( $("div.lwhImageVShow-content-view div.lwhImageVShow-detail", $(_self.imgFrame)).length<=0) 
										$("div.lwhImageVShow-content-view", $(_self.imgFrame)).append('<div class="lwhImageVShow-detail">' + _self.imgList[sn].detail + '</div>');
									else 
										$("div.lwhImageVShow-content-view div.lwhImageVShow-detail", $(_self.imgFrame)).html(_self.imgList[sn].detail);
								} else {
									$("div.lwhImageVShow-content-view div.lwhImageVShow-detail", $(_self.imgFrame)).remove();
								}
								
								$(_self.imgEdit).wrapBoxHide();
							}
					  },
					  type: "post",
					  url: "ajax/wmliu_image_title_save.php"
				});
			}

		});

	}();

}

LWH.ImageVShow.prototype = {
	settings : {
		name:		"",
		lang:		"cn",
		mode:		"small",
		view:		"thumb",
		noimg:		1,
		filter:		"",
		ref_id:		"",

		edit:		false,
		tips:		true,
		border:		1,

		container:	"",
		
		crop:		true,
		cropww:		0,
		crophh:		100,
		
		ww:			300,
		hh:			200,
		orient:		"hv",  // h = horizontal; v = vertical 
		click:		null
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
		var _self 		= this;
		_self.imgList 	= [];
		_self.sn 		= 0;
		$("div.lwhImageVShow-content div.lwhImageVShow-content-view", $(_self.imgFrame)).empty();
		$("div.lwhImageVShow-list", $(_self.imgFrame)).empty();
	},
	
	replace: function( imgObj ) {
		var sn = ArraySearch(this.imgList, "id", imgObj.id);
		this.imgList[sn] = imgObj;
		this.view(imgObj.id);
		$("div.lwhImageVShow-list  div.lwhImageVShow-box img[imgid='" + imgObj.id + "']",$(this.imgFrame)).remove();
		var view_img_html = '<img src="' + imgObj.raw[this.settings.view] + '" sn="' + sn + '" imgid="' + imgObj.id + '" />';
		$("div.lwhImageVShow-list  div.lwhImageVShow-box[imgid='" + imgObj.id + "']", $(this.imgFrame)).append(view_img_html);
	},
	
	append: function(imgObj) {
		this.imgList.push(imgObj);
		this.sn = this.imgList.length-1;
		this.createImage();
 		this.view(imgObj.id);		
	},

	view: function(imgid) {
		var _self 	= this;
		var sn 		= ArraySearch(_self.imgList, "id", imgid);
		if( sn < 0 ) {
			$("div.lwhImageVShow-content div.lwhImageVShow-content-view", $(_self.imgFrame)).empty();

			if(_self.settings.edit) {
				$("div.lwhImageVShow-content a.lwhImageVShow-btn-delete", $(_self.imgFrame)).remove();
				$("div.lwhImageVShow-content a.lwhImageVShow-btn-edit", $(_self.imgFrame)).remove();
				if(_self.settings.crop) {
					$("div.lwhImageVShow-content a.lwhImageVShow-btn-crop", $(_self.imgFrame)).remove();
					$("div.lwhImageVShow-content a.lwhImageVShow-btn-reset", $(_self.imgFrame)).remove();
				}
			}

			$("div.lwhImageVShow-list div.lwhImageVShow-box", $(_self.imgFrame)).removeClass("lwhImageVShow-box-selected");
			return;
		}
		
		var view_url = _self.imgList[sn].raw[_self.settings.mode];
		if( view_url=="") {
			$("div.lwhImageVShow-content div.lwhImageVShow-content-view", $(_self.imgFrame)).empty();

			if(_self.settings.edit) {
				$("div.lwhImageVShow-content a.lwhImageVShow-btn-delete", $(_self.imgFrame)).remove();
				$("div.lwhImageVShow-content a.lwhImageVShow-btn-edit", $(_self.imgFrame)).remove();
				if(_self.settings.crop) {
					$("div.lwhImageVShow-content a.lwhImageVShow-btn-crop", $(_self.imgFrame)).remove();
					$("div.lwhImageVShow-content a.lwhImageVShow-btn-reset", $(_self.imgFrame)).remove();
				}
			}

			$("div.lwhImageVShow-list div.lwhImageVShow-box", $(_self.imgFrame)).removeClass("lwhImageVShow-box-selected");
			return;
		}
		
		var viewImg 	= new Image();
		viewImg.src 	= view_url;
		viewImg.title 	= $.trim(_self.imgList[sn].detail);
		viewImg.subject = $.trim(_self.imgList[sn].title);
		viewImg.onload = function() {
			$("div.lwhImageVShow-content div.lwhImageVShow-content-view", $(_self.imgFrame)).empty();
			if(_self.settings.edit) {
				$("div.lwhImageVShow-content a.lwhImageVShow-btn-delete", $(_self.imgFrame)).remove();
				$("div.lwhImageVShow-content a.lwhImageVShow-btn-edit", $(_self.imgFrame)).remove();
				if(_self.settings.crop) {
					$("div.lwhImageVShow-content a.lwhImageVShow-btn-crop", $(_self.imgFrame)).remove();
					$("div.lwhImageVShow-content a.lwhImageVShow-btn-reset", $(_self.imgFrame)).remove();
				}
			}

			var rate_ww = 1;
			var rate_hh = 1;
			var maxww = _self.settings.ww;
			var maxhh = _self.settings.hh;
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
			
			$("div.lwhImageVShow-content div.lwhImageVShow-content-view", $(_self.imgFrame)).append(viewImg);
			if(viewImg.subject!="" && _self.settings.tips) 	$("div.lwhImageVShow-content div.lwhImageVShow-content-view", $(_self.imgFrame)).append('<div class="lwhImageVShow-subject">' + viewImg.subject + '</div>');
			if(viewImg.title!="" && _self.settings.tips) 	$("div.lwhImageVShow-content div.lwhImageVShow-content-view", $(_self.imgFrame)).append('<div class="lwhImageVShow-detail">' + viewImg.title + '</div>');
			
			
			$("div.lwhImageVShow-list div.lwhImageVShow-box", $(_self.imgFrame)).removeClass("lwhImageVShow-box-selected");
			$("div.lwhImageVShow-list div.lwhImageVShow-box[imgid='" + imgid + "']", $(_self.imgFrame)).addClass("lwhImageVShow-box-selected");

			
			if(_self.settings.edit) {
				$("div.lwhImageVShow-content", $(_self.imgFrame)).append('<a class="lwhImageVShow-btn-delete" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["delete"] + '"></a>');
				$("div.lwhImageVShow-content", $(_self.imgFrame)).append('<a class="lwhImageVShow-btn-edit" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["edit"] + '"></a>');
				if(_self.settings.crop) {				
					$("div.lwhImageVShow-content", $(_self.imgFrame)).append('<a class="lwhImageVShow-btn-crop" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["crop image"] + '"></a>');
					$("div.lwhImageVShow-content", $(_self.imgFrame)).append('<a class="lwhImageVShow-btn-reset" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["reset image"] + '"></a>');
				}
			}


			// crop
			if(_self.settings.crop) {
				var org_ww0 	= _self.settings.cropww;
				var org_hh0 	= _self.settings.crophh;
				
				var win_ww0 	= $(".lwhImageVShow-content-window",$(_self.imgFrame)).width() 	* 0.8;
				var win_hh0 	= $(".lwhImageVShow-content-window",$(_self.imgFrame)).height() * 0.8;
				var win_rate = win_hh0 / win_ww0;

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

				var crop_left = ($(".lwhImageVShow-content-window",$(_self.imgFrame)).width() - crop_ww) / 2;
				var crop_top = ($(".lwhImageVShow-content-window",$(_self.imgFrame)).height() - crop_hh) / 2;
				$("div.imageCrop", $(_self.imgFrame)).css({"top":crop_top, "left":crop_left}).width(crop_ww).height(crop_hh);
		
				$("div.imageCrop", $(_self.imgFrame)).draggable( "destroy" ).draggable({
									containment: $(".lwhImageVShow-content-window", $(_self.imgFrame)),
									drag: function( event, ui ) {
									},
									stop: function( event, ui ) {
									}
									});
				$("div.imageCrop", $(_self.imgFrame)).resizable( "destroy" ).resizable({ 
									containment: $(".lwhImageVShow-content-window", $(_self.imgFrame)),
									minWidth:	 org_ww0?org_ww0:0,
									minHeight:	 org_hh0?org_hh0:0,
									aspectRatio: (_self.settings.cropww>0 && _self.settings.crophh>0?crop_ww/crop_hh:0),
				                    resize: function (event, ui) {
										$(".pixel", $(ui.element)).html("Width: " + $(ui.element).width() + "  Height: " + $(ui.element).height());
				                    },
								 });
								 
				$("div.imageCrop", $(_self.imgFrame)).hide();
			}
			// end of crop
		}	
	},
	
	initImage: function() {
		var _self 	= this;
	  	_self.sn 	= 0;
		$("div.lwhImageVShow-list", $(_self.imgFrame)).empty();
		$("div.lwhImageVShow-content div.lwhImageVShow-content-view", $(_self.imgFrame)).empty();
		 $("div.imageCrop", $(_self.imgFrame)).hide();
		if( _self.imgList.length > 0 ) {
			for(var i = 0; i < _self.imgList.length; i++) {
				_self.sn = i;
				_self.createImage();	
			}
			_self.view(_self.imgList[0].id);
		} else {
			_self.view(-1);
		}
	},

	createImage: function() {
			var _self = this;
			if( _self.sn < 0 ) _self.sn = 0;
			if( _self.sn > _self.imgList.length - 1 ) _self.sn = _self.imgList.length - 1;
			var imgid = _self.imgList[_self.sn].id; 
			
			if( $("div.lwhImageVShow-list  div.lwhImageVShow-box img[imgid='" + imgid + "']",$(_self.imgFrame)).length > 0 ) return; 
			
			var img_html = '';
			switch( _self.settings.orient ) {
				case "h":
					img_html = [
						'<div class="lwhImageVShow-box lwhImageVShow-box-h" sn="' + _self.sn + '" imgid="' + imgid + '">',
							'<img src="' + _self.imgList[_self.sn].raw[_self.settings.view] + '" sn="' + _self.sn + '" imgid="' + imgid + '" />',
						'</div>'
					].join('');
					break;
				case "v":
					img_html = [
						'<div class="lwhImageVShow-box lwhImageVShow-box-v" sn="' + _self.sn + '" imgid="' + imgid + '">',
							'<img src="' + _self.imgList[_self.sn].raw[_self.settings.view] + '" sn="' + _self.sn + '" imgid="' + imgid + '" />',
						'</div>'
					].join('');
					break;
				case "hv":
					img_html = [
						'<div class="lwhImageVShow-box lwhImageVShow-box-hv" sn="' + _self.sn + '" imgid="' + imgid + '">',
							'<img src="' + _self.imgList[_self.sn].raw[_self.settings.view] + '" sn="' + _self.sn + '" imgid="' + imgid + '" />',
						'</div>'
					].join('');
					break;
			}
			
			var imgBox = $("div.lwhImageVShow-list", $(_self.imgFrame)).append(img_html)[0].lastChild;
			//var imgel  = $("img", $(imgBox))[0].lastChild;


			if(_self.settings.edit) {
				$("div.lwhImageVShow-list", $(_self.imgFrame)).sortable("destroy").sortable({
							start: function(ev,ui) {
								_self.view($(ui.item).attr("imgid"));
							},
							stop: function(ev, ui) {
								
									var schema		={};
									schema.lang 	= _self.settings.lang;
									schema.filter 	= _self.settings.filter;
									schema.ref_id 	= _self.settings.ref_id;
									schema.mode		= _self.settings.mode;
									schema.view 	= _self.settings.view;
									schema.noimg	= _self.settings.noimg;
								
									var sortArr = [];
									$("div.lwhImageVShow-box", $(_self.imgFrame)).each(function(idx,el){
										var sortObj = {};
										sortObj.imgid 	= $(el).attr("imgid");
										sortObj.sn 		= idx + 1;
										sortArr.push(sortObj);
									});
									
									$.ajax({
										  data: {
												schema:	schema,
												list: 	sortArr
										  },
										  dataType: "json",  
										  error: function(xhr, tStatus, errorTh ) {
											  alert("Error (wmliu_image_resort.php): " + xhr.responseText + "\nStatus: " + tStatus);
										  },
										  success: function(req, tStatus) {
											  _self.imgList = req.data.imgList;
										  },
										  type: "post",
										  url: "ajax/wmliu_image_resort.php"
									});
							}
				});
			}

			$("div.lwhImageVShow-list", $(_self.imgFrame)).disableSelection();

			// click on image to image viewer
			imgBox.onclick = function() {
			 	var imgid 	= $(imgBox).attr("imgid");
				_self.view(imgid);
				
				var sn = ArraySearch(_self.imgList, "id", imgid);
				if( _self.settings.click ) if($.isFunction(_self.settings.click)) _self.settings.click(_self.imgList[sn]);
			}
			// end of img viewer

	}
		
}
