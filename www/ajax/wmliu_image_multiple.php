<?php
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/file/uploadImage.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");

	$upload = new DOWNLOADIMAGE($db, $_REQUEST["schema"], $DLang);
	if( $_REQUEST["schema"]["imgid"] != "" ) {
		$refid = $upload->imgid2refid($_REQUEST["schema"]["imgid"]);
	} else {
		$_REQUEST["schema"]["imgid"] = $upload->MainID(); 
	}
	$_REQUEST["schema"]["ref_id"] = $_REQUEST["schema"]["ref_id"]?$_REQUEST["schema"]["ref_id"]:$refid;
	$upload->refid($_REQUEST["schema"]["ref_id"]);

	$response["data"]["schema"] 	= $_REQUEST["schema"];
	$response["data"]["imgList"] 	= $upload->ImageObjects(); 
	$response["errorCode"] 		    = 0;
	$response["errorMessage"] 	    = "";

	echo json_encode($response);

} catch(Exception $e ) {
	$response["data"]["schema"] 	= $_REQUEST["schema"];
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>