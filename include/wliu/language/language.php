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
function gwords($keyword) {
    global $words;
    return $words[$keyword]?$words[$keyword]:ucwords(strtolower($keyword));
}
?>
<script language="javascript" type="text/javascript">
	var words = <?php echo json_encode($words); ?>;
    var GLang = "<?php echo $GLang; ?>";
    //console.log(words);
    function gwords(keyword) {
        return words[keyword]?words[keyword]:(""+keyword).capital();
    }
</script>