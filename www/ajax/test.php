<?php 
session_start();
ini_set("display_errors", 0);
include_once("../../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
define("DEBUG", 1);

$response = array();
try {
	
	$rights = array("view"=>1, "save"=>1, "add"=>1, "delete"=>1);

	/*** common secure : prevent url hack from hack tool ***/
	$db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
	$table = $_REQUEST["table"]; 

	// 1) rights
	$table["rights"] = $rights;

	// 2) list table : list1, list2, list3, cate1, cate2, cate3
	//  table1.name == table2.name ;  fkey is parent_id started from 0  as tree root 
	$listTable = array();
	$colorList = array(
		"type"=>"cate3",
		"table1"=>array("name"=>"abb", 	"key"=>"id", "fkey"=>"parent_id", 	"value"=>"title_cn", "desc"=>"desc_en"),
		"table2"=>array("name"=>"abb", 	"key"=>"id", "fkey"=>"parent_id", 	"value"=>"title_cn", "desc"=>"desc_en"),
		"table3"=>array("name"=>"abb",  "key"=>"id", "fkey"=>"parent_id", 	"value"=>"title_cn", "desc"=>"desc_en")
	);
	$listTable["color1"] = $colorList;
	
	$table["listTable"] = $listTable;

	// 3) table metadata
	// medium table:   medium.keys->primary.keys   medium.fkeys->second.keys   
	// colname using js-meta name, even keys, fkeys
	// primary, second, medium  using js colname
	// checkbox relationship  using database colname,  checkbox:  keys[0] is value col;  fkeys is mapping to parent table(primary-keys, second->keys, medium->keys+fkeys) 

	$tableMeta = array(
		"type"=>"one",   
		"primary"=>array("name"=>"website_country", 				"keys"=>array("cid"), 		"cols"=>array("cid", "country_cn") ),
		"second"=>array("name"=>"website_admin", 					"keys"=>array("aid"), 		"fkeys"=>array("country"), "cols"=>array("aid","email","cell","country","password","color") ),  
		"medium"=>array("name"=>"website_admin_country", 			"keys"=>array("country_id"), "fkeys"=>array("admin_id"), "cols"=>array("country_id","admin_id", "mycountry", "weight") ),
		"mycountry"=>array("name"=>"website_admin_country",			"keys"=>array("country_id"), "fkeys"=>array("country_id","admin_id") ),  // checkbox maping ,using  database colname
		"color"=>array("name"=>"website_admin_country",				"keys"=>array("id"), "fkeys"=>array("country_id") )  // checkbox values  id => admin_id ; country_id is values
	);
	$table["metadata"] = $tableMeta; 	

	// 4) action 
	//cACTION::filter($table, "a.id", 100);
	cACTION::action($db, $table);

	// 5) return 
	$response["table"] = $table;
	echo json_encode($response);
	
} catch(Exception $e ) {
	$table 							= $_REQUEST["table"];
	$table["navi"]["loading"]       = 0;
	$table["error"]["errorCode"] 	= $e->getCode();
	$table["error"]["errorMessage"] = $e->getMessage();
	$response["table"] 				= $table; 

	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   	 			= $e->getField();
	echo json_encode($response);
}
?>