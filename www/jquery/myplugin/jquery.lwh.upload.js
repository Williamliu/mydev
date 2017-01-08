LWH.AjaxUpload = function( opts ) {
	$.extend(this.settings, opts);
	this.fileButton = null;
	this.xhr 		= null;
	var _self 		= this;
	//internal  method	
	var _constructor = function() {
		var upload_dialog = '<div id="diaglog_fileUpload" class="lwhDiag">' +
								  '<div class="lwhDiag-content lwhDiag-no-border">' +
								  	'<div id="lwhDiag-upload-state" ></div>' +
								  	'<div id="lwhDiag-upload-queue" ></div>' +
								  '</div></div>';
		var uploadWindow = $("body").append(upload_dialog)[0].lastChild;
		$("#diaglog_fileUpload").lwhDiag({
			titleAlign:		"center",
			title:			"Upload File",
			
			cnColor:		"#F8F8F8",
			bgColor:		"#EAEAEA",
			ttColor:		"#94C8EF",
			 
			minWW:			360,
			minHH:			250,
			btnMax:			false,
			resizable:		false,
			movable:		true,
			maskable: 		true,
			maskClick:		true,
			pin:			false
		});


		$("#lwhDiag-upload-state", $(uploadWindow) ).append(_self._infoHEAD());
		
		_self.fileButton = $(".lwhUpload-buttton-upload","#diaglog_fileUpload"); 

		_self.ie = $.browser.msie?true:false;
		_self._createInput();		
		
		$("a.lwhUpload-log-clean").live("click", function(ev) {
			_self.cleanLog();
		}); 
		
		$("a.lwhUpload-cancel").live("click", function(ev) {
			_self.abort( $(this).attr("uid") );
			ev.preventDefault();
			ev.stopPropagation();
		});
		
		$(_self.settings.btnUpload).live("click", function(ev) {
			$("#diaglog_fileUpload").diagShow();
		});

		$(_self.settings.btnImgCut).live("click", function(ev) {
				  _self.setID();
				  //alert("ww:" + $(_self.settings.imgEL).width() + "  hh:" + $(_self.settings.imgEL).height());
				  $.ajax({
					  data: {
						  ref_id: 	_self.settings.ref_id,
						  img_ww: 	$(_self.settings.imgEL).width(),
						  img_hh:	$(_self.settings.imgEL).height(),
						  img_left: Math.abs($(_self.settings.imgEL).position().left),
						  img_top: 	Math.abs($(_self.settings.imgEL).position().top)
					  },
					  dataType: "json",  
					  error: function(xhr, tStatus, errorTh ) {
						  alert("Error (lwhUpload_cut.php): " + xhr.responseText + "\nStatus: " + tStatus);
					  },
					  success: function(req, tStatus) {
							$(_self.settings.btnImgCut).hide();
							if( _self.settings.imgCutDone && $.isFunction(_self.settings.imgCutDone)) _self.settings.imgCutDone(req); 
					  },
					  type: "post",
					  url: "ajax/lwhUpload_cut.php"
				  });
		});


		$(_self.settings.btnImgDel).live("click", function(ev) {
				  _self.setID();
				  $.ajax({
					  data: {
						  ref_id: 	_self.settings.ref_id
					  },
					  dataType: "json",  
					  error: function(xhr, tStatus, errorTh ) {
						  alert("Error (lwhUpload_delete.php): " + xhr.responseText + "\nStatus: " + tStatus);
					  },
					  success: function(req, tStatus) {
							if( _self.settings.imgDelDone && $.isFunction(_self.settings.imgDelDone)) _self.settings.imgDelDone(req); 
					  },
					  type: "post",
					  url: "ajax/lwhUpload_delete.php"
				  });
		});

		
	};
	_constructor();
}

LWH.AjaxUpload.prototype = {
	settings: {
		ref_id:		"",
		url: 		"",
		btnUpload:	"",
		btnImgCut:	"",
		btnImgDel:	"",
		imgEL:		"",
		info:		"",
		allowExt: 	["gif", "jpg", "png", "bmp", "pdf"],
		allowSize: 	20 * 1024 * 1024,
		threads:	3,
		multiple:	1,
		ref_el:		"",
		start:		null,
		uploadDone:	null,
		imgCutDone:	null,
		imgDelDone:	null
	},
	ie:			false,
	errors:		[],
	_xhr:		[],
	_filelist: 	[],
	pointer:	-1,
	
	
	upload: function() {
		var in_progress = 0;
		for(var i = 0; i <= this.pointer; i++) {
			if(this._filelist[i].status == 1) in_progress++;
		}
		if(this.settings.threads > 0) {
			for(var i = in_progress; i < this.settings.threads; i++) {
				this._createXHR();
			}
		} else {
			for(var i = this.pointer; i < this._filelist.length; i++) {
				this._createXHR();
			}
		}
	},
	
	abort: function(pid) {
		if(this.ie) {
			this._filelist[pid].status 	+= 4;
			this._filelist[pid].ufile 	= null;
			this._onabort(pid);
			if($("iframe[uid='" + pid + "']").length > 0) {
				$("iframe[uid='" + pid + "']").remove();
				$("form[uid='" + pid + "']").remove();
				this._createXHR();
			}
		} else {
			if(this._xhr[pid]) {
				this._xhr[pid].abort();
			} else {
				this._filelist[pid].status += 4;
				this._filelist[pid].ufile 	= null;
				this._onabort(pid);
			}
		}
	},
	
	setID:	function() {
		this.settings.ref_id = $(this.settings.ref_el).val();
	},
	
	cleanLog: function() {
		for(var i = 0 ; i < this._filelist.length; i++) {
			if( this._filelist[i].status > 1 ) {
				$("tr.lwhUpload-queue-item[uid='" + i + "']").remove();
			}
		}
	},
	
	btnReset: function() {
		$(this.settings.btnUpload).show();
		//Change to show by William 2014-12-27
		$(this.settings.btnImgCut).show();
		$(this.settings.btnImgDel).show();
	},
	
	btnUCD: function() {
		$(this.settings.btnUpload).show();
		$(this.settings.btnImgCut).show();
		$(this.settings.btnImgDel).show();
	},

	btnUC: function() {
		$(this.settings.btnUpload).show();
		$(this.settings.btnImgCut).show();
		$(this.settings.btnImgDel).hide();
	},

	btnCD: function() {
		$(this.settings.btnUpload).hide();
		$(this.settings.btnImgCut).show();
		$(this.settings.btnImgDel).show();
	},
	
	append: function(input) {
		var _self = this;
		this.errors = [];
	  	_self.setID();
		if( _self.settings.start && $.isFunction(_self.settings.start)) _self.settings.start(); 

		if(this.ie) {
			//IE
			var pass_flag = true;
			var errorObj = {};
			errorObj.namecode	= 0;
			errorObj.sizecode	= 0;
			errorObj.filename 	= this._getName(input.value);
			//alert("file:" + this._getName(input.value) + ' ext:' + this._getExt(input.value) );

			if(!this.isAllowExt(input.value)) {
				pass_flag = false;
				errorObj.namecode	= 1001;
			}
			
			if(pass_flag) {
				var fileObj = {};
				fileObj.status 		= 0;
				fileObj.ref_id		= this.settings.ref_id;
				fileObj.fileName 	= this._getName(input.value);
				fileObj.fileSize 	= -1;
				fileObj.ufile 	    = input;
				$("input[name='qqfile']", this.fileButton).remove();
				$(input).removeAttr("style").attr("uid", this._filelist.length); 
				this._infoHTML(this._filelist.length, fileObj);	
				this._filelist.push(fileObj);	
			} else {
				this.errors.push(errorObj);
			}
		} else {
			// None IE			
			var tfiles = input.files;	
			var i = tfiles.length;
			while (i--){   
					var pass_flag = true;
					var errorObj = {};
					errorObj.namecode	= 0;
					errorObj.sizecode	= 0;
					errorObj.filename 	= tfiles[i].name;
					
					if(!this.isAllowExt(tfiles[i].name)) {
						pass_flag = false;
						errorObj.namecode	= 1001;
					}
					if(!this.isAllowSize(tfiles[i].size)) {     
						pass_flag = false;
						errorObj.sizecode 	= 1002;
						errorObj.filesize  	= tfiles[i].size;
					}
					
					if( pass_flag )	{
						var fileObj = {};
						fileObj.status 		= 0;
						fileObj.ref_id		= this.settings.ref_id;
						fileObj.fileName 	= tfiles[i].name;
						fileObj.fileSize 	= tfiles[i].size;
						fileObj.ufile		= tfiles[i];
						this._infoHTML(this._filelist.length, fileObj);	
						this._filelist.push(fileObj);	
					} else {
						this.errors.push(errorObj);
					}
			}  
		}
		this._createInput();
		this.upload();
		this.showError(); 
	},
	
	
	isAllowExt: function(fileName) {
        var ext = (fileName.indexOf('.') !== -1)?fileName.replace(/.*[.]/, '').toLowerCase() :'';
        if(!this.settings.allowExt.length) return true;        
        for (var i=0; i<this.settings.allowExt.length; i++){
            if (this.settings.allowExt[i].toLowerCase() == ext){
                return true;
            }    
        }
        return false;
	},
	
	isAllowSize: function(fileSize) {
		if( fileSize > this.settings.allowSize && this.settings.allowSize > 0 ) {
			return false;
		} else {
			return true;
		}
	},
	
	showError: function() {
		var err_msg = '';
		if( this.errors.length > 0 ) {
			var cnt = 0;
			for(var i=0 ; i< this.errors.length; i++) {
				cnt++;
				if(this.errors[i].namecode) {
						err_msg += cnt +  ".\t'" + this._formatFileName(this.errors[i].filename) + "' is not allowed file type: " + this.settings.allowExt.join(", ") + "\n";
				} 
				if(this.errors[i].sizecode) {
						//cnt++;
						err_msg += cnt +  ".\t'" + this._formatFileName(this.errors[i].filename) + "' exceed the maximium size: (" +  this.errors[i].filesize.toSize() + " > " +  this.settings.allowSize.toSize() + ")\n";
				}
			}
			alert("The below file(s) fail to upload:\n\n" + err_msg); 
		}
	},
	
	_createXHR: function() {
		/******************************************************************************************************************************/
		// firefox
		/*Upload process:  readystate 1, loadstart,  upload.loadstart, readystate 2, readystate 3, upload.progress, readystate 4, upload.load,  upload.loadend, progress, load, loadend 
		/*Abort  process:  readystate 1, loadstart,  upload.loadstart,  upload.progress, readystate 4, abort, loadend, upload.abort upload.loadend 
		/*Error  process:  readystate 1, loadstart,  upload.loadstart,  readystate 2, readystate 4, error, loadend, upload.error, upload.loadend 
		/******************************************************************************************************************************/

		/******************************************************************************************************************************/
		// opera, chrome
		/*Upload process:  loadstart,  upload.loadstart, upload.progress, upload.load, upload.loadend, readystate 2, progress, readystate 3, readystate 4, load, loadend 
		/*Abort  process:  loadstart,  upload.loadstart,  upload.progress, abort, loadend, upload.abort, upload.loadend. 
		/*Error  process:  loadstart,  upload.loadstart,  upload.progress, upload.error, error, upload.loadend, loadend. 
		/******************************************************************************************************************************/

		
		/******************************************************************************/
		/*
		 safari
		 xhr and xhr.upload event include: onloadstart, onprogress, onload, onabort, onerror, readystate 
		 no such event: onloadend
		 
		 upload: (readystate 1: N/A)  loadstart, upload.loadstate,  upload.progress, upload.load, readystate 2, progress, readystate 3, readystate 4,  load
		 abort:   loadstart, upload.loadstart, upload.progress,  abort, upload.abort.
		 error:   loadstart, upload.loadstart, upload.progress,  error, upload.error.  
		*/
		/******************************************************************************/
		if(this.pointer >= (this._filelist.length - 1) ) return;
		
		var _self = this;
		_self.pointer++;
		var pid = _self.pointer;
		
		// skip any cancel upload
		if( _self._filelist[pid].status > 1 ) { _self._createXHR(); return; }		

		if(this.ie) {
			// IE
		 	this._filelist[pid].status = 1;
			this._onloadstart(pid);
			
			// create iframe -> form -> input element for IE			
			var iframe 	= $("body").append('<iframe src="javascript:false;" name="ifrm_' + pid + '" id="ifrm_' + pid + '" uid="' + pid + '" style="display:none;"></iframe>')[0].lastChild;
			var form 	= $("body").append('<form method="post" name="frm_' + pid + '" uid="' + pid + '" style="display:none;" enctype="multipart/form-data"></form>')[0].lastChild;			
			$(form).attr({"action":this.settings.url, "target": $(iframe).attr("name") });
			var input_uid 	= $(form).append('<input type="hidden" name="uid" />')[0].lastChild;
			$(input_uid).val(pid);
			var input_rid 	= $(form).append('<input type="hidden" name="ref_id" />')[0].lastChild;
			$(input_rid).val(_self.settings.ref_id);
			var input_name 	= $(form).append('<input type="hidden" name="ufilename" />')[0].lastChild;
			$(input_name).val(_self._filelist[pid].fileName);
			var max_size 	= $(form).append('<input type="hidden" name="MAX_FILE_SIZE" />')[0].lastChild;
			$(max_size).val(_self.settings.allowSize);
			
			$(form).append(_self._filelist[pid].ufile);

			// using iframe form post to upload file , upload uploadDone event.
			$(iframe).bind("load", function(ev) {
				var doc	= iframe.contentDocument ? iframe.contentDocument: iframe.contentWindow.document;
				var res = $.parseJSON(doc.body.innerHTML); //eval("(" + doc.body.innerHTML + ")");
				if(res && res.errorCode == 0) {
					_self._filelist[pid].fileSize 	= res.data.filesize;
					_self._filelist[pid].status 	+= 8;
				  	_self._filelist[pid].ufile 		= null;
					_self._onloadend(pid);
				} else {
					_self._filelist[pid].errorMessage = res.errorMessage;
					_self._filelist[pid].fileSize 	= res.data.filesize;
					_self._filelist[pid].status 	+= 4;
				  	_self._filelist[pid].ufile 		= null;
					_self._onerror(pid);
				}
             	$(iframe).remove();
				$(form).remove();
				_self._createXHR();
			  	if( _self.settings.uploadDone && $.isFunction(_self.settings.uploadDone)) _self.settings.uploadDone(res); 
				$(_self.settings.btnImgCut).show();
			});
			form.submit();
			// End of IE
		} else {
			  // None IE
			  var _xhr = new XMLHttpRequest();
			  _self._xhr[pid] = _xhr;
			  _self._filelist[pid].status = 1;
			  
			  var data = {};
			  data.uid 				= pid;
			  data.ref_id 			= _self.settings.ref_id;
			  data.ufilename 		= _self._filelist[pid].fileName;
			  data.ufilesize 		= _self._filelist[pid].fileSize;
			  data.MAX_FILE_SIZE 	= _self.settings.allowSize;	  
			  //alert("params:" + $.param(data));
			  _xhr.open("post", _self.settings.url + "?" + $.param(data), true);
			  _xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			  _xhr.setRequestHeader("Content-Type", "multipart/form-data");
			  
			  
			  _xhr.onloadstart = function(e) {
				  _self._filelist[pid].status = 1;
				  _self._onloadstart(pid);
			  }
	  
	  
			  _xhr.onabort = function(e) {
				  _self._filelist[pid].status += 4;
				  _self._onabort(pid);
				  if( $.browser.safari ) {
					  _self._filelist[pid].ufile 	= null;
					  _self._xhr[pid] 			= null;
					  _self._createXHR();
				  }
			  }
	  
			  _xhr.onerror = function(e) {
				  _self._filelist[pid].status += 4;
				  _self._onerror(pid);
				  if( $.browser.safari ) {
					  _self._filelist[pid].ufile 	= null;
					  _self._xhr[pid] 				= null;
					  _self._createXHR();
				  }
			  }
	  
			  _xhr.upload.onprogress = function(e) {
				  _self._onprogress(pid, e.loaded, e.total);
			  }
	  			
			  	
			  if( $.browser.safari ) {
				  _xhr.onload = function(e) {
					  //alert("pid:" + pid);
					  var res = $.parseJSON(this.responseText);
					  if( res && res.errorCode > 0 ) {
						  _self._filelist[pid].errorMessage = res.errorMessage;
						  _self._filelist[pid].status 	+= 4;
						  _self._onerror(pid);
						  _self._filelist[pid].ufile 	= null;
						  _self._xhr[pid] 				= null;
					  } else {
						  _self._filelist[pid].status 	+= 8;
						  _self._filelist[pid].ufile 	= null;
						  _self._xhr[pid] 				= null;
						  _self._onloadend(pid);
					  }
					  _self._createXHR();
					  if( _self.settings.uploadDone && $.isFunction(_self.settings.uploadDone)) _self.settings.uploadDone(res);
					  $(_self.settings.btnImgCut).show(); 
				  }
			  } else {
				  _xhr.onloadend = function(e) {
					  //alert("pid:" + pid);
					  var res = $.parseJSON(this.responseText);
					  if(res && res.errorCode > 0 ) {
						  _self._filelist[pid].errorMessage = res.errorMessage;
						  _self._filelist[pid].status 	+= 4;
						  _self._onerror(pid);
						  _self._filelist[pid].ufile 	= null;
						  _self._xhr[pid] 				= null;
						  _self._createXHR();
					  } else {
						  _self._filelist[pid].status 	+= 8;
						  _self._filelist[pid].ufile 	= null;
						  _self._xhr[pid] 				= null;
						  _self._onloadend(pid);
						  _self._createXHR();
					  }
					  if( _self.settings.uploadDone && $.isFunction(_self.settings.uploadDone)) _self.settings.uploadDone(res);
					  $(_self.settings.btnImgCut).show(); 
				  }
			  }
			  
			  
			  _xhr.onreadystatechange = function(e) {
					  switch(this.readyState) {
						  case 1:
							  break;
						  case 2:
							  break;
						  case 3:
							  break;
						  case 4:
							 /*
							  if( this.status == 200 ) {
							  }
							  */
							  break;
					  }
			  }
	  
			  _xhr.setRequestHeader("X-File-Name", encodeURIComponent(_self._filelist[pid].fileName));
			  //_xhr.setRequestHeader("Content-Length", _self._filelist[pid].fileSize);
			  _xhr.send(_self._filelist[pid].ufile);
			  // end of NONE IE
		}
	},
	
	//internal xhr event
	_onloadstart: function(pid) {
		$("a.lwhUpload-status[uid='" + pid + "']").removeClass("lwhUpload-status0 lwhUpload-status1 lwhUpload-status4 lwhUpload-status8").addClass("lwhUpload-status" + this._formatStatus(this._filelist[pid].status));
		$("div.lwhUpload-progressbar[uid='" + pid + "']").removeClass("lwhUpload-progressbar-hide");
	},
	
	_onloadend: function(pid) {
		$("a.lwhUpload-cancel[uid='" + pid + "']").addClass("lwhUpload-cancel-hide");
		$("a.lwhUpload-status[uid='" + pid + "']").removeClass("lwhUpload-status0 lwhUpload-status1 lwhUpload-status4 lwhUpload-status8").addClass("lwhUpload-status" + this._formatStatus(this._filelist[pid].status));
		$("div.lwhUpload-progressbar[uid='" + pid + "']").addClass("lwhUpload-progressbar-hide");
		$("span.lwhUpload-filesize[uid='" + pid + "']").html(this._formatSize(this._filelist[pid].fileSize));
		//$("span.lwhUpload-msg[uid='" + pid + "']").html(this._filelist[pid].errorMessage);
	},

	_onabort: function(pid) {
		$("a.lwhUpload-cancel[uid='" + pid + "']").addClass("lwhUpload-cancel-hide");
		$("a.lwhUpload-status[uid='" + pid + "']").removeClass("lwhUpload-status0 lwhUpload-status1 lwhUpload-status4 lwhUpload-status8").addClass("lwhUpload-status" + this._formatStatus(this._filelist[pid].status));
		$("div.lwhUpload-progressbar[uid='" + pid + "']").addClass("lwhUpload-progressbar-hide");
		$("span.lwhUpload-msg[uid='" + pid + "']").html("Cancel");
	},

	_onerror: function(pid) {
		$("a.lwhUpload-cancel[uid='" + pid + "']").addClass("lwhUpload-cancel-hide");
		$("a.lwhUpload-status[uid='" + pid + "']").removeClass("lwhUpload-status0 lwhUpload-status1 lwhUpload-status4 lwhUpload-status8").addClass("lwhUpload-status" + this._formatStatus(this._filelist[pid].status));
		$("div.lwhUpload-progressbar[uid='" + pid + "']").addClass("lwhUpload-progressbar-hide");
		$("span.lwhUpload-msg[uid='" + pid + "']").html(this._filelist[pid].errorMessage);
	},
	
	_onprogress: function(pid, loaded, total) {
		var theBar 	= $("div.lwhUpload-progressbar[uid='" + pid + "']");
		var percent = 0;
		if(total > 0 ) {
			percent = parseInt(loaded) / parseInt(total);
		}
		
		var percent_ww = percent * theBar.outerWidth();
		var gobar =	 parseInt(-250 + percent_ww);
		theBar.css("background-position",  gobar + "px center");
		theBar.html( Math.round(percent * 100) + "%");
	},

	_infoHEAD: function() {
		var html = '';
		html += '<span style="color:#666666; font-size:12px;">';
		html += '<center><a class="lwhUpload-buttton-upload" title="Select a file to upload"></a></center>';
		var tmp_str = '';
		tmp_str += 'Allowed upload type: <b>' + (this.settings.allowExt.length>0?this.settings.allowExt.join(", "):'all') + '</b>. ';
		tmp_str += '<br>Maximum Size: <b>' + (this.settings.allowSize>0?this.settings.allowSize.toSize():'unlimited') + '</b>';
		html += tmp_str;
		html += '</span><br>';
		html += '<span class="lwhUpload-log-title">Status:</span>';
		html += '<a class="lwhUpload-log-clean" title="Clean Log"></a>';
		//html += '<hr style="width:100%; height:1px; border:1px dotted #cccccc;" />';
		html += '<div 	class="lwhUpload-queue" style="height:150px;">';
		html += '<table class="lwhUpload-queue-table" border="0" cellspacing="1" cellpadding="0" width="100%">';
		html += '<tr rowno="head">';
		html += '<td class="lwhUpload-queue-table-head">File Name</td>';
		html += '<td class="lwhUpload-queue-table-head">Size</td>';
		html += '<td class="lwhUpload-queue-table-head" style="width:125px; white-space:nowrap;">Progress</td>';
		html += '</table>';
		html += '</div>';
		return html;
	},
	
	_infoHTML: function(pid, fObj) {
		var html = '';
		html += '<tr class="lwhUpload-queue-item" uid="' +  pid + '">';
		html += '<td>';
		html += '<a class="lwhUpload-status lwhUpload-status0" uid="' +  pid + '"></a>';
		html += '<span class="lwhUpload-filename" uid="' +  pid + '">' + this._formatFileName(fObj.fileName) + '</span>';
		html += '</td><td align="right">';
		html += '<span class="lwhUpload-filesize" uid="' +  pid + '">' + this._formatSize(fObj.fileSize) + '</span>';
		html += '</td><td>';
		html += '<span class="lwhUpload-msg" style="font-size:10px; color:red;" uid="' + pid + '"></span>';
		if(this.ie) {
			 html += '<div class="lwhUpload-progressbar lwhUpload-progressbar-ie lwhUpload-progressbar-hide" uid="' + pid + '"></div>';
		} else {
			 html += '<div class="lwhUpload-progressbar lwhUpload-progressbar-ff lwhUpload-progressbar-hide" uid="' + pid + '"></div>';
		}
		html += '<a class="lwhUpload-cancel" uid="' +  pid + '"></a>';
		html += '</td>';
		html += '</tr>';
		$("tr[rowno='head']" ,".lwhUpload-queue-table").after(html);
	},
	
   	_getName: function(filename){
        // get input value and remove path to normalize
        return filename.replace(/.*(\/|\\)/, "");
    },
	  
   	_getExt: function(filename){
        return (filename.indexOf('.') !== -1)?filename.replace(/.*[.]/, '').toLowerCase() :'';
	},
	
    _formatFileName: function(name){
        if (name.length > 30){
            name = name.slice(0, 21) + '...' + name.slice(-8);    
        }
        return name;
    },

    _formatSize: function(bytes){
        if( bytes <= 0 ) return '';
		var i = -1;                                    
        do {
            bytes = bytes / 1024;
            i++;  
        } while (bytes > 99);
        
        return Math.max(bytes, 0.1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];          
    },
	
	_formatStatus: function(status) {
		if( (status & 4) == 4 ) {
			return 4;
		} else {
			return Math.max( (status & 1) , (status & 8) );
		}
	},
	
	_createInput: function() {
		var _self = this;
		$("input[name='qqfile']", this.fileButton).remove();
		// safari must be single select
		var multiple_flag = this.settings.multiple && !( $.browser.safari && navigator.userAgent.toLowerCase().indexOf("chrome")<0 );
		var file_el = $(this.fileButton).append('<input type="file" name="qqfile" style="position:absolute; top:0px; right:0px; font-size:222px; filter:alpha(opacity:0); opacity:0;" ' + (multiple_flag?'multiple="multiple"':'') + ' />')[0].lastChild;
		$(file_el).unbind("change").bind("change", function(ev) {
			_self.append(this);
		});
	}
}


// used to debug info.
function showFiles(fileObj) {
	var tfiles = fileObj._filelist;
	var str = '';
	for(var i = 0; i < tfiles.length; i++) {
		str += "sn:" + i + " || SS:" + tfiles[i].status + " || point:" + fileObj.pointer +  " || File:" + tfiles[i].fileName + " || Size:" + tfiles[i].fileSize + " || length:" + tfiles.length + "<br>\n";
		str += '<div class="lwhUpload-progressbar lwhUpload-progressbar-hide" uid="' + i + '"></div>';
	}
	return str;
}


function add_event( xhr ) {
			if( xhr.upload) { 
				  //xhr.upload.event to record uploading processing
				  xhr.upload.onloadstart = function(e) {
					  $("#dshow").append( displayObj("upload loadstart", e));
				  }
				  
				  xhr.upload.onprogress = function(e){
					  $("#dshow").append( displayObj("upload progress", e));
				  }
				  
				  xhr.upload.onload = function(e) {
					  $("#dshow").append( displayObj("upload load", e));
				  }
				  
				  xhr.upload.onloadend = function(e) {
					  $("#dshow").append( displayObj("upload loadend", e));
				  }
				  
				  xhr.upload.onabort = function(e) {
					  $("#dshow").append( displayObj("upload abort", e));
				  }
				  
				  xhr.upload.onerror = function(e) {
					  $("#dshow").append( displayObj("upload error", e));
				  }
				  
				  // firefox, opera available,   safari, chrome not available 
				  xhr.upload.ontimeout = function(e) {
					  $("#dshow").append( displayObj("upload timeout", e));
				  }
	

				 //xhr.event to record general start and end
				  xhr.onloadstart = function(e) {
					  $("#dshow").append( displayObj("loadstart", e));
				  }
	  
				  xhr.onprogress = function(e){
					  $("#dshow").append( displayObj("progress", e));
				  }
	  
				  xhr.onload = function(e) {
					  $("#dshow").append( displayObj("load", e));
				  }
				  xhr.onloadend = function(e) {
					  $("#dshow").append( displayObj("loadend", e));
				  }
				  
				  xhr.onabort = function(e) {
					  $("#dshow").append( displayObj("abort", e));
				  }
	  
	  
				  xhr.onerror = function(e) {
					  $("#dshow").append( displayObj("error", e));
				  }
				  
				  xhr.ontimeout = function(e) {
					  $("#dshow").append( displayObj("timeout", e));
				  }
				  //end of xhr.event
			}
	
}

function displayObj( evname , e) {
	var str = '';
	if(!isNaN(e)) 
		str += '<a href="javascript:aj.abort(' + e + ');">' + evname + "</a><br>\n";
	else 
		str += evname + "<br>\n";
	
	return str;
}

function displayObj1(objName,e) {
		var ret_str = "";
		ret_str += objName + "--(" +  e.loaded.toSize() +  ":" + e.total.toSize() + ":" + e.lengthComputable + ")-------------<br>\n";
		if( 1==0 ) {
			for(var key in e) {
				ret_str += objName + " key:" + key + "  value:" + e[key] + "<br>\n";
			}
		}
		ret_str += "<br>\n";
		return ret_str;
}


/*******************************************************************************************/
/*
		if(window.XMLHttpRequest) {
			_self.xhr = new XMLHttpRequest();
*/
			/******************************************************************************************************************************/
			/*Upload process:  readystate 1, loadstart,  upload.loadstart, readystate 2, readystate 3, upload.progress, readystate 4, upload.load,  upload.loadend, progress, load, loadend 
			/*Abort  process:  readystate 1, loadstart,  upload.loadstart,  upload.progress, readystate 4, abort, loadend, upload.abort upload.loadend 
			/*Error  process:  readystate 1, loadstart,  upload.loadstart,  readystate 2, readystate 4, error, loadend, upload.error, upload.loadend 
			/******************************************************************************************************************************/
/*
			if( _self.xhr.upload) { 
				  //xhr.upload.event to record uploading processing
				  _self.xhr.upload.onloadstart = function(e) {
					  $("#dshow").append( _self.displayObj("upload loadstart", e));
				  }
				  
				  _self.xhr.upload.onprogress = function(e){
					  $("#dshow").append( _self.displayObj("upload progress", e));
				  }
				  
				  _self.xhr.upload.onload = function(e) {
					  $("#dshow").append( _self.displayObj("upload load", e));
				  }
				  
				  _self.xhr.upload.onloadend = function(e) {
					  $("#dshow").append( _self.displayObj("upload loadend", e));
				  }
				  
				  _self.xhr.upload.onabort = function(e) {
					  $("#dshow").append( _self.displayObj("upload abort", e));
				  }
				  
				  _self.xhr.upload.onerror = function(e) {
					  $("#dshow").append( _self.displayObj("upload error", e));
				  }
				  
				  // firefox, opera available,   safari, chrome not available 
				  _self.xhr.upload.ontimeout = function(e) {
					  $("#dshow").append( _self.displayObj("upload timeout", e));
				  }
	

				 //xhr.event to record general start and end
				  _self.xhr.onloadstart = function(e) {
					  $("#dshow").append( _self.displayObj("loadstart", e));
				  }
	  
				  _self.xhr.onprogress = function(e){
					  $("#dshow").append( _self.displayObj("progress", e));
				  }
	  
				  _self.xhr.onload = function(e) {
					  $("#dshow").append( _self.displayObj("load", e));
				  }
				  _self.xhr.onloadend = function(e) {
					  $("#dshow").append( _self.displayObj("loadend", e));
				  }
				  
				  _self.xhr.onabort = function(e) {
					  $("#dshow").append( _self.displayObj("abort", e));
				  }
	  
	  
				  _self.xhr.onerror = function(e) {
					  $("#dshow").append( _self.displayObj("error", e));
				  }
				  
				  _self.xhr.ontimeout = function(e) {
					  $("#dshow").append( _self.displayObj("timeout", e));
				  }
				  //end of xhr.event
			}
			
			_self.xhr.onreadystatechange = function(e) {
				switch(this.readyState) {
					case 1:
						$("#dshow").append("readystate change 111:" + this.readyState + "----<br>\n");
						break;
					case 2:
						var head = this.getAllResponseHeaders();
						alert("status 2:" + this.status);
						$("#dshow").append("readystate change 222:" + this.readyState + "----<br>\n");
						break;
					case 3:
						$("#dshow").append("readystate change 333:" + this.readyState + "----<br>\n");
						break;
					case 4:
						$("#dshow").append("readystate change 444:" + this.readyState + "----<br>\n");
						alert("state 4:" + this.status );
						//var head = this.getAllResponseHeaders();
						//alert("status 4:" + head);
						//save_content_to_file(this.responseText,"wwww.jpg");
						break;
				}
			}
			
			_self.xhr.open("post", _self.settings.url, true);
			_self.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			_self.xhr.setRequestHeader("Content-Type", "multipart/form-data");

		} else if (window.ActiveXObject) {
			alert("IE");
			_self.xhr = new ActiveXObject("MSXML2.XMLHTTP") || new ActiveXObject("Microsoft.XMLHTTP");
		}
*/
/**************************************************************************************************************/
