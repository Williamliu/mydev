<?php
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");

	$upload = new DOWNLOADIMAGE($db, $_REQUEST["schema"], $DLang);
	$response["data"]["schema"] 	= $_REQUEST["schema"];
	$response["data"]["imgObject"] 	= $upload->ImageObject($_REQUEST["schema"]["imgid"]); 
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