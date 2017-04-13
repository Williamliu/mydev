<?php 
try {
	include_once("include/table_ajax_include.php");
	cVALIDATE::validateForm($table);

	switch($table["action"]) {
		case "get":
			if($table["rights"]["view"]) {
				$data["login_user"] 	= "Hello World";
				$data["login_password"] = "222 333";
				$table["data"] = $data;
			} else {
				$table["error"]["errorCode"] 	= 1;
				$table["error"]["errorMessage"] = "You don't have right to view data.";
			}
			break;
		case "save":
			switch($table["rowstate"]) {
				case 1:
					if($table["rights"]["save"]) {
						$table["data"][1]["value"] = "this is pass";
					} else {
						$table["error"]["errorCode"] 	= 1;
						$table["error"]["errorMessage"] = "You don't have right to update data.";
					}
					break;
				case 2:
					if($table["rights"]["add"]) {
						$table["data"][1]["value"] = "this is pass";
					} else {
						$table["error"]["errorCode"] 	= 1;
						$table["error"]["errorMessage"] = "You don't have right to add data.";
					}
					break;
				case 3:
					if($table["rights"]["delete"]) {
					} else {
						$table["error"]["errorCode"] 	= 1;
						$table["error"]["errorMessage"] = "You don't have right to delete data.";
					}
					break;
			}
			break;
		case "custom":
			//$table["data"][1]["value"] = "this is pass";
			$table["error"]["errorCode"] 	= 1;
			$table["error"]["errorMessage"] = "You don't have right to custom data.";
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