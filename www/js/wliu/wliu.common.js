/**************************************************************/
/**** 				 Data Type Prototype        		    ***/
/**************************************************************/
String.prototype.nl2br = function() {
	var str = this.toString();
	str = str.replace(/\n|\r/gi, "<br>");
	str = str.replace(/ /gi, "&nbsp;");
	return str;
}
String.prototype.nl2br1 = function() {
	var str = this.toString();
	str = str.replace(/\n|\r/gi, "<br>");
	//str = str.replace(/ /gi, "&nbsp;");
	return str;
}
String.prototype.br2nl = function() {
	var str = this.toString();
	str = str.replace(/<br>|<br \/>/gi, "\n");
	str = str.replace(/&nbsp;/gi, " ");
	return str;
}
String.prototype.trim = function() {
	return this.replace(/^\s+(.*)\s+$/gi,"$1");
}
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}
String.prototype.capital = function() {
	if( this !="" ) {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	} else 
	{
		return "";
	}
}
String.prototype.join = function(sp, str) {
	if( this!="" && (""+str)!="" )
		return this + sp + str;
	else 
		return this + (""+str);
}

String.prototype.toBlob = function(mime) {
	var bstr = "" + this.toString();
	var n = bstr.length;
	var u8arr = new Uint8Array(n);
	
	while(n--){
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], {type:mime});
}

/*** File Name ***/
String.prototype.fileName = function() {
	var name = this.toString().replace(/.*(\/|\\)/, "");
	return name.substr(0,name.lastIndexOf("."));
}

String.prototype.extName = function() {
	return (this.toString().indexOf('.') !== -1)?this.toString().replace(/.*[.]/, '').toLowerCase() :'';
}

String.prototype.shortName = function(n) {
	n = n || 10;
	var name = this.toString().fileName();
	if (name.length > n){
			name = name.slice(0, n - 3) + '...' + name.slice(-3);    
	}
	return name;
}
String.prototype.fullName = function(n) {
	n = n || 13;
	var name = this.toString().replace(/.*(\/|\\)/, "");
	if( name.length > n ) {
		name = name.slice(0, n - 8) + '...' + name.slice(-8);    
	} 
	return name;
}
Number.prototype.toSize = function() {
		if( isNaN(this) || parseFloat(this) <= 0  ) {
			return "";
		} else {
			/* main function here */
			var bytes = parseInt(this);
			var i = -1;                                    
			do {
				bytes = bytes / 1024;
				i++;  
			} while (bytes > 999);
			/* end of main function here */

			return Math.max(bytes, 1).toFixed(0) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];          
		}
}
/*****************************/

/*
Array.prototype.first = function() {
	return this[0];
}

Array.prototype.search = function( nameValues ) {
	var narr = [];
	if( nameValues ) {
		$.grep(this, function(n,i) {
			var not_found = false;
			for(var key in nameValues) {
				if( n[key] != nameValues[key] ) not_found = true; 
			}
			if( !not_found ) narr.push(n);
			//return !not_found;
		});
	}
	return narr; 
}

Array.prototype.sortBy = function( propName, caseSense ) {
	this.sort(
		function(a, b) {
			var valueA = caseSense?a[propName]:a[propName].toUpperCase();
			var valueB = caseSense?b[propName]:b[propName].toUpperCase();
			if( valueA < valueB ) 
				return -1;
			else if ( valueA > valueB)
			 	return 1;
			else 
				return 0;
		}
	);
	return this;
}
*/