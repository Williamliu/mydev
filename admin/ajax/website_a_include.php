<?php
include_once("../../include/config/config.php");
include_once($CFG["include_path"] . "/lib/database/database.php");
include_once($CFG["include_path"] . "/lib/encrypt/encrypt.php");
include_once($CFG["include_path"] . "/lib/language/website_translate.php");

$err = new cERR();

if( $_REQUEST["sess"] != "" ) $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] 	= $_REQUEST["sess"];

$db 		= new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
$sess_id 	= $db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] );

$result_admin_user 	= $db->query("SELECT * FROM vw_admin_session WHERE session_id = '" . $sess_id . "'");
$row_admin_user 	= $db->fetch($result_admin_user);

$admin_user 				= array();
$admin_user["id"]			= $row_admin_user["id"];
$admin_user["user_name"] 	= $row_admin_user["user_name"];
$admin_user["email"] 		= $row_admin_user["email"];
$admin_user["lang"] 		= $_REQUEST["lang"]?$db->quote($_REQUEST["lang"]):$row_admin_user["lang"];
$admin_user["full_name"] 	= $row_admin_user["full_name"];
$admin_user["phone"] 		= $row_admin_user["phone"];
$admin_user["cell"] 		= $row_admin_user["cell"];
$admin_user["last_login"] 	= $row_admin_user["last_login"];
$admin_user["hits"] 		= $row_admin_user["hits"];
$admin_user["sessid"] 		= $sess_id;
$admin_user["menuid"] 		= $_REQUEST["temp"]?$db->quote($_REQUEST["temp"]):"";


if($admin_user["menuid"] == "") { 
	$temp_name = substr($_SERVER["HTTP_REFERER"],  strrpos($_SERVER["HTTP_REFERER"], "/")!==false?strrpos($_SERVER["HTTP_REFERER"], "/")+1:0 );
	$query_menu 	= "SELECT menu_id FROM vw_admin_menu_struct WHERE session_id = '" . $admin_user["sessid"] . "' AND template = '" . $temp_name . "' ORDER BY orderno DESC, created_time ASC";
	$result_menu 	= $db->query($query_menu);
	$row_menu 		= $db->fetch($result_menu);
	$admin_user["menuid"] = $row_menu["menu_id"];
	
} 

$admin_user["right"] 		= array();
$result_temp 				= $db->query("SELECT menu_id, right_id FROM vw_admin_right WHERE session_id = '" . $admin_user["sessid"] . "' AND admin_id = '" . $admin_user["id"] . "' AND menu_id = '" . $admin_user["menuid"] . "'");
while($row_temp	= $db->fetch($result_temp)) {
	$admin_user["right"][$row_temp["right_id"]] = 1;
}

$GLang	= $admin_user["lang"]?$admin_user["lang"]:"cn";
$DLang 	= $CFG["lang_default"]?$CFG["lang_default"]:"cn";

// it will close mysql connection
$words = LANG::getWords($GLang);

/*************************************************************************/
function write_audit($action, $table, $detail, $in_action = 1) {
	global $CFG;
	global $db;
	global $admin_user;

	if( $CFG["admin_session_audit"]==1 ) {
		$browser = new Browser();
		if( $in_action ) {
			if( in_array($action, $CFG["admin_session_action"]) ) {
				$fields = array();
				$fields["filter"] 		= "Admin";
				$fields["admin_id"] 	= $admin_user["id"]?$admin_user["id"]:0;
				$fields["user_name"] 	= $admin_user["user_name"];
				$fields["session_id"] 	= $admin_user["sessid"];

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
			$fields["filter"] 		= "Admin";
			$fields["admin_id"] 	= $admin_user["id"]?$admin_user["id"]:0;
			$fields["user_name"] 	= $admin_user["user_name"];
			$fields["session_id"] 	= $admin_user["sessid"];

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