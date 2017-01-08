/************************************************************************************/
/*  JQuery Plugin Tab		 - 														*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-8-15      															*/
/*  Files: 	jquery.lwh.tab.js ;  jquery.lwh.tab.css									*/
/************************************************************************************/

$.fn.extend({
	lwhTable: function(opts) {
        var def_settings = {
			schema:     {},
			wait:		0,		
			url:		""
        };
        $.extend(def_settings, opts);

		return this.each(function(idx, el) { 
			def_settings.schema.filter = def_settings.schema.filter || {};
			$("input[coltype='filter']", "#" + def_settings.schema.navi.filterid).each(function(idx1,el1) {
				def_settings.schema.filter[$(el1).attr("name")] 			= def_settings.schema.filter[$(el1).attr("name")] || {};
				def_settings.schema.filter[$(el1).attr("name")].cols 		= $(el1).attr("cols");
				def_settings.schema.filter[$(el1).attr("name")].datatype 	= $(el1).attr("datatype")?$(el1).attr("datatype"):"string";
				def_settings.schema.filter[$(el1).attr("name")].required 	= $(el1).attr("required")?$(el1).attr("required"):0;
				def_settings.schema.filter[$(el1).attr("name")].compare 	= $(el1).attr("compare")?$(el1).attr("compare"):"like";
				def_settings.schema.filter[$(el1).attr("name")].val 		= $(el1).val();
			});
            $(el).data("default_settings", def_settings);
			//console.log(def_settings);
			

			this.ajax_call = function() {
				if(def_settings.wait) wait_show();
				$("a.lwhTable-navi-button-loading",el).removeClass("lwhTable-navi-button-loading-na");
				$("a.lwhTable-navi-button-refresh",el).hide();

				$("input[coltype='filter']", "#" + def_settings.schema.navi.filterid).each(function(idx1,el1) {
					def_settings.schema.filter[$(el1).attr("name")] 			= def_settings.schema.filter[$(el1).attr("name")] || {};
					def_settings.schema.filter[$(el1).attr("name")].cols 		= $(el1).attr("cols");
					def_settings.schema.filter[$(el1).attr("name")].datatype 	= $(el1).attr("datatype")?$(el1).attr("datatype"):"string";
					def_settings.schema.filter[$(el1).attr("name")].required 	= $(el1).attr("required")?$(el1).attr("required"):0;
					def_settings.schema.filter[$(el1).attr("name")].compare 	= $(el1).attr("compare")?$(el1).attr("compare"):"like";
					def_settings.schema.filter[$(el1).attr("name")].val 		= $(el1).val();
				});

				$.ajax({
					data: {
						schema: 	def_settings.schema
					},
					dataType: "json",  
					error: function(xhr, tStatus, errorTh ) {
						if(def_settings.wait) wait_hide();
					},
					success: function(req, tStatus) {
						if(def_settings.wait) wait_hide();
						$("a.lwhTable-navi-button-loading",el).addClass("lwhTable-navi-button-loading-na");
						$("a.lwhTable-navi-button-refresh",el).show();
						errorHandler(req);
						$(el).html(req.html);
						def_settings.schema = req.schema;

						$("input[name='pageno']", el).val(def_settings.schema.navi.pageNo);
					},
					type: 	"post",
					url: 	def_settings.url
				});
			}
			
			var _self = this;
			
			$("a.lwhTable-navi-button-refresh",el).die("click").live("click", function(ev) {
				_self.ajax_call();
			});



			$("input[coltype='filter']", "#" + def_settings.schema.navi.filterid).die("click").live("click", function(ev) {
				ev.stopPropagation();
				ev.preventDefault();
				return false;
			});

			$("input[coltype='filter']", "#" + def_settings.schema.navi.filterid).die("keydown").live("keydown", function(ev) {
				if (ev.keyCode == 13) {
					def_settings.schema.navi.pageNo	= 1;	
					_self.ajax_call();
				}
			});


			$("a.lwhButton-search", "#" + def_settings.schema.navi.filterid).die("click").live("click", function(ev) {
					def_settings.schema.navi.pageNo	= 1;	
					_self.ajax_call();

					ev.stopPropagation();
					ev.preventDefault();
					return false;
			});


			$("input[name='pageno']", el).die("keydown").live("keydown", function(ev) {
				if (ev.keyCode == 13) {
					def_settings.schema.navi.pageNo	= $(this).val();	
					_self.ajax_call();
				}
			});

			
			$("select[name='pagesize']", el).die("change").live("change", function(ev) {
				def_settings.schema.navi.pageNo		= 1;	
				def_settings.schema.navi.pageSize 	= $(this).val();	
				_self.ajax_call();
			});

			$("a.lwhTable-navi-button-last", el).die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhTable-navi-button-last-na") ) {
					def_settings.schema.navi.pageNo	= def_settings.schema.navi.pageTotal;	
					_self.ajax_call();
				}
			});

			$("a.lwhTable-navi-button-next", el).die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhTable-navi-button-next-na") ) {
					def_settings.schema.navi.pageNo++;	
					_self.ajax_call();
				}
			});

			$("a.lwhTable-navi-button-first", el).die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhTable-navi-button-first-na") ) {
					def_settings.schema.navi.pageNo	= 1;	
					_self.ajax_call();
				}
			});

			$("a.lwhTable-navi-button-prev", el).die("click").live("click", function(ev) {
				if( !$(this).hasClass("lwhTable-navi-button-prev-na") ) {
					def_settings.schema.navi.pageNo--;	
					_self.ajax_call();
				}
			});

			$("a.lwhTable-mode-button", el).die("click").live("click", function(ev) {
				if( $(this).hasClass("lwhTable-mode-button-list") ) {
					if(!$(this).hasClass("lwhTable-mode-button-list-selected")) {
						$("a.lwhTable-mode-button-view", el).removeClass("lwhTable-mode-button-view-selected");
						$("a.lwhTable-mode-button-list", el).addClass("lwhTable-mode-button-list-selected");
						$("div.mode-view", el).hide();
						$("div.mode-list", el).show();
						def_settings.schema.navi.mode = "list";
					}
				} else {
					if(!$(this).hasClass("lwhTable-mode-button-view-selected")) {
						$("a.lwhTable-mode-button-list", el).removeClass("lwhTable-mode-button-list-selected");
						$("a.lwhTable-mode-button-view", el).addClass("lwhTable-mode-button-view-selected");
						$("div.mode-list", el).hide();
						$("div.mode-view", el).show();
						def_settings.schema.navi.mode = "view";
					}
				}
			});
		});
	},

    lwhTable_filter: function (name, val) {
        return this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");
			def_settings.schema.filter[name] =  def_settings.schema.filter[name]?def_settings.schema.filter[name]:{};
			def_settings.schema.filter[name].val = val;
			console.log(def_settings);
        });
    },
	
    lwhTable_search: function () {
        return this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");

			if(def_settings.wait) wait_show();
			$("a.lwhTable-navi-button-loading",el).removeClass("lwhTable-navi-button-loading-na");
			$("a.lwhTable-navi-button-refresh",el).hide();

			$("input[coltype='filter']", "#" + def_settings.schema.navi.filterid).each(function(idx1,el1) {
				def_settings.schema.filter[$(el1).attr("name")] 			= def_settings.schema.filter[$(el1).attr("name")] || {};
				def_settings.schema.filter[$(el1).attr("name")].cols 		= $(el1).attr("cols");
				def_settings.schema.filter[$(el1).attr("name")].datatype 	= $(el1).attr("datatype")?$(el1).attr("datatype"):"string";
				def_settings.schema.filter[$(el1).attr("name")].required 	= $(el1).attr("required")?$(el1).attr("required"):0;
				def_settings.schema.filter[$(el1).attr("name")].compare 	= $(el1).attr("compare")?$(el1).attr("compare"):"like";
				def_settings.schema.filter[$(el1).attr("name")].val 		= $(el1).val();
			});

			def_settings.schema.navi.pageNo	= 1;	
			$.ajax({
				data: {
					schema: 	def_settings.schema
				},
				dataType: "json",  
				error: function(xhr, tStatus, errorTh ) {
					if(def_settings.wait) wait_hide();
				},
				success: function(req, tStatus) {
					if(def_settings.wait) wait_hide();
					$("a.lwhTable-navi-button-loading",el).addClass("lwhTable-navi-button-loading-na");
					$("a.lwhTable-navi-button-refresh",el).show();

					errorHandler(req);
					$(el).html(req.html);
					def_settings.schema = req.schema;
				},
				type: 	"post",
				url: 	def_settings.url
			});
        });
    },
	
    lwhTable_searchAll: function () {
        return this.each(function (idx, el) {
            var def_settings = $(el).data("default_settings");

			if(def_settings.wait) wait_show();
			$("a.lwhTable-navi-button-loading",el).removeClass("lwhTable-navi-button-loading-na");
			$("a.lwhTable-navi-button-refresh",el).hide();

			$("input[coltype='filter']", "#" + def_settings.schema.navi.filterid).each(function(idx1,el1) {
				def_settings.schema.filter[$(el1).attr("name")] 			= def_settings.schema.filter[$(el1).attr("name")] || {};
				def_settings.schema.filter[$(el1).attr("name")].cols 		= $(el1).attr("cols");
				def_settings.schema.filter[$(el1).attr("name")].datatype 	= $(el1).attr("datatype")?$(el1).attr("datatype"):"string";
				def_settings.schema.filter[$(el1).attr("name")].required 	= $(el1).attr("required")?$(el1).attr("required"):0;
				def_settings.schema.filter[$(el1).attr("name")].compare 	= $(el1).attr("compare")?$(el1).attr("compare"):"like";
				def_settings.schema.filter[$(el1).attr("name")].val 		= "";
				$(el1).val("");
			});

			def_settings.schema.navi.pageNo	= 1;	
			$.ajax({
				data: {
					schema: 	def_settings.schema
				},
				dataType: "json",  
				error: function(xhr, tStatus, errorTh ) {
					if(def_settings.wait) wait_hide();
				},
				success: function(req, tStatus) {
					if(def_settings.wait) wait_hide();
					$("a.lwhTable-navi-button-loading",el).addClass("lwhTable-navi-button-loading-na");
					$("a.lwhTable-navi-button-refresh",el).show();

					errorHandler(req);
					$(el).html(req.html);
					def_settings.schema = req.schema;
				},
				type: 	"post",
				url: 	def_settings.url
			});
        });
    }
	
	
});