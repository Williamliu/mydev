<?php
date_default_timezone_set('America/Los_Angeles');
$CFG = array();
$CFG["http"]			= "http://";
//$CFG["web_domain"] 		= $CFG["http"] . $_SERVER['HTTP_HOST'] . "";
//$CFG["admin_domain"] 	= $CFG["http"] . $_SERVER['HTTP_HOST'] . "";
$CFG["web_domain"] 		= "http://www.dev.com";
$CFG["admin_domain"] 	= "http://www.admin.com";

$CFG["web_root"] 		= "D:\Software\WilliamLiu\Tech_Books\mydev";
$CFG["admin_root"] 		= "D:\Software\WilliamLiu\Tech_Books\mydev";

$CFG["include_path"] 	= $CFG["web_root"] . "/include";
$CFG["report_path"] 	= $CFG["web_root"] . "/reports";
$CFG["upload_path"] 	= "D:\Software\WilliamLiu\Tech_Books\mydev\uploads";


// Theme and   use the theme folder name for Array key.
$CFG["lang_default"] 	= "cn";

$CFG["lang"]["cn"] 		= "cn";
$CFG["lang"]["tw"] 		= "tw";
$CFG["lang"]["en"] 		= "en";

$CFG["theme_default"] 	= "blue";
$CFG["theme"]["blue"] 	= "Blue";

// debug
$CFG["debug"] = false;

//user auth
$CFG["admin_session_timeout"] 	= 3600 * 8; 
$CFG["admin_login_webpage"] 	= $CFG["admin_domain"] . "/index.php"; 
$CFG["admin_welcome_webpage"] 	= $CFG["admin_domain"] . "/website_myaccount.php"; 
$CFG["admin_guest_webpage"] 	= $CFG["admin_domain"] . "/website_welcome.php"; 


$CFG["public_userlock_timeout"] = 300; 
$CFG["public_session_timeout"] 	= 3600 * 8; 
$CFG["public_login_webpage"] 	= $CFG["web_domain"] . "/index.php"; 
$CFG["public_welcome_webpage"] 	= $CFG["web_domain"] . "/mycenter.php"; 
$CFG["public_guest_webpage"] 	= $CFG["web_domain"] . "/index.php"; 


// important , don't miss
$CFG["admin_session_audit"] 	= 1; 
$CFG["admin_session_token"]		= "adskfdjskjsdkf23=23ksd?dkljdl^kdfj&dkfdk";
$CFG["admin_session_action"] 	= array("save", "delete", "add"); 
$CFG["admin_login_count"] 		= 5; 

// important , don't miss
$CFG["public_session_audit"] 	= 1; 
$CFG["public_session_token"]	= "adskfdjskjsdkf23=23ksd?dukjdl^kdfj&dkfdk";
$CFG["public_session_action"] 	= array("save", "delete", "add"); 
$CFG["public_login_count"] 		= 5; 

// image and file download template
$CFG["image_download_template"] = "/func/imgdownload.php";
$CFG["file_download_template"] = "/func/filedownload.php";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//    MySQL Connection Information 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
define("PRODUCTION", "production");
define("BETA", "beta");

define("ENVIR", PRODUCTION);
switch(ENVIR) {
	case BETA:
			$CFG["mysql"]["host"] 		= "";
			$CFG["mysql"]["database"]  	= "";
			$CFG["mysql"]["user"] 		= "";
			$CFG["mysql"]["pwd"] 		= "";

			$CFG["image"]["host"] 		= "";
			$CFG["image"]["database"]  	= "";
			$CFG["image"]["user"] 		= "";
			$CFG["image"]["pwd"] 		= "";
			break;

	case PRODUCTION:
			$CFG["mysql"]["host"] 		= "localhost";
			$CFG["mysql"]["database"]  	= "wliu_maindb";
			$CFG["mysql"]["user"] 		= "root";
			$CFG["mysql"]["pwd"] 		= "Liu011225";

			$CFG["image"]["host"] 		= "localhost";
			$CFG["image"]["database"]  	= "wliu_files";
			$CFG["image"]["user"] 		= "root";
			$CFG["image"]["pwd"] 		= "Liu011225";
			break;
}
?>