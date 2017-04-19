<?php
$db_menu_right = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
/*** Menu Right for User ***/
$sess_name  = $_SERVER['HTTP_HOST'] . ".user.session";
$sess_id    = $db_menu_right->quote($_SESSION[$sess_name]);
$menu_url   = $_SERVER["SCRIPT_NAME"]?$_SERVER["SCRIPT_NAME"]:"xxxxxxxx";
$menu_temp  = cTYPE::template($menu_url);
$user_right = array(); 


// full right
$query_role_right   = "SELECT  a.id FROM web_right a WHERE a.status=1 AND a.deleted=0 ORDER BY orderno DESC";
$result_role_right  = $db_menu_right->query($query_role_right);
$role_right         = array();
while( $rows_role_right = $db_menu_right->fetch($result_role_right) ) {
    $role_right[$rows_role_right["id"]] = 1;
}
$role_right["cancel"] = 1;
$role_right["reset"] = 1;

// all menu grant full right
$query_menu_right   = "
SELECT menu_key FROM web_menu1 WHERE status = 1 AND deleted = 0 ORDER BY orderno DESC
UNION
SELECT menu_key FROM web_menu2 WHERE status = 1 AND deleted = 0 ORDER BY orderno DESC
";
$result_menu_right  = $db_menu_right->query($query_menu_right);
while( $rows_menu_right = $db_menu_right->fetch($result_menu_right) ) {
    $user_right[$rows_menu_right["menu_key"]] = $role_right;
}


$query_menu_current = "
SELECT menu_key, icon, title, template, url FROM 
(
SELECT menu_key, icon, " . cLANG::col("title") . ", template, url FROM web_menu1 
WHERE STATUS=1 AND deleted=0
UNION 
SELECT menu_key, icon, " . cLANG::col("title") . ", template, url FROM web_menu2 
WHERE STATUS=1 AND deleted=0
) a
WHERE 
a.template LIKE  '%" . $menu_temp . "%'
";
if( $db_menu_right->exists($query_menu_current) ) {
    $result_menu_current    = $db_menu_right->query($query_menu_current);
    $row_menu_current       = $db_menu_right->fetch($result_menu_current);

    $web_cur_url      = $row_menu_current["url"]?'href="' . $row_menu_current["url"] .'" target="_blank"':''; 
    $web_cur_url      = $row_menu_current["template"]?'href="' . $row_menu_current["template"] .'"':''; 
    $current_menu = '<a ' . $web_cur_url . ' style="font-weight:bold;">' . $row_menu_current["icon"] . ' ' . $row_menu_current["title"] . '</a>';
    $web_user["current"]["menu_key"]    = $row_menu_current["menu_key"];
    $web_user["current"]["url"]         = $current_menu;
    $web_user["current"]["title"]       = $row_menu_current["title"];
} else {
    $web_user["current"]["menu_key"]    = $menu_temp;
    $web_user["current"]["url"]         = '<a href="' . $_SERVER["REQUEST_URI"] . '" style="font-weight:bold;">' . gwords($menu_temp) . '</a>';
    $web_user["current"]["title"]       = gwords($menu_temp);
}

$web_user["rights"]  = $role_right;

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