<?php
	
try {
	include_once("include/public_table_include.php");
	include_once($CFG["include_path"] . "/wliu/email/email.php");

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
							"name"=>"dsgj_contactus", 
							"keys"=>array("id"),  
							"fkeys"=>array(), 
							"cols"=>array("id","full_name", "email", "phone", "detail"), 
							"insert"=>array("status"=>1), 
							"update"=>array()  
					),
		"s"=>array( ),
		"m"=>array( )
	);
	$table["metadata"] = $tableMeta; 	

	// 4) action 
	cACTION::formFilter($table);
	cACTION::action($db, $table);

	// 5) if success ,  to do other thing
	if( $table["success"] && $table["action"]=="save" ) {
		$rows = $table["rowsArray"];
		$info = $rows[0];
		$a["from"] 		= $info["email"];
		$a["reply"] 	= $info["email"];

		$b				= "info@dushuguoji.com";
		$subject 		= "From Contact Us - DSGJ";
		$content        = "网站管理员你好,<br><br>";
		$content        .= "有人在读书国际网站给您留言， 详细信息如下:<br><br>";
		$content        .= "姓名： " . $info["full_name"] . "<br>";
		$content        .= "电话： " . $info["phone"] . "<br>";
		$content        .= "邮件： <a href='mailto:" . $info["email"] . "'>" . $info["email"] . "</a><br><br>";
		$content        .= "咨询内容:<hr style='width:100%;'>" . cTYPE::nltobr($info["detail"]) . "<br><br>";
		//$content        .= "详情可以到后台管理查看：<a href='http://admin.dushuguoji.com'>http://admin.dushuguoji.com</a><br><br>";
		//$content        .= "谢谢关注!";

		$e = new cEMAIL($a, $b, $subject, $content);
		$e->send();
		//mail($b[0], $subject, $content );
	}

	// 6) return 
	include_once("include/public_table_response.php");
	
} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>