<?php
include_once("../../include/config/config.php");
include_once($CFG["include_path"] . "/lib/database/database.php");
include_once($CFG["include_path"] . "/lib/encrypt/encrypt.php");
include_once($CFG["include_path"] . "/lib/language/website_translate.php");

$err = new cERR();

if( $_REQUEST["sess"] != "" ) $_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] 	= $_REQUEST["sess"];

$db 		= new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
$sess_id 	= $db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] );

$result_public_user 	= $db->query("SELECT * FROM vw_user_session WHERE session_id = '" . $sess_id . "'");
$row_public_user 	= $db->fetch($result_public_user);

$public_user 				= array();
$public_user["id"]			= $row_public_user["id"];
$public_user["user_name"] 	= $row_public_user["user_name"];
$public_user["email"] 		= $row_public_user["email"];
$public_user["lang"] 		= $_REQUEST["lang"]?$db->quote($_REQUEST["lang"]):$row_public_user["lang"];
$public_user["full_name"] 	= $row_public_user["full_name"];
$public_user["phone"] 		= $row_public_user["phone"];
$public_user["cell"] 		= $row_public_user["cell"];
$public_user["last_login"] 	= $row_public_user["last_login"];
$public_user["hits"] 		= $row_public_user["hits"];
$public_user["sessid"] 		= $sess_id;
$public_user["menuid"] 		= $_REQUEST["temp"]?$db->quote($_REQUEST["temp"]):"";


$public_flag = false;
$temp_name = substr($_SERVER["HTTP_REFERER"],  strrpos($_SERVER["HTTP_REFERER"], "/")!==false?strrpos($_SERVER["HTTP_REFERER"], "/")+1:0 );
if($public_user["menuid"] == "") { 
	$query_menu 	= "SELECT menu_id FROM vw_public_menu_struct WHERE template = '" . $temp_name . "' ORDER BY orderno DESC, created_time ASC;";
	$result_menu 	= $db->query($query_menu);
	if( $db->row_nums($result_menu) > 0 ) {
		$row_menu 		= $db->fetch($result_menu);
		$public_user["menuid"] = $row_menu["menu_id"];
		$public_flag = true;
	}
} else {
	$query_menu 	= "SELECT menu_id FROM vw_public_menu_struct WHERE menu_id = '" . $public_user["menuid"] . "';";
	$result_menu 	= $db->query($query_menu);
	if( $db->row_nums($result_menu) > 0 ) {
		$row_menu 		= $db->fetch($result_menu);
		$public_user["menuid"] = $row_menu["menu_id"];
		$public_flag = true;
	}
}

$public_user["right"] = array();
if($public_flag) {
	$result_temp = $db->query("SELECT id FROM website_right WHERE deleted <> 1 AND status = 1");
	while($row_temp	= $db->fetch($result_temp)) {
		$public_user["right"][$row_temp["id"]] = 1;
	}
} else {

	if($public_user["menuid"] == "") { 
		$query_menu 	= "SELECT menu_id FROM vw_user_menu_struct WHERE session_id = '" . $public_user["sessid"] . "' AND user_id = '" . $public_user["id"] . "' AND template LIKE '%" . $temp_name . "' ORDER BY orderno DESC, created_time ASC;";
		$result_menu 	= $db->query($query_menu);
		$row_menu 		= $db->fetch($result_menu);
		$public_user["menuid"] = $row_menu["menu_id"];
	} else {
		$query_menu 	= "SELECT menu_id FROM vw_user_menu_struct WHERE session_id = '" . $public_user["sessid"] . "' AND user_id = '" . $public_user["id"] . "' AND menu_id = '" . $public_user["menuid"] . "';";
		$result_menu 	= $db->query($query_menu);
		$row_menu 		= $db->fetch($result_menu);
		$public_user["menuid"] = $row_menu["menu_id"];
	}

	$result_temp 				= $db->query("SELECT menu_id, right_id FROM vw_user_right WHERE session_id = '" . $public_user["sessid"] . "' AND user_id = '" . $public_user["id"] . "' AND menu_id = '" . $public_user["menuid"] . "'");
	while($row_temp	= $db->fetch($result_temp)) {
		$public_user["right"][$row_temp["right_id"]] = 1;
	}
}


$GLang	= $public_user["lang"]?$public_user["lang"]:"cn";
$DLang 	= $CFG["lang_default"]?$CFG["lang_default"]:"cn";

// it will close mysql connection
$words = LANG::getWords($GLang);

/*************************************************************************/
function write_audit($action, $table, $detail, $in_action = 1) {
	global $CFG;
	global $db;
	global $public_user;

	if( $CFG["public_session_audit"]==1 ) {
		$browser = new Browser();
		if( $in_action ) {
			if( in_array($action, $CFG["public_session_action"]) ) {
				$fields = array();
				$fields["filter"] 		= "Public";
				$fields["admin_id"] 	= $public_user["id"]?$public_user["id"]:0;
				$fields["user_name"] 	= $public_user["user_name"];
				$fields["session_id"] 	= $public_user["sessid"];

				$fields["template"] 	= substr($_SERVER["SCRIPT_NAME"],  strrpos($_SERVER["SCRIPT_NAME"], "/")!==false?strrpos($_SERVER["SCRIPT_NAME"], "/")+1:0 );
				$fields["platform"] 	= $browser->getPlatform(); 
				$fields["browser"] 		= $browser->getBrowser(); 
				$fields["version"] 		= $browser->getVersion(); 
	
				$fields["ip_address"] 	= $_SERVER['REMOTE_ADDR']; 
				$fields["table_name"]	= $table;
				$fields["action"] 		= $action;
				$fields["detail"] 		= $detail;
				$fields["created_time"]	= time();
				$db->insert("website_admin_session_audit", $fields);
			}
		} else {
			$fields = array();
			$fields["filter"] 		= "Public";
			$fields["admin_id"] 	= $public_user["id"]?$public_user["id"]:0;
			$fields["user_name"] 	= $public_user["user_name"];
			$fields["session_id"] 	= $public_user["sessid"];

			$fields["template"] 	= substr($_SERVER["SCRIPT_NAME"],  strrpos($_SERVER["SCRIPT_NAME"], "/")!==false?strrpos($_SERVER["SCRIPT_NAME"], "/")+1:0 );
			$fields["platform"] 	= $browser->getPlatform(); 
			$fields["browser"] 		= $browser->getBrowser(); 
			$fields["version"] 		= $browser->getVersion(); 

			$fields["ip_address"] 	= $_SERVER['REMOTE_ADDR']; 
			$fields["table_name"]	= $table;
			$fields["action"] 		= $action;
			$fields["detail"] 		= $detail;
			$fields["created_time"]	= time();
			$db->insert("website_admin_session_audit", $fields);
		}
	}
}
?>