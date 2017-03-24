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
	$rightCategory = array(
		"type"=>"list1",
		"table1"=>array("name"=>"website_right", "key"=>"id", "fkey"=>"", "value"=>"title_en", "desc"=>"desc_en"),
		"table2"=>array(),
		"table3"=>array()
	);
	$listTable["rightCategory"] = $rightCategory;
	
	$table["listTable"] = $listTable;

	// 3) table metadata
	// medium table:   medium.keys->primary.keys   medium.fkeys->second.keys   
	// colname using js-meta name, even keys, fkeys
	// primary, second, medium  using js colname
	// checkbox relationship  using database colname,  checkbox:  keys[0] is value col;  fkeys is mapping to parent table(primary-keys, second->keys, medium->keys+fkeys) 

	$tableMeta = array(
		"type"=>"3",   
		"p"=>array(	
							"type"=>"p",
							"name"=>"website_menu", 
							"keys"=>array("id"),  
							"fkeys"=>array("parent_id"), 
							"cols"=>array("id","parent_id", "menu_key", "title_en", "desc_en", "right", "orderno", "status"), 
							"insert"=>array(), 
							"update"=>array(),
							"right"=>array("name"=>"website_menu_right", "value"=>"menu_right_id", "keys"=>array("menu_id", "admin_id"))
					),
		"s"=>array( 
							"type"=>"s",
							"name"=>"website_menu", 
							"keys"=>array("id"),  
							"fkeys"=>array("parent_id"), 
							"cols"=>array("id","parent_id", "menu_key", "title_en", "desc_en", "right", "orderno", "status"), 
							"insert"=>array(), 
							"update"=>array(),
							"right"=>array("name"=>"website_menu_right", "value"=>"menu_right_id", "keys"=>array("menu_id", "admin_id"))
		),
		"m"=>array(
							"type"=>"m",
							"name"=>"website_template", 
							"keys"=>array("id"),  
							"fkeys"=>array("ref_id"), 
							"cols"=>array("id","ref_id", "menu_key", "title_en", "desc_en", "status", "right", "orderno"), 
							"insert"=>array(), 
							"update"=>array(),
							"right"=>array("name"=>"website_template_right", "value"=>"temp_right_id", "keys"=>array("temp_id", "admin_id"))
		 ),
	);
	$table["metadata"] = $tableMeta; 	

	// 4) action 
	//cACTION::formFilter($table);
	cTREE::action($db, $table);

	// 5) return 
	//cTREE::clearRows($table);
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