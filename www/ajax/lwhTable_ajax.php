<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhTable.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");
	$table 		= $_REQUEST["table"];
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $table["navi"]["action"]=="init"?"view":$action;	
	$action = $table["navi"]["action"]=="load"?"view":$action;	
	//include_once("public_a_auth.php");

	/*** Your code here ***/
	$tableObj = new LWHTABLE($db, $table, $DLang);
	$tableObj->action();
	$response["table"]	    			= $tableObj->result;
	$response["errorCode"] 		    	= 0;
	$response["errorMessage"]	    	= "";
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