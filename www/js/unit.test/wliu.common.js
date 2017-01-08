// Array Function
var WLIUARRAY = function() {};
WLIUARRAY.prototype = {
	Search: function(arr, sobj) {
	   return $.grep(arr, function(n,i) {
			var not_found = false;
			for(var key in sobj) {
				if( n[key] != sobj[key] ) not_found = true; 
			}
			return !not_found;
		});
	},
	
	Single: function(arr, sobj) {
		var cols = $.grep(arr, function(n,i) {
			var not_found = false;
			for(var key in sobj) {
				if( n[key] != sobj[key] ) not_found = true; 
			}
			return !not_found;
		});
		
		return cols.length>0?cols[0]:null;
	},
	index: function(arr, sobj) {
		var aidx = -1;
		$.each(arr, function(i, n) {
			var not_found = false;
			for(var key in sobj) {
				if( n[key] != sobj[key] ) not_found = true; 
			}
			if(!not_found) aidx = i;
			return not_found;
		});
		return aidx;
	},
	singleByKeys: function(arr, keys) {
		var cols = $.grep(arr, function(n,i) {
			var not_found = false;
			for(var key in sobj) {
				if( n.keys[key] != sobj[key] ) not_found = true; 
			}
			return !not_found;
		});
		return cols.length>0?cols[0]:null;
	},
	indexByKeys: function(arr, sobj) {
		var aidx = -1;
		$.each(arr, function(i, n) {
			var found = 0;
			var cnt = 0;
			for(var key in sobj) {
				cnt++;
				if( n.keys[key] == sobj[key] ) {
					found++;
				} else {
					found--;
				}
			}
			if( cnt > 0 && found == cnt ) aidx = i;
			return aidx;
		});
		return aidx;
	}
}

// Create Global Function
var FUNC = FUNC || {};
FUNC.ARRAY 	= new WLIUARRAY();

