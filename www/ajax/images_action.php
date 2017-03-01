<?php 
session_start();
ini_set("display_errors", 0);
include_once("../../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
define("DEBUG", 1);

$response = array();
try {
	$db_img = new cMYSQL($CFG["image"]["host"], $CFG["image"]["user"], $CFG["image"]["pwd"], $CFG["image"]["database"]);
	$images = $_REQUEST["images"];
	// for secure, please unset below vars first;
	// imgObj, scope, owner_id, mode
	cIMAGE::config($images, "Users", 100, "edit");

	// filter:  imgObj, colName, colVal
	// cIMAGE::filter($images, "status", 1);

	cIMAGE::action($db_img, $images);
	$response["images"] = $images;
	echo json_encode($response);
	
} catch(Exception $e ) {
	$images 							= $_REQUEST["images"];
	$images["error"]["errorCode"] 		= $e->getCode();
	$images["error"]["errorMessage"] 	= $e->getMessage();
	$response["images"] 				= $images; 

	$response["errorCode"] 		   		= $e->getCode();
	$response["errorMessage"] 	    	= $e->getMessage();
	$response["errorLine"] 		    	= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   		= $e->getField();
	echo json_encode($response);
}
?>