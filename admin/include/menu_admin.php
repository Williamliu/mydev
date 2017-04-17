<?php
include("admin_right.php");  // it will redirct to login page
$db_menu = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
$menu_cols      = array();
$menu_cols[]    = "id";
$menu_cols[]    = "icon";
$menu_cols[]    = "menu_key";
$menu_cols[]    = cLANG::col("title", $GLang);
$menu_cols[]    = cLANG::col("detail", $GLang);
$menu_cols[]    = "template";
$menu_cols[]    = "url";
$select_str     = $db_menu->selectCols($menu_cols);
$query_menu1     = "SELECT $select_str FROM web_menu1 WHERE deleted<>1 AND status=1 ORDER BY orderno DESC";
$result_menu1    = $db_menu->query($query_menu1);
$menus          = array();
while( $row_menu1 = $db_menu->fetch($result_menu1) ) {
    if( $user_right[$row_menu1["menu_key"]]["view"] ) {
        $menu1 = array();
        $menu1["id"]        = $row_menu1["id"];
        $menu1["icon"]      = $row_menu1["icon"];
        $menu1["menu_key"]  = $row_menu1["menu_key"];
        $menu1["title"]     = cLANG::trans($row_menu1["title"]);
        $menu1["detail"]    = cLANG::trans($row_menu1["detail"]);
        $menu1["template"]  = $row_menu1["template"];
        $menu1["url"]       = $row_menu1["url"];


        $menu_cols      = array();
        $menu_cols[]    = "id";
        $menu_cols[]    = "icon";
        $menu_cols[]    = "menu_key";
        $menu_cols[]    = cLANG::col("title", $GLang);
        $menu_cols[]    = cLANG::col("detail", $GLang);
        $menu_cols[]    = "template";
        $menu_cols[]    = "url";
        $select_str     = $db_menu->selectCols($menu_cols);
        $query_menu2     = "SELECT $select_str FROM web_menu2 WHERE deleted<>1 AND status=1 AND parent_id='" . $menu1["id"]  . "'";
        $result_menu2    = $db_menu->query($query_menu2);
        while( $row_menu2 = $db_menu->fetch($result_menu2) ) {
            if($user_right[$row_menu2["menu_key"]]["view"]) {                
                $menu2 = array();
                $menu2["id"]        = $row_menu2["id"];
                $menu2["menu_key"]  = $row_menu2["menu_key"];
                $menu2["icon"]      = $row_menu2["icon"];
                $menu2["title"]     = cLANG::trans($row_menu2["title"]);
                $menu2["detail"]    = cLANG::trans($row_menu2["detail"]);
                $menu2["template"]  = $row_menu2["template"];
                $menu2["url"]       = $row_menu2["url"];
                $menu1["menus"][]   = $menu2;
            }
        }
        $menus["menus"][] = $menu1;
    }
}
//echo "<pre>";
//print_r($menus);
//echo "</pre>";
$db_menu->close();
?>