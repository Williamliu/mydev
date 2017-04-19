<?php
$db_menu_right = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
/*** Menu Right for User ***/
$sess_name  = $_SERVER['HTTP_HOST'] . ".user.session";
$sess_id    = $db_menu_right->quote($_SESSION[$sess_name]);
$menu_url   = $_SERVER["SCRIPT_NAME"]?$_SERVER["SCRIPT_NAME"]:"xxxxxxxx";
$menu_temp  = cTYPE::template($menu_url);
$user_right = array(); 

$query_menu_right   = "
SELECT  DISTINCT
a.id,
a.user_name,
d.menu_key,  
c.menu_id,
c.menu_right
FROM web_admin a 
INNER JOIN web_admin_role b ON (a.id = b.admin_id)
INNER JOIN web_role_menu1 c ON (b.role_id = c.role_id)
INNER JOIN web_menu1 d ON ( c.menu_id = d.id) 
INNER JOIN web_admin_session e ON (a.id = e.admin_id) 
WHERE 
a.deleted=0 AND a.status=1 AND 
d.deleted=0 AND d.status=1 AND 
e.status=1 AND e.deleted=0 AND
e.session_id = '" .  $sess_id . "'

UNION 

SELECT  DISTINCT
a.id,
a.user_name,
d.menu_key,  
c.menu_id,
c.menu_right
FROM web_admin a 
INNER JOIN web_admin_role b ON (a.id = b.admin_id)
INNER JOIN web_role_menu2 c ON (b.role_id = c.role_id)
INNER JOIN web_menu2 d ON ( c.menu_id = d.id) 
INNER JOIN web_admin_session e ON (a.id = e.admin_id) 
WHERE 
a.deleted=0 AND a.status=1 AND 
d.deleted=0 AND d.status=1 AND 
e.status=1 AND e.deleted=0 AND
e.session_id = '" . $sess_id . "'";

$result_menu_right  = $db_menu_right->query($query_menu_right);
while( $rows_menu_right = $db_menu_right->fetch($result_menu_right) ) {
    $user_right[$rows_menu_right["menu_key"]][$rows_menu_right["menu_right"]] = 1;
}

foreach($user_right as $menuKey=>$theRight) {
    $user_right[$menuKey]["cancel"] = 1;
    $user_right[$menuKey]["reset"] = 1;
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

$web_user["rights"]  = $user_right[$web_user["current"]["menu_key"]];
/*
echo "menu right query: " . $query_menu_current . "<br>";
echo "url: $menu_url  template: $menu_temp\n"; 
echo "<pre>";
print_r($web_user);
echo "</pre>";
echo "<pre>";
print_r($user_right);
echo "</pre>";
*/

//////////////////////////////////////////////////////////////////////////////////////////
$db_menu_right->close();
?>