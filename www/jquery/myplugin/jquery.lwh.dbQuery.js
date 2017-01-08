/************************************************************************************/
/*  JQuery Plugin Database Query                            		                */
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-5-15      															*/
/*  Files: 	jquery.lwh.dbQuery.js;  	jquery.lwh.dbQuery.css						*/
/************************************************************************************/
var LWH = LWH || {};
LWH.dbQuery	= function(opts) {
	this.obj = {};
	this.obj.fname = opts.fr;
	this.obj.lname = opts.zh;
	this.show = function() {
		alert("obj:" + this.obj.fname + " : " + this.obj.lname);
	}
}

