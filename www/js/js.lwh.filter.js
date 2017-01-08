var LWH = LWH || {};
LWH.FILTER = function(opts) {
	this.iCol = null;
	this.func = {
		keydown: null
	};
	this.head = {
		lang:		DLang,
		scope:		""
	};
	$.extend(this.head, opts.head);
	$.extend(this.func, opts.func);

	var _self 	= this;
	// class constructor
	var _constructor = function() {
			_self.iCol =new LWH.COL({
				head: {
						scope: 	_self.head.scope ,
						lang:	_self.head.lang
				}
			});
			_self.iCol.init();


			$("input[scope='" + _self.head.scope + "'][coltype][name], span.lwhButton-remove[scope='" + _self.head.scope + "']").die("click").live("click", function(ev) {
					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});

			$("input[scope='" + _self.head.scope + "'][coltype][name]").die("keydown").live("keydown", function(ev) {
				if (ev.keyCode == 13) {
					if(_self.func.keydown) 
						if($.isFunction(_self.func.keydown)) 
							_self.func.keydown();
				}
			});

			$("a.lwhButton-search[scope='" + _self.head.scope + "']").die("click").live("click", function(ev) {
					if(_self.func.keydown) 
						if($.isFunction(_self.func.keydown)) 
							_self.func.keydown();

					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});

			$("span.lwhButton-remove[scope='" + _self.head.scope + "']").die("click").live("click", function(ev) {
					var colName = $("input[scope='" + _self.head.scope + "'][coltype][name]", "a.lwhButton-search[scope='" + _self.head.scope + "']").attr("name");
					// important: use  iCol.set(colName, colVal),  it remove dom and colObj values
					_self.iCol.set( colName, "");
					if(_self.func.keydown) 
						if($.isFunction(_self.func.keydown)) 
							_self.func.keydown();

					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});


	}();
}


LWH.FILTER.prototype = {
	output: function(){
		return this.iCol.getAll();
	},

	set: function( name, val ) {
		this.iCol.set( name, val );
	},
	
	get: function( name ) {
		return this.iCol.get(name);
	},
	
	update: function( nSchema ) {
		this.iCol.update( nSchema );
	},

	updateAjax: function( cols ) {
		if( cols && $.isArray(cols) ) {
			for(var i = 0; i < cols.length; i++) {
				this.update( cols[i] );
			}
		}
	},

	clear : function() {
		this.iCol.clear();
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