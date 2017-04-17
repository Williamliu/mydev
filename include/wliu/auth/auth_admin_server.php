<?php
/*********************************************************************************/
/* website authentication :  verify user session is available,  if sesssion invalid,  it redirect to login webpage */
/*********************************************************************************/
$sess_name = $_SERVER['HTTP_HOST'] . ".user.session";
if( $_SESSION[$sess_name] == "" ) {
	$gErr->set(990, gwords("website.session.expiry"), $CFG["secure_a_return"]. "?url=" . $_SERVER['HTTP_REFERER']);
    throw $gErr;
} else {
	$sess_db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
	$sess_id = $sess_db->quote($_SESSION[$sess_name]);
    // expiry 
	$sess_db->query("UPDATE web_admin_session SET deleted = 1 WHERE deleted=0 AND last_updated < '" . (time() - $CFG["secure_timeout"]) . "'");
	
	$result_sess = $sess_db->query("SELECT admin_id, session_id FROM web_admin_session WHERE status = 1 AND deleted = 0 AND session_id = '" . $sess_id . "'");
	if( $sess_db->row_nums($result_sess) > 0 )  {
		$row_sess = $sess_db->fetch($result_sess);
		$sess_db->query("UPDATE web_admin_session SET last_updated = '" . time() . "' WHERE status = 1 AND deleted = 0 AND session_id = '" . $sess_id . "'");
		$admin_id = $row_sess["admin_id"];
		
		$result_user = $sess_db->query("SELECT * FROM web_admin WHERE deleted=0 AND status=1 AND id = '" . $admin_id . "'");
		if( $sess_db->row_nums($result_user) <= 0 )  {
			$gErr->set(990, gwords("website.session.expiry"), $CFG["secure_a_return"] . "?url=" . $_SERVER['HTTP_REFERER']);
			throw $gErr;
		} else {
            $web_user               = array();
            $row_user               = $sess_db->fetch($result_user);
            $web_user["id"]         = $row_user["id"];
            $web_user["user_name"]  = $row_user["user_name"];
            $web_user["email"]      = $row_user["email"];
            $web_user["first_name"] = $row_user["first_name"];
            $web_user["last_name"]  = $row_user["last_name"];
            $web_user["phone"]      = $row_user["phone"];
            $web_user["cell"]       = $row_user["cell"];
            $web_user["country"]    = $row_user["country"];
            $web_user["hits"]       = $row_user["hits"];
            $web_user["last_login"] = $row_user["last_login"];
            $web_user["session"] 	= $_SESSION[$sess_name];
			/*
			echo "<pre>";
			print_r($web_user);
			echo "</pre>";
			*/
        }
	} else {
		$gErr->set(990, gwords("website.session.expiry"), $CFG["secure_a_return"] . "?url=" . $_SERVER['HTTP_REFERER']);
		throw $gErr;
	}
}
$sess_db->close();
?>