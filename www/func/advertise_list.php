<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/html/html.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");

	/*** your code here ***/
	$ctable				= new TABLE($db, $_REQUEST["schema"]);
	$response["html"] 	= $ctable->toBody();
	$response["schema"]	= $ctable->result["schema"];
	

	/**********************/
	
	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["schema"] 						= $_REQUEST["schema"];
	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   				= $e->getField();
	echo json_encode($response);
}
?>