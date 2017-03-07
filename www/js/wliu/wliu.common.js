/**************************************************************/
/**** 				 Data Type Prototype        		    ***/
/**************************************************************/
var GCONFIG = {
	max_upload_size: 	20 * 1024 * 1024,
	image_allow_type: 	["BMP", "JPG", "JPEG", "PNG", "TIF", "GIF"],
	file_allow_type:	["PDF", "XLS", "XLSX", "DOC", "DOCX", "PPT", "PPTX", "TXT", "BMP", "JPG", "JPEG", "PNG", "TIF", "GIF"]
};

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
	return this.replace(/^\s+|\s+$/g, '');
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

String.prototype.toArray = function(sp, case_sense) {
	case_sense = case_sense?case_sense:"origin"; 
	sp = sp?sp:",";
	var bstr = "" + this.toString();
	var barr = bstr.split(sp);
	var narr = [];
	for(var key in barr) {
		switch(case_sense) {
			case "upper":
				narr.push( barr[key].trim().toUpperCase() );
				break;
			case "lower":
				narr.push( barr[key].trim().toLowerCase() );
				break;
			default:
				narr.push( barr[key].trim() );
				break;
		}
	}
	return narr;
}

/*** File Name ***/
String.prototype.fileName = function() {
	return this.toString().replace(/.*(\/|\\)/, "");
}
String.prototype.shortName = function() {
	var name = this.toString().replace(/.*(\/|\\)/, "");
	return name.substr(0,name.lastIndexOf("."));
}
String.prototype.extName = function() {
	return (this.toString().indexOf('.') !== -1)?this.toString().replace(/.*[.]/, '').toLowerCase() :'';
}

String.prototype.subName = function(n) {
	n = n || 10;
	var name = this.toString().fileName();
	if (name.length > n){
			name = name.slice(0, n - 6) + '...' + name.slice(-6);    
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

			return Math.max(bytes, 1).toFixed(1) + ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'][i];          
		}
}

Date.prototype.diff = function(d2) {
   		var t2 = this.getTime();
        var t1 = d2.getTime();
        return parseInt((t2-t1)/(24*3600*1000));
}
Date.prototype.timezone = function() {
	return this.getTimezoneOffset()>=0?"+" + (this.getTimezoneOffset()/60)+":00":"-" + ( Math.abs(this.getTimezoneOffset())/60)+":00";
};


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
/*** End of prototype common function ***/

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function imageAutoFix(img) {
	var i_ww = img.naturalWidth;
	var i_hh = img.naturalHeight;
	var img_rate = i_hh / i_ww;

	var c_ww = 100;
	var c_hh = 100;
	if( parseInt($(img).attr("ww")) && parseInt($(img).attr("hh")) ) {
		c_ww = parseInt($(img).attr("ww"));
		c_hh = parseInt($(img).attr("hh"));
	} else if( parseInt($(img).attr("ww")) ) {
		c_ww = parseInt($(img).attr("ww"));
		c_hh = c_ww * img_rate;
	} else if( parseInt($(img).attr("hh")) ) {
		c_hh = parseInt($(img).attr("hh"));
		c_ww = c_hh / img_rate;
	} 

	//var c_ww = parseInt($(img).attr("ww"))?parseInt($(img).attr("ww")):100;
	//var c_hh = parseInt($(img).attr("hh"))?parseInt($(img).attr("hh")):100;
	
	if( !c_ww && !c_hh ) {
		$(img).css("width", "100%");
	} else { 
		$(img).css("width","");
		if( c_ww && c_hh ) {
			var rate_ww = 1;
			var rate_hh = 1;
			rate_ww = c_ww / img.naturalWidth;
			rate_hh = c_hh / img.naturalHeight;
			var rate = Math.min(rate_ww, rate_hh);
			if(rate < 1) {
				if(rate_ww < rate_hh) {
					i_ww 	= c_ww;
					i_hh 	= c_ww * img_rate;
				} else { 
					i_hh 	= c_hh;
					i_ww	= c_hh / img_rate;
				}
			}
		} else if(sc.ww) {
			i_ww        = c_ww;
			i_hh        = c_ww * img_rate;
		} else if(sc.hh) {
			i_hh        = c_hh;
			i_ww        = c_hh / img_rate;
			img.width   = i_ww;
			img.height  = i_hh;
		}
	} // if

	img.width   = i_ww;
	img.height  = i_hh;  
}
/*****************************/

$.fn.extend({
    hasAttr: function(attrs) {
		if(!attrs || attrs.trim()=="") return false; 
        var flag = true; 
        this.each(function(idx, el){
			var attrArr  = [];
			attrArr.push(attrs);
            var seperate = "";

            if( attrs.indexOf(" ")>=0 ) {
                attrArr = attrs.split(" ");
                seperate = "";
            }
            if( attrs.indexOf(",")>=0 ) {
                attrArr = attrs.split(",");
                seperate = ",";
            }

            var attrStr = "";
            for(var idx in attrArr) {
                if( attrArr[idx].trim()!="" ) {
                    var temp1 = attrArr[idx].trim();
                    var attrName = "";
                    if( temp1.indexOf(" ")>=0 ) {
                        temp2 = temp1.split(" ");
                        for(var idx2 in temp2) {
                            var temp3 = temp2[idx2].trim();
                            attrName += "[" + temp3 + "]";
                        }
                    } else {
                        attrName = "[" + attrArr[idx].trim() + "]";
                    }
                    attrStr += (attrStr?seperate:"") + attrName;
                }
            }
            if(attrStr=="") attrStr="*";
            if( $(el).filter(attrStr).length<=0 ) flag = false;
        });
        return flag;
    },
	addAttr: function(attrName, attrVal) {
       	return this.each(function(idx, el){
			if( attrVal ) 
				$(el).attr(attrName, attrVal)
			else 
				$(el).attr(attrName, "")
        });
	}
})


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