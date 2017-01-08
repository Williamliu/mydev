<?php
/*********************************************************************************/
/* website authentication :  verify user session is available,  if sesssion invalid,  it redirect to login webpage */
/* this module used to control legal user. and user must has "view" right.  but not verify user other rights: save, update, delete	*/
/*********************************************************************************/
if( $_REQUEST["secc"] != "" ) $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_secure"] 	= $_REQUEST["secc"];
if( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_secure"] == "" ) {
	$err->set(990, $words["session.right.notallow"]);

	/*** Audit ***/
	$audit_action 	= "Session Deny";
	$audit_table	= "website_admin";
	$audit_detail 	= "User:" . $admin_user["user_name"] . "\nEmail:" . $admin_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
	write_audit($audit_action, $audit_table, $audit_detail, 0);

	throw $err;
} else {
	$client_cert = $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_secure"];

	$cert_server = array();
	$cert_server["lwhhost"] 	= $_SERVER['HTTP_HOST'];
	$cert_server["lwhagent"] 	= $_SERVER['HTTP_USER_AGENT'];
	$cert_server["lwhip"] 		= $_SERVER['REMOTE_ADDR'];
	$cert_server["lwhserver"] 	= $_SERVER['SERVER_NAME'];
	$cert_server["lwhtoken"]	= $CFG["admin_session_token"];

	$cert_string 		= json_encode($cert_server);
	$server_encrypt 	= LWHENCRYPT::encrypt($cert_string);
	if( $server_encrypt != $client_cert )  {
		$err->set(990, $words["session.right.notallow"]);
		
		/*** Audit ***/
		$result_aa 	= $db->query("SELECT admin_id, user_name, email FROM website_admin_session a INNER JOIN website_admin b ON (a.admin_id = b.id) WHERE session_id = '" . $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_secure"] . "'");
		$row_aa 	= $db->fetch($result_aa);
		$admin_user["id"] 			= $row_aa["admin_id"];
		$admin_user["user_name"] 	= $row_aa["user_name"];
		$admin_user["email"] 		= $row_aa["email"];

		$audit_action 	= "Session Deny";
		$audit_table	= "website_admin";
		$audit_detail 	= "User:" . $admin_user["user_name"] . "\nEmail:" . $admin_user["email"]. "\nTime:" . date("Y-m-d H:i:s");
		write_audit($audit_action, $audit_table, $audit_detail, 0);
		
		throw $err;
	}
}
?>