<?php
session_start();
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/lib/session/session.php");

echo $_SERVER['HTTP_USER_AGENT'];
echo "<br>";
echo "<br>";

echo "<pre>";
print_r(get_user_agent());
echo "</pre>";

?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="copyright" content="Copyright Bodhi Meditation, All Rights Reserved." />
		<meta name="description" content="Bodhi Meditation Vancouver Site" />
		<meta name="keywords" content="Bodhi Meditation Vancouver" />
		<meta name="rating" content="general" />
		<meta name="language" content="english" />
		<meta name="robots" content="index" />
		<meta name="robots" content="follow" />
		<meta name="revisit-after" content="1 days" />
		<meta name="classification" content="" />
		<link rel="icon" type="image/gif" href="bodhi.gif" />

		<script type="text/javascript" src="jquery/min/jquery-1.7.2.min.js"></script>
        <script type="text/javascript" src="jquery/min/jquery-ui-1.8.21.custom.min.js"></script>
        <link type="text/css" 		  href="jquery/theme/light/jquery-ui-1.8.21.custom.css" rel="stylesheet" />
        <script type="text/javascript" src="jquery/myplugin/jquery.lwh.common.js"></script>

		<script type="text/javascript" 	src="jquery/myplugin/jquery.lwh.tab.js"></script>
        <link 	type="text/css" 	   href="jquery/myplugin/css/light/jquery.lwh.tab.css" rel="stylesheet" />

		<script type="text/javascript" 	src="jquery/myplugin/jquery.lwh.menu.js"></script>
        <link 	type="text/css" 	   href="jquery/myplugin/css/light/jquery.lwh.menu.css" rel="stylesheet" />

		<link type="text/css" href="theme/light/main.css" rel="stylesheet" />

		<script>
		var _fileList = [];
		function drag(ev) {
				ev.preventDefault();
				console.log("drag type: " + ev.type);
				
		}

		function drop(ev) {
				ev.preventDefault();
				var files = ev.dataTransfer.files;
				console.log(ev.dataTransfer.types);
				console.log(ev.dataTransfer);
				
				console.log("drop type: " + ev.type);
				console.log(files);
				for(var idx = 0; idx < files.length; idx++) {
					_fileList.push(files[idx]);
				}
				console.log(_fileList);
				var str = '';
				for(var idx in _fileList) {
					var fileObj = _fileList[idx];
					str += fileObj.name + " : " + fileObj.type + " : " + fileObj.size;
					str += "<br>";
				}
				$("#aabb").html(str);
		
		}
		
		$(function(){
			var files = $("#fff")[0];
			console.log(files);
/*
$("#fff").change(function(e){
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(e.target.files[0]);
	console.log(url);
    var img = new Image();
    img.src = url;


    img.onload = function() {

            img_width = img.width;
            img_height = img.height;
			var ctx = document.getElementById('canvas').getContext('2d');

            ctx.drawImage(img, 0, 0, img_width, img_height);

    }


});		
*/
		});
	

		function show() {
			var files = $("#fff")[0];

			var fs = new FileReader();
			
			fs.onloadstart = function(ev) {
				console.log("onload start state: " + this.readyState);
				console.log(ev);
				console.log(this.result);
			};

			fs.onload = function(ev) {
				console.log("onload state: " + this.readyState);
				console.log(ev);
				//console.log(this.result);
			};

			fs.onprogress = function(ev) {
				console.log("progress state: " + this.readyState);
				console.log(ev);
			};

			fs.onabort = function(ev) {
				console.log("abort state: " + this.readyState);
				console.log(ev);
				//console.log(this.result);
			};

			fs.onloadend = function(ev) {
				console.log("loadend state: " + this.readyState);
				console.log(files.files[0]);
				var blob = new Blob([ev.target.result], {type:files.files[0].type});
				//console.log(ev.target.result.length);
				var url = window.URL || window.webkitURL
				var src = URL.createObjectURL(blob);
				
				/*
				var fdata = new FormData();
				fdata.append("user", "william liu");
				fdata.append("name", "tom");
				fdata.append("mydata", blob);
				var oReq = new XMLHttpRequest();
				oReq.open("POST", "fupload.php");
				oReq.send(fdata);
				*/
				
				
				//download 
				//var iwin = window.open(src, "new Window");
				//iwin.close();

				
				
				$("#myimg").attr("src", ev.target.result);
				
				
				
				/*
				var a = document.getElementById('mydown');
				a.href = src;
				a.download = files.files[0].name;
				a.click();
				*/
				
				//src = $("#myimg").attr("src", src);	
			};
			
			var furl = fs.readAsDataURL(files.files[0]);
			//fs.abort();

		/*
			
      fs.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
			console.log("onload");
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" width="200" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('aabb').insertBefore(span, null);
        };
      })(files.files[0]);
		*/
		
			/*	
			fdata.append("user", "william liu");
			fdata.append("name", "tom");
			fdata.append("mydata", files.files[0]);
			var oReq = new XMLHttpRequest();
			oReq.open("POST", "fupload.php");
			oReq.send(fdata);
			*/
			console.log(furl);
			//draw();
		}
		
		



		function draw() {
			var canvas = document.getElementById('canvas');
			var ctx = document.getElementById('canvas').getContext('2d');
			var img = new Image();
			var maxww = 300;
			var maxhh = 300;
			
			var canvasCopy = document.createElement("canvas");
			var copyCtx = canvasCopy.getContext("2d");
			
			var fileObj = document.getElementById("fff");
			var url = window.URL || window.webkitURL
			console.log("url createObject");
			var src = URL.createObjectURL(fileObj.files[0]);
			console.log(src);
			src = $("#myimg").attr("src", src);			//img.src = src; 
	//window.open(src);
	
   
    var a = document.getElementById('mydown');
    //var blob = new Blob(data, {type: "application/octet-stream"});
   // var url = window.URL.createObjectURL(blob);
    a.href = src;
    a.download = fileObj.files[0].name;
    a.click();
   
	setTimeout(function(){
        window.URL.revokeObjectURL(src);  
    }, 10);  
			
			img.onload = function(){
				console.log(img.width + " : " + img.height);
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				var ratio = 1;
				if(img.height > maxhh) ratio = maxhh / img.height;
				if(img.width > maxww) ratio = maxww / img.width;
				canvasCopy.width 	= img.width;
				canvasCopy.height 	= img.height;				
				copyCtx.drawImage(img, 0, 0);
												
				canvas.width = img.width * ratio;
				canvas.height = img.height * ratio;
				ctx.drawImage(canvasCopy,0,0, canvasCopy.width, canvasCopy.height, 0,0, canvas.width, canvas.height);
				var mysrc = canvas.toDataURL("image/png");
				
				var BASE64_MARKER = ';base64,';
				
				
				if (mysrc.indexOf(BASE64_MARKER) == -1) {
				
					var parts = mysrc.split(',');
					var contentType = parts[0].split(':')[1];
					var raw = parts[1];
			
					var imgcontent = new Blob([raw], {type: "image/png"});
					console.log("image content:");
					console.log(imgcontent);
				}
		


				var parts = mysrc.split(BASE64_MARKER);
				var contentType = parts[0].split(':')[1];
				var raw = window.atob(parts[1]);
				var rawLength = raw.length;
			
				var uInt8Array = new Uint8Array(rawLength);
			
				for (var i = 0; i < rawLength; ++i) {
					uInt8Array[i] = raw.charCodeAt(i);
				}
				var imgcontent = new Blob([uInt8Array], {type: "application/octet-stream"});
				console.log("image content11:" + imgcontent.type);
				console.log(imgcontent);
				var url = URL.createObjectURL(imgcontent);
				console.log(url);
				//var my = window.open(url);

				var type = imgcontent.type;
				var force_saveable_type = 'image/png';
				var slice = imgcontent.slice || imgcontent.webkitSlice || imgcontent.mozSlice;
				imgcontent = slice.call(imgcontent, 0, imgcontent.size, force_saveable_type);


	

				//$("#myimg").attr("src", url);
			}

		}
		
		function change() {
			$("#uploadArea").html("hello");
			var canvas = document.getElementById('canvas');
			var ctx = canvas.getContext("2d");
			var myimg = ctx.getImageData(0,0, canvas.width, canvas.height);
			canvas.width = 400;
			canvas.height = 400;
			ctx.putImageData(myimg,0,0);
			ctx.putImageData(myimg,200,200);
		}
		
		function ccc(event) {
			event.target.style.width = "400px";
			console.log("click type: " + event.type + " id:" + event.target.files.lenght);
		}
		
		$(function() {
			$("#fff").bind("change", function(ev) {

			//var files = $("#fff")[0];

			var files = (ev.srcElement || ev.target).files;
			for( var idx = 0; idx < files.length; idx++ ) {
			var fs = new FileReader();
			
			fs.onloadstart = function(ev) {
				console.log("onload start state: " + this.readyState);
				console.log(ev);
				console.log(this.result);
			};

			fs.onload = function(ev) {
				console.log("onload state: " + this.readyState);
				console.log(ev);
				//console.log(this.result);
			};

			fs.onprogress = function(ev) {
				console.log("progress state: " + this.readyState);
				console.log(ev);
			};

			fs.onabort = function(ev) {
				console.log("abort state: " + this.readyState);
				console.log(ev);
				//console.log(this.result);
			};

			fs.onloadend = function(ev) {
				console.log("loadend state: " + this.readyState);
				//console.log(files.files[0]);
				//var blob = new Blob([ev.target.result], {type:files.files[0].type});
				//console.log(ev.target.result.length);
				//var url = window.URL || window.webkitURL
				//var src = URL.createObjectURL(blob);
				
				/*
				var fdata = new FormData();
				fdata.append("user", "william liu");
				fdata.append("name", "tom");
				fdata.append("mydata", blob);
				var oReq = new XMLHttpRequest();
				oReq.open("POST", "fupload.php");
				oReq.send(fdata);
				*/
				
				
				//download 
				var iwin = window.open(ev.target.result, "new Window");
				//iwin.close();
				
				//var imghtml = '<img src="' + ev.target.result + '" width="100" />';
				//$("body").append(imghtml);
				//$("#myimg").attr("src", ev.target.result);
				
				
				
				/*
				var a = document.getElementById('mydown');
				a.href = src;
				a.download = files.files[0].name;
				a.click();
				*/
				
				//src = $("#myimg").attr("src", src);	


			}

			var furl = fs.readAsDataURL(files[idx]);
			//fs.abort();


			};
			


		/*
			
      fs.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
			console.log("onload");
          var span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" width="200" src="', e.target.result,
                            '" title="', escape(theFile.name), '"/>'].join('');
          document.getElementById('aabb').insertBefore(span, null);
        };
      })(files.files[0]);
		*/
		
			/*	
			fdata.append("user", "william liu");
			fdata.append("name", "tom");
			fdata.append("mydata", files.files[0]);
			var oReq = new XMLHttpRequest();
			oReq.open("POST", "fupload.php");
			oReq.send(fdata);
			*/
			console.log(furl);
			//draw();

			
			});
		});
		</script>
		
        
        <title>Website Admin Control Panel</title>
</head>
<body style="background-color:#cccccc;">
	<br />
    <div id="aabb"></div>
	<br />
    <form name="qqupload" enctype="multipart/form-data">
	<a style="display:inline-block;position:relative;">Select Files<input id="fff" type="file" name="qqfiles" value="Browser" style="position:absolute;top:0;left:0px; width:200px;  border:1px solid orange; opacity:0;" multiple="multiple"  />Good Morning</a>
    <input type="text" name="lwhname" value="hello world" />
	</form>
    <br />
    <input type="button" onclick="show();" value="Show"  />
    <input type="button" onclick="change();" value="Change"  />
    <br />
    <canvas id="canvas"></canvas>
    <a id="mydown" style="display:none;"></a>
    <div id="uploadArea" ondrop="drop(event)" ondragover="drag(event)" style="display:block; width:400px; height:400px; border:1px solid orange;">
    
    </div>
    
</body>
</html>
