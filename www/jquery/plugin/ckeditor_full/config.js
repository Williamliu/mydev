CKEDITOR.editorConfig = function (config) {
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'tools', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		"/",
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'styles', groups: [ 'styles' ] }
	];

	//config.removeButtons = 'Form,Checkbox,Radio,TextField,Select,Button,ImageButton,Textarea,HiddenField,Image,Flash,Iframe';   
	config.removeButtons = 'Form,Checkbox,Radio,TextField,Select,Button,ImageButton,Textarea,HiddenField,Image,Flash,Iframe';   
    
    config.enterMode = CKEDITOR.ENTER_BR;
    config.shiftEnterMode = CKEDITOR.ENTER_BR;
    config.height = 360;
    config.extraPlugins = "base64image,imagepaste";
    //config.extraPlugins = "imagepaste";
};


