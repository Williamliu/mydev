<?php
$db_menu_right = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);

/*** Menu Right for User ***/
$query_role_right   = "SELECT  a.id FROM web_right a WHERE a.status=1 AND a.deleted=0 ORDER BY orderno DESC";
$result_role_right  = $db_menu_right->query($query_role_right);
$role_right         = array();
while( $rows_role_right = $db_menu_right->fetch($result_role_right) ) {
    $role_right[$rows_role_right["id"]] = 1;
}


$user_right         = array(); 
$query_menu_right   = "SELECT a.menu_key FROM web_menu1 a WHERE a.status = 1 AND a.deleted = 0 ORDER BY orderno DESC";
$result_menu_right  = $db_menu_right->query($query_menu_right);
while( $rows_menu_right = $db_menu_right->fetch($result_menu_right) ) {
    $user_right[$rows_menu_right["menu_key"]] = $role_right;
}

$query_menu_right   = "SELECT a.menu_key FROM web_menu2 a WHERE a.status = 1 AND a.deleted = 0 ORDER BY orderno DESC";
$result_menu_right  = $db_menu_right->query($query_menu_right);
while( $rows_menu_right = $db_menu_right->fetch($result_menu_right) ) {
    $user_right[$rows_menu_right["menu_key"]] = $role_right;
}
foreach($user_right as $menuKey=>$theRight) {
    $user_right[$menuKey]["cancel"] = 1;
    $user_right[$menuKey]["reset"] = 1;
}



$REF_URL            = $_SERVER["SCRIPT_NAME"];
$REF_TEMP           = substr(strrchr($REF_URL, "/"), 1);
$result_url         = $db_menu_right->query("SELECT menu_key FROM web_menu1 WHERE status=1 AND deleted=0 AND template='" . $db_menu_right->quote($REF_TEMP) . "'");
$row_url            = $db_menu_right->fetch($result_url);
$current_menu_key   = $row_url["menu_key"]; 
// menu2 is high priority
$result_url         = $db_menu_right->query("SELECT menu_key FROM web_menu2 WHERE status=1 AND deleted=0 AND template='" . $db_menu_right->quote($REF_TEMP) . "'");
$row_url            = $db_menu_right->fetch($result_url);
$current_menu_key   = $row_url["menu_key"]?$row_url["menu_key"]:$current_menu_key; 
$current_menu_key   = $current_menu_key?$current_menu_key:"full_right"; 
// even  menu not exists
$user_right[$current_menu_key] = $role_right;

$web_user["right"]  = $user_right[$current_menu_key];
/*
echo "$current_menu_key<pre>";
print_r($web_user);
echo "</pre>";
echo "<pre>";
print_r($user_right);
echo "</pre>";
*/
//////////////////////////////////////////////////////////////////////////////////////////
$db_menu_right->close();
?>