<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhForm.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");


	/*** your code here ***/
	$_REQUEST["formData"]["schema"]["sstable"] = "info_message";
	$formObj = new LWHFORM($db, $_REQUEST["formData"], $DLang);
	$formObj->action();
	$result = $formObj->result["formData"];
	$response["formData"] 			= $result;
	$response["errorMessage"]		= $result["schema"]["errorMessage"];
	$response["errorCode"] 			= $result["schema"]["error"];
	
	$toName = $db->getVal("public_user","full_name", $_REQUEST["formData"]["data"]["to_id"]["value"]);
	$toEmail = $db->getVal("public_user","email", $_REQUEST["formData"]["data"]["to_id"]["value"]);
	$toPhone = $db->getVal("public_user","phone", $_REQUEST["formData"]["data"]["to_id"]["value"]);
	if($response["errorCode"]=="0") {
		$db->query("UPDATE info_content SET reviews = reviews + 1 WHERE id = '" . $_REQUEST["formData"]["data"]["content_id"]["value"] . "'");
		
		$fields = array();
		$fields["to_name"] 	= $toName;
		$fields["to_email"] = $toEmail;
		$fields["to_phone"] = $toPhone;
		$fields["group_id"] = $result["schema"]["sid"];
		
		$db->update("info_message", $result["schema"]["sid"], $fields); 
	}
	/**********************/

	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["formData"] 						= $_REQUEST["formData"];
	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   				= $e->getField();
	echo json_encode($response);
}
?>