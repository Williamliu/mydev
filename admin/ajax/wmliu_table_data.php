<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_table.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_search.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");

	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $_REQUEST["table"]["navi"]["head"]["action"]=="load"?"view":$action;	
	$action = $_REQUEST["table"]["navi"]["head"]["action"]=="init"?"view":$action;	
	$action = $_REQUEST["table"]["navi"]["head"]["action"]=="fresh"?"view":$action;	
	$action = $_REQUEST["table"]["navi"]["head"]["action"]=="save"?"save":$action;	
	include_once("website_a_auth.php");


	/*** your code here ***/
	$table = new WMLIUTABLE($db, $_REQUEST["table"], $DLang, $admin_user["right"]);
	$response["table"]      	    = $table->result;
	$response["errorCode"] 		    = $table->error;
	$response["errorMessage"]	    = $table->errorMessage;
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "pptable: " . $_REQUEST["table"]["schema"]["table"]["pptable"]["name"];
	$audit_table 	.= "\nmmtable: " . $_REQUEST["table"]["schema"]["table"]["mmtable"]["name"];
	$audit_table 	.= "\nsstable: " . $_REQUEST["table"]["schema"]["table"]["sstable"]["name"];
	$audit_detail 	= "\npid: " .  $_REQUEST["table"]["schema"]["idvals"]["pid"];
	$audit_detail 	.= "\nsid: " . $_REQUEST["table"]["schema"]["idvals"]["sid"];
	$audit_detail 	.= "\nPageNo: " . 	$_REQUEST["table"]["navi"]["head"]["pageNo"];
	$audit_detail 	.= "\nPageSize: " . $_REQUEST["table"]["navi"]["head"]["pageSize"];
	$audit_detail 	.= "\nError: " . 	$table->error;
	$audit_detail 	.= "\nMessage: " . 	$table->errorMessage;
	foreach( $_REQUEST["table"]["rows"] as $row ) {
		$audit_detail 	.= "\nRows: pid:" . ($row["pid"]?$row["pid"]:"") . " sid:" . $row["sid"] . " st:" . $row["rowstate"];
	}
	write_audit($audit_action, $audit_table, $audit_detail, 1);

	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["table"]          	= $_REQUEST["table"];
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>