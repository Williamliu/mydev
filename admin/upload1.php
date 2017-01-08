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




		<script type="text/javascript" src="js/jspdf.debug.js"></script>
		<!--
		<script type="text/javascript" src="js/jspdf/libs/FileSaver.js/FileSaver.js"></script>
		<script type="text/javascript" src="js/jspdf/libs/Blob.js/Blob.js"></script>
		<script type="text/javascript" src="js/jspdf/libs/Blob.js/BlobBuilder.js"></script>

		<script type="text/javascript" src="js/jspdf/libs/Deflate/deflate.js"></script>
		<script type="text/javascript" src="js/jspdf/libs/Deflate/adler32cs.js"></script>

		<script type="text/javascript" src="js/jspdf/jspdf.plugin.addimage.js"></script>
		<script type="text/javascript" src="js/jspdf/jspdf.plugin.ie_below_9_shim.js"></script>
		<script type="text/javascript" src="js/jspdf/jspdf.plugin.sillysvgrenderer.js"></script>

		<script type="text/javascript" src="js/jspdf/jspdf.plugin.split_text_to_size.js"></script>
		<script type="text/javascript" src="js/jspdf/jspdf.plugin.standard_fonts_metrics.js"></script>
		-->
		<script>

			// We'll make our own renderer to skip this editor
		var doc = new jsPDF('landscape', 'pt', 'letter');

		$(function() {
			var specialElementHandlers = {
			  '#editor': function(element, renderer) {
				return true;
			  }
			};

			margins = {
				top: 80,
				bottom: 60,
				left: 40,
				width: 522
			};			
			
			doc.fromHTML( $('#render_me')[0], 15, 15, 
				{
			  		'width': 600,
			  		'elementHandlers': specialElementHandlers
				},
			   	function (dispose) {
					// dispose: object with X, Y of the last line add to the PDF 
					// this allow the insertion of new lines after html
				}
			);			//doc.save('Test.pdf');

			//doc.addPage();

			$('#pdf_a').click(function() {
				console.log("save pdf");
			  	doc.save('TestHTMLDoc.pdf');
			});
		});
		
		function show() {
		  doc.save('TestHTMLDoc.pdf');
		}
		</script>
		
        <title>Website Admin Control Panel</title>
</head>
<body style="background-color:#ffffff;">
	<br />
<div id="render_me">

<br />
			<table border="1">
				<colgroup>
                	<col width="40" align="center">
                	<col width="200" align="center">
                	<col width="100" align="center">
            	</colgroup>
               <thead align="center">
                    <tr style="background-color:#cccccc;" align="center">    
                        <th style="color:red;" align="center">Name</th>
                        <th>Age</th>
                        <th>Birthday</th>
                    </tr>
                </thead>
                <tbody>
                        <tr>
                            <td>Dani</td>
                            <td>2012-12-25</td>
                            <td>45</td>
                        </tr>               
                </tbody>
            </table>
            <br />
	        <img src="octocat.jpg" width="80" />
          	<br /><br />
	        <img src="autocat.jpg" width="80" />
          	<br /><br />
            <img src="obama.jpg" width="120" />
          	<br /><br />
            <ul>
	          	<li>Monday</li>
                <li>Tuesday</li>
            	<li>Monday</li>
                <li>Tuesday</li>
            	<li>Monday</li>
                <li>Tuesday</li>
            </ul>

            hello world <br />
            gOOD DKD KDF <BR />    
  <a id="pdf_a" href="http://www.sohu.com">Download Test PDF</a>
</div>

    <div id="aabb"></div>
	<br />
    <form name="qqupload" enctype="multipart/form-data">
	<a style="display:inline-block;position:relative;"><input id="fff" type="file" name="qqfiles" value="Browser" style="position:absolute;top:0;left:0px; width:200px;  border:1px solid orange; opacity:0.5;" multiple="multiple"  />Good Morning</a>
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
