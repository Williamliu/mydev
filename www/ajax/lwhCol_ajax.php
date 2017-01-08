<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhCol.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	//$action = "checkbox";
	//$_REQUEST["schema"]["action"]="checkbox";	
	//include_once("public_a_auth.php");


	/*** your code here ***/
	$formObj = new LWHCOL($db, $_REQUEST["schema"], $DLang);
	$formObj->action();
	$response["result"]["action"]		= $_REQUEST["schema"]["action"];
	$response["result"]["data"]			= $formObj->result["data"];
	$response["errorCode"] 		    	= 0;
	$response["errorMessage"]	    	= "";
	/**********************/
	echo json_encode($response);
		
} catch(Exception $e ) {
	$response["result"] 				= $_REQUEST["schema"];
	$response["errorCode"] 		    	= $e->getCode();
	$response["errorMessage"] 	    	= $e->getMessage();
	$response["errorLine"] 		    	= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	 	= $e->getField();
	echo json_encode($response);
}
?>