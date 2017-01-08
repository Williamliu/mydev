<?php
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");


	$max_upload = (int)(ini_get('upload_max_filesize'));
	$max_post = (int)(ini_get('post_max_size'));
	$memory_limit = (int)(ini_get('memory_limit'));
	$upload_mb = min($max_upload, $max_post, $memory_limit);
	$upload_byte = $upload_mb * 1024 * 1024; 
	
	if( $_FILES["blob"]["size"] > $upload_byte || $_FILES["blob"]["error"]>=1 ) {

		$_POST["status"] 				= 3;
		$_POST["imgid"] 				= -1;
		$response["errorCode"] 		    = 1;
		$response["errorMessage"] 	    = '"' . $_POST["name"] . '" is over maximium size [ ' . $upload_mb  . 'MB ]!';

	} else {
		$upload = new UPLOADIMAGE($db, $_FILES["blob"],$_POST, $DLang);
		//if( $_POST["singleImage"] ) {
		//	$imgid = $_POST["imgid"];
		//	$upload->update();
		//} else {
			$upload->save();
			$imgid = $upload->imgid;
		//}
		
		$_POST["status"] 	= 8;
		
		$schema 			= array();
		$schema["lang"]		= $_POST["lang"];
		$schema["filter"] 	= $_POST["filter"];
		$schema["ref_id"] 	= $_POST["ref_id"];
		$schema["mode"] 	= $_POST["mode"];
		$schema["view"] 	= $_POST["view"];
		$schema["noimg"] 	= $_POST["noimg"];
		
		$download 					= new DOWNLOADIMAGE($db, $schema, $DLang);
		$response["data"]["imgObj"]	= $download->ImageObject($imgid); 				
				
		$response["errorCode"] 		    = 0;
		$response["errorMessage"]	    = "";
	}
	
	$response["info"]      	    		= $_POST;
	//$response["file"]      	    	= $_FILES["blob"];

	echo json_encode($response);
	
} catch(Exception $e ) {
	$_POST["status"] 				= 3;
	$_POST["imgid"] 				= -1;
	$response["info"]      	    	= $_POST;
	//$response["file"]      	    	= $_FILES["blob"];
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>