<?php
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");

	$imgid 	= $_REQUEST["imgid"];
	if($imgid > 0) {
		$fields	= array();
		$fields["title_en"] 	= $_REQUEST["title_en"];
		$fields["detail_en"] 	= $_REQUEST["detail_en"];
		$fields["title_cn"] 	= $_REQUEST["title_cn"];
		$fields["detail_cn"] 	= $_REQUEST["detail_cn"];
		$fields["url"] 			= $_REQUEST["url"];
		
		$result = $db->update("website_files", $imgid, $fields);

		$response["errorCode"] 		    = 0;
		$response["errorMessage"] 	    = "";
	} else {
		$response["errorCode"] 		    = 1;
		$response["errorMessage"] 	    = "Please select an image first !";
	}
	$response["data"]["imgid"] 		= $imgid; 

	echo json_encode($response);

} catch(Exception $e ) {
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>