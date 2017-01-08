var LWH = LWH || {};
LWH.AjaxImage = function(opts) {
	this.settings = {
		name:			"",
		container:		"",
		trigger:		"",
		mode:			"small",
		view:			"thumb",
		
		single:			false,
		singleImage: 	1,  // singleImage = 1:  update base on image id;  singleImage = 0:  append image base on ref_id
		imgid:			"", // use for singleImage = 1 case
		autostart: 		false,
		remove:			true,
		
		allowExt:		["BMP", "JPG", "JPEG", "PNG", "ICO", "GIF"],
		allowSize:		20 * 1024 * 1024,
		maxno:			10,
		thread:			1,
		maxww:			2000,
		maxhh:			2000,
		thuww:   		120,
		thuhh:			100,
		
		triggerClick: 	null,
		before:			null,
		after:			null,
		
		lang:			"cn",
		noimg:			1,
		filter:			"",
		ref_id:			-1,
		url:			"ajax/wmliu_image_upload.php"
	};


	$.extend(this.settings , opts);
	this.usn			= -1;
	this.fileList 		= [];
	this.uploadWindow 	= null;
	this.uploadError	= null
	var _self 			= this;
	// class constructor
	var _constructor = function() {
		if( _self.settings.container ) {
				var diaglog_html = [
				'<div id="lwhUploadImage-' + _self.settings.name + '" style="display:block; position:relative; min-width:680px; background-color:#ffffff;">',
					'<div class="lwhAjaxImage-header" style="display:block;position:relative;top:0px;left:0px;">',
						'<s style="display:inline-block;width:5px;height:100%;vertical-align:middle;"></s>',
						'<a class="lwhAjaxImage-btn-upload">' + gcommon.trans[_self.settings.lang].words["upload"] + '</a>',
						'<a class="lwhAjaxImage-btn-file">',
						'<input name="qqfiles" class="lwhAjaxImage-files" ' + (_self.single?'':'multiple="multiple"') + ' type="file" />',
						gcommon.trans[_self.settings.lang].words["add images"],
						'</a>',
						'<a class="lwhAjaxImage-btn-deletes"></a>',
						'<span class="lwhAjaxImage-allow-title">' + gcommon.trans[_self.settings.lang].words["allow to upload"] + ': </span><span class="lwhAjaxImage-allow-type">' + _self.settings.allowExt.join(", ") + '</span>',
						'<span class="lwhAjaxImage-allow-title">' + gcommon.trans[_self.settings.lang].words["max"] + ': </span><span class="lwhAjaxImage-allow-type">' + (_self.settings.maxno>0?_self.settings.maxno + gcommon.trans[_self.settings.lang].words["images"]:'') + '</span>',
					'</div>',
		
					'<div class="lwhDiagBox-content" style="display:block; position:relative ;border-radius:0px 0px 5px 5px; min-height:300px; border:1px solid #cccccc;">',
						'<a class="lwhAjaxImage-btn-files">',
						'<input name="qqfiles" class="lwhAjaxImage-files" ' + (_self.single?'':'multiple="multiple"') + ' type="file" />',
						gcommon.trans[_self.settings.lang].words["select images"],
						'</a>',
						'<div class="lwhAjaxImage-comment">',
						gcommon.trans[_self.settings.lang].words["or"] + '<br>' + gcommon.trans[_self.settings.lang].words["drag and drop images from your computer"] + '<br>( ' + gcommon.trans[_self.settings.lang].words["select up to"] + ' ' + _self.settings.maxno + ' ' + gcommon.trans[_self.settings.lang].words["images each time"] + ' )',
						'</div>',
					'</div>',
				'</div>'					
				].join("");
		
		} else {
				_self.settings.container = "body";
				var diaglog_html = [
				'<div id="lwhDiagBox-' + _self.settings.name + '" class="lwhDiagBox" ww="680px" hh="400px" minww="680px" minhh="400px">',
					'<div class="lwhAjaxImage-header">',
						'<s style="display:inline-block;width:5px;height:100%;vertical-align:middle;"></s>',
						'<a class="lwhAjaxImage-btn-upload">' + gcommon.trans[_self.settings.lang].words["upload"] + '</a>',
						'<a class="lwhAjaxImage-btn-file">',
						'<input name="qqfiles" class="lwhAjaxImage-files" ' + (_self.single?'':'multiple="multiple"') + ' type="file" />',
						gcommon.trans[_self.settings.lang].words["add images"],
						'</a>',
						'<a class="lwhAjaxImage-btn-deletes"></a>',
						'<span class="lwhAjaxImage-allow-title">' + gcommon.trans[_self.settings.lang].words["allow to upload"] + ': </span><span class="lwhAjaxImage-allow-type">' + _self.settings.allowExt.join(", ") + '</span>',
						'<span class="lwhAjaxImage-allow-title">' + gcommon.trans[_self.settings.lang].words["max"] + ': </span><span class="lwhAjaxImage-allow-type">' + (_self.settings.maxno>0?_self.settings.maxno + gcommon.trans[_self.settings.lang].words["images"]:'') + '</span>',
					'</div>',
		
					'<div class="lwhDiagBox-content" style="top:75px;border-radius:0px 0px 5px 5px;">',
						'<a class="lwhAjaxImage-btn-files">',
						'<input name="qqfiles" class="lwhAjaxImage-files" ' + (_self.single?'':'multiple="multiple"') + ' type="file" />',
						gcommon.trans[_self.settings.lang].words["select images"],
						'</a>',
						'<div class="lwhAjaxImage-comment">',
						gcommon.trans[_self.settings.lang].words["or"] + '<br>' + gcommon.trans[_self.settings.lang].words["drag and drop images from your computer"] + '<br>( ' + gcommon.trans[_self.settings.lang].words["select up to"] + ' ' + _self.settings.maxno + ' ' + gcommon.trans[_self.settings.lang].words["images each time"] + ' )',
						'</div>',
					'</div>',
				'</div>'					
				].join("");
		}
		
		
        var diaglog_error = [
            '<div id="lwhDivBox-uploadImage-' + _self.settings.name + '" class="lwhDivBox" ww="520" hh="300" minww="400" minhh="300">',

            '<div class="lwhDivBox-content">',
                '<div>',
                    '<a class="wmliu-common-state-stop"></a>',
                    '<span class="wmliu-common-state-error">' + gcommon.trans[_self.settings.lang].words["upload.invalid.files"] +  ': </span>',
                '</div>',
                
                '<div class="wmliu-common-checklist-box">',
                '<span class="wmliu-common-error-text"></span>',
                '</div>',
            '</div>',

            '</div>',
        ].join('');
		
				
		_self.uploadWindow = $(_self.settings.container).append(diaglog_html)[0].lastChild;
		_self.uploadError  = $("body").append(diaglog_error)[0].lastChild;

		if( _self.settings.container=="body" ) 
			$(_self.uploadWindow).lwhDiagBox({title:"Upload Images", maskable:false, button:true, movable:true, resizable:true});		
		
		$(_self.uploadError).lwhDivBox();
		
		$(_self.settings.trigger).unbind("click.uploadimage").bind("click.uploadimage", function(ev) {
			if(_self.settings.triggerClick && $.isFunction(_self.settings.triggerClick)) _self.settings.triggerClick(_self);
			$(_self.uploadWindow).diagBoxShow();
			/*
			if(_self.settings.remove)
				$("div.lwhAjaxImage-upload-state[sn]", $(_self.uploadWindow)).each( function(idx2, el2) {
					if( $(el2).hasClass("lwhAjaxImage-upload-state-ok") || 
			 			$(el2).hasClass("lwhAjaxImage-upload-state-cancel") ||
				 		$(el2).hasClass("lwhAjaxImage-upload-state-error") 
					)
					$(el2).parent().remove();
				});
			*/
		});
		

		$("a.lwhAjaxImage-btn-upload", $(_self.uploadWindow)).die("click").live("click", function(ev) {
			var in_progress = 0;
			for(var i = 0; i <= _self.usn; i++) {
				if(_self.fileList[i].status == 1) in_progress++;
			}
			if(_self.settings.thread > 0) {
				for(var i = in_progress; i < _self.settings.thread; i++) {
					_self.ajaxUpload();		
				}
			} else {
				for(var i = _self.usn; i < this.fileList.length; i++) {
					_self.ajaxUpload();		
				}
			}
		
		});

		$("a.lwhAjaxImage-btn-deletes", $(_self.uploadWindow)).die("click").live("click", function(ev) {
			_self.deletes();
			_self.fileList = [];
		});

		$("a.lwhAjaxImage-btn-delete", $(_self.uploadWindow)).die("click").live("click", function(ev) {
		   	var sn = $(this).parent().attr("sn");
			if( _self.fileList[sn].status == 1 ) {
				// cancel upload if uploading, 
				if(_self.fileList[sn].xhr) _self.fileList[sn].xhr.abort(); 
			}

			if( _self.fileList[sn].status <= 2) _self.fileList[sn].status = 2;
			_clear_fileObj(_self.fileList[sn]);
			$(this).parent().remove();
			_refresh_box();
		});
		
		
		
		// input file change event 
		$(".lwhAjaxImage-files", $(_self.uploadWindow)).die("change").live("change", function(ev) {
			var files = (ev.srcElement || ev.target).files;
			_process(files);
		});
		// end of input file change event

		$(".lwhDiagBox-content", $(_self.uploadWindow))[0].ondragover = function(ev) {
			ev.preventDefault();
		}
		
		$(".lwhDiagBox-content", $(_self.uploadWindow))[0].ondrop = function(ev) {
			ev.preventDefault();
			var files = ev.dataTransfer.files;
			_process(files);
		};
		
		// main function 
		var _process = function(files) {
			if( files ) {
				var invalid_msg = '';
			
				for(var idx = 0; idx < files.length; idx++) {

					if( _self.settings.allowExt.indexOf(files[idx].name.extName().toUpperCase()) >= 0  ) {
						if( files[idx].size <= _self.settings.allowSize && _self.settings.allowSize > 0 ) {
								var findObjs = $.grep( _self.fileList, function(n, i) {
									return n.name == files[idx].name;
								});
								if(findObjs.length <= 0 ) {

										// convert file to blog and URL 
										/**************************************************************************************************/
										_self.file2BlobURL(files[idx], function(afile, blob, imgURL) {
														
											var findMax = $.grep( _self.fileList, function(n, i) {
												return n.status == 0 || n.status == 1 || n.status == 8;
											});

											if( findMax.length < _self.settings.maxno || _self.settings.maxno == 0) {

													var fileObj = {};
													fileObj.status	= 0;
													fileObj.name 	= afile.name;
													fileObj.name1 	= afile.name.shortName(0);
													fileObj.ext 	= afile.name.extName();
													fileObj.type 	= afile.type;
													fileObj.size 	= blob.size;
													fileObj.size1 	= fileObj.size?fileObj.size.toSize():"";
													fileObj.blob 	= blob;
													_self.fileList.push(fileObj);
													fileObj.sn		= _self.fileList.length - 1; 
						
													
													var w_h0 	= "width:" + (_self.settings.thuww?_self.settings.thuww:"auto") + "px; height:" + (_self.settings.thuhh?_self.settings.thuhh + 30:"auto") + "px;";
													var w_h1 	= "width:" + (_self.settings.thuww?_self.settings.thuww:"auto") + "px; height:" + (_self.settings.thuhh?_self.settings.thuhh:"auto") + "px;";
													var imghtml = '<div class="lwhAjaxImage-image-box" style="' + w_h0 + '" sn="' + fileObj.sn + '">' +
																		'<div class="lwhAjaxImage-image-table" style="' + w_h1 + '">' +
																			'<div class="lwhAjaxImage-image-cell">' +
																				  '<img src="' + imgURL + '" style="" title="' + fileObj.name + ' [ ' + fileObj.size1 + ' ]" />' + 
																				  '<div class="lwhAjaxImage-progressbar lwhAjaxImage-progressbar-html5 lwhAjaxImage-progressbar-hide" sn="' + fileObj.sn + '">' + 
																				  '</div>' +
																			'</div>' +
																		'</div>' +
																		'<div class="lwhAjaxImage-image-foot" title="' + fileObj.name + ' [ ' + fileObj.size1 + ' ]">' +
																				fileObj.name.shortName(16) + '<br>' + fileObj.size1 +  
																		'</div>' +
																		'<a class="lwhAjaxImage-btn-delete"></a>' + 
  																	    '<div class="lwhAjaxImage-upload-state lwhAjaxImage-upload-state-hide" sn="' + fileObj.sn + '">' + 
																  '</div>';
													$(".lwhDiagBox-content", $(_self.uploadWindow)).append(imghtml);		
					
													_refresh_box();
	
											}
											else 
											{
												//invalid_msg += '"' + afile.name + '" has cancelled for only allow ' + _self.settings.maxno + ' images !<br>\n';
											} // > maxno
																					
										}); // file2BlobURL
										/**************************************************************************************************/
										// end of convert 
								} 
								else 
								{
									invalid_msg += '"' + files[idx].name + '" ' + gcommon.trans[_self.settings.lang].words["is already in the upload list"] + ' !<br>\n';
								} // end of if(findObjs.length <= 0 )

						} else {
							invalid_msg += '"' + files[idx].name + '" { ' + files[idx].size.toSize() + ' } " ' + gcommon.trans[_self.settings.lang].words["is over the maximum size"] + ' { ' + _self.settings.allowSize.toSize() + ' } !<br>\n';
						}

					} else {
						invalid_msg += '"' + files[idx].name + '" ' + gcommon.trans[_self.settings.lang].words["is not allowed to upload"] + ' !<br>\n';
					}

					
				} // for loop files
				
				if(invalid_msg != '') { 
					$("span.wmliu-common-error-text", $(_self.uploadError)).html(invalid_msg);
					$('#lwhDivBox-uploadImage-' + _self.settings.name).divBoxShow();	
				}
			} // end of if(files)
		} // end of function 


		// init upload button
		if(_self.settings.ref_id <= 0) {
			$(".lwhAjaxImage-btn-upload", $(_self.uploadWindow)).hide();
		} else {
			$(".lwhAjaxImage-btn-upload", $(_self.uploadWindow)).show();
		}

	}();
	
	this.length = function() {
		return this.fileList.length;
	}
	
	this.ajaxUpload = function() {
		_self.usn++;
		if( _self.usn > (_self.fileList.length - 1) ) {
			_self.usn = _self.fileList.length - 1;
			return;
		}
		var sn = _self.usn;
		//console.log("sn: " + sn);
		if( _self.fileList[sn].status > 1 ) { this.ajaxUpload(); return; }	

		_self.fileList[sn].status = 1;
		
		var udata = {};
		udata.name 				= _self.fileList[sn].name;
		udata.ext 				= _self.fileList[sn].ext;
		udata.type 				= _self.fileList[sn].type;
		udata.size 				= _self.fileList[sn].size;
		
		
		var fdata = new FormData();
		fdata.append("lang", 		_self.settings.lang);
		fdata.append("filter", 		_self.settings.filter);
		fdata.append("singleImage", _self.settings.singleImage);
		fdata.append("imgid",	 	_self.settings.imgid);
		fdata.append("ref_id", 		_self.settings.ref_id);
		fdata.append("mode", 		_self.settings.mode);
		fdata.append("view", 		_self.settings.view);
		fdata.append("noimg", 		_self.settings.noimg);
		fdata.append("orderno",		sn);
		fdata.append("status", 		_self.fileList[sn].status);
		fdata.append("name", 		_self.fileList[sn].name);
		fdata.append("ext", 		_self.fileList[sn].ext);
		fdata.append("type", 		_self.fileList[sn].type);
		fdata.append("size", 		_self.fileList[sn].size);
		fdata.append("blob", 		_self.fileList[sn].blob);
		
		if(_self.settings.before && $.isFunction(_self.settings.before)) _self.settings.before(fdata);
		
		var _xhr = new XMLHttpRequest();
		_self.fileList[sn].xhr = _xhr;


		_xhr.onloadstart = function(e) {
			_self.fileList[sn].status = 1;
			var theBar 	= $("div.lwhAjaxImage-progressbar[sn='" + sn + "']", $(_self.uploadWindow));
			theBar.removeClass("lwhAjaxImage-progressbar-hide");				
		}
		
		_xhr.onerror = function(e) {
			_self.fileList[sn].status = 3;

			var theBar 	= $("div.lwhAjaxImage-progressbar[sn='" + sn + "']", $(_self.uploadWindow));
			theBar.addClass("lwhAjaxImage-progressbar-hide");				
			$("div.lwhAjaxImage-upload-state[sn='" + sn + "']", $(_self.uploadWindow)).addClass("lwhAjaxImage-upload-state-error").removeClass("lwhAjaxImage-upload-state-hide");

			_self.ajaxUpload();
		}
		
		_xhr.onabort = function(e) {
			_self.fileList[sn].status = 4;

			var theBar 	= $("div.lwhAjaxImage-progressbar[sn='" + sn + "']", $(_self.uploadWindow));
			theBar.addClass("lwhAjaxImage-progressbar-hide");				
			$("div.lwhAjaxImage-upload-state[sn='" + sn + "']", $(_self.uploadWindow)).addClass("lwhAjaxImage-upload-state-cancel").removeClass("lwhAjaxImage-upload-state-hide");

			_self.ajaxUpload();
		}
		
		_xhr.upload.onprogress = function(e) {
			var theBar 	= $("div.lwhAjaxImage-progressbar[sn='" + sn + "']", $(_self.uploadWindow));
			var percent = 0;
			if(e.total > 0 ) {
				percent = e.loaded / e.total;
			}
			
			var percent_ww = percent * theBar.outerWidth();
			var gobar =	 parseInt(-250 + percent_ww);
			theBar.css("background-position",  gobar + "px center");
			theBar.html( Math.round(percent * 100) + "%");
		}

		_xhr.onload = function(e) {

			var req = $.parseJSON(_xhr.responseText);
			_self.fileList[sn].status = req.info.status;

			var theBar 	= $("div.lwhAjaxImage-progressbar[sn='" + sn + "']", $(_self.uploadWindow));
			theBar.addClass("lwhAjaxImage-progressbar-hide");				

			if( req.errorCode == 0 ) {
				$("div.lwhAjaxImage-upload-state[sn='" + sn + "']", $(_self.uploadWindow)).addClass("lwhAjaxImage-upload-state-ok").removeClass("lwhAjaxImage-upload-state-hide");
				if(_self.settings.remove) $("div.lwhAjaxImage-image-box[sn='" + sn + "']", $(_self.uploadWindow)).remove();
			} else {
				$("div.lwhAjaxImage-upload-state[sn='" + sn + "']", $(_self.uploadWindow)).addClass("lwhAjaxImage-upload-state-error").removeClass("lwhAjaxImage-upload-state-hide");
				var img_title = $("div.lwhAjaxImage-image-box[sn='" + sn + "'] img",$(_self.uploadWindow)).attr("title");   
				img_title += "\n" + req.errorMessage;
				$("div.lwhAjaxImage-image-box[sn='" + sn + "'] img",$(_self.uploadWindow)).attr("title", img_title);   
			}

			if(_self.settings.after && $.isFunction(_self.settings.after)) _self.settings.after(req);
			
			var done_flag = true;
			for(var i = 0; i < _self.fileList.length; i++) {
				if( _self.fileList[i].status <= 1 ) done_flag = false;
			};
			
			if(done_flag) {
				if(_self.settings.remove) _self.deletes();
				if(_self.settings.done && $.isFunction(_self.settings.done)) _self.settings.done(_self.fileList);
			}
			_self.ajaxUpload();
		}

		/*				
		_xhr.open("POST", "fupload.php?" + $.param(udata), true);   // PHP using $_GET["xxx"]
		_xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
		_xhr.setRequestHeader("Content-Type", "multipart/form-data");
		_xhr.setRequestHeader("X-File-Name", encodeURIComponent(udata.name));
		_xhr.send(_self.fileList[sn].blob);    // PHP using file_get_contents('php://input') 
		
		//php code
		//$image = imagecreatefromstring(file_get_contents('php://input')); 
		//$size  = getimagesizefromstring(file_get_contents('php://input')); 
		//var_dump($_GET);
		*/
		

		_xhr.open("POST", _self.settings.url, true);
		_xhr.send(fdata);
		//php code
		//var_dump($_POST);
		//var_dump($_FILES);
	}
	
	this.deletes = function() {
		$("div.lwhDiagBox-content div.lwhAjaxImage-image-box", $(_self.uploadWindow)).each(function(idx, el){
			var sn = $(el).attr("sn");
			if( _self.fileList[sn].status == 1 ) {
				// if uploading, let it going 
				if(_self.fileList[sn].xhr) _self.fileList[sn].xhr.abort(); 
			} else {
				if( _self.fileList[sn].status <= 2)	_self.fileList[sn].status 	= 2;
				_clear_fileObj(_self.fileList[sn]);
				$(el).remove();	
			}
		});
		_refresh_box();
	}


	// refresh GUI function
	this.refresh = function() {
		if(_self.settings.ref_id <= 0) {
			$(".lwhAjaxImage-btn-upload", $(_self.uploadWindow)).hide();
		} else {
			$(".lwhAjaxImage-btn-upload", $(_self.uploadWindow)).show();
		}
	}
	
	var _refresh_box = function() {
		if( $(".lwhDiagBox-content", $(_self.uploadWindow)).has("div.lwhAjaxImage-image-box").length <= 0 ) {
			 $(".lwhDiagBox-content", $(_self.uploadWindow)).empty();
			var btnhtml = 	'<a class="lwhAjaxImage-btn-files">' +
							'<input name="qqfiles" class="lwhAjaxImage-files" ' + (_self.single?'':'multiple="multiple"') + ' type="file" />' +
							'Select Image' +
							'</a>';
			var btncomm = 	'<div class="lwhAjaxImage-comment">' + 
							'OR<br> drag and drop images from your computer<br>( select up to ' + _self.settings.maxno + ' images each time )' +
							'</div>';

			$(".lwhDiagBox-content", $(_self.uploadWindow)).append(btnhtml);	
			$(".lwhDiagBox-content", $(_self.uploadWindow)).append(btncomm);	
			_self.fileList 	= [];
			_self.usn 		= -1;	
		
		} else {
			if( $(".lwhDiagBox-content", $(_self.uploadWindow)).has("a.lwhAjaxImage-btn-files").length > 0 ) {
				$(".lwhDiagBox-content > a.lwhAjaxImage-btn-files", $(_self.uploadWindow)).remove();
				$(".lwhDiagBox-content > div.lwhAjaxImage-comment", $(_self.uploadWindow)).remove();
			}
		}
	}
	
	
	var _clear_fileObj = function( fileObj ) {
			fileObj.name 	= "";
			fileObj.name1 	= "";
			fileObj.ext 	= "";
			fileObj.type 	= "";
			fileObj.size 	= 0;
			fileObj.size1 	= "";
			fileObj.blob 	= null;
	}
	// end of GUI function
}

LWH.AjaxImage.prototype = {
	show: function() {
		if(this.settings.triggerClick && $.isFunction(this.settings.triggerClick)) this.settings.triggerClick(this);
		$(this.uploadWindow).diagBoxShow();
	},
	
	filter : function(v) {
		if(v) this.settings.filter = v;
		return this.settings.filter;
	},
	
	refid:	function(v) {
		if(v) { 
			this.settings.ref_id = v;
			this.refresh();
		}
		return this.settings.ref_id;
	},

	imgid:	function(v) {
		if(v) { 
			this.settings.imgid = v;
			this.refresh();
		}
		return this.settings.imgid;
	},
	
	set: function(vo) {
		if(vo.filter) this.settings.filter = vo.filter;
		if(vo.ref_id) { 
			this.settings.ref_id = vo.ref_id;
			this.refresh();
		}
	},
	
	file2Base64 : function(afile, callback) {
		var fs = new FileReader();
		fs.onload = function(ev1) {
			callback(afile, ev1.target.result);
		}
		fs.readAsDataURL(afile);
	},
	
	
	file2BlobURL : function(afile, callback) {
		try {
			wait_show();
	
			var _self = this;
			var fs = new FileReader();
			fs.onload = function(ev1) {
				var img = new Image();
				img.onload = function(){
					// Convert image to blob chunk
					var canvas 	= document.createElement("canvas");
					var ctx 	= canvas.getContext("2d");
	
					var ratio_ww 	= 1;
					var ratio_hh 	= 1;
					if(_self.settings.maxww > 0 && img.width 	> _self.settings.maxww) ratio_ww = _self.settings.maxww / img.width;
					if(_self.settings.maxhh > 0 && img.height 	> _self.settings.maxhh) ratio_hh = _self.settings.maxhh / img.height;
					var ratio = Math.min(ratio_ww, ratio_hh);
	
					canvas.width 	= img.width * ratio;
					canvas.height 	= img.height * ratio;
					ctx.drawImage(img,0,0, img.width, img.height, 0, 0, canvas.width, canvas.height); 
	
	
					// create thumbnail image dataURL
					var canvas_thu 	= document.createElement("canvas");
					var ctx_thu		= canvas_thu.getContext("2d");
					
					var ratio_thu_ww 	= 1;
					var ratio_thu_hh 	= 1;
					if(_self.settings.thuww > 0 && img.width 	> _self.settings.thuww) ratio_thu_ww = _self.settings.thuww / img.width;
					if(_self.settings.thuhh > 0 && img.height 	> _self.settings.thuhh) ratio_thu_hh = _self.settings.thuhh / img.height;
					var ratio_thu = Math.min(ratio_thu_ww, ratio_thu_hh);
					canvas_thu.width 	= img.width * ratio_thu;
					canvas_thu.height 	= img.height * ratio_thu;
									
					ctx_thu.drawImage(img,0,0, img.width, img.height, 0, 0, canvas_thu.width, canvas_thu.height); 
	
					callback( afile, _self.dataURL2Blob(canvas.toDataURL(afile.type)), canvas_thu.toDataURL(afile.type) );
					wait_hide();
				}
				img.src = ev1.target.result;
			}
			fs.readAsDataURL(afile);
		}
		catch(err) {
			wait_hide();
		}
	},
	
	dataURL2Blob : function( dataurl ) {
		try {
			var arr = dataurl.split(','); 
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
	}
	
}
