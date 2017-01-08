<?php
class cIMAGE {
		//Support image type.
		public static $image_type = array("JPG", "JPEG", "PNG", "BMP", "GIF");
		public static $image_html = array("JPG"=>"image/jpeg", "JPEG"=>"image/jpeg", "PNG"=>"image/png", "BMP"=>"image/bmp", "GIF"=>"image/gif");
		public $error = null;
		public $path;

		function __construct() {
			$pnum 	= func_num_args();
			$params	= func_get_args();
			switch($pnum) {
				case 1:
				$this->path = $params[0];
				break;
			}
			$this->error = new cERR();
		}

		function save($filepath) {
			$this->validate($filepath);
			$path_parts = pathinfo($filepath);
			$new_path =  $CFG["upload_path"] . "/" . $this->path . "/original/" .  $path_parts["basename"];
			copy($filepath, $new_path);
		}
		
		function validate($fn) {
			$path_parts = pathinfo($fn);
			$ext = strtoupper($path_parts["extension"]);
			if( in_array($ext, cIMAGE::$image_type) ) {
				return true;
			} else {
				$this->error->set(100, "File Ext not allowed.");
				throw $this->error;
			}
		}
		
		// $arr["small"] = array( "ww"=>100, "hh"=>200 ); 
		function resize($fn, $arr) {
			global $CFG;
			$this->validate($fn);
			
			$path_parts = pathinfo($fn);
			foreach($arr as $key=>$val) {
				$new_fn 	= $CFG["upload_path"] . "/" . $this->path . "/" . $key . "/" . $path_parts["filename"] . ".jpg";				
				$this->image_resize($fn, $new_fn, $val["ww"], $val["hh"]);
			}
		}

		function saveByID($fn, $rid, $arr) {
			global $CFG;
			//echo "file:" . $fn . "\n";
			foreach($arr as $key=>$val) {
				$new_fn 	= $CFG["upload_path"] . "/" . $this->path . "/" . $key . "/" . $rid . ".jpg";				
				//echo "new file:" . $new_fn . "\n";
				$this->image_resize($fn, $new_fn, $val["ww"], $val["hh"]);
			}
		}

		function savedb($table, $rid, $fn, $arr) {
			global $CFG;
			$this->validate($fn);
			$db_image = new cMYSQL($CFG["mysql"]["host"],$CFG["mysql"]["user"], $CFG["mysql"]["pwd"],$CFG["mysql"]["database"]);
			$path_parts = pathinfo($fn);
			$fields = array();
			$fields["ref_id"] 		= $rid;
			$fields["file_name"] 	= $path_parts["filename"];
			$fields["file_path"] 	= $fn;
			$fields["file_url"] 	= "";
			$fields["file_type"] 	= "jpg";
			$fields["status"] 		= 1;
			$fields["deleted"] 		= 0;
			$fields["created_time"] = time();				
			$image_id = $db_image->insert($table, $fields);
			
			foreach($arr as $key=>$val) {
				$new_fn 	= $CFG["upload_path"] . "/" . $this->path . "/" . $key . "/" . $path_parts["filename"] . ".jpg";				
				$fields = array();
				$this->image_resize($fn, $new_fn, $val["ww"], $val["hh"]);
				$fields[$key] = file_get_contents($new_fn);
				unlink($new_fn);
				//$fields[$key] = file_get_contents($fn);
				$db_image->update($table, $image_id, $fields);
			}
			return $image_id;
		}
		
		function getImage($table, $size, $id) {
			global $CFG;
			$db_image = new cMYSQL($CFG["mysql"]["host"],$CFG["mysql"]["user"], $CFG["mysql"]["pwd"],$CFG["mysql"]["database"]);
			$result_image = $db_image->query("SELECT id, file_name, file_type, $size FROM $table WHERE deleted <> 1 AND id = $id");
			$row_image = $db_image->fetch($result_image);
			
			$filename = $row_image["file_name"] . "." . $row_image["file_type"];
			switch($pnum) {
				case 3:
					$filename = $params[2];
			}
			header("Content-Type: image/jpeg");
			header("Content-disposition: attachment; filename=" . $filename );
			echo $row_image[$size];
			exit();
		}

		function getFileByID($id, $size) {
			global $CFG;
			$fn = $CFG["upload_path"] . "/" . $this->path . "/" . $size . "/" . $id . ".jpg";				
			header("Content-Type: image/jpeg");
			header("Content-disposition: attachment; filename=" . $id . ".jpg");
			if(file_exists($fn)) {
				echo file_get_contents($fn);
			} else {
				$fn = $CFG["upload_path"] . "/" . $this->path . "/" . $size . "/noimg.jpg";				
				echo file_get_contents($fn);
			}
			exit();
		}

		function image_del($id) { // $fn = image_id   $new_fn = image full name
			global $CFG;
			$fn = $CFG["upload_path"] . "/" . $this->path . "/large/" . $id . ".jpg";	
			if(file_exists($fn)) unlink($fn);
			$fn = $CFG["upload_path"] . "/" . $this->path . "/medium/" . $id . ".jpg";	
			if(file_exists($fn)) unlink($fn);
			$fn = $CFG["upload_path"] . "/" . $this->path . "/small/" . $id . ".jpg";	
			if(file_exists($fn)) unlink($fn);
			$fn = $CFG["upload_path"] . "/" . $this->path . "/tiny/" . $id . ".jpg";	
			if(file_exists($fn)) unlink($fn);

		}
		
		function image_cut($id, $img_ww, $img_hh, $img_left, $img_top, $arr) { // $fn = image_id   $new_fn = image full name
			global $CFG;
			// verify original file exists
			$fn = $CFG["upload_path"] . "/" . $this->path . "/large/" . $id . ".jpg";	
			if(!file_exists($fn)) {
				$this->error->set(100, "Resize file not exists.");
				throw $this->error;
			}
			$size = getimagesize($fn);
			$org_ww 	= $size[0];
			$org_hh 	= $size[1];
			$rate_ww 	= $org_ww / $img_ww;
			$rate_hh 	= $org_hh / $img_hh;
			
			$org_left   = $rate_ww * $img_left;
			$org_top   	= $rate_hh * $img_top;
			
			foreach( $arr as $key=>$val) {
				$new_ww		= $val["ww"] * $rate_ww;
				$new_hh		= $val["hh"] * $rate_hh;
				$new_img 	= imagecreatetruecolor($new_ww, $new_hh);
				//echo "$new_ww : $new_hh \n";
				$image = imagecreatefromjpeg($fn);
				imagecopyresampled($new_img, $image, 0,0,$org_left,$org_top, $new_ww, $new_hh, $new_ww,$new_hh);
				$new_fn = $CFG["upload_path"] . "/" . $this->path . "/" . $key . "/" . $id . ".jpg";
				imagedestroy($image);
				if(file_exists($new_fn)) unlink($new_fn);
				imagejpeg($new_img, $new_fn);
			}
		}

		
		function image_resize($fn, $new_fn, $ww, $hh) { // $fn = image_id   $new_fn = image full name
			global $CFG;
			// verify original file exists
			if(!file_exists($fn)) {
				$this->error->set(100, "Resize file not exists.");
				throw $this->error;
			}
			$path_parts = pathinfo($fn);
			
			
			$size = getimagesize($fn);
			$org_ww = $size[0];
			$org_hh = $size[1];
			//echo "org width:" . $org_ww . " org height:" . $org_hh;
			if($ww <= 0 || $ww == "") {
				$rate_ww = 1;  
			} else {
				$rate_ww = $org_ww / $ww;
			}
		
			if($hh <= 0 || $hh == "") {
				$rate_hh = 1;
			} else {
				$rate_hh = $org_hh / $hh;
			}
		
			// $rate use for ratio resize image.
			if($rate_ww >= $rate_hh) {
				$rate = $rate_ww;  
			} else {
				$rate = $rate_hh;
			}
			
			if($stretch) {
				//stretch resize image
				$new_ww = ceil($org_ww / $rate_ww);
				$new_hh = ceil($org_hh / $rate_hh);
			} else {
				//ratio resize image
				$new_ww = ceil($org_ww / $rate);
				$new_hh = ceil($org_hh / $rate);
			}	
			
			//echo " new ww:" . $new_ww . "  hh:" . $new_hh;
			$new_img = imagecreatetruecolor($new_ww, $new_hh);
			switch( strtoupper($path_parts["extension"]) ) {
				case "JPG":
				case "JPEG":
					$image = imagecreatefromjpeg($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);
					break;
		
				case "PNG":
					$image = imagecreatefrompng($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);
					break;
		
				case "BMP":
					$image = $this->ImageCreateFromBMP($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);
					break;
		
				case "GIF":
					$image = imagecreatefromgif($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);
					break;
			}
			imagedestroy($image);
			if(file_exists($new_fn)) unlink($new_fn);
			imagejpeg($new_img, $new_fn);
		}

		function ImageCreateFromBMP($filename) {
		   if (! $f1 = fopen($filename,"rb")) return FALSE;
		
		   $FILE = unpack("vfile_type/Vfile_size/Vreserved/Vbitmap_offset", fread($f1,14));
		   if ($FILE['file_type'] != 19778) return FALSE;
		
		   $BMP = unpack('Vheader_size/Vwidth/Vheight/vplanes/vbits_per_pixel'.
						 '/Vcompression/Vsize_bitmap/Vhoriz_resolution'.
						 '/Vvert_resolution/Vcolors_used/Vcolors_important', fread($f1,40));
		   $BMP['colors'] = pow(2,$BMP['bits_per_pixel']);
		   if ($BMP['size_bitmap'] == 0) $BMP['size_bitmap'] = $FILE['file_size'] - $FILE['bitmap_offset'];
		   $BMP['bytes_per_pixel'] = $BMP['bits_per_pixel']/8;
		   $BMP['bytes_per_pixel2'] = ceil($BMP['bytes_per_pixel']);
		   $BMP['decal'] = ($BMP['width']*$BMP['bytes_per_pixel']/4);
		   $BMP['decal'] -= floor($BMP['width']*$BMP['bytes_per_pixel']/4);
		   $BMP['decal'] = 4-(4*$BMP['decal']);
		   if ($BMP['decal'] == 4) $BMP['decal'] = 0;
		
		   $PALETTE = array();
		   if ($BMP['colors'] < 16777216)
		   {
			$PALETTE = unpack('V'.$BMP['colors'], fread($f1,$BMP['colors']*4));
		   }
		
		   $IMG = fread($f1,$BMP['size_bitmap']);
		   $VIDE = chr(0);
		
		   $res = imagecreatetruecolor($BMP['width'],$BMP['height']);
		   $P = 0;
		   $Y = $BMP['height']-1;
		   while ($Y >= 0)
		   {
			$X=0;
			while ($X < $BMP['width'])
			{
			 if ($BMP['bits_per_pixel'] == 24)
				$COLOR = unpack("V",substr($IMG,$P,3).$VIDE);
			 elseif ($BMP['bits_per_pixel'] == 16)
			 { 
				$COLOR = unpack("n",substr($IMG,$P,2));
				$COLOR[1] = $PALETTE[$COLOR[1]+1];
			 }
			 elseif ($BMP['bits_per_pixel'] == 8)
			 { 
				$COLOR = unpack("n",$VIDE.substr($IMG,$P,1));
				$COLOR[1] = $PALETTE[$COLOR[1]+1];
			 }
			 elseif ($BMP['bits_per_pixel'] == 4)
			 {
				$COLOR = unpack("n",$VIDE.substr($IMG,floor($P),1));
				if (($P*2)%2 == 0) $COLOR[1] = ($COLOR[1] >> 4) ; else $COLOR[1] = ($COLOR[1] & 0x0F);
				$COLOR[1] = $PALETTE[$COLOR[1]+1];
			 }
			 elseif ($BMP['bits_per_pixel'] == 1)
			 {
				$COLOR = unpack("n",$VIDE.substr($IMG,floor($P),1));
				if     (($P*8)%8 == 0) $COLOR[1] =  $COLOR[1]        >>7;
				elseif (($P*8)%8 == 1) $COLOR[1] = ($COLOR[1] & 0x40)>>6;
				elseif (($P*8)%8 == 2) $COLOR[1] = ($COLOR[1] & 0x20)>>5;
				elseif (($P*8)%8 == 3) $COLOR[1] = ($COLOR[1] & 0x10)>>4;
				elseif (($P*8)%8 == 4) $COLOR[1] = ($COLOR[1] & 0x8)>>3;
				elseif (($P*8)%8 == 5) $COLOR[1] = ($COLOR[1] & 0x4)>>2;
				elseif (($P*8)%8 == 6) $COLOR[1] = ($COLOR[1] & 0x2)>>1;
				elseif (($P*8)%8 == 7) $COLOR[1] = ($COLOR[1] & 0x1);
				$COLOR[1] = $PALETTE[$COLOR[1]+1];
			 }
			 else
				return FALSE;
			 imagesetpixel($res,$X,$Y,$COLOR[1]);
			 $X++;
			 $P += $BMP['bytes_per_pixel'];
			}
			$Y--;
			$P+=$BMP['decal'];
		   }
		
		   fclose($f1);
		
		 return $res;
		}
}



function base64_encode_image ($path ,$filename,$filetype, $quality) {
    global $CFG;
	global $user_browser;
	$folder = $CFG["upload_path"] . $path; 
	$fullname = $folder . $filename;
	if ( file_exists($fullname) ) {
      	if( $user_browser["browser"] == "ie" && intval($user_browser["version"]) < 8 ) {
				return  $path . $filename;
		} else {
			$image = imagecreatefromjpeg( $fullname );
			do {
				ob_start();
				imagejpeg($image,"",$quality);
				$imgbinary = ob_get_contents();
				ob_end_clean();
			
				error_log( "JPEG Q:" . $quality . " S:" . strlen($imgbinary) );
				$quality = $quality - 10;
			} while ( strlen($imgbinary) > 24000 && $quality >= 0 );
			return 'data:image/' . $filetype . ';base64,' . base64_encode($imgbinary);
		}

	} else {
		error_log( "JPEG path:" . $path . " filename:" . $filename );
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
	$folder = $CFG["upload_path"] . $path; 
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
