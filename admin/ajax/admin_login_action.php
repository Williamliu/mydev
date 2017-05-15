<?php 
try {
	include_once("include/login_ajax_include.php");

	/**************************************************/
	switch($table["action"]) {
		case "get":
			break;
		case "save":
			switch($table["rowstate"]) {
				case 1:
					break;
				case 2:
					if($table["rights"]["add"]) {
						$sess_name = $_SERVER['HTTP_HOST'] . ".user.session";
						$user = $db->quote($table["formData"]["login_user"]);
						$pass = $db->quote($table["formData"]["login_password"]);
						$url  = $table["formData"]["url"];

						// unlock account after x minutes
						$query = "UPDATE web_admin SET locked=0 WHERE deleted=0 AND status=1 AND locked=1 AND (user_name='" . $user . "' OR email = '" . $user . "') AND last_updated <= " . ( time() - $CFG["secure_lock_timeout"] ); 
						$db->query($query);

						$query 	= "SELECT id, user_name, email FROM web_admin WHERE deleted=0 AND status=1 AND locked=0 AND (user_name = '" . $user . "' OR email = '" . $user . "') AND password = '" . $pass . "'";
						$result = $db->query($query);
						if( $db->row_nums($result) > 0 )  {
							$row = $db->fetch($result);
							$admin_id = $row["id"];
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
							$db->query("UPDATE web_admin SET hits = hits + 1, login_count = 0, last_login = '". time() ."' WHERE deleted=0 AND status = 1 AND id = '" . $admin_id . "'");	
							$table["data"]["session_id"] = $sess_id;

							$table["error"]["errorCode"] 	= 0;
							$table["error"]["errorMessage"] = "Login Successful";
							$table["error"]["errorField"] 	= $url?$url:$CFG["secure_login_home"];
						} else {
							$login_max 	= $CFG["secure_login_max"];
							$login_lock = $CFG["secure_lock_timeout"];
							$query = "UPDATE web_admin SET locked = IF(login_count >=" . $login_max . ", 1, locked), login_count =IF( login_count >=" . $login_max . " OR locked=1, 0, login_count + 1 ), last_updated = '" . time() . "' WHERE deleted=0 AND status=1 AND ( user_name = '" . $user . "' OR email = '" . $user . "')";
							$db->query($query);

							$query = "SELECT id, user_name, email FROM web_admin WHERE deleted=0 AND status=1 AND locked=1 AND (user_name = '" . $user . "' OR email = '" . $user . "')";
							if($db->exists($query) > 0) {
								$table["error"]["errorCode"] 	= 1;
								$table["error"]["errorMessage"] = "You failed to login for $login_max times, your account has been locked and try again after " . ($login_lock/60) . " minutes.";
							} else {
								$query = "SELECT id, user_name, email FROM web_admin WHERE deleted=0 AND status=0 AND (user_name = '" . $user . "' OR email = '" . $user . "')";
								if( $db->exists($query) ) {
									$table["error"]["errorCode"] 	= 1;
									$table["error"]["errorMessage"] = gwords("You account is inactived, please contact website administrator.");
								} else {
									$table["error"]["errorCode"] 	= 1;
									$table["error"]["errorMessage"] = gwords("You failed to login, please make sure your user name and password is correct.");
								}
							}
						} 
						
					} else {
						$table["error"]["errorCode"] 	= 1;
						$table["error"]["errorMessage"] = gwords("You dont have right to add data.");
					}
					break;
				case 3:
					break;
			}
			break;
		case "custom":
			break;
	}
	/**************************************************/

	include_once("include/form_ajax_response.php");

} catch(Exception $e ) {
	include_once("include/table_error_catch.php");
}
?>