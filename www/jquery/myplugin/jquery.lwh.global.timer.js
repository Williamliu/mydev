/************************************************************************************/
/*  JQuery Plugin Global Timer                    		                        	*/
/*  Author:	William Liu                                                            	*/
/*  Date: 	2012-2-21     															*/
/*  Files: 	jquery.lwh.global.timer.js;												*/
/************************************************************************************/
var LWH = LWH || {};

LWH.timerClass	= function( opts ) {
		var def_settings = {
				meObj:			"",
				interval:		1000,
				init:			null,
				func:			null
		};
		$.extend(def_settings, opts);
		this.meObj		= def_settings.meObj;
		this.interval 	= def_settings.interval;
		this.init		= def_settings.init;
		this.func		= def_settings.func;
		
		this.timer		= null;
		this.first		= true;
		this.doing		= false;
		this.count		= 0;
};

LWH.timerClass.prototype.start = function(){
		this.stop();
		this.timer = setTimeout(this.meObj + ".loop()", this.interval);
};

LWH.timerClass.prototype.stop = function(){
	this.doing 		= false;
	if(this.timer != null) {
		clearTimeout(this.timer);
		this.timer = null;
	}
}


LWH.timerClass.prototype.loop = function() {
	if( this.first ) {
		this.first = false;
		if(this.init != null) {
			this.init();
		}
	}
	if(this.func != null) {
			//alert(this.meObj + " - execute loop:" + this.count);
			if( !this.doing ) {
					this.doing = true;
					this.count++;
					this.func();
					this.doing = false;
					this.timer = setTimeout(this.meObj + ".loop()", this.interval);
			}
	} else {
			this.stop();
	}
}

// will block for a while
function sleep(milliSeconds){
	var startTime = new Date().getTime(); // get the current time
	while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}


