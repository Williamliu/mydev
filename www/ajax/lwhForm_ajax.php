<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhForm.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete

	//include_once("public_a_auth.php");



	/*** your code here ***/
	$form 	= $_REQUEST["form"];
	$formObj = new LWHFORM($db, $_REQUEST["form"], $DLang);
	$formObj->action();
	$response["form"]["filter"]  		= $formObj->result["filter"];
	$response["form"]["head"]			= $formObj->result["head"];
	$response["form"]["cols"]  			= $formObj->result["cols"];
	$response["errorCode"] 		    	= $response["form"]["head"]["error"];
	$response["errorMessage"]	    	= $response["form"]["head"]["errorMessage"];
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "Table: " . 		$result["head"]["view"] . " : " . $result["head"]["base"];
	$audit_detail 	= "id: " . 			$_REQUEST["filter"]["id"];
	$audit_detail 	.= "\nError: " . 	$result["head"]["error"];
	$audit_detail 	.= "\nMessage: " . 	$result["head"]["errorMessage"];
	write_audit($audit_action, $audit_table, $audit_detail, 1);
	
	echo json_encode($response);
		
} catch(Exception $e ) {
	$response["form"] 							= $_REQUEST["form"];
	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	 			= $e->getField();
	echo json_encode($response);
}
?>