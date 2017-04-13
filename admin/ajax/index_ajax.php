<?php 
try {
	include_once("include/table_ajax_include.php");
	cVALIDATE::validateForm($table);

	switch($table["action"]) {
		case "get":
			break;
		case "save":
			switch($table["rowstate"]) {
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
			}
			break;
	}

	cACTION::clearForm($table);
	$response["table"] = $table;
	$db->close();
	echo json_encode($response);
	
} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>