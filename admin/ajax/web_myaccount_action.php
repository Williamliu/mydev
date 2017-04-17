<?php 
try {
	include_once("include/myaccount_ajax_include.php");
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
	$formID = array("p"=>array("id"=>$web_user["id"]));
	cACTION::formID($table, $formID);
	cACTION::formFilter($table);
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
	include_once("include/table_ajax_response.php");

} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>