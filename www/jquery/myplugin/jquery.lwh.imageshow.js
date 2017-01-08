var LWH = LWH || {};
LWH.ImageShow = function(opts) {
	// important : this.settings and prototype.settings  totally different,   
	// prototype function using this point to prototype 
	// this.settings  :  it is object instance variable for each object.
	this.settings = {
		name:		"",
		lang:		"cn",
		mode:		"medium",
		view:		"tiny",
		filter:		"",
		ref_id:		"",
		img_id:		"",
		noimg:		1,
		
		single:		false,
		edit:		false,
		tips:		false,

		crop:		true,
		cropww:		100,
		crophh:		100,
		
		ww:			120,
		hh:			120,
		imgww:		400,
		imghh:		300,
		orient:		"hv",
		
		before:		null,
		after:		null,
		append:		null,
		setlist:	null,
		clear:		null,
		fresh:		null,

		callBack:	null
	};

	$.extend(this.settings , opts);
	this.imgList		= [];
	this.imgObj			= {};

	this.imgView 		= null;
	this.imgEdit		= null;
	this.imgCropHtml 	= '';
	
	var _self 			= this;

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

			var imgView_html = '';
			if(_self.settings.single) {
					// image single mode
					imgView_html = [
						'<div id="lwhImageEditor-' + _self.settings.name + '" class="lwhImageEditor">',
							'<div class="lwhImageEditor-content">',
									'<div class="lwhImageEditor-content-window">',
										'<div class="lwhImageEditor-content-view"></div>',
										(_self.settings.crop?_self.imgCropHtml:''),
									'</div>',
							'</div>',
						'</div>',
					].join('');
			
					_self.imgView = $("body").append(imgView_html)[0].lastChild;
					$(_self.imgView).lwhImageEditor();
					$(_self.imgView).disableSelection();
			} else {
					// image list mode 
					switch(_self.settings.orient) {
						case "v":
								imgView_html = [
									'<div id="lwhImageEditor-' + _self.settings.name + '" class="lwhImageEditor">',
										'<table border="0" cellspacing="0" cellpadding="0">',
										'<tr>',
										'<td valign="top">',
											'<div class="lwhImageEditor-list lwhImageEditor-list-v">',
											'</div>',
										'</td>',
										'<td valign="top">',
											'<div class="lwhImageEditor-content lwhImageEditor-content-v">',
												'<div class="lwhImageEditor-content-window">',
													'<div class="lwhImageEditor-content-view"></div>',
													(_self.settings.crop?_self.imgCropHtml:''),
												'</div>',
											'</div>',
										'</td>',
										'</tr>', 
										'</table>',
									'</div>',
								].join('');
								_self.imgView = $("body").append(imgView_html)[0].lastChild;
								$(_self.imgView).lwhImageEditor();
								$(_self.imgView).disableSelection();
						
								$("div.lwhImageEditor-content", $(_self.imgView)).width(_self.settings.imgww).height(_self.settings.imghh);
								$("div.lwhImageEditor-list", $(_self.imgView)).height(_self.settings.imghh);
							break;
						case "h":
								imgView_html = [
									'<div id="lwhImageEditor-' + _self.settings.name + '" class="lwhImageEditor">',
										'<table border="0" cellspacing="0" cellpadding="0">',
										'<tr>',
											'<td valign="top">',
												'<div class="lwhImageEditor-content lwhImageEditor-content-h">',
													'<div class="lwhImageEditor-content-window">',
														'<div class="lwhImageEditor-content-view"></div>',
														(_self.settings.crop?_self.imgCropHtml:''),
													'</div>',
												'</div>',
											'</td>',
										'</tr>', 
										'<tr>',
											'<td valign="top">',
												'<div class="lwhImageEditor-list lwhImageEditor-list-h">',
												'</div>',
											'</td>',
										'</tr>', 
										'</table>',
									'</div>',
								].join('');
								_self.imgView = $("body").append(imgView_html)[0].lastChild;
								$(_self.imgView).lwhImageEditor();
								$(_self.imgView).disableSelection();
						
								$("div.lwhImageEditor-content", $(_self.imgView)).width(_self.settings.imgww).height(_self.settings.imghh);
								$("div.lwhImageEditor-list", $(_self.imgView)).width(_self.settings.imgww);
							break;
						case "hv":
								imgView_html = [
									'<div id="lwhImageEditor-' + _self.settings.name + '" class="lwhImageEditor">',
										'<table border="0" cellspacing="0" cellpadding="0">',
										'<tr>',
											'<td valign="top">',
												'<div class="lwhImageEditor-content lwhImageEditor-content-hv">',
													'<div class="lwhImageEditor-content-window">',
														'<div class="lwhImageEditor-content-view"></div>',
														(_self.settings.crop?_self.imgCropHtml:''),
													'</div>',
												'</div>',
											'</td>',
										'</tr>', 
										'<tr>',
											'<td valign="top">',
												'<div class="lwhImageEditor-list lwhImageEditor-list-hv">',
												'</div>',
											'</td>',
										'</tr>', 
										'</table>',
									'</div>',
								].join('');
								_self.imgView = $("body").append(imgView_html)[0].lastChild;
								$(_self.imgView).lwhImageEditor();
								$(_self.imgView).disableSelection();
						
								$("div.lwhImageEditor-content", $(_self.imgView)).width(_self.settings.imgww).height(_self.settings.imghh);
								$("div.lwhImageEditor-list", $(_self.imgView)).width(_self.settings.imgww);
							break;
					}
					
					$("div.lwhImageEditor-list div.lwhImageEditor-box", $(_self.imgView)).die("click").live("click", function(ev) {
						var imgid = $(this).attr("imgid");
						_self.view(imgid);
					});
					// end of image list mode
			}
			// crop image functions
			$("a.lwhImageEditor-btn-delete", $(_self.imgView)).die("click").live("click", function(ev) {
				var mid = "";
				var sn	= -1;
				wait_show();
				if(_self.settings.single) {
					mid 	= _self.imgObj.id;
				} else {
					mid 	= $(this).attr("imgid");
					sn 		= ArraySearch(_self.imgList, "id", mid);
				}
				
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

							if(_self.settings.single) {
								_self.imgObj = {};
								_self.view(-1);
							} else {
								_self.imgList.splice(sn, 1);
								$(".lwhImageEditor-box[imgid='" + mid + "']", $(_self.imgView)).remove();
								_self.initImage();
								if(_self.imgList.length>0) {
									_self.view(_self.imgList[0].id);
								} else {
									_self.view(-1);
								}
							}
							_self.replace({});
					  },
					  type: "post",
					  url: "ajax/wmliu_image_delete.php"
				});
	
			});
	
	
			$("a.lwhImageEditor-btn-crop", $(_self.imgView)).die("click").live("click", function(ev) {
				var mid = "";
				var sn	= -1;
				if(_self.settings.single) {
					mid 	= _self.imgObj.id;
				} else {
					mid 	= $(this).attr("imgid");
					sn 		= ArraySearch(_self.imgList, "id", mid);
				}
				if( $(this).hasClass("lwhImageEditor-btn-crop-cut") )  {
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
					cropObj.imgsize.w   = $(".lwhImageEditor-content-view img",$(_self.imgView)).width();
					cropObj.imgsize.h   = $(".lwhImageEditor-content-view img",$(_self.imgView)).height();
					
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
									$("a.lwhImageEditor-btn-crop", $(_self.imgView)).removeClass("lwhImageVShow-btn-crop-cut");
									if( _self.settings.cropCall ) if( $.isFunction(_self.settings.cropCall) ) _self.settings.cropCall(req.data.imgObj);
								}
						  },
						  type: "post",
						  url: "ajax/wmliu_image_crop.php"
					});
	
				} else {
					$("div.imageCrop", $(_self.imgView)).show();
					$("div.imageCrop div.pixel", $(_self.imgView)).html("Width: " + $("div.imageCrop", $(_self.imgView)).width() + " Height:" + $("div.imageCrop", $(_self.imgView)).height());
					$(this).addClass("lwhImageEditor-btn-crop-cut");
				}
			});
	
			$("a.lwhImageEditor-btn-reset", $(_self.imgView)).die("click").live("click", function(ev) {
				wait_show();
				var mid = "";
				var sn	= -1;
				if(_self.settings.single) {
					mid 	= _self.imgObj.id;
				} else {
					mid 	= $(this).attr("imgid");
					sn 		= ArraySearch(_self.imgList, "id", mid);
				}
				
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
								$("a.lwhImageEditor-btn-crop", $(_self.imgView)).removeClass("lwhImageEditor-btn-crop-cut");
								if( _self.settings.cropCall ) if( $.isFunction(_self.settings.cropCall) ) _self.settings.cropCall(req.data.imgObj);
							}
					  },
					  type: "post",
					  url: "ajax/wmliu_image_reset.php"
				});
			});
			// end of crop image functions


//$(_self.imgView).imageEditorShow();



			var imgEdit_html = [
				'<div id="lwhImageEditor-edit' + _self.settings.name + '" class="lwhImageEditor" style="border:1px solid #666666;">',
					'<div class="lwhImageEditor-content" style="padding:10px;">',
						'<input type="hidden" 	id="lwhImageEditor_img_id" 		name="lwhImageEditor_img_id" 	value="" />',
						'<table>',
							'<tr>',
								'<td align="left">' + gcommon.trans[_self.settings.lang].words["subject en"] + '</td>',
								'<td align="left">' + gcommon.trans[_self.settings.lang].words["subject cn"] + '</td>',
							'</tr>',
							'<tr>',
								'<td align="center">',
								'<input type="text" 	id="lwhImageEditor_img_title_en" 	name="lwhImageEditor_img_title_en" style="width:200px;" value="" />',
								'</td>',
								'<td align="center">',
								'<input type="text" 	id="lwhImageEditor_img_title_cn" 	name="lwhImageEditor_img_title_cn" style="width:200px;" value="" />',
								 '</td>',
							'</tr>',
							'<tr>',
								'<td align="left">' + gcommon.trans[_self.settings.lang].words["desc en"] + '</td>',
								'<td align="left">' + gcommon.trans[_self.settings.lang].words["desc cn"] + '</td>',
							'</tr>',
							'<tr>',
								'<td align="center">',
								'<textarea id="lwhImageEditor_img_desc_en" name="lwhImageEditor_img_desc_en" style="width:200px; height:60px;"></textarea>',
								'</td>',
								'<td align="center">',
								'<textarea id="lwhImageEditor_img_desc_cn" name="lwhImageEditor_img_desc_cn" style="width:200px; height:60px;"></textarea>',
								 '</td>',
							'</tr>',
							'<tr>',
								'<td colspan="2" align="left">' + gcommon.trans[_self.settings.lang].words["image url"] + '</td>',
							'</tr>',
							'<tr>',
								'<td colspan="2" align="center">',
								'<input type="text" id="lwhImageEditor_img_url" name="lwhImageEditor_img_url" style="width:420px;" />',
								 '</td>',
							'</tr>',
						'</table>',
						'<div style="padding-top:10px; text-align:center;">',
							'<input type="button" id="lwhImageEditor_img_save" name="lwhImageEditor_img_save" value="' + gcommon.trans[_self.settings.lang].words["save"] + '" />',
						'</div>',
					'</div>',
				'</div>',
			].join('');
	
			_self.imgEdit = $("body").append(imgEdit_html)[0].lastChild;
			$(_self.imgEdit).lwhImageEditor();
			//$(_self.imgEdit).imageEditorShow();
			
		$("a.lwhImageEditor-btn-edit", $(_self.imgView)).die("click").live("click", function(ev) {

			$("#lwhImageEditor_img_id").val("");
			$("#lwhImageEditor_img_title_en").val("");
			$("#lwhImageEditor_img_desc_en").val("");
			$("#lwhImageEditor_img_title_cn").val("");
			$("#lwhImageEditor_img_desc_cn").val("");
			$("#lwhImageEditor_img_url").val("");
			
			if( _self.settings.single) {
				if(_self.imgObj.id>0) {
					$("#lwhImageEditor_img_id").val(_self.imgObj.id);
					$("#lwhImageEditor_img_title_en").val(_self.imgObj.title_en);
					$("#lwhImageEditor_img_desc_en").val(_self.imgObj.detail_en);
					$("#lwhImageEditor_img_title_cn").val(_self.imgObj.title_cn);
					$("#lwhImageEditor_img_desc_cn").val(_self.imgObj.detail_cn);
					$("#lwhImageEditor_img_url").val(_self.imgObj.url);
					$(_self.imgEdit).imageEditorShow();
				}
			} else {
				var mid 	= $(this).attr("imgid");
				var sn 		= ArraySearch(_self.imgList, "id", mid);
				if( sn >= 0 ) {
					$("#lwhImageEditor_img_id").val(_self.imgList[sn].id);
					$("#lwhImageEditor_img_title_en").val(_self.imgList[sn].title_en);
					$("#lwhImageEditor_img_desc_en").val(_self.imgList[sn].detail_en);
					$("#lwhImageEditor_img_title_cn").val(_self.imgList[sn].title_cn);
					$("#lwhImageEditor_img_desc_cn").val(_self.imgList[sn].detail_cn);
					$("#lwhImageEditor_img_url").val(_self.imgList[sn].url);
					$(_self.imgEdit).imageEditorShow();
				}
			}

		});
		
		// image information save
		$("#lwhImageEditor_img_save", $(_self.imgEdit)).die("click").live("click", function(ev) {
			var mid 	= $("#lwhImageEditor_img_id").val();
			var sn 		= ArraySearch(_self.imgList, "id", mid);
			var ok 		= false;
			if( _self.settings.single) {
				if(_self.imgObj.id>0) ok = true;
			} else {
				if(sn>=0) ok = true;
			}
		
			if( ok >= 0 ) {
				wait_show();
				$.ajax({
					  data: {
						  imgid: 		$.trim( $("#lwhImageEditor_img_id").val() ),
						  title_en:		$.trim( $("#lwhImageEditor_img_title_en").val() ),
						  detail_en:	$.trim( $("#lwhImageEditor_img_desc_en").val() ),
						  title_cn:		$.trim( $("#lwhImageEditor_img_title_cn").val() ),
						  detail_cn:	$.trim( $("#lwhImageEditor_img_desc_cn").val() ),
						  url:			$.trim( $("#lwhImageEditor_img_url").val() )
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
								
								if(_self.settings.single) {
									_self.imgObj.title 	= _self.settings.lang=="en"?$.trim( $("#lwhImageEditor_img_title_en").val() ):$.trim( $("#lwhImageEditor_img_title_cn").val() );
									_self.imgObj.detail 	= _self.settings.lang=="en"?$.trim( $("#lwhImageEditor_img_desc_en").val() ):$.trim( $("#lwhImageEditor_img_desc_cn").val() );
	
									_self.imgObj.title_en 	= $.trim( $("#lwhImageEditor_img_title_en").val() );
									_self.imgObj.detail_en = $.trim( $("#lwhImageEditor_img_desc_en").val() );
	
									_self.imgObj.title_cn 	= $.trim( $("#lwhImageEditor_img_title_cn").val() );
									_self.imgObj.detail_cn	= $.trim( $("#lwhImageEditor_img_desc_cn").val() );
									_self.imgObj.url		= $.trim( $("#lwhImageEditor_img_url").val() );
									
									if( _self.imgObj.title !=""  && _self.settings.tips) {
										if($("div.lwhImageEditor-content-view div.lwhImageEditor-subject", $(_self.imgView)).length<=0) 
											$("div.lwhImageEditor-content-view", $(_self.imgView)).append('<div class="lwhImageEditor-subject">' + _self.imgObj.title + '</div>');
										else 
											$("div.lwhImageEditor-content-view div.lwhImageEditor-subject", $(_self.imgView)).html(_self.imgObj.title);
									} else {
										$("div.lwhImageEditor-content-view div.lwhImageEditor-subject", $(_self.imgView)).remove();
									}
									
									if( _self.imgObj.detail !=""  && _self.settings.tips) {
										if( $("div.lwhImageEditor-content-view div.lwhImageEditor-detail", $(_self.imgView)).length<=0) 
											$("div.lwhImageEditor-content-view", $(_self.imgView)).append('<div class="lwhImageEditor-detail">' + _self.imgObj.detail + '</div>');
										else 
											$("div.lwhImageEditor-content-view div.lwhImageEditor-detail", $(_self.imgView)).html(_self.imgObj.detail);
									} else {
										$("div.lwhImageEditor-content-view div.lwhImageEditor-detail", $(_self.imgView)).remove();
									}
								} else {
									_self.imgList[sn].title 	= _self.settings.lang=="en"?$.trim( $("#lwhImageEditor_img_title_en").val() ):$.trim( $("#lwhImageEditor_img_title_cn").val() );
									_self.imgList[sn].detail 	= _self.settings.lang=="en"?$.trim( $("#lwhImageEditor_img_desc_en").val() ):$.trim( $("#lwhImageEditor_img_desc_cn").val() );
	
									_self.imgList[sn].title_en 	= $.trim( $("#lwhImageEditor_img_title_en").val() );
									_self.imgList[sn].detail_en = $.trim( $("#lwhImageEditor_img_desc_en").val() );
	
									_self.imgList[sn].title_cn 	= $.trim( $("#lwhImageEditor_img_title_cn").val() );
									_self.imgList[sn].detail_cn	= $.trim( $("#lwhImageEditor_img_desc_cn").val() );
									_self.imgList[sn].url		= $.trim( $("#lwhImageEditor_img_url").val() );
									
									if( _self.imgList[sn].title !=""  && _self.settings.tips) {
										if($("div.lwhImageEditor-content-view div.lwhImageEditor-subject", $(_self.imgView)).length<=0) 
											$("div.lwhImageEditor-content-view", $(_self.imgView)).append('<div class="lwhImageEditor-subject">' + _self.imgList[sn].title + '</div>');
										else 
											$("div.lwhImageEditor-content-view div.lwhImageEditor-subject", $(_self.imgView)).html(_self.imgList[sn].title);
									} else {
										$("div.lwhImageEditor-content-view div.lwhImageEditor-subject", $(_self.imgView)).remove();
									}
									
									if( _self.imgList[sn].detail !=""  && _self.settings.tips) {
										if( $("div.lwhImageEditor-content-view div.lwhImageEditor-detail", $(_self.imgView)).length<=0) 
											$("div.lwhImageEditor-content-view", $(_self.imgView)).append('<div class="lwhImageEditor-detail">' + _self.imgList[sn].detail + '</div>');
										else 
											$("div.lwhImageEditor-content-view div.lwhImageEditor-detail", $(_self.imgView)).html(_self.imgList[sn].detail);
									} else {
										$("div.lwhImageEditor-content-view div.lwhImageEditor-detail", $(_self.imgView)).remove();
									}
								}
								$(_self.imgEdit).imageEditorHide();
							}
					  },
					  type: "post",
					  url: "ajax/wmliu_image_title_save.php"
				});
			}

		});
		// end of image information save
			
	}();

}

LWH.ImageShow.prototype = {
	filter : function(v) {
		if(v) {
			this.settings.filter = v;
			if(this.settings.single)
				this.ajaxSingle();
			else 
				this.ajaxCall();
		}
		return this.settings.filter;
	},
	
	refid:	function(v) {
		if(v) { 
			this.settings.ref_id = v;
			this.settings.img_id = "";
			if(this.settings.single) 
				this.ajaxSingle();
			else 
				this.ajaxCall();
		}
		return this.settings.ref_id;
	},

	setList: function(oList) {
		this.imgList = oList;
		if( this.settings.setlist ) if( $.isFunction(this.settings.setlist) ) this.settings.setlist(this.settings, this.imgList);		
	},


	imgid:	function(v) {
		if(v) { 
			this.settings.img_id = v;
			this.settings.ref_id = "";
			if(this.settings.single) 
				this.ajaxSingle();
			else 
				this.ajaxCall();
		}
		return this.settings.img_id;
	},

	imgobj: function(v) {
		if(v) {
			this.imgObj = v;
			this.settings.img_id = v.id;
			this.view(v.id)
		} 
		return this.imgObj;
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
		
		if(vo.imgid) {
			this.settings.img_id = vo.imgid;
			ff = true;
		}

		if( this.settings.single) 
			if(ff) this.ajaxSingle();
		else 
			if(ff) this.ajaxCall();
	},
	
	
	clear: function() {
		this.imgList 	= [];
		this.imgObj 	= {};
		if( this.settings.clear ) if( $.isFunction(this.settings.clear) ) this.settings.clear(this.settings, this.imgList);		
	},
	
	fresh: function() {
		this.imgList = [];
		this.imgObj 	= {};
		if( this.settings.fresh ) if( $.isFunction(this.settings.fresh) ) this.settings.fresh(this.settings, this.imgList);		
		if( this.settings.single )
			this.ajaxSingle();
		else 
			this.ajaxCall();
	},
	
	append: function(imgObj) {
		this.imgList.push(imgObj);
		if( this.settings.append ) if( $.isFunction(this.settings.append) ) this.settings.append(this.settings, this.imgList, imgObj);		
	},

	initImage: function() {
		var _self 	= this;
	  	_self.sn 	= 0;
		 $("div.lwhImageEditor-list  div.lwhImageEditor-box", $(_self.imgView)).remove();
		 $("div.imageCrop", $(_self.imgView)).hide();
		 
		if( _self.imgList.length > 0 ) {
			for(var i = 0; i < _self.imgList.length; i++) {
				_self.createImage(i);	
			}

		} 
	},
	
	initSingle: function() {
		this.view();
	},
	
	createImage: function(cursn) {
		var _self = this;
		if( _self.imgList[cursn] ) 
		if( _self.imgList[cursn].raw[_self.settings.mode] ) {

				var img_url  = _self.imgList[cursn].raw[_self.settings.mode];  //'ajax/wmliu_getimage.php?mode=' + mode + '&imgid=' + _self.idList[cursn];
				var img 	= new Image();
				img.src 	= img_url;
				img.sn		= cursn;
				img.imgid	= _self.imgList[cursn].id;
				
				if( $("div.lwhImageEditor-list  div.lwhImageEditor-box[imgid='" + img.imgid + "']", $(_self.imgView)).length <= 0 ) { 
						var thumb_html = '';
						switch( _self.settings.orient ) {
							case "v":
								thumb_html = [
									'<div class="lwhImageEditor-box lwhImageEditor-box-v" sn="' + img.sn + '" imgid="' + img.imgid + '">',
										'<img src="' + _self.imgList[img.sn].raw[_self.settings.view] + '" sn="' + img.sn + '" imgid="' +  img.imgid + '" />',
									'</div>'
								].join('');
								break;
							case "h":
								thumb_html = [
									'<div class="lwhImageEditor-box lwhImageEditor-box-h" sn="' + img.sn + '" imgid="' + img.imgid + '">',
										'<img src="' + _self.imgList[img.sn].raw[_self.settings.view] + '" sn="' + img.sn + '" imgid="' +  img.imgid + '" />',
									'</div>'
								].join('');
								break;
							case "hv":
								thumb_html = [
									'<div class="lwhImageEditor-box lwhImageEditor-box-hv" sn="' + img.sn + '" imgid="' + img.imgid + '">',
										'<img src="' + _self.imgList[img.sn].raw[_self.settings.view] + '" sn="' + img.sn + '" imgid="' +  img.imgid + '" />',
									'</div>'
								].join('');
								break;
						}
						var thumbBox = $("div.lwhImageEditor-list", $(_self.imgView)).append(thumb_html)[0].lastChild;
		
						if(_self.settings.edit) {
							$("div.lwhImageEditor-list", $(_self.imgView)).sortable("destroy").sortable({
										containment: "parent",
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
												$("div.lwhImageEditor-box", $(_self.imgView)).each(function(idx,el){
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
															_self.sn = ArraySearch(_self.imgList, "id", $(ui.item).attr("imgid"));
															/*
															if( _self.imgList.length > 0 ) {
																for(var i = 0; i < _self.imgList.length; i++) {
																	_self.createImage(i);	
																}
															} 
															_self.view($(ui.item).attr("imgid"));
													  		*/
													  },
													  type: "post",
													  url: "ajax/wmliu_image_resort.php"
												});
										}
							});
						}
			
						$("div.lwhImageEditor-list", $(_self.imgView)).disableSelection();

				}
		}
	},
	
	view: function(imgid) {
		var _self 	= this;
		var sn 		= -1;
		if(_self.settings.single) {
				
				$("div.lwhImageEditor-content div.lwhImageEditor-content-view", $(_self.imgView)).empty();
	
				if(_self.settings.edit) {
					$("div.lwhImageEditor-content a.lwhImageEditor-btn-delete", $(_self.imgView)).remove();
					$("div.lwhImageEditor-content a.lwhImageEditor-btn-edit", $(_self.imgView)).remove();
					
					if(_self.settings.crop) {
						$("div.lwhImageEditor-content a.lwhImageEditor-btn-crop", $(_self.imgView)).remove();
						$("div.lwhImageEditor-content a.lwhImageEditor-btn-reset", $(_self.imgView)).remove();
					}
				}

				if(imgid<=0) { 
					$(_self.imgView).imageEditorHide();
					return;
				}
		} else {

			sn 	= ArraySearch(_self.imgList, "id", imgid);
			if( sn < 0 ) {
				$("div.lwhImageEditor-content div.lwhImageEditor-content-view", $(_self.imgView)).empty();
	
				if(_self.settings.edit) {
					$("div.lwhImageEditor-content a.lwhImageEditor-btn-delete", $(_self.imgView)).remove();
					$("div.lwhImageEditor-content a.lwhImageEditor-btn-edit", $(_self.imgView)).remove();
					
					if(_self.settings.crop) {
						$("div.lwhImageEditor-content a.lwhImageEditor-btn-crop", $(_self.imgView)).remove();
						$("div.lwhImageEditor-content a.lwhImageEditor-btn-reset", $(_self.imgView)).remove();
					}
				}
	
				$("div.lwhImageEditor-list div.lwhImageEditor-box", $(_self.imgView)).removeClass("lwhImageEditor-box-selected");
				$(_self.imgView).imageEditorHide();
				return;
			}

		}
		
		var view_url = "";
		if(_self.settings.single) {
			if(_self.imgObj.raw) view_url = _self.imgObj.raw[_self.settings.mode];
		} else {
			if(_self.imgList[sn]) if(_self.imgList[sn].raw)
				view_url = _self.imgList[sn].raw[_self.settings.mode];
		}
		
		if( view_url=="") {
			$("div.lwhImageEditor-content div.lwhImageEditor-content-view", $(_self.imgView)).empty();

			if(_self.settings.edit) {
				$("div.lwhImageEditor-content a.lwhImageEditor-btn-delete", $(_self.imgView)).remove();
				$("div.lwhImageEditor-content a.lwhImageEditor-btn-edit", $(_self.imgView)).remove();
				if(_self.settings.crop) {
					$("div.lwhImageEditor-content a.lwhImageEditor-btn-crop", $(_self.imgView)).remove();
					$("div.lwhImageEditor-content a.lwhImageEditor-btn-reset", $(_self.imgView)).remove();
				}
			}

			if(!_self.settings.single) $("div.lwhImageEditor-list div.lwhImageEditor-box", $(_self.imgView)).removeClass("lwhImageEditor-box-selected");
			return;
		}
		
		var viewImg 	= new Image();
		viewImg.src 	= view_url;
		if(_self.settings.single) {
			viewImg.title 	= $.trim(_self.imgObj.detail);
			viewImg.subject = $.trim(_self.imgObj.title);
		} else {
			viewImg.title 	= $.trim(_self.imgList[sn].detail);
			viewImg.subject = $.trim(_self.imgList[sn].title);
		}
		viewImg.onload = function() {
			$("div.lwhImageEditor-content div.lwhImageEditor-content-view", $(_self.imgView)).empty();
			if(_self.settings.edit) {
				$("div.lwhImageEditor-content a.lwhImageEditor-btn-delete", $(_self.imgView)).remove();
				$("div.lwhImageEditor-content a.lwhImageEditor-btn-edit", $(_self.imgView)).remove();
				if(_self.settings.crop) {
					$("div.lwhImageEditor-content a.lwhImageEditor-btn-crop", $(_self.imgView)).remove();
					$("div.lwhImageEditor-content a.lwhImageEditor-btn-reset", $(_self.imgView)).remove();
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
			
			$("div.lwhImageEditor-content div.lwhImageEditor-content-view", $(_self.imgView)).append(viewImg);
			if(viewImg.subject!="" && _self.settings.tips) 	$("div.lwhImageEditor-content div.lwhImageEditor-content-view", $(_self.imgView)).append('<div class="lwhImageEditor-subject">' + viewImg.subject + '</div>');
			if(viewImg.title!="" && _self.settings.tips) 	$("div.lwhImageEditor-content div.lwhImageEditor-content-view", $(_self.imgView)).append('<div class="lwhImageEditor-detail">' + viewImg.title + '</div>');
			
			
			$("div.lwhImageEditor-list div.lwhImageEditor-box", $(_self.imgView)).removeClass("lwhImageEditor-box-selected");
			$("div.lwhImageEditor-list div.lwhImageEditor-box[imgid='" + imgid + "']", $(_self.imgView)).addClass("lwhImageEditor-box-selected");

			
			if(_self.settings.edit) {
				$("div.lwhImageEditor-content", $(_self.imgView)).append('<a class="lwhImageEditor-btn-delete" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["delete"] + '"></a>');
				$("div.lwhImageEditor-content", $(_self.imgView)).append('<a class="lwhImageEditor-btn-edit" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["edit"] + '"></a>');
				if(_self.settings.crop) {				
					$("div.lwhImageEditor-content", $(_self.imgView)).append('<a class="lwhImageEditor-btn-crop" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["crop image"] + '"></a>');
					$("div.lwhImageEditor-content", $(_self.imgView)).append('<a class="lwhImageEditor-btn-reset" 	sn="' + sn + '" imgid="' + imgid + '" title="' + gcommon.trans[_self.settings.lang].words["reset image"] + '"></a>');
				}
			}
			

			// after loaded,   el  width and height will be ok.  otherwise ....
			_self.sn = sn;	
			$(_self.imgView).imageEditorShow();
			if(_self.settings.single) {
				if( _self.settings.callBack ) if( $.isFunction(_self.settings.callBack) ) _self.settings.callBack(_self.imgObj);
			} else {
				if( _self.settings.callBack ) if( $.isFunction(_self.settings.callBack) ) _self.settings.callBack(_self.imgList[sn]);
			}
			// before crop,  must show window  to  have width & height  > 0 			
			
			
			// crop
			if(_self.settings.crop) {
				var org_ww0 	= _self.settings.cropww;
				var org_hh0 	= _self.settings.crophh;
				
				var win_ww0 	= $(".lwhImageEditor-content-window",$(_self.imgView)).width() 	* 0.8;
				var win_hh0 	= $(".lwhImageEditor-content-window",$(_self.imgView)).height() * 0.8;
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

				var crop_left = ($(".lwhImageEditor-content-window",$(_self.imgView)).width() - crop_ww) / 2;
				var crop_top = ($(".lwhImageEditor-content-window",$(_self.imgView)).height() - crop_hh) / 2;
				$("div.imageCrop", $(_self.imgView)).css({"top":crop_top, "left":crop_left}).width(crop_ww).height(crop_hh);
		
				$("div.imageCrop", $(_self.imgView)).draggable( "destroy" ).draggable({
										containment: $(".lwhImageEditor-content-window", _self.imgView),
										drag: function( event, ui ) {
										},
										stop: function( event, ui ) {
										}
									});

				$("div.imageCrop", $(_self.imgView)).resizable( "destroy" ).resizable({ 
									containment: $(".lwhImageEditor-content-window", _self.imgView),
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

		} 
		// end of img onload
	},

	replace: function( imgObj ) {
		var _self = this;
		if( imgObj.id ) { // update case
			if(_self.settings.single) {
				this.imgObj = imgObj;
				this.view(imgObj.id);
			} else {
				var sn = ArraySearch(this.imgList, "id", imgObj.id);
				this.imgList[sn] = imgObj;
				this.view(imgObj.id);
				$("div.lwhImageEditor-list  div.lwhImageEditor-box img[imgid='" + imgObj.id + "']",$(this.imgView)).remove();
				var view_img_html = '<img src="' + imgObj.raw[this.settings.view] + '" sn="' + sn + '" imgid="' + imgObj.id + '" />';
				$("div.lwhImageEditor-list  div.lwhImageEditor-box[imgid='" + imgObj.id + "']", $(this.imgView)).append(view_img_html);
			}
		} else {
			// delete case
			// if imgObj empty,  we need to get ref_id, img_id for further reference
			imgObj.ref_id 	= _self.settings.ref_id;
			imgObj.img_id	= _self.settings.img_id;	
			if(_self.settings.single) {
				this.imgObj = imgObj;
				this.view(imgObj.id);
			} else {
				if( this.imgList.length > 0 ) { 
					imgObj 		= this.imgList[0]; 
					_self.sn 	= 0;
				}
				this.view(imgObj.id);
			}
		}
	},


	ajaxCall: function() {
		  var _self = this;
		  if( _self.settings.before ) if( $.isFunction(_self.settings.before) ) _self.settings.before(_self.settings);

		  var schema = {};
		  schema.lang 	= _self.settings.lang;
		  schema.filter = _self.settings.filter;
		  schema.ref_id = _self.settings.ref_id;
		  schema.imgid  = _self.settings.img_id;
		  schema.mode	= _self.settings.mode;
		  schema.view 	= _self.settings.view;
		  schema.noimg	= _self.settings.noimg;
		   
		  $.ajax({
			  data: {
					schema: schema
			  },
			  dataType: "json",  
			  error: function(xhr, tStatus, errorTh ) {
				  alert("Error (wmliu_image_multiple.php): " + xhr.responseText + "\nStatus: " + tStatus);
			  },
			  success: function(req, tStatus) {
				  _self.settings.ref_id 	= req.data.schema.ref_id;
				  _self.imgList 			= req.data.imgList;
				  _self.sn 		 			= 0;
				  _self.initImage();
				  _self.view(req.data.schema.imgid);		  
				  if( _self.settings.after ) if( $.isFunction(_self.settings.after) ) _self.settings.after(_self.settings, _self.imgList);
			  },
			  type: "post",
			  url: "ajax/wmliu_image_multiple.php"
		  });
	},

	ajaxSingle: function() {
		  var _self = this;
		  if( _self.settings.before ) if( $.isFunction(_self.settings.before) ) _self.settings.before(_self.settings);

			if( _self.settings.before ) if( $.isFunction(_self.settings.before) ) _self.settings.before(_self.settings);
			var schema = {};
			schema.lang 	= _self.settings.lang;
			schema.filter 	= _self.settings.filter;
			schema.ref_id 	= _self.settings.ref_id;
			schema.imgid 	= _self.settings.img_id;
			schema.mode		= _self.settings.mode;
			schema.view 	= _self.settings.view;
			schema.noimg	= _self.settings.noimg;
			
			$.ajax({
				data: {
					schema: schema
				},
				dataType: "json",  
				error: function(xhr, tStatus, errorTh ) {
					alert("Error (wmliu_image_single.php): " + xhr.responseText + "\nStatus: " + tStatus);
				},
				success: function(req, tStatus) {
					_self.settings.ref_id 	= req.data.schema.ref_id;
					_self.imgObj 			= req.data.imgObject;
					_self.initSingle();
					if( _self.settings.after ) if( $.isFunction(_self.settings.after) ) _self.settings.after(_self.settings, _self.imgList);
				},
				type: "post",
				url: "ajax/wmliu_image_single.php"
			});
	}

}


/***********Image Viewer *****************************************************************/
$.fn.extend({
    lwhImageEditor: function (opts) {
        var def_settings = {
			offsetto:  "",
            maskable: true,
			content:  "",
            zIndex: 7000
        };
        $.extend(def_settings, opts);

        var mask_zidx = def_settings.zIndex;
        var mask_ifrm 	= "#lwhImageEditor_mask_ifrm";
        var mask_div 	= "#lwhImageEditor_mask_div";
        if ($(mask_ifrm).length <= 0 && def_settings.maskable) {
            $(document.body).append('<iframe id="lwhImageEditor_mask_ifrm" class="lwhImageEditor-mask-ifrm" style="z-index:' + (mask_zidx - 5001 ) + ';"></iframe>');
        }

        if ($(mask_div).length <= 0 && def_settings.maskable) {
            $(document.body).append('<div id="lwhImageEditor_mask_div" class="lwhImageEditor-mask-div" style="z-index:' + (mask_zidx - 5000) + ';"></div>');
        }
        def_settings.zIndex = mask_zidx + 2;

        return this.each(function (idx, el) {

            $(el).data("default_settings", def_settings);
            $(el).css("zIndex", def_settings.zIndex);

            def_settings.zIndex++;

			if( $(el).has("a.lwhImageEditor-button-close").length<=0 ) $(el).prepend('<a class="lwhImageEditor-button-close"></a>');
			//if( $(el).has("div.lwhImageEditor-content").length<=0 ) 	$(el).append('<div class="lwhImageEditor-content"></div>');
			
		    $("a.lwhImageEditor-button-close", el).bind("click.lwhImageEditor", function (ev) {
                $(el).imageEditorHide();
                ev.preventDefault();
                ev.stopPropagation();
                return false;
            });

            if (def_settings.maskable) {
                $(mask_div).bind("click.lwhImageEditor", function (ev) {
                    $(el).imageEditorHide();
                    ev.preventDefault();
                    ev.stopPropagation();
                    return false;
                });
            }


        });
    },

    imageEditorShow: function (opts) {
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhImageEditor_mask_ifrm";
            var mask_div = "#lwhImageEditor_mask_div";

            var def_settings = $(el).data("default_settings");
            $.extend(def_settings, opts);


            if (def_settings.maskable) {
                $(mask_ifrm).show();
            }

            if (def_settings.maskable) {
                $(mask_div).show();
            }

            $(el).show();
			
			var ww = $(el).outerWidth();
			var hh = $(el).outerHeight();
			
			$(el).css("margin-left", -1 * ww/2 - 20);
			$(el).css("margin-top", -1 * hh/2 - 20);
        });
    },

    imageEditorHide: function () {
        return this.each(function (idx, el) {
            var mask_ifrm = "#lwhImageEditor_mask_ifrm";
            var mask_div = "#lwhImageEditor_mask_div";
            var def_settings = $(el).data("default_settings");

            $(el).hide();

            if ($(".lwhImageEditor:visible").length <= 0) {
                $(mask_ifrm).hide();
                $(mask_div).hide();
            }
        });
    }
});

