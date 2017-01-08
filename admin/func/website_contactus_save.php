<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhForm.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");


	/*** your code here ***/
	$form = $_REQUEST["form"];
	$form["head"]["base"] = "website_contactus";

	$formObj = new LWHFORM($db, $form, $DLang);
	$form = $formObj->verify();

	if( $form["head"]["error"] == 0 ) {
		$formObj->action();
		$form = $formObj->result;
	}
	
	$response["form"]					= $form;
	$response["errorCode"] 		    	= $form["head"]["error"];
	$response["errorMessage"]	    	= $form["head"]["errorMessage"];

	/*** audit ***/
	$audit_action 	= "Apply Account";
	$audit_table 	= "pptable: website_contactus";
	$audit_table 	.= "\nmmtable: " . $result["schema"]["mmtable"];
	$audit_table 	.= "\nsstable: website_admin";
	$audit_detail 	= "\npid: " . $result["schema"]["pid"];
	$audit_detail 	.= "\nsid: " . $result["schema"]["sid"];
	$audit_detail 	.= "\nError: " . $result["schema"]["error"];
	$audit_detail 	.= "\nMessage: " . $result["schema"]["errorMessage"];
	write_audit($audit_action, $audit_table, $audit_detail, 0);

	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["form"] 							= $_REQUEST["form"];
	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   				= $e->getField();
	echo json_encode($response);
}
?>