<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_search.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwh_ajaxread.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $_REQUEST["schema"]["action"]=="load"?"view":$action;	
	//include_once("website_a_auth.php");

	/*** your code here ***/
	$ajax 						= new LWHREAD($db, $_REQUEST["schema"], $DLang);
	$ajax->action();
	$response["data"]	    	= $ajax->result;
	$response["errorCode"] 		= $ajax->result["schema"]["error"];
	$response["errorMessage"]	= $ajax->result["schema"]["errorMessage"];
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "pptable: " . $ajax->result["schema"]["pptable"]["name"];
	$audit_table 	.= "\nmmtable: " . $ajax->result["schema"]["mmtable"]["name"];
	$audit_table 	.= "\nsstable: " . $ajax->result["schema"]["sstable"]["name"];
	$audit_detail 	= "\npid: " . $ajax->result["schema"]["pptable"]["val"];
	$audit_detail 	.= "\nsid: " . $ajax->result["schema"]["sstable"]["val"];
	$audit_detail 	.= "\nError: " . $ajax->result["schema"]["error"];
	$audit_detail 	.= "\nMessage: " . $ajax->result["schema"]["errorMessage"];
	write_audit($audit_action, $audit_table, $audit_detail, 1);

	echo json_encode($response);
		
} catch(Exception $e ) {
	$response["data"]["schema"]					= $_REQUEST["schema"];
	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	 			= $e->getField();
	echo json_encode($response);
}
?>