<?php
/*********************************************************************************/
/* website authentication :  verify user session is available,  if sesssion invalid,  it redirect to login webpage */
/* this module used to control legal user. and user must has "view" right.  but not verify user other rights: save, update, delete	*/
/*********************************************************************************/
include_once("../include/config/config.php");
include_once($CFG["include_path"] . "/lib/encrypt/encrypt.php");

$cert_server = array();
$cert_server["lwhhost"] 	= $_SERVER['HTTP_HOST'];
$cert_server["lwhagent"] 	= $_SERVER['HTTP_USER_AGENT'];
$cert_server["lwhip"] 		= $_SERVER['REMOTE_ADDR'];
$cert_server["lwhserver"] 	= $_SERVER['SERVER_NAME'];
$cert_server["lwhtoken"]	= $CFG["public_session_token"];
$cert_string 	= json_encode($cert_server);
$cert_encrypt 	= LWHENCRYPT::encrypt($cert_string);
$_SESSION[$_SERVER['HTTP_HOST'] . ".publicsite_secure"] = $cert_encrypt;
?>