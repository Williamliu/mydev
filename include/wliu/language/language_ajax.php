<?php
// $_REQUEST > $_SESSION > $DLang
$langName = "wliu_lang";
$DLang = cLANG::$support[0];
$GLang = $_SESSION[$langName]?$_SESSION[$langName]:$DLang;
$GLang = $_REQUEST["lang"]?$_REQUEST["lang"]:$GLang;
$words = cLANG::getWords($GLang);
/*
echo "name: " . $langName;
echo "<br>";
echo "Lang: " . $_SESSION[$langName];
echo "<br>";
print_r($words);
//we can set place holder to word and replace with new one.
cLANG::replace("Hello {{good}} or {{bad}}", array("good"=>"Well", "bad"=>"Worst"));
*/
function gwords($keyword) {
    global $words;
    return $words[$keyword]?$words[$keyword]:ucwords(strtolower($keyword));
}
?>