<?php 
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/minifier/jsmin.php");

$files = glob("js/merge/*.js");
$js = "";
foreach($files as $file) {
    $js .= JSMin::minify(file_get_contents($file));
}
file_put_contents("js/merge/combined.js", $js);
?>