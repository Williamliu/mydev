/******* Table & ArraySearch  *******/
var WLIU = WLIU || {};

WLIU.OBJECT = function() {}
WLIU.OBJECT.prototype = {
	update: function( col, p_value1, p_value2) {
		switch(arguments.length) {
			case 0:
				return undefined;
			case 1:
				var col = arguments[0];
				return col;
			case 2:
				var col = arguments[0];
				var keyvalues = arguments[1];
				if( $.isPlainObject (keyvalues) ) {
					for(var key in keyvalues) {
						col[key] = keyvalues[key];
					}
				} else {
					return col;
				}			
			case 3:
				var col = arguments[0];
				var key = arguments[1];
				var val = arguments[2];
				col[key] = val; 
				break;
		}
	}
}

WLIU.COLLECTION = function(){}
WLIU.COLLECTION.prototype = {
	// return collection index:  0 ~ collection.length -1 
	index: function(collection, keyvalues) {
		var cidx = -1;
		$.each(collection, function(i, n) {
			var not_found = false;
			for(var key in keyvalues) {
				if( n[key] != keyvalues[key] ) not_found = true; 
			}
			if(!not_found) cidx = i;
			return not_found;
		});
		return cidx;
	},
	// special for rows collection:  each row has row.keys={ id1: xxx, id2: xxx }
	indexByKeys: function(collection, keys) {
		var cidx = -1;
		$.each(collection, function(i, n) {
			var found = 0;
			var cnt = 0;
			for(var key in keys) {
				cnt++;
				if( n.keys ) {
					if( n.keys[key] == keys[key] ) {
						found++;
					} else {
						found--;
					}
				} else {
					found--;
				}
			}
			if( cnt > 0 && found == cnt ) cidx = i;
			return cidx;
		});
		return cidx;
	},

	// return object : {xxx: xxx, ...}
	objectByIndex: function(collection, cidx) {
		if(cidx >= 0 && cidx < collection.length) {
			return collection[ridx];
		}  else {
			return undefined;
		}
	},
	objectByKV: function(collection, keyvalues) {
		var cidx = this.index(collection, keyvalues);
		if(cidx >=0) {
			return collection[cidx];
		} else {
			return undefined;
		}
	},
	objectByKeys: function( collection, keys) {
		var cidx = this.indexByKeys(collection, keys);
		if(cidx >=0) {
			return collection[cidx];
		} else {
			return undefined;
		}
	},

	// return array of object: [{}, {}]  or  [] if not found
	collectionByKV: function(collection, keyvalues) {
	   return $.grep(collection, function(n,i) {
			var not_found = false;
			for(var key in keyvalues) {
				if( n[key] != keyvalues[key] ) not_found = true; 
			}
			return !not_found;
		});
	},
	firstByKV: function( collection, keyvalues) {
		var ncollection = this.collectionByKV(collection, keyvalues);
		return ncollection?(ncollection.length>0?ncollection[0]:[]):[];
	}

	// update collection object
}