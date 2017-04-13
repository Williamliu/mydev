<?php 
try {
	include_once("include/table_ajax_include.php");
	// 2) list table : list1, list2, list3, cate1, cate2, cate3
	//  table1.name == table2.name ;  fkey is parent_id started from 0  as tree root 

	// 3) table metadata
	$roleLevel = array(
		"type"=>"list1",
		"table1"=>array("name"=>"web_role_level", 	"key"=>"id", "fkey"=>"", "value"=>cLANG::langCol("title"), "desc"=>cLANG::langCol("detail")),
		"table2"=>array(),
		"table3"=>array()
	);
	$listTable["roleLevel"] = $roleLevel;
	$table["listTable"] = $listTable;

	$tableMeta = array(
		"type"=>"one",   
		"p"=>array(	
							"type"=>"p",
							"name"=>"web_role", 
							"keys"=>array("id"),  
							"fkeys"=>array(), 
							"cols"=>array("id", "title_en", "detail_en", "title_cn", "detail_cn", "level", "orderno", "status","created_time","last_updated"), 
							"insert"=>array("last_updated"=>time()), 
							"update"=>array()  
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
	$db->close();
	echo json_encode($response);
	
} catch(Exception $e ) {
	include_once("../include/table_error_catch.php");
}
?>