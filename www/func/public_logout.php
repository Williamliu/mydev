<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");


	$db->query("UPDATE public_user_session SET deleted = 1, last_updated = '" . time() . "' WHERE deleted <> 1 AND session_id = '" . $sess_id  . "';");
	
	$_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] = "";
	$_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_secure"] = "";
	//session_destroy();

	$response["errorCode"] 		    			= 0;
	$response["errorMessage"] 	    			= $words["logout.ok"];

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