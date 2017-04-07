<?php
$db_menu        = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
$menu_cols      = array();
$menu_cols[]    = "id";
$menu_cols[]    = "menu_key";
$menu_cols[]    = cLANG::col("title", $GLang);
$menu_cols[]    = cLANG::col("detail", $GLang);
$select_str     = $db_menu->selectCols($menu_cols);
$query_menu     = "SELECT $select_str FROM web_menu1 WHERE deleted<>1 AND status=1";
$result_menu    = $db_menu->query($query_menu);
$rows_menu      = $db_menu->rows($result_menu);
foreach($rows_menu as &$row_mm) {
    $row_mm["title"]    = cLANG::trans($row_mm["title"]);
    $row_mm["detail"]   = cLANG::trans($row_mm["detail"]);
}
//print_r($rows_menu);
$db_menu->close();
?>