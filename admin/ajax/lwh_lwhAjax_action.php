<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwh_ajaxaction.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $_REQUEST["formData"]["schema"]["action"]=="load"?"view":$action;	
	$action = $_REQUEST["formData"]["schema"]["action"]=="save"?"save":$action;	
	include_once("website_a_auth.php");



	/*** your code here ***/
	$form 	= $_REQUEST["formData"];
	$formObj = new LWHAJAX($db, $_REQUEST["formData"], $DLang);
	$formObj->action();
	$response["formData"]	    		= $formObj->result["formData"];
	$response["errorCode"] 		    	= $formObj->result["formData"]["schema"]["error"];
	$response["errorMessage"]	    	= $formObj->result["formData"]["schema"]["errorMessage"];
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "pptable: " . $result["schema"]["pptable"];
	$audit_table 	.= "\nmmtable: " . $result["schema"]["mmtable"];
	$audit_table 	.= "\nsstable: " . $result["schema"]["sstable"];
	$audit_detail 	= "\npid: " . $result["schema"]["pid"];
	$audit_detail 	.= "\nsid: " . $result["schema"]["sid"];
	$audit_detail 	.= "\nError: " . $result["schema"]["error"];
	$audit_detail 	.= "\nMessage: " . $result["schema"]["errorMessage"];
	write_audit($audit_action, $audit_table, $audit_detail, 1);
	
	echo json_encode($response);
		
} catch(Exception $e ) {
	$response["formData"] 						= $_REQUEST["formData"];
	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	 			= $e->getField();
	echo json_encode($response);
}
?>