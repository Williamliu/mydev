<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_accord.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_search.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $_REQUEST["list"]["head"]["action"]=="load"?"view":$action;	
	include_once("website_a_auth.php");


	/*** your code here ***/
	$list 	= new WMLIUACCORD($db, $_REQUEST["list"], $DLang);
	$response["list"]      	    	= $list->result;
	$response["errorCode"] 		    = 0;
	$response["errorMessage"]	    = "";
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "pptable: " .  $_REQUEST["list"]["schema"]["table"]["pptable"]["name"];
	$audit_detail 	= "\npid: " . 	 $_REQUEST["list"]["schema"]["idvals"]["pid"];
	$audit_detail 	.= "\nPageNo: " . $_REQUEST["list"]["navi"]["head"]["pageNo"];
	$audit_detail 	.= "\nPageSize: " . $_REQUEST["list"]["navi"]["head"]["pageSize"];
	write_audit($audit_action, $audit_table, $audit_detail, 1);
	
	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["list"]          		= $_REQUEST["list"];
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	 = $e->getField();
	echo json_encode($response);
}
?>