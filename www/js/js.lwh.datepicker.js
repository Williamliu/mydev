var LWH = LWH || {};
LWH.DATEPICKER = function(opts) {
	this.htmlBox    = null;
	this.divBox 	= null;
	this.itemBox 	= null;
	this.weeks		= [];
	
	this.valObj		= {
		val: 		[],
		text: 		[],
		timehh:		"",
		timemm:		""
	};
	
	this.syncObj    = {
		valObj: 	null,
		textObj: 	null,
		timeObj:	null
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

			multiple:	0,  // checkbox or radio
			btnRemove:	0,
			autohide:	0,
			
			
			action: 	"view",
			loading: 	0,
			wait:		1,
			
			showTime:	0,
			width:		0,
			format:		"",
			min:		"",
			max:		"",
			curYY:		0,
			curMM:		0
		},
		schema: {
		},
		data: []
	};
	$.extend(this.table.head, 		opts.head);
	$.extend(this.table.schema, 	opts.schema);
	$.extend(this.syncObj, 			opts.syncObj);
	$.extend(this.valObj, 			opts.valObj);
	$.extend(this.html, 			opts.html);
	$.extend(this.func, 			opts.func);
	
	var _self 	= this;

	// class constructor
	var _constructor = function() {
			var scope 		= _self.table.head.scope;
			var container 	= _self.table.head.container;
			
			if( container ) {
				$(container).empty();
				_self.itemBox = $(container)[0];
			} else {
				var html_hh = [	
								'<div class="lwhWrapBox">',
									'<div class="lwhWrapBox-content">',
									'</div>',
								'</div>'
							  ].join('');
				_self.htmlBox 	=  $("body").append(html_hh)[0].lastChild;
				_self.divBox 	=  _self.htmlBox; //$("body").append(html_hh)[0].lastChild;
				_self.itemBox 	=  $("div.lwhWrapBox-content", _self.divBox )[0];
				
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
			
			
			$("select.lwhDatepicker-select-month[scope='" + _self.table.head.scope + "']").die("change").live("change", function(ev) {
				_self.current.M = parseInt($(this).val());
				_self.viewCalendar();
			});


			$("input.lwhDatepicker-select-year[scope='" + _self.table.head.scope + "']").die("keydown").live("keydown", function(ev) {
                if (ev.keyCode == 13) {
					_self.current.Y = parseInt($(this).val())>=1900?parseInt($(this).val()):_self.today.Y;
					_self.viewCalendar();
                }
			});

			$("input.lwhDatepicker-select-year[scope='" + _self.table.head.scope + "']").die("blur").live("blur", function(ev) {
				_self.current.Y = parseInt($(this).val())>=1900?parseInt($(this).val()):_self.today.Y;
				_self.viewCalendar();
			});

			// navigate the page
			$("a.lwhDatepicker-button-nav-prev[scope='" + _self.table.head.scope + "']").die("click").live("click", function(ev) {
				_self.current.M--;
				_self.viewCalendar();
			});

			$("a.lwhDatepicker-button-nav-next[scope='" + _self.table.head.scope + "']").die("click").live("click", function(ev) {
				_self.current.M++;
				_self.viewCalendar();
			});

			$("a.lwhDatepicker-button-nav-today[scope='" + _self.table.head.scope + "']").die("click").live("click", function(ev) {
				_self.current.Y = _self.today.Y;
				_self.current.M = _self.today.M;
				_self.viewCalendar();
			});

			$("a.lwhDatepicker-removeall[scope='" + _self.table.head.scope + "']").die("click").live("click", function(ev) {
				_self.clear();
			});


			$("select[scope='" + _self.table.head.scope + "'][name='timehh'],select[scope='" + _self.table.head.scope + "'][name='timemm']").die("change").live("change", function(ev) {

				var timehh = $("select[scope='" + _self.table.head.scope + "'][name='timehh']").val();
				var timemm = $("select[scope='" + _self.table.head.scope + "'][name='timemm']").val();
				_self.valObj.timehh = timehh;
				_self.valObj.timemm = timemm;
				_self.updateValue();
				_self.updateValueHTML();
			});

			$("input.lwhDatepicker-picker[scope='" + _self.table.head.scope + "'][date]").die("click").live("click", function(ev) {
				if( parseInt(_self.table.head.multiple) ) {
					if( $(this).is(":checked") ){
						$("td.date[scope='" + _self.table.head.scope + "'][date='" + $(this).attr("date") + "']").addClass("date-selected");
						_self.valObj.val.push($(this).attr("date"));
						
					} else {
						$("td.date[scope='" + _self.table.head.scope + "'][date='" + $(this).attr("date") + "']").removeClass("date-selected");
						var vidx =  _self.valObj.val.indexOf( $(this).attr("date") );
						_self.valObj.val.splice(vidx, 1);
					}
				} else {
					$("td.date[scope='" + _self.table.head.scope + "'][date]").removeClass("date-selected");
					$("input.lwhDatepicker-picker[scope='" + _self.table.head.scope + "'][date]").attr("checked", false);

					$(this).attr("checked", true);
					$("td.date[scope='" + _self.table.head.scope + "'][date='" + $(this).attr("date") + "']").addClass("date-selected");

					_self.valObj.val	= [];
					_self.valObj.val.push($(this).attr("date"));
				}
				
				_self.updateValue();
				
			});
			


			$(_self.syncObj.valObj).unbind("datepickerEvent").bind("datepickerEvent", function(ev, obj) {
				_self.valObj.val = (""+$(_self.syncObj.valObj).val()).split(",");
				_self.updateValue();
				_self.updateValueHTML();
			});

			$(_self.syncObj.timeHH).unbind("datepickerEvent").bind("datepickerEvent", function(ev, obj) {
				_self.valObj.timehh = $(_self.syncObj.timeHH).val();
				_self.updateValue();
				_self.updateValueHTML();
			});

			$(_self.syncObj.timeMM).unbind("datepickerEvent").bind("datepickerEvent", function(ev, obj) {
				_self.valObj.timemm = $(_self.syncObj.timeMM).val();
				_self.updateValue();
				_self.updateValueHTML();
			});

			if( _self.table.head.trigger ) {
				$(_self.table.head.trigger).unbind("click").bind("click", function(ev) {
					_self.show();
				});
			}
	

			if( _self.syncObj.valObj ) _self.valObj.val = (""+$(_self.syncObj.valObj).val()).split(",");
			if( _self.syncObj.timeHH ) _self.valObj.timehh = $(_self.syncObj.timeHH).val();
			if( _self.syncObj.timeMM ) _self.valObj.timemm = $(_self.syncObj.timeMM).val();

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
			
			//console.log(_self.valObj);
			_self.updateValue();
			_self.updateValueHTML();
	}();
}


LWH.DATEPICKER.prototype = {
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
        this.weeks = [];
        var ff_date = new Date(theYear, theMonth, 1);
        var ll_date = new Date(theYear, theMonth + 1, 0);

        var ff_dd = ff_date.getDate();
        var ll_dd = ll_date.getDate();

        var ff_wd = ff_date.getDay();
        var ll_wd = ll_date.getDay();

        var wk_cnt = -1;
 
        var ss_date = new Date(theYear, theMonth, 0 - ff_wd);
        for (var dd = (ff_dd - ff_wd); dd <= (ll_dd + 6 - ll_wd); dd++) {
            ss_date.setDate(ss_date.getDate() + 1);
            if (ss_date.getDay() == 0) wk_cnt++;
            this.weeks[wk_cnt] = this.weeks[wk_cnt] || [];
            this.weeks[wk_cnt][ss_date.getDay()] = this.weeks[wk_cnt][ss_date.getDay()] || {};

            this.weeks[wk_cnt][ss_date.getDay()].date = new Date( ss_date.getFullYear(), ss_date.getMonth(), ss_date.getDate());
            this.weeks[wk_cnt][ss_date.getDay()].Y 		= ss_date.getFullYear();
            this.weeks[wk_cnt][ss_date.getDay()].M 		= ss_date.getMonth();
            this.weeks[wk_cnt][ss_date.getDay()].D 		= ss_date.getDate();
            this.weeks[wk_cnt][ss_date.getDay()].W 		= ss_date.getDay();
            this.weeks[wk_cnt][ss_date.getDay()].widx 	= wk_cnt;

            this.weeks[wk_cnt][ss_date.getDay()].yy 	= ss_date.format("Y");
            this.weeks[wk_cnt][ss_date.getDay()].mm 	= ss_date.format("n");
            this.weeks[wk_cnt][ss_date.getDay()].dd 	= ss_date.format("j");
            this.weeks[wk_cnt][ss_date.getDay()].ymd 	= ss_date.format("Y-m-d");
            this.weeks[wk_cnt][ss_date.getDay()].time 	= "00:00:00";
        }
		this.toHTML(this.weeks);
    },
	
	toHTML: function(weeks) {
		var html = '';
		if( parseInt(this.table.head.width) > 0 ) 
			html += '<table class="lwhDatepicker" style="width:' + parseInt(this.table.head.width) + 'px;">';
		else 
			html += '<table class="lwhDatepicker">';
		
		html += '<tr>';
        html += '<td colspan="7" class="subject">';
        html += '<div>';
		html += '<a scope="' + this.table.head.scope + '" class="lwhDatepicker-button lwhDatepicker-button-nav-prev" title="' + gcommon.trans[this.table.head.lang].words["previous month"] + '"></a>';
		html += '<a scope="' + this.table.head.scope + '" class="lwhDatepicker-button lwhDatepicker-button-nav-today" title="' + gcommon.trans[this.table.head.lang].words["today"] + '"></a>';
		html += '<select class="lwhDatepicker-select-month" scope="' + this.table.head.scope + '">';		
		for(var idx in gcommon.basic[this.table.head.lang].month_short) {
			html += '<option value="' + idx + '"' + (idx==this.current.M?" selected":"") + '>' + gcommon.basic[this.table.head.lang].month_short[idx].toUpperCase() + '</option>';
		}
		html += '</select>';		
		html += ' / ';
		html += '<input class="lwhDatepicker-select-year" scope="' + this.table.head.scope + '" type="text" placeholder="Year" minlength="4" maxlength="4" value="' + this.current.Y + '" />';
		html += parseInt(this.table.head.btnRemove)?'<a scope="' +  this.table.head.scope + '" class="lwhDatepicker-removeall" title="' + gcommon.trans[this.table.head.lang].words["remove all"] + '"></a>':'',
		
		/*
		html +=	['<a class="lwhDatepicker-button-selection" style="margin-top:3px; margin-left:1px; margin-right:1px;">',
					'<div class="lwhDatepicker-selectionarea">',
					'<div scope="' + this.table.head.scope + '" class="lwhDatepicker-selectionarea-head">' + gcommon.trans[this.table.head.lang].words["selected"] + '</div>',
					'<ul scope="' + this.table.head.scope + '" class="lwhDatepicker-selectionarea-content"></ul>',
					'</div>',
				'</a>'].join('');
		*/
		
		html += '<a scope="' + this.table.head.scope + '" class="lwhDatepicker-button lwhDatepicker-button-nav-next" title="' + gcommon.trans[this.table.head.lang].words["next month"] + '"></a>';
		html += '<div>';
        html += '</td>';
		html += '</tr>';

        html += '<tr>';
        html += '<td colspan="7" style="background-color:#003c54; height:0px;"></td>';
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
					html += '<td scope="' + this.table.head.scope + '" date="' + dateObj.ymd + '" w="' + dateObj.W + '"  widx="' + dateObj.widx + '" class="date' + (this.valObj.val.indexOf(dateObj.ymd)>=0?' date-selected':'') + (dateObj.Y==this.today.Y && dateObj.M==this.today.M && dateObj.D==this.today.D?' date-today':'') + (dayidx==0 || dayidx==6?' date-weekend':'') + '" valign="top">';
					html += '<label scope="' + this.table.head.scope + '" date="' + dateObj.ymd + '">';
					html += '<div>';
					//html += '<span class="date-digi' + (dateObj.M!=this.current.M?' date-digi-na':'') + '">' + gcommon.basic[this.table.head.lang].month_short[dateObj.M] + '-' + dateObj.dd + '</span>';
					html += '<span class="date-digi' + (dateObj.M!=this.current.M?' date-digi-na':'') + '">' + dateObj.dd + '</span>';
					html += '</div>';
					html += '<input type="checkbox"  scope="' + this.table.head.scope + '" date="' + dateObj.ymd + '"  w="' + dateObj.W + '"  widx="' + dateObj.widx + '" ' + (this.valObj.val.indexOf(dateObj.ymd)>=0?'checked="checked"':'') + ' class="lwhDatepicker-picker" value="' + dateObj.ymd + '" />';
					html += '</label>';
					html += '</td>';
				} else {
					html += '<td valign="top" class="date">';
					html += '<div>';
					html += '<span class="date-digi-na"></span>';
					html += '</div>';
					html += '</td>';
				}
			}
			html += '</tr>';
		}
		html += '<tr>';

        html += '<tr>';
        html += '<td colspan="7" style="background-color:#003c54; height:0px;"></td>';
        html += '</tr>';

        html += '<td colspan="7" class="subject" align="center">';
		if( parseInt(this.table.head.showTime) ) {
			html += '<span style="font-size:14px;">' + gcommon.trans[this.table.head.lang].words["time"] + ': </span>';
			html += '<select name="timehh" scope="' + this.table.head.scope + '">';
			html += '<option value=""></option>';
			for(var i=0; i<=23; i++) {
				html += '<option value="' + i + '"' + (this.valObj.timehh==i?' selected':'') + '>' + ("0"+i).right(2) + '</option>';
			}
			html += '</select>';
			html += '<b> : </b>';
			html += '<select name="timemm" scope="' + this.table.head.scope + '">';
			html += '<option value=""></option>';
			for(var i=0; i<=59; i++) {
				html += '<option value="' + i + '"' + (this.valObj.timemm==i?' selected':'') + '>' + ("0"+i).right(2) + '</option>';
			}
			html += '</select>';
		}
		html += '</td>';
		html += '</tr>';
		html += '</table>';
		
		$(this.itemBox).empty().html(html);
	},

	show: function() {
		$(this.divBox).wrapBoxShow();
	},

	hide: function() {
		$(this.divBox).wrapBoxHide();
	},

	set: function(val) 
	{
		if($.isArray(val)) 
			this.valObj.val = val;
		else
			this.valObj.val = ("" + val).split(",");

		this.updateValue();				
		this.updateValueHTML();
	},
	
	setTime: function(val) {
		if( parseInt(this.table.head.showTime) ) {
			if( val )
				this.valObj.time = val;
			else 
				this.valObj.time = "";
	
			this.updateValue();				
			this.updateValueHTML();
		}
	},
	
	setMin: function( val ) {
		var datess		= ("" + val).split("-");
		var dateObj		= new Date(parseInt(datess[0]), parseInt(datess[1])-1, parseInt(datess[2]));
		if( dateObj.toString() != "Invalid Date" ) {
			this.table.head.min = dateObj.format("Y-m-d");	
			
			this.table.head.min = this.table.head.min?this.table.head.min:"1900-01-01";
			var minss		= ("" + this.table.head.min).split("-");
			this.mindate	= new Date(parseInt(minss[0]), parseInt(minss[1])-1, parseInt(minss[2]));
			
			this.viewCalendar();	
		} else {
			this.table.head.min = "1900-01-01";
			var minss		= ("" + this.table.head.min).split("-");
			this.mindate	= new Date(parseInt(minss[0]), parseInt(minss[1])-1, parseInt(minss[2]));
			
			this.viewCalendar();	
		}
	},

	setMax: function( val ) {
		var datess		= ("" + val).split("-");
		var dateObj		= new Date(parseInt(datess[0]), parseInt(datess[1])-1, parseInt(datess[2]));
		if( dateObj.toString() != "Invalid Date" ) {
			this.table.head.max = dateObj.format("Y-m-d");	
			
			this.table.head.max = this.table.head.max?this.table.head.max:"2099-12-31";
			var maxss		= ("" + this.table.head.max).split("-");
			this.maxdate	= new Date(parseInt(maxss[0]), parseInt(maxss[1])-1, parseInt(maxss[2]));
			
			this.viewCalendar();	
		} else {
			this.table.head.max = "2099-12-31";
			var maxss		= ("" + this.table.head.max).split("-");
			this.maxdate	= new Date(parseInt(maxss[0]), parseInt(maxss[1])-1, parseInt(maxss[2]));

			this.viewCalendar();	
		}
	},
	
	updateValue: function() {
		// re-format date format
		for( var idx in this.valObj.val ) {
			var datess		= ("" + this.valObj.val[idx]).split("-");
			var dateObj		= new Date(parseInt(datess[0]), parseInt(datess[1])-1, parseInt(datess[2]));
			if( dateObj.toString() == "Invalid Date" ) {
				this.valObj.val.splice(idx, 1);
			} else {
				this.valObj.val[idx] = dateObj.format("Y-m-d");		
			}
		}
		
		// resort date order  and re-get value text
		this.valObj.val = this.valObj.val.sort();
		this.valObj.text = [];
		for( var idx in this.valObj.val ) {
			var datess		= ("" + this.valObj.val[idx]).split("-");
			var dateObj		= new Date(parseInt(datess[0]), parseInt(datess[1])-1, parseInt(datess[2]));
			if( this.table.head.format=="" )  this.table.head.format = "Y-m-d";
			this.valObj.text[idx] 	= dateObj.format(this.table.head.format);	
			
			if( parseInt(this.table.head.showTime) ) {
				this.valObj.text[idx] += ' ' + this.valObj.timehh + ":" + ("00" + this.valObj.timemm).right(2);  
				//console.log( this.valObj.text[idx] );
				if(this.syncObj.timeHH) 	$(this.syncObj.timeHH).val(this.valObj.timehh);
				if(this.syncObj.timeMM) 	$(this.syncObj.timeMM).val(this.valObj.timemm);
			}
		}
		

		if(this.syncObj.valObj) 	$(this.syncObj.valObj).val( this.valObj.val.join(",") );
		if(this.syncObj.textObj) 	$(this.syncObj.textObj).html( this.valObj.text.join(", ") );
	},
	
	updateValueHTML: function() {
		$("td.date[scope='" + this.table.head.scope + "'][date]").removeClass("date-selected");
		$("input.lwhDatepicker-picker[scope='" + this.table.head.scope + "'][date]").attr("checked", false);

		for( var idx in this.valObj.val ) {
			$("td.date[scope='" + this.table.head.scope + "'][date='" + this.valObj.val[idx] + "']").addClass("date-selected");
			$("input.lwhDatepicker-picker[scope='" + this.table.head.scope + "'][date='" + this.valObj.val[idx] + "']").attr("checked", true);
		}
		
		if( parseInt(this.table.head.showTime) ) {
			var timehh	= parseInt(this.valObj.timehh);
			var timemm 	= parseInt(this.valObj.timemm);
			$("select[scope='" + this.table.head.scope + "'][name='timehh']").val(timehh);
			$("select[scope='" + this.table.head.scope + "'][name='timemm']").val(timemm);
		}
	},
	
	clear:  function() {
		this.valObj.val 	= [];
		this.valObj.text 	= [];
		this.valObj.timehh 	= "";
		this.valObj.timemm 	= "";

		this.updateValue();
		this.updateValueHTML();

		if( this.func.click) if($.isFunction(this.func.click)) {
			this.func.click(this.valObj);
		}

		if( this.func.clear) if($.isFunction(this.func.clear)) {
			this.func.clear(this.valObj);
		}
	},

	setSync: function( sobj ) {
		if(sobj) {
			this.syncObj.valObj 	= sobj.valObj;
			this.syncObj.textObj 	= sobj.textObj;
			this.syncObj.timeHH 	= sobj.timeHH;
			this.syncObj.timeMM 	= sobj.timeMM;
			
			this.valObj.val 		= (""+$(this.syncObj.valObj).val()).split(",");
			this.valObj.timehh		=  $(this.syncObj.timeHH).val();
			this.valObj.timemm		=  $(this.syncObj.timeMM).val();
			this.updateValue();
			this.updateValueHTML();
		}
	}
}