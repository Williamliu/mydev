<?php 
session_start();
ini_set("display_errors", 0);
include_once("website_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhForm.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("website_a_secure.php");

	/*** authencate user right  ***/
	// convert action to right:  view, save, add, delete
	//$action = "view";
	//$action = $_REQUEST["formData"]["schema"]["action"]=="load"?"view":$action;	
	//$action = $_REQUEST["formData"]["schema"]["action"]=="save"?"save":$action;	
	//include_once("website_a_auth.php");


	/*** your code here ***/
	$form 		= $_REQUEST["formData"];
	$password 	= trim($form["data"]["password"]["value"]);
	$passwordc	= trim($form["data"]["password_confirm"]["value"]);
	$admin_id 	= $form["schema"]["sid"];
	if( $admin_id == $admin_user["id"] ) {
		if( strlen($password) < 6 ) {
			$msg = $words["password.minlength"];
			writeErr($_REQUEST["formData"], "password", $msg);
		}
	
		if( strlen($passwordc) < 6 ) {
			$msg = $words["password.minlength"];
			writeErr($_REQUEST["formData"], "password_confirm", $msg);
		}
		
		if( $password != $passwordc ) {
			$msg = $words["password.notmatch"];
			writeErr($_REQUEST["formData"], "password_confirm", $msg);
		}
	} else {
		$msg = $words["account.notallow"];
		writeErr($_REQUEST["formData"], "", $msg);
	}
	
	$formObj = new LWHFORM($db, $_REQUEST["formData"], $DLang);
	$formObj->action();

	$form = $formObj->result["formData"];
	
	
	if( $form["schema"]["error"] == 0 ) {
		$result = $db->query("UPDATE website_admin SET password = '" . $password . "' WHERE deleted <> 1 AND id = '" . $admin_id . "'");
	}
	
	//echo "<pre>";
	//print_r($_REQUEST["formData"]["data"]);
	//echo "</pre>";
	$response["formData"]	    		= $formObj->result["formData"];
	$response["errorCode"] 		    	= $formObj->result["formData"]["schema"]["error"];
	$response["errorMessage"]	    	= $formObj->result["formData"]["schema"]["errorMessage"];
	/**********************/

	/*** audit ***/
	$audit_action 	= "Change Password";
	$audit_table 	= "pptable: " . $formObj->result["formData"]["schema"]["pptable"];
	$audit_table 	.= "\nmmtable: " . $formObj->result["formData"]["schema"]["mmtable"];
	$audit_table 	.= "\nsstable: website_admin";
	$audit_detail 	= "\npid: " . $formObj->result["formData"]["schema"]["pid"];
	$audit_detail 	.= "\nsid: " . $formObj->result["formData"]["schema"]["sid"];
	$audit_detail 	.= "\nError: " . $formObj->result["formData"]["schema"]["error"];
	$audit_detail 	.= "\nMessage: " . $formObj->result["formData"]["schema"]["errorMessage"];
	write_audit($audit_action, $audit_table, $audit_detail, 0);


	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["formData"] 			= $_REQUEST["formData"];
	$response["errorCode"] 		    = $e->getCode();
	$response["errorMessage"] 	    = $e->getMessage();
	$response["errorLine"] 		    = sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	= $e->getField();
	echo json_encode($response);
}
?>