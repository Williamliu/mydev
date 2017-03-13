<?php
ini_set("display_errors", 0);
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/database/database.php");
$db = new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
$a = "(001)604-629.8668, ext 198";
$b = $db->phone("phone", "LIKE", $a);
echo "a = $a<br>";
echo "b = $b<br>";
?>