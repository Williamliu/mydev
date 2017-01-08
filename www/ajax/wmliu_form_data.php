<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_search.php");
include_once($CFG["include_path"] . "/lib/wmliu/wmliu_form.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");
	
	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	$action = "view";
	$action = $_REQUEST["form"]["detail"]["head"]["action"]=="load"?"view":$action;	
	$action = $_REQUEST["form"]["detail"]["head"]["action"]=="init"?"view":$action;	
	$action = $_REQUEST["form"]["detail"]["head"]["action"]=="fresh"?"view":$action;	
	
	$action_ff = $_REQUEST["form"]["detail"]["head"]["state"];
	$action = $action_ff=="new"?"add":$action;	
	$action = $action_ff=="update"?"save":$action;	
	$action = $action_ff=="delete"?"delete":$action;	
	//include_once("public_a_auth.php");



	/*** your code here ***/
	$form = new WMLIUFORM($db, $_REQUEST["form"], $DLang);
	$response["form"]	    		= $form->result;
	$response["errorCode"] 		    = $form->result["detail"]["head"]["error"];
	$response["errorMessage"]	    = $form->result["detail"]["head"]["errorMessage"];
	/**********************/

	/*** audit ***/
	$audit_action 	= $action;
	$audit_table 	= "pptable: " .  $_REQUEST["form"]["schema"]["table"]["pptable"]["name"];
	$audit_table 	.= "\nmmtable: " . $_REQUEST["form"]["schema"]["table"]["mmtable"]["name"];
	$audit_table 	.= "\nsstable: " . $_REQUEST["form"]["schema"]["table"]["sstable"]["name"];
	$audit_detail 	= "\npid: " . $_REQUEST["form"]["schema"]["idvals"]["pid"];
	$audit_detail 	.= "\nsid: " . $_REQUEST["form"]["schema"]["idvals"]["sid"];
	$audit_detail 	.= "\nstate: " . $_REQUEST["form"]["detail"]["head"]["state"];
	$audit_detail 	.= "\nError: " . $form->result["detail"]["head"]["error"];
	$audit_detail 	.= "\nMessage: " . $form->result["detail"]["head"]["errorMessage"];
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