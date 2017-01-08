<?php
if( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] == "" ) {
	$err->set(999, $words["session.epired"], $CFG["admin_login_webpage"]);

	/*** Audit ***/
	$audit_action 	= "Session Expired";
	$audit_table	= "website_admin";
	$audit_detail 	= "User:" . $admin_user["user_name"] . "\nEmail:" . $admin_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
	write_audit($audit_action, $audit_table, $audit_detail, 0);

	throw $err;
} else {
	$sess_id = $db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] );
	$db->query("UPDATE website_admin_session SET deleted = 1 WHERE deleted <> 1 AND last_updated < '" . (time() - $CFG["admin_session_timeout"]) . "'");
	
	$result_sess = $db->query("SELECT admin_id, session_id FROM website_admin_session WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");

	if( $db->row_nums($result_sess) > 0 )  {
		$row_sess = $db->fetch($result_sess);
		$db->query("UPDATE website_admin_session SET last_updated = '" . time() . "' WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");
		$admin_id = $row_sess["admin_id"];
		$result_user = $db->query("SELECT * FROM website_admin WHERE deleted <> 1 AND status = 1 AND id = '" . $admin_id . "'");
		if( $db->row_nums($result_user) <= 0 )  {
			$err->set(999, $words["session.epired"], $CFG["admin_login_webpage"]);

			/*** Audit ***/
			$result_aa 	= $db->query("SELECT admin_id, user_name, email FROM website_admin_session a INNER JOIN website_admin b ON (a.admin_id = b.id) WHERE session_id = '" . $sess_id . "'");
			$row_aa 	= $db->fetch($result_aa);
			$admin_user["id"] 			= $row_aa["admin_id"];
			$admin_user["user_name"] 	= $row_aa["user_name"];
			$admin_user["email"] 		= $row_aa["email"];
			$audit_action 	= "Session Expired";
			$audit_table	= "website_admin";
			$audit_detail 	= "User:" . $admin_user["user_name"] . "\nEmail:" . $admin_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
			write_audit($audit_action, $audit_table, $audit_detail, 0);

			throw $err;
		} 
	} else {
		$err->set(999, $words["session.epired"], $CFG["admin_login_webpage"]);

		/*** Audit ***/
		$result_aa 	= $db->query("SELECT admin_id, user_name, email FROM website_admin_session a INNER JOIN website_admin b ON (a.admin_id = b.id) WHERE session_id = '" . $sess_id . "'");
		$row_aa 	= $db->fetch($result_aa);
		$admin_user["id"] 			= $row_aa["admin_id"];
		$admin_user["user_name"] 	= $row_aa["user_name"];
		$admin_user["email"] 		= $row_aa["email"];
		$audit_action 	= "Session Expired";
		$audit_table	= "website_admin";
		$audit_detail 	= "User:" . $admin_user["user_name"] . "\nEmail:" . $admin_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
		write_audit($audit_action, $audit_table, $audit_detail, 0);
	
		throw $err;
	}
}

if( $admin_user["right"][$action] != 1 ) {
	$err->set(990, $words["session.right.notallow"]);
	
	/*** Audit ***/
	$audit_action 	= "Session Deny";
	$audit_table	= "website_admin";
	$audit_detail 	= "User:" . $admin_user["user_name"] . "\nEmail:" . $admin_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
	write_audit($audit_action, $audit_table, $audit_detail, 0);

	throw $err;
}
?>