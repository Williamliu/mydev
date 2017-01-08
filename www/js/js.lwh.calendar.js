var LWH = LWH || {};
LWH.CALENDAR = function(opts) {
	this.htmlBox    = null;
	this.divBox 	= null;
	this.itemBox 	= null;
	
	this.valObj		= {
		val: 		[],
		text: 		[]
	};
	
	this.syncObj    = {
		valObj: 	null,
		textObj: 	null
	};

	this.html 		= {
	};
	
	this.func		= {
		before:		null,
		after:		null,
		click:		null,
		clear:		null	
	};
	
	this.today 		= {
	};
	this.current  	= {
		Y: 0,
		M: 0,
		yy: "",
		mm: ""
	};
	this.table = {
		head: {
			lang:  		DLang,	
			scope:		"",
			container:	"",
			trigger:	"",
			url:		"",

			multiple:	1,  // checkbox or radio
			autohide:	0,
			
			action: 	"view",
			loading: 	0,
			wait:		1,
			
			min:		"2016-5-15",
			max:		"2017-04-01",
			curYY:		0,
			curMM:		0
		},
		schema: {
		},
		data: []
	};
	$.extend(this.table.head, 		opts.head);
	$.extend(this.table.schema, 	opts.schema);
	$.extend(this.html, 			opts.html);
	$.extend(this.func, 			opts.func);
	
	var _self 	= this;

	// class constructor
	var _constructor = function() {
			var scope 		= _self.table.head.scope;
			var container 	= _self.table.head.container;
			
			if( container ) {
				$(container).empty();
				var html_hh = [	'<div scope="' + _self.table.head.scope + '" class="lwhAccord">',
									parseInt(_self.table.head.header)?[
									'<div class="lwhAccord-headarea">',
										'<a scope="' + scope + '" class="lwhAccord-navi lwhAccord-navi-loading lwhAccord-navi-loading-na"  style="margin-top:3px; margin-left:2px; margin-right:2px;" title="LOADING..."></a>',
										'<a scope="' + scope + '" class="lwhAccord-button-refresh" style="margin-top:3px; margin-left:2px; margin-right:2px;" title="' + gcommon.trans[_self.table.head.lang].words["navi.refresh"] + '"></a>',
									
										'<a class="lwhAccord-button-selection" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
											'<div class="lwhAccord-selectionarea">',
											'<div scope="' + scope + '" class="lwhAccord-selectionarea-head">' + gcommon.trans[_self.table.head.lang].words["selected"] + '</div>',
											'<ul scope="' + scope + '" class="lwhAccord-selectionarea-content"></ul>',
											'</div>',
										'</a>',
										
										parseInt(_self.table.head.btnfind)?[
										'<a scope="' + scope + '" class="lwhAccord-button-search" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["search"] + '">',
											'<input scope="' + scope + '" class="lwhAccord-search-text" type="text" style="width:80px;" />',
											'<span scope="' + scope + '" class="lwhAccord-button-search-del" title="' + gcommon.trans[_self.table.head.lang].words["remove filter"] + '"></span>',
										'</a>'].join(''):'',
										parseInt(_self.table.head.btnall)?'<a scope="' + scope + '" class="lwhAccord-button-removeall" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["remove all"] + '"></a>':'',

									'</div>'].join(''):'',

									'<div scope="' + scope + '" class="lwhAccord-content"></div>',
								'</div>'
							  ].join('');
				_self.htmlBox = $(container).append(html_hh)[0].lastChild;
				_self.itemBox = $(".lwhAccord-content", container)[0];
			} else {
				var html_hh = [	
								'<div class="lwhWrapBox">',
									'<div class="lwhWrapBox-content">',

										'<div scope="' + scope + '" class="lwhAccord">',
												
												parseInt(_self.table.head.header)?[
												'<div class="lwhAccord-headarea">',
													'<a scope="' + scope + '" class="lwhAccord-navi lwhAccord-navi-loading lwhAccord-navi-loading-na"  style="margin-top:3px; margin-left:2px; margin-right:2px;" title="LOADING..."></a>',
													'<a scope="' + scope + '" class="lwhAccord-button-refresh" style="margin-top:3px; margin-left:2px; margin-right:2px;" title="' + gcommon.trans[_self.table.head.lang].words["navi.refresh"] + '"></a>',
												
													'<a class="lwhAccord-button-selection" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
														'<div class="lwhAccord-selectionarea">',
														'<div scope="' + scope + '" class="lwhAccord-selectionarea-head">' + gcommon.trans[_self.table.head.lang].words["selected"] + '</div>',
														'<ul scope="' + scope + '" class="lwhAccord-selectionarea-content"></ul>',
														'</div>',
													'</a>',
													
													parseInt(_self.table.head.btnfind)?[
													'<a scope="' + scope + '" class="lwhAccord-button-search" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["search"] + '">',
														'<input scope="' + scope + '" class="lwhAccord-search-text" type="text" style="width:80px;" />',
														'<span scope="' + scope + '" class="lwhAccord-button-search-del" title="' + gcommon.trans[_self.table.head.lang].words["remove filter"] + '"></span>',
													'</a>'].join(''):'',
													parseInt(_self.table.head.btnall)?'<a scope="' + scope + '" class="lwhAccord-button-removeall" style="margin-top:3px; margin-left:1px;" title="' + gcommon.trans[_self.table.head.lang].words["remove all"] + '"></a>':'',
				
												'</div>'].join(''):'',
			
												'<div scope="' + scope + '" class="lwhAccord-content"></div>',


										'</div>',
										
									'</div>',
								'</div>'
							  ].join('');
				_self.htmlBox 	=  $("body").append(html_hh)[0].lastChild;
				_self.divBox 	=  _self.htmlBox; //$("body").append(html_hh)[0].lastChild;
				_self.itemBox 	=  $("div.lwhAccord-content", _self.divBox )[0];
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
			
			
			$("select.lwhCalendar-select-month[scope='" + _self.table.head.scope + "']").die("change").live("change", function(ev) {
				_self.current.M = parseInt($(this).val());
				_self.viewCalendar();
			});


			$("input.lwhCalendar-select-year[scope='" + _self.table.head.scope + "']").die("keydown").live("keydown", function(ev) {
                if (ev.keyCode == 13) {
					_self.current.Y = parseInt($(this).val());
					_self.viewCalendar();
                }
			});

			$("input.lwhCalendar-select-year[scope='" + _self.table.head.scope + "']").die("blur").live("blur", function(ev) {
				_self.current.Y = parseInt($(this).val());
				_self.viewCalendar();
			});

			// navigate the page
			$("a.lwhCalendar-button-nav-prev[scope='" + _self.table.head.scope + "']").die("click").live("click", function(ev) {
				_self.current.M--;
				_self.viewCalendar();
			});

			$("a.lwhCalendar-button-nav-next[scope='" + _self.table.head.scope + "']").die("click").live("click", function(ev) {
				_self.current.M++;
				_self.viewCalendar();
			});

			$("a.lwhCalendar-button-nav-today[scope='" + _self.table.head.scope + "']").die("click").live("click", function(ev) {
				_self.current.Y = _self.today.Y;
				_self.current.M = _self.today.M;
				_self.viewCalendar();
			});




			// init min and max date :  for date range			
			_self.table.head.min = _self.table.head.min?_self.table.head.min:"1900-01-01";
			_self.table.head.max = _self.table.head.max?_self.table.head.max:"2099-12-31";
			var minss		= ("" + _self.table.head.min).split("-");
			var maxss		= ("" + _self.table.head.max).split("-");
			_self.mindate	= new Date(parseInt(minss[0]), parseInt(minss[1])-1, parseInt(minss[2]));
			_self.maxdate	= new Date(parseInt(maxss[0]), parseInt(maxss[1])-1, parseInt(maxss[2]));
			///////////////////////////////////////////
			
			_self.initToday();
			_self.current.Y  = parseInt(_self.table.head.curYY)?parseInt(_self.table.head.curYY):_self.today.Y;
			_self.current.M  = parseInt(_self.table.head.curMM)?parseInt(_self.table.head.curMM)-1:_self.today.M;
			_self.viewCalendar();

	}();
}


LWH.CALENDAR.prototype = {
	initToday:  function() {
		this.today.date = new Date();
		this.today.Y = this.today.date.getFullYear();
		this.today.M = this.today.date.getMonth();
		this.today.D = this.today.date.getDate();
		this.today.W = this.today.date.getDay();

		this.today.yy 	= this.today.date.format("Y");
		this.today.mm 	= this.today.date.format("n");
		this.today.dd 	= this.today.date.format("j");
		this.today.time = this.today.date.format("H:i:s");
	},

	viewCalendar: function() {
		var currdate = new Date(this.current.Y, this.current.M, 1);
		
		// important to  convert  2015-13-25  to  2016-01-25
		this.current.Y = currdate.getFullYear();
		this.current.M = currdate.getMonth();
		
		if( currdate > this.maxdate ) {
			this.current.Y = this.maxdate.getFullYear();
			this.current.M = this.maxdate.getMonth();
		}

		currdate = new Date(this.current.Y, this.current.M+1, 0);
		if( currdate < this.mindate ) {
			this.current.Y = this.mindate.getFullYear();
			this.current.M = this.mindate.getMonth();
		}


		this.getMonthWeeks(this.current.Y, this.current.M);
	},
	
    getMonthWeeks: function(theYear, theMonth) {
        var weeks = [];
        var ff_date = new Date(theYear, theMonth, 1);
        var ll_date = new Date(theYear, theMonth + 1, 0);

        var ff_dd = ff_date.getDate();
        var ll_dd = ll_date.getDate();

        var ff_wd = ff_date.getDay();
        var ll_wd = ll_date.getDay();

        var wk_cnt = -1;
        var weeks = [];

        var ss_date = new Date(theYear, theMonth, 0 - ff_wd);
        for (var dd = (ff_dd - ff_wd); dd <= (ll_dd + 6 - ll_wd); dd++) {
            ss_date.setDate(ss_date.getDate() + 1);
            if (ss_date.getDay() == 0) wk_cnt++;
            weeks[wk_cnt] = weeks[wk_cnt] || [];
            weeks[wk_cnt][ss_date.getDay()] = weeks[wk_cnt][ss_date.getDay()] || {};

            weeks[wk_cnt][ss_date.getDay()].date = new Date( ss_date.getFullYear(), ss_date.getMonth(), ss_date.getDate());
            weeks[wk_cnt][ss_date.getDay()].Y = ss_date.getFullYear();
            weeks[wk_cnt][ss_date.getDay()].M = ss_date.getMonth();
            weeks[wk_cnt][ss_date.getDay()].D = ss_date.getDate();
            weeks[wk_cnt][ss_date.getDay()].W = ss_date.getDay();

            weeks[wk_cnt][ss_date.getDay()].yy = ss_date.format("Y");
            weeks[wk_cnt][ss_date.getDay()].mm = ss_date.format("n");
            weeks[wk_cnt][ss_date.getDay()].dd = ss_date.format("j");
            weeks[wk_cnt][ss_date.getDay()].ymd = ss_date.format("Y-m-d");
            weeks[wk_cnt][ss_date.getDay()].time = "00:00:00";
        }
		this.toHTML(weeks);
    },
	
	toHTML: function(weeks) {
		var html = '';
		html += '<table class="lwhCalendar">';
		html += '<tr>';
        html += '<td colspan="7" class="subject">';
        html += '<div>';
		html += '<a scope="' + this.table.head.scope + '" class="lwhCalendar-button lwhCalendar-button-nav-prev" title="' + gcommon.trans[this.table.head.lang].words["previous month"] + '"></a>';
		html += '<a scope="' + this.table.head.scope + '" class="lwhCalendar-button lwhCalendar-button-nav-today" title="' + gcommon.trans[this.table.head.lang].words["today"] + '"></a>';
		html += '<a scope="' + this.table.head.scope + '" class="lwhCalendar-button lwhCalendar-button-nav-add" title="' + gcommon.trans[this.table.head.lang].words["add calendar"] + '"></a>';
		html += '<select class="lwhCalendar-select-month" scope="' + this.table.head.scope + '">';		
		for(var idx in gcommon.basic[this.table.head.lang].month_short) {
			html += '<option value="' + idx + '"' + (idx==this.current.M?" selected":"") + '>' + gcommon.basic[this.table.head.lang].month_short[idx].toUpperCase() + '</option>';
		}
		html += '</select>';		
		html += ' / ';
		html += '<input class="lwhCalendar-select-year" scope="' + this.table.head.scope + '" type="text" placeholder="Year" minlength="4" maxlength="4" value="' + this.current.Y + '" />';
		html += '<a scope="' + this.table.head.scope + '" class="lwhCalendar-button lwhCalendar-button-nav-next" title="' + gcommon.trans[this.table.head.lang].words["next month"] + '"></a>';
		html += '<div>';
        html += '</td>';
		html += '</tr>';

        html += '<tr>';
        html += '<td colspan="7" style="background-color:#003c54; height:2px;"></td>';
        html += '</tr>';

        html += '<tr>';
		for(var idx in gcommon.basic[this.table.head.lang].day_short) {
			html += '<td class="head' + (idx==0 || idx==6?' head-weekend':'') + '">' + gcommon.basic[this.table.head.lang].day_short[idx] + '</td>';
		}
        html += '</tr>';

		for(var weekidx in weeks) {
			html += '<tr>';
			for(var dayidx in weeks[weekidx]) {
				var dateObj = weeks[weekidx][dayidx];
				
				if( dateObj.date >= this.mindate && dateObj.date <= this.maxdate ) {
					html += '<td valign="top" class="date' + (dateObj.Y==this.today.Y && dateObj.M==this.today.M && dateObj.D==this.today.D?' date-today':'') + (dayidx==0 || dayidx==6?' date-weekend':'') + '">';
					html += '<div>';
					//html += '<span class="date-digi' + (dateObj.M!=this.current.M?' date-digi-na':'') + '">' + gcommon.basic[this.table.head.lang].month_short[dateObj.M] + '-' + dateObj.dd + '</span>';
					html += '<span class="date-digi' + (dateObj.M!=this.current.M?' date-digi-na':'') + '">' + dateObj.dd + '</span>';
					html += '</div>';
					html += '</td>';
				} else {
					html += '<td valign="top" class="date">';
					html += '<div>';
					html += '<span class="date-digi"></span>';
					html += '</div>';
					html += '</td>';
				}
			}
			html += '</tr>';
		}

		html += '</table>';
		
		$(this.table.head.container).empty().html(html);
	},

	search: function() {
		this.table.head.match = 1;		
		this.viewCall();
	},

	viewCall: function() {
		var ntable 		= {};
		ntable.schema 	= {};
		ntable.head 	= {};
		$.extend(ntable.schema , 	this.table.schema);
		$.extend(ntable.head,		this.table.head);
		
		ntable.head.action 	= "view";
		ntable.head.loading = 1;
		this.ajaxCall(ntable);
	},
	
	filter: function(table, colName, colVal) {
		if(colVal) {
			this.table.schema.table[table][filter][colName] = colVal;
		} else {
			return this.table.schema.table[table][filter][colName];
		}
	},
	
	show: function() {
		$(this.divBox).wrapBoxShow();
	},
	hide: function() {
		$(this.divBox).wrapBoxHide();
	},
			
	set: function(vObj) 
	{
		this.table.head.action = "select";		
		this.valObj	= vObj;
		this.ajaxCall(this.table);		
	},
	
	clear:  function() {
		this.valObj.val 	= [];
		this.valObj.text 	= [];

		$("li.item[scope='" + this.table.head.scope + "'][sid]").removeClass("item-selected");
		$("ul.lwhAccord-selectionarea-content[scope='" + this.table.head.scope + "']").empty();	

		if( this.func.click) if($.isFunction(this.func.click)) {
			this.func.click(this.valObj);
		}

		if( this.func.clear) if($.isFunction(this.func.clear)) {
			this.func.clear(this.valObj);
		}
	}
}