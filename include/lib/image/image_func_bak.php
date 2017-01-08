<?php
function base64_encode_image ($path ,$filename,$filetype, $quality) {
    global $CFG;
	global $user_browser;
	$folder = $CFG["web_path"] . $path; 
	$fullname = $folder . $filename;
	
	if ( file_exists($fullname) ) {
      	if( $user_browser["browser"] == "ie" && intval($user_browser["version"]) < 8 ) {
				return  $path . $filename;
		} else {
				$image = imagecreatefromjpeg( $fullname );
				ob_start();
				imagejpeg($image,"",$quality);
				$imgbinary = ob_get_contents();
				ob_end_clean();
				return 'data:image/' . $filetype . ';base64,' . base64_encode($imgbinary);
		}

	} else {
		return  $path . $filename;
	}
}

function base64_raw_image ($fullname, $filetype) {
    global $CFG;
	global $user_browser;

	if ( file_exists($fullname) ) {
			if( $user_browser["browser"] == "ie" && intval($user_browser["version"]) < 8 ) {
					return $fullname;
			} else {
					$imgbinary = fread(fopen($fullname, "r"), filesize($fullname));
					return 'data:image/' . $filetype . ';base64,' . base64_encode($imgbinary);
			}
	} else {
			return $fullname;
	}
}
/*
function base64_raw_image1 ($path, $filename, $filetype) {
    global $CFG;
	$folder = $CFG["web_path"] . $path; 
	$fullname = $folder . $filename;
	if ( file_exists($fullname) ) {
     	$imgbinary = fread(fopen($fullname, "r"), filesize($fullname));
	   	return 'data:image/' . $filetype . ';base64,' . base64_encode($imgbinary);
	} else {
		return $path . $filename;
	}
}
*/
?>