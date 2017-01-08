var LWH = {};

/***  prototype common function ***/
String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2);
}

String.prototype.trim = function() {
			return this.replace(/^\s+(.*)\s+$/gi,"$1");
}

String.prototype.right = function(n) {
			if( n >= this.length ) {
				return this;
			} else {
				return this.substr(this.length - n);
			}
}

String.prototype.printr = function() {
	var str = this.toString();
	for(var i = 0; i < arguments.length; i++ ) {
		var reg = new RegExp("\\{" + i + "\\}", "gim");
		str = str.replace(reg, arguments[i]);
	}
	return str;
}

function ArraySearch(arr, prop, val) {
	for(var i = 0; i < arr.length; i++) {
		if( arr[i][prop] == val ) return i;
	}
	return -1;
}

function ArrayKey(arr, prop, val) {
	for(var key in arr) {
		if( arr[key][prop] == val ) return key;
	}
	return "";
}

String.prototype.sort = function() {
	var str = this.toString();
	sarr = str.split(",");
	sval = "";
	if( Array.isArray(sarr) ) {
		sarr.sort(function(a, b) {
			return parseFloat(a) - parseFloat(b);
		});
		sval = sarr.join(",");
	}
	return sval;
}

String.prototype.sort1 = function() {
	var str = this.toString();
	sarr = str.split(", ");
	sval = "";
	if( Array.isArray(sarr) ) {
		sarr.sort(function(a, b) {
			return parseFloat(a) - parseFloat(b);
		});
		sval = sarr.join(", ");
	}
	return sval;
}


String.prototype.nl2br = function() {
	var str = this.toString();
	str = str.replace(/\n|\r/gi, "<br>");
	str = str.replace(/ /gi, "&nbsp;");
	return str;
}

String.prototype.br2nl = function() {
	var str = this.toString();
	str = str.replace(/<br>|<br \/>/gi, "\n");
	str = str.replace(/&nbsp;/gi, " ");
	return str;
}

String.prototype.toDateTime = function() {
	if(isNaN(this)) {
		return "";
	} else {
		if( parseInt(this) > 0 ) {
			var ts = parseInt(this) * 1000;
			var dt = new Date(ts);
			var ds = "{0}-{1}-{2} {3}:{4}";
			return ds.printr(dt.getFullYear(), ("0" + (dt.getMonth() + 1)).right(2) , ("0" + dt.getDate()).right(2), dt.getHours(), ("0" + dt.getMinutes()).toString().right(2), ("0" + dt.getSeconds()).toString().right(2) );
		} else {
			return "";
		}
	}
}

String.prototype.toDate = function() {
	if(isNaN(this)) {
		return "";
	} else {
		if( parseInt(this) > 0 ) {
			var ts = parseInt(this) * 1000;
			var dt = new Date(ts);
			var ds = "{0}-{1}-{2}";
			return ds.printr(dt.getFullYear(), ("0" + (dt.getMonth() + 1)).right(2) , ("0" + dt.getDate()).right(2) );
		} else {
			return "";
		}
	}
}

String.prototype.toJSON = function() {
	return $.parseJSON(this.toString());
}

String.prototype.htmlEnt = function() {
	return  String(this).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

String.prototype.toHMS = function() {
	if( isNaN(this) || parseFloat(this) <= 0 ) {
		return "00:00";
	} else {
		var tsec 	= Math.ceil( parseFloat(this) );
		var tddd	= Math.floor(tsec / (3600 * 24));
		var thhh	= Math.floor( (tsec % (3600 * 24)) / 3600 );
		var tmmm	= Math.floor( (tsec % 3600) / 60 );
		var tsss	= Math.floor((tsec % 60));
		tddd		= tddd<=0?"":(tddd<2?tddd.toString()+"day ":tddd.toString()+"days ");
		thhh		= thhh==0?(tddd<=0?"":"00:"):(thhh.toString() + ":");
		tmmm		= "0" + tmmm.toString();
		tsss		= "0" + tsss.toString();		
		tmmm		= tmmm.right(2);
		tsss		= ":" + tsss.right(2);
		var new_str = tddd + thhh + tmmm + tsss;
		return new_str;
	}
}

String.prototype.toSize = function() {
	if(isNaN(this)) {
		return "";
	} else {
		if( parseInt(this) > 0 ) {

			/* main function here */
			var bytes = parseInt(this);
			var i = -1;                                    
			do {
				bytes = bytes / 1024;
				i++;  
			} while (bytes > 999);
			/* end of main function here */

			return Math.max(bytes, 1).toFixed(0) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];          

		} else {
			return "";
		}
	}
}


String.prototype.fileName = function() {
	var name = this.toString().replace(/.*(\/|\\)/, "");
	return name.substr(0,name.lastIndexOf("."));
}

String.prototype.extName = function() {
	return (this.toString().indexOf('.') !== -1)?this.toString().replace(/.*[.]/, '').toLowerCase() :'';
}

String.prototype.shortName = function(n) {
	n = n || 7;
	var name = this.toString().fileName();
	if( n > 7 ) {
		if (name.length > n){
			name = name.slice(0, n - 3) + '...' + name.slice(-3);    
		}
	}
	return name;
}

String.prototype.fullName = function(n) {
	n = n || 13;
	var name = this.toString().replace(/.*(\/|\\)/, "");
	if( n > 12 ) {
		if (this.toString().length > n){
			name = name.slice(0, n - 8) + '...' + name.slice(-8);    
		}
	}
	return name;
}

String.prototype.nl2br = function() {
	var str = this.toString();
	str = str.replace(/\n|\r/gi, "<br>");
	str = str.replace(/ /gi, "&nbsp;");
	return str;
}

String.prototype.unquote = function() {
	var str = this.toString();
	str = str.replace(/\\"/gi, '"');
	str = str.replace(/\\'/gi, "'");
	return str;
}


String.prototype.br2nl = function() {
	var str = this.toString();
	str = str.replace(/<br>|<br \/>/gi, "\n");
	str = str.replace(/&nbsp;/gi, " ");
	return str;
}

String.prototype.uword = function () {
    var ss = this.split(" ");
    var ret = "";
    for (var key in ss) {
        ret += (ret != "" ? " " : "") + ss[key].capital();
    }
    return ret;
}

String.prototype.capital = function () {
   return this.charAt(0).toUpperCase() + this.slice(1);
}

String.prototype.replaceAll = function(s1, s2) {
	return this.replace(new RegExp(s1, "gm"), s2!=undefined?s2:"");
}

Number.prototype.toDateTime = function() {
	if( parseInt(this) > 0 ) {
		var ts = parseInt(this) * 1000;
		var dt = new Date(ts);
		var ds = "{0}-{1}-{2} {3}:{4}";
		return ds.printr(dt.getFullYear(), ("0" + (dt.getMonth() + 1)).right(2) , ("0" + dt.getDate()).right(2), dt.getHours(), ("0" + dt.getMinutes()).toString().right(2), ("0" + dt.getSeconds()).toString().right(2) );
	} else {
		return "";
	}
}

Number.prototype.toDate = function() {
	if( parseInt(this) > 0 ) {
		var ts = parseInt(this) * 1000;
		var dt = new Date(ts);
		var ds = "{0}-{1}-{2}";
		return ds.printr(dt.getFullYear(), ("0" + (dt.getMonth() + 1)).right(2) , ("0" + dt.getDate()).right(2));
	} else {
		return "";
	}
}

Number.prototype.toHMS = function() {
	if( isNaN(this) || parseFloat(this) <= 0 ) {
		return "00:00";
	} else {
		var tsec 	= Math.ceil( parseFloat(this) );
		var tddd	= Math.floor(tsec / (3600 * 24));
		var thhh	= Math.floor( (tsec % (3600 * 24)) / 3600 );
		var tmmm	= Math.floor( (tsec % 3600) / 60 );
		var tsss	= Math.floor((tsec % 60));
		tddd		= tddd<=0?"":(tddd<2?tddd.toString()+"day ":tddd.toString()+"days ");
		thhh		= thhh==0?(tddd<=0?"":"00:"):(thhh.toString() + ":");
		tmmm		= "0" + tmmm.toString();
		tsss		= "0" + tsss.toString();		
		tmmm		= tmmm.right(2);
		tsss		= ":" + tsss.right(2);
		var new_str = tddd + thhh + tmmm + tsss;
		return new_str;
	}
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

Date.prototype.diff = function(d2) {
   		var t2 = this.getTime();
        var t1 = d2.getTime();
        return parseInt((t2-t1)/(24*3600*1000));
}
/*** End of prototype common function ***/


Date.prototype.format = function(format) {
    var returnStr = '';
    var replace = Date.replaceChars;
    for (var i = 0; i < format.length; i++) {       var curChar = format.charAt(i);         if (i - 1 >= 0 && format.charAt(i - 1) == "\\") {
            returnStr += curChar;
        }
        else if (replace[curChar]) {
            returnStr += replace[curChar].call(this);
        } else if (curChar != "\\"){
            returnStr += curChar;
        }
    }
    return returnStr;
};


Date.replaceChars = {
    shortMonths: 	['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    longMonths: 	['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    shortDays: 		['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    longDays: 		['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

    // Day
    d: function() { return (this.getDate() < 10 ? '0' : '') + this.getDate(); },
    D: function() { return Date.replaceChars.shortDays[this.getDay()]; },
    j: function() { return this.getDate(); },
    l: function() { return Date.replaceChars.longDays[this.getDay()]; },
    N: function() { return this.getDay() + 1; },
    S: function() { return (this.getDate() % 10 == 1 && this.getDate() != 11 ? 'st' : (this.getDate() % 10 == 2 && this.getDate() != 12 ? 'nd' : (this.getDate() % 10 == 3 && this.getDate() != 13 ? 'rd' : 'th'))); },
    w: function() { return this.getDay(); },
    z: function() { var d = new Date(this.getFullYear(),0,1); return Math.ceil((this - d) / 86400000); }, // Fixed now
    // Week
    W: function() { var d = new Date(this.getFullYear(), 0, 1); return Math.ceil((((this - d) / 86400000) + d.getDay() + 1) / 7); }, // Fixed now
    // Month
    F: function() { return Date.replaceChars.longMonths[this.getMonth()]; },
    m: function() { return (this.getMonth() < 9 ? '0' : '') + (this.getMonth() + 1); },
    M: function() { return Date.replaceChars.shortMonths[this.getMonth()]; },
    n: function() { return this.getMonth() + 1; },
    t: function() { var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 0).getDate() }, // Fixed now, gets #days of date
    // Year
    L: function() { var year = this.getFullYear(); return (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)); },   // Fixed now
    o: function() { var d  = new Date(this.valueOf());  d.setDate(d.getDate() - ((this.getDay() + 6) % 7) + 3); return d.getFullYear();}, //Fixed now
    Y: function() { return this.getFullYear(); },
    y: function() { return ('' + this.getFullYear()).substr(2); },
    // Time
    a: function() { return this.getHours() < 12 ? 'am' : 'pm'; },
    A: function() { return this.getHours() < 12 ? 'AM' : 'PM'; },
    B: function() { return Math.floor((((this.getUTCHours() + 1) % 24) + this.getUTCMinutes() / 60 + this.getUTCSeconds() / 3600) * 1000 / 24); }, // Fixed now
    g: function() { return this.getHours() % 12 || 12; },
    G: function() { return this.getHours(); },
    h: function() { return ((this.getHours() % 12 || 12) < 10 ? '0' : '') + (this.getHours() % 12 || 12); },
    H: function() { return (this.getHours() < 10 ? '0' : '') + this.getHours(); },
    i: function() { return (this.getMinutes() < 10 ? '0' : '') + this.getMinutes(); },
    s: function() { return (this.getSeconds() < 10 ? '0' : '') + this.getSeconds(); },
    u: function() { var m = this.getMilliseconds(); return (m < 10 ? '00' : (m < 100 ?'0' : '')) + m; },
    // Timezone
    e: function() { return "Not Yet Supported"; },
    I: function() {
        var DST = null;
            for (var i = 0; i < 12; ++i) {
                    var d = new Date(this.getFullYear(), i, 1);
                    var offset = d.getTimezoneOffset();

                    if (DST === null) DST = offset;
                    else if (offset < DST) { DST = offset; break; }                     else if (offset > DST) break;
            }
            return (this.getTimezoneOffset() == DST) | 0;
        },
    O: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + '00'; },
    P: function() { return (-this.getTimezoneOffset() < 0 ? '-' : '+') + (Math.abs(this.getTimezoneOffset() / 60) < 10 ? '0' : '') + (Math.abs(this.getTimezoneOffset() / 60)) + ':00'; }, // Fixed now
    T: function() { var m = this.getMonth(); this.setMonth(0); var result = this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/, '$1'); this.setMonth(m); return result;},
    Z: function() { return -this.getTimezoneOffset() * 60; },
    // Full Date/Time
    c: function() { return this.format("Y-m-d\\TH:i:sP"); }, // Fixed now
    r: function() { return this.toString(); },
    U: function() { return this.getTime() / 1000; }
};



/*** Normal JS function ***/
function jsonStr(jsonObj) {
	return JSON.stringify(jsonObj);
}
/*** End of normal JS function ***/



/*** JQuery Common Function ***/
$.extend({
	element_pro: function(el) {
				var pro	= {};
				if($(el).length <= 0) {
						el					= window;
						pro.left			= $(el).scrollLeft();
						pro.top				= $(el).scrollTop();
						pro.width			= $(el).width()	 - 4;
						pro.height			= $(el).height() - 4;
			   } else {
						pro.left			= $(el).offset().left;
						pro.top				= $(el).offset().top;
						pro.width			= $(el).outerWidth();
						pro.height			= $(el).outerHeight();
				} 
				return pro;
	},
	
	element_pos: function(el) {
				var def_settings = $(el).data("default_settings");
				var el_pos 		= {};
				el_pos.left 	= 0;
				el_pos.top 		= 0;
				
				var cont		= $.element_pro(def_settings.container);
				var el_width 	= $(el).outerWidth();
				var el_height 	= $(el).outerHeight();
				
				if( isNaN(def_settings.top)  ) {
						switch(def_settings.top) {
							case "top":
								el_pos.top = cont.top + 5;
								break;
							case "middle":
								el_pos.top = cont.top + (cont.height - el_height) / 2;
								break;
							case "bottom":
								el_pos.top = cont.top + cont.height - el_height - 5;
								break;
							default:
								el_pos.top = cont.top;
								break;
						}
				} else {
						el_pos.top 	= cont.top + parseInt(def_settings.top);
				}

				if( isNaN(def_settings.left) ) {
						switch(def_settings.left) {
							case "left":
								el_pos.left =cont.left + 5;
								break;
							case "center":
								el_pos.left = cont.left + (cont.width - el_width) / 2;
								break;
							case "right":
								el_pos.left = cont.left + cont.width - el_width - 5;
								break;
							default:
								el_pos.left = cont.left;
								break;
						}
				} else {
						el_pos.left = cont.left + parseInt(def_settings.left);
				}

				if( $(def_settings.offsetTo).length > 0) {
					var rel_pos		= {};
					rel_pos.left 	= 0;
					rel_pos.top		= 0;

					rel_pos 	= $.element_pro(def_settings.offsetTo);	
					if(isNaN(def_settings.top)) el_pos.top 	= rel_pos.top; else el_pos.top = rel_pos.top + parseInt(def_settings.top);
					if(isNaN(def_settings.left)) el_pos.left = rel_pos.left; else el_pos.left = rel_pos.left + parseInt(def_settings.left);
				}
				
				// think about  out of boundary;
				if( el_pos.left	<= 0 ) 	el_pos.left = 5;
				if( el_pos.top	<= 0 ) 	el_pos.top	= 5;
				return el_pos;
	}
});
/*** End of JQuery Common Funcion ***/

// add error handler here 
var errMsg;
function errorHandler(req) {
	switch(req.errorCode) {
		case 0:
			break;
		case 1:
		case 3001:
		case 3002:
		case 3003:
		case 3004:
		case 3005:
		case 3006:
			if(errMsg) errMsg.show(req.errorMessage.nl2br());
			break;
		case 990:
			if(errMsg) errMsg.show(req.errorMessage.nl2br());
			break;
		case 999: 
			if(errMsg) {
				$("span.wmliu-common-error-text", $(errMsg)).html(req.errorMessage.nl2br());
				$(errMsg).divBoxShow({
					after: function() {
						var url = req.errorField;
						if(url && url!="") window.location.href = url;
					}
				});
			}
			break;
	}
}


/***************** Cookies *****************************************/
function setCookie(name, value) {
    var argv = setCookie.arguments;
    var argc = setCookie.arguments.length;
    var expires = (argc > 2) ? argv[2] : 365;
    if(expires!=null) {
        var LargeExpDate = new Date ();
        LargeExpDate.setTime(LargeExpDate.getTime() + (expires*1000*3600*24));        
    }
    document.cookie = name + "=" + escape (value)+((expires == null) ? "" : ("; expires=" +LargeExpDate.toGMTString()));
}

function getCookie(Name) {
    var search = Name + "="
    if(document.cookie.length > 0) {
        offset = document.cookie.indexOf(search)
        if(offset != -1) {
            offset += search.length
            end = document.cookie.indexOf(";", offset)
            if(end == -1) end = document.cookie.length
            return unescape(document.cookie.substring(offset, end))
        }
        else return ""
    }
}

function deleteCookie(name) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() - (86400 * 1000 * 1));
    setCookie(name, "", expdate);
} 


var gcommon = {};
gcommon.basic = {
	en : {
		dateType: [{key:"Once", title:"Once"}, {key: "Daily", title:"Daily"}, {key: "Weekly", title:"Weekly"}, {key: "Monthly", title:"Monthly"}],
        month_desc: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        month_short: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        day_desc: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
		day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
		days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
	},
	cn : {
		dateType: [{key: "Once", title:"一次"}, {key: "Daily", title:"每天"}, {key: "Weekly", title:"每周"}, {key: "Monthly", title:"每月"}],
        month_desc:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        month_short:    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        day_desc:       ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		day_short:      ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
	},
	tw : {
		dateType: [{key: "Once", title:"一次"}, {key: "Daily", title:"每天"}, {key: "Weekly", title:"每周"}, {key: "Monthly", title:"每月"}],
        month_desc:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        //month_short:     ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
        month_short:    ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        day_desc:       ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		day_short:      ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
		days: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30]
	}
};

gcommon.trans = {
	en : {
		words: {
				 "sch_type": 	"Schedule Type", 
				 "date":	 	"Date", 
				 "start_time":  "Start Time", 
				 "end_time": 	"End Time", 
				 "start_date":  "Start Date", 
				 "end_date":	"End Date", 
				 "time": 		"Time", 
				 "sch_set":		"Schedule Settings",
                 "last_date":   "last_date",
                 "today":       "Today",
                 "na":       	"n/a",
                 "previous month":  "Previous Month",
                 "next month":      "Next Month",
                 "add calendar":    "Add to Calendar",
                 "page":    		"Page",
                 "page size":    	"Size",
                 "navi.first":    	"First Page",
                 "navi.prev":    	"Previous Page",
                 "navi.next":    	"Next Page",
                 "navi.last":    	"Last Page",
                 "navi.loading":    "Data Loading...",
                 "navi.refresh":    "Refresh Data",
	             "navi.perpage":    "Page",

                 "total":    		"Total",
                 "search":    		"Search",
				 "delete":			"Delete",
				 "edit":			"Edit",
				 "subject":			"Title",
				 "subject en":		"Title EN",
				 "subject cn":		"Title CN",
				 "desc":			"Description",
				 "desc en":			"Detail EN",
				 "desc cn":			"Detail CN",
				 "next":			"Next",
				 "previous":		"Previous",
				 "save":			"Save",
				 "crop image":		"Crop Image",
				 "save cut":		"Save Image",
				 "reset image":		"Restore Image",
				 "input errorMsg":	"Data can't be processed for below reason",
				 "image url":		"Image URL",
				 "upload.invalid.files": "Selected files can't be uploaded for invalid",
				 "save success":	"Save Success",
				 "add success":		"Add Success",
				 "delete success":	"Delete Success",
				 "submit success":  "Submit Success",
				 "reset success":  "Cancel Change Success",
				 "from":			"From",
				 "to":				"To",
				 "upload":			"Upload",
				 "add images":		"Add Images",
				 "allow to upload": "Allow to Upload",
				 "view image":		"View Large Image",
				 "max":				"Max",
				 "images":			" Images",
				 "select images":   "Select Images",
				 "or":				"OR",
				 "drag and drop images from your computer":	"drag and drop images from your computer",
				 "select up to": 	"select up to",
				 "images each time":"images each time",
				 "is already in the upload list":	"is already in the upload list",
				 "is over the maximum size":"is over the maximum size",
				 "is not allowed to upload": "is not allowed to upload",
				 "button.save": 	"Save",
				 "button.delete":	"Delete",
				 "button.add":		"Add",
				 "button.detail":	"Detail",
				 "button.cancel":	"Cancel",
				 "button.print":	"Print",
				 "button.output":	"Output",
				 "selected":		"Selected Item",
				 "no item":			"No Item",
				 "no value":		"has no value",
				 "remove all":      "Remove All",
				 "remove filter":   "Remove Search Keyword",
				 "sort.list":   	"Sort List",
				 "are you sure":    "Are you sure delete this record ?"
		}
	},
	cn : {
		words: {
				 "sch_type": 	"日期类型", 
				 "date":	 	"日期", 
				 "start_time":  "开始时间", 
				 "end_time": 	"结束时间", 
				 "start_date":  "开始日期", 
				 "end_date":	"结束日期", 
				 "time": 		"时间", 
				 "sch_set":		"日期时间设置",
                 "last_date":   "最后一天",
                 "today":       "今天",
                 "na":       	"无效",
                 "previous month":  "上一个月",
                 "next month":      "下一个月",
                 "add calendar":    "添加事件到日历",
                 "page":    		"分页",
                 "page size":    	"每页",
                 "navi.first":    	"第一页",
                 "navi.prev":    	"前一页",
                 "navi.next":    	"下一页",
                 "navi.last":    	"最后一页",
                 "navi.loading":    "正在提取数据...",
	             "navi.refresh":    "刷新数据",
	             "navi.perpage":    "每页",
                 
				 "total":    		"总共",
                 "search":    		"搜索内容",
				 "delete":			"删除",
				 "edit":			"编辑",
				 "subject":			"标题",
				 "desc":			"描述",
				 "subject en":		"英文标题",
				 "desc en":			"英文描述",
				 "subject cn":		"中文标题",
				 "desc cn":			"中文描述",
				 "next":			"下一个",
				 "previous":		"上一个",
				 "save":			"保存",
				 "crop image":		"剪切图片",
				 "save cut":		"保存图片",
				 "reset image":		"复原照片",
				 "input errorMsg":	"数据不能被处理由于以下原因",
				 "image url":		"图片网址链接",
				 "upload.invalid.files": "以下所选的文件不符合规定",
				 "save success":	"保存成功",
				 "add success":		"新增成功",
				 "delete success":	"删除成功",
				 "submit success":  "提交成功",
				 "reset success":  	"取消完成",
				 "from":			"从",
				 "to":				"到",
				 "upload":			"上传",
				 "add images":		"添加照片",
				 "view image":		"查看放大照片",
				 "allow to upload": "允许上传",
				 "max":				"最多",
				 "images":			" 照片",
				 "select images":   "选择照片",
				 "or":				"或者",
				 "drag and drop images from your computer":	"选择你的照片鼠标拖拽到这里",
				 "select up to": 	"每次最多选择",
				 "images each time":"照片上传",
				 "is already in the upload list":	"照片已经在上传队列里",
				 "is over the maximum size":"照片大小超过了允许的大小",
				 "is not allowed to upload": "不允许上传",
				 "button.save": 	"保存",
				 "button.delete":	"删除",
				 "button.add":		"新增",
				 "button.detail":	"查看详细",
				 "button.cancel":	"取消",
				 "button.print":	"打印",
				 "button.output":	"导出",
				 "selected":		"已选项目",
				 "no item":			"没有任何项目",
				 "no value":		"没有设置任何值",
				 "remove all":      "清除选择",
				 "remove filter":   "清除搜索字",
				 "sort.list":   	"列表排序",
				 "are you sure":    "你确定要删除吗 ?"
		}
	},
	tw : {
		words: {
				 "sch_type": 	"日期类型", 
				 "date":	 	"日期", 
				 "start_time":  "开始时间", 
				 "end_time": 	"结束时间", 
				 "start_date":  "开始日期", 
				 "end_date":	"结束日期", 
				 "time": 		"时间", 
				 "sch_set":		"日期时间设置",
                 "last_date":   "最后一天",
                 "today":       "今天",
                 "na":       	"无效",
                 "previous month":  "上一个月",
                 "next month":      "下一个月",
                 "add calendar":    "添加事件到日历",
                 "page":    		"分页",
                 "page size":    	"每页",
                 "navi.first":    	"第一页",
                 "navi.prev":    	"前一页",
                 "navi.next":    	"下一页",
                 "navi.last":    	"最后一页",
                 "navi.loading":    "正在提取数据...",
	             "navi.refresh":    "刷新数据",
	             "navi.perpage":    "每页",

                 "total":    		"总共",
                 "search":    		"输入搜索内容",
				 "delete":			"删除",
				 "edit":			"编辑",
				 "subject":			"标题",
				 "desc":			"描述",
				 "subject en":		"英文标题",
				 "desc en":			"英文描述",
				 "subject cn":		"中文标题",
				 "desc cn":			"中文描述",
				 "next":			"下一个",
				 "previous":		"上一个",
				 "save":			"保存",
				 "crop image":		"剪切图片",
				 "save cut":		"保存图片",
				 "reset image":		"复原照片",
				 "input errorMsg":	"数据不能被处理由于以下原因",
				 "image url":		"图片网址链接",
				 "upload.invalid.files": "以下所选的文件不符合规定",
				 "save success":	"保存成功",
				 "add success":		"新增成功",
				 "delete success":	"删除成功",
				 "submit success": 	"提交成功",
				 "reset success":  	"取消完成",
				 "from":			"从",
				 "to":				"到",
				 "upload":			"上传",
				 "add images":		"添加照片",
				 "allow to upload": "允许上传",
				 "view image":		"查看放大照片",
				 "max":				"最多",
				 "images":			" 照片",
				 "select images":   "选择照片",
				 "or":				"或者",
				 "drag and drop images from your computer":	"选择你的照片鼠标拖拽到这里",
				 "select up to": 	"每次最多选择",
				 "images each time":"照片上传",
				 "is already in the upload list":	"照片已经在上传队列里",
				 "is over the maximum size":"照片大小超过了允许的大小",
				 "is not allowed to upload": "不允许上传",
				 "button.save": 	"保存",
				 "button.delete":	"删除",
				 "button.add":		"新增",
				 "button.detail":	"查看详细",
				 "button.cancel":	"取消",
				 "button.print":	"打印",
				 "button.output":	"导出",
				 "selected":		"已选项目",
				 "no item":			"没有任何项目",
				 "no value":		"没有设置任何值",
				 "remove all":      "清除选择",
				 "remove filter":   "清除搜索字",
				 "sort.list":   	"列表排序",
				 "are you sure":    "你确定要删除吗 ?"
		}
	}
}


//error handle
LWH.cERR = function(opts) {
	$.extend(this.settings, opts);
}
LWH.cERR.prototype = {
	settings: {
		diag: null
	},
	setDiag: function(dd) {
		this.settings.diag = dd;
	},
	set: function(code, msg, ff) {
		msg = msg?msg:"";
		switch(code) {
			case 1:
			case 3001:
			case 3002:
			case 3003:
			case 3004:
			case 3005:
			case 4001:
			case 9002:
					if( $(this.settings.diag).length > 0 ) {
						$(".lwhDiag-content", this.settings.diag).html(msg.nl2br());
						$(this.settings.diag).diagShow(); 
					} else {
						alert("Error Code:" + code + "\nError Message:" + msg);
					}
					break;
			case 9001:
					if( $(this.settings.diag).length > 0 ) {
						$(".lwhDiag-content", this.settings.diag).html(msg.nl2br());
						$(this.settings.diag).diagShow({
															diag_close:  function() {
																window.location.href = ff;
															}
														}); 
					} else {
						alert("Error Code:" + code + "\nError Message:" + msg);
					}
					break;
			default:
					alert("Error Code:" + code + "\nError Message:" + msg);
					break;
		}
	}
}

LWH.cHTML = function() {}
LWH.cHTML.prototype = {
	checkbox_click: function(name) {
		$("input:checkbox[name='" + name + "']").live("click", function(ev) {
			if( $(this).is(":checked") ) {
				$("label[name='" + $(this).attr("name") + "'][value='" + $(this).val() + "']").css("color", "red");
			} else {
				$("label[name='" + $(this).attr("name") + "'][value='" + $(this).val() + "']").css("color", "black");
			}
		});
	},
    checkbox_get: function (name) {
        var ret_val = '';
        ret_val = $("input:checkbox[name='" + name + "']:checked").map(function () { return $(this).val(); }).get().join(",");
        return ret_val;
    },
    checkbox_get1: function (name, attr_name) {
        var ret_val = '';
        ret_val = $("input:checkbox[name='" + name + "']:checked").map(function () { return $(this).attr(attr_name); }).get().join(",");
        return ret_val;
    },
    checkbox_title1: function (name, class_name, attr_name) {
        var ret_val = '';
        $("input:checkbox[name='" + name + "']:checked").each(function (idx, el) {
            var rid = $(el).attr(attr_name);
            var el_ccc = class_name + "[" + attr_name + "='" + rid + "']";
            ret_val += (ret_val == "" ? "" : " ") + (idx + 1) + "." + $(el_ccc).html();
        });
        return ret_val;
    },
    checkbox_set: function (name, vals) {
        $("input:checkbox[name='" + name + "']").attr("checked", false);
		$("label[name='" + name + "']").css("color","black");
        if (vals && vals != "") {
            $.map(vals.split(","), function (n) {
                $("input:checkbox[name='" + name + "'][value='" + n + "']").attr("checked", true);
                $("label[name='" + name + "'][value='" + n + "']").css("color", "red");
            });
        }
    },
    checkbox_set1: function (name, attr_name, vals) {
        $("input:checkbox[name='" + name + "']").attr("checked", false);
        if (vals && vals != "") {
            $.map(vals.split(","), function (n) {
                $("input:checkbox[name='" + name + "'][" + attr_name + "='" + n + "']").attr("checked", true);
            });
        }
    },

    checkbox_clear: function (name) {
        $("input:checkbox[name='" + name + "']").attr("checked", false);
    },
    checkbox_all: function (name) {
        $("input:checkbox[name='" + name + "']").attr("checked", true);
    },

    radio_get: function (name) {
        var ret_val = '0';
        ret_val = $("input:radio[name='" + name + "']:checked").val();
        return ret_val;
    },
    radio_set: function (name, val) {
         $("input:radio[name='" + name + "']").attr("checked", false);
        $("input:radio[name='" + name + "'][value='" + val + "']").attr("checked", true);
    },
    radio_clear: function (name) {
        $("input:radio[name='" + name + "']").attr("checked", false);
    }

}

