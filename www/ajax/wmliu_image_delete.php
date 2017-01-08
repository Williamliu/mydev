<?php
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");

	$imgid = $_REQUEST["imgid"];
	$db->detach("website_files", $imgid);
	$response["data"]["imgid"] 		= $imgid; 
	$response["errorCode"] 		    = 0;
	$response["errorMessage"] 	    = "";

	echo json_encode($response);

} catch(Exception $e ) {
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>