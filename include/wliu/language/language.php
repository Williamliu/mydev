<?php
// $_REQUEST > $_COOKIE > $DLang 
// Set Cookie and Session(for pass to ajax)
$langName = "wliu_lang";
$DLang = cLANG::$support[0];
$GLang = $_COOKIE[$langName]?$_COOKIE[$langName]:$DLang;
$GLang = $_REQUEST["lang"]?$_REQUEST["lang"]:$GLang;
setcookie($langName, $GLang, time() + 3600 * 24 * 365);
$_SESSION[$langName] = $GLang;
$words = cLANG::getWords($GLang);

/*
echo "name: " . $langName;
echo "<br>";
echo "Lang: " . $_COOKIE[$langName];
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
            if($arr!="") $ret_word = str_replace("{0}", $arr, $ret_word);
        }
        return $ret_word;
    } else {
        $ret_keyword = str_replace(".", " ", $keyword);
        if( is_array($arr) ) {
            foreach($arr as $akey=>$aval) {
                $ret_keyword = str_replace("{{$akey}}", $aval, $ret_keyword);
            }
        } else {
            if($arr!="") $ret_keyword = str_replace("{0}", $arr, $ret_keyword);
        }
        return $ret_keyword;
        //return ucwords(strtolower($keyword));
    }
}

$menu_url   = $_SERVER["SCRIPT_NAME"]?$_SERVER["SCRIPT_NAME"]:"xxxxxxxx";
$url_name   = cTYPE::template($menu_url);
?>
<script language="javascript" type="text/javascript">
	var words = <?php echo json_encode($words); ?>;
    var GLang = "<?php echo $GLang; ?>";
    //console.log(words);
    function gwords(keyword, arr) {
        if(words[keyword]) {
            for(var akey in arr) {
               words[keyword] = ('' + words[keyword]).replaceAll("{" + akey + "}", arr[akey]); 
            }
            return words[keyword];
        } else {
            keyword = keyword.replaceAll('[.]', " ");
            for(var akey in arr) {
               keyword = ('' + keyword).replaceAll("{" + akey + "}", arr[akey]); 
            }
            return keyword;
            //return (""+keyword).capital();
        }
    }
    var url_name = "<?php echo $url_name;?>";
</script>