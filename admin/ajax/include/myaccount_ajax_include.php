<?php
	session_start();
	define("DEBUG", 1);
	ini_set("display_errors", 0);
	include_once("../../include/config/config.php");
	include_once($CFG["include_path"] . "/wliu/database/database.php");
	include_once($CFG["include_path"] . "/wliu/language/language_ajax.php");
	include_once($CFG["include_path"] . "/wliu/auth/auth_admin_server.php");
	include_once($CFG["include_path"] . "/wliu/secure/secure_server.php");
	include_once("include/ajax_full_right.php");  //using full_right: for user register but not required rights to modify and view 
	$response = array();
	$table = $_REQUEST["table"]; 

	cVALIDATE::validateForm($table);
	if($table["error"]["errorCode"] > 0) {
		cACTION::clearForm($table);
		$response["table"] = $table;
		echo json_encode($response);
		exit();
	}

	// if no error go ahead
    cACTION::formMeta($table);
	if($table["action"]!="custom") cACTION::formData($table);
	
	// 1) rights
	$table["rights"] = $user_right;
	
	$db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
?>