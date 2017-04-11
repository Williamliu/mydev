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
//echo "<pre>";
//print_r($user_right);
//echo "</pre>";
//////////////////////////////////////////////////////////////////////////////////////////
$db_menu_right->close();
?>