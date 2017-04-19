<?php 
try {
	include_once("include/table_ajax_include.php");
	// 2) list table : list1, list2, list3, cate1, cate2, cate3
	//  table1.name == table2.name ;  fkey is parent_id started from 0  as tree root 
	$tableList = array(
		"type"=>"list1",
		"table1"=>array("name"=>"web_basic_table", 	"key"=>"id", "fkey"=>"", "value"=>"title_cn", "desc"=>"detail_cn"),
		"table2"=>array(),
		"table3"=>array()
	);
	$listTable["tableList"] = $tableList;
	
	$table["listTable"] = $listTable;

	// 3) table metadata
	// medium table:   medium.keys->primary.keys   medium.fkeys->second.keys   
	// colname using js-meta name, even keys, fkeys
	// primary, second, medium  using js colname
	// checkbox relationship  using database colname,  checkbox:  keys[0] is value col;  fkeys is mapping to parent table(primary-keys, second->keys, medium->keys+fkeys) 

	$tableMeta = array(
		"type"=>"one2many",   
		"p"=>array(	
							"type"=>"p",
							"name"=>"web_basic_table", 
							"keys"=>array("id"),  
							"fkeys"=>array(), 
							"cols"=>array("id", "table_name"), 
							"insert"=>array("last_updated"=>time()), 
							"update"=>array()  
					),
		"s"=>array(
							"type"=>"s",
							"name"=>"web_basic_info", 
							"keys"=>array("id"),  
							"fkeys"=>array("ref_id"), 
							"cols"=>array("id","ref_id", "title_en", "title_cn", "detail_en", "detail_cn", "status", "orderno", "last_updated"), 
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