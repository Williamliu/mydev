CKEDITOR.editorConfig = function (config) {
	/*
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];

	config.removeButtons = 'Underline,Subscript,Superscript';
	config.format_tags = 'p;h1;h2;h3;pre';
	config.fullPage = true;
	config.allowedContent = true;
	config.extraPlugins = 'pastefromword';
	config.extraPlugins = 'imagepaste';
	*/

	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'tools', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'styles', groups: [ 'styles' ] }
	];

	config.removeButtons = 'Form,Checkbox,Radio,TextField,Select,Button,Textarea,HiddenField,Image,Flash,Iframe';
	config.format_tags = 'p;h1;h2;h3;pre';
	config.fullPage = true;
	config.allowedContent = true;
	config.extraPlugins = 'pastefromword';
	config.extraPlugins = 'imagepaste';
	config.extraPlugins = 'base64image';
	config.height 		= 500;
};


