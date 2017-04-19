<?php 
try {
	include_once("include/tree_ajax_include.php");
	// 2) list table : list1, list2, list3, cate1, cate2, cate3
	//  table1.name == table2.name ;  fkey is parent_id started from 0  as tree root 
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
							"cols"=>array("id","parent_id","menu_key","icon","title_en","detail_en","title_cn","detail_cn","template","url","seo_title","seo_keyword","seo_description","status","orderno"), 
							"insert"=>array(), 
							"update"=>array()
					),
		"s"=>array(
							"type"=>"s",
							"name"=>"web_menu2", 
							"keys"=>array("id"),  
							"fkeys"=>array("parent_id"), 
							"cols"=>array("id","parent_id", "menu_key","icon","title_en", "detail_en","title_cn","detail_cn","template","url","seo_title","seo_keyword","seo_description","status", "orderno"), 
							"insert"=>array(), 
							"update"=>array()
		 )
	);
	$table["metadata"] = $tableMeta; 	

	// 4) action 
	cTREE::action($db, $table);

	// 5) return 
	include_once("include/tree_ajax_response.php");
	
} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>