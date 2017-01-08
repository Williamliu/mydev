<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhOption.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");

	$table 		= $_REQUEST["table"];
	$valObj 	= $_REQUEST["valObj"];
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $table["head"]["action"]=="load"?"view":$action;	
	//include_once("public_a_auth.php");

	$tableObj = new LWHOPTION($db, $table, $valObj, $DLang);
	$tableObj->action();
	$response["table"]	    			= $tableObj->result;
	$response["valObj"]	    			= $tableObj->valObj;
	$response["errorCode"] 		    	= 0;
	$response["errorMessage"]	    	= "";
	
	

	/*** your code here ***/
	/*
	$formObj 	= new LWHAJAX($db, $_REQUEST["formData"], $DLang);
	$formObj->action();
	$response["formData"]	    		= $formObj->result["formData"];
	$response["errorCode"] 		    	= $formObj->result["formData"]["schema"]["error"];
	$response["errorMessage"]	    	= $formObj->result["formData"]["schema"]["errorMessage"];
	*/
	/**********************/
	
	echo json_encode($response);
		
} catch(Exception $e ) {
	$response["table"] 							= $_REQUEST["table"];
	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	 			= $e->getField();
	echo json_encode($response);
}
?>