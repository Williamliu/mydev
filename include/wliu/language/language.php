<?php
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
?>
<script language="javascript" type="text/javascript">
	var words = <?php echo json_encode($words); ?>;
    //console.log(words);
</script>