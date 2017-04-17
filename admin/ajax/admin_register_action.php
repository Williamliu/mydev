<?php 
try {
	include_once("include/login_ajax_include.php");

	/**************************************************/
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
					} else {
						$table["error"]["errorCode"] 	= 1;
						$table["error"]["errorMessage"] = "You don't have right to update data.";
					}
					break;
				case 2:
					if($table["rights"]["add"]) {
						$query = "SELECT * FROM web_admin WHERE deleted=0 AND user_name='" . $table["formData"]["user_name"] . "'";
						if($db->exists($query)) {
							cACTION::formError($table, "user_name", "'" . $table["colMeta"]["user_name"]["colname"] . "' is already used in our database.");
							$table["error"]["errorCode"] 	= 1;
						}
						
						$query = "SELECT * FROM web_admin WHERE deleted=0 AND email='" . $table["formData"]["email"] . "'";
						if($db->exists($query)) {
							cACTION::formError($table, "email", "'" . $table["colMeta"]["email"]["colname"] . "' is already used in our database.");
							$table["error"]["errorCode"] 	= 1;
						}

						if($table["error"]["errorCode"]==0) {
							$fields = array();
							$fields["user_name"] 	= $table["formData"]["user_name"];
							$fields["email"] 		= $table["formData"]["email"];
							$fields["password"] 	= $table["formData"]["password"];
							$fields["first_name"] 	= $table["formData"]["first_name"];
							$fields["last_name"] 	= $table["formData"]["last_name"];
							$fields["phone"] 		= $table["formData"]["phone"];
							$fields["country"] 		= $table["formData"]["country"];
							$fields["status"] 		= 1;
							$fields["deleted"] 		= 0;
							$fields["hits"] 		= 1;
							$fields["created_time"] = time();
							$fields["last_updated"] = time();
							
							$sess_name = $_SERVER['HTTP_HOST'] . ".user.session";
							$table["formData"]["id"] = $db->insert("web_admin", $fields);
							$admin_id = $table["formData"]["id"];
							$login_time = time();
							$sess_id  = md5($admin_id . $login_time . rand(65535, 6553500));
							$_SESSION[$sess_name] = $sess_id;

							$fields = array();
							$fields["admin_id"] 	= $admin_id;
							$fields["session_id"] 	= $sess_id;
							$fields["user_agent"] 	= $_SERVER['HTTP_USER_AGENT']; 

							$browser 				= new Browser();
							$fields["platform"] 	= $browser->getPlatform(); 
							$fields["browser"] 		= $browser->getBrowser(); 
							$fields["version"] 		= $browser->getVersion(); 
							$fields["is_mobile"] 	= $browser->isMobile()?1:0; 
							
							$fields["ip_address"] 	= $_SERVER['REMOTE_ADDR']; 
							$fields["created_time"]	= $login_time;
							$fields["last_updated"] = $login_time;
							$fields["status"] 		= 1;
							$fields["deleted"] 		= 0;

							$db->insert("web_admin_session", $fields);
							$db->query("UPDATE web_admin SET login_count = 0, last_login = '". time() ."' WHERE deleted=0 AND status=1 AND id = '" . $admin_id . "'");	
							$table["data"]["session_id"] = $sess_id;

							$table["error"]["errorCode"] 	= 0;
							$table["error"]["errorMessage"] = "Register Successful";
							$table["error"]["errorField"] 	= $CFG["secure_login_home"];
						}

						
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
	/**************************************************/

	include_once("include/form_ajax_response.php");
	
} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>