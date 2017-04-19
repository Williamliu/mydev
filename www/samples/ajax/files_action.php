<?php 

session_start();
ini_set("display_errors", 0);
include_once("../../../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
define("DEBUG", 1);

$response = array();
try {
	$db_img = new cMYSQL($CFG["image"]["host"], $CFG["image"]["user"], $CFG["image"]["pwd"], $CFG["image"]["database"]);
	$files = $_REQUEST["files"];
	// for secure, please unset below vars first;
	// imgObj, scope, owner_id, mode
	cIMAGE::config($files, "Docs", 100, "edit");

	// filter:  imgObj, colName, colVal
	// cIMAGE::filter($files, "status", 1);

	cFILE::action($db_img, $files);
	$response["files"] = $files;
	echo json_encode($response);
	
} catch(Exception $e ) {
	$files 								= $_REQUEST["files"];
	$files["error"]["errorCode"] 		= $e->getCode();
	$files["error"]["errorMessage"] 	= $e->getMessage();
	$response["files"] 					= $files; 

	$response["errorCode"] 		   		= $e->getCode();
	$response["errorMessage"] 	    	= $e->getMessage();
	$response["errorLine"] 		    	= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   		= $e->getField();
	echo json_encode($response);
}
?>