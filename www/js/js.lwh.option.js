var LWH = LWH || {};
LWH.OPTION = function(opts) {
	this.data = [];
	this.htmlBox    = null;
	this.divBox 	= null;
	this.itemBox 	= null;
	this.valObj		= {
		val: 	[],
		text: 	[]
	};
	this.syncObj    = {
		valObj: null,
		textObj: null
	};
	this.func = {
			click: 	null,
			before: null,
			after: 	null,
			clear:	null
	};
	this.table = {
		head: {
			lang:		DLang,
			container:  "",
			trigger:	"",
			url:		"",
	
			header:		1,
			highlight:	1,
			btnall:   	1,
			btnfind:	1,
			multiple:	1,
			autohide:	1,
			
			action: 	"load",
			loading: 	0,
			wait:		1,
			level:		0,   // important: 1, 2, 3
			match:		0,
			
			title1:		"",
			title2:		"",  // not in use
			title3:		"",
			level1:		0,   // not in use
			level2:   	0,   // column number for level 2
			level3:		0    // column number for level 3
		},
		schema: {
			fval:  	"",
			fftable: {
				name: "",	//  Sample: "info_filter_category",
				fid:  "",   //  Sample: "filter_id",
				vid:  "",   //  Sample: "category_id"
				val:  ""
			},
			pptable: {
				name:"",
				id: "",
				title:"",
				desc:""
			}, 
			mmtable: {
				name:"",
				id:"",
				pid:"",
				title:"",
				desc:""
			},
			sstable: {
				name:"",
				id:"",
				mid:"",
				title:"",
				desc:""
			}
		}
	};
	$.extend(this.table.head, 	opts.head);
	$.extend(this.table.schema, opts.schema);
	
	$.extend(this.func, 	opts.func);
	$.extend(this.valObj, 	opts.valObj);
	$.extend(this.syncObj, 	opts.syncObj);
	
	var _self 	= this;
	// class constructor
	var _constructor = function() {
		if( _self.table.head.container ) {
			$(_self.table.head.container).empty();
			var html_hh = [	'<div class="lwhOption' + (parseInt(_self.table.head.header)?' lwhOption-head':'') + '">',
								'<div class="lwhOption-headarea">',
								'<a class="lwhOption-button-selection" style="margin-top:3px; margin-left:3px; margin-right:3px;">',
									'<div class="lwhOption-selectionarea">',
									'<div class="lwhOption-selectionarea-head">' + gcommon.trans[_self.table.head.lang].words["selected"] + '</div>',
									'<ul class="lwhOption-selectionarea-content"></ul>',
									'</div>',
								'</a>',
								parseInt(_self.table.head.btnfind)?[
								'<a class="lwhOption-button-search" style="margin-top:3px; margin-left:3px;" title="' + gcommon.trans[_self.table.head.lang].words["search"] + '">',
									'<input class="lwhOption-search-text" type="text" style="width:120px;" />',
									'<span class="lwhOption-button-search-del" title="' + gcommon.trans[_self.table.head.lang].words["remove filter"] + '"></span>',
								'</a>'].join(''):'',
								parseInt(_self.table.head.btnall)?'<input type="button" class="lwhButton lwhButton-blue lwhButton-removeall lwhButton-h22" style="margin-top:3px; margin-left:3px;" value="' + gcommon.trans[_self.table.head.lang].words["remove all"] + '" />':'',
								'</div>',

								'<div class="lwhOption-content"></div>',
							'</div>'
						  ].join('');
			_self.htmlBox = $(_self.table.head.container).append(html_hh)[0].lastChild;
			_self.itemBox = $(".lwhOption-content",_self.table.head.container)[0];
		} else {
			var html_hh = [	
							'<div class="lwhWrapBox">',
								'<div class="lwhWrapBox-content">',

									'<div class="lwhOption' + (parseInt(_self.table.head.header)?' lwhOption-head':'') + '">',
										'<div class="lwhOption-headarea">',
										'<a class="lwhOption-button-selection" style="margin-top:3px; margin-left:3px; margin-right:3px;">',
											'<div class="lwhOption-selectionarea">',
											'<div class="lwhOption-selectionarea-head">' + gcommon.trans[_self.table.head.lang].words["selected"] + '</div>',
											'<ul class="lwhOption-selectionarea-content"></ul>',
											'</div>',
										'</a>',
										parseInt(_self.table.head.btnfind)?[
										'<a class="lwhOption-button-search" style="margin-top:3px; margin-left:3px;" title="' + gcommon.trans[_self.table.head.lang].words["search"] + '">',
											'<input class="lwhOption-search-text" type="text" style="width:120px;" />',
											'<span class="lwhOption-button-search-del" title="' + gcommon.trans[_self.table.head.lang].words["remove filter"] + '"></span>',
										'</a>'].join(''):'',
										parseInt(_self.table.head.btnall)?'<input type="button" class="lwhButton lwhButton-blue lwhButton-removeall lwhButton-h22" style="margin-top:3px; margin-left:3px;" value="' + gcommon.trans[_self.table.head.lang].words["remove all"] + '" />':'',
										'</div>',

										'<div class="lwhOption-content"></div>',
									'</div>',

								'</div>',
							'</div>'
						  ].join('');
			_self.htmlBox 	=  $("body").append(html_hh)[0].lastChild;
			_self.divBox 	=  _self.htmlBox; //$("body").append(html_hh)[0].lastChild;
			_self.itemBox 	=  $("div.lwhOption-content", _self.divBox )[0];
		    $(_self.divBox).lwhWrapBox({
				before: function(el) {
					if( _self.func.before) if($.isFunction(_self.func.before)) {
						_self.func.before(_self.valObj);
					}
				},
				after:  function(el) {
					if( _self.func.after) if($.isFunction(_self.func.after)) {
						_self.func.after(_self.valObj);
					}
				}
			});
		}
		

		$("input.lwhOption-search-text, span.lwhOption-button-search-del", _self.htmlBox).die("click").live("click", function(ev) {
				ev.stopPropagation();
				ev.preventDefault();
				return false;
		});

		$("input.lwhOption-search-text", _self.htmlBox).die("keydown").live("keydown", function(ev) {
			if (ev.keyCode == 13) {
				if( $(this).val() != _self.table.schema.fval )
					_self.ajaxCall(_self.table);
			}
		});

		$("a.lwhOption-button-search", _self.htmlBox).die("click").live("click", function(ev) {
				_self.ajaxCall(_self.table);
				ev.stopPropagation();
				ev.preventDefault();
				return false;
		});

		$("span.lwhOption-button-search-del", _self.htmlBox).die("click").live("click", function(ev) {
				$("input.lwhOption-search-text", _self.htmlBox).val("");
				if( $("input.lwhOption-search-text", _self.htmlBox).val() != _self.table.schema.fval )
					_self.ajaxCall(_self.table);
				ev.stopPropagation();
				ev.preventDefault();
				return false;
		});
			
		
		
		$(".lwhButton-removeall", _self.htmlBox).unbind("click").bind("click", function(ev){
			_self.clear();
		});
		
		if( _self.table.head.trigger ) {
			$(_self.table.head.trigger).unbind("click").bind("click", function(ev) {
				_self.show();
			});
		}
		
		// if  syncObj dom change.   need to  update item selection hightlight
		//  same as setSync;
		$(_self.syncObj.valObj).unbind("optionEvent").bind("optionEvent", function(ev, obj) {
				_self.valObj.val 		= (""+$(_self.syncObj.valObj).val()).split(",");
				$("input.lwhOption-search-text", _self.htmlBox).val("");
				if( $("input.lwhOption-search-text", _self.htmlBox).val() != _self.table.schema.fval ) {
					 _self.ajaxCall(_self.table);
				} else {
					_self.obj2DomText(_self.valObj);
					_self.dom2Obj(_self.valObj);
				}
		});
		
		if( _self.syncObj.valObj ) _self.valObj.val = (""+$(_self.syncObj.valObj).val()).split(",");
		_self.ajaxCall(_self.table);

	}();
}


LWH.OPTION.prototype = {
	/*** Ajax *****************************************************************************************/
	ajaxCall: function(ntable) {
		var _self = this;
		ntable.head.loading = 1;
		ntable.schema.fval = $("input.lwhOption-search-text", _self.htmlBox).val()?$("input.lwhOption-search-text", _self.htmlBox).val():"";
		if(ntable.head.wait) wait_show();
		$.ajax({
			data: {
				table: ntable,
				valObj: _self.valObj
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				if(ntable.head.wait) wait_hide();
			},
			success: function(req, tStatus) {
				if(ntable.head.wait) wait_hide();
				errorHandler(req);
				
				if( req.errorCode == 0 ) {
					if(req.table.head) $.extend(_self.table.head, req.table.head);
					
					_self.table.data 	= [];
					_self.table.data 	= req.table.data;
					_self.valObj 		= req.valObj;
					_self.toHTML();
				}
			},
			type: "post",
			url: (ntable.head.url?ntable.head.url:"ajax/lwhOption_ajax.php")
		});
	},
	
	toHTML: function() {
		$(this.itemBox).empty();
		switch( parseInt(this.table.head.level) ) {
			case 1:
				var html = this.levelOne( this.table.data );
				$(this.itemBox).html(html);
				this.levelOneEvent();
				this.levelThreeEvent();
				break;
			case 2:
				var html = this.levelTwo( this.table.data );
				$(this.itemBox).html(html);
				this.levelThreeEvent();
				break;
			case 3:
				var html = '';
				if( this.table.head.title3 ) {
					html += '<ul class="lwhOption-two">';
					html += '<li class="item-two" title="' + this.table.head.title3 + '">';
					html += this.table.head.title3;
					html += this.levelThree( this.table.data );
					html += '</li>';
					html += '</ul>';
				} else {
					html += this.levelThree( this.table.data );
				}
				$(this.itemBox).html(html);
				this.levelThreeEvent();
				break;	
		}
		this.obj2Dom(this.valObj);
		//this.setVal(this.valObj);
	},
	
	/*
	setVal({
		val: 	[1,3,7],
		text:	["x11", "x22", "x33"]
	})
	*/
	setVal:  function(vObj) {
		// schema.fval 是指查找模式，输入查找关键字以后过滤查找， 而不是过滤
		this.valObj	= vObj;
		$("input.lwhOption-search-text", this.htmlBox).val("");
		if( $("input.lwhOption-search-text", this.htmlBox).val() != this.table.schema.fval ) {
			 this.ajaxCall(this.table);
		} else {
			this.obj2Dom(this.valObj);
			this.dom2Obj(this.valObj);
		}
	},

	obj2Dom:  function(obj) {
		var _self = this;
		var highlight = parseInt(_self.table.head.highlight)?"highlight":"";
		$("li.item-three-item", _self.itemBox).removeClass("item-three-item-selected").removeClass(highlight);
		$(".lwhOption-selectionarea-content", _self.htmlBox).empty();
		$("div.head-one span.level-one-selection-text", _self.itemBox).empty();
		var vtext = "";
		if( obj ) if(obj.val) {
			$.each(obj.val, function(i, n) {
				$("li.item-three-item[sid='" + n + "']", _self.itemBox).addClass("item-three-item-selected").addClass(highlight);
			});

			for(var i = 0; i < _self.valObj.text.length; i++) {
				// using the right  valtext  
				$(".lwhOption-selectionarea-content", _self.htmlBox).append('<li>' + _self.valObj.text[i] + '</li>'); 
			}
		
			vtext =  _self.valObj.text &&  _self.valObj.text!="null"? _self.valObj.text.join(", "):"";
			$("div.head-one span.level-one-selection-text", _self.itemBox).html( vtext ).attr("title", vtext);
			
			if(_self.syncObj.valObj) $(_self.syncObj.valObj).val( _self.valObj.val.join(",") );
			if(_self.syncObj.textObj) $(_self.syncObj.textObj).html( _self.valObj.text.join(", ") );
			
			$(this.syncObj.valObj).trigger("colEvent", this.valObj.val.join(","));
		}
	},


	obj2DomText:  function(obj) {
		var _self = this;
		var highlight = parseInt(_self.table.head.highlight)?"highlight":"";
		$("li.item-three-item", _self.itemBox).removeClass("item-three-item-selected").removeClass(highlight);
		$(".lwhOption-selectionarea-content", _self.htmlBox).empty();
		$("div.head-one span.level-one-selection-text", _self.itemBox).empty();
		var vtext = "";
		if( obj ) if(obj.val) {
			$.each(obj.val, function(i, n) {
				$("li.item-three-item[sid='" + n + "']", _self.itemBox).addClass("item-three-item-selected").addClass(highlight);
				switch( parseInt(_self.table.head.level) ) {
					case 1:
						var ttt = $("div.content-one li.item-three-item[sid='" + n + "']", _self.itemBox).text();
						$(".lwhOption-selectionarea-content", _self.htmlBox).append('<li>' + ttt + '</li>'); 
						vtext += (vtext==""?"":", ") + ttt;
						obj.text[i] = ttt;
						break;
					case 2:
					case 3:
						var ttt = $("li.item-three-item[sid='" + n + "']", _self.itemBox).text();
						$(".lwhOption-selectionarea-content", _self.htmlBox).append('<li>' + ttt + '</li>'); 
						vtext += (vtext==""?"":", ") + ttt;
						obj.text[i] = ttt;
						break;
				}
			});
			$("div.head-one span.level-one-selection-text", _self.itemBox).html( vtext ).attr("title", vtext);
		}
	},

	dom2Obj:  function(obj) {
			var _self = this;
			obj.val 	= [];
			obj.text 	= [];
			switch( parseInt(_self.table.head.level) ) {
				case 1:
					$("div.content-one li.item-three-item-selected", _self.itemBox ).each(function(idx1, el1) {
						obj.val.push($(this).attr("sid"));
						obj.text.push($(this).text());
					});
					break;
				case 2:
				case 3:
					$("li.item-three-item-selected", _self.itemBox ).each(function(idx1, el1) {
						obj.val.push($(this).attr("sid"));
						obj.text.push($(this).text());
					});
					break;
			}
			return obj;
	},
	
	clear:  function() {
		this.valObj.val 	= [];
		this.valObj.text 	= [];

		$("input.lwhOption-search-text", this.htmlBox).val("");
		if( $("input.lwhOption-search-text", this.htmlBox).val() != this.table.schema.fval ) {
			 this.ajaxCall(this.table);
		} else {
			this.obj2Dom(this.valObj);
			this.dom2Obj(this.valObj);
		}

		if( this.func.clear) if($.isFunction(this.func.clear)) {
			this.func.clear(this.valObj);
		}
	},
	
	show: function() {
		$(this.divBox).wrapBoxShow();
	},
	hide: function() {
		$(this.divBox).wrapBoxHide();
	},


	/*
	setSync({
		valObj: 	$(xxx)[0],
		textObj: 	$(xxx)[1]
	});
	*/
	setSync: function( sobj ) {
		if(sobj) {
			this.syncObj.valObj 	= sobj.valObj;
			this.syncObj.textObj 	= sobj.textObj;
			
			this.valObj.val 		= (""+$(this.syncObj.valObj).val()).split(",");
			$("input.lwhOption-search-text", this.htmlBox).val("");
			if( $("input.lwhOption-search-text", this.htmlBox).val() != this.table.schema.fval ) {
				 this.ajaxCall(this.table);
			} else {
				this.obj2DomText(this.valObj);
				this.dom2Obj(this.valObj);
			}
		}
	},
	
	
	
	/***********************************************************************************************************************/
	/* three levels  *******************************************************************************************************/
	
	levelOne: function( data ) {
		var html = gcommon.trans[this.table.head.lang].words["no item"];
		//if(data) if(data.length > 0) { 
			html = '<div class="lwhOption-one">';
			
			html_ii = '<ul>';
				html_ii += '<li class="item-one head-one" content="' + this.table.head.title1 + '">';
				html_ii += this.table.head.title1;
				html_ii += '</li>';
				for(var i = 0; i < data.length; i++) {
					html_ii += '<li class="item-one item-one-hover" pid="' + data[i].id + '" title="' + (data[i].description?data[i].description:'') + '">';
					html_ii += data[i].title;
					html_ii += '</li>';
				}
			html_ii += '</ul>';

			html_mm = '<div>';
			html_mm += '<div class="head-one"><span class="level-one-selection">' + gcommon.trans[this.table.head.lang].words["selected"] + '  : <span class="level-one-selection-text"></span></span></div>';
			html_mm += '<div class="main-one">';
			var sssdata = [];
			for(var i = 0; i < data.length; i++) {
				if( data[i].data ) {
					for(var j=0; j<data[i].data.length; j++) {
						sssdata[sssdata.length] = data[i].data[j];
					}
				}
			}
			html_mm	+= this.levelTwo(sssdata);
			html_mm += '</div>';

				for(var i = 0; i < data.length; i++) {
					html_mm	+= '<div class="content-one">' + this.levelTwo(data[i].data) + '</div>';
				}
		    html_mm += '</div>';

			html += html_ii;
			html += html_mm;
			
			html += '</div>';
		//}
		return html;
	},
	
	levelTwo: function( data ) {
		var html = '<span class="lwhOption-noitem">' + gcommon.trans[this.table.head.lang].words["no item"] + '</span>';
		if(data) if(data.length > 0) { 
			html = '<div class="lwhOption-two">';
			if( this.table.head.level2 > 0 ) {
				var colsn 	= 0;
				var colArr 	= [];
				for(var i = 0; i < data.length; i++) {
					htmltt = '<ul class="lwhOption-two">';
					htmltt += '<li class="item-two" mid="' + data[i].id + '" title="' + (data[i].description?data[i].description:'') + '">';
					htmltt += data[i].title;
					htmltt += this.levelThree(data[i].data);
					htmltt += '</li>';
					htmltt += '</ul>';
					htmltt += '<br>';
					
					colArr[colsn] = (colArr[colsn]?colArr[colsn]:'') + htmltt;

					colsn++;
					if( colsn >= this.table.head.level2 ) {
						colsn = 0;
					}
				}
				// table 
				html	+= '<table border="1" cellpadding="5" cellspacing="0" width="100%" style="background-color:#ffffff; border-collapse:collapse; border-color:#ffffff;">';
				html 	+= '<tr>';
				var width = (100 / this.table.head.level2) + "%";
				for(i = 0; i < this.table.head.level2; i++) {
					html += '<td valign="top" align="left" width="' + width + '" style="border-color:#cccccc;">';
					html += colArr[i]?colArr[i]:'';
					html += '</td>';
				}
				html += '</tr>';
				html += '</table>';
				// end table

			} else {
				for(var i = 0; i < data.length; i++) {
					html += '<ul class="lwhOption-two">';
					html += '<li class="item-two" mid="' + data[i].id + '" title="' + (data[i].description?data[i].description:'') + '">';
					html += data[i].title;
					html += this.levelThree(data[i].data);
					html += '</li>';
					html += '</ul>';
				}
			}
			html += '</div>';
		}
		return html;
	},
	
	levelThree: function ( data ) {
		var html = '<ul class="lwhOption-three"><li class="item-three"><span class="lwhOption-noitem">' + gcommon.trans[this.table.head.lang].words["no item"] + '</span></li></ul>';
		if(data) if(data.length > 0) { 
			var colsn = 0;
			html = '<ul class="lwhOption-three">';
			for(var i = 0; i < data.length; i++) {
				html += '<li class="item-three item-three-item" sid="' + data[i].id + '" title="' + (data[i].description?data[i].description:'') + '">' + data[i].title + '</li>';
				colsn++;
				if( this.table.head.level3 > 0 && colsn >= this.table.head.level3 ) {
					html += '<br>';
					colsn = 0;
				}
			}
			html += '</ul>';
		}
		return html;
	},
	
	levelOneEvent: function() {
				var _self = this;
				$("div.lwhOption-one>ul>li.item-one-hover", _self.itemBox).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1+1);
				});

				$("div.lwhOption-one>div>div.content-one", _self.itemBox).each(function(idx1, el1) {
					$(el1).attr("tabsn", idx1+1);
				});
				
				$("div.lwhOption-one>ul>li.item-one-hover", _self.itemBox).unbind("mouseover").bind("mouseover", function(ev){
					$("div.lwhOption-one>div>div.main-one", _self.itemBox).hide();
					$("div.lwhOption-one>ul>li.item-one-hover", _self.itemBox).removeClass("selected");
					$("div.lwhOption-one>div>div.content-one",_self.itemBox).removeClass("selected");
					$(this).addClass("selected");
					$("div.lwhOption-one>div>div.content-one[tabsn='" + $(this).attr("tabsn") + "']", _self.itemBox).addClass("selected");
					
					$("div.lwhOption-one>ul>li.head-one", _self.itemBox).html( $(this).text() );
				});

				$("div.lwhOption-one>div>div.content-one", _self.itemBox).unbind("mouseover").bind("mouseover", function(ev){
					$("div.lwhOption-one>div>div.main-one", _self.itemBox).hide();
					$("div.lwhOption-one>ul>li.item-one-hover", _self.itemBox).removeClass("selected");
					$("div.lwhOption-one>div>div.content-one", _self.itemBox).removeClass("selected");
					$(this).addClass("selected");
					$("div.lwhOption-one>ul>li.item-one-hover[tabsn='" + $(this).attr("tabsn") + "']", _self.itemBox).addClass("selected");
					$("div.lwhOption-one>ul>li.head-one", _self.itemBox).html( $("div.lwhOption-one>ul>li.item-one-hover[tabsn='" + $(this).attr("tabsn") + "']", _self.itemBox).text() );
				});
				
				$("div.lwhOption-one>ul>li.item-one-hover", _self.itemBox).unbind("mouseout").bind("mouseout", function(ev){
					$(this).removeClass("selected");
					$("div.lwhOption-one>div>div.content-one[tabsn='" + $(this).attr("tabsn") + "']", _self.itemBox).removeClass("selected");
					$("div.lwhOption-one>div>div.main-one", _self.itemBox).show();
					$("div.lwhOption-one>ul>li.head-one", _self.itemBox).html( $("div.lwhOption-one>ul>li.head-one", _self.itemBox).attr("content") );
				});

				$("div.lwhOption-one>div>div.content-one", _self.itemBox).unbind("mouseout").bind("mouseout", function(ev){
					$(this).removeClass("selected");
					$("div.lwhOption-one>ul>li.item-one-hover[tabsn='" + $(this).attr("tabsn") + "']", _self.itemBox).removeClass("selected");
					$("div.lwhOption-one>div>div.main-one", _self.itemBox).show();
					$("div.lwhOption-one>ul>li.head-one", _self.itemBox).html( $("div.lwhOption-one>ul>li.head-one", _self.itemBox).attr("content") );
				});
	},
	
	levelThreeEvent: function() {
				var _self = this;
				var highlight = parseInt(_self.table.head.highlight)?"highlight":"";
				$("li.item-three-item", _self.itemBox).unbind("click").bind("click", function(ev) {
					if(parseInt(_self.table.head.multiple)) {
						if( $(this).hasClass("item-three-item-selected") )  {
							if( _self.table.schema.fval == "" ) {
								$("li.item-three-item[sid='" + $(this).attr("sid") + "']", _self.itemBox).removeClass("item-three-item-selected").removeClass(highlight);
							} else {
								var vidx =  _self.valObj.val.indexOf( $(this).attr("sid") );
								_self.valObj.val.splice(vidx, 1);
								var tidx = 	_self.valObj.text.indexOf( $(this).text() );							
								_self.valObj.text.splice(tidx, 1);
							}
							
						} else {
							if( _self.table.schema.fval == "" ) {
								$("li.item-three-item[sid='" + $(this).attr("sid") + "']", _self.itemBox).addClass("item-three-item-selected").addClass(highlight);
							} else {
								_self.valObj.val.push($(this).attr("sid"));
								_self.valObj.text.push($(this).text());
							}
						}
					} else {
						if( _self.table.schema.fval == "" ) {
							$("li.item-three-item", _self.itemBox).removeClass("item-three-item-selected").removeClass(highlight);
							$("li.item-three-item[sid='" + $(this).attr("sid") + "']", _self.itemBox).addClass("item-three-item-selected").addClass(highlight);	
						} else {
							_self.valObj.val	= [];
							_self.valObj.text 	= [];
							_self.valObj.val.push($(this).attr("sid"));
							_self.valObj.text.push($(this).text());
						}

					}

					
					if( _self.table.schema.fval == "" ) {
						_self.dom2Obj(_self.valObj);
						_self.obj2Dom(_self.valObj);
					} else {
						_self.obj2Dom(_self.valObj);
					}
					 
					if( _self.func.click) if($.isFunction(_self.func.click)) {
						_self.func.click(_self.valObj);
					}

					if( parseInt(_self.table.head.autohide) ) {
						if( !parseInt(_self.table.head.multiple) ) 
							if( _self.divBox ) $(_self.divBox).wrapBoxHide();
					}
					
				}); // end of click event
	}	
	
}
