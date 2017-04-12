<?php 
try {
	session_start();
	define("DEBUG", 0);
	ini_set("display_errors", 0);
	include_once("../../include/config/config.php");
	include_once($CFG["include_path"] . "/wliu/database/database.php");
	include_once($CFG["include_path"] . "/wliu/language/language_ajax.php");
	//include_once($CFG["include_path"] . "/wliu/auth/auth_admin_server.php");
	include_once($CFG["include_path"] . "/wliu/secure/secure_server.php");
	include_once("../head/full_right.php");
	$response = array();

	/*** common secure : prevent url hack from hack tool ***/
	$db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
	$table = $_REQUEST["table"]; 
	cVALIDATE::validateForm($table);
	// 1) rights
	$user_right["M11"];


	cACTION::clearForm($table);
	$response["table"] = $table;
	echo json_encode($response);
	
} catch(Exception $e ) {
	$response 									= array();
	$table 										= $_REQUEST["table"];
	unset($table["cols"]);
	$table["error"]["errorCode"] 				= $e->getCode();
	$table["error"]["errorMessage"] 			= $e->getMessage();
	$table["error"]["errorField"]		   	 	= $e->getField();
	$response["table"] 							= $table; 

	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	 			= $e->getField();
	echo json_encode($response);
}
?>