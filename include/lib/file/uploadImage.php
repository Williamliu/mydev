<?php
/**
 * Handle file uploads via XMLHttpRequest
 */
class DOWNLOADIMAGE {
	private $db;
	private $dlang;
	private $schema;
	private $modes = array();
	public $error = null;
	public function __construct($db, $schema, $dlang="cn") {
		global $CFG;
		$this->db 				= $db;
		$this->schema			= $schema;
		$this->dlang			= $dlang;
		$this->schema["lang"] 	= $this->schema["lang"]?$this->schema["lang"]:$dlang;
		$this->schema["noimg"] 	= $this->schema["noimg"]?$this->schema["noimg"]:0;

		$this->modes[]			= $this->schema["mode"]?$this->schema["mode"]:"small";
		if( !in_array($this->schema["view"], 	$this->modes) )  $this->modes[] = $this->schema["view"]?$this->schema["view"]:"thumb";		
		if( !in_array("thumb", $this->modes) )  $this->modes[] = "thumb";		
		
		$this->error 			= new cERR();
	}
	
	public function refid($refid) {
		$this->schema["ref_id"] = $refid;
	}
	
	public function imgid2refid($imgid) {
		return WMIMAGE::imgid2refid($this->db, $imgid, $this->schema);
	}
	
	public function ImageObject($imgid) {
		return WMIMAGE::ImageObject($this->db, $imgid, $this->modes, $this->schema);
	}

	public function ImageBase64($imgid,  $mode="small") {
		return WMIMAGE::Base64($this->db, $imgid, $mode, $this->schema["noimg"]);
	}

	public function ImageSRC($imgid, $mode="small") {
		return WMIMAGE::ImageSRC($imgid, $mode);
	}

	public function ImageObjects() {
		return WMIMAGE::ImageObjects($this->db, $this->modes, $this->schema);
	}

	public function ImageSRCs($mode="small") {
		return WMIMAGE::ImageSRCs($this->db, $this->schema, $mode);
	}
	
	public function ImageHTML($imgid, $mode="small") {
		return WMIMAGE::ImageHTML($this->db, $imgid, $mode, $this->schema["noimg"]);
	}

	public function MainID() {
		return WMIMAGE::MainID($this->db, $this->schema);
	}

	public function MainBase64($mode="small") {
		return WMIMAGE::Base64($this->db, $this->MainID(), $mode, $this->schema["noimg"]);
	}

	public function MainSRC($mode="small") {
		return WMIMAGE::MainSRC($this->db, $this->schema, $mode);
	}
	
	public function MainHTML($mode="small") {
		return WMIMAGE::MainHTML($this->db, $this->schema, $mode);
	}

	public function IDList() {
		return WMIMAGE::IDList($this->db, $this->schema);
	}

	public function exist($imgid, $mode="small") {
		return WMIMAGE::exist($this->db, $imgid, $mode);
	}

	public function ImageReset($imgid) {
		$mode 	= "original";
		if( WMIMAGE::exist($this->db, $imgid, $mode) ) {
			WMIMAGE::ImageReset($this->db, $imgid);		
		} else {
			$this->error->set(100, "Reset Image { $imgid } doesn't exists!!!");
			throw $this->error;
		}
	}
	
	public function ImageCrop($imgid, $imgsize, $croppos, $cropsize) { // $fn = image_id   $new_fn = image full name
		$mode 	= "large";
		if( WMIMAGE::exist($this->db, $imgid, $mode) ) {
			WMIMAGE::ImageCrop($this->db, $imgid, $imgsize, $croppos, $cropsize);		
		} else {
			$this->error->set(100, "Crop Image { $imgid } doesn't exists!!!");
			throw $this->error;
		}
	}

}

class UPLOADIMAGE {
	private $db;
	private $dlang;
	private $afile;
	private $fileInfo;
	public $error = null;
	public $imgid = -1;
	public function __construct($db, $afile, $fileInfo, $dlang) {
		$this->db 			= $db;
		$this->afile 		= $afile;
		$this->dlang		= $dlang;
		$this->fileInfo     = $fileInfo;
		$this->error = new cERR();
	}

    function save() { 
		global $CFG;
		$db = $this->db;
		$fields = array();
		$fields[] = "filter";
		$fields[] = "maxno";
		$fields[] = "root_dir";
		$fields[] = "relative_dir";
		$fields[] = "large";
		$fields[] = "medium";
		$fields[] = "small";
		$fields[] = "tiny";
		$fields[] = "thumb";
		
		$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$this->fileInfo["filter"]));
		$rows_uu	= $db->rows($result_uu);
		$row_uu 	= $rows_uu[0];
		$maxno 		= $row_uu["maxno"]?$row_uu["maxno"]:1;

		$result_no 	= $db->select("website_files", "id", array("filter"=>$this->fileInfo["filter"],"ref_id"=>$this->fileInfo["ref_id"], "deleted"=>"0" ));
		if( $db->row_nums($result_no) >= $maxno ) {
			$this->error->set(200, "It only allow to upload $maxno images !");
			throw $this->error;
		}
		
		$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
		$rela_dir	= $row_uu["relative_dir"];
		$full_dir	= join("/", array($root_dir, $rela_dir));

		$original_dir 	= join("/", array($full_dir, "original"));
		$large_dir 		= join("/", array($full_dir, "large"));
		$medium_dir 	= join("/", array($full_dir, "medium"));
		$small_dir 		= join("/", array($full_dir, "small"));
		$tiny_dir 		= join("/", array($full_dir, "tiny"));
		$thumb_dir 		= join("/", array($full_dir, "thumb"));
		$delete_dir 	= join("/", array($full_dir, "delete"));
		
		if (!file_exists($full_dir))		 	mkdir($full_dir);
		if (!file_exists($original_dir)) 		mkdir($original_dir);
		if (!file_exists($large_dir)) 			mkdir($large_dir);
		if (!file_exists($medium_dir)) 			mkdir($medium_dir);
		if (!file_exists($small_dir)) 			mkdir($small_dir);
		if (!file_exists($tiny_dir)) 			mkdir($tiny_dir);
		if (!file_exists($thumb_dir)) 			mkdir($thumb_dir);
		if (!file_exists($delete_dir)) 			mkdir($delete_dir);
		
		
		$query_sn = "SELECT MAX(orderno) as maxsn FROM website_files WHERE deleted <> 1 AND filter='" . $this->fileInfo["filter"] . "' AND ref_id='" . $this->fileInfo["ref_id"] . "'"; 
		$result_sn = $db->query($query_sn);
		$row_sn = $db->fetch($result_sn);
		$msn = $row_sn["maxsn"]+1;
		
		$fields = array();
		$fields["filter"] 	= $this->fileInfo["filter"];
		$fields["ref_id"] 	= $this->fileInfo["ref_id"];
		$fields["orderno"]	= $msn;
		$fields["file_name"]= $this->fileInfo["name"];
		$fields["file_type"]= $this->fileInfo["type"];
		$fields["file_size"]= $this->fileInfo["size"];
		$fields["file_ext"]	= $this->fileInfo["ext"];

		$size = getimagesize($this->afile['tmp_name']);
		$org_ww = $size[0];
		$org_hh = $size[1];
		$fields["file_ww"]	= $org_ww?$org_ww:0;
		$fields["file_hh"]	= $org_hh?$org_hh:0;
		
		$img_id 		= $db->insert("website_files", $fields);
		$this->imgid	= $img_id;
		$img_name 		= $img_id;
		$img_original	= join("/", array($original_dir, $img_name . "." . $this->fileInfo["ext"]));
		move_uploaded_file($this->afile['tmp_name'], $img_original);
		
		
		$img_large		= join("/", array($large_dir, $img_name));
		$img_medium		= join("/", array($medium_dir, $img_name));
		$img_small		= join("/", array($small_dir, $img_name));
		$img_tiny		= join("/", array($tiny_dir, $img_name));
		$img_thumb		= join("/", array($thumb_dir, $img_name));
		
		$size_large 	= explode(",",$row_uu["large"]);
		WMIMAGE::ImageResize($img_original, $img_large, $size_large);


		$size_medium 	= explode(",",$row_uu["medium"]);
		WMIMAGE::ImageResize($img_original, $img_medium, $size_medium);

		$size_small 	= explode(",",$row_uu["small"]);
		WMIMAGE::ImageResize($img_original, $img_small, $size_small);

		$size_tiny 	= explode(",",$row_uu["tiny"]);
		WMIMAGE::ImageResize($img_original, $img_tiny, $size_tiny);

		$size_thumb 	= explode(",",$row_uu["thumb"]);
		WMIMAGE::ImageResize($img_original, $img_thumb, $size_thumb);
    }


    function update($imgid) { 
		global $CFG;
		$db = $this->db;
		$fields = array();
		$fields[] = "filter";
		$fields[] = "maxno";
		$fields[] = "root_dir";
		$fields[] = "relative_dir";
		$fields[] = "large";
		$fields[] = "medium";
		$fields[] = "small";
		$fields[] = "tiny";
		$fields[] = "thumb";
		$filter 	= $db->getVal("website_files","filter", $imgid);
		$ref_id 	= $db->getVal("website_files","ref_id", $imgid);
		$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$filter));
		$rows_uu	= $db->rows($result_uu);
		$row_uu 	= $rows_uu[0];
		
		$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
		$rela_dir	= $row_uu["relative_dir"];
		$full_dir	= join("/", array($root_dir, $rela_dir));

		$original_dir 	= join("/", array($full_dir, "original"));
		$large_dir 		= join("/", array($full_dir, "large"));
		$medium_dir 	= join("/", array($full_dir, "medium"));
		$small_dir 		= join("/", array($full_dir, "small"));
		$tiny_dir 		= join("/", array($full_dir, "tiny"));
		$thumb_dir 		= join("/", array($full_dir, "thumb"));
		$delete_dir 	= join("/", array($full_dir, "delete"));
		
		if (!file_exists($full_dir))		 	mkdir($full_dir);
		if (!file_exists($original_dir)) 		mkdir($original_dir);
		if (!file_exists($large_dir)) 			mkdir($large_dir);
		if (!file_exists($medium_dir)) 			mkdir($medium_dir);
		if (!file_exists($small_dir)) 			mkdir($small_dir);
		if (!file_exists($tiny_dir)) 			mkdir($tiny_dir);
		if (!file_exists($thumb_dir)) 			mkdir($thumb_dir);
		if (!file_exists($delete_dir)) 			mkdir($delete_dir);
		
		
		$query_sn = "SELECT MAX(orderno) as maxsn FROM website_files WHERE deleted <> 1 AND filter='" . $filter . "' AND ref_id='" . $ref_id . "'"; 
		$result_sn = $db->query($query_sn);
		$row_sn = $db->fetch($result_sn);
		$msn = $row_sn["maxsn"]+1;
		
		$fields = array();
		$fields["filter"] 	= $this->fileInfo["filter"];
		$fields["ref_id"] 	= $this->fileInfo["ref_id"];
		$fields["orderno"]	= $msn;
		$fields["file_name"]= $this->fileInfo["name"];
		$fields["file_type"]= $this->fileInfo["type"];
		$fields["file_size"]= $this->fileInfo["size"];
		$fields["file_ext"]	= $this->fileInfo["ext"];

		$size = getimagesize($this->afile['tmp_name']);
		$org_ww = $size[0];
		$org_hh = $size[1];
		$fields["file_ww"]	= $org_ww?$org_ww:0;
		$fields["file_hh"]	= $org_hh?$org_hh:0;
		
		$db->update("website_files", $imgid, $fields);
		$this->imgid	= $img_id;
		$img_name 		= $img_id;
		$img_original	= join("/", array($original_dir, $img_name . "." . $this->fileInfo["ext"]));
		move_uploaded_file($this->afile['tmp_name'], $img_original);
		
		
		$img_large		= join("/", array($large_dir, $img_name));
		$img_medium		= join("/", array($medium_dir, $img_name));
		$img_small		= join("/", array($small_dir, $img_name));
		$img_tiny		= join("/", array($tiny_dir, $img_name));
		$img_thumb		= join("/", array($thumb_dir, $img_name));
		
		$size_large 	= explode(",",$row_uu["large"]);
		WMIMAGE::ImageResize($img_original, $img_large, $size_large);

		$size_medium 	= explode(",",$row_uu["medium"]);
		WMIMAGE::ImageResize($img_original, $img_medium, $size_medium);

		$size_small 	= explode(",",$row_uu["small"]);
		WMIMAGE::ImageResize($img_original, $img_small, $size_small);

		$size_tiny 	= explode(",",$row_uu["tiny"]);
		WMIMAGE::ImageResize($img_original, $img_tiny, $size_tiny);

		$size_thumb 	= explode(",",$row_uu["thumb"]);
		WMIMAGE::ImageResize($img_original, $img_thumb, $size_thumb);
    }


}





class WMIMAGE {
	public static function ImageObject($db, $imgid, $modes, $schema) {
		global $CFG;

		$fields = array("filter", "maxno", "root_dir", "relative_dir", "large", "medium", "small", "tiny", "thumb");
		$filter 	= $db->getVal("website_files","filter", $imgid);
		$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$filter));
		$rows_uu	= $db->rows($result_uu);
		$row_uu 	= $rows_uu[0];

		$fields 	= array("ref_id", "filter", "title_en", "detail_en", "title_cn", "detail_cn", "file_name", "file_type", "file_size", "file_ext", "file_ww", "file_hh", "url", "orderno");
		$result_mm 	= $db->select("website_files", $fields, array("id"=>$imgid, "deleted"=>0));
		$rows_mm	= $db->rows($result_mm);
		$row_mm		= $rows_mm[0];
			
		$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
		$rela_dir	= $row_uu["relative_dir"];
		$parent_dir	= join("/", array($root_dir, $rela_dir));

		$img_ext 	= $row_mm["file_ext"];
		$img_type 	= $row_mm["file_type"];
		$img_name 	= $imgid  . "." . $img_ext;

		$imgObj 			= array();
		$imgObj["id"] 		= $imgid;
		$imgObj["ref_id"] 	= $row_mm["ref_id"];
		$imgObj["name"] 	= $row_mm["file_name"];
		$imgObj["type"] 	= $row_mm["file_type"];
		$imgObj["ext"] 		= $row_mm["file_ext"];
		$imgObj["size"] 	= $row_mm["file_size"];
		$imgObj["ww"] 		= $row_mm["file_ww"];
		$imgObj["hh"] 		= $row_mm["file_hh"];
		$imgObj["title"] 	= $schema["lang"]=="en"?$row_mm["title_en"]:	LANG::trans($row_mm["title_cn"], 	$schema["lang"]); 
		$imgObj["detail"] 	= $schema["lang"]=="en"?$row_mm["detail_en"]:	LANG::trans($row_mm["detail_cn"], 	$schema["lang"]); 
		$imgObj["title_en"] = $row_mm["title_en"];
		$imgObj["detail_en"]= $row_mm["detail_en"];
		$imgObj["title_cn"] = $row_mm["title_cn"];
		$imgObj["detail_cn"]= $row_mm["detail_cn"];
		$imgObj["url"]		= $row_mm["url"];
		$imgObj["orderno"] 	= $row_mm["orderno"];
		
		$imgObj["raw"] 		= array(); 

		$imgObj["src"] 				= array(); 
		$imgObj["src"]["large"] 	= "ajax/wmliu_getimage.php?mode=large&imgid=$imgid";
		$imgObj["src"]["medium"] 	= "ajax/wmliu_getimage.php?mode=medium&imgid=$imgid";
		$imgObj["src"]["small"] 	= "ajax/wmliu_getimage.php?mode=small&imgid=$imgid";
		$imgObj["src"]["tiny"] 		= "ajax/wmliu_getimage.php?mode=tiny&imgid=$imgid";
		$imgObj["src"]["thumb"] 	= "ajax/wmliu_getimage.php?mode=thumb&imgid=$imgid";

		foreach($modes as $mode) {
			$img_dir	= join("/",array($parent_dir, $mode));		
			$img_fname  = join("/", array($img_dir, $img_name));
			$imgObj["raw"][$mode] = WMIMAGE::Base64($db, $imgid, $mode, $schema["noimg"]);
		}
		
		return $imgObj;
	}

	public static function ImageSRC($imgid, $mode="small") {
	   	return "ajax/wmliu_getimage.php?mode=$mode&imgid=$imgid";
	}

	public static function ImageObjects($db, $modes, $schema) {
		$imgList = array();

		if( is_array( $schema["ref_id"] ) ) {	
			// ref_id is array,   get main image list 
			foreach( $schema["ref_id"] as $refid ) {
				$query = "SELECT * FROM website_files WHERE deleted <> 1 AND status = 1 AND filter = '" . $schema["filter"] . "' AND ref_id = '" . $refid . "' ORDER BY main DESC, orderno ASC LIMIT 1;";
				$result = $db->query($query);
				while($row = $db->fetch($result)) {
					$imgList[] = WMIMAGE::ImageObject($db, $row["id"], $modes, $schema);
				}
			}
		} else {
			// if not array,  get ref_id   full list
			$query = "SELECT * FROM website_files WHERE deleted <> 1 AND status = 1 AND filter = '" . $schema["filter"] . "' AND ref_id = '" . $schema["ref_id"] . "' ORDER BY main DESC, orderno ASC;";
			$result = $db->query($query);
			while($row = $db->fetch($result)) {
					$imgList[] = WMIMAGE::ImageObject($db, $row["id"], $modes, $schema);
			} 
		}
		return $imgList;
	}

	public static function ImageSRCs($db, $schema, $mode="small") {
		global $CFG;
		$mode = $mode?$mode:"small";
		$fields = array();
		$fields[] = "filter";
		$fields[] = "maxno";
		$fields[] = "root_dir";
		$fields[] = "relative_dir";
		$fields[] = "large";
		$fields[] = "medium";
		$fields[] = "small";
		$fields[] = "tiny";
		$fields[] = "thumb";
		$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$schema["filter"]));
		$rows_uu	= $db->rows($result_uu);
		$row_uu 	= $rows_uu[0];

		$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
		$rela_dir	= $row_uu["relative_dir"];
		$this->parent_dir	= join("/", array($root_dir, $rela_dir));
		$img_dir			= join("/",array($this->parent_dir, $mode));		

		$query = "SELECT * FROM website_files WHERE deleted <> 1 AND status = 1 AND filter = '" . $schema["filter"] . "' AND ref_id = '" . $schema["ref_id"] . "' ORDER BY main DESC, orderno ASC;";
		$result = $db->query($query);
		$imgList = array();
		while($row = $db->fetch($result)) {
			$img_ext 	= $row["file_ext"];
			$img_name 	= $row["id"]  . "." . $img_ext;
			$img_fname  = join("/", array($img_dir, $img_name));
			if(file_exists($img_fname)) {
				$imgList[] = "ajax/wmliu_getimage.php?mode=$mode&imgid=" . $row["id"];
			} 
		} 
		return $imgList;
	}

	public static function ImageHTML($db, $imgid, $mode="small", $noimg=1) {
		global $CFG;
		$mode 	= $mode?$mode:"small";
		$noimg 	= $noimg?$noimg:0;

		$fields = array();
		$fields[] = "filter";
		$fields[] = "maxno";
		$fields[] = "root_dir";
		$fields[] = "relative_dir";
		$fields[] = "large";
		$fields[] = "medium";
		$fields[] = "small";
		$fields[] = "tiny";
		$fields[] = "thumb";
		$filter 	= $db->getVal("website_files","filter", $imgid);
		$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$filter));
		$rows_uu	= $db->rows($result_uu);
		$row_uu 	= $rows_uu[0];
			
		$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
		$rela_dir	= $row_uu["relative_dir"];
		$parent_dir	= join("/", array($root_dir, $rela_dir));


		$img_dir	= join("/",array($parent_dir, $mode));		
		$img_ext 	= $db->getVal("website_files","file_ext", $imgid );
		$img_type 	= $db->getVal("website_files","file_type", $imgid );
		$img_name 	= $imgid  . "." . $img_ext;

		$img_fname  = join("/", array($img_dir, $img_name));
		
		if(file_exists($img_fname)) {
			header("Content-Type: $img_type");
			echo file_get_contents($img_fname);
		} else {
			if($noimg==1) {
				header("Content-Type: image/png");
				echo file_get_contents( $CFG["include_path"] . "/lib/file/no-image.png" );
			} else { 
				header("HTTP/1.0 404 Image { $img_fname } Not Found");
			}
		}
		exit();
	}

	public static function imgid2refid($db, $imgid, $schema) {
		$refid = "";
		$query = "SELECT id, ref_id FROM website_files WHERE deleted <> 1 AND status = 1 AND filter = '" . $schema["filter"] . "' AND id = '" . $imgid . "';";
		$result = $db->query($query);
		$row = $db->fetch($result);
		$refid = $row["ref_id"]?$row["ref_id"]:"";
		return $refid;
		
	}
	
	public static function MainID($db, $schema) {
		$query = "SELECT id FROM website_files WHERE deleted <> 1 AND status = 1 AND filter = '" . $schema["filter"] . "' AND ref_id = '" . $schema["ref_id"] . "' ORDER BY main DESC, orderno ASC;";
		$result = $db->query($query);
		$row = $db->fetch($result);
		$mainid = $row["id"]?$row["id"]:-1;
		return $mainid;
	}

	public static function MainSRC($schema, $mode="small") {
	   	return "ajax/wmliu_getmainimage.php?filter=" . $schema["filter"] . "&mode=$mode&refid=" . $schema["ref_id"];
	}

	public static function MainHTML($db, $schema, $mode="small") {
		$mainid = WMIMAGE::MainID($db, $schema);
		WMIMAGE::ImageHTML($db, $mainid, $mode, $schema["noimg"]);
	}
	
	public static function IDList($db, $schema) {
		$query = "SELECT * FROM website_files WHERE deleted <> 1 AND status = 1 AND filter = '" . $schema["filter"] . "' AND ref_id = '" . $schema["ref_id"] . "' ORDER BY main DESC, orderno ASC;";
		$result = $db->query($query);
		$imgList = array();
		while($row = $db->fetch($result)) {
				$imgList[] = $row["id"];
		} 
		return $imgList;
	}

	public static function exist($db, $imgid, $mode="small") {
		global $CFG;
		$mode = $mode?$mode:"small";

		$fields = array();
		$fields[] = "filter";
		$fields[] = "maxno";
		$fields[] = "root_dir";
		$fields[] = "relative_dir";
		$fields[] = "large";
		$fields[] = "medium";
		$fields[] = "small";
		$fields[] = "tiny";
		$fields[] = "thumb";
		$filter 	= $db->getVal("website_files","filter", $imgid);
		$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$filter));
		$rows_uu	= $db->rows($result_uu);
		$row_uu 	= $rows_uu[0];
			
		$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
		$rela_dir	= $row_uu["relative_dir"];
		$parent_dir	= join("/", array($root_dir, $rela_dir));


		$img_dir	= join("/",array($parent_dir, $mode));		
		$img_ext 	= $db->getVal("website_files","file_ext", $imgid );
		$img_type 	= $db->getVal("website_files","file_type", $imgid );
		$img_name 	= $imgid  . "." . $img_ext;

		$img_fname  = join("/", array($img_dir, $img_name));
		
		if(file_exists($img_fname)) {
			return true;
		} else {
			return false;
		}
	}

	public static function ImageReset($db, $imgid) {
		global $CFG;
		$mode 	= "original";
		if( WMIMAGE::exist($db, $imgid, $mode) ) {
			$fields = array();
			$fields[] = "filter";
			$fields[] = "maxno";
			$fields[] = "root_dir";
			$fields[] = "relative_dir";
			$fields[] = "large";
			$fields[] = "medium";
			$fields[] = "small";
			$fields[] = "tiny";
			$fields[] = "thumb";
			$filter 	= $db->getVal("website_files","filter", $imgid);
			$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$filter));
			$rows_uu	= $db->rows($result_uu);
			$row_uu 	= $rows_uu[0];
				
			$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
			$rela_dir	= $row_uu["relative_dir"];
			$parent_dir	= join("/", array($root_dir, $rela_dir));
	
			$img_dir	= join("/",array($parent_dir, $mode));		
			$img_ext 	= $db->getVal("website_files","file_ext", $imgid );
			$img_type 	= $db->getVal("website_files","file_type", $imgid );
			$img_name 	= $imgid  . "." . $img_ext;
	
			$img_fname  = join("/", array($img_dir, $img_name));
	
			$original_dir 	= join("/", array($parent_dir, "original"));
			$large_dir 		= join("/", array($parent_dir, "large"));
			$medium_dir 	= join("/", array($parent_dir, "medium"));
			$small_dir 		= join("/", array($parent_dir, "small"));
			$tiny_dir 		= join("/", array($parent_dir, "tiny"));
			$thumb_dir 		= join("/", array($parent_dir, "thumb"));
			$delete_dir 	= join("/", array($parent_dir, "delete"));
			
			if (!file_exists($parent_dir))		 	mkdir($parent_dir);
			if (!file_exists($original_dir)) 		mkdir($original_dir);
			if (!file_exists($large_dir)) 			mkdir($large_dir);
			if (!file_exists($medium_dir)) 			mkdir($medium_dir);
			if (!file_exists($small_dir)) 			mkdir($small_dir);
			if (!file_exists($tiny_dir)) 			mkdir($tiny_dir);
			if (!file_exists($thumb_dir)) 			mkdir($thumb_dir);
			if (!file_exists($delete_dir)) 			mkdir($delete_dir);
			
			$img_name 		=  $imgid;
			$img_large		= join("/", array($large_dir, $img_name));
			$img_medium		= join("/", array($medium_dir, $img_name));
			$img_small		= join("/", array($small_dir, $img_name));
			$img_tiny		= join("/", array($tiny_dir, $img_name));
			$img_thumb		= join("/", array($thumb_dir, $img_name));
			
			$size_large 	= explode(",",$row_uu["large"]);
			WMIMAGE::ImageResize($img_fname, $img_large, $size_large);
	
			$size = getimagesize($img_fname);
			$org_ww = $size[0];
			$org_hh = $size[1];
			$fields = array();
			$fields["file_ww"]	= $org_ww?$org_ww:0;
			$fields["file_hh"]	= $org_hh?$org_hh:0;
			$db->update("website_files", $imgid, $fields);
	
			$size_medium 	= explode(",",$row_uu["medium"]);
			WMIMAGE::ImageResize($img_fname, $img_medium, $size_medium);
	
			$size_small 	= explode(",",$row_uu["small"]);
			WMIMAGE::ImageResize($img_fname, $img_small, $size_small);
	
			$size_tiny 	= explode(",",$row_uu["tiny"]);
			WMIMAGE::ImageResize($img_fname, $img_tiny, $size_tiny);
	
			$size_thumb 	= explode(",",$row_uu["thumb"]);
			WMIMAGE::ImageResize($img_fname, $img_thumb, $size_thumb);
		}  // if file exists
	}


	public static function ImageCrop($db, $imgid, $imgsize, $croppos, $cropsize) { // $fn = image_id   $new_fn = image full name
		global $CFG;
		$mode 	= "large";

		$fields = array();
		$fields[] = "filter";
		$fields[] = "maxno";
		$fields[] = "root_dir";
		$fields[] = "relative_dir";
		$fields[] = "large";
		$fields[] = "medium";
		$fields[] = "small";
		$fields[] = "tiny";
		$fields[] = "thumb";
		$filter 	= $db->getVal("website_files","filter", $imgid);
		$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$filter));
		$rows_uu	= $db->rows($result_uu);
		$row_uu 	= $rows_uu[0];
			
		$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
		$rela_dir	= $row_uu["relative_dir"];
		$parent_dir	= join("/", array($root_dir, $rela_dir));


		$img_dir	= join("/",array($parent_dir, $mode));		
		$img_ext 	= $db->getVal("website_files","file_ext", $imgid );
		$img_type 	= $db->getVal("website_files","file_type", $imgid );
		$img_name 	= $imgid  . "." . $img_ext;

		$img_fname  = join("/", array($img_dir, $img_name));
		
		$size = getimagesize($img_fname);
		$org_ww 	= $size[0];
		$org_hh 	= $size[1];
		$rate_ww	= 1;
		if( $imgsize["w"] > 0) $rate_ww	= $org_ww / $imgsize["w"];
		$rate_hh	= 1;
		if( $imgsize["h"] > 0) $rate_hh = $org_hh / $imgsize["h"];
		
		$crop_x = $croppos["x"] * $rate_ww;
		$crop_y = $croppos["y"] * $rate_hh;
		$crop_w	= $cropsize["w"] * $rate_ww;
		$crop_h	= $cropsize["h"] * $rate_hh;
		
		//if( $crop_x + $crop_w > $org_ww ) $crop_x = $org_ww - $crop_w;
		if( $crop_x < 0 ) $crop_x = 0;

		//if( $crop_y + $crop_h > $org_hh ) $crop_y = $org_hh - $crop_y;
		if( $crop_y < 0 ) $crop_y = 0;
		
		$new_img	= imagecreatetruecolor($crop_w, $crop_h);
		$org_img	= imagecreatefromjpeg($img_fname);

		imagecopyresampled($new_img, $org_img, 0, 0, $crop_x, $crop_y, $crop_w, $crop_h, $crop_w,$crop_h);
		imagedestroy($org_img);
		
		$img_dir	= join("/",array($parent_dir, "large"));	
		$new_fname  = join("/", array($img_dir, $img_name));
			
		if(file_exists($new_fname)) unlink($new_fname);

		switch( strtoupper($img_ext) ) {
			case "JPG":
			case "JPEG":
				imagejpeg($new_img, $new_fname);
				break;
	
			case "PNG":
				imagepng($new_img, $new_fname);
				break;
	
			case "BMP":
				$new_fname  = join("/", array($img_dir, $imgid , ".jpg"));
				imagejpeg($new_img, $new_fname);
				break;
	
			case "GIF":
				imagegif($new_img, $new_fname);
				break;
			case "ICO":
				$new_fname  = join("/", array($img_dir, $imgid , ".jpg"));
				imagejpeg($new_img, $new_fname);
				break;
		}
		
		

		$original_dir 	= join("/", array($parent_dir, "original"));
		$large_dir 		= join("/", array($parent_dir, "large"));
		$medium_dir 	= join("/", array($parent_dir, "medium"));
		$small_dir 		= join("/", array($parent_dir, "small"));
		$tiny_dir 		= join("/", array($parent_dir, "tiny"));
		$thumb_dir 		= join("/", array($parent_dir, "thumb"));
		$delete_dir 	= join("/", array($parent_dir, "delete"));
		
		if (!file_exists($parent_dir))		 	mkdir($parent_dir);
		if (!file_exists($original_dir)) 		mkdir($original_dir);
		if (!file_exists($large_dir)) 			mkdir($large_dir);
		if (!file_exists($medium_dir)) 			mkdir($medium_dir);
		if (!file_exists($small_dir)) 			mkdir($small_dir);
		if (!file_exists($tiny_dir)) 			mkdir($tiny_dir);
		if (!file_exists($thumb_dir)) 			mkdir($thumb_dir);
		if (!file_exists($delete_dir)) 			mkdir($delete_dir);
		
		$img_name 		=  $imgid;
		$img_large		= join("/", array($large_dir, $img_name));
		$img_medium		= join("/", array($medium_dir, $img_name));
		$img_small		= join("/", array($small_dir, $img_name));
		$img_tiny		= join("/", array($tiny_dir, $img_name));
		$img_thumb		= join("/", array($thumb_dir, $img_name));
		
		$size_large 	= explode(",",$row_uu["large"]);
		WMIMAGE::ImageResize($new_fname, $img_large, $size_large);

		$size = getimagesize($new_fname);
		$org_ww = $size[0];
		$org_hh = $size[1];
		$fields = array();
		$fields["file_ww"]	= $org_ww?$org_ww:0;
		$fields["file_hh"]	= $org_hh?$org_hh:0;
		$db->update("website_files", $imgid, $fields);

		$size_medium 	= explode(",",$row_uu["medium"]);
		WMIMAGE::ImageResize($new_fname, $img_medium, $size_medium);

		$size_small 	= explode(",",$row_uu["small"]);
		WMIMAGE::ImageResize($new_fname, $img_small, $size_small);

		$size_tiny 	= explode(",",$row_uu["tiny"]);
		WMIMAGE::ImageResize($new_fname, $img_tiny, $size_tiny);

		$size_thumb 	= explode(",",$row_uu["thumb"]);
		WMIMAGE::ImageResize($new_fname, $img_thumb, $size_thumb);
	}

	
	/********** common image function ****************/
	public static function Base64($db, $imgid, $mode="small", $noimg=1) {
		global $CFG;
		$mode 	= $mode?$mode:"small";
		$noimg  = $noimg?$noimg:0;

		$fields = array("filter", "maxno", "root_dir", "relative_dir", "large", "medium", "small", "tiny", "thumb");
		$filter 	= $db->getVal("website_files","filter", $imgid);
		$result_uu 	= $db->select("website_upload", $fields, array("filter"=>$filter));
		$rows_uu	= $db->rows($result_uu);
		$row_uu 	= $rows_uu[0];
			
		$root_dir	= $row_uu["root_dir"]?$row_uu["root_dir"]:$CFG["upload_path"];
		$rela_dir	= $row_uu["relative_dir"];
		$parent_dir	= join("/", array($root_dir, $rela_dir));


		$img_dir	= join("/",array($parent_dir, $mode));		
		$img_ext 	= $db->getVal("website_files","file_ext", $imgid );
		$img_type 	= $db->getVal("website_files","file_type", $imgid );
		$img_name 	= $imgid  . "." . $img_ext;

		$img_fname  = join("/", array($img_dir, $img_name));
		//echo "fname: " . $img_fname . "\n";
		$ret_img 	= '';
			
		if(file_exists($img_fname)) {
			$img_raw = file_get_contents($img_fname);
			$ret_img = 'data:' . $img_type . ';base64,' . base64_encode($img_raw);
		} else {
			if($noimg==1) {
				$img_type = 'image/png';
				$img_raw = file_get_contents( $CFG["include_path"] . "/lib/file/no-image.png" );
				$ret_img = 'data:' . $img_type . ';base64,' . base64_encode($img_raw);
			} else { 
				$img_raw = "";
				$ret_img = $img_raw;
			}
		}
	   	return $ret_img;
	}
	
	public static function ImageResize($fn, $new_fn, $size) { // $fn = image_id   $new_fn = image full name
			// verify original file exists
			if(!file_exists($fn)) {
				return;
			}
			$path_parts = pathinfo($fn);
			
			$ww = $size[0]?$size[0]:0;
			$hh = $size[1]?$size[1]:0;
			
			$size = getimagesize($fn);
			$org_ww = $size[0];
			$org_hh = $size[1];
			//echo "org width:" . $org_ww . " org height:" . $org_hh;
			$rate_ww = 1;
			if($org_ww > $ww && $ww > 0 ) $rate_ww = $ww / $org_ww;
			$rate_hh = 1;
			if($org_hh > $hh && $hh > 0 ) $rate_hh = $hh / $org_hh;
			$rate = min($rate_ww, $rate_hh);
			
			$new_ww = ceil($org_ww * $rate);
			$new_hh = ceil($org_hh * $rate);
			
			//echo " new ww:" . $new_ww . "  hh:" . $new_hh;
			$new_img = imagecreatetruecolor($new_ww, $new_hh);
			switch( strtoupper($path_parts["extension"]) ) {
				case "JPG":
				case "JPEG":
					$image = imagecreatefromjpeg($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);
					
					$new_fn = $new_fn . ".jpg";
					imagedestroy($image);
					if(file_exists($new_fn)) unlink($new_fn);
					imagejpeg($new_img, $new_fn);
					break;
		
				case "PNG":
					$image = imagecreatefrompng($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);

					$new_fn = $new_fn . ".png";
					imagedestroy($image);
					if(file_exists($new_fn)) unlink($new_fn);
					imagepng($new_img, $new_fn);
					break;
		
				case "BMP":
					$image = WMIMAGE::ImageCreateFromBMP($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);

					$new_fn = $new_fn . ".jpg";
					imagedestroy($image);
					if(file_exists($new_fn)) unlink($new_fn);
					imagejpeg($new_img, $new_fn);
					break;
		
				case "GIF":
					$image = imagecreatefromgif($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);

					$new_fn = $new_fn . ".gif";
					imagedestroy($image);
					if(file_exists($new_fn)) unlink($new_fn);
					imagegif($new_img, $new_fn);
					break;
				case "ICO":
					$image = imagecreatefromgif($fn);
					imagecopyresampled($new_img, $image, 0,0,0,0, $new_ww, $new_hh, $org_ww,$org_hh);

					$new_fn = $new_fn . ".jpg";
					imagedestroy($image);
					if(file_exists($new_fn)) unlink($new_fn);
					imagejpeg($new_img, $new_fn);
					break;
			}
	}  // end of ImageResize

	public static function ImageCreateFromBMP($filename) {
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
	} // end of BMP

}
?>