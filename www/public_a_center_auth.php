<?php
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/lib/database/database.php");

if( $_REQUEST["publicsite_session"] != "" ) $_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] 	= $_REQUEST["publicsite_session"];

if( $_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] == "" ) {
	header("Location: " . $CFG["public_login_webpage"]);
} else {
	$sess_db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
	$sess_id = $sess_db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] );
	$sess_db->query("UPDATE public_user_session SET deleted = 1 WHERE deleted <> 1 AND last_updated < '" . (time() - $CFG["public_session_timeout"]) . "'");
	$result_sess = $sess_db->query("SELECT user_id, session_id FROM public_user_session WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");

	if( $sess_db->row_nums($result_sess) > 0 )  {
		$row_sess = $sess_db->fetch($result_sess);
		$sess_db->query("UPDATE public_user_session SET last_updated = '" . time() . "' WHERE deleted <> 1 AND session_id = '" . $sess_id . "'");
		$user_id = $row_sess["user_id"];
		$result_user = $sess_db->query("SELECT * FROM public_user WHERE deleted <> 1 AND status = 1 AND id = '" . $user_id . "'");
		if( $sess_db->row_nums($result_user) <= 0 )  {
			header("Location: " . $CFG["public_login_webpage"]);
		} 
	} else {
		header("Location: " . $CFG["public_login_webpage"]);
	}
}
?>