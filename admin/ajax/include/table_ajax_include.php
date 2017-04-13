<?php
	session_start();
	define("DEBUG", 0);
	ini_set("display_errors", 0);
	include_once("../../include/config/config.php");
	include_once($CFG["include_path"] . "/wliu/database/database.php");
	include_once($CFG["include_path"] . "/wliu/language/language_ajax.php");
	//include_once($CFG["include_path"] . "/wliu/auth/auth_admin_server.php");
	include_once($CFG["include_path"] . "/wliu/secure/secure_server.php");
	include_once("include/full_right.php");
	$response = array();
	$table = $_REQUEST["table"]; 
	// 1) rights
	$table["rights"] = $user_right[$current_menu_key];
	
	$db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
?>