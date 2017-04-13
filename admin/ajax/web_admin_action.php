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

	// 1) rights
	$table["rights"] = $user_right["M11"];

	// 2) list table : list1, list2, list3, cate1, cate2, cate3
	//  table1.name == table2.name ;  fkey is parent_id started from 0  as tree root 

	// 3) table metadata
	$countryList = array(
		"type"=>"list1",
		"table1"=>array("name"=>"web_country", 	"key"=>"id", "fkey"=>"", "value"=>cLANG::langCol("country"), "desc"=>""),
		"table2"=>array(),
		"table3"=>array()
	);
	$roleList = array(
		"type"=>"list1",
		"table1"=>array("name"=>"web_role", 	"key"=>"id", "fkey"=>"", "value"=>cLANG::langCol("title"), "desc"=>cLANG::langCol("detail")),
		"table2"=>array(),
		"table3"=>array()
	);

	$listTable["countryList"] 	= $countryList;
	$listTable["roleList"] 		= $roleList;
	$table["listTable"] = $listTable;

	$tableMeta = array(
		"type"=>"one",   
		"p"=>array(	
							"type"=>"p",
							"name"=>"web_admin", 
							"keys"=>array("id"),  
							"fkeys"=>array(), 
							"cols"=>array("id", "user_name", "email", "password", "first_name", "last_name", "phone", "cell", "status", "address", "city", "state","country", "postal", "hits", "created_time", "last_updated", "last_login", "role_id"), 
							"insert"=>array("last_updated"=>time()), 
							"update"=>array(),
							"role_id"=>array( "name"=>"web_admin_role", value=>"role_id", keys=>array("admin_id") ) 
					)
	);
	$table["metadata"] = $tableMeta; 	

	// 4) action 
	cACTION::action($db, $table);

	// 5) other code logic 
	/*
	foreach( $table["rowsArray"] as $ridx=>$theRow ) {
		foreach( $theRow as $colName=>$colValue ) {
			echo "$colName = $colValue\n";
		}
		echo "-----------------------------\n";
	}
	*/
	
	// 6) return 
	cACTION::clearRows($table);
	$response["table"] = $table;
	echo json_encode($response);
	
} catch(Exception $e ) {
	$response 									= array();
	$table 										= $_REQUEST["table"];
	$table["navi"]["loading"]       			= 0;
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