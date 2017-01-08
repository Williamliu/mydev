//////////////////////////////////////////////////////////////////////
//  Author: William Liu 
//  Image Zoomable  to zoomin zoomout the image in the image frame
//  
//	Samples:  
//       div imageframe: 
//	     img attr:   width;  height;   maxheight;  maxwidth
//   		<div class="lwhzoom">
//				<img src="images/me_big.jpg"  alt="scarpa" height="200"  width="300" maxheight="600" maxwidth="10000" />
//			</div>
// 			You can setup either width or height attributes. if don't specify maxwidth,  it means infinite.
//   		<div class="lwhzoom">
//				<img src="images/me_big.jpg"  alt="scarpa"  width="300" maxwidth="10000" />
//			</div>
//
//  		$(".lwhzoom").zoomable();
//
//////////////////////////////////////////////////////////////////////
$.extend({
	vborder: function( img_frame, img_el ) {
			if( img_el.position().left > 0 ) {
				img_el.css("left", "0px");
			}
			if(	img_el.position().top > 0 ) {
				img_el.css("top", "0px");
			}
			if( img_el.position().left  + img_el.width() < img_frame.width() ) {
				img_el.css("left", ( img_frame.width() - img_el.width() ) + "px");
			}
			if( img_el.position().top  + img_el.height() < img_frame.height() ) {
				img_el.css("top", ( img_frame.height() - img_el.height() ) + "px");
			}
	},
	zoomin : function( img_frame, img_el) {
				var rate = 1.2;
				// new code				
				var nwidth = 0;
				var nheight = 0;
				if( img_el.attr("maxwidth") > 0 &&  img_el.attr("maxheight") > 0 ) {
					nwidth 	= Math.round( img_el.width() * rate );
					nheight = Math.round( img_el.height() * rate );
				} else if(img_el.attr("maxwidth") > 0) {
					nwidth 	= Math.round( img_el.width() * rate );
					nheight = "auto";
				} else if( img_el.attr("maxheight") > 0 ) {
					nwidth 	= "auto";
					nheight = Math.round( img_el.height() * rate );
				}
				// end of new code
				
				if( img_el.attr("maxwidth") > 0 && img_el.width() >= img_el.attr("maxwidth")) return;
				if( img_el.attr("maxheight") > 0 && img_el.height() >= img_el.attr("maxheight")) return;
				
				
				img_el.css({
					width:	nwidth, 
					height:	nheight,
					top:	Math.round( img_el.position().top - ( (Math.abs(img_el.position().top) + img_frame.height() / 2 ) / img_el.height() ) * img_el.height() * ( rate - 1 )), 
					left:	Math.round( img_el.position().left - ( (Math.abs(img_el.position().left) + img_frame.width() / 2 ) / img_el.width() ) * img_el.width() * ( rate - 1 ))
				});

				/*
				img_el.css({
					width:	Math.round( img_el.width() * rate ),
					height:	Math.round( img_el.height() * rate ),
					top:	Math.round( img_el.position().top - ( (Math.abs(img_el.position().top) + img_frame.height() / 2 ) / img_el.height() ) * img_el.height() * ( rate - 1 )), 
					left:	Math.round( img_el.position().left - ( (Math.abs(img_el.position().left) + img_frame.width() / 2 ) / img_el.width() ) * img_el.width() * ( rate - 1 ))
				});
				*/
				
				$.vborder( img_frame , img_el );
	},
	zoomout: function(img_frame, img_el) {
			var rate = 0.8;
			
			// new code 
			var nwidth = 0;
			var nheight = 0;
			if( img_el.attr("maxwidth") > 0 &&  img_el.attr("maxheight") > 0 ) {
				nwidth 	= Math.round( img_el.width() * rate );
				nheight = Math.round( img_el.height() * rate );
			} else if(img_el.attr("maxwidth") > 0) {
				nwidth 	= Math.round( img_el.width() * rate );
				nheight = "auto";
			} else if( img_el.attr("maxheight") > 0 ) {
				nwidth 	= "auto";
				nheight = Math.round( img_el.height() * rate );
			}
			// end of new code 
			
			if( img_el.width() <= img_frame.width() )  return;
			if( img_el.height() <= img_frame.height() ) return;
			
			
			img_el.css({
				width:	nwidth,
				height:	nheight,
				top:	Math.round( img_el.position().top  - ( (Math.abs(img_el.position().top) + img_frame.height() / 2) / img_el.height() ) * img_el.height() * ( rate - 1 )), 
				left:	Math.round( img_el.position().left - ( (Math.abs(img_el.position().left) + img_frame.width() / 2) / img_el.width()  ) * img_el.width() * ( rate - 1 ))
			});
			if( img_el.width() <= img_frame.width() ) {
				img_el.width( img_frame.width() );
				img_el.css({left:"0px"});
			} 
			if( img_el.height() <= img_frame.height() ) {
				img_el.height( img_frame.height() );
				img_el.css({top:"0px"});
			} 
			$.vborder( img_frame , img_el );
	}
});

$.fn.extend({
	lwhZoom: function() {
		return this.each( function(idx , el){
			// get image 
			var img_frame = $(el);
			var img_el = $(el).children("img").first();
			var photo_frm = $(img_frame.append('<div class="lwhZoom-photo"></div>')[0].lastChild);
			photo_frm.append(img_el);

			// image frame , image  mouse cursor
			img_frame.mouseover(function(){ $(this).css("cursor","crosshair"); });
			img_el.mousedown(function() { $(this).css("cursor","move"); });
			img_el.mouseup(function() { $(this).css("cursor","crosshair"); });


			// append upload, cut, delete button
			img_frame.append('<a class="lwhZoom-button lwhZoom-button-upload" title="Upload"></a>');
			img_frame.append('<a class="lwhZoom-button lwhZoom-button-cut" title="Resize"></a>');
			img_frame.append('<a class="lwhZoom-button lwhZoom-button-delete"  title="Delete"></a>');

			/*
			// append zoomin zoomout image 
			img_frame.append('<a class="lwhZoom-zoomin"></a>');
			img_frame.append('<a class="lwhZoom-zoomout"></a>');
			var img_zoomin = img_frame.children(".lwhZoom-zoomin").first();
			var img_zoomout = img_frame.children(".lwhZoom-zoomout").first();

			// zoomin , zoomout img  event
			img_zoomin.mouseover(function(){ $(this).css("cursor","pointer"); });
			img_zoomout.mouseover(function(){ $(this).css("cursor","pointer"); });
			img_zoomin.click( function() { $.zoomin( img_frame ,  img_el ); });
			img_zoomout.click( function() { $.zoomout( img_frame , img_el ); });
			*/
			
			img_el.draggable({
				stop:function(ev, ui) { 
					//$.vborder( img_frame , img_el);
					$.vborder( photo_frm , img_el);

					//ev.stopPropagation();
					//return false;
				}
			});
			
			photo_frm.mousewheel(function(ev, pos, x, y) {
				if( pos < 0 ) { 
					//$("#debug").html("pos<0:" +  pos + " x:" + x + " y:"  + y + " el:" + ev.clientX ); 
					$.zoomout( $(this) , img_el );
					ev.stopPropagation();
					return false;
				} else {
					//$("#debug").html("pos>=0:" +  pos + " x:" + x + " y:"  + y + " el:" + ev.clientX ); 
					$.zoomin( $(this) , img_el );
					ev.stopPropagation();
					return false;
				}
			});
		});
	}
});