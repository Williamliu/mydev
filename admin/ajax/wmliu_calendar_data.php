<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_calendar.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_search.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $_REQUEST["calendar"]["list"]["head"]["action"]=="load"?"view":$action;	
	include_once("website_a_auth.php");

	/*** your code here ***/
	$calendar = new WMLIUCALENDAR($db, $_REQUEST["calendar"], $DLang);
	$response["calendar"]      	    = $calendar->result;
	$response["errorCode"] 		    = 0;
	$response["errorMessage"]	    = "";
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "pptable: " . $_REQUEST["calendar"]["schema"]["table"]["pptable"]["name"];
	$audit_table 	.= "\nmmtable: " . $_REQUEST["calendar"]["schema"]["table"]["mmtable"]["name"];
	$audit_table 	.= "\nsstable: " . $_REQUEST["calendar"]["schema"]["table"]["sstable"]["name"];
	$audit_detail 	= "\npid: " .  $_REQUEST["calendar"]["schema"]["idvals"]["pid"];
	$audit_detail 	.= "\nsid: " . $_REQUEST["calendar"]["schema"]["idvals"]["sid"];
	$audit_detail 	.= "\nYear: " . $_REQUEST["calendar"]["schema"]["current"]["Y"];
	$audit_detail 	.= "\nMonth: " . $_REQUEST["calendar"]["schema"]["current"]["M"];
	write_audit($audit_action, $audit_table, $audit_detail, 1);

	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["calendar"]          	= $_REQUEST["calendar"];
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>