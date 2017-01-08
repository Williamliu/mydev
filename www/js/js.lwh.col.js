var LWH = LWH || {};
LWH.COL = function(opts) {
	this.cols 		= [];
	this.editors 	= [];
	this.func 		= {
		save: 	null,
		add:	null,
		del: 	null,
		cancel: null
	};
	this.head = {
		lang:   DLang,
		scope: 	""
	};
	$.extend(this.head, opts.head);
	$.extend(this.func, opts.func);
	
	var _self = this;
	var _constructor = function() {
		/*** highlight selected checkbox and radio ***/
		$("input:checkbox[scope='" + _self.head.scope + "'][name]").die("click").live("click", function(ev) {
			if( $(this).is(":checked") ) {
				$(this).parent("label").addClass("lwhCommon-checked");
			} else {
				$(this).parent("label").removeClass("lwhCommon-checked");
			}
		});
		$("input:radio[scope='" + _self.head.scope + "'][name]").die("click").live("click", function(ev) {
			if( $(this).is(":checked") ) {
				$("label[scope='" + _self.head.scope + "'][name]").removeClass("lwhCommon-checked");
				$(this).parent("label").addClass("lwhCommon-checked");
			} else {
				$(this).parent("label").removeClass("lwhCommon-checked");
			}
		});
		/**********************************************/

		/*** dom change ***************************************/
		$("input[scope='" + _self.head.scope + "'][name][coltype='checklist']").unbind("colEvent").bind("colEvent", function(ev, obj) {
			_self.dom_change( $(this).attr("name") );
		});

		$("input[scope='" + _self.head.scope + "'][name][coltype='radiolist']").unbind("colEvent").bind("colEvent", function(ev, obj) {
			_self.dom_change( $(this).attr("name") );
		});

		$( "select[scope='" + _self.head.scope + "'][name],").die("change").live("change", function(ev) {
			_self.dom_change( $(this).attr("name") );
		});

		$( 	[	"textarea[scope='" + _self.head.scope + "'][name],",
				"input:text[scope='" + _self.head.scope + "'][name],",
				"input:password[scope='" + _self.head.scope + "'][name],",
				"input:hidden[scope='" + _self.head.scope + "'][name]"
			].join("")
		 ).die("keyup").live("keyup", function(ev) {
			_self.dom_change( $(this).attr("name") );
		});

		$( 	
			[	
				"input:radio[scope='" + _self.head.scope + "'][name],",
				"input:checkbox[scope='" + _self.head.scope + "'][name]"
			].join("")
		 ).die("click").live("click", function(ev) {
			_self.dom_change( $(this).attr("name") );
		});
			

		$("textarea[scope='" + _self.head.scope + "'][name][coltype='editor']").each( function(idx1, el1) {
			var el_name = $(this).attr("name");
			$(this).attr("id", "editor_" + el_name);
			el_id = "editor_" + el_name;
			_self.editors[el_id] = CKEDITOR.replace(el_id,{});


			_self.editors[el_id].on('change', function (evt) {
					_self.dom_change( el_name );
			});

        });

		$("a.lwhCommon-checkButton[scope='" + _self.head.scope + "'][coltype='checkbutton'][name]").die("click").live("click", function(ev) {
			if( $(this).hasClass("lwhCommon-checkButton-checked") ) {
				$(this).removeClass("lwhCommon-checkButton-checked");
			} else {
				$(this).addClass("lwhCommon-checkButton-checked");
			}
			_self.dom_change( $(this).attr("name") );
		});
		/***********************************************************/

		// button event 
		$("input:button[scope='" + _self.head.scope + "'][coltype='save']").die("click").live("click", function(ev) {
			if(_self.func.save) if( $.isFunction(_self.func.save) ) _self.func.save( _self.getChange() ); 
		});

		$("input:button[scope='" + _self.head.scope + "'][coltype='add']").die("click").live("click", function(ev) {
			if(_self.func.add) if( $.isFunction(_self.func.add) ) _self.func.add( _self.getAll() ); 
		});

		$("input:button[scope='" + _self.head.scope + "'][coltype='delete']").die("click").live("click", function(ev) {
			if(_self.func.del) if( $.isFunction(_self.func.del) ) _self.func.del( _self.getAll() ); 
		});

		$("input:button[scope='" + _self.head.scope + "'][coltype='cancel']").die("click").live("click", function(ev) {
			_self.cancel(); 
			if(_self.func.cancel) if( $.isFunction(_self.func.cancel) ) _self.func.cancel(_self.cols); 
			tool_tips(gcommon.trans[_self.head.lang].words["reset success"]);
		});
		/*********************************************/
		
		
		/*** init component ***/
		$("input[scope='" + _self.head.scope + "'][coltype='date'][name]").datepicker({
			dateFormat: 'yy-mm-dd',
			showOn: "button",
			buttonImage: "theme/light/common/lwhCommon-calendar.png",
			buttonImageOnly: true,
			onSelect: function(dateText) { 
				_self.dom_change( $(this).attr("name") );
			}
		});


		$("input[scope='" + _self.head.scope + "'][coltype='datetime'][name]").datepicker({
			dateFormat: 'yy-mm-dd',
			showOn: "button",
			buttonImage: "theme/light/common/lwhCommon-calendar.png",
			buttonImageOnly: true,
			onSelect: function(dateText) { 
				_self.dom_change( $(this).attr("name") );
			}
		});


		$("input[scope='" + _self.head.scope + "'][coltype='daterange'][name]").datepicker({
			dateFormat: 'yy-mm-dd',
			showOn: "button",
			buttonImage: "theme/light/common/lwhCommon-calendar.png",
			buttonImageOnly: true,
			onSelect: function(dateText) { 
				_self.dom_change( $(this).attr("name") );
			}
		});
		/**********************/
		
	}();
}

LWH.COL.prototype = {
	schema: function( name ) {
		var _self = this;
		var colSchema = null;
		var el = $("*[scope='" + _self.head.scope + "'][name='" + name + "'][coltype]")[0];
		if( el ) {
			colSchema = {};
			colSchema.scope		= _self.head.scope;
			colSchema.name		= name;
			colSchema.col 		= $(el).attr("col")?$(el).attr("col"):name;
			colSchema.coltype 	= $(el).attr("coltype")?$(el).attr("coltype"):"textbox";
			colSchema.colname 	= $(el).attr("colname")?$(el).attr("colname"):colSchema.col;
			colSchema.coldesc 	= $(el).attr("coldesc")?$(el).attr("coldesc"):"";
			colSchema.datatype 	= ("" +  ($(el).attr("datatype")?$(el).attr("datatype"):"all")).toUpperCase();
			colSchema.need 		= $(el).attr("need")?$(el).attr("need"):0;
			colSchema.notnull 	= $(el).attr("notnull")?$(el).attr("notnull"):0;
			colSchema.defval 	= $(el).attr("defval")?$(el).attr("defval"):"";
			colSchema.state 	= 0;
			colSchema.error		= 0;
			colSchema.errorMessage = "";
				
			var coltype = colSchema.coltype.toLowerCase();
			switch(coltype) {
					case "hidden":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.value 	= $(el).val();
						colSchema.oldval 	= colSchema.value;
						break;
					case "text":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"LIKE";						
						colSchema.value 	= $(el).html()?$(el).html():"";
						colSchema.oldval 	= colSchema.value;
					case "bool":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.value 	= $(el).is(":checked")?1:0;
						colSchema.oldval 	= colSchema.value;
						break;
					case "checkbutton":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.value 	= $(el).hasClass("lwhCommon-checkButton-checked")?1:0;
						colSchema.oldval 	= colSchema.value;
						break;
					case "radio":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						ck_val 				= $(el).is(":checked")?$(el).val():0;
						colSchema.align 	= $(el).attr("align")?$(el).attr("align"):0;
						colSchema.sn 		= $(el).attr("sn")?$(el).attr("sn"):0;
						colSchema.value 	= ck_val;
						colSchema.oldval 	= colSchema.value;
						break;
					case "radiolist":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.ltable	= $(el).attr("ltable")?$(el).attr("ltable"):"";
						colSchema.stable	= $(el).attr("stable")?$(el).attr("stable"):"";
						colSchema.scol 		= $(el).attr("scol")?$(el).attr("scol"):"";
						colSchema.stitle 	= $(el).attr("stitle")?$(el).attr("stitle"):"";
						colSchema.sdesc		= $(el).attr("sdesc")?$(el).attr("sdesc"):"";
						colSchema.value 	= $(el).val();
						colSchema.oldval 	= colSchema.value;
						colSchema.valuetext = $("span.radiotext", $(el).parent()).html();
						break;
					case "radiotext":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.ltable	= $(el).attr("ltable")?$(el).attr("ltable"):"";
						colSchema.stable	= $(el).attr("stable")?$(el).attr("stable"):"";
						colSchema.scol 		= $(el).attr("scol")?$(el).attr("scol"):"";
						colSchema.stitle 	= $(el).attr("stitle")?$(el).attr("stitle"):"";
						colSchema.value 	= $(el).html();
						colSchema.oldval 	= colSchema.value;
						break;
					case "checkbox":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						var ck_val = '';
						ck_val = $("input:checkbox[scope='" + _self.head.scope + "'][name='" + name + "']:checked").map(function () { return $(this).val(); }).get().join(",");
						colSchema.rtable	= $(el).attr("rtable")?$(el).attr("rtable"):"";
						colSchema.rcol 		= $(el).attr("rcol")?$(el).attr("rcol"):"";
						colSchema.align 	= $(el).attr("align")?$(el).attr("align"):0;
						colSchema.sn 		= $(el).attr("sn")?$(el).attr("sn"):0;
						colSchema.value 	= ck_val;
						colSchema.oldval 	= colSchema.value;
						break;
					case "checklist":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.ltable	= $(el).attr("ltable")?$(el).attr("ltable"):"";
						colSchema.stable	= $(el).attr("stable")?$(el).attr("stable"):"";
						colSchema.scol 		= $(el).attr("scol")?$(el).attr("scol"):"";
						colSchema.stitle 	= $(el).attr("stitle")?$(el).attr("stitle"):"";
						colSchema.sdesc		= $(el).attr("sdesc")?$(el).attr("sdesc"):"";
						colSchema.rtable	= $(el).attr("rtable")?$(el).attr("rtable"):"";
						colSchema.rcol 		= $(el).attr("rcol")?$(el).attr("rcol"):"";
						colSchema.value 	= $(el).val();
						colSchema.oldval 	= colSchema.value;
						colSchema.valuetext = $("span.checktext", $(el).parent()).html();
						break;
					case "checktext":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.ltable	= $(el).attr("ltable")?$(el).attr("ltable"):"";
						colSchema.stable	= $(el).attr("stable")?$(el).attr("stable"):"";
						colSchema.scol 		= $(el).attr("scol")?$(el).attr("scol"):"";
						colSchema.stitle 	= $(el).attr("stitle")?$(el).attr("stitle"):"";
						colSchema.rtable	= $(el).attr("rtable")?$(el).attr("rtable"):"";
						colSchema.rcol 		= $(el).attr("rcol")?$(el).attr("rcol"):"";
						colSchema.value 	= $(el).html();
						colSchema.oldval 	= colSchema.value;
						break;
					case "editor":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"LIKE";						
						colSchema.value 	= $(el).val();
						colSchema.oldval 	= colSchema.value;
						break;
					case "select":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.value 	= $(el).val()?$(el).val():"";
						colSchema.oldval 	= colSchema.value;
						break;
					case "password":
					case "password_confirm":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.maxlength = $(el).attr("maxlength")?$(el).attr("maxlength"):0;
						colSchema.minlength = $(el).attr("minlength")?$(el).attr("minlength"):0;
						colSchema.value 	= $(el).val();
						colSchema.oldval 	= colSchema.value;
						break;

					case "intdate":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.value 	= $(el).html()?$(el).html():"";
						colSchema.oldval 	= colSchema.value;
						break;

					case "intdatetime":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.value 	= $(el).html()?$(el).html():"";
						colSchema.oldval 	= colSchema.value;
						break;

					case "date":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.value 	= $(el).val()?$(el).val():"";
						colSchema.oldval 	= colSchema.value;
						break;

					case "time":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						var hh = $("select[scope='" + _self.head.scope + "'][coltype='time'][name='" + colSchema.name + "'][col='" + colSchema.name + ".hh']").val();
						var mm = $("select[scope='" + _self.head.scope + "'][coltype='time'][name='" + colSchema.name + "'][col='" + colSchema.name + ".mm']").val();
						colSchema.value 	= ("00" + hh).right(2) + ":" + ("00" + mm).right(2);
						colSchema.oldval 	= colSchema.value;
						break;

					case "timerange":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						var sshh = $("select[scope='" + _self.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".fromhh']").val();
						var ssmm = $("select[scope='" + _self.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".frommm']").val();
						var eehh = $("select[scope='" + _self.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".tohh']").val();
						var eemm = $("select[scope='" + _self.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".tomm']").val();
						colSchema.value 	= ("00" + sshh).right(2) + ":" + ("00" + ssmm).right(2) + "|" + ("00" + eehh).right(2) + ":" + ("00" + eemm).right(2);
						colSchema.oldval 	= colSchema.value;
						break;

					case "datetime":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						var dd = $("input[scope='" + _self.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".dd']").val();
						dd = dd?dd:"0000-00-00";
						var hh = $("select[scope='" + _self.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".hh']").val();
						var mm = $("select[scope='" + _self.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".mm']").val();
						colSchema.value 	=  dd + " " + ("00" + hh).right(2) + ":" + ("00" + mm).right(2);
						colSchema.oldval 	= colSchema.value;
						break;

					case "daterange":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						var ss = $("input[scope='" + _self.head.scope + "'][coltype='daterange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val();
						ss = ss?ss:"";
						var ee = $("input[scope='" + _self.head.scope + "'][coltype='daterange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val();
						ee = ee?ee:"";
						colSchema.value 	=  ss + "|" + ee;
						colSchema.oldval 	= colSchema.value;
						break;

					case "range":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						var ss = $("input[scope='" + _self.head.scope + "'][coltype='range'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val();
						ss = ss?ss:"";
						var ee = $("input[scope='" + _self.head.scope + "'][coltype='range'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val();
						ee = ee?ee:"";
						colSchema.value 	=  ss + "|" + ee;
						colSchema.oldval 	= colSchema.value;
						break;

					case "rangehide":
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"=";						
						var ss = $("input[scope='" + _self.head.scope + "'][coltype='rangehide'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val();
						ss = ss?ss:"";
						var ee = $("input[scope='" + _self.head.scope + "'][coltype='rangehide'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val();
						ee = ee?ee:"";
						colSchema.value 	=  ss + "|" + ee;
						colSchema.oldval 	= colSchema.value;
						break;
						
					case "ymd":
						colSchema.compare 	=  	$(el).attr("compare")?$(el).attr("compare"):"=";						
						colSchema.maxlength = 	$(el).attr("maxlength")?$(el).attr("maxlength"):0;
						colSchema.value 	= 	$(el).val();
						colSchema.oldval 	= 	colSchema.value;
						break;

					default:
						colSchema.compare 	=  $(el).attr("compare")?$(el).attr("compare"):"LIKE";						
						colSchema.maxlength = $(el).attr("maxlength")?$(el).attr("maxlength"):0;
						colSchema.minlength = $(el).attr("minlength")?$(el).attr("minlength"):0;
						colSchema.min 		= $(el).attr("min")?$(el).attr("min"):"";
						colSchema.max 		= $(el).attr("max")?$(el).attr("max"):"";
						colSchema.value 	= $(el).val();
						colSchema.oldval 	= colSchema.value;
						break;
			}
		}
		return colSchema;
	},

	init: function() {
		var _self = this;
		_self.cols = [];
		$("*[scope='" + _self.head.scope + "'][name][coltype]").each(function(idx, el) {
			var colObj = _self.schema($(el).attr("name"));
			if(colObj) {
				if( ArraySearch(_self.cols, "name", $(el).attr("name")) < 0 ) _self.cols.push( colObj );
			}
		});
	},

	dom_change: function(name) {
		var cidx = ArraySearch(this.cols, "name", name);
		var colSchema = this.cols[cidx];
		if( colSchema ) {
			colSchema.error 		= 0;
			colSchema.errorMessage 	= "";
			
			var coltype = colSchema.coltype.toLowerCase();
			switch(coltype) {
				case "hidden":
					break;
				case "text":
					break;
				case "bool":
				 	colSchema.value = $("input:checkbox[scope='" + this.head.scope + "'][name='" + name + "']").is(":checked")?1:0;
					$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").closest("label").removeClass("lwhCommon-invalid").closest("label").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;
				case "checkbutton":
				 	colSchema.value = $("a.lwhCommon-checkButton[scope='" + this.head.scope + "'][name='" + name + "']").hasClass("lwhCommon-checkButton-checked")?1:0;
					$("a.lwhCommon-checkButton[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;
				case "radio":
				 	colSchema.value = $("input:radio[scope='" + this.head.scope + "'][name='" + name + "']:checked").val()?$("input:radio[scope='" + this.head.scope + "'][name='" + name + "']:checked").val():0;
					$("input:radio[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent("label").removeClass("lwhCommon-invalid").attr("title", "");
					break;
				case "radiolist":
				 	colSchema.value = $("input[scope='" + this.head.scope + "'][name='" + name + "']").val()?$("input[scope='" + this.head.scope + "'][name='" + name + "']").val():"";
					$("span.radiotext", $("input[scope='" + this.head.scope + "'][name='" + name + "']").parent() ).removeClass("lwhCommon-invalid");
					break;
				case "checkbox":
					colSchema.value = $("input:checkbox[scope='" + this.head.scope + "'][name='" + name + "']:checked").map(function () { return $(this).val(); }).get().join(",");
					$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent("label").removeClass("lwhCommon-invalid").attr("title", "");
					break;
				case "checklist":
				 	colSchema.value = $("input[scope='" + this.head.scope + "'][name='" + name + "']").val()?$("input[scope='" + this.head.scope + "'][name='" + name + "']").val():"";
					$("span.checktext", $("input[scope='" + this.head.scope + "'][name='" + name + "']").parent() ).removeClass("lwhCommon-invalid");
					break;
				case "editor":
					var el_id = $("textarea[scope='" + this.head.scope + "'][name='" + name + "'][coltype='editor']").attr("id");
					colSchema.value = CKEDITOR.instances[el_id].getData();
					break;
				case "select":
				 	colSchema.value = $("select[scope='" + this.head.scope + "'][name='" + name + "']").val()?$(":input[scope='" + this.head.scope + "'][name='" + name + "']").val():"";
					$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;
				case "password":
				case "password_confirm":
				 	colSchema.value = $(":input[scope='" + this.head.scope + "'][name='" + name + "']").val()?$(":input[scope='" + this.head.scope + "'][name='" + name + "']").val():"";
					$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "date":
				 	colSchema.value = $("input[scope='" + this.head.scope + "'][name='" + name + "']").val()?$(":input[scope='" + this.head.scope + "'][name='" + name + "']").val():"";
					$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "time":
					var hh = $("select[scope='" + this.head.scope + "'][coltype='time'][name='" + colSchema.name + "'][col='" + colSchema.name + ".hh']").val();
					var mm = $("select[scope='" + this.head.scope + "'][coltype='time'][name='" + colSchema.name + "'][col='" + colSchema.name + ".mm']").val();
					colSchema.value = ("00" + hh).right(2) + ":" + ("00" + mm).right(2);
					$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='time']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "timerange":
					var sshh = $("select[scope='" + this.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".fromhh']").val();
					var ssmm = $("select[scope='" + this.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".frommm']").val();
					var eehh = $("select[scope='" + this.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".tohh']").val();
					var eemm = $("select[scope='" + this.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".tomm']").val();
					colSchema.value = ("00" + sshh).right(2) + ":" + ("00" + ssmm).right(2) + "|" + ("00" + eehh).right(2) + ":" + ("00" + eemm).right(2);
					$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='timerange']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;


				case "datetime":
					var dd = $("input[scope='" + this.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".dd']").val();
					dd = dd?dd:"0000-00-00";
					var hh = $("select[scope='" + this.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".hh']").val();
					var mm = $("select[scope='" + this.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".mm']").val();
					colSchema.value = dd + " " + ("00" + hh).right(2) + ":" + ("00" + mm).right(2);
					$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='datetime']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "daterange":
					var ss = $("input[scope='" + this.head.scope + "'][coltype='daterange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val();
					ss = ss?ss:"";
					var ee = $("input[scope='" + this.head.scope + "'][coltype='daterange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val();
					ee = ee?ee:"";
					colSchema.value = ss + "|" + ee;
					$("input[scope='" + this.head.scope + "'][coltype='daterange'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "range":
					var ss = $("input[scope='" + this.head.scope + "'][coltype='range'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val();
					ss = ss?ss:"";
					var ee = $("input[scope='" + this.head.scope + "'][coltype='range'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val();
					ee = ee?ee:"";
					colSchema.value = ss + "|" + ee;
					$("input[scope='" + this.head.scope + "'][coltype='range'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "rangehide":
					var ss = $("input[scope='" + this.head.scope + "'][coltype='rangehide'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val();
					ss = ss?ss:"";
					var ee = $("input[scope='" + this.head.scope + "'][coltype='rangehide'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val();
					ee = ee?ee:"";
					colSchema.value = ss + "|" + ee;
					$("input[scope='" + this.head.scope + "'][coltype='rangehide'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "ymd":
				 	colSchema.value = $(":input[scope='" + this.head.scope + "'][name='" + name + "']").val()?$(":input[scope='" + this.head.scope + "'][name='" + name + "']").val():"";
					$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				default:
				 	colSchema.value = $(":input[scope='" + this.head.scope + "'][name='" + name + "']").val()?$(":input[scope='" + this.head.scope + "'][name='" + name + "']").val():"";
					$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;
			}

			if( colSchema.oldval != colSchema.value ) {
				colSchema.state = 1;
			} else {
				colSchema.state = 0;
			}

		}
	},
	
	syncToHTML: function( colSchema ) {
		var _self = this;
		if( colSchema ) {
			var coltype = colSchema.coltype.toLowerCase();
			switch(coltype) {
				case "hidden":
					$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype]").html(colSchema.value?colSchema.value:"");
					break;
				case "text":
					$("*[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype]").html(colSchema.value?colSchema.value:"");
					break;
				case "bool":
				 	$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").attr("checked", parseInt(colSchema.value)?true:false);

					if( parseInt(colSchema.error) ) 
						$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").closest("label").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").closest("label").removeClass("lwhCommon-invalid").closest("label").attr("title", colSchema.coldesc?colSchema.coldesc:"");

					break;
				case "checkbutton":
					if( parseInt(colSchema.value) ) 
						$("a.lwhCommon-checkButton[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").addClass("lwhCommom-checkButton-checked");
					else 
						$("a.lwhCommon-checkButton[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommom-checkButton-checked");
					
					if( parseInt(colSchema.error) ) 
						$("a.lwhCommon-checkButton[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("a.lwhCommon-checkButton[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");

					break;
				case "radio":
					$("input:radio[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").attr("checked", false);
					$("input:radio[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent("label").removeClass("lwhCommon-checked");
					$("input:radio[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][value='" + colSchema.value + "']").attr("checked", true);
					$("input:radio[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][value='" + colSchema.value + "']").parent("label").addClass("lwhCommon-checked");

					if( parseInt(colSchema.error) ) 
						$("input:radio[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent("label").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("input:radio[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent("label").removeClass("lwhCommon-invalid").attr("title", "");

					break;
				case "radiolist":
				 	$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").val(colSchema.value?colSchema.value:"");
					$("span.radiotext", $("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent() ).html(colSchema.valuetext?colSchema.valuetext:"");
					
					if( parseInt(colSchema.error) ) 
						$("span.radiotext", $("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']") ).addClass("lwhCommon-invalid").html(colSchema.errorMessage);
					else 
						$("span.radiotext", $("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']") ).removeClass("lwhCommon-invalid");
				
					// sync to iOption
					$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='radiolist']").trigger("optionEvent");
					break;

				case "radiotext":
				 	$("*[scope='" + this.head.scope + "'][coltype='radiotext'][name='" + colSchema.name + "']").html(colSchema.valuetext?colSchema.valuetext:"");
					break;

				case "checkbox":
					$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").attr("checked", false);
					$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent("label").removeClass("lwhCommon-checked");
					if (colSchema.value && colSchema.value != "") {
						$.map( (""+colSchema.value).split(","), function (n) {
							$("input:checkbox[scope='" + _self.head.scope + "'][name='" + colSchema.name + "'][value='" + n + "']").attr("checked", true);
							$("input:checkbox[scope='" + _self.head.scope + "'][name='" + colSchema.name + "'][value='" + n + "']").parent("label").addClass("lwhCommon-checked");
						});
					}

					if( parseInt(colSchema.error) ) 
						$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").closest("div").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("input:checkbox[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").closest("div").removeClass("lwhCommon-invalid").attr("title", "");

					break;
				case "checklist":
				 	$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").val(colSchema.value?colSchema.value:"");
					$("span.checktext", $("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent() ).html(colSchema.valuetext?colSchema.valuetext:"");
					if( parseInt(colSchema.error) ) 
						$("span.checktext", $("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent() ).addClass("lwhCommon-invalid").html(colSchema.errorMessage);
					else 
						$("span.checktext", $("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").parent() ).removeClass("lwhCommon-invalid");
				
					// sync to iOption
					$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='checklist']").trigger("optionEvent");
					break;

				case "checktext":
				 	$("*[scope='" + this.head.scope + "'][coltype='checktext'][name='" + colSchema.name + "']").html(colSchema.valuetext?colSchema.valuetext:"");
					break;
			
				case "editor":
					var el_id = $("textarea[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='editor']").attr("id");
					CKEDITOR.instances[el_id].setData(colSchema.value);
					break;

				case "select":
				 	$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").val(colSchema.value?colSchema.value:"");
					
					if( parseInt(colSchema.error) ) 
						$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					
					break;

				case "password":
				case "password_confirm":
				 	$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").val(colSchema.value?colSchema.value:"");
					
					if( parseInt(colSchema.error) ) 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					
					break;

				case "intdatetime":
				 	$("*[scope='" + this.head.scope + "'][coltype='intdatetime'][name='" + colSchema.name + "']").html( (""+colSchema.value).toDateTime() );
					break;

				case "intdate":
				 	$("*[scope='" + this.head.scope + "'][coltype='intdate'][name='" + colSchema.name + "']").html( (""+colSchema.value).toDate() );
					break;


				case "date":
				 	$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").val(colSchema.value?colSchema.value:"");
					
					if( parseInt(colSchema.error) ) 
						$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					
					$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").trigger("datepickerEvent");
					break;

				case "time":
					var hhmm = ("" + colSchema.value).split(":");
					var hh = hhmm[0]=="00"?0:( parseInt(hhmm[0])?parseInt(hhmm[0]):"");
					var mm = hhmm[1]=="00"?0:( parseInt(hhmm[1])?parseInt(hhmm[1]):"");
					
				 	$("select[scope='" + this.head.scope + "'][coltype='time'][name='" + colSchema.name + "'][col='" + colSchema.name + ".hh']").val(hh);
				 	$("select[scope='" + this.head.scope + "'][coltype='time'][name='" + colSchema.name + "'][col='" + colSchema.name + ".mm']").val(mm);
					
					if( parseInt(colSchema.error) ) 
						$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='time']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='time']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					
					break;

				case "timerange":
					var sseehhmm 	= ("" + colSchema.value).split("|");
					var sshhmm		= ("" + sseehhmm[0]).split(":");
					var sshh 		= sshhmm[0]=="00"?0:( parseInt(sshhmm[0])?parseInt(sshhmm[0]):"");
					var ssmm 		= sshhmm[1]=="00"?0:( parseInt(sshhmm[1])?parseInt(sshhmm[1]):"");

					var eehhmm		= ("" + sseehhmm[1]).split(":");
					var eehh 		= eehhmm[0]=="00"?0:( parseInt(eehhmm[0])?parseInt(eehhmm[0]):"");
					var eemm 		= eehhmm[1]=="00"?0:( parseInt(eehhmm[1])?parseInt(eehhmm[1]):"");
					
				 	$("select[scope='" + this.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".fromhh']").val(sshh);
				 	$("select[scope='" + this.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".frommm']").val(ssmm);
				 	$("select[scope='" + this.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".tohh']").val(eehh);
				 	$("select[scope='" + this.head.scope + "'][coltype='timerange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".tomm']").val(eemm);
					
					if( parseInt(colSchema.error) ) 
						$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='timerange']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("select[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='timerange']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					
					break;

				case "datetime":
					var ddhhmm = ("" + colSchema.value).split(" ");
					var dd = ddhhmm[0]?ddhhmm[0]:"";
					dd = (dd=="0000-00-00"?"":dd)
					var hhmm = (""+ddhhmm[1]).split(":");
					var hh = hhmm[0]?parseInt(hhmm[0]):0;
					var mm = hhmm[1]?parseInt(hhmm[1]):0;
					
				 	$("input[scope='" + this.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".dd']").val(dd);
				 	$("select[scope='" + this.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".hh']").val(hh);
				 	$("select[scope='" + this.head.scope + "'][coltype='datetime'][name='" + colSchema.name + "'][col='" + colSchema.name + ".mm']").val(mm);
					
					if( parseInt(colSchema.error) ) 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='datetime']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='datetime']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					
					break;

				case "daterange":
					var ddhhmm = ("" + colSchema.value).split("|");
					var ss = ddhhmm[0]?ddhhmm[0]:"";
					var ee = ddhhmm[1]?ddhhmm[1]:"";
					
				 	$("input[scope='" + this.head.scope + "'][coltype='daterange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val(ss);
				 	$("input[scope='" + this.head.scope + "'][coltype='daterange'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val(ee);
				
					if( parseInt(colSchema.error) ) 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='daterange']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='daterange']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "range":
					var ddhhmm = ("" + colSchema.value).split("|");
					var ss = ddhhmm[0]?ddhhmm[0]:"";
					var ee = ddhhmm[1]?ddhhmm[1]:"";
					
				 	$("input[scope='" + this.head.scope + "'][coltype='range'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val(ss);
				 	$("input[scope='" + this.head.scope + "'][coltype='range'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val(ee);
				
					if( parseInt(colSchema.error) ) 
						$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='range']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='range']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "rangehide":
					var ddhhmm = ("" + colSchema.value).split("|");
					var ss = ddhhmm[0]?ddhhmm[0]:"";
					var ee = ddhhmm[1]?ddhhmm[1]:"";
					
				 	$("input[scope='" + this.head.scope + "'][coltype='rangehide'][name='" + colSchema.name + "'][col='" + colSchema.name + ".from']").val(ss);
				 	$("input[scope='" + this.head.scope + "'][coltype='rangehide'][name='" + colSchema.name + "'][col='" + colSchema.name + ".to']").val(ee);
				
					if( parseInt(colSchema.error) ) 
						$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='rangehide']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$("input[scope='" + this.head.scope + "'][name='" + colSchema.name + "'][coltype='rangehide']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				case "ymd":
				 	$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").val(parseInt(colSchema.value)?parseInt(colSchema.value):"");
					if( parseInt(colSchema.error) ) 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;

				default:
				 	$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").val(colSchema.value?colSchema.value:"");
					
					if( parseInt(colSchema.error) ) 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").addClass("lwhCommon-invalid").attr("title", colSchema.errorMessage);
					else 
						$(":input[scope='" + this.head.scope + "'][name='" + colSchema.name + "']").removeClass("lwhCommon-invalid").attr("title", colSchema.coldesc?colSchema.coldesc:"");
					break;
			}
		}
	},
	
	set: function(name, val) {
		var _self = this;
		var cidx = ArraySearch(this.cols, "name", name);
		var colSchema = this.cols[cidx];
		if( colSchema ) {
			colSchema.error 		= 0;
			colSchema.errorMessage 	= "";
			colSchema.value 		= val;
			this.syncToHTML(colSchema);

			if( colSchema.oldval != colSchema.value ) {
				colSchema.state = 1;
			} else {
				colSchema.state = 0;
			}
			
		}
	},
	
	get: function( name ) {
		var nSchema = {};
		var cidx = ArraySearch(this.cols, "name", name);
		var colSchema = this.cols[cidx];
		if( colSchema ) {
			var coltype = colSchema.coltype.toLowerCase();

			nSchema.scope 		= colSchema.scope;
			nSchema.name 		= colSchema.name;
			nSchema.col 		= colSchema.col;
			nSchema.colname		= colSchema.colname;
			nSchema.coltype		= colSchema.coltype;
			nSchema.datatype	= colSchema.datatype;
			nSchema.notnull		= colSchema.notnull;
			nSchema.need		= colSchema.need;

			nSchema.state			= colSchema.state?colSchema.state:0;
			nSchema.error			= colSchema.error?colSchema.error:0;
			nSchema.errorMessage	= colSchema.errorMessage?colSchema.errorMessage:"";

			nSchema.compare 		= colSchema.compare?colSchema.compare:"LIKE";

			switch(coltype) {
				case "hidden":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;
				case "text":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;
				case "textbox":
					nSchema.maxlength 	= colSchema.maxlength?colSchema.maxlength:0;
					nSchema.minlength 	= colSchema.minlength?colSchema.minlength:0;
					nSchema.min 		= colSchema.min?colSchema.min:"";
					nSchema.max 		= colSchema.max?colSchema.max:"";
					nSchema.value		= colSchema.value?colSchema.value:"";
					break;
				case "bool":
					nSchema.value	= colSchema.value?colSchema.value:0;
					break;
				case "checkbutton":
					nSchema.value	= colSchema.value?colSchema.value:0;
					break;
				case "radio":
					nSchema.value	= colSchema.value?colSchema.value:0;
					break;
				case "radiolist":
				case "radiotext":
					nSchema.stable 	= colSchema.stable?colSchema.stable:"";
					nSchema.scol 	= colSchema.scol?colSchema.scol:"";
					nSchema.stitle 	= colSchema.stitle?colSchema.stitle:"";
					nSchema.sdesc 	= colSchema.sdesc?colSchema.sdesc:"";
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;
				case "checkbox":
					nSchema.rtable 	= colSchema.rtable?colSchema.rtable:"";
					nSchema.rcol 	= colSchema.rcol?colSchema.rcol:"";
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;
				case "checklist":
				case "checktext":
					nSchema.stable 	= colSchema.stable?colSchema.stable:"";
					nSchema.scol 	= colSchema.scol?colSchema.scol:"";
					nSchema.stitle 	= colSchema.stitle?colSchema.stitle:"";
					nSchema.sdesc 	= colSchema.sdesc?colSchema.sdesc:"";
					nSchema.rtable 	= colSchema.rtable?colSchema.rtable:"";
					nSchema.rcol 	= colSchema.rcol?colSchema.rcol:"";
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;
				case "editor":
					var el_id = $("textarea[scope='" + this.head.scope + "'][name='" + name + "'][coltype='editor']").attr("id");
					nSchema.value	= CKEDITOR.instances[el_id].getData();
					break;
				case "select":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;
				case "password":
				case "password_confirm":
					nSchema.maxlength 	= colSchema.maxlength?colSchema.maxlength:0;
					nSchema.minlength 	= colSchema.minlength?colSchema.minlength:0;
					nSchema.value		= colSchema.value?colSchema.value:"";
					break;

				case "intdate":
				case "intdatetime":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;

				case "date":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;

				case "time":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;

				case "timerange":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;

				case "datetime":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;

				case "daterange":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;

				case "range":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;

				case "rangehide":
					nSchema.value	= colSchema.value?colSchema.value:"";
					break;

				case "ymd":
					nSchema.maxlength 	= colSchema.maxlength?colSchema.maxlength:0;
					nSchema.value		= colSchema.value?colSchema.value:"";
					break;

				default:
					nSchema.maxlength 	= colSchema.maxlength?colSchema.maxlength:0;
					nSchema.minlength 	= colSchema.minlength?colSchema.minlength:0;
					nSchema.min 		= colSchema.min?colSchema.min:"";
					nSchema.max 		= colSchema.max?colSchema.max:"";
					nSchema.value		= colSchema.value?colSchema.value:"";
					break;
			}
		}
		return nSchema;
	},
	
	getChange: function() {
		var ncols = [];
		for(var i = 0 ; i < this.cols.length; i++) {
			var nSchema = this.cols[i];
			if( parseInt(nSchema.state) || parseInt(nSchema.need) ) {
				ncols.push( this.get(nSchema.name) );
			}
		}
		return ncols;
	},
	
	getAll:	function() {
		var ncols = [];
		for(var i = 0 ; i < this.cols.length; i++) {
			var nSchema = this.cols[i];
			ncols.push( this.get(nSchema.name) );
		}
		return ncols;
	},
	
	cancel: function() {
		for(var i = 0 ; i < this.cols.length; i++) {
			this.cols[i].value 	= this.cols[i].oldval;
			this.cols[i].error 	= 0;
			this.cols[i].errorMessage = "";
			this.cols[i].state = 0;
			this.syncToHTML( this.cols[i] );
		}
	},
	
	clear: function() {
		for(var i = 0 ; i < this.cols.length; i++) {
			this.cols[i].value 	= "";
			this.cols[i].oldval = "";
			this.cols[i].error 	= 0;
			this.cols[i].errorMessage = "";
			this.cols[i].state = 0;
			this.syncToHTML( this.cols[i] );
		}
	},
	
	update: function(nSchema) {
		var cidx = ArraySearch(this.cols, "name", nSchema.name);
		var colSchema = this.cols[cidx];
		if( colSchema ) {
			colSchema.state 		= nSchema.state?nSchema.state:0;
			colSchema.error 		= nSchema.error?nSchema.error:0;
			colSchema.errorMessage 	= nSchema.errorMessage?nSchema.errorMessage:"";
			var coltype = colSchema.coltype.toLowerCase();
			switch(coltype) {
				case "hidden":
					colSchema.value = nSchema.value?nSchema.value:"";
					break;
				case "text":
					colSchema.value = nSchema.value?nSchema.value:"";
					break;
				case "bool":
					colSchema.value = nSchema.value?nSchema.value:0;
					break;
				case "checkbutton":
					colSchema.value = nSchema.value?nSchema.value:0;
					break;
				case "radio":
					colSchema.value = nSchema.value?nSchema.value:0;
					break;
				case "radiolist":
				case "radiotext":
					colSchema.value 	= nSchema.value?nSchema.value:0;
					colSchema.valuetext = nSchema.valuetext?nSchema.valuetext:"";
					break;
				case "checkbox":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "checklist":
				case "checktext":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					colSchema.valuetext = nSchema.valuetext?nSchema.valuetext:"";
					break;
				case "editor":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "select":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "password":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "password_confirm":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "intdate":
				case "intdatetime":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "date":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "time":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "timerange":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "datetime":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "daterange":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "range":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "rangehide":
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
				case "ymd":
					colSchema.value 	= parseInt(nSchema.value)?parseInt(nSchema.value):"";
					break;
				default:
					colSchema.value 	= nSchema.value?nSchema.value:"";
					break;
			}
			
			if( parseInt(colSchema.error)==0 ) colSchema.oldval = colSchema.value;
			
			this.syncToHTML(colSchema);
		}
	},
	
	show: function() {
		console.log(this.cols);
	},
	
	/*  create checkbox and radio 
		{	stable:'', scol:'', stitle:'', sdesc:'',  
			name:'', col:'', colname:'', notnull:0, 
			sn: 1,   colnum: 0 
		}
	*/
	radio: function( colSchema ) {
		colSchema.action = "radio";
		this.ajaxCall(colSchema);
	},

	checkbox: function(	colSchema ) {
		colSchema.action = "checkbox";
		this.ajaxCall(colSchema);
	},
	
	ajaxCall: function( colSchema ) {
		var _self = this;
		$.ajax({
			data: {
				schema: colSchema
			},
			dataType: "json",  
			error: function(xhr, tStatus, errorTh ) {
				//tool_tips("Error (" + (_self.formData.schema.url?_self.formData.schema.url:"ajax/lwh_lwhAjax_action.php") +  "): " + xhr.responseText + "\nStatus: " + tStatus);
			},
			success: function(req, tStatus) {
				errorHandler(req);
				if( req.errorCode == 0 ) {
					switch( colSchema.action ) {
						case "checkbox":
							_self.toCheckbox( colSchema, req.result["data"]);
							break;
						case "radio":
							_self.toRadio( colSchema, req.result["data"]);
							break;
					}
				}
			},
			type: 	"post",
			url: 	"ajax/lwhCol_ajax.php"
		});
	},
	
	toCheckbox: function ( colSchema, rows ) {
		var html = '';
		if( rows ) {
			if( parseInt(colSchema.align) ) html += '<table border="0" cellpadding="0" cellspacing="0">';
			var cnt = 0;
			for( var i = 0 ; i < rows.length; i++) {
				cnt++;
				if( cnt <= 0 ) if( parseInt(colSchema.align) ) html += '<tr>'; 
				
				if( parseInt(colSchema.align) ) html += '<td>'; 
				
				var sid 			= rows[i].id;
				var stitle 			= rows[i].title?rows[i].title:'';
				var sdesc 			= rows[i].description?rows[i].description:'';
				
				
				colSchema.scope 	= colSchema.scope?colSchema.scope:this.head.scope;
				colSchema.name 		= colSchema.name?colSchema.name:"";
				colSchema.col 		= colSchema.col?colSchema.col:name;
				colSchema.colname	= colSchema.colname?colSchema.colname:name;
				colSchema.coltype	= "checkbox";
				colSchema.datatype	= colSchema.datatype?colSchema.datatype:"all";

				colSchema.rtable	= colSchema.rtable?colSchema.rtable:"";
				colSchema.rcol		= colSchema.rcol?colSchema.rcol:"";
				colSchema.notnull	= colSchema.notnull?colSchema.notnull:0;
				colSchema.need		= colSchema.need?colSchema.need:0;
				colSchema.colnum	= colSchema.colnum?colSchema.colnum:0;
				colSchema.sn		= colSchema.sn?colSchema.sn:0;

				colSchema.value		= colSchema.value?colSchema.value:"";
				colSchema.oldval 	= colSchema.value;
				
			  	var vals 	= (""+colSchema.value).split(",");
				// label required :  scope="" name=""  ,  don't need  coltype
				html += [
					'<label scope="' + colSchema.scope + '" name="' + colSchema.name + '" class="' + (vals.indexOf(rows[i].id.toString())>=0?'lwhCommon-checked':'' ) + '" title="' + sdesc +  '" style="margin-left:2px;margin-right:2px;">',
					'<input type="checkbox" class="lwhCommon-checkbox" ',
					'scope="' + colSchema.scope + '" ',
					'name="' + colSchema.name + '" ',
					'col="' + colSchema.col + '" ',
					'colname="' + colSchema.colname + '" ',
					'coltype="' + colSchema.coltype + '" ',
					'rtable="' + colSchema.rtable + '" ',
					'rcol="' + colSchema.rcol + '" ',
					'need="' + colSchema.need + '" ',
					'notnull="' + colSchema.notnull + '" ',
					'value="' + rows[i].id + '" ',
					'' + (vals.indexOf(rows[i].id.toString())>=0?'checked="checked" ':'' ) + '',
					'/>',
					'<span class="lwhCommon-checkbox">' + ( parseInt(colSchema.sn)?(i+1) + ': ':'') + stitle + '</span>',
					'</label>'
				].join('');
				
				if( parseInt(colSchema.align) ) html += '</td>';
				
				if(cnt >= colSchema.colnum && colSchema.colnum > 0 ) {
					cnt = 0;
					if( parseInt(colSchema.align) ) 
						html += '</tr>';
					else
						html += '<br>';
				}
			}

			if(cnt > 0 && cnt < colSchema.colnum && colSchema.colnum > 0) {
				if( parseInt(colSchema.align) ) html += '</tr>';
			}
	
			if( parseInt(colSchema.align) ) html += '</table>';
		}
		$(colSchema.container).html(html);
		
		if( ArraySearch(this.cols, "name", colSchema.name) < 0 ) {
			colSchema.state = 0;
			colSchema.error = 0;
			colSchema.errorMessage = "";
			this.cols.push( colSchema );
		}
	},
	
	toRadio: function ( colSchema, rows ) {
		var html = '';
		if( rows ) {
			if( parseInt(colSchema.align) ) html += '<table border="0" cellpadding="0" cellspacing="0">';
			var cnt = 0;
			for( var i = 0 ; i < rows.length; i++) {
				cnt++;
				if( cnt <= 0 ) if( parseInt(colSchema.align) ) html += '<tr>'; 
				
				if( parseInt(colSchema.align) ) html += '<td>'; 
				
				var sid 	= rows[i].id;
				var stitle 	= rows[i].title?rows[i].title:'';
				var sdesc 	= rows[i].description?rows[i].description:'';
				
				colSchema.scope 	= colSchema.scope?colSchema.scope:this.head.scope;
				colSchema.name 		= colSchema.name?colSchema.name:"";
				colSchema.col 		= colSchema.col?colSchema.col:name;
				colSchema.colname	= colSchema.colname?colSchema.colname:name;
				colSchema.coltype	= "radio";
				colSchema.datatype	= colSchema.datatype?colSchema.datatype:"number";

				colSchema.need		= colSchema.need?colSchema.need:0;
				colSchema.notnull	= colSchema.notnull?colSchema.notnull:0;
				colSchema.colnum	= colSchema.colnum?colSchema.colnum:0;
				colSchema.sn		= colSchema.sn?colSchema.sn:0;

				colSchema.value		= colSchema.value?colSchema.value:"";
				colSchema.oldval 	= colSchema.value;
				
				// label required :  scope="" name=""  ,  don't need  coltype
				html += [
					'<label scope="' +  colSchema.scope + '" name="' +  colSchema.name + '" class="' + (parseInt(colSchema.value)==parseInt(rows[i].id)?'lwhCommon-checked':'' ) + '" title="' + sdesc +  '" style="margin-left:2px;margin-right:2px;">',
					'<input type="radio" class="lwhCommon-checkbox" ',
				
					'scope="' + colSchema.scope + '" ',
					'name="' + colSchema.name + '" ',
					'col="' + colSchema.col + '" ',
					'colname="' + colSchema.colname + '" ',
					'coltype="' + colSchema.coltype + '" ',
					'need=' + colSchema.need + '" ',
					'notnull="' + colSchema.notnull + '" ',
					'datatype="' + colSchema.datatype + '" ',
					'value="' + rows[i].id + '" ',
					'' + ( parseInt(colSchema.value)==parseInt(rows[i].id)?'checked="checked" ':'' ) + '',
					'/>',
					'<span class="lwhCommon-checkbox">' + ( parseInt(colSchema.sn)?(i+1) + ': ':'') + stitle + '</span>',
					'</label>'
				].join('');
				
				if( parseInt(colSchema.align) ) html += '</td>';
				
				if(cnt >= colSchema.colnum && colSchema.colnum > 0 ) {
					cnt = 0;
					if( parseInt(colSchema.align) ) 
						html += '</tr>';
					else
						html += '<br>';
				}
			}

			if(cnt > 0 && cnt < colSchema.colnum && colSchema.colnum > 0) {
				if( parseInt(colSchema.align) ) html += '</tr>';
			}
	
			if( parseInt(colSchema.align) ) html += '</table>';
		}
		$(colSchema.container).html(html);
		
		if( ArraySearch(this.cols, "name", colSchema.name) < 0 ) {
			colSchema.state = 0;
			colSchema.error = 0;
			colSchema.errorMessage = "";
			this.cols.push( colSchema );
		}
	}
	
}

/***
    <input type="checkbox" coltype="filter" name="status"  datatype="checkbox" need="0" value="1" />Male 
    <input type="checkbox" coltype="filter" name="status"  datatype="checkbox" need="0" value="2" />Female

    <input type="radio" coltype="filter" name="status1" cols="status" datatype="radio" need="0" value="1" />Male11 
    <input type="radio" coltype="filter" name="status1" cols="status" datatype="radio" need="0" value="2" />Female22
<br />
    <input type="text" class="thumb" coltype="filter" name="age:hh0" 	cols="birth_time" datatype="hms1" need="1" value="9" />
    <input type="text" class="thumb" coltype="filter" name="age:mm0"   	cols="birth_time" datatype="hms1" need="1" value="12" />
    <input type="text" class="thumb" coltype="filter" name="age:ss0"   	cols="birth_time" datatype="hms1" need="1" value="30" />
	-
    <input type="text" class="thumb" coltype="filter" name="age:hh1" 	cols="birth_time" datatype="hms1" need="1" value="9" />
    <input type="text" class="thumb" coltype="filter" name="age:mm1"   	cols="birth_time" datatype="hms1" need="1" value="12" />
    <input type="text" class="thumb" coltype="filter" name="age:ss1"   	cols="birth_time" datatype="hms1" need="1" value="30" />
<br />
    <input type="text" class="short" coltype="filter" name="member"   cols="member_date" datatype="date" compare=">=" need="0" value="2015-8-15" />

***/