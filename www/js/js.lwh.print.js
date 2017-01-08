/********************/
var LWH = LWH || {};
LWH.PRINT = function(opts) {
	this.iEditor 	= null;
	this.divBox 	= null;
	this.width		= 640;
	this.height		= 360;
	this.func = {
		before: null,
		after:	null,
	};

	$.extend(this.func, opts);
	this.width 	= opts.width?opts.width:this.width;
	this.height = opts.height?opts.height:this.height;

	var _self 	= this;

	// class constructor
	var _constructor = function() {
		var config = {};
	
		config.toolbarGroups = [
			{ name: 'document', groups: [ 'mode', 'tools', 'document', 'doctools' ] },
			{ name: 'insert', groups: [ 'insert' ] },
			{ name: 'colors', groups: [ 'colors' ] },
			{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
			{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
			{ name: 'styles', groups: [ 'styles' ] }
		];
		config.removeButtons = 'Templates,NewPage,ShowBlocks';
		config.enterMode = CKEDITOR.ENTER_BR;
		config.shiftEnterMode = CKEDITOR.ENTER_BR;
		config.width 	= _self.width;
		config.height 	= _self.height;
		config.extraPlugins = "base64image";
		
		/*	
		config.toolbarGroups = [
			{ name: 'tools', groups: [ 'tools' ] },
			{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] }
		];
		config.removeButtons = 'Source,Templates,Save,NewPage,ShowBlocks';
		config.enterMode = CKEDITOR.ENTER_BR;
		config.shiftEnterMode = CKEDITOR.ENTER_BR;
		config.height 	= 480;
		config.width 	= 640;
		config.extraPlugins = "base64image";
		*/
		
		var html_hh = [	
						'<div class="lwhWrapBox">',
							'<div class="lwhWrapBox-content">',
							'<textarea id="lwhPrint-textarea"></textarea>',
							'</div>',
						'</div>'
					  ].join('');
					  
		_self.divBox = $("body").append(html_hh)[0].lastChild;
		_self.iEditor = CKEDITOR.replace("lwhPrint-textarea", config);
		$(_self.divBox).lwhWrapBox({
			before: function(el) {
				if( _self.func.before) if($.isFunction(_self.func.before)) {
					_self.func.before( _self.iEditor );
				}
			},
			after:  function(el) {
				if( _self.func.after) if($.isFunction(_self.func.after)) {
					_self.func.after( _self.iEditor );
				}
			}
		});
	}();
	
}


LWH.PRINT.prototype = {
	show: function() {
		$(this.divBox).wrapBoxShow();
	},
	set:  function( html ) {
		this.iEditor.setData(html);	
	},
	get:  function() {
		return this.iEditor.getData();	
	},
	clear: function() {
		this.iEditor.setData("");
	},
	print: function( html ) {
		this.set(html);
		this.show();
	}
}