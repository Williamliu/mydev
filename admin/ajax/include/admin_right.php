<?php
$db_menu_right = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
/*** Menu Right for User ***/
$user_right         = array(); 
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
e.session_id = '" . $db_menu_right->quote($_SESSION[$_SERVER['HTTP_HOST'] . ".user.session"]) . "' AND  e.status = 1 AND e.deleted = 0
";
$result_menu_right  = $db_menu_right->query($query_menu_right);
while( $rows_menu_right = $db_menu_right->fetch($result_menu_right) ) {
    $user_right[$rows_menu_right["menu_key"]][$rows_menu_right["menu_right"]] = 1;
}

$query_menu_right     = "
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
e.session_id = '" . $db_menu_right->quote($_SESSION[$_SERVER['HTTP_HOST'] . ".user.session"]) . "' AND  e.status = 1 AND e.deleted = 0
";
$result_menu_right  = $db_menu_right->query($query_menu_right);
while( $rows_menu_right = $db_menu_right->fetch($result_menu_right) ) {
    $user_right[$rows_menu_right["menu_key"]][$rows_menu_right["menu_right"]] = 1;
}
foreach($user_right as $menuKey=>$theRight) {
    $user_right[$menuKey]["cancel"] = 1;
    $user_right[$menuKey]["reset"] = 1;
}

$REF_URL            = $_SERVER['HTTP_REFERER'];
$REF_TEMP           = substr(strrchr($REF_URL, "/"), 1);
$result_url         = $db_menu_right->query("SELECT menu_key FROM web_menu1 WHERE status=1 AND deleted=0 AND template='" . $db_menu_right->quote($REF_TEMP) . "'");
$row_url            = $db_menu_right->fetch($result_url);
$current_menu_key   = $row_url["menu_key"]; 

$result_url         = $db_menu_right->query("SELECT menu_key FROM web_menu2 WHERE status=1 AND deleted=0 AND template='" . $db_menu_right->quote($REF_TEMP) . "'");
$row_url            = $db_menu_right->fetch($result_url);
$current_menu_key   = $row_url["menu_key"]?$row_url["menu_key"]:$current_menu_key; 

/*
echo "$current_menu_key<pre>";
print_r($user_right[$current_menu_key]);
echo "</pre>";
echo "<pre>";
print_r($user_right);
echo "</pre>";
*/

//////////////////////////////////////////////////////////////////////////////////////////
$db_menu_right->close();
?>