<?php 
include_once("../../include/config/config.php");
include_once($CFG["include_path"] . "/wliu/minifier/jsmin.php");

$js = "";
//Merge jquery
$js .= JSMin::minify(file_get_contents("../jquery/min/jquery-3.2.1.min.js"));
$js .= JSMin::minify(file_get_contents("../jquery/min/jquery.cookie.1.4.1.js"));
$js .= JSMin::minify(file_get_contents("../jquery/min/jquery-ui.js"));


//Merge Bootstrap
$js .= JSMin::minify(file_get_contents("../theme/mdb4.3.1/js/tether.min.js"));
$js .= JSMin::minify(file_get_contents("../theme/bootstrap4.0/js/bootstrap.min.js"));

//Merge Angularjs
$js .= JSMin::minify(file_get_contents("../angularjs/angular-1.3.15/angular.js"));
$js .= JSMin::minify(file_get_contents("../angularjs/angular-1.3.15/angular-cookies.js"));
$js .= JSMin::minify(file_get_contents("../angularjs/angular-1.3.15/angular-sanitize.min.js"));


//Merge js/wliu
$js .= JSMin::minify(file_get_contents("../js/wliu/wliu.common.js"));
$js .= JSMin::minify(file_get_contents("../js/wliu/wliu.table.common.js"));
$js .= JSMin::minify(file_get_contents("../js/wliu/wliu.table.js"));
$js .= JSMin::minify(file_get_contents("../js/wliu/wliu.form.js"));
$js .= JSMin::minify(file_get_contents("../js/wliu/wliu.tree.js"));
$js .= JSMin::minify(file_get_contents("../js/wliu/wliu.file.js"));
$js .= JSMin::minify(file_get_contents("../js/wliu/wliu.image.js"));

//Merge angularjs/wliu
$js .= JSMin::minify(file_get_contents("../angularjs/wliu/wliu.table.js"));
$js .= JSMin::minify(file_get_contents("../angularjs/wliu/wliu.table.filter.js"));
$js .= JSMin::minify(file_get_contents("../angularjs/wliu/wliu.table.form.js"));
$js .= JSMin::minify(file_get_contents("../angularjs/wliu/wliu.table.tree.js"));
$js .= JSMin::minify(file_get_contents("../angularjs/wliu/wliu.table.list.js"));
$js .= JSMin::minify(file_get_contents("../angularjs/wliu/wliu.file.js"));
$js .= JSMin::minify(file_get_contents("../angularjs/wliu/wliu.image.js"));

//Merge JQuery/wliu
$js .= JSMin::minify(file_get_contents("../jquery/wliu/diag/wliu.jquery.diag.js"));
$js .= JSMin::minify(file_get_contents("../jquery/wliu/popup/wliu.jquery.popup.js"));
$js .= JSMin::minify(file_get_contents("../jquery/wliu/load/wliu.jquery.load.js"));
$js .= JSMin::minify(file_get_contents("../jquery/wliu/tree/wliu.jquery.tree.js"));
$js .= JSMin::minify(file_get_contents("../jquery/wliu/tab/wliu.jquery.tab.js"));
$js .= JSMin::minify(file_get_contents("../jquery/wliu/navi/wliu.jquery.navi.js"));

file_put_contents("../js/wliu2.0.js", $js);


// CSS 
$css = "";
// Merge JQuery 
$css .= file_get_contents("../jquery/jquery-ui-1.12.1.custom/jquery-ui.min.css");
$css .= file_get_contents("../theme/bootstrap4.0/css/bootstrap.min.css");
$css .= file_get_contents("../theme/mdb4.3.1/css/mdb.css");

// Merge JQuery/Wliu
$css .= file_get_contents("../jquery/wliu/diag/wliu.jquery.diag.css");
$css .= file_get_contents("../jquery/wliu/popup/wliu.jquery.popup.css");
$css .= file_get_contents("../jquery/wliu/load/wliu.jquery.load.css");
$css .= file_get_contents("../jquery/wliu/tree/wliu.jquery.tree.css");
$css .= file_get_contents("../jquery/wliu/tab/wliu.jquery.tab.css");
$css .= file_get_contents("../jquery/wliu/navi/wliu.jquery.navi.css");

// Merge Common/Wliu
$css .= file_get_contents("../theme/wliu/wliu.buttons.css");
$css .= file_get_contents("../theme/wliu/wliu.common.css");

file_put_contents("../theme/wliu/wliu2.0.css", $css);
?>