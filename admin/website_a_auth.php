<?php
/*********************************************************************************/
/* website authentication :  verify user session is available,  if sesssion invalid,  it redirect to login webpage */
/* this module used to control legal user. and user must has "view" right.  but not verify user other rights: save, update, delete	*/
/*********************************************************************************/
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/lib/database/database.php");

if( $_REQUEST["adminsite_session"] != "" ) $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] 	= $_REQUEST["adminsite_session"];

if( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] == "" ) {
	header("Location: " . $CFG["admin_login_webpage"]);
} else {
	
	$sess_db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
	$sess_id = $sess_db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] );
	// check and update if session is expire 
	//$last = $sess_db->getVal("website_admin_session", "last_updated", array("session_id"=>$sess_id));
	//echo "Cur: " . time() . " Last: " . $last . "  diff: " .  ( time() - $last ) . " s conf: " . $CFG["admin_session_timeout"] . "<br>";
	$sess_db->query("UPDATE website_admin_session SET deleted = 1 WHERE deleted <> 1 AND last_updated < '" . (time() - $CFG["admin_session_timeout"]) . "'");
	
	$result_sess = $sess_db->query("SELECT admin_id, session_id FROM website_admin_session WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");

	if( $sess_db->row_nums($result_sess) > 0 )  {
		$row_sess = $sess_db->fetch($result_sess);
		$sess_db->query("UPDATE website_admin_session SET last_updated = '" . time() . "' WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");
		$admin_id = $row_sess["admin_id"];
		
		$result_user = $sess_db->query("SELECT * FROM website_admin WHERE deleted <> 1 AND status = 1 AND id = '" . $admin_id . "'");
		if( $sess_db->row_nums($result_user) <= 0 )  {
			header("Location: " . $CFG["admin_login_webpage"]);
		}

	} else {
		header("Location: " . $CFG["admin_login_webpage"]);
	}
}


if( $menuKey == "" ) { 
	$sess_temp_name 	= substr($_SERVER["SCRIPT_NAME"],  strrpos($_SERVER["SCRIPT_NAME"], "/")!==false?strrpos($_SERVER["SCRIPT_NAME"], "/")+1:0 );
	$sess_temp_name 	= $sess_temp_name?$sess_temp_name:"none";
	$sess_query_temp 	= "SELECT nodes, menu_id, right_id FROM vw_admin_right WHERE session_id = '" . $sess_id . "' AND template like '%" . $sess_temp_name . "' AND right_id='view';";
} else {
	$sess_query_temp 	= "SELECT nodes, menu_id, right_id FROM vw_admin_right WHERE session_id = '" . $sess_id . "' AND menu_key = '" . $menuKey . "';";
}

$sess_result_temp 	= $sess_db->query($sess_query_temp);
$sess_row_temp		= $sess_db->row_nums($sess_result_temp);
if( $sess_row_temp <= 0 ) {
	header("Location: " . $CFG["admin_guest_webpage"]);
}
?>