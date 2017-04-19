<?php
$db_menu_right = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
/*** Menu Right for User ***/
$sess_name  = $_SERVER['HTTP_HOST'] . ".user.session";
$sess_id    = $db_menu_right->quote($_SESSION[$sess_name]);
$menu_url   = $_SERVER['HTTP_REFERER']?$_SERVER['HTTP_REFERER']:"xxxxxxxx";
$menu_temp  = cTYPE::template($menu_url);
$user_right = array(); 

//d.menu_key,   no in use in select
//c.menu_id,    no in use in select
$query_menu_right = "
SELECT  DISTINCT
a.id,
a.user_name,
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
e.session_id = '" . $sess_id . "' AND
d.template LIKE '%" . $menu_temp . "%'

UNION 

SELECT  DISTINCT
a.id,
a.user_name,
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
e.session_id = '" . $sess_id . "' AND
d.template LIKE '%" . $menu_temp . "%'
";

$result_menu_right  = $db_menu_right->query($query_menu_right);
while( $rows_menu_right = $db_menu_right->fetch($result_menu_right) ) {
    $user_right[$rows_menu_right["menu_right"]] = 1;
}
$user_right["cancel"] = 1;
$user_right["reset"] = 1;

/*
echo "menu right query: " . $query_menu_right . "<br>";
echo "url: $menu_url  template: $menu_temp\n"; 
echo "<pre>";
print_r($user_right);
echo "</pre>";
*/
$db_menu_right->close();
?>