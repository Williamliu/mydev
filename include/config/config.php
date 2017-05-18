<?php
date_default_timezone_set('America/Los_Angeles');
$CFG = array();
$CFG["http"]			= "http://";
//$CFG["web_domain"] 	= $CFG["http"] . $_SERVER['HTTP_HOST'] . "";
//$CFG["admin_domain"] 	= $CFG["http"] . $_SERVER['HTTP_HOST'] . "";
$CFG["web_domain"] 		= "http://www.dev.com";
$CFG["admin_domain"] 	= "http://www.admin.com";

$CFG["web_root"] 		= "C:\Projects\mydev";
$CFG["admin_root"] 		= "C:\Projects\mydev";

$CFG["include_path"] 	= $CFG["web_root"] . "/include";
$CFG["report_path"] 	= $CFG["web_root"] . "/reports";
$CFG["upload_path"] 	= "C:\Projects\mydev\uploads";

// debug
$CFG["debug"] = false;

// secure token 
$CFG["secure_token"] 		= "adskfdjskjsdkf23=23ksd?dkljdl^kdfj&dkfdk";
$CFG["secure_timeout"] 		= 8 * 3600; //8 hours
$CFG["secure_login_max"] 	= 3; 		//allow try 5 times for login 
$CFG["secure_lock_timeout"] = 10 * 60; 	// minitues 

$CFG["secure_auth_return"]	= $CFG["admin_domain"] . "/index.php";
$CFG["secure_login_home"]	= $CFG["admin_domain"] . "/web_myaccount.php";
$CFG["secure_not_allow"]	= $CFG["admin_domain"] . "/web_invalid.php";

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
			$CFG["mysql"]["host"] 		= "127.0.0.1";
			$CFG["mysql"]["database"]  	= "wliu_maindb";
			$CFG["mysql"]["user"] 		= "root";
			$CFG["mysql"]["pwd"] 		= "Liu011225";

			$CFG["image"]["host"] 		= "127.0.0.1";
			$CFG["image"]["database"]  	= "wliu_files";
			$CFG["image"]["user"] 		= "root";
			$CFG["image"]["pwd"] 		= "Liu011225";
			break;
}
?>