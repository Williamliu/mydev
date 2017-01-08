<?php
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/lib/database/database.php");
include_once($CFG["include_path"] . "/lib/language/website_translate.php");
include_once($CFG["include_path"] . "/lib/html/html.php");
/*** admin user information ***/
$db 				= new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);
$admin_session 		= $db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".adminsite_session"] );

$result_admin_user 	= $db->query("SELECT * FROM vw_admin_session WHERE session_id = '" . $admin_session . "';");
$row_admin_user 	= $db->fetch($result_admin_user);

$admin_user 				= array();
$admin_user["id"]			= $row_admin_user["id"];
$admin_user["user_name"] 	= $row_admin_user["user_name"];
$admin_user["email"] 		= $row_admin_user["email"];
$admin_user["full_name"] 	= $row_admin_user["full_name"];
$admin_user["phone"] 		= $row_admin_user["phone"];
$admin_user["cell"] 		= $row_admin_user["cell"];
$admin_user["last_login"] 	= $row_admin_user["last_login"];
$admin_user["hits"] 		= $row_admin_user["hits"];
$admin_user["platform"] 	= $row_admin_user["platform"];
$admin_user["browser"] 		= $row_admin_user["browser"];
$admin_user["version"] 		= $row_admin_user["version"];
$admin_user["sessid"] 		= $admin_session;
$admin_user["menukey"] 		= $menuKey;

/*** get user right for current webpage ***/
$admin_user["right"] 		= array();
if( $menuKey == "" ) { 
	$temp_name 		= substr($_SERVER["SCRIPT_NAME"],  strrpos($_SERVER["SCRIPT_NAME"], "/")!==false?strrpos($_SERVER["SCRIPT_NAME"], "/")+1:0 );
	$query_temp 	= "SELECT nodes, menu_id, right_id FROM vw_admin_right WHERE session_id = '" . $admin_session . "' AND admin_id = '" . $admin_user["id"] . "' AND template like '%" . $temp_name . "';";
} else {
	$query_temp 	= "SELECT nodes, menu_id, right_id FROM vw_admin_right WHERE session_id = '" . $admin_session . "' AND admin_id = '" . $admin_user["id"] . "' AND menu_key = '" . $menuKey . "';";
}

$result_temp 	= $db->query($query_temp);
while($row_temp	= $db->fetch($result_temp)) {
	$admin_user["menuid"] 	= $row_temp["menu_id"];   // admin current template id
	$admin_user["nodes"] 	= $row_temp["nodes"];   // admin current template id
	$admin_user["right"][$row_temp["nodes"]][$row_temp["right_id"]] = 1;
}
foreach( $admin_user["right"] as $nodes=>$adminRight ) {
	$cancel = 0;
	$cancel = $admin_user["right"][$nodes]["save"]?1:$cancel;
	$cancel = $admin_user["right"][$nodes]["add"]?1:$cancel;
	$cancel = $admin_user["right"][$nodes]["delete"]?1:$cancel;
	$admin_user["right"][$nodes]["cancel"] = $cancel;
	$save 	= 0;
	$save = $admin_user["right"][$nodes]["save"]?1:$save;
	$save = $admin_user["right"][$nodes]["add"]?1:$save;
	$save = $admin_user["right"][$nodes]["delete"]?1:$save;
	$admin_user["right"][$nodes]["save"] = $save;
}

/*** website language , set to 1 years ***/
$DLang = $CFG["lang_default"]?$CFG["lang_default"]:"cn";
$GLang = $_COOKIE["admin_lang"]?$_COOKIE["admin_lang"]:$DLang;
$GLang = $_REQUEST["lang"]?$_REQUEST["lang"]:$GLang;
if(!in_array($GLang, $CFG["lang"])) $GLang = $CFG["lang_default"]?$CFG["lang_default"]:"cn"; 
setcookie("admin_lang","", 1);
setcookie("admin_lang", $GLang, time() + 3600 * 24 * 365); 
$admin_user["lang"] = $GLang;   // admin lang
$db->query("UPDATE website_admin_session SET last_updated = '" . time() . "' WHERE session_id = '" . $admin_session . "';");
$db->query("UPDATE website_admin SET lang = '" . $GLang . "' WHERE id = '" . $admin_user["id"] . "';");

/*** create translation words ***/
$words = LANG::getWords($GLang);

if( $admin_user["nodes"] ) 
	$query_seo 	= "SELECT seo_title, seo_keyword, seo_description, seo_class FROM website_menu WHERE id = '" . $admin_user["menuid"] . "';";
else 
	$query_seo 	= "SELECT seo_title, seo_keyword, seo_description, seo_class FROM website_template WHERE id = '" . $admin_user["menuid"] . "';";

$seo_result = $db->query($query_seo);
$seo_row 	= $db->fetch($seo_result);

//debug info
if(1==0) {
	echo "<pre>";
	print_r($admin_user);
	echo "</pre>";
}
?>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="copyright" content="Copyright William Software Inc., All Rights Reserved." />
<meta name="description" content="<?php echo $seo_row["seo_description"];?>" />
<meta name="keywords" content="<?php echo $seo_row["seo_keyword"];?>" />
<meta name="rating" content="general" />
<meta name="language" content="English" />
<meta name="robots" content="index" />
<meta name="revisit-after" content="1 days" />
<meta name="classification" content="<?php echo $seo_row["seo_class"];?>" />
<link rel="shortcut icon" type="image/x-icon" href="images/education.ico" />
<link rel="icon" type="image/gif" href="bodhi.gif" />

<title><?php echo $seo_row["seo_title"];?></title>

<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/min/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="<?php echo $CFG["web_domain"]?>/jquery/min/jquery-ui-1.8.21.custom.min.js"></script>
<link type="text/css" 		 href="<?php echo $CFG["web_domain"]?>/jquery/theme/light/jquery-ui-1.8.21.custom.css" rel="stylesheet" />

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.common.js"></script>

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.loading.js"></script>
<link 	type="text/css" 		href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.loading.css" rel="stylesheet" />

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.menu.js"></script>
<link 	type="text/css" 	   href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.menu.css" rel="stylesheet" />

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/jquery/myplugin/jquery.lwh.divbox.js"></script>
<link 	type="text/css" 		href="<?php echo $CFG["web_domain"]?>/jquery/myplugin/css/light/jquery.lwh.divbox.css" rel="stylesheet" />

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular.js"></script>
<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular-cookies.js"></script>
<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/angular-1.3.15/angular-sanitize.min.js"></script>

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.common.js"></script>
<link type="text/css" href="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/css/light/angular.wmliu.common.css" rel="stylesheet" />

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/angularjs/myAngularjs/angular.wmliu.search.js"></script>

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.common.js"></script>

<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.col.js"></script>
<script type="text/javascript" 	src="<?php echo $CFG["web_domain"]?>/js/js.lwh.form.js"></script>

<link type="text/css" href="<?php echo $CFG["admin_domain"]?>/theme/light/main.css" rel="stylesheet" />
<link type="text/css" href="<?php echo $CFG["admin_domain"]?>/theme/light/common.css" rel="stylesheet" />

<script language="javascript" type="text/javascript">
	var words = <?php echo json_encode($words); ?>;
	var DLang = '<?php echo $DLang;?>';
	var GLang = '<?php echo $GLang;?>';
	var GSess = '<?php echo $admin_session;?>';
	var GSecc = '<?php echo $cert_encrypt;?>';
	var GTemp = '<?php echo $admin_user["menuid"];?>';
	var GUserRight = <?php echo json_encode($admin_user["right"][$admin_user["nodes"]]); ?>;
</script>

