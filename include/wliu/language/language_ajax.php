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

function gwords($keyword, $arr) {
    global $words;
    $ret_word = $words[$keyword];
    if($ret_word) {
        if( is_array($arr) ) {
            foreach($arr as $akey=>$aval) {
                $ret_word = str_replace("{{$akey}}", $aval, $ret_word);
            }
        } else {
            $ret_word = str_replace("{0}", $arr, $ret_word);
        }
        return $ret_word;
    } else {
        $ret_keyword = str_replace(".", " ", $keyword);
        if( is_array($arr) ) {
            foreach($arr as $akey=>$aval) {
                $ret_keyword = str_replace("{{$akey}}", $aval, $ret_keyword);
            }
        } else {
            $ret_keyword = str_replace("{0}", $arr, $ret_keyword);
        }
        return $ret_keyword;
        //return ucwords(strtolower($keyword));
    }
}
?>