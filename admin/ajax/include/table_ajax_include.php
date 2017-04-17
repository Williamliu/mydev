<?php
	session_start();
	define("DEBUG", 1);
	ini_set("display_errors", 0);
	include_once("../../include/config/config.php");
	include_once($CFG["include_path"] . "/wliu/database/database.php");
	include_once($CFG["include_path"] . "/wliu/language/language_ajax.php");
	include_once($CFG["include_path"] . "/wliu/auth/auth_admin_server.php");
	include_once($CFG["include_path"] . "/wliu/secure/secure_server.php");
	include_once("include/ajax_admin_right.php");
	$response = array();
	$table = $_REQUEST["table"]; 
	
	if( DEBUG ) $table["session"] = $sess_id;
	if( DEBUG ) $table["webuser"] = $web_user;
	
	// 1) rights
	$table["rights"] = $user_right;
	
	$db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
?>