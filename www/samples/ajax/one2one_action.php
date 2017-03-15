<?php 
session_start();
ini_set("display_errors", 0);
include_once("../../../include/config/config.php");
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
	$colorCategory = array(
		"type"=>"cate3",
		"table1"=>array("name"=>"abb", 	"key"=>"id", "fkey"=>"parent_id", 	"value"=>"title_cn", "desc"=>"desc_en"),
		"table2"=>array("name"=>"abb", 	"key"=>"id", "fkey"=>"parent_id", 	"value"=>"title_cn", "desc"=>"desc_en"),
		"table3"=>array("name"=>"abb",  "key"=>"id", "fkey"=>"parent_id", 	"value"=>"title_cn", "desc"=>"desc_en")
	);
	$listTable["colorCategory"] = $colorCategory;
	$countryCategory = array(
		"type"=>"list1",
		"table1"=>array("name"=>"website_country", 	"key"=>"id", "fkey"=>"", "value"=>"country_cn", "desc"=>"country_en"),
		"table2"=>array(),
		"table3"=>array()
	);
	$listTable["countryCategory"] = $countryCategory;
	
	$table["listTable"] = $listTable;

	// 3) table metadata
	// medium table:   medium.keys->primary.keys   medium.fkeys->second.keys   
	// colname using js-meta name, even keys, fkeys
	// primary, second, medium  using js colname
	// checkbox relationship  using database colname,  checkbox:  keys[0] is value col;  fkeys is mapping to parent table(primary-keys, second->keys, medium->keys+fkeys) 

	$tableMeta = array(
		"type"=>"one2one",   
		"p"=>array(	
							"type"=>"p",
							"name"=>"public_user", 
							"keys"=>array("id"),  
							"fkeys"=>array(), 
							"cols"=>array("id","user_name", "full_name"), 
							"insert"=>array(), 
							"update"=>array() 
					),
		"s"=>array( 
							"type"=>"s",
							"name"=>"public_user_vip", 
							"keys"=>array("id"),  
							"fkeys"=>array(), 
							"cols"=>array("id","horby", "lang", "color",  "country", "memberdate","created_time"), 
							"insert"=>array(), 
							"update"=>array() 
		),
		"m"=>array( ),  
	
		//checkbox maping keys, fkeys using  database colname.  keys is value col,  fkeys is relational cols; 
		//Javascript ,  don't need to define keys, fkeys for checkbox mapping 
		"country"=>array("name"=>"website_admin_country", "value"=>"country_id", "keys"=>array("admin_id") )  // checkbox values  id => admin_id ; country_id is values
	);
	$table["metadata"] = $tableMeta; 	

	// 4) action 
	cACTION::action($db, $table);

	// 5) return 
	cACTION::clearRows($table);
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