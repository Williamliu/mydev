<?php
if( $_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] == "" ) {
	$err->set(999, $words["session.epired"], $CFG["public_login_webpage"]);

	/*** Audit ***/
	$audit_action 	= "Session Expired";
	$audit_table	= "public_user";
	$audit_detail 	= "User:" . $public_user["user_name"] . "\nEmail:" . $public_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
	write_audit($audit_action, $audit_table, $audit_detail, 0);

	throw $err;
} else {
	$sess_id = $db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] );
	$db->query("UPDATE public_user_session SET deleted = 1 WHERE deleted <> 1 AND last_updated < '" . (time() - $CFG["public_session_timeout"]) . "'");
	
	$result_sess = $db->query("SELECT user_id, session_id FROM public_user_session WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");

	if( $db->row_nums($result_sess) > 0 )  {
		$row_sess = $db->fetch($result_sess);
		$db->query("UPDATE public_user_session SET last_updated = '" . time() . "' WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");
		$user_id = $row_sess["user_id"];
		$result_user = $db->query("SELECT * FROM public_user WHERE deleted <> 1 AND status = 1 AND id = '" . $user_id . "'");
		if( $db->row_nums($result_user) <= 0 )  {
			$err->set(999, $words["session.epired"], $CFG["public_login_webpage"]);

			/*** Audit ***/
			$result_aa 	= $db->query("SELECT user_id, user_name, email FROM public_user_session a INNER JOIN public_user b ON (a.user_id = b.id) WHERE session_id = '" . $sess_id . "'");
			$row_aa 	= $db->fetch($result_aa);
			$public_user["id"] 			= $row_aa["user_id"];
			$public_user["user_name"] 	= $row_aa["user_name"];
			$public_user["email"] 		= $row_aa["email"];
			$audit_action 	= "Session Expired";
			$audit_table	= "public_user";
			$audit_detail 	= "User:" . $public_user["user_name"] . "\nEmail:" . $public_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
			write_audit($audit_action, $audit_table, $audit_detail, 0);

			throw $err;
		} 
	} else {
		$err->set(999, $words["session.epired"], $CFG["public_login_webpage"]);

		/*** Audit ***/
		$result_aa 	= $db->query("SELECT user_id, user_name, email FROM public_user_session a INNER JOIN public_user b ON (a.user_id = b.id) WHERE session_id = '" . $sess_id . "'");
		$row_aa 	= $db->fetch($result_aa);
		$public_user["id"] 			= $row_aa["user_id"];
		$public_user["user_name"] 	= $row_aa["user_name"];
		$public_user["email"] 		= $row_aa["email"];
		$audit_action 	= "Session Expired";
		$audit_table	= "public_user";
		$audit_detail 	= "User:" . $public_user["user_name"] . "\nEmail:" . $public_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
		write_audit($audit_action, $audit_table, $audit_detail, 0);
	
		throw $err;
	}
}

if( $public_user["right"][$action] != 1 ) {
	$err->set(990, $words["session.right.notallow"]);
	
	/*** Audit ***/
	$audit_action 	= "Session Deny";
	$audit_table	= "website_admin";
	$audit_detail 	= "User:" . $public_user["user_name"] . "\nEmail:" . $public_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
	write_audit($audit_action, $audit_table, $audit_detail, 0);

	throw $err;
}
?>