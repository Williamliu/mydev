<?php 
try {
	include_once("include/table_ajax_include.php");
	// 2) list table : list1, list2, list3, cate1, cate2, cate3
	//  table1.name == table2.name ;  fkey is parent_id started from 0  as tree root 

	// 3) table metadata
	$tableMeta = array(
		"type"=>"one",   
		"p"=>array(	
							"type"=>"p",
							"name"=>"dsgj_studentform", 
							"keys"=>array("id"),  
							"fkeys"=>array(), 
							"cols"=>array("id", "stu_fname", "stu_lname", "stu_email", "stu_phone", "passport", "school_name", "created_time"), 
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
	include_once("include/table_ajax_response.php");

} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>