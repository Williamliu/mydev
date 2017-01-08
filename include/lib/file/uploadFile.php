<?php
/**
 * Handle file uploads via XMLHttpRequest
 */
class cUPLOAD {
    /**
     * Save the file to the specified path
     * @return boolean TRUE on success
     */
	public static $type = array(
			"jpg" => "image/jpeg",
			"png" => "image/png",
			"pdf" => "application/pdf",
			"xls" => "application/excel"
	);
	public $error = null;
	public $path;
    function save() { 
		global $CFG;
		global $_FILES;
		$filename = "";
		$fullname = "";   
		$pnum 	= func_num_args();
		$params	= func_get_args();
		switch($pnum) {
			case 0:
				$filename = $_REQUEST["ufilename"];
				$fullname = $this->path . "/" . $filename;
				break;
			case 1:
				$filename = $params[0];
				$fullname = $this->path . "/" . $filename;
				break;
			case 2:
				$filename = $params[1];
				$fullname = $params[0] . "/" . $params[1];
				break;
			default:
				$filename = $params[1];
				$fullname = $params[0] . "/" . $params[1];
				break;
		}

		
	    ///////////////////////////////////////////////////////////////////////////////////////////////////////// 
		$ustatus = null;
		$user_agent = get_user_agent();
		if( $user_agent["browser"] == "ie" ) {
		//if (isset($_FILES['ufilename'])) { // not working 
				//IE
			  $pp0 = pathinfo($fullname);
			  $pp1 = pathinfo($_FILES['qqfile']['name']);
			  if( $pp0["extension"]=="" ) $fullname .= "." . strtolower($pp1["extension"]);

			  // debug information for fiddler
			  //$ret_arr["tmp"] = $_FILES; //$_FILES['qqfile']['tmp_name']; 
			  //$ret_arr["dst"] = $CFG["upload_path"]. "/" . $fullname; 

			  $ustatus = move_uploaded_file($_FILES['qqfile']['tmp_name'], $CFG["upload_path"]. "/" . $fullname);	
			  //$ustatus = move_uploaded_file($_FILES['qqfile']['tmp_name'], $CFG["upload_path"]. "/backup/lwh.jpg");	
			  $ret_arr["fileSize"] 	= $this->getSize();
			  
		} else {
			  // None IE
			  $pp0 = pathinfo($fullname);
			  $pp1 = pathinfo($_REQUEST["ufilename"]);
			  if( $pp0["extension"]=="" ) $fullname .= "." . strtolower($pp1["extension"]);

			  $input = fopen("php://input", "r");
			  $temp = tmpfile();
			  $realSize = stream_copy_to_stream($input, $temp);
			  fclose($input);
			  $ret_arr["fileSize"] 	= $realSize;
			  if ($realSize >= $_REQUEST["MAX_FILE_SIZE"] ){            
					$this->error->set(100, cUPLOAD::fileSize($realSize) . " exceed the maximum size:" .  cUPLOAD::fileSize($_REQUEST["MAX_FILE_SIZE"]));
					throw $this->error;
			  }
			  //echo "path:". $CFG["upload_path"]. "/" . $fullname . "\n";
			  $target = fopen($CFG["upload_path"]. "/" . $fullname, "w");        
			  fseek($temp, 0, SEEK_SET);
			  $ustatus = stream_copy_to_stream($temp, $target);
			  if($ustatus<=0) {
					$this->error->set(100, "Fail to save the file");
					throw $this->error;
			  }
			  fclose($target);
		}
		///////////////////////////////////////////////////////////////////////////////////////////////////

		$ret_arr["filePath"] 	= $CFG["upload_path"]. 	"/" . $fullname;
		$ret_arr["fileUrl"] 	= "http://" . $CFG["web_domain"]. 	"/" . $fullname;
		$ret_arr["status"] 		= $ustatus;
        return $ret_arr;
    }

	function savedb($table, $rid) {
		global $CFG;
		$filename = "";
		$fullname = "";   
		$pnum 	= func_num_args();
		$params	= func_get_args();

		$filename = $_REQUEST["ufilename"];
		switch($pnum) {
			case 3:
				$filename = $params[2];
				break;
		}
		$fullname 	= $this->path . "/" . $filename;

		$arr = $this->save($filename);
		
		$path_parts = pathinfo($arr["filePath"]);

		$db_upload = new cMYSQL($CFG["mysql"]["host"],$CFG["mysql"]["user"], $CFG["mysql"]["pwd"],$CFG["mysql"]["database"]);
		$fields = array();
		$fields["ref_id"] 		= $rid;
		$fields["file_name"] 	= $filename;
		$fields["file_path"] 	= $arr["filePath"];
		$fields["file_url"] 	= $arr["fileUrl"];
		$fields["file_type"] 	= strtolower($path_parts["extension"]);
		$fields["status"] 		= 1;
		$fields["deleted"] 		= 0;
		$fields["created_time"] = time();
		/*
		$fp = fopen($arr["filePath"] , 'rb');
		$contents = addslashes(fread($fp, filesize($arr["filePath"])));
		fclose($fp);
		*/
		$fields["file_content"] = file_get_contents($arr["filePath"]);
		$arr["doc_id"] 			= $db_upload->insert($table, $fields);
		return $arr;
	}
	
	function getDocument($table, $id) {
		global $CFG;
		$db_upload = new cMYSQL($CFG["mysql"]["host"],$CFG["mysql"]["user"], $CFG["mysql"]["pwd"],$CFG["mysql"]["database"]);
		$result_upload = $db_upload->query("SELECT * FROM $table WHERE deleted <> 1 AND id = $id");
		$row_upload = $db_upload->fetch($result_upload);

		$filename = $row_upload["file_name"];
		switch($pnum) {
			case 3:
				$filename = $params[2];
		}
		//print_r($row_upload);
		//echo "type:" . cUPLOAD::$type[$row_upload["file_type"]];
		header("Content-Type:" . cUPLOAD::$type[$row_upload["file_type"]] );
		header("Content-disposition: attachment; filename=" . $row_upload["file_name"] );
		echo $row_upload["file_content"];
		exit();
	}
	
	static function fileSize( $bytes ) {
        if( $bytes <= 0 ) return '';
		$i = -1;                                    
        do {
            $bytes = $bytes / 1024;
            $i++;  
        } while ($bytes > 99);
        $narr = array('KB', 'MB', 'GB', 'TB', 'PB', 'EB');
        return round(max($bytes, 0.1), 1) . $narr[$i];          
    }

    function getName() {
        return $_FILES['qqfile']['name'];
    }

    function getSize() {
        return $_FILES['qqfile']['size'];
    }
	
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
}



function get_user_agent() {
	$user_agent = $_SERVER['HTTP_USER_AGENT'];
	$ua['browser']  = '';
	$ua['version']  = 0;
	if (preg_match('/(firefox|opera|applewebkit)(?: \(|\/|[^\/]*\/| )v?([0-9.]*)/i', $user_agent, $m)) {
		$ua['browser']  = strtolower($m[1]);
		$ua['version']  = $m[2];
	}	else if (preg_match('/MSIE ?([0-9.]*)/i', $user_agent, $v) && !preg_match('/(bot|(?<!mytotal)search|seeker)/i', $user_agent)) {
		$ua['browser']  = 'ie';
		$ua['version']  = $v[1];
		if( preg_match('/Trident\/?([0-9.]*)/i', $user_agent, $v) ) {
			$ua['version']  = intval($v[1]) + 4;
		}
	}
	return $ua;
}
?>