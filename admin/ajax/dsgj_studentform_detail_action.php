<?php 
try {
	include_once("include/table_ajax_include.php");
	// 2) list table : list1, list2, list3, cate1, cate2, cate3
	//  table1.name == table2.name ;  fkey is parent_id started from 0  as tree root 


	// 3) table metadata
	// medium table:   medium.keys->primary.keys   medium.fkeys->second.keys   
	// colname using js-meta name, even keys, fkeys
	// primary, second, medium  using js colname
	// checkbox relationship  using database colname,  checkbox:  keys[0] is value col;  fkeys is mapping to parent table(primary-keys, second->keys, medium->keys+fkeys) 
	$tableMeta = array(
		"type"=>"one",   
		"p"=>array(	
							"type"=>"p",
							"name"=>"dsgj_studentform", 
							"keys"=>array("id"),  
							"fkeys"=>array(), 
							"cols"=>array(
								"id","school_name", "school_address", "school_copy", "ck_service", "rd_service", "stu_fname", "stu_lname", "stu_oname", "passport","passport_copy", "visa_copy", "en_score",
								"stu_address","stu_state", "stu_postal", "stu_email", "stu_phone", "stu_wechat", 
								"dad_fname","dad_email", "dad_phone", "dad_wechat", "dad_birth", "mom_fname", "mom_email", "mom_phone", "mom_wechat", "mom_birth", 
								"par_address","par_state", "par_city", "par_postal", "airline", "flight", "pickup_datetime", "destination", "homestay_start", "homestay_end", 
								"health_medicine","health_horby", "per_character", "per_horby", "per_sport", "per_music", "per_food", "per_vegit", "homestay_child", "homestay_envir", 
								"homestay_other","homestay_letter", "homestay_concern"								
							), 
							"insert"=>array("status"=>1), 
							"update"=>array()  
					),
		"s"=>array( ),
		"m"=>array( ),
		//checkbox maping keys, fkeys using  database colname.  keys is value col,  fkeys is relational cols; 
		//Javascript ,  don't need to define keys, fkeys for checkbox mapping 
		"ck_service"=>array("name"=>"dsgj_student_service", "keys"=>array("service_id"), "fkeys"=>array("stu_id") ), 
		"homestay_child"=>array("name"=>"dsgj_student_homestay", "keys"=>array("homestay_type"), "fkeys"=>array("stu_id") ) 
	);
	$table["metadata"] = $tableMeta; 	

	// 4) action 
	cACTION::formFilter($table);
	cACTION::action($db, $table);

	// 6) return 
	include_once("include/table_ajax_response.php");

} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>