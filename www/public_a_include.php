<?php
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/lib/database/database.php");
include_once($CFG["include_path"] . "/lib/language/website_translate.php");
include_once($CFG["include_path"] . "/lib/html/html.php");
$db			= new cMYSQL($CFG["mysql"]["host"], $CFG["mysql"]["user"], $CFG["mysql"]["pwd"], $CFG["mysql"]["database"]);

/*** get user information ***/
$public_session 		= $db->quote( $_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_session"] );
$result_public_user 	= $db->query("SELECT * FROM vw_user_session WHERE session_id = '" . $public_session . "';");
$row_public_user 		= $db->fetch($result_public_user);
$public_user 				= array();
$public_user["id"]			= $row_public_user["id"];
$public_user["user_name"] 	= $row_public_user["user_name"];
$public_user["email"] 		= $row_public_user["email"];
$public_user["anonym"] 		= $row_public_user["anonym"];
$public_user["full_name"] 	= $row_public_user["full_name"];
$public_user["phone"] 		= $row_public_user["phone"];
$public_user["cell"] 		= $row_public_user["cell"];
$public_user["address"] 	= $row_public_user["address"];
$public_user["city"] 		= $row_public_user["city"];
$public_user["state"] 		= $row_public_user["state"];
$public_user["country"] 	= $row_public_user["country"];
$public_user["postal"] 		= $row_public_user["postal"];
$public_user["last_login"] 	= $row_public_user["last_login"];
$public_user["hits"] 		= $row_public_user["hits"];
$public_user["platform"] 	= $row_public_user["platform"];
$public_user["browser"] 	= $row_public_user["browser"];
$public_user["version"] 	= $row_public_user["version"];
$public_user["sessid"] 		= $public_session;
$public_user["group_id"] 	= $row_public_user["group_id"];
$public_user["menukey"] 	= $menuKey;




$public_flag = false;
$temp_name = substr($_SERVER["SCRIPT_NAME"],  strrpos($_SERVER["SCRIPT_NAME"], "/")!==false?strrpos($_SERVER["SCRIPT_NAME"], "/")+1:0 );

if( $menuKey == "" ) { 
	$query_menu 	= "SELECT nodes, menu_id FROM vw_public_menu_struct WHERE template like '%" . $temp_name . "';";
} else {
	$query_menu 	= "SELECT nodes, menu_id FROM vw_public_menu_struct WHERE menu_key = '" . $menuKey . "';";
}
$result_menu 	= $db->query($query_menu);
if( $db->row_nums($result_menu) > 0 ) {
	$row_menu 							= $db->fetch($result_menu);
	$public_user["public"]["menuid"] 	= $row_menu["menu_id"];
	$public_user["public"]["nodes"] 	= $row_menu["nodes"];
	$public_flag 						= true;
}


$public_user["right"] = array();
if($public_flag) {
	$result_temp = $db->query("SELECT id FROM website_right WHERE deleted <> 1 AND status = 1");
	while($row_temp	= $db->fetch($result_temp)) {
		$public_user["right"][$row_temp["id"]] = 1;
	}
} else {

	if( $menuKey == "" ) { 
		$query_menu 	= "SELECT menu_id, nodes FROM vw_user_menu_struct WHERE session_id = '" . $public_user["sessid"] . "' AND user_id = '" . $public_user["id"] . "' AND template LIKE '%" . $temp_name . "' ORDER BY orderno DESC, created_time ASC;";
	} else {
		$query_menu 	= "SELECT menu_id, nodes FROM vw_user_menu_struct WHERE session_id = '" . $public_user["sessid"] . "' AND user_id = '" . $public_user["id"] . "' AND menu_key = '" . $menuKey . "';";
	}

	$result_menu 	= $db->query($query_menu);
	$row_menu 		= $db->fetch($result_menu);
	$public_user["user"]["menuid"] 	= $row_menu["menu_id"];
	$public_user["user"]["nodes"] 	= $row_menu["nodes"];

	$result_temp 				= $db->query("SELECT menu_id, right_id FROM vw_user_right WHERE session_id = '" . $public_user["sessid"] . "' AND user_id = '" . $public_user["id"] . "' AND menu_id = '" . $public_user["user"]["menuid"] . "'");
	while($row_temp	= $db->fetch($result_temp)) {
		$public_user["right"][$row_temp["right_id"]] = 1;
	}
}

/*** make up save and cancel right ***/
$cancel = 0;
$cancel = $public_user["right"]["save"]?1:$cancel;
$cancel = $public_user["right"]["add"]?1:$cancel;
$cancel = $public_user["right"]["delete"]?1:$cancel;
$public_user["right"]["cancel"] = $cancel;
$save 	= 0;
$save = $public_user["right"]["save"]?1:$save;
$save = $public_user["right"]["add"]?1:$save;
$save = $public_user["right"]["delete"]?1:$save;
$public_user["right"]["save"] = $save;
/*************************************/




/*** website language , set to 1 years ***/
$DLang = $CFG["lang_default"]?$CFG["lang_default"]:"cn";
$GLang = $DLang;
$GLang = $_COOKIE["public_lang"]?$_COOKIE["public_lang"]:$GLang;
$GLang = $_REQUEST["lang"]?$_REQUEST["lang"]:$GLang;
if(!in_array($GLang, $CFG["lang"])) $GLang = $CFG["lang_default"]?$CFG["lang_default"]:"cn"; 
setcookie("public_lang","", 1);
setcookie("public_lang", $GLang, time() + 3600 * 24 * 365); 
$public_user["lang"] = $GLang;   // admin lang
$db->query("UPDATE public_user_session SET last_updated = '" . time() . "' WHERE session_id = '" . $public_session . "';");
$db->query("UPDATE public_user SET lang = '" . $GLang . "' WHERE id = '" . $public_user["id"] . "';");

/*** create translation words ***/
$words = LANG::getWords($GLang);

$query_seo 	= "SELECT seo_title, seo_keyword, seo_description, seo_class FROM public_seo WHERE template = '" . $temp_name  . "';";
$seo_result = $db->query($query_seo);
$seo_row 	= $db->fetch($seo_result);

//debug info
if(1==0) {
	echo "<pre>";
	print_r($public_user);
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

<!-- this will be different -->
<link type="text/css" href="<?php echo $CFG["web_domain"]?>/theme/light/main.css" rel="stylesheet" />
<link type="text/css" href="<?php echo $CFG["web_domain"]?>/theme/light/common.css" rel="stylesheet" />
<script language="javascript" type="text/javascript">
	var words = <?php echo json_encode($words); ?>;
	var GLang = '<?php echo $GLang;?>';
	var DLang = '<?php echo $DLang;?>';
	var GSess = '<?php echo $public_session;?>';
	var GSecc = '<?php echo $cert_encrypt;?>';
	var GTemp = '<?php echo $public_user["menuid"];?>';
	var GUserRight = <?php echo json_encode($public_user["right"]); ?>;
</script>

