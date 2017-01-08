<?php 
session_start();
ini_set("display_errors", 0);
include_once("public_a_include.php");
include_once($CFG["include_path"] . "/lib/wmliu/lwhForm.php");

$response = array();
try {
	/*** common secure : prevent url hack from hack tool ***/
	include_once("public_a_secure.php");

	/*** your code here ***/
	$form = $_REQUEST["form"];
	$form["head"]["base"] = "public_user";

	$user_name 	=  SEARCH::colVal($form["cols"], "user_name");
	$password 	=  SEARCH::colVal($form["cols"], "password");
	
	$formObj = new LWHFORM($db, $form, $DLang);
	$form = $formObj->verify();

	if( $form["head"]["error"] == 0 ) {
		$user		= $db->quote(trim($user_name));
		$password	= $db->quote(trim($password));
		$phone 		= $db->phone("phone", 	$user);
		$cell 		= $db->phone("cell", 	$user);
		
		$db->query("UPDATE public_user SET status = 1, try_lock = 0 WHERE deleted <> 1 AND status = 0 AND locked <> 1 AND try_lock = 1 AND 
																		( user_name = '" . $user . "' OR email = '" . $user . "' OR $phone OR $cell ) AND 
																		 last_try < '" . (time() - $CFG["public_userlock_timeout"]) . "'");


		$query 	= "SELECT id, user_name, email FROM public_user WHERE deleted <> 1 AND status = 1 AND locked <> 1 AND 
														( user_name = '" . $user . "' OR email = '" . $user . "' OR $phone OR $cell ) AND 
														password = '" . $password . "'";
		$result_user = $db->query($query);
		if( $db->row_nums($result_user) > 0 )  {
			$row = $db->fetch($result_user);
			$user_id = $row["id"];
			$login_time = time();
			$sess_id  = md5($user_id . $login_time . rand(65535, 6553500));
			$_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] = $sess_id;

			$fields = array();
			$fields["user_id"] 		= $user_id;
			$fields["session_id"] 	= $sess_id;
			$fields["user_agent"] 	= $_SERVER['HTTP_USER_AGENT']; 

			$browser 				= new Browser();
			$fields["platform"] 	= $browser->getPlatform(); 
			$fields["browser"] 		= $browser->getBrowser(); 
			$fields["version"] 		= $browser->getVersion(); 
			
			$fields["ip_address"] 	= $_SERVER['REMOTE_ADDR']; 
			$fields["created_time"]	= $login_time;
			$fields["last_updated"] = $login_time;
			$fields["status"] 		= 1;
			$fields["deleted"] 		= 0;

			$db->insert("public_user_session", $fields);
			$db->query("UPDATE public_user SET hits = hits + 1, login_count = 0, last_login = '". time() ."' WHERE deleted <> 1 AND status = 1 AND locked <> 1 AND id = '" . $user_id . "'");	
			
			/*** audit ***/
			$public_user["id"] 			= $row["id"];
			$public_user["user_name"] 	= $row["user_name"];
			$public_user["email"] 		= $row["email"];
			$audit_action 	= "Login Success";
			$audit_table	= "website_admin";
			$audit_detail 	= "User:" . $public_user["user_name"] . "\nEmail:" . $public_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
			write_audit($audit_action, $audit_table, $audit_detail, 0);

		
			$response["data"]["sess_id"] 	= $sess_id;
			$form["head"]["error"] = 0;
			$form["head"]["errorMessage"] = LANG::words("welcome login", $form["head"]["lang"]);
		} else {
			/*** audit ***/
			$public_user["id"] 			= 0;
			$public_user["user_name"] 	= $user;
			$public_user["email"] 		= "";

			$audit_action 	= "Login Fail";
			$audit_table	= "website_admin";
			$audit_detail 	= "User:" . $public_user["user_name"] . "\nEmail:" . $public_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
			write_audit($audit_action, $audit_table, $audit_detail, 0);

			
			$max_login = $CFG["public_login_count"]?$CFG["public_login_count"]:10;
			$query = "UPDATE public_user SET 	status 		= IF(login_count >=" . $max_login . ",0, status), 
												try_lock 	= IF(login_count >=" . $max_login . ", 1, try_lock),
												login_count = IF( login_count >=" . $max_login . " OR status = 0, 0, login_count + 1 ), 
												last_try 	= IF( login_count >=" . $max_login . " OR status = 0, last_try, '" . time() . "' ) WHERE deleted <> 1  AND locked <> 1 AND ( user_name = '" . $user . "' OR email = '" . $user . "'  OR $phone OR $cell )";
			$db->query( $query );
			
			$query = "SELECT id, user_name, email FROM public_user WHERE deleted <> 1 AND status <> 1 AND locked <> 1 AND ( user_name = '" . $user . "' OR email = '" . $user . "'  OR $phone OR $cell )";
			$result_count = $db->query( $query );
			if($db->row_nums($result_count) > 0) {
				$response["errorMessage"]	= str_replace(array("{{count}}", "{{minutes}}"),array($max_login,ceil($CFG["public_userlock_timeout"]/60) ), LANG::words("login user lock", $result["schema"]["lang"]));
				$response["errorCode"] = 1;
				$row_count = $db->fetch($result_count);

				/*** audit ***/
				$public_user["id"] 			= $row_count["id"];
				$public_user["user_name"] 	= $row_count["user_name"];
				$public_user["email"] 		= $row_count["email"];
				$audit_action 	= "Login Locked";
				$audit_table	= "website_admin";
				$audit_detail 	= "User:" . $public_user["user_name"] . "\nEmail:" . $public_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
				write_audit($audit_action, $audit_table, $audit_detail, 0);
			} 
		
		
			$form["head"]["error"] = 1;
			$form["head"]["errorMessage"] = LANG::words("login fail", $form["head"]["lang"]);
		} // if row_num 

	} // if error


	$response["form"]			= $form;
	$response["errorCode"] 		= $form["head"]["error"];
	$response["errorMessage"]	= $form["head"]["errorMessage"];
	/**********************/
	
	echo json_encode($response);
	
} catch(Exception $e ) {
	$response["form"] 							= $_REQUEST["form"];
	$response["errorCode"] 		    			= $e->getCode();
	$response["errorMessage"] 	    			= $e->getMessage();
	$response["errorLine"] 		    			= sprintf("File[file:%s, line:%s]", $e->getFile(), $e->getLine());
	$response["errorField"]		   				= $e->getField();
	echo json_encode($response);
}
?>