<?php
$db_menu_right = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
/*** Menu Right for User ***/
$sess_name  = $_SERVER['HTTP_HOST'] . ".user.session";
$sess_id    = $db_menu_right->quote($_SESSION[$sess_name]);
$menu_url   = $_SERVER['HTTP_REFERER']?$_SERVER['HTTP_REFERER']:"xxxxxxxx";
$menu_temp  = cTYPE::template($menu_url);
$user_right = array(); 

/*** Menu Right for User ***/
$query_role_right   = "SELECT  a.id FROM web_right a WHERE a.status=1 AND a.deleted=0 ORDER BY orderno DESC";
$result_role_right  = $db_menu_right->query($query_role_right);
$role_right         = array();
while( $rows_role_right = $db_menu_right->fetch($result_role_right) ) {
    $role_right[$rows_role_right["id"]] = 1;
}
// Add cancel, reset right
$role_right["cancel"]   = 1;
$role_right["reset"]    = 1;

$user_right = $role_right;

/*
echo "url: $menu_url  template: $menu_temp\n"; 
echo "<pre>";
print_r($user_right);
echo "</pre>";
*/
$db_menu_right->close();
?>