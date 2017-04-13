<?php 
try {
	include_once("include/table_ajax_include.php");
	// 2) list table : list1, list2, list3, cate1, cate2, cate3
	//  table1.name == table2.name ;  fkey is parent_id started from 0  as tree root 
	$listTable = array();
	$rightCategory = array(
		"type"=>"list1",
		"table1"=>array("name"=>"web_right", "key"=>"id", "fkey"=>"", "value"=>cLANG::langCol("title"), "desc"=>cLANG::langCol("detail")),
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
		"type"=>"2",   
		"p"=>array(	
							"type"=>"p",
							"name"=>"web_menu1", 
							"keys"=>array("id"),  
							"fkeys"=>array("parent_id"), 
							"cols"=>array("id","parent_id","menu_key","right"), 
							"insert"=>array(), 
							"update"=>array(),
							"right"=>array("name"=>"web_role_menu1", "value"=>"menu_right", "keys"=>array("menu_id", "role_id")),
							"filter"=>array("status"=>1)
					),
		"s"=>array(
							"type"=>"s",
							"name"=>"web_menu2", 
							"keys"=>array("id"),  
							"fkeys"=>array("parent_id"), 
							"cols"=>array("id","parent_id", "menu_key", "right"), 
							"insert"=>array(), 
							"update"=>array(),
							"right"=>array("name"=>"web_role_menu2", "value"=>"menu_right", "keys"=>array("menu_id", "role_id")),
							"filter"=>array("status"=>1)
		 )
	);
	$table["metadata"] = $tableMeta; 	

	// 4) action 
	cTREE::action($db, $table);

	// 5) return 
	cTREE::clearRows($table);
	$response["table"] = $table;
	$db->close();
	echo json_encode($response);
	
} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>